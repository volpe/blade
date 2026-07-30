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

**Default: unconstrained.** Use as many subagents as useful for work that (a) **reduces main-thread context**, or (b) **can run in parallel** without waiting on another spawn. No fixed scout cap. Parent synthesizes; do not spawn overlapping missions.

| Use subagents for | How |
|---|---|
| Locate / research legs | **N× `scout`** (or explore) in parallel — one focused mission each (entry points, patterns, tests, risks, auth, …). Read-only fan-out is unconstrained. |
| Fat / multi-area implement | **One** `general-purpose` with a self-contained brief (or main thread). **Writers stay serial** on the shared checkout — never parallel implementers. Worktrees only for ship tend. |
| Non-trivial review | `critic` (main context stays clean); security emphasis for auth/secrets/uploads/permissions |
| Ship tend (CI / review fixes) | **One** `general-purpose` + `isolation: "worktree"` |

**Budget mode** — when the user signals constrained tokens/compute (`budget`, `cheap`, `constrained`, `token budget`, `main thread only`, `don’t spawn`): cap scouts at 1–2, prefer main thread, skip nice-to-have fan-out.

**Still never spawn for:** pure Linear status, PR body from known facts, one-file edits you already understand, card prose with no codebase research.

Prefer plugin `scout` / `critic` when present; else Grok `explore` / `plan` / `general-purpose`.

### Artifacts & resume

- Default durable surfaces: **chat + Linear + PR**.
- No ledgers, no `thoughts/` paths.
- Worktrees only for **ship tend** (isolated writer). Everywhere else: main thread. Parallel **writers** are never allowed on the shared checkout; parallel **readers** (scouts/`critic`) are fine.
- Resume = re-read Linear (if any) + `git status` + recent commits + open PR.

### Output contract

Every verb ends with exactly one of:

- **Done** — what changed + links
- **Blocked** — what is stuck + what is needed
- **Needs you** — decision or confirmation (especially ship / release)

Plus a single next-action line.
