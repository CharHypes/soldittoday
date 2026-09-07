import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageShell from "@/components/PageShell";
import { partnerCategories } from "@/lib/data";

/**
 * PRIVATE PREVIEW ... noindexed and unlinked from the nav on purpose. Charlotte
 * reviews the layout with placeholders; once she sends her real partners we swap
 * the content, remove `robots.noindex`, add /preferred-partners back to the
 * sitemap, and re-add the homepage teaser.
 */
export const metadata: Metadata = {
  title: "Preferred Partners | SOLD IT TODAY ... Southeast Michigan Real Estate",
  description:
    "SOLD IT TODAY's preferred partners: trusted lenders, insurance agents, inspectors, title, HVAC, and home-service pros across Southeast Michigan and Metro Detroit.",
  robots: { index: false, follow: false },
};

/* Minimal line icons (elegant, gold) ... one per category. */
const ICONS: Record<string, ReactNode> = {
  lenders: (
    <path d="M12 4v16M15.5 7.4C15.5 6 13.9 5 12 5S8.5 6.1 8.5 7.5s1.6 2.3 3.5 2.5 3.5 1.1 3.5 2.5S13.9 15 12 15s-3.5-1-3.5-2.6" />
  ),
  insurance: (
    <>
      <path d="M12 3l7 3v5c0 4.6-3.1 7.8-7 9-3.9-1.2-7-4.4-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  inspectors: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M20 20l-5-5" />
    </>
  ),
  title: (
    <>
      <path d="M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8z" />
      <path d="M13 3v5h5M9 13h6M9 16.5h6" />
    </>
  ),
  hvac: (
    <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.6.6-2.7 1.5-3.5C9.9 8.6 10 9.5 11 10c.6-2 .3-4 1-7z" />
  ),
  handyman: (
    <path d="M15.6 4.6a4 4 0 0 0-4.9 5.1L4 16.4 7.6 20l6.7-6.7a4 4 0 0 0 5.1-4.9l-2.7 2.7-2.2-.6-.6-2.2z" />
  ),
  movers: (
    <>
      <path d="M3 6h10v9H3zM13 9h4l3 3v3h-7z" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </>
  ),
  lawn: (
    <>
      <path d="M4 20c0-9 7-15 16-15 0 9-7 15-16 15z" />
      <path d="M4 20c5-5 9-8 13-9" />
    </>
  ),
  "estate-sales": (
    <>
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7.6a2 2 0 0 1 1.4.6l5.8 5.8a2 2 0 0 1 0 2.8z" />
      <circle cx="8.5" cy="8.5" r="1.2" />
    </>
  ),
};

