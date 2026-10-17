# Phase 14 — Guide save failure UX (candidate)

## Changes
- `guide-runtime.js`: catch Guide local storage write errors in Save Guide; keep the form and unsaved input visible and display an accessible error instead of silently closing the modal.
- `guide-sync-runtime.js`: expose `unverified`, `syncing`, `completed-unverified`, `failed` state and error detail. **Important:** `completed-unverified` is deliberately NOT a `Synced ✓` guarantee: this legacy Guide flow has no durable per-edit journal or authoritative remote confirmation for every change.
- Added scoped test `ci-tests/test-phase14-guide-save-error.js`.

## Boundaries
- This is NOT the full Guide pending/retry solution. Legacy automatic background Guide sync still runs; it must be redesigned before release to satisfy explicit Retry semantics.
- Timeline and Shopping sync are not yet protected to the user's requested standard.
- No production writes or manual itinerary data changes.

## Verification
- Phase 14 focused test: PASS.
- Full Static CI after registry and checksum updates: PASS (exit 0).
- Browser and real Supabase: NOT VERIFIED.
- No production deployment.
