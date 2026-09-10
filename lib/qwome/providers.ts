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
 * be in-memory (bundled JSON), hosted (fetched over HTTP), or cached.
 *
 * `rows` may return synchronously (in-memory) OR asynchronously (a hosted
 * provider). The engine always `await`s the result, so both work identically and
 * this stays backward compatible with the bundled providers.
 */
export interface PlaceProvider {
  /** A stable id for logging / cache-keying (e.g. "bundled:mi-osm"). */
  readonly id: string;
  /** Candidate rows for a dataset key (empty when unknown). Sync or async. */
  rows(datasetKey: string): readonly PlaceRow[] | Promise<readonly PlaceRow[]>;
}

/** Build an in-memory provider from a `{ datasetKey: PlaceRow[] }` map. */
export function inMemoryProvider(id: string, data: Record<string, PlaceRow[]>): PlaceProvider {
  return {
    id,
    rows: (datasetKey) => data[datasetKey] ?? [],
  };
}

/**
 * A provider with no data. Returned when a location falls in no known region, so
 * QWOME yields "no data" (and never another region's places) rather than
 * guessing. Region resolution can also choose to fall back to a default region
 * instead ... see lib/qwome/regions.
 */
export const emptyProvider: PlaceProvider = {
  id: "empty",
  rows: () => [],
};

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

/** Coerce an unknown JSON payload into valid PlaceRows, dropping bad entries. */
function normalizeRows(data: unknown): PlaceRow[] {
  if (!Array.isArray(data)) return [];
  const out: PlaceRow[] = [];
  for (const r of data) {
    if (Array.isArray(r) && Number.isFinite(r[0]) && Number.isFinite(r[1])) {
      out.push([Number(r[0]), Number(r[1]), r[2] == null ? null : String(r[2])]);
    }
  }
  return out;
}

export type HttpPlaceProviderOptions = {
  /** Provider id for logging / traceability (default derived from baseUrl). */
  id?: string;
  /** Base URL of the hosted region dataset (e.g. a CDN path for one region). */
  baseUrl: string;
  /** Map a datasetKey to a URL. Default: `${baseUrl}/${datasetKey}.json`. */
  urlFor?: (datasetKey: string, baseUrl: string) => string;
  /** Extra request headers (e.g. an API key). */
  headers?: Record<string, string>;
  /** Per-request timeout in ms (default 8000). */
  timeoutMs?: number;
  /** How long a fetched dataset stays cached, in ms (default: process lifetime). */
  ttlMs?: number;
  /** Injectable fetch (defaults to the global fetch). */
  fetchImpl?: typeof fetch;
};

/**
 * A hosted PlaceProvider: fetches a region's category datasets over HTTP instead
 * of bundling them ... for regions too large to ship in the app. It implements
 * the SAME PlaceProvider contract, so the engine, analysis, and region resolver
 * use it with zero changes; only the region's `PROVIDER_BY_ID` wiring differs.
 *
 * Each datasetKey is fetched at most once per process (cached), with an optional
 * TTL; failures and empty results degrade to "no data" and are not cached, so a
 * transient outage retries rather than sticking. The remote must return a JSON
 * array of [lat, lng, name|null] rows ... the same shape as the bundled files.
 *
 * NOTE: server-side only (it performs network I/O); never import into a client
 * component. No live hosted region exists yet ... this is the ready seam for one.
 */
export function httpPlaceProvider(options: HttpPlaceProviderOptions): PlaceProvider {
  const { baseUrl, headers, timeoutMs = 8000, ttlMs, urlFor, fetchImpl } = options;
  const id = options.id ?? `http:${baseUrl}`;
  const doFetch = fetchImpl ?? globalThis.fetch;
  const buildUrl = urlFor ?? ((key, base) => `${base.replace(/\/+$/, "")}/${key}.json`);
  const cache = new Map<string, { at: number; rows: Promise<readonly PlaceRow[]> }>();

  async function load(datasetKey: string): Promise<readonly PlaceRow[]> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await doFetch(buildUrl(datasetKey, baseUrl), { headers, signal: controller.signal });
      if (!res.ok) return [];
      return normalizeRows(await res.json());
    } catch {
      return []; // degrade to no-data rather than throwing into the engine
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    id,
    rows(datasetKey: string) {
      const hit = cache.get(datasetKey);
      if (hit && (ttlMs == null || Date.now() - hit.at < ttlMs)) return hit.rows;
      const rows = load(datasetKey);
      cache.set(datasetKey, { at: Date.now(), rows });
      // Don't let a failed/empty fetch stick: evict so the next call retries.
      void rows.then((r) => {
        if (r.length === 0 && cache.get(datasetKey)?.rows === rows) cache.delete(datasetKey);
      });
      return rows;
    },
  };
}
