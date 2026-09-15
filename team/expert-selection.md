# Select experts for the task

Start from the requested outcome and actual work, not a roster. Identify the domain, audience, important decisions, uncertainty, failure risks, and evidence needed. Product development often benefits from the existing product/engineering templates; those templates are neither compulsory nor exhaustive. A database-heavy change may need query-performance, data-integrity, migration, and security expertise. A research brief may need a domain researcher, a methods reviewer, and an editor.

## Assemble a proportionate team

1. Map the difficult questions and consequential risks to expertise. Name specialties precisely enough to change what they examine. Include a specialist because their contribution is useful, not because a keyword appears. Do not add security to every task or assume every database task requires the same experts.
2. Cover the workflow's outcome, production, verification, and independent-review responsibilities. Combine compatible responsibilities for small work. Keep review independent of the work being approved; adding titles to one agent does not create independence.
3. Show the selected team, the reason for each assignment, and its remit in the compact delivery record. Identify who resolves cross-domain decisions. A useful minimum is a coordinator who also produces the result plus a relevant independent reviewer; complex work warrants more distinct experts. No fixed headcount or permanent core team is required.
4. Schedule experts only when needed, within actual host capacity and the user's budget. A planned expert is not an active worker. Give each active worker a charter, real identity, bounded assignment, and ownership. An existing card can supply a useful starting perspective; create an in-record charter with the generic [expert template](roles/expert.md) when no card fits. Do not modify the reusable role library just to staff a task.

## Expert charter

Every assignment, including one using an existing template, needs these concrete fields. Keep each brief proportional; a few sentences can suffice.

| Field | What to specify |
|---|---|
| Expert and purpose | Specialty and the outcome or failure it is responsible for addressing; why this task needs it |
| Viewpoint | What it examines or protects, including the tradeoff it must keep visible |
| Key questions | The task-specific questions it must answer |
| Expected evidence | Inspectable sources, checks, calculations, prototypes, or findings needed to support its conclusions |
| Decision boundary | What it owns or recommends, what belongs to another expert or the user, and when it must escalate |

The worker brief adds scope/criteria, input references, candidate version, actual peers, owned paths or artifacts, write permission, handoffs, and completion condition. A title is not a credential or proof of knowledge: experts must work from evidence, identify limitations, and request missing context. Do not invent qualifications or sign-offs.

Expert viewpoints focus attention without rewarding one-dimensional answers. Each expert should explain material tradeoffs, respond to contrary evidence, and stay within the shared outcome. Resolve disagreements through evidence and the recorded decision owner; do not count agent votes as proof or let a specialist expand scope unilaterally. Evidence-backed blockers in an expert's remit remain visible until resolved or legitimately waived under the workflow.

## Examples, not preset teams

| Task | Possible experts and distinct viewpoints |
|---|---|
| Customer-facing feature | Product: user value and acceptance; UX: understandable journeys; architect: contracts and maintainability; coder/pair: implementation and diagnosis; tester/reviewer: behavior and independent readiness. Add polish, documentation, or release ownership as the deliverable needs them. |
| Database migration with tenant data | Data-integrity expert: invariants, backfill correctness, reconciliation; database-performance expert: representative query plans, locks, throughput; security expert: tenant isolation, least privilege, sensitive-data access; implementer and independent reviewer suited to migration work. Combine specialties when depth and independence permit. |
| Evidence-backed business brief | Domain researcher: source relevance and coverage; analyst: assumptions and calculations; editor: audience clarity; independent methods reviewer: whether evidence supports conclusions. No UX, code, PR, or merge work unless the task requires it. |
| Operational process redesign | Operations expert: handoffs and practical exceptions; change specialist: adoption and responsibilities; evaluator: whether the proposed process can be followed and measured. Use a separate process reviewer when authors also design the evaluation. |

Example charter for a tenant-data migration:

- **Expert/purpose:** Data-integrity expert; establish that the migration preserves every tenant's records and relationships.
- **Viewpoint:** Correctness and recoverability under partial execution; make availability/correctness tradeoffs explicit.
- **Key questions:** Which invariants must hold? Can retries duplicate or skip records? How will pre/post counts and relationships reconcile?
- **Expected evidence:** Inspected schema and migration plan, reconciliation queries, representative dry-run/retry results, and explicit gaps where execution is unavailable.
- **Decision boundary:** Own the integrity assessment and recommend migration safeguards; coordinate query cost with performance and access controls with security. The authorized owner decides downtime and production execution. Independent review must cover any migration code this expert authors.

## Reassess as evidence changes

At milestones and when a new risk, domain, or material uncertainty appears, ask whether the current expertise still covers the work. Add or specialize an expert when a concrete unanswered question warrants it; combine or retire assignments that no longer add value. Record the evidence, changed remit, actual worker identity, and handoff. Preserve useful context, ownership, unresolved findings, and review independence.

Routine staffing changes within the approved work need no new approval. Respect explicit team/budget constraints; seek a decision before exceeding them or expanding scope or authority. If a new gap affects a dependent step, resolve it before that step while continuing independent work. Re-staffing never discards a blocker or refreshes a stale verdict by itself. Changes to reusable team instructions still follow the Steward approval rule.
