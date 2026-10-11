"use client";

import { useEffect, useState } from "react";
import { BrandProvider, type Brand } from "@/components/dash/BrandContext";

/**
 * Wraps the Agent Hub and applies the org's chosen WORKSPACE DESIGN:
 *  - "mulberry" (default for Sold It Today): the branded Mulberry Noir look.
 *  - "neutral": the clean grayscale + accent look (the sellable-product default).
 * Persisted per browser for now (localStorage); a per-org/user DB setting can
 * drive the same class later. Scoped to this wrapper so the marketing site is
 * never affected.
 */
export default function AgentHubShell({ children, brand }: { children: React.ReactNode; brand?: Brand }) {
  const [neutral, setNeutral] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        setNeutral(localStorage.getItem("agenthub-design") === "neutral");
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
  return (
    <BrandProvider value={brand ?? { logoUrl: null, brandName: null, tagline: null }}>
      <div className={neutral ? "theme-neutral" : undefined}>{children}</div>
    </BrandProvider>
  );
}
