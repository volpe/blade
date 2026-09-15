/** Role names describe expertise; only validated templates become file paths. */
export const ROLE_TEMPLATES = ["expert", "product-manager", "architect", "ux-principal", "coder", "coder-pair",
  "tester", "polisher", "code-reviewer", "releaser", "documenter", "team-steward"];
const WRITER_TEMPLATES = new Set(["expert", "coder", "coder-pair", "tester", "polisher", "documenter"]);

export function resolveAssignment({ role, roleTemplate, charter, writable = false, directBuiltins }) {
  if (typeof role !== "string" || !/^[a-z][a-z0-9-]{0,63}$/.test(role)) {
    throw new Error("Expert role must be a lowercase slug of 1–64 characters.");
  }
  const template = roleTemplate ?? (ROLE_TEMPLATES.includes(role) ? role : "expert");
  if (!ROLE_TEMPLATES.includes(template)) throw new Error(`Unknown role template ${template}.`);
  for (const field of ["purpose", "viewpoint", "decisionBoundary"]) {
    if (typeof charter?.[field] !== "string" || !charter[field].trim()) {
      throw new Error(`Expert charter requires ${field}.`);
    }
  }
  for (const field of ["keyQuestions", "expectedEvidence"]) {
    if (!Array.isArray(charter?.[field]) || !charter[field].length ||
      charter[field].some(value => typeof value !== "string" || !value.trim())) {
      throw new Error(`Expert charter requires non-empty ${field}.`);
    }
  }
  if (writable && !WRITER_TEMPLATES.has(template)) throw new Error(`${template} cannot hold the writer lease.`);
  if (writable && directBuiltins !== true) throw new Error("A writer requires directBuiltins: true to acknowledge direct built-in execution without parent extension hooks or custom shell configuration. Keep execution in the lead if those are required.");
  return { roleTemplate: template, charter: {
    purpose: charter.purpose, viewpoint: charter.viewpoint,
    keyQuestions: [...charter.keyQuestions], expectedEvidence: [...charter.expectedEvidence],
    decisionBoundary: charter.decisionBoundary,
  } };
}

export function formatCharter(charter) {
  return `Purpose: ${charter.purpose}\nViewpoint: ${charter.viewpoint}\nKey questions:\n${charter.keyQuestions.map(value => `- ${value}`).join("\n")}\nExpected evidence:\n${charter.expectedEvidence.map(value => `- ${value}`).join("\n")}\nDecision boundary: ${charter.decisionBoundary}`;
}
