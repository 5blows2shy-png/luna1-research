BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE setora_entity_type AS ENUM ('company','industry','infrastructure_category','government','institution','capital_source','technology','commodity','geography');
CREATE TYPE setora_review_status AS ENUM ('candidate','approved','rejected','needs_review');
CREATE TYPE setora_relationship_status AS ENUM ('inferred','verified','rejected');
CREATE TYPE setora_ingestion_status AS ENUM ('running','completed','partial','failed');
CREATE TYPE setora_note_status AS ENUM ('draft','in_review','published','archived');
CREATE TYPE setora_event_type AS ENUM ('CAPEX_INCREASE','CAPEX_DECREASE','CONTRACT_AWARD','GOVERNMENT_FUNDING','FACILITY_EXPANSION','BACKLOG_INCREASE','GUIDANCE_INCREASE','M&A_TRANSACTION','PROJECT_FINANCING','SUBSIDY','INVESTMENT_COMMITMENT','ETF_FLOW','INSTITUTIONAL_OWNERSHIP_CHANGE','SUPPLY_AGREEMENT');
CREATE TYPE setora_relationship_type AS ENUM ('invests_in','supplies','benefits_from','contracts_with','funds','requires','owns','exposed_to');

CREATE TABLE entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), canonical_name text NOT NULL,
  ticker text, cik text, entity_type setora_entity_type NOT NULL, sector text, industry text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entities_name_not_blank CHECK (btrim(canonical_name) <> ''),
  CONSTRAINT entities_ticker_format CHECK (ticker IS NULL OR ticker ~ '^[A-Z0-9.-]{1,12}$'),
  CONSTRAINT entities_cik_format CHECK (cik IS NULL OR cik ~ '^[0-9]{10}$')
);
CREATE UNIQUE INDEX entities_ticker_unique ON entities (ticker) WHERE ticker IS NOT NULL;
CREATE UNIQUE INDEX entities_cik_unique ON entities (cik) WHERE cik IS NOT NULL;
CREATE INDEX entities_name_search ON entities (lower(canonical_name));

CREATE TABLE entity_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_id uuid NOT NULL REFERENCES entities(id),
  alias text NOT NULL, alias_type text NOT NULL CHECK (alias_type IN ('name','ticker','cik','external_id')),
  match_status setora_review_status NOT NULL DEFAULT 'candidate', confidence numeric(5,4),
  source_document_id uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_alias_confidence_range CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 1)
);
CREATE INDEX entity_aliases_lookup ON entity_aliases (lower(alias), alias_type);
CREATE UNIQUE INDEX entity_aliases_unique ON entity_aliases (lower(alias), alias_type, entity_id);

CREATE TABLE themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), parent_theme_id uuid REFERENCES themes(id),
  slug text NOT NULL UNIQUE, name text NOT NULL, description text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT themes_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_name text NOT NULL,
  source_type text NOT NULL, source_url text, document_identifier text,
  published_at timestamptz, retrieved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_name)
);

CREATE TABLE ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES sources(id),
  connector_name text NOT NULL, checkpoint jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
  records_found integer NOT NULL DEFAULT 0, records_processed integer NOT NULL DEFAULT 0,
  records_failed integer NOT NULL DEFAULT 0, status setora_ingestion_status NOT NULL DEFAULT 'running',
  error_message text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ingestion_counts_nonnegative CHECK (records_found >= 0 AND records_processed >= 0 AND records_failed >= 0),
  CONSTRAINT ingestion_completion_consistent CHECK ((status = 'running' AND completed_at IS NULL) OR status <> 'running')
);
CREATE INDEX ingestion_runs_health ON ingestion_runs (source_id, started_at DESC);

