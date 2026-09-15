/** Session lifecycle and mailboxes; no pi dependency, filesystem, or model calls. */
export class TeamController {
  constructor({ createSession, notify = () => {}, maxMembers = 4, maxMessages = 200,
    stopTimeoutMs = 5000 }) {
    this.createSession = createSession;
    this.notify = notify;
    this.maxMembers = maxMembers;
    this.maxMessages = maxMessages;
    this.stopTimeoutMs = stopTimeoutMs;
    this.members = new Map();
    this.events = [];
    this.listeners = new Set();
    this.sequence = 0;
    this.messageCount = 0;
    this.closed = false;
  }

  record(type, data) {
    const event = { sequence: ++this.sequence, type, ...data };
    this.events.push(event);
    if (this.events.length > 200) this.events.shift();
    for (const listener of this.listeners) listener();
    // UI delivery is advisory: a failed notification must not strand a session.
    try { this.notify(event); } catch { /* Status remains available through tools. */ }
  }

  async start({ id, role, roleTemplate, charter, task, ownership, writable = false, maxTurns = 40,
    lifetimeMs = 15 * 60_000, ...context }) {
    if (this.closed) throw new Error("This team is closed; start a new host session.");
    if (!/^[a-z][a-z0-9-]{0,47}$/.test(id) || id === "lead") throw new Error("Invalid member id.");
    if (this.members.has(id)) throw new Error(`Member ${id} already exists; use a new id.`);
    if (!task?.trim() || !ownership?.trim()) throw new Error("Task and explicit ownership are required.");
    if (!Number.isInteger(maxTurns) || maxTurns < 1 || maxTurns > 100) throw new Error("maxTurns must be 1–100.");
    if (!Number.isFinite(lifetimeMs) || lifetimeMs < 1000 || lifetimeMs > 60 * 60_000) throw new Error("Lifetime must be 1 second–60 minutes.");
    const active = [...this.members.values()].filter((member) => !["stopped", "failed"].includes(member.status));
    if (active.length >= this.maxMembers) throw new Error(`Stop an idle member first; limit is ${this.maxMembers}.`);
    if (writable && active.some((member) => member.writable)) throw new Error("Another member owns the writer lease. Stop it before a driver handoff.");
    const member = { id, role, roleTemplate, charter, ownership, writable, maxTurns, turns: 0, status: "starting",
      inbox: [], latest: "", error: undefined, session: undefined, run: undefined, stop: undefined };
    member.stopStarted = new Promise((resolve) => { member.signalStop = resolve; });
    // Reserve capacity and writer ownership before asynchronous creation.
    this.members.set(id, member);
    member.timer = setTimeout(() => { void this.stop(id, "Lifetime limit reached."); }, lifetimeMs);
    member.timer.unref?.();
    this.record("starting", { id, role, writable });
    member.creation = (async () => {
      try {
        const session = await this.createSession({ ...context, id, role, roleTemplate, charter, ownership, writable,
          send: (to, message) => this.send(id, to, message), status: (after) => this.status(after) });
        member.session = session;
        if (member.stop || this.closed) { this.disposeMember(member); return; }
        member.unsubscribe = session.subscribe((event) => {
          if (event.type === "turn_start" && ++member.turns > maxTurns) {
            void this.stop(id, "Turn limit reached.");
          }
        });
        member.status = "idle";
        member.inbox.unshift(`[Assignment from lead]\n${task}`);
        this.pump(member);
      } catch (error) {
        clearTimeout(member.timer);
        this.disposeMember(member);
        if (!member.stop) {
          member.status = "failed";
          member.error = String(error?.message ?? error);
          this.record("failed", { id, error: member.error });
        }
        throw error;
      }
    })();
    const creationTimer = setTimeout(() => { void this.stop(id, "Session creation deadline reached."); }, 15_000);
    try { await Promise.race([member.creation, member.stopStarted]); }
    finally { clearTimeout(creationTimer); }
    return this.memberStatus(member);
  }

  disposeMember(member) {
    if (member.session && !member.disposed) {
      const session = member.session;
      member.disposed = true;
      member.session = undefined;
      session.dispose();
    }
  }

  async send(from, to, message) {
    if (this.closed) throw new Error("This team is closed.");
    if (from !== "lead") {
      const sender = this.members.get(from);
      if (!sender || ["stopping", "stopped", "stop_failed", "failed"].includes(sender.status)) throw new Error("Sender is not active.");
    }
    if (from === to) throw new Error("Send a message to another member, not yourself.");
    if (typeof message !== "string" || !message.trim() || message.length > 12_000) throw new Error("Message must contain 1–12000 characters.");
    const member = to === "lead" ? undefined : this.members.get(to);
    if (to !== "lead" && (!member || ["stopping", "stopped", "stop_failed", "failed"].includes(member.status))) throw new Error(`Recipient ${to} is not active.`);
    if (this.messageCount >= this.maxMessages) throw new Error("Team message limit reached. Report results to the lead and stop.");
    this.messageCount++;
    this.record("message", { from, to, text: message });
    if (member) {
      const text = `[Team message from ${from}]\n${message}`;
      if (member.run && member.session?.isStreaming) {
        // steer() queues before its first await. Late, unconsumed steering is
        // recovered by pump's finally block and delivered in a new prompt.
        await member.session.steer(text);
      } else {
        member.inbox.push(text);
        this.pump(member);
      }
    }
    return { delivered: true, from, to, sequence: this.sequence };
  }

