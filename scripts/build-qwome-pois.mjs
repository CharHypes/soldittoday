/**
 * QWOME™ POI dataset builder.
 *
 *   node scripts/build-qwome-pois.mjs
 *
 * Regenerates lib/qwome/data/mi-pois.json from OpenStreetMap (Overpass) with
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
 *   grocery      preserved from the previous dataset unchanged
 *
 * SCHOOL ACCURACY NOTE: OSM has no attendance-boundary data, so these are the
 * NEAREST public school of each level, not the boundary-ASSIGNED school. The UI
 * labels them "Nearest public <level> school in district" and never "assigned".
 * When SABS/NCES boundary data is bundled later, set an `assigned` flag instead.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "lib", "qwome", "data", "mi-pois.json");
const MI_AREA = 3600165789; // OSM relation 165789 (State of Michigan) as an area id
const ENDPOINT = "https://overpass-api.de/api/interpreter";

async function overpass(query) {
  const res = await fetch(`${ENDPOINT}?data=${encodeURIComponent(query)}`, { method: "GET" });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  return res.json();
}

const HEALTH_Q = `[out:json][timeout:300];area(${MI_AREA})->.mi;(
  nwr["amenity"="hospital"](area.mi); nwr["healthcare"="hospital"](area.mi);
  nwr["amenity"="clinic"](area.mi); nwr["healthcare"="clinic"](area.mi);
  nwr["healthcare"="urgent_care"](area.mi);
  nwr["amenity"="pharmacy"](area.mi); nwr["healthcare"="pharmacy"](area.mi);
  nwr["healthcare"~"psychotherapist|counselling|rehabilitation"](area.mi);
  nwr["healthcare:speciality"~"psychiatry|psychology|mental"](area.mi);
  nwr["emergency"="department"](area.mi);
  nwr["amenity"="social_facility"]["social_facility:for"~"mental"](area.mi);
);out center tags;`;

const SCHOOL_Q = `[out:json][timeout:300];area(${MI_AREA})->.mi;(
  nwr["amenity"="school"](area.mi);
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

// ---- healthcare classification ----
const NON_ACUTE = new RegExp(
  "\\b(psych|psychiatric|behavioral|behaviour|mental health|rehab|rehabilitation|nursing (home|care|center|centre)|skilled nursing|convalescent|long.?term|hospice|veterinary|animal|surgery cent(er|re)|surgical cent(er|re)|physical therapy|physiotherap|dialysis|substance|addiction|recovery cent|detox|assisted living|senior (living|care)|outpatient|imaging|radiology|orthop" +
  "|dental|dentist|eye (care|cent)|vision|optical|chiropract|dermatolog|fertility|women'?s? (health|care) cent|birthing|urgent care|walk.?in|immediate care|express care)\\b", "i");
const NONACUTE_SPEC = /physiatry|physical|rehab|geriatr|hospice|nursing|long.?term|ophthalm|optometry|dental|dermatolog|orthoped|podiatr|weight_loss|fertility|plastic|cosmetic|dialysis|occupational|audiolog|chiropract|oncolog|urolog/i;
const MENTAL_SPEC = /psychiat|psycholog|mental|behav/i;
const MENTAL_COUNS = /psych|mental|behav|addiction|substance|family|marriage|grief|trauma|depression|anxiety|general/i;
const WOMENS_CENTER = /women'?s\s+(cent(er|re)|health|clinic)/i;
const BEHAVIORAL_NAME = /\b(psych|psychiatric|behavioral|behaviour|mental health|counsel|counseling|therapy cent|wellness cent.*(mental|behav))\b/i;
const URGENT_NAME = /\b(urgent care|immediate care|walk.?in clinic|express care|quick care|urgentcare|redimed|concentra|minuteclinic|minute clinic)\b/i;

function classifyHealth(elements) {
  const hospital = [], er = [], urgentcare = [], pharmacy = [], behavioral = [];
  for (const e of elements) {
    const t = T(e); if (isDisused(t)) continue;
    if (!coord(e)) continue;
    const nm = nameOf(t) || "";
    const a = (t.amenity || "").toLowerCase();
    const h = (t.healthcare || "").toLowerCase();
    const s = (t["healthcare:speciality"] || t["healthcare:specialty"] || "").toLowerCase();

    if (a === "pharmacy" || h === "pharmacy") {
      if (!/veterinary|animal|compounding lab/i.test(nm)) pharmacy.push(e);
      continue;
    }
    const counsType = (t["healthcare:counselling"] || "").toLowerCase();
    const isBehavioral =
      MENTAL_SPEC.test(s) || h === "psychotherapist" ||
      (h === "counselling" && MENTAL_COUNS.test(counsType)) ||
      (a === "social_facility" && /mental/i.test(t["social_facility:for"] || "")) ||
      ((a === "hospital" || a === "clinic" || h === "hospital" || h === "clinic") && BEHAVIORAL_NAME.test(nm));
    if (isBehavioral) { behavioral.push(e); continue; }

    if (h === "urgent_care" || URGENT_NAME.test(nm)) { urgentcare.push(e); continue; }

    if (a === "hospital" || h === "hospital") {
      const disq =
        NON_ACUTE.test(nm) || WOMENS_CENTER.test(nm) || /^emergency\b/i.test(nm) ||
        /physiotherap|dialysis|rehabilitation|psychiat|psycholog|mental|hospice|nursing|long_term|counselling/.test(h) ||
        NONACUTE_SPEC.test(s) || MENTAL_SPEC.test(s);
      if (!disq) {
        hospital.push(e);
        if ((t.emergency && t.emergency !== "no") || /emergency (room|dept|department|cent)/i.test(nm)) er.push(e);
      }
      continue;
    }
    if (t.emergency === "department" || /freestanding (er|emergency)|emergency (room|department|cent)/i.test(nm)) er.push(e);
  }
  return { hospital, er, urgentcare, pharmacy, behavioral };
}

// ---- school classification (public, by level) ----
const PRIVATE = /\b(catholic|christian|lutheran|baptist|adventist|islamic|muslim|hebrew|jewish|torah|yeshiva|st\.?\s|saint\s|our lady|holy |sacred heart|immaculate|montessori|waldorf|academy|prep\b|preparatory|day school|private|seminary|parochial)\b/i;
const CHARTER = /\bcharter|academ(y|ies)\b/i;
const NON_SCHOOL = /\b(pre-?school|pre-?k|pre-?kindergarten|head ?start|day ?care|child ?care|childcare|early (childhood|learning)|learning cent|nursery|college|universit|institute|technical cent|career cent|vocational|trade school|cosmetolog|beauty (school|academy)|barber|driving school|driver|music (school|academy)|dance|martial art|gymnastic|tutor|sylvan|kumon|adult (education|ed)|community education|isd$|intermediate school district|esa\b)\b/i;
const DEFUNCT = /^former\b|^old\b|\(historic\)|\(closed\)|\(former\)|\bdemolished\b/i;

const isHigh = (t, nm) => {
  if (/junior high|jr\.? high|middle|intermediate/i.test(nm)) return false;
  const lvl = (t["isced:level"] || "").toString(); const sl = (t["school:level"] || "").toLowerCase();
  const g = (t.grades || t["school:grades"] || "").toString();
  if (/high school|senior high|\bshs\b/i.test(nm) || /\bhigh\b/i.test(nm)) return true;
  if (/(^|[;, ])3([;, ]|$)/.test(lvl) || /secondary|high/.test(sl)) return true;
  return /\b9\s*-\s*12\b|\b(10|11|12)\b\s*$/.test(g);
};
const isMiddle = (t, nm) => {
  const lvl = (t["isced:level"] || "").toString(); const sl = (t["school:level"] || "").toLowerCase();
  const g = (t.grades || t["school:grades"] || "").toString();
  if (/middle|junior high|jr\.? high|intermediate school/i.test(nm)) return true;
  if (/(^|[;, ])2([;, ]|$)/.test(lvl) || /middle/.test(sl)) return true;
  return /\b6\s*-\s*8\b|\b7\s*-\s*8\b|\b5\s*-\s*8\b/.test(g);
};
const isElem = (t, nm) => {
  const lvl = (t["isced:level"] || "").toString(); const sl = (t["school:level"] || "").toLowerCase();
  const g = (t.grades || t["school:grades"] || "").toString();
  if (/elementary|primary/i.test(nm)) return true;
  if (/(^|[;, ])1([;, ]|$)/.test(lvl) || /elementary|primary/.test(sl)) return true;
  return /^(k|kg|ps|pk|0|1)\s*-\s*(4|5|6)\b/i.test(g);
};

function classifySchools(elements) {
  const school_elem = [], school_mid = [], school_high = [];
  for (const e of elements) {
    const t = T(e); if (t.amenity !== "school" || isDisused(t)) continue;
    if (!coord(e)) continue;
    const nm = nameOf(t); if (!nm) continue;
    if (DEFUNCT.test(nm) || NON_SCHOOL.test(nm)) continue;
    const optype = (t["operator:type"] || "").toLowerCase();
    if (optype === "private" || optype === "religious" || t.fee === "yes" || PRIVATE.test(nm)) continue;
    if (optype !== "public" && optype !== "government" && CHARTER.test(nm)) continue;
    if (isHigh(t, nm)) school_high.push(e);
    else if (isMiddle(t, nm)) school_mid.push(e);
    else if (isElem(t, nm)) school_elem.push(e);
    // generic "X School" with no level signal is intentionally dropped
  }
  return { school_elem, school_mid, school_high };
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  console.log("Fetching Michigan healthcare from Overpass...");
  const health = await overpass(HEALTH_Q);
  console.log(`  ${health.elements.length} health features`);
  console.log("Fetching Michigan schools from Overpass...");
  const schools = await overpass(SCHOOL_Q);
  console.log(`  ${schools.elements.length} school features`);

  const h = classifyHealth(health.elements);
  const s = classifySchools(schools.elements);
  const dataset = {
    hospital: toRows(h.hospital),
    er: toRows(h.er),
    urgentcare: toRows(h.urgentcare),
    pharmacy: toRows(h.pharmacy),
    behavioral: toRows(h.behavioral),
    school_elem: toRows(s.school_elem),
    school_mid: toRows(s.school_mid),
    school_high: toRows(s.school_high),
    grocery: existing.grocery, // preserved unchanged
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(dataset));
  console.log("\nWrote", DATA_FILE);
  for (const [k, v] of Object.entries(dataset)) console.log("  " + k.padEnd(13), v.length);
}

main().catch((err) => { console.error(err); process.exit(1); });
