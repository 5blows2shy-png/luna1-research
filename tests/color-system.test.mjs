import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const theme = fs.readFileSync("src/app/luxury.css", "utf8").toLowerCase();

test("Bloomberg-inspired palette is centralized in semantic tokens", () => {
  for (const [token, value] of [
    ["--bg-main", "#090b10"],
    ["--bg-secondary", "#0d1117"],
    ["--bg-card", "#151922"],
    ["--bg-elevated", "#1b202b"],
    ["--bg-input", "#11151d"],
    ["--border-primary", "#2a303b"],
    ["--border-secondary", "#343b47"],
    ["--divider-subtle", "#202631"],
    ["--text-primary", "#e5e7eb"],
    ["--text-secondary", "#9ca3af"],
    ["--text-muted", "#6b7280"],
    ["--text-disabled", "#4b5563"],
    ["--accent-blue", "#3b82f6"],
    ["--accent-orange", "#f59e0b"],
    ["--accent-cyan", "#22d3ee"],
    ["--status-positive", "#10b981"],
    ["--status-negative", "#ef4444"],
    ["--status-warning", "#fbbf24"],
    ["--status-neutral", "#64748b"],
  ]) {
    assert.ok(
      theme.includes(`${token}:${value}`),
      `missing ${token}: ${value}`,
    );
  }
});

test("legacy component tokens map to the centralized palette", () => {
  for (const mapping of [
    "--charcoal:var(--bg-main)",
    "--navy-black:var(--bg-secondary)",
    "--panel:var(--bg-card)",
    "--ivory:var(--text-primary)",
    "--gold:var(--accent-blue)",
    "--brass:var(--accent-orange)",
    "--platinum:var(--accent-cyan)",
    "--emerald:var(--status-positive)",
    "--burgundy:var(--status-negative)",
  ]) {
    assert.ok(theme.includes(mapping), `missing legacy mapping: ${mapping}`);
  }
});

test("status, table, navigation, form, and chart states use semantic colors", () => {
  for (const selector of [
    ".desktop-nav a.active",
    '.status[data-status="completed"]',
    '.status[data-status="monitoring"]',
    '.status[data-status="pending"]',
    '.status[data-status="negative"]',
    '.status[data-status="planned"]',
    ".recharts-default-tooltip",
    "tbody tr:hover",
    "input::placeholder",
  ]) {
    assert.ok(theme.includes(selector), `missing color state: ${selector}`);
  }
});

test("dynamic status labels expose a non-color text value and color hook", () => {
  for (const file of [
    "src/app/certifications/page.tsx",
    "src/app/portfolios/page.tsx",
    "src/components/mistake-journal.tsx",
  ]) {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /className="status"/);
    assert.match(source, /data-status=/);
  }
});

test("metadata and social artwork use the new dark palette", () => {
  const layout = fs.readFileSync("src/app/layout.tsx", "utf8").toLowerCase();
  const social = fs
    .readFileSync("src/app/opengraph-image.tsx", "utf8")
    .toLowerCase();
  assert.match(layout, /colorscheme:"dark"/);
  assert.match(layout, /themecolor:"#090b10"/);
  for (const color of ["#090b10", "#e5e7eb", "#3b82f6", "#f59e0b", "#22d3ee"])
    assert.ok(social.includes(color), `social card missing ${color}`);
});
