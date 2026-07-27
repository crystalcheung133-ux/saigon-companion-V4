# CCMV Travel Engine File Map - VN Refactored Baseline

## Configuration owners

| Domain | Owner |
|---|---|
| Trip identity, dates, participants, Days | `trip-config.js` |
| Theme model | `theme-config.js` |
| Brand assets and PWA icons | `asset-config.js` |
| Storage keys/domains | `storage-config.js` |
| Navigation routes | `navigation-config.js` |

## Canonical data boundary

| Domain | Owner |
|---|---|
| Canonical entity construction and relationship validation | `canonical-core.js` |
| Approved Vietnam Trip, Party, Participant, Place, Event, Booking, Collection and GuideEntry graph | `vietnam-canonical-data.js` |
| Exact Frozen VN legacy view-model projections and runtime-state compatibility mappers | `vietnam-presentation-adapter.js` |

`data.js` remains an immutable Frozen Vietnam content input so its prose and
asset-integrity hash stay exact. Runtime modules do not use its relationship
tables directly; all live trip-data reads pass through `VN_CANONICAL` and
`VN_PRESENTATION`.

## Runtime owners

| Domain | Sole owner |
|---|---|
| Browser storage operations | `storage.js` |
| Route and Guide return context | `navigation.js` |
| Shared mini menus, participant UI, modal dismissal | `core-runtime.js` |
| Trip cards and checklist | `trip-runtime.js` |
| Guide categories, Shopping entry, Place detail | `guide-runtime.js` |
| Day rendering and touch swipe | `day-runtime.js` |
| Days menu and itinerary overview | `itinerary-runtime.js` |
| Existing Frozen VN Moments | `moments-runtime.js` |
| Existing Frozen VN Expenses | `expenses-runtime.js` |
| Application bootstrap | `app-runtime.js` |
| Service-worker registration | `pwa.js` |
| Cache/fetch lifecycle | `sw.js` |

## Content and presentation authorities

- `data.js`: immutable Frozen Vietnam prose/content input.
- `VN_CANONICAL`: authoritative runtime identity and relationship graph.
- `VN_PRESENTATION`: sole compatibility projection for the frozen Vietnam UI.
- `styles.css`: Frozen Vietnam presentation. Stage 1 adds no override section.
- `index.html`: exact Frozen Vietnam splash DOM and timing.
- `guide.html`: route-first Shopping Directory content.
- CCMV logo and icon PNG files: unchanged brand assets.

## Active routes

- `index.html`
- `day.html?day=N`
- `place.html?id=PLACE_ID`
- `guide.html`
- `trip.html`
- `itinerary.html`
- `moments.html`
- `expenses.html`

`script.js` is deleted. Do not restore it or add compatibility wrappers for its former owners.
