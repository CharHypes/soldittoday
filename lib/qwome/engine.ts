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

import { defaultPlaceProvider, type PlaceProvider, type PlaceRow } from "./providers";
import { defaultDistanceProvider, type DistanceProvider } from "./distance";

/** Categories QWOME can measure. Extend this union as the dataset grows. */
export type QwomeCategoryKey =
  | "hospital"
  | "er"
  | "urgentcare"
  | "pharmacy"
  | "behavioral"
  | "school_elem"
  | "school_mid"
  | "school_high"
  | "grocery"
  | "grocery_any"
  | "grocery_warehouse"
  | "grocery_organic"
  | "grocery_asian"
  | "grocery_chinese"
  | "grocery_korean"
  | "grocery_japanese"
  | "grocery_south_asian"
  | "grocery_mideast"
  | "grocery_halal"
  | "grocery_latin"
  | "grocery_african_caribbean"
  | "grocery_kosher";

export type QwomeDistance = { miles: number; name: string | null };
export type QwomeNearby = Partial<Record<QwomeCategoryKey, QwomeDistance>>;
export type QwomePoint = { id: string; lat: number; lng: number };

type Row = PlaceRow; // [lat, lng, name]

/**
 * Category registry. `datasetKey` maps to the bundled dataset; `scanAll` skips
 * the bbox pre-filter for sparse categories (e.g. hospitals) so edge points
 * always resolve. New categories (pharmacy, airport, ...) plug in here.
 */
export const QWOME_CATEGORIES: Record<
  QwomeCategoryKey,
  { label: string; datasetKey: string; scanAll?: boolean }
> = {
  // Healthcare ... sparse statewide, so scanAll to always resolve the nearest.
  hospital: { label: "Hospital", datasetKey: "hospital", scanAll: true },
  er: { label: "Emergency Room", datasetKey: "er", scanAll: true },
  urgentcare: { label: "Urgent Care", datasetKey: "urgentcare", scanAll: true },
  pharmacy: { label: "Pharmacy", datasetKey: "pharmacy" },
  behavioral: { label: "Behavioral / Psychiatric Care", datasetKey: "behavioral", scanAll: true },
  // Public schools by level (nearest-in-district; see data builder note).
  school_elem: { label: "Elementary School", datasetKey: "school_elem" },
  school_mid: { label: "Middle School", datasetKey: "school_mid" },
  school_high: { label: "High School", datasetKey: "school_high" },
  // Grocery family. General + Any are dense (bbox); the international/specialty
  // markets are sparse statewide, so scanAll to always resolve the nearest.
  grocery: { label: "Grocery / Supermarket", datasetKey: "grocery" },
  grocery_any: { label: "Any Full-Service Grocery", datasetKey: "grocery_any" },
  grocery_warehouse: { label: "Warehouse Club", datasetKey: "grocery_warehouse", scanAll: true },
  grocery_organic: { label: "Organic / Specialty Grocery", datasetKey: "grocery_organic", scanAll: true },
  grocery_asian: { label: "Asian Market", datasetKey: "grocery_asian", scanAll: true },
  grocery_chinese: { label: "Chinese Market", datasetKey: "grocery_chinese", scanAll: true },
  grocery_korean: { label: "Korean Market", datasetKey: "grocery_korean", scanAll: true },
  grocery_japanese: { label: "Japanese Market", datasetKey: "grocery_japanese", scanAll: true },
  grocery_south_asian: { label: "Indian / South Asian Market", datasetKey: "grocery_south_asian", scanAll: true },
  grocery_mideast: { label: "Middle Eastern / Arabic Market", datasetKey: "grocery_mideast", scanAll: true },
  grocery_halal: { label: "Halal Market", datasetKey: "grocery_halal", scanAll: true },
  grocery_latin: { label: "Mexican / Latin American Market", datasetKey: "grocery_latin", scanAll: true },
  grocery_african_caribbean: { label: "African / Caribbean Market", datasetKey: "grocery_african_caribbean", scanAll: true },
  grocery_kosher: { label: "Kosher Market", datasetKey: "grocery_kosher", scanAll: true },
};

/** Display miles ... very-close results read "<0.1 mi" instead of "0 mi". */
export function formatMiles(mi: number): string {
  if (!Number.isFinite(mi)) return "";
  return mi < 0.1 ? "<0.1 mi" : `${mi} mi`;
}

function nearest(
  lat: number,
  lng: number,
  rows: readonly Row[],
  distance: DistanceProvider
): QwomeDistance | undefined {
  let bestMi = Infinity;
  let bestName: string | null = null;
  for (const r of rows) {
    const mi = distance.miles(lat, lng, r[0], r[1]);
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
 * skipped; missing data yields no entry (callers hide the row). The distance
 * metric is a provider (straight-line by default), so it can be swapped without
 * touching this algorithm.
 */
export async function qwomeNearby(
  points: QwomePoint[],
  categories: QwomeCategoryKey[] = Object.keys(QWOME_CATEGORIES) as QwomeCategoryKey[],
  provider: PlaceProvider = defaultPlaceProvider,
  distance: DistanceProvider = defaultDistanceProvider
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

  // Pre-resolve each category's candidate rows once, via the place provider.
  // rows() may be sync (bundled) or async (hosted), so await in parallel ...
  // awaiting a plain array is a no-op, so bundled providers are unaffected.
  const candidates = new Map<QwomeCategoryKey, readonly Row[]>();
  await Promise.all(
    categories.map(async (key) => {
      const cfg = QWOME_CATEGORIES[key];
      if (!cfg) return;
      const rows = await provider.rows(cfg.datasetKey);
      candidates.set(key, cfg.scanAll ? rows : rows.filter(inBox));
    })
  );

  const out: Record<string, QwomeNearby> = {};
  for (const p of valid) {
    const nearby: QwomeNearby = {};
    for (const [key, rows] of candidates) {
      const d = nearest(p.lat, p.lng, rows, distance);
      if (d) nearby[key] = d;
    }
    out[p.id] = nearby;
  }
  return out;
}
