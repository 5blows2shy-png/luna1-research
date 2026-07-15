"use client";

import { motion } from "framer-motion";

const dimensions = ["Fundamentals", "Technicals", "Valuation", "Risk", "Discipline"];

export function PrismLightAnimation({ active }: { active: boolean }) {
  return <div className="commercial-scene prism-scene" aria-hidden={!active}>
    <svg viewBox="0 0 1200 600" role="presentation">
      <defs><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity=".03"/></linearGradient></defs>
      <motion.path d="M30 300 H500" stroke="#fff" strokeWidth="5" initial={false} animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.9 : 0 }} transition={{ duration: 1.4 }} />
      <path d="M590 105 L795 470 L385 470 Z" fill="url(#glass)" stroke="#d7dde5" strokeOpacity=".55" />
      {dimensions.map((label, index) => { const y = 205 + index * 56; const colors = ["#74a9d8", "#8079bb", "#9b70ac", "#bd747c", "#d28a5b"]; return <g key={label}>
        <motion.path d={`M610 300 L930 ${y}`} stroke={colors[index]} strokeWidth="3" initial={false} animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }} transition={{ delay: .8 + index * .12, duration: 1.1 }} />
        <motion.text x="950" y={y + 5} fill="#e8e9e5" fontSize="18" fontFamily="monospace" initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 1.35 + index * .12 }}>{label}</motion.text>
      </g>})}
    </svg>
    <div className="scene-copy"><span>02 / Analytical framework</span><h2>Research creates clarity.</h2></div>
  </div>;
}
