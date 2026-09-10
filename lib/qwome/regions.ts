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

export type QwomeRegionId = string;

/** A geographic area a region's data covers (inclusive degrees). */
export type QwomeBounds = { south: number; west: number; north: number; east: number };

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
 * Michigan ... the first QWOME region. Bounds are padded to safely contain the
 * whole state (incl. the UP and Isle Royale), since a listing must always
 * resolve to Michigan today.
 */
export const MICHIGAN: QwomeRegion = {
  id: "us-mi",
  label: "Michigan",
  bounds: { south: 41.6, west: -90.6, north: 48.4, east: -82.0 },
  provider: bundledMiProvider,
};

// Registry initialized as a literal (no top-level side-effect call) so this
// module stays tree-shakeable ... a client that never calls resolveProvider must
// not pull the region providers (and their bundled data) into its bundle.
const REGISTRY = new Map<QwomeRegionId, QwomeRegion>([[MICHIGAN.id, MICHIGAN]]);
let defaultRegionId: QwomeRegionId = MICHIGAN.id;

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
