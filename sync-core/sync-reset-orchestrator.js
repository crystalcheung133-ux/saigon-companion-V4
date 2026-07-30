export class SyncResetOrchestrator {
  constructor({ queue, provider, adapters, firstSyncStore }) {
    this.queue = queue;
    this.provider = provider;
    this.adapters = adapters;
    this.firstSyncStore = firstSyncStore;
  }

  async prepare(request) {
    const current = await this.provider.getTripGeneration(request.tripId);
    return { tripId: request.tripId, currentGeneration: current, nextGeneration: current + 1, requestedByPartyId: request.requestedByPartyId, preparedAt: new Date().toISOString() };
  }

  async commit(plan) {
    this.queue.pauseDispatch();
    let storeClosed = false;
    try {
      await this.queue.waitForIdle();
      await this.queue.closeStore();
      storeClosed = true;
      if (typeof this.provider.bumpTripGeneration !== 'function') throw new Error('Provider must implement bumpTripGeneration() for reset');
      const committed = await this.provider.bumpTripGeneration(plan.tripId, plan.currentGeneration, plan.requestedByPartyId);
      if (committed !== plan.nextGeneration) throw new Error('Generation bump mismatch');

      await this.queue.reopenStore();
      storeClosed = false;
      await this.queue.discardOlderGeneration(plan.tripId, committed);
      await this.firstSyncStore.clearTrip(plan.tripId);
      for (const adapter of this.adapters.values()) {
        if (adapter.tripId === plan.tripId && typeof adapter.onGenerationBump === 'function') {
          await adapter.onGenerationBump({ tripId: plan.tripId, previousGeneration: plan.currentGeneration, currentGeneration: committed });
        }
      }
      return committed;
    } finally {
      if (storeClosed) await this.queue.reopenStore();
      this.queue.resumeDispatch();
    }
  }
}

export class MemoryFirstSyncStore {
  #keys = new Set();
  key({deviceId, tripId, tripGeneration, domain}) { return `${deviceId}|${tripId}|${tripGeneration}|${domain}`; }
  async isComplete(scope) { return this.#keys.has(this.key(scope)); }
  async markComplete(scope) { this.#keys.add(this.key(scope)); }
  async clearTrip(tripId) { for (const key of [...this.#keys]) if (key.split('|')[1] === tripId) this.#keys.delete(key); }
}
