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

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

## When not to run

If this is clearly **one card** of work, refuse project ceremony. Say so and offer `/blade-card` instead.

## Steps

1. **Clarify** outcome, constraints, and success in ≤3 questions if needed. Otherwise proceed.
2. **Scout when slice boundaries depend on the codebase** — parallel `blade:scout`s for independent legs (modules, existing features, test layout). Skip if pure product scope. **Budget delta:** 0–1 scout.
3. **Propose (dry-run)** before writing to Linear:
   - Project name + one-line purpose
   - Milestones (outcomes, not chores). Typical 2–5; if the bet is larger, add more and mark later ones **optional** — do not drop slices to stay in that range
   - Cards under each milestone: **user-visible outcome**, acceptance criteria, out-of-scope
   - Vertical slices preferred (thin end-to-end) over horizontal layers
4. **Confirm** with the user (all / required milestones only / adjust). Create only what they approve; keep optional later in the proposal if they skip them.
5. **Create** via Linear MCP: project → milestones → issues. Attach labels/estimates only if the user specified or the team default is known from existing issues.
6. **Print the board**: project URL/id, then milestone → issue ids + titles.

## Output

**Done / Blocked / Needs you** + board summary + next action (usually `/blade-plan` on the first card).
