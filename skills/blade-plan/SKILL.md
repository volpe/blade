---
name: blade-plan
description: >
  Research the codebase and produce a short implementation plan in chat.
  Use for /blade-plan before non-trivial builds. Pauses for approval.
argument-hint: "[ticket id | feature description]"
disable-model-invocation: true
---

# /blade-plan

Request: **$ARGUMENTS**

Apply the **blade spine**. Plans stay **in chat** unless the user asks to persist.

## Escape hatch

Single-file, behavior-preserving trivia → say **trivial — build directly** with one-line why, and stop (or offer `/blade-build`).

## Steps

1. **Load intent** — fetch Linear ticket if an id is present; otherwise use `$ARGUMENTS` + thread.
2. **Explore** — if blast radius is unknown, spawn up to **2× `scout` in parallel** (e.g. similar features + touch points/risks). If scope is already obvious, read the few files yourself.
3. **Ground** — read the key files scouts cite; do not plan from summaries alone.
4. **Options** — present **1–2** approaches with trade-offs and a clear recommendation. Not three for sport.
5. **Plan (chat)** — phased only if useful:

```markdown
## Goal
## Approach (chosen)
## Phases (if multi-step)
### N. <name>
- Files:
- Changes:
- Verify: `<exact command>`
- Done when:
## Risks / open questions
```

6. **Stop for approval** before any `/blade-build` work. Ask explicitly.
7. Linear: optional short comment “plan ready” + summary **only if** a ticket exists and a comment is useful — never dump a novel.

## Output

**Needs you** (approve / adjust / kill) + the plan + next action (`/blade-build …` when approved).
