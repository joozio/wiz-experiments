'use client';

import { useEffect, useRef, useState } from 'react';

// Flake. One speck of ice falls through forty seconds of today's sky. You drag the world sideways
// into clouds or clear air, and Reiter's hexagonal automaton grows the crystal live from your route.
// Everything runs in the browser. The share link carries the date and the quantised route, and the
// flake is re-grown from those two things on any device.

// ===== FLAKE CORE BEGIN =====
// Model, sky, renderer and replay. No React, no DOM except ImageData in the renderer, so
// experiments/weekly/2026-W45/production/calib.mjs can extract this block and run it in node.

type Sim = {
  R: number; W: number; N: number; s: Float32Array; frozenAt: Int32Array; IN: Int32Array; RING: Int32Array;
  dist: Int16Array; t: number; radius: number; area: number; beta: number;
  reset: (b: number) => void; step: (gamma: number, alpha: number) => void;
};
type Layer = { t0: number; t1: number; T: number };
type Cloud = { t: number; x: number; w: number; h: number; wet: number };
type Sky = {
  seed: number; layers: Layer[]; clouds: Cloud[]; beta: number;
  wind: (t: number) => number; tempAt: (t: number) => number; wetAt: (x: number, t: number) => number;
};

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID_R = 140;
const END_R = 129; // 92 percent of the grid radius ends the fall early
const FALL = 40; // seconds
const TICKS = FALL * 10; // input is sampled at 10 Hz
const XMAX = 1.6; // the crystal's world x is clamped to +-1.6 screen widths
const TMAX = 1.5; // steering target range
const QLEVELS = 64;
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

// Reiter (2005) hexagonal automaton on an axial grid, square storage. idx = (r + R) * W + (q + R)
function makeSim(R: number, beta: number): Sim {
  const W = 2 * R + 1, N = W * W;
  const s = new Float32Array(N), u = new Float32Array(N), v = new Float32Array(N);
  const frozenAt = new Int32Array(N).fill(-1);
  const inner: number[] = [], ring: number[] = [];
  const dist = new Int16Array(N).fill(R + 1);
  for (let r = -R; r <= R; r++) for (let q = -R; q <= R; q++) {
    const d = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
    const i = (r + R) * W + (q + R);
    dist[i] = Math.min(R + 1, d);
    if (d > R) continue;
    (d === R ? ring : inner).push(i);
  }
  const IN = Int32Array.from(inner), RING = Int32Array.from(ring);
  const sim: Sim = {
    R, W, N, s, frozenAt, IN, RING, dist, t: 0, radius: 0, area: 0, beta,
    reset(b: number) {
      sim.beta = b; s.fill(0);
      for (let k = 0; k < IN.length; k++) s[IN[k]] = b;
      for (let k = 0; k < RING.length; k++) s[RING[k]] = b;
      frozenAt.fill(-1); const c = R * W + R; s[c] = 1; frozenAt[c] = 0; sim.t = 0; sim.radius = 0; sim.area = 1;
    },
    step(gamma: number, alpha: number) {
      const n = IN.length, b = sim.beta, a2 = alpha / 2;
      for (let k = 0; k < n; k++) {
        const i = IN[k];
        const rec = s[i] >= 1 || s[i + 1] >= 1 || s[i - 1] >= 1 || s[i + W] >= 1 || s[i - W] >= 1 || s[i + 1 - W] >= 1 || s[i - 1 + W] >= 1;
        if (rec) { v[i] = s[i] + gamma; u[i] = 0; } else { v[i] = 0; u[i] = s[i]; }
      }
      for (let k = 0; k < RING.length; k++) { u[RING[k]] = b; v[RING[k]] = 0; }
      const t = ++sim.t; let rad = sim.radius, area = sim.area;
      for (let k = 0; k < n; k++) {
        const i = IN[k];
        const m = (u[i + 1] + u[i - 1] + u[i + W] + u[i - W] + u[i + 1 - W] + u[i - 1 + W]) / 6;
        const ns = u[i] + a2 * (m - u[i]) + v[i];
        s[i] = ns;
        if (ns >= 1 && frozenAt[i] < 0) { frozenAt[i] = t; area++; if (dist[i] > rad) rad = dist[i]; }
      }
      sim.radius = rad; sim.area = area;
    },
  };
  sim.reset(beta);
  return sim;
}

// d in [0,1]: 0 = dry (plate preset), 1 = wet at peak temperature (fern preset).
// Wednesday's calibration (data/sheet-05-dry-compare.png): dry gamma 0.016 keeps arms through dry spells.
const PRESET = { dry: { gamma: 0.016, alpha: 0.75 }, wet: { gamma: 0.0004, alpha: 1.6 } };
function drive(d: number) {
  const lg0 = Math.log(PRESET.dry.gamma), lg1 = Math.log(PRESET.wet.gamma);
  return { gamma: Math.exp(lg0 + (lg1 - lg0) * d), alpha: PRESET.dry.alpha + (PRESET.wet.alpha - PRESET.dry.alpha) * d };
}
// sim steps per 0.1 s input tick: wet air feeds fast growth, dry air starves it
const STEPS = { dry: 1, wet: 5 }; // Thursday: dry 1 (was 1.5) so wet time decides the shape
function stepsFor(d: number) { return STEPS.dry + (STEPS.wet - STEPS.dry) * d; }
function peakT(T: number) {
  // 1 at -15 C, 0.5 at -2 C and -22 C
  if (T >= -15) return 1 - 0.5 * Math.min(1, (T + 15) / 13);
  return 1 - 0.5 * Math.min(1, (-15 - T) / 7);
}

// The day's sky. seed = YYYYMMDD of the visitor's local date.
const SKYCFG = { n: 32, hMin: 1.1, hVar: 1.1, wMin: 0.6, wVar: 0.4, cap: 0.6, clearUntil: 3 };
function makeSky(seed: number): Sky {
  const rnd = mulberry32(seed);
  const lens = [0, 0, 0, 0].map(() => 6 + rnd() * 8), sum = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  const layers: Layer[] = lens.map((l) => { const t0 = acc; acc += (l / sum) * FALL; return { t0, t1: acc, T: -Math.round(2 + rnd() * 20) }; });
  if (!layers.some((l) => l.T <= -12 && l.T >= -17)) layers[1 + Math.floor(rnd() * 2)].T = -(12 + Math.round(rnd() * 5));
  layers[3].t1 = FALL;
  const beta = 0.38 + rnd() * 0.06;
  const windA = (rnd() * 2 - 1) * 0.5, windP = rnd() * 6.28;
  const wind = (t: number) => windA * Math.sin(t * 0.12 + windP);
  const tempAt = (t: number) => { for (const l of layers) if (t < l.t1) return l.T; return layers[3].T; };

  // coverage bookkeeping: per 0.1 s row, the wet intervals already placed
  const ROWS = TICKS + 40, rows: [number, number][][] = Array.from({ length: ROWS }, () => []);
  const span = (c: Cloud, ti: number): [number, number] | null => {
    const dy = (ti / 10 - c.t) / (c.h / 2);
    if (dy * dy >= 1) return null;
    const hw = (c.w / 2) * Math.sqrt(1 - dy * dy);
    const a = Math.max(-XMAX, c.x - hw), b = Math.min(XMAX, c.x + hw);
    return b > a ? [a, b] : null;
  };
  const covered = (list: [number, number][]) => {
    const s = list.slice().sort((p, q) => p[0] - q[0]); let tot = 0, cur = -Infinity;
    for (const [a, b] of s) { const lo = Math.max(a, cur); if (b > lo) tot += b - lo; cur = Math.max(cur, b); }
    return tot;
  };
  const capW = SKYCFG.cap * 2 * XMAX;
  const fits = (c: Cloud) => {
    for (let ti = 0; ti < ROWS; ti++) {
      const sp = span(c, ti); if (!sp) continue;
      if (covered(rows[ti].concat([sp])) > capW + 1e-9) return false;
      // clear air where the untouched crystal starts, so the first seconds read before the weather does
      if (ti / 10 < SKYCFG.clearUntil) { const cx = wind(ti / 10); if (cx > sp[0] - 0.12 && cx < sp[1] + 0.12) return false; }
    }
    return true;
  };
  const clouds: Cloud[] = [];
  const n = SKYCFG.n;
  for (let k = 0; k < n; k++) {
    const t = 1 + (k / n) * (FALL - 1.5) + rnd() * 1.0;
    const lane = k % 2 ? 1 : -1;
    const c: Cloud = { t, x: lane * (0.2 + rnd() * 0.9), w: SKYCFG.wMin + rnd() * SKYCFG.wVar, h: SKYCFG.hMin + rnd() * SKYCFG.hVar, wet: 0.75 + rnd() * 0.25 };
    // shrink, then push outward, before giving up on a cloud
    let ok = fits(c);
    for (let j = 0; !ok && j < 8; j++) {
      if (j % 2 === 0) c.w *= 0.85; else c.x = Math.max(-XMAX + 0.1, Math.min(XMAX - 0.1, c.x + lane * 0.12));
      ok = fits(c);
    }
    if (!ok) continue;
    clouds.push(c);
    for (let ti = 0; ti < ROWS; ti++) { const sp = span(c, ti); if (sp) rows[ti].push(sp); }
  }
  // wetness of the air at world x (screen widths) and fall time t; saturates inside r^2 < 0.67
  const wetAt = (x: number, t: number) => {
    let w = 0;
    for (let k = 0; k < clouds.length; k++) {
      const c = clouds[k];
      const dy = (t - c.t) / (c.h / 2); if (dy >= 1 || dy <= -1) continue;
      const dx = (x - c.x) / (c.w / 2);
      const r2 = dx * dx + dy * dy;
      if (r2 < 1) w = Math.max(w, c.wet * Math.min(1, (1 - r2) * 3));
    }
    return w;
  };
  return { seed, layers, clouds, beta, wind, tempAt, wetAt };
}

