import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "> BOOTING PORTFOLIO_OS v2.0",
  "> LOADING NEURAL INTERFACE ........ OK",
  "> MOUNTING PROJECTS ............... OK",
  "> SYNCING SKILL DATABASE .......... OK",
  "> ACCESS GRANTED",
];

// Film-style opening sequence. Plays once per browser session.
const BootIntro = () => {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem("boot-done");
    } catch {
      return true;
    }
  });
  const [step, setStep] = useState(0);

  const finish = () => {
    try {
      sessionStorage.setItem("boot-done", "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    window.__lenis?.stop();
    const timer = setInterval(() => setStep((s) => s + 1), 450);
    return () => {
      clearInterval(timer);
      window.__lenis?.start();
    };
  }, [visible]);

  useEffect(() => {
    if (step > LINES.length + 1) finish();
  }, [step]);

  const progress = Math.min(100, (step / (LINES.length + 1)) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          onClick={finish}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-ink px-6"
        >
          <button
            onClick={finish}
            className="absolute right-6 top-6 font-mono text-sm tracking-widest text-neon-cyan hover:text-neon-pink"
          >
            SKIP ▸
          </button>

          <div className="w-full max-w-xl font-mono text-sm text-neon-cyan sm:text-base">
            {LINES.slice(0, step).map((line, i) => (
              <p
                key={line}
                className={i === LINES.length - 1 ? "text-neon-pink text-glow" : ""}
              >
                {line}
              </p>
            ))}
            <span className="inline-block h-4 w-2 animate-blink bg-neon-pink align-middle" />

            <div className="mt-6 h-[3px] w-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan shadow-neon transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {step >= LINES.length && (
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center font-display text-3xl font-black tracking-widest text-white text-glow sm:text-5xl"
            >
              SHRESHTHA SRIVASTAVA
            </motion.h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootIntro;