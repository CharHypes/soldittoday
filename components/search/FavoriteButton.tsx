"use client";

import { useEffect, useState } from "react";

/**
 * Save / Favorite ... icon-only heart (Option C). Outline when unsaved, soft
 * rose/plum fill when saved. Theme-aware: the outline uses `text-pearl` (light
 * cream in dark mode, dark plum in light mode) and the circle uses brand tokens,
 * while the saved fill stays a consistent brand rose/plum in both themes.
 *
 * Until real client accounts exist, favorites live in localStorage (per-device)
 * so the feature works today; on save we nudge the user to log in / create an
 * account (which will sync favorites once auth ships). Logged-in behavior will
 * hang off the same toggle when accounts land.
 */
const KEY = "sit-favorites";
const SAVED_FILL = "#c07a9c"; // soft rose/plum ... consistent in both themes

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
        title={saved ? "Saved" : "Save this home"}
        className="group grid h-11 w-11 place-items-center rounded-full border border-dusty/30 bg-plum/50 text-pearl transition-all duration-300 hover:border-auroraMauve/60 hover:bg-plum/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auroraMauve/50"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-[22px] w-[22px] transition-transform duration-300 ${saved ? "scale-110" : "group-hover:scale-110"}`}
          fill={saved ? SAVED_FILL : "none"}
          stroke={saved ? SAVED_FILL : "currentColor"}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
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
