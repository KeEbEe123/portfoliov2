"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/* ------------------------------------------------------------------
   Dot-matrix student mascot.

   The figure is built from vector primitives (head, grad cap, arms,
   legs + per-section props) sampled onto a W×H dot grid, so poses can
   animate and recolor with the theme.

   Per-section behaviour:
     hero/top  → stands and waves
     projects  → sits down, laptop appears, types/codes
     about     → laptop poofs, puts on headphones, bobs to music
     skills    → presents with sparkles
     experience→ raises a trophy
     beyond    → paints at a tiny canvas
     contact   → waves goodbye
   A poof burst plays whenever the pose changes.

   Choreography: large + active in the hero, then it shrinks and
   trails the scroll, parking beside the active section heading.
------------------------------------------------------------------- */

const W = 26;
const H = 30;
const CELL = 8;
const SCALE_BIG = 1;
const SCALE_SMALL = 0.42;

// ---- geometry helpers (dot units) ----
const d2 = (ax: number, ay: number, bx: number, by: number) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};
const inCircle = (px: number, py: number, cx: number, cy: number, r: number) =>
  d2(px, py, cx, cy) <= r * r;
const inRect = (
  px: number,
  py: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => px >= x0 && px <= x1 && py >= y0 && py <= y1;
function segDist(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.sqrt(d2(px, py, ax, ay));
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.sqrt(d2(px, py, bx, by));
  const t = c1 / c2;
  return Math.sqrt(d2(px, py, ax + t * vx, ay + t * vy));
}

type Colors = { body: string; accent: string };

// ---- shared body parts ----
const carveFace = (col: number, row: number, cx: number, cy: number) =>
  inCircle(col, row, cx - 2, cy - 0.4, 1.15) ||
  inCircle(col, row, cx + 2, cy - 0.4, 1.15) ||
  inRect(col, row, cx - 1.4, cy + 1.8, cx + 1.4, cy + 2.6);

const head = (col: number, row: number, cx: number, cy: number) =>
  inCircle(col, row, cx, cy, 4.4);

function cap(col: number, row: number, cx: number, cy: number) {
  const topY = cy - 4.4;
  if (inRect(col, row, cx - 6, topY - 1.6, cx + 6, topY - 0.2)) return true; // board
  if (inRect(col, row, cx - 3, topY - 0.2, cx + 3, topY + 1)) return true; // base
  if (segDist(col, row, cx + 5.6, topY - 0.2, cx + 6.2, topY + 3) <= 0.6)
    return true; // tassel
  if (inCircle(col, row, cx + 6.2, topY + 3.3, 0.8)) return true; // knot
  return false;
}

function headphones(col: number, row: number, cx: number, cy: number) {
  const dd = Math.sqrt(d2(col, row, cx, cy));
  if (dd >= 4.7 && dd <= 5.7 && row < cy - 1.2) return true; // band
  if (inCircle(col, row, cx - 4.9, cy, 1.4)) return true; // left cup
  if (inCircle(col, row, cx + 4.9, cy, 1.4)) return true; // right cup
  return false;
}

const note = (col: number, row: number, nx: number, ny: number) =>
  inCircle(col, row, nx, ny, 1) || inRect(col, row, nx + 0.7, ny - 3, nx + 1.2, ny);

const sparkle = (col: number, row: number, sx: number, sy: number) =>
  inRect(col, row, sx - 0.4, sy - 1.5, sx + 0.4, sy + 1.5) ||
  inRect(col, row, sx - 1.5, sy - 0.4, sx + 1.5, sy + 0.4);

const legs = (col: number, row: number, cx: number) =>
  segDist(col, row, cx - 1.4, 21, cx - 1.4, 28) <= 0.95 ||
  segDist(col, row, cx + 1.4, 21, cx + 1.4, 28) <= 0.95 ||
  inCircle(col, row, cx - 1.7, 28.2, 1.1) ||
  inCircle(col, row, cx + 1.7, 28.2, 1.1);

const torso = (col: number, row: number, cx: number, top = 14, bot = 21) =>
  inRect(col, row, cx - 3, top, cx + 3, bot);

const straps = (col: number, row: number, cx: number) =>
  inRect(col, row, cx - 2.1, 15, cx - 1.3, 20.5) ||
  inRect(col, row, cx + 1.3, 15, cx + 2.1, 20.5);

// ================= POSES =================
type Pose = (
  col: number,
  row: number,
  t: number,
  C: Colors
) => string | null;

const poseWave: Pose = (col, row, t, C) => {
  const cx = 12;
  const cy = 9;
  const handX = 17.5 + Math.sin(t * 0.05) * 1.4;
  const handY = 4.5 + Math.cos(t * 0.035) * 0.5;
  if (carveFace(col, row, cx, cy)) return null;
  if (cap(col, row, cx, cy)) return C.accent;
  if (straps(col, row, cx)) return C.accent;
  if (head(col, row, cx, cy)) return C.body;
  if (inRect(col, row, cx - 1, 13.3, cx + 1, 14.4)) return C.body; // neck
  if (torso(col, row, cx)) return C.body;
  if (segDist(col, row, cx - 2.8, 15, cx - 4.6, 20) <= 1) return C.body; // L arm
  if (inCircle(col, row, cx - 4.6, 20, 1.2)) return C.body;
  if (segDist(col, row, cx + 2.8, 15, cx + 4.6, 12) <= 1) return C.body; // R upper
  if (segDist(col, row, cx + 4.6, 12, handX, handY) <= 1) return C.body; // R fore
  if (inCircle(col, row, handX, handY, 1.35)) return C.body; // hand
  if (legs(col, row, cx)) return C.body;
  return null;
};

const poseCode: Pose = (col, row, t, C) => {
  const cx = 8;
  const cy = 9;
  const bob = Math.abs(Math.sin(t * 0.28)) * 0.7;
  if (carveFace(col, row, cx, cy)) return null;
  if (cap(col, row, cx, cy)) return C.accent;
  // laptop screen (accent) + base
  if (inRect(col, row, 15.5, 14.5, 21, 19)) return C.accent; // screen
  // blinking "code" blips on screen
  if (inCircle(col, row, 17, 16 + ((t * 0.1) % 2), 0.5)) return C.body;
  if (inCircle(col, row, 19.2, 17 - ((t * 0.08) % 2), 0.5)) return C.body;
  if (straps(col, row, cx)) return C.accent;
  if (head(col, row, cx, cy)) return C.body;
  if (inRect(col, row, cx - 1, 13.3, cx + 1, 14.2)) return C.body; // neck
  if (torso(col, row, cx, 14, 20)) return C.body;
  // sitting legs: thighs forward + shins down
  if (inRect(col, row, cx - 2, 20, cx + 6, 21.4)) return C.body; // thighs
  if (segDist(col, row, cx + 5.5, 21.4, cx + 5.5, 26) <= 0.95) return C.body;
  if (segDist(col, row, cx - 1.5, 21.4, cx - 1.5, 26) <= 0.95) return C.body;
  if (inCircle(col, row, cx + 5.8, 26.2, 1.1)) return C.body;
  if (inCircle(col, row, cx - 1.8, 26.2, 1.1)) return C.body;
  // laptop base (deck)
  if (inRect(col, row, 14, 19, 22, 20.4)) return C.body;
  // arms reaching to keyboard, typing bob
  if (segDist(col, row, cx + 2.5, 15, 15.5, 18.5 + bob) <= 1) return C.body;
  if (segDist(col, row, cx + 1.5, 16, 16.5, 19 - bob) <= 1) return C.body;
  if (inCircle(col, row, 15.5, 18.5 + bob, 1)) return C.body;
  if (inCircle(col, row, 16.8, 19 - bob, 1)) return C.body;
  return null;
};

const poseMusic: Pose = (col, row, t, C) => {
  const cx = 10;
  const cy = 9 + Math.sin(t * 0.12) * 0.7; // head bob
  // floating music notes (rise + loop)
  const ph = (t * 0.04) % 1;
  if (note(col, row, 17 + Math.sin(t * 0.1), 8 - ph * 5)) return C.accent;
  const ph2 = (t * 0.04 + 0.5) % 1;
  if (note(col, row, 19.5 + Math.cos(t * 0.12), 9 - ph2 * 5)) return C.accent;
  if (carveFace(col, row, cx, cy)) return null;
  if (headphones(col, row, cx, cy)) return C.accent;
  if (straps(col, row, cx)) return C.accent;
  if (head(col, row, cx, cy)) return C.body;
  if (inRect(col, row, cx - 1, cy + 4, cx + 1, 14.4)) return C.body; // neck
  if (torso(col, row, cx)) return C.body;
  if (legs(col, row, cx)) return C.body;
  // left arm relaxed; right hand up near ear, tapping
  if (segDist(col, row, cx - 2.8, 15, cx - 4.4, 20) <= 1) return C.body;
  if (inCircle(col, row, cx - 4.4, 20, 1.1)) return C.body;
  const tap = Math.sin(t * 0.18) * 0.6;
  if (segDist(col, row, cx + 2.8, 15, cx + 4.6, cy + 0.5 + tap) <= 1)
    return C.body;
  if (inCircle(col, row, cx + 4.7, cy + 0.3 + tap, 1.1)) return C.body;
  return null;
};

const poseTrophy: Pose = (col, row, t, C) => {
  const cx = 12;
  const cy = 10; // head a touch lower to give the trophy room above
  const lift = Math.sin(t * 0.08) * 0.3;
  const ty = 1.4 + lift; // trophy bowl top row
  // no grad cap here — the trophy is the hero of this pose
  // trophy (accent): wide bowl -> taper -> stem -> base, with handles
  if (inRect(col, row, cx - 2.4, ty, cx + 2.4, ty + 1)) return C.accent; // bowl rim
  if (segDist(col, row, cx - 2.4, ty + 1, cx - 0.9, ty + 2.4) <= 0.55)
    return C.accent;
  if (segDist(col, row, cx + 2.4, ty + 1, cx + 0.9, ty + 2.4) <= 0.55)
    return C.accent;
  if (inRect(col, row, cx - 0.7, ty + 2.2, cx + 0.7, ty + 3.2)) return C.accent; // stem
  if (inRect(col, row, cx - 1.8, ty + 3.2, cx + 1.8, ty + 3.9)) return C.accent; // base
  if (segDist(col, row, cx - 2.6, ty + 0.3, cx - 3.6, ty + 1.2) <= 0.5)
    return C.accent; // handle L
  if (segDist(col, row, cx + 2.6, ty + 0.3, cx + 3.6, ty + 1.2) <= 0.5)
    return C.accent; // handle R
  if (carveFace(col, row, cx, cy)) return null;
  if (head(col, row, cx, cy)) return C.body;
  if (inRect(col, row, cx - 1, 14, cx + 1, 15)) return C.body; // neck
  if (torso(col, row, cx, 15, 21)) return C.body;
  if (legs(col, row, cx)) return C.body;
  // both arms raised toward the trophy base
  if (segDist(col, row, cx - 2.8, 15.5, cx - 1.4, ty + 3.5) <= 1) return C.body;
  if (segDist(col, row, cx + 2.8, 15.5, cx + 1.4, ty + 3.5) <= 1) return C.body;
  return null;
};

const posePresent: Pose = (col, row, t, C) => {
  const cx = 12;
  const cy = 9;
  const tw = (Math.sin(t * 0.15) + 1) * 0.5; // 0..1 sparkle twinkle
  if (carveFace(col, row, cx, cy)) return null;
  if (cap(col, row, cx, cy)) return C.accent;
  if (tw > 0.4 && sparkle(col, row, cx - 6.5, 12)) return C.accent;
  if (tw < 0.6 && sparkle(col, row, cx + 6.5, 11)) return C.accent;
  if (straps(col, row, cx)) return C.accent;
  if (head(col, row, cx, cy)) return C.body;
  if (inRect(col, row, cx - 1, 13.3, cx + 1, 14.4)) return C.body;
  if (torso(col, row, cx)) return C.body;
  if (legs(col, row, cx)) return C.body;
  // both arms out, palms up
  if (segDist(col, row, cx - 2.8, 15, cx - 5.5, 13) <= 1) return C.body;
  if (inCircle(col, row, cx - 5.7, 12.7, 1.1)) return C.body;
  if (segDist(col, row, cx + 2.8, 15, cx + 5.5, 12.5) <= 1) return C.body;
  if (inCircle(col, row, cx + 5.7, 12.2, 1.1)) return C.body;
  return null;
};

const posePaint: Pose = (col, row, t, C) => {
  const cx = 9;
  const cy = 9;
  const dab = Math.sin(t * 0.2) * 1; // brush dabbing
  if (carveFace(col, row, cx, cy)) return null;
  if (cap(col, row, cx, cy)) return C.accent;
  // easel canvas (accent frame) on the right
  if (
    inRect(col, row, 16, 12, 22, 20) &&
    !inRect(col, row, 17, 13, 21, 19)
  )
    return C.accent; // frame
  // a couple of paint strokes inside
  if (inRect(col, row, 17.5, 14, 20, 14.8)) return C.body;
  if (inRect(col, row, 18, 16, 20.5, 16.8)) return C.accent;
  if (straps(col, row, cx)) return C.accent;
  if (head(col, row, cx, cy)) return C.body;
  if (inRect(col, row, cx - 1, 13.3, cx + 1, 14.4)) return C.body;
  if (torso(col, row, cx)) return C.body;
  if (legs(col, row, cx)) return C.body;
  // left arm down
  if (segDist(col, row, cx - 2.8, 15, cx - 4.4, 20) <= 1) return C.body;
  if (inCircle(col, row, cx - 4.4, 20, 1.1)) return C.body;
  // right arm to canvas with brush
  const bx = 16 + dab;
  if (segDist(col, row, cx + 2.8, 15, bx, 16) <= 1) return C.body;
  if (inCircle(col, row, bx, 16, 0.9)) return C.body;
  if (inCircle(col, row, bx + 1, 16, 0.6)) return C.accent; // brush tip
  return null;
};

const POSES: Record<string, Pose> = {
  wave: poseWave,
  code: poseCode,
  music: poseMusic,
  trophy: poseTrophy,
  present: posePresent,
  paint: posePaint,
};

const POSE_BY_SECTION: Record<string, string> = {
  top: "wave",
  projects: "code",
  about: "music",
  skills: "present",
  experience: "trophy",
  beyond: "paint",
  contact: "wave",
};

const FOLLOW_SECTIONS = Object.keys(POSE_BY_SECTION);

export default function DotMatrixPet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string>("top");
  const reducedRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(SCALE_BIG);
  const sx = useSpring(x, { stiffness: 90, damping: 18, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 90, damping: 18, mass: 0.7 });
  const sScale = useSpring(scale, { stiffness: 140, damping: 20 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => (reducedRef.current = mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) activeRef.current = e.target.id;
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    FOLLOW_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * CELL * dpr;
    canvas.height = H * CELL * dpr;
    ctx.scale(dpr, dpr);

    const readColors = (): Colors => {
      const cs = getComputedStyle(document.documentElement);
      return {
        body: cs.getPropertyValue("--foreground").trim() || "#e5e5e5",
        accent: cs.getPropertyValue("--primary").trim() || "#a78bfa",
      };
    };
    let colors = readColors();
    const themeObserver = new MutationObserver(() => (colors = readColors()));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const r = CELL * 0.42;
    let raf = 0;
    let t = 0;
    let currentPose = "wave";
    let poof = -1; // frames since pose change (-1 = inactive)

    const dot = (cx: number, cy: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 6.2832);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      t += 1;
      const reduced = reducedRef.current;

      // ---- pose selection + poof on change ----
      const poseKey = POSE_BY_SECTION[activeRef.current] ?? "wave";
      if (poseKey !== currentPose) {
        currentPose = poseKey;
        poof = reduced ? -1 : 0;
      }
      const pose = POSES[currentPose] ?? poseWave;

      // ---- scroll choreography (responsive) ----
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      const spriteW = W * CELL;
      const spriteH = H * CELL;
      const sBig = mobile ? 0.62 : SCALE_BIG;
      const sSmall = mobile ? 0.33 : SCALE_SMALL;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.55)));
      const s = sBig + (sSmall - sBig) * p;

      let heroX: number;
      let heroY: number;
      let followX: number;
      let followY: number;

      if (mobile) {
        // hero: bottom-right of the first screen (clear of stacked text);
        // then it shrinks and settles into the bottom-right corner as a
        // companion that keeps doing each section's activity.
        heroX = vw - spriteW * sBig - 12;
        heroY = vh - spriteH * sBig - 26;
        followX = vw - spriteW * sSmall - 6;
        followY = vh - spriteH * sSmall - 8;
      } else {
        heroX = vw - spriteW - Math.max(28, vw * 0.05);
        heroY = vh * 0.24;
        followX = heroX;
        followY = heroY;
        const sec = document.getElementById(activeRef.current);
        const heading = sec?.querySelector("h1, h2");
        if (heading) {
          const hr = heading.getBoundingClientRect();
          const smallW = spriteW * sSmall;
          const smallH = spriteH * sSmall;
          followX = Math.max(10, hr.left - smallW - 12);
          followY = Math.max(70, hr.top + hr.height / 2 - smallH / 2);
        }
      }
      const tx = heroX + (followX - heroX) * p;
      const ty = heroY + (followY - heroY) * p;
      if (reduced) {
        x.jump(tx);
        y.jump(ty);
        scale.jump(s);
      } else {
        x.set(tx);
        y.set(ty);
        scale.set(s);
      }

      // ---- draw ----
      ctx.clearRect(0, 0, W * CELL, H * CELL);
      const drawPose = poof >= 0 && poof < 6 ? null : pose; // brief hide at swap
      if (drawPose) {
        for (let col = 0; col < W; col++) {
          for (let rw = 0; rw < H; rw++) {
            const c = drawPose(col, rw, t, colors);
            if (c) dot(col * CELL + CELL / 2, rw * CELL + CELL / 2, c);
          }
        }
      }
      // poof burst
      if (poof >= 0) {
        const rad = poof * 0.9;
        const a = Math.max(0, 1 - poof / 16);
        for (let i = 0; i < 12; i++) {
          const ang = (i / 12) * 6.2832;
          const pcol = 12 + Math.cos(ang) * rad;
          const prow = 13 + Math.sin(ang) * rad;
          dot(pcol * CELL + CELL / 2, prow * CELL + CELL / 2, colors.accent, a);
        }
        poof += 1;
        if (poof > 16) poof = -1;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
    };
  }, [x, y, scale]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: sx,
        y: sy,
        scale: sScale,
        transformOrigin: "top left",
        width: W * CELL,
        height: H * CELL,
      }}
      className="pointer-events-none fixed left-0 top-0 z-40 block"
    >
      <canvas
        ref={canvasRef}
        style={{ width: W * CELL, height: H * CELL }}
        className="block"
      />
    </motion.div>
  );
}
