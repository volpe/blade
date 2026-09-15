# Blade on Claude Code

Run in the user's project or work context. Load that project's `CLAUDE.md`, linked `AGENTS.md` or team profile, and the invoked playbook. Blade uses Claude Code's skills and native subagents; ordinary commands do not activate the team workflow or add team checkpoints.

## Invocation and package paths

Claude supplies the `/blade:` plugin namespace. Public skills are named `help`, `build`, `team`, and the other verbs, producing `/blade:help`, `/blade:build <request>`, and `/blade:team <request>`. The same form applies to project, card, plan, debug, review, polish, test, ship, and release. Each short entrypoint reads its canonical playbook with the supplied request. Shared references such as `blade-ship` are internal playbook names; resolve them to this package's `playbooks/` directory rather than recursively executing slash commands. The internal files are not additional public skills. `$ARGUMENTS` means the supplied request. Preserve it and use current conversation context when it is empty. When showing help, display the short `/blade:<verb>` invocation names.

Resolve resource links relative to the loaded file, not the project working directory. The coordinator gives each worker the actual absolute package root, runtime, workflow, relevant card, and project/workspace paths. Installed plugins may live in a cache. Do not assume a source-checkout path or write into the installed plugin to create a task-specific role.

## Select and brief real experts

In team mode follow [the workflow](team/workflow.md) and [expert selection](team/expert-selection.md). Use the discovered `blade:<template>` subagent for a suitable existing role, or `blade:expert` with a task-specific specialty and charter. If a registered type is unavailable, use an available general-purpose subagent with the full instructions. Never invent a native type such as `blade:database-integrity` just because that is the desired specialty.

The charter defines purpose, viewpoint, key questions, expected evidence, and decision boundaries. The brief also supplies the scope/criteria, sources, current candidate, ownership/write permission, real peers, message route, completion condition, and external authority. Ordinary subagents start with separate context; do not assume they have read the coordinator's conversation or invoked skills. Workers route requests for more expertise to the coordinator; they do not start their own team.

## Delegation and communication

Inspect the running host's tool schemas and report the real mode once. Prefer bounded ordinary subagents for the selected assignments. Use the native `Agent` tool (or the available equivalent on older releases); preserve actual agent IDs returned by the host. Do not copy Codex, Grok, or Pi tool calls into Claude Code.

Current releases support `SendMessage` for named subagents and continuation. Use direct peer messages only when both peers have the capability and their real addresses are known. Otherwise the coordinator relays the sender's actual question or finding to the actual recipient and returns the response. On older releases use only the continuation/resume mechanism the live schema exposes. A new agent instance is a new identity, even when its specialty has the same name. A completed summary is a handoff, not proof of active pairing.

For useful pairing, exchange the next slice or interface before dependent edits and the actual candidate, changed paths, and checks at each handoff. Use bounded native waits/output collection; do not fabricate completion after a timeout or cancel merely because work is still running. Honor host capacity and the user's budget, reserve a non-author for independent review, and reconcile resumed work with current artifacts.

If the user has already enabled experimental Claude Code Agent Teams and that mode is useful, use its actual teammate messaging and lifecycle tools. Ordinary Blade team runs do not require Agent Teams. Do not silently enable its environment flag or change settings. Feature availability and interactive versus non-interactive sessions affect this mode; do not assume a CLI validation or `-p` run proves teammate operation. Shut down actual teammates and account for their work before cleanup. Without delegation, disclose the missing team capability and do useful authorized local preparation without imaginary specialist verdicts.

## Ownership and permissions

One writer owns a shared workspace at a time, including the coordinator's record updates, test changes, and polish. This is a coordination contract, not a runtime-enforced lease. Concurrent writers require actual isolated workspaces, explicit ownership, and an integration owner. Use native worktree isolation only when supported and appropriate to repository work. Record returned paths; services, ports, and databases need separate isolation. Verify the integrated candidate and preserve unfinished work before cleanup.

The generated Scout, Critic, Product Manager, Architect, UX Principal, Code Reviewer, Releaser, and Team Steward definitions allow only available reading, search, web-research, and messaging tools. They ask the coordinator/current writer for shell checks, diffs, or other unavailable capabilities; a missing tool is an evidence gap. The other templates inherit the host's available tools, with nested delegation disabled; a generic expert assigned review must still remain a non-author. Tool access never grants write ownership or external-action authority.

Preserve the user's configured model, reasoning, permissions, hooks, and integrations. Definitions do not set model or permission-mode overrides. Never enable bypass permissions, add credentials, or start extra services to make a workflow appear operational. Use configured connectors or authenticated CLI access only within the user's authority; route unavailable external actions back to the coordinator.

## Delivery, release, and stopping

Keep the shared applicable checkpoints or the user's recorded autonomous boundary. The main session consolidates user decisions and performs authorized publication/release actions after current acceptance, verification, and independent review. Internal sign-offs do not satisfy required human approvals. For repository publication use `blade-ship`; for merge use `blade-release`; for non-code work use the actual artifact handoff and publication process. New work invalidates affected evidence and verdicts.

At a pause or completion, collect results and stop outstanding work using actual host capabilities; distinguish idle, stopped, failed, and completed workers. Save charters, decisions, and evidence in the run record. Installing Blade starts no background monitor. Steward's reusable instruction proposals still require approval.

Primary references: [plugins](https://code.claude.com/docs/en/plugins), [subagents](https://code.claude.com/docs/en/sub-agents), and [Agent Teams](https://code.claude.com/docs/en/agent-teams). Check the actual runtime when an API differs; package validation alone does not establish live collaboration quality.