CREATE TABLE source_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES sources(id),
  ingestion_run_id uuid REFERENCES ingestion_runs(id), entity_id uuid REFERENCES entities(id),
  document_identifier text NOT NULL, document_type text NOT NULL,
  source_url text NOT NULL, storage_key text, raw_text text, content_sha256 text NOT NULL,
  published_at timestamptz, retrieved_at timestamptz NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT source_document_content_present CHECK (storage_key IS NOT NULL OR raw_text IS NOT NULL),
  CONSTRAINT source_document_hash_format CHECK (content_sha256 ~ '^[a-f0-9]{64}$'),
  CONSTRAINT source_document_supported_form CHECK (document_type IN ('10-K','10-Q','8-K','SEC_SUBMISSION','SAMPLE')),
  UNIQUE (source_id, document_identifier, content_sha256)
);
ALTER TABLE entity_aliases ADD CONSTRAINT entity_alias_source_document_fk FOREIGN KEY (source_document_id) REFERENCES source_documents(id);
CREATE INDEX source_documents_timeline ON source_documents (source_id, published_at DESC);
CREATE INDEX source_documents_entity ON source_documents (entity_id, published_at DESC);

CREATE TABLE observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_document_id uuid NOT NULL REFERENCES source_documents(id),
  entity_id uuid REFERENCES entities(id), theme_id uuid REFERENCES themes(id), observation_type text NOT NULL,
  normalized_label text NOT NULL, value_numeric numeric, value_text text, currency char(3), unit text,
  period_start date, period_end date, effective_date date, observed_at timestamptz NOT NULL,
  evidence_locator jsonb NOT NULL, extraction_method text NOT NULL, confidence numeric(5,4) NOT NULL,
  supersedes_observation_id uuid REFERENCES observations(id), created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT observation_value_present CHECK (value_numeric IS NOT NULL OR value_text IS NOT NULL),
  CONSTRAINT observation_confidence_range CHECK (confidence BETWEEN 0 AND 1),
  CONSTRAINT observation_period_order CHECK (period_start IS NULL OR period_end IS NULL OR period_start <= period_end)
);
CREATE INDEX observations_entity_timeline ON observations (entity_id, observed_at DESC);
CREATE INDEX observations_document ON observations (source_document_id);

CREATE TABLE financial_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_id uuid NOT NULL REFERENCES entities(id),
  observation_id uuid NOT NULL REFERENCES observations(id), metric_code text NOT NULL,
  value numeric NOT NULL, currency char(3), unit text NOT NULL, period_start date, period_end date NOT NULL,
  filed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT financial_metric_period_order CHECK (period_start IS NULL OR period_start <= period_end),
  UNIQUE (entity_id, observation_id, metric_code, period_end)
);
CREATE INDEX financial_metrics_history ON financial_metrics (entity_id, metric_code, period_end DESC);

CREATE TABLE capital_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_type setora_event_type NOT NULL,
  entity_id uuid NOT NULL REFERENCES entities(id), theme_id uuid NOT NULL REFERENCES themes(id),
  amount numeric, currency char(3), effective_date date, published_at timestamptz NOT NULL,
  setora_first_seen_at timestamptz NOT NULL DEFAULT now(), confidence numeric(5,4) NOT NULL,
  status setora_review_status NOT NULL DEFAULT 'candidate', summary text NOT NULL,
  interpretation text, reviewed_by text, reviewed_at timestamptz, approved_at timestamptz,
  public_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT capital_event_amount_currency CHECK (amount IS NULL OR currency IS NOT NULL),
  CONSTRAINT capital_event_confidence_range CHECK (confidence BETWEEN 0 AND 1),
  CONSTRAINT capital_event_review_consistent CHECK ((status = 'candidate' AND reviewed_at IS NULL) OR status <> 'candidate'),
  CONSTRAINT capital_event_public_approved CHECK (public_at IS NULL OR (status = 'approved' AND approved_at IS NOT NULL))
);
CREATE INDEX capital_events_review_queue ON capital_events (status, created_at DESC);
CREATE INDEX capital_events_pulse ON capital_events (public_at DESC, id) WHERE status = 'approved' AND public_at IS NOT NULL;
CREATE INDEX capital_events_entity_timeline ON capital_events (entity_id, effective_date DESC);

CREATE TABLE capital_event_observations (
  capital_event_id uuid NOT NULL REFERENCES capital_events(id) ON DELETE CASCADE,
  observation_id uuid NOT NULL REFERENCES observations(id), evidence_role text NOT NULL DEFAULT 'supporting',
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (capital_event_id, observation_id)
);

