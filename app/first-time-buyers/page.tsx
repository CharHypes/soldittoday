import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { contact } from "@/lib/data";

export const metadata: Metadata = {
  title: "First-Time Home Buyers in Michigan | SOLD IT TODAY",
  description:
    "A patient, step-by-step guide for first-time home buyers in Southeast Michigan — mortgage prep, down payment assistance, common mistakes to avoid, and honest answers from pre-approval to keys in hand.",
  alternates: { canonical: "/first-time-buyers" },
  openGraph: {
    title: "First-Time Home Buyers in Michigan | SOLD IT TODAY",
    description:
      "The whole process demystified — mortgage prep, down payment assistance, and a guide in your corner the whole way.",
    type: "website",
    url: "/first-time-buyers",
  },
};

const steps = [
  { n: "01", t: "Talk it through", d: "We answer your questions and map a plan around your goals and budget — zero pressure." },
  { n: "02", t: "Get mortgage-ready", d: "Pre-approval plus credit guidance, so you know your numbers and what you can afford." },
  { n: "03", t: "Understand your help", d: "We review down payment assistance and loan options you may qualify for." },
  { n: "04", t: "Search & tour", d: "Find the right fit with honest feedback on every home you see." },
  { n: "05", t: "Offer & inspect", d: "We protect you through the offer, inspection, and appraisal." },
  { n: "06", t: "Close & get the keys", d: "We guide you to the closing table and your first front door." },
];

const mistakes = [
  ["Skipping pre-approval", "Shopping before you know your real budget — and weakening your offers."],
  ["Maxing your budget", "Forgetting taxes, insurance, and maintenance on top of the mortgage."],
  ["Missing assistance you qualify for", "Not checking down payment help before you start."],
  ["Waiving inspections blindly", "Giving up protection without understanding the risk."],
  ["Opening new credit before closing", "A new car loan or card can derail your approval."],
  ["Going it alone", "Navigating contracts and negotiation without a guide in your corner."],
];

const faqs: FaqItem[] = [
  {
    q: "How much money do I really need to buy my first home?",
    a: "Often less than you'd think. Down payments can start around 3–3.5%, and some programs go to 0% for those who qualify — plus closing costs. Down payment assistance may lower it further. We'll connect you with a trusted lender to see your real numbers.",
  },
  {
    q: "What credit score do I need?",
    a: "It varies by loan program, and there's no single magic number. If you're not there yet, that's okay — we offer credit-improvement guidance and lender connections to help you get mortgage-ready over time.",
  },
  {
    q: "What is down payment assistance?",
    a: "It's grants or low-cost loans that help eligible buyers cover the down payment and sometimes closing costs. Michigan has programs (such as MSHDA) for qualifying first-time buyers — we'll help you see whether you qualify.",
  },
  {
    q: "How long does buying my first home take?",
    a: "From pre-approval to keys it's commonly a couple of months, depending on your search and financing. We explain each step as it comes so it never feels overwhelming.",
  },
  {
    q: "Should I keep renting instead?",
    a: "Sometimes the honest answer is yes — and we'll tell you. We'll run the real numbers with you, with no pressure, so you can decide with clarity rather than fear of missing out.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "First-time home buyer guidance",
  areaServed: "Southeast Michigan",
  provider: {
    "@type": "RealEstateAgent",
    name: contact.brand,
    telephone: contact.phone,
    email: contact.email,
    parentOrganization: { "@type": "Organization", name: contact.brokerage },
  },
};

export default function FirstTimeBuyersPage() {
  return (
    <PageShell
      eyebrow="First-Time Buyers"
      title="Your first home, without the guesswork"
      description="Buying your first home should feel exciting, not overwhelming. We demystify the whole process — mortgage prep, down payment assistance, and the mistakes to avoid — with a patient guide in your corner the entire way."
      actions={
        <div className="flex flex-wrap gap-3">
          <a href="/#contact" className="btn-aurora group">
            Schedule a Consultation
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a href="#down-payment" className="btn-outline group">
            See Down Payment Help
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

      {/* Step-by-step overview */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="Step By Step"
            title="The path to your first home"
            description="Six clear steps — explained in plain language, at a pace that works for you."
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

      {/* Mortgage prep + Down payment assistance */}
      <section
        id="down-payment"
        className="relative overflow-hidden bg-bruised py-20 md:py-28"
      >
        <div className="aurora-bloom opacity-50" />
        <div className="container-lux relative z-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow text-auroraMauve">Mortgage Preparation</span>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl">
              Getting mortgage-ready
            </h2>
            <p className="mt-4 text-base leading-relaxed text-dusty">
              Before you shop, it helps to know your numbers. We connect you with
              trusted lenders and walk you through what matters:
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Pre-approval so you know your budget and shop with confidence",
                "Credit guidance and a plan to strengthen your profile over time",
                "Understanding debt-to-income and what lenders look for",
                "Saving for the down payment and closing costs",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-pearl/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-auroraMauve" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="aurora-ring rounded-xl2 border border-auroraMauve/20 bg-plum/50 p-8 shadow-aurora">
            <span className="eyebrow text-auroraMauve">Down Payment Assistance</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tightest text-pearl">
              Help may be closer than you think
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-dusty">
              Many first-time buyers assume they need 20% down — you usually
              don&rsquo;t. Grants and low-cost assistance programs can help
              eligible buyers with the down payment and even closing costs.
              Michigan offers programs (such as MSHDA) for qualifying buyers, and
              we&rsquo;ll help you see whether you qualify.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/#contact" className="btn-aurora group">
                See If You Qualify
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
              <a href="/preferred-partners" className="btn-outline">
                Preferred Lenders
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-40" />
        <div className="grain-soft" />
        <div className="container-lux relative z-10">
          <SectionHeading
            eyebrow="Avoid These"
            title="Common first-time buyer mistakes"
            description="The pitfalls we help our first-time buyers steer around — before they cost time or money."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mistakes.map(([t, d]) => (
              <div
                key={t}
                className="aurora-ring rounded-xl2 border border-dusty/12 bg-bruised/40 p-7"
              >
                <h3 className="text-base font-semibold text-pearl">{t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs}
        title="First-time buyer questions, answered"
        description="The questions new buyers ask us most — answered honestly."
      />

      <CrossLinks current="/first-time-buyers" />
    </PageShell>
  );
}
