# SOLD IT TODAY — Content Architecture & SEO / AI Discoverability Strategy

> **Status:** PROPOSAL — for review & approval before any pages are built.
> **Scope:** Information architecture, sitemap, URL structure, internal linking,
> Ask Charlotte AI™ knowledge center + lead capture, SEO, AI discoverability,
> and local SEO. No pages are created by this document.

Brand facts this architecture is built on:
- **Agent/brand:** Charlotte Hypes · Founder & Team Lead · SOLD IT TODAY
- **Brokerage (NAP):** Remerica United Realty · 47720 Grand River Ave, Novi, MI 48374
- **Service area:** Downriver (local roots) + Metro Detroit + wider Southeast Michigan
- **Credibility:** 19+ years · 350+ homes sold · Circle of Excellence recipient
- **Differentiators:** down payment assistance, credit guidance, first-time buyers,
  investment/new construction, estate & divorce situations, education-first approach
- **Reviews:** Zillow profile (`zillow.com/profile/CharlotteHypes`)

---

## 1. Page Hierarchy (depth = clicks from Home)

```
L0  Home (/)
│
├─ L1  CORE / MONEY PAGES  (primary nav + footer)
│   ├─ Meet Charlotte            /meet-charlotte
│   ├─ Meet the Team             /team                    [exists]
│   ├─ Buyers                    /buyers                  ◄ pillar
│   ├─ Sellers                   /sellers                 ◄ pillar
│   ├─ First-Time Buyers         /first-time-buyers
│   ├─ Investment Properties     /investment-properties
│   ├─ Relocation                /relocation
│   ├─ Contact                   /contact
│   ├─ Ask Charlotte AI™         /ask-charlotte           ◄ AI hub + lead capture
│   ├─ Communities (city hub)    /communities             [rename of /service-areas]
│   ├─ Resources (hub)           /resources               [exists]
│   └─ Blog (hub)                /blog
│
├─ L2  LOCAL / CONTENT (linked from the hubs above)
│   ├─ City pages                /communities/[city]-mi          (×19)
│   ├─ Resource articles         /resources/[slug]               (×10)
│   ├─ Neighborhood guides       /neighborhood-guides/[slug]     [hub exists]
│   ├─ Blog posts                /blog/[post-slug]
│   └─ Blog category archives    /blog/category/[category]       (×6)
│
└─ SUPPORTING
    ├─ Preferred Partners        /preferred-partners      [exists]
    ├─ Privacy / Accessibility / Fair Housing  /legal/*
    └─ sitemap.xml · robots.txt · llms.txt
```

**Rule:** every important page stays **≤ 3 clicks from Home**. Pillars (Buyers,
Sellers, Communities, Resources) sit at L1 and feed everything below.

---

## 2. Recommended URL Structure

Principles: lowercase, hyphenated, keyword-rich, shallow, stable (never change a
published URL without a 301), `-mi` suffix on city slugs for local relevance.

### Core pages
| Page | URL |
|---|---|
| Home | `/` |
| Meet Charlotte | `/meet-charlotte` |
| Meet the Team | `/team` *(exists)* |
| Buyers | `/buyers` |
| Sellers | `/sellers` |
| First-Time Buyers | `/first-time-buyers` |
| Investment Properties | `/investment-properties` |
| Relocation | `/relocation` |
| Contact | `/contact` |
| Ask Charlotte AI™ | `/ask-charlotte` |

### City pages — hub + 19 spokes
Hub: `/communities` *(repurpose the existing `/service-areas` scaffold; 301
`/service-areas → /communities`).* Spoke slug = `[city]-mi`.

| Priority tier | Cities (slug) |
|---|---|
| **Tier 1 — Downriver core** | riverview-mi, trenton-mi, wyandotte-mi, southgate-mi, taylor-mi, allen-park-mi, brownstown-mi, woodhaven-mi, flat-rock-mi, grosse-ile-mi |
| **Tier 2 — Dearborn area** | dearborn-mi, dearborn-heights-mi |
| **Tier 3 — NW Metro / Oakland-Wayne** | novi-mi, northville-mi, livonia-mi, canton-mi, plymouth-mi, farmington-hills-mi, commerce-township-mi |

