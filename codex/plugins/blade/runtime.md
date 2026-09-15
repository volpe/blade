# Blade on Codex

Use this adapter with the shared Blade playbook. Keep the working directory on the user's project, not the Blade installation. Read that project's instructions before acting. `$ARGUMENTS` in a playbook means the user's request, not a shell variable; `/blade-*` references name workflows, not shell commands. Codex users invoke `$blade`, `$blade-build`, `$blade-team`, and the other installed skills, or select their names from the skill picker.

## Agents and communication

Use the collaboration tools actually exposed in this session. The common operations are spawn, send a message, give follow-up work, inspect status, wait, and interrupt/close. Read the tool schema before calling; do not copy another host's tool names or arguments. Pass the resolved runtime, shared workflow, relevant role template, task-specific charter, project/context, assignment, and peer IDs to each worker. Choose expertise from the task; use the generic expert card when no template fits. The charter defines purpose, viewpoint, key questions, expected evidence, and decision boundaries. Role cards are prompts for real spawned workers; installing a skill does not register a new native agent type.

Where peers can message each other, send concise questions/findings directly and copy the coordinator on decisions or blockers. Where only parent-child messages are available, have the coordinator relay the actual messages with sender and recipient identified. If delegation is unavailable, ordinary Blade commands can run on the main agent; team mode must report the limitation instead of fabricating workers or independent sign-offs.

Honor actual concurrency limits and preserve an independent reviewer. Reuse a worker for a later role only with an explicit assignment and ownership record. Do not replace a task's subagents with new sidebar tasks unless the user requested separate tasks. Inherit the active model and reasoning settings unless the user or project explicitly selects others.

## Files, tools, and integrations

- One writer per shared checkout, including test and polish edits. Readers can run concurrently. Create isolated worktrees only for independently assigned writers; tell every worker its actual working directory. Codex delegation does not automatically isolate files.
- Use available file, shell, browser, and connector tools. Linear is optional and requires an existing configured connection. Without it, continue local work and report proposed updates without claiming they happened.
- Use a configured GitHub connector or authenticated `gh`. Read state before remote writes. Follow the shared approval contract, including any existing authorization. Do not post reviews/replies to people without explicit authorization.
- Agents inherit host permissions. Role instructions do not enforce a sandbox or override the user's approval settings. Do not edit global settings or install dependencies merely to start a Blade workflow.

## Ship and release

For tend, create a dedicated worktree from the verified PR head and keep the main checkout untouched. Inspect the actual head repository/remote; fork PRs may not use `origin`. A detached-worktree push needs an approved, explicit destination: `HEAD:refs/heads/<verified-head-branch>`. Do not reset an existing branch or silently force-push. Preserve uncommitted work; remove a worktree only after its work is accounted for, without forcing deletion.

Use native waits for active agents and bounded polling for remote CI/reviews. A Blade prompt does not create an unattended watcher. When the user requests continued monitoring, use the available scheduler with the agreed boundary and report if none exists. Team mode preserves its guided stage checkpoints or recorded autonomous boundary. Tend never merges; release verifies current checks/sign-offs and acts only within merge authority.

Documentation basis: [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) and [plugins](https://learn.chatgpt.com/docs/build-plugins). Verify the current session's tools rather than assuming identical APIs across Codex versions.
