'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

/* Encore. One stroke becomes a receding tunnel of phase shifted copies.
   Built from week 2026-W38 prototype b (time tunnel), with the pause remap
   grafted from prototype c and the forward hue shift plus the constant scale
   bone rim grafted from prototype a. Everything is client side and nothing
   leaves the page. */

type Pt = { x: number; y: number; t: number };
type UPt = { x: number; y: number; hue: number; pause: number; nx: number; ny: number; tn: number };
type Stroke = { pts: UPt[]; dur: number; id: string; halfW: number; halfH: number };
type Params = { copies: number; drift: number; decay: number };
type SavedPt = [number, number, number];
type Saved = { v: 1; pts: SavedPt[]; id: string; dur: number; copies: number; drift: number; decay: number };

const STORE_KEY = 'encore.loop.v1';
const POINTS = 110;
const BONE = '#F4F0E6';
const REVEAL_MS = 900;
const BREATHE_MS = 7500;
/* The canonical export phase. A quarter of the way through the breathing cycle the
   organism sits at its widest, so the same loop always exports the same PNG instead
   of whatever frame performance.now() happened to land on. */
const EXPORT_T = BREATHE_MS / 4;
/* Total stroke calls per frame, held roughly flat as the copy count moves. The frame
   timer below lowers it when the device cannot keep up. */
const CHUNK_BUDGET = 1250;

const DEFAULTS: Params = { copies: 180, drift: 34, decay: 0.72 };

function mod360(v: number) {
  return ((v % 360) + 360) % 360;
}

function hueLerp(a: number, b: number, t: number) {
  let d = mod360(b - a);
  if (d > 180) d -= 360;
  return mod360(a + d * t);
}

/* Fat finger smoothing. A weighted five point window on position only, run twice.
   Timestamps are copied through untouched, so pauses and speed changes survive
   exactly as drawn: the shake goes, the hand stays. */
function smoothPath(raw: Pt[]): Pt[] {
  if (raw.length < 5) return raw;
  const w = [1, 3, 5, 3, 1];
  let cur = raw;
  for (let pass = 0; pass < 2; pass++) {
    const out: Pt[] = [];
    for (let i = 0; i < cur.length; i++) {
      let sx = 0;
      let sy = 0;
      let sw = 0;
      for (let k = -2; k <= 2; k++) {
        const j = i + k;
        if (j < 0 || j >= cur.length) continue;
        const wt = w[k + 2];
        sx += cur[j].x * wt;
        sy += cur[j].y * wt;
        sw += wt;
      }
      out.push({ x: sx / sw, y: sy / sw, t: cur[i].t });
    }
    cur = out;
  }
  return cur;
}

