/**
 * Resource articles (evergreen SEO content). Data-driven so new articles are a
 * single object here plus (optionally) publish: true.
 *
 * Content rules: real, helpful, fair-housing-safe. No fabricated figures. Where
 * program amounts vary, we describe the landscape and link to the verified /dpa
 * city pages and a free eligibility check rather than inventing specifics.
 */

export type ResourceSection = { heading?: string; body: string[] };

export type Resource = {
  slug: string;
  title: string; // H1
  navLabel: string; // short label on the hub card
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  lede: string; // hero description + article intro
  updated: string; // ISO date
  readMinutes: number;
  keyPoints?: string[];
  sections: ResourceSection[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
  publish: boolean; // false = shows as "coming soon" on the hub, not routed
};

export const resources: Resource[] = [
  {
    slug: "down-payment-assistance-michigan",
    title: "Down Payment Assistance in Michigan: How It Works",
    navLabel: "Down Payment Assistance in Michigan",
    metaTitle:
      "Down Payment Assistance in Michigan (2026 Guide) | SOLD IT TODAY",
    metaDescription:
      "How down payment assistance works in Metro Detroit and across Michigan: who qualifies, how much you can get, and how to check your eligibility. No cost, no credit check.",
    eyebrow: "Resource",
    lede: "Down payment assistance can cover most or all of the cash you need to buy your first home, and most people who qualify have no idea it exists. Here is a plain-English guide to how it works in Southeast Michigan.",
    updated: "2026-08-16",
    readMinutes: 6,
    keyPoints: [
      "Assistance can go toward your down payment and eligible closing costs.",
      "Many programs are forgivable, so if you stay in the home you never pay it back.",
      "Amounts range from a few thousand dollars up to $25,000 depending on the city.",
      "You do not need perfect credit or a large income to qualify.",
      "Checking your eligibility is free and does not affect your credit.",
    ],
    sections: [
      {
        body: [
          "One of the biggest myths in real estate is that you need a large pile of cash to buy a home. For many first-time buyers in Metro Detroit, that simply is not true. Down payment assistance programs exist specifically to help cover the down payment and closing costs, and they are one of the most underused tools in Michigan real estate.",
          "The catch is that most buyers never hear about them. Programs are run by different cities, counties, and state agencies, each with its own rules, and there is no single place that lists them all clearly. This guide breaks down how they work so you can see whether they could help you.",
        ],
      },
      {
        heading: "What down payment assistance actually is",
        body: [
          "Down payment assistance (often shortened to DPA) is money that helps cover your down payment and eligible closing costs when you buy a home. It usually comes in one of two forms:",
          "A forgivable second mortgage. This is the most common. The assistance is recorded as a small second loan, and if you live in the home for a set number of years, it is forgiven and you never pay it back. Many Michigan programs forgive assistance under $15,000 over five years, and larger amounts over ten years.",
          "A grant. Less common, but some programs provide funds that do not need to be repaid at all as long as you meet the program terms.",
          "The important takeaway: this is not a personal loan, and in most cases it is not money you pay back if you stay in your home.",
        ],
      },
      {
        heading: "The two layers of assistance in Michigan",
        body: [
          "Statewide programs. Michigan's state housing agency (MSHDA) offers down payment assistance alongside its home loan programs. These are available across the state to eligible buyers and are a good starting point for many first-time buyers.",
          "Local city and county programs. This is where the larger dollars often are. Individual cities and counties run their own assistance programs, funded locally and administered by nonprofit housing organizations. Amounts and rules vary by city, and some of the strongest programs are right here in our area.",
          "We keep verified, up-to-date pages for the local programs we work with most, including Detroit, Wayne County, Taylor, Lincoln Park, Livonia, Westland, and Pontiac. You can see the current amounts and rules on our down payment assistance pages.",
        ],
      },
      {
        heading: "How much can you actually get",
        body: [
          "It depends entirely on the program. Statewide assistance is typically a few thousand dollars. Local city programs are often larger, ranging from around $14,999 up to $25,000 in some cities like Detroit.",
          "Because the amount is tied to where you buy and which program you use, the honest answer is: it varies, and the only way to know your number is to check the programs that apply to your situation. That is exactly what we help with, at no cost.",
        ],
      },
      {
        heading: "Who typically qualifies",
        body: [
          "Every program has its own rules, but most share a similar set of requirements:",
          "First-time buyer status, which usually means you have not owned a home in the past three years. You also generally need to plan to live in the home as your primary residence.",
          "Household income at or below a set limit for your family size (based on the area's median income), and often a cap on how much cash you have in the bank.",
          "Completion of a homebuyer education course, which we can point you to.",
          "You do not need a 20% down payment, and you do not need perfect credit. Many buyers who assume they cannot qualify actually can.",
        ],
      },
      {
        heading: "How to find out what you qualify for",
        body: [
          "The fastest way is a free eligibility check. You answer a few quick questions, and we tell you straight which programs you may be eligible for and what could be standing in the way if you are not.",
          "It costs nothing, there is no obligation, and it does not affect your credit. Start with our down payment assistance pages, or reach out and we will walk you through your options for your specific city.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I have to pay down payment assistance back?",
        a: "Usually not, if you stay in the home. Most Michigan programs are forgivable second mortgages: live in the home for the required period (often five years for smaller amounts and ten years for larger ones) and the assistance is forgiven. Some programs are outright grants that are never repaid.",
      },
      {
        q: "How much down payment assistance can I get in Metro Detroit?",
        a: "It varies by program and city. Statewide assistance is typically a few thousand dollars, while local city programs often range from about $14,999 up to $25,000 in cities like Detroit. The only way to know your number is to check the specific programs that apply to where you are buying.",
      },
      {
        q: "Do I need to be a first-time buyer?",
        a: "For most programs, yes, but 'first-time buyer' usually just means you have not owned a home in the past three years. If that is you, you likely qualify on that requirement.",
      },
      {
        q: "Will checking my eligibility hurt my credit?",
        a: "No. A free eligibility check is just a few questions. It does not involve a credit pull and does not affect your credit score.",
      },
      {
        q: "Can I use down payment assistance with an FHA loan?",
        a: "Often, yes. Down payment assistance is designed to pair with common first-time buyer mortgages. We can help you line up assistance with the right loan for your situation.",
      },
      {
        q: "Is down payment assistance only for very low incomes?",
        a: "No. Income limits are based on your area's median income and household size, and they are higher than most people expect. Plenty of working households qualify.",
      },
    ],
    related: [
      { label: "See down payment assistance by city", href: "/dpa" },
      { label: "First-Time Buyers", href: "/first-time-buyers" },
      { label: "Buyers", href: "/buyers" },
      { label: "Communities", href: "/communities" },
    ],
    publish: true,
  },

  // --- Upcoming (shown as "coming soon" on the hub until written) ---
  {
    slug: "first-time-home-buyer-michigan",
    title: "The First-Time Home Buyer Guide for Southeast Michigan",
    navLabel: "First-Time Home Buyer Guide",
    metaTitle: "First-Time Home Buyer Guide (Southeast Michigan) | SOLD IT TODAY",
    metaDescription:
      "A step-by-step first-time home buyer guide for Metro Detroit and Downriver: budgeting, credit, loans, down payment assistance, and what to expect at closing.",
    eyebrow: "Resource",
    lede: "Buying your first home in Southeast Michigan is more doable than most people think. Here is the whole process in plain English, step by step.",
    updated: "2026-08-16",
    readMinutes: 7,
    keyPoints: [
      "You may need far less cash than you think, especially with down payment assistance.",
      "Get pre-approved first: it sets your real budget and makes your offers stronger.",
      "Your credit matters, but you do not need perfect credit to buy.",
      "Closing costs are separate from your down payment, so plan for both.",
      "In most cases, a buyer's agent costs you nothing out of pocket.",
    ],
    sections: [
      {
        body: [
          "If you have never bought a home before, the process can feel like a black box. It does not have to. Below is the same path we walk every first-time buyer through, from the first conversation to getting the keys.",
        ],
      },
      {
        heading: "Step 1: Get pre-approved and learn your real budget",
        body: [
          "Before you look at a single home, talk to a lender and get pre-approved. This tells you what you can actually afford, what your monthly payment would look like, and how much cash you will need. It also makes your offers far stronger, because sellers take pre-approved buyers seriously.",
          "Pre-approval is not a commitment, and it is worth doing early. If your credit or budget is not quite there yet, this is where we build a plan to get you ready.",
        ],
      },
      {
        heading: "Step 2: Know what you actually need to bring",
        body: [
          "There are two separate buckets of cash: your down payment and your closing costs. The good news is that many first-time buyers do not need a 20% down payment. Loan programs like FHA allow as little as 3.5% down, and down payment assistance can cover much or all of that, plus part of your closing costs.",
          "That combination is why so many people who assume they cannot afford to buy actually can. The key is knowing which programs you qualify for.",
        ],
      },
      {
        heading: "Step 3: Strengthen your position",
        body: [
          "A few moves make a real difference: check your credit and clean up any errors, avoid opening new debt before you buy, and keep your income and bank statements steady and documented.",
          "This is also the stage to line up down payment assistance and first-time buyer programs so the money is ready when you find the right home.",
        ],
      },
      {
        heading: "Step 4: Find the home and make a strong offer",
        body: [
          "Once you know your budget and your programs, the fun part begins. We help you focus on homes that fit your goals and your financing, then structure an offer that is competitive without overpaying. In a first-time purchase, small details in the offer can save you real money and stress.",
        ],
      },
      {
        heading: "Step 5: From accepted offer to closing",
        body: [
          "After your offer is accepted, you will typically have an inspection to understand the home's condition, an appraisal for your lender, and a final walkthrough before closing. We guide you through each step, keep the timeline on track, and make sure nothing catches you by surprise.",
          "At closing, you sign, you fund your down payment and closing costs, and you get the keys.",
        ],
      },
      {
        heading: "The most common first-time buyer mistakes",
        body: [
          "The big ones: shopping for homes before getting pre-approved, assuming you need 20% down, not asking about down payment assistance, and opening new credit or making big purchases before closing. Every one of these is avoidable with a little guidance up front.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much of a down payment do I really need?",
        a: "Often far less than 20%. FHA loans allow as little as 3.5% down, and down payment assistance can cover much or all of that. Many first-time buyers get in with very little out of pocket.",
      },
      {
        q: "How good does my credit need to be?",
        a: "You do not need perfect credit. Different loan programs have different minimums, and FHA loans in particular are more flexible. If your credit needs work, we help you build a plan to get ready.",
      },
      {
        q: "How long does buying a home take?",
        a: "Once you are pre-approved and actively looking, it commonly takes a few weeks to find the right home and about 30 to 45 days from accepted offer to closing.",
      },
      {
        q: "What does a buyer's agent cost me?",
        a: "In most transactions, working with a buyer's agent costs you nothing out of pocket. We will always be clear with you about how compensation works before you commit to anything.",
      },
      {
        q: "Can I buy a home if I have student loans or other debt?",
        a: "Often, yes. Lenders look at your overall debt compared to your income, not just whether you have debt. Many buyers with student loans qualify.",
      },
      {
        q: "Should I get pre-approved before looking at homes?",
        a: "Yes. Pre-approval tells you your real budget and makes your offers much stronger. It is the first step we recommend for every first-time buyer.",
      },
    ],
    related: [
      { label: "Down Payment Assistance in Michigan", href: "/resources/down-payment-assistance-michigan" },
      { label: "See assistance by city", href: "/dpa" },
      { label: "First-Time Buyers", href: "/first-time-buyers" },
      { label: "Buyers", href: "/buyers" },
    ],
    publish: true,
  },
  {
    slug: "fha-loans-michigan",
    title: "FHA Loans in Michigan: A First-Time Buyer's Primer",
    navLabel: "FHA Loans in Michigan",
    metaTitle: "FHA Loans in Michigan Explained | SOLD IT TODAY",
    metaDescription:
      "How FHA loans work for Michigan first-time buyers: down payment, credit, mortgage insurance, and how they pair with down payment assistance.",
    eyebrow: "Resource",
    lede: "FHA loans are one of the most popular ways first-time buyers get into a home with a low down payment. Here is what they are and who they are good for.",
    updated: "2026-08-16",
    readMinutes: 6,
    keyPoints: [
      "FHA loans allow a down payment as low as 3.5%.",
      "They are more flexible on credit than many conventional loans.",
      "FHA loans include mortgage insurance (an upfront and an annual amount).",
      "They pair well with down payment assistance.",
      "Loan limits vary by county.",
    ],
    sections: [
      {
        body: [
          "An FHA loan is a mortgage insured by the Federal Housing Administration. It is not a government handout; it is a regular loan from a regular lender, but because it is government-insured, lenders can offer more flexible terms. That is why FHA loans are a favorite for first-time and lower-down-payment buyers.",
        ],
      },
      {
        heading: "Low down payment and flexible credit",
        body: [
          "The headline feature is the low down payment: as little as 3.5% of the purchase price. FHA loans are also generally more forgiving on credit than conventional loans, which makes them a strong fit for buyers who are still building their credit history.",
          "This is also exactly why FHA loans pair so well with down payment assistance, which can cover much of that 3.5% and part of your closing costs.",
        ],
      },
      {
        heading: "The trade-off: mortgage insurance",
        body: [
          "In exchange for the low down payment, FHA loans include mortgage insurance. There are two pieces: an upfront amount that is usually rolled into the loan, and an annual amount that is split into your monthly payment.",
          "Mortgage insurance protects the lender, not you, and it is the main cost trade-off of an FHA loan. For many buyers it is well worth it to get into a home sooner, and there are paths to reduce or remove it later.",
        ],
      },
      {
        heading: "FHA loan limits in Michigan",
        body: [
          "FHA sets a maximum loan amount, and it varies by county. For most of Southeast Michigan the limit comfortably covers typical first-home price points, but it is worth confirming for your specific area and budget. We can check the current limit for the county you are buying in.",
        ],
      },
      {
        heading: "FHA vs conventional, the short version",
        body: [
          "Conventional loans can be a better fit if you have strong credit and a larger down payment, since you can often avoid the long-term mortgage insurance. FHA tends to win when your down payment is small or your credit is still improving.",
          "There is no single right answer; it depends on your numbers. We help you compare both so you pick the one that costs you less over the time you plan to own.",
        ],
      },
      {
        heading: "Pairing FHA with down payment assistance",
        body: [
          "This is the combination that gets a lot of first-time buyers into a home: an FHA loan for the low down payment and flexible credit, plus down payment assistance to cover much of the cash. See what assistance is available in your city on our down payment assistance pages.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much down payment do I need for an FHA loan?",
        a: "As little as 3.5% of the purchase price. And down payment assistance can often cover much of that, so your out-of-pocket cash can be very low.",
      },
      {
        q: "What credit do I need for an FHA loan?",
        a: "FHA loans are more flexible than many conventional loans, and different lenders set different minimums. If your credit needs work, we can help you build a plan to qualify.",
      },
      {
        q: "What is FHA mortgage insurance?",
        a: "It is a cost that comes with FHA loans in exchange for the low down payment. There is an upfront amount (usually added to the loan) and an annual amount split into your monthly payment. It protects the lender.",
      },
      {
        q: "Can I get rid of FHA mortgage insurance later?",
        a: "Often, yes. Depending on your loan and your equity, you may be able to refinance into a conventional loan later to remove it. We can talk through whether that path makes sense for you.",
      },
      {
        q: "Can I use down payment assistance with an FHA loan?",
        a: "Yes, and it is a common combination. Down payment assistance is designed to pair with first-time buyer loans like FHA to lower your cash to close.",
      },
      {
        q: "Is an FHA loan better than a conventional loan?",
        a: "It depends on your credit and down payment. FHA is often better with a small down payment or improving credit; conventional can be better with strong credit and more money down. We help you compare both.",
      },
    ],
    related: [
      { label: "Down Payment Assistance in Michigan", href: "/resources/down-payment-assistance-michigan" },
      { label: "See assistance by city", href: "/dpa" },
      { label: "First-Time Buyers", href: "/first-time-buyers" },
      { label: "Buyers", href: "/buyers" },
    ],
    publish: true,
  },
  {
    slug: "michigan-closing-costs",
    title: "Michigan Closing Costs: What Buyers and Sellers Really Pay",
    navLabel: "Michigan Closing Costs",
    metaTitle: "Michigan Closing Costs Explained | SOLD IT TODAY",
    metaDescription:
      "A plain-English breakdown of closing costs for Michigan buyers and sellers, and how down payment assistance can help cover them.",
    eyebrow: "Resource",
    lede: "Closing costs surprise a lot of first-time buyers and sellers. Here is a clear breakdown of what each side typically pays in Michigan, and how to lower them.",
    updated: "2026-08-16",
    readMinutes: 5,
    keyPoints: [
      "Buyers typically pay about 2% to 5% of the price in closing costs.",
      "Closing costs are separate from your down payment.",
      "Sellers customarily pay the real estate commission and Michigan transfer tax.",
      "Down payment assistance can often cover buyer closing costs.",
      "Seller concessions can help offset a buyer's costs.",
    ],
    sections: [
      {
        body: [
          "Closing costs are the fees and prepaid items due when your home purchase or sale is finalized. They are separate from your down payment, and they catch a lot of people off guard. Here is what actually goes into them.",
        ],
      },
      {
        heading: "What buyers typically pay",
        body: [
          "Buyer closing costs usually run about 2% to 5% of the purchase price and fall into a few groups: lender fees (loan origination and related charges), third-party services (appraisal, home inspection, title and settlement fees), and prepaid items that fund your escrow account (property taxes, homeowners insurance, and prepaid interest).",
          "The good news: much of this can be covered. Down payment assistance often applies to closing costs too, and you can sometimes negotiate seller concessions or lender credits to reduce what you bring to the table.",
        ],
      },
      {
        heading: "What sellers typically pay",
        body: [
          "On the sell side, the largest cost is usually the real estate commission. Sellers also customarily pay the Michigan transfer tax and, in many local transactions, the owner's title insurance policy for the buyer.",
          "The exact split of costs is negotiable and varies by deal, which is one reason having an agent who knows the local customs matters.",
        ],
      },
      {
        heading: "Michigan's transfer tax",
        body: [
          "Michigan charges a real estate transfer tax when a property changes hands, and it is customarily paid by the seller. It is made up of a state and a county piece, totaling roughly $8.60 per $1,000 of the sale price. On a $200,000 home, that is around $1,720.",
          "Rates and who pays can vary, so we always confirm the current numbers for your specific sale.",
        ],
      },
      {
        heading: "How to lower your closing costs",
        body: [
          "A few proven moves: use down payment assistance that also covers closing costs, ask for seller concessions (where the seller credits some of your costs), compare title and settlement fees, and ask your lender about credits. Small negotiations here can save you hundreds or thousands.",
        ],
      },
      {
        heading: "Down payment assistance and closing costs",
        body: [
          "This is a point many buyers miss: a lot of down payment assistance programs can be applied to your closing costs, not just your down payment. That can dramatically lower the total cash you need. See what is available in your city on our down payment assistance pages.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much are closing costs in Michigan?",
        a: "For buyers, typically about 2% to 5% of the purchase price. The exact amount depends on your loan, the home, and local fees. Sellers have their own costs, led by the commission and transfer tax.",
      },
      {
        q: "Are closing costs part of my down payment?",
        a: "No. They are separate. Your down payment is your equity in the home; closing costs are the fees and prepaid items due at closing. You plan for both, though assistance can help cover them.",
      },
      {
        q: "Who pays the transfer tax in Michigan?",
        a: "It is customarily paid by the seller. It totals roughly $8.60 per $1,000 of the sale price (a state and a county piece), though this is negotiable and we confirm current rates for each sale.",
      },
      {
        q: "Can down payment assistance cover my closing costs?",
        a: "Often, yes. Many programs apply to both your down payment and eligible closing costs, which can greatly reduce the cash you need to close. We can check the programs for your city.",
      },
      {
        q: "What are seller concessions?",
        a: "A seller concession is when the seller agrees to credit some of your closing costs as part of the deal. It is a common way to lower a buyer's cash to close, and we can negotiate for it where it makes sense.",
      },
      {
        q: "When do I pay closing costs?",
        a: "At closing, along with your down payment. You will get a detailed statement in advance showing exactly what is due, so there are no surprises on the day.",
      },
    ],
    related: [
      { label: "Down Payment Assistance in Michigan", href: "/resources/down-payment-assistance-michigan" },
      { label: "See assistance by city", href: "/dpa" },
      { label: "Buyers", href: "/buyers" },
      { label: "Sellers", href: "/sellers" },
    ],
    publish: true,
  },
];

export const publishedResources = resources.filter((r) => r.publish);
export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug && r.publish);
}
