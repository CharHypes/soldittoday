import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { contact } from "@/lib/data";

export const metadata: Metadata = {
  title: "Investment Properties in Southeast Michigan | SOLD IT TODAY",
  description:
    "Buy investment property in Southeast Michigan with numbers-first guidance. SOLD IT TODAY helps investors analyze cash flow, cap rate, and rehab costs on rentals, multi-family, and value-add homes across Metro Detroit and Downriver.",
  alternates: { canonical: "/investment" },
  openGraph: {
    title: "Investment Properties in Southeast Michigan | SOLD IT TODAY",
    description:
      "Numbers-first guidance to help you build and protect long-term wealth through Michigan real estate.",
    type: "website",
    url: "/investment",
  },
};

const steps = [
  { n: "01", t: "Define your strategy", d: "Cash flow, appreciation, or both. We start with your goals, capital, and comfort with risk." },
  { n: "02", t: "Run the numbers", d: "Rent estimates, expenses, cap rate, and cash-on-cash return ... so the math is clear before you offer." },
  { n: "03", t: "Source opportunities", d: "On-market and off-market properties that fit your criteria across Downriver and Metro Detroit." },
  { n: "04", t: "Analyze & tour", d: "We look at condition, rentability, and the real cost of getting a property rent-ready." },
  { n: "05", t: "Offer & negotiate", d: "Strategy that protects your margin and your terms when it counts." },
  { n: "06", t: "Close & scale", d: "Guidance through closing, plus a plan to grow the portfolio from here." },
];

const analyze = [
  ["Cash flow", "What the property actually nets each month after every expense."],
  ["Cap rate & cash-on-cash", "Apples-to-apples ways to compare one deal against another."],
  ["Rehab & rent-ready costs", "The true cost to stabilize a property, not just the sticker price."],
  ["Rent demand & location", "Where tenants actually want to be, and what they will pay."],
];

const strategies = [
  {
    t: "Long-Term Rentals",
    d: "Single-family and condo rentals chosen for steady cash flow and durable demand.",
  },
  {
    t: "Multi-Family (2 to 4 units)",
    d: "Duplexes through fourplexes that spread risk across several units and rents.",
  },
  {
    t: "Value-Add",
    d: "Properties where smart, budgeted improvements build equity and lift rents.",
  },
  {
    t: "House Hacking",
    d: "Live in one unit and rent the others to offset your own housing costs.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Do you work with first-time or new investors?",
    a: "Yes. We walk new investors through the numbers and the process at a comfortable pace, so your first purchase is a confident, informed decision rather than a leap.",
  },
  {
    q: "What kind of returns can I expect?",
    a: "It depends on the property, your financing, and your strategy. We model each deal conservatively so you see realistic cash flow and returns before you commit. Nothing is guaranteed, and we always suggest confirming the numbers with your own accountant or advisor.",
  },
  {
    q: "Can you connect me with lenders for investment loans?",
    a: "Yes. We introduce you to several trusted lenders who handle investment and multi-family financing, so you can compare programs and terms.",
  },
  {
    q: "Which areas are best for rentals?",
    a: "It varies by strategy and budget. We match neighborhoods to your goals across Downriver, western Wayne, Oakland, Macomb, and beyond, with honest context on demand and condition.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Real estate investment advisory",
  areaServed: "Southeast Michigan",
  provider: {
    "@type": "RealEstateAgent",
    name: contact.brand,
    telephone: contact.phone,
    email: contact.email,
    parentOrganization: { "@type": "Organization", name: contact.brokerage },
  },
};

export default function InvestmentPage() {
  return (
    <PageShell
      eyebrow="Investment Properties"
      title="Build long-term wealth through Michigan real estate"
      description="Numbers-first guidance for rental, multi-family, and value-add properties across Southeast Michigan ... so every purchase is a decision, not a gamble."
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

      {/* Process */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="The Approach"
            title="How we help you invest"
            description="A disciplined, six-step path built on the numbers ... from strategy to closing and scaling."
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

      {/* What we analyze */}
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="container-lux relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The Numbers"
              title="Every deal starts with the math"
              description="We pressure-test each property so you know what it earns, what it costs, and what it takes to make it work ... before you write an offer."
            />
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-dusty/80">
              Guidance here is educational and is not financial, tax, or legal
              advice. We always suggest confirming the numbers with your own
              accountant or advisor.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl2 border border-auroraMauve/15 bg-auroraMauve/15 sm:grid-cols-2">
            {analyze.map(([t, d]) => (
              <div key={t} className="bg-plum/60 p-6 backdrop-blur">
                <div className="text-base font-semibold text-pearl">{t}</div>
                <div className="mt-1.5 text-sm leading-snug text-dusty">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="Strategies"
            title="Ways investors build here"
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {strategies.map((s) => (
              <div
                key={s.t}
                className="aurora-ring rounded-xl2 border border-dusty/12 bg-plum/50 p-7"
              >
                <h3 className="text-lg font-semibold text-pearl">{s.t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs}
        title="Investor questions, answered"
        description="Straight answers to what investors ask us most."
      />

      <CrossLinks current="/investment" />
    </PageShell>
  );
}
