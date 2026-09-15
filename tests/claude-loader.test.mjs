import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { root, hosts } from '../scripts/build.mjs';

// Opt-in native check. No model calls; settings and plugin installs stay in a
// temporary CLAUDE_CONFIG_DIR, not the user's normal Claude configuration.
test('native Claude validates, installs, and discovers the complete Blade plugin', {
  skip: !process.env.CLAUDE_CLI && 'Set CLAUDE_CLI to a Claude Code executable with plugin validate/details support.',
}, () => {
  const temporary = mkdtempSync(join(tmpdir(), 'blade-claude-loader-'));
  const run = args => execFileSync(process.env.CLAUDE_CLI, args, {
    cwd: temporary, encoding: 'utf8', timeout: 30_000,
    env: { ...process.env, CLAUDE_CONFIG_DIR: join(temporary, 'config'),
      DISABLE_AUTOUPDATER: '1', CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1' },
  });
  try {
    const packageRoot = resolve(root, hosts.claude);
    for (const target of [packageRoot, resolve(root, 'claude/.claude-plugin/marketplace.json')]) {
      const result = JSON.parse(run(['plugin', 'validate', target, '--strict', '--json']));
      assert.equal(result.success, true);
      assert.deepEqual(result.manifest.errors, []);
      assert.deepEqual(result.manifest.warnings, []);
    }
    run(['plugin', 'marketplace', 'add', resolve(root, 'claude')]);
    run(['plugin', 'install', 'blade@blade', '--scope', 'user']);
    const inventory = run(['plugin', 'details', 'blade@blade']);
    // The native loader, not our builder, must discover every component after caching.
    for (const [label, directory] of [['Skills', 'skills'], ['Agents', 'agents']]) {
      const names = readdirSync(join(packageRoot, directory))
        .filter(name => directory !== 'skills' || existsSync(join(packageRoot, directory, name, 'SKILL.md')))
        .map(name => name.replace(/\.md$/, '')).sort();
      const match = inventory.match(new RegExp(`^\\s+${label} \\((\\d+)\\)\\s+([^\\n]+)`, 'm'));
      assert.ok(match, `Missing ${label} in native inventory:\n${inventory}`);
      assert.equal(Number(match[1]), names.length);
      assert.deepEqual(match[2].split(',').map(name => name.trim()).sort(), names);
      if (label === 'Skills') {
        assert.ok(names.includes('team'));
        assert.ok(names.includes('help'));
        assert.equal(names.some(name => name.startsWith('blade')), false, 'Claude adds the blade namespace itself.');
      }
    }
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
