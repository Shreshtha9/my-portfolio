import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { scrollToId } from "../../lib/scrollTo";

const GITHUB = "https://github.com/Shreshtha9";
const LINKEDIN = "https://www.linkedin.com/in/shreshtha-srivastava-229927259";
const RESUME =
  "https://drive.google.com/file/d/1mwF4xkEkb1rvuIfzBBHpe2WwCX_xnfqP/view?usp=drive_link";

const links = [
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Experience", id: "experience" },
  { name: "Projects", id: "work" },
  { name: "Education", id: "education" },
];

// Styled like the end credits of a film
const Footer = () => (
  <footer className="relative px-[7vw] pb-10 pt-24 text-center lg:px-[14vw]">
    <div className="mx-auto mb-16 h-[2px] w-full max-w-3xl bg-gradient-to-r from-transparent via-neon-pink to-transparent shadow-neon" />

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="font-mono text-sm tracking-[0.4em] text-neon-cyan">{"// END OF TRANSMISSION"}</p>
      <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight text-white sm:text-5xl">
        Let&apos;s build something <span className="text-neon-pink text-glow animate-flicker">electric</span>
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-clip-sm bg-neon-pink px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-neon transition hover:scale-105 hover:bg-white"
        >
          Connect on LinkedIn
        </a>
        <a
          href={RESUME}
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-clip-sm border border-neon-cyan px-8 py-3 font-display text-sm font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink"
        >
          Resume
        </a>
      </div>
    </motion.div>

    <nav className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-widest">
      {links.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToId(item.id)}
          className="text-gray-400 transition hover:text-neon-pink"
        >
          {item.name}
        </button>
      ))}
    </nav>

    <div className="mt-6 flex justify-center gap-6 text-2xl">
      <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
         className="text-gray-300 transition hover:scale-110 hover:text-neon-cyan">
        <FaGithub />
      </a>
      <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
         className="text-gray-300 transition hover:scale-110 hover:text-neon-cyan">
        <FaLinkedin />
      </a>
    </div>

    <p className="mt-8 font-mono text-xs uppercase tracking-widest text-gray-500">
      © 2026 Shreshtha Srivastava. All rights reserved.
    </p>
  </footer>
);

export default Footer;