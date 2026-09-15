# Project profile and example

Use the canonical [project profile](../../team/project-profile.md) for project context and the delivery record. This example illustrates the shared workflow; it is not a transcript of an executed trial.

## Example: CSV invoice export

**Illustrative only. These agents have not executed this example.**

User: “Use the Blade team in Deliver mode. Let account admins download the currently filtered invoices as CSV. Keep the existing table UI.”

PM and Tester propose:

- AC-1: an account admin exports exactly the filtered records they are allowed to see.
- AC-2: another account's data cannot be exported; unauthorized users cannot call the export endpoint.
- AC-3: output handles commas, quotes, Unicode, and spreadsheet formula-like values under an agreed CSV policy.
- AC-4: empty results and failures produce understandable feedback.

PM clarifies “current page or all filtered results?” and the intended spreadsheet consumer before locking those decisions. Architect reviews the existing query/authorization boundary and expected export size. UX Principal proposes:

```text
[Invoice list + filters] ---- [Export CSV]
                                  |
                            preparing...
                           /      |      \
                     download   empty    failure
                        |         |         |
                     stay here  explain   retry
```

PM obtains scope approval; Architect and UX present the concrete design for the next approval. Each checkpoint offers autonomous continuation through named later stages. After implementation is approved, coordinator starts Coder, Pair, and Tester within available slots:

```text
Coder -> Pair:   Reusing the filtered query and adding export serialization.
                Review the data boundary before I wire the button.
Pair -> Coder:   Query accepts a caller-provided account ID. Derive it from
                the authenticated scope and test the alternate account case.
Tester -> Coder: AC-2 fails against the candidate. Here is the request and
                reproduction. Return only authorized data.
Coder -> Tester: Fixed the boundary; here is the new candidate and test result.
Tester -> Lead:  Reproduction now passes; browser error state still untested.
```

The team completes the missing interaction check, Polisher reviews the resulting change, and a fresh Reviewer checks the candidate independently. Documenter captures the final export flow and explains how it reduces manual reporting. At delivery, the user sees the demo/evidence and concrete PR draft before approving the PR stage, unless this continuation was already authorized. Releaser collects current verdicts and prepares the user's merge decision under the same policy. If GitHub feedback changes code, affected verification and review repeat before the merge.

Steward might observe repeated confusion over which filtered results to export and propose a small PM prompt change about pagination semantics. It shows the evidence and exact proposed wording to the user. It does not silently update the team's prompts.
