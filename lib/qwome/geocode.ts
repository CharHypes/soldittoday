/**
 * QWOME™ geocoding seam ... address → coordinates, provider-neutral.
 *
 * Address-based categories (Workplace, Family & Friends, Custom Location) capture
 * a place as text today. To MATCH homes against them, that text must become
 * coordinates ... that's this seam. A vendor adapter (Google, Mapbox, Census,
 * Nominatim, ...) implements GeocodeProvider; QWOME core never depends on any one.
 *
 * No vendor is wired yet, so the default returns null ("unavailable") and
 * address-based categories stay text-only ... exactly today's behavior. Wiring a
 * geocoder later needs no change to the engine, analysis, or the UI.
 */

export type QwomeGeocodeResult = {
  lat: number;
  lng: number;
  /** Normalized/canonical address the provider resolved to, when available. */
  formatted?: string;
};

/** Resolves a free-text address/place to coordinates. Async and vendor-backed. */
export interface GeocodeProvider {
  readonly id: string;
  geocode(query: string): Promise<QwomeGeocodeResult | null>;
}

/** No geocoder configured ... returns null so callers degrade gracefully. */
export const unavailableGeocodeProvider: GeocodeProvider = {
  id: "none",
  geocode: async () => null,
};

let current: GeocodeProvider = unavailableGeocodeProvider;

/** Wire a geocoding vendor adapter. */
export function setGeocodeProvider(provider: GeocodeProvider): void {
  current = provider;
}

export function getGeocodeProvider(): GeocodeProvider {
  return current;
}

/** Geocode via the configured provider (null when none/unresolved). */
export function geocode(query: string): Promise<QwomeGeocodeResult | null> {
  return current.geocode(query);
}
