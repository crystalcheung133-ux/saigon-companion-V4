/* ============================================================================
   TRAVEL ENGINE — GUIDE & PLACE MODULE
   Stage 7K-2D
   Owns Guide navigation context, category/place modal flow, shopping directory
   view, place page rendering and guide-specific copy/address behavior.
   Shared DOM/menu helpers remain in script.js and are available before this
   module loads.
   ============================================================================ */
const PRODUCTION_GUIDE=GenerationSelectionAdapter.view('guide');
function guidePlace(key){const base=PRODUCTION_GUIDE.places[key];return base&&window.GUIDE_AUTHORITY?GUIDE_AUTHORITY.resolve(key,base):base;}

// Every Visit Day link must dismiss the entire popup stack before navigating.
// In-page hashes need an explicit scroll because an already-selected hash may
// not trigger hashchange; never replace or clear the user's saved data.
function navigateGuideToTimeline(event,anchor){
  if(event&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0))return true;
  const target=new URL(anchor.href,location.href);
  if(target.origin!==location.origin)return true;
  event?.preventDefault();
  window.dismissAllContentOverlays?.();
  if(target.pathname===location.pathname&&target.search===location.search){
    if(target.hash)history.replaceState(null,'',target.pathname+target.search+target.hash);
    const id=decodeURIComponent(target.hash.slice(1));
    if(id)requestAnimationFrame(()=>window.restoreDayEntryPosition?.());
  }else{
    location.assign(target.href);
  }
  return false;
}

function visitDayHTML(key){
  const days=GUIDE_NAVIGATION.dayLinks(key);
  if(!days.length) return '';
  const place=guidePlace(key)||{};
  if(place.cat==='STAY') return '';
  const buttons=days.map(([label,href])=>`<a class="day-jump-button" href="${href}" onclick="return navigateGuideToTimeline(event,this)">${label} →</a>`).join('');
  return `<div class="quick-info-row visit-row"><span class="quick-info-icon">📅</span><span><span class="quick-info-label">Visit Day</span><span class="quick-info-value day-link-row">${buttons}</span></span></div>`;
}


function placeHref(key){
  return NAVIGATION.build('place',{query:{placeId:key}});
}
function guideBookingHref(bookingId){
  return NAVIGATION.build('trip',{query:{bookingId:bookingId,returnTo:NAVIGATION.currentRelativeUrl()}});
}
function openGuideLinkedBooking(bookingId){
  const booking=window.BOOKING_AUTHORITY?BOOKING_AUTHORITY.get(bookingId):null;
  if(!booking)return;
  // Navigation contract: a Guide opened from Day Timeline is an intermediate layer.
  // Closing its linked Booking returns directly to Timeline; Guide-origin flows return to Guide.
  window.TRIP_MODAL_RETURN_TO_GUIDE=false;
  document.body.classList.remove('guide-foreground-over-booking');
  document.body.classList.add('guide-booking-stack-open');
  const guideModal=document.getElementById('guideModal');
  if(guideModal)guideModal.classList.add('guide-backgrounded-for-booking');
  if(booking.type==='accommodation'){
    openAccommodationDetail(bookingId,booking);
    return;
  }
  if(booking.type==='activity'&&typeof bookingCategoryLabel==='function'&&bookingCategoryLabel(booking)==='Activities'){
    openActivityBookingDetail(bookingId,booking);
    return;
  }
  openGenericBookingDetail(bookingId,booking);
}
const GUIDE_NAV_CONTEXT_KEY=STORAGE_CONFIG.keys.guideNavContext;
const GUIDE_NAV_REOPEN_KEY=STORAGE_CONFIG.keys.guideNavReopen;
function saveGuideNavigationContext(category, options){
  const opts=options||{};
  try{
    STORAGE.session.set(GUIDE_NAV_CONTEXT_KEY,JSON.stringify({
      category,
      sourceUrl:opts.sourceUrl||NAVIGATION.currentAbsoluteUrl(),
      sourceType:opts.sourceType||'guide',
      scrollY:Number.isFinite(Number(opts.scrollY))?Number(opts.scrollY):(window.scrollY||0),
      savedAt:Date.now()
    }));
  }catch(e){}
}
function openGuideGroupFromDay(keys,itemId){
  window.GUIDE_MODAL_ORIGIN='timeline';
  window.GUIDE_MODAL_RETURN_SCROLL_Y=window.scrollY||window.pageYOffset||0;
  window.GUIDE_MODAL_RETURN_ITEM_ID=itemId||null;
  const excluded=new Set(TRIP_CONFIG.guide?.excludedPlaceIds||[]);
  const clean=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>key&&typeof PRODUCTION_GUIDE.places!=='undefined'&&guidePlace(key)&&!excluded.has(key)))];
  if(!clean.length)return;
  closeMiniMenus();
  if(clean.length===1){openGuideModal(clean[0]);return;}
  openGuideAlternatives(clean,itemId);
}
function readGuideNavigationContext(){
  try{return STORAGE.session.readJSON(GUIDE_NAV_CONTEXT_KEY,null);}
  catch(e){return null;}
}
function clearGuideNavigationContext(){
  try{
    STORAGE.session.remove(GUIDE_NAV_CONTEXT_KEY);
    STORAGE.session.remove(GUIDE_NAV_REOPEN_KEY);
  }catch(e){}
}
function closePlaceDetail(){
  const context=readGuideNavigationContext();
  const target=context?.sourceUrl
    ? NAVIGATION.permittedReturnTarget(context.sourceUrl,NAVIGATION_CONFIG.fallback.placeClose)
    : NAVIGATION.build(NAVIGATION_CONFIG.fallback.placeClose);
  try{
    if(context?.sourceType==='day') STORAGE.session.set(GUIDE_NAV_REOPEN_KEY,JSON.stringify({scrollY:Number(context.scrollY)||0,savedAt:Date.now()}));
  }catch(e){}
  try{STORAGE.session.remove(GUIDE_NAV_CONTEXT_KEY);}catch(e){}
  NAVIGATION.go(target);
}


