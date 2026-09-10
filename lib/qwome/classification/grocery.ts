/**
 * QWOME™ grocery classification.
 *
 * Grocery is a family of user-selectable layers (never inferred):
 *   grocery            General / conventional supermarkets (the default)
 *   grocery_any        Any full-service grocery (conventional + international)
 *   grocery_warehouse  Membership warehouse clubs (Costco / Sam's / BJ's)
 *   grocery_organic    Organic / natural / specialty grocers
 *   grocery_<intl>     International & specialty markets, by name
 *
 * Convenience stores, gas marts, party/liquor/dollar stores, pharmacies,
 * food-service bulk, and limited-selection shops never qualify as full-service
 * grocery. Returns every grocery category the place belongs to.
 */
import type { QwomeCategoryKey } from "../engine";
import type { ClassifiablePlace } from "./types";

// Names that are NOT a full-service weekly-grocery supermarket even when OSM
// tags them shop=supermarket.
const NON_SUPERMARKET = /\b(dollar (general|tree)|family dollar|dollar\b|target|costco|sam.s club|bj.s wholesale|wholesale club|warehouse club|gordon food|gfs|bulk barn|liquor|party store|convenience|smoke shop|vape|marathon|speedway|\bbp\b|shell|mobil|sunoco|citgo|7-eleven|circle k|quik|quick stop|corner (store|market)|cvs|walgreens|rite aid|pharmacy|greenhouse|farm stand|butcher|bakery|meat market|spice|candy|nutrition|vitamin)\b/i;
// Department-store rows qualify only as full-grocery supercenters.
const SUPERCENTER = /meijer|walmart supercent/i;

// International / specialty market name patterns.
const GP = {
  chinese: /\b(chinese|china|hong ?kong|canton|szechuan|sichuan|shanghai|great wall|dynasty|tai pan|888)\b/i,
  korean: /\b(korean|korea|h-?mart|seoul|hankook|arirang|zion market)\b/i,
  japanese: /\b(japanese|japan|nijiya|mitsuwa|tokyo|sakura|maruwa|one world market)\b/i,
  south_asian: /\b(indian|india|patel|desi|south asian|bombay|mumbai|punjab|pakistan|bangladesh|apna|namaste|swad|sabzi|india ?bazaar)\b/i,
  mideast: /\b(middle eastern|arab|arabic|lebanese|persian|iranian|mediterranean market|greenland|shatila|arabian|mid.?east|baladi|sahara|damascus|aladdin|jerusalem|zam ?zam|al[- ](?:noor|salam|huda|rashid))\b/i,
  halal: /\bhalal|zabiha\b/i,
  latin: /\b(mexican|mexico|latino?|latin|carniceria|supermercado|mercado|hispanic|el rancho|michoacana|tapatia|guadalajara|el paisano|la mich|fiesta|azteca)\b/i,
  african_caribbean: /\b(african|caribbean|jamaican|nigeria|ghana|west indian|tropical (market|foods)|afro)\b/i,
  kosher: /\b(kosher|glatt|jewish)\b/i,
};
const asianAny = (n: string) =>
  /\b(asian|oriental|viet|vietnam|thai|filipino|pinoy|manila|indo(nesia)?|malaysia|hmong|lao|cambod|pan.?asian|mongolian)\b/i.test(n) ||
  GP.chinese.test(n) || GP.korean.test(n) || GP.japanese.test(n);
const anyIntl = (n: string) =>
  asianAny(n) || GP.south_asian.test(n) || GP.mideast.test(n) || GP.halal.test(n) ||
  GP.latin.test(n) || GP.african_caribbean.test(n) || GP.kosher.test(n);
const WAREHOUSE = /\b(costco|sam.s club|bj.s wholesale|bj.s club|bj.s)\b/i;
const ORGANIC = /\b(whole foods|trader joe|sprouts|fresh thyme|natural groc|earth ?fare|plum market|health food|co-?op|the fresh market|mom.s organic|better health|nino salvaggio|natural food|earthfare|market district)\b/i;

const isDisused = (t: Record<string, string>) =>
  Object.keys(t).some((k) => /^(disused|abandoned|razed|demolished|was):/.test(k)) || t.disused === "yes";

export function classifyGrocery(place: ClassifiablePlace): QwomeCategoryKey[] {
  const t = place.tags;
  if (isDisused(t)) return [];
  const nm = place.name || "";
  const out: QwomeCategoryKey[] = [];

  // Warehouse clubs (often tagged shop=wholesale, outside the supermarket set).
  if (WAREHOUSE.test(nm)) out.push("grocery_warehouse");

  const shop = (t.shop || "").toLowerCase();
  const fullService =
    shop === "supermarket" ? !NON_SUPERMARKET.test(nm)
    : shop === "department_store" ? SUPERCENTER.test(nm)
    : false;

  if (fullService) {
    out.push("grocery_any");
    if (!anyIntl(nm) && !ORGANIC.test(nm)) out.push("grocery");
    if (ORGANIC.test(nm)) out.push("grocery_organic");
    if (asianAny(nm)) out.push("grocery_asian");
    if (GP.chinese.test(nm)) out.push("grocery_chinese");
    if (GP.korean.test(nm)) out.push("grocery_korean");
    if (GP.japanese.test(nm)) out.push("grocery_japanese");
    if (GP.south_asian.test(nm)) out.push("grocery_south_asian");
    if (GP.mideast.test(nm)) out.push("grocery_mideast");
    if (GP.halal.test(nm)) out.push("grocery_halal");
    if (GP.latin.test(nm)) out.push("grocery_latin");
    if (GP.african_caribbean.test(nm)) out.push("grocery_african_caribbean");
    if (GP.kosher.test(nm)) out.push("grocery_kosher");
  }
  return out;
}
