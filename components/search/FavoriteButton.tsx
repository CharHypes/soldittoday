"use client";

import { useEffect, useState } from "react";

/**
 * Save / Favorite (heart). Until real client accounts exist, favorites live in
 * localStorage (per-device) so the feature works today; when auth ships we sync
 * these to the logged-in account. Tapping save shows a gentle "log in to save to
 * your account" nudge (Charlotte's lead goal), without blocking the local save.
 */
const KEY = "sit-favorites";

function readFavs(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function writeFavs(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* private mode ... ignore */
  }
}

export default function FavoriteButton({
  listingId,
  className = "",
}: {
  listingId: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setSaved(readFavs().includes(listingId));
  }, [listingId]);

  const toggle = () => {
    const favs = readFavs();
    let next: string[];
    if (favs.includes(listingId)) {
      next = favs.filter((x) => x !== listingId);
      setSaved(false);
      setHint(false);
    } else {
      next = [...favs, listingId];
      setSaved(true);
      setHint(true);
      window.setTimeout(() => setHint(false), 4500);
    }
    writeFavs(next);
    window.dispatchEvent(new Event("sit-favorites-change"));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved homes" : "Save this home"}
        className="group inline-flex items-center gap-2 rounded-full border border-dusty/25 bg-plum/50 px-4 py-2 text-sm font-medium text-pearl transition-colors duration-300 hover:border-auroraMauve/50"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 transition-all duration-300 ${saved ? "scale-110 text-auroraMauve" : "text-pearl"}`}
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 21s-7.5-4.7-10-9.3C.6 8.9 2 5.5 5.2 5.1 7 4.9 8.6 5.9 12 8.5c3.4-2.6 5-3.6 6.8-3.4C22 5.5 23.4 8.9 22 11.7 19.5 16.3 12 21 12 21z" />
        </svg>
        {saved ? "Saved" : "Save"}
      </button>

      {hint && (
        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-auroraMauve/30 bg-bruised p-3 text-left text-xs leading-relaxed text-dusty shadow-aurora">
          Saved on this device.{" "}
          <a href="/login" className="font-medium text-auroraMauve transition-colors hover:text-pearl">
            Log in to save to your account &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
