/* ============================================================================
   TRAVEL ENGINE — GUIDE & PLACE MODULE
   Stage 7K-2D
   Owns Guide navigation context, category/place modal flow, shopping directory
   view, place page rendering and guide-specific copy/address behavior.
   Shared DOM/menu helpers remain in script.js and are available before this
   module loads.
   ============================================================================ */
const PRODUCTION_GUIDE=GenerationSelectionAdapter.view('guide');
// Local-first Guide Studio overlay for the 25.6.6 prototype. The canonical
// production projection stays frozen; the view below is an editable clone.
const GUIDE_STUDIO_KEY=String(TRIP_CONFIG.storageNamespace)+':guide_studio_fields:v1';
const GUIDE_STUDIO_VIEW={places:JSON.parse(JSON.stringify(PRODUCTION_GUIDE.places))};
try {
  const persisted=JSON.parse(localStorage.getItem(GUIDE_STUDIO_KEY)||'{}');
  Object.keys(persisted).forEach(key=>{
    if(GUIDE_STUDIO_VIEW.places[key]&&persisted[key]&&typeof persisted[key]==='object')
      Object.assign(GUIDE_STUDIO_VIEW.places[key],persisted[key]);
  });
}catch(e){console.warn('Guide Studio local overlay unavailable',e);}
function guideStudioEscape(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function guideStudioForm(key){
  if(!(window.isAdminMode&&window.isAdminMode()))return '';
  const g=GUIDE_STUDIO_VIEW.places[key];if(!g)return '';
  const optional=['sub','desc','address','phone','whatsapp','email','website','maps','hours','price','transport','signature','worth','tips','highlights','status','categoryLabel','instagramUrl','facebookUrl','bookingUrl','parking','source'];
  const controls=[...new Set([...Object.keys(g),...optional])].filter(field=>!['key','id','createdAt','updatedAt','updatedBy'].includes(field)).sort().map(field=>{
    const value=g[field];
    if(value!=null && typeof value==='object'){
      return `<label class="booking-edit-field booking-edit-field--wide"><span>${guideStudioEscape(field)} (JSON)</span><textarea data-guide-field="${guideStudioEscape(field)}" data-guide-json="1" rows="3">${guideStudioEscape(JSON.stringify(value,null,2))}</textarea></label>`;
    }
    return `<label class="booking-edit-field booking-edit-field--wide"><span>${guideStudioEscape(field)}</span><textarea data-guide-field="${guideStudioEscape(field)}" rows="2">${guideStudioEscape(value)}</textarea></label>`;
  }).join('');
  return `<button class="pill guide-studio-open" type="button" onclick="openGuideStudio('${guideStudioEscape(key)}')">Edit Guide</button><div class="guide-studio-edit" id="guideStudioEditor" hidden><p class="kicker">Trip Studio · Guide</p><p class="timestamp">Only non-empty fields appear in the reader. Edits save locally; Export/Import transfers them to another device.</p><div class="booking-edit-grid">${controls}</div><button class="pill" type="button" onclick="saveGuideStudio('${guideStudioEscape(key)}')">Save Guide</button><button class="pill" type="button" onclick="exportGuideStudio()">Export Guide edits</button><button class="pill" type="button" onclick="importGuideStudio()">Import Guide edits</button></div>`;
}
function openGuideStudio(){const e=document.getElementById('guideStudioEditor');if(e)e.hidden=false;}
function saveGuideStudio(key){
  const editor=document.getElementById('guideStudioEditor'),record=GUIDE_STUDIO_VIEW.places[key];if(!editor||!record)return;
  const values={};
  for(const input of editor.querySelectorAll('[data-guide-field]')){
    const field=input.getAttribute('data-guide-field');let val=input.value.trim();
    if(input.dataset.guideJson==='1'){
      try{val=val?JSON.parse(val):null;}catch(e){alert('Invalid JSON in '+field);input.focus();return;}
    }
    values[field]=val;
  }
  try{
    const all=JSON.parse(localStorage.getItem(GUIDE_STUDIO_KEY)||'{}');
    all[key]=Object.assign({},all[key]||{},values);
    localStorage.setItem(GUIDE_STUDIO_KEY,JSON.stringify(all));
    Object.assign(record,values);
    openGuideModal(key);
  }catch(error){alert('Guide could not be saved locally: '+error.message);}
}
window.openGuideStudio=openGuideStudio;window.saveGuideStudio=saveGuideStudio;
// Portable Guide Studio overrides: deliberately manual, not represented as cloud sync.
// Export/import uses trip identity to prevent accidentally mixing two trips.
function exportGuideStudio(){
  if(!(window.isAdminMode&&window.isAdminMode()))return;
  let edits={};try{edits=JSON.parse(localStorage.getItem(GUIDE_STUDIO_KEY)||'{}');}catch(e){alert('Could not read Guide edits');return;}
  const payload={format:'companion-guide-edits',version:1,tripId:String(TRIP_CONFIG.storageNamespace),exportedAt:new Date().toISOString(),edits};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=payload.tripId+'-guide-edits.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function importGuideStudio(){
  if(!(window.isAdminMode&&window.isAdminMode()))return;
  const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
  input.onchange=async()=>{
    const file=input.files&&input.files[0];if(!file)return;
    try{
      if(file.size>1024*1024)throw Error('Guide edit file is too large');
      const payload=JSON.parse(await file.text());
      if(payload.format!=='companion-guide-edits'||payload.version!==1||payload.tripId!==String(TRIP_CONFIG.storageNamespace))throw Error('File does not belong to this trip');
      if(!payload.edits||typeof payload.edits!=='object'||Array.isArray(payload.edits))throw Error('Invalid Guide edits');
      const current=JSON.parse(localStorage.getItem(GUIDE_STUDIO_KEY)||'{}');let count=0;
      for(const [key,fields] of Object.entries(payload.edits)){
        if(!Object.prototype.hasOwnProperty.call(GUIDE_STUDIO_VIEW.places,key)||!fields||typeof fields!=='object'||Array.isArray(fields))continue;
        const allowed={};for(const [field,value] of Object.entries(fields)){
          if(['key','id','createdAt','updatedAt','updatedBy','__proto__','constructor','prototype'].includes(field))continue;
          if(!Object.prototype.hasOwnProperty.call(GUIDE_STUDIO_VIEW.places[key],field)&&!['sub','desc','address','phone','whatsapp','email','website','maps','hours','price','transport','signature','worth','tips','highlights','status','categoryLabel','instagramUrl','facebookUrl','bookingUrl','parking','source'].includes(field))continue;
          if(value!==null&&typeof value!=='string'&&typeof value!=='number'&&typeof value!=='boolean'&&!Array.isArray(value)&&typeof value!=='object')continue;
          allowed[field]=value;
        }
        if(Object.keys(allowed).length){current[key]=Object.assign({},current[key]||{},allowed);count++;}
      }
      if(!count)throw Error('No matching Guide fields found');
      if(!confirm('Import edits for '+count+' Guide places? Existing local fields with the same names will be replaced.'))return;
      localStorage.setItem(GUIDE_STUDIO_KEY,JSON.stringify(current));
      for(const [key,fields] of Object.entries(current))if(GUIDE_STUDIO_VIEW.places[key])Object.assign(GUIDE_STUDIO_VIEW.places[key],fields);
      alert('Imported '+count+' Guide places.');location.reload();
    }catch(e){alert('Guide import failed: '+e.message);}
  };
  input.click();
}
window.exportGuideStudio=exportGuideStudio;window.importGuideStudio=importGuideStudio;



function visitDayHTML(key){
  const days=GUIDE_NAVIGATION.dayLinks(key);
  if(!days.length) return '';
  const place=GUIDE_STUDIO_VIEW.places[key]||{};
  if(place.cat==='STAY') return '';
  const buttons=days.map(([label,href])=>`<a class="day-jump-button" href="${href}">${label} →</a>`).join('');
  return `<div class="quick-info-row visit-row"><span class="quick-info-icon">📅</span><span><span class="quick-info-label">Visit Day</span><span class="quick-info-value day-link-row">${buttons}</span></span></div>`;
}


function placeHref(key){
  return NAVIGATION.build('place',{query:{placeId:key}});
}
function guideBookingHref(bookingId){
  return NAVIGATION.build('trip',{query:{bookingId:bookingId}});
}
function openGuideLinkedBooking(bookingId){
  const booking=window.BOOKING_AUTHORITY?BOOKING_AUTHORITY.get(bookingId):null;
  if(!booking)return;
  // Navigation contract: a Guide opened from Day Timeline is an intermediate layer.
  // Closing its linked Booking returns directly to Timeline; Guide-origin flows return to Guide.
  window.TRIP_MODAL_RETURN_TO_GUIDE=window.GUIDE_MODAL_ORIGIN!=='timeline';
  document.body.classList.add('guide-booking-stack-open');
  if(booking.type==='activity'){
    openActivityBookingDetail(bookingId,booking);
    return;
  }
  openAccommodationDetail(bookingId,booking);
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
  const clean=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>key&&typeof GUIDE_STUDIO_VIEW.places!=='undefined'&&GUIDE_STUDIO_VIEW.places[key]&&!excluded.has(key)))];
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
 const raw=Array.isArray(globalThis.TRIP_SHOPPING_DIRECTORY_CARDS)?globalThis.TRIP_SHOPPING_DIRECTORY_CARDS:[];
 const day=Number(requestedDay)||0;
 const cards=day?raw.filter(card=>shoppingDirectoryDay(card)===day):raw;
 const config=(globalThis.TRIP_CONFIG&&TRIP_CONFIG.shoppingDirectory)||{};
 const dayLabels=config.dayLabels||{};
 const dayNumbers=[...new Set(raw.map(card=>shoppingDirectoryDay(card)).filter(Boolean))].sort((a,b)=>a-b);
 const section=(label,rows)=>rows.length?`<section class="directory-route-group"><h3>${label}</h3><div class="directory-route-grid">${rows.join('')}</div></section>`:'';
 const grouped=day
   ? section(dayLabels[day]||`Day ${day}`,cards)
   : dayNumbers.map(n=>section(dayLabels[n]||`Day ${n}`,raw.filter(card=>shoppingDirectoryDay(card)===n))).join('');
 const optional=day?'':section(config.optionalLabel||'Optional Detours',raw.filter(card=>!shoppingDirectoryDay(card)));
 const title=day?`🛍 Day ${day} Shopping Directory`:(config.title||'🛍 Shopping Directory');
 const lead=day?(config.dayLead||'Nearby options for this day. Choose what suits the time and energy available.'):(config.lead||'Browse by day or neighbourhood and choose what fits.');
 $('guideModalContent').innerHTML=`<p class="kicker">Shopping Directory</p><h2>${title}</h2><p class="lead">${lead}</p><div class="directory-grid">${grouped}${optional}</div>`;
 closeMiniMenus();$('guideModal').classList.add('show');
 const sheet=document.querySelector('#guideModal .guide-sheet');if(sheet)sheet.scrollTop=0;
}
window.addEventListener('hashchange',applyGuideHashView);
document.addEventListener('DOMContentLoaded',applyGuideHashView);
function openRequestedGuideCard(){
 const key=NAVIGATION.getQuery('placeId','') || NAVIGATION.getQuery('legacyPlaceId','');
 if(!key || !GUIDE_STUDIO_VIEW.places[key]) return;
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
  .map(item=>{const key=typeof item==='string'?item:item&&item.key;if(!key||seen.has(key))return null;seen.add(key);return GUIDE_STUDIO_VIEW.places[key]?Object.assign({key},GUIDE_STUDIO_VIEW.places[key]):null;})
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
 // Guide is experiential content. Booking operations remain in Trip · Accommodation.
 const action=`openGuideModal('${item.key}')`;
 const status=item.cat==='STAY'?guideStayStatusHTML(item):guideStatusHTML(Object.assign({key:item.key},GUIDE_STUDIO_VIEW.places[item.key]||{}));
 const booking=(item.cat==='STAY'&&window.BOOKING_AUTHORITY)?BOOKING_AUTHORITY.byPlace(item.key):null;
 const subtitle=booking?[booking.stayDates||'',booking.nights?`${booking.nights} night${Number(booking.nights)===1?'':'s'}`:''].filter(Boolean).join(' · '):(item.sub||'');
 return `<button onclick="${action}"><span><span class="guide-list-title">${item.emoji} ${item.title}</span><span class="guide-list-sub">${subtitle}</span></span><span class="guide-list-meta">${status}<span class="guide-list-chevron">›</span></span></button>`;
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
  const directoryRow=`<button onclick="openShoppingDirectoryView()"><span><span class="guide-list-title">🛍 Shopping Directory</span><span class="guide-list-sub">Optional shops · Near · Best with Day</span></span><span>↓</span></button>`;
  const rows=directoryRow+list.map(i=>guideListRow(i)).join('');
  $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>SHOP</h2><div class="category-pop-list">${rows}</div>`;
  closeMiniMenus();$('guideModal').classList.add('show');return;
 }
 const rows=groupedGuideRows(semantic,list);
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>${guideCategoryHeading(semantic)}</h2><div class="category-pop-list guide-category-grouped">${rows}</div>`;
 closeMiniMenus();$('guideModal').classList.add('show');
}

