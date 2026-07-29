import { PageHeader, SectionHeading } from "@/components/site";
import {
  careerProgression,
  professionalPositioning,
} from "@/lib/professional-profile";

export default function About() {
  return (
    <>
      <PageHeader
        kicker="About Luna1"
        title="Research shaped by accountable operations."
        description="Luna1 is Shy Lee’s professional financial research platform: a record of analytical thinking across public companies, valuation, accounting controls, portfolio decisions, and continuous improvement."
      />
      <section className="prose">
        <SectionHeading
          eyebrow="The perspective"
          title="A practitioner’s lens on long-term value"
        />
        <p className="lead">{professionalPositioning}</p>
        <p>
          The path to investment research moved through military logistics and
          financial accountability, reconciliation accounting, mission-critical
          data center operations, finance, and formal equity-research
          coursework. Each step added context for how organizations allocate
          resources, manage risk, produce financial results, and create value.
        </p>
        <p>
          Luna1 does not represent a startup or commercial financial product. It
          is a professional portfolio of research methods, documented decisions,
          and developing analytical work.
        </p>
      </section>
      <section>
        <SectionHeading
          eyebrow="Experience in context"
          title="One progression. Eight layers of understanding."
          copy="The sequence explains what each stage contributed without expanding the responsibilities beyond the documented experience."
        />
        <ol className="career-progression" aria-label="Career progression">
          {careerProgression.map((item, index) => (
            <li key={item.stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.stage}</h3>
                <p>{item.contribution}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
