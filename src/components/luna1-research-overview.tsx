type Luna1ResearchOverviewProps = {
  headingLevel?: 2 | 3;
};

const pillars = [
  {
    title: "Investment & Equity Research",
    body: "Analyze publicly traded companies through financial statements, valuation models, competitive positioning, capital allocation, and long-term business fundamentals.",
  },
  {
    title: "Cloud Infrastructure & FinOps Research",
    body: "Study cloud-computing economics, infrastructure consumption, virtual-machine resource utilization, cost allocation, and opportunities to improve technology-spending efficiency.",
  },
  {
    title: "Technology & Infrastructure Analysis",
    body: "Evaluate data-center economics, computing infrastructure, energy consumption, infrastructure capacity, and the financial drivers of capital-intensive technology businesses.",
  },
  {
    title: "Financial Modeling & Analytics",
    body: "Apply Excel, financial forecasting, valuation methodologies, and data analytics to assess business performance, infrastructure spending, and investment opportunities.",
  },
  {
    title: "Research & Development",
    body: "Explore cloud-cost-intelligence tools that connect infrastructure utilization, billing data, financial reporting, and optimization opportunities.",
  },
] as const;

export function Luna1ResearchOverview({
  headingLevel = 2,
}: Luna1ResearchOverviewProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="luna1-research-overview">
      <span className="eyebrow">Luna1 Research</span>
      <Heading>Independent Financial &amp; Technology Research</Heading>
      <p className="luna1-research-overview__specialties">
        Investment Research <span aria-hidden="true">•</span> Cloud Infrastructure{" "}
        <span aria-hidden="true">•</span> Financial Analytics
      </p>
      <p className="luna1-research-overview__lead">
        Independent research initiative examining financial markets, technology
        infrastructure, and the economics of cloud computing. Combines
        investment analysis with practical knowledge of enterprise virtualized
        environments, infrastructure operations, and financial management.
      </p>
      <ul>
        {pillars.map((pillar) => (
          <li key={pillar.title}>
            <strong>{pillar.title}:</strong> {pillar.body}
          </li>
        ))}
      </ul>
      <p className="luna1-research-overview__focus">
        <strong>Research Focus:</strong> Cloud Economics <span aria-hidden="true">|</span>{" "}
        Financial Markets <span aria-hidden="true">|</span> Infrastructure Finance{" "}
        <span aria-hidden="true">|</span> FinOps <span aria-hidden="true">|</span>{" "}
        Equity Research <span aria-hidden="true">|</span> Business Analytics
      </p>
    </div>
  );
}
