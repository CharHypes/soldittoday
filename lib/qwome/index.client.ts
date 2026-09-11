/**
 * @qwome/engine/client ... QWOME™'s pure, client-safe public API.
 *
 * Everything re-exported here is pure logic and data-free (only type-only
 * imports from the engine), so importing this into a browser bundle pulls NONE
 * of the bundled place data or the network/provider code. Use this from client
 * components; use the full "@qwome/engine" (./index) only on the server / in the
 * QWOME service.
 *
 * Deliberately excluded (server-only ... they pull the dataset or do I/O): the
 * engine, analysis, providers, the region runtime resolver, and classification.
 */

// Preference model + semantic category registry (encode/decode, evaluate, ...)
export * from "./preferences";
// Fit evaluation primitives (evaluateFit / selectFitting) ... engine-free
export * from "./fit";
// Distance metric (haversine) + provider interfaces (types are safe client-side)
export * from "./distance";
// Geocoding provider interface + types
export * from "./geocode";
// Shared region metadata (pure data: ids, labels, bounds)
export * from "./regionsMeta";
