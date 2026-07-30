import { assertProvider, SyncProviderError } from './sync-provider.js';

export class SyncTestProvider {
  #connected = false;
  #generation = new Map();
  #rows = new Map();
  #listeners = new Set();
  #pushFailures = new Map();

  constructor({ tripId = 'trip-test', generation = 1 } = {}) { this.#generation.set(tripId, generation); }
  async connect() { this.#connected = true; }
  async disconnect() { this.#connected = false; }
  async ping() { return this.#connected; }
  async getTripGeneration(tripId) { return this.#generation.get(tripId) ?? 1; }
  failNextPush(recordId, error = new SyncProviderError('Injected failure', 'injected_failure')) { this.#pushFailures.set(recordId, error); }
  seed(row) { this.#rows.set(`${row.domain}:${row.recordId}`, structuredClone(row)); }
  getRow(domain, recordId) { const row = this.#rows.get(`${domain}:${recordId}`); return row ? structuredClone(row) : null; }
  emit(row) { for (const listener of this.#listeners) listener(structuredClone(row)); }

  async bumpTripGeneration(tripId, expected, partyId) {
    const current = await this.getTripGeneration(tripId);
    if (current !== expected) throw new SyncProviderError('Generation conflict', 'generation_conflict');
    const next = current + 1;
    this.#generation.set(tripId, next);
    return next;
  }

  async fetchChanges({ tripId, domain }) {
    return [...this.#rows.values()].filter(row => row.tripId === tripId && row.domain === domain).map(value => structuredClone(value));
  }

  async pushMutation(mutation) {
    const injected = this.#pushFailures.get(mutation.recordId);
    if (injected) { this.#pushFailures.delete(mutation.recordId); throw injected; }

    const currentGeneration = await this.getTripGeneration(mutation.tripId);
    if (mutation.tripGeneration !== currentGeneration) return { ok: false, code: 'generation_mismatch', currentGeneration };

    const key = `${mutation.domain}:${mutation.recordId}`;
    const existing = this.#rows.get(key);
    if (mutation.operation !== 'create' && (existing?.version ?? 0) !== mutation.baseVersion) {
      return { ok: false, code: 'version_conflict', remote: existing ? structuredClone(existing) : null };
    }

    const version = (existing?.version ?? 0) + 1;
    const row = {
      ...(mutation.payload || {}),
      tripId: mutation.tripId,
      domain: mutation.domain,
      recordId: mutation.recordId,
      schemaVersion: mutation.payload?.schemaVersion ?? existing?.schemaVersion ?? 1,
      version,
      tripGeneration: mutation.tripGeneration,
      mutationId: mutation.mutationId,
      deletedAt: mutation.operation === 'delete' ? new Date().toISOString() : null
    };
    this.#rows.set(key, row);
    for (const listener of this.#listeners) listener(structuredClone(row));
    return { ok: true, record: structuredClone(row), version };
  }

  async subscribe(request, onChange) {
    const listener = row => {
      if (row.tripId === request.tripId && (!request.domain || row.domain === request.domain)) onChange(structuredClone(row));
    };
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
}

assertProvider(new SyncTestProvider());
