# @qwome/engine

QWOME™ ... a brand-agnostic proximity + property-fit intelligence engine. It
answers "what's near this location, and how well does it fit these preferences?"
and knows nothing about Sold It Today, IDX, brokerage, or auth. Sold It Today is
its first client; the same engine is meant to power QWOME.com, mobile apps,
embeddable widgets, and partner/MLS integrations.

This folder (`lib/qwome`) is already a self-contained package: nothing in it
imports app code. Roadmap #6 makes that boundary explicit (this README + the
public barrels) and prepares the engine to run as its own service.

## Public API (import from the barrels, not deep paths)

- **`@qwome/engine`** (`./index.ts`) ... full/server surface: the proximity
  engine (`qwomeNearby`), analysis (`analyzePropertyFit`, `analyzeProperties`,
  `evaluateFit`, `selectFitting`), the preference model + category registry, the
  data providers (`inMemoryProvider`, `httpPlaceProvider`, bundled + empty),
  region resolution (`resolveProvider`, `registerRegion`), region metadata, the
  distance/travel-time + geocoding provider seams, and the classification rules.
  Pulls the bundled place data ... **server-side only.**

- **`@qwome/engine/client`** (`./index.client.ts`) ... pure, data-free subset for
  the browser: the preference model + registry, the fit primitives, the distance
  metric (haversine) + provider interfaces, the geocoding interface, and region
  metadata. Importing this ships **no** place data to the client.

## What is NOT in the package (consumers, not engine)

These live under `lib/` today but stay in the app when the engine is extracted:

- `lib/qwome/client/{presentation,icons,prefsStorage}` ... Sold It Today's
  presentation (labels/copy), outline icons, and browser persistence. Presentation
  is client-owned by design.
- `lib/amenities.ts` ... the Sold It Today adapter (the single seam through which
  the app consumes QWOME).
- `app/api/v1/qwome/*` ... the versioned HTTP endpoints. These ARE the QWOME
  service surface; when the engine is deployed separately they move with it.

## Layout

```
engine.ts          proximity (nearest-of-category), distance-provider driven
analysis.ts        analyzePropertyFit / analyzeProperties (normalized results)
fit.ts             evaluateFit / selectFitting (pure, engine-free)
preferences.ts     semantic category registry + preference model
providers.ts       PlaceProvider: inMemory (bundled), empty, httpPlaceProvider
regions.ts         region registry + resolveProvider(points)
regionsMeta.ts     shared region metadata (runtime + ingestion)
distance.ts        DistanceProvider (haversine) + TravelTimeProvider
geocode.ts         GeocodeProvider (address -> coordinates)
classification/    shared place-classification rules (single source of truth)
data/              bundled, classified place datasets (one per region)
```

## Extracting to a standalone package

The boundary is designed so extraction is mechanical:

1. Move `lib/qwome/` into its own package repo/workspace and add a `package.json`:

   ```jsonc
   {
     "name": "@qwome/engine",
     "version": "0.1.0",
     "type": "module",
     "sideEffects": false,
     "exports": {
       ".": "./index.ts",
       "./client": "./index.client.ts"
     }
   }
   ```

2. Point Sold It Today at it: the app already imports the engine only through
   `lib/amenities.ts` and `app/api/v1/qwome/*`, via the `@qwome/engine` barrels.
   Swap `@/lib/qwome` for `@qwome/engine` (and `@/lib/qwome/client` for
   `@qwome/engine/client`) ... a find/replace, no logic change.
3. Keep `lib/qwome/client/*` and `lib/amenities.ts` in the app (they are the
   consumer, not the engine).

## Running QWOME as its own service

`app/api/v1/qwome/{nearby,analyze}` are the service API already. To deploy QWOME
separately:

1. Host `@qwome/engine` + those v1 routes as a dedicated service (its own
   deployment/domain, with auth for partners).
2. Flip Sold It Today to call it over HTTP from the single adapter seam
   (`lib/amenities.ts` / the search fetch), gated by an env var (e.g.
   `QWOME_SERVICE_URL`): set = call the remote service; unset = in-process engine
   (today's behavior). That keeps the switch a config change and non-breaking.

Until there is a second consumer (or QWOME.com), running in-process is simpler
and lower-latency; the separation above is ready to turn on when a real need
arrives.
