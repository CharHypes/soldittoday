"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/idx";

// Leaflet needs the browser, so the map is client-only.
const ResultsMap = dynamic(() => import("./ResultsMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-plum/40 text-sm text-dusty">
      Loading map...
    </div>
  ),
});

const toggleBase =
  "px-5 py-2 text-sm font-semibold rounded-full transition-colors";
const toggleOn = "bg-gradient-to-br from-gold to-auroraMauve text-plum";
const toggleOff = "text-dusty hover:text-pearl";

export default function ResultsView({ listings }: { listings: Listing[] }) {
  const [view, setView] = useState<"list" | "map">("list");
  const hasCoords = listings.some((l) => l.lat != null && l.lng != null);

  return (
    <div>
      {/* Mobile List / Map toggle */}
      {hasCoords && (
        <div className="mb-5 flex justify-center lg:hidden">
          <div className="inline-flex rounded-full border border-dusty/25 bg-plum/40 p-1">
            <button type="button" onClick={() => setView("list")} className={`${toggleBase} ${view === "list" ? toggleOn : toggleOff}`}>
              List
            </button>
            <button type="button" onClick={() => setView("map")} className={`${toggleBase} ${view === "map" ? toggleOn : toggleOff}`}>
              Map
            </button>
          </div>
        </div>
      )}

      <div className={hasCoords ? "grid gap-5 lg:grid-cols-2" : ""}>
        {/* Map */}
        {hasCoords && (
          <div
            className={[
              view === "map" ? "block" : "hidden",
              "lg:block",
              "h-[68vh] overflow-hidden rounded-xl2 border border-dusty/15 shadow-aurora lg:sticky lg:top-24 lg:h-[80vh]",
            ].join(" ")}
          >
            <ResultsMap listings={listings} />
          </div>
        )}

        {/* List */}
        <div className={[view === "list" ? "block" : "hidden", "lg:block"].join(" ")}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
