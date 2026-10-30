import React from "react";
import { motion } from "framer-motion";
import ReactTypingEffect from "react-typing-effect";
import Tilt from "react-parallax-tilt";
import profileImage from "../../assets/profile.png";
import { projects } from "../../constants";
import { scrollToId } from "../../lib/scrollTo";

const RESUME =
  "https://drive.google.com/file/d/1mwF4xkEkb1rvuIfzBBHpe2WwCX_xnfqP/view?usp=drive_link";

const stats = [
  { value: "8.54", label: "CGPA" },
  { value: "6 MO", label: "Cloud internship" },
  { value: String(projects.length), label: "Projects" },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

const About = () => (
  <section
    id="about"
    className="mt-10 px-[7vw] py-4 md:mt-20 lg:mt-24 lg:px-[14vw]"
  >
    <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row">
      {/* Left side */}
      <div className="text-center md:w-[55%] md:text-left">
        <motion.p {...fade(0.1)} className="mb-4 font-mono text-sm tracking-[0.3em] text-neon-cyan">
          {"// SYSTEM ONLINE — HELLO, WORLD"}
        </motion.p>

        <motion.h1
          {...fade(0.25)}
          className="font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          <span className="glitch block" data-text="Shreshtha">Shreshtha</span>
          <span className="glitch block text-neon-pink text-glow" data-text="Srivastava">Srivastava</span>
        </motion.h1>

        <motion.h3
          {...fade(0.4)}
          className="mt-5 font-mono text-lg text-gray-200 sm:text-xl md:text-2xl"
        >
          <span className="text-neon-cyan">&gt; </span>
          <ReactTypingEffect
            text={["Full Stack Developer", "Java & Spring Boot Developer", "Cloud & AI Enthusiast"]}
            speed={90}
            eraseSpeed={45}
            typingDelay={500}
            eraseDelay={2000}
            cursorRenderer={(cursor) => <span className="text-neon-pink">{cursor}</span>}
          />
        </motion.h3>

        <motion.p {...fade(0.55)} className="mb-8 mt-6 text-lg leading-relaxed text-gray-400 sm:text-xl">
          Information Technology graduate (B.Tech, 2026) building full-stack applications with
          Java, Spring Boot and React, plus AI integrations with Spring AI and pgvector. Cloud
          engineering intern on Airtel Public Cloud, with a background in Python and machine
          learning. I like turning real problems into reliable, working software.
        </motion.p>

        {/* Buttons */}
        <motion.div {...fade(0.7)} className="flex flex-wrap justify-center gap-4 md:justify-start">
          <a
            href={RESUME}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-clip-sm bg-neon-pink px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-neon transition hover:scale-105 hover:bg-white"
          >
            Download CV
          </a>
          <button
            onClick={() => scrollToId("work")}
            className="cyber-clip-sm border border-neon-cyan px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink hover:shadow-neon-cyan"
          >
            View Projects
          </button>
        </motion.div>

        {/* HUD stats */}
        <motion.div {...fade(0.85)} className="mt-10 grid max-w-md grid-cols-3 gap-4 md:max-w-none">
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-neon-pink pl-3 text-left">
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right side: portrait with neon ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="flex justify-center md:w-[40%] md:justify-end"
      >
        <Tilt
          className="h-60 w-60 rounded-full bg-gradient-to-tr from-neon-pink via-neon-violet to-neon-cyan p-[3px] shadow-neon sm:h-72 sm:w-72 md:h-[24rem] md:w-[24rem]"
          tiltMaxAngleX={14}
          tiltMaxAngleY={14}
          perspective={1000}
          scale={1.04}
          transitionSpeed={1200}
          gyroscope={true}
        >
          <img
            src={profileImage}
            alt="Shreshtha Srivastava"
            className="h-full w-full rounded-full border-4 border-ink object-cover"
          />
        </Tilt>
      </motion.div>
    </div>
  </section>
);

export default About;