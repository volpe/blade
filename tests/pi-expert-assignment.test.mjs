import assert from "node:assert/strict";
import test from "node:test";
import { formatCharter, resolveAssignment } from "../adapters/pi/extensions/blade-team/roles.mjs";

const charter = {
  purpose: "Preserve tenant data during the backfill.",
  viewpoint: "Integrity under partial execution and retry.",
  keyQuestions: ["Can a retry duplicate records?"],
  expectedEvidence: ["Reconciliation queries and retry results."],
  decisionBoundary: "Recommend safeguards; lead owns production authorization.",
};

test("bespoke specialties use a safe generic template and carry their complete charter", () => {
  for (const role of ["database-integrity", "research-methods-reviewer", "operations-analyst"]) {
    const assignment = resolveAssignment({ role, charter });
    assert.equal(assignment.roleTemplate, "expert");
    assert.deepEqual(assignment.charter, charter);
    for (const value of Object.values(charter).flat()) assert.ok(formatCharter(assignment.charter).includes(value));
  }
  assert.equal(resolveAssignment({ role: "postgres-engineer", roleTemplate: "coder", charter }).roleTemplate, "coder");
  assert.equal(resolveAssignment({ role: "architect", charter }).roleTemplate, "architect");
});

test("specialty names cannot become arbitrary template paths", () => {
  for (const role of ["../coder", "nested/role", "", "A".repeat(65)]) {
    assert.throws(() => resolveAssignment({ role, charter }), /role/);
  }
  for (const roleTemplate of ["../coder", "custom-card", ""]) {
    assert.throws(() => resolveAssignment({ role: "analyst", roleTemplate, charter }), /template/);
  }
});

test("every assignment requires a substantive charter, including reusable roles", () => {
  for (const role of ["researcher", "coder"]) {
    assert.throws(() => resolveAssignment({ role }), /charter/);
    for (const field of Object.keys(charter)) {
      for (const value of [undefined, "", "   ", [], [" "], [42]]) {
        assert.throws(() => resolveAssignment({ role, charter: { ...charter, [field]: value } }), /charter/);
      }
    }
  }
});

test("custom production experts can write only with explicit capability selection; read-only templates stay restricted", () => {
  assert.throws(() => resolveAssignment({ role: "report-author", charter, writable: true }), /directBuiltins/);
  assert.equal(resolveAssignment({ role: "report-author", charter, writable: true, directBuiltins: true }).roleTemplate, "expert");
  for (const roleTemplate of ["architect", "code-reviewer", "team-steward"]) {
    assert.throws(() => resolveAssignment({ role: "specialized-expert", roleTemplate, charter, writable: true, directBuiltins: true }), /writer lease/);
  }
});
