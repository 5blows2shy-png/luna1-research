# SETORA Alpha architecture proposal

Status: architecture review draft  
Scope: AI infrastructure, data centers, and power infrastructure  
Primary product: SETORA MAP  
Supporting product: SETORA PULSE

## 1. Alpha objective

SETORA Alpha proves one narrow, auditable data loop:

1. discover a new SEC filing for a covered company;
2. preserve the filing and its retrieval metadata;
3. resolve the filing to a canonical entity;
4. extract candidate capital events with supporting evidence;
5. let a researcher approve, edit, or reject each candidate;
6. publish approved events to SETORA PULSE through Server-Sent Events; and
7. update the temporal relationships and explainable Flow Scores displayed in SETORA MAP.

Alpha covers approximately 25–40 companies in one connected ecosystem. Breadth is deliberately constrained so reliability, lineage, and review quality can be established before adding more markets or sources.

## 2. Architectural principles

- **Raw fact:** immutable source document and exact evidence location.
- **Normalized data:** canonical entity, period, metric, amount, units, and dates derived from a raw source.
- **SETORA interpretation:** reviewed event classification, relationship, note, or score derived from normalized observations.
- Every derived record carries a direct or join-table path back to a source document.
- Observations and scores are append-only. Corrections create superseding records rather than rewriting history.
- Candidate extraction is never automatically presented as an approved fact.
- Relationship history is represented with effective date ranges, not one mutable “current” edge.
- Public clients receive approved records only.

## 3. Proposed repository tree

This is the target structure for implementation after architecture approval. The current Luna application should not be moved until that migration is planned separately.

```text
/
├── apps/
│   ├── web/                         # Next.js public product and private researcher UI
│   │   ├── src/app/setora/          # Overview, Map, Pulse, entities, methodology
│   │   ├── src/app/admin/setora/    # Protected review and source-health views
│   │   ├── src/components/setora/   # Reusable product UI
│   │   └── src/lib/setora/          # Typed API client and SSE subscription
│   └── api/                         # FastAPI service
│       ├── app/main.py              # Application composition only
│       ├── app/config.py            # Environment-backed server configuration
│       ├── app/api/                 # HTTP and SSE route modules
│       ├── app/database/            # SQLAlchemy engine, sessions, repositories
│       ├── app/models/              # SQLAlchemy persistence models
│       ├── app/schemas/             # Pydantic request/response contracts
│       ├── app/connectors/           # Source connector interface and SEC connector
│       ├── app/ingestion/            # Orchestration, checkpoints, run logging
│       ├── app/extraction/           # Candidate event extraction
│       ├── app/entity_resolution/    # Alias and identifier matching
│       ├── app/relationships/        # Temporal edge versioning and evidence
│       ├── app/scoring/              # Versioned Flow Score calculation
│       ├── app/graph/                # Graph query/read models
│       ├── app/services/             # Approval, publication, and Pulse services
│       ├── alembic/                  # Future SQLAlchemy/Alembic migrations
│       └── tests/                    # Unit, integration, and contract tests
├── database/
│   └── migrations/                  # Reviewed PostgreSQL source-of-truth migrations
├── data/
│   └── sample/                      # Explicitly labeled SAMPLE DATA fixtures
├── docs/
│   ├── setora-alpha-architecture.md
│   └── setora-alpha-schema.md
└── tests/                            # Repository-level architecture/migration checks
```

Why both `database/migrations` and future Alembic files: the reviewed SQL migration defines the initial contract now. After the FastAPI project is approved, Alembic will own subsequent revisions and can adopt this foundation as its baseline.

## 4. Runtime components

### Next.js web application

Renders public MAP and PULSE pages as well as a protected researcher workspace. Server Components should load initial public data. A small Client Component subscribes to the SSE endpoint and merges approved events into the Pulse view. Admin mutations go through authenticated server-side calls; database credentials never reach the browser.

### FastAPI service

Owns ingestion, normalization, review workflows, graph reads, score explanations, and the SSE stream. Route modules remain thin; business rules live in services and persistence logic in repositories.

### PostgreSQL

Acts as the system of record for canonical entities, lineage, review state, temporal relationships, observations, and score history. Foreign keys protect lineage; indexes support event feeds, review queues, entity lookup, and time-window graph queries.

### Raw object storage abstraction

`RawDocumentStore` exposes `put`, `get`, `exists`, and content-hash verification. The local implementation writes outside the public web tree. S3 and Cloudflare R2 implementations can later satisfy the same interface. PostgreSQL stores the object key, checksum, content type, and retrieval metadata—not provider-specific code.

