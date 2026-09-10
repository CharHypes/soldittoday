/**
 * QWOME™ region metadata ... the single source of truth for what regions exist.
 *
 * Pure data: no providers, no bundled datasets, no imports ... so BOTH the runtime
 * (lib/qwome/regions, which attaches a data provider per region) AND the build-
 * time ingestion (scripts/build-qwome-pois.mjs, which fetches + classifies each
 * region's OSM data) read the same list. Adding a region is one entry here plus a
 * build run (and, for the runtime, wiring its bundled dataset into a provider).
 *
 * Fields:
 *   id           stable region id, e.g. "us-mi"
 *   label        human label, e.g. "Michigan"
 *   bounds       geographic box the region's data covers (runtime resolution)
 *   osmAreaId    OSM area id for ingestion = relation id + 3600000000
 *   datasetFile  bundled dataset filename under lib/qwome/data
 */
export type QwomeRegionBounds = { south: number; west: number; north: number; east: number };

export type QwomeRegionMeta = {
  id: string;
  label: string;
  bounds: QwomeRegionBounds;
  osmAreaId: number;
  datasetFile: string;
};

export const QWOME_REGION_META: QwomeRegionMeta[] = [
  {
    id: "us-mi",
    label: "Michigan",
    // Padded to safely contain the whole state (incl. the UP and Isle Royale).
    bounds: { south: 41.6, west: -90.6, north: 48.4, east: -82.0 },
    osmAreaId: 3600165789, // OSM relation 165789 (State of Michigan)
    datasetFile: "mi-pois.json",
  },
];

export function regionMeta(id: string): QwomeRegionMeta | undefined {
  return QWOME_REGION_META.find((r) => r.id === id);
}
