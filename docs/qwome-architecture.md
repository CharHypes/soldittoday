# QWOME™ architecture & separation roadmap

QWOME is a property-fit intelligence platform. **Sold It Today is its first
client, not its owner.** This document records how the code is structured today,
what is still coupled to Sold It Today, and the progressive path to lifting QWOME
into a standalone service/API (QWOME.com, mobile apps, embeddable widgets,
partner/MLS integrations) **without rewriting the system or breaking the site.**

The guiding rule: **intelligence and data stay client-agnostic; presentation,
IDX, brokerage, and auth stay in the client.**

---

## Layers today

```
lib/qwome/                      QWOME core (no Sold It Today imports)
  engine.ts                     proximity engine (nearest-of-category, haversine)
  providers.ts                  PlaceProvider abstraction + bundled MI provider
  analysis.ts                   analyzePropertyFit / analyzeProperties (normalized)
  preferences.ts                preference model: catalog, encode/decode, evaluate
  client/prefsStorage.ts        BROWSER persistence adapter (localStorage)  <- client
  data/mi-pois.json             bundled, classified place data (one provider)
scripts/build-qwome-pois.mjs    data ingestion + classification (build-time)
app/api/v1/qwome/nearby         versioned proximity endpoint
app/api/v1/qwome/analyze        versioned property-fit endpoint
app/api/qwome/nearby            legacy alias -> v1

lib/amenities.ts                Sold It Today ADAPTER over the engine   <- client
components/search/*             Sold It Today UI (the client)           <- client
```

Data flow (client → intelligence → provider):

```
SoldItToday UI ─▶ lib/amenities / api/v1 ─▶ analysis ─▶ engine ─▶ PlaceProvider ─▶ data
   (client)          (client adapter)        (QWOME core, brand-agnostic)
```

## What is already decoupled

- **Engine is brand-agnostic.** Nothing in `lib/qwome/` imports listing, IDX,
  brokerage, or auth code. Verified by grep in CI-able form:
  `grep -r "@/lib/idx\|Listing\|brokerage" lib/qwome/` returns nothing.
- **Data provider is abstracted.** `engine.qwomeNearby(points, categories,
  provider?)` takes a `PlaceProvider`. The bundled Michigan OSM extract is just
  the default provider; a hosted service, a different region, or a third-party
  vendor is a drop-in that implements `PlaceProvider`.
- **Normalized intelligence entry point.** `analyzePropertyFit({ location,
  preferences })` needs only `{ lat, lng }` + preferences and returns a normalized
  result (per-category distance/status, satisfied counts, reserved `score`). No
  Sold It Today `Listing` is required to run QWOME.
- **Versioned API.** `/api/v1/qwome/nearby` and `/api/v1/qwome/analyze` give
  partners a stable contract. Legacy `/api/qwome/nearby` delegates to v1.
- **Persistence is a client concern.** The pure preference model has no
  `localStorage`; the browser adapter lives in `client/prefsStorage.ts`. Another
  client (mobile, account-backed) swaps that one file.
- **Core no longer depends on the client.** `preferences.ts` imports the engine's
  own `QwomeCategoryKey`, not the Sold It Today `AmenityKey` adapter.

---

## Remaining coupling (honest inventory) and how to separate it

Ordered by leverage. Each step is independently shippable and non-breaking.

### 1. Classification rules live only in the build script  *(highest value)*
`scripts/build-qwome-pois.mjs` holds the healthcare / school / grocery
classification logic (what counts as an acute-care hospital, a public middle
school, a full-service vs. warehouse vs. international grocery). It is pure logic
but trapped in a Node build script and not reusable at runtime or by an ingestion
service.

**Separate it:** extract pure modules `lib/qwome/classification/{place,healthcare,
school,grocery}.ts` that take normalized OSM/provider tags and return a QWOME
category. The build script imports them (run it with `tsx`), and a future QWOME
ingestion service reuses the exact same rules. No behavior change; just move the
regex/tag logic into typed, tested functions.

### 2. Category catalog mixes core registry with presentation
`preferences.ts` `QWOME_CATALOG` carries both **core** facts (id, `measurable`,
`datasetKey` mapping, group) and **presentation** (emoji `icon`, marketing
`label`/`note` copy). A pure engine should not dictate a client's icons or copy.

**Separate it:** split into a core registry (`ids`, `measurable`, `group`,
`defaultMiles`) inside QWOME, and a presentation map (labels/icons/notes) the
client owns. Sold It Today keeps today's labels; QWOME.com or a partner supplies
their own. Do this behind a re-export so no component import changes.

### 3. Business logic still in the Sold It Today UI
`ResultsView.tsx` re-implements the "does this home satisfy every preference"
filter and the empty-category suppression. That is QWOME analysis logic living in
the client.

**Separate it:** have `ResultsView` consume `analyzeProperties()` results (which
already return `satisfied` per category) instead of its own AND-filter. The UI
then only renders; the intelligence is 100% in `lib/qwome/analysis`.

### 4. Data is Michigan-only and bundled
`data/mi-pois.json` is one region baked into the app. Fine for launch, wrong for a
multi-region platform.

**Separate it:** the `PlaceProvider` seam already exists. Next, add per-region
providers (more bundled extracts, or a hosted `HttpPlaceProvider`) and resolve the
provider per request by market/tenant. The engine and callers do not change.

### 5. No geocoding / travel-time providers yet
Address-based categories (Workplace, Family, Custom) capture text but are not
geocoded; distance is straight-line haversine only.

**Separate it:** mirror the `PlaceProvider` pattern with `GeocodeProvider`
(address → lat/lng) and `DistanceProvider` (straight-line today; drive-time via a
routing vendor later). Both behind interfaces so QWOME is never tied to one vendor.

### 6. API + data ingestion are co-hosted in the Next.js app
The v1 routes and the build script run inside Sold It Today's deployment.

**Separate it:** because the route handlers are thin (they only call
`lib/qwome/*`), the extraction is mechanical when the time comes — move
`lib/qwome/` into a standalone package (`@qwome/engine`) and host the v1 routes in
a dedicated QWOME service. Sold It Today then calls QWOME over HTTP via
`lib/amenities` (already the single adapter seam) instead of importing the package
directly. Nothing else in the site changes.

---

## Target end-state

```
@qwome/engine (package)          @qwome/service (deployment)
  types, catalog(core)             /api/v1/qwome/nearby
  classification/*                 /api/v1/qwome/analyze
  providers (place/geocode/dist)   /api/v1/qwome/geocode
  engine, analysis, scoring        tenant + provider resolution

Clients (interchangeable):  Sold It Today · QWOME.com · mobile · widgets · partner/MLS APIs
```

Each numbered step above moves one dependency across the client/core line. None of
them requires touching the current Sold It Today QWOME interface, and every step
builds and ships on its own.

## Invariants to preserve

- No `@/lib/idx`, `Listing`, brokerage, or auth import ever appears under
  `lib/qwome/` (except `client/`, which is explicitly the client adapter layer).
- New QWOME capability is added to `lib/qwome/*` and exposed through `analysis`
  and the versioned API — never inline in a component.
- New data vendors/regions enter through a provider interface, never as a direct
  import in the engine.
