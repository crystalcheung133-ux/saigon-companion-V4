#!/bin/sh
set -u
PYTHONDONTWRITEBYTECODE=1
export PYTHONDONTWRITEBYTECODE
failed=0
run(){ echo "== $1 =="; shift; "$@" || failed=1; echo ""; }
run "FOUNDATION" sh ci-tests/suites/01-foundation.sh
run "DATA INTEGRITY" sh ci-tests/suites/02-data-integrity.sh
run "VN PRODUCT CONTRACTS" sh ci-tests/suites/03-product-contracts.sh
run "ANALYTICS" sh ci-tests/suites/04-analytics.sh
run "PORTABILITY" sh ci-tests/suites/05-portability.sh
run "RUNTIME RELIABILITY" sh ci-tests/suites/06-runtime-reliability.sh
run "GENERICITY" sh ci-tests/suites/07-genericity.sh
run "BOOKING / EXPENSE" sh ci-tests/suites/08-booking-expense.sh
run "EXPENSE SAVE SAFETY" sh ci-tests/suites/10-expense-save-safety.sh
run "EXPENSE COMMIT BOUNDARY" sh ci-tests/suites/11-expense-commit-boundary.sh
run "RELEASE" sh ci-tests/suites/09-release.sh
run "STUDIO POPUP WORKSPACE" node ci-tests/test-studio-popup-workspace-contract.js styles.css admin.js
run "PRESENTATION SHELL OWNERSHIP" node ci-tests/test-presentation-shell-ownership.js styles.css
run "PRESENTATION SHELL INTERACTION" node ci-tests/test-presentation-shell-interaction.js styles.css admin.js
run "RELEASE HYGIENE" node ci-tests/test-release-hygiene.js .
run "RETIRED BOOKINGS RUNTIME TOMBSTONE" node ci-tests/test-retired-bookings-runtime.js
run "SINGLE RELEASE IDENTITY" node ci-tests/test-single-release-identity.js
run "SUPABASE SDK EXACT PIN" node ci-tests/test-supabase-sdk-pin.js
run "BOOKING / GUIDE MODAL STACKING" node ci-tests/test-booking-guide-modal-stacking.js styles.css
run "TRIP / GUIDE SHELL CONSOLIDATION" node ci-tests/test-trip-guide-shell-consolidation.js styles.css
run "STUDIO HOME PREVIEW BOUNDS" node ci-tests/test-studio-home-preview-fit.js styles.css admin.js
run "STUDIO LIFECYCLE CONSOLIDATION" node ci-tests/test-studio-lifecycle-consolidation.js
run "STUDIO HEADER BADGE" node ci-tests/test-studio-header-badge.js styles.css admin.js
run "VN HEADER THEME" node ci-tests/test-vn-header-theme.js styles.css
run "CANONICAL STUDIO + EXPENSE DEEP-LINK" node ci-tests/test-canonical-studio-expense-deeplink.js
run "CANONICAL STUDIO VISUAL CONTRACT 25.6.2" node ci-tests/test-studio-visual-contract-2562.js
run "BOOKING MASTER STATUS + STUDIO EDIT" node ci-tests/test-booking-master-status-studio-edit.js
run "BOOKING SINGLE STATUS AUTHORITY" node ci-tests/test-booking-single-status-authority.js
run "QSPA D1-D3 RECONCILIATION" node ci-tests/test-qspa-d1-d3-reconciliation.js
run "RC29.121 BOOKING MOBILE + MULTIVISIT" node ci-tests/test-rc29117-booking-mobile-multivisit.js
run "RC29.121 SHOPPING ROUTE" node ci-tests/test-rc29117-shopping-route.js
run "RC29.121 ROUTE + QSPA SYNC" node ci-tests/test-rc29121-route-qspa-sync.js
run "RC29.121 SHOPPING 1/2/4 + FREE DAY 5" node ci-tests/test-rc29121-shopping-124-free5.js
run "RC29.122 SHOP-ONLY ROUTES + QSPA CARRIER" node ci-tests/test-rc29122-shop-route-qspa.js
run "RC29.124 QSPA NOTES SYNC" node ci-tests/test-rc29124-qspa-legacy-notes-sync.js
run "RC29.124 QSPA LEGACY NOTES" node ci-tests/test-rc29124-qspa-legacy-notes.js
run "RC29.125 QSPA MULTIVISIT TRANSPORT" node ci-tests/test-rc29125-qspa-multivisit-transport.js
run "RC29.126 BOOKING PLANNED-VISITS VERIFY (KEY-ORDER INSENSITIVE)" node ci-tests/test-booking-plannedvisits-verify-order-insensitive.js
run "EXPENSE SUITE FAILURE ACCUMULATION" node ci-tests/test-expense-suite-failure-accumulation.js
run "MULTI-DAY BOOKING + GUIDE ROUTING" node ci-tests/test-multiday-booking-guide-routing.js
run "BOOKING CONTACT CHANNEL UX" node ci-tests/test-booking-contact-channel-ux.js
run "PHASE10 test-booking-time-dynamic-contract.js" node ci-tests/test-booking-time-dynamic-contract.js
run "PHASE10 test-phase6-booking-journal.js" node ci-tests/test-phase6-booking-journal.js
run "PHASE10 test-phase7-delete-tombstone.js" node ci-tests/test-phase7-delete-tombstone.js
run "PHASE10 test-phase8-global-sync-status.js" node ci-tests/test-phase8-global-sync-status.js
run "PHASE10 test-phase9-delete-atomic-journal.js" node ci-tests/test-phase9-delete-atomic-journal.js
run "BOOKING SAVE POST-COMMIT INTEGRITY" node ci-tests/test-booking-save-post-commit-integrity.js
run "RC29.77 SETTLEMENT CHECKPOINT" node ci-tests/test-rc2976-settlement-checkpoint.js
run "RC29.80 GUIDE / SHARED PLACE OWNERSHIP" node ci-tests/test-rc2980-guide-place-ownership.js
run "RC29.80 TIMELINE RELATIONSHIP HYDRATION" node ci-tests/test-rc2980-timeline-relationship-hydration.js
run "RC29.85 GUIDE OWNERSHIP + MODAL FOREGROUND" node ci-tests/test-rc2985-guide-ownership-foreground.js .
run "RC29.86 GUIDE LANGUAGE + SHOPPING + BIDIRECTIONAL FOREGROUND" node ci-tests/test-rc2986-guide-language-shopping-bidirectional.js .
run "CUSTOM ACTIVITY NONPLACE LIFECYCLE" node ci-tests/test-custom-activity-nonplace-lifecycle.js
run "VN MULTIPLE PAYERS" node ci-tests/test-vn-multiple-payers.js
run "VN BACKLOG CLOSEOUT" node ci-tests/test-vn-backlog-closeout.js
run "RC29.97 EXPENSE AUTHORITY + FX REALISM" node ci-tests/test-rc2997-expense-authority.js
run "RC29.101 EXPENSE SCROLL + BALANCE + ACTIONS" node ci-tests/test-rc29101-expense-scroll-balance-actions.js
run "RC29.102 HISTORY + TERMINALS" node ci-tests/test-rc29102-history-terminals.js
run "SW PRECACHE HTML DEPENDENCIES" node ci-tests/test-sw-precache-html-dependencies.js
run "GATE7 TIMELINE JOURNAL WIRING" node ci-tests/test-gate7-timeline-journal-wiring.js
run "RC29.129 DAY3 MARUCO PRIMARY" node ci-tests/test-day3-maruco-primary-contract.js
run "RC29.129 DAY2 RUE MICHE SHOPPING" node ci-tests/test-day2-rue-miche-shopping-contract.js
run "RC29.130 MAP ADDRESS ROUTING" node ci-tests/test-rc29130-map-address-routing.js
run "RC29.131 TIMELINE AUTHORITY REBASE" node ci-tests/test-rc29131-timeline-authority-rebase.js
run "RC29.131 BOOKING TIME AUTHORITY" node ci-tests/test-rc29131-booking-time-authority.js
run "DAY 4 DYNAMIC ROUTE + BOOKING REFERENCES" node ci-tests/test-day4-approved-route-contract.js
run "MOC HUONG GUIDE OVERRIDE COMPATIBILITY" node ci-tests/test-moc-huong-guide-override-migration.js
[ "$failed" -eq 0 ] || { echo "MASTER CI SUITE FAILED"; exit 1; }
run "RC29.77 LIVE FX SAVE" node ci-tests/test-rc2977-live-fx-save.js
echo "MASTER CI SUITE PASSED"


