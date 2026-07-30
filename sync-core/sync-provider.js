export class SyncProviderError extends Error {
  constructor(message, code = 'provider_error', details = undefined) {
    super(message);
    this.name = 'SyncProviderError';
    this.code = code;
    this.details = details;
  }
}

export function assertProvider(provider) {
  const required = ['connect', 'disconnect', 'fetchChanges', 'pushMutation', 'subscribe', 'getTripGeneration', 'ping'];
  for (const method of required) {
    if (!provider || typeof provider[method] !== 'function') {
      throw new TypeError(`Sync provider is missing ${method}()`);
    }
  }
  return provider;
}
