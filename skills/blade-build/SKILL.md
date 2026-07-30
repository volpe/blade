---
name: blade-build
description: >
  Implement a change from a ticket, approved plan, or freeform request.
  Use for /blade-build. Parallel scouts when touch points are unclear;
  implement serially on the main checkout (main thread or one subagent).
argument-hint: "[ticket id | plan cue | freeform]"
disable-model-invocation: true
---

# /blade-build

Request: **$ARGUMENTS**

Apply the **blade spine**. Prefer the **smallest correct change**.

## Steps

1. **Load intent** — Linear ticket if present; approved plan from thread; else `$ARGUMENTS`.
2. **If no plan and work is multi-area/unclear** — stop and run `/blade-plan` first (or say so and ask).
3. **Touch points unclear?** — parallel `scout`s for the legs you need, then implement. Skip if the plan already lists files. **Budget mode:** skip scouts or use one.
4. **Implement** (writers **serial** — never parallel implementers on the shared checkout)
   - **Small / clear:** main thread. Match local patterns; add/adjust tests with the change.
   - **Large or fat context:** **one** `general-purpose` with a **self-contained brief** (goal, files, constraints, verify command). No per-phase reviewer loop. No worktree unless a later verb requires it (ship tend).
   - Multi-area plans: one implementer walks areas in order (or parent sequences serial subagents). Shared config/lock/generated files always single-owner.
   - **Budget mode:** main thread when possible.
5. **Verify** — run the plan’s verify command, or the smallest meaningful check. Cite command + result.
6. **Linear** — if ticket known: set In Progress if still backlog; comment briefly on what landed (optional if commit message will cover it at ship).

Do **not** push, open a PR, or mark Done unless the user asked to ship in the same breath — point them to `/blade-ship`.

## Output

**Done / Blocked / Needs you** + files touched + verify evidence + next action (`/blade-review` or `/blade-ship`).
