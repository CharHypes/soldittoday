/**
 * Nearby-amenity distances for listings, from free OpenStreetMap data (Overpass).
 *
 * For a set of listing coordinates we fetch nearby hospitals, K-12 schools, and
 * grocery stores once for the whole area (bounding box), then compute each
 * listing's straight-line ("as the crow flies") miles to the nearest of each.
 *
 * Straight-line only ... no paid routing API. Results are cached in-process by
 * a rounded bbox key so repeated searches in the same area don't re-hit Overpass
 * (which is free but rate-limited). Everything degrades gracefully: if Overpass
 * is slow or down, callers just get no amenities and the UI hides the row.
 */

export type AmenityKey = "hospital" | "school" | "grocery";

export type AmenityDistance = { miles: number; name: string | null };
export type AmenityDistances = Partial<Record<AmenityKey, AmenityDistance>>;

type Pt = { lat: number; lng: number };
type Poi = Pt & { name: string | null };

const EARTH_MI = 3958.8;

function haversineMiles(a: Pt, b: Pt): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_MI * 2 * Math.asin(Math.sqrt(s));
}

/* ----------------------------- Overpass fetch ----------------------------- */

type PoiSet = Record<AmenityKey, Poi[]>;

const cache = new Map<string, { t: number; pois: PoiSet }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h ... POIs barely change
const OVERPASS = "https://overpass-api.de/api/interpreter";

function bboxKey(s: number, w: number, n: number, e: number): string {
  // Round to ~0.1deg tiles so nearby searches share a cache entry.
  const r = (x: number) => Math.round(x * 10) / 10;
  return `${r(s)},${r(w)},${r(n)},${r(e)}`;
}

async function fetchPois(
  s: number,
  w: number,
  n: number,
  e: number
): Promise<PoiSet> {
  const key = bboxKey(s, w, n, e);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL_MS) return hit.pois;

  // node + way (buildings mapped as areas) with center; hospitals are sparse so
  // the caller pads the bbox generously before calling.
  const box = `${s},${w},${n},${e}`;
  const q =
    `[out:json][timeout:25];(` +
    `nwr["amenity"="hospital"](${box});` +
    `nwr["amenity"="school"](${box});` +
    `nwr["shop"="supermarket"](${box});` +
    `nwr["shop"="grocery"](${box});` +
    `);out center 400;`;

  const pois: PoiSet = { hospital: [], school: [], grocery: [] };
  try {
    const res = await fetch(OVERPASS, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(q),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`overpass ${res.status}`);
    const data = (await res.json()) as {
      elements: Array<{
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      }>;
    };
    for (const el of data.elements ?? []) {
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (lat == null || lng == null) continue;
      const tags = el.tags ?? {};
      const name = tags.name ?? null;
      let key: AmenityKey | null = null;
      if (tags.amenity === "hospital") key = "hospital";
      else if (tags.amenity === "school") key = "school";
      else if (tags.shop === "supermarket" || tags.shop === "grocery") key = "grocery";
      if (key) pois[key].push({ lat, lng, name });
    }
    cache.set(key, { t: Date.now(), pois });
  } catch {
    // Leave pois empty ... callers degrade gracefully.
  }
  return pois;
}

/* ------------------------------- Public API ------------------------------- */

/**
 * Given listing points, return each id's nearest hospital/school/grocery miles.
 * One Overpass fetch covers the whole set (bbox), so this scales to a full
 * results page cheaply.
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
  // Pad the bbox ... ~0.35deg (~24mi) so sparse hospitals are found near edges.
  const pad = 0.35;
  const pois = await fetchPois(s - pad, w - pad, n + pad, e + pad);

  const nearest = (from: Pt, list: Poi[]): AmenityDistance | undefined => {
    let best: AmenityDistance | undefined;
    for (const poi of list) {
      const miles = haversineMiles(from, poi);
      if (!best || miles < best.miles) best = { miles, name: poi.name };
    }
    return best ? { miles: Math.round(best.miles * 10) / 10, name: best.name } : undefined;
  };

  const out: Record<string, AmenityDistances> = {};
  for (const p of valid) {
    const d: AmenityDistances = {};
    const h = nearest(p, pois.hospital);
    const sc = nearest(p, pois.school);
    const g = nearest(p, pois.grocery);
    if (h) d.hospital = h;
    if (sc) d.school = sc;
    if (g) d.grocery = g;
    out[p.id] = d;
  }
  return out;
}