Example: `/communities/riverview-mi`

### Resource pages — hub + 10 articles
Hub: `/resources` *(exists)*. Slugs:
```
/resources/fha-loans-michigan
/resources/va-loans-michigan
/resources/down-payment-assistance-michigan
/resources/buying-after-bankruptcy
/resources/buying-after-foreclosure
/resources/michigan-closing-costs
/resources/selling-an-estate-property
/resources/divorce-and-real-estate
/resources/new-construction-guide
/resources/investment-property-guide
```

### Blog
```
/blog                              Hub (latest + featured)
/blog/[post-slug]                  Flat post URLs (best for SEO portability)
/blog/category/market-updates
/blog/category/buyer-education
/blog/category/seller-education
/blog/category/neighborhood-spotlights
/blog/category/mortgage-financing
/blog/category/local-community
```

> **Why flat blog post URLs?** Keeps a post's URL stable even if it's recategorized,
> and avoids keyword dilution from a nested category segment. Category archives still
> exist for internal linking and topical authority.

> **Resources vs. Blog vs. Neighborhood Guides — the line:**
> - **Resources** = evergreen, transactional "how-to" pillars (FHA, DPA, closing costs).
> - **Blog** = dated/editorial (market updates, spotlights, community).
> - **Neighborhood Guides** = evergreen sub-area pages (e.g., a neighborhood inside a
>   city) that support and interlink with the city pages.

---

## 3. Complete Site Map (master table)

| # | Page | URL | Type | Priority | Primary keyword target | Schema |
|---|---|---|---|---|---|---|
| 1 | Home | `/` | Core | P0 | southeast michigan real estate / sold it today | RealEstateAgent, WebSite, Organization |
| 2 | Meet Charlotte | `/meet-charlotte` | Core | P0 | charlotte hypes realtor | Person, RealEstateAgent |
| 3 | Meet the Team | `/team` | Core | P1 | sold it today team / southeast michigan realtors | Organization, Person[] |
| 4 | Buyers | `/buyers` | Pillar | P0 | buy a home southeast michigan | Service, FAQPage |
| 5 | Sellers | `/sellers` | Pillar | P0 | sell my house southeast michigan | Service, FAQPage |
| 6 | First-Time Buyers | `/first-time-buyers` | Core | P0 | first time home buyer michigan | Service, FAQPage |
| 7 | Investment Properties | `/investment-properties` | Core | P1 | investment property metro detroit | Service, FAQPage |
| 8 | Relocation | `/relocation` | Core | P1 | relocating to metro detroit | Service, FAQPage |
| 9 | Contact | `/contact` | Core | P0 | contact charlotte hypes | ContactPage, RealEstateAgent |
| 10 | Ask Charlotte AI™ | `/ask-charlotte` | Feature | P0 | ask a realtor / real estate questions michigan | FAQPage, WebApplication |
| 11 | Communities hub | `/communities` | Hub | P0 | southeast michigan communities / cities served | CollectionPage, Place[] |
| 12–30 | City pages (×19) | `/communities/[city]-mi` | Local | P0–P2 | homes for sale in [city] mi | Place, RealEstateAgent(areaServed), FAQPage |
| 31 | Resources hub | `/resources` | Hub | P1 | michigan home buying resources | CollectionPage |
| 32–41 | Resource articles (×10) | `/resources/[slug]` | Resource | P0–P1 | e.g. down payment assistance michigan | Article, FAQPage, HowTo |
| 42 | Blog hub | `/blog` | Hub | P1 | southeast michigan real estate blog | Blog |
| 43+ | Blog posts | `/blog/[slug]` | Content | P2 | long-tail per post | Article/BlogPosting |
| — | Blog categories (×6) | `/blog/category/[c]` | Taxonomy | P2 | [category] keywords | CollectionPage |
| — | Neighborhood guides | `/neighborhood-guides/[slug]` | Local | P2 | [neighborhood] homes | Place, Article |
| — | Preferred Partners | `/preferred-partners` | Support | P2 | trusted lenders / title southeast michigan | CollectionPage |
| — | Legal | `/legal/*` | Support | P3 | — | WebPage |

