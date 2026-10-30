import React from "react";

// Panel with angled corners and a thin neon gradient border
const CyberCard = ({ children, className = "", innerClassName = "" }) => (
  <div
    className={`cyber-clip bg-gradient-to-br from-neon-pink/80 via-neon-violet/30 to-neon-cyan/70 p-[1px] ${className}`}
  >
    <div className={`cyber-clip h-full bg-panel ${innerClassName}`}>{children}</div>
  </div>
);

export default CyberCard;