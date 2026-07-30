/* sync-bootstrap.js - VN Stage E Booking Sync Certification. Safe default: OFF. */
import { TravelSyncEngine } from './sync-core/index.js';
import { SyncMutationQueue } from './sync-core/sync-queue.js';
import { IndexedDbQueueStore, IndexedDbFirstSyncStore } from './sync-core/sync-indexeddb-store.js';
import { createBookingSyncAdapter } from './booking-sync-adapter.js';
import { SupabaseSyncProvider } from './supabase-sync-provider.mjs';

const DOMAIN = 'booking';
const uuid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const clone = value => structuredClone(value);

function maskValue(value, visible = 4) {
  const text = String(value || '');
  if (!text) return '(empty)';
  if (text.length <= visible * 2) return `${text.slice(0, 1)}…${text.slice(-1)}`;
  return `${text.slice(0, visible)}…${text.slice(-visible)}`;
}

function configurationChecks(config, supabase, repository, mode, enabled) {
  const checks = {
    tripConfigPresent: Boolean(config),
    tripIdPresent: Boolean(config?.id),
    bookingSyncRuntime: config?.features?.bookingSyncRuntime === true,
    bookingSyncMode: mode,
    modeAllowed: mode === 'certification' || mode === 'production',
    runtimeEnabled: enabled,
    repositoryPresent: Boolean(repository),
    supabaseConfigPresent: Boolean(supabase),
    supabaseEnabled: supabase?.enabled === true,
    supabaseUrlPresent: Boolean(supabase?.url),
    supabaseUrlValid: /^https:\/\/.+\.supabase\.co$/i.test(String(supabase?.url || '')),
    anonKeyPresent: Boolean(supabase?.anonKey),
    tripAccessTokenPresent: Boolean(supabase?.tripAccessToken),
    isConfiguredFunctionPresent: typeof supabase?.isConfigured === 'function',
    isConfiguredResult: Boolean(supabase?.isConfigured?.())
  };

  checks.complete = Boolean(
    checks.tripConfigPresent &&
    checks.tripIdPresent &&
    checks.bookingSyncRuntime &&
    checks.modeAllowed &&
    checks.runtimeEnabled &&
    checks.repositoryPresent &&
    checks.supabaseConfigPresent &&
    checks.supabaseEnabled &&
    checks.supabaseUrlPresent &&
    checks.supabaseUrlValid &&
    checks.anonKeyPresent &&
    checks.tripAccessTokenPresent &&
    checks.isConfiguredFunctionPresent &&
    checks.isConfiguredResult
  );

  return {
    checks,
    safeValues: {
      tripId: String(config?.id || '(missing)'),
      mode: String(mode || '(missing)'),
      supabaseUrl: String(supabase?.url || '(empty)'),
      anonKey: maskValue(supabase?.anonKey),
      tripAccessToken: maskValue(supabase?.tripAccessToken)
    }
  };
}

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



function serialiseError(error) {
  const cause = error?.cause;
  return {
    name: error?.name || 'Error',
    message: error?.message || String(error),
    stack: error?.stack || '(no stack)',
    fileName: error?.fileName || error?.sourceURL || '(unknown)',
    lineNumber: error?.lineNumber || error?.line || '(unknown)',
    columnNumber: error?.columnNumber || error?.column || '(unknown)',
    cause: cause
      ? {
          name: cause?.name || typeof cause,
          message: cause?.message || String(cause),
          stack: cause?.stack || '(no stack)'
        }
      : null
  };
}

function applyDetailedError(status, error, action) {
  const detail = serialiseError(error);
  status.error = `${detail.name}: ${detail.message}`;
  status.errorName = detail.name;
  status.errorMessage = detail.message;
  status.errorStack = detail.stack;
  status.errorFile = detail.fileName;
  status.errorLine = detail.lineNumber;
  status.errorColumn = detail.columnNumber;
  status.errorCause = detail.cause;
  status.lastAction = action;
}

