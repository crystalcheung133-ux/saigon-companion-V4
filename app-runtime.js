/* app-runtime.js - CCMV Travel Engine reusable owner.
   Owns one application bootstrap listener.
   Vietnam-specific values are supplied by config/data modules. */
document.addEventListener('DOMContentLoaded',()=>{
  updateFriendLabels();
  renderUnexpected();
  loadChecklist();
  renderDashboard();
});