const qToTarget = (q: number) => (q / (QLEVELS - 1)) * 2 * TMAX - TMAX;
const targetToQ = (t: number) => Math.max(0, Math.min(QLEVELS - 1, Math.round(((t + TMAX) / (2 * TMAX)) * (QLEVELS - 1))));
const Q0 = targetToQ(0);
const crystalX = (sky: Sky, target: number, t: number) => Math.max(-XMAX, Math.min(XMAX, -target + sky.wind(t)));

// One fall. Live play and link replay both go through tick(q), so the same path string grows
// the same flake on any device.
type Run = {
  sky: Sky; sim: Sim; tick: number; acc: number; path: number[]; wet: number[]; xs: number[]; d: number[];
  coldest: number; wetTicks: number; done: boolean; step: (q: number) => number;
};
function makeRun(sky: Sky, sim: Sim): Run {
  sim.reset(sky.beta);
  const run: Run = {
    sky, sim, tick: 0, acc: 0, path: [], wet: [], xs: [], d: [], coldest: 0, wetTicks: 0, done: false,
    step(q: number) {
      const tt = run.tick / 10, x = crystalX(sky, qToTarget(q), tt);
      const wet = sky.wetAt(x, tt), T = sky.tempAt(tt);
      run.coldest = Math.min(run.coldest, T);
      const d = wet * peakT(T), p = drive(d);
      run.acc += stepsFor(d);
      while (run.acc >= 1) { sim.step(p.gamma, p.alpha); run.acc -= 1; }
      run.path.push(q); run.xs.push(x); run.wet.push(wet > 0.3 ? 1 : 0); run.d.push(d);
      if (wet > 0.3) run.wetTicks++;
      run.tick++;
      if (run.tick >= TICKS || sim.radius >= END_R) run.done = true;
      return wet;
    },
  };
  return run;
}
const encodePath = (path: number[]) => path.map((q) => B64[q]).join('');
function decodePath(p: string): number[] | null {
  if (!p || p.length > TICKS) return null;
  const out: number[] = [];
  for (let i = 0; i < p.length; i++) { const q = B64.indexOf(p[i]); if (q < 0) return null; out.push(q); }
  return out;
}
function fnv(str: string) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const flakeNumber = (seed: number, pathStr: string) => (fnv(seed + ':' + pathStr) % 9000) + 1000;
// the wind steered if the quantised target never left where it started
const untouched = (path: number[]) => path.every((q) => q === Q0);

