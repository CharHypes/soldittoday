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

/** The predefined items visible for a transaction type at a given stage. */
export function visibleItems(type: "buyer" | "listing", stage: string | null): { docs: ChkItem[]; actions: ChkItem[] } {
  const all = type === "buyer" ? BUYER_ITEMS : BUYER_ITEMS; // listing set added with the Listings workspace
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
