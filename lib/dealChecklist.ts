// Stage-aware file-needs items. Shared by the Edit sheet (one box of checkboxes)
// and the Checklist tab (status rows). Stored in transactions.file_needs as
//   { docs: [checkedKey...], actions: [checkedKey...],
//     custom: [{ id, label, group, done }], waiting: [string...] }
// Items appear once the deal reaches their `from` stage (cumulative), so the
// list grows as the deal moves lead -> buyer -> under contract -> closed.

export type Stage = "lead" | "buyer" | "under_contract" | "closed" | "archived";
export type ChkGroup = "docs" | "actions";
export type ChkItem = { key: string; label: string; group: ChkGroup; from?: Stage; optional?: boolean };
export type CustomItem = { id: string; label: string; group: ChkGroup; done?: boolean };
export type FileNeeds = { docs: string[]; actions: string[]; custom: CustomItem[]; waiting: string[] };

const STAGE_ORDER: Stage[] = ["lead", "buyer", "under_contract", "closed", "archived"];
const idx = (s: string | null | undefined) => {
  const i = STAGE_ORDER.indexOf((s as Stage) ?? "under_contract");
  return i < 0 ? STAGE_ORDER.indexOf("under_contract") : i;
};

// ---- Buyer-side items ----
const BUYER_ITEMS: ChkItem[] = [
  // documents
  { key: "exclusive_buyers_agency", label: "Exclusive Buyers Agency", group: "docs", from: "lead" },
  { key: "agency_disclosure", label: "Agency Disclosure", group: "docs", from: "buyer" },
  { key: "mls_sheet", label: "MLS Sheet", group: "docs", from: "buyer" },
  { key: "purchase_agreement", label: "Purchase Agreement", group: "docs", from: "under_contract" },
  { key: "sellers_disclosure", label: "Seller's Disclosure", group: "docs", from: "under_contract" },
  { key: "lead_based_paint", label: "Lead-Based Paint Disclosure", group: "docs", from: "under_contract" },
  { key: "emd_check", label: "Copy of EMD check", group: "docs", from: "under_contract" },
  { key: "broker_to_broker", label: "Broker to Broker", group: "docs", from: "under_contract" },
  { key: "title_commitment", label: "Title Commitment", group: "docs", from: "under_contract" },
  { key: "wire_instructions", label: "Wire Instructions", group: "docs", from: "under_contract" },
  { key: "addendums", label: "Addendums", group: "docs", from: "under_contract", optional: true },
  { key: "home_warranty_waiver", label: "Home Warranty Waiver", group: "docs", from: "under_contract", optional: true },
  // follow-up / actions
  { key: "listing_alerts", label: "Set up listing alerts", group: "actions", from: "lead", optional: true },
  { key: "order_appraisal", label: "Order appraisal", group: "actions", from: "under_contract" },
  { key: "schedule_inspection", label: "Schedule inspection", group: "actions", from: "under_contract" },
  { key: "schedule_closing", label: "Schedule closing", group: "actions", from: "under_contract" },
  { key: "send_review_request", label: "Send review request", group: "actions", from: "closed", optional: true },
  { key: "thankyou_card", label: "Thank-you card sent", group: "actions", from: "closed", optional: true },
  { key: "add_home_actions", label: "Add to Home Actions", group: "actions", from: "closed" },
];

// ---- Seller / listing-side items ----
// Listings don't use the buyer STAGE_ORDER (their status is Active/Pending/Sold),
// so these carry no `from` and are all shown ... the agent checks what applies.
const LISTING_ITEMS: ChkItem[] = [
  // documents
  { key: "listing_agreement", label: "Listing Agreement", group: "docs" },
  { key: "agency_disclosure", label: "Agency Disclosure", group: "docs" },
  { key: "sellers_disclosure", label: "Seller's Disclosure", group: "docs" },
  { key: "lead_based_paint", label: "Lead-Based Paint Disclosure", group: "docs" },
  { key: "mls_input", label: "MLS Input Sheet", group: "docs" },
  { key: "cma_pricing", label: "CMA / Pricing worksheet", group: "docs", optional: true },
  { key: "plat_survey", label: "Plat / Survey", group: "docs", optional: true },
  { key: "hoa_docs", label: "HOA Documents", group: "docs", optional: true },
  { key: "purchase_agreement", label: "Purchase Agreement (offer)", group: "docs" },
  { key: "title_commitment", label: "Title Commitment", group: "docs", optional: true },
  { key: "wire_instructions", label: "Wire Instructions", group: "docs", optional: true },
  { key: "addendums", label: "Addendums", group: "docs", optional: true },
  // follow-up / actions
  { key: "enter_in_mls", label: "Enter listing in MLS", group: "actions" },
  { key: "schedule_photos", label: "Schedule photography", group: "actions" },
  { key: "install_sign", label: "Install yard sign", group: "actions" },
  { key: "place_lockbox", label: "Place lockbox", group: "actions" },
  { key: "open_house", label: "Schedule open house", group: "actions", optional: true },
  { key: "review_offers", label: "Review offers", group: "actions" },
  { key: "order_title", label: "Order title", group: "actions", optional: true },
  { key: "schedule_closing", label: "Schedule closing", group: "actions" },
  { key: "send_review_request", label: "Send review request", group: "actions", optional: true },
  { key: "thankyou_card", label: "Thank-you card sent", group: "actions", optional: true },
];

/** The predefined items visible for a transaction type at a given stage. */
export function visibleItems(type: "buyer" | "listing", stage: string | null): { docs: ChkItem[]; actions: ChkItem[] } {
  if (type === "listing") {
    return { docs: LISTING_ITEMS.filter((i) => i.group === "docs"), actions: LISTING_ITEMS.filter((i) => i.group === "actions") };
  }
  const all = BUYER_ITEMS;
  const show = all.filter((it) => idx(stage) >= idx(it.from));
  return { docs: show.filter((i) => i.group === "docs"), actions: show.filter((i) => i.group === "actions") };
}

/** Normalize whatever is stored (older rows may have no custom/waiting). */
export function normalizeFileNeeds(raw: any): FileNeeds {
  const r = raw && typeof raw === "object" ? raw : {};
  return {
    docs: Array.isArray(r.docs) ? r.docs : [],
    actions: Array.isArray(r.actions) ? r.actions : [],
    custom: Array.isArray(r.custom) ? r.custom.filter((c: any) => c && c.id && c.label) : [],
    waiting: Array.isArray(r.waiting) ? r.waiting.filter((w: any) => typeof w === "string" && w.trim()) : [],
  };
}
