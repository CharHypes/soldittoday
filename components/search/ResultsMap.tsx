"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/lib/idx";

/** Compact price for a map pin ($160K, $1.2M). */
function compact(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "K";
  return "$" + n;
}

function pinIcon(listing: Listing): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="sit-pin">${compact(listing.price)}</div>`,
    iconSize: [54, 26],
    iconAnchor: [27, 26],
    popupAnchor: [0, -24],
  });
}

/** Fit the map to the current results whenever they change. */
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 });
  }, [points, map]);
  return null;
}

export default function ResultsMap({ listings }: { listings: Listing[] }) {
  const pts = useMemo(
    () => listings.filter((l) => l.lat != null && l.lng != null),
    [listings]
  );
  const positions = useMemo(
    () => pts.map((l) => [l.lat as number, l.lng as number] as [number, number]),
    [pts]
  );

  // Theme-aware Carto basemap (clean + luxe): light in light mode, dark in dark.
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const center: [number, number] = positions[0] ?? [42.33, -83.05]; // Metro Detroit

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "rgb(var(--plum))" }}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {pts.map((l) => (
        <Marker key={l.id} position={[l.lat as number, l.lng as number]} icon={pinIcon(l)}>
          <Popup>
            <a href={`/listing/${l.id}`} className="sit-map-pop">
              {l.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.photoUrl} alt={l.showAddress ? l.address : "Property"} />
              ) : null}
              <span className="sit-map-pop-price">
                {l.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
              </span>
              <span className="sit-map-pop-addr">
                {l.showAddress ? l.address : "Address on request"}
              </span>
              <span className="sit-map-pop-meta">
                {[l.beds != null ? `${l.beds} bd` : "", l.baths != null ? `${l.baths} ba` : "", `${l.city}`]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </a>
          </Popup>
        </Marker>
      ))}
      <FitBounds points={positions} />
    </MapContainer>
  );
}
