import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('Lee formula downloads include current inputs and keep data exports separate', async ({ page }) => {
  await page.goto('/recruiter/projects/lee-data-center');
  await page.getByText('Edit investment & financing assumptions', { exact: true }).click();
  await page.getByLabel('Equity discount rate (%)', { exact: true }).fill('22');
  for (const kind of ['annual', 'returns']) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: `Download ${kind} CSV with formulas`, exact: true }).click(),
    ]);
    expect(download.suggestedFilename()).toBe(`lee-data-center-${kind}-formulas.csv`);
    const csv = await readFile((await download.path())!, 'utf8');
    expect(csv).toContain('"INPUT | Equity discount rate","0.22"');
    expect(csv).toContain('IRR(');
    expect(csv).toContain('"=IF(');
    expect(csv).not.toContain("'=IF(");
  }
  await page.getByText('Values-only exports for Power BI and data imports', { exact: true }).click();
  const [data] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download annual values CSV', exact: true }).click(),
  ]);
  expect(await readFile((await data.path())!, 'utf8')).not.toContain('"=');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
