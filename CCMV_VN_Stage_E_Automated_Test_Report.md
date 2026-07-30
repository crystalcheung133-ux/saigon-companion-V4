# CCMV Vietnam Companion — VN Stage E Automated Test Report

Date: 2026-07-29 (Australia/Sydney)

## Results

- Stage B5 Core plus Stage D adapter: 24/24 pass.
- Existing Booking repository, Stage C migration, and Stage 3.2B–3.2E regression files: 7/7 pass; their internal assertions also report all pass.
- Stage E implementation/security regression tests: 7/7 pass.
- Total Node test subtests/files reported: 38 pass, 0 fail.

## Stage E automated coverage

- Safe feature flag OFF and visible Stage E build label.
- No browser direct Booking table mutation path.
- Edge Function mutation endpoint and SQL privilege revocation.
- Canonical response mapping without reliance on Realtime echo.
- Same-record mutation held behind unresolved conflict.
- Queue usable after successful and simulated failed store lifecycle reset.
- Certified mutation compaction rules.

## Commands

```text
node --test sync-core-tests/*.js booking-stage-d-adapter.test.mjs
node legacy-test-runner.cjs
node --test stage-e-booking-sync.test.mjs
```

## Not automated here

Live Supabase, native browser IndexedDB restart, real two-device Realtime/offline behavior, and controlled server generation reset were not available in this local Node environment. They remain manual certification gates.
