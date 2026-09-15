---
name: blade-plan
description: "Research the codebase and produce an implementation plan in chat. Keep the user's goal; phase if large. Use for /blade-plan before non-trivial builds. Resolves material design decisions before implementation."
---

# /blade-plan

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

## Escape hatch

Single-file, behavior-preserving trivia → say **trivial — build directly** with one-line why, and stop (or offer `/blade-build`).

## Steps

1. **Load intent** — fetch Linear ticket if an id is present; otherwise use `$ARGUMENTS` + thread.
2. **Explore** — if blast radius is unknown or multi-area, spawn independent scouts using `../../agents/scout.md` in parallel, one focused mission each (entry points, patterns, tests, risks, auth, …). No overlapping missions. If scope is already obvious, read the few files yourself.
3. **Ground** — read the key files scouts cite; do not plan from summaries alone.
4. **Options** — present **1–2** approaches with trade-offs and a clear recommendation. Not three for sport.
5. **Plan (chat)** — Goal = the user's full ask, including what it takes to make that real. Do not add product they didn't ask for. **If it looks like a lot, add phases — do not recut Goal.**
   - Small/clear: one phase, or omit the phase list.
   - Large: phase the full requested goal into coherent slices. Keep every requested slice required unless the user explicitly defers it.
   - Number phases continuously. A partial approval authorizes those phases; retain the remainder as pending, not complete.
   - List genuinely additional ideas separately only when useful; they need scope approval.

```markdown
## Goal
## Approach (chosen)
## Phases
### N. <name>
- Files:
- Changes:
- Verify: `<exact command>`
- Done when:
## Risks / open questions
```

6. Present the concrete plan. If implementation/design authority is missing, seek approval for all phases or a named subset; otherwise continue within existing authorization. Team mode honors its guided design checkpoint or recorded autonomous boundary.
7. Linear: optional short comment “plan ready” + summary **only if** a ticket exists and a comment is useful — never dump a novel.

## Output

**Done / Needs you** + the plan and any unresolved decision + next action (`blade-build` on the approved phases).
