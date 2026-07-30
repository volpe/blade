---
name: blade-review
description: >
  Review the current diff, branch, or PR for correctness and risk.
  Use for /blade-review or before shipping.
argument-hint: "[optional PR | branch | range]"
disable-model-invocation: true
---

# /blade-review

Request: **$ARGUMENTS**

Apply the **blade spine**. Prefer spawning **`critic`** so main context stays clean. If `critic` is unavailable, review on the main thread with the same rubric.

## Scope

- Default: working tree (`git diff`, staged, untracked).
- PR number/URL → `gh pr diff`.
- Branch → merge-base against main/master.
- Honour an explicit range or path in `$ARGUMENTS`.
- **Never** a silent empty review: if the resolved diff is empty but commits exist on the branch, say so and review the branch range.

## Rubric (priority)

1. Correctness  
2. Security (auth, input, secrets, uploads)  
3. Data/state / regressions  
4. Clarity  
5. Tests for the change  

Style is nits only — never gates the verdict alone.

## Output

```markdown
## Review: <scope>

### Blocking
- `file:line` — problem + concrete fix

### Should-fix
- …

### Nits
- …

### Verdict
ready to ship | ship-with-fixes | needs-rework
```

End with **Done / Blocked / Needs you** + next action.
