import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import ListingWorkspace from "@/components/dash/ListingWorkspace";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";
import { dealEmailAddress } from "@/lib/dealEmail";
import { normalizeFileNeeds } from "@/lib/dealChecklist";
import { DOCS_ENABLED } from "@/lib/supabase/admin";
import { AI_ENABLED } from "@/lib/ai";

export const metadata: Metadata = {
  title: "Listing Workspace | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = "https://www.soldittoday.com";

export default async function ListingWorkspacePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: listing } = await supabase.from("listings").select("*").eq("id", params.id).maybeSingle();
  if (!listing) redirect("/dashboard");

  const [{ data: notes }, { data: snaps }, { data: docs }, { data: links }] = await Promise.all([
    supabase.from("notes").select("*").eq("listing_id", params.id).order("created_at", { ascending: false }),
    supabase.from("engagement_snapshots").select("*").eq("listing_id", params.id)
      .order("period_end", { ascending: false, nullsFirst: false }).order("captured_at", { ascending: false }).limit(6),
    supabase.from("documents").select("id,name,created_at,uploaded_by,client_visible")
      .eq("listing_id", params.id).order("created_at", { ascending: false }),
    supabase.from("listing_people").select("role, name_on_deal, person_id").eq("listing_id", params.id),
  ]);

  // Key contacts: resolve the linked people records (same shape as the buyer workspace).
  const personIds = (links ?? []).map((l) => l.person_id).filter(Boolean) as string[];
  let peopleById = new Map<string, any>();
  if (personIds.length) {
    const { data: ppl } = await supabase
      .from("people")
      .select("id, display_name, first_name, last_name, company, email, phone, address")
      .in("id", personIds);
    peopleById = new Map((ppl ?? []).map((p) => [p.id, p]));
  }
  const keyContacts = (links ?? []).map((l) => {
    const p = l.person_id ? peopleById.get(l.person_id) : null;
    const name = l.name_on_deal || p?.display_name || [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Contact";
    return {
      role: l.role || "seller",
      name,
      company: p?.company ?? null,
      email: p?.email ?? null,
      phone: p?.phone ?? null,
      address: p?.address ?? null,
      personId: l.person_id ?? null,
    };
  });

  // Seller name (linked client) + agent-on-file + the viewing owner.
  let sellerName: string | null = null;
  if (listing.client_id) {
    const { data: c } = await supabase.from("clients").select("name").eq("id", listing.client_id).maybeSingle();
    sellerName = c?.name ?? null;
  }
  const { role, agentId: meAgentId } = await getOrgContext(supabase);
  const isOwner = role === "owner" || role === "admin";
  const nameIds = Array.from(new Set([listing.agent_id, meAgentId].filter(Boolean))) as string[];
  const agentNames = new Map<string, string>();
  if (nameIds.length) {
    const { data: ags } = await supabase.from("agents").select("id, name").in("id", nameIds);
    (ags ?? []).forEach((a) => agentNames.set(a.id, a.name));
  }
  const agentName = listing.agent_id ? agentNames.get(listing.agent_id) ?? null : null;
  const ownerName = meAgentId ? agentNames.get(meAgentId) ?? null : null;

  return (
    <main className="deal-page">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <ListingWorkspace
          listing={{
            id: listing.id, address: listing.address, city: listing.city, state: listing.state, zip: listing.zip,
            price: listing.price, beds: listing.beds, baths: listing.baths, sqft: listing.sqft,
            status: listing.status, list_date: listing.list_date, mls_number: listing.mls_number,
            photo_url: listing.photo_url, email_token: listing.email_token, created_at: listing.created_at ?? null,
          }}
          sellerName={sellerName}
          agentName={agentName}
          ownerName={ownerName}
          isOwner={isOwner}
          keyContacts={keyContacts}
          notes={(notes ?? []).map((n) => ({ id: n.id, body: n.body, client_visible: n.client_visible, created_at: n.created_at }))}
          snapshots={snaps ?? []}
          documents={docs ?? []}
          fileNeeds={normalizeFileNeeds(listing.file_needs)}
          docsEnabled={DOCS_ENABLED}
          portalUrl={`${SITE}/seller/${listing.portal_token}`}
          listingEmail={listing.email_token ? dealEmailAddress(listing.email_token) : null}
          aiEnabled={AI_ENABLED}
        />
      </div>
    </main>
  );
}
