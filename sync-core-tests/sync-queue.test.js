import test from 'node:test';
import assert from 'node:assert/strict';
import { SyncMutationQueue, MemoryQueueStore } from '../sync-core/index.js';
import { mutation } from './helpers.js';

test('update/delete require baseVersion', async () => {
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  await assert.rejects(() => queue.enqueue(mutation({ operation: 'update' })), /baseVersion/);
  await assert.rejects(() => queue.enqueue(mutation({ operation: 'delete' })), /baseVersion/);
});

test('create followed by update compacts into one create with merged payload', async () => {
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  await queue.enqueue(mutation({ mutationId: 'c', payload: { id: 'b-1', title: 'A' } }));
  await queue.enqueue(mutation({ mutationId: 'u', operation: 'update', baseVersion: 0, payload: { notes: 'B' } }));
  const rows = await queue.list();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].operation, 'create');
  assert.deepEqual(rows[0].payload, { id: 'b-1', title: 'A', notes: 'B' });
});

test('create followed by delete cancels unsent record', async () => {
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  await queue.enqueue(mutation({ mutationId: 'c' }));
  await queue.enqueue(mutation({ mutationId: 'd', operation: 'delete', baseVersion: 0 }));
  assert.equal((await queue.list()).length, 0);
});

test('update followed by delete preserves original baseVersion', async () => {
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  await queue.enqueue(mutation({ mutationId: 'u', operation: 'update', baseVersion: 3 }));
  await queue.enqueue(mutation({ mutationId: 'd', operation: 'delete', baseVersion: 4 }));
  const [row] = await queue.list();
  assert.equal(row.operation, 'delete');
  assert.equal(row.baseVersion, 3);
});

test('queue store can close and reopen without permanently disabling enqueue', async () => {
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  await queue.closeStore();
  await queue.reopenStore();
  await queue.enqueue(mutation());
  assert.equal((await queue.list()).length, 1);
});
