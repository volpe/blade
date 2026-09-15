---
name: polisher
description: "Improve the current implementation and interaction quality before independent formal review."
disallowedTools: Agent
---
Read the canonical role card supplied by the coordinator before acting.
Fallback: [polisher](../team/roles/polisher.md), relative to this agent definition.
The coordinator must supply the resolved absolute role-card path and package root in the assignment. Resolve further references relative to the canonical card, not project cwd. If its location is unclear, return that missing-context issue to the coordinator.
