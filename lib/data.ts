// Centralized placeholder data for SOLD IT TODAY.
// Swap these arrays for a CMS, API, or IDX feed later — components read from here.

export type NavLink = { label: string; href: string };

// Primary site navigation. One-page anchors for the homepage sections.
// "Search Homes" is a primary nav item per Phase 2 direction.
export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Search Homes", href: "#search" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Relocation", href: "/relocation" }, // dedicated page (route, not anchor)
  { label: "Listings", href: "#listings" },
  { label: "Contact", href: "#contact" },
];

// Future content routes — scaffolded for AI/SEO discoverability. These pages
// exist as branded placeholders today; content gets filled in over time.
// Relocation is intentionally NOT here — it now lives in navLinks (which the
// footer also renders), so listing it here too would duplicate it in the footer.
export const futurePages: NavLink[] = [
  { label: "Meet Charlotte", href: "/meet-charlotte" },
  { label: "Team", href: "/team" },
  // Communities is the canonical hub (replaces the retired /service-areas).
  { label: "Communities", href: "/communities" },
  { label: "Neighborhood Guides", href: "/neighborhood-guides" },
  { label: "Resources", href: "/resources" },
  { label: "Preferred Partners", href: "/preferred-partners" },
];

/* -------------------------------------------------------------------------- */
/*  Brand ticker — the scrolling band under the hero                          */
/*  Services first, then markets served. Keep it to terms that are genuinely  */
/*  covered elsewhere on the site.                                            */
/* -------------------------------------------------------------------------- */

export const tickerItems: string[] = [
  "Buyers",
  "Sellers",
  "First-Time Buyers",
  "Investors",
  "Relocation",
  "Novi",
  "Northville",
  "Brighton",
  "Ann Arbor",
  "Livonia",
  "Monroe",
  "Southeast Michigan",
];

export type Stat = { value: string; label: string };

// Charlotte was licensed 19 July 2006 — twenty years as of 19 July 2026.
export const stats: Stat[] = [
  { value: "20", label: "Years licensed" },
  { value: "350+", label: "Homes sold" },
  { value: "5★", label: "Zillow rated" },
  // "SE MI" read as an abbreviation nobody outside the office knows.
  { value: "Metro Detroit", label: "Local market depth" },
];

/* -------------------------------------------------------------------------- */
/*  Home Search — filter option data (frontend only, ready for IDX)           */
/* -------------------------------------------------------------------------- */

export type SearchOption = { value: string; label: string };

export const propertyTypes: SearchOption[] = [
  { value: "any", label: "Any Type" },
  { value: "single-family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi-family", label: "Multi-Family" },
  { value: "land", label: "Land / Lot" },
];

export const priceOptions: SearchOption[] = [
  { value: "", label: "No Min" },
  { value: "100000", label: "$100K" },
  { value: "200000", label: "$200K" },
  { value: "300000", label: "$300K" },
  { value: "400000", label: "$400K" },
  { value: "500000", label: "$500K" },
  { value: "750000", label: "$750K" },
  { value: "1000000", label: "$1M" },
];

export const bedBathOptions: SearchOption[] = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

/* -------------------------------------------------------------------------- */
/*  Services                                                                   */
/* -------------------------------------------------------------------------- */

export type Service = {
  id: string;
  title: string;
  description: string;
  points: string[];
  href?: string; // optional link to a dedicated service page
};

export const services: Service[] = [
  {
    id: "buying",
    title: "Buying",
    description:
      "A calm, strategic search built around your goals — from first showing to final signature.",
    points: ["Curated home search", "Negotiation strategy", "Closing guidance"],
  },
  {
    id: "selling",
    title: "Selling",
    description:
      "Positioning, pricing, and marketing that present your home at its strongest in any market.",
    points: ["Pricing strategy", "Premium marketing", "Maximized net proceeds"],
  },
  {
    id: "first-time",
    title: "First-Time Buyers",
    description:
      "Clear, patient guidance through every step so your first purchase feels confident, not confusing.",
    points: ["Step-by-step process", "Lender connections", "Honest expectations"],
  },
  {
    id: "investment",
    title: "Investment Properties",
    description:
      "Numbers-first guidance to help you build and protect long-term wealth through real estate.",
    points: ["Cash-flow analysis", "Market opportunities", "Portfolio strategy"],
  },
  {
    id: "relocation",
    title: "Relocation & Move-Up",
    description:
      "Coordinated buying and selling so your next chapter in Southeast Michigan stays seamless.",
    points: ["Timeline coordination", "Area expertise", "Dual transaction support"],
    href: "/relocation",
  },
];

