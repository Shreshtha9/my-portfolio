import React from "react";
import ReactTypingEffect from "react-typing-effect";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import profileImage from "../../assets/profile.png";
import { SkillsInfo, experience, education, projects, profile } from "../../constants";
import CyberCard from "../CyberCard";

// ---------------------------------------------------------------------------
// The trajectory, in the order the visitor flies through it.
// To reorder or remove a stage, just edit the STAGES array at the bottom.
// Each stage receives `api` = { next, prev, goTo, toCity, classic }.
// ---------------------------------------------------------------------------

const Head = ({ kicker, title, sub }) => (
  <div className="mb-5 sm:mb-6">
    <p className="font-mono text-xs tracking-[0.3em] text-neon-cyan sm:text-sm">
      {"// "}
      {kicker}
    </p>
    <h2 className="mt-1 font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
      {title}
      <span className="animate-blink text-neon-pink">_</span>
    </h2>
    <div className="mt-3 h-[2px] w-32 bg-gradient-to-r from-neon-pink to-transparent shadow-neon" />
    {sub && <p className="mt-3 max-w-2xl text-lg text-gray-400">{sub}</p>}
  </div>
);

const Tag = ({ children }) => (
  <span className="border border-neon-cyan/40 px-2 py-1 font-mono text-xs uppercase tracking-wider text-neon-cyan">
    {children}
  </span>
);

const hasLink = (url) => Boolean(url) && url !== "#";

// ---------- 0. Hello ----------
const stats = [
  { value: "8.54", label: "CGPA" },
  { value: "6 MO", label: "Cloud internship" },
  { value: String(projects.length), label: "Projects" },
];

