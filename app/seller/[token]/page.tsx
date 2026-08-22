import type { Metadata } from "next";
import { getSellerPortal } from "@/lib/portal";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Your Listing Update | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function money(n: number | null): string {
  if (n == null) return "";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function longDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysOnMarket(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(1, Math.floor((Date.now() - d.getTime()) / 86_400_000));
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
  const maxSource = Math.max(1, ...(stats?.by_source ?? []).map((s) => s.views));
  const cityLine = [listing.city, listing.state].filter(Boolean).join(", ") + (listing.zip ? ` ${listing.zip}` : "");
  const firstName = client.name?.split(" ")[0] ?? null;
  const agentFirst = agent.name.split(" ")[0];
  const dom = daysOnMarket(listing.list_date);
  const phoneDigits = agent.phone?.replace(/[^0-9]/g, "") ?? "";

  return (
    <main className="min-h-screen bg-plum pb-20">
      {/* ===== Photo hero ===== */}
      <section className="relative isolate overflow-hidden">
        {/* Background: property photo when present, branded aurora otherwise */}
        {listing.photo_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.photo_url} alt={listing.address} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/70 to-plum/30" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-mulberry-radial" />
            <div className="aurora-bloom opacity-70" />
            <div className="grain-soft" />
          </>
        )}

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-5xl flex-col px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              {agent.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={agent.avatar_url}
                  alt={agent.name}
                  className="h-11 w-11 rounded-full border border-pearl/25 object-cover object-top"
                />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold to-auroraMauve text-sm font-bold text-plum">
                  {agent.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
              )}
              <div className="leading-tight">
                <p className="text-sm font-semibold text-pearl">{agent.name}</p>
                <p className="text-xs text-dusty">{agent.brand ?? "Sold It Today"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle className="bg-plum/40 backdrop-blur" />
              {agent.phone && (
                <a href={`tel:${phoneDigits}`} className="rounded-full border border-pearl/25 bg-plum/40 px-4 py-2 text-sm font-semibold text-pearl backdrop-blur transition-colors hover:border-pearl/50">
                  Call {agentFirst}
                </a>
              )}
            </div>
          </div>

          {/* Status pill */}
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-pearl/90">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {listing.status}
            {dom != null && <span className="text-dusty">· Day {dom} on market</span>}
          </div>

          {/* Address block, pinned to bottom */}
          <div className="mt-auto grid gap-6 pb-12 pt-16 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              {firstName && (
                <p className="font-serif text-2xl italic text-pearl/85">Hello, {firstName}</p>
              )}
              <h1 className="mt-2 font-serif text-4xl font-medium leading-[1.05] text-pearl sm:text-5xl md:text-6xl">
                {listing.address}
              </h1>
              <p className="mt-2 text-lg text-dusty">{cityLine}</p>
              <p className="mt-4 text-sm text-dusty">Here&rsquo;s the latest update on your listing.</p>
            </div>
            {listing.price != null && (
              <div className="sm:text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-dusty">List Price</p>
                <p className="mt-1 text-3xl font-semibold text-pearl sm:text-4xl">{money(listing.price)}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Details + analytics ===== */}
      <div className="mx-auto max-w-5xl px-6">
        {/* Facts */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-dusty/12 pb-6 text-sm text-dusty">
          {listing.beds != null && <span><b className="text-pearl">{listing.beds}</b> Beds</span>}
          {listing.baths != null && <span><b className="text-pearl">{listing.baths}</b> Baths</span>}
          {listing.sqft != null && <span><b className="text-pearl">{listing.sqft.toLocaleString("en-US")}</b> Sq Ft</span>}
          {listing.mls_number && <span>MLS# <b className="text-pearl">{listing.mls_number}</b></span>}
          {listing.list_date && <span>Listed <b className="text-pearl">{longDate(listing.list_date)}</b></span>}
          {stats?.period_end && <span className="text-dusty/70">Updated {longDate(stats.period_end)}</span>}
        </div>

        {stats && (
          <section className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Online Views", value: stats.total_views },
                { label: "Shares", value: stats.shares },
                { label: "Favorites", value: stats.favorites },
              ].map((s) => (
                <div key={s.label} className="aurora-ring rounded-xl2 border border-auroraMauve/20 bg-bruised/40 p-5 text-center">
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

            {stats.by_source.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Where buyers find your home</h2>
                <div className="mt-4 space-y-2.5">
                  {stats.by_source.map((s) => (
                    <div key={s.site} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-sm text-dusty">{s.site}</span>
                      <span className="h-2 rounded-full bg-gradient-to-r from-gold to-auroraMauve" style={{ width: `${Math.max(4, (s.views / maxSource) * 100)}%` }} />
                      <span className="text-sm text-pearl">{s.views.toLocaleString("en-US")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.by_city.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Where buyers are searching from</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stats.by_city.map((c) => (
                    <span key={c.city} className="rounded-full border border-dusty/20 bg-plum/40 px-3 py-1.5 text-sm text-dusty">
                      {c.city} <b className="text-pearl">{c.views}</b>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {notes.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Notes from {agentFirst}</h2>
            <div className="mt-4 space-y-4">
              {notes.map((n, i) => (
                <div key={i} className="aurora-ring rounded-xl2 border border-dusty/15 bg-bruised/40 p-6">
                  <p className="leading-relaxed text-pearl/90">{n.body}</p>
                  <p className="mt-3 text-xs text-dusty/70">{longDate(n.created_at)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-xl2 border border-auroraMauve/20 bg-wine-sheen p-6 text-center shadow-aurora">
          <p className="text-pearl">Questions about your listing?</p>
          <p className="mt-1 text-lg font-semibold text-pearl">{agent.name}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-dusty">
            {agent.phone && <a href={`tel:${phoneDigits}`} className="hover:text-pearl">{agent.phone}</a>}
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
