/* eslint-disable react/prop-types, react/display-name, react-refresh/only-export-components */

import React from "react";

// The whole city is drawn on a fixed 1600x900 "design canvas".
// CityExperience scales/pans this canvas like a camera.
export const W = 1600;
export const H = 900;

// The tall hero building in the middle, and the glowing room window you click.
export const HERO = { x: 700, w: 200, top: 214 };
export const ROOM_WIN = { x: 740, y: 440, w: 120, h: 68 };
export const ROOM_CENTER = { x: ROOM_WIN.x + ROOM_WIN.w / 2, y: ROOM_WIN.y + ROOM_WIN.h / 2 };

const PINK = "#ff2bd6";
const CYAN = "#00f0ff";
const AMBER = "#ffb347";

// ---------- tiny seeded random so the city looks the same every visit ----------
export function rng(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rect = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}z`;

// ---------- skyline generator ----------
// Everything is merged into a handful of <path> strings, so the DOM stays tiny.
function skyline(o) {
  const {
    seed, from, to, wMin, wMax, topMin, topMax, lit, colors,
    cell = [14, 20], maxWinY = 860, tiers = 0.3, antenna = 0.15, rim = 0.4,
    signs = 0, signTexts = [], panes = false,
  } = o;
  const r = rng(seed);
  // bodies[] = 3 slightly different tones, dark = unlit window panes
  const out = { bodies: ["", "", ""], dark: "", wins: {}, rimPink: "", rimCyan: "", antennas: "", beacons: [], signs: [] };
  let x = from;
  while (x < to) {
    const w = Math.max(24, Math.min(Math.round(wMin + r() * (wMax - wMin)), to - x));
    const top = Math.round(topMin + r() * (topMax - topMin));

    // tone comes from a hash of x, NOT from r(), so the skyline layout stays exactly the same
    const tone = (Math.imul(x + 31, 2654435761) >>> 0) % 3;
    out.bodies[tone] += rect(x, top, w, H - top + 20);

    if (r() < tiers) {
      const tw = Math.round(w * (0.4 + r() * 0.35));
      const th = 12 + Math.round(r() * 30);
      const tx = x + Math.round((w - tw) * r());
      out.bodies[tone] += rect(tx, top - th, tw, th);
    }

    const [cw, ch] = cell;
    const cols = Math.max(1, Math.floor((w - 12) / cw));
    const ox = x + Math.round((w - cols * cw) / 2);
    for (let y = top + 12; y < maxWinY; y += ch + 8) {
      for (let c = 0; c < cols; c++) {
        if (r() < lit) {
          const col = colors[Math.floor(r() * colors.length)];
          out.wins[col] = (out.wins[col] || "") + rect(ox + c * cw + 2, y, cw - 5, ch - 4);
        } else if (panes) {
          out.dark += rect(ox + c * cw + 2, y, cw - 5, ch - 4);
        }
      }
    }

    if (r() < rim) {
      const key = r() < 0.5 ? "rimPink" : "rimCyan";
      const side = r() < 0.5 ? x : x + w;
      out[key] += `M${x} ${top}h${w}M${side} ${top}V${H}`;
    }
    if (r() < antenna) {
      const ax = x + Math.round(w / 2);
      const ah = 18 + Math.round(r() * 34);
      out.antennas += `M${ax} ${top}V${top - ah}`;
      out.beacons.push({ x: ax, y: top - ah, d: +(r() * 2).toFixed(2) });
    }
    if (signs && r() < signs && w > 70) {
      out.signs.push({
        x: x + 8,
        y: top + 18 + Math.round(r() * 30),
        w: w - 16,
        text: signTexts[Math.floor(r() * signTexts.length)],
        color: r() < 0.5 ? PINK : CYAN,
      });
    }
    x += w + Math.round(r() * 3);
  }
  return out;
}

const merge = (a, b) => {
  const wins = { ...a.wins };
  Object.entries(b.wins).forEach(([k, v]) => (wins[k] = (wins[k] || "") + v));
  return {
    bodies: a.bodies.map((d, i) => d + b.bodies[i]),
    dark: a.dark + b.dark,
    wins,
    rimPink: a.rimPink + b.rimPink,
    rimCyan: a.rimCyan + b.rimCyan,
    antennas: a.antennas + b.antennas,
    beacons: [...a.beacons, ...b.beacons],
    signs: [...a.signs, ...b.signs],
  };
};

const FAR = skyline({
  seed: 11, from: -80, to: 1700, wMin: 28, wMax: 62, topMin: 400, topMax: 610,
  lit: 0.1, colors: ["#7c3aed", "#a78bfa", "#6d28d9"], cell: [12, 16], maxWinY: 720,
  tiers: 0.3, antenna: 0.16, rim: 0,
});

const MID = skyline({
  seed: 23, from: -80, to: 1700, wMin: 46, wMax: 94, topMin: 330, topMax: 560,
  lit: 0.2, colors: [PINK, CYAN, "#9d6bff"], cell: [13, 18], maxWinY: 800,
  tiers: 0.4, antenna: 0.2, rim: 0.55,
});

const SIGN_TEXTS = ["RAMEN", "NEON", "24H", "CYBER", "DEV", "BYTE", "OPEN", "SYNTH"];
const NEAR = merge(
  skyline({
    seed: 37, from: -100, to: HERO.x - 3, wMin: 70, wMax: 130, topMin: 360, topMax: 620,
    lit: 0.3, colors: [PINK, PINK, CYAN, CYAN, AMBER, "#c9a7ff"], maxWinY: 870,
    tiers: 0.45, antenna: 0.25, rim: 0.8, signs: 0.5, signTexts: SIGN_TEXTS, panes: true,
  }),
  skyline({
    seed: 41, from: HERO.x + HERO.w + 3, to: 1720, wMin: 70, wMax: 130, topMin: 360, topMax: 620,
    lit: 0.3, colors: [PINK, CYAN, CYAN, AMBER, AMBER, "#c9a7ff"], maxWinY: 870,
    tiers: 0.45, antenna: 0.25, rim: 0.8, signs: 0.5, signTexts: SIGN_TEXTS, panes: true,
  })
);

const STARS = (() => {
  const r = rng(5);
  return Array.from({ length: 90 }, () => ({
    x: Math.round(r() * 1700 - 50),
    y: Math.round(r() * 520),
    r: +(0.5 + r() * 1.1).toFixed(2),
    o: +(0.3 + r() * 0.7).toFixed(2),
    tw: r() < 0.3,
    d: +(r() * 4).toFixed(2),
  }));
})();

// ---------- layers ----------
const Skyline = ({ data, tones, winOpacity = 0.9, rimOpacity = 0.6, antennaColor = "#3b1a66", signs = false, paneFill }) => (
  <g>
    {data.bodies.map((d, i) => d && <path key={i} d={d} fill={tones[i]} />)}
    {paneFill && data.dark && <path d={data.dark} fill={paneFill} opacity="0.1" />}
    {Object.entries(data.wins).map(([c, d]) => (
      <path key={c} d={d} fill={c} opacity={winOpacity} />
    ))}
    {data.rimPink && <path d={data.rimPink} fill="none" stroke={PINK} strokeWidth="1.5" opacity={rimOpacity} />}
    {data.rimCyan && <path d={data.rimCyan} fill="none" stroke={CYAN} strokeWidth="1.5" opacity={rimOpacity} />}
    {data.antennas && <path d={data.antennas} fill="none" stroke={antennaColor} strokeWidth="2" />}
    {data.beacons.map((b, i) => (
      <circle key={i} cx={b.x} cy={b.y} r="2.2" fill="#ff3355" className="city-blink" style={{ animationDelay: `${b.d}s` }} />
    ))}
    {signs &&
      data.signs.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={s.w} height="15" fill="#05010a" stroke={s.color} strokeWidth="1" />
          <rect x={s.x - 2} y={s.y - 2} width={s.w + 4} height="19" fill="none" stroke={s.color} strokeWidth="4" opacity="0.18" />
          <text
            x={s.x + s.w / 2}
            y={s.y + 11}
            textAnchor="middle"
            fontSize="10"
            fill={s.color}
            fontFamily="'Share Tech Mono', monospace"
            letterSpacing="2"
          >
            {s.text}
          </text>
        </g>
      ))}
  </g>
);

// ---------------------------------------------------------------------------
//  SKY  (split in 3 stacked layers so twinkling never repaints the skyline)
//    SkyBack  : gradient + steady stars         (static)
//    Twinkle  : twinkling stars                 (each group = its own GPU layer)
//    SkyFront : pink glow + striped sun         (static)
//  `uid` keeps gradient ids unique when the sky is reused (room window).
// ---------------------------------------------------------------------------
export const SkyBack = ({ uid }) => (
  <g>
    <defs>
      <linearGradient id={`${uid}sky`} gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="900">
        <stop offset="0" stopColor="#03000a" />
        <stop offset="0.45" stopColor="#10052a" />
        <stop offset="0.75" stopColor="#3a0b63" />
        <stop offset="1" stopColor="#8a1596" />
      </linearGradient>
    </defs>
    <rect x="-1500" y="-1200" width="4600" height="3200" fill={`url(#${uid}sky)`} />
    {STARS.filter((s) => !s.tw).map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
    ))}
  </g>
);

