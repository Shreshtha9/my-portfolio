import React from "react";
import { motion } from "framer-motion";
import { experience } from "../../constants";
import SectionTitle from "../SectionTitle";
import CyberCard from "../CyberCard";

const Experience = () => (
  <section id="experience" className="px-[7vw] py-24 lg:px-[14vw]">
    <SectionTitle
      index="02 — MISSION LOG"
      title="Experience"
      subtitle="Where I have worked on real systems."
    />

    <div className="relative">
      {/* Vertical neon line */}
      <div className="absolute left-3 top-0 h-full w-[2px] bg-gradient-to-b from-neon-pink via-neon-violet to-neon-cyan shadow-neon" />

      {experience.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.15 }}
          className="relative mb-12 pl-12"
        >
          {/* Node */}
          <span className="absolute left-0 top-6 h-6 w-6 rounded-full border-2 border-neon-pink bg-ink shadow-neon">
            <span className="absolute inset-1 rounded-full bg-neon-pink" />
          </span>

          <CyberCard innerClassName="p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
              <div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{job.role}</h3>
                <p className="text-xl text-neon-cyan">{job.company}</p>
              </div>
              <p className="font-mono text-sm uppercase tracking-widest text-neon-pink">{job.date}</p>
            </div>

            <ul className="mt-5 space-y-2 text-lg text-gray-300">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-[2px] font-mono text-neon-pink">&gt;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-neon-cyan/40 px-3 py-1 font-mono text-xs uppercase tracking-widest text-neon-cyan"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CyberCard>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Experience;