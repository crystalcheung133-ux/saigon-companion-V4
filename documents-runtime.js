/* documents-runtime.js — Engine 25.7.2 Shared Trip Documents v2
   Trip-wide utility attachments: upload, pin and contextual links. */
(function(root){'use strict';
const cfg=root.SYNC_CONFIG||{}, store=root.STORAGE?.local;
const KEY='travel_engine_documents_v1', table=cfg.tables?.documents||'trip_documents', bucket=cfg.storage?.documentsBucket||'trip-documents';
function participantConfig(){return (root.TRIP_CONFIG&&root.TRIP_CONFIG.participants)||{};}
function participantKeys(){const p=participantConfig(),ids=p.identities||{};return (Array.isArray(p.order)?p.order:Object.keys(ids)).filter(k=>ids[k]);}
function participantLabel(key){const p=participantConfig(),x=(p.identities||{})[key];return x&&(x.name||x.displayName)||key;}
function validFolder(value){const v=String(value||'all').toLowerCase();return v==='all'||participantKeys().includes(v)?v:'all';}
function folders(list){const used=new Set((list||read()).map(d=>validFolder(d.filedUnder)).filter(x=>x!=='all'));return participantKeys().filter(k=>used.has(k)).map(k=>({key:k,label:participantLabel(k)}));}
function currentUser(){try{return typeof root.getFriend==='function'?String(root.getFriend()||''):''}catch(e){return ''}}
function isStudio(){try{return !!(root.isAdminMode&&root.isAdminMode())}catch(e){return false}}
function canManage(d){return !!(d&&(isStudio()||(d.ownerKey&&d.ownerKey===currentUser())))}
function canLink(){return true}
function uuid(){return root.crypto?.randomUUID?root.crypto.randomUUID():'doc-'+Date.now()+'-'+Math.random().toString(36).slice(2)}
function readRaw(){let x=[];try{x=store?.readJSON?store.readJSON(KEY,[]):JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){};return Array.isArray(x)?x:[]}
function read(){let raw=readRaw();const tombstones=new Set(raw.filter(d=>d&&d.deleted).map(d=>d.id));let x=raw.filter(d=>d&&!d.deleted).map(d=>{if(!d.seeded&&!d.fileUrl&&!d.filePath)return Object.assign({},d,{uploadPending:true,legacyLocalOnly:true});return d});const ids=new Set(x.map(d=>d.id));return x.map(d=>Object.assign({},d,{filedUnder:validFolder(d.filedUnder)})).sort((a,b)=>(!!b.pinned-!!a.pinned)||String(b.updatedAt).localeCompare(String(a.updatedAt)))}
function write(x){if(store?.writeJSON)store.writeJSON(KEY,x);else localStorage.setItem(KEY,JSON.stringify(x));document.dispatchEvent(new CustomEvent('travelengine:documentschanged'))}
function configured(){return !!(cfg.enabled&&cfg.url&&cfg.anonKey&&root.SUPABASE?.isConfigured?.())}
async function cloudWrite(doc){
 if(!configured()||!navigator.onLine)return doc;
 await root.SUPABASE.getSession();const c=root.SUPABASE.getClient();
 const payload=Object.assign({},doc);delete payload.embeddedBase64;delete payload.localObjectUrl;delete payload.pendingBase64;
 const row={id:doc.id,trip_id:cfg.tripId,payload,created_at:doc.createdAt,updated_at:doc.updatedAt};
 const q=await c.from(table).upsert(row,{onConflict:'id'});if(q.error)throw q.error;return doc;
}
async function cloudUpload(doc,file){if(!configured()||!navigator.onLine)return doc;await root.SUPABASE.getSession();const c=root.SUPABASE.getClient();const safe=(file.name||'document').replace(/[^a-zA-Z0-9._-]+/g,'-');const path=`${cfg.tripId}/${doc.id}/${safe}`;const up=await c.storage.from(bucket).upload(path,file,{upsert:true,contentType:file.type||'application/octet-stream'});if(up.error)throw up.error;const pub=c.storage.from(bucket).getPublicUrl(path).data?.publicUrl;doc.fileUrl=pub||doc.fileUrl;doc.filePath=path;await cloudWrite(doc);return doc}

function fileToBase64(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||'').split(',')[1]||'');r.onerror=()=>reject(r.error||new Error('file-read-failed'));r.readAsDataURL(file)})}
function base64ToFile(d){if(!d.pendingBase64)return null;const raw=atob(d.pendingBase64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],d.fileName||'document',{type:d.mimeType||'application/octet-stream'})}
async function retryPending(list){
 if(!configured()||!navigator.onLine)return list;
 let changed=false;
 for(const d of list){
  if(!d.uploadPending||!d.pendingBase64)continue;
  try{const f=base64ToFile(d);await cloudUpload(d,f);delete d.uploadPending;delete d.uploadError;delete d.pendingBase64;d.updatedAt=new Date().toISOString();changed=true}catch(e){d.uploadError=e.message||String(e)}
 }
 if(changed)write(list);
 return list;
}

