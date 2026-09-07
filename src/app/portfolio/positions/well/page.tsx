import type { Metadata } from "next";
import { PositionResearchPage } from "@/components/position-research-page";
import { activePositions } from "@/data/portfolio/active-positions";
import { positionResearch } from "@/data/portfolio/position-research";

export const metadata: Metadata = { title: "WELL Position Research", description: "Educational position research on Welltower occupancy, same-store NOI, normalized FFO, capital allocation, and thesis-monitoring risks." };
export default function Page() { const position = activePositions.find((item) => item.ticker === "WELL"); return position ? <PositionResearchPage position={position} research={positionResearch.WELL} /> : null; }