function prepare(rawIn: Pt[]): Stroke {
  const raw = smoothPath(rawIn);
  const src: Pt[] = [];
  for (const p of raw) {
    const last = src[src.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.01 || Math.abs(last.y - p.y) > 0.01) src.push(p);
  }
  while (src.length < 2) src.push({ ...src[0], x: src[0].x + 1, t: src[0].t + 1 });

  const seg: number[] = [0];
  let total = 0;
  for (let i = 1; i < src.length; i++) {
    total += Math.hypot(src[i].x - src[i - 1].x, src[i].y - src[i - 1].y);
    seg.push(total);
  }
  if (total < 1) total = 1;

  const sampled: Pt[] = [];
  let cursor = 1;
  for (let k = 0; k < POINTS; k++) {
    const target = (total * k) / (POINTS - 1);
    while (cursor < src.length - 1 && seg[cursor] < target) cursor++;
    const a = src[cursor - 1];
    const b = src[cursor];
    const span = seg[cursor] - seg[cursor - 1] || 1;
    const f = Math.min(1, Math.max(0, (target - seg[cursor - 1]) / span));
    sampled.push({
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      t: a.t + (b.t - a.t) * f,
    });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of sampled) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY, 40);

  const dur = Math.max(1, sampled[sampled.length - 1].t - sampled[0].t);
  const t0 = sampled[0].t;

  const dwell: number[] = [];
  const speed: number[] = [];
  for (let k = 0; k < POINTS; k++) {
    const a = sampled[Math.max(0, k - 1)];
    const b = sampled[Math.min(POINTS - 1, k + 1)];
    const dt = Math.max(0.5, b.t - a.t);
    const ds = Math.max(0.5, Math.hypot(b.x - a.x, b.y - a.y));
    dwell.push(dt / Math.max(1, ds));
    speed.push(ds / dt);
  }
  const maxDwell = Math.max(...dwell) || 1;
  const maxSpeed = Math.max(...speed) || 1;

  const pts: UPt[] = [];
  for (let k = 0; k < POINTS; k++) {
    const p = sampled[k];
    const a = sampled[Math.max(0, k - 1)];
    const b = sampled[Math.min(POINTS - 1, k + 1)];
    let tx = b.x - a.x;
    let ty = b.y - a.y;
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;

    const prev = sampled[Math.max(0, k - 3)];
    const next = sampled[Math.min(POINTS - 1, k + 3)];
    const a1 = Math.atan2(p.y - prev.y, p.x - prev.x);
    const a2 = Math.atan2(next.y - p.y, next.x - p.x);
    let turn = Math.abs(a2 - a1);
    if (turn > Math.PI) turn = 2 * Math.PI - turn;
    const curve = Math.min(1, turn / (Math.PI * 0.55));

    const prog = k / (POINTS - 1);
    const v = speed[k] / maxSpeed;
    let hue = prog < 0.5 ? hueLerp(165, 75, prog / 0.5) : hueLerp(75, 355, (prog - 0.5) / 0.5);
    const violet = Math.max(0, Math.min(1, (v - 0.55) / 0.45)) * curve;
    if (violet > 0.08) hue = hueLerp(hue, 255, Math.min(0.85, violet));

    pts.push({
      x: (p.x - cx) / span,
      y: (p.y - cy) / span,
      hue,
      pause: Math.min(1, dwell[k] / maxDwell),
      nx: -ty,
      ny: tx,
      tn: (p.t - t0) / dur,
    });
  }

  /* The loop id is hashed from the resampled path alone, never from the clock.
     Draw the same shape twice and you get the same loop back, which is the whole
     point of giving it a name. Duration already has its own slot on the receipt. */
  let h = 2166136261;
  for (const p of pts) {
    h ^= Math.round((p.x + 2) * 4096) | 0;
    h = Math.imul(h, 16777619);
    h ^= Math.round((p.y + 2) * 4096) | 0;
    h = Math.imul(h, 16777619);
  }
  const id = (h >>> 0).toString(36).toUpperCase().slice(0, 4).padStart(4, '0');

  return {
    pts,
    dur,
    id,
    halfW: Math.max(0.05, (maxX - minX) / 2 / span),
    halfH: Math.max(0.05, (maxY - minY) / 2 / span),
  };
}

/* Overlapping chunks at half alpha. Each point is covered by two neighbouring hues
   that add to the same ink, so the ramp crossfades instead of banding at a border.
   Flat per chunk colour is what put hard seams in all three prototypes. */
