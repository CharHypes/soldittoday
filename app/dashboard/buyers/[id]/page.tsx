import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DealWorkspace from "@/components/dash/DealWorkspace";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DOCS_ENABLED } from "@/lib/supabase/admin";
import { dealEmailAddress } from "@/lib/dealEmail";

export const metadata: Metadata = {
  title: "Deal | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = "https://www.soldittoday.com";

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
  let agentName: string | null = null;
  if (tx.agent_id) {
    const { data: a } = await supabase.from("agents").select("name").eq("id", tx.agent_id).maybeSingle();
    agentName = a?.name ?? null;
  }

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <a href="/dashboard/buyers" className="mb-4 inline-block text-sm text-dusty hover:text-pearl">&larr; Back to buyers</a>
        <DealWorkspace
          tx={{
            id: tx.id, address: tx.address, city: tx.city, state: tx.state, zip: tx.zip,
            price: tx.price, status: tx.status, pipeline_stage: tx.pipeline_stage,
            target_close_date: tx.target_close_date, mls_number: tx.mls_number,
            photo_url: tx.photo_url, email_token: tx.email_token,
          }}
          buyerName={buyerName}
          agentName={agentName}
          portalUrl={`${SITE}/buyer/${tx.portal_token}`}
          dealEmail={tx.email_token ? dealEmailAddress(tx.email_token) : null}
          keyContacts={keyContacts}
          milestones={(milestones ?? []).map((m) => ({ id: m.id, label: m.label, sort_order: m.sort_order, status: m.status, date: m.date }))}
          documents={(documents ?? []).map((d) => ({ id: d.id, name: d.name, uploaded_by: d.uploaded_by, client_visible: d.client_visible, created_at: d.created_at }))}
          notes={(notes ?? []).map((n) => ({ id: n.id, body: n.body, from_client: n.from_client, client_visible: n.client_visible, created_at: n.created_at }))}
          docsEnabled={DOCS_ENABLED}
        />
      </div>
    </main>
  );
}
