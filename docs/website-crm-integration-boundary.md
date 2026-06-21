# SOLD IT TODAY — Website ↔ CRM Integration Boundary

> **Status:** REFERENCE / GUARDRAIL — documentation only.
> This file describes *intent and boundaries*. It changes **no** application
> code, config, styling, or runtime behavior. Nothing here is built yet.
>
> **Audience:** anyone (human or AI) who later works on connecting the public
> website to the private CRM. Read this **before** writing any integration code.

---

## 0. The two projects

| | **Website** | **CRM** |
|---|---|---|
| Path | `soldittoday-website/soldittoday` | `SoldItTodayTools/CRM` |
| Role | **Public front door** | **Private operating system** |
| Audience | Buyers, sellers, the public, search engines/LLMs | Charlotte + team (internal), later permissioned partners |
| Stack today | Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion; front-end only, no backend | Prototype (`prototype/SoldItToday-CRM.html`) + planning docs |
| Holds | Marketing content, IDX search UI, lead-capture forms | Leads, Buyers, Sellers, Listings, Active Transactions, Offers, Tasks, Notes, Documents, Reporting |

They are **separate projects on purpose** and stay that way.

---

## 1. The boundary rule

**The website and the CRM remain separate projects.**

- The **website** is the public front door. It will host IDX/property search,
  buyer/seller content, lead capture, and (later) buyer/seller portals.
- The **CRM** is the private operating system behind the business. It manages
  leads, buyers, sellers, listings, offers, active transactions, tasks, notes,
  documents, and reporting.

They should **eventually connect through defined APIs, webhooks, or permissioned
portal access — never by mixing the codebases.**

Concretely:

- The website **must not** import CRM code, and the CRM **must not** import
  website code.
- There is **no shared database** and **no shared source tree**. They talk only
  across an explicit, versioned contract (HTTP API and/or webhooks).
- A change in one project must not require editing the other's internals. The
  contract is the only coupling point.
- Do not build CRM features *into* the website. Do not make website decisions
  that would block a future, clean CRM integration.

---

## 2. Existing website integration seams

These already exist in the website and are the **only** places the future CRM
connection should hook into. They are intentionally isolated and commented today.

### `components/Contact.tsx` — lead capture
- The site's contact form. Today it submits **client-side only**: it shows a
  thank-you state, runs a honeypot spam trap, and stores/sends **nothing**.
- Future seam: this is where website→CRM **lead creation** will originate
  (via a server route that posts to the CRM / lead store — see §3, §6).
- Already noted in-file that server-side validation + CAPTCHA (e.g. Cloudflare
  Turnstile) are required before a real backend goes live.

### `components/search/HomeSearch.tsx` — IDX / property search
- The homepage property-search UI. Today it assembles an **IDX-ready `query`
  object** (`location`, `propertyType`, `minPrice`, `maxPrice`, `beds`, `baths`)
  and only logs it to the console — it is **not** connected to any MLS/IDX.
- Carries an explicit `IDX INTEGRATION POINT` comment block.
- Future seam: IDX/property search may eventually connect to **buyer files,
  saved homes, showing requests, and offer drafts** in the CRM (see §3, §5).

### `lib/data.ts` — static content + typed data structures
- Single source of all current site content **and** its TypeScript types
  (`Listing`, `TeamMember`, `CityPage`, `Faq`, `contact`, etc.).
- This is **website content**, not business records. It is **not** the CRM and
  must not grow into a database (see §4).
- Relevance later: its typed shapes (especially `Listing`) are useful as a
  reference when mapping IDX/CRM data into website display components — but the
  CRM remains the system of record for any real records.

---

## 3. Future website-to-CRM data flows

All of these are **future** and gated on the open decisions in §7. Direction of
flow starts one-way (website → CRM) and only later becomes permissioned reads
(CRM → portal).

1. **Website forms → CRM leads.**
   Contact form (and later lead magnets / "Ask Charlotte" captures) create
   **Lead** records in the CRM, tagged with source page and intent.

2. **IDX / property search → buyer activity.**
   Property search may eventually connect to **buyer files, saved homes,
   showing requests, and offer drafts** in the CRM — subject to the MLS/IDX
   caution in §5.

