import React from "react";
const RGB = { "bg-neon-pink": "255,43,214", "bg-neon-cyan": "0,240,255", "bg-neon-violet": "124,58,237" };
const BlurBlob = ({ position, size, color = "bg-neon-pink" }) => {
  const rgb = RGB[color] || RGB["bg-neon-pink"];
  return (
    <div className="pointer-events-none absolute" style={{ top: position.top, left: position.left, width: size.width, height: size.height, transform: "translate(-50%, -50%)" }}>
      <div className="h-full w-full animate-blob rounded-full"
        style={{ background: `radial-gradient(closest-side, rgba(${rgb},0.2) 0%, rgba(${rgb},0.2) 62%, rgba(${rgb},0) 100%)` }} />
    </div>
  );
};
export default BlurBlob;