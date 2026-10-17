# Gate 32 — Journal Isolation Safety Patch (NO SHIP)

## Applied
- Staging bridge now uses `vn_timeline_staging_only_test_20261017`, NEVER the live `vn_timeline_pending_v1` journal.
- Staging retry metadata also has its own namespace.
- Staging opt-in restricted to a fixed fake trip and admin fixture party.
- Only `test-day-*` fake days can be queued via `enqueueFake`.
- The live Timeline Retry button is always disabled: staging must not drain live itinerary edits.
- Corrupt staging journal/metadata fails closed.

## Still blocked
- Actual itinerary journal still lacks per-trip isolation. Do not enable live cloud sync.
- HTTP E2E and browser E2E remain unverified.
- Multi-day atomic CAS, cross-surface Booking/Guide/Shopping integration unresolved.
- No production deployment.

## Isolated staging test (not actual itinerary)
`TRAVEL_STAGING_TIMELINE.enable({confirmStaging:true,tripId:'staging-test-20261017',partyId:'admin-test',token:'<staging-only-token>'})`
`TRAVEL_STAGING_TIMELINE.enqueueFake('test-day-a',[{id:'fixture',notes:'fake'}])`
`await TRAVEL_STAGING_TIMELINE.retryOne()`
