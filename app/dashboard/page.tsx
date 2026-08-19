import type { Metadata } from "next";
import DashHeader from "@/components/dash/DashHeader";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function money(n: number | null): string {
  if (n == null) return "";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function DashboardHome() {
  const supabase = createSupabaseServer();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, address, city, state, zip, price, status, mls_number")
    .order("created_at", { ascending: false });

  const rows = listings ?? [];

  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-pearl">My Listings</h1>
            <p className="mt-1 text-sm text-dusty">
              {rows.length} {rows.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <a href="/dashboard/listings/new" className="btn-aurora !px-5 !py-3">
            + Add Listing
          </a>
        </div>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-xl2 border border-dusty/15 bg-plum/40 p-10 text-center text-dusty">
            No listings yet. Add your first one to create its seller portal.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {rows.map((l) => (
              <a
                key={l.id}
                href={`/dashboard/listings/${l.id}`}
                className="aurora-ring block rounded-xl2 border border-dusty/15 bg-plum/50 p-6 transition-colors hover:border-auroraMauve/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-pearl">{l.address}</h2>
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
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