function diagnosticText(status) {
  return [
    `Build: ${status.build || 'unknown'}`,
    `Mode: ${status.mode || 'off'} · Enabled: ${status.enabled ? 'yes' : 'no'}`,
    `Repository: ${status.adapterRegistered ? 'ready' : 'not ready'} · Records: ${status.repositoryCount ?? '-'}`,
    `Provider: ${status.providerConnected ? 'connected' : status.providerConfigured ? 'configured' : 'not configured'}`,
    `Started: ${status.started ? 'yes' : 'no'} · First sync: ${status.firstSyncComplete === true ? 'complete' : status.firstSyncComplete === false ? 'pending' : '-'}`,
    `Queue: pending ${status.pendingCount || 0} · failed ${status.failedCount || 0} · conflicts ${status.conflictCount || 0}`,
    `Last action: ${status.lastAction || '-'}`,
    '',
    'Configuration:',
    `- trip config: ${status.configChecks?.tripConfigPresent ? 'yes' : 'NO'}`,
    `- trip ID: ${status.configChecks?.tripIdPresent ? 'yes' : 'NO'} · ${status.configSafeValues?.tripId || '-'}`,
    `- runtime flag: ${status.configChecks?.bookingSyncRuntime ? 'true' : 'FALSE'}`,
    `- mode: ${status.configChecks?.bookingSyncMode || '-'} · allowed ${status.configChecks?.modeAllowed ? 'yes' : 'NO'}`,
    `- repository: ${status.configChecks?.repositoryPresent ? 'yes' : 'NO'}`,
    `- Supabase config object: ${status.configChecks?.supabaseConfigPresent ? 'yes' : 'NO'}`,
    `- Supabase enabled: ${status.configChecks?.supabaseEnabled ? 'true' : 'FALSE'}`,
    `- Supabase URL: ${status.configChecks?.supabaseUrlPresent ? 'present' : 'MISSING'} · valid ${status.configChecks?.supabaseUrlValid ? 'yes' : 'NO'}`,
    `- anon key: ${status.configChecks?.anonKeyPresent ? 'present' : 'MISSING'} · ${status.configSafeValues?.anonKey || '-'}`,
    `- trip token: ${status.configChecks?.tripAccessTokenPresent ? 'present' : 'MISSING'} · ${status.configSafeValues?.tripAccessToken || '-'}`,
    `- isConfigured(): ${status.configChecks?.isConfiguredResult ? 'true' : 'FALSE'}`,
    `- complete: ${status.configChecks?.complete ? 'YES' : 'NO'}`,
    '',
    'Error detail:',
    `- name: ${status.errorName || 'none'}`,
    `- message: ${status.errorMessage || status.error || 'none'}`,
    `- file: ${status.errorFile || '-'}`,
    `- line: ${status.errorLine || '-'} · column: ${status.errorColumn || '-'}`,
    `- cause: ${status.errorCause ? JSON.stringify(status.errorCause) : 'none'}`,
    `- stack: ${status.errorStack || 'none'}`
  ].join('\n');
}

function renderDiagnosticPanel(status) {
  if (status.mode !== 'certification') return;
  let panel = document.getElementById('ccmvStageEDiagnostic');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'ccmvStageEDiagnostic';
    panel.setAttribute('aria-live', 'polite');
    panel.style.cssText = 'position:fixed;right:12px;bottom:92px;z-index:10050;width:min(360px,calc(100vw - 24px));max-height:45vh;overflow:auto;background:#fffdf8;border:1px solid rgba(80,55,35,.22);border-radius:16px;box-shadow:0 12px 32px rgba(42,28,18,.22);padding:12px;font:600 12px/1.45 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#2f241d;';
    panel.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><strong>Stage E Sync Diagnostic</strong><button type="button" id="ccmvSyncDiagClose" style="border:0;background:transparent;font-size:20px;line-height:1;cursor:pointer">×</button></div><pre id="ccmvSyncDiagText" style="white-space:pre-wrap;margin:8px 0 10px;font:600 11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace"></pre><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="ccmvSyncTestConnection" style="border:1px solid #7a5135;border-radius:999px;background:#fff;padding:7px 11px;font-weight:700;cursor:pointer">Test Connection</button><button type="button" id="ccmvSyncNowButton" style="border:1px solid #7a5135;border-radius:999px;background:#513523;color:white;padding:7px 11px;font-weight:700;cursor:pointer">Sync Now</button></div>';
    document.body.appendChild(panel);
    panel.querySelector('#ccmvSyncDiagClose')?.addEventListener('click', () => panel.remove());
    panel.querySelector('#ccmvSyncTestConnection')?.addEventListener('click', async () => {
      const live = globalThis.CCMV_SYNC_DIAGNOSTICS;
      if (!live?.testConnection) return;
      await live.testConnection();
    });
    panel.querySelector('#ccmvSyncNowButton')?.addEventListener('click', async () => {
      const live = globalThis.CCMV_SYNC_DIAGNOSTICS;
      if (!live?.syncNow) return;
      await live.syncNow();
    });
  }
  const text = panel.querySelector('#ccmvSyncDiagText');
  if (text) text.textContent = diagnosticText(status);
}

