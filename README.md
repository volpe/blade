# blade

```text
          ░▒▓█  B L A D E  █▓▒░
     ─────────────────────────────────
      ╱|、
    (˚ˎ 。7     ship fast.
     |、˜〵      stay sharp.
     じしˍ,)ノ   no tank required.
```

**Lightweight product-engineering workflow for [Grok](https://x.ai).**  
One sword, ten verbs — from Linear card to green PR without a lifecycle OS.

> Not a tank. Not a second project manager.  
> **Blade** is the PE loop you actually run every day: plan → build → review → ship → release.

---

## Why blade?

Most AI “workflows” either:

- do **nothing structured** (vibes-only chat), or  
- do **everything** (ledgers, worktrees for every phase, dual-domain routers, novel-length plans).

Blade sits in the cut:

| Heavy lifecycle plugins | **blade** |
|---|---|
| Ledgers, thoughts/, multi-agent OS | Chat + Linear + PR |
| Always-on ceremony | Right-size: one-liner → just do it |
| Ship = “open a PR maybe” | Ship = **preflight → PR → tend CI/review** |
| Merge mixed into ship | **Ship opens; release lands** |

```text
  idea ──► plan ──► build ──► review ──► ship ──► release
            │         │          │         │         │
         chat only   code     critic    PR+tend    merge
         (approve)           (block?)   (watch)    (Done)
```

---

## Install

**Requires:** [Grok](https://x.ai) + Linear MCP already configured (blade does not bundle Linear auth).

```bash
# from a clone
git clone https://github.com/volpe/blade.git ~/dev/blade
grok plugin install ~/dev/blade --trust
grok plugin enable blade
```

Reload plugins (`r` in `/plugins`, or restart Grok), then:

```bash
grok plugin details blade
# in chat:
/blade help
```

**Updating a path install:** `git -C ~/dev/blade pull`, then reload plugins (`r` in `/plugins`). If skills look stale, re-run `grok plugin install ~/dev/blade --trust` and `grok plugin enable blade`.

```bash
# uninstall
grok plugin uninstall blade
```

---

## 60-second tour

### Fix something small

```text
you   →  /blade-build flaky timeout in retry helper
blade →  implements + runs the smallest check
you   →  /blade-ship
blade →  preflight body/labels → asks once → PR → tends CI/comments
you   →  /blade-release          # when green
```

### Bigger feature (with a ticket)

```text
you   →  /blade-plan ENG-1234 add export CSV for invoices
blade →  parallel `blade:scout`s, options, phased plan in chat
you   →  approve
you   →  /blade-build
blade →  implements against the plan
you   →  /blade-review           # optional; ship runs blade:critic if needed
you   →  /blade-ship
blade →  template + labels + open + watch until healthy
you   →  /blade-release
```

### Debug when prod is on fire

```text
you   →  /blade-debug users see 500 on /checkout after deploy
blade →  hypotheses → evidence → root cause → fix
you   →  /blade-test && /blade-ship
```

---

## Commands

Route with `/blade <verb> …` or call `/blade-<verb>` directly.

| Command | What it does |
|---|---|
| `/blade` | Help + route by first word |
| `/blade-project` | Initiative → Linear project + milestones + cards |
| `/blade-card` | Draft or refine **one** Linear issue |
| `/blade-plan` | Research + short plan in chat — **approve before build** |
| `/blade-build` | Implement from ticket / plan / freeform |
| `/blade-debug` | Hypothesis → evidence → root cause → fix |
| `/blade-review` | Review working tree / branch / PR |
| `/blade-polish` | Three rounds of UI/code polish on the current change |
| `/blade-test` | Decide verification, run it, report evidence |
| `/blade-ship` | Commit → preflight → push → PR → Linear → **tend** |
| `/blade-release` | Merge ready PR → delete branch → Linear **Done** |

```text
  /blade-project    big bets → many cards
  /blade-card       one card, done right
  /blade-plan       think before you swing
  /blade-build      swing
  /blade-debug      when the swing missed
  /blade-review     critic's eye
  /blade-polish     make it gleam
  /blade-test       prove it
  /blade-ship       leave the forge  ──►  PR + tend
  /blade-release    land the blow    ──►  main + Done
```

---

## Ship is the party trick

Most tools stop at “PR opened.” Blade **ships and tends**.

```text
                 /blade-ship
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   before open      open / update      tend
   • commit         • push           • CI red → fix
   • preflight      • PR body        • review threads
     template       • Linear link    • worktree agent
     labels         • labels         • push + reply
     critic
     ask once
        │             │             │
        └─────────────┴──────► healthy ──► /blade-release
```

**Preflight**

- Resolves PR template: local `.github` → org `.github` repo → blade fallback  
- Soft-proposes labels (Linear match / existing type labels); hard-asks when required  
- Warns if base is behind; never silent-rebases  

**Tend (on by default)**

- Watches the **one** PR you just opened  
- Fixes CI failures and review comments in a **worktree-isolated** subagent  
- Cap of 3 code-fix commits per cycle; real replies (no “will fix” platitudes)  
- **Never merges** — that’s `/blade-release`  
- Opt out: `/blade-ship ship-only` or say “open only”

---

## Agents

**Default: fan out readers.** Parallel `blade:scout` / `blade:critic` when it cuts main-thread context — one focused mission per scout, no fixed cap. **Writers stay serial** on the shared checkout (one implementer or main thread). Throttle with **budget** / **cheap** / **main thread only** (1–2 scouts).

| Agent | Role |
|---|---|
| `blade:scout` | Read-only focused locate/trace → compact `file:line` map + hand-offs (spawn N in parallel) |
| `blade:critic` | Blocking / Should-fix / Nits + ship verdict |

Ship tend uses a worktree `general-purpose` agent so the main checkout stays clean.

---

## Design choices (the blade spine)

- **Linear** — your existing MCP; team’s real state names; started → in review → done (ask before Done)  
- **Plans** — chat only by default (persist only if you ask)  
- **Right-size** — typo? just fix. multi-area? plan first  
- **Subagents** — `blade:scout` / `blade:critic`; unconstrained fan-out by default; **budget mode** on request  
- **Confirm the irreversible** — push, PR, merge, Linear Done always ask first  
- **Durable surfaces** — chat + Linear + PR (no ledgers, no thoughts/ ceremony)  
- **Output contract** — every verb ends **Done** / **Blocked** / **Needs you** + one next action  

```text
  ┌──────────────────────────────────────────┐
  │  sword, not tank                         │
  │  confirm the cut, then swing clean       │
  └──────────────────────────────────────────┘
```

---

## Example: end-to-end in chat

```text
$ /blade-plan add rate limiting to public API

## Goal
Protect public endpoints from abuse without locking legit clients out.

## Approach
Token bucket middleware on the edge router; config via env.

## Phases
1. Middleware + tests
2. Wire default limits + metrics
3. Docs + ship

Needs you — approve / adjust / kill?
```

```text
$ yes

$ /blade-build
# …implements, runs tests…

Done — rate limit middleware + unit tests green.
Next: /blade-ship
```

```text
$ /blade-ship

# preflight shows template, labels: enhancement, base up to date
# propose: open PR + tend

$ yes

# push → PR #42 → tend watches CI
# CI fails lint → worktree fix → push → green
# reviewer asks for a comment → addressed in abc1234

Done — https://github.com/you/app/pull/42 healthy
Next: /blade-release
```

---

## Layout

```text
blade/
├── .grok-plugin/plugin.json
├── agents/
│   ├── scout.md
│   └── critic.md
├── skills/
│   ├── blade/                 # hub + spine
│   ├── blade-plan/
│   ├── blade-build/
│   ├── blade-ship/
│   │   ├── SKILL.md
│   │   └── references/        # preflight + tend recipes
│   ├── blade-release/
│   └── …                      # card, debug, review, polish, test, project
└── README.md
```

---

## Philosophy in one line

**Plan when it matters. Build small on the main thread. Confirm the irreversible. Tend until green. Release on purpose.**

```text
     ⚔  blade  ·  v0.5  ·  ship sharp
```

---

## License

Use freely in your Grok setup. Contributions and forks welcome on the public repo.
