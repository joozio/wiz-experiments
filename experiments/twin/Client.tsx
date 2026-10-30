'use client';

import { useEffect, useRef, useState } from 'react';

// Twin. You draw a cat; a thousand real Quick, Draw! cats are re-ranked around your drawing,
// and the closest one is your twin. Everything runs here: each word's pool is a code-split JSON
// chunk of the site, loaded by dynamic import, and the drawing never leaves the page.

const INK = '#ece3cf', RED = '#ff4f2b', BG = '#0b0a09', HAIR = '#3a352d', DOT = '#2a2620', MUTED = '#7d766a';

type Word = { slug: string; noun: string; art: 'a' | 'the'; plural: string; foot: string };
const WORDS: Word[] = [
  { slug: 'cat', noun: 'cat', art: 'a', plural: 'cats', foot: 'Two cats, two strangers. Neither cat was consulted.' },
  { slug: 'face', noun: 'face', art: 'a', plural: 'faces', foot: 'You have never met. Your faces have.' },
  { slug: 'house', noun: 'house', art: 'a', plural: 'houses', foot: 'Same house. Nobody asked for planning permission.' },
  { slug: 'pig', noun: 'pig', art: 'a', plural: 'pigs', foot: 'It is a pig. You both knew it was a pig.' },
  { slug: 'snail', noun: 'snail', art: 'a', plural: 'snails', foot: 'Two snails in twenty seconds each. Faster than any snail.' },
  { slug: 'fish', noun: 'fish', art: 'a', plural: 'fish', foot: 'Two fish. Neither of you drew the water.' },
  { slug: 'tree', noun: 'tree', art: 'a', plural: 'trees', foot: 'Two trees. Not a single gardener involved.' },
  { slug: 'mona-lisa', noun: 'Mona Lisa', art: 'the', plural: 'Mona Lisas', foot: 'Leonardo took years. You two took twenty seconds.' },
];
const promptOf = (w: Word) => `Draw ${w.art} ${w.noun}.`;

