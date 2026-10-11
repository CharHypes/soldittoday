import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DashboardDeals, { type DashStats } from "@/components/dash/DashboardDeals";
import { createSupabaseServer } from "@/lib/supabase/server";
import { loadDeals, money } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Dashboard | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const supabase = createSupabaseServer();
  // In-motion deals only: under-contract buyer transactions + active listings.
  // Leads and active buyers (no house yet) live on the Leads / Buyers tabs.
  const deals = await loadDeals(supabase, "all", ["under_contract"]);

  const under = deals.filter((d) => d.statusKind === "under");
  const active = deals.filter((d) => d.statusKind === "active");
  const rawVol = [...under, ...active].reduce((s, d) => s + (d.price || 0), 0);
  const nextCloseDeal = under
    .filter((d) => d.closeDateRaw)
    .sort((a, b) => String(a.closeDateRaw).localeCompare(String(b.closeDateRaw)))[0];

  const stats: DashStats = {
    under: under.length,
    active: active.length,
    volumeText: rawVol >= 1_000_000 ? `$${(rawVol / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M` : money(rawVol) || "$0",
    nextCloseText: nextCloseDeal?.closeDateRaw
      ? new Date(`${nextCloseDeal.closeDateRaw}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "...",
    nextCloseAddr: nextCloseDeal?.address ?? "No closings scheduled",
  };

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <DashboardDeals deals={deals} stats={stats} showTicker />
      </div>
    </main>
  );
}
