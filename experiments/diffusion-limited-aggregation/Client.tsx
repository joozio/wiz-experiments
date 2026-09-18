'use client';

/*
 * Diffusion-Limited Aggregation — WIZ edition.
 *
 * One rule, and frost grows. A wanderer drifts in from far away, bumbling a
 * random walk, until it touches the cluster — and freezes on the spot. Send a
 * few thousand more and a fractal coral falls out of nothing else: no blueprint,
 * no plan, no painter. The tips always grow faster than the bays, because a
 * wanderer drifting in is far more likely to brush a reaching branch than to
 * thread its way down into a sheltered fjord. The cluster shadows itself, and
 * the result is the same branching you see in frost on a window, lightning,
 * mineral dendrites in agate, copper plating, and the veins of a leaf.
 *
 * Witten & Sander, 1981. This is an honest live simulation — random walkers on a
 * grid, sticking on contact — not a canned picture. The measured fractal
 * dimension drifts toward ~1.71, the real number for 2D DLA, as it grows.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ---- grid + canvas ---------------------------------------------------------
const GW = 300;
const GH = 200;
const SCALE = 2;
const CANVAS_W = GW * SCALE; // 600
const CANVAS_H = GH * SCALE; // 400
const CX = (GW / 2) | 0;
const CY = (GH / 2) | 0;
const MAX_R = Math.min(CX, CY) - 3; // auto-stop radius for radial modes
const PARTICLE_CAP = 16000;
const RING_R = 42;

type SeedMode = 'point' | 'ring' | 'line' | 'draw';

interface Preset {
  name: string;
  blurb: string;
  mode: SeedMode;
  stick: number; // 0..1
  speed: number;
}

const PRESETS: Preset[] = [
  { name: 'Coral', blurb: 'one seed, fully sticky — textbook DLA', mode: 'point', stick: 1, speed: 40 },
  { name: 'Window Frost', blurb: 'a whole edge grows upward into spires', mode: 'line', stick: 1, speed: 60 },
  { name: 'Dense Moss', blurb: 'low stickiness packs the gaps in', mode: 'point', stick: 0.18, speed: 40 },
  { name: 'Corona', blurb: 'a ring sprouts a fractal halo', mode: 'ring', stick: 1, speed: 48 },
  { name: 'Electroplate', blurb: 'a half-sticky metal forest', mode: 'line', stick: 0.45, speed: 60 },
  { name: 'Copper Bloom', blurb: 'a fuller, bushier dendrite', mode: 'point', stick: 0.55, speed: 40 },
];

// ---- cosmic colour LUT (violet core -> teal -> cyan -> gold tips) -----------
function buildLut(): Uint32Array {
  const stops: [number, number, number, number][] = [
    [0.0, 84, 46, 158],
    [0.32, 99, 28, 160],
    [0.56, 13, 148, 136],
    [0.79, 34, 211, 238],
    [1.0, 253, 230, 138],
  ];
  const lut = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s][0] && t <= stops[s + 1][0]) {
        a = stops[s];
        b = stops[s + 1];
        break;
      }
    }
    const span = b[0] - a[0] || 1;
    const f = (t - a[0]) / span;
    const r = (a[1] + (b[1] - a[1]) * f) | 0;
    const g = (a[2] + (b[2] - a[2]) * f) | 0;
    const bl = (a[3] + (b[3] - a[3]) * f) | 0;
    lut[i] = (255 << 24) | (bl << 16) | (g << 8) | r; // little-endian RGBA
  }
  return lut;
}

const BG = (255 << 24) | (18 << 16) | (6 << 8) | 6; // #060612
const SEED_COLOR = (255 << 24) | (36 << 16) | (191 << 8) | 251; // amber #fbbf24

interface Stats {
  particles: number;
  reach: number;
  dimension: number;
  running: boolean;
  stalled: boolean;
}

interface Verdict {
  label: string;
  line: string;
  tone: 'order' | 'chaos' | 'neutral';
}

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<ImageData | null>(null);
  const buf32Ref = useRef<Uint32Array | null>(null);
  const lutRef = useRef<Uint32Array>(buildLut());

  // simulation grids
  const occRef = useRef<Uint8Array>(new Uint8Array(GW * GH)); // 0 empty, 1 stuck, 2 seed
  const genRef = useRef<Float32Array>(new Float32Array(GW * GH)); // deposition order
  const stuckRef = useRef(0);
  const radiusRef = useRef(0); // cluster radius (radial) / front for line
  const centerRef = useRef({ x: CX, y: CY });
  const frontRef = useRef(GH - 1); // line mode: highest occupied row
  const tipsRef = useRef<number[]>([]); // ring buffer of recent stuck indices
  const animRef = useRef(0);
  const frameRef = useRef(0);
  const dimRef = useRef(0);

  // params read inside the loop (no restart on change)
  const modeRef = useRef<SeedMode>('point');
  const stickRef = useRef(1);
  const speedRef = useRef(40);
  const runningRef = useRef(true);
  const drawingRef = useRef(false);

  // react-facing state
  const [mode, setMode] = useState<SeedMode>('point');
  const [stick, setStick] = useState(1);
  const [speed, setSpeed] = useState(40);
  const [running, setRunning] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [stats, setStats] = useState<Stats>({ particles: 0, reach: 0, dimension: 0, running: true, stalled: false });

  // ---- seeding -------------------------------------------------------------
  const clearGrid = useCallback(() => {
    occRef.current.fill(0);
    genRef.current.fill(0);
    stuckRef.current = 0;
    radiusRef.current = 0;
    dimRef.current = 0;
    tipsRef.current = [];
    frontRef.current = GH - 1;
    centerRef.current = { x: CX, y: CY };
  }, []);

  const seed = useCallback((m: SeedMode) => {
    clearGrid();
    const occ = occRef.current;
    if (m === 'point') {
      occ[CY * GW + CX] = 2;
      centerRef.current = { x: CX, y: CY };
      radiusRef.current = 0;
    } else if (m === 'ring') {
      const steps = Math.round(2 * Math.PI * RING_R) * 2;
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * 2 * Math.PI;
        const x = Math.round(CX + RING_R * Math.cos(a));
        const y = Math.round(CY + RING_R * Math.sin(a));
        if (x >= 0 && x < GW && y >= 0 && y < GH) occ[y * GW + x] = 2;
      }
      centerRef.current = { x: CX, y: CY };
      radiusRef.current = RING_R;
    } else if (m === 'line') {
      const y = GH - 1;
      for (let x = 0; x < GW; x++) occ[y * GW + x] = 2;
      frontRef.current = y;
    }
    // 'draw' seeds nothing — the user paints it.
  }, [clearGrid]);

  // ---- one simulation slice (bounded work) ---------------------------------
  const stepSim = useCallback(() => {
    const occ = occRef.current;
    const gen = genRef.current;
    const m = modeRef.current;
    const stickP = stickRef.current;
    const targetSticks = speedRef.current;
    const STEP_BUDGET = 220000;
    const PER_WALKER_CAP = 8000;

    let sticks = 0;
    let steps = 0;

    const radial = m !== 'line';
    const c = centerRef.current;

    const deposit = (idx: number, x: number, y: number) => {
      occ[idx] = 1;
      gen[idx] = ++stuckRef.current;
      const tips = tipsRef.current;
      tips.push(idx);
      if (tips.length > 48) tips.shift();
      if (radial) {
        const dx = x - c.x;
        const dy = y - c.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r > radiusRef.current) radiusRef.current = r;
      } else if (y < frontRef.current) {
        frontRef.current = y;
      }
    };

    while (sticks < targetSticks && steps < STEP_BUDGET) {
      // --- spawn a walker hugging the growth front ---
      let wx: number, wy: number, killR2 = 0, launchR = 0;
      if (radial) {
        launchR = radiusRef.current + 5;
        const killR = Math.min(launchR * 2 + 24, Math.max(GW, GH));
        killR2 = killR * killR;
        const a = Math.random() * 2 * Math.PI;
        wx = Math.round(c.x + launchR * Math.cos(a));
        wy = Math.round(c.y + launchR * Math.sin(a));
      } else {
        const launchY = Math.max(1, frontRef.current - 5);
        wx = (Math.random() * GW) | 0;
        wy = launchY;
      }
      if (wx < 0) wx = 0; else if (wx >= GW) wx = GW - 1;
      if (wy < 0) wy = 0; else if (wy >= GH) wy = GH - 1;

      // --- random walk until it sticks, escapes, or times out ---
      let walked = 0;
      let landed = false;
      while (walked < PER_WALKER_CAP) {
        walked++;
        steps++;

        // contact test (8-neighbourhood)
        let touching = false;
        for (let oy = -1; oy <= 1 && !touching; oy++) {
          const ny = wy + oy;
          if (ny < 0 || ny >= GH) continue;
          for (let ox = -1; ox <= 1; ox++) {
            if (ox === 0 && oy === 0) continue;
            let nx = wx + ox;
            if (!radial) {
              if (nx < 0) nx += GW; else if (nx >= GW) nx -= GW; // wrap x in line mode
            } else if (nx < 0 || nx >= GW) continue;
            if (occ[ny * GW + nx] !== 0) { touching = true; break; }
          }
        }

        if (touching) {
          if (Math.random() < stickP) {
            deposit(wy * GW + wx, wx, wy);
            sticks++;
            landed = true;
            break;
          }
          // refused to stick this step — drift on
        }

        // step in a random cardinal direction onto an empty cell
        const d = (Math.random() * 4) | 0;
        let nx = wx + (d === 0 ? 1 : d === 1 ? -1 : 0);
        let ny = wy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (radial) {
          if (nx < 0 || nx >= GW || ny < 0 || ny >= GH) {
            const dx = wx - c.x;
            const dy = wy - c.y;
            if (dx * dx + dy * dy > killR2) break; // escaped
            continue;
          }
        } else {
          if (nx < 0) nx += GW; else if (nx >= GW) nx -= GW;
          if (ny < 0) break; // escaped off the top
          if (ny >= GH) ny = GH - 1;
          if (ny < frontRef.current - 26) break; // wandered too far above the front
        }
        if (occ[ny * GW + nx] === 0) { wx = nx; wy = ny; }

        if (radial) {
          const dx = wx - c.x;
          const dy = wy - c.y;
          if (dx * dx + dy * dy > killR2) break; // escaped — respawn
        }
      }
      if (!landed) steps += 4; // discourage endless non-sticking
    }
  }, []);

  // ---- honest box-counting fractal dimension -------------------------------
  const measureDim = useCallback(() => {
    const occ = occRef.current;
    const sizes = [2, 4, 8, 16, 32];
    const xs: number[] = [];
    const ys: number[] = [];
    for (const s of sizes) {
      const cols = Math.ceil(GW / s);
      const rows = Math.ceil(GH / s);
      const flags = new Uint8Array(cols * rows);
      let count = 0;
      for (let y = 0; y < GH; y++) {
        const row = y * GW;
        const by = (y / s) | 0;
        for (let x = 0; x < GW; x++) {
          if (occ[row + x] !== 0) {
            const bi = by * cols + ((x / s) | 0);
            if (flags[bi] === 0) { flags[bi] = 1; count++; }
          }
        }
      }
      if (count > 0) {
        xs.push(Math.log(1 / s));
        ys.push(Math.log(count));
      }
    }
    if (xs.length < 2) return 0;
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) * (xs[i] - mx);
    }
    if (den === 0) return 0;
    const d = num / den;
    return Math.max(0, Math.min(2, d));
  }, []);

  // ---- render --------------------------------------------------------------
  const render = useCallback(() => {
    const off = offRef.current;
    const img = imgRef.current;
    const buf = buf32Ref.current;
    const canvas = canvasRef.current;
    if (!off || !img || !buf || !canvas) return;
    const occ = occRef.current;
    const gen = genRef.current;
    const lut = lutRef.current;
    const maxGen = Math.max(1, stuckRef.current);

    for (let i = 0; i < occ.length; i++) {
      const o = occ[i];
      if (o === 0) {
        buf[i] = BG;
      } else if (o === 2) {
        buf[i] = SEED_COLOR;
      } else {
        let f = gen[i] / maxGen;
        if (f < 0) f = 0; else if (f > 1) f = 1;
        buf[i] = lut[(f * 255) | 0];
      }
    }
    img.data.set(new Uint8ClampedArray(buf.buffer));
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.putImageData(img, 0, 0);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, GW, GH, 0, 0, CANVAS_W, CANVAS_H);

    // living frontier shimmer on the most recently frozen tips
    const tips = tipsRef.current;
    if (tips.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < tips.length; k++) {
        const idx = tips[k];
        const x = (idx % GW) * SCALE;
        const y = ((idx / GW) | 0) * SCALE;
        const a = (k / tips.length) * 0.5;
        ctx.fillStyle = `rgba(253,230,138,${a})`;
        ctx.fillRect(x - 1, y - 1, SCALE + 2, SCALE + 2);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }, []);

  // ---- main loop -----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const off = document.createElement('canvas');
    off.width = GW;
    off.height = GH;
    offRef.current = off;
    const octx = off.getContext('2d');
    if (octx) {
      const img = octx.createImageData(GW, GH);
      imgRef.current = img;
      buf32Ref.current = new Uint32Array(GW * GH);
    }

    seed('point');

    const tick = () => {
      if (runningRef.current && !drawingRef.current) {
        stepSim();
        // auto-stop checks
        const radial = modeRef.current !== 'line';
        const reachedEdge = radial
          ? radiusRef.current >= MAX_R
          : frontRef.current <= 3;
        if (reachedEdge || stuckRef.current >= PARTICLE_CAP) {
          runningRef.current = false;
          setRunning(false);
        }
      }
      frameRef.current++;
      if (frameRef.current % 24 === 0) {
        dimRef.current = measureDim();
      }
      render();
      if (frameRef.current % 6 === 0 || !runningRef.current) {
        setStats({
          particles: stuckRef.current,
          reach: modeRef.current === 'line' ? GH - 1 - frontRef.current : Math.round(radiusRef.current),
          dimension: dimRef.current,
          running: runningRef.current,
          stalled: !runningRef.current && stuckRef.current > 0,
        });
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- controls ------------------------------------------------------------
  const changeMode = useCallback((m: SeedMode) => {
    modeRef.current = m;
    setMode(m);
    drawingRef.current = false;
    seed(m);
    dimRef.current = 0;
    if (m === 'draw') {
      runningRef.current = false;
      setRunning(false);
    } else {
      runningRef.current = true;
      setRunning(true);
    }
  }, [seed]);

  const resetCurrent = useCallback(() => {
    seed(modeRef.current);
    dimRef.current = 0;
    if (modeRef.current === 'draw') {
      runningRef.current = false;
      setRunning(false);
    } else {
      runningRef.current = true;
      setRunning(true);
    }
  }, [seed]);

  const toggleRun = useCallback(() => {
    if (modeRef.current === 'draw' && stuckRef.current === 0) {
      // first press in draw mode: lock the seed, compute its centre, grow from it
      const occ = occRef.current;
      let sx = 0, sy = 0, n = 0;
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          if (occ[y * GW + x] === 2) { sx += x; sy += y; n++; }
        }
      }
      if (n === 0) {
        occ[CY * GW + CX] = 2; // nothing drawn — drop a default seed
        centerRef.current = { x: CX, y: CY };
        radiusRef.current = 0;
      } else {
        const cx = Math.round(sx / n);
        const cy = Math.round(sy / n);
        centerRef.current = { x: cx, y: cy };
        let maxr = 0;
        for (let y = 0; y < GH; y++) {
          for (let x = 0; x < GW; x++) {
            if (occ[y * GW + x] === 2) {
              const r = Math.hypot(x - cx, y - cy);
              if (r > maxr) maxr = r;
            }
          }
        }
        radiusRef.current = maxr;
      }
    }
    const next = !runningRef.current;
    runningRef.current = next;
    setRunning(next);
  }, []);

  const jumpTo = useCallback((p: Preset) => {
    modeRef.current = p.mode;
    setMode(p.mode);
    stickRef.current = p.stick;
    setStick(p.stick);
    speedRef.current = p.speed;
    setSpeed(p.speed);
    drawingRef.current = false;
    seed(p.mode);
    dimRef.current = 0;
    runningRef.current = true;
    setRunning(true);
  }, [seed]);

  // ---- draw-your-own-seed painting ----------------------------------------
  const paintAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const gx = Math.round(((clientX - rect.left) / rect.width) * GW);
    const gy = Math.round(((clientY - rect.top) / rect.height) * GH);
    const occ = occRef.current;
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const x = gx + ox;
        const y = gy + oy;
        if (x >= 0 && x < GW && y >= 0 && y < GH) occ[y * GW + x] = 2;
      }
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (modeRef.current !== 'draw' || stuckRef.current > 0) return;
    drawingRef.current = true;
    paintAt(e.clientX, e.clientY);
  }, [paintAt]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (modeRef.current !== 'draw' || !drawingRef.current) return;
    paintAt(e.clientX, e.clientY);
  }, [paintAt]);

  const onPointerUp = useCallback(() => {
    drawingRef.current = false;
  }, []);

  const onCopy = useCallback(async () => {
    const d = stats.dimension > 0 ? stats.dimension.toFixed(2) : '~1.7';
    const text = `I dropped ${stats.particles} random wanderers around a seed and watched them freeze, one touch at a time, into a fractal with a measured dimension of ${d}. No blueprint, no painter. Frost, lightning, coral, and the veins in a leaf all branch by this one rule.\n\nDiffusion-Limited Aggregation, WIZ edition: https://wiz.jock.pl/experiments/diffusion-limited-aggregation`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }, [stats]);

  // ---- verdict -------------------------------------------------------------
  const verdict = makeVerdict(mode, stats, stick);
  const toneClass =
    verdict.tone === 'order'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'chaos'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  const reachLabel = mode === 'line' ? 'Height' : 'Radius';
  const reachUnit = 'px';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Diffusion-Limited Aggregation
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            One rule, and frost grows. A wanderer drifts in, bumps the cluster, and freezes on the spot.
            A few thousand more, and a fractal coral falls out of nothing else. Pick a seed, set the stickiness, or draw your own and let it bloom.
          </p>
        </header>

        {/* Canvas */}
        <div
          className="rounded-lg border border-slate-800 bg-[#060612] shadow-2xl shadow-indigo-950/40 overflow-hidden"
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className={`block w-full h-full touch-none ${mode === 'draw' && stats.particles === 0 ? 'cursor-crosshair' : 'cursor-default'}`}
            aria-label="A diffusion-limited aggregation simulation: random walkers freeze on contact into a fractal cluster."
          />
        </div>
        <div className="flex items-center justify-between px-1 pt-1.5 font-mono text-[10px] text-slate-600 mb-4">
          <span>oldest core</span>
          <span className="text-slate-500">
            {mode === 'draw' && stats.particles === 0 ? '✦ draw your seed, then press Grow' : 'wander · touch · freeze'}
          </span>
          <span>newest tips</span>
        </div>

        {/* Controls */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 mb-4">
          {/* seed mode */}
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Seed</div>
            <div className="flex flex-wrap gap-2">
              {([
                ['point', 'Point'],
                ['ring', 'Ring'],
                ['line', 'Edge'],
                ['draw', 'Draw'],
              ] as [SeedMode, string][]).map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => changeMode(m)}
                  className={`rounded-md border px-3 py-1 font-mono text-xs transition ${
                    mode === m
                      ? 'border-teal-400/70 bg-teal-500/15 text-teal-200'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* stickiness */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">Stickiness</span>
                <span className="font-mono text-sm tabular-nums text-slate-200">{Math.round(stick * 100)}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={Math.round(stick * 100)}
                onChange={(e) => { const v = +e.target.value / 100; setStick(v); stickRef.current = v; }}
                className="h-1.5 w-full cursor-pointer accent-violet-400"
              />
              <p className="mt-1 text-[10px] text-slate-600">low = walkers slip deep before freezing = denser</p>
            </div>
            {/* speed */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">Speed</span>
                <span className="font-mono text-sm tabular-nums text-slate-200">{speed}/frame</span>
              </div>
              <input
                type="range"
                min={4}
                max={120}
                step={1}
                value={speed}
                onChange={(e) => { const v = +e.target.value; setSpeed(v); speedRef.current = v; }}
                className="h-1.5 w-full cursor-pointer accent-teal-400"
              />
              <p className="mt-1 text-[10px] text-slate-600">how many wanderers freeze each frame</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={toggleRun}
              className="rounded-md border border-teal-400/70 bg-teal-500/15 px-3 py-1 font-mono text-xs text-teal-200 transition hover:bg-teal-500/25"
            >
              {running ? '❚❚ Pause' : mode === 'draw' && stats.particles === 0 ? '▶ Grow' : '▶ Play'}
            </button>
            <button
              onClick={resetCurrent}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              ↺ Reset
            </button>
            {stats.stalled && (
              <span className="font-mono text-[10px] text-amber-300/80">
                grown out — reset or change the seed
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <Stat label="Frozen" value={stats.particles.toLocaleString()} accent="teal" />
          <Stat label={reachLabel} value={`${stats.reach} ${reachUnit}`} />
          <Stat label="Fractal D" value={stats.dimension > 0 ? stats.dimension.toFixed(2) : '—'} accent="violet" />
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
            Try a recipe
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => jumpTo(p)}
                className="group flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left transition hover:border-teal-400/60 hover:bg-slate-800"
              >
                <span className="text-sm font-semibold text-teal-200 group-hover:text-teal-100">{p.name}</span>
                <span className="text-[10px] text-slate-500">{p.blurb}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Same one rule every time. The only things that change are where the seed starts and how readily a wanderer agrees to freeze.
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
                Start with one frozen seed. Then, over and over: release a single particle far away and let it stagger
                a <span className="text-teal-300">random walk</span>, one step in a random direction at a time, with no
                memory and no goal. The instant it touches the cluster, it <span className="text-violet-300">freezes
                where it stands</span> and becomes part of it. Repeat a few thousand times.
              </p>
              <ul className="ml-1 space-y-2">
                <li>
                  <span className="text-amber-300">Why it branches.</span> A wanderer drifting in from the outside is
                  far more likely to brush a tip that reaches toward it than to thread its way down into a sheltered
                  bay. So tips grow faster, and faster-growing tips shadow the bays even more. The cluster starves its
                  own interior. That runaway is the whole reason a tree falls out instead of a blob.
                </li>
                <li>
                  <span className="text-violet-300">Stickiness.</span> Drop the chance of freezing on contact and each
                  wanderer gets more tries to slip past the tips and reach deeper before it commits. The shadows soften,
                  the bays fill in, and the open coral thickens toward a dense, bushy moss.
                </li>
              </ul>
              <p className="text-slate-400">
                Nothing in here knows the shape it is making. There is no plan, no painter, no center deciding anything.
                The branching is a side effect of randomness plus &ldquo;freeze on contact,&rdquo; and that is enough.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            You just watched a fractal grow with no fractal anywhere in the rule. A particle that can only do one dumb
            thing — wander, then stick — builds a structure no one designed, every single time, and the structure has a
            measurable <span className="text-slate-100">fractal dimension near 1.71</span> that the universe keeps
            landing on whether the particles are atoms, ions, soot, or pixels.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            That is why this exact branching shows up everywhere the same physics runs: <span className="text-slate-100">frost
            feathering across a cold window</span>, lightning and the Lichtenberg figures it burns into wood, the black
            dendrites of manganese inside moss agate, copper and zinc plating out in an electrolysis cell, soot, coral,
            bacterial colonies starved for food, the deltas of rivers, and the branching of your own capillaries and
            airways.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The lesson the cluster keeps teaching: <span className="text-slate-100">complex, organic-looking form does
            not need a complex cause.</span> It often needs only randomness, a rule about contact, and the patience to
            let the tips outrun the bays.
          </p>
        </div>

        {/* History */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            The model is young. <span className="text-slate-300">Thomas Witten and Leonard Sander</span> defined
            diffusion-limited aggregation in a 1981 paper, looking for the simplest thing that could explain how smoke
            particles and metal clumps grow into the same wispy, branched shapes. Their answer — wander, then stick —
            turned out to produce a fractal with a dimension around 1.71 in two dimensions, a number nobody has yet
            derived from first principles. The branching itself was photographed long before anyone had the math:
            Georg Christoph Lichtenberg captured electrical discharge figures in dust in 1777, and mineralogists had
            been puzzling over the &ldquo;fossil ferns&rdquo; of dendritic agate, which are not fossils at all but
            manganese DLA, for centuries. Today the same model is run on viscous fingering in a Hele-Shaw cell,
            electrodeposition, dielectric breakdown, and tumor-growth fronts. One rule, and the whole catalog falls out.
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
            onClick={resetCurrent}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Grow it again
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

function makeVerdict(mode: SeedMode, stats: Stats, stick: number): Verdict {
  const { particles, dimension } = stats;
  if (mode === 'draw' && particles === 0) {
    return {
      label: 'your seed',
      line: 'Draw any shape on the dish — a letter, a line, a scribble — then press Grow. The wanderers will freeze onto whatever you leave them, and the same fractal fur will sprout from every edge you draw.',
      tone: 'neutral',
    };
  }
  if (particles < 150) {
    return {
      label: 'first frost',
      line: 'A seed and a handful of wanderers. Nothing looks like much yet. Give it a few seconds — the tips have to find each other before the shape commits.',
      tone: 'neutral',
    };
  }
  if (stick <= 0.3) {
    return {
      label: 'dense aggregate',
      line: `You dropped the stickiness to ${Math.round(stick * 100)}%, so each wanderer slips past the tips and burrows deeper before it agrees to freeze. The bays fill in, the shadows soften, and the open coral thickens toward a bushy, near-solid moss${dimension > 0 ? ` — measured dimension ${dimension.toFixed(2)}, pushed up toward 2 (space-filling) and away from the classic 1.71` : ''}.`,
      tone: 'chaos',
    };
  }
  if (mode === 'line') {
    return {
      label: 'a competing forest',
      line: `Spires racing up off the edge, and the tall ones win: they intercept the wanderers raining down and starve the short ones in their shadow. This is electrodeposition and window frost — a forest where height is everything${dimension > 0 ? `, branching at fractal dimension ${dimension.toFixed(2)}` : ''}.`,
      tone: 'order',
    };
  }
  if (dimension > 0 && dimension >= 1.55 && dimension <= 1.85) {
    return {
      label: 'textbook DLA',
      line: `Measured fractal dimension ${dimension.toFixed(2)} — sitting right on the famous ~1.71 that Witten and Sander found in 1981, the number the universe lands on for frost, lightning, and metal dendrites alike. Pure branching, tips outrunning the bays. Nobody has yet derived that number from scratch.`,
      tone: 'order',
    };
  }
  return {
    label: 'a coral, growing',
    line: `${particles.toLocaleString()} wanderers frozen so far${dimension > 0 ? `, fractal dimension ${dimension.toFixed(2)} and converging` : ''}. The cluster is shadowing its own interior — every branch you see is a place a wanderer happened to touch first.`,
    tone: 'neutral',
  };
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'amber' | 'teal' | 'violet';
}) {
  const valueClass =
    accent === 'amber' ? 'text-amber-300'
    : accent === 'teal' ? 'text-teal-300'
    : accent === 'violet' ? 'text-violet-300'
    : 'text-slate-100';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className={`break-all font-mono text-base font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