### SEC EDGAR connector

Implements a common connector protocol: `discover`, `fetch`, `checkpoint`, and `health`. Requests include the SEC-compatible product name and contact header, honor backoff, and use a conservative configurable rate limit. Alpha supports 10-K, 10-Q, and 8-K only.

### SSE publication service

An approved event is committed to PostgreSQL before it is published. The SSE endpoint reads from an event cursor ordered by approval/publication time and sends heartbeat comments. Reconnection uses `Last-Event-ID`, so a temporary disconnect does not silently lose events. Alpha can use PostgreSQL-backed polling/notification inside one API deployment; Kafka and Redis are unnecessary.

## 5. Data-layer boundaries

| Layer | SETORA records | Meaning |
|---|---|---|
| Raw fact | `sources`, `source_documents` | What the publisher released and what SETORA retrieved |
| Normalized data | `entities`, `entity_aliases`, `observations`, `financial_metrics` | Consistent identifiers, dates, units, and values |
| SETORA interpretation | `capital_events`, `relationships`, `scores`, `score_components`, `research_notes` | Reviewed classification and analytical conclusions |

An approved capital event must reference at least one observation through `capital_event_observations`. A relationship presented as verified must reference evidence through `relationship_evidence`. Application services enforce these publish-time rules; deferred database constraint triggers can be added once the approval workflow is implemented.

## 6. End-to-end flow

```text
SEC submissions feed
  → SEC connector discovers accession number
  → ingestion run starts and deduplicates by source/document identifier
  → filing bytes enter RawDocumentStore
  → source_document stores object key, SHA-256, form, timestamps, and metadata
  → entity resolver matches CIK first, then reviewed aliases
  → extractor produces normalized observations with exact evidence locators
  → extractor creates candidate capital events linked to those observations
  → researcher opens the source and evidence in the private review queue
  → researcher edits and approves, rejects, or marks needs_review
  → approval service stamps reviewer and approval/publication time
  → approved event becomes visible in public event queries
  → SSE endpoint emits the committed event to SETORA PULSE
  → relationship service creates/closes temporal edges when separately approved
  → scoring service writes a new score and component snapshot
  → SETORA MAP refreshes the affected node/edge read model
```

### Practical data-engineering explanation

- **ETL** means retrieving a filing, extracting useful evidence, and loading normalized records. SETORA keeps the raw input so every transformation can be audited.
- **Normalization** means “Microsoft,” “Microsoft Corp,” and “MSFT” resolve to one entity ID rather than becoming three companies.
- **Entity resolution** uses strong identifiers such as CIK first. Text aliases can propose matches, but ambiguous matches require review.
- **Indexing** creates lookup paths for common questions, such as “new candidate events” or “relationships active on a date,” without duplicating the underlying data.
- **Data lineage** is the chain from an interpretation back through observations to the original filing and evidence location.
- **Event streaming with SSE** is a one-way, reconnectable HTTP stream from FastAPI to the browser. It is enough for a live feed without operating a message broker.

## 7. API boundary proposed for Alpha

Public:

- `GET /v1/themes`
- `GET /v1/entities?theme_id=&query=`
- `GET /v1/entities/{entity_id}`
- `GET /v1/graph?theme_id=&as_of=`
- `GET /v1/events?theme_id=&entity_id=&after=`
- `GET /v1/events/{event_id}`
- `GET /v1/scores/{entity_id}/latest`
- `GET /v1/scores/{entity_id}/history`
- `GET /v1/pulse/stream` (SSE; approved events only)

Private researcher routes:

- `GET /v1/admin/events?status=candidate`
- `PATCH /v1/admin/events/{event_id}`
- `POST /v1/admin/events/{event_id}/approve`
- `POST /v1/admin/events/{event_id}/reject`
- `GET /v1/admin/ingestion-runs`
- `GET /v1/admin/source-documents/{document_id}`
- `PATCH /v1/admin/entity-aliases/{alias_id}`
- `POST /v1/admin/relationships`
- `PATCH /v1/admin/relationships/{relationship_id}`

Pydantic response models expose public-safe fields only. Raw filing access and review metadata remain private unless a source URL is already public and safe to disclose.

## 8. Implementation milestones

### Milestone 0 — architecture approval

Deliverables: this design, schema specification, migration, and migration tests.  
Success: table responsibilities, review boundaries, lineage path, and repository direction are approved before application restructuring.