const LOADERS: Record<string, () => Promise<unknown>> = {
  cat: () => import('./data/cat.json'),
  face: () => import('./data/face.json'),
  house: () => import('./data/house.json'),
  pig: () => import('./data/pig.json'),
  snail: () => import('./data/snail.json'),
  fish: () => import('./data/fish.json'),
  tree: () => import('./data/tree.json'),
  'mona-lisa': () => import('./data/mona-lisa.json'),
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const THE = new Set(['US', 'GB', 'NL', 'PH', 'AE', 'DO', 'CD', 'BS', 'GM', 'CF', 'KM', 'MV']);
// The rejection boundary is checked against held-out human drawings and geometric
// negative controls in experiments/weekly/2026-W44/repair/validate-matcher.cjs.
const T_NONE = 0.55;
const STORE = 'twin.v1';
const CLOCK_MS = 20000;
const PULL = 2400, HOLD = 700, RING = 250, LIFT = 500, REPLAY = 2400;
// The nearest 200 (bands 0 to 6) fly in from their hash-order cells while the camera is still
// close; everything else fades in place, outward by rank. After the fly-in the mosaic is never
// stroked live again: a 2x bitmap of the settled grid is blitted, and the outward fade is a
// radial mask (cells are ranked by distance, so a growing radius is the same fade).
const FLY_RANKS = 200, FLY_BANDS = 6, FLY_MS = 600, FLY_END = 300 + 1.5 * FLY_RANKS + FLY_MS;
const CACHE_AT = 300 + 1.5 * 1000 + 300;
const BAND = 32;
const PANEL_PAD = 0.096;

type Pt = [number, number];
type Strokes = Pt[][];
type Drawing = { cc: string; ym: number; st: Strokes; w: number; h: number };
type Feat = { R: Float32Array; F: Float32Array; ink: number; k: number };
type Stat = { strokes: number; firstBiggest: boolean; firstClosed: boolean; ink: number };
type StatLine = { key: string; rar: number; line: string };
type Ranked = [number, number][];
type Rect = { x: number; y: number; s: number };
type Cam = { z: number; tx: number; ty: number };
type Cell = { c: number; r: number; d: number; a: number };
type Grid = { cols: number; rows: number; cell: number; ox: number; oy: number; cc: number; cr: number; cells: Cell[] };
type Band = { path: Path2D; alpha: number; start: number };
type Flyer = { from: Cell; to: Cell; path: Path2D; alpha: number; start: number };
type Mosaic = { L: Grid; bands: Band[]; flyers: Flyer[]; dots: Path2D; me: Path2D; twin: Path2D; twinCell: Cell; cache: HTMLCanvasElement | null; big: HTMLCanvasElement | null; bigS: number; c1: Cam; lwCap: number };
type Twin = { ti: number; ts: number; none: boolean; nnnn: string; country: string; month: string; tag: string; head: string; line: string; copy: string };
type Layout = {
  W: number; H: number; land: boolean; compact: boolean;
  sq: Rect; promptX: number; promptY: number; promptW: number; clockY: number;
  ctrlX: number; ctrlY: number; ctrlW: number; ctrlCol: boolean;
  pa: Rect; pb: Rect; textX: number; textY: number; textW: number; textBottom: number;
  btnX: number; btnY: number; btnW: number; creditY: number;
  mos: { x: number; y: number; w: number; h: number }; pillY: number;
};

// ---------- layout ----------
// One function owns every position, so the drawing square, the mosaic, the lift targets and the
// DOM text all agree. Phone portrait is the design target (390 x 844); the SE (375 x 667) gets
// the compact column; desktop is a 480 column; a landscape phone puts the square on the left.
function layoutFor(W: number, H: number): Layout {
  const land = W > H && H < 560;
  if (land) {
    const s = Math.round(Math.min(H - 56, 358)), sq = { x: 16, y: 40, s };
    const rx = 16 + s + 32, rw = W - rx - 16;
    const P = Math.floor(Math.max(90, Math.min(171, (W / 2 - 48) / 2, H - 112)));
    const tx = 16 + 2 * P + 48;
    return {
      W, H, land, compact: true, sq, promptX: rx, promptY: 40, promptW: rw, clockY: sq.y + s + 8,
      ctrlX: rx, ctrlY: sq.y + s - 116, ctrlW: Math.min(rw, 260), ctrlCol: true,
      pa: { x: 16, y: 24, s: P }, pb: { x: 16 + P + 16, y: 24, s: P },
      textX: tx, textY: 24, textW: W - tx - 16, textBottom: H - 160, btnX: tx, btnY: H - 148, btnW: W - tx - 16, creditY: H - 28,
      mos: { x: 0, y: 40, w: W, h: H - 80 }, pillY: H - 34,
    };
  }
  const compact = H < 740;
  const colW = Math.min(W - 32, 480), colX = Math.round((W - colW) / 2);
  const promptY = compact ? 56 : 72, sqY = compact ? 148 : 176;
  const s = Math.round(Math.max(200, Math.min(colW, H - 108 - sqY)));
  const sq = { x: Math.round(colX + (colW - s) / 2), y: sqY, s };
  const ctrlY = Math.max(sqY + s + 40, H - 120);
  const P = Math.floor(Math.min((colW - 16) / 2, Math.max(110, H - 517)));
  const py = compact ? 48 : 64;
  const btnY = H - 168;
  const mosY = compact ? 72 : 100, mosH = Math.min(H - 200, compact ? H - 160 : 640 + Math.max(0, H - 844));
  return {
    W, H, land, compact, sq, promptX: colX, promptY, promptW: colW, clockY: sqY + s + 8,
    ctrlX: colX, ctrlY, ctrlW: colW, ctrlCol: false,
    pa: { x: colX, y: py, s: P }, pb: { x: colX + colW - P, y: py, s: P },
    textX: colX, textY: py + P + 8 + 32 + (compact ? 12 : 24), textW: colW, textBottom: btnY - 12,
    btnX: colX, btnY, btnW: colW, creditY: H - 32,
    mos: { x: 0, y: mosY, w: W, h: mosH }, pillY: mosY + mosH + 8,
  };
}
const FIRST_LAYOUT = layoutFor(390, 844);

// ---------- drawings and the metric ----------
function unpack(b64: string): Strokes {
  const s = atob(b64), out: Strokes = [];
  let i = 1;
  for (let k = 0; k < s.charCodeAt(0); k++) {
    const n = s.charCodeAt(i++), st: Pt[] = [];
    for (let j = 0; j < n; j++) { st.push([s.charCodeAt(i), s.charCodeAt(i + 1)]); i += 2; }
    out.push(st);
  }
  return out;
}
function boxOf(st: Strokes) {
  let w = 0, h = 0;
  for (const s of st) for (const [x, y] of s) { if (x > w) w = x; if (y > h) h = y; }
  return { w, h };
}
function rdp(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy);
  let best = -1, bi = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = L > 1e-9
      ? Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / L
      : Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
    if (d > best) { best = d; bi = i; }
  }
  if (best > eps) return [...rdp(pts.slice(0, bi + 1), eps).slice(0, -1), ...rdp(pts.slice(bi), eps)];
  return [pts[0], pts[pts.length - 1]];
}
// the dataset's own treatment: origin at the box minimum, longer side 255, resample at 1 unit, RDP 2
function normalise(strokes: Strokes): Strokes {
  const all = strokes.flat();
  const mx = Math.min(...all.map((p) => p[0])), my = Math.min(...all.map((p) => p[1]));
  const W = Math.max(...all.map((p) => p[0])) - mx, H = Math.max(...all.map((p) => p[1])) - my;
  const sc = 255 / Math.max(W, H, 1e-6);
  return strokes.map((st) => {
    const p: Pt[] = st.map(([x, y]) => [(x - mx) * sc, (y - my) * sc]);
    const r: Pt[] = [p[0]];
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i], d = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(d);
      for (let k = 1; k <= n; k++) r.push([x0 + ((x1 - x0) * k) / d, y0 + ((y1 - y0) * k) / d]);
      if (d - n > 1e-6) r.push([x1, y1]);
    }
    return rdp(r, 2).map(([x, y]) => [Math.max(0, Math.min(255, Math.round(x))), Math.max(0, Math.min(255, Math.round(y)))] as Pt);
  });
}
const KC: Record<number, number[]> = {};
function kern(sig: number) {
  if (KC[sig]) return KC[sig];
  const k: number[] = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) k.push(Math.exp(-(dx * dx + dy * dy) / (2 * sig * sig)));
  return (KC[sig] = k);
}
function raster(strokes: Strokes, G: number, sig: number) {
  const f = new Float32Array(G * G), k = kern(sig), all = strokes.flat();
  if (!all.length) return f;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of all) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const sc = (G - 4) / 256, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = G / 2;
  const splat = (gx: number, gy: number) => {
    const ix = Math.round(gx), iy = Math.round(gy);
    let q = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++, q++) {
      const X = ix + dx, Y = iy + dy;
      if (X >= 0 && Y >= 0 && X < G && Y < G) f[Y * G + X] += k[q];
    }
  };
  for (const st of strokes) {
    if (st.length === 1) { splat(h + (st[0][0] - cx) * sc, h + (st[0][1] - cy) * sc); continue; }
    for (let i = 1; i < st.length; i++) {
      const ax = h + (st[i - 1][0] - cx) * sc, ay = h + (st[i - 1][1] - cy) * sc;
      const bx = h + (st[i][0] - cx) * sc, by = h + (st[i][1] - cy) * sc;
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 0.5));
      for (let j = i === 1 ? 0 : 1; j <= n; j++) splat(ax + ((bx - ax) * j) / n, ay + ((by - ay) * j) / n);
    }
  }
  let s = 0;
  for (let i = 0; i < f.length; i++) s += f[i] * f[i];
  s = Math.sqrt(s) || 1;
  for (let i = 0; i < f.length; i++) f[i] /= s;
  return f;
}
// Cosine similarity forgets how much ink produced a raster. Keep normalized path
// length so dense hatching cannot earn a match by covering every possible contour.
const features = (st: Strokes): Feat => ({ R: raster(st, 32, 1), F: raster([st[0]], 16, 0.8), ink: st.reduce((total, stroke) => total + stroke.slice(1).reduce((length, p, i) => length + Math.hypot(p[0] - stroke[i][0], p[1] - stroke[i][1]), 0), 0), k: st.length });
const dotp = (a: Float32Array, b: Float32Array) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
const score = (a: Feat, b: Feat) => 0.7 * dotp(a.R, b.R) + 0.3 * dotp(a.F, b.F) - 0.02 * Math.min(Math.abs(a.k - b.k), 5) - 0.4 * Math.max(0, Math.abs(Math.log(Math.max(a.ink, 1) / Math.max(b.ink, 1))) - Math.log(1.25));
function rankAll(q: Feat, feats: Feat[]): Ranked {
  const s: Ranked = feats.map((p, i) => [i, score(q, p)]);
  s.sort((a, b) => b[1] - a[1]);
  return s;
}
const strokeLen = (st: Pt[]) => st.slice(1).reduce((b, p, i) => b + Math.hypot(p[0] - st[i][0], p[1] - st[i][1]), 0);
const inkOf = (strokes: Strokes) => strokes.reduce((a, st) => a + strokeLen(st), 0);
function statOf(strokes: Strokes): Stat {
  const areas = strokes.map((st) => {
    const xs = st.map((p) => p[0]), ys = st.map((p) => p[1]);
    return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
  });
  const f = strokes[0];
  return {
    strokes: strokes.length,
    firstBiggest: areas[0] >= Math.max(...areas),
    firstClosed: f.length > 2 && Math.hypot(f[0][0] - f[f.length - 1][0], f[0][1] - f[f.length - 1][1]) <= 31,
    ink: inkOf(strokes),
  };
}
// The two rarest of four stats, measured against the same pool, so "of them" is literally true.
function statLines(me: Stat, ps: Stat[]): StatLine[] {
  const n = ps.length, pc = (c: number) => (100 * c) / n;
  const ks = ps.map((s) => s.strokes).sort((a, b) => a - b), med = ks[Math.floor(n / 2)];
  const sameK = pc(ps.filter((s) => s.strokes === me.strokes).length);
  const fewer = pc(ps.filter((s) => s.strokes < me.strokes).length);
  const more = pc(ps.filter((s) => s.strokes > me.strokes).length);
  const fb = pc(ps.filter((s) => s.firstBiggest === me.firstBiggest).length);
  const fc = pc(ps.filter((s) => s.firstClosed === me.firstClosed).length);
  const below = pc(ps.filter((s) => s.ink < me.ink).length), above = pc(ps.filter((s) => s.ink > me.ink).length);
  const P = (p: number) => (p < 1 ? 'fewer than 1%' : `${Math.min(99, Math.round(p))}%`);
  let sl: string;
  if (me.strokes === 1) sl = `You did it in one line. So did ${P(sameK)} of them.`;
  else if (sameK >= 20) sl = `You used ${me.strokes} strokes, like ${P(sameK)} of them.`;
  else if (me.strokes > med) sl = `You used ${me.strokes} strokes. ${P(fewer)} of them got there in fewer.`;
  else sl = `You used ${me.strokes} strokes. ${P(more)} of them needed more.`;
  // a drawing past every other one says so plainly instead of printing 100%
  const inkLine = below >= 50
    ? (above === 0 ? 'You used more ink than all of them.' : `You used more ink than ${P(below)} of them.`)
    : (below === 0 ? 'You used less ink than all of them. Efficient.' : `You used less ink than ${P(above)} of them. Efficient.`);
  const out: StatLine[] = [
    { key: 'strokes', rar: sameK, line: sl },
    { key: 'firstBiggest', rar: fb, line: me.firstBiggest ? `Your first line was your biggest. Same for ${P(fb)} of them.` : `You saved your biggest line for later. Only ${P(fb)} of them did that.` },
    { key: 'firstClosed', rar: fc, line: me.firstClosed ? `Your first line closed on itself, like ${P(fc)} of them.` : `Your first line never closed. ${P(fc)} of them left it open too.` },
    { key: 'ink', rar: Math.min(below, above), line: inkLine },
  ];
  out.sort((a, b) => a.rar - b.rar);
  return out.slice(0, 2);
}
function countryName(cc: string) {
  let n = cc;
  try { n = new Intl.DisplayNames(['en'], { type: 'region' }).of(cc) || cc; } catch { n = cc; }
  return { line: (THE.has(cc) ? 'the ' : '') + n, tag: n.toUpperCase() };
}
const fmtN = (n: number) => n.toLocaleString('en-US');
// The single source for country and month: the tag, the twin line, the card and the Copy text
// all read from this, so they cannot disagree.
function describeTwin(word: Word, pool: Drawing[], ranked: Ranked, nq: Strokes): Twin {
  const [ti, ts] = ranked[0];
  const { cc, ym } = pool[ti];
  const y = Math.floor(ym / 100), m = (ym % 100) - 1, c = countryName(cc);
  let sum = 0;
  for (const st of nq) for (const [x, yy] of st) sum += 7 * x + 13 * yy;
  const nnnn = String((sum + 101 * ti) % 10000).padStart(4, '0');
  const none = ts < T_NONE, N = fmtN(pool.length);
  const monY = `${MONTHS[m].slice(0, 3).toUpperCase()} ${y}`;
  return {
    ti, ts, none, nnnn, country: c.line, month: `${MONTHS[m]} ${y}`,
    tag: none ? `CLOSEST: ${c.tag}, ${monY}` : `${c.tag}, ${monY}`,
    head: none ? 'No twin this time.' : `Twin ${nnnn}.`,
    line: none
      ? `Out of ${N} ${word.plural}, nobody drew one like yours. The closest came from ${c.line}, ${MONTHS[m]} ${y}. Take that how you like.`
      : `Out of ${N} ${word.plural}, this is the one drawn most like yours. A stranger in ${c.line}, ${MONTHS[m]} ${y}.`,
    copy: none
      ? `I drew ${word.art} ${word.noun}. No twin in this pool of ${N}. The closest drawing came from ${c.line}, ${MONTHS[m]} ${y}. wiz.jock.pl/experiments/twin`
      : `Twin ${nnnn}. I drew ${word.art} ${word.noun}. Out of ${N} strangers, the one who drew it most like me was in ${c.line}, ${MONTHS[m]} ${y}. wiz.jock.pl/experiments/twin`,
  };
}

