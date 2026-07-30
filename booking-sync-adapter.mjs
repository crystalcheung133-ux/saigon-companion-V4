/* booking-sync-adapter.mjs - Stage D domain adapter. No transport, storage or UI ownership. */
export function createBookingSyncAdapter({ repository, tripConfig }) {
  if (!repository) throw new TypeError('Booking adapter requires repository');
  if (!tripConfig?.id) throw new TypeError('Booking adapter requires tripConfig.id');

  const schemaVersion = Number(repository.schemaVersion || 1);
  const tripId = String(tripConfig.id);

  function clone(value) { return structuredClone(value); }
  function recordId(record) { return String(record?.bookingId || record?.recordId || record?.id || '').trim(); }
  function validateShape(record, expectedTripId = tripId) {
    const errors = [];
    if (!record || typeof record !== 'object') errors.push('record-not-object');
    if (!recordId(record)) errors.push('missing-bookingId');
    if (String(record?.tripId || '') !== expectedTripId) errors.push('wrong-tripId');
    if (Number(record?.schemaVersion) !== schemaVersion) errors.push('wrong-schemaVersion');
    if (!Number.isInteger(Number(record?.tripGeneration)) || Number(record.tripGeneration) < 1) errors.push('invalid-tripGeneration');
    if (!Number.isInteger(Number(record?.version)) || Number(record.version) < 1) errors.push('invalid-version');
    return { ok: errors.length === 0, errors };
  }

  return Object.freeze({
    domain: 'booking',
    tripId,
    schemaVersion,
    repository,

    toRemote(localRecord) {
      const validation = validateShape(localRecord);
      if (!validation.ok) {
        const error = new Error('BOOKING_ADAPTER_LOCAL_VALIDATION_FAILED');
        error.details = validation.errors;
        throw error;
      }
      const row = clone(localRecord);
      row.recordId = recordId(localRecord);
      row.bookingId = row.recordId;
      return row;
    },

    fromRemote(remoteRecord) {
      const validation = validateShape(remoteRecord);
      if (!validation.ok) {
        const error = new Error('BOOKING_ADAPTER_REMOTE_VALIDATION_FAILED');
        error.details = validation.errors;
        throw error;
      }
      const row = clone(remoteRecord);
      row.bookingId = recordId(remoteRecord);
      row.id = row.bookingId;
      delete row.recordId;
      return row;
    },

    getRecordId: recordId,
    getVersion(record) { return Number(record?.version); },
    getTripGeneration(record) { return Number(record?.tripGeneration); },
    validateLocal(record) { return validateShape(record); },
    validateRemote(record) { return validateShape(record); },

    async onGenerationBump(event) {
      if (String(event?.tripId || '') !== tripId) return;
      // Stage D remains local-only. Repository migration/reset ownership stays outside the adapter.
    }
  });
}
