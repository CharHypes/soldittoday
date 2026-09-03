"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Listing photo experience:
 *  - A Zillow-style mosaic (one large photo + a small grid) on desktop, a single
 *    hero on mobile, with a "See all photos" button.
 *  - A full-screen lightbox to page through every photo (arrow buttons, keyboard
 *    ←/→, Esc to close, click-the-backdrop to close). The viewer is intentionally
 *    dark in both site themes, like every photo viewer.
 */
export default function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = photos.length;

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(() => setOpen((i) => (i == null ? i : (i + 1) % count)), [count]);
  const prev = useCallback(() => setOpen((i) => (i == null ? i : (i - 1 + count) % count)), [count]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  if (count === 0) {
    return (
      <div className="grid h-64 place-items-center rounded-xl2 border border-dusty/15 bg-wine/20 text-dusty/60">
        Photos coming soon
      </div>
    );
  }

  const grid = photos.slice(0, 5);

  return (
    <>
      {/* Mosaic */}
      <div className="relative">
        <div className="grid gap-2 md:h-[460px] md:grid-cols-4 md:grid-rows-2">
          {grid.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className={[
                "group relative overflow-hidden border border-dusty/12 first:border-dusty/15",
                i === 0
                  ? "aspect-[4/3] rounded-xl2 md:col-span-2 md:row-span-2 md:aspect-auto"
                  : "hidden aspect-[4/3] rounded-xl md:block",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} ... photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>

        {/* See all */}
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="absolute bottom-3 right-3 rounded-full border border-white/40 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          See all {count} photos
        </button>
      </div>

      {/* Lightbox */}
      {open != null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          {/* Top bar */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 py-4 text-white">
            <span className="text-sm tabular-nums">
              {open + 1} / {count}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full text-2xl leading-none hover:bg-white/10"
            >
              &times;
            </button>
          </div>

          {/* Prev */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 md:left-6"
            >
              &#8249;
            </button>
          )}

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[open]}
            alt={`${alt} ... photo ${open + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-[92vw] object-contain"
          />

          {/* Next */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 md:right-6"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  );
}
