import { rowsToCSV } from '../development-export.ts';
import { dimensions, type CostRow, type Dataset, type Provider } from './model.ts';

/** RFC 4180 quoted fields, embedded newlines and BOM; explicit errors instead of partial imports. */
export function parseCSV(text: string): string[][] {
  if (text.length > 5_000_000) throw new Error('Use a CSV smaller than 5 MB.');
  text = text.replace(/^\uFEFF/, '');
  const rows: string[][] = []; let row: string[] = [], field = '', quoted = false, closed = false;
  const push = () => { row.push(field); field = ''; closed = false; };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) { if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; closed = true; } } else field += ch; }
    else if (ch === '"') { if (field || closed) throw new Error('Invalid CSV quoting.'); quoted = true; }
    else if (ch === ',') push();
    else if (ch === '\r' || ch === '\n') { if (ch === '\r' && text[i + 1] === '\n') i++; push(); if (row.some(v => v !== '')) rows.push(row); row = []; }
    else { if (closed) throw new Error('Unexpected characters after a quoted CSV field.'); field += ch; }
    if (rows.length > 25_001) throw new Error('Use at most 25,000 billing records.');
  }
  if (quoted) throw new Error('Unclosed CSV quotation.');
  push(); if (row.some(v => v !== '')) rows.push(row);
  return rows;
}
function isoDate(value: string) {
  const date = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error('Dates must be valid ISO YYYY-MM-DD dates or UTC timestamps.');
  return date;
}
export function importFocus(text: string, start: string, through: string): Dataset {
  isoDate(start); isoDate(through);
  if (start > through || Date.parse(through) - Date.parse(start) > 366 * 86400000) throw new Error('Declare a complete coverage range of no more than one year.');
  const [headers, ...records] = parseCSV(text);
  if (records.length > 25_000) throw new Error('Use at most 25,000 billing records.');
  if (!headers || !records.length) throw new Error('The file must contain a header and billing records.');
  if (new Set(headers).size !== headers.length) throw new Error('Duplicate column names are not supported.');
  const required = ['ProviderName', 'ServiceCategory', 'ServiceName', 'ResourceId', 'ChargePeriodStart', 'ChargePeriodEnd', 'BilledCost', 'EffectiveCost', 'BillingCurrency'];
  for (const column of required) if (!headers.includes(column)) throw new Error(`Missing ${column}. Export the daily FOCUS cost-and-usage dataset from AWS or Azure.`);
  const seen = new Set<string>();
  const rows = records.map((values, index): CostRow => {
    try {
      if (values.length !== headers.length) throw new Error('Column count differs from the header.');
      const record = Object.fromEntries(headers.map((h, i) => [h, values[i].trim()]));
      const key = JSON.stringify(values);
      if (seen.has(key)) throw new Error('Exact duplicate record found. Deduplicate the source export before importing.'); seen.add(key);
      const aliases: Record<string, Provider> = { AWS: 'AWS', 'Amazon Web Services': 'AWS', Azure: 'Azure', Microsoft: 'Azure', 'Microsoft Azure': 'Azure', VMware: 'VMware' };
      const provider = aliases[record.ProviderName]; if (!provider) throw new Error('ProviderName must identify AWS, Microsoft Azure or VMware.');
      if (record.BillingCurrency !== 'USD') throw new Error('Only USD is supported; convert currencies upstream with an explicit FX policy.');
      const date = isoDate(record.ChargePeriodStart); isoDate(record.ChargePeriodEnd);
      for (const field of ['ChargePeriodStart', 'ChargePeriodEnd']) if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/.test(record[field])) throw new Error('Charge periods must use ISO dates or UTC timestamps ending in Z.');
      const begin = Date.parse(record.ChargePeriodStart), end = Date.parse(record.ChargePeriodEnd);
      if (!Number.isFinite(begin) || !Number.isFinite(end) || end <= begin || end - begin > 86400000 || new Date(end - 1).toISOString().slice(0, 10) !== date) throw new Error('Use UTC charge periods contained within one day (end is exclusive). Monthly charges require upstream allocation.');
      if (date < start || date > through) throw new Error('Charge date is outside the declared coverage range.');
      const numeric = (key: string) => { if (!record[key] || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(record[key]) || !Number.isFinite(Number(record[key]))) throw new Error(`${key} must contain a finite number.`); return Number(record[key]); };
      let tags: Record<string, unknown> = {};
      if (record.Tags) { const parsed: unknown = JSON.parse(record.Tags); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Tags must be a JSON object.'); tags = parsed as Record<string, unknown>; }
      const allocations = Object.fromEntries(dimensions.map(d => [d, record[`x_${d}`] || (typeof tags[d] === 'string' ? tags[d] : typeof tags[d.toLowerCase()] === 'string' ? tags[d.toLowerCase()] : '')])) as Record<typeof dimensions[number], string>;
      const category = record.ServiceCategory === 'Network' ? 'Networking' : record.ServiceCategory === 'Database' ? 'Databases' : record.ServiceCategory || 'Other';
      return { ...allocations, Date: date, ProviderName: provider, ServiceCategory: category, ServiceName: record.ServiceName || 'Unspecified service', ResourceId: record.ResourceId || 'Unassigned resource',
        BilledCost: numeric('BilledCost'), EffectiveCost: numeric('EffectiveCost'), BillingCurrency: 'USD', ConsumedQuantity: record.ConsumedQuantity ? numeric('ConsumedQuantity') : null, ConsumedUnit: record.ConsumedUnit || '' };
    } catch (error) { throw new Error(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Invalid data'}`); }
  });
  return { rows, start, through, source: 'import', label: 'Imported FOCUS dataset' };
}
export function focusCSV(rows: CostRow[]) {
  return rowsToCSV(rows.map(row => ({ ProviderName: row.ProviderName, ServiceCategory: row.ServiceCategory, ServiceName: row.ServiceName,
    ResourceId: row.ResourceId, ChargePeriodStart: `${row.Date}T00:00:00Z`, ChargePeriodEnd: new Date(Date.parse(`${row.Date}T00:00:00Z`) + 86400000).toISOString(),
    BilledCost: row.BilledCost, EffectiveCost: row.EffectiveCost, BillingCurrency: row.BillingCurrency, ConsumedQuantity: row.ConsumedQuantity, ConsumedUnit: row.ConsumedUnit,
    ...Object.fromEntries(dimensions.map(d => [`x_${d}`, row[d]])) })));
}
