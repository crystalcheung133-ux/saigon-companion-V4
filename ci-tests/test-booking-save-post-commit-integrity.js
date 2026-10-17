// Booking Save lifecycle contract — Engine 25.7 local-first + atomic mutation guard.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('trip-runtime.js','utf8');
function between(text,a,b){const i=text.indexOf(a),j=text.indexOf(b,i+1);assert(i>=0&&j>i,`missing block ${a}`);return text.slice(i,j+b.length);}
const fnSrc=between(src,'async function commitBookingSave(record,deps){','window.commitBookingSave=commitBookingSave;');
const saveHandlerSrc=between(src,'async function saveBookingEdit(event,bookingId){','\n}\nfunction reopenSavedBooking');
for(const forbidden of ['Klook','airport-transfer','Fusion','bk-transfer-in','bk-fusion-original','Qspa','Norah','Pizza']) assert(!fnSrc.includes(forbidden),`generic save contains trip token ${forbidden}`);
assert(/const BOOKING_SAVE_IN_FLIGHT=new Set\(\);/.test(src));
assert(/if\(BOOKING_SAVE_IN_FLIGHT\.has\(bookingId\)\)return false;/.test(saveHandlerSrc));
assert(saveHandlerSrc.indexOf('BOOKING_SAVE_IN_FLIGHT.add(bookingId)')<saveHandlerSrc.indexOf('await commitBookingSave'));
assert(/finally\{\s*BOOKING_SAVE_IN_FLIGHT\.delete\(bookingId\);\s*\}/.test(saveHandlerSrc));
assert(fnSrc.indexOf('deps.localSave(record)')<fnSrc.indexOf('deps.syncPush(booking)'),'local commit must precede remote sync');
assert(!/await\s+deps\.syncPush/.test(fnSrc),'remote sync must not hold Save UI open');
const ctx={console,Promise};vm.createContext(ctx);vm.runInContext('const window={};'+fnSrc+';this.commitBookingSave=commitBookingSave;',ctx);const commit=ctx.commitBookingSave;
(async()=>{
 let syncCalled=0;
 let r=await commit({id:'x'},{syncEnabled:false,localSave:()=>({ok:true,booking:{id:'x'}})});assert(r.ok&&r.committed&&!r.degraded);
 r=await commit({id:'x'},{syncEnabled:false,localSave:()=>({ok:false,reason:'storage-failed'})});assert(!r.ok&&!r.committed);
 let resolveSync;const pending=new Promise(res=>resolveSync=res);
 r=await commit({id:'x'},{syncEnabled:true,localSave:()=>({ok:true,booking:{id:'x'}}),syncPush:()=>{syncCalled++;return pending;}});
 assert(r.ok&&r.committed&&r.degraded,'network-enabled local save must return immediately as sync-pending');assert.equal(syncCalled,1);resolveSync({ok:true});
 r=await commit({id:'x'},{syncEnabled:true,localSave:()=>({ok:true,booking:{id:'x'}}),syncPush:()=>Promise.reject(new Error('offline'))});assert(r.ok&&r.committed&&r.degraded);
 await new Promise(res=>setTimeout(res,0));
 console.log('BOOKING SAVE POST-COMMIT INTEGRITY: PASS');
})().catch(e=>{console.error(e);process.exit(1);});
