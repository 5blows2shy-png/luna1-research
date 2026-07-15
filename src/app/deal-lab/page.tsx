import type { Metadata } from "next";
import { DealLab } from "@/components/deal-lab";
import { PageHeader } from "@/components/site";

export const metadata:Metadata={title:"Deal Lab",description:"Illustrative transaction analysis, valuation, capital structure, and strategic-finance casework."};
export default function DealLabPage(){return <><PageHeader kicker="Strategic Finance · Sample Data" title="A transaction room built around disciplined assumptions." description="Illustrative valuation, capital structure, M&A, IPO, and model-control work for educational and portfolio-demonstration purposes."/><section className="deal-lab-shell"><DealLab/></section></>}
