export type JournalQuestionStatus =
  | "Answered"
  | "Partially Answered"
  | "Unanswered"
  | "Requires Calculation"
  | "Requires Management Disclosure";

export type JournalQuestion = {
  question: string;
  status: JournalQuestionStatus;
};

type EvidenceRecord = {
  metric: string;
  reportedValue: string;
  period: string;
  priorYearValue: string;
  change: string;
  sourceUrl: string;
  interpretation: string;
  openQuestion: string;
};

const q1Release =
  "https://investor.bloomenergy.com/press-releases/press-release-details/2026/Bloom-Energy-Reports-Record-First-Quarter-2026-Results-and-Raises-Full-Year-2026-Guidance/default.aspx";
const fy2025Release =
  "https://investor.bloomenergy.com/press-releases/press-release-details/2026/Bloom-Energy-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results-with-Record-Full-Year-Revenues/";
const q2Schedule =
  "https://investor.bloomenergy.com/press-releases/press-release-details/2026/Bloom-Energy-to-Announce-Second-Quarter-2026-Financial-Results-on-July-28-2026/default.aspx";

function questions(
  items: Array<string | [string, JournalQuestionStatus]>,
): JournalQuestion[] {
  return items.map((item) =>
    typeof item === "string"
      ? { question: item, status: "Requires Management Disclosure" }
      : { question: item[0], status: item[1] },
  );
}

