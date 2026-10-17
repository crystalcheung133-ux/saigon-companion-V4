# Gate 31 — Staging-only browser bridge (NO SHIP)

## What is integrated
- `day.html` loads staging client, retry coordinator and bridge before the Timeline status UI.
- The existing Timeline pending journal is unchanged.
- The Retry button is **disabled by default**. No production endpoint can be selected in the staging client.
- Explicit opt-in is required in the browser console with ephemeral staging credentials:

```js
TRAVEL_STAGING_TIMELINE.enable({confirmStaging:true,tripId:'<staging-trip>',partyId:'<staging-party>',token:'<staging-token>'});
TRAVEL_TIMELINE_STATUS.refresh();
```

- Retry is manual only; it syncs one pending change. Do not use with actual itinerary edits. Only use fake staging trip data.
- No tokens are saved by the bridge; the existing retry coordinator persists mutation metadata locally.

## Validation
- Gate 31 complete existing master CI suite: PASS (after rebuilding checksum manifest).
- Node syntax checks for bridge and status UI: PASS.
- **NOT tested**: live HTTP, real browser, multi-tab concurrency, multi-day atomicity, manual cloud reconciliation, Booking/Guide/Shopping cloud synchronization.

## Known blockers
- Current staging retry refuses existing cloud days; requires manual reconciliation.
- Local pending journal is not namespaced by trip. **Do not enable staging on a browser profile with real VN edits.**
- Status UI only confirms staging, not production cloud.
- No automatic save-to-cloud; only explicit Retry after staging opt-in.
- Do not deploy to production.
