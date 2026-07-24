/* itinerary-runtime.js - reusable Days menu and overview presentation owner. */
(function(root){
  'use strict';
  function dayView(config){
    const data=VN_PRESENTATION.itineraryData[String(config.number)];
    return Object.freeze({
      number:config.number,
      emoji:config.emoji,
      date:config.date,
      weekday:config.weekday,
      heading:data?.heading||`Day ${config.number}`,
      href:`day.html?day=${config.number}`,
      summary:(data?.items||[]).slice(0,3).map(item=>String(item.title||'').replace(/^[^\p{L}\p{N}]+\s*/u,'')).join(' · ')
    });
  }
  function views(){return VN_PRESENTATION.days.map(dayView);}
  function renderDaysMenus(){
    const html=views().map(day=>`<a href="${day.href}"><span><span class="menu-title">${day.emoji} Day ${day.number}</span><span class="menu-sub">${day.heading}<br/>${day.date} • ${day.weekday}</span></span><span>›</span></a>`).join('');
    document.querySelectorAll('#daysMenu').forEach(menu=>{menu.innerHTML=html;});
  }
  function renderItineraryOverview(){
    const mount=document.querySelector('.day-summary');
    if(!mount)return;
    mount.innerHTML=views().map(day=>`<a href="${day.href}"><strong>Day ${day.number}</strong><span><span class="day-card-title">${day.emoji} ${day.heading}</span><span class="day-card-meta">${day.date} • ${day.weekday}<br/>${day.summary}</span></span></a>`).join('');
  }
  function init(){renderDaysMenus();renderItineraryOverview();}
  root.ITINERARY_PRESENTATION=Object.freeze({views,renderDaysMenus,renderItineraryOverview,init});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(globalThis);
