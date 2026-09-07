/**
 * Nearby-amenity distances for listings, from a bundled Michigan places dataset.
 *
 * We precomputed hospitals, K-12 schools, and grocery stores across Lower
 * Michigan from OpenStreetMap (see lib/data/mi-pois.json) so that at runtime we
 * do only fast local math ... no external API calls. That's reliable on Vercel
 * (public Overpass servers block cloud IPs) and free. Distances are straight-
 * line ("as the crow flies") miles to the nearest of each. To refresh or widen
 * the dataset, re-run the fetch and replace mi-pois.json.
 */

import raw from "./data/mi-pois.json";

export type AmenityKey = "hospital" | "school" | "grocery";
export type AmenityDistance = { miles: number; name: string | null };
export type AmenityDistances = Partial<Record<AmenityKey, AmenityDistance>>;

type Row = [number, number, string | null]; // [lat, lng, name]
const DATA = raw as Record<AmenityKey, Row[]>;

type Pt = { lat: number; lng: number };
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

function nearest(from: Pt, rows: Row[]): AmenityDistance | undefined {
  let bestMi = Infinity;
  let bestName: string | null = null;
  for (const r of rows) {
    const mi = haversineMiles(from.lat, from.lng, r[0], r[1]);
    if (mi < bestMi) {
      bestMi = mi;
      bestName = r[2];
    }
  }
  if (!Number.isFinite(bestMi)) return undefined;
  return { miles: Math.round(bestMi * 10) / 10, name: bestName };
}

/**
 * Given listing points, return each id's nearest hospital/school/grocery miles.
 * Schools and groceries are pre-filtered to the search area for speed; hospitals
 * are sparse (~200 statewide) so we scan them all.
 */
export async function amenitiesForPoints(
  points: Array<{ id: string; lat: number; lng: number }>
): Promise<Record<string, AmenityDistances>> {
  const valid = points.filter(
    (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)
  );
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
  const pad = 0.5; // ~35mi window around the results for schools/groceries
  const inBox = (r: Row) =>
    r[0] >= s - pad && r[0] <= n + pad && r[1] >= w - pad && r[1] <= e + pad;
  const schools = DATA.school.filter(inBox);
  const groceries = DATA.grocery.filter(inBox);
  const hospitals = DATA.hospital; // small ... scan all so edges always resolve

  const out: Record<string, AmenityDistances> = {};
  for (const p of valid) {
    const d: AmenityDistances = {};
    const h = nearest(p, hospitals);
    const sc = nearest(p, schools);
    const g = nearest(p, groceries);
    if (h) d.hospital = h;
    if (sc) d.school = sc;
    if (g) d.grocery = g;
    out[p.id] = d;
  }
  return out;
}
