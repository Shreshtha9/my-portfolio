import React, { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import { W, H, ROOM_WIN, ROOM_CENTER, CitySvg, CityTraffic } from "./CitySvg";
import Rain from "./Rain";
import RoomScene, { ROOM_SCREEN } from "./RoomScene";

import "./city.css";

// ---------------------------------------------------------------------------
//  City  --click the glowing window-->  Room  --click the monitor-->  Journey
//
//  Two progress values drive everything (0..1 each):
//    pCity : 0 = skyline, 1 = inside the room
//    pRoom : 0 = looking at the room, 1 = inside the monitor (the journey)
// ---------------------------------------------------------------------------
const loadJourney = () => import("./Journey");
const Journey = lazy(loadJourney);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const HINTS = {
  city: isTouch ? "▸ Tap the glowing window to enter the room" : "▸ Click the glowing window to enter the room",
  room: isTouch ? "▸ Tap the monitor — or swipe up — to zoom in" : "▸ Click the monitor — or scroll / press → — to zoom in",
};

const CityExperience = ({ onClassic }) => {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState("city"); // city | toRoom | room | toJourney | journey | fromJourney | toCity
  const phaseRef = useRef("city");
  const pCity = useMotionValue(0);
  const pRoom = useMotionValue(0);
  const size = useRef({ vw: window.innerWidth, vh: window.innerHeight });

  const cityRef = useRef(null);
  const cameraRef = useRef(null);
  const roomRef = useRef(null);
  const journeyRef = useRef(null);

  const setPhaseBoth = useCallback((p) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // ---------- the "camera": turns pCity / pRoom into transforms ----------
  const apply = useCallback(() => {
    const { vw, vh } = size.current;
    const a = pCity.get();
    const b = pRoom.get();

    // City camera: zoom (exponentially) towards the glowing window.
    const s = Math.max(vw / W, vh / H); // "cover" the screen with the 1600x900 canvas
    const zEnd = Math.min(26, vw / (ROOM_WIN.w * s)); // window ends up filling the screen width
    const e = easeInOut(a);
    const z = Math.exp(Math.log(zEnd) * e);
    const fx = lerp(W / 2, ROOM_CENTER.x, e);
    const fy = lerp(H / 2, ROOM_CENTER.y, e);
    if (cameraRef.current) {
      cameraRef.current.style.transform = `translate(${vw / 2}px, ${vh / 2}px) scale(${s * z}) translate(${-fx}px, ${-fy}px)`;
    }
    if (cityRef.current) {
      cityRef.current.style.opacity = String(1 - smooth(0.6, 0.93, a));
      cityRef.current.style.visibility = a > 0.97 ? "hidden" : "visible";
    }

    // Room: fades/scales in as the window fills the screen, then zooms into the monitor.
    const landscape = vw / vh >= 1.2;
    const rs = landscape ? Math.max(vw / 1600, vh / 900) : vw / 760;
    const screenZ = Math.max(vw / (ROOM_SCREEN.w * rs), vh / (ROOM_SCREEN.h * rs)) * 1.1;
    const roomIn = lerp(0.55, 1, easeOut(smooth(0.45, 1, a)));
    const roomZoom = Math.exp(Math.log(screenZ) * easeInOut(b));
    if (roomRef.current) {
      const st = roomRef.current.style;
      st.setProperty("--room-s", String(rs));
      st.transform = `scale(${roomIn * roomZoom})`;
      st.opacity = String(smooth(0.52, 0.92, a) * (1 - smooth(0.55, 0.9, b)));
      st.visibility = a < 0.5 || b > 0.97 ? "hidden" : "visible";
    }

    // Journey: appears from "inside the monitor".
    if (journeyRef.current) {
      const jo = smooth(0.5, 0.95, b);
      const st = journeyRef.current.style;
      st.opacity = String(jo);
      st.transform = `scale(${lerp(0.72, 1, easeOut(jo))})`;
      st.visibility = b < 0.45 ? "hidden" : "visible";
    }
  }, [pCity, pRoom]);

  useLayoutEffect(() => {
    apply();
    const u1 = pCity.on("change", apply);
    const u2 = pRoom.on("change", apply);
    const onResize = () => {
      size.current = { vw: window.innerWidth, vh: window.innerHeight };
      apply();
    };
    window.addEventListener("resize", onResize);
    return () => {
      u1();
      u2();
      window.removeEventListener("resize", onResize);
    };
  }, [apply, pCity, pRoom]);

  // ---------- phase transitions ----------
  const run = useCallback(
    (mv, to, duration) =>
      new Promise((resolve) => {
        animate(mv, to, { duration: reduce ? 0.01 : duration, ease: "linear", onComplete: resolve });
      }),
    [reduce]
  );

  const enterRoom = useCallback(async () => {
    if (phaseRef.current !== "city") return;
    setPhaseBoth("toRoom");
    await run(pCity, 1, 2.3);
    setPhaseBoth("room");
  }, [pCity, run, setPhaseBoth]);

  const leaveRoom = useCallback(async () => {
    if (phaseRef.current !== "room") return;
    setPhaseBoth("toCity");
    await run(pCity, 0, 1.8);
    setPhaseBoth("city");
  }, [pCity, run, setPhaseBoth]);

  const enterJourney = useCallback(async () => {
    if (phaseRef.current !== "room") return;
    setPhaseBoth("toJourney");
    await run(pRoom, 1, 1.6);
    setPhaseBoth("journey");
  }, [pRoom, run, setPhaseBoth]);

  const leaveJourney = useCallback(async () => {
    if (phaseRef.current !== "journey") return;
    setPhaseBoth("fromJourney");
    await run(pRoom, 0, 1.3);
    setPhaseBoth("room");
  }, [pRoom, run, setPhaseBoth]);

  const toCity = useCallback(async () => {
    await leaveJourney();
    await leaveRoom();
  }, [leaveJourney, leaveRoom]);

  const back = useCallback(() => {
    if (phaseRef.current === "journey") leaveJourney();
    else if (phaseRef.current === "room") leaveRoom();
  }, [leaveJourney, leaveRoom]);

  // ---------- input while in the room (Journey handles its own) ----------
  useEffect(() => {
    let sy = 0;
    const onWheel = (e) => {
      if (phaseRef.current !== "room" || Math.abs(e.deltaY) < 6) return;
      e.preventDefault();
      if (e.deltaY > 0) enterJourney();
      else leaveRoom();
    };
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") return back();
      if (phaseRef.current !== "room") return;
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        enterJourney();
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        leaveRoom();
      }
    };
    const onTouchStart = (e) => {
      sy = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (phaseRef.current !== "room") return;
      const dy = e.changedTouches[0].clientY - sy;
      if (dy < -60) enterJourney();
      else if (dy > 60) leaveRoom();
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
  }, [back, enterJourney, leaveRoom]);

  const inJourney = phase === "toJourney" || phase === "journey" || phase === "fromJourney";
  useEffect(() => { if (phase === "toRoom") loadJourney(); }, [phase]);
const cityHidden = phase === "room" || inJourney;
const roomHidden = phase === "city" || phase === "journey";
  const hint = HINTS[phase];

  return (
    <div className="fixed inset-0 z-20 overflow-hidden bg-ink">
      {/* ---------------- 1. the city ---------------- */}
      <div ref={cityRef} className={`absolute inset-0 ${cityHidden ? "city-paused" : ""}`}>
        <div
          ref={cameraRef}
          className="absolute left-0 top-0"
          style={{ width: W, height: H, transformOrigin: "0 0" }}
        >
          <CitySvg />
          <CityTraffic />

          <div
            className="city-label pointer-events-none absolute whitespace-nowrap border border-neon-cyan bg-ink/80 px-3 py-1 font-mono text-[15px] uppercase tracking-[0.25em] text-neon-cyan"
            style={{ left: ROOM_CENTER.x, top: ROOM_WIN.y - 52, boxShadow: "0 0 14px rgba(0,240,255,0.5)" }}
          >
            ▸ Enter room_01
          </div>
          <button
            type="button"
            className="city-hotspot absolute"
            aria-label="Enter Shreshtha's room to see the portfolio"
            disabled={phase !== "city"}
            onClick={enterRoom}
            style={{ left: ROOM_WIN.x - 10, top: ROOM_WIN.y - 10, width: ROOM_WIN.w + 20, height: ROOM_WIN.h + 20 }}
          />
        </div>

        {!reduce && <Rain />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neon-violet/30 via-neon-pink/5 to-transparent" />
      </div>

      {/* ---------------- 2. the room ---------------- */}
      <div ref={roomRef} className="absolute inset-0 overflow-hidden" style={{ visibility: "hidden", opacity: 0 }}>
        <RoomScene play={phase !== "city" && phase !== "toCity"} paused={roomHidden} interactive={phase === "room"} onMonitor={enterJourney} />
      </div>

      {/* ---------------- 3. the journey (inside the monitor) ---------------- */}
      <div ref={journeyRef} className="absolute inset-0" style={{ visibility: "hidden", opacity: 0 }}>
        {inJourney && (
          <Suspense fallback={null}>
            <Journey active={phase === "journey"} onExit={leaveJourney} onCity={toCity} onClassic={onClassic} />
          </Suspense>
        )}
      </div>

      {/* ---------------- HUD ---------------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 sm:p-6">
        <div className="pointer-events-auto">
          {phase !== "city" && (
            <button
              type="button"
              onClick={back}
              disabled={phase !== "room" && phase !== "journey"}
              className="cyber-clip-sm border border-neon-pink/60 bg-ink/85 px-4 py-2 font-mono text-xs uppercase tracking-widest text-neon-pink  transition hover:bg-neon-pink hover:text-ink disabled:opacity-50"
            >
              ◂ {phase === "journey" || phase === "fromJourney" ? "Room" : "City"}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClassic}
          className="pointer-events-auto cyber-clip-sm border border-neon-cyan/60 bg-ink/70 px-4 py-2 font-mono text-xs uppercase tracking-widest text-neon-cyan backdrop-blur transition hover:bg-neon-cyan hover:text-ink"
        >
          Classic view ▸
        </button>
      </div>

      {hint && (
        <p className="pointer-events-none absolute bottom-6 left-1/2 z-30 w-max max-w-[92vw] -translate-x-1/2 border border-neon-cyan/30 bg-ink/80 px-4 py-2 text-center font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan text-glow-cyan sm:text-sm">
          {hint}
          <span className="ml-1 animate-blink text-neon-pink">_</span>
        </p>
      )}
    </div>
  );
};

export default CityExperience;
