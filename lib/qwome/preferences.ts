/**
 * QWOME™ proximity preferences ... a viewer's "find homes that fit your life"
 * limits (e.g. hospital within 10 mi, grocery within 3 mi).
 *
 * This is the single seam that connects the QWOME product across the app:
 *   - the search panel writes prefs here (components/search/QwomePanel)
 *   - search filtering + result cards read them (components/search/ResultsView)
 *   - the listing page's "Why this home works FOR YOU" reads them later
 *
 * Per-device via localStorage for now (key "sit-qwome-prefs"); when accounts
 * ship these become account-backed with no UX change ... same as saved homes /
 * searches. Kept brand-agnostic and free of Sold-It-Today specifics so QWOME can
 * stand alone later. Also encodes to/from a URL param so a proximity search is
 * shareable and saveable.
 */
import type { AmenityKey } from "@/lib/amenities";

export type QwomePreference = { category: AmenityKey; maxMiles: number };

/** Categories QWOME can filter/measure TODAY. Workplace + custom address next. */
export const QWOME_PREF_CATEGORIES: { key: AmenityKey; label: string }[] = [
  { key: "hospital", label: "Hospital" },
  { key: "school", label: "School" },
  { key: "grocery", label: "Grocery store" },
];

export const QWOME_MILE_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 25];

const KEY = "sit-qwome-prefs";
const VALID = new Set<AmenityKey>(["hospital", "school", "grocery"]);

function clean(list: unknown): QwomePreference[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: QwomePreference[] = [];
  for (const p of list) {
    const cat = (p as QwomePreference)?.category;
    const mi = Number((p as QwomePreference)?.maxMiles);
    if (VALID.has(cat) && Number.isFinite(mi) && mi > 0 && !seen.has(cat)) {
      seen.add(cat);
      out.push({ category: cat, maxMiles: mi });
    }
  }
  return out;
}

export function readPrefs(): QwomePreference[] {
  try {
    return clean(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return [];
  }
}

export function writePrefs(list: QwomePreference[]) {
  const cleaned = clean(list);
  try {
    localStorage.setItem(KEY, JSON.stringify(cleaned));
  } catch {
    /* private mode ... ignore */
  }
  try {
    window.dispatchEvent(new Event("sit-qwome-prefs-change"));
  } catch {
    /* SSR ... ignore */
  }
}

/** Encode prefs for the URL: "hospital:10,grocery:3" (stable order). */
export function encodePrefs(list: QwomePreference[]): string {
  return clean(list)
    .slice()
    .sort((a, b) => a.category.localeCompare(b.category))
    .map((p) => `${p.category}:${p.maxMiles}`)
    .join(",");
}

/** Decode the "near" URL param back into prefs. */
export function decodePrefs(param: string | null | undefined): QwomePreference[] {
  if (!param) return [];
  return clean(
    param.split(",").map((chunk) => {
      const [category, mi] = chunk.split(":");
      return { category: category as AmenityKey, maxMiles: Number(mi) };
    })
  );
}

/**
 * Evaluate one preference against a measured distance.
 *   met     ... within the viewer's limit
 *   unmet   ... beyond it (but close ... within ~1.5x, worth flagging softly)
 *   far     ... well beyond
 * Used by "Why this home works for you". Returns null when there's no distance.
 */
export function evaluatePreference(
  pref: QwomePreference,
  miles: number | null | undefined
): "met" | "unmet" | "far" | null {
  if (miles == null || !Number.isFinite(miles)) return null;
  if (miles <= pref.maxMiles) return "met";
  if (miles <= pref.maxMiles * 1.5) return "unmet";
  return "far";
}
