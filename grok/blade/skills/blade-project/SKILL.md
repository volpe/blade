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

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

## When not to run

If this is clearly **one card** of work, refuse project ceremony. Say so and offer `/blade-card` instead.

## Steps

1. **Clarify** outcome, constraints, and success in ≤3 questions if needed. Otherwise proceed.
2. **Scout when slice boundaries depend on the codebase** — parallel scouts using `../../agents/scout.md` for independent legs (modules, existing features, test layout). Skip if pure product scope. **Budget delta:** 0–1 scout.
3. **Propose (dry-run)** before writing to Linear:
   - Project name + one-line purpose
   - Milestones (outcomes, not chores). Use enough to cover the full initiative; mark required slices deferred only when the user agrees
   - Cards under each milestone: **user-visible outcome**, acceptance criteria, out-of-scope
   - Vertical slices preferred (thin end-to-end) over horizontal layers
4. Resolve material scope decisions and any missing write authority with the user. Honor existing instructions to create the project; keep explicitly deferred requested slices visible.
5. **Create** via the configured issue connector (Linear when available): project → milestones → issues. Attach labels/estimates only if the user specified or the team default is known from existing issues.
6. **Print the board**: project URL/id, then milestone → issue ids + titles.

## Output

**Done / Blocked / Needs you** + board summary + next action (usually `/blade-plan` on the first card).
