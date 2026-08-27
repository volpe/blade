---
name: blade-plan
description: >
  Research the codebase and produce an implementation plan in chat.
  Keep the user's goal; phase if large. Use for /blade-plan before
  non-trivial builds. Pauses for approval.
argument-hint: "[ticket id | feature description]"
disable-model-invocation: true
---

# /blade-plan

Request: **$ARGUMENTS**

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

## Escape hatch

Single-file, behavior-preserving trivia → say **trivial — build directly** with one-line why, and stop (or offer `/blade-build`).

## Steps

1. **Load intent** — fetch Linear ticket if an id is present; otherwise use `$ARGUMENTS` + thread.
2. **Explore** — if blast radius is unknown or multi-area, spawn **N× `blade:scout`** in parallel, one focused mission each (entry points, patterns, tests, risks, auth, …). No overlapping missions. If scope is already obvious, read the few files yourself.
3. **Ground** — read the key files scouts cite; do not plan from summaries alone.
4. **Options** — present **1–2** approaches with trade-offs and a clear recommendation. Not three for sport.
5. **Plan (chat)** — Goal = the user's full ask, including what it takes to make that real. Do not add product they didn't ask for. **If it looks like a lot, add phases — do not recut Goal.**
   - Small/clear: one phase, or omit the phase list.
   - Large: must phase. Required = first independently shippable cut of that Goal. Remaining slices of the same Goal go under `## Optional later` (listed, not dropped).
   - Number continuously across both headings. **Approve all** = Phases + Optional later. **Approve 1–N** uses those numbers (optional slices count only if ≤ N).
   - Omit `## Optional later` from the output when nothing is deferred — do not copy an empty heading.

```markdown
## Goal
## Approach (chosen)
## Phases
### N. <name>
- Files:
- Changes:
- Verify: `<exact command>`
- Done when:
## Optional later
### N. <name>
- Why later:
- Files:
- Changes:
- Verify: `<exact command>`
- Done when:
## Risks / open questions
```

6. **Stop for approval** before any `/blade-build` work. Ask: approve all / approve phases 1–N / adjust / kill.
7. Linear: optional short comment “plan ready” + summary **only if** a ticket exists and a comment is useful — never dump a novel.

## Output

**Needs you** (approve all / approve phases 1–N / adjust / kill) + the plan + next action (`/blade-build` on the approved phases).
