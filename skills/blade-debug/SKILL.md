---
name: blade-debug
description: >
  Debug with hypothesis → evidence → root cause → fix. Use for /blade-debug,
  failing tests, regressions, or “why is this broken”.
argument-hint: "[symptom | ticket | failing test]"
disable-model-invocation: true
---

# /blade-debug

Request: **$ARGUMENTS**

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

Do not edit without a plausible root cause unless the user asks to explore freely.

## Steps

1. **Symptom** — restate the failure; fetch Linear ticket if an id is present.
2. **Reproduce / observe** — run the failing path, read logs, or capture the exact error. No fix yet.
3. **Hypotheses** — list 2–4 ranked; test **one at a time**.
4. **Evidence** — logs, bisect/blame, runtime state, minimal repro. When history/blast radius is unclear, parallel `blade:scout`s for independent legs (callers, related history, similar failures). **Budget delta:** 0–1 scout.
5. **Root cause** — state it in one sentence with evidence.
6. **Fix** — smallest change; re-run the **same** repro. “Fixed” means that command is green now, not an earlier run.
7. **Stop thrashing** — after **3 failed fix attempts**, stop. Report findings; do not try a fourth variation without a new diagnosis.
8. Linear: comment root cause + fix summary if a ticket is in play.

## Output format

```markdown
## Symptom
## Evidence
- `command` → result
## Hypotheses
- … (confirmed / rejected + why)
## Root cause
## Fix
## Verification
```

End with **Done / Blocked / Needs you** + next action.
