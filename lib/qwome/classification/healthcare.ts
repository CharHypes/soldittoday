/**
 * QWOME™ healthcare classification.
 *
 * Precise on purpose: a general acute-care hospital is NOT an ER, urgent care, a
 * pharmacy, or a psychiatric/behavioral facility, and QWOME must not conflate
 * them. Psychiatric/rehab/LTC/veterinary/specialty/outpatient facilities are
 * excluded from `hospital` and only surface under their own category.
 *
 * Returns every QWOME healthcare category the place belongs to (a hospital with
 * an emergency department returns both `hospital` and `er`).
 */
import type { QwomeCategoryKey } from "../engine";
import type { ClassifiablePlace } from "./types";

const NON_ACUTE = new RegExp(
  "\\b(psych|psychiatric|behavioral|behaviour|mental health|rehab|rehabilitation|nursing (home|care|center|centre)|skilled nursing|convalescent|long.?term|hospice|veterinary|animal|surgery cent(er|re)|surgical cent(er|re)|physical therapy|physiotherap|dialysis|substance|addiction|recovery cent|detox|assisted living|senior (living|care)|outpatient|imaging|radiology|orthop" +
  "|dental|dentist|eye (care|cent)|vision|optical|chiropract|dermatolog|fertility|women'?s? (health|care) cent|birthing|urgent care|walk.?in|immediate care|express care)\\b", "i");
const NONACUTE_SPEC = /physiatry|physical|rehab|geriatr|hospice|nursing|long.?term|ophthalm|optometry|dental|dermatolog|orthoped|podiatr|weight_loss|fertility|plastic|cosmetic|dialysis|occupational|audiolog|chiropract|oncolog|urolog/i;
const MENTAL_SPEC = /psychiat|psycholog|mental|behav/i;
const MENTAL_COUNS = /psych|mental|behav|addiction|substance|family|marriage|grief|trauma|depression|anxiety|general/i;
const WOMENS_CENTER = /women'?s\s+(cent(er|re)|health|clinic)/i;
const BEHAVIORAL_NAME = /\b(psych|psychiatric|behavioral|behaviour|mental health|counsel|counseling|therapy cent|wellness cent.*(mental|behav))\b/i;
const URGENT_NAME = /\b(urgent care|immediate care|walk.?in clinic|express care|quick care|urgentcare|redimed|concentra|minuteclinic|minute clinic)\b/i;

const isDisused = (t: Record<string, string>) =>
  Object.keys(t).some((k) => /^(disused|abandoned|razed|demolished|was):/.test(k)) || t.disused === "yes";

export function classifyHealthcare(place: ClassifiablePlace): QwomeCategoryKey[] {
  const t = place.tags;
  if (isDisused(t)) return [];
  const nm = place.name || "";
  const a = (t.amenity || "").toLowerCase();
  const h = (t.healthcare || "").toLowerCase();
  const s = (t["healthcare:speciality"] || t["healthcare:specialty"] || "").toLowerCase();

  if (a === "pharmacy" || h === "pharmacy") {
    return /veterinary|animal|compounding lab/i.test(nm) ? [] : ["pharmacy"];
  }

  const counsType = (t["healthcare:counselling"] || "").toLowerCase();
  const isBehavioral =
    MENTAL_SPEC.test(s) || h === "psychotherapist" ||
    (h === "counselling" && MENTAL_COUNS.test(counsType)) ||
    (a === "social_facility" && /mental/i.test(t["social_facility:for"] || "")) ||
    ((a === "hospital" || a === "clinic" || h === "hospital" || h === "clinic") && BEHAVIORAL_NAME.test(nm));
  if (isBehavioral) return ["behavioral"];

  if (h === "urgent_care" || URGENT_NAME.test(nm)) return ["urgentcare"];

  if (a === "hospital" || h === "hospital") {
    const disq =
      NON_ACUTE.test(nm) || WOMENS_CENTER.test(nm) || /^emergency\b/i.test(nm) ||
      /physiotherap|dialysis|rehabilitation|psychiat|psycholog|mental|hospice|nursing|long_term|counselling/.test(h) ||
      NONACUTE_SPEC.test(s) || MENTAL_SPEC.test(s);
    if (disq) return [];
    const out: QwomeCategoryKey[] = ["hospital"];
    if ((t.emergency && t.emergency !== "no") || /emergency (room|dept|department|cent)/i.test(nm)) out.push("er");
    return out;
  }

  if (t.emergency === "department" || /freestanding (er|emergency)|emergency (room|department|cent)/i.test(nm)) return ["er"];
  return [];
}
