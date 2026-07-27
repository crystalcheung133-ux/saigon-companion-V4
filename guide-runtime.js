/* guide-runtime.js - CCMV Travel Engine reusable owner.
   Owns Guide categories, Shopping entry, Guide modal, Place detail, and booking presentation helpers.
   Vietnam-specific values are supplied by config/data modules. */
function visitDayHTML(key){
  const place=VN_PRESENTATION.places[key];
  if(!place || place.cat==='STAY' || key==='workshop-coffee') return '';
  const days=VN_PRESENTATION.dayLinks[key]||[];
  const unique=[]; const seen=new Set();
  days.forEach(([label,href])=>{const token=String(label)+'|'+String(href);if(!seen.has(token)){seen.add(token);unique.push([label,href]);}});
  if(!unique.length) return '';
  const subtitle=String(place.sub||'');
  const visible=unique.filter(([label])=>!subtitle.toLowerCase().includes(String(label).toLowerCase()));
  if(!visible.length) return '';
  const buttons=visible.map(([label,href])=>`<a class="day-jump-button" href="${href}">${label} →</a>`).join('');
  return `<div class="quick-info-row visit-row"><span class="quick-info-icon">📅</span><span><span class="quick-info-label">Visit Day</span><span class="quick-info-value day-link-row">${buttons}</span></span></div>`;
}

function groupShoppingDirectory(){
 const directory=document.getElementById('shopping-directory');
 const grid=directory?.querySelector('.directory-grid');
 if(!grid || grid.dataset.grouped==='true') return;
 const cards=Array.from(grid.querySelectorAll(':scope > .directory-card'));
 const bestWithText=card=>{
   const row=Array.from(card.querySelectorAll('p')).find(p=>/Best with/i.test(p.textContent||''));
   return row?.textContent||'';
 };
 const groups=[
  {title:'Day 2 · Nguyễn Trãi & Central D1',match:/Day 2/i},
  {title:'Day 3 · Thảo Điền Lifestyle Walk',match:/Day 3/i},
  {title:'Day 4 · Phú Nhuận & District 3',match:/Day 4/i},
  {title:'Optional Detours',match:/.*/}
 ];
 groups.forEach(group=>{
   const selected=[];
   cards.slice().forEach(card=>{
     if(card.dataset.grouped) return;
     const groupingText=group.title==='Optional Detours'?(card.textContent||''):bestWithText(card);
     if(group.match.test(groupingText)){card.dataset.grouped='true';selected.push(card);}
   });
   if(!selected.length)return;
   const section=document.createElement('section');
   section.className='directory-route-group';
   section.innerHTML=`<h3>${group.title}</h3><div class="directory-route-grid"></div>`;
   const mount=section.querySelector('.directory-route-grid');
   selected.forEach(card=>mount.appendChild(card));
   grid.appendChild(section);
 });
 grid.dataset.grouped='true';
}
function reconcileGuideDirectory(){
 const main=document.querySelector('main');
 if(!main)return;
 const restaurantSection=Array.from(main.querySelectorAll(':scope > section')).find(section=>/RESTAURANTS/i.test(section.querySelector('h2')?.textContent||''));
 const restaurantList=restaurantSection?.querySelector('.category-pop-list');
 const manMoi=VN_PRESENTATION.places['man-moi'];
 if(restaurantList&&manMoi&&!restaurantList.querySelector('[data-guide-place="man-moi"]')&&!restaurantList.querySelector('[onclick*="id=man-moi"]')){
  const button=document.createElement('button');
  button.dataset.guidePlace='man-moi';
  button.type='button';
  button.innerHTML=`<span><span class="guide-list-title">${manMoi.emoji} ${manMoi.title}</span><span class="guide-list-sub">${manMoi.sub||''}</span></span><span>›</span>`;
  button.addEventListener('click',()=>{location.href='place.html?id=man-moi';});
  const lune=restaurantList.querySelector('[onclick*="id=lune"]');
  if(lune)lune.insertAdjacentElement('afterend',button);else restaurantList.appendChild(button);
 }
 const haButton=main.querySelector('[onclick*="id=ha-spa"]');
 const haSubtitle=haButton?.querySelector('.guide-list-sub');
 if(haSubtitle&&VN_PRESENTATION.places['ha-spa'])haSubtitle.textContent=VN_PRESENTATION.places['ha-spa'].sub||'';
}
function applyGuideHashView(){
 const directory=document.getElementById('shopping-directory');
 const main=directory?.closest('main');
 if(!directory||!main)return;
 groupShoppingDirectory();
 const directoryOnly=location.hash==='#shopping-directory';
 Array.from(main.children).forEach(el=>{el.hidden=directoryOnly&&el!==directory;});
 document.body.classList.toggle('shopping-directory-view',directoryOnly);
 if(directoryOnly)requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
}
function closeShoppingDirectoryView(){
 const returnTo=new URLSearchParams(location.search).get('return');
 if(returnTo){location.href=returnTo;return;}
 if(history.length>1){history.back();return;}
 location.href='index.html';
}
function openShoppingDirectoryView(){
 closeGuideModal();closeMiniMenus();
 const onGuide=/guide\.html$/.test(location.pathname)||location.pathname.endsWith('/guide.html');
 if(!onGuide){location.href='guide.html#shopping-directory';return;}
 if(location.hash==='#shopping-directory')applyGuideHashView();
 else location.hash='shopping-directory';
}
window.addEventListener('hashchange',applyGuideHashView);
document.addEventListener('DOMContentLoaded',()=>{reconcileGuideDirectory();applyGuideHashView();});


