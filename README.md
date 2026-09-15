# Blade

```text
    \_________________________________________/
       ____   __     ___    ____    ______
      / __ ) / /    /   |  / __ \  / ____/
     / __  |/ /    / /| | / / / / / __/
    / /_/ // /___ / ___ |/ /_/ / / /___
   /_____//_____//_/  |_/_____/ /_____/
    /_________________________________________\
```

Reusable product and engineering workflows plus a team of task-specific experts for **Codex, pi, Grok, and Claude Code**. Use a focused command for everyday engineering work, or assemble experts for development, research, analysis, writing, operations, and other tasks.

## Choose a host

| Path | Installation | Team communication |
|---|---|---|
| [codex/](codex/README.md) | Codex skill plugin + local marketplace | Native collaboration; direct peer messages where exposed, otherwise coordinator relay |
| [pi/](pi/README.md) | Pi package with prompts, skill, and team extension | Separate SDK sessions with peer messages |
| [grok/](grok/README.md) | Grok plugin with skills and registered roles | Real subagents with coordinator-relayed messages |
| [claude/](claude/README.md) | Claude Code plugin + local marketplace | Native subagents; direct messages where available, otherwise coordinator relay |

Each path contains a self-contained generated package. Shared workflows and role instructions have one source; host adapters handle real tool differences. No provider, model defaults, credentials, or project settings are changed by building Blade.

For a local checkout at `~/dev/blade`:

```sh
# Codex
codex plugin marketplace add ~/dev/blade/codex
codex plugin add blade@blade

# pi
pi install ~/dev/blade/pi/blade

# Grok
grok plugin install ~/dev/blade/grok/blade --trust
grok plugin enable blade

# Claude Code
claude plugin marketplace add ~/dev/blade/claude
claude plugin install blade@blade --scope user
```

Pick one host's instructions, then start or reload its session in **the project you want to work on**. The host guides cover updates, requirements, and removal. Existing root Grok/pi installs remain supported; remove the old install before switching to a dedicated path to avoid duplicate commands.

## Everyday workflows

Use `/blade <verb>` or `/blade-<verb>` in pi/Grok. In Codex, select the installed skill or use `$blade <verb>` / `$blade-<verb>`. In Claude Code, use `/blade:<verb>`, such as `/blade:team`, `/blade:build`, or `/blade:help`.

| Verb | Purpose |
|---|---|
| `project` | Shape an initiative and its milestones/issues |
| `card` | Draft or refine one issue |
| `plan` | Research and propose a scoped approach |
| `build` | Implement an approved or clear request |
| `debug` | Find the cause, fix it, and verify |
| `test` | Run the smallest meaningful checks |
| `polish` | Improve the current UI/code without unrelated cleanup |
| `review` | Review the actual changes and evidence |
| `ship` | Prepare a PR, obtain required authority, open/update it, and tend checks/reviews |
| `release` | Verify readiness and perform an authorized merge |
| `team` | Assemble experts with task-specific purposes and viewpoints |
| `help` | Show the commands |

Linear is optional. Use existing integrations; unavailable remote access does not block local work. Ship opens and tends; release merges. Approval is scoped to the actual actions and honored across follow-up work. No command silently grants permission to publish, reply to people, or merge.

## Work with the team

```text
# pi or Grok:
/blade-team Deliver, guided: add CSV export for filtered invoices

Codex:
$blade-team Deliver, guided: add CSV export for filtered invoices

Claude Code:
/blade:team Deliver, guided: add CSV export for filtered invoices
```

The main agent selects a proportionate team for the outcome, complexity, and risks of your request. **There is no fixed roster.** Every expert has a charter defining its purpose, viewpoint, key questions, expected evidence, and decision boundaries.

- **Product feature:** product, architecture, UX, implementation, testing, and review expertise; add pairing, polish, documentation, or release ownership when useful.
- **Database migration:** data-integrity, query-performance, migration, and security expertise according to the actual risks.
- **Business brief:** domain research, analysis, editing, and independent methods review.

Existing product/engineering role cards remain reusable templates. Custom experts use a generic card plus their task charter. The coordinator covers outcome ownership, production, verification, and independent review without assigning a separate worker to every responsibility. Compatible assignments may be combined; authors cannot independently approve their own work. New evidence can lead to added, specialized, combined, or retired experts, with the reasons and handoffs recorded.

Two independent choices control the work:

- **Explore / Deliver:** develop creative scope options, or protect the agreed scope.
- **Guided / autonomous through a boundary:** pause at applicable scope, design/approach, delivery, and release checkpoints by default, or authorize continuation through named stages. For example: “Continue through opening the PR; stop before merging.”

Agents exchange actual messages or explicit lead relays. When useful, pairing uses short implementation checkpoints and explicit driver handoffs. One writer owns a shared checkout; formal review stays independent. Acceptance evidence and sign-offs identify the candidate they cover. Only relevant workers run, within host limits. Non-code work uses appropriate source checks, calculations, artifact review, and handoffs; it does not require software-specific stages.

Read the [team contract](team/workflow.md), [expert-selection guide](team/expert-selection.md), and [project profile](team/project-profile.md). Record product vision, local commands, conventions, and integration/approval choices in the adopting project's existing instructions. Team Steward can be assigned for independent process review. Reusable instruction changes require approval; ordinary task staffing and charters do not modify the installed library.

## Maintain and share

```text
skills/                 Shared playbooks (source)
agents/                 Scout and critic rubrics (source)
team/                   Team contract, selection guide, profile, role templates (source)
adapters/codex/         Codex adapter and manifest source
adapters/pi/            Pi adapter and managed-session extension source
adapters/grok/          Grok adapter source
adapters/claude/        Claude Code adapter and manifest sources
codex/plugins/blade/    Generated Codex plugin
pi/blade/               Generated pi package
grok/blade/             Generated Grok plugin
claude/blade/           Generated Claude Code plugin
scripts/build.mjs       Reproducible package builder
tests/                  Packaging and pi runtime checks
```

Edit sources, then:

```sh
npm run build
npm test
```

Build needs Node 22.19 or later and no npm dependencies. Generated files are committed for installation from a clone; `.blade-generated.json` records their ownership. Do not edit generated packages directly. Tests check stale output, portable package references, host discovery, and pi message/session behavior; see [validation notes](docs/validation.md) for what has and has not been exercised.

Share the repository, or distribute the relevant self-contained host package. Keep all its files together. A model prompt guides behavior; host permissions and repository protections enforce technical boundaries. Monitoring beyond an active run requires an explicitly configured scheduler.
