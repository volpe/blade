---
name: blade
description: >
  Lightweight PE workflow hub. Use for /blade help, or when the user wants
  the blade workflow (project, card, plan, build, debug, review, polish, test, ship, release).
  Super-thin alternative to heavy lifecycle plugins.
argument-hint: "[project|card|plan|build|debug|review|polish|test|ship|release|help] [args…]"
disable-model-invocation: true
---

# /blade

Lightweight product-engineering workflow. Route by first word of `$ARGUMENTS`.

| Verb | Skill to follow |
|---|---|
| `project` | `blade-project` |
| `card` | `blade-card` |
| `plan` | `blade-plan` |
| `build` | `blade-build` |
| `debug` | `blade-debug` |
| `review` | `blade-review` |
| `polish` | `blade-polish` |
| `test` | `blade-test` |
| `ship` | `blade-ship` |
| `release` | `blade-release` |
| empty / `help` | print the table above + one-line purpose each; stop |

Strip the verb from `$ARGUMENTS` and run that verb’s playbook exactly (same as invoking `/blade-<verb>`).

---

## Shared spine (all blade verbs)

### Linear

- Use the **existing Linear MCP** already configured in Grok. Do not invent a second Linear path.
- If a ticket id appears (args, branch name, commits, thread), **fetch it first** and treat it as intent.
- Write back only what happened: status when stage clearly changes, short comment with outcome + links.
- Never invent field values you did not read. Prefer update-over-guess.
- If Linear MCP is unavailable: say so, continue the work, and print the intended Linear writes for the user.

### Right-size

| Size | Ceremony |
|---|---|
| Typo / one-liner / obvious fix | Do it. Skip plan. |
| Single coherent change, clear scope | Short plan in chat or none; build on main thread. |
| Multi-area, unclear, or risky | `/blade-plan` → user approval → `/blade-build`. |

If work fits **one card**, `/blade-project` must refuse project ceremony and offer `/blade-card`.

### Plans

- **Chat only by default.** Do not write plan files unless the user asks or explicitly wants resume-later docs.
- Optional: append a short plan summary to the Linear issue only if the user asks.

### Subagents

Spawn only when one of these is true:

| Condition | Action |
|---|---|
| Unknown blast radius / “where does X live?” | 1–2× `scout` (parallel ok) |
| Main context is fat / multi-area implement | Fresh `general-purpose` with a self-contained brief |
| Non-trivial diff before ship | 1× `critic` |
| Auth, secrets, uploads, permissions | `critic` with security emphasis |
| Ship tend (CI / review fixes) | 1× `general-purpose` with `isolation: "worktree"` |

**Never** spawn for: card writing, PR body, Linear status, one-file edits you already understand.

Prefer Grok built-ins (`explore`, `plan`, `general-purpose`) when plugin agents are unavailable; use plugin `scout` / `critic` when present.

### Artifacts & resume

- Default durable surfaces: **chat + Linear + PR**.
- No ledgers, no `thoughts/` paths.
- Worktrees only where a verb requires isolation (**ship tend** fixes). Everywhere else: main thread.
- Resume = re-read Linear (if any) + `git status` + recent commits + open PR.

### Output contract

Every verb ends with exactly one of:

- **Done** — what changed + links
- **Blocked** — what is stuck + what is needed
- **Needs you** — decision or confirmation (especially ship / release)

Plus a single next-action line.
