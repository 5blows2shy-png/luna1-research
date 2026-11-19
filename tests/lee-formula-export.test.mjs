import test from 'node:test';
import assert from 'node:assert/strict';
import { leeFormulaGrid, leeFormulaCSV } from '../src/lib/lee-formula-export.ts';
import { initialExpansionProject } from '../src/lib/lee-expansion.ts';
import { initialLeeDebt } from '../src/lib/lee-data-center.ts';
import { rowsToCSV } from '../src/lib/development-export.ts';

test('annual and return formula CSVs are self-contained and preserve all scenario summaries', () => {
  for (const kind of ['annual', 'returns']) {
    const grid = leeFormulaGrid(initialExpansionProject(), initialLeeDebt(), kind);
    assert.deepEqual(grid.outputs.map(o => o.scenario), ['Base', 'Upside', 'Downside']);
    for (const { cells } of grid.outputs) for (const address of Object.values(cells)) {
      assert.ok(grid.rows[Number(address.slice(1)) - 1][1].formula.startsWith('='));
    }
    for (const row of grid.rows) for (const cell of row) if (typeof cell === 'object') {
      assert.ok(!cell.formula.includes('!'), 'No external file or worksheet references');
      for (const match of cell.formula.matchAll(/\$?([A-L])\$?(\d+)/g)) {
        assert.ok(Number(match[2]) <= grid.rows.length, 'Reference stays inside exported sheet');
      }
    }
    const csv = leeFormulaCSV(initialExpansionProject(), initialLeeDebt(), kind);
    assert.ok(csv.includes('IRR(') && csv.includes('SUM('));
    assert.ok(!csv.includes("'=IF"), 'Authored formulas must not be escaped as literal text');
  }
});

test('formula exports preserve edited assumptions, zero rates and unavailable scenarios', () => {
  const a = initialExpansionProject(), d = { ...initialLeeDebt(), equityDiscountRate: .22, interestRate: 0, leverage: 0 };
  const grid = leeFormulaGrid(a, d, 'annual');
  assert.equal(grid.rows.find(r => r[0] === 'INPUT | Equity discount rate')[1], .22);
  assert.equal(grid.rows.find(r => r[0] === 'INPUT | Interest rate')[1], 0);
  assert.equal(grid.rows.find(r => r[0] === 'INPUT | Debt / development CapEx')[1], 0);
  // Upside subtracts 1% from the entered rate and is explicitly invalid here.
  assert.deepEqual(grid.outputs.map(o => o.scenario), ['Base', 'Downside']);
  assert.ok(grid.rows.some(r => r[0] === 'Unavailable scenario'));
  assert.ok(rowsToCSV([{ Text: '=HYPERLINK("bad")', Value: -10 }]).includes("'=HYPERLINK"), 'Generic data exports must retain injection protection');
});
