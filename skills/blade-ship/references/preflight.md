# Ship preflight

Run after commit, before the propose block. Surface every result in the approval plan.

## PR template

Search **local** first (case-insensitive); use the first that exists:

```bash
for p in \
  .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md \
  pull_request_template.md PULL_REQUEST_TEMPLATE.md \
  docs/pull_request_template.md docs/PULL_REQUEST_TEMPLATE.md \
  .github/PULL_REQUEST_TEMPLATE/*.md ; do
  [ -f "$p" ] && echo "FOUND: $p" && break
done
```

If none locally, probe the **org** `.github` repo:

```bash
ORG=$(gh repo view --json owner -q .owner.login)
for p in \
  .github/PULL_REQUEST_TEMPLATE.md .github/pull_request_template.md \
  PULL_REQUEST_TEMPLATE.md pull_request_template.md \
  docs/PULL_REQUEST_TEMPLATE.md docs/pull_request_template.md ; do
  body=$(gh api "repos/$ORG/.github/contents/$p" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  [ -n "$body" ] && echo "FOUND ORG: $ORG/.github/$p" && printf '%s' "$body" && break
done
```

| Result | Action |
|---|---|
| Local template | Skeleton = that file; fill every section |
| Org template | Skeleton = fetched body; fill every section |
| Neither | Use blade fallback below |

### Blade fallback

```markdown
## What

## Why

## How to verify

## Linear
```

### Fill rules

- Explain **why**, not only what changed.
- Link Linear id when known.
- Verification language only for checks actually run: `Passed:` / `Failed:` / `Not run:` / `Manual:`.
- Do not invent screenshots, metrics, or test results.
- If the template mentions required labels, checklists, or reviewers, call those out in the propose block.

## Labels

1. List available labels:

```bash
gh label list --limit 100 --json name,description
```

2. **Soft propose** (never invent names that do not exist on the repo):
   - Linear issue labels whose names match GH labels (case-insensitive).
   - Type heuristics only if the label exists: e.g. `bug` / `bugfix`, `enhancement` / `feature`, `documentation` / `docs` — infer from the change, not from wishful naming.
   - User-specified labels in args or thread.

3. **Hard ask** (block propose until the user decides) when:
   - Template or `.github` config text says labels are required / must select type.
   - A labeler or CONTRIBUTING note implies a required set and none were proposed.
   - Prior in-thread ship failed or bots complained about missing labels.

4. If nothing matches and nothing requires labels → propose **none** (fine).

On create/update: apply only the **agreed** set. On update, **add** missing agreed labels; do not strip labels humans already applied.

```bash
# create (repeat --label as needed)
gh pr create --base "$BASE" --title "$TITLE" --body-file "$BODY_FILE" --label "$L1"

# update — add only
gh pr edit "$N" --add-label "$L1"
```

## Base freshness

```bash
DEFAULT=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
git fetch origin "$DEFAULT"
git rev-list --count HEAD.."origin/$DEFAULT"
```

- Count `0` → up to date.
- Count `> 0` → note in propose; offer rebase onto `origin/$DEFAULT` as part of approval.
- **Never rebase silently.** If rebase approved: rebase, resolve if trivial, stop with **Needs you** on hard conflicts.

## Propose checklist (copy into chat)

- [ ] Template source: local path | org path | fallback
- [ ] Title + body ready (body-file path if long)
- [ ] Labels: list | none | **Needs you**
- [ ] Base: current / behind N commits (rebase: yes/no)
- [ ] Linear: id + target status
- [ ] Tend: default on | ship-only
