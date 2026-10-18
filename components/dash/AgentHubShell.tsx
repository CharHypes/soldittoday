"use client";

import { useEffect, useState } from "react";
import { BrandProvider, type Brand } from "@/components/dash/BrandContext";

/**
 * Wraps the Agent Hub and applies the org's chosen WORKSPACE DESIGN:
 *  - "mulberry" (default for Sold It Today): the branded Mulberry Noir look (no class).
 *  - "neutral": the clean grayscale + accent look (the sellable-product default).
 *  - "butler" / "butler-midnight": the Butler palettes (slate-blue accent so
 *    SIT and Butler feel like one house). Butler is a LIGHT+DARK PAIR ... the
 *    Agent Hub light/dark button (data-theme) flips its Warm Dark face to the
 *    Linen light face; Butler Midnight is a cooler dark face that also shows
 *    Linen in light mode.
 * Each non-default design is a `theme-<id>` wrapper class, defined in
 * app/globals.css (chrome tokens) + app/dashboard/backoffice.css (form tokens).
 * Persisted per browser for now (localStorage); a per-org/user DB setting can
 * drive the same class later. Scoped to this wrapper so the marketing site is
 * never affected.
 */
const KNOWN = new Set(["mulberry", "neutral", "butler", "butler-midnight"]);

// Old IDs from before Butler became a light/dark pair.
function normalize(raw: string | null): string {
  if (raw === "butler-warm" || raw === "butler-linen") return "butler";
  return raw && KNOWN.has(raw) ? raw : "mulberry";
}

export default function AgentHubShell({ children, brand }: { children: React.ReactNode; brand?: Brand }) {
  const [design, setDesign] = useState("mulberry");
  useEffect(() => {
    const read = () => {
      try {
        setDesign(normalize(localStorage.getItem("agenthub-design")));
      } catch {}
    };
    read();
    window.addEventListener("agenthub-design-change", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("agenthub-design-change", read);
      window.removeEventListener("storage", read);
    };
  }, []);
  const themeClass = design === "mulberry" ? undefined : `theme-${design}`;
  return (
    <BrandProvider value={brand ?? { logoUrl: null, brandName: null, tagline: null }}>
      <div className={themeClass}>{children}</div>
    </BrandProvider>
  );
}
