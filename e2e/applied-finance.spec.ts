import { test, expect } from "@playwright/test";

test("model waits for interactivity before accepting an initial edit", async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve; });
  await page.route("**/_next/static/**/*.js*", async route => { await scriptsReady; await route.continue(); });
  try {
    await page.goto("/recruiter/projects/data-center-investment-model", { waitUntil: "commit" });
    const power = page.getByLabel("Power cost ($/kWh)", { exact: true });
    await expect(power).toBeDisabled();
    releaseScripts();
    await expect(power).toBeEnabled();
    await power.fill("0.12");
    await page.getByRole("button", { name: "Downside case", exact: true }).click();
    await expect(power).toHaveValue("0.12");
  } finally { releaseScripts(); }
});

test("three professional case studies connect profile, narrative and evidence", async ({ page, request }) => {
  await page.goto("/recruiter");
  const cases = page.locator("#professional-case-studies");
  await expect(cases.getByRole("link", { name: /Read case study:/ })).toHaveCount(3);
  for (const category of ["Financial operations", "Infrastructure operations", "Investment research"]) {
    await page.goto("/recruiter#professional-case-studies");
    await cases.getByRole("link", { name: `Read case study: ${category}`, exact: true }).click();
    await expect(page.locator("article > header")).toContainText(category);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const section of ["context", "challenge", "approach", "findings", "deliverable", "evidence"]) {
      await expect(page.locator(`#${section}`)).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const href of await page.locator("#evidence a").evaluateAll(links => links.map(link => link.getAttribute("href")!))) {
      expect((await request.get(href)).ok()).toBeTruthy();
    }
    if (category === "Investment research") {
      await expect(page.locator("#deliverable")).toContainText("No executed position");
      await expect(page.locator("#context")).toContainText("dated draft");
    }
  }
  expect((await request.get("/recruiter/case-studies/unknown-case")).status()).toBe(404);
});

