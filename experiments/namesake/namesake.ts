// Namesake: the mapping from a name to a specimen. Pure and deterministic, no DOM, so the
// server page can grow the first paint specimen at build time and the client can grow every
// other one with the same code.

export const INKS = [
  ['copper', '#C9682E'],
  ['rust', '#A8422B'],
  ['brass', '#B79240'],
  ['lichen', '#7E9A4B'],
  ['jade', '#3E8F6B'],
  ['teal', '#2D8A8A'],
  ['steel', '#4A6E9E'],
  ['plum', '#7B4E8C'],
  ['bone', '#CFC6B4'],
] as const;

// Rows by curl (curling left, straight, curling right), columns by measured lean.
const EPITHETS = [
  ['contorta', 'pendula', 'patula'],
  ['nana', 'stricta', 'robusta'],
  ['gracilis', 'erecta', 'radians'],
];

export const MAX_CHARS = 24;
// a to g fan in twos, h to q in threes, r to z in fours
const SPLIT_BY_PLACE = (p: number) => (p < 0.27 ? 2 : p < 0.66 ? 3 : 4);
const ORDER_RANGE: Record<number, [number, number]> = { 2: [5, 8], 3: [3, 6], 4: [3, 5] };
const MIN_SEGMENTS = 40;
const MAX_SEGMENTS = 2600;

export type RGB = [number, number, number];

export type Params = {
  order: number;
  split: number;
  angle: number;
  decay: number;
  lean: number;
  curl: number;
  ink: RGB;
  inkName: string;
  mods: number[];
  seed: number;
};

export type Seg = { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; d: number };

export type Specimen = {
  name: string;
  segs: Seg[];
  maxD: number;
  ink: RGB;
  inkName: string;
  binomial: string;
  measure: string;
  box: { minX: number; maxX: number; minY: number; maxY: number };
};

export function normalize(raw: string): { name: string; trimmed: boolean } {
  const collapsed = raw.toLowerCase().replace(/\s+/g, ' ').trim();
  const chars = Array.from(collapsed);
  return { name: chars.slice(0, MAX_CHARS).join('').trim(), trimmed: chars.length > MAX_CHARS };
}

function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (const ch of s) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619) >>> 0;
  }
  // final avalanche so short strings spread over the whole range
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hex(h: string): RGB {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const VOWELS = /[aeiouyąęóàáâäãåèéêëìíîïòôöõùúûüýæœø]/;

// Where a letter sits in its alphabet, 0 to 1. Latin letters by position, anything else
// (Cyrillic, Greek, CJK) by code point folded into the same range, so every script grows.
function place(ch: string) {
  const base = ch.normalize('NFD')[0];
  const k = base.codePointAt(0)!;
  if (k >= 97 && k <= 122) return (k - 97) / 25;
  return ((k * 2654435761) >>> 0) / 4294967296;
}

// The base shape comes from things about the letters that change a little when one letter
// is added: length, vowel share, where the letters sit in the alphabet, how the consonants
// cluster. The full string hash only jitters. So `ho` to `hon` moves the plant rather than
// rerolling it.
export function paramsFor(word: string): Params {
  const letters = Array.from(word).filter((c) => /\p{L}/u.test(c));
  const n = Math.max(1, letters.length);
  const seed = hash(word);
  const r = mulberry32(seed);
  const wobble = (amp: number) => (r() - 0.5) * 2 * amp;

  const places = letters.map(place);
  const mean = places.reduce((a, b) => a + b, 0) / n;
  const vowels = letters.filter((c) => VOWELS.test(c)).length / n;
  let runs = 0;
  for (let i = 1; i < letters.length; i++) {
    if (!VOWELS.test(letters[i]) && !VOWELS.test(letters[i - 1])) runs++;
  }
  const clusters = letters.length > 1 ? runs / (letters.length - 1) : 0;
  // signed drift: letters late in the alphabet push right, early ones push left
  const drift = places.reduce((a, p, i) => a + (p - 0.5) * (1 + (i % 3) * 0.35), 0) / Math.sqrt(n);
  const first = letters[0] ?? 'a';

  // children per node is fixed by the first letter, so it never flips while you type
  const split = SPLIT_BY_PLACE(place(first));
  // depth grows with the name inside the range that split allows: a short name is a
  // sprig, a long one a crown, and every split keeps at least 40 and at most 1365 segments
  const [lo, hi] = ORDER_RANGE[split];
  const order = lo + Math.round(clamp(n / 8, 0, 1) * (hi - lo));
  const angle = clamp(14 + vowels * 72 + wobble(5), 14, 62);
  const decay = clamp(0.58 + mean * 0.24 + wobble(0.02), 0.58, 0.82);
  const lean = clamp(Math.tanh(drift * 1.6) * 28 + wobble(3), -28, 28);
  const curlSign = place(first) < 0.5 ? -1 : 1;
  const curl = clamp(curlSign * (0.1 + clusters * 0.5 + Math.abs(mean - 0.5) * 0.4) + wobble(0.05), -0.4, 0.4);
  // ink is its own draw from its own salt, so shape and colour cannot share a fate
  const ii = hash('ink:' + word) % INKS.length;
  const mods = letters.map((c) => {
    const k = c.codePointAt(0)!;
    return (((k * 37) % 29) / 28) * 2 - 1;
  });
  return { order, split, angle, decay, lean, curl, ink: hex(INKS[ii][1]), inkName: INKS[ii][0], mods, seed };
}

// sRGB to CIE Lab and back, D65, so the hybrid ink is a perceptual midpoint
function toLin(c: number) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function fromLin(c: number) {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp(v, 0, 1) * 255);
}
const W = [0.95047, 1, 1.08883];
function toLab([r, g, b]: RGB): RGB {
  const R = toLin(r), G = toLin(g), B = toLin(b);
  const xyz = [
    (0.4124 * R + 0.3576 * G + 0.1805 * B) / W[0],
    (0.2126 * R + 0.7152 * G + 0.0722 * B) / W[1],
    (0.0193 * R + 0.1192 * G + 0.9505 * B) / W[2],
  ].map((t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116));
  return [116 * xyz[1] - 16, 500 * (xyz[0] - xyz[1]), 200 * (xyz[1] - xyz[2])];
}
function fromLab([L, a, b]: RGB): RGB {
  const fy = (L + 16) / 116;
  const f = [fy + a / 500, fy, fy - b / 200].map((t) => (t * t * t > 216 / 24389 ? t * t * t : (116 * t - 16) / (24389 / 27)));
  const X = f[0] * W[0], Y = f[1] * W[1], Z = f[2] * W[2];
  return [
    fromLin(3.2406 * X - 1.5372 * Y - 0.4986 * Z),
    fromLin(-0.9689 * X + 1.8758 * Y + 0.0415 * Z),
    fromLin(0.0557 * X - 0.204 * Y + 1.057 * Z),
  ];
}

