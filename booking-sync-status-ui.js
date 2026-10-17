/* Booking sync status: global, read-only unless user explicitly retries. */
(function(root){
  'use strict';
  const css=`#bookingSyncGlobal{position:fixed;bottom:calc(12px + env(safe-area-inset-bottom,0px));left:12px;right:12px;max-width:420px;margin:auto;z-index:2147482000;background:#fff;color:#233047;border:1px solid #d8a04b;border-radius:14px;box-shadow:0 4px 24px #0003;padding:12px 14px;font:14px/1.4 system-ui,sans-serif}#bookingSyncGlobal[hidden]{display:none!important}#bookingSyncGlobal button{border:1px solid #9c7440;border-radius:8px;padding:5px 9px;background:#fff;color:#233047;cursor:pointer}#bookingSyncGlobal .booking-sync-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:7px}#bookingSyncGlobal .booking-sync-row span{overflow-wrap:anywhere}`;
  function boot(){
    if(!root.BOOKING_SYNC||!root.BOOKING_SYNC.getStatus)return;
    const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
    const panel=document.createElement('section');panel.id='bookingSyncGlobal';panel.hidden=true;panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');document.body.appendChild(panel);
    function render(){
      const api=root.BOOKING_SYNC;
      let s;
      try{s=api.getStatus();}catch(error){
        panel.hidden=false;panel.replaceChildren();
        const heading=document.createElement('strong');heading.textContent='Sync storage error — changes need attention';panel.appendChild(heading);
        const detail=document.createElement('p');detail.textContent='Cannot safely read the pending Booking changes. Do not clear site data or reset this device. Cloud sync is unverified; retry is disabled until storage is available.';panel.appendChild(detail);
        panel.dataset.syncError='true';
        console.error('Booking pending journal unavailable',error);
        return;
      }
      delete panel.dataset.syncError;
      const entries=Object.entries(s.pending||{});
      // A blank journal is not proof that every domain is cloud-synced.
      if(!entries.length){panel.hidden=true;panel.replaceChildren();return;}
      panel.hidden=false;panel.replaceChildren();
      const heading=document.createElement('strong');heading.textContent=`Booking cloud sync · ${entries.length} pending change${entries.length===1?'':'s'}`;panel.appendChild(heading);
      if(!s.enabled){const note=document.createElement('p');note.textContent='Cloud sync is not enabled. Changes are saved on this device only.';panel.appendChild(note);}
      entries.forEach(([id,entry])=>{
        let info;
        try{info=api.recordStatus(id);}catch(error){
          panel.hidden=false;panel.replaceChildren();
          const warning=document.createElement('strong');warning.textContent='Sync storage error — changes need attention';panel.appendChild(warning);
          const detail=document.createElement('p');detail.textContent='Pending changes could not be read safely. Do not clear site data. Cloud sync is unverified.';panel.appendChild(detail);
          panel.dataset.syncError='true';console.error('Booking sync status unavailable',error);return;
        }
        const row=document.createElement('div');row.className='booking-sync-row';
        const label=document.createElement('span');const state=info.state==='failed'?'Sync failed':info.state==='syncing'?'Syncing…':info.state==='local-only'?'Saved locally':'Sync pending';
        label.textContent=`${entry.operation==='delete'?'Deleted booking':'Booking'} ${id}: ${state}`;row.appendChild(label);
        if(s.enabled&&info.state!=='syncing'){
          const btn=document.createElement('button');btn.type='button';btn.textContent='Retry sync';btn.setAttribute('aria-label',`Retry cloud sync for booking ${id}`);
          btn.addEventListener('click',async()=>{btn.disabled=true;try{await api.retry(id);}catch(error){console.warn('Booking retry failed',error);}finally{render();}});row.appendChild(btn);
        }
        panel.appendChild(row);
      });
    }
    document.addEventListener('travelengine:bookingsyncstatus',render);
    root.addEventListener('storage',event=>{if(event.key==='travelengine_booking_pending_v1')render();});
    root.addEventListener('pageshow',render);
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(globalThis);
