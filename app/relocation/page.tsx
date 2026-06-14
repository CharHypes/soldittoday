import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/ui/Reveal";
import {
  relocationAudiences,
  relocationAreaMatch,
  relocationProcess,
  relocationFaqs,
  contact,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Relocating to Southeast Michigan | SOLD IT TODAY Relocation",
  description:
    "Relocating to Metro Detroit or Southeast Michigan? SOLD IT TODAY helps out-of-state buyers, job transfers, and companies relocating employees — with area matching by commute, lifestyle, and budget.",
};

// Service + FAQPage structured data for SEO + AI discoverability.
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Real estate relocation services",
  provider: {
    "@type": "RealEstateAgent",
    name: "SOLD IT TODAY",
    memberOf: { "@type": "Organization", name: contact.brokerage },
  },
  areaServed: ["Southeast Michigan", "Metro Detroit", "Downriver"],
  description:
    "Relocation guidance for individuals, families, and companies moving to Southeast Michigan — including out-of-state buyers, job transfers, and corporate relocations.",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: relocationFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function RelocationPage() {
  return (
    <PageShell
      eyebrow="Relocation"
      title="Relocating to Southeast Michigan"
      description="Whether you're moving across the state or across the country, SOLD IT TODAY helps individuals, families, and companies land in the right place — confident and informed."
    >
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Intro */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10 max-w-3xl">
          <Reveal>
            <p className="text-lg leading-relaxed text-dusty md:text-xl">
              Moving is a big step — especially to a region you don&rsquo;t know
              yet. Our job is to make Southeast Michigan feel familiar fast: the
              right neighborhoods for your commute and lifestyle, honest market
              context, and a steady guide from your first question to closing day.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a href="/#contact" className="btn-aurora group mt-8">
              Start With a Consultation
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Who we help */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <Reveal>
            <span className="eyebrow text-auroraMauve">Who We Help</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl">
              Built for every kind of move to Michigan
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relocationAudiences.map((a) => (
              <div
                key={a.title}
                className="aurora-ring group rounded-xl2 border border-auroraMauve/18 bg-plum/50 p-7"
              >
                <h3 className="text-lg font-semibold text-pearl">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dusty">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area matching */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10">
          <Reveal>
            <span className="eyebrow text-auroraMauve">Find Your Area</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl">
              We match you to the right neighborhoods
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 max-w-2xl text-dusty">
              Not sure where to land? We narrow it down with you across three
              lenses — so the shortlist actually fits your life.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {relocationAreaMatch.map((m, i) => (
              <div
                key={m.title}
                className="aurora-ring rounded-xl2 border border-auroraMauve/18 bg-bruised/40 p-7"
              >
                <span className="text-sm font-semibold tracking-widest text-auroraMauve/70">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-pearl">
                  {m.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <Reveal>
            <span className="eyebrow text-auroraMauve">How It Works</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl">
              A clear path from first call to keys in hand
            </h2>
          </Reveal>
          <div className="mt-12 space-y-px overflow-hidden rounded-xl2 border border-dusty/12 bg-dusty/10">
            {relocationProcess.map((p) => (
              <div
                key={p.step}
                className="flex flex-col gap-2 bg-plum/60 p-6 backdrop-blur transition-colors duration-500 hover:bg-wine/40 sm:flex-row sm:items-start sm:gap-6 sm:p-7"
              >
                <span className="text-2xl font-semibold text-auroraMauve sm:w-16">
                  {p.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-pearl">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dusty">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer teaser */}
      <section className="relative overflow-hidden bg-plum py-16 md:py-20">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10">
          <div className="aurora-ring rounded-xl2 border border-auroraMauve/20 bg-wine-sheen p-8 shadow-aurora md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tightest text-pearl">
                  Relocating a team or employees?
                </h2>
                <p className="mt-3 text-pearl/80">
                  We support Michigan employers moving talent into the region with
                  a smooth, consistent experience — from automotive and healthcare
                  to university and executive moves.
                </p>
              </div>
              <a href="/#contact" className="btn-aurora group shrink-0">
                Talk to Charlotte
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10 max-w-3xl">
          <Reveal>
            <span className="eyebrow text-auroraMauve">Questions</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl">
              Relocation FAQs
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {relocationFaqs.map((f) => (
              <details
                key={f.q}
                className="aurora-ring group rounded-xl2 border border-dusty/15 bg-plum/50 p-5 md:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-pearl">
                  {f.q}
                  <span className="text-auroraMauve transition-transform duration-300 group-open:rotate-45">
                    &#43;
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-dusty">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
