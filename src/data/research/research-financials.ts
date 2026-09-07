import type {
  HistoricalFinancialRecord,
  SegmentRecord,
} from "./research-types";

const NA = "Not applicable" as const;
const ND = "Not separately disclosed" as const;

const secCompanyFacts = (cik: string) =>
  `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;

const filingUrls = {
  GLW: "https://www.sec.gov/Archives/edgar/data/24741/000002474126000124/glw-20251231.htm",
  JBL: "https://www.sec.gov/Archives/edgar/data/898293/000162828025045293/jbl-20250831.htm",
  ALAB: "https://www.sec.gov/Archives/edgar/data/1736297/000173629726000010/alab-20251231.htm",
  RY: "https://www.rbc.com/investor-relations/_assets-custom/pdf/ar_2025_e.pdf",
  PANW: "https://www.sec.gov/Archives/edgar/data/1327567/000132756725000027/panw-20250731.htm",
  ANET: "https://www.sec.gov/Archives/edgar/data/1596532/000159653226000013/anet-20251231.htm",
  DLR: "https://www.sec.gov/Archives/edgar/data/1297996/000110465926015365/dlr-20251231x10k.htm",
  STRL: "https://www.sec.gov/Archives/edgar/data/874238/000087423826000024/strl-20251231.htm",
  AIPO: "https://www.defianceetfs.com/aipo-full-holdings/",
} as const;

export const segmentEvidenceByTicker: Record<string, SegmentRecord[]> = {
  GLW: [
    ["Optical Communications", 6274, 0.347, ND, ND, 0.382, "AI data-center connectivity, carrier fiber, and enterprise-network demand."],
    ["Display", 3697, -0.045, ND, ND, 0.225, "Display-glass volume, pricing, currency, and manufacturing utilization."],
    ["Specialty Materials", 2211, 0.096, ND, ND, 0.135, "Premium cover materials, advanced optics, and specialty-glass adoption."],
    ["Automotive", 1794, -0.028, ND, ND, 0.109, "Gasoline particulate filters, heavy-duty diesel, and automotive-glass demand."],
    ["Life Sciences", 972, -0.007, ND, ND, 0.059, "Laboratory demand, bioprocessing activity, and pharmaceutical packaging."],
    ["Hemlock and Emerging Growth Businesses", 1460, 0.331, ND, ND, 0.089, "Polysilicon volume, solar-module ramp, and emerging-business mix."],
  ].map(([name, revenue, revenueGrowth, operatingIncome, operatingMargin, shareOfRevenue, driver]) => ({
    name: String(name), revenue: revenue as number, revenueGrowth: revenueGrowth as number,
    operatingIncome: operatingIncome as typeof ND, operatingMargin: operatingMargin as typeof ND,
    shareOfRevenue: shareOfRevenue as number, profitMeasure: "Not applicable", driver: String(driver), sourceUrl: filingUrls.GLW,
  })),
  JBL: [
    ["Regulated Industries", 11879, -0.031, 643, 0.054, 0.399, "Automotive, healthcare, packaging, and renewable-energy infrastructure programs."],
    ["Intelligent Infrastructure", 12317, 0.339, 664, 0.054, 0.413, "Cloud and data-center infrastructure, networking, communications, and capital equipment."],
    ["Connected Living and Digital Commerce", 5606, -0.245, 313, 0.056, 0.188, "Connected devices, warehouse automation, robotics, and digital-commerce demand."],
  ].map(([name, revenue, revenueGrowth, operatingIncome, operatingMargin, shareOfRevenue, driver]) => ({
    name: String(name), revenue: revenue as number, revenueGrowth: revenueGrowth as number,
    operatingIncome: operatingIncome as number, operatingMargin: operatingMargin as number,
    shareOfRevenue: shareOfRevenue as number, profitMeasure: "Segment income", driver: String(driver), sourceUrl: filingUrls.JBL,
  })),
  ALAB: [{
    name: "Consolidated operations (single reportable segment)", revenue: 852.5, revenueGrowth: 1.151,
    operatingIncome: 173.4, operatingMargin: 0.203, shareOfRevenue: 1,
    profitMeasure: "Operating income", driver: "Hyperscaler deployments and adoption of PCIe, CXL, and Ethernet connectivity products.", sourceUrl: filingUrls.ALAB,
  }],
  RY: [
    ["Personal Banking", 19854, 0.145, 7105, 0.358, "Deposits, lending volumes, spreads, mutual-fund balances, and credit costs."],
    ["Commercial Banking", 8562, 0.16, 3020, 0.152, "Commercial loans, deposits, cash management, advisory activity, and credit costs."],
    ["Wealth Management", 22378, 0.14, 4289, 0.403, "Fee-based client assets, market levels, net flows, and transactional revenue."],
    ["Insurance", 1321, 0.079, 828, 0.024, "Insurance-service results, claims experience, actuarial assumptions, and premiums."],
    ["Capital Markets", 14426, 0.201, 5393, 0.26, "Trading activity, underwriting, advisory fees, lending, and financing demand."],
  ].map(([name, revenue, revenueGrowth, operatingIncome, shareOfRevenue, driver]) => ({
    name: String(name), revenue: revenue as number, revenueGrowth: revenueGrowth as number,
    operatingIncome: operatingIncome as number, operatingMargin: NA,
    shareOfRevenue: shareOfRevenue as number, profitMeasure: "Net income", driver: String(driver), sourceUrl: filingUrls.RY,
  })),
  PANW: [{
    name: "Cybersecurity platform (single reportable segment)", revenue: 9221.5, revenueGrowth: 0.149,
    operatingIncome: 1242.9, operatingMargin: 0.135, shareOfRevenue: 1,
    profitMeasure: "Operating income", driver: "Subscription and support growth, platform adoption, and remaining performance obligations.", sourceUrl: filingUrls.PANW,
  }],
  ANET: [{
    name: "Cloud networking (single reportable segment)", revenue: 9005.7, revenueGrowth: 0.286,
    operatingIncome: 3856.1, operatingMargin: 0.428, shareOfRevenue: 1,
    profitMeasure: "Operating income", driver: "Cloud-titan spending, AI networking, enterprise adoption, and product-service mix.", sourceUrl: filingUrls.ANET,
  }],
  DLR: [{
    name: "Data-center operations (single reportable segment)", revenue: 6112.7, revenueGrowth: 0.1,
    operatingIncome: 658.5, operatingMargin: 0.108, shareOfRevenue: 1,
    profitMeasure: "Operating income", driver: "Leasing, occupancy, interconnection, development completions, and power availability.", sourceUrl: filingUrls.DLR,
  }],
  STRL: [
    ["E-Infrastructure Solutions", 1466.8, 0.588, 346, 0.236, 0.589, "Data centers, advanced manufacturing, project mix, and acquired electrical and mechanical capabilities."],
    ["Transportation Solutions", 640.7, -0.182, 77.8, 0.121, 0.257, "Federal and state infrastructure funding, project selection, and execution."],
    ["Building Solutions", 382.6, -0.063, 39.1, 0.102, 0.154, "Residential and commercial concrete demand, geography, and project mix."],
  ].map(([name, revenue, revenueGrowth, operatingIncome, operatingMargin, shareOfRevenue, driver]) => ({
    name: String(name), revenue: revenue as number, revenueGrowth: revenueGrowth as number,
    operatingIncome: operatingIncome as number, operatingMargin: operatingMargin as number,
    shareOfRevenue: shareOfRevenue as number, profitMeasure: "Operating income", driver: String(driver), sourceUrl: filingUrls.STRL,
  })),
  AIPO: [{
    name: "Underlying holdings", revenue: NA, revenueGrowth: NA, operatingIncome: NA,
    operatingMargin: NA, shareOfRevenue: NA, profitMeasure: "Not applicable",
    driver: "Portfolio weights, index eligibility, quarterly rebalancing, fees, and underlying issuer fundamentals.", sourceUrl: filingUrls.AIPO,
  }],
};

type HistoryInput = Omit<HistoricalFinancialRecord, "period" | "sourceUrl" | "sourceLabel" | "currency">;

function records(
  ticker: keyof typeof filingUrls,
  currency: "USD" | "CAD",
  rows: Array<[number, HistoryInput]>,
): HistoricalFinancialRecord[] {
  const cikByTicker: Partial<Record<keyof typeof filingUrls, string>> = {
    GLW: "0000024741", JBL: "0000898293", ALAB: "0001736297", RY: "0001000275",
    PANW: "0001327567", ANET: "0001596532", DLR: "0001297996", STRL: "0000874238",
  };
  return rows.map(([year, row]) => ({
    period: `FY${year}`,
    ...row,
    sourceUrl: secCompanyFacts(cikByTicker[ticker]!),
    sourceLabel: "SEC filed annual reports / XBRL company facts",
    currency,
  }));
}

export const historicalEvidenceByTicker: Record<string, HistoricalFinancialRecord[]> = {
  GLW: records("GLW", "USD", [
    [2021, { revenue: 14082, revenueGrowth: NA, grossProfit: 5063, grossMargin: .36, operatingIncome: 2112, operatingMargin: .15, ebitda: 3593, ebitdaMargin: .255, netIncome: 1906, dilutedEps: 1.28, operatingCashFlow: 3412, capitalExpenditures: 1637, freeCashFlow: 1775, cash: 2148, debt: 7044, dilutedShares: 844 }],
    [2022, { revenue: 14189, revenueGrowth: .008, grossProfit: 4506, grossMargin: .318, operatingIncome: 1438, operatingMargin: .101, ebitda: 2890, ebitdaMargin: .204, netIncome: 1316, dilutedEps: 1.54, operatingCashFlow: 2615, capitalExpenditures: 1604, freeCashFlow: 1011, cash: 1671, debt: 6911, dilutedShares: 857 }],
    [2023, { revenue: 12588, revenueGrowth: -.113, grossProfit: 3931, grossMargin: .312, operatingIncome: 890, operatingMargin: .071, ebitda: 2259, ebitdaMargin: .179, netIncome: 581, dilutedEps: .68, operatingCashFlow: 2005, capitalExpenditures: 1089, freeCashFlow: 916, cash: 1779, debt: 7526, dilutedShares: 859 }],
    [2024, { revenue: 13118, revenueGrowth: .042, grossProfit: 4276, grossMargin: .326, operatingIncome: 1135, operatingMargin: .087, ebitda: 2485, ebitdaMargin: .189, netIncome: 506, dilutedEps: .58, operatingCashFlow: 1939, capitalExpenditures: 797, freeCashFlow: 1142, cash: 1768, debt: 7211, dilutedShares: 869 }],
    [2025, { revenue: 15629, revenueGrowth: .191, grossProfit: 5621, grossMargin: .36, operatingIncome: 2279, operatingMargin: .146, ebitda: 3626, ebitdaMargin: .232, netIncome: 1596, dilutedEps: 1.83, operatingCashFlow: 2695, capitalExpenditures: 1287, freeCashFlow: 1408, cash: 1526, debt: 8425, dilutedShares: 871 }],
  ]),
  JBL: records("JBL", "USD", [
    [2021, { revenue: 29285, revenueGrowth: NA, grossProfit: 2359, grossMargin: .081, operatingIncome: 1055, operatingMargin: .036, ebitda: 1931, ebitdaMargin: .066, netIncome: 696, dilutedEps: 4.58, operatingCashFlow: 1433, capitalExpenditures: 1159, freeCashFlow: 274, cash: 1567, debt: 2878, dilutedShares: 152.1 }],
    [2022, { revenue: 33478, revenueGrowth: .143, grossProfit: 2632, grossMargin: .079, operatingIncome: 1393, operatingMargin: .042, ebitda: 2318, ebitdaMargin: .069, netIncome: 996, dilutedEps: 6.9, operatingCashFlow: 1651, capitalExpenditures: 1385, freeCashFlow: 266, cash: 1478, debt: 2875, dilutedShares: 144.4 }],
    [2023, { revenue: 34702, revenueGrowth: .037, grossProfit: 2867, grossMargin: .083, operatingIncome: 1537, operatingMargin: .044, ebitda: 2461, ebitdaMargin: .071, netIncome: 818, dilutedEps: 6.02, operatingCashFlow: 1734, capitalExpenditures: 1030, freeCashFlow: 704, cash: 1804, debt: 2875, dilutedShares: 135.9 }],
    [2024, { revenue: 28883, revenueGrowth: -.168, grossProfit: 2676, grossMargin: .093, operatingIncome: 2013, operatingMargin: .07, ebitda: 2709, ebitdaMargin: .094, netIncome: 1388, dilutedEps: 11.17, operatingCashFlow: 1716, capitalExpenditures: 784, freeCashFlow: 932, cash: 2201, debt: 2880, dilutedShares: 124.3 }],
    [2025, { revenue: 29802, revenueGrowth: .032, grossProfit: 2646, grossMargin: .089, operatingIncome: 1182, operatingMargin: .04, ebitda: 1856, ebitdaMargin: .062, netIncome: 657, dilutedEps: 5.92, operatingCashFlow: 1640, capitalExpenditures: 468, freeCashFlow: 1172, cash: 1933, debt: 2885, dilutedShares: 110.9 }],
  ]),
  ALAB: records("ALAB", "USD", [
    [2021, { revenue: ND, revenueGrowth: NA, grossProfit: ND, grossMargin: ND, operatingIncome: ND, operatingMargin: ND, ebitda: ND, ebitdaMargin: ND, netIncome: ND, dilutedEps: ND, operatingCashFlow: ND, capitalExpenditures: ND, freeCashFlow: ND, cash: ND, debt: ND, dilutedShares: ND }],
    [2022, { revenue: 79.9, revenueGrowth: NA, grossProfit: 58.7, grossMargin: .735, operatingIncome: -60.2, operatingMargin: -.754, ebitda: ND, ebitdaMargin: ND, netIncome: -58.3, dilutedEps: -1.71, operatingCashFlow: -35.9, capitalExpenditures: 3.9, freeCashFlow: -39.8, cash: ND, debt: 0, dilutedShares: 34.2 }],
    [2023, { revenue: 115.8, revenueGrowth: .45, grossProfit: 79.8, grossMargin: .689, operatingIncome: -29.5, operatingMargin: -.255, ebitda: -27.7, ebitdaMargin: -.239, netIncome: -26.3, dilutedEps: -.71, operatingCashFlow: -12.7, capitalExpenditures: 2.8, freeCashFlow: -15.5, cash: 45.1, debt: 0, dilutedShares: 37.1 }],
    [2024, { revenue: 396.3, revenueGrowth: 2.422, grossProfit: 302.7, grossMargin: .764, operatingIncome: -116.1, operatingMargin: -.293, ebitda: -112.9, ebitdaMargin: -.285, netIncome: -83.4, dilutedEps: -.64, operatingCashFlow: 136.7, capitalExpenditures: 34.2, freeCashFlow: 102.4, cash: 79.6, debt: 0, dilutedShares: 131.3 }],
    [2025, { revenue: 852.5, revenueGrowth: 1.151, grossProfit: 645.3, grossMargin: .757, operatingIncome: 173.4, operatingMargin: .203, ebitda: 180.3, ebitdaMargin: .211, netIncome: 219.1, dilutedEps: 1.22, operatingCashFlow: 319.3, capitalExpenditures: 37.5, freeCashFlow: 281.8, cash: 167.6, debt: 0, dilutedShares: 179.6 }],
  ]),
  PANW: records("PANW", "USD", [
    [2021, { revenue: 4256.1, revenueGrowth: NA, grossProfit: 2981.2, grossMargin: .7, operatingIncome: -304.1, operatingMargin: -.071, ebitda: -43.7, ebitdaMargin: -.01, netIncome: -498.9, dilutedEps: -1.73, operatingCashFlow: 1503, capitalExpenditures: 116, freeCashFlow: 1387, cash: 1874.2, debt: 3226, dilutedShares: 289.1 }],
    [2022, { revenue: 5501.5, revenueGrowth: .293, grossProfit: 3782.8, grossMargin: .688, operatingIncome: -188.8, operatingMargin: -.034, ebitda: 93.8, ebitdaMargin: .017, netIncome: -267, dilutedEps: -.9, operatingCashFlow: 1984.7, capitalExpenditures: 192.8, freeCashFlow: 1791.9, cash: 2118.5, debt: 3676.8, dilutedShares: 295.6 }],
    [2023, { revenue: 6892.7, revenueGrowth: .253, grossProfit: 4983, grossMargin: .723, operatingIncome: 387.3, operatingMargin: .056, ebitda: 669.5, ebitdaMargin: .097, netIncome: 439.7, dilutedEps: .64, operatingCashFlow: 2777.5, capitalExpenditures: 146.3, freeCashFlow: 2631.2, cash: 1135.3, debt: 1991.5, dilutedShares: 684.5 }],
    [2024, { revenue: 8027.5, revenueGrowth: .165, grossProfit: 5968.3, grossMargin: .743, operatingIncome: 683.9, operatingMargin: .085, ebitda: 967.2, ebitdaMargin: .12, netIncome: 2577.6, dilutedEps: 3.64, operatingCashFlow: 3257.6, capitalExpenditures: 156.8, freeCashFlow: 3100.8, cash: 1535.2, debt: 963.9, dilutedShares: 707.9 }],
    [2025, { revenue: 9221.5, revenueGrowth: .149, grossProfit: 6769.9, grossMargin: .734, operatingIncome: 1242.9, operatingMargin: .135, ebitda: 1586.3, ebitdaMargin: .172, netIncome: 1133.9, dilutedEps: 1.6, operatingCashFlow: 3716, capitalExpenditures: 246.2, freeCashFlow: 3469.8, cash: 2268.6, debt: 0, dilutedShares: 709.3 }],
  ]),
  ANET: records("ANET", "USD", [
    [2021, { revenue: 2948, revenueGrowth: NA, grossProfit: 1880.8, grossMargin: .638, operatingIncome: 924.7, operatingMargin: .314, ebitda: 975.1, ebitdaMargin: .331, netIncome: 840.9, dilutedEps: 2.63, operatingCashFlow: 1015.9, capitalExpenditures: 64.7, freeCashFlow: 951.2, cash: 620.8, debt: 0, dilutedShares: 319.2 }],
    [2022, { revenue: 4381.3, revenueGrowth: .486, grossProfit: 2675.7, grossMargin: .611, operatingIncome: 1527.1, operatingMargin: .349, ebitda: 1589.8, ebitdaMargin: .363, netIncome: 1352.4, dilutedEps: 1.07, operatingCashFlow: 492.8, capitalExpenditures: 44.6, freeCashFlow: 448.2, cash: 671.7, debt: 0, dilutedShares: 1265.8 }],
    [2023, { revenue: 5860.2, revenueGrowth: .338, grossProfit: 3630.3, grossMargin: .619, operatingIncome: 2257.3, operatingMargin: .385, ebitda: 2327.9, ebitdaMargin: .397, netIncome: 2087.3, dilutedEps: 1.65, operatingCashFlow: 2034, capitalExpenditures: 34.4, freeCashFlow: 1999.6, cash: 1938.6, debt: 0, dilutedShares: 1268.5 }],
    [2024, { revenue: 7003.1, revenueGrowth: .195, grossProfit: 4491.3, grossMargin: .641, operatingIncome: 2944.6, operatingMargin: .42, ebitda: 3006.6, ebitdaMargin: .429, netIncome: 2852.1, dilutedEps: 2.23, operatingCashFlow: 3708.2, capitalExpenditures: 32, freeCashFlow: 3676.2, cash: 2762.4, debt: 0, dilutedShares: 1281.1 }],
    [2025, { revenue: 9005.7, revenueGrowth: .286, grossProfit: 5768.7, grossMargin: .641, operatingIncome: 3856.1, operatingMargin: .428, ebitda: 3928.7, ebitdaMargin: .436, netIncome: 3511.4, dilutedEps: 2.75, operatingCashFlow: 4371.9, capitalExpenditures: 119.5, freeCashFlow: 4252.4, cash: 1963.9, debt: 0, dilutedShares: 1275.7 }],
  ]),
  DLR: records("DLR", "USD", [
    [2021, { revenue: 4427.9, revenueGrowth: NA, grossProfit: NA, grossMargin: NA, operatingIncome: 694, operatingMargin: .157, ebitda: 2180.6, ebitdaMargin: .492, netIncome: 1709.3, dilutedEps: 5.94, operatingCashFlow: 1702.2, capitalExpenditures: NA, freeCashFlow: NA, cash: 142.7, debt: 13562.2, dilutedShares: 283.2 }],
    [2022, { revenue: 4691.8, revenueGrowth: .06, grossProfit: NA, grossMargin: NA, operatingIncome: 590, operatingMargin: .126, ebitda: 2167.9, ebitdaMargin: .462, netIncome: 377.7, dilutedEps: 1.11, operatingCashFlow: 1659.4, capitalExpenditures: NA, freeCashFlow: NA, cash: 141.8, debt: 16723.9, dilutedShares: 297.9 }],
    [2023, { revenue: 5477.1, revenueGrowth: .167, grossProfit: NA, grossMargin: NA, operatingIncome: 524.5, operatingMargin: .096, ebitda: 2219.3, ebitdaMargin: .405, netIncome: 948.8, dilutedEps: 2.88, operatingCashFlow: 1634.8, capitalExpenditures: NA, freeCashFlow: NA, cash: 1625.5, debt: 17537.6, dilutedShares: 309.1 }],
    [2024, { revenue: 5555, revenueGrowth: .014, grossProfit: NA, grossMargin: NA, operatingIncome: 471.9, operatingMargin: .085, ebitda: 2243.7, ebitdaMargin: .404, netIncome: 602.5, dilutedEps: 1.61, operatingCashFlow: 2261.5, capitalExpenditures: NA, freeCashFlow: NA, cash: 3870.9, debt: 16847, dilutedShares: 331.5 }],
    [2025, { revenue: 6112.7, revenueGrowth: .1, grossProfit: NA, grossMargin: NA, operatingIncome: 658.5, operatingMargin: .108, ebitda: 2553.1, ebitdaMargin: .418, netIncome: 1308.6, dilutedEps: 3.58, operatingCashFlow: 2412.1, capitalExpenditures: NA, freeCashFlow: NA, cash: 3451.6, debt: 18556.8, dilutedShares: 347.8 }],
  ]),
  STRL: records("STRL", "USD", [
    [2021, { revenue: 1414.4, revenueGrowth: NA, grossProfit: 203.5, grossMargin: .144, operatingIncome: 107, operatingMargin: .076, ebitda: 141.2, ebitdaMargin: .1, netIncome: 62.6, dilutedEps: 2.15, operatingCashFlow: 158.9, capitalExpenditures: 46.7, freeCashFlow: 112.3, cash: 60.9, debt: 451.9, dilutedShares: 29.1 }],
    [2022, { revenue: 1769.4, revenueGrowth: .251, grossProfit: 274.6, grossMargin: .155, operatingIncome: 159.9, operatingMargin: .09, ebitda: 211.9, ebitdaMargin: .12, netIncome: 106.5, dilutedEps: 3.48, operatingCashFlow: 219.1, capitalExpenditures: 60.9, freeCashFlow: 158.2, cash: 181.5, debt: 431.3, dilutedShares: 30.6 }],
    [2023, { revenue: 1972.2, revenueGrowth: .115, grossProfit: 337.6, grossMargin: .171, operatingIncome: 205.8, operatingMargin: .104, ebitda: 263.2, ebitdaMargin: .133, netIncome: 138.7, dilutedEps: 4.44, operatingCashFlow: 478.6, capitalExpenditures: 64.4, freeCashFlow: 414.2, cash: 471.6, debt: 341.5, dilutedShares: 31.2 }],
    [2024, { revenue: 2115.8, revenueGrowth: .073, grossProfit: 426.1, grossMargin: .201, operatingIncome: 264.6, operatingMargin: .125, ebitda: 333, ebitdaMargin: .157, netIncome: 257.5, dilutedEps: 8.27, operatingCashFlow: 497.1, capitalExpenditures: 81, freeCashFlow: 416.2, cash: 664.2, debt: 316.3, dilutedShares: 31.1 }],
    [2025, { revenue: 2490, revenueGrowth: .177, grossProfit: 572.3, grossMargin: .23, operatingIncome: 405.9, operatingMargin: .163, ebitda: 483, ebitdaMargin: .194, netIncome: 290.2, dilutedEps: 9.38, operatingCashFlow: 440, capitalExpenditures: 77.3, freeCashFlow: 362.7, cash: 390.7, debt: 291, dilutedShares: 30.9 }],
  ]),
  RY: records("RY", "CAD", [
    [2021, { revenue: 49693, revenueGrowth: NA, grossProfit: NA, grossMargin: NA, operatingIncome: NA, operatingMargin: NA, ebitda: NA, ebitdaMargin: NA, netIncome: 16050, dilutedEps: 11.06, operatingCashFlow: 61044, capitalExpenditures: NA, freeCashFlow: NA, cash: 113846, debt: NA, dilutedShares: 1426.7 }],
    [2022, { revenue: 48985, revenueGrowth: -.014, grossProfit: NA, grossMargin: NA, operatingIncome: NA, operatingMargin: NA, ebitda: NA, ebitdaMargin: NA, netIncome: 15807, dilutedEps: 11.06, operatingCashFlow: 21942, capitalExpenditures: NA, freeCashFlow: NA, cash: 72397, debt: NA, dilutedShares: 1406 }],
    [2023, { revenue: 56129, revenueGrowth: .146, grossProfit: NA, grossMargin: NA, operatingIncome: NA, operatingMargin: NA, ebitda: NA, ebitdaMargin: NA, netIncome: 14866, dilutedEps: 10.5, operatingCashFlow: 26079, capitalExpenditures: NA, freeCashFlow: NA, cash: 61989, debt: NA, dilutedShares: 1392.5 }],
    [2024, { revenue: 57344, revenueGrowth: .022, grossProfit: NA, grossMargin: NA, operatingIncome: NA, operatingMargin: NA, ebitda: NA, ebitdaMargin: NA, netIncome: 16240, dilutedEps: 11.25, operatingCashFlow: 23139, capitalExpenditures: NA, freeCashFlow: NA, cash: 56723, debt: NA, dilutedShares: 1413.8 }],
    [2025, { revenue: 66605, revenueGrowth: .161, grossProfit: NA, grossMargin: NA, operatingIncome: NA, operatingMargin: NA, ebitda: NA, ebitdaMargin: NA, netIncome: 20369, dilutedEps: 14.07, operatingCashFlow: 55220, capitalExpenditures: NA, freeCashFlow: NA, cash: 37024, debt: NA, dilutedShares: 1411.6 }],
  ]),
};

export const researchFilingUrls = filingUrls;
