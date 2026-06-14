import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  counties,
  featuredCommunities,
  cityPages,
  contact,
} from "@/lib/data";

// Slugs that now have a live city page (the rest show "Guide soon").
const liveCitySlugs = new Set(cityPages.map((c) => c.slug));

/* -------------------------------------------------------------------------- */
/*  SEO                                                                         */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title:
    "Michigan Communities | SOLD IT TODAY — Explore Southeast Michigan",
  description:
    "Explore Southeast Michigan communities with SOLD IT TODAY. County guides for Wayne, Oakland, Macomb, Livingston, Washtenaw, and Monroe — for buyers, sellers, and anyone relocating to Metro Detroit.",
  alternates: { canonical: "/communities" },
  openGraph: {
    title: "Explore Michigan Communities With Confidence | SOLD IT TODAY",
    description:
      "Discover Southeast Michigan communities that fit your lifestyle, goals, and budget — whether you're relocating, buying, upgrading, downsizing, or investing.",
    type: "website",
    url: "/communities",
  },
};

/*
 * COMMUNITIES HUB — flagship entry point for Living / Moving / Investing /
 * Owning in Michigan. The central hub for future COUNTY pages
 * (/communities/[county]) and CITY pages (/communities/[city]-mi), which are
 * NOT built yet. County and featured-community cards are intentionally
 * non-navigating placeholders ("guide coming soon") so there are no broken
 * links; flip them to <a href="/communities/<slug>"> as pages ship.
 *
 * INTERNAL-LINKING ARCHITECTURE: the `exploreLinks` array below is the seam for
 * future cross-links. Set `live: true` (and ensure the route exists) to turn a
 * chip into a real link as each section ships.
 */

const getawayHighlights = [
  "Lake homes",
  "Vacation homes",
  "Cottages",
  "Waterfront properties",
  "Up North investments",
];

const exploreLinks: {
  label: string;
  href: string;
  live: boolean;
  current?: boolean; // the page we're on — shown as active, not a link
}[] = [
  { label: "Buying a Home", href: "/buyers", live: false },
  { label: "Selling a Home", href: "/sellers", live: false },
  { label: "First-Time Buyers", href: "/first-time-buyers", live: false },
  { label: "Investment Properties", href: "/investment-properties", live: false },
  { label: "Communities", href: "/communities", live: true, current: true },
  { label: "Relocation", href: "/relocation", live: true },
  { label: "Resources", href: "/resources", live: true },
  { label: "Blog", href: "/blog", live: false },
  { label: "Ask Charlotte AI", href: "/ask-charlotte", live: false },
];

// Real, accurate structured data only (no fabricated values).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Michigan Communities | SOLD IT TODAY",
  description:
    "Southeast Michigan community and county guides from SOLD IT TODAY.",
  about: {
    "@type": "RealEstateAgent",
    name: contact.brand,
    founder: { "@type": "Person", name: contact.founder },
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.officeStreet,
      addressLocality: "Novi",
      addressRegion: "MI",
      postalCode: "48374",
      addressCountry: "US",
    },
    parentOrganization: { "@type": "Organization", name: contact.brokerage },
    areaServed: counties.map((c) => ({
      "@type": "AdministrativeArea",
      name: `${c.name}, Michigan`,
    })),
  },
};

