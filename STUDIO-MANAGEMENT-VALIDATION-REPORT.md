# CCMV Vietnam Companion — Studio Management R3 Validation Report

## Scope

This revision simplifies Vietnam Trip Studio to the capabilities currently required:

- User Selector → Studio Mode
- Crystal-only PIN access (`260922`)
- Read Mode
- Export Centre
- Complete Trip
- Reopen Trip
- Reset Trip Data

Save / Discard and timeline-edit draft state have been removed because this Vietnam baseline does not expose a Studio timeline editor, guide editor, booking editor, or other draft-based editing surface.

## Important Corrections from R2

1. Corrected the Studio administrator identity from the stale NZ value `lee` to the Vietnam party ID `crystal`.
2. Removed the unused Admin draft / dirty-state lifecycle and Save / Discard bar.
3. Removed Complete Trip and Reset Trip dependencies on pending Admin changes.
4. Updated Complete Trip confirmation copy from Lee to Crystal.
5. Updated the Service Worker cache name so installed PWAs request the revised runtime.
6. Retained the Vietnam expense modal's save-stays-open guidance across every entry page.

## Capability Behaviour

### Studio access

- Studio toggle remains inside the User Selector.
- Only the `crystal` party may enter Studio Mode.
- PIN remains `260922`.
- The original NZ PIN focus and VisualViewport keyboard handling remain active.

### Studio controls

- **Read Mode** exits Studio and locks the current Studio session.
- **Export Centre** opens the Vietnam Expenses page; export remains visible only to unlocked Crystal Studio Mode.
- **Complete Trip** makes expense, moment and checklist mutation controls read-only.
- **Reopen Trip** restores normal editing without deleting existing data.
- **Reset Trip Data** clears Vietnam local/canonical expenses, moments, progress and lifecycle state while retaining the original itinerary and guide.

## Validation Performed

- JavaScript syntax check: PASS (`admin.js`, `complete-runtime.js`, `reset-runtime.js`, `sw.js`).
- Studio administrator scan: PASS (`crystal`; no `lee` administrator constant remains).
- Save / Discard runtime scan: PASS (no dirty-state or Save / Discard API remains in Studio runtime).
- Required Studio labels and controls scan: PASS.
- Service Worker asset references: PASS.
- ZIP root structure and integrity: PASS.
- VN Stage 3.2B expense tests: PASS 10/10.
- VN Stage 3.2C repository tests: PASS 10/10.
- VN production wiring tests: PASS.
- VN Stage 3.2D dual-write functional cases: PASS except one obsolete source-text assertion.

## Known Test Contract Conflict

The existing Stage 3.2D test contains a historical assertion that `expenses-runtime.js` must not contain Custom Split state (`customShare_`). That assertion predates and directly conflicts with the requested NZ Custom Split production port. The functional dual-write, personal expense, equal split, edit, delete, mapping and fallback cases continue to pass; the obsolete source-text assertion is intentionally not treated as a production regression.

## Required Device Smoke Test

Before freezing production, verify on the deployed mobile/PWA build:

1. Select Crystal → toggle Studio → keyboard opens on PIN input.
2. Enter `260922` → Studio controls appear without page jump.
3. Read Mode exits Studio.
4. Export Centre opens Expenses and shows export access.
5. Complete Trip disables expense/moment/checklist mutation.
6. Reopen Trip restores mutation controls.
7. Reset Trip Data clears test records and reloads the clean trip.
8. Shared/Personal and Equal/Custom expense entry continue to work after the Service Worker refresh.

## Recommendation

This R3 package replaces R2. Do not deploy the earlier R1 or R2 packages.
