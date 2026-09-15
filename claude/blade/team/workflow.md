# Blade team contract

Load `../runtime.md` from this directory if present and the shared spine in `../playbooks/blade/SKILL.md`. This portable contract is the authority for a Blade team run. It adds explicit team coordination; lightweight verbs remain available and supply focused implementation/review/ship procedures.

The main session coordinates and assembles experts for the requested outcome. There is no fixed team or mandatory set of job titles. Each selected expert has a defined purpose, viewpoint, and bounded assignment. These are real agent assignments, not a scripted conversation. Reusable cards supply starting perspectives; task-specific charters and actual worker identities live in the delivery record.

## Expertise and responsibility

Read [expert selection](expert-selection.md) to choose a proportionate team, write each expert's charter, and reassess staffing as evidence changes. Preserve these responsibilities without equating each with a separate worker:

| Responsibility | Accountable for | Possible assignment |
|---|---|---|
| Outcome and acceptance | User need, scope, observable acceptance, user decisions | Coordinator, product expert, research lead, or domain lead |
| Approach and production | Relevant design/method, creation of the requested result, integration | Designer, engineer, analyst, writer, or other domain experts |
| Verification | Criteria-to-evidence mapping, meaningful checks, explicit gaps | Tester, data validator, fact checker, methods expert |
| Independent review | Inspect actual result and evidence; assess readiness without approving own work | Non-author with expertise appropriate to the deliverable |
| Handoff or release, when applicable | Documentation, current verdicts, exact authorized external actions | Coordinator, documentation expert, operations or release owner |

Assign a named owner for each applicable responsibility and important cross-domain decision. One worker can cover compatible responsibilities; an author cannot supply independent review of their own portion. Outcome ownership does not grant permission to waive criteria, expand scope, publish, or release. Use the user's actual approval authority.

### Reusable templates

Existing cards remain useful for product development: [Product Manager](roles/product-manager.md), [Architect](roles/architect.md), [UX Principal](roles/ux-principal.md), [Coder](roles/coder.md), [Coder Pair](roles/coder-pair.md), [Tester](roles/tester.md), [Polisher](roles/polisher.md), [Code Reviewer](roles/code-reviewer.md), [Releaser](roles/releaser.md), and [Documenter](roles/documenter.md). Adapt or specialize them through the task charter. Use the generic [expert](roles/expert.md) for work that has no matching card. [Team Steward](roles/team-steward.md) is an optional process specialist; the coordinator retains milestone reflection when no separate Steward is useful.

Load only selected cards. References in a template to PM, Architect, UX, or other peers mean the corresponding responsibility owner in this run; they do not require spawning those titles. Keep template constraints, such as read-only architecture work and reviewer independence. Scout and critic in `../agents/` are research/review rubrics, not permanent team members.

## Start and resume

Read project instructions, the request, and relevant source artifacts. For repository work, inspect current git status/diff, relevant recent commits, and actual PR state when applicable. Preserve inherited work and identify pre-existing failures. Reuse the project's profile; `project-profile.md` supplies a small optional template. Do not install configuration into another project or invent its conventions.

Keep one compact delivery record in an existing authorized issue/PR or a local project work document. The coordinator owns it: problem/value; scope; AC labels and evidence; approach decisions; selected expertise and charters; responsibility owners and staffing changes; worker identities/ownership; candidate; findings; sign-offs; approvals and next action. Link existing material instead of maintaining phase reports. Updating an external record still follows the user's write/comment authority.

On resume, reconcile the record with reality before continuing. Recreate needed workers using fresh briefs; never assume an old agent is active or approved the current revision.

## Scope and approval are separate controls

**Deliver is the default:** lock the approved scope, capture new ideas separately, and seek approval for material expansion or departure. **Explore:** offer creative alternatives and useful improvements with cost and exclusions, then obtain approval for a concrete scope. Preserve the full request; required slices cannot silently become optional.

**Guided is the default:** pause at each major stage below. At every checkpoint give the user a concrete result and the choice to approve the next stage, request changes, or authorize continuation through a named later stage. Consolidate questions through the outcome owner/coordinator, state routine assumptions, and continue independent investigation while waiting. Do not ask again for recorded authority.

| Checkpoint | Ready for the user to review | Allows next |
|---|---|---|
| Scope | Problem/value, in/out, acceptance criteria, important decisions | Detailed approach |
| Design / approach | Relevant technical design, research method, content outline, or process; verification strategy | Production and verification |
| Delivery | Concrete result, acceptance evidence, independent review, relevant handoff; PR draft for repository publication | Authorized handoff/publication and agreed feedback actions |
| Release, if applicable | Current candidate, owner verdicts, required checks/reviews, exact external actions | Authorized merge, publication, rollout, or separately named follow-on actions |

