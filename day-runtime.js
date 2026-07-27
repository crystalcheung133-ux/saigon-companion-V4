/* day-runtime.js - CCMV Travel Engine reusable owner.
   Owns Day rendering, hash positioning, and touch swipe behaviour.
   Vietnam-specific values are supplied by config/data modules. */
(function(){
  const DAY_RENDER_DATA = VN_PRESENTATION.itineraryData;
  /* Stage 2.6: derive the trip's day range from the actual canonical
     itinerary data instead of assuming a fixed 5-day trip, so swipe
     navigation keeps working for Day 6, Day 10, or any other day count. */
  const dayNumbers = Object.keys(DAY_RENDER_DATA).map(Number).filter(n=>!Number.isNaN(n));
  const minDayNumber = dayNumbers.length ? Math.min(...dayNumbers) : 1;
  const maxDayNumber = dayNumbers.length ? Math.max(...dayNumbers) : 1;
  function esc(value){return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  const params = new URLSearchParams(location.search);
  const day = params.get('day') || '1';
  const data = DAY_RENDER_DATA[day];
  const root = document.getElementById('dynamicDayRoot');
  if(!data){
    document.title = 'Day not found · Saigon Companion';
    root.innerHTML = '<div class="page-hero"><p class="kicker">Days</p><h1>Day not found</h1><p>Please choose a day from the Days menu.</p></div>';
    return;
  }
  document.title = data.title;
  const visibleItems=(data.items||[]).filter(item=>{
    const type=String(item.type||'').trim().toLowerCase();
    return type!=='transport' && !(/\bgrab\b/i.test(String(item.title||'')));
  });
  const items = visibleItems.map(item => {
    const detailHtml = (item.details || []).map(text => `<p>${esc(text)}</p>`).join('');
    const routeText = String(item.route||'').replace(/^\s*(?:🚕|🚗|🚶|✈️?|🛫)?\s*To next stop\s*[:：-]?\s*/i,'').trim();
    const routeHtml = routeText ? `<div class="route-hint"><strong>🚕 To next stop</strong><span>${esc(routeText)}</span></div>` : '';
    const sourceUrl=`day.html?day=${encodeURIComponent(day)}#${encodeURIComponent(item.id)}`;
    const nearbyHtml = (item.nearbyBeforePlaceIds||[]).length ? `<details class="meal-alternatives nearby-options"><summary>☕ Nearby option</summary><div class="alternative-list">${item.nearbyBeforePlaceIds.map(key=>{
      const place=VN_PRESENTATION.places[key]||{};
      const detailUrl=placeHref(key,{optional:'Nearby option',returnTo:sourceUrl});
      return `<div class="alternative-option"><div class="option-copy"><span class="optional-badge">OPTIONAL · NEARBY</span><strong>${esc(place.emoji||'☕')} ${esc(place.title||key)}</strong><p>${esc(place.sub||'Optional nearby stop')}</p></div><div class="option-actions"><a class="timeline-action timeline-action--map" href="${esc(place.maps||'#')}" target="_blank" rel="noopener">🧭 Navigate</a><button class="timeline-action timeline-action--guide" onclick="location.href='${esc(detailUrl)}'">📖 Guide</button></div></div>`;
    }).join('')}</div></details>` : '';
    const alternativeHtml = (item.alternativePlaceIds||[]).length ? `<details class="meal-alternatives"><summary>🍽 Alternatives</summary><div class="alternative-list">${item.alternativePlaceIds.map(key=>{
      const place=VN_PRESENTATION.places[key]||{};
      const detailUrl=placeHref(key,{optional:'Meal alternative',returnTo:sourceUrl});
      return `<div class="alternative-option"><div class="option-copy"><span class="optional-badge">OPTIONAL</span><strong>${esc(place.emoji||'🍽')} ${esc(place.title||key)}</strong><p>${esc(place.sub||'Alternative meal option')}</p></div><div class="option-actions"><a class="timeline-action timeline-action--map" href="${esc(place.maps||'#')}" target="_blank" rel="noopener">🧭 Navigate</a><button class="timeline-action timeline-action--guide" onclick="location.href='${esc(detailUrl)}'">📖 Guide</button></div></div>`;
    }).join('')}</div></details>` : '';
    const mapHtml = item.map ? `<a class="timeline-action timeline-action--map" href="${esc(item.map)}" target="_blank" rel="noopener">🧭 Navigate</a>` : '';
    const operationalTypes = new Set(['money','transport','buffer','rest']);
    const explicitGuideIds = Array.isArray(item.guideIds) ? item.guideIds : [];
    const inferredGuideIds = (!operationalTypes.has(item.type) && item.placeId && VN_PRESENTATION.places[item.placeId]) ? [item.placeId] : [];
    const guideIds = [...new Set(explicitGuideIds.length ? explicitGuideIds : inferredGuideIds)].filter(key=>VN_PRESENTATION.places[key]);
    const directoryHtml = item.showShoppingDirectory
      ? `<button class="timeline-action timeline-action--directory" onclick="location.href='guide.html?day=${encodeURIComponent(String(item.dayId||'').replace('day',''))}&return=${encodeURIComponent(sourceUrl)}#shopping-directory'">🛍 Shopping Directory</button>`
      : '';
    const routeGuideHtml = item.showShoppingDirectory && guideIds.length > 1
      ? `<details class="meal-alternatives shopping-route-options"><summary>🛍 Route stops</summary><div class="alternative-list">${guideIds.map(key=>{
          const place=VN_PRESENTATION.places[key]||{};
          const detailUrl=placeHref(key,{returnTo:sourceUrl});
          return `<div class="alternative-option route-stop-card"><div class="option-copy"><strong>${esc(place.emoji||'🛍')} ${esc(place.title||key)}</strong><p>${esc(place.sub||'Shopping stop')}</p></div><div class="option-actions"><a class="timeline-action timeline-action--map" href="${esc(place.maps||'#')}" target="_blank" rel="noopener">🧭 Navigate</a><button class="timeline-action timeline-action--guide" onclick="location.href='${esc(detailUrl)}'">📖 Guide</button></div></div>`;
        }).join('')}</div></details>`
      : '';
    const guideHtml = (item.showShoppingDirectory && guideIds.length > 1 ? [] : guideIds).map(key => {
      const detailUrl=placeHref(key,{returnTo:sourceUrl});
      return `<button class="timeline-action timeline-action--guide" onclick="location.href='${esc(detailUrl)}'">📖 Guide</button>`;
    }).join('');
    const actionCount = (item.showShoppingDirectory && guideIds.length > 1 ? 0 : guideIds.length) + (item.showShoppingDirectory ? 1 : 0) + (item.map ? 1 : 0);
    const actionClass = actionCount > 3 ? 'timeline-actions timeline-actions--multi' : 'timeline-actions';
    return `
    <div class="timeline-item" id="${esc(item.id)}">
      <div class="timeline-time">${esc(item.time)}</div>
      <div class="timeline-main">
        <h3>${esc(item.title)}</h3>
        ${detailHtml}
        ${routeHtml}
        <div class="${actionClass}">
          ${mapHtml}${directoryHtml}${guideHtml}
        </div>
        ${routeGuideHtml}${nearbyHtml}${alternativeHtml}
      </div>
    </div>`;
  }).join('');
  root.innerHTML = `<div class="page-hero day-page-hero"><p class="kicker">${esc(data.kicker)}</p><h1>${esc(data.heading)}</h1></div><section class="timeline">${items}</section>`;

  // Stage 4F-L: native hash scrolling can run before dynamic cards exist.
  // Re-resolve the requested card after render and offset the sticky top bar.
  function scrollToRequestedCard(){
    if(!location.hash) return;
    let targetId;
    try{ targetId = decodeURIComponent(location.hash.slice(1)); }
    catch(e){ targetId = location.hash.slice(1); }
    const target = document.getElementById(targetId);
    if(!target) return;
    const nav = document.querySelector('.site-nav');
    const navOffset = (nav ? nav.getBoundingClientRect().height : 0) + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({top:Math.max(0, top), behavior:'auto'});
  }
  requestAnimationFrame(()=>requestAnimationFrame(scrollToRequestedCard));
  window.addEventListener('hashchange', scrollToRequestedCard);

  // Stage 4E-1: restore swipe between dynamic day pages.
  let touchStartX = 0;
  let touchStartY = 0;
  root.addEventListener('touchstart', function(e){
    const t = e.changedTouches && e.changedTouches[0];
    if(!t) return;
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, {passive:true});
  root.addEventListener('touchend', function(e){
    const t = e.changedTouches && e.changedTouches[0];
    if(!t) return;
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if(Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    const current = Number(day);
    if(dx < 0 && current < maxDayNumber) location.href = `day.html?day=${current + 1}`;
    if(dx > 0 && current > minDayNumber) location.href = `day.html?day=${current - 1}`;
  }, {passive:true});
})();
