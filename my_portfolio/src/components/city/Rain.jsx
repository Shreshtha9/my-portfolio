/* eslint-disable react/prop-types, react/display-name, react-refresh/only-export-components */
import React, { useMemo, useState, useEffect } from "react";
import { rng } from "./CitySvg";

// Screen-space rain. Pure CSS animation, no JS loop.
const Rain = React.memo(() => {
  // Flag to ensure random values only generate on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generates the identical data structure as before, safely inside the component lifecycle
  const drops = useMemo(() => {
    if (!isClient) return [];
    
    const r = rng(99);
    return Array.from({ length: 70 }, () => ({
      left: +(r() * 120 - 10).toFixed(1),
      len: Math.round(40 + r() * 60),
      o: +(0.15 + r() * 0.25).toFixed(2),
      dur: +(0.6 + r() * 0.5).toFixed(2),
      delay: +(-r() * 1.6).toFixed(2),
    }));
  }, [isClient]);

  // Returns nothing during server rendering to prevent DOM mismatch errors
  if (!isClient) return null;

  return (
    <>
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((d, i) => (
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
    </>
  );
});

export default Rain;
