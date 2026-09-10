/**
 * QWOME™ public-school classification, by level.
 *
 * Focuses on public schools serving a residential area, split into Elementary /
 * Middle / High. Excludes preschools, Head Start, daycare, colleges,
 * universities, trade/beauty schools, private/charter schools, and defunct
 * schools. Junior-high routes to Middle, never High. Generic "X School" with no
 * level signal is intentionally dropped (accuracy over coverage).
 *
 * NOTE: OSM has no attendance-boundary data, so these are the NEAREST public
 * school of each level, not the boundary-ASSIGNED school. When SABS/NCES boundary
 * data is available, add an `assigned` signal upstream ... the level rules here
 * do not change.
 */
import type { QwomeCategoryKey } from "../engine";
import type { ClassifiablePlace } from "./types";

const PRIVATE = /\b(catholic|christian|lutheran|baptist|adventist|islamic|muslim|hebrew|jewish|torah|yeshiva|st\.?\s|saint\s|our lady|holy |sacred heart|immaculate|montessori|waldorf|academy|prep\b|preparatory|day school|private|seminary|parochial)\b/i;
const CHARTER = /\bcharter|academ(y|ies)\b/i;
const NON_SCHOOL = /\b(pre-?school|pre-?k|pre-?kindergarten|head ?start|day ?care|child ?care|childcare|early (childhood|learning)|learning cent|nursery|college|universit|institute|technical cent|career cent|vocational|trade school|cosmetolog|beauty (school|academy)|barber|driving school|driver|music (school|academy)|dance|martial art|gymnastic|tutor|sylvan|kumon|adult (education|ed)|community education|isd$|intermediate school district|esa\b)\b/i;
const DEFUNCT = /^former\b|^old\b|\(historic\)|\(closed\)|\(former\)|\bdemolished\b/i;

const isDisused = (t: Record<string, string>) =>
  Object.keys(t).some((k) => /^(disused|abandoned|razed|demolished|was):/.test(k)) || t.disused === "yes";

const isHigh = (t: Record<string, string>, nm: string) => {
  if (/junior high|jr\.? high|middle|intermediate/i.test(nm)) return false;
  const lvl = (t["isced:level"] || "").toString(); const sl = (t["school:level"] || "").toLowerCase();
  const g = (t.grades || t["school:grades"] || "").toString();
  if (/high school|senior high|\bshs\b/i.test(nm) || /\bhigh\b/i.test(nm)) return true;
  if (/(^|[;, ])3([;, ]|$)/.test(lvl) || /secondary|high/.test(sl)) return true;
  return /\b9\s*-\s*12\b|\b(10|11|12)\b\s*$/.test(g);
};
const isMiddle = (t: Record<string, string>, nm: string) => {
  const lvl = (t["isced:level"] || "").toString(); const sl = (t["school:level"] || "").toLowerCase();
  const g = (t.grades || t["school:grades"] || "").toString();
  if (/middle|junior high|jr\.? high|intermediate school/i.test(nm)) return true;
  if (/(^|[;, ])2([;, ]|$)/.test(lvl) || /middle/.test(sl)) return true;
  return /\b6\s*-\s*8\b|\b7\s*-\s*8\b|\b5\s*-\s*8\b/.test(g);
};
const isElem = (t: Record<string, string>, nm: string) => {
  const lvl = (t["isced:level"] || "").toString(); const sl = (t["school:level"] || "").toLowerCase();
  const g = (t.grades || t["school:grades"] || "").toString();
  if (/elementary|primary/i.test(nm)) return true;
  if (/(^|[;, ])1([;, ]|$)/.test(lvl) || /elementary|primary/.test(sl)) return true;
  return /^(k|kg|ps|pk|0|1)\s*-\s*(4|5|6)\b/i.test(g);
};

export function classifySchool(place: ClassifiablePlace): QwomeCategoryKey[] {
  const t = place.tags;
  if (t.amenity !== "school" || isDisused(t)) return [];
  const nm = place.name;
  if (!nm) return [];
  if (DEFUNCT.test(nm) || NON_SCHOOL.test(nm)) return [];
  const optype = (t["operator:type"] || "").toLowerCase();
  if (optype === "private" || optype === "religious" || t.fee === "yes" || PRIVATE.test(nm)) return [];
  if (optype !== "public" && optype !== "government" && CHARTER.test(nm)) return [];
  if (isHigh(t, nm)) return ["school_high"];
  if (isMiddle(t, nm)) return ["school_mid"];
  if (isElem(t, nm)) return ["school_elem"];
  return []; // generic "X School" with no level signal
}
