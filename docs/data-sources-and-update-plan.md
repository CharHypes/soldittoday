# SOLD IT TODAY — Data Sources & Update Plan

> **Status:** ANALYSIS + PLAN — nothing is built from this document.
> **Purpose:** Map what's static vs. what will need a live data source, and
> recommend how each area should be sourced and kept up to date.

## 0. Current architecture (as built today)

The site is a **front-end-only Next.js app** — 100% static content, no backend,
no database, no CMS, no external APIs.

- **All content** lives in one file: [`lib/data.ts`](../lib/data.ts) as hardcoded
  typed arrays (nav, services, listings, team, reviews, counties, contact, etc.).
- **Images:** brand/team assets in `public/assets/**`; **listing photos are
  Unsplash placeholders** (not real homes).
- **Pages** (App Router, static): `/`, `/meet-charlotte`, `/team`, `/relocation`,
  `/communities`, `/service-areas`, `/resources`, `/neighborhood-guides`,
  `/preferred-partners`.
- **Forms** (Contact, Home Search) run **client-side only** — nothing is saved or
  sent anywhere yet (Contact shows a success state + honeypot; Home Search logs an
  IDX-ready query object to the console).
- **Reviews** are descriptive *themes* + an outbound link to the Zillow profile.

Deployment target (decided earlier): **GitHub → Vercel (hosting/ISR) → Cloudflare
(DNS/security) → Supabase (later: DB, auth, lead capture, saved searches).**

---

## 1. Static vs. Dynamic — inventory

Legend — **Static-OK** = fine to keep as code/data edits · **Dynamic** = needs a
live source · **Hybrid** = editorial content (CMS) + live data (API).

| Area | Current source | Classification | Future source |
|---|---|---|---|
| Brand, NAP, contact (`contact`) | `lib/data.ts` | **Static-OK** | Stays in code |
| Navigation (`navLinks`, `futurePages`) | `lib/data.ts` | **Static-OK** | Stays in code |
| Services, brand values, "why work with us" | `lib/data.ts` | **Static-OK** | Stays (optional CMS) |
| Team roster + photos (`team`) | `lib/data.ts` + `public/assets/team` | **Static-OK** (low churn) | Stays, or light CMS |
| Charlotte bio/stats (`charlotteStats`) | `lib/data.ts` | **Static-OK** | Stays |
| Counties / featured communities | `lib/data.ts` | **Static-OK** (editorial) | Stays (CMS optional) |
| Market areas / county descriptions | `lib/data.ts` | **Static-OK** | Stays |
| Preferred partners (`partnerCategories`) | placeholders | **Static-OK** once real names added | Stays |
| **Home Search** (`HomeSearch.tsx`) | console-logged query | **Dynamic** | **IDX/MLS** |
| **Featured Listings** (`Listings.tsx`, `listings`) | Unsplash placeholders | **Dynamic** | **IDX/MLS** |
| **City pages** (`/communities/[city]-mi`, not built) | — | **Hybrid** | CMS + IDX (listings + market stats) |
| **County pages** (`/communities/[county]`, not built) | — | **Hybrid** | CMS + IDX |
| **Blog** (`/blog`, not built) | — | **Dynamic** | CMS / MDX |
| **Resources** (`/resources` scaffold) | ComingSoon placeholder | **Dynamic** | CMS / MDX |
| **Neighborhood guides** (`/neighborhood-guides` scaffold) | placeholder | **Dynamic** | CMS / MDX |
| **Reviews** (`reviewThemes`, `reviewsUrl`) | static themes + Zillow link | **Dynamic** | Reviews API / curated CMS |
| **Market stats / market updates** | none (qualitative copy) | **Dynamic** | MLS analytics / manual |
| **Contact form** (`Contact.tsx`) | client-side only | **Dynamic** | Backend (Supabase) + email/CRM |
| **Home Search submit** lead intent | console only | **Dynamic** | Backend + IDX |
| **Lead magnets / downloadable guides** (planned) | — | **Dynamic** | Backend + email automation |
| **Ask Charlotte AI** (planned) | — | **Dynamic** | Knowledge base + LLM API + leads |

---

## 2. The six dynamic systems — recommended sources

### 2.1 IDX / MLS listings  *(biggest integration)*
**Drives:** Home Search, Featured Listings, city/county page listings + market stats.

- **Provider options:** iHomefinder, IDX Broker, RealGeeks, Spark API / FlexMLS,
  or a **brokerage-provided feed via Remerica**. *Confirm what Remerica United
  Realty already offers first — it's often the cheapest, compliant path.*
- **Two integration styles:**
  - **Embedded widget** (fastest, provider-hosted search/results) — least dev work,
    but weaker for SEO and design control.
  - **API + custom UI** (best UX/SEO/brand) — map the existing `HomeSearch` query
    object (`location`, `propertyType`, `minPrice`, `maxPrice`, `beds`, `baths`) to
    the provider's params; render results in our Mulberry Noir cards.
- **Already prepared for this:** `HomeSearch.tsx` and `Listings.tsx` both carry an
  "IDX INTEGRATION POINT" comment block, and `Listing` is a clean typed shape to
  map onto.
- **Compliance:** MLS display rules, required IDX disclaimers, attribution, and a
  **minimum refresh frequency** (often every 15 min–few hours). Fair-housing-safe.

### 2.2 Blog, Resources & Neighborhood Guides  *(content)*
**Drives:** `/blog`, `/resources`, `/neighborhood-guides`, article pages.

