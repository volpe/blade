# blade

```text
      ╔══════════════════════════════════════════════════════════╗
      ║                                                          ║
      ║     刃                                                   ║
      ║    B L A D E                                             ║
      ║    ─────────────────────────────────────────             ║
      ║                                                          ║
      ║      ／|、                                               ║
      ║    (˚ˎ。7     you weren't supposed to find this.         ║
      ║     |、˜〵    but here you are.                          ║
      ║     じしˍ,)ノ                                            ║
      ║                                                          ║
      ║    ─=≡Σ (((( つ◕ل͜◕)つ  /blade ship                     ║
      ║        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>                   ║
      ║              one slash · ten verbs · real PRs            ║
      ║                                                          ║
      ║    █████████████████████████████████████▓▒░¤             ║
      ║    └─ tsuba ─┘└───────── blade ─────────┘kiss            ║
      ║                                                          ║
      ║         draw · cut · tend · sheathe                      ║
      ║                                                          ║
      ╚══════════════════════════════════════════════════════════╝
```

**You found it.**

The PE workflow that feels like cheating — **one slash command**, a handful of verbs, and a Grok agent that actually **ships**.

Not another “AI project manager.”  
Not a 400-file lifecycle OS with ledgers, dual routers, and a thoughts/ folder that judges you.

Just **blade.** Draw it. Cut. Sheathe.

```text
   /blade plan      /blade build      /blade ship      /blade release
        ╲                │                 │                 ╱
         ╲               │                 │                ╱
          ╲══════════════╪═════════════════╪═══════════════╱
                         │                 │
                   the only command     the only loop
                   you need to learn    that matters
```

---

## What is this?

**Blade** is a Grok plugin for product engineers who want structure without ceremony.

| You type | Blade does |
|---|---|
| `/blade plan …` | Research, options, short plan — waits for your yes |
| `/blade build …` | Implements on the main thread (scout/critic only when useful) |
| `/blade ship` | Preflight → PR → **tends CI & review comments** until green |
| `/blade release` | Merge + Linear Done — on purpose, with your say-so |

Same blade. Different cut.

```text
  idea ──► plan ──► build ──► review ──► ship ──► release ──► 茶
                      │                    │
                   code lands          PR + tend
                                       (watches)
```

---

## Why it hits different

Most AI workflows fall into two traps:

```text
  vibes-only chat          ──►  cool demo, no ship discipline
  enterprise agent OS      ──►  cool README, need a map to merge
```

Blade lives in the cut between them:

| The tank | **The blade** |
|---|---|
| Ledgers, worktrees for every phase | Chat + Linear + PR |
| Novel-length plans by default | Plan in chat; build when you nod |
| “Ship” = open a PR and ghost | **Ship = preflight + open + tend** |
| Merge mixed into everything | Ship opens. **Release** lands. |
| Ten entrypoints to memorize | **`/blade <verb>`** — that’s it |

Right-size is law: typo → just fix. Multi-area → plan first. Irreversible → always ask.

---

## Install (30 seconds to first cut)

