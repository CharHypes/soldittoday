"use client";

import { useState, useTransition } from "react";
import { addSnapshot, parseListTracEmail, type ParsedSnapshot } from "@/app/dashboard/actions";

const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "block text-sm text-dusty";

/**
 * Paste a weekly ListTrac email, have it parsed into this listing's engagement
 * snapshot shape, REVIEW/edit the numbers, then save. Saving reuses the existing
 * addSnapshot action (agent-scoped RLS). Nothing is sent or published to the
 * seller; the saved snapshot simply becomes available (latest stats + the AI
 * seller-update drafter). Shown only when AI parsing is enabled.
 */
export default function ListTracImport({
  listingId,
  address,
}: {
  listingId: string;
  address: string;
}) {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsing, startParse] = useTransition();

  const onParse = () => {
    setError(null);
    startParse(async () => {
      const res = await parseListTracEmail(raw, address);
      if (res.ok) setParsed(res.data);
      else setError(res.error);
    });
  };

  const reset = () => {
    setParsed(null);
    setRaw("");
    setError(null);
  };

  const card = "aurora-ring rounded-xl2 border border-dusty/15 bg-plum/50 p-6";

  if (parsed) {
    return (
      <form
        action={async (fd) => {
          await addSnapshot(fd);
          reset();
        }}
        className={`${card} space-y-4`}
      >
        <input type="hidden" name="listing_id" value={listingId} />
        <input type="hidden" name="source" value="listtrac" />
        <input type="hidden" name="by_source" value={JSON.stringify(parsed.by_source)} />
        <input type="hidden" name="by_city" value={JSON.stringify(parsed.by_city)} />

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-pearl">Review parsed stats</p>
          <button type="button" onClick={reset} className="text-xs text-dusty hover:text-pearl">
            Start over
          </button>
        </div>
        <p className="text-xs text-dusty">
          Pulled from your ListTrac email. Check the numbers, edit anything that looks off, then save.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <label className={lbl}>Views<input name="total_views" inputMode="numeric" defaultValue={parsed.total_views ?? ""} className={`mt-1.5 ${inp}`} /></label>
          <label className={lbl}>Shares<input name="shares" inputMode="numeric" defaultValue={parsed.shares ?? ""} className={`mt-1.5 ${inp}`} /></label>
          <label className={lbl}>Favorites<input name="favorites" inputMode="numeric" defaultValue={parsed.favorites ?? ""} className={`mt-1.5 ${inp}`} /></label>
          <label className={lbl}>Returning %<input name="returning_pct" inputMode="numeric" defaultValue={parsed.returning_pct ?? ""} className={`mt-1.5 ${inp}`} /></label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className={lbl}>Period start<input type="date" name="period_start" defaultValue={parsed.period_start ?? ""} className={`mt-1.5 ${inp}`} /></label>
          <label className={lbl}>Period end<input type="date" name="period_end" defaultValue={parsed.period_end ?? ""} className={`mt-1.5 ${inp}`} /></label>
        </div>

        {(parsed.by_source.length > 0 || parsed.by_city.length > 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {parsed.by_source.length > 0 && (
              <div>
                <p className="text-xs font-medium text-dusty">Views by site</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {parsed.by_source.map((s) => (
                    <span key={s.site} className="rounded-full border border-dusty/20 bg-plum/40 px-2 py-0.5 text-[11px] text-dusty">
                      {s.site}: {s.views.toLocaleString("en-US")}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parsed.by_city.length > 0 && (
              <div>
                <p className="text-xs font-medium text-dusty">Views by city</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {parsed.by_city.map((c) => (
                    <span key={c.city} className="rounded-full border border-dusty/20 bg-plum/40 px-2 py-0.5 text-[11px] text-dusty">
                      {c.city}: {c.views.toLocaleString("en-US")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="submit" className="btn-aurora">Save snapshot</button>
          <span className="text-xs text-dusty/70">Saved to this listing only. Nothing is sent to the seller.</span>
        </div>
      </form>
    );
  }

  return (
    <div className={`${card} space-y-3`}>
      <p className="text-sm font-semibold text-pearl">Import from ListTrac email</p>
      <p className="text-xs text-dusty">
        Paste your weekly ListTrac email below and we&rsquo;ll pull out this listing&rsquo;s numbers for you to review before saving.
      </p>
      <textarea
        rows={6}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Paste the full contents of the ListTrac weekly email here..."
        className={inp}
      />
      {error && <p className="text-xs text-rose-300">{error}</p>}
      <button
        type="button"
        onClick={onParse}
        disabled={parsing || raw.trim().length < 20}
        className="btn-aurora disabled:opacity-50"
      >
        {parsing ? "Reading email..." : "Parse email"}
      </button>
    </div>
  );
}