CREATE TABLE relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_entity_id uuid NOT NULL REFERENCES entities(id),
  target_entity_id uuid NOT NULL REFERENCES entities(id), theme_id uuid REFERENCES themes(id),
  relationship_type setora_relationship_type NOT NULL, strength numeric(5,4), confidence numeric(5,4) NOT NULL,
  status setora_relationship_status NOT NULL DEFAULT 'inferred', effective_from date NOT NULL,
  effective_to date, first_seen_at timestamptz NOT NULL DEFAULT now(), last_confirmed_at timestamptz,
  source_count integer NOT NULL DEFAULT 0, reviewed_by text, reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT relationship_no_self_edge CHECK (source_entity_id <> target_entity_id),
  CONSTRAINT relationship_strength_range CHECK (strength IS NULL OR strength BETWEEN 0 AND 1),
  CONSTRAINT relationship_confidence_range CHECK (confidence BETWEEN 0 AND 1),
  CONSTRAINT relationship_effective_order CHECK (effective_to IS NULL OR effective_from < effective_to),
  CONSTRAINT relationship_source_count_nonnegative CHECK (source_count >= 0)
);
CREATE INDEX relationships_source_asof ON relationships (source_entity_id, effective_from, effective_to);
CREATE INDEX relationships_target_asof ON relationships (target_entity_id, effective_from, effective_to);
CREATE INDEX relationships_theme ON relationships (theme_id, status, effective_from);

CREATE TABLE relationship_evidence (
  relationship_id uuid NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  observation_id uuid NOT NULL REFERENCES observations(id), evidence_role text NOT NULL DEFAULT 'supporting',
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (relationship_id, observation_id)
);

CREATE TABLE scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject_entity_id uuid NOT NULL REFERENCES entities(id),
  theme_id uuid REFERENCES themes(id), final_score numeric(5,2) NOT NULL,
  calculated_at timestamptz NOT NULL, methodology_version text NOT NULL, explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT score_range CHECK (final_score BETWEEN 0 AND 100),
  UNIQUE (subject_entity_id, theme_id, calculated_at, methodology_version)
);
CREATE INDEX scores_history ON scores (subject_entity_id, calculated_at DESC);

CREATE TABLE score_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), score_id uuid NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
  component_code text NOT NULL, component_score numeric(5,2) NOT NULL, weight numeric(7,6) NOT NULL,
  contribution numeric(7,3) NOT NULL, rationale text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT score_component_range CHECK (component_score BETWEEN 0 AND 100),
  CONSTRAINT score_component_weight_range CHECK (weight BETWEEN 0 AND 1),
  UNIQUE (score_id, component_code)
);

CREATE TABLE score_component_observations (
  score_component_id uuid NOT NULL REFERENCES score_components(id) ON DELETE CASCADE,
  observation_id uuid NOT NULL REFERENCES observations(id), created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (score_component_id, observation_id)
);

CREATE TABLE research_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_id uuid REFERENCES entities(id),
  theme_id uuid REFERENCES themes(id), capital_event_id uuid REFERENCES capital_events(id),
  title text NOT NULL, body_markdown text NOT NULL, status setora_note_status NOT NULL DEFAULT 'draft',
  author_id text NOT NULL, published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT research_note_publish_consistent CHECK (published_at IS NULL OR status IN ('published','archived'))
);
CREATE INDEX research_notes_subject ON research_notes (theme_id, entity_id, status, published_at DESC);

CREATE FUNCTION setora_reject_history_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only; insert a superseding record', TG_TABLE_NAME; END; $$;

CREATE TRIGGER source_documents_append_only BEFORE UPDATE OR DELETE ON source_documents FOR EACH ROW EXECUTE FUNCTION setora_reject_history_update();
CREATE TRIGGER observations_append_only BEFORE UPDATE OR DELETE ON observations FOR EACH ROW EXECUTE FUNCTION setora_reject_history_update();
CREATE TRIGGER financial_metrics_append_only BEFORE UPDATE OR DELETE ON financial_metrics FOR EACH ROW EXECUTE FUNCTION setora_reject_history_update();
CREATE TRIGGER scores_append_only BEFORE UPDATE OR DELETE ON scores FOR EACH ROW EXECUTE FUNCTION setora_reject_history_update();
CREATE TRIGGER score_components_append_only BEFORE UPDATE OR DELETE ON score_components FOR EACH ROW EXECUTE FUNCTION setora_reject_history_update();

COMMIT;
