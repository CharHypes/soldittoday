import type { Metadata } from "next";
import { DPA_PROGRAMS } from "@/lib/dpaPrograms";

const PHONE_DISPLAY = "313-529-5750";
const PHONE_TEL = "3135295750";
const ADDRESS = "47720 Grand River Ave, Novi, MI 48374";
const SITE = "soldittoday.com";

const title = "Down Payment Assistance Programs in Southeast Michigan | Sold It Today";
const description =
  "First-time home buyer down payment assistance across Southeast Michigan... Detroit, Wayne County, Taylor, Lincoln Park, Livonia, and Westland. See which program fits and whether you qualify.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/dpa" },
  openGraph: { title, description, type: "website", url: "/dpa" },
  twitter: { card: "summary_large_image", title, description },
};

export default function DpaIndexPage() {
  return (
    <div className="wrap">
      {/* Brand bar: clickable logo (home) + a quick Call action. Broker name and
          full compliance block live in the footer. */}
      <div className="brandbar">
        <a className="brandlogo" href="/" aria-label="Sold It Today home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logos/sold-it-today/Sold-It-Today-high-contrast-fixed-transparent.svg"
            alt="Sold It Today"
          />
        </a>
        <a className="callbtn" href={`tel:${PHONE_TEL}`}>Call</a>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="kicker">Southeast Michigan</div>
        <h1>
          Money toward <em>your first home</em>, by city.
        </h1>
        <p className="lede">
          Several Southeast Michigan communities help first-time buyers cover the
          down payment and closing costs. Find your area below and see whether you
          qualify... it is free and does not affect your credit.
        </p>

        <div className="grid">
          {DPA_PROGRAMS.map((p) => (
            <a key={p.slug} className="card" href={`/dpa/${p.slug}`}>
              <div
                className="cval"
                style={p.comingSoon ? { fontSize: "17px", color: "#B9A6AE" } : undefined}
              >
                {p.comingSoon ? "Coming soon" : p.maxAssistance}
              </div>
              <div className="ccity">{p.city}</div>
              <div className="carr">
                {p.comingSoon ? "Get the details" : "See if you qualify"} &rarr;
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer: compliance block (broker name >= team name, address, EHO, disclaimer) */}
      <footer>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="flogo-team"
          src="/assets/logos/sold-it-today/Sold-It-Today-high-contrast-fixed-transparent.svg"
          alt="Sold It Today"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="flogo-broker"
          src="/assets/logos/optimized/remerica-cream-320w.png"
          alt="Remerica United Realty"
        />
        <div className="fmeta">
          {ADDRESS}
          <br />
          Call or text {PHONE_DISPLAY}
          <br />
          {SITE}
          <br />
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
        <div className="eho">
          <span className="ehobox">&#8962;</span> Equal Housing Opportunity
        </div>
        <p className="disclaimer">
          Sold It Today is a real estate team and is not the administrator of
          these programs and does not determine eligibility, approve
          applications, or disburse funds. Down payment assistance is provided by
          the participating cities and counties and administered by a nonprofit
          organization. Program terms, amounts, and availability are subject
          to change without notice. This is not an offer of credit or a
          commitment to lend.
        </p>
      </footer>
    </div>
  );
}
