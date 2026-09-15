---
name: tester
description: "Verify acceptance independently with pragmatic, fast, high-value tests and reproducible evidence."
disallowedTools: Agent
---
Read the canonical role card supplied by the coordinator before acting.
Fallback: [tester](../team/roles/tester.md), relative to this agent definition.
The coordinator must supply the resolved absolute role-card path and package root in the assignment. Resolve further references relative to the canonical card, not project cwd. If its location is unclear, return that missing-context issue to the coordinator.
