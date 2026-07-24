/* storage-config.js - canonical storage-key and domain ownership. */
(function(root){
  'use strict';
  const keys=Object.freeze({
    friend:'saigon_friend',
    checklist:'checklist',
    expenses:'expenses',
    momentsList:'moments_list',
    momentsFreeform:'moments_freeform',
    momentPrefix:'moment_',
    latestMomentPrefix:'moment_latest_',
    guideNavContext:'ccmv_guide_nav_context',
    guideNavReopen:'ccmv_guide_nav_reopen'
  });
  root.STORAGE_CONFIG=Object.freeze({
    namespace:root.TRIP_CONFIG.storageNamespace,
    version:1,
    keys,
    domains:Object.freeze({
      identity:Object.freeze({friend:keys.friend}),
      trip:Object.freeze({checklist:keys.checklist}),
      expenses:Object.freeze({records:keys.expenses}),
      moments:Object.freeze({records:keys.momentsList,freeform:keys.momentsFreeform,legacyPrefix:keys.momentPrefix,latestPrefix:keys.latestMomentPrefix}),
      guide:Object.freeze({context:keys.guideNavContext,reopen:keys.guideNavReopen})
    })
  });
})(globalThis);
