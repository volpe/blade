# Blade for Codex

The Codex path contains a self-contained skill plugin and a repository-local marketplace. It uses Codex's available collaboration tools for real agent runs; it does not add an agent server or alter model defaults.

## Install

From a clone of Blade (substitute your checkout path):

```sh
codex plugin marketplace add ~/dev/blade/codex
codex plugin add blade@blade
```

The first command registers this local marketplace; the second installs its Blade plugin. Then start a new Codex task in the project you want to work on. If a different marketplace is already named `blade`, resolve that name/source conflict before installing. Installation is a separate user action; generating the package does not install it.

Select the installed skill from the picker, or use:

```text
$blade help
$blade-plan add invoice export
$blade-team Deliver, guided: add invoice export
```

Role cards are passed into real spawned agents by the team workflow. They are not automatically registered native agent types. The available tool surface determines whether peers can message directly or the coordinator must relay. If delegation is disabled, team mode reports that limitation. Ordinary single-agent Blade verbs remain usable.

## Update and remove

After pulling source changes, run `npm run build` at the Blade root if generated packages are stale, then reinstall with `codex plugin add blade@blade` and start a new task. Released changes update the package version. For local iterations that need cache invalidation, use Codex's plugin-creator update workflow for the source manifest, then rebuild/reinstall; do not edit the generated bundle.

```sh
codex plugin remove blade@blade
```

See [runtime details](plugins/blade/runtime.md), [team workflow](plugins/blade/team/workflow.md), and [project profile](plugins/blade/team/project-profile.md). No MCP credentials, GitHub access, or Linear connection is bundled.
