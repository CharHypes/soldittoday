/**
 * QWOME™ proximity & lifestyle preferences ... a viewer's "find homes that fit
 * your life" priorities (e.g. hospital within 10 mi, grocery within 3 mi, plus
 * the places that matter to them personally).
 *
 * This is the single seam that connects the QWOME product across the app:
 *   - the search panel writes prefs here (components/search/QwomePanel)
 *   - search filtering + result cards read them (components/search/ResultsView)
 *   - the listing page's "Why this home works FOR YOU" reads them
 *
 * Per-device via localStorage for now (key "sit-qwome-prefs"); when accounts
 * ship these become account-backed with no UX change ... same as saved homes /
 * searches. Kept brand-agnostic and free of Sold-It-Today specifics so QWOME can
 * stand alone later as its own product / app / API. Also encodes to/from a URL
 * param so a proximity search is shareable and saveable.
 *
 * FORWARD-LOOKING DATA MODEL ... a preference is deliberately more than a
 * distance. The full catalog of what a person can prioritise lives in
 * QWOME_CATALOG (13 categories today), and a QwomePreference already carries the
 * fields the QWOME fit-scoring roadmap needs: importance (must-have / prefer /
 * avoid), a distance OR drive-time target, and, for address-based categories
 * (workplace, family & friends, custom pins), a specific place. Only a subset is
 * measurable from the bundled dataset TODAY (hospital / school / grocery); the
 * rest are captured now so the model is stable and the UI, URL, and storage
 * never have to change as those calculations come online.
 */
import type { AmenityKey } from "@/lib/amenities";

/** Every lifestyle category a viewer can prioritise in QWOME. */
export type QwomeCategoryId =
  // Healthcare ... deliberately precise (acute-care hospital is NOT the same as
  // an ER, urgent care, a pharmacy, or a psychiatric/behavioral facility).
  | "hospital"
  | "er"
  | "urgentcare"
  | "pharmacy"
  | "behavioral"
  // Public schools by level (nearest-in-district; not boundary-assigned yet).
  | "school_elem"
  | "school_mid"
  | "school_high"
  // Everyday + personal places.
  | "grocery"
  | "workplace"
  | "family"
  | "airport"
  | "parks"
  | "shopping"
  | "dining"
  | "gym"
  | "transit"
  | "custom";

/** How strongly a category matters ... reserved for QWOME property-fit scoring. */
export type QwomeImportance = "must" | "prefer" | "avoid";

/** A specific place for address-based categories (workplace / family / custom). */
export type QwomeAddress = {
  /** What the viewer typed / selected, shown back to them. */
  formatted?: string;
  /** Geocoded coordinates (filled once address geocoding ships). */
  lat?: number;
  lng?: number;
};

/**
 * One QWOME preference. `category` + (for measurable categories) `maxMiles` is
 * all that drives search filtering today; every other field is captured for the
 * roadmap (fit scoring, drive-time, address matching) and safely ignored until
 * then.
 */
export type QwomePreference = {
  category: QwomeCategoryId;
  /** Distance limit in miles ... the only field that filters search today. */
  maxMiles?: number;
  /** How strongly this matters. Defaults to "prefer". (Roadmap: fit scoring.) */
  importance?: QwomeImportance;
  /** Preferred max drive time, minutes. (Roadmap: drive-time matching.) */
  maxDriveMinutes?: number;
  /** A specific place, for address-based categories. (Roadmap: geocoding.) */
  address?: QwomeAddress;
  /** Viewer's own label for a custom pin ("Mom's house", "The office"). */
  label?: string;
  /** Stable id so multiple custom locations can coexist later. */
  id?: string;
};

/** Grouping for the picker ... light section headers over a longer catalog. */
export type QwomeGroup = "Healthcare" | "Schools" | "Everyday" | "People & places";

/** A selectable category in the catalog. */
export type QwomeCatalogEntry = {
  id: QwomeCategoryId;
  /** Full label for the picker ("Emergency Room"). */
  label: string;
  /** Compact label for the card chip ("ER"). */
  short: string;
  /** Small glyph, for quick scanning in the picker + on the card. */
  icon: string;
  /** Section the picker groups this under. */
  group: QwomeGroup;
  /** True when the bundled QWOME dataset can measure distance TODAY. */
  measurable: boolean;
  /** True when this category is anchored to a specific address, not a category. */
  addressBased: boolean;
  /**
   * How the nearest result is described in "Why this home works" and tooltips.
   * For schools this is deliberately "nearest public ... in district", never
   * "assigned", until attendance-boundary data is available.
   */
  descriptor?: string;
  /** Optional clarifying note shown under the option in the picker. */
  note?: string;
};

