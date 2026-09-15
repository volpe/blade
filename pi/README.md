# Blade for pi

The pi path packages slash prompts, a workflow skill, and a small extension that runs separate agent sessions with message delivery. Verified against pi 0.85.1 and Node 24; the package requires Node 22.19 or later. It uses the current `@earendil-works/pi-coding-agent` SDK.

## Install

```sh
pi install ~/dev/blade/pi/blade
```

In pi, run `/reload` or restart, then:

```text
/blade help
/blade-build fix the invoice export
/blade-team Deliver, guided: add invoice export
```

Keep the prompts, `blade-workflow` skill, and Blade team extension enabled. The extension registers team tools; it does not start agents until requested. Ordinary verbs can run without team delegation. Team mode reports missing tools instead of pretending a single model is several independent agents.

The team inherits the selected model/thinking settings and configured model access through pi's public APIs. It uses available built-in project tools; arbitrary parent extension tools and permission hooks are not cloned into child sessions. Consult [the runtime contract](blade/runtime.md) for tool access, writer handoff, session limits, and cleanup. Treat it as a local coding extension, not a sandbox boundary.

## Update and remove

Local installs point at this checkout. After source changes, run `npm run build` from the Blade root and `/reload` in pi. Keep the checkout in place.

```sh
pi remove ~/dev/blade/pi/blade
```

Existing `pi install ~/dev/blade` users can keep the root compatibility entrypoint, which uses the same generated runtime. To switch paths, remove the old path before installing this one so commands/extensions are not loaded twice.

See [the team workflow](blade/team/workflow.md) and [project profile](blade/team/project-profile.md). Linear and GitHub require your existing configured access.
