---
name: blade-build
description: "Implement a change from a ticket, approved plan, or freeform request. Use for /blade-build. Parallel scouts when touch points are unclear; implement serially on the main checkout (main thread or one subagent)."
---

# /blade-build

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

Prefer the **smallest correct change** for the approved work (code shape, not a smaller product).

## Steps

1. **Load intent** — If the thread has an approved plan, implement **those phases**. A Linear ticket is context and status writes, not a license to expand or recut. Else Linear ticket if present; else `$ARGUMENTS`.
2. **If no plan and work is multi-area/unclear** — research and prepare a concrete `blade-plan`; obtain only unresolved material decisions before building.
3. **Touch points unclear?** — parallel scouts using `../../agents/scout.md` for the legs you need, then implement. Skip if the plan already lists files. **Budget delta:** skip scouts or use one.
4. **Implement**
   - **Small / clear:** main thread. Match local patterns; add/adjust tests with the change.
   - **Large or fat context:** **one** implementation agent supported by the runtime with a **self-contained brief** (goal, files, constraints, verify command). Avoid unnecessary per-phase formal review; team mode retains active Pair checkpoints.
   - Multi-area plans: one implementer walks areas in order (or parent sequences serial subagents). Shared config/lock/generated files always single-owner.
5. **Verify** — run the plan’s verify command, or the smallest meaningful check. Cite command + result.
6. **Linear** — if ticket known: set started/In Progress if still backlog (team’s real state name); comment briefly on what landed (optional if commit message will cover it at ship).

End standalone build at local verification. Continue to `blade-ship` when already requested/authorized; team mode follows its next stage.

## Output

**Done / Blocked / Needs you** + files touched + verify evidence + next action (`/blade-review` or `/blade-ship`).
