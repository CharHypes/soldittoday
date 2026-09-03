import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SearchBar from "@/components/search/SearchBar";
import ResultsView from "@/components/search/ResultsView";
import ComplianceFooter from "@/components/search/ComplianceFooter";
import { searchListings, formatUpdated, IDX_ENABLED, type IdxSearchParams } from "@/lib/idx";
import { contact } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/*  SEO ... noindex until the live feed is connected (avoids thin content).     */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Search Homes in Southeast Michigan | SOLD IT TODAY",
  description:
    "Search homes for sale across Southeast Michigan and Metro Detroit with SOLD IT TODAY. Filter by city, price, beds, baths, and property type.",
  alternates: { canonical: "/search" },
  robots: IDX_ENABLED ? undefined : { index: false, follow: true },
};

type SP = { [key: string]: string | string[] | undefined };

function pick(sp: SP, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const params: IdxSearchParams = {
    location: pick(searchParams, "location"),
    propertyType: pick(searchParams, "propertyType"),
    minPrice: pick(searchParams, "minPrice"),
    maxPrice: pick(searchParams, "maxPrice"),
    beds: pick(searchParams, "beds"),
    baths: pick(searchParams, "baths"),
    garage: pick(searchParams, "garage"),
    ac: pick(searchParams, "ac"),
    fireplace: pick(searchParams, "fireplace"),
    singleStory: pick(searchParams, "singleStory"),
    waterfront: pick(searchParams, "waterfront"),
    newConstruction: pick(searchParams, "newConstruction"),
  };

  const result = await searchListings(params);
  const updated = formatUpdated(result.lastUpdated);

  return (
    <PageShell
      eyebrow="Search Homes"
      title="Find your place in Southeast Michigan"
      description="Search homes across Metro Detroit and Downriver, then refine by price, beds, baths, and property type."
    >
      <section className="relative bg-plum py-14 md:py-20">
        <div className="container-lux">
          <SearchBar
            initial={{
              location: params.location,
              propertyType: params.propertyType,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              beds: params.beds,
              baths: params.baths,
              features: {
                garage: params.garage === "1",
                fireplace: params.fireplace === "1",
                singleStory: params.singleStory === "1",
                waterfront: params.waterfront === "1",
                newConstruction: params.newConstruction === "1",
              },
            }}
          />

          <div className="mt-10">
            {!result.enabled ? (
              /* Honest activation state ... no fabricated listings. */
              <div className="aurora-ring mx-auto max-w-3xl rounded-xl2 border border-dusty/15 bg-bruised/40 p-8 text-center shadow-aurora md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-auroraMauve/25 bg-wine/30 px-3 py-1 text-[11px] uppercase tracking-widest text-pearl/90">
                  Live search activating
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-pearl">
                  Our live MLS home search is being activated
                </h2>
                <p className="mx-auto mt-4 max-w-xl leading-relaxed text-dusty">
                  SOLD IT TODAY&rsquo;s home search is powered by the MichRIC MLS
                  feed through {contact.brokerage} and is in final setup. Tell us
                  what you&rsquo;re looking for and we&rsquo;ll send matching
                  listings personally in the meantime.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a href="/#contact" className="btn-aurora group">
                    Schedule a Consultation
                    <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </a>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                    className="text-sm font-medium text-dusty transition-colors hover:text-pearl"
                  >
                    or call {contact.phone}
                  </a>
                </div>
              </div>
            ) : result.listings.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-dusty">
                  {result.total.toLocaleString("en-US")}{" "}
                  {result.total === 1 ? "home" : "homes"} found
                </p>
                <ResultsView listings={result.listings} />
              </>
            ) : (
              /* Feed live, but this search returned nothing. */
              <div className="mx-auto max-w-2xl rounded-xl2 border border-dusty/15 bg-bruised/40 p-8 text-center shadow-aurora">
                <h2 className="text-xl font-semibold text-pearl">
                  No homes matched your search
                </h2>
                <p className="mt-3 leading-relaxed text-dusty">
                  Try widening your price range or removing a filter. We&rsquo;re
                  glad to set up a custom search for you, too.
                </p>
                <a href="/#contact" className="btn-aurora group mt-6">
                  Get help from Charlotte
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </div>
            )}
          </div>

          <ComplianceFooter lastUpdated={updated} />
        </div>
      </section>
    </PageShell>
  );
}
