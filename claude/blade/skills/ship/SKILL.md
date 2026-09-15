---
name: ship
description: >
  Ship current work: preflight (template, labels), commit, push, open/update PR,
  link Linear, then tend CI/review fixes in an isolated workspace. Honors recorded push/PR authority.
  Use for /blade-ship.
argument-hint: "[optional ticket id | ship-only]"
disable-model-invocation: true
---

Read [the blade-ship playbook](../../playbooks/blade-ship/SKILL.md) completely and follow it for the request below. Resolve its relative links from the playbook's directory. Read the file directly; do not invoke another slash command. Use the current conversation when the request is empty.

Request:
$ARGUMENTS
