"use client";

import { motion } from "framer-motion";
import { cinematicEase } from "./motion-tokens";

const metrics = [["Portfolio beta", "0.84"], ["Max drawdown", "−8.2%"], ["Cash reserve", "12.0%"], ["Conviction", "High"]];

export function CommandCenterFrame({ active }: { active: boolean }) {
  return <div className="commercial-scene command-scene" aria-hidden={!active}>
    <div className="command-horizon" />
    <motion.div className="command-console" initial={false} animate={{ opacity: active ? 1 : 0, rotateX: active ? 0 : 8, y: active ? 0 : 24 }} transition={{ duration: 1.1, ease: cinematicEase }}>
      <header><span>LUNA1 / PORTFOLIO INTELLIGENCE</span><b>MODEL STATUS · ACTIVE</b></header>
      <section className="command-layout">
        <div className="command-chart"><small>Risk-adjusted trajectory</small><svg viewBox="0 0 620 220" preserveAspectRatio="none"><motion.path d="M0 186 C70 172 82 142 148 151 S238 116 290 126 S380 72 430 94 S520 36 620 48" fill="none" stroke="#6da6d0" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 2.4, ease: cinematicEase }}/><path d="M0 205H620M0 155H620M0 105H620M0 55H620" stroke="#53606a" strokeOpacity=".22"/></svg></div>
        <div className="heatmap"><small>Sector map</small>{["TECH","FIN","HC","IND","RE","CASH"].map((sector,index)=><i key={sector} style={{"--heat":`${22 + index * 11}%`} as React.CSSProperties}>{sector}</i>)}</div>
        <div className="python-stream"><small>PYTHON SCREENER</small><code>universe.filter(quality &amp; momentum)</code><code>risk.score_portfolio()</code><b>184 securities → 12 candidates</b></div>
        <div className="command-metrics">{metrics.map(([label,value])=><div key={label}><small>{label}</small><b>{value}</b></div>)}</div>
      </section>
    </motion.div>
    <div className="scene-copy"><span>04 / Decision environment</span><h2>Evidence,<br/>operationalized.</h2><p>Illustrative analytics</p></div>
  </div>;
}
