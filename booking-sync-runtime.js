/* VN S1C safe rollback compatibility shim.
   Sync is intentionally disabled; local Booking Repository remains authoritative. */
(function(root){
  'use strict';
  function status(){ return {enabled:false,state:'rollback',message:'Booking sync is temporarily disabled.'}; }
  root.CCMV_BOOKING_SYNC={
    enabled:false,
    status:status,
    syncNow:function(){ return Promise.resolve(status()); },
    start:function(){ return Promise.resolve(status()); },
    stop:function(){ return true; }
  };
  root.openBookingSync=function(){
    var modal=document.getElementById('bookingSyncModal');
    var content=document.getElementById('bookingSyncContent');
    if(content) content.innerHTML='<p class="kicker">BOOKING SYNC</p><h2>Temporarily disabled</h2><p class="lead">The app has been safely rolled back to local Booking storage. Your saved Booking details remain on this device.</p>';
    if(modal) modal.classList.add('show');
  };
  root.closeBookingSync=function(){ var modal=document.getElementById('bookingSyncModal'); if(modal) modal.classList.remove('show'); };
})(globalThis);
