import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AffordabilityCalculator from "@/components/calculators/AffordabilityCalculator";
import FirstTimeBuyerCallout from "@/components/FirstTimeBuyerCallout";

export const metadata: Metadata = {
  title: "How Much House Can I Afford? | SOLD IT TODAY",
  description:
    "Find out how much house you can afford in Southeast Michigan. SOLD IT TODAY's free affordability calculator uses the lender 28/36 rule with your income, debts, and down payment.",
};

export default function AffordabilityCalculatorPage() {
  return (
    <PageShell
      eyebrow="Calculators"
      title="How much house can I afford?"
      description="Enter your income, monthly debts, and down payment, and we'll estimate your comfortable price range using the same 28/36 rule lenders start with."
    >
      <section className="relative bg-plum py-14 md:py-20">
        <div className="container-lux max-w-5xl space-y-10">
          <AffordabilityCalculator />

          <FirstTimeBuyerCallout />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl2 border border-dusty/12 bg-bruised/40 p-6">
              <h2 className="text-lg font-semibold text-pearl">How the 28/36 rule works</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dusty">
                <li><span className="font-medium text-pearl/90">28% ... housing</span>: your total house payment stays at or under 28% of your gross monthly income.</li>
                <li><span className="font-medium text-pearl/90">36% ... all debts</span>: your house payment plus car, student loans, and card minimums stays at or under 36%.</li>
                <li>Lenders may stretch these with strong credit or certain programs ... this is a comfortable starting point, not a ceiling.</li>
              </ul>
            </div>
            <div className="rounded-xl2 border border-dusty/12 bg-bruised/40 p-6">
              <h2 className="text-lg font-semibold text-pearl">Turn a number into a plan</h2>
              <p className="mt-3 text-sm leading-relaxed text-dusty">
                A range is a great start ... a real pre-approval makes your offer competitive, and there may be down payment
                assistance that stretches your budget further. We can connect you with a trusted lender.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/#contact" className="btn-aurora group">
                  Talk with our team
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </a>
                <a href="/resources/mortgage-calculator" className="btn-outline">Mortgage calculator</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
