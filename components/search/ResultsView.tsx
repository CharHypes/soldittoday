"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/idx";
import type { AmenityDistances, AmenityKey } from "@/lib/amenities";

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

const selectCls =
  "rounded-lg border border-dusty/25 bg-plum/60 px-3 py-2 text-sm text-pearl outline-none transition-colors focus:border-auroraMauve/60";

const MILE_OPTIONS = [1, 2, 5, 10, 15, 20, 25];
const AMENITY_OF: Record<AmenityKey, string> = {
  hospital: "a hospital",
  school: "a school",
  grocery: "a grocery store",
};

export default function ResultsView({ listings }: { listings: Listing[] }) {
  const [view, setView] = useState<"list" | "map">("list");
  const hasCoords = listings.some((l) => l.lat != null && l.lng != null);

  // Nearby-amenity distances ... fetched after render so cards show instantly,
  // then the "Nearby" tiles pop in. Also powers the radius filter below.
  const [amenities, setAmenities] = useState<Record<string, AmenityDistances>>({});
  const [amenitiesLoaded, setAmenitiesLoaded] = useState(false);
  useEffect(() => {
    const points = listings
      .filter((l) => l.lat != null && l.lng != null)
      .map((l) => ({ id: l.id, lat: l.lat as number, lng: l.lng as number }));
    if (points.length === 0) return;
    let cancelled = false;
    fetch("/api/amenities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (!cancelled) {
          setAmenities(data as Record<string, AmenityDistances>);
          setAmenitiesLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setAmenitiesLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [listings]);

  // "Within X miles of ___" radius filter ... init from the URL so it's
  // shareable (and saved-search-ready later).
  const [radiusMi, setRadiusMi] = useState<number>(0);
  const [radiusOf, setRadiusOf] = useState<AmenityKey>("hospital");
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const mi = Number(sp.get("radiusMi"));
    const of = sp.get("radiusOf") as AmenityKey | null;
    if (Number.isFinite(mi) && mi > 0) setRadiusMi(mi);
    if (of === "hospital" || of === "school" || of === "grocery") setRadiusOf(of);
  }, []);

  // Keep the URL in sync without a reload.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (radiusMi > 0) {
      sp.set("radiusMi", String(radiusMi));
      sp.set("radiusOf", radiusOf);
    } else {
      sp.delete("radiusMi");
      sp.delete("radiusOf");
    }
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [radiusMi, radiusOf]);

  const radiusActive = radiusMi > 0;
  const visible = useMemo(() => {
    if (!radiusActive || !amenitiesLoaded) return listings;
    return listings.filter((l) => {
      const d = amenities[l.id]?.[radiusOf];
      return d != null && d.miles <= radiusMi;
    });
  }, [radiusActive, amenitiesLoaded, listings, amenities, radiusOf, radiusMi]);

  return (
    <div>
      {/* Radius filter ... "within X miles of a hospital / school / grocery" */}
      {hasCoords && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl2 border border-dusty/15 bg-plum/40 px-4 py-3 text-sm text-dusty">
          <span className="font-medium text-pearl">Within</span>
          <select
            aria-label="Distance in miles"
            className={selectCls}
            value={radiusMi}
            onChange={(e) => setRadiusMi(Number(e.target.value))}
          >
            <option value={0}>Any distance</option>
            {MILE_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m} mi
              </option>
            ))}
          </select>
          <span>of</span>
          <select
            aria-label="Amenity"
            className={selectCls}
            value={radiusOf}
            onChange={(e) => setRadiusOf(e.target.value as AmenityKey)}
          >
            <option value="hospital">a hospital</option>
            <option value="school">a school</option>
            <option value="grocery">a grocery store</option>
          </select>
          {radiusActive && (
            <button
              type="button"
              onClick={() => setRadiusMi(0)}
              className="ml-1 rounded-full border border-dusty/25 px-3 py-1.5 text-xs text-dusty transition-colors hover:border-auroraMauve/50 hover:text-pearl"
            >
              Clear
            </button>
          )}
          <span className="ml-auto text-xs">
            {radiusActive
              ? amenitiesLoaded
                ? `${visible.length} of ${listings.length} within ${radiusMi} mi of ${AMENITY_OF[radiusOf]}`
                : "Finding nearby places..."
              : `${listings.length} ${listings.length === 1 ? "home" : "homes"}`}
          </span>
        </div>
      )}

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
            <ResultsMap listings={visible} />
          </div>
        )}

        {/* List */}
        <div className={[view === "list" ? "block" : "hidden", "lg:block"].join(" ")}>
          {visible.length === 0 && radiusActive ? (
            <div className="rounded-xl2 border border-dusty/15 bg-bruised/40 p-8 text-center text-dusty">
              No homes within {radiusMi} mi of {AMENITY_OF[radiusOf]}. Try a larger distance.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {visible.map((l) => (
                <ListingCard key={l.id} listing={l} amenities={amenities[l.id]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
