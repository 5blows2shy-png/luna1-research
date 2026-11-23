import test from 'node:test';
import assert from 'node:assert/strict';
import { demoDataset, demoVMs, demoBudget } from '../src/lib/cloudspend/demo.ts';
import { anomalies, daysInMonth, dimensions, forecast, groupCosts, overview, period, rightsize, total } from '../src/lib/cloudspend/model.ts';
import { focusCSV, importFocus, parseCSV } from '../src/lib/cloudspend/import.ts';
const data = demoDataset();
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(b)), `${a} vs ${b}`);

test('CloudSpend current-period totals, matched-period comparison and run rate reconcile', () => {
  const o = overview(data, data.rows, '2026-11', 'BilledCost');
  assert.equal(o.elapsed, 21); assert.equal(o.partial, true);
  close(o.actual, total(period(data.rows, '2026-11'), 'BilledCost'));
  close(o.monthEndForecast, o.actual / 21 * 30);
  close(o.change, o.actual / total(period(data.rows, '2026-10', 21), 'BilledCost') - 1);
  close(o.previousCost, total(period(data.rows, '2026-10'), 'BilledCost'));
  const closed = overview(data, data.rows, '2026-10', 'EffectiveCost');
  close(closed.monthEndForecast, closed.actual); assert.equal(closed.partial, false);
  assert.equal(overview({ ...data, start: '2026-11-05' }, period(data.rows, '2026-11'), '2026-11', 'BilledCost').monthEndForecast, null);
  assert.equal(daysInMonth('2028-02'), 29);
});
test('CloudSpend allocation reconciles across every dimension and both cost bases', () => {
  const rows = period(data.rows, '2026-11');
  for (const basis of ['BilledCost', 'EffectiveCost']) for (const dimension of dimensions) {
    const groups = groupCosts(rows, dimension, basis);
    close(groups.reduce((s, g) => s + g.cost, 0), total(rows, basis));
    close(groups.reduce((s, g) => s + g.share, 0), 1);
  }
  assert.ok(groupCosts(rows, 'Department', 'BilledCost').some(g => g.name === 'Unallocated' && g.cost > 0));
  assert.ok(total(rows, 'EffectiveCost') < total(rows, 'BilledCost'));
  const budget = demoBudget(rows, '2026-11');
  close(demoBudget(rows.map(r => ({ ...r, BilledCost: r.BilledCost * 2 })), '2026-11'), budget);
  assert.ok(demoBudget(rows.filter(r => r.ProviderName === 'AWS'), '2026-11') < budget);
});
test('CloudSpend forecasts separate actuals, demand growth and a single savings assumption', () => {
  const f = forecast(1000, '2026-11', .1, .2);
  assert.deepEqual(f.map(r => r.month), ['2026-12', '2027-01', '2027-02']);
  close(f[2].gross, 1331); close(f[2].savings, 266.2); close(f[2].net, 1064.8);
  assert.equal(forecast(null, '2026-11', 0, 0)[0].gross, null);
  assert.equal(forecast(-100, '2026-11', 0, .2)[0].savings, 0);
  assert.throws(() => forecast(100, '2026-11', NaN, .2));
  assert.throws(() => forecast(100, '2026-11', .1, 1));
});
test('CloudSpend rightsizing protects memory, peaks, coverage, workload minimums and performance', () => {
  const low = demoVMs[0], candidate = rightsize(low);
  assert.equal(candidate.eligible, true); close(candidate.savings, low.vcpu / 2 * low.cpuPrice + low.ram / 2 * low.ramPrice);
  assert.equal(rightsize(demoVMs[1]).eligible, false, 'Low average CPU does not override memory pressure');
  for (const edit of [{ cpuPeak: .7 }, { memoryPeak: .8 }, { days: 14 }, { coverage: .8 }, { minimumCpu: 16 }, { minimumRam: 64 }, { latency: 200 }, { peakIops: 4500 }]) {
    const blocked = rightsize({ ...low, ...edit }); assert.equal(blocked.savings, 0); assert.ok(blocked.reasons.length);
  }
});
test('CloudSpend anomalies detect seeded compute and storage events without future leakage', () => {
  const all = anomalies(data, data.rows, '2026-11', 'BilledCost');
  assert.ok(all.some(a => a.date === '2026-11-18' && a.provider === 'AWS' && a.category === 'Compute'));
  assert.ok(all.some(a => a.date === '2026-11-19' && a.provider === 'Azure' && a.usageChange > 2 && a.signal.includes('Storage usage')));
  const truncated = { ...data, through: '2026-11-18', rows: data.rows.filter(r => r.Date <= '2026-11-18') };
  assert.deepEqual(anomalies(truncated, truncated.rows, '2026-11', 'BilledCost'), all.filter(a => a.date <= '2026-11-18'));
  assert.equal(anomalies({ ...data, start: '2026-11-18' }, period(data.rows, '2026-11').filter(r => r.Date >= '2026-11-18'), '2026-11', 'BilledCost').length, 0);
});
test('FOCUS subset round-trips AWS, Azure and private cloud with full-precision financial totals', () => {
  const imported = importFocus(focusCSV(data.rows), data.start, data.through);
  assert.equal(imported.rows.length, data.rows.length);
  close(total(imported.rows, 'BilledCost'), total(data.rows, 'BilledCost'));
  close(total(imported.rows, 'EffectiveCost'), total(data.rows, 'EffectiveCost'));
  assert.deepEqual([...new Set(imported.rows.map(r => r.ProviderName))], ['AWS', 'Azure', 'VMware']);
  assert.deepEqual(parseCSV('\uFEFFA,B\r\n"a,b","two\nlines"\r\n'), [['A', 'B'], ['a,b', 'two\nlines']]);
  const credit = { ...data.rows[0], BilledCost: -10, EffectiveCost: 0, Department: '=HYPERLINK("unsafe")' };
  const csv = focusCSV([credit]); assert.ok(csv.includes("'=HYPERLINK"));
  assert.equal(importFocus(csv, data.start, data.through).rows[0].BilledCost, -10);
});
test('FOCUS import rejects invalid, duplicate, multi-currency or misdated rows atomically', () => {
  const csv = focusCSV([data.rows[0]]);
  for (const bad of [csv.replace('"USD"', '"EUR"'), csv.replace('2026-06-01T00:00:00Z', '2026-02-30T00:00:00Z'), csv.replace('2026-06-02T00:00:00.000Z', '2026-07-01T00:00:00Z'), `${csv}\r\n${csv.split('\r\n')[1]}`, csv.replace('"BilledCost"', '"BadColumn"')]) assert.throws(() => importFocus(bad, data.start, data.through));
  assert.throws(() => importFocus(csv, '2026-07-01', data.through));
  assert.throws(() => importFocus(csv, '', data.through));
  assert.throws(() => parseCSV('A,B\n"unclosed,field'));
  assert.throws(() => parseCSV('A,B\n"closed"unexpected,x'));
});
