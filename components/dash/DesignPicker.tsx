"use client";

import { useEffect, useState } from "react";

type Design = "mulberry" | "neutral" | "butler" | "butler-midnight";

const OPTIONS: { id: Design; name: string; blurb: string; swatch: string[] }[] = [
  { id: "mulberry", name: "Mulberry Noir", blurb: "Your Sold It Today brand ... expressive and warm.", swatch: ["#1a1518", "#2a1f25", "#d4a2ba", "#e4bc90"] },
  { id: "neutral", name: "Neutral (Clean)", blurb: "The demo / sellable look ... calm grayscale + one accent.", swatch: ["#111214", "#23242a", "#8e3b58", "#9a9ca3"] },
  { id: "butler", name: "Butler", blurb: "Warm dark + linen light ... flips with your light/dark button.", swatch: ["#1a1714", "#e8e2d6", "#8ba3c2", "#d4a94e"] },
  { id: "butler-midnight", name: "Butler Midnight", blurb: "Cooler near-black dark; shows Linen in light mode.", swatch: ["#17161a", "#26252b", "#8ba3c2", "#b4b2b8"] },
];

const KNOWN: Design[] = ["mulberry", "neutral", "butler", "butler-midnight"];

// Old IDs from before Butler became a light/dark pair, mapped to the new tiles.
function normalize(raw: string | null): Design {
  if (raw === "butler-warm" || raw === "butler-linen") return "butler";
  return raw && (KNOWN as string[]).includes(raw) ? (raw as Design) : "mulberry";
}

export default function DesignPicker() {
  const [design, setDesign] = useState<Design>("mulberry");
  useEffect(() => {
    try {
      setDesign(normalize(localStorage.getItem("agenthub-design")));
    } catch {}
  }, []);
  const choose = (d: Design) => {
    setDesign(d);
    try {
      localStorage.setItem("agenthub-design", d);
    } catch {}
    window.dispatchEvent(new Event("agenthub-design-change"));
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((o) => {
        const on = design === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => choose(o.id)}
            className={`rounded-xl2 border p-4 text-left transition-colors ${
              on ? "border-mauve/70 bg-raise ring-1 ring-mauve/50" : "border-dusty/15 bg-bruised hover:border-dusty/30"
            }`}
          >
            <div className="mb-3 flex h-9 overflow-hidden rounded-lg">
              {o.swatch.map((c, i) => (
                <span key={i} style={{ background: c, flex: i === o.swatch.length - 1 ? 0.5 : 1 }} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg text-pearl">{o.name}</span>
              {on && <span className="text-[11px] font-semibold uppercase tracking-wide text-mauve">Active</span>}
            </div>
            <p className="mt-0.5 text-[12.5px] text-dusty">{o.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
