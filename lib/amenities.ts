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
import { resolveProvider } from "./qwome/regions";

export type AmenityKey = QwomeCategoryKey;
export type AmenityDistance = QwomeDistance;
export type AmenityDistances = QwomeNearby;

export const formatMiles = qwomeFormatMiles;

export async function amenitiesForPoints(
  points: Array<{ id: string; lat: number; lng: number }>
): Promise<Record<string, AmenityDistances>> {
  // No category list ... QWOME resolves every measurable category (healthcare,
  // schools by level, grocery). The UI shows only the ones the viewer picked.
  // Resolve the region's data provider from the points (Michigan today).
  return qwomeNearby(points, undefined, resolveProvider(points));
}
