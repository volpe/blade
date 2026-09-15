---
name: blade-workflow
description: Run requested Blade product-engineering commands and the Blade team in pi. Use for /blade, /blade-team, or a Blade verb; not unrelated work.
---
# Blade for pi

Read [the pi adapter](../../runtime.md) and [the shared hub](../../skills/blade/SKILL.md) completely before acting. Paths resolve from this file, not from the user's project. Stay in the user's project.

Use the verb selected by the prompt. For the hub, strip the first word from the request and select its exact row below. Empty input or help shows the command table; unknown verbs show valid choices and request clarification. Never construct a path from an arbitrary argument. Read the selected playbook completely, using the rest of the request as its arguments. An empty direct command uses conversation/project context. Follow the pi compatibility rules in the adapter; workflow names are not recursive slash-command execution.

| Verb | Playbook |
|---|---|
| build | [blade-build](../../skills/blade-build/SKILL.md) |
| card | [blade-card](../../skills/blade-card/SKILL.md) |
| debug | [blade-debug](../../skills/blade-debug/SKILL.md) |
| plan | [blade-plan](../../skills/blade-plan/SKILL.md) |
| polish | [blade-polish](../../skills/blade-polish/SKILL.md) |
| project | [blade-project](../../skills/blade-project/SKILL.md) |
| release | [blade-release](../../skills/blade-release/SKILL.md) |
| review | [blade-review](../../skills/blade-review/SKILL.md) |
| ship | [blade-ship](../../skills/blade-ship/SKILL.md) |
| team | [blade-team](../../skills/blade-team/SKILL.md) |
| test | [blade-test](../../skills/blade-test/SKILL.md) |
