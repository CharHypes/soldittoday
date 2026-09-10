/**
 * QWOME™ property-fit analysis ... the reusable intelligence entry point.
 *
 * This is the seam every QWOME client (Sold It Today today; QWOME.com, mobile
 * apps, embeddable widgets, and partner APIs later) calls. It accepts NORMALIZED
 * input ... a bare location plus QWOME preferences ... and returns a NORMALIZED,
 * structured result. It deliberately does NOT know about Sold It Today listings,
 * IDX, brokerage, or auth: hand it `{ lat, lng }` and preferences and it works.
 *
 * The place data comes through a PlaceProvider (see ./providers), so the same
 * analysis runs against the bundled dataset, a hosted QWOME places service, or a
 * third-party provider without changing this layer. The `score` field is the
 * placeholder for the future QWOME fit score; the shape is stable now so clients
 * can render it the day scoring ships.
 */
import {
  qwomeNearby,
  type QwomeCategoryKey,
  type QwomeNearby,
} from "./engine";
import { defaultPlaceProvider, type PlaceProvider } from "./providers";
import {
  evaluatePreference,
  isMeasurable,
  type QwomePreference,
} from "./preferences";

/** A bare geographic location ... no listing / property object required. */
export type QwomeLocation = { lat: number; lng: number };

/** Normalized analysis request for one property/address. */
export type QwomeAnalysisInput = {
  /** Optional caller-supplied id, echoed back (e.g. a listing id, or a UUID). */
  id?: string;
  location: QwomeLocation;
  preferences: QwomePreference[];
};

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
   * met  ... within the limit; unmet ... just past; far ... well past;
   * no_data ... QWOME can't measure this category at this location.
   */
  status: "met" | "unmet" | "far" | "no_data";
  /** True when within the viewer's limit. */
  satisfied: boolean;
};

/** Normalized structured result for one property/address. */
export type QwomeFitResult = {
  id?: string;
  location: QwomeLocation;
  categories: QwomeCategoryResult[];
  /** How many measured categories the property satisfies. */
  satisfiedCount: number;
  /** How many preferences QWOME could actually measure here. */
  measuredCount: number;
  /**
   * QWOME fit score (0-100). Null until the scoring model ships ... the field is
   * stable now so every client renders it the moment it's populated.
   */
  score: number | null;
  /** Provider that produced the underlying place data (for traceability). */
  providerId: string;
};

function buildResult(
  input: QwomeAnalysisInput,
  nearby: QwomeNearby,
  providerId: string
): QwomeFitResult {
  const categories: QwomeCategoryResult[] = [];
  let satisfiedCount = 0;
  let measuredCount = 0;

  for (const pref of input.preferences) {
    if (!isMeasurable(pref.category)) continue; // address-based / not-yet-measurable
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

  return {
    id: input.id,
    location: input.location,
    categories,
    satisfiedCount,
    measuredCount,
    score: null, // reserved for the QWOME fit score
    providerId,
  };
}

/** Analyze one property/address against a set of QWOME preferences. */
export async function analyzePropertyFit(
  input: QwomeAnalysisInput,
  provider: PlaceProvider = defaultPlaceProvider
): Promise<QwomeFitResult> {
  const cats = input.preferences.map((p) => p.category).filter(isMeasurable);
  const point = { id: input.id ?? "0", lat: input.location.lat, lng: input.location.lng };
  const nearby = cats.length
    ? (await qwomeNearby([point], cats, provider))[point.id] ?? {}
    : {};
  return buildResult(input, nearby, provider.id);
}

/** Analyze many properties at once (e.g. a page of search results). */
export async function analyzeProperties(
  inputs: QwomeAnalysisInput[],
  provider: PlaceProvider = defaultPlaceProvider
): Promise<QwomeFitResult[]> {
  // Union of measurable categories across all inputs ... one batched engine pass.
  const catSet = new Set<QwomeCategoryKey>();
  for (const inp of inputs) for (const p of inp.preferences) if (isMeasurable(p.category)) catSet.add(p.category);
  const cats = [...catSet];
  const points = inputs.map((inp, i) => ({ id: inp.id ?? String(i), lat: inp.location.lat, lng: inp.location.lng }));
  const nearbyById = cats.length ? await qwomeNearby(points, cats, provider) : {};
  return inputs.map((inp, i) => buildResult(inp, nearbyById[inp.id ?? String(i)] ?? {}, provider.id));
}
