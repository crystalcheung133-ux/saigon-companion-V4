/* script.js — Stage 7K-2E compatibility entry and shared startup.
   Domain behavior lives in focused runtime modules. */
function renderCanonicalDayNavigation(){
  const productionItinerary=GenerationSelectionAdapter.view('itinerary').days;
  const days=Object.keys(productionItinerary).sort((a,b)=>Number(a)-Number(b));
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const model=days.map(number=>{
    const day=productionItinerary[number]||{};
    const legend=Array.isArray(day.legend)?day.legend:[];
    const icon=day.dayEmoji||(String(legend[0]||'🗓').match(/^\S+/)||['🗓'])[0];
    const date=String(day.kicker||'').split('·').slice(1).join('·').trim();
    const summary=legend.map(value=>String(value).replace(/^\S+\s*/,''));
    return {number,icon,date,heading:day.heading||`Day ${number}`,summary};
  });
  document.querySelectorAll('#daysMenu').forEach(menu=>{
    menu.innerHTML=model.map(day=>`<a href="day.html?day=${encodeURIComponent(day.number)}"><span><span class="menu-title">${esc(day.icon)} Day ${esc(day.number)}</span><span class="menu-sub">${esc(day.heading)}<br/>${esc(day.date)}</span></span><span>›</span></a>`).join('');
  });
  document.querySelectorAll('#canonicalDaySummary').forEach(summary=>{
    summary.innerHTML=model.map(day=>`<a href="day.html?day=${encodeURIComponent(day.number)}"><strong>Day ${esc(day.number)}</strong><span><span class="day-card-title">${esc(day.icon)} ${esc(day.heading)}</span><span class="day-card-meta">${esc(day.date)}${day.summary.length?`<br/>${esc(day.summary.join(' · '))}`:''}</span></span></a>`).join('');
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  renderCanonicalDayNavigation();
  updateFriendLabels();
  if(typeof renderMoments==='function') renderMoments();
  if(typeof renderUnexpected==='function') renderUnexpected();
  if(typeof renderExpenses==='function') renderExpenses();
  if(typeof loadChecklist==='function') loadChecklist();
  if(typeof renderDashboard==='function') renderDashboard();
  document.querySelectorAll('.summary-link-row').forEach(x=>x.remove());
});


/* RC17.5 — Current bottom-navigation state. */
(function(){
  function markCurrentNav(){
    var nav=document.querySelector('.app-nav');
    if(!nav)return;
    var file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    var target='trip';
    if(file==='guide.html'||file==='place.html')target='guide';
    else if(file==='day.html'||file==='itinerary.html')target='days';
    else if(file==='moments.html'||file==='memory.html')target='moments';
    else if(file==='expenses.html')target='expenses';
    var el=null;
    if(target==='trip')el=nav.querySelector('.trip-trigger');
    else if(target==='guide')el=nav.querySelector('.guide-trigger');
    else if(target==='days')el=nav.querySelector('.days-trigger');
    else if(target==='moments')el=nav.querySelector('a[href*="moments.html"]');
    else if(target==='expenses')el=nav.querySelector('a[href*="expenses.html"]');
    nav.querySelectorAll('.is-active').forEach(function(node){node.classList.remove('is-active');node.removeAttribute('aria-current');});
    if(el){el.classList.add('is-active');el.setAttribute('aria-current','page');}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',markCurrentNav,{once:true});
  else markCurrentNav();
})();



/* UX-POLISH1 — compact modal cards only when they miss one-screen fit by a small amount. */
function applyNearFitModal(sheet,className){
  if(!sheet)return;
  sheet.classList.remove('guide-near-fit','trip-near-fit');
  requestAnimationFrame(()=>{
    const overflow=Math.max(0,sheet.scrollHeight-sheet.clientHeight);
    if(overflow>0&&overflow<=150)sheet.classList.add(className);
  });
}
window.applyNearFitModal=applyNearFitModal;

/* RC29.111 — canonical cross-link overlay contract.
   Pages are anchors. Popups may stack visually, but they never form return history.
   Any popup close dismisses the full content-overlay chain; popup→page dismisses first. */
(function(root){
  let overlayZ=9000;
  root.bringContentOverlayToFront=function(target){
    const el=typeof target==='string'?document.getElementById(target):target;
    if(!el)return el;
    overlayZ+=10;
    el.style.zIndex=String(overlayZ);
    return el;
  };
  root.dismissAllContentOverlays=function(){
    ['tripModal','guideModal','docViewer','expenseModal','momentsModal','unexpectedModal','mamaModal','weatherModal','clockModal','shoppingRouteModal','referenceViewerModal','expenseCalculatorModal','docModal','editDocModal','expenseNoticeModal','tripExportModal'].forEach(function(id){
      const el=document.getElementById(id);if(!el)return;
      el.classList.remove('show','guide-backgrounded-for-booking','identity-required');
      el.setAttribute?.('aria-hidden','true');
      el.style.zIndex='';
    });
    const body=document.body;
    body.classList.remove('guide-booking-stack-open','guide-foreground-over-booking','admin-overlay-open','expense-modal-open');
    body.style.top='';body.style.overflow='';
    try{document.getElementById('docViewerBody')?.replaceChildren();}catch(e){}
    try{window.GUIDE_MODAL_ORIGIN=null;window.TRIP_MODAL_RETURN_TO_GUIDE=false;}catch(e){}
    try{closeMiniMenus?.();}catch(e){}
    return true;
  };
})(globalThis);

/* Popup → page: close all overlays before following native internal page links.
   Does not interfere with in-page anchors, external links or new tabs. */
document.addEventListener('click',function(event){
  const link=event.target&&event.target.closest?.('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  if(link.target&&link.target!=='_self')return;
  let destination;
  try{destination=new URL(link.href,location.href);}catch(e){return;}
  if(destination.origin!==location.origin)return;
  // Same-page hash navigation from a popup is still popup → page.
  if(destination.pathname===location.pathname&&destination.search===location.search&&!destination.hash)return;
  if(!['tripModal','guideModal','docViewer','expenseModal','momentsModal','unexpectedModal','mamaModal','weatherModal','clockModal','shoppingRouteModal','referenceViewerModal','expenseCalculatorModal','docModal','editDocModal','expenseNoticeModal','tripExportModal'].some(id=>document.getElementById(id)?.classList.contains('show')))return;
  window.dismissAllContentOverlays?.();
},true);
