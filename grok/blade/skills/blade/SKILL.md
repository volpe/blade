---
name: blade
description: >
  Lightweight product-engineering workflow hub. Route Blade requests to
  project, card, plan, build, debug, review, polish, test, ship, release,
  or the opt-in team of task-specific experts.
argument-hint: "[project|card|plan|build|debug|review|polish|test|ship|release|team|help] [args…]"
disable-model-invocation: true
---

# Blade

**Load runtime:** read `../../runtime.md` from this skill's directory if present. It defines invocation, delegation, messaging, waiting, and worktree mechanics for this host. If absent, inspect available capabilities; do not invent tool names or imply unsupported team operation.

Route the first word of the supplied request (`$ARGUMENTS` where supported):

| Verb | Skill | Purpose |
|---|---|---|
| `project` | `blade-project` | Initiative → project + cards |
| `card` | `blade-card` | One issue |
| `plan` | `blade-plan` | Research + plan in chat |
| `build` | `blade-build` | Implement |
| `debug` | `blade-debug` | Hypothesis → fix |
| `review` | `blade-review` | Critic on the diff |
| `polish` | `blade-polish` | Structure, craft, finish |
| `test` | `blade-test` | Smallest meaningful checks |
| `ship` | `blade-ship` | Commit → preflight → PR → tend |
| `release` | `blade-release` | Merge + issue completion |
| `team` | `blade-team` | Task-specific experts with defined purposes and viewpoints |
| empty / `help` | — | Print this table and the host's invocation form |

Strip the verb and read `../blade-<verb>/SKILL.md`. Host command syntax is in runtime.md; these skill names are portable workflow identifiers.

## Shared spine (all Blade verbs)

Direct skill invocation loads this spine once. Team runs additionally load `../../team/workflow.md`; that workflow applies to the requested domain, including non-code work; its staffing, delivery record, checkpoints, and evidence-driven polish replace the lightweight defaults below.

### Intent and connected services

- Follow the full request and existing project instructions. Read a referenced ticket first when the configured issue connector is available. Do not silently reduce scope.
- Use the project's configured tracker. Linear remains the default integration when available; do not create a second connection or invent provider APIs. GitHub examples use authenticated `gh` when installed; an equivalent available connector is fine.
- Resolve actual issue states, labels, and repository settings before changing them. Write only what happened.
- If a connector is unavailable, continue independent local work, disclose the gap, and provide the proposed tracker/PR change. Missing tools are not a successful write.

### Authorization

Carry forward the user's existing authorization. Prepare the concrete result before seeking any missing approval. Ask only for a new decision or action outside that authority; do not ask twice for an already approved step.

Push, PR creation/updates, merge, completed issue status, deployment, and branch cleanup require authority covering that action. Posting comments or replies to people requires explicit authorization. Routine local edits, checks, and in-scope tracker updates can proceed under the request's authority. Never bypass repository protections or force-push a shared/protected branch. A feature-branch rebase and lease-protected push need authority covering history rewriting.

### Right-size the work

| Size | Lightweight default |
|---|---|
| Typo / obvious fix | Implement directly |
| Coherent, clear change | Short plan or none; one writer |
| Multi-area, unclear, or risky | Research and concrete plan; resolve material decisions before building |

Chat-only plans by default. Create durable planning files only when requested or in team mode. Phases organize the whole goal; required slices do not become optional because the goal is large.

### Delegation

Use real available agents for bounded independent work. Read-only research can run concurrently when it saves time or context. Avoid duplicate missions. For lightweight commands, do not spawn for pure issue prose/status or a simple edit already understood; an explicitly invoked team run retains its independent-review requirement.

| Assignment | Shared instructions |
|---|---|
| Locate or trace one research leg | `../../agents/scout.md` |
| Implementation | Self-contained goal, files, constraints, checks; one writer per checkout |
| Review | `../../agents/critic.md` |
| CI/review fixes | `../blade-ship/references/tend.md` + host isolation mechanics |

The runtime maps prompt cards to real host agents. Observe its capacity and model defaults. If delegation is unavailable, do the eligible lightweight work locally and disclose the limitation. Local self-review is never an independent team sign-off. Use real peer messaging when available, explicit coordinator relay when only parent/child messaging exists; never fabricate exchanges.

For budget-constrained or no-spawn requests, reduce fan-out and optional ceremony. Honor the user's no-spawn instruction; disclose any resulting independent-review gap in team mode.

### Ownership and resume

One writer per shared checkout, including tests and polish. Readers may run concurrently. Parallel writers require isolated workspaces, assigned ownership, and an integration owner; separately account for shared services/ports. Preserve existing user changes.

Lightweight durable context is chat plus the existing issue/PR. Team mode keeps one compact delivery record. Resume by reconciling that context with current files, git status, recent commits, and actual PR state. Agent memory, task IDs, and worktrees are not assumed to survive a session.

### Output

End with **Done** (result and evidence), **Blocked** (gap and what's needed), or **Needs you** (concrete decision), plus one next action. Do not claim checks, specialist approvals, external writes, or monitoring that did not happen.