export const SkyFront = ({ uid }) => (
  <g>
    <defs>
      <radialGradient id={`${uid}glow`}>
        <stop offset="0" stopColor={PINK} stopOpacity="0.34" />
        <stop offset="1" stopColor={PINK} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}sun`} gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="570">
        <stop offset="0" stopColor="#ffb3ee" />
        <stop offset="0.5" stopColor={PINK} />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      {/* a clipPath of plain rectangles is much cheaper than a <mask> (no off-screen buffer) */}
      <clipPath id={`${uid}sunclip`}>
        <rect x="400" y="100" width="800" height="320" />
        <rect x="400" y="423" width="800" height="23" />
        <rect x="400" y="451" width="800" height="21" />
        <rect x="400" y="479" width="800" height="21" />
        <rect x="400" y="509" width="800" height="21" />
        <rect x="400" y="541" width="800" height="21" />
        <rect x="400" y="575" width="800" height="125" />
      </clipPath>
    </defs>
    <circle cx="800" cy="360" r="430" fill={`url(#${uid}glow)`} />
    <circle cx="800" cy="360" r="210" fill={`url(#${uid}sun)`} clipPath={`url(#${uid}sunclip)`} />
  </g>
);

// Twinkling stars. The CSS animation runs on the <svg> ELEMENT (a normal box), so it is
// done on the GPU. Animating a <circle> *inside* a big SVG repaints the whole SVG every frame.
const TWINKLE = (() => {
  const G = 6;
  const groups = Array.from({ length: G }, (_, i) => ({ delay: +((i * 4) / G).toFixed(2), stars: [] }));
  STARS.forEach((s) => {
    if (s.tw) groups[Math.min(G - 1, Math.floor((s.d / 4) * G))].stars.push(s);
  });
  return groups.filter((g) => g.stars.length);
})();

