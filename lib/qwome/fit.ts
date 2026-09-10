/**
 * QWOME™ fit evaluation ... the PURE heart of property-fit logic.
 *
 * Given ALREADY-COMPUTED nearby distances and a set of preferences, decide what
 * a property satisfies. No data provider, no engine, no network ... and (crucially)
 * only type-only imports from the engine, so importing this pulls in NONE of the
 * bundled place data. That lets a browser client evaluate fit with the exact same
 * rules the server/API use, without shipping the dataset or reimplementing logic.
 *
 * The engine (server) produces the nearby distances; this module interprets them.
 */
import type { QwomeCategoryKey, QwomeNearby } from "./engine";
import { evaluatePreference, isMeasurable, type QwomePreference } from "./preferences";

/** Per-category outcome against the viewer's preference. */
export type QwomeCategoryResult = {
  category: QwomeCategoryKey;
  /** The viewer's distance limit, if any. */
  maxMiles: number | null;
  /** Straight-line distance to the nearest place (null when unmeasurable here). */
  distanceMi: number | null;
  /** Name of the nearest place, when known. */
  placeName: string | null;
  /**
   * met ... within the limit; unmet ... just past; far ... well past;
   * no_data ... QWOME can't measure this category at this location.
   */
  status: "met" | "unmet" | "far" | "no_data";
  /** True when within the viewer's limit. */
  satisfied: boolean;
};

/** The evaluation of one property's nearby distances against preferences. */
export type QwomeFitEvaluation = {
  categories: QwomeCategoryResult[];
  satisfiedCount: number;
  measuredCount: number;
};

/**
 * Evaluate preferences against already-computed nearby distances. Only
 * measurable preferences are evaluated; address-based / not-yet-measurable ones
 * are ignored here.
 */
export function evaluateFit(
  nearby: QwomeNearby,
  preferences: QwomePreference[]
): QwomeFitEvaluation {
  const categories: QwomeCategoryResult[] = [];
  let satisfiedCount = 0;
  let measuredCount = 0;

  for (const pref of preferences) {
    if (!isMeasurable(pref.category)) continue;
    const d = nearby[pref.category];
    const distanceMi = d ? d.miles : null;
    const evalStatus = evaluatePreference(pref, distanceMi);
    const status: QwomeCategoryResult["status"] = distanceMi == null ? "no_data" : evalStatus ?? "no_data";
    const satisfied = status === "met";
    if (distanceMi != null) measuredCount += 1;
    if (satisfied) satisfiedCount += 1;
    categories.push({
      category: pref.category,
      maxMiles: pref.maxMiles ?? null,
      distanceMi,
      placeName: d?.name ?? null,
      status,
      satisfied,
    });
  }
  return { categories, satisfiedCount, measuredCount };
}

/** Which properties in a set satisfy the viewer's measurable preferences. */
export type QwomeFitSelection = {
  /** Ids that satisfy EVERY applicable measurable preference (AND). */
  fittingIds: Set<string>;
  /** Measurable preference categories (drives which chips a client shows). */
  activeCategories: QwomeCategoryKey[];
  /** At least one measurable preference exists (with a distance limit). */
  hasMeasurablePreferences: boolean;
  /**
   * At least one measurable preference is actually applicable ... i.e. QWOME has
   * data for it in THIS set. A category with no data anywhere (e.g. a market type
   * absent from the region) does not constrain the set rather than emptying it.
   */
  filtering: boolean;
};

/**
 * Select the properties that fit, from a map of already-computed nearby
 * distances. Encapsulates the "AND across preferences" and empty-category rules
 * so a UI never has to reimplement them ... it just consumes `fittingIds`.
 */
export function selectFitting(
  nearbyById: Record<string, QwomeNearby>,
  preferences: QwomePreference[]
): QwomeFitSelection {
  const measurablePrefs = preferences.filter((p) => isMeasurable(p.category) && p.maxMiles != null);
  const activeCategories = measurablePrefs.map((p) => p.category as QwomeCategoryKey);

  const measured = new Set<string>();
  for (const id in nearbyById) for (const cat in nearbyById[id]) measured.add(cat);
  const applicable = measurablePrefs.filter((p) => measured.has(p.category));

  const fittingIds = new Set<string>();
  for (const id in nearbyById) {
    const nb = nearbyById[id];
    const fits = applicable.every((p) => {
      const d = nb[p.category as QwomeCategoryKey];
      return d != null && p.maxMiles != null && d.miles <= p.maxMiles;
    });
    if (fits) fittingIds.add(id);
  }

  return {
    fittingIds,
    activeCategories,
    hasMeasurablePreferences: measurablePrefs.length > 0,
    filtering: applicable.length > 0,
  };
}
