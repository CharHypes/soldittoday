"use client";

import { useMemo, useState } from "react";

/**
 * Affordability calculator ... "how much house can I afford?" Uses the lender
 * 28/36 rule (housing <= 28% of gross income, housing + debts <= 36%) and solves
 * backward to a max home price, accounting for taxes, insurance, PMI, and HOA.
 * Estimate only ... not a pre-approval.
 */
const money = (n: number) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const field =
  "w-full rounded-xl border border-dusty/25 bg-plum/40 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const label = "text-sm font-medium text-dusty";

function amort(loan: number, ratePct: number, years: number) {
  const r = ratePct / 100 / 12;
  const n = years * 12;
  return r > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : n > 0 ? loan / n : 0;
}

export default function AffordabilityCalculator() {
  const [income, setIncome] = useState(90000);
  const [debts, setDebts] = useState(500);
  const [down, setDown] = useState(20000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [taxRate, setTaxRate] = useState(1.35);
  const [insAnnual, setInsAnnual] = useState(1400);
  const [hoa, setHoa] = useState(0);

  const c = useMemo(() => {
    const mIncome = income / 12;
    const maxHousing = Math.max(Math.min(mIncome * 0.28, mIncome * 0.36 - debts), 0);
    const monthlyAt = (P: number) => {
      const loan = Math.max(P - down, 0);
      const pi = amort(loan, rate, term);
      const pmi = P > 0 && loan / P > 0.8 ? (loan * 0.0055) / 12 : 0;
      const tax = (P * taxRate) / 100 / 12;
      const ins = insAnnual / 12;
      return { total: pi + pmi + tax + ins + hoa, pi, pmi, tax, ins, loan };
    };
    let lo = 0;
    let hi = 5_000_000;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (monthlyAt(mid).total <= maxHousing) lo = mid;
      else hi = mid;
    }
    const price = Math.floor(lo / 1000) * 1000;
    const at = monthlyAt(price);
    return { mIncome, maxHousing, price, ...at };
  }, [income, debts, down, rate, term, taxRate, insAnnual, hoa]);

  return (
    <div className="aurora-ring overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised/40 shadow-aurora">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-6 p-6 md:p-8">
          <div>
            <div className="flex items-center justify-between">
              <label className={label} htmlFor="af-income">Annual household income</label>
              <span className="text-sm font-semibold text-pearl">{money(income)}</span>
            </div>
            <input id="af-income" type="range" min={25000} max={400000} step={2500} value={income}
              onChange={(e) => setIncome(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--aurora-mauve))]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="af-debts">Monthly debts</label>
              <input id="af-debts" type="number" step={25} min={0} value={debts}
                onChange={(e) => setDebts(+e.target.value)} className={`mt-1.5 ${field}`} />
              <p className="mt-1 text-[11px] text-dusty/70">Car, student loans, cards, etc.</p>
            </div>
            <div>
              <label className={label} htmlFor="af-down">Down payment</label>
              <input id="af-down" type="number" step={1000} min={0} value={down}
                onChange={(e) => setDown(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="af-rate">Interest rate</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="af-rate" type="number" step={0.1} min={0} max={15} value={rate}
                  onChange={(e) => setRate(+e.target.value)} className={field} />
                <span className="text-dusty">%</span>
              </div>
            </div>
            <div>
              <span className={label}>Loan term</span>
              <div className="mt-1.5 flex gap-2">
                {[15, 30].map((t) => (
                  <button key={t} type="button" onClick={() => setTerm(t)}
                    className={[
                      "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                      term === t ? "border-transparent bg-gradient-to-br from-gold to-auroraMauve text-plum" : "border-dusty/25 text-dusty hover:border-dusty/50",
                    ].join(" ")}>
                    {t} yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={label} htmlFor="af-tax">Property tax rate</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="af-tax" type="number" step={0.05} min={0} max={5} value={taxRate}
                  onChange={(e) => setTaxRate(+e.target.value)} className={field} />
                <span className="text-dusty">%</span>
              </div>
            </div>
            <div>
              <label className={label} htmlFor="af-ins">Insurance / yr</label>
              <input id="af-ins" type="number" step={100} min={0} value={insAnnual}
                onChange={(e) => setInsAnnual(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className={label} htmlFor="af-hoa">HOA / mo</label>
              <input id="af-hoa" type="number" step={10} min={0} value={hoa}
                onChange={(e) => setHoa(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col justify-center gap-5 border-t border-dusty/15 bg-wine-sheen p-6 md:p-8 lg:border-l lg:border-t-0">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-auroraMauve">You could afford up to</p>
            <p className="mt-2 font-serif text-5xl font-medium text-pearl">{money(c.price)}</p>
            <p className="mt-1 text-sm text-dusty">about {money(c.total)}/mo &middot; {money(c.loan)} loan</p>
          </div>

          <div className="space-y-2 rounded-xl border border-dusty/12 bg-plum/30 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-dusty">Monthly income</span>
              <span className="font-medium text-pearl">{money(c.mIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dusty">Max housing budget (28/36)</span>
              <span className="font-medium text-pearl">{money(c.maxHousing)}/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dusty">Est. taxes + insurance</span>
              <span className="font-medium text-pearl">{money(c.tax + c.ins)}/mo</span>
            </div>
          </div>

          <p className="text-center text-[11px] leading-relaxed text-dusty/70">
            Based on the lender 28/36 rule. Estimate only ... your actual approval depends on credit, the
            full application, and program. Talk to a lender to get pre-approved.
          </p>
        </div>
      </div>
    </div>
  );
}
