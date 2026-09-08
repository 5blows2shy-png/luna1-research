export type CapitalFlowStatus =
  | "Confirmed"
  | "Developing"
  | "Watching"
  | "Weakening";

export type CapitalFlowHorizon = "High" | "Moderate" | "Developing";

export type CapitalFlowEvidenceStatus =
  | "Strong"
  | "Improving"
  | "Neutral"
  | "Weakening"
  | "Not Yet Evaluated";

export type CapitalFlowTheme = {
  id: string;
  name: string;
  description: string;
  status: CapitalFlowStatus;
  statusRationale: string;
  horizons: {
    now: CapitalFlowHorizon;
    next: CapitalFlowHorizon;
    emerging: CapitalFlowHorizon;
  };
  flow: string[];
  bottlenecks: Array<{
    name: string;
    whyItMatters: string;
    capitalResponse: string[];
  }>;
  companies: Array<{
    ticker: string;
    valueChainNode: string;
    role: string;
  }>;
  evidence: Array<{
    type: string;
    status: CapitalFlowEvidenceStatus;
    note: string;
    sourceReference?: string;
  }>;
  thesisRisks: string[];
  lastUpdated: string;
  keyChange: string;
};

const evidencePending = [
  {
    type: "Capital spending and orders",
    status: "Not Yet Evaluated" as const,
    note: "Company and industry source review is required before assigning a direction.",
  },
  {
    type: "Capacity and backlog",
    status: "Not Yet Evaluated" as const,
    note: "No consolidated Luna1 evidence assessment has been published.",
  },
  {
    type: "Earnings and cash-flow confirmation",
    status: "Not Yet Evaluated" as const,
    note: "Company-level fundamentals must confirm or challenge the structural thesis.",
  },
];

