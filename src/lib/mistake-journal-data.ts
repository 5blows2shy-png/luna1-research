import type { MistakeJournalEntry } from "@/lib/mistake-journal";

export const mistakeJournalEntries: MistakeJournalEntry[] = [
  {
    id: "casy-2026-post-earnings-exit",
    ticker: "CASY",
    companyName: "Casey's General Stores, Inc.",
    exitDate: "2026-06-09",
    classification: "Early Exit",
    secondaryClassifications: ["Emotional Decision"],
    outcome: "Not Recorded",
    originalThesis:
      "Casey's was held as a retail compounder supported by convenience-store expansion, prepared-food growth, disciplined integration of acquired stores, and improving returns on invested capital. The investment case depended on business execution over multiple quarters rather than a single earnings reaction.",
    whatHappened:
      "After Casey's reported fourth-quarter and fiscal 2026 results on June 9, 2026, the share price declined and the position was exited. This review records the decision as a process mistake: a post-earnings price reaction was treated as sufficient evidence to exit before the reported operating evidence, thesis-monitoring indicators, and predetermined invalidation criteria were reviewed together.",
    mistakes: [
      "Allowed the immediate post-earnings price reaction to outweigh the written multi-quarter thesis.",
      "Did not separate a market reaction from a confirmed deterioration in the operating case.",
      "Exited before documenting whether prepared-food economics, store growth, integration, or returns on capital had materially changed.",
      "Did not wait for a structured post-earnings review or daily-close confirmation before a full exit.",
      "Used a full exit instead of considering a smaller position while the evidence was reviewed.",
    ],
    lessons: [
      "A negative earnings-day reaction is a review signal, not automatically a thesis-breaker.",
      "Post-earnings decisions should begin with the operating evidence, guidance, and thesis-monitoring checklist.",
      "Price weakness must be distinguished from a confirmed failure in the business thesis.",
      "A partial trim can preserve risk control while allowing time for evidence-based review.",
      "Exit criteria must be written before the earnings event and applied consistently afterward.",
    ],
    missedOpportunities: [
      "Completing a documented review of the fiscal 2026 results before acting.",
      "Comparing the earnings release with the original operating assumptions.",
      "Using the price move to reassess position size rather than immediately eliminate exposure.",
      "Separating short-term market volatility from the longer-term store-economics thesis.",
    ],
    processChanges: [
      "For earnings-related decisions, complete a written operating-evidence review before a full exit whenever practical.",
      "Require a documented thesis-breaker, material fundamental change, or portfolio-risk breach before a full exit.",
      "Use the earnings release, guidance, and predefined monitoring indicators as the first decision inputs—not the opening price reaction.",
      "Consider a partial trim when uncertainty rises but the thesis has not been invalidated.",
      "Record the original entry date and planned invalidation criteria for every future position.",
    ],
    beforeRule:
      "Exit after an earnings-related decline creates concern that the position may be breaking down.",
    observedFailure:
      "A post-earnings price decline prompted a full exit before the operating evidence and original thesis conditions were reviewed together.",
    afterRule:
      "Treat the earnings-day move as a review trigger. Before a full exit, assess reported operating evidence, guidance, thesis indicators, and predefined invalidation criteria; use a partial trim when risk must be reduced before that review is complete.",
    thesisStatus: "Uncertain",
    entryQuality: "Moderate",
    exitQuality: "Poor",
    emotionalDiscipline: "Needs Improvement",
    finalAssessment:
      "The CASY exit followed a post-earnings decline, but the decision process was incomplete. The durable lesson is to treat price action as an input to a disciplined review—not as a substitute for reviewing the underlying business and the written thesis.",
    lastUpdated: "2026-06-09",
  },
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
    beforeRule: "Exit when price action creates concern about a possible structural break.",
    observedFailure: "Intraday volatility prompted a full exit while the thesis and broader structure remained intact.",
    afterRule: "Require a daily-close confirmation and a fundamental review before a full exit, absent emergency portfolio risk.",
    thesisStatus: "Intact at Exit",
    entryQuality: "Moderate",
    exitQuality: "Poor",
    emotionalDiscipline: "Needs Improvement",
    finalAssessment:
      "The JBL thesis was strong and the trade was profitable, but the exit process was weak. The primary lesson was not to confuse temporary discomfort with permanent thesis deterioration.",
    lastUpdated: "2026-07-14",
  },
];
