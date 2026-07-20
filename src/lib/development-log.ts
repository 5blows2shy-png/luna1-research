export type DevelopmentStatus = "Completed" | "In Progress" | "Planned";
export type DevelopmentCategory =
  | "Strategy"
  | "Research"
  | "Portfolio"
  | "Platform"
  | "Professional Development";

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
];
