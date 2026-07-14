export type NavigationItem = { label: string; href: string };
export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" }, { label: "About", href: "/about" },
  { label: "Investment Philosophy", href: "/investment-philosophy" },
  { label: "Luna1 Framework", href: "/luna1-framework" }, { label: "Equity Research", href: "/equity-research" },
  { label: "Portfolio Dashboard", href: "/portfolio-dashboard" }, { label: "Financial Models", href: "/financial-models" },
  { label: "Market Commentary", href: "/market-commentary" }, { label: "Resume", href: "/resume" }, { label: "Contact", href: "/contact" },
];

export type ResearchReport = { ticker: string; company: string; industry: string; theme: string; summary: string; score: number; classification: string; catalyst: string; risk: string; date: string; status: string };
export const research: ResearchReport[] = [
  ["ANET","Arista Networks","Network Infrastructure","AI infrastructure",92,"LUNA Superleader","AI cluster networking demand","Customer concentration","2026-06-28","Monitoring"],
  ["STRL","Sterling Infrastructure","Engineering & Construction","Data centers",87,"LUNA-A","Mission-critical project backlog","Project execution","2026-06-19","Active"],
  ["PDFS","PDF Solutions","Semiconductor Software","Yield analytics",81,"LUNA-A","Analytics adoption","Revenue variability","2026-06-08","Watchlist"],
  ["CASY","Casey’s General Stores","Consumer Staples","Store density",84,"LUNA-A","Private-label expansion","Food inflation","2026-05-30","Active"],
  ["TD","Toronto-Dominion Bank","Banks","Recovery",73,"LUNA-B","Expense normalization","Regulatory limits","2026-05-18","Monitoring"],
  ["PANW","Palo Alto Networks","Cybersecurity","Platformization",89,"LUNA-A","Next-gen security ARR","Billings transition","2026-05-04","Active"],
  ["ADPT","Adaptive Biotechnologies","Biotechnology","Immune medicine",67,"Watchlist","MRD adoption","Cash burn","2026-04-23","Watchlist"],
  ["MRCY","Mercury Systems","Aerospace & Defense","Defense electronics",76,"LUNA-B","Program recovery","Execution history","2026-04-10","Monitoring"],
  ["JBL","Jabil","Electronic Manufacturing","AI hardware",82,"LUNA-A","Cloud hardware mix","Cyclical end markets","2026-03-27","Active"],
  ["AVGO","Broadcom","Semiconductors","AI infrastructure",94,"LUNA Superleader","Custom silicon demand","Valuation compression","2026-03-12","Active"],
].map(([ticker,company,industry,theme,score,classification,catalyst,risk,date,status]) => ({ticker,company,industry,theme,score,classification,catalyst,risk,date,status} as ResearchReport));

export const analysisCategories = ["Earnings and Revenue","Margin and Cash Flow","Moat and Switching Costs","Management and Capital Allocation","Industry and Supply Chain","Institutional Sponsorship","Technical Structure","Valuation and Risk"];
export const commentary = [
  { slug:"breadth-beneath-index", category:"Market Breadth", date:"July 8, 2026", title:"Reading the breadth beneath the index", summary:"Leadership is broadening selectively, but participation remains concentrated in companies with visible estimate revisions." },
  { slug:"rotation-quality-cyclicals", category:"Sector Rotation", date:"June 26, 2026", title:"Rotation toward quality cyclicals", summary:"Capital is moving toward operators with backlog visibility, pricing power, and improving free-cash-flow conversion." },
  { slug:"rates-duration", category:"Interest Rates", date:"June 13, 2026", title:"Rates, duration, and the burden of proof", summary:"Higher discount rates raise the evidence threshold for long-duration growth, making operating leverage more consequential." },
];

export function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
