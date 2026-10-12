// Canonical file-needs items for a buy-side deal. Shared by the Edit-transaction
// sheet (checkboxes) and the Checklist tab (status rows) so they stay in sync.
// Each item: [key, label, optional?]. Stored in transactions.file_needs as
// { docs: [checkedKey...], actions: [checkedKey...] }.

export type ChkItem = { key: string; label: string; optional?: boolean };

export const DOC_GROUPS: { title: string; items: ChkItem[] }[] = [
  {
    title: "Buyer agreement documentation",
    items: [{ key: "exclusive_buyers_agency", label: "Exclusive Buyers Agency" }],
  },
  {
    title: "Sales documentation",
    items: [
      { key: "purchase_agreement", label: "Purchase Agreement" },
      { key: "sellers_disclosure", label: "Seller's Disclosure" },
      { key: "lead_based_paint", label: "Lead-Based Paint Disclosure" },
      { key: "agency_disclosure", label: "Agency Disclosure" },
      { key: "emd_check", label: "Copy of EMD check" },
      { key: "mls_sheet", label: "MLS Sheet" },
      { key: "broker_to_broker", label: "Broker to Broker" },
      { key: "addendums", label: "Addendums", optional: true },
      { key: "home_warranty_waiver", label: "Home Warranty Waiver", optional: true },
    ],
  },
];

export const ACTION_ITEMS: ChkItem[] = [
  { key: "order_appraisal", label: "Order appraisal" },
  { key: "schedule_inspection", label: "Schedule inspection" },
  { key: "schedule_closing", label: "Schedule closing" },
  { key: "send_review_request", label: "Send review request", optional: true },
  { key: "thankyou_card", label: "Thank-you card sent", optional: true },
  { key: "add_homebot", label: "Add to Homebot", optional: true },
];

export const ALL_DOCS: ChkItem[] = DOC_GROUPS.flatMap((g) => g.items);
