import { test, expect } from "@playwright/test";
test("Global Finance routes, research navigation, and responsive charts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => {
    if (!e.message.includes("due to access control checks")) errors.push(e.message);
  });
  for (const route of [
    "/global-finance",
    "/global-finance/treasury",
    "/global-finance/fpa",
    "/global-finance/casebook",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Global Finance sections" })
        .getByRole("link", { name: "Overview", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Nothing presented on this website", { exact: false }),
    ).toHaveCount(1);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
    ).toBe(true);
    await expect(page.locator("main")).not.toContainText("NaN");
  }
  expect(errors).toEqual([]);
});
test("Treasury changes recalculate and missing FX never becomes a quote", async ({
  page,
}) => {
  await page.goto("/global-finance/treasury");
  await page.getByRole("button", { name: "EUR/USD -10%", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "EUR/USD -10%", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("main")).toContainText("-20.00m");
  await page.getByLabel("Assumed USD per EUR").fill("");
  await expect(page.getByRole("status")).toContainText("Not Available");
  await page
    .getByLabel("Revenue in selected currency (%)", { exact: true })
    .fill("110");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Exposure",
  );
  await page.getByRole("button", { name: "Reset assumptions" }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
});
test("FP&A commentary, forecast, keyboard controls, and CSV download", async ({
  page,
}) => {
  await page.goto("/global-finance/fpa");
  await expect(page.locator("main")).toContainText("$239.46m");
  await expect(page.locator("main")).toContainText(
    "Revenue grew 8.0% in local currency and 3.1%",
  );
  const growth = page.getByLabel("Local revenue growth (%)", { exact: true });
  await growth.fill("10");
  await growth.focus();
  await page.keyboard.press("ArrowUp");
  await expect(growth).toHaveValue("11");
  await expect(page.locator("main")).toContainText("$265.80m");
  await growth.fill("");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Enter finite",
  );
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download fictional inputs (CSV)" })
    .click();
  expect((await download).suggestedFilename()).toBe(
    "northstar-fictional-inputs.csv",
  );
});
test("company provenance, capital-flow geography, casebook and recruiter links", async ({
  page,
}) => {
  await page.goto("/research/companies/glw");
  await expect(
    page.getByRole("heading", { name: "Global Exposure", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#global-exposure")).toContainText("Not Available");
  await expect(page.locator("#global-exposure a[href*='sec.gov']")).toHaveCount(
    1,
  );
  await page.goto("/watchlist/glw");
  await expect(
    page.getByRole("heading", { name: "Global Exposure", exact: true }),
  ).toBeVisible();
  await page.goto("/research/capital-flows#capital-flow-compute");
  const theme = page.locator("#capital-flow-compute");
  if ((await theme.getAttribute("open")) === null)
    await theme.locator(":scope > summary").click();
  await expect(theme.getByText("Taiwan", { exact: true })).toBeVisible();
  await page.goto("/global-finance/casebook");
  await page.getByRole("link", { name: "Open interactive model" }).click();
  await expect(page).toHaveURL(/\/treasury$/);
  await page.goto("/recruiter");
  await expect(
    page.getByRole("link", { name: "Global FP&A Case" }),
  ).toHaveAttribute("href", "/global-finance/fpa");
});

test("Global Finance replaces Klyro in top navigation and regional interests are accessible", async ({ page }) => {
  await page.goto("/global-finance");
  await expect(page.getByRole("heading", {name:"Building a Career Without Borders"})).toBeVisible();
  const menu = page.getByRole("button", {name:"Open navigation menu"});
  const mobileMenu = await menu.isVisible();
  if (mobileMenu) await menu.click();
  const nav = page.getByRole("navigation", {name: mobileMenu ? "Mobile navigation" : "Primary navigation", exact:true});
  const global = nav.getByRole("link", {name:/Global Finance$/i});
  await expect(global).toHaveAttribute("href", "/global-finance");
  await expect(global).toHaveClass(/active/);
  await expect(nav.getByRole("link",{name:/Klyro$/i})).toHaveCount(0);
  await expect(nav.getByRole("link",{name:/Equity Research$/i})).not.toHaveClass(/active/);
  if (await page.getByRole("button",{name:"Close navigation menu"}).isVisible()) await page.keyboard.press("Escape");
  const singapore = page.getByRole("button",{name:"Singapore / Southeast Asia",exact:true});
  await singapore.focus(); await page.keyboard.press("Enter");
  await expect(singapore).toHaveAttribute("aria-pressed","true");
  await expect(page.locator("#regional-interest-detail")).toContainText("Asia-Pacific corporate finance");
  await expect(page.locator("#regional-interest-detail")).toContainText("not work history");
  await expect(page.getByRole("heading",{name:"Global Markets I’m Watching"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
