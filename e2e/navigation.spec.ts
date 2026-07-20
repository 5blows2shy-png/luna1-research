import { test, expect, type Locator } from "@playwright/test";

async function activate(locator: Locator, projectName: string) {
  if (projectName === "mobile") {
    await locator.tap();
    return;
  }
  await locator.click();
}

test("primary pages load without horizontal overflow", async ({ page }) => {
  for (const route of [
    "/",
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
    "Portfolio",
    "About",
    "Recruiter View",
    "Contact",
    "Development Log",
  ])
    await expect(
      navigation.getByRole("link", { name: new RegExp(`${label}$`) }),
    ).toBeVisible();
  for (const retired of [
    "Research",
    "Deal Lab",
    "Python Lab",
    "Real Estate",
    "Mistake Journal",
  ])
    await expect(
      navigation.getByRole("link", { name: retired, exact: true }),
    ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore Research" }),
  ).toHaveCount(0);
});

test("archived research remains available without public navigation", async ({
  page,
}) => {
  await page.goto("/research");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Developing company dossiers" }),
  ).toBeVisible();
  await expect(page.getByText("Original Luna1 research library")).toBeVisible();
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
  await page.getByLabel("Ticker").selectOption("RY");
  await expect(
    page.getByRole("heading", { name: "RY: framing credit-cycle questions" }),
  ).toBeVisible();
  await expect(page.getByText("5 notes")).toHaveCount(0);
  await page.goto("/development-log");
  await page.getByLabel("Status").selectOption("Planned");
  await expect(
    page.getByRole("heading", {
      name: "Complete the first source-grounded company dossiers",
    }),
  ).toBeVisible();
  await expect(page.getByText("1 entries")).toBeVisible();
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
    page.getByRole("tab", { name: "Watchlist" }),
    testInfo.project.name,
  );
  await expect(page.getByText("JBL", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("tab", { name: "Performance" })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "View Full Research" }),
  ).toHaveCount(26);
  await expect(page.getByText("Digital Realty Trust Inc.")).toBeVisible();
  await expect(page.getByText("Data pending", { exact: true })).toBeVisible();
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
    "Build from operating components.",
    "Five years of evidence—not invented precision.",
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
  await expect(page.getByText("Data pending").first()).toBeVisible();
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
  await expect(page.getByText("Weighted underlying valuation")).toBeVisible();
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
    page.getByAltText("Portrait of Shy Lee, founder of Luna1 Research"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Download Profile/ }),
  ).toBeVisible();
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
