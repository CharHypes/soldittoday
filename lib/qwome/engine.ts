/**
 * QWOME™ ... proximity & lifestyle-matching engine.
 *
 * This is intentionally BRAND-AGNOSTIC and self-contained so it can later stand
 * alone as its own service / API / app, independent of Sold It Today. Nothing in
 * here references Sold It Today; the app consumes it through a thin adapter
 * (lib/amenities.ts) and the service endpoint (app/api/qwome/nearby).
 *
 * What it does: given a set of points, return the nearest of each lifestyle
 * category (straight-line miles) from a bundled dataset ... no external API
 * calls, so it's fast and reliable anywhere. Categories are configurable and
 * extensible: hospital / school / grocery today, with pharmacy, airport,
 * workplace, family/custom addresses, and property-fit scoring planned. To add a
 * category, add it to QWOME_CATEGORIES and provide its dataset key.
 */

import raw from "./data/mi-pois.json";

/** Categories QWOME can measure. Extend this union as the dataset grows. */
export type QwomeCategoryKey = "hospital" | "school" | "grocery";

export type QwomeDistance = { miles: number; name: string | null };
export type QwomeNearby = Partial<Record<QwomeCategoryKey, QwomeDistance>>;
export type QwomePoint = { id: string; lat: number; lng: number };

type Row = [number, number, string | null]; // [lat, lng, name]
type Dataset = Record<string, Row[]>;
const DATA = raw as unknown as Dataset;

/**
 * Category registry. `datasetKey` maps to the bundled dataset; `scanAll` skips
 * the bbox pre-filter for sparse categories (e.g. hospitals) so edge points
 * always resolve. New categories (pharmacy, airport, ...) plug in here.
 */
export const QWOME_CATEGORIES: Record<
  QwomeCategoryKey,
  { label: string; datasetKey: string; scanAll?: boolean }
> = {
  hospital: { label: "Hospital", datasetKey: "hospital", scanAll: true },
  school: { label: "School", datasetKey: "school" },
  grocery: { label: "Grocery", datasetKey: "grocery" },
};

const EARTH_MI = 3958.8;
function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_MI * 2 * Math.asin(Math.sqrt(s));
}

/** Display miles ... very-close results read "<0.1 mi" instead of "0 mi". */
export function formatMiles(mi: number): string {
  if (!Number.isFinite(mi)) return "";
  return mi < 0.1 ? "<0.1 mi" : `${mi} mi`;
}

function nearest(lat: number, lng: number, rows: Row[]): QwomeDistance | undefined {
  let bestMi = Infinity;
  let bestName: string | null = null;
  for (const r of rows) {
    const mi = haversineMiles(lat, lng, r[0], r[1]);
    if (mi < bestMi) {
      bestMi = mi;
      bestName = r[2];
    }
  }
  if (!Number.isFinite(bestMi)) return undefined;
  return { miles: Math.round(bestMi * 10) / 10, name: bestName };
}

/**
 * Core QWOME query: nearest of each requested category for each point. One bbox
 * pre-filter covers a whole results page cheaply. Unknown/empty categories are
 * skipped; missing data yields no entry (callers hide the row).
 */
export async function qwomeNearby(
  points: QwomePoint[],
  categories: QwomeCategoryKey[] = Object.keys(QWOME_CATEGORIES) as QwomeCategoryKey[]
): Promise<Record<string, QwomeNearby>> {
  const valid = points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  if (valid.length === 0) return {};

  let s = Infinity,
    w = Infinity,
    n = -Infinity,
    e = -Infinity;
  for (const p of valid) {
    s = Math.min(s, p.lat);
    n = Math.max(n, p.lat);
    w = Math.min(w, p.lng);
    e = Math.max(e, p.lng);
  }
  const pad = 0.5; // ~35mi window for bbox-filtered categories
  const inBox = (r: Row) =>
    r[0] >= s - pad && r[0] <= n + pad && r[1] >= w - pad && r[1] <= e + pad;

  // Pre-resolve each category's candidate rows once.
  const candidates = new Map<QwomeCategoryKey, Row[]>();
  for (const key of categories) {
    const cfg = QWOME_CATEGORIES[key];
    if (!cfg) continue;
    const rows = DATA[cfg.datasetKey] ?? [];
    candidates.set(key, cfg.scanAll ? rows : rows.filter(inBox));
  }

  const out: Record<string, QwomeNearby> = {};
  for (const p of valid) {
    const nearby: QwomeNearby = {};
    for (const [key, rows] of candidates) {
      const d = nearest(p.lat, p.lng, rows);
      if (d) nearby[key] = d;
    }
    out[p.id] = nearby;
  }
  return out;
}