Priority key: **P0** launch-critical · **P1** phase 2 · **P2** ongoing · **P3** compliance.

---

## 4. Internal Linking Strategy (hub-and-spoke + contextual mesh)

### 4.1 Pillar → spoke flows
```
BUYERS (pillar)
  ├─► First-Time Buyers ─► DPA Michigan, FHA Michigan, Closing Costs, After Bankruptcy/Foreclosure
  ├─► Investment Properties ─► Investment Property Guide, New Construction Guide
  ├─► Relocation ─► city pages (target cities), Neighborhood Guides
  └─► every city page (as the buyer agent for that city)

SELLERS (pillar)
  ├─► Selling an Estate Property, Divorce and Real Estate, Closing Costs
  ├─► "What's my home worth" (Ask Charlotte / valuation lead magnet)
  └─► every city page (as the listing agent for that city)

COMMUNITIES (hub) ──► 19 city pages ──► back to hub + sibling cities (nearby) +
        relevant Buyers/Sellers + Neighborhood Guides + local blog posts

RESOURCES (hub) ──► 10 articles ──► each links to the matching service page
        (e.g. DPA → First-Time Buyers) + 2–3 sibling resources + a city page

BLOG (hub) ──► posts ──► the service/city/resource page they support (never orphaned)
```

### 4.2 Cross-linking rules (apply to every page)
1. **One primary CTA** above the fold → Contact / Schedule a Consultation.
2. **Ask Charlotte AI™** entry point present on every page (widget + inline).
3. **3–5 contextual in-content links** to genuinely related pages (no link dumps).
4. **Breadcrumbs** on every non-home page (`Home › Communities › Riverview, MI`).
5. **"Related" block** at the bottom (siblings + parent hub).
6. **Author byline** linking to `/meet-charlotte` on every resource/blog article (E-E-A-T).
7. **City pages** link to the 2–3 *geographically nearest* cities (silo cohesion),
   not all 19 (avoid sitewide link bloat).
8. Footer = persistent links to all hubs + top cities (already partially in place).

### 4.3 Anchor text
Descriptive, varied, keyword-aware but natural — e.g. "down payment assistance in
Michigan", "homes for sale in Wyandotte", "selling an inherited home" — never "click here".

---

## 5. Ask Charlotte AI™ — Knowledge Center & Lead-Capture Strategy

A branded assistant that (a) answers real estate questions in Charlotte's voice,
(b) doubles as SEO-rich FAQ content, and (c) captures and qualifies leads.

### 5.1 Placement & format
- **Persistent launcher** (corner widget) on all pages → opens a chat panel.
- **Dedicated hub** `/ask-charlotte` — a browsable knowledge center (also the AI's
  source content) organized by the five audiences below. Every Q&A is real HTML with
  **FAQPage schema**, so it ranks *and* feeds the assistant.
