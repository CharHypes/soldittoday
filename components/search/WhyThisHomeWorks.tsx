"use client";

import { useEffect, useState } from "react";
import { formatMiles, type AmenityDistances, type AmenityKey } from "@/lib/amenities";
import { evaluatePreference, isMeasurable, catalogEntry, type QwomePreference } from "@/lib/qwome/preferences";
import { readPrefs, PREFS_CHANGE_EVENT } from "@/lib/qwome/client/prefsStorage";

/**
 * How each category reads in a "why this home works" line. Uses the catalog's
 * honest descriptor ("nearest public elementary school in district", never
 * "assigned") so we never overstate what the data proves.
 */
const descriptorFor = (key: AmenityKey) =>
  catalogEntry(key)?.descriptor ?? catalogEntry(key)?.short.toLowerCase() ?? key;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Reason = { text: string; ok: boolean };

/**
 * "Why this home works" ... and, once the viewer has saved QWOME™ preferences,
 * "Why this home works FOR YOU."
 *
 * ARCHITECTURE NOTE: reasons are a typed list ({ text, ok }), not baked-in JSX,
 * and the personalization is a pure evaluation of the viewer's QWOME preferences
 * against the home's real nearby distances (passed in from the server). Adding
 * more preference types later (acreage, first-floor living, commute) is just more
 * entries in this list ... the rendering never changes. Curated, fact-based lines
 * stay exactly as today for anyone who hasn't set preferences.
 */
export default function WhyThisHomeWorks({
  facts,
  nearby,
}: {
  /** Curated, fact-based benefit lines from the MLS (lib/listingHighlights). */
  facts: string[];
  /** Real nearest-of-each distances for this home (server-computed via QWOME). */
  nearby: AmenityDistances;
}) {
  // Per-device QWOME preferences. Empty on the server + first paint (so no
  // hydration mismatch), then filled in on the client.
  const [prefs, setPrefs] = useState<QwomePreference[]>([]);
  useEffect(() => {
    const load = () => setPrefs(readPrefs());
    load();
    window.addEventListener(PREFS_CHANGE_EVENT, load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener(PREFS_CHANGE_EVENT, load);
      window.removeEventListener("focus", load);
    };
  }, []);

  const factReasons: Reason[] = facts.map((t) => ({ text: t, ok: true }));

  // Personalized lines ... evaluated against the viewer's own limits.
  const personalized: Reason[] = [];
  for (const p of prefs) {
    // Only measurable prefs have a nearby distance to reason about today.
    if (!isMeasurable(p.category)) continue;
    const key = p.category as AmenityKey;
    const d = nearby[key];
    if (!d) continue;
    const status = evaluatePreference(p, d.miles);
    if (status === "met") {
      personalized.push({
        text: `${cap(descriptorFor(key))} is ${formatMiles(d.miles)} (within your ${p.maxMiles}-mile limit)`,
        ok: true,
      });
    } else if (status) {
      personalized.push({
        text: `${cap(descriptorFor(key))} is ${formatMiles(d.miles)} ... ${
          status === "far" ? "beyond" : "just past"
        } your ${p.maxMiles}-mile preference`,
        ok: false,
      });
    }
  }

  // With no preferences set, keep today's behavior: one generic "Close to ..."
  // line built from the nearest hospital / grocery / public elementary school.
  const genericNearby: Reason[] = [];
  if (prefs.length === 0) {
    const parts = (["hospital", "grocery", "school_elem"] as AmenityKey[])
      .filter((k) => nearby[k])
      .map((k) => `${descriptorFor(k)} (${formatMiles(nearby[k]!.miles)})`);
    if (parts.length) genericNearby.push({ text: `Close to the ${parts.join(", ")}`, ok: true });
  }

  const reasons = [...personalized, ...factReasons, ...genericNearby].slice(0, 6);
  const personalizedActive = personalized.length > 0;

  // Same visibility bar as before (>= 3), but always show if we have a
  // personalized match/miss to report.
  if (reasons.length < 3 && !personalizedActive) return null;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">
        {personalizedActive ? "Why this home works for you" : "Why this home works"}
      </h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {reasons.map((r) => (
          <li
            key={r.text}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-pearl/90"
          >
            {r.ok ? (
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12l4 4 10-11" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-dusty"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 3.5L22 20H2z" />
                <path d="M12 10v4" />
                <path d="M12 17h.01" />
              </svg>
            )}
            {r.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
