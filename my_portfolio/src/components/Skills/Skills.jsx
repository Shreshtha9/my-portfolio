import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { SkillsInfo } from "../../constants";
import SectionTitle from "../SectionTitle";
import CyberCard from "../CyberCard";

const Skills = () => (
  <section id="skills" className="px-[7vw] py-24 lg:px-[14vw]">
    <SectionTitle
      index="01 — ABILITIES"
      title="Skills"
      subtitle="The tech stack I use to design, build and ship."
    />

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SkillsInfo.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} perspective={1000} scale={1.02} transitionSpeed={1200}>
            <CyberCard className="h-full" innerClassName="p-6">
              <h3 className="mb-5 font-display text-lg font-bold uppercase tracking-widest text-neon-pink text-glow">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.06 }}
                    className="cyber-clip-sm flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 transition hover:border-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-sm"
                  >
                    {skill.icon ? (
                      <skill.icon className="h-6 w-6 text-neon-cyan" />
                    ) : (
                      <img
                        src={skill.logo}
                        alt={`${skill.name} logo`}
                        className={`h-6 w-6 object-contain ${
                          skill.light ? "rounded-sm bg-white p-0.5" : ""
                        }`}
                      />
                    )}
                    <span className="text-base font-semibold text-white">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </CyberCard>
          </Tilt>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Skills;