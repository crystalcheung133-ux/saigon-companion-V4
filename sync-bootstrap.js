/* sync-bootstrap.js - VN Stage E Booking Sync Certification. Safe default: OFF. */
import { TravelSyncEngine } from './sync-core/index.js';
import { SyncMutationQueue } from './sync-core/sync-queue.js';
import { IndexedDbQueueStore, IndexedDbFirstSyncStore } from './sync-core/sync-indexeddb-store.js';
import { createBookingSyncAdapter } from './booking-sync-adapter.js';
import { SupabaseSyncProvider } from './supabase-sync-provider.mjs';

const DOMAIN = 'booking';
const uuid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const clone = value => structuredClone(value);

function selectedPartyId() {
  const key = globalThis.STORAGE_CONFIG?.keys?.friend || 'saigon_friend';
  const friend = globalThis.STORAGE?.local?.get(key, 'crystal') || 'crystal';
  return String(friend).startsWith('party-') ? String(friend) : `party-${friend}`;
}

function deviceId() {
  const key = 'ccmv:sync:device-id';
  let value = localStorage.getItem(key);
  if (!value) { value = uuid(); localStorage.setItem(key, value); }
  return value;
}

function mutation(operation, record, baseVersion) {
  const result = {
    mutationId: uuid(), tripId: record.tripId, tripGeneration: record.tripGeneration,
    schemaVersion: record.schemaVersion, domain: DOMAIN, recordId: record.bookingId,
    operation, payload: clone(record), createdAt: new Date().toISOString(),
    createdByPartyId: selectedPartyId(), retryCount: 0, state: 'queued'
  };
  if (operation !== 'create') result.baseVersion = baseVersion;
  return result;
}

async function initialiseStageE() {
  const config = globalThis.TRIP_CONFIG;
  const supabase = globalThis.CCMV_SUPABASE_CONFIG;
  const repository = globalThis.CCMV_BOOKING_REPOSITORY;
  const mode = config?.features?.bookingSyncMode || 'off';
  const enabled = config?.features?.bookingSyncRuntime === true && mode !== 'off';
  const status = { build: config?.buildLabel, mode, enabled, coreLoaded: true, adapterRegistered: false, started: false, error: null };
  try {
    if (!repository) throw new Error('BOOKING_REPOSITORY_UNAVAILABLE');
    const adapter = createBookingSyncAdapter(repository);
    status.adapterRegistered = true;
    if (!enabled) {
      globalThis.CCMV_SYNC_STAGE_E = Object.freeze(status);
      globalThis.dispatchEvent?.(new CustomEvent('ccmv:sync-stage-e-ready', { detail: status }));
      return;
    }
    if (mode !== 'certification' && mode !== 'production') throw new Error('INVALID_BOOKING_SYNC_MODE');
    if (!supabase?.isConfigured?.() || !supabase.tripAccessToken) throw new Error('BOOKING_SYNC_CONFIGURATION_INCOMPLETE');

    const queue = new SyncMutationQueue(new IndexedDbQueueStore({ databaseName: `${config.id}-stage-e-queue` }));
    const firstSync = new IndexedDbFirstSyncStore({ databaseName: `${config.id}-stage-e-first-sync` });
    const provider = new SupabaseSyncProvider({
      url: supabase.url, anonKey: supabase.anonKey, tripId: config.id,
      tripAccessToken: supabase.tripAccessToken, getPartyId: selectedPartyId
    });
    const engine = new TravelSyncEngine({ provider, queue, firstSyncStore: firstSync, deviceId: deviceId() });
    engine.registerDomain(adapter);
    globalThis.CCMV_TRAVEL_SYNC_ENGINE = engine;
    globalThis.CCMV_BOOKING_SYNC_ADAPTER = adapter;

    let snapshot = new Map(repository.getAll({ includeDeleted: true }).map(row => [row.bookingId, clone(row)]));
    await engine.start();
    const generation = await provider.getTripGeneration(config.id);
    const scope = { deviceId: engine.deviceId, tripId: config.id, tripGeneration: generation, domain: DOMAIN };
    if (!await firstSync.isComplete(scope)) {
      const remote = await provider.fetchChanges({ tripId: config.id, domain: DOMAIN });
      const remoteIds = new Set(remote.map(row => row.bookingId));
      for (const local of snapshot.values()) {
        if (!remoteIds.has(local.bookingId) && !local.deletedAt) await engine.enqueueMutation(mutation('create', local));
      }
      await engine.syncNow(DOMAIN);
      await firstSync.markComplete(scope);
      snapshot = new Map(repository.getAll({ includeDeleted: true }).map(row => [row.bookingId, clone(row)]));
    } else {
      await engine.syncNow(DOMAIN);
    }

    let processing = Promise.resolve();
    const unsubscribeRepository = repository.subscribe(rows => {
      processing = processing.then(async () => {
        const next = new Map(repository.getAll({ includeDeleted: true }).map(row => [row.bookingId, clone(row)]));
        for (const [id, record] of next) {
          const previous = snapshot.get(id);
          if (record.mutationId || JSON.stringify(record) === JSON.stringify(previous)) continue;
          const operation = !previous ? 'create' : record.deletedAt && !previous.deletedAt ? 'delete' : 'update';
          const baseVersion = previous ? Number(previous.version) : undefined;
          await engine.enqueueMutation(mutation(operation, record, baseVersion));
        }
        snapshot = next;
        if (navigator.onLine) await engine.syncNow(DOMAIN);
      }).catch(error => { status.error = error?.message || String(error); });
    });
    const reconnect = () => void engine.syncNow(DOMAIN);
    globalThis.addEventListener('online', reconnect);
    status.started = true;
    status.stop = async () => { unsubscribeRepository(); globalThis.removeEventListener('online', reconnect); await engine.stop(); };
  } catch (error) {
    status.error = error?.message || String(error);
    console.error('[CCMV Stage E]', error);
  }
  globalThis.CCMV_SYNC_STAGE_E = Object.freeze(status);
  globalThis.dispatchEvent?.(new CustomEvent('ccmv:sync-stage-e-ready', { detail: status }));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialiseStageE, { once: true });
else void initialiseStageE();
