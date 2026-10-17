/* Timeline pending journal — isolated prototype, NOT connected to production. */
'use strict';
function createTimelineJournal(storage, key='vn_timeline_pending_v1') {
  if (!storage || typeof storage.getItem!=='function' || typeof storage.setItem!=='function') throw Error('Storage unavailable');
  function read() {
    let raw;
    try { raw=storage.getItem(key); } catch(e) { throw Error('Journal unreadable'); }
    if(raw===null) return null;
    let value;
    try { value=JSON.parse(raw); } catch(e) { throw Error('Journal corrupt'); }
    if(!value || value.schema!==1 || !Number.isSafeInteger(value.seq) || value.seq<1 || !Array.isArray(value.changes)) throw Error('Journal invalid');
    let prev=0;
    for(const entry of value.changes){
      if(!entry || !Number.isSafeInteger(entry.seq) || entry.seq<=prev || entry.seq>value.seq || typeof entry.day!=='string' || !Array.isArray(entry.items)) throw Error('Journal invalid entries');
      prev=entry.seq;
    }
    return value;
  }
  function write(value) {
    const serialized=JSON.stringify(value);
    try {
      storage.setItem(key,serialized);
      if(storage.getItem(key)!==serialized) throw Error('Journal verification failed');
    } catch(e) { throw Error('Journal write failed or verification failed'); }
  }
  function enqueueBatch(batch) {
    if(!Array.isArray(batch)||!batch.length) throw Error('Invalid Timeline batch');
    const copies=batch.map(change=>{
      if(!change||typeof change.day!=='string'||!change.day||!Array.isArray(change.items)) throw Error('Invalid Timeline change');
      const items=JSON.parse(JSON.stringify(change.items));
      if(!Array.isArray(items)) throw Error('Invalid Timeline items');
      return {day:change.day,items};
    });
    const prior=read();
    const oldSeq=prior?prior.seq:0;
    if(copies.length>Number.MAX_SAFE_INTEGER-oldSeq) throw Error('Journal sequence exhausted');
    const additions=copies.map((change,i)=>({...change,seq:oldSeq+i+1}));
    const next={schema:1,seq:oldSeq+copies.length,changes:[...(prior?prior.changes:[]),...additions]};
    // Single storage write: a multi-day move is either fully journalled or not journalled.
    write(next);
    return additions.map(x=>x.seq);
  }
  function enqueue(change) { return enqueueBatch([change])[0]; }
  function acknowledge(seq) {
    const prior=read();
    if(!prior || !Number.isSafeInteger(seq) || seq<1 || seq>prior.seq || !prior.changes.some(x=>x.seq===seq)) throw Error('Invalid acknowledgement');
    // Only acknowledge the exact revision confirmed by cloud; never drop a newer edit.
    write({schema:1,seq:prior.seq,changes:prior.changes.filter(x=>x.seq!==seq)});
  }
  return Object.freeze({read,enqueue,enqueueBatch,acknowledge});
}
if(typeof module!=='undefined'&&module.exports)module.exports={createTimelineJournal};
if(typeof window!=='undefined')window.createTimelineJournal=createTimelineJournal;
