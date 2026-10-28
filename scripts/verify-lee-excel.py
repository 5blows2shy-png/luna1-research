"""Read-only validation of the delivered formula workbook against the web model."""
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / 'public/downloads/lee-data-center-10mw-expansion.xlsx'
DATA = json.loads((ROOT / 'reports/lee-data-center/expansion-model.json').read_text())
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def near(actual, expected, label):
    assert actual is not None, f'{label}: missing cached value'
    assert math.isclose(float(actual), expected, rel_tol=1e-7, abs_tol=.05), f'{label}: {actual} != {expected}'

with ZipFile(FILE) as z:
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    names = [s.attrib['name'] for s in wb.find('s:sheets', NS)]
    sheets = {name: ET.fromstring(z.read(f'xl/worksheets/sheet{i+1}.xml')) for i, name in enumerate(names)}
    def cell(sheet, address):
        return sheets[sheet].find(f'.//s:c[@r="{address}"]', NS)
    def val(sheet, address):
        c = cell(sheet, address)
        v = c.find('s:v', NS) if c is not None else None
        return v.text if v is not None else None
    errors = [(name, c.attrib['r']) for name, s in sheets.items() for c in s.findall('.//s:c', NS) if c.attrib.get('t') == 'e']
    assert not errors, f'Unexpected cached formula errors: {errors}'
    for sheet, rows in {'Construction': {10: 'Development_CapEx'}, 'Operations': {46: 'MW_Available', 47: 'MW_Leased', 48: 'MW_Utilized', 49: 'Revenue', 50: 'Power_Cost', 51: 'Other_Opex', 52: 'EBITDA', 53: 'Cash_Taxes', 54: 'Maintenance_CapEx', 56: 'Change_In_Working_Capital', 57: 'CFADS', 58: 'Unlevered_FCF'}, 'Debt': {12: 'Opening_Debt', 13: 'Debt_Draw', 14: 'Interest', 15: 'Principal', 17: 'Exit_Debt_Repayment', 18: 'Ending_Debt', 19: 'Debt_Service', 24: 'Financing_Fee'}, 'Returns': {13: 'Total_Cash_Flow', 20: 'Equity_Cash_Flow', 21: 'Equity_Contribution', 22: 'Equity_Distribution'}}.items():
        for year, source in enumerate(DATA['annual'][:11]):
            for row, field in rows.items():
                address = f'{chr(68+year)}{row}'
                assert cell(sheet, address).find('s:f', NS) is not None, f'{sheet}!{address} must remain a formula'
                near(val(sheet, address), source[field], f'{sheet}!{address}')
    for row, field in {34: 'Equity_IRR', 35: 'Equity_MOIC', 36: 'Equity_NPV', 37: 'Project_IRR', 38: 'Project_MOIC', 39: 'Minimum_DSCR'}.items():
        near(val('Returns', f'D{row}'), DATA['returns'][0][field], field)
    for index, source in enumerate(DATA['sensitivities']):
        start = [114, 122, 130][index // 9]
        r, c = divmod(index % 9, 3)
        near(val('Assumptions', f'{chr(69+c)}{start+r}'), source['Value'], f'Sensitivity {index}')
    for address, expected in {'D8':28.693, 'D9':9800000, 'D20':9800000/28.693, 'D21':28.693*.7, 'D23':11092000, 'D31':10244000, 'E31':848000}.items():
        near(val('Site',address),expected,f'Site!{address}')
    for address in ['D20','D21','D22','D23','D24','D31','E31']:
        assert cell('Site',address).find('s:f',NS) is not None
    tables = sheets['Assumptions'].findall('.//s:f[@t="dataTable"]', NS)
    assert len(tables) == 3, 'Expected three native What-If Data Tables'
    assert len([x for x in z.namelist() if x.startswith('xl/drawings/charts/chart') and x.endswith('.xml')]) == 2
    assert not any('externalLinks/' in x or 'vbaProject' in x for x in z.namelist())
    for name, sheet in sheets.items():
        if name != 'Audit':
            assert not any('Audit!' in (f.text or '') or "'Audit'!" in (f.text or '') for f in sheet.findall('.//s:f', NS)), f'{name} must not depend on terminal Audit'
    for row in range(8, 13):
        for year in range(11):
            assert abs(float(val('Audit', f'{chr(68+year)}{row}'))) < .01
    print('PASS: annual schedules, return metrics, 27 sensitivity cells, native table definitions, charts, and audit reconciliations.')
    print('Cached results reconcile to the TypeScript model. Native Excel application recalculation is a separate check.')
