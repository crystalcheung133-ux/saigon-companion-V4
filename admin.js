/* ============================================================================
   TRAVEL ENGINE — ADMIN MODE RUNTIME
   Stage 7K-2C: extracted from script.js without changing behaviour.
   Load after script.js because this module wraps the shared setFriend() API.
   ============================================================================ */

/* ============================================================================
   STAGE 6A-2 — ADMIN MODE + TIMELINE EDITING
   Shared Admin shell with Day timeline editing support.
   ============================================================================ */
(function(){
  const MODE_KEY=STORAGE_CONFIG.keys.adminMode;
    const ADMIN_USER='crystal';
  const ADMIN_PIN='260922';
  const SESSION_KEY='travel_engine_admin_unlocked_v1';
  const state={mode:false};

  function isAdminUser(){ return getFriend()===ADMIN_USER; }
  function isUnlocked(){ return sessionStorage.getItem(SESSION_KEY)==='1'; }
  function lockAdminSession(){ sessionStorage.removeItem(SESSION_KEY); }
  function scrollTripStudioToBottom(){
    const modal=document.getElementById('mamaModal');
    const sheet=modal&&modal.querySelector('.guide-sheet');
    const studio=document.getElementById('adminModeControl');
    if(!modal||!sheet||!studio) return;
    window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>{
      sheet.scrollTop=0;
      modal.scrollTop=0;
      studio.scrollIntoView({block:'start'});
    }));
  }
  function closeTripStudioPanel(){
    const modal=document.getElementById('mamaModal');
    const studio=document.getElementById('adminModeControl');
    if(studio) studio.hidden=true;
    if(modal){
      modal.classList.remove('studio-view');
      modal.classList.remove('show');
    }
  }
  function openTripStudioPanel(){
    if(!isAdminUser()){ alert('Trip Studio is available to Crystal only.'); return false; }
    if(typeof renderFriendChoices==='function') renderFriendChoices();
    const modal=document.getElementById('mamaModal');
    const studio=document.getElementById('adminModeControl');
    if(!modal||!studio) return false;
    studio.hidden=false;
    modal.classList.add('studio-view');
    modal.classList.add('show');
    scrollTripStudioToBottom();
    return true;
  }
  function syncPinModalToVisualViewport(modal){
    if(!modal) return;
    const viewport=window.visualViewport;
    const top=viewport?Math.max(0,viewport.offsetTop):0;
    const height=viewport?viewport.height:window.innerHeight;
    modal.style.setProperty('--admin-pin-vv-top',`${Math.round(top)}px`);
    modal.style.setProperty('--admin-pin-vv-height',`${Math.round(height)}px`);
  }
  function ensurePinModal(){
    let modal=document.getElementById('adminPinModal');
    if(modal) return modal;
    modal=document.createElement('div');
    modal.id='adminPinModal';
    modal.className='admin-pin-modal';
    modal.hidden=true;
    modal.innerHTML=`<div class="admin-pin-sheet" role="dialog" aria-modal="true" aria-labelledby="adminPinTitle"><button type="button" class="admin-pin-close" aria-label="Close">×</button><p class="kicker">TRIP STUDIO ACCESS</p><h2 id="adminPinTitle">Enter Studio PIN</h2><p class="admin-pin-help">Enter the 6-digit PIN to open Trip Studio.</p><form id="adminPinForm"><input id="adminPinInput" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" aria-label="6-digit Trip Studio PIN" placeholder="••••••"><p id="adminPinError" class="admin-pin-error" hidden>Incorrect PIN.</p><button type="submit" class="admin-pin-submit">Open Trip Studio</button></form></div>`;
    document.body.appendChild(modal);
    const syncViewport=()=>syncPinModalToVisualViewport(modal);
    const close=()=>{
      modal.hidden=true;
      const input=modal.querySelector('#adminPinInput');
      if(input) input.value='';
      if(window.visualViewport){
        window.visualViewport.removeEventListener('resize',syncViewport);
        window.visualViewport.removeEventListener('scroll',syncViewport);
      }
    };
    modal.querySelector('.admin-pin-close').addEventListener('click',close);
    modal.addEventListener('click',event=>{ if(event.target===modal) close(); });
    modal.querySelector('#adminPinInput').addEventListener('input',event=>{ event.target.value=event.target.value.replace(/\D/g,'').slice(0,6); const error=modal.querySelector('#adminPinError'); if(error) error.hidden=true; });
    modal._syncAdminPinViewport=syncViewport;
    modal.querySelector('#adminPinForm').addEventListener('submit',event=>{
      event.preventDefault();
      const input=modal.querySelector('#adminPinInput');
      const value=input?input.value:'';
      const error=modal.querySelector('#adminPinError');
      if(value!==ADMIN_PIN){ if(error) error.hidden=false; if(input){ input.value=''; input.focus(); } return; }
      sessionStorage.setItem(SESSION_KEY,'1');
      close();
      window.setAdminMode(true);
      if(typeof window.openFriendModal==='function') window.openFriendModal();
    });
    return modal;
  }
  function requestUnlock(){
    if(typeof window.closeFriendModal==='function') window.closeFriendModal();
    const modal=ensurePinModal();
    modal.hidden=false;
    if(typeof modal._syncAdminPinViewport==='function') modal._syncAdminPinViewport();
    if(window.visualViewport && typeof modal._syncAdminPinViewport==='function'){
      window.visualViewport.addEventListener('resize',modal._syncAdminPinViewport);
      window.visualViewport.addEventListener('scroll',modal._syncAdminPinViewport);
    }
    const input=modal.querySelector('#adminPinInput');
    if(input){
      try{ input.focus({preventScroll:true}); }catch(e){ input.focus(); }
      window.requestAnimationFrame(()=>{
        if(typeof modal._syncAdminPinViewport==='function') modal._syncAdminPinViewport();
        if(document.activeElement!==input){
          try{ input.focus({preventScroll:true}); }catch(e){ input.focus(); }
        }
        window.setTimeout(()=>{
          if(typeof modal._syncAdminPinViewport==='function') modal._syncAdminPinViewport();
        },120);
      });
    }
    return false;
  }
  function readMode(){ return isAdminUser() && isUnlocked() && STORAGE.local.get(MODE_KEY)==='admin'; }
  function setStoredMode(enabled){
    if(enabled) STORAGE.local.set(MODE_KEY,'admin');
    else STORAGE.local.remove(MODE_KEY);
  }
  function updateUI(){
    document.body.classList.toggle('admin-mode',state.mode);
    const control=document.getElementById('adminModeControl');
    if(control) control.hidden=!(isAdminUser() && state.mode);
    [document.getElementById('studioSelectorToggleInput'),document.getElementById('adminModeToggle')].filter(Boolean).forEach(toggle=>{
      toggle.checked=state.mode;
      toggle.setAttribute('aria-checked',String(state.mode));
    });
    const banner=document.getElementById('adminModeBanner');
    if(banner) banner.hidden=!state.mode;
    const exportButton=document.getElementById('expenseExportButton');
    if(exportButton){
      const showExport=state.mode && isUnlocked() && isAdminUser();
      exportButton.hidden=!showExport;
      exportButton.setAttribute('aria-hidden',String(!showExport));
      exportButton.style.display=showExport?'inline-flex':'none';
    }
    ['tripStudioManagement','tripStudioExports','tripStudioDanger'].forEach(id=>{
      const group=document.getElementById(id);
      if(group) group.hidden=!state.mode;
    });
  }
  function buildShell(){
    const familySheet=document.querySelector('#mamaModal .guide-sheet');
    const familyList=familySheet&&familySheet.querySelector('.friend-choice-list');
    if(familySheet && familyList && !document.getElementById('tripStudioSelectorToggle')){
      const selectorToggle=document.createElement('div');
      selectorToggle.id='tripStudioSelectorToggle';
      selectorToggle.className='trip-studio-selector-toggle';
      selectorToggle.innerHTML=`<span><strong>⚙ Studio Mode</strong><small>Complete Trip, Export Centre and trip controls</small></span><label class="admin-switch"><input id="studioSelectorToggleInput" type="checkbox" role="switch" aria-label="Toggle Studio Mode"><span></span></label>`;
      familyList.insertAdjacentElement('afterend',selectorToggle);
      selectorToggle.querySelector('#studioSelectorToggleInput').addEventListener('change',event=>{
        const enabled=event.target.checked;
        const changed=window.setAdminMode(enabled);
        if(changed===false) event.target.checked=state.mode;
      });
    }
    if(familySheet && !document.getElementById('adminModeControl')){
      const block=document.createElement('section');
      block.id='adminModeControl';
      block.className='admin-mode-control trip-studio';
      block.hidden=true;
      block.innerHTML=`
        <header class="trip-studio-head">
          <div>
            <p class="trip-studio-kicker">CREATOR WORKSPACE</p>
            <h3>Trip Studio</h3>
            <small>Manage exports and trip lifecycle controls.</small>
          </div>
          <button type="button" class="trip-studio-close" aria-label="Close Trip Studio">×</button>
        </header>
        <div id="tripStudioManagement" class="trip-studio-group" hidden>
          <p class="trip-studio-label">MODE</p>
          <button type="button" class="trip-studio-action" onclick="setAdminMode(false)"><span><strong>Read Mode</strong><small>Return to normal companion use.</small></span><span>›</span></button>
        </div>
        <div id="tripStudioExports" class="trip-studio-group" hidden>
          <p class="trip-studio-label">EXPORT CENTRE</p>
          <button type="button" class="trip-studio-action" onclick="location.href='expenses.html'"><span><strong>Export Centre</strong><small>Open Expenses to review or export the current trip record.</small></span><span>↗</span></button>
        </div>
        <div id="tripStudioDanger" class="trip-studio-group trip-studio-danger" hidden>
          <p class="trip-studio-label">TRIP DATA</p>
          <button id="resetTripDataButton" class="reset-trip-data-btn" type="button"><span><strong>Reset Trip Data</strong><small>Delete saved expenses, moments and progress for this Vietnam trip.</small></span><span>›</span></button>
        </div>`;
      familySheet.appendChild(block);
      block.querySelector('.trip-studio-close').addEventListener('click',closeTripStudioPanel);
      block.querySelector('#resetTripDataButton').addEventListener('click',()=>window.resetTripData?.());

    }
    if(!document.getElementById('adminModeBanner')){
      const banner=document.createElement('div');
      banner.id='adminModeBanner';
      banner.className='admin-mode-banner';
      banner.setAttribute('role','status');
      banner.hidden=true;
      banner.innerHTML='<strong>TRIP STUDIO</strong><span>Management Mode</span>';
      document.body.prepend(banner);
    }
  }

  /* window.resetTripData is defined in reset-runtime.js (RC11R4), which
     owns the whole reset transaction — RPC, storage, and every local store
     that needs clearing. admin.js only builds the button and wires the
     click; it doesn't know how a reset works, on purpose, so there's one
     place (reset-runtime.js) that does. */

  window.setAdminMode=function(enabled){
    enabled=!!enabled;
    if(enabled && !isAdminUser()){
      alert('Trip Studio is available to Crystal only.');
      updateUI();
      return false;
    }
    if(enabled && !isUnlocked() && !requestUnlock()){
      updateUI();
      return false;
    }
    state.mode=enabled;
    setStoredMode(enabled);
    if(!enabled) lockAdminSession();
    updateUI();
    if(typeof window.refreshExpenseAdminUI==='function') window.refreshExpenseAdminUI();
    document.dispatchEvent(new CustomEvent('travelengine:adminmodechange',{detail:{enabled:state.mode}}));
    return true;
  };

  window.isAdminMode=function(){ return state.mode && isUnlocked() && isAdminUser(); };
  window.isAdminUnlocked=function(){ return isUnlocked() && isAdminUser(); };
  window.hasUnsavedAdminChanges=function(){ return false; };

  window.openTripStudioPanel=openTripStudioPanel;
  window.closeTripStudioPanel=closeTripStudioPanel;
  window.scrollTripStudioToBottom=scrollTripStudioToBottom;

  const originalOpenFriendModal=window.openFriendModal||openFriendModal;
  window.openFriendModal=function(){
    const modal=document.getElementById('mamaModal');
    if(modal) modal.classList.remove('studio-view');
    originalOpenFriendModal();
    updateUI();
    if(state.mode && isAdminUser()){
      const sheet=modal&&modal.querySelector('.guide-sheet');
      if(sheet) window.requestAnimationFrame(()=>{ sheet.scrollTop=sheet.scrollHeight; });
    }
  };

  const originalSetFriend=window.setFriend||setFriend;
  window.setFriend=function(key){
    if(key!==ADMIN_USER){ state.mode=false; setStoredMode(false); lockAdminSession(); }
    originalSetFriend(key);
    state.mode=readMode();
    updateUI();
    if(typeof window.refreshExpenseAdminUI==='function') window.refreshExpenseAdminUI();
    document.dispatchEvent(new CustomEvent('travelengine:adminmodechange',{detail:{enabled:state.mode}}));
  };

  document.addEventListener('DOMContentLoaded',function(){
    buildShell();
    state.mode=readMode();
    if(STORAGE.local.get(MODE_KEY)==='admin' && !state.mode) setStoredMode(false);
    updateUI();
  });
})();
