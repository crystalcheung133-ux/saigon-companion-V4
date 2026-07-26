/* VN-C2CD — local trip lifecycle: Complete, Reopen and Reset. */
(function(root){
  'use strict';
  const COMPLETE_KEY=(root.STORAGE_CONFIG&&root.STORAGE_CONFIG.keys.tripCompletion)||'ccmv_vietnam_trip_completion_v1';
  function read(){try{return JSON.parse(localStorage.getItem(COMPLETE_KEY)||'null');}catch(_){return null;}}
  function isComplete(){return !!read()?.completed;}
  function write(completed){
    if(completed)localStorage.setItem(COMPLETE_KEY,JSON.stringify({completed:true,completedAt:new Date().toISOString(),completedBy:'crystal'}));
    else localStorage.removeItem(COMPLETE_KEY);
    sync();
    document.dispatchEvent(new CustomEvent('ccmv:tripcompletionchange',{detail:{completed:!!completed}}));
  }
  function sync(){
    const completed=isComplete();
    document.body.classList.toggle('vn-trip-complete',completed);
    document.querySelectorAll('[data-vn-write-action],#expenseSaveButton,#momentsModal .moments-form .btn,#unexpectedModal .btn').forEach(el=>{
      el.disabled=completed;el.setAttribute('aria-disabled',String(completed));
    });
    document.querySelectorAll('.entry-actions').forEach(el=>el.hidden=completed);
  }
  function guard(name){
    const original=root[name]; if(typeof original!=='function'||original.__vnLifecycleGuard)return;
    function wrapped(){if(isComplete()){alert('This trip is complete and read-only. Crystal can reopen it from Trip Studio.');return false;}return original.apply(this,arguments);}
    wrapped.__vnLifecycleGuard=true;root[name]=wrapped;
  }
  function installGuards(){['saveExpense','editExpense','deleteExpense','saveMoments','editMoment','deleteMoment','saveUnexpected','openExpenseModal','openMomentsModal'].forEach(guard);sync();}
  function completeTrip(){
    if(!root.VN_ADMIN?.readMode?.())return false;
    if(isComplete())return true;
    if(!confirm('Complete Trip?\n\nThis will make the Companion read-only and unlock post-trip outputs. You can reopen it later from Trip Studio.'))return false;
    write(true);alert('Trip completed. The Companion is now read-only.');return true;
  }
  function reopenTrip(){
    if(!root.VN_ADMIN?.readMode?.())return false;
    if(!isComplete())return true;
    if(!confirm('Reopen Trip?\n\nThis will restore editing and lock post-trip outputs again.'))return false;
    write(false);alert('Trip reopened. Editing is available again.');return true;
  }
  function clearKnownTripData(){
    const keys=root.STORAGE_CONFIG?.keys||{};
    const exact=[keys.checklist,keys.expenses,keys.canonicalExpenseState,keys.expenseReadShadowState,keys.momentsList,keys.momentsFreeform,keys.guideNavContext,keys.guideNavReopen,keys.adminMode,COMPLETE_KEY].filter(Boolean);
    exact.forEach(k=>localStorage.removeItem(k));
    const prefixes=[keys.momentPrefix,keys.latestMomentPrefix].filter(Boolean);
    Object.keys(localStorage).forEach(k=>{if(prefixes.some(p=>k.startsWith(p)))localStorage.removeItem(k);});
    try{sessionStorage.removeItem('ccmv_vietnam_admin_unlocked_v1');}catch(_){}
  }
  function resetTripData(){
    if(!root.VN_ADMIN?.readMode?.())return false;
    if(!confirm('Reset Trip Data?\n\nThis removes all saved expenses, moments, checklist progress and completion state from this device. The original itinerary and guide remain.'))return false;
    if(!confirm('This cannot be undone. Reset all saved trip data now?'))return false;
    clearKnownTripData();alert('Trip data reset. The clean Companion will now reload.');location.reload();return true;
  }
  root.VN_LIFECYCLE={isComplete,completeTrip,reopenTrip,resetTripData,sync};
  document.addEventListener('DOMContentLoaded',()=>{installGuards();setTimeout(installGuards,0);});
})(globalThis);
