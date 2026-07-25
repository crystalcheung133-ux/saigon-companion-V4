# NZ → Vietnam Production Capability Port Validation Report

## Sources
- Capability source only: NZ-Companion-Production-Frozen-Stage3.2H(3).zip
- Target baseline: CCMV-Vietnam-Companion-Stage3.2D-VN-Wiring-Fix-Full-Deploy.zip
- Previous recreated VN v3 implementation was not used as a source.

## Ported directly from NZ production
- User Selector → Studio Mode toggle and PIN flow (PIN 260922)
- VisualViewport PIN focus/keyboard positioning behaviour
- Trip Studio modal shell, Read Mode, dirty-state banner, Save and Discard controls
- Expense Shared/Personal toggle
- Equal/Custom split toggle
- Per-field Clear controls
- 🧮 calculator modal and safe arithmetic evaluation
- Automatic single-blank final-party remainder and manual remainder button
- Custom split total validation

## Vietnam-only adaptations
- Admin identity: Crystal
- Parties: Christal, Crystal, Mero, Vivian
- Currency: VND from Vietnam locale configuration
- Category UI and category authority removed; saved category is null
- Studio contains only Studio Mode, Read Mode, Save, Discard and Export Centre
- No Publish, Complete Trip, Reset Trip Data, Review Mode or Planner controls
- Existing Vietnam theme, trip data modules, storage namespace and canonical expense wiring retained

## Validation performed
- JavaScript syntax checks passed for all changed/added runtime files.
- All HTML pages containing the expense tool received the same production modal DOM.
- All HTML pages load the adapted Studio runtime.
- Service worker cache includes all new production runtime dependencies.
- ZIP roots contain deployable files directly, with no outer folder.
