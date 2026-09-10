/**
 * QWOME™ place-data provider abstraction.
 *
 * The engine never talks to a concrete data source directly ... it asks a
 * PlaceProvider for the candidate places of a category. This keeps QWOME's
 * intelligence independent of any one places/geocoding vendor, so the same
 * engine can run on:
 *   - the bundled OSM extract (today, per region)
 *   - a hosted QWOME places service / database (later)
 *   - a third-party provider (Google/Foursquare/Overture/MLS-derived) behind an
 *     adapter that implements this interface
 *
 * A provider is region/tenant-scoped: a future multi-tenant deployment resolves
 * the right provider per request (by market, partner, or dataset version) and
 * passes it to the engine, with no change to the engine or the callers.
 */

/** One place: [lat, lng, name|null]. Compact on purpose (bundled at build). */
export type PlaceRow = [number, number, string | null];

/**
 * Supplies candidate places for a category's dataset key. Implementations may
 * be in-memory (bundled JSON), networked (a places API), or cached.
 */
export interface PlaceProvider {
  /** A stable id for logging / cache-keying (e.g. "bundled:mi-osm"). */
  readonly id: string;
  /** All candidate rows for a dataset key (empty array when unknown). */
  rows(datasetKey: string): readonly PlaceRow[];
}

/** Build an in-memory provider from a `{ datasetKey: PlaceRow[] }` map. */
export function inMemoryProvider(id: string, data: Record<string, PlaceRow[]>): PlaceProvider {
  return {
    id,
    rows: (datasetKey) => data[datasetKey] ?? [],
  };
}

// Default provider: the bundled Michigan OSM extract. This is the ONE place the
// core references the bundled file; swapping providers (region, vendor, hosted
// service) happens here or per-call, never in the engine's algorithm.
import bundled from "./data/mi-pois.json";
export const bundledMiProvider: PlaceProvider = inMemoryProvider(
  "bundled:mi-osm",
  bundled as unknown as Record<string, PlaceRow[]>
);

/** The provider the engine uses when a caller doesn't pass one. */
export const defaultPlaceProvider: PlaceProvider = bundledMiProvider;
