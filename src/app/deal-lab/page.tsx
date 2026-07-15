import type {Metadata} from "next";
import {DealLab} from "@/components/deal-lab";
import {PageHeader} from "@/components/site";
export const metadata:Metadata={title:"Deal Lab",description:"Educational valuation, transaction analysis, capital structure, and strategic finance case studies."};
export default function DealLabPage(){return <><PageHeader kicker="Transaction analysis · Educational case studies" title="Deal Lab" description="An institutional workspace for valuation, transaction structuring, capital analysis, and strategic-finance casework. Every displayed company and transaction is illustrative sample data unless explicitly identified otherwise."/><section className="deal-lab-section"><DealLab/></section></>}
