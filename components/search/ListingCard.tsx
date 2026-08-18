import type { Listing } from "@/lib/idx";
import { IDX_DISCLAIMER } from "@/lib/idx";

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

export default function ListingCard({ listing }: { listing: Listing }) {
  const addressLine = listing.showAddress
    ? listing.address
    : "Address available on request";
  const cityLine = `${listing.city}, ${listing.state} ${listing.zip}`.trim();

  return (
    <article className="group overflow-hidden rounded-xl2 border border-dusty/15 bg-plum/60 shadow-aurora transition-colors duration-300 hover:border-auroraMauve/40">
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

        {/* Required attribution for the listing broker (Subscriber). */}
        <div className="mt-4 border-t border-dusty/12 pt-3 text-xs text-dusty">
          <p className="font-medium text-dusty">
            Listing courtesy of {listing.listingBrokerName}
            {listing.listingBrokerPhone ? ` · ${listing.listingBrokerPhone}` : ""}
          </p>
          <p className="mt-1 text-dusty/70">{IDX_DISCLAIMER}</p>
        </div>
      </div>
    </article>
  );
}
