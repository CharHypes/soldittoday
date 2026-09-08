/**
 * Blog / "Articles & Insights" ... dated posts (market updates, buyer/seller
 * education, relocation, neighborhood spotlights) that live alongside the
 * evergreen guides in lib/resources.
 *
 * DRAFTS: a post with `draft: true` is NOT listed in the public index and NOT in
 * the sitemap, and its page is noindexed with a visible "Draft" banner ... but it
 * IS reachable at its URL so it can be reviewed before publishing. Flip `draft`
 * to false (and set a real `date`) to publish. Nothing here is fabricated: no
 * invented statistics and no made-up client stories.
 */
import { publishedResources } from "./resources";

export type BlogSection = { heading?: string; body: string[] };

export type BlogCategory =
  | "Buying"
  | "Selling"
  | "Relocation"
  | "Market Update"
  | "Neighborhood Spotlight"
  | "Michigan Real Estate";

export type BlogPost = {
  slug: string;
  title: string;
  category: BlogCategory;
  /** ISO date shown on the card and used to order the feed. */
  date: string;
  readMinutes: number;
  /** One-line summary for cards + the article intro. */
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keyPoints?: string[];
  sections: BlogSection[];
  faqs?: { q: string; a: string }[];
  related?: { label: string; href: string }[];
  /** true = unpublished (hidden from index/sitemap, noindexed, reviewable by URL). */
  draft: boolean;
};

