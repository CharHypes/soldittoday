import type { SupabaseClient } from "@supabase/supabase-js";

export type DashDeal = {
  kind: "transaction" | "listing";
  id: string;
  href: string;
  photoUrl: string | null;
  address: string;
  cityLine: string;
  side: "Buyer side" | "Seller side";
  statusLabel: string;
  statusKind: "under" | "active" | "closed" | "other";
  price: number | null;
  priceText: string;
  metaText: string;
  closeDateRaw: string | null;
  clientName: string | null;
  clientInitials: string;
  clientPersonId: string | null;
  agentName: string | null;
  agentInitials: string;
  progressPct: number | null;
  stageText: string | null;
  stageCount: string | null;
};

export const money = (n: number | null): string =>
  n == null ? "" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function initials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function txnKind(status: string | null): DashDeal["statusKind"] {
  const s = (status ?? "").toLowerCase();
  if (/clos/.test(s)) return "closed";
  if (/cancel|withdraw|fell|expired|dead/.test(s)) return "other";
  return "under";
}
function listingKind(status: string | null): DashDeal["statusKind"] {
  const s = (status ?? "").toLowerCase();
  if (/clos|sold/.test(s)) return "closed";
  if (/expired|withdraw|cancel/.test(s)) return "other";
  return "active";
}

const fmtClose = (d: string | null): string =>
  d ? `Closes ${new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "";

function daysOnMarket(listDate: string | null): string {
  if (!listDate) return "Active listing";
  const days = Math.max(0, Math.floor((Date.now() - new Date(`${listDate}T00:00:00`).getTime()) / 86400000));
  return `${days} day${days === 1 ? "" : "s"} on market`;
}

const cityLine = (c: string | null, s: string | null, z: string | null) =>
  [[c, s].filter(Boolean).join(", "), z].filter(Boolean).join(" ").trim();

/** Load buyer transactions and/or seller listings as unified deal cards. */
export async function loadDeals(
  supabase: SupabaseClient,
  scope: "all" | "transactions" | "listings"
): Promise<DashDeal[]> {
  const wantTx = scope !== "listings";
  const wantLs = scope !== "transactions";

  const [txRes, lsRes] = await Promise.all([
    wantTx
      ? supabase.from("transactions").select("id, address, city, state, zip, price, status, target_close_date, photo_url, agent_id, client_id").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as any[] }),
    wantLs
      ? supabase.from("listings").select("id, address, city, state, zip, price, status, list_date, photo_url, agent_id, client_id").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as any[] }),
  ]);
  const txns = (txRes.data ?? []) as any[];
  const lsts = (lsRes.data ?? []) as any[];

  // resolve names by id (two FKs to clients/agents make embeds ambiguous)
  const rows = [...txns, ...lsts];
  const agentIds = [...new Set(rows.map((r) => r.agent_id).filter(Boolean))];
  const clientIds = [...new Set(rows.map((r) => r.client_id).filter(Boolean))];
  const agentMap = new Map<string, string>();
  const clientMap = new Map<string, string>();
  if (agentIds.length) {
    const { data } = await supabase.from("agents").select("id, name").in("id", agentIds);
    (data ?? []).forEach((a: any) => agentMap.set(a.id, a.name));
  }
  if (clientIds.length) {
    const { data } = await supabase.from("clients").select("id, name").in("id", clientIds);
    (data ?? []).forEach((c: any) => clientMap.set(c.id, c.name));
  }

  // the linked CONTACT (people) for each deal, so the client name links to their card
  const txnIdList = txns.map((t) => t.id);
  const lstIdList = lsts.map((l) => l.id);
  const txnPerson = new Map<string, string>();
  const lstPerson = new Map<string, string>();
  if (txnIdList.length) {
    const { data } = await supabase.from("transaction_people").select("transaction_id, person_id").in("transaction_id", txnIdList);
    (data ?? []).forEach((x: any) => {
      if (x.person_id && !txnPerson.has(x.transaction_id)) txnPerson.set(x.transaction_id, x.person_id);
    });
  }
  if (lstIdList.length) {
    const { data } = await supabase.from("listing_people").select("listing_id, person_id").in("listing_id", lstIdList);
    (data ?? []).forEach((x: any) => {
      if (x.person_id && !lstPerson.has(x.listing_id)) lstPerson.set(x.listing_id, x.person_id);
    });
  }

  const txnIds = txns.map((t) => t.id);
  const msByTxn = new Map<string, { label: string; status: string }[]>();
  if (txnIds.length) {
    const { data: ms } = await supabase
      .from("milestones")
      .select("transaction_id, label, status, sort_order")
      .in("transaction_id", txnIds)
      .order("sort_order", { ascending: true });
    (ms ?? []).forEach((m: any) => {
      const arr = msByTxn.get(m.transaction_id) ?? [];
      arr.push({ label: m.label, status: m.status });
      msByTxn.set(m.transaction_id, arr);
    });
  }

  const deals: DashDeal[] = [];

  for (const t of txns) {
    const ms = msByTxn.get(t.id) ?? [];
    const total = ms.length;
    const done = ms.filter((m) => m.status === "done").length;
    const current = ms.find((m) => m.status !== "done");
    const clientName = (t.client_id && clientMap.get(t.client_id)) || null;
    const agentName = (t.agent_id && agentMap.get(t.agent_id)) || null;
    deals.push({
      kind: "transaction",
      id: t.id,
      href: `/dashboard/buyers/${t.id}`,
      photoUrl: t.photo_url ?? null,
      address: t.address,
      cityLine: cityLine(t.city, t.state, t.zip),
      side: "Buyer side",
      statusLabel: t.status ?? "Under Contract",
      statusKind: txnKind(t.status),
      price: t.price ?? null,
      priceText: money(t.price),
      metaText: fmtClose(t.target_close_date ?? null),
      closeDateRaw: t.target_close_date ?? null,
      clientName,
      clientInitials: initials(clientName),
      clientPersonId: txnPerson.get(t.id) ?? null,
      agentName,
      agentInitials: initials(agentName),
      progressPct: total ? Math.round((done / total) * 100) : null,
      stageText: current?.label ?? (total ? "Closed" : null),
      stageCount: total ? `${done} of ${total}` : null,
    });
  }

  for (const l of lsts) {
    const clientName = (l.client_id && clientMap.get(l.client_id)) || null;
    const agentName = (l.agent_id && agentMap.get(l.agent_id)) || null;
    deals.push({
      kind: "listing",
      id: l.id,
      href: `/dashboard/listings/${l.id}`,
      photoUrl: l.photo_url ?? null,
      address: l.address,
      cityLine: cityLine(l.city, l.state, l.zip),
      side: "Seller side",
      statusLabel: l.status ?? "Active",
      statusKind: listingKind(l.status),
      price: l.price ?? null,
      priceText: money(l.price),
      metaText: daysOnMarket(l.list_date ?? null),
      closeDateRaw: null,
      clientName,
      clientInitials: initials(clientName),
      clientPersonId: lstPerson.get(l.id) ?? null,
      agentName,
      agentInitials: initials(agentName),
      progressPct: null,
      stageText: null,
      stageCount: null,
    });
  }

  return deals;
}