function applyGuideHashView(){
 const directory=document.getElementById('shopping-directory');
 const main=directory?.closest('main');
 if(!directory||!main)return;
 const directoryOnly=NAVIGATION.hasHash('shoppingDirectory');
 Array.from(main.children).forEach(el=>{el.hidden=directoryOnly&&el!==directory;});
 document.body.classList.toggle('shopping-directory-view',directoryOnly);
 if(directoryOnly)requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
}
function shoppingDirectoryDay(card){
 const text=String(card||'');
 const match=text.match(/Best with<\/strong>\s*Day\s*(\d+)/i);
 return match?Number(match[1]):null;
}
function openShoppingDirectoryView(requestedDay){
 const raw=Array.isArray(globalThis.VN_SHOPPING_DIRECTORY_CARDS)?globalThis.VN_SHOPPING_DIRECTORY_CARDS:[];
 const day=Number(requestedDay)||0;
 const cards=day?raw.filter(card=>shoppingDirectoryDay(card)===day):raw;
 function section(label,rows){return rows.length?`<section class="directory-route-group"><h3>${label}</h3><div class="directory-route-grid">${rows.join('')}</div></section>`:'';}
 const planned=rows=>rows.filter(card=>/PLANNED ·/i.test(card));
 const optional=rows=>rows.filter(card=>/OPTIONAL ·/i.test(card));
 let grouped='';
 if(day===1){ grouped=section('PLANNED · Nguyễn Trãi Local Fashion Walk',planned(cards))+section('OPTIONAL · If Time / Near Hotel',optional(cards)); }
 else if(day===2){ grouped=section('PLANNED · Morning Run · 11 Garmentory + Trần Quang Diệu',planned(cards).filter(card=>/MORNING/i.test(card)))+section('PLANNED · Afternoon · Vincom Đồng Khởi + The New Playground',planned(cards).filter(card=>/AFTERNOON/i.test(card)))+section('OPTIONAL · Final Browse',optional(cards)); }
 else if(day===4){ grouped=section('PLANNED · Thảo Điền Lifestyle',planned(cards))+section('OPTIONAL',optional(cards)); }
 else if(day){ grouped=section(`PLANNED · Day ${day}`,planned(cards))+section('OPTIONAL',optional(cards)); }
 else{
   grouped=section('PLANNED BY DAY · Day 1',planned(raw.filter(card=>shoppingDirectoryDay(card)===1)))+section('PLANNED BY DAY · Day 2',planned(raw.filter(card=>shoppingDirectoryDay(card)===2)))+section('PLANNED BY DAY · Day 4',planned(raw.filter(card=>shoppingDirectoryDay(card)===4)))+section('OPTIONAL / NEARBY',optional(raw));
 }
 const title=day?`🛍 Day ${day} Shopping Directory`:'🛍 Shopping Directory';
 const lead=day===1?'Nguyễn Trãi 是已定好的 Day 1 local-fashion line；主線與 optional extension 分開。':day===2?'上午走 11 Garmentory + Trần Quang Diệu；Pizza 4P’s 後到 Qspa 做 Afternoon Reset，再走 Cathedral / Post Office / Book Street sightseeing cluster，之後步行接 Vincom / The New Playground → Rue Miche L’Édition（Union Square B3）→ LÚNE。':day===4?'Day 4 只用一條 Shopping Route；每一段清楚標示 Grab、步行或同址，方便一眼看完整動線。':day===5?'Day 5 不設固定 Shopping Route；行完 Fine Arts Museum 後按前幾日漏逛的店自由決定。':'先看 PLANNED BY DAY；真正未排入 itinerary 的店才放 OPTIONAL。';
 $('guideModalContent').innerHTML=`<p class="kicker">Shopping Directory</p><h2>${title}</h2><p class="lead">${lead}</p><div class="directory-grid">${grouped}</div>`;
 closeMiniMenus();$('guideModal').classList.add('show');
 const sheet=document.querySelector('#guideModal .guide-sheet');if(sheet)sheet.scrollTop=0;
}

window.addEventListener('hashchange',applyGuideHashView);
document.addEventListener('DOMContentLoaded',applyGuideHashView);
function openRequestedGuideCard(){
 const key=NAVIGATION.getQuery('placeId','') || NAVIGATION.getQuery('legacyPlaceId','');
 if(!key || !guidePlace(key)) return;
 window.setTimeout(function(){
  openGuideModal(key);
  const sheet=document.querySelector('#guideModal .guide-sheet');
  if(sheet){sheet.scrollTop=0;sheet.focus?.({preventScroll:true});}
 },0);
}
document.addEventListener('DOMContentLoaded',openRequestedGuideCard);


