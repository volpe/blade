---
name: blade-project
description: >
  Break an initiative into a Linear project with milestones and vertically
  sliced cards. Use for /blade-project or multi-feature scoping — not for a
  single ticket.
argument-hint: "[initiative | existing project]"
disable-model-invocation: true
---

# /blade-project

Request: **$ARGUMENTS**

Apply the **blade spine** (Linear MCP, right-size, output contract).

## When not to run

If this is clearly **one card** of work, refuse project ceremony. Say so and offer `/blade-card` instead.

## Steps

1. **Clarify** outcome, constraints, and success in ≤3 questions if needed. Otherwise proceed.
2. **Scout when slice boundaries depend on the codebase** — parallel `scout`s for independent legs (modules, existing features, test layout). Skip if pure product scope. **Budget mode:** 0–1 scout.
3. **Propose (dry-run)** before writing to Linear:
   - Project name + one-line purpose
   - 2–5 milestones (outcomes, not chores)
   - Cards under each milestone: **user-visible outcome**, acceptance criteria, out-of-scope
   - Vertical slices preferred (thin end-to-end) over horizontal layers
4. **Confirm** with the user. Do not create until they approve.
5. **Create** via Linear MCP: project → milestones → issues. Attach labels/estimates only if the user specified or the team default is known from existing issues.
6. **Print the board**: project URL/id, then milestone → issue ids + titles.

## Output

**Done / Blocked / Needs you** + board summary + next action (usually `/blade-plan` on the first card).
