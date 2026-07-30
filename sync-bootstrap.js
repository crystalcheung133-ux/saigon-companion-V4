/* sync-bootstrap.js — VN Stage E1 Mode A: Admin Write / Party Read. */
import { SupabaseSyncProvider } from './supabase-sync-provider.mjs';

const DOMAIN = 'booking';
const ADMIN_PARTY_ID = 'party-crystal';
const PENDING_KEY = 'ccmv:vn:e1:booking-pending';
const clone = value => structuredClone(value);
const uuid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function selectedPartyId() {
  const key = globalThis.STORAGE_CONFIG?.keys?.friend || 'saigon_friend';
  const friend = globalThis.STORAGE?.local?.get(key, 'crystal') || 'crystal';
  return String(friend).startsWith('party-') ? String(friend) : `party-${friend}`;
}

function isAdmin() {
  return selectedPartyId() === ADMIN_PARTY_ID;
}

function loadPending() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function savePending(set) {
  localStorage.setItem(PENDING_KEY, JSON.stringify([...set]));
}

function createMutation(operation, record, baseVersion) {
  const mutation = {
    mutationId: uuid(),
    tripId: record.tripId,
    tripGeneration: record.tripGeneration,
    schemaVersion: record.schemaVersion,
    domain: DOMAIN,
    recordId: record.bookingId,
    operation,
    payload: clone(record),
    createdAt: new Date().toISOString(),
    createdByPartyId: ADMIN_PARTY_ID,
    retryCount: 0,
    state: 'queued'
  };
  if (operation !== 'create') mutation.baseVersion = Number(baseVersion);
  return mutation;
}

function exposeStatus(status) {
  globalThis.CCMV_BOOKING_SYNC = Object.freeze({
    enabled: true,
    mode: 'admin-write-party-read',
    canWrite: isAdmin(),
    getStatus: () => ({ ...status }),
    syncNow: () => status.syncNow?.()
  });
  globalThis.dispatchEvent?.(
    new CustomEvent('ccmv:booking-sync-status', { detail: { ...status } })
  );
}

