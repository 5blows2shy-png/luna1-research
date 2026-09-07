import { expect, test } from "@playwright/test";

test.describe("Luna Books guided tour", () => {
  test("navigates, restarts, and exposes a safe exit at each viewport", async ({ page }) => {
    await page.goto("/demo/luna-books-tour");
    await expect(page.getByTestId("luna-books-tour")).toHaveAttribute("data-demo-mode", "isolated");
    await expect(page.getByRole("heading", { name: "Welcome to Luna Books" })).toBeVisible();
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.getByRole("heading", { name: "One private workspace for each business" })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { name: "Turn transaction activity into a review queue" })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.getByRole("button", { name: /Restart/ }).click();
    await expect(page.getByRole("heading", { name: "Welcome to Luna Books" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Exit tour" })).toHaveAttribute("href", "/transaction-intelligence");
  });
});
