---
name: blade-card
description: "Draft or refine one Linear issue — problem, acceptance criteria, out of scope. Use for /blade-card, writing a ticket, or tightening an existing issue."
---

# /blade-card

Request: **the supplied arguments** (`$ARGUMENTS` where supported).

**Load runtime:** from this skill’s directory, read `../../runtime.md` if present; use its real invocation and agent capabilities. Do not invent host APIs.

**Load spine:** from this skill’s directory, read `../blade/SKILL.md` unless this turn already includes **Shared spine**.

Standalone: main session for prose and tracker writes. Team mode assigns PM under the common ownership rules. Spawn a scout using `../../agents/scout.md` only when the card needs real file/system paths; skip pure product wording. **Budget delta:** skip scouts.

## Steps

1. Gather intent from `$ARGUMENTS`, the thread, and any named ticket (fetch via the configured issue connector (Linear when available) if an id is present).
2. If Hints need accurate paths and they are unknown, focused scouts using `../../agents/scout.md`.
3. Draft a **scannable** issue (create or update):

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

4. Prepare the concrete title and body. Ask for any product decision or external-write authority not already supplied; honor an explicit request to create/update the card.
5. Create or update via the configured issue connector (Linear when available). Keep description short; put design debate in comments only if needed.
6. Return issue id + URL.

## Output

**Done / Blocked / Needs you** + issue link + next action (often `/blade-plan <id>`).
