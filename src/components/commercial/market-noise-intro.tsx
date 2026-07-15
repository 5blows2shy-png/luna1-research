"use client";

import { motion } from "framer-motion";
import { ParticleField } from "./particle-field";

const tape = [
  ["NVDA", "+2.41%"], ["SPX", "5,428.17"], ["AAPL", "221.04"],
  ["EPS", "$6.12"], ["10Y", "4.28%"], ["FCF", "+18.7%"],
  ["MSFT", "449.78"], ["REV", "$14.2B"], ["VIX", "14.86"],
];

export function MarketNoiseIntro({ active, reduced = false }: { active: boolean; reduced?: boolean }) {
  return <div className="commercial-scene market-noise" aria-hidden={!active}>
    <ParticleField active={active} reduced={reduced}/>
    <div className="market-grid" />
    <div className="market-headlines">{["AI CAPEX", "GDP 2.8", "CPI 3.1", "FED FUNDS", "TREASURY YIELDS", "OPTIONS FLOW"].map((item,index)=><motion.span key={item} animate={active ? { opacity: [.1,.7,.18], x: [index%2?8:-8,0] } : { opacity: 0 }} transition={{ duration: 1.8 + index * .15, repeat: Infinity, repeatType: "mirror" }}>{item}</motion.span>)}</div>
    <motion.div className="ticker-cloud" animate={active ? { x: [0, -28, 18, 0] } : { x: 0 }} transition={{ duration: 5.1, ease: "linear" }}>
      {tape.map(([symbol, value], index) => <motion.div className="ticker-chip" key={`${symbol}-${index}`} initial={false} animate={active ? { opacity: [0.25, 1, 0.45], y: [8, 0, -5] } : { opacity: 0.25 }} transition={{ duration: 1.1 + index * 0.11, repeat: Infinity, repeatType: "mirror" }}>
        <b>{symbol}</b><span>{value}</span>
      </motion.div>)}
    </motion.div>
    <svg className="noise-chart" viewBox="0 0 900 260" preserveAspectRatio="none" role="presentation"><motion.path d="M0 190 L70 168 L125 198 L190 110 L250 136 L310 72 L370 123 L430 88 L490 158 L555 95 L620 116 L690 48 L750 90 L820 35 L900 62" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0.2 }} transition={{ duration: 4.8, ease: "easeInOut" }} /></svg>
    <div className="scene-copy"><span>01 / Signal environment</span><h2>Markets generate noise.</h2><p>Illustrative market data — not real time</p></div>
  </div>;
}
