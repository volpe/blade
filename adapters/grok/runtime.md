# Grok runtime adapter

Translate the invoked Blade playbook into the Grok tools actually available. Loading this adapter does not activate team mode, add roles, or add approval checkpoints to an ordinary command. Preserve that playbook's scope and existing authorization.

Apply the common team contract, role cards, pairing cycle, and team checkpoints only when `blade-team` is active, including delegated assignments from that workflow. In team mode the root session coordinates; specialists return work to it. Resolve package and project paths from the loaded skill and assignment, not from an assumed Blade checkout.

## Capability check

Inspect the tools and agent types actually available in this session. When the playbook calls for delegation, use an applicable registered `blade:<role-name>` type if present; for a matching template; for custom specialties use registered `blade:expert` when present, otherwise a general-purpose child. Give it the task-specific role name and full charter (purpose, viewpoint, questions, evidence, decision boundary). Registered types are templates, not the allowed expertise roster. Do not invent a `blade:<custom-specialty>` type. Report unavailable delegation honestly. Keep the session's model and permission settings unless the user authorizes changes.

Grok's documented messaging is root-to-owned-child. Children cannot create their own agents or send native messages to siblings. Use **coordinator relay**: return a question/finding addressed to the intended peer; the coordinator sends that content to the real destination agent and returns its actual response. Do not fabricate peer conversations or call a child-only role change an independent reviewer. [Subagent contract](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/16-subagents.md)

## Runtime operations

Use the live tool schema if the host exposes aliases or a newer contract.

| Operation | Verified interface | Blade behavior |
|---|---|---|
| Delegate | `spawn_subagent`: `prompt`, `description`, `subagent_type`, `background`, `isolation`, `resume_from`, `cwd` | Give one bounded assignment, current candidate, paths, ownership, peer questions, and a stop condition. Use `background: true` for useful parallel work. |
| Message | `send_subagent_message`: required `subagent_id`, `text`; optional `queue` | Root relays to its owned child. Default steers; `queue: true` requests a later turn. Inspect the returned outcome; accepted is not proof the work was completed. |
| Collect/wait | `get_command_or_subagent_output`: `task_ids`, optional `timeout_ms` | Use returned IDs. Zero/omitted timeout gives a snapshot; positive timeout waits, and multiple IDs wait for all. Prefer bounded waits of at most 60 seconds. |
| Continue | `spawn_subagent` with `resume_from` | Resume a completed child of the same type and session with new instructions. Reconcile the current candidate before acting on inherited context. |

Sources: [message schema](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-tools/src/implementations/grok_build/send_subagent_message.rs), [output/wait implementation](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-tools/src/implementations/grok_build/task_output/mod.rs). The installed 1.0.25 tool description also advertises messaging an inactive child to resume its identity; published documentation describes active children only. Use that convenience only when the live tool contract supports it and confirms acceptance. Otherwise use documented `resume_from`; do not retry an uncertain message blindly.

## Team pairing and scheduling

When software pairing is useful in active team mode, assign Coder a coherent slice that ends at a navigation checkpoint. Relay its actual diff, questions, and failures to Pair; return Pair's findings before starting dependent changes. Tester can investigate alongside them. A child ends its bounded turn to hand work back; do not invent a peer inbox or make it wait indefinitely for a message it cannot receive directly.

Use one writer per checkout, including tests and polish. For parallel writers, `isolation: worktree` creates a separate checkout; do not combine it with `cwd`. A resumed child retains its source directory. Record the returned worktree path and integrate deliberately with the host's exposed integration tools or ordinary git, then verify the combined candidate. Worktrees persist after sessions and do not isolate services or ports. Do not invent callable tools from the documented `x.ai/git/worktree/*` protocol namespace. [Worktrees](https://docs.x.ai/build/features/worktrees)

Schedule against actual host capacity and keep a non-author available for formal review. Track real agent IDs, role reassignments, current revisions, and handoffs in the delivery record. Completion, suspension, and cancellation are different states; a wait timeout alone is no reason to cancel work.

## Approval boundaries

For ordinary commands, follow the invoked playbook and the user's existing authorization without adding team checkpoints. In active team mode, keep guided checkpoints at applicable scope, design/approach, delivery, and release stages; honor an existing grant through a named stage and its permitted external actions. Root presents reviewable results and consolidates user questions; specialist requests never grant push, reply, merge, or deployment permission. The coordinator reviews team effectiveness and can assign Steward for independent process review; reusable instruction changes require approval. This adapter creates no unattended monitor and grants no automatic prompt editing or release authority.

## Project integrations

Use the project's configured Linear/GitHub connector or authenticated CLI when the requested action is supported and authorized; inspect available tools rather than inventing commands. If an integration is unavailable, continue permitted repository investigation, implementation, and local drafts. Record the external action still needed; do not fabricate a ticket, PR, comment, or status update. In team mode keep the delivery record local until its external destination is available and writing there is authorized.
