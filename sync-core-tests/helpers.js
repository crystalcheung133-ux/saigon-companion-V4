export class MemoryRepository {
  constructor(records = []) { this.rows = new Map(records.map(record => [record.id, structuredClone(record)])); this.listeners = new Set(); }
  async getAll() { return [...this.rows.values()].map(value => structuredClone(value)); }
  async getById(id) { return this.rows.has(id) ? structuredClone(this.rows.get(id)) : null; }
  async applyRemoteWrite(record) { this.rows.set(record.id, structuredClone(record)); this.emit({ type: 'remote-write', record }); }
  async applyRemoteDelete(id, tombstone) { const row = this.rows.get(id) || { id }; this.rows.set(id, { ...row, ...tombstone }); this.emit({ type: 'remote-delete', recordId: id }); }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  emit(change) { for (const listener of this.listeners) listener(change); }
}

export function makeAdapter(repository, { domain = 'booking', tripId = 'trip-test', schemaVersion = 1 } = {}) {
  return {
    domain,
    tripId,
    schemaVersion,
    repository,
    toRemote: record => ({ ...record }),
    fromRemote: record => ({ id: record.recordId ?? record.id, ...record }),
    getRecordId: record => record.recordId ?? record.id,
    getVersion: record => record.version,
    getTripGeneration: record => record.tripGeneration,
    validateLocal: record => ({ ok: !!record }),
    validateRemote: record => ({ ok: !!record && Number.isInteger(record.version) && Number.isInteger(record.tripGeneration) })
  };
}

export function mutation(overrides = {}) {
  return {
    mutationId: 'm-1',
    tripId: 'trip-test',
    tripGeneration: 1,
    domain: 'booking',
    recordId: 'b-1',
    operation: 'create',
    payload: { id: 'b-1', schemaVersion: 1 },
    createdAt: new Date().toISOString(),
    createdByPartyId: 'party-a',
    retryCount: 0,
    state: 'queued',
    ...overrides
  };
}
