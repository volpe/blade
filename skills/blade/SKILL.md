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

| Verb | Skill | Purpose |
|---|---|---|
| `project` | `blade-project` | Initiative → Linear project + cards |
| `card` | `blade-card` | One Linear issue |
| `plan` | `blade-plan` | Research + plan in chat |
| `build` | `blade-build` | Implement |
| `debug` | `blade-debug` | Hypothesis → fix |
| `review` | `blade-review` | Critic on the diff |
| `polish` | `blade-polish` | Three polish rounds |
| `test` | `blade-test` | Smallest meaningful checks |
| `ship` | `blade-ship` | Commit → preflight → PR → tend |
| `release` | `blade-release` | Merge + Linear Done |
| empty / `help` | — | Print this table; stop |

Strip the verb from `$ARGUMENTS` and run that verb’s playbook exactly (same as invoking `/blade-<verb>`). From this skill’s directory, read `../blade-<verb>/SKILL.md`. Spine below is already in context for `/blade <verb>`.

---

## Shared spine (all blade verbs)

Direct `/blade-<verb>`: from that skill’s directory, read `../blade/SKILL.md` unless this turn already includes this section.

### Linear

- Use the **existing Linear MCP** already configured in Grok. Do not invent a second Linear path.
- If a ticket id appears (args, branch name, commits, thread), **fetch it first** and treat it as intent.
- Write back only what happened: status when stage clearly changes, short comment with outcome + links.
- Never invent field values you did not read. Prefer update-over-guess. Resolve status **names from the issue’s available states** — the table is intent, not labels.
- If Linear MCP is unavailable: say so, continue the work, and print the intended Linear writes for the user.

| Stage | Status (intent) |
|---|---|
| plan | no status change (optional short “plan ready” comment) |
| build | started / In Progress |
| ship | in review |
| release | done — **ask first** |

Progress statuses write without waiting. **Done** is irreversible: ask first.

### Confirm the irreversible

Always ask before: push, open/update a PR, merge, Linear Done. Never force-push shared branches. Never push to `main`/`master` or force-merge onto them without an extra explicit confirm.

### Right-size

Ceremony only — when to plan vs just build. Do not recut the product to fit a smaller row.

| Size | Ceremony |
|---|---|
| Typo / one-liner / obvious fix | Do it. Skip plan. |
| Single coherent change, clear scope | Plan in chat or none; build on main thread. |
| Multi-area, unclear, or risky | `/blade-plan` → user approval → `/blade-build`. |

### Plans

- **Chat only by default.** Do not write plan files unless the user asks or explicitly wants resume-later docs.
- Optional: append a short plan summary to the Linear issue only if the user asks.
- How to size a plan (keep the Goal, phase if large, later phases optional) lives in `/blade-plan`.

### Subagents

**Default: unconstrained.** Use as many subagents as useful for work that (a) **reduces main-thread context**, or (b) **can run in parallel** without waiting on another spawn. No fixed scout cap. Parent synthesizes; do not spawn overlapping missions.

| Use subagents for | How |
|---|---|
| Locate / research legs | **N× `blade:scout`** (else `explore`) in parallel — one focused mission each. Read-only fan-out is unconstrained. |
| Fat / multi-area implement | **One** `general-purpose` with a self-contained brief (or main thread). **Writers stay serial** on the shared checkout — never parallel implementers. |
| Non-trivial review | `blade:critic` (else from this file’s directory read `../../agents/critic.md` on the main thread); security emphasis for auth/secrets/uploads/permissions |
| Ship tend (CI / review fixes) | **One** `general-purpose` + `isolation: "worktree"` |

**Budget mode** — when the user signals constrained tokens/compute (`budget`, `cheap`, `constrained`, `token budget`, `main thread only`, `don’t spawn`): cap scouts at 1–2, prefer main thread, skip nice-to-have fan-out. A verb may add a stricter delta (e.g. no scouts).

**Still never spawn for:** pure Linear status, PR body from known facts, one-file edits you already understand, card prose with no codebase research.

### Artifacts & resume

- Default durable surfaces: **chat + Linear + PR**.
- No ledgers, no `thoughts/` paths.
- Worktrees only for **ship tend** (isolated writer). Everywhere else: main thread. Parallel **writers** are never allowed on the shared checkout; parallel **readers** (`blade:scout` / `blade:critic`) are fine.
- Resume = re-read Linear (if any) + `git status` + recent commits + open PR.

### Output contract

Every verb ends with exactly one of:

- **Done** — what changed + links
- **Blocked** — what is stuck + what is needed
- **Needs you** — decision or confirmation (especially ship / release)

Plus a single next-action line.
