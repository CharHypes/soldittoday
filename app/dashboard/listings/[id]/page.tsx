import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import ListingWorkspace from "@/components/dash/ListingWorkspace";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext, getAvatarStyle } from "@/lib/context";
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
const n = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const x = Number(v);
  return Number.isFinite(x) ? x : null;
};

export default async function ListingWorkspacePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: listing } = await supabase.from("listings").select("*").eq("id", params.id).maybeSingle();
  if (!listing) redirect("/dashboard");

  const [{ data: notes }, { data: snaps }, { data: docs }, { data: links }, { data: milestones }, { data: tasks }] = await Promise.all([
    supabase.from("notes").select("*").eq("listing_id", params.id).order("created_at", { ascending: false }),
    supabase.from("engagement_snapshots").select("*").eq("listing_id", params.id)
      .order("period_end", { ascending: false, nullsFirst: false }).order("captured_at", { ascending: false }).limit(6),
    supabase.from("documents").select("id,name,created_at,uploaded_by,client_visible")
      .eq("listing_id", params.id).order("created_at", { ascending: false }),
    supabase.from("listing_people").select("role, name_on_deal, person_id").eq("listing_id", params.id),
    supabase.from("milestones").select("id,label,sort_order,status,date").eq("listing_id", params.id).order("sort_order", { ascending: true }),
    supabase.from("tasks").select("id,title,due_date,assignee,done,done_at,created_at").eq("listing_id", params.id)
      .order("done", { ascending: true }).order("due_date", { ascending: true, nullsFirst: false }).order("created_at", { ascending: true }),
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
  const { role, agentId: meAgentId, orgId } = await getOrgContext(supabase);
  const isOwner = role === "owner" || role === "admin";
  const avatarStyle = await getAvatarStyle(supabase, orgId);
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
          milestones={(milestones ?? []).map((m) => ({ id: m.id, label: m.label, sort_order: m.sort_order, status: m.status, date: m.date }))}
          tasks={(tasks ?? []).map((t) => ({ id: t.id, title: t.title, due_date: t.due_date, assignee: t.assignee, done: t.done, done_at: t.done_at, created_at: t.created_at }))}
          fileNeeds={normalizeFileNeeds(listing.file_needs)}
          docsEnabled={DOCS_ENABLED}
          avatarStyle={avatarStyle}
          commission={
            // Owner-only: never serialize commission figures to a non-owner's page.
            isOwner
              ? {
                  sale_price: n(listing.commission_sale_price ?? listing.price),
                  rate: n(listing.commission_rate),
                  flat: n(listing.commission_flat),
                  referral_pct: n(listing.referral_pct),
                  referral_to: listing.referral_to ?? null,
                  sit_fee: n(listing.sit_fee),
                  splits: Array.isArray(listing.commission_splits)
                    ? listing.commission_splits.map((s: any) => ({ name: String(s?.name ?? ""), pct: Number(s?.pct) || 0 }))
                    : null,
                  notes: listing.commission_notes ?? null,
                }
              : { sale_price: null, rate: null, flat: null, referral_pct: null, referral_to: null, sit_fee: null, splits: null, notes: null }
          }
          portalUrl={`${SITE}/seller/${listing.portal_token}`}
          listingEmail={listing.email_token ? dealEmailAddress(listing.email_token) : null}
          aiEnabled={AI_ENABLED}
        />
      </div>
    </main>
  );
}
