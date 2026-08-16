import {
  type DpaProgram,
  DPA_INCOME_LIMITS,
  DPA_STEPS,
} from "@/lib/dpaPrograms";
import DpaForm from "./DpaForm";

/*
 * Shared template for a single DPA city landing page. Renders entirely from a
 * DpaProgram record (see lib/dpaPrograms.ts). The six city pages are this one
 * component with different data.
 *
 * COMPLIANCE (must survive edits): broker name (Remerica United Realty) renders
 * at >= the team name (Sold It Today) size, the broker street address appears
 * in the footer, the Equal Housing Opportunity mark is present, and the footer
 * disclaimer is intact. No interest rates, APRs, loan terms, or payment
 * figures anywhere. The program administrator is referred to generically as
 * "a nonprofit organization"; no religious framing.
 */

const PHONE_DISPLAY = "313-529-5750";
const PHONE_TEL = "3135295750";
const ADDRESS = "47720 Grand River Ave, Novi, MI 48374";
const SITE = "soldittoday.com";

export default function DpaLanding({ program }: { program: DpaProgram }) {
  const {
    slug,
    city,
    kicker,
    maxAssistance,
    lede,
    secondStat,
    numnote,
    rules,
    providedBy,
    administrator,
  } = program;

  const url = `https://www.soldittoday.com/dpa/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        name: "Sold It Today",
        telephone: PHONE_DISPLAY,
        url: "https://www.soldittoday.com",
        areaServed: { "@type": "Place", name: `${city}, Michigan` },
        parentOrganization: {
          "@type": "Organization",
          name: "Remerica United Realty",
          address: {
            "@type": "PostalAddress",
            streetAddress: "47720 Grand River Ave",
            addressLocality: "Novi",
            addressRegion: "MI",
            postalCode: "48374",
            addressCountry: "US",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Down Payment Assistance",
            item: "https://www.soldittoday.com/dpa",
          },
          { "@type": "ListItem", position: 2, name: city, item: url },
        ],
      },
    ],
  };

  return (
    <div className="wrap">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Brand bar: team + broker (equal size), plus a quick Call action */}
      <div className="brandbar">
        <div className="lockup">
          <div className="team">Sold It Today</div>
          <div className="broker">Remerica United Realty</div>
        </div>
        <a href={`tel:${PHONE_TEL}`}>Call</a>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="kicker">{kicker}</div>
        <h1>
          Up to {maxAssistance} toward <em>buying your first home</em> in {city}.
        </h1>
        <p className="lede">{lede}</p>

        <div className="numbers">
          <div className="num">
            <div className="lab">Assistance available</div>
            <div className="val">{maxAssistance}</div>
            <div className="sub">
              Toward down payment and eligible closing costs
            </div>
          </div>
          <div className="num">
            <div className="lab">{secondStat.label}</div>
            <div className="val">{secondStat.value}</div>
            <div className="sub">{secondStat.sub}</div>
          </div>
        </div>
        <p className="numnote">{numnote}</p>
      </div>

      {/* Who qualifies */}
      <section>
        <h2>Who qualifies</h2>
        <p className="h2sub">You need to check every box below.</p>
        <ul className="rules">
          {rules.map((r, i) => (
            <li key={i}>
              <span>
                <b>{r.strong}</b>
                {r.rest ? ` ${r.rest}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Income limits */}
      <section>
        <h2>2026 income limits</h2>
        <p className="h2sub">
          Total household income, counting every adult in the home.
        </p>
        <table>
          <thead>
            <tr>
              <th>Household size</th>
              <th>Income limit</th>
            </tr>
          </thead>
          <tbody>
            {DPA_INCOME_LIMITS.map((row) => (
              <tr key={row.size}>
                <td>{row.size}</td>
                <td>{row.limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* What happens next */}
      <section>
        <h2>What happens next</h2>
        <p className="h2sub">
          Most buyers are three to nine months out. That is normal.
        </p>
        <ol className="steps">
          {DPA_STEPS.map((step) => (
            <li key={step.title}>
              <div>
                <b>{step.title}</b>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Form + funding note */}
      <section>
        <div className="formcard">
          <DpaForm city={city} slug={slug} />
        </div>

        <div className="banner">
          <span>Note</span>
          <div>
            Funding is first come, first served and can run out mid-year. Amounts
            and rules are set by {providedBy} and administered by {administrator},
            and are subject to change.
          </div>
        </div>
      </section>

      {/* Footer: compliance block (broker name >= team name, address, EHO, disclaimer) */}
      <footer>
        <div className="fteam">Sold It Today</div>
        <div className="fbroker">Remerica United Realty</div>
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
          this program and does not determine eligibility, approve applications,
          or disburse funds. Down payment assistance is provided by {providedBy}{" "}
          and administered by {administrator}. Program terms, amounts, and
          availability are subject to change without notice. This is not an offer
          of credit or a commitment to lend.
        </p>
      </footer>
    </div>
  );
}