// Shape stats from the frozen mask: branchiness = perimeter^2 / area, fill = area / bounding hexagon area.
function shapeStats(sim: Sim) {
  const fa = sim.frozenAt, W = sim.W; let area = 0, per = 0;
  const IN = sim.IN;
  for (let k = 0; k < IN.length; k++) {
    const i = IN[k];
    if (fa[i] < 0) continue; area++;
    if (fa[i + 1] < 0) per++; if (fa[i - 1] < 0) per++; if (fa[i + W] < 0) per++; if (fa[i - W] < 0) per++; if (fa[i + 1 - W] < 0) per++; if (fa[i - 1 + W] < 0) per++;
  }
  const rr = sim.radius, hexA = 3 * rr * (rr + 1) + 1;
  return { area, per, branch: (per * per) / area, fill: area / hexA, radius: rr };
}
type Shape = 'fern' | 'stellar' | 'sectored' | 'plate';
// Thursday's 40 run sheet (production/sheet-final.png): dodgers grow the broad six point plate at
// fill 0.62 to 0.73, chasers the ferns under 0.47. The plate line says you dodged every cloud, so it
// is gated on the stats agreeing; a solid flake grown mid cloud gets the sectored line instead.
const CLASS = { plate: 0.6, sectored: 0.58, stellar: 0.47, plateMaxPct: 10 };
function classify(st: { fill: number }, pct: number): Shape {
  if (st.fill > CLASS.plate && pct < CLASS.plateMaxPct) return 'plate';
  if (st.fill > CLASS.sectored) return 'sectored';
  if (st.fill > CLASS.stellar) return 'stellar';
  return 'fern';
}
// Ice renderer. Each offscreen pixel sits in a triangle of three hex cell centres and blends them
// barycentrically, so cells never read as beads: the frozen mask is interpolated and cut at 0.5
// with a one pixel ramp, and colour is averaged over the frozen corners only.
type Renderer = { draw: (viewR: number, o: { wet?: number; rim?: number }) => ImageData; size: number };
function makeRenderer(sim: Sim, size: number): Renderer | null {
  if (typeof ImageData === 'undefined') return null;
  const S = Math.sqrt(3), W = sim.W, R = sim.R, N = sim.N, n = size * size;
  const img = new ImageData(size, size);
  const base = new Int32Array(n), up = new Uint8Array(n), fa_ = new Float32Array(n), fb_ = new Float32Array(n), pd = new Int16Array(n);
  let lutView = -1, pxCell = 1;
  const F = new Float32Array(N), CR = new Float32Array(N), CG = new Float32Array(N), CB = new Float32Array(N), CA = new Float32Array(N), HZ = new Float32Array(N);
  // pointy top axial: x = sqrt3 * (q + r/2), y = 1.5 r. Light from top left.
  const nb = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]].map(([q, r]) => {
    const x = S * (q + r / 2), y = 1.5 * r, l = Math.hypot(x, y);
    return { o: r * W + q, x: x / l, y: y / l };
  });
  const Lx = -0.6, Ly = -0.8;
  const hd = (q: number, r: number) => Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
  function buildLut(viewR: number) {
    const k = (viewR * S) / (size / 2); // hex units per px: an arm of viewR cells reaches the edge
    pxCell = S / k;
    for (let py = 0, p = 0; py < size; py++) for (let px = 0; px < size; px++, p++) {
      const x = (px + 0.5 - size / 2) * k, y = (py + 0.5 - size / 2) * k;
      const r = y / 1.5, q = x / S - r / 2;
      const fq = Math.floor(q), fr = Math.floor(r), a = q - fq, b = r - fr;
      const d = Math.max(hd(fq, fr), hd(fq + 1, fr), hd(fq, fr + 1), hd(fq + 1, fr + 1));
      if (d >= R) { base[p] = -1; continue; }
      base[p] = (fr + R) * W + (fq + R); up[p] = a + b >= 1 ? 1 : 0; fa_[p] = a; fb_[p] = b; pd[p] = d;
    }
    lutView = viewR;
  }
  function draw(viewR: number, o: { wet?: number; rim?: number }) {
    if (viewR !== lutView) buildLut(viewR);
    const wet = o.wet || 0, rimK = o.rim || 1;
    const t = Math.max(1, sim.t), fa = sim.frozenAt, s = sim.s, IN = sim.IN, dist = sim.dist;
    const lim = Math.min(R - 2, sim.radius + 3);
    const bz = sim.beta + 0.02, hzK = 0.1 + 0.25 * wet;
    for (let kk = 0; kk < IN.length; kk++) {
      const i = IN[kk];
      if (dist[i] > lim + 1) continue;
      if (fa[i] < 0) { F[i] = 0; HZ[i] = s[i] > bz ? Math.min(1, (s[i] - sim.beta) * 3) * hzK : 0; continue; }
      const h = (t - fa[i]) / t;
      let gx = 0, gy = 0, open = 0;
      for (let j = 0; j < 6; j++) {
        const m = i + nb[j].o, fm = fa[m]; const hn = fm < 0 ? -0.15 : (t - fm) / t;
        if (fm < 0) open++;
        gx += (hn - h) * nb[j].x; gy += (hn - h) * nb[j].y;
      }
      const sh = Math.max(-0.75, Math.min(0.9, -(gx * Lx + gy * Ly) * 5));
      let r = 220, g = 236, b = 255;
      if (sh > 0) { const m = Math.min(1, sh); r += (255 - r) * m; g += (255 - g) * m; }
      else { const m = Math.min(1, -sh); r += (127 - r) * m; g += (166 - g) * m; b += (214 - b) * m; }
      // growth rings: faint banding from frozenAt, the diary of the fall
      if (((fa[i] / 24) | 0) & 1) { r *= 0.955; g *= 0.955; }
      // rim fringe where the history gradient is steep, hue by its direction (cyan to pink)
      const rm = open > 0 ? Math.min(1, Math.hypot(gx, gy) * 2.2) * rimK : 0;
      if (rm > 0.15) {
        const hu = (Math.sin(Math.atan2(gy, gx)) + 1) / 2, q = Math.min(1, rm * 0.8);
        r += (127 + 128 * hu - r) * q; g += (233 - 54 * hu - g) * q; b += (255 - 38 * hu - b) * q;
      }
      F[i] = 1; CR[i] = r; CG[i] = g; CB[i] = b; CA[i] = 0.85 + Math.max(0, sh) * 0.15; HZ[i] = 0;
    }
    const D = img.data, aa = Math.max(1, pxCell);
    for (let p = 0, oo = 0; p < n; p++, oo += 4) {
      const i0 = base[p];
      if (i0 < 0 || pd[p] > lim) { D[oo + 3] = 0; continue; }
      const a = fa_[p], b = fb_[p];
      let j0: number, j1: number, j2: number, w0: number, w1: number, w2: number;
      if (up[p]) { j0 = i0 + W + 1; j1 = i0 + 1; j2 = i0 + W; w0 = a + b - 1; w1 = 1 - b; w2 = 1 - a; }
      else { j0 = i0; j1 = i0 + 1; j2 = i0 + W; w0 = 1 - a - b; w1 = a; w2 = b; }
      const f0 = w0 * F[j0], f1 = w1 * F[j1], f2 = w2 * F[j2], m = f0 + f1 + f2;
      const hz = w0 * HZ[j0] + w1 * HZ[j1] + w2 * HZ[j2];
      let ai = 0, r = 0, g = 0, bl = 0;
      if (m > 0) {
        ai = Math.max(0, Math.min(1, (m - 0.5) * aa + 0.5));
        const im = 1 / m;
        r = (f0 * CR[j0] + f1 * CR[j1] + f2 * CR[j2]) * im; g = (f0 * CG[j0] + f1 * CG[j1] + f2 * CG[j2]) * im; bl = (f0 * CB[j0] + f1 * CB[j1] + f2 * CB[j2]) * im;
        ai *= (f0 * CA[j0] + f1 * CA[j1] + f2 * CA[j2]) * im;
      }
      const ah = hz * (1 - ai), ao = ai + ah;
      if (ao <= 0.002) { D[oo + 3] = 0; continue; }
      const io = 1 / ao;
      D[oo] = (r * ai + 191 * ah) * io; D[oo + 1] = (g * ai + 244 * ah) * io; D[oo + 2] = (bl * ai + 255 * ah) * io; D[oo + 3] = ao * 255;
    }
    return img;
  }
  return { draw, size };
}
// ===== FLAKE CORE END =====

// ---------- page ----------

const SPEED_S = 0.18; // stage heights per second of fall on screen (world drawn at the C graft scale)
const XS = 0.65; // stage widths per world unit: two or three cloud columns on a phone
const CY = 0.38; // crystal centre, fraction of stage height
const STORE_LAST = 'flake:last', STORE_TOAST = 'flake:toasts';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const VERDICT: Record<Shape | 'none', string> = {
  fern: 'Fernlike. You went looking for weather and found all of it.',
  stellar: 'A proper star. The kind that ends up on jumpers.',
  sectored: 'A sectored plate. Ambitious early, sensible later.',
  // direction said 'hexagonal'; a pure dodger grows a six point stellar plate, so the line names what you see
  plate: 'A stellar plate. You dodged every cloud on the way down. Tidy.',
  none: 'You let the wind steer. It did fine.',
};
const T_WET = 'Wet. Watch the arms.', T_DRY = 'Dry. The tips go glassy.';
const FOOT = 'Nobody else will ever grow this one.';
const COPIED = 'Link copied. It opens this exact flake.';

type Phase = 'first' | 'idle' | 'running' | 'landing' | 'result' | 'loading' | 'error';
type Res = {
  seed: number; num: number; dateTxt: string; secs: number; coldest: number; pct: number;
  verdict: string; pathStr: string; shared: boolean;
};
type Therm = { layers: Layer[]; p: number; T: number; next: number | null };
type Last = { seed: number; num: number; p: string; thumb: string };

const dateText = (seed: number) => { const s = String(seed); return `${+s.slice(6)} ${MONTHS[+s.slice(4, 6) - 1]}`; };
const fmtT = (T: number) => `${T} C`;
function seedOf(d: Date) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
function validSeed(d: string, today: number) {
  if (!/^\d{8}$/.test(d)) return 0;
  const n = +d, y = Math.floor(n / 10000), m = Math.floor(n / 100) % 100, day = n % 100;
  const dt = new Date(y, m - 1, day);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== day) return 0;
  const tomorrow = new Date(Math.floor(today / 10000), (Math.floor(today / 100) % 100) - 1, (today % 100) + 1);
  if (n < 20260101 || n > seedOf(tomorrow)) return 0; // a link from a timezone ahead may be a day early
  return n;
}

