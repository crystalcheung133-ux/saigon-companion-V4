# CCMV Saigon Companion v1.0 — Production Feed Report

Baseline: NZ Companion RC22.1 Full Deploy
Source: Approved Saigon Master File + confirmed flight/hotel clarification

## Feed result
- 5 itinerary days generated.
- 4 individual travellers configured: Crystal (Admin), Christal, Mero and Vivian.
- Confirmed hotel and two confirmed flights imported.
- Unbooked restaurants, spas, cooking class and transfers remain Planning; none were silently marked confirmed.
- VND is the trip currency; AUD is the home currency.
- Ho Chi Minh City weather and Vietnam emergency information added.
- Rose Gold / Champagne / Ivory visual identity and CCMV Saigon branding applied.

## Curated shopping routes
- Day 2: District 1 Fashion Route.
- Day 3: Thảo Điền Lifestyle Route.
- Day 4: Phú Nhuận Designer Route.
- Core and optional stores are kept distinct.
- Each route uses the existing route-card / map mechanism and provides a Google Maps multi-stop walking route.
- Shopping Guide cards include Known For, CCMV Match and route priority guidance.

## Integrity
- Engine Integrity: 46/46 passed.
- Generation Adapter: 19/19 passed.
- Master File Importer: 23/23 passed.
- Unicode Regression: 6/6 passed.
- JavaScript syntax checks passed.

## Deliberate limitations
- Live opening hours, closures and availability should be rechecked closer to travel.
- Exact walking times are delegated to Google Maps rather than invented.
- Additional shopping research is classified as optional and does not overwrite the approved Master timeline.
