/* reset-runtime.js — RC29.85 Clear Trip Records
   Destructive scope is intentionally narrow: Documents, Moments and Expenses only.
   It must never reset itinerary/timeline, Booking, Guide, checklist, changed plans,
   Trip Studio drafts, completion state, or other trip settings. */
(function(root){
  'use strict';

  async function callRecordsResetRpc(){
    if(!root.SUPABASE?.getClient||!root.SUPABASE?.getSession)throw new Error('Shared Supabase client runtime unavailable');
    await root.SUPABASE.getSession();
    const config=root.SYNC_CONFIG||{};
    const rpcName=config.rpc?.resetTrip||'reset_trip';
    const {data,error}=await root.SUPABASE.getClient().rpc(rpcName,{p_trip_id:config.tripId});
    if(error){
      const missing=/could not find|does not exist|schema cache/i.test(error.message||'');
      throw new Error(missing?`Reset RPC "${rpcName}" is not installed.`:(error.message||'Reset RPC failed'));
    }
    const row=Array.isArray(data)?data[0]:data;
    if(!row||typeof row.new_generation!=='number')throw new Error('Reset RPC returned an unexpected result');
    return row;
  }

  window.resetTripData=async function(){
    if(!window.isAdminUnlocked?.() || !window.isAdminMode?.()){ alert('Open Trip Studio before clearing trip records.'); return false; }
    if(window.hasUnsavedAdminChanges?.()){ alert('Save or discard pending Trip Studio changes before clearing trip records.'); return false; }
    const ok=window.confirm('Clear Trip Records?\n\nThis permanently deletes Documents, Moments and Expenses for this trip, including uploaded document files and Moment photos.\n\nYour itinerary, bookings, Guide and trip settings will not be changed. This cannot be undone.');
    if(!ok) return false;

    const button=document.getElementById('resetTripDataButton');
    if(button){button.disabled=true;button.setAttribute('aria-busy','true');}
    try{
      if(!navigator.onLine) throw new Error('Connect to the internet before clearing trip records so cloud data and files can be deleted safely.');
      if(!window.SYNC_CONFIG?.hasCredentials?.()) throw new Error('Cloud reset is not configured. Reload the app and try again.');
      if(!window.EXPENSE_SYNC?.clearLocal || !window.MOMENT_SYNC?.clearLocal || !window.MOMENT_SYNC?.resetCloudPhotos || !window.TRIP_GENERATION?.setLocal || !window.TRIP_DOCUMENTS?.resetAll){
        throw new Error('Record reset services are not available. Reload the app and try again.');
      }

      window.EXPENSE_SYNC.pause();
      window.MOMENT_SYNC.pause();
      const {new_generation}=await callRecordsResetRpc(); // Expenses + Moments rows + generation only.
      await window.MOMENT_SYNC.resetCloudPhotos();
      await window.TRIP_DOCUMENTS.resetAll();

      window.TRIP_GENERATION.setLocal(new_generation);
      window.EXPENSE_SYNC.clearLocal();
      if(window.CCMV_CANONICAL_EXPENSE_LOCAL?.clearAll) window.CCMV_CANONICAL_EXPENSE_LOCAL.clearAll();
      else if(STORAGE_CONFIG.domains?.canonicalExpenses?.state) STORAGE.local.remove(STORAGE_CONFIG.domains.canonicalExpenses.state);
      if(window.CCMV_EXPENSE_READ_SHADOW?.clearState) window.CCMV_EXPENSE_READ_SHADOW.clearState();
      else if(STORAGE_CONFIG.domains?.expenseReadShadow?.state) STORAGE.local.remove(STORAGE_CONFIG.domains.expenseReadShadow.state);
      await window.MOMENT_SYNC.clearLocal();
      window.TRIP_DOCUMENTS.clearLocal?.();

      alert('Documents, Moments and Expenses have been permanently cleared. Your itinerary, bookings, Guide and trip settings are unchanged.');
      window.location.reload();
      return true;
    }catch(error){
      console.error('[Clear Trip Records]',error);
      alert(`Trip records could not be fully cleared. No itinerary, Booking, Guide or trip-setting data was changed.\n\n${error?.message||String(error)}`);
      if(button){button.disabled=false;button.removeAttribute('aria-busy');}
      return false;
    }
  };
})(globalThis);
