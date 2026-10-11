import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DashboardDeals, { type FilterDef } from "@/components/dash/DashboardDeals";
import AddBuyerButton from "@/components/dash/AddBuyerButton";
import { createSupabaseServer } from "@/lib/supabase/server";
import { loadDeals } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Buyers | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const BUYER_FILTERS: FilterDef[] = [
  { label: "In progress", kinds: ["under"] },
  { label: "Closed", kinds: ["closed"] },
  { label: "All", kinds: ["under", "closed", "other"] },
];

export default async function BuyersHome() {
  const supabase = createSupabaseServer();
  const deals = await loadDeals(supabase, "transactions", ["buyer", "under_contract", "closed"]);
  const inProgress = deals.filter((d) => d.statusKind === "under").length;

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <DashboardDeals
          deals={deals}
          title="Buyers"
          subtitle={`${inProgress} ${inProgress === 1 ? "buyer" : "buyers"} in progress`}
          actionSlot={<AddBuyerButton />}
          filters={BUYER_FILTERS}
        />
      </div>
    </main>
  );
}