/* -------------------------------------------------------------------------- */
/*  Featured Listings (placeholder imagery — NOT live MLS data)               */
/* -------------------------------------------------------------------------- */

export type ListingStatus = "Just Listed" | "Under Contract" | "Sold";

export type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  status: ListingStatus;
  image: string;
};

export const listings: Listing[] = [
  {
    id: "l1",
    title: "Modern Colonial Estate",
    location: "Grosse Ile, MI",
    price: "$685,000",
    beds: 4,
    baths: 3,
    sqft: "3,250",
    status: "Just Listed",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "l2",
    title: "Lakeside Contemporary",
    location: "Trenton, MI",
    price: "$540,000",
    beds: 3,
    baths: 2,
    sqft: "2,400",
    status: "Under Contract",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "l3",
    title: "Restored Brick Tudor",
    location: "Dearborn, MI",
    price: "$415,000",
    beds: 4,
    baths: 2,
    sqft: "2,180",
    status: "Sold",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "l4",
    title: "Downtown Loft Residence",
    location: "Detroit, MI",
    price: "$372,000",
    beds: 2,
    baths: 2,
    sqft: "1,640",
    status: "Just Listed",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "l5",
    title: "Craftsman Family Home",
    location: "Wyandotte, MI",
    price: "$329,000",
    beds: 3,
    baths: 2,
    sqft: "1,920",
    status: "Under Contract",
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1100&q=80",
  },
  {
    id: "l6",
    title: "Refined Suburban Ranch",
    location: "Riverview, MI",
    price: "$298,500",
    beds: 3,
    baths: 2,
    sqft: "1,580",
    status: "Sold",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1100&q=80",
  },
];

/* -------------------------------------------------------------------------- */
/*  Brand values — what SOLD IT TODAY is built around                         */
/* -------------------------------------------------------------------------- */

export type Value = { title: string; description: string };

