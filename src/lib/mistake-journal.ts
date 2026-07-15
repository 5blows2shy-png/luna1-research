export type MistakeClassification =
  | "Failed Thesis"
  | "Early Exit"
  | "Poor Entry"
  | "Position Sizing"
  | "Risk Management"
  | "Emotional Decision"
  | "Process Violation";

export type MistakeJournalEntry = {
  id: string;
  ticker: string;
  companyName: string;
  entryDate: string;
  exitDate?: string;
  classification: MistakeClassification;
  secondaryClassifications?: MistakeClassification[];
  outcome?: "Gain" | "Loss" | "Breakeven" | "Open";
  returnPercentage?: number;
  originalThesis: string;
  whatHappened: string;
  mistakes: string[];
  lessons: string[];
  missedOpportunities: string[];
  processChanges: string[];
  thesisStatus: "Intact at Exit" | "Weakened" | "Invalidated" | "Uncertain";
  entryQuality: "Poor" | "Moderate" | "Strong";
  exitQuality: "Poor" | "Moderate" | "Strong";
  emotionalDiscipline: "Poor" | "Needs Improvement" | "Strong";
  finalAssessment: string;
  relatedResearchUrl?: string;
  chartImageUrl?: string;
  lastUpdated: string;
};

export type MistakeJournalFilters = {
  classification: string;
  outcome: string;
  thesisStatus: string;
  entryQuality: string;
  exitQuality: string;
  year: string;
};

export type MistakeJournalSummary = {
  totalReviewedDecisions: number;
  failedTheses: number;
  earlyExits: number;
  processViolations: number;
  mostCommonMistake: string;
  processChangesAdopted: number;
};

export const initialMistakeJournalFilters: MistakeJournalFilters = {
  classification: "All",
  outcome: "All",
  thesisStatus: "All",
  entryQuality: "All",
  exitQuality: "All",
  year: "All",
};

export function filterMistakeJournalEntries(
  entries: MistakeJournalEntry[],
  filters: MistakeJournalFilters,
) {
  return entries.filter((entry) => {
    const year = entry.exitDate?.slice(0, 4) ?? entry.entryDate.slice(0, 4);
    return (
      (filters.classification === "All" ||
        entry.classification === filters.classification ||
        entry.secondaryClassifications?.includes(filters.classification as MistakeClassification)) &&
      (filters.outcome === "All" || entry.outcome === filters.outcome) &&
      (filters.thesisStatus === "All" || entry.thesisStatus === filters.thesisStatus) &&
      (filters.entryQuality === "All" || entry.entryQuality === filters.entryQuality) &&
      (filters.exitQuality === "All" || entry.exitQuality === filters.exitQuality) &&
      (filters.year === "All" || year === filters.year)
    );
  });
}

export function calculateMistakeJournalSummary(
  entries: MistakeJournalEntry[],
): MistakeJournalSummary {
  const classifications = new Map<string, number>();
  const processChanges = new Set<string>();

  for (const entry of entries) {
    for (const classification of [entry.classification, ...(entry.secondaryClassifications ?? [])]) {
      classifications.set(classification, (classifications.get(classification) ?? 0) + 1);
    }
    entry.processChanges.forEach((change) => processChanges.add(change));
  }

  const mostCommonMistake = [...classifications.entries()].sort(
    (left, right) => right[1] - left[1],
  )[0]?.[0] ?? "No reviews yet";

  return {
    totalReviewedDecisions: entries.length,
    failedTheses: entries.filter((entry) =>
      [entry.classification, ...(entry.secondaryClassifications ?? [])].includes("Failed Thesis"),
    ).length,
    earlyExits: entries.filter((entry) =>
      [entry.classification, ...(entry.secondaryClassifications ?? [])].includes("Early Exit"),
    ).length,
    processViolations: entries.filter((entry) =>
      [entry.classification, ...(entry.secondaryClassifications ?? [])].includes("Process Violation"),
    ).length,
    mostCommonMistake,
    processChangesAdopted: processChanges.size,
  };
}
