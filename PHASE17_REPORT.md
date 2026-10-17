# Phase 17 — Data consistency audit (candidate)

## Verified by new mutation test
- Explicitly deleted Timeline card remains deleted after master revision.
- Manually added card and custom Notes remain intact.
- Cleared Notes remain empty; edited time survives master revision.
- Untouched fields accept new master changes.
- New master card appears; current Guide relationships hydrate by card ID.
- Saved order remains stable across repeated loads.

`ci-tests/test-phase17-timeline-data-consistency.js` added to runner and registry. Full static CI PASS (`Phase17_Static_CI.log`). No live itinerary content or production data was changed.

## Findings and gaps
1. `ci-tests/test-cross-surface-day-consistency.js` still asserts a fixed six-card Day 4 list, fixed restaurant statuses, and other hard-coded itinerary content. It is **not** a fully dynamic consistency test and can reject valid manual edits.
2. Timeline mutation tests use an isolated simulated storage store. They do not prove remote Supabase persistence or multi-device conflict resolution.
3. Booking time propagation has separate dynamic unit coverage, but Booking→Timeline→Guide→Shopping→cloud full end-to-end consistency is not yet verified.
4. Timeline/Shopping pending journal, user-facing Retry and readback confirmation are not fully implemented or verified to the Booking/Guide standard.
5. Browser tests and isolated real Supabase E2E tests have not been completed.

## Ship decision
**HOLD — audit candidate, not production-ready.** Do not deploy or import into production without additional tests and explicit approval.