export const posts: BlogPost[] = [
  /* ------------------------------------------------------------------ */
  /*  DRAFT ... pending Charlotte's review/approval                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "what-michigan-buyers-should-know-before-a-home-search",
    title: "What Michigan Buyers Should Know Before Starting a Home Search",
    category: "Buying",
    date: "2026-09-08",
    readMinutes: 6,
    excerpt:
      "A little groundwork before you tour makes the whole search calmer and faster. Here is what we walk every Michigan buyer through first.",
    metaTitle:
      "What Michigan Buyers Should Know Before a Home Search | Sold It Today",
    metaDescription:
      "Before you tour homes in Michigan, get pre-approved, understand your true monthly cost, and know the local details: property taxes, wells and septic, and waterfront. A buyer's starting guide from the Sold It Today team.",
    keyPoints: [
      "Get pre-approved before you tour, so you have a clearer budget and a stronger offer.",
      "Plan around the full monthly payment, not just the price. Taxes, insurance, and PMI all count.",
      "In Michigan, a home's taxable value can 'uncap' when it sells, so the taxes you pay may differ from the seller's.",
      "Rural and lakefront homes bring their own checks, like wells, septic systems, and waterfront rights.",
    ],
    sections: [
      {
        body: [
          "In our experience, buyers who prepare before the first showing tend to have a smoother search. It is not about rushing. It is about knowing your numbers and your priorities, so when the right home shows up you can move with confidence instead of scrambling.",
          "Here is the groundwork we help buyers put in place first.",
        ],
      },
      {
        heading: "Start with pre-approval, not with listings",
        body: [
          "It is tempting to jump straight to browsing homes, but a mortgage pre-approval is the more useful first step. A lender reviews your financial profile and gives you a clearer idea of the loan amount and terms you may qualify for. That turns a fuzzy budget into a working one.",
          "Pre-approval also matters once you find a home you love. When things are competitive, a seller tends to take an offer more seriously if it comes with a lender letter. If you would like introductions, we keep a short list of local lenders we trust on our Preferred Partners page.",
        ],
      },
      {
        heading: "Budget for the full monthly payment",
        body: [
          "The list price is only part of the picture. Your monthly payment includes principal and interest, property taxes, and homeowner's insurance. If your down payment is under 20 percent, it usually includes private mortgage insurance (PMI) too. Together those pieces are often called PITI.",
          "We usually suggest starting from the monthly number that feels comfortable and working back to a price range, rather than falling for a price that stretches the budget every month. Our mortgage and affordability calculators are a good place to run those numbers before you tour.",
        ],
      },
      {
        heading: "Know the Michigan details that surprise out-of-state buyers",
        body: [
          "Property taxes here deserve a close look. Under Michigan law, a property's taxable value is capped year to year while you own it, but it can 'uncap' and reset when the home is sold. Your first tax bill may be higher than what the current owner pays, so it is worth estimating taxes based on the sale price, not the seller's current bill.",
          "Looking outside the city, in more rural areas or on acreage, you will find homes that run on a private well and a septic system instead of municipal water and sewer. That is perfectly normal here. It just means a couple of extra inspections worth budgeting for.",
          "Waterfront and lake-access homes are part of what makes Michigan special. They come with a few things worth understanding early, like how the water frontage and access are described and what upkeep the setting involves.",
        ],
      },
      {
        heading: "Build your team before you need it",
        body: [
          "A good search runs on a few relationships: your agent, your lender, and later an inspector and a title company. Line those up early, and when you are ready to write an offer, no one is starting from scratch.",
          "That is a big part of what we do. We help you get pre-approved, sort your must-haves from your nice-to-haves, and set up a search that surfaces the right homes instead of everything on the market.",
        ],
      },
      {
        heading: "Your next step",
        body: [
          "If you are early in the process, start by getting pre-approved and pinning down your comfortable monthly number. When you are ready to look, we will help you focus the search and see homes that actually fit.",
          "Questions about a specific area or price range? Reach out any time ... we are glad to talk it through, no pressure.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to buy a home in Michigan?",
        a: "It varies with your situation and the market. Once you are pre-approved and clear on what you want, many buyers find and close on a home over a couple of months. Getting pre-approved up front is one of the biggest things that keeps the timeline predictable.",
      },
      {
        q: "How much do I need for a down payment?",
        a: "It depends on the loan program. Some buyers put down 20 percent to avoid PMI, but many use lower-down-payment programs, and Michigan buyers may qualify for down payment assistance. Our down payment assistance guide and calculators walk through the options.",
      },
    ],
    related: [
      { label: "First-time buyer guide", href: "/resources/first-time-home-buyer-michigan" },
      { label: "Down payment assistance", href: "/resources/down-payment-assistance-michigan" },
      { label: "Affordability calculator", href: "/resources/affordability-calculator" },
      { label: "Start a home search", href: "/search" },
    ],
    draft: true,
  },

  {
    slug: "what-to-do-before-you-list-your-home",
    title: "What to Do Before You List Your Home in Today's Market",
    category: "Selling",
    date: "2026-09-08",
    readMinutes: 6,
    excerpt:
      "Pricing, prep, and presentation shape how your sale goes. Here is the checklist we walk sellers through before a home ever hits the market.",
    metaTitle:
      "What to Do Before You List Your Home | Sold It Today",
    metaDescription:
      "Before listing your Michigan home, get the pricing conversation right, handle pre-listing prep, and plan for strong photos and required disclosures. A seller's preparation guide from the Sold It Today team.",
    keyPoints: [
      "Price from recent comparable sales, not from a hoped-for number.",
      "Handle the small repairs and decluttering buyers notice before photos, not after.",
      "Most buyers meet your home online first, so photography and presentation carry real weight.",
      "Michigan sellers complete a Seller's Disclosure Statement, so start on it early.",
    ],
    sections: [
      {
        body: [
          "A strong sale often takes shape before the sign ever goes in the yard. The three things most within your control, pricing, preparation, and presentation, are the ones worth getting right up front.",
          "Here is the checklist we walk through with sellers.",
        ],
      },
      {
        heading: "Get the pricing conversation right",
        body: [
          "Pricing is one of the biggest factors in how a sale unfolds. Overpricing can reduce early interest, increase days on market, and sometimes lead to later price adjustments. Price it well and you draw more attention early, when it counts most.",
          "The right price comes from recent, genuinely comparable sales near you: similar size, condition, and location. It does not come from a round number or whatever a neighbor happened to list at. We will put that comparison together for your home and talk honestly about where it lands.",
          "We also look at the likely net, not just the headline sale price, so you can weigh pricing, concessions, repairs, and timing together.",
        ],
      },
      {
        heading: "Handle pre-listing prep",
        body: [
          "Before photos and showings, it pays to take care of the things buyers notice: minor repairs, a deep clean, decluttering, and simple curb appeal. You do not need a full renovation. You need the home to feel cared for and easy to picture living in.",
          "Decluttering and depersonalizing help buyers imagine themselves in the space. The small stuff matters too. A sticking door, a burned-out bulb, or a leaky faucet quietly tells a buyer whether a home has been well maintained.",
        ],
      },
      {
        heading: "Plan for how buyers actually see your home",
        body: [
          "For almost every buyer, the first showing happens online. Professional-quality photos and a clean, well-lit presentation are what earn the in-person visit.",
          "When we list a home, presentation is a core part of the plan, not an afterthought. Strong photos, an accurate and appealing description, and wide syndication to the major sites are how we get your home in front of the right buyers.",
        ],
      },
      {
        heading: "Prepare for disclosures and paperwork",
        body: [
          "Michigan sellers of most residential homes complete a Seller's Disclosure Statement about the property's known condition. It is easier to fill out thoughtfully before you are juggling an accepted offer, so it helps to start gathering that information early.",
          "Keeping your records handy, like recent improvements, warranties, and utility information, makes the whole process smoother and gives buyers more confidence.",
        ],
      },
      {
        heading: "Your next step",
        body: [
          "If you are thinking about selling, the best first move is a realistic pricing conversation and a walk-through of what, if anything, is worth doing before you list. There is no obligation, and you will come away with a clear picture of your options.",
          "Reach out whenever you are ready ... we will tell you honestly what we would do if it were our home.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I make repairs before selling?",
        a: "Usually the high-value moves are small: minor repairs, cleaning, decluttering, and curb appeal. Larger projects are worth it only when they clearly pay off in your market, which is something we will assess together before you spend money.",
      },
      {
        q: "When is the best time to list in Michigan?",
        a: "There are seasonal patterns, but the right timing also depends on your home, your goals, and current conditions. We look at all of that together rather than relying on a single rule of thumb.",
      },
    ],
    related: [
      { label: "Selling with our team", href: "/sellers" },
      { label: "Michigan closing costs", href: "/resources/michigan-closing-costs" },
      { label: "Meet Charlotte", href: "/meet-charlotte" },
    ],
    draft: true,
  },

  {
    slug: "relocating-to-metro-detroit-and-downriver",
    title: "Relocating to Metro Detroit and Downriver: A Local Orientation",
    category: "Relocation",
    date: "2026-09-08",
    readMinutes: 7,
    excerpt:
      "Moving to the Detroit area from out of state or across Michigan? Here is a grounded orientation to Downriver and the Metro Detroit suburbs, and how to buy from a distance.",
    metaTitle:
      "Relocating to Metro Detroit and Downriver | Sold It Today",
    metaDescription:
      "A local orientation for anyone relocating to Metro Detroit or the Downriver communities: how the areas fit together, what to weigh in a move, and how to buy confidently from out of town. From the Sold It Today team.",
    keyPoints: [
      "Downriver refers to the communities along the Detroit River south of Detroit, a set of distinct, tight-knit towns.",
      "The broader Metro Detroit suburbs stretch across Wayne, Oakland, and Macomb counties, each with its own character.",
      "Commute, schools, and everyday amenities usually matter more than a single 'best' town.",
      "You can buy confidently from a distance with the right local team and video tours.",
    ],
    sections: [
      {
        body: [
          "Relocating is exciting, and a little overwhelming ... especially when you are learning a whole region from the outside. Whether you are moving across the country or across the state, this is a grounded orientation to the area we call home, and how a move here tends to go.",
        ],
      },
      {
        heading: "How the area fits together",
        body: [
          "'Metro Detroit' is a large region spanning several counties, with Detroit at the center and a wide ring of suburbs around it. Rather than one uniform market, it is a collection of communities, each with its own feel, price range, and daily rhythm.",
          "'Downriver' is the nickname for the communities along the Detroit River, south of the city: towns such as Wyandotte, Trenton, Riverview, Southgate, Taylor, and their neighbors. Many communities have established downtowns, neighborhood centers, and strong community identity, along with a real connection to the river. It is where our team has deep local roots.",
          "Further out, the suburbs across Wayne, Oakland, and Macomb counties each carry their own character, from historic downtowns to newer developments. Part of our job in a relocation is helping you translate 'what I want in daily life' into the specific communities that deliver it.",
        ],
      },
      {
        heading: "What to weigh in a move",
        body: [
          "Instead of chasing a single 'best' town, it helps to rank what matters to your household: commute to work or family, the feel of a neighborhood, everyday amenities, and how far your budget goes. Two communities a few minutes apart can feel surprisingly different.",
          "This is where our QWOME proximity tools come in. You can search for homes by how close they are to the places you actually use, like hospitals, schools, and groceries, instead of guessing from a map.",
        ],
      },
      {
        heading: "Buying from a distance",
        body: [
          "Many of the people we help relocate buy before they have spent much time here. That works well with the right setup: a clear picture of your priorities, a local agent who can be your eyes on the ground, live video tours, and a lender who can move when you find the right home.",
          "Relocation is a regular part of our work. We can preview homes for you, walk you through them on video, and give you honest, on-the-ground context about a street or a community that photos never capture.",
        ],
      },
      {
        heading: "Rent first, or buy now?",
        body: [
          "There is no single right answer. Renting for a season can be a comfortable way to get to know an area before you commit. Buying sooner can make sense when you are confident about the location and want to begin building equity sooner. We will talk through the trade-offs for your situation without pushing you either way.",
        ],
      },
      {
        heading: "Your next step",
        body: [
          "If a move to the area is on your horizon, the best first step is a conversation about what your ideal daily life looks like. From there we can point you toward the communities that fit and set up a search that respects your priorities.",
          "Reach out any time. Helping people land in the right community is one of our favorite parts of the job.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you help me buy if I can't visit in person yet?",
        a: "Yes. We regularly help buyers who are relocating from out of state. We preview homes, host live video tours, and give you honest local context so you can make a confident decision from a distance.",
      },
      {
        q: "Which Downriver or Metro Detroit community is right for me?",
        a: "It depends on your commute, budget, and the daily life you want. Rather than name a single 'best' town, we help you match your priorities to specific communities, including how close homes are to the places you use most.",
      },
    ],
    related: [
      { label: "Relocation", href: "/relocation" },
      { label: "Explore communities", href: "/communities" },
      { label: "Search homes", href: "/search" },
    ],
    draft: true,
  },
];

/* ---------------------------------------------------------------------- */
/*  Helpers                                                                */
/* ---------------------------------------------------------------------- */

/** Live posts only (drafts hidden), newest first. */
export const publishedPosts = posts
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** A normalized card for the unified "Articles & Insights" library. */
export type LibraryItem = {
  type: "post" | "guide";
  label: string; // category (posts) or "Guide"
  title: string;
  excerpt: string;
  href: string;
  date: string; // ISO ... for ordering + display
  readMinutes: number;
};

/**
 * The unified library: published blog posts + the evergreen guides, newest
 * first. Guides keep their own /resources/[slug] URLs (no content duplication).
 */
export function libraryItems(): LibraryItem[] {
  const postItems: LibraryItem[] = publishedPosts.map((p) => ({
    type: "post",
    label: p.category,
    title: p.title,
    excerpt: p.excerpt,
    href: `/blog/${p.slug}`,
    date: p.date,
    readMinutes: p.readMinutes,
  }));

  const guideItems: LibraryItem[] = publishedResources.map((r) => ({
    type: "guide",
    label: "Guide",
    title: r.navLabel,
    excerpt: r.lede,
    href: `/resources/${r.slug}`,
    date: r.updated,
    readMinutes: r.readMinutes,
  }));

  return [...postItems, ...guideItems].sort((a, b) => (a.date < b.date ? 1 : -1));
}
