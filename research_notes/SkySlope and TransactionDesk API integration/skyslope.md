# SkySlope Developer API & Integration Capabilities (as of 2026)

> Scope note: SkySlope does not publish a single open "developer portal" with self-serve signup. The most authoritative public artifact is the **SkySlope Partnership / Forms API reference at https://forms.skyslope.com/partner/api/docs** (live, public reference). An **API Evangelist** community mirror (openapi specs + provider profile) corroborates and indexes the product APIs, but is explicitly "not verified against a SkySlope-published page" for some claims (rate limits in particular). Several key facts (webhook event catalog beyond signing, whether 2020 Access Keys still work, exact Transaction Management API auth) are undocumented publicly and must be confirmed with SkySlope's partner/API team. Flags are called out per section.

## Public/partner API & webhooks; access model & how to get credentials

### Takeaway
SkySlope has multiple REST APIs but access is **partner/brokerage-gated, not self-serve** — you work with SkySlope (Customer Success Manager / onboarding) to get OAuth client credentials. There is a live public **Partnership/Forms API reference**. Webhooks exist but the only publicly documented event is "documents signed" (otherwise effectively poll-first).

### Cited Findings
- There are three main SkySlope API programs: **Partnership/Forms API** (base `https://forms.skyslope.com/partner/api`), **Offers API** (base `https://offers.skyslope.com/offers-api`), and **Transaction Management API (BETA)** (host `https://api.skyslope.com/api`) — [API Evangelist – SkySlope repo README](https://github.com/api-evangelist/skyslope); [API Evangelist provider profile](https://providers.apievangelist.com/providers/skyslope/)
- Live public reference for the Partnership/Forms API is at `https://forms.skyslope.com/partner/api/docs` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- Partnership/Forms API staging and integration hosts also exist: `https://staging-forms.skyslope.com/partner/api` and `https://integ-forms.skyslope.com/partner/api`; all requests must use HTTPS — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- API access is **partner/brokerage-gated**; reference docs are public but OAuth client credentials require working with SkySlope — [API Evangelist provider profile](https://providers.apievangelist.com/providers/skyslope/)
- Partner `Client ID` and `Client Secret` are issued during onboarding by SkySlope's team / Customer Success Manager, delivered in a **password-protected zip** with the password sent separately to the primary technical contact (not via a public signup form) — [Drivetrain SkySlope integration guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope)
- Only webhook publicly documented in the Forms API: a **signed-documents webhook** — subscribe via `POST /documents/sign/subscribe/{fileId}` (requires scope `forms.webhooks`), body is a `webhookUrl` string; sample response `{"subscribed": true}`; a `208` response is also documented but undescribed; **payload format is not published** — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- The Transaction Management API (BETA) is described as letting **brokerages query and extract their own SkySlope data for reporting/enterprise integration**; README says the host is live and returns `401` without a token, but no full public endpoint reference was reachable — [API Evangelist repo README](https://github.com/api-evangelist/skyslope); [API Evangelist provider profile](https://providers.apievangelist.com/providers/skyslope/)
- Transaction Management endpoints are "intentionally not modeled" in the community OpenAPI repo (no public spec file) — [API Evangelist repo README](https://github.com/api-evangelist/skyslope)
- SkySlope product set includes transaction management (SkySlope Forms), **DigiSign** (e-signature), and **SkySlope Books** (back-office accounting / commission disbursement); no public developer API docs were found for DigiSign or Books as standalone APIs — [API Evangelist provider profile](https://providers.apievangelist.com/providers/skyslope/); [GetApp SkySlope profile](https://www.getapp.com/all-software/a/skyslope)

### Inferences
- For the stated objective (contract created/executed in SkySlope → auto-create/update a transaction in a Next.js + Supabase CRM), the **Partnership/Forms API is the most usable public API today**: it exposes files (transactions), contacts (parties), documents, signed PDFs, and a signing webhook. The Transaction Management API would be the "cleaner" fit conceptually (read brokerage transactions) but is BETA and undocumented publicly — requires a partner conversation.
- Because only the signing webhook is documented, an event-driven "contract executed" trigger is plausible via the signed-documents webhook; all other change detection (new file, status change) likely needs **polling** `GET /files` until SkySlope confirms a broader webhook catalog.

### Gaps
- No public page explains how to formally *apply* to become a SkySlope API partner (no signup URL found); requires contacting SkySlope directly.
- Full webhook event catalog (new file created, status/checklist changed, contract accepted) is not published — must confirm with SkySlope.

## Authentication model (OAuth vs Access Key + Secret; what to store; 2020 keys)

### Takeaway
There are **two distinct auth schemes** depending on which API. The modern Partnership/Forms API uses **OAuth 2.0 (authorization-code + PKCE)**; the Offers API uses **OAuth 2.0 client-credentials** with HTTP Basic. The **Access Key + Secret** scheme (the kind Charlotte has from 2020) is the per-user credential generated in the SkySlope UI, historically used by data integrations and almost certainly tied to the Transaction Management / legacy data API — **no HMAC request-signing scheme is documented anywhere**.

### Cited Findings
- **Partnership/Forms API auth = OAuth 2.0 authorization-code flow with PKCE** (`code_challenge_method=S256`). Authorize endpoint `https://accounts.skyslope.com/oauth2/authorize`; token endpoint `https://accounts.skyslope.com/oauth2/token` (POST, form-encoded). Code exchange sends `grant_type=authorization_code`, `client_id`, `client_secret`, `code`, `redirect_uri`, `code_verifier`. Refresh via `grant_type=refresh_token`; must request `offline_access` scope to get a refresh token; refresh tokens **rotate on each use**. Requests use header `Authorization: Bearer {ACCESS_TOKEN}` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- Forms API **scopes**: `forms.files`, `forms.files.read`, `forms.documents`, `forms.documents.read`, `forms.webhooks`, `forms.templates.read`, `forms.mls.import`, `offline_access` (plus `forms.forms.read`, `forms.libraries.read`, `forms.collaborators.read`, `forms.buyerAgreements.restrictedRead`, `admin.groups` seen on specific endpoints) — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Offers API auth = OAuth 2.0 client-credentials**: `POST /ext/token` at `https://offers.skyslope.com/offers-api/ext/token`. Credentials are sent as header `Authorization: Basic BASE64(client_id:client_secret)` (no request body fields; no `securitySchemes` block in the spec). Response: `token_type` (e.g. `Bearer`), `expires_in` (e.g. `3600`), `access_token` — [SkySlope Offers Auth OpenAPI (API Evangelist mirror)](https://raw.githubusercontent.com/api-evangelist/skyslope/refs/heads/main/openapi/skyslope-auth-api-openapi.yml)
- **Access Key + Secret scheme** (user-generated): In SkySlope UI go to **My Account (SkySlope menu icon) > Integrations tab > "Generate New Key"**; the Secret is shown **only once** (download/copy immediately via "Download Key & Secret") — [Drivetrain guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope); [API Nation KB](https://support.apination.com/kb/article/62-how-to-locate-your-skyslope-access-secret-keys/)
- Access Keys carry **the same privileges as the user who created them**: an Agent's key returns only that agent's Listings and Sales; a **Broker/Admin key** is needed to reach all files in a brokerage — [Drivetrain guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope); [Sisu KB](https://kb.sisu.co/en/articles/3498325-integrating-sisu-and-skyslope)
- If "Generate New Key" is not visible, you are on the broker Admin > Integrations tab; use **My Account > Integrations** instead — [Drivetrain guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope)
- Some integrations require **both** a partner-issued `Client ID`/`Client Secret` (identifies the app) **and** a user-generated `Access Key`/`Secret` (identifies/authorizes the account's data) — [Drivetrain guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope)

### Inferences
- **What to store in env vars** depends on the path chosen:
  - Forms API path: `SKYSLOPE_CLIENT_ID`, `SKYSLOPE_CLIENT_SECRET`, `SKYSLOPE_REDIRECT_URI`, and the issued OAuth **refresh token** per connected user (store securely; it rotates). Access tokens are short-lived and derived at runtime.
  - Offers API path: `SKYSLOPE_CLIENT_ID` + `SKYSLOPE_CLIENT_SECRET` (base64 them per request for Basic auth); access token fetched/cached at runtime.
  - Legacy/data (Access Key) path: `SKYSLOPE_ACCESS_KEY` + `SKYSLOPE_SECRET_KEY` (and possibly a Client ID/Secret pair).
- Charlotte's **two 2020 Access Key IDs with paired Secrets** map to the per-user Access Key/Secret scheme (the legacy data/Transaction-Management style auth), **not** the modern Forms OAuth client credentials. They are almost certainly a different auth path than the Forms API.

### Gaps
- **No documentation confirms HMAC signing** for any SkySlope API. The Access Key/Secret appear to be used as a credential pair exchanged for a token or sent directly — the exact request mechanics for the legacy/Transaction-Management API are undocumented publicly. Must confirm with SkySlope.
- **Whether the 2020 Access Keys are still valid** and whether current auth is the same as 2020 is **not documented anywhere** — this requires contacting SkySlope's API/partner team to verify (keys may have been migrated to the newer OAuth model, or may still work against a legacy endpoint).

## What data can be READ via the API

### Takeaway
The Partnership/Forms API exposes rich transaction data: **files (transactions) with property, prices, acceptance/closing dates; contacts (parties with roles, names, emails, phones); documents (list + download signed/executed PDFs); envelopes/signers; templates; libraries/forms**. It covers the party + document data the CRM needs.

### Cited Findings
- **File (transaction) fields**: `id`, `name`, `fileType`, `representationType` (Buyer/Seller/Tenant/Landlord), `mlsNumber`, `purchasePrice`, `closingDateTime`, `acceptanceDateTime`, `property`, `contacts`, `commissions`, `documentData`, `isArchived`, `isDeleted`, audit fields, `ownedBy` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Contact (party) fields**: `id`, `type` (e.g. Buyer, Seller, BuyerAgent, TitleOfficer), `actionAttribute` (NeedsToSign/CanView/ReceivesCopy/NoAction/Empty), name fields, `email`, phone numbers, `companyName`, `isEntity`, `isUser`, `isFileOwner`, license and MLS codes, `primaryAddress` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **File read endpoints**: `GET /files` (list; paginated, filterable, sortable), `GET /files/{fileId}`; contacts via `GET`/`POST /files/{fileId}/contacts` and `PUT /files/contacts/{contactId}` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Documents**: `GET`/`PATCH /files/{fileId}/documents` (list/add), `POST /files/{fileId}/documents/upload` (upload PDF, max 25MB), `GET /files/{fileId}/documents/download` and `/download/pdf`, `GET`/`PATCH`/`DELETE /documents/{documentId}`. Document fields: `id`, `formName`, `formId`, `formVersionId`, `fileId`, `pageCount`, `documentType`, `thumbnailURL`, `fields` (paginated) — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Signed/executed PDFs** can be listed and downloaded: `GET /documents/signed/{fileId}` and `GET /documents/signed/{fileId}/envelope/{formsEnvelopeId}`. Signed-document object: `envelopeId`, `digisignDocumentGuid`, `dateSigned`, `documentName`, `documentUrl`, `documentAvailable`, `unavailableReason` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Envelope** fields: `id`, `name`, `status`, `dateSent`, `documentIds`, `signers` (id, `dateSigned`, `contactId`); envelopes via `GET`/`POST /files/{fileId}/envelopes` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Buyer Agreements** (`GET /buyer-agreements/market`): `id`, `memberName`, `memberId`, `executionDate`, `expirationDate`, `completedDate`, `isCarBRBC` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- **Offers API** reads listings, offers, offer details, and counts/analytics by agent or date range (tag groups Offers, Listings, Analytics, Reporting) — [API Evangelist repo README](https://github.com/api-evangelist/skyslope)
- Third-party data integrations confirm the practical read surface is **Listings and Sales** (transaction files) synced out of SkySlope — [Drivetrain guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope); [Portable.io SkySlope connector](https://portable.io/connectors/skyslope)

### Inferences
- The Forms API's File + Contacts + Documents objects contain essentially everything the CRM needs to auto-create a transaction: property address, purchase price, acceptance date, closing date, parties with role/name/email/phone, and executed PDFs. "Effective/acceptance" maps to `acceptanceDateTime`; "closing" to `closingDateTime`.
- **Contingency/inspection/financing deadlines** are not exposed as first-class top-level File fields in the public docs — they may live inside `documentData`/`fields` (parsed form fields) rather than as structured dates, or in the Transaction Management API. Treat per-deadline dates as uncertain.

### Gaps
- No explicit public field found for **transaction status/stage** on the Forms File object (there is `isArchived`/`isDeleted` and envelope `status`, but not a pipeline "stage"); checklist/status data is more a Transaction Management concept — unconfirmed for the public API.
- Structured **contingency / inspection / financing deadline** fields are not documented as discrete File properties; likely form-field-level or TM-API-only.

## Event / webhook support (push vs poll)

### Takeaway
Publicly, SkySlope is **poll-first** for transaction changes, with one documented push event: a **signed-documents webhook**. A broader event catalog (file created, contract accepted, document added, checklist/status changed) is **not documented publicly** and must be confirmed with SkySlope.

### Cited Findings
- Signed-documents webhook: `POST /documents/sign/subscribe/{fileId}` (scope `forms.webhooks`), body `webhookUrl`; fires "when documents are signed"; payload format not published — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)
- A generic **Webhooks** resource is listed in the community API index (alongside Files, Contacts, Documents, Envelopes, etc.), but with no documented event types or payloads — [API Evangelist provider profile](https://providers.apievangelist.com/providers/skyslope/)
- No "transaction created" or "status changed" webhook is documented in the public reference; change detection otherwise relies on `GET /files` listing (paginated/filterable/sortable) — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs)

### Inferences
- A workable architecture today: subscribe to the signing webhook to catch "contract executed" moments per file, and run a scheduled poll of `GET /files` (filtered by modified/updated or acceptance date) to catch new files and field changes, upserting into Supabase keyed by SkySlope file `id`.

### Gaps
- Whether SkySlope offers file-created / status-changed / document-added webhooks (the ideal triggers for auto-creating a transaction) is **undocumented** — confirm with SkySlope partner team.

## Product-line distinctions (which API carries the data; one API or several)

### Takeaway
They are **separate APIs**, not one. **SkySlope Forms / Partnership API** carries the party + document + transaction-file data you need (DigiSign e-sign is embedded within it, surfaced via envelopes/signed documents). **Offers** is a separate API for listings/offers. **Transaction Management** is a separate BETA API. **Books** (accounting) has no public API found.

### Cited Findings
- SkySlope (transaction management/Forms), SkySlope Forms, DigiSign (e-sign), and SkySlope Books are distinct products; Books = "back office accounting and commission disbursement" — [GetApp SkySlope profile](https://www.getapp.com/all-software/a/skyslope); [API Evangelist provider profile](https://providers.apievangelist.com/providers/skyslope/)
- DigiSign is the e-signature engine used **inside** SkySlope Forms; signed documents reference `digisignDocumentGuid` — [SkySlope Partner API docs](https://forms.skyslope.com/partner/api/docs); [Rechat SkySlope integration note](https://help.rechat.com/whats-new/skyslope-integration-fill-send-and-sync-without-leaving-your-deal)
- Forms/Partnership API covers transaction files, documents, contacts (parties), envelopes, forms libraries, templates — [API Evangelist repo README](https://github.com/api-evangelist/skyslope)
- Offers API is a separate program (client-credentials auth) for listings/offers/analytics — [API Evangelist repo README](https://github.com/api-evangelist/skyslope)

### Inferences
- Target the **Partnership/Forms API** for the CRM auto-create use case. DigiSign data comes free via that API's envelope/signed-document endpoints — no separate DigiSign API integration needed. Books is irrelevant to transaction/party sync.

### Gaps
- No public confirmation of a standalone DigiSign API or a Books API.

## Rate limits, data retention/compliance, and cost

### Takeaway
SkySlope publishes **no numeric rate limits**; on throttling it returns HTTP 429 (use exponential backoff + Retry-After). Usage is bounded by the partner/brokerage agreement rather than a public quota. No public pricing for API access — it is gated behind a partner relationship.

### Cited Findings
- No fixed numeric request-rate limit is documented for the Partnership/Forms or Offers APIs; exhausted limits return **HTTP 429**; clients should use exponential backoff with jitter and honor `Retry-After`. This profile is written by API Evangelist and **not verified against a SkySlope-published page** — [API Evangelist rate-limits profile](https://apis.io/rate-limits/skyslope/skyslope-rate-limits/)
- Usage is bounded by the **partner/brokerage agreement** rather than a public quota; e-signature envelope volume is governed by the user's product plan tier, not the API — [API Evangelist rate-limits profile](https://apis.io/rate-limits/skyslope/skyslope-rate-limits/)
- Data access scope is inherently limited to the authorizing account's permissions (agent keys = that agent's files; broker/admin keys = brokerage files) — a practical compliance boundary — [Drivetrain guide](https://integrations.drivetrain.ai/integration-guide/readme/others/integrating-with-skyslope)
- CRMLS requires agents to use DigiSign through SkySlope for the BRBC form to be tracked (an MLS data-tracking rule, not an API quota) — [CRMLS KB](https://kb.crmls.org/?p=10118)

### Inferences
- MLS/brokerage data rules (e.g., MichRIC/GMAR in Charlotte's market) will constrain what can be redisplayed, but API-sourced transaction data is the brokerage's own file data (parties, dates, documents), which is generally less restricted than IDX listing redistribution — still worth confirming against brokerage/MLS agreements.

### Gaps
- Actual numeric rate limits are unconfirmed (API Evangelist profile is unofficial). Confirm with SkySlope.
- **No public cost/pricing for API access** found; likely negotiated per partner agreement.
- Data retention policy of the API is not documented publicly.

## Zapier / Make connector availability

### Takeaway
**No reliable first-party SkySlope connector exists on Zapier or Make** as of this research. The Zapier SkySlope app page returned 404; Tray.ai explicitly says there is no pre-built SkySlope connector. Third parties (API Nation, LeadsBridge, Portable.io) wrap SkySlope but via its API / username-password, not a native Zapier app.

### Cited Findings
- `https://zapier.com/apps/skyslope/integrations` returns **HTTP 404** (no SkySlope Zapier app at that path) — [Zapier (404)](https://zapier.com/apps/skyslope/integrations)
- Tray.ai: "There is currently no pre-built and ready to use Skyslope connector available at the moment"; suggests HTTP Client / Webhook Trigger / Connector Builder instead — [Tray.ai SkySlope connectors](https://tray.ai/connectors/skyslope-box-integrations)
- No Make.com (Integromat) SkySlope connector surfaced in search; practical route would be Make's generic HTTP/webhook modules against the API — [search results, Make connector](https://portable.io/connectors/skyslope)
- API Nation offers SkySlope automation using the user's **Access Key + Secret** (not a native Zapier app) — [API Nation KB](https://support.apination.com/kb/article/62-how-to-locate-your-skyslope-access-secret-keys/)
- LeadsBridge offers SkySlope connectors that authenticate with **username and password** (lead-sync oriented, not transaction webhooks) — [LeadsBridge SkySlope](https://leadsbridge.com/integrations/skyslope/outgoing-webhook)
- Portable.io provides a SkySlope → data-warehouse (Snowflake/BigQuery/Redshift) connector — [Portable.io SkySlope](https://portable.io/connectors/skyslope)

### Inferences
- There is no shortcut via an off-the-shelf Zapier/Make SkySlope trigger. The CRM should integrate **directly against the Partnership/Forms API** (OAuth) plus the signing webhook, or use a middleware like API Nation if a code-light path is preferred. Expect to build the "contract executed → upsert transaction" logic yourself.

### Gaps
- Could not confirm whether a SkySlope Zapier app exists under a different slug or is private/partner-only; the canonical path 404s, strongly suggesting none is publicly listed.

---

## Consolidated recommendation for the Sold It Today CRM (inference)
- **Primary path:** integrate directly with the **SkySlope Partnership/Forms API** (`https://forms.skyslope.com/partner/api`) using OAuth 2.0 auth-code + PKCE via `accounts.skyslope.com`. Store `client_id`/`client_secret` + per-user rotating `refresh_token` in env/secrets. Poll `GET /files` for new/updated transactions; subscribe to `POST /documents/sign/subscribe/{fileId}` for executed-contract push; pull parties from `/files/{fileId}/contacts` and executed PDFs from `/documents/signed/{fileId}`. Upsert into Supabase keyed by SkySlope file `id`.
- **First action items requiring SkySlope contact (all currently gaps):** (1) request/confirm partner `client_id`/`client_secret`; (2) ask whether the **2020 Access Keys** still work and against which API; (3) ask for the **full webhook event catalog** (file created, status/checklist changed, document added) and payload schemas; (4) ask about **Transaction Management API (BETA)** access for structured status/stage + deadline data; (5) confirm **rate limits** and any **API cost**.
