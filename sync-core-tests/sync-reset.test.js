import test from 'node:test';
import assert from 'node:assert/strict';
import { TravelSyncEngine, SyncTestProvider, SyncMutationQueue, MemoryQueueStore } from '../sync-core/index.js';
import { MemoryRepository, makeAdapter, mutation } from './helpers.js';

test('reset bumps generation, notifies adapter, and queue remains usable', async () => {
  const provider = new SyncTestProvider();
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  const repository = new MemoryRepository();
  let event = null;
  const adapter = { ...makeAdapter(repository), onGenerationBump: value => { event = value; } };
  const engine = new TravelSyncEngine({ provider, queue });
  engine.registerDomain(adapter);
  await engine.start();
  const plan = await engine.prepareGenerationReset({ tripId: 'trip-test', requestedByPartyId: 'p' });
  const generation = await engine.commitGenerationReset(plan);
  assert.equal(generation, 2);
  assert.equal(event.currentGeneration, 2);
  await queue.enqueue(mutation({ mutationId: 'after-reset', tripGeneration: 2 }));
  assert.equal((await queue.list()).length, 1);
  await engine.stop();
});

test('reset failure reopens queue and resumes dispatch', async () => {
  const provider = new SyncTestProvider();
  provider.bumpTripGeneration = async () => { throw new Error('reset failed'); };
  const queue = new SyncMutationQueue(new MemoryQueueStore());
  const engine = new TravelSyncEngine({ provider, queue });
  engine.registerDomain(makeAdapter(new MemoryRepository()));
  await engine.start();
  const plan = await engine.prepareGenerationReset({ tripId: 'trip-test', requestedByPartyId: 'p' });
  await assert.rejects(() => engine.commitGenerationReset(plan), /reset failed/);
  assert.equal(queue.dispatchPaused, false);
  await queue.enqueue(mutation({ mutationId: 'after-failed-reset' }));
  assert.equal((await queue.list()).length, 1);
  await engine.stop();
});
