import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CrossLinks from "@/components/CrossLinks";
import { contact } from "@/lib/data";

export const metadata: Metadata = {
  title: "FSBO + MLS Listing | SOLD IT TODAY",
  description:
    "Sell on your terms, with the level of support you choose ... from MLS entry only to full transaction support. Flexible for-sale-by-owner options from the Sold It Today team.",
  alternates: { canonical: "https://www.soldittoday.com/fsbo" },
};

/**
 * FSBO + MLS Listing ... structure only for now. Service levels are illustrative
 * and pricing is intentionally NOT shown; scope and pricing will be finalized
 * later. Keep this page copy-light and honest until then.
 */
const SERVICE_LEVELS: { name: string; blurb: string }[] = [
  {
    name: "MLS entry only",
    blurb:
      "We get your home on the MLS so it reaches buyers, agents, and the major real estate sites ... you handle the rest.",
  },
  {
    name: "MLS + inquiry/call handling",
    blurb:
      "Your home on the MLS, plus we field the buyer and agent inquiries and showings requests for you.",
  },
  {
    name: "Contract & document assistance",
    blurb:
      "Support with the paperwork ... offers, disclosures, and the documents that keep a sale on track and compliant.",
  },
  {
    name: "Full transaction support",
    blurb:
      "Hands-on guidance from listing through closing, with our team managing the details the whole way.",
  },
];

export default function FsboPage() {
  return (
    <PageShell
      eyebrow="For Sale By Owner"
      title="FSBO + MLS Listing"
      description="Sell on your terms, with the level of support you choose."
    >
      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base leading-relaxed text-dusty md:text-lg">
              Not every seller needs the same thing. Some want to run their own
              sale and simply need the reach of the MLS. Others want a hand with
              the calls, the contracts, or the whole process. We are building
              flexible options so you can choose the level of support that fits.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {SERVICE_LEVELS.map((level, i) => (
              <div
                key={level.name}
                className="aurora-ring flex flex-col rounded-xl2 border border-dusty/12 bg-bruised/40 p-7"
              >
                <span className="text-sm font-semibold tracking-widest text-auroraMauve/80">
                  0{i + 1}
                </span>
                <h2 className="mt-4 text-xl font-semibold tracking-tightest text-pearl">
                  {level.name}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                  {level.blurb}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-xl2 border border-auroraMauve/20 bg-bruised/40 p-6 text-center md:p-8">
            <div className="eyebrow text-auroraMauve">Pricing coming soon</div>
            <p className="mt-3 text-sm leading-relaxed text-dusty md:text-base">
              We are finalizing pricing and the exact scope of each service level.
              In the meantime, tell us about your home and your goals, and we will
              walk you through the options and what would fit best.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/#contact" className="btn-aurora group">
                Talk through your options
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
        </div>
      </section>

      <CrossLinks />
    </PageShell>
  );
}
