# VN Companion Phase 15 — Guide durable sync journal (candidate)

## Actual changes
- `guide-authority.js`: stage a durable pending Guide mutation before writing saved Guide overrides; if journal is inaccessible/corrupt, fail closed and keep Guide editor open via existing Phase 14 handler.
- `guide-sync-runtime.js`: upload only explicitly journalled Guide edits (never ZIP defaults), retain pending on cloud error, require explicit Retry for failed records, perform Supabase read-back and compare canonical payload and update timestamp before clearing a pending record; prevent remote pull from overwriting pending local Guide edits.
- `ci-tests/test-phase15-guide-journal.js`: exercise Save, simulated remote failure, no automatic retry, explicit retry, read-back, new Save invalidating prior sync, and corrupt-journal refusal.
- Registered test and refreshed SHA256 manifest. No user itinerary content edited.

## Verification
- `sh ci-tests/run-all.sh`: **PASS (exit 0)**.
- Phase 15 Guide journal test: **PASS**, using mocked Supabase responses.
- Actual browser UI: **NOT VERIFIED**.
- Real Supabase write/read-back: **NOT VERIFIED**.

## Open safety gaps — NOT READY TO DEPLOY
1. Guide pending/failed status is exposed internally but not yet displayed as a reliable user-facing global status + Retry button.
2. Timeline, Shopping and other manual edits do not yet have equivalent durable cloud confirmation.
3. Cross-device concurrent edits and Guide delete/tombstone semantics require separate conflict and deletion testing.
4. Need real Supabase isolated end-to-end validation before claiming `Saved & Synced` reliability.
5. Further audit needed for failure between journal stage and local saved-record commit and remote merge conflict handling.

Production GitHub, Vercel and Supabase were not modified.