function guideSemanticCategory(cat){
 const raw=String(cat||'').toUpperCase();
 if(['RESTAURANTS','CAFÉS','CAFES'].includes(raw))return 'DINING';
 if(['ACTIVITIES','EXPERIENCE','EXPERIENCES'].includes(raw))return 'EXPERIENCES';
 if(['SPA','WELLNESS'].includes(raw))return 'WELLNESS';
 if(raw==='SHOPPING')return 'SHOP';
 return raw;
}
function guideCategorySources(cat){
 const semantic=guideSemanticCategory(cat);
 const configured=TRIP_CONFIG.guide&&TRIP_CONFIG.guide.categoryMap&&TRIP_CONFIG.guide.categoryMap[semantic];
 if(Array.isArray(configured)&&configured.length)return configured.map(String);
 const defaults={
  ATTRACTIONS:['ATTRACTIONS'],
  EXPERIENCES:['ACTIVITIES','EXPERIENCE','EXPERIENCES'],
  WELLNESS:['SPA','WELLNESS'],
  DINING:['DINING','RESTAURANTS','CAFÉS','CAFES'],
  STAY:['STAY'],
  SHOP:['SHOP','SHOPPING'],
  PRACTICAL:['PRACTICAL']
 };
 return defaults[semantic]||[semantic];
}
function guideDisplayCategory(item){ return guideSemanticCategory(item&&item.cat); }
function guideCategoryItems(cat){
 const excluded=new Set(TRIP_CONFIG.guide?.excludedPlaceIds||[]);
 const sourceRows=guideCategorySources(cat).flatMap(source=>PRODUCTION_GUIDE.categories[source]||[]);
 const seen=new Set();
 return sourceRows
  .map(item=>{const key=typeof item==='string'?item:item&&item.key;if(!key||seen.has(key))return null;seen.add(key);return guidePlace(key)?Object.assign({key},guidePlace(key)):null;})
  .filter(item=>{
    if(!item||excluded.has(item.key))return false;
    if(guideSemanticCategory(cat)==='STAY'&&window.BOOKING_AUTHORITY){
      const booking=BOOKING_AUTHORITY.byPlace(item.key);
      // Guide Stay shows the current intended stay only: confirmed or primary choice.
      // Booked backups remain exclusively in Trip · Accommodation.
      return !!booking&&!/backup/i.test(String(booking.status||''))&&['confirmed','monitoring'].includes(String(booking.status||''));
    }
    return true;
  });
}
function guideCategoryHeading(cat){
 const semantic=guideSemanticCategory(cat);
 if(semantic==='ATTRACTIONS') return 'ATTRACTIONS';
 return semantic;
}

function guideDayNumber(item){
 const links=PRODUCTION_GUIDE.dayLinks[item.key]||[];
 const numbers=links.map(link=>{const match=String(link&&link[0]||'').match(/Day\s*(\d+)/i);return match?Number(match[1]):null;}).filter(Number.isFinite);
 return numbers.length?Math.min(...numbers):999;
}
function guideActivityGroup(item){
 const text=`${item.title||''} ${item.sub||''} ${item.categoryLabel||''}`.toLowerCase();
 if(/cruise|tour|4wd|glowworm|milford|gold panning/.test(text)) return 'Tours & Cruises';
 if(/track|hike|walk|blue lakes|deer park/.test(text)) return 'Walks & Outdoor';
 return 'Experiences & Attractions';
}
function guideSortedCategoryItems(cat){
 const items=guideCategoryItems(cat).slice();
 const semantic=guideSemanticCategory(cat);
 if(semantic==='ATTRACTIONS'||semantic==='DINING'||semantic==='STAY') return items.sort((a,b)=>guideDayNumber(a)-guideDayNumber(b)||String(a.title||'').localeCompare(String(b.title||'')));
 if(semantic==='SHOP') return items.sort((a,b)=>guideDayNumber(a)-guideDayNumber(b));
 if(semantic==='EXPERIENCES') return items.sort((a,b)=>guideActivityGroup(a).localeCompare(guideActivityGroup(b))||String(a.title||'').localeCompare(String(b.title||'')));
 return items.sort((a,b)=>String(a.title||'').localeCompare(String(b.title||'')));
}
function guideStayStatusHTML(item){
 const booking=(window.BOOKING_AUTHORITY&&item?.cat==='STAY')?BOOKING_AUTHORITY.byPlace(item.key):null;
 if(!booking)return '';
 const raw=String(booking.displayStatus||booking.status||'TO CONFIRM').toUpperCase();
 const label=raw==='CONFIRMED'?'CONFIRMED':(raw==='PENDING'?'PENDING':'TO CONFIRM');
 const cls=label==='CONFIRMED'?'confirmed':'to-confirm';
 return `<span class="guide-status guide-status-${cls}">${label}</span>`;
}
function guideListRow(item){
 const action=`openGuideModal('${item.key}')`;
 return `<button onclick="${action}"><span><span class="guide-list-title">${item.emoji} ${item.title}</span></span><span class="guide-list-meta"><span class="guide-list-chevron">›</span></span></button>`;
}