// 50/50 cross. Continuous traits average. The two integer traits cannot average, so they
// follow a fixed rule instead of whatever rounding happens to do: depth rounds up (hybrid
// vigour) and children per node come from the second parent whenever the parents differ
// by one, so a cross never simply copies the parent named first.
export function blend(a: Params, b: Params): Params {
  const m = (x: number, y: number) => (x + y) / 2;
  const la = toLab(a.ink), lb = toLab(b.ink);
  const split = Math.abs(a.split - b.split) === 1 ? b.split : Math.round(m(a.split, b.split));
  return {
    order: Math.ceil(m(a.order, b.order)),
    split,
    angle: m(a.angle, b.angle),
    decay: m(a.decay, b.decay),
    lean: m(a.lean, b.lean),
    curl: m(a.curl, b.curl),
    ink: fromLab([m(la[0], lb[0]), m(la[1], lb[1]), m(la[2], lb[2])]),
    inkName: a.inkName === b.inkName ? a.inkName : `${a.inkName}-${b.inkName}`,
    mods: a.mods.flatMap((v, i) => [v, b.mods[i] ?? 0]).concat(b.mods.slice(a.mods.length)),
    seed: (a.seed ^ Math.imul(b.seed, 0x9e3779b1)) >>> 0,
  };
}

export function segmentCount(split: number, order: number) {
  return (Math.pow(split, order + 1) - 1) / (split - 1);
}

