import { assertProvider } from './sync-provider.js';
import { SyncMutationQueue } from './sync-queue.js';
import { SyncStateStore } from './sync-state.js';
import { reconcileRecord } from './sync-reconciler.js';
import { MemoryFirstSyncStore, SyncResetOrchestrator } from './sync-reset-orchestrator.js';

function clone(value) { return structuredClone(value); }

export class TravelSyncEngine {
  #provider;
  #queue;
  #state;
  #firstSync;
  #adapters = new Map();
  #unsubscribers = [];
  #started = false;
  #conflicts = new Map();
  #acknowledgedMutationIds = new Set();

  constructor({ provider, queue = new SyncMutationQueue(), stateStore = new SyncStateStore(), firstSyncStore = new MemoryFirstSyncStore(), deviceId = 'device-local' }) {
    this.#provider = assertProvider(provider);
    this.#queue = queue;
    this.#state = stateStore;
    this.#firstSync = firstSyncStore;
    this.deviceId = deviceId;
  }

  registerDomain(adapter) {
    if (this.#started) throw new Error('Domains can only be registered before start');
    validateAdapter(adapter);
    if (this.#adapters.has(adapter.domain)) throw new Error(`Domain already registered: ${adapter.domain}`);
    this.#adapters.set(adapter.domain, adapter);
    this.#state.ensure(adapter.domain);
  }

  async start() {
    if (this.#started) return;
    try {
      await this.#provider.connect();
      this.#started = true;
      for (const [domain, adapter] of this.#adapters) {
        this.#state.update(domain, { connection: 'online', lastError: null });
        const unsub = await this.#provider.subscribe({ tripId: adapter.tripId, domain }, change => {
          void this.#handleRemote(domain, change).catch(error => {
            this.#state.update(domain, { lastError: error?.message || 'remote-change-failed' });
          });
        });
        this.#unsubscribers.push(unsub);
      }
    } catch (error) {
      for (const domain of this.#adapters.keys()) this.#state.update(domain, { connection: 'error', lastError: error?.message || 'connect-failed' });
      this.#started = false;
      throw error;
    }
  }

