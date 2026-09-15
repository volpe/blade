import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const hosts = { codex: 'codex/plugins/blade', pi: 'pi/blade', grok: 'grok/blade', claude: 'claude/blade' };
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const claudeReadOnly = new Set(['scout', 'critic', 'product-manager', 'architect', 'ux-principal', 'code-reviewer', 'releaser', 'team-steward']);

function claudeAgent(card, body) {
  const permissions = claudeReadOnly.has(card.name)
    ? 'tools: Read, Glob, Grep, WebFetch, WebSearch, SendMessage\n'
    : 'disallowedTools: Agent\n';
  return `---\nname: ${card.name}\ndescription: ${JSON.stringify(card.description)}\n${permissions}---\n${body}`;
}

function claudeSkill(name, content) {
  const card = frontmatter(content);
  const shortName = name === 'blade' ? 'help' : name.slice(6);
  const header = content.slice(0, content.length - card.body.length);
  // Shared playbooks live outside Claude's public skills directory so the
  // plugin namespace is applied only to these short entrypoint names.
  const entry = `${header.replace(/^name: .+$/m, `name: ${shortName}`)}\nRead [the ${name} playbook](../../playbooks/${name}/SKILL.md) completely and follow it for the request below. Resolve its relative links from the playbook's directory. Read the file directly; do not invoke another slash command. Use the current conversation when the request is empty.\n\nRequest:\n$ARGUMENTS\n`;
  return { shortName, entry };
}

function files(path) {
  return readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error(`Package sources must be real files: ${entry.name}`);
    const child = resolve(path, entry.name);
    return entry.isDirectory() ? files(child) : [child];
  });
}

export function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error('Missing YAML frontmatter');
  const header = match[1];
  const name = header.match(/^name: (.+)$/m)?.[1];
  const description = header.match(/^description: ([\s\S]*?)(?=^\S|$(?![\s\S]))/m)?.[1];
  // Sources use plain or folded descriptions; reject unsupported shapes explicitly.
  if (!name || !description) throw new Error('Skill needs name and description');
  const summary = description.replace(/^[>|][-+]?\s*\n/, '').trim().replace(/\s+/g, ' ');
  return { name, description: summary, explicit: /^disable-model-invocation: true$/m.test(header), body: text.slice(match[0].length) };
}

function prompt(name) {
  const verb = name === 'blade' ? null : name.slice(6);
  return `---\ndescription: ${name === 'blade' ? 'Route a Blade workflow or show help' : `Run the Blade ${verb} workflow`}\nargument-hint: "[request]"\n---\nUse the \`blade-workflow\` skill. Locate it in the available skills and read its\nSKILL.md completely before acting. If it is unavailable, stop and ask the user\nto enable the Blade package's supporting skill and run \`/reload\`.\n\n${verb ? `Follow its pi compatibility rules and run the \`${verb}\` playbook.` : 'Follow its pi compatibility rules and route the request by its first word.\nEmpty input or `help` shows the command table without running a workflow.'}\nUse the current project and conversation when the request is empty.\n\nRequest:\n$ARGUMENTS\n`;
}

function piRouter(commands, prefix) {
  return `---\nname: blade-workflow\ndescription: Run requested Blade product-engineering commands and the Blade team in pi. Use for /blade, /blade-team, or a Blade verb; not unrelated work.\n---\n# Blade for pi\n\nRead [the pi adapter](${prefix}runtime.md) and [the shared hub](${prefix}skills/blade/SKILL.md) completely before acting. Paths resolve from this file, not from the user's project. Stay in the user's project.\n\nUse the verb selected by the prompt. For the hub, strip the first word from the request and select its exact row below. Empty input or help shows the command table; unknown verbs show valid choices and request clarification. Never construct a path from an arbitrary argument. Read the selected playbook completely, using the rest of the request as its arguments. An empty direct command uses conversation/project context. Follow the pi compatibility rules in the adapter; workflow names are not recursive slash-command execution.\n\n| Verb | Playbook |\n|---|---|\n${commands.filter(x => x !== 'blade').map(x => `| ${x.slice(6)} | [${x}](${prefix}skills/${x}/SKILL.md) |`).join('\n')}\n`;
}

