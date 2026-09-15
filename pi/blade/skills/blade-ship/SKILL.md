---
name: blade-ship
description: >
  Ship current work: preflight (template, labels), commit, push, open/update PR,
  link Linear, then tend CI/review fixes in an isolated workspace. Honors recorded push/PR authority.
  Use for /blade-ship.
argument-hint: "[optional ticket id | ship-only]"
disable-model-invocation: true
---

# /blade-ship

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

## Boundaries

- **Never merge** — that is `/blade-release`.
- **Tend is default** after open. Opt out only if the user says `ship-only`, “open only”, or “no watch” (in args or approval).

## Steps

### 1. Context

`git status`, branch, existing PR (`gh pr view` if any), Linear ticket from args/branch/thread (fetch if present). Detect resume: open PR already exists → skip create; offer update + tend.

### 2. Review

If no clean recent `/blade-review` in-thread, run review now (a critic using `../../agents/critic.md` for non-trivial diffs). **Stop on Blocking.**

### 3. Commit

Focused commits in the repo’s existing style. Stage by name; never `git add -A` blindly. No AI co-author trailers unless the repo already uses them. Do not commit secrets.

### 4. Preflight

Follow [references/preflight.md](references/preflight.md).

### 5. Propose ship

Prepare the concrete result below. Proceed within existing authority; otherwise obtain approval for missing actions before executing them:

| Item | Content |
|---|---|
| Branch / remote | current head → base |
| Commits | list to push |
| PR | create vs update; title; body draft (note template source) |
| Labels | proposed set, or “none”, or **Needs you** if required-but-unknown |
| Base | up to date / behind (+ rebase yes/no) |
| Linear | status (in review, team’s real name) + comment with PR link |
| Tend | **on by default during this active run** (CI/review loop; record push/reply authority) — or ship-only if user opted out |

### 6. Within authorization — open

1. Push (`-u` if needed). If rebase was approved: rebase onto `origin/<base>`, then push (`--force-with-lease` only after that approved rebase).
2. Create or update PR:
   - Create: `gh pr create --base <base> --title "…" --body-file <path>` (+ `--label` per agreed label).
   - Update: refresh body only if empty/placeholder or user asked; **add** missing agreed labels without removing human-added ones (`gh pr edit --add-label`).
3. Tracker: link + actual in-review status within authority. Post a short comment with PR URL only with explicit comment authority.
4. Print PR URL + Linear URL.

### 7. Tend (default)

Unless ship-only: follow [references/tend.md](references/tend.md).

If ship-only: stop after step 6 with next action “re-run `/blade-ship` to tend, or `/blade-release` when ready”.

## Output

**Needs you** if an approval is missing; otherwise tend during the active run or **Done** with PR + Linear links (and tend summary) — or **Blocked** if review/CI/auth fails.

Next-action line: e.g. `/blade-release` when healthy, or what the user must decide.
