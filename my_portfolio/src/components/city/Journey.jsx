import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import STAGES from "./Stages";

const N = STAGES.length;
const LOCK_MS = 850; // one gesture = one stage (stops trackpad inertia from skipping stages)

// Can this element (or an ancestor) still scroll in the given direction?
// If yes we let it scroll natively instead of changing stage.
const canScrollInside = (el, dir) => {
  let node = el instanceof Element ? el : null;
  while (node && node !== document.body) {
    const oy = getComputedStyle(node).overflowY;
    if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 2) {
      if (dir > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 2) return true;
      if (dir < 0 && node.scrollTop > 2) return true;
      return false;
    }
    node = node.parentElement;
  }
  return false;
};

// ---------- infinite neon tunnel: every stage pushes the rings closer ----------
const RINGS = 9;
const Ring = ({ k, depth }) => {
  const phase = (d) => (((k + d) % RINGS) + RINGS) % RINGS;
  const scale = useTransform(depth, (d) => 0.1 * Math.pow(1.68, phase(d)));
  const opacity = useTransform(depth, (d) => Math.sin((Math.PI * phase(d)) / RINGS) * 0.3);
  return (
    <motion.rect
      x="-50"
      y="-50"
      width="100"
      height="100"
      fill="none"
      stroke={k % 2 ? "#00f0ff" : "#ff2bd6"}
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
      style={{ scale, opacity }}
    />
  );
};

const Tunnel = ({ depth }) => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="-50 -50 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="tunnel-core">
        <stop offset="0" stopColor="#ff2bd6" stopOpacity="0.16" />
        <stop offset="0.6" stopColor="#7c3aed" stopOpacity="0.06" />
        <stop offset="1" stopColor="#05010a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="-50" y="-50" width="100" height="100" fill="url(#tunnel-core)" />
    {[[-50, -50], [50, -50], [50, 50], [-50, 50]].map(([x, y], i) => (
      <line key={i} x1={x * 0.06} y1={y * 0.06} x2={x} y2={y} stroke="#ff2bd6" strokeOpacity="0.14" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    ))}
    {Array.from({ length: RINGS }, (_, k) => (
      <Ring key={k} k={k} depth={depth} />
    ))}
  </svg>
);

// ---------- panel transition: fly forward through the old stage into the new one ----------
const flyVariants = {
  enter: (d) => ({ opacity: 0, scale: d > 0 ? 0.55 : 1.7, filter: "blur(8px)" }),
  center: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (d) => ({ opacity: 0, scale: d > 0 ? 1.7 : 0.55, filter: "blur(8px)", pointerEvents: "none" }),
};
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0, pointerEvents: "none" },
};

const Journey = ({ active, onExit, onCity, onClassic }) => {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [dir, setDir] = useState(1);
  const stageRef = useRef(0);
  const lockUntil = useRef(0);
  const depth = useMotionValue(0);

  // keep latest callbacks without re-binding listeners
  const exitRef = useRef(onExit);
  exitRef.current = onExit;

  useEffect(() => {
    const c = animate(depth, stage, { duration: reduce ? 0.01 : 1.2, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [stage, depth, reduce]);

  const goTo = useCallback((n) => {
    const now = performance.now();
    if (now < lockUntil.current) return;
    if (n < 0) {
      lockUntil.current = now + LOCK_MS;
      exitRef.current?.();
      return;
    }
    if (n >= N || n === stageRef.current) return;
    lockUntil.current = now + LOCK_MS;
    setDir(n > stageRef.current ? 1 : -1);
    stageRef.current = n;
    setStage(n);
  }, []);

  const step = useCallback((d) => goTo(stageRef.current + d), [goTo]);

  // ---------- input: wheel, keys, swipe ----------
  useEffect(() => {
    if (!active) return;
    lockUntil.current = performance.now() + 900; // ignore the tail of the gesture that brought us here

    const onWheel = (e) => {
      const dy = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dy) < 6) return;
      const d = dy > 0 ? 1 : -1;
      if (canScrollInside(e.target, d)) return; // panel can still scroll: let it
      e.preventDefault();
      step(d);
    };

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "Home") return void (e.preventDefault(), goTo(0));
      if (k === "End") return void (e.preventDefault(), goTo(N - 1));
      const forward = ["ArrowRight", "ArrowDown", "PageDown"].includes(k) || (k === " " && !e.target.closest?.("a,button"));
      const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(k);
      if (!forward && !back) return;
      const d = forward ? 1 : -1;
      if (k === "ArrowDown" || k === "ArrowUp") {
        const all = document.querySelectorAll('[data-stage-scroll="active"]');
        const sc = all[all.length - 1];
        if (sc && canScrollInside(sc, d)) {
          e.preventDefault();
          sc.scrollBy({ top: d * 140, behavior: "smooth" });
          return;
        }
      }
      e.preventDefault();
      step(d);
    };

    let sx = 0, sy = 0, st = null;
    const onTouchStart = (e) => {
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY; st = e.target;
    };
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
      else if (Math.abs(dy) > 70) {
        const d = dy < 0 ? 1 : -1;
        if (!canScrollInside(st, d)) step(d);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, step, goTo]);

  const api = {
    next: () => step(1),
    prev: () => step(-1),
    goTo,
    toCity: onCity,
    classic: onClassic,
  };
  const Current = STAGES[stage].Component;
  const pct = (stage / (N - 1)) * (100 - 100 / N);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <Tunnel depth={depth} />

      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={stage}
          custom={dir}
          variants={reduce ? fadeVariants : flyVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4 pb-32 pt-16 sm:px-8"
        >
          <div
            data-stage-scroll="active"
            className="stage-scroll max-h-full w-full max-w-[1120px] overflow-y-auto overflow-x-hidden rounded-sm bg-ink/60 p-3 sm:p-5"
          >
            <Current api={api} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ---------- trajectory bar ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 sm:pb-6">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-neon-cyan">
            Depth {String(stage + 1).padStart(2, "0")}/{String(N).padStart(2, "0")} — {STAGES[stage].label}
          </p>
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={api.prev}
              aria-label={stage === 0 ? "Zoom out to the room" : "Previous stage"}
              className="cyber-clip-sm mt-[-6px] border border-neon-pink/60 px-3 py-1.5 font-mono text-lg text-neon-pink transition hover:bg-neon-pink hover:text-ink"
            >
              ◂
            </button>

            <div className="relative flex-1">
              <div className="absolute top-[6px] h-[2px] bg-white/10" style={{ left: `${50 / N}%`, right: `${50 / N}%` }} />
              <motion.div
                className="absolute top-[6px] h-[2px] bg-gradient-to-r from-neon-pink to-neon-cyan shadow-neon"
                style={{ left: `${50 / N}%` }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: reduce ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="relative grid" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                {STAGES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to ${s.label}`}
                    aria-current={i === stage ? "step" : undefined}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={`block h-[14px] w-[14px] rotate-45 border-2 transition ${
                        i === stage
                          ? "border-neon-pink bg-neon-pink shadow-neon"
                          : i < stage
                          ? "border-neon-cyan bg-neon-cyan"
                          : "border-white/30 bg-ink"
                      }`}
                    />
                    <span
                      className={`hidden font-mono text-[10px] uppercase tracking-widest sm:block ${
                        i === stage ? "text-neon-pink" : "text-gray-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={api.next}
              disabled={stage === N - 1}
              aria-label="Next stage"
              className="cyber-clip-sm mt-[-6px] border border-neon-pink/60 px-3 py-1.5 font-mono text-lg text-neon-pink transition hover:bg-neon-pink hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neon-pink"
            >
              ▸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journey;
