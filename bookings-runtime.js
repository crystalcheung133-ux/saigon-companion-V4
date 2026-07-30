/* Collaborative booking workspace. Records link to stable Timeline event ids for navigation. */
(function(root){
  'use strict';
  const REPOSITORY=root.CCMV_BOOKING_REPOSITORY;
  if(!REPOSITORY)throw new Error('CCMV_BOOKING_REPOSITORY must load before bookings-runtime.js');
  const CATEGORIES=[['Restaurant','🍽 Restaurants'],['Spa','💆 Spa'],['Activity','🎫 Activities'],['Transport','🚐 Transport']];
  let activeCategory='Restaurant';
  function sortRows(rows){
    const rank={pending:0,confirmed:1,cancelled:2};
    return [...rows].sort((a,b)=>{
      const status=(rank[a.status]??9)-(rank[b.status]??9);if(status)return status;
      const day=(Number(a.day)||999)-(Number(b.day)||999);if(day)return day;
      const date=String(a.date||'').localeCompare(String(b.date||''));if(date)return date;
      const time=String(a.time||'').localeCompare(String(b.time||''));if(time)return time;
      return String(a.title||'').localeCompare(String(b.title||''));
    });
  }
  function load(){return sortRows(REPOSITORY.list());}
  function label(status){return status==='confirmed'?'✓ Confirmed':status==='cancelled'?'× Cancelled':'• Pending';}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function user(){try{return getFriend();}catch(e){return STORAGE.local.get(STORAGE_CONFIG.keys.friend,'crystal');}}
  function canEditBookings(){return user()==='crystal'&&root.VN_ADMIN?.readMode?.()===true;}
  function currentPartyId(){const alias=user();const parties=root.TRIP_CONFIG?.parties?.identities||{};for(const entry of Object.values(parties)){if((entry.legacyAliases||[]).includes(alias))return entry.partyId;}return `party-${alias}`;}
  function person(k){return (root.VN_PRESENTATION?.friends||{})[k]||k||'—';}
  function formatDate(v){if(!v)return'Date pending';const d=new Date(v+'T12:00:00');return new Intl.DateTimeFormat('en-AU',{weekday:'short',day:'numeric',month:'short'}).format(d);}
  function summary(rows){const c=rows.filter(x=>x.status==='confirmed').length,p=rows.filter(x=>x.status==='pending').length,u=rows.filter(x=>x.status==='cancelled').length;return `${c} confirmed · ${p} pending${u?` · ${u} unavailable`:''}`;}
  function categoryTabs(rows){return `<div class="booking-tabs" role="tablist">${CATEGORIES.map(([key,title])=>{const count=rows.filter(x=>x.category===key).length;return `<button type="button" class="booking-tab ${activeCategory===key?'active':''}" data-booking-category="${key}">${title}<small>${count}</small></button>`;}).join('')}</div>`;}
  function render(){
    const host=document.getElementById('bookingList');if(!host)return;
    const rows=load(),sum=document.getElementById('bookingSummary');if(sum)sum.textContent=summary(rows);
    host.classList.toggle('booking-list-spa',activeCategory==='Spa');
    host.innerHTML=categoryTabs(rows)+`<section class="booking-group booking-group-active${activeCategory==='Spa'?' booking-group-spa':''}">${rows.filter(x=>x.category===activeCategory).map(card).join('')}</section>`;
    host.querySelectorAll('[data-booking-category]').forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.bookingCategory;render();}));
  }
  function bookingInfoLink(kind,value){
    const clean=String(value||'').trim();
    if(!clean)return '—';
    if(kind==='url'){const href=/^https?:\/\//i.test(clean)?clean:`https://${clean}`;return `<a class="booking-inline-link" href="${esc(href)}" target="_blank" rel="noopener">${esc(clean)}</a>`;}
    if(kind==='email'||/@/.test(clean))return `<a class="booking-inline-link" href="mailto:${esc(clean)}">${esc(clean)}</a>`;
    if(clean.replace(/[^0-9]/g,''))return `<span class="booking-copy-value">${esc(clean)} <button class="booking-copy-control" type="button" data-copy-booking="${esc(clean)}">Copy</button></span>`;
    return esc(clean);
  }
  function card(b){
    const meta=[formatDate(b.date),b.time].filter(Boolean).join(' · ');
    const dayLink=b.eventId&&b.day?`<a class="booking-day-button" href="day.html?day=${encodeURIComponent(b.day)}#${encodeURIComponent(b.eventId)}">DAY ${esc(b.day)}</a>`:'';
    return `<article class="booking-card ${b.status}"><div class="booking-card-row"><button type="button" class="booking-card-main" onclick="openBookingEditor('${esc(b.bookingId)}')"><span>${b.day?`<small class="booking-day-label">DAY ${esc(b.day)}</small>`:''}<strong>${esc(b.title)}</strong><small>${esc(meta)}</small></span><span class="booking-status ${b.status}">${label(b.status)}</span></button>${dayLink}</div></article>`;
  }
  function hasValue(v){return String(v??'').trim()!==''&&String(v??'').trim()!=='—';}
  function readonlyField(labelText,value,wide,allowHtml,optional=false){
    if(optional&&!hasValue(value))return '';
    const shown=allowHtml?value:esc(String(value??'').trim());
    if(optional&&!hasValue(shown))return '';
    return `<div class="booking-readonly-field${wide?' booking-readonly-wide':''}"><small>${esc(labelText)}</small><strong>${shown}</strong></div>`;
  }
  function bindCopyControls(host){host.querySelectorAll('[data-copy-booking]').forEach(btn=>btn.addEventListener('click',()=>copyBookingValue(btn.dataset.copyBooking,btn)));}
  function copyBookingValue(value,button){
    const done=()=>{const old=button.textContent;button.textContent='Copied';setTimeout(()=>{button.textContent=old;},1200);};
    if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(done).catch(()=>window.prompt('Copy contact',value));
    else window.prompt('Copy contact',value);
  }
  root.toggleDepositAmount=function(input){const wrap=input.closest('form')?.querySelector('[data-deposit-amount]');if(wrap)wrap.hidden=!input.checked;};
  root.openBookingEditor=function(id){
    const b=load().find(x=>x.bookingId===id);if(!b)return;
    const modal=document.getElementById('bookingModal'),host=document.getElementById('bookingEditor');
    host.dataset.bookingEditor=id;
    modal?.classList.toggle('booking-modal-spa',b.category==='Spa');
    const contactInfo=b.bookingContact?bookingInfoLink('phone',b.bookingContact):'';
    const onlineInfo=b.bookingUrl?bookingInfoLink('url',b.bookingUrl):'';
    const guideInfo=b.placeId?`<a class="booking-header-action" href="place.html?id=${encodeURIComponent(b.placeId)}">Guide card</a>`:'';
    const dayInfo=b.eventId&&b.day?`<a class="booking-header-action" href="day.html?day=${encodeURIComponent(b.day)}#${encodeURIComponent(b.eventId)}">Day ${esc(b.day)} timeline</a>`:'';
    const headerActions=(guideInfo||dayInfo)?`<div class="booking-header-actions">${guideInfo}${dayInfo}</div>`:'';
    const fields=[
      readonlyField('Booking status',label(b.status)),
      readonlyField('Date',b.date?formatDate(b.date):'',false,false,true),
      readonlyField('Time',b.time,false,false,true),
      readonlyField('Booking name',b.bookingName,false,false,true),
      b.depositPaid?readonlyField('Deposit',b.depositAmount?`Paid · ${b.depositAmount}`:'Paid'): '',
      readonlyField('Booking option',b.bookingMethod,false,false,true),
      readonlyField('Contact details',contactInfo,true,true,true),
      readonlyField('Hotline / second contact',b.secondaryContact?bookingInfoLink('phone',b.secondaryContact):'',true,true,true),
      readonlyField('Online booking / website',onlineInfo,true,true,true),
      readonlyField('Notes',b.notes,true,false,true)
    ].filter(Boolean).join('');
    host.innerHTML=`<div class="booking-editor-head"><p class="kicker">Booking details</p><h2>${esc(b.title)}</h2>${headerActions}</div><div class="booking-readonly-grid">${fields}</div><div class="booking-view-actions">${canEditBookings()?`<button class="btn booking-edit-btn" type="button" onclick="editBookingEditor('${esc(id)}')">Edit booking</button>`:`<p class="booking-independent-note">Read only</p>`}</div>`;
    bindCopyControls(host);modal?.classList.add('show');
  };
  function editableSnapshot(form){
    const f=new FormData(form),depositPaid=f.get('depositPaid')==='on';
    return JSON.stringify({
      status:String(f.get('status')||'pending'),
      date:String(f.get('date')||''),
      time:String(f.get('time')||''),
      bookingName:String(f.get('bookingName')||''),
      depositPaid,
      depositAmount:depositPaid?String(f.get('depositAmount')||''):'',
      bookingMethod:String(f.get('bookingMethod')||''),
      bookingContact:String(f.get('bookingContact')||''),
      bookingUrl:String(f.get('bookingUrl')||''),
      notes:String(f.get('notes')||'')
    });
  }
  function bindDirtyCheck(form){
    const button=form.querySelector('[type="submit"]');
    form.dataset.initialSnapshot=editableSnapshot(form);
    const refresh=()=>{
      if(!button)return;
      const dirty=editableSnapshot(form)!==form.dataset.initialSnapshot;
      button.disabled=!dirty;
      button.textContent=dirty?'Save booking':'No changes';
      button.classList.toggle('booking-save-dirty',dirty);
    };
    form.addEventListener('input',refresh);
    form.addEventListener('change',refresh);
    refresh();
  }
  root.editBookingEditor=function(id){
    if(!canEditBookings()){root.openBookingEditor(id);return;}
    const b=load().find(x=>x.bookingId===id);if(!b)return;
    const host=document.getElementById('bookingEditor');
    host.dataset.bookingEditor=id;
    host.innerHTML=`<div class="booking-editor-head"><p class="kicker">Edit booking</p><h2>${esc(b.title)}</h2></div><form data-booking-edit-form onsubmit="saveBookingEditor(event,'${esc(id)}')"><label>Booking status<select name="status"><option value="pending" ${b.status==='pending'?'selected':''}>Pending</option><option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option><option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled / unavailable</option></select></label><div class="booking-two"><label>Date<input name="date" type="date" value="${esc(b.date)}"></label><label>Time<input name="time" type="time" value="${esc(b.time?.slice(0,5))}"></label></div><label>Booking name<input name="bookingName" value="${esc(b.bookingName)}"></label><label class="booking-deposit-check"><input name="depositPaid" type="checkbox" ${b.depositPaid?'checked':''} onchange="toggleDepositAmount(this)"> Deposit paid</label><label data-deposit-amount ${b.depositPaid?'':'hidden'}>Deposit amount<input name="depositAmount" inputmode="decimal" type="number" min="0" step="any" value="${esc(b.depositAmount)}"></label><label>Booking option<input name="bookingMethod" value="${esc(b.bookingMethod||'')}"></label><label>WhatsApp / phone<input name="bookingContact" value="${esc(b.bookingContact||'')}"></label><label>Online booking link<input name="bookingUrl" type="url" value="${esc(b.bookingUrl||'')}"></label><label>Notes<textarea name="notes">${esc(b.notes)}</textarea></label><div class="booking-actions"><button class="btn booking-save-btn" type="submit" disabled>No changes</button><button class="mini-btn" type="button" onclick="openBookingEditor('${esc(id)}')">Cancel</button></div></form>`;
    bindDirtyCheck(host.querySelector('[data-booking-edit-form]'));
  };
  root.closeBookingModal=function(){const modal=document.getElementById('bookingModal');modal?.classList.remove('show','booking-modal-spa');document.getElementById('tripModal')?.classList.remove('show');};
  root.saveBookingEditor=async function(event,id){
    event.preventDefault();
    if(!canEditBookings()){window.alert('Enter Trip Studio as Crystal to edit bookings.');return;}
    const current=REPOSITORY.getById(id);if(!current)return;
    const form=event.currentTarget,button=form.querySelector('[type="submit"]'),f=new FormData(form),depositPaid=f.get('depositPaid')==='on';
    if(editableSnapshot(form)===form.dataset.initialSnapshot)return;
    const draft={...current,status:String(f.get('status')||'pending'),date:String(f.get('date')||''),time:String(f.get('time')||''),bookingName:String(f.get('bookingName')||''),depositPaid,depositAmount:depositPaid?String(f.get('depositAmount')||''):'',bookingMethod:String(f.get('bookingMethod')||''),bookingContact:String(f.get('bookingContact')||''),bookingUrl:String(f.get('bookingUrl')||''),notes:String(f.get('notes')||''),updatedAt:new Date().toISOString(),updatedByPartyId:'party-crystal'};
    try{
      if(button){button.disabled=true;button.textContent='Saving…';button.classList.remove('booking-save-dirty','booking-save-success');}
      const sync=root.CCMV_SIMPLE_BOOKING_SYNC;if(!sync)throw new Error('BOOKING_SYNC_NOT_LOADED');
      const saved=await sync.push(draft);
      REPOSITORY.applyRemoteWrite(saved);
      form.dataset.initialSnapshot=editableSnapshot(form);
      render();
      if(button){
        button.disabled=true;
        button.textContent='✓ Saved';
        button.classList.add('booking-save-success');
        setTimeout(()=>{if(document.body.contains(button)){button.textContent='No changes';button.classList.remove('booking-save-success');}},1500);
      }
    }catch(error){
      console.error('[Booking Save]',error);
      if(button){button.disabled=false;button.textContent='Save booking';button.classList.add('booking-save-dirty');}
      window.alert(`Booking was not saved: ${error?.message||error}`);
    }
  };
  root.addEventListener('ccmv:studio-mode-changed',()=>{render();const openId=document.querySelector('[data-booking-editor]')?.dataset?.bookingEditor;if(openId)root.openBookingEditor(openId);});
  document.addEventListener('DOMContentLoaded',render);REPOSITORY.subscribe(render);
})(globalThis);
