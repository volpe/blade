---
name: blade-test
description: >
  Decide what would prove the change works, run the smallest meaningful checks,
  report evidence. Use for /blade-test or verification after a build.
argument-hint: "[optional focus]"
disable-model-invocation: true
---

# /blade-test

Request: **$ARGUMENTS**

Apply the **blade spine**. Main thread for running checks and reporting. No strategy novels.

## Steps

1. **Define “working”** — one short paragraph: observable truth for this change (from ticket, plan, or diff).
2. **Locate coverage** — existing tests that touch the area; note gaps without boiling the ocean. If the area is unfamiliar, focused `scout`(s) (parallel for multi-package layouts). **Budget mode:** main-thread search only.
3. **Run the smallest meaningful suite** — prefer targeted tests over full monorepo. Use project conventions (e.g. `nx affected`, package scripts).
4. **Behavioral check** when unit/integration is insufficient — one command or manual probe that exercises the change.
5. **Report evidence** — never claim a check that was not run.

## Output

```markdown
## What “working” means
## Checks
| Check | Result | Evidence |
|---|---|---|
| … | Passed / Failed / Not run | command or reason |
## Gaps (if any)
## Verdict
verified | verified-with-issues | could-not-verify
```

End with **Done / Blocked / Needs you** + next action.
