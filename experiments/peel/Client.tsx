'use client';

import { useEffect, useRef, useState } from 'react';
import { GEO_DATA, GEO_NAMES } from './geo';

// Peel. The world is printed on an orange. Sideways drags turn it under a knife, vertical drags
// change the strip width, and the strip that comes off is developed flat by its geodesic
// curvature into an S shaped map. Everything runs in the browser. The share link carries the
// start longitude, the quantised width record and the tear sample indices, and the card is rebuilt
// from those on any device.

// ===== PEEL CORE BEGIN =====
// Geometry, data, captions and the link codec. No React. Drawing helpers take a 2D context.

const DEG = Math.PI / 180;
const CAP = 84; // the knife starts at 84 N and stops at 84 S; the caps come off as coins
const SPT = 720; // cut samples per turn: one every 0.5 degrees of phi
const DPHI = (2 * Math.PI) / SPT;
const W_MIN = 14, W_MAX = 42, W_DEF = 28;
const W_STEP = 0.5; // the width record is quantised to half degrees: 57 levels, fits 6 bits
const BLOCK = 12; // one width level per 6 degrees of phi
const W_RATE = 0.1; // the effective width moves at most 0.1 degrees per cut sample
const ORANGE_CM = 4;
const GAP = 0.09; // gap between torn pieces on the flat map, sphere radii
const FOLD = 0.7; // inward offsets are clamped to FOLD / curvature so the inner edge never folds
const KNIFE_OFF = 55; // the knife sits this many degrees of longitude off centre, on the limb
const CAP_R = Math.sin((90 - CAP) * DEG); // cap coin radius, sphere radii
const MAX_SAMPLES = 256 * 64; // capacity of the cut texture

const COL = {
  page: '#0d0a08', board: '#15100c', grain: '#1d1611', skin: '#f28c28', pore: '#d9731a', hi: '#ffb35c',
  ink: 'rgba(43,19,6,0.88)', coast: '#1a0b03', pith: '#f4ecd8', pithShade: '#d8ccb0',
  stem: '#5b6b2a', blade: '#c9d1d9', handle: '#1f1a17', text: '#e8e2d9', text2: '#8c8378',
};

const ANCHORS: [string, number, number][] = [
  ['AFRICA', 20, 8], ['EUROPE', 15, 50], ['ASIA', 90, 45], ['N. AMERICA', -100, 45],
  ['S. AMERICA', -60, -15], ['AUSTRALIA', 134, -25], ['ANTARCTICA', 60, -72],
];
const SURVIVORS = ['Greenland', 'Australia', 'Madagascar', 'Japan', 'United Kingdom', 'New Zealand', 'Iceland', 'Cuba', 'Sri Lanka', 'Chile', 'Italy', 'Norway'];
const NUMW = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

type World = { ids: Uint8Array; names: string[]; area: Float64Array; byName: Record<string, number> };
type Tear = { j: number; id: number; where: string; toast: string };
type Peel = { lon0: number; dir: number; w: number[]; cut: number[]; lv: number[]; tears: Tear[]; done: boolean };
type Dev = {
  n: number; lat: Float32Array; half: Float32Array; lon: Float32Array; KB: Float32Array;
  X: Float32Array; Y: Float32Array; TH: Float32Array; S: Float32Array; total: number; dir: number;
};
type Fit = { sc: number; rot: number; f: (x: number, y: number) => [number, number] };
type Res = {
  line1: string; l2: string; l3: string; pieces: number; totalCm: number; turns: number; widest: number; secs: number;
};

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const wrapLon = (l: number) => ((((l + 180) % 360) + 360) % 360) - 180;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

