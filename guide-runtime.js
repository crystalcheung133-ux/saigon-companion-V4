/* ============================================================================
   TRAVEL ENGINE — GUIDE & PLACE MODULE
   Stage 7K-2D
   Owns Guide navigation context, category/place modal flow, shopping directory
   view, place page rendering and guide-specific copy/address behavior.
   Shared DOM/menu helpers remain in script.js and are available before this
   module loads.
   ============================================================================ */
const PRODUCTION_GUIDE=GenerationSelectionAdapter.view('guide');

function visitDayHTML(key){
  const days=PRODUCTION_GUIDE.dayLinks[key]||[];
  if(!days.length) return '';
  const buttons=days.map(([label,href])=>`<a class="day-jump-button" href="${href}">${label} →</a>`).join('');
  return `<div class="quick-info-row visit-row"><span class="quick-info-icon">📅</span><span><span class="quick-info-label">Visit Day</span><span class="quick-info-value day-link-row">${buttons}</span></span></div>`;
}


function placeHref(key){
  return NAVIGATION.build('place',{query:{placeId:key}});
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
      savedAt:Date.now()
    }));
  }catch(e){}
}
function openGuideGroupFromDay(keys,itemId){
  const clean=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>key&&typeof PRODUCTION_GUIDE.places!=='undefined'&&PRODUCTION_GUIDE.places[key]))];
  if(!clean.length) return;
  const first=PRODUCTION_GUIDE.places[clean[0]]||{};
  const sourceUrl=NAVIGATION.currentRelativeUrl({hash:itemId||null});
  saveGuideNavigationContext(first.cat||'GUIDE',{sourceUrl,sourceType:'day'});
  // RC11K: confirmed single destinations open immediately. Only genuine alternatives show a choice page.
  NAVIGATION.go(clean.length===1 ? placeHref(clean[0]) : NAVIGATION.build('place',{query:{placeIds:clean.join(',')}}));
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
  clearGuideNavigationContext();
  NAVIGATION.go(target);
}


function applyGuideHashView(){}
function openShoppingDirectoryView(){
 closeGuideModal();closeMiniMenus();
 window.location.href='shopping.html';
}

