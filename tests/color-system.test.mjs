import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const theme = fs.readFileSync("src/app/luxury.css", "utf8").toLowerCase();

test("institutional palette is centralized in semantic tokens", () => {
  for (const [token, value] of [
    ["--bg-main", "#07090c"],
    ["--bg-secondary", "#0b0f15"],
    ["--bg-card", "#11161e"],
    ["--bg-elevated", "#171d26"],
    ["--bg-input", "#0d1218"],
    ["--border-primary", "#2a3039"],
    ["--border-secondary", "#3b424c"],
    ["--divider-subtle", "#1c232d"],
    ["--text-primary", "#f1eee7"],
    ["--text-secondary", "#b7b4ad"],
    ["--text-muted", "#83817b"],
    ["--text-disabled", "#575b60"],
    ["--accent-blue", "#c3a56a"],
    ["--accent-orange", "#8e7350"],
    ["--accent-cyan", "#aebac5"],
    ["--status-positive", "#5c9a7c"],
    ["--status-negative", "#c16a6d"],
    ["--status-warning", "#c4a163"],
    ["--status-neutral", "#7d8792"],
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

test("light mode provides a complete accessible semantic palette", () => {
  assert.ok(theme.includes('html[data-theme="light"]'));
  for (const [token, value] of [
    ["--bg-main", "#f4f1e9"],
    ["--bg-card", "#fbfaf6"],
    ["--bg-input", "#f0ece3"],
    ["--border-primary", "#d4cdbf"],
    ["--text-primary", "#181b20"],
    ["--text-secondary", "#4f5863"],
    ["--accent-blue", "#80683d"],
    ["--status-positive", "#177457"],
    ["--status-negative", "#a43b43"],
  ]) {
    assert.ok(
      theme.includes(`${token}:${value}`),
      `missing light-mode ${token}: ${value}`,
    );
  }
  assert.ok(theme.includes("color-scheme:light"));
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

test("metadata, theme initialization, and social artwork use the approved palette", () => {
  const layout = fs.readFileSync("src/app/layout.tsx", "utf8").toLowerCase();
  const social = fs
    .readFileSync("src/app/opengraph-image.tsx", "utf8")
    .toLowerCase();
  assert.match(layout, /colorscheme:"dark light"/);
  assert.match(layout, /color:"#07090c"/);
  assert.match(layout, /color:"#f4f1e9"/);
  assert.match(layout, /localstorage\.getitem\("theme"\)/);
  assert.match(layout, /prefers-color-scheme: dark/);
  for (const color of ["#07090c", "#f1eee7", "#c3a56a", "#8e7350", "#aebac5"])
    assert.ok(social.includes(color), `social card missing ${color}`);
});
