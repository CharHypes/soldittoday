"use client";

import type { AmenityKey } from "@/lib/amenities";
import {
  QWOME_PREF_CATEGORIES,
  QWOME_MILE_OPTIONS,
  type QwomePreference,
} from "@/lib/qwome/preferences";

/** Sensible starting radius when a viewer first enables a category. */
const DEFAULT_MILES: Record<AmenityKey, number> = {
  hospital: 10,
  school: 5,
  grocery: 5,
};

const selectCls =
  "rounded-lg border border-dusty/25 bg-plum/60 px-2.5 py-1.5 text-sm text-pearl outline-none transition-colors focus:border-auroraMauve/60";

/**
 * QWOME™ proximity-preference panel ... "Find homes that fit your life."
 * Presentational: the parent owns the prefs state (URL + localStorage synced).
 * Each category is a toggle; when on, a "within X mi" control appears. Kept
 * deliberately simple ... this strengthens the QWOME product, it is not a
 * generic "advanced filters" drawer.
 */
export default function QwomePanel({
  prefs,
  onChange,
  status,
}: {
  prefs: QwomePreference[];
  onChange: (prefs: QwomePreference[]) => void;
  status?: React.ReactNode;
}) {
  const active = new Map(prefs.map((p) => [p.category, p.maxMiles]));

  const toggle = (cat: AmenityKey) => {
    if (active.has(cat)) {
      onChange(prefs.filter((p) => p.category !== cat));
    } else {
      onChange([...prefs, { category: cat, maxMiles: DEFAULT_MILES[cat] }]);
    }
  };
  const setMiles = (cat: AmenityKey, mi: number) =>
    onChange(prefs.map((p) => (p.category === cat ? { ...p, maxMiles: mi } : p)));

  const anyActive = prefs.length > 0;

  return (
    <section className="mb-6 overflow-hidden rounded-xl2 border border-auroraMauve/25 bg-plum/50 shadow-aurora">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-auroraMauve">
              Powered by QWOME&trade;
            </p>
            <h2 className="mt-1 text-xl font-semibold text-pearl md:text-2xl">
              Find homes that fit your life
            </h2>
          </div>
          {anyActive && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-dusty underline-offset-2 transition-colors hover:text-pearl hover:underline"
            >
              Clear preferences
            </button>
          )}
        </div>

        <p className="-mt-1 text-sm text-dusty">
          Pick what matters, and we&rsquo;ll match homes to your everyday distances.
        </p>

        <div className="flex flex-col gap-2.5">
          {QWOME_PREF_CATEGORIES.map(({ key, label }) => {
            const on = active.has(key);
            return (
              <div
                key={key}
                className={[
                  "flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                  on
                    ? "border-auroraMauve/40 bg-wine/20"
                    : "border-dusty/15 bg-plum/30",
                ].join(" ")}
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => toggle(key)}
                  className="flex items-center gap-3"
                >
                  <span
                    className={[
                      "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                      on ? "bg-gradient-to-br from-gold to-auroraMauve" : "bg-dusty/30",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-0.5 h-4 w-4 rounded-full bg-pearl transition-all",
                        on ? "left-[18px]" : "left-0.5",
                      ].join(" ")}
                    />
                  </span>
                  <span className={on ? "text-sm font-medium text-pearl" : "text-sm text-dusty"}>
                    {label}
                  </span>
                </button>

                {on && (
                  <div className="ml-auto flex items-center gap-2 text-sm text-dusty">
                    <span>within</span>
                    <select
                      aria-label={`${label} distance in miles`}
                      className={selectCls}
                      value={active.get(key)}
                      onChange={(e) => setMiles(key, Number(e.target.value))}
                    >
                      {QWOME_MILE_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m} mi
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-dusty/12 pt-3 text-xs text-dusty/70">
          <span>Workplace and custom addresses are coming soon to QWOME&trade;.</span>
          {status && <span className="font-medium text-auroraMauve/90">{status}</span>}
        </div>
      </div>
    </section>
  );
}