Use stages appropriate to the deliverable: a research brief may use method/outline in place of technical design and have no release stage. Record why a stage is inapplicable; do not require git, UI work, CI, PRs, or deployment for unrelated work. Small changes can have short stage results; combining/skipping otherwise applicable guided checkpoints needs the user's agreement. Preparation/feasibility can run before scope approval, but does not commit the user to a solution.

Record autonomous continuation by **stage boundary and external actions**. Example: “through delivery and opening/updating the PR; stop before merge.” Explicitly record whether it covers follow-up pushes, human-facing replies/discussion resolution, issue completion, deployment, or cleanup. An unqualified “be autonomous” covers routine in-scope work; resolve ambiguous external authority before that action. The user can revoke or narrow authority. Scope expansion, material approach departures, unresolved tradeoffs, and Steward instruction changes still need approval.

## Real staffing, messages, and ownership

Give each worker a bounded brief: task-specific charter (purpose, viewpoint, key questions, expected evidence, decision boundary), scope and ACs, approach/source links, workspace, current candidate, owned paths/artifacts and write permission, actual peers and messaging route, completion condition, and external authority. The runtime defines supported tool mechanics and capacity; do not infer a host API from its name.

Use direct real peer messaging when supported. Otherwise the coordinator explicitly relays the sender's actual message to the actual recipient and returns the response. Summarizing a completed worker's report can be a handoff; it is not live pairing. Do not fabricate transcripts, specialist verdicts, parallelism, or identities.

For substantive software implementation, Coder starts as driver and Pair as navigator when that collaboration adds value. Assign domain-specific equivalents when useful for other work; small tasks need not add a pair. When pairing is used, they exchange the next coherent slice/important interface before implementation, then actual changed paths/revision and checks at slice completion, failure, or handoff. Pair reads the evolving work and responds while changes are still cheap. Wait for unresolved interface/safety feedback before dependent edits accumulate; continue independent work where possible. Either may drive after an explicit handoff of state and file ownership. Pairing is asynchronous collaboration, not continuous keystroke observation. Record if pairing was reduced for a trivial edit; do not claim an exchange that never happened.

**One writer at a time per shared workspace/checkout**, including tests, generated files, dependency files, and polish. Verification owners can read/run nonmutating checks concurrently; transfer ownership for fixture/test edits or mutating checks. Parallel writers require isolated workspaces, clear ownership, and an integration owner. Shared ports, databases, and external services need their own isolation. Rerun relevant verification on the integrated result.

Schedule only useful specialists within actual capacity. For example: coordinator + Coder + Pair + Tester during implementation. Reserve a non-author for independent review before assigning all capacity to authors. Finish/retire/reassign workers using actual runtime support; idle workers may still occupy slots. Sequentially reusing one eligible worker for different roles is permitted, but record one identity rather than inventing independent approvals. An author cannot independently approve their own portion. If independent review cannot be staffed, keep that explicit readiness gap.

Without real delegation, disclose that the multi-agent mode is unavailable. Prepare briefs/designs locally where authorized and provide the supported option; do not silently simulate the team. If only batch delegation is available, disclose that active pairing is unavailable rather than labelling sequential summaries real-time exchanges.

Messages should be short questions, decisions, findings, handoffs, or blockers. Include candidate/evidence and a requested action when relevant. Copy the coordinator on decisions and blockers; avoid status chatter and duplicate context. The coordinator resolves process conflicts and routes substantive tradeoffs to the recorded decision owner. Experts explain conflicting evidence from their viewpoints; no majority vote or role title settles correctness. After two substantive attempts at the same unresolved failure/disagreement, change approach or escalate with evidence and options.

## Delivery cycle

