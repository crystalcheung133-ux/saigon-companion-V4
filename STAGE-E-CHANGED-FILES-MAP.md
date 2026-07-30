# Stage E Changed Files Map

## Runtime and configuration

- `trip-config.js` — Stage E build, OFF-by-default rollout mode.
- `supabase-config.js` — scoped trip token configuration.
- `booking-repository.js` — mutation acknowledgement and generation seam.
- `booking-sync-adapter.js` — generation bump application.
- `sync-bootstrap.js` — Stage E orchestration and local mutation capture.
- `supabase-booking-provider.js` — direct write path disabled.
- `supabase-sync-provider.mjs` — scoped read/Realtime/Edge Function transport.
- `sw.js` — Stage E cache and new assets.
- `package.json`, `legacy-test-runner.cjs` — verification commands.

## Certified Core

- `sync-core/sync-core.js` — enqueue seam and conflict hold/deduplication.
- `sync-core/sync-indexeddb-store.js` — durable queue and first-sync stores.
- `sync-core/index.js` — durable store export.
- `sync-core-tests/*.js` — restored B5 tests with deploy-relative import paths.

All other `sync-core/*.js` files are restored, unchanged Stage B5 sources required by the Stage D package.

## Supabase

- `supabase/migrations/20260729_vn_stage_e_booking_sync.sql`
- `supabase/functions/booking-sync/index.ts`
- `STAGE-E-EDGE-FUNCTION-DEPLOYMENT.md`

## Tests and reports

- `stage-e-booking-sync.test.mjs`
- `CCMV_VN_Stage_E_Implementation_Report.md`
- `CCMV_VN_Stage_E_Automated_Test_Report.md`
- `STAGE-E-MANUAL-TWO-DEVICE-CERTIFICATION.md`
- `STAGE-E-ROLLBACK-INSTRUCTIONS.md`
- `STAGE-E-CHANGED-FILES-MAP.md`

## Asset-version-only HTML changes

`bookings.html`, `day.html`, `expenses.html`, `guide.html`, `index.html`, `itinerary.html`, `memory.html`, `moments.html`, `offline.html`, `place.html`, and `trip.html` change `vn-stage-d-1` asset queries to `vn-stage-e-1`.

`styles.css` was not edited.
