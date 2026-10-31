/* eslint-disable react/prop-types, react/display-name, react-refresh/only-export-components */

import React, { useState } from "react";
import {
  SkyBack,
  SkyFront,
  TwinkleStars,
  FarLayer,
  MidLayer,
  rng,
} from "./CitySvg";

// The room is drawn on its own 1600x900 design canvas (centered on the monitor).
export const ROOM_W = 1600;
export const ROOM_H = 900;
export const ROOM_SCREEN = { x: 480, y: 250, w: 640, h: 400 }; // monitor screen, centre = (800, 450)

const WIN_SVG = {
  width: 440,
  height: 400,
  viewBox: "400 190 800 727",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": "true",
  focusable: "false",
};
const PINK = "#ff2bd6";
const CYAN = "#00f0ff";
const HORIZON = 700; // where the back wall meets the floor

const DROPS = (() => {
  const r = rng(314);
  return Array.from({ length: 16 }, () => ({
    left: Math.round(r() * 100),
    dur: +(0.9 + r() * 0.9).toFixed(2),
    delay: +(-r() * 2).toFixed(2),
  }));
})();

// ----- floor grid in one-point perspective (plain geometry, easy to tweak) -----
const FloorGrid = () => {
  const vx = 800;
  const h = 700;
  const radial = [];
  for (let i = -14; i <= 14; i++) radial.push(`M${vx} 0L${vx + i * 190} ${h}`);
  const rows = [];
  for (let j = 1; j <= 11; j++) {
    const y = h * Math.pow(j / 11, 2.1);
    rows.push(`M-1600 ${y.toFixed(1)}H3200`);
  }
  return (
    <svg
      width="1600"
      height={h}
      viewBox={`0 0 1600 ${h}`}
      className="absolute overflow-visible"
      style={{ left: 0, top: HORIZON }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0414" stopOpacity="1" />
          <stop offset="0.25" stopColor="#0a0414" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={radial.join("")}
        stroke={PINK}
        strokeWidth="1.5"
        opacity="0.35"
        fill="none"
      />
      <path
        d={rows.join("")}
        stroke={CYAN}
        strokeWidth="1.5"
        opacity="0.28"
        fill="none"
      />
      <rect x="-1600" y="0" width="4800" height={h} fill="url(#rfade)" />
    </svg>
  );
};

const RackLeds = () => {
  const r = rng(8);
  const units = [];
  for (let u = 0; u < 9; u++) {
    const y = 344 + u * 36;
    units.push(
      <g key={u}>
        <rect
          x="1296"
          y={y}
          width="148"
          height="30"
          fill="#0e0620"
          stroke="#2a1250"
        />
        <path
          d={`M1304 ${y + 9}h56M1304 ${y + 15}h56M1304 ${y + 21}h56`}
          stroke="#241046"
          strokeWidth="2"
        />
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            cx={1396 + k * 14}
            cy={y + 15}
            r="3"
            fill={[CYAN, PINK, "#7CFF9B"][Math.floor(r() * 3)]}
            className="rack-led"
            style={{
              animationDelay: `${(r() * 1.4).toFixed(2)}s`,
              animationDuration: `${(0.8 + r() * 1.2).toFixed(2)}s`,
            }}
          />
        ))}
      </g>,
    );
  }
  return <>{units}</>;
};

const lines = [
  { t: "> whoami", c: "text-neon-cyan", d: 1.1 },
  { t: "shreshtha_srivastava", c: "text-white", d: 1.7 },
  { t: "> role --current", c: "text-neon-cyan", d: 2.3 },
  { t: "full_stack_dev // java · spring · react", c: "text-white", d: 2.9 },
  { t: "> ls ./trajectory", c: "text-neon-cyan", d: 3.6 },
  {
    t: "origin/  skills/  missions/  builds/  contact/",
    c: "text-neon-pink",
    d: 4.2,
  },
];

/**
 * @param play   start the typing animation (true once the visitor is in the room)
 * @param onMonitor  click on the monitor = zoom into the screen
 */