export const TwinkleStars = ({ className = "", ...svgProps }) => (
  <>
    {TWINKLE.map((g, i) => (
      <svg key={i} {...svgProps} className={`city-twinkle-layer ${className}`} style={{ animationDelay: `${g.delay}s` }}>
        {g.stars.map((s, j) => (
          <circle key={j} cx={s.x} cy={s.y} r={s.r} fill="#fff" />
        ))}
      </svg>
    ))}
  </>
);

const FAR_TONES = ["#1d0c3a", "#221047", "#180932"];
const MID_TONES = ["#130828", "#170a2e", "#10061f"];
const NEAR_TONES = ["#0b0518", "#0f0722", "#090416"];

export const FarLayer = () => <Skyline data={FAR} tones={FAR_TONES} winOpacity={0.7} antennaColor="#4a2380" />;
export const MidLayer = () => <Skyline data={MID} tones={MID_TONES} winOpacity={0.85} rimOpacity={0.5} antennaColor="#3b1a66" />;

// ---------------------------------------------------------------------------
//  HERO BUILDING  — glass curtain-wall tower with a street-level lobby
//  Everything is merged into a few <path>s (no filters, no extra DOM).
// ---------------------------------------------------------------------------
const LOBBY_TOP = 812; // y where the window grid stops and the ground floor starts

