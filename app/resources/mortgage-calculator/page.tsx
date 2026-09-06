import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import FirstTimeBuyerCallout from "@/components/FirstTimeBuyerCallout";

export const metadata: Metadata = {
  title: "Michigan Mortgage Calculator | SOLD IT TODAY",
  description:
    "Estimate your full monthly mortgage payment for a Southeast Michigan home ... principal & interest, property taxes, insurance, PMI, and HOA ... with SOLD IT TODAY's free mortgage calculator.",
};

export default function MortgageCalculatorPage() {
  return (
    <PageShell
      eyebrow="Calculators"
      title="Michigan mortgage calculator"
      description="See your real monthly payment ... not just principal and interest, but taxes, insurance, and PMI too. Adjust the numbers and watch it update live."
    >
      <section className="relative bg-plum py-14 md:py-20">
        <div className="container-lux max-w-5xl space-y-10">
          <MortgageCalculator />

          <FirstTimeBuyerCallout />

          {/* What's included */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl2 border border-dusty/12 bg-bruised/40 p-6">
              <h2 className="text-lg font-semibold text-pearl">What&rsquo;s in your monthly payment</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dusty">
                <li><span className="font-medium text-pearl/90">Principal &amp; interest</span> ... paying down the loan plus the cost of borrowing.</li>
                <li><span className="font-medium text-pearl/90">Property taxes</span> ... Michigan averages roughly 1.3&ndash;1.5% of value a year; your city and the Homestead Exemption matter.</li>
                <li><span className="font-medium text-pearl/90">Homeowners insurance</span> ... protects the home; lenders require it.</li>
                <li><span className="font-medium text-pearl/90">PMI</span> ... added when you put less than 20% down; it drops off as you build equity.</li>
                <li><span className="font-medium text-pearl/90">HOA dues</span> ... only some communities and condos.</li>
              </ul>
            </div>
            <div className="rounded-xl2 border border-dusty/12 bg-bruised/40 p-6">
              <h2 className="text-lg font-semibold text-pearl">Ready for real numbers?</h2>
              <p className="mt-3 text-sm leading-relaxed text-dusty">
                A calculator is a great start, but a lender can get you an actual rate and a pre-approval ... and we can point you to
                a trusted one. First-time buyer? You may qualify for down payment assistance too.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/#contact" className="btn-aurora group">
                  Talk with our team
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </a>
                <a href="/dpa" className="btn-outline">Down payment assistance</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
