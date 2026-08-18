import { BROKERAGE_NAME, IDX_DISCLAIMER, michRicCopyright } from "@/lib/idx";

/**
 * The IDX compliance block required on displays of MichRIC listing data:
 *  - Brokerage name clearly identified.
 *  - Last-update date ("Updated: mm/dd/yy") when the feed provides one.
 *  - "Information Deemed Reliable But Not Guaranteed" disclaimer.
 *  - MichRIC copyright, current year.
 *
 * Rendered on the search page so it is correct and in place the moment the feed
 * goes live. Font sizes are kept at or above the required 10pt minimum.
 */
export default function ComplianceFooter({
  lastUpdated,
}: {
  lastUpdated: string | null;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="mt-12 space-y-1.5 border-t border-dusty/12 pt-6 text-xs leading-relaxed text-dusty/80">
      <p className="font-medium text-dusty">
        Listings displayed through Broker Reciprocity (IDX), brokered by{" "}
        {BROKERAGE_NAME}.
      </p>
      {lastUpdated && <p>Updated: {lastUpdated}</p>}
      <p>{IDX_DISCLAIMER}</p>
      <p>{michRicCopyright(year)}</p>
    </div>
  );
}
