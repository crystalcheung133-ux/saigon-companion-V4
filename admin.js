/* admin.js — VN-C2B.1 Crystal-only Trip Studio + Export Centre entry. */
(function(root){
  'use strict';
  const ADMIN_PARTY='crystal';
  const ADMIN_PIN='260922';
  const SESSION_KEY='ccmv_vietnam_admin_unlocked_v1';
  const MODE_KEY=(root.STORAGE_CONFIG&&root.STORAGE_CONFIG.keys.adminMode)||'ccmv_vietnam_admin_mode_v1';
  const state={open:false};

  function isCrystal(){ return typeof root.getFriend==='function' && root.getFriend()===ADMIN_PARTY; }
  function isUnlocked(){ try{return sessionStorage.getItem(SESSION_KEY)==='1';}catch(_){return false;} }
  function setUnlocked(on){ try{on?sessionStorage.setItem(SESSION_KEY,'1'):sessionStorage.removeItem(SESSION_KEY);}catch(_){} }
  function readMode(){ return isCrystal() && isUnlocked() && localStorage.getItem(MODE_KEY)==='studio'; }
  function writeMode(on){ on?localStorage.setItem(MODE_KEY,'studio'):localStorage.removeItem(MODE_KEY); }

  function removeAdminDom(){
    ['vnTripStudioEntry','vnTripStudioModal','vnAdminPinModal','vnStudioBanner'].forEach(id=>document.getElementById(id)?.remove());
    document.body.classList.remove('vn-studio-mode','vn-studio-open','vn-admin-pin-open');
    state.open=false;
  }

  function syncModeUi(){
    const on=readMode();
    document.body.classList.toggle('vn-studio-mode',on);
    const toggle=document.getElementById('vnStudioModeToggle');
    if(toggle) toggle.checked=on;
    const banner=document.getElementById('vnStudioBanner');
    if(banner) banner.hidden=!on;
  }

  function closeStudio(){
    const modal=document.getElementById('vnTripStudioModal');
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
    document.body.classList.remove('vn-studio-open');
    state.open=false;
  }

  function openStudio(){
    if(!isCrystal()) return;
    buildStudio();
    const modal=document.getElementById('vnTripStudioModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('vn-studio-open');
    state.open=true;
    modal.querySelector('.vn-trip-studio-scroll')?.scrollTo(0,0);
    syncModeUi();
  }

  function openPin(){
    if(!isCrystal()) return;
    if(isUnlocked()){openStudio();return;}
    buildPin();
    const modal=document.getElementById('vnAdminPinModal');
    modal.hidden=false;
    document.body.classList.add('vn-admin-pin-open');
    const input=modal.querySelector('#vnAdminPinInput');
    input.value='';
    modal.querySelector('#vnAdminPinError').hidden=true;
    setTimeout(()=>input.focus(),80);
  }

  function closePin(){
    const modal=document.getElementById('vnAdminPinModal');
    if(modal) modal.hidden=true;
    document.body.classList.remove('vn-admin-pin-open');
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
      if(input.value===ADMIN_PIN){setUnlocked(true);closePin();openStudio();}
      else{const error=modal.querySelector('#vnAdminPinError');error.hidden=false;input.classList.remove('shake');void input.offsetWidth;input.classList.add('shake');input.select();}
    });
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
          <label class="vn-studio-mode-row"><span><strong>Studio Mode</strong><small>Turn on editing tools for itinerary and trip data.</small></span><input id="vnStudioModeToggle" type="checkbox" aria-label="Studio Mode"><i aria-hidden="true"></i></label>
          <div class="vn-studio-section"><p class="vn-studio-label">TRIP MANAGEMENT</p>
            <button type="button" class="vn-studio-action is-disabled" id="vnPublishTrip"><span><strong>Publish Latest Trip</strong><small>Publish the saved trip directly to every Companion.</small></span><b aria-hidden="true">☁️</b></button>
            <div class="vn-studio-complete is-disabled"><strong>Complete Trip</strong><small>Lock editing and unlock post-trip outputs.</small><button type="button" id="vnCompleteTrip">Complete Trip</button></div>
          </div>
          <div class="vn-studio-section"><p class="vn-studio-label">EXPORT CENTRE</p><button type="button" class="vn-studio-action" id="vnOpenExport"><span><strong>Open Export Centre</strong><small>Itinerary and expenses are available anytime.</small></span><b aria-hidden="true">›</b></button></div>
          <div class="vn-studio-section vn-studio-danger-section"><p class="vn-studio-label">DATA CONTROL</p><button type="button" class="vn-studio-action vn-studio-danger is-disabled" id="vnResetTrip"><span><strong>Reset Trip Data</strong><small>Restore the original trip and remove all saved progress.</small></span><b aria-hidden="true">↺</b></button></div>
          <p id="vnStudioStageNote" class="vn-studio-stage-note" hidden></p>
        </div>
      </div>
    </section>`;
    document.body.appendChild(modal);
    modal.querySelector('.vn-trip-studio-close').addEventListener('click',closeStudio);
    modal.addEventListener('click',e=>{if(e.target===modal)closeStudio();});
    modal.querySelector('#vnStudioModeToggle').addEventListener('change',e=>{
      if(!isCrystal()){e.target.checked=false;return;}
      writeMode(e.target.checked);syncModeUi();
    });
    modal.querySelector('#vnPublishTrip').addEventListener('click',disabledAction('Publish Latest Trip'));
    modal.querySelector('#vnCompleteTrip').addEventListener('click',disabledAction('Complete Trip'));
    modal.querySelector('#vnOpenExport').addEventListener('click',()=>{ if(root.VN_EXPORT_CENTRE) root.VN_EXPORT_CENTRE.open(); });
    modal.querySelector('#vnResetTrip').addEventListener('click',disabledAction('Reset Trip Data'));
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
    if(!isCrystal()||document.getElementById('vnStudioBanner')) return;
    const banner=document.createElement('button');
    banner.id='vnStudioBanner';
    banner.className='vn-studio-banner';
    banner.type='button';
    banner.hidden=true;
    banner.innerHTML='<strong>TRIP STUDIO</strong><span>Studio Mode On</span>';
    banner.addEventListener('click',openStudio);
    document.body.appendChild(banner);
  }

  function refresh(){
    if(!isCrystal()){
      writeMode(false);setUnlocked(false);removeAdminDom();return;
    }
    buildEntry();buildBanner();syncModeUi();
  }

  root.VN_ADMIN={refresh,onIdentityChanged:refresh,open:openPin,close:closeStudio,isCrystal,readMode};
  document.addEventListener('DOMContentLoaded',refresh);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePin();closeStudio();}});
})(globalThis);
