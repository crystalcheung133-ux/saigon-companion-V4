/* Collaborative booking workspace. Records link to stable Timeline event ids for navigation. */
(function(root){
  'use strict';
  const KEY=(root.STORAGE_CONFIG&&STORAGE_CONFIG.keys.bookings)||'ccmv_vietnam_bookings_v1';
  const DEFAULTS=[
    {id:'bk-omakase-tiger',eventId:'omakase-tiger',day:1,placeId:'omakase-tiger',category:'Restaurant',title:'Omakase Tiger',date:'2026-10-30',time:'17:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Reservation time: 17:30. Exact reservation URL should be manually verified before payment.',bookingMethod:'WhatsApp / Zalo and official website',bookingContact:'+84 93 201 4124',bookingUrl:'https://omakasetiger.com/en',updatedBy:'',updatedAt:''},
    {id:'bk-nha-suga',eventId:'nha-suga',day:1,placeId:'nha-suga',category:'Spa',title:'Spa Nhà Suga Premium Korea Headspa — Nguyễn Huệ',date:'2026-10-30',time:'14:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Address: 8th Floor, 42 Nguyễn Huệ, Bến Nghé, District 1, Ho Chi Minh City\nHours: daily 09:00–20:00\nConfirm treatment duration and arrival time.',bookingMethod:'WhatsApp / Zalo',bookingContact:'+84 903 888 369',bookingUrl:'',updatedBy:'',updatedAt:''},
    {id:'bk-lune',eventId:'lune',day:2,placeId:'lune',category:'Restaurant',title:'LÜNE Restaurant & Bar',date:'2026-10-31',time:'19:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Phone: +84 28 7777 2022\nEmail: contact-lune@hdnt.vn\nConfirm dinner reservation for 4 guests.',bookingMethod:'Official online reservation',bookingContact:'+84 28 7777 2022',bookingUrl:'https://www.adrienguenzi.com/reservations',updatedBy:'',updatedAt:''},
    {id:'bk-cooking',eventId:'cooking',day:2,placeId:'cooking',category:'Activity',title:'Saigon Cooking Class',date:'2026-10-31',time:'10:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Time: 10:00–13:00\nAddress: 80/1 Nguyễn Trãi, Bến Thành, Hồ Chí Minh 770000, Vietnam\nOnline platform: Klook / booking platform to confirm.',bookingMethod:'Online platform',bookingContact:'',bookingUrl:'',updatedBy:'',updatedAt:''},
    {id:'bk-moc-kim',eventId:'moc-kim',day:2,placeId:'moc-kim',category:'Spa',title:'Mộc Kim Spa & Beauty — Bến Thành',date:'2026-10-31',time:'',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Branch: 143 Lê Thị Hồng Gấm\nWhatsApp: +84 934 193 758\nHotline: +84 968 459 618',bookingMethod:'Official website / form and WhatsApp',bookingContact:'+84 934 193 758',secondaryContact:'+84 968 459 618',bookingUrl:'https://duongsinhspa.vn/en/all-services/',updatedBy:'',updatedAt:''},
    {id:'bk-little-bear',eventId:'little-bear',day:3,placeId:'little-bear',category:'Restaurant',title:'Little Bear',date:'2026-11-01',time:'18:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Restaurant number retained from the verified source record.',bookingMethod:'WhatsApp or Zalo',bookingContact:'+84 862 512 086',bookingUrl:'',updatedBy:'',updatedAt:''},
    {id:'bk-moc-huong',eventId:'moc-huong',day:3,placeId:'moc-huong',category:'Spa',title:'Mộc Hương Wellness — Thảo Điền',date:'2026-11-01',time:'15:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Official booking system. Book at least 36 hours ahead.',bookingMethod:'Online booking / Hotline / Zalo / WhatsApp',bookingContact:'+84 90 975 5877',bookingUrl:'https://mochuongwellness.vn/vi/booking/',updatedBy:'',updatedAt:''},
    {id:'bk-pizza4ps',eventId:'pizza4ps',day:4,placeId:'pizza4ps',category:'Restaurant',title:'Pizza 4P’s Hai Bà Trưng',date:'2026-11-02',time:'11:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Branch: Hai Bà Trưng. Reserve lunch for 4 guests.',bookingMethod:'Official TableCheck reservation',bookingContact:'',bookingUrl:'https://www.tablecheck.com/vi/pizza-4ps-hcm-hai-ba-trung/reserve/landing',updatedBy:'',updatedAt:''},
    {id:'bk-quince',eventId:'quince',day:4,placeId:'quince',category:'Restaurant',title:'Quince Saigon',date:'2026-11-02',time:'19:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Phone: +84 28 3821 8661\nEmail: eat@quincesaigon.com\nConfirm Monday dinner service.',bookingMethod:'Official Book a Table page',bookingContact:'+84 28 3821 8661',bookingUrl:'https://www.quincesaigon.com/reservations',updatedBy:'',updatedAt:''},
    {id:'bk-tinh-thuc',eventId:'tinh-thuc',day:4,placeId:'tinh-thuc',category:'Spa',title:'Tỉnh Thức Spa',date:'2026-11-02',time:'15:15',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm Monday appointment and treatment.',bookingMethod:'WhatsApp / Zalo / Hotline',bookingContact:'+84 989 611 854',bookingUrl:'https://tinhthucspa.com/',updatedBy:'',updatedAt:''},
    {id:'bk-ha-spa',eventId:'ha-spa',day:5,placeId:'ha-spa',category:'Spa',title:'Hạ Spa — Tân Bình',date:'2026-11-03',time:'15:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm timing against airport transfer.',bookingMethod:'WhatsApp / Hotline / Zalo',bookingContact:'+84 908 661 683',bookingUrl:'',updatedBy:'',updatedAt:''},
    {id:'bk-transfer-in',eventId:'airport-transfer',day:1,placeId:null,category:'Transport',title:'Airport transfer · Arrival',date:'2026-10-30',time:'06:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Klook transfer · SGN → Fusion Original.',bookingMethod:'Provider already stored',bookingContact:'',bookingUrl:'',updatedBy:'',updatedAt:''},
    {id:'bk-transfer-out',eventId:'airport-transfer-final',day:5,placeId:null,category:'Transport',title:'Airport transfer · Departure',date:'2026-11-03',time:'17:45',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Provider: To confirm\nFusion Original / Hạ Spa → SGN.',bookingMethod:'Provider: To confirm',bookingContact:'',bookingUrl:'',updatedBy:'',updatedAt:''}
  ];
  const CATEGORIES=[['Restaurant','🍽 Restaurants'],['Spa','💆 Spa'],['Activity','🎫 Activities'],['Transport','🚐 Transport']];
  let activeCategory='Restaurant';
  function clone(v){return JSON.parse(JSON.stringify(v));}
  function oldDayToDate(day){const s=String(day||'');if(/30 Oct/.test(s))return'2026-10-30';if(/31 Oct/.test(s))return'2026-10-31';if(/1 Nov/.test(s))return'2026-11-01';if(/2 Nov/.test(s))return'2026-11-02';if(/3 Nov/.test(s))return'2026-11-03';return'';}
  function migrate(row){
    const r={...row},baseline=DEFAULTS.find(x=>x.id===r.id);
    if(!r.date)r.date=oldDayToDate(r.day);
    if(r.depositPaid==null)r.depositPaid=Boolean(r.deposit);
    if(!r.depositAmount)r.depositAmount=r.deposit||'';
    if(!r.notes)r.notes=[r.confirmation,r.contact,r.deadline].filter(Boolean).join('\n');
    if(r.category==='Transfer')r.category='Transport';
    if(baseline)Object.keys(baseline).forEach(key=>{if(r[key]===undefined)r[key]=clone(baseline[key]);});
    return r;
  }
  function load(){
    const saved=STORAGE.local.readJSON(KEY,null);
    if(!Array.isArray(saved)){const initial=clone(DEFAULTS);STORAGE.local.writeJSON(KEY,initial);return initial;}
    const rows=saved.map(migrate),byId=new Map(rows.map(x=>[x.id,x]));
    DEFAULTS.forEach(x=>{const existing=byId.get(x.id);if(!existing)rows.push(clone(x));else if(!existing.updatedAt)Object.assign(existing,clone(x));});
    return rows;
  }
  function save(rows){STORAGE.local.writeJSON(KEY,rows);window.dispatchEvent(new CustomEvent('ccmv:bookings-changed'));}
  function label(status){return status==='confirmed'?'✓ Confirmed':status==='cancelled'?'Cancelled / unavailable':'Pending';}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function user(){try{return getFriend();}catch(e){return STORAGE.local.get(STORAGE_CONFIG.keys.friend,'crystal');}}
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
    return `<article class="booking-card ${b.status}"><div class="booking-card-row"><button type="button" class="booking-card-main" onclick="openBookingEditor('${esc(b.id)}')"><span>${b.day?`<small class="booking-day-label">DAY ${esc(b.day)}</small>`:''}<strong>${esc(b.title)}</strong><small>${esc(meta)}</small></span><span class="booking-status ${b.status}">${label(b.status)}</span></button>${dayLink}</div>${b.updatedBy?`<p class="booking-updated">Updated by ${esc(person(b.updatedBy))}${b.updatedAt?` · ${new Date(b.updatedAt).toLocaleString()}`:''}</p>`:''}</article>`;
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
    const b=load().find(x=>x.id===id);if(!b)return;
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
    const b=load().find(x=>x.id===id);if(!b)return;
    const host=document.getElementById('bookingEditor');
    host.innerHTML=`<div class="booking-editor-head"><p class="kicker">Edit booking</p><h2>${esc(b.title)}</h2></div><form onsubmit="saveBookingEditor(event,'${esc(id)}')"><label>Booking status<select name="status"><option value="pending" ${b.status==='pending'?'selected':''}>Pending</option><option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option><option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled / unavailable</option></select></label><div class="booking-two"><label>Date<input name="date" type="date" value="${esc(b.date)}"></label><label>Time<input name="time" type="time" value="${esc(b.time?.slice(0,5))}"></label></div><label>Booking name<input name="bookingName" value="${esc(b.bookingName)}"></label><label class="booking-deposit-check"><input name="depositPaid" type="checkbox" ${b.depositPaid?'checked':''} onchange="toggleDepositAmount(this)"> Deposit paid</label><label data-deposit-amount ${b.depositPaid?'':'hidden'}>Deposit amount<input name="depositAmount" inputmode="decimal" type="number" min="0" step="any" value="${esc(b.depositAmount)}"></label><label>Booking option<input name="bookingMethod" value="${esc(b.bookingMethod||'')}"></label><label>WhatsApp / phone<input name="bookingContact" value="${esc(b.bookingContact||'')}"></label><label>Online booking link<input name="bookingUrl" type="url" value="${esc(b.bookingUrl||'')}"></label><label>Notes<textarea name="notes">${esc(b.notes)}</textarea></label><div class="booking-actions"><button class="btn" type="submit">Save booking</button><button class="mini-btn" type="button" onclick="openBookingEditor('${esc(id)}')">Cancel</button></div></form>`;
  };
  root.closeBookingModal=function(){const modal=document.getElementById('bookingModal');modal?.classList.remove('show','booking-modal-spa');document.getElementById('tripModal')?.classList.remove('show');};
  root.saveBookingEditor=function(event,id){
    event.preventDefault();const rows=load(),b=rows.find(x=>x.id===id);if(!b)return;const f=new FormData(event.currentTarget);
    b.status=String(f.get('status')||'pending');b.date=String(f.get('date')||'');b.time=String(f.get('time')||'');b.bookingName=String(f.get('bookingName')||'');b.depositPaid=f.get('depositPaid')==='on';b.depositAmount=b.depositPaid?String(f.get('depositAmount')||''):'';b.bookingMethod=String(f.get('bookingMethod')||'');b.bookingContact=String(f.get('bookingContact')||'');b.bookingUrl=String(f.get('bookingUrl')||'');b.notes=String(f.get('notes')||'');b.updatedBy=user();b.updatedAt=new Date().toISOString();
    save(rows);render();openBookingEditor(id);
  };
  root.CCMV_BOOKINGS={getForPlace(placeId){return load().filter(row=>row.placeId===placeId);}};
  document.addEventListener('DOMContentLoaded',render);window.addEventListener('storage',e=>{if(e.key===KEY)render();});window.addEventListener('ccmv:bookings-changed',render);
})(globalThis);