// ---------- world raster: country id per cell, equirectangular ----------
const RW = 2048, RH = 1024;
function decodeGeo(): Float32Array[][] {
  const bin = atob(GEO_DATA), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const v = new DataView(u8.buffer);
  let o = 0;
  const next = () => { const x = v.getInt16(o, true); o += 2; return x; };
  const out: Float32Array[][] = [];
  for (let c = 0; c < GEO_NAMES.length; c++) {
    const nr = next(), rings: Float32Array[] = [];
    for (let r = 0; r < nr; r++) {
      const np = next(), a = new Float32Array(np * 2);
      for (let i = 0; i < np * 2; i++) a[i] = next() / 10;
      rings.push(a);
    }
    out.push(rings);
  }
  return out;
}
function buildWorld(): World {
  const geo = decodeGeo();
  const ids = new Uint8Array(RW * RH);
  const xs: number[] = [];
  geo.forEach((R, ci) => {
    let y0 = 999, y1 = -999;
    for (const r of R) for (let i = 1; i < r.length; i += 2) { y0 = Math.min(y0, r[i]); y1 = Math.max(y1, r[i]); }
    const rowA = Math.max(0, Math.floor(((90 - y1) / 180) * RH)), rowB = Math.min(RH - 1, Math.ceil(((90 - y0) / 180) * RH));
    for (let row = rowA; row <= rowB; row++) {
      const lat = 90 - ((row + 0.5) * 180) / RH;
      xs.length = 0;
      for (const r of R) {
        const n = r.length;
        for (let i = 0; i < n; i += 2) {
          const j = (i + 2) % n, ya = r[i + 1], yb = r[j + 1];
          if (ya > lat !== yb > lat) xs.push(r[i] + ((lat - ya) / (yb - ya)) * (r[j] - r[i]));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const ca = Math.ceil(((xs[k] + 180) / 360) * RW - 0.5), cb = Math.floor(((xs[k + 1] + 180) / 360) * RW - 0.5);
        for (let c = ca; c <= cb && c < ca + RW; c++) ids[row * RW + (((c % RW) + RW) % RW)] = ci + 1;
      }
    }
  });
  const area = new Float64Array(GEO_NAMES.length + 1);
  for (let row = 0; row < RH; row++) {
    const wgt = Math.cos((90 - ((row + 0.5) * 180) / RH) * DEG);
    for (let c = 0; c < RW; c++) area[ids[row * RW + c]] += wgt;
  }
  const byName: Record<string, number> = {};
  GEO_NAMES.forEach((n, i) => (byName[n] = i + 1));
  return { ids, names: GEO_NAMES, area, byName };
}
function idAt(world: World, lon: number, lat: number) {
  const L = wrapLon(lon);
  const c = Math.min(RW - 1, Math.max(0, Math.floor(((L + 180) / 360) * RW)));
  const r = Math.min(RH - 1, Math.max(0, Math.floor(((90 - lat) / 180) * RH)));
  return world.ids[r * RW + c];
}
function oceanAt(lon: number, lat: number) {
  const L = wrapLon(lon);
  if (lat > 66) return 'Arctic';
  if (lat < -55) return 'Southern Ocean';
  if (L > 20 && L < 120 && lat < 25) return 'Indian Ocean';
  if (L > -70 && L <= 20) return 'Atlantic';
  return 'Pacific';
}

// ---------- the cut record ----------
// knife longitude at sample j: lon0 + dir * j / 2 degrees. cut[j]: knife latitude. w[j]: effective width.
// lv[b]: the quantised width the visitor asked for over block b (12 samples). The effective width
// chases it at W_RATE per sample, so a jump in the input never jumps the knife, and the whole cut
// is a pure function of (lon0, dir, lv): that is what the share link stores.
function makePeel(lon0: number, dir: number): Peel { return { lon0, dir, w: [], cut: [], lv: [], tears: [], done: false }; }
const levelOf = (w: number) => clamp(Math.round((w - W_MIN) / W_STEP), 0, (W_MAX - W_MIN) / W_STEP);
const upAt = (p: Peel, j: number) => (j < SPT ? CAP : p.cut[j - SPT]);
function pushSample(p: Peel, wTarget?: number) {
  if (p.done) return false;
  const j = p.cut.length, b = Math.floor(j / BLOCK);
  if (j >= MAX_SAMPLES) { p.done = true; return false; }
  if (p.lv.length <= b) { if (wTarget === undefined) return false; p.lv.push(levelOf(wTarget)); }
  const tgt = W_MIN + p.lv[b] * W_STEP;
  const w = j ? clamp(tgt, p.w[j - 1] - W_RATE, p.w[j - 1] + W_RATE) : tgt;
  // first turn: spiral off the cap at the current width. After it: one strip width below the
  // previous turn, never above the previous sample, so the cut is monotonic.
  let c = j < SPT ? (j ? p.cut[j - 1] : CAP) - w / SPT : Math.min(p.cut[j - SPT] - w, p.cut[j - 1]);
  if (c < -CAP) c = -CAP;
  p.w.push(w); p.cut.push(c);
  if (j >= SPT && c <= -CAP && upAt(p, j) - c < 0.25) p.done = true;
  return true;
}
const knifeLon = (p: Peel, j: number) => p.lon0 + p.dir * j * 0.5;
// strip sample index that owns (lon, lat), or -1
function stripOf(p: Peel, lon: number, lat: number) {
  const a = ((((p.dir * (lon - p.lon0)) % 360) + 360) % 360) / 0.5;
  const n = p.cut.length;
  for (let j = Math.round(a) % SPT; j < n; j += SPT) if (lat >= p.cut[j] && lat <= upAt(p, j)) return j;
  return -1;
}

// ---------- development into the plane ----------
// coil (0..1): 0 = flat map, 1 = rolled up. Used by the uncurl animation. KB keeps the curvature
// actually used for this frame, so the fold clamp works on the blended shape too.
function develop(p: Peel, coil = 0): Dev {
  const n = p.cut.length;
  const lat = new Float32Array(n), half = new Float32Array(n), lon = new Float32Array(n);
  const cx = new Float64Array(n), cy = new Float64Array(n), cz = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    const up = upAt(p, j), lo = p.cut[j];
    lat[j] = (up + lo) / 2; half[j] = (up - lo) / 2; lon[j] = knifeLon(p, j);
    const la = lat[j] * DEG, lo2 = lon[j] * DEG;
    cx[j] = Math.cos(la) * Math.cos(lo2); cy[j] = Math.cos(la) * Math.sin(lo2); cz[j] = Math.sin(la);
  }
  const K = new Float32Array(n), h = DPHI;
  for (let j = 1; j < n - 1; j++) {
    const ax = (cx[j + 1] - cx[j - 1]) / (2 * h), ay = (cy[j + 1] - cy[j - 1]) / (2 * h), az = (cz[j + 1] - cz[j - 1]) / (2 * h);
    const bx = (cx[j + 1] - 2 * cx[j] + cx[j - 1]) / (h * h), by = (cy[j + 1] - 2 * cy[j] + cy[j - 1]) / (h * h), bz = (cz[j + 1] - 2 * cz[j] + cz[j - 1]) / (h * h);
    const crx = ay * bz - az * by, cry = az * bx - ax * bz, crz = ax * by - ay * bx;
    const sp = Math.hypot(ax, ay, az);
    K[j] = (crx * cx[j] + cry * cy[j] + crz * cz[j]) / (sp * sp * sp);
  }
  if (n > 2) { K[0] = K[1]; K[n - 1] = K[n - 2]; }
  // a short box filter: a width change bends the midline over a few samples, and the raw second
  // difference turns that into a kink in the flat S. Averaging keeps the total turning.
  const KS = new Float32Array(n), R = 8;
  let acc = 0;
  for (let j = 0; j < Math.min(n, R); j++) acc += K[j];
  for (let j = 0; j < n; j++) {
    if (j + R < n) acc += K[j + R];
    if (j - R - 1 >= 0) acc -= K[j - R - 1];
    KS[j] = acc / (Math.min(n - 1, j + R) - Math.max(0, j - R) + 1);
  }
  const X = new Float32Array(n), Y = new Float32Array(n), TH = new Float32Array(n), S = new Float32Array(n), KB = new Float32Array(n);
  const tearSet = new Set(p.tears.map((t) => t.j));
  let x = 0, y = 0, th = 0, s = 0, total = 0;
  for (let j = 0; j < n - 1; j++) total += Math.hypot(cx[j + 1] - cx[j], cy[j + 1] - cy[j], cz[j + 1] - cz[j]);
  for (let j = 0; j < n; j++) {
    if (tearSet.has(j)) { x += GAP * Math.cos(th); y += GAP * Math.sin(th); }
    const kc = coil > 0 ? (p.dir < 0 ? -1 : 1) / Math.sqrt(0.04 + (0.62 * Math.max(0, total - s)) / Math.PI) : 0;
    const k = KS[j] * (1 - coil) + kc * coil;
    X[j] = x; Y[j] = y; TH[j] = th; S[j] = s; KB[j] = k;
    if (j === n - 1) break;
    const ds = Math.hypot(cx[j + 1] - cx[j], cy[j + 1] - cy[j], cz[j + 1] - cz[j]);
    const tm = th + (k * ds) / 2;
    x += ds * Math.cos(tm); y += ds * Math.sin(tm); th += k * ds; s += ds;
  }
  return { n, lat, half, lon, KB, X, Y, TH, S, total, dir: p.dir };
}
// planar position of latitude latPt on the meridian through sample j
function mapPt(d: Dev, j: number, latPt: number): [number, number] {
  let t = (latPt - d.lat[j]) * DEG * d.dir;
  const k = d.KB[j];
  if (t * k > 0) { const lim = FOLD / Math.abs(k); if (Math.abs(t) > lim) t = Math.sign(t) * lim; }
  return [d.X[j] - t * Math.sin(d.TH[j]), d.Y[j] + t * Math.cos(d.TH[j])];
}
// the two cap coins sit just past the ends of the S, on the strip's own tangent
function coinPts(d: Dev): [number, number][] {
  const a = 0, b = d.n - 1, off = CAP_R + 0.06;
  return [
    [d.X[a] - Math.cos(d.TH[a]) * off, d.Y[a] - Math.sin(d.TH[a]) * off],
    [d.X[b] + Math.cos(d.TH[b]) * off, d.Y[b] + Math.sin(d.TH[b]) * off],
  ];
}
// fit: rotate so the long axis runs down the box, north end on top. maxScale caps the scale (uncurl
// frames use the final scale or their own fit, whichever is smaller, so no frame leaves the box).
function fitDev(d: Dev, W: number, H: number, margin = 12, maxScale = 0, fixedRot: number | null = null): Fit {
  let rot: number;
  if (fixedRot !== null) rot = fixedRot;
  else {
    let mx = 0, my = 0, c = 0;
    for (let j = 0; j < d.n; j += 8) { mx += d.X[j]; my += d.Y[j]; c++; }
    mx /= c; my /= c;
    let sxx = 0, syy = 0, sxy = 0;
    for (let j = 0; j < d.n; j += 8) { const a = d.X[j] - mx, b = d.Y[j] - my; sxx += a * a; syy += b * b; sxy += a * b; }
    rot = Math.PI / 2 - 0.5 * Math.atan2(2 * sxy, sxx - syy);
    const ry = (x: number, y: number) => x * Math.sin(rot) + y * Math.cos(rot);
    if (ry(d.X[0] - mx, d.Y[0] - my) > ry(d.X[d.n - 1] - mx, d.Y[d.n - 1] - my)) rot += Math.PI;
  }
  const cr = Math.cos(rot), sr = Math.sin(rot);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const add = (px: number, py: number, r = 0) => {
    const qx = px * cr - py * sr, qy = px * sr + py * cr;
    x0 = Math.min(x0, qx - r); x1 = Math.max(x1, qx + r); y0 = Math.min(y0, qy - r); y1 = Math.max(y1, qy + r);
  };
  for (let j = 0; j < d.n; j += 4) for (const s of [-1, 1]) { const [px, py] = mapPt(d, j, d.lat[j] + s * d.half[j]); add(px, py); }
  for (const [px, py] of coinPts(d)) add(px, py, CAP_R);
  const own = Math.min((W - 2 * margin) / Math.max(1e-6, x1 - x0), (H - 2 * margin) / Math.max(1e-6, y1 - y0));
  const sc = maxScale ? Math.min(maxScale, own) : own;
  const ox = W / 2 - ((x0 + x1) / 2) * sc, oy = H / 2 - ((y0 + y1) / 2) * sc;
  return { sc, rot, f: (x, y) => [ox + (x * cr - y * sr) * sc, oy + (x * sr + y * cr) * sc] };
}