run "RC29.69 SHARED DOCUMENTS" node ci-tests/test-rc2966-shared-documents.js
run "RC29.69 DOCUMENTS PARITY" node ci-tests/test-rc2967-documents-parity-ux.js
run "RC29.69 UI + DOCUMENTS BROWSER" node ci-tests/test-rc2968-ui-docs-browser-contract.js
run "RC29.75 GUIDE SYNC + NEXT STOP" node ci-tests/test-rc2974-guide-sync-derived-next-stop.js
run "TIMELINE EDITOR TIME DISPLAY" node ci-tests/test-timeline-editor-time-display.js
run "RC29.75 VN LOCATION + COMPACT TIMELINE" node ci-tests/test-rc2974-vn-location-compact-timeline.js
run "RC29.89 DAY4 QUAN THUY" node ci-tests/test-rc2987-day4-quan-thuy-nondestructive.js
[ "$failed" -eq 0 ] || { echo "POST-MASTER LEGACY SUITE FAILED"; exit 1; }

printf "\n== RC29.132 GUIDE MOBILE LAYOUT ==\n"
node ci-tests/test-rc29132-guide-layout.js

printf "\n== RC29.133 CONTENT CONTRACT ==\n"
node ci-tests/test-rc29133-content.js
printf '\n== RC29.134 QSPA VISIT TIME AUTHORITY ==\n'
node ci-tests/test-rc29134-qspa-visit-time-authority.js