/**
 * The full QWOME category catalog. To bring a new category online, flip
 * `measurable` and add its dataset key in lib/qwome/engine + the data builder
 * (scripts/build-qwome-pois.mjs). Order here is the order shown in the picker.
 *
 * Healthcare is split into precise, separately-measurable categories on purpose:
 * a general acute-care hospital is not an ER, urgent care, pharmacy, or a
 * psychiatric/behavioral facility, and QWOME must not conflate them.
 */
export const QWOME_CATALOG: QwomeCatalogEntry[] = [
  // Healthcare
  { id: "hospital", label: "Hospital", short: "Hospital", icon: "🏥", group: "Healthcare", measurable: true, addressBased: false, descriptor: "nearest acute-care hospital", note: "General acute-care hospitals only (excludes psychiatric, rehab, and specialty facilities)." },
  { id: "er", label: "Emergency Room", short: "ER", icon: "🚑", group: "Healthcare", measurable: true, addressBased: false, descriptor: "nearest emergency room" },
  { id: "urgentcare", label: "Urgent Care", short: "Urgent Care", icon: "⛑️", group: "Healthcare", measurable: true, addressBased: false, descriptor: "nearest urgent care" },
  { id: "pharmacy", label: "Pharmacy", short: "Pharmacy", icon: "💊", group: "Healthcare", measurable: true, addressBased: false, descriptor: "nearest pharmacy" },
  { id: "behavioral", label: "Behavioral / Psychiatric Care", short: "Behavioral", icon: "🧠", group: "Healthcare", measurable: true, addressBased: false, descriptor: "nearest behavioral / psychiatric care" },
  // Schools (public, by level)
  { id: "school_elem", label: "Elementary School", short: "Elementary", icon: "🎒", group: "Schools", measurable: true, addressBased: false, descriptor: "nearest public elementary school in district", note: "Nearest public elementary school in the district (not boundary-assigned)." },
  { id: "school_mid", label: "Middle School", short: "Middle", icon: "📗", group: "Schools", measurable: true, addressBased: false, descriptor: "nearest public middle school in district", note: "Nearest public middle school in the district (not boundary-assigned)." },
  { id: "school_high", label: "High School", short: "High School", icon: "🎓", group: "Schools", measurable: true, addressBased: false, descriptor: "nearest public high school in district", note: "Nearest public high school in the district (not boundary-assigned)." },
  // Everyday
  { id: "grocery", label: "Grocery", short: "Grocery", icon: "🛒", group: "Everyday", measurable: true, addressBased: false, descriptor: "nearest grocery" },
  { id: "dining", label: "Restaurants / Coffee", short: "Dining", icon: "☕", group: "Everyday", measurable: false, addressBased: false },
  { id: "shopping", label: "Shopping", short: "Shopping", icon: "🛍️", group: "Everyday", measurable: false, addressBased: false },
  { id: "gym", label: "Gym / Fitness", short: "Gym", icon: "🏋️", group: "Everyday", measurable: false, addressBased: false },
  { id: "parks", label: "Parks / Dog Parks", short: "Parks", icon: "🌳", group: "Everyday", measurable: false, addressBased: false },
  { id: "transit", label: "Public Transportation", short: "Transit", icon: "🚌", group: "Everyday", measurable: false, addressBased: false },
  { id: "airport", label: "Airport", short: "Airport", icon: "✈️", group: "Everyday", measurable: false, addressBased: false },
  // People & places (address-based)
  { id: "workplace", label: "Workplace", short: "Workplace", icon: "💼", group: "People & places", measurable: false, addressBased: true },
  { id: "family", label: "Family & Friends", short: "Family", icon: "🏡", group: "People & places", measurable: false, addressBased: true },
  { id: "custom", label: "Custom Location", short: "Custom", icon: "📍", group: "People & places", measurable: false, addressBased: true },
];

/** Catalog groups in display order (drives the picker's section headers). */
export const QWOME_GROUPS: QwomeGroup[] = ["Healthcare", "Schools", "Everyday", "People & places"];

const CATALOG_BY_ID = new Map(QWOME_CATALOG.map((c) => [c.id, c]));
const VALID_IDS = new Set<QwomeCategoryId>(QWOME_CATALOG.map((c) => c.id));

/** Categories QWOME can filter/measure TODAY (distance search). */
export const QWOME_MEASURABLE: Set<QwomeCategoryId> = new Set(
  QWOME_CATALOG.filter((c) => c.measurable).map((c) => c.id)
);

