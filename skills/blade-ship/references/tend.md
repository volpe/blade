# Ship tend (default after open)

Watch **one** PR (the one just opened/updated, or the branch’s open PR). Fix CI failures and review comments until healthy or blocked.

**Out of scope:** Graphite / `gh stack` restack, multi-PR watchlists, auto-merge. For heavy stack babysitting, use the host’s `/pr-babysit` if available.

## When to run

- Default after a successful open/update in the same `/blade-ship` turn.
- Skip if user said `ship-only`, “open only”, or “no watch”.
- Resume: re-run `/blade-ship` with an existing open PR → skip create, go to tend after a short propose (or jump in if user says “tend” / “watch”).

## Isolation

All code fixes, commits, and pushes for tend happen in a **worktree-isolated** subagent:

```text
spawn_subagent:
  subagent_type: general-purpose
  isolation: worktree
  background: true
  description: blade-ship tend PR-<n>
```

- Main checkout stays clean; do not edit the PR branch on the main workspace during tend.
- Prefer `git checkout -B <head> origin/<head>` inside the worktree (avoid “branch already checked out” errors).
- Resume the same subagent across cycles with `resume_from` when the prior id is still valid; otherwise spawn fresh.
- When tend ends for good (healthy, abandoned, or PR merged/closed), clean up with `grok worktree rm --force <path>` if a path was returned.

## Poll

```bash
gh pr view <n> --json state,mergeable,mergeStateStatus,statusCheckRollup,reviewDecision,headRefName,baseRefName,url
gh pr checks <n>
```

Failed runs:

```bash
gh run list --branch <headRefName> --json databaseId,name,conclusion \
  --jq '.[] | select(.conclusion == "failure")'
gh run view <run_id> --log-failed 2>/dev/null | tail -120
```

Unresolved review threads (paginate; strip ANSI):

```bash
NO_COLOR=1 gh api graphql -f owner="$OWNER" -f name="$REPO" -F number=<n> -f query='
query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviewThreads(first: 50, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          isResolved
          comments(first: 10) {
            nodes { author { login } path line body databaseId url }
          }
        }
      }
    }
  }
}'
```

## Decision order

For each cycle, evaluate in order:

1. **MERGED / CLOSED** → stop tend; report; do not fix.
2. **Conflicts** (`mergeable: CONFLICTING` or `mergeStateStatus: DIRTY`) → rebase onto `origin/<base>` in the worktree; resolve only when confident; else **Needs you**. Push with `--force-with-lease` only after rebase.
3. **CI failed** → diagnose from logs; smallest fix; commit; push.
4. **Always** process unresolved review threads (even if CI was also fixed this cycle).
5. **Pending CI** with no failures → wait / re-poll; still handle review threads.
6. **Cancelled / timed-out checks** (no hard failures) → **Needs you** (do not invent re-runs unless the user asked).
7. **Healthy** when: mergeable, no failed/error checks, not `CHANGES_REQUESTED`, no unresolved threads → exit tend **Done**.

## Fix policy

- **Source the feedback** — read real threads and logs; never invent comments.
- **Smallest correct edit** per issue. Evaluate suggestions; push back with a technical reply when wrong or out of scope.
- **Stage by name** — never blind `git add -A`. No AI co-author trailers unless the repo already uses them.
- **Commit messages** match repo style, e.g. `fix: address CI failure in <check>` / `fix: address review on <path>`.
- **Push** after each fix batch. Plain `git push` unless a rebase requires `--force-with-lease`.
- **Reply after push** for inline threads, citing the commit SHA:

```bash
COMMIT_SHA=$(git rev-parse HEAD)
NO_COLOR=1 gh api "repos/$OWNER/$REPO/pulls/<n>/comments/<databaseId>/replies" \
  -X POST -f body="Addressed in ${COMMIT_SHA}: <brief what changed>"
```

- **Never** reply with only “will fix”, “acked”, or empty acknowledgments. If the fix cap blocks a code change, reply with a substantive description of the needed change and that the next cycle will apply it.
- **Never merge.**

## Caps and waiting

- **≤ 3 code-fix commits per tend cycle** (CI fix, conflict resolution, or review-thread code change each count). Replies without code do not count.
- If still red after a cycle: re-poll once CI settles; run another cycle (cap resets per cycle). After **two** full cycles still failing the same root cause → **Needs you**.
- Prefer in-session wait: `scheduler` / `monitor` / subagent poll rather than plugin-data state files. Durable state is **the PR itself** + chat.

## Subagent brief (minimum)

Give the tend subagent:

- PR number, URL, `OWNER/REPO`, head/base branch
- Cap = 3 code-fix commits this cycle
- Full decision order + fix policy above
- Required output at end:

```json
{
  "pr": <n>,
  "status": "healthy|ci_failed|review_comments|conflicts|pending|needs_you|merged|error",
  "fix_commits": <int>,
  "summary": "<one short paragraph>"
}
```

## Orchestrator loop

1. Launch (or resume) tend subagent in worktree.
2. Wait for result (`get_command_or_subagent_output`, generous timeout).
3. If `pending` or just pushed fixes → wait for CI, then another cycle.
4. If `healthy` → **Done**: PR URL, Linear URL, tend summary; next `/blade-release`.
5. If `needs_you` / `error` / repeated same failure → **Needs you** or **Blocked** with evidence.
6. Clean up worktree when leaving tend for good.

## Safety

- Never force-push without `--force-with-lease`.
- Never modify files outside the PR head branch.
- Never merge or set Linear Done from tend.
- If `gh` auth fails → **Blocked**.
- Dirty unexpected work in the worktree that is not from this tend → stop and report; do not clobber.
