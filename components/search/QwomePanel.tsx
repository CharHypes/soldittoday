"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  QWOME_CATALOG,
  QWOME_GROUPS,
  QWOME_MILE_OPTIONS,
  catalogEntry,
  defaultMilesFor,
  isMeasurable,
  type QwomeCategoryId,
  type QwomePreference,
} from "@/lib/qwome/preferences";

const selectCls =
  "rounded-lg border border-dusty/25 bg-plum/60 px-2.5 py-1.5 text-sm text-pearl outline-none transition-colors focus:border-auroraMauve/60";

/**
 * QWOME™ proximity-preference panel ... "Find homes that fit your life."
 *
 * The card itself stays COMPACT: brand line, one supporting sentence, a single
 * "Choose what matters to you" button, and chips for whatever the viewer has
 * already selected. Picking priorities happens in a clean, scrollable modal
 * (multi-select over the full 13-category catalog) rather than a long inline
 * list ... which keeps the mobile experience tidy and never expands everything
 * on the card. The parent owns the prefs state (URL + localStorage synced); this
 * component only edits and hands it back through onChange.
 *
 * This strengthens the QWOME product ... it is not a generic "advanced filters"
 * drawer. The picker is driven entirely by the QWOME_CATALOG data model, so new
 * categories (and, later, per-category address entry + drive-time) appear here
 * with no structural change.
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
  const [open, setOpen] = useState(false);

  // Lock the page behind the modal while it's open (mobile-first).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = prefs
    .map((p) => ({ pref: p, entry: catalogEntry(p.category) }))
    .filter((x) => x.entry) as { pref: QwomePreference; entry: NonNullable<ReturnType<typeof catalogEntry>> }[];
  const anySelected = selected.length > 0;

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
          {anySelected && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-dusty underline-offset-2 transition-colors hover:text-pearl hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <p className="-mt-1 text-sm text-dusty">
          Choose the places and everyday destinations that matter most to you.
        </p>

        {/* Selected priorities ... only what the viewer picked, shown compactly. */}
        {anySelected && (
          <ul className="flex flex-wrap gap-2">
            {selected.map(({ pref, entry }) => (
              <li
                key={entry.id === "custom" ? `custom-${pref.id ?? pref.label ?? entry.id}` : entry.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-auroraMauve/40 bg-wine/25 px-3 py-1.5 text-sm text-pearl"
              >
                <span aria-hidden className="text-[15px] leading-none">{entry.icon}</span>
                <span className="font-medium">
                  {entry.id === "custom" && pref.label ? pref.label : entry.short}
                </span>
                {isMeasurable(entry.id) && pref.maxMiles != null && (
                  <span className="text-xs text-dusty">· {pref.maxMiles} mi</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-auroraMauve/45 bg-gradient-to-br from-gold/20 to-auroraMauve/20 px-4 py-2.5 text-sm font-semibold text-pearl transition-colors hover:from-gold/30 hover:to-auroraMauve/30"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-auroraMauve" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 6h14M6 10h8M9 14h2" />
            </svg>
            {anySelected ? "Edit what matters to you" : "Choose what matters to you"}
          </button>
          {status && <span className="text-xs font-medium text-auroraMauve/90">{status}</span>}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <QwomeModal
            prefs={prefs}
            onChange={onChange}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * The multi-select picker. Mobile-first: a bottom sheet on small screens, a
 * centered dialog on sm+. Scrolls its body so the whole 13-category catalog is
 * reachable on short screens. Every option is a toggle with a clear checked
 * state; measurable categories reveal a "within X mi" control, and address-based
 * categories reveal an optional place field (captured now for future matching).
 */
function QwomeModal({
  prefs,
  onChange,
  onClose,
}: {
  prefs: QwomePreference[];
  onChange: (prefs: QwomePreference[]) => void;
  onClose: () => void;
}) {
  const active = new Map(prefs.map((p) => [p.category, p]));

  const toggle = (id: QwomeCategoryId) => {
    if (active.has(id)) {
      onChange(prefs.filter((p) => p.category !== id));
    } else {
      const next: QwomePreference = { category: id, importance: "prefer" };
      if (isMeasurable(id)) next.maxMiles = defaultMilesFor(id);
      onChange([...prefs, next]);
    }
  };
  const patch = (id: QwomeCategoryId, changes: Partial<QwomePreference>) =>
    onChange(prefs.map((p) => (p.category === id ? { ...p, ...changes } : p)));

  const count = prefs.length;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        aria-hidden
      />

      {/* Dialog ... bottom sheet on mobile, centered card on sm+ */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Choose what matters to you"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[88dvh] flex-col rounded-t-2xl border border-auroraMauve/25 bg-plum shadow-aurora sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[86dvh] sm:w-[min(560px,92vw)] sm:rounded-2xl"
      >
        {/* Header (sticky) */}
        <div className="flex items-start justify-between gap-4 border-b border-dusty/15 p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-auroraMauve">
              Powered by QWOME&trade;
            </p>
            <h3 className="mt-1 text-lg font-semibold text-pearl">Choose what matters to you</h3>
            <p className="mt-1 text-sm text-dusty">
              Pick the places and everyday destinations that matter most.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-dusty transition-colors hover:bg-wine/30 hover:text-pearl"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Options (scrollable), grouped by section. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="flex flex-col gap-5">
            {QWOME_GROUPS.map((group) => {
              const entries = QWOME_CATALOG.filter((c) => c.group === group);
              if (entries.length === 0) return null;
              return (
                <section key={group}>
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-auroraMauve/80">
                    {group}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {entries.map((entry) => {
                      const on = active.has(entry.id);
                      const pref = active.get(entry.id);
                      return (
                        <li
                          key={entry.id}
                          className={[
                            "rounded-xl border transition-colors",
                            on ? "border-auroraMauve/45 bg-wine/20" : "border-dusty/15 bg-plum/40",
                          ].join(" ")}
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            onClick={() => toggle(entry.id)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left"
                          >
                            <span aria-hidden className="text-xl leading-none">{entry.icon}</span>
                            <span className={on ? "flex-1 text-sm font-medium text-pearl" : "flex-1 text-sm text-dusty"}>
                              {entry.label}
                            </span>
                            <span
                              className={[
                                "grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors",
                                on ? "border-auroraMauve bg-gradient-to-br from-gold to-auroraMauve" : "border-dusty/40 bg-transparent",
                              ].join(" ")}
                            >
                              {on && (
                                <svg viewBox="0 0 16 16" className="h-4 w-4 text-plum" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M3.5 8.5l3 3 6-7" />
                                </svg>
                              )}
                            </span>
                          </button>

                          {/* Distance control + accuracy note ... measurable only. */}
                          {on && isMeasurable(entry.id) && (
                            <div className="flex flex-col gap-2 border-t border-dusty/12 px-4 py-2.5">
                              <div className="flex items-center gap-2 text-sm text-dusty">
                                <span>within</span>
                                <select
                                  aria-label={`${entry.label} distance in miles`}
                                  className={selectCls}
                                  value={pref?.maxMiles ?? defaultMilesFor(entry.id)}
                                  onChange={(e) => patch(entry.id, { maxMiles: Number(e.target.value) })}
                                >
                                  {QWOME_MILE_OPTIONS.map((m) => (
                                    <option key={m} value={m}>{m} mi</option>
                                  ))}
                                </select>
                              </div>
                              {entry.note && (
                                <p className="text-xs leading-snug text-dusty/70">{entry.note}</p>
                              )}
                            </div>
                          )}

                          {/* Address entry ... structure for the future
                              address-based matching step. Captured toward the
                              QWOME data model now; distance from these places is
                              computed once geocoding ships. Optional, so it never
                              blocks a selection. */}
                          {on && entry.addressBased && (
                            <div className="flex flex-col gap-2 border-t border-dusty/12 px-4 py-2.5">
                              {entry.id === "custom" && (
                                <input
                                  type="text"
                                  value={pref?.label ?? ""}
                                  onChange={(e) => patch(entry.id, { label: e.target.value })}
                                  placeholder="Name this place (e.g. Mom's house)"
                                  className="w-full rounded-lg border border-dusty/25 bg-plum/60 px-3 py-2 text-sm text-pearl placeholder:text-dusty/60 outline-none transition-colors focus:border-auroraMauve/60"
                                />
                              )}
                              <input
                                type="text"
                                value={pref?.address?.formatted ?? ""}
                                onChange={(e) => patch(entry.id, { address: { ...pref?.address, formatted: e.target.value } })}
                                placeholder="Address or place (optional)"
                                className="w-full rounded-lg border border-dusty/25 bg-plum/60 px-3 py-2 text-sm text-pearl placeholder:text-dusty/60 outline-none transition-colors focus:border-auroraMauve/60"
                              />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

        {/* Footer (sticky) */}
        <div className="flex items-center justify-between gap-3 border-t border-dusty/15 p-4">
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-sm font-medium text-dusty underline-offset-2 transition-colors hover:text-pearl hover:underline disabled:opacity-40 disabled:no-underline disabled:hover:text-dusty"
            disabled={count === 0}
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-aurora !px-6 !py-2.5"
          >
            Done{count > 0 ? ` (${count})` : ""}
          </button>
        </div>
      </motion.div>
    </>
  );
}
