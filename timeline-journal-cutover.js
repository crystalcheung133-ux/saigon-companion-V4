/* Gate32: fail-closed transition gate. Never silently switches a production Save. */
'use strict';
function prepareTimelineJournalCutover(storage,{tripId,environment='production',confirmedTripId}={}){
  if(typeof tripId!=='string'||!tripId||confirmedTripId!==tripId)throw Error('Trip identity not explicitly confirmed');
  if(typeof inspectLegacyTimelineJournal!=='function')throw Error('Preflight unavailable');
  const state=inspectLegacyTimelineJournal(storage,{tripId,environment});
  if(state.legacyCount) return Object.freeze({ready:false,code:'LEGACY_PENDING_REQUIRES_RECONCILIATION',...state});
  if(state.scopedCount) return Object.freeze({ready:false,code:'SCOPED_PENDING_REQUIRES_RECONCILIATION',...state});
  return Object.freeze({ready:true,code:'EMPTY_JOURNALS_VERIFIED',tripId,environment});
}
if(typeof module!=='undefined'&&module.exports)module.exports={prepareTimelineJournalCutover};
if(typeof window!=='undefined')window.prepareTimelineJournalCutover=prepareTimelineJournalCutover;