- **Recommended launch path: MDX files in the repo** (`/content/**`) → rendered via
  Next.js SSG/ISR. Git-versioned, fast, free, great SEO, easy author bylines/schema.
- **Upgrade path: a headless CMS** (Sanity / Contentful / Storyblok) when
  non-technical editors need to publish without touching the repo. CMS webhook →
  on-demand ISR revalidation.
- **Alternative:** Supabase tables + a small admin screen (keeps everything in one
  backend, but more to build than MDX).

### 2.3 City & County pages  *(hybrid)*
**Drives:** `/communities/[city]-mi`, `/communities/[county]`.

- **Editorial content** (intro, lifestyle, FAQ): CMS/MDX, generated via
  `generateStaticParams` from the existing `counties` / `featuredCommunities` data.
- **Live data on the page:** IDX listings filtered by area + market stats widgets.
- **Freshness:** ISR (revalidate hourly/daily) so pages stay current without redeploys.

### 2.4 Reviews
**Drives:** the reviews section + `AggregateRating` schema.

- **Now:** keep the curated `reviewThemes` + outbound Zillow link (already live).
- **Later, in order of preference:**
  1. **Manually curated reviews in CMS** with real quotes + `Review`/`AggregateRating`
     schema (full control, compliant).
  2. **Official APIs / widgets** — Google Business Profile reviews, or an aggregator
     (Birdeye, RealSatisfied).
  - ⚠️ **Avoid scraping Zillow** — against their ToS. Link out, or use sanctioned feeds.

### 2.5 Forms & Lead Capture
**Drives:** Contact form, Home Search lead intent, future lead magnets, saved searches.

- **Backend: Supabase** (already the planned stack) — a Next.js **Route Handler**
  (`/api/lead`) validates server-side and writes to a `leads` table.
- **Notify + route:** email via **Resend** (or similar) to Charlotte; optional push
  to **HubSpot** CRM (per the Growth Blueprint).
- **Spam:** keep the existing honeypot **and add server validation + a CAPTCHA**
  (**Cloudflare Turnstile** fits the stack) before going live.
- **Saved searches / accounts:** Supabase Auth + tables (Phase 4).
- **Already prepared:** `Contact.tsx` has the honeypot + a comment noting server
  validation/CAPTCHA are needed when the backend lands.

### 2.6 Ask Charlotte AI
**Drives:** the AI knowledge center + assistant + its lead capture.

- **Knowledge base:** the FAQ/Q&A content (CMS/MDX) doubles as SEO content.
- **Assistant:** retrieval-augmented over site content via the **Claude API**
  (see `docs` / claude-api reference) with guardrails (no legal/tax/lending advice,
  fair-housing-safe, cite source pages).
- **Leads:** conversations capture into the same Supabase `leads` pipeline.

---

## 3. Recommended update cadence & mechanism

| Data | Cadence | Update mechanism | Owner |
|---|---|---|---|
| IDX listings | Near real-time | IDX auto-sync + **ISR revalidate ~15–60 min** | Automated |
| Market stats (city/county) | Monthly | MLS analytics → ISR | Automated / agent |
| Blog posts | Per blueprint cadence (weekly–monthly) | MDX commit **or** CMS publish → ISR | Charlotte / team |
| Resources & guides | As written | MDX/CMS → ISR | Charlotte / team |
| Reviews | As they arrive / daily sync | CMS entry or API sync | Charlotte / automated |
| Team / partners / services | As needed | Edit `lib/data.ts` → deploy | Dev / team |
| Brand, NAP, nav | Rare | Edit `lib/data.ts` → deploy | Dev |
| Leads (form/AI) | Real-time | Route Handler → Supabase + email/CRM | Automated |

**Two update lanes:**
1. **Code/data edits** (static + MDX) → Git commit → Vercel deploy. Versioned, safe.
2. **Live data** (listings, market, reviews, CMS) → API/CMS → **ISR / on-demand
   revalidation**, no redeploy needed.

---

## 4. Suggested sequencing (aligned to the Growth Blueprint)

| Phase | Data work |
|---|---|
| **1 — Launch** | Keep everything static. Stand up the **leads backend** (Supabase `/api/lead` + email + Turnstile) so the Contact form is real. Add `sitemap/robots/llms` + schema. |
| **2 — Content** | Add **MDX content system** for Blog / Resources / Neighborhood guides; generate city/county pages from existing data. |
| **3 — Listings** | Integrate **IDX/MLS** (confirm Remerica's feed first) into Home Search + Featured Listings + area pages with ISR. Add curated **reviews + AggregateRating**. |
| **4 — Automation** | **Ask Charlotte AI** (Claude API) + saved searches/accounts (Supabase Auth) + lead nurture automations + (optional) headless CMS for non-dev editing. |

---

## 5. Key decisions to confirm before building

1. **IDX provider** — does Remerica United Realty supply an IDX/MLS feed, or do we
   buy one (iHomefinder / IDX Broker / RealGeeks / Spark)? *Blocks all listing work.*
2. **IDX style** — embedded widget (fast) vs. API + custom UI (best, more work).
3. **Content system** — MDX-in-repo at launch vs. headless CMS now.
4. **Reviews approach** — curated-in-CMS vs. an API/widget (not scraping).
5. **Lead destinations** — email only, or also HubSpot CRM? Confirm CAPTCHA = Turnstile.
6. **Editing model** — who edits content (developer via Git vs. non-technical via CMS)?

*No build work begins until these are confirmed.*
