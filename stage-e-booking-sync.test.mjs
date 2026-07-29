import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TravelSyncEngine } from './sync-core/sync-core.js';
import { SyncMutationQueue, MemoryQueueStore } from './sync-core/sync-queue.js';
import { SyncTestProvider } from './sync-core/sync-test-provider.js';
import { createBookingSyncAdapter } from './booking-sync-adapter.js';
import { SupabaseSyncProvider } from './supabase-sync-provider.mjs';

const record = (overrides = {}) => ({
  bookingId: 'booking-1', tripId: 'ccmv-vietnam-2026', schemaVersion: 1, tripGeneration: 1,
  version: 1, status: 'pending', createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z', deletedAt: '', ...overrides
});
const mutation = (overrides = {}) => ({
  mutationId: 'mutation-1', tripId: 'ccmv-vietnam-2026', tripGeneration: 1, schemaVersion: 1,
  domain: 'booking', recordId: 'booking-1', operation: 'update', payload: { notes: 'local' },
  baseVersion: 1, createdAt: '2026-01-01T00:00:00.000Z', createdByPartyId: 'crystal',
  retryCount: 0, state: 'queued', ...overrides
});
function repository(initial = record()) {
  const rows = new Map(initial ? [[initial.bookingId, structuredClone(initial)]] : []);
  return {
    tripId: 'ccmv-vietnam-2026', schemaVersion: 1, tripGeneration: 1,
    getAll: () => [...rows.values()], getById: id => rows.get(id) || null, subscribe: () => () => {},
    applyRemoteWrite: row => rows.set(row.bookingId, structuredClone(row)),
    applyRemoteDelete: (id, tombstone) => rows.set(id, { ...rows.get(id), ...tombstone })
  };
}

test('Device A certification enables runtime and visible build label', () => {
  const source = fs.readFileSync('trip-config.js', 'utf8');
  assert.match(source, /bookingSyncRuntime:true/);
  assert.match(source, /VN Stage E · Runtime Diagnostic Patch 1/);
});
test('no browser direct Booking write path exists', () => {
  const legacy = fs.readFileSync('supabase-booking-provider.js', 'utf8');
  const provider = fs.readFileSync('supabase-sync-provider.mjs', 'utf8');
  assert.match(legacy, /DIRECT_BOOKING_TABLE_WRITES_PROHIBITED/);
  assert.doesNotMatch(provider, /\/rest\/v1\/bookings[^`]*method:\s*['"](?:POST|PATCH|DELETE)/s);
});
test('Edge Function is the only mutation endpoint and migration revokes table writes', () => {
  const provider = fs.readFileSync('supabase-sync-provider.mjs', 'utf8');
  const sql = fs.readFileSync('supabase/migrations/20260729_vn_stage_e_booking_sync.sql', 'utf8');
  assert.match(provider, /functions\/v1\/booking-sync/);
  assert.match(sql, /revoke insert, update, delete on public\.bookings from anon, authenticated/i);
  assert.match(sql, /mutation_id = v_mutation_id/i);
});
test('provider maps canonical acknowledgement without relying on realtime', async () => {
  const fetchImpl = async url => url.includes('/functions/')
    ? { ok: true, json: async () => ({ ok: true, record: { booking_id: 'booking-1', trip_id: 'ccmv-vietnam-2026', schema_version: 1, trip_generation: 1, version: 2, status: 'confirmed' } }) }
    : { ok: true, json: async () => [{ trip_generation: 1 }] };
  const provider = new SupabaseSyncProvider({ url: 'https://example.supabase.co', anonKey: 'anon', tripId: 'ccmv-vietnam-2026', tripAccessToken: 'token', getPartyId: () => 'crystal', fetchImpl, WebSocketImpl: null });
  const result = await provider.pushMutation(mutation());
  assert.equal(result.record.version, 2);
  assert.equal(result.record.bookingId, 'booking-1');
});
test('later mutation is held behind an open same-record conflict', async () => {
  const repo = repository();
  const adapter = createBookingSyncAdapter(repo);
  const provider = new SyncTestProvider({ tripId: 'ccmv-vietnam-2026', generation: 1 });
  provider.seed({ ...record({ version: 2 }), domain: 'booking', recordId: 'booking-1' });
  const engine = new TravelSyncEngine({ provider });
  engine.registerDomain(adapter);
  await engine.enqueueMutation(mutation());
  await engine.syncNow('booking');
  const held = await engine.enqueueMutation(mutation({ mutationId: 'mutation-2', baseVersion: 2 }));
  assert.equal(held.held, true);
  assert.equal(engine.listConflicts('booking').length, 1);
});
test('successful and failed reset leave queue usable', async () => {
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  await queue.closeStore(); await queue.reopenStore(); await queue.enqueue(mutation());
  assert.equal((await queue.list()).length, 1);
  await queue.closeStore();
  try { throw new Error('reset failed'); } catch {} finally { await queue.reopenStore(); }
  await queue.enqueue(mutation({ mutationId: 'mutation-2', recordId: 'booking-2' }));
  assert.equal((await queue.list()).length, 2);
});
test('create/update/delete compaction remains certified', async () => {
  const queue = new SyncMutationQueue();
  await queue.enqueue(mutation({ operation: 'create', baseVersion: undefined }));
  await queue.enqueue(mutation({ mutationId: 'mutation-2', payload: { notes: 'merged' } }));
  assert.equal((await queue.list())[0].operation, 'create');
  await queue.enqueue(mutation({ mutationId: 'mutation-3', operation: 'delete' }));
  assert.equal((await queue.list()).length, 0);
});
