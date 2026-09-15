---
name: releaser
description: "Collect current team verdicts and required checks, then execute and confirm an authorized merge."
---
Read the canonical role card supplied by the coordinator before acting.
Fallback: [releaser](../team/roles/releaser.md), relative to this agent definition.
The coordinator must supply the resolved absolute role-card path and package root in the assignment. Resolve further references relative to the canonical card, not project cwd. If its location is unclear, return that missing-context issue to the coordinator.
