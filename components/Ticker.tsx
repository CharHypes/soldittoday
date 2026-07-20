import { tickerItems } from "@/lib/data";

/**
 * Scrolling brand ticker.
 *
 * The list is rendered twice and translated -50%, so the second copy is
 * exactly where the first started when the loop restarts — that seam is what
 * makes it read as continuous rather than snapping.
 *
 * Marked aria-hidden: it is decorative, and a screen reader announcing a
 * looping word salad is noise. Every term here also exists as real navigation
 * or page content elsewhere.
 */
export default function Ticker() {
  const row = (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      {tickerItems.map((item, i) => (
        <li key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
          <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.25em] text-goldInk">
            {item}
          </span>
          <span className="text-[10px] text-goldInk/60" aria-hidden="true">
            &#9670;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="relative overflow-hidden border-y border-dusty/12 bg-bruised/40 py-4"
      aria-hidden="true"
    >
      {/* Edge fades so items enter and leave rather than popping at the cut. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-plum to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-plum to-transparent" />

      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
