/**
 * @qwome/engine ... QWOME™'s public API (full / server entry).
 *
 * This barrel is the package's single public surface. QWOME is a brand-agnostic
 * proximity + property-fit intelligence engine; nothing under lib/qwome imports
 * Sold It Today code, so this whole folder lifts out into a standalone
 * `@qwome/engine` package with no rewrite (see ./README.md). Server consumers and
 * the QWOME service import from here; browser/client code imports the pure subset
 * from "@qwome/engine/client" (./index.client) so it never pulls the bundled
 * place data.
 *
 * NOT part of the package (they consume it): lib/qwome/client/* (Sold It Today's
 * presentation, icons, and browser persistence) and lib/amenities (the SIT
 * adapter). Those stay in the app when the engine is extracted.
 */

// Proximity engine + core types
export * from "./engine";
// Property-fit analysis (also re-exports the pure fit primitives: evaluateFit,
// selectFitting, and their result types).
export * from "./analysis";
// Preference model + semantic category registry
export * from "./preferences";
// Data-provider abstraction (bundled, empty, hosted-http) + default
export * from "./providers";
// Region registry + geographic resolution
export * from "./regions";
// Shared region metadata (runtime + build ingestion)
export * from "./regionsMeta";
// Distance metric + travel-time provider seams
export * from "./distance";
// Geocoding provider seam
export * from "./geocode";
// Shared place-classification rules
export * from "./classification";
