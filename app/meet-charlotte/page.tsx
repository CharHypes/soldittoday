import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/ui/Reveal";
import CrossLinks from "@/components/CrossLinks";
import {
  contact,
  charlotteStats,
  brandValues,
  reviewThemes,
  reviewsUrl,
  marketAreas,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Meet Charlotte Hypes | Founder of SOLD IT TODAY — Southeast Michigan",
  description:
    "Meet Charlotte Hypes, Founder & Team Lead of SOLD IT TODAY. 20 years, 350+ homes sold, and a Circle of Excellence recipient guiding Southeast Michigan buyers and sellers with clarity, strategy, and honesty.",
};

// Person / RealEstateAgent structured data for SEO + AI discoverability.
const personLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Charlotte Hypes",
  jobTitle: "Founder & Team Lead, REALTOR®",
  worksFor: { "@type": "Organization", name: "SOLD IT TODAY" },
  memberOf: {
    "@type": "Organization",
    name: contact.brokerage,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.officeStreet,
      addressLocality: "Novi",
      addressRegion: "MI",
      postalCode: "48374",
      addressCountry: "US",
    },
  },
  telephone: "+1-313-529-5750",
  email: contact.email,
  areaServed: [
    "Southeast Michigan",
    "Metro Detroit",
    "Downriver",
    "Wayne County, MI",
    "Oakland County, MI",
  ],
  knowsAbout: [
    "First-time home buyers",
    "Down payment assistance",
    "Listing strategy",
    "Negotiation",
    "Investment properties",
    "Relocation",
  ],
};

export default function MeetCharlottePage() {
  return (
    <PageShell
      eyebrow="Meet Charlotte"
      title="Meet Charlotte Hypes"
      description="Founder & Team Lead, SOLD IT TODAY — your guide to buying and selling in Southeast Michigan with clarity, strategy, and honesty."
    >
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      {/* Story */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10 grid items-start gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto w-[260px] sm:w-[300px]">
              <div className="aurora-ring relative aspect-[4/5] overflow-hidden rounded-xl2 border border-auroraMauve/20 shadow-aurora">
                <Image
                  src="/assets/team/charlotte-hypes.png"
                  alt="Charlotte Hypes, Founder & Team Lead at SOLD IT TODAY"
                  fill
                  sizes="300px"
                  style={{ objectPosition: "center 18%" }}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent to-transparent" />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow text-auroraMauve">Your Guide</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl">
                Real estate, with a trusted guide in your corner
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-dusty md:text-lg">
                <p>
                  Real estate doesn&rsquo;t have to feel confusing. My job is to
                  help you understand your options, avoid costly mistakes, and
                  move forward with confidence. Whether you&rsquo;re buying your
                  first home, selling your current one, or planning your next
                  move, you&rsquo;ll have a trusted advisor in your corner every
                  step of the way.
                </p>
                <p>
                  I founded SOLD IT TODAY to do real estate differently — to lead
                  with education instead of pressure, and to treat every client
                  like the decision is theirs to make, fully informed. Over{" "}
                  <span className="text-pearl">20 years</span> and{" "}
                  <span className="text-pearl">350+ homes sold</span>, that
                  approach has guided first-time buyers, growing families,
                  investors, and homeowners across Southeast Michigan.
                </p>
                <p>
                  My roots are in Downriver, but our team serves buyers and
                  sellers throughout Metro Detroit and the wider region. From down
                  payment assistance and credit guidance to sharp negotiation and
                  strategy, the goal is always the same: clear guidance, honest
                  answers, and real results.
                </p>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.18}>
              <div className="mt-9 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-auroraMauve/15 bg-auroraMauve/15 sm:grid-cols-4">
                {charlotteStats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-plum/60 px-4 py-5 text-center backdrop-blur transition-colors duration-500 hover:bg-wine/50 sm:text-left"
                  >
                    <div className="text-base font-semibold leading-tight text-pearl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug text-dusty">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/#contact" className="btn-aurora group">
                  Schedule a Consultation
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
                <a href="/team" className="btn-outline">
                  Meet the Team
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What you can count on */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <Reveal>
            <h2 className="text-center text-sm font-medium uppercase tracking-widest text-auroraMauve">
              What you can count on
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl2 border border-dusty/12 bg-dusty/10 sm:grid-cols-2 lg:grid-cols-3">
            {brandValues.map((value, i) => (
              <div
                key={value.title}
                className="aurora-ring group bg-plum/60 p-7 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tracking-widest text-auroraMauve/70">
                    0{i + 1}
                  </span>
                  <span className="h-px flex-1 bg-dusty/15 transition-colors duration-500 group-hover:bg-auroraMauve/40" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-pearl">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Southeast Michigan coverage */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="eyebrow text-auroraMauve">Where We Serve</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl">
                Rooted in Downriver, serving Southeast Michigan
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-base leading-relaxed text-dusty md:text-lg">
                My roots are in Downriver, but our team guides buyers and sellers
                throughout Metro Detroit and the wider region — from the City of
                Detroit to the suburbs of Oakland, Macomb, and Washtenaw counties.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <a href="/communities" className="btn-aurora group mt-8">
                Explore Communities
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-dusty/12 bg-dusty/10 sm:grid-cols-3 lg:grid-cols-2">
            {marketAreas.map((area) => (
              <div
                key={area.name}
                className="aurora-ring bg-plum/60 p-5 backdrop-blur"
              >
                <div className="text-base font-semibold text-pearl">
                  {area.name}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-dusty">
                  {area.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews teaser */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10">
          <Reveal>
            <span className="eyebrow text-auroraMauve">Client Reviews</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl">
              The themes clients mention again and again
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviewThemes.slice(0, 6).map((theme) => (
              <div
                key={theme.title}
                className="aurora-ring rounded-xl2 border border-auroraMauve/18 bg-bruised/40 p-6"
              >
                <h3 className="text-base font-semibold text-pearl">
                  {theme.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dusty">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-aurora group"
            >
              Read More Reviews
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <span className="ml-4 text-xs text-dusty/70">
              Verified client reviews on Zillow
            </span>
          </div>
        </div>
      </section>

      <CrossLinks current="/meet-charlotte" />
    </PageShell>
  );
}
