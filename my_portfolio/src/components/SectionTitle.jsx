import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({ index, title, subtitle }) => (
  <motion.div
    className="mb-14"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <p className="mb-2 font-mono text-sm tracking-[0.3em] text-neon-cyan">
      {"// "}
      {index}
    </p>
    <h2 className="font-display text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
      {title}
      <span className="animate-blink text-neon-pink">_</span>
    </h2>
    <div className="mt-4 h-[2px] w-40 bg-gradient-to-r from-neon-pink to-transparent shadow-neon" />
    {subtitle && (
      <p className="mt-4 max-w-2xl text-xl text-gray-400">{subtitle}</p>
    )}
  </motion.div>
);

export default SectionTitle;