// ---------- ribbon drawing ----------
function pieceRanges(p: Peel): [number, number][] {
  const cuts = p.tears.map((t) => t.j).filter((j) => j > 0 && j < p.cut.length).sort((a, b) => a - b);
  const r: [number, number][] = []; let a = 0;
  for (const c of cuts) { if (c - a > 2) r.push([a, c]); a = c; }
  r.push([a, p.cut.length - 1]);
  return r;
}
// every quad goes into the path with the same winding, so the nonzero union has no holes where
// mapped quads reverse near the tight inner turns of the S
function quad(path: Path2D, a: [number, number], b: [number, number], c: [number, number], e: [number, number]) {
  const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]) + (c[0] - a[0]) * (e[1] - a[1]) - (e[0] - a[0]) * (c[1] - a[1]);
  const q = area >= 0 ? [a, b, c, e] : [a, e, c, b];
  path.moveTo(q[0][0], q[0][1]); path.lineTo(q[1][0], q[1][1]); path.lineTo(q[2][0], q[2][1]); path.lineTo(q[3][0], q[3][1]); path.closePath();
}
type RibbonOpt = { ink?: number; cell?: number; px?: number; shadow?: boolean };
function drawRibbon(ctx: CanvasRenderingContext2D, p: Peel, d: Dev, fit: Fit, world: World, opt: RibbonOpt = {}) {
  const ink = opt.ink ?? 1, px = opt.px || 1, cell = opt.cell || 1.4;
  const avgDs = d.total / Math.max(1, d.n);
  const step = Math.max(1, Math.round(cell / (fit.sc * avgDs)));
  const f = fit.f;
  const ranges = pieceRanges(p);
  const skin = new Path2D();
  for (const [a, b] of ranges) {
    for (let j = a; j < b; j += step) {
      const j2 = Math.min(b, j + step);
      quad(skin, f(...mapPt(d, j, d.lat[j] + d.half[j])), f(...mapPt(d, j2, d.lat[j2] + d.half[j2])),
        f(...mapPt(d, j2, d.lat[j2] - d.half[j2])), f(...mapPt(d, j, d.lat[j] - d.half[j])));
    }
  }
  ctx.save();
  if (opt.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 8 * px; ctx.shadowOffsetY = 3 * px; }
  ctx.fillStyle = COL.skin; ctx.fill(skin);
  ctx.restore();
  if (ink > 0) {
    const land = new Path2D();
    for (const [a, b] of ranges) {
      for (let j = a; j < b; j += step) {
        const j2 = Math.min(b, j + step);
        const wpx = 2 * d.half[j] * DEG * fit.sc;
        const nT = Math.max(2, Math.min(60, Math.ceil(wpx / cell)));
        const lonC = (d.lon[j] + d.lon[j2]) / 2;
        for (let i = 0; i < nT; i++) {
          const fa = i / nT, fb = (i + 1) / nT;
          const latA = d.lat[j] - d.half[j] + 2 * d.half[j] * fa, latB = d.lat[j] - d.half[j] + 2 * d.half[j] * fb;
          if (!idAt(world, lonC, (latA + latB) / 2)) continue;
          const latA2 = d.lat[j2] - d.half[j2] + 2 * d.half[j2] * fa, latB2 = d.lat[j2] - d.half[j2] + 2 * d.half[j2] * fb;
          quad(land, f(...mapPt(d, j, latA)), f(...mapPt(d, j, latB)), f(...mapPt(d, j2, latB2)), f(...mapPt(d, j2, latA2)));
        }
      }
    }
    ctx.save(); ctx.globalAlpha = ink; ctx.fillStyle = COL.ink; ctx.fill(land); ctx.restore();
  }
  // torn ends: pith teeth, seeded from the record so a share link draws the same teeth
  const rnd = mulberry32(p.tears.length * 977 + p.cut.length);
  ctx.fillStyle = COL.pith;
  for (const t of p.tears) {
    for (const [j, sgn] of [[Math.max(0, t.j - 1), 1], [Math.min(d.n - 1, t.j), -1]]) {
      const teeth = 3 + Math.floor(rnd() * 3);
      const a = f(...mapPt(d, j, d.lat[j] - d.half[j])), b = f(...mapPt(d, j, d.lat[j] + d.half[j]));
      const ux = Math.cos(d.TH[j] + fit.rot) * sgn, uy = Math.sin(d.TH[j] + fit.rot) * sgn;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]);
      for (let k = 0; k < teeth; k++) {
        const m = (k + 0.5) / teeth, e = (k + 1) / teeth, dep = (2 + rnd() * 4) * px;
        ctx.lineTo(a[0] + (b[0] - a[0]) * m - ux * dep, a[1] + (b[1] - a[1]) * m - uy * dep);
        ctx.lineTo(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e);
      }
      ctx.closePath(); ctx.fill();
    }
  }
}
function drawCoins(ctx: CanvasRenderingContext2D, d: Dev, fit: Fit, px = 1) {
  const r = Math.max(5 * px, CAP_R * fit.sc);
  coinPts(d).forEach(([x0, y0], i) => {
    const [x, y] = fit.f(x0, y0);
    ctx.fillStyle = COL.skin; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = COL.pith; ctx.lineWidth = Math.max(1, r * 0.14); ctx.stroke();
    if (i === 0) { ctx.fillStyle = COL.stem; ctx.beginPath(); ctx.arc(x, y, r * 0.32, 0, 7); ctx.fill(); }
  });
}
function drawLabels(ctx: CanvasRenderingContext2D, p: Peel, d: Dev, fit: Fit, world: World, sz: [number, number], px = 1, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = COL.pith; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const wpx = 2 * d.half[Math.floor(d.n / 2)] * DEG * fit.sc;
  ctx.font = `${Math.round(clamp(wpx * 0.65, sz[0], sz[1]))}px m6x11plus, monospace`;
  ctx.strokeStyle = 'rgba(26,11,3,0.92)'; ctx.lineWidth = 3.5 * px; ctx.lineJoin = 'round';
  for (const [name, lo, la0] of ANCHORS) {
    const j = stripOf(p, lo, la0);
    if (j < 0) continue;
    // keep the label off the strip edge when the anchor sits near a cut line, as long as it stays on land
    let la = la0;
    const top = upAt(p, j), bot = p.cut[j], wd = top - bot;
    if (wd > 8) { const c = clamp(la0, bot + 0.3 * wd, top - 0.3 * wd); if (idAt(world, lo, c)) la = c; }
    const [x, y] = fit.f(...mapPt(d, j, la));
    let a = d.TH[j] + fit.rot;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    if (a > Math.PI / 2) a -= Math.PI; if (a < -Math.PI / 2) a += Math.PI;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeText(name, 0, 0); ctx.fillText(name, 0, 0); ctx.restore();
  }
  ctx.restore();
}
// tear labels sit in the side gutters of a box W wide, with a thin leader to the tear
function drawTearLabels(ctx: CanvasRenderingContext2D, p: Peel, d: Dev, fit: Fit, W: number, H: number, mono: string, fs: number, px = 1, max = 99, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.font = `${fs}px ${mono}`; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  const items = p.tears.slice(0, max).map((t) => {
    const j = Math.min(d.n - 1, t.j);
    const [x, y] = fit.f(d.X[j], d.Y[j]);
    return { t, x, y, side: x < W / 2 ? -1 : 1, ly: y, tw: ctx.measureText(t.where).width };
  });
  for (const side of [-1, 1]) {
    const col = items.filter((it) => it.side === side).sort((a, b) => a.y - b.y);
    let last = -1e9;
    for (const it of col) { it.ly = clamp(Math.max(it.y, last + fs * 1.5), fs, H - fs); last = it.ly; }
  }
  for (const it of items) {
    const m = 6 * px;
    const tx = it.side < 0 ? m : W - m;
    const ex = it.side < 0 ? m + it.tw + 4 * px : W - m - it.tw - 4 * px;
    ctx.globalAlpha = alpha * 0.85; ctx.strokeStyle = COL.pith; ctx.lineWidth = 1 * px;
    ctx.beginPath(); ctx.moveTo(it.x, it.y); ctx.lineTo(ex, it.ly); ctx.stroke();
    ctx.globalAlpha = alpha * 0.82; ctx.fillStyle = COL.page;
    ctx.beginPath(); ctx.roundRect(it.side < 0 ? tx - 3 * px : tx - it.tw - 3 * px, it.ly - fs * 0.7, it.tw + 6 * px, fs * 1.4, 3 * px); ctx.fill();
    ctx.globalAlpha = alpha; ctx.textAlign = it.side < 0 ? 'left' : 'right';
    ctx.fillStyle = COL.pith; ctx.fillText(it.t.where, tx, it.ly);
  }
  ctx.restore();
}
function drawBoard(ctx: CanvasRenderingContext2D, W: number, H: number, seed = 7) {
  ctx.fillStyle = COL.board; ctx.fillRect(0, 0, W, H);
  const r = mulberry32(seed);
  ctx.strokeStyle = COL.grain; ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
  for (let i = 0; i < H / 5; i++) {
    const y = r() * H, x = r() * W, l = 40 + r() * 200;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + (r() - 0.5) * 3); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ---------- run facts ----------
function analyze(p: Peel, world: World, secs: number): Res {
  const n = p.cut.length;
  const ranges = pieceRanges(p);
  const pieceOf = new Int32Array(n);
  ranges.forEach(([a, b], k) => { for (let j = a; j <= b; j++) pieceOf[j] = k; });
  const N = world.names.length + 1;
  const jmin = new Int32Array(N).fill(1e9), jmax = new Int32Array(N).fill(-1);
  const perPiece = ranges.map(() => new Map<number, number>());
  const africaK = new Map<number, Set<number>>();
  for (let j = 0; j < n; j += 2) {
    const up = upAt(p, j), lo = p.cut[j], lonj = knifeLon(p, j);
    const nT = Math.max(2, Math.ceil(up - lo));
    for (let i = 0; i < nT; i++) {
      const la = lo + ((i + 0.5) / nT) * (up - lo);
      const id = idAt(world, lonj, la);
      if (!id) continue;
      if (j < jmin[id]) jmin[id] = j; if (j > jmax[id]) jmax[id] = j;
      const m = perPiece[pieceOf[j]]; m.set(id, (m.get(id) || 0) + Math.cos(la * DEG));
      const L = wrapLon(lonj);
      if (L > -18 && L < 52 && la > -35 && la < 37 && !(L > 34 && la > 12)) {
        const col = Math.round(L);
        const set = africaK.get(col) || new Set<number>(); set.add(Math.floor(j / SPT)); africaK.set(col, set);
      }
    }
  }
  const d = develop(p, 0);
  const lenCm = ranges.map(([a, b]) => (d.S[b] - d.S[a]) * ORANGE_CM);
  const total = lenCm.reduce((x, y) => x + y, 0);
  const ant = world.byName['Antarctica'] || -1;
  const name = (id: number) => world.names[id - 1];
  type Fact = { kind: string; score: number; text: string; country: number };
  const facts: Fact[] = [];
  // loner: a torn piece that is mostly one country. Never the tail piece, never Antarctica.
  if (ranges.length > 1) {
    perPiece.forEach((m, k) => {
      if (k === ranges.length - 1) return;
      let tot = 0, best = 0, bid = 0;
      m.forEach((v, id) => { tot += v; if (v > best) { best = v; bid = id; } });
      if (bid && bid !== ant && tot > 30 && best / tot >= 0.7) facts.push({ kind: 'loner', score: 5 + world.area[bid] / 1e4, text: `${name(bid)} came off on its own.`, country: bid });
    });
  }
  // casualty: the largest country a tear went through. Antarctica only when it is the only tear.
  let cas = 0;
  for (const t of p.tears) {
    if (!t.id || (t.id === ant && p.tears.length > 1)) continue;
    if (!cas || world.area[t.id] > world.area[cas]) cas = t.id;
  }
  if (cas) facts.push({ kind: 'casualty', score: 4 + world.area[cas] / 1e4, text: `The tear went straight through ${name(cas)}.`, country: cas });
  let surv = 0;
  for (const nm of SURVIVORS) {
    const id = world.byName[nm]; if (!id || jmax[id] < 0) continue;
    const span = jmax[id] - jmin[id];
    const torn = p.tears.some((t) => t.j >= jmin[id] && t.j <= jmax[id]);
    if (span < SPT * 0.7 && !torn && (!surv || world.area[id] > world.area[surv])) surv = id;
  }
  if (surv) facts.push({ kind: 'survivor', score: 3 + world.area[surv] / 1e4, text: name(surv) === 'Greenland' ? 'Greenland survived.' : `${name(surv)} made it in one piece.`, country: surv });
  let slices = 0; africaK.forEach((s) => (slices = Math.max(slices, s.size)));
  if (slices > 1) facts.push({ kind: 'slicer', score: 2 + slices / 10, text: `Africa is in ${slices} strips.`, country: -2 });
  facts.push({ kind: 'tail', score: 0, text: 'Antarctica is the tail.', country: ant });
  facts.sort((a, b) => b.score - a.score);
  const picked: Fact[] = []; const kinds = new Set<string>(), named = new Set<number>();
  for (const f of facts) {
    if (kinds.has(f.kind) || named.has(f.country)) continue;
    picked.push(f); kinds.add(f.kind); named.add(f.country);
    if (picked.length === 2) break;
  }
  const nw = (k: number) => (k <= 12 ? NUMW[k] : String(k));
  const line1 = ranges.length === 1 ? `One piece. ${Math.round(total)} cm.` : `${nw(ranges.length)} pieces. The longest was ${Math.round(Math.max(...lenCm))} cm.`;
  // widest strip after the first turn, which only ever tapers in from the cap
  let widest = 0;
  for (let j = Math.min(SPT, n - 1); j < n; j++) widest = Math.max(widest, p.w[j]);
  return { line1, l2: picked[0]?.text || '', l3: picked[1]?.text || '', pieces: ranges.length, totalCm: total, turns: n / SPT, widest, secs };
}
function tearName(p: Peel, world: World, j: number): Tear {
  const lonj = knifeLon(p, j), up = upAt(p, j), lo = p.cut[j];
  for (let i = 0; i <= 8; i++) {
    const la = up + ((lo - up) * i) / 8;
    const id = idAt(world, lonj, la);
    if (id) return { j, id, where: world.names[id - 1], toast: `Torn through ${world.names[id - 1]}.` };
  }
  const oc = oceanAt(lonj, (up + lo) / 2);
  return { j, id: 0, where: oc, toast: `Torn in the ${oc}. Nobody hurt.` };
}

// ---------- the link: ?p= ----------
// 'a' version, dir, lon0 + 180 (2 chars), seconds (2), tear count (1), tears (3 each), then the
// width levels run length encoded as (level, run - 1) pairs.
const enc = (v: number, k: number) => { let s = ''; for (let i = k - 1; i >= 0; i--) s += B64[(v >> (6 * i)) & 63]; return s; };
function encodeRun(p: Peel, secs: number) {
  let s = 'a' + (p.dir > 0 ? '1' : '0') + enc(p.lon0 + 180, 2) + enc(clamp(secs, 0, 4095), 2) + enc(p.tears.length, 1);
  for (const t of p.tears) s += enc(t.j, 3);
  for (let i = 0; i < p.lv.length;) {
    let k = 1; while (i + k < p.lv.length && p.lv[i + k] === p.lv[i] && k < 64) k++;
    s += enc(p.lv[i], 1) + enc(k - 1, 1); i += k;
  }
  return s;
}
function decodeRun(s: string, world: World): { p: Peel; secs: number } | null {
  if (!/^a[01][A-Za-z0-9_-]{5,4000}$/.test(s)) return null;
  let o = 2;
  const dec = (k: number) => { let v = 0; for (let i = 0; i < k; i++) { const c = B64.indexOf(s[o++]); if (c < 0) throw new Error('bad'); v = v * 64 + c; } return v; };
  try {
    const dir = s[1] === '1' ? 1 : -1;
    const lon0 = dec(2) - 180, secs = dec(2), nt = dec(1);
    if (lon0 < -180 || lon0 >= 180 || o + nt * 3 > s.length) return null;
    const tj: number[] = [];
    for (let i = 0; i < nt; i++) tj.push(dec(3));
    const lv: number[] = [];
    const maxL = (W_MAX - W_MIN) / W_STEP;
    while (o < s.length) {
      if (o + 2 > s.length) return null;
      const l = dec(1), k = dec(1) + 1;
      if (l > maxL) return null;
      for (let i = 0; i < k; i++) lv.push(l);
    }
    const p = makePeel(lon0, dir); p.lv = lv;
    while (!p.done) if (!pushSample(p)) return null;
    if (p.cut.length >= MAX_SAMPLES || p.lv.length !== Math.ceil(p.cut.length / BLOCK)) return null;
    let prev = 0;
    for (const j of tj) { if (j < 40 || j <= prev + 2 || j >= p.cut.length - 1) return null; prev = j; p.tears.push(tearName(p, world, j)); }
    return { p, secs };
  } catch { return null; }
}

// ---------- the orange: one WebGL1 shader ----------
const VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;gl_Position=vec4(a,0.,1.);}';
const FS = `precision highp float;
varying vec2 v;
uniform sampler2D uMask, uCut;
uniform float uSpin, uTilt, uPhi, uLon0, uDir, uN;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float cutAt(float i){i=clamp(floor(i+0.5),0.,uN-1.);vec2 c=vec2(mod(i,256.),floor(i/256.));vec4 t=texture2D(uCut,(c+0.5)/vec2(256.,64.));return (t.r*255.*256.+t.g*255.)/65535.*180.-90.;}
void main(){
  vec2 p=v*2.-1.; float r2=dot(p,p); if(r2>1.){gl_FragColor=vec4(0.);return;}
  vec3 n=vec3(p.x,p.y,sqrt(1.-r2));
  float ct=cos(uTilt), st=sin(uTilt);
  vec3 b=vec3(n.x, n.y*ct+n.z*st, -n.y*st+n.z*ct);
  float lat=degrees(asin(clamp(b.y,-1.,1.)));
  float lon=degrees(uSpin+atan(b.x,b.z));
  float a=mod(uDir*(lon-uLon0),360.)/0.5;
  float jp=uPhi-mod(uPhi-a,720.);
  bool peeled=false; float edge=99.;
  if(uN>0. && jp>=0. && lat<84.){ float c=cutAt(jp); peeled=lat>c; edge=abs(lat-c); }
  if(lat>=84.) edge=lat-84.;
  float u=fract((lon+180.)/360.), w=(90.-lat)/180.;
  float land=texture2D(uMask,vec2(u,w)).r;
  vec3 col;
  if(peeled){
    col=vec3(0.957,0.925,0.847);
    float seg=abs(fract(lon/36.)-0.5);
    col=mix(col,vec3(1.,0.85,0.63),smoothstep(0.47,0.5,seg)*0.6);
    col=mix(col,vec3(1.,0.62,0.23),0.18*(1.-abs(lat)/90.));
  } else {
    col=vec3(0.949,0.549,0.157);
    vec3 bq=floor(b*150.); float pore=step(0.72,hash(bq.xy+bq.z*17.31));
    col=mix(col,vec3(0.851,0.451,0.102),pore*0.25);
    col=mix(col,vec3(0.725,0.345,0.102),land*0.85);
    if(edge<0.9) col=mix(col,vec3(0.957,0.925,0.847),0.85);
    if(lat>=84.) col=mix(col,vec3(0.357,0.42,0.165),smoothstep(85.5,87.,lat));
  }
  vec3 L=normalize(vec3(-0.5,0.7,0.6));
  float dif=max(dot(n,L),0.);
  float spec=peeled?0.:pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),40.)*0.35;
  col=col*(0.22+0.88*dif)+spec;
  float rim=smoothstep(1.,0.96,sqrt(r2));
  gl_FragColor=vec4(col*rim,rim);
}`;
type Orange = { gl: WebGLRenderingContext; draw: (spin: number, tilt: number, p: Peel | null) => void };
function makeOrange(canvas: HTMLCanvasElement, world: World): Orange | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true });
  if (!gl) return null;
  const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || 'shader'); return o; };
  const pr = gl.createProgram()!; gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error('link');
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  // land mask 1024 x 512 from the id raster
  const MW = 1024, MH = 512, m = new Uint8Array(MW * MH);
  for (let r = 0; r < MH; r++) for (let c = 0; c < MW; c++) m[r * MW + c] = world.ids[r * 2 * RW + c * 2] ? 255 : 0;
  const tm = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tm);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, MW, MH, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, m);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const cutData = new Uint8Array(256 * 64 * 4);
  const tc = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tc);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, cutData);
  for (const k of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, k, gl.NEAREST);
  for (const k of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE);
  const U: Record<string, WebGLUniformLocation | null> = {};
  for (const k of ['uMask', 'uCut', 'uSpin', 'uTilt', 'uPhi', 'uLon0', 'uDir', 'uN']) U[k] = gl.getUniformLocation(pr, k);
  gl.uniform1i(U.uMask, 0); gl.uniform1i(U.uCut, 1);
  let sent = 0, lastP: Peel | null = null;
  return {
    gl,
    draw(spin, tilt, p) {
      if (p !== lastP) { sent = 0; lastP = p; }
      if (p && p.cut.length !== sent) {
        for (let j = sent; j < Math.min(p.cut.length, MAX_SAMPLES); j++) {
          const q = Math.round(((p.cut[j] + 90) / 180) * 65535);
          cutData[j * 4] = q >> 8; cutData[j * 4 + 1] = q & 255;
        }
        sent = p.cut.length;
        gl.activeTexture(gl.TEXTURE1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, cutData);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uSpin, spin * DEG); gl.uniform1f(U.uTilt, tilt * DEG);
      gl.uniform1f(U.uPhi, p ? p.cut.length - 1 : -1); gl.uniform1f(U.uLon0, p ? p.lon0 : 0); gl.uniform1f(U.uDir, p ? p.dir : 1); gl.uniform1f(U.uN, p ? p.cut.length : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}
// screen position of (lonRel from the view centre, lat) on a unit orange seen with this tilt
function project(lonRel: number, lat: number, tilt: number): [number, number, number] {
  const la = lat * DEG, lo = lonRel * DEG, ct = Math.cos(tilt * DEG), st = Math.sin(tilt * DEG);
  const bx = Math.cos(la) * Math.sin(lo), by = Math.sin(la), bz = Math.cos(la) * Math.cos(lo);
  return [bx, by * ct - bz * st, by * st + bz * ct]; // x right, y up, z toward the viewer
}
// ===== PEEL CORE END =====

// feel numbers (Wednesday calibration)
const GAIN = 1.0; // radians of turn per orange radius of drag: the surface follows the thumb
const W_GAIN = 0.16; // degrees of width per px of vertical drag beyond the dead zone
const DEAD = 0.5; // only |dy| beyond 0.5 |dx| counts, so a casual sideways swipe keeps its width
const TA = 6, TB = 0.03, TC = 1.0; // tension: overspeed, width change, decay
const omegaSafe = (w: number) => 0.9 * Math.pow(W_DEF / w, 1.7); // turns per second: 0.9 at 28, 0.45 at 42
const INERTIA = 0.25;
const KEY_TURN = 0.55; // turns per second while an arrow key is held: under the safe speed at 28
const KEY_WIDTH = 14; // degrees per second while up or down is held
const PALE_PX = 40; // the tension cue: the first 40 px of peel at the knife
const STORE_BEST = 'wiz-peel-best';

const COPY = {
  title: 'Peel',
  sub: 'The world is printed on an orange. Peel it in one strip and lay it flat.',
  idle: 'Drag sideways to start peeling.',
  nudge: 'It does not peel itself.',
  width: 'Drag down for a wider strip. Wider tears easier.',
  stalled: 'Still attached. Keep turning.',
  bottom: 'That is the bottom.',
  shared: 'Someone peeled this. Your turn.',
  bad: 'That peel did not survive the trip. Here is a fresh orange.',
  noGl: 'This orange needs WebGL and your browser said no.',
  foot: 'wiz.jock.pl/experiments/peel',
};
const statLine = (r: Res) => `${Math.round(r.turns)} turns. Widest strip ${Math.round(r.widest)} degrees. ${r.secs} s.`;
type Best = { pieces: number; cm: number; widest: number };
const bestLine = (b: Best) => (b.pieces === 1 ? `Your best: one piece, ${Math.round(b.cm)} cm.` : `Your best: ${b.pieces} pieces, widest strip ${Math.round(b.widest)} degrees.`);

type Node = { x: number; y: number; px: number; py: number; w: number };
type Chain = { nodes: Node[]; seg: number; pinned: boolean; age: number; teeth?: number[] };
type Phase = 'first' | 'idle' | 'peel' | 'finish' | 'result' | 'error';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Client() {
  const rootRef = useRef<HTMLElement>(null), stageRef = useRef<HTMLDivElement>(null), bgRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null), fgRef = useRef<HTMLCanvasElement>(null), mapRef = useRef<HTMLCanvasElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('first');
  const [hud, setHud] = useState({ cm: 0, pieces: 1 });
  const [hint, setHint] = useState(COPY.idle);
  const [toast, setToast] = useState('');
  const [res, setRes] = useState<Res | null>(null);
  const [showCap, setShowCap] = useState(false);
  const [glOk, setGlOk] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [best, setBest] = useState<Best | null>(null);
  const [reduced, setReduced] = useState(false);
  const G = useRef<any>(null);

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
    const stage = stageRef.current!, bg = bgRef.current!, glc = glRef.current!, fg = fgRef.current!;
    const world = buildWorld();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mono = getComputedStyle(rootRef.current!).fontFamily || 'monospace';
    const g: any = {
      phase: 'idle', spin: 15, tilt: 25, phi: 0, omega: 0, w: W_DEF, T: 0, p: null as Peel | null, dir: -1, side: 1, sideShown: 1,
      dragging: false, lastX: 0, lastY: 0, t0: 0, t: 0, cool: 0, len: 0, pieceStartLen: 0, dwAcc: 0,
      chain: null as Chain | null, fallen: [] as Chain[], log: [] as any[], idleT: 0, stillT: 0, turnHinted: false, widthHinted: false,
      toastUntil: 0, maxT: 0, slide: 0, res: null as Res | null, frames: 0, key: 0, keyW: 0, secs: 0, shared: false,
      reduced, uncurlAt: 0, png: null as Blob | null, paleAt: 0, finishAt: 0, phiPrev: 0,
    };
    G.current = g;
    if ((window as any).__peelQA) (window as any).__peel = g;
    const log = (name: string, extra: Record<string, unknown> = {}) => g.log.push({ name, at: Math.round(performance.now()), t: Math.round(g.t), ...extra });
    let L = { W: 0, H: 0, D: 0, cx: 0, cy: 0, R: 0, board: 0 };
    let finalFit: Fit | null = null, finalDev: Dev | null = null, boardImg: HTMLCanvasElement | null = null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const layout = () => {
      const r = stage.getBoundingClientRect(), d = discRef.current!.getBoundingClientRect();
      L = { W: r.width, H: r.height, D: d.width, cx: d.left - r.left + d.width / 2, cy: d.top - r.top + d.width / 2, R: d.width / 2, board: 0 };
      L.board = L.cy + L.R + 80;
      for (const c of [bg, fg]) { c.width = Math.round(L.W * dpr); c.height = Math.round(L.H * dpr); }
      glc.width = Math.round(L.D * dpr); glc.height = Math.round(L.D * dpr);
      drawBg();
      if (g.phase === 'result') { finalFit = null; g.drawnFinal = false; }
    };
    const drawBg = () => {
      const c = bg.getContext('2d')!; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = COL.page; c.fillRect(0, 0, L.W, L.H);
      c.save(); c.translate(0, L.board); drawBoard(c, L.W, L.H - L.board, 11); c.restore();
      c.fillStyle = 'rgba(255,179,92,0.08)'; c.fillRect(0, L.board, L.W, 1.5);
      const sh = c.createRadialGradient(L.cx, L.board + 6, 4, L.cx, L.board + 6, L.R * 0.9);
      sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = sh; c.beginPath(); c.ellipse(L.cx, L.board + 6, L.R * 0.9, 14, 0, 0, 7); c.fill();
    };
    let orange: Orange | null = null;
    try { orange = makeOrange(glc, world); } catch (e) { console.warn('peel: no orange', e); orange = null; }
    layout();
    window.addEventListener('resize', layout);
    window.visualViewport?.addEventListener('resize', layout);
    setMounted(true);
    setReduced(reduced);
    if (orange) setGlOk(true);
    try { const b = JSON.parse(localStorage.getItem(STORE_BEST) || 'null'); if (b && typeof b.pieces === 'number') setBest(b); } catch {}
    try { document.fonts?.load('20px m6x11plus'); document.fonts?.load(`14px ${mono}`); } catch {}

    // ---------- input ----------
    const begin = (dir: number) => {
      g.dir = dir; g.side = dir < 0 ? 1 : -1; // drag right: the surface runs right, the knife sits on the right limb
      const off = g.side * KNIFE_OFF;
      const lon0 = Math.round(wrapLon(g.spin + off));
      g.p = makePeel(lon0, dir); g.spin = lon0 - off;
      g.phase = 'peel'; g.t0 = performance.now(); g.t = 0;
      g.len = 0; g.pieceStartLen = 0; g.fallen = []; g.T = 0; g.w = W_DEF; g.phi = 0; g.omega = 0; g.phiPrev = 0; g.maxT = 0;
      g.turnHinted = false; g.stillT = 0;
      g.chain = null;
      setPhase('peel'); log('start', { dir, lon0 });
    };
    const onDown = (e: PointerEvent) => {
      if (g.phase !== 'idle' && g.phase !== 'peel') return;
      g.dragging = true; g.lastX = e.clientX; g.lastY = e.clientY;
      try { stage.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!g.dragging) return;
      const dx = e.clientX - g.lastX, dy = e.clientY - g.lastY;
      g.lastX = e.clientX; g.lastY = e.clientY;
      if (g.phase === 'idle') { if (Math.abs(dx) < 2) return; begin(dx > 0 ? -1 : 1); }
      if (g.phase !== 'peel') return;
      // a ratchet: the peel only comes off one way. A drag back does nothing, the way a real knife
      // will not put skin back on.
      const fwd = g.dir === -1 ? dx : -dx;
      if (fwd > 0) g.phi += (fwd * GAIN) / L.R;
      const ex = Math.abs(dy) - DEAD * Math.abs(dx);
      if (ex > 0) {
        const nw = clamp(g.w + Math.sign(dy) * ex * W_GAIN, W_MIN, W_MAX);
        g.dwAcc += Math.abs(nw - g.w); g.w = nw;
      }
    };
    const onUp = () => { g.dragging = false; };
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    const onKey = (e: KeyboardEvent) => {
      const down = e.type === 'keydown';
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (g.phase !== 'idle' && g.phase !== 'peel') return;
        e.preventDefault();
        const kd = e.key === 'ArrowRight' ? -1 : 1;
        if (down) { if (g.phase === 'idle') begin(kd); g.key = kd === g.dir ? 1 : 0; } else g.key = 0;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (g.phase !== 'peel' && g.phase !== 'idle') return;
        e.preventDefault();
        g.keyW = down ? (e.key === 'ArrowDown' ? 1 : -1) : 0;
      } else if (e.key === 'Enter' && down && g.phase === 'result' && !(document.activeElement instanceof HTMLButtonElement) && !(document.activeElement instanceof HTMLInputElement)) {
        e.preventDefault(); g.again();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    // ---------- chain ----------
    const newChain = (x: number, y: number): Chain => {
      const n: Node[] = [];
      for (let i = 0; i < 48; i++) n.push({ x, y, px: x, py: y, w: g.w * DEG * L.R * 0.75 });
      return { nodes: n, seg: 0.3, pinned: true, age: 0 };
    };
    const knifeLat = () => (g.p && g.p.cut.length ? g.p.cut[g.p.cut.length - 1] : CAP);
    const knifePos = (): [number, number] => {
      const [x, y] = project(g.sideShown * KNIFE_OFF, knifeLat(), g.tilt);
      return [L.cx + x * L.R, L.cy - y * L.R];
    };
    const stepChain = (ch: Chain, dt: number, kx: number, ky: number, side: number) => {
      const N = ch.nodes, floor = L.board + 10;
      for (let i = ch.pinned ? 1 : 0; i < N.length; i++) {
        const q = N[i];
        const vx = (q.x - q.px) * 0.98, vy = (q.y - q.py) * 0.98;
        q.px = q.x; q.py = q.y;
        q.x += vx + (ch.pinned && i < 8 ? side * 500 * dt * dt : 0); q.y += vy + 1400 * dt * dt;
        if (q.y > floor) {
          // one small bounce for a falling piece, then friction on the board
          const v = q.y - q.py;
          q.y = floor;
          if (!ch.pinned && v > 3 && !g.reduced) q.py = floor + v * 0.3; else { q.py = q.y; q.px = q.x - (q.x - q.px) * 0.5; }
        }
      }
      for (let it = 0; it < 8; it++) {
        if (ch.pinned) { N[0].x = kx; N[0].y = ky; }
        for (let i = 1; i < N.length; i++) {
          const a = N[i - 1], b = N[i], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6, k = (d - ch.seg) / d;
          if (ch.pinned && i === 1) { b.x -= dx * k; b.y -= dy * k; } else { a.x += dx * k * 0.5; a.y += dy * k * 0.5; b.x -= dx * k * 0.5; b.y -= dy * k * 0.5; }
        }
        for (const q of N) if (q.y > floor) q.y = floor;
        // the peel drapes over the orange, never through it, so the face stays clear
        if (!g.slide) for (let i = ch.pinned ? 2 : 0; i < N.length; i++) {
          const q = N[i], ox = q.x - L.cx, oy = q.y - L.cy, d = Math.hypot(ox, oy) || 1e-6, rr = L.R + q.w * 0.4;
          if (d < rr) { q.x = L.cx + (ox / d) * rr; q.y = L.cy + (oy / d) * rr; }
        }
      }
    };
    const mix = (h1: string, h2: string, k: number) => {
      const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
      const ch = (s: number) => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k);
      return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
    };
    const drawChain = (c: CanvasRenderingContext2D, ch: Chain, T: number, now: number, live: boolean) => {
      const N = ch.nodes;
      // twist ramps in from zero at the knife: the first PALE_PX stay flat and skin side out, so the
      // tension cue (lerp to pith, thinning) has a clean orange field to show on
      const th: number[] = [0], dist: number[] = [0];
      for (let i = 1; i < N.length; i++) {
        dist.push(dist[i - 1] + Math.hypot(N[i].x - N[i - 1].x, N[i].y - N[i - 1].y));
        const ramp = live ? clamp((dist[i] - PALE_PX) / 30, 0, 1) : 1;
        th.push(th[i - 1] + 0.35 * ramp);
      }
      const k = live && T > 0.4 ? Math.min(1, (T - 0.4) / 0.4) : 0;
      for (let i = N.length - 2; i >= 0; i--) {
        const a = N[i], b = N[i + 1];
        const sway = live && !g.reduced ? 0.5 * Math.sin(now / 900 + i * 0.12) * clamp((dist[i] - PALE_PX) / 30, 0, 1) : 0;
        const t0 = th[i] + sway, t1 = th[i + 1] + sway;
        let wa = a.w * Math.max(0.12, Math.abs(Math.cos(t0))), wb = b.w * Math.max(0.12, Math.abs(Math.cos(t1)));
        let col = Math.cos(t0) > 0 ? COL.skin : COL.pith;
        let jx = 0;
        if (k > 0 && dist[i] < PALE_PX) {
          const fade = k * (1 - dist[i] / (PALE_PX * 1.4));
          col = mix(Math.cos(t0) > 0 ? COL.skin : COL.pith, COL.pith, fade);
          wa *= 1 - 0.5 * T; wb *= 1 - 0.5 * T;
          if (T > 0.8 && !g.reduced) jx = g.frames % 2 ? 1 : -1;
        }
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
        c.fillStyle = col;
        c.beginPath();
        c.moveTo(a.x + jx + (nx * wa) / 2, a.y + (ny * wa) / 2); c.lineTo(b.x + jx + (nx * wb) / 2, b.y + (ny * wb) / 2);
        c.lineTo(b.x + jx - (nx * wb) / 2, b.y - (ny * wb) / 2); c.lineTo(a.x + jx - (nx * wa) / 2, a.y - (ny * wa) / 2); c.closePath(); c.fill();
      }
      if (!ch.pinned && ch.teeth) {
        const a = N[0], b = N[1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
        c.fillStyle = COL.pith; c.beginPath();
        const w = a.w * 0.9;
        c.moveTo(a.x + (nx * w) / 2, a.y + (ny * w) / 2);
        for (let q = 0; q < ch.teeth.length; q++) {
          const m = (q + 0.5) / ch.teeth.length, e = (q + 1) / ch.teeth.length;
          c.lineTo(a.x + nx * w * (0.5 - m) - (dx / d) * ch.teeth[q], a.y + ny * w * (0.5 - m) - (dy / d) * ch.teeth[q]);
          c.lineTo(a.x + nx * w * (0.5 - e), a.y + ny * w * (0.5 - e));
        }
        c.closePath(); c.fill();
      }
    };
    const drawKnife = (c: CanvasRenderingContext2D, kx: number, ky: number, now: number) => {
      // the blade points from the limb out and up, the handle beyond it, off the orange's face
      const s = g.sideShown;
      c.save(); c.translate(kx, ky); c.scale(s, 1); c.rotate(-0.35 - 0.3 * (1 - Math.abs(knifeLat()) / CAP));
      const bl = L.R * 0.42;
      c.fillStyle = COL.blade; c.beginPath(); c.moveTo(-4, 0); c.lineTo(bl, -7); c.lineTo(bl, 4); c.closePath(); c.fill();
      const gl = (now % 3000) / 3000, glint = g.reduced ? 0.4 : 0.35 + 0.65 * Math.max(0, 1 - Math.abs(gl - 0.1) * 12);
      c.strokeStyle = `rgba(255,255,255,${glint})`; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(-3, 0.5); c.lineTo(bl, 4); c.stroke();
      c.fillStyle = COL.handle; c.beginPath(); c.roundRect(bl, -9, 46, 15, 5); c.fill();
      c.restore();
    };

    // ---------- frame ----------
    let last = performance.now(), raf = 0, hudAt = 0;
    const midPt = (p: Peel, j: number) => {
      const la = ((upAt(p, j) + p.cut[j]) / 2) * DEG, lo = knifeLon(p, j) * DEG;
      return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
    };
    const tear = (now: number, om: number) => {
      const p: Peel = g.p, j = p.cut.length - 1, info = tearName(p, world, j);
      p.tears.push(info);
      log('tear', { j, where: info.where, om: +om.toFixed(2), w: +g.w.toFixed(1), paleMs: g.paleAt ? Math.round(now - g.paleAt) : 0 });
      setToast(info.toast); g.toastUntil = now + 1600;
      if (g.chain) {
        const old: Chain = g.chain; old.pinned = false; old.age = 0;
        const r = mulberry32(j * 31 + 7); old.teeth = [0, 0, 0].concat(r() > 0.5 ? [0] : []).map(() => 3 + r() * 5);
        // recoil: the free end jumps up about 20 px over 80 ms, then the piece falls
        if (!g.reduced) for (let i = 0; i < 6; i++) old.nodes[i].py = old.nodes[i].y + 4.2 * (1 - i / 6);
        g.fallen.push(old);
      }
      const [kx, ky] = knifePos(); g.chain = newChain(kx, ky);
      g.pieceStartLen = g.len; g.T = 0; g.cool = 0.5; g.paleAt = 0;
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now; g.frames++;
      g.sideShown += (g.side - g.sideShown) * (1 - Math.exp(-dt / 0.06));
      if (g.phase === 'idle') {
        if (!g.reduced) g.spin += 6 * dt;
        g.idleT += dt;
        if (g.idleT > 8) setHint((h) => (h === COPY.idle ? COPY.nudge : h));
      }
      if (g.phase === 'peel') {
        g.t = now - g.t0;
        const p: Peel = g.p;
        if (g.key) g.phi += KEY_TURN * 2 * Math.PI * dt;
        if (g.keyW) { const nw = clamp(g.w + g.keyW * KEY_WIDTH * dt, W_MIN, W_MAX); g.dwAcc += Math.abs(nw - g.w); g.w = nw; }
        if (g.dragging || g.key) {
          const inst = (g.phi - g.phiPrev) / Math.max(dt, 1e-3);
          g.omega = g.omega * 0.55 + inst * 0.45;
        } else if (g.reduced) {
          g.omega = 0;
        } else {
          g.phi += g.omega * dt; g.omega *= Math.exp(-dt / INERTIA);
        }
        g.phiPrev = g.phi;
        const target = Math.floor(g.phi / DPHI);
        let pushed = 0;
        while (p.cut.length <= target && !p.done && pushed < 600) {
          pushSample(p, g.w); pushed++;
          const j = p.cut.length - 1;
          if (j > 0) { const a = midPt(p, j - 1), b = midPt(p, j); g.len += Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }
        }
        if (p.done || pushed >= 600) g.phi = Math.min(g.phi, p.cut.length * DPHI);
        g.spin = p.lon0 + p.dir * (Math.min(g.phi, p.cut.length * DPHI) / DEG) - g.side * KNIFE_OFF;
        const tt = 25 * clamp(knifeLat() / CAP, -1, 1);
        g.tilt += (tt - g.tilt) * (1 - Math.exp(-dt / 0.13));
        // tension
        const om = Math.abs(g.omega) / (2 * Math.PI);
        const dwdt = g.dwAcc / Math.max(dt, 1e-3); g.dwAcc = 0;
        if (g.cool > 0) g.cool -= dt;
        else g.T += (TA * Math.max(0, om / omegaSafe(g.w) - 1) + TB * dwdt - TC * g.T) * dt;
        g.T = clamp(g.T, 0, 1);
        if (g.T > 0.4 && !g.paleAt) g.paleAt = now;
        if (g.T < 0.2) g.paleAt = 0;
        g.maxT = Math.max(g.maxT, g.T);
        if (g.T >= 1 && p.cut.length > 40 && !p.done) tear(now, om);
        // hints
        if (!g.turnHinted && g.phi > 2 * Math.PI) {
          g.turnHinted = true;
          if (!g.widthHinted) { g.widthHinted = true; setHint(COPY.width); setTimeout(() => setHint((h) => (h === COPY.width ? '' : h)), 3000); }
          else setHint((h) => (h === COPY.idle || h === COPY.nudge ? '' : h));
        }
        if (!g.dragging && !g.key && Math.abs(g.omega) < 0.05) { g.stillT += dt; if (g.stillT > 6) setHint((h) => (h === COPY.stalled ? h : COPY.stalled)); }
        else { if (g.stillT > 6) setHint(''); g.stillT = 0; }
        if (now > hudAt) { hudAt = now + 100; setHud({ cm: Math.round(g.len * ORANGE_CM), pieces: p.tears.length + 1 }); }
        if (g.toastUntil && now > g.toastUntil) { g.toastUntil = 0; setToast(''); }
        if (p.done) {
          g.phase = 'finish'; g.finishAt = now; g.key = 0; log('finish'); setPhase('finish'); setHint(''); setToast(COPY.bottom); g.toastUntil = now + 600;
          if (g.chain) { g.chain.pinned = false; g.fallen.push(g.chain); g.chain = null; }
          g.secs = Math.round(g.t / 1000);
          g.res = analyze(p, world, g.secs);
        }
      }
      if (g.phase === 'finish') {
        const e = now - g.finishAt;
        g.slide = clamp((e - 600) / 400, 0, 1);
        if (g.toastUntil && now > g.toastUntil) { g.toastUntil = 0; setToast(''); }
        if (e > 1000) showResult(now, false);
      }
      // the orange
      if (orange && g.phase !== 'result') {
        orange.draw(g.spin, g.tilt, g.p);
        glc.style.transform = g.slide ? `translateX(${-g.slide * (L.cx + L.R + 20)}px)` : '';
      }
      // fg: knife, hanging peel, fallen pieces
      const c = fg.getContext('2d')!; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, L.W, L.H);
      if (g.phase === 'result') { drawUncurl(now); return; }
      if (!orange) return;
      const [kx, ky] = knifePos();
      for (const ch of g.fallen as Chain[]) { if (ch.age < 3) { stepChain(ch, dt, 0, 0, 0); ch.age += dt; } drawChain(c, ch, 0, now, false); }
      if (g.phase === 'peel') {
        if (!g.chain && g.p.cut.length > 2) g.chain = newChain(kx, ky);
        const ch: Chain | null = g.chain;
        if (ch) {
          const pieceLen = (g.len - g.pieceStartLen) * L.R;
          ch.seg = clamp(pieceLen / 47, 0.3, 8);
          ch.nodes[0].w = g.w * DEG * L.R * 0.75;
          for (let i = ch.nodes.length - 1; i > 0; i--) ch.nodes[i].w += (ch.nodes[i - 1].w - ch.nodes[i].w) * Math.min(1, Math.abs(g.omega) * dt * 3);
          stepChain(ch, dt, kx, ky, g.side);
          drawChain(c, ch, g.T, now, true);
        }
      }
      if (g.phase === 'idle' || g.phase === 'peel') drawKnife(c, kx, ky, now);
    };

    // ---------- result ----------
    const showResult = (now: number, instant: boolean) => {
      g.phase = 'result'; g.uncurlAt = now; g.instant = instant; g.drawnFinal = false; g.capShown = false; finalFit = null;
      setPhase('result'); setRes(g.res); setShowCap(false); log('result', { instant });
      if (!g.shared) {
        try {
          const r: Res = g.res, b: Best | null = JSON.parse(localStorage.getItem(STORE_BEST) || 'null');
          const better = !b || r.pieces < b.pieces || (r.pieces === b.pieces && (r.pieces === 1 ? r.totalCm > b.cm : r.widest > b.widest));
          if (better) { const nb = { pieces: r.pieces, cm: r.totalCm, widest: r.widest }; localStorage.setItem(STORE_BEST, JSON.stringify(nb)); }
        } catch {}
      }
    };
    const drawUncurl = (now: number) => {
      const m = mapRef.current; if (!m) return;
      const e = now - g.uncurlAt;
      const W = m.clientWidth, H = m.clientHeight;
      if (!W || !H) return;
      if (!finalFit || m.width !== Math.round(W * dpr) || m.height !== Math.round(H * dpr)) {
        m.width = Math.round(W * dpr); m.height = Math.round(H * dpr);
        finalDev = develop(g.p, 0); finalFit = fitDev(finalDev, W, H, 16);
        boardImg = document.createElement('canvas'); boardImg.width = m.width; boardImg.height = m.height;
        const bc = boardImg.getContext('2d')!; bc.setTransform(dpr, 0, 0, dpr, 0, 0); drawBoard(bc, W, H, 5);
        g.drawnFinal = false;
      }
      if (g.drawnFinal) return;
      const c = m.getContext('2d')!; c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(boardImg!, 0, 0); c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const slow = !g.instant && !g.reduced;
      const UN = 1600;
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      if (slow && e < UN) {
        const coil = 1 - ease(e / UN);
        const d = develop(g.p, coil);
        const fit = fitDev(d, W, H, 16, finalFit!.sc, finalFit!.rot);
        drawRibbon(c, g.p, d, fit, world, { ink: 0, cell: 3 });
        return;
      }
      const inkA = slow ? clamp((e - UN) / 400, 0, 1) : 1, labA = slow ? clamp((e - UN - 400) / 300, 0, 1) : 1;
      drawRibbon(c, g.p, finalDev!, finalFit!, world, { ink: inkA, cell: 0.6 });
      drawCoins(c, finalDev!, finalFit!, 1);
      if (labA > 0) {
        drawLabels(c, g.p, finalDev!, finalFit!, world, [14, 20], 1, labA);
        drawTearLabels(c, g.p, finalDev!, finalFit!, W, H, mono, 14, 1, 3, labA);
      }
      if (labA >= 1) {
        g.drawnFinal = true;
        if (!g.capShown) { g.capShown = true; log('caption'); setShowCap(true); renderPng(); }
      }
    };

    // ---------- the card ----------
    const fitFont = (c: CanvasRenderingContext2D, s: string, family: string, px: number, min: number, maxW: number) => {
      let f = px; c.font = `${f}px ${family}`;
      while (f > min && c.measureText(s).width > maxW) { f -= 1; c.font = `${f}px ${family}`; }
      return f;
    };
    const drawCard = () => {
      const p: Peel = g.p, r: Res = g.res;
      const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350;
      const c = cv.getContext('2d')!;
      drawBoard(c, 1080, 1350, 5);
      c.textBaseline = 'alphabetic';
      c.fillStyle = COL.text; c.font = '72px m6x11plus, monospace'; c.fillText('PEEL', 48, 100);
      c.fillStyle = COL.text2; c.font = `26px ${mono}`; c.textAlign = 'right'; c.fillText('wiz.jock.pl', 1032, 96); c.textAlign = 'left';
      const d = develop(p, 0);
      c.save(); c.translate(40, 130);
      const fit = fitDev(d, 1000, 960, 30);
      drawRibbon(c, p, d, fit, world, { px: 2, cell: 1.2 });
      drawCoins(c, d, fit, 2);
      drawLabels(c, p, d, fit, world, [26, 40], 2);
      drawTearLabels(c, p, d, fit, 1000, 960, mono, 26, 2);
      c.restore();
      c.fillStyle = COL.text;
      [r.line1, r.l2, r.l3].filter(Boolean).forEach((s, i) => { fitFont(c, s, mono, 34, 22, 984); c.fillText(s, 48, 1150 + i * 48); });
      c.fillStyle = COL.text2; fitFont(c, statLine(r), mono, 24, 18, 984); c.fillText(statLine(r), 48, 1292);
      c.font = `24px ${mono}`; c.textAlign = 'right'; c.fillText(COPY.foot, 1032, 1326); c.textAlign = 'left';
      return cv;
    };
    const renderPng = async () => {
      try { await Promise.all([document.fonts.load('72px m6x11plus'), document.fonts.load(`34px ${mono}`)]); } catch {}
      const p = g.p;
      drawCard().toBlob((b) => { if (g.p === p) g.png = b; }, 'image/png');
    };
    g.exportPng = () => drawCard().toDataURL('image/png');
    g.fileName = () => `peel-${Math.round(g.res.totalCm)}cm-${g.res.pieces}.png`;
    g.link = () => `${location.origin}${location.pathname}?p=${encodeRun(g.p, g.secs)}`;
    g.again = () => {
      g.phase = 'idle'; g.p = null; g.idleT = 0; g.slide = 0; g.uncurlAt = 0; g.drawnFinal = false; g.capShown = false;
      g.fallen = []; g.chain = null; g.T = 0; g.tilt = 25; g.png = null; g.res = null; g.shared = false; finalFit = null; glc.style.transform = '';
      if (location.search) history.replaceState(null, '', location.pathname);
      setShared(false); setLinkText(''); setCopied(false);
      try { const b = JSON.parse(localStorage.getItem(STORE_BEST) || 'null'); if (b) setBest(b); } catch {}
      setPhase(orange ? 'idle' : 'error'); setRes(null); setShowCap(false); setHint(COPY.idle); setToast(''); setHud({ cm: 0, pieces: 1 });
      if (!orange) g.phase = 'error';
    };

    // ---------- a shared link opens straight to the card ----------
    const q = new URLSearchParams(location.search).get('p');
    if (q !== null) {
      const run = decodeRun(q, world);
      if (run) {
        g.p = run.p; g.secs = run.secs; g.shared = true; g.res = analyze(run.p, world, run.secs);
        setShared(true); log('shared', { samples: run.p.cut.length, tears: run.p.tears.length });
        showResult(performance.now(), true);
      } else {
        history.replaceState(null, '', location.pathname);
        setToast(COPY.bad); g.toastUntil = performance.now() + 3200; log('badlink');
        setTimeout(() => setToast((t) => (t === COPY.bad ? '' : t)), 3200);
      }
    }
    if (!g.shared) { if (orange) setPhase('idle'); else { g.phase = 'error'; setPhase('error'); } }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout); window.visualViewport?.removeEventListener('resize', layout);
      window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey);
      stage.removeEventListener('pointerdown', onDown); stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp); stage.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const save = async () => {
    const g = G.current; if (!g?.res) return;
    const name = g.fileName();
    const blob: Blob | null = g.png || (await new Promise<Blob | null>((ok) => { const u = g.exportPng(); fetch(u).then((r) => r.blob()).then(ok, () => ok(null)); }));
    if (!blob) return;
    const file = new File([blob], name, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
      try { await nav.share({ files: [file], title: 'Peel' }); return; } catch (e) { if ((e as Error)?.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const copy = async () => {
    const g = G.current; if (!g?.res) return;
    const link = g.link();
    let ok = false;
    try { await navigator.clipboard.writeText(link); ok = true; } catch {}
    if (ok) { setCopied(true); setLinkText(''); setTimeout(() => setCopied(false), 1500); }
    else setLinkText(link);
  };

  const D = 'min(calc(0.72 * min(100vw, 480px)), 38svh)';
  const live = phase === 'idle' || phase === 'peel' || phase === 'first';
  return (
    <main ref={rootRef} data-phase={phase} className="fixed inset-0 z-50 overflow-hidden overscroll-none bg-[#0d0a08] font-mono text-[#e8e2d9]">
      <style>{'@keyframes peelFade{from{opacity:0}to{opacity:1}}'}</style>
      <div className="mx-auto flex h-full max-w-[480px] flex-col">
        <header className="relative h-[96px] shrink-0 px-4 pt-3 sm:h-[124px]">
          <a href="/experiments/" className="absolute right-4 top-3 inline-flex min-h-11 items-center text-[14px] leading-none text-[#8c8378] hover:text-[#e8e2d9]">WIZ LAB</a>
          <h1 className="font-pixel text-[40px] leading-none sm:text-[56px]">{COPY.title}</h1>
          <p className="mt-1.5 pr-2 text-[14px] leading-[1.25] text-[#8c8378]">{COPY.sub}</p>
        </header>
        <div ref={stageRef} data-stage className="relative min-h-0 w-full flex-1 select-none overflow-hidden" style={{ touchAction: 'none' }}>
          {/* first paint: board, a CSS disc where the orange will be, the knife at the stem */}
          <div className="absolute inset-x-0 bottom-0 bg-[#15100c]" style={{ top: `calc(34px + ${D} + 80px)` }} aria-hidden />
          <canvas ref={bgRef} className="absolute inset-0 h-full w-full" aria-hidden />
          <div
            ref={discRef}
            className="absolute left-1/2 top-[34px] -translate-x-1/2 rounded-full"
            style={{ width: D, aspectRatio: '1 / 1', background: glOk ? 'transparent' : 'radial-gradient(circle at 35% 30%, #ffb35c, #f28c28 55%, #b8560f)' }}
            aria-hidden
          />
          {!mounted && (
            <svg className="absolute" style={{ left: `calc(50% + ${D} * 0.043)`, top: `calc(34px + ${D} * 0.062 - 70px)` }} width="120" height="80" viewBox="0 -70 120 80" aria-hidden>
              <g transform="rotate(-20.1)">
                <polygon points="-4,0 59,-7 59,4" fill="#c9d1d9" />
                <rect x="59" y="-9" width="46" height="15" rx="5" fill="#1f1a17" />
              </g>
            </svg>
          )}
          <canvas
            ref={glRef}
            role="img"
            aria-label="An orange with the world printed on it"
            className="absolute top-[34px]"
            style={{ width: D, height: 'auto', aspectRatio: '1 / 1', left: `calc(50% - ${D} / 2)`, visibility: glOk ? 'visible' : 'hidden' }}
          />
          <canvas ref={fgRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
          {phase === 'peel' && (
            <div className="pointer-events-none absolute left-4 top-1 text-[15px] tabular-nums" aria-hidden>
              {hud.cm} cm <span className="ml-3 text-[#8c8378]">{hud.pieces} {hud.pieces === 1 ? 'piece' : 'pieces'}</span>
            </div>
          )}
          <div aria-live="polite" className="pointer-events-none absolute inset-x-3 top-7 z-10 flex justify-center">
            {toast && <span className="rounded bg-black/75 px-3 py-2 text-center text-[14px] leading-snug">{toast}</span>}
          </div>
          {live && phase !== 'first' && (
            <div className="pointer-events-none absolute inset-x-4 text-center" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)' }}>
              {hint && <p className="text-[14px] text-[#e8e2d9]">{hint}</p>}
              {phase === 'idle' && best && <p className="mt-2 text-[14px] text-[#8c8378]">{bestLine(best)}</p>}
            </div>
          )}
          {phase === 'first' && (
            <p className="pointer-events-none absolute inset-x-4 text-center text-[14px]" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)' }}>{COPY.idle}</p>
          )}
          {phase === 'error' && (
            <p className="absolute inset-x-6 text-center text-[15px]" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>{COPY.noGl}</p>
          )}
          {phase === 'result' && res && (
            <div className="absolute inset-0 flex flex-col bg-[#0d0a08] px-4" style={{ touchAction: 'auto' }}>
              {shared && <p className="pt-1 text-[15px]">{COPY.shared}</p>}
              <div className="relative mt-2 min-h-0 max-h-[560px] flex-1">
                <canvas
                  ref={mapRef}
                  role="img"
                  aria-label={`The peel laid flat as a map. ${res.line1} ${res.l2} ${res.l3}`}
                  className="absolute inset-0 h-full w-full rounded"
                  style={{ animation: reduced && !shared ? 'peelFade 300ms ease-out both' : undefined }}
                />
              </div>
              <div className={`mt-3 transition-opacity duration-200 ${showCap ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-[16px] leading-snug">{res.line1}</p>
                {res.l2 && <p className="text-[16px] leading-snug">{res.l2}</p>}
                {res.l3 && <p className="text-[16px] leading-snug">{res.l3}</p>}
                <p className="mt-1 text-[14px] text-[#8c8378]">{statLine(res)}</p>
                {linkText && <input readOnly value={linkText} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full rounded border border-[#8c8378] bg-[#15100c] px-2 py-1 text-[14px]" aria-label="Link to this peel" />}
              </div>
              <div className="mt-3 flex gap-2" style={{ marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
                <button onClick={save} className="h-12 flex-1 rounded border border-[#8c8378] text-[14px]">Save the PNG</button>
                <button onClick={copy} className="h-12 flex-1 rounded border border-[#8c8378] text-[14px]" aria-live="polite">{copied ? 'Copied.' : 'Copy link'}</button>
                <button onClick={() => G.current?.again()} className="h-12 flex-1 rounded bg-[#f28c28] text-[14px] font-bold text-[#0d0a08]">{shared ? 'Peel your own' : 'Peel another'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
