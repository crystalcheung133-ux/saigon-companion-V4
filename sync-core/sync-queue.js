function clone(value) { return structuredClone(value); }

export class MemoryQueueStore {
  #items = new Map();
  #closed = false;
  async list() { this.#assertOpen(); return Array.from(this.#items.values(), clone).sort((a,b) => a.createdAt.localeCompare(b.createdAt)); }
  async put(item) { this.#assertOpen(); this.#items.set(item.mutationId, clone(item)); }
  async delete(id) { this.#assertOpen(); this.#items.delete(id); }
  async clear() { this.#assertOpen(); this.#items.clear(); }
  async close() { this.#closed = true; }
  async reopen() { this.#closed = false; }
  #assertOpen() { if (this.#closed) throw new Error('Queue store is closed'); }
}

export class SyncMutationQueue {
  #store;
  #dispatchPaused = false;
  #active = 0;
  #idleWaiters = new Set();

  constructor(store = new MemoryQueueStore()) { this.#store = store; }

  async enqueue(mutation) {
    validateMutation(mutation);
    return this.#withOperation(async () => {
      const all = await this.#store.list();
      const existing = all.filter(x => x.domain === mutation.domain && x.recordId === mutation.recordId && ['queued','failed'].includes(x.state));
      const compacted = compactMutations(existing, mutation);
      for (const item of existing) await this.#store.delete(item.mutationId);
      if (!compacted) return null;
      await this.#store.put(clone(compacted));
      return clone(compacted);
    });
  }

  async list(filter = {}) {
    return this.#withOperation(async () => {
      const all = await this.#store.list();
      return all.filter(item => Object.entries(filter).every(([k,v]) => item[k] === v));
    });
  }

  async mark(mutationId, patch) {
    return this.#withOperation(async () => {
      const item = (await this.#store.list()).find(x => x.mutationId === mutationId);
      if (!item) return null;
      const next = { ...item, ...patch };
      validateMutation(next);
      await this.#store.put(next);
      return clone(next);
    });
  }

  async remove(id) { return this.#withOperation(() => this.#store.delete(id)); }

  async discardOlderGeneration(tripId, currentGeneration) {
    return this.#withOperation(async () => {
      for (const item of await this.#store.list()) {
        if (item.tripId === tripId && item.tripGeneration < currentGeneration) await this.#store.delete(item.mutationId);
      }
    });
  }

  pauseDispatch() { this.#dispatchPaused = true; }
  resumeDispatch() { this.#dispatchPaused = false; }
  get dispatchPaused() { return this.#dispatchPaused; }

  async waitForIdle() {
    if (this.#active === 0) return;
    await new Promise(resolve => this.#idleWaiters.add(resolve));
  }

  async closeStore() {
    await this.waitForIdle();
    await this.#store.close?.();
  }

  async reopenStore() { await this.#store.reopen?.(); }

  async #withOperation(fn) {
    this.#active += 1;
    try { return await fn(); }
    finally {
      this.#active -= 1;
      if (this.#active === 0) {
        for (const resolve of this.#idleWaiters) resolve();
        this.#idleWaiters.clear();
      }
    }
  }
}

export function validateMutation(m) {
  const required = ['mutationId','tripId','tripGeneration','domain','recordId','operation','createdAt','createdByPartyId','retryCount','state'];
  for (const key of required) if (m?.[key] === undefined || m[key] === null || m[key] === '') throw new TypeError(`Mutation missing ${key}`);
  if (!['create','update','delete'].includes(m.operation)) throw new TypeError('Invalid mutation operation');
  if (!['queued','sending','failed','conflict'].includes(m.state)) throw new TypeError('Invalid mutation state');
  if (m.operation !== 'create' && !Number.isInteger(m.baseVersion)) throw new TypeError('baseVersion is required for update/delete');
  if (m.operation === 'create' && m.baseVersion !== undefined) throw new TypeError('create mutation must not include baseVersion');
}

export function compactMutations(existing, incoming) {
  if (!existing.length) return incoming;
  const first = existing[0];
  const last = existing[existing.length - 1];

  if (first.operation === 'create') {
    if (incoming.operation === 'delete') return null;
    if (incoming.operation === 'update') {
      return {
        ...first,
        mutationId: incoming.mutationId,
        payload: { ...(first.payload || {}), ...(incoming.payload || {}) },
        createdAt: incoming.createdAt,
        retryCount: 0,
        state: 'queued',
        lastError: undefined
      };
    }
  }

  if (incoming.operation === 'delete') {
    return { ...incoming, baseVersion: first.baseVersion ?? incoming.baseVersion, retryCount: 0, state: 'queued', lastError: undefined };
  }

  if (incoming.operation === 'update') {
    return {
      ...incoming,
      baseVersion: first.baseVersion ?? incoming.baseVersion,
      payload: { ...(last.payload || {}), ...(incoming.payload || {}) },
      retryCount: 0,
      state: 'queued',
      lastError: undefined
    };
  }

  return incoming;
}
