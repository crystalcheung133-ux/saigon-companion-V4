const fs=require('fs');const vm=require('vm');
function makeStorage(seed={}){const data=new Map(Object.entries(seed));return{getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),dump:()=>Object.fromEntries(data)};}
const localStorage=makeStorage({'ccmv_vietnam_bookings_v1':JSON.stringify([{id:'bk-lune',status:'confirmed',bookingName:'Crystal',updatedBy:'crystal',updatedAt:'2026-07-01T00:00:00.000Z'}])});
const sessionStorage=makeStorage();
const listeners={};
const context={console,localStorage,sessionStorage,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail;}},addEventListener:(t,fn)=>(listeners[t]??=[]).push(fn),removeEventListener:()=>{},dispatchEvent:e=>{(listeners[e.type]||[]).forEach(fn=>fn(e));},globalThis:null};context.globalThis=context;
vm.createContext(context);
for(const f of ['trip-config.js','storage-config.js','storage.js','booking-repository.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context,{filename:f});
const repo=context.CCMV_BOOKING_REPOSITORY;
const rows=repo.list();
if(rows.length!==13)throw new Error(`Expected 13 rows, got ${rows.length}`);
const lune=repo.getById('bk-lune');
if(lune.status!=='confirmed'||lune.bookingName!=='Crystal')throw new Error('Legacy values not preserved');
if(lune.bookingId!=='bk-lune'||lune.id!=='bk-lune')throw new Error('Stable ID migration failed');
if(lune.tripId!=='ccmv-vietnam-2026'||lune.tripGeneration!==1||lune.version<1)throw new Error('Canonical fields missing');
if(lune.updatedByPartyId!=='party-crystal')throw new Error(`Party attribution failed: ${lune.updatedByPartyId}`);
const before=lune.version;
const updated=repo.update('bk-lune',{notes:'Updated note'},{expectedVersion:before,updatedByPartyId:'party-vivian'});
if(updated.version!==before+1||updated.notes!=='Updated note'||updated.updatedByPartyId!=='party-vivian')throw new Error('Versioned update failed');
let conflict=false;try{repo.update('bk-lune',{notes:'stale'},{expectedVersion:before});}catch(e){conflict=e.message==='BOOKING_VERSION_CONFLICT';}
if(!conflict)throw new Error('Expected stale version conflict');
if(repo.getForPlace('lune').length!==1)throw new Error('Place query failed');
const persisted=JSON.parse(localStorage.dump()['ccmv_vietnam_bookings_v1']);
if(persisted.some(x=>!x.bookingId||!x.tripId||!x.version||!x.tripGeneration))throw new Error('Persisted schema incomplete');
console.log('Booking repository: PASS 13/13 records migrated, version conflict enforced.');
