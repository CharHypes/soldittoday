import type { Metadata } from "next";
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

export default function PreferredPartnersPage() {
  return (
    <PageShell
      eyebrow="Preferred Partners"
      title="The pros I trust with my clients"
      description="From financing and inspection to the handyman who actually shows up ... the local people I rely on to keep your move smooth. Call any of them and tell them Charlotte sent you."
    >
      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux space-y-14">
          {/* Preview notice ... remove when this goes live */}
          <div className="rounded-xl2 border border-auroraMauve/30 bg-wine/20 p-4 text-center text-sm text-pearl">
            🔒 <span className="font-semibold">Private preview</span> ... this page isn&rsquo;t public yet. Everything below is a
            placeholder so you can see the layout. Send me your real partners (name, photo, why you trust them, contact) and I&rsquo;ll fill it in, then we go live.
          </div>

          {partnerCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex flex-col gap-2 border-b border-dusty/12 pb-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-pearl">{cat.title}</h2>
                <p className="max-w-2xl text-sm text-dusty">{cat.blurb}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.partners.map((partner, i) => (
                  <div
                    key={`${cat.id}-${i}`}
                    className="aurora-ring flex flex-col items-center rounded-xl2 border border-dusty/12 bg-bruised/40 p-6 text-center"
                  >
                    {/* Placeholder avatar ... swaps to a real headshot/logo when live */}
                    <div className="grid h-20 w-20 place-items-center rounded-full border border-dusty/20 bg-plum/60 text-3xl">
                      {partner.icon ?? "🤝"}
                    </div>

                    <div className="mt-4 text-base font-semibold text-pearl">{partner.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-dusty">{partner.detail}</div>

                    {partner.whyTrust && (
                      <p className="mt-3 text-sm leading-relaxed text-dusty/90">&ldquo;{partner.whyTrust}&rdquo;</p>
                    )}

                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="rounded-full border border-dusty/25 px-3.5 py-1.5 text-xs font-medium text-dusty">Call</span>
                      <span className="rounded-full border border-dusty/25 px-3.5 py-1.5 text-xs font-medium text-dusty">Email</span>
                    </div>

                    {partner.placeholder && (
                      <span className="mt-4 inline-flex rounded-full border border-dusty/25 bg-plum/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-dusty">
                        Placeholder
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
