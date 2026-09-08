import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const migration = fs.readFileSync("database/migrations/0001_setora_alpha_foundation.sql", "utf8");
const architecture = fs.readFileSync("docs/setora-alpha-architecture.md", "utf8");

const requiredTables = ["entities", "entity_aliases", "themes", "capital_events", "relationships", "sources", "source_documents", "observations", "financial_metrics", "scores", "score_components", "ingestion_runs", "research_notes"];

test("SETORA Alpha migration defines every foundational table", () => {
  for (const table of requiredTables) assert.match(migration, new RegExp(`CREATE TABLE ${table} \\(`));
});

test("SETORA keeps event review, temporal graph, and evidence lineage explicit", () => {
  assert.match(migration, /'candidate','approved','rejected','needs_review'/);
  assert.match(migration, /effective_from date NOT NULL/);
  assert.match(migration, /effective_to date/);
  assert.match(migration, /CREATE TABLE capital_event_observations/);
  assert.match(migration, /CREATE TABLE relationship_evidence/);
  assert.match(migration, /source_documents_append_only/);
});

test("SETORA architecture limits Alpha and preserves the human approval gate", () => {
  assert.match(architecture, /25–40 companies/);
  assert.match(architecture, /Human approval is mandatory/);
  assert.match(architecture, /Kafka, Redis, microservices/);
  assert.match(architecture, /Last-Event-ID/);
});

test("SETORA product remains independent from legacy research coverage", () => {
  const setoraFiles = [
    "src/app/setora/page.tsx",
    "src/app/setora/companies/page.tsx",
    "src/app/setora/themes/page.tsx",
    "src/app/setora/research/page.tsx",
    "src/components/setora-map.tsx",
    "src/data/setora-alpha.ts",
  ].map((path) => fs.readFileSync(path, "utf8")).join("\n");
  assert.doesNotMatch(setoraFiles, /@\/data\/research|@\/lib\/research-content/);
  assert.doesNotMatch(setoraFiles, /["'](?:BE|RY|GLW|ANET|STRL|VRT|DLR)["']/);
  assert.doesNotMatch(setoraFiles, /\.pdf|pdfUrl|\/watchlist\//);
  assert.match(setoraFiles, /setoraCompanyCandidates/);
  assert.match(setoraFiles, /CAPEX_INCREASE/);
});
