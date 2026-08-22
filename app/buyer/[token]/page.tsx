import type { Metadata } from "next";
import { getBuyerPortal } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Your Home Purchase | Sold It Today",
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

export default async function BuyerPortalPage({ params }: { params: { token: string } }) {
  const data = await getBuyerPortal(params.token);
  if (!data) return <NotAvailable />;

  const { transaction: tx, agent, client, milestones, notes } = data;
  const firstName = client.name?.split(" ")[0] ?? null;
  const agentFirst = agent.name.split(" ")[0];
  const phoneDigits = agent.phone?.replace(/[^0-9]/g, "") ?? "";
  const cityLine = [tx.city, tx.state].filter(Boolean).join(", ") + (tx.zip ? ` ${tx.zip}` : "");
  const doneCount = milestones.filter((m) => m.status === "done").length;

  return (
    <main className="min-h-screen bg-plum pb-20">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {tx.photo_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tx.photo_url} alt={tx.address} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/70 to-plum/30" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-mulberry-radial" />
            <div className="aurora-bloom opacity-70" />
            <div className="grain-soft" />
          </>
        )}

        <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-4xl flex-col px-6">
          <div className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              {agent.avatar_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={agent.avatar_url} alt={agent.name} className="h-11 w-11 rounded-full border border-pearl/25 object-cover object-top" />
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
            {agent.phone && (
              <a href={`tel:${phoneDigits}`} className="rounded-full border border-pearl/25 bg-plum/40 px-4 py-2 text-sm font-semibold text-pearl backdrop-blur transition-colors hover:border-pearl/50">
                Call {agentFirst}
              </a>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-pearl/90">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {tx.status}
            {tx.target_close_date && <span className="text-dusty">· Closing {longDate(tx.target_close_date)}</span>}
          </div>

          <div className="mt-auto pb-12 pt-16">
            {firstName && <p className="font-serif text-2xl italic text-pearl/85">Congratulations, {firstName}</p>}
            <h1 className="mt-2 font-serif text-4xl font-medium leading-[1.05] text-pearl sm:text-5xl md:text-6xl">
              {tx.address}
            </h1>
            <p className="mt-2 text-lg text-dusty">{cityLine}</p>
            {tx.price != null && <p className="mt-4 text-2xl font-semibold text-pearl">{money(tx.price)}</p>}
            <p className="mt-3 text-sm text-dusty">Here&rsquo;s exactly where your purchase stands.</p>
          </div>
        </div>
      </section>

      {/* Closing tracker */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-baseline justify-between border-b border-dusty/12 pb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Your path to the keys</h2>
          <span className="text-sm text-dusty">{doneCount} of {milestones.length} complete</span>
        </div>

        <ol className="mt-8 space-y-1">
          {milestones.map((m, i) => {
            const done = m.status === "done";
            const active = m.status === "in_progress";
            return (
              <li key={i} className="flex gap-4">
                {/* rail + node */}
                <div className="flex flex-col items-center">
                  <span
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold",
                      done ? "border-transparent bg-gradient-to-br from-gold to-auroraMauve text-plum" : "",
                      active ? "border-auroraMauve/70 bg-wine/40 text-pearl" : "",
                      !done && !active ? "border-dusty/25 bg-plum/40 text-dusty/60" : "",
                    ].join(" ")}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  {i < milestones.length - 1 && (
                    <span className={["my-1 w-px flex-1", done ? "bg-auroraMauve/50" : "bg-dusty/15"].join(" ")} style={{ minHeight: 28 }} />
                  )}
                </div>
                {/* label */}
                <div className="pb-6 pt-1">
                  <p className={done || active ? "font-medium text-pearl" : "text-dusty"}>{m.label}</p>
                  <p className="mt-0.5 text-xs text-dusty/70">
                    {active ? "In progress" : done ? "Done" : "Upcoming"}
                    {m.date ? ` · ${longDate(m.date)}` : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {notes.length > 0 && (
          <section className="mt-8">
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
          <p className="text-pearl">Questions about your purchase?</p>
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