function groupedGuideRows(cat,list){
 const semantic=guideSemanticCategory(cat);
 if(semantic==='ATTRACTIONS'||semantic==='DINING'||semantic==='STAY'){
  const groups=new Map();
  list.forEach(item=>{
   const booking=(semantic==='STAY'&&window.BOOKING_AUTHORITY)?BOOKING_AUTHORITY.byPlace(item.key):null;
   const day=guideDayNumber(item);
   const label=(semantic==='STAY'&&booking?.guideDayLabel)?booking.guideDayLabel:(day===999?'Optional / Flexible':`Day ${day}`);
   (groups.get(label)||groups.set(label,[]).get(label)).push(item);
  });
  return [...groups.entries()].map(([label,items])=>`<section class="guide-category-group"><h3 class="guide-category-group-title">${label}</h3>${items.map(guideListRow).join('')}</section>`).join('');
 }
 if(semantic==='SHOP'){
  const groups=new Map();
  list.forEach(item=>{
   const day=guideDayNumber(item);
   const optional=String(item.status||'').toLowerCase()==='optional'||day===999;
   const label=optional?'OPTIONAL · 順路可逛':`Day ${day} · ON YOUR ROUTE`;
   (groups.get(label)||groups.set(label,[]).get(label)).push(item);
  });
  return [...groups.entries()].map(([label,items])=>`<section class="guide-category-group"><h3 class="guide-category-group-title">${label}</h3>${items.map(guideListRow).join('')}</section>`).join('');
 }
 if(semantic==='EXPERIENCES'){
  const groups=new Map();
  list.forEach(item=>{const label=guideActivityGroup(item);(groups.get(label)||groups.set(label,[]).get(label)).push(item);});
  return [...groups.entries()].map(([label,items])=>`<section class="guide-category-group"><h3 class="guide-category-group-title">${label}</h3>${items.map(guideListRow).join('')}</section>`).join('');
 }
 return list.map(guideListRow).join('');
}
function openGuideCategory(cat){
 window.GUIDE_MODAL_ORIGIN='guide';
 const semantic=guideSemanticCategory(cat);
 saveGuideNavigationContext(semantic);
 const list=guideSortedCategoryItems(semantic);
 // A single-entry category is already the destination; skip a redundant chooser.
 if(list.length===1){closeMiniMenus();openGuideModal(list[0].key);return;}
 if(semantic==='SHOP'){
  closeMiniMenus();openShoppingDirectoryView();return;
 }
 const rows=groupedGuideRows(semantic,list);
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>${guideCategoryHeading(semantic)}</h2><div class="category-pop-list guide-category-grouped">${rows}</div>`;
 closeMiniMenus();$('guideModal').classList.add('show');
}

function guideStatusHTML(g){
 const linked=(g&&guideSemanticCategory(g.cat)==='DINING'&&window.BOOKING_AUTHORITY&&g.key)?BOOKING_AUTHORITY.byPlace(g.key):null;
 const explicit=String(g.status||'').toLowerCase();
 const status=(linked&&String(linked.status||'').toLowerCase()==='confirmed')||explicit==='booked'
  ?'BOOKED'
  :(explicit==='optional'?'OPTIONAL':'PLANNED');
 return `<span class="guide-status guide-status-${status.toLowerCase()}">${status}</span>`;
}
function copyGuideAddress(key){
 const g=guidePlace(key); if(!g?.address)return;
 const text=`${g.title}\n${g.address}`;
 const done=()=>{if(typeof showToast==='function')showToast('Address copied');};
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));}
 else fallbackCopy(text,done);
}
function fallbackCopy(text,done){const box=document.createElement('textarea');box.value=text;box.setAttribute('readonly','');box.style.position='fixed';box.style.opacity='0';document.body.appendChild(box);box.select();try{document.execCommand('copy');done();}catch(e){}box.remove();}
function usefulGoodToKnow(items){
 const generic=[/currently planned/i,/recommended only/i,/optional rather than essential/i,/keep .* flexible/i,/validation build/i];
 return (items||[]).filter(x=>x&&generic.every(rule=>!rule.test(x)));
}
function guideDescription(g){
 const explicit=String(g.description||'').trim();
 if(explicit||Object.prototype.hasOwnProperty.call(g,'description'))return explicit;
 return String(g.desc||'').trim();
}
function guideUsefulInfoItems(g){
 const explicit=Array.isArray(g.usefulInfo)?g.usefulInfo:(String(g.usefulInfo||'').trim()?String(g.usefulInfo).split(/\n+/):[]);
 if(explicit.length||Object.prototype.hasOwnProperty.call(g,'usefulInfo'))return uniqueGuideItems(explicit);
 const legacy=[...(g.signature||[]),...(g.highlights||[]),...(g.worth||[]),...(g.tips||[]),...(g.notes||[]),...(g.practical||[])];
 if(g.bookingNote)legacy.push(g.bookingNote);
 return uniqueGuideItems(legacy.map(cleanGuideLine));
}
function guideCoreSections(g,key){
 const description=guideDescription(g);
 const useful=guideUsefulInfoItems(g);
 return `${description?`<section class="guide-content-section guide-about"><h3>About</h3><p>${description}</p></section>`:''}${guideListSection('Useful info',useful,'guide-useful-info')}`;
}

function guideAlternativeLinksHTML(g){
 const rows=Array.isArray(g&&g.alternativeGuides)?g.alternativeGuides:[];
 if(!rows.length)return '';
 return `<section class="guide-content-section guide-alternatives-by-day"><h3>Alternatives by Day</h3><div class="quick-info-actions">${rows.map(function(row){
   const prefix=row.day?`${row.day} · `:'';
   const note=row.note?` — ${row.note}`:'';
   return `<button class="utility-button" type="button" onclick="openGuideModal('${String(row.placeId||'').replace(/'/g,"\'")}')">${prefix}${row.label||'Alternative'}${note} · Open Guide</button>`;
 }).join('')}</div></section>`;
}
function quickInfoInnerHTML(g,key){
 const phoneRow=g.phone?`<div class="quick-info-row"><span class="quick-info-icon">☎️</span><span><span class="quick-info-label">Phone</span><span class="quick-info-value">${g.phone}</span></span></div>`:'';
 const callButton=g.phone?`<a class="utility-button" href="tel:${String(g.phone).replace(/[^+\d]/g,'')}">☎️ Call</a>`:'';
 const unknown=/^(see|look at|refer to)\s+trip\s+info$|^check (current|live)|^prices? may vary$|^contact venue/i;
 const placePrice=String(g.price||'').trim();
 const accommodationBooking=(g.cat==='STAY'&&window.BOOKING_AUTHORITY)?BOOKING_AUTHORITY.byPlace(key):null;
 const bookingPrice=String(accommodationBooking?.price||'').trim();
 // Accommodation commercial details have one canonical owner: BOOKINGS_DATA.
 // This prevents Guide cards losing prices when place content is edited independently.
 const price=(bookingPrice&&!unknown.test(bookingPrice))?bookingPrice:placePrice;
 const showPrice=g.cat!=='STAY'&&g.cat!=='ACTIVITIES'&&price&&!unknown.test(price);
 const priceRow=showPrice?`<div class="quick-info-row"><span class="quick-info-icon">💰</span><span><span class="quick-info-label">Price</span><span class="quick-info-value">${price}</span></span></div>`:'';
 const hours=String(g.hours||'').trim();
 const hoursRow=hours?`<div class="quick-info-row"><span class="quick-info-icon">🕒</span><span><span class="quick-info-label">Hours</span><span class="quick-info-value">${hours}</span></span></div>`:'';
 const address=String(g.address||'').trim();
 const addressRow=address?`<div class="quick-info-row"><span class="quick-info-icon">📍</span><span><span class="quick-info-label">Address</span><span class="quick-info-value">${address}</span></span></div>`:'';
 const copyButton=address?`<button class="utility-button" type="button" onclick="copyGuideAddress('${key}')">📍 Copy Address</button>`:'';
 const navHref=address?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${g.title||''}, ${address}`)}`:g.maps;
 const navButton=navHref?`<a class="map-button" href="${navHref}" target="_blank" rel="noopener">🧭 Navigate</a>`:'';
 const website=String(g.website||g.url||'').trim();
 const websiteButton=website?`<a class="utility-button" href="${website}" target="_blank" rel="noopener">🌐 Website</a>`:'';
 const roleBadge=g.itineraryRole?`<span class="itinerary-role-badge">${g.itineraryRole}</span>`:'';
 const reminder=String(g.visitorReminder||'').trim();
 const reminderRow=(reminder&&g.cat!=='ACTIVITIES')?`<p class="visitor-reminder"><strong>Reminder:</strong> ${reminder}</p>`:'';
 const linkedBooking=window.BOOKING_AUTHORITY?BOOKING_AUTHORITY.byPlace(key):null;
 const bookingStatus=linkedBooking?String(linkedBooking.displayStatus||linkedBooking.status||'').toUpperCase():'';
 const bookingRow='';
 const bookingButton=linkedBooking?`<button class="utility-button" type="button" onclick="openGuideLinkedBooking('${linkedBooking.id}')">🎟️ Booking</button>`:'';
 const parking=g.parking;
 const parkingHTML=parking?`<div class="recommended-parking"><div class="recommended-parking-head"><span>🚗</span><span><strong>Recommended Parking</strong><small>${parking.name||''}</small></span></div><div class="recommended-parking-grid"><p><span>📍</span><span>${parking.address||''}</span></p><p><span>🚶</span><span>${parking.walk||''}</span></p><p><span>💰</span><span>${parking.fee||''}</span></p></div>${parking.note?`<p class="recommended-parking-note">${parking.note}</p>`:''}${parking.maps?`<a class="map-button recommended-parking-nav" href="${parking.maps}" target="_blank" rel="noopener">🧭 Navigate to Parking</a>`:''}</div>`:'';
 const detailStatus=g.cat==='STAY'?guideStayStatusHTML(Object.assign({key},g)):guideStatusHTML(Object.assign({key},g));
 const coreSections=guideCoreSections(g,key);
 const currencyOptions=Array.isArray(g.currencyOptions)?g.currencyOptions:[];
 const currencyOptionsHTML=currencyOptions.length?`<div class="currency-option-list">${currencyOptions.map(option=>`<article class="currency-option-card"><div class="currency-option-head"><strong>${option.icon||'💱'} ${option.name||''}</strong><span>${option.best||''}</span></div><p>${option.note||''}</p><p class="currency-option-address">📍 ${option.address||''}</p>${option.maps?`<a class="map-button" href="${option.maps}" target="_blank" rel="noopener">🧭 Navigate</a>`:''}</article>`).join('')}</div>`:'';
 return `<div class="quick-info-top"><span class="category-tag">${g.categoryLabel||g.cat||'Guide'}</span>${roleBadge}</div><div class="quick-info-grid">${addressRow}${phoneRow}${hoursRow}${priceRow}${bookingRow}${visitDayHTML(key)}</div>${coreSections}${guideAlternativeLinksHTML(g)}${currencyOptionsHTML}${reminderRow}${parkingHTML}<div class="quick-info-actions">${navButton}${websiteButton}${callButton}${bookingButton}</div>`;
}

function quickInfoHTML(g,key){
 return `<div class="quick-info-card">${quickInfoInnerHTML(g,key)}</div>`;
}

function guideCategoryForKey(key){return GUIDE_NAVIGATION.categoryFor(key);}
function guideCategoryKeys(key){return GUIDE_NAVIGATION.sequenceFor(key);}
function guideNavModel(key){
 const nav=GUIDE_NAVIGATION.neighbours(key);
 return {keys:nav.sequence,idx:nav.position?nav.position-1:-1,prev:nav.previous||'',next:nav.next||'',position:nav.position,total:nav.total};
}
function guideNavButtons(key,mode){
 const nav=guideNavModel(key);
 if(nav.total<2||nav.idx<0)return '';
 const open=mode==='page'?'openAdjacentPlace':'openGuideModal';
 const prev=nav.prev?`<button class="pill" onclick="${open}('${nav.prev}')">‹ Previous</button>`:`<button class="pill" disabled aria-disabled="true">‹ Previous</button>`;
 const next=nav.next?`<button class="pill" onclick="${open}('${nav.next}')">Next ›</button>`:`<button class="pill" disabled aria-disabled="true">Next ›</button>`;
 return `<div class="guide-browse-meta">${nav.position} / ${nav.total}</div><div class="guide-next-row">${prev}${next}</div>`;
}
function openAdjacentPlace(key){
 if(!guidePlace(key))return;
 NAVIGATION.go(placeHref(key));
}

function cleanGuideLine(value){
 const text=String(value||'').trim();
 return text.replace(/^[A-Z][A-Z &/’'\-]{1,28}\s*[·:]\s*/,'').trim();
}
function taggedGuideItems(items, labels){
 const wanted=(labels||[]).map(x=>String(x).toUpperCase());
 return (items||[]).map(value=>{
  const text=String(value||'').trim();
  const match=text.match(/^([A-Z][A-Z &/’'\-]{1,28})\s*[·:]\s*(.+)$/);
  if(!match)return null;
  const label=match[1].trim().toUpperCase();
  return wanted.some(w=>label===w||label.startsWith(w))?match[2].trim():null;
 }).filter(Boolean);
}
function uniqueGuideItems(items){
 return [...new Set((items||[]).map(x=>String(x||'').trim()).filter(Boolean))];
}
function guideWhyGo(g){
 const tagged=taggedGuideItems(g.signature||g.highlights||[],['WHY GO','WHY WE PICKED THIS','WHY STOP','WHY WE CHOSE IT','WHY STAY']);
 return tagged[0]||String(g.desc||'').trim();
}
function restaurantDishItems(g){
 const explicit=uniqueGuideItems(g.signatureDishes||[]);
 if(explicit.length)return explicit;
 const tagged=taggedGuideItems(g.signature||g.highlights||[],['TRY','FOOD','MUST ORDER','ORDER','SIGNATURE']);
 if(tagged.length)return uniqueGuideItems(tagged);
 // Reconciled Master files historically stored restaurant signatures as plain array items.
 // Preserve those useful, curated items instead of rendering an empty section.
 return uniqueGuideItems(g.signature||[]).map(cleanGuideLine);
}
function bookingAdviceItems(g){
 const all=[...(g.signature||[]),...(g.worth||[]),...(g.tips||[])];
 return uniqueGuideItems(all.filter(x=>/book|reservation|reserve|sell out|deposit/i.test(String(x))).map(cleanGuideLine));
}
function practicalGuideItems(g){
 const all=[...(g.signature||[]),...(g.worth||[]),...(g.tips||[])];
 const excluded=/^(WHY GO|WHY WE PICKED THIS|WHY STOP|WHY WE CHOSE IT|WHY STAY|TRY|FOOD|MUST ORDER|ORDER|SIGNATURE|WORTH IT|SUGGESTED TIME|BEST TIME|ROUTE FIT)\s*[·:]/i;
 return uniqueGuideItems(all.filter(x=>{
  const text=String(x||'').trim();
  if(!text||excluded.test(text))return false;
  if(g.cat==='STAY'&&/check[- ]?in|reception|late arrival/i.test(text))return false;
  if(/book|reservation|reserve|sell out|deposit/i.test(text))return false;
  return true;
 }).map(cleanGuideLine));
}
function guideListSection(title,items,cls=''){
 const clean=uniqueGuideItems(items);
 if(!clean.length)return '';
 return `<section class="guide-content-section ${cls}"><h3>${title}</h3><ul>${clean.map(x=>`<li>${x}</li>`).join('')}</ul></section>`;
}
function criticalGuideItems(g){
 return practicalGuideItems(g).filter(item=>/pre[- ]?book|required|arrive|depart|promptly|weather|cash only|limited (mobile|reception|signal)|last (entry|admission)|closed|sell out|pickup|delivery|parking/i.test(String(item)));
}
function guideShopSections(g){
 if(g.cat!=='SHOP'&&g.cat!=='SHOPPING')return '';
 const why=guideWhyGo(g);
 const rawHours=String(g.hours||'').trim();
 const hours=/出發前|before (departure|visit)|reconfirm|confirm.*hours/i.test(rawHours)?'':rawHours;
 const all=practicalGuideItems(g);
 const parking=all.filter(item=>/park/i.test(String(item)));
 const critical=criticalGuideItems(g).filter(item=>!parking.includes(item));
 return `${why?`<section class="guide-content-section guide-why-go"><h3>Why Stop</h3><p>${why}</p></section>`:''}${hours?`<section class="guide-content-section guide-trading-hours"><h3>Trading Hours</h3><p>${hours}</p></section>`:''}${guideListSection('Parking',parking,'guide-parking-info')}${guideListSection('Good to Know',critical,'guide-practical-info')}`;
}
function compactGuideSections(g){
 const why=guideWhyGo(g);
 const dishes=g.cat==='DINING'?restaurantDishItems(g):[];
 const booking=bookingAdviceItems(g);
 const practical=practicalGuideItems(g);
 const whyRequired=g.cat==='DINING'||g.cat==='ACTIVITIES'||g.cat==='ATTRACTIONS';
 const rawHours=String(g.hours||'').trim();
 const meaningfulHours=rawHours&&!/出發前|before (departure|visit)|reconfirm|confirm.*hours/i.test(rawHours);
 const hours=(g.cat==='DINING'&&meaningfulHours)
  ? `<section class="guide-content-section guide-trading-hours"><h3>Trading Hours</h3><p>${rawHours}</p></section>`
  : '';
 const goodToKnow=g.cat==='DINING'?criticalGuideItems(g):practical;
 return `${(why&&(whyRequired||g.cat!=='STAY'))?`<section class="guide-content-section guide-why-go"><h3>Why Go</h3><p>${why}</p></section>`:''}${guideListSection('Signature / Must Try',dishes,'guide-suggested-dishes')}${hours}${guideListSection('Booking',booking,'guide-booking-advice')}${guideListSection(g.cat==='DINING'?'Good to Know':'Practical Info',goodToKnow,'guide-practical-info')}`;
}


function guideAttractionSections(g){
 if(g.cat!=='ATTRACTIONS')return '';
 const why=guideWhyGo(g);
 const raw=[...(g.signature||[]),...(g.highlights||[])];
 const highlights=uniqueGuideItems(raw.filter(x=>!/^WHY (GO|STOP|WE PICKED THIS|WE CHOSE IT|STAY)|^SUGGESTED TIME|^BEST TIME|^ROUTE FIT|^NOTE/i.test(String(x))).map(cleanGuideLine));
 const guideType=String(g.guideType||'').toUpperCase();
 const admission=guideType==='ADMISSION';
 const timedEntry=admission||guideType==='MARKET';
 const hours=timedEntry&&String(g.hours||'').trim()?String(g.hours).trim():'';
 const price=admission&&String(g.price||'').trim()?String(g.price).trim():'';
 const practical=practicalGuideItems(g).filter(item=>![...highlights,hours,price].includes(item));
 return `${why?`<section class="guide-content-section guide-why-go"><h3>Why Go</h3><p>${why}</p></section>`:''}${guideListSection('Highlights',highlights,'guide-attraction-highlights')}${hours?`<section class="guide-content-section guide-opening-hours"><h3>Opening Hours</h3><p>${hours}</p></section>`:''}${price?`<section class="guide-content-section guide-admission"><h3>Admission</h3><p>${price}</p></section>`:''}${guideListSection('Good to Know',criticalGuideItems(g).filter(item=>![...highlights,hours,price].includes(item)),'guide-practical-info')}`;
}

function guideExperienceSections(g,key){
 if(g.cat!=='ACTIVITIES')return '';
 const linked=window.BOOKING_AUTHORITY?BOOKING_AUTHORITY.byPlace(key):null;
 const why=guideWhyGo(g);
 const highlights=uniqueGuideItems((g.signature||[]).filter(x=>!/^WHY (GO|WE PICKED THIS)|^BOOKING|^TIME|^SUGGESTED TIME|^NOTE|^ROLE/i.test(String(x))).map(cleanGuideLine));
 const booking=[];
 const bookingTime=String(linked?.time||g.experienceTime||'').trim();
 const bookingNote=String(g.bookingNote||'').trim();
 if(bookingTime)booking.push(bookingTime);
 if(bookingNote)booking.push(bookingNote);
 const duration=String(linked?.duration||g.duration||'').trim();
 const meeting=String(linked?.meetingPoint||linked?.pickupAddress||g.meetingPoint||'').trim();
 const arrival=String(linked?.checkInRequirement||g.arrival||'').trim();
 const practical=practicalGuideItems(g).filter(item=>![...booking,duration,meeting,arrival].includes(item));
 return `${why?`<section class="guide-content-section guide-why-go"><h3>Why Go</h3><p>${why}</p></section>`:''}${guideListSection('Highlights',highlights,'guide-experience-highlights')}${guideListSection('Booking',booking,'guide-experience-booking')}${duration?`<section class="guide-content-section guide-experience-duration"><h3>Duration</h3><p>${duration}</p></section>`:''}${meeting?`<section class="guide-content-section guide-experience-meeting"><h3>Meeting Point</h3><p>${meeting}</p></section>`:''}${arrival?`<section class="guide-content-section guide-experience-arrival"><h3>Arrive</h3><p>${arrival}</p></section>`:''}${guideListSection('Good to Know',criticalGuideItems(g).filter(item=>![...booking,duration,meeting,arrival].includes(item)),'guide-practical-info')}`;
}

function guideStaySections(g){
 if(g.cat!=='STAY')return '';
 const booking=window.BOOKING_AUTHORITY?BOOKING_AUTHORITY.byPlace(g.key):null;
 const stay=[];
 if(booking?.nights)stay.push(`${booking.nights} night${Number(booking.nights)===1?'':'s'}`);
 if(booking?.guests)stay.push(`${booking.guests} guest${Number(booking.guests)===1?'':'s'}`);
 const useful=practicalGuideItems(g).filter(item=>!stay.includes(item));
 const why=guideWhyGo(g);
 const showWhy=!!why;
 return `${guideListSection('Stay',stay,'guide-stay-info')}${guideListSection('Useful',useful,'guide-stay-useful')}${showWhy?`<section class="guide-stay-section guide-why-go"><h3>Why Stay</h3><p>${why}</p></section>`:''}`;
}

let guideAlternativeKeys=[];
function openGuideAlternatives(keys,itemId){
 guideAlternativeKeys=[...keys];
 const rows=guideAlternativeKeys.map(key=>{
  const g=guidePlace(key);
  return `<button type="button" onclick="openGuideModal('${key}',{fromAlternatives:true})"><span><span class="guide-list-title">${g.emoji||''} ${g.title||''}</span><span class="guide-list-sub">${g.sub||''}</span></span><span class="guide-list-chevron">›</span></button>`;
 }).join('');
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>Options</h2><div class="category-pop-list">${rows}</div>`;
 $('guideModal').classList.add('show');
 window.bringContentOverlayToFront?.($('guideModal'));
 const sheet=document.querySelector('#guideModal .guide-sheet');if(sheet)sheet.scrollTop=0;
}
function guideAlternativeBackButton(){
 return guideAlternativeKeys.length>1?`<button class="pill guide-alternative-back" type="button" onclick="openGuideAlternatives(guideAlternativeKeys)">‹ All options</button>`:'';
}