function grow(p: Params): { segs: Seg[]; maxD: number } {
  const r = mulberry32(p.seed ^ 0x9e3779b9);
  let order = p.order;
  while (order < 8 && segmentCount(p.split, order) < MIN_SEGMENTS) order++;
  while (order > 3 && segmentCount(p.split, order) > MAX_SEGMENTS) order--;
  const segs: Seg[] = [];
  const rad = Math.PI / 180;
  const n = Math.max(1, p.mods.length);
  let k = 0;
  const branch = (x: number, y: number, dir: number, len: number, d: number) => {
    const mod = p.mods[k % n] ?? 0;
    k++;
    const bend = p.curl * len * 0.9 + mod * len * 0.25;
    const x2 = x + Math.cos(dir) * len;
    const y2 = y + Math.sin(dir) * len;
    const nx = -Math.sin(dir);
    const ny = Math.cos(dir);
    segs.push({ x1: x, y1: y, cx: (x + x2) / 2 + nx * bend, cy: (y + y2) / 2 + ny * bend, x2, y2, d });
    if (d >= order) return;
    const endDir = dir + p.curl * 0.6;
    const spread = p.angle * rad;
    for (let j = 0; j < p.split; j++) {
      const t = j / (p.split - 1) - 0.5;
      const jitter = (r() - 0.5) * spread * 0.25 + mod * 6 * rad;
      const nd = endDir + t * 2 * spread + jitter + (p.lean * rad) / (order + 1);
      const nl = len * p.decay * (0.9 + r() * 0.2) * (1 + mod * 0.12);
      branch(x2, y2, nd, nl, d + 1);
    }
  };
  branch(0, 0, -Math.PI / 2 + p.lean * rad * 0.3, 100, 0);
  // depth order is the growth order
  segs.sort((a, b) => a.d - b.d);
  return { segs, maxD: order };
}

function genus(w: string) {
  const letters = Array.from(w.replace(/[^\p{L}]/gu, ''));
  if (!letters.length) return 'Planta';
  const c = letters[0].toUpperCase() + letters.slice(1).join('');
  if (/a$/i.test(c)) return c;
  if (/[eiouy]$/i.test(c)) return c.slice(0, -1) + 'ia';
  return c + 'ia';
}

// Latin first declension genitive, the form a hybrid epithet takes: Honorata, honoratae.
function genitive(g: string) {
  return g.toLowerCase() + 'e';
}

export function boundsOf(segs: Seg[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const s of segs) {
    for (const [x, y] of [[s.x1, s.y1], [s.x2, s.y2], [s.cx, s.cy]]) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, maxX, minY, maxY };
}

export function specimen(input: string): Specimen | null {
  const parts = input
    .split('+')
    .map((s) => s.trim())
    .filter((s) => /\p{L}/u.test(s))
    .slice(0, 2);
  if (!parts.length) return null;
  const p = parts.length > 1 ? blend(paramsFor(parts[0]), paramsFor(parts[1])) : paramsFor(parts[0]);
  const { segs, maxD } = grow(p);
  // Every number on line 3 is read off the grown object, not the seed: the segment count
  // actually drawn, the depth actually reached, the angle from base to the mean tip.
  const tips = segs.filter((s) => s.d === maxD);
  const tx = tips.reduce((a, s) => a + s.x2, 0) / Math.max(1, tips.length);
  const ty = tips.reduce((a, s) => a + s.y2, 0) / Math.max(1, tips.length);
  const leanDeg = Math.round((Math.atan2(tx, -ty) * 180) / Math.PI) || 0;
  const li = leanDeg < -5 ? 0 : leanDeg > 5 ? 2 : 1;
  const ci = p.curl < -0.12 ? 0 : p.curl > 0.12 ? 2 : 1;
  const binomial =
    parts.length > 1 ? `${genus(parts[0])} x ${genitive(genus(parts[1]))}` : `${genus(parts[0])} ${EPITHETS[ci][li]}`;
  return {
    name: input,
    segs,
    maxD,
    ink: p.ink,
    inkName: p.inkName,
    binomial,
    measure: `branches ${segs.length} / order ${maxD} / lean ${leanDeg}deg / ink ${p.inkName}`,
    box: boundsOf(segs),
  };
}

export const inkAt = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
export const alphaAt = (d: number, maxD: number) => 1 - 0.55 * (maxD ? d / maxD : 0);
export const widthAt = (d: number, maxD: number) => Math.max(0.6, 2.4 * (1 - (maxD ? d / maxD : 0)) + 0.5);

// The Grow button's preview: only the ink, without growing the whole organism per keystroke.
export function previewInk(input: string): RGB | null {
  const parts = input
    .split('+')
    .map((s) => s.trim())
    .filter((s) => /\p{L}/u.test(s))
    .slice(0, 2);
  if (!parts.length) return null;
  return (parts.length > 1 ? blend(paramsFor(parts[0]), paramsFor(parts[1])) : paramsFor(parts[0])).ink;
}

// Dense crowns get thinner strokes so 1000 hairlines at 390px stay hairlines, not a mass.
export const densityScale = (count: number) => Math.min(1, Math.max(0.55, Math.sqrt(341 / count)));

// One stroke list per depth, so a renderer sets colour and width once per ring of growth.
export function depthRanges(segs: Seg[], maxD: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  let i = 0;
  for (let d = 0; d <= maxD; d++) {
    const start = i;
    while (i < segs.length && segs[i].d === d) i++;
    out.push([start, i]);
  }
  return out;
}
