/* storage-config.js - canonical storage-key and domain ownership. */
(function(root){
  'use strict';
  const keys=Object.freeze({
    friend:'saigon_friend',
    checklist:'checklist',
    expenses:'expenses',
    canonicalExpenseState:'ccmv-vietnam-2026:canonical_expenses:stage_3_2d:v1',
    momentsList:'moments_list',
    momentsFreeform:'moments_freeform',
    momentPrefix:'moment_',
    latestMomentPrefix:'moment_latest_',
    guideNavContext:'ccmv_guide_nav_context',
    guideNavReopen:'ccmv_guide_nav_reopen',
    adminMode:'travel_engine_admin_mode_v1',
    adminDraft:'travel_engine_admin_draft_v1',
    tripCompletion:'ccmv-vietnam-2026:trip_completion:v1',
    itineraryOverrides:'ccmv-vietnam-2026:itinerary_overrides:v1',
    changedPlans:'ccmv-vietnam-2026:changed_plans:v1',
    cloudSnapshot:'ccmv-vietnam-2026:cloud_snapshot:v1',
    cloudSyncMeta:'ccmv-vietnam-2026:cloud_sync_meta:v1'
  });
  root.STORAGE_CONFIG=Object.freeze({
    namespace:root.TRIP_CONFIG.storageNamespace,
    version:1,
    keys,
    domains:Object.freeze({
      identity:Object.freeze({friend:keys.friend}),
      trip:Object.freeze({checklist:keys.checklist}),
      expenses:Object.freeze({records:keys.expenses}),
      canonicalExpenses:Object.freeze({state:keys.canonicalExpenseState}),
      moments:Object.freeze({records:keys.momentsList,freeform:keys.momentsFreeform,legacyPrefix:keys.momentPrefix,latestPrefix:keys.latestMomentPrefix}),
      guide:Object.freeze({context:keys.guideNavContext,reopen:keys.guideNavReopen})
    })
  });
})(globalThis);
