---
name: blade-card
description: >
  Draft or refine one Linear issue — problem, acceptance criteria, out of scope.
  Use for /blade-card, writing a ticket, or tightening an existing issue.
argument-hint: "[title | ticket id | from this thread]"
disable-model-invocation: true
---

# /blade-card

Request: **$ARGUMENTS**

Apply the **blade spine**. Main thread only — no subagents.

## Steps

1. Gather intent from `$ARGUMENTS`, the thread, and any named ticket (fetch via Linear MCP if an id is present).
2. Draft a **scannable** issue (create or update):

```markdown
## Problem / outcome
<what hurts and what “done” looks like>

## Acceptance criteria
- [ ] <checkable>
- [ ] <checkable>

## Out of scope
- <explicit non-goals>

## Hints (optional)
- files/systems if already known — never invent paths
```

3. **Confirm** title + body if creating new or making material edits. Trivial typo fixes on an existing card may apply directly.
4. Create or update via Linear MCP. Keep description short; put design debate in comments only if needed.
5. Return issue id + URL.

## Output

**Done / Blocked / Needs you** + issue link + next action (often `/blade-plan <id>`).
