/* Gate32: read-only legacy pending migration preflight. Never guesses a trip. */
'use strict';
function inspectLegacyTimelineJournal(storage, {tripId, environment='production'}={}) {
  if(typeof createTimelineJournal!=='function'||typeof createTripTimelineJournal!=='function')throw Error('Journal dependencies unavailable');
  if(typeof tripId!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(tripId))throw Error('Explicit trip ID required');
  if(!['production','staging'].includes(environment))throw Error('Invalid environment');
  const legacy=createTimelineJournal(storage,'vn_timeline_pending_v1').read();
  const scoped=createTripTimelineJournal(storage,{tripId,environment}).read();
  const legacyCount=legacy?.changes.length||0;
  const scopedCount=scoped?.changes.length||0;
  // Old entries have no trip ownership metadata. Never auto-assign them.
  const status=legacyCount?'MANUAL_OWNERSHIP_REVIEW_REQUIRED':scopedCount?'SCOPED_PENDING_EXISTS':'NO_PENDING_CHANGES';
  return Object.freeze({status,legacyCount,scopedCount,tripId,environment,canAutoMigrate:false});
}
if(typeof module!=='undefined'&&module.exports)module.exports={inspectLegacyTimelineJournal};
if(typeof window!=='undefined')window.inspectLegacyTimelineJournal=inspectLegacyTimelineJournal;
