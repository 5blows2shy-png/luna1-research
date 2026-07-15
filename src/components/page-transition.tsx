"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function PageTransition({children}:{children:ReactNode}){
  const reducedMotion=useReducedMotion();
  return <motion.div initial={reducedMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:reducedMotion?0:.45,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