export const capitalFlowThemes: CapitalFlowTheme[] = [
  {
    id: "compute",
    name: "Compute",
    description:
      "Advanced semiconductors, memory, networking, servers, and data-center systems required to expand computing capacity.",
    status: "Developing",
    statusRationale:
      "Luna1 has company research in networking, optical connectivity, and electronic manufacturing, but the complete value-chain evidence review is still in development.",
    horizons: { now: "High", next: "High", emerging: "Moderate" },
    flow: [
      "AI and compute demand",
      "Higher cluster density",
      "Networking and optical connectivity",
      "Servers, memory, testing, and packaging",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Advanced compute capacity",
        whyItMatters:
          "Demand can be constrained by the availability and integration of chips, memory, networking, packaging, and supporting data-center equipment.",
        capitalResponse: [
          "Semiconductors",
          "Memory",
          "Networking",
          "Testing and packaging",
          "Data-center equipment",
        ],
      },
    ],
    companies: [
      {
        ticker: "ANET",
        valueChainNode: "Networking",
        role: "Supplies networking systems used to connect high-performance compute environments.",
      },
      {
        ticker: "GLW",
        valueChainNode: "Optical connectivity",
        role: "Supplies optical products that support higher data transmission and network density.",
      },
      {
        ticker: "JBL",
        valueChainNode: "Electronic manufacturing",
        role: "Provides manufacturing and supply-chain capabilities for complex electronic systems.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Reduced capital spending",
      "Excess capacity or falling utilization",
      "Competitive disruption",
      "Valuation that discounts unsupported growth",
    ],
    lastUpdated: "September 2026",
    keyChange: "Initial qualitative map established; evidence assessment remains in development.",
  },
  {
    id: "power",
    name: "Power",
    description:
      "Generation, transmission, grid equipment, electrical systems, backup power, and the infrastructure required to deliver reliable capacity.",
    status: "Developing",
    statusRationale:
      "Bloom Energy research frames project-economics and capacity questions, while the wider generation and grid supplier set still requires primary-source review.",
    horizons: { now: "Moderate", next: "High", emerging: "High" },
    flow: [
      "Load growth",
      "Power availability constraint",
      "Generation and grid investment",
      "Electrical and backup systems",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Power availability",
        whyItMatters:
          "New industrial and data-center loads may require power faster than generation and interconnection capacity can be delivered.",
        capitalResponse: [
          "Generation",
          "Transmission",
          "Transformers and switchgear",
          "Backup power",
          "Cooling",
        ],
      },
      {
        name: "Grid capacity",
        whyItMatters:
          "Transmission, interconnection, and electrical-equipment constraints can delay otherwise viable projects.",
        capitalResponse: [
          "Transmission",
          "Transformers",
          "Electrical components",
          "Engineering",
          "Construction",
        ],
      },
    ],
    companies: [
      {
        ticker: "BE",
        valueChainNode: "Onsite generation",
        role: "Provides distributed power systems being researched as a potential response to constrained grid access.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Regulatory or permitting delays",
      "Commodity-price shocks",
      "Project cancellations",
      "Weak project cash conversion",
    ],
    lastUpdated: "September 2026",
    keyChange: "Initial map linked to the existing Bloom Energy project-economics research.",
  },
  {
    id: "data-center-infrastructure",
    name: "Data Center Infrastructure",
    description:
      "Cooling, power distribution, construction, engineering, and interconnects that support higher-density computing facilities.",
    status: "Developing",
    statusRationale:
      "Luna1 research covers optical connectivity and specialty construction, but a complete facility-level capital build has not yet been published.",
    horizons: { now: "High", next: "High", emerging: "Moderate" },
    flow: [
      "More compute",
      "More data-center capacity",
      "More power and cooling",
      "More construction and interconnects",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Cooling and thermal management",
        whyItMatters:
          "Higher rack density can increase heat-removal requirements and make thermal design a gating factor for usable compute capacity.",
        capitalResponse: [
          "Liquid cooling",
          "HVAC",
          "Thermal systems",
          "Power management",
        ],
      },
    ],
    companies: [
      {
        ticker: "GLW",
        valueChainNode: "Interconnects",
        role: "Supplies optical-connectivity products used in increasingly dense data networks.",
      },
      {
        ticker: "STRL",
        valueChainNode: "Construction",
        role: "Provides infrastructure and specialty contracting exposure that includes mission-critical projects.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Data-center demand slowdown",
      "Project timing shifts",
      "Reduced capital expenditure",
      "Margin compression across contractors and suppliers",
    ],
    lastUpdated: "September 2026",
    keyChange: "Initial value-chain map connected to existing GLW and STRL research routes.",
  },
  {
    id: "robotics-automation",
    name: "Robotics & Automation",
    description:
      "Industrial automation, machine vision, motion control, sensors, and manufacturing systems that can raise throughput and reduce process constraints.",
    status: "Watching",
    statusRationale:
      "The theme is in the research queue; Luna1 does not yet have a mapped company dossier that supports a stronger status.",
    horizons: { now: "Moderate", next: "High", emerging: "High" },
    flow: [
      "Labor and throughput constraints",
      "Automation need",
      "Sensors, controls, and robotics",
      "Systems integration",
      "Company research pending",
    ],
    bottlenecks: [
      {
        name: "Automation integration capacity",
        whyItMatters:
          "Hardware availability does not remove a bottleneck unless systems can be integrated reliably into real production environments.",
        capitalResponse: [
          "Machine vision",
          "Motion control",
          "Sensors",
          "Industrial software",
          "Systems integration",
        ],
      },
    ],
    companies: [],
    evidence: evidencePending,
    thesisRisks: [
      "Delayed customer investment",
      "Long integration cycles",
      "Falling factory utilization",
      "Competitive displacement",
    ],
    lastUpdated: "September 2026",
    keyChange: "Theme initialized; company mapping and source review are pending.",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description:
      "Enterprise, cloud, network, identity, and critical-infrastructure security required as digital systems become more connected.",
    status: "Developing",
    statusRationale:
      "An existing Palo Alto Networks research route supports initial company mapping, but the broader security value chain remains under review.",
    horizons: { now: "High", next: "High", emerging: "High" },
    flow: [
      "Digital and cloud expansion",
      "Larger attack surface",
      "Security consolidation and protection",
      "Platform and infrastructure spending",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Security complexity",
        whyItMatters:
          "More applications, identities, networks, and infrastructure can increase operational complexity and the cost of fragmented security tools.",
        capitalResponse: [
          "Cloud security",
          "Network security",
          "Identity",
          "Critical-infrastructure security",
        ],
      },
    ],
    companies: [
      {
        ticker: "PANW",
        valueChainNode: "Security platforms",
        role: "Provides network, cloud, and security-operations products used by enterprises consolidating security workflows.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Slower security spending",
      "Competitive disruption",
      "Weak platform adoption",
      "Valuation compression",
    ],
    lastUpdated: "September 2026",
    keyChange: "Initial map linked to existing PANW research; evidence grading is pending.",
  },
  {
    id: "defense-aerospace",
    name: "Defense & Aerospace",
    description:
      "Modernization, autonomy, drones, electronic systems, and manufacturing capacity supporting defense and aerospace programs.",
    status: "Watching",
    statusRationale:
      "Mercury Systems provides an initial research connection, but program-level demand and production evidence require further review.",
    horizons: { now: "Moderate", next: "High", emerging: "Moderate" },
    flow: [
      "Modernization requirements",
      "Program funding",
      "Electronic systems and autonomy",
      "Manufacturing capacity",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Defense production capacity",
        whyItMatters:
          "Funding does not convert into delivered capability without qualified components, manufacturing throughput, and consistent program execution.",
        capitalResponse: [
          "Defense electronics",
          "Autonomy",
          "Qualified components",
          "Manufacturing systems",
        ],
      },
    ],
    companies: [
      {
        ticker: "MRCY",
        valueChainNode: "Defense electronics",
        role: "Supplies processing and electronic systems used in aerospace and defense applications.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Program delays",
      "Execution failures",
      "Budget changes",
      "Working-capital pressure",
    ],
    lastUpdated: "September 2026",
    keyChange: "Initial defense-electronics mapping established; program evidence remains pending.",
  },
  {
    id: "physical-infrastructure",
    name: "Physical Infrastructure",
    description:
      "Engineering, construction, utilities, water, and industrial equipment required to expand or modernize physical systems.",
    status: "Developing",
    statusRationale:
      "Existing Sterling Infrastructure research supports an initial contractor view; broader utility and equipment coverage remains pending.",
    horizons: { now: "Moderate", next: "High", emerging: "High" },
    flow: [
      "Aging or insufficient capacity",
      "Project authorization",
      "Engineering and equipment",
      "Specialty construction",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Skilled construction capacity",
        whyItMatters:
          "Complex infrastructure programs require qualified engineering, electrical, and specialty-construction labor to convert budgets into operating assets.",
        capitalResponse: [
          "Engineering firms",
          "Specialty contractors",
          "Electrical contractors",
          "Infrastructure builders",
        ],
      },
    ],
    companies: [
      {
        ticker: "STRL",
        valueChainNode: "Specialty construction",
        role: "Provides construction and infrastructure services across transportation, e-infrastructure, and building solutions.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Project deferrals",
      "Labor and input-cost inflation",
      "Execution problems",
      "Margin compression",
    ],
    lastUpdated: "September 2026",
    keyChange: "Initial construction mapping established; industry evidence remains in development.",
  },
  {
    id: "healthcare-biology",
    name: "Healthcare / Biology",
    description:
      "Diagnostics, automation, drug-development infrastructure, and medical technology supporting biological research and care delivery.",
    status: "Watching",
    statusRationale:
      "Adaptive Biotechnologies provides an initial research connection, but Luna1 has not completed a wider healthcare-infrastructure map.",
    horizons: { now: "Developing", next: "Moderate", emerging: "High" },
    flow: [
      "Diagnostic and therapeutic demand",
      "Research and clinical capacity",
      "Tools, automation, and medical technology",
      "Validation and adoption",
      "Company-level equity research",
    ],
    bottlenecks: [
      {
        name: "Clinical and diagnostic scaling",
        whyItMatters:
          "Scientific progress must pass through validation, reimbursement, laboratory capacity, and repeatable clinical workflows before it becomes durable demand.",
        capitalResponse: [
          "Diagnostics",
          "Laboratory automation",
          "Drug-development tools",
          "Medical technology",
        ],
      },
    ],
    companies: [
      {
        ticker: "ADPT",
        valueChainNode: "Immune diagnostics",
        role: "Develops immune-medicine diagnostics and research tools being monitored for adoption and cash requirements.",
      },
    ],
    evidence: evidencePending,
    thesisRisks: [
      "Clinical or regulatory setbacks",
      "Slow adoption",
      "Reimbursement pressure",
      "Capital requirements exceeding progress",
    ],
    lastUpdated: "September 2026",
    keyChange: "Theme initialized with one existing company-research connection.",
  },
];