const RoomScene = ({ play, paused = false, onMonitor, interactive }) => {
  const [hover, setHover] = useState(false);
  const S = ROOM_SCREEN;
  return (
    <div
      className={`absolute ${play ? "room-play" : ""}`}
      style={{
        left: "50%",
        top: "50%",
        width: ROOM_W,
        height: ROOM_H,
        transform: "translate(-50%, -50%) scale(var(--room-s, 1))",
        transformOrigin: "50% 50%",
      }}
    >
      {/* wall + floor, extended far beyond the canvas so any screen shape is covered */}
      <div
        className="absolute"
        style={{
          left: -3000,
          right: -3000,
          top: -3000,
          height: 3000 + HORIZON,
          background:
            "radial-gradient(ellipse 900px 520px at 800px 3430px, rgba(0,240,255,0.16), transparent 70%), linear-gradient(to bottom, #07020f 0%, #0d0420 55%, #1a0a30 100%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -3000,
          right: -3000,
          top: HORIZON,
          height: 3000,
          background: "#0a0414",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -3000,
          right: -3000,
          top: HORIZON - 3,
          height: 3,
          background: PINK,
          opacity: 0.7,
          boxShadow: `0 0 18px ${PINK}`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: -3000,
          right: -3000,
          top: 36,
          height: 3,
          background: CYAN,
          opacity: 0.55,
          boxShadow: `0 0 18px ${CYAN}`,
        }}
      />
      <FloorGrid />

      {/* ---------- window onto the city ---------- */}
      <div
        className="absolute"
        style={{
          left: 104,
          top: 104,
          width: 452,
          height: 412,
          border: "6px solid #1a0a30",
          boxShadow: `0 0 0 2px ${CYAN}, 0 0 50px rgba(0,240,255,0.25)`,
          background: "#07020f",
          overflow: "hidden",
        }}
      >
        <svg {...WIN_SVG} className="absolute left-0 top-0">
          <SkyBack uid="rw" />
        </svg>
        <TwinkleStars {...WIN_SVG} className="absolute left-0 top-0" />
        <svg {...WIN_SVG} className="absolute left-0 top-0">
          <SkyFront uid="rw" />
          <FarLayer />
          <MidLayer />
        </svg>
        <div className="absolute inset-0 overflow-hidden">
          {DROPS.map((d, i) => (
            <span
              key={i}
              className="room-drop"
              style={{
                left: `${d.left}%`,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
              }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.05) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2"
          style={{ background: "#1a0a30" }}
        />
      </div>
      <div
        className="absolute"
        style={{
          left: 90,
          top: 520,
          width: 480,
          height: 14,
          background: "#1a0a30",
          boxShadow: `0 6px 24px rgba(255,43,214,0.35)`,
        }}
      />

      {/* ---------- neon sign + server rack ---------- */}
      <div
        className="animate-flicker absolute text-center font-display font-black"
        style={{
          left: 1090,
          top: 118,
          width: 400,
          fontSize: 54,
          letterSpacing: 6,
          color: "#ffd0f6",
          textShadow: `0 0 10px ${PINK}, 0 0 30px ${PINK}, 0 0 64px rgba(255,43,214,0.6)`,
        }}
      >
        DEV//ROOM
      </div>
      <div
        className="absolute text-center font-mono"
        style={{
          left: 1070,
          top: 192,
          width: 440,
          fontSize: 18,
          letterSpacing: 5,
          whiteSpace: "nowrap",
          color: CYAN,
          textShadow: `0 0 12px ${CYAN}`,
        }}
      >
        BUILD · SHIP · REPEAT
      </div>
      <svg
        width="1600"
        height="900"
        viewBox="0 0 1600 900"
        className="absolute left-0 top-0 overflow-visible"
        aria-hidden="true"
      >
        <rect
          x="1284"
          y="330"
          width="172"
          height="340"
          fill="#07020f"
          stroke="#3b1a66"
          strokeWidth="3"
        />
        <RackLeds />
        {/* desk lamp light cone + lamp */}
        <path d="M368 560L250 736H490z" fill={CYAN} opacity="0.07" />
        <path
          d="M340 736V620l62-62"
          stroke={PINK}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M376 536l56 22-30 40z"
          fill="#14092a"
          stroke={PINK}
          strokeWidth="3"
        />
        <rect
          x="310"
          y="728"
          width="64"
          height="10"
          rx="3"
          fill="#14092a"
          stroke={PINK}
          strokeWidth="2"
        />
      </svg>

      {/* ---------- monitor ---------- */}
      <div
        className="absolute"
        style={{
          left: S.x - 22,
          top: S.y - 22,
          width: S.w + 44,
          height: S.h + 44,
          background: "#0b0414",
          borderRadius: 18,
          border: `2px solid ${hover ? CYAN : "rgba(0,240,255,0.4)"}`,
          boxShadow: `0 0 ${hover ? 150 : 100}px ${hover ? 40 : 24}px rgba(0,240,255,${hover ? 0.38 : 0.26})`,
          transition: "box-shadow 0.3s, border-color 0.3s",
        }}
      >
        <div
          className="absolute overflow-hidden"
          style={{
            left: 22,
            top: 22,
            width: S.w,
            height: S.h,
            borderRadius: 6,
            background: "#030812",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0 1px, transparent 1px 4px)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(0,240,255,0.14), transparent 70%)",
            }}
          />
          <div
            className="relative font-mono"
            style={{ padding: "30px 34px", fontSize: 22, lineHeight: 1.6 }}
          >
            {lines.map((l) => (
              <p
                key={l.t}
                className={`room-line ${l.c}`}
                style={{ animationDelay: `${l.d}s` }}
              >
                {l.t}
              </p>
            ))}
            <p
              className="room-line text-neon-cyan"
              style={{ animationDelay: "4.8s" }}
            >
              &gt; zoom --in{" "}
              <span className="animate-blink text-neon-pink">█</span>
            </p>
          </div>
          <div
            className="absolute font-display font-bold text-neon-pink animate-flicker"
            style={{ right: 26, bottom: 18, fontSize: 22, letterSpacing: 4 }}
          >
            ZOOM IN ▸
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="Zoom into the monitor to see the portfolio"
        disabled={!interactive}
        onClick={onMonitor}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="absolute cursor-pointer outline-none"
        style={{
          left: S.x - 22,
          top: S.y - 22,
          width: S.w + 44,
          height: S.h + 44,
          background: "transparent",
          borderRadius: 18,
        }}
      />

      {/* ---------- desk ---------- */}
      <svg
        width="1600"
        height="900"
        viewBox="0 0 1600 900"
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rkeys" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={PINK} />
            <stop offset="0.5" stopColor={CYAN} />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {/* monitor stand */}
        <path
          d="M760 668h80l14 62h-108z"
          fill="#14092a"
          stroke="#3b1a66"
          strokeWidth="2"
        />
        <ellipse
          cx="800"
          cy="732"
          rx="130"
          ry="12"
          fill="#14092a"
          stroke="#3b1a66"
          strokeWidth="2"
        />
        {/* desk top + front */}
        <rect x="200" y="736" width="1200" height="32" fill="#1a0933" />
        <rect
          x="200"
          y="734"
          width="1200"
          height="4"
          fill={CYAN}
          opacity="0.9"
        />
        <rect
          x="200"
          y="734"
          width="1200"
          height="10"
          fill={CYAN}
          opacity="0.12"
        />
        <rect x="230" y="768" width="1140" height="400" fill="#0d0520" />
        <rect
          x="230"
          y="768"
          width="1140"
          height="4"
          fill={PINK}
          opacity="0.8"
        />
        <rect
          x="230"
          y="772"
          width="1140"
          height="40"
          fill={PINK}
          opacity="0.1"
        />
        {/* keyboard + mouse */}
        <rect
          x="610"
          y="742"
          width="380"
          height="14"
          rx="3"
          fill="#07020f"
          stroke="url(#rkeys)"
          strokeWidth="2"
        />
        <path
          d="M622 749h356"
          stroke="url(#rkeys)"
          strokeWidth="5"
          strokeDasharray="6 5"
          opacity="0.8"
        />
        <rect
          x="1044"
          y="742"
          width="26"
          height="14"
          rx="7"
          fill="#07020f"
          stroke={CYAN}
          strokeWidth="2"
        />
        {/* mug + steam */}
        <rect
          x="1200"
          y="698"
          width="46"
          height="38"
          rx="5"
          fill="#14092a"
          stroke={PINK}
          strokeWidth="2"
        />
        <path
          d="M1246 708q16 0 16 12t-16 12"
          stroke={PINK}
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
        {/* steam: each wisp is its own tiny <svg>, animated on the GPU */}
      {[
        ["M1214 690q-6-10 0-18", "0s"],
        ["M1230 690q-6-10 0-18", "1.2s"],
      ].map(([d, delay]) => (
        <svg
          key={d}
          className="room-steam pointer-events-none absolute overflow-visible"
          style={{ left: 1196, top: 664, animationDelay: delay }}
          width="48"
          height="32"
          viewBox="1196 664 48 32"
          aria-hidden="true"
        >
          <g
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          >
            <path d={d} />
          </g>
        </svg>
      ))}
    </div>
  );
};

export default RoomScene;
