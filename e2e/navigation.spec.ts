import { test, expect, type Locator } from "@playwright/test";
import * as XLSX from "@e965/xlsx";
import { mkdirSync, readFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";

async function activate(locator: Locator, projectName: string) {
  if (projectName === "mobile") {
    await locator.tap();
    return;
  }
  await locator.click();
}

test("primary pages load without horizontal overflow", async ({ page }) => {
  test.setTimeout(60_000);

  for (const route of [
    "/",
    "/analyst-journal",
    "/transaction-intelligence",
    "/research",
    "/development-log",
    "/research/companies/ry",
    "/research/companies/glw",
    "/research/companies/be",
    "/research/themes",
    "/research/themes/ai-data-center-buildout",
    "/research/notes",
    "/portfolio",
    "/portfolio/mistake-journal",
    "/watchlist/glw",
    "/watchlist/aipo",
    "/watchlist/jbl",
    "/watchlist/alab",
    "/watchlist/ry",
    "/watchlist/panw",
    "/watchlist/pdfs",
    "/watchlist/anet",
    "/watchlist/wwd",
    "/watchlist/amat",
    "/watchlist/gs",
    "/watchlist/dlr",
    "/watchlist/strl",
    "/about",
    "/recruiter",
    "/contact",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      )
      .toBe(true);
  }
});

test("Bloomberg-inspired semantic palette renders at every viewport", async ({
  page,
}) => {
  await page.addInitScript(() => window.localStorage.setItem("theme", "dark"));
  await page.goto("/contact");
  const palette = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const input = getComputedStyle(document.querySelector("input")!);
    return {
      background: body.backgroundColor,
      inputBackground: input.backgroundColor,
      primaryText: root.getPropertyValue("--text-primary").trim(),
      secondaryText: root.getPropertyValue("--text-secondary").trim(),
      blue: root.getPropertyValue("--accent-blue").trim(),
      orange: root.getPropertyValue("--accent-orange").trim(),
      cyan: root.getPropertyValue("--accent-cyan").trim(),
    };
  });
  expect(palette).toEqual({
    background: "rgb(9, 11, 16)",
    inputBackground: "rgb(17, 21, 29)",
    primaryText: "#e5e7eb",
    secondaryText: "#9ca3af",
    blue: "#3b82f6",
    orange: "#f59e0b",
    cyan: "#22d3ee",
  });
});

test("light and dark modes toggle and persist", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("theme"));
  await page.reload();
  const toggle = page.locator("[data-theme-toggle]");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAccessibleName("Switch to light theme");
  await activate(toggle, testInfo.project.name);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAccessibleName("Switch to dark theme");

  const lightPalette = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      background: root.getPropertyValue("--bg-main").trim(),
      text: root.getPropertyValue("--text-primary").trim(),
      stored: window.localStorage.getItem("theme"),
    };
  });
  expect(lightPalette).toEqual({
    background: "#f4f1e9",
    text: "#181b20",
    stored: "light",
  });

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("[data-theme-toggle]")).toHaveAccessibleName(
    "Switch to dark theme",
  );

  await activate(page.locator("[data-theme-toggle]"), testInfo.project.name);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("theme")))
    .toBe("dark");
});

test("desktop and mobile navigation expose only the permanent product scope", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name !== "desktop")
    await activate(
      page.getByRole("button", { name: "Open navigation menu" }),
      testInfo.project.name,
    );
  const navigation = page.getByRole("navigation", {
    name:
      testInfo.project.name === "desktop"
        ? "Primary navigation"
        : "Mobile navigation",
  });
  for (const label of [
    "Home",
    "Equity Research",
    "Valuation Lab",
    "Klyro",
    "Portfolio Lab",
    "Analyst Journal",
    "Recruiter View",
    "Contact",
    "Development Log",
  ])
    await expect(
      navigation.getByRole("link", { name: new RegExp(`${label}$`) }),
    ).toBeVisible();
  for (const retired of [
    "Deal Lab",
    "Python Lab",
    "Real Estate",
    "Mistake Journal",
  ])
    await expect(
      navigation.getByRole("link", { name: retired, exact: true }),
    ).toHaveCount(0);
  await expect(
    page.locator('a.button.primary[href="/research"]'),
  ).toBeVisible();
});

test("equity research is available from the public navigation", async ({
  page,
}) => {
  await page.goto("/research");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Developing company dossiers" }),
  ).toBeVisible();
  await expect(page.getByText("Original Klyro research library")).toBeVisible();
});

