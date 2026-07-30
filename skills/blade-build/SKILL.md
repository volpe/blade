---
name: blade-build
description: >
  Implement a change from a ticket, approved plan, or freeform request.
  Use for /blade-build. Prefers main thread; fresh subagent only when needed.
argument-hint: "[ticket id | plan cue | freeform]"
disable-model-invocation: true
---

# /blade-build

Request: **$ARGUMENTS**

Apply the **blade spine**. Prefer the **smallest correct change**.

## Steps

1. **Load intent** — Linear ticket if present; approved plan from thread; else `$ARGUMENTS`.
2. **If no plan and work is multi-area/unclear** — stop and run `/blade-plan` first (or say so and ask).
3. **Implement**
   - **Small / clear:** main thread. Match local patterns; add/adjust tests with the change.
   - **Large or fat context:** one fresh `general-purpose` subagent with a **self-contained brief** (goal, files, constraints, verify command). No per-phase reviewer loop.
4. **Verify** — run the plan’s verify command, or the smallest meaningful check. Cite command + result.
5. **Linear** — if ticket known: set In Progress if still backlog; comment briefly on what landed (optional if commit message will cover it at ship).

Do **not** push, open a PR, or mark Done unless the user asked to ship in the same breath — point them to `/blade-ship`.

## Output

**Done / Blocked / Needs you** + files touched + verify evidence + next action (`/blade-review` or `/blade-ship`).
