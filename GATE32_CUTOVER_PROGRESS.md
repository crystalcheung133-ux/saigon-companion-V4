# Gate 32 — cutover safety gate

Added `timeline-journal-cutover.js`: explicit trip identity and read-only preflight for legacy/scoped pending. It refuses cutover when either journal contains pending changes or when storage is unreadable. It does not switch production Save, migrate, acknowledge, or delete data.

Local test: `node ci-tests/test-timeline-journal-cutover.js` PASS. Master CI status: see run log / current test output.

Remaining blockers: legacy ownership reconciliation, real HTTP E2E, browser E2E, cross-day atomicity, Booking/Guide/Shopping Save & Sync. NO SHIP.
