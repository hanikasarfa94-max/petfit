# Backend / Android Handoff

## Purpose

This document is the execution basis for the next phase after UI lock:

- keep the current demo presentation stable
- wire recognition results into the correct in-app objects
- prepare a backend contract that does not depend on React implementation details
- prepare an Android packaging path without losing the current web demo

## Current Source Of Truth

Use these files in this order.

1. `assets/derived/indexes/recognition-sticker-mapping.json`
   - canonical recognition key to sticker mapping
   - includes target object intent
2. `assets/derived/indexes/runtime-object-routing.json`
   - machine-readable object routing and object state switching rules
   - this file is intended for backend / Android reuse
3. `src/data/recognition-catalog.ts`
   - runtime catalog used by the current demo
4. `src/data/object-asset-rules.ts`
   - front-end source for object state switching
5. `src/domain/selectors.ts`
   - actual consumption logic used by the demo pages

## Runtime Routing Rules

Recognition results must enter the app through these buckets:

- `food -> bowl`
- `drink -> bottle`
- `rest -> manual_record_only`

This means:

- food recognition should eventually produce `foodRecords`
- drink recognition should eventually produce `drinkRecords`
- rest should not depend on image recognition; it stays in manual or timer-based recording

## Object State Rules

### Bowl

The bowl object is chosen by `totalItems` for the selected day.

- `0` -> `object_bowl_empty`
- `1..3` -> `object_bowl_light_fruit`
- `4..6` -> `object_bowl_full_fruit_salad`
- `> 6` -> `object_bowl_overflow_plus_n`

### Bottle

The bottle object is chosen by `hydrationProgress = hydrationMl / hydrationGoalMl`.

- `< 0` or `<= 0 ml` -> `object_bottle_empty`
- `0 .. < 0.25` -> `object_bottle_water_low`
- `0.25 .. < 0.6` -> `object_bottle_water_mid`
- `0.6 .. < 1` -> `object_bottle_water_high`
- `>= 1` -> `object_bottle_water_full`

### Cushion

The cushion object is chosen by rest completion and latest rest duration.

- no record -> `object_cushion_idle_flat`
- reached daily goal -> `object_cushion_finished_plush`
- latest rest `>= 15 min` -> `object_cushion_resting_with_buding`
- otherwise -> `object_cushion_used_soft`

## Sticker Consumption Rules

### Bowl stickers

The bowl page currently consumes:

- today's `foodRecords`
- all `recognitionKeys` from those records
- `representativePriority` from the recognition catalog
- top 6 visible stickers
- remaining count goes into `overflowCount`

Backend should preserve:

- one stable `recognitionKey` per recognized item
- one stable `representativePriority`
- one stable `stickerAssetName`

### Bottle stickers and tags

The bottle page currently consumes:

- today's `drinkRecords`
- one `recognitionKey` per drink record
- unique `stickerAssetName` values
- `statusTags` for sugar / caffeine style tags

Backend should preserve:

- one stable `recognitionKey`
- optional `statusTags`
- drink amount in `ml`

## Demo-Safe Backend Contract

The next backend response should avoid page-specific layout decisions. It should only return recognition facts.

Recommended per-item fields:

- `recognitionKey`
- `displayName`
- `domain`
- `targetObject`
- `stickerAssetName`
- `representativePriority`
- `statusTags`
- `quantity`
- `quantityUnit`
- `estimatedCalories`
- `confidence`

Recommended capture-session level fields:

- `sessionId`
- `sourceImage`
- `status`
- `suggestedTargetObject`
- `items`
- `confirmedAt`

## Android Preparation Path

The repository is still a pure Vite + React demo right now. There is no Android wrapper yet.

Recommended path:

1. keep the current web demo as the visual source of truth
2. freeze routing + recognition mapping first
3. introduce an Android wrapper only after the demo data contract is stable
4. prefer Capacitor as the first packaging path because it keeps the web demo reusable

Suggested Android milestones:

1. add a mobile shell wrapper
2. replace mock store writes with API-backed actions
3. keep local fallback seed data for demo mode
4. build debug APK
5. run QA against both local and cloud demo

## Demo Preservation Rules

When backend wiring starts, keep these demo guarantees:

- every page must still render without backend availability
- the mock seed must remain usable as a fallback
- capture flow must still be clickable end to end
- bowl / bottle / cushion pages must still show stable object states
- stats pages must remain real front-end cards, not screenshots

## Near-Term Implementation Order

Recommended next order after this handoff document:

1. finalize remaining UI deltas page by page
2. bind all recognition output to the JSON routing basis
3. define backend DTOs from the fields above
4. replace Zustand mock writes with API adapters behind the same selector shape
5. add Android packaging
6. if machine resources allow, build a debug APK
7. if deployment access is approved, deploy the demo for QA
