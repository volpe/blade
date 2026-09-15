# Validation

Blade packages the same twelve workflows, expert-selection guide, eleven reusable role templates, and generic expert card for four hosts. Team composition is task-specific; the cards are not a mandatory roster.

## Claude Code adapter — 2026-09-15

- The generated `claude/blade/` plugin exposes twelve short skill names, including `team`, `build`, and `help`; Claude supplies the `/blade:` namespace. The shared playbooks and their references live internally under `playbooks/`. The package also contains fourteen agent definitions (including the generic expert and Scout/Critic rubrics), shared team resources, and a Claude-specific runtime. The generated local marketplace resolves `./blade` inside `claude/`.
- **Claude Code 2.1.272** passed strict native plugin and marketplace manifest validation with no warnings. This CLI returned an empty `contents` array, so that result alone is not treated as validation of every Markdown file.
- The native loader discovered all **12 skills and 14 agents**, both through `--plugin-dir` and after marketplace installation into an isolated temporary `CLAUDE_CONFIG_DIR`. No model request was sent and the normal user configuration was not changed.
- All **29 tests passed** with the native Claude check and installed-Pi SDK checks enabled. Package tests cover relocation, shared skill contents, template registration, read-only tool access, absence of unsolicited host configuration, and deterministic generation.
- An independent read-only implementation review and instruction-based scenarios (ordinary subagents investigating slow tenant queries; a restricted Critic reviewing an actual candidate via coordinator-supplied diff/checks) found no actionable issues. These are not a live Claude delivery or Agent Teams trial.

## Adaptive expert update — 2026-09-15

- `npm run build` regenerated all three host packages; the generation/relocation checks cover the selection guide, generic expert card, and pi role resolver.
- All **25 tests passed**, including the installed-pi SDK loader/session checks using the locally available SDK. The new checks cover arbitrary specialties, safe template resolution, mandatory charter fields, writer-capability rules, custom expert prompts, and read-only versus writer tool sets. No provider request was sent.
- The generated Codex `blade-team` skill and plugin passed the official validators. Canonical source frontmatter retains Grok's `argument-hint`; validate the normalized Codex output with Codex's validator. Both generated and root Grok plugins passed `grok plugin validate`.
- An independent agent forward-tested the instructions against a board brief, an online tenant-data migration, and a one-sentence correction, then introduced duplicate survey responses and a disputed causal claim. These were hypothetical staffing/charter outputs, not executed deliveries. The small-edit delegation exception was clarified; the hub and host descriptions were aligned with task-specific expertise.
- An independent read-only implementation review found no actionable functional regressions in expert selection, charter propagation, writer gating, or packaging. Live team quality and customer outcomes remain unverified.

## Checks

- Reproducible generation: `npm run build`, then `npm run check` detects stale packaged output.
- Package relocation: each host bundle is copied to a temporary directory; referenced workflows, roles, and runtime files must stay inside that bundle and exist.
- Discovery/routing: Codex/Grok/Claude manifests, the Codex and Claude marketplace sources, pi manifests, command argument forwarding, and the closed verb route table are checked.
- Codex: the official plugin validator and skill validator pass for the generated plugin and its twelve skills. The pi adapter skill also passes the skill validator.
- Grok: `grok plugin validate grok/blade` and the root compatibility plugin pass with Grok 1.0.25.
- Claude Code: optional `CLAUDE_CLI` checks run native strict manifest validation and a local marketplace install/discovery test in a temporary configuration. No credentials or model calls are required; use a CLI with `plugin validate --json --strict` and `plugin details` support.
- Pi: mailbox/lifecycle tests use independent fake sessions to exercise busy/idle delivery, queue races, writer ownership, limits, errors, interruption, and cleanup.
- Installed pi 0.85.1: optional SDK tests load the generated extension and construct separate in-memory sessions with a fake provider. They verify tool registration, packaged instruction paths, model settings, and authentication routing without sending a model request.

Run the portable suite:

```sh
npm test
```

To include installed-pi SDK checks, point `PI_SDK_ROOT` at an installed `@earendil-works/pi-coding-agent` package directory:

```sh
PI_SDK_ROOT=/path/to/node_modules/@earendil-works/pi-coding-agent npm test
```

Those SDK checks are explicitly skipped if the package is unavailable. They do not install dependencies or contact a model provider.

To include the native Claude check, set `CLAUDE_CLI` to your Claude Code executable:

```sh
CLAUDE_CLI=/path/to/claude npm test
```

Set both variables to include both host checks. The Claude check is explicitly skipped when `CLAUDE_CLI` is absent; it does not download a CLI. It installs only the local Blade package into a fresh temporary configuration and removes that configuration afterwards.

## Limits

These checks establish package structure and the pi runtime's behavior against controlled sessions. They do not prove model judgment, coding quality, or every future host version. No full feature was developed by a newly installed Blade team, no live provider call was made by the pi tests, and no PR was opened or merged for validation. A supervised feature trial is the next useful evaluation.

Codex/Grok/Claude use host-provided delegation. Grok's peer exchange is a coordinator relay. Pi provides direct peer messages, but does not clone arbitrary parent extension tools or permission hooks; read its [runtime contract](../pi/blade/runtime.md) before enabling child execution. Its built-in writer mode requires an explicit capability acknowledgement. Role prompts do not create a sandbox or a continuously running service.

The implementation was independently reviewed for shared workflow behavior and pi messaging/lifecycle issues; identified authentication and restart issues were corrected and covered by focused checks.
