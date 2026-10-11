import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import { createSupabaseServer } from "@/lib/supabase/server";
import { searchListings, AGENT_ID } from "@/lib/idx";
import { importMlsListing } from "@/app/dashboard/actions";
import { money } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Import from MLS | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = { active: "Active", pending: "Pending", sold: "Sold" };

export default async function ImportListings() {
  const supabase = createSupabaseServer();
  const result = await searchListings({ agentId: AGENT_ID });
  const mine = result.listings;

  const { data: existing } = await supabase.from("listings").select("mls_number").not("mls_number", "is", null);
  const have = new Set((existing ?? []).map((e: any) => String(e.mls_number)));

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-medium text-pearl">Import from the MLS</h1>
            <p className="mt-1 text-sm text-dusty">Your own listings, pulled live from the MLS. Import one and it keeps the photo, price, and details in sync.</p>
          </div>
          <a href="/dashboard/listings" className="text-sm text-dusty hover:text-pearl">&larr; Back to listings</a>
        </div>

        {!result.enabled ? (
          <div className="mt-8 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
            The MLS feed isn&apos;t connected yet.
          </div>
        ) : mine.length === 0 ? (
          <div className="mt-8 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
            No active MLS listings found under your agent ID right now.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((m) => {
              const added = have.has(m.mlsNumber);
              return (
                <div key={m.id} className="overflow-hidden rounded-[18px] border border-dusty/12 bg-bruised shadow-sm">
                  <div className="relative h-[170px] overflow-hidden bg-raise">
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photoUrl} alt={m.address} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-dusty/50 text-xs">No photo</div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-[#2f9e6e] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white">
                      {STATUS_LABEL[m.status] ?? m.status}
                    </span>
                    {added && (
                      <span className="absolute right-3 top-3 rounded-full bg-plum/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-pearl backdrop-blur">Added</span>
                    )}
                  </div>
                  <div className="p-[16px_18px_18px]">
                    <h3 className="font-serif text-lg font-medium text-pearl">{m.address}</h3>
                    <div className="text-[13px] text-dusty">{[m.city, m.state].filter(Boolean).join(", ")} {m.zip}</div>
                    <div className="mt-2 flex items-center gap-2 text-[13px]">
                      <span className="font-bold text-pearl">{money(m.price)}</span>
                      <span className="text-dusty">·</span>
                      <span className="text-dusty">{[m.beds != null ? `${m.beds} bd` : null, m.baths != null ? `${m.baths} ba` : null, m.sqft != null ? `${m.sqft.toLocaleString()} sqft` : null].filter(Boolean).join(" · ")}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-dusty/60">MLS# {m.mlsNumber}</p>
                    <form action={importMlsListing} className="mt-3">
                      <input type="hidden" name="mls_number" value={m.mlsNumber} />
                      <button type="submit" className={added ? "w-full rounded-lg border border-dusty/25 px-3 py-1.5 text-sm text-dusty hover:text-pearl" : "btn-mauve w-full justify-center text-sm"}>
                        {added ? "Update from MLS" : "Import this listing"}
                      </button>
                    </form>
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
