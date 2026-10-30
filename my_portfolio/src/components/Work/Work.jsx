import React, { useState, useEffect } from "react";
import { projects } from "../../constants";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../SectionTitle";
import CyberCard from "../CyberCard";

const hasLink = (url) => Boolean(url) && url !== "#";

// Neon placeholder used when a project has no screenshot yet
const ProjectArt = ({ id, className = "" }) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neon-violet/40 via-ink to-neon-pink/30 ${className}`}
  >
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px]" />
    <span className="relative font-display text-2xl font-black tracking-widest text-white text-glow">
      PROJECT_{String(id + 1).padStart(2, "0")}
    </span>
  </div>
);

const Work = () => {
  const [selected, setSelected] = useState(null);

  // Close the modal with the Escape key
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section id="work" className="relative px-[7vw] py-24 lg:px-[14vw]">
      <SectionTitle
        index="03 — EPISODES"
        title="Projects"
        subtitle="My main builds. Click a card to open the case file."
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (index % 2) * 0.15 }}
            whileHover={{ y: -8 }}
            onClick={() => setSelected(project)}
            className="group cursor-pointer"
          >
            <CyberCard
              className="h-full transition-shadow duration-300 group-hover:shadow-neon"
              innerClassName="flex flex-col"
            >
              <div className="p-3">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-48 w-full object-cover opacity-90 transition group-hover:opacity-100"
                  />
                ) : (
                  <ProjectArt id={project.id} className="h-48 w-full" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 pt-3">
                <h3 className="font-display text-lg font-bold uppercase leading-snug text-white group-hover:text-neon-pink">
                  {project.title}
                </h3>
                <p className="mb-4 mt-3 line-clamp-3 text-lg text-gray-400">{project.description}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="border border-neon-cyan/40 px-2 py-1 font-mono text-xs uppercase tracking-wider text-neon-cyan"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CyberCard>
          </motion.div>
        ))}
      </div>

      {/* Link to the rest of the work */}
      <div className="mt-12 text-center">
        <a
          href="https://github.com/Shreshtha9"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm uppercase tracking-widest text-neon-cyan transition hover:text-neon-pink hover:text-glow"
        >
          More on GitHub →
        </a>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto"
            >
              <CyberCard className="shadow-neon" innerClassName="relative">
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="absolute right-5 top-3 z-10 font-mono text-3xl text-white transition hover:text-neon-pink"
                >
                  &times;
                </button>

                <div className="p-4 pt-12">
                  {selected.image ? (
                    <img src={selected.image} alt={selected.title} className="w-full object-contain" />
                  ) : (
                    <ProjectArt id={selected.id} className="h-56 w-full" />
                  )}
                </div>

                <div className="p-6 pt-2 lg:p-8 lg:pt-2">
                  <h3 className="mb-4 font-display text-xl font-bold uppercase text-white lg:text-3xl">
                    {selected.title}
                  </h3>
                  <p className="mb-6 text-lg text-gray-300">{selected.description}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-neon-cyan/40 px-2 py-1 font-mono text-xs uppercase tracking-wider text-neon-cyan"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {hasLink(selected.github) && (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-clip-sm flex-1 border border-neon-cyan px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink"
                      >
                        View Code
                      </a>
                    )}
                    {hasLink(selected.webapp) && (
                      <a
                        href={selected.webapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cyber-clip-sm flex-1 bg-neon-pink px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-widest text-ink shadow-neon transition hover:bg-white"
                      >
                        View Live
                      </a>
                    )}
                    {!hasLink(selected.github) && !hasLink(selected.webapp) && (
                      <p className="font-mono text-sm uppercase tracking-widest text-gray-500">
                        Links coming soon
                      </p>
                    )}
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Work;