export const bloomAnalystJournal = {
  ticker: "BE",
  company: "Bloom Energy",
  title: "Questions for Project Economics",
  researchDate: "July 28, 2026",
  category: "Earnings Review",
  status: "Active Research",
  latestVerifiedPeriod: "Q1 2026",
  q2Status: "Q2 2026 results pending official verification.",
  managementReported:
    "Bloom Energy reported Q1 2026 revenue of $751.1 million, product revenue of $653.3 million, GAAP gross margin of 30.0%, service gross margin of 13.3%, GAAP operating income of $72.2 million, and operating cash flow of $73.6 million. Management raised full-year 2026 guidance to revenue of $3.4–$3.8 billion, approximately 34% non-GAAP gross margin, $600–$750 million of non-GAAP operating income, and $1.85–$2.25 of non-GAAP EPS.",
  whatImproved:
    "Revenue, product revenue, GAAP gross margin, service gross margin, operating income, and operating cash flow improved from the prior-year quarter. The release also showed higher inventory, contract assets, and deferred revenue or customer deposits, making cash-conversion analysis important.",
  whatRemainsUnclear:
    "The release does not answer the complete installed cost per megawatt, customer payback, contract-level returns, project working capital, backlog conversion schedule, or sustainable margin contribution by hardware, installation, and service.",
  forecastImplications:
    "The raised guidance is management evidence, not a Luna1 forecast. A forecast should be withheld until capacity, project timing, customer concentration, backlog conversion, service economics, and working-capital requirements can be built from disclosed operating components.",
  valuationImplications:
    "A defensible valuation requires separating product, installation, service, and financing economics; measuring cash conversion; and testing how much growth and margin durability current expectations require. No price target is published because a verified market-data and operating forecast are not yet connected.",
  thesisImpact:
    "Under Review. Q1 growth and margin improvement support the demand thesis, while unanswered project-economics, contract-quality, concentration, capacity, and cash-conversion questions limit conviction.",
  nextEvidenceRequired:
    "Official Q2 2026 results and filing; product and service margin detail; backlog quality and conversion timing; capacity and capital-spending disclosures; customer concentration; contract terms; receivables, inventory, deposits, and warranty movement.",
  evidence: [
    {
      metric: "Revenue",
      reportedValue: "$751.1 million",
      period: "Q1 2026",
      priorYearValue: "$326.0 million",
      change: "+130.4%",
      sourceUrl: q1Release,
      interpretation:
        "Growth is substantial, but project mix and concentration determine quality.",
      openQuestion: "How much came from repeatable project economics?",
    },
    {
      metric: "Product revenue",
      reportedValue: "$653.3 million",
      period: "Q1 2026",
      priorYearValue: "$211.9 million",
      change: "+208.4%",
      sourceUrl: q1Release,
      interpretation:
        "Product revenue drove most of the increase.",
      openQuestion:
        "What were megawatts shipped, revenue per megawatt, and customer concentration?",
    },
    {
      metric: "GAAP gross margin",
      reportedValue: "30.0%",
      period: "Q1 2026",
      priorYearValue: "27.2%",
      change: "+2.8 percentage points",
      sourceUrl: q1Release,
      interpretation:
        "Reported margin improved, but product, installation, and mix drivers remain incomplete.",
      openQuestion: "How much improvement came from volume, pricing, or mix?",
    },
    {
      metric: "Service gross margin",
      reportedValue: "13.3%",
      period: "Q1 2026",
      priorYearValue: "1.3%",
      change: "+12.0 percentage points",
      sourceUrl: q1Release,
      interpretation:
        "Service economics improved materially from a weak comparison.",
      openQuestion:
        "What replacement-stack, warranty, and fleet-age assumptions support durability?",
    },
    {
      metric: "GAAP operating income",
      reportedValue: "$72.2 million",
      period: "Q1 2026",
      priorYearValue: "($19.1 million)",
      change: "$91.3 million improvement",
      sourceUrl: q1Release,
      interpretation:
        "The quarter reached positive GAAP operating income.",
      openQuestion: "How much is repeatable at a normalized project mix?",
    },
    {
      metric: "Operating cash flow",
      reportedValue: "$73.6 million",
      period: "Q1 2026",
      priorYearValue: "($110.7 million)",
      change: "$184.3 million improvement",
      sourceUrl: q1Release,
      interpretation:
        "Positive cash flow is encouraging but one quarter does not establish durability.",
      openQuestion:
        "How do receivables, inventory, contract assets, and deposits move by project?",
    },
    {
      metric: "Total backlog",
      reportedValue: "Approximately $20 billion",
      period: "FY2025 year-end disclosure",
      priorYearValue: "Not provided in the cited release",
      change: "Not calculated",
      sourceUrl: fy2025Release,
      interpretation:
        "Large backlog may provide visibility, but composition and cancellation terms matter.",
      openQuestion:
        "What is non-cancellable and expected to convert within 12, 24, and 36 months?",
    },
    {
      metric: "Product backlog",
      reportedValue: "Approximately $6 billion",
      period: "FY2025 year-end disclosure",
      priorYearValue: "Approximately 2.5x lower, based on company comparison",
      change: "Approximately 2.5x year over year",
      sourceUrl: fy2025Release,
      interpretation:
        "Product commitments expanded, but deposits and conversion timing are not fully disclosed.",
      openQuestion: "How much backlog has deposits and firm delivery schedules?",
    },
  ] satisfies EvidenceRecord[],
  sections: [
    {
      title: "Customer Economics",
      questions: questions([
        "What is the customer’s total installed cost per megawatt?",
        "How does the cost compare with grid interconnection and alternative onsite-generation options?",
        "What portion is paid upfront versus financed?",
        "What is the customer’s expected payback period?",
        "What are the implied electricity costs over the contract life?",
        "How sensitive are project economics to natural-gas prices?",
        "How sensitive are economics to utility rates?",
        "What tax incentives or credits are required?",
        "Does the customer retain or transfer tax benefits?",
        "What costs are excluded from management’s comparison?",
      ]),
    },
    {
      title: "Bloom Unit Economics",
      questions: questions([
        "What is the revenue per system or megawatt?",
        ["What is the hardware gross margin?", "Partially Answered"],
        ["What is the installation gross margin?", "Requires Calculation"],
        ["What is the service gross margin?", "Answered"],
        "What working capital is required per project?",
        "How much cash is collected before installation?",
        "How much cash is collected after acceptance?",
        "What warranty reserves are required?",
        "What is the replacement-stack cost?",
        "How long until service contracts become economically attractive?",
        "How does project size affect gross margin?",
        "How much margin depends on product mix?",
      ]),
    },
    {
      title: "Contract Structure",
      questions: questions([
        "Is the transaction a direct sale, lease, PPA, financing arrangement, or service contract?",
        ["When is revenue recognized?", "Partially Answered"],
        ["What performance obligations remain after installation?", "Partially Answered"],
        "What guarantees are provided?",
        "What penalties exist for delayed delivery?",
        "Can customers cancel or resize projects?",
        "How much of backlog is non-cancellable?",
        "What deposits support backlog?",
        "How much backlog is expected to convert within 12, 24, and 36 months?",
      ]),
    },
    {
      title: "Data Center Economics",
      questions: questions([
        "What is the expected deployment time compared with waiting for grid power?",
        "What is the delivered cost per megawatt?",
        "What availability level is contractually guaranteed?",
        "What redundancy is required?",
        "How does the system integrate with UPS, batteries, and backup generators?",
        "Does Bloom replace grid capacity or bridge delayed interconnection?",
        "What is the expected utilization rate?",
        "How much onsite fuel infrastructure is required?",
        "What emissions or permitting constraints could delay projects?",
        "How much customer concentration exists among data center buyers?",
      ]),
    },
    {
      title: "Manufacturing and Capacity",
      questions: questions([
        "What annual megawatt capacity exists today?",
        "What capacity expansion is required to support guidance?",
        "What capital spending is required?",
        "What is the current factory utilization?",
        "Which components constrain output?",
        "How quickly can capacity be added?",
        "Does increased volume improve unit cost?",
        "Are suppliers able to support the forecast?",
        "What inventory must be built before shipment?",
      ]),
    },
    {
      title: "Cash Conversion",
      questions: questions([
        ["When does accounting revenue convert into operating cash?", "Requires Calculation"],
        ["What explains changes in receivables?", "Requires Calculation"],
        ["What explains changes in inventory?", "Requires Calculation"],
        ["Are customer deposits increasing?", "Partially Answered"],
        ["How much working capital is tied to growth?", "Requires Calculation"],
        ["Is positive operating cash flow sustainable?", "Unanswered"],
        "How much capital spending is required to fulfill backlog?",
        "Does growth require external financing?",
      ]),
    },
    {
      title: "Margin Durability",
      questions: questions([
        "How much recent margin improvement came from volume?",
        "How much came from pricing?",
        "How much came from product mix?",
        ["How much came from service improvement?", "Partially Answered"],
        "How much came from temporary incentives?",
        "What happens to margins if project timing shifts?",
        "What margin level is sustainable through a normal demand cycle?",
      ]),
    },
    {
      title: "Portfolio Manager Questions",
      questions: questions([
        ["What evidence would confirm the thesis?", "Partially Answered"],
        ["What evidence would weaken the thesis?", "Partially Answered"],
        "What must happen for current valuation expectations to be justified?",
        ["Which operating metric should be monitored each quarter?", "Partially Answered"],
        ["Which cash-flow metric matters most?", "Answered"],
        ["What is the largest source of forecast error?", "Partially Answered"],
        ["What is the strongest bear-case evidence?", "Partially Answered"],
        ["What would cause the position to be reduced?", "Unanswered"],
        ["What would justify increasing the position?", "Unanswered"],
        ["What evidence would invalidate the investment case?", "Partially Answered"],
      ]),
    },
  ],
  sources: [
    {
      title: "Q1 2026 financial results",
      publisher: "Bloom Energy",
      publicationDate: "April 28, 2026",
      reportingPeriod: "Quarter ended March 31, 2026",
      href: q1Release,
      accessedDate: "July 28, 2026",
      section: "Financial results, guidance, balance sheet, and cash flow",
    },
    {
      title: "FY2025 financial results",
      publisher: "Bloom Energy",
      publicationDate: "February 2026",
      reportingPeriod: "Year ended December 31, 2025",
      href: fy2025Release,
      accessedDate: "July 28, 2026",
      section: "Revenue, margins, cash flow, backlog, and product backlog",
    },
    {
      title: "Q2 2026 results schedule",
      publisher: "Bloom Energy",
      publicationDate: "July 6, 2026",
      reportingPeriod: "Quarter ended June 30, 2026",
      href: q2Schedule,
      accessedDate: "July 28, 2026",
      section: "Release timing only; not a financial-results source",
    },
  ],
} as const;
