import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DealWorkspace from "@/components/dash/DealWorkspace";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";
import { DOCS_ENABLED } from "@/lib/supabase/admin";
import { dealEmailAddress } from "@/lib/dealEmail";

export const metadata: Metadata = {
  title: "Deal | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = "https://www.soldittoday.com";
const n = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const x = Number(v);
  return Number.isFinite(x) ? x : null;
};

export default async function DealPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: tx } = await supabase.from("transactions").select("*").eq("id", params.id).maybeSingle();
  if (!tx) redirect("/dashboard/buyers");

  const [{ data: milestones }, { data: notes }, { data: documents }, { data: links }] = await Promise.all([
    supabase.from("milestones").select("*").eq("transaction_id", params.id).order("sort_order", { ascending: true }),
    supabase.from("notes").select("*").eq("transaction_id", params.id).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("transaction_id", params.id).order("created_at", { ascending: false }),
    supabase.from("transaction_people").select("role, name_on_deal, person_id").eq("transaction_id", params.id),
  ]);

  // Key contacts: resolve the linked people records.
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
      role: l.role || "Contact",
      name,
      company: p?.company ?? null,
      email: p?.email ?? null,
      phone: p?.phone ?? null,
      address: p?.address ?? null,
      personId: l.person_id ?? null,
    };
  });

  // Buyer name + agent name.
  let buyerName: string | null = null;
  if (tx.client_id) {
    const { data: c } = await supabase.from("clients").select("name").eq("id", tx.client_id).maybeSingle();
    buyerName = c?.name ?? null;
  }
  const { role, agentId: meAgentId } = await getOrgContext(supabase);
  const isOwner = role === "owner" || role === "admin";

  // Resolve agent-on-file + the viewing owner's name in one lookup.
  const nameIds = Array.from(new Set([tx.agent_id, meAgentId].filter(Boolean))) as string[];
  const agentNames = new Map<string, string>();
  if (nameIds.length) {
    const { data: ags } = await supabase.from("agents").select("id, name").in("id", nameIds);
    (ags ?? []).forEach((a) => agentNames.set(a.id, a.name));
  }
  const agentName = tx.agent_id ? agentNames.get(tx.agent_id) ?? null : null;
  const ownerName = meAgentId ? agentNames.get(meAgentId) ?? null : null;

  const buyerPersonId =
    keyContacts.find((c) => /(^|_)buyer$/i.test(c.role) && !/co/i.test(c.role))?.personId ??
    keyContacts.find((c) => /buyer/i.test(c.role))?.personId ?? null;

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <DealWorkspace
          tx={{
            id: tx.id, address: tx.address, city: tx.city, state: tx.state, zip: tx.zip,
            price: tx.price, status: tx.status, pipeline_stage: tx.pipeline_stage,
            target_close_date: tx.target_close_date, mls_number: tx.mls_number,
            photo_url: tx.photo_url, email_token: tx.email_token,
            acceptance_date: tx.acceptance_date, emd_amount: tx.emd_amount, emd_held_by: tx.emd_held_by,
            deal_type: tx.deal_type, office: tx.office, year_built: tx.year_built, seller_name: tx.seller_name,
            waiting_on: tx.waiting_on, referred_by: tx.referred_by, lead_source: tx.lead_source, skyslope_email: tx.skyslope_email,
            dpa_program: tx.dpa_program, dpa_amount: tx.dpa_amount,
          }}
          buyerName={buyerName}
          buyerPersonId={buyerPersonId}
          agentName={agentName}
          ownerName={ownerName}
          portalUrl={`${SITE}/buyer/${tx.portal_token}`}
          dealEmail={tx.email_token ? dealEmailAddress(tx.email_token) : null}
          keyContacts={keyContacts}
          milestones={(milestones ?? []).map((m) => ({ id: m.id, label: m.label, sort_order: m.sort_order, status: m.status, date: m.date }))}
          documents={(documents ?? []).map((d) => ({ id: d.id, name: d.name, uploaded_by: d.uploaded_by, client_visible: d.client_visible, created_at: d.created_at }))}
          notes={(notes ?? []).map((n) => ({ id: n.id, body: n.body, from_client: n.from_client, client_visible: n.client_visible, created_at: n.created_at }))}
          docsEnabled={DOCS_ENABLED}
          isOwner={isOwner}
          commission={
            // Owner-only: never serialize commission figures to a non-owner's page.
            isOwner
              ? {
                  sale_price: n(tx.commission_sale_price ?? tx.price),
                  rate: n(tx.commission_rate),
                  flat: n(tx.commission_flat),
                  referral_pct: n(tx.referral_pct),
                  referral_to: tx.referral_to ?? null,
                  sit_fee: n(tx.sit_fee),
                  splits: Array.isArray(tx.commission_splits)
                    ? tx.commission_splits.map((s: any) => ({ name: String(s?.name ?? ""), pct: Number(s?.pct) || 0 }))
                    : null,
                  notes: tx.commission_notes ?? null,
                }
              : { sale_price: null, rate: null, flat: null, referral_pct: null, referral_to: null, sit_fee: null, splits: null, notes: null }
          }
        />
      </div>
    </main>
  );
}
