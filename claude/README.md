# Blade for Claude Code

A native Claude Code plugin with all twelve Blade skills and the shared task-specific expert workflow. Claude uses its own subagents; the package does not depend on Codex, Pi, or Grok.

## Try the local package

From the project you want to work on, launch Claude Code with the generated plugin directory (substitute your Blade checkout path):

```sh
claude --plugin-dir ~/dev/blade/claude/blade
```

Then invoke:

```text
/blade:help
/blade:plan add invoice export
/blade:team Deliver: investigate slow tenant queries. Continue through local findings.
```

Claude adds the `/blade:` plugin namespace to the short skill names: `help`, `project`, `card`, `plan`, `build`, `debug`, `review`, `polish`, `test`, `ship`, `release`, and `team`. Shared playbooks live internally under `playbooks/`. Every expert gets a task-specific charter, and `blade:expert` supports specialties beyond the reusable role templates.

## Install across projects

Register the local marketplace and install its plugin:

```sh
claude plugin marketplace add ~/dev/blade/claude
claude plugin install blade@blade --scope user
```

If your Claude Code setup already has a different marketplace named `blade`, resolve the source/name conflict before adding this one. Run `/reload-plugins` when supported, or start a new Claude Code session, then use the namespaced skills. Check `/help` for skills and `/agents` for the `blade:` agent definitions.

The marketplace is at `.claude-plugin/marketplace.json`; its `./blade` source resolves relative to this `claude/` directory. Keep the marketplace and plugin together when distributing the local install. You can distribute `blade/` alone for `--plugin-dir` use. Generating or validating these files does not install the plugin in your normal Claude configuration.

## Communication and ownership

Ordinary native subagents are sufficient. Blade selects the relevant templates, or the generic expert with a custom charter, and passes actual paths, scope, ownership, and peer identities. It uses direct messaging when the running release exposes it and coordinator relay otherwise. The main session owns final integration and user decisions. Independent review remains separate from authorship.

Experimental Claude Code Agent Teams are optional. Blade does not enable them or alter models, permissions, hooks, or credentials. One writer per shared workspace is enforced through the workflow's ownership contract, not a custom runtime lease. Read-only templates have restricted tool lists; other experts receive the host's permitted tools and still need assigned write ownership.

## Update and remove

Rebuild from the Blade repository root after source changes:

```sh
npm run build
```

For local development, use `--plugin-dir` and `/reload-plugins` (or restart). For marketplace-installed releases:

```sh
claude plugin marketplace update blade
claude plugin update blade@blade
```

Run `/reload-plugins` after updating, or start a new Claude Code session. Version `0.6.1` introduces the short command names above. Marketplace updates use plugin versions; changes with an unchanged version may stay cached. Use `--plugin-dir` to try an unreleased source change. To uninstall this plugin:

```sh
claude plugin uninstall blade@blade --scope user
```

## Verify

```sh
claude plugin validate ~/dev/blade/claude/blade
claude plugin validate ~/dev/blade/claude/.claude-plugin/marketplace.json
```

Run `npm test` at the repository root for generation, relocation, and discovery-contract tests across all hosts. Set `CLAUDE_CLI` to the absolute path of your Claude executable to include the optional native install/discovery check in a temporary configuration. Native validation checks package structure; it does not prove a live team delivery. See [validation notes](../docs/validation.md) for the exact checks performed and limitations.

Read [runtime details](blade/runtime.md), [expert selection](blade/team/expert-selection.md), and [project profile](blade/team/project-profile.md). Official references: [Claude Code plugins](https://code.claude.com/docs/en/plugins), [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces), and [subagents](https://code.claude.com/docs/en/sub-agents).
