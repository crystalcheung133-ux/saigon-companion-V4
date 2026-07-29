const fs=require('fs');const vm=require('vm');
function makeStorage(seed={}){const data=new Map(Object.entries(seed));return{getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),dump:()=>Object.fromEntries(data)};}
function boot(seed){const localStorage=makeStorage(seed);const sessionStorage=makeStorage();const listeners={};const context={console,localStorage,sessionStorage,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail;}},addEventListener:(t,fn)=>(listeners[t]??=[]).push(fn),removeEventListener:()=>{},dispatchEvent:e=>{(listeners[e.type]||[]).forEach(fn=>fn(e));},globalThis:null};context.globalThis=context;vm.createContext(context);for(const f of ['trip-config.js','storage-config.js','storage.js','booking-repository.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context,{filename:f});return {context,localStorage};}
const key='ccmv_vietnam_bookings_v1';
const legacy=[{id:'bk-lune',status:'confirmed',bookingName:'Crystal',updatedBy:'crystal',updatedAt:'2026-07-01T00:00:00.000Z'}];
const first=boot({[key]:JSON.stringify(legacy)});const repo=first.context.CCMV_BOOKING_REPOSITORY;const rows=repo.list();
if(rows.length!==13)throw new Error('Expected 13 migrated records');
if(!repo.getMigrationStatus().completed)throw new Error('Migration marker not completed');
if(!repo.validateAll().ok)throw new Error('Migrated records invalid');
const snapshot=first.localStorage.dump()[key];const markerKey=first.context.STORAGE_CONFIG.keys.bookingSchemaMigration;const marker=first.localStorage.dump()[markerKey];
if(!marker)throw new Error('Migration marker missing');
repo.list();if(first.localStorage.dump()[key]!==snapshot)throw new Error('Migration not idempotent');
const remote=repo.applyRemoteWrite({...repo.getById('bk-lune'),version:9,notes:'remote',updatedAt:'2026-07-29T00:00:00.000Z'});
if(remote.version!==9||repo.getById('bk-lune').notes!=='remote')throw new Error('applyRemoteWrite failed');
repo.applyRemoteDelete('bk-lune',{version:10,deletedAt:'2026-07-29T01:00:00.000Z'});
if(!repo.getById('bk-lune').deletedAt)throw new Error('applyRemoteDelete failed');
const bad=boot({[key]:JSON.stringify([{status:'pending'}])});let aborted=false;try{bad.context.CCMV_BOOKING_REPOSITORY.list();}catch(error){aborted=error.message==='BOOKING_SCHEMA_MIGRATION_ABORTED';}
if(!aborted)throw new Error('Invalid legacy record did not abort');
if(bad.localStorage.dump()[key]!==JSON.stringify([{status:'pending'}]))throw new Error('Aborted migration mutated source');
console.log('Stage C Booking schema migration: PASS');