const StageAbout = ({ api }) => (
  <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
    <div className="text-center md:text-left">
      <p className="mb-3 font-mono text-xs tracking-[0.3em] text-neon-cyan sm:text-sm">
        {"// SYSTEM ONLINE — HELLO, WORLD"}
      </p>
      <h1 className="font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
        <span className="glitch block" data-text="Shreshtha">Shreshtha</span>
        <span className="glitch block text-neon-pink text-glow" data-text="Srivastava">Srivastava</span>
      </h1>
      <h3 className="mt-4 font-mono text-lg text-gray-200 sm:text-xl md:text-2xl">
        <span className="text-neon-cyan">&gt; </span>
        <ReactTypingEffect
          text={profile.roles}
          speed={90}
          eraseSpeed={45}
          typingDelay={500}
          eraseDelay={2000}
          cursorRenderer={(cursor) => <span className="text-neon-pink">{cursor}</span>}
        />
      </h3>
      <p className="mb-6 mt-4 text-lg leading-relaxed text-gray-400 sm:text-xl">{profile.bio}</p>

      <div className="flex flex-wrap justify-center gap-4 md:justify-start">
        <button
          onClick={api.next}
          className="cyber-clip-sm bg-neon-pink px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-neon transition hover:scale-105 hover:bg-white"
        >
          Begin trajectory ▸
        </button>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-clip-sm border border-neon-cyan px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink hover:shadow-neon-cyan"
        >
          Download CV
        </a>
      </div>

      <div className="mt-7 grid max-w-md grid-cols-3 gap-4 md:max-w-none">
        {stats.map((s) => (
          <div key={s.label} className="border-l-2 border-neon-pink pl-3 text-left">
            <p className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="flex justify-center md:justify-end">
      <div className="h-52 w-52 rounded-full bg-gradient-to-tr from-neon-pink via-neon-violet to-neon-cyan p-[3px] shadow-neon sm:h-64 sm:w-64 md:h-[min(40vh,22rem)] md:w-[min(40vh,22rem)]">
        <img
          src={profileImage}
          alt="Shreshtha Srivastava"
          className="h-full w-full rounded-full border-4 border-ink object-cover"
        />
      </div>
    </div>
  </div>
);

// ---------- 1. Origin (education, oldest first) ----------
const StageEducation = () => {
  const timeline = [...education].reverse();
  return (
    <div>
      <Head kicker="01 — ORIGIN STORY" title="Education" sub="Where the trajectory starts." />
      <div className="mb-5 h-[2px] bg-gradient-to-r from-neon-pink via-neon-violet to-neon-cyan shadow-neon" />
      <div className="grid gap-4 md:grid-cols-3">
        {timeline.map((edu) => (
          <CyberCard key={edu.id} className="h-full" innerClassName="p-5">
            <div className="flex items-center gap-3">
              <img src={edu.img} alt={edu.school} className="h-11 w-11 rounded-full border-2 border-neon-pink bg-white object-cover" />
              <p className="font-mono text-xs uppercase tracking-widest text-neon-pink">{edu.date}</p>
            </div>
            <h3 className="mt-3 font-display text-sm font-bold uppercase text-white">{edu.degree}</h3>
            <h4 className="mt-1 text-lg text-neon-cyan">{edu.school}</h4>
            <p className="mt-2 font-display text-xs font-bold uppercase tracking-widest text-neon-pink text-glow">
              Grade: {edu.grade}
            </p>
            <p className="mt-2 text-base leading-snug text-gray-300">{edu.desc}</p>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};

// ---------- 2. Skills ----------
const StageSkills = () => (
  <div>
    <Head kicker="02 — ABILITIES" title="Skills" sub="The tech stack I use to design, build and ship." />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SkillsInfo.map((category) => (
        <CyberCard key={category.title} className="h-full" innerClassName="p-4">
          <h3 className="mb-3 font-display text-base font-bold uppercase tracking-widest text-neon-pink text-glow">
            {category.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <div
                key={skill.name}
                className="cyber-clip-sm flex items-center gap-2 border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:border-neon-pink hover:bg-neon-pink/10"
              >
                {skill.icon ? (
                  <skill.icon className="h-5 w-5 text-neon-cyan" />
                ) : (
                  <img
                    src={skill.logo}
                    alt=""
                    className={`h-5 w-5 object-contain ${skill.light ? "rounded-sm bg-white p-0.5" : ""}`}
                  />
                )}
                <span className="text-base font-semibold text-white">{skill.name}</span>
              </div>
            ))}
          </div>
        </CyberCard>
      ))}
    </div>
  </div>
);

// ---------- 3. Missions (experience, oldest first) ----------
const StageExperience = () => {
  const jobs = [...experience].reverse();
  return (
    <div>
      <Head kicker="03 — MISSION LOG" title="Experience" sub="Where I have worked on real systems." />
      <div className="grid gap-5 md:grid-cols-2">
        {jobs.map((job, i) => (
          <CyberCard key={job.id} className="h-full" innerClassName="p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">
              MISSION {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-white">{job.role}</h3>
            <p className="text-lg text-neon-cyan">{job.company}</p>
            <p className="mt-1 font-mono text-sm uppercase tracking-widest text-neon-pink">{job.date}</p>
            <ul className="mt-4 space-y-2 text-base text-gray-300 sm:text-lg">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-[2px] font-mono text-neon-pink">&gt;</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};

// ---------- 4. Builds (projects) ----------
const ProjectArt = ({ id }) => (
  <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-neon-violet/40 via-ink to-neon-pink/30 sm:h-[min(18vh,9rem)]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px]" />
    <span className="relative font-display text-2xl font-black tracking-widest text-white text-glow">
      PROJECT_{String(id + 1).padStart(2, "0")}
    </span>
  </div>
);

const StageProjects = () => (
  <div>
    <Head kicker="04 — EPISODES" title="Projects" sub="My main builds." />
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((p) => (
        <CyberCard key={p.id} className="h-full" innerClassName="flex flex-col p-3">
          {p.image ? (
            <img src={p.image} alt={p.title} className="h-32 w-full object-cover sm:h-[min(18vh,9rem)]" />
          ) : (
            <ProjectArt id={p.id} />
          )}
          <div className="flex flex-1 flex-col p-3 pt-4">
            <h3 className="font-display text-lg font-bold uppercase leading-snug text-white">{p.title}</h3>
            <p className="mb-4 mt-2 text-base text-gray-300 sm:text-lg">{p.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              {hasLink(p.github) && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-clip-sm flex-1 border border-neon-cyan px-4 py-2 text-center font-display text-xs font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink"
                >
                  View Code
                </a>
              )}
              {hasLink(p.webapp) && (
                <a
                  href={p.webapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-clip-sm flex-1 bg-neon-pink px-4 py-2 text-center font-display text-xs font-bold uppercase tracking-widest text-ink shadow-neon transition hover:bg-white"
                >
                  View Live
                </a>
              )}
              {!hasLink(p.github) && !hasLink(p.webapp) && (
                <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Links coming soon</p>
              )}
            </div>
          </div>
        </CyberCard>
      ))}
    </div>
    <div className="mt-5 text-center">
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm uppercase tracking-widest text-neon-cyan transition hover:text-neon-pink hover:text-glow"
      >
        More on GitHub →
      </a>
    </div>
  </div>
);

// ---------- 5. Contact ----------
const StageContact = ({ api }) => (
  <div className="text-center">
    <p className="font-mono text-sm tracking-[0.4em] text-neon-cyan">{"// END OF TRANSMISSION"}</p>
    <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight text-white sm:text-5xl">
      Let&apos;s build something <span className="animate-flicker text-neon-pink text-glow">electric</span>
    </h2>

    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-clip-sm flex items-center gap-2 bg-neon-pink px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-neon transition hover:scale-105 hover:bg-white"
      >
        <FaLinkedin /> LinkedIn
      </a>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-clip-sm flex items-center gap-2 border border-neon-cyan px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink"
      >
        <FaGithub /> GitHub
      </a>
      <a
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-clip-sm border border-neon-cyan px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-neon-cyan transition hover:bg-neon-cyan hover:text-ink"
      >
        Resume
      </a>
    </div>

    <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-widest">
      <button onClick={() => api.goTo(0)} className="text-gray-400 transition hover:text-neon-pink">
        ↺ Replay trajectory
      </button>
      <button onClick={api.toCity} className="text-gray-400 transition hover:text-neon-pink">
        ◂ Back to the city
      </button>
      <button onClick={api.classic} className="text-gray-400 transition hover:text-neon-pink">
        Classic view ▸
      </button>
    </div>
    <p className="mt-8 font-mono text-xs uppercase tracking-widest text-gray-500">
      © 2026 {profile.name}. All rights reserved.
    </p>
  </div>
);

const STAGES = [
  { id: "hello", label: "Hello", Component: StageAbout },
  { id: "origin", label: "Origin", Component: StageEducation },
  { id: "skills", label: "Skills", Component: StageSkills },
  { id: "missions", label: "Missions", Component: StageExperience },
  { id: "builds", label: "Builds", Component: StageProjects },
  { id: "contact", label: "Contact", Component: StageContact },
];

export default STAGES;
