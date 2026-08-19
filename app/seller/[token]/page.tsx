import type { Metadata } from "next";
import { getSellerPortal } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Your Listing Update | Sold It Today",
  robots: { index: false, follow: false },
};

// Always render fresh (stats change); never statically cache a client portal.
export const dynamic = "force-dynamic";

function money(n: number | null): string {
  if (n == null) return "";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function longDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function NotAvailable() {
  return (
    <main className="grid min-h-screen place-items-center bg-plum px-6 text-center">
      <div>
        <p className="text-2xl font-semibold text-pearl">This portal is not available</p>
        <p className="mt-3 text-dusty">The link may have expired. Please contact your agent for an updated link.</p>
      </div>
    </main>
  );
}

export default async function SellerPortalPage({ params }: { params: { token: string } }) {
  const data = await getSellerPortal(params.token);
  if (!data) return <NotAvailable />;

  const { listing, agent, client, stats, notes } = data;
  const bySource = [...(stats?.by_source ?? [])].sort((a, b) => b.views - a.views);
  const byCity = [...(stats?.by_city ?? [])].sort((a, b) => b.views - a.views);
  const maxSource = Math.max(1, ...bySource.map((s) => s.views));
  const cityLine = [listing.city, listing.state].filter(Boolean).join(", ") + (listing.zip ? ` ${listing.zip}` : "");

  return (
    <main className="min-h-screen bg-mulberry-radial pb-20">
      {/* Brand bar */}
      <header className="border-b border-dusty/12 bg-plum/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-pearl">
            {agent.brand ?? "Sold It Today"}
          </span>
          <span className="text-xs text-dusty">Private listing update</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6">
        {/* Hero */}
        <section className="pt-12">
          {client.name && (
            <p className="text-sm uppercase tracking-[0.18em] text-auroraMauve">
              Prepared for {client.name}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl">
            {listing.address}
          </h1>
          <p className="mt-1 text-dusty">{cityLine}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-wine/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pearl">
              {listing.status}
            </span>
            {listing.price != null && (
              <span className="text-xl font-semibold text-pearl">{money(listing.price)}</span>
            )}
            {stats?.period_end && (
              <span className="text-xs text-dusty/80">Updated {longDate(stats.period_end)}</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-dusty">
            {listing.beds != null && <span><b className="text-pearl">{listing.beds}</b> Beds</span>}
            {listing.baths != null && <span><b className="text-pearl">{listing.baths}</b> Baths</span>}
            {listing.sqft != null && <span><b className="text-pearl">{listing.sqft.toLocaleString("en-US")}</b> Sq Ft</span>}
            {listing.mls_number && <span>MLS# <b className="text-pearl">{listing.mls_number}</b></span>}
            {listing.list_date && <span>Listed <b className="text-pearl">{longDate(listing.list_date)}</b></span>}
          </div>
        </section>

        {/* Stats */}
        {stats && (
          <section className="mt-10">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Online Views", value: stats.total_views },
                { label: "Shares", value: stats.shares },
                { label: "Favorites", value: stats.favorites },
              ].map((s) => (
                <div key={s.label} className="aurora-ring rounded-xl2 border border-auroraMauve/20 bg-plum/50 p-5 text-center">
                  <div className="text-3xl font-semibold text-pearl">{s.value.toLocaleString("en-US")}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-dusty">{s.label}</div>
                </div>
              ))}
            </div>

            {stats.returning_pct != null && (
              <div className="mt-4 rounded-xl border border-auroraMauve/20 bg-wine/25 px-4 py-3 text-sm text-pearl/90">
                <b>{stats.returning_pct}% of visitors are returning</b> to view your home again, and it is attracting more views than other listings in its ZIP code.
              </div>
            )}

            {/* Where buyers find it */}
            {bySource.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Where buyers find your home</h2>
                <div className="mt-4 space-y-2.5">
                  {bySource.map((s) => (
                    <div key={s.site} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-sm text-dusty">{s.site}</span>
                      <span className="h-2 rounded-full bg-gradient-to-r from-gold to-auroraMauve" style={{ width: `${Math.max(4, (s.views / maxSource) * 100)}%` }} />
                      <span className="text-sm text-pearl">{s.views.toLocaleString("en-US")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Where buyers search from */}
            {byCity.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Where buyers are searching from</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {byCity.map((c) => (
                    <span key={c.city} className="rounded-full border border-dusty/20 bg-plum/40 px-3 py-1.5 text-sm text-dusty">
                      {c.city} <b className="text-pearl">{c.views}</b>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Notes from agent */}
        {notes.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Notes from {agent.name.split(" ")[0]}</h2>
            <div className="mt-4 space-y-4">
              {notes.map((n, i) => (
                <div key={i} className="aurora-ring rounded-xl2 border border-dusty/15 bg-plum/50 p-6">
                  <p className="leading-relaxed text-pearl/90">{n.body}</p>
                  <p className="mt-3 text-xs text-dusty/70">{longDate(n.created_at)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="mt-12 rounded-xl2 border border-auroraMauve/20 bg-wine-sheen p-6 text-center shadow-aurora">
          <p className="text-pearl">Questions about your listing?</p>
          <p className="mt-1 text-lg font-semibold text-pearl">{agent.name}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-dusty">
            {agent.phone && <a href={`tel:${agent.phone.replace(/[^0-9]/g, "")}`} className="hover:text-pearl">{agent.phone}</a>}
            {agent.email && <a href={`mailto:${agent.email}`} className="hover:text-pearl">{agent.email}</a>}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-dusty/60">
          Private link, updated in real time. {agent.brand ?? "Sold It Today"}.
        </p>
      </div>
    </main>
  );
}
