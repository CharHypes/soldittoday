import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import RentVsBuyCalculator from "@/components/calculators/RentVsBuyCalculator";
import FirstTimeBuyerCallout from "@/components/FirstTimeBuyerCallout";

export const metadata: Metadata = {
  title: "Rent vs. Buy Calculator | SOLD IT TODAY",
  description:
    "Should you rent or buy in Southeast Michigan? SOLD IT TODAY's rent-vs-buy calculator finds the breakeven year using rent growth, home appreciation, equity, and buying/selling costs.",
};

export default function RentVsBuyCalculatorPage() {
  return (
    <PageShell
      eyebrow="Calculators"
      title="Rent vs. buy"
      description="Renting isn't 'throwing money away,' and buying isn't always cheaper. Put in your numbers and see the year buying actually pulls ahead ... for how long you'll really stay."
      heroBackground="/assets/pages/calc-rent-vs-buy.jpg"
    >
      <section className="relative bg-plum py-14 md:py-20">
        <div className="container-lux max-w-5xl space-y-10">
          <RentVsBuyCalculator />

          <FirstTimeBuyerCallout />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl2 border border-dusty/12 bg-bruised/40 p-6">
              <h2 className="text-lg font-semibold text-pearl">What tips the scale</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dusty">
                <li><span className="font-medium text-pearl/90">How long you stay</span> ... buying&rsquo;s upfront and selling costs need years to earn back. The longer you stay, the more buying wins.</li>
                <li><span className="font-medium text-pearl/90">Rent growth</span> ... a fixed mortgage stays put while rent climbs every year.</li>
                <li><span className="font-medium text-pearl/90">Appreciation &amp; equity</span> ... each payment builds ownership, and the home may gain value.</li>
              </ul>
            </div>
            <div className="rounded-xl2 border border-dusty/12 bg-bruised/40 p-6">
              <h2 className="text-lg font-semibold text-pearl">Thinking it through?</h2>
              <p className="mt-3 text-sm leading-relaxed text-dusty">
                Every situation is different ... let&rsquo;s talk through your timeline and goals, run your real numbers, and figure
                out what actually makes sense for you. No pressure.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/#contact" className="btn-aurora group">
                  Talk with our team
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </a>
                <a href="/resources/affordability-calculator" className="btn-outline">Affordability calculator</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