run "REMOVED FOUR GUIDES" node ci-tests/test-removed-four-guides.js

run "PHASE 11 JOURNAL FAIL-CLOSED" node ci-tests/test-phase11-corrupt-journal-fail-closed.js
run "PHASE 12 STORAGE ERROR UI" node ci-tests/test-phase12-storage-error-ui.js
[ "$failed" -eq 0 ] || exit 1

run "PHASE 13 GUIDE STORAGE FAIL-CLOSED" node ci-tests/test-phase13-guide-storage-fail-closed.js
[ "$failed" -eq 0 ] || exit 1

run "PHASE 14 GUIDE SAVE ERROR" node ci-tests/test-phase14-guide-save-error.js
[ "$failed" -eq 0 ] || exit 1

run "PHASE 15 GUIDE JOURNAL + REMOTE READBACK" node ci-tests/test-phase15-guide-journal.js
[ "$failed" -eq 0 ] || exit 1

run "PHASE 16 GUIDE GLOBAL SYNC UI" node ci-tests/test-phase16-guide-status-ui.js
[ "$failed" -eq 0 ] || exit 1

run "PHASE 17 TIMELINE MUTATION CONSISTENCY" node ci-tests/test-phase17-timeline-data-consistency.js
[ "$failed" -eq 0 ] || exit 1

run "PHASE 18 DYNAMIC CROSS-SURFACE CONSISTENCY" node ci-tests/test-cross-surface-day-consistency.js
[ "$failed" -eq 0 ] || exit 1

run "GATE 20 ATOMIC MULTI-DAY TIMELINE JOURNAL" node ci-tests/test-gate20-atomic-timeline-batch.js
[ "$failed" -eq 0 ] || exit 1

echo "== GATE32 TRIP JOURNAL ISOLATION =="
node ci-tests/test-gate32-trip-isolation.js || exit 1
node ci-tests/test-gate32-status-journal-alignment.js || exit 1
node ci-tests/test-gate32-migration-preflight.js || exit 1

node ci-tests/test-gate32-journal-claim.js || exit 1
node ci-tests/test-timeline-journal-cutover.js || exit 1

node ci-tests/test-timeline-save-journal-selector.js || exit 1
