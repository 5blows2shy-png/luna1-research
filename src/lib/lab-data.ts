export type RealEstateDeal = {
  id: string;
  name: string;
  market: string;
  strategy: string;
  status: "Under Review" | "Passed" | "Monitoring";
  purchasePrice: number;
  equityRequired: number;
  goingInCapRate: number;
  dscr: number;
  refinanceLtv: number;
  decision: string;
  lesson: string;
};

export const realEstateDeals: RealEstateDeal[] = [
  {id:"harbor-court",name:"Harbor Court Apartments",market:"San Diego County",strategy:"Value-add multifamily",status:"Under Review",purchasePrice:12800000,equityRequired:4650000,goingInCapRate:.047,dscr:1.31,refinanceLtv:.62,decision:"Advance to diligence",lesson:"Validate renovation cadence and insurance assumptions before final sizing."},
  {id:"mission-industrial",name:"Mission Industrial Flex",market:"Southern California",strategy:"Light-industrial repositioning",status:"Monitoring",purchasePrice:8400000,equityRequired:3100000,goingInCapRate:.056,dscr:1.46,refinanceLtv:.58,decision:"Monitor basis",lesson:"Tenant rollover concentration remains the binding underwriting constraint."},
  {id:"cedar-house",name:"Cedar House",market:"Western United States",strategy:"BRRR single-family case",status:"Passed",purchasePrice:640000,equityRequired:214000,goingInCapRate:.041,dscr:1.08,refinanceLtv:.74,decision:"Rejected",lesson:"The refinance case relied on appreciation rather than controllable operating improvements."},
];

export type PythonProject = {slug:string;name:string;description:string;status:"Completed"|"In Development";stack:string[];output:string;control:string};
export const pythonProjects: PythonProject[] = [
  {slug:"luna-screen",name:"LUNA Research Screen",description:"A rules-based company-ranking prototype that organizes fundamental, sponsorship, structure, valuation, and risk inputs without issuing recommendations.",status:"In Development",stack:["Python","pandas","typed inputs"],output:"Ranked research-priority file",control:"Scores require dated sources and analyst review."},
  {slug:"model-audit",name:"Financial Model Audit",description:"A calculation-control workflow for sources and uses, enterprise-value bridges, DCF reconciliation, and scenario checks.",status:"Completed",stack:["Python","unit tests","CSV"],output:"Exception and balance report",control:"No output is accepted when control totals fail."},
  {slug:"document-pipeline",name:"Professional Document Pipeline",description:"A structured workflow for producing consistent, privacy-safe resume and one-page profile documents.",status:"Completed",stack:["Python","ReportLab","PDF validation"],output:"Recruiter-ready PDF files",control:"Rendered pages and private fields are checked before release."},
];
