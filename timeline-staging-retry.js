'use strict';
/* Staging-only explicit retry coordinator. No automatic retry, no production wiring. */
function createStagingRetry({journal,client,storage,metaKey='vn_timeline_staging_retry_v1',uuid=()=>crypto.randomUUID()}){
 if(!journal||!client||!storage)throw Error('Missing dependencies');
 function load(){let raw;try{raw=storage.getItem(metaKey);}catch{throw Error('Retry metadata unreadable');}if(raw===null)return {};let m;try{m=JSON.parse(raw);}catch{throw Error('Retry metadata corrupt');}if(!m||Array.isArray(m)||typeof m!=='object')throw Error('Retry metadata invalid');return m;}
 function save(m){const s=JSON.stringify(m);try{storage.setItem(metaKey,s);if(storage.getItem(metaKey)!==s)throw Error();}catch{throw Error('Retry metadata not durable');}}
 async function retryOne(){const pending=journal.read();if(!pending?.changes.length)return {status:'nothing_pending'};
  const first=pending.changes[0];const meta=load();let entry=meta[first.seq];
  if(entry){if(entry.day!==first.day||!Number.isSafeInteger(entry.expectedRevision)||entry.expectedRevision<0||typeof entry.mutationId!=='string')throw Error('Retry metadata mismatch · blocked');}
  else{
   // Never bootstrap from bundled defaults or overwrite existing cloud data.
   const cloud=await client.read(first.day);
   if(!cloud||cloud.ok!==true||!Number.isSafeInteger(cloud.revision)||cloud.revision<0)throw Error('Unverified cloud baseline · pending retained');
   if(cloud.exists||cloud.revision!==0) return {status:'manual_merge_required',reason:'Cloud day already exists; never overwrite automatically'};
   entry={day:first.day,expectedRevision:0,mutationId:uuid()};
   if(!/^[0-9a-f-]{36}$/i.test(entry.mutationId))throw Error('Invalid mutation ID');
   save({...meta,[first.seq]:entry}); // persist idempotency identity BEFORE HTTP write
  }
  const result=await client.write({day:first.day,items:first.items,expectedRevision:entry.expectedRevision,mutationId:entry.mutationId});
  if(result.ok!==true||result.revision!==entry.expectedRevision+1)throw Error('Cloud confirmation invalid · pending retained');
  // Acknowledge only this exact journal sequence. A newer edit stays pending.
  journal.acknowledge(first.seq);
  const after=load();delete after[first.seq];save(after);
  return {status:'synced_one',seq:first.seq,revision:result.revision,remaining:journal.read()?.changes.length??0};
 }
 return Object.freeze({retryOne,inspect:load});
}
if(typeof module!=='undefined')module.exports={createStagingRetry};

if(typeof window!=="undefined")Object.assign(window,{createStagingRetry});
