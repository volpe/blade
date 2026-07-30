---
name: blade-polish
description: >
  Review current changes and apply three rounds of polish — UI craft for
  visual diffs, code-quality refactors otherwise, or both when mixed.
  Use for /blade-polish after build, before review or ship.
argument-hint: "[optional PR | branch | range | path]"
disable-model-invocation: true
---

# /blade-polish

Request: **$ARGUMENTS**

Apply the **blade spine**. Main thread by default. **Apply** improvements — do not only report them. Do not push, commit, or open a PR.

## Scope

- Default: working tree (`git diff`, staged, untracked).
- PR number/URL → `gh pr diff` (apply polish to local files that match).
- Branch → merge-base against main/master.
- Honour an explicit range or path in `$ARGUMENTS`.
- **Never** a silent empty polish: if the resolved diff is empty but commits exist on the branch, say so and polish the branch range.

## Guardrails

- Stay in-bounds: prefer files already in the change. Adjacent files only when required by a polish (e.g. shared style token, extracted helper).
- Smallest correct improvement; no drive-by rewrites, no new product scope.
- Preserve behavior unless the change clearly has a bug or UX defect in the touched surface.
- Visual polish is **code-level** (layout, tokens, states, a11y) — no browser required.
- If an improvement needs a product decision → note under Needs you and skip it.
- Later rounds may be empty: write `None.` rather than inventing churn.

## Steps

1. **Resolve scope** — as above; gather the full diff and list of touched paths.
2. **Classify once** — from paths + hunks:
   - **visual** — UI components, CSS/styles, layout, copy on surfaces
   - **code** — pure logic, APIs, data, tests without UI
   - **both** — mixed; run both tracks each round
3. **Round 1 — Structure** (biggest win)
   - Visual: hierarchy, spacing scale, obvious contrast/a11y
   - Code: extract clear helpers, dead code, naming that obscures intent
4. **Round 2 — Craft** (medium depth)
   - Visual: interaction/empty/loading/error states, motion restraint, token consistency
   - Code: edge cases, error paths, simplify control flow, match local patterns
5. **Round 3 — Finish** (small high-signal)
   - Visual: residual nits, typography/alignment, copy polish
   - Code: comments only where needed, test clarity if tests changed, leftover style debt in touched lines
6. **Each round** — re-read the **current** diff → pick 1–few meaningful improvements → apply → optional cheap sanity check.
7. **Verify (optional)** — if the project has an obvious small check for the touched area, run it and cite evidence. Skip if unclear.

## Output

```markdown
## Polish: <scope>

### Classification
visual | code | both — <one-line why>

### Round 1 — Structure
- … | None.

### Round 2 — Craft
- … | None.

### Round 3 — Finish
- … | None.

### Files touched
- …

### Verify
command + result | skipped — reason
```

End with **Done / Blocked / Needs you** + next action (`/blade-review` or `/blade-ship`).
