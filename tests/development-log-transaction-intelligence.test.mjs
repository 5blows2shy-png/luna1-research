import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const dataPath = "src/lib/development-log.ts";
const componentPath = "src/components/development-log-filter.tsx";
const dataSource = fs.readFileSync(dataPath, "utf8");
const componentSource = fs.readFileSync(componentPath, "utf8");

test("Transaction Intelligence preview appears once in the centralized log", () => {
  assert.equal(
    dataSource.match(/id: "transaction-intelligence-preview"/g)?.length,
    1,
  );
  assert.equal(
    dataSource.match(
      /title: "Integrated Klyro Preview"/g,
    )?.length,
    1,
  );
  assert.match(dataSource, /date: "2026-07-24"/);
  assert.match(dataSource, /category: "Platform Expansion"/);
  assert.match(dataSource, /status: "In Progress"/);
  assert.match(dataSource, /visibility: "Public"/);
});

test("existing Development Log entries retain their order", () => {
  const existingIds = [
    "strategy-formation",
    "framework-development",
    "portfolio-process",
    "website-planning",
    "initial-build",
    "website-launch",
    "decision-accountability",
    "institutional-design",
    "scope-refinement",
    "research-hub",
    "next-research-release",
    "watchlist-research-coverage",
    "industry-specific-valuation",
  ];
  const positions = existingIds.map((id) =>
    dataSource.indexOf(`id: "${id}"`),
  );

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
  assert.ok(
    positions.at(-1) <
      dataSource.indexOf('id: "transaction-intelligence-preview"'),
  );
});

test("preview capabilities remain visibly unfinished and link to the promoted page", () => {
  for (const feature of [
    "Transaction Import",
    "Data Normalization",
    "Transaction Categorization",
    "Duplicate Detection",
    "Transfer Matching",
    "Reconciliation",
    "Exception Review",
    "Audit Trail",
    "Export Center",
  ])
    assert.ok(dataSource.includes(`label: "${feature}"`), feature);

  for (const status of ["Planned", "Preview", "In Development"])
    assert.ok(dataSource.includes(`status: "${status}"`), status);

  assert.match(dataSource, /route: "\/klyro"/);
  assert.ok(fs.existsSync("src/app/klyro/page.tsx"));
  assert.ok(fs.existsSync("src/app/transaction-intelligence/page.tsx"));
  assert.match(componentSource, /View Klyro Preview/);
});

test("public entry preserves project-origin privacy and educational scope", () => {
  assert.doesNotMatch(dataSource, /new project 3/i);
  assert.match(dataSource, /portfolio and educational project/);
  assert.match(dataSource, /not a substitute for professional accounting/);
  assert.doesNotMatch(
    dataSource,
    /\b(?:account|routing)\s*(?:number|no\.)\s*[:=]/i,
  );
});
