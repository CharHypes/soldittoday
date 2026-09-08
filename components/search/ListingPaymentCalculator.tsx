"use client";

import { useMemo, useState } from "react";

/**
 * Compact monthly-payment estimator for the listing detail page. Prefilled with
 * the home's price; adjust down payment, rate, term, taxes, insurance (PMI auto-
 * applies under 20% down). Estimate only, not a loan offer. Ends with a natural
 * financing CTA to Sold It Today's lender partners.
 */
const money = (n: number) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const field =
  "w-full rounded-lg border border-dusty/25 bg-plum/40 px-3 py-2 text-sm text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "text-xs font-medium text-dusty";

export default function ListingPaymentCalculator({ price: initialPrice }: { price: number }) {
  const base = initialPrice > 0 ? initialPrice : 300000;
  const [price, setPrice] = useState(base);
  const [downPct, setDownPct] = useState(10);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [taxAnnual, setTaxAnnual] = useState(Math.round(base * 0.0135));
  const [insAnnual, setInsAnnual] = useState(1400);

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
    return { down, loan, pi, pmi, tax, ins, total: pi + tax + ins + pmi };
  }, [price, downPct, rate, term, taxAnnual, insAnnual]);

  const numSetter = (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setter(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0);

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Estimated monthly payment</h2>
      <div className="mt-3 aurora-ring rounded-xl2 border border-dusty/15 bg-bruised/40 p-5 shadow-aurora md:p-6">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-semibold text-pearl md:text-4xl">{money(c.total)}</span>
          <span className="text-sm text-dusty">/mo estimated</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dusty">
          <span>P&amp;I {money(c.pi)}</span>
          <span>Tax {money(c.tax)}</span>
          <span>Insurance {money(c.ins)}</span>
          {c.pmi > 0 && <span>PMI {money(c.pmi)}</span>}
          <span className="text-dusty/70">
            · {downPct}% down = {money(c.down)} · loan {money(c.loan)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label className={lbl}>Home price</label>
            <input className={field} inputMode="numeric" value={price.toLocaleString("en-US")} onChange={numSetter(setPrice)} />
          </div>
          <div>
            <label className={lbl}>Down payment %</label>
            <input className={field} inputMode="numeric" value={downPct} onChange={numSetter(setDownPct)} />
          </div>
          <div>
            <label className={lbl}>Interest rate %</label>
            <input className={field} inputMode="decimal" value={rate} onChange={numSetter(setRate)} />
          </div>
          <div>
            <label className={lbl}>Loan term</label>
            <select className={field} value={term} onChange={(e) => setTerm(Number(e.target.value))}>
              <option value={30}>30 yr</option>
              <option value={20}>20 yr</option>
              <option value={15}>15 yr</option>
              <option value={10}>10 yr</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Property tax / yr</label>
            <input className={field} inputMode="numeric" value={taxAnnual.toLocaleString("en-US")} onChange={numSetter(setTaxAnnual)} />
          </div>
          <div>
            <label className={lbl}>Insurance / yr</label>
            <input className={field} inputMode="numeric" value={insAnnual.toLocaleString("en-US")} onChange={numSetter(setInsAnnual)} />
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-dusty/70">
          Estimate only, not a loan offer.{c.pmi > 0 ? " Includes estimated PMI (under 20% down)." : ""} Taxes and insurance are estimates ... your lender will confirm exact figures.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dusty/12 pt-4">
          <p className="text-sm text-pearl/90">Want help understanding your financing options?</p>
          <a href="/preferred-partners#lenders" className="btn-aurora group text-sm">
            Talk to our lenders
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