test("research hub exposes structured routes and transparent placeholders", async ({
  page,
}) => {
  await page.goto("/research/companies/ry");
  await expect(
    page.getByRole("heading", { name: "Royal Bank of Canada", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText("Full research report in development."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF" })).toHaveCount(0);
  await expect(
    page.getByText(
      /Nothing presented on this website constitutes investment advice/,
    ),
  ).toBeVisible();
  await page.goto("/research/themes");
  await expect(page.getByRole("link", { name: "View theme" })).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Reading Library" })).toHaveCount(
    0,
  );
});

test("research note and development log filters work", async ({ page }) => {
  await page.goto("/research/notes");
  const tickerFilter = page.getByRole("combobox", { name: "Ticker", exact: true });
  await tickerFilter.selectOption("RY");
  await expect(
    page.getByRole("heading", { name: "RY: framing credit-cycle questions" }),
  ).toBeVisible();
  await expect(page.getByText("5 notes")).toHaveCount(0);
  await tickerFilter.selectOption("GLW");
  await expect(
    page.getByRole("link", { name: "Download PDF" }),
  ).toHaveAttribute("href", "/reports/GLW-Klyro-Working-Note.pdf");
  await expect(page.getByText("August 5, 2026", { exact: true })).toBeVisible();
  await page.goto("/development-log");
  await expect(
    page.getByRole("heading", {
      name: "Created GLW Optical-Connectivity Working Note",
    }),
  ).toBeVisible();
  await page.getByLabel("Status").selectOption("Planned");
  await expect(
    page.getByRole("heading", {
      name: "Complete the first source-grounded company dossiers",
    }),
  ).toBeVisible();
  await expect(page.getByText("1 entries")).toBeVisible();
  await page.goto("/analyst-journal");
  await expect(
    page.locator('a[href="/reports/GLW-Klyro-Working-Note.pdf"]'),
  ).toBeVisible();
  await expect(
    page.locator('a[href="/reports/BE-Klyro-Analyst-Journal.pdf"]'),
  ).toBeVisible();
});

test("Transaction Intelligence preview is promoted without overstating readiness", async ({
  page,
}, testInfo) => {
  await page.goto("/development-log");
  const entry = page.locator("article").filter({
    has: page.getByRole("heading", {
      name: "Integrated Klyro Preview",
    }),
  });

  await expect(entry).toHaveCount(1);
  await expect(
    entry.getByText(
      /Klyro is evolving from an independent equity-research platform/,
    ),
  ).toBeVisible();
  await expect(entry.locator(".development-preview li")).toHaveCount(9);
  await expect(
    entry.getByRole("link", {
      name: "View Klyro Preview",
    }),
  ).toHaveAttribute("href", "/transaction-intelligence");

  await page.goto("/transaction-intelligence");
  await expect(
    page.getByRole("heading", {
      name: "Klyro",
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText("In Development").first()).toBeVisible();
  const workspace = page.getByRole("navigation", {
    name: "Klyro workspace",
  });
  for (const tab of [
    "Home",
    "Client Request Portal",
    "Nonprofit Back Office",
    "Upload & Clean Transactions",
    "Bank Statement PDF Parser",
    "Bank-to-QuickBooks Reconciliation",
    "Journal Entry Assistant",
    "Monthly Close Board Packet",
  ])
    await expect(workspace.getByRole("button", { name: tab })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Cash Flow Intelligence" })).toBeVisible();
  await expect(page.getByText("Estimated safe to spend")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Top three decisions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "13-week cash outlook" })).toBeVisible();
  const purchaseInput = page.getByLabel("Purchase amount");
  await purchaseInput.fill("30000");
  await expect(page.locator('.ti-purchase-result[data-risk="high-risk"]')).toBeVisible();
  const scenarioSelect = page.getByLabel("Scenario");
  await scenarioSelect.selectOption("Conservative");
  await expect(scenarioSelect).toHaveValue("Conservative");

  await page.getByRole("button", { name: "Upload & Clean Transactions" }).click();
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ["Date", "Description", "Amount", "Category"],
      ["2026-07-01", "Sample deposit", 1250, "Revenue"],
      ["2026-07-02", "Office supplies", -84.5, "Operations"],
    ]),
    "Transactions",
  );
  await page.locator(".ti-panel input[type='file']").setInputFiles({
    name: "sample-transactions.xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer: XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }),
  });
  await expect(
    page.getByText(
      "Loaded sample-transactions.xlsx from 1 worksheet(s): Transactions.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cleaned Data" })).toBeVisible();

  await page.locator(".ti-panel input[type='file']").setInputFiles({
    name: "sample-statement.pdf",
    mimeType: "application/pdf",
    buffer: readFileSync("public/downloads/shy-lee-one-page-profile.pdf"),
  });
  await expect(
    page.getByText(
      "No transaction table was detected, so page-level PDF text from 1 page(s) was preserved for the summary, narrative, review workflow, and exports. Manual review is required.",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Use sample data" }).click();
  await expect(page.getByText("10", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Flagged Transactions" }),
  ).toBeVisible();
  const pdfDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF Review" }).click();
  const pdfDownload = await pdfDownloadPromise;
  expect(pdfDownload.suggestedFilename()).toBe("qbo_cleanup_review.pdf");
  mkdirSync("tmp/pdfs", { recursive: true });
  const pdfPath = `tmp/pdfs/qbo_cleanup_review-${testInfo.project.name}.pdf`;
  await pdfDownload.saveAs(pdfPath);
  const pdfBytes = readFileSync(pdfPath);
  expect(pdfBytes.subarray(0, 5).toString()).toBe("%PDF-");
  const pdfReport = await PDFDocument.load(pdfBytes);
  expect(pdfReport.getPageCount()).toBeGreaterThan(0);

  await page
    .getByRole("button", { name: "Bank-to-QuickBooks Reconciliation" })
    .click();
  await page.getByRole("button", { name: "Use paired sample data" }).click();
  await expect(
    page.getByRole("heading", { name: "Matched Transactions" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Monthly Close Board Packet" }).click();
  await page.getByRole("button", { name: "Use complete sample close packet" }).click();
  await expect(page.getByText("6/6", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Summary" }).click();
  await expect(
    page.getByRole("heading", { name: "Detailed Close Summary" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Imported File Coverage" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Category and Spending Concentration" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Board Narrative" }).click();
  await expect(
    page.getByRole("heading", { name: "Questions for Management" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Review Items" }).click();
  await expect(
    page.getByRole("heading", { name: "Consolidated Review Register" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Export Packet" }).click();
  await expect(
    page.getByRole("heading", { name: "Full Board Packet Export" }),
  ).toBeVisible();
  const boardPdfDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Full Board Packet PDF" }).click();
  const boardPdfDownload = await boardPdfDownloadPromise;
  expect(boardPdfDownload.suggestedFilename()).toBe(
    "monthly_close_board_packet.pdf",
  );
  const boardPdfPath = `tmp/pdfs/monthly_close_board_packet-${testInfo.project.name}.pdf`;
  await boardPdfDownload.saveAs(boardPdfPath);
  const boardPdf = await PDFDocument.load(readFileSync(boardPdfPath));
  expect(boardPdf.getPageCount()).toBeGreaterThan(1);
});

test("Klyro portal home launches highlighted and complete workflows", async ({ page }) => {
  await page.goto("/transaction-intelligence");

  await expect(
    page.getByRole("heading", { name: "Klyro Workflow Highlights" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "All Klyro Portal Tools" }),
  ).toBeVisible();

  for (const workflow of [
    "Upload & Clean Transactions",
    "Journal Entry Assistant",
    "Monthly Close Board Packet",
  ]) {
    await page.getByRole("button", { name: `Open ${workflow}`, exact: true }).click();
    await expect(
      page.getByRole("button", { name: workflow, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Home", exact: true }).click();
  }

  for (const workflow of [
    "Client Request Portal",
    "Nonprofit Back Office",
    "Bank Statement PDF Parser",
    "Bank-to-QuickBooks Reconciliation",
  ]) {
    await page.locator(".ti-workflow-launcher button").filter({ hasText: workflow }).click();
    await expect(
      page.getByRole("button", { name: workflow, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Home", exact: true }).click();
  }
});

test("Klyro login preview communicates trust without collecting credentials", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Your business. Your books. Your control." })).toBeVisible();
  await expect(page.getByText("Customer authentication is not active yet.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue securely" })).toBeDisabled();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});

test("retired routes are removed and the old journal route redirects", async ({
  page,
  request,
}) => {
  for (const route of [
    "/deal-lab",
    "/python-lab",
    "/real-estate",
    "/research/library",
  ])
    expect((await request.get(route, { maxRedirects: 0 })).status()).toBe(404);
  const legacy = await request.get("/mistake-journal", { maxRedirects: 0 });
  expect([301, 308]).toContain(legacy.status());
  expect(legacy.headers().location).toBe("/portfolio/mistake-journal");
  await page.goto("/mistake-journal");
  await expect(page).toHaveURL(/\/portfolio\/mistake-journal$/);
});

test("Portfolio exposes the required sections", async ({ page }, testInfo) => {
  await page.goto("/portfolio");
  for (const label of [
    "Overview",
    "Active Positions",
    "Watchlist",
    "Long-Term Compounders",
    "Conviction Dashboard",
    "Mistake Journal",
  ])
    await expect(
      page.getByRole("tab", { name: label, exact: true }),
    ).toBeVisible();
  await activate(
    page.getByRole("tab", { name: "Active Positions" }),
    testInfo.project.name,
  );
  const anetRow = page
    .locator(".active-positions-table tbody tr")
    .filter({ hasText: "ANET" });
  await expect(anetRow).toHaveCount(1);
  await expect(anetRow.getByText("Monitoring", { exact: true })).toBeVisible();
  await expect(
    anetRow.getByText(/ANET moved from the Watchlist into Active Positions/),
  ).toBeVisible();
  await expect(
    page.locator(".active-positions-table tbody tr").filter({ hasText: "PANW" }),
  ).toHaveCount(0);
  await expect(
    anetRow.getByText("Not publicly disclosed", { exact: true }).first(),
  ).toBeVisible();
  await expect(anetRow.getByText("Research needed")).toHaveCount(0);
  await expect(
    page.getByRole("columnheader", { name: "Position size" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("columnheader", { name: "Purchase date" }),
  ).toHaveCount(0);
  await activate(
    page.getByRole("tab", { name: "Long-Term Compounders" }),
    testInfo.project.name,
  );
  await expect(
    page.locator(".holdings-table tbody tr").filter({ hasText: "AIPO" }),
  ).toHaveCount(1);
  await expect(
    page.locator(".holdings-table tbody tr").filter({ hasText: "SLV" }),
  ).toHaveCount(0);
  await expect(
    page.locator(".holdings-table tbody tr").filter({ hasText: "SpaceX" }),
  ).toContainText("Not publicly traded");
  await expect(
    page.locator(".holdings-table tbody tr").filter({ hasText: "PG" }),
  ).toHaveCount(0);
  await activate(
    page.getByRole("tab", { name: "Watchlist" }),
    testInfo.project.name,
  );
  await expect(page.getByText("JBL", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("tab", { name: "Performance" })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "View Full Research" }),
  ).toHaveCount(12);
  await expect(page.getByText("Digital Realty Trust Inc.")).toBeVisible();
  await expect(page.getByText("Data pending", { exact: true })).toBeVisible();
});

test("Portfolio table headers do not cover the first data row", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "Portfolio tables use the existing card layout on mobile.",
  );

  await page.goto("/portfolio");

  for (const tab of [
    "Active Positions",
    "Watchlist",
    "Long-Term Compounders",
    "Mistake Journal",
  ]) {
    await activate(
      page.getByRole("tab", { name: tab, exact: true }),
      testInfo.project.name,
    );

    const visibleTable = page.locator("table:visible").first();
    const header = visibleTable.locator("thead").first();
    const firstRow = visibleTable.locator("tbody tr").first();
    await expect(header).toBeVisible();
    await expect(firstRow).toBeVisible();

    const [headerBox, firstRowBox] = await Promise.all([
      header.boundingBox(),
      firstRow.boundingBox(),
    ]);
    expect(headerBox).not.toBeNull();
    expect(firstRowBox).not.toBeNull();
    expect(headerBox!.y + headerBox!.height).toBeLessThanOrEqual(
      firstRowBox!.y + 1,
    );
  }
});

test("Watchlist research pages expose structured, non-fabricated coverage", async ({
  page,
}) => {
  await page.goto("/watchlist/glw");
  await expect(
    page.getByRole("heading", { name: "Corning Incorporated", level: 1 }),
  ).toBeVisible();
  for (const heading of [
    "Scenarios before conviction.",
    "Build From Operating Components",
    "Five Years of Evidence — Not Invented Precision",
    "Make every assumption visible.",
    "Branded documents—published only when complete.",
  ])
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Report in Progress" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Model in Progress" }),
  ).toBeDisabled();
  await expect(page.getByText("Optical Communications").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Annual report" }).first()).toHaveAttribute(
    "href",
    /sec\.gov\/Archives/,
  );
  await expect(page.getByText("FY2025").first()).toBeVisible();
  await expect(page.getByText("Data pending")).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://luna1research.com/watchlist/glw",
  );
  await page.goto("/watchlist/dlr");
  await expect(
    page.getByRole("heading", { name: "Why I Follow Digital Realty" }),
  ).toBeVisible();
  await expect(
    page.getByText(/facility associated with Digital Realty/),
  ).toBeVisible();
  await page.goto("/watchlist/aipo");
  await expect(
    page.getByRole("heading", {
      name: "Understand the portfolio before the theme.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({
      hasText: /^Weighted underlying valuation$/,
    }),
  ).toBeVisible();
});

test("homepage omits retired overview modules", async ({ page }) => {
  await page.goto("/");
  for (const section of [
    "Featured Research",
    "Evidence before opinion.",
    "Career and Credentials",
    "Portfolio · Latest Decision Review",
    "Portfolio Snapshot",
    "Current Areas of Focus",
  ])
    await expect(page.getByText(section, { exact: true })).toHaveCount(0);
});

test("Portfolio retains the global market pulse and its controls", async ({ page }) => {
  await page.goto("/portfolio");
  const pulse = page.getByRole("region", { name: "Klyro Market Pulse" });
  await expect(pulse).toBeVisible();
  await pulse
    .getByRole("button", { name: "Pause market ticker updates and motion" })
    .click();
  await expect(
    pulse.getByRole("button", { name: "Resume market ticker updates and motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(pulse.getByText(/Updates paused/)).toBeVisible();
});

test("portfolio sections share one quote request and reusable displays", async ({ page }, testInfo) => {
  let portfolioRequests = 0;
  await page.route("**/api/market-quotes?**", async (route) => {
    const url = new URL(route.request().url());
    const symbols = (url.searchParams.get("symbols") ?? "").split(",").filter(Boolean);
    if (["CASY", "AIPO", "AAPL", "COST", "VOO"].every((symbol) => symbols.includes(symbol))) portfolioRequests += 1;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "success", lastUpdated: "2026-07-31T20:00:00.000Z", provider: "Financial Modeling Prep", unavailableSymbols: [], quotes: symbols.map((symbol, index) => ({ symbol, price: 100 + index, change: 1.25, changePercent: 1.1, currency: "USD", marketStatus: "closed", timestamp: "2026-07-31T20:00:00.000Z", dataType: "previous-close" })) }) });
  });
  const quoteRow = (symbol: string) => page.locator(`[data-symbol="${symbol}"]`);
  await page.goto("/portfolio");
  await activate(page.getByRole("tab", { name: "Active Positions" }), testInfo.project.name);
  await expect(quoteRow("CASY").getByText("Previous Close")).toBeVisible({ timeout: 10_000 });
  await activate(page.getByRole("tab", { name: "Watchlist" }), testInfo.project.name);
  await expect(quoteRow("GLW").getByText("Previous Close")).toBeVisible();
  await activate(page.getByRole("tab", { name: "Long-Term Compounders" }), testInfo.project.name);
  for (const symbol of ["AAPL", "COST", "VOO"]) await expect(quoteRow(symbol).getByText("Previous Close")).toBeVisible();
  expect(portfolioRequests).toBe(1);
});

test("portfolio quote displays tolerate unavailable responses", async ({ page }) => {
  await page.route("**/api/market-quotes?**", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ status: "unavailable", message: "Market data is temporarily unavailable." }) }));
  await page.goto("/portfolio");
  await page.getByRole("tab", { name: "Watchlist" }).click();
  await expect(page.locator('[data-symbol="GLW"]').getByText("Quote unavailable")).toBeVisible();
});

test("JBL decision review remains under Portfolio", async ({
  page,
}, testInfo) => {
  await page.goto("/portfolio/mistake-journal");
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Portfolio");
  await expect(page.getByText("Jabil Inc.")).toBeVisible();
  await activate(
    page.getByRole("button", { name: "View Review" }),
    testInfo.project.name,
  );
  await expect(page.getByRole("dialog", { name: /JBL/ })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Final Assessment" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Before Rule / After Rule" }),
  ).toBeVisible();
  await activate(
    page.getByRole("button", { name: "Close JBL decision review" }),
    testInfo.project.name,
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("Mistake Journal filters remain functional", async ({
  page,
}, testInfo) => {
  await page.goto("/portfolio/mistake-journal");
  await page.getByLabel("Classification").selectOption("Failed Thesis");
  await expect(page.getByRole("status")).toContainText("no decisions");
  await activate(
    page.getByRole("button", { name: "Reset filters" }).first(),
    testInfo.project.name,
  );
  await expect(page.getByText("Jabil Inc.")).toBeVisible();
});

test("educational disclosure remains globally visible", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Educational Disclosure:", { exact: true }),
  ).toBeVisible();
});

test("contact form and endpoint validate", async ({ page, request }) => {
  await page.goto("/contact");
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Request connection" }),
  ).toBeVisible();
  const invalid = await request.post("/api/contact", {
    data: {
      name: "Research Visitor",
      email: "not-an-email",
      subject: "Research discussion",
      message: "I would like to discuss the educational research methodology.",
    },
  });
  expect(invalid.status()).toBe(400);
});

test("recruiter view retains profile and downloads", async ({ page }) => {
  await page.goto("/recruiter");
  await expect(page.getByText("Shy Lee · Founder")).toBeVisible();
  await expect(
    page.getByAltText("Portrait of Shy Lee, founder of Klyro"),
  )
    .toBeVisible();
  await expect(
    page.getByAltText("Portrait of Shy Lee, founder of Klyro"),
  ).toHaveAttribute("src", /shyheim-lee-recruiter\.jpeg/);
  await expect(
    page.getByRole("link", { name: /Download Profile/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /One-page brief/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Data center evidence/ }),
  ).toHaveAttribute(
    "href",
    "/downloads/shyheim-lee-data-center-finance-evidence-sheet.pdf",
  );
});

test("reduced motion disables the prism sweep", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".prism-signature")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".prism-signature")
        .evaluate((element) => getComputedStyle(element, "::after").display),
    )
    .toBe("none");
});

test("thesis stress test validates probabilities and generates a memo", async ({
  page,
}) => {
  await page.goto("/research/anet");
  await page.getByRole("link", { name: "Challenge the Thesis" }).click();
  await expect(
    page.getByRole("heading", { name: "Klyro Thesis Stress Test" }),
  ).toBeVisible();
  await page.getByLabel("Bull-case probability").fill("20");
  await expect(page.locator(".validation-error")).toContainText("must equal 100%");
  await expect(
    page.getByRole("button", { name: /Generate deterministic analysis/ }),
  ).toBeDisabled();
  await page.getByLabel("Bull-case probability").fill("25");
  await page
    .getByRole("button", { name: /Generate deterministic analysis/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your View vs. Klyro" }),
  ).toBeVisible();
  await expect(page.getByText("Klyro Investment Committee Challenge")).toBeVisible();
  await expect(page.getByText(/not investment advice/i).last()).toBeVisible();
});

test("stress test supports analyst, risk, project, and anonymous observer modes", async ({
  page,
}) => {
  await page.goto("/research/strl/stress-test");
  await page.getByRole("radio", { name: "Research Analyst" }).check();
  await expect(page.getByLabel("Revenue growth")).toBeVisible();
  await page.getByRole("radio", { name: "Risk Analyst" }).check();
  await expect(page.getByLabel("Execution risk score")).toBeVisible();
  await page
    .getByRole("radio", { name: "Infrastructure / Project Finance" })
    .check();
  await expect(page.getByLabel("Project capacity")).toBeVisible();
  await page.getByRole("radio", { name: "Observer" }).check();
  await expect(page.getByText("Read-only committee review")).toBeVisible();
});

test("research-view endpoint rejects invalid anonymous submissions", async ({
  request,
}) => {
  const response = await request.post("/api/research-views", {
    data: {
      professionalRole: "Research Analyst",
      company: "Arista Networks",
      thesisStance: "Neutral",
      importantAssumption: "Margins",
      mainDisagreement: "The margin assumption needs more evidence.",
      researchQuestion: "What supports the forward margin assumption?",
      sourceUrl: "javascript:alert(1)",
      consent: "true",
    },
  });
  expect(response.status()).toBe(400);
});
