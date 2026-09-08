# SETORA Alpha PostgreSQL schema

The executable definition lives in `database/migrations/0001_setora_alpha_foundation.sql`.

## Major tables

### `entities`

One canonical record per company, industry, theme-adjacent infrastructure category, government body, or capital source. CIK and ticker are nullable because not every node is a public company. Partial unique indexes prevent duplicate known identifiers.

### `entity_aliases`

Maps names, tickers, and external identifiers to one canonical entity. `match_status` preserves whether an alias was automatically proposed or reviewed.

### `themes`

Defines the constrained Alpha domains. Parent IDs support a small hierarchy such as AI Infrastructure → Data Centers → Power Infrastructure.

### `sources`

Describes the publisher or feed, such as SEC EDGAR. It is distinct from an individual filing.

### `source_documents`

Immutable retrieved artifacts and their metadata. `storage_key` supports local/S3/R2 storage; `raw_text` supports small development fixtures. SHA-256 and retrieval time establish provenance.

### `ingestion_runs`

Operational history for each connector execution, including counts, checkpoints, status, and errors. This powers the future data-source health view.

### `observations`

Append-only normalized claims extracted from source documents. The record holds typed values plus an evidence locator and extraction method. A correction references `supersedes_observation_id`.

### `financial_metrics`

Append-only normalized financial measurements, with period boundaries, units, currency, and direct lineage to an observation. It does not store SETORA conclusions.

### `capital_events`

Candidate and reviewed interpretations of events affecting capital direction, magnitude, or destination. Review status, reviewer, approval time, and publication time make the transition explicit.

### `capital_event_observations`

Many-to-many evidence bridge between an interpreted event and the normalized observations supporting it.

### `relationships`

Temporal graph edges between canonical entities. `effective_from`/`effective_to` preserve business-time validity, while `first_seen_at`/`last_confirmed_at` preserve system knowledge time. Verified and inferred states are explicit.

### `relationship_evidence`

Links every relationship to supporting observations. An edge may have multiple sources and can accumulate evidence without overwriting its temporal record.

### `scores`

Append-only Flow Score snapshots. Each record stores the result, calculation time, subject, methodology version, and explanatory summary.

### `score_components`

The component contributions behind a score, including weight, normalized value, contribution, and the observations used. Components must reconcile to the final score in application tests.

### `research_notes`

Human-authored SETORA interpretation, kept separate from raw documents and normalized observations. Draft/review/published state and optional entity/theme/event links support the research workflow.

## Important query indexes

- `capital_events(status, published_at)` supports the review queue and Pulse cursor.
- `capital_events(entity_id, effective_date)` supports entity timelines.
- `relationships(source_entity_id, effective_from, effective_to)` and the target equivalent support `as_of` graph queries.
- `observations(entity_id, observed_at)` supports entity evidence history.
- `source_documents(source_id, published_at)` supports connector and filing views.
- `scores(subject_entity_id, calculated_at)` supports latest/history score requests.

## History policy

- Raw documents, observations, financial metrics, scores, and score components are append-only.
- Candidate events can be edited while under review; their status and review timestamps are retained.
- A relationship correction closes the old version with `effective_to` and inserts a new row.
- Source content corrections create a new source document with a new checksum and document identifier/version.