export const QWOME_MILE_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 25];

/** Sensible starting radius when a viewer first turns on a measurable category. */
const DEFAULT_MILES: Partial<Record<QwomeCategoryId, number>> = {
  hospital: 10,
  er: 15,
  urgentcare: 10,
  pharmacy: 3,
  behavioral: 15,
  school_elem: 3,
  school_mid: 5,
  school_high: 8,
  grocery: 5,
};

export function catalogEntry(id: QwomeCategoryId): QwomeCatalogEntry | undefined {
  return CATALOG_BY_ID.get(id);
}

/** True when this preference can be measured (and therefore filters search). */
export function isMeasurable(id: QwomeCategoryId): id is AmenityKey {
  return QWOME_MEASURABLE.has(id);
}

/** The starting distance for a measurable category (5 mi fallback). */
export function defaultMilesFor(id: QwomeCategoryId): number {
  return DEFAULT_MILES[id] ?? 5;
}

const KEY = "sit-qwome-prefs";

/**
 * Normalise a stored/decoded list: keep only valid categories, de-dupe by
 * category (custom pins de-dupe by their own id), and guarantee measurable
 * categories always carry a positive maxMiles. Forward-looking fields
 * (importance, address, label, drive time) are preserved untouched.
 */
function clean(list: unknown): QwomePreference[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: QwomePreference[] = [];
  for (const raw of list) {
    const p = raw as QwomePreference;
    const cat = p?.category;
    if (!cat || !VALID_IDS.has(cat)) continue;

    // Custom pins can repeat (one per place); everything else is once.
    const dedupeKey = cat === "custom" ? `custom:${p.id ?? p.label ?? out.length}` : cat;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const next: QwomePreference = { category: cat };

    if (isMeasurable(cat)) {
      const mi = Number(p.maxMiles);
      next.maxMiles = Number.isFinite(mi) && mi > 0 ? mi : defaultMilesFor(cat);
    } else if (Number.isFinite(Number(p.maxMiles)) && Number(p.maxMiles) > 0) {
      // Not measurable yet, but honour a stored distance target for later.
      next.maxMiles = Number(p.maxMiles);
    }

    if (p.importance === "must" || p.importance === "prefer" || p.importance === "avoid") {
      next.importance = p.importance;
    }
    if (Number.isFinite(Number(p.maxDriveMinutes)) && Number(p.maxDriveMinutes) > 0) {
      next.maxDriveMinutes = Number(p.maxDriveMinutes);
    }
    if (typeof p.label === "string" && p.label.trim()) next.label = p.label.trim().slice(0, 80);
    if (typeof p.id === "string" && p.id.trim()) next.id = p.id.trim().slice(0, 40);
    if (p.address && typeof p.address === "object") {
      const a = p.address as QwomeAddress;
      const addr: QwomeAddress = {};
      if (typeof a.formatted === "string" && a.formatted.trim()) addr.formatted = a.formatted.trim().slice(0, 160);
      if (Number.isFinite(Number(a.lat))) addr.lat = Number(a.lat);
      if (Number.isFinite(Number(a.lng))) addr.lng = Number(a.lng);
      if (Object.keys(addr).length) next.address = addr;
    }

    out.push(next);
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

/**
 * Encode prefs for the URL: "hospital:10,grocery:3" (stable order). Only the
 * MEASURABLE, distance-bearing prefs go in the URL ... those are what make a
 * proximity search shareable and reproducible. Lifestyle selections that don't
 * yet filter (gym, dining, ...) live in per-device storage until QWOME can
 * measure them.
 */
export function encodePrefs(list: QwomePreference[]): string {
  return clean(list)
    .filter((p) => isMeasurable(p.category) && p.maxMiles)
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
      return { category: category as QwomeCategoryId, maxMiles: Number(mi) };
    })
  );
}

/**
 * Evaluate one preference against a measured distance.
 *   met     ... within the viewer's limit
 *   unmet   ... beyond it (but close ... within ~1.5x, worth flagging softly)
 *   far     ... well beyond
 * Used by "Why this home works for you". Returns null when there's no distance
 * or the preference has no distance target.
 */
export function evaluatePreference(
  pref: QwomePreference,
  miles: number | null | undefined
): "met" | "unmet" | "far" | null {
  if (miles == null || !Number.isFinite(miles)) return null;
  if (pref.maxMiles == null || !Number.isFinite(pref.maxMiles)) return null;
  if (miles <= pref.maxMiles) return "met";
  if (miles <= pref.maxMiles * 1.5) return "unmet";
  return "far";
}
