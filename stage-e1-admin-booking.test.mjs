import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime = fs.readFileSync(new URL('./bookings-runtime.js', import.meta.url), 'utf8');
const bootstrap = fs.readFileSync(new URL('./sync-bootstrap.js', import.meta.url), 'utf8');
const trip = fs.readFileSync(new URL('./trip-config.js', import.meta.url), 'utf8');
const edge = fs.readFileSync(new URL('./supabase/functions/booking-sync/index.ts', import.meta.url), 'utf8');

test('only Crystal is exposed as Booking writer', () => {
  assert.match(runtime, /function canEditBookings\(\)\{return user\(\)==='crystal';\}/);
  assert.match(runtime, /BOOKING_ADMIN_ONLY/);
  assert.match(trip, /bookingSyncMode:'admin-write-party-read'/);
});

test('non-admin UI is read only', () => {
  assert.match(runtime, /Read only · Send booking updates to Crystal by WhatsApp/);
});

test('Mode A bootstrap does not use collaborative conflict core', () => {
  assert.doesNotMatch(bootstrap, /TravelSyncEngine|SyncMutationQueue|resolveConflict|listConflicts/);
  assert.match(bootstrap, /ADMIN_PARTY_ID = 'party-crystal'/);
  assert.match(bootstrap, /retry once/);
});

test('server write boundary only accepts Crystal', () => {
  assert.match(edge, /new Set\(\['party-crystal'\]\)/);
});