const HERO_GRID = (() => {
  const r = rng(77); // same seed + same draw order as before -> same lit-window pattern
  const r2 = rng(78); // extra randomness (blinds) lives on its own generator
  const cols = 8, cw = 16, ch = 14, step = 23;
  const ox = HERO.x + Math.round((HERO.w - ((cols - 1) * step + cw)) / 2);
  const colors = [PINK, PINK, CYAN, CYAN, AMBER, "#c9a7ff"];
  const wins = {};
  let dark = "", blinds = "", seams = "", slabs = "", mullions = "";
  let row = 0;
  for (let y = HERO.top + 32; y + ch < LOBBY_TOP - 8; y += 28, row++) {
    if (y + ch > ROOM_WIN.y - 18 && y < ROOM_WIN.y + ROOM_WIN.h + 30) continue; // leave space for the room
    if (row % 4 === 3) seams += `M${HERO.x} ${y - 7}h${HERO.w}`; // thick floor seam
    else slabs += `M${HERO.x} ${y - 7}h${HERO.w}`; // thin slab line
    for (let c = 0; c < cols; c++) {
      const x = ox + c * step;
      if (r() < 0.38) {
        const col = colors[Math.floor(r() * colors.length)];
        wins[col] = (wins[col] || "") + rect(x, y, cw, ch);
        if (r2() < 0.35) blinds += rect(x, y, cw, 3 + Math.floor(r2() * 6)); // half-drawn blind
      } else {
        dark += rect(x, y, cw, ch); // unlit glass
      }
    }
  }
  // vertical mullions between the window columns
  for (let c = 0; c <= cols; c++) {
    const mx = c === 0 ? ox - 4 : c === cols ? ox + (cols - 1) * step + cw + 4 : ox + c * step - (step - cw) / 2;
    mullions += `M${mx} ${HERO.top + 14}V${LOBBY_TOP}`;
  }
  return { wins, dark, blinds, seams, slabs, mullions };
})();