function strokeRamp(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  S: number,
  alpha: number,
  lw: number,
  hueShift: number,
  chunks: number,
  amp: number,
) {
  const pts = s.pts;
  const n = pts.length;
  const per = (n - 1) / chunks;
  const aStr = (Math.round(alpha * 5000) / 10000).toString();
  ctx.lineWidth = lw;
  for (let c = 0; c <= chunks; c++) {
    const a = c === 0 ? 0 : Math.round((c - 0.5) * per);
    const b = c === chunks ? n - 1 : Math.min(n - 1, Math.round((c + 0.5) * per));
    if (b <= a) continue;
    const mid = pts[Math.min(n - 1, Math.round(c * per))];
    ctx.strokeStyle = 'hsla(' + Math.round(mod360(mid.hue + hueShift)) + ',92%,62%,' + aStr + ')';
    ctx.beginPath();
    for (let k = a; k <= b; k++) {
      const q = pts[k];
      const d = amp * q.pause;
      const X = (q.x + q.nx * d) * S;
      const Y = (q.y + q.ny * d) * S;
      if (k === a) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    }
    ctx.stroke();
  }
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  S: number,
  tau: number,
  alpha: number,
  lw: number,
  amp: number,
) {
  const pts = s.pts;
  let idx = 0;
  for (let k = 0; k < pts.length; k++) {
    if (pts[k].tn >= tau) {
      idx = k;
      break;
    }
    idx = k;
  }
  const a = Math.max(0, idx - 5);
  const b = Math.min(pts.length - 1, idx + 1);
  ctx.strokeStyle = 'rgba(244,240,230,' + Math.round(alpha * 1000) / 1000 + ')';
  ctx.lineWidth = lw;
  ctx.beginPath();
  for (let k = a; k <= b; k++) {
    const q = pts[k];
    const d = amp * q.pause;
    const X = (q.x + q.nx * d) * S;
    const Y = (q.y + q.ny * d) * S;
    if (k === a) ctx.moveTo(X, Y);
    else ctx.lineTo(X, Y);
  }
  ctx.stroke();
}

function drawCopy(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  S: number,
  u: number,
  p: Params,
  tMs: number,
  chunks: number,
  depth: number,
  density: number,
  pxLw: number,
  breatheScale: number,
  breathePhase: number,
  head: boolean,
  reduced: boolean,
) {
  const sc = (1 / (1 + u * depth)) * breatheScale;
  const ang = u * p.drift * (Math.PI / 180) * 2.4 + breathePhase;
  const alpha = 0.95 * density * Math.pow(p.decay, (1 - u) * 4);
  const lw = (pxLw * (0.7 + 0.6 * u)) / sc;
  /* Where the hand hesitated, the tunnel wall bulges. Carried from prototype c at
     a fraction of its amplitude, so the gesture stays legible without flattening
     the spectacle the tunnel is here for. */
  const wob = reduced ? 1 : 1 + 0.4 * Math.sin(Math.PI * 2 * (tMs / 2600 + u * 1.2));
  const amp = 0.055 * (0.25 + u) * wob;
  ctx.save();
  ctx.translate(0, -0.05 * S * u);
  ctx.rotate(ang);
  ctx.scale(sc, sc);
  strokeRamp(ctx, s, S, alpha, lw, 42 * u, chunks, amp);
  if (head) {
    /* Reduced motion freezes the head where it sits. Each copy keeps its own offset,
       so the tunnel still reads as a spiral, but no coordinate depends on the clock
       and the only thing left moving is the slow opacity pulse. */
    const tau = reduced
      ? u * 0.35 - Math.floor(u * 0.35)
      : (((tMs / Math.max(700, s.dur * 1.6) + u * 0.35) % 1) + 1) % 1;
    drawHead(ctx, s, S, tau, alpha * 0.9, lw * 1.7, amp);
  }
  ctx.restore();
}

/* One copy at the front of the tunnel, unscaled, in bone. Prototype a proved an
   unshifted stack reads as a defined silhouette, so the original line stays
   identifiable forever instead of flashing for 240 ms and being swallowed. */
function drawRim(
  ctx: CanvasRenderingContext2D,
  s: Stroke,
  S: number,
  alpha: number,
  pxLw: number,
  breatheScale: number,
  breathePhase: number,
) {
  ctx.save();
  ctx.rotate(breathePhase);
  ctx.scale(breatheScale, breatheScale);
  ctx.strokeStyle = 'rgba(244, 240, 230, ' + alpha.toFixed(3) + ')';
  ctx.lineWidth = (pxLw * 1.15) / breatheScale;
  ctx.beginPath();
  s.pts.forEach((q, k) => (k === 0 ? ctx.moveTo(q.x * S, q.y * S) : ctx.lineTo(q.x * S, q.y * S)));
  ctx.stroke();
  ctx.restore();
}