export const brandValues: Value[] = [
  {
    title: "Clear Guidance",
    description:
      "Straight answers and a mapped-out path, so you always know the next step.",
  },
  {
    title: "Honest Education",
    description:
      "We help you understand your options fully before any big decision is made.",
  },
  {
    title: "Strong Negotiation",
    description:
      "Experienced advocacy that protects your position and your bottom line.",
  },
  {
    title: "Creative Problem-Solving",
    description:
      "Down payment assistance, credit guidance, and strategy when the path isn't obvious.",
  },
  {
    title: "Local Market Knowledge",
    description:
      "Real insight into Metro Detroit and Southeast Michigan pricing and timing.",
  },
  {
    title: "Options Before Decisions",
    description:
      "A team that informs first — so you move forward confident and ready.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Team — built to support a growing roster of agents                        */
/* -------------------------------------------------------------------------- */

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  email: string;
  phone: string;
  /**
   * Optional pull-quote from a verified Zillow review of this agent. Must be
   * a real client's words — omit the field rather than inventing one.
   */
  quote?: { text: string; attribution: string };
  image: string;
  // CSS object-position for the card crop — tuned per photo so no head,
  // hair, or forehead is cut off (portraits are biased toward the top).
  objectPosition: string;
  // Optional per-photo zoom for balancing cards (e.g. scaling a wider photo up
  // so the subject matches the others). Applied as an inline transform so it
  // works regardless of Tailwind's content scanning (which excludes lib/).
  imageScale?: number;
  imageOrigin?: string;
};

export const team: TeamMember[] = [
  {
    id: "charlotte-hypes",
    name: "Charlotte Hypes",
    role: "Founder & Team Lead, REALTOR®",
    bio: "With 20 years of experience and 350+ homes sold, Charlotte founded SOLD IT TODAY to make real estate clear, strategic, and genuinely client-first across Southeast Michigan.",
    specialties: [
      "Listing strategy",
      "Negotiation",
      "First-time buyers",
      "Investment",
    ],
    email: "charlotte@soldittoday.com",
    phone: "(313) 529-5750",
    quote: {
      text: "She goes above and beyond and takes calls at all hours.",
      attribution: "Janette W. · Zillow",
    },
    image: "/assets/team/charlotte-hypes.png",
    objectPosition: "center 18%",
  },
  {
    id: "nisha-patel",
    name: "Nisha Patel",
    role: "REALTOR® | Buyer & Listing Specialist",
    bio: "Nisha works with buyers and sellers throughout Southeast Michigan, combining strong market knowledge, responsive communication, and thoughtful strategy to help clients achieve their real estate goals.",
    specialties: ["Listing & marketing", "Pricing strategy", "Staging guidance"],
    email: "nisha@soldittoday.com",
    phone: "(734) 717-1169",
    // Headshot supplied by Nisha, June 2026. Replaces a 318px original that
    // was soft on retina screens. Pre-cropped to the card's 4:5 ratio, so the
    // default centering needs no vertical nudge.
    image: "/assets/team/nisha-patel-2026.jpg",
    objectPosition: "center",
  },
  {
    id: "christopher-centers",
    name: "Christopher Centers",
    role: "REALTOR® | Buyer, Investment & New Construction Specialist",
    bio: "Christopher specializes in investment properties and new construction, helping clients evaluate opportunities, build long-term wealth, and make confident real estate decisions.",
    specialties: ["Investment", "New construction", "Move-up buyers"],
    email: "christopher@soldittoday.com",
    phone: "(313) 706-9785",
    image: "/assets/team/christopher-centers.png",
    objectPosition: "center 30%",
  },
];

/* -------------------------------------------------------------------------- */
/*  Preferred Partners — full public-facing company names only                */
/*  NOTE: entries below are PLACEHOLDERS. Replace with real, client-provided  */
/*  partners. Do not invent companies — use the labeled placeholders.         */
/* -------------------------------------------------------------------------- */

export type Partner = {
  name: string;
  detail: string;
  placeholder: boolean;
};

export type PartnerCategory = {
  id: string;
  title: string;
  blurb: string;
  partners: Partner[];
};

export const partnerCategories: PartnerCategory[] = [
  {
    id: "lenders",
    title: "Preferred Lenders",
    blurb:
      "Trusted mortgage professionals for pre-approval, down payment assistance, and creative financing.",
    partners: [
      { name: "Preferred Lender — Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Lender — Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "title",
    title: "Preferred Title Companies",
    blurb:
      "Title and closing partners that keep transactions clean, clear, and on schedule.",
    partners: [
      { name: "First Centennial Title — Example Placeholder", detail: "Confirm before publishing", placeholder: true },
      { name: "Preferred Title Company — Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "inspectors",
    title: "Home Inspectors",
    blurb:
      "Thorough, honest inspectors who help you understand a home before you commit.",
    partners: [
      { name: "Preferred Home Inspector — Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Home Inspector — Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "insurance",
    title: "Insurance Agents",
    blurb:
      "Homeowners insurance partners to protect your investment from day one.",
    partners: [
      { name: "Preferred Insurance Agency — Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Insurance Agency — Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "contractors",
    title: "Contractors & Tradespeople",
    blurb:
      "Vetted contractors and trades for repairs, updates, and getting a home market-ready.",
    partners: [
      { name: "Preferred Contractor — Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Contractor — Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Why Work With Us                                                           */
/* -------------------------------------------------------------------------- */

export type Reason = { title: string; description: string };

export const reasons: Reason[] = [
  {
    title: "Clear Communication",
    description:
      "You always know where things stand. No guessing, no chasing — just steady, honest updates.",
  },
  {
    title: "Strong Negotiation",
    description:
      "Two decades of deals sharpen one thing: protecting your position when it matters most.",
  },
  {
    title: "Local Expertise",
    description:
      "Deep knowledge of Metro Detroit and Southeast Michigan neighborhoods, pricing, and timing.",
  },
  {
    title: "Client-First Strategy",
    description:
      "Your goals lead every decision. The plan is built around your life, not a sales quota.",
  },
  {
    title: "Step-by-Step Guidance",
    description:
      "From first conversation to closing table, every stage is mapped out and explained.",
  },
  {
    title: "Real, Measurable Results",
    description:
      "350+ homes sold across the region — experience that turns strategy into outcomes.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                               */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

/*
 * Verified Zillow reviews only. Every entry here must correspond to a real
 * review on the profile at `reviewsUrl` — never write a plausible-sounding
 * quote to fill the section out.
 */
export const testimonials: Testimonial[] = [
  {
    id: "zillow-warren-2024",
    quote:
      "Charlotte was extremely patient with all the questions I had and walked me through the process thoroughly. She truly cares about helping you. She goes above and beyond and takes calls at all hours and on weekends if necessary.",
    name: "Janette Warren",
    role: "Bought & Sold — Taylor, MI · Nov 2024",
  },
  {
    id: "zillow-tyredbeard-2022",
    quote:
      "Charlotte and her team were extremely helpful. Everything from understanding the process, working with my schedule, getting me to closing super fast, and saving me money. I can't imagine there being a better realtor for my situation.",
    name: "TyRedBeard",
    role: "First-Time Buyer — Westland, MI · May 2022",
  },
  {
    id: "zillow-winkler-2021",
    quote:
      "Charlotte went above and beyond to help me find a place to live. There were many ups and downs but she hung in there with me. I really appreciate the individual attention she gave me. She was a pleasure to work with.",
    name: "Jackyewinkler",
    role: "Bought — Melvindale, MI · June 2021",
  },
];

/* -------------------------------------------------------------------------- */
/*  Meet Charlotte — founder spotlight                                         */
/* -------------------------------------------------------------------------- */

export const charlotteStats: Stat[] = [
  { value: "20", label: "Years Licensed" },
  { value: "Southeast Michigan", label: "Market Expert" },
  { value: "350+", label: "Homes Sold" },
  { value: "Circle of Excellence", label: "Recipient" },
];

// External profile with verified client reviews.
export const reviewsUrl = "https://www.zillow.com/profile/CharlotteHypes";

/* -------------------------------------------------------------------------- */
/*  Review themes — what clients consistently mention                          */
/*  (Descriptive themes, NOT fabricated direct quotes. Verified reviews live   */
/*   on the Zillow profile linked above.)                                      */
/* -------------------------------------------------------------------------- */

export type ReviewTheme = { title: string; description: string };

export const reviewThemes: ReviewTheme[] = [
  {
    title: "Clear Communication",
    description:
      "You always know where things stand — steady updates, plain answers, and no chasing for information.",
  },
  {
    title: "Patience",
    description:
      "Never rushed. Questions are welcome, and every step is explained until it genuinely makes sense.",
  },
  {
    title: "Education",
    description:
      "Clients leave understanding their options — the reasoning behind each decision, not just the outcome.",
  },
  {
    title: "Responsiveness",
    description:
      "Calls, texts, and emails returned quickly, so momentum never stalls when timing matters most.",
  },
  {
    title: "First-Time Buyer Guidance",
    description:
      "First-time buyers get extra care — the whole process demystified from pre-approval to keys in hand.",
  },
  {
    title: "Comfortable & Supported",
    description:
      "A calm, no-pressure experience where people feel genuinely guided, never sold to.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Service Areas                                                              */
/* -------------------------------------------------------------------------- */

export type MarketArea = { name: string; note: string };

export const marketAreas: MarketArea[] = [
  { name: "Metro Detroit", note: "City & suburban expertise" },
  { name: "Downriver", note: "Local roots" },
  { name: "Dearborn", note: "Historic neighborhoods" },
  { name: "Grosse Ile", note: "Waterfront living" },
  { name: "Trenton", note: "Established communities" },
  { name: "Wyandotte", note: "Walkable charm" },
  { name: "Riverview", note: "Family-friendly" },
  { name: "Southgate", note: "Growing demand" },
];

/* -------------------------------------------------------------------------- */
/*  Relocation — content for the /relocation page                              */
/* -------------------------------------------------------------------------- */

export type RelocationAudience = { title: string; description: string };

export const relocationAudiences: RelocationAudience[] = [
  {
    title: "Out-of-State Buyers",
    description:
      "Moving to Michigan from elsewhere — virtual tours, honest market context, and trusted eyes on every home so you can decide with confidence.",
  },
  {
    title: "Job Transfers",
    description:
      "Relocating for a new role or office. We work to your timeline and coordinate buying and selling when both are in motion.",
  },
  {
    title: "Corporate & Employer Moves",
    description:
      "Supporting companies relocating talent into the region with a smooth, consistent experience for every employee.",
  },
  {
    title: "Automotive Industry",
    description:
      "Metro Detroit runs on the auto industry — guidance for engineers, suppliers, and transferees settling into the area.",
  },
  {
    title: "Healthcare Professionals",
    description:
      "Physicians, nurses, and staff relocating to the region's hospital systems and practices.",
  },
  {
    title: "University Employees",
    description:
      "Faculty and staff moving for positions at the area's colleges and universities.",
  },
];

export const relocationAreaMatch: { title: string; description: string }[] = [
  {
    title: "Commute-Based",
    description:
      "Neighborhoods matched to your workplace and realistic drive times.",
  },
  {
    title: "Lifestyle-Based",
    description:
      "Walkability, schools, amenities, and the pace of life that fits you.",
  },
  {
    title: "Budget-Based",
    description:
      "Where your numbers go furthest — with the honest trade-offs explained.",
  },
];

export type ProcessStep = { step: string; title: string; description: string };

export const relocationProcess: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery consultation",
    description:
      "We learn your timeline, budget, must-haves, and what “home” needs to feel like.",
  },
  {
    step: "02",
    title: "Area matching",
    description:
      "A short list of areas matched to your commute, lifestyle, and budget — with the reasoning behind each.",
  },
  {
    step: "03",
    title: "Guided search",
    description:
      "Curated homes, virtual or in-person tours, and clear comparisons. No pressure — just clarity.",
  },
  {
    step: "04",
    title: "Offer & negotiation",
    description:
      "Strong, strategic offers that protect your position in any market.",
  },
  {
    step: "05",
    title: "Closing & settling in",
    description:
      "A coordinated closing plus trusted local partners to help you settle in quickly.",
  },
];

export type Faq = { q: string; a: string };

export const relocationFaqs: Faq[] = [
  {
    q: "Can you help if I'm moving from out of state?",
    a: "Absolutely — it's a large part of what we do. Out-of-state buyers get virtual tours, local market context, and trusted eyes on every home so you can decide with confidence from afar.",
  },
  {
    q: "How do you help me choose the right area?",
    a: "We match neighborhoods to your commute, lifestyle, and budget, and walk you through the honest trade-offs of each so the choice feels clear rather than overwhelming.",
  },
  {
    q: "Do you work with corporate relocations?",
    a: "Yes. We support individuals, families, and companies relocating employees to Michigan, and can coordinate with HR teams and relocation programs.",
  },
  {
    q: "What areas do you serve?",
    a: "Southeast Michigan and Metro Detroit, with deep local roots in Downriver — from the city to the suburbs and lake communities.",
  },
  {
    q: "How early should I reach out?",
    a: "As early as possible. Even months ahead, an initial consultation helps you plan timing, budget, and the right neighborhoods before you commit to anything.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Communities Hub — counties + featured communities                          */
/*  Approximate counts; future city/county pages are planned, not yet built.   */
/* -------------------------------------------------------------------------- */

export type County = {
  name: string;
  slug: string; // planned route: /communities/[slug]
  description: string;
  communities: number; // approx. communities served in this county
  plannedPages: number; // city pages planned (phase 1)
};

export const counties: County[] = [
  {
    name: "Wayne County",
    slug: "wayne-county",
    description:
      "Our home base — Downriver roots plus Dearborn, Livonia, Canton, and the City of Detroit.",
    communities: 22,
    plannedPages: 10,
  },
  {
    name: "Oakland County",
    slug: "oakland-county",
    description:
      "Upscale suburbs and strong schools — Novi, Northville, Rochester, Troy, and beyond.",
    communities: 13,
    plannedPages: 5,
  },
  {
    name: "Macomb County",
    slug: "macomb-county",
    description:
      "Established, family-friendly communities from Sterling Heights out to the lake.",
    communities: 8,
    plannedPages: 4,
  },
  {
    name: "Livingston County",
    slug: "livingston-county",
    description:
      "Small-town charm and lakes — Brighton, Howell, and the Hartland area.",
    communities: 5,
    plannedPages: 3,
  },
  {
    name: "Washtenaw County",
    slug: "washtenaw-county",
    description:
      "College-town energy and culture — Ann Arbor, Ypsilanti, Saline, and Chelsea.",
    communities: 7,
    plannedPages: 3,
  },
  {
    name: "Monroe County",
    slug: "monroe-county",
    description:
      "Riverfront living and value south of Downriver — Monroe, Dundee, and Temperance.",
    communities: 6,
    plannedPages: 3,
  },
];

export type FeaturedCommunity = {
  name: string;
  county: string;
  slug: string; // planned route: /communities/[slug]
};

export const featuredCommunities: FeaturedCommunity[] = [
  { name: "Novi", county: "Oakland County", slug: "novi-mi" },
  { name: "Northville", county: "Oakland County", slug: "northville-mi" },
  { name: "Brighton", county: "Livingston County", slug: "brighton-mi" },
  { name: "Ann Arbor", county: "Washtenaw County", slug: "ann-arbor-mi" },
  { name: "Livonia", county: "Wayne County", slug: "livonia-mi" },
  { name: "South Lyon", county: "Oakland County", slug: "south-lyon-mi" },
  { name: "Monroe", county: "Monroe County", slug: "monroe-mi" },
  { name: "Rochester Hills", county: "Oakland County", slug: "rochester-hills-mi" },
];

/* -------------------------------------------------------------------------- */
/*  City pages — Tier 1 (route: /communities/[slug])                           */
/*  Qualitative, fair-housing-safe content. No fabricated stats; live market   */
/*  data comes later via IDX/MLS.                                              */
/* -------------------------------------------------------------------------- */

export type CityPage = {
  slug: string; // route: /communities/[slug]
  name: string;
  county: string; // display label, e.g. "Oakland County"
  region: string; // short locator phrase
  metaDescription: string;
  heroIntro: string;
  community: string[]; // community overview paragraphs
  lifestyle: { title: string; description: string }[];
  relocation: boolean; // emphasize a relocation cross-link
  faqs: { q: string; a: string }[];
};

export const cityPages: CityPage[] = [
  {
    slug: "novi-mi",
    name: "Novi",
    county: "Oakland County",
    region: "Western Oakland County",
    metaDescription:
      "Buying or selling in Novi, MI? Explore what it's like to live in this convenient Oakland County suburb — shopping, schools, commutes, and homes — with SOLD IT TODAY guiding the way.",
    heroIntro:
      "A polished, convenient suburb in western Oakland County — known for top-tier shopping, strong schools, and easy access to the I-96 and M-5 corridors, with everything from modern subdivisions to executive homes.",
    community: [
      "Novi has grown into one of Oakland County's most sought-after suburbs, popular with professionals and families who value convenience. You'll find everything from modern subdivisions and condos to larger executive homes, often near parks, lakes, and golf.",
      "Its central location — minutes from Twelve Oaks Mall, major employers, and the freeways — makes it a natural home base for commuters heading toward Detroit, Ann Arbor, or the surrounding job centers.",
    ],
    lifestyle: [
      { title: "Shopping & dining", description: "Twelve Oaks Mall, West Oaks, and a deep bench of restaurants and everyday conveniences." },
      { title: "Connected location", description: "Quick access to I-96, M-5, and I-275 for commutes across Metro Detroit." },
      { title: "Parks & recreation", description: "Lakeshore Park, trails, golf, and nearby lakes for weekends close to home." },
      { title: "Strong schools", description: "Well-regarded schools that draw many families to the area." },
    ],
    relocation: true,
    faqs: [
      { q: "What is it like to live in Novi, MI?", a: "Novi offers a convenient, suburban lifestyle with excellent shopping, dining, and freeway access. It's popular with families and professionals who want newer homes, good schools, and an easy commute across Metro Detroit." },
      { q: "What kinds of homes are available in Novi?", a: "Everything from condos and townhomes to modern subdivisions and larger executive homes. Inventory and pricing shift with the market, so reach out for what's currently available in your range." },
      { q: "Is Novi good for commuters?", a: "Yes — Novi sits near I-96, M-5, and I-275, making it convenient for commutes toward Detroit, Ann Arbor, and the surrounding employment centers." },
      { q: "How's the Novi real estate market?", a: "It varies by neighborhood and home type. We'll give you an honest, current read on pricing and demand for the areas you're considering — no pressure." },
    ],
  },
  {
    slug: "northville-mi",
    name: "Northville",
    county: "Oakland & Wayne Counties",
    region: "On the Oakland–Wayne county line",
    metaDescription:
      "Considering Northville, MI? Discover its historic walkable downtown, beautiful homes, and top-rated schools on the Oakland–Wayne line — with SOLD IT TODAY as your local guide.",
    heroIntro:
      "One of the area's most charming communities — a historic, walkable downtown, beautiful older homes, and top-rated schools, right on the Oakland–Wayne county line.",
    community: [
      "Northville is beloved for its picturesque downtown — Victorian architecture, boutique shops, restaurants, and a popular farmers market — paired with highly regarded schools. It draws families and buyers who want small-town character without giving up convenience.",
      "Homes range from historic in-town residences to newer developments on the edges of the city, with Maybury State Park and trails close by.",
    ],
    lifestyle: [
      { title: "Historic downtown", description: "A walkable, Victorian-era town center with shops, dining, and a farmers market." },
      { title: "Outdoor space", description: "Maybury State Park, trails, and green space minutes from town." },
      { title: "Top-rated schools", description: "A major draw for families considering the area." },
      { title: "Character + convenience", description: "Small-town charm with easy access to I-275, M-14, and Metro Detroit." },
    ],
    relocation: true,
    faqs: [
      { q: "What makes Northville special?", a: "Its historic, walkable downtown and strong schools. Northville has a distinctive small-town feel that's hard to find this close to Metro Detroit." },
      { q: "Is Northville in Wayne or Oakland County?", a: "The city of Northville actually straddles both Wayne and Oakland counties, which can affect taxes and school boundaries depending on the exact address — we'll help you understand the differences before you buy." },
      { q: "What types of homes are in Northville?", a: "From historic in-town homes to newer subdivisions on the outskirts. We'll help you find the right fit for your style and budget." },
      { q: "Is Northville good for families?", a: "Very — the schools, downtown, and parks make it a popular choice for families. We can match you to the neighborhoods that fit your needs." },
    ],
  },
  {
    slug: "brighton-mi",
    name: "Brighton",
    county: "Livingston County",
    region: "Livingston County lake country",
    metaDescription:
      "Thinking about Brighton, MI? Explore its lively downtown, lakes, and trails in Livingston County — plus homes from in-town to lakefront — with SOLD IT TODAY.",
    heroIntro:
      "Livingston County's lake country — a vibrant downtown on the Mill Pond, abundant lakes and trails, and an easy drive between Detroit, Ann Arbor, and Lansing.",
    community: [
      "Brighton pairs a lively, walkable downtown with the outdoor lifestyle of Livingston County's lakes and recreation areas. It's popular with families and buyers who want space, nature, and a strong sense of community.",
      "You'll find in-town homes, lakefront and lake-access properties, and newer subdivisions, plus more rural acreage just outside the city.",
    ],
    lifestyle: [
      { title: "Walkable downtown", description: "Shops, restaurants, and events around the Mill Pond and Main Street." },
      { title: "Lakes & recreation", description: "Brighton State Recreation Area, Huron Meadows, and many nearby lakes." },
      { title: "Central location", description: "I-96 and US-23 meet here — convenient to Detroit, Ann Arbor, and Lansing." },
      { title: "Room to spread out", description: "Everything from in-town homes to lakefront and acreage." },
    ],
    relocation: true,
    faqs: [
      { q: "What's living in Brighton like?", a: "Brighton offers a lively downtown plus lake and outdoor living. It's a favorite for buyers who want recreation and community with a central location between major cities." },
      { q: "Are there lakefront homes in Brighton?", a: "Yes — the area has many lakes with lakefront and lake-access homes. We can help you understand the differences (and costs) before you fall in love with one." },
      { q: "Is Brighton a good commuter location?", a: "It's well-positioned where I-96 meets US-23, making commutes toward Detroit, Ann Arbor, and Lansing convenient." },
      { q: "What does the Brighton market look like?", a: "It varies a lot by home type — in-town vs. lakefront vs. acreage. Reach out for current availability and an honest read on pricing." },
    ],
  },
  {
    slug: "ann-arbor-mi",
    name: "Ann Arbor",
    county: "Washtenaw County",
    region: "Washtenaw County",
    metaDescription:
      "Moving to Ann Arbor, MI? Explore this vibrant University of Michigan college town — culture, neighborhoods, economy, and homes — with SOLD IT TODAY guiding your search.",
    heroIntro:
      "A one-of-a-kind college town — home to the University of Michigan, with vibrant culture, walkable neighborhoods, a strong economy, and some of the region's most distinctive homes.",
    community: [
      "Ann Arbor blends college-town energy with a sophisticated arts, dining, and tech scene. Its neighborhoods each have a personality — from historic districts near downtown to leafy, established areas and modern builds.",
      "It's a competitive, in-demand market driven by the university, hospitals, and a thriving research and tech economy, attracting buyers and relocations from across the country.",
    ],
    lifestyle: [
      { title: "Culture & dining", description: "A renowned arts, music, and restaurant scene anchored by U-M." },
      { title: "Walkable neighborhoods", description: "Distinct districts like Burns Park, Kerrytown, and the Old West Side." },
      { title: "Strong economy", description: "University, healthcare, and a growing tech and research sector." },
      { title: "Parks & nature", description: "The Huron River, extensive parks, and trails throughout the city." },
    ],
    relocation: true,
    faqs: [
      { q: "What's it like to live in Ann Arbor?", a: "Ann Arbor offers big-city culture in a walkable, mid-size city — arts, dining, and a strong economy, with distinctive neighborhoods and excellent parks." },
      { q: "Is the Ann Arbor market competitive?", a: "It often is, thanks to steady demand from the university, hospitals, and tech employers. Having a strategy and an experienced guide makes a real difference here." },
      { q: "Can you help me relocate to Ann Arbor?", a: "Absolutely — we regularly help buyers relocating for the University of Michigan, Michigan Medicine, and area employers, with area matching and remote-friendly support." },
      { q: "What kinds of homes are in Ann Arbor?", a: "Historic homes, downtown condos, established family neighborhoods, and modern builds. We'll help you find the right neighborhood for your life." },
    ],
  },
  {
    slug: "livonia-mi",
    name: "Livonia",
    county: "Wayne County",
    region: "Wayne County",
    metaDescription:
      "Buying or selling in Livonia, MI? Explore this established, well-located Wayne County suburb — schools, parks, and classic neighborhoods — with SOLD IT TODAY.",
    heroIntro:
      "A classic, well-located Wayne County suburb — established neighborhoods, strong schools, abundant parks, and convenient access to I-96, I-275, and the surrounding corridors.",
    community: [
      "Livonia is a stable, family-oriented suburb known for solid value, mature neighborhoods, and a central Wayne County location. It's a favorite for buyers who want an established community with easy commutes in every direction.",
      "Housing leans toward classic mid-century brick ranches and colonials, with pockets of newer construction and condos.",
    ],
    lifestyle: [
      { title: "Central location", description: "Quick access to I-96, I-275, and major corridors across Metro Detroit." },
      { title: "Parks & recreation", description: "A large parks system, rec centers, and green space throughout the city." },
      { title: "Shopping & everyday", description: "Laurel Park Place and plenty of everyday convenience nearby." },
      { title: "Established value", description: "Classic neighborhoods that tend to offer strong value for families." },
    ],
    relocation: false,
    faqs: [
      { q: "What's living in Livonia like?", a: "Livonia is an established, family-friendly suburb with strong schools, lots of parks, and a central location that makes commuting easy in any direction." },
      { q: "What kinds of homes are in Livonia?", a: "Mostly classic brick ranches and colonials, with some newer construction and condos. It's known for offering solid value." },
      { q: "Is Livonia good for commuters?", a: "Yes — its position near I-96 and I-275 makes commutes across Metro Detroit convenient." },
      { q: "Is Livonia a good place for families?", a: "It's a longtime favorite for families thanks to its schools, parks, and stable neighborhoods." },
    ],
  },
  {
    slug: "monroe-mi",
    name: "Monroe",
    county: "Monroe County",
    region: "Monroe County, south of Downriver",
    metaDescription:
      "Considering Monroe, MI? Discover this historic river-and-lake city south of Downriver — waterfront, value, and I-75 access — with SOLD IT TODAY as your guide.",
    heroIntro:
      "A historic river-and-lake city south of Downriver — waterfront character, real value, and easy I-75 access to both Metro Detroit and Toledo.",
    community: [
      "Monroe is the seat of Monroe County, set along the River Raisin and near Lake Erie. It offers historic downtown charm, waterfront living, and generally more approachable price points than the northern suburbs.",
      "You'll find historic homes near downtown, established neighborhoods, and newer subdivisions, with lake and river access for those who want it.",
    ],
    lifestyle: [
      { title: "Waterfront living", description: "River Raisin and Lake Erie access for boating, fishing, and weekends on the water." },
      { title: "History & downtown", description: "River Raisin National Battlefield Park and a walkable historic core." },
      { title: "Value", description: "Often more approachable pricing than the northern Metro Detroit suburbs." },
      { title: "Connected", description: "I-75 access toward Downriver, Detroit, and Toledo." },
    ],
    relocation: false,
    faqs: [
      { q: "What's it like to live in Monroe, MI?", a: "Monroe offers historic, riverfront character with generally more approachable home prices, plus lake and river access and easy I-75 commuting." },
      { q: "Are there waterfront homes in Monroe?", a: "Yes — the River Raisin and Lake Erie offer waterfront and water-access options. We can help you weigh the lifestyle and the costs." },
      { q: "Is Monroe more affordable than the northern suburbs?", a: "Often, yes — Monroe tends to offer more home for the money. Reach out for what's currently available in your price range." },
      { q: "Where is Monroe located?", a: "Monroe sits south of Downriver along I-75, convenient to both Metro Detroit and Toledo." },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Brand / contact details                                                    */
/* -------------------------------------------------------------------------- */

export const contact = {
  brand: "SOLD IT TODAY",
  founder: "Charlotte Hypes",
  founderTitle: "Founder & Team Lead, REALTOR®",
  brokerage: "Remerica United Realty",
  // Brokerage office address — used where brokerage info is appropriate
  // (footer, contact, legal). Not displayed prominently on every page.
  officeStreet: "47720 Grand River Ave",
  officeCityStateZip: "Novi, MI 48374",
  phone: "313-529-5750",
  email: "charlotte@soldittoday.com",
  region: "Serving Southeast Michigan",
  serviceStatement:
    "Serving Southeast Michigan and Metro Detroit — with local roots in Downriver.",
};