export default function CommunitiesPage() {
  return (
    <PageShell
      eyebrow="Communities"
      title="Explore Michigan Communities With Confidence"
      description="Whether you're relocating, buying your first home, upgrading, downsizing, or investing, SOLD IT TODAY helps you discover communities that fit your lifestyle, goals, and budget."
      actions={
        <div className="flex flex-wrap gap-3">
          <a href="#counties" className="btn-aurora group">
            Explore Counties
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a href="/#contact" className="btn-outline group">
            Talk With Our Team
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      }
    >
      {/* JSON-LD (real data only) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* 2. COUNTY HUB GRID                                               */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="counties"
        className="relative overflow-hidden bg-plum py-20 md:py-28"
      >
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="By County"
            title="Start with your county"
            description="Six Southeast Michigan counties, each with dedicated community guides on the way. Pick a region to explore what makes it home."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {counties.map((county) => (
              <div
                key={county.slug}
                className="aurora-ring group flex flex-col rounded-xl2 border border-dusty/12 bg-plum/50 p-7 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-pearl">
                    {county.name}
                  </h3>
                  <span className="h-px flex-1 bg-dusty/15 transition-colors duration-500 group-hover:bg-auroraMauve/40" />
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-dusty">
                  {county.description}
                </p>
                <div className="mt-6 flex items-center gap-4 border-t border-dusty/12 pt-5 text-xs text-dusty">
                  <span>
                    <span className="text-base font-semibold text-pearl">
                      {county.communities}
                    </span>{" "}
                    communities
                  </span>
                  <span className="h-3 w-px bg-dusty/25" />
                  <span>
                    <span className="text-base font-semibold text-auroraMauve">
                      {county.plannedPages}
                    </span>{" "}
                    city pages planned
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <code className="truncate text-[11px] text-dusty/60">
                    /communities/{county.slug}
                  </code>
                  <span className="shrink-0 rounded-full border border-auroraMauve/25 bg-wine/30 px-2.5 py-1 text-[10px] uppercase tracking-widest text-pearl/80">
                    Coming soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 3. FEATURED COMMUNITIES                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="Featured Communities"
            title="A few places to know"
            description="A first look at communities we serve. Full city guides — market trends, neighborhoods, schools, and lifestyle — are in development."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCommunities.map((c) => {
              const live = liveCitySlugs.has(c.slug);
              const inner = (
                <>
                  {/* Image slot (placeholder gradient until real city photos) */}
                  <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-wine-sheen p-4">
                    <div className="relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-pearl/70">
                        {c.county}
                      </div>
                      <div className="text-lg font-semibold text-pearl">
                        {c.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <code className="truncate text-[11px] text-dusty/60">
                      /communities/{c.slug}
                    </code>
                    {live ? (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-auroraMauve">
                        View guide &rarr;
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] uppercase tracking-widest text-dusty">
                        Guide soon
                      </span>
                    )}
                  </div>
                </>
              );
              const cls =
                "aurora-ring group block overflow-hidden rounded-xl2 border border-dusty/12 bg-plum/50";
              return live ? (
                <a key={c.slug} href={`/communities/${c.slug}`} className={cls}>
                  {inner}
                </a>
              ) : (
                <div key={c.slug} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. RELOCATION CROSS-LINK                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-24">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10">
          <div className="aurora-ring flex flex-col items-start justify-between gap-6 rounded-xl2 border border-dusty/15 bg-wine-sheen p-8 shadow-aurora md:flex-row md:items-center md:p-10">
            <div className="max-w-xl">
              <span className="eyebrow text-auroraMauve">Moving to Michigan?</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl">
                A smoother move, from first call to closing
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-pearl/80">
                We help out-of-state buyers, transferees, and corporate
                relocations find the right community — with area matching,
                commute and school research, and guidance every step of the way.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a href="/relocation" className="btn-aurora group">
                Relocation Services
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
              <a href="/#contact" className="btn-outline">
                Schedule Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 5. BUYER / SELLER CROSS-LINK                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Buying a Home",
                copy: "From first showing to final signature — a calm, strategic search built around your goals.",
                href: "/buyers",
              },
              {
                title: "Selling a Home",
                copy: "Pricing, marketing, and negotiation that present your home at its strongest in any market.",
                href: "/sellers",
              },
            ].map((card) => (
              <div
                key={card.href}
                className="aurora-ring group flex flex-col rounded-xl2 border border-dusty/12 bg-plum/50 p-8"
              >
                <h3 className="text-2xl font-semibold tracking-tightest text-pearl">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                  {card.copy}
                </p>
                <a href={card.href} className="btn-outline group mt-7 self-start">
                  Learn More
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 6. MICHIGAN GETAWAYS TEASER                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-24">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <div className="rounded-xl2 border border-auroraMauve/15 bg-bruised/40 p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <span className="eyebrow text-auroraMauve">Coming Soon</span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl">
                  Michigan Getaways
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-dusty">
                  Lake homes, cottages, and Up North properties — a dedicated
                  guide to vacation and second-home ownership across Michigan.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {getawayHighlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-auroraMauve/25 bg-wine/30 px-3 py-1.5 text-xs text-pearl/85"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
              {/* Non-navigating placeholder — no route yet */}
              <span className="btn-outline cursor-default select-none whitespace-nowrap opacity-70">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 8. INTERNAL LINKING — explore cluster (architecture-ready)        */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-bruised py-16 md:py-20">
        <div className="container-lux relative z-10">
          <div className="text-center">
            <span className="eyebrow text-auroraMauve">Explore SOLD IT TODAY</span>
            <h2 className="mt-3 text-xl font-semibold tracking-tightest text-pearl sm:text-2xl">
              Living, moving, investing &amp; owning in Michigan
            </h2>
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {exploreLinks.map((l) =>
              l.current ? (
                <span
                  key={l.href}
                  aria-current="page"
                  className="inline-flex items-center gap-2 rounded-full border border-auroraMauve/50 bg-wine/40 px-4 py-2 text-sm font-medium text-pearl"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-auroraMauve shadow-aurora" />
                  {l.label}
                </span>
              ) : l.live ? (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-dusty/25 bg-plum/40 px-4 py-2 text-sm text-pearl transition-colors duration-300 hover:border-auroraMauve/60 hover:text-pearl"
                >
                  {l.label}
                </a>
              ) : (
                <span
                  key={l.href}
                  className="rounded-full border border-dusty/12 bg-plum/30 px-4 py-2 text-sm text-dusty/70"
                  title="Coming soon"
                >
                  {l.label}
                  <span className="ml-2 text-[10px] uppercase tracking-widest text-dusty/50">
                    soon
                  </span>
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
