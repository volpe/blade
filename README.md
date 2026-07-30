# blade

A **lightweight** product-engineering workflow plugin for [Grok](https://x.ai).

Structured `/` commands for everyday PE work — plan, build, debug, review, polish, test, ship, release — with thin Linear read/write and subagents only when isolation or parallelism pays off.

Not a lifecycle OS. No ledgers, dual-domain routers, or thoughts/ ceremony. Sword, not tank.

## Install

Requires Linear MCP already configured in Grok (blade does not bundle it).

```bash
grok plugin install ~/dev/blade --trust
grok plugin enable blade
```

Reload plugins (`r` in `/plugins`, or restart Grok). Verify:

```bash
grok plugin details blade
grok inspect
```

## Commands

| Command | Purpose |
|---|---|
| `/blade` | Help + route by first word |
| `/blade-project` | Initiative → Linear project + milestones + cards |
| `/blade-card` | Draft or refine one Linear issue |
| `/blade-plan` | Research + short plan (chat only; approve before build) |
| `/blade-build` | Implement from ticket / plan / freeform |
| `/blade-debug` | Hypothesis → evidence → root cause → fix |
| `/blade-review` | Review working tree / branch / PR |
| `/blade-polish` | Three rounds of UI/code polish on the current change |
| `/blade-test` | Decide verification, run it, report evidence |
| `/blade-ship` | Preflight → commit → push → PR → Linear → **tend CI/review** (**always asks first**; default tend) |
| `/blade-release` | Merge a ready PR → delete branch → Linear **Done** (**always asks first**) |

## Agents

| Agent | Role |
|---|---|
| `scout` | Read-only locate/trace; returns `file:line` map + key files |
| `critic` | Review with Blocking / Should-fix / Nits + ship verdict |

## Design choices

- **Linear:** use your existing global MCP; no plugin-owned auth
- **Plans:** chat only by default (persist only if you ask)
- **Ship:** always confirm before push / open-or-update PR; preflight fills PR template + proposes labels; **tends** the PR for CI/review fixes by default (worktree-isolated; `ship-only` to skip)
- **Release:** always confirm before merge / Linear Done (ship opens and tends; release lands it)
- **Subagents:** main thread by default; scout/critic when useful; ship tend uses a worktree subagent

## Layout

```text
blade/
  .grok-plugin/plugin.json
  skills/          # /blade* slash commands
    blade-ship/
      SKILL.md
      references/  # preflight + tend recipes
  agents/          # scout, critic
  README.md
```

## Uninstall

```bash
grok plugin uninstall blade
```