const RoomWindow = () => {
  const { x, y, w, h } = ROOM_WIN;
  const fy = y + h; // floor line
  return (
    <g>
      <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} fill={CYAN} opacity="0.1" />
      <rect x={x} y={y} width={w} height={h} fill="url(#croom)" />
      <rect x={x} y={y + 7} width={w} height="2" fill={PINK} opacity="0.85" />
      <rect x={x} y={fy - 14} width={w} height="14" fill="#1a0838" />
      {/* books on a shelf */}
      <rect x={x + 88} y={y + 26} width="26" height="2" fill="#35165e" />
      {[[90, PINK, 9], [95, CYAN, 7], [100, AMBER, 8], [105, "#9d6bff", 6]].map(([dx, c, hh]) => (
        <rect key={dx} x={x + dx} y={y + 26 - hh} width="4" height={hh} fill={c} opacity="0.8" />
      ))}
      {/* desk */}
      <rect x={x + 26} y={fy - 26} width="76" height="5" fill="#35165e" />
      <rect x={x + 30} y={fy - 21} width="3" height="8" fill="#35165e" />
      <rect x={x + 95} y={fy - 21} width="3" height="8" fill="#35165e" />
      {/* glowing monitor */}
      <g className="city-monitor-flicker">
        <rect x={x + 40} y={fy - 56} width="46" height="30" fill={CYAN} opacity="0.16" />
        <rect x={x + 46} y={fy - 52} width="34" height="22" rx="1.5" fill={CYAN} opacity="0.92" />
        <path d={`M${x + 50} ${fy - 47}h18M${x + 50} ${fy - 43}h24M${x + 50} ${fy - 39}h12`} stroke="#04202a" strokeWidth="1.4" fill="none" />
      </g>
      <rect x={x + 60} y={fy - 30} width="6" height="4" fill="#2a1250" />
      {/* person at the desk */}
      <circle cx={x + 33} cy={fy - 40} r="5" fill="#07020f" />
      <path d={`M${x + 25} ${fy - 26}q0-13 8-13t8 13z`} fill="#07020f" />
      {/* desk lamp */}
      <path d={`M${x + 12} ${fy - 14}V${fy - 34}l10-8`} stroke={PINK} strokeWidth="1.5" fill="none" />
      <path d={`M${x + 18} ${fy - 44}h12l8 28h-26z`} fill={CYAN} opacity="0.1" />
      {/* window frame (the pulsing "click me" rings are HTML, see HeroPulse) */}
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke={CYAN} strokeWidth="7" opacity="0.25" />
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke={CYAN} strokeWidth="2" />
    </g>
  );
};

const Lobby = () => {
  const { x, w } = HERO;
  const t = LOBBY_TOP;
  const cx = x + w / 2;
  return (
    <g>
      {/* podium */}
      <rect x={x - 4} y={t} width={w + 8} height={H - t + 20} fill="#0a0418" />
      <rect x={x - 4} y={t} width={w + 8} height="4" fill="#241046" />
      <path d={`M${x - 4} ${t}h${w + 8}`} stroke={PINK} strokeWidth="1.5" opacity="0.8" fill="none" />
      {/* shopfronts */}
      <rect x={x + 8} y={t + 26} width="52" height="58" fill="url(#clobby)" stroke="#35165e" strokeWidth="1.5" />
      <rect x={x + w - 60} y={t + 26} width="52" height="58" fill="url(#clobby)" stroke="#35165e" strokeWidth="1.5" />
      <path d={`M${x + 34} ${t + 26}v58M${x + w - 34} ${t + 26}v58M${x + 8} ${t + 52}h52M${x + w - 60} ${t + 52}h52`} stroke="#35165e" strokeWidth="1" fill="none" />
      <rect x={x + 8} y={t + 10} width="52" height="13" fill="#05010a" stroke={PINK} strokeWidth="1" />
      <rect x={x + w - 60} y={t + 10} width="52" height="13" fill="#05010a" stroke={CYAN} strokeWidth="1" />
      <text x={x + 34} y={t + 20} textAnchor="middle" fontSize="8" fill={PINK} fontFamily="'Share Tech Mono', monospace" letterSpacing="2">RAMEN</text>
      <text x={x + w - 34} y={t + 20} textAnchor="middle" fontSize="8" fill={CYAN} fontFamily="'Share Tech Mono', monospace" letterSpacing="2">24H</text>
      {/* entrance: canopy, glass doors, light on the pavement */}
      <path d={`M${cx - 24} ${t + 24}h48l14 66h-76z`} fill={AMBER} opacity="0.1" />
      <rect x={cx - 24} y={t + 30} width="48" height="60" fill="url(#clobby)" stroke="#4a2380" strokeWidth="1.5" />
      <path d={`M${cx} ${t + 30}v60M${cx - 24} ${t + 44}h48`} stroke="#4a2380" strokeWidth="1.2" fill="none" />
      <rect x={cx - 32} y={t + 20} width="64" height="7" fill="#1a0933" stroke={CYAN} strokeWidth="1" />
      <rect x={cx - 32} y={t + 27} width="64" height="2" fill={CYAN} opacity="0.7" />
      <rect x={cx - 34} y={t + 90} width="68" height="4" fill="#241046" />
      <ellipse cx={cx} cy={H - 4} rx="110" ry="12" fill={AMBER} opacity="0.12" />
    </g>
  );
};

