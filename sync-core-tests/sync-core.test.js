import test from 'node:test';
import assert from 'node:assert/strict';
import { TravelSyncEngine, SyncMutationQueue, MemoryQueueStore, SyncTestProvider, validateAdapter } from '../sync-core/index.js';
import { MemoryRepository, makeAdapter, mutation } from './helpers.js';

test('adapter registration rejects missing mandatory repository seam', () => {
  const repository = { getAll() {}, getById() {}, subscribe() {} };
  assert.throws(() => validateAdapter(makeAdapter(repository)), /applyRemoteWrite/);
});

test('sync writes server-authoritative version back through repository', async () => {
  const provider = new SyncTestProvider();
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  const repository = new MemoryRepository();
  const engine = new TravelSyncEngine({ provider, queue });
  engine.registerDomain(makeAdapter(repository));
  await engine.start();
  await queue.enqueue(mutation());
  const result = await engine.syncNow('booking');
  assert.equal(result.booking.pushed, 1);
  assert.equal((await repository.getById('b-1')).version, 1);
  await engine.stop();
});

test('provider failure on one mutation does not block unrelated record', async () => {
  const provider = new SyncTestProvider();
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  const repository = new MemoryRepository();
  const engine = new TravelSyncEngine({ provider, queue });
  engine.registerDomain(makeAdapter(repository));
  await engine.start();
  await queue.enqueue(mutation({ mutationId: 'm1', recordId: 'bad', payload: { id: 'bad', schemaVersion: 1 } }));
  await queue.enqueue(mutation({ mutationId: 'm2', recordId: 'good', payload: { id: 'good', schemaVersion: 1 } }));
  provider.failNextPush('bad');
  const result = await engine.syncNow('booking');
  assert.equal(result.booking.pushed, 1);
  assert.equal(result.booking.failed, 1);
  assert.equal((await repository.getById('good')).version, 1);
  await engine.stop();
});

test('remote conflict is recorded and can be resolved using remote', async () => {
  const provider = new SyncTestProvider();
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  const repository = new MemoryRepository([{ id: 'b-1', version: 1, tripGeneration: 1 }]);
  const engine = new TravelSyncEngine({ provider, queue });
  engine.registerDomain(makeAdapter(repository));
  await engine.start();
  await queue.enqueue(mutation({ operation: 'update', baseVersion: 1, payload: { id: 'b-1', title: 'local', schemaVersion: 1 } }));
  provider.emit({ tripId: 'trip-test', domain: 'booking', recordId: 'b-1', version: 2, tripGeneration: 1, schemaVersion: 1, title: 'remote' });
  await new Promise(resolve => setTimeout(resolve, 0));
  const [conflict] = engine.listConflicts('booking');
  assert.ok(conflict);
  await engine.resolveConflict(conflict.conflictId, { strategy: 'use-remote' });
  assert.equal((await repository.getById('b-1')).title, 'remote');
  assert.equal(engine.listConflicts('booking').length, 0);
  await engine.stop();
});

test('future schema pauses only affected domain', async () => {
  const provider = new SyncTestProvider();
  const bookingRepo = new MemoryRepository();
  const expenseRepo = new MemoryRepository();
  const engine = new TravelSyncEngine({ provider });
  engine.registerDomain(makeAdapter(bookingRepo, { domain: 'booking', schemaVersion: 1 }));
  engine.registerDomain(makeAdapter(expenseRepo, { domain: 'expense', schemaVersion: 1 }));
  await engine.start();
  provider.emit({ tripId: 'trip-test', domain: 'booking', recordId: 'b', version: 1, tripGeneration: 1, schemaVersion: 2 });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(engine.getState('booking').pausedReason, 'future-schema');
  assert.equal(engine.getState('expense').pausedReason, null);
  await engine.stop();
});
