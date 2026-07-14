import { PageHeader, Scorecard, SectionHeading } from "@/components/site";

const factors = ["Earnings Acceleration","Revenue Acceleration","Institutional Sponsorship","Competitive Moats","Industry Structure","Capital Allocation","Technical Structure","Risk Management","Valuation"];
const groups=[
 ["A","Trend Structure",["Price above 50-day and 200-day moving averages","50-day above a rising 200-day","Within 25% of 52-week high","Relative strength improving"]],
 ["B","Earnings Acceleration",["30%–40%+ quarterly EPS growth preferred","Multi-quarter gains and positive surprises","Growth at least twice the historical rate","Forward estimates increasing"]],
 ["C","Revenue Acceleration",["20%–25%+ quarterly revenue growth","Organic growth separated from acquisitions","Sequential and year-over-year acceleration","Flag sustained triple-digit growth"]],
 ["D","Operating Leverage",["Gross and operating margin expansion","Revenue outpacing operating expenses","Profitability inflection","Free cash flow improvement"]],
 ["E","Institutional Sponsorship",["Breakout volume expansion","Pullback volume contraction","Increasing fund ownership","Earnings gap-ups and sector leadership"]],
 ["F","Competitive Moat",["Switching costs and qualification","Network, data, or distribution advantages","Brand and customer loyalty","Mission-critical products"]],
 ["G","Catalysts",["New products and markets","Backlog or guidance growth","Margin recovery","Industry or regulatory inflection"]],
 ["H","Entry Rules",["Buy from a constructive base","Prefer breakout or reclaim near pivot","Require volume confirmation","Avoid chasing excessive extension"]],
 ["I","Exit Rules",["Exit failed breakouts","Respond to earnings deterioration","Watch institutional distribution","Exit when the thesis is invalidated"]],
] as const;

export default function Luna(){return <>
  <PageHeader kicker="Layered Understanding of Narrative Acceleration" title="The LUNA Framework" description="The LUNA Framework is Luna1's proprietary multi-factor investment research methodology designed to identify companies experiencing accelerating business fundamentals, improving institutional sponsorship, expanding competitive advantages, and constructive Stage 2 technical structure."/>
  <section className="luna-brand"><span className="eyebrow">LUNA · Investment Research Framework</span><h2>Separating price into the business fundamentals that create it.</h2><p>Layered Understanding of Narrative Acceleration</p><div className="factor-list">{factors.map((factor,i)=><div key={factor}><span>{String(i+1).padStart(2,"0")}</span><b>{factor}</b></div>)}</div><p className="factor-note">These nine factors combine into a proprietary LUNA Score ranging from 0 to 100.</p></section>
  <section><SectionHeading eyebrow="Multi-Factor Investment Research Framework" title="From business acceleration to disciplined execution."/><div className="framework-grid">{groups.map(([l,t,items])=><div className="framework-card" key={l}><div><span>{l}</span><h3>{t}</h3></div><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></div>)}</div></section>
  <section><SectionHeading eyebrow="Interactive demo" title="Build a LUNA Score." copy="Adjust the sample inputs to see how the 100-point classification responds. This is illustrative data, not a security rating."/><Scorecard/><div className="classification"><div><b>90–100</b><span>LUNA Superleader</span></div><div><b>80–89</b><span>LUNA-A</span></div><div><b>70–79</b><span>LUNA-B / Inflection Leader</span></div><div><b>60–69</b><span>Watchlist</span></div><div><b>&lt;60</b><span>Does Not Qualify</span></div></div></section>
  </>}
