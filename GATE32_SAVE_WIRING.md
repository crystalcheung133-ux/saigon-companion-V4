# Gate 32 — Save Journal Selector (2026-10-17)

## Implemented
- Wired day.html Timeline Save to `selectTimelineSaveJournal` instead of calling the legacy journal directly.
- Default continues writing to existing legacy journal; **no automatic migration or production cutover**.
- Explicit opt-in requires `window.VN_TIMELINE_JOURNAL_CUTOVER={enabled:true,environment:'production',tripId:'...',confirmedTripId:'...'}` and both legacy and target scoped journal empty. Invalid, unreadable or pending journals fail closed before local commit.
- Trip-scoped journal writes remain local only. No cloud Saved & Synced assertion.
- Added runtime dependencies to HTML and service worker, updated production manifest/checksums, registered safety test.
- Master CI PASS. No browser or HTTP E2E executed.

## Critical blockers
- The opt-in configuration is developer-only; not a user-facing ownership confirmation. Do not enable on real itinerary before ownership review and cloud reconciliation.
- Legacy pending ownership migration, multi-day transactional cloud CAS, and Booking/Guide/Shopping full Save & Sync remain unimplemented.
- HTTP E2E and browser E2E pending. NO SHIP.
