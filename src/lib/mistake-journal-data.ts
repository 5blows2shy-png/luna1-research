import type { MistakeJournalEntry } from "@/lib/mistake-journal";

export const mistakeJournalEntries: MistakeJournalEntry[] = [
  {
    id: "jbl-2026-early-exit",
    ticker: "JBL",
    companyName: "Jabil Inc.",
    entryDate: "2026-03-17",
    exitDate: "2026-06-09",
    classification: "Early Exit",
    secondaryClassifications: ["Emotional Decision"],
    outcome: "Gain",
    originalThesis:
      "Jabil represented a picks-and-shovels investment in the AI and data-center infrastructure buildout. Its exposure included manufacturing and integration of server, networking, photonics, power, cooling, and other physical infrastructure required for increasing AI-compute deployment. The thesis was supported by hyperscaler capital spending, higher rack density, real hardware demand, cash generation, share repurchases, institutional accumulation, and relative strength.",
    whatHappened:
      "The position was entered on March 17 during a pullback and consolidation as an anticipation trade. On June 9, an intraday price change created emotional pressure and led to a full exit. The broader structure had not clearly broken, the company thesis had not materially changed, and the move may have represented a normal pullback forming a higher low rather than the beginning of a sustained decline.",
    mistakes: [
      "Reacted to intraday price action instead of broader market structure.",
      "Did not wait for a daily-close confirmation.",
      "Confused temporary volatility with thesis deterioration.",
      "Allowed emotional discomfort to drive a portfolio decision.",
      "Did not have sufficiently explicit written exit criteria.",
      "Entered anticipatorily before complete structural confirmation.",
      "Used an all-or-nothing exit instead of considering a partial trim.",
    ],
    lessons: [
      "A strong thesis does not eliminate volatility.",
      "Separate normal volatility, technical deterioration, and fundamental thesis failure.",
      "Ask whether the story changed or only the price changed.",
      "Major exits should follow predefined criteria.",
      "Daily-close confirmation reduces emotionally driven decisions.",
      "Partial trims can manage risk without abandoning an intact thesis.",
    ],
    missedOpportunities: [
      "Additional upside from a thesis that remained intact.",
      "Maintaining a core position.",
      "Adding at confirmed support.",
      "Allowing the stock to form a higher low.",
      "Scaling out rather than exiting completely.",
      "Using the pullback as a structured review point.",
    ],
    processChanges: [
      "Never make a full exit solely because of intraday movement.",
      "Require a daily close below the predefined invalidation level unless emergency risk requires otherwise.",
      "Review fundamentals before exiting.",
      "Require confirmed structural deterioration, material fundamental change, or portfolio-risk violation.",
      "Use partial trims when conviction weakens but the thesis remains intact.",
      "Document entry, stop, thesis-breaker, and exit conditions before opening a position.",
    ],
    thesisStatus: "Intact at Exit",
    entryQuality: "Moderate",
    exitQuality: "Poor",
    emotionalDiscipline: "Needs Improvement",
    finalAssessment:
      "The JBL thesis was strong and the trade was profitable, but the exit process was weak. The primary lesson was not to confuse temporary discomfort with permanent thesis deterioration.",
    lastUpdated: "2026-07-14",
  },
];
