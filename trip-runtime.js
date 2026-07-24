/* trip-runtime.js - CCMV Travel Engine reusable owner.
   Owns checklist state, Trip modal rendering, and home readiness summary.
   Vietnam-specific values are supplied by config/data modules. */
function saveChecklist(){const checks=[...document.querySelectorAll('[data-check]')].map(c=>c.checked);STORAGE.local.writeJSON(STORAGE_CONFIG.keys.checklist,checks);const ready=$('readyBox');if(ready)ready.classList.toggle('show',checks.length>0&&checks.every(Boolean)); renderDashboard();}
function loadChecklist(){const stored=STORAGE.local.readJSON(STORAGE_CONFIG.keys.checklist,[]);document.querySelectorAll('[data-check]').forEach((c,i)=>c.checked=!!stored[i]);saveChecklist();}
document.addEventListener('DOMContentLoaded',()=>{updateFriendLabels();renderMoments();renderUnexpected();renderExpenses();loadChecklist();renderDashboard();});

function openTripCard(key) {
  closeMiniMenus();
  const t = VN_PRESENTATION.tripData[key];
  if (!t) return;
  const idx = VN_PRESENTATION.tripOrder.indexOf(key);
  const prev = VN_PRESENTATION.tripOrder[(idx - 1 + VN_PRESENTATION.tripOrder.length) % VN_PRESENTATION.tripOrder.length];
  const next = VN_PRESENTATION.tripOrder[(idx + 1) % VN_PRESENTATION.tripOrder.length];
  const content = document.getElementById('tripModalContent');
  const modal = document.getElementById('tripModal');
  if (!content || !modal) return;
  content.innerHTML = `<div class="trip-onepage"><p class="kicker">Trip</p><h2>${t.title}</h2>${t.body}<div class="guide-next-row"><button class="pill" data-action="trip-card" data-trip-key="${prev}">‹ Previous</button><button class="pill" data-action="trip-card" data-trip-key="${next}">Next ›</button></div><p class="timestamp">Build · VN Refactored Baseline · Stage 1</p></div>`;
  modal.classList.add('show');
  const sheet=document.querySelector('#tripModal .trip-sheet');
  if(sheet) sheet.scrollTop=0;
  if (key === 'checklist') setTimeout(loadChecklist, 0);
}

function closeTripModal() {
  const modal = document.getElementById('tripModal');
  if (modal) modal.classList.remove('show');
}

function renderDashboard(){
  const checks=[...document.querySelectorAll('[data-dashboard-check]')];
  if(!checks.length) return;
  const stored=STORAGE.local.readJSON(STORAGE_CONFIG.keys.checklist,[]);
  const done=stored.filter(Boolean).length;
  const total=10;
  const percent=Math.round((done/total)*100);
  const pct=document.getElementById('dashReadyPercent');
  const bar=document.getElementById('dashReadyBar');
  const count=document.getElementById('dashChecklistCount');
  if(pct) pct.textContent=percent+'%';
  if(bar) bar.style.width=percent+'%';
  if(count) count.textContent=`${done} / ${total} Checklist Completed`;
}
