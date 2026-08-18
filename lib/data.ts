// Centralized placeholder data for SOLD IT TODAY.
// Swap these arrays for a CMS, API, or IDX feed later ... components read from here.

export type NavLink = { label: string; href: string };

// Primary site navigation. One-page anchors for the homepage sections.
// "Search Homes" is a primary nav item per Phase 2 direction.
export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Search Homes", href: "#search" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Relocation", href: "/relocation" }, // dedicated page (route, not anchor)
  { label: "Resources", href: "/resources" }, // dedicated content hub (route)
  { label: "Contact", href: "#contact" },
];

// Future content routes ... scaffolded for AI/SEO discoverability. These pages
// exist as branded placeholders today; content gets filled in over time.
// Relocation is intentionally NOT here ... it now lives in navLinks (which the
// footer also renders), so listing it here too would duplicate it in the footer.
export const futurePages: NavLink[] = [
  { label: "Meet Charlotte", href: "/meet-charlotte" },
  { label: "Team", href: "/team" },
  // Communities is the canonical hub (replaces the retired /service-areas).
  { label: "Communities", href: "/communities" },
  { label: "Neighborhood Guides", href: "/neighborhood-guides" },
  { label: "Resources", href: "/resources" },
  { label: "Down Payment Assistance", href: "/dpa" },
  { label: "Preferred Partners", href: "/preferred-partners" },
];

/* -------------------------------------------------------------------------- */
/*  Brand ticker ... the scrolling band under the hero                          */
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
  "Wyandotte",
  "Allen Park",
  "Taylor",
  "Lincoln Park",
  "Dearborn",
  "Flat Rock",
  "Southeast Michigan",
];

/* Relocation-reasons ticker ... shown on the /relocation page, at the band
   between the hero and the content. Reasons people actually move, drawn from the
   relocation audiences plus common life-move reasons. Inclusive, not exclusionary. */
export const relocationTickerItems: string[] = [
  "Military Relocation",
  "Corporate Relocation",
  "Job Transfers",
  "New Job",
  "Automotive Industry",
  "Healthcare Careers",
  "University & Faculty",
  "Executive Moves",
  "Out-of-State Moves",
  "Closer to Family",
  "Retirement",
  "More Space",
  "Better Commute",
  "Coming Home to Michigan",
  "A Fresh Start",
];

export type Stat = { value: string; label: string };

// Charlotte was licensed 19 July 2006 ... twenty years as of 19 July 2026.
export const stats: Stat[] = [
  { value: "20", label: "Years licensed" },
  { value: "350+", label: "Homes sold" },
  { value: "5★", label: "Zillow rated" },
  // "SE MI" read as an abbreviation nobody outside the office knows.
  { value: "Metro Detroit", label: "Local market depth" },
];

