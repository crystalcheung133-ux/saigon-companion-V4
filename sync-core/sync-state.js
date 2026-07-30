const DEFAULT_DOMAIN_STATE = Object.freeze({
  connection: 'offline',
  pendingCount: 0,
  failedCount: 0,
  conflictCount: 0,
  lastSuccessfulSyncAt: null,
  lastError: null,
  pausedReason: null
});

export class SyncStateStore {
  #domains = new Map();
  #listeners = new Set();

  ensure(domain) {
    if (!this.#domains.has(domain)) this.#domains.set(domain, { domain, ...DEFAULT_DOMAIN_STATE });
    return this.#domains.get(domain);
  }

  update(domain, patch) {
    const next = { ...this.ensure(domain), ...structuredClone(patch), domain };
    this.#domains.set(domain, next);
    this.#emit();
    return structuredClone(next);
  }

  snapshot(domain) {
    if (domain) return structuredClone(this.ensure(domain));
    return { domains: Array.from(this.#domains.values(), value => structuredClone(value)) };
  }

  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    this.#listeners.add(listener);
    try { listener(this.snapshot()); } catch {}
    return () => this.#listeners.delete(listener);
  }

  #emit() {
    for (const listener of this.#listeners) {
      try { listener(this.snapshot()); } catch {}
    }
  }
}
