import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const routes = [
  "src/app/development-log/page.tsx",
  "src/app/research/companies/[ticker]/page.tsx",
  "src/app/research/themes/page.tsx",
  "src/app/research/themes/[slug]/page.tsx",
  "src/app/research/notes/page.tsx",
  "src/app/research/library/page.tsx",
];

test("development log and research routes are present", () => {
  for (const route of routes) assert.ok(fs.existsSync(route), route);
  const navigation = fs.readFileSync("src/lib/data.ts", "utf8");
  assert.match(
    navigation,
    /label: "Development Log", href: "\/development-log"/,
  );
  assert.doesNotMatch(navigation, /label: "Research"/);
});

test("research content uses typed centralized records", () => {
  const source = fs.readFileSync("src/lib/research-content.ts", "utf8");
  for (const ticker of ["RY", "GLW", "BE"])
    assert.match(source, new RegExp(`ticker: "${ticker}"`));
  for (const theme of [
    "AI Data Center Buildout",
    "Defense Spending",
    "Cloud Computing",
    "Cybersecurity",
    "Robotics",
  ])
    assert.ok(source.includes(`title: "${theme}"`), `missing theme: ${theme}`);
  assert.match(source, /title: "One Up On Wall Street"/);
  assert.match(source, /author: "Peter Lynch"/);
  assert.equal((source.match(/status: "Draft" as const/g) ?? []).length, 1);
});

test("incomplete research is labeled without fabricated data or PDFs", () => {
  const data = fs.readFileSync("src/lib/research-content.ts", "utf8");
  const page = fs.readFileSync(
    "src/app/research/companies/[ticker]/page.tsx",
    "utf8",
  );
  assert.match(data, /Data pending update/);
  assert.match(data, /Date to be confirmed/);
  assert.doesNotMatch(data, /pdfUrl:/);
  assert.match(page, /Full research report in development\./);
  assert.match(page, /company\.pdfUrl/);
});

test("every research surface renders the approved disclosure", () => {
  const disclosure = fs.readFileSync("src/lib/research-content.ts", "utf8");
  assert.match(
    disclosure,
    /Nothing presented on this website constitutes investment advice/,
  );
  for (const route of [
    "src/app/research/page.tsx",
    "src/app/research/[slug]/page.tsx",
    ...routes.slice(1),
  ]) {
    const source = fs.readFileSync(route, "utf8");
    assert.match(source, /ResearchDisclaimer/);
  }
});

test("development dates distinguish repository evidence from unknown history", () => {
  const source = fs.readFileSync("src/lib/development-log.ts", "utf8");
  assert.match(source, /date: "2026-07-13"/);
  assert.match(source, /phase: "Website Launch"/);
  assert.match(source, /date: "Date to be confirmed"/);
  for (const status of ["Completed", "In Progress", "Planned"])
    assert.ok(
      source.includes(`status: "${status}"`),
      `missing status: ${status}`,
    );
});