- **Inline prompts** on relevant pages ("Ask Charlotte: Do I qualify for down payment
  assistance?").

### 5.2 Knowledge taxonomy (5 audiences → topic clusters)
| Audience | Core questions the KB answers | Primary lead magnet | Primary CTA |
|---|---|---|---|
| **Buyers** | How much can I afford? What's the process? How are you paid? | "Buyer Readiness" checklist | Schedule a Consultation |
| **Sellers** | What's my home worth? When should I list? What will I net? | Home valuation request | Get My Home Value |
| **First-Time Buyers** | Down payment help? Credit needed? FHA vs conventional? | DPA eligibility quick-check | See If I Qualify |
| **Relocation Clients** | Which area fits me? Schools/commute? Cost of living? | "Find Your Area" matcher | Get an Area Match |
| **Investors** | Cash flow? New construction vs resale? Best ROI areas? | Investment Property Guide (gated) | Get the Investor Guide |

### 5.3 Lead-capture funnel (progressive, low-friction)
```
Engage (ask a question)  →  Helpful answer (no gate)  →  Value offer (lead magnet
matched to detected intent)  →  Light capture (name + email/phone + intent)  →
Route to Charlotte (CRM + booking)  →  Nurture (email sequence by audience)
```
- **Progressive profiling:** never ask everything at once; capture intent first,
  contact second, details over time.
- **Gated tools as magnets:** home valuation, buyer-readiness quiz, DPA eligibility
  checker, investor guide, relocation area-matcher.
- **Booking:** "Schedule a Consultation" remains the primary site-wide CTA; the AI can
  hand off into it.

### 5.4 Technical & governance notes (for later build)
- Retrieval-augmented over the site's own pages (resources, city pages, FAQs) so answers
  stay accurate and on-brand; powered by the Claude API when implemented.
- **Guardrails:** general education only — no legal, tax, or lender-specific advice;
  always offer to connect with Charlotte or a Preferred Partner; fair-housing-safe
  language (no steering); cite source pages.
- Capture consent + light spam protection on any lead form (honeypot already in use).

---

## 6. Blog Strategy

| Category | Purpose | Cadence (suggested) | Links into |
|---|---|---|---|
| Market Updates | Freshness, authority, recurring | Monthly | Buyers, Sellers, city pages |
| Buyer Education | Top-of-funnel capture | 2×/month | Buyers, First-Time, resources |
| Seller Education | Listing leads | 2×/month | Sellers, closing costs, valuation |
| Neighborhood Spotlights | Local SEO, dated angle | Monthly | matching city + neighborhood guide |
| Mortgage & Financing | High-intent, DPA differentiator | Monthly | FHA/VA/DPA resources |
| Local Community Content | E-E-A-T, local relevance, links | Monthly | city pages, community orgs |

Every post: Charlotte byline → `/meet-charlotte`, one category, 3–5 internal links, a
CTA, and `BlogPosting` schema with `author` + `publisher`.

---

## 7. SEO Strategy

### 7.1 On-page patterns
- **Title tag:** `[Primary KW] | SOLD IT TODAY` (e.g. *Homes for Sale in Riverview, MI | SOLD IT TODAY*).
- **Meta description:** benefit + locale + soft CTA, ~150 chars.
- **H1:** one per page, matches search intent.
- **H2s as questions** where natural (feeds featured snippets *and* the AI/LLM answer box).
- Unique, **non-templated body copy per city** (thin/duplicate city pages are the #1 risk).

### 7.2 City page content blueprint (so 19 pages aren't thin)
Each city page should include genuinely local, non-duplicated content:
1. Intro: Charlotte/SOLD IT TODAY as the local expert for *[city]*.
2. Living in [city]: character, who it suits, lifestyle (no fabricated stats).
3. Buying in [city] / Selling in [city] (links to pillars).
4. Local market notes (qualitative; wire real data later via IDX/MLS).
5. Neighborhood callouts → neighborhood guides.
6. FAQ (FAQPage schema) — 4–6 real questions.
7. Reviews/credibility + primary CTA + Ask Charlotte prompt.

### 7.3 Technical SEO
- `sitemap.xml` (auto-generated from routes) + `robots.txt`.
- Canonical tags; 301s for any renamed routes (`/service-areas → /communities`).
- Breadcrumb schema; clean, semantic, accessible HTML (already the baseline).
- Core Web Vitals: Next.js SSG + `next/image` already strong — keep image weights down
  (flagged: the 1.3 MB logo SVG and large headshots should be optimized before launch).
- Open Graph / Twitter cards per page.

### 7.4 High-value content opportunities (ranked)
1. **Down Payment Assistance Michigan** — Charlotte's specialty, high intent, under-served locally. *Flagship.*
2. **First-Time Buyer + DPA combo** funnel (resource → service → Ask Charlotte).
3. **Downriver hub** — lean into local roots as a differentiator vs. generic metro agents.
4. **Buying After Bankruptcy / Foreclosure** — high-intent, low-competition, trust-driven.
5. **Selling an Estate Property** & **Divorce and Real Estate** — sensitive, high-value, referral-rich.
6. **City "cost to sell / cost to buy" + "is now a good time"** angles per Tier-1 city.
7. **Comparison pieces** — FHA vs conventional, rent vs buy in [city], new construction vs resale.
8. **Recurring market updates** for freshness + return visits.

---

## 8. AI Discoverability (LLM / answer-engine optimization)

Goal: when buyers/sellers ask an AI assistant about Southeast Michigan real estate,
SOLD IT TODAY is understood, trusted, and cited.

1. **`llms.txt` at root** — concise machine-readable summary of who SOLD IT TODAY is,
   service area, specialties, and links to key pages.
2. **Rich JSON-LD structured data** — `RealEstateAgent`/`LocalBusiness`, `Person`
   (Charlotte, with credentials), `FAQPage`, `Article`, `BreadcrumbList`, `Place` (cities),
   `Service`, and `AggregateRating`/`Review` (from Zillow) where permitted.
3. **Answer-first content** — lead sections with a direct, quotable answer, then detail.
   LLMs cite clean, factual, self-contained statements.
4. **Entity clarity & consistent NAP** — identical name/address/phone everywhere so the
   brand resolves to one entity.
5. **E-E-A-T signals** — Charlotte as named author with credentials (19+ yrs, 350+ homes,
   Circle of Excellence, Remerica), bylines, and an authoritative About/Person page.
6. **FAQ everywhere** — the Ask Charlotte KB and per-page FAQs double as LLM-friendly Q&A.
7. **Fast, semantic, crawlable HTML** (SSG) — no content hidden behind interactions.
8. Allow reputable AI crawlers in `robots.txt`; keep facts accurate (no fabricated data).

---

## 9. Local SEO

1. **Google Business Profile** — claim/optimize: correct categories (Real Estate Agent),
   service-area listing (Downriver + named cities), photos, Google Posts, Q&A, review flow.
2. **NAP consistency** — *Remerica United Realty, 47720 Grand River Ave, Novi, MI 48374* +
   Charlotte's phone/email, identical across site, GBP, Zillow, and directories.
   *(Note: office is Novi; service area is Downriver/Metro Detroit — express the service
   area via `areaServed` schema and city pages, not by faking multiple offices.)*
3. **City landing pages** with unique local content (Section 7.2) + `areaServed` + `Place` schema.
4. **Reviews funnel** — drive to Zillow (+ Google); surface on-site with `Review` schema.
5. **Local link building** — chamber of commerce, community sponsorships, local press,
   neighborhood orgs, Preferred Partners (reciprocal where appropriate).
6. **Embedded map + local imagery** on Contact and city pages.
7. **Fair-housing-safe** local copy — describe places and amenities, never demographics.

---

## 10. Suggested Build Phasing (after approval)

| Phase | Scope |
|---|---|
| **Phase 1 (launch core)** | Meet Charlotte, Buyers, Sellers, First-Time Buyers, Contact, Communities hub + **Tier-1 Downriver cities (10)**, flagship resources (DPA, FHA, Closing Costs, First-Time), `sitemap/robots/llms.txt`, core schema |
| **Phase 2** | Investment, Relocation, remaining cities (Tier 2–3), remaining resources, Blog hub + first posts, Preferred Partners content |
| **Phase 3** | Ask Charlotte AI™ (KB content first, then assistant), neighborhood guides, ongoing blog cadence, reviews + market-update automation |

---

## 11. Open Decisions for Your Approval

1. **City hub naming/URL:** `/communities` (recommended, warmer) vs. keep `/service-areas`.
2. **City slug convention:** `[city]-mi` (recommended) vs. `[city]-michigan` vs. flat `/[city]-mi`.
3. **"Investment Properties" URL:** `/investment-properties` (recommended, keyword-rich) vs. `/investors`.
4. **Blog post URLs:** flat `/blog/[slug]` (recommended) vs. nested `/blog/[category]/[slug]`.
5. **Ask Charlotte AI™ build order:** ship the *knowledge center* (SEO content) first, add
   the live assistant later — vs. both together.
6. **Phasing/priority:** confirm the Tier-1 Downriver-first rollout.

*Nothing is built until this architecture is approved.*
