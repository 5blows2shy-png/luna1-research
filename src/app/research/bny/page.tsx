import type { Metadata } from "next";
import Link from "next/link";
import { BnyThoughtProcess } from "@/components/research/bny-thought-process";
import { bnyCaseStudy } from "@/data/research/bny-case-study";
import { ResearchDisclaimer, ResearchSectionNav } from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";

export const metadata: Metadata = { title: "BNY Financial Infrastructure Case Study", description: "An educational Luna1 case study on financial infrastructure, valuation discipline, capital returns, and emerging digital-finance optionality." };

export default function BnyCaseStudyPage() {
  return <>
    <PageHeader
      kicker="Featured Research Case Study · Financial Infrastructure"
      title="BNY"
      description={`${bnyCaseStudy.title}. ${bnyCaseStudy.subtitle}`}
    />
    <section className="bny-case-intro"><ResearchSectionNav /><p className="bny-framing">{bnyCaseStudy.framing}</p><p><b>Research status:</b> Thought-process case study. Reported financial values and market-data inputs are withheld until verified from dated primary sources. <b>Updated:</b> <time dateTime={bnyCaseStudy.updated}>November 10, 2026</time>.</p></section>
    <section className="bny-case-section"><SectionHeading eyebrow="Why I looked at it" title="Financial infrastructure before digital optionality." /><p className="bny-prose">{bnyCaseStudy.whyLooked}</p><BnyThoughtProcess /></section>
    <section className="bny-case-section"><SectionHeading eyebrow="How I thought about the investment" title="From business model to entry discipline." /><div className="bny-step-list">{bnyCaseStudy.steps.map((step) => <article key={step.number}><span>{step.number}</span><div><h2>{step.title}</h2><strong>{step.question}</strong><p>{step.body}</p><ul>{step.checks.map((check) => <li key={check}>{check}</li>)}</ul></div></article>)}</div></section>
    <section className="bny-case-section bny-two-column"><div><SectionHeading eyebrow="Capital allocation" title="Return excess capital without weakening the franchise." /><p>Dividends, share repurchases, payout, capital retention, and return on tangible common equity are examined together. The question is whether management is returning excess capital intelligently while preserving the franchise.</p><SectionHeading eyebrow="Quality versus price" title="A comparison framework, not an equivalence claim." /><p>Payments, custody, market infrastructure, ratings, indexes, clearing, settlement, and data businesses can be compared across moat, recurring revenue, capital intensity, return on capital, growth, valuation, and optionality. They should not be treated as identical business models.</p><p><b>BNY versus Mastercard:</b> the thought process compares quality, valuation, and expected return from today’s price—not operational superiority. A premium-quality business can still have a less attractive expected return if the price already incorporates too much of the upside.</p></div><aside><span className="eyebrow">Business quality check</span><ul>{["Can I understand the business?", "Is the competitive position durable?", "Are returns on capital attractive?", "Is capital allocated intelligently?", "Are earnings durable and the balance sheet sound?", "Is optionality free or already priced in?"].map((item) => <li key={item}>{item}</li>)}</ul></aside></section>
    <section className="bny-case-section bny-monitor"><SectionHeading eyebrow="Thesis invalidation" title="The downside case receives equal attention." /><div><article><h2>What would break the thesis?</h2><ul>{bnyCaseStudy.invalidations.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h2>KPIs to monitor</h2><ul>{bnyCaseStudy.kpis.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>
    <section className="bny-case-section"><SectionHeading eyebrow="Research updates" title="A living case, not a static conclusion." /><p>Future dated updates may document quarter, revenue, EPS, fee growth, AUC/A, ROTCE, capital returns, valuation context, digital-asset developments, thesis change, and entry view. Historical source dates will remain separate from update dates.</p><div className="bny-sources"><span className="eyebrow">Primary-source register</span>{bnyCaseStudy.sources.map((source) => <p key={source.url}><Link href={source.url} rel="noreferrer" target="_blank">{source.label} ↗</Link><small>{source.note}</small></p>)}</div></section>
    <section className="research-disclaimer-section"><ResearchDisclaimer /></section>
  </>;
}
