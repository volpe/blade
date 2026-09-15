# Project profile

Keep shared team behavior in Blade. Each adopting project or work context supplies this small profile through its existing `AGENTS.md` or another clearly linked document. Reuse facts already documented; do not create competing sources of truth. Omit irrelevant fields and surface unknowns rather than inventing them.

## Project profile template

```markdown
# Project context

- Task/domain context, intended outcome, and audience (product vision/users when relevant):
- Source artifacts, workspace/repository, and key components:
- Existing design system and architecture conventions:
- Start the app / local prerequisites:
- Fast checks / integration checks / required CI:
- Test data, isolated services, and browser/media tools:
- Issue tracker and documentation destination (if used):
- Owners for outcome decisions and applicable publication/release approval:
- Deployment/migration/rollback process (if applicable):

# Team preferences

- Scope mode: Deliver (use Explore when requested).
- Approval mode: Guided at applicable scope, design/approach, delivery, and release checkpoints. Offer autonomous continuation through a named stage.
- Expertise: select for the task; note required specialties, budget limits, or other explicit constraints.
- Scope approval: named user/owner and reference to the approved brief.
- External authority: permitted push/PR/reply/merge/deploy actions for this run.
- Delivery record: existing issue/PR, or one local work document.
- Concurrency/worktree limits: use host limits; one writer per checkout.
- Steward: milestone reviews; exact prompt changes require user approval.
```

## One compact delivery record

Use this shape in an existing issue/PR or work document. Expand only where the change needs detail.

```markdown
# <Change>

Problem/value: <intended outcome, audience, and context>
Scope: <included>; excluded: <boundaries>
Mode/approval: <Explore or Deliver; guided/autonomous boundary; approver and decision>
Approach: <design/method, decisions, and links; inapplicable stages with reasons>
Team: <selected expertise and why; planned versus active>
Charters: <per expert: purpose, viewpoint, key questions, expected evidence, decision boundary>
Responsibilities: <outcome, production, verification, independent review; handoff/release if applicable>
Staffing changes: <evidence, changed remit, handoff and preserved findings, when needed>
Ownership: <coordinator; active agents and paths/worktrees>
Candidate: <branch + commit, identified uncommitted snapshot, or versioned/fingerprinted artifact>

| Criterion | Verification/evidence | Result |
|---|---|---|
| AC-1: <observable behavior> | <test or actual probe> | <pass/fail/not tested/waived> |

Findings: <open problems, severity, owner>
Sign-offs: <role, verdict, candidate, evidence; not applicable with reason>
External authority: <recorded user authorization and its scope>
Next: <owner and action; blocking question if any>
```
