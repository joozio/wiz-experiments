'use client';

/*
 * The Mandelbrot Set — WIZ edition.
 *
 * One rule, and the most intricate object in mathematics falls out of it.
 * Pick a point c on the complex plane. Start at z = 0 and repeat
 *
 *     z  ->  z*z + c
 *
 * If the running number z stays bounded forever, the point c belongs to the set
 * and we paint it black (the "lake"). If z escapes to infinity, c is outside the
 * set, and we colour it by HOW MANY steps it took to break free — the escape
 * time. That is the whole algorithm. Out of it comes a shape whose boundary is
 * infinitely long yet encloses a finite area, where the same buds, spirals,
 * seahorses and lightning bolts recur at every level of zoom, and where, buried
 * deep in the filaments, sit perfect miniature copies of the entire set, forever.
 *
 * Dive into the boundary by clicking and the detail never runs dry. Hover over
 * any point and its JULIA set renders live in the side window: the Mandelbrot
 * set is secretly the catalogue of every Julia set at once — the exact map of
 * which seeds give a single connected piece and which shatter into dust.
 *
 * Discovered (not invented) by Benoit Mandelbrot in 1980 on an IBM mainframe.
 * This is an honest live escape-time render, not a stored image. Everything
 * runs in your browser, client-side.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ---- resolution + views ----------------------------------------------------
const RES = 640; // main canvas internal resolution (square)
const PREV = 184; // side preview / minimap resolution (square)
const PAL_SIZE = 1024;
const DENSITY = PAL_SIZE / 22; // colour bands per unit of smooth escape count

const HOME = { cx: -0.5, cy: 0, span: 3.0 }; // full Mandelbrot view (re: -2..1)
const JULIA_HOME = { cx: 0, cy: 0, span: 3.2 };
const MINI_VIEW = { cx: -0.5, cy: 0, span: 3.0 }; // the "you are here" minimap

const DIVE = 2.6; // click-to-dive zoom factor
const WHEEL = 1.32; // wheel zoom step
const SPAN_FLOOR = 1e-15; // 64-bit doubles run out of precision near here

// little-endian RGBA: (A<<24)|(B<<16)|(G<<8)|R
const INTERIOR = (255 << 24) | (0x14 << 16) | (0x09 << 8) | 0x0a; // near-black violet

type Mode = 'mandelbrot' | 'julia';
type View = { cx: number; cy: number; span: number };
type Seed = { x: number; y: number };

// ---- palettes --------------------------------------------------------------
const PALETTES: { name: string; stops: number[][] }[] = [
  { name: 'Nebula', stops: [[12, 10, 30], [76, 29, 149], [45, 212, 191], [250, 240, 200], [217, 119, 6]] },
  { name: 'Ember', stops: [[10, 6, 16], [124, 18, 18], [220, 38, 38], [251, 146, 60], [254, 240, 180]] },
  { name: 'Ice', stops: [[4, 10, 28], [30, 58, 138], [56, 189, 248], [186, 230, 253], [240, 249, 255]] },
];

function buildPalette(stops: number[][]): Uint32Array {
  const pal = new Uint32Array(PAL_SIZE);
  const n = stops.length;
  for (let i = 0; i < PAL_SIZE; i++) {
    const t = (i / PAL_SIZE) * n;
    const k = Math.floor(t) % n;
    const f = t - Math.floor(t);
    const c0 = stops[k];
    const c1 = stops[(k + 1) % n];
    const r = Math.round(c0[0] + (c1[0] - c0[0]) * f);
    const g = Math.round(c0[1] + (c1[1] - c0[1]) * f);
    const b = Math.round(c0[2] + (c1[2] - c0[2]) * f);
    pal[i] = (255 << 24) | (b << 16) | (g << 8) | r;
  }
  return pal;
}

// ---- the one rule: z -> z*z + c --------------------------------------------
// Returns the smooth (fractional) escape count, or -1 if the point never escaped.
function escape(zx: number, zy: number, cx: number, cy: number, maxIter: number): number {
  let zx2 = zx * zx;
  let zy2 = zy * zy;
  let i = 0;
  while (i < maxIter && zx2 + zy2 <= 256) {
    zy = 2 * zx * zy + cy;
    zx = zx2 - zy2 + cx;
    zx2 = zx * zx;
    zy2 = zy * zy;
    i++;
  }
  if (i >= maxIter) return -1;
  // normalised iteration count for continuous colouring (bailout radius 16)
  const mag = Math.sqrt(zx2 + zy2);
  return Math.max(0, i + 1 - Math.log(Math.log(mag)) / Math.LN2);
}

// quick interior test — the main cardioid and the period-2 bulb, where almost
// all of the black lives. Saves running the full loop on the body of the set.
function inCardioid(cx: number, cy: number): boolean {
  const xm = cx - 0.25;
  const q = xm * xm + cy * cy;
  if (q * (q + xm) <= 0.25 * cy * cy) return true;
  const xp = cx + 1;
  return xp * xp + cy * cy <= 0.0625;
}

function maxIterFor(span: number, baseSpan: number): number {
  const zoom = Math.max(1, baseSpan / span);
  return Math.min(2400, Math.round(160 + 56 * Math.log2(zoom)));
}

function viewToComplex(v: View, px: number, py: number) {
  return {
    re: v.cx + ((px - RES / 2) / RES) * v.span,
    im: v.cy - ((py - RES / 2) / RES) * v.span,
  };
}

function computeMandelRow(mu: Float32Array, v: View, maxIter: number, y: number) {
  const im = v.cy - ((y - RES / 2) / RES) * v.span;
  const left = v.cx - v.span / 2;
  const dRe = v.span / RES;
  const row = y * RES;
  let re = left;
  for (let x = 0; x < RES; x++, re += dRe) {
    mu[row + x] = inCardioid(re, im) ? -1 : escape(0, 0, re, im, maxIter);
  }
}

function computeJuliaRow(mu: Float32Array, v: View, seed: Seed, maxIter: number, y: number) {
  const zy = v.cy - ((y - RES / 2) / RES) * v.span;
  const left = v.cx - v.span / 2;
  const dRe = v.span / RES;
  const row = y * RES;
  let zx = left;
  for (let x = 0; x < RES; x++, zx += dRe) {
    mu[row + x] = escape(zx, zy, seed.x, seed.y, maxIter);
  }
}

// fast blocky preview so the whole frame fills instantly, then refines row-by-row
function coarse(mu: Float32Array, v: View, maxIter: number, mode: Mode, seed: Seed) {
  const C = 8;
  const left = v.cx - v.span / 2;
  const dRe = v.span / RES;
  const ci = Math.min(maxIter, 240);
  for (let by = 0; by < RES; by += C) {
    const sy = Math.min(by + (C >> 1), RES - 1);
    const coord2 = v.cy - ((sy - RES / 2) / RES) * v.span;
    const yEnd = Math.min(by + C, RES);
    for (let bx = 0; bx < RES; bx += C) {
      const sx = Math.min(bx + (C >> 1), RES - 1);
      const coord1 = left + sx * dRe;
      const m =
        mode === 'mandelbrot'
          ? inCardioid(coord1, coord2)
            ? -1
            : escape(0, 0, coord1, coord2, ci)
          : escape(coord1, coord2, seed.x, seed.y, ci);
      const xEnd = Math.min(bx + C, RES);
      for (let yy = by; yy < yEnd; yy++) {
        const r = yy * RES;
        for (let xx = bx; xx < xEnd; xx++) mu[r + xx] = m;
      }
    }
  }
}

// ---- formatting ------------------------------------------------------------
function formatMag(zoom: number): string {
  if (zoom < 10) return '×' + zoom.toFixed(1);
  if (zoom < 1000) return '×' + Math.round(zoom);
  if (zoom < 1e6) return '×' + (zoom / 1e3).toFixed(zoom < 1e4 ? 1 : 0) + 'K';
  if (zoom < 1e9) return '×' + (zoom / 1e6).toFixed(2) + 'M';
  if (zoom < 1e12) return '×' + (zoom / 1e9).toFixed(2) + 'B';
  return '×' + (zoom / 1e12).toFixed(2) + 'T';
}

function fmtCoord(val: number, zoom: number): string {
  const digits = Math.min(15, Math.max(4, Math.round(Math.log10(Math.max(1, zoom))) + 4));
  return (val >= 0 ? '+' : '') + val.toFixed(digits);
}

// ---- stats + verdict -------------------------------------------------------
interface Stats {
  mode: Mode;
  zoom: number;
  maxIter: number;
  cx: number;
  cy: number;
  seedX: number;
  seedY: number;
  centerInside: boolean;
  centerEscape: number;
  connected: boolean;
}

interface Verdict {
  label: string;
  line: string;
  tone: 'order' | 'chaos' | 'neutral';
}

function makeVerdict(s: Stats): Verdict {
  if (s.mode === 'mandelbrot') {
    if (s.zoom > 1e13) {
      return {
        label: 'out of precision',
        line: `You are ${formatMag(s.zoom)} deep, and the image is starting to go blocky. That is not the set running out of detail — it never does — it is your computer's 64-bit numbers running out of decimal places to tell two neighbouring points apart. The coastline keeps going; ordinary arithmetic cannot follow it any further.`,
        tone: 'chaos',
      };
    }
    if (s.zoom < 1.5) {
      return {
        label: 'the whole set',
        line: 'The black body is every point whose orbit stays trapped forever; the glowing bands outside are coloured by how fast each point flees. The whole shape is drawn by one rule, z to z squared plus c, with nothing else added. Click anywhere on the burning edge to dive in — the detail does not run out.',
        tone: 'order',
      };
    }
    if (s.centerInside) {
      return {
        label: 'inside the lake',
        line: `The crosshair sits inside the black, where the orbit of c never escapes — it loops or spirals into a cycle and stays there forever. All the structure lives on the shore. Click toward the bright filaments at the edge, where escaping and trapped points are tangled together infinitely tightly.`,
        tone: 'neutral',
      };
    }
    if (s.zoom < 200) {
      return {
        label: 'into the coastline',
        line: `${formatMag(s.zoom)} in. Already the budding circles, the lightning, the curling valleys. Every wart on the boundary is itself studded with smaller warts, and this repeats with no bottom. Keep clicking the edge.`,
        tone: 'order',
      };
    }
    if (s.zoom < 5e4) {
      return {
        label: 'self-similar all the way down',
        line: `${formatMag(s.zoom)} deep and the same motifs keep returning at a smaller scale — seahorse tails, spirals of spirals. Somewhere in these filaments is a complete tiny copy of the whole set, antenna and all. The boundary has infinite length packed into a finite frame.`,
        tone: 'order',
      };
    }
    return {
      label: 'the abyss has structure',
      line: `${formatMag(s.zoom)} into the edge — a magnification where the original full set would be larger than a continent — and there is still no smooth patch anywhere. Detail does not thin out as you descend; it renews. This is what "fractal" means, made literal.`,
      tone: 'order',
    };
  }
  // julia
  if (s.connected) {
    return {
      label: 'connected — one piece',
      line: `Your seed c sits inside the Mandelbrot set, so this Julia set is a single connected body: every black point is joined to every other. That is the secret the two shapes share — the Mandelbrot set is exactly the map of which seeds give a Julia set in one piece (${formatMag(s.zoom)} zoom). Drag the dot on the minimap into the black to keep them whole.`,
      tone: 'order',
    };
  }
  return {
    label: 'dust — infinitely shattered',
    line: `Your seed c is OUTSIDE the Mandelbrot set, and the instant it crosses that border the Julia set explodes into Fatou dust: infinitely many disconnected specks, no two touching, yet still self-similar. Nudge the dot on the minimap back toward the black and watch the dust snap into a single connected piece. The Mandelbrot boundary is precisely where that switch flips.`,
    tone: 'chaos',
  };
}

// ---- presets ---------------------------------------------------------------
interface Preset {
  name: string;
  blurb: string;
  mode: Mode;
  view?: View;
  seed?: Seed;
}

const MANDEL_PRESETS: Preset[] = [
  { name: 'The Whole Set', blurb: 'home — the full island', mode: 'mandelbrot', view: { ...HOME } },
  { name: 'Seahorse Valley', blurb: 'the curling tails on the neck', mode: 'mandelbrot', view: { cx: -0.745428, cy: 0.113009, span: 0.018 } },
  { name: 'Elephant Valley', blurb: 'a parade of trunks', mode: 'mandelbrot', view: { cx: 0.2925, cy: 0.0149, span: 0.05 } },
  { name: 'Mini-Mandelbrot', blurb: 'a perfect copy, deep in the filaments', mode: 'mandelbrot', view: { cx: -1.25066, cy: 0.02012, span: 0.0055 } },
  { name: 'Triple Spiral', blurb: 'spirals made of spirals', mode: 'mandelbrot', view: { cx: -0.088, cy: 0.654, span: 0.035 } },
  { name: 'The Needle', blurb: 'the antenna — same as the Logistic Map', mode: 'mandelbrot', view: { cx: -1.401155, cy: 0, span: 0.02 } },
];

const JULIA_PRESETS: Preset[] = [
  { name: 'Douady Rabbit', blurb: 'three ears, repeated forever', mode: 'julia', seed: { x: -0.123, y: 0.745 } },
  { name: 'The Dragon', blurb: 'a coiling connected dragon', mode: 'julia', seed: { x: -0.8, y: 0.156 } },
  { name: 'Dendrite', blurb: 'a tree with no interior', mode: 'julia', seed: { x: 0, y: 1 } },
  { name: 'Siegel Disk', blurb: 'a slow eternal spiral', mode: 'julia', seed: { x: -0.391, y: -0.587 } },
  { name: 'San Marco', blurb: 'a chain of basins', mode: 'julia', seed: { x: -0.75, y: 0.0 } },
  { name: 'Galaxy', blurb: 'a swirling connected spiral', mode: 'julia', seed: { x: 0.285, y: 0.01 } },
];

export default function Client() {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const sideRef = useRef<HTMLCanvasElement>(null);

  const mainImgRef = useRef<ImageData | null>(null);
  const mainBufRef = useRef<Uint32Array | null>(null);
  const sideImgRef = useRef<ImageData | null>(null);
  const sideBufRef = useRef<Uint32Array | null>(null);
  const muRef = useRef<Float32Array>(new Float32Array(RES * RES));
  const miniBaseRef = useRef<HTMLCanvasElement | null>(null);

  const palRef = useRef<Uint32Array>(buildPalette(PALETTES[0].stops));

  // view / sim state (read inside the loop)
  const modeRef = useRef<Mode>('mandelbrot');
  const viewRef = useRef<View>({ ...HOME });
  const baseSpanRef = useRef(HOME.span);
  const seedRef = useRef<Seed>({ x: -0.8, y: 0.156 });
  const maxIterRef = useRef(maxIterFor(HOME.span, HOME.span));
  const renderRowRef = useRef(0);
  const offsetRef = useRef(0);
  const driftRef = useRef(true);

  // hover / preview
  const hoverComplexRef = useRef<{ re: number; im: number }>({ re: -0.8, im: 0.156 });
  const hoverPxRef = useRef<{ x: number; y: number } | null>(null);
  const previewDirtyRef = useRef(true);

  const animRef = useRef(0);
  const frameRef = useRef(0);

  // react-facing state
  const [mode, setMode] = useState<Mode>('mandelbrot');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [drift, setDrift] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [stats, setStats] = useState<Stats>({
    mode: 'mandelbrot', zoom: 1, maxIter: maxIterRef.current, cx: HOME.cx, cy: HOME.cy,
    seedX: -0.8, seedY: 0.156, centerInside: true, centerEscape: 0, connected: true,
  });

  // ---- stats ---------------------------------------------------------------
  const computeStats = useCallback(() => {
    const v = viewRef.current;
    const zoom = baseSpanRef.current / v.span;
    if (modeRef.current === 'mandelbrot') {
      const inside = inCardioid(v.cx, v.cy);
      const m = inside ? -1 : escape(0, 0, v.cx, v.cy, Math.max(maxIterRef.current, 600));
      setStats({
        mode: 'mandelbrot', zoom, maxIter: maxIterRef.current, cx: v.cx, cy: v.cy,
        seedX: seedRef.current.x, seedY: seedRef.current.y,
        centerInside: m < 0, centerEscape: m < 0 ? 0 : Math.floor(m), connected: true,
      });
    } else {
      const s = seedRef.current;
      const sm = inCardioid(s.x, s.y) ? -1 : escape(0, 0, s.x, s.y, 800);
      setStats({
        mode: 'julia', zoom, maxIter: maxIterRef.current, cx: v.cx, cy: v.cy,
        seedX: s.x, seedY: s.y, centerInside: false, centerEscape: 0, connected: sm < 0,
      });
    }
  }, []);

  // ---- request a fresh render ---------------------------------------------
  const requestRender = useCallback(() => {
    const v = viewRef.current;
    v.span = Math.min(baseSpanRef.current, Math.max(SPAN_FLOOR, v.span));
    const mi = maxIterFor(v.span, baseSpanRef.current);
    maxIterRef.current = mi;
    coarse(muRef.current, v, mi, modeRef.current, seedRef.current);
    renderRowRef.current = 0;
    computeStats();
  }, [computeStats]);

  // ---- build the minimap base (static Mandelbrot thumbnail) ----------------
  const buildMiniBase = useCallback(() => {
    const cv = miniBaseRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(PREV, PREV);
    const buf = new Uint32Array(img.data.buffer);
    const pal = palRef.current;
    for (let y = 0; y < PREV; y++) {
      const im = MINI_VIEW.cy - ((y - PREV / 2) / PREV) * MINI_VIEW.span;
      for (let x = 0; x < PREV; x++) {
        const re = MINI_VIEW.cx + ((x - PREV / 2) / PREV) * MINI_VIEW.span;
        const m = inCardioid(re, im) ? -1 : escape(0, 0, re, im, 180);
        let col = INTERIOR;
        if (m >= 0) {
          let t = m * DENSITY;
          t = t - PAL_SIZE * Math.floor(t / PAL_SIZE);
          col = pal[t | 0];
        }
        buf[y * PREV + x] = col;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  // ---- colourise main canvas ----------------------------------------------
  const colorizeMain = useCallback(() => {
    const buf = mainBufRef.current;
    const img = mainImgRef.current;
    const canvas = mainRef.current;
    if (!buf || !img || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const mu = muRef.current;
    const pal = palRef.current;
    const off = offsetRef.current;
    for (let i = 0; i < mu.length; i++) {
      const m = mu[i];
      if (m < 0) {
        buf[i] = INTERIOR;
      } else {
        let t = m * DENSITY + off;
        t = t - PAL_SIZE * Math.floor(t / PAL_SIZE);
        buf[i] = pal[t | 0];
      }
    }
    ctx.putImageData(img, 0, 0);

    // hover crosshair (mandelbrot mode) — marks the point feeding the live Julia
    if (modeRef.current === 'mandelbrot' && hoverPxRef.current) {
      const { x, y } = hoverPxRef.current;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.moveTo(x - 13, y); ctx.lineTo(x - 4, y);
      ctx.moveTo(x + 4, y); ctx.lineTo(x + 13, y);
      ctx.moveTo(x, y - 13); ctx.lineTo(x, y - 4);
      ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 13);
      ctx.stroke();
    }
  }, []);

  // ---- side canvas: Julia preview (mandelbrot mode) or minimap (julia mode)
  const renderSide = useCallback(() => {
    const canvas = sideRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (modeRef.current === 'mandelbrot') {
      const img = sideImgRef.current;
      const buf = sideBufRef.current;
      if (!img || !buf) return;
      const c = hoverComplexRef.current;
      const pal = palRef.current;
      for (let y = 0; y < PREV; y++) {
        const zy = JULIA_HOME.cy - ((y - PREV / 2) / PREV) * JULIA_HOME.span;
        for (let x = 0; x < PREV; x++) {
          const zx = JULIA_HOME.cx + ((x - PREV / 2) / PREV) * JULIA_HOME.span;
          const m = escape(zx, zy, c.re, c.im, 160);
          let col = INTERIOR;
          if (m >= 0) {
            let t = m * DENSITY;
            t = t - PAL_SIZE * Math.floor(t / PAL_SIZE);
            col = pal[t | 0];
          }
          buf[y * PREV + x] = col;
        }
      }
      ctx.putImageData(img, 0, 0);
    } else {
      // minimap: cached Mandelbrot base + a dot at the current seed
      const base = miniBaseRef.current;
      if (base) ctx.drawImage(base, 0, 0);
      const s = seedRef.current;
      const dx = ((s.x - MINI_VIEW.cx) / MINI_VIEW.span) * PREV + PREV / 2;
      const dy = -((s.y - MINI_VIEW.cy) / MINI_VIEW.span) * PREV + PREV / 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dx, dy, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(45,212,191,0.9)';
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // ---- main loop -----------------------------------------------------------
  useEffect(() => {
    const main = mainRef.current;
    const side = sideRef.current;
    if (!main || !side) return;
    main.width = RES; main.height = RES;
    side.width = PREV; side.height = PREV;

    const mctx = main.getContext('2d');
    const sctx = side.getContext('2d');
    if (!mctx || !sctx) return;
    const mImg = mctx.createImageData(RES, RES);
    mainImgRef.current = mImg;
    mainBufRef.current = new Uint32Array(mImg.data.buffer);
    const sImg = sctx.createImageData(PREV, PREV);
    sideImgRef.current = sImg;
    sideBufRef.current = new Uint32Array(sImg.data.buffer);

    const mini = document.createElement('canvas');
    mini.width = PREV; mini.height = PREV;
    miniBaseRef.current = mini;
    buildMiniBase();

    requestRender();
    previewDirtyRef.current = true;

    const tick = () => {
      // progressive fine render, time-budgeted so the UI stays responsive
      if (renderRowRef.current < RES) {
        const t0 = performance.now();
        const mu = muRef.current;
        const v = viewRef.current;
        const mi = maxIterRef.current;
        const m = modeRef.current;
        const seed = seedRef.current;
        while (renderRowRef.current < RES && performance.now() - t0 < 11) {
          const y = renderRowRef.current;
          if (m === 'mandelbrot') computeMandelRow(mu, v, mi, y);
          else computeJuliaRow(mu, v, seed, mi, y);
          renderRowRef.current++;
        }
      }

      if (driftRef.current) offsetRef.current += 1.1;

      colorizeMain();

      if (modeRef.current === 'mandelbrot') {
        if (previewDirtyRef.current) {
          renderSide();
          previewDirtyRef.current = false;
        }
      } else {
        renderSide();
      }

      frameRef.current++;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    // wheel zoom (native listener so we can preventDefault)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = main.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * RES;
      const py = ((e.clientY - rect.top) / rect.height) * RES;
      const v = viewRef.current;
      const c = viewToComplex(v, px, py);
      const f = e.deltaY < 0 ? WHEEL : 1 / WHEEL;
      const span = v.span / f;
      viewRef.current = {
        cx: c.re - ((px - RES / 2) / RES) * span,
        cy: c.im + ((py - RES / 2) / RES) * span,
        span,
      };
      requestRender();
    };
    main.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animRef.current);
      main.removeEventListener('wheel', onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // periodic stats refresh (keeps the center-status readout live as it renders)
  useEffect(() => {
    const id = window.setInterval(() => computeStats(), 600);
    return () => window.clearInterval(id);
  }, [computeStats]);

  // rebuild palette + minimap when palette changes
  useEffect(() => {
    palRef.current = buildPalette(PALETTES[paletteIdx].stops);
    buildMiniBase();
    previewDirtyRef.current = true;
  }, [paletteIdx, buildMiniBase]);

  // ---- pointer handling on the main canvas --------------------------------
  const toCanvasPx = (clientX: number, clientY: number) => {
    const main = mainRef.current!;
    const rect = main.getBoundingClientRect();
    return {
      px: ((clientX - rect.left) / rect.width) * RES,
      py: ((clientY - rect.top) / rect.height) * RES,
    };
  };

  const onMainPointerDown = useCallback((e: React.PointerEvent) => {
    const { px, py } = toCanvasPx(e.clientX, e.clientY);
    const v = viewRef.current;
    const c = viewToComplex(v, px, py);
    if (modeRef.current === 'mandelbrot') {
      hoverComplexRef.current = c;
      hoverPxRef.current = { x: px, y: py };
      previewDirtyRef.current = true;
    }
    // dive: recenter on the clicked point and zoom in
    viewRef.current = { cx: c.re, cy: c.im, span: v.span / DIVE };
    requestRender();
  }, [requestRender]);

  const onMainPointerMove = useCallback((e: React.PointerEvent) => {
    if (modeRef.current !== 'mandelbrot') return;
    if (e.pointerType === 'touch') return;
    const { px, py } = toCanvasPx(e.clientX, e.clientY);
    hoverComplexRef.current = viewToComplex(viewRef.current, px, py);
    hoverPxRef.current = { x: px, y: py };
    previewDirtyRef.current = true;
  }, []);

  const onMainPointerLeave = useCallback(() => {
    hoverPxRef.current = null;
  }, []);

  // click the minimap (julia mode) to pick a new seed
  const onSidePointerDown = useCallback((e: React.PointerEvent) => {
    if (modeRef.current !== 'julia') return;
    const side = sideRef.current!;
    const rect = side.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * PREV;
    const my = ((e.clientY - rect.top) / rect.height) * PREV;
    const sx = MINI_VIEW.cx + ((mx - PREV / 2) / PREV) * MINI_VIEW.span;
    const sy = MINI_VIEW.cy - ((my - PREV / 2) / PREV) * MINI_VIEW.span;
    seedRef.current = { x: sx, y: sy };
    viewRef.current = { ...JULIA_HOME };
    requestRender();
  }, [requestRender]);

  // ---- mode + presets ------------------------------------------------------
  const switchMode = useCallback((m: Mode, seed?: Seed) => {
    modeRef.current = m;
    setMode(m);
    if (m === 'mandelbrot') {
      baseSpanRef.current = HOME.span;
      viewRef.current = { ...HOME };
    } else {
      baseSpanRef.current = JULIA_HOME.span;
      if (seed) seedRef.current = seed;
      viewRef.current = { ...JULIA_HOME };
    }
    previewDirtyRef.current = true;
    requestRender();
  }, [requestRender]);

  const openHoverJulia = useCallback(() => {
    const c = hoverComplexRef.current;
    switchMode('julia', { x: c.re, y: c.im });
  }, [switchMode]);

  const applyPreset = useCallback((p: Preset) => {
    modeRef.current = p.mode;
    setMode(p.mode);
    if (p.mode === 'mandelbrot') {
      baseSpanRef.current = HOME.span;
      viewRef.current = p.view ? { ...p.view } : { ...HOME };
    } else {
      baseSpanRef.current = JULIA_HOME.span;
      if (p.seed) seedRef.current = { ...p.seed };
      viewRef.current = { ...JULIA_HOME };
    }
    previewDirtyRef.current = true;
    requestRender();
  }, [requestRender]);

  const zoomOut = useCallback(() => {
    const v = viewRef.current;
    viewRef.current = { cx: v.cx, cy: v.cy, span: v.span * DIVE };
    requestRender();
  }, [requestRender]);

  const resetView = useCallback(() => {
    viewRef.current = modeRef.current === 'mandelbrot' ? { ...HOME } : { ...JULIA_HOME };
    requestRender();
  }, [requestRender]);

  const toggleDrift = useCallback(() => {
    const next = !driftRef.current;
    driftRef.current = next;
    setDrift(next);
  }, []);

  // ---- share ---------------------------------------------------------------
  const onCopy = useCallback(async () => {
    const s = stats;
    const text =
      s.mode === 'mandelbrot'
        ? `I dove ${formatMag(s.zoom)} into the Mandelbrot set — the most intricate object in mathematics, all drawn by one rule: z → z² + c, repeated. Centred at ${fmtCoord(s.cx, s.zoom)} ${fmtCoord(s.cy, s.zoom)}i, and the infinitely detailed coastline still hasn't run out of new structure.\n\nThe Mandelbrot Set, WIZ edition: https://wiz.jock.pl/experiments/mandelbrot`
        : `I'm exploring the Julia set of c = ${s.seedX.toFixed(4)} ${s.seedY >= 0 ? '+' : '−'} ${Math.abs(s.seedY).toFixed(4)}i — ${s.connected ? 'a single connected piece, because that seed lives inside the Mandelbrot set' : 'infinitely shattered dust, because that seed lives just outside the Mandelbrot set'}. One rule, z → z² + c, and every seed grows a different universe.\n\nThe Mandelbrot Set, WIZ edition: https://wiz.jock.pl/experiments/mandelbrot`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }, [stats]);

  const verdict = makeVerdict(stats);
  const toneClass =
    verdict.tone === 'order'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'chaos'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  const presets = mode === 'mandelbrot' ? MANDEL_PRESETS : JULIA_PRESETS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Mandelbrot Set
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            One rule, <span className="text-teal-300">z → z² + c</span>, repeated. Stay bounded and a point is in
            the set (black); escape and it&rsquo;s coloured by how fast. Out of that falls a coastline of infinite
            length, copies of itself at every depth, and every Julia set hiding inside.
          </p>
        </header>

        {/* Mode toggle */}
        <div className="mb-4 flex justify-center gap-2">
          {([['mandelbrot', 'The Mandelbrot set'], ['julia', 'Julia sets']] as [Mode, string][]).map(([m, label]) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-md border px-4 py-1.5 font-mono text-xs transition ${
                mode === m
                  ? 'border-teal-400/70 bg-teal-500/15 text-teal-200'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Main canvas */}
        <div
          className="rounded-lg border border-slate-800 bg-[#0a0712] shadow-2xl shadow-indigo-950/40 overflow-hidden"
          style={{ aspectRatio: '1 / 1' }}
        >
          <canvas
            ref={mainRef}
            onPointerDown={onMainPointerDown}
            onPointerMove={onMainPointerMove}
            onPointerLeave={onMainPointerLeave}
            className="block w-full h-full touch-none cursor-crosshair"
            aria-label="A live render of the Mandelbrot or Julia set. Click to dive in, scroll to zoom."
          />
        </div>
        <div className="flex items-center justify-between px-1 pt-1.5 font-mono text-[10px] text-slate-600 mb-4">
          <span>{mode === 'mandelbrot' ? 'click to dive in' : 'click to dive in'}</span>
          <span className="text-slate-500">scroll to zoom · black = trapped forever</span>
          <span>{stats.maxIter} iters deep</span>
        </div>

        {/* Side panel: live Julia preview OR minimap */}
        <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className="mx-auto shrink-0 rounded-md border border-slate-800 bg-[#0a0712] overflow-hidden"
              style={{ width: 184, height: 184 }}
            >
              <canvas
                ref={sideRef}
                onPointerDown={onSidePointerDown}
                className={`block h-full w-full touch-none ${mode === 'julia' ? 'cursor-pointer' : ''}`}
                aria-label={mode === 'mandelbrot' ? 'Live Julia set preview for the hovered point' : 'Minimap of the Mandelbrot set with your seed marked'}
              />
            </div>
            <div className="flex-1 text-sm">
              {mode === 'mandelbrot' ? (
                <>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-300/80">
                    Live Julia preview
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    Every point on the plane grows its own Julia set from the same rule, just with c frozen.
                    Hover the big picture and this little window shows the Julia set of the point under your
                    cursor. Inside the set it&rsquo;s one connected piece; outside, it shatters into dust.
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    c = {hoverComplexRef.current.re.toFixed(4)} {hoverComplexRef.current.im >= 0 ? '+' : '−'} {Math.abs(hoverComplexRef.current.im).toFixed(4)}i
                  </p>
                  <button
                    onClick={openHoverJulia}
                    className="mt-2 rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1 font-mono text-xs text-violet-200 transition hover:bg-violet-500/25"
                  >
                    Open this Julia set →
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-300/80">
                    Where this comes from
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    The dot marks your seed c on the Mandelbrot map. Slide it into the black and the Julia set is
                    a single connected body; drag it outside and the same set explodes into infinitely many
                    disconnected specks. <span className="text-slate-100">Tap anywhere on the map</span> to pick a
                    new seed.
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    c = {stats.seedX.toFixed(5)} {stats.seedY >= 0 ? '+' : '−'} {Math.abs(stats.seedY).toFixed(5)}i ·{' '}
                    <span className={stats.connected ? 'text-teal-300' : 'text-amber-300'}>
                      {stats.connected ? 'connected' : 'dust'}
                    </span>
                  </p>
                  <button
                    onClick={() => switchMode('mandelbrot')}
                    className="mt-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    ← back to the Mandelbrot set
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={zoomOut}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              − Zoom out
            </button>
            <button
              onClick={resetView}
              className="rounded-md border border-teal-400/70 bg-teal-500/15 px-3 py-1 font-mono text-xs text-teal-200 transition hover:bg-teal-500/25"
            >
              ↺ Reset view
            </button>
            <button
              onClick={toggleDrift}
              className={`rounded-md border px-3 py-1 font-mono text-xs transition ${
                drift
                  ? 'border-violet-400/60 bg-violet-500/15 text-violet-200'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
              }`}
            >
              {drift ? '✦ Palette drift on' : '✧ Palette drift off'}
            </button>
            <div className="ml-auto flex items-center gap-1">
              {PALETTES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPaletteIdx(i)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition ${
                    paletteIdx === i
                      ? 'border-teal-400/70 bg-teal-500/15 text-teal-200'
                      : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center mb-4 sm:grid-cols-4">
          <Stat label="Magnification" value={formatMag(stats.zoom)} accent="gold" />
          <Stat label="Detail (iters)" value={stats.maxIter.toLocaleString()} accent="teal" />
          {mode === 'mandelbrot' ? (
            <>
              <Stat label="Center re" value={fmtCoord(stats.cx, stats.zoom)} accent="violet" />
              <Stat label="Center im" value={fmtCoord(stats.cy, stats.zoom)} accent="violet" />
            </>
          ) : (
            <>
              <Stat label="Seed re" value={stats.seedX.toFixed(5)} accent="violet" />
              <Stat label="Seed im" value={stats.seedY.toFixed(5)} accent="violet" />
            </>
          )}
        </div>

        {/* Verdict */}
        <div className={`rounded-lg border p-4 text-sm mb-5 transition-colors ${toneClass}`}>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
            {verdict.label}
          </div>
          <p className="leading-relaxed">{verdict.line}</p>
        </div>

        {/* Presets */}
        <div className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {mode === 'mandelbrot' ? 'Famous places to dive' : 'Famous seeds to grow'}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="group flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left transition hover:border-teal-400/60 hover:bg-slate-800"
              >
                <span className="text-sm font-semibold text-teal-200 group-hover:text-teal-100">{p.name}</span>
                <span className="text-[10px] text-slate-500">{p.blurb}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Same one rule every time. {mode === 'mandelbrot'
              ? 'Each place is just a different window onto the same infinite border.'
              : 'Each seed is a single frozen value of c — and a whole different universe.'}
          </p>
        </div>

        {/* How it works */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 mb-6">
          <button
            onClick={() => setShowRules((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base font-semibold text-slate-100">The only rule</span>
            <span className="text-slate-500">{showRules ? '−' : '+'}</span>
          </button>
          {showRules && (
            <div className="space-y-2 border-t border-slate-800 px-5 py-4 text-sm leading-relaxed text-slate-300">
              <p>
                Treat every pixel as a complex number c. Start a second number z at zero and apply the rule{' '}
                <span className="text-teal-300">z → z² + c</span> over and over. Two things can happen. Either z
                keeps growing and shoots off past the horizon (we stop once it passes a fixed radius and record{' '}
                <span className="text-amber-300">how many steps</span> that took), or it never escapes no matter how
                long you wait. Colour the escapers by their step count and paint the prisoners{' '}
                <span className="text-violet-300">black</span>. The black region is the Mandelbrot set.
              </p>
              <ul className="ml-1 space-y-2">
                <li>
                  <span className="text-teal-300">The Mandelbrot set.</span> c is the pixel, z starts at 0. This is
                  the parameter map — one picture holding the fate of every c at once.
                </li>
                <li>
                  <span className="text-violet-300">A Julia set.</span> Now freeze c at one chosen seed and let z
                  start at the pixel instead. Each seed paints a different Julia set, and the Mandelbrot set is
                  exactly the atlas of which seeds give a connected one.
                </li>
              </ul>
              <p className="text-slate-400">
                Nothing in here draws a coastline, a spiral, or a seahorse on purpose. There is no stored image and
                no artist. Every filament falls out of squaring a number and adding a constant, and that is the
                whole point.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            The most complicated picture anyone has ever drawn is generated by one of the simplest formulas anyone
            has ever written. You can dive forever and never reach a smooth, boring patch; the detail does not thin
            out as you descend, it <span className="text-slate-100">renews</span>. The boundary is infinitely long
            and yet wraps a finite area, and tucked into its filaments are exact small copies of the whole, at every
            depth, without end. Complexity, it turns out, does not require a complicated cause.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            And it ties back to its neighbour in this lab. Run the rule only along the real number line, straight
            down the antenna sticking left off the set, and you are watching the exact same thing as{' '}
            <a href="/experiments/logistic-map" className="text-teal-300 underline-offset-4 hover:underline">
              the Logistic Map
            </a>
            : the buds where the set pinches are where a steady value splits into a 2-cycle, then a 4-cycle, then
            chaos. The bifurcation diagram is hiding inside this shape. Two famous pictures of chaos, the same
            object seen from two sides.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Mandelbrot called it geometry for <span className="text-slate-100">the clouds, the coastlines, the
            mountains</span> — the rough, broken shapes that ordinary smooth math had always thrown away. The same
            self-similar roughness runs through fern fronds, blood vessels, river networks, lightning, and the
            jagged price charts he first studied on cotton markets. Nature is not made of straight lines, and here
            is the cleanest proof that it does not have to be.
          </p>
        </div>

        {/* History */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            The iteration itself is older than the picture. Around 1918 the French mathematicians{' '}
            <span className="text-slate-300">Gaston Julia</span> and <span className="text-slate-300">Pierre
            Fatou</span>, working by hand with no way to see what they were describing, developed the theory of
            iterating z² + c and split the plane into stable and chaotic pieces — the sets that now carry Julia&rsquo;s
            name. It sat as abstract analysis for sixty years because nobody could draw it. Then in 1980, at{' '}
            <span className="text-slate-300">IBM&rsquo;s Watson Research Center</span>,{' '}
            <span className="text-slate-300">Benoit Mandelbrot</span> printed the first crude plot of the parameter
            set on a line printer and saw the warty, budded shape emerge — at first he thought the specks of detached
            detail were dust on the lens, until he realised they were real miniature copies. He had coined the word{' '}
            <span className="text-slate-300">fractal</span> in 1975, from the Latin <em>fractus</em>, broken. Adrien
            Douady and John Hubbard proved the set is <span className="text-slate-300">connected</span> (every part
            joined by thin threads) and named it after Mandelbrot in the early 1980s. Whether its boundary is also
            &ldquo;locally connected&rdquo; — the famous MLC conjecture — is still open. Mandelbrot&rsquo;s 1982 book{' '}
            <em>The Fractal Geometry of Nature</em> carried the image out of the lab and made it the icon of an
            entire field.
          </p>
        </div>

        {/* Share + reset */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            {copied ? 'Copied ✓' : 'Copy & share this'}
          </button>
          <button
            onClick={resetView}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Back to the full view
          </button>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <a
            href="/experiments"
            className="text-sm text-slate-400 underline-offset-4 hover:text-violet-300 hover:underline"
          >
            ← back to all experiments
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'gold' | 'teal' | 'violet';
}) {
  const valueClass =
    accent === 'gold' ? 'text-amber-300'
      : accent === 'teal' ? 'text-teal-300'
        : accent === 'violet' ? 'text-violet-300'
          : 'text-slate-100';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className={`break-all font-mono text-sm font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
