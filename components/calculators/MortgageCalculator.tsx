"use client";

import { useMemo, useState } from "react";

/**
 * Mortgage payment calculator. Estimates the full monthly payment (principal &
 * interest + taxes + insurance + PMI + HOA) in real time. Estimate only ... not
 * a loan offer. Theme-aware via brand tokens.
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

export default function MortgageCalculator() {
  const [price, setPrice] = useState(300000);
  const [downPct, setDownPct] = useState(10);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [taxAnnual, setTaxAnnual] = useState(4050);
  const [insAnnual, setInsAnnual] = useState(1400);
  const [hoa, setHoa] = useState(0);

  const c = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = Math.max(price - down, 0);
    const ltv = price > 0 ? loan / price : 0;
    const mr = rate / 100 / 12;
    const n = term * 12;
    const pi = mr > 0 ? (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : n > 0 ? loan / n : 0;
    const pmi = ltv > 0.8 ? (loan * 0.0055) / 12 : 0;
    const tax = taxAnnual / 12;
    const ins = insAnnual / 12;
    const total = pi + tax + ins + hoa + pmi;
    return { down, loan, ltv, pi, pmi, tax, ins, total };
  }, [price, downPct, rate, term, taxAnnual, insAnnual, hoa]);

  // Fixed, saturated colors so every segment reads on BOTH the dark and the
  // light (mauve) result panel ... theme tokens washed out in light mode.
  const segments = [
    { key: "pi", label: "Principal & interest", value: c.pi, hex: "#8C3A63" },
    { key: "tax", label: "Property tax", value: c.tax, hex: "#C0872F" },
    { key: "ins", label: "Home insurance", value: c.ins, hex: "#C77D97" },
    ...(c.pmi > 0 ? [{ key: "pmi", label: "PMI", value: c.pmi, hex: "#6E5364" }] : []),
    ...(hoa > 0 ? [{ key: "hoa", label: "HOA dues", value: hoa, hex: "#5A2E48" }] : []),
  ];
  const totalForBar = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div className="aurora-ring overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised/40 shadow-aurora">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-6 p-6 md:p-8">
          {/* Home price */}
          <div>
            <div className="flex items-center justify-between">
              <label className={label} htmlFor="mc-price">Home price</label>
              <span className="text-sm font-semibold text-pearl">{money(price)}</span>
            </div>
            <input id="mc-price" type="range" min={50000} max={1500000} step={5000} value={price}
              onChange={(e) => setPrice(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--aurora-mauve))]" />
          </div>

          {/* Down payment */}
          <div>
            <div className="flex items-center justify-between">
              <label className={label} htmlFor="mc-down">Down payment</label>
              <span className="text-sm font-semibold text-pearl">{downPct}% &middot; {money(c.down)}</span>
            </div>
            <input id="mc-down" type="range" min={0} max={50} step={1} value={downPct}
              onChange={(e) => setDownPct(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--aurora-mauve))]" />
            {c.ltv > 0.8 && (
              <p className="mt-1 text-xs text-dusty">Under 20% down ... PMI is included in your estimate.</p>
            )}
          </div>

          {/* Rate + term */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="mc-rate">Interest rate</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="mc-rate" type="number" step={0.1} min={0} max={15} value={rate}
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

          {/* Taxes / insurance / HOA */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={label} htmlFor="mc-tax">Property tax / yr</label>
              <input id="mc-tax" type="number" step={100} min={0} value={taxAnnual}
                onChange={(e) => setTaxAnnual(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className={label} htmlFor="mc-ins">Insurance / yr</label>
              <input id="mc-ins" type="number" step={100} min={0} value={insAnnual}
                onChange={(e) => setInsAnnual(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className={label} htmlFor="mc-hoa">HOA / mo</label>
              <input id="mc-hoa" type="number" step={10} min={0} value={hoa}
                onChange={(e) => setHoa(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col justify-center gap-5 border-t border-dusty/15 bg-wine-sheen p-6 md:p-8 lg:border-l lg:border-t-0">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-auroraMauve">Estimated monthly payment</p>
            <p className="mt-2 font-serif text-5xl font-medium text-pearl">{money(c.total)}</p>
            <p className="mt-1 text-sm text-dusty">on a {money(c.loan)} loan</p>
          </div>

          {/* Stacked bar */}
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-plum/40">
            {segments.map((s) => (
              <div key={s.key} style={{ width: `${(s.value / totalForBar) * 100}%`, backgroundColor: s.hex }} />
            ))}
          </div>

          {/* Breakdown */}
          <ul className="space-y-2">
            {segments.map((s) => (
              <li key={s.key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-dusty">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.hex }} />
                  {s.label}
                </span>
                <span className="font-medium text-pearl">{money(s.value)}/mo</span>
              </li>
            ))}
          </ul>

          <p className="text-center text-[11px] leading-relaxed text-dusty/70">
            Estimate only ... not a loan offer or approval. Actual rate, taxes, insurance, and PMI vary.
            Talk to a lender for real numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
