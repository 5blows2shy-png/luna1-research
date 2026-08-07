"use client";

import { motion } from "framer-motion";

const products = [
  "Equity Research",
  "Portfolio Overview",
  "Active Positions",
  "Watchlist",
  "Conviction Dashboard",
  "Performance",
];

function ProductScreen({ name, index }: { name: string; index: number }) {
  return (
    <motion.article
      className="product-screen"
      initial={false}
      animate={{ opacity: 1, y: 0, scale: index === 1 ? 1.03 : 1 }}
      transition={{ delay: index * 0.09, duration: 0.7 }}
    >
      <header>
        <i />
        <i />
        <i />
        <span>LUNA1 / {String(index + 1).padStart(2, "0")}</span>
      </header>
      <div className="screen-body">
        <small>{name}</small>
        <b>{index % 2 ? "Evidence, weighted." : "Thesis, measured."}</b>
        <div className="screen-bars">
          {[74, 46, 88, 61].map((width, i) => (
            <i key={i} style={{ width: `${width - index * 2}%` }} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function ProductScreenMontage({ active }: { active: boolean }) {
  return (
    <div className="commercial-scene montage-scene" aria-hidden={!active}>
      <motion.div
        className="product-montage"
        animate={{ x: active ? [20, 0] : 20, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {products.map((name, index) => (
          <ProductScreen key={name} name={name} index={index} />
        ))}
      </motion.div>
      <div className="scene-copy">
        <span>03 / Research operating system</span>
        <h2>
          One process.
          <br />
          Multiple perspectives.
        </h2>
        <p>Concept product views</p>
      </div>
    </div>
  );
}