/* -------------------------------------------------------------------------- */
/*  Home Search ... filter option data (frontend only, ready for IDX)           */
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
      "A calm, strategic search built around your goals ... from first showing to final signature.",
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
/*  Featured Listings (placeholder imagery ... NOT live MLS data)               */
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
/*  Brand values ... what SOLD IT TODAY is built around                         */
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
      "A team that informs first ... so you move forward confident and ready.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Team ... built to support a growing roster of agents                        */
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
   * a real client's words ... omit the field rather than inventing one.
   */
  quote?: { text: string; attribution: string };
  image: string;
  // CSS object-position for the card crop ... tuned per photo so no head,
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
/*  Preferred Partners ... full public-facing company names only                */
/*  NOTE: entries below are PLACEHOLDERS. Replace with real, client-provided  */
/*  partners. Do not invent companies ... use the labeled placeholders.         */
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
      { name: "Preferred Lender ... Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Lender ... Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "title",
    title: "Preferred Title Companies",
    blurb:
      "Title and closing partners that keep transactions clean, clear, and on schedule.",
    partners: [
      { name: "First Centennial Title ... Example Placeholder", detail: "Confirm before publishing", placeholder: true },
      { name: "Preferred Title Company ... Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "inspectors",
    title: "Home Inspectors",
    blurb:
      "Thorough, honest inspectors who help you understand a home before you commit.",
    partners: [
      { name: "Preferred Home Inspector ... Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Home Inspector ... Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "insurance",
    title: "Insurance Agents",
    blurb:
      "Homeowners insurance partners to protect your investment from day one.",
    partners: [
      { name: "Preferred Insurance Agency ... Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Insurance Agency ... Placeholder", detail: "Company name to be added", placeholder: true },
    ],
  },
  {
    id: "contractors",
    title: "Contractors & Tradespeople",
    blurb:
      "Vetted contractors and trades for repairs, updates, and getting a home market-ready.",
    partners: [
      { name: "Preferred Contractor ... Placeholder", detail: "Company name to be added", placeholder: true },
      { name: "Preferred Contractor ... Placeholder", detail: "Company name to be added", placeholder: true },
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
      "You always know where things stand. No guessing, no chasing ... just steady, honest updates.",
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
      "350+ homes sold across the region ... experience that turns strategy into outcomes.",
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
 * review on the profile at `reviewsUrl` ... never write a plausible-sounding
 * quote to fill the section out.
 */
export const testimonials: Testimonial[] = [
  {
    id: "zillow-warren-2024",
    quote:
      "Charlotte was extremely patient with all the questions I had and walked me through the process thoroughly. She truly cares about helping you. She goes above and beyond and takes calls at all hours and on weekends if necessary.",
    name: "Janette Warren",
    role: "Bought & Sold ... Taylor, MI · Nov 2024",
  },
  {
    id: "zillow-tyredbeard-2022",
    quote:
      "Charlotte and her team were extremely helpful. Everything from understanding the process, working with my schedule, getting me to closing super fast, and saving me money. I can't imagine there being a better realtor for my situation.",
    name: "TyRedBeard",
    role: "First-Time Buyer ... Westland, MI · May 2022",
  },
  {
    id: "zillow-winkler-2021",
    quote:
      "Charlotte went above and beyond to help me find a place to live. There were many ups and downs but she hung in there with me. I really appreciate the individual attention she gave me. She was a pleasure to work with.",
    name: "Jackyewinkler",
    role: "Bought ... Melvindale, MI · June 2021",
  },
];

/* -------------------------------------------------------------------------- */
/*  Meet Charlotte ... founder spotlight                                         */
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
/*  Review themes ... what clients consistently mention                          */
/*  (Descriptive themes, NOT fabricated direct quotes. Verified reviews live   */
/*   on the Zillow profile linked above.)                                      */
/* -------------------------------------------------------------------------- */

export type ReviewTheme = { title: string; description: string };

export const reviewThemes: ReviewTheme[] = [
  {
    title: "Clear Communication",
    description:
      "You always know where things stand ... steady updates, plain answers, and no chasing for information.",
  },
  {
    title: "Patience",
    description:
      "Never rushed. Questions are welcome, and every step is explained until it genuinely makes sense.",
  },
  {
    title: "Education",
    description:
      "Clients leave understanding their options ... the reasoning behind each decision, not just the outcome.",
  },
  {
    title: "Responsiveness",
    description:
      "Calls, texts, and emails returned quickly, so momentum never stalls when timing matters most.",
  },
  {
    title: "First-Time Buyer Guidance",
    description:
      "First-time buyers get extra care ... the whole process demystified from pre-approval to keys in hand.",
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
/*  Relocation ... content for the /relocation page                              */
/* -------------------------------------------------------------------------- */

export type RelocationAudience = { title: string; description: string };

export const relocationAudiences: RelocationAudience[] = [
  {
    title: "Out-of-State Buyers",
    description:
      "Moving to Michigan from elsewhere ... virtual tours, honest market context, and trusted eyes on every home so you can decide with confidence.",
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
      "Metro Detroit runs on the auto industry ... guidance for engineers, suppliers, and transferees settling into the area.",
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
      "Where your numbers go furthest ... with the honest trade-offs explained.",
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
      "A short list of areas matched to your commute, lifestyle, and budget ... with the reasoning behind each.",
  },
  {
    step: "03",
    title: "Guided search",
    description:
      "Curated homes, virtual or in-person tours, and clear comparisons. No pressure ... just clarity.",
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
    a: "Absolutely ... it's a large part of what we do. Out-of-state buyers get virtual tours, local market context, and trusted eyes on every home so you can decide with confidence from afar.",
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
    a: "Southeast Michigan and Metro Detroit, with deep local roots in Downriver ... from the city to the suburbs and lake communities.",
  },
  {
    q: "How early should I reach out?",
    a: "As early as possible. Even months ahead, an initial consultation helps you plan timing, budget, and the right neighborhoods before you commit to anything.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Communities Hub ... counties + featured communities                          */
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
      "Our home base ... Downriver roots plus Dearborn, Livonia, Canton, and the City of Detroit.",
    communities: 22,
    plannedPages: 10,
  },
  {
    name: "Oakland County",
    slug: "oakland-county",
    description:
      "Upscale suburbs and strong schools ... Novi, Northville, Rochester, Troy, and beyond.",
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
      "Small-town charm and lakes ... Brighton, Howell, and the Hartland area.",
    communities: 5,
    plannedPages: 3,
  },
  {
    name: "Washtenaw County",
    slug: "washtenaw-county",
    description:
      "College-town energy and culture ... Ann Arbor, Ypsilanti, Saline, and Chelsea.",
    communities: 7,
    plannedPages: 3,
  },
  {
    name: "Monroe County",
    slug: "monroe-county",
    description:
      "Riverfront living and value south of Downriver ... Monroe, Dundee, and Temperance.",
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
  { name: "Taylor", county: "Wayne County", slug: "taylor-mi" },
  { name: "Wyandotte", county: "Wayne County", slug: "wyandotte-mi" },
  { name: "Lincoln Park", county: "Wayne County", slug: "lincoln-park-mi" },
  { name: "Allen Park", county: "Wayne County", slug: "allen-park-mi" },
  { name: "Southgate", county: "Wayne County", slug: "southgate-mi" },
  { name: "Westland", county: "Wayne County", slug: "westland-mi" },
  { name: "Dearborn", county: "Wayne County", slug: "dearborn-mi" },
];

/*
 * Full service-area list (every city SOLD IT TODAY serves). Cities with a live
 * /communities/[slug] page carry a slug; the rest are declared for coverage
 * (used in the Communities "Areas We Serve" list and the RealEstateAgent
 * areaServed schema) and get full pages over time.
 */
export const serviceAreas: { name: string; county: string; slug?: string }[] = [
  // Downriver (Wayne)
  { name: "Taylor", county: "Wayne County", slug: "taylor-mi" },
  { name: "Wyandotte", county: "Wayne County", slug: "wyandotte-mi" },
  { name: "Lincoln Park", county: "Wayne County", slug: "lincoln-park-mi" },
  { name: "Southgate", county: "Wayne County", slug: "southgate-mi" },
  { name: "Allen Park", county: "Wayne County", slug: "allen-park-mi" },
  { name: "Woodhaven", county: "Wayne County", slug: "woodhaven-mi" },
  { name: "Flat Rock", county: "Wayne County", slug: "flat-rock-mi" },
  { name: "Riverview", county: "Wayne County", slug: "riverview-mi" },
  { name: "Trenton", county: "Wayne County", slug: "trenton-mi" },
  { name: "Grosse Ile", county: "Wayne County", slug: "grosse-ile-mi" },
  { name: "Brownstown Township", county: "Wayne County", slug: "brownstown-mi" },
  { name: "Romulus", county: "Wayne County", slug: "romulus-mi" },
  { name: "Belleville", county: "Wayne County", slug: "belleville-mi" },
  { name: "Huron Township", county: "Wayne County", slug: "huron-township-mi" },
  // Western / Central Wayne
  { name: "Livonia", county: "Wayne County", slug: "livonia-mi" },
  { name: "Dearborn", county: "Wayne County", slug: "dearborn-mi" },
  { name: "Westland", county: "Wayne County", slug: "westland-mi" },
  { name: "Dearborn Heights", county: "Wayne County", slug: "dearborn-heights-mi" },
  { name: "Garden City", county: "Wayne County", slug: "garden-city-mi" },
  { name: "Canton", county: "Wayne County", slug: "canton-mi" },
  { name: "Plymouth", county: "Wayne County", slug: "plymouth-mi" },
  { name: "Redford", county: "Wayne County", slug: "redford-mi" },
  { name: "Detroit", county: "Wayne County", slug: "detroit-mi" },
  // Oakland
  { name: "Novi", county: "Oakland County", slug: "novi-mi" },
  { name: "Northville", county: "Oakland County", slug: "northville-mi" },
  { name: "Pontiac", county: "Oakland County", slug: "pontiac-mi" },
  { name: "Milford", county: "Oakland County", slug: "milford-mi" },
  { name: "Farmington", county: "Oakland County", slug: "farmington-mi" },
  { name: "Farmington Hills", county: "Oakland County", slug: "farmington-hills-mi" },
  { name: "West Bloomfield", county: "Oakland County", slug: "west-bloomfield-mi" },
  { name: "Commerce Township", county: "Oakland County", slug: "commerce-township-mi" },
  { name: "South Lyon", county: "Oakland County", slug: "south-lyon-mi" },
  { name: "Franklin", county: "Oakland County", slug: "franklin-mi" },
  { name: "Southfield", county: "Oakland County", slug: "southfield-mi" },
  // Macomb
  { name: "Warren", county: "Macomb County", slug: "warren-mi" },
  { name: "Sterling Heights", county: "Macomb County", slug: "sterling-heights-mi" },
  { name: "Eastpointe", county: "Macomb County", slug: "eastpointe-mi" },
  // Washtenaw / Livingston
  { name: "Ypsilanti", county: "Washtenaw County", slug: "ypsilanti-mi" },
  { name: "Howell", county: "Livingston County", slug: "howell-mi" },
];

/* -------------------------------------------------------------------------- */
/*  City pages ... Tier 1 (route: /communities/[slug])                           */
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
      "Buying or selling in Novi, MI? Explore what it's like to live in this convenient Oakland County suburb ... shopping, schools, commutes, and homes ... with SOLD IT TODAY guiding the way.",
    heroIntro:
      "A polished, convenient suburb in western Oakland County ... known for top-tier shopping, strong schools, and easy access to the I-96 and M-5 corridors, with everything from modern subdivisions to executive homes.",
    community: [
      "Novi has grown into one of Oakland County's most sought-after suburbs, popular with professionals and families who value convenience. You'll find everything from modern subdivisions and condos to larger executive homes, often near parks, lakes, and golf.",
      "Its central location ... minutes from Twelve Oaks Mall, major employers, and the freeways ... makes it a natural home base for commuters heading toward Detroit, Ann Arbor, or the surrounding job centers.",
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
      { q: "Is Novi good for commuters?", a: "Yes ... Novi sits near I-96, M-5, and I-275, making it convenient for commutes toward Detroit, Ann Arbor, and the surrounding employment centers." },
      { q: "How's the Novi real estate market?", a: "It varies by neighborhood and home type. We'll give you an honest, current read on pricing and demand for the areas you're considering ... no pressure." },
    ],
  },
  {
    slug: "northville-mi",
    name: "Northville",
    county: "Oakland & Wayne Counties",
    region: "On the Oakland-Wayne county line",
    metaDescription:
      "Considering Northville, MI? Discover its historic walkable downtown, beautiful homes, and top-rated schools on the Oakland-Wayne line ... with SOLD IT TODAY as your local guide.",
    heroIntro:
      "One of the area's most charming communities ... a historic, walkable downtown, beautiful older homes, and top-rated schools, right on the Oakland-Wayne county line.",
    community: [
      "Northville is beloved for its picturesque downtown ... Victorian architecture, boutique shops, restaurants, and a popular farmers market ... paired with highly regarded schools. It draws families and buyers who want small-town character without giving up convenience.",
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
      { q: "Is Northville in Wayne or Oakland County?", a: "The city of Northville actually straddles both Wayne and Oakland counties, which can affect taxes and school boundaries depending on the exact address ... we'll help you understand the differences before you buy." },
      { q: "What types of homes are in Northville?", a: "From historic in-town homes to newer subdivisions on the outskirts. We'll help you find the right fit for your style and budget." },
      { q: "Is Northville good for families?", a: "Very ... the schools, downtown, and parks make it a popular choice for families. We can match you to the neighborhoods that fit your needs." },
    ],
  },
  {
    slug: "brighton-mi",
    name: "Brighton",
    county: "Livingston County",
    region: "Livingston County lake country",
    metaDescription:
      "Thinking about Brighton, MI? Explore its lively downtown, lakes, and trails in Livingston County ... plus homes from in-town to lakefront ... with SOLD IT TODAY.",
    heroIntro:
      "Livingston County's lake country ... a vibrant downtown on the Mill Pond, abundant lakes and trails, and an easy drive between Detroit, Ann Arbor, and Lansing.",
    community: [
      "Brighton pairs a lively, walkable downtown with the outdoor lifestyle of Livingston County's lakes and recreation areas. It's popular with families and buyers who want space, nature, and a strong sense of community.",
      "You'll find in-town homes, lakefront and lake-access properties, and newer subdivisions, plus more rural acreage just outside the city.",
    ],
    lifestyle: [
      { title: "Walkable downtown", description: "Shops, restaurants, and events around the Mill Pond and Main Street." },
      { title: "Lakes & recreation", description: "Brighton State Recreation Area, Huron Meadows, and many nearby lakes." },
      { title: "Central location", description: "I-96 and US-23 meet here ... convenient to Detroit, Ann Arbor, and Lansing." },
      { title: "Room to spread out", description: "Everything from in-town homes to lakefront and acreage." },
    ],
    relocation: true,
    faqs: [
      { q: "What's living in Brighton like?", a: "Brighton offers a lively downtown plus lake and outdoor living. It's a favorite for buyers who want recreation and community with a central location between major cities." },
      { q: "Are there lakefront homes in Brighton?", a: "Yes ... the area has many lakes with lakefront and lake-access homes. We can help you understand the differences (and costs) before you fall in love with one." },
      { q: "Is Brighton a good commuter location?", a: "It's well-positioned where I-96 meets US-23, making commutes toward Detroit, Ann Arbor, and Lansing convenient." },
      { q: "What does the Brighton market look like?", a: "It varies a lot by home type ... in-town vs. lakefront vs. acreage. Reach out for current availability and an honest read on pricing." },
    ],
  },
  {
    slug: "ann-arbor-mi",
    name: "Ann Arbor",
    county: "Washtenaw County",
    region: "Washtenaw County",
    metaDescription:
      "Moving to Ann Arbor, MI? Explore this vibrant University of Michigan college town ... culture, neighborhoods, economy, and homes ... with SOLD IT TODAY guiding your search.",
    heroIntro:
      "A one-of-a-kind college town ... home to the University of Michigan, with vibrant culture, walkable neighborhoods, a strong economy, and some of the region's most distinctive homes.",
    community: [
      "Ann Arbor blends college-town energy with a sophisticated arts, dining, and tech scene. Its neighborhoods each have a personality ... from historic districts near downtown to leafy, established areas and modern builds.",
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
      { q: "What's it like to live in Ann Arbor?", a: "Ann Arbor offers big-city culture in a walkable, mid-size city ... arts, dining, and a strong economy, with distinctive neighborhoods and excellent parks." },
      { q: "Is the Ann Arbor market competitive?", a: "It often is, thanks to steady demand from the university, hospitals, and tech employers. Having a strategy and an experienced guide makes a real difference here." },
      { q: "Can you help me relocate to Ann Arbor?", a: "Absolutely ... we regularly help buyers relocating for the University of Michigan, Michigan Medicine, and area employers, with area matching and remote-friendly support." },
      { q: "What kinds of homes are in Ann Arbor?", a: "Historic homes, downtown condos, established family neighborhoods, and modern builds. We'll help you find the right neighborhood for your life." },
    ],
  },
  {
    slug: "livonia-mi",
    name: "Livonia",
    county: "Wayne County",
    region: "Wayne County",
    metaDescription:
      "Buying or selling in Livonia, MI? Explore this established, well-located Wayne County suburb ... schools, parks, and classic neighborhoods ... with SOLD IT TODAY.",
    heroIntro:
      "A classic, well-located Wayne County suburb ... established neighborhoods, strong schools, abundant parks, and convenient access to I-96, I-275, and the surrounding corridors.",
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
      { q: "Is Livonia good for commuters?", a: "Yes ... its position near I-96 and I-275 makes commutes across Metro Detroit convenient." },
      { q: "Is Livonia a good place for families?", a: "It's a longtime favorite for families thanks to its schools, parks, and stable neighborhoods." },
    ],
  },
  {
    slug: "monroe-mi",
    name: "Monroe",
    county: "Monroe County",
    region: "Monroe County, south of Downriver",
    metaDescription:
      "Considering Monroe, MI? Discover this historic river-and-lake city south of Downriver ... waterfront, value, and I-75 access ... with SOLD IT TODAY as your guide.",
    heroIntro:
      "A historic river-and-lake city south of Downriver ... waterfront character, real value, and easy I-75 access to both Metro Detroit and Toledo.",
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
      { q: "Are there waterfront homes in Monroe?", a: "Yes ... the River Raisin and Lake Erie offer waterfront and water-access options. We can help you weigh the lifestyle and the costs." },
      { q: "Is Monroe more affordable than the northern suburbs?", a: "Often, yes ... Monroe tends to offer more home for the money. Reach out for what's currently available in your price range." },
      { q: "Where is Monroe located?", a: "Monroe sits south of Downriver along I-75, convenient to both Metro Detroit and Toledo." },
    ],
  },
  {
    slug: "taylor-mi",
    name: "Taylor",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Thinking about Taylor, MI? Explore this central Downriver city with Heritage Park, easy I-75 and Telegraph access, and approachable family neighborhoods, with SOLD IT TODAY.",
    heroIntro:
      "Central Downriver living with room to breathe: Heritage Park green space, quick I-75 and Telegraph access, and approachable, family-friendly neighborhoods.",
    community: [
      "Taylor sits right in the heart of Downriver, a practical, welcoming city known for its convenience and value. It is centrally located between the riverfront communities and the I-75 corridor, which makes it an easy base for commuting almost anywhere in Metro Detroit.",
      "You'll find a mix of well-kept postwar neighborhoods, ranch homes, and newer builds, with parks, shopping along Eureka and Telegraph, and Southland Center nearby. It is a strong pick for first-time buyers and families who want space and access without a premium price.",
    ],
    lifestyle: [
      { title: "Heritage Park", description: "A large community park with trails, the Petting Farm, and year-round events." },
      { title: "Easy commuting", description: "Quick access to I-75, Telegraph, and Metro Airport for the whole region." },
      { title: "Everyday convenience", description: "Southland Center, Eureka Road shopping, and dining close at hand." },
      { title: "Value and space", description: "Approachable pricing and real yards make it a first-time-buyer favorite." },
    ],
    relocation: false,
    faqs: [
      { q: "What is it like to live in Taylor, MI?", a: "Taylor is a central, convenient Downriver city with approachable prices, parks like Heritage Park, and easy access to I-75, Telegraph, and Metro Airport." },
      { q: "Is Taylor good for first-time buyers?", a: "Yes. Taylor offers some of the most approachable pricing in Downriver, and it is one of the areas where down payment assistance can apply. We can check your options." },
      { q: "How is the commute from Taylor?", a: "Excellent. Taylor sits near I-75 and Telegraph, so most of Metro Detroit and the airport are a short drive away." },
    ],
  },
  {
    slug: "wyandotte-mi",
    name: "Wyandotte",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Considering Wyandotte, MI? Explore this historic Detroit River city with a walkable downtown, waterfront parks, and character homes, with SOLD IT TODAY.",
    heroIntro:
      "One of Downriver's true gems: a walkable historic downtown on the Detroit River, waterfront parks, and homes with real character.",
    community: [
      "Wyandotte is the crown jewel of Downriver for a lot of buyers, and for good reason. Its historic downtown along Biddle Avenue is genuinely walkable, lined with local shops and restaurants, and it sits right on the Detroit River with parks and marinas.",
      "The housing is full of character, older homes with detail you don't find in newer subdivisions, and the community is tight-knit, with signature events like the Wyandotte Street Art Fair and Third Fridays downtown.",
    ],
    lifestyle: [
      { title: "Walkable downtown", description: "Biddle Avenue shops, dining, and events you can stroll to." },
      { title: "On the river", description: "Bishop Park, the waterfront, and marinas right in town." },
      { title: "Character homes", description: "Historic architecture and detail throughout its neighborhoods." },
      { title: "Community events", description: "The Street Art Fair, Third Fridays, and a strong local scene." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Wyandotte, MI known for?", a: "Wyandotte is known for its walkable historic downtown on the Detroit River, waterfront parks, character homes, and events like the Street Art Fair." },
      { q: "Are homes in Wyandotte expensive?", a: "Wyandotte spans a range, from approachable starter homes to larger historic properties. We can find options that fit your budget and goals." },
      { q: "Is Wyandotte a good place to buy a first home?", a: "Many first-time buyers love Wyandotte for its character and walkability, and down payment assistance can apply here. Let's check your eligibility." },
    ],
  },
  {
    slug: "lincoln-park-mi",
    name: "Lincoln Park",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Looking at Lincoln Park, MI? Explore this close-in Downriver city with established neighborhoods, value, and quick Detroit and airport access, with SOLD IT TODAY.",
    heroIntro:
      "Close-in Downriver value: established, walkable neighborhoods with quick access to Detroit, the airport, and the rest of the region.",
    community: [
      "Lincoln Park is one of the closest-in Downriver communities, which makes it a favorite for buyers who want easy access to Detroit and the airport without a big-city price tag. Its neighborhoods are established and compact, with a strong first-home market.",
      "You'll find affordable bungalows and ranches, local shopping along Fort Street and Dix, and a practical, connected location that keeps the whole region within reach.",
    ],
    lifestyle: [
      { title: "Close to everything", description: "Quick to Detroit, the airport, and the I-75 corridor." },
      { title: "First-home value", description: "One of Downriver's most approachable markets for buyers." },
      { title: "Established neighborhoods", description: "Compact, walkable streets with classic bungalows and ranches." },
      { title: "Local convenience", description: "Fort Street and Dix corridors for everyday needs." },
    ],
    relocation: false,
    faqs: [
      { q: "Is Lincoln Park, MI affordable?", a: "Yes. Lincoln Park is one of the more approachable Downriver markets, which makes it popular with first-time buyers, and down payment assistance can apply here." },
      { q: "How is the location of Lincoln Park?", a: "Very convenient. It is one of the closest-in Downriver cities, with quick access to Detroit, Metro Airport, and I-75." },
      { q: "What kind of homes are in Lincoln Park?", a: "Mostly bungalows and ranches in established neighborhoods, a great fit for first homes and value-focused buyers." },
    ],
  },
  {
    slug: "southgate-mi",
    name: "Southgate",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Considering Southgate, MI? Explore this central Downriver city with convenient shopping, family neighborhoods, and easy access, with SOLD IT TODAY.",
    heroIntro:
      "Central Downriver convenience: family neighborhoods, everyday shopping, and a location that keeps the whole area close.",
    community: [
      "Southgate is a practical, central Downriver community that a lot of families choose for its convenience. It sits right in the middle of the action, with shopping along Eureka and Trenton Roads and quick access to the surrounding cities.",
      "The neighborhoods are steady and well-kept, with a mix of ranches and colonials, and the city keeps everyday essentials, from groceries to restaurants, close at hand.",
    ],
    lifestyle: [
      { title: "Central location", description: "Right in the middle of Downriver, close to everything." },
      { title: "Everyday shopping", description: "Eureka Road and Trenton Road retail and dining." },
      { title: "Family neighborhoods", description: "Steady, well-kept streets of ranches and colonials." },
      { title: "Easy access", description: "Convenient to I-75 and the neighboring Downriver cities." },
    ],
    relocation: false,
    faqs: [
      { q: "What is living in Southgate, MI like?", a: "Southgate is a convenient, central Downriver city with family neighborhoods and easy shopping, a practical choice for buyers who want to be close to everything." },
      { q: "Is Southgate good for families?", a: "Many families choose Southgate for its central location, steady neighborhoods, and everyday convenience. We can help you find the right fit." },
      { q: "Does down payment assistance apply in Southgate?", a: "Assistance programs can apply across Downriver depending on your situation. Let's check what you may qualify for." },
    ],
  },
  {
    slug: "allen-park-mi",
    name: "Allen Park",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Thinking about Allen Park, MI? Explore this well-kept Downriver city on the Dearborn border with tree-lined streets and standout convenience, with SOLD IT TODAY.",
    heroIntro:
      "A well-kept, tree-lined Downriver city on the Dearborn border, with pride-of-ownership neighborhoods and standout convenience to Metro Detroit's job centers.",
    community: [
      "Allen Park sits at the northern edge of Downriver, right against Dearborn and close to Detroit, which puts it within easy reach of Ford, the airport, and downtown. It is known for tidy, tree-lined neighborhoods and a real pride of ownership.",
      "Homes tend to be well-maintained brick ranches, bungalows, and colonials, and the location near I-94 and the Southfield Freeway makes commuting simple. It is a steady, desirable choice for buyers who want a settled feel close to everything.",
    ],
    lifestyle: [
      { title: "Pride of ownership", description: "Tidy, tree-lined streets and well-kept homes." },
      { title: "Job-center access", description: "Close to Ford, Dearborn, Detroit, and the airport." },
      { title: "Easy commuting", description: "Near I-94 and the Southfield Freeway." },
      { title: "Settled feel", description: "Established brick homes and a steady, community feel." },
    ],
    relocation: false,
    faqs: [
      { q: "Why do buyers like Allen Park, MI?", a: "Allen Park is known for well-kept, tree-lined neighborhoods, pride of ownership, and an excellent location near Dearborn, Detroit, Ford, and the airport." },
      { q: "Is Allen Park close to Dearborn and Detroit?", a: "Yes. Allen Park borders Dearborn and is very close to Detroit, with quick freeway access to major job centers." },
      { q: "What are homes like in Allen Park?", a: "Mostly well-maintained brick ranches, bungalows, and colonials in established, tidy neighborhoods." },
    ],
  },
  {
    slug: "westland-mi",
    name: "Westland",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Looking at Westland, MI? Explore this central western-Wayne city with value, parks, and a convenient location near Livonia and Canton, with SOLD IT TODAY.",
    heroIntro:
      "Central western-Wayne value: approachable neighborhoods, plenty of parks, and a location that keeps Livonia, Canton, and the airport close.",
    community: [
      "Westland is one of western Wayne County's larger communities, and it is a practical, affordable choice for a lot of buyers. It sits conveniently between Livonia, Canton, and Dearborn, with easy access across the region.",
      "You'll find a wide range of homes, from starter ranches to larger family houses, plus parks, the Hines Park corridor nearby, and everyday shopping. It is a solid value market with something for most budgets.",
    ],
    lifestyle: [
      { title: "Central and connected", description: "Between Livonia, Canton, and Dearborn, close to the airport." },
      { title: "Parks and green space", description: "City parks and the nearby Hines Park corridor." },
      { title: "Range of homes", description: "From starter ranches to larger family homes." },
      { title: "Everyday value", description: "Approachable pricing and convenient shopping." },
    ],
    relocation: false,
    faqs: [
      { q: "Is Westland, MI affordable?", a: "Westland is a solid value market with a wide range of homes, which makes it popular with first-time and move-up buyers alike." },
      { q: "Where is Westland located?", a: "In western Wayne County, conveniently between Livonia, Canton, and Dearborn, with easy access to Metro Airport." },
      { q: "Is Westland good for first-time buyers?", a: "Yes, its approachable pricing makes it a strong first-home market, and down payment assistance can apply. Let's check your options." },
    ],
  },
  {
    slug: "dearborn-mi",
    name: "Dearborn",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Considering Dearborn, MI? Explore Ford's hometown with The Henry Ford, walkable downtowns, and a renowned dining scene, with SOLD IT TODAY.",
    heroIntro:
      "Ford's hometown and one of Metro Detroit's most distinctive cities: home to The Henry Ford, two walkable downtowns, and a nationally known dining scene.",
    community: [
      "Dearborn is a city with a strong identity. It is the home of Ford Motor Company and The Henry Ford museum complex with Greenfield Village, and it anchors western Wayne County with real culture, history, and one of the region's most celebrated food scenes.",
      "Its neighborhoods range from historic homes near the west and east downtowns to established mid-century streets, with the University of Michigan-Dearborn and major employers keeping demand steady. It is walkable in the right pockets and endlessly convenient to Detroit and the airport.",
    ],
    lifestyle: [
      { title: "The Henry Ford", description: "World-class museum and Greenfield Village right in town." },
      { title: "Renowned dining", description: "One of Metro Detroit's most celebrated food scenes." },
      { title: "Walkable downtowns", description: "West and east Dearborn cores with local character." },
      { title: "Jobs and schools", description: "Ford, UM-Dearborn, and major employers close by." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Dearborn, MI known for?", a: "Dearborn is Ford's hometown, home to The Henry Ford and Greenfield Village, two walkable downtowns, and a nationally known dining scene." },
      { q: "Is Dearborn a good place to buy a home?", a: "Yes. Demand stays steady thanks to Ford, UM-Dearborn, and the city's character, with homes ranging from historic to mid-century. We can help you target the right neighborhood." },
      { q: "Is Dearborn convenient to Detroit?", a: "Very. Dearborn sits right next to Detroit with quick access to downtown, the airport, and major freeways." },
    ],
  },
  {
    slug: "pontiac-mi",
    name: "Pontiac",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Considering Pontiac, MI? Explore this revitalizing Oakland County seat, historic homes, a comeback downtown, and real value near Auburn Hills, with SOLD IT TODAY.",
    heroIntro:
      "An Oakland County comeback story: a revitalizing downtown, historic homes with real value, and a central spot near Auburn Hills and the region's job centers.",
    community: [
      "Pontiac is the seat of Oakland County and a city on the rise. Its downtown has seen real revitalization, and it offers some of the most approachable historic homes in Oakland County, from craftsman bungalows to larger period houses.",
      "The location is a strength: close to Auburn Hills, Great Lakes Crossing, Oakland University, and the M1 Concourse, with quick access to I-75 and Woodward. For buyers who want character and value with upside, Pontiac is worth a serious look.",
    ],
    lifestyle: [
      { title: "Value and character", description: "Approachable historic homes with detail and upside." },
      { title: "Comeback downtown", description: "A revitalizing core with dining and events." },
      { title: "Central location", description: "Near Auburn Hills, Great Lakes Crossing, and I-75." },
      { title: "Room to grow", description: "One of Oakland County's most improvable markets." },
    ],
    relocation: false,
    faqs: [
      { q: "Is Pontiac, MI a good place to buy?", a: "Pontiac offers some of Oakland County's most approachable historic homes, a revitalizing downtown, and a central location near Auburn Hills. It is a strong pick for value and upside." },
      { q: "Does Pontiac have down payment assistance?", a: "Yes. Pontiac has an active down payment assistance program of up to $20,000 for eligible first-time buyers. See our Pontiac assistance page or ask us to check your eligibility." },
      { q: "Where is Pontiac located?", a: "Pontiac is the seat of Oakland County, near Auburn Hills and Great Lakes Crossing, with quick access to I-75 and Woodward." },
    ],
  },
  {
    slug: "farmington-hills-mi",
    name: "Farmington Hills",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Thinking about Farmington Hills, MI? Explore this established Oakland County city with parks, a strong schools reputation, and easy access, with SOLD IT TODAY.",
    heroIntro:
      "One of Oakland County's most established suburbs: leafy neighborhoods, excellent parks, a strong schools reputation, and easy access to the whole region.",
    community: [
      "Farmington Hills is a large, well-regarded Oakland County suburb known for its stability, green space, and convenience. It pairs with the historic downtown of neighboring Farmington and offers everything from ranches and colonials to newer and upscale homes.",
      "Heritage Park and a strong parks system, corporate offices along the I-696 and M-5 corridors, and a well-rated schools reputation make it a steady favorite for families and professionals alike.",
    ],
    lifestyle: [
      { title: "Parks and green space", description: "Heritage Park and an extensive parks system." },
      { title: "Strong schools reputation", description: "A long-standing draw for families." },
      { title: "Convenient corridors", description: "Easy access via I-696 and M-5." },
      { title: "Range of homes", description: "From ranches and colonials to upscale newer builds." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is Farmington Hills, MI popular?", a: "Farmington Hills is known for its stability, parks, strong schools reputation, and convenient location, which makes it a steady favorite for families and professionals." },
      { q: "What kind of homes are in Farmington Hills?", a: "A wide range, from ranches and colonials to newer and upscale homes. We can help you find the right neighborhood and price point." },
      { q: "Is Farmington Hills good for relocation?", a: "Yes. Its schools reputation, parks, and easy access make it a popular landing spot for families relocating to Metro Detroit." },
    ],
  },
  {
    slug: "milford-mi",
    name: "Milford",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Considering Milford, MI? Explore this charming Oakland County village with a walkable historic downtown, Kensington Metropark, and small-town character, with SOLD IT TODAY.",
    heroIntro:
      "A charming Oakland County village: a walkable historic downtown, the Huron River and Kensington Metropark nearby, and a genuine small-town feel.",
    community: [
      "Milford is one of the most charming villages in Oakland County, with a walkable historic downtown full of local shops and restaurants along Main Street. It sits along the Huron River, minutes from Kensington Metropark, with a relaxed, small-town character that is hard to find this close to the metro.",
      "Homes range from historic in-town houses to newer subdivisions and semi-rural properties on larger lots, appealing to buyers who want space, nature, and a real downtown.",
    ],
    lifestyle: [
      { title: "Walkable downtown", description: "Historic Main Street shops, dining, and events." },
      { title: "Nature nearby", description: "The Huron River and Kensington Metropark minutes away." },
      { title: "Small-town feel", description: "A relaxed village character close to the metro." },
      { title: "Space and variety", description: "From in-town historic homes to larger semi-rural lots." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Milford, MI known for?", a: "Milford is known for its charming walkable downtown, small-town character, and proximity to the Huron River and Kensington Metropark." },
      { q: "Are there larger lots in Milford?", a: "Yes. Milford offers everything from historic in-town homes to newer subdivisions and semi-rural properties on larger lots." },
      { q: "Is Milford close to the metro?", a: "Yes. Milford keeps a small-town feel while staying convenient to Oakland County and the broader Metro Detroit area." },
    ],
  },
  {
    slug: "warren-mi",
    name: "Warren",
    county: "Macomb County",
    region: "Macomb County",
    metaDescription:
      "Looking at Warren, MI? Explore Macomb County's largest city with affordable established neighborhoods, the GM Tech Center, and central access, with SOLD IT TODAY.",
    heroIntro:
      "Macomb County's largest city: affordable, established neighborhoods, major employers like the GM Tech Center, and a central location close to Detroit.",
    community: [
      "Warren is the largest city in Macomb County and the third largest in Michigan, known for its affordability and its established, working neighborhoods. It is home to the GM Technical Center and sits right against Detroit's northern border, which keeps jobs and the city close.",
      "Housing is largely well-kept postwar ranches and bungalows at approachable prices, making Warren a strong first-home and value market with easy access to I-696, I-75, and Van Dyke.",
    ],
    lifestyle: [
      { title: "Affordability", description: "Approachable postwar ranches and bungalows." },
      { title: "Major employers", description: "Home to the GM Technical Center." },
      { title: "Central access", description: "Close to Detroit via I-696, I-75, and Van Dyke." },
      { title: "Established neighborhoods", description: "Steady, well-kept streets across the city." },
    ],
    relocation: false,
    faqs: [
      { q: "Is Warren, MI affordable?", a: "Yes. Warren is known for approachable, well-kept postwar homes, which makes it a strong first-home and value market in Macomb County." },
      { q: "What is Warren known for?", a: "Warren is Macomb County's largest city, home to the GM Technical Center, with established neighborhoods and a central location next to Detroit." },
      { q: "How is the commute from Warren?", a: "Very convenient. Warren has easy access to I-696, I-75, and Van Dyke, keeping Detroit and the region close." },
    ],
  },
  {
    slug: "sterling-heights-mi",
    name: "Sterling Heights",
    county: "Macomb County",
    region: "Macomb County",
    metaDescription:
      "Considering Sterling Heights, MI? Explore this large, family-friendly Macomb city with parks, a strong schools reputation, and great amenities, with SOLD IT TODAY.",
    heroIntro:
      "A large, family-friendly Macomb County city: well-kept neighborhoods, an extensive parks system, a strong schools reputation, and standout amenities.",
    community: [
      "Sterling Heights is one of Macomb County's most sought-after cities, known for its family-friendly neighborhoods, safety reputation, and strong schools. It offers a mix of established subdivisions and newer homes, plus major employers and shopping around the Lakeside area.",
      "An extensive parks system, Dodge Park and the Nature Center, diverse dining, and easy access via M-59 and Van Dyke make it a steady, high-demand choice for families and move-up buyers.",
    ],
    lifestyle: [
      { title: "Family-friendly", description: "Well-kept neighborhoods and a safety reputation." },
      { title: "Parks and recreation", description: "Dodge Park, the Nature Center, and an extensive system." },
      { title: "Strong schools reputation", description: "A long-standing draw for families." },
      { title: "Shopping and dining", description: "The Lakeside area and a diverse dining scene." },
    ],
    relocation: true,
    faqs: [
      { q: "Why do families choose Sterling Heights, MI?", a: "Sterling Heights is known for its family-friendly neighborhoods, safety reputation, strong schools, parks, and amenities, which makes it one of Macomb County's most in-demand cities." },
      { q: "What kind of homes are in Sterling Heights?", a: "A mix of established subdivisions and newer homes across a range of prices. We can help you find the right neighborhood and budget." },
      { q: "Is Sterling Heights good for relocation?", a: "Yes. Its schools, safety reputation, and amenities make it a popular choice for families relocating to the Macomb County side of Metro Detroit." },
    ],
  },
  {
    slug: "canton-mi",
    name: "Canton",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Thinking about Canton, MI? Explore this fast-growing western-Wayne community with strong schools, family neighborhoods, and easy Ann Arbor and Metro access, with SOLD IT TODAY.",
    heroIntro:
      "A fast-growing western-Wayne community: strong schools, newer family neighborhoods, and a location right between Ann Arbor and the rest of Metro Detroit.",
    community: [
      "Canton is one of western Wayne County's most popular communities, known for its strong schools, newer subdivisions, and family-friendly feel. It has grown quickly for good reason, sitting conveniently between Ann Arbor and Metro Detroit with abundant shopping and parks.",
      "Housing leans toward newer colonials and subdivisions along with established neighborhoods, appealing to families and professionals who want space, schools, and an easy commute in either direction.",
    ],
    lifestyle: [
      { title: "Strong schools", description: "A top reason families choose Canton." },
      { title: "Newer neighborhoods", description: "Colonials and subdivisions with space." },
      { title: "Between two hubs", description: "Convenient to both Ann Arbor and Metro Detroit." },
      { title: "Shopping and parks", description: "Abundant retail and an active parks system." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is Canton, MI popular?", a: "Canton is known for its strong schools, newer family neighborhoods, and a convenient location between Ann Arbor and Metro Detroit, which has driven its fast growth." },
      { q: "What kind of homes are in Canton?", a: "Mostly newer colonials and subdivisions along with established neighborhoods, appealing to families and professionals." },
      { q: "Is Canton a good relocation choice?", a: "Yes. Its schools and central location between Ann Arbor and Detroit make it a favorite for families relocating to the area." },
    ],
  },
  {
    slug: "plymouth-mi",
    name: "Plymouth",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Considering Plymouth, MI? Explore this charming western-Wayne city with a walkable historic downtown, Kellogg Park, and an upscale small-town feel, with SOLD IT TODAY.",
    heroIntro:
      "A charming western-Wayne favorite: a walkable historic downtown around Kellogg Park, an upscale small-town feel, and a beloved dining and events scene.",
    community: [
      "Plymouth is one of the most charming communities in western Wayne County, centered on a walkable historic downtown around Kellogg Park. It has an upscale small-town character, a strong dining scene, and signature events like the Ice Festival that draw people from across the region.",
      "Homes range from historic in-town houses to established neighborhoods and newer builds, appealing to buyers who want walkability, character, and a real sense of community close to Northville and Canton.",
    ],
    lifestyle: [
      { title: "Walkable downtown", description: "Kellogg Park, shops, and dining you can stroll to." },
      { title: "Events and culture", description: "The Ice Festival and a lively local scene." },
      { title: "Upscale small-town feel", description: "Character and community with real charm." },
      { title: "Well-connected", description: "Close to Northville, Canton, and the M-14 corridor." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Plymouth, MI known for?", a: "Plymouth is known for its walkable historic downtown around Kellogg Park, its dining and events like the Ice Festival, and an upscale small-town feel." },
      { q: "Are homes in Plymouth expensive?", a: "Plymouth spans a range, from historic in-town homes to established neighborhoods and newer builds. We can find options that fit your goals and budget." },
      { q: "Is Plymouth good for families and relocation?", a: "Yes. Its walkability, character, and community feel make it a popular choice for families and people relocating to western Wayne County." },
    ],
  },
  {
    slug: "woodhaven-mi",
    name: "Woodhaven",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Considering Woodhaven, MI? Discover this newer Downriver city with Woodhaven Village, West Road shopping, and tidy family subdivisions, with SOLD IT TODAY.",
    heroIntro:
      "One of Downriver's newer, master-planned cities: the Woodhaven Village core, a busy West Road retail strip, and neat subdivisions that feel move-in ready.",
    community: [
      "Woodhaven grew up later than most of its Downriver neighbors, and it shows in the planning. Streets are laid out with intention, the Woodhaven Village area anchors the city with a walkable civic feel, and West Road serves as the main artery for shopping, dining, and everyday errands. It is a city built for convenience, close to I-75 yet set back enough from the busier corridors to keep neighborhoods calm.",
      "Housing here leans toward well-kept subdivisions and newer construction, with brick ranches, colonials, and split-levels sitting on comfortable lots. Buyers are often drawn by the sense of order and the practical location, with Costco, Meijer, and the West Road corridor handling most needs without a long drive. Parks and community events give the city a friendly, family-friendly rhythm throughout the year.",
    ],
    lifestyle: [
      { title: "Woodhaven Village", description: "A central civic and gathering area that gives the city a walkable heart." },
      { title: "West Road retail", description: "Costco, Meijer, and a long strip of shops and restaurants close to home." },
      { title: "Easy I-75 access", description: "Quick freeway connections make commutes across Downriver and Metro Detroit simple." },
      { title: "Tidy subdivisions", description: "Newer, well-planned neighborhoods with comfortable lots and move-in-ready homes." },
    ],
    relocation: false,
    faqs: [
      { q: "What is it like to live in Woodhaven, MI?", a: "Woodhaven is one of Downriver's newer, well-planned cities, known for tidy subdivisions, the West Road shopping corridor, and quick I-75 access. It is convenient and calm." },
      { q: "Is Woodhaven good for families?", a: "Many buyers choose Woodhaven for its orderly subdivisions, parks, and community events, plus everyday shopping close at hand. We are happy to walk you through neighborhoods." },
      { q: "How is shopping and commuting in Woodhaven?", a: "The West Road corridor covers most daily needs, and I-75 is minutes away for commuting across Metro Detroit. Reach out and we can map it to your routine." },
    ],
  },
  {
    slug: "flat-rock-mi",
    name: "Flat Rock",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Exploring Flat Rock, MI? Get to know this southern Downriver city on the Huron River, home to Flat Rock Speedway and a small-town feel, with SOLD IT TODAY.",
    heroIntro:
      "Southern Downriver where the Huron River winds through town: a genuine small-town core, the historic Flat Rock Speedway, and rural edges that keep things spacious.",
    community: [
      "Flat Rock sits at the southern edge of Downriver, straddling the Huron River and the line between Wayne and Monroe counties. The river gives the city its name and much of its character, with parks and quiet stretches of water threading through town. A long-standing Ford presence anchors the local economy, and the compact downtown keeps a friendly, small-town feel that many residents treasure.",
      "The city is perhaps best known beyond its borders for the Flat Rock Speedway, a short track that has drawn racing fans for generations. Away from the roar of race night, neighborhoods range from older homes near the center to newer builds and roomier parcels toward the rural fringes. It is a place that blends practical Downriver convenience with a bit of countryside breathing room.",
    ],
    lifestyle: [
      { title: "Huron River", description: "Riverfront parks and quiet water give the city its name and scenery." },
      { title: "Flat Rock Speedway", description: "A classic short track that has drawn racing fans for decades." },
      { title: "Small-town downtown", description: "A compact, walkable center with a friendly, familiar feel." },
      { title: "Room to spread out", description: "Rural edges and larger parcels offer space toward the city's outskirts." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Flat Rock, MI known for?", a: "Flat Rock is a southern Downriver city on the Huron River, known for its small-town feel, a long-standing Ford plant, and the historic Flat Rock Speedway." },
      { q: "Does Flat Rock have larger lots?", a: "Toward the rural edges of town you will find roomier parcels and more space, alongside older homes near the center and some newer builds. We can help you find the right fit." },
      { q: "Where is Flat Rock located?", a: "Flat Rock sits at the southern end of Downriver near the Wayne and Monroe county line, with easy reach to I-75 and US-24. Ask us about the commute from here." },
    ],
  },
  {
    slug: "riverview-mi",
    name: "Riverview",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Looking at Riverview, MI? Discover this small, quiet Downriver city with Riverview Highlands golf and a beloved sledding hill, with SOLD IT TODAY.",
    heroIntro:
      "A small, quiet, almost entirely residential Downriver city: the Riverview Highlands golf course, a favorite winter sledding hill, and calm, well-kept streets.",
    community: [
      "Riverview is one of Downriver's smaller cities, and it wears that quietness proudly. Almost entirely residential, it offers a settled, easygoing pace with well-maintained neighborhoods and a strong sense of local pride. The city sits conveniently among its Downriver neighbors, so shopping and freeways are never far, yet the streets themselves stay calm and low-traffic.",
      "Two local landmarks give Riverview its personality. The Riverview Highlands golf course draws players from across the region, and the Land Preserve, built atop a former landfill, has become a beloved winter sledding hill and a green overlook the rest of the year. Homes here are mostly comfortable postwar ranches and colonials on tidy lots, appealing to buyers who want quiet and convenience in equal measure.",
    ],
    lifestyle: [
      { title: "Riverview Highlands", description: "A well-known public golf course that draws players from across Downriver." },
      { title: "The sledding hill", description: "The Land Preserve doubles as a favorite winter sledding spot and green overlook." },
      { title: "Quiet and residential", description: "An almost entirely residential city with calm, low-traffic streets." },
      { title: "Central Downriver spot", description: "Neighboring cities keep shopping and freeways just a short drive away." },
    ],
    relocation: false,
    faqs: [
      { q: "What is it like to live in Riverview, MI?", a: "Riverview is a small, quiet, almost entirely residential Downriver city, known for calm streets, the Riverview Highlands golf course, and a beloved winter sledding hill." },
      { q: "Is Riverview a good place for a quiet neighborhood?", a: "Yes. Riverview is one of the calmer Downriver cities, with well-kept residential streets and little through traffic. We can show you what is available." },
      { q: "What is there to do in Riverview?", a: "Golf at Riverview Highlands, sledding at the Land Preserve in winter, and easy trips to nearby Downriver shopping. Reach out if you would like a local tour." },
    ],
  },
  {
    slug: "trenton-mi",
    name: "Trenton",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Thinking about Trenton, MI? Explore this riverfront Downriver city with Elizabeth Park, historic West Jefferson, and Detroit River charm, with SOLD IT TODAY.",
    heroIntro:
      "Riverfront Downriver at its most charming: island greenery at Elizabeth Park, a historic West Jefferson downtown, and front-row views of the Detroit River.",
    community: [
      "Trenton hugs the Detroit River, and that waterfront setting defines the city. Elizabeth Park, one of the oldest county parks in Michigan, sits on an island reached by bridge and offers lagoons, boat wells, and shaded picnic grounds right on the water. The historic West Jefferson downtown adds a walkable stretch of shops and restaurants, giving Trenton a real sense of place that many Downriver cities envy.",
      "Neighborhoods range from stately older homes near the river to comfortable mid-century streets a little farther in, and the riverfront draws boaters, walkers, and anglers year-round. With its blend of history, water, and a genuine downtown, Trenton has long been one of the most sought-after addresses in Downriver, while still keeping the practical convenience of freeway and shopping access.",
    ],
    lifestyle: [
      { title: "Elizabeth Park", description: "A historic island park on the Detroit River with lagoons and boat wells." },
      { title: "West Jefferson downtown", description: "A walkable historic strip of shops, restaurants, and local character." },
      { title: "Detroit River living", description: "Waterfront views, boating, and riverside walks close to home." },
      { title: "Real sense of place", description: "History, water, and a true downtown give Trenton lasting appeal." },
    ],
    relocation: false,
    faqs: [
      { q: "What makes Trenton, MI special?", a: "Trenton is a riverfront Downriver city known for Elizabeth Park on the Detroit River, its historic West Jefferson downtown, and genuine waterfront charm." },
      { q: "Can you find waterfront homes in Trenton?", a: "Trenton offers riverside neighborhoods and views along the Detroit River, along with comfortable inland streets. We can help you explore what is available near the water." },
      { q: "Is Trenton a walkable city?", a: "The historic West Jefferson downtown gives Trenton a walkable core of shops and restaurants, plus Elizabeth Park for riverside strolls. Ask us for a tour." },
    ],
  },
  {
    slug: "grosse-ile-mi",
    name: "Grosse Ile",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Dreaming of Grosse Ile, MI? Discover this upscale island township in the Detroit River, with waterfront living and natural beauty, with SOLD IT TODAY.",
    heroIntro:
      "An island township set in the Detroit River: bridges to the mainland, quiet tree-lined lanes, abundant waterfront, and an unmistakably exclusive, natural feel.",
    community: [
      "Grosse Ile is a true island community, a cluster of land in the Detroit River connected to the mainland by bridges. That geography sets it apart from everywhere else in Downriver. Winding lanes pass under mature trees, the shoreline offers boat docks and river views at nearly every turn, and a small airport and historic landmarks add to the township's distinctive character. It is a place that feels a world away while remaining close to the region.",
      "Homes here tend toward the upscale, from gracious waterfront estates to comfortable island residences tucked among the greenery. Nature is never far, with parks, nature preserves, and the ever-present river shaping daily life. For buyers seeking privacy, water, and a genuinely unique setting, Grosse Ile is one of the most sought-after addresses in Southeast Michigan, and relocation buyers often find it worth the drive to discover.",
    ],
    lifestyle: [
      { title: "Island living", description: "Bridges connect this Detroit River township to the mainland Downriver." },
      { title: "Waterfront everywhere", description: "Docks, river views, and boating are woven into daily island life." },
      { title: "Nature and preserves", description: "Parks, mature trees, and nature areas keep the setting green and quiet." },
      { title: "Exclusive character", description: "Gracious homes and a private feel make it a distinctive address." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Grosse Ile, MI like?", a: "Grosse Ile is an upscale island township in the Detroit River, connected by bridges, known for waterfront living, mature trees, and a quiet, exclusive character." },
      { q: "Is Grosse Ile good for relocation buyers?", a: "It can be a wonderful fit for those seeking water, privacy, and a unique setting. As a relocation-friendly community, we are glad to introduce you to island living." },
      { q: "Does Grosse Ile have waterfront homes?", a: "Yes. The island offers everything from gracious waterfront estates to comfortable residences near the river. Reach out and we can explore current options together." },
    ],
  },
  {
    slug: "brownstown-mi",
    name: "Brownstown Township",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Considering Brownstown Township, MI? Explore this growing Downriver community with Lake Erie Metropark, newer subdivisions, and rural pockets, with SOLD IT TODAY.",
    heroIntro:
      "A large, growing Downriver township: newer subdivisions and modern amenities on one side, Lake Erie Metropark and open rural stretches on the other.",
    community: [
      "Brownstown Township is one of Downriver's larger and faster-growing communities, spread across several distinct pockets rather than a single center. That size gives it real variety, with busy retail and newer subdivisions in some areas and quieter, semi-rural stretches in others. Its position along the southern edge of the region puts Lake Erie and the wider Downriver corridor within easy reach.",
      "The crown jewel is Lake Erie Metropark, a sprawling waterfront park known for its marshland, marina, wave pool, and outstanding birdwatching along the Detroit River's mouth. Housing ranges from modern subdivision homes with contemporary layouts to properties on larger, more open lots toward the rural edges. For buyers who want newer construction and room to grow, Brownstown offers space and momentum in equal measure.",
    ],
    lifestyle: [
      { title: "Lake Erie Metropark", description: "A large waterfront park with a marina, wave pool, and famous birdwatching." },
      { title: "Newer subdivisions", description: "Modern homes and contemporary layouts in growing residential areas." },
      { title: "Rural pockets", description: "Open, semi-rural stretches offer larger lots and breathing room." },
      { title: "Room to grow", description: "A large, expanding township with space and steady development." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Brownstown Township, MI known for?", a: "Brownstown is a large, growing Downriver township known for Lake Erie Metropark, newer subdivisions, and a mix of modern neighborhoods and rural pockets." },
      { q: "Are there newer homes in Brownstown?", a: "Yes. Brownstown has seen steady development, with modern subdivisions and contemporary layouts alongside more open, rural parcels. We can help you compare areas." },
      { q: "What outdoor spaces does Brownstown offer?", a: "Lake Erie Metropark is the standout, with a marina, wave pool, marshland trails, and renowned birdwatching. Ask us about neighborhoods near the park." },
    ],
  },
  {
    slug: "romulus-mi",
    name: "Romulus",
    county: "Wayne County",
    region: "Downriver, Wayne County",
    metaDescription:
      "Looking at Romulus, MI? Discover this convenient Downriver city, home to Detroit Metro Airport, with affordable homes and easy access, with SOLD IT TODAY.",
    heroIntro:
      "Home to Detroit Metro Airport and a hub of logistics and industry: Romulus offers hard-to-beat convenience, easy freeway access, and approachable pricing.",
    community: [
      "Romulus is defined in large part by Detroit Metropolitan Wayne County Airport, one of the busiest in the country and a major regional employer. That airport anchors a broad base of logistics, warehousing, and industry, giving the city an economy built on movement and access. For anyone who travels often or works in the trades and transport sectors, few locations in the region are more practical.",
      "Beyond the runways, Romulus is a spread-out city with residential neighborhoods, open parcels, and a quiet, workaday character. Homes tend toward the approachable end of the market, from older ranches to newer builds, making it a popular landing spot for first-time buyers and those who prioritize location and value. Freeways including I-94 and I-275 fan out in every direction, putting the whole metro within easy reach.",
    ],
    lifestyle: [
      { title: "Detroit Metro Airport", description: "DTW anchors the city as a major employer and travel gateway." },
      { title: "Logistics and industry", description: "Warehousing and transport give the local economy a steady base." },
      { title: "Unbeatable access", description: "I-94, I-275, and the airport put the whole metro within reach." },
      { title: "Approachable pricing", description: "Value-friendly homes make it a practical pick for many buyers." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Romulus, MI known for?", a: "Romulus is home to Detroit Metro Airport and a hub of logistics and industry, known for its central location, freeway access, and approachable home prices." },
      { q: "Is Romulus affordable for buyers?", a: "Romulus tends toward the value-friendly end of the market, with older ranches and some newer builds. It is popular with first-time buyers, and we can review your options." },
      { q: "How convenient is Romulus for travel and commuting?", a: "Very. With Detroit Metro Airport in the city and I-94 and I-275 close by, travel and commuting across the metro are simple. Ask us about specific neighborhoods." },
    ],
  },
  {
    slug: "belleville-mi",
    name: "Belleville",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Exploring Belleville, MI? Discover this lakeside city with Belleville Lake, a historic downtown, and the Strawberry Festival, with SOLD IT TODAY.",
    heroIntro:
      "Lakeside living in Western Wayne County: the shores of Belleville Lake, a charming historic downtown, and the beloved annual National Strawberry Festival.",
    community: [
      "Belleville is a small city with an outsized personality, wrapped around the shores of Belleville Lake in the heart of the Van Buren area. The lake is the centerpiece of local life, drawing boaters, anglers, and walkers to its shoreline and lending the city a relaxed, waterfront feel. A compact historic downtown along Main Street adds walkable shops, restaurants, and a strong sense of community identity.",
      "Each year the city fills for the National Strawberry Festival, a signature event that brings the whole area together with a parade, entertainment, and plenty of strawberry treats. Homes range from historic residences near downtown to lakeside properties and comfortable neighborhoods in the surrounding Van Buren Township. With water, walkability, and small-town warmth, Belleville offers a distinctive lifestyle within easy reach of I-94 and the wider metro.",
    ],
    lifestyle: [
      { title: "Belleville Lake", description: "A scenic lake at the city's heart for boating, fishing, and lakeside walks." },
      { title: "Historic downtown", description: "A walkable Main Street with local shops, restaurants, and character." },
      { title: "Strawberry Festival", description: "The beloved annual National Strawberry Festival brings the area together." },
      { title: "Easy I-94 access", description: "Quick freeway connections link the city to Ann Arbor and Metro Detroit." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Belleville, MI known for?", a: "Belleville is a lakeside Western Wayne city known for Belleville Lake, a charming historic downtown, and the beloved annual National Strawberry Festival." },
      { q: "Are there lakefront homes in Belleville?", a: "Yes. Belleville Lake shapes the area, with lakeside properties and neighborhoods nearby in the Van Buren area. We can help you explore homes near the water." },
      { q: "Where is Belleville located?", a: "Belleville sits in Western Wayne County near I-94, roughly between Ann Arbor and Metro Detroit. Ask us about commuting and neighborhoods around the lake." },
    ],
  },
  {
    slug: "huron-township-mi",
    name: "Huron Township",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Considering Huron Township, MI? Discover this semi-rural community around New Boston, with Willow and Lower Huron Metroparks and larger lots, with SOLD IT TODAY.",
    heroIntro:
      "Semi-rural living in southwestern Wayne County: the village feel of New Boston, the sprawling Huron-Clinton Metroparks, and roomy lots with space to breathe.",
    community: [
      "Huron Township covers a broad, semi-rural stretch of southwestern Wayne County, centered on the small community of New Boston. Here the pace slows, the parcels grow larger, and the landscape opens into fields, woods, and winding roads. It is a place for buyers who want elbow room and a quieter setting while staying within reach of Downriver shopping and the airport corridor.",
      "The Huron River and the metroparks are the township's great outdoor draw. Willow and Lower Huron Metroparks offer miles of trails, picnic areas, and paddling along the river, making the outdoors part of everyday life. Homes range from older farmhouses and ranches to newer builds on generous lots, giving the area a rural character that is increasingly rare so close to the metro. For those craving space and nature, Huron Township delivers.",
    ],
    lifestyle: [
      { title: "Willow Metropark", description: "Trails, picnic areas, and river access in a large Huron-Clinton park." },
      { title: "Lower Huron Metropark", description: "More miles of riverside trails and green space along the Huron River." },
      { title: "New Boston village", description: "A small, friendly community center anchoring the township." },
      { title: "Larger lots", description: "Semi-rural parcels and open land offer real space to spread out." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Huron Township, MI like?", a: "Huron Township is a semi-rural community in southwestern Wayne County around New Boston, known for the Willow and Lower Huron Metroparks and larger, open lots." },
      { q: "Can you find larger lots in Huron Township?", a: "Yes. The township is known for roomier, semi-rural parcels and open land, along with farmhouses, ranches, and newer builds. We can help you find the right amount of space." },
      { q: "What outdoor recreation is near Huron Township?", a: "Willow and Lower Huron Metroparks offer trails, picnic spots, and paddling along the Huron River. Ask us about neighborhoods near the parks." },
    ],
  },
  {
    slug: "dearborn-heights-mi",
    name: "Dearborn Heights",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Thinking about Dearborn Heights, MI? Discover this settled Western Wayne suburb with Warren Valley golf, parks, and easy Detroit access, with SOLD IT TODAY.",
    heroIntro:
      "A settled, budget-friendly residential city just west of Dearborn, known for its quiet neighborhoods, Warren Valley golf course, and quick reach to Detroit and the freeways.",
    community: [
      "Dearborn Heights sits in Western Wayne County, wrapping around the west side of Dearborn in two sections split by the city of Dearborn. Its streets are lined with sturdy postwar ranches, bungalows, and colonials on comfortable lots, giving the city a calm, established feel that draws people looking for room and value close to the urban core.",
      "Everyday life here leans on well-kept neighborhood parks, the Warren Valley golf course and its surrounding greenspace, and a handful of local shopping corridors along Ford Road, Michigan Avenue, and Telegraph. The Rouge River corridor threads through parts of town, and residents appreciate that so much of Metro Detroit sits within a short drive.",
    ],
    lifestyle: [
      { title: "Warren Valley golf", description: "A longtime local golf course and greenspace anchoring the community." },
      { title: "Everyday value", description: "Practical ranches, bungalows, and colonials at approachable price points." },
      { title: "Parks and recreation", description: "Neighborhood parks and the Rouge River corridor close to home." },
      { title: "Easy commuting", description: "Quick access to Telegraph, Ford Road, and nearby freeways into Detroit." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Dearborn Heights, MI known for?", a: "Dearborn Heights is a quiet residential city next to Dearborn, known for settled neighborhoods, Warren Valley golf, and convenient access to Detroit and the freeways." },
      { q: "Is Dearborn Heights a good place to buy a home?", a: "Yes. It offers solid value on established homes with an easy commute. We can help you find the right street and style for your budget." },
      { q: "Is Dearborn Heights convenient to Detroit?", a: "Very. The city borders Dearborn and sits minutes from Detroit, with Telegraph, Ford Road, and major freeways all close by." },
    ],
  },
  {
    slug: "garden-city-mi",
    name: "Garden City",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Considering Garden City, MI? Explore this small, tidy Western Wayne community with close-knit streets and great value, with SOLD IT TODAY.",
    heroIntro:
      "A small, tidy postwar city tucked between Westland and Livonia, Garden City is known for its neat residential streets, close-knit feel, and dependable value.",
    community: [
      "Garden City earns its name honestly, a compact Western Wayne community of trim lots and modest, well-maintained homes that trace back to the area's postwar building boom. Ranches and bungalows on orderly blocks give the city a friendly, unpretentious character that appeals to first-time buyers and longtime owners alike.",
      "Life here centers on neighborhood parks, local ball fields, and the shops and eateries along Ford Road and Middlebelt. Bordered by Westland to the south and Livonia to the north, Garden City offers a genuine small-town feel while keeping the wider amenities of Metro Detroit within easy reach.",
    ],
    lifestyle: [
      { title: "Tidy neighborhoods", description: "Neat blocks of well-kept ranches and bungalows on manageable lots." },
      { title: "Small-town feel", description: "A compact, close-knit community with a friendly local character." },
      { title: "Local shopping", description: "Everyday shops and restaurants along Ford Road and Middlebelt." },
      { title: "Central location", description: "Set between Westland and Livonia with easy reach across Western Wayne." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Garden City, MI known for?", a: "Garden City is a small, tidy postwar community in Western Wayne County, known for its neat residential streets, close-knit feel, and strong value." },
      { q: "Is Garden City a good place to buy a home?", a: "Yes. Its affordable, well-kept homes make it popular with first-time buyers. We can help you spot the right one as it comes to market." },
      { q: "Where is Garden City located?", a: "Garden City sits in Western Wayne County between Westland and Livonia, with quick access to Ford Road, Middlebelt, and nearby freeways." },
    ],
  },
  {
    slug: "redford-mi",
    name: "Redford",
    county: "Wayne County",
    region: "Western Wayne County",
    metaDescription:
      "Looking at Redford, MI? Explore this settled township on Detroit's northwest border with established homes and Hines Park nearby, with SOLD IT TODAY.",
    heroIntro:
      "Redford Township hugs Detroit's northwest border, offering established, budget-friendly neighborhoods with the Bell Creek and Hines Park greenway close at hand.",
    community: [
      "Redford Township lies right along Detroit's northwest edge in Western Wayne County, a settled community of brick bungalows, ranches, and Tudors on tree-lined streets. Its long-established feel and approachable pricing make it a favorite for buyers who want character and value while staying close to the city.",
      "Bell Creek winds through town and connects to the beloved Hines Park corridor just to the west, giving residents miles of trails, picnic spots, and greenspace. Shopping and dining gather along corridors like Grand River, Telegraph, and Plymouth Road, and freeway access keeps downtown Detroit and the western suburbs within an easy drive.",
    ],
    lifestyle: [
      { title: "Hines Park nearby", description: "Trails, picnic areas, and greenway access along the Rouge River corridor." },
      { title: "Established homes", description: "Brick bungalows, ranches, and Tudors on settled, tree-lined streets." },
      { title: "Bell Creek greenway", description: "A local waterway threading through town toward the parkway system." },
      { title: "Border-of-Detroit access", description: "Grand River, Telegraph, and freeways put the city minutes away." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Redford, MI known for?", a: "Redford Township is a settled community on Detroit's northwest border, known for established brick homes, approachable prices, and easy access to Hines Park." },
      { q: "Is Redford a good place to buy a home?", a: "Yes. It offers character-filled homes at solid value close to Detroit. We can help you target the right pocket of the township." },
      { q: "Is Redford close to Detroit?", a: "Very. Redford borders Detroit's northwest side, with Grand River, Telegraph, and nearby freeways making the city a short drive." },
    ],
  },
  {
    slug: "detroit-mi",
    name: "Detroit",
    county: "Wayne County",
    region: "Wayne County",
    metaDescription:
      "Buying in Detroit, MI? Explore historic neighborhoods, a revitalizing downtown and riverfront, and real value and opportunity, with SOLD IT TODAY.",
    heroIntro:
      "Michigan's largest city and cultural heart, Detroit pairs storied historic neighborhoods with a revitalizing downtown, a transformed riverfront, and genuine value and opportunity for buyers.",
    community: [
      "Detroit is a city of remarkable neighborhoods, from the grand boulevards of Boston-Edison and the stately homes of Indian Village to the winding, tree-canopied streets of Rosedale Park and the historic character of Corktown and Woodbridge. Each district carries its own architecture and story, offering buyers a range of settings from stately historic homes to walkable, close-knit blocks.",
      "Downtown and Midtown continue a striking revitalization, with restored landmarks, new restaurants and shops, and a riverfront that has been reborn into a celebrated network of parks and promenades. Add world-class museums, the sports venues that fill downtown on game days, and a deep well of music and culture, and Detroit stands out as a place with real momentum. Down payment assistance of up to $25,000 is available to help qualified buyers put down roots in the city.",
    ],
    lifestyle: [
      { title: "Historic neighborhoods", description: "Boston-Edison, Indian Village, Rosedale Park, and more, each with its own character." },
      { title: "Riverfront reborn", description: "A celebrated network of parks and promenades along the Detroit River." },
      { title: "Sports and culture", description: "Downtown venues, world-class museums, and a deep music heritage." },
      { title: "Value and assistance", description: "Real opportunity plus down payment assistance up to $25,000 for qualified buyers." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Detroit, MI known for?", a: "Detroit is known for its historic neighborhoods, revitalizing downtown and riverfront, sports and music heritage, world-class museums, and real value and opportunity for buyers." },
      { q: "Is there down payment assistance in Detroit?", a: "Yes. Down payment assistance of up to $25,000 is available to help qualified buyers purchase in the city. We can walk you through how it works." },
      { q: "Which Detroit neighborhoods should I consider?", a: "It depends on your goals. Historic districts like Boston-Edison, Indian Village, and Rosedale Park each offer distinct character. We can help you match the right one." },
    ],
  },
  {
    slug: "eastpointe-mi",
    name: "Eastpointe",
    county: "Macomb County",
    region: "Macomb County",
    metaDescription:
      "Considering Eastpointe, MI? Explore this convenient inner-ring Macomb suburb with established homes and great value, with SOLD IT TODAY.",
    heroIntro:
      "An inner-ring Macomb County suburb right on Detroit's border, Eastpointe offers established postwar neighborhoods, everyday convenience, and dependable value.",
    community: [
      "Eastpointe sits at the southern edge of Macomb County, sharing its border with Detroit and neighboring Warren and Roseville. It is a compact, walkable-in-parts community of postwar bungalows and ranches on tidy blocks, the kind of settled neighborhoods that make it easy for buyers to find solid homes at an approachable price.",
      "Daily needs are covered by the shops, restaurants, and services strung along Gratiot Avenue, Nine Mile, and Ten Mile, while local parks give families room to spread out. With Detroit next door and the rest of Macomb County just up the road, Eastpointe combines a convenient location with the value of an inner-ring suburb.",
    ],
    lifestyle: [
      { title: "Established homes", description: "Postwar bungalows and ranches on tidy, settled blocks." },
      { title: "Everyday convenience", description: "Shops and services along Gratiot, Nine Mile, and Ten Mile." },
      { title: "Inner-ring value", description: "Approachable pricing for buyers who want to stay close to Detroit." },
      { title: "Central Macomb access", description: "Bordering Detroit with quick reach to Warren, Roseville, and beyond." },
    ],
    relocation: false,
    faqs: [
      { q: "What is Eastpointe, MI known for?", a: "Eastpointe is an inner-ring Macomb County suburb on Detroit's border, known for established postwar neighborhoods, convenience, and strong value." },
      { q: "Is Eastpointe a good place to buy a home?", a: "Yes. Its affordable, established homes and central location make it appealing. We can help you find the right one at the right time." },
      { q: "Where is Eastpointe located?", a: "Eastpointe sits in southern Macomb County, bordering Detroit and near Warren and Roseville, with Gratiot Avenue and freeways keeping everything close." },
    ],
  },
  {
    slug: "ypsilanti-mi",
    name: "Ypsilanti",
    county: "Washtenaw County",
    region: "Washtenaw County",
    metaDescription:
      "Thinking about Ypsilanti, MI? Explore historic Depot Town, Eastern Michigan University, a walkable arts scene, and strong value, with SOLD IT TODAY.",
    heroIntro:
      "Home to Eastern Michigan University and the beloved historic districts of Depot Town and downtown, Ypsilanti offers a walkable, creative atmosphere and strong value right next to Ann Arbor.",
    community: [
      "Ypsilanti anchors the eastern side of Washtenaw County and blends college-town energy with genuine historic charm. Eastern Michigan University shapes much of the city's rhythm, while the landmark Ypsilanti Water Tower, the Michigan Avenue corridor, and the Huron River give the city its distinctive skyline and setting.",
      "The heart of local life beats in Depot Town and downtown, where restored 19th-century storefronts house restaurants, cafes, galleries, and music venues within easy walking distance. Neighborhoods like the historic districts feature well-preserved Victorians and craftsman homes, and buyers are drawn by the walkable character and the value that comes with sitting just east of Ann Arbor.",
    ],
    lifestyle: [
      { title: "Eastern Michigan University", description: "A major university shaping the city's energy and culture." },
      { title: "Depot Town", description: "Historic storefronts, dining, and music in a walkable district." },
      { title: "Arts and music", description: "Galleries, venues, and a creative scene downtown and beyond." },
      { title: "Value near Ann Arbor", description: "Historic homes and strong value just east of Ann Arbor." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Ypsilanti, MI known for?", a: "Ypsilanti is known for Eastern Michigan University, the historic Depot Town and downtown districts, its walkable arts and music scene, and its value next to Ann Arbor." },
      { q: "Is Ypsilanti a good place to buy a home?", a: "Yes. Its historic homes, walkable districts, and value near Ann Arbor make it attractive. We can help you find the right neighborhood." },
      { q: "Is Ypsilanti close to Ann Arbor?", a: "Very. Ypsilanti sits just east of Ann Arbor along Washtenaw and Michigan Avenues and the I-94 corridor, keeping it minutes away." },
    ],
  },
  {
    slug: "howell-mi",
    name: "Howell",
    county: "Livingston County",
    region: "Livingston County",
    metaDescription:
      "Considering Howell, MI? Explore the Livingston County seat with a charming historic downtown, festivals, and lakes-area living, with SOLD IT TODAY.",
    heroIntro:
      "The Livingston County seat, Howell is beloved for its charming historic downtown, hometown festivals, and lakes-area setting, with a true small-town feel midway between Detroit and Lansing.",
    community: [
      "Howell sits in the heart of Livingston County and serves as its county seat, centered on a picturesque downtown anchored by the historic courthouse and blocks of vintage storefronts filled with shops, restaurants, and local businesses. The walkable Main Street district gives the city a genuine small-town character that residents take real pride in.",
      "The surrounding area is dotted with lakes and rolling countryside, and Howell is famous for its seasonal celebrations, including the Michigan Challenge Balloonfest that fills the sky with hot air balloons and the long-running Howell Melon Festival. Positioned along the I-96 corridor roughly midway between Detroit and Lansing, the city offers a relaxed pace with easy reach to both metros.",
    ],
    lifestyle: [
      { title: "Historic downtown", description: "A picturesque Main Street with the landmark courthouse and local shops." },
      { title: "Balloonfest", description: "The Michigan Challenge Balloonfest fills the sky each year." },
      { title: "Melon Festival", description: "A long-running hometown celebration and Howell tradition." },
      { title: "Lakes and countryside", description: "Rolling terrain and area lakes for a relaxed outdoor pace." },
    ],
    relocation: true,
    faqs: [
      { q: "What is Howell, MI known for?", a: "Howell is the Livingston County seat, known for its charming historic downtown, the Michigan Challenge Balloonfest, the Melon Festival, and its lakes-area setting." },
      { q: "Is Howell a good place to buy a home?", a: "Yes. Its historic downtown, festivals, and lakes-area living give it lasting appeal. We can help you find the right home in and around town." },
      { q: "Where is Howell located?", a: "Howell sits in Livingston County along the I-96 corridor, roughly midway between Detroit and Lansing, offering a small-town pace with easy metro access." },
    ],
  },
  {
    slug: "farmington-mi",
    name: "Farmington",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Considering Farmington, MI? Discover this small Oakland County city with a walkable historic downtown and character homes, with SOLD IT TODAY.",
    heroIntro:
      "A compact Oakland County city with an old-fashioned, walkable downtown, historic charm, and easy access to the wider Farmington Hills area.",
    community: [
      "Farmington is a small, tight-knit city set within the larger footprint of Farmington Hills, and its heart is a genuinely walkable historic downtown along Grand River Avenue. Independent shops, restaurants, and the seasonal Farmington Farmers Market give it a distinct village feel that many surrounding suburbs lack, and the well-preserved storefronts keep a real sense of the city's past.",
      "The city is anchored by Riley Park, a downtown gathering spot that hosts concerts and community events, and by the annual Founders Festival that draws crowds each summer. Neighborhoods hold a lot of character homes and older architecture on established, tree-lined streets, all with quick connections to the region via Grand River and nearby freeways.",
    ],
    lifestyle: [
      { title: "Walkable downtown", description: "A historic Grand River district with shops, dining, and a farmers market." },
      { title: "Riley Park", description: "A downtown park hosting concerts and community gatherings." },
      { title: "Founders Festival", description: "A beloved annual summer celebration in the heart of the city." },
      { title: "Character homes", description: "Older architecture and established streets with genuine charm." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is Farmington, MI popular?", a: "Farmington is loved for its walkable historic downtown, Riley Park, and small-city charm inside a convenient Oakland County location." },
      { q: "What kind of homes are in Farmington?", a: "Largely character homes and older architecture on established streets, with some newer options. We can help you find the right fit." },
      { q: "Is Farmington good for relocation?", a: "Yes. Its downtown, community events, and easy regional access make it an appealing landing spot for people relocating to Metro Detroit." },
    ],
  },
  {
    slug: "west-bloomfield-mi",
    name: "West Bloomfield",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Exploring West Bloomfield, MI? Discover this upscale, lake-dotted Oakland County township with larger homes and abundant nature, with SOLD IT TODAY.",
    heroIntro:
      "An upscale, wooded Oakland County township known for its many lakes, spacious homes, and a strong emphasis on recreation and natural beauty.",
    community: [
      "West Bloomfield is an established, upscale township defined by water and woods. Cass Lake, Union Lake, and Pine Lake are among the many lakes scattered across the community, and the rolling, tree-covered terrain gives neighborhoods a private, retreat-like quality even though the township sits close to major shopping and freeways.",
      "Homes here tend toward the larger side, from lakefront properties to spacious subdivisions and custom builds tucked into wooded lots. A strong schools reputation, the West Bloomfield Woods Nature Preserve, and an extensive parks-and-trails system make it a favorite for those who want space, greenery, and recreation without leaving Oakland County.",
    ],
    lifestyle: [
      { title: "Lakes everywhere", description: "Cass, Union, Pine, and many more lakes for boating and recreation." },
      { title: "Wooded setting", description: "Rolling, tree-covered terrain and nature preserves throughout." },
      { title: "Strong schools reputation", description: "A long-standing draw for families in the township." },
      { title: "Spacious homes", description: "From lakefront properties to larger subdivisions and custom builds." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is West Bloomfield, MI popular?", a: "West Bloomfield is known for its lakes, wooded setting, larger homes, and strong schools reputation, all in an upscale township." },
      { q: "What kind of homes are in West Bloomfield?", a: "A range of larger homes, including lakefront properties, spacious subdivisions, and custom builds. We can help you find the right fit." },
      { q: "Is West Bloomfield good for relocation?", a: "Yes. Its lakes, nature, and schools reputation make it a popular choice for families relocating to Metro Detroit." },
    ],
  },
  {
    slug: "commerce-township-mi",
    name: "Commerce Township",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Looking at Commerce Township, MI? Explore this growing Oakland County lakes community with subdivisions and lakefront living, with SOLD IT TODAY.",
    heroIntro:
      "A growing Oakland County lakes community where suburban subdivisions and lakefront homes sit close to abundant recreation and everyday conveniences.",
    community: [
      "Commerce Township is a lakes-area community built around water and open space, with Commerce Lake and Union Lake shaping much of its character. The township blends established suburban subdivisions with lakefront neighborhoods, and its steady growth has brought newer developments, shopping, and dining alongside the older lake cottages and year-round homes.",
      "Recreation is a big part of daily life here, from boating and fishing on the lakes to parks, trails, and nearby golf. With convenient access to M-5 and surrounding corridors, the township offers a relaxed, outdoors-oriented setting while keeping the rest of Oakland County within easy reach.",
    ],
    lifestyle: [
      { title: "Lake living", description: "Commerce and Union Lakes anchor boating, fishing, and waterfront homes." },
      { title: "Growing community", description: "Newer developments, shopping, and dining alongside established areas." },
      { title: "Recreation focus", description: "Parks, trails, and golf for an outdoors-oriented lifestyle." },
      { title: "Mix of homes", description: "From suburban subdivisions to lakefront properties." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is Commerce Township, MI popular?", a: "Commerce Township is known for its lakes, recreation, steady growth, and a mix of subdivision and lakefront homes." },
      { q: "What kind of homes are in Commerce Township?", a: "A blend of suburban subdivisions and lakefront properties, from cottages to newer builds. We can help you find the right fit." },
      { q: "Is Commerce Township good for relocation?", a: "Yes. Its lakes, recreation, and convenient access make it an appealing spot for those relocating to the region." },
    ],
  },
  {
    slug: "south-lyon-mi",
    name: "South Lyon",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Thinking about South Lyon, MI? Discover this growing Oakland County city with a charming small-town downtown and trails, with SOLD IT TODAY.",
    heroIntro:
      "A growing city at the western edge of Oakland County with a charming small-town downtown, a strong schools reputation, and a friendly community feel.",
    community: [
      "South Lyon sits at the Oakland and Washtenaw county edge and has kept a genuine small-town identity even as it has grown. Its walkable downtown along Lake Street offers local shops, restaurants, and community events, and landmarks like the McHattie Park and the historic depot area give the city a distinct sense of place.",
      "The community leans into its schools reputation and its network of trails, including access to the Huron Valley Trail for walking and biking. New subdivisions have expanded the housing options alongside established neighborhoods, and the location offers a quieter pace while staying connected to Ann Arbor, Novi, and the wider region.",
    ],
    lifestyle: [
      { title: "Small-town downtown", description: "A walkable Lake Street district with shops, dining, and events." },
      { title: "Strong schools reputation", description: "A steady draw for families settling in the area." },
      { title: "Trails and recreation", description: "McHattie Park and access to the Huron Valley Trail." },
      { title: "Growing housing options", description: "New subdivisions alongside established neighborhoods." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is South Lyon, MI popular?", a: "South Lyon is known for its charming downtown, schools reputation, trails, and a welcoming small-town feel." },
      { q: "What kind of homes are in South Lyon?", a: "A mix of established neighborhoods and newer subdivisions. We can help you find the right fit." },
      { q: "Is South Lyon good for relocation?", a: "Yes. Its downtown, schools reputation, and location near Ann Arbor and Novi make it a popular relocation choice." },
    ],
  },
  {
    slug: "franklin-mi",
    name: "Franklin",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Curious about Franklin, MI? Explore this historic, upscale Oakland County village with wooded lots and rare charm, with SOLD IT TODAY.",
    heroIntro:
      "A historic, upscale Oakland County village known as the town that time forgot, with wooded lots, large parcels, and an exclusive small-village character.",
    community: [
      "Franklin, often called Franklin Village, has earned its nickname as the town that time forgot for the way it has preserved its historic New England style village center. The compact downtown, with its landmark Franklin Community Church, the historic Franklin Cider Mill nearby, and well-kept older buildings, gives the village a rare and timeless feel within Oakland County.",
      "Beyond the village center, Franklin is defined by wooded, rolling terrain and large lots that create a private, estate-like setting. Homes range from historic residences to spacious custom builds, and the village's careful preservation and quiet, tree-lined roads set it apart as one of the area's most distinctive small communities.",
    ],
    lifestyle: [
      { title: "Historic village center", description: "A preserved New England style downtown with real character." },
      { title: "Wooded, large lots", description: "Rolling terrain and spacious parcels for a private setting." },
      { title: "Timeless charm", description: "Known as the town that time forgot for its careful preservation." },
      { title: "Distinctive homes", description: "From historic residences to spacious custom builds." },
    ],
    relocation: true,
    faqs: [
      { q: "Why is Franklin, MI popular?", a: "Franklin is prized for its historic village charm, wooded large lots, and an exclusive, timeless small-village character." },
      { q: "What kind of homes are in Franklin?", a: "A range from historic residences to spacious custom builds on wooded lots. We can help you find the right fit." },
      { q: "Is Franklin good for relocation?", a: "Yes. Its distinctive village character and private setting make it a sought-after choice for those relocating to Oakland County." },
    ],
  },
  {
    slug: "southfield-mi",
    name: "Southfield",
    county: "Oakland County",
    region: "Oakland County",
    metaDescription:
      "Considering Southfield, MI? Explore this central Oakland County business hub with quick freeway access and varied housing, with SOLD IT TODAY.",
    heroIntro:
      "A major Metro Detroit business and office hub with a central Oakland County location, quick freeway access, and a mix of condos and established neighborhoods.",
    community: [
      "Southfield is one of Metro Detroit's key business and office centers, with a skyline of corporate towers along the Northwestern Highway and Town Center area. That employment base, combined with its central position in Oakland County, makes it one of the most convenient places to be based in the region for commuting and daily errands alike.",
      "Beyond the office corridors, Southfield offers a practical mix of housing, from condos and apartments to established single-family neighborhoods and ranch and colonial homes. Quick access via the Lodge Freeway, I-696, and the Southfield Freeway connects residents to downtown Detroit, the airport, and the rest of the metro area with ease.",
    ],
    lifestyle: [
      { title: "Business hub", description: "A major Metro Detroit office center with corporate towers and Town Center." },
      { title: "Central location", description: "Quick access via the Lodge, I-696, and the Southfield Freeway." },
      { title: "Varied housing", description: "From condos and apartments to established single-family homes." },
      { title: "Everyday convenience", description: "Close to shopping, dining, and the wider metro area." },
    ],
    relocation: false,
    faqs: [
      { q: "Why is Southfield, MI popular?", a: "Southfield is known as a central business hub with excellent freeway access and a convenient mix of housing options." },
      { q: "What kind of homes are in Southfield?", a: "A practical range, from condos and apartments to ranches, colonials, and established single-family homes. We can help you find the right fit." },
      { q: "What makes Southfield convenient?", a: "Its central location and quick access via the Lodge, I-696, and the Southfield Freeway connect you to Detroit, the airport, and the whole metro area." },
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
  // Brokerage office address ... used where brokerage info is appropriate
  // (footer, contact, legal). Not displayed prominently on every page.
  officeStreet: "47720 Grand River Ave",
  officeCityStateZip: "Novi, MI 48374",
  phone: "313-529-5750",
  email: "charlotte@soldittoday.com",
  region: "Serving Southeast Michigan",
  serviceStatement:
    "Serving Southeast Michigan and Metro Detroit ... with local roots in Downriver.",
};
