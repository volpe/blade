import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Type } from "typebox";
import type { ExtensionAPI, ExtensionContext, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { TeamController } from "./controller.mjs";
import { createMemberSession } from "./session.ts";
import { ROLE_TEMPLATES, resolveAssignment } from "./roles.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const textResult = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data) }], details: {} });
const sendParameters = Type.Object({
  to: Type.String({ description: "Recipient member id, or lead." }),
  message: Type.String({ minLength: 1, maxLength: 12000 }),
});
const statusParameters = Type.Object({ after: Type.Optional(Type.Integer({ minimum: 0 })) });

export default function bladeTeam(pi: ExtensionAPI) {
  let manager: TeamController | undefined;
  let activeContext: ExtensionContext | undefined;

  async function closeTeam(reason: string, closing = manager) {
    if (!closing) return [];
    const result = await closing.close(reason);
    if (manager === closing && !result.some((member: any) => member.status === "stop_failed")) manager = undefined;
    return result;
  }

  function team() {
    if (!manager) {
      manager = new TeamController({
        createSession: async (options: any) => {
          const peerTools: ToolDefinition[] = [
            { name: "blade_team_send", label: "Send team message", description: "Send a real message to a teammate or lead. Busy recipients receive steering; idle recipients start a turn.", parameters: sendParameters,
              execute: async (_id, args) => textResult(await options.send(args.to, args.message)) },
            { name: "blade_team_status", label: "Team status", description: "See active teammates and recent messages. Read once when needed; do not poll repeatedly.", parameters: statusParameters,
              execute: async (_id, args) => textResult(options.status(args.after ?? 0)) },
          ];
          return createMemberSession({ ...options, peerTools, packageRoot });
        },
        notify: (event: any) => {
          if ((event.type === "message" && event.to === "lead") || ["idle", "failed", "stop_failed"].includes(event.type)) {
            pi.sendMessage({ customType: "blade-team", content: JSON.stringify(event), display: true },
              { deliverAs: "nextTurn", triggerTurn: false });
          }
        },
      });
    }
    return manager;
  }

  pi.registerTool({
    name: "blade_team_start", label: "Start Blade teammate",
    description: `Start one real, bounded expert session in the shared workspace. Choose a task-specific role and charter; existing role templates are optional starting points. Maximum four resident members, one writer. The lead must not edit while a child holds the writer lease. Stop members at approval pauses, after delivery, and before driver handoffs. Child tools include only active original built-ins: custom parent tools and extension hooks are not inherited. Use main-session execution when those hooks are required.`,
    parameters: Type.Object({
      id: Type.String({ pattern: "^[a-z][a-z0-9-]{0,47}$" }),
      role: Type.String({ pattern: "^[a-z][a-z0-9-]{0,63}$", description: "Task-specific expertise, e.g. database-integrity or research-methods-reviewer. Not restricted to template names." }),
      roleTemplate: Type.Optional(Type.String({ enum: ROLE_TEMPLATES, description: "Optional starting card. Defaults to the matching built-in role name or expert for a bespoke role." })),
      charter: Type.Object({
        purpose: Type.String({ minLength: 1, description: "Why this expert is needed and the outcome it serves." }),
        viewpoint: Type.String({ minLength: 1, description: "Perspective and tradeoffs this expert examines." }),
        keyQuestions: Type.Array(Type.String({ minLength: 1 }), { minItems: 1 }),
        expectedEvidence: Type.Array(Type.String({ minLength: 1 }), { minItems: 1 }),
        decisionBoundary: Type.String({ minLength: 1, description: "Owned decisions, recommendations, escalation and authority limits." }),
      }),
      task: Type.String({ minLength: 1 }), ownership: Type.String({ minLength: 1, description: "Explicit owned files or read-only responsibility." }),
      writable: Type.Optional(Type.Boolean({ description: "Grant sole child writer lease and active shell/edit/write built-ins. Default false." })),
      directBuiltins: Type.Optional(Type.Boolean({ description: "Required true for a writer: acknowledge that direct built-ins are appropriate without parent extension hooks/custom shell settings. This capability selection does not grant product, release, or publication approval." })),
      maxTurns: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
      lifetimeMinutes: Type.Optional(Type.Integer({ minimum: 1, maximum: 60 })),
    }),
    execute: async (_id, args, signal, _update, ctx) => {
      signal?.throwIfAborted();
      const assignment = resolveAssignment(args);
      activeContext = ctx;
      const controller = team();
      const onAbort = () => { void closeTeam("Lead was interrupted.", controller); };
      signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const result = await controller.start({ ...args, ...assignment, lifetimeMs: (args.lifetimeMinutes ?? 15) * 60_000,
          ctx, activeTools: pi.getActiveTools(), toolMetadata: pi.getAllTools() });
        signal?.throwIfAborted();
        return textResult(result);
      } finally { signal?.removeEventListener("abort", onAbort); }
    },
  });
  pi.registerTool({ name: "blade_team_send", label: "Send team message", description: "Send a real message as lead. Busy teammates receive steering; idle teammates resume their own conversation.", parameters: sendParameters,
    execute: async (_id, args) => textResult(await team().send("lead", args.to, args.message)) });
  pi.registerTool({ name: "blade_team_status", label: "Team status", description: "Read member states, latest results, and messages since a sequence cursor. No model request.", parameters: statusParameters,
    execute: async (_id, args) => textResult(team().status(args.after ?? 0)) });
  pi.registerTool({ name: "blade_team_wait", label: "Wait for team", description: "Wait for a change after the last sequence cursor; maximum 60 seconds. Returns status and messages without a model request.",
    parameters: Type.Object({ after: Type.Integer({ minimum: 0 }), timeoutMs: Type.Optional(Type.Integer({ minimum: 0, maximum: 60000 })) }),
    execute: async (_id, args, signal) => textResult(await team().wait(args.after, args.timeoutMs ?? 30_000, signal)) });
  pi.registerTool({ name: "blade_team_stop", label: "Stop teammates", description: "Stop and dispose a member, or all members when id is omitted. Stop the current writer before a driver handoff. Save useful results in the project first; sessions are memory-only.",
    parameters: Type.Object({ id: Type.Optional(Type.String()) }),
    execute: async (_id, args) => {
      if (args.id) return textResult(await team().stop(args.id));
      return textResult(await closeTeam("Stopped by lead."));
    } });
  pi.on("agent_end", async (event) => {
    const lastAssistant = [...event.messages].reverse().find((message) => message.role === "assistant");
    if (activeContext?.signal?.aborted || lastAssistant?.stopReason === "aborted") await closeTeam("Lead was interrupted.");
  });
  pi.on("session_shutdown", async () => {
    await closeTeam("Host session ended.");
    manager = undefined;
    activeContext = undefined;
  });
}
