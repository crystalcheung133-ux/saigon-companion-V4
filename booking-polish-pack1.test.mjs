import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('./bookings-runtime.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./styles.css',import.meta.url),'utf8');

test('updated-by metadata is removed from card markup',()=>{
  assert.doesNotMatch(runtime,/Updated by/);
  assert.match(css,/\.booking-updated\{display:none!important\}/);
});

test('optional blank Booking fields are omitted',()=>{
  assert.match(runtime,/optional=false/);
  assert.match(runtime,/b\.depositPaid\?readonlyField/);
  assert.match(runtime,/readonlyField\('Notes',b\.notes,true,false,true\)/);
});

test('read-only copy is minimal',()=>{
  assert.match(runtime,/>Read only</);
  assert.doesNotMatch(runtime,/Read only · Crystal/);
});

test('dirty check and save feedback are implemented',()=>{
  assert.match(runtime,/function editableSnapshot/);
  assert.match(runtime,/No changes/);
  assert.match(runtime,/Saving…/);
  assert.match(runtime,/✓ Saved/);
});

test('save remains in the same edit form',()=>{
  assert.doesNotMatch(runtime,/render\(\);openBookingEditor\(id\)/);
  assert.match(runtime,/form\.dataset\.initialSnapshot=editableSnapshot\(form\)/);
});

test('sorting does not depend on update timestamp',()=>{
  assert.match(runtime,/function sortRows/);
  assert.doesNotMatch(runtime,/updatedAt.*sort|sort.*updatedAt/);
});
