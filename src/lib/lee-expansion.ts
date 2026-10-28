import { initialLeeProject, initialLeeDebt, leeExport } from './lee-data-center.ts';

export const expansionTitle = 'Lee Data Center — 10 MW Site Investment Case';
export function initialExpansionProject() {
  const project = initialLeeProject();
  project.phases = project.phases.map(phase => ({ ...phase, mw: 5 }));
  project.costs = project.costs.map(cost => ({ ...cost, amount: cost.amount! / 2 }));
  project.capexPerMW = 13_440_000; // Remove old 4% land allowance; acquire the parcel separately.
  project.categories = project.categories.map((c,i)=>({...c,share:i===0?0:c.share!/.96}));
  project.siteCosts = [10_244_000,848_000,0,0,0,0,0,0,0,0,0]; // Asking price + 2% closing + $150k diligence + carrying/site works.
  project.revenueRate = 225;
  return project;
}

export const expansionSources = [
  { id: 'S1', title: 'Turner & Townsend Data Centre Construction Cost Index 2026', url: 'https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2026/ai-data-centres', benchmark: 'US average construction cost: $12.08/W.', application: '$13.44 million/MW is the assumed non-land development budget. Site acquisition and enabling costs are added separately. It is not a Midlothian bid or an AI-specific facility quote.' },
  { id: 'S2', title: 'Turner & Townsend 2026 methodology', url: 'https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2026-us/methodology', benchmark: 'Typical benchmark facility is about 60 MW IT load. Land, utility works, site works, active IT equipment and professional fees are excluded.', application: 'The 10 MW case is smaller and includes land, utility interconnection, engineering and contingency. Customer servers and GPUs are excluded. Benchmark and project scope are not equivalent.' },
  { id: 'S3', title: 'CBRE North American Data Center Trends 2025 release, February 26, 2026', url: 'https://www.cbre.com/press-releases/fast-growing-north-american-data-center-market-set-records-in-2025', benchmark: 'National average lease rate: $194.95/kW/month. Primary-market vacancy: 1.4%.', application: '$225/kW/month is an uncontracted analyst assumption, not a Midlothian comparable. Tenant size, power charges, service level and lease terms differ. No separate power reimbursement is credited.' },
  { id: 'S4', title: 'Site utility diligence — analyst assumption', url: 'https://commonwealthcommercial.com/property/16000-midlothian-turnpike/', benchmark: 'Broker listing states water available; it provides no binding electric capacity, tariff, fiber or energization commitment.', application: '$0.075/kWh is an unverified allowance, not a Virginia tariff. No Texas electricity benchmark is used for this parcel.' },
  { id: 'S5', title: 'Uptime Institute Global Data Center Survey 2025, page 7', url: 'https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf?version=0', benchmark: 'Survey weighted-average annual PUE: 1.54.', application: 'PUE 1.35 is an unverified design target, better than the survey average. It requires engineering support and should be stressed before investment.' },
  { id: 'S6', title: 'PowerStack The Data Center Power Reckoning Has Begun', url: 'https://www.powerstackgrids.com/post/the-data-center-power-reckoning-has-begun-powerstack', benchmark: 'User-supplied industry commentary on power access and delivery risk.', application: 'Used to frame diligence questions only. No queue duration, microgrid saving or vendor performance claim is embedded in the model.' },
  { id: 'S7', title: 'Commonwealth Commercial active parcel listing', url: 'https://commonwealthcommercial.com/property/16000-midlothian-turnpike/', benchmark: '16000 Midlothian Turnpike, Midlothian, VA 23113. 28.693 acres; advertised I-2 industrial zoning and water available. Page displays For Sale.', application: 'Listing checked October 28, 2026. Marketing statements are not independent zoning or utility verification. No broker contact or site control is represented.' },
  { id: 'S8', title: 'Broker offering flyer — published asking price', url: 'https://resources.thalhimer.com/marketing/Richmond/flyer3Chesterfield16000Midlothianflyernew16000MidlothianTpke.pdf', benchmark: '$9,800,000 asking price for 28.693 acres.', application: 'Asking price is the acquisition input, not an appraisal or agreed purchase price. Reconfirm availability and price before relying on the case.' },
] as const;

export function expansionExport() {
  return { ...leeExport(initialExpansionProject(), initialLeeDebt()), title: expansionTitle, modelVersion: 'Site Case 2.0', asOfDate: '2026-10-28', sources: expansionSources };
}