### Milestone 1 — backend foundation

Create `apps/api`, FastAPI health endpoint, SQLAlchemy models, Pydantic schemas, Alembic baseline, configuration, and PostgreSQL test database.  
Test: migrate a clean database up and down; run model and constraint tests.  
Success: one command boots the API and one command validates the schema.

### Milestone 2 — canonical coverage universe

Seed 25–40 reviewed entities, aliases, three Alpha themes, and clearly marked sample graph records.  
Test: CIK, ticker, and aliases resolve deterministically; ambiguous names enter review.  
Success: every Alpha company has one canonical ID and no invented data appears without `sample` status.

### Milestone 3 — SEC ingestion

Implement connector interface, SEC submissions discovery, 10-K/10-Q/8-K retrieval, local raw store, deduplication, rate limiting, and run logs.  
Test: recorded SEC fixtures plus one opt-in live smoke test.  
Success: a known filing is retrieved once, hashed, stored, linked to its entity, and visible in ingestion health.

### Milestone 4 — candidate extraction and lineage

Begin with deterministic rules and structured filing facts before adding model-assisted extraction. Store candidates and exact supporting evidence.  
Test: fixture filings yield expected candidates; unsupported candidates cannot be approved.  
Success: a researcher can trace every candidate to the filing passage that produced it.

### Milestone 5 — researcher admin

Build protected candidate review, source viewer, entity mapping, relationship review, and ingestion error views.  
Test: authorization, keyboard workflow, approval transitions, and audit fields.  
Success: routine review requires no direct database edits.

### Milestone 6 — SETORA PULSE

Expose approved event APIs and SSE with reconnection.  
Test: approving a candidate emits exactly one public event; reconnecting from an event ID catches up without duplicates.  
Success: an open browser receives a newly approved event without refresh.

### Milestone 7 — SETORA MAP and Flow Score

Build temporal graph query, distinguish verified/inferred edges, integrate Cytoscape.js, and show versioned score explanations.  
Test: `as_of` graph queries, edge evidence rules, score component reconciliation, and accessible node details.  
Success: users can answer “why is this connected?” and “why is this score 82?” from source-linked records.

## 9. Technical risks and controls

| Risk | Alpha control |
|---|---|
| SEC filing formats vary | Store originals, parse by form/version, use recorded fixtures, retain evidence locators |
| Duplicate or amended filings | Unique source/document identifiers and accession-aware deduplication |
| Incorrect entity match | Prefer CIK, retain match method/confidence, require review for ambiguity |
| Extraction false positives | Candidate-only output; no automatic publication |
| Evidence link breaks after parsing | Store raw hash, object key, document identifier, and stable locator metadata |
| Relationship overstatement | Separate inferred/verified status and require evidence before verified publication |
| Score appears predictive | Version methodology, expose components, label it descriptive and non-predictive |
| SSE disconnect loses updates | Persist before emit; cursor plus `Last-Event-ID` replay |
| Graph query becomes expensive | Theme-scoped Alpha graph, temporal indexes, bounded traversal depth |
| Public data leaks admin details | Separate public schemas/routes and server-side authorization tests |
| Monorepo migration disrupts Luna | Stage move separately after architecture approval; preserve existing app until verified |

## 10. Deliberately excluded from Alpha

- Whole-market coverage or automated discovery outside the curated 25–40 companies
- USAspending, FRED/ALFRED, EIA, 13F, ETF, market-data, and investor-relations connectors
- Kafka, Redis, microservices, distributed workers, and a separate graph database
- Automated approval or autonomous publication of extracted events
- Predictive AI, return forecasts, trading signals, personalization, or brokerage execution
- Portfolio construction, order routing, alerts by email/SMS, and mobile applications
- Facility-level global supply-chain completeness
- Real-time exchange data and claims that Alpha is real time beyond approved-event delivery
- A fully automated Flow Score calibration model

## 11. Architecture review decisions needed

Before Milestone 1, confirm:

1. PostgreSQL remains the authoritative graph store for Alpha rather than adding Neo4j.
2. The current Luna Next.js app will eventually move under `apps/web`, but only in a dedicated migration milestone.
3. SEC filings may be stored locally in development and in R2/S3-compatible storage in production.
4. Human approval is mandatory before any extracted event or inferred relationship becomes public.
5. The curated Alpha universe and seed relationships will be reviewed as content, not assumed from examples in the product brief.