// knit: rows of V stitches in the three wool tones, blurred so the ice is the only sharp thing
function knit(x: CanvasRenderingContext2D, w: number, h: number, sc: number) {
  x.fillStyle = '#5c1322'; x.fillRect(0, 0, w, h);
  const sx = 22 * sc, sy = 18 * sc;
  for (let row = 0, y = -sy; y < h + sy; row++, y += sy) {
    for (let px = row % 2 ? sx / 2 : 0; px < w + sx; px += sx) {
      for (const side of [-1, 1]) {
        x.save(); x.translate(px + side * sx * 0.22, y); x.rotate(side * 0.55);
        x.beginPath(); x.ellipse(0, 0, sx * 0.2, sy * 0.62, 0, 0, Math.PI * 2);
        x.fillStyle = '#7a1e30'; x.fill(); x.lineWidth = 1.4 * sc; x.strokeStyle = '#3a0b16'; x.stroke();
        x.restore();
      }
    }
  }
}
function woolCanvas(w: number, h: number, sc: number) {
  const a = document.createElement('canvas'); a.width = w; a.height = h; knit(a.getContext('2d')!, w, h, sc);
  const b = document.createElement('canvas'); b.width = w; b.height = h; const x = b.getContext('2d')!;
  x.filter = `blur(${1.1 * sc}px)`; x.drawImage(a, 0, 0); x.filter = 'none'; return b;
}
// the mitten: a palm under the flake, a thumb off to the right, a ribbed cuff where the card sits
function mittenPath(x: CanvasRenderingContext2D, W: number, H: number) {
  const cx = W / 2, hw = Math.min(W * 0.4, H * 0.3), top = H * CY - hw * 1.05, cuff = H * 0.63;
  x.beginPath();
  x.moveTo(cx - hw, cuff);
  x.lineTo(cx - hw, top + hw);
  x.arc(cx, top + hw, hw, Math.PI, 0);
  x.lineTo(cx + hw, H * CY + hw * 0.1);
  // thumb
  x.bezierCurveTo(cx + hw * 1.25, H * CY - hw * 0.05, cx + hw * 1.42, H * CY + hw * 0.25, cx + hw * 1.22, H * CY + hw * 0.55);
  x.bezierCurveTo(cx + hw * 1.12, H * CY + hw * 0.72, cx + hw * 1.02, H * CY + hw * 0.8, cx + hw, cuff);
  x.closePath();
  return { cx, hw, cuff };
}
function drawMitten(c: HTMLCanvasElement, W: number, H: number, dpr: number) {
  c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
  const x = c.getContext('2d'); if (!x) return;
  x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
  const wool = woolCanvas(Math.ceil(W * dpr), Math.ceil(H * dpr), 1.3 * dpr);
  x.save(); const m = mittenPath(x, W, H); x.clip();
  x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(wool, 0, 0); x.restore();
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  x.save(); mittenPath(x, W, H); x.lineWidth = 2; x.strokeStyle = 'rgba(58,11,22,0.9)'; x.stroke(); x.restore();
  // cuff: ribbing, full width so the card text sits on one calm surface
  const cw = Math.min(W - 16, m.hw * 2 + 40), cl = (W - cw) / 2, ct = m.cuff - 6;
  x.fillStyle = '#4a0f1c'; x.beginPath(); x.roundRect(cl, ct, cw, H - ct + 20, 14); x.fill();
  x.save(); x.beginPath(); x.roundRect(cl, ct, cw, H - ct + 20, 14); x.clip();
  for (let px = cl + 4; px < cl + cw; px += 9) { x.fillStyle = 'rgba(122,30,48,0.35)'; x.fillRect(px, ct, 4, H - ct + 20); }
  x.restore();
}

// fit a line of canvas text into width, shrinking from max to min px; wrap words when min is not enough
function fitLines(x: CanvasRenderingContext2D, text: string, family: string, max: number, min: number, width: number, maxLines: number) {
  for (let px = max; px >= min; px--) {
    x.font = `${px}px ${family}`;
    if (x.measureText(text).width <= width) return { px, lines: [text] };
  }
  for (let px = max; px >= min; px--) {
    x.font = `${px}px ${family}`;
    const words = text.split(' '), lines: string[] = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > width && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur);
    if (lines.length <= maxLines) return { px, lines };
  }
  x.font = `${min}px ${family}`; return { px: min, lines: [text] };
}

type G = {
  W: number; H: number; dpr: number; side: number; reduced: boolean; today: number; seed: number;
  sky: Sky; sim: Sim; run: Run | null; rend: Renderer; off: HTMLCanvasElement; offx: CanvasRenderingContext2D;
  phase: Phase; t: number; target: number; xs: number; xv: number; lastX: number | null; keys: Record<string, boolean>;
  last: number; viewR: number; wetNow: number; bloom: number; rot: number; tilt: number; landAt: number; rotFrom: number; rotTo: number;
  sparks: { an: number; d: number; life: number }[]; motes: { x: number; y: number; z: number; a: number }[];
  blobs: { dx: number; dy: number; r: number }[][]; toasts: { wet: boolean; dry: boolean }; toastWet: boolean; toastDry: boolean;
  res: Res | null; finalPng: HTMLCanvasElement | null; frameMs: number[]; raf: number; timers: ReturnType<typeof setTimeout>[];
  start: () => void; openResult: (seed: number, p: string, shared: boolean) => boolean; raf2?: number; finalVR: number;
};

