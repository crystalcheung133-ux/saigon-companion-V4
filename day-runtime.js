/* day-runtime.js - CCMV Travel Engine reusable owner.
   Owns Day rendering, hash positioning, and touch swipe behaviour.
   Vietnam-specific values are supplied by config/data modules. */
(function(){
  const DAY_RENDER_DATA = VN_PRESENTATION.itineraryData;
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
  function routeLocation(item){
    if(!item || !item.map) return '';
    try{
      const url = new URL(item.map, location.href);
      return url.searchParams.get('q') || url.searchParams.get('query') || '';
    }catch(error){
      return '';
    }
  }
  function buildTodayRoute(dayData){
    const stops = (dayData.items || []).map(routeLocation).filter(Boolean);
    if(stops.length < 2) return '';
    const params = new URLSearchParams({
      api:'1',
      origin:stops[0],
      destination:stops[stops.length - 1],
      travelmode:'driving'
    });
    if(stops.length > 2) params.set('waypoints', stops.slice(1,-1).join('|'));
    const href = `https://www.google.com/maps/dir/?${params.toString()}`;
    return `<a class="day-route-action" href="${esc(href)}" target="_blank" rel="noopener"><span>View Today’s Route</span><b aria-hidden="true">›</b></a>`;
  }
  const todayRoute = buildTodayRoute(data);
  const items = data.items.map(item => {
    const detailHtml = (item.details || []).map(text => `<p>${esc(text)}</p>`).join('');
    const routeHtml = item.route ? `<div class="route-hint"><strong>🚕 To next stop</strong><br/>${esc(item.route)}</div>` : '';
    const mapHtml = item.map ? `<a class="timeline-action timeline-action--map" href="${esc(item.map)}" target="_blank" rel="noopener">Navigate</a>` : '';
    const guideIds = Array.isArray(item.guideIds) && item.guideIds.length ? item.guideIds : [item.placeId || item.id];
    const directoryHtml = item.showShoppingDirectory
      ? `<button class="timeline-action timeline-action--directory" onclick="location.href='guide.html#shopping-directory'">Shopping List</button>`
      : '';
    const guideHtml = guideIds.map(key => {
      const place = VN_PRESENTATION.places[key] || {};
      const label = place.title ? `${place.title} Guide` : 'Guide';
      return `<button class="timeline-action timeline-action--guide" onclick="location.href='place.html?id=${esc(key)}'">${esc(label)}</button>`;
    }).join('');
    const actionCount = guideIds.length + (item.showShoppingDirectory ? 1 : 0) + (item.map ? 1 : 0) + 1;
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
          <button class="timeline-action timeline-action--moment" onclick="openMomentsModal('${esc(item.id)}')">✨ Moment</button>
        </div>
      </div>
    </div>`;
  }).join('');
  root.innerHTML = `<div class="page-hero day-page-hero"><p class="kicker">${esc(data.kicker)}</p><h1>${esc(data.heading)}</h1>${todayRoute}</div><section class="timeline">${items}</section>`;

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
    if(dx < 0 && current < 5) location.href = `day.html?day=${current + 1}`;
    if(dx > 0 && current > 1) location.href = `day.html?day=${current - 1}`;
  }, {passive:true});
})();
