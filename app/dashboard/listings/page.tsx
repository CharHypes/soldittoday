import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DashboardDeals, { type FilterDef } from "@/components/dash/DashboardDeals";
import AddListingButton from "@/components/dash/AddListingButton";
import { createSupabaseServer } from "@/lib/supabase/server";
import { loadDeals } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Listings | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const LISTING_FILTERS: FilterDef[] = [
  { label: "Active", kinds: ["active"] },
  { label: "Closed", kinds: ["closed"] },
  { label: "All", kinds: ["active", "closed", "other"] },
];

export default async function ListingsIndex() {
  const supabase = createSupabaseServer();
  const deals = await loadDeals(supabase, "listings");
  const activeCount = deals.filter((d) => d.statusKind === "active").length;

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <div className="mb-5 flex items-center justify-end">
          <AddListingButton />
        </div>
        <DashboardDeals
          deals={deals}
          title="Listings"
          subtitle={`${activeCount} active ${activeCount === 1 ? "listing" : "listings"}`}
          action={{ href: "/dashboard/listings/import", label: "+ From MLS" }}
          filters={LISTING_FILTERS}
        />
      </div>
    </main>
  );
}
