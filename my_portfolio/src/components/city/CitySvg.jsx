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
    signs = 0, signTexts = [],
  } = o;
  const r = rng(seed);
  const out = { body: "", wins: {}, rimPink: "", rimCyan: "", antennas: "", beacons: [], signs: [] };
  let x = from;
  while (x < to) {
    const w = Math.max(24, Math.min(Math.round(wMin + r() * (wMax - wMin)), to - x));
    const top = Math.round(topMin + r() * (topMax - topMin));
    out.body += rect(x, top, w, H - top + 20);

    if (r() < tiers) {
      const tw = Math.round(w * (0.4 + r() * 0.35));
      const th = 12 + Math.round(r() * 30);
      const tx = x + Math.round((w - tw) * r());
      out.body += rect(tx, top - th, tw, th);
    }

    const [cw, ch] = cell;
    const cols = Math.max(1, Math.floor((w - 12) / cw));
    const ox = x + Math.round((w - cols * cw) / 2);
    for (let y = top + 12; y < maxWinY; y += ch + 8) {
      for (let c = 0; c < cols; c++) {
        if (r() < lit) {
          const col = colors[Math.floor(r() * colors.length)];
          out.wins[col] = (out.wins[col] || "") + rect(ox + c * cw + 2, y, cw - 5, ch - 4);
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
    body: a.body + b.body,
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
    tiers: 0.45, antenna: 0.25, rim: 0.8, signs: 0.5, signTexts: SIGN_TEXTS,
  }),
  skyline({
    seed: 41, from: HERO.x + HERO.w + 3, to: 1720, wMin: 70, wMax: 130, topMin: 360, topMax: 620,
    lit: 0.3, colors: [PINK, CYAN, CYAN, AMBER, AMBER, "#c9a7ff"], maxWinY: 870,
    tiers: 0.45, antenna: 0.25, rim: 0.8, signs: 0.5, signTexts: SIGN_TEXTS,
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
const Skyline = ({ data, fill, winOpacity = 0.9, rimOpacity = 0.6, antennaColor = "#3b1a66", signs = false }) => (
  <g>
    <path d={data.body} fill={fill} />
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

// Sky, stars and the big synthwave sun. `uid` keeps gradient ids unique when reused.
export const Sky = ({ uid }) => (
  <g>
    <defs>
      <linearGradient id={`${uid}sky`} gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="900">
        <stop offset="0" stopColor="#03000a" />
        <stop offset="0.45" stopColor="#10052a" />
        <stop offset="0.75" stopColor="#3a0b63" />
        <stop offset="1" stopColor="#8a1596" />
      </linearGradient>
      <radialGradient id={`${uid}glow`}>
        <stop offset="0" stopColor={PINK} stopOpacity="0.34" />
        <stop offset="1" stopColor={PINK} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}sun`} gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="570">
        <stop offset="0" stopColor="#ffb3ee" />
        <stop offset="0.5" stopColor={PINK} />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      <mask id={`${uid}sunmask`}>
        <rect x="400" y="100" width="800" height="600" fill="#fff" />
        {[[420, 3], [446, 5], [472, 7], [500, 9], [530, 11], [562, 13]].map(([y, h]) => (
          <rect key={y} x="400" y={y} width="800" height={h} fill="#000" />
        ))}
      </mask>
    </defs>
    <rect x="-1500" y="-1200" width="4600" height="3200" fill={`url(#${uid}sky)`} />
    {STARS.map((s, i) => (
      <circle
        key={i}
        cx={s.x}
        cy={s.y}
        r={s.r}
        fill="#fff"
        opacity={s.o}
        className={s.tw ? "city-twinkle" : undefined}
        style={s.tw ? { animationDelay: `${s.d}s` } : undefined}
      />
    ))}
    <circle cx="800" cy="360" r="430" fill={`url(#${uid}glow)`} />
    <circle cx="800" cy="360" r="210" fill={`url(#${uid}sun)`} mask={`url(#${uid}sunmask)`} />
  </g>
);

export const FarLayer = () => <Skyline data={FAR} fill="#1d0c3a" winOpacity={0.7} antennaColor="#4a2380" />;
export const MidLayer = () => <Skyline data={MID} fill="#130828" winOpacity={0.85} rimOpacity={0.5} antennaColor="#3b1a66" />;

// ---------- hero building ----------
const HERO_WINS = (() => {
  const r = rng(77);
  const cols = 8, cw = 16, ch = 14, step = 23;
  const ox = HERO.x + Math.round((HERO.w - ((cols - 1) * step + cw)) / 2);
  const colors = [PINK, PINK, CYAN, CYAN, AMBER, "#c9a7ff"];
  const wins = {};
  const seams = [];
  let row = 0;
  for (let y = HERO.top + 32; y < 872; y += 28, row++) {
    if (y + ch > ROOM_WIN.y - 18 && y < ROOM_WIN.y + ROOM_WIN.h + 30) continue; // leave space for the room
    if (row % 4 === 3) seams.push(`M${HERO.x} ${y - 7}h${HERO.w}`);
    for (let c = 0; c < cols; c++) {
      if (r() < 0.38) {
        const col = colors[Math.floor(r() * colors.length)];
        wins[col] = (wins[col] || "") + rect(ox + c * step, y, cw, ch);
      }
    }
  }
  return { wins, seams: seams.join("") };
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
      {/* frame + pulsing "click me" rings */}
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke={CYAN} strokeWidth="7" opacity="0.25" />
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke={CYAN} strokeWidth="2" />
      <rect className="city-pulse-ring" x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke={PINK} strokeWidth="2" />
      <rect className="city-pulse-ring" style={{ animationDelay: "1.2s" }} x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="none" stroke={CYAN} strokeWidth="2" />
    </g>
  );
};

const HeroBuilding = () => {
  const { x, w, top } = HERO;
  return (
    <g>
      <rect x={x - 24} y={top - 30} width={w + 48} height={H} fill={PINK} opacity="0.07" />
      <path d={rect(x, top, w, H - top + 20)} fill="url(#cbody)" />
      {/* neon rim: pink on the left, cyan on the right */}
      <path d={`M${x} ${top}V${H}`} stroke={PINK} strokeWidth="9" opacity="0.18" fill="none" />
      <path d={`M${x} ${top}V${H}`} stroke={PINK} strokeWidth="2" fill="none" />
      <path d={`M${x + w} ${top}V${H}`} stroke={CYAN} strokeWidth="9" opacity="0.18" fill="none" />
      <path d={`M${x + w} ${top}V${H}`} stroke={CYAN} strokeWidth="2" fill="none" />
      <path d={`M${x} ${top}h${w}`} stroke={PINK} strokeWidth="2" fill="none" />
      <path d={HERO_WINS.seams} stroke="#2a0f4a" strokeWidth="1.5" fill="none" />
      {Object.entries(HERO_WINS.wins).map(([c, d]) => (
        <path key={c} d={d} fill={c} opacity="0.88" />
      ))}

      {/* roof sign + antenna */}
      <path d={`M${x + 30} ${top}V${top - 14}M${x + w - 30} ${top}V${top - 14}`} stroke="#3b1a66" strokeWidth="3" />
      <rect x={x + 8} y={top - 46} width={w - 16} height="32" fill="#06010d" stroke={CYAN} strokeWidth="1.5" />
      <rect x={x + 6} y={top - 48} width={w - 12} height="36" fill="none" stroke={CYAN} strokeWidth="5" opacity="0.2" />
      <text x={x + w / 2} y={top - 24} textAnchor="middle" fontSize="19" fontWeight="900" letterSpacing="3" fill="#ffd0f6" stroke={PINK} strokeWidth="0.6" fontFamily="Orbitron, sans-serif">
        SHRESHTHA
      </text>
      <path d={`M${x + w / 2} ${top - 46}V${top - 104}`} stroke="#4a2380" strokeWidth="2.5" />
      <circle cx={x + w / 2} cy={top - 104} r="3" fill="#ff3355" className="city-blink" />

      <RoomWindow />
      {/* small plate under the room */}
      <rect x={ROOM_WIN.x + 20} y={ROOM_WIN.y + ROOM_WIN.h + 10} width="80" height="12" fill="#05010a" stroke={PINK} strokeWidth="1" />
      <text x={ROOM_CENTER.x} y={ROOM_WIN.y + ROOM_WIN.h + 19} textAnchor="middle" fontSize="8" fill={PINK} fontFamily="'Share Tech Mono', monospace" letterSpacing="2">
        ROOM_01
      </text>
    </g>
  );
};

// ---------- the whole city ----------
export const CitySvg = () => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    className="absolute left-0 top-0 block overflow-visible"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="cbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b0b36" />
        <stop offset="1" stopColor="#07020f" />
      </linearGradient>
      <linearGradient id="croom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b0b63" />
        <stop offset="1" stopColor="#14052b" />
      </linearGradient>
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

    <Sky uid="c" />
    <FarLayer />
    <rect x="-1500" y="380" width="4600" height="520" fill="url(#chazeA)" />
    <MidLayer />
    <rect x="-1500" y="480" width="4600" height="420" fill="url(#chazeB)" />
    <Skyline data={NEAR} fill="#0b0518" winOpacity={0.92} rimOpacity={0.75} antennaColor="#4a2380" signs />
    <HeroBuilding />
    <rect x="-1500" y="760" width="4600" height="140" fill="url(#cground)" />
  </svg>
);

// ---------- flying traffic + blimp (plain HTML on top of the canvas) ----------
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

export const CityTraffic = () => (
  <>
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
);