  pump(member) {
    if (!member.session || member.run || member.stop || this.closed || !member.inbox.length) return;
    member.status = "running";
    const text = member.inbox.splice(0).join("\n\n");
    this.record("running", { id: member.id });
    // Schedule the call after assigning run, including with synchronous fakes.
    member.run = Promise.resolve().then(() => member.stop ? undefined : member.session.prompt(text, { expandPromptTemplates: false }))
      .then(() => {
        if (member.stop) return;
        const last = [...member.session.messages].reverse().find((message) => message.role === "assistant");
        member.latest = (last?.content ?? []).filter((part) => part.type === "text").map((part) => part.text).join("\n").slice(-16_000);
        if (last?.stopReason === "error" || last?.stopReason === "aborted") {
          throw new Error(last.errorMessage || `Agent response ${last.stopReason}.`);
        }
        member.status = "idle";
        this.record("idle", { id: member.id, text: member.latest });
      })
      .catch((error) => {
        if (member.stop) return;
        member.error = String(error?.message ?? error);
        member.inbox.length = 0;
        this.record("failed", { id: member.id, error: member.error });
        void this.stop(member.id, member.error);
      })
      .finally(() => {
        member.run = undefined;
        if (member.stop) return;
        const remaining = member.session.clearQueue();
        member.inbox.unshift(...remaining.steering, ...remaining.followUp);
        this.pump(member);
      });
  }

  memberStatus(member) {
    return { id: member.id, role: member.role, status: member.status, writable: member.writable,
      ...(member.roleTemplate ? { roleTemplate: member.roleTemplate } : {}),
      ...(member.charter ? { charter: member.charter } : {}),
      ownership: member.ownership, turns: member.turns, maxTurns: member.maxTurns,
      latest: member.latest, ...(member.stopReason ? { stopReason: member.stopReason } : {}),
      ...(member.error ? { error: member.error } : {}) };
  }

  status(after = 0) {
    return { sequence: this.sequence, closed: this.closed, messagesRemaining: this.maxMessages - this.messageCount,
      eventsTruncated: this.events.length > 0 && after < this.events[0].sequence - 1,
      members: [...this.members.values()].map((member) => this.memberStatus(member)),
      events: this.events.filter((event) => event.sequence > after) };
  }

  async wait(after = this.sequence, timeoutMs = 30_000, signal) {
    if (!Number.isInteger(after) || after < 0 || !Number.isInteger(timeoutMs) || timeoutMs < 0 || timeoutMs > 60_000) throw new Error("Invalid cursor or wait timeout; maximum is 60000 ms.");
    if (this.sequence > after || this.closed || timeoutMs === 0 || signal?.aborted) return this.status(after);
    await new Promise((resolve) => {
      const done = () => { clearTimeout(timer); this.listeners.delete(done); signal?.removeEventListener("abort", done); resolve(); };
      const timer = setTimeout(done, timeoutMs);
      this.listeners.add(done);
      signal?.addEventListener("abort", done, { once: true });
    });
    return this.status(after);
  }

  async stop(id, reason = "Stopped by lead.") {
    const member = this.members.get(id);
    if (!member) throw new Error(`Unknown member ${id}.`);
    if (member.stop) return member.stop;
    member.status = "stopping";
    member.stopReason = reason;
    member.signalStop();
    clearTimeout(member.timer);
    member.inbox.length = 0;
    this.record("stopping", { id, reason });
    member.stop = (async () => {
      let timer;
      try {
        await Promise.race([
          (async () => { await member.creation?.catch(() => {}); await member.session?.abort(); })(),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Session did not stop within the cleanup deadline; writer lease retained.")), this.stopTimeoutMs); }),
        ]);
        member.status = "stopped";
      } catch (error) {
        member.status = "stop_failed";
        member.error = String(error?.message ?? error);
      } finally {
        clearTimeout(timer);
        member.unsubscribe?.();
        member.unsubscribe = undefined;
        this.disposeMember(member);
        this.record(member.status, { id, reason, ...(member.error ? { error: member.error } : {}) });
      }
      return this.memberStatus(member);
    })();
    return member.stop;
  }

  async close(reason = "Host session ended.") {
    this.closed = true;
    const result = await Promise.all([...this.members.keys()].map((id) => this.stop(id, reason)));
    this.record("closed", { reason });
    return result;
  }
}
