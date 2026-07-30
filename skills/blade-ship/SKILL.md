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

Apply the **blade spine**.

## Hard rules

- **Always ask before push and before opening/updating a PR.** Present the full propose block and wait for explicit yes.
- Never force-push shared branches. Never push to `main`/`master` without an extra explicit confirm.
- **Never merge** — that is `/blade-release`.
- **Tend is default** after open. Opt out only if the user says `ship-only`, “open only”, or “no watch” (in args or approval).
- Tend fixes run in a **worktree-isolated** subagent, not on the main checkout.

## Steps

### 1. Context

`git status`, branch, existing PR (`gh pr view` if any), Linear ticket from args/branch/thread (fetch if present). Detect resume: open PR already exists → skip create; offer update + tend.

### 2. Review

If no clean recent `/blade-review` in-thread, run review now (`critic` for non-trivial diffs). **Stop on Blocking.**

### 3. Commit

Focused commits in the repo’s existing style. Stage by name; never `git add -A` blindly. No AI co-author trailers unless the repo already uses them. Do not commit secrets.

### 4. Preflight

Follow [references/preflight.md](references/preflight.md):

- Resolve PR template (local → org `.github` → blade fallback).
- Draft title + body (fill every template section; honest verification language).
- Propose labels (soft): match Linear ↔ GH; type heuristics only if those labels exist. **Hard ask** when template/config/prior PRs imply labels are required and the set is empty or uncertain.
- Base freshness: warn if behind default branch; offer rebase in the plan (no silent rebase).

### 5. Propose ship

Show and wait:

| Item | Content |
|---|---|
| Branch / remote | current head → base |
| Commits | list to push |
| PR | create vs update; title; body draft (note template source) |
| Labels | proposed set, or “none”, or **Needs you** if required-but-unknown |
| Base | up to date / behind (+ rebase yes/no) |
| Linear | status (e.g. In Review) + comment with PR link |
| Tend | **on by default** (CI + review fix loop in worktree) — or ship-only if user opted out |

### 6. On yes — open

1. Push (`-u` if needed). If rebase was approved: rebase onto `origin/<base>`, then push (`--force-with-lease` only after that approved rebase).
2. Create or update PR:
   - Create: `gh pr create --base <base> --title "…" --body-file <path>` (+ `--label` per agreed label).
   - Update: refresh body only if empty/placeholder or user asked; **add** missing agreed labels without removing human-added ones (`gh pr edit --add-label`).
3. Linear: link + status + short comment with PR URL.
4. Print PR URL + Linear URL.

### 7. Tend (default)

Unless ship-only: enter the tend loop in [references/tend.md](references/tend.md).

- Spawn `general-purpose` with `isolation: "worktree"` for all CI/review fixes.
- Poll CI + unresolved review threads; fix, push, reply (cap **3 code-fix commits per cycle**).
- Exit when healthy → **Done** (ready for `/blade-release`); or **Blocked** / **Needs you**.

If ship-only: stop after step 6 with next action “re-run `/blade-ship` to tend, or `/blade-release` when ready”.

## Output

**Needs you** until open is approved; then either tend progress updates or **Done** with PR + Linear links (and tend summary) — or **Blocked** if review/CI/auth fails.

Next-action line: e.g. `/blade-release` when healthy, or what the user must decide.
