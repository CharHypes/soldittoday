import type { Metadata } from "next";
import Link from "next/link";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import { createSupabaseServer } from "@/lib/supabase/server";
import { moveStage } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Leads | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const fmtDate = (s: string | null): string =>
  s ? new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export default async function LeadsHome() {
  const supabase = createSupabaseServer();

  const { data: leadRows } = await supabase
    .from("transactions")
    .select("id, client_id, lead_source, timeframe, created_at")
    .eq("pipeline_stage", "lead")
    .order("created_at", { ascending: false });
  const rows = (leadRows ?? []) as any[];

  // resolve client names + the linked contact (person) for deep-linking the card
  const clientIds = [...new Set(rows.map((r) => r.client_id).filter(Boolean))];
  const nameMap = new Map<string, string>();
  if (clientIds.length) {
    const { data } = await supabase.from("clients").select("id, name").in("id", clientIds);
    (data ?? []).forEach((c: any) => nameMap.set(c.id, c.name));
  }
  const ids = rows.map((r) => r.id);
  const personMap = new Map<string, string>();
  if (ids.length) {
    const { data } = await supabase.from("transaction_people").select("transaction_id, person_id").in("transaction_id", ids);
    (data ?? []).forEach((x: any) => {
      if (x.person_id && !personMap.has(x.transaction_id)) personMap.set(x.transaction_id, x.person_id);
    });
  }

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-pearl">Leads</h1>
            <p className="mt-1 text-sm text-dusty">
              {rows.length} {rows.length === 1 ? "lead" : "leads"} &middot; work them, then promote to buyer.
            </p>
          </div>
          <Link href="/dashboard/buyers/new" className="btn-mauve text-sm">+ Add buyer</Link>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-xl2 border border-dusty/15 bg-plum/40 p-10 text-center text-dusty">
            No leads yet. Add your first buyer to start the pipeline.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {rows.map((r) => {
              const name = nameMap.get(r.client_id) || "New lead";
              const pid = personMap.get(r.id);
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl2 border border-dusty/15 bg-plum/40 p-4">
                  <div>
                    <div className="text-[15px] font-semibold text-pearl">
                      {pid ? (
                        <Link href={`/dashboard/contacts?id=${pid}`} className="text-auroraMauve hover:underline">{name}</Link>
                      ) : (
                        name
                      )}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-wide text-dusty">
                      {r.lead_source || "Lead"}
                      {r.timeframe ? ` · ${r.timeframe}` : ""} · added {fmtDate(r.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={moveStage}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="stage" value="buyer" />
                      <button className="btn-outline text-xs">Mark pre-approved</button>
                    </form>
                    <form action={moveStage}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="stage" value="under_contract" />
                      <button className="btn-outline text-xs">Under contract</button>
                    </form>
                    <Link href={`/dashboard/buyers/${r.id}`} className="btn-mauve text-xs">Open</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
