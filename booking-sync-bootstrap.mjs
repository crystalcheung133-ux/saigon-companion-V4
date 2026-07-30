/* booking-sync-bootstrap.mjs - Stage D registration only. Sync start remains feature-flagged OFF. */
import { TravelSyncEngine } from './sync-core/sync-core.js';
import { createBookingSyncAdapter } from './booking-sync-adapter.mjs';

class DisabledSyncProvider {
  async connect() { throw new Error('BOOKING_SYNC_DISABLED'); }
  async disconnect() {}
  async fetchChanges() { return []; }
  async pushMutation() { return { ok: false, code: 'sync-disabled' }; }
  async subscribe() { return () => {}; }
  async getTripGeneration() { return Number(globalThis.TRIP_CONFIG?.tripGeneration || 1); }
  async ping() { return false; }
}

function initialise() {
  const repository = globalThis.CCMV_BOOKING_REPOSITORY;
  const tripConfig = globalThis.TRIP_CONFIG;
  if (!repository || !tripConfig) throw new Error('BOOKING_STAGE_D_DEPENDENCY_MISSING');

  const adapter = createBookingSyncAdapter({ repository, tripConfig });
  const engine = new TravelSyncEngine({ provider: new DisabledSyncProvider(), deviceId: 'vn-stage-d-local' });
  engine.registerDomain(adapter);

  const enabled = Boolean(tripConfig.features?.bookingSyncRuntime);
  const status = Object.freeze({
    stage: 'VN Stage D',
    buildLabel: tripConfig.buildLabel,
    adapterRegistered: true,
    runtimeEnabled: enabled,
    provider: 'disabled',
    mode: 'local-only',
    domain: adapter.domain,
    tripId: adapter.tripId,
    schemaVersion: adapter.schemaVersion
  });

  globalThis.CCMV_BOOKING_SYNC_ADAPTER = adapter;
  globalThis.CCMV_TRAVEL_SYNC_ENGINE = engine;
  globalThis.CCMV_BOOKING_SYNC_STAGE_D = status;
  globalThis.dispatchEvent(new CustomEvent('ccmv:booking-adapter-ready', { detail: status }));
  return status;
}

try { initialise(); }
catch (error) {
  globalThis.CCMV_BOOKING_SYNC_STAGE_D = Object.freeze({
    stage: 'VN Stage D', adapterRegistered: false, runtimeEnabled: false,
    provider: 'disabled', mode: 'local-only', error: error?.message || 'initialisation-failed'
  });
  console.error('[CCMV Stage D] Booking adapter registration failed', error);
}
