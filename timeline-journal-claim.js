/* Gate32: explicit legacy ownership claim, copy-only. Never deletes or acknowledges legacy. */
'use strict';
function claimLegacyTimelineJournal(storage,{tripId,environment='production',confirmOwnership=false}={}){
  if(confirmOwnership!==true)throw Error('Explicit ownership confirmation required');
  if(typeof inspectLegacyTimelineJournal!=='function')throw Error('Preflight dependency unavailable');
  const before=inspectLegacyTimelineJournal(storage,{tripId,environment});
  if(before.legacyCount===0)return Object.freeze({status:'NOTHING_TO_CLAIM',count:0});
  if(before.scopedCount!==0)throw Error('Scoped pending exists: manual reconciliation required');
  const legacy=createTimelineJournal(storage,'vn_timeline_pending_v1');
  const scoped=createTripTimelineJournal(storage,{tripId,environment});
  const source=legacy.read();
  if(!source||source.changes.length!==before.legacyCount)throw Error('Legacy journal changed during preflight');
  const original=JSON.stringify(source);
  const changes=source.changes.map(x=>({day:x.day,items:x.items}));
  // Atomic single-key destination write, with verified readback. Legacy is never touched.
  scoped.enqueueBatch(changes);
  const copied=scoped.read();
  if(!copied||copied.changes.length!==changes.length||copied.changes.some((x,i)=>x.day!==changes[i].day||JSON.stringify(x.items)!==JSON.stringify(changes[i].items)))throw Error('Scoped copy verification failed: retain legacy and investigate');
  if(JSON.stringify(legacy.read())!==original)throw Error('Legacy journal changed during copy: retain both and investigate');
  return Object.freeze({status:'COPIED_LEGACY_RETAINED',count:changes.length,tripId,environment});
}
if(typeof module!=='undefined'&&module.exports)module.exports={claimLegacyTimelineJournal};
if(typeof window!=='undefined')window.claimLegacyTimelineJournal=claimLegacyTimelineJournal;