function CategoryIcon({ id, className = "h-6 w-6" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[id] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

export default function PreferredPartnersPage() {
  return (
    <PageShell
      eyebrow="Preferred Partners"
      title="The pros we trust with our clients"
      description="From financing and inspection to the handyman who actually shows up ... the local people we rely on to keep your move smooth. Call any of them and tell them Sold It Today sent you."
      heroBackground="/assets/pages/partners-hero-downtown.jpg"
    >
      <section className="relative overflow-hidden bg-bruised py-16 md:py-24">
        {/* Subtle mauve depth ... matches the homepage Services section (soft, not a spotlight) */}
        <div className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-wine/30 blur-[150px]" />
        <div className="pointer-events-none absolute left-0 top-2/3 h-[360px] w-[360px] rounded-full bg-aurora/12 blur-[150px]" />
        <div className="container-lux relative z-10 space-y-14">
          {/* Preview notice ... remove when this goes live */}
          <div className="rounded-xl2 border border-auroraMauve/30 bg-wine/20 p-4 text-center text-sm text-pearl">
            🔒 <span className="font-semibold">Private preview</span> ... this page isn&rsquo;t public yet. Everything below is a
            placeholder so you can see the layout. Send me your real partners and I&rsquo;ll fill it in, then we go live.
          </div>

          {/* Elegant category index ... one trusted network, jump to any trade */}
          <div>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-auroraMauve">
              One trusted network for the whole move
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {partnerCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="group flex items-center gap-3 rounded-xl2 border border-dusty/12 bg-plum/50 px-4 py-3.5 transition-colors duration-300 hover:border-auroraMauve/60"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-auroraMauve/40 text-auroraMauve transition-transform duration-300 group-hover:-translate-y-0.5">
                    <CategoryIcon id={cat.id} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium leading-tight text-pearl">{cat.title}</span>
                </a>
              ))}
            </div>
          </div>

          {partnerCategories.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-dusty/12 pb-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-auroraMauve/40 text-auroraMauve">
                  <CategoryIcon id={cat.id} className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-semibold tracking-tightest text-pearl">{cat.title}</h2>
                  <p className="max-w-2xl text-sm text-dusty">{cat.blurb}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...cat.partners]
                  .sort((a, b) => {
                    // Real partners first, then manual pins, then highest-rated (fair ordering).
                    if (a.placeholder !== b.placeholder) return a.placeholder ? 1 : -1;
                    if ((b.priority ?? 0) !== (a.priority ?? 0)) return (b.priority ?? 0) - (a.priority ?? 0);
                    return (b.rating ?? -1) - (a.rating ?? -1);
                  })
                  .map((partner, i) => {
                  const chip =
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors";
                  const chipLive =
                    "border-auroraMauve/40 text-pearl hover:border-auroraMauve hover:bg-auroraMauve/10";
                  const chipDead = "border-dusty/25 text-dusty";
                  return (
                  <div
                    key={`${cat.id}-${i}`}
                    className="aurora-ring flex flex-col items-center rounded-xl2 border border-dusty/12 bg-plum/50 p-5 text-center"
                  >
                    {/* Real headshot/logo when live; category icon for placeholders */}
                    {partner.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={partner.photo}
                        alt={partner.name}
                        className={
                          partner.logo
                            ? "h-20 w-20 rounded-full border border-auroraMauve/40 bg-white object-contain p-2"
                            : "h-20 w-20 rounded-full border border-auroraMauve/40 object-cover object-top"
                        }
                      />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-full border border-auroraMauve/40 bg-wine/30 text-auroraMauve">
                        <CategoryIcon id={cat.id} className="h-6 w-6" />
                      </div>
                    )}

                    <div className="mt-3 text-base font-semibold text-pearl">{partner.name}</div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wide text-dusty">{partner.detail}</div>
                    {partner.credential && (
                      <div className="mt-1 text-[11px] leading-snug text-dusty/80">{partner.credential}</div>
                    )}

                    {partner.rating != null && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-dusty">
                        <span className="text-gold">★</span>
                        <span className="font-semibold text-pearl">{partner.rating.toFixed(1)}</span>
                        {partner.reviewCount != null && <span>· {partner.reviewCount} reviews</span>}
                        {partner.reviewSource && <span>· {partner.reviewSource}</span>}
                      </div>
                    )}

                    {partner.whyTrust && (
                      <p className="mt-2.5 text-sm leading-relaxed text-dusty/90">&ldquo;{partner.whyTrust}&rdquo;</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {partner.placeholder ? (
                        <>
                          <span className={`${chip} ${chipDead}`}>Call</span>
                          <span className={`${chip} ${chipDead}`}>Email</span>
                          <span className={`${chip} ${chipDead}`}>Website</span>
                        </>
                      ) : (
                        <>
                          {partner.phone && (
                            <a href={`tel:${partner.phone.replace(/[^\d+]/g, "")}`} className={`${chip} ${chipLive}`}>Call</a>
                          )}
                          {partner.mobile && (
                            <a href={`tel:${partner.mobile.replace(/[^\d+]/g, "")}`} className={`${chip} ${chipLive}`}>Cell</a>
                          )}
                          {partner.email && (
                            <a href={`mailto:${partner.email}`} className={`${chip} ${chipLive}`}>Email</a>
                          )}
                          {partner.website && (
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className={`${chip} ${chipLive}`}>Website</a>
                          )}
                        </>
                      )}
                    </div>

                    {partner.apply && (
                      <a
                        href={partner.apply}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-aurora group mt-4 text-sm"
                      >
                        {partner.applyLabel ?? "Apply Now"}
                        <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                      </a>
                    )}

                    {partner.placeholder && (
                      <span className="mt-3 inline-flex rounded-full border border-dusty/25 bg-plum/50 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-dusty">
                        Placeholder
                      </span>
                    )}

                    {partner.resource && !partner.placeholder && (
                      <span className="mt-3 inline-flex rounded-full border border-auroraMauve/40 bg-wine/20 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-auroraMauve">
                        Resource
                      </span>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
