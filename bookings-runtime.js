/* Collaborative booking workspace. Records link to stable Timeline event ids for navigation. */
(function(root){
  'use strict';
  const REPOSITORY=root.CCMV_BOOKING_REPOSITORY;
  if(!REPOSITORY)throw new Error('CCMV_BOOKING_REPOSITORY must load before bookings-runtime.js');
  const CATEGORIES=[['Restaurant','🍽 Restaurants'],['Spa','💆 Spa'],['Activity','🎫 Activities'],['Transport','🚐 Transport']];
  let activeCategory='Restaurant';
  function load(){return REPOSITORY.list();}
  function label(status){return status==='confirmed'?'✓ Confirmed':status==='cancelled'?'Cancelled / unavailable':'Pending';}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function user(){try{return getFriend();}catch(e){return STORAGE.local.get(STORAGE_CONFIG.keys.friend,'crystal');}}
  function currentPartyId(){const synced=root.CCMV_BOOKING_SYNC?.getStatus?.().membership?.party_id;if(synced)return synced;const alias=user();const parties=root.TRIP_CONFIG?.parties?.identities||{};for(const entry of Object.values(parties)){if((entry.legacyAliases||[]).includes(alias))return entry.partyId;}return `party-${alias}`;}
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
    return `<article class="booking-card ${b.status}"><div class="booking-card-row"><button type="button" class="booking-card-main" onclick="openBookingEditor('${esc(b.bookingId)}')"><span>${b.day?`<small class="booking-day-label">DAY ${esc(b.day)}</small>`:''}<strong>${esc(b.title)}</strong><small>${esc(meta)}</small></span><span class="booking-status ${b.status}">${label(b.status)}</span></button>${dayLink}</div>${b.updatedByPartyId?`<p class="booking-updated">Updated by ${esc(person(String(b.updatedByPartyId).replace(/^party-/,'')))}${b.updatedAt?` · ${new Date(b.updatedAt).toLocaleString()}`:''}</p>`:''}</article>`;
  }
  function valueOrDash(v){return String(v||'').trim()||'—';}
  function readonlyField(labelText,value,wide,allowHtml){const shown=allowHtml?value:esc(valueOrDash(value));return `<div class="booking-readonly-field${wide?' booking-readonly-wide':''}"><small>${esc(labelText)}</small><strong>${shown||'—'}</strong></div>`;}
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
    modal?.classList.toggle('booking-modal-spa',b.category==='Spa');
    const deposit=b.depositPaid?(b.depositAmount?`Paid · ${b.depositAmount}`:'Paid'):'Not paid';
    const contactInfo=bookingInfoLink('phone',b.bookingContact),onlineInfo=bookingInfoLink('url',b.bookingUrl);
    const secondaryInfo=b.secondaryContact?readonlyField('Hotline / second contact',bookingInfoLink('phone',b.secondaryContact),true,true):'';
    const guideInfo=b.placeId?`<a class="booking-header-action" href="place.html?id=${encodeURIComponent(b.placeId)}">Guide card</a>`:'';
    const dayInfo=b.eventId&&b.day?`<a class="booking-header-action" href="day.html?day=${encodeURIComponent(b.day)}#${encodeURIComponent(b.eventId)}">Day ${esc(b.day)} timeline</a>`:'';
    const headerActions=(guideInfo||dayInfo)?`<div class="booking-header-actions">${guideInfo}${dayInfo}</div>`:'<p class="booking-independent-note">Independent booking record</p>';
    host.innerHTML=`<div class="booking-editor-head"><p class="kicker">Shared booking</p><h2>${esc(b.title)}</h2>${headerActions}</div><div class="booking-readonly-grid">${readonlyField('Booking status',label(b.status))}${readonlyField('Date',formatDate(b.date))}${readonlyField('Time',b.time)}${readonlyField('Booking name',b.bookingName)}${readonlyField('Deposit',deposit)}${readonlyField('Booking option',b.bookingMethod)}${readonlyField('Contact details',contactInfo,true,true)}${secondaryInfo}${readonlyField('Online booking / website',onlineInfo,true,true)}${readonlyField('Notes',b.notes,true)}</div><div class="booking-view-actions"><button class="btn booking-edit-btn" type="button" onclick="editBookingEditor('${esc(id)}')">Edit booking</button></div>`;
    bindCopyControls(host);modal?.classList.add('show');
  };
  root.editBookingEditor=function(id){
    const b=load().find(x=>x.bookingId===id);if(!b)return;
    const host=document.getElementById('bookingEditor');
    host.innerHTML=`<div class="booking-editor-head"><p class="kicker">Edit booking</p><h2>${esc(b.title)}</h2></div><form onsubmit="saveBookingEditor(event,'${esc(id)}')"><label>Booking status<select name="status"><option value="pending" ${b.status==='pending'?'selected':''}>Pending</option><option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option><option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled / unavailable</option></select></label><div class="booking-two"><label>Date<input name="date" type="date" value="${esc(b.date)}"></label><label>Time<input name="time" type="time" value="${esc(b.time?.slice(0,5))}"></label></div><label>Booking name<input name="bookingName" value="${esc(b.bookingName)}"></label><label class="booking-deposit-check"><input name="depositPaid" type="checkbox" ${b.depositPaid?'checked':''} onchange="toggleDepositAmount(this)"> Deposit paid</label><label data-deposit-amount ${b.depositPaid?'':'hidden'}>Deposit amount<input name="depositAmount" inputmode="decimal" type="number" min="0" step="any" value="${esc(b.depositAmount)}"></label><label>Booking option<input name="bookingMethod" value="${esc(b.bookingMethod||'')}"></label><label>WhatsApp / phone<input name="bookingContact" value="${esc(b.bookingContact||'')}"></label><label>Online booking link<input name="bookingUrl" type="url" value="${esc(b.bookingUrl||'')}"></label><label>Notes<textarea name="notes">${esc(b.notes)}</textarea></label><div class="booking-actions"><button class="btn" type="submit">Save booking</button><button class="mini-btn" type="button" onclick="openBookingEditor('${esc(id)}')">Cancel</button></div></form>`;
  };
  root.closeBookingModal=function(){const modal=document.getElementById('bookingModal');modal?.classList.remove('show','booking-modal-spa');document.getElementById('tripModal')?.classList.remove('show');};
  root.saveBookingEditor=function(event,id){
    event.preventDefault();const b=REPOSITORY.getById(id);if(!b)return;const f=new FormData(event.currentTarget);
    const depositPaid=f.get('depositPaid')==='on';
    REPOSITORY.update(id,{status:String(f.get('status')||'pending'),date:String(f.get('date')||''),time:String(f.get('time')||''),bookingName:String(f.get('bookingName')||''),depositPaid,depositAmount:depositPaid?String(f.get('depositAmount')||''):'',bookingMethod:String(f.get('bookingMethod')||''),bookingContact:String(f.get('bookingContact')||''),bookingUrl:String(f.get('bookingUrl')||''),notes:String(f.get('notes')||'')},{expectedVersion:b.version,updatedByPartyId:currentPartyId()});
    render();openBookingEditor(id);
  };
  document.addEventListener('DOMContentLoaded',render);REPOSITORY.subscribe(render);
})(globalThis);
