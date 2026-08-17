/*
 * Down Payment Assistance (DPA) campaign landing-page data.
 *
 * One entry per city program. The six pages are 95% identical, so all of the
 * per-city variation lives here and a single template renders it
 * (see components/dpa/DpaLanding.tsx). Program figures are editable data on
 * purpose: amounts, price caps, and asset caps change with funding, so update
 * them here rather than in markup.
 *
 * Figures verified against nationalfaith.org as of August 2026. The programs
 * are administered by a nonprofit organization; the public pages refer to it
 * generically as "a nonprofit organization" (owner preference; also keeps any
 * religious connotation off the page, consistent with Fair Housing Act care).
 *
 * COMPLIANCE (do not remove downstream): every rendered page must keep the
 * broker name at >= the team name's type size, the broker street address, the
 * Equal Housing Opportunity mark, and the footer disclaimer. No interest
 * rates, APRs, loan terms, or monthly payment figures anywhere.
 */

export type DpaRule = { strong: string; rest?: string };

export type DpaStat = { label: string; value: string; sub: string };

export type DpaProgram = {
  slug: string; // route segment, e.g. "detroit" -> /dpa/detroit
  city: string; // display name, e.g. "Detroit", "Wayne County"
  kicker: string; // "Detroit, Michigan"
  metaDescription: string; // SEO meta description
  // When true, the page renders a "details coming soon" placeholder (no
  // fabricated figures) and is set to noindex until real data is added. The
  // detail fields below are omitted for coming-soon programs.
  comingSoon?: boolean;
  maxAssistance?: string; // headline number, e.g. "$25,000"
  lede?: string;
  secondStat?: DpaStat; // the second number box (residency OR price limit)
  numnote?: string; // small note under the two numbers
  rules?: DpaRule[]; // "Who qualifies" checklist
  providedBy?: string; // "the City of Detroit" | "Wayne County"
  administrator?: string; // public label, e.g. "a nonprofit organization"
};

// Shared across all six programs (identical in every source page).
export const DPA_INCOME_LIMITS: { size: string; limit: string }[] = [
  { size: "1 person", limit: "$58,700" },
  { size: "2 people", limit: "$67,100" },
  { size: "3 people", limit: "$75,500" },
  { size: "4 people", limit: "$83,850" },
  { size: "5 people", limit: "$90,600" },
  { size: "6 people", limit: "$97,300" },
  { size: "7 people", limit: "$104,000" },
  { size: "8 people", limit: "$110,700" },
];

export const DPA_STEPS: { title: string; body: string }[] = [
  {
    title: "Fill out the form below",
    body: "Two minutes. No income figures, no credit pull, nothing that affects your report.",
  },
  {
    title: "We'll talk it through",
    body: "I will tell you straight whether you look eligible and what is standing in the way if you are not.",
  },
  {
    title: "Education class and pre-approval",
    body: "Both are required before an application goes in. We line them up together.",
  },
  {
    title: "Find the house, apply for the assistance",
    body: "The application goes in after you have an accepted purchase agreement.",
  },
];

const ADMIN = "a nonprofit organization";

const PRICE_LIMIT_SUB = "The home has to come in at or under this";

// The rule shared by the five "price cap" cities (all but Detroit), minus the
// city-specific first rule and asset-cap wording, which are set per program.
const commonNoOwnership: DpaRule = {
  strong: "No home ownership in the past 3 years.",
  rest: "No interest in any other real estate at time of purchase.",
};
const commonEducation: DpaRule = {
  strong: "Complete a homebuyer education course.",
  rest: "We will point you to an approved one.",
};

