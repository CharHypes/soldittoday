"use client";

import { useEffect, useState } from "react";
import { BrandProvider, type Brand } from "@/components/dash/BrandContext";

/**
 * Wraps the Agent Hub and applies the org's chosen WORKSPACE DESIGN:
 *  - "mulberry" (default for Sold It Today): the branded Mulberry Noir look (no class).
 *  - "neutral": the clean grayscale + accent look (the sellable-product default).
 *  - "butler-warm" / "butler-midnight" / "butler-linen": the Butler palettes,
 *    a slate-blue accent so SIT and Butler feel like one house.
 * Each non-default design is a `theme-<id>` wrapper class, defined in
 * app/globals.css (chrome tokens) + app/dashboard/backoffice.css (form tokens).
 * Persisted per browser for now (localStorage); a per-org/user DB setting can
 * drive the same class later. Scoped to this wrapper so the marketing site is
 * never affected.
 */
const KNOWN = new Set(["mulberry", "neutral", "butler-warm", "butler-midnight", "butler-linen"]);

export default function AgentHubShell({ children, brand }: { children: React.ReactNode; brand?: Brand }) {
  const [design, setDesign] = useState("mulberry");
  useEffect(() => {
    const read = () => {
      try {
        const d = localStorage.getItem("agenthub-design") || "mulberry";
        setDesign(KNOWN.has(d) ? d : "mulberry");
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
