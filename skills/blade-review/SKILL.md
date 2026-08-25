---
name: blade-review
description: >
  Review the current diff, branch, or PR for correctness and risk.
  Use for /blade-review or before shipping.
argument-hint: "[optional PR | branch | range]"
disable-model-invocation: true
---

# /blade-review

Request: **$ARGUMENTS**

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

Prefer **`blade:critic`** so main context stays clean. If blast radius is unclear, parallel focused `blade:scout`s (callers, tests, auth) before or alongside critic. If `blade:critic` is unavailable, from this skill’s directory read `../../agents/critic.md` and run that rubric on the main thread. **Budget delta:** critic only (or main-thread review).

## Scope

Honour `$ARGUMENTS` (PR number/URL, branch, range, path). Diff-scope defaults live in critic — do not fork them here.

## Output

Use the critic’s output shape (`Blocking` / `Should-fix` / `Nits` / verdict). End with **Done / Blocked / Needs you** + next action.
