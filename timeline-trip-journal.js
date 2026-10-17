/* Gate32: trip-scoped pending journal factory. No implicit migration from legacy key. */
'use strict';
function createTripTimelineJournal(storage, {tripId,environment='production'}={}) {
  if(typeof createTimelineJournal!=='function')throw Error('Timeline journal dependency unavailable');
  if(typeof tripId!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(tripId))throw Error('Invalid trip identifier');
  if(!['production','staging'].includes(environment))throw Error('Invalid environment');
  const key=`vn_timeline_pending_v2:${environment}:${tripId}`;
  return createTimelineJournal(storage,key);
}
if(typeof module!=='undefined'&&module.exports)module.exports={createTripTimelineJournal};
if(typeof window!=='undefined')window.createTripTimelineJournal=createTripTimelineJournal;
