import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

// Optional real-loader smoke: PI_SDK_ROOT points at an installed pi package.
// This loads the extension and reads its tool schemas. No credentials/model calls.
test("installed pi loads source and generated Blade team tools without starting model work", {
  skip: !process.env.PI_SDK_ROOT && "Set PI_SDK_ROOT to an installed @earendil-works/pi-coding-agent package.",
}, async () => {
  const sdk = await import(pathToFileURL(join(process.env.PI_SDK_ROOT, "dist/index.js")).href);
  const dir = await mkdtemp(join(tmpdir(), "blade-pi-loader-"));
  try {
    for (const relative of ["../adapters/pi/extensions/blade-team/index.ts", "../pi/blade/extensions/blade-team/index.ts"]) {
      const entry = fileURLToPath(new URL(relative, import.meta.url));
      const loader = new sdk.DefaultResourceLoader({
        cwd: dir, agentDir: dir, settingsManager: sdk.SettingsManager.inMemory(),
        noExtensions: true, noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true,
        additionalExtensionPaths: [resolve(entry)],
      });
      await loader.reload();
      const result = loader.getExtensions();
      assert.deepEqual(result.errors, []);
      const names = result.extensions.flatMap((extension) => [...extension.tools.keys()]);
      assert.deepEqual(names.sort(), ["blade_team_send", "blade_team_start", "blade_team_status", "blade_team_stop", "blade_team_wait"]);
      const extension = result.extensions.find((item) => item.tools.has("blade_team_status"));
      const getStatus = async () => JSON.parse((await extension.tools.get("blade_team_status").definition.execute("status-test", {})).content[0].text);
      assert.equal((await getStatus()).closed, false);
      for (const handler of extension.handlers.get("agent_end")) {
        await handler({ messages: [{ role: "assistant", stopReason: "aborted" }] });
      }
      assert.equal((await getStatus()).closed, false, "An interrupted team can be started again without an extra stop command.");
      for (const handler of extension.handlers.get("session_shutdown")) await handler();
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("installed SDK constructs isolated, bounded-tool sessions using host model and auth bridge", {
  skip: !process.env.PI_SDK_ROOT && "Set PI_SDK_ROOT to an installed pi package.",
}, async () => {
  const sdkRoot = process.env.PI_SDK_ROOT;
  const { createJiti } = await import(pathToFileURL(join(sdkRoot, "node_modules/jiti/lib/jiti.mjs")).href);
  const jiti = createJiti(import.meta.url, { moduleCache: false, alias: {
    "@earendil-works/pi-coding-agent": join(sdkRoot, "dist/index.js"),
    "@earendil-works/pi-ai": join(sdkRoot, "node_modules/@earendil-works/pi-ai/dist/compat.js"),
  } });
  const { createMemberSession: createSession, selectTools } = await jiti.import(fileURLToPath(new URL("../adapters/pi/extensions/blade-team/session.ts", import.meta.url)));
  const charter = { purpose: "Verify the assigned result.", viewpoint: "Independent evidence and correctness.",
    keyQuestions: ["Does the candidate meet its criteria?"], expectedEvidence: ["Inspected candidate and source checks."],
    decisionBoundary: "Report findings to lead; no external actions." };
  const createMemberSession = (options) => createSession({ charter, ...options });
  assert.deepEqual(selectTools(["read", "bash", "custom"], [
    { name: "read", sourceInfo: { source: "builtin" } },
    { name: "bash", sourceInfo: { source: "builtin" } },
  ], false), ["read"]);
  assert.throws(() => selectTools(["write"], [{ name: "write", sourceInfo: { source: "extension" } }], true), /overridden tool/);
  const dir = await mkdtemp(join(tmpdir(), "blade-pi-session-"));
  const sessions = [];
  try {
    await mkdir(join(dir, "team/roles"), { recursive: true });
    await writeFile(join(dir, "runtime.md"), "Runtime fixture.");
    await writeFile(join(dir, "team/workflow.md"), "Workflow fixture.");
    await writeFile(join(dir, "team/roles/coder.md"), "Role fixture.");
    await writeFile(join(dir, "team/roles/expert.md"), "Generic expert fixture.");
    let streamCalls = 0;
    let authCalls = 0;
    const model = { id: "fake", name: "Fake", provider: "blade-test", api: "openai-completions",
      baseUrl: "http://invalid.test", reasoning: false, input: ["text"], contextWindow: 32000,
      maxTokens: 1024, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } };
    const provider = { id: model.provider, name: "Test",
      stream: () => { streamCalls++; throw new Error("Unexpected model request"); },
      streamSimple: () => { streamCalls++; throw new Error("Unexpected model request"); } };
    const ctx = { cwd: dir, model, thinkingLevel: "off", getSystemPrompt: () => "Host instruction fixture.",
      modelRegistry: { getProvider: () => provider, getApiKeyAndHeaders: async () => { authCalls++; return {
        ok: true, apiKey: "test-only", headers: { "x-model-fixture": "configured" }, baseUrl: "https://invalid.test/model-route", env: { TEST_SCOPE: "yes" },
      }; } } };
    await assert.rejects(createMemberSession({ ctx, id: "unacknowledged-writer", role: "coder", ownership: "src/file.js", writable: true,
      packageRoot: dir, activeTools: [], toolMetadata: [], peerTools: [] }), /directBuiltins/);
    for (const id of ["driver", "pair"]) {
      sessions.push(await createMemberSession({ ctx, id, role: "coder", ownership: "Read-only review.", writable: false,
        packageRoot: dir, activeTools: ["read", "bash"], toolMetadata: [{ name: "read", sourceInfo: { source: "builtin" } }], peerTools: [] }));
    }
    assert.notEqual(sessions[0].sessionId, sessions[1].sessionId);
    assert.notEqual(sessions[0].messages, sessions[1].messages);
    assert.equal(sessions[0].sessionFile, undefined);
    assert.equal(sessions[0].model.id, model.id);
    assert.equal(sessions[0].thinkingLevel, "off");
    assert.deepEqual(sessions[0].getActiveToolNames(), ["read"]);
    assert.match(sessions[0].systemPrompt, /Host instruction fixture/);
    assert.match(sessions[0].systemPrompt, /Role fixture/);
    assert.equal(authCalls, 0);
    const auth = await sessions[0].modelRuntime.getAuth(model);
    assert.equal(auth.auth.apiKey, "test-only");
    assert.equal(auth.auth.headers["x-model-fixture"], "configured");
    assert.equal(auth.auth.baseUrl, "https://invalid.test/model-route");
    assert.equal(auth.env.TEST_SCOPE, "yes");
    assert.equal(authCalls, 1);
    assert.equal(streamCalls, 0);
    sessions.push(await createMemberSession({ ctx, id: "acknowledged-writer", role: "coder", ownership: "src/file.js", writable: true, directBuiltins: true,
      packageRoot: dir, activeTools: ["read", "write"], toolMetadata: ["read", "write"].map((name) => ({ name, sourceInfo: { source: "builtin" } })), peerTools: [] }));
    assert.deepEqual(sessions.at(-1).getActiveToolNames(), ["read", "write"]);
    const packageRoot = fileURLToPath(new URL("../pi/blade", import.meta.url));
    sessions.push(await createMemberSession({ ctx, id: "packaged-architect", role: "architect", ownership: "Read-only design.", writable: false,
      packageRoot, activeTools: ["read"], toolMetadata: [{ name: "read", sourceInfo: { source: "builtin" } }], peerTools: [] }));
    assert.ok(sessions.at(-1).systemPrompt.includes(await readFile(join(packageRoot, "team/roles/architect.md"), "utf8")));
    assert.ok(sessions.at(-1).systemPrompt.includes(await readFile(join(packageRoot, "team/workflow.md"), "utf8")));
    sessions.push(await createMemberSession({ ctx, id: "methods-reviewer", role: "research-methods-reviewer", ownership: "Read-only methods assessment.", writable: false,
      packageRoot, activeTools: ["read", "write"], toolMetadata: [{ name: "read", sourceInfo: { source: "builtin" } }], peerTools: [] }));
    assert.deepEqual(sessions.at(-1).getActiveToolNames(), ["read"]);
    assert.ok(sessions.at(-1).systemPrompt.includes(await readFile(join(packageRoot, "team/roles/expert.md"), "utf8")));
    assert.match(sessions.at(-1).systemPrompt, /acting as research-methods-reviewer/);
    for (const value of Object.values(charter).flat()) assert.ok(sessions.at(-1).systemPrompt.includes(value));
    sessions.push(await createMemberSession({ ctx, id: "report-author", role: "report-author", ownership: "report.md", writable: true, directBuiltins: true,
      packageRoot, activeTools: ["read", "write"], toolMetadata: ["read", "write"].map(name => ({ name, sourceInfo: { source: "builtin" } })), peerTools: [] }));
    assert.deepEqual(sessions.at(-1).getActiveToolNames(), ["read", "write"]);
    assert.equal(streamCalls, 0);
  } finally {
    for (const session of sessions) session.dispose();
    await rm(dir, { recursive: true, force: true });
  }
});
