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
import type { PlaceProvider } from "./providers";
import { resolveProvider } from "./regions";
import { isMeasurable, type QwomePreference } from "./preferences";
import { evaluateFit, type QwomeCategoryResult } from "./fit";

// Re-export the pure fit primitives so callers can reach them via the analysis
// barrel; their implementation lives in ./fit (engine-free, no bundled data).
export { evaluateFit, selectFitting } from "./fit";
export type {
  QwomeCategoryResult,
  QwomeFitEvaluation,
  QwomeFitSelection,
} from "./fit";

/** A bare geographic location ... no listing / property object required. */
export type QwomeLocation = { lat: number; lng: number };

/** Normalized analysis request for one property/address. */
export type QwomeAnalysisInput = {
  /** Optional caller-supplied id, echoed back (e.g. a listing id, or a UUID). */
  id?: string;
  location: QwomeLocation;
  preferences: QwomePreference[];
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
  const evaluation = evaluateFit(nearby, input.preferences);
  return {
    id: input.id,
    location: input.location,
    ...evaluation,
    score: null, // reserved for the QWOME fit score
    providerId,
  };
}

/**
 * Analyze one property/address against a set of QWOME preferences. When no
 * provider is given, QWOME resolves the region from the location (see
 * lib/qwome/regions), so this works across regions with no caller change.
 */
export async function analyzePropertyFit(
  input: QwomeAnalysisInput,
  provider: PlaceProvider = resolveProvider([input.location])
): Promise<QwomeFitResult> {
  const cats = input.preferences.map((p) => p.category).filter(isMeasurable);
  const point = { id: input.id ?? "0", lat: input.location.lat, lng: input.location.lng };
  const nearby = cats.length
    ? (await qwomeNearby([point], cats, provider))[point.id] ?? {}
    : {};
  return buildResult(input, nearby, provider.id);
}

/**
 * Analyze many properties at once (e.g. a page of search results). Resolves the
 * region from the properties' locations when no provider is given.
 */
export async function analyzeProperties(
  inputs: QwomeAnalysisInput[],
  provider: PlaceProvider = resolveProvider(inputs.map((i) => i.location))
): Promise<QwomeFitResult[]> {
  // Union of measurable categories across all inputs ... one batched engine pass.
  const catSet = new Set<QwomeCategoryKey>();
  for (const inp of inputs) for (const p of inp.preferences) if (isMeasurable(p.category)) catSet.add(p.category);
  const cats = [...catSet];
  const points = inputs.map((inp, i) => ({ id: inp.id ?? String(i), lat: inp.location.lat, lng: inp.location.lng }));
  const nearbyById = cats.length ? await qwomeNearby(points, cats, provider) : {};
  return inputs.map((inp, i) => buildResult(inp, nearbyById[inp.id ?? String(i)] ?? {}, provider.id));
}
