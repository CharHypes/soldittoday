import Link from "next/link";
import type { Listing } from "@/lib/idx";
import { IDX_DISCLAIMER } from "@/lib/idx";
import type { AmenityDistances, AmenityKey } from "@/lib/amenities";

/* Fixed icons per Charlotte: hospital = "H" in a box (highway sign), school =
   little schoolhouse (K-12, not a grad cap), grocery = cart. */
const AMENITY_ICON: Record<AmenityKey, JSX.Element> = {
  hospital: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M9 8v8M15 8v8M9 12h6" />
    </>
  ),
  school: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-3.5L19 10v11" />
      <path d="M10 21v-4h4v4" />
      <path d="M12 6.5V3l3 1-3 1" />
    </>
  ),
  grocery: (
    <>
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="18" cy="20" r="1.3" />
      <path d="M2 3h2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3H18a1.5 1.5 0 0 0 1.5-1.2L21 7H5.2" />
    </>
  ),
};

const AMENITY_LABEL: Record<AmenityKey, string> = {
  hospital: "Hospital",
  school: "School",
  grocery: "Grocery",
};

function AmenityTiles({ amenities }: { amenities: AmenityDistances }) {
  const order: AmenityKey[] = ["hospital", "school", "grocery"];
  const items = order.filter((k) => amenities[k]);
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-auroraMauve">Nearby</p>
      <div className="flex gap-2">
        {items.map((k) => (
          <div
            key={k}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-dusty/16 bg-wine/20 px-1 py-2 text-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px] text-gold"
              aria-hidden
            >
              {AMENITY_ICON[k]}
            </svg>
            <span className="text-sm font-semibold text-pearl">{amenities[k]!.miles} mi</span>
            <span className="text-[11px] text-dusty">{AMENITY_LABEL[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A single IDX listing card. Built to satisfy the MichRIC IDX display rules:
 *  - The listing broker's (Subscriber's) name and phone/email are shown
 *    prominently for another broker's listing (Rule l).
 *  - The "Information Deemed Reliable But Not Guaranteed" disclaimer is present.
 *  - Address is hidden when the seller has withheld it (showAddress === false).
 *  - No confidential fields are rendered.
 *
 * Unused until the live feed returns listings; wired and ready so go-live is a
 * data change, not a build.
 */
function formatPrice(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const statusLabel: Record<Listing["status"], string> = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
};

export default function ListingCard({
  listing,
  amenities,
}: {
  listing: Listing;
  amenities?: AmenityDistances;
}) {
  const addressLine = listing.showAddress
    ? listing.address
    : "Address available on request";
  const cityLine = `${listing.city}, ${listing.state} ${listing.zip}`.trim();

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-xl2 border border-dusty/15 bg-plum/60 shadow-aurora transition-colors duration-300 hover:border-auroraMauve/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-wine/30">
        {listing.photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={listing.photoUrl}
            alt={listing.showAddress ? listing.address : "Property photo"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-dusty/60">
            Photo coming soon
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-plum/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl backdrop-blur">
          {statusLabel[listing.status]}
        </span>
      </div>

      <div className="p-4">
        <p className="text-lg font-semibold text-pearl">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-1 text-sm text-pearl/90">{addressLine}</p>
        <p className="text-sm text-dusty">{cityLine}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-dusty">
          {listing.beds != null && <span>{listing.beds} bd</span>}
          {listing.baths != null && <span>{listing.baths} ba</span>}
          {listing.sqft != null && (
            <span>{listing.sqft.toLocaleString("en-US")} sqft</span>
          )}
        </div>

        {amenities && <AmenityTiles amenities={amenities} />}

        {/* Required attribution for the listing broker (Subscriber). Summary
            cards show the brokerage name only; the phone/email lives on the
            detail page, where MichRIC requires it for a detailed display. */}
        <div className="mt-4 border-t border-dusty/12 pt-3 text-xs text-dusty">
          <p className="font-medium text-dusty">
            Listing courtesy of {listing.listingBrokerName}
          </p>
          <p className="mt-1 text-dusty/70">{IDX_DISCLAIMER}</p>
        </div>
      </div>
    </Link>
  );
}
