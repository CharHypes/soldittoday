# Integration Architecture & Patterns: One-Way Sync of Vendor Transaction Platforms into a Next.js + Supabase CRM

Scope note: this covers ARCHITECTURE and PATTERNS (webhook/polling design, dedup, data model, document ingestion, no-code bridges, operational gotchas), not exhaustive vendor API field listings. Dotloop is used throughout as the concrete baseline because it is the one of the three with a fully public, documented API + webhooks. Current as of 2026-10.

---

## Q1. Webhooks vs polling: ingesting vendor events into Next.js (Vercel) + Supabase

### Takeaway
Use webhooks where the vendor offers them (Dotloop does; SkySlope/TransactionDesk effectively do not expose public webhooks), always backed by a scheduled polling reconciler because webhook delivery is at-least-once and lossy. The proven receiver shape is: verify signature, persist raw payload immediately, enqueue, return 2xx fast (within seconds), then process async and idempotently.

### Cited Findings
- Webhook delivery is at-least-once, so the same event will arrive more than once and receivers must be idempotent; dedupe on the provider's event ID when present, and if no key can be built, quarantine the event rather than guess. — [DEV: Webhook best practices](https://dev.to/henry_hang/webhook-best-practices-retry-logic-idempotency-and-error-handling-27i3); [Webhookrelay: retries & idempotency](https://webhookrelay.com/blog/webhook-retries-and-idempotency/)
- The dedupe check must be atomic: a two-step check-then-act lets concurrent retries both pass, so wrap it in one transaction or rely on a DB unique constraint as the gatekeeper. — [Inquir: idempotency for webhooks and jobs](https://inquir.org/blog/idempotency-making-webhooks-and-jobs-safe-to-retry)
- Recommended handler flow: Receive -> Validate -> Persist/Enqueue -> Respond (2xx) -> Process asynchronously; persist the raw payload the moment it arrives, before any processing. — [DEV: Webhook best practices](https://dev.to/henry_hang/webhook-best-practices-retry-logic-idempotency-and-error-handling-27i3)
- Permanently failing events should route to a dead-letter queue (DLQ) carrying the error and attempt count, and DLQ items must be easy to inspect and safe to replay after the bug is fixed. — [DEV: Webhook best practices](https://dev.to/henry_hang/webhook-best-practices-retry-logic-idempotency-and-error-handling-27i3)
- Retry windows vary wildly by provider (Stripe ~3 days, Shopify disables an endpoint after ~19h of failure, Slack 3 attempts, GitHub none), so you cannot assume the sender will retry; webhooks alone are not enough and a scheduled reconciliation backstop is needed to close silently-dropped-delivery gaps. — [Webhookrelay: retries & idempotency](https://webhookrelay.com/blog/webhook-retries-and-idempotency/)
- Dotloop's concrete delivery contract (useful as the reference target): events are HTTPS POSTs to the subscription URL; delivery is at-least-once (duplicates possible, receivers must be idempotent); the receiver has a **5-second timeout** to respond; any non-2xx or timeout triggers retry with backoff of **30s, 1m, 15m, 30m, 1h, 2h, 4h, 8h**, after which the event is marked FAILED with **no manual redrive**; repeated failures may disable the subscription; a single action can emit several events so the app should fetch the related resource for each one. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- Dotloop events are retained **90 days** and are queryable at `GET /subscription/:id/event` filterable by `delivery_status` (PENDING, PENDING_RETRY, SCHEDULED, SUCCESS, FAILED, DISABLED), which doubles as a catch-up/reconcile source if your endpoint was down. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- Polling/incremental sync pattern: store a cursor (a value saved between polls marking the last record/timestamp processed) and pass it back on the next poll; the most common cursor is an `updated_at` timestamp, records at or below the cursor are treated as already synced; checkpoint state only after a successful run; a failed run resumes from the same cursor rather than restarting. — [Airbyte: incremental syncs](https://docs.airbyte.com/connector-development/connector-builder-ui/incremental-sync); [Nango: sync efficiency](https://www.nango.dev/docs/guides/functions/syncs/sync-efficiency); [Inquir: scheduled data sync](https://inquir.org/use-cases/scheduled-data-sync)
- Key polling pitfall: a last-modified timestamp filter misses records created and never touched again; pair it with a creation-time filter or ID cursor, and run a periodic full reconcile (e.g. nightly); a common structure separates a time-anchored "what's new since last run" pass from a position-based backfill that pages history to completion. — [Flxpoint: syncing data incrementally](https://www.apihelpcenter.flxpoint.com/docs/guides/syncing-data-incrementally); [Medium: incremental sync / backfill](https://medium.com/@nkangprecious26/incremental-sync-frontsync-backfill-24529c575854)
- Supabase native building blocks for this: Edge Functions (Deno/TypeScript) are listed for webhook-receiver use (Stripe/GitHub style) and can write to Storage with the service key kept server-side; Supabase Queues is a Postgres-native durable queue on the pgmq extension with guaranteed, exactly-once-within-visibility-window delivery to the consumer (that is consumer redelivery, not enqueue dedup). — [Supabase Edge Functions](https://supabase.com/docs/guides/functions); [Supabase Queues](https://supabase.com/docs/guides/queues)

### Inferences
- Concrete recommended receiver for this stack: a Next.js Route Handler on Vercel (or a Supabase Edge Function) that (1) reads the raw body, (2) verifies the signature against the raw bytes before JSON parsing, (3) INSERTs the raw payload into a `webhook_events` table with a unique index on `(provider, external_event_id)` so a duplicate insert fails cheaply and acts as the idempotency gate, (4) returns 2xx immediately, (5) a separate worker (Supabase Queue consumer, cron, or background function) processes the row. Do the heavy mapping/dedup in the worker, not the HTTP handler, because Dotloop gives only a 5-second response budget and Vercel function timeouts/cold starts can blow that.
- Because Dotloop fires several events per action and says to re-fetch the resource, treat the webhook as a "something changed, go pull it" signal rather than a source of truth; store the event, then GET the loop/participant to get current state. This also makes the polling fallback and the webhook path converge on the same "fetch + upsert" code.
- For SkySlope/TransactionDesk (no public webhooks found), the only viable native ingestion is scheduled incremental polling with an `updated_at`/`last_synced` cursor per connected account plus a nightly full reconcile. Vercel Cron or Supabase cron (pg_cron) can drive it.

### Gaps
- Could not confirm Vercel/Supabase-specific max payload or timeout numbers against a primary source in this pass; flag as implementation detail to verify.
- pgmq does not document a native enqueue-dedup/unique-key option; dedup must be enforced by your own unique index on a processed-events table, not by the queue. — [Supabase Queues](https://supabase.com/docs/guides/queues)

---

## Q2. Entity-matching / dedup: avoid duplicate transactions; treat addenda as updates

### Takeaway
Use a two-stage match: deterministic first (match on stored `external_id`, which is exact and near-zero false-positive), then probabilistic/fuzzy fallback (normalized property address + party names + key dates) only when no external id exists. Signed addenda/amendments should be matched to the parent transaction by the same external loop/transaction id and applied as updates or child document rows, never as new transactions.

### Cited Findings
- Entity resolution (a.k.a. record linkage / data matching) identifies records referring to the same real-world entity even when represented differently, and is needed when joining datasets on entities that may or may not share a common identifier. — [PeopleDataLabs: entity resolution guide](https://www.peopledatalabs.com/data-lab/datafication/entity-resolution-guide)
- Standard pipeline is two-stage: deterministic matching on stable identifiers (very low false-positive rate but misses records lacking exact identifiers), then probabilistic scoring for the rest. — [Komo.ai glossary: entity resolution](https://komo.ai/glossary/entity-resolution)
- Addresses alone are weak match keys: address data is only suitable in combination with other attributes and has a wide variety of possible representations, so normalization/standardization must come first. — [CDQ: entity resolution](https://meta.cdq.com/Public:Entity_resolution)
- Typical fuzzy technique: block by normalized token prefix, score with Jaro-Winkler plus token-set matching, merge matches above a threshold into clusters with a canonical record; cleaners standardize inputs (e.g. expand abbreviations) before comparison. — [CDQ: entity resolution](https://meta.cdq.com/Public:Entity_resolution); [Entity Resolve MCP connector](https://glama.ai/mcp/connectors/com.x402supply.entity-resolve/entity-resolve)
- Mature open-source options if you outgrow hand-rolled matching: `dedupe` (Python fuzzy matching/dedup), `Splink` (probabilistic linkage, runs on SQL backends including Postgres/DuckDB), `Zingg` (ML-based, Spark). — [Awesome entity-resolution topics](https://awesome.ecosyste.ms/topics/entity-resolution)
- Operational tuning: track false positives, false negatives, and cluster-size distributions to tune thresholds over time. — [Saber glossary: entity resolution](https://saber.app/glossary/entity-resolution)
- Idempotent-write counterpart from the sync world: make writes idempotent by upserting on a stable external ID. — [Inquir: scheduled data sync](https://inquir.org/use-cases/scheduled-data-sync)

### Inferences
- Concrete matching ladder for this app, in order, stop at first confident hit:
  1. **external_id exact** - look up `external_links` by `(provider, external_id)`. If found, it is an UPDATE to that linked internal transaction. This handles 95%+ of cases and makes addenda/amendments automatically route to the parent (same loop id).
  2. **Address + parties + date fuzzy** - only when no external link exists yet (e.g. a transaction was created manually in-app first, or a second provider is being attached). Normalize the property address (USPS/CASS-style or libpostal parse), block on normalized street+zip, then score party-name overlap (Jaro-Winkler/token-set) and compare contract/close dates. Above threshold = same transaction -> attach a new `external_links` row; below = create new transaction.
- Addenda/amendments: because Dotloop fires `LOOP_UPDATED` and document events against the SAME loop id, and because Splink/Splink-style scoring is unnecessary once an external link exists, addenda are structurally handled by the external_id-first rule. Store each signed addendum as a new `documents` row under the existing transaction with a `document_type` and `version`/`executed_at`, and bump the transaction's status/fields from the amendment. Never let a new document event create a new transaction.
- Keep a human-review queue for fuzzy matches that land in an ambiguous band (e.g. score 0.6-0.85) rather than auto-merging, since false merges in a transaction system are costly to unwind.

### Gaps
- No single authoritative real-estate-specific dedup heuristic found (MLS/address standards like CASS or libpostal were suggested as the next search by one source but not retrieved here). Address-normalization choice is left as an implementation decision.

---

## Q3. Data model: vendor-independent external-links table; party-role -> contact mapping

### Takeaway
Model one internal `transactions` row linked to MANY provider records via a thin, vendor-neutral `external_links` table carrying `(provider, external_id, external_url, last_synced, raw_payload)`. Map vendor party roles (buyer/seller/listing agent/etc.) onto your own `contacts` + a `transaction_parties` join with a normalized `role`, deduping contacts the same external-id-first-then-fuzzy way.

### Cited Findings
- The external-links concept mirrors the standard integration practice of keying idempotent upserts on a stable external ID, with one provider's id namespace kept separate per provider. — [Inquir: scheduled data sync](https://inquir.org/use-cases/scheduled-data-sync)
- Dotloop's resource shape to map FROM: a Loop (transaction) has Participants (`GET/POST .../loop/:id/participant`, each with `participant_id`), loop Detail fields, Folders and Documents, and Contacts are a separate top-level resource (`/contact`) distinct from loop participants; a loop can also be MERGED (returns 301 with Location to the surviving loop). — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- Dotloop distinguishes a participant (a party on a specific loop) from a contact (an address-book entity), and emits separate `LOOP_PARTICIPANT_*` and `CONTACT_*` events, which maps cleanly to a transaction_parties (per-deal) vs contacts (global person) split. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)

### Inferences
- Suggested schema (Supabase/Postgres), org-scoped per your SaaS architecture memory (every table carries `organization_id`):
  - `transactions` - your canonical deal. Internal fields only.
  - `external_links` - `id, organization_id, transaction_id (fk), provider (enum: dotloop|skyslope|transactiondesk|dotloop...), external_id (text), external_url (text), last_synced (timestamptz), raw_payload (jsonb), created_at`. **Unique index on `(provider, external_id)`** = the dedup/idempotency gate. One transaction can have many rows here (one per provider), satisfying "one internal transaction linked to MULTIPLE providers."
  - `contacts` - global person/company per org; may itself carry `external_links`-style provider ids (or a parallel `contact_external_links`) to dedup people across providers.
  - `transaction_parties` - join of `transaction_id` + `contact_id` + normalized `role` (buyer, seller, buyer_agent, listing_agent, lender, title, tc, other) + `provider_role_raw` (keep the vendor's original role string for audit) + `provider`.
  - `webhook_events` - raw inbound events with `(provider, external_event_id)` unique; and a `sync_state` table holding the per-account polling cursor (`provider, account_id, last_synced, last_cursor`).
- Store `raw_payload` as jsonb on both `external_links` (latest snapshot) and `webhook_events` (immutable event log). The immutable log is your DLQ/replay source; the snapshot powers "re-fetch and upsert."
- Role mapping must be a translation table (provider role string -> your enum) because SkySlope, Dotloop, and TransactionDesk name roles differently. Keep the raw string so a new/unknown role degrades to `other` without data loss.
- Handle Dotloop's loop-merge (301) explicitly: when you poll a loop and get redirected, update the `external_id` on the existing `external_links` row to the surviving loop id instead of creating a duplicate.

### Gaps
- Could not retrieve SkySlope's and TransactionDesk's exact party/role object shapes in this pass (other researchers cover vendor API specifics); the role-translation table will need their field lists.

---

## Q4. Document ingestion: pulling signed PDFs to Supabase Storage; per-transaction inbound email fallback

### Takeaway
Primary path: when a document event/webhook fires, GET the signed PDF from the vendor's document endpoint and write it to a private Supabase Storage bucket with metadata rows linking it to the transaction. Fallback path (works even for vendors with no document API): give each transaction a unique inbound email address, route it through an inbound-email-parsing provider (Postmark/SendGrid/Mailgun) whose webhook delivers attachments to your endpoint, which uploads them to the same bucket.

### Cited Findings
- Dotloop exposes document retrieval and upload directly: `GET .../folder/:folder_id/document`, `GET .../document/:document_id`, and upload via `POST .../folder/:id/document/` as multipart form data; folders/documents live under a loop. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- Supabase Edge Functions can upload files to a Storage bucket using the Supabase client with a server-side key and the storage `upload` call (content type + `upsert` option); the secret key must stay server-side, and private files require signed URLs for access. — [Supabase: integrating with Storage](https://supabase.com/docs/guides/functions/storage-caching); [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- Inbound email as an ingestion channel is an established pattern: Postmark immediately POSTs received mail to your configured webhook URL, with attachments included inline in the JSON; Postmark leaves processing to you; retry behavior is a non-200 triggers retries, a 403 stops them, total of 10 retries. — [Postmark: parse an email](https://postmarkapp.com/developer/user-guide/inbound/parse-an-email)
- Reference implementation of exactly "email attachment -> object storage": a service uses Postmark Inbound to store attachments in your own S3 folder under `<email-address>/<attachment-name>`, and the code works with any S3-compatible store including Cloudflare R2 / DigitalOcean Spaces (so Supabase Storage, which is S3-compatible, fits the same pattern). — [DEV: email to S3](https://dev.to/levinunnink/email-to-s3-3n1p)

### Inferences
- Document flow: webhook signals a doc change -> worker calls vendor `GET document` -> stream bytes into Supabase Storage private bucket at a deterministic key like `org/{org_id}/transaction/{txn_id}/{provider}/{external_doc_id}-{version}.pdf` -> insert a `documents` row (`transaction_id, provider, external_doc_id, storage_path, document_type, executed_at, checksum`). Use the checksum (or external_doc_id + version) as a unique key so re-pulling the same signed PDF upserts rather than duplicates. Serve to the app via short-lived signed URLs (private bucket).
- Per-transaction inbound email is the strongest vendor-agnostic fallback and matches your Transaction-integration memory note ("unique inbound email per transaction"): mint `txn+{token}@inbound.soldittoday...` per transaction, store the token->transaction_id map, configure the provider's inbound webhook to hit a Next.js/Edge handler, decode attachments, and run them through the same Storage-upload + `documents`-insert path. This also captures PDFs that only ever arrive by email (e.g. from a cooperating agent) and signed docs from SkySlope/TransactionDesk if their doc API is gated.
- Make the inbound-email handler idempotent too (dedupe on provider message id + attachment checksum) because Postmark will retry up to 10 times on non-200.

### Gaps
- Did not verify Supabase Storage per-object size limits or multipart-upload specifics for very large signed PDF packets; flag for implementation.

---

## Q5. No-code bridges: Zapier / Make for SkySlope, TransactionDesk/zipForm, Dotloop; Dotloop public API as comparison

### Takeaway
Dotloop has both a public API (OAuth + webhooks) AND a mature Zapier app (Create Loop action, New Loop trigger), so it can go either no-code or native. SkySlope and TransactionDesk/zipForm have NO confirmed first-class Zapier or Make connector in these results; third-party Zapier-based SkySlope bridges have existed historically but are not documented native connectors. Treat Zapier/Make as a legitimate INTERIM bridge for low-volume, non-critical flows, not a production dependency for the core "contract executed -> transaction created" path.

### Cited Findings
- Dotloop on Zapier is real and loop-centric: Zapier can trigger on a New Loop created in Dotloop and log it as a HubSpot deal, and offers a "Create Loop" action with fields like profile, loop name, transaction type, template; participant-level triggers/fields were not found on the pages reviewed. — [Zapier: Dotloop + HubSpot](https://zapier.com/apps/dotloop/integrations/hubspot); [Zapier: Dotloop + Pipeline](https://zapier.com/apps/dotloop/integrations/pipeline)
- Dotloop's public API is the comparison baseline: OAuth 2.0 (web-server apps only), ~12h access tokens, refresh invalidates the prior token (clustered apps must share one token), 100 req/min per client per user (429 on exceed, with `X-RateLimit-*` headers), `POST /loop-it` single-call facade to create+populate a loop, full webhook subscription API with HMAC-SHA1 signatures. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- No native SkySlope Zapier connector was confirmed; a general iPaaS checklist merely lists Zapier/Make/Workato as the kind of connector to ask a vendor about, and advises confirming directly with SkySlope. — [ITQlick: SkySlope integrations](https://www.itqlick.com/skyslope/integrations)
- Third-party Zapier-based SkySlope connections have existed: a Sisu setup guide tells users to turn off existing integrations "i.e. API Nation, Zapier, Real Synch," implying SkySlope<->Zapier bridges were in use, but does not document how they work. — [Sisu KB: creating SkySlope transactions](https://kb.sisu.co/en/articles/3498325-creating-skyslope-transactions-from-sisu)
- SkySlope direct API integrations are done by other platforms today using an Access Key + Access Secret generated at the user level (same access as that user's account), found in SkySlope's Integrations tab. — [Drivetrain: integrating with SkySlope](https://integrations.drivetrain.ai/integration-guide/integrate-with-drivetrain/others/integrating-with-skyslope); [Rechat API: SkySlope](https://docs.api.rechat.com/master/skyslope.html)
- No Make.com connector for SkySlope, TransactionDesk, or zipForm was found; separately, Tray.ai explicitly states there is "no pre-built and ready to use SkySlope connector" on its platform and suggests generic HTTP/webhook, which signals a prebuilt SkySlope connector is uncommon across iPaaS platforms. — [Tray.ai: SkySlope connectors](https://tray.ai/connectors/skyslope-close-integrations)
- SkySlope and zipForm/zipLogix had an official product integration announced in 2015 (zipForm Plus <-> SkySlope transaction management); current status unconfirmed. — [RISMedia: zipLogix + SkySlope](https://www.rismedia.com/2015/05/21/ziplogix-teams-up-with-skyslope-for-transaction-management-integration/)
- Zapier vs native tradeoffs (general, from vendor-leaning but consistent sources): native/event-driven is sub-second vs Zapier's 1-15 min polling (15 min on lower tiers); a Zap's auth lives in the customer's Zapier account so it "silently dies" when a customer leaves or a plan lapses; robust retry/error-alerting in production typically requires code; Zapier is per-task priced (scales with volume) vs native being fixed/included; Zapier has no HIPAA/BAA support. Consensus is hybrid: native for core high-risk flows, Zapier for non-critical/long-tail. — [Supportbench: native vs Zapier](https://www.supportbench.com/?p=25743); [Truto: native vs Zapier](https://truto.one/blog/native-integrations-vs-zapier-what-enterprise-b2b-saas-teams-actually-need/); [Lowcode.agency: when Zapier needs custom dev](https://www.lowcode.agency/blog/when-your-zapier-automation-needs-custom-development)

### Inferences
- Pragmatic sequencing for this build: (1) ship Dotloop native first via its public API + webhooks (it is the only one fully self-serve-documented). (2) For SkySlope, pursue the direct Access Key/Secret API (you already hold 2 Access Key IDs per the SkySlope memory note) rather than Zapier, since no reliable native Zapier connector exists and the direct API is what other platforms use. (3) Use Zapier/Make only as a stopgap to prove the flow or for a one-off vendor you cannot reach natively, and expect polling latency (minutes) and silent auth-expiry failures.
- The "silent death" failure mode is the decisive reason not to make Zapier the production path for "contract executed -> transaction created": a lapsed Zapier plan or disconnected auth would drop executed contracts with no alert, which is unacceptable for a transaction system of record.
- Dotloop's webhook + HMAC-SHA1 + documented retry schedule makes it the model to replicate; build your receiver to Dotloop's contract and the same receiver will serve any future vendor webhook.

### Gaps
- Could not load Zapier's SkySlope app page directly (404), so cannot definitively confirm SkySlope is absent from Zapier's directory as of 2026 vs merely not indexed; recommend checking zapier.com/apps and make.com/en/integrations directly at build time.
- TransactionDesk/zipForm (Lone Wolf) API surface, webhook availability, and any Zapier/Make presence were not found in these results and remain open for the vendor-specific researcher.

---

## Q6. Realistic effort / gotchas: OAuth refresh, sandbox, access tiers, MLS retention, rate limits, partner-gating

### Takeaway
The biggest non-obvious risks are partner-gating/manual approval (can block a self-serve build before it starts), absent sandboxes (you test against production/real data), token-refresh quirks that break multi-instance deploys, and agent-vs-brokerage access scope. Dotloop documents these concretely; SkySlope/TransactionDesk gating details are under-documented publicly.

### Cited Findings
- **OAuth token refresh (Dotloop, as the documented example):** access tokens last ~12 hours; **refreshing invalidates the previous access token**, so clustered/multi-instance apps must share one token (a naive per-instance refresh will log each other out). Token exchange/refresh uses HTTP Basic auth with client id/secret. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- **Rate limits:** Dotloop allows 100 requests/min per client per user, returns 429 on exceed, and exposes `X-RateLimit-Limit/Remaining/Reset`; per-user scoping means a brokerage-wide poll fans out across many users' quotas. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- **Partner-gating / approval:** a third-party report says Dotloop registration is a manual partner application plus a signed API License Agreement, and webhooks need separate approval from support. — [SuperGood: Dotloop API report](https://supergood.ai/docs/dotloop-api)
- **No sandbox:** the same report states Dotloop has no sandbox and no first-party SDK; you develop against production. — [SuperGood: Dotloop API report](https://supergood.ai/docs/dotloop-api)
- **Access scope (agent vs brokerage):** Dotloop loop access is limited to INDIVIDUAL profiles, and scopes are granular (`account:read`, `loop:read/write`, `contact:read/write`, `template:read`); webhook subscriptions target a USER or a PROFILE and are scoped to the API client that created them. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)
- **SkySlope access model:** credentials are an Access Key + Access Secret generated at the USER level, carrying the same access as that user's account; during onboarding SkySlope sends a password-protected zip with a Client ID/Secret pair; no public sandbox or partner-approval process surfaced. — [Drivetrain: integrating with SkySlope](https://integrations.drivetrain.ai/integration-guide/integrate-with-drivetrain/others/integrating-with-skyslope); [Experience.com via search]; [Rechat: SkySlope](https://docs.api.rechat.com/master/skyslope.html)
- **Webhook event retention:** Dotloop keeps events 90 days and offers no manual redrive after final failure, so your reconciler must detect and backfill gaps within that window. — [Dotloop Public API v2 docs](https://dotloop.github.io/public-api/)

### Inferences
- Build-order risk: confirm partner approval / API license for each vendor BEFORE estimating, because a signed agreement + manual webhook approval (as reported for Dotloop) can add weeks and is outside engineering control. This is the single most likely thing to block a self-serve build.
- No-sandbox means your dev/test strategy must use a real (ideally throwaway or low-stakes) brokerage/agent account and careful write-guards; combined with your "no real client data in code / security-first" memory rule, keep all tokens in env vars / Supabase Vault and never commit real loop data into fixtures.
- Token-refresh-invalidates-prior-token forces a single shared-token refresher (one cron/worker refreshing and writing the token to a shared store, e.g. a `provider_tokens` table or Supabase Vault) rather than each Vercel instance refreshing independently. This is a real footgun on serverless where many cold-started instances could race.
- User-level credentials + per-user rate limits mean brokerage-level ingestion is really N agent connections; design `external_links`/`sync_state` and quota handling per connected user/profile, and stagger polling to stay under 100 req/min/user.

### Gaps
- No primary source found for MLS data-retention rules as they apply to syncing/storing transaction+document data (this is governed by each MLS's rules-of-use and IDX/VOW policy, which your IDX memory note already tracks separately); flag that signed-document and party-PII retention must be checked against the governing MLS/brokerage policy, but I have no citable rule here.
- SkySlope and TransactionDesk sandbox availability, rate limits, and formal partner-gating are not documented in public sources retrieved; left for the vendor-specific researchers.
- Whether Dotloop's "manual partner application + signed license + webhook approval" is still current in 2026 relies on one third-party aggregator (SuperGood), not Dotloop's own page; treat as probable-but-unconfirmed and verify with Dotloop directly.