const HeroBuilding = () => {
  const { x, w, top } = HERO;
  const cx = x + w / 2;
  const g = HERO_GRID;
  return (
    <g>
      <rect x={x - 24} y={top - 30} width={w + 48} height={H} fill={PINK} opacity="0.07" />
      <path d={rect(x, top, w, H - top + 20)} fill="url(#cbody)" />
      {/* neon light spilling onto the facade: pink from the left, cyan from the right */}
      <rect x={x} y={top} width={w} height={H - top} fill="url(#cside)" />

      {/* curtain-wall structure: slabs, seams, mullions, unlit glass */}
      <path d={g.slabs} stroke="#2a0f4a" strokeWidth="1" opacity="0.45" fill="none" />
      <path d={g.seams} stroke="#2a0f4a" strokeWidth="1.5" fill="none" />
      <path d={g.mullions} stroke="#2a0f4a" strokeWidth="1" opacity="0.55" fill="none" />
      <path d={g.dark} fill="#9d6bff" opacity="0.07" />

      {/* lit windows: soft halo, bright pane, then half-drawn blinds on some */}
      {Object.entries(g.wins).map(([c, d]) => (
        <g key={c}>
          <path d={d} fill="none" stroke={c} strokeWidth="5" opacity="0.14" />
          <path d={d} fill={c} opacity="0.88" />
        </g>
      ))}
      <path d={g.blinds} fill="#05010a" opacity="0.5" />

      {/* glass reflections */}
      <g clipPath="url(#cheroclip)" fill="#fff">
        <path d={`M${x - 30} ${top + 300}L${x + w + 30} ${top + 90}V${top + 150}L${x - 30} ${top + 370}z`} opacity="0.035" />
        <path d={`M${x - 30} ${top + 420}L${x + w + 30} ${top + 230}V${top + 262}L${x - 30} ${top + 470}z`} opacity="0.025" />
        <path d={`M${x - 30} ${top + 90}L${x + w + 30} ${top - 40}V${top + 4}L${x - 30} ${top + 132}z`} opacity="0.03" />
      </g>

      {/* neon rim: pink on the left, cyan on the right */}
      <path d={`M${x} ${top}V${H}`} stroke={PINK} strokeWidth="9" opacity="0.18" fill="none" />
      <path d={`M${x} ${top}V${H}`} stroke={PINK} strokeWidth="2" fill="none" />
      <path d={`M${x + w} ${top}V${H}`} stroke={CYAN} strokeWidth="9" opacity="0.18" fill="none" />
      <path d={`M${x + w} ${top}V${H}`} stroke={CYAN} strokeWidth="2" fill="none" />

      {/* roof: cornice, railing, plant, then the sign + antenna mast */}
      <rect x={x - 5} y={top} width={w + 10} height="5" fill="#241046" />
      <path d={`M${x - 5} ${top}h${w + 10}`} stroke={PINK} strokeWidth="2" fill="none" />
      <path d={`M${x + 2} ${top - 7}h${w - 4}${Array.from({ length: 14 }, (_, i) => `M${x + 4 + i * 14} ${top}v-7`).join("")}`} stroke="#4a2380" strokeWidth="1" fill="none" />
      <rect x={x + 42} y={top - 10} width="18" height="10" fill="#120726" stroke="#3b1a66" strokeWidth="1" />
      <circle cx={x + 51} cy={top - 5} r="3" fill="none" stroke="#3b1a66" strokeWidth="1" />
      <rect x={x + 66} y={top - 7} width="24" height="7" fill="#120726" stroke="#3b1a66" strokeWidth="1" />
      <rect x={x + w - 62} y={top - 13} width="6" height="13" fill="#120726" stroke="#3b1a66" strokeWidth="1" />
      <rect x={x + w - 64} y={top - 15} width="10" height="3" fill="#241046" />
      <path d={`M${x + 30} ${top}V${top - 14}M${x + w - 30} ${top}V${top - 14}`} stroke="#3b1a66" strokeWidth="3" />
      <rect x={x + 8} y={top - 46} width={w - 16} height="32" fill="#06010d" stroke={CYAN} strokeWidth="1.5" />
      <rect x={x + 6} y={top - 48} width={w - 12} height="36" fill="none" stroke={CYAN} strokeWidth="5" opacity="0.2" />
      <text x={cx} y={top - 24} textAnchor="middle" fontSize="19" fontWeight="900" letterSpacing="3" fill="#ffd0f6" stroke={PINK} strokeWidth="0.6" fontFamily="Orbitron, sans-serif">
        SHRESHTHA
      </text>
      <path d={`M${cx} ${top - 46}V${top - 104}`} stroke="#4a2380" strokeWidth="2.5" />
      <path d={Array.from({ length: 6 }, (_, i) => `M${cx - 4} ${top - 52 - i * 9}h8`).join("")} stroke="#4a2380" strokeWidth="1.2" fill="none" />
      <circle cx={cx} cy={top - 104} r="8" fill="#ff3355" opacity="0.16" />
      <circle cx={cx} cy={top - 104} r="3" fill="#ff3355" className="city-blink" />

      <RoomWindow />
      {/* small plate under the room */}
      <rect x={ROOM_WIN.x + 20} y={ROOM_WIN.y + ROOM_WIN.h + 10} width="80" height="12" fill="#05010a" stroke={PINK} strokeWidth="1" />
      <text x={ROOM_CENTER.x} y={ROOM_WIN.y + ROOM_WIN.h + 19} textAnchor="middle" fontSize="8" fill={PINK} fontFamily="'Share Tech Mono', monospace" letterSpacing="2">
        ROOM_01
      </text>

      <Lobby />
    </g>
  );
};

