---
name: build
description: >
  Implement a change from a ticket, approved plan, or freeform request.
  Use for /blade-build. Parallel scouts when touch points are unclear;
  implement serially on the main checkout (main thread or one subagent).
argument-hint: "[ticket id | plan cue | freeform]"
disable-model-invocation: true
---

Read [the blade-build playbook](../../playbooks/blade-build/SKILL.md) completely and follow it for the request below. Resolve its relative links from the playbook's directory. Read the file directly; do not invoke another slash command. Use the current conversation when the request is empty.

Request:
$ARGUMENTS
