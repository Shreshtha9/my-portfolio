import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Work from "./components/Work/Work";
import Education from "./components/Education/Education";
import Footer from "./components/Footer/Footer";
import BlurBlob from "./components/BlurBlob";
import BootIntro from "./components/BootIntro";
import CityExperience from "./components/city/CityExperience";
import { ScrollProgress, Overlays, CursorGlow } from "./components/Effects";

const App = () => {
  // "city"    = cyber city -> room -> zoom journey (no scrolling)
  // "classic" = the original scrolling portfolio
  const [view, setView] = useState("city");

  // The city experience never scrolls the page; the classic view does.
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = view === "classic" ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [view]);

  // Smooth, weighty scrolling (classic view only, skipped for users who prefer reduced motion)
  useEffect(() => {
    if (view !== "classic") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2 });
    window.__lenis = lenis;
    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [view]);

  const openClassic = () => {
    window.scrollTo(0, 0);
    setView("classic");
  };
  const openCity = () => {
    window.scrollTo(0, 0);
    setView("city");
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink">
      <BootIntro />
      <Overlays />
      <CursorGlow />

      {view === "city" ? (
        <CityExperience onClassic={openClassic} />
      ) : (
        <>
          <ScrollProgress />

          {/* Neon grid that fades out towards the bottom of the first screen */}
          <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,43,214,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,43,214,0.10)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />

          <BlurBlob position={{ top: "30%", left: "15%" }} size={{ width: "30%", height: "35%" }} />
          <BlurBlob
            position={{ top: "55%", left: "85%" }}
            size={{ width: "25%", height: "30%" }}
            color="bg-neon-cyan"
          />

          <div className="relative z-10 pt-20">
            <Navbar />
            <About />
            <Skills />
            <Experience />
            <Work />
            <Education />
            <Footer />
          </div>

          <button
            type="button"
            onClick={openCity}
            className="cyber-clip-sm fixed bottom-5 left-5 z-[60] border border-neon-pink/60 bg-ink/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-neon-pink backdrop-blur transition hover:bg-neon-pink hover:text-ink"
          >
            ◂ City mode
          </button>
        </>
      )}
    </div>
  );
};

export default App;