async function add(meta,file){const now=new Date().toISOString(),doc={id:uuid(),ownerKey:currentUser()||'unknown',title:meta.title||file?.name||'Document',category:meta.category||'Other',note:meta.note||'',pinned:!!meta.pinned,linkType:meta.linkType||'trip',linkId:meta.linkId||'',linkLabel:meta.linkLabel||'Trip-wide',filedUnder:validFolder(meta.filedUnder),fileName:file?.name||'',mimeType:file?.type||'',createdAt:now,updatedAt:now};if(file){doc.localObjectUrl=URL.createObjectURL(file);try{await cloudUpload(doc,file)}catch(e){doc.uploadPending=true;doc.uploadError=e.message||String(e);if(file.size<=2500000)try{doc.pendingBase64=await fileToBase64(file)}catch(_){} }}const list=read().filter(x=>x.id!==doc.id);list.push(doc);write(list);return doc}
async function sync(){
 let active=read();if(!configured()||!navigator.onLine)return active;
 try{
  active=await retryPending(active);await root.SUPABASE.getSession();const c=root.SUPABASE.getClient();
  const raw=readRaw(),localMap=new Map(raw.map(x=>[x.id,x]));
  // Retry locally-pending metadata and tombstones before pulling.
  for(const d of raw){if(d?.deleted||d?.metaSyncPending){try{await cloudWrite(d);delete d.metaSyncPending;delete d.metaSyncError}catch(e){}}}
  const q=await c.from(table).select('payload').eq('trip_id',cfg.tripId);if(q.error)throw q.error;
  const map=new Map(localMap);
  (q.data||[]).forEach(r=>{const d=r.payload;if(!d?.id)return;const l=map.get(d.id);if(!l||String(d.updatedAt||'')>=String(l.updatedAt||''))map.set(d.id,Object.assign({},l||{},d))});
  const merged=[...map.values()];write(merged);return read();
 }catch(e){return read()}
}

async function repair(id,file){
 const list=read(),i=list.findIndex(x=>x.id===id);if(i<0)throw new Error('document-not-found');
 const d=list[i];if(!canManage(d))throw new Error('document-permission-denied');d.fileName=file.name||d.fileName;d.mimeType=file.type||d.mimeType;d.localObjectUrl=URL.createObjectURL(file);d.updatedAt=new Date().toISOString();
 try{await cloudUpload(d,file);delete d.uploadPending;delete d.uploadError;delete d.pendingBase64}
 catch(e){d.uploadPending=true;d.uploadError=e.message||String(e);if(file.size<=2500000)try{d.pendingBase64=await fileToBase64(file)}catch(_){};list[i]=d;write(list);throw e}
 list[i]=d;write(list);return d;
}

async function update(id,patch){
 const list=read(),i=list.findIndex(x=>x.id===id);if(i<0)return null;
 const before=list[i];if(!canManage(before))return null;
 const safePatch=Object.assign({},patch);if(Object.prototype.hasOwnProperty.call(safePatch,'filedUnder'))safePatch.filedUnder=validFolder(safePatch.filedUnder);if(!canLink()){delete safePatch.linkType;delete safePatch.linkId;delete safePatch.linkLabel;}
 const next=Object.assign({},before,safePatch,{updatedAt:new Date().toISOString()});list[i]=next;write(list);
 if(configured()&&navigator.onLine){
  try{await cloudWrite(next);delete next.metaSyncPending;write(list)}
  catch(e){next.metaSyncPending=true;next.metaSyncError=e.message||String(e);write(list)}
 }
 return next;
}
async function remove(id){
 const list=read(),d=list.find(x=>x.id===id);if(!canManage(d))return false;const now=new Date().toISOString(),tombstone={id,deleted:true,createdAt:d?.createdAt||now,updatedAt:now};
 const raw=readRaw().filter(x=>x.id!==id);raw.push(tombstone);write(raw);
 if(configured()&&navigator.onLine)try{await cloudWrite(tombstone)}catch(e){}
 return true;
}
async function resetAll(){
 if(!configured()||!navigator.onLine)throw new Error('Connect to the internet before clearing Documents.');
 await root.SUPABASE.getSession();const c=root.SUPABASE.getClient();
 // Remove uploaded files first. Files are stored under tripId/documentId/fileName.
 const top=await c.storage.from(bucket).list(cfg.tripId,{limit:1000});if(top.error)throw top.error;
 const paths=[];
 for(const entry of (top.data||[])){
  if(!entry?.name)continue;
  const folder=`${cfg.tripId}/${entry.name}`;
  const nested=await c.storage.from(bucket).list(folder,{limit:1000});if(nested.error)throw nested.error;
  for(const f of (nested.data||[]))if(f?.name)paths.push(`${folder}/${f.name}`);
 }
 if(paths.length){const rm=await c.storage.from(bucket).remove(paths);if(rm.error)throw rm.error;}
 const del=await c.from(table).delete().eq('trip_id',cfg.tripId);if(del.error)throw del.error;
 write([]);
 return true;
}
function clearLocal(){write([]);}
root.TRIP_DOCUMENTS=Object.freeze({read,add,sync,repair,update,remove,resetAll,clearLocal,currentUser,isStudio,canManage,canLink,participantKeys,participantLabel,validFolder,folders});
function backgroundSync(){Promise.resolve(sync()).catch(()=>{});}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',backgroundSync,{once:true});
 else setTimeout(backgroundSync,0);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(backgroundSync,100)});
  root.addEventListener?.('online',()=>setTimeout(backgroundSync,50));
  root.setInterval?.(()=>{if(document.visibilityState==='visible')backgroundSync()},30000);
}
})(globalThis);
