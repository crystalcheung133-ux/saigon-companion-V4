# Updating the VN Refactored Baseline

1. Treat `data.js` as the frozen Vietnam content input; do not change it without a separately approved content stage.
2. Change canonical identity or relationships in `vietnam-canonical-data.js`.
3. Change exact Vietnam view-model translation only in `vietnam-presentation-adapter.js`.
4. Change trip identity, dates, participants or Day labels in `trip-config.js` and update the canonical graph in the same verified change.
5. Change routes only in `navigation-config.js`/`navigation.js`.
6. Change behaviour in the sole runtime owner listed in `ENGINE_FILE_MAP.md`.
7. Edit existing canonical CSS rules in place. Never append an override section.
8. Update the runtime query version and `CACHE_NAME` together.
9. Run syntax, relationship, foreign-data, browser interaction, mobile viewport and PWA checks.
10. Do not add a second data graph consumer, renderer, popup owner, storage facade, service-worker registration, or delegated event owner.

Melbourne/MEL is allowed only in verified VJ082/VN781 Vietnam flight records. It is prohibited as a participant code, address, route stop, fallback or demo value.