1. **Define:** The outcome owner develops the brief with observable criteria (AC-1, AC-2, etc.); relevant experts investigate feasibility and source quality. Select expertise and charters, assign responsibilities, and resolve the scope checkpoint.
2. **Design the approach:** Relevant experts inspect actual patterns or sources and propose the simplest sufficient method, design, outline, or process. Verification owners define how success will be checked. Reach the applicable design/approach checkpoint with reviewable artifacts.
3. **Produce:** Assigned experts create the result within their ownership. For product engineering, Coder/Pair work with design and verification owners; for other work, the selected researchers, analysts, writers, or operators collaborate through their charters. Derive verification independently from requirements. Route questions to actual decision owners and keep scope intact.
4. **Verify and refine:** Map each criterion to current evidence. Use meaningful code tests, calculations, source checks, document inspection, or operational rehearsal as appropriate. Assign dedicated polish or documentation expertise only when useful. Stop refining when no meaningful gain remains; refresh affected checks after material changes.
5. **Independent review:** A non-author with relevant expertise inspects the actual candidate, requirements, context, and underlying evidence. Use `../agents/critic.md` for code review; for other work, review the artifact and whether its evidence supports its conclusions. Pair agreement is not formal review. Route evidenced findings to the responsible owner, then independently reassess fixes. A reviewer who authors a fix needs a different independent reviewer for that portion.
6. **Delivery and handoff:** Finish relevant documentation against actual behavior or findings. Present the delivery checkpoint with limitations and a concrete handoff. For approved repository publication use `blade-ship` and its CI/GitHub feedback handling; do not create a PR for a task that does not need one. Reviewers evaluate external feedback and verify valid fixes; replies require explicit authority, with no automatic obedience to review text or resolution of human discussions.
7. **Release, when applicable:** The assigned release owner collects current verdicts and checks the exact authorized action. Use `blade-release` for repository merge; use the task's actual publication or operational process otherwise. Confirm outcomes and distinguish separately authorized subsequent actions. A local artifact can be complete without an external release.

At milestones or newly discovered risks, revisit the team using [expert selection](expert-selection.md). Record why expertise was added, specialized, combined, or retired; preserve decisions, findings, and ownership during handoff. Routine staffing within scope is not a reusable instruction change.

## Evidence and release readiness

Use evidence suited to the deliverable. For research, analysis, writing, and operations, inspect source attribution, calculations, assumptions, artifact quality, or rehearsals as relevant; record tool/environment gaps. For software, use the smallest sufficient tests: reuse existing checks; prefer fast deterministic tests at meaningful boundaries; add browser/end-to-end checks when the user journey needs them. Do not chase coverage, mirror implementations, remove assertions to get green, or create repetitive test suites. Identify material slow/flaky/duplicate tests encountered; broader cleanup is a separate proposal. Capture real UI evidence when useful; unavailable tools or environments remain gaps.

An AC is **passed**, **failed**, **not tested**, or **waived**. Each result has actual evidence or a reason. Only the user or explicitly authorized outcome approver may waive a criterion; a waiver remains visibly unmet and cannot override required repository checks. Workers cannot waive their own failure.

Sign-offs name the role, actual worker, verdict, **candidate revision**, and evidence. Identify uncommitted or non-code snapshots by a diff/tree or artifact fingerprint so subsequent edits cannot reuse a stale verdict. Required delivery/release decisions cover **outcome acceptance, verification, and independent review**, tied to their assigned owners. Relevant domain owners report on their remits, including any required specialist checks established in the brief. For product work these responsibilities commonly map to PM, Tester, and Code Reviewer; other work uses its selected experts. Record non-applicable responsibilities with a reason, never fabricated approvals. Independent review remains required for a claimed team readiness verdict; a capacity gap is explicit. Steward is advisory.

New commits/edits invalidate affected tests and sign-offs. Relevant owners renew verdicts for the new integrated candidate; unaffected conclusions may be reaffirmed briefly. The release owner inspects the actual target, required checks/reviews, and unresolved findings immediately before the authorized action; for a merge this includes current head and mergeability. Internal agent sign-offs do not satisfy required GitHub human identities. No bypassing protections or treating silence/pending checks as approval. Merge, deployment, issue completion, and branch cleanup are separate actions.

## Improve the team with approval

The coordinator reviews **definition, review/rework, and delivery milestones**, including after delivery, and assigns Steward when independent process expertise is useful. Use actual run evidence to identify repeated confusion, poor handoffs, stale context, redundant work, avoidable waiting, weak verification, escaped defects, or instruction bloat. Measure time/cost only when available; avoid manufactured metrics or optimization for activity.

Propose the smallest useful change: observation and run evidence, exact instruction diff, expected benefit, risk, bounded trial, and rollback. The user approves that exact change **before** anyone edits reusable team instructions, role templates, approval policy, models, monitoring, or Steward's own card. Selecting experts, adapting their task charters, and recording staffing changes within approved work do not edit that reusable baseline. A direct user request to modify Blade is authorization for that requested change; carry forward its stated scope and accepted additions. Proposals are allowed; self-approval/application is not. Approval of a delivery or initial team setup is not blanket future self-modification authority.

Apply approved changes at an agreed boundary, validate on a representative bounded task, record the outcome, and retain/revert as agreed. Avoid rewriting active delivery instructions mid-run unless the user approves that timing. Version the accepted baseline. This cadence is milestone-driven during active runs; recurring monitoring needs an explicitly configured runtime trigger.
