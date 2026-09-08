export type ChainCompany = { id: string; name: string; role: string; column: number };
export type ChainRelationship = {
  id: string; supplier: string; customer: string;
  kind: "Supply" | "Technology partnership" | "Announced deployment" | "Pilot";
  description: string; sourceTitle: string; sourceUrl: string; sourceDate: string;
};
export type CapitalEcosystem = {
  id: string; name: string; description: string; capitalPath: string[];
  companies: ChainCompany[]; relationships: ChainRelationship[];
};
const manufacturing: ChainRelationship[] = [
  { id: "asml-tsmc", supplier: "asml", customer: "tsmc", kind: "Supply", description: "ASML's 2024 annual report describes ASML tools operating in TSMC chip production facilities.", sourceTitle: "ASML 2024 annual report", sourceUrl: "https://ourbrand.asml.com/m/1d935e9653a216d7/original/2024-Annual-Report-based-on-IFRS.pdf", sourceDate: "2024 annual report" },
  { id: "tsmc-nvidia", supplier: "tsmc", customer: "nvidia", kind: "Supply", description: "NVIDIA identifies TSMC's custom 4NP process as the manufacturing process for Blackwell GPUs. This evidence is specific to Blackwell.", sourceTitle: "NVIDIA Blackwell architecture", sourceUrl: "https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/", sourceDate: "Undated product documentation" },
];
const upstream: ChainCompany[] = [
  { id: "asml", name: "ASML", role: "Lithography equipment", column: 0 },
  { id: "tsmc", name: "TSMC", role: "Semiconductor manufacturing", column: 1 },
  { id: "nvidia", name: "NVIDIA", role: "Compute & AI platforms", column: 2 },
];
export const capitalEcosystems: CapitalEcosystem[] = [
  {
    id: "data-centers", name: "Data Centers",
    description: "Follow infrastructure spending through equipment suppliers, chip manufacturing, compute platforms, and cloud customers.",
    capitalPath: ["AI demand", "Hyperscaler CapEx", "Data centers", "Compute · Power · Cooling · Networking · Construction"],
    companies: [...upstream,
      { id: "eaton", name: "Eaton", role: "Power systems & UPS", column: 2 },
      { id: "aws", name: "Amazon Web Services", role: "Cloud infrastructure", column: 3 },
      { id: "microsoft", name: "Microsoft Azure", role: "Cloud infrastructure", column: 3 },
      { id: "google", name: "Google Cloud", role: "Cloud infrastructure", column: 3 },
      { id: "oracle", name: "Oracle Cloud", role: "Cloud infrastructure", column: 3 },
    ],
    relationships: [...manufacturing,
      ...(["aws", "microsoft", "google", "oracle"] as const).map((customer) => ({
        id: "nvidia-" + customer, supplier: "nvidia", customer, kind: "Announced deployment" as const,
        description: "NVIDIA named this cloud provider among the first to offer Blackwell-powered instances. The announcement does not disclose purchase amounts or confirm today's deployment volume.",
        sourceTitle: "NVIDIA Blackwell platform announcement", sourceUrl: "https://investor.nvidia.com/news/press-release-details/2024/NVIDIA-Blackwell-Platform-Arrives-to-Power-a-New-Era-of-Computing/", sourceDate: "2024-03-18",
      })),
      { id: "eaton-microsoft", supplier: "eaton", customer: "microsoft", kind: "Pilot", description: "Eaton and Microsoft demonstrated EnergyAware UPS capabilities at Microsoft's Boydton innovation center. This is evidence of a pilot, not a fleet-wide supply agreement.", sourceTitle: "Eaton / Microsoft grid-interactive data center pilot", sourceUrl: "https://www.eaton.com/us/en-us/company/news-insights/news-releases/2021/eaton-advances-grid-interactive-data-centers.html", sourceDate: "2021 announcement" },
    ],
  },
  {
    id: "robotics", name: "Robotics",
    description: "Explore the companies providing robotics technology, the robot makers integrating it, and the customers deploying automation.",
    capitalPath: ["Automation & autonomy demand", "Industrial / fleet investment", "Robotics platforms & robotaxis", "Nervous system · Motion joints · Controls · Integration"],
    companies: [
      { id: "tsmc", name: "TSMC", role: "Blackwell manufacturing context", column: 0 },
      { id: "nvidia", name: "NVIDIA", role: "Robotics compute & simulation", column: 1 },
      { id: "abb", name: "ABB Robotics", role: "Industrial robot systems", column: 2 },
      { id: "boston", name: "Boston Dynamics", role: "Atlas & Stretch robot platforms", column: 2 },
      { id: "volvo", name: "Volvo Cars", role: "Automotive manufacturing", column: 3 },
      { id: "dhl", name: "DHL", role: "Warehouse & logistics operations", column: 3 },
      { id: "tesla", name: "Tesla", role: "Optimus & autonomy platform", column: 2 },
      { id: "waymo", name: "Waymo", role: "Autonomous driving / robotaxi", column: 3 },
      { id: "zoox", name: "Zoox", role: "Amazon robotaxi subsidiary", column: 3 },
      { id: "amazon", name: "Amazon", role: "Zoox owner & logistics customer", column: 4 },
      { id: "harmonic-drive", name: "Harmonic Drive Systems", role: "Strain-wave reducers & actuators", column: 0 },
      { id: "nabtesco", name: "Nabtesco", role: "Precision robot-joint reducers", column: 0 },
      { id: "nidec", name: "Nidec", role: "Motors & actuation", column: 0 },
      { id: "hesai", name: "Hesai", role: "Lidar sensing", column: 0 },
      { id: "mobileye", name: "Mobileye", role: "Autonomy compute & perception", column: 1 },
      { id: "qualcomm", name: "Qualcomm", role: "Edge AI compute", column: 1 },
    ],
    relationships: [
      manufacturing[1],
      { id: "nvidia-abb", supplier: "nvidia", customer: "abb", kind: "Technology partnership", description: "ABB announced integration of NVIDIA Omniverse libraries into RobotStudio. This describes a software collaboration; purchase terms are not disclosed.", sourceTitle: "ABB Robotics and NVIDIA collaboration", sourceUrl: "https://www.abb.com/global/en/news/134030", sourceDate: "See publisher announcement" },
      { id: "nvidia-boston", supplier: "nvidia", customer: "boston", kind: "Technology partnership", description: "Boston Dynamics describes Atlas development using NVIDIA Jetson Thor and Isaac GR00T. This does not establish that Stretch uses the same components.", sourceTitle: "Boston Dynamics expands NVIDIA collaboration", sourceUrl: "https://bostondynamics.com/news/boston-dynamics-expands-collaboration-with-nvidia/", sourceDate: "2025-03-18" },
      { id: "abb-volvo", supplier: "abb", customer: "volvo", kind: "Supply", description: "ABB announced an agreement to supply more than 1,300 robots and functional packages for Volvo Cars' electric vehicle production.", sourceTitle: "ABB robot supply agreement with Volvo Cars", sourceUrl: "https://new.abb.com/news/detail/110881/smart-robotic-automation-solutions-from-abb-to-support-sustainability-targets-for-volvo-cars", sourceDate: "2023-12-19" },
      { id: "boston-dhl", supplier: "boston", customer: "dhl", kind: "Announced deployment", description: "DHL and Boston Dynamics announced an MOU for additional Stretch deployments, building on existing deployments. An MOU is not a completed purchase of all proposed units.", sourceTitle: "DHL / Boston Dynamics deployment MOU", sourceUrl: "https://bostondynamics.com/news/dhl-signs-mou-for-additional-1000-robot-deployment/", sourceDate: "2025-05-13" },
      { id: "tesla-nvidia", supplier: "nvidia", customer: "tesla", kind: "Technology partnership", description: "Tesla's robotics and autonomy work uses a proprietary software and inference stack; this edge records NVIDIA as an ecosystem reference only, not a verified Optimus component purchase.", sourceTitle: "Tesla AI & Robotics", sourceUrl: "https://www.tesla.com/AI", sourceDate: "Accessed 2026-09-07" },
      { id: "waymo-qualcomm", supplier: "qualcomm", customer: "waymo", kind: "Technology partnership", description: "Waymo is an autonomous-driving platform customer/peer to track; no component purchase is asserted without a supplier disclosure.", sourceTitle: "Waymo Driver", sourceUrl: "https://waymo.com/waymo-driver/", sourceDate: "Accessed 2026-09-07" },
      { id: "zoox-amazon", supplier: "amazon", customer: "zoox", kind: "Technology partnership", description: "Zoox's official backgrounder says it joined forces with Amazon in 2020. This is an ownership relationship, not a third-party supply contract.", sourceTitle: "Zoox backgrounder", sourceUrl: "https://zoox.com/common/files/global-202603-zoox-press-kit-backgrounder.pdf", sourceDate: "2026 backgrounder" },
      { id: "nabtesco-robot-joints", supplier: "nabtesco", customer: "abb", kind: "Supply", description: "Nabtesco describes precision reduction gears used in industrial robot joints and says recognized robot manufacturers use its products; this is an industry-supply relationship, not an ABB-specific purchase disclosure.", sourceTitle: "Nabtesco precision reduction gears for robotics", sourceUrl: "https://www.nabtesco.com/en/products/robot/", sourceDate: "Accessed 2026-09-07" },
      { id: "harmonic-drive-robot-joints", supplier: "harmonic-drive", customer: "tesla", kind: "Supply", description: "Harmonic Drive supplies precision gearheads and actuators for robotics; no Tesla-specific purchase is asserted. Treat this as a candidate supplier relationship pending primary disclosure.", sourceTitle: "Harmonic Drive robotics applications", sourceUrl: "https://www.harmonicdrive.net/", sourceDate: "Accessed 2026-09-07" },
      { id: "hesai-waymo", supplier: "hesai", customer: "waymo", kind: "Supply", description: "Waymo and Hesai are both tracked in the autonomy sensing chain, but this edge is a research candidate only until a current supplier disclosure verifies the relationship.", sourceTitle: "Waymo Driver", sourceUrl: "https://waymo.com/waymo-driver/", sourceDate: "Accessed 2026-09-07" },
    ],
  },
  {
    id: "power-grid", name: "Power, Grid & Electrification",
    description: "Map the equipment and contractors that connect rising electricity demand to generation, transmission, and end users.",
    capitalPath: ["AI · robotics · factory demand", "Generation & transmission", "Substations · transformers · switchgear", "Power management · storage · materials"],
    companies: [
      { id: "eaton-power", name: "Eaton", role: "Power management & switchgear", column: 1 },
      { id: "abb-power", name: "ABB", role: "Electrification & grid equipment", column: 1 },
      { id: "hubbell", name: "Hubbell", role: "Utility and electrical equipment", column: 1 },
      { id: "nvent", name: "nVent Electric", role: "Electrical connection and protection", column: 1 },
      { id: "ge-vernova", name: "GE Vernova", role: "Generation and grid equipment", column: 0 },
      { id: "powell", name: "Powell Industries", role: "Electrical distribution", column: 2 },
      { id: "quanta", name: "Quanta Services", role: "Grid and electrical construction", column: 2 },
      { id: "cummins", name: "Cummins", role: "Distributed power and generation", column: 2 },
    ],
    relationships: [],
  },
  {
    id: "tokenized-capital", name: "Tokenized Capital Markets",
    description: "A research map for the rails that issue, custody, transfer, collateralize, and settle tokenized financial assets.",
    capitalPath: ["Investor & issuer demand", "Identity · issuance · tokenized assets", "Custody · exchanges · settlement", "Collateral · programmable money · financing"],
    companies: [
      { id: "blackrock-tokenized", name: "Asset managers", role: "Tokenized funds and Treasuries", column: 0 },
      { id: "banks-tokenized", name: "Banks & dealers", role: "Deposits, credit, and distribution", column: 1 },
      { id: "custody-tokenized", name: "Custody platforms", role: "Safekeeping and transfer controls", column: 2 },
      { id: "settlement-tokenized", name: "Settlement networks", role: "Programmable settlement and collateral", column: 3 },
    ],
    relationships: [],
  },
];

export function connectedCompanyIds(ecosystem: CapitalEcosystem, focus: string, depth: number): Set<string> {
  if (focus === "all") return new Set(ecosystem.companies.map((company) => company.id));
  const found = new Set([focus]);
  let frontier = [focus];
  for (let step = 0; step < depth; step++) {
    const next: string[] = [];
    for (const edge of ecosystem.relationships) {
      if (frontier.includes(edge.supplier) && !found.has(edge.customer)) next.push(edge.customer);
      if (frontier.includes(edge.customer) && !found.has(edge.supplier)) next.push(edge.supplier);
    }
    frontier = [...new Set(next)];
    frontier.forEach((id) => found.add(id));
  }
  return found;
}
