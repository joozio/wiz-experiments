'use client';

/*
 * The Abelian Sandpile — WIZ edition.
 *
 * One rule, and a fractal grows out of a heap of sand. Every cell on a grid
 * holds some grains. The instant a cell holds four or more, it TOPPLES: it
 * gives away four grains, one to each of its north / south / east / west
 * neighbours, and keeps the rest. Grains that fall off the edge of the world are
 * lost. Keep toppling until nothing is unstable.
 *
 * Pour a single tall pile of tens of thousands of grains onto the centre and
 * that one rule prints a fractal mandala in perfect four-fold symmetry — a shape
 * no one designed and nobody has yet fully explained. Rain grains down one at a
 * time instead, and the pile organises ITSELF, with no tuning whatsoever, to the
 * exact edge of stability: most grains land and do nothing, then one identical
 * grain triggers an avalanche that crosses the whole grid. The avalanche sizes
 * fall on a power law — the same statistics behind earthquakes, forest fires,
 * brain cascades, and market crashes.
 *
 * Bak, Tang & Wiesenfeld, 1987 — "Self-Organized Criticality." Dhar, 1990 —
 * the abelian property that gives the model its name: the final pile is
 * byte-for-byte identical no matter what order you topple the cells in. This is
 * an honest live simulation, not a canned picture, and you can prove the
 * order-independence yourself with one button.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ---- grid + canvas ---------------------------------------------------------
const GW = 201; // odd, so there's a true centre cell
const GH = 201;
const SCALE = 3;
const CANVAS_W = GW * SCALE; // 603
const CANVAS_H = GH * SCALE; // 603
const CX = (GW / 2) | 0; // 100
const CY = (GH / 2) | 0; // 100
const CENTER_IDX = CY * GW + CX;
const N_CELLS = GW * GH;

// avalanche histogram (rain mode)
const BPD = 5; // log bins per decade
const NB = 40; // covers up to 10^8

type Mode = 'pour' | 'rain';

interface Preset {
  name: string;
  blurb: string;
  mode: Mode;
  grains?: number; // pour amount
}

const PRESETS: Preset[] = [
  { name: 'The Seedling', blurb: 'a small pile — see the bare four-fold cross', mode: 'pour', grains: 1024 },
  { name: 'The Diamond', blurb: 'a few thousand grains find their symmetry', mode: 'pour', grains: 4096 },
  { name: 'The Mandala', blurb: '16,384 grains print a fractal', mode: 'pour', grains: 16384 },
  { name: 'Deep Fractal', blurb: '50,000 grains, self-similar to the core', mode: 'pour', grains: 50000 },
  { name: 'Critical Rain', blurb: 'drip grains, watch the power law build', mode: 'rain' },
];

const POUR_AMOUNTS = [256, 1024, 4096, 16384, 50000];

// ---- cosmic colours for heights 0..3, white for the unstable front ----------
// little-endian RGBA: (A<<24)|(B<<16)|(G<<8)|R
const BG = (255 << 24) | (22 << 16) | (10 << 8) | 11; // #0b0a16 void
const C1 = (255 << 24) | (140 << 16) | (46 << 8) | 76; // violet
const C2 = (255 << 24) | (136 << 16) | (148 << 8) | 14; // teal
const C3 = (255 << 24) | (64 << 16) | (204 << 8) | 250; // gold
const WHITE = (255 << 24) | (255 << 16) | (245 << 8) | 245; // toppling flash
const COL = [BG, C1, C2, C3];

interface Stats {
  mode: Mode;
  grains: number; // total grains resting on the grid
  topplings: number; // total topplings (pour: this pile / rain: lifetime)
  radius: number; // pour: cluster radius
  drops: number; // rain: grains rained
  avalanches: number; // rain: avalanches with >=1 topple
  biggest: number; // rain: largest avalanche (topplings)
  tau: number; // rain: fitted power-law exponent
  running: boolean;
  phase: 'idle' | 'relaxing' | 'stable';
  reachedEdge: boolean;
}

interface Verdict {
  label: string;
  line: string;
  tone: 'order' | 'chaos' | 'neutral';
}

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histCanvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<ImageData | null>(null);
  const buf32Ref = useRef<Uint32Array | null>(null);

  // simulation state
  const heightRef = useRef<Int32Array>(new Int32Array(N_CELLS));
  const queueRef = useRef<number[]>([]); // unstable cells (LIFO stack — order is free)
  const inQRef = useRef<Uint8Array>(new Uint8Array(N_CELLS));

  // pour bookkeeping
  const phaseRef = useRef<'idle' | 'relaxing' | 'stable'>('idle');
  const pourTopplingsRef = useRef(0);
  const radiusRef = useRef(0);
  const reachedEdgeRef = useRef(false);

  // rain bookkeeping
  const histRef = useRef<Float64Array>(new Float64Array(NB));
  const dropsRef = useRef(0);
  const avalanchesRef = useRef(0);
  const biggestRef = useRef(0);
  const lifeTopplingsRef = useRef(0);
  const recordedRef = useRef(0); // avalanches with size>=1 (for pdf normalisation)
  const curAvalancheRef = useRef(0); // topplings in the avalanche currently relaxing
  const tauRef = useRef(0);

  // params read inside the loop
  const modeRef = useRef<Mode>('pour');
  const speedRef = useRef(40);
  const runningRef = useRef(true);

  const animRef = useRef(0);
  const frameRef = useRef(0);

  // react-facing state
  const [mode, setMode] = useState<Mode>('pour');
  const [pourAmount, setPourAmount] = useState(16384);
  const [speed, setSpeed] = useState(40);
  const [running, setRunning] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [proof, setProof] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    mode: 'pour', grains: 0, topplings: 0, radius: 0, drops: 0,
    avalanches: 0, biggest: 0, tau: 0, running: true, phase: 'idle', reachedEdge: false,
  });

  const pourAmountRef = useRef(16384);

  // ---- grid helpers --------------------------------------------------------
  const clearGrid = useCallback(() => {
    heightRef.current.fill(0);
    inQRef.current.fill(0);
    queueRef.current = [];
    pourTopplingsRef.current = 0;
    radiusRef.current = 0;
    reachedEdgeRef.current = false;
    curAvalancheRef.current = 0;
  }, []);

  const resetRain = useCallback(() => {
    histRef.current.fill(0);
    dropsRef.current = 0;
    avalanchesRef.current = 0;
    biggestRef.current = 0;
    lifeTopplingsRef.current = 0;
    recordedRef.current = 0;
    tauRef.current = 0;
  }, []);

  const queueIfUnstable = useCallback((idx: number) => {
    const inQ = inQRef.current;
    if (heightRef.current[idx] >= 4 && inQ[idx] === 0) {
      inQ[idx] = 1;
      queueRef.current.push(idx);
    }
  }, []);

  // drop `n` grains on the centre and start relaxing (pour mode)
  const dropPour = useCallback((n: number) => {
    clearGrid();
    heightRef.current[CENTER_IDX] += n;
    queueIfUnstable(CENTER_IDX);
    phaseRef.current = 'relaxing';
    pourTopplingsRef.current = 0;
  }, [clearGrid, queueIfUnstable]);

  // ---- one bounded slice of toppling (shared engine, LIFO = order-free) ----
  // Returns number of individual topplings performed (avalanche "size" units).
  const relaxStep = useCallback((budget: number): number => {
    const h = heightRef.current;
    const q = queueRef.current;
    const inQ = inQRef.current;
    let toppled = 0;
    while (q.length && toppled < budget) {
      const idx = q.pop() as number;
      inQ[idx] = 0;
      const height = h[idx];
      if (height < 4) continue;
      const t = height >> 2; // batch: topple this cell floor(h/4) times at once
      h[idx] = height - (t << 2);
      toppled += t;
      const x = idx - ((idx / GW) | 0) * GW; // idx % GW
      const y = (idx / GW) | 0;
      // hand t grains to each in-grid neighbour; off-grid = lost to the sink
      if (x > 0) { const ni = idx - 1; h[ni] += t; if (h[ni] >= 4 && inQ[ni] === 0) { inQ[ni] = 1; q.push(ni); } }
      if (x < GW - 1) { const ni = idx + 1; h[ni] += t; if (h[ni] >= 4 && inQ[ni] === 0) { inQ[ni] = 1; q.push(ni); } }
      if (y > 0) { const ni = idx - GW; h[ni] += t; if (h[ni] >= 4 && inQ[ni] === 0) { inQ[ni] = 1; q.push(ni); } }
      if (y < GH - 1) { const ni = idx + GW; h[ni] += t; if (h[ni] >= 4 && inQ[ni] === 0) { inQ[ni] = 1; q.push(ni); } }
    }
    return toppled;
  }, []);

  // ---- pour stats (radius + edge contact) ----------------------------------
  const measurePour = useCallback(() => {
    const h = heightRef.current;
    let maxR2 = 0;
    let grains = 0;
    let edge = false;
    for (let y = 0; y < GH; y++) {
      const row = y * GW;
      for (let x = 0; x < GW; x++) {
        const v = h[row + x];
        if (v > 0) {
          grains += v;
          const dx = x - CX;
          const dy = y - CY;
          const r2 = dx * dx + dy * dy;
          if (r2 > maxR2) maxR2 = r2;
          if (x === 0 || y === 0 || x === GW - 1 || y === GH - 1) edge = true;
        }
      }
    }
    reachedEdgeRef.current = edge;
    radiusRef.current = Math.sqrt(maxR2);
    return grains;
  }, []);

  // ---- rain power-law fit --------------------------------------------------
  const fitTau = useCallback((): number => {
    const hist = histRef.current;
    const total = recordedRef.current;
    if (total < 200) return 0;
    const xs: number[] = [];
    const ys: number[] = [];
    const cutoff = biggestRef.current * 0.3; // ignore the finite-size bump at the top
    for (let b = 0; b < NB; b++) {
      if (hist[b] < 6) continue;
      const lo = Math.pow(10, b / BPD);
      const hi = Math.pow(10, (b + 1) / BPD);
      const center = Math.sqrt(lo * hi);
      if (center < 4 || center > cutoff) continue;
      const width = hi - lo;
      const pdf = hist[b] / (width * total);
      xs.push(Math.log10(center));
      ys.push(Math.log10(pdf));
    }
    if (xs.length < 4) return 0;
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) * (xs[i] - mx);
    }
    if (den === 0) return 0;
    const slope = num / den;
    return Math.max(0, -slope);
  }, []);

  const recordAvalanche = useCallback((size: number) => {
    // a "quiet" drop (size 0) just lands; only count events that actually toppled
    if (size < 1) return;
    avalanchesRef.current++;
    if (size > biggestRef.current) biggestRef.current = size;
    const b = Math.min(NB - 1, Math.max(0, Math.floor(Math.log10(size) * BPD)));
    histRef.current[b]++;
    recordedRef.current++;
  }, []);

  // ---- render the pile -----------------------------------------------------
  const render = useCallback(() => {
    const off = offRef.current;
    const img = imgRef.current;
    const buf = buf32Ref.current;
    const canvas = canvasRef.current;
    if (!off || !img || !buf || !canvas) return;
    const h = heightRef.current;
    for (let i = 0; i < N_CELLS; i++) {
      const v = h[i];
      buf[i] = v >= 4 ? WHITE : COL[v];
    }
    img.data.set(new Uint8ClampedArray(buf.buffer));
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.putImageData(img, 0, 0);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, GW, GH, 0, 0, CANVAS_W, CANVAS_H);

    // gold glow on the active toppling front (the live avalanche edge)
    const q = queueRef.current;
    if (q.length) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(253,230,138,0.28)';
      const cap = Math.min(q.length, 7000);
      for (let k = 0; k < cap; k++) {
        const idx = q[k];
        const x = (idx - ((idx / GW) | 0) * GW) * SCALE;
        const y = ((idx / GW) | 0) * SCALE;
        ctx.fillRect(x - 1, y - 1, SCALE + 2, SCALE + 2);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }, []);

  // ---- render the avalanche-size histogram (rain mode) ---------------------
  const renderHist = useCallback(() => {
    const canvas = histCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b0a16';
    ctx.fillRect(0, 0, W, H);

    const hist = histRef.current;
    const total = recordedRef.current;
    const padL = 8, padR = 8, padT = 10, padB = 16;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // domain: log10(size) 0..~5.5 ; range: log10(pdf)
    const xMax = 5.5;
    let yMin = 0, yMax = -99;
    const pts: [number, number][] = [];
    if (total > 0) {
      for (let b = 0; b < NB; b++) {
        if (hist[b] < 1) continue;
        const lo = Math.pow(10, b / BPD);
        const hi = Math.pow(10, (b + 1) / BPD);
        const center = Math.sqrt(lo * hi);
        const width = hi - lo;
        const pdf = hist[b] / (width * total);
        const x = Math.log10(center);
        const y = Math.log10(pdf);
        if (x > xMax) continue;
        pts.push([x, y]);
        if (y > yMax) yMax = y;
        if (y < yMin) yMin = y;
      }
    }
    if (yMax < yMin) { yMin = -6; yMax = 0; }
    yMin = Math.min(yMin, yMax - 1);
    const sx = (x: number) => padL + (x / xMax) * plotW;
    const sy = (y: number) => padT + (1 - (y - yMin) / (yMax - yMin || 1)) * plotH;

    // faint grid lines per decade
    ctx.strokeStyle = 'rgba(148,163,184,0.12)';
    ctx.lineWidth = 1;
    for (let d = 0; d <= 5; d++) {
      const gx = sx(d);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();
    }

    // fitted power-law line
    const tau = tauRef.current;
    if (tau > 0 && pts.length > 1) {
      // anchor the line through the mean of the fitted points
      const inRange = pts.filter(([x]) => x >= Math.log10(4) && x <= Math.log10(Math.max(8, biggestRef.current * 0.3)));
      if (inRange.length > 1) {
        const mx = inRange.reduce((a, p) => a + p[0], 0) / inRange.length;
        const my = inRange.reduce((a, p) => a + p[1], 0) / inRange.length;
        const x0 = 0.3, x1 = xMax;
        const y0 = my - tau * (x0 - mx);
        const y1 = my - tau * (x1 - mx);
        ctx.strokeStyle = 'rgba(251,191,36,0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx(x0), sy(y0));
        ctx.lineTo(sx(x1), sy(y1));
        ctx.stroke();
      }
    }

    // points
    ctx.fillStyle = '#2dd4bf';
    for (const [x, y] of pts) {
      ctx.beginPath();
      ctx.arc(sx(x), sy(y), 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // x-axis ticks (decades)
    ctx.fillStyle = 'rgba(148,163,184,0.6)';
    ctx.font = '9px ui-monospace, monospace';
    ctx.textAlign = 'center';
    for (let d = 0; d <= 5; d++) {
      ctx.fillText(`10${sup(d)}`, sx(d), H - 4);
    }
    ctx.textAlign = 'left';
    ctx.fillText('avalanche size  (topplings) →', padL + 2, padT + 9);
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
      imgRef.current = octx.createImageData(GW, GH);
      buf32Ref.current = new Uint32Array(N_CELLS);
    }

    // open alive on The Mandala
    dropPour(16384);

    const tick = () => {
      const m = modeRef.current;
      if (runningRef.current) {
        if (m === 'pour') {
          if (phaseRef.current === 'relaxing') {
            const budget = speedRef.current * 3000; // 3k..300k topplings/frame
            const t = relaxStep(budget);
            pourTopplingsRef.current += t;
            if (queueRef.current.length === 0) {
              phaseRef.current = 'stable';
              measurePour();
            }
          }
        } else {
          // RAIN: interleave new single-grain drops with relaxation
          const toppleBudget = 200000;
          const dropBudget = speedRef.current * 6; // 6..600 grains/frame
          let work = 0;
          let drops = 0;
          while (work < toppleBudget) {
            if (queueRef.current.length === 0) {
              // previous avalanche has settled — start a fresh single-grain drop
              if (drops >= dropBudget) break;
              const rx = 1 + ((Math.random() * (GW - 2)) | 0);
              const ry = 1 + ((Math.random() * (GH - 2)) | 0);
              const idx = ry * GW + rx;
              heightRef.current[idx]++;
              dropsRef.current++;
              drops++;
              curAvalancheRef.current = 0;
              if (heightRef.current[idx] >= 4) queueIfUnstable(idx);
              // else: a quiet drop that triggers no avalanche
              continue;
            }
            const t = relaxStep(toppleBudget - work);
            work += t;
            curAvalancheRef.current += t;
            lifeTopplingsRef.current += t;
            if (queueRef.current.length === 0) {
              recordAvalanche(curAvalancheRef.current);
            }
          }
          if (frameRef.current % 20 === 0) tauRef.current = fitTau();
        }
      }

      frameRef.current++;
      render();
      if (m === 'rain' && frameRef.current % 6 === 0) renderHist();

      if (frameRef.current % 6 === 0 || (m === 'pour' && phaseRef.current === 'stable')) {
        setStats({
          mode: m,
          grains: m === 'pour' && phaseRef.current === 'stable' ? gridGrains(heightRef.current) : 0,
          topplings: m === 'pour' ? pourTopplingsRef.current : lifeTopplingsRef.current,
          radius: Math.round(radiusRef.current),
          drops: dropsRef.current,
          avalanches: avalanchesRef.current,
          biggest: biggestRef.current,
          tau: tauRef.current,
          running: runningRef.current,
          phase: phaseRef.current,
          reachedEdge: reachedEdgeRef.current,
        });
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- controls ------------------------------------------------------------
  const switchMode = useCallback((m: Mode) => {
    modeRef.current = m;
    setMode(m);
    if (m === 'pour') {
      dropPour(pourAmountRef.current);
    } else {
      clearGrid();
      resetRain();
      phaseRef.current = 'idle';
    }
    runningRef.current = true;
    setRunning(true);
  }, [dropPour, clearGrid, resetRain]);

  const doPour = useCallback((n: number) => {
    pourAmountRef.current = n;
    setPourAmount(n);
    modeRef.current = 'pour';
    setMode('pour');
    dropPour(n);
    runningRef.current = true;
    setRunning(true);
  }, [dropPour]);

  const resetCurrent = useCallback(() => {
    if (modeRef.current === 'pour') {
      dropPour(pourAmountRef.current);
    } else {
      clearGrid();
      resetRain();
      phaseRef.current = 'idle';
    }
    runningRef.current = true;
    setRunning(true);
  }, [dropPour, clearGrid, resetRain]);

  const toggleRun = useCallback(() => {
    const next = !runningRef.current;
    runningRef.current = next;
    setRunning(next);
  }, []);

  const jumpTo = useCallback((p: Preset) => {
    if (p.mode === 'pour' && p.grains) {
      doPour(p.grains);
    } else {
      switchMode('rain');
    }
  }, [doPour, switchMode]);

  // ---- poke the pile -------------------------------------------------------
  const pokeAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const gx = Math.floor(((clientX - rect.left) / rect.width) * GW);
    const gy = Math.floor(((clientY - rect.top) / rect.height) * GH);
    if (gx < 0 || gx >= GW || gy < 0 || gy >= GH) return;
    const idx = gy * GW + gx;
    const add = modeRef.current === 'pour' ? 120 : 40;
    heightRef.current[idx] += add;
    if (modeRef.current === 'pour') {
      pourAmountRef.current += add;
      phaseRef.current = 'relaxing';
    } else {
      curAvalancheRef.current = 0;
    }
    queueIfUnstable(idx);
    runningRef.current = true;
    setRunning(true);
  }, [queueIfUnstable]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pokeAt(e.clientX, e.clientY);
  }, [pokeAt]);

  // ---- prove the abelian property (order-independence) ---------------------
  const proveAbelian = useCallback(() => {
    const K = 3000;
    const a = new Int32Array(N_CELLS);
    const b = new Int32Array(N_CELLS);
    a[CENTER_IDX] = K;
    b[CENTER_IDX] = K;
    const ta = relaxOrdered(a, 'lifo');
    const tb = relaxOrdered(b, 'fifo');
    let identical = true;
    for (let i = 0; i < N_CELLS; i++) { if (a[i] !== b[i]) { identical = false; break; } }
    setProof(
      identical && ta === tb
        ? `Relaxed the same ${K.toLocaleString()}-grain pile two completely different ways (last-in-first-out vs first-in-first-out toppling). Both settled into a byte-for-byte identical mandala after exactly ${ta.toLocaleString()} topplings. The order never mattered. That is the theorem the model is named for. ✓`
        : `Unexpected: the two orderings disagreed (${ta} vs ${tb} topplings). That should be impossible — please reload.`
    );
  }, []);

  const onCopy = useCallback(async () => {
    const text = mode === 'pour'
      ? `I poured ${gridGrains(heightRef.current).toLocaleString()} grains of sand onto one cell, and a single rule — topple at four, spill one to each neighbour — printed a fractal mandala in perfect four-fold symmetry. ${pourTopplingsRef.current.toLocaleString()} topplings, no blueprint, no painter.\n\nThe Abelian Sandpile, WIZ edition: https://wiz.jock.pl/experiments/abelian-sandpile`
      : `I dripped ${dropsRef.current.toLocaleString()} grains of sand one at a time, and the pile organised ITSELF to the edge of collapse: most grains did nothing, then one identical grain set off an avalanche of ${biggestRef.current.toLocaleString()} topplings. The sizes fall on a power law${tauRef.current > 0 ? ` (slope ~${tauRef.current.toFixed(2)})` : ''} — the same math behind earthquakes and market crashes.\n\nThe Abelian Sandpile, WIZ edition: https://wiz.jock.pl/experiments/abelian-sandpile`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }, [mode]);

  // ---- verdict -------------------------------------------------------------
  const verdict = makeVerdict(stats);
  const toneClass =
    verdict.tone === 'order'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'chaos'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Abelian Sandpile
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            One rule: a cell with four or more grains topples, handing one to each neighbour. Pour a pile and it
            prints a fractal mandala. Rain grains one at a time and the pile drives itself to the edge of collapse.
          </p>
        </header>

        {/* Mode toggle */}
        <div className="mb-4 flex justify-center gap-2">
          {([['pour', 'Pour a pile'], ['rain', 'Rain (criticality)']] as [Mode, string][]).map(([m, label]) => (
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

        {/* Canvas */}
        <div
          className="rounded-lg border border-slate-800 bg-[#0b0a16] shadow-2xl shadow-indigo-950/40 overflow-hidden"
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            className="block w-full h-full touch-none cursor-crosshair"
            aria-label="An Abelian sandpile simulation: cells topple grains to their neighbours, growing a fractal pattern."
          />
        </div>
        <div className="flex items-center justify-between px-1 pt-1.5 font-mono text-[10px] text-slate-600 mb-4">
          <span>0 · 1 · 2 · 3 grains</span>
          <span className="text-slate-500">tap the pile to pour more sand</span>
          <span>void → violet → teal → gold</span>
        </div>

        {/* Avalanche histogram (rain only) */}
        {mode === 'rain' && (
          <div className="mb-4 rounded-lg border border-slate-800 bg-[#0b0a16] p-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Avalanche size distribution · log–log
            </div>
            <canvas
              ref={histCanvasRef}
              width={600}
              height={150}
              className="block w-full"
              aria-label="A log-log plot of avalanche sizes, showing a power law."
            />
            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
              A straight line on log–log axes is a power law: avalanches have no typical size. The gold line is the live fit.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 mb-4">
          {mode === 'pour' && (
            <div className="mb-4">
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Grains to pour
              </div>
              <div className="flex flex-wrap gap-2">
                {POUR_AMOUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => doPour(n)}
                    className={`rounded-md border px-3 py-1 font-mono text-xs transition ${
                      pourAmount === n
                        ? 'border-teal-400/70 bg-teal-500/15 text-teal-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {n.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">Speed</span>
              <span className="font-mono text-sm tabular-nums text-slate-200">{speed}</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={speed}
              onChange={(e) => { const v = +e.target.value; setSpeed(v); speedRef.current = v; }}
              className="h-1.5 w-full cursor-pointer accent-teal-400"
            />
            <p className="mt-1 text-[10px] text-slate-600">
              {mode === 'pour' ? 'how fast the pile collapses and relaxes' : 'how fast grains rain down'}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={toggleRun}
              className="rounded-md border border-teal-400/70 bg-teal-500/15 px-3 py-1 font-mono text-xs text-teal-200 transition hover:bg-teal-500/25"
            >
              {running ? '❚❚ Pause' : '▶ Play'}
            </button>
            <button
              onClick={resetCurrent}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              {mode === 'pour' ? '↺ Re-pour' : '↺ Reset rain'}
            </button>
            {mode === 'pour' && stats.reachedEdge && (
              <span className="font-mono text-[10px] text-amber-300/80">
                touched the edge — grains are spilling into the void
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        {mode === 'pour' ? (
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <Stat label="Grains" value={stats.grains > 0 ? stats.grains.toLocaleString() : pourAmount.toLocaleString()} accent="gold" />
            <Stat label="Topplings" value={stats.topplings.toLocaleString()} accent="teal" />
            <Stat label="Radius" value={`${stats.radius} px`} accent="violet" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-center mb-4 sm:grid-cols-4">
            <Stat label="Grains rained" value={stats.drops.toLocaleString()} accent="gold" />
            <Stat label="Avalanches" value={stats.avalanches.toLocaleString()} accent="teal" />
            <Stat label="Biggest" value={stats.biggest.toLocaleString()} accent="violet" />
            <Stat label="Power law τ" value={stats.tau > 0 ? stats.tau.toFixed(2) : '—'} accent="teal" />
          </div>
        )}

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
            Same one rule every time. The only thing that changes is whether you dump the sand all at once or one grain at a time.
          </p>
        </div>

        {/* Prove abelian */}
        <div className="rounded-lg border border-violet-500/30 bg-violet-950/10 p-5 mb-6">
          <h3 className="mb-2 text-base font-semibold text-violet-200">Why &ldquo;abelian&rdquo;?</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Here is the strangest part. While the pile is collapsing, dozens of cells are unstable at once, and you
            could topple them in any order you like. It feels like the final shape should depend on which cell you
            pick first. It does not. The pile always lands in the exact same configuration, after the exact same number
            of topplings, no matter the order. Don&rsquo;t take my word for it.
          </p>
          <button
            onClick={proveAbelian}
            className="mt-3 rounded-md border border-violet-400/60 bg-violet-500/15 px-4 py-1.5 font-mono text-xs text-violet-200 transition hover:bg-violet-500/25"
          >
            Prove the order doesn&rsquo;t matter
          </button>
          {proof && (
            <p className="mt-3 rounded-md border border-violet-500/20 bg-black/30 p-3 text-sm leading-relaxed text-violet-100">
              {proof}
            </p>
          )}
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
                Every cell on the grid holds a number of grains. The single rule: any cell holding{' '}
                <span className="text-amber-300">four or more</span> is unstable and{' '}
                <span className="text-teal-300">topples</span> — it gives away exactly four grains, one to each of its
                four orthogonal neighbours, and keeps whatever is left. A grain that would fall off the edge of the
                grid is simply lost. Keep applying the rule until every cell holds three or fewer. That stable
                snapshot is what you see, coloured by height: <span className="text-violet-300">1 violet</span>,{' '}
                <span className="text-teal-300">2 teal</span>, <span className="text-amber-300">3 gold</span>.
              </p>
              <ul className="ml-1 space-y-2">
                <li>
                  <span className="text-amber-300">Pour.</span> Dump tens of thousands of grains onto the centre cell
                  at once. It topples, its neighbours topple, and a wave of collapse spreads outward and prints a
                  fractal mandala — self-similar, four-fold symmetric, the same every time.
                </li>
                <li>
                  <span className="text-teal-300">Rain.</span> Drop grains one at a time at random spots. At first
                  almost nothing happens. But the pile fills, and once it reaches the critical state, a single grain
                  can set off an avalanche that crosses the whole grid. Their sizes follow a power law.
                </li>
              </ul>
              <p className="text-slate-400">
                Nothing in here aims for a fractal or a power law. There is no plan and no painter. Both fall out of
                &ldquo;add four, spill one to each side,&rdquo; and that is the whole point.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Most things in nature need a force to push them to a knife-edge and a hand to hold them there. The sandpile
            needs neither. Drip grains at random and it walks <span className="text-slate-100">itself</span> to the
            exact critical point between order and collapse, then stays balanced there forever, with nobody tuning
            anything. That is <span className="text-slate-100">self-organised criticality</span>, and it was the first
            clean answer to a very old question: why is the world full of events with no typical size?
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            At that critical edge, most additions do nothing and a rare one triggers a collapse of any scale at all —
            the literal straw that breaks the camel&rsquo;s back. The avalanche sizes obey a{' '}
            <span className="text-slate-100">power law</span>: the same statistics that describe earthquakes
            (Gutenberg–Richter), forest fires, sandpiles and snow slopes, extinction events, traffic jams, cascades of
            neurons firing in your cortex, and crashes ripping through a market. Small ones constantly, big ones rarely,
            no safe size, no way to predict which grain will be the one.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            And the fractal the pour leaves behind carries the same lesson as frost and coral and lightning:{' '}
            <span className="text-slate-100">intricate, organised form does not require an intricate cause.</span> It
            often needs only a dumb local rule, repeated past counting, with no one watching the whole.
          </p>
        </div>

        {/* History */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            In 1987 three physicists at Brookhaven — <span className="text-slate-300">Per Bak, Chao Tang and Kurt
            Wiesenfeld</span> — published &ldquo;Self-Organized Criticality: An Explanation of 1/f Noise,&rdquo; one of
            the most cited papers in modern physics. They were chasing a mystery: why does the same faint flicker, a
            power-law &ldquo;1/f&rdquo; noise, turn up everywhere from electronics to hourglasses to starlight? Their
            toy answer was this pile of sand. Bak went on to argue, in <em>How Nature Works</em> (1996), that the same
            self-organising edge governs evolution, economics and earthquakes — sweeping, contested, and still
            argued over. In 1990 <span className="text-slate-300">Deepak Dhar</span> proved the model&rsquo;s deepest
            property and gave it its name: the <span className="text-slate-300">abelian</span> sandpile, where the final
            state is independent of the order of topplings, which connects it to a beautiful piece of algebra (the
            sandpile group) and to the discrete Laplacian. Real avalanche experiments on actual sand were messier than
            the theory; physicists found cleaner power laws in piles of long rice (the Oslo experiment, 1996). The math,
            meanwhile, kept giving — the single-source mandala you poured above is still not fully understood, and its
            fractal structure is an active research subject to this day.
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
            {mode === 'pour' ? 'Pour it again' : 'Rain it again'}
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

// ---- pure helpers ----------------------------------------------------------

// total grains resting on the grid (sum of heights)
function gridGrains(h: Int32Array): number {
  let s = 0;
  for (let i = 0; i < h.length; i++) s += h[i];
  return s;
}

// fully relax a height grid with a chosen toppling order; returns total topplings.
// Used by the abelian proof — two orders, identical result.
function relaxOrdered(h: Int32Array, order: 'lifo' | 'fifo'): number {
  const inQ = new Uint8Array(h.length);
  const q: number[] = [];
  for (let i = 0; i < h.length; i++) {
    if (h[i] >= 4) { inQ[i] = 1; q.push(i); }
  }
  let head = 0;
  let toppled = 0;
  const pull = order === 'lifo'
    ? () => q.pop() as number
    : () => q[head++];
  const more = order === 'lifo'
    ? () => q.length > 0
    : () => head < q.length;
  while (more()) {
    const idx = pull();
    inQ[idx] = 0;
    const height = h[idx];
    if (height < 4) continue;
    const t = height >> 2;
    h[idx] = height - (t << 2);
    toppled += t;
    const x = idx - ((idx / GW) | 0) * GW;
    const y = (idx / GW) | 0;
    if (x > 0) { const n = idx - 1; h[n] += t; if (h[n] >= 4 && inQ[n] === 0) { inQ[n] = 1; q.push(n); } }
    if (x < GW - 1) { const n = idx + 1; h[n] += t; if (h[n] >= 4 && inQ[n] === 0) { inQ[n] = 1; q.push(n); } }
    if (y > 0) { const n = idx - GW; h[n] += t; if (h[n] >= 4 && inQ[n] === 0) { inQ[n] = 1; q.push(n); } }
    if (y < GH - 1) { const n = idx + GW; h[n] += t; if (h[n] >= 4 && inQ[n] === 0) { inQ[n] = 1; q.push(n); } }
  }
  return toppled;
}

function sup(d: number): string {
  return ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸'][d] ?? '';
}

function makeVerdict(stats: Stats): Verdict {
  const { mode, grains, topplings, drops, biggest, tau, phase, reachedEdge } = stats;

  if (mode === 'pour') {
    if (phase === 'relaxing') {
      return {
        label: 'collapsing',
        line: 'The pile is toppling outward. Every cell that reaches four sheds one grain to each side, those neighbours reach four, and the wave of collapse keeps spreading until nothing is left above three. Watch the gold front race the edge.',
        tone: 'neutral',
      };
    }
    if (reachedEdge) {
      return {
        label: 'spilled over',
        line: 'The pile grew until it touched the boundary, so grains are now pouring off the edge into the void and the clean mandala is breaking. Pour fewer grains to keep the whole fractal inside the dish.',
        tone: 'chaos',
      };
    }
    if (grains > 0 && grains < 1500) {
      return {
        label: 'the bare cross',
        line: `A small pile, ${grains.toLocaleString()} grains, ${topplings.toLocaleString()} topplings. At this size you can still read the raw four-fold cross the rule prints before the fractal detail takes over. Pour more and the self-similar structure fills in.`,
        tone: 'neutral',
      };
    }
    return {
      label: 'a fractal mandala',
      line: `${grains.toLocaleString()} grains settled after ${topplings.toLocaleString()} topplings into a shape with perfect four-fold symmetry and self-similar patches at every scale — and no one drew a line of it. Pour the same number again and you get the exact same mandala. Its detailed structure is still an open research problem.`,
      tone: 'order',
    };
  }

  // rain
  const filling = drops < N_CELLS * 1.3; // roughly sub-critical until the pile saturates
  if (drops < 4000) {
    return {
      label: 'priming',
      line: 'Grains are raining down and mostly just sitting where they land. The pile is sub-critical: too empty for one grain to set off much. Keep going — it has to fill before it can break.',
      tone: 'neutral',
    };
  }
  if (filling) {
    return {
      label: 'approaching the edge',
      line: `${drops.toLocaleString()} grains in. Avalanches are starting to chain — the biggest so far is ${biggest.toLocaleString()} topplings. The pile is climbing toward the critical state on its own, with nobody tuning it.`,
      tone: 'neutral',
    };
  }
  return {
    label: 'self-organised criticality',
    line: `The pile found the edge of collapse and parked there. Most grains still do nothing; rare ones trigger avalanches up to ${biggest.toLocaleString()} topplings that span the grid. The sizes fall on a power law${tau > 0 ? `, slope τ ≈ ${tau.toFixed(2)}` : ''} — no typical size, exactly like earthquakes and market crashes. The straw that breaks the camel's back, made literal.`,
    tone: 'order',
  };
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
      <div className={`break-all font-mono text-base font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
