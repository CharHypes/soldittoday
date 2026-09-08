"use client";

import { useState } from "react";

/**
 * Share this listing. Uses the native share sheet on mobile (navigator.share);
 * falls back to copying the link on desktop with a brief "Link copied" confirm.
 */
export default function ShareButton({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user dismissed ... ignore */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked ... ignore */
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={share}
        aria-label="Share this home"
        className="inline-flex items-center gap-2 rounded-full border border-dusty/25 bg-plum/50 px-4 py-2 text-sm font-medium text-pearl transition-colors duration-300 hover:border-auroraMauve/50"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="18" cy="5" r="2.2" />
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="18" cy="19" r="2.2" />
          <path d="M8 11l8-5M8 13l8 5" />
        </svg>
        Share
      </button>
      {copied && (
        <div className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-auroraMauve/30 bg-bruised px-3 py-1.5 text-xs text-pearl shadow-aurora">
          Link copied
        </div>
      )}
    </div>
  );
}
