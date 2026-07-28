/* booking-sync-runtime.js - trusted Party Selector first sync, realtime and offline queue (VN Stage 1C). */
(function(root){
  'use strict';
  const repo=root.CCMV_BOOKING_REPOSITORY,provider=root.CCMV_SUPABASE_BOOKING_PROVIDER,tripId=repo?.tripId;
  if(!repo||!provider)return;
  const QUEUE_KEY=`ccmv:${tripId}:booking-sync-queue:v1`,META_KEY=`ccmv:${tripId}:booking-sync-meta:v1`,EVENT='ccmv:booking-sync-status';
  let state={configured:provider.configured(),status:'local-only',message:'Saved on this device',queued:0,lastSyncedAt:'',partyId:'',partyName:''};
  let syncing=false,unsubscribeRealtime=()=>{};
  const read=(k,d)=>root.STORAGE.local.readJSON(k,d),write=(k,v)=>root.STORAGE.local.writeJSON(k,v);
  function currentParty(){
    const legacy=(typeof root.getFriend==='function'?root.getFriend():root.STORAGE?.local?.get(root.STORAGE_CONFIG?.keys?.friend,'crystal'))||'crystal';
    const identities=root.TRIP_CONFIG?.parties?.identities||{};
    for(const p of Object.values(identities)){if(p.partyId===legacy||(p.legacyAliases||[]).includes(legacy))return p;}
    return identities[root.TRIP_CONFIG?.parties?.defaultPartyId]||{partyId:`party-${legacy}`,displayName:legacy};
  }
  function refreshParty(){const p=currentParty();state.partyId=p.partyId;state.partyName=p.displayName||p.partyId;}
  function queue(){const v=read(QUEUE_KEY,[]);return Array.isArray(v)?v:[];}
  function saveQueue(v){write(QUEUE_KEY,v);state.queued=v.length;emit();}
  function emit(){refreshParty();root.dispatchEvent?.(new CustomEvent(EVENT,{detail:getStatus()}));renderStatus();}
  function getStatus(){return Object.freeze({...state});}
  function enqueue(record,baseVersion){const q=queue().filter(x=>x.record.bookingId!==record.bookingId);q.push({mutationId:`bm_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,record,baseVersion:Number(baseVersion||0),partyId:record.updatedByPartyId||currentParty().partyId,createdAt:new Date().toISOString(),retryCount:0});saveQueue(q);if(navigator.onLine)flush();}
  async function processQueue(){
    let q=queue(),remaining=[];
    for(const item of q){
      try{const remote=await provider.apply(item.record,item.baseVersion,item.partyId||item.record.updatedByPartyId||currentParty().partyId);if(remote)repo.applyRemote(remote);}
      catch(e){const msg=String(e.message||e);if(/BOOKING_VERSION_CONFLICT|version conflict|409/i.test(msg)){try{const rows=await provider.list();const latest=rows.find(r=>r.bookingId===item.record.bookingId);if(latest)repo.applyRemote(latest);state.message='A newer booking change was loaded';}catch(_){remaining.push({...item,retryCount:item.retryCount+1,lastError:msg});}}else remaining.push({...item,retryCount:item.retryCount+1,lastError:msg});}
    }
    saveQueue(remaining);return remaining;
  }
  async function firstSync(){
    if(syncing||!state.configured||!navigator.onLine)return;
    syncing=true;state.status='syncing';state.message='Syncing bookings…';emit();
    try{
      const remote=await provider.list(),local=repo.list({includeDeleted:true});
      if(remote.length===0){
        const q=queue(),existing=new Set(q.map(x=>x.record.bookingId));
        local.forEach(r=>{if(!existing.has(r.bookingId))q.push({mutationId:`bm_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,record:r,baseVersion:0,partyId:r.updatedByPartyId||currentParty().partyId,createdAt:new Date().toISOString(),retryCount:0});});
        saveQueue(q);
      }else{
        const remoteMap=new Map(remote.map(r=>[r.bookingId,r]));
        for(const r of remote)repo.applyRemote(r);
        const q=queue(),queuedIds=new Set(q.map(x=>x.record.bookingId));
        for(const l of local){const r=remoteMap.get(l.bookingId);if((!r||Number(l.version)>Number(r.version))&&!queuedIds.has(l.bookingId))q.push({mutationId:`bm_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,record:l,baseVersion:r?Number(r.version):0,partyId:l.updatedByPartyId||currentParty().partyId,createdAt:new Date().toISOString(),retryCount:0});}
        saveQueue(q);
      }
      const remaining=await processQueue();subscribeRealtime();state.lastSyncedAt=new Date().toISOString();write(META_KEY,{lastSyncedAt:state.lastSyncedAt});state.status=remaining.length?'error':'synced';state.message=remaining.length?'Some changes are waiting to sync':'All booking changes synced';
    }catch(e){state.status='error';state.message=`Sync paused · ${String(e.message||e)}`;}finally{syncing=false;emit();}
  }
  async function flush(){if(syncing||!state.configured||!navigator.onLine)return;syncing=true;state.status='syncing';state.message='Syncing bookings…';emit();try{const remaining=await processQueue();state.lastSyncedAt=new Date().toISOString();write(META_KEY,{lastSyncedAt:state.lastSyncedAt});state.status=remaining.length?'error':'synced';state.message=remaining.length?'Some changes are waiting to sync':'All booking changes synced';}catch(e){state.status='error';state.message=`Sync paused · ${String(e.message||e)}`;}finally{syncing=false;emit();}}
  function subscribeRealtime(){unsubscribeRealtime();unsubscribeRealtime=provider.subscribe(record=>{if(Number(record.tripGeneration||1)!==Number(repo.tripGeneration))return;repo.applyRemote(record);state.lastSyncedAt=new Date().toISOString();state.message='Booking update received';state.status='synced';emit();});}
  function openPanel(){document.getElementById('bookingSyncModal')?.classList.add('show');renderPanel();}
  function closePanel(){document.getElementById('bookingSyncModal')?.classList.remove('show');}
  function renderStatus(){const el=document.getElementById('bookingSyncStatus');if(!el)return;el.textContent=state.status==='synced'?'☁ Synced':state.status==='syncing'?'↻ Syncing':state.status==='offline'?'☁ Offline':'☁ Sync';el.dataset.state=state.status;}
  function renderPanel(){const host=document.getElementById('bookingSyncContent');if(!host)return;refreshParty();if(!state.configured){host.innerHTML='<h2>Booking sync</h2><p>Supabase is not configured.</p>';return;}host.innerHTML=`<p class="kicker">BOOKING SYNC</p><h2>${state.status==='synced'?'Connected':'Shared trip sync'}</h2><p class="lead">${state.message}</p><div class="booking-sync-readout"><strong>${state.partyName}</strong><span>${state.partyId}</span><span>${state.queued} queued change${state.queued===1?'':'s'}</span>${state.lastSyncedAt?`<span>Last sync · ${new Date(state.lastSyncedAt).toLocaleString()}</span>`:''}</div><p class="timestamp">Identity follows the existing Friend selector. No email or PIN is required for this private trip.</p><div class="booking-sync-actions"><button class="btn" type="button" id="bookingSyncNow">Sync now</button></div>`;host.querySelector('#bookingSyncNow').onclick=()=>firstSync().then(renderPanel);}
  root.addEventListener('ccmv:bookings-changed',e=>{const d=e.detail||{};if(d.source==='local'&&d.record)enqueue(d.record,d.baseVersion);});
  root.addEventListener('ccmv:party-changed',()=>{emit();renderPanel();});
  root.addEventListener('online',()=>firstSync());root.addEventListener('offline',()=>{state.status='offline';state.message='Offline · changes will sync later';emit();});
  root.addEventListener('click',event=>{if(event.target&&event.target.id==='bookingSyncModal')closePanel();});root.addEventListener('keydown',event=>{if(event.key==='Escape')closePanel();});
  root.openBookingSync=openPanel;root.closeBookingSync=closePanel;root.CCMV_BOOKING_SYNC=Object.freeze({getStatus,firstSync,flush,openPanel,closePanel});
  document.addEventListener('DOMContentLoaded',()=>{refreshParty();state.queued=queue().length;state.lastSyncedAt=read(META_KEY,{}).lastSyncedAt||'';renderStatus();if(state.configured&&navigator.onLine)firstSync();});
})(globalThis);