// ---------- geometry and paths ----------
type Fit = { s: number; ox: number; oy: number };
// a 0..255 drawing centred in a box (x, y, side P) with pad as a fraction of P
function boxF(d: { w: number; h: number }, x: number, y: number, P: number, pad: number): Fit {
  const s = (P * (1 - 2 * pad)) / 256;
  return { s, ox: x + P * pad + ((255 - d.w) / 2) * s, oy: y + P * pad + ((255 - d.h) / 2) * s };
}
// strokes into a path; upto is how much ink to include, in source units
function addStrokes(p: Path2D, strokes: Strokes, f: Fit, upto = Infinity) {
  let left = upto;
  for (const st of strokes) {
    if (left <= 0) break;
    p.moveTo(f.ox + st[0][0] * f.s, f.oy + st[0][1] * f.s);
    if (st.length === 1) p.lineTo(f.ox + st[0][0] * f.s + 0.01, f.oy + st[0][1] * f.s);
    for (let i = 1; i < st.length; i++) {
      const [ax, ay] = st[i - 1], [bx, by] = st[i], d = Math.hypot(bx - ax, by - ay);
      if (d <= left) { p.lineTo(f.ox + bx * f.s, f.oy + by * f.s); left -= d; }
      else { const t = left / d; p.lineTo(f.ox + (ax + (bx - ax) * t) * f.s, f.oy + (ay + (by - ay) * t) * f.s); left = 0; break; }
    }
  }
  return p;
}
const pathOf = (strokes: Strokes, f: Fit, upto?: number) => addStrokes(new Path2D(), strokes, f, upto);
// Replay: ink visible at t ms. The whole drawing takes 2.4s at constant speed, with a pause
// between strokes of min(120, 1000 / (k - 1)) ms, so a 20 stroke drawing still fits.
function replayInk(strokes: Strokes, t: number, total = REPLAY) {
  const k = strokes.length, pause = k > 1 ? Math.min(120, 1000 / (k - 1)) : 0;
  const lens = strokes.map(strokeLen);
  const ink = lens.reduce((a, b) => a + b, 0) || 1, speed = ink / (total - pause * (k - 1));
  let el = 0, drawn = 0;
  for (let i = 0; i < k; i++) {
    const dur = lens[i] / speed;
    if (t < el + dur) return drawn + (t - el) * speed;
    drawn += lens[i]; el += dur;
    if (i < k - 1) { if (t < el + pause) return drawn; el += pause; }
  }
  return Infinity;
}
// N cells in an area; the centre cell is you, the rest ordered by distance then clockwise from 12
function gridFor(area: { x: number; y: number; w: number; h: number }, N = 1001): Grid {
  const { w: W, h: H } = area;
  const cols = Math.ceil(Math.sqrt((N * W) / H)), rows = Math.ceil(N / cols), cell = Math.min(W / cols, H / rows);
  const ox = area.x + (W - cols * cell) / 2, oy = area.y + (H - rows * cell) / 2;
  const cc = Math.floor(cols / 2), cr = Math.floor(rows / 2), cells: Cell[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (r === cr && c === cc) continue;
    const dx = c - cc, dy = r - cr;
    let a = Math.atan2(dx, -dy); if (a < 0) a += 2 * Math.PI;
    cells.push({ c, r, d: Math.hypot(dx, dy), a });
  }
  cells.sort((p, q) => p.d - q.d || p.a - q.a);
  return { cols, rows, cell, ox, oy, cc, cr, cells };
}
// The halo falls with distance from your cell, not linearly with rank: full inside the first
// ring, 0.5 by ring 6, about 0.15 at the far edge.
const alphaAt = (d: number) => (d <= 1.5 ? 1 : 0.15 + 0.85 * Math.exp(-0.1972 * (d - 1.5)));
function buildMosaic(L: Grid, pool: Drawing[], ranked: Ranked, me: Drawing): Mosaic {
  const pad = 1.5 / L.cell, n = ranked.length;
  const nb = 1 + Math.ceil((n - 8) / BAND);
  const bandOf = (k: number) => (k < 8 ? 0 : 1 + Math.floor((k - 8) / BAND));
  const bands: Band[] = [];
  for (let b = 0; b < nb; b++) {
    const lo = b === 0 ? 0 : 8 + BAND * (b - 1), hi = b === 0 ? 8 : Math.min(n, 8 + BAND * b);
    let d = 0;
    for (let k = lo; k < hi; k++) d += L.cells[k].d;
    bands.push({ path: new Path2D(), alpha: alphaAt(d / Math.max(1, hi - lo)), start: 300 + 1.5 * ((lo + hi + 1) / 2) });
  }
  const flyers: Flyer[] = [];
  ranked.forEach(([i], k) => {
    const cell = L.cells[k];
    if (!cell) return;
    if (k > 0) addStrokes(bands[bandOf(k)].path, pool[i].st, boxF(pool[i], cell.c, cell.r, 1, pad));
    if (k < FLY_RANKS) flyers.push({ from: L.cells[i], to: cell, path: pathOf(pool[i].st, boxF(pool[i], 0, 0, 1, pad)), alpha: bands[bandOf(k)].alpha, start: 300 + 1.5 * (k + 1) });
  });
  const dots = new Path2D();
  for (let k = n; k < L.cells.length; k++) { const c = L.cells[k]; dots.rect(c.c + 0.5 - 0.5 / L.cell, c.r + 0.5 - 0.5 / L.cell, 1 / L.cell, 1 / L.cell); }
  return {
    L, bands, flyers, dots, me: pathOf(me.st, boxF(me, L.cc, L.cr, 1, pad)), twin: flyers[0].path, twinCell: L.cells[0],
    cache: null, big: null, bigS: 1, c1: { z: L.cell, tx: 0, ty: 0 }, lwCap: 1,
  };
}

