import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DashboardDeals, { type DashDeal, type DashStats } from "@/components/dash/DashboardDeals";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const money = (n: number | null): string =>
  n == null ? "" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function initials(name: string | null | undefined): string {
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

const fmtClose = (d: string | null): string | null =>
  d ? `Closes ${new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : null;

function daysOnMarket(listDate: string | null): string {
  if (!listDate) return "Active listing";
  const days = Math.max(0, Math.floor((Date.now() - new Date(`${listDate}T00:00:00`).getTime()) / 86400000));
  return `${days} day${days === 1 ? "" : "s"} on market`;
}

export default async function DashboardHome() {
  const supabase = createSupabaseServer();

  const [{ data: txns }, { data: lsts }] = await Promise.all([
    supabase
      .from("transactions")
      .select("id, address, city, state, zip, price, status, target_close_date, photo_url, clients(name), agents(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("listings")
      .select("id, address, city, state, zip, price, status, list_date, photo_url, clients(name), agents(name)")
      .order("created_at", { ascending: false }),
  ]);

  // milestones for progress on buyer deals
  const txnIds = (txns ?? []).map((t: any) => t.id);
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

  const cityLine = (c: string | null, s: string | null, z: string | null) =>
    [[c, s].filter(Boolean).join(", "), z].filter(Boolean).join(" ").trim();

  const deals: DashDeal[] = [];

  for (const t of (txns ?? []) as any[]) {
    const ms = msByTxn.get(t.id) ?? [];
    const total = ms.length;
    const done = ms.filter((m) => m.status === "done").length;
    const current = ms.find((m) => m.status !== "done");
    const clientName = t.clients?.name ?? null;
    const agentName = t.agents?.name ?? null;
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
      priceText: money(t.price),
      metaText: fmtClose(t.target_close_date ?? null) ?? "",
      clientName,
      clientInitials: initials(clientName),
      agentName,
      agentInitials: initials(agentName),
      progressPct: total ? Math.round((done / total) * 100) : null,
      stageText: current?.label ?? (total ? "Closed" : null),
      stageCount: total ? `${done} of ${total}` : null,
    });
  }

  for (const l of (lsts ?? []) as any[]) {
    const clientName = l.clients?.name ?? null;
    const agentName = l.agents?.name ?? null;
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
      priceText: money(l.price),
      metaText: daysOnMarket(l.list_date ?? null),
      clientName,
      clientInitials: initials(clientName),
      agentName,
      agentInitials: initials(agentName),
      progressPct: null,
      stageText: null,
      stageCount: null,
    });
  }

  const under = deals.filter((d) => d.statusKind === "under");
  const active = deals.filter((d) => d.statusKind === "active");
  const volume = [...under, ...active].reduce((s, d) => s + 0, 0); // volume computed below from raw prices
  const rawVol = [
    ...((txns ?? []) as any[]).filter((t) => txnKind(t.status) === "under").map((t) => t.price ?? 0),
    ...((lsts ?? []) as any[]).filter((l) => listingKind(l.status) === "active").map((l) => l.price ?? 0),
  ].reduce((s, n) => s + n, 0);
  const nextCloseTxn = ((txns ?? []) as any[])
    .filter((t) => txnKind(t.status) === "under" && t.target_close_date)
    .sort((a, b) => String(a.target_close_date).localeCompare(String(b.target_close_date)))[0];

  const stats: DashStats = {
    under: under.length,
    active: active.length,
    volumeText:
      rawVol >= 1_000_000
        ? `$${(rawVol / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`
        : money(rawVol) || "$0",
    nextCloseText: nextCloseTxn
      ? new Date(`${nextCloseTxn.target_close_date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "...",
    nextCloseAddr: nextCloseTxn?.address ?? "No closings scheduled",
  };

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <DashboardDeals deals={deals} stats={stats} />
      </div>
    </main>
  );
}