export default function Client() {
  const rootRef = useRef<HTMLElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null), iceRef = useRef<HTMLCanvasElement>(null), mitRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<G | null>(null);
  const [phase, setPhase] = useState<Phase>('first');
  const [toast, setToast] = useState('');
  const [therm, setTherm] = useState<Therm | null>(null);
  const [skyLine, setSkyLine] = useState('');
  const [note, setNote] = useState('');
  const [last, setLast] = useState<Last | null>(null);
  const [res, setRes] = useState<Res | null>(null);
  const [instant, setInstant] = useState(false); // shared or reopened results skip the landing choreography
  const [copied, setCopied] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [reduced, setReduced] = useState(false);

  // everything not the stage goes inert while the stage covers the page
  useEffect(() => {
    const marked: HTMLElement[] = [];
    for (let el: HTMLElement | null = rootRef.current; el && el !== document.body; el = el.parentElement) {
      for (const sib of Array.from(el.parentElement?.children ?? [])) {
        if (sib !== el && sib instanceof HTMLElement && !sib.hasAttribute('inert') && sib.tagName !== 'SCRIPT') { sib.setAttribute('inert', ''); marked.push(sib); }
      }
    }
    return () => marked.forEach((el) => el.removeAttribute('inert'));
  }, []);

  useEffect(() => {
    const stage = stageRef.current!, skyC = skyRef.current!, iceC = iceRef.current!, mitC = mitRef.current!;
    const probe = document.createElement('canvas').getContext('2d');
    if (!probe || typeof ImageData === 'undefined' || !skyC.getContext('2d') || !iceC.getContext('2d')) { setPhase('error'); return; }
    const now = new Date(), today = seedOf(now);
    const reducedMq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(reducedMq.matches);
    const sim = makeSim(GRID_R, 0.4);
    const rend = makeRenderer(sim, 420)!;
    const off = document.createElement('canvas'); off.width = off.height = 420;
    let toasts = { wet: false, dry: false };
    try { toasts = { ...toasts, ...JSON.parse(localStorage.getItem(STORE_TOAST) || '{}') }; } catch {}
    const g: G = {
      W: 0, H: 0, dpr: 1, side: 0, reduced: reducedMq.matches, today, seed: today, sky: makeSky(today), sim, run: null, rend, off, offx: off.getContext('2d')!,
      phase: 'idle', t: 0, target: 0, xs: 0, xv: 0, lastX: null, keys: {}, last: performance.now(), viewR: 36, wetNow: 0, bloom: 0,
      rot: 0, tilt: 0, landAt: 0, rotFrom: 0, rotTo: 0, sparks: [], motes: [], blobs: [], toasts, toastWet: false, toastDry: false,
      res: null, finalPng: null, frameMs: [], raf: 0, timers: [], start: () => {}, openResult: () => false, finalVR: 36,
    };
    gRef.current = g;
    if ((window as unknown as { __flakeQA?: boolean }).__flakeQA === true) (window as unknown as { __flake: G }).__flake = g; // test driver only, set before load

    const useSky = (seed: number) => {
      g.seed = seed; g.sky = makeSky(seed);
      const rb = mulberry32(seed ^ 0x5bd1e995);
      g.blobs = g.sky.clouds.map(() => Array.from({ length: 6 }, () => ({ dx: (rb() * 2 - 1) * 0.5, dy: (rb() * 2 - 1) * 0.36, r: rb() })));
      g.motes = Array.from({ length: 56 }, () => ({ x: rb(), y: rb(), z: [0.2, 0.5, 0.9][Math.floor(rb() * 3)], a: 0.2 + rb() * 0.3 }));
    };
    const idleTherm = () => setTherm({ layers: g.sky.layers, p: 0, T: g.sky.layers[0].T, next: null });
    const later = (fn: () => void, ms: number) => { g.timers.push(setTimeout(fn, ms)); };

    // ---- sizing ----
    const size = () => {
      const r = stage.getBoundingClientRect(); g.W = r.width; g.H = r.height; g.dpr = Math.min(2, devicePixelRatio || 1);
      skyC.width = Math.round(g.W * g.dpr); skyC.height = Math.round(g.H * g.dpr);
      g.side = Math.floor(Math.min(g.W - 24, g.H * 0.58));
      iceC.width = iceC.height = Math.round(g.side * g.dpr);
      Object.assign(iceC.style, { width: g.side + 'px', height: g.side + 'px', left: (g.W - g.side) / 2 + 'px', top: g.H * CY - g.side / 2 + 'px' });
      drawMitten(mitC, g.W, g.H, g.dpr);
      if (g.phase === 'result') { paintFinal(); setIce(`translateY(4px) scale(${resultScale()})`, 'none'); }
    };
    // the ice canvas transform is driven here, not by React, so the landing can hand over without a jump
    function setIce(transform: string, transition: string) { iceC.style.transition = transition; iceC.style.transform = transform; }
    // on the mitten the flake fills about 78 percent of a phone's width, never wider than the palm
    function resultScale() { const hw = Math.min(g.W * 0.4, g.H * 0.3); return Math.min(0.78 * g.W, 1.9 * hw) / (0.96 * g.side); }
    const tightVR = () => Math.ceil(sim.radius * 1.04 + 2);

    // ---- the fall ----
    const showToast = (s: string) => { setToast(s); later(() => setToast((c) => (c === s ? '' : c)), 1600); };
    const saveToasts = () => { try { localStorage.setItem(STORE_TOAST, JSON.stringify(g.toasts)); } catch {} };
    const start = () => {
      if (g.seed !== g.today) useSky(g.today);
      if (location.search) history.replaceState(null, '', location.pathname);
      g.run = makeRun(g.sky, sim);
      Object.assign(g, { phase: 'running', t: 0, target: 0, xs: 0, xv: 0, viewR: 36, sparks: [], wetNow: 0, bloom: 0, tilt: 0, toastWet: g.toasts.wet, toastDry: g.toasts.dry, res: null, finalPng: null });
      g.last = performance.now();
      setIce('none', 'none');
      setRes(null); setToast(''); setNote(''); setCopied(false); setLinkText(''); setInstant(false); setPhase('running');
      setTherm({ layers: g.sky.layers, p: 0, T: g.sky.layers[0].T, next: g.sky.layers[1].T });
      if (rootRef.current) rootRef.current.scrollTop = 0;
    };
    g.start = start;

    const tickOnce = () => {
      const run = g.run!;
      const wet = run.step(targetToQ(g.target));
      g.wetNow = wet;
      if (wet > 0.3 && !g.toastWet && sim.radius >= 8) { g.toastWet = true; g.toasts.wet = true; saveToasts(); showToast(T_WET); }
      if (g.toastWet && wet < 0.1 && !g.toastDry && run.wetTicks > 5) { g.toastDry = true; g.toasts.dry = true; saveToasts(); showToast(T_DRY); }
    };

    const resultFor = (run: Run, seed: number, shared: boolean): Res => {
      const pathStr = encodePath(run.path), st = shapeStats(run.sim);
      const pct = Math.round((run.wetTicks / Math.max(1, run.tick)) * 100);
      const shape = untouched(run.path) ? 'none' : classify(st, pct);
      return { seed, num: flakeNumber(seed, pathStr), dateTxt: dateText(seed), secs: Math.round(run.tick / 10), coldest: run.coldest, pct, verdict: VERDICT[shape], pathStr, shared };
    };

    // the final crystal at the canvas's own resolution, at the zoom the fall ended on
    function paintFinal() {
      const x = iceC.getContext('2d')!; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, iceC.width, iceC.height);
      const big = makeRenderer(sim, iceC.width)!; const tmp = document.createElement('canvas'); tmp.width = tmp.height = iceC.width;
      tmp.getContext('2d')!.putImageData(big.draw(g.finalVR, { rim: 1.2 }), 0, 0);
      x.save(); x.shadowColor = 'rgba(0,0,0,0.3)'; x.shadowOffsetY = 6 * g.dpr; x.shadowBlur = 10 * g.dpr; x.drawImage(tmp, 0, 0); x.restore();
    }
    const storeLast = (r: Res) => {
      try {
        const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
        x.fillStyle = '#5c1322'; x.fillRect(0, 0, 128, 128); x.drawImage(iceC, 0, 0, 128, 128);
        const l: Last = { seed: r.seed, num: r.num, p: r.pathStr, thumb: c.toDataURL('image/png') };
        localStorage.setItem(STORE_LAST, JSON.stringify(l));
      } catch {}
    };

    const finish = () => {
      const run = g.run!;
      g.phase = 'landing'; g.landAt = performance.now(); setPhase('landing'); setToast('');
      setIce('scale(0.82)', g.reduced ? 'none' : 'transform 900ms cubic-bezier(0.2,0.8,0.2,1)');
      g.rotFrom = g.rot; g.rotTo = Math.round(g.rot / (Math.PI / 3)) * (Math.PI / 3); // six fold: any multiple of 60 degrees is the same flake
      const r = resultFor(run, g.seed, false); g.res = r;
      later(() => {
        g.phase = 'result'; g.rot = g.rotTo; g.tilt = 0;
        // repaint at a tight zoom, scaled so nothing moves, then settle 4 px down onto the palm
        g.finalVR = tightVR(); paintFinal();
        setIce(`scale(${(0.82 * g.finalVR) / g.viewR})`, 'none'); void iceC.getBoundingClientRect();
        setIce(`translateY(4px) scale(${resultScale()})`, g.reduced ? 'none' : 'transform 200ms ease-out');
        setRes(r); setPhase('result'); storeLast(r);
      }, 900);
    };

    // re-grow a flake from a date and a route (shared link, or your own last flake)
    g.openResult = (seed: number, p: string, shared: boolean) => {
      const path = decodePath(p);
      if (!path || !path.length) return false;
      useSky(seed);
      const run = makeRun(g.sky, sim); let i = 0;
      g.run = run; g.phase = 'loading'; setPhase('loading');
      const chunk = () => {
        const t0 = performance.now();
        while (i < path.length && !run.done && performance.now() - t0 < 24) run.step(path[i++]);
        if (i < path.length && !run.done) { g.raf2 = requestAnimationFrame(chunk); return; }
        if (i !== path.length || !run.done) { badLink(); return; } // a route that does not end where the fall ends was edited
        g.viewR = Math.max(36, Math.ceil((sim.radius * 1.15 + 5) / 4) * 4); g.finalVR = tightVR();
        g.rot = 0; g.tilt = 0; setIce(`translateY(4px) scale(${resultScale()})`, 'none');
        const r = resultFor(run, seed, shared); g.res = r;
        g.phase = 'result'; setInstant(true); paintFinal(); setRes(r); setPhase('result');
        setTherm(null);
      };
      g.raf2 = requestAnimationFrame(chunk);
      return true;
    };
    const badLink = () => {
      history.replaceState(null, '', location.pathname);
      useSky(today); g.phase = 'idle'; setPhase('idle'); idleTherm();
      setNote('That link melted. Here is today\'s sky instead.');
    };

    // ---- input ----
    const down = (e: PointerEvent) => {
      if (g.phase !== 'idle' && g.phase !== 'running') return;
      if ((e.target as Element).closest?.('button, a')) return;
      try { stage.setPointerCapture(e.pointerId); } catch {}
      g.lastX = e.clientX;
      if (g.phase === 'idle') start();
    };
    const move = (e: PointerEvent) => {
      if (g.phase !== 'running' || g.lastX === null) return;
      const dx = e.clientX - g.lastX; g.lastX = e.clientX;
      if (dx) g.target = Math.max(-TMAX, Math.min(TMAX, g.target + dx / (g.W * XS))); // the world follows the finger 1:1
    };
    const up = () => { g.lastX = null; };
    stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    const KEYS = ['arrowleft', 'arrowright', 'a', 'd'];
    const kd = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (!KEYS.includes(k) || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as Element)?.closest?.('input, textarea')) return;
      if (g.phase === 'idle') start();
      if (g.phase !== 'running') return;
      g.keys[k] = true; e.preventDefault();
    };
    const ku = (e: KeyboardEvent) => { g.keys[e.key.toLowerCase()] = false; };
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    const vis = () => { g.last = performance.now(); g.keys = {}; };
    document.addEventListener('visibilitychange', vis);
    const onMq = () => { g.reduced = reducedMq.matches; setReduced(g.reduced); };
    reducedMq.addEventListener('change', onMq);

    // ---- frame ----
    const frame = (nowT: number) => {
      g.raf = requestAnimationFrame(frame);
      const f0 = performance.now();
      const dt = Math.max(0, Math.min(100, nowT - g.last)); g.last = nowT;
      if (g.phase === 'result' || g.phase === 'loading' || g.phase === 'error') return;
      const run = g.run;
      if (g.phase === 'running' && run && !document.hidden) {
        const kv = (g.keys.arrowleft || g.keys.a ? 1 : 0) - (g.keys.arrowright || g.keys.d ? 1 : 0);
        if (kv) g.target = Math.max(-TMAX, Math.min(TMAX, g.target + (kv * 1.2 * dt) / 1000));
        g.t = Math.min(g.t + dt, FALL * 1000 + 5000);
        // fall time drives the sim: run the ticks that are due, at most 6 ms of them a frame, carry the rest
        const due = Math.min(TICKS, Math.floor(g.t / 100));
        while (run.tick < due && !run.done) { tickOnce(); if (performance.now() - f0 > 6) break; }
        if (run.done) finish();
      }
      // critically damped spring toward the target, about 120 ms to settle
      const w0 = (2 * Math.PI) / 0.24, ax = w0 * w0 * (g.target - g.xs) - 2 * w0 * g.xv;
      g.xv += (ax * dt) / 1000; g.xs += (g.xv * dt) / 1000;
      const tt = g.t / 1000, sky = g.sky, W = g.W, H = g.H, cy = H * CY;
      const live = g.phase === 'running';
      const wetV = live ? g.wetNow : 0;
      g.bloom += (wetV - g.bloom) * Math.min(1, dt / 220);
      if (live && !g.reduced) { g.rot = (tt * 4 * Math.PI) / 180; g.tilt += (Math.max(-0.1, Math.min(0.1, -g.xv * 0.08)) - g.tilt) * Math.min(1, dt / 120); }
      if (g.phase === 'landing') {
        const k = Math.min(1, (performance.now() - g.landAt) / 900), e = 1 - Math.pow(1 - k, 3);
        g.rot = g.rotFrom + (g.rotTo - g.rotFrom) * e; g.tilt *= 1 - e;
      }

      // sky
      const x = skyC.getContext('2d')!; x.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
      const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#04070f'); bg.addColorStop(1, '#0a1330');
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      const pxs = SPEED_S * H, pxx = XS * W;
      const cxw = Math.max(-XMAX, Math.min(XMAX, -g.xs + sky.wind(tt)));
      if (g.phase !== 'idle') for (const l of sky.layers) {
        const y0 = cy + (l.t0 - tt) * pxs, y1 = cy + (l.t1 - tt) * pxs;
        if (y1 < 0 || y0 > H) continue;
        x.globalAlpha = 0.25; x.fillStyle = l.T >= -8 ? '#2a1638' : l.T <= -12 ? '#0b2a4a' : '#1a2040';
        x.fillRect(0, y0, W, y1 - y0); x.globalAlpha = 1;
      }
      if (!g.reduced) for (const m of g.motes) {
        const my = (((m.y - (tt * pxs * m.z) / H) % 1) + 1) % 1, mx = (((m.x - (cxw * pxx * m.z) / W) % 1) + 1) % 1;
        x.fillStyle = `rgba(159,180,217,${m.a})`; x.fillRect(mx * W, my * H, 1.5 + m.z, 1.5 + m.z);
      }
      if (g.phase !== 'idle') {
        // far layer: the same weather at 0.6 parallax, faint, for depth only (it is not wet)
        if (!g.reduced) sky.clouds.forEach((c) => {
          const sy = cy + (c.t - tt) * pxs * 0.6 - H * 0.2, sx = W / 2 + (-c.x * 0.8 - cxw * 0.6) * pxx;
          const ww = c.w * pxx * 0.7, hh = c.h * pxs * 0.5;
          if (sy + hh < 0 || sy - hh > H || sx + ww < 0 || sx - ww > W) return;
          x.save(); x.translate(sx, sy); x.scale(ww / 2, hh / 2);
          const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1); gr.addColorStop(0, 'rgba(27,42,82,0.22)'); gr.addColorStop(1, 'rgba(27,42,82,0)');
          x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 1, 0, Math.PI * 2); x.fill(); x.restore();
        });
        sky.clouds.forEach((c, k) => {
          const sy = cy + (c.t - tt) * pxs, hh = (c.h * pxs) / 2, ww = (c.w * pxx) / 2;
          const sx = W / 2 + (c.x - cxw) * pxx;
          if (sy + hh < -40 || sy - hh > H + 40 || sx + ww < -40 || sx - ww > W + 40) return;
          // body: an ellipse whose edge is where the air stops counting as cloud (wetness 0.3)
          x.save(); x.translate(sx, sy); x.scale(ww, hh);
          const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1);
          gr.addColorStop(0, 'rgba(48,71,127,0.7)'); gr.addColorStop(0.6, 'rgba(39,58,108,0.62)');
          gr.addColorStop(0.86, 'rgba(27,42,82,0.5)'); gr.addColorStop(1, 'rgba(27,42,82,0)');
          x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 1, 0, Math.PI * 2); x.fill(); x.restore();
          for (const b of g.blobs[k]) { // lumps so it reads as weather, not a lozenge
            const bx = sx + b.dx * ww * 1.2, by = sy + b.dy * hh * 1.3, br = Math.min(ww, hh) * (0.45 + b.r * 0.35);
            const g2 = x.createRadialGradient(bx, by, 0, bx, by, br);
            g2.addColorStop(0, 'rgba(48,71,127,0.32)'); g2.addColorStop(1, 'rgba(27,42,82,0)');
            x.fillStyle = g2; x.fillRect(bx - br, by - br, br * 2, br * 2);
          }
        });
      }
      // in a cloud: a bloom around the crystal (from prototype B), driven by the air, not a hold
      if (g.bloom > 0.02) {
        const br = g.side * 0.8;
        const gr = x.createRadialGradient(W / 2, cy, 0, W / 2, cy, br);
        gr.addColorStop(0, `rgba(84,118,196,${0.35 * g.bloom})`); gr.addColorStop(0.55, `rgba(48,71,127,${0.4 * g.bloom})`); gr.addColorStop(1, 'rgba(27,42,82,0)');
        x.fillStyle = gr; x.fillRect(0, 0, W, H);
      }
      // vapour sparks feeding the tips
      const crPx = (sim.radius / Math.max(1, g.viewR)) * g.side * 0.5;
      if (live && wetV > 0.3 && g.sparks.length < 60 && Math.random() < 0.6) {
        const arm = Math.floor(Math.random() * 6), an = g.rot + (arm * Math.PI) / 3 - Math.PI / 2 + (Math.random() - 0.5) * 0.25;
        g.sparks.push({ an, d: crPx + 40 + Math.random() * 40, life: 1 });
      }
      g.sparks = g.sparks.filter((s) => (s.d -= dt * 0.06) > crPx * 0.9 && (s.life -= dt / 1500) > 0);
      x.fillStyle = '#bff4ff';
      for (const s of g.sparks) { x.globalAlpha = Math.min(1, s.life * 1.5) * 0.8; x.fillRect(W / 2 + Math.cos(s.an) * s.d - 1, cy + Math.sin(s.an) * s.d - 1, 2, 2); }
      x.globalAlpha = 1;
      if (g.phase === 'idle') { // the speck, pulsing every 2.4 s
        const pulse = g.reduced ? 1 : 1 + 0.15 * (0.5 - 0.5 * Math.cos((nowT / 2400) * Math.PI * 2)), rr = 6 * pulse;
        const gr = x.createRadialGradient(W / 2, cy, 0, W / 2, cy, rr * 4);
        gr.addColorStop(0, 'rgba(191,244,255,0.5)'); gr.addColorStop(1, 'rgba(191,244,255,0)');
        x.fillStyle = gr; x.fillRect(W / 2 - rr * 4, cy - rr * 4, rr * 8, rr * 8);
        x.fillStyle = '#ffffff'; x.beginPath();
        for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 - Math.PI / 2; x.lineTo(W / 2 + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
        x.closePath(); x.fill();
      }

      // live crystal
      if (live || g.phase === 'landing') {
        const want = Math.max(36, Math.ceil((sim.radius * 1.15 + 5) / 4) * 4);
        if (want > g.viewR) g.viewR = want;
        g.offx.putImageData(rend.draw(g.viewR, { wet: wetV }), 0, 0);
        const ix = iceC.getContext('2d')!; ix.setTransform(1, 0, 0, 1, 0, 0); ix.clearRect(0, 0, iceC.width, iceC.height);
        ix.translate(iceC.width / 2, iceC.height / 2); ix.rotate(g.rot + g.tilt); ix.imageSmoothingEnabled = true;
        ix.drawImage(off, -iceC.width / 2, -iceC.height / 2, iceC.width, iceC.height);
      }
      if (live && run && run.tick % 3 === 0) {
        const p = Math.min(1, tt / FALL), li = sky.layers.findIndex((l) => tt < l.t1);
        setTherm({ layers: sky.layers, p, T: sky.tempAt(tt), next: li >= 0 && li < 3 ? sky.layers[li + 1].T : null });
      }
      if (live) { g.frameMs.push(performance.now() - f0); if (g.frameMs.length > 3000) g.frameMs.shift(); }
    };

    // ---- arrival ----
    useSky(today);
    size();
    addEventListener('resize', size);
    const qs = new URLSearchParams(location.search);
    let lastSaved: Last | null = null;
    try { lastSaved = JSON.parse(localStorage.getItem(STORE_LAST) || 'null'); } catch {}
    if (qs.has('d') || qs.has('p')) {
      const seed = validSeed(qs.get('d') || '', today);
      if (!seed || !g.openResult(seed, qs.get('p') || '', true)) badLink();
    } else {
      g.phase = 'idle'; setPhase('idle'); idleTherm();
      if (lastSaved && lastSaved.seed === today) setLast(lastSaved);
      else if (lastSaved) setNote('New sky today. Yesterday\'s flake melted.');
    }
    setSkyLine(`Today's sky: ${makeSky(today).layers.map((l) => fmtT(l.T)).join(', ')}.`);
    g.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(g.raf); cancelAnimationFrame(g.raf2 || 0); g.timers.forEach(clearTimeout);
      removeEventListener('resize', size); removeEventListener('keydown', kd); removeEventListener('keyup', ku);
      document.removeEventListener('visibilitychange', vis); reducedMq.removeEventListener('change', onMq);
      stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
    };
  }, []);

  const linkFor = (r: Res) => `${location.origin}${location.pathname}?d=${r.seed}&p=${r.pathStr}`;

  const save = async () => {
    const g = gRef.current; const r = g?.res; if (!g || !r) return;
    const mono = getComputedStyle(rootRef.current!).fontFamily;
    try { await Promise.all([document.fonts.load('64px m6x11plus'), document.fonts.load(`30px ${mono}`)]); } catch {}
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1350; const x = c.getContext('2d')!;
    x.drawImage(woolCanvas(1080, 1080, 2.6), 0, 0);
    // the flake at full resolution from the final sim state, pointy top, 78 percent of the width
    const fs = Math.round(1080 * 0.78), big = makeRenderer(g.sim, fs)!, vr = Math.ceil(g.sim.radius * 1.04 + 2);
    const fc = document.createElement('canvas'); fc.width = fc.height = fs; fc.getContext('2d')!.putImageData(big.draw(vr, { rim: 1.5 }), 0, 0);
    x.save(); x.shadowColor = 'rgba(0,0,0,0.3)'; x.shadowOffsetY = 6; x.shadowBlur = 14;
    x.drawImage(fc, (1080 - fs) / 2, (1080 - fs) / 2 - 24); x.restore();
    // flight record: sideways position over the fall, ice blue in cloud, wool pink in clear air
    const run = g.run!, xs = run.xs, n = xs.length, y0 = 1062, span = 46;
    x.lineWidth = 2; x.lineCap = 'round';
    for (let i = 1; i < n; i++) {
      x.strokeStyle = run.wet[i] ? '#bff4ff' : '#c9a3ab'; x.beginPath();
      x.moveTo(((i - 1) / (n - 1)) * 1080, y0 - ((xs[i - 1] + XMAX) / (2 * XMAX)) * span);
      x.lineTo((i / (n - 1)) * 1080, y0 - ((xs[i] + XMAX) / (2 * XMAX)) * span); x.stroke();
    }
    x.fillStyle = '#c9a3ab';
    for (const l of g.sky.layers.slice(1)) { const tx = ((l.t0 * 10) / Math.max(1, n - 1)) * 1080; if (tx < 1080) x.fillRect(tx - 1, 1068, 2, 8); }
    // band
    x.fillStyle = '#3a0b16'; x.fillRect(0, 1080, 1080, 270);
    x.textBaseline = 'alphabetic';
    x.fillStyle = '#f4f8ff'; x.font = '64px m6x11plus, monospace'; x.fillText(`FLAKE ${r.num}`, 56, 1150);
    x.fillStyle = '#c9a3ab'; x.font = `30px ${mono}`; x.textAlign = 'right'; x.fillText(r.dateTxt, 1024, 1150); x.textAlign = 'left';
    const L2 = `Fell ${r.secs} seconds. Coldest at ${fmtT(r.coldest)}. ${r.pct}% of the way in cloud.`;
    x.fillStyle = '#f4f8ff';
    const a = fitLines(x, L2, mono, 30, 22, 968, 1); x.font = `${a.px}px ${mono}`; x.fillText(a.lines[0], 56, 1206);
    const b = fitLines(x, r.verdict, mono, 30, 24, 968, 2); x.font = `${b.px}px ${mono}`;
    b.lines.forEach((ln, i) => x.fillText(ln, 56, 1252 + i * (b.px + 8)));
    x.fillStyle = '#c9a3ab'; x.font = `24px ${mono}`; x.fillText(FOOT, 56, 1322);
    x.textAlign = 'right'; x.fillText('wiz.jock.pl/experiments/flake', 1024, 1322); x.textAlign = 'left';
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob), el = document.createElement('a');
      el.href = url; el.download = `flake-${r.num}.png`; document.body.appendChild(el); el.click(); el.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  };
  const copy = async () => {
    const r = gRef.current?.res; if (!r) return;
    const link = linkFor(r);
    let ok = false;
    try { await navigator.clipboard.writeText(link); ok = true; } catch {}
    if (!ok) {
      try { const ta = document.createElement('textarea'); ta.value = link; document.body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove(); } catch {}
    }
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2400); } else setLinkText(link);
  };
  const again = () => gRef.current?.start();
  const growYours = () => { const g = gRef.current; if (!g) return; g.start(); };
  const openLast = () => { const g = gRef.current; if (!g || !last) return; setLast(null); g.openResult(last.seed, last.p, false); };

  const running = phase === 'running';
  const landed = phase === 'landing' || phase === 'result';
  const card = phase === 'result' && res;
  const nextT0 = therm ? therm.layers.find((l) => l.t0 > therm.p * FALL + 1e-6) : undefined;
  const nextAt = nextT0 ? nextT0.t0 / FALL : null;
  const lines = res ? [`Fell ${res.secs} seconds. Coldest at ${fmtT(res.coldest)}. ${res.pct}% of the way in cloud.`, res.verdict] : [];
  return (
    <main
      ref={rootRef}
      data-phase={phase}
      className={`fixed inset-0 z-50 overscroll-none bg-[#04070f] font-mono text-[#f4f8ff] ${phase === 'result' ? 'overflow-y-auto' : 'overflow-hidden touch-none select-none'}`}
    >
      <style>{`@keyframes flakeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes flakeIn{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion: reduce){@keyframes flakeUp{from{opacity:0}to{opacity:1}}}`}</style>
      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-[720px] overflow-hidden"
        style={{ height: '100svh', background: 'linear-gradient(#04070f,#0a1330)' }}
      >
        <canvas ref={skyRef} className="absolute inset-0 h-full w-full" aria-hidden />
        {/* navy to wool */}
        <div className="pointer-events-none absolute inset-0 bg-[#3a0b16]" style={{ opacity: landed ? 1 : 0, transition: instant ? 'none' : 'opacity 600ms ease' }} />
        <canvas
          ref={mitRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ transform: landed || reduced ? 'none' : 'translateY(105%)', opacity: landed ? 1 : 0, transition: instant ? 'none' : reduced ? 'opacity 600ms' : 'transform 900ms cubic-bezier(0.2,0.8,0.2,1), opacity 200ms' }}
        />
        <canvas
          ref={iceRef}
          role="img"
          aria-label={res ? `Flake ${res.num}, a snow crystal on a red wool mitten` : 'The growing snow crystal'}
          className="pointer-events-none absolute"
          style={{ opacity: running || landed ? 1 : 0 }}
        />
        {/* the speck in the static HTML, before the canvas takes over */}
        {phase === 'first' && (
          <svg className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: `${CY * 100}%` }} width="14" height="14" viewBox="-7 -7 14 14" aria-hidden>
            <polygon points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3" fill="#ffffff" />
          </svg>
        )}

        {/* title */}
        <div
          className={`pointer-events-none absolute left-4 right-14 transition-opacity duration-500 ${running || landed || phase === 'loading' ? 'opacity-0' : 'opacity-100'}`}
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
        >
          <a href="/experiments/" className="pointer-events-auto inline-flex min-h-6 items-center text-[13px] leading-none text-[#5476c4]">WIZ LAB</a>
          <h1 className="mt-2 font-pixel text-[40px] leading-none tracking-[0.02em] md:text-[56px]">Flake</h1>
          <p className="mt-2 max-w-[34ch] text-[13px] leading-snug text-[#9fb4d9]">One speck of ice. Forty seconds of sky. Steer it, and the weather writes the shape.</p>
          <p className="mt-2 min-h-[18px] text-[13px] text-[#9fb4d9]">{skyLine}</p>
        </div>

        {/* thermometer */}
        {!landed && phase !== 'loading' && phase !== 'error' && (
          <div className="pointer-events-none absolute right-3 flex gap-2" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', height: '40%' }} aria-hidden={!running}>
            <div className="relative w-[52px] text-right text-[13px] tabular-nums">
              {running && therm && (
                <>
                  <span className="absolute right-0 text-[#f4f8ff]" style={{ top: `calc(${therm.p * 100}% - 9px)` }}>{fmtT(therm.T)}</span>
                  {nextAt !== null && therm.next !== null && nextAt - therm.p > 0.08 && (
                    <span className="absolute right-0 text-[#9fb4d9]/70" style={{ top: `calc(${nextAt * 100}% - 9px)` }}>{fmtT(therm.next)}</span>
                  )}
                </>
              )}
            </div>
            <div className="relative h-full w-[6px] overflow-hidden rounded-full border border-[#1b2a52] bg-[#0a1330]">
              {therm && therm.layers.map((l, i) => (
                <div key={i} className="absolute inset-x-0" style={{ top: `${(l.t0 / FALL) * 100}%`, height: `${((l.t1 - l.t0) / FALL) * 100}%`, background: l.T >= -8 ? '#8a5aa8' : l.T <= -12 ? '#3f86c9' : '#5a6fa8', opacity: 0.4 + Math.min(0.6, -l.T / 30) }} />
              ))}
              {running && therm && <div className="absolute inset-x-0 h-[3px] bg-[#7fe9ff]" style={{ top: `calc(${therm.p * 100}% - 1px)` }} />}
            </div>
          </div>
        )}
        {/* altitude: a 2 px line on the left edge, from the ground up, that runs out with the fall */}
        {running && therm && (
          <div className="pointer-events-none absolute left-[6px] w-[2px] rounded-full bg-[#9fb4d9]/50" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)', height: `${(1 - therm.p) * 70}%` }} aria-hidden />
        )}

        {/* toast */}
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 text-center text-[15px] text-[#bff4ff]" style={{ top: '13%' }}>
          {running && toast ? <span style={{ animation: 'flakeIn 200ms ease-out both' }}>{toast}</span> : null}
        </div>
        {phase === 'landing' && <LandedLine />}

        {/* idle */}
        {(phase === 'idle' || phase === 'first') && (
          <div className="absolute inset-x-4" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5svh)' }}>
            {note && <p className="mb-3 text-center text-[13px] text-[#bff4ff]">{note}</p>}
            {last && (
              <button onClick={openLast} className="mx-auto mb-3 flex min-h-12 items-center gap-3 text-left text-[13px] text-[#9fb4d9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={last.thumb} alt={`Your last flake, Flake ${last.num}`} width={64} height={64} className="h-16 w-16 rounded-md" />
                <span>Same sky as earlier. Last time: Flake {last.num}.</span>
              </button>
            )}
            <button onClick={() => gRef.current?.start()} className="h-14 w-full rounded-md bg-[#7fe9ff] text-[16px] font-bold text-[#04070f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fe9ff]">Let go</button>
            <p className="mt-3 text-center text-[13px] text-[#9fb4d9]">Drag sideways. Clouds grow arms. Clear air grows plates.</p>
          </div>
        )}

        {phase === 'error' && (
          <p className="absolute inset-x-6 text-center text-[15px] text-[#bff4ff]" style={{ top: '55%' }}>Your browser will not draw ice. Try another one.</p>
        )}

        {/* result */}
        {card && (
          <>
            {res.shared && (
              <p className="absolute left-4 right-4 text-[15px] text-[#f4d7dc]" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', animation: instant ? undefined : 'flakeUp 400ms ease-out both' }}>
                Someone grew this one on {res.dateTxt}.
              </p>
            )}
            <div className="absolute inset-x-0 bottom-0 px-5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)' }}>
              <p className="font-pixel text-[32px] leading-none" style={{ animation: 'flakeUp 400ms ease-out both' }}>Flake {res.num}. {res.dateTxt}.</p>
              {lines.map((ln, i) => (
                <p key={i} className={`mt-2 text-[15px] leading-snug ${i === 1 ? 'text-[#f4d7dc]' : ''}`} style={{ animation: `flakeUp 400ms ease-out ${(i + 1) * 120}ms both` }}>{ln}</p>
              ))}
              <p className="mt-2 text-[13px] text-[#c9a3ab]" aria-live="polite" style={{ animation: 'flakeUp 400ms ease-out 360ms both' }}>{copied ? COPIED : FOOT}</p>
              {linkText && <input readOnly value={linkText} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full rounded border border-[#c9a3ab]/50 bg-[#3a0b16] px-2 py-1 text-[13px] text-[#f4f8ff]" aria-label="Link to this flake" />}
              <div className="mt-3 flex flex-wrap gap-2" style={{ animation: 'flakeUp 400ms ease-out 480ms both' }}>
                <button onClick={save} className="h-12 min-w-[100px] flex-1 rounded-md bg-[#f4f8ff] text-[14px] font-bold text-[#3a0b16]">Save PNG</button>
                {res.shared ? (
                  <button onClick={growYours} className="h-12 min-w-[100px] flex-1 rounded-md border border-[#c9a3ab] text-[14px]">Grow yours</button>
                ) : (
                  <>
                    <button onClick={copy} className="h-12 min-w-[100px] flex-1 rounded-md border border-[#c9a3ab] text-[14px]">Copy link</button>
                    <button onClick={again} className="h-12 min-w-[100px] flex-1 rounded-md border border-[#c9a3ab] text-[14px]">Fall again</button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {card && (
        <section className="mx-auto max-w-[720px] bg-[#3a0b16] px-5 pb-10 pt-6 text-[13px] leading-relaxed text-[#c9a3ab]">
          <p>All six arms match because they fell through the same weather at the same moment. Ukichiro Nakaya mapped which weather grows which shape in the 1930s; Kenneth Libbrecht&apos;s diagram is the modern version.</p>
          <p className="mt-3">This flake runs Reiter&apos;s hexagonal model (2005). Real snow also grows columns and needles. This one stays flat.</p>
          <p className="mt-6"><a href="/experiments/" className="inline-flex min-h-11 items-center text-[#f4d7dc] underline-offset-2 hover:underline">One new experiment a week. Explore the current lab.</a></p>
        </section>
      )}
    </main>
  );
}

function LandedLine() {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setTimeout(() => setOn(false), 700); return () => clearTimeout(t); }, []);
  return on ? <p className="pointer-events-none absolute inset-x-0 text-center text-[15px]" style={{ bottom: '24%' }}>Landed.</p> : null;
}
