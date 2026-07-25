# NZ → Vietnam Production Capability Port — Revised Validation Report

## Status
This revision supersedes the first Stage 3.2H port package. The first package passed syntax/static checks but was not sufficient to claim low integration risk.

## Production source and target
- Capability source: `NZ-Companion-Production-Frozen-Stage3.2H(3).zip` only.
- Target baseline: `CCMV-Vietnam-Companion-Stage3.2D-VN-Wiring-Fix-Full-Deploy.zip`.
- Previous recreated VN v3 implementation was not used as a source.

## Ported capabilities
- Original NZ User Selector → Trip Studio PIN flow (`260922`), adapted from Lee to Crystal.
- Original NZ Studio modal structure, Read Mode, Save and Discard state handling.
- Complete Trip / Reopen Trip lifecycle and read-only mutation guards.
- Reset Trip Data control with the original NZ Studio danger-zone UX.
- Expense Shared/Personal, Equal/Custom, Clear, 🧮 calculator and automatic final-party remainder logic.

## Required VN adaptations
- Four individual parties: Christal, Crystal, Mero and Vivian.
- Existing VN/VND formatting and Vietnam presentation/data modules retained.
- Expense Category removed.
- No Publish, Review Mode or Planner.
- Reset uses Vietnam’s actual local/canonical storage owners. The NZ cloud reset RPC was intentionally not copied because this Vietnam baseline does not ship the NZ sync/generation stack.

## Validation
- JavaScript syntax checked for every JS file.
- All HTML entry points checked for Studio, Reset and Complete runtime load order.
- All expense modal entry points checked for four-party controls and no Category field.
- Forbidden feature scan checked for Publish, Review Mode and Planner controls in the ported Studio modules.
- Service worker asset list checked for all newly required runtime files.
- ZIP roots contain deployable files directly, without an outer folder.

## Residual risk
Static and runtime-module validation cannot fully reproduce iOS/Android keyboard behaviour, installed-PWA cache upgrades, or real user interaction sequences. A device smoke test is still required before calling this production-frozen. Recommended checks: Studio PIN entry, selector reopen/close, dirty Save/Discard, Complete/Reopen, Reset cancel/confirm, Shared/Personal, Equal/Custom remainder, calculator, and PWA reload.
