# Blade for Grok

The generated `grok/blade` plugin packages the shared Blade workflow and role cards for Grok Build. It uses separate child sessions with messages relayed by the coordinator. Native sibling messaging is not assumed. The [runtime adapter](../adapters/grok/runtime.md) defines the supported handoffs.

## Package

```text
grok/blade/
  .grok-plugin/plugin.json
  skills/<skill-name>/SKILL.md
  agents/<role-name>.md
  team/
```

The generator copies canonical `team/roles/*.md` into the package and registers role definitions under `agents/`. Edit the canonical sources and regenerate; do not hand-edit the generated plugin.

The manifest requires a `name` of 1–64 lowercase letters, digits, or hyphens, with no leading/trailing hyphen. Blade uses `name: "blade"`, a version, and a description; conventional `skills/` and `agents/` directories need no path overrides. Agent Markdown requires YAML `name` and `description`; its body supplies the instructions. `promptMode: extend` preserves Grok's normal runtime prompt. Leave model/effort unset to use the session's choices. [Manifest loader](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-agent/src/plugins/manifest.rs), [agent definition parser](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-agent/src/config.rs)

## Install and use

After generating and reviewing the bundle, run from the Blade checkout:

```sh
grok plugin validate ./grok/blade
grok plugin install ./grok/blade --trust
grok plugin enable blade
grok plugin details blade
```

These are installation instructions; generating Blade does not execute them. Inspect an existing Blade installation before replacing its registered source. The installed CLI accepts local paths and remote sources with a `#subdir`, so a published revision can distribute this package without making the repository root the plugin.

Open Grok in the adopting project, confirm discovery with `grok inspect`, and invoke `/blade-team` (or its displayed qualified form, `/blade:blade-team`, if names conflict). Supply the project's linked profile and a concrete request, for example:

```text
/blade-team Fix the duplicate invoice export bug. Use Deliver mode.
Keep guided checkpoints; show me scope and design before implementation.
```

At a checkpoint the user can authorize a named continuation, such as “Continue through opening and updating the PR; stop before merge.” Record separately whether replies to reviewers are authorized. Package installation does not authorize project changes, publishing, or merging. [Plugin installation and command discovery](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/09-plugins.md)

## Verification and limits

Checked on 10 September 2026 against installed Grok Build `1.0.25 (f7e67d6988e2)`: CLI help confirms plugin installation, manifest validation, inventory, session resume/continue, and worktree entry/management. `grok agent --help` exposes process-local `--plugin-dir`; the top-level help does not, so the setup above uses the supported plugin installer.

`grok plugin validate <directory>` validates the manifest. It is not a complete role parser or an execution test. After installation, `grok inspect`, plugin inventory, and `/agents` can confirm discovery. A bounded live trial is still needed to prove delegation, relay pairing, acceptance checks, independent review, and guided approval behavior. This adapter was prepared without installing a plugin, changing user configuration, or calling a model.

The installed messaging description supports inactive-child continuation more broadly than published docs; the adapter checks the live contract and retains a `resume_from` fallback. If subagents are disabled or unavailable, disclose single-agent operation. Persistent monitoring requires a separately authorized runtime trigger; prompt files alone do not keep a team running.
