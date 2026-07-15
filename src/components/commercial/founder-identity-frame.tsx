"use client";

import { motion } from "framer-motion";

export function FounderIdentityFrame({ active }: { active: boolean }) {
  const details = ["U.S. Army Veteran", "Finance · SDSU", "Investment Research", "Python · Asset Management"];
  return <div className="commercial-scene founder-scene" aria-hidden={!active}>
    <motion.div className="founder-portrait" initial={false} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 1.03 }} transition={{ duration: 1.2 }} />
    <div className="founder-lines"><span>04 / The researcher</span><motion.h2 initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12 }}>Shyheim Lee</motion.h2>{details.map((detail, index) => <motion.p key={detail} initial={false} animate={{ opacity: active ? 1 : 0, x: active ? 0 : -10 }} transition={{ delay: .3 + index * .18 }}>{detail}</motion.p>)}</div>
  </div>;
}
