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

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

**Apply** improvements — do not only report them. Do not push, commit, or open a PR.

Standalone: main session for apply loops. Team mode: Polisher coordinates the writer and stops when useful improvements are exhausted; the three tracks below are inspection lenses, not mandatory edit rounds. Unknown local conventions → use a focused scout with `../../agents/scout.md` before Round 1. **Budget delta:** main thread only.

## Scope

Same resolution as `../../agents/critic.md` (from this skill’s directory). Apply to the **local** files on those paths — `gh pr diff` is the read target, not the write target. Never a silent empty polish: if the resolved diff is empty but commits exist on the branch, say so and polish the branch range.

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
7. **Verify** — rerun checks affected by edits, including relevant behavior/visual probes. Required project checks remain required. If verification is unavailable, report the gap; do not certify the change from inspection alone.

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
