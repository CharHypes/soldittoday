/**
 * QWOME™ category presentation ... Sold It Today's client-owned copy.
 *
 * PRESENTATION, not core. QWOME core (lib/qwome/preferences) defines the
 * semantic categories, their capabilities, and relationships; it deliberately
 * carries no labels, copy, or glyphs. This map is how ONE client (Sold It Today)
 * chooses to name and describe them. The standalone QWOME app, an embeddable
 * widget, or a partner integration each ship their own presentation map for the
 * same category ids, with zero change to core.
 *
 *   label      full name in the picker
 *   short      compact name for chips / tiles
 *   descriptor how the nearest result reads in prose (honest wording ... e.g.
 *              "nearest public elementary school in district", never "assigned")
 *   note       optional clarifying line under a selected option
 *
 * Icons live alongside in ./icons (also client-owned).
 */
import type { QwomeCategoryId } from "../preferences";

export type QwomePresentation = {
  label: string;
  short: string;
  descriptor?: string;
  note?: string;
};

const P: Record<QwomeCategoryId, QwomePresentation> = {
  // Healthcare
  hospital: { label: "Hospital", short: "Hospital", descriptor: "nearest acute-care hospital", note: "General acute-care hospitals only (excludes psychiatric, rehab, and specialty facilities)." },
  er: { label: "Emergency Room", short: "ER", descriptor: "nearest emergency room" },
  urgentcare: { label: "Urgent Care", short: "Urgent Care", descriptor: "nearest urgent care" },
  pharmacy: { label: "Pharmacy", short: "Pharmacy", descriptor: "nearest pharmacy" },
  behavioral: { label: "Behavioral / Psychiatric Care", short: "Behavioral", descriptor: "nearest behavioral / psychiatric care" },
  // Schools
  school_elem: { label: "Elementary School", short: "Elementary", descriptor: "nearest public elementary school in district", note: "Nearest public elementary school in the district (not boundary-assigned)." },
  school_mid: { label: "Middle School", short: "Middle", descriptor: "nearest public middle school in district", note: "Nearest public middle school in the district (not boundary-assigned)." },
  school_high: { label: "High School", short: "High School", descriptor: "nearest public high school in district", note: "Nearest public high school in the district (not boundary-assigned)." },
  // Grocery
  grocery: { label: "General Grocery / Supermarket", short: "Grocery", descriptor: "nearest supermarket", note: "Conventional full-service supermarkets and major/regional chains (Kroger, Meijer, Aldi, Walmart Supercenter, ...)." },
  grocery_any: { label: "Any Full-Service Grocery", short: "Full-Service", descriptor: "nearest full-service grocery", note: "Conventional supermarkets plus legitimate full-service international supermarkets." },
  grocery_warehouse: { label: "Warehouse Club", short: "Warehouse", descriptor: "nearest warehouse club", note: "Membership warehouse clubs (Costco, Sam's Club, BJ's)." },
  grocery_organic: { label: "Organic / Specialty Grocery", short: "Organic", descriptor: "nearest organic / specialty grocery", note: "Natural, organic, and specialty grocers (Whole Foods, Trader Joe's, Fresh Thyme, co-ops)." },
  grocery_asian: { label: "Asian Market", short: "Asian", descriptor: "nearest Asian market" },
  grocery_chinese: { label: "Chinese Market", short: "Chinese", descriptor: "nearest Chinese market" },
  grocery_korean: { label: "Korean Market", short: "Korean", descriptor: "nearest Korean market" },
  grocery_japanese: { label: "Japanese Market", short: "Japanese", descriptor: "nearest Japanese market" },
  grocery_south_asian: { label: "Indian / South Asian Market", short: "Indian", descriptor: "nearest Indian / South Asian market" },
  grocery_mideast: { label: "Middle Eastern / Arabic Market", short: "Middle Eastern", descriptor: "nearest Middle Eastern / Arabic market" },
  grocery_halal: { label: "Halal Market", short: "Halal", descriptor: "nearest halal market" },
  grocery_latin: { label: "Mexican / Latin American Market", short: "Latin", descriptor: "nearest Mexican / Latin American market" },
  grocery_african_caribbean: { label: "African / Caribbean Market", short: "African/Caribbean", descriptor: "nearest African / Caribbean market" },
  grocery_kosher: { label: "Kosher Market", short: "Kosher", descriptor: "nearest kosher market" },
  // Everyday
  dining: { label: "Restaurants / Coffee", short: "Dining" },
  shopping: { label: "Shopping", short: "Shopping" },
  gym: { label: "Gym / Fitness", short: "Gym" },
  parks: { label: "Parks / Dog Parks", short: "Parks" },
  transit: { label: "Public Transportation", short: "Transit" },
  airport: { label: "Airport", short: "Airport" },
  // People & places
  workplace: { label: "Workplace", short: "Workplace" },
  family: { label: "Family & Friends", short: "Family" },
  custom: { label: "Custom Location", short: "Custom" },
};

/** Display labels for expandable sub-sections (keyed by the core subgroup id). */
export const QWOME_SUBGROUP_LABELS: Record<string, string> = {
  international: "International & Specialty Markets",
};

/** Presentation for a category id, with a safe fallback to the id itself. */
export function qwomePresentation(id: QwomeCategoryId): QwomePresentation {
  return P[id] ?? { label: id, short: id };
}
