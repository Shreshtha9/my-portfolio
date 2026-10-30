import React from "react";
import { motion } from "framer-motion";
import { education } from "../../constants";
import SectionTitle from "../SectionTitle";
import CyberCard from "../CyberCard";

const Education = () => (
  <section id="education" className="px-[7vw] py-24 lg:px-[14vw]">
    <SectionTitle
      index="04 — ORIGIN STORY"
      title="Education"
      subtitle="The academic path that led here."
    />

    <div className="relative">
      {/* Vertical neon line */}
      <div className="absolute left-6 top-0 z-0 h-full w-[2px] bg-gradient-to-b from-neon-pink via-neon-violet to-neon-cyan shadow-neon sm:left-1/2" />

      {education.map((edu, index) => {
        const isEven = index % 2 === 0;
        return (
          <motion.div
            key={edu.id}
            className={`relative z-10 mb-16 flex flex-col items-center sm:flex-row ${
              isEven ? "sm:justify-start" : "sm:justify-end"
            }`}
            initial={{ opacity: 0, x: isEven ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            {/* Logo node */}
            <motion.div
              className="absolute left-6 z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-neon-pink bg-white shadow-neon sm:left-1/2"
              whileHover={{ scale: 1.12 }}
            >
              <img src={edu.img} alt={edu.school} className="h-full w-full rounded-full object-cover" />
            </motion.div>

            {/* Card */}
            <div className={`mt-10 w-full pl-14 sm:mt-0 sm:max-w-md sm:pl-0 ${isEven ? "sm:ml-0 sm:mr-auto sm:pr-14" : "sm:ml-auto sm:pl-14"}`}>
              <CyberCard innerClassName="p-6">
                <h3 className="font-display text-base font-bold uppercase text-white">{edu.degree}</h3>
                <h4 className="mt-1 text-xl text-neon-cyan">{edu.school}</h4>
                <p className="mt-1 font-mono text-sm uppercase tracking-widest text-gray-400">{edu.date}</p>
                <p className="mt-4 font-display text-sm font-bold uppercase tracking-widest text-neon-pink text-glow">
                  Grade: {edu.grade}
                </p>
                <p className="mt-3 text-lg text-gray-300">{edu.desc}</p>
              </CyberCard>
            </div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default Education;