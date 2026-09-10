/**
 * QWOME™ classification ... shared, reusable place-classification rules.
 *
 * These modules are the SINGLE SOURCE OF TRUTH for what a place "is" in QWOME
 * terms (acute-care hospital vs psychiatric vs urgent care; public elementary vs
 * a preschool; a full-service supermarket vs a warehouse club vs an international
 * market). The same rules are used by:
 *   - the build-time data ingestion (scripts/build-qwome-pois.mjs)
 *   - any future live/place provider that classifies at query time
 *   - the standalone QWOME service/app
 *
 * Input is PROVIDER-NEUTRAL: a place is `{ name, tags }`, where `tags` is a flat
 * string map. The keys used today are OSM's (amenity, healthcare, shop, ...); a
 * non-OSM provider's adapter maps its own attributes onto these keys, so the
 * rules stay reusable across data sources. A classifier returns every QWOME
 * category the place belongs to (a place can belong to several ... e.g. a hospital
 * with an ER, or a supermarket that is also an international market).
 */
import type { QwomeCategoryKey } from "../engine";

/** A place to classify, independent of any specific data provider. */
export type ClassifiablePlace = {
  name: string | null;
  /** Flat attribute map (OSM-style keys today). */
  tags: Record<string, string>;
};

/** Every QWOME category a place belongs to (empty = none). */
export type ClassifierFn = (place: ClassifiablePlace) => QwomeCategoryKey[];