test("profile links to completed projects without duplicate FP&A placeholders", async ({ page }) => {
  await page.goto("/recruiter");
  const section = page.locator("#applied-finance-projects");
  await expect(section.getByRole("heading", { name: "Applied Finance Projects", exact: true })).toBeVisible();
  await expect(section.getByText("Completed", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Planning & Performance", { exact: true })).toHaveCount(0);
  await section.getByRole("link", { name: "View project: Nonprofit FP&A Dashboard" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nonprofit FP&A Dashboard");
  await expect(page.locator("#evidence a")).toHaveCount(2);
});

test("nonprofit reporting periods recalculate and fund balances reconcile", async ({ page }) => {
  await page.goto("/recruiter/projects/nonprofit-fpa-dashboard");
  await expect(page.locator("#analysis")).toContainText("$14,500");
  await page.getByLabel("Reporting view").selectOption("Quarterly");
  await expect(page.getByRole("region", { name: /cash bridge/ })).toContainText("$474,600");
  await page.getByLabel("Reporting month").selectOption("5");
  await page.getByLabel("Reporting view").selectOption("YTD");
  await expect(page.getByRole("region", { name: /cash bridge/ })).toContainText("$978,000");
  await page.getByLabel(/Management commentary/).fill("Test management note");
  await expect(page.getByLabel(/Management commentary/)).toHaveValue("Test management note");
  await expect(page.locator("#findings")).toContainText("Power BI and accrual-ledger integration are optional future extensions");
});

test("investment assumptions, scenarios, validation and reset work", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/recruiter/projects/data-center-investment-model");
  const npv = page.locator("#analysis dl > div").filter({ has: page.locator("dt", { hasText: /^Project NPV$/ }) }).locator("dd");
  const original = await npv.textContent();
  await page.getByLabel("Power cost ($/kWh)", { exact: true }).fill("0.20");
  await expect(npv).not.toHaveText(original!);
  await page.getByRole("button", { name: "Downside case", exact: true }).click();
  await expect(page.getByRole("button", { name: "Downside case", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Power usage effectiveness (PUE)").fill("0.5");
  await expect(page.locator("#assumptions-model").getByRole("alert")).toContainText("Outputs are withheld");
  await expect(page.locator("#analysis")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset assumptions" }).click();
  await expect(npv).toHaveText(original!);
  await page.getByText("CapEx breakdown · edit categories and amounts", { exact: true }).click();
  await page.getByRole("button", { name: "Add category", exact: true }).click();
  await page.getByLabel("Category 13", { exact: true }).fill("Contingency");
  await page.getByLabel("Amount 13 ($)", { exact: true }).fill("1000000");
  await expect(page.getByLabel("Total project cost ($) · rescales category amounts", { exact: true })).toHaveValue("51000000");
  await page.getByRole("button", { name: "Remove Contingency", exact: true }).click();
  await expect(npv).toHaveText(original!);
  expect(errors).toEqual([]);
});

test("project pages fit mobile and retain keyboard-accessible financial tables", async ({ page }) => {
  for (const slug of ["nonprofit-fpa-dashboard", "data-center-investment-model"]) {
    await page.goto(`/recruiter/projects/${slug}`);
    await expect(page.locator("article").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const table = page.locator('div[role="region"][tabindex="0"]').first();
    await table.focus();
    await expect(table).toBeFocused();
    await expect(page.getByRole("contentinfo")).toContainText(/educational|advice/i);
  }
  await page.goto("/recruiter/projects/not-a-project");
  await expect(page.getByText(/404|not found/i).first()).toBeVisible();
});

test("project finance schedules respond to repayment and coverage assumptions", async ({ page }) => {
  await page.goto("/recruiter/projects/data-center-investment-model");
  await expect(page.getByRole("heading", { name: "Sources & uses / capital structure", exact: true })).toBeVisible();
  const minimum = page.locator("#debt-service dl > div").filter({ has: page.locator("dt", { hasText: /^Minimum operating DSCR$/ }) }).locator("dd");
  const starting = await minimum.textContent();
  await page.getByLabel("Debt amortization", { exact: true }).selectOption("balloon");
  await expect(minimum).not.toHaveText(starting!);
  await page.getByLabel("Debt amortization", { exact: true }).selectOption("annuity");
  await expect(page.getByRole("region", { name: /^Debt service schedule/ })).toContainText("Ending debt");
  await page.getByLabel("Debt / development budget (%)", { exact: true }).fill("0");
  await expect(minimum).toHaveText("N/A");
  await page.getByLabel("Debt term after construction (years)", { exact: true }).fill("31");
  await expect(page.locator("#assumptions-model").getByRole("alert")).toContainText("Debt term");
  await page.getByRole("button", { name: "Reset assumptions" }).click();
  await expect(minimum).toHaveText(starting!);
});

test("eight-screen recruiting mode shares the selected scenario and preserves edits", async ({ page }) => {
  await page.goto("/recruiter/projects/data-center-investment-model");
  await page.getByLabel("Power cost ($/kWh)", { exact: true }).fill("0.12");
  await page.getByRole("button", { name: "Downside case", exact: true }).click();
  const npv = await page.locator("#analysis dl > div").filter({ has: page.locator("dt", { hasText: /^Project NPV$/ }) }).locator("dd").textContent();
  await page.getByRole("button", { name: "Open recruiting work sample · 8 screens" }).click();
  await expect(page.locator("[data-work-sample-page]")).toHaveCount(8);
  await expect(page.locator("#work-sample-1")).toContainText(npv!);
  await expect(page.locator("#work-sample-1")).toContainText("Downside case");
  await expect(page.getByRole("button", { name: "Print / save PDF preview" })).toBeVisible();
  await expect(page.locator("#work-sample-2").getByRole("link", { name: /IEA/ })).toHaveAttribute("href", "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Return to editable model" }).click();
  await expect(page.getByLabel("Power cost ($/kWh)", { exact: true })).toHaveValue("0.12");
  await expect(page.getByRole("button", { name: "Downside case", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#evidence")).toContainText("PDF Work Sample");
  await expect(page.locator("#evidence")).toContainText("Excel Financial Model");
  await expect(page.locator("#evidence a")).toHaveCount(2);
});

 test("completed downloads resolve to actual workbooks and PDFs", async ({ request }) => { for (const name of ["nonprofit-fpa-workbook.xlsx", "data-center-project-finance.xlsx", "nonprofit-fpa-case-study.pdf", "data-center-project-finance.pdf"]) { const r = await request.get(`/downloads/${name}`); expect(r.ok()).toBeTruthy(); const bytes = await r.body(); expect(bytes.length).toBeGreaterThan(1000); expect(bytes.subarray(0,name.endsWith("pdf")?4:2).toString()).toBe(name.endsWith("pdf")?"%PDF":"PK"); } });

test("flagship and Research Challenge are additive, honest and responsive", async ({ page, request }) => {
  await page.goto('/recruiter');
  await expect(page.locator('a[href="/recruiter/projects/ten-year-data-center-development"]').first()).toBeVisible();
  await page.goto('/recruiter/research-challenge');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('CFA Institute Research Challenge');
  await expect(page.locator('#company-research')).toContainText('WD-40 Company · NASDAQ: WDFC');
  await expect(page.locator('article > header')).toContainText('Equity Research Team Member — Company & Strategic Analysis');
  await expect(page.locator('article > header')).toContainText('Oct 2026 – Present');
  await expect(page.locator('#overview')).toContainText('corporate governance, ESG considerations, and business risks');
  await expect(page.locator('body')).toContainText('Research In Progress');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/luna-challenge-${test.info().project.name}.png`, fullPage: true });
  await page.goto('/recruiter/projects/ten-year-data-center-development');
  await expect(page.getByRole('button', { name: 'Download Power BI data package', exact: true })).toBeDisabled();
  await expect(page.getByLabel('Contracted revenue rate · USER INPUT', { exact: true })).toBeEmpty();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('body')).toContainText('For modeling practice only.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/luna-development-${test.info().project.name}.png`, fullPage: true });
  for (const url of ['/downloads/data-center-development-power-bi-spec.md', '/downloads/luna1-infrastructure-power-bi-theme.json']) expect((await request.get(url)).ok()).toBeTruthy();
});

test('flagship inputs calculate, export and reject an invalid construction schedule', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/recruiter/projects/ten-year-data-center-development');
  const values: Record<string, string> = {
    'CapEx per MW ($) · ILLUSTRATIVE ASSUMPTION': '100',
    'Discount rate (%) · USER INPUT': '10', 'Exit EBITDA multiple (x) · USER INPUT': '2',
    'Exit selling costs (%) · USER INPUT': '10', 'Contracted revenue rate · USER INPUT': '100',
    'Annual revenue escalation (%) · USER INPUT': '0', 'Other recurring revenue ($ / leased MW / year) · USER INPUT': '0',
    'Power usage effectiveness (PUE) · USER INPUT': '1', 'Power price ($ / kWh) · USER INPUT': '0',
    'Effective cash taxes / positive EBITDA (%) · USER INPUT': '0', 'Working capital / revenue (%) · USER INPUT': '10',
    'Maintenance CapEx ($ / available MW / year) · USER INPUT': '1',
  };
  for (const [label, value] of Object.entries(values)) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel(/^Revenue rate unit/).selectOption('mw-year');
  await page.getByText('Edit operating expense categories', { exact: true }).click();
  for (const input of await page.getByLabel(/ amount \(\$\)$/).all()) await input.fill('0');
  for (const phase of [1, 2]) {
    await page.getByLabel(`Phase ${phase} capacity (MW)`, { exact: true }).fill('1');
    await page.getByLabel(`Phase ${phase} first available year`, { exact: true }).fill(phase === 1 ? '1' : '3');
    await page.getByText(`Edit Phase ${phase} Year 0–10 schedule`, { exact: true }).click();
    await page.getByRole('button', { name: `Set empty Phase ${phase} schedule cells to zero`, exact: true }).click();
    for (let y = phase === 1 ? 1 : 3; y <= 10; y++) {
      await page.getByLabel(`Phase ${phase} Year ${y} lease (%)`, { exact: true }).fill('100');
      await page.getByLabel(`Phase ${phase} Year ${y} utilization (%)`, { exact: true }).fill('50');
    }
  }
  await page.getByLabel('Phase 1 Year 0 allocation (%)', { exact: true }).fill('100');
  await page.getByLabel('Phase 2 Year 1 allocation (%)', { exact: true }).fill('30');
  await page.getByLabel('Phase 2 Year 2 allocation (%)', { exact: true }).fill('70');
  const button = page.getByRole('button', { name: 'Download Power BI data package', exact: true });
  await expect(button).toBeEnabled();
  const downloadPromise = page.waitForEvent('download');
  await button.click();
  const download = await downloadPromise;
  const { readFile } = await import('node:fs/promises');
  const data = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(data.tables.FACT_FINANCIALS).toHaveLength(66);
  expect(data.tables.Investment_Returns[0].MOIC).toBeCloseTo(20.42);
  expect(data.disclosure).toContain('not an estimate of any specific LightEdge');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Phase 1 Year 0 allocation (%)', { exact: true }).fill('90');
  await expect(button).toBeDisabled();
  expect(errors).toEqual([]);
});