function renderOrganism(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  s: Stroke,
  p: Params,
  tMs: number,
  revealCount: number,
  revealAlpha: number,
  reduced: boolean,
  budget: number,
  bottomInset = 0,
) {
  /* The phone tray sits over the bottom of a full viewport canvas, so the organism
     is centred in what is left rather than in the raw canvas box. Export passes zero
     and gets the same square picture it always did. */
  const H2 = Math.max(120, H - bottomInset);
  /* Fit both axes, not the larger one. A wide flat stroke normalised against its
     long side used to sit small and off centre; this scales against whichever axis
     runs out of room first. */
  const S = Math.min((W * 0.44) / s.halfW, (H2 * 0.4) / s.halfH);
  const n = Math.max(2, Math.round(p.copies));
  const shown = Math.max(1, Math.round(n * revealCount));
  /* Copy count changes the geometry, not just the density. Few copies is a short
     fat tunnel of separate blades, many copies is a long one receding into a dark
     eye. Between 60 and 240 the prototype picture never moved. */
  const depth = 1.0 + n / 110;
  const density = Math.min(1.9, Math.max(0.55, Math.pow(170 / n, 0.7)));
  const chunks = Math.max(6, Math.min(16, Math.round(budget / n)));
  const cycle = (tMs / BREATHE_MS) * Math.PI * 2;
  const breatheScale = reduced ? 1 : 0.985 + 0.03 * (0.5 + 0.5 * Math.sin(cycle));
  const breathePhase = reduced ? 0 : ((6 * Math.PI) / 180) * Math.sin(cycle);
  const slowPulse = reduced ? 0.72 + 0.28 * (0.5 + 0.5 * Math.sin((tMs / 16000) * Math.PI * 2)) : 1;
  const headStep = Math.max(1, Math.round(n / 30));
  const pxLw = Math.max(0.8, S / 300);

  ctx.save();
  ctx.translate(W / 2, H2 * 0.5 + 0.025 * S);
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = Math.min(1, revealAlpha) * slowPulse;
  for (let i = 0; i < shown; i++) {
    const u = n === 1 ? 0 : i / (n - 1);
    drawCopy(ctx, s, S, u, p, tMs, chunks, depth, density, pxLw, breatheScale, breathePhase, i % headStep === 0, reduced);
  }
  drawRim(ctx, s, S, 0.9 * Math.min(1, revealAlpha * 1.4), pxLw, breatheScale, breathePhase);
  ctx.restore();
}

