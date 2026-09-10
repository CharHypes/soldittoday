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
// QWOME core depends only on the engine's own category type, never on a client
// adapter (lib/amenities is Sold It Today's adapter). This keeps the preference
// model client-agnostic and separable into the standalone QWOME package.
import type { QwomeCategoryKey } from "./engine";

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
  // Grocery ... a family of explicit, user-selectable preferences (never
  // inferred): a conventional default, an "any full-service" option, and
  // expandable international & specialty markets.
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
  | "grocery_kosher"
  // Everyday + personal places.
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
export type QwomeGroup = "Healthcare" | "Schools" | "Grocery" | "Everyday" | "People & places";

/**
 * A category in the QWOME registry ... SEMANTIC only. It defines identity,
 * capabilities, and relationships. It carries NO presentation (labels, copy,
 * icons, colors): those are client-owned (for Sold It Today, see
 * lib/qwome/client/presentation + lib/qwome/client/icons). This is what lets the
 * standalone QWOME app, widgets, and partners present the same categories their
 * own way without changing core.
 */
export type QwomeCatalogEntry = {
  id: QwomeCategoryId;
  /** Section this category belongs to (a semantic grouping). */
  group: QwomeGroup;
  /**
   * Optional expandable sub-section id within a group (e.g. "international"
   * under Grocery). Entries sharing a subgroup collapse behind one expander;
   * the client maps the id to a display label.
   */
  subgroup?: string;
  /** Capability: the QWOME dataset can measure distance for this today. */
  measurable: boolean;
  /** Capability: anchored to a specific address rather than a place category. */
  addressBased: boolean;
};

/**
 * The QWOME category registry. To bring a new category online, add it here
 * (semantic), add its dataset key in lib/qwome/engine + the data builder, and
 * add its presentation in the client. Order here is the canonical order clients
 * present the categories in.
 *
 * Healthcare is split into precise, separately-measurable categories on purpose:
 * a general acute-care hospital is not an ER, urgent care, pharmacy, or a
 * psychiatric/behavioral facility, and QWOME must not conflate them.
 */
export const QWOME_CATALOG: QwomeCatalogEntry[] = [
  // Healthcare
  { id: "hospital", group: "Healthcare", measurable: true, addressBased: false },
  { id: "er", group: "Healthcare", measurable: true, addressBased: false },
  { id: "urgentcare", group: "Healthcare", measurable: true, addressBased: false },
  { id: "pharmacy", group: "Healthcare", measurable: true, addressBased: false },
  { id: "behavioral", group: "Healthcare", measurable: true, addressBased: false },
  // Schools (public, by level)
  { id: "school_elem", group: "Schools", measurable: true, addressBased: false },
  { id: "school_mid", group: "Schools", measurable: true, addressBased: false },
  { id: "school_high", group: "Schools", measurable: true, addressBased: false },
  // Grocery ... explicit, user-selectable (never inferred).
  { id: "grocery", group: "Grocery", measurable: true, addressBased: false },
  { id: "grocery_any", group: "Grocery", measurable: true, addressBased: false },
  { id: "grocery_warehouse", group: "Grocery", measurable: true, addressBased: false },
  { id: "grocery_organic", group: "Grocery", measurable: true, addressBased: false },
  { id: "grocery_asian", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_chinese", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_korean", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_japanese", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_south_asian", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_mideast", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_halal", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_latin", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_african_caribbean", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  { id: "grocery_kosher", group: "Grocery", subgroup: "international", measurable: true, addressBased: false },
  // Everyday
  { id: "dining", group: "Everyday", measurable: false, addressBased: false },
  { id: "shopping", group: "Everyday", measurable: false, addressBased: false },
  { id: "gym", group: "Everyday", measurable: false, addressBased: false },
  { id: "parks", group: "Everyday", measurable: false, addressBased: false },
  { id: "transit", group: "Everyday", measurable: false, addressBased: false },
  { id: "airport", group: "Everyday", measurable: false, addressBased: false },
  // People & places (address-based)
  { id: "workplace", group: "People & places", measurable: false, addressBased: true },
  { id: "family", group: "People & places", measurable: false, addressBased: true },
  { id: "custom", group: "People & places", measurable: false, addressBased: true },
];

/** Catalog groups in display order (drives the picker's section headers). */
export const QWOME_GROUPS: QwomeGroup[] = ["Healthcare", "Schools", "Grocery", "Everyday", "People & places"];

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
  grocery_any: 5,
  grocery_warehouse: 15,
  grocery_organic: 10,
  // International & specialty markets are sparser, so a wider default radius.
  grocery_asian: 10,
  grocery_chinese: 15,
  grocery_korean: 15,
  grocery_japanese: 15,
  grocery_south_asian: 15,
  grocery_mideast: 10,
  grocery_halal: 10,
  grocery_latin: 10,
  grocery_african_caribbean: 15,
  grocery_kosher: 15,
};

export function catalogEntry(id: QwomeCategoryId): QwomeCatalogEntry | undefined {
  return CATALOG_BY_ID.get(id);
}

/** True when this preference can be measured (and therefore filters search). */
export function isMeasurable(id: QwomeCategoryId): id is QwomeCategoryKey {
  return QWOME_MEASURABLE.has(id);
}

/** The starting distance for a measurable category (5 mi fallback). */
export function defaultMilesFor(id: QwomeCategoryId): number {
  return DEFAULT_MILES[id] ?? 5;
}

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

/**
 * Normalize an arbitrary prefs list (validate categories, de-dupe, apply
 * defaults). Exposed so persistence adapters and API callers can sanitize input
 * without re-implementing the rules. Persistence itself is a CLIENT concern and
 * lives outside this pure model (see lib/qwome/client/prefsStorage for the
 * browser/localStorage adapter Sold It Today uses).
 */
export const normalizePrefs = clean;

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