// ---------------------------------------------------------------------------
//  THE WHOLE CITY
//  <CitySvg/> returns sibling layers (all 1600x900, stacked):
//     sky back -> twinkling stars -> sky front -> skyline & hero
// ---------------------------------------------------------------------------
const LAYER = { width: W, height: H, viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true", focusable: "false" };
const LAYER_CLS = "absolute left-0 top-0 block overflow-visible";

export const CitySvg = React.memo(() => (
  <>
    <svg {...LAYER} className={LAYER_CLS}>
      <SkyBack uid="c" />
    </svg>
    <TwinkleStars {...LAYER} className={LAYER_CLS} />
    <svg {...LAYER} className={LAYER_CLS}>
      <defs>
        <linearGradient id="cbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b0b36" />
          <stop offset="1" stopColor="#07020f" />
        </linearGradient>
        <linearGradient id="croom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b0b63" />
          <stop offset="1" stopColor="#14052b" />
        </linearGradient>
        <linearGradient id="cside" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PINK} stopOpacity="0.16" />
          <stop offset="0.16" stopColor={PINK} stopOpacity="0" />
          <stop offset="0.84" stopColor={CYAN} stopOpacity="0" />
          <stop offset="1" stopColor={CYAN} stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="clobby" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a8" stopOpacity="0.62" />
          <stop offset="1" stopColor={AMBER} stopOpacity="0.22" />
        </linearGradient>
        <clipPath id="cheroclip">
          <rect x={HERO.x} y={HERO.top} width={HERO.w} height={LOBBY_TOP - HERO.top} />
        </clipPath>
        <linearGradient id="chazeA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PINK} stopOpacity="0" />
          <stop offset="1" stopColor={PINK} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="chazeB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c3aed" stopOpacity="0" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="cground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PINK} stopOpacity="0" />
          <stop offset="1" stopColor={PINK} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <SkyFront uid="c" />
      <FarLayer />
      <rect x="-1500" y="380" width="4600" height="520" fill="url(#chazeA)" />
      <MidLayer />
      <rect x="-1500" y="480" width="4600" height="420" fill="url(#chazeB)" />
      <Skyline data={NEAR} tones={NEAR_TONES} paneFill="#9d6bff" winOpacity={0.92} rimOpacity={0.75} antennaColor="#4a2380" signs />
      <HeroBuilding />
      <rect x="-1500" y="760" width="4600" height="140" fill="url(#cground)" />
    </svg>
  </>
));

