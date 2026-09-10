/**
 * QWOME™ distance & travel-time provider seams.
 *
 * Two provider-neutral abstractions, mirroring PlaceProvider:
 *
 *   DistanceProvider    scalar "how far" between two coordinates, in miles. This
 *                       is what the proximity engine uses to find the nearest
 *                       place. Straight-line (haversine) today; a different
 *                       metric can be swapped in without touching the engine.
 *
 *   TravelTimeProvider  "how long to get there" (minutes) by driving/transit/etc.
 *                       Async and vendor-backed (routing APIs). Not on the engine
 *                       hot path ... it's for drive-time PREFERENCES and future
 *                       QWOME scoring, layered on top of the nearest-by-distance
 *                       results. Defaults to "unavailable" so nothing depends on
 *                       a vendor until one is wired.
 *
 * Both are pure interfaces + tiny defaults ... no data, no vendor lock-in.
 */

export type QwomeLatLng = { lat: number; lng: number };

const EARTH_MI = 3958.8;

/** Straight-line distance in miles between two coordinates (haversine). */
export function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_MI * 2 * Math.asin(Math.sqrt(s));
}

/**
 * Supplies a scalar distance in miles between two coordinates. Scalar args (not
 * objects) keep the engine's inner loop allocation-free over many candidates.
 */
export interface DistanceProvider {
  readonly id: string;
  /** What the distance represents ... straight-line today; drive-time later. */
  readonly kind: "straight-line" | "drive-time" | "transit";
  miles(aLat: number, aLng: number, bLat: number, bLng: number): number;
}

/** The default distance metric: straight-line (haversine) miles. */
export const haversineDistanceProvider: DistanceProvider = {
  id: "haversine",
  kind: "straight-line",
  miles: haversineMiles,
};

/** The distance metric the engine uses when a caller doesn't pass one. */
export const defaultDistanceProvider: DistanceProvider = haversineDistanceProvider;

// ---- travel time (minutes) ----

export type QwomeTravelResult = {
  /** Estimated travel time in minutes. */
  minutes: number;
  /** Route distance in miles, when the provider reports it. */
  miles?: number;
};

/**
 * Estimates travel time between two points (a routing/vendor seam). Async by
 * nature; `travelMinutesBatch` lets a vendor answer one origin → many
 * destinations in a single matrix call. Returns null when it can't answer, so
 * callers degrade gracefully.
 */
export interface TravelTimeProvider {
  readonly id: string;
  readonly mode: "driving" | "walking" | "transit" | "cycling";
  travelMinutes(origin: QwomeLatLng, dest: QwomeLatLng): Promise<QwomeTravelResult | null>;
  travelMinutesBatch?(
    origin: QwomeLatLng,
    dests: QwomeLatLng[]
  ): Promise<(QwomeTravelResult | null)[]>;
}

/** No travel-time source configured ... returns null (callers fall back). */
export const unavailableTravelTimeProvider: TravelTimeProvider = {
  id: "none",
  mode: "driving",
  travelMinutes: async () => null,
};

let currentTravelTimeProvider: TravelTimeProvider = unavailableTravelTimeProvider;

/** Wire a routing/travel-time vendor (e.g. a drive-time API adapter). */
export function setTravelTimeProvider(provider: TravelTimeProvider): void {
  currentTravelTimeProvider = provider;
}

export function getTravelTimeProvider(): TravelTimeProvider {
  return currentTravelTimeProvider;
}
