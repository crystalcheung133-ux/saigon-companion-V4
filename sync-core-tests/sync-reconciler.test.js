import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileRecord } from '../sync-core/index.js';
import { MemoryRepository, makeAdapter } from './helpers.js';
const adapter = makeAdapter(new MemoryRepository());

test('rejects wrong tripId', () => {
  const result = reconcileRecord({ localRecord: null, remoteRecord: { tripId: 'wrong', recordId: 'b', version: 1, tripGeneration: 1, schemaVersion: 1 }, pendingMutation: null, adapter, currentGeneration: 1 });
  assert.deepEqual(result, { action: 'reject', reason: 'wrong-trip' });
});

test('future schema pauses domain', () => {
  const result = reconcileRecord({ localRecord: null, remoteRecord: { tripId: 'trip-test', recordId: 'b', version: 1, tripGeneration: 1, schemaVersion: 2 }, pendingMutation: null, adapter, currentGeneration: 1 });
  assert.equal(result.action, 'pause');
  assert.equal(result.reason, 'future-schema');
});

test('remote newer applies with no pending local mutation', () => {
  assert.equal(reconcileRecord({ localRecord: { id: 'b', version: 1, tripGeneration: 1 }, remoteRecord: { tripId: 'trip-test', recordId: 'b', version: 2, tripGeneration: 1, schemaVersion: 1 }, pendingMutation: null, adapter, currentGeneration: 1 }).action, 'apply-remote');
});

test('remote newer than pending base creates conflict', () => {
  assert.equal(reconcileRecord({ localRecord: { id: 'b', version: 1, tripGeneration: 1 }, remoteRecord: { tripId: 'trip-test', recordId: 'b', version: 2, tripGeneration: 1, schemaVersion: 1 }, pendingMutation: { mutationId: 'm', operation: 'update', baseVersion: 1 }, adapter, currentGeneration: 1 }).action, 'conflict');
});

test('same mutation realtime echo is acknowledged, not conflicted', () => {
  assert.equal(reconcileRecord({ localRecord: { id: 'b', version: 1, tripGeneration: 1 }, remoteRecord: { tripId: 'trip-test', recordId: 'b', mutationId: 'm', version: 2, tripGeneration: 1, schemaVersion: 1 }, pendingMutation: { mutationId: 'm', operation: 'update', baseVersion: 1 }, adapter, currentGeneration: 1 }).action, 'ack-echo');
});
