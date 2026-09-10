"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ListingCard from "./ListingCard";
import QwomePanel from "./QwomePanel";
import type { Listing } from "@/lib/idx";
import type { AmenityDistances, AmenityKey } from "@/lib/amenities";
import {
  encodePrefs,
  decodePrefs,
  isMeasurable,
  type QwomePreference,
} from "@/lib/qwome/preferences";
import { readPrefs, writePrefs } from "@/lib/qwome/client/prefsStorage";

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

  // Nearby-amenity distances ... fetched after render so cards show instantly,
  // then the QWOME data resolves. Also powers the preference filter below.
  const [amenities, setAmenities] = useState<Record<string, AmenityDistances>>({});
  const [amenitiesLoaded, setAmenitiesLoaded] = useState(false);
  useEffect(() => {
    const points = listings
      .filter((l) => l.lat != null && l.lng != null)
      .map((l) => ({ id: l.id, lat: l.lat as number, lng: l.lng as number }));
    if (points.length === 0) return;
    let cancelled = false;
    fetch("/api/qwome/nearby", {
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

  // QWOME proximity preferences. Init from the URL ("near=hospital:10,grocery:3")
  // so a proximity search is shareable/saveable, else from this device's saved
  // prefs. Kept in sync to both on change.
  const [prefs, setPrefs] = useState<QwomePreference[]>([]);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const fromUrl = decodePrefs(sp.get("near"));
    // Back-compat with the old single-radius param.
    if (fromUrl.length === 0) {
      const mi = Number(sp.get("radiusMi"));
      const of = sp.get("radiusOf") as AmenityKey | null;
      if (Number.isFinite(mi) && mi > 0 && of && isMeasurable(of)) {
        setPrefs([{ category: of, maxMiles: mi }]);
        return;
      }
    }
    setPrefs(fromUrl.length ? fromUrl : readPrefs());
  }, []);

  const updatePrefs = (next: QwomePreference[]) => {
    setPrefs(next);
    writePrefs(next);
    const sp = new URLSearchParams(window.location.search);
    sp.delete("radiusMi");
    sp.delete("radiusOf");
    const near = encodePrefs(next);
    if (near) sp.set("near", near);
    else sp.delete("near");
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  // Only the MEASURABLE prefs (hospital/school/grocery today) constrain search
  // and show a distance on the card. Lifestyle picks QWOME can't measure yet
  // (gym, dining, ...) are saved and shown as chips but don't hide any homes.
  const measurablePrefs = useMemo(
    () => prefs.filter((p) => isMeasurable(p.category) && p.maxMiles != null),
    [prefs]
  );
  const prefsActive = measurablePrefs.length > 0;
  const activeCategories = useMemo(
    () => measurablePrefs.map((p) => p.category as AmenityKey),
    [measurablePrefs]
  );

  // Categories QWOME actually measured in this result set. A category with no
  // data anywhere (e.g. a market type absent from this region) must NOT filter
  // every home out ... it simply can't be applied here, so we skip it.
  const measuredCats = useMemo(() => {
    const s = new Set<string>();
    for (const id in amenities) for (const cat in amenities[id]) s.add(cat);
    return s;
  }, [amenities]);

  // A home "fits" when it satisfies EVERY APPLICABLE measurable preference (AND).
  const visible = useMemo(() => {
    if (!prefsActive || !amenitiesLoaded) return listings;
    const applicable = measurablePrefs.filter((p) => measuredCats.has(p.category));
    if (applicable.length === 0) return listings;
    return listings.filter((l) =>
      applicable.every((p) => {
        const d = amenities[l.id]?.[p.category as AmenityKey];
        return d != null && p.maxMiles != null && d.miles <= p.maxMiles;
      })
    );
  }, [prefsActive, amenitiesLoaded, listings, amenities, measurablePrefs, measuredCats]);

  const statusNode = prefsActive
    ? amenitiesLoaded
      ? `${visible.length} of ${listings.length} homes fit`
      : "Matching nearby places..."
    : `${listings.length} ${listings.length === 1 ? "home" : "homes"}`;

  return (
    <div>
      {hasCoords && (
        <QwomePanel prefs={prefs} onChange={updatePrefs} status={statusNode} />
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
          {visible.length === 0 && prefsActive ? (
            <div className="rounded-xl2 border border-dusty/15 bg-bruised/40 p-8 text-center text-dusty">
              No homes fit all your QWOME&trade; preferences yet. Try widening a distance or
              removing one.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {visible.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  amenities={amenities[l.id]}
                  qwomeCategories={activeCategories}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
