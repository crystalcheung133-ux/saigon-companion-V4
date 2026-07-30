import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('./bookings-runtime.js',import.meta.url),'utf8');
const sync=fs.readFileSync(new URL('./simple-booking-sync.js',import.meta.url),'utf8');
const admin=fs.readFileSync(new URL('./admin.js',import.meta.url),'utf8');

test('Booking edit requires Crystal and active Studio mode',()=>{
  assert.match(runtime,/user\(\)==='crystal'&&root\.VN_ADMIN\?\.readMode\?\.\(\)===true/);
  assert.match(runtime,/Enter Trip Studio as Crystal to edit bookings/);
});

test('Every Booking view uses the shared edit permission',()=>{
  assert.match(runtime,/canEditBookings\(\)\?`<button class="btn booking-edit-btn"/);
});

test('Supabase writes use the same Studio permission',()=>{
  assert.match(sync,/currentFriend\(\)==='crystal'&&root\.VN_ADMIN\?\.readMode\?\.\(\)===true/);
  assert.match(sync,/BOOKING_STUDIO_REQUIRED/);
});

test('Studio changes notify Booking UI immediately',()=>{
  assert.match(admin,/ccmv:studio-mode-changed/);
  assert.match(runtime,/addEventListener\('ccmv:studio-mode-changed'/);
});
