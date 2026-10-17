# Gate 32 — legacy journal migration preflight
Status: NO SHIP. No production changes.

Added `timeline-journal-migration.js` with `inspectLegacyTimelineJournal(storage,{tripId,environment})`. It reads the legacy and scoped journals without writing, deleting, or assigning old entries to a trip. Because legacy entries lack trip ownership, any legacy pending entry results in `MANUAL_OWNERSHIP_REVIEW_REQUIRED`. Corrupt journals throw and fail closed. No automatic migration is implemented or enabled. Production Save remains on legacy journal pending a safe, explicitly approved migration policy.

New CI `test-gate32-migration-preflight.js` covers zero writes, legacy preservation, coexistence with scoped entries, invalid trip and corrupt legacy. Full static master CI PASS on this candidate. Real HTTP and browser E2E not executed. Booking/Guide/Shopping cloud synchronization and multi-day transactional CAS remain outstanding.