// ---------- the card: 1080 x 1350, every font size 32px or more ----------
function wrap(g: CanvasRenderingContext2D, txt: string, w: number) {
  const out: string[] = [];
  let cur = '';
  for (const word of txt.split(' ')) {
    const t = cur ? cur + ' ' + word : word;
    if (g.measureText(t).width > w && cur) { out.push(cur); cur = word; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}
function renderCard(M: Mosaic, me: Drawing, twin: Drawing, tw: Twin, stats: StatLine[], word: Word, mono: string) {
  const cv = document.createElement('canvas');
  cv.width = 1080; cv.height = 1350;
  const g = cv.getContext('2d')!;
  const L = M.L, pixel = 'm6x11plus, monospace';
  g.fillStyle = BG; g.fillRect(0, 0, 1080, 1350);
  // the mosaic, cropped round your cell at 54px a cell, full halo, your cell between the panels
  const s = 54, cx = 540 - (L.cc + 0.5) * s, cy = 260 - (L.cr + 0.5) * s;
  g.save(); g.beginPath(); g.rect(0, 0, 1080, 500); g.clip();
  g.setTransform(s, 0, 0, s, cx, cy);
  g.lineWidth = 2 / s; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = INK;
  M.bands.forEach((b) => { g.globalAlpha = b.alpha; g.stroke(b.path); });
  g.globalAlpha = 1; g.fillStyle = DOT; g.fill(M.dots);
  g.setTransform(s, 0, 0, s, cx + M.twinCell.c * s, cy + M.twinCell.r * s); g.stroke(M.twin);
  g.setTransform(s, 0, 0, s, cx, cy);
  g.strokeStyle = RED; g.lineWidth = 3 / s; g.shadowColor = 'rgba(255,79,43,0.35)'; g.shadowBlur = 8;
  g.stroke(M.me);
  g.restore();
  // the mosaic ends above the tags, so they sit on paper, not on cream cats
  const fade = g.createLinearGradient(0, 440, 0, 500);
  fade.addColorStop(0, 'rgba(11,10,9,0)'); fade.addColorStop(1, BG);
  g.fillStyle = fade; g.fillRect(0, 440, 1080, 60);
  const panel = (x: number, d: Drawing, col: string, tag: string) => {
    g.globalAlpha = 0.92; g.fillStyle = BG; g.fillRect(x, 40, 440, 440); g.globalAlpha = 1;
    g.strokeStyle = HAIR; g.lineWidth = 2; g.lineCap = 'butt';
    for (const [a, b, dx, dy] of [[x, 40, 1, 1], [x + 440, 40, -1, 1], [x, 480, 1, -1], [x + 440, 480, -1, -1]]) {
      g.beginPath(); g.moveTo(a + 30 * dx, b); g.lineTo(a, b); g.lineTo(a, b + 30 * dy); g.stroke();
    }
    g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
    g.stroke(pathOf(d.st, boxF(d, x + 30, 70, 380, 0)));
    g.fillStyle = INK; g.font = `36px ${pixel}`; g.textBaseline = 'top';
    wrap(g, tag, 440).slice(0, 2).forEach((ln, i) => g.fillText(ln, x, 504 + i * 40));
  };
  panel(60, me, RED, 'YOU, TODAY');
  panel(580, twin, INK, tw.tag);
  g.textBaseline = 'top';
  let y = 624;
  g.fillStyle = INK; g.font = `72px ${pixel}`; g.fillText(tw.head, 60, y); y += 96;
  const LIMIT = 1350 - 108 - 16;
  const fits = (t: string, px: number) => { g.font = `${px}px ${mono}`; return y + wrap(g, t, 960).length * px * 1.3 <= LIMIT; };
  const body = (t: string, px: number, col: string) => {
    g.font = `${px}px ${mono}`; g.fillStyle = col;
    for (const ln of wrap(g, t, 960)) { g.fillText(ln, 60, y); y += px * 1.3; }
    y += 16;
  };
  body(tw.line, 40, INK);
  // on overflow drop the footer, then the second stat; never shrink
  const s1 = stats[0].line, s2 = stats[1]?.line;
  if (fits(s1, 36)) body(s1, 36, INK);
  if (s2 && fits(s2, 36)) {
    body(s2, 36, INK);
    const foot = tw.none ? 'No twin in this pool. Your drawing stands alone.' : word.foot;
    if (fits(foot, 36)) body(foot, 36, MUTED);
  }
  g.font = `32px ${mono}`; g.fillStyle = MUTED; g.textAlign = 'left';
  g.fillText('Drawings from Quick, Draw! by Google, CC BY 4.0.', 60, 1350 - 108);
  g.textAlign = 'right'; g.fillText('wiz.jock.pl/experiments/twin', 1020, 1350 - 60);
  return cv;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // close to cubic-bezier(0.65,0,0.35,1)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpR = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t) });
type Idle = (cb: () => void, o?: { timeout: number }) => number;
const idle = (cb: () => void) => {
  const ric = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback;
  if (ric) ric(cb, { timeout: 60 }); else setTimeout(cb, 16);
};

type Phase = 'rest' | 'input' | 'running' | 'error' | 'pullback' | 'hold' | 'ring' | 'lift' | 'replay' | 'result' | 'leaving';
type Res = { tw: Twin; stats: StatLine[]; word: Word };
type State = {
  phase: Phase; wi: number; word: Word; strokes: Strokes; cur: Pt[] | null; t0: number; touched: boolean;
  pool: Drawing[] | null; feats: Feat[] | null; pstats: Stat[] | null; ready: boolean; loadErr: boolean;
  readyP: Promise<boolean> | null; years: string;
  ghost: { d: Drawing; a: number; ink: number } | null; ghosts: number;
  nq: Strokes | null; meD: Drawing | null; twinD: Drawing | null; ranked: Ranked | null; tw: Twin | null; stats: StatLine[] | null; M: Mosaic | null;
  lay: Layout; reduced: boolean; mono: string; timers: number[]; raf: number;
  log: [number, string][]; frames: number[]; rankMs: number; featMs: number; copied: string; cardBytes: number;
};

export default function Client() {
  const mainRef = useRef<HTMLElement>(null), bgRef = useRef<HTMLCanvasElement>(null), sqRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLDivElement>(null), textRef = useRef<HTMLDivElement>(null);
  const [wi, setWi] = useState(0);
  const [shown, setShown] = useState(false);
  const [phase, setPhase] = useState<Phase>('rest');
  const [hasStroke, setHasStroke] = useState(false);
  const [cap, setCap] = useState('');
  const [pill, setPill] = useState('');
  const [res, setRes] = useState<Res | null>(null);
  const [nLines, setNLines] = useState(0);
  const [drop, setDrop] = useState(0);
  const [fb, setFb] = useState('');
  const [last, setLast] = useState('');
  const [lay, setLay] = useState<Layout>(FIRST_LAYOUT);
  const [promptPx, setPromptPx] = useState(40);
  const S = useRef<State | null>(null);
  if (!S.current) {
    S.current = {
      phase: 'rest', wi: 0, word: WORDS[0], strokes: [], cur: null, t0: 0, touched: false,
      pool: null, feats: null, pstats: null, ready: false, loadErr: false, readyP: null, years: '2017',
      ghost: null, ghosts: 0, nq: null, meD: null, twinD: null, ranked: null, tw: null, stats: null, M: null,
      lay: FIRST_LAYOUT, reduced: false, mono: 'monospace', timers: [], raf: 0,
      log: [], frames: [], rankMs: 0, featMs: 0, copied: '', cardBytes: 0,
    };
  }
  const g = S.current;
  const word = WORDS[wi];
  const go = (p: Phase) => { g.phase = p; setPhase(p); g.log.push([Math.round(performance.now()), p]); };
  const later = (fn: () => void, ms: number) => { g.timers.push(window.setTimeout(fn, ms)); };

  // ---------- canvases ----------
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  function sizeCanvases() {
    const d = dpr(), bg = bgRef.current, s = sqRef.current;
    if (!bg || !s) return;
    bg.width = Math.round(g.lay.W * d); bg.height = Math.round(g.lay.H * d);
    s.width = Math.round(g.lay.sq.s * d); s.height = Math.round(g.lay.sq.s * d);
  }
  function drawSq() {
    const c = sqRef.current;
    if (!c) return;
    const x = c.getContext('2d')!, d = dpr(), S0 = g.lay.sq.s;
    x.setTransform(d, 0, 0, d, 0, 0);
    x.clearRect(0, 0, S0, S0);
    x.lineCap = 'round'; x.lineJoin = 'round';
    if (g.ghost && g.ghost.a > 0) {
      // the idle ghost: a pool drawing picked deterministically after mount, line 3px, alpha 0.18
      const gd = g.ghost.d;
      x.globalAlpha = 0.18 * g.ghost.a; x.strokeStyle = INK; x.lineWidth = 3;
      x.stroke(pathOf(gd.st, boxF(gd, 0, 0, S0, 0.12), g.ghost.ink));
    }
    x.globalAlpha = 1; x.strokeStyle = RED; x.lineWidth = 4;
    for (const st of g.strokes) {
      x.beginPath(); x.moveTo(st[0][0], st[0][1]);
      if (st.length === 1) x.lineTo(st[0][0] + 0.01, st[0][1]);
      for (const p of st.slice(1)) x.lineTo(p[0], p[1]);
      x.stroke();
    }
  }
  const bg = () => bgRef.current!.getContext('2d')!;
  const clearBg = (x: CanvasRenderingContext2D) => { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.clearRect(0, 0, x.canvas.width, x.canvas.height); };

  // ---------- data ----------
  function load(idx: number) {
    g.ready = false; g.loadErr = false; g.pool = null; g.feats = null; g.pstats = null;
    const slug = WORDS[idx].slug;
    const p = LOADERS[slug]().then((m) => {
      if (g.wi !== idx) return false;
      const file = ((m as { default?: unknown }).default ?? m) as { d: [string, number, string][] };
      const pool: Drawing[] = file.d.map((r) => { const st = unpack(r[2]); return { cc: r[0], ym: r[1], st, ...boxOf(st) }; });
      const ys = pool.map((p) => Math.floor(p.ym / 100)), y0 = Math.min(...ys), y1 = Math.max(...ys);
      g.years = y0 === y1 ? String(y0) : `${y0} and ${y1}`;
      g.pool = pool; g.pstats = pool.map((d) => statOf(d.st));
      const feats: Feat[] = new Array(pool.length);
      let k = 0;
      const t0 = performance.now();
      return new Promise<boolean>((done) => {
        const step = () => {
          if (g.wi !== idx) { done(false); return; }
          const end = Math.min(pool.length, k + 100);
          for (; k < end; k++) feats[k] = features(pool[k].st);
          if (k < pool.length) idle(step);
          else { g.feats = feats; g.ready = true; g.featMs = performance.now() - t0; done(true); }
        };
        idle(step);
      });
    }).catch(() => { if (g.wi === idx) g.loadErr = true; return false; });
    g.readyP = p;
    return p;
  }

  // ---------- mount ----------
  useEffect(() => {
    (window as unknown as { __twin: State }).__twin = g;
    g.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    g.mono = (mainRef.current && getComputedStyle(mainRef.current).fontFamily) || 'monospace';
    let idx = 0;
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (s && typeof s.next === 'number') { idx = ((s.next % WORDS.length) + WORDS.length) % WORDS.length; if (typeof s.lastCountry === 'string') setLast(s.lastCountry); }
    } catch {}
    g.wi = idx; g.word = WORDS[idx]; setWi(idx);
    measure();
    requestAnimationFrame(() => setShown(true));
    load(idx);
    if (!g.reduced) idleGhost();
    const onR = () => measure();
    // a stroke whose pointerup lands outside the square (no capture) must still end
    const onUpAny = () => { g.cur = null; };
    window.addEventListener('pointerup', onUpAny);
    window.addEventListener('pointercancel', onUpAny);
    window.addEventListener('resize', onR);
    window.visualViewport?.addEventListener('resize', onR);
    return () => {
      window.removeEventListener('pointerup', onUpAny);
      window.removeEventListener('pointercancel', onUpAny);
      window.removeEventListener('resize', onR);
      window.visualViewport?.removeEventListener('resize', onR);
      g.timers.forEach(clearTimeout); cancelAnimationFrame(g.raf);
    };
    // mount only: everything here reads the mutable state object, not React state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function measure() {
    const m = mainRef.current, vv = window.visualViewport;
    const W = Math.round(m?.clientWidth || window.innerWidth);
    const H = Math.round(Math.min(m?.clientHeight || window.innerHeight, vv ? vv.height : Infinity));
    const old = g.lay;
    if (old.W === W && old.H === H && bgRef.current?.width === Math.round(W * dpr())) return;
    const L = layoutFor(W, H);
    // strokes live in square pixels, so a resized square scales them with it
    if (g.strokes.length && L.sq.s !== old.sq.s) { const k = L.sq.s / old.sq.s; g.strokes = g.strokes.map((st) => st.map(([x, y]) => [x * k, y * k] as Pt)); }
    g.lay = L; setLay(L);
    sizeCanvases(); drawSq();
    if (g.phase === 'result' && g.pool && g.ranked && g.meD) { g.M = buildMosaic(gridFor(L.mos), g.pool, g.ranked, g.meD); cacheMosaic(g.M); paintResult(); }
  }

  // fit the prompt on one line; "Draw the Mona Lisa." is wider than a 358px column at 40px
  useEffect(() => {
    let off = false;
    const fit = () => {
      const c = document.createElement('canvas').getContext('2d');
      if (!c) return;
      c.font = '40px m6x11plus';
      const w = c.measureText(promptOf(word)).width;
      if (!off) setPromptPx(w > lay.promptW ? Math.max(24, Math.floor((40 * lay.promptW) / w)) : 40);
    };
    if (document.fonts) document.fonts.load('40px m6x11plus').then(fit, fit); else fit();
    return () => { off = true; };
  }, [word, lay.promptW]);

  // the result text never scrolls: if it overflows, drop the footer, then the second stat
  useEffect(() => {
    const el = textRef.current;
    if (!el || !res) return;
    if (el.scrollHeight > lay.textBottom - lay.textY + 1 && drop < 2) setDrop(drop + 1);
  }, [res, lay, drop]);

  // ---------- idle ghost ----------
  function idleGhost() {
    const tryGhost = () => {
      if (g.touched || g.ghosts >= 3 || g.phase !== 'rest') return;
      if (!g.ready || !g.pool) { later(tryGhost, 500); return; }
      const d = g.pool[(g.ghosts * 337 + 101) % g.pool.length];
      g.ghost = { d, a: 1, ink: 0 }; g.ghosts++;
      const tot = inkOf(d.st), st = performance.now();
      const f = (now: number) => {
        if (!g.ghost || g.touched) { g.ghost = null; drawSq(); return; }
        const e = now - st, ink = replayInk(d.st, e);
        g.ghost.ink = ink === Infinity ? tot : ink;
        g.ghost.a = e < 3000 ? 1 : Math.max(0, 1 - (e - 3000) / 400);
        drawSq();
        if (e < 3400) requestAnimationFrame(f); else { g.ghost = null; drawSq(); later(tryGhost, 10000 - 3400); }
      };
      requestAnimationFrame(f);
    };
    later(tryGhost, 6000);
  }

  // ---------- input ----------
  const locked = () => !(g.phase === 'rest' || g.phase === 'input');
  function pt(e: React.PointerEvent): Pt {
    const r = sqRef.current!.getBoundingClientRect(), s = g.lay.sq.s;
    return [Math.max(0, Math.min(s, e.clientX - r.left)), Math.max(0, Math.min(s, e.clientY - r.top))];
  }
  function onDown(e: React.PointerEvent) {
    if (locked() || g.cur) return;
    e.preventDefault();
    // synthetic pointers throw here; a real finger gets capture, so a stroke that leaves the
    // square keeps drawing along its edge instead of ending
    try { sqRef.current!.setPointerCapture(e.pointerId); } catch {}
    g.touched = true; g.ghost = null;
    if (g.phase === 'rest') { go('input'); g.t0 = performance.now(); clockLoop(); }
    g.cur = [pt(e)]; g.strokes.push(g.cur); setHasStroke(true); drawSq();
  }
  function onMove(e: React.PointerEvent) {
    if (!g.cur || locked()) return;
    const p = pt(e), l = g.cur[g.cur.length - 1];
    if (Math.hypot(p[0] - l[0], p[1] - l[1]) >= 2) { g.cur.push(p); drawSq(); }
  }
  function onUp() { g.cur = null; }
  function undo() {
    if (locked()) return;
    g.cur = null; g.strokes.pop(); drawSq(); setHasStroke(g.strokes.length > 0);
  }
  function clockLoop() {
    const f = (now: number) => {
      if (g.phase !== 'input') return;
      const rem = Math.max(0, 1 - (now - g.t0) / CLOCK_MS);
      if (clockRef.current) { clockRef.current.style.transform = `scaleX(${rem})`; clockRef.current.style.background = rem < 0.25 ? RED : 'rgba(236,227,207,0.4)'; }
      if (rem <= 0) {
        g.cur = null;
        if (g.strokes.length) finish();
        else { go('rest'); resetClock(); }
        return;
      }
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  function resetClock() { if (clockRef.current) { clockRef.current.style.transform = 'scaleX(1)'; clockRef.current.style.background = 'rgba(236,227,207,0.4)'; } }
  function flashCap(t: string, ms: number) { setCap(t); later(() => setCap((c) => (c === t ? '' : c)), ms); }

  // ---------- done ----------
  async function finish() {
    if (g.phase !== 'input') return;
    g.cur = null;
    const all = g.strokes.flat();
    const W = Math.max(...all.map((p) => p[0])) - Math.min(...all.map((p) => p[0]));
    const H = Math.max(...all.map((p) => p[1])) - Math.min(...all.map((p) => p[1]));
    if (Math.max(W, H) < 24 || inkOf(g.strokes) < 40) {
      g.strokes = []; drawSq(); setHasStroke(false); go('rest'); resetClock();
      flashCap(`That is a dot. Give the ${g.word.noun} some room.`, 2200);
      return;
    }
    go('running');
    await proceed();
  }
  // waits for the pool (or fails into the error state), then ranks and reveals
  async function proceed() {
    if (!g.ready) {
      setCap('Fetching 1,000 strangers.');
      const ok = g.loadErr ? false : await (g.readyP || Promise.resolve(false));
      if (!ok || !g.ready) {
        setCap(`The strangers did not turn up. Your ${g.word.noun} is safe.`);
        go('error');
        return;
      }
    }
    setCap('');
    const t = performance.now();
    const nq = normalise(g.strokes);
    const ranked = rankAll(features(nq), g.feats!);
    g.rankMs = performance.now() - t;
    const pool = g.pool!;
    g.nq = nq; g.meD = { cc: '', ym: 0, st: nq, ...boxOf(nq) }; g.ranked = ranked;
    g.stats = statLines(statOf(nq), g.pstats!); g.tw = describeTwin(g.word, pool, ranked, nq);
    g.twinD = pool[ranked[0][0]];
    const L = gridFor(g.lay.mos);
    g.M = buildMosaic(L, pool, ranked, g.meD);
    cacheMosaic(g.M);
    reveal();
  }
  function retry() {
    if (g.phase !== 'error') return;
    go('running');
    load(g.wi);
    proceed();
  }

  // ---------- mosaic painting ----------
  // camera that puts your normalised drawing exactly where you drew it, so the cut is invisible
  function camFromSquare(L: Grid): Cam {
    const all = g.strokes.flat(), sq = g.lay.sq;
    const bx0 = Math.min(...all.map((p) => p[0])), by0 = Math.min(...all.map((p) => p[1]));
    const maxb = Math.max(Math.max(...all.map((p) => p[0])) - bx0, Math.max(...all.map((p) => p[1])) - by0);
    const f = boxF(g.meD!, L.cc, L.cr, 1, 1.5 / L.cell);
    const z = maxb / (255 * f.s);
    return { z, tx: sq.x + bx0 - z * f.ox, ty: sq.y + by0 - z * f.oy };
  }
  // the settled mosaic (all bands, empty dots; not you, not the twin) as one bitmap at the final camera
  function cacheMosaic(M: Mosaic) {
    const L = M.L, d = dpr();
    M.c1 = { z: L.cell, tx: L.ox, ty: L.oy };
    // the grid alone at up to 2x, capped near 12M pixels (iOS refuses canvases past 16.7M)
    const gw = L.cols * L.cell, gh = L.rows * L.cell;
    const S2 = Math.max(1, Math.min(2, Math.sqrt(12e6 / (gw * gh * d * d))));
    const big = document.createElement('canvas');
    big.width = Math.ceil(gw * d * S2); big.height = Math.ceil(gh * d * S2);
    paintBands(big.getContext('2d')!, M, { z: L.cell, tx: 0, ty: 0 }, null, 1, d * S2);
    const cv = document.createElement('canvas');
    cv.width = Math.round(g.lay.W * d); cv.height = Math.round(g.lay.H * d);
    cv.getContext('2d')!.drawImage(big, d * L.ox, d * L.oy, big.width / S2, big.height / S2);
    M.big = big; M.bigS = S2; M.cache = cv;
  }
  // Stranger lines are 1px at the final zoom. Closer in they thicken with the zoom, up to the
  // weight the cached bitmap has when it takes over at the end of the fly-in, so the hand-off
  // from live strokes to the bitmap does not change the line weight.
  const lineCss = (M: Mosaic, cam: Cam) => Math.max(1, Math.min(cam.z / M.c1.z, M.lwCap));
  function paintBands(x: CanvasRenderingContext2D, M: Mosaic, cam: Cam, t: number | null, dim: number, d: number, lw = 1) {
    x.setTransform(d * cam.z, 0, 0, d * cam.z, d * cam.tx, d * cam.ty);
    x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = INK; x.lineWidth = lw / cam.z;
    const flying = t !== null && t < FLY_END;
    M.bands.forEach((b, bi) => {
      if (flying && bi <= FLY_BANDS) return;
      const fa = t === null ? 1 : clamp01((t - b.start) / 300);
      x.globalAlpha = b.alpha * fa * dim;
      if (x.globalAlpha > 0.003) x.stroke(b.path);
    });
    x.globalAlpha = dim; x.fillStyle = DOT; x.fill(M.dots);
    x.globalAlpha = 1;
  }
  // t is ms into the pull-back, or null for the settled mosaic
  function paintMosaic(x: CanvasRenderingContext2D, M: Mosaic, cam: Cam, t: number | null, dim: number, opts: { me?: boolean; twin?: boolean; meW?: number } = {}) {
    const d = dpr();
    if ((t === null || t >= CACHE_AT) && M.cache) {
      const k = cam.z / M.c1.z;
      x.setTransform(k, 0, 0, k, d * (cam.tx - M.c1.tx * k), d * (cam.ty - M.c1.ty * k));
      x.globalAlpha = dim; x.drawImage(M.cache, 0, 0); x.globalAlpha = 1;
    } else if (t !== null && t >= FLY_END && M.big) {
      const L = M.L, k = cam.z / (M.bigS * L.cell);
      x.setTransform(k, 0, 0, k, d * cam.tx, d * cam.ty);
      x.globalAlpha = dim; x.drawImage(M.big, 0, 0); x.globalAlpha = 1;
      // rank r fades in from 300 + 1.5r ms over 300ms; as radii, that is a soft ring growing out
      const at = (r: number) => M.L.cells[Math.max(0, Math.min(M.L.cells.length - 1, Math.floor(r)))].d;
      const r0 = at((t - 600) / 1.5), r1 = Math.max(r0 + 0.5, at((t - 300) / 1.5) + 0.5);
      x.setTransform(d * cam.z, 0, 0, d * cam.z, d * cam.tx, d * cam.ty);
      const cx = L.cc + 0.5, cy = L.cr + 0.5, gr = x.createRadialGradient(cx, cy, r0, cx, cy, r1);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.globalCompositeOperation = 'destination-in'; x.fillStyle = gr;
      x.fillRect(-1, -1, L.cols + 2, L.rows + 2);
      x.globalCompositeOperation = 'source-over';
    } else paintBands(x, M, cam, t, dim, d, t === null ? 1 : lineCss(M, cam));
    const W = x.canvas.width / d, H = x.canvas.height / d;
    x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = INK;
    if (t !== null && t < FLY_END) {
      for (const f of M.flyers) {
        const p = t - f.start;
        if (p <= 0) break;
        const e = easeOut(clamp01(p / FLY_MS));
        const sx = cam.tx + lerp(f.from.c, f.to.c, e) * cam.z, sy = cam.ty + lerp(f.from.r, f.to.r, e) * cam.z;
        if (sx > W || sy > H || sx + cam.z < 0 || sy + cam.z < 0) continue;
        x.setTransform(d * cam.z, 0, 0, d * cam.z, d * sx, d * sy);
        x.globalAlpha = f.alpha * clamp01(p / 300) * dim; x.lineWidth = lineCss(M, cam) / cam.z;
        x.stroke(f.path);
      }
    } else if (opts.twin !== false) {
      x.setTransform(d * cam.z, 0, 0, d * cam.z, d * (cam.tx + M.twinCell.c * cam.z), d * (cam.ty + M.twinCell.r * cam.z));
      x.globalAlpha = dim; x.lineWidth = (t === null ? 1 : lineCss(M, cam)) / cam.z; x.stroke(M.twin);
    }
    if (opts.me !== false) {
      x.setTransform(d * cam.z, 0, 0, d * cam.z, d * cam.tx, d * cam.ty);
      x.globalAlpha = 1; x.strokeStyle = RED; x.lineWidth = (opts.meW || 1.5) / cam.z;
      x.shadowColor = 'rgba(255,79,43,0.35)'; x.shadowBlur = 8 * d;
      x.stroke(M.me);
      x.shadowBlur = 0;
    }
    x.globalAlpha = 1;
  }
  function crop(x: CanvasRenderingContext2D, r: Rect, a = 1) {
    const d = dpr(), k = 14;
    x.setTransform(d, 0, 0, d, 0, 0); x.globalAlpha = a; x.strokeStyle = HAIR; x.lineWidth = 1; x.lineCap = 'butt';
    for (const [p, q, dx, dy] of [[r.x, r.y, 1, 1], [r.x + r.s, r.y, -1, 1], [r.x, r.y + r.s, 1, -1], [r.x + r.s, r.y + r.s, -1, -1]]) {
      x.beginPath(); x.moveTo(p + k * dx, q + 0.5 * dy); x.lineTo(p + 0.5 * dx, q + 0.5 * dy); x.lineTo(p + 0.5 * dx, q + k * dy); x.stroke();
    }
    x.globalAlpha = 1;
  }
  function panelBox(x: CanvasRenderingContext2D, r: Rect, a = 1) {
    const d = dpr();
    x.setTransform(d, 0, 0, d, 0, 0); x.globalAlpha = 0.92 * a; x.fillStyle = BG; x.fillRect(r.x, r.y, r.s, r.s); x.globalAlpha = 1;
    crop(x, r, a);
  }
  function drawIn(x: CanvasRenderingContext2D, dd: Drawing, r: Rect, col: string, w: number, pad: number, ink?: number) {
    const d = dpr();
    x.setTransform(d, 0, 0, d, 0, 0); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; x.globalAlpha = 1;
    x.stroke(pathOf(dd.st, boxF(dd, r.x, r.y, r.s, pad), ink));
  }
  function ring(x: CanvasRenderingContext2D, cam: Cam, cell: Cell, p: number) {
    const d = dpr(), r = { x: cam.tx + cell.c * cam.z, y: cam.ty + cell.r * cam.z, s: cam.z };
    x.setTransform(d, 0, 0, d, 0, 0); x.globalAlpha = 1; x.strokeStyle = RED; x.lineWidth = 2; x.lineCap = 'butt';
    const pts: Pt[] = [[r.x + r.s, r.y], [r.x + r.s, r.y + r.s], [r.x, r.y + r.s], [r.x, r.y]];
    let left = 4 * r.s * clamp01(p), px = r.x, py = r.y;
    x.beginPath(); x.moveTo(r.x, r.y);
    for (const [qx, qy] of pts) {
      const dd = Math.hypot(qx - px, qy - py);
      if (left >= dd) { x.lineTo(qx, qy); left -= dd; px = qx; py = qy; } else { x.lineTo(px + ((qx - px) * left) / dd, py + ((qy - py) * left) / dd); break; }
    }
    x.stroke();
  }
  const panelLine = () => 2.5 * (g.lay.pa.s / 171);
  // the result's background: the whole mosaic at 25%, read as texture, with both panels on it
  function paintResultBg(x: CanvasRenderingContext2D, meInk?: number, twInk?: number) {
    const M = g.M!, l = g.lay;
    clearBg(x);
    paintMosaic(x, M, M.c1, null, 0.25, { me: false, twin: false });
    panelBox(x, l.pa); panelBox(x, l.pb);
    drawIn(x, g.meD!, l.pa, RED, panelLine(), PANEL_PAD, meInk);
    drawIn(x, g.twinD!, l.pb, INK, panelLine(), PANEL_PAD, twInk);
  }
  const paintResult = () => paintResultBg(bg());

  // ---------- the reveal: pull back, hold, ring, lift, replay ----------
  function reveal() {
    const M = g.M!, L = M.L, l = g.lay, sqEl = sqRef.current!;
    const c1 = M.c1, c0 = camFromSquare(L);
    const mid = (c: Cam) => ({ x: c.tx + (L.cc + 0.5) * c.z, y: c.ty + (L.cr + 0.5) * c.z });
    const S0 = mid(c0), S1 = mid(c1);
    const camAt = (e: number): Cam => { const z = Math.exp(lerp(Math.log(c0.z), Math.log(c1.z), e)); return { z, tx: lerp(S0.x, S1.x, e) - (L.cc + 0.5) * z, ty: lerp(S0.y, S1.y, e) - (L.cr + 0.5) * z }; };
    M.lwCap = camAt(ease(FLY_END / PULL)).z / c1.z;
    const cellR = (c: { c: number; r: number }): Rect => ({ x: c1.tx + c.c * c1.z, y: c1.ty + c.r * c1.z, s: c1.z });
    const rMe = cellR({ c: L.cc, r: L.cr }), rTw = cellR(M.twinCell), padCell = 1.5 / L.cell;
    const cap1 = `${fmtN(g.pool!.length)} other ${g.word.plural}. Real people, ${g.years}.`;
    sqEl.style.opacity = '0';
    g.frames = [];
    if (g.reduced) {
      // a cut to the whole mosaic, a cut to the result, no replay
      go('hold'); setPill(cap1);
      const x = bg(); clearBg(x); paintMosaic(x, M, c1, null, 1);
      later(() => { setPill(g.tw!.none ? 'No twin this time. Here is the closest.' : 'One of them drew it like you.'); ring(x, c1, M.twinCell, 1); }, 1400);
      later(() => { setPill(''); paintResult(); showResult(true); }, 2800);
      return;
    }
    go('pullback'); setPill(cap1);
    const st = performance.now();
    let lf = 0;
    const T1 = PULL, T2 = T1 + HOLD, T3 = T2 + RING, T4 = T3 + LIFT, T5 = T4 + REPLAY + 100;
    const f = (now: number) => {
      if (g.phase === 'leaving' || g.phase === 'rest') return;
      if (lf) g.frames.push(now - lf);
      lf = now;
      const t = now - st, x = bg();
      clearBg(x);
      if (t < T1) {
        const e = ease(t / PULL);
        paintMosaic(x, M, camAt(e), t, 1, { meW: lerp(4, 1.5, e) });
      } else if (t < T3) {
        if (g.phase === 'pullback') { go('hold'); setPill(g.tw!.none ? 'No twin this time. Here is the closest.' : 'One of them drew it like you.'); }
        paintMosaic(x, M, c1, null, 1);
        if (t >= T2) { if (g.phase === 'hold') go('ring'); ring(x, c1, M.twinCell, (t - T2) / RING); }
      } else if (t < T4) {
        if (g.phase !== 'lift') { go('lift'); setPill(''); }
        const e = easeOut((t - T3) / LIFT);
        paintMosaic(x, M, c1, null, lerp(1, 0.25, e), { me: false, twin: false });
        panelBox(x, l.pa, e); panelBox(x, l.pb, e);
        drawIn(x, g.meD!, lerpR(rMe, l.pa, e), RED, lerp(1.5, panelLine(), e), lerp(padCell, PANEL_PAD, e));
        drawIn(x, g.twinD!, lerpR(rTw, l.pb, e), INK, lerp(1, panelLine(), e), lerp(padCell, PANEL_PAD, e));
      } else if (t < T5) {
        if (g.phase !== 'replay') go('replay');
        const r = t - T4;
        paintResultBg(x, replayInk(g.meD!.st, r), replayInk(g.twinD!.st, r));
      } else {
        paintResult();
        showResult(false);
        return;
      }
      g.raf = requestAnimationFrame(f);
    };
    g.raf = requestAnimationFrame(f);
  }
  function showResult(instant: boolean) {
    setDrop(0);
    setRes({ tw: g.tw!, stats: g.stats!, word: g.word });
    go('result');
    try { localStorage.setItem(STORE, JSON.stringify({ next: (g.wi + 1) % WORDS.length, lastCountry: g.tw!.none ? undefined : g.tw!.country })); } catch {}
    if (instant) { setNLines(6); return; }
    let n = 0;
    const tick = () => { n++; setNLines(n); if (n < 6) later(tick, 120); };
    later(tick, 120);
  }

  // ---------- result actions ----------
  async function save() {
    if (!g.M || !g.tw || !g.meD || !g.twinD || !g.stats) return;
    try { if (document.fonts) await Promise.all([document.fonts.load('36px m6x11plus'), document.fonts.ready]); } catch {}
    const cv = renderCard(g.M, g.meD, g.twinD, g.tw, g.stats, g.word, g.mono);
    const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
    if (!blob) return;
    g.cardBytes = blob.size;
    const file = new File([blob], `twin-${g.tw.nnnn}.png`, { type: 'image/png' });
    try {
      if (matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file] }); flash('Saved.'); return; }
    } catch {}
    const a = document.createElement('a'), url = URL.createObjectURL(blob);
    a.href = url; a.download = file.name; a.click();
    later(() => URL.revokeObjectURL(url), 4000);
    flash('Saved.');
  }
  async function copy() {
    if (!g.tw) return;
    try { await navigator.clipboard.writeText(g.tw.copy); } catch {}
    g.copied = g.tw.copy; flash('Copied.');
  }
  function flash(t: string) { setFb(t); later(() => setFb((c) => (c === t ? '' : c)), 1800); }
  function again(next: boolean) {
    if (g.phase !== 'result') return;
    go('leaving');
    const cv = bgRef.current!;
    cv.style.transition = 'opacity 300ms'; cv.style.opacity = '0';
    setRes(null); setNLines(0); setPill('');
    if (next) setShown(false);
    later(() => {
      clearBg(bg()); cv.style.transition = ''; cv.style.opacity = '1';
      g.strokes = []; g.M = null; drawSq(); setHasStroke(false); resetClock(); setCap('');
      if (next) { const i = (g.wi + 1) % WORDS.length; g.wi = i; g.word = WORDS[i]; setWi(i); load(i); }
      sqRef.current!.style.opacity = '1';
      go('rest');
      requestAnimationFrame(() => setShown(true));
    }, 300);
  }

  const r = res, l = lay;
  const stage = phase === 'rest' || phase === 'input' || phase === 'running' || phase === 'error';
  const resultOn = phase === 'result' && !!r;
  const tagsOn = !!r || phase === 'replay';
  const nextW = WORDS[(wi + 1) % WORDS.length];
  const btn = 'h-[52px] border border-[#3a352d] bg-[#0b0a09] text-[14px] text-[#ece3cf] active:bg-[#1a1714]';
  const btnMain = 'h-[52px] bg-[#ece3cf] text-[14px] text-[#0b0a09] active:bg-[#d8cfba]';
  const lines = r ? [
    <div key="h" className={`font-pixel leading-none ${l.compact ? 'text-[24px]' : 'text-[28px]'}`} data-head>{r.tw.head}</div>,
    <div key="l" className={l.compact ? 'text-[14px] leading-[18px]' : 'text-[15px] leading-[20px]'} data-twinline>{r.tw.line}</div>,
    <div key="s1" className={l.compact ? 'text-[13px] leading-[17px]' : 'text-[14px] leading-[19px]'} data-stat>{r.stats[0].line}</div>,
    drop < 2 && r.stats[1] ? <div key="s2" className={l.compact ? 'text-[13px] leading-[17px]' : 'text-[14px] leading-[19px]'} data-stat>{r.stats[1].line}</div> : null,
    drop < 1 ? <div key="f" className={`text-[#7d766a] ${l.compact ? 'text-[13px] leading-[17px]' : 'text-[14px] leading-[19px]'}`} data-foot>{r.tw.none ? 'No twin in this pool. Your drawing stands alone.' : r.word.foot}</div> : null,
  ].filter(Boolean) : [];
  const tw = r?.tw ?? g.tw;

  return (
    <main ref={mainRef} data-phase={phase} className="fixed inset-0 z-50 h-[100dvh] overflow-hidden overscroll-none bg-[#0b0a09] font-mono text-[#ece3cf] select-none">
      <canvas ref={bgRef} className="pointer-events-none absolute left-0 top-0" style={{ width: l.W, height: l.H }} />
      <a href="/experiments/" className="absolute left-4 top-4 text-[13px] leading-none text-[#7d766a]">WIZ LAB</a>
      {stage && (
        <div className={`pointer-events-none absolute transition-opacity duration-[250ms] ${shown ? 'opacity-100' : 'opacity-0'}`} style={{ left: l.promptX, top: l.promptY, width: l.promptW }}>
          <h1 className="font-pixel whitespace-nowrap font-normal" style={{ fontSize: promptPx, lineHeight: '48px' }} data-prompt>{promptOf(word)}</h1>
          {last && <p className="mt-1 text-[14px] leading-[18px] text-[#7d766a]" data-last>Your last twin was in {last}.</p>}
        </div>
      )}
      <canvas ref={sqRef} data-square onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        className={`absolute transition-opacity duration-200 ${stage ? '' : 'pointer-events-none'}`}
        style={{ left: l.sq.x, top: l.sq.y, width: l.sq.s, height: l.sq.s, touchAction: 'none' }} />
      {stage && (
        <div className={`transition-opacity duration-[250ms] ${shown ? 'opacity-100' : 'opacity-0'}`}>
          <svg className="pointer-events-none absolute" style={{ left: l.sq.x, top: l.sq.y, width: l.sq.s, height: l.sq.s }} viewBox={`0 0 ${l.sq.s} ${l.sq.s}`} aria-hidden="true">
            <path d={`M0.5 14.5V0.5H14.5M${l.sq.s - 14.5} 0.5H${l.sq.s - 0.5}V14.5M${l.sq.s - 0.5} ${l.sq.s - 14.5}V${l.sq.s - 0.5}H${l.sq.s - 14.5}M14.5 ${l.sq.s - 0.5}H0.5V${l.sq.s - 14.5}`} stroke="#3a352d" fill="none" />
          </svg>
          <div className="pointer-events-none absolute h-[2px] overflow-hidden" style={{ left: l.sq.x, top: l.clockY, width: l.sq.s }}>
            <div ref={clockRef} className="h-full w-full origin-left bg-[#ece3cf]/40" />
          </div>
          {phase === 'error' ? (
            <div className="absolute flex" style={{ left: l.ctrlX, top: l.ctrlY, width: l.ctrlW }}>
              <button className={`${btnMain} flex-1`} onClick={retry} data-retry>Try again</button>
            </div>
          ) : phase !== 'running' && (
            <div className={`absolute flex gap-4 ${l.ctrlCol ? 'flex-col-reverse gap-3' : ''}`} style={{ left: l.ctrlX, top: l.ctrlY, width: l.ctrlW }}>
              <button className={`${btn} flex-1 ${hasStroke ? '' : 'invisible'}`} onClick={undo} data-undo>Undo</button>
              <button className={`${btnMain} flex-1 ${hasStroke ? '' : 'invisible'}`} onClick={finish} data-done>Done</button>
            </div>
          )}
        </div>
      )}
      {cap && <div className="pointer-events-none absolute text-center text-[13px] leading-[18px] text-[#ece3cf]" style={{ left: l.sq.x, width: l.sq.s, top: l.clockY + 12 }} data-caption role="status">{cap}</div>}
      {pill && <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#0b0a09]/85 px-3 py-1.5 text-[13px] leading-[18px]" style={{ top: l.pillY }} data-pill role="status">{pill}</div>}
      {tagsOn && tw && (
        <>
          <div className="font-pixel pointer-events-none absolute text-[14px] leading-[16px]" style={{ left: l.pa.x, top: l.pa.y + l.pa.s + 8, width: l.pa.s }}>YOU, TODAY</div>
          <div className="font-pixel pointer-events-none absolute text-[14px] leading-[16px]" style={{ left: l.pb.x, top: l.pb.y + l.pb.s + 8, width: l.pb.s }} data-tag>{tw.tag}</div>
        </>
      )}
      {resultOn && (
        <div ref={textRef} className={`absolute flex flex-col overflow-hidden ${l.compact ? 'gap-1.5' : 'gap-2.5'}`} style={{ left: l.textX, top: l.textY, width: l.textW, maxHeight: l.textBottom - l.textY }} data-result>
          {lines.map((el, i) => <div key={i} className="transition-opacity duration-200" style={{ opacity: nLines > i ? 1 : 0 }}>{el}</div>)}
        </div>
      )}
      {resultOn && nLines >= 6 && (
        <>
          <div className="absolute grid grid-cols-2 gap-x-4 gap-y-2" style={{ left: l.btnX, top: l.btnY, width: l.btnW }}>
            <button className={btnMain} onClick={save} data-save>{fb === 'Saved.' ? fb : 'Save card'}</button>
            <button className={btn} onClick={copy} data-copy>{fb === 'Copied.' ? fb : 'Copy'}</button>
            <button className={btn} onClick={() => again(false)} data-again>Again</button>
            <button className={btn} onClick={() => again(true)} data-next>{`Draw ${nextW.art} ${nextW.noun}`}</button>
          </div>
          <a className="absolute text-[12px] leading-[16px] text-[#7d766a] underline-offset-2 hover:underline" style={{ left: l.btnX, top: l.creditY }} href="https://github.com/googlecreativelab/quickdraw-dataset" target="_blank" rel="noreferrer" data-credit>Drawings from Quick, Draw! by Google, CC BY 4.0.</a>
        </>
      )}
    </main>
  );
}
