export function reconcileRecord({ localRecord, remoteRecord, pendingMutation, adapter, currentGeneration }) {
  if (!remoteRecord || remoteRecord.tripId !== adapter.tripId) return { action: 'reject', reason: 'wrong-trip' };

  const remoteSchemaVersion = Number(remoteRecord.schemaVersion ?? adapter.schemaVersion);
  if (remoteSchemaVersion > adapter.schemaVersion) return { action: 'pause', reason: 'future-schema', remoteSchemaVersion };

  const remoteValidation = adapter.validateRemote(remoteRecord);
  if (!remoteValidation?.ok) return { action: 'reject', reason: 'invalid-remote', errors: remoteValidation?.errors || [] };

  const remoteGeneration = adapter.getTripGeneration(remoteRecord);
  if (remoteGeneration < currentGeneration) return { action: 'reject', reason: 'old-generation' };
  if (remoteGeneration > currentGeneration) return { action: 'pause', reason: 'future-generation' };
  if (!localRecord) return { action: 'apply-remote' };

  const localVersion = adapter.getVersion(localRecord);
  const remoteVersion = adapter.getVersion(remoteRecord);
  if (!pendingMutation) {
    if (remoteVersion > localVersion) return { action: 'apply-remote' };
    return { action: 'ignore' };
  }

  if (pendingMutation.mutationId && remoteRecord.mutationId === pendingMutation.mutationId) {
    return { action: 'ack-echo', reason: 'same-mutation' };
  }

  if (pendingMutation.operation === 'create') {
    return remoteVersion >= localVersion ? { action: 'conflict', reason: 'remote-exists-during-local-create' } : { action: 'ignore' };
  }
  if (pendingMutation.baseVersion === remoteVersion) return { action: 'ignore', reason: 'pending-mutation-against-current-base' };
  if (remoteVersion > pendingMutation.baseVersion) return { action: 'conflict', reason: 'both-changed-from-base' };
  return { action: 'ignore' };
}