function guideStatusHTML(g){
 const audit=String(g.audit||'');
 const optionalPattern=/optional|option|alternative|backup|recommended|flexible|weather-dependent/i;
 const linked=(g&&guideSemanticCategory(g.cat)==='DINING'&&window.BOOKING_AUTHORITY&&g.key)?BOOKING_AUTHORITY.byPlace(g.key):null;
 const explicit=String(g.status||'').toLowerCase();
 const status=(linked&&String(linked.status||'').toLowerCase()==='confirmed')||explicit==='booked'
  ?'BOOKED'
  :((explicit==='optional'||(!explicit&&optionalPattern.test(audit)))?'OPTIONAL':(explicit?explicit.toUpperCase():''));
 return status?`<span class="guide-status guide-status-${status.toLowerCase()}">${guideStudioEscape(status)}</span>`:'';
}
function copyGuideAddress(key){
 const g=GUIDE_STUDIO_VIEW.places[key]; if(!g?.address)return;
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
function guideCoreSections(g,key){
 const semantic=guideSemanticCategory(g.cat);
 const normalized=semantic===g.cat?g:Object.assign({},g,{cat:semantic});
 if(semantic==='STAY')return guideStaySections(Object.assign({key},normalized));
 if(semantic==='ACTIVITIES')return guideExperienceSections(normalized,key);
 if(semantic==='ATTRACTIONS')return guideAttractionSections(normalized);
 if(semantic==='SHOP')return guideShopSections(normalized);
 return compactGuideSections(normalized);
}

function guideContactLink(kind,value){
 const raw=String(value==null?'':value).trim();if(!raw)return '';
 if(kind==='phone'){
  const v=raw.replace(/[^0-9+]/g,'');return /^\+?[0-9]{5,16}$/.test(v)?'tel:'+v:'';
 }
 if(kind==='whatsapp'){
  const v=raw.replace(/[^0-9]/g,'');return /^[0-9]{7,15}$/.test(v)?'https://wa.me/'+v:'';
 }
 if(kind==='email')return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(raw)?'mailto:'+raw:'';
 if(kind==='website'||kind==='maps'){
  try{const u=new URL(raw);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch(_){return '';}
 }
 return '';
}
function guideContactButton(label,kind,value,klass='utility-button'){
 const url=guideContactLink(kind,value);if(!url)return '';
 const external=['whatsapp','website','maps'].includes(kind);
 return `<a class="${klass}" href="${guideStudioEscape(url)}"${external?' target="_blank" rel="noopener noreferrer"':''}>${label}</a>`;
}
function quickInfoInnerHTML(g,key){
 const phoneRow=g.phone?`<div class="quick-info-row"><span class="quick-info-icon">☎️</span><span><span class="quick-info-label">Phone</span><span class="quick-info-value">${g.phone}</span></span></div>`:'';
 const callButton=guideContactButton('☎️ Call','phone',g.phone);
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
 const hoursRow='';
 const address=String(g.address||'').trim();
 const addressRow=address?`<div class="quick-info-row"><span class="quick-info-icon">📍</span><span><span class="quick-info-label">Address</span><span class="quick-info-value">${address}</span></span></div>`:'';
 const copyButton=address?`<button class="utility-button" type="button" onclick="copyGuideAddress('${key}')">📍 Copy Address</button>`:'';
 const navButton=guideContactButton('🧭 Navigate','maps',g.maps,'map-button');
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
 return `<div class="quick-info-top"><span class="category-tag">${guideStudioEscape(g.categoryLabel||g.cat||'')}</span>${roleBadge}${detailStatus}</div><div class="quick-info-grid">${addressRow}${phoneRow}${hoursRow}${priceRow}${bookingRow}${visitDayHTML(key)}</div>${coreSections}${reminderRow}${parkingHTML}<div class="quick-info-actions">${navButton}${callButton}${guideContactButton('WhatsApp','whatsapp',g.whatsapp)}${guideContactButton('Email','email',g.email)}${guideContactButton('Website','website',g.website)}${bookingButton}</div>`;
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
 if(!GUIDE_STUDIO_VIEW.places[key])return;
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
  const g=GUIDE_STUDIO_VIEW.places[key];
  return `<button type="button" onclick="openGuideModal('${key}',{fromAlternatives:true})"><span><span class="guide-list-title">${g.emoji||''} ${g.title||''}</span><span class="guide-list-sub">${g.sub||''}</span></span><span class="guide-list-chevron">›</span></button>`;
 }).join('');
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>Options</h2><div class="category-pop-list">${rows}</div>`;
 $('guideModal').classList.add('show');
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

function openGuideModal(key,options){
 const g=GUIDE_STUDIO_VIEW.places[key];if(!g)return;
 const opts=options||{};
 const back=opts.fromAlternatives?guideAlternativeBackButton():'';
 $('guideModalContent').innerHTML=`<div class="guide-onepage">${back}<p class="kicker">Guide</p><h2>${g.emoji?g.emoji+' ':''}${g.title}</h2>${g.sub?`<p class="guide-onepage-sub"><strong>${guideStudioEscape(g.sub)}</strong></p>`:''}${quickInfoHTML(g,key)}${routeStopsHTML(g)}${guideStudioForm(key)}${guideNavButtons(key)}</div>`;
 closeMiniMenus();
 $('guideModal').classList.add('show');
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
 const shouldRestore=window.GUIDE_MODAL_ORIGIN==='timeline';
 window.GUIDE_MODAL_ORIGIN=null;
 const modal=$('guideModal');if(modal)modal.classList.remove('show');
 guideAlternativeKeys=[];
 closeMiniMenus();
 document.body.classList.remove('admin-overlay-open');
 clearGuideNavigationContext();
 if(shouldRestore)restoreGuideTimelineOrigin();
}

function renderPlacePage(key){
  const g = GUIDE_STUDIO_VIEW.places[key];
  const mount = document.getElementById('placeMain');
  if(!g || !mount) return;
  mount.innerHTML = `
<button class="place-detail-close" type="button" aria-label="Close place detail" onclick="closePlaceDetail()">×</button>
<div class="page-hero"><p class="kicker">Guide</p><h1>${g.emoji?g.emoji+' ':''}${g.title}</h1>${g.sub?`<p class="lead">${guideStudioEscape(g.sub)}</p>`:''}</div>
<section aria-label="Guide details" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
${routeStopsHTML(g)}${guideStudioForm(key)}${guideNavButtons(key,'page')}`;
  document.title = `${g.title} · ${TRIP_CONFIG.tripName}`;
}

function renderPlaceGroupPage(keys){
  const clean=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>key&&GUIDE_STUDIO_VIEW.places[key]))];
  const mount=document.getElementById('placeMain');
  if(!clean.length||!mount) return;
  // Defensive auto-routing for old/shared links containing a single id.
  if(clean.length===1){ renderPlacePage(clean[0]); return; }
  const cards=clean.map((key,index)=>{
    const g=GUIDE_STUDIO_VIEW.places[key];
    return `<article class="place-group-card" id="guide-${key}">
      <div class="page-hero place-group-hero"><p class="kicker">Option ${index+1}</p><h1>${g.emoji?g.emoji+' ':''}${g.title}</h1>${g.sub?`<p class="lead">${guideStudioEscape(g.sub)}</p>`:''}</div>
            <section aria-label="Guide details" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
      ${routeStopsHTML(g)}
    </article>`;
  }).join('');
  mount.innerHTML=`<button class="place-detail-close" type="button" aria-label="Close guide options" onclick="closePlaceDetail()">×</button><div class="page-hero"><p class="kicker">Guide</p><h1>Choose an option</h1><p class="lead">Compare the planned choices, then use Navigate inside the restaurant card you choose.</p></div>${cards}`;
  document.title=`Guide options · ${TRIP_CONFIG.tripName}`;
}