export const DPA_PROGRAMS: DpaProgram[] = [
  {
    slug: "detroit",
    city: "Detroit",
    kicker: "Detroit, Michigan",
    maxAssistance: "$25,000",
    lede: "The City of Detroit helps first-time buyers cover the down payment and closing costs. It is the biggest assistance program in the area, and most people who qualify have no idea it exists.",
    secondStat: {
      label: "Detroit residency required",
      value: "12 months",
      sub: "You must have lived in the city for the past year",
    },
    numnote:
      "Detroit is the largest program in the region, and the residency requirement is the gate most people miss. Worth checking before you fall in love with a house.",
    rules: [
      {
        strong: "Lived in the City of Detroit for the past 12 months.",
        rest: "Proof of residency is required.",
      },
      commonNoOwnership,
      {
        strong: "Household income at or below the program limit.",
        rest: "See the table below.",
      },
      commonEducation,
      { strong: "Buy in the City of Detroit.", rest: "Primary residence only." },
      {
        strong: "Applications are prioritized for 2023 flood impact.",
        rest: "A FEMA or DWSD claim is needed to document it.",
      },
    ],
    providedBy: "the City of Detroit",
    administrator: ADMIN,
    metaDescription:
      "Up to $25,000 in down payment assistance for first-time home buyers in Detroit, MI. See if you qualify for the City of Detroit program. Free eligibility check, no credit pull.",
  },
  {
    slug: "taylor",
    city: "Taylor",
    kicker: "Taylor, Michigan",
    maxAssistance: "$14,999",
    lede: "The City of Taylor helps first-time buyers cover the down payment and closing costs. Most people who qualify have no idea the program exists.",
    secondStat: {
      label: "Home price limit",
      value: "$234,000",
      sub: PRICE_LIMIT_SUB,
    },
    numnote:
      "We put both numbers up front because the price cap is the one that surprises people. Better to know now than three houses in.",
    rules: [
      {
        strong: "Buy in the City of Taylor.",
        rest: "Determined by the property's legal description, not the mailing address.",
      },
      commonNoOwnership,
      {
        strong: "Household income at or below 80% of Area Median Income.",
        rest: "See the table below.",
      },
      {
        strong: "Under $20,000 in liquid assets.",
        rest: "Savings, checking, and similar accounts.",
      },
      commonEducation,
      {
        strong: "Live in the home for 5 years.",
        rest: "That is what makes the second mortgage forgivable.",
      },
      {
        strong: "Traditional mortgage financing required.",
        rest: "Land contract and lease-purchase are not eligible.",
      },
      { strong: "Single family or condo.", rest: "Primary residence only." },
    ],
    providedBy: "the City of Taylor",
    administrator: ADMIN,
    metaDescription:
      "Up to $14,999 in down payment assistance for first-time home buyers in Taylor, MI. See if you qualify. Free eligibility check, no credit pull.",
  },
  {
    slug: "lincoln-park",
    city: "Lincoln Park",
    kicker: "Lincoln Park, Michigan",
    maxAssistance: "$14,999",
    lede: "The City of Lincoln Park helps first-time buyers cover the down payment and closing costs. Most people who qualify have no idea the program exists.",
    secondStat: {
      label: "Home price limit",
      value: "$219,000",
      sub: PRICE_LIMIT_SUB,
    },
    numnote:
      "We put both numbers up front because the price cap is the one that surprises people. Better to know now than three houses in.",
    rules: [
      {
        strong: "Buy in the City of Lincoln Park.",
        rest: "Determined by the property's legal description, not the mailing address.",
      },
      commonNoOwnership,
      {
        strong: "Household income at or below 80% of Area Median Income.",
        rest: "See the table below.",
      },
      {
        strong: "Under $20,000 in liquid assets.",
        rest: "Savings, checking, and similar accounts.",
      },
      commonEducation,
      {
        strong: "Live in the home for 5 years.",
        rest: "That is what makes the second mortgage forgivable.",
      },
      {
        strong: "Traditional mortgage financing required.",
        rest: "Land contract and lease-purchase are not eligible.",
      },
      { strong: "Single family or condo.", rest: "Primary residence only." },
    ],
    providedBy: "the City of Lincoln Park",
    administrator: ADMIN,
    metaDescription:
      "Up to $14,999 in down payment assistance for first-time home buyers in Lincoln Park, MI. See if you qualify. Free eligibility check, no credit pull.",
  },
  {
    slug: "livonia",
    city: "Livonia",
    kicker: "Livonia, Michigan",
    maxAssistance: "$14,999",
    lede: "The City of Livonia helps first-time buyers cover the down payment and closing costs. Most people who qualify have no idea the program exists.",
    secondStat: {
      label: "Home price limit",
      value: "$219,000",
      sub: PRICE_LIMIT_SUB,
    },
    numnote:
      "We put both numbers up front because the price cap is the one that surprises people. In Livonia it is the tightest part of the whole program.",
    rules: [
      {
        strong: "Buy in the City of Livonia.",
        rest: "Determined by the property's legal description, not the mailing address.",
      },
      commonNoOwnership,
      {
        strong: "Household income at or below 80% of Area Median Income.",
        rest: "See the table below.",
      },
      {
        strong: "Under $20,000 in liquid assets.",
        rest: "Savings, checking, and similar accounts.",
      },
      commonEducation,
      {
        strong: "Live in the home for 5 years.",
        rest: "That is what makes the second mortgage forgivable.",
      },
      {
        strong: "Traditional mortgage financing required.",
        rest: "Land contract and lease-purchase are not eligible.",
      },
      { strong: "Single family or condo.", rest: "Primary residence only." },
    ],
    providedBy: "the City of Livonia",
    administrator: ADMIN,
    metaDescription:
      "Up to $14,999 in down payment assistance for first-time home buyers in Livonia, MI. See if you qualify. Free eligibility check, no credit pull.",
  },
  {
    slug: "westland",
    city: "Westland",
    kicker: "Westland, Michigan",
    maxAssistance: "$14,500",
    lede: "The City of Westland helps first-time buyers cover the down payment and closing costs. Most people who qualify have no idea the program exists.",
    secondStat: {
      label: "Home price limit",
      value: "$219,000",
      sub: PRICE_LIMIT_SUB,
    },
    numnote:
      "We put both numbers up front because the price cap is the one that surprises people. Better to know now than three houses in.",
    rules: [
      {
        strong: "Buy in the City of Westland.",
        rest: "Determined by the property's legal description, not the mailing address.",
      },
      commonNoOwnership,
      {
        strong: "Household income at or below 80% of Area Median Income.",
        rest: "See the table below.",
      },
      {
        strong: "Under $25,000 in liquid assets.",
        rest: "Westland allows more here than most neighboring cities.",
      },
      commonEducation,
      {
        strong: "Live in the home for 5 years.",
        rest: "That is what makes the second mortgage forgivable.",
      },
      {
        strong: "Traditional mortgage financing required.",
        rest: "Land contract and lease-purchase are not eligible.",
      },
      { strong: "Single family or condo.", rest: "Primary residence only." },
    ],
    providedBy: "the City of Westland",
    administrator: ADMIN,
    metaDescription:
      "Up to $14,500 in down payment assistance for first-time home buyers in Westland, MI. See if you qualify. Free eligibility check, no credit pull.",
  },
  {
    slug: "wayne-county",
    city: "Wayne County",
    kicker: "Wayne County, Michigan",
    maxAssistance: "$13,999",
    lede: "Wayne County helps first-time buyers cover the down payment and closing costs across most of its communities. Several cities run their own separate programs instead.",
    secondStat: {
      label: "Home price limit",
      value: "$234,000",
      sub: PRICE_LIMIT_SUB,
    },
    numnote:
      "Wayne County runs its own program separate from the individual cities, and it does not cover every community in the county. Check the list below first.",
    rules: [
      {
        strong: "Buy in a participating Wayne County community.",
        rest: "Allen Park, Belleville, Brownstown, Ecorse, Flat Rock, Garden City, Gibraltar, Grosse Ile Twp., Grosse Pointe, Grosse Pointe Farms, Grosse Pointe Park, Grosse Pointe Woods, Hamtramck, Harper Woods, Highland Park, Huron Twp., Inkster, Melvindale, Northville, Plymouth, River Rouge, Rockwood, Romulus, Southgate, Sumpter Twp., Trenton, Van Buren Twp., Wayne, Woodhaven, Wyandotte.",
      },
      {
        strong:
          "Canton, Dearborn, Dearborn Heights, Detroit, Lincoln Park, Livonia, Redford, Taylor, and Westland are excluded.",
        rest: "Several of those run their own programs. Ask us and we will point you to the right one.",
      },
      commonNoOwnership,
      {
        strong: "Household income at or below 80% of Area Median Income.",
        rest: "See the table below.",
      },
      {
        strong: "Under $20,000 in liquid assets.",
        rest: "Savings, checking, and similar accounts.",
      },
      commonEducation,
      {
        strong: "Live in the home for 5 years.",
        rest: "That is what makes the second mortgage forgivable.",
      },
      {
        strong: "Traditional mortgage financing required.",
        rest: "Land contract and lease-purchase are not eligible.",
      },
      { strong: "Single family or condo.", rest: "Primary residence only." },
    ],
    providedBy: "Wayne County",
    administrator: ADMIN,
    metaDescription:
      "Up to $13,999 in down payment assistance for first-time home buyers in participating Wayne County, MI communities. See if you qualify. Free eligibility check.",
  },
  {
    slug: "pontiac",
    city: "Pontiac",
    kicker: "Pontiac, Michigan",
    maxAssistance: "$20,000",
    lede: "The City of Pontiac helps first-time buyers cover the down payment and closing costs, and most people who qualify have no idea it exists.",
    secondStat: {
      label: "Forgivable in full",
      value: "10 years",
      sub: "Live in the home for the ownership period and the assistance is forgiven.",
    },
    numnote:
      "The assistance is a forgivable second mortgage. Awards of $1 to $14,999 are forgiven over 5 years and $15,000 to $20,000 over 10 years, so if you stay in the home, there is nothing to pay back.",
    rules: [
      {
        strong: "Buy in the City of Pontiac.",
        rest: "Determined by the property's legal description, not the mailing address.",
      },
      {
        strong: "No home ownership in the past 3 years.",
        rest: "This is what qualifies you as a first-time buyer.",
      },
      {
        strong: "Household income at or below 80% of Area Median Income.",
        rest: "See the table below.",
      },
      {
        strong: "Under $20,000 in liquid assets.",
        rest: "Savings, checking, and similar accounts.",
      },
      {
        strong: "Complete a homebuyer education course.",
        rest: "We will point you to an approved one.",
      },
      {
        strong: "Meet standard lending ratios.",
        rest: "Housing costs at or below 35% of your income, and total monthly debts at or below 43%.",
      },
      {
        strong: "Stay for the forgiveness period.",
        rest: "Awards of $1 to $14,999 are forgiven over 5 years; $15,000 to $20,000 over 10 years.",
      },
    ],
    providedBy: "the City of Pontiac",
    administrator: "a nonprofit organization",
    metaDescription:
      "Up to $20,000 in down payment assistance for first-time home buyers in Pontiac, MI. See if you qualify. Free eligibility check, no credit pull.",
  },
  {
    slug: "warren",
    city: "Warren",
    kicker: "Warren, Michigan",
    comingSoon: true,
    lede: "The City of Warren has a down payment assistance program for first-time buyers. We are confirming the current amounts and rules, and will have the full details shortly.",
    metaDescription:
      "Down payment assistance for first-time home buyers in Warren, MI. Program details coming soon. Tell us you're interested and we'll reach out with the specifics.",
  },
];

export function getDpaProgram(slug: string): DpaProgram | undefined {
  return DPA_PROGRAMS.find((p) => p.slug === slug);
}
