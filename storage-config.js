/* storage-config.js - canonical storage-key and domain ownership. */
(function(root){
  'use strict';
  const keys=Object.freeze({
    friend:'saigon_friend',
    checklist:'checklist',
    expenses:'expenses',
    canonicalExpenseState:'ccmv-vietnam-2026:canonical_expenses:stage_3_2d:v1',
    expenseReadShadowState:'ccmv-vietnam-2026:canonical_expense_read_shadow:stage_3_2e:v1',
    momentsList:'moments_list',
    momentsFreeform:'moments_freeform',
    momentPrefix:'moment_',
    latestMomentPrefix:'moment_latest_',
    guideNavContext:'ccmv_guide_nav_context',
    guideNavReopen:'ccmv_guide_nav_reopen',
    adminMode:'ccmv_vietnam_admin_mode_v1',
    tripCompletion:'ccmv_vietnam_trip_completion_v1',
    bookings:'ccmv_vietnam_bookings_v1',
    bookingSchemaMigration:'ccmv-vietnam-2026:booking_schema_migration:stage_c:v1'
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
      expenseReadShadow:Object.freeze({state:keys.expenseReadShadowState}),
      moments:Object.freeze({records:keys.momentsList,freeform:keys.momentsFreeform,legacyPrefix:keys.momentPrefix,latestPrefix:keys.latestMomentPrefix}),
      guide:Object.freeze({context:keys.guideNavContext,reopen:keys.guideNavReopen}),
      admin:Object.freeze({mode:keys.adminMode}),
      lifecycle:Object.freeze({completion:keys.tripCompletion}),
      bookings:Object.freeze({records:keys.bookings,migration:keys.bookingSchemaMigration})
    })
  });
})(globalThis);
