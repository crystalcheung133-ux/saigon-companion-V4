/* guide-authority.js — Engine 25.7.2 Guide authority.
   Saved Guide overrides are local-first + auto-sync. Timeline Publish never owns Guide. */
(function(root){'use strict';
const SAVED='travel_engine_guide_overrides_v2',LEGACY='travel_engine_guide_overrides_v1',DRAFT='travel_engine_guide_draft_v1';
// Fail closed: an unreadable saved override/draft is NOT an empty user record.
// Never replace corrupt or inaccessible manual edits with defaults.
const read=k=>{
 let raw;
 try{raw=localStorage.getItem(k)}catch(e){throw new Error('Guide storage unavailable: '+k,{cause:e})}
 if(raw===null)return {};
 try{
  const value=JSON.parse(raw);
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid Guide storage structure');
  return value;
 }catch(e){throw new Error('Guide storage corrupt: '+k,{cause:e})}
};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v||{}));
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
function migrate(){if(localStorage.getItem(SAVED)!==null)return;const old=read(LEGACY),now=new Date().toISOString(),out={};Object.keys(old).forEach(k=>out[k]={patch:old[k],updatedAt:now});if(Object.keys(out).length)write(SAVED,out)}migrate();
function records(){return read(SAVED)}
function savedPatch(key){return records()[key]?.patch||{}}
// One-place compatibility filter: previously saved Mộc Hương Guide copy contained
// appointment details that belong exclusively to Booking. Do not delete saved
// records or touch Timeline Publish; filter only obsolete Guide presentation fields.
const SPA_COPY_FIELDS=['desc','sub','signature','highlights','worth','tips','notes','practical','bookingNote'];
const SPA_BOOKING_COPY=/(?:15[:.]30|17[:.]30|120[ -]?(?:minute|min|分鐘)|4 guests|4 人|四人|pending|待確認|預約|booking|whatsapp|mochuongwellness\.vn\/booking|\+84\s?90\s?975\s?5877)/i;
function spaGuidePatch(key,patch,base){
 if(key!=='moc-huong'||!base)return clone(patch||{});
 const out=clone(patch||{});
 SPA_COPY_FIELDS.forEach(field=>{
  if(!Object.prototype.hasOwnProperty.call(out,field))return;
  const val=out[field];
  if(Array.isArray(val)){
   if(!val.some(line=>SPA_BOOKING_COPY.test(String(line))))return;
   const kept=val.filter(line=>!SPA_BOOKING_COPY.test(String(line)));
   if(kept.length)out[field]=kept;
   else if(Object.prototype.hasOwnProperty.call(base,field))out[field]=clone(base[field]);
   else delete out[field];
  }else if(typeof val==='string'&&SPA_BOOKING_COPY.test(val)){
   if(Object.prototype.hasOwnProperty.call(base,field))out[field]=clone(base[field]);
   else delete out[field];
  }
 });
 return out;
}
function resolve(key,base){return Object.assign({},clone(base||{}),spaGuidePatch(key,savedPatch(key),base),spaGuidePatch(key,read(DRAFT)[key],base));}
function stage(key,patch){const d=read(DRAFT);d[key]=Object.assign({},d[key]||{},clone(patch||{}));write(DRAFT,d);root.markAdminDirty&&root.markAdminDirty('guide:'+key,{key});document.dispatchEvent(new CustomEvent('travelengine:guidechange',{detail:{key}}));return resolve(key,{});}
function save(key,patch){const s=records(),d=read(DRAFT),now=new Date().toISOString();const next={patch:Object.assign({},s[key]?.patch||{},clone(patch||{})),updatedAt:now};
 // Stage the durable cloud journal BEFORE mutating the saved Guide. A journal failure blocks Save.
 if(root.GUIDE_SYNC?.stageMutation)root.GUIDE_SYNC.stageMutation(key,next);
 s[key]=next;write(SAVED,s);delete d[key];write(DRAFT,d);document.dispatchEvent(new CustomEvent('travelengine:guidechange',{detail:{key}}));document.dispatchEvent(new CustomEvent('travelengine:guidesaved',{detail:{key,updatedAt:now}}));return resolve(key,{});}
function mergeRemote(rows){const s=records();let changed=false;(rows||[]).forEach(r=>{if(!r?.id)return;const l=s[r.id];if(!l||String(r.updatedAt||'')>String(l.updatedAt||'')){s[r.id]={patch:clone(r.patch||{}),updatedAt:r.updatedAt||new Date().toISOString()};changed=true}});if(changed){write(SAVED,s);document.dispatchEvent(new CustomEvent('travelengine:guidechange',{detail:{remote:true}}))}return changed;}
function commit(){const d=read(DRAFT);Object.keys(d).forEach(k=>save(k,d[k]));write(DRAFT,{});}
function discard(){write(DRAFT,{});document.dispatchEvent(new CustomEvent('travelengine:guidechange'));}
function mergedPlaces(base){const out=clone(base||{});Object.keys(out).forEach(k=>out[k]=Object.assign({},out[k],spaGuidePatch(k,savedPatch(k),out[k])));return out;}
root.GUIDE_AUTHORITY=Object.freeze({resolve,stage,save,commit,discard,mergedPlaces,records,mergeRemote});
})(globalThis);
