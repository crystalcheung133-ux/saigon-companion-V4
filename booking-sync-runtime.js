/* booking-sync-runtime.js — Travel Engine 25.2.8 shared Booking state transport.
   Admin mode remains local/Studio-managed unless sync is explicitly enabled.
   Collaborative mode uses the same Booking Authority and pushes via the generic
   booking-sync Edge Function. The shared token identifies the trip; partyId
   identifies who made the change. */
(function(root){
  'use strict';
  const LOG='[Booking Sync]';
  const state={pullPromise:null,lastSyncAt:'',lastError:'',versions:{},started:false,inFlight:new Map(),failed:new Set(),confirmed:new Set()};
  // Persistent mutation journal: deployment defaults and stale remote pulls never erase pending edits.
  const journalKey='travelengine_booking_pending_v1';
  function readJournal(){
    // Fail closed: a storage read error or corrupt journal is NOT an empty journal.
    // Treating it as empty would let a later Save/Delete overwrite unsent edits.
    if(!root.localStorage)throw new Error('BOOKING_PENDING_STORAGE_UNAVAILABLE');
    let raw;
    try{raw=root.localStorage.getItem(journalKey);}catch(_){throw new Error('BOOKING_PENDING_STORAGE_READ_FAILED');}
    if(raw===null)return {};
    let value;
    try{value=JSON.parse(raw);}catch(_){throw new Error('BOOKING_PENDING_JOURNAL_CORRUPT');}
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('BOOKING_PENDING_JOURNAL_CORRUPT');
    return value;
  }
  function writeJournal(value){if(!root.localStorage)throw new Error('BOOKING_PENDING_STORAGE_UNAVAILABLE');root.localStorage.setItem(journalKey,JSON.stringify(value));}
  function pending(id){return readJournal()[String(id)]||null;}
  function remember(id,record,operation){const journal=readJournal(),previous=journal[id];const revision=Number(previous&&previous.revision||0)+1;journal[id]={record:clone(record),operation:operation||'update',revision,state:'pending'};writeJournal(journal);emitStatus(id);return revision;}
  function setJournalState(id,revision,value){const journal=readJournal();if(!journal[id]||journal[id].revision!==revision)return false;if(value===null)delete journal[id];else journal[id].state=value;writeJournal(journal);emitStatus(id);return true;}
  function emitStatus(id){try{root.document.dispatchEvent(new root.CustomEvent('travelengine:bookingsyncstatus',{detail:{bookingId:id,status:recordStatus(id)}}));}catch(_){}}
  function recordStatus(id){const item=pending(id);return {state:!enabled()?'local-only':item?(state.inFlight.has(id)?'syncing':item.state==='failed'?'failed':'pending'):(state.confirmed.has(String(id))?'synced':'unverified'),revision:item&&item.revision||0,remoteConfirmed:!item&&enabled()&&state.confirmed.has(String(id))};}

  function management(){return (root.TRIP_CONFIG&&root.TRIP_CONFIG.bookingManagement)||{};}
  function syncConfig(){return management().sync||{};}
  function mode(){return root.BOOKING_PERMISSIONS?root.BOOKING_PERMISSIONS.mode():'admin';}
  function enabled(){return mode()==='collaborative'&&syncConfig().enabled===true&&!!String(syncConfig().accessToken||'').trim()&&!!(root.SYNC_CONFIG&&root.SYNC_CONFIG.url&&root.SYNC_CONFIG.anonKey);}
  function tripId(){return String((root.SYNC_CONFIG&&root.SYNC_CONFIG.tripId)||(root.TRIP_CONFIG&&root.TRIP_CONFIG.storageNamespace)||'');}
  function partyId(){return root.BOOKING_PERMISSIONS?root.BOOKING_PERMISSIONS.currentPartyId():'';}
  function headers(){return {apikey:root.SYNC_CONFIG.anonKey,Authorization:`Bearer ${root.SYNC_CONFIG.anonKey}`,Accept:'application/json','Content-Type':'application/json'};}
  function uuid(){return root.crypto&&root.crypto.randomUUID?root.crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`;}
  function clone(value){return value==null?value:JSON.parse(JSON.stringify(value));}
  function legacyRow(row){
    return {
      id:row.booking_id,bookingId:row.booking_id,eventId:row.event_id||'',placeId:row.place_id||'',
      day:row.day_number||'',dayId:row.day_number?`day${row.day_number}`:'',status:row.status||'pending',
      date:row.booking_date||'',time:(row.booking_time||'').slice(0,5),bookingName:row.booking_name||'',
      bookingCategory:row.category||'',category:row.category||'',title:row.title||'',
      depositPaid:row.deposit_paid?'Yes':'',depositAmount:row.deposit_amount||'',bookingMethod:row.booking_method||'',
      bookingContact:row.booking_contact||'',secondaryContact:row.secondary_contact||'',bookingUrl:row.booking_url||'',
      notes:row.notes||'',updatedAt:row.updated_at||'',updatedByPartyId:row.updated_by_party_id||''
    };
  }
  function mapRow(row){
    const payload=row&&row.payload&&typeof row.payload==='object'&&!Array.isArray(row.payload)?clone(row.payload):{};
    const record=Object.assign({},legacyRow(row||{}),payload,{id:(payload.id||payload.bookingId||row.booking_id),bookingId:(payload.bookingId||payload.id||row.booking_id)});
    // Multi-visit bookings keep human-readable aggregate date/time in the payload,
    // while the typed bookings columns receive one valid visit date/time for transport.
    if(Object.prototype.hasOwnProperty.call(record,'_displayDate')){record.date=record._displayDate;delete record._displayDate;}
    if(Object.prototype.hasOwnProperty.call(record,'_displayTime')){record.time=record._displayTime;delete record._displayTime;}
    {const rawStatus=String(record.status||'pending').toLowerCase();record.status=rawStatus==='confirmed'?'confirmed':(rawStatus==='planned'?'planned':'pending');}
    record._remoteVersion=Number(row.version||1);record._remoteDeletedAt=row.deleted_at||'';
    state.versions[record.id]=record._remoteVersion;
    return record;
  }
  function sourceTarget(){
    try{const view=root.GenerationSelectionAdapter&&root.GenerationSelectionAdapter.view?root.GenerationSelectionAdapter.view('bookings'):null;return view&&view.byId?view.byId:null;}catch(_){return null;}
  }
  function mergeRemoteWithDeployMaster(record,target){
    const master=root.BOOKING_AUTHORITY&&root.BOOKING_AUTHORITY.deployMaster?root.BOOKING_AUTHORITY.deployMaster(record&&record.id):null;
    if(!master)return record;
    const currentRevision=root.BOOKING_AUTHORITY.masterRevision();
    const remoteRevision=Number(record&&((record._masterRevision!=null?record._masterRevision:record.masterRevision))||0);
    if(remoteRevision===currentRevision)return Object.assign({},master,record,{_masterRevision:currentRevision});
    const merged=Object.assign({},master);
    const editable=root.BOOKING_AUTHORITY.editableStateFields||[];
    editable.forEach(function(field){if(Object.prototype.hasOwnProperty.call(record,field))merged[field]=clone(record[field]);});
    // Notes are deliberately not part of the generic stale local override allow-list.
    // A remote row, however, carries server-authored updatedByPartyId/updatedAt evidence.
    // Preserve that explicit collaborative Notes edit even when an older Qspa row lacks
    // the current payload master revision; otherwise deploy-master Notes overwrite it.
    // Booking Notes are collaborative server state. Some legacy Qspa rows pre-date the
    // payload/master-revision column, so updatedByPartyId can be absent even though the
    // canonical bookings.notes column contains the user's cross-device edit. Treat Notes
    // from a real remote row as authoritative here only; local stale overrides still cannot
    // override deploy-master Notes in booking-authority.js.
    if(record&&Number(record._remoteVersion||0)>0&&Object.prototype.hasOwnProperty.call(record,'notes'))merged.notes=clone(record.notes);
    merged._masterRevision=currentRevision;
    return merged;
  }
  function applyRemote(row){
    let record=mapRow(row);
    if(pending(record.id))return record; // Local manual save/delete wins until explicitly resolved.
    if(!root.BOOKING_AUTHORITY)return record;
    const target=sourceTarget();
    if(row.deleted_at){root.BOOKING_AUTHORITY.remove(record.id,target,{silent:true,remote:true});return record;}
    record=mergeRemoteWithDeployMaster(record,target);
    root.BOOKING_AUTHORITY.save(record.id,record,target,{silent:true,remote:true});
    return record;
  }
  async function fetchRows(bookingId){
    if(!enabled())return [];
    const response=await root.fetch(`${root.SYNC_CONFIG.url}/functions/v1/booking-sync`,{method:'POST',headers:headers(),body:JSON.stringify({action:'read',tripId:tripId(),tripAccessToken:String(syncConfig().accessToken||''),partyId:partyId(),bookingId:bookingId||''})});
    const body=await response.json().catch(()=>({ok:false,code:`HTTP_${response.status}`}));
    if(!response.ok||!body||!body.ok)throw new Error((body&&body.code)||`BOOKING_READ_${response.status}`);
    return Array.isArray(body.rows)?body.rows:[];
  }
  async function pull(){
    if(!enabled())return [];
    if(state.pullPromise)return state.pullPromise;
    state.pullPromise=(async()=>{try{
      const rows=await fetchRows();rows.forEach(applyRemote);state.lastSyncAt=new Date().toISOString();state.lastError='';
      document.dispatchEvent(new CustomEvent('travelengine:bookingchange',{detail:{remote:true}}));return rows.map(mapRow);
    }catch(error){state.lastError=error&&error.message||String(error);console.error(LOG,error);throw error;}finally{state.pullPromise=null;}})();
    return state.pullPromise;
  }
  function toPayload(record){
    const copy=clone(record)||{};
    delete copy._category;delete copy._status;delete copy._remoteVersion;delete copy._remoteDeletedAt;
    copy.id=record.id||record.bookingId;copy.bookingId=copy.id;
    copy._masterRevision=root.BOOKING_AUTHORITY&&root.BOOKING_AUTHORITY.masterRevision?root.BOOKING_AUTHORITY.masterRevision():1;
    copy.updatedByPartyId=partyId();copy.updatedAt=new Date().toISOString();
    return copy;
  }
  // Remote verification must compare JSON semantics, not key insertion order: Postgres jsonb
  // (and any JSON round-trip) may re-order object keys. Object keys are order-insensitive,
  // array element order stays significant (visit D1/D2/D3 sequence must match).
  function stableJSON(value){
    if(Array.isArray(value))return '['+value.map(function(item){return stableJSON(item);}).join(',')+']';
    if(value&&typeof value==='object')return '{'+Object.keys(value).filter(function(key){return value[key]!==undefined;}).sort().map(function(key){return JSON.stringify(key)+':'+stableJSON(value[key]);}).join(',')+'}';
    const text=JSON.stringify(value);return text===undefined?'null':text;
  }
  // Notes verification ignores line-ending style (CRLF/CR vs LF) and leading/trailing whitespace only;
  // any other difference (text, interior whitespace) still fails verification.
  function normalizeNotes(value){return String(value==null?'':value).replace(/\r\n?/g,'\n').trim();}
  function visitTransportDate(value){
    const text=String(value||'').trim();
    const iso=text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);if(iso)return iso[0];
    const m=text.match(/\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(20\d{2})\b/i);
    if(!m)return '';const months={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
    return `${m[3]}-${months[m[2].slice(0,3).toLowerCase()]}-${String(m[1]).padStart(2,'0')}`;
  }
  function visitTransportTime(value){const m=String(value||'').match(/(?:^|[^0-9])(\d{1,2}):(\d{2})/);return m?`${String(m[1]).padStart(2,'0')}:${m[2]}`:'';}
  function transportPayload(record){
    const payload=toPayload(record);const visits=Array.isArray(record&&record.plannedVisits)?record.plannedVisits:[];
    if(visits.length>1){
      const date=visitTransportDate(visits[0]&&visits[0].date),time=visitTransportTime(visits[0]&&visits[0].time);
      if(date&&time){payload._displayDate=record.date||'';payload._displayTime=record.time||'';payload.date=date;payload.time=time;}
    }
    return payload;
  }
  function mutation(operation,record,baseVersion){
    const value={mutationId:uuid(),tripId:tripId(),tripGeneration:Number((root.TRIP_CONFIG&&root.TRIP_CONFIG.tripGeneration)||1),schemaVersion:1,domain:'booking',recordId:record.id||record.bookingId,operation,payload:transportPayload(record),createdAt:new Date().toISOString(),createdByPartyId:partyId(),retryCount:0,state:'queued'};
    if(operation!=='create')value.baseVersion=Number(baseVersion);
    return value;
  }
  async function send(operation,record,baseVersion){
    const response=await root.fetch(`${root.SYNC_CONFIG.url}/functions/v1/booking-sync`,{method:'POST',headers:headers(),body:JSON.stringify({tripId:tripId(),tripAccessToken:String(syncConfig().accessToken||''),partyId:partyId(),permissionMode:mode(),mutation:mutation(operation,record,baseVersion)})});
    const body=await response.json().catch(()=>({ok:false,code:`HTTP_${response.status}`}));
    return {response,body};
  }
  async function push(record,operationHint){
    if(!enabled())return {ok:true,localOnly:true,booking:clone(record)};
    const id=String(record.id||record.bookingId);
    // Journal must be durable BEFORE any network activity, including the canonical read.
    const revision=remember(id,record,operationHint||'update');
    if(state.inFlight.has(id)||state.failed.has(id))return {ok:true,localOnly:true,pending:true,booking:clone(record)};
    return flush(id,revision);
  }
  async function flush(id,revision){
    if(state.inFlight.has(id))return {ok:true,pending:true};
    const entry=pending(id);
    if(!entry||entry.revision!==revision)return {ok:true,pending:true};
    const task=sendPending(id,entry);
    state.inFlight.set(id,task);emitStatus(id);
    try{return await task;}finally{state.inFlight.delete(id);emitStatus(id);}
  }
  async function sendPending(id,entry){
    const record=entry.record,operationHint=entry.operation,revision=entry.revision;
    try{return await remotePush(record,operationHint,id,revision);}
    catch(error){const latest=pending(id);if(latest)setJournalState(id,latest.revision,'failed');state.failed.add(id);state.lastError=error&&error.message||String(error);throw error;}
  }
  async function remotePush(record,operationHint,id,revision){
    if(!(root.BOOKING_PERMISSIONS&&root.BOOKING_PERMISSIONS.canEdit()))throw new Error('BOOKING_EDIT_NOT_ALLOWED');
    if(!navigator.onLine)throw new Error('BOOKING_SAVE_REQUIRES_CONNECTION');
    let canonical=(await fetchRows(record.id||record.bookingId))[0]||null;
    let operation=operationHint||(canonical?'update':'create');
    let result=await send(operation,record,canonical?Number(canonical.version):undefined);
    if(result.response.status===409){canonical=(await fetchRows(record.id||record.bookingId))[0]||null;result=await send(operation,record,canonical?Number(canonical.version):undefined);}
    if(!result.response.ok||!result.body||!result.body.ok)throw new Error((result.body&&result.body.code)||`BOOKING_WRITE_${result.response.status}`);
    const row=result.body.record; // Never apply acknowledgement over a newer local revision.
    state.lastSyncAt=new Date().toISOString();state.lastError='';
    let booking=row?mapRow(row):clone(record);
    // Do not report a cross-device save until the canonical remote row contains the
    // exact user-edited Notes. Qspa exposed this because its older remote/local state can
    // be reconciled against deploy master data; ordinary bookings must obey the same rule.
    const expectedNotes=normalizeNotes(record&&record.notes);
    const visitsExpected=Array.isArray(record&&record.plannedVisits)?stableJSON(record.plannedVisits):null;
    const remoteMatches=()=>normalizeNotes(booking&&booking.notes)===expectedNotes&&(visitsExpected===null||stableJSON(booking&&booking.plannedVisits)===visitsExpected);
    if(operationHint!=='delete'&&!remoteMatches()){
      const verifyRows=await fetchRows(record.id||record.bookingId);
      const verified=verifyRows[0]?mapRow(verifyRows[0]):null;
      if(!verified||normalizeNotes(verified.notes)!==expectedNotes||(visitsExpected!==null&&stableJSON(verified.plannedVisits)!==visitsExpected))throw new Error('BOOKING_REMOTE_VERIFY_FAILED');
      booking=verified;
      // Verification is read-only until we know this is still the latest local revision.
    }
    // A successful delete must be verified as a remote tombstone before clearing
    // the local pending journal. A missing row is NOT proof of deletion.
    if(operationHint==='delete'){
      const verifyRows=await fetchRows(id);
      if(!verifyRows[0]||!verifyRows[0].deleted_at)throw new Error('BOOKING_REMOTE_DELETE_NOT_CONFIRMED');
    }
    const confirmed=setJournalState(id,revision,null);
    if(confirmed){state.confirmed.add(id);if(row)applyRemote(row);}
    document.dispatchEvent(new CustomEvent('travelengine:bookingchange',{detail:{bookingId:id,booking,remote:confirmed}}));
    return {ok:true,booking,remote:confirmed,pending:!confirmed};
  }
  // Stage the durable cloud deletion intent BEFORE committing the local tombstone.
  // This closes the gap where a successful local delete could have no retry record.
  // Staging NEVER sends a network request; only commitStagedDelete may flush it.
  function stageDelete(record){
    if(!enabled())return null;
    const id=String(record.id||record.bookingId);
    const previous=pending(id);
    const revision=remember(id,Object.assign({},record,{deletedAt:new Date().toISOString()}),'delete');
    return {id,revision,previous:clone(previous)};
  }
  function cancelStagedDelete(stage){
    if(!stage)return false;
    const journal=readJournal();
    if(!journal[stage.id]||journal[stage.id].revision!==stage.revision)return false;
    if(stage.previous)journal[stage.id]=stage.previous;
    else delete journal[stage.id];
    writeJournal(journal);emitStatus(stage.id);return true;
  }
  async function commitStagedDelete(stage){
    if(!stage)return {ok:true,localOnly:true};
    if(state.inFlight.has(stage.id)||state.failed.has(stage.id))return {ok:true,pending:true};
    return flush(stage.id,stage.revision);
  }
  async function remove(record){
    if(!enabled())return {ok:true,localOnly:true,id:record.id||record.bookingId};
    return push(Object.assign({},record,{deletedAt:new Date().toISOString()}),'delete');
  }
  async function retry(id){
    id=String(id);if(state.inFlight.has(id))return {ok:true,pending:true};
    const item=pending(id);if(!item)return {ok:true,alreadySynced:true};
    state.failed.delete(id);setJournalState(id,item.revision,'pending');return flush(id,item.revision);
  }
  function status(){return Object.freeze({enabled:enabled(),mode:mode(),canEdit:!!(root.BOOKING_PERMISSIONS&&root.BOOKING_PERMISSIONS.canEdit()),partyId:partyId(),lastSyncAt:state.lastSyncAt,lastError:state.lastError,pending:readJournal(),synced:enabled()&&Object.keys(readJournal()).length===0&&state.confirmed.size>0});}
  function safePull(){if(enabled()&&navigator.onLine)pull().catch(()=>{});}
  function start(){
    if(state.started)return;state.started=true;if(!enabled())return;
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',safePull,{once:true});else safePull();
    root.addEventListener('focus',safePull);root.addEventListener('online',safePull);document.addEventListener('visibilitychange',()=>{if(!document.hidden)safePull();});
    const interval=Math.max(5000,Number(syncConfig().pollIntervalMs||15000));root.setInterval(()=>{if(!document.hidden&&navigator.onLine)safePull();},interval);
  }
  root.BOOKING_SYNC=Object.freeze({enabled,pull,push,remove,stageDelete,cancelStagedDelete,commitStagedDelete,retry,recordStatus,getStatus:status,start});
  start();
})(globalThis);