function drawStageRing(ctx: CanvasRenderingContext2D, W: number, H: number, bottomInset = 0) {
  const H2 = Math.max(120, H - bottomInset);
  const r = 0.3 * Math.min(W, H2);
  ctx.save();
  ctx.strokeStyle = 'rgba(139, 135, 149, 0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(W / 2, H2 * 0.5, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

const SLIDERS = 'h-11 w-full cursor-pointer appearance-none bg-transparent outline-none ' +
  '[&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#8B8795]/35 ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:h-[21px] [&::-webkit-slider-thumb]:w-[21px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--enc-accent)] ' +
  '[&::-moz-range-track]:h-[3px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#8B8795]/35 ' +
  '[&::-moz-range-thumb]:h-[21px] [&::-moz-range-thumb]:w-[21px] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--enc-accent)]';

export default function EncoreClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wellRef = useRef<HTMLDivElement | null>(null);
  const trayRef = useRef<HTMLDivElement | null>(null);
  const insetRef = useRef(0);
  const liveRef = useRef<Pt[]>([]);
  const drawingRef = useRef(false);
  const strokeRef = useRef<Stroke | null>(null);
  const revealRef = useRef(0);
  const flashRef = useRef<Pt[]>([]);
  const reducedRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });
  const savedPtsRef = useRef<SavedPt[] | null>(null);
  const savedIdRef = useRef<{ id: string; dur: number } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const budgetRef = useRef(CHUNK_BUDGET);
  const avgFrameRef = useRef(16);
  const lastFrameRef = useRef(0);

  const { language } = useLanguage();

  const [phase, setPhase] = useState<'idle' | 'drawing' | 'result'>('idle');
  const [copies, setCopies] = useState(DEFAULTS.copies);
  const [drift, setDrift] = useState(DEFAULTS.drift);
  const [decay, setDecay] = useState(DEFAULTS.decay);
  const [receipt, setReceipt] = useState<{ id: string; seconds: string } | null>(null);
  const [restored, setRestored] = useState(false);
  const [toast, setToast] = useState('');

  const paramsRef = useRef<Params>(DEFAULTS);
  paramsRef.current = { copies, drift, decay };

  const say = useCallback((msg: string, ms = 2400) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(msg);
    if (msg) toastTimer.current = window.setTimeout(() => setToast(''), ms);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const writeStore = useCallback(() => {
    const pts = savedPtsRef.current;
    const meta = savedIdRef.current;
    if (!pts || !meta) return;
    try {
      const payload: Saved = { v: 1, pts, ...meta, ...paramsRef.current };
      window.localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    } catch {
      /* Private mode or a full quota. The loop on screen is unaffected, so this
         stays silent rather than spending a toast on the visitor's browser settings. */
    }
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const well = wellRef.current;
    if (!canvas || !well) return;
    let raf = 0;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = well.clientWidth;
      const h = well.clientHeight;
      /* The tray overlays the bottom of the canvas on a phone and sits below the
         well on a desktop, so what it costs the picture is measured, not assumed. */
      const tray = trayRef.current;
      const wide = window.matchMedia('(min-width: 768px)').matches;
      insetRef.current = !tray || wide ? 0 : tray.offsetHeight;
      if (w === sizeRef.current.w && h === sizeRef.current.h) return;
      sizeRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(well);
    if (trayRef.current) ro.observe(trayRef.current);
    window.addEventListener('orientationchange', fit);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      /* Copies are budgeted against measured frame time rather than hope. Headless
         desktop numbers are the optimistic ones and a phone is not a desktop. */
      if (lastFrameRef.current) {
        const dt = Math.min(120, now - lastFrameRef.current);
        avgFrameRef.current = avgFrameRef.current * 0.9 + dt * 0.1;
      }
      lastFrameRef.current = now;
      const avg = avgFrameRef.current;
      budgetRef.current = avg > 30 ? 600 : avg > 20 ? 850 : avg < 14 ? CHUNK_BUDGET : budgetRef.current;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { w, h } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#050509';
      ctx.fillRect(0, 0, w, h);

      const s = strokeRef.current;
      if (!s && !drawingRef.current) drawStageRing(ctx, w, h, insetRef.current);

      if (drawingRef.current) {
        const pts = liveRef.current;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#2AF2B8';
        ctx.shadowBlur = 14;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
        ctx.restore();
        const last = pts[pts.length - 1];
        if (last && pts.length > 3) {
          const secs = ((last.t - pts[0].t) / 1000).toFixed(1);
          ctx.save();
          ctx.fillStyle = 'rgba(244, 240, 230, 0.75)';
          ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText(secs + 's', Math.min(w - 40, last.x + 14), Math.max(16, last.y - 10));
          ctx.restore();
        }
      } else if (s) {
        const reduced = reducedRef.current;
        const since = now - revealRef.current;
        const x = Math.min(1, Math.max(0, since / REVEAL_MS));
        /* Two curves, on purpose. Opacity uses the direction's ease out expo so the
           organism arrives fast, but the copy count climbs on a smoothstep so the
           spool is actually visible. Sharing one expo curve put 91 percent of the
           copies on screen inside the first 320 ms and there was nothing to watch. */
        const revealAlpha = reduced ? 1 : x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
        const revealCount = reduced ? 1 : x * x * (3 - 2 * x);
        renderOrganism(ctx, w, h, s, paramsRef.current, now, revealCount, revealAlpha, reduced, budgetRef.current, insetRef.current);
        if (!reduced && since < 240 && flashRef.current.length > 1) {
          const flash = 1 - since / 240;
          ctx.save();
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(244, 240, 230, ' + flash.toFixed(3) + ')';
          ctx.lineWidth = 3;
          ctx.beginPath();
          flashRef.current.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.stroke();
          ctx.restore();
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  /* Restore runs after mount, never during first render. First paint is always the
     same empty stage, which is what keeps a static export's hydration quiet. */
  useEffect(() => {
    let saved: Saved | null = null;
    try {
      const rawStr = window.localStorage.getItem(STORE_KEY);
      if (rawStr) saved = JSON.parse(rawStr) as Saved;
    } catch {
      saved = null;
    }
    if (!saved || saved.v !== 1 || !Array.isArray(saved.pts) || saved.pts.length < 8) return;
    if (typeof saved.id !== 'string' || !saved.id) return;
    const scale = Math.max(1, Math.min(sizeRef.current.w, sizeRef.current.h));
    const pts: Pt[] = saved.pts.map((q) => ({ x: q[0] * scale, y: q[1] * scale, t: q[2] }));
    let s: Stroke;
    try {
      s = prepare(pts);
    } catch {
      return;
    }
    s = { ...s, id: saved.id, dur: saved.dur > 0 ? saved.dur : s.dur };
    savedPtsRef.current = saved.pts;
    savedIdRef.current = { id: s.id, dur: s.dur };
    strokeRef.current = s;
    flashRef.current = [];
    revealRef.current = performance.now();
    if (Number.isFinite(saved.copies)) setCopies(saved.copies);
    if (Number.isFinite(saved.drift)) setDrift(saved.drift);
    if (Number.isFinite(saved.decay)) setDecay(saved.decay);
    setReceipt({ id: s.id, seconds: (s.dur / 1000).toFixed(1) });
    setRestored(true);
    setPhase('result');
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    strokeRef.current = null;
    liveRef.current = [pos(e)];
    setReceipt(null);
    setRestored(false);
    say('');
    setPhase('drawing');
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    liveRef.current.push(pos(e));
  };

  const onUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const pts = liveRef.current;
    if (pts.length < 8) {
      liveRef.current = [];
      setPhase('idle');
      say('That was a dot. Give me a line and I will get carried away.');
      return;
    }
    flashRef.current = pts.slice();
    let s: Stroke;
    try {
      s = prepare(pts);
    } catch {
      liveRef.current = [];
      setPhase('idle');
      say('That stroke came apart on me. One more, a little slower.');
      return;
    }
    const { w, h } = sizeRef.current;
    const span = Math.max(1, Math.min(w, h));
    const t0 = pts[0].t;
    savedPtsRef.current = pts.map((p) => [
      Number(((p.x - w / 2) / span).toFixed(6)),
      Number(((p.y - h / 2) / span).toFixed(6)),
      Math.round(p.t - t0),
    ]);
    savedIdRef.current = { id: s.id, dur: s.dur };
    strokeRef.current = s;
    revealRef.current = performance.now();
    setReceipt({ id: s.id, seconds: (s.dur / 1000).toFixed(1) });
    setPhase('result');
    writeStore();
  };

  /* Tuning is part of the loop, so the tuned version is what comes back next visit. */
  useEffect(() => {
    if (phase !== 'result') return;
    writeStore();
  }, [copies, drift, decay, phase, writeStore]);

  const caption = receipt
    ? 'Loop ' + receipt.id + '. Drawn in ' + receipt.seconds + 's. Running ever since.'
    : '';

  const exportFrame = useCallback(() => {
    const s = strokeRef.current;
    if (!s || !receipt) {
      say('Nothing to keep yet. Give me one line and I will overreact responsibly.', 2000);
      return;
    }
    try {
      const size = 1080;
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const ctx = off.getContext('2d');
      if (!ctx) throw new Error('no context');
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, size, size);
      renderOrganism(ctx, size, size, s, paramsRef.current, EXPORT_T, 1, 1, false, CHUNK_BUDGET);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = BONE;
      ctx.font = '500 22px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(caption, size / 2, size - 52);
      const url = off.toDataURL('image/png');
      (window as unknown as Record<string, unknown>).__encoreExport = url;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'encore-loop-' + receipt.id + '.png';
      a.click();
      say('Kept. Try explaining that as a doodle.');
    } catch {
      say('The frame refused the download. The loop is still yours.');
    }
  }, [receipt, caption, say]);

  const copyCaption = useCallback(async () => {
    if (!caption) {
      say('Nothing to keep yet. Give me one line and I will overreact responsibly.', 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(caption);
      say('Caption copied. For anywhere that strips the context off a picture.');
      return;
    } catch {
      /* Clipboard permission is not a failure worth a dead end, so fall through. */
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = caption;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      say('Caption copied. For anywhere that strips the context off a picture.');
    } catch {
      say('The clipboard said no. The caption is on screen, take it by hand.');
    }
  }, [caption, say]);

  const reset = () => {
    strokeRef.current = null;
    liveRef.current = [];
    flashRef.current = [];
    savedPtsRef.current = null;
    savedIdRef.current = null;
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch {
      /* Nothing to clean up if the store was never writable. */
    }
    setReceipt(null);
    setRestored(false);
    say('');
    setPhase('idle');
  };

  return (
    <div className="text-[#F4F0E6]">
      <header className="sr-only md:not-sr-only md:mb-4">
        <h1 className="text-[30px] font-semibold leading-none tracking-tight sm:text-[44px]">Encore</h1>
        <p className="mt-2 text-[13px] leading-snug text-[#8B8795]">
          Draw one line. I will give it a second career.
        </p>
      </header>

      {/* On a phone the stage is the whole page: a full viewport drawing instrument
          with the controls fixed under the thumb. From md up it folds back into the
          experiments column, which is where it already worked. */}
      <div
        ref={wellRef}
        className="fixed inset-0 z-30 overflow-hidden overscroll-none bg-[#050509] md:relative md:inset-auto md:z-auto md:h-[clamp(320px,52dvh,520px)] md:rounded-lg"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-label="Drawing surface. Draw one stroke and lift to start the encore."
        />

        {/* The site header is behind the stage on a phone, so the way out lives here. */}
        <Link
          prefetch={false}
          href="/experiments/"
          className="absolute left-2 top-1 z-20 inline-flex min-h-11 items-center px-2 text-[12px] font-semibold text-[#8B8795] md:hidden"
        >
          {language === 'pl' ? 'Laboratorium' : 'Back to the lab'}
        </Link>

        {phase !== 'result' && (
          <p
            className={
              'pointer-events-none absolute left-0 right-0 top-[62%] z-10 px-4 text-center text-[12px] font-semibold text-[#8B8795] transition-opacity duration-300 md:top-[68%] ' +
              (phase === 'drawing' ? 'opacity-40' : 'opacity-100')
            }
          >
            {phase === 'drawing' ? 'Lift to start the encore.' : 'One stroke. Lift when you are done.'}
          </p>
        )}

        {phase === 'result' && (
          <div className="pointer-events-none absolute bottom-3 left-4 right-4 z-10 hidden md:block">
            {restored && (
              <p className="mb-1 text-[12px] font-semibold text-[#C8FF3D]">Your last loop is still breathing.</p>
            )}
            <p className="text-[12px] tabular-nums leading-snug text-[#F4F0E6]">{caption}</p>
          </div>
        )}

        {toast && (
          <p className="pointer-events-none absolute left-4 right-4 top-14 z-20 text-[12px] leading-snug text-[#C8FF3D] md:top-3">
            {toast}
          </p>
        )}
      </div>

      {/* Fixed thumb tray on a phone, ordinary controls below the well on a desktop. */}
      <div
        ref={trayRef}
        className="fixed inset-x-0 bottom-0 z-40 flex min-h-[112px] flex-col justify-end border-t border-[#8B8795]/25 bg-[#050509]/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm md:static md:z-auto md:mt-4 md:min-h-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:backdrop-blur-none"
      >
        {phase === 'result' && (
          <div className="mb-2 md:hidden">
            {restored && (
              <p className="text-[12px] font-semibold text-[#C8FF3D]">Your last loop is still breathing.</p>
            )}
            <p className="text-[12px] tabular-nums leading-snug text-[#F4F0E6]">{caption}</p>
          </div>
        )}

        {/* The shell puts this notice above the page, which the stage now covers. */}
        {language === 'pl' && (
          <p lang="pl" className="mb-2 text-[12px] leading-snug text-[#8B8795] md:hidden">
            Ten eksperyment jest na razie dostępny tylko po angielsku.
          </p>
        )}

        {phase === 'result' && (
          <div className="mb-2 grid grid-cols-3 gap-3 md:mb-3">
            <label className="flex flex-col rounded focus-within:outline focus-within:outline-1 focus-within:outline-[#6A4CFF]">
              <span className="text-[12px] font-semibold text-[#8B8795]">Copies</span>
              <input
                type="range"
                min={60}
                max={240}
                step={1}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                className={SLIDERS}
                style={{ ['--enc-accent' as string]: '#2AF2B8' }}
                aria-label="Copies"
              />
            </label>
            <label className="flex flex-col rounded focus-within:outline focus-within:outline-1 focus-within:outline-[#6A4CFF]">
              <span className="text-[12px] font-semibold text-[#8B8795]">Drift</span>
              <input
                type="range"
                min={-80}
                max={80}
                step={1}
                value={drift}
                onChange={(e) => setDrift(Number(e.target.value))}
                className={SLIDERS}
                style={{ ['--enc-accent' as string]: '#C8FF3D' }}
                aria-label="Drift"
              />
            </label>
            <label className="flex flex-col rounded focus-within:outline focus-within:outline-1 focus-within:outline-[#6A4CFF]">
              <span className="text-[12px] font-semibold text-[#8B8795]">Decay</span>
              <input
                type="range"
                min={0.45}
                max={0.9}
                step={0.01}
                value={decay}
                onChange={(e) => setDecay(Number(e.target.value))}
                className={SLIDERS}
                style={{ ['--enc-accent' as string]: '#FF4D5A' }}
                aria-label="Decay"
              />
            </label>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {phase === 'result' ? (
            <button
              onClick={reset}
              className="min-h-11 rounded-full border border-[#8B8795]/40 px-4 text-[13px] font-semibold text-[#8B8795]"
            >
              Draw another
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={exportFrame}
            className={
              'min-h-11 rounded-full px-5 text-[13px] font-semibold transition-colors ' +
              (receipt ? 'bg-[#F4F0E6] text-[#020204]' : 'bg-[#8B8795]/15 text-[#8B8795]')
            }
          >
            Keep this frame
          </button>
        </div>

        {phase === 'result' && (
          <button
            onClick={copyCaption}
            className="mt-1 inline-flex min-h-11 items-center self-start text-[12px] font-semibold text-[#8B8795] underline underline-offset-4 hover:text-[#F4F0E6] md:mt-3"
          >
            Copy the caption
          </button>
        )}

        <p className="mt-1 text-[12px] leading-relaxed text-[#8B8795] md:mt-6">
          The loop you draw is saved in this browser so it comes back next visit, and any
          tab on this device can read it. Nothing is uploaded, no account, no gallery, and
          the only thing that leaves is the PNG you keep.
        </p>
      </div>
    </div>
  );
}