**Needs:** [Grok](https://x.ai) · Linear MCP already wired (blade doesn’t re-auth Linear)

```bash
git clone https://github.com/volpe/blade.git ~/dev/blade
grok plugin install ~/dev/blade --trust
grok plugin enable blade
```

Reload plugins (`r` in `/plugins` or restart Grok):

```text
you   →  /blade help
blade →  the verb table. pick a cut.
```

```bash
grok plugin uninstall blade   # if you ever want to put the sword down
```

---

## The dojo — 60-second forms

Every example is the **opinionated** way: one command, verb as the first word.

### Form I — small fix, full loop

```text
you    /blade build flaky timeout in the retry helper
blade  implements · runs the smallest real check
you    /blade ship
blade  preflight · asks once · PR · tends CI/comments
you    /blade release
blade  merge · Linear Done · blade sheathed
```

### Form II — real feature, ticket in hand

```text
you    /blade plan ENG-1234 export invoices as CSV
blade  scouts the code · options · phased plan in chat
you    yes
you    /blade build
blade  swings against the plan
you    /blade review          # optional — ship will critic if needed
you    /blade ship
blade  template + labels + open + watch until healthy
you    /blade release
```

### Form III — production is on fire

```text
you    /blade debug 500s on /checkout after the last deploy
blade  hypotheses → evidence → root cause → fix
you    /blade test
you    /blade ship
```

### Form IV — greenfield initiative

```text
you    /blade project multi-region failover for billing
blade  Linear project · milestones · vertically sliced cards
you    /blade card refine the “shadow traffic” slice
you    /blade plan <that card>
# …then build → ship → release like Form II
```

---

## The ten cuts

```text
  /blade <verb> [args…]
```

| Verb | Cut |
|---|---|
| `help` | Show the table. Breathe. |
| `project` | Initiative → Linear project + milestones + cards |
| `card` | Draft or refine **one** Linear issue |
| `plan` | Research + short plan — **approve before build** |
| `build` | Implement from ticket / plan / freeform |
| `debug` | Hypothesis → evidence → root cause → fix |
| `review` | Critic pass on tree / branch / PR |
| `polish` | Three rounds of UI/code polish |
| `test` | Decide verification · run it · show evidence |
| `ship` | Preflight → PR → **tend** CI & review |
| `release` | Merge ready PR → delete branch → Linear **Done** |

(`/blade-plan` style aliases exist if you like hyphen energy. The **way of the blade** is one command.)

```text
  project ── card ── plan ── build ── debug
                ╲              │
                 polish · test · review
                              │
                           ship ──► release
                           (tend)
```

---

## Ship is the signature move

Other tools open a PR and walk away.  
Blade **stays in the fight**.

```text
                    /blade ship
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    PREFLIGHT         OPEN            TEND ★
    template          push            CI red? → fix
    labels            PR body         review? → fix
    critic            Linear          worktree agent
    ask once          labels          push + reply
         │               │               │
         └───────────────┴───────► HEALTHY
                                      │
                                      ▼
                               /blade release
```

**Preflight** — local PR template → org `.github` → blade fallback · soft label propose · hard ask when required · never silent-rebase  

**Tend (default)** — one PR · worktree-isolated fixes · ≤3 code commits/cycle · real replies, not “will fix” · **never merges**  

Skip the watch: `/blade ship ship-only` (or say “open only”).

---

## Allies (agents)

Spawned when the cut needs them — not for every breath.

| Ally | Role |
|---|---|
| `scout` | Read-only locate/trace · returns `file:line` maps |
| `critic` | Blocking / Should-fix / Nits · ship verdict |

Ship tend summons a worktree `general-purpose` agent so your main checkout stays pure.

---

## The code of the blade

```text
  1. Right-size the ceremony
  2. Plan in chat — not a second wiki
  3. Confirm the irreversible (push, PR, merge, Done)
  4. Durable surfaces: chat · Linear · PR
  5. Every verb ends: Done | Blocked | Needs you
     …plus exactly one next cut
```

```text
  ┌─────────────────────────────────────────────┐
  │  sword, not tank                            │
  │  confirm the cut · then swing clean         │
  │  sheath when main is green                  │
  └─────────────────────────────────────────────┘
```

---

## Full battle — what a session feels like

```text
$ /blade plan add rate limiting to the public API

## Goal
Protect public endpoints without locking real clients out.

## Approach
Token bucket on the edge router · env-tuned limits.

## Phases
1. Middleware + tests
2. Defaults + metrics
3. Docs · ship

Needs you — approve / adjust / kill?
```

```text
$ yes

$ /blade build
# …code lands · tests green…

Done — rate limit middleware + unit tests.
Next: /blade ship
```

```text
$ /blade ship

# preflight: template · labels: enhancement · base clean
# propose: open PR + tend (default)

$ yes

# push → PR #42
# lint red → worktree fix → push
# reviewer thread → addressed in abc1234 → reply with SHA

Done — PR #42 healthy.
Next: /blade release
```

```text
$ /blade release
# checks green · merge · branch gone · Linear Done

Done.  ⚔
```

That’s the whole game. No ledger. No novel. No second brain.

---

## Layout

```text
blade/
├── .grok-plugin/plugin.json
├── agents/          scout · critic
├── skills/
│   ├── blade/                 ← the one command (hub + spine)
│   ├── blade-plan/ …          ← verbs (routed by first word)
│   └── blade-ship/
│       ├── SKILL.md
│       └── references/        preflight · tend
└── README.md                  ← you are here
```

---

## One line

**One command. Ten verbs. Plan when it matters. Confirm the cut. Tend until green. Release on purpose.**

```text
                         ⚔
                    ═══ BLADE ═══
                   draw · cut · ship
                         刃
```

---

<p align="center">
  <sub>built for engineers who open PRs for a living · public · fork freely · stay sharp</sub>
</p>