async function initialiseBookingSync() {
  const repository = globalThis.CCMV_BOOKING_REPOSITORY;
  const config = globalThis.TRIP_CONFIG;
  const supabase = globalThis.CCMV_SUPABASE;

  // Other pages may include this module without loading Booking Repository.
  if (!repository || !config || !supabase?.isConfigured?.()) return;

  const status = {
    build: config.buildLabel,
    mode: 'admin-write-party-read',
    role: isAdmin() ? 'admin-write' : 'party-read',
    connected: false,
    lastSyncAt: null,
    lastAction: 'starting',
    error: null,
    syncNow: null
  };
  exposeStatus(status);

  const provider = new SupabaseSyncProvider({
    url: supabase.url,
    anonKey: supabase.anonKey,
    tripId: config.id,
    tripAccessToken: supabase.tripAccessToken,
    getPartyId: selectedPartyId
  });

  let applyingRemote = false;
  let stopped = false;
  let chain = Promise.resolve();
  const pending = loadPending();

  async function fetchCanonical() {
    return provider.fetchChanges({ tripId: config.id, domain: DOMAIN });
  }

  function applyCanonical(rows, { preservePending = true } = {}) {
    applyingRemote = true;
    try {
      for (const row of rows) {
        if (preservePending && pending.has(row.bookingId)) continue;
        if (row.deletedAt) repository.applyRemoteDelete(row.bookingId, row);
        else repository.applyRemoteWrite(row);
      }
    } finally {
      applyingRemote = false;
    }
  }

  async function pushRecord(record) {
    if (!isAdmin()) return { skipped: true, reason: 'read-only' };
    if (!navigator.onLine) {
      pending.add(record.bookingId);
      savePending(pending);
      status.lastAction = `offline-pending · ${record.bookingId}`;
      exposeStatus(status);
      return { queuedOffline: true };
    }

    const remoteRows = await fetchCanonical();
    const canonical = remoteRows.find(row => row.bookingId === record.bookingId);
    const operation = !canonical ? 'create' : record.deletedAt ? 'delete' : 'update';
    let response = await provider.pushMutation(
      createMutation(operation, record, canonical?.version)
    );

    // Only one writer is authorised. A race can only come from another
    // Crystal device, so refresh canonical version and retry once.
    if (!response.ok && response.code === 'version_conflict') {
      const retryRows = await fetchCanonical();
      const latest = retryRows.find(row => row.bookingId === record.bookingId);
      response = await provider.pushMutation(
        createMutation(operation, record, latest?.version)
      );
    }

    if (!response.ok) {
      pending.add(record.bookingId);
      savePending(pending);
      throw new Error(response.code || 'BOOKING_ADMIN_SYNC_REJECTED');
    }

    pending.delete(record.bookingId);
    savePending(pending);
    applyingRemote = true;
    try {
      if (response.record?.deletedAt) repository.applyRemoteDelete(record.bookingId, response.record);
      else if (response.record) repository.applyRemoteWrite(response.record);
    } finally {
      applyingRemote = false;
    }
    status.lastAction = `synced-${operation} · ${record.bookingId}`;
    status.lastSyncAt = new Date().toISOString();
    status.error = null;
    exposeStatus(status);
    return response;
  }

  async function retryPending() {
    if (!isAdmin() || !navigator.onLine || !pending.size) return;
    for (const id of [...pending]) {
      const record = repository.getById(id);
      if (!record) {
        pending.delete(id);
        continue;
      }
      await pushRecord(record);
    }
    savePending(pending);
  }

  async function syncNow() {
    try {
      const remote = await fetchCanonical();
      applyCanonical(remote);
      await retryPending();
      status.lastSyncAt = new Date().toISOString();
      status.lastAction = `refreshed · ${remote.length} records`;
      status.error = null;
    } catch (error) {
      status.error = error?.message || String(error);
      status.lastAction = 'sync-failed';
    }
    exposeStatus(status);
    return { ...status };
  }
  status.syncNow = syncNow;

  try {
    await provider.connect();
    status.connected = true;

    // Canonical server rows are authoritative on start. Preserve explicit
    // offline pending edits until they are retried.
    applyCanonical(await fetchCanonical());
    await retryPending();

    const unsubscribeRemote = await provider.subscribe(
      { tripId: config.id, domain: DOMAIN },
      async row => {
        if (stopped || pending.has(row.bookingId)) return;
        applyCanonical([row], { preservePending: false });
        status.lastAction = `remote-update · ${row.bookingId}`;
        status.lastSyncAt = new Date().toISOString();
        exposeStatus(status);
      }
    );

    const unsubscribeRepository = isAdmin()
      ? repository.subscribe(() => {
          if (applyingRemote || stopped) return;
          chain = chain.then(async () => {
            const rows = repository.getAll({ includeDeleted: true });
            // Only records that differ from the latest canonical server row
            // will be pushed.
            const remote = await fetchCanonical();
            const remoteById = new Map(remote.map(row => [row.bookingId, row]));
            for (const record of rows) {
              const canonical = remoteById.get(record.bookingId);
              if (JSON.stringify(record) === JSON.stringify(canonical)) continue;
              await pushRecord(record);
            }
          }).catch(error => {
            status.error = error?.message || String(error);
            status.lastAction = 'admin-write-failed';
            exposeStatus(status);
          });
        })
      : () => {};

    const online = () => void syncNow();
    globalThis.addEventListener('online', online);

    status.lastAction = isAdmin() ? 'ready · Crystal can edit' : 'ready · read only';
    status.lastSyncAt = new Date().toISOString();
    exposeStatus(status);

    globalThis.CCMV_BOOKING_SYNC_STOP = async () => {
      stopped = true;
      unsubscribeRepository?.();
      unsubscribeRemote?.();
      globalThis.removeEventListener('online', online);
      await provider.disconnect();
    };
  } catch (error) {
    status.error = error?.message || String(error);
    status.lastAction = 'start-failed';
    exposeStatus(status);
    console.error('[CCMV Stage E1]', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void initialiseBookingSync(), { once: true });
} else {
  void initialiseBookingSync();
}