function bookingStatusForPlace(placeId){
 try{const rows=globalThis.CCMV_BOOKINGS?.getForPlace(placeId)||[];if(!rows.length)return '';const confirmed=rows.some(x=>x.status==='confirmed');const pending=rows.some(x=>x.status==='pending');const status=confirmed?'confirmed':pending?'pending':'cancelled';const text=confirmed?'✓ Confirmed':pending?'Booking pending':'Unavailable';return `<a class="guide-booking-badge ${status}" href="bookings.html">${text}</a>`;}catch(e){return '';}
}

function openGuideCategory(cat){
 saveGuideNavigationContext(cat);
 const list=(VN_PRESENTATION.categories[cat]||[]).slice().sort((a,b)=>String(a.title||'').localeCompare(String(b.title||'')));
 const directoryId=(VN_PRESENTATION.directoryCategories||{})[cat];
 if(directoryId){
  const directoryRow=`<button data-action="shopping-directory"><span><span class="guide-list-title">🛍 Shopping Directory</span><span class="guide-list-sub">Optional shops · Near · Best with Day</span></span><span>↓</span></button>`;
  const rows=directoryRow+list.map(i=>`<button data-action="place" data-place-id="${i.key}"><span><span class="guide-list-title">${i.emoji} ${i.title}</span><span class="guide-list-sub">${i.sub||''}</span>${bookingStatusForPlace(i.key)}</span><span>›</span></button>`).join('');
  $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>${cat}</h2><div class="category-pop-list">${rows}</div>`;
  closeMiniMenus();$('guideModal').classList.add('show');return;
 }
 if(list.length===1){closeMiniMenus();openGuideModal(list[0].key);return;}
 const rows=list.map(i=>`<button data-action="place" data-place-id="${i.key}"><span><span class="guide-list-title">${i.emoji} ${i.title}</span><span class="guide-list-sub">${i.sub||''}</span>${bookingStatusForPlace(i.key)}</span><span>›</span></button>`).join('');
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>${cat}</h2><div class="category-pop-list">${rows}</div>`;
 closeMiniMenus();$('guideModal').classList.add('show');
}

function quickInfoInnerHTML(g,key){
 return `<div class="quick-info-top"><span class="category-tag">${g.categoryLabel||g.cat||'Guide'}</span></div><div class="quick-info-grid"><div class="quick-info-row"><span class="quick-info-icon">📍</span><span><span class="quick-info-label">Address</span><span class="quick-info-value">${g.address||'Check before visit'}</span></span></div><div class="quick-info-row"><span class="quick-info-icon">🕘</span><span><span class="quick-info-label">Hours</span><span class="quick-info-value">${g.hours||'Check before visit'}</span></span></div><div class="quick-info-row"><span class="quick-info-icon">💰</span><span><span class="quick-info-label">Price</span><span class="quick-info-value">${g.price||'Varies'}</span></span></div>${visitDayHTML(key)}</div><div class="quick-info-actions">${bookingStatusForPlace(key)}<a class="timeline-action timeline-action--map guide-navigate-button" href="${g.maps}" target="_blank" rel="noopener">🧭 Navigate</a></div>`;
}
function quickInfoHTML(g,key){
 return `<div class="quick-info-card">${quickInfoInnerHTML(g,key)}</div>`;
}

function guideNavButtons(key){const order=VN_PRESENTATION.guideOrder;const idx=order.indexOf(key); if(idx<0)return ''; const prev=order[(idx-1+order.length)%order.length]; const next=order[(idx+1)%order.length]; return `<div class="guide-next-row"><button class="pill" data-action="guide-place-modal" data-place-id="${prev}">‹ Previous</button><button class="pill" data-action="guide-place-modal" data-place-id="${next}">Next ›</button></div>`;}
function openGuideModal(key){
 const g=VN_PRESENTATION.places[key]; if(!g)return;
 const sig=(g.signature||[]).map(x=>`<li>${x}</li>`).join('');
 const worth=(g.worth||[]).map(x=>`<li>${x}</li>`).join('');
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>${g.emoji} ${g.title}</h2><p><strong>${g.sub}</strong></p>${quickInfoHTML(g,key)}<p>${g.desc}</p>${sig?`<h3>Highlights</h3><ul>${sig}</ul>`:''}${worth?`<h3>Good to Know</h3><ul>${worth}</ul>`:''}${guideNavButtons(key)}`;
 $('guideModal').classList.add('show');
 const sheet=document.querySelector('#guideModal .guide-sheet');
 if(sheet) sheet.scrollTop=0;
}
function closeGuideModal(){$('guideModal').classList.remove('show');clearGuideNavigationContext()}


function renderPlacePage(key){
  const g = VN_PRESENTATION.places[key];
  const optionalContext = new URLSearchParams(location.search).get('optional');
  const mount = document.getElementById('placeMain');
  if(!g || !mount) return;
  const sig = (g.signature||g.highlights||[]).map(x=>`<li>${x}</li>`).join('');
  const worth = (g.worth||g.tips||[]).map(x=>`<li>${x}</li>`).join('');
  mount.innerHTML = `
<button class="place-detail-close" type="button" aria-label="Close place detail" data-action="place-close">×</button>
<div class="page-hero"><p class="kicker">Guide</p><h1>${g.emoji} ${g.title}</h1>${optionalContext?`<span class="optional-badge">OPTIONAL · ${optionalContext}</span>`:''}<p class="lead">${g.sub||''}</p></div>
<section aria-label="Quick Info" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
<section class="prose-block guide-overview"><h2>Overview</h2><p>${g.desc||''}</p></section>
<section class="prose-block"><h2>Highlights</h2><ul>${sig}</ul></section>
<section class="prose-block"><h2>Good to Know</h2><ul>${worth}</ul></section>`;
  document.title = `${g.title} · Saigon Companion`;
}

function copyText(text){
  if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>alert('Address copied')).catch(()=>alert(text));}
  else alert(text);
}

/* ============================================================================
   STAGE 1.5 — INFORMATION MIGRATION TEMPLATE: optional read-only helpers
   ----------------------------------------------------------------------------
   Added: 2026-07-09. See STAGE_1_5_INFORMATION_MIGRATION.md.

   These read the canonical Booking compatibility projection and return plain data/strings. None of
   them are called anywhere else in this file, none are attached to any
   button/onclick, and none write to the DOM or localStorage. They exist so a
   future stage can wire a real booking-status UI without first inventing
   this lookup logic. Safe to delete if a future stage designs different
   helpers instead — nothing else in the app depends on these.
   ============================================================================ */

/** Returns an array of Booking projection entries whose dayId matches the given
 *  day id (e.g. 'day1'). Returns [] if the projection is missing/empty or
 *  no bookings match — never throws. */
function getBookingsForDay(dayId){
  try{
    return Object.values(VN_PRESENTATION.bookings||{}).filter(b => b && b.dayId === dayId);
  }catch(e){ return []; }
}

/** Returns an array of Booking projection entries whose placeId matches the
 *  public Vietnam Place key. Returns [] if none match. */
function getBookingsForPlace(placeId){
  try{
    return Object.values(VN_PRESENTATION.bookings||{}).filter(b => b && b.placeId === placeId);
  }catch(e){ return []; }
}

/** Maps a booking status code to a short display label + emoji. Falls back
 *  to the raw status string (or 'Unknown') for any value not in the map,
 *  so this never throws on unexpected data. Not currently rendered anywhere. */
function getBookingStatusLabel(status){
  const map = {
    confirmed: '✅ Confirmed',
    pending:   '🕒 Pending',
    toBook:    '📌 To Book',
    cancelled: '✖️ Cancelled'
  };
  return map[status] || (status || 'Unknown');
}
