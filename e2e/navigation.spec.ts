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
    "/portfolio",
    "/portfolio/mistake-journal",
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
    "Research",
    "Portfolio",
    "About",
    "Recruiter View",
    "Contact",
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
});

test("retired routes are removed and the old journal route redirects", async ({
  page,
  request,
}) => {
  for (const route of ["/deal-lab", "/python-lab", "/real-estate"])
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
});

test("homepage omits retired overview modules", async ({ page }) => {
  await page.goto("/");
  for (const section of [
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
