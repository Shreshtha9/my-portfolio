import React from "react";

// Soft glowing blob used as background decoration
const BlurBlob = ({ position, size, color = "bg-neon-pink" }) => (
  <div
    className="pointer-events-none absolute"
    style={{
      top: position.top,
      left: position.left,
      width: size.width,
      height: size.height,
      transform: "translate(-50%, -50%)",
    }}
  >
    <div className={`h-full w-full animate-blob rounded-full opacity-20 blur-3xl ${color}`} />
  </div>
);

export default BlurBlob;