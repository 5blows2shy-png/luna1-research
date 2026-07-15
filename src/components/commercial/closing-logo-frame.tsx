"use client";

import { motion } from "framer-motion";
import { LunaMark } from "@/components/site";

export function ClosingLogoFrame({ active }: { active: boolean }) {
  return <div className="commercial-scene closing-scene" aria-hidden={!active}>
    <motion.div className="closing-lockup" initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }} transition={{ duration: 1.1 }}><LunaMark/><span>Independent research</span><h2>Luna1 Research</h2><p>Discipline. Evidence. Evolution.</p><b>luna1research.com</b></motion.div>
  </div>;
}
