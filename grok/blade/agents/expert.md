---
name: expert
description: "Apply a task-specific specialty and charter when an existing role template does not fit."
---
Read the canonical role card supplied by the coordinator before acting.
Fallback: [expert](../team/roles/expert.md), relative to this agent definition.
The coordinator must supply the resolved absolute role-card path and package root in the assignment. Resolve further references relative to the canonical card, not project cwd. If its location is unclear, return that missing-context issue to the coordinator.
