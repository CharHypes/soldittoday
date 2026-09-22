import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import ListingWorkspace from "@/components/dash/ListingWorkspace";
import { createSupabaseServer } from "@/lib/supabase/server";
import { AI_ENABLED } from "@/lib/ai";

export const metadata: Metadata = {
  title: "Listing Workspace | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = "https://www.soldittoday.com";

export default async function ListingWorkspacePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: listing } = await supabase
    .from("listings")
    .select("*, clients(name,email,phone)")
    .eq("id", params.id)
    .maybeSingle();

  if (!listing) redirect("/dashboard");

  const [{ data: notes }, { data: snaps }, { data: docs }] = await Promise.all([
    supabase.from("notes").select("*").eq("listing_id", params.id).order("created_at", { ascending: false }),
    supabase.from("engagement_snapshots").select("*").eq("listing_id", params.id)
      .order("period_end", { ascending: false, nullsFirst: false }).order("captured_at", { ascending: false }).limit(6),
    supabase.from("documents").select("id,name,created_at,uploaded_by,client_visible")
      .eq("listing_id", params.id).order("created_at", { ascending: false }),
  ]);

  const client = (listing.clients as { name?: string; email?: string; phone?: string } | null) ?? null;
  const portalUrl = `${SITE}/seller/${listing.portal_token}`;

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-dusty hover:text-pearl">&larr; Back to listings</a>
          <a href={portalUrl} target="_blank" rel="noreferrer" className="text-sm text-auroraMauve hover:text-pearl">
            Preview seller portal &rarr;
          </a>
        </div>

        <h1 className="text-2xl font-semibold text-pearl">{listing.address}</h1>

        <ListingWorkspace
          listing={listing}
          client={client}
          notes={notes ?? []}
          snapshots={snaps ?? []}
          documents={docs ?? []}
          portalUrl={portalUrl}
          aiEnabled={AI_ENABLED}
        />
      </div>
    </main>
  );
}
