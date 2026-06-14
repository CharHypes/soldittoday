import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { contact } from "@/lib/data";

export const metadata: Metadata = {
  title: "Buy a Home in Southeast Michigan | SOLD IT TODAY",
  description:
    "Buy with clarity and confidence across Southeast Michigan. SOLD IT TODAY guides first-time, move-up, and relocating buyers through search, financing, negotiation, and closing — education first, no pressure.",
  alternates: { canonical: "/buyers" },
  openGraph: {
    title: "Buy a Home in Southeast Michigan | SOLD IT TODAY",
    description:
      "A calm, strategic home search built around your goals — from pre-approval to keys in hand.",
    type: "website",
    url: "/buyers",
  },
};

const steps = [
  { n: "01", t: "Strategy call", d: "We start with your goals, budget, and timeline — no pressure, just a clear plan." },
  { n: "02", t: "Get pre-approved", d: "We connect you with a trusted lender so you know your numbers and shop with confidence." },
  { n: "03", t: "Search with focus", d: "Curated homes that actually fit — we cut the noise so you see what matters." },
  { n: "04", t: "Tour & evaluate", d: "Honest pros and cons on every home, including the things easy to miss." },
  { n: "05", t: "Offer & negotiate", d: "Strategy that protects your position — and your budget — when it counts." },
  { n: "06", t: "Inspect & close", d: "Guidance through inspection, appraisal, and closing all the way to the keys." },
];

const audiences = [
  {
    t: "First-Time Buyers",
    d: "Extra patience and education — the whole process demystified, plus down payment assistance and credit guidance.",
    href: "/first-time-buyers",
    cta: "First-Time Buyer Guide",
  },
  {
    t: "Move-Up Buyers",
    d: "Buying and selling at once? We coordinate both sides so the timing and the math work in your favor.",
    href: "/sellers",
    cta: "Selling Too? Learn More",
  },
  {
    t: "Relocation Buyers",
    d: "Moving to Metro Detroit? Area matching, commute and school research, and remote-friendly support.",
    href: "/relocation",
    cta: "Relocation Services",
  },
];

const faqs: FaqItem[] = [
  {
    q: "How much do I need for a down payment?",
    a: "Less than many people expect. Some loan programs allow as little as 3–3.5% down, and certain VA or USDA loans can go to 0% for those who qualify. Down payment assistance may help too. We'll connect you with a trusted lender to find the right fit.",
  },
  {
    q: "Should I get pre-approved before I start looking?",
    a: "Yes — pre-approval clarifies your budget and makes your offers far stronger. It's the first practical step, and we'll introduce you to lenders we trust if you need one.",
  },
  {
    q: "How long does it take to buy a home?",
    a: "The search varies by your needs and the market, but once you're under contract it's typically 30–45 days to closing. We map out the timeline up front so there are no surprises.",
  },
  {
    q: "How are you paid as my buyer's agent?",
    a: "We discuss representation and exactly how I'm compensated up front and in writing, before you commit to anything — so it's clear and transparent from day one.",
  },
  {
    q: "What's the very first step?",
    a: "A no-pressure consultation. We'll talk through your goals, answer your questions, and lay out a plan that fits your life and budget.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Home buyer representation",
  areaServed: "Southeast Michigan",
  provider: {
    "@type": "RealEstateAgent",
    name: contact.brand,
    telephone: contact.phone,
    email: contact.email,
    parentOrganization: { "@type": "Organization", name: contact.brokerage },
  },
};

export default function BuyersPage() {
  return (
    <PageShell
      eyebrow="Buyers"
      title="Buy a home with clarity and confidence"
      description="Whether it's your first home, your next one, or a move across the state, SOLD IT TODAY guides you through every step — search, financing, negotiation, and closing — with honest answers the whole way."
      actions={
        <div className="flex flex-wrap gap-3">
          <a href="/#contact" className="btn-aurora group">
            Schedule a Consultation
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a href="/communities" className="btn-outline group">
            Explore Communities
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />

      {/* Process overview */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="The Process"
            title="How buying works with us"
            description="A clear, six-step path from first conversation to closing table — explained at every stage."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="aurora-ring group rounded-xl2 border border-dusty/12 bg-plum/50 p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tracking-widest text-auroraMauve/70">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-dusty/15 transition-colors duration-500 group-hover:bg-auroraMauve/40" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-pearl">{s.t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we guide */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="Who We Guide"
            title="Built around your kind of move"
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a) => (
              <div
                key={a.t}
                className="aurora-ring group flex flex-col rounded-xl2 border border-dusty/12 bg-plum/50 p-7"
              >
                <h3 className="text-xl font-semibold text-pearl">{a.t}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                  {a.d}
                </p>
                <a
                  href={a.href}
                  className="group/link mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-auroraMauve"
                >
                  {a.cta}
                  <span className="transition-transform duration-500 ease-lux group-hover/link:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing guidance */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Financing"
              title="Understand your options before you decide"
              description="Financing is where confidence is won or lost. We help you understand the path — and connect you with lenders we trust — so the numbers are never a mystery."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/first-time-buyers" className="btn-aurora group">
                Down Payment Assistance
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
              <a href="/preferred-partners" className="btn-outline">
                Preferred Lenders
              </a>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl2 border border-auroraMauve/15 bg-auroraMauve/15 sm:grid-cols-2">
            {[
              ["Pre-approval", "Know your budget and strengthen every offer."],
              ["Loan types", "Conventional, FHA, VA, USDA — matched to you."],
              ["Down payment help", "Assistance programs for those who qualify."],
              ["Credit guidance", "A plan to get mortgage-ready, step by step."],
            ].map(([t, d]) => (
              <div key={t} className="bg-plum/60 p-6 backdrop-blur">
                <div className="text-base font-semibold text-pearl">{t}</div>
                <div className="mt-1.5 text-sm leading-snug text-dusty">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs}
        title="Buyer questions, answered"
        description="Straight answers to what buyers ask us most."
      />

      <CrossLinks current="/buyers" />
    </PageShell>
  );
}