export function generate() {
  const result = new Map();
  const commands = readdirSync(resolve(root, 'skills')).filter(name => existsSync(resolve(root, 'skills', name, 'SKILL.md'))).sort();
  const version = JSON.parse(read('package.json')).version;
  const add = (path, content) => result.set(path, content);
  for (const [host, destination] of Object.entries(hosts)) {
    for (const sourceDir of ['skills', 'agents', 'team']) {
      for (const path of files(resolve(root, sourceDir))) {
        const local = relative(root, path).split(sep).join('/');
        let content = readFileSync(path, 'utf8');
        if (host === 'claude' && local.endsWith('/SKILL.md')) {
          const skill = claudeSkill(frontmatter(content).name, content);
          add(`${destination}/skills/${skill.shortName}/SKILL.md`, skill.entry);
        }
        if (host === 'codex' && local.endsWith('/SKILL.md')) {
          const parsed = frontmatter(content);
          content = `---\nname: ${parsed.name}\ndescription: ${JSON.stringify(parsed.description)}\n---\n${parsed.body}`;
          add(`${destination}/${dirname(local)}/agents/openai.yaml`, `interface:\n  display_name: ${JSON.stringify(parsed.name)}\n  short_description: ${JSON.stringify(parsed.description.slice(0, 100))}\n${parsed.explicit ? 'policy:\n  allow_implicit_invocation: false\n' : ''}`);
        }
        if (host === 'claude' && sourceDir === 'agents') {
          const card = frontmatter(content);
          content = claudeAgent(card, card.body);
        }
        if (host === 'claude') content = content.replaceAll('../skills/', '../playbooks/');
        const packagedPath = host === 'claude' ? local.replace(/^skills\//, 'playbooks/') : local;
        add(`${destination}/${packagedPath}`, content);
      }
    }
    add(`${destination}/runtime.md`, read(`adapters/${host}/runtime.md`));
    add(`${destination}/README.md`, `# Blade for ${host}\n\nGenerated from the shared Blade workflows. Edit the source checkout and run \`npm run build\`; do not edit this package directly.\n\nRead [runtime capabilities](runtime.md), [team workflow](team/workflow.md), and [project profile](team/project-profile.md).\n`);
    if (host === 'codex') {
      add(`${destination}/.codex-plugin/plugin.json`, json({ ...JSON.parse(read('adapters/codex/plugin.json')), version }));
    } else if (host === 'grok' || host === 'claude') {
      const manifest = host === 'grok' ? '.grok-plugin/plugin.json' : 'adapters/claude/plugin.json';
      const metadata = JSON.parse(read(manifest));
      add(`${destination}/.${host}-plugin/plugin.json`, json({ ...metadata, version: host === 'claude' ? metadata.version : version }));
      for (const rolePath of files(resolve(root, 'team/roles'))) {
        const card = frontmatter(readFileSync(rolePath, 'utf8'));
        const body = `Read the canonical role card supplied by the coordinator before acting.\nFallback: [${card.name}](../team/roles/${card.name}.md), relative to this agent definition.\nThe coordinator must supply the resolved absolute role-card path and package root in the assignment. Resolve further references relative to the canonical card, not project cwd. If its location is unclear, return that missing-context issue to the coordinator.\n`;
        add(`${destination}/agents/${card.name}.md`, host === 'claude' ? claudeAgent(card, body) : `---\nname: ${card.name}\ndescription: ${JSON.stringify(card.description)}\n---\n${body}`);
      }
    } else {
      for (const name of commands) add(`${destination}/prompts/${name}.md`, prompt(name));
      add(`${destination}/skills/blade-workflow/SKILL.md`, piRouter(commands, '../../'));
      for (const path of files(resolve(root, 'adapters/pi/extensions'))) {
        add(`${destination}/${relative(resolve(root, 'adapters/pi'), path).split(sep).join('/')}`, readFileSync(path, 'utf8'));
      }
      add(`${destination}/package.json`, json({
        name: 'blade', version, private: true,
        description: 'Blade workflows and task-specific expert teams for pi.',
        keywords: ['pi-package', 'engineering', 'team'],
        engines: { node: '>=22.19.0' },
        files: ['prompts', 'skills', 'agents', 'team', 'extensions', 'runtime.md', 'README.md'],
        pi: { prompts: ['./prompts'], skills: ['./skills/blade-workflow'], extensions: ['./extensions/blade-team/index.ts'] }
      }));
    }
  }
  add('claude/.claude-plugin/marketplace.json', read('adapters/claude/marketplace.json'));
  // Existing pi root installs remain usable, now with the same team runtime.
  for (const name of commands) add(`prompts/${name}.md`, prompt(name));
  add('pi/skills/blade-workflow/SKILL.md', piRouter(commands, '../../blade/'));
  add('runtime.md', '# Blade source checkout\n\nThis root remains the legacy Grok install. Read [the Grok adapter](adapters/grok/runtime.md) before a shared playbook. For Codex, pi, or Claude Code, use their dedicated package entrypoints; do not infer the runtime from model names.\n');
  return result;
}

export function build({ check = false } = {}) {
  const expected = generate();
  const indexPath = '.blade-generated.json';
  const prior = existsSync(resolve(root, indexPath)) ? JSON.parse(read(indexPath)) : [];
  expected.set(indexPath, json([...expected.keys()].sort()));
  const stale = prior.filter(path => !expected.has(path));
  const changed = [...expected].filter(([path, content]) => !existsSync(resolve(root, path)) || read(path) !== content);
  if (check) {
    if (changed.length || stale.length) throw new Error(`Generated packages are stale. Run npm run build.\n${[...changed.map(([p]) => p), ...stale].join('\n')}`);
    return expected.size;
  }
  for (const path of stale) {
    const absolute = resolve(root, path);
    if (!absolute.startsWith(`${root}${sep}`)) throw new Error(`Unsafe generated path: ${path}`);
    if (existsSync(absolute)) unlinkSync(absolute);
  }
  for (const [path, content] of changed) {
    mkdirSync(dirname(resolve(root, path)), { recursive: true });
    writeFileSync(resolve(root, path), content);
  }
  return expected.size;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(`${process.argv.includes('--check') ? 'Verified' : 'Built'} ${build({ check: process.argv.includes('--check') })} generated files.`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
