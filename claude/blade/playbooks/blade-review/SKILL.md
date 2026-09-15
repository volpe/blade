---
name: blade-review
description: >
  Review the current diff, branch, or PR for correctness and risk.
  Use for /blade-review or before shipping.
argument-hint: "[optional PR | branch | range]"
disable-model-invocation: true
---

# /blade-review

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

Use an available independent agent with `../../agents/critic.md`. If blast radius is unclear, assign focused read-only scouts using `../../agents/scout.md`. Without delegation, read the critic card and perform a disclosed local review. In team mode this is not an independent sign-off; report that staffing gap. **Budget delta:** critic only, or disclosed local review.

## Scope

Honour `$ARGUMENTS` (PR number/URL, branch, range, path). Diff-scope defaults live in critic — do not fork them here.

## Output

Use the critic’s output shape (`Blocking` / `Should-fix` / `Nits` / verdict). End with **Done / Blocked / Needs you** + next action.