function installGlobalErrorDiagnostics(status, publish) {
  globalThis.addEventListener?.('error', event => {
    if (!status.error) {
      applyDetailedError(
        status,
        event?.error || new Error(event?.message || 'window-error'),
        'window-error'
      );
    }
    publish();
  });
  globalThis.addEventListener?.('unhandledrejection', event => {
    applyDetailedError(
      status,
      event?.reason instanceof Error
        ? event.reason
        : new Error(String(event?.reason || 'unhandled-rejection')),
      'unhandled-rejection'
    );
    publish();
  });
}

export async function initialiseStageE() {
  if (globalThis.CCMV_STAGE_E_INITIALISE_PROMISE) {
    return globalThis.CCMV_STAGE_E_INITIALISE_PROMISE;
  }
  const run = initialiseStageEInternal();
  globalThis.CCMV_STAGE_E_INITIALISE_PROMISE = run;
  return run;
}

async function initialiseStageEInternal() {
  const config = globalThis.TRIP_CONFIG;
  const supabase = globalThis.CCMV_SUPABASE_CONFIG;
  const repository = globalThis.CCMV_BOOKING_REPOSITORY;
  const mode = config?.features?.bookingSyncMode || 'off';
  const enabled = config?.features?.bookingSyncRuntime === true && mode !== 'off';
  const configDiagnostic = configurationChecks(config, supabase, repository, mode, enabled);
  const status = {
    build: config?.buildLabel,
    mode,
    enabled,
    coreLoaded: true,
    adapterRegistered: false,
    providerConfigured: false,
    providerConnected: false,
    repositoryCount: 0,
    firstSyncComplete: null,
    pendingCount: 0,
    failedCount: 0,
    conflictCount: 0,
    started: false,
    lastAction: 'bootstrap',
    error: null,
    errorName: null,
    errorMessage: null,
    errorStack: null,
    errorFile: null,
    errorLine: null,
    errorColumn: null,
    errorCause: null,
    configChecks: configDiagnostic.checks,
    configSafeValues: configDiagnostic.safeValues
  };
  const publish = () => { globalThis.CCMV_SYNC_STAGE_E = Object.freeze({ ...status }); globalThis.dispatchEvent?.(new CustomEvent('ccmv:sync-stage-e-status', { detail: { ...status } })); renderDiagnosticPanel(status); };
  installGlobalErrorDiagnostics(status, publish);
  publish();
  try {
    if (!repository) throw new Error('BOOKING_REPOSITORY_UNAVAILABLE');
    const adapter = createBookingSyncAdapter(repository);
    status.adapterRegistered = true;
    status.repositoryCount = repository.getAll({ includeDeleted: true }).length;
    status.lastAction = 'adapter-registered';
    publish();
    if (!enabled) {
      status.repositoryCount = repository.getAll({ includeDeleted: true }).length; status.lastAction = 'disabled'; publish(); return;
    }
    if (mode !== 'certification' && mode !== 'production') throw new Error('INVALID_BOOKING_SYNC_MODE');
    if (!status.configChecks.complete) {
      const missing = Object.entries(status.configChecks)
        .filter(([key, value]) => key !== 'complete' && (value === false || value === null || value === undefined || value === ''))
        .map(([key]) => key);
      throw new Error(`BOOKING_SYNC_CONFIGURATION_INCOMPLETE: ${missing.join(', ') || 'unknown'}`);
    }
    status.providerConfigured = true; status.lastAction = 'provider-configured'; publish();

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
    const unsubscribeState = engine.subscribe(snapshot => { const domainState = snapshot?.booking || snapshot || {}; status.pendingCount = Number(domainState.pendingCount || 0); status.failedCount = Number(domainState.failedCount || 0); status.conflictCount = Number(domainState.conflictCount || 0); if (domainState.lastError) status.error = domainState.lastError; publish(); });
    globalThis.CCMV_SYNC_DIAGNOSTICS = {
      getStatus: () => ({ ...status }),
      async testConnection() {
        try {
          status.lastAction = 'test-connection';
          status.error = null;
          status.errorName = null;
          status.errorMessage = null;
          status.errorStack = null;
          publish();
          await provider.ping();
          const generation = await provider.getTripGeneration(config.id);
          const rows = await provider.fetchChanges({ tripId: config.id, domain: DOMAIN });
          status.providerConnected = true;
          status.lastAction = `connection-ok · generation ${generation} · remote ${rows.length}`;
        } catch (error) {
          status.providerConnected = false;
          applyDetailedError(status, error, 'connection-failed');
          console.error('[CCMV Stage E testConnection]', error);
        }
        publish();
        return { ...status };
      },
      async syncNow() {
        try {
          status.lastAction = 'manual-sync';
          status.error = null;
          status.errorName = null;
          status.errorMessage = null;
          status.errorStack = null;
          publish();
          const result = await engine.syncNow(DOMAIN);
          status.lastAction = `manual-sync-complete ${JSON.stringify(result)}`;
        } catch (error) {
          applyDetailedError(status, error, 'manual-sync-failed');
          console.error('[CCMV Stage E syncNow]', error);
        }
        publish();
        return { ...status };
      }
    };

    let snapshot = new Map(repository.getAll({ includeDeleted: true }).map(row => [row.bookingId, clone(row)]));
    status.lastAction = 'engine-starting'; publish();
    await engine.start();
    status.providerConnected = true; status.lastAction = 'engine-started'; publish();
    const generation = await provider.getTripGeneration(config.id);
    const scope = { deviceId: engine.deviceId, tripId: config.id, tripGeneration: generation, domain: DOMAIN };
    status.firstSyncComplete = await firstSync.isComplete(scope); status.lastAction = 'first-sync-checked'; publish();
    if (!status.firstSyncComplete) {
      const remote = await provider.fetchChanges({ tripId: config.id, domain: DOMAIN });
      const remoteIds = new Set(remote.map(row => row.bookingId));
      for (const local of snapshot.values()) {
        if (!remoteIds.has(local.bookingId) && !local.deletedAt) await engine.enqueueMutation(mutation('create', local));
      }
      await engine.syncNow(DOMAIN);
      await firstSync.markComplete(scope); status.firstSyncComplete = true; status.lastAction = 'first-sync-complete'; publish();
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
          if (JSON.stringify(record) === JSON.stringify(previous)) continue;

          // A changed mutationId means the repository is applying a newly
          // acknowledged/remote canonical row. Skip that echo once.
          // If the mutationId is unchanged but other fields changed, this is
          // a genuine local edit and must be queued.
          const isRemoteEcho = Boolean(
            previous &&
            record.mutationId &&
            record.mutationId !== previous.mutationId
          );
          if (isRemoteEcho) continue;

          const operation = !previous ? 'create' : record.deletedAt && !previous.deletedAt ? 'delete' : 'update';
          const baseVersion = previous ? Number(previous.version) : undefined;
          await engine.enqueueMutation(mutation(operation, record, baseVersion));
          status.lastAction = `queued-${operation} · ${record.bookingId}`;
          publish();
        }
        snapshot = next;
        if (navigator.onLine) await engine.syncNow(DOMAIN);
      }).catch(error => {
        applyDetailedError(status, error, 'repository-sync-failed');
        console.error('[CCMV Stage E repository sync]', error);
        publish();
      });
    });
    const reconnect = () => void engine.syncNow(DOMAIN);
    globalThis.addEventListener('online', reconnect);
    status.started = true; status.lastAction = 'ready'; publish();
    status.stop = async () => { unsubscribeRepository(); unsubscribeState?.(); globalThis.removeEventListener('online', reconnect); await engine.stop(); };
  } catch (error) {
    applyDetailedError(status, error, 'bootstrap-failed');
    publish();
    console.error('[CCMV Stage E bootstrap]', error);
    console.trace('[CCMV Stage E bootstrap trace]');
  }
  publish();
  globalThis.dispatchEvent?.(new CustomEvent('ccmv:sync-stage-e-ready', { detail: { ...status } }));
}

globalThis.CCMV_STAGE_E_BOOTSTRAP_MODULE_LOADED = true;

if (globalThis.CCMV_STAGE_E_DIAGNOSTIC_ONLY !== true) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => void initialiseStageE(), { once: true });
  } else {
    void initialiseStageE();
  }
}
