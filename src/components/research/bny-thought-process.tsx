"use client";

import { useMemo, useState } from "react";

type Scenario = "Bear" | "Base" | "Bull";
type EntryView = "Watch" | "Starter Position" | "Add Zone" | "Fully Valued";

const scenarioCopy: Record<Scenario, string> = {
  Bear: "Fee growth slows, markets weaken, valuation compresses, rate dynamics become less favorable, and digital-finance adoption develops slowly.",
  Base: "The existing franchise compounds through fee growth, operating leverage, capital returns, high returns on tangible capital, and institutional asset growth.",
  Bull: "The base business remains strong while digital custody, tokenized assets, settlement infrastructure, and institutional adoption create incremental fee opportunities.",
};

export function BnyThoughtProcess() {
  const [scenario, setScenario] = useState<Scenario>("Base");
  const [entryView, setEntryView] = useState<EntryView>("Watch");
  const [valuation, setValuation] = useState("Reasonable");
  const conclusion = useMemo(() => {
    if (entryView === "Fully Valued" || valuation === "Premium") return "Quality can remain attractive while expected return becomes less compelling. Continue to monitor the franchise and wait for a more favorable entry setup.";
    if (entryView === "Add Zone" && valuation === "Reasonable") return "This is a research-screening output only. Confirm current primary-source evidence, valuation, and personal risk constraints before acting.";
    return "The framework is an educational decision aid. It does not generate a recommendation or a price target.";
  }, [entryView, valuation]);

  return (
    <>
      <section className="bny-thought-chain" aria-label="Luna1 BNY thought process">
        {["Financial infrastructure", "Recurring fees", "High switching costs", "High returns on capital", "Capital returns", "Reasonable valuation", "Tokenization optionality", "Asymmetric return potential"].map((item) => <div key={item}>{item}<span aria-hidden="true">↓</span></div>)}
      </section>

      <section className="bny-bridge" aria-labelledby="bny-bridge-title">
        <span className="eyebrow">Bridge / toll booth framework</span>
        <h2 id="bny-bridge-title">Traditional institutional finance, with emerging optionality.</h2>
        <div>{["Traditional finance", "Custody", "Clearing", "Settlement", "Collateral", "Payments", "Tokenized finance"].map((item) => <span key={item}>{item}</span>)}</div>
        <p>BNY is evaluated as a potential bridge between established institutional-finance workflows and emerging digital financial infrastructure. This does not imply control of the settlement ecosystem or replacement of other critical market-infrastructure providers.</p>
      </section>

      <section className="bny-scenarios" aria-labelledby="bny-scenarios-title">
        <div><span className="eyebrow">Asymmetry</span><h2 id="bny-scenarios-title">Good company versus good investment at this price.</h2></div>
        <fieldset><legend>Editable research scenario</legend><div className="bny-controls">{(["Bear", "Base", "Bull"] as Scenario[]).map((item) => <button aria-pressed={scenario === item} key={item} onClick={() => setScenario(item)} type="button">{item} case</button>)}</div><label>Entry discipline<select value={entryView} onChange={(event) => setEntryView(event.target.value as EntryView)}>{(["Watch", "Starter Position", "Add Zone", "Fully Valued"] as EntryView[]).map((item) => <option key={item}>{item}</option>)}</select></label><label>Existing-business valuation view<select value={valuation} onChange={(event) => setValuation(event.target.value)}><option>Discount</option><option>Reasonable</option><option>Premium</option></select></label></fieldset>
        <article><span>{scenario.toUpperCase()} CASE · USER INPUT</span><p>{scenarioCopy[scenario]}</p><small>{conclusion}</small></article>
      </section>
    </>
  );
}
