# Blade on pi

This package supplies `/blade-*` prompt entry points, a runtime skill, shared playbooks, and a real team extension. Run `/blade-team <request>` to use the team workflow. These are separate pi conversation sessions connected by mailboxes; the extension does not simulate a dialogue in one prompt.

Use the host's configured model and thinking level. Do not change providers, defaults, credentials, or project configuration. Load the requested playbook from this package's `skills/` and follow [the team workflow](team/workflow.md) for team work. Role cards live in `team/roles/`. These paths are relative to this package, not the target project's current directory.

## Runtime contract

| Operation | Tool | Behavior |
|---|---|---|
| Start | `blade_team_start` | Start one independent session with `id`, task-specific `role`, required `charter`, bounded `task`, and explicit `ownership`; optional `roleTemplate` selects a starting card. |
| Message | `blade_team_send` | Send to a member id or `lead`. Busy members receive steering after the current tool batch; idle members start a new turn in their existing context. |
| Inspect | `blade_team_status` | Return members, latest results, errors, and events after an optional `after` sequence cursor. |
| Wait | `blade_team_wait` | Wait for a change after `after`, for at most `timeoutMs` (default 30,000; maximum 60,000). |
| Stop | `blade_team_stop` | Stop and dispose `id`, or all members when `id` is omitted. |

Only the lead can start, stop, or wait for members. Children receive the message and status tools, so peer communication is direct. A message to the lead appears in the transcript and the next lead context; it does **not** trigger an unattended lead turn. Use the wait tool while supervising active work. A running task is distinct from an idle member whose latest result is ready. Errors and cleanup failures are never passes.

The role is a lowercase slug such as `database-integrity` or `research-methods-reviewer`, not a closed roster. The charter contains `purpose`, `viewpoint`, `keyQuestions` (non-empty list), `expectedEvidence` (non-empty list), and `decisionBoundary`. Every expert needs one, including existing role names. An omitted template uses the matching built-in role name, or the generic `expert` card for a custom specialty. An explicit template can specialize an existing role, e.g. `role: "postgres-engineer", roleTemplate: "coder"`. Status includes the role, template, and charter so teammates can find responsibility owners.

Provide the approved brief, acceptance criteria, relevant decisions, and file references when starting a member: children inherit the active system instructions and role/workflow cards, not the lead's conversation history. Preserve decisions, acceptance evidence, current revision, and sign-offs in the project's run record before stopping a member. Do not claim an unavailable role completed a review.

## Scheduling and ownership

The default maximum is **four resident child sessions**, including idle members. Start only the specialists useful for the current stage. Stop idle members after recording their results and assign later roles in the freed slots. Member ids are unique until a successful stop-all resets the team; use a fresh id when restarting a role. Each member has a 15-minute lifetime and a 40-turn limit; the lead may specify `lifetimeMinutes` from 1–60 or `maxTurns` from 1–100. The team allows at most 200 messages before the lead must stop/reset it. Wait calls, session creation, and stop attempts are bounded.

Members default to read-only tools. `writable: true` grants the sole child writer lease; it is available to the generic Expert, Coder, Coder Pair, Tester, Polisher, and Documenter templates. A custom title alone grants no tools. Read-only template restrictions remain; use the generic template for non-code production and explicit ownership for any writer. An expert assigned independent review must remain a non-author. A writer also requires `directBuiltins: true`: the lead explicitly acknowledges that execution through plain built-ins is appropriate without the parent's extension hooks or custom shell settings. This selects an execution capability; it adds no user approval gate and grants no release/publication authority. If parent hooks are required, keep execution in the main session. The lead must also stop editing while a child holds this lease. The assigned ownership remains binding even though the runtime does not enforce individual file paths. No background processes: keep shell commands and tests bounded.

When pairing is useful, Coder drives while Pair reads the current diff, messages advice, and asks for checkpoints. Tester can define tests and inspect evidence concurrently, but shell execution or edits require the writer lease or a request to the current writer/lead. A handoff means recording progress, stopping the old driver, then starting the new driver with that progress. Idle writers retain their lease. The runtime prevents simultaneous child writers even when start calls overlap. A cleanup timeout retains the writer lease and reports `stop_failed`; do not continue writing until the remaining work is known to have stopped.

Stop all children before a guided approval pause, after delivery, or when cancelling work. The host's shutdown/reload/session-replacement hook also stops them. Interrupting the lead aborts the team. The Steward runs only at a milestone or after delivery and proposes changes for user approval. No agent or background scheduler runs continuously.

## Host inheritance and limits

Verified against **pi 0.85.1 (`@earendil-works/pi-coding-agent`)**, with Node 22.19 or later. pi's loader supplies `typebox`, `@earendil-works/pi-ai`, and the coding-agent SDK; this extension needs no separate dependency install. Older pi builds and the former package namespace are not verified.

The child snapshots the active model and thinking level. Authentication resolves through the parent model registry on each request, preserving runtime keys, configured provider behavior, and OAuth handling without copying credentials to files. Settings, model catalogs, and child transcripts stay in memory. Stopping, reloading, or leaving the host session discards child contexts; durable team memory is the project run record. Normal provider usage charges still apply when the team actually runs.

Child tools are a subset of the parent's **active original built-in tools**. Read-only members receive available `read`, `grep`, `find`, and `ls`; the writer may also receive available `bash`, `powershell`, `edit`, and `write`. Missing tools remain missing. An active override of a requested built-in causes startup to fail rather than silently substituting an unrestricted tool.

**Arbitrary parent custom tools and extension event hooks are not cloned.** pi's extension API exposes tool metadata but no supported parent-tool execution bridge. If your project relies on extension permission gates, a sandbox hook, custom tools, or special shell configuration, keep execution in the main session and use read-only teammates for planning/review; do not grant a child writer lease until its direct built-in execution is appropriate. The one-writer rule is coordination, not a filesystem security boundary. External publication and merges remain actions for the authorized lead after the team's release gate.

No live model run is part of package verification. Controller tests cover actual mailbox routing with fake sessions, steering and resumption, ownership, limits, errors, and cleanup. An optional installed-pi loader smoke checks that all five tools register without making a provider request. A supervised feature trial is still required to evaluate team quality.

Primary API references: [pi SDK](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md), [pi extensions](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md).
