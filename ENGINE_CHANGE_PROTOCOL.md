# CCMV Travel Engine Change Protocol

## Required sequence

Audit -> edit the active owner -> static verification -> real browser interaction -> mobile/PWA verification -> report.

## Ownership rule

Every feature has one data/config authority, one runtime owner and one event owner. Delete the replaced owner in the same verified stage. Do not leave aliases, wrappers or inactive implementations.

## Engine extraction rule

Reusable concerns belong in engine-shaped modules. Trip-specific values remain in config/data:

- renderer ownership;
- trip, participant, theme and asset models;
- storage keys and operations;
- navigation;
- Guide presentation;
- booking relationships;
- PWA registration and cache identity.

## Canonical trip-data rule

Runtime identity and relationships must resolve through `VN_CANONICAL`.
Vietnam DOM/card data must be read through `VN_PRESENTATION`. Do not add a
second live consumer of the legacy globals in `data.js`.

## Preservation rule

Vietnam editorial content, CCMV branding, Shopping routes, Vietnamese addresses, four-friend identity, splash DOM/timing and the deployed Moments/Expenses behaviour must not be rewritten during structural maintenance.

## Stop conditions

Stop on a duplicate owner, content loss, foreign fallback, stuck Day renderer, blocked mobile popup, broken browser history, stale PWA runtime, or untested interaction.
