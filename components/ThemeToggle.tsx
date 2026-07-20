"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Light/dark switch.
 *
 * The resolved theme lives on <html data-theme>, written by the blocking
 * script in layout.tsx before first paint. This component only mirrors and
 * updates that state, so there is no flash and no SSR/CSR mismatch — it
 * renders a stable placeholder until mounted.
 *
 * Several instances mount at once (desktop header, mobile header, page
 * shell). The DOM attribute is the single source of truth and a custom
 * event keeps every instance in sync, so toggling one never leaves another
 * showing the wrong icon.
 */

type Theme = "light" | "dark";

const STORAGE_KEY = "sit-theme";
const CHANGE_EVENT = "sit-theme-change";

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing / storage disabled — theme still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    // Another tab may change the saved preference.
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback(() => {
    applyTheme(readTheme() === "light" ? "dark" : "light");
  }, []);

  const isLight = theme === "light";
  const label = isLight ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dusty/30 text-pearl transition-all duration-500 ease-lux hover:border-pearl/70 hover:-translate-y-0.5 ${className}`}
    >
      {/* Placeholder keeps layout stable until the client resolves the theme. */}
      <span className="sr-only">{label}</span>
      {theme === null ? (
        <span aria-hidden className="h-[18px] w-[18px]" />
      ) : isLight ? (
        <svg
          aria-hidden
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ) : (
        <svg
          aria-hidden
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
