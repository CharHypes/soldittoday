# TransactionDesk / Lone Wolf Developer API Ecosystem (as of 2026)

> Developer-facing research for integrating a Next.js + Supabase CRM so a contract created/executed in TransactionDesk auto-creates/updates a transaction in our app. Captures the official Lone Wolf API Portal, the TransactionDesk Partner API v2.0, the Lone Wolf e-sign API (Inkless/Authentisign), and the webhook gap. Every claim has an inline source URL. Current as of research date 2026-10-18.

## Does Lone Wolf offer a public/partner API and/or webhooks? Is access self-serve or gated, and how do you apply?

### Takeaway
Yes. Lone Wolf runs a formal developer portal at **apidocs.lwolf.com** and launched a centralized **API Portal** in **February 2026** across its "Foundation" cloud. Access is **gated** (not self-serve): you submit a request form and Lone Wolf's integrations team provisions credentials. The TransactionDesk Partner API itself exposes **no webhooks/events** — it is poll-only — but Lone Wolf's e-signature product (Inkless, built on the Authentisign engine) does have webhooks.

### Cited Findings
- Lone Wolf hosts official API reference docs at apidocs.lwolf.com, including a machine-readable OpenAPI spec and an MCP server endpoint (`https://apidocs.lwolf.com/mcp`) for AI tools — [apidocs.lwolf.com](https://apidocs.lwolf.com/)
- Lone Wolf **launched its API Portal in February 2026** as a centralized hub to accelerate integrations across its Foundation Industry Cloud, giving brokers, agents, and tech partners access to its APIs — [Lone Wolf press release](https://www.lwolf.com/press-releases/lone-wolf-launches-api-portal-to-power-real-estate-connectivity); [GlobeNewswire 2026-02-02](https://www.globenewswire.com/news-release/2026/02/02/3230428/0/en/Lone-Wolf-Launches-API-Portal-to-Power-Real-Estate-Connectivity.html) (note: GlobeNewswire URL returned HTTP 403 on fetch; headline/date confirmed via search index)
- Access is request-gated: "Complete the access request form" and "a member of our integrations team will be in touch" to provision access to the APIs needed to integrate with the Lone Wolf Foundation Industry Cloud — [lwolf.com/api-getting-started](https://www.lwolf.com/api-getting-started)
- The API Portal landing/request page says "Tell us about your project" to get "your secure API keys and credentials" — [lwolf.com/api-portal](https://lwolf.com/api-portal)
- Portal is open to Lone Wolf customers and integration partners, and "access levels vary by usage needs"; the integration catalog claims 100+ available integration partners — [lwolf.com/integrations](https://lwolf.com/integrations); [HousingWire: Lone Wolf launches integration hub](https://www.housingwire.com/articles/lone-wolf-launches-integration-hub-to-connect-real-estate-brokerage-tech-and-eliminate-data-silos/)
- The **TransactionDesk Partner API OpenAPI spec contains no webhook, callback, event, or subscription endpoints or schemas** — confirmed by reading the spec directly — [transactiondesk-api.yaml](https://apidocs.lwolf.com/doc/transactiondesk-api.yaml)
- Contact listed for API/integration help: phone 1-888-349-0628 plus lwolf.com/contact and /support — [lwolf.com/api-getting-started](https://www.lwolf.com/api-getting-started)

### Inferences
- There is a real, documented API program, but it is **partnership-gated** — you cannot sign up and self-provision keys instantly for TransactionDesk the way you can with a typical SaaS developer portal. Expect a sales/partner conversation and likely a partner agreement. Budget for lead time.
- Because the TransactionDesk API has no webhooks, the "auto-create/update on contract executed" flow for TransactionDesk transaction data itself will require **polling** on a schedule (e.g., a Supabase cron / Next.js route hitting `GET /v2/transactions` and diffing), unless the event you care about is an e-signature completion (then use the Inkless webhook — see below).

### Gaps
- Published partner fees, certification requirements, revenue-share terms, and SLA — not public; must come from Lone Wolf directly.
- Whether TransactionDesk webhooks are on a roadmap — not documented.

## Product & API landscape: which Lone Wolf products expose transaction + party + document data, and is there a unified API?

### Takeaway
Lone Wolf has **many** products and a correspondingly large API catalog (10 REST APIs listed on apidocs.lwolf.com), unified under the Foundation cloud and the 2026 API Portal but **not** behind one single endpoint. For our use case (transactions + parties + documents + forms), the **TransactionDesk Partner API v2.0** is the primary one. zipForm/zipTMS is the separate CA-centric forms+transaction product (its public automation story is weak). E-signature (formerly Authentisign, now also "Inkless") is a separate API-first product with its own docs and webhooks.

### Cited Findings
- apidocs.lwolf.com lists **10 REST APIs** — [apidocs.lwolf.com](https://apidocs.lwolf.com/):
  - **TransactionDesk API** — "Partner integration with the TransactionDesk application"; OAuth Authorization Code Flow — [doc](https://apidocs.lwolf.com/doc/transactiondesk-api)
  - **Deals API** (v25.01.00) — partner integration; JWT access token via `POST https://authentication.api.lwolf.com/v1/login` — [doc](https://apidocs.lwolf.com/doc/deals-api)
  - **New Back Office API** — brokerage accounting, compliance data, commissions, employee management, office operations, transaction processing — [doc](https://apidocs.lwolf.com/doc/back-office-online-api)
  - **Transact API** — OpenAPI 3.0.3 definition available as JSON download — [doc](https://apidocs.lwolf.com/doc/transact-api)
  - **ZipForm API** — "Licensed to partners," exposes zipForm transaction data and PDF forms — [doc](https://apidocs.lwolf.com/doc/zipform-api)
  - **WolfConnect API** — RESTful resources giving third parties access to data; uses request signing — [doc](https://apidocs.lwolf.com/doc/wolfconnect-api)
  - **Spacio API** — properties, leads, brokerages, teams (open-house lead product) — [doc](https://apidocs.lwolf.com/doc/spacio-api)
  - **HomeSpotter** — social media ad campaigns (Boost platform) — [doc](https://apidocs.lwolf.com/doc/homespotter)
  - **PropertyBaseGO** — PropertyBase GO platform; `X-BL-API-Key` header — [doc](https://apidocs.lwolf.com/doc/propertybase)
  - **PropertyBaseSE** — four core APIs incl. Manda Middleware (delivers listings to portals) — [doc](https://apidocs.lwolf.com/doc/propertybasese)
- **Authentisign** (Lone Wolf's e-sign, "processes over 40 million envelopes annually") has been **renamed eSignature** and now sits alongside the new API-first product **Inkless** — [SDMLS support: Lone Wolf AuthentiSign](https://support.sdmls.com/support/solutions/articles/150000211499-lone-wolf-authentisign); [lwolf.com/authentisign](https://lwolf.com/authentisign)
- Lone Wolf launched **Inkless**, "disrupting legacy e-signature market with ... an API-first approach," built on the "battle-tested Authentisign engine," with "full signing, templating, and webhook capabilities from day one across all plans" and instant sandbox at signinkless.com — [Lone Wolf press release: Inkless](https://lwolf.com/press-releases/lone-wolf-launches-inkless-disrupting-legacy-e-signature-market-with-transparency-and-api-first-approach)
- A separate **Authentisign API** is cataloged as an "E-signature API ... creates and manages signings, signer roles, documents and signing status" and "supports an optional CallbackUrl on a signing" — [API Evangelist: Lone Wolf](https://providers.apievangelist.com/providers/lone-wolf/)

### Inferences
- There is **no single unified "Lone Wolf API" endpoint** — it's a portfolio of per-product REST APIs under one documentation portal and one access-request front door. Auth and conventions differ per product (OAuth for TransactionDesk, JWT-login for Deals, API-key header for PropertyBaseGO, request-signing for WolfConnect).
- For "contract created/executed in TransactionDesk → our CRM," the **TransactionDesk API is the right surface** for transaction/party/document/forms data. If the "executed" signal must be near-real-time, pair it with the **Inkless/e-sign webhook** (which fires on signing completion) rather than waiting to poll TransactionDesk. This is the cleanest event hook in the whole ecosystem.
- MoxiWorks, Cloud CMA, and LionDesk appear in the prompt but did **not** surface as separate entries in the lwolf.com API catalog — treat their API availability as unknown/out of scope here (see Gaps).

### Gaps
- MoxiWorks, Cloud CMA, LionDesk (CRM): no API docs found on apidocs.lwolf.com in this research; their developer/API status is unconfirmed. LionDesk historically had its own API but its current status post-acquisition is unverified.
- zipTMS (transaction management layer of zipForm) vs. the generic "ZipForm API" relationship — not clarified in docs reviewed.
- Difference/overlap between "Deals API," "Transact API," and "TransactionDesk API" (all transaction-ish) — not disambiguated in the portal landing page; worth asking Lone Wolf which is the current/recommended surface.

## Authentication model — what we'd store in env vars

### Takeaway
TransactionDesk uses **OAuth 2.0** with two flows: Authorization Code (per-user consent) and Client Credentials (enterprise, with an `On-Behalf-Of` user-GUID header). Bearer tokens on every request. Other Lone Wolf APIs use different schemes, so env config is per-product.

### Cited Findings
- **TransactionDesk — Authorization Code Flow:** redirect user to `https://api.pre.transactiondesk.com/oauth/authorize?client_id=Lonewolf&redirect_uri=<yours>&response_type=code&state=active`; user logs in via Lonewolf Authentication; redirected back with `code`; exchange via `POST /oauth/token`. **Code is one-time-use, expires in 10 minutes.** Then send `Authorization: Bearer <token>` on every request — [transactiondesk-api doc](https://apidocs.lwolf.com/doc/transactiondesk-api)
- **TransactionDesk — Client Credentials Flow (enterprise):** `grant_type=client_credentials`, no user redirect, send an **`On-Behalf-Of` header containing the target user's GUID** on API requests — [transactiondesk-api doc](https://apidocs.lwolf.com/doc/transactiondesk-api)
- **Deals API:** JWT access token obtained by `POST https://authentication.api.lwolf.com/v1/login`; all APIs require an `Authorization` HTTP header — [deals-api doc](https://apidocs.lwolf.com/doc/deals-api)
- **PropertyBaseGO:** `X-BL-API-Key` header — [apidocs.lwolf.com](https://apidocs.lwolf.com/)
- **WolfConnect:** request signing ("Creating the Signature") — [apidocs.lwolf.com](https://apidocs.lwolf.com/)
- **Inkless e-sign:** JWT **Bearer token** generated under Settings in the Inkless dashboard, plus an `externalId` header equal to the `actort` value decoded from the token — [Inkless documentation](https://signinkless.com/documentation/)

### Inferences
- Env vars to plan for (TransactionDesk, client-credentials path, best for a server-side CRM sync without per-user browser consent): `LWOLF_CLIENT_ID`, `LWOLF_CLIENT_SECRET`, token endpoint host, and a stored mapping of `On-Behalf-Of` user GUID(s) for the agent(s) whose transactions we read. For the per-user auth-code path you'd also store `redirect_uri` and persist refresh/access tokens per connected agent.
- The `client_id=Lonewolf` literal in the authorize example is almost certainly a placeholder for the example doc; you receive your own client_id from Lone Wolf when provisioned — treat it as such.
- Inkless auth is independent and would be a separate credential set (`INKLESS_JWT` / `INKLESS_EXTERNAL_ID`).

### Gaps
- Token lifetime / refresh-token mechanics for TransactionDesk Bearer tokens (beyond the 10-min auth *code* expiry) — not shown on the summary page; check the full spec or ask Lone Wolf.
- Production OAuth host — the docs only show the **preproduction** host `api.pre.transactiondesk.com`; the production base URL is **not published** (see next section).

## What data can be READ via the TransactionDesk API

### Takeaway
A lot of what we need: transactions (with rich property/listing/purchase fields including key dates), contacts/parties (by role/type), documents (downloadable as Base64), form libraries and forms, users, and transaction statuses/types. SSO "view-url" endpoints hand back deep links into TransactionDesk. **Big caveat: only the preproduction base URL is published; no production endpoint appears in public docs.**

### Cited Findings — endpoints (all under `https://api.pre.transactiondesk.com`, `/v2/` namespace), confirmed from the OpenAPI spec — [transactiondesk-api.yaml](https://apidocs.lwolf.com/doc/transactiondesk-api.yaml)
- `GET/POST /v2/transactions`; `GET/PATCH/DELETE /v2/transactions/{id}`; `GET/PATCH /v2/transactions/{id}/details`
- `GET/POST /v2/transactions/{id}/documents`; `GET/PATCH/DELETE /v2/transactions/{transactionId}/documents/{documentId}` — **document GET returns the file as a Base64-encoded string in a `binary` field ("Base64 encoded document binary"); uploads also use Base64.** Spec's example value decodes to a PDF header but the spec does not formally state the format
- `GET/POST /v2/transactions/{id}/contacts`; `GET/PATCH/DELETE /v2/transactions/{transactionId}/contacts/{contactId}`
- `GET/POST /v2/transactions/contacts/types`; `GET/PATCH/DELETE /v2/transactions/contacts/types/{id}`
- `GET/POST /v2/transactions/types`; `GET/PATCH/DELETE /v2/transactions/types/{id}`
- `GET/POST /v2/transactions/statuses`; `GET/PATCH/DELETE /v2/transactions/statuses/{id}`; `GET /v2/transactions/statuses/meta`; `GET /v2/transactions/statuses/meta/properties`
- `GET /v2/view-url`, `GET /v2/transactions/view-url`, `GET /v2/transactions/{id}/view-url` — Single Sign-On deep links (agent dashboard, transaction list, specific transaction)
- `GET /v2/users` — all users
- `GET /v2/formlibraries`, `GET /v2/formlibraries/{folderId}`, `GET /v2/formlibraries/{folderId}/forms/{formLib}`; `POST /v2/transactions/{transactionId}/forms` (add form); `DELETE /v2/transactions/{transactionId}/forms/{id}`

### Cited Findings — transaction fields exposed (documented as updatable; read schema not separately enumerated) — [transactiondesk-api doc](https://apidocs.lwolf.com/doc/transactiondesk-api)
- **Property:** `streetNumber`, `streetName`, `city`, `county`, `state`, `zipCode`, `subDivision`, `lotNumber`, `block`, `pageNumber`, `platBook`, `yearBuilt`, `zoningClass`, `schoolDistrict`, `taxNumber`, `township`, `legalDescription`
- **Listing:** `mlsNumber`, `listPrice`, `expirationDate`, `propertyIncludes`, `propertyExcludes`, `leasedItems`
- **Purchase / key dates:** `purchasePrice`, `offerDate`, `offerExpirationDate`, `offerAcceptanceDate`, `applicationDate`, `approvalDate`, `depositAmount`, `additionalDepositAmount`, `additionalDepositDate`, `fundingDate`, `possessionDate`, `closingDate`

### Inferences
- Party data (full names, emails, phones, roles) is available via `/v2/transactions/{id}/contacts` + `/contacts/types`, which maps cleanly onto a Supabase `contacts`/`transaction_parties` schema. Roles come from the contact *types* resource.
- The documented field list covers the **acceptance → closing timeline** we need (`offerAcceptanceDate`, `closingDate`, `fundingDate`, `possessionDate`, plus financing `applicationDate`/`approvalDate`) and gives us contingency-relevant dates. Status/stage comes from the statuses resource.
- Signed/executed PDFs: listing `/documents` and downloading the Base64 `binary` lets us pull executed PDFs **if they are filed as documents on the transaction**. Whether an Authentisign/Inkless-signed doc auto-lands in that documents list is unverified — may require also hitting the e-sign API.
- The lack of a published production host is the single biggest unknown for go-live; the real host is almost certainly `api.transactiondesk.com` (vs `api.pre.`) but **do not assume** — confirm with Lone Wolf.

### Gaps
- Read-side response schemas (exact JSON shapes for GET) not enumerated on the summary page; the doc lists *updatable* fields. Full shapes are in the OpenAPI spec but weren't exhaustively extracted here.
- Production base URL — not published.
- Pagination, filtering, and "modified since" query params on `GET /v2/transactions` (critical for efficient polling) — not confirmed in this research; must verify in the spec.

## Event / webhook support — can we subscribe to new/executed/added/status-changed?

### Takeaway
**TransactionDesk API: NO webhooks — poll-only.** The OpenAPI spec defines zero webhook/callback/event/subscription endpoints. The only event-style hook in the Lone Wolf ecosystem is on the **e-signature** side (Inkless/Authentisign), which has both a global status webhook and a per-signing callback URL.

### Cited Findings
- TransactionDesk OpenAPI spec: "**None are defined.** The spec contains no webhook, callback, event, or subscription endpoints or schemas." The only redirect is the OAuth login redirect, not a server-to-server notification — [transactiondesk-api.yaml](https://apidocs.lwolf.com/doc/transactiondesk-api.yaml)
- **Inkless Signing Status Webhook:** configure a server URL under Settings > Webhooks; Inkless sends an HTTP POST JSON payload (`signingId`, `statusId`, `status`, `eventDate`, `transactionId`) **whenever a status changes**; endpoint should return 200 quickly; failed deliveries may be retried — [Inkless documentation](https://signinkless.com/documentation/)
- **Inkless signing status values:** 0 Draft, 1 Sent, 2 Signed (intermediary), **3 Completed**, 4 Rejected, 5 Reset, 6 Expired. Participant status: 1 Draft, 2 Sent, 3 Completed, 4 Rejected (no separate "signer signed" event — participant status 3 is closest) — [Inkless documentation](https://signinkless.com/documentation/)
- **Inkless per-signing callback:** set `callbackUrl` on `POST /api/v1/signings`, or update via `PATCH /api/v1/signings/{signingID}/` (payload/triggers not documented) — [Inkless documentation](https://signinkless.com/documentation/)
- Authentisign API "supports an optional CallbackUrl on a signing" — [API Evangelist: Lone Wolf](https://providers.apievangelist.com/providers/lone-wolf/)
- Note the Inkless webhook payload **includes a `transactionId`** field, which is the natural join key back to a TransactionDesk transaction — [Inkless documentation](https://signinkless.com/documentation/)

### Inferences
- **Architecture recommendation for "contract executed → update our CRM":** Use the **Inkless/e-sign webhook** as the real-time trigger. When a signing hits `status 3 Completed`, catch the POST (which carries `transactionId`), then call the TransactionDesk API to pull the fresh transaction + contacts + documents and upsert into Supabase. This gets near-real-time execution events without polling.
- For "new transaction created" and "status changed" on transactions that are *not* driven by an e-sign completion, there is **no event** — you must **poll** `GET /v2/transactions` on a schedule and diff against your Supabase copy. A "modified since" filter (if it exists) would make this cheap; confirm.
- The `transactionId` on the Inkless payload strongly implies e-sign signings are linked to TransactionDesk transactions, which is exactly the join we need — but confirm the ID space matches TransactionDesk's transaction IDs.

### Gaps
- Whether the Inkless webhook `transactionId` is the same identifier as the TransactionDesk API `{id}` — not explicitly stated; must verify.
- Payload/trigger semantics of the per-signing `callbackUrl` (vs. the global status webhook) — not documented.
- Whether legacy Authentisign (non-Inkless) accounts get the same webhook — unverified; the modern webhook feature is documented under Inkless.

## Rate limits, data retention/compliance, and cost

### Takeaway
**Not publicly documented for any of these APIs.** All three (rate limits, retention/compliance constraints, cost to access) require a direct conversation with Lone Wolf's integrations/partner team.

### Cited Findings
- TransactionDesk summary page explicitly does not specify rate limits, and gives no onboarding/cost detail — [transactiondesk-api doc](https://apidocs.lwolf.com/doc/transactiondesk-api)
- API Portal access "levels vary by usage needs," implying tiering but with no published figures — [HousingWire](https://www.housingwire.com/articles/lone-wolf-launches-integration-hub-to-connect-real-estate-brokerage-tech-and-eliminate-data-silos/)
- Inkless: "No required long-term contracts. No hidden fees"; free instant sandbox, "No credit card required"; pricing page exists at signinkless.com/pricing but no figures surfaced — [signinkless.com](https://signinkless.com/); [Inkless sandbox signup](https://signinkless.com/get-your-sandbox-access/)

### Inferences
- The only piece you can trial today **without a partner deal** is **Inkless e-sign** (instant free sandbox). TransactionDesk/Deals/Back Office all appear to require going through the gated request form first.

### Gaps
- Published rate limits, data-retention windows, and pricing for TransactionDesk/Deals/Back Office — none found; contact Lone Wolf.
- Compliance posture (SOC 2, data residency, PII handling obligations on partners) — not found in public docs.

## Does a reliable Zapier or Make connector exist?

### Takeaway
Weak. Only a **minimal zipForm Plus** Zapier app exists (one trigger, one action, contacts-only). **No** TransactionDesk, Authentisign/eSignature, or general "Lone Wolf" Zapier connector was found. Inkless has native webhooks (so it doesn't need Zapier for events). No Make (Integromat) connector surfaced.

### Cited Findings
- zipForm Plus Zapier app exposes exactly **one trigger** — "New Contact" (fires when a new contact is added to a zipForm Address Book) — and **one action** — "Create Contact" (requires firstName, lastName; optional email, title, company, address, phone, category). **No TransactionDesk, Authentisign, or Lone Wolf mention** on the app page — [Zapier: zipForm Plus](https://zapier.com/apps/zipform-plus/integrations)
- zipLogix first announced the zipForm Plus + Zapier integration in **November 2014**, initially contacts-only, with plans (then) to add transactions and documents — [Inman, 2014](https://www.inman.com/2014/11/26/zipform-plus-users-can-pull-contacts-from-100s-of-web-apps/); [WAV Group, 2014](https://www.wavgroup.com/2014/11/)
- A 2024 vendor blog claims zipForm Plus connects to 2,000+ Zapier services, but this reflects Zapier's general reach, not zipForm-specific triggers; treat with caution (vendor source) — [Switchlabs](https://www.switchlabs.dev/resources/seamless-integration-with-zipform-plus-and-zapier-harnessing-automation-for-real-estate-efficiency)

### Inferences
- Zapier/Make is **not a viable path** for pulling TransactionDesk transaction/party/document/executed-contract data. The contacts-only zipForm connector doesn't cover transactions or documents, and the transactions/documents expansion promised in 2014 never materialized in the public app.
- The supported path is **direct API integration** (TransactionDesk API + Inkless webhook), not a no-code connector. For our Next.js + Supabase stack this is actually the better fit anyway (server routes + a webhook receiver + a scheduled poller).

### Gaps
- Whether a private/partner-only Zapier or Make connector exists for TransactionDesk — not found publicly; could ask Lone Wolf.
- Make (Integromat) app directory not directly checked in this research for any Lone Wolf product.

---

## Bottom-line integration recipe for our Next.js + Supabase CRM (inference, grounded in sources above)
1. **Get gated access**: submit the form at [lwolf.com/api-getting-started](https://www.lwolf.com/api-getting-started) / [lwolf.com/api-portal](https://lwolf.com/api-portal); ask specifically for **TransactionDesk Partner API v2.0** (client-credentials flow) + the **production base URL** + rate limits + whether e-signed docs auto-file into `/v2/transactions/{id}/documents`.
2. **Auth**: store client-credentials (`client_id`/`client_secret`) + per-agent `On-Behalf-Of` GUIDs; Bearer token per request. Separate creds for Inkless (`Authorization: Bearer` + `externalId`).
3. **Real-time "executed" events**: register an **Inkless Signing Status Webhook** → on `status 3 Completed`, read `transactionId` from payload → pull transaction/contacts/documents from TransactionDesk → upsert Supabase.
4. **Everything else (new transaction, status change, date changes)**: **poll** `GET /v2/transactions` on a schedule (Supabase cron / Vercel cron) and diff; pull `/details`, `/contacts`, `/documents` for changed records. Confirm a "modified since" filter to keep polling cheap.
5. **Documents**: `GET /v2/transactions/{id}/documents/{documentId}` → decode Base64 `binary` → store in Supabase Storage.
6. **Fallback**: Zapier/Make is **not** usable for transaction data (contacts-only zipForm app). Do not design around it.
