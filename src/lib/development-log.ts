export type DevelopmentStatus = "Completed" | "In Progress" | "Planned";
export type DevelopmentCategory =
  | "Strategy"
  | "Research"
  | "Portfolio"
  | "Platform"
  | "Platform Expansion"
  | "Professional Development";

export type DevelopmentFeatureStatus =
  | "Planned"
  | "Preview"
  | "In Development";

export type DevelopmentFeaturePreview = {
  label: string;
  status: DevelopmentFeatureStatus;
};

export type DevelopmentLogEntry = {
  id: string;
  date: string;
  phase: string;
  category: DevelopmentCategory;
  title: string;
  summary: string;
  reason: string;
  lessons: string[];
  skills: string[];
  impact: string;
  status: DevelopmentStatus;
  overview?: string[];
  milestones?: string[];
  nextSteps?: string[];
  projectOrigin?: string;
  featurePreview?: DevelopmentFeaturePreview[];
  evolutionStatement?: string;
  disclosure?: string;
  route?: string | null;
  visibility?: "Public" | "Internal";
};

export const developmentLogEntries: DevelopmentLogEntry[] = [
  {
    id: "strategy-formation",
    date: "Date to be confirmed",
    phase: "Strategy Formation",
    category: "Strategy",
    title: "Established the research purpose",
    summary:
      "Defined Luna1 Research as a public record of investment analysis, portfolio accountability, and professional development.",
    reason:
      "A durable process needed a clear purpose before it needed a website.",
    lessons: [
      "Clarity of purpose improves what gets measured.",
      "A research platform should document uncertainty, not hide it.",
    ],
    skills: ["Strategic planning", "Investment communication"],
    impact:
      "Created the foundation for the research framework and the platform that supports it.",
    status: "Completed",
  },
  {
    id: "framework-development",
    date: "Date to be confirmed",
    phase: "Research Framework Development",
    category: "Research",
    title: "Developed the LUNA research structure",
    summary:
      "Organized business fundamentals, institutional sponsorship, competitive position, technical structure, valuation, and risk into one repeatable process.",
    reason:
      "Company research required a consistent evidence standard across different industries and market conditions.",
    lessons: [
      "A score is useful only when the underlying evidence is visible.",
      "Thesis invalidation belongs in the initial research process.",
    ],
    skills: ["Equity research", "Framework design", "Risk analysis"],
    impact:
      "Made research more comparable and reduced reliance on unstructured conviction.",
    status: "Completed",
  },
  {
    id: "portfolio-process",
    date: "Date to be confirmed",
    phase: "Portfolio Process",
    category: "Portfolio",
    title: "Separated holdings, active positions, and watchlist work",
    summary:
      "Created distinct portfolio workflows for long-term allocation, active research positions, and securities still under review.",
    reason:
      "Different time horizons and evidence thresholds should not be evaluated as if they are the same decision.",
    lessons: [
      "Classification improves position accountability.",
      "A watchlist should record research priorities rather than imitate a trading screen.",
    ],
    skills: ["Portfolio construction", "Decision documentation"],
    impact:
      "Improved the connection between research status, conviction, and portfolio role.",
    status: "Completed",
  },
  {
    id: "website-planning",
    date: "Date to be confirmed",
    phase: "Website Planning",
    category: "Platform",
    title: "Planned an institutional research platform",
    summary:
      "Mapped the site around research, portfolio accountability, professional context, and a secure contact path.",
    reason:
      "The website needed to communicate process and evidence rather than function as a generic personal portfolio.",
    lessons: [
      "Information architecture is part of credibility.",
      "Fewer, clearer public sections can strengthen the platform.",
    ],
    skills: ["Information architecture", "Product planning"],
    impact:
      "Produced a focused structure that could expand without discarding earlier work.",
    status: "Completed",
  },
  {
    id: "initial-build",
    date: "July 2026",
    phase: "Initial Website Build",
    category: "Platform",
    title: "Built the first Luna1 Research application",
    summary:
      "Implemented the site with Next.js, React, strict TypeScript, the App Router, reusable components, responsive layouts, and Git-based version control.",
    reason:
      "A maintainable application was necessary for structured research and iterative improvement.",
    lessons: [
      "Centralized data reduces content drift.",
      "Responsive and accessible behavior must be designed into shared components.",
    ],
    skills: ["Next.js", "React", "TypeScript", "Responsive design", "Git"],
    impact:
      "Converted the research concept into a functioning, extensible web application.",
    status: "Completed",
  },
  {
    id: "website-launch",
    date: "2026-07-13",
    phase: "Website Launch",
    category: "Platform",
    title: "Established the first deployable public build",
    summary:
      "Corrected the project-root deployment configuration and produced a deployable Luna1 Research build.",
    reason:
      "The application needed a reliable production path before feature expansion could continue.",
    lessons: [
      "Deployment assumptions should be verified from the repository root.",
      "A successful production build is part of the feature definition.",
    ],
    skills: ["Vercel", "Production builds", "Repository architecture"],
    impact:
      "Created a stable public foundation for subsequent research and portfolio work.",
    status: "Completed",
  },
  {
    id: "decision-accountability",
    date: "2026-07-14",
    phase: "Research Platform Expansion",
    category: "Portfolio",
    title: "Added decision-review accountability",
    summary:
      "Introduced the Mistake Journal under Portfolio and strengthened the public portfolio process.",
    reason:
      "A research record is incomplete without documenting what changed after a decision.",
    lessons: [
      "Postmortems should change a future rule.",
      "Mistakes belong beside portfolio decisions, not as a promotional product.",
    ],
    skills: ["Postmortem analysis", "Portfolio review", "Product integration"],
    impact:
      "Made learning from decisions a visible part of the investment process.",
    status: "Completed",
  },
  {
    id: "institutional-design",
    date: "2026-07-15",
    phase: "Research Platform Expansion",
    category: "Platform",
    title: "Introduced the institutional design system",
    summary:
      "Refined typography, color, cards, tables, responsive behavior, and recruiter-facing presentation into a restrained editorial system.",
    reason:
      "The interface needed to match the seriousness of the investment process without becoming visually excessive.",
    lessons: [
      "Design quality comes from hierarchy and restraint.",
      "Mobile financial content needs intentional reformatting, not simple shrinking.",
    ],
    skills: ["Design systems", "Accessibility", "Responsive UI"],
    impact:
      "Improved readability, consistency, and professional credibility across the site.",
    status: "Completed",
  },
  {
    id: "scope-refinement",
    date: "2026-07-18",
    phase: "Recent Changes",
    category: "Strategy",
    title: "Refined the permanent public scope",
    summary:
      "Streamlined navigation and removed unsupported product areas while preserving archived work where appropriate.",
    reason:
      "The public platform should prioritize the sections with current evidence and ongoing ownership.",
    lessons: [
      "Removing a navigation item is different from deleting useful work.",
      "Scope discipline increases trust.",
    ],
    skills: ["Product strategy", "Content governance"],
    impact:
      "Created a calmer navigation system and clearer expectations for visitors.",
    status: "Completed",
  },
  {
    id: "research-hub",
    date: "July 2026",
    phase: "Current Work",
    category: "Research",
    title: "Expanding the structured research hub",
    summary:
      "Building company dossiers, investment-theme maps, macro context, research notes, a reading library, and this development record.",
    reason:
      "Research needs a visible path from early questions to sourced, reviewable conclusions.",
    lessons: [
      "Unknown financial values should remain explicit placeholders.",
      "Data models should support completeness without implying certainty.",
    ],
    skills: [
      "Research architecture",
      "TypeScript data modeling",
      "Editorial systems",
    ],
    impact:
      "Creates a scalable structure for future primary-source research without fabricating completeness.",
    status: "In Progress",
  },
  {
    id: "next-research-release",
    date: "Date to be confirmed",
    phase: "Next Steps",
    category: "Research",
    title: "Complete the first source-grounded company dossiers",
    summary:
      "Add dated financial evidence, filing links, earnings histories, valuation assumptions, and reviewed downloadable reports where available.",
    reason:
      "The new platform should progress from transparent scaffolding to documented analysis.",
    lessons: [
      "Publication follows evidence review.",
      "A report should expose its assumptions and revision date.",
    ],
    skills: ["Financial analysis", "Source verification", "Research writing"],
    impact:
      "Will convert the initial dossiers from research scaffolds into publishable educational reports.",
    status: "Planned",
  },
  {
    id: "watchlist-research-coverage",
    date: "Date to be confirmed",
    phase: "Research Platform Expansion",
    category: "Research",
    title: "Expanded Watchlist into Research Coverage Platform",
    summary:
      "Converted the existing watchlist into a structured company-research platform with dedicated pages for investment theses, business analysis, historical financial performance, revenue drivers, valuation frameworks, catalysts, risks, earnings history, and downloadable research models.",
    reason:
      "A professional watchlist should expose the questions, evidence requirements, valuation methods, and monitoring process behind each security.",
    lessons: [
      "Neutral placeholders preserve trust when source-backed figures are incomplete.",
      "One typed template can support consistent diligence without forcing every industry into the same model.",
    ],
    skills: [
      "Equity research architecture",
      "TypeScript data modeling",
      "Financial analysis",
    ],
    impact:
      "Creates a recruiter-visible research workflow while keeping incomplete reports and models unpublished.",
    status: "Completed",
  },
  {
    id: "industry-specific-valuation",
    date: "Date to be confirmed",
    phase: "Research Platform Expansion",
    category: "Research",
    title: "Introduced Industry-Specific Valuation Frameworks",
    summary:
      "Added specialized research structures for banks, investment banks, REITs, ETFs, semiconductor companies, cybersecurity companies, industrial businesses, and data-center infrastructure companies rather than applying one generic valuation method across every security.",
    reason:
      "Valuation should reflect the economics, capital structure, and reported operating drivers of the security being studied.",
    lessons: [
      "Banks and investment banks require capital and book-value frameworks.",
      "REITs and ETFs require different operating and valuation evidence than industrial companies.",
    ],
    skills: [
      "Industry analysis",
      "Valuation framework design",
      "Research governance",
    ],
    impact:
      "Improves analytical fit while clearly separating sourced inputs from illustrative scenarios.",
    status: "Completed",
  },
  {
    id: "transaction-intelligence-preview",
    date: "2026-07-24",
    phase: "Current Work",
    category: "Platform Expansion",
    title: "Integrated Transaction Intelligence Preview",
    summary:
      "Added the foundation of a transaction-analysis platform to the Luna1 development roadmap, connecting research and valuation work with accounting controls, financial operations, and transaction-level analysis.",
    reason:
      "Luna1 can demonstrate a broader finance-and-technology workflow by connecting investment analysis with transaction organization, reconciliation concepts, exception identification, and audit-ready reporting design.",
    lessons: [
      "Transaction-level analysis depends on consistent normalization and reviewable data-cleaning rules.",
      "Accounting controls require visible exceptions, reconciliation logic, and an audit trail rather than silent automation.",
      "Preview-stage work should remain clearly separated from tested production functionality.",
    ],
    skills: [
      "Accounting-control awareness",
      "Transaction-level financial analysis",
      "Data-cleaning workflows",
      "Reconciliation concepts",
      "Exception identification",
      "Operational problem solving",
      "Product development",
      "Finance and technology integration",
    ],
    impact:
      "Establishes a transparent roadmap for integrating transaction analytics into Luna1 without representing unfinished capabilities as production-ready.",
    status: "In Progress",
    overview: [
      "Expanded Luna1 beyond investment research by incorporating the foundation of a financial transaction analysis platform into the Luna1 ecosystem. This preview introduces the planned architecture for transaction import, data normalization, categorization, duplicate detection, transfer matching, reconciliation, exception review, and audit-ready reporting.",
      "The integration demonstrates how Luna1 can connect investment research and valuation work with practical accounting controls, financial operations, and transaction-level data analysis.",
    ],
    milestones: [
      "Incorporated the earlier transaction-analysis project into the Luna1 development roadmap.",
      "Introduced the Luna1 Transaction Intelligence module and dashboard preview.",
      "Established the foundation for transaction import, normalization, and categorization.",
      "Designed workflows for duplicate detection and possible mirrored-entry review.",
      "Planned transfer matching, reconciliation, and exception-review capabilities.",
      "Defined professional Excel, CSV, and PDF export workflows.",
      "Connected accounting analytics with the broader Luna1 research platform.",
      "Preserved the original transaction-analysis project as the foundation for future development.",
    ],
    nextSteps: [
      "Complete migration of reusable logic from the legacy transaction-analysis project.",
      "Finalize the Luna1 Transaction Intelligence dashboard.",
      "Build the transaction file upload and column-mapping workflow.",
      "Implement categorization and duplicate-detection engines.",
      "Add transfer matching and reconciliation tools.",
      "Create an exception-review queue and audit trail.",
      "Add downloadable Luna1-branded reports and Excel exports.",
      "Replace preview content with tested functionality as development progresses.",
    ],
    projectOrigin:
      "Luna1 Transaction Intelligence builds on an earlier transaction-analysis project developed to separate and organize financial records, identify duplicate transactions, review exceptions, and export structured results. The original project is now being evaluated and integrated into Luna1 through a more professional, scalable, and accounting-focused workflow.",
    featurePreview: [
      { label: "Transaction Import", status: "Preview" },
      { label: "Data Normalization", status: "Preview" },
      { label: "Transaction Categorization", status: "In Development" },
      { label: "Duplicate Detection", status: "Planned" },
      { label: "Transfer Matching", status: "Planned" },
      { label: "Reconciliation", status: "Planned" },
      { label: "Exception Review", status: "Planned" },
      { label: "Audit Trail", status: "Planned" },
      { label: "Export Center", status: "Planned" },
    ],
    evolutionStatement:
      "Luna1 is evolving from an independent equity-research platform into a broader financial intelligence ecosystem that connects investment analysis, valuation, accounting controls, and transaction analytics.",
    disclosure:
      "Luna1 Transaction Intelligence is a portfolio and educational project. It is not a substitute for professional accounting, audit, tax, legal, or financial advice.",
    route: "/transaction-intelligence",
    visibility: "Public",
  },
  {
    id: "recruiter-analyst-positioning",
    date: "2026-07-28",
    phase: "Recruiter Portfolio Refinement",
    category: "Strategy",
    title: "Organized Luna1 around analyst evidence",
    summary:
      "Reframed the public information architecture around Equity Research, Valuation, Transaction Intelligence, Portfolio Process, the Analyst Journal, and the Development Log.",
    reason:
      "Recruiters and finance professionals need to see how operating experience, accounting knowledge, financial reasoning, investment decisions, and continuous improvement connect—not only a collection of finished projects.",
    lessons: [
      "A recruiter portfolio is stronger when every section demonstrates a part of the analytical process.",
      "Transparent placeholders are more credible than unsupported financial precision.",
      "Career progression should explain how judgment developed without exaggerating responsibility.",
    ],
    skills: [
      "Information architecture",
      "Financial communication",
      "Recruiter-focused positioning",
      "Content governance",
    ],
    impact:
      "Makes the path from military accountability and infrastructure operations to accounting, finance, and investment research easier to evaluate while preserving the underlying work.",
    status: "Completed",
  },
];
