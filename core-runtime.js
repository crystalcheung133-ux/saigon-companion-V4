/* core-runtime.js - CCMV Travel Engine reusable owner.
   Owns shared menus, participant selection, and modal dismissal.
   Vietnam-specific values are supplied by config/data modules. */
function $(id){return document.getElementById(id);}
function escapeHTML(value){return String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function closeMiniMenus(){document.querySelectorAll('.mini-menu').forEach(m=>m.classList.remove('show'));}
function clampMenuPosition(n,min,max){return Math.max(min,Math.min(max,n));}
function positionMiniMenu(menu,trigger){
  if(!menu||!trigger)return;
  const rect=trigger.getBoundingClientRect();
  const menuWidth=Math.min(230,window.innerWidth-24);
  const center=rect.left+rect.width/2;
  const left=clampMenuPosition(center,12+menuWidth/2,window.innerWidth-12-menuWidth/2);
  menu.style.left=left+'px';
  menu.style.right='auto';
  menu.style.width=menuWidth+'px';
}
function toggleMenu(id,trigger){
  const m=$(id);
  const open=m&&m.classList.contains('show');
  closeMiniMenus();
  if(m&&!open){positionMiniMenu(m,trigger||document.activeElement);m.classList.add('show');}
}
function toggleTripMenu(){toggleMenu('tripMenu',document.querySelector('.trip-trigger'));}
function toggleGuideMenu(){toggleMenu('guideMenu',document.querySelector('.guide-trigger'));}
function toggleDays(){toggleMenu('daysMenu',document.querySelector('.days-trigger'));}
window.addEventListener('resize',closeMiniMenus);
document.addEventListener('click',e=>{if(!e.target.closest('.mini-menu')&&!e.target.closest('.trip-trigger')&&!e.target.closest('.guide-trigger')&&!e.target.closest('.days-trigger')) closeMiniMenus();});

function getFriend(){return STORAGE.local.get(STORAGE_CONFIG.keys.friend,VN_PRESENTATION.participants.defaultKey);}
function setFriend(k){
  if(!VN_PRESENTATION.participants.identities[k])return;
  STORAGE.local.set(STORAGE_CONFIG.keys.friend,k);
  closeFriendModal();
  updateFriendLabels();
  if(document.getElementById('expenseModal')?.classList.contains('show')&&typeof window.resetExpenseForm==='function')window.resetExpenseForm();
  if(document.getElementById('momentsModal')?.classList.contains('show')&&typeof window.simplifyMomentsAuthor==='function')window.simplifyMomentsAuthor();
}
function participantLabel(key){
  const identity=VN_PRESENTATION.participants.identities[key]||VN_PRESENTATION.participants.identities[VN_PRESENTATION.participants.defaultKey];
  return `${identity.emoji} ${identity.name}`;
}
function updateFriendLabels(){const label=participantLabel(getFriend());document.querySelectorAll('[data-friend-label]').forEach(e=>e.textContent=label);}
function openFriendModal(){$('mamaModal').classList.add('show')} function closeFriendModal(){$('mamaModal').classList.remove('show')}

document.addEventListener('click',event=>{
  const control=event.target.closest('[data-action]');
  if(!control)return;
  const action=control.dataset.action;
  if(control.matches('a[href="#"]'))event.preventDefault();
  if(action==='trip-menu')toggleTripMenu();
  else if(action==='guide-menu')toggleGuideMenu();
  else if(action==='days-menu')toggleDays();
  else if(action==='guide-category')openGuideCategory(control.dataset.category);
  else if(action==='trip-card')openTripCard(control.dataset.tripKey);
  else if(action==='place')goPlace(control.dataset.placeId);
  else if(action==='guide-place-modal')openGuideModal(control.dataset.placeId);
  else if(action==='shopping-directory')openShoppingDirectoryView();
  else if(action==='friend-open')openFriendModal();
  else if(action==='friend-select')setFriend(control.dataset.friend);
  else if(action==='friend-close')closeFriendModal();
  else if(action==='guide-close')closeGuideModal();
  else if(action==='trip-close')closeTripModal();
  else if(action==='place-close')closePlaceDetail();
});

/* v2.1.11 safe modal close fallback */
document.addEventListener('click', function(e){
  const modal = e.target.closest('.guide-modal,.moments-modal,.unexpected-modal,.tools-modal,.mama-modal,.trip-modal');
  if(modal && e.target === modal){
    modal.classList.remove('show');
  }
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    document.querySelectorAll('.guide-modal,.moments-modal,.unexpected-modal,.tools-modal,.mama-modal,.trip-modal').forEach(m=>m.classList.remove('show'));
  }
});
