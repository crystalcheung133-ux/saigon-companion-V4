/* Vietnam Companion — Trip Studio Reset Data lifecycle.
   Uses the current VN local/canonical storage authorities. No NZ cloud RPC is assumed. */
(function(root){
  'use strict';
  function removeKnownKeys(){
    const k=STORAGE_CONFIG.keys;
    [k.checklist,k.expenses,k.canonicalExpenseState,k.momentsList,k.momentsFreeform,
     k.guideNavContext,k.guideNavReopen,k.itineraryOverrides,k.tripCompletion,k.changedPlans,
     k.cloudSnapshot,k.cloudSyncMeta,k.tripCompletion+':notice'].filter(Boolean).forEach(x=>STORAGE.local.remove(x));
    try{
      const prefixes=[k.momentPrefix,k.latestMomentPrefix].filter(Boolean);
      for(let i=localStorage.length-1;i>=0;i--){
        const key=localStorage.key(i);
        if(prefixes.some(prefix=>key&&key.startsWith(prefix))) localStorage.removeItem(key);
      }
    }catch(e){}
  }
  root.resetTripData=async function(){
    if(!root.isAdminUnlocked?.() || !root.isAdminMode?.()){ alert('Open Trip Studio before resetting trip data.'); return false; }
    const ok=root.confirm('Reset Trip Data?\n\nThis permanently deletes all saved expenses, moments and trip progress on this device.\n\nThe original itinerary and guide will remain. This cannot be undone.');
    if(!ok) return false;
    const button=document.getElementById('resetTripDataButton');
    if(button){button.disabled=true;button.setAttribute('aria-busy','true');}
    try{
      if(root.CCMV_CANONICAL_EXPENSE_LOCAL?.clearAll) root.CCMV_CANONICAL_EXPENSE_LOCAL.clearAll();
      removeKnownKeys();
      alert('Trip data has been reset. The clean companion will now reload.');
      location.reload();
      return true;
    }catch(error){
      console.error('[Reset Trip Data]',error);
      alert(`Reset could not be completed.\n\n${error?.message||String(error)}`);
      if(button){button.disabled=false;button.removeAttribute('aria-busy');}
      return false;
    }
  };
})(globalThis);
