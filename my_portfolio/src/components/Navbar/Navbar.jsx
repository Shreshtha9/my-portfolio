import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { scrollToId } from "../../lib/scrollTo";

const GITHUB = "https://github.com/Shreshtha9";
const LINKEDIN = "https://www.linkedin.com/in/shreshtha-srivastava-229927259";

const menuItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "education", label: "Education" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [isScrolled, setIsScrolled] = useState(false);

  // Navbar background after scrolling a little
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    menuItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id) => {
    setIsOpen(false);
    scrollToId(id);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-[7vw] transition duration-300 lg:px-[14vw] ${
        isScrolled
          ? "border-b border-neon-pink/30 bg-ink/70 shadow-[0_4px_30px_rgba(255,43,214,0.15)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between py-5 text-white">
        {/* Logo */}
        <button
          onClick={() => go("about")}
          className="font-display text-base font-bold tracking-wider"
        >
          <span className="text-neon-pink">&lt;</span>
          Shreshtha
          <span className="text-neon-cyan">/</span>
          <span className="text-neon-pink">&gt;</span>
        </button>

        {/* Desktop menu */}
        <ul className="hidden space-x-8 font-mono text-sm uppercase tracking-widest md:flex">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => go(item.id)}
                className={`transition hover:text-neon-pink hover:text-glow ${
                  activeSection === item.id ? "text-neon-pink text-glow" : "text-gray-300"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Social icons */}
        <div className="hidden space-x-4 md:flex">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
             className="text-gray-300 transition hover:text-neon-cyan">
            <FaGithub size={24} />
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
             className="text-gray-300 transition hover:text-neon-cyan">
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          {isOpen ? (
            <FiX className="cursor-pointer text-3xl text-neon-pink" onClick={() => setIsOpen(false)} />
          ) : (
            <FiMenu className="cursor-pointer text-3xl text-neon-pink" onClick={() => setIsOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute left-1/2 top-16 z-50 w-4/5 -translate-x-1/2 border border-neon-pink/40 bg-ink/90 shadow-neon backdrop-blur-lg md:hidden">
          <ul className="flex flex-col items-center space-y-4 py-5 font-mono uppercase tracking-widest text-gray-300">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={activeSection === item.id ? "text-neon-pink" : "hover:text-white"}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <div className="flex space-x-5 pt-2">
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub size={24} /></a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin size={24} /></a>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;