// ---------------------------------------------------------------------------
//  flying traffic, blimp and the pulsing "click me" rings
//  (plain HTML on top of the canvas -> animated on the GPU, never repaints the SVG)
// ---------------------------------------------------------------------------
const CARS = (() => {
  const r = rng(21);
  const cols = [CYAN, PINK, AMBER, "#ffffff"];
  return Array.from({ length: 14 }, () => {
    const dur = 16 + r() * 30;
    return {
      y: Math.round(70 + r() * 430),
      dur: +dur.toFixed(1),
      delay: +(-r() * dur).toFixed(1),
      len: Math.round(22 + r() * 44),
      h: r() < 0.3 ? 3 : 2,
      c: cols[Math.floor(r() * cols.length)],
      left: r() < 0.5,
      o: +(0.45 + r() * 0.5).toFixed(2),
    };
  });
})();

const Blimp = () => (
  <div className="city-blimp pointer-events-none absolute" style={{ top: 112, left: 0 }}>
    <svg width="250" height="92" viewBox="0 0 250 92">
      <path d="M205 40l36-18v36z" fill="#14092a" stroke={PINK} strokeWidth="1.2" />
      <ellipse cx="112" cy="40" rx="104" ry="32" fill="#14092a" stroke={CYAN} strokeWidth="1.5" />
      <rect x="64" y="66" width="44" height="13" rx="3" fill="#14092a" stroke={PINK} strokeWidth="1.2" />
      <rect x="34" y="29" width="156" height="22" rx="3" fill="#05010a" stroke={PINK} strokeOpacity="0.7" />
      <text x="112" y="44" textAnchor="middle" fontSize="11" fill={PINK} fontFamily="'Share Tech Mono', monospace" letterSpacing="1">
        JAVA · SPRING · REACT
      </text>
    </svg>
  </div>
);

const HeroPulse = () => {
  const { x, y, w, h } = ROOM_WIN;
  const box = { left: x - 4, top: y - 4, width: w + 8, height: h + 8, boxSizing: "border-box" };
  return (
    <>
      <span className="city-pulse-ring pointer-events-none absolute" style={{ ...box, border: `2px solid ${PINK}` }} />
      <span className="city-pulse-ring pointer-events-none absolute" style={{ ...box, border: `2px solid ${CYAN}`, animationDelay: "1.2s" }} />
    </>
  );
};

export const CityTraffic = React.memo(() => (
  <>
    <HeroPulse />
    {CARS.map((c, i) => (
      <span
        key={i}
        className={`city-car ${c.left ? "city-car--l" : ""}`}
        style={{
          top: c.y,
          width: c.len,
          height: c.h,
          opacity: c.o,
          animationDuration: `${c.dur}s`,
          animationDelay: `${c.delay}s`,
          background: `linear-gradient(${c.left ? 270 : 90}deg, transparent, ${c.c})`,
          boxShadow: `0 0 8px ${c.c}`,
        }}
      />
    ))}
    <Blimp />
  </>
));