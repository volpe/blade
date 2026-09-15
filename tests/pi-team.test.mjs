import assert from "node:assert/strict";
import test from "node:test";
import { TeamController } from "../adapters/pi/extensions/blade-team/controller.mjs";

const tick = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise((yes) => { resolve = yes; }); return { promise, resolve }; };
class FakeSession {
  messages = [];
  prompts = [];
  steered = [];
  queued = [];
  listeners = new Set();
  isStreaming = false;
  disposed = 0;
  async prompt(text, options) {
    this.prompts.push({ text, options });
    this.isStreaming = true;
    this.emit({ type: "turn_start" });
    this.pending = deferred();
    await this.pending.promise;
    this.isStreaming = false;
  }
  async steer(text) { this.steered.push(text); this.queued.push(text); }
  clearQueue() { const steering = this.queued.splice(0); return { steering, followUp: [] }; }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  emit(event) { for (const listener of this.listeners) listener(event); }
  finish(text = "Done", consumedSteering = true) {
    if (consumedSteering) this.queued.length = 0;
    this.messages.push({ role: "assistant", content: [{ type: "text", text }], stopReason: "stop" });
    this.pending.resolve();
  }
  async abort() { this.pending?.resolve(); this.isStreaming = false; }
  dispose() { this.disposed++; this.pending?.resolve(); }
}
function setup(t, options = {}) {
  const sessions = new Map();
  const manager = new TeamController({
    createSession: async ({ id }) => { const session = new FakeSession(); sessions.set(id, session); return session; },
    ...options,
  });
  t.after(() => manager.close());
  const start = (id, extra = {}) => manager.start({ id, role: "coder", task: `Work for ${id}`, ownership: "src/example.js", ...extra });
  return { manager, sessions, start };
}

test("members have separate conversations; busy delivery steers the recipient", async (t) => {
  const { manager, sessions, start } = setup(t);
  await start("coder");
  await start("pair");
  await tick();
  await manager.send("pair", "coder", "The empty state needs a test.");
  assert.match(sessions.get("coder").steered[0], /from pair.*\nThe empty state/s);
  assert.equal(sessions.get("pair").steered.length, 0);
  assert.notEqual(sessions.get("coder").messages, sessions.get("pair").messages);
});

test("idle delivery resumes the same member history", async (t) => {
  const { manager, sessions, start } = setup(t);
  await start("tester");
  await tick();
  sessions.get("tester").finish("Initial review complete.");
  await tick();
  assert.equal(manager.status().members[0].status, "idle");
  await manager.send("lead", "tester", "Review the latest fix.");
  await tick();
  assert.equal(sessions.get("tester").prompts.length, 2);
  assert.equal(sessions.get("tester").messages.length, 1);
  assert.match(sessions.get("tester").prompts[1].text, /latest fix/);
  assert.equal(sessions.get("tester").prompts[1].options.expandPromptTemplates, false);
});

test("messages arriving before streaming and late unconsumed steering are not lost", async (t) => {
  const gate = deferred();
  const session = new FakeSession();
  const { manager, start } = setup(t, { createSession: async () => { await gate.promise; return session; } });
  const pending = start("coder");
  await manager.send("lead", "coder", "Before session creation finishes.");
  gate.resolve();
  await pending;
  await tick();
  assert.match(session.prompts[0].text, /Before session creation finishes/);
  await manager.send("lead", "coder", "Late steering.");
  session.finish("Turn ended at delivery boundary.", false);
  await tick();
  assert.equal(session.prompts.length, 2);
  assert.match(session.prompts[1].text, /Late steering/);
});

test("concurrent starts reserve writer ownership and capacity before session creation", async (t) => {
  const gate = deferred();
  const { manager, start } = setup(t, { maxMembers: 2, createSession: async () => { await gate.promise; return new FakeSession(); } });
  const first = start("coder", { writable: true });
  await assert.rejects(start("second-writer", { writable: true }), /writer lease/);
  const second = start("pair");
  await assert.rejects(start("third"), /limit is 2/);
  gate.resolve();
  await Promise.all([first, second]);
  await manager.stop("coder");
  await start("new-driver", { writable: true });
});

