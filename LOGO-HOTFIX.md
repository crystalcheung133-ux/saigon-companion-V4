# Seoul Winter Home/Splash Logo Hotfix

- Home and splash images use a versioned, real `src` on first parse and preload in head.
- Splash logo visibility is immediate, independent of previous keyframe animation.
- Network-first page navigation in PWA service worker prevents cached older `index.html` masking a current build.
- Service worker version changed and existing Seoul caches purged on activation.
- Other pages and trip data stay unchanged.
