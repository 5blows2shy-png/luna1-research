import type { Metadata } from "next";
import { PositionResearchPage } from "@/components/position-research-page";
import { activePositions } from "@/data/portfolio/active-positions";
import { positionResearch } from "@/data/portfolio/position-research";

export const metadata: Metadata = { title: "CASY Position Research", description: "Educational position research on Casey's store economics, prepared-food margins, network density, and thesis-monitoring risks." };
export default function Page() { const position = activePositions.find((item) => item.ticker === "CASY"); return position ? <PositionResearchPage position={position} research={positionResearch.CASY} /> : null; }
