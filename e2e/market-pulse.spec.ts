import { expect, test } from "@playwright/test";

const instruments = [
  ["sp500-etf", "SPY", "S&P 500 ETF", "equity"],
  ["russell-2000", "RUT", "Russell 2000", "index"],
  ["us-10-year", "US10Y", "U.S. 10-Year Treasury", "treasury"],
  ["wti-crude", "WTI", "WTI Crude Oil", "commodity"],
  ["natural-gas", "NATGAS", "Natural Gas", "commodity"],
  ["gold", "GOLD", "Gold", "commodity"],
  ["nvidia", "NVDA", "NVIDIA", "equity"],
  ["broadcom", "AVGO", "Broadcom", "equity"],
] as const;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/market-pulse", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      provider: "Financial Modeling Prep",
      status: "ok",
      updatedAt: "2026-08-04T20:00:00.000Z",
      quotes: instruments.map(([id, symbol, label, assetClass], index) => ({
        id, symbol, label, assetClass, price: assetClass === "treasury" ? 4.25 : 100 + index,
        change: 1.25, changePercent: 1.1, previousClose: 98.75 + index,
        marketStatus: "open", asOf: "2026-08-04T20:00:00.000Z", delayed: true, stale: false,
      })),
    }),
  }));
});

for (const path of ["/", "/portfolio", "/transaction-intelligence"]) {
  test(`Market Pulse renders globally on ${path}`, async ({ page }) => {
    await page.goto(path);
    const pulse = page.getByRole("region", { name: "Luna1 Market Pulse" });
    await expect(pulse).toBeVisible();
    await expect(pulse.getByText("SPY", { exact: true })).toBeVisible();
    await expect(pulse.getByText("US10Y", { exact: true })).toBeVisible();
    await expect(pulse.getByText(/^DELAYED · OPEN$/).first()).toBeVisible();
  });
}

test("Market Pulse pause and resume preserve displayed values", async ({ page }) => {
  await page.goto("/portfolio");
  const pulse = page.getByRole("region", { name: "Luna1 Market Pulse" });
  await expect(pulse.getByText("$100.00", { exact: true })).toBeVisible();
  await pulse.getByRole("button", { name: "Pause market ticker updates and motion" }).click();
  await expect(pulse.getByText("Updates paused · Current values preserved")).toBeVisible();
  await expect(pulse.getByText("$100.00", { exact: true })).toBeVisible();
  await pulse.getByRole("button", { name: "Resume market ticker updates and motion" }).click();
  await expect(pulse.getByText("$100.00", { exact: true })).toBeVisible();
});
