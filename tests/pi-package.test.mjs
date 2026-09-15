import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, resolve, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { root, hosts, frontmatter, generate } from '../scripts/build.mjs';

const read = path => readFileSync(path, 'utf8');
const commands = readdirSync(resolve(root, 'skills')).filter(name => existsSync(resolve(root, 'skills', name, 'SKILL.md'))).sort();
const roles = readdirSync(resolve(root, 'team/roles')).filter(name => name.endsWith('.md')).sort();
function walk(directory) {
  return readdirSync(directory).flatMap(name => {
    const path = resolve(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const [host, path] of Object.entries(hosts)) {
  test(`${host} package relocates with all workflow and role references intact`, () => {
    const temporary = mkdtempSync(resolve(tmpdir(), 'blade-package-'));
    const copy = resolve(temporary, 'blade');
    try {
      cpSync(resolve(root, path), copy, { recursive: true });
      assert.deepEqual(readdirSync(resolve(copy, 'team/roles')).sort(), roles);
      for (const command of commands) assert.ok(existsSync(resolve(copy, host === 'claude' ? 'playbooks' : 'skills', command, 'SKILL.md')));
      for (const file of walk(copy).filter(file => file.endsWith('.md'))) {
        const content = read(file);
        const targets = [
          ...[...content.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]),
          ...[...content.matchAll(/`((?:\.\.\/|\.\/)[^`\s<>]*\.md)`/g)].map(match => match[1]),
        ];
        for (const target of targets) {
          if (target.includes('://') || target.startsWith('#')) continue;
          const destination = resolve(dirname(file), target.split('#')[0]);
          assert.ok(destination.startsWith(`${copy}${sep}`), `${relative(copy, file)} escapes package: ${target}`);
          assert.ok(existsSync(destination), `${relative(copy, file)} has missing reference: ${target}`);
        }
      }
    } finally { rmSync(temporary, { recursive: true, force: true }); }
  });
}

test('every pi command forwards arguments through a closed route table', () => {
  const packageRoot = resolve(root, hosts.pi);
  const prompts = readdirSync(resolve(packageRoot, 'prompts')).sort();
  assert.deepEqual(prompts, commands.map(name => `${name}.md`).sort());
  const router = read(resolve(packageRoot, 'skills/blade-workflow/SKILL.md'));
  const routes = [...router.matchAll(/^\| ([a-z-]+) \| \[([^\]]+)\]\(([^)]+)\) \|$/gm)];
  assert.deepEqual(routes.map(match => match[1]).sort(), commands.filter(name => name !== 'blade').map(name => name.slice(6)).sort());
  for (const [, verb, name, target] of routes) {
    assert.equal(name, `blade-${verb}`);
    assert.equal(resolve(packageRoot, 'skills/blade-workflow', target), resolve(packageRoot, 'skills', name, 'SKILL.md'));
  }
  for (const name of commands) {
    const prompt = read(resolve(packageRoot, 'prompts', `${name}.md`));
    assert.equal(prompt.match(/\$ARGUMENTS/g)?.length, 1, `${name} loses or duplicates arguments`);
    assert.ok(prompt.includes('blade-workflow'), `${name} bypasses adapter`);
  }
});

test('pi manifests expose only the adapter skill and one team extension', () => {
  const manifest = JSON.parse(read(resolve(root, hosts.pi, 'package.json')));
  assert.deepEqual(manifest.pi, {
    prompts: ['./prompts'], skills: ['./skills/blade-workflow'], extensions: ['./extensions/blade-team/index.ts']
  });
  for (const paths of Object.values(manifest.pi)) for (const path of paths) assert.ok(existsSync(resolve(root, hosts.pi, path)));
  const legacy = JSON.parse(read(resolve(root, 'package.json')));
  for (const paths of Object.values(legacy.pi)) for (const path of paths) assert.ok(existsSync(resolve(root, path)));
});

test('Codex and Grok discover the same skills and real role sources', () => {
  const codex = JSON.parse(read(resolve(root, hosts.codex, '.codex-plugin/plugin.json')));
  const grok = JSON.parse(read(resolve(root, hosts.grok, '.grok-plugin/plugin.json')));
  assert.equal(codex.name, 'blade'); assert.equal(grok.name, 'blade');
  assert.equal(codex.version, grok.version);
  const marketplace = JSON.parse(read(resolve(root, 'codex/.agents/plugins/marketplace.json')));
  const plugin = marketplace.plugins.find(plugin => plugin.name === codex.name);
  assert.equal(resolve(root, 'codex', plugin.source.path), resolve(root, hosts.codex));
  assert.ok(plugin.policy.installation); assert.ok(plugin.policy.authentication);
  for (const name of commands) {
    const document = read(resolve(root, hosts.codex, 'skills', name, 'SKILL.md'));
    assert.equal(frontmatter(document).name, name);
    assert.ok(!document.slice(0, document.indexOf('\n---', 4)).includes('disable-model-invocation'));
  }
  for (const role of roles) {
    const registered = frontmatter(read(resolve(root, hosts.grok, 'agents', role)));
    assert.equal(`${registered.name}.md`, role);
    assert.ok(registered.body.includes(`../team/roles/${role}`));
  }
});

test('Claude marketplace resolves a self-contained plugin with shared skills and custom expert templates', () => {
  const packageRoot = resolve(root, hosts.claude);
  const manifest = JSON.parse(read(resolve(packageRoot, '.claude-plugin/plugin.json')));
  assert.equal(manifest.name, 'blade');
  assert.equal(manifest.version, JSON.parse(read(resolve(root, 'adapters/claude/plugin.json'))).version);
  const marketplace = JSON.parse(read(resolve(root, 'claude/.claude-plugin/marketplace.json')));
  assert.ok(marketplace.owner.name);
  const entry = marketplace.plugins.find(plugin => plugin.name === manifest.name);
  assert.equal(resolve(root, 'claude', entry.source), packageRoot);
  const shortNames = commands.map(name => name === 'blade' ? 'help' : name.slice(6));
  const publicSkills = readdirSync(resolve(packageRoot, 'skills')).filter(name => existsSync(resolve(packageRoot, 'skills', name, 'SKILL.md'))).sort();
  assert.deepEqual(publicSkills, shortNames.sort());
  for (const name of commands) {
    const source = frontmatter(read(resolve(root, 'skills', name, 'SKILL.md')));
    const canonical = frontmatter(read(resolve(packageRoot, 'playbooks', name, 'SKILL.md')));
    assert.equal(canonical.body, source.body, 'Shared playbook behavior must remain intact.');
    assert.equal(canonical.explicit, source.explicit);
    const shortName = name === 'blade' ? 'help' : name.slice(6);
    const entry = frontmatter(read(resolve(packageRoot, 'skills', shortName, 'SKILL.md')));
    assert.equal(entry.name, shortName);
    assert.equal(entry.explicit, source.explicit, 'Short commands retain the intended invocation policy.');
    const target = entry.body.match(/\]\(([^)]+)\)/)[1];
    assert.equal(resolve(packageRoot, 'skills', shortName, target), resolve(packageRoot, 'playbooks', name, 'SKILL.md'));
    assert.equal(entry.body.match(/\$ARGUMENTS/g)?.length, 1, 'Forward the full request exactly once.');
  }
  const sharedAgents = readdirSync(resolve(root, 'agents')).filter(name => name.endsWith('.md'));
  assert.deepEqual(readdirSync(resolve(packageRoot, 'agents')).sort(), [...roles, ...sharedAgents].sort());
  for (const role of roles) {
    const card = frontmatter(read(resolve(packageRoot, 'agents', role)));
    assert.equal(`${card.name}.md`, role);
    assert.ok(card.body.includes(`../team/roles/${role}`));
  }
  for (const name of ['.mcp.json', 'settings.json', 'hooks', 'extensions', 'package.json']) {
    assert.equal(existsSync(resolve(packageRoot, name)), false, `Unexpected host configuration or runtime dependency: ${name}`);
  }
});

test('Claude read-only templates exclude execution and writes; other experts cannot delegate recursively', () => {
  const packageRoot = resolve(root, hosts.claude);
  const readers = ['scout', 'critic', 'product-manager', 'architect', 'ux-principal', 'code-reviewer', 'releaser', 'team-steward'];
  for (const filename of readdirSync(resolve(packageRoot, 'agents'))) {
    const content = read(resolve(packageRoot, 'agents', filename));
    const header = content.match(/^---\n([\s\S]*?)\n---/)[1];
    const name = frontmatter(content).name;
    assert.equal(/^(model|permissionMode|hooks|mcpServers):/m.test(header), false);
    if (readers.includes(name)) {
      const tools = header.match(/^tools: (.*)$/m)[1].split(',').map(value => value.trim());
      assert.ok(tools.includes('Read'));
      assert.ok(tools.includes('SendMessage'));
      for (const tool of ['Bash', 'PowerShell', 'Edit', 'Write', 'NotebookEdit', 'Agent', 'Task', 'Skill']) assert.equal(tools.includes(tool), false);
    } else {
      assert.match(header, /^disallowedTools: Agent$/m);
      assert.equal(/^tools:/m.test(header), false, 'Production experts must inherit the host tool pool.');
    }
  }
});

test('building is deterministic and emitted files match the current sources', () => {
  const first = generate();
  assert.deepEqual([...first], [...generate()]);
  for (const [path, content] of first) assert.equal(read(resolve(root, path)), content, `Stale generated file: ${path}`);
});
