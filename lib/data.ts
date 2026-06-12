// Centralized placeholder data for SOLD IT TODAY.
// Swap these arrays for a CMS or API later — the components read from here.

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Listings", href: "#listings" },
  { label: "Contact", href: "#contact" },
];

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "19+", label: "Years of experience" },
  { value: "350+", label: "Homes sold" },
  { value: "100%", label: "Client-first focus" },
  { value: "SE MI", label: "Local market depth" },
];

export type Service = {
  id: string;
  title: string;
  description: string;
  points: string[];
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
  },
];

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

// Placeholder property imagery (Unsplash) — replace with real listings later.
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
      "Nearly two decades of deals sharpen one thing: protecting your position when it matters most.",
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

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Charlotte made selling our home feel effortless. Her pricing strategy was spot-on and we closed above asking with multiple offers.",
    name: "Megan & Ryan T.",
    role: "Sellers — Trenton",
  },
  {
    id: "t2",
    quote:
      "As first-time buyers we were nervous, but she walked us through every step with patience and total honesty. We never felt rushed.",
    name: "Daniel P.",
    role: "First-Time Buyer — Detroit",
  },
  {
    id: "t3",
    quote:
      "Her negotiation saved us thousands. Charlotte knows this market cold and fought for our interests the entire way.",
    name: "Alicia R.",
    role: "Buyer — Dearborn",
  },
  {
    id: "t4",
    quote:
      "We've worked with Charlotte on three investment properties now. Clear numbers, sharp advice, and results every time.",
    name: "James & Carol M.",
    role: "Investors — Metro Detroit",
  },
];

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

export const contact = {
  agent: "Charlotte Hypes",
  title: "REALTOR® & Team Lead",
  brokerage: "Remerica United Realty",
  phone: "313-529-5750",
  email: "charlotte@soldittoday.com",
  region: "Serving Southeast Michigan",
};
