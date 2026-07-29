"use client";

import { motion } from "framer-motion";

const dimensions = [
  "Fundamentals",
  "Technical Analysis",
  "Risk",
  "Valuation",
  "Psychology",
  "Process",
  "Discipline",
  "Capital Allocation",
];

export function PrismLightAnimation({ active }: { active: boolean }) {
  return (
    <div className="commercial-scene prism-scene" aria-hidden={!active}>
      <svg viewBox="0 0 1200 600" role="presentation">
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--text-primary)" stopOpacity=".28" />
            <stop
              offset="1"
              stopColor="var(--text-primary)"
              stopOpacity=".03"
            />
          </linearGradient>
        </defs>
        <motion.path
          d="M30 300 H500"
          stroke="var(--text-primary)"
          strokeWidth="5"
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.9 : 0 }}
          transition={{ duration: 1.4 }}
        />
        <path
          d="M590 105 L795 470 L385 470 Z"
          fill="url(#glass)"
          stroke="var(--text-secondary)"
          strokeOpacity=".55"
        />
        {dimensions.map((label, index) => {
          const y = 150 + index * 48;
          const colors = [
            "#3b82f6",
            "#60a5fa",
            "#22d3ee",
            "#10b981",
            "#f59e0b",
            "#fbbf24",
            "#ef4444",
            "#64748b",
          ];
          return (
            <g key={label}>
              <motion.path
                d={`M610 300 L930 ${y}`}
                stroke={colors[index]}
                strokeWidth="3"
                initial={false}
                animate={{
                  pathLength: active ? 1 : 0,
                  opacity: active ? 1 : 0,
                }}
                transition={{ delay: 0.8 + index * 0.12, duration: 1.1 }}
              />
              <motion.text
                x="950"
                y={y + 5}
                fill="var(--text-primary)"
                fontSize="18"
                fontFamily="monospace"
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ delay: 1.35 + index * 0.12 }}
              >
                {label}
              </motion.text>
            </g>
          );
        })}
      </svg>
      <div className="scene-copy">
        <span>02 / Analytical framework</span>
        <h2>Research creates clarity.</h2>
      </div>
    </div>
  );
}
