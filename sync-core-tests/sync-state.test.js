import test from 'node:test';
import assert from 'node:assert/strict';
import { SyncStateStore } from '../sync-core/index.js';

test('snapshot is immutable from caller perspective', () => {
  const store = new SyncStateStore();
  store.update('booking', { pendingCount: 2 });
  const snapshot = store.snapshot('booking');
  snapshot.pendingCount = 99;
  assert.equal(store.snapshot('booking').pendingCount, 2);
});

test('throwing subscriber does not block other subscribers', () => {
  const store = new SyncStateStore();
  let received = 0;
  store.subscribe(() => { throw new Error('listener failed'); });
  store.subscribe(() => { received += 1; });
  store.update('booking', { pendingCount: 1 });
  assert.ok(received >= 2);
});
