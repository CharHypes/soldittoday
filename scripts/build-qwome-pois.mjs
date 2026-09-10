/**
 * QWOME™ POI dataset builder ... region-parameterized.
 *
 *   node scripts/build-qwome-pois.mjs            # build every region
 *   node scripts/build-qwome-pois.mjs us-mi      # build one region by id
 *
 * Regions come from the shared metadata (lib/qwome/regionsMeta): id, label, OSM
 * area id, and output dataset file. Adding a region is one entry there plus a
 * build run (and, for the runtime, wiring its dataset into a provider). Nothing
 * below is Michigan-specific; only the region's OSM area id changes.
 *
 * Regenerates each region's dataset (e.g. mi-pois.json) from OpenStreetMap with
 * PRECISE classification, because the raw "amenity=hospital / amenity=school"
 * categories are too broad for the accuracy QWOME needs. Straight OSM/Places
 * results mix psychiatric + rehab + veterinary hospitals into "hospital", and
 * preschools + colleges + defunct one-room schoolhouses into "school".
 *
 * The classification rules below are the single source of truth for what counts
 * as each QWOME category. Run at BUILD time only (Overpass is blocked from
 * Vercel's runtime IPs); the app reads the bundled JSON, so this never runs in
 * production. Overpass is best-effort community data ... this favours ACCURACY
 * over coverage (ambiguous features are dropped, not guessed).
 *
 * Datasets produced (each row is [lat, lng, name|null]):
 *   hospital     general acute-care hospitals (NOT psychiatric/rehab/LTC/vet/
 *                specialty/outpatient/doctors' offices)
 *   er           hospitals flagged with an emergency department + freestanding ERs
 *   urgentcare   urgent / immediate / walk-in care
 *   pharmacy     retail pharmacies
 *   behavioral   psychiatric / behavioral / mental-health care ONLY
 *   school_elem  public elementary schools (nearest-in-district, see note)
 *   school_mid   public middle / junior-high schools
 *   school_high  public high schools
 *   grocery      full-service supermarkets a household does a weekly shop at
 *                (excludes warehouse clubs, Target/dollar/convenience/party/
 *                liquor stores, pharmacies, food-service bulk, and specialty-
 *                only food shops). Warehouse Club / Convenience / Organic-
 *                Specialty are planned as separate optional categories.
 *
 * SCHOOL ACCURACY NOTE: OSM has no attendance-boundary data, so these are the
 * NEAREST public school of each level, not the boundary-ASSIGNED school. The UI
 * labels them "Nearest public <level> school in district" and never "assigned".
 * When SABS/NCES boundary data is bundled later, set an `assigned` flag instead.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Shared, reusable classification rules (single source of truth) ... imported
// with an explicit .ts extension so Node can load them via native type-stripping.
import { classifyHealthcare } from "../lib/qwome/classification/healthcare.ts";
import { classifySchool } from "../lib/qwome/classification/school.ts";
import { classifyGrocery } from "../lib/qwome/classification/grocery.ts";
// Shared region metadata (id / label / OSM area id / dataset file) ... the same
// list the runtime resolver reads, so ingestion and runtime never drift.
import { QWOME_REGION_META } from "../lib/qwome/regionsMeta.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "lib", "qwome", "data");
const ENDPOINT = "https://overpass-api.de/api/interpreter";

async function overpass(query) {
  const res = await fetch(`${ENDPOINT}?data=${encodeURIComponent(query)}`, { method: "GET" });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  return res.json();
}

// Queries are parameterized by the region's OSM area id ... nothing here is
// Michigan-specific; only the area id changes per region.
const healthQuery = (areaId) => `[out:json][timeout:300];area(${areaId})->.a;(
  nwr["amenity"="hospital"](area.a); nwr["healthcare"="hospital"](area.a);
  nwr["amenity"="clinic"](area.a); nwr["healthcare"="clinic"](area.a);
  nwr["healthcare"="urgent_care"](area.a);
  nwr["amenity"="pharmacy"](area.a); nwr["healthcare"="pharmacy"](area.a);
  nwr["healthcare"~"psychotherapist|counselling|rehabilitation"](area.a);
  nwr["healthcare:speciality"~"psychiatry|psychology|mental"](area.a);
  nwr["emergency"="department"](area.a);
  nwr["amenity"="social_facility"]["social_facility:for"~"mental"](area.a);
);out center tags;`;

const schoolQuery = (areaId) => `[out:json][timeout:300];area(${areaId})->.a;(
  nwr["amenity"="school"](area.a);
);out center tags;`;

const groceryQuery = (areaId) => `[out:json][timeout:300];area(${areaId})->.a;(
  nwr["shop"="supermarket"](area.a);
  nwr["shop"="wholesale"](area.a);
  nwr["shop"="department_store"]["name"~"Meijer|Walmart|Target",i](area.a);
);out center tags;`;

// ---- helpers ----
const coord = (e) => e.type === "node" ? [e.lat, e.lon] : (e.center ? [e.center.lat, e.center.lon] : null);
const round = (n) => Math.round(n * 100000) / 100000;
const T = (e) => e.tags || {};
const nameOf = (t) => t.name || t.official_name || t.alt_name || null;
const isDisused = (t) => Object.keys(t).some((k) => /^(disused|abandoned|razed|demolished|was):/.test(k)) || t.disused === "yes";
const toRows = (list) => {
  const seen = new Set(); const out = [];
  for (const e of list) {
    const c = coord(e); if (!c) continue;
    const nm = nameOf(T(e));
    const key = `${round(c[0])},${round(c[1])},${nm || ""}`;
    if (seen.has(key)) continue; seen.add(key);
    out.push([round(c[0]), round(c[1]), nm]);
  }
  return out;
};

// ---- classification ----
// The rules that decide what each place IS (acute-care hospital vs psychiatric,
// public school level, full-service vs warehouse / organic / international
// grocery) live in the reusable QWOME core: lib/qwome/classification/*. They are
// shared with the runtime, providers, API, and the standalone QWOME app ... this
// script is just the build-time ingestion that applies them to OSM data.

// One OSM element -> the provider-neutral { name, tags } the classifiers accept.
const toPlace = (e) => ({ name: nameOf(T(e)), tags: T(e) });

// Bucket elements into { categoryKey: elements[] } via a shared classifier (a
// place can land in several categories, e.g. a hospital that also has an ER).
function bucket(elements, classify) {
  const map = {};
  for (const e of elements) {
    for (const key of classify(toPlace(e))) (map[key] ??= []).push(e);
  }
  return map;
}

// Dataset layer order (stable for diffs + the app).
const KEYS = [
  "hospital", "er", "urgentcare", "pharmacy", "behavioral",
  "school_elem", "school_mid", "school_high",
  "grocery", "grocery_any", "grocery_warehouse", "grocery_organic",
  "grocery_asian", "grocery_chinese", "grocery_korean", "grocery_japanese",
  "grocery_south_asian", "grocery_mideast", "grocery_halal", "grocery_latin",
  "grocery_african_caribbean", "grocery_kosher",
];

/** Fetch + classify + write one region's dataset. */
async function buildRegion(region) {
  const out = path.join(DATA_DIR, region.datasetFile);
  console.log(`\n== ${region.label} (${region.id}) -> ${region.datasetFile} ==`);
  console.log("Fetching healthcare from Overpass...");
  const health = await overpass(healthQuery(region.osmAreaId));
  console.log(`  ${health.elements.length} health features`);
  console.log("Fetching schools from Overpass...");
  const schools = await overpass(schoolQuery(region.osmAreaId));
  console.log(`  ${schools.elements.length} school features`);
  console.log("Fetching supermarkets from Overpass...");
  const grocery = await overpass(groceryQuery(region.osmAreaId));
  console.log(`  ${grocery.elements.length} grocery features`);

  const buckets = {
    ...bucket(health.elements, classifyHealthcare),
    ...bucket(schools.elements, classifySchool),
    ...bucket(grocery.elements, classifyGrocery),
  };
  const dataset = {};
  for (const key of KEYS) dataset[key] = toRows(buckets[key] ?? []);

  fs.writeFileSync(out, JSON.stringify(dataset));
  console.log("Wrote", out);
  for (const [k, v] of Object.entries(dataset)) console.log("  " + k.padEnd(13), v.length);
}

async function main() {
  // Optional CLI arg selects one region by id; otherwise build every region in
  // the shared metadata (today: Michigan -> mi-pois.json).
  const only = process.argv[2];
  const regions = only ? QWOME_REGION_META.filter((r) => r.id === only) : QWOME_REGION_META;
  if (only && regions.length === 0) {
    throw new Error(`Unknown region "${only}". Known: ${QWOME_REGION_META.map((r) => r.id).join(", ")}`);
  }
  for (const region of regions) await buildRegion(region);
}

main().catch((err) => { console.error(err); process.exit(1); });
