/* admin.js — VN 3.0 Production: Crystal-only Trip Studio. */
(function(root){
  'use strict';
  const ADMIN_PARTY='crystal';
  const ADMIN_PIN='260922';
  const SESSION_KEY='ccmv_vietnam_admin_unlocked_v1';
  const MODE_KEY=(root.STORAGE_CONFIG&&root.STORAGE_CONFIG.keys.adminMode)||'ccmv_vietnam_admin_mode_v1';

  function isCrystal(){ return typeof root.getFriend==='function' && root.getFriend()===ADMIN_PARTY; }
  function isUnlocked(){ try{return sessionStorage.getItem(SESSION_KEY)==='1';}catch(_){return false;} }
  function setUnlocked(on){ try{on?sessionStorage.setItem(SESSION_KEY,'1'):sessionStorage.removeItem(SESSION_KEY);}catch(_){} }
  function readMode(){ return isCrystal() && isUnlocked() && localStorage.getItem(MODE_KEY)==='studio'; }
  function writeMode(on){ on?localStorage.setItem(MODE_KEY,'studio'):localStorage.removeItem(MODE_KEY); }

  function removeAdminDom(){
    ['vnTripStudioEntry','vnTripStudioModal','vnAdminPinModal','vnStudioBanner'].forEach(id=>document.getElementById(id)?.remove());
    document.body.classList.remove('vn-studio-mode','vn-studio-open','vn-admin-pin-open');
  }

  function syncModeUi(){
    const on=readMode();
    document.body.classList.toggle('vn-studio-mode',on);
    const banner=document.getElementById('vnStudioBanner');
    if(banner) banner.hidden=!on;
  }

  function closeStudio(){
    const modal=document.getElementById('vnTripStudioModal');
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
    document.body.classList.remove('vn-studio-open');
  }

  function openStudio(){
    if(!isCrystal()) return;
    buildStudio();
    const modal=document.getElementById('vnTripStudioModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('vn-studio-open');
    modal.querySelector('.vn-trip-studio-scroll')?.scrollTo(0,0);
    syncModeUi();
    syncLifecycleUi();
  }

  function syncPinViewport(){
    const modal=document.getElementById('vnAdminPinModal');
    if(!modal||modal.hidden) return;
    const viewport=root.visualViewport;
    if(viewport){
      modal.style.top=`${viewport.offsetTop}px`;
      modal.style.left=`${viewport.offsetLeft}px`;
      modal.style.width=`${viewport.width}px`;
      modal.style.height=`${viewport.height}px`;
    }
  }

  function resetPinViewport(){
    const modal=document.getElementById('vnAdminPinModal');
    if(!modal) return;
    modal.style.top='';modal.style.left='';modal.style.width='';modal.style.height='';
  }

  function focusPinInput(input){
    const focus=()=>{try{input.focus({preventScroll:true});input.setSelectionRange(input.value.length,input.value.length);}catch(_){}};
    focus();requestAnimationFrame(focus);setTimeout(focus,80);setTimeout(focus,220);
  }

  function openPin(){
    if(!isCrystal()) return;
    if(isUnlocked()){writeMode(true);openStudio();return;}
    buildPin();
    const modal=document.getElementById('vnAdminPinModal');
    modal.hidden=false;
    document.body.classList.add('vn-admin-pin-open');
    syncPinViewport();
    const input=modal.querySelector('#vnAdminPinInput');
    input.value='';
    modal.querySelector('#vnAdminPinError').hidden=true;
    focusPinInput(input);
  }

  function closePin(){
    const modal=document.getElementById('vnAdminPinModal');
    if(modal) modal.hidden=true;
    resetPinViewport();
    document.body.classList.remove('vn-admin-pin-open');
    if(!isUnlocked()){writeMode(false);syncModeUi();}
  }

  function buildPin(){
    if(document.getElementById('vnAdminPinModal')) return;
    const modal=document.createElement('div');
    modal.id='vnAdminPinModal';
    modal.className='vn-admin-pin-modal';
    modal.hidden=true;
    modal.innerHTML=`<div class="vn-admin-pin-sheet" role="dialog" aria-modal="true" aria-labelledby="vnAdminPinTitle">
      <button type="button" class="vn-admin-pin-close" aria-label="Close">×</button>
      <p class="kicker">TRIP STUDIO ACCESS</p><h2 id="vnAdminPinTitle">Enter Studio PIN</h2>
      <p class="vn-admin-pin-help">Enter the 6-digit PIN to open Crystal's creator workspace.</p>
      <form id="vnAdminPinForm"><input id="vnAdminPinInput" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" aria-label="6-digit Trip Studio PIN" placeholder="••••••">
      <p id="vnAdminPinError" class="vn-admin-pin-error" hidden>Incorrect PIN.</p>
      <button type="submit" class="vn-admin-pin-submit">Open Trip Studio</button></form></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.vn-admin-pin-close').addEventListener('click',closePin);
    modal.addEventListener('click',e=>{if(e.target===modal)closePin();});
    const input=modal.querySelector('#vnAdminPinInput');
    input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,6);modal.querySelector('#vnAdminPinError').hidden=true;});
    modal.querySelector('#vnAdminPinForm').addEventListener('submit',e=>{
      e.preventDefault();
      if(input.value===ADMIN_PIN){setUnlocked(true);writeMode(true);closePin();openStudio();}
      else{const error=modal.querySelector('#vnAdminPinError');error.hidden=false;input.classList.remove('shake');void input.offsetWidth;input.classList.add('shake');input.select();}
    });
  }


  function syncLifecycleUi(){
    const done=!!root.VN_LIFECYCLE?.isComplete?.();
    const heading=document.getElementById('vnCompleteHeading');
    const help=document.getElementById('vnCompleteHelp');
    const button=document.getElementById('vnCompleteTrip');
    if(heading)heading.textContent=done?'Reopen Trip':'Complete Trip';
    if(help)help.textContent=done?'Restore editing and lock post-trip outputs again.':'Lock editing and unlock post-trip outputs.';
    if(button)button.textContent=done?'Reopen Trip':'Complete Trip';
  }

  function disabledAction(label){
    return function(){
      const note=document.getElementById('vnStudioStageNote');
      if(note){note.textContent=`${label} will be connected in a later VN Admin stage.`;note.hidden=false;}
    };
  }

  function buildStudio(){
    if(document.getElementById('vnTripStudioModal')) return;
    const modal=document.createElement('div');
    modal.id='vnTripStudioModal';
    modal.className='vn-trip-studio-modal';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<section class="vn-trip-studio-sheet" role="dialog" aria-modal="true" aria-labelledby="vnTripStudioTitle">
      <div class="vn-trip-studio-scroll">
        <div class="vn-trip-studio-card">
          <header class="vn-trip-studio-head"><div><p class="vn-trip-studio-kicker">CREATOR WORKSPACE</p><h2 id="vnTripStudioTitle">Trip Studio</h2><p>Create, refine and manage this companion.</p></div><button type="button" class="vn-trip-studio-close" aria-label="Close Trip Studio">×</button></header>
          <div class="vn-studio-session-row"><span><strong>Crystal Studio session</strong><small>Exit clears authentication and requires the PIN next time.</small></span><button type="button" id="vnExitStudio" class="vn-studio-exit">Exit Studio</button></div>
          <div class="vn-studio-section vn-studio-management-section"><p class="vn-studio-label">TRIP MANAGEMENT</p>
            <button type="button" class="vn-studio-action is-disabled" id="vnPublishTrip"><span><strong>Publish Latest Trip</strong><small>Publish the saved trip directly to every Companion.</small></span><b aria-hidden="true">☁️</b></button>
            <div class="vn-studio-complete"><strong id="vnCompleteHeading">Complete Trip</strong><small id="vnCompleteHelp">Lock editing and unlock post-trip outputs.</small><button type="button" id="vnCompleteTrip">Complete Trip</button></div>
          </div>
          <div class="vn-studio-section vn-studio-export-section"><p class="vn-studio-label">EXPORT CENTRE</p><button type="button" class="vn-studio-action" id="vnOpenExport"><span><strong>Open Export Centre</strong><small>Itinerary and expenses are available anytime.</small></span><b aria-hidden="true">›</b></button></div>
          <div class="vn-studio-section vn-studio-danger-section"><p class="vn-studio-label">DATA CONTROL</p><button type="button" class="vn-studio-action vn-studio-danger" id="vnResetTrip"><span><strong>Reset Trip Data</strong><small>Restore the original trip and remove all saved progress.</small></span><b aria-hidden="true">↺</b></button></div>
          <p id="vnStudioStageNote" class="vn-studio-stage-note" hidden></p>
        </div>
      </div>
    </section>`;
    document.body.appendChild(modal);
    modal.querySelector('.vn-trip-studio-close').addEventListener('click',closeStudio);
    modal.addEventListener('click',e=>{if(e.target===modal)closeStudio();});
    modal.querySelector('#vnExitStudio').addEventListener('click',()=>{
      writeMode(false);setUnlocked(false);syncModeUi();
      root.VN_EXPORT_CENTRE?.close?.();
      closeStudio();
    });
    modal.querySelector('#vnPublishTrip').addEventListener('click',disabledAction('Publish Latest Trip'));
    modal.querySelector('#vnCompleteTrip').addEventListener('click',()=>{const done=root.VN_LIFECYCLE?.isComplete?.();done?root.VN_LIFECYCLE?.reopenTrip?.():root.VN_LIFECYCLE?.completeTrip?.();syncLifecycleUi();});
    modal.querySelector('#vnOpenExport').addEventListener('click',()=>{ if(root.VN_EXPORT_CENTRE) root.VN_EXPORT_CENTRE.open(); });
    modal.querySelector('#vnResetTrip').addEventListener('click',()=>root.VN_LIFECYCLE?.resetTripData?.());
  }

  function buildEntry(){
    if(!isCrystal()) return;
    const list=document.querySelector('#mamaModal .friend-choice-list');
    if(!list||document.getElementById('vnTripStudioEntry')) return;
    const button=document.createElement('button');
    button.id='vnTripStudioEntry';
    button.className='vn-trip-studio-entry';
    button.type='button';
    button.innerHTML='<span><strong>⚙️ Trip Studio</strong><small>Crystal creator workspace</small></span><b aria-hidden="true">›</b>';
    button.addEventListener('click',()=>{root.closeFriendModal?.();openPin();});
    list.insertAdjacentElement('afterend',button);
  }

  function buildBanner(){
    if(!isCrystal()) return;
    if(document.getElementById('vnStudioBanner')) return;
    const banner=document.createElement('div');
    banner.id='vnStudioBanner';
    banner.className='vn-studio-status-band';
    banner.setAttribute('role','status');
    banner.setAttribute('aria-live','polite');
    banner.hidden=true;
    banner.innerHTML='<strong>TRIP STUDIO</strong><span>All changes saved</span>';
    document.body.appendChild(banner);
  }

  function refresh(){
    if(!isCrystal()){
      writeMode(false);setUnlocked(false);removeAdminDom();return;
    }
    buildEntry();buildBanner();syncModeUi();
  }

  function routeActiveSelectorToStudio(event){
    const trigger=event.target?.closest?.('[data-action="friend-open"]');
    if(!trigger||!readMode()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openStudio();
  }

  root.VN_ADMIN={refresh,onIdentityChanged:refresh,open:openPin,close:closeStudio,isCrystal,readMode};
  document.addEventListener('click',routeActiveSelectorToStudio,true);
  document.addEventListener('DOMContentLoaded',()=>{refresh();syncLifecycleUi();});
  document.addEventListener('ccmv:tripcompletionchange',syncLifecycleUi);
  if(root.visualViewport){root.visualViewport.addEventListener('resize',syncPinViewport);root.visualViewport.addEventListener('scroll',syncPinViewport);}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePin();closeStudio();}});
})(globalThis);
