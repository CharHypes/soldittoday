import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { contact } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sell Your Home in Southeast Michigan | SOLD IT TODAY",
  description:
    "Sell with strategy. SOLD IT TODAY prices, prepares, markets, and negotiates your Southeast Michigan home to present it at its strongest — and maximize your net proceeds in any market.",
  alternates: { canonical: "/sellers" },
  openGraph: {
    title: "Sell Your Home in Southeast Michigan | SOLD IT TODAY",
    description:
      "Pricing, marketing, and negotiation that present your home at its strongest — and protect your bottom line.",
    type: "website",
    url: "/sellers",
  },
};

const steps = [
  { n: "01", t: "Walk-through & strategy", d: "We learn your home and your goals, then build a plan around both." },
  { n: "02", t: "Price it right", d: "A data-driven pricing strategy — to attract demand, not leave money behind." },
  { n: "03", t: "Prep & present", d: "Honest, ROI-focused advice on what's worth doing before listing — and what isn't." },
  { n: "04", t: "Market widely", d: "Premium presentation that reaches the right buyers, online and beyond." },
  { n: "05", t: "Negotiate offers", d: "Experienced advocacy that protects your position and your net." },
  { n: "06", t: "Manage to close", d: "We steer inspection, appraisal, and closing so nothing stalls the sale." },
];

const pillars = [
  {
    t: "Pricing Strategy",
    d: "A real comparative market analysis — comps, local trends, and your home's condition — to price for maximum interest and the strongest net, not just a number that sounds good.",
  },
  {
    t: "Premium Marketing",
    d: "Your home presented at its best and put in front of the right buyers, with marketing that earns attention online where today's buyers actually look.",
  },
  {
    t: "Strong Negotiation",
    d: "Nearly two decades of deals sharpen one thing: protecting your position when offers, inspections, and appraisals are on the line.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "How do you decide my list price?",
    a: "With data, not guesswork — a comparative market analysis using recent comparable sales, current local trends, and your home's specific condition and features. We price to attract real demand and protect your net.",
  },
  {
    q: "What does it cost to sell my home?",
    a: "Typical costs include agent commissions, closing costs, and sometimes buyer concessions. We walk through an estimated net sheet up front so you know roughly what you'll walk away with before you list.",
  },
  {
    q: "Should I make repairs or updates before listing?",
    a: "Only the ones worth it. We give honest, ROI-focused guidance — what tends to pay off in your market, and what to skip — so you don't over-invest before a sale.",
  },
  {
    q: "How long will it take to sell?",
    a: "It depends on price, condition, and the market. Rather than promise a number, we set realistic expectations with current local data and adjust strategy as we go.",
  },
  {
    q: "When is the best time to list?",
    a: "It depends on your goals and the market — sometimes sooner is better, sometimes timing the season helps. We build the timeline around your situation, not a generic rule.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Home seller / listing representation",
  areaServed: "Southeast Michigan",
  provider: {
    "@type": "RealEstateAgent",
    name: contact.brand,
    telephone: contact.phone,
    email: contact.email,
    parentOrganization: { "@type": "Organization", name: contact.brokerage },
  },
};

export default function SellersPage() {
  return (
    <PageShell
      eyebrow="Sellers"
      title="Sell your home at its strongest"
      description="Pricing, preparation, marketing, and negotiation built to present your Southeast Michigan home at its best — and maximize what you walk away with, in any market."
      actions={
        <div className="flex flex-wrap gap-3">
          <a href="/#contact" className="btn-aurora group">
            Schedule a Consultation
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a href="/#contact" className="btn-outline group">
            Request a Home Valuation
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
            title="How selling works with us"
            description="A clear six-step path from first walk-through to closing — with strategy behind every move."
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

      {/* Pricing / Marketing / Negotiation */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="What Sets The Sale Up To Win"
            title="Pricing, marketing & negotiation"
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.t}
                className="aurora-ring rounded-xl2 border border-dusty/12 bg-plum/50 p-8"
              >
                <h3 className="text-xl font-semibold text-pearl">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dusty">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Move-up seller cross-link */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-24">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10">
          <div className="aurora-ring flex flex-col items-start justify-between gap-6 rounded-xl2 border border-dusty/15 bg-wine-sheen p-8 shadow-aurora md:flex-row md:items-center md:p-10">
            <div className="max-w-xl">
              <span className="eyebrow text-auroraMauve">Move-Up Sellers</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl">
                Selling and buying at the same time?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-pearl/80">
                The trickiest part is timing and the math. We coordinate both
                sides of your move so the sale and the purchase work together —
                not against each other.
              </p>
            </div>
            <a href="/buyers" className="btn-aurora group shrink-0">
              Buying Too? Learn More
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs}
        title="Seller questions, answered"
        description="Straight answers to what sellers ask us most."
      />

      <CrossLinks current="/sellers" />
    </PageShell>
  );
}
