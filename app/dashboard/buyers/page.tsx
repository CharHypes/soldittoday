import type { Metadata } from "next";
import DashHeader from "@/components/dash/DashHeader";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Buyers | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function money(n: number | null): string {
  if (n == null) return "";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function BuyersHome() {
  const supabase = createSupabaseServer();
  const { data: txns } = await supabase
    .from("transactions")
    .select("id, address, city, state, zip, price, status, target_close_date, clients(name)")
    .order("created_at", { ascending: false });

  const rows = txns ?? [];

  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-pearl">Buyers</h1>
            <p className="mt-1 text-sm text-dusty">
              {rows.length} {rows.length === 1 ? "buyer" : "buyers"} in progress
            </p>
          </div>
          <a href="/dashboard/buyers/new" className="btn-aurora !px-5 !py-3">
            + Add Buyer
          </a>
        </div>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-xl2 border border-dusty/15 bg-plum/40 p-10 text-center text-dusty">
            No buyers yet. Add one to start their closing tracker and share a private portal.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {rows.map((t) => {
              const client = t.clients as { name?: string } | null;
              return (
                <a
                  key={t.id}
                  href={`/dashboard/buyers/${t.id}`}
                  className="aurora-ring block rounded-xl2 border border-dusty/15 bg-plum/50 p-6 transition-colors hover:border-auroraMauve/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {client?.name && <p className="text-sm text-auroraMauve">{client.name}</p>}
                      <h2 className="mt-0.5 text-lg font-semibold text-pearl">{t.address}</h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-wine/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl">
                      {t.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dusty">
                    {[t.city, t.state].filter(Boolean).join(", ")} {t.zip ?? ""}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-pearl">{money(t.price)}</span>
                    {t.target_close_date && (
                      <span className="text-xs text-dusty/70">
                        Close: {new Date(t.target_close_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
