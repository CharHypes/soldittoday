"use client";

import { useMemo, useState } from "react";

/**
 * Rent vs. Buy calculator. Compares the net cost of renting (rent growing over
 * time, minus what the down payment could earn invested) against buying
 * (payment + taxes + insurance + upkeep, minus equity + appreciation, net of
 * buy/sell costs) and finds the breakeven year. Estimate only.
 *
 * Fixed assumptions (kept off the UI for simplicity, stated in the note):
 *   property tax 1.35%/yr, insurance $1,400/yr, maintenance 1%/yr,
 *   buying costs 2%, selling costs 7%, down-payment investment return 4%/yr.
 */
const money = (n: number) =>
  (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const field =
  "w-full rounded-xl border border-dusty/25 bg-plum/40 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const label = "text-sm font-medium text-dusty";

const TAX_RATE = 1.35, INS_ANNUAL = 1400, MAINT_PCT = 1, BUY_PCT = 2, SELL_PCT = 7, INVEST = 4;

function monthlyPI(loan: number, ratePct: number, years: number) {
  const r = ratePct / 100 / 12, n = years * 12;
  return r > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : n > 0 ? loan / n : 0;
}
function remaining(loan: number, ratePct: number, years: number, tYears: number) {
  const r = ratePct / 100 / 12, n = years * 12, k = tYears * 12;
  if (k >= n) return 0;
  return r > 0 ? (loan * (Math.pow(1 + r, n) - Math.pow(1 + r, k))) / (Math.pow(1 + r, n) - 1) : loan * (1 - k / n);
}

export default function RentVsBuyCalculator() {
  const [rent, setRent] = useState(1800);
  const [price, setPrice] = useState(300000);
  const [down, setDown] = useState(30000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [years, setYears] = useState(7);
  const [rentGrowth, setRentGrowth] = useState(3);
  const [appr, setAppr] = useState(3);

  const c = useMemo(() => {
    const loan = Math.max(price - down, 0);
    const pi = monthlyPI(loan, rate, term);
    const pmi = price > 0 && loan / price > 0.8 ? (loan * 0.0055) / 12 : 0;
    const monthlyOwn = pi + pmi + (price * TAX_RATE) / 100 / 12 + INS_ANNUAL / 12 + (price * MAINT_PCT) / 100 / 12;
    const buyClose = (price * BUY_PCT) / 100;

    const scenario = (t: number) => {
      let rentCum = 0;
      for (let y = 1; y <= t; y++) rentCum += rent * 12 * Math.pow(1 + rentGrowth / 100, y - 1);
      const invGain = (down + buyClose) * (Math.pow(1 + INVEST / 100, t) - 1);
      const netRent = rentCum - invGain;

      const ownCum = monthlyOwn * 12 * t;
      const homeVal = price * Math.pow(1 + appr / 100, t);
      const bal = remaining(loan, rate, term, t);
      const saleProceeds = homeVal - bal - (homeVal * SELL_PCT) / 100;
      const netBuy = down + buyClose + ownCum - saleProceeds;
      return { netRent, netBuy };
    };

    let breakeven = 0;
    for (let t = 1; t <= 30; t++) {
      const s = scenario(t);
      if (s.netBuy < s.netRent) { breakeven = t; break; }
    }
    const at = scenario(years);
    const buyWins = at.netBuy < at.netRent;
    const diff = Math.abs(at.netBuy - at.netRent);
    return { breakeven, netBuy: at.netBuy, netRent: at.netRent, buyWins, diff, monthlyOwn };
  }, [rent, price, down, rate, term, years, rentGrowth, appr]);

  const barMax = Math.max(c.netBuy, c.netRent, 1);
  const w = (v: number) => `${Math.max((v / barMax) * 100, 2)}%`;

  return (
    <div className="aurora-ring overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised/40 shadow-aurora">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-6 p-6 md:p-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="rb-rent">Monthly rent</label>
              <input id="rb-rent" type="number" step={50} min={0} value={rent}
                onChange={(e) => setRent(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className={label} htmlFor="rb-price">Home price</label>
              <input id="rb-price" type="number" step={5000} min={0} value={price}
                onChange={(e) => setPrice(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="rb-down">Down payment</label>
              <input id="rb-down" type="number" step={1000} min={0} value={down}
                onChange={(e) => setDown(+e.target.value)} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className={label} htmlFor="rb-rate">Interest rate</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="rb-rate" type="number" step={0.1} min={0} max={15} value={rate}
                  onChange={(e) => setRate(+e.target.value)} className={field} />
                <span className="text-dusty">%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={label} htmlFor="rb-years">How long you&rsquo;ll stay</label>
              <span className="text-sm font-semibold text-pearl">{years} {years === 1 ? "year" : "years"}</span>
            </div>
            <input id="rb-years" type="range" min={1} max={15} step={1} value={years}
              onChange={(e) => setYears(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--aurora-mauve))]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="rb-rg">Rent increase / yr</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="rb-rg" type="number" step={0.5} min={0} max={15} value={rentGrowth}
                  onChange={(e) => setRentGrowth(+e.target.value)} className={field} />
                <span className="text-dusty">%</span>
              </div>
            </div>
            <div>
              <label className={label} htmlFor="rb-ap">Home appreciation / yr</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="rb-ap" type="number" step={0.5} min={0} max={15} value={appr}
                  onChange={(e) => setAppr(+e.target.value)} className={field} />
                <span className="text-dusty">%</span>
              </div>
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

        {/* Result */}
        <div className="flex flex-col justify-center gap-5 border-t border-dusty/15 bg-wine-sheen p-6 md:p-8 lg:border-l lg:border-t-0">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-auroraMauve">The verdict</p>
            <p className="mt-2 font-serif text-3xl font-medium leading-tight text-pearl sm:text-4xl">
              {c.breakeven > 0 ? `Buying wins after ~${c.breakeven} ${c.breakeven === 1 ? "year" : "years"}` : "Renting stays ahead 30+ years"}
            </p>
            <p className="mt-2 text-sm text-dusty">
              Over {years} {years === 1 ? "year" : "years"}, {c.buyWins ? "buying" : "renting"} could save about{" "}
              <span className="font-semibold text-pearl">{money(c.diff)}</span>.
            </p>
          </div>

          {/* Compare bars */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dusty">Net cost to buy</span>
                <span className="font-medium text-pearl">{money(c.netBuy)}</span>
              </div>
              <div className="mt-1 h-2.5 w-full rounded-full bg-plum/40">
                <div className="h-full rounded-full" style={{ width: w(c.netBuy), backgroundColor: "#8C3A63" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dusty">Net cost to rent</span>
                <span className="font-medium text-pearl">{money(c.netRent)}</span>
              </div>
              <div className="mt-1 h-2.5 w-full rounded-full bg-plum/40">
                <div className="h-full rounded-full" style={{ width: w(c.netRent), backgroundColor: "#C0872F" }} />
              </div>
            </div>
            <p className="text-[11px] text-dusty/70">Lower is better. Buying can go negative ... that means you come out ahead vs. where you started.</p>
          </div>

          <p className="text-center text-[11px] leading-relaxed text-dusty/70">
            Estimate only. Assumes ~1.35% taxes, $1,400/yr insurance, 1%/yr upkeep, 2% buying and 7% selling
            costs, and a 4%/yr return if the down payment were invested instead.
          </p>
        </div>
      </div>
    </div>
  );
}
