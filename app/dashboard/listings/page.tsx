import type { Metadata } from "next";
import Link from "next/link";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Listings | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function money(n: number | null): string {
  if (n == null) return "";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function ListingsIndex() {
  const supabase = createSupabaseServer();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, address, city, state, zip, price, status, mls_number, photo_url")
    .order("created_at", { ascending: false });

  const rows = listings ?? [];

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium text-pearl">Listings</h1>
            <p className="mt-1 text-sm text-dusty">
              {rows.length} {rows.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <a href="/dashboard/listings/new" className="btn-mauve text-sm">+ Add Listing</a>
        </div>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
            No listings yet. Add your first one to create its seller portal.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((l) => (
              <Link
                key={l.id}
                href={`/dashboard/listings/${l.id}`}
                aria-label={`Open workspace for ${l.address}`}
                className="group block cursor-pointer overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised transition-colors hover:border-mauve/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/70"
              >
                {l.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.photo_url} alt={l.address} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-bruised text-xs text-dusty/60">No photo yet</div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-lg font-medium text-pearl">{l.address}</h2>
                    <span className="shrink-0 rounded-full bg-wine/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl">
                      {l.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dusty">
                    {[l.city, l.state].filter(Boolean).join(", ")} {l.zip ?? ""}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-semibold text-pearl">{money(l.price)}</span>
                    {l.mls_number && <span className="text-xs text-dusty/70">MLS# {l.mls_number}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
