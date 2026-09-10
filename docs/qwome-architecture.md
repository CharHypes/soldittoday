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
  providers.ts                  PlaceProvider abstraction + bundled MI + empty
  regions.ts                    region registry + resolveProvider(points)
  analysis.ts                   analyzePropertyFit / analyzeProperties (normalized)
  fit.ts                        evaluateFit / selectFitting (pure, engine-free)
  preferences.ts                SEMANTIC registry + preference model (no presentation)
  classification/               shared place-classification rules (single source)
    healthcare.ts school.ts grocery.ts  ... classifyPlace() in index.ts
  client/prefsStorage.ts        BROWSER persistence adapter (localStorage)  <- client
  client/presentation.ts        labels / copy / descriptors (per category id)  <- client
  client/icons.tsx              outline/line category icons (QwomeIcon)         <- client
  data/mi-pois.json             bundled, classified place data (one provider)
scripts/build-qwome-pois.mjs    data ingestion (applies the shared rules, build-time)
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
- **Classification rules are a reusable core module.** `lib/qwome/classification/`
  holds the single source of truth for what a place *is* (acute-care hospital vs
  psychiatric vs urgent care; public school level; full-service vs warehouse vs
  organic vs international grocery). Rules take a provider-neutral `{ name, tags }`
  and return the QWOME categories a place belongs to. The build-time ingestion
  imports them (proven to reproduce the shipped dataset byte-for-byte), and a
  future live/query-time provider or the standalone app imports the same rules.

---

## Remaining coupling (honest inventory) and how to separate it

Ordered by leverage. Each step is independently shippable and non-breaking.

### 1. Classification rules ... ✅ DONE
Extracted into `lib/qwome/classification/{healthcare,school,grocery}.ts` (+
`index.ts` `classifyPlace`). Rules take a provider-neutral `{ name, tags }` and
return the QWOME categories a place belongs to. `scripts/build-qwome-pois.mjs`
now imports and applies them (Node loads the `.ts` via native type-stripping;
type-only imports are erased at runtime), and the output was verified identical to
the shipped dataset for all 22 layers. A future query-time provider or the
standalone app imports the same modules.

### 2. Category catalog: registry vs presentation ... ✅ DONE
`QWOME_CATALOG` is now SEMANTIC only (id, group, subgroup, capabilities). All
presentation moved to the client: `lib/qwome/client/presentation.ts` (labels,
short names, descriptors, notes, subgroup labels) and `lib/qwome/client/icons.tsx`
(consistent outline/line icons, replacing emoji). A different QWOME client ships
its own presentation for the same category ids without touching core.

### 3. Fit logic in the UI ... ✅ DONE
The fit/satisfaction + empty-category rules live in `lib/qwome/fit.ts`
(`evaluateFit` / `selectFitting`), engine-free with type-only engine imports so it
ships no bundled data to the browser. `ResultsView` now calls `selectFitting` and
just renders the result; it reimplements none of the logic. `analysis.ts`
re-exports these and uses `evaluateFit` internally, so the API and the UI share
one implementation.

### 4. Per-region providers ... ✅ DONE (runtime)
`lib/qwome/regions.ts` binds a geographic bounding box to a `PlaceProvider`.
`resolveProvider(points)` picks the region containing the query points and returns
its provider; Michigan is the first region and the current fallback, so behavior
is unchanged. Resolution happens at the seams (analysis layer, `lib/amenities`,
the nearby API), never in the pure engine. A new region is
`registerRegion({ id, label, bounds, provider })` with its dataset ... no engine or
analysis change. The registry is side-effect-free so regions/providers/data stay
tree-shakeable (no client bloat). REMAINING: the build ingestion is still
Michigan-hardcoded (see #4b) and, until a second real region exists, unmatched
locations fall back to Michigan rather than returning no data.

### 4b. Data ingestion is Michigan-hardcoded
`scripts/build-qwome-pois.mjs` hardcodes the Michigan OSM area id and writes one
`mi-pois.json`. The runtime is region-ready; ingestion is not yet.

**Separate it:** parameterize the builder by region (area id / bounds + output
path) so a new region is a config entry plus one build run, reusing the same
shared classification rules. Optionally add a hosted `HttpPlaceProvider` for
regions too large to bundle.

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