function routeStopsHTML(g){
 const stops=Array.isArray(g.routeStops)?g.routeStops:[];
 if(!stops.length)return '';
 const rows=stops.map((stop,index)=>`<li class="walking-route-stop"><span class="walking-route-number">${index+1}</span><span><strong>${stop.name||''}</strong><small>📍 ${stop.address||''}${stop.time?` · ⏱ ${stop.time}`:''}</small><p>${stop.look||''}</p></span></li>`).join('');
 return `<section class="walking-route-card"><h3>Suggested Walking Order</h3><ol>${rows}</ol></section>`;
}

function guideStudioButton(key){return (window.isAdminMode&&window.isAdminMode())?`<button class="pill guide-studio-edit" type="button" onclick="openGuideEdit('${key}')">Edit Guide</button>`:'';}
function guideEditLines(value){return Array.isArray(value)?value.join('\n'):String(value||'');}
function isGuideEditActive(){
 const modal=$('guideModal');
 return !!(modal?.classList.contains('show') && $('guideEditForm'));
}
window.isGuideEditActive=isGuideEditActive;
function openGuideEdit(key){
 const g=guidePlace(key);if(!g||!(window.isAdminMode&&window.isAdminMode()))return;
 const f=(label,name,value,area)=>`<label class="guide-edit-field"><span>${label}</span>${area?`<textarea name="${name}">${String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</textarea>`:`<input name="${name}" value="${String(value||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">`}</label>`;
 $('guideModalContent').innerHTML=`<div class="guide-onepage guide-edit-form"><p class="kicker">TRIP STUDIO · GUIDE</p><h2>Edit Guide</h2><form id="guideEditForm" onsubmit="event.preventDefault();saveGuideEdit('${key}')">${f('Place name','title',g.title)}${f('Address','address',g.address)}${f('Phone','phone',g.phone)}${f('Website / link','website',g.website||g.url)}${f('Opening hours','hours',g.hours)}${f('Description / About','description',guideDescription(g),true)}${f('Useful info — one item per line','usefulInfo',guideUsefulInfoItems(g).join('\n'),true)}<div class="guide-edit-actions"><button class="pill" type="button" onclick="openGuideModal('${key}')">Cancel</button><button class="btn primary-action" type="submit">Save Guide</button></div></form></div>`;
}
function saveGuideEdit(key){
 const form=$('guideEditForm');if(!form)return;const fd=new FormData(form);
 const patch={title:String(fd.get('title')||'').trim(),address:String(fd.get('address')||'').trim(),phone:String(fd.get('phone')||'').trim(),website:String(fd.get('website')||'').trim(),hours:String(fd.get('hours')||'').trim(),description:String(fd.get('description')||'').trim(),usefulInfo:String(fd.get('usefulInfo')||'').split(/\n+/).map(x=>x.trim()).filter(Boolean)};
 Object.assign(patch,{desc:'',sub:'',price:'',bookingNote:'',signature:[],highlights:[],worth:[],tips:[],notes:[],practical:[]});
 try{
  GUIDE_AUTHORITY.save(key,patch);
  openGuideModal(key);
 }catch(error){
  // Keep the edit form and typed values intact when local persistence fails.
  let alert=form.querySelector('[data-guide-save-error]');
  if(!alert){alert=document.createElement('p');alert.setAttribute('data-guide-save-error','');alert.setAttribute('role','alert');alert.style.cssText='color:#b42318;font-weight:600;margin:12px 0';form.prepend(alert)}
  alert.textContent='Guide not saved. Local storage error — your edits remain in this form. Please do not close or refresh this page.';
  console.error('[Guide save]',error);
 }

}

window.openGuideEdit=openGuideEdit;window.saveGuideEdit=saveGuideEdit;
function openGuideModal(key,options){
 const g=guidePlace(key);if(!g)return;
 const tripModal=document.getElementById('tripModal');
 const guideModal=document.getElementById('guideModal');
 if(tripModal?.classList.contains('show')){
  document.body.classList.add('guide-booking-stack-open','guide-foreground-over-booking');
  if(guideModal)guideModal.classList.remove('guide-backgrounded-for-booking');
 }
 const opts=options||{};
 const back=opts.fromAlternatives?guideAlternativeBackButton():'';
 $('guideModalContent').innerHTML=`<div class="guide-onepage">${back}<p class="kicker">Guide</p><h2>${g.emoji} ${g.title}</h2>${quickInfoHTML(g,key)}${routeStopsHTML(g)}${guideStudioButton(key)}${guideNavButtons(key)}</div>`;
 closeMiniMenus();
 $('guideModal').classList.add('show');
 window.bringContentOverlayToFront?.($('guideModal'));
 const sheet=document.querySelector('#guideModal .guide-sheet');
 if(sheet){sheet.scrollTop=0;if(typeof window.applyNearFitModal==='function')window.applyNearFitModal(sheet,'guide-near-fit');}
}
function restoreGuideTimelineOrigin(){
 const raw=window.GUIDE_MODAL_RETURN_SCROLL_Y;
 const returnScroll=(typeof raw==='number'&&Number.isFinite(raw))?raw:null;
 const itemId=window.GUIDE_MODAL_RETURN_ITEM_ID||null;
 window.GUIDE_MODAL_RETURN_SCROLL_Y=null;
 window.GUIDE_MODAL_RETURN_ITEM_ID=null;
 if(returnScroll===null)return;
 const restore=()=>window.scrollTo({top:returnScroll,left:0,behavior:'auto'});
 requestAnimationFrame(()=>requestAnimationFrame(()=>{restore();setTimeout(restore,60);}));
}
function closeGuideModal(){
 if(isGuideEditActive())return false;
 if(typeof window.dismissAllContentOverlays==='function')return window.dismissAllContentOverlays();
 const modal=$('guideModal');if(modal)modal.classList.remove('show');
 return true;
}

function renderPlacePage(key){
  const g = guidePlace(key);
  const mount = document.getElementById('placeMain');
  if(!g || !mount) return;
  mount.innerHTML = `
<button class="place-detail-close" type="button" aria-label="Close place detail" onclick="closePlaceDetail()">×</button>
<div class="page-hero"><p class="kicker">Guide</p><h1>${g.emoji} ${g.title}</h1><p class="lead">${g.sub||''}</p></div>
<section aria-label="Guide details" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
${routeStopsHTML(g)}${guideNavButtons(key,'page')}`;
  document.title = `${g.title} · ${TRIP_CONFIG.tripName}`;
}

function renderPlaceGroupPage(keys){
  const clean=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>key&&guidePlace(key)))];
  const mount=document.getElementById('placeMain');
  if(!clean.length||!mount) return;
  // Defensive auto-routing for old/shared links containing a single id.
  if(clean.length===1){ renderPlacePage(clean[0]); return; }
  const cards=clean.map((key,index)=>{
    const g=guidePlace(key);
    return `<article class="place-group-card" id="guide-${key}">
      <div class="page-hero place-group-hero"><p class="kicker">Option ${index+1}</p><h1>${g.emoji} ${g.title}</h1><p class="lead">${g.sub||''}</p></div>
            <section aria-label="Guide details" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
      ${routeStopsHTML(g)}
    </article>`;
  }).join('');
  mount.innerHTML=`<button class="place-detail-close" type="button" aria-label="Close guide options" onclick="closePlaceDetail()">×</button><div class="page-hero"><p class="kicker">Guide</p><h1>Choose an option</h1><p class="lead">Compare the planned choices, then use Navigate inside the restaurant card you choose.</p></div>${cards}`;
  document.title=`Guide options · ${TRIP_CONFIG.tripName}`;
}
