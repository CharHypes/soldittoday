import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqSection from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { cityPages, contact } from "@/lib/data";

type Params = { city: string };

// Pre-render the Tier 1 city pages at build time.
export function generateStaticParams(): Params[] {
  return cityPages.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const city = cityPages.find((c) => c.slug === params.city);
  if (!city) return {};
  const title = `Homes for Sale in ${city.name}, MI | SOLD IT TODAY`;
  const url = `/communities/${city.slug}`;
  return {
    title,
    description: city.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: city.metaDescription,
      type: "website",
      url,
    },
  };
}

/*
 * Dynamic city page. Scales to more cities by adding entries to `cityPages`
 * in lib/data.ts. Content is qualitative and fair-housing-safe; live listings
 * and market stats get layered in later via IDX/MLS.
 */
export default function CityPage({ params }: { params: Params }) {
  const city = cityPages.find((c) => c.slug === params.city);
  if (!city) notFound();

  const url = `/communities/${city.slug}`;

  // Real, schema-ready structured data (Place + RealEstateAgent + breadcrumb).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        name: `${city.name}, Michigan`,
        address: {
          "@type": "PostalAddress",
          addressLocality: city.name,
          addressRegion: "MI",
          addressCountry: "US",
        },
      },
      {
        "@type": "RealEstateAgent",
        name: contact.brand,
        telephone: contact.phone,
        email: contact.email,
        areaServed: { "@type": "Place", name: `${city.name}, Michigan` },
        parentOrganization: { "@type": "Organization", name: contact.brokerage },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Communities", item: "/communities" },
          { "@type": "ListItem", position: 2, name: city.name, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell
      eyebrow={city.county}
      title={`${city.name}, Michigan`}
      description={city.heroIntro}
      actions={
        <div className="flex flex-wrap gap-3">
          <a href="/#contact" className="btn-aurora group">
            Schedule a Consultation
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a href="/communities" className="btn-outline group">
            All Communities
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      }
    >
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Community overview + county association */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10 max-w-3xl">
          <span className="eyebrow text-auroraMauve">
            Living in {city.name}
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl">
            A community overview
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-dusty md:text-lg">
            {city.community.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-auroraMauve/25 bg-wine/30 px-4 py-2 text-sm text-pearl/90">
            Part of{" "}
            <a
              href="/communities"
              className="font-medium text-auroraMauve underline-offset-4 hover:underline"
            >
              {city.county}
            </a>
            <span className="text-dusty">&middot; {city.region}</span>
          </div>
        </div>
      </section>

      {/* Lifestyle overview */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="Lifestyle"
            title={`Life in ${city.name}`}
            description={`What day-to-day living tends to look like in ${city.name} and the surrounding area.`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {city.lifestyle.map((item) => (
              <div
                key={item.title}
                className="aurora-ring rounded-xl2 border border-dusty/12 bg-plum/50 p-6"
              >
                <h3 className="text-base font-semibold text-pearl">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying / Selling in this city */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow={`Your Move In ${city.name}`}
            title="Buying or selling here?"
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <div className="aurora-ring group flex flex-col rounded-xl2 border border-dusty/12 bg-plum/50 p-8">
              <h3 className="text-2xl font-semibold tracking-tightest text-pearl">
                Buying in {city.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                A focused, strategic search built around your goals — from
                financing prep to the right neighborhood and a smooth closing.
              </p>
              <a href="/buyers" className="btn-outline group mt-7 self-start">
                Buyer Guidance
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
            <div className="aurora-ring group flex flex-col rounded-xl2 border border-dusty/12 bg-plum/50 p-8">
              <h3 className="text-2xl font-semibold tracking-tightest text-pearl">
                Selling in {city.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                Pricing, preparation, and marketing tuned to local buyers — to
                present your home at its strongest and protect your net.
              </p>
              <a href="/sellers" className="btn-outline group mt-7 self-start">
                Seller Guidance
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Relocation cross-link (only where it's especially relevant) */}
      {city.relocation && (
        <section className="relative overflow-hidden bg-bruised py-20 md:py-24">
          <div className="aurora-bloom opacity-40" />
          <div className="container-lux relative z-10">
            <div className="aurora-ring flex flex-col items-start justify-between gap-6 rounded-xl2 border border-dusty/15 bg-wine-sheen p-8 shadow-aurora md:flex-row md:items-center md:p-10">
              <div className="max-w-xl">
                <span className="eyebrow text-auroraMauve">
                  Relocating to {city.name}?
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl">
                  We make moving here easier
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-pearl/80">
                  Moving from out of state or across the region? We help with
                  area matching, commute and school research, and remote-friendly
                  support so {city.name} feels like home from day one.
                </p>
              </div>
              <a href="/relocation" className="btn-aurora group shrink-0">
                Relocation Services
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      <FaqSection
        items={city.faqs}
        title={`${city.name} real estate questions`}
        description={`Common questions about buying and selling in ${city.name}.`}
      />

      <CrossLinks current="/communities" />
    </PageShell>
  );
}