const CAFE_KEYS=new Set(['running-bean','maison-marou','bakes','dreamers','cafe-apartments']);
function mappedGuideItems(keys){
 return (keys||[]).map(item=>{const key=typeof item==='string'?item:item&&item.key;return key&&PRODUCTION_GUIDE.places[key]?Object.assign({key},PRODUCTION_GUIDE.places[key]):null;}).filter(Boolean);
}
function guideCategoryItems(cat){
 let items=[];
 if(cat==='STAY') items=mappedGuideItems(PRODUCTION_GUIDE.categories.STAY);
 else if(cat==='SPA') items=mappedGuideItems(PRODUCTION_GUIDE.categories.WELLNESS);
 else if(cat==='SHOP') items=mappedGuideItems(PRODUCTION_GUIDE.categories.SHOPPING);
 else if(cat==='ATTRACTIONS') items=mappedGuideItems(PRODUCTION_GUIDE.categories.ATTRACTIONS);
 else if(cat==='CAFES') items=mappedGuideItems(PRODUCTION_GUIDE.order.filter(key=>CAFE_KEYS.has(key)));
 else if(cat==='EXPERIENCES') items=mappedGuideItems(PRODUCTION_GUIDE.categories.ACTIVITIES);
 else if(cat==='RESTAURANTS') items=mappedGuideItems((PRODUCTION_GUIDE.categories.DINING||[]).filter(item=>!CAFE_KEYS.has(typeof item==='string'?item:item&&item.key)));
 else if(cat==='EXPLORE') items=mappedGuideItems([...(PRODUCTION_GUIDE.categories.ATTRACTIONS||[]),...(PRODUCTION_GUIDE.categories.ACTIVITIES||[])]);
 else items=mappedGuideItems(PRODUCTION_GUIDE.categories[cat]);
 return items.filter(item=>!((TRIP_CONFIG.guide?.excludedPlaceIds||[]).includes(item.key)));
}
function guideCategoryHeading(cat){
 return ({STAY:'STAY',SPA:'SPA & WELLNESS',SHOP:'SHOPS',ATTRACTIONS:'ATTRACTIONS',CAFES:'CAFÉS',EXPERIENCES:'EXPERIENCES',RESTAURANTS:'RESTAURANTS',EXPLORE:'SIGHTS & ACTIVITIES'})[cat]||cat;
}
function openGuideCategory(cat){
 saveGuideNavigationContext(cat);
 const list=guideCategoryItems(cat).slice().sort((a,b)=>String(a.title||'').localeCompare(String(b.title||'')));
 if(cat==='SHOP'){
  const directoryRow=`<button onclick="openShoppingDirectoryView()"><span><span class="guide-list-title">🛍 Shopping Directory</span><span class="guide-list-sub">3 curated routes · Main stops + If Time Allows</span></span><span>›</span></button>`;
  const rows=directoryRow+list.map(i=>`<button onclick="openGuideModal('${i.key}')"><span><span class="guide-list-title">${i.emoji} ${i.title}</span><span class="guide-list-sub">${i.sub||''}</span></span><span class="guide-list-meta">${guideStatusHTML(PRODUCTION_GUIDE.places[i.key]||{})}<span class="guide-list-chevron">›</span></span></button>`).join('');
  $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>SHOP</h2><div class="category-pop-list">${rows}</div>`;
  closeMiniMenus();$('guideModal').classList.add('show');return;
 }
 const rows=list.map(i=>`<button onclick="openGuideModal('${i.key}')"><span><span class="guide-list-title">${i.emoji} ${i.title}</span><span class="guide-list-sub">${i.sub||''}</span></span><span class="guide-list-meta">${guideStatusHTML(PRODUCTION_GUIDE.places[i.key]||{})}<span class="guide-list-chevron">›</span></span></button>`).join('');
 $('guideModalContent').innerHTML=`<p class="kicker">Guide</p><h2>${guideCategoryHeading(cat)}</h2><div class="category-pop-list">${rows}</div>`;
 closeMiniMenus();$('guideModal').classList.add('show');
}

function guideStatusHTML(g){
 const audit=String(g.audit||'');
 const optionalPattern=/optional|option|alternative|backup|recommended|flexible|weather-dependent/i;
 const status=(g.status==='optional'||(!g.status&&optionalPattern.test(audit)))?'OPTIONAL':'PLANNED';
 return `<span class="guide-status guide-status-${status.toLowerCase()}">${status}</span>`;
}
function copyGuideAddress(key){
 const g=PRODUCTION_GUIDE.places[key]; if(!g?.address)return;
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
function quickInfoInnerHTML(g,key){
 const phoneRow=g.phone?`<div class="quick-info-row"><span class="quick-info-icon">☎️</span><span><span class="quick-info-label">Phone</span><span class="quick-info-value">${g.phone}</span></span></div>`:'';
 const callButton=g.phone?`<a class="utility-button" href="tel:${String(g.phone).replace(/[^+\d]/g,'')}">☎️ Call</a>`:'';
 const websiteButton=g.website?`<a class="utility-button" href="${g.website}" target="_blank" rel="noopener">🌐 Website</a>`:'';
 const price=String(g.price||'').trim();
 const unknown=/^(see|look at|refer to)\s+trip\s+info$|^check (current|live)|^prices? may vary$|^contact venue/i;
 const showPrice=price&&!unknown.test(price);
 const priceRow=showPrice?`<div class="quick-info-row"><span class="quick-info-icon">💰</span><span><span class="quick-info-label">Price</span><span class="quick-info-value">${price}</span></span></div>`:'';
 const hours=String(g.hours||'').trim();
 const hoursRow=hours&&!unknown.test(hours)?`<div class="quick-info-row"><span class="quick-info-icon">🕘</span><span><span class="quick-info-label">Hours</span><span class="quick-info-value">${hours}</span></span></div>`:'';
 const address=String(g.address||'').trim();
 const addressRow=address?`<div class="quick-info-row"><span class="quick-info-icon">📍</span><span><span class="quick-info-label">Address</span><span class="quick-info-value">${address}</span></span></div>`:'';
 const copyButton=address?`<button class="utility-button" type="button" onclick="copyGuideAddress('${key}')">📍 Copy Address</button>`:'';
 const navButton=g.maps?`<a class="map-button" href="${g.maps}" target="_blank" rel="noopener">🧭 Navigate</a>`:'';
 const roleBadge=g.itineraryRole?`<span class="itinerary-role-badge">${g.itineraryRole}</span>`:'';
 const reminder=String(g.visitorReminder||'').trim();
 const reminderRow=reminder?`<p class="visitor-reminder"><strong>Reminder:</strong> ${reminder}</p>`:'';
 return `<div class="quick-info-top"><span class="category-tag">${g.categoryLabel||g.cat||'Guide'}</span>${roleBadge}${guideStatusHTML(g)}</div><div class="quick-info-grid">${addressRow}${phoneRow}${hoursRow}${priceRow}${visitDayHTML(key)}</div>${reminderRow}<div class="quick-info-actions">${copyButton}${navButton}${callButton}${websiteButton}<button class="moment-button" aria-label="Add Moment" onclick="openMomentsModal('${key}')">✨ Moment</button></div>`;
}

function quickInfoHTML(g,key){
 return `<div class="quick-info-card">${quickInfoInnerHTML(g,key)}</div>`;
}

function guideCategoryKeys(key){
 const place=PRODUCTION_GUIDE.places[key]||{};
 const category=place.cat;
 const categoryItems=(category==='ATTRACTIONS'||category==='ACTIVITIES')
  ? guideCategoryItems('EXPLORE')
  : ((category&&Array.isArray(PRODUCTION_GUIDE.categories[category]))?PRODUCTION_GUIDE.categories[category]:[]);
 const keys=categoryItems.map(item=>item&&item.key).filter(itemKey=>itemKey&&PRODUCTION_GUIDE.places[itemKey]);
 return keys.length?keys:PRODUCTION_GUIDE.order.filter(itemKey=>PRODUCTION_GUIDE.places[itemKey]);
}
function guideNavModel(key){
 const keys=guideCategoryKeys(key);
 const idx=keys.indexOf(key);
 return {keys,idx,prev:idx>0?keys[idx-1]:'',next:idx>=0&&idx<keys.length-1?keys[idx+1]:'',position:idx>=0?idx+1:0,total:keys.length};
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
 if(!PRODUCTION_GUIDE.places[key])return;
 NAVIGATION.go(placeHref(key));
}

function suggestedItems(g){
 const items=(g.signature||g.highlights||[]);
 return items.map(x=>String(x)).filter(x=>/^TRY\s*[·:]/i.test(x)).map(x=>x.replace(/^TRY\s*[·:]\s*/i,''));
}
function criticalGuideNotes(g){
 const rules=/booking|book ahead|sell out|last entry|last order|queue|check-in|reception|closed|closure|fuel|height|age restriction|weather|road condition|mobile reception|no petrol|arrive early|order timing/i;
 return usefulGoodToKnow(g.worth||g.tips||[]).filter(x=>rules.test(x));
}
function compactGuideSections(g){
 const known=(g.signature||g.highlights||[]).filter(Boolean).map(x=>`<li>${String(x).replace(/^(Signature|House Special|Tasting Experience)\s*[·:]?\s*/i,'')}</li>`).join('');
 const notes=usefulGoodToKnow(g.worth||g.tips||[]).map(x=>`<li>${x}</li>`).join('');
 return `${known?`<section class="guide-compact-section"><h3>Known For</h3><ul>${known}</ul></section>`:''}${notes?`<section class="guide-compact-section"><h3>Good to Know</h3><ul>${notes}</ul></section>`:''}`;
}

function openGuideModal(key){
 const g=PRODUCTION_GUIDE.places[key]; if(!g)return;
 $('guideModalContent').innerHTML=`<div class="guide-onepage"><p class="kicker">Guide</p><h2>${g.emoji} ${g.title}</h2><p class="guide-onepage-sub"><strong>${g.sub}</strong></p><p class="guide-onepage-desc">${g.desc}</p>${quickInfoHTML(g,key)}${compactGuideSections(g)}${guideNavButtons(key)}</div>`;
 $('guideModal').classList.add('show');
 const sheet=document.querySelector('#guideModal .guide-sheet');
 if(sheet) sheet.scrollTop=0;
}
function closeGuideModal(){
 const modal=$('guideModal');
 if(modal)modal.classList.remove('show');
 const tripModal=$('tripModal');
 if(tripModal)tripModal.classList.remove('show');
 closeMiniMenus();
 document.body.classList.remove('admin-overlay-open');
 clearGuideNavigationContext();
}

function renderPlacePage(key){
  const g = PRODUCTION_GUIDE.places[key];
  const mount = document.getElementById('placeMain');
  if(!g || !mount) return;
  mount.innerHTML = `
<button class="place-detail-close" type="button" aria-label="Close place detail" onclick="closePlaceDetail()">×</button>
<div class="page-hero"><p class="kicker">Guide</p><h1>${g.emoji} ${g.title}</h1><p class="lead">${g.sub||''}</p></div>
<section class="prose-block guide-overview"><h2>Why Go</h2><p>${g.desc||''}</p></section>
<section aria-label="Quick Info" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
${compactGuideSections(g)}${guideNavButtons(key,'page')}`;
  document.title = `${g.title} · ${TRIP_CONFIG.tripName}`;
}

function renderPlaceGroupPage(keys){
  const clean=[...new Set((Array.isArray(keys)?keys:[]).filter(key=>key&&PRODUCTION_GUIDE.places[key]))];
  const mount=document.getElementById('placeMain');
  if(!clean.length||!mount) return;
  if(clean.length===1){ renderPlacePage(clean[0]); return; }
  const cards=clean.map((key,index)=>{
    const g=PRODUCTION_GUIDE.places[key];
    return `<article class="place-group-card" id="guide-${key}">
      <div class="page-hero place-group-hero"><p class="kicker">STOP ${index+1}</p><h1>${g.emoji} ${g.title}</h1><p class="lead">${g.sub||''}</p></div>
      <section class="prose-block guide-overview"><h2>Why Go</h2><p>${g.desc||''}</p></section>
      <section aria-label="Quick Info" class="quick-info-card">${quickInfoInnerHTML(g,key)}</section>
      ${compactGuideSections(g)}
    </article>`;
  }).join('');
  mount.innerHTML=`<button class="place-detail-close" type="button" aria-label="Close route guide" onclick="closePlaceDetail()">×</button><div class="page-hero"><p class="kicker">ROUTE GUIDE</p><h1>All planned stops</h1><p class="lead">These places are part of the same itinerary stop. Scroll down for all ${clean.length} guide cards.</p></div>${cards}`;
  document.title=`Route Guide · ${TRIP_CONFIG.tripName}`;
}




function shoppingCardHTML(key,route){
 const g=PRODUCTION_GUIDE.places[key]; if(!g)return '';
 const optional=(route.optional||[]).includes(key);
 const day=route.day.replace('DAY ','Day ');
 const near=g.address?g.address.split(',').slice(0,2).join(', '):route.subtitle;
 const known=g.directoryKnownFor||String((g.signature||[])[0]||'').replace(/^Known For\s*[·:]\s*/i,'');
 return `<article class="shopping-store-card ${optional?'is-optional':'is-primary'}">
   <div class="shopping-store-top"><div><h3>${g.title}</h3><span class="shopping-priority">${optional?'IF TIME ALLOWS':'MAIN ROUTE'}</span></div><a class="shopping-map-link" href="${g.maps||'#'}" target="_blank" rel="noopener">Navigate</a></div>
   <p class="shopping-store-desc">${g.desc||''}</p>
   <dl class="shopping-store-meta">
    <div><dt>Known for</dt><dd>${known}</dd></div>
    <div><dt>Near</dt><dd>${near}</dd></div>
    <div><dt>Best with</dt><dd>${day} · ${route.title}</dd></div>
   </dl>
 </article>`;
}
function renderShoppingDirectoryPage(){
 const mount=document.getElementById('shoppingDirectoryMain');
 if(!mount||typeof SHOPPING_DIRECTORY==='undefined')return;
 const routes=SHOPPING_DIRECTORY.routes.map(route=>{
   const primary=route.primary.map(key=>shoppingCardHTML(key,route)).join('');
   const optional=route.optional.map(key=>shoppingCardHTML(key,route)).join('');
   return `<section class="shopping-route-section">
    <header class="shopping-route-header"><p class="kicker">${route.day}</p><h2>${route.title}</h2><p class="shopping-route-subtitle">${route.subtitle}</p><p>${route.note}</p><div class="shopping-sequence"><span>Walk order</span><strong>${route.sequence}</strong></div></header>
    <div class="shopping-store-grid">${primary}</div>
    ${optional?`<details class="shopping-optional"><summary>If Time Allows <span>${route.optional.length} shops</span></summary><div class="shopping-store-grid">${optional}</div></details>`:''}
   </section>`;
 }).join('');
 mount.innerHTML=`<div class="page-hero shopping-directory-hero"><p class="kicker">SHOPPING DIRECTORY</p><h1>Shop by route,<br>not by checklist.</h1><p class="lead">${SHOPPING_DIRECTORY.intro}</p></div>${routes}`;
 document.title=`Shopping Directory · ${TRIP_CONFIG.tripName}`;
}
