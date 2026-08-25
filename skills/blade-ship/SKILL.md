---
name: blade-ship
description: >
  Ship current work: preflight (template, labels), commit, push, open/update PR,
  link Linear, then tend CI/review fixes in a worktree. Always asks before push/PR.
  Use for /blade-ship.
argument-hint: "[optional ticket id | ship-only]"
disable-model-invocation: true
---

# /blade-ship

Request: **$ARGUMENTS**

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

## Hard rules

- **Never merge** — that is `/blade-release`.
- **Tend is default** after open. Opt out only if the user says `ship-only`, “open only”, or “no watch” (in args or approval).

## Steps

### 1. Context

`git status`, branch, existing PR (`gh pr view` if any), Linear ticket from args/branch/thread (fetch if present). Detect resume: open PR already exists → skip create; offer update + tend.

### 2. Review

If no clean recent `/blade-review` in-thread, run review now (`blade:critic` for non-trivial diffs). **Stop on Blocking.**

### 3. Commit

Focused commits in the repo’s existing style. Stage by name; never `git add -A` blindly. No AI co-author trailers unless the repo already uses them. Do not commit secrets.

### 4. Preflight

Follow [references/preflight.md](references/preflight.md).

### 5. Propose ship

Show and wait:

| Item | Content |
|---|---|
| Branch / remote | current head → base |
| Commits | list to push |
| PR | create vs update; title; body draft (note template source) |
| Labels | proposed set, or “none”, or **Needs you** if required-but-unknown |
| Base | up to date / behind (+ rebase yes/no) |
| Linear | status (in review, team’s real name) + comment with PR link |
| Tend | **on by default** (CI + review fix loop in worktree) — or ship-only if user opted out |

### 6. On yes — open

1. Push (`-u` if needed). If rebase was approved: rebase onto `origin/<base>`, then push (`--force-with-lease` only after that approved rebase).
2. Create or update PR:
   - Create: `gh pr create --base <base> --title "…" --body-file <path>` (+ `--label` per agreed label).
   - Update: refresh body only if empty/placeholder or user asked; **add** missing agreed labels without removing human-added ones (`gh pr edit --add-label`).
3. Linear: link + in-review status + short comment with PR URL.
4. Print PR URL + Linear URL.

### 7. Tend (default)

Unless ship-only: follow [references/tend.md](references/tend.md).

If ship-only: stop after step 6 with next action “re-run `/blade-ship` to tend, or `/blade-release` when ready”.

## Output

**Needs you** until open is approved; then either tend progress updates or **Done** with PR + Linear links (and tend summary) — or **Blocked** if review/CI/auth fails.

Next-action line: e.g. `/blade-release` when healthy, or what the user must decide.
