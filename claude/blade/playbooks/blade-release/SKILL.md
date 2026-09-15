---
name: blade-release
description: >
  Land a shipped PR after current checks and review pass, then perform
  authorized issue completion or cleanup. Use for blade-release.
argument-hint: "[PR number|URL|branch] [optional ticket id]"
disable-model-invocation: true
---

# Blade release

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** read `../../runtime.md` from this skill's directory if present. Use its available tools; do not invent APIs.

**Load spine:** read `../blade/SKILL.md` unless this turn includes Shared spine. In team mode, use the assigned release owner's current-candidate sign-off requirements in `../../team/workflow.md`.

Ship opens/updates a PR; release merges an existing PR. Do not create a new PR here.

## Prepare

1. Resolve the named PR or current branch's open PR. With `gh`, inspect PR title, URL, base/head, exact head revision, mergeability, reviews, and required checks. If missing, report the blocker.
2. Fetch a linked issue through the configured connector. Resolve its real completed state. No linked issue is a valid merge-only flow; unavailable tracker access is not permission to claim closure.
3. Inspect repository merge policy and current approvals. In team mode request current verdicts from participating owners; see the workflow. A new revision requires affected checks and sign-offs to be renewed.
4. Prepare the release decision: PR/candidate, merge method, checks and review summary, open risks, and separately named issue/deploy/cleanup actions. Prefer the repository's merge method. Do not assume branch deletion or deployment is included in merge authority.

## Gate

- Conflicts, failed or pending required checks, unresolved required reviews, or missing independent team readiness block merge. Never bypass repository protections.
- An already merged PR needs no second merge; inspect actual state and handle only remaining authorized actions.
- Present the concrete release decision. Guided team mode pauses here unless the user already authorized continuation through release. Honor recorded explicit merge authority; request only the missing action or unresolved decision.

## Execute and confirm

1. Recheck head revision and required CI/review state immediately before merging. If the candidate changed, renew affected evidence and approvals.
2. Merge using an available authenticated tool and the chosen method; bind to the inspected head when supported (for example `gh pr merge --match-head-commit <sha>`). Include branch cleanup only when authorized.
3. Inspect actual merged state, merge revision/time, and URL before reporting success. An uncertain response requires a state read before retry.
4. Complete the issue or post a merge comment only within the corresponding authority. Resolve real state names. If the connector is unavailable, provide the exact intended update and report it as pending.
5. Run deployment, migrations, rollback preparations, or local/remote cleanup only when separately authorized. Verify each actual outcome; merge success does not prove deployment success.

End **Done / Blocked / Needs you**, with the confirmed result and remaining action.
