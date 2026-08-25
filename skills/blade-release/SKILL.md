---
name: blade-release
description: >
  Land a shipped PR: merge it, then mark the linked Linear issue Done.
  Always asks before merge and before Done. Use for /blade-release.
argument-hint: "[PR number|URL|branch] [optional ticket id]"
disable-model-invocation: true
---

# /blade-release

Request: **$ARGUMENTS**

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

**Ship vs release:** `/blade-ship` opens/updates a PR. **`/blade-release` merges that PR and closes the Linear card.** Do not open a new PR here.

## Hard rule

Present the plan (PR, merge method, checks status, Linear id + Done transition, branch delete) and wait for explicit yes. Extra explicit confirm to force-merge onto `main`/`master`.

## Resolve PR

1. From `$ARGUMENTS` (PR number, URL, or branch), else current branch’s open PR (`gh pr view`).
2. If none: **Blocked** — need a PR number/URL or an open PR on this branch.
3. Load: title, URL, base/head, mergeable state, review decision, CI (`gh pr checks` / status), body for Linear ids.

## Resolve Linear

1. Ticket from `$ARGUMENTS`, else PR body/title/branch (`ABC-123`), else thread.
2. Fetch via Linear MCP if present. If none: say so and proceed with merge-only if the user still wants it; print the intended Done write.

## Preflight (stop unless user overrides)

- **Not mergeable** / conflicts → **Blocked**
- **Required checks failing or pending** → **Blocked** (or **Needs you** if they explicitly want to merge anyway)
- **Changes requested** and not re-approved → **Needs you**
- Already **merged** → skip merge; only offer Linear Done if still open

## Propose release

Show and wait:

- PR title + URL + base ← head
- Merge method: prefer repo default (`gh pr merge` without forcing squash/rebase unless the user or repo clearly wants one)
- Checks + review summary (one line each)
- Linear: id, current status → **Done** (team’s real completed state), short comment with the merged PR URL
- Branch cleanup: **delete remote head by default** (`gh pr merge --delete-branch`). Opt out only if the user says keep the branch.
- Local cleanup (optional, offer in the plan): checkout base, pull, delete local head if it still exists

## On yes

1. `gh pr merge <n> --delete-branch` (omit `--delete-branch` only if the user opted out).
2. Confirm merged (`gh pr view --json state,mergedAt,url`).
3. Linear: set status **Done** (team’s real Done/completed state from the issue’s available states). Comment with merge confirmation + PR link.
4. If local cleanup was approved: checkout base, pull, delete local head branch when safe.

If Linear MCP is down: merge still runs; print the exact Linear writes for the user.

## Output

**Needs you** until approved; then **Done** with merged PR URL + Linear URL — or **Blocked** if merge/checks/auth fails.

Next-action line: e.g. pull main locally, or next card.
