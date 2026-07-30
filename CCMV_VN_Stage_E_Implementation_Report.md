# CCMV Vietnam Companion — VN Stage E Implementation Report

## Status

Stage E Booking Sync implementation is complete for automated/local verification. Real Supabase deployment and two-device certification remain pending.

## Baseline provenance

The supplied `saigon-companion-V4-main (10).zip` identifies itself internally as `stage-d-booking-adapter`, has the visible Stage D build label, and contains the Stage D adapter/tests. Its `package.json` references `sync-core/` and `sync-core-tests/`, but those folders were missing from that ZIP. They were restored from the supplied, hash-recorded Stage B5 Hardening Package before implementation.

No S1C implementation or older Vietnam deploy was used.

## Implementation

- Added an IndexedDB mutation store and generation-scoped first-sync store.
- Added a Supabase Sync Provider that reads scoped Booking data, writes only through `booking-sync`, receives Realtime Postgres changes, reconnects, and refetches after browser reconnect.
- Replaced the Stage D registration bootstrap with an OFF-by-default Stage E runtime.
- Kept Booking Repository as the UI's only local data seam.
- Added mutation attribution from the existing Friend Selector.
- Added first-device upload, remote download, record-level reconciliation, canonical acknowledgement write-back, and local mutation observation.
- Added same-record conflict hold behavior and conflict deduplication.
- Added repository generation-bump handling through the certified reset orchestrator.
- Disabled the legacy browser Booking-table upsert path.
- Added a private, service-role-only database mutation function and scoped Edge Function.
- Updated build/cache/HTML asset versions to Stage E.
- Left `styles.css`, Booking visual design, homepage, Expenses, Moments, Media, and Export behavior unchanged.

## Certified Core changes

Two integration changes were made to `sync-core/sync-core.js`:

1. A public `enqueueMutation()` seam delegates to the certified queue and refreshes state counts.
2. An open conflict holds later same-record mutations and duplicate conflict records are suppressed.

Regression coverage is in `stage-e-booking-sync.test.mjs`; all restored B5 tests pass.

## Rollout

The deploy defaults to:

```js
bookingSyncRuntime: false
bookingSyncMode: 'off'
```

Certification requires explicit configuration of Supabase URL, anon key, scoped trip token, and `bookingSyncRuntime: true` with mode `certification`.

## Limitations

- The Edge Function and migration have not been deployed from this workspace.
- No live Supabase project credentials were supplied.
- Real Realtime, browser restart persistence, offline reconnect, conflict resolution, and generation reset require the attached two-device checklist before certification.
- This report does not claim production or multi-device certification.
