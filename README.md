# blade

```text
      ╔══════════════════════════════════════════════════════╗
      ║                                                      ║
      ║     刃  B L A D E                                    ║
      ║     ───────────────────────────────────              ║
      ║                                                      ║
      ║       ／|、                                          ║
      ║     (˚ˎ。7     lightweight PE workflow for Grok      ║
      ║      |、˜〵     one command · ten verbs · real PRs   ║
      ║      じしˍ,)ノ                                       ║
      ║                                                      ║
      ║     ████████████████████████████████████▓▒░¤         ║
      ║     └ tsuba ┘└──────── blade ──────────┘ tip        ║
      ║                                                      ║
      ║            plan · build · ship · release             ║
      ║                                                      ║
      ╚══════════════════════════════════════════════════════╝
```

A **Grok** plugin for the product-engineering loop: plan → build → review → ship → release.

One entrypoint. Thin Linear glue. Subagents only when they pay off. No lifecycle OS.

```text
  /blade plan    /blade build    /blade ship    /blade release
```

---

## What it is

| You type | What happens |
|---|---|
| `/blade plan …` | Research, options, short plan — waits for approval |
| `/blade build …` | Implements (scout/critic only when useful) |
| `/blade ship` | Preflight → open PR → **tend** CI & review until healthy |
| `/blade release` | Merge + Linear Done — only when you say so |

```text
  idea ──► plan ──► build ──► review ──► ship ──► release
                      │                    │
                   code lands         PR + tend
```

---

## Why it exists

Most AI workflows either freestyle with no ship discipline, or bury you in ceremony (ledgers, always-on worktrees, dual routers, novel-length plans).

Blade aims for the middle:

| Heavy workflow plugins | **blade** |
|---|---|
| Ledgers / thoughts/ / multi-agent OS | Chat + Linear + PR |
| Plan files by default | Plan in chat; build after you approve |
| Ship ≈ open a PR and leave | Ship = **preflight + open + tend** |
| Merge mixed into ship | Ship opens; **release** merges |
| Many entrypoints | **`/blade <verb>`** |

**Right-size:** typo → just fix. Multi-area → plan first. Push / PR / merge / Done → always confirm.

---

## Install

**Requires:** [Grok](https://x.ai) and a Linear MCP already configured (blade does not own Linear auth).

```bash
git clone https://github.com/volpe/blade.git ~/dev/blade
grok plugin install ~/dev/blade --trust
grok plugin enable blade
```

Reload plugins (`r` in `/plugins`, or restart Grok), then:

```text
/blade help
```

```bash
grok plugin uninstall blade
```

---

## Quick examples

Opinionated style: **one command**, verb as the first word.

### Small fix

```text
you    /blade build flaky timeout in the retry helper
blade  implements · runs the smallest real check
you    /blade ship
blade  preflight · asks once · PR · tends CI / comments
you    /blade release
blade  merge · Linear Done
```

### Feature with a ticket

```text
you    /blade plan ENG-1234 export invoices as CSV
blade  scouts · options · phased plan in chat
you    yes
you    /blade build
blade  implements against the plan
you    /blade review          # optional — ship runs critic if needed
you    /blade ship
blade  template + labels + open + watch until healthy
you    /blade release
```

### Production incident

```text
you    /blade debug 500s on /checkout after the last deploy
blade  hypotheses → evidence → root cause → fix
you    /blade test
you    /blade ship
```

### New initiative

```text
you    /blade project multi-region failover for billing
blade  Linear project · milestones · vertically sliced cards
you    /blade card refine the “shadow traffic” slice
you    /blade plan <that card>
# then build → ship → release as above
```

---

## Commands

```text
/blade <verb> [args…]
```

| Verb | Purpose |
|---|---|
| `help` | Verb table |
| `project` | Initiative → Linear project + milestones + cards |
| `card` | Draft or refine **one** Linear issue |
| `plan` | Research + short plan — **approve before build** |
| `build` | Implement from ticket / plan / freeform |
| `debug` | Hypothesis → evidence → root cause → fix |
| `review` | Critic pass on tree / branch / PR |
| `polish` | Three rounds of polish on the current change |
| `test` | Decide verification · run it · report evidence |
| `ship` | Preflight → PR → **tend** CI & review |
| `release` | Merge ready PR → delete branch → Linear **Done** |

Hyphen forms (`/blade-plan`, …) also work. Prefer `/blade <verb>`.

```text
  project ── card ── plan ── build ── debug
                ╲              │
                 polish · test · review
                              │
                           ship ──► release
                           (tend)
```

---

## Ship

Most tools open a PR and stop. Blade keeps going until the PR is healthy (or blocked).

```text
                 /blade ship
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   preflight       open           tend (default)
   template        push           CI failed → fix
   labels          PR body        review threads → fix
   critic          Linear         worktree agent
   ask once        labels         push + reply
        │             │             │
        └─────────────┴──────► healthy
                                   │
                                   ▼
                            /blade release
```

**Preflight** — local PR template → org `.github` → fallback · soft-propose labels · hard-ask when required · no silent rebase  

**Tend (default)** — one PR · fixes in a worktree · ≤3 code commits per cycle · substantive replies · **never merges**  

Skip tend: `/blade ship ship-only` (or say “open only”).

---

## Agents

| Agent | Role |
|---|---|
| `scout` | Read-only locate/trace · `file:line` maps |
| `critic` | Blocking / Should-fix / Nits · ship verdict |

Ship tend uses a worktree `general-purpose` agent so the main checkout stays clean.

---

## Design choices

1. Right-size ceremony to the work  
2. Plans stay in chat unless you ask to persist  
3. Confirm push, PR, merge, and Linear Done  
4. Durable surfaces: chat · Linear · PR (no ledgers)  
5. Every verb ends **Done** / **Blocked** / **Needs you** + one next action  

```text
  sword, not tank — confirm the irreversible, then ship
```

---

## End-to-end session

```text
$ /blade plan add rate limiting to the public API

## Goal
Protect public endpoints without locking out real clients.

## Approach
Token bucket on the edge router; limits via env.

## Phases
1. Middleware + tests
2. Defaults + metrics
3. Docs · ship

Needs you — approve / adjust / kill?
```

```text
$ yes

$ /blade build
# …implements · tests green…

Done — rate limit middleware + unit tests.
Next: /blade ship
```

```text
$ /blade ship

# preflight: template · labels: enhancement · base clean
# propose: open PR + tend

$ yes

# push → PR #42
# lint fails → worktree fix → push
# review comment → addressed in abc1234 → reply with SHA

Done — PR #42 healthy.
Next: /blade release
```

```text
$ /blade release
# checks green · merge · branch deleted · Linear Done

Done.
```

---

## Layout

```text
blade/
├── .grok-plugin/plugin.json
├── agents/                 # scout, critic
├── skills/
│   ├── blade/              # hub + shared spine
│   ├── blade-plan/ …       # verbs (routed by first word)
│   └── blade-ship/
│       ├── SKILL.md
│       └── references/     # preflight + tend
└── README.md
```

---

**One command. Ten verbs. Plan when it matters. Confirm before you push. Tend until green. Release on purpose.**

```text
                    ⚔  刃  ⚔
```
