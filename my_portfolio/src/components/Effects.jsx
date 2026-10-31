import React, { useEffect } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";

// Neon progress bar at the very top that fills as you scroll
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100] bg-gradient-to-r from-neon-pink via-neon-violet to-neon-cyan shadow-neon"
    />
  );
};

// Film grain + scanlines + vignette (see index.css)
export const Overlays = () => (
  <>
    <div className="grain" aria-hidden="true" />
   <div className="fx-overlay" aria-hidden="true" />
    
  </>
);

// Soft pink light that follows the mouse (hidden on touch devices)
export const CursorGlow = () => {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX - 250);
      y.set(e.clientY - 250);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="cursor-glow pointer-events-none fixed top-0 left-0 z-[1] h-[900px] w-[900px] [@media(pointer:coarse)]:hidden"
    />
  );
};