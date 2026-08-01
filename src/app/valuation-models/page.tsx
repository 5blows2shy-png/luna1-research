import type { Metadata } from "next";
import { DcfCalculator } from "@/components/interactive-tools";
import { PageHeader, SectionHeading } from "@/components/site";

export const metadata: Metadata = {
  title: "Valuation Lab",
  description:
    "Professional valuation frameworks for testing cash flow, comparable-company, revenue, scenario, and sensitivity assumptions.",
};

const models = [
  {
    title: "Discounted Cash Flow",
    description:
      "Revenue, margin, reinvestment, discount-rate, and terminal-value assumptions organized into an intrinsic-value framework.",
    status: "Interactive sample below",
  },
  {
    title: "Comparable Companies",
    description:
      "Peer multiples evaluated alongside growth, profitability, cash conversion, capital intensity, and business quality.",
    status: "Template planned",
  },
  {
    title: "Sensitivity Analysis",
    description:
      "Two-variable tables expose the range of outcomes created by changes in operating and valuation assumptions.",
    status: "Template planned",
  },
  {
    title: "Revenue Build",
    description:
      "Operating drivers connect unit volume, pricing, utilization, mix, and segment assumptions to the forecast.",
    status: "Template planned",
  },
  {
    title: "Assumption Tracking",
    description:
      "Every material input is documented with its rationale, source status, revision date, and scenario role.",
    status: "Template planned",
  },
  {
    title: "Scenario Analysis",
    description:
      "Base, upside, and downside cases connect catalysts and risks to explicit financial and valuation outcomes.",
    status: "Template planned",
  },
] as const;

export default function ValuationLabPage() {
  return (
    <>
      <PageHeader
        kicker="Valuation Lab"
        title="Make the assumptions visible."
        description="Valuation is presented as a range of outcomes supported by operating drivers, source-aware assumptions, sensitivity analysis, and clear revision history."
      />
      <section>
        <SectionHeading
          eyebrow="Model library"
          title="Use the framework that fits the business"
          copy="Models remain labeled as planned until their assumptions, formulas, controls, and downloadable workbooks are validated."
        />
        <div className="model-grid">
          {models.map((model, index) => (
            <article key={model.title} className="model-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{model.title}</h3>
              <p>{model.description}</p>
              <b>{model.status}</b>
            </article>
          ))}
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="Interactive sample"
          title="Simplified DCF calculator"
          copy="Change the operating assumptions to observe their effect on implied value. Depreciation, capital expenditure, and working capital are intentionally omitted from this limited demonstration."
        />
        <DcfCalculator />
        <div className="placeholder-banner">
          Educational model only. Results depend entirely on the assumptions
          entered and do not constitute a valuation opinion or investment
          advice.
        </div>
      </section>
      <section className="download-governance">
        <div>
          <span className="eyebrow">Download governance</span>
          <h2>Excel models publish only after validation.</h2>
        </div>
        <p>
          Downloadable workbooks will include source notes, assumption history,
          formula checks, scenario controls, version information, and the Luna1
          educational disclosure. No incomplete workbook is presented as a
          finished valuation model.
        </p>
      </section>
    </>
  );
}
