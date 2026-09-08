/**
 * Sold It Today adapter over the QWOME™ engine (lib/qwome/engine).
 *
 * The proximity/lifestyle logic itself lives in QWOME (brand-agnostic, reusable,
 * and separable into its own service). This file just re-exposes it under the
 * names the Sold It Today UI already uses, so the app depends on QWOME through a
 * single seam. Display it as "Powered by QWOME™".
 */
import {
  qwomeNearby,
  formatMiles as qwomeFormatMiles,
  type QwomeCategoryKey,
  type QwomeDistance,
  type QwomeNearby,
} from "./qwome/engine";

export type AmenityKey = QwomeCategoryKey;
export type AmenityDistance = QwomeDistance;
export type AmenityDistances = QwomeNearby;

export const formatMiles = qwomeFormatMiles;

export async function amenitiesForPoints(
  points: Array<{ id: string; lat: number; lng: number }>
): Promise<Record<string, AmenityDistances>> {
  return qwomeNearby(points, ["hospital", "school", "grocery"]);
}
