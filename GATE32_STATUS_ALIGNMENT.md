# Gate 32 — Pending Status / Save Journal Alignment

- Fixed timeline-sync-status-ui.js to read the same `selectTimelineSaveJournal(localStorage, VN_TIMELINE_JOURNAL_CUTOVER)` selected by day.html Save.
- Refreshes status for both legacy and v2 trip-scoped journal storage events.
- Pending cloud Retry remains disabled for live itinerary; no false cloud success claim.
- Added test-gate32-status-journal-alignment.js to active CI registry and run-all.sh.
- Updated SHA256SUMS.txt for changed production script.
- Master CI completed with exit 0 in this run.

**Not tested:** live HTTP Edge Function, browser E2E, full Booking/Guide/Shopping cloud sync. No production deployment. NO SHIP.