  async stop() {
    for (const unsubscribe of this.#unsubscribers.splice(0)) {
      try { await unsubscribe?.(); } catch {}
    }
    await this.#provider.disconnect();
    this.#started = false;
    for (const domain of this.#adapters.keys()) this.#state.update(domain, { connection: 'offline' });
  }

  getState(domain) { return this.#state.snapshot(domain); }
  subscribe(listener) { return this.#state.subscribe(listener); }
  async enqueueMutation(mutation) {
    const adapter = this.#adapters.get(mutation?.domain);
    if (!adapter) throw new Error(`Unknown domain: ${mutation?.domain}`);
    if (String(mutation.tripId) !== adapter.tripId) throw new Error('Mutation trip does not match adapter');
    const openConflict = this.listConflicts(mutation.domain).find(conflict => conflict.recordId === mutation.recordId);
    if (openConflict) return { held: true, conflictId: openConflict.conflictId };
    const queued = await this.#queue.enqueue(mutation);
    await this.#refreshDomainCounts(mutation.domain);
    return queued;
  }
  listConflicts(domain) {
    return [...this.#conflicts.values()].filter(c => !domain || c.domain === domain).map(clone);
  }

  async syncNow(domain) {
    const domains = domain ? [domain] : [...this.#adapters.keys()];
    const result = {};
    for (const currentDomain of domains) {
      try { result[currentDomain] = await this.#syncDomain(currentDomain); }
      catch (error) {
        this.#state.update(currentDomain, { lastError: error?.message || 'sync-failed' });
        result[currentDomain] = { pushed: 0, failed: 1, received: 0, errors: [error?.message || 'sync-failed'] };
      }
    }
    return result;
  }

  async retryFailed(domain) {
    for (const item of await this.#queue.list(domain ? { domain } : {})) {
      if (item.state === 'failed') await this.#queue.mark(item.mutationId, { state: 'queued', lastError: undefined });
    }
    return this.syncNow(domain);
  }

  async discardConflict(conflictId) {
    const conflict = this.#conflicts.get(conflictId);
    if (!conflict) return false;
    if (conflict.mutationId) await this.#queue.remove(conflict.mutationId);
    this.#conflicts.delete(conflictId);
    await this.#refreshDomainCounts(conflict.domain);
    return true;
  }

  async resolveConflict(conflictId, resolution) {
    const conflict = this.#conflicts.get(conflictId);
    if (!conflict) throw new Error(`Unknown conflict: ${conflictId}`);
    const adapter = this.#adapters.get(conflict.domain);
    if (!adapter) throw new Error(`Unknown domain: ${conflict.domain}`);

    if (resolution?.strategy === 'use-remote') {
      if (conflict.remoteRecord?.deletedAt) {
        await adapter.repository.applyRemoteDelete(conflict.recordId, {
          deletedAt: conflict.remoteRecord.deletedAt,
          version: adapter.getVersion(conflict.remoteRecord),
          tripGeneration: adapter.getTripGeneration(conflict.remoteRecord)
        });
      } else {
        await adapter.repository.applyRemoteWrite(adapter.fromRemote(conflict.remoteRecord));
      }
      if (conflict.mutationId) await this.#queue.remove(conflict.mutationId);
    } else if (resolution?.strategy === 'keep-local') {
      if (!conflict.mutationId) throw new Error('Conflict has no local mutation to keep');
      const remoteVersion = adapter.getVersion(conflict.remoteRecord);
      await this.#queue.mark(conflict.mutationId, { state: 'queued', baseVersion: remoteVersion, lastError: undefined });
    } else {
      throw new TypeError('Conflict resolution strategy must be use-remote or keep-local');
    }

    this.#conflicts.delete(conflictId);
    await this.#refreshDomainCounts(conflict.domain);
    return true;
  }

  async prepareGenerationReset(request) { return this.#resetOrchestrator().prepare(request); }
  async commitGenerationReset(plan) {
    const generation = await this.#resetOrchestrator().commit(plan);
    for (const [id, conflict] of this.#conflicts) if (conflict.tripId === plan.tripId) this.#conflicts.delete(id);
    for (const domain of this.#adapters.keys()) await this.#refreshDomainCounts(domain);
    return generation;
  }

  async onGenerationBump(event) {
    this.#queue.pauseDispatch();
    try {
      await this.#queue.discardOlderGeneration(event.tripId, event.currentGeneration);
      await this.#firstSync.clearTrip(event.tripId);
      for (const adapter of this.#adapters.values()) {
        if (adapter.tripId === event.tripId && typeof adapter.onGenerationBump === 'function') await adapter.onGenerationBump(event);
      }
    } finally {
      this.#queue.resumeDispatch();
    }
  }

  async #syncDomain(domain) {
    const adapter = this.#adapters.get(domain);
    if (!adapter) throw new Error(`Unknown domain: ${domain}`);
    if (this.#queue.dispatchPaused) return { pushed: 0, failed: 0, received: 0, paused: true };
    if (this.#state.snapshot(domain).pausedReason) return { pushed: 0, failed: 0, received: 0, paused: true };

    const generation = await this.#provider.getTripGeneration(adapter.tripId);
    await this.#queue.discardOlderGeneration(adapter.tripId, generation);
    let pushed = 0;
    let failed = 0;
    const errors = [];

    for (const mutation of await this.#queue.list({ domain })) {
      if (mutation.state === 'conflict') continue;
      try {
        await this.#queue.mark(mutation.mutationId, { state: 'sending' });
        const response = await this.#provider.pushMutation(mutation);
        if (response.ok) {
          const canonical = response.record;
          if (canonical) {
            if (canonical.deletedAt) {
              await adapter.repository.applyRemoteDelete(mutation.recordId, {
                deletedAt: canonical.deletedAt,
                version: adapter.getVersion(canonical),
                tripGeneration: adapter.getTripGeneration(canonical)
              });
            } else {
              await adapter.repository.applyRemoteWrite(adapter.fromRemote(canonical));
            }
          }
          this.#rememberAcknowledgedMutation(mutation.mutationId);
          await this.#queue.remove(mutation.mutationId);
          pushed += 1;
        } else if (response.code === 'version_conflict') {
          await this.#queue.mark(mutation.mutationId, { state: 'conflict', lastError: response.code, retryCount: mutation.retryCount + 1 });
          this.#recordConflict({ domain, adapter, mutation, remoteRecord: response.remote, reason: 'push-version-conflict' });
          failed += 1;
        } else {
          await this.#queue.mark(mutation.mutationId, { state: 'failed', lastError: response.code || 'provider-rejected', retryCount: mutation.retryCount + 1 });
          failed += 1;
        }
      } catch (error) {
        await this.#queue.mark(mutation.mutationId, { state: 'failed', lastError: error?.message || 'push-failed', retryCount: mutation.retryCount + 1 });
        failed += 1;
        errors.push({ mutationId: mutation.mutationId, error: error?.message || 'push-failed' });
      }
    }

    let remote = [];
    try { remote = await this.#provider.fetchChanges({ tripId: adapter.tripId, domain }); }
    catch (error) {
      failed += 1;
      errors.push({ phase: 'fetch', error: error?.message || 'fetch-failed' });
    }

    let received = 0;
    for (const row of remote) {
      try {
        await this.#handleRemote(domain, row);
        received += 1;
      } catch (error) {
        failed += 1;
        errors.push({ recordId: safeRecordId(adapter, row), error: error?.message || 'remote-apply-failed' });
      }
    }

    const remaining = await this.#queue.list({ domain });
    this.#state.update(domain, {
      pendingCount: remaining.filter(x => x.state === 'queued' || x.state === 'sending').length,
      failedCount: remaining.filter(x => x.state === 'failed').length,
      conflictCount: this.listConflicts(domain).length,
      lastSuccessfulSyncAt: failed ? this.#state.snapshot(domain).lastSuccessfulSyncAt : new Date().toISOString(),
      lastError: failed ? 'sync-partial-failure' : null
    });
    return { pushed, failed, received, errors };
  }

  async #handleRemote(domain, row) {
    const adapter = this.#adapters.get(domain);
    if (!adapter) return;
    if (row?.mutationId && this.#acknowledgedMutationIds.has(row.mutationId)) return;

    const id = safeRecordId(adapter, row);
    const local = await adapter.repository.getById(id);
    const pending = (await this.#queue.list({ domain })).find(x => x.recordId === id);
    if (pending?.mutationId && row?.mutationId === pending.mutationId) return;

    const currentGeneration = await this.#provider.getTripGeneration(adapter.tripId);
    const decision = reconcileRecord({ localRecord: local, remoteRecord: row, pendingMutation: pending, adapter, currentGeneration });

    if (decision.action === 'apply-remote') {
      if (row.deletedAt) {
        await adapter.repository.applyRemoteDelete(id, {
          deletedAt: row.deletedAt,
          version: adapter.getVersion(row),
          tripGeneration: adapter.getTripGeneration(row)
        });
      } else {
        await adapter.repository.applyRemoteWrite(adapter.fromRemote(row));
      }
    } else if (decision.action === 'conflict') {
      if (pending) await this.#queue.mark(pending.mutationId, { state: 'conflict', lastError: decision.reason });
      this.#recordConflict({ domain, adapter, mutation: pending, remoteRecord: row, reason: decision.reason });
      await this.#refreshDomainCounts(domain);
    } else if (decision.action === 'pause') {
      this.#state.update(domain, { pausedReason: decision.reason, lastError: decision.reason });
    }
  }

  #recordConflict({ domain, adapter, mutation, remoteRecord, reason }) {
    const recordId = mutation?.recordId ?? safeRecordId(adapter, remoteRecord);
    const existing = [...this.#conflicts.values()].find(conflict => conflict.domain === domain && conflict.recordId === recordId && conflict.status === 'open');
    if (existing) return existing.conflictId;
    const conflictId = `${domain}:${recordId}:${mutation?.mutationId || remoteRecord?.mutationId || Date.now()}`;
    this.#conflicts.set(conflictId, {
      conflictId,
      tripId: adapter.tripId,
      domain,
      recordId,
      mutationId: mutation?.mutationId || null,
      baseVersion: mutation?.baseVersion ?? adapter.getVersion(remoteRecord),
      localMutation: mutation ? clone(mutation) : null,
      remoteRecord: clone(remoteRecord),
      reason,
      detectedAt: new Date().toISOString(),
      status: 'open'
    });
    return conflictId;
  }

  #rememberAcknowledgedMutation(mutationId) {
    this.#acknowledgedMutationIds.add(mutationId);
    if (this.#acknowledgedMutationIds.size > 500) {
      const first = this.#acknowledgedMutationIds.values().next().value;
      this.#acknowledgedMutationIds.delete(first);
    }
  }

  async #refreshDomainCounts(domain) {
    const remaining = await this.#queue.list({ domain });
    this.#state.update(domain, {
      pendingCount: remaining.filter(x => x.state === 'queued' || x.state === 'sending').length,
      failedCount: remaining.filter(x => x.state === 'failed').length,
      conflictCount: this.listConflicts(domain).length
    });
  }

  #resetOrchestrator() {
    return new SyncResetOrchestrator({ queue: this.#queue, provider: this.#provider, adapters: this.#adapters, firstSyncStore: this.#firstSync });
  }
}

function safeRecordId(adapter, row) {
  try { return adapter.getRecordId(row); }
  catch { return row?.recordId ?? row?.id ?? 'unknown-record'; }
}

export function validateAdapter(adapter) {
  if (!adapter?.domain || !adapter?.tripId) throw new TypeError('Adapter requires domain and tripId');
  if (!Number.isInteger(adapter.schemaVersion) || adapter.schemaVersion < 1) throw new TypeError('Adapter requires a positive schemaVersion');
  const repo = adapter.repository;
  for (const method of ['getAll','getById','applyRemoteWrite','applyRemoteDelete','subscribe']) {
    if (typeof repo?.[method] !== 'function') throw new TypeError(`Repository is missing ${method}()`);
  }
  for (const method of ['toRemote','fromRemote','getRecordId','getVersion','getTripGeneration','validateLocal','validateRemote']) {
    if (typeof adapter[method] !== 'function') throw new TypeError(`Adapter is missing ${method}()`);
  }
}
