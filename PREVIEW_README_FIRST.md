# VN Companion — Local-only Preview (17 October 2026)

**Can deploy to a NEW, separate Preview domain. DO NOT replace the live website.**

Cloud configuration is disabled and the bundled production Supabase URL/key removed. Staging timeline HTTP client is disabled too. Preview does NOT sync between devices and does NOT claim Saved & Synced.

**Critical:** Preview localStorage belongs to its origin. Deploying future ZIPs to the SAME preview URL normally retains browser localStorage, but clearing site data, changing domain/browser, private mode or reinstalling can lose local edits. Export/copy your Notes separately before any upgrade. Do not rely on this ZIP as a verified durable backup.

Try: navigate itinerary, edit one test Note, Save, reload same browser; test booking/guide/shopping UI. Do not enter real Trip tokens or secrets. Do not use Publish. Some pre-existing UI may show cloud-related actions that will fail with cloud disabled.

Not yet verified: real browser E2E, all-surface manual edit retention, unified Save/Sync, cross-device sync, server conflicts, production-safe release.

CI NOTE: The existing production-oriented master suite contains a browser cloud override assertion that conflicts with the preview's deliberate fail-closed policy (external overrides are ignored). All other tests passed in the last run; therefore **master CI is NOT fully green for this preview**. The dedicated isolation checks and checksum verification pass. This is a limited preview, not a release.
