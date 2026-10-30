// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05010a",
        panel: "#0d0618",
        neon: {
          pink: "#ff2bd6",
          cyan: "#00f0ff",
          violet: "#7c3aed",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
        mono: ['"Share Tech Mono"', "monospace"],
      },
      keyframes: {
        blob: {
          "0%": { transform: "scale(1)" },
          "33%": { transform: "scale(1.2)" },
          "66%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.35" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blob: "blob 10s infinite",
        flicker: "flicker 5s linear infinite",
        blink: "blink 1s steps(1) infinite",
      },
      boxShadow: {
        neon: "0 0 8px #ff2bd6, 0 0 24px rgba(255,43,214,0.45)",
        "neon-sm": "0 0 6px rgba(255,43,214,0.8)",
        "neon-cyan": "0 0 8px #00f0ff, 0 0 24px rgba(0,240,255,0.4)",
      },
    },
  },
  plugins: [],
};