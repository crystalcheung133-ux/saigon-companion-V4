const clone = value => structuredClone(value);

export class IndexedDbQueueStore {
  constructor({ indexedDB = globalThis.indexedDB, databaseName = 'ccmv-travel-sync', storeName = 'mutations' } = {}) {
    if (!indexedDB) throw new Error('INDEXEDDB_UNAVAILABLE');
    this.indexedDB = indexedDB;
    this.databaseName = databaseName;
    this.storeName = storeName;
    this.connection = null;
    this.opening = null;
  }

  async list() {
    return this.#request('readonly', store => store.getAll())
      .then(rows => rows.map(clone).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
  }

  async put(item) { await this.#request('readwrite', store => store.put(clone(item))); }
  async delete(id) { await this.#request('readwrite', store => store.delete(id)); }
  async clear() { await this.#request('readwrite', store => store.clear()); }

  async close() {
    const connection = await this.opening?.catch(() => null) || this.connection;
    connection?.close();
    this.connection = null;
    this.opening = null;
  }

  async reopen() { await this.#open(); }

  async #open() {
    if (this.connection) return this.connection;
    if (this.opening) return this.opening;
    this.opening = new Promise((resolve, reject) => {
      const request = this.indexedDB.open(this.databaseName, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(this.storeName)) {
          request.result.createObjectStore(this.storeName, { keyPath: 'mutationId' });
        }
      };
      request.onerror = () => reject(request.error || new Error('INDEXEDDB_OPEN_FAILED'));
      request.onblocked = () => reject(new Error('INDEXEDDB_OPEN_BLOCKED'));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); if (this.connection === db) this.connection = null; };
        this.connection = db;
        resolve(db);
      };
    }).finally(() => { this.opening = null; });
    return this.opening;
  }

  async #request(mode, operation) {
    const db = await this.#open();
    return new Promise((resolve, reject) => {
      let request;
      try {
        const transaction = db.transaction(this.storeName, mode);
        request = operation(transaction.objectStore(this.storeName));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('INDEXEDDB_REQUEST_FAILED'));
        transaction.onabort = () => reject(transaction.error || new Error('INDEXEDDB_TRANSACTION_ABORTED'));
      } catch (error) {
        reject(error);
      }
    });
  }
}

export class IndexedDbFirstSyncStore {
  constructor(options = {}) {
    this.store = new IndexedDbQueueStore({ databaseName: 'ccmv-travel-sync-first-sync', ...options, storeName: options.storeName || 'first-sync' });
  }
  key(scope) { return `${scope.deviceId}|${scope.tripId}|${scope.tripGeneration}|${scope.domain}`; }
  async isComplete(scope) { return (await this.store.list()).some(item => item.mutationId === this.key(scope)); }
  async markComplete(scope) {
    const mutationId = this.key(scope);
    await this.store.put({ mutationId, tripId: scope.tripId, createdAt: new Date().toISOString(), scope });
  }
  async clearTrip(tripId) {
    for (const item of await this.store.list()) if (item.tripId === tripId) await this.store.delete(item.mutationId);
  }
}
