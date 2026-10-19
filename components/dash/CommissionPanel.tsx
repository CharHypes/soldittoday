"use client";

import { useMemo, useState } from "react";
import { saveCommission } from "@/app/dashboard/actions";

export type CommissionInit = {
  sale_price: number | null;      // commission_sale_price ?? price
  rate: number | null;            // commission_rate (%)
  flat: number | null;            // commission_flat ($)
  referral_pct: number | null;
  referral_to: string | null;
  sit_fee: number | null;
  splits: { name: string; pct: number }[] | null;
  notes: string | null;
};

type Split = { name: string; pct: number };

const usd = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n: number) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
const DEFAULT_SPLITS: Split[] = [{ name: "Charlotte", pct: 80 }, { name: "Christopher", pct: 20 }];

export default function CommissionPanel({ txId, address, init, scope = "transaction" }: { txId: string; address: string | null; init: CommissionInit; scope?: "transaction" | "listing" }) {
  const [salePrice, setSalePrice] = useState(init.sale_price ?? 0);
  const [useFlat, setUseFlat] = useState(init.flat != null && init.flat > 0);
  const [rate, setRate] = useState(init.rate ?? 3);
  const [flat, setFlat] = useState(init.flat ?? 0);
  const [referralPct, setReferralPct] = useState(init.referral_pct ?? 0);
  const [referralTo, setReferralTo] = useState(init.referral_to ?? "");
  const [sitFee, setSitFee] = useState(init.sit_fee ?? 695);
  const [splits, setSplits] = useState<Split[]>(init.splits?.length ? init.splits : DEFAULT_SPLITS);
  const [notes, setNotes] = useState(init.notes ?? "");
  const [copied, setCopied] = useState(false);

  const c = useMemo(() => {
    const gross = useFlat ? flat : salePrice * (rate / 100);
    const referralAmt = gross * (referralPct / 100);
    const afterReferral = gross - referralAmt;
    // The transaction fee is NOT taken off the top ... it is a separate flat fee
    // paid to Sold It Today. The team split is on the full (after-referral) net.
    const net = afterReferral;
    const splitPctTotal = splits.reduce((s, x) => s + (Number.isFinite(x.pct) ? x.pct : 0), 0);
    const rows = splits.map((s) => ({ name: s.name, pct: s.pct, amount: net * (s.pct / 100) }));
    return { gross, referralAmt, afterReferral, net, splitPctTotal, rows };
  }, [useFlat, flat, salePrice, rate, referralPct, sitFee, splits]);

  // SkySlope breakdown: only the team splits + the transaction fee (to SIT),
  // ready to paste straight into SkySlope notes (no header line).
  const breakdown = useMemo(() => {
    const L: string[] = [];
    c.rows.forEach((r) => L.push(`${r.name || "Agent"}: ${pct(r.pct)} = ${usd(r.amount)}`));
    if (sitFee > 0) L.push(`Transaction fee (to Sold It Today): ${usd(sitFee)}`);
    return L.join("\n");
  }, [c, sitFee]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(breakdown); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };

  const num = "w-full rounded-md border border-dusty/20 bg-plum/50 px-2.5 py-1.5 text-right text-sm text-pearl outline-none focus:border-auroraMauve/60";
  const txt = "w-full rounded-md border border-dusty/20 bg-plum/50 px-2.5 py-1.5 text-sm text-pearl outline-none focus:border-auroraMauve/60";
  const lbl = "text-[10.5px] font-semibold uppercase tracking-[0.07em] text-dusty";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* inputs */}
      <div className="bo-card space-y-4">
        <div className="bo-card-title">Commission ... owner only <span className="text-dusty/60">🔒</span></div>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1"><span className={lbl}>Sale price</span>
            <MoneyInput value={salePrice} onChange={setSalePrice} className={num} /></label>
          <div className="space-y-1">
            <span className={lbl}>Commission</span>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setUseFlat(false)} className={`rounded-md px-2 py-1.5 text-xs ${!useFlat ? "bg-wine text-pearl" : "border border-dusty/20 text-dusty"}`}>%</button>
              <button type="button" onClick={() => setUseFlat(true)} className={`rounded-md px-2 py-1.5 text-xs ${useFlat ? "bg-wine text-pearl" : "border border-dusty/20 text-dusty"}`}>Flat $</button>
              {useFlat
                ? <div className="flex-1"><MoneyInput value={flat} onChange={setFlat} className={num} /></div>
                : <div className="relative flex-1"><input type="number" inputMode="decimal" step="0.01" style={{ textAlign: "right" }} className={`${num} pr-6`} value={rate || ""} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} /><span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-dusty">%</span></div>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1"><span className={lbl}>Referral off the top</span>
            <div className="relative"><input type="number" inputMode="decimal" step="0.01" className={`${num} pr-6`} value={referralPct || ""} onChange={(e) => setReferralPct(parseFloat(e.target.value) || 0)} /><span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-dusty">%</span></div></label>
          <label className="space-y-1"><span className={lbl}>Referral paid to</span>
            <input className={txt} placeholder="Name / brokerage" value={referralTo} onChange={(e) => setReferralTo(e.target.value)} /></label>
        </div>

        <label className="block space-y-1"><span className={lbl}>Transaction fee <span className="font-normal normal-case tracking-normal text-dusty/60">· flat, paid to Sold It Today</span></span>
          <div className="max-w-[160px]"><MoneyInput value={sitFee} onChange={setSitFee} className={num} /></div></label>

        {/* splits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={lbl}>Team split</span>
            <span className={`text-[11px] ${Math.round(c.splitPctTotal) === 100 ? "text-dusty/70" : "text-gold"}`}>{pct(c.splitPctTotal)} of net{Math.round(c.splitPctTotal) === 100 ? "" : " ... should total 100%"}</span>
          </div>
          {splits.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={txt} value={s.name} placeholder="Name" onChange={(e) => setSplits(splits.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <div className="relative w-24 shrink-0"><input type="number" inputMode="decimal" step="0.01" style={{ textAlign: "right" }} className={`${num} pr-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`} value={s.pct || ""} onChange={(e) => setSplits(splits.map((x, j) => j === i ? { ...x, pct: parseFloat(e.target.value) || 0 } : x))} /><span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-dusty">%</span></div>
              <span className="w-24 shrink-0 text-right text-sm text-pearl/90">{usd(c.rows[i]?.amount ?? 0)}</span>
              {splits.length > 1 && <button type="button" onClick={() => setSplits(splits.filter((_, j) => j !== i))} className="text-dusty hover:text-red-400" aria-label="Remove">×</button>}
            </div>
          ))}
          <button type="button" onClick={() => setSplits([...splits, { name: "", pct: 0 }])} className="text-xs text-auroraMauve hover:text-pearl">+ Add person</button>
        </div>

        <label className="block space-y-1"><span className={lbl}>Notes</span>
          <textarea rows={2} className={txt} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything to remember about this commission..." /></label>

        {/* save */}
        <form action={saveCommission} className="pt-1">
          <input type="hidden" name="id" value={txId} />
          <input type="hidden" name="scope" value={scope} />
          <input type="hidden" name="commission_sale_price" value={salePrice} />
          <input type="hidden" name="commission_rate" value={useFlat ? "" : rate} />
          <input type="hidden" name="commission_flat" value={useFlat ? flat : ""} />
          <input type="hidden" name="referral_pct" value={referralPct} />
          <input type="hidden" name="referral_to" value={referralTo} />
          <input type="hidden" name="sit_fee" value={sitFee} />
          <input type="hidden" name="commission_splits" value={JSON.stringify(splits)} />
          <input type="hidden" name="commission_notes" value={notes} />
          <button type="submit" className="btn-aurora">Save commission</button>
        </form>
      </div>

      {/* summary + breakdown */}
      <div className="space-y-5">
        <div className="bo-card">
          <div className="bo-card-title">Summary</div>
          <dl className="space-y-2 text-sm">
            <Row k="Gross commission" v={usd(c.gross)} />
            {referralPct > 0 && <Row k={`Referral${referralTo ? ` ... ${referralTo}` : ""} (${pct(referralPct)})`} v={`-${usd(c.referralAmt)}`} muted />}
            {referralPct > 0 && <Row k="After referral" v={usd(c.afterReferral)} />}
            <div className="my-1 border-t border-dusty/12" />
            <Row k="Net commission" v={usd(c.net)} strong />
            <div className="my-1 border-t border-dusty/12" />
            {c.rows.map((r, i) => <Row key={i} k={`${r.name || "Unnamed"} (${pct(r.pct)})`} v={usd(r.amount)} />)}
            {sitFee > 0 && <div className="my-1 border-t border-dusty/12" />}
            {sitFee > 0 && <Row k="Transaction fee ... to Sold It Today" v={usd(sitFee)} muted />}
          </dl>
        </div>

        <div className="bo-card">
          <div className="bo-card-title">SkySlope breakdown<button type="button" onClick={copy} className="bo-btn" style={{ height: 26 }}>{copied ? "Copied ✓" : "Copy"}</button></div>
          <pre className="whitespace-pre-wrap rounded-lg border border-dusty/12 bg-plum/40 p-3 font-mono text-[12px] leading-relaxed text-pearl/90">{breakdown}</pre>
        </div>
      </div>
    </div>
  );
}

// Money input: shows "$1,234.56" at rest (dollar sign, commas, 2 decimals),
// and a clean editable number while focused. Stores a plain number.
function MoneyInput({ value, onChange, className }: { value: number; onChange: (n: number) => void; className: string }) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const shown = focused
    ? draft
    : value
      ? value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "";
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-dusty">$</span>
      <input
        type="text" inputMode="decimal" style={{ textAlign: "right" }}
        className={`${className} pl-6`}
        value={shown}
        onFocus={() => { setDraft(value ? String(value) : ""); setFocused(true); }}
        onChange={(e) => { const raw = e.target.value.replace(/[^0-9.]/g, ""); setDraft(raw); onChange(parseFloat(raw) || 0); }}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function Row({ k, v, strong, muted }: { k: string; v: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={muted ? "text-dusty/70" : "text-dusty"}>{k}</dt>
      <dd className={`tabular-nums ${strong ? "text-base font-semibold text-pearl" : muted ? "text-dusty/80" : "text-pearl/90"}`}>{v}</dd>
    </div>
  );
}
