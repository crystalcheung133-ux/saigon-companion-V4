/* Collaborative booking workspace. Independent from Timeline; optionally linked to Guide places. */
(function(root){
  'use strict';
  const KEY=(root.STORAGE_CONFIG&&STORAGE_CONFIG.keys.bookings)||'ccmv_vietnam_bookings_v1';
  const DEFAULTS=[
    {id:'bk-omakase-tiger',placeId:'omakase-tiger',category:'Restaurant',title:'Omakase Tiger',date:'2026-10-30',time:'17:30',status:'confirmed',bookingName:'',depositPaid:false,depositAmount:'',notes:'Restaurant confirmed availability.',updatedBy:'crystal',updatedAt:''},
    {id:'bk-nha-suga',placeId:'nha-suga',category:'Spa',title:'Spa Nhà Suga Premium',date:'2026-10-30',time:'14:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm treatment duration and arrival time. Contact: +84 935 227 989.',updatedBy:'',updatedAt:''},
    {id:'bk-lune',placeId:'lune',category:'Restaurant',title:'LÚNE Restaurant & Bar',date:'2026-10-31',time:'19:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm dinner reservation for 4 guests.',updatedBy:'',updatedAt:''},
    {id:'bk-cooking',placeId:'cooking',category:'Activity',title:'Saigon Cooking Class',date:'2026-10-31',time:'10:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm meeting instructions for 80/1 Nguyễn Trãi.',updatedBy:'',updatedAt:''},
    {id:'bk-moc-kim',placeId:'moc-kim',category:'Spa',title:'Mộc Kim Spa & Beauty',date:'2026-10-31',time:'',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'',updatedBy:'',updatedAt:''},
    {id:'bk-little-bear',placeId:'little-bear',category:'Restaurant',title:'Little Bear',date:'2026-11-01',time:'18:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Contact: +84 862 512 086.',updatedBy:'',updatedAt:''},
    {id:'bk-moc-huong',placeId:'moc-huong',category:'Spa',title:'Mộc Hương Wellness',date:'2026-11-01',time:'15:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Contact: +84 28 3744 4550.',updatedBy:'',updatedAt:''},
    {id:'bk-pizza4ps',placeId:'pizza4ps',category:'Restaurant',title:'Pizza 4P’s Hai Bà Trưng',date:'2026-11-02',time:'11:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Reserve lunch for 4 guests.',updatedBy:'',updatedAt:''},
    {id:'bk-quince',placeId:'quince',category:'Restaurant',title:'Quince Saigon',date:'2026-11-02',time:'19:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm Monday dinner service.',updatedBy:'',updatedAt:''},
    {id:'bk-tinh-thuc',placeId:'tinh-thuc',category:'Spa',title:'Tỉnh Thức Spa',date:'2026-11-02',time:'15:15',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm Monday appointment and treatment.',updatedBy:'',updatedAt:''},
    {id:'bk-ha-spa',placeId:'ha-spa',category:'Spa',title:'Hạ Spa',date:'2026-11-03',time:'15:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm timing against airport transfer.',updatedBy:'',updatedAt:''},
    {id:'bk-transfer-in',placeId:null,category:'Transport',title:'Airport transfer · Arrival',date:'2026-10-30',time:'06:00',status:'confirmed',bookingName:'',depositPaid:false,depositAmount:'',notes:'Klook transfer · SGN → Fusion Original.',updatedBy:'crystal',updatedAt:''},
    {id:'bk-transfer-out',placeId:null,category:'Transport',title:'Airport transfer · Departure',date:'2026-11-03',time:'17:45',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Fusion Original / Hạ Spa → SGN.',updatedBy:'',updatedAt:''}
  ];
  const CATEGORIES=[['Restaurant','🍽 Restaurants'],['Spa','💆 Spa'],['Activity','🎫 Activities'],['Transport','🚐 Transport']];
  let activeCategory='Restaurant';
  function clone(v){return JSON.parse(JSON.stringify(v));}
  function oldDayToDate(day){const s=String(day||'');if(/30 Oct/.test(s))return'2026-10-30';if(/31 Oct/.test(s))return'2026-10-31';if(/1 Nov/.test(s))return'2026-11-01';if(/2 Nov/.test(s))return'2026-11-02';if(/3 Nov/.test(s))return'2026-11-03';return'';}
  function migrate(row){
    const r={...row};
    if(!r.date)r.date=oldDayToDate(r.day);
    if(r.depositPaid==null)r.depositPaid=Boolean(r.deposit);
    if(!r.depositAmount)r.depositAmount=r.deposit||'';
    if(!r.notes){r.notes=[r.confirmation,r.contact,r.deadline].filter(Boolean).join('\n');}
    if(r.category==='Transfer')r.category='Transport';
    return r;
  }
  function load(){
    const saved=STORAGE.local.readJSON(KEY,null);
    if(!Array.isArray(saved)){const initial=clone(DEFAULTS);STORAGE.local.writeJSON(KEY,initial);return initial;}
    const rows=saved.map(migrate),byId=new Map(rows.map(x=>[x.id,x]));
    DEFAULTS.forEach(x=>{if(!byId.has(x.id))rows.push(clone(x));});
    return rows;
  }
  function save(rows){STORAGE.local.writeJSON(KEY,rows);window.dispatchEvent(new CustomEvent('ccmv:bookings-changed'));}
  function label(status){return status==='confirmed'?'✓ Confirmed':status==='cancelled'?'Cancelled / unavailable':'Pending';}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function user(){try{return getFriend();}catch(e){return STORAGE.local.get(STORAGE_CONFIG.keys.friend,'crystal');}}
  function person(k){return (root.VN_PRESENTATION?.friends||{})[k]||k||'—';}
  function formatDate(v){if(!v)return'Date pending';const d=new Date(v+'T12:00:00');return new Intl.DateTimeFormat('en-AU',{weekday:'short',day:'numeric',month:'short'}).format(d);}
  function summary(rows){const c=rows.filter(x=>x.status==='confirmed').length,p=rows.filter(x=>x.status==='pending').length,u=rows.filter(x=>x.status==='cancelled').length;return `${c} Confirmed · ${p} Pending${u?` · ${u} Unavailable`:''}`;}
  function categoryTabs(rows){return `<div class="booking-tabs" role="tablist">${CATEGORIES.map(([key,title])=>{const count=rows.filter(x=>x.category===key).length;return `<button type="button" class="booking-tab ${activeCategory===key?'active':''}" data-booking-category="${key}">${title}<small>${count}</small></button>`;}).join('')}</div>`;}
  function render(){
    const host=document.getElementById('bookingList');if(!host)return;
    const rows=load(),sum=document.getElementById('bookingSummary');if(sum)sum.textContent=summary(rows);
    const group=rows.filter(x=>x.category===activeCategory);
    host.innerHTML=categoryTabs(rows)+`<section class="booking-group booking-group-active">${group.map(card).join('')}</section>`;
    host.querySelectorAll('[data-booking-category]').forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.bookingCategory;render();}));
  }
  function card(b){const meta=[formatDate(b.date),b.time].filter(Boolean).join(' · ');return `<article class="booking-card ${b.status}"><button type="button" class="booking-card-main" onclick="openBookingEditor('${esc(b.id)}')"><span><strong>${esc(b.title)}</strong><small>${esc(meta)}</small></span><span class="booking-status ${b.status}">${label(b.status)}</span></button>${b.updatedBy?`<p class="booking-updated">Updated by ${esc(person(b.updatedBy))}${b.updatedAt?` · ${new Date(b.updatedAt).toLocaleString()}`:''}</p>`:''}</article>`;}
  root.toggleDepositAmount=function(input){const wrap=input.closest('form')?.querySelector('[data-deposit-amount]');if(wrap)wrap.hidden=!input.checked;};
  root.openBookingEditor=function(id){
    const b=load().find(x=>x.id===id);if(!b)return;
    const modal=document.getElementById('bookingModal'),host=document.getElementById('bookingEditor');
    host.innerHTML=`<p class="kicker">Shared booking</p><h2>${esc(b.title)}</h2><p class="booking-place-link">${b.placeId?`<a href="place.html?id=${encodeURIComponent(b.placeId)}">Open Guide card →</a>`:'Independent booking record'}</p><form onsubmit="saveBookingEditor(event,'${esc(id)}')"><label>Booking status<select name="status"><option value="pending" ${b.status==='pending'?'selected':''}>Pending</option><option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option><option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled / unavailable</option></select></label><div class="booking-two"><label>Date<input name="date" type="date" value="${esc(b.date)}"></label><label>Time<input name="time" type="time" value="${esc(b.time?.slice(0,5))}"></label></div><label>Booking name<input name="bookingName" value="${esc(b.bookingName)}"></label><label class="booking-deposit-check"><input name="depositPaid" type="checkbox" ${b.depositPaid?'checked':''} onchange="toggleDepositAmount(this)"> Deposit paid</label><label data-deposit-amount ${b.depositPaid?'':'hidden'}>Deposit amount<input name="depositAmount" inputmode="decimal" type="number" min="0" step="any" value="${esc(b.depositAmount)}" placeholder="Enter amount"></label><label>Notes<textarea name="notes" placeholder="Confirmation, contact, special requests or cancellation details…">${esc(b.notes)}</textarea></label><button class="btn" type="submit">Save booking</button></form>`;
    modal.classList.add('show');
  };
  root.closeBookingModal=function(){document.getElementById('bookingModal')?.classList.remove('show');};
  root.saveBookingEditor=function(ev,id){
    ev.preventDefault();const f=new FormData(ev.currentTarget),rows=load(),b=rows.find(x=>x.id===id);if(!b)return;
    b.status=String(f.get('status')||'pending');b.date=String(f.get('date')||'');b.time=String(f.get('time')||'');b.bookingName=String(f.get('bookingName')||'');b.depositPaid=f.get('depositPaid')==='on';b.depositAmount=b.depositPaid?String(f.get('depositAmount')||''):'';b.notes=String(f.get('notes')||'');b.updatedBy=user();b.updatedAt=new Date().toISOString();
    save(rows);closeBookingModal();render();
  };
  root.CCMV_BOOKINGS=Object.freeze({getAll:load,getForPlace(placeId){return load().filter(x=>x.placeId===placeId);},label});
  document.addEventListener('DOMContentLoaded',render);window.addEventListener('storage',e=>{if(e.key===KEY)render();});window.addEventListener('ccmv:bookings-changed',render);
})(globalThis);