3. **Buyer & seller portals → permissioned reads.**
   Future portals may **display selected CRM data based on permissions**
   (e.g. a buyer sees their own saved homes, showings, and transaction
   milestones; a seller sees their listing's activity). Read-only, scoped, and
   permission-checked on the CRM side.

4. **Partner access → role-based.**
   Lenders, title companies, or transaction coordinators may eventually get
   **role-based** access to the specific records relevant to a transaction —
   never blanket access.

---

## 4. Ownership rule

**The CRM is the system of record. The website is not the database.**

- Business records (leads, buyers, sellers, listings, offers, transactions,
  tasks, notes, documents) **live in the CRM**.
- Website data **flows into** the CRM. The website captures and forwards; it
  does not own or retain the canonical copy.
- Future portals **only display permission-approved CRM data** — they read a
  scoped, authorized view; they do not become a second store of truth.
- `lib/data.ts` stays what it is: **public marketing content**. It must not be
  repurposed as a backing store for business records.

---

## 5. MLS / IDX caution

**Do not assume MLS/IDX data can be stored, reused, retained, or pushed into CRM
documents** until all three are confirmed in writing:

1. **IDX provider rules** (the chosen vendor's terms),
2. **MLS rules** (display, attribution, retention, refresh frequency,
   fair-housing constraints), and
3. **Available API / export permissions** (what the feed actually allows).

Until then:
- Treat IDX listing data as **display-only**, fetched live and shown under the
  provider's required disclaimers — **not** copied into CRM records or documents.
- Do **not** persist, cache beyond what the provider permits, re-export, or
  embed MLS data into CRM-generated documents (e.g. offer packets) without
  confirmed permission.
- When in doubt, link out or render live; do not retain.

This caution overrides any convenience-driven shortcut in §3.

---

## 6. Draft data contract sketches

> **Draft only.** These are illustrative JSON shapes to anchor discussion — not
> final schemas, not implemented, not authoritative. Field names will be agreed
> as the real contract is defined. They are deliberately neutral JSON (not shared
> TypeScript types) so neither project depends on the other's code.

### 6.1 Lead payload (website → CRM)
Originates from `components/Contact.tsx` (and future capture points).

```json
{
  "type": "lead",
  "source": "website",
  "sourcePage": "/contact",
  "submittedAt": "2026-06-21T14:30:00Z",
  "name": "Jane Buyer",
  "email": "jane@example.com",
  "phone": "+1-313-555-0142",
  "intent": "Buying",
  "message": "Looking in Wyandotte, first-time buyer, DPA question.",
  "consent": { "marketing": true, "capturedAt": "2026-06-21T14:30:00Z" },
  "meta": { "honeypotPassed": true, "captchaVerified": null }
}
```

### 6.2 Property interest / saved home payload (website → CRM)
Originates from IDX/property search interactions.

```json
{
  "type": "property_interest",
  "source": "website",
  "contactRef": { "email": "jane@example.com" },
  "savedAt": "2026-06-21T15:05:00Z",
  "listing": {
    "mlsId": "PENDING_IDX_PROVIDER",
    "address": "123 Maple St, Wyandotte, MI 48192",
    "price": 285000,
    "beds": 3,
    "baths": 2,
    "displayOnly": true
  },
  "searchContext": {
    "location": "Wyandotte, MI",
    "propertyType": "any",
    "minPrice": 200000,
    "maxPrice": 300000,
    "beds": "3",
    "baths": "2"
  },
  "note": "MLS fields are display-only pending §5 confirmation; do not retain without permission."
}
```

### 6.3 Showing request payload (website → CRM)
A buyer requesting to view a property.

```json
{
  "type": "showing_request",
  "source": "website",
  "requestedAt": "2026-06-21T15:10:00Z",
  "contactRef": { "email": "jane@example.com", "phone": "+1-313-555-0142" },
  "listingRef": { "mlsId": "PENDING_IDX_PROVIDER", "address": "123 Maple St, Wyandotte, MI 48192" },
  "preferredTimes": ["2026-06-23T17:00:00Z", "2026-06-24T18:00:00Z"],
  "notes": "Evenings preferred."
}
```

### 6.4 Future portal display payload (CRM → website portal)
A **read-only, permission-scoped** view the CRM returns to an authenticated
portal user. Shape is filtered server-side by role/permission.

```json
{
  "type": "portal_view",
  "audience": "buyer",
  "viewerRef": { "contactId": "crm-contact-001" },
  "permissions": ["read:own_saved_homes", "read:own_showings", "read:own_transaction_status"],
  "savedHomes": [
    { "address": "123 Maple St, Wyandotte, MI", "status": "active", "displayOnly": true }
  ],
  "showings": [
    { "address": "123 Maple St, Wyandotte, MI", "scheduledFor": "2026-06-24T18:00:00Z", "status": "confirmed" }
  ],
  "transaction": {
    "stage": "Under Contract",
    "milestones": [
      { "name": "Inspection", "date": "2026-06-30", "status": "scheduled" },
      { "name": "Closing", "date": "2026-07-25", "status": "pending" }
    ]
  },
  "note": "Server returns only fields the viewer is permitted to see; CRM remains system of record."
}
```

---

## 7. Open decisions

These must be resolved before integration work begins. Each blocks part of §3.

1. **IDX provider** — Confirm whether **Remerica United Realty** supplies an
   IDX/MLS feed, or whether we buy one (iHomefinder, IDX Broker, RealGeeks,
   Spark/FlexMLS). *Blocks all listing/search integration.*
2. **MLS / IDX permissions** — Obtain the provider + MLS rules on storage,
   reuse, retention, refresh cadence, attribution, and document inclusion
   (see §5). *Blocks any persistence of listing data.*
3. **Lead destination** — Where do website leads land: **CRM only**, email,
   Supabase, HubSpot, or another tool? (Could be CRM as system of record with
   an email notification — to be decided.)
4. **Future portal authentication model** — How buyers/sellers authenticate to
   a portal and how sessions/permissions are issued and verified.
5. **Partner access permissions** — Role definitions and scoping for lenders,
   title companies, and transaction coordinators (which records, which fields,
   for how long).

*No integration is built until the relevant decisions above are confirmed.*

---

## 8. Companion copy

A reference duplicate of this document is kept on the CRM side at:
`SoldItTodayTools/CRM/planning/website-crm-integration-boundary.md`

Keep the two copies in sync when this boundary is revised.
