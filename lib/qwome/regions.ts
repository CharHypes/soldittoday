/**
 * QWOME™ regions ... how a query is matched to the right place-data provider.
 *
 * QWOME is not tied to Michigan. A REGION binds a geographic area to a
 * PlaceProvider (a bundled dataset today, a hosted service tomorrow). Given a
 * query location, QWOME resolves which region contains it and uses that region's
 * provider ... so adding a region is just registering another provider with its
 * bounds. The engine and analysis never change: they still take a PlaceProvider.
 *
 * This is the ONLY module that knows regions exist. The engine stays a pure
 * proximity function; the app seams (lib/amenities, the API routes) and the
 * analysis layer resolve a provider through here and hand it to the engine.
 *
 * TODAY: one region (Michigan), and unmatched locations fall back to it, so
 * behavior is exactly as before. When a second region is added, decide whether
 * unmatched locations should fall back or return no data (see resolveProvider).
 */
import { bundledMiProvider, emptyProvider, type PlaceProvider } from "./providers";
import { QWOME_REGION_META, type QwomeRegionBounds } from "./regionsMeta";

export type QwomeRegionId = string;

/** A geographic area a region's data covers (inclusive degrees). */
export type QwomeBounds = QwomeRegionBounds;

export type QwomeRegion = {
  /** Stable id, e.g. "us-mi". */
  id: QwomeRegionId;
  /** Human label, e.g. "Michigan". */
  label: string;
  /** Bounding box this region's provider has data for. */
  bounds: QwomeBounds;
  /** The data source for this region. */
  provider: PlaceProvider;
};

/**
 * Region id -> data provider. Each region's dataset is a static import in
 * providers.ts (required so Next can bundle it), so onboarding a region adds its
 * provider here; its id / label / bounds come from the shared region metadata
 * (lib/qwome/regionsMeta), the same list the build ingestion reads.
 */
const PROVIDER_BY_ID: Record<QwomeRegionId, PlaceProvider> = {
  "us-mi": bundledMiProvider,
};

// Built from the shared metadata. Marked /*#__PURE__*/ so bundlers can drop this
// whole module (and the region providers + their bundled data) from any client
// that never calls the resolver ... keeping the dataset out of the browser.
// Regions without a wired provider are skipped.
function buildRegistry(): Map<QwomeRegionId, QwomeRegion> {
  const registry = new Map<QwomeRegionId, QwomeRegion>();
  for (const m of QWOME_REGION_META) {
    const provider = PROVIDER_BY_ID[m.id];
    if (provider) registry.set(m.id, { id: m.id, label: m.label, bounds: m.bounds, provider });
  }
  return registry;
}
const REGISTRY = /*#__PURE__*/ buildRegistry();
let defaultRegionId: QwomeRegionId = "us-mi";

/** Add or replace a region. This is how a new region/data source is onboarded. */
export function registerRegion(region: QwomeRegion): void {
  REGISTRY.set(region.id, region);
}

/** All registered regions. */
export function listRegions(): QwomeRegion[] {
  return [...REGISTRY.values()];
}

/** Look up a region by id. */
export function getRegion(id: QwomeRegionId): QwomeRegion | undefined {
  return REGISTRY.get(id);
}

/**
 * The region used when a location matches none. Defaults to Michigan so today's
 * single-region behavior is unchanged; pass null to make unmatched locations
 * return no data instead (once multiple real regions exist).
 */
export function setDefaultRegion(id: QwomeRegionId | null): void {
  defaultRegionId = id ?? "";
}
function defaultRegion(): QwomeRegion | undefined {
  return defaultRegionId ? REGISTRY.get(defaultRegionId) : undefined;
}

const contains = (b: QwomeBounds, lat: number, lng: number) =>
  lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east;

/** The region whose bounds contain this location, if any. */
export function resolveRegion(lat: number, lng: number): QwomeRegion | undefined {
  for (const region of REGISTRY.values()) {
    if (contains(region.bounds, lat, lng)) return region;
  }
  return undefined;
}

type LatLng = { lat: number; lng: number };

/**
 * Resolve the PlaceProvider for a set of query points: the region containing the
 * first point that falls in one, else the default region's provider (Michigan
 * today), else an empty provider. A batch is assumed to be within one region
 * (true for a single market's search); cross-region batches are a future step.
 */
export function resolveProvider(points: LatLng[]): PlaceProvider {
  for (const p of points) {
    if (Number.isFinite(p?.lat) && Number.isFinite(p?.lng)) {
      const region = resolveRegion(p.lat, p.lng);
      if (region) return region.provider;
    }
  }
  return defaultRegion()?.provider ?? emptyProvider;
}