test("peer messages to lead are observable without waking the lead", async (t) => {
  const notifications = [];
  const { manager, start } = setup(t, { notify: (event) => notifications.push(event) });
  await start("tester");
  const cursor = manager.status().sequence;
  await manager.send("tester", "lead", "Acceptance test fails on empty input.");
  const snapshot = await manager.wait(cursor, 100);
  assert.equal(snapshot.events.filter((event) => event.type === "message")[0].to, "lead");
  assert.ok(notifications.some((event) => event.text?.includes("Acceptance test")));
});

test("message loops and invalid recipients are bounded", async (t) => {
  const { manager, start } = setup(t, { maxMessages: 1 });
  await start("tester");
  await assert.rejects(manager.send("fake", "tester", "Hello"), /Sender/);
  await assert.rejects(manager.send("tester", "tester", "Hello"), /yourself/);
  await assert.rejects(manager.send("tester", "missing", "Hello"), /not active/);
  await manager.send("tester", "lead", "One report.");
  await assert.rejects(manager.send("tester", "lead", "Again."), /message limit/);
});

test("turn budget aborts and disposes a member", async (t) => {
  const { manager, sessions, start } = setup(t);
  await start("coder", { maxTurns: 1, writable: true });
  await tick();
  const session = sessions.get("coder");
  session.emit({ type: "turn_start" });
  await tick();
  assert.equal(manager.status().members[0].status, "stopped");
  assert.equal(session.disposed, 1);
  assert.equal(session.listeners.size, 0);
});

test("host shutdown stops sessions, disposes once, and rejects further work", async (t) => {
  const { manager, sessions, start } = setup(t);
  await start("coder");
  await start("pair");
  await manager.close();
  await manager.close();
  for (const session of sessions.values()) {
    assert.equal(session.disposed, 1);
    assert.equal(session.listeners.size, 0);
  }
  await assert.rejects(start("later"), /closed/);
  await assert.rejects(manager.send("lead", "coder", "Continue"), /closed/);
  assert.equal(manager.listeners.size, 0);
});

test("stopping during creation disposes late sessions without launching them", async (t) => {
  const gate = deferred();
  const session = new FakeSession();
  const { manager, start } = setup(t, { stopTimeoutMs: 10, createSession: async () => { await gate.promise; return session; } });
  const starting = start("coder", { writable: true });
  const stopping = manager.stop("coder");
  const result = await starting;
  assert.equal(result.status, "stopping");
  await stopping;
  gate.resolve();
  await tick();
  assert.equal(session.prompts.length, 0);
  assert.equal(session.disposed, 1);
});

test("a stuck abort retains the writer lease and reports cleanup failure", async (t) => {
  const session = new FakeSession();
  session.abort = () => new Promise(() => {});
  const { manager, start } = setup(t, { stopTimeoutMs: 10, createSession: async () => session });
  await start("coder", { writable: true });
  const result = await manager.stop("coder");
  assert.equal(result.status, "stop_failed");
  assert.equal(session.disposed, 1);
  await assert.rejects(start("replacement", { writable: true }), /writer lease/);
});

test("wait is bounded and cancellation removes listeners", async (t) => {
  const { manager } = setup(t);
  const abort = new AbortController();
  const pending = manager.wait(0, 1000, abort.signal);
  abort.abort();
  await pending;
  assert.equal(manager.listeners.size, 0);
  await manager.wait(0, 1);
  assert.equal(manager.listeners.size, 0);
  await assert.rejects(manager.wait(0, 60_001), /maximum/);
});

test("model failure is preserved as a failed result and cleaned up", async (t) => {
  const { manager, sessions, start } = setup(t);
  await start("tester");
  await tick();
  const session = sessions.get("tester");
  session.messages.push({ role: "assistant", content: [], stopReason: "error", errorMessage: "Provider rejected request" });
  session.pending.resolve();
  await tick();
  const member = manager.status().members[0];
  assert.equal(member.status, "stopped");
  assert.match(member.error, /Provider rejected/);
  assert.equal(session.disposed, 1);
});
