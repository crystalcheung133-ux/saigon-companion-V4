/* Guide cloud journal: local-first, explicit failed Retry, remote read-back verification. */
(function(root){'use strict';
const cfg=root.SYNC_CONFIG||{},table=cfg.tables?.guides||'trip_guides';
const KEY='travelengine_guide_pending_v1';
const state={timer:null,inFlight:null,lastSyncAt:null,lastError:null,status:'unverified'};
function readJournal(){
 if(!root.localStorage)throw Error('GUIDE_JOURNAL_UNAVAILABLE');
 let raw;try{raw=root.localStorage.getItem(KEY)}catch(_){throw Error('GUIDE_JOURNAL_READ_FAILED')}
 if(raw===null)return {};
 let val;try{val=JSON.parse(raw)}catch(_){throw Error('GUIDE_JOURNAL_CORRUPT')}
 if(!val||typeof val!=='object'||Array.isArray(val))throw Error('GUIDE_JOURNAL_CORRUPT');
 return val;
}
function writeJournal(j){root.localStorage.setItem(KEY,JSON.stringify(j))}
function notify(){try{root.document.dispatchEvent(new root.CustomEvent('travelengine:guidesyncstatus',{detail:getState()}))}catch(_){}}
function configured(){return !!(cfg.enabled&&cfg.url&&cfg.anonKey&&cfg.tripId&&root.SUPABASE?.isConfigured?.()&&root.GUIDE_AUTHORITY)}
function stageMutation(id,record){
 const j=readJournal(),old=j[id];j[id]={record:JSON.parse(JSON.stringify(record)),revision:Number(old?.revision||0)+1,status:'pending'};
 writeJournal(j);state.status='pending';notify();return j[id].revision;
}
function setState(id,rev,status){const j=readJournal();if(!j[id]||j[id].revision!==rev)return false;
 if(status===null)delete j[id];else j[id].status=status;writeJournal(j);notify();return true}
function getState(){try{const j=readJournal(),pending=Object.keys(j);return {status:pending.length?(pending.some(id=>j[id].status==='failed')?'failed':state.inFlight?'syncing':'pending'):state.status,pending:pending.length,lastSyncAt:state.lastSyncAt,lastError:state.lastError,configured:configured()}}catch(e){return {status:'storage-error',pending:null,lastError:String(e.message||e),configured:configured()}}}
async function pull(){await root.SUPABASE.getSession();const q=await root.SUPABASE.getClient().from(table).select('id,payload,updated_at').eq('trip_id',cfg.tripId);if(q.error)throw q.error;return q.data||[]}
async function push(rows){if(!rows.length)return;await root.SUPABASE.getSession();const q=await root.SUPABASE.getClient().from(table).upsert(rows,{onConflict:'id'});if(q.error)throw q.error}
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x}
function equal(a,b){return JSON.stringify(canonical(a))===JSON.stringify(canonical(b))}
async function syncNow(options={}){
 if(!configured()||root.navigator?.onLine===false)return;
 if(state.inFlight)return state.inFlight;
 let j=readJournal();const entries=Object.entries(j).filter(([id,v])=>v&&v.record&&(options.retry===true||v.status!=='failed'));
 state.status=entries.length?'syncing':'unverified';state.lastError=null;notify();
 state.inFlight=(async()=>{try{
  // Only journalled local edits can be pushed. ZIP defaults are never cloud writes.
  const rows=entries.map(([id,v])=>({id,trip_id:cfg.tripId,payload:v.record.patch||{},updated_at:v.record.updatedAt}));
  await push(rows);
  const remote=await pull(),remoteMap=new Map(remote.map(r=>[r.id,r]));
  for(const [id,v] of entries){const r=remoteMap.get(id);
   if(!r||!equal(r.payload||{},v.record.patch||{})||String(r.updated_at||'')!==String(v.record.updatedAt||''))throw Error('GUIDE_REMOTE_VERIFY_FAILED:'+id);
   setState(id,v.revision,null);
  }
  // Pending local edits always win over remote data, including failed writes.
  const pending=readJournal();root.GUIDE_AUTHORITY.mergeRemote(remote.filter(r=>!pending[r.id]).map(r=>({id:r.id,patch:r.payload||{},updatedAt:r.updated_at})));
  state.lastSyncAt=new Date().toISOString();state.status=entries.length?'synced':'unverified';notify();
 }catch(e){state.status='failed';state.lastError=String(e?.message||e);
  for(const [id,v] of entries){try{setState(id,v.revision,'failed')}catch(_){state.status='storage-error'}}
  notify();console.warn('[Guide sync]',state.lastError);
 }finally{state.inFlight=null;notify()}})();return state.inFlight;
}
function queueSync(delay=120){clearTimeout(state.timer);state.timer=setTimeout(()=>{syncNow().catch(e=>{state.status='storage-error';state.lastError=String(e.message||e);notify()})},delay)}
function retry(){return syncNow({retry:true})}
root.addEventListener?.('online',()=>queueSync(50));root.document.addEventListener('visibilitychange',()=>{if(root.document.visibilityState==='visible')queueSync(100)});
root.document.addEventListener('travelengine:guidesaved',()=>queueSync(20));
// Do not auto-retry failed mutations on reload. User must explicitly request Retry.
root.setInterval?.(()=>{if(root.document.visibilityState==='visible')queueSync(0)},30000);queueSync(0);
root.GUIDE_SYNC=Object.freeze({syncNow,queueSync,retry,stageMutation,readJournal,getState,isConfigured:configured});
})(globalThis);
