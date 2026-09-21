/**
 * Shared helpers + types for the Agent Hub CRM (contacts / people).
 * Presentation only ... access is enforced in the database (RLS). See the
 * `people`, `person_relationships`, `transaction_people` tables.
 */

export type Person = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  display_name: string | null;
  type: string;
  sort_key?: string | null;
  email?: string | null;
  phone?: string | null;
  birthday?: string | null;
  marital_status?: string | null;
  lead_source?: string | null;
  referred_by_person_id?: string | null;
};

const s = (v: string | null | undefined) => (v ?? "").trim();

/** The name we show: explicit display name, else First Last, else company. */
export function fullName(p: Pick<Person, "first_name" | "last_name" | "company" | "display_name">): string {
  return (
    s(p.display_name) ||
    [s(p.first_name), s(p.last_name)].filter(Boolean).join(" ") ||
    s(p.company) ||
    "Unnamed contact"
  );
}

/** "Last, First" for the list; falls back to the display name. */
export function lastFirst(p: Pick<Person, "first_name" | "last_name" | "company" | "display_name">): string {
  const ln = s(p.last_name);
  const fn = s(p.first_name);
  if (ln && fn) return `${ln}, ${fn}`;
  if (ln) return ln;
  return fullName(p);
}

/** Up to two initials for the avatar. */
export function initials(p: Pick<Person, "first_name" | "last_name" | "company" | "display_name">): string {
  const fn = s(p.first_name);
  const ln = s(p.last_name);
  if (fn || ln) return `${fn.slice(0, 1)}${ln.slice(0, 1)}`.toUpperCase() || "?";
  const c = s(p.company) || s(p.display_name) || "?";
  return c.slice(0, 2).toUpperCase();
}

export const TYPE_LABEL: Record<string, string> = {
  buyer: "Buyer",
  seller: "Seller",
  both: "Buyer & Seller",
  past_client: "Past client",
  lead: "Lead",
  investor: "Investor",
  renter: "Renter",
};
export const typeLabel = (t: string | null | undefined): string => (t ? TYPE_LABEL[t] ?? t : "");

export const ROLE_LABEL: Record<string, string> = {
  buyer: "Buyer side",
  seller: "Seller side",
  co_buyer: "Co-buyer",
  co_seller: "Co-seller",
  other: "",
};

export const RELATION_LABEL: Record<string, string> = {
  spouse: "Spouse",
  partner: "Partner",
  co_buyer: "Co-buyer",
  co_seller: "Co-seller",
  family: "Family",
  assistant: "Assistant",
  attorney: "Attorney",
  lender: "Lender",
  other: "Related",
};

/** Always show phone as (734) 555-1234 when we can. */
export function formatPhone(v: string | null | undefined): string | null {
  const raw = s(v);
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d[0] === "1") return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return raw;
}
/** E.164-ish for tel:/sms: links. */
export function telHref(v: string | null | undefined): string | null {
  const d = s(v).replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d[0] === "1") return `+${d}`;
  return d ? d : null;
}

/** Birthday without the year: "September 27". */
export function formatBirthday(v: string | null | undefined): string | null {
  const raw = s(v);
  if (!raw) return null;
  const d = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export const MARITAL_LABEL: Record<string, string> = {
  single: "Single",
  married: "Married",
  partnered: "Partnered",
  divorced: "Divorced",
  widowed: "Widowed",
  prefer_not_to_say: "Prefer not to say",
};
