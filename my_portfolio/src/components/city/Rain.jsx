import React from "react";
import { rng } from "./CitySvg";

const DROPS = (() => {
  const r = rng(99);
  return Array.from({ length: 70 }, () => ({
    left: +(r() * 120 - 10).toFixed(1),
    len: Math.round(40 + r() * 60),
    o: +(0.15 + r() * 0.25).toFixed(2),
    dur: +(0.6 + r() * 0.5).toFixed(2),
    delay: +(-r() * 1.6).toFixed(2),
  }));
})();

// Screen-space rain. Pure CSS animation, no JS loop.
const Rain = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {DROPS.map((d, i) => (
      <span
        key={i}
        className="rain-drop"
        style={{
          left: `${d.left}%`,
          height: d.len,
          opacity: d.o,
          animationDuration: `${d.dur}s`,
          animationDelay: `${d.delay}s`,
        }}
      />
    ))}
  </div>
);

export default Rain;
