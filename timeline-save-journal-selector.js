/* Gate32: opt-in trip-scoped Save selection. No automatic migration or guessing. */
'use strict';
function selectTimelineSaveJournal(storage, configuration){
  if(typeof createTimelineJournal!=='function')throw Error('Legacy journal unavailable');
  // Existing production behaviour remains unchanged unless explicit verified cutover is requested.
  if(configuration==null)return createTimelineJournal(storage);
  if(!configuration||configuration.enabled!==true||configuration.environment!=='production'||
     typeof configuration.tripId!=='string'||configuration.confirmedTripId!==configuration.tripId)
    throw Error('Invalid explicit journal cutover configuration');
  if(typeof prepareTimelineJournalCutover!=='function'||typeof createTripTimelineJournal!=='function')
    throw Error('Trip journal cutover dependencies unavailable');
  const result=prepareTimelineJournalCutover(storage,{
    tripId:configuration.tripId,confirmedTripId:configuration.confirmedTripId,environment:'production'
  });
  if(!result.ready)throw Error('Journal cutover blocked: '+result.code);
  return createTripTimelineJournal(storage,{tripId:configuration.tripId,environment:'production'});
}
if(typeof module!=='undefined'&&module.exports)module.exports={selectTimelineSaveJournal};
if(typeof window!=='undefined')window.selectTimelineSaveJournal=selectTimelineSaveJournal;
