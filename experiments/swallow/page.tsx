'use client';

// Swallow: a black hole the size of a full stop eats the page you are reading.
//
// The essay is real DOM text on first paint, so the static export and the first client
// render match. After mount, every visible character is measured from that DOM and becomes
// a glyph on the canvas, which is why the swap from DOM to canvas has no jump: the canvas
// draws each glyph exactly where the browser laid it out.
//
// Rendering: a 2D source canvas (stars, paper, unmoved text, loose glyphs) goes through a
// WebGL1 point-mass lens, src = p - thetaE^2 * r / |r|^2. The orbit rings draw flat on a 2D
// overlay after the lens. Without WebGL the same source is drawn unbent, with the hole on top.

import { useEffect, useRef, useState } from 'react';

const CRUMB = 'WIZ LAB / SWALLOW';
const TITLE = 'On Permanence';
const BYLINE_FIRST = 'WIZ. A page that will be here forever.';
const BYLINE_REPEAT = 'WIZ. Restored from backup.';
const P1A = 'Please do not touch the full stop at the end of this sentence';
const P1B = ' It is load-bearing.';
const ESSAY = [
  'Everything you put on the internet stays there. Your first username. The photo from the work party. The review you left a toaster in 2014, all four paragraphs of it. Somewhere a server is keeping it warm, and it will keep it warm long after the toaster is gone.',
  'This page is the same. It was written once, carefully, and it is not going anywhere. You could close the tab and it would still be here. You could come back next Tuesday and find every word exactly where you left it, which is more than can be said for your keys.',
  'People find this comforting or terrifying, depending on what they posted. The archive does not mind either way. It does not judge, it does not forget, and it never lets go of anything it has been given.',
  'Some things are simply too heavy to move. Mountains. Pianos. Opinions formed in a comment section at two in the morning. And this paragraph, which is probably the most permanent thing you will read today.',
  'So read slowly. There is no hurry. Nothing here is going to disappear while you are looking at it. That is the whole point of a page: it holds still, and you do the moving.',
  'A note on the full stop. It is an ordinary full stop, slightly heavier than the others, and it has been there since the page was made. It does not do anything. Full stops never do. They sit at the ends of things and make sure the things end.',
  'In closing: permanence is not a feature you switch on. It is what is left when nothing pulls hard enough. Nothing here pulls hard enough. Probably.',
];
const IDLE_LINE = "It's fine. It is just a full stop.";
const EMPTY_LINE = 'It is waiting for you to bring it something.';
const CRIT_LINE = 'It can manage one more word. Choose carefully.';
const FALLBACK_LINE = 'Your browser declined the physics. The appetite still works.';
const URL_LINE = 'wiz.jock.pl/experiments/swallow';
const JOKES: Record<string, string> = {
  permanent: 'It ate the thesis.',
  permanence: 'It ate the thesis.',
  forever: 'Forever was shorter than advertised.',
  probably: 'The essay hedged. The hole did not.',
  toaster: 'The toaster outlived the review after all.',
  keys: 'Your keys are also in here.',
  nothing: 'Technically correct.',
};
const MEAL_KEY = 'swallow:last-meal';

// Growth coefficient in rH. The direction said 0.20; at 0.20 the third ring runs off a
// 390px phone, at 0.10 all three fit. Wednesday's verdict asked for about 0.12.
const KR = 0.12;
// Sideways share of a loose glyph's infall speed. 0.35 in the prototype; higher keeps
// letters spiralling longer before they cross the horizon.
const SWIRL = 0.6;
const CRIT_F = 0.8;
const CRIT_HOLD = 12;
const DWELL_S = 0.45;
const COLLAPSE_S = 2.5;
const HOLD_S = 1.4;
const REPRINT_S = 0.6;

const RAMP: [number, number[]][] = [
  [0, [0x7f, 0x1d, 0x1d]],
  [0.35, [0xea, 0x58, 0x0c]],
  [0.65, [0xfb, 0xbf, 0x24]],
  [0.8, [0xff, 0xfb, 0xeb]],
];
const INK = ['#d9d3c7', '#f1ece2', '#7d7a86'];

// st: 0 on the page, 1 loose and falling, 2 swallowed (shrinking), 3 gone, 4 in orbit.
// off: measured but outside the visible text box, so not on the page at this viewport
// height. slot: its place in reading order on its orbit ring, kept so the ring can be
// re-laid at a new size without reshuffling who survived.
type Glyph = {
  ch: string; kind: number; hx: number; hy: number; bo: number; w: number; h: number;
  x: number; y: number; a: number; s: number; st: number; word: number; t0: number;
  fx: number; fy: number; fa: number; ring: number; phi: number; slot: number; tok: number;
  s1: boolean; rev: number; drawn: boolean; alpha: number; off: boolean; el: number;
};
type Word = { text: string; left: number; x: number; y: number };
type Meal = { word: string; secs: number };
type Card = { num: string; eaten: number; secs: number; word: string; footer: string; k: number; copy: string };
type Snap = {
  rH: number; tE: number; rot: number; glow: number[]; lh: number; rMax: number; font: string; bo: number;
  rings: { ch: string; x: number; y: number; a: number }[]; mono: string; pixel: string;
};
type QA = Record<string, unknown>;

function ramp(f: number) {
  const x = Math.min(CRIT_F, Math.max(0, f));
  for (let i = 1; i < RAMP.length; i++) {
    if (x <= RAMP[i][0]) {
      const [a, ca] = RAMP[i - 1];
      const [b, cb] = RAMP[i];
      const t = (x - a) / (b - a);
      return ca.map((c, j) => (c + (cb[j] - c) * t) / 255);
    }
  }
  return RAMP[RAMP.length - 1][1].map((c) => c / 255);
}

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = (u: number) => 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
  const cy = (u: number) => 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  const dx = (u: number) => 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
  return (t: number) => {
    let u = t;
    for (let i = 0; i < 8; i++) {
      const d = dx(u);
      if (Math.abs(d) < 1e-5) break;
      u = Math.min(1, Math.max(0, u - (cx(u) - t) / d));
    }
    return cy(u);
  };
}
const easeIn = bezier(0.55, 0, 1, 0.45);

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// A word is a space-separated token with leading and trailing punctuation stripped, so
// `load-bearing` and `It's` keep their inner marks and `2014,` becomes `2014`.
const wordText = (tok: string) => tok.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
const isAlnum = (ch: string) => /[A-Za-z0-9]/.test(ch);

function footerFor(word: string, k: number) {
  const joke = JOKES[word.toLowerCase()];
  if (joke) return joke;
  if (k <= 120) return `${k} letters in orbit. They will be fine.`;
  if (k <= 260) return `${k} letters in orbit. Permanence, as promised.`;
  return `${k} letters in orbit. It was full.`;
}

const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `precision highp float;
uniform sampler2D u_src; uniform vec2 u_res; uniform float u_sc; uniform vec2 u_h;
uniform float u_rH; uniform float u_tE; uniform vec3 u_glow; uniform float u_rot; uniform float u_gain; uniform float u_core;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y * u_sc - gl_FragCoord.y) / u_sc;
  vec2 r = p - u_h; float d2 = max(dot(r, r), 1e-4); float d = sqrt(d2);
  vec3 col = vec3(0.0);
  vec2 s = p - (u_tE * u_tE / d2) * r;
  vec2 uv = s / u_res;
  if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) col = texture2D(u_src, uv).rgb;
  float inside = 1.0 - smoothstep(u_rH - 0.8, u_rH + 0.8, d);
  col = mix(col, vec3(0.851, 0.827, 0.780) * u_core, inside);
  float x = d / u_rH;
  float g = smoothstep(1.1, 1.35, x) * (1.0 - smoothstep(1.35, 1.9, x));
  float ang = atan(r.y, r.x);
  float dop = 1.0 + 0.6 * (0.5 + 0.5 * cos(ang - u_rot));
  col += u_glow * g * dop * u_gain * (1.0 - u_core);
  float rim = 1.0 - smoothstep(0.35, 1.1, abs(d - 1.04 * u_rH));
  col = mix(col, vec3(1.0, 0.969, 0.878), rim * (1.0 - u_core));
  gl_FragColor = vec4(col, 1.0);
}`;

function initGL(gl: WebGLRenderingContext) {
  const sh = (type: number, s: string) => {
    const o = gl.createShader(type);
    if (!o) return null;
    gl.shaderSource(o, s);
    gl.compileShader(o);
    return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VS);
  const fs = sh(gl.FRAGMENT_SHADER, FS);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const U: Record<string, WebGLUniformLocation | null> = {};
  for (const n of ['u_src', 'u_res', 'u_sc', 'u_h', 'u_rH', 'u_tE', 'u_glow', 'u_rot', 'u_gain', 'u_core']) U[n] = gl.getUniformLocation(prog, n);
  return U;
}

// The saved card: the final frame re-rendered at 1080x1080 from the live ring state, then a
// 270px band with the run's numbers. Same lens maths as the shader, done per pixel once.
function renderCard(sn: Snap, card: Card): Promise<Blob | null> {
  const C = document.createElement('canvas');
  C.width = 1080;
  C.height = 1350;
  const c = C.getContext('2d');
  if (!c) return Promise.resolve(null);
  const side = 2 * (sn.rMax + 1.5 * sn.lh);
  const sc = 1080 / side;
  const img = c.createImageData(1080, 1080);
  const px = img.data;
  const [gr, gg, gb] = sn.glow;
  const gain = 0.55 + 0.6 * CRIT_F;
  for (let y = 0; y < 1080; y++) {
    for (let x = 0; x < 1080; x++) {
      const rx = (x + 0.5 - 540) / sc;
      const ry = (y + 0.5 - 540) / sc;
      const d = Math.hypot(rx, ry);
      const q = d / sn.rH;
      let r = 0;
      let g = 0;
      let b = 0;
      const glow = smooth(1.1, 1.35, q) * (1 - smooth(1.35, 1.9, q));
      if (glow > 0) {
        const dop = 1 + 0.6 * (0.5 + 0.5 * Math.cos(Math.atan2(ry, rx) - sn.rot));
        const k = glow * dop * gain;
        r = gr * k; g = gg * k; b = gb * k;
      }
      const rim = 1 - smooth(0.35, 1.1, Math.abs(d - 1.04 * sn.rH));
      r += (1 - r) * rim; g += (0.969 - g) * rim; b += (0.878 - b) * rim;
      const i = (y * 1080 + x) * 4;
      px[i] = Math.min(255, r * 255); px[i + 1] = Math.min(255, g * 255); px[i + 2] = Math.min(255, b * 255); px[i + 3] = 255;
    }
  }
  c.putImageData(img, 0, 0);
  // Stars behind the hole, each drawn at both of its lensed images, so they gather into a
  // faint Einstein ring the way the live page's starfield does.
  const rnd = mulberry(1042);
  for (let i = 0; i < 260; i++) {
    const sx = (rnd() * 1080 - 540) / sc;
    const sy = (rnd() * 1080 - 540) / sc;
    const al = (0.35 + rnd() * 0.55) * 0.8;
    const sz = rnd() < 0.7 ? 2 : 3;
    const bb = Math.hypot(sx, sy);
    if (bb < 1) continue;
    for (const sign of [1, -1]) {
      const th = (bb + sign * Math.sqrt(bb * bb + 4 * sn.tE * sn.tE)) / 2;
      const ix = (sx / bb) * th;
      const iy = (sy / bb) * th;
      if (Math.hypot(ix, iy) < sn.rH * 1.2) continue;
      c.fillStyle = `rgba(207,216,255,${(sign > 0 ? al : al * 0.5).toFixed(3)})`;
      c.fillRect(Math.round(540 + ix * sc), Math.round(540 + iy * sc), sz, sz);
    }
  }
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  c.fillStyle = '#f1ece2';
  c.font = sn.font.replace(/(\d+(\.\d+)?)px/, (_, n) => `${(Number(n) * sc).toFixed(1)}px`);
  for (const g of sn.rings) {
    c.save();
    c.translate(540 + g.x * sc, 540 + g.y * sc);
    c.rotate(g.a);
    c.fillText(g.ch, 0, sn.bo * sc);
    c.restore();
  }
  c.fillStyle = '#0b0b10';
  c.fillRect(0, 1080, 1080, 270);
  c.fillStyle = '#2a2833';
  c.fillRect(0, 1080, 1080, 2);
  c.textAlign = 'left';
  const fit = (text: string, size: number, fam: string, max: number) => {
    let s = size;
    c.font = `${s}px ${fam}`;
    while (c.measureText(text).width > max && s > 20) { s -= 1; c.font = `${s}px ${fam}`; }
  };
  c.fillStyle = '#f1ece2';
  fit(`Swallow ${card.num}.`, 44, sn.pixel, 968);
  c.fillText(`Swallow ${card.num}.`, 56, 1080 + 66);
  c.fillStyle = '#d9d3c7';
  const stat = `Ate ${card.eaten.toLocaleString('en-US')} characters in ${card.secs} seconds.`;
  fit(stat, 32, sn.mono, 968);
  c.fillText(stat, 56, 1080 + 120);
  const pre = 'Last word in: "';
  const post = '".';
  fit(pre + card.word + post, 32, sn.mono, 968);
  let x = 56;
  c.fillText(pre, x, 1080 + 166);
  x += c.measureText(pre).width;
  c.fillStyle = '#fbbf24';
  c.fillText(card.word, x, 1080 + 166);
  x += c.measureText(card.word).width;
  c.fillStyle = '#d9d3c7';
  c.fillText(post, x, 1080 + 166);
  fit(card.footer, 32, sn.mono, 968);
  c.fillText(card.footer, 56, 1080 + 212);
  c.fillStyle = '#7d7a86';
  c.font = `26px ${sn.mono}`;
  c.textAlign = 'right';
  c.fillText(URL_LINE, 1024, 1080 + 250);
  return new Promise((res) => C.toBlob((b) => res(b), 'image/png'));
}

export default function Page() {
  const pageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const refitRef = useRef<(() => void) | null>(null);
  const reprintRef = useRef(false);
  const reducedRef = useRef(false);
  const snapRef = useRef<(() => Snap) | null>(null);
  const blobRef = useRef<Promise<Blob | null> | null>(null);
  const timersRef = useRef<number[]>([]);
  const [boot, setBoot] = useState(0);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState('page');
  const [live, setLive] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [fallback, setFallback] = useState(false);
  const [wide, setWide] = useState(false);
  const [count, setCount] = useState(0);
  const [note, setNote] = useState('');
  const [card, setCard] = useState<Card | null>(null);
  const [cardUp, setCardUp] = useState(false);
  const [saveLbl, setSaveLbl] = useState('Save card');
  const [copyLbl, setCopyLbl] = useState('Copy');
  const [reserve, setReserve] = useState(0);

  // Everything that belongs to this visitor or this browser is read here, after the first
  // render, so the static HTML and the first client render stay identical.
  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const raw = window.localStorage.getItem(MEAL_KEY);
      const m = raw ? (JSON.parse(raw) as Meal) : null;
      if (m && typeof m.word === 'string' && typeof m.secs === 'number') { setMeal(m); setRepeat(true); }
    } catch {}
    const probe = document.createElement('canvas').getContext('webgl');
    if (!probe) setFallback(true);
    else probe.getExtension('WEBGL_lose_context')?.loseContext();
    setBoot(1);
  }, []);

  useEffect(() => {
    if (!boot) return;
    const page = pageRef.current;
    const layer = layerRef.current;
    if (!page || !layer) return;
    let dead = false;
    let raf = 0;
    // The visible viewport, read from the page box itself (main is h-[100dvh]) rather than
    // from innerHeight, so the canvas can never disagree with the layout the glyphs were
    // measured in. A phone's toolbar and the fallback banner both change this box without
    // changing its width, which is what refit() reconciles.
    const boxNow = () => ({
      w: Math.round(page.getBoundingClientRect().width) || window.innerWidth,
      h: Math.round(page.getBoundingClientRect().height) || window.innerHeight,
    });
    let { w: W, h: H } = boxNow();
    let S = Math.min(W, H);
    let isWide = W >= 768 && W > H;
    const reduced = reducedRef.current;
    const reprint = reprintRef.current;
    reprintRef.current = false;
    setWide(isWide);
    layer.style.opacity = '0';
    // Development only. A production build must not hand the live state object out on a URL.
    const qa = process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).has('qa');

    const st = {
      phase: 'boot', f: 0, eaten: 0, total: 0, hx: 0, hy: 0, rH: 5, tE: 19, rPull: 37, lastWord: '',
      secs: 0, k: 0, scale: 1, fallback: false, loose: 0, glLosses: 0, dprDrops: 0, wide: isWide,
    };

    let glyphs: Glyph[] = [];
    let words: Word[] = [];
    let total = 0;
    let holeX = 0;
    let holeY = 0;
    let tx = 0;
    let ty = 0;
    let fonts = ['', '', ''];
    let mono = 'monospace';
    let pixel = 'monospace';
    let lh = 24;
    let advRing = 9;
    let clip = 0;
    let dotY = 0;
    let elTops: number[] = [];
    let fitted = false;
    let scale = Math.min(2, window.devicePixelRatio || 1);

    let view = document.createElement('canvas');
    const over = document.createElement('canvas');
    const src = document.createElement('canvas');
    const txt = document.createElement('canvas');
    const stars = document.createElement('canvas');
    const sctx = src.getContext('2d')!;
    const tctx = txt.getContext('2d')!;
    const stx = stars.getContext('2d')!;
    const octx = over.getContext('2d')!;
    let gl: WebGLRenderingContext | null = null;
    let U: Record<string, WebGLUniformLocation | null> | null = null;
    let mctx: CanvasRenderingContext2D | null = null;
    const place = (c: HTMLCanvasElement) => {
      c.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;`;
      c.setAttribute('aria-hidden', 'true');
    };

    // The bottom edge of the visible text, rounded down to a whole line so a shorter viewport
    // never leaves half a line of letters on the canvas. The essay box is capped by 100dvh,
    // so this edge moves whenever the viewport height or the reserved header does.
    function clipNow() {
      const essay = page!.querySelector<HTMLElement>('[data-essay]');
      const r = essay?.getBoundingClientRect();
      const bottom = Math.min(r ? r.bottom : H, H - 24);
      if (!r) return bottom + 0.5;
      return r.top + Math.max(0, Math.floor((bottom - r.top) / lh)) * lh + 0.5;
    }

    // Which measured glyphs are on the page at the current height, and how many there are.
    // A glyph that drops out of the box stops counting toward the meal and stops being
    // painted; one that comes back in is painted again, so a toolbar is reversible.
    function markOff() {
      clip = clipNow();
      let n = 0;
      for (const g of glyphs) {
        const off = g.hy + g.h / 2 > clip;
        if (off && !g.off) g.drawn = false;
        g.off = off;
        if (!off) n++;
      }
      total = n;
      st.total = n;
    }

    // Measure every character of the essay from the laid-out DOM, including the ones the
    // essay box currently clips: they are laid out, so a taller viewport can reveal them
    // without a reprint.
    function measure() {
      const range = document.createRange();
      const essay = page!.querySelector<HTMLElement>('[data-essay]');
      if (essay) lh = parseFloat(getComputedStyle(essay).lineHeight) || lh;
      const clipAt = clipNow();
      const dot = page!.querySelector<HTMLElement>('[data-dot]');
      if (dot) {
        const r = dot.getBoundingClientRect();
        holeX = r.left + r.width / 2;
        holeY = r.top + r.height / 2;
        dotY = holeY;
      }
      const out: Glyph[] = [];
      const ws: Word[] = [];
      const kindFont: string[] = ['', '', ''];
      let tok = 0;
      const kindBo = [NaN, NaN, NaN];
      const els = Array.from(page!.querySelectorAll<HTMLElement>('[data-g]'));
      elTops = els.map((e) => e.getBoundingClientRect().top);
      for (let ei = 0; ei < els.length; ei++) {
        const el = els[ei];
        const kind = Number(el.dataset.g);
        const cs = getComputedStyle(el);
        const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        if (!kindFont[kind]) kindFont[kind] = font;
        if (kind === 0) { mono = cs.fontFamily; lh = parseFloat(cs.lineHeight) || lh; }
        if (kind === 1) pixel = cs.fontFamily;
        // Baseline offset per font: a zero-size inline-block sits on the baseline. Taken once
        // per kind, from the first element of that kind, whose first letter shares the probe's
        // line (a later span can start at a wrap, which would put the probe a line too high).
        let base = NaN;
        if (Number.isNaN(kindBo[kind])) {
          const probe = document.createElement('span');
          probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline;';
          el.insertBefore(probe, el.firstChild);
          base = probe.getBoundingClientRect().bottom;
          probe.remove();
        }
        const s1 = el.dataset.s1 !== undefined;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const text = n.nodeValue || '';
          let i = 0;
          while (i < text.length) {
            if (text[i] === ' ') { i++; continue; }
            let j = i;
            while (j < text.length && text[j] !== ' ') j++;
            const wt = wordText(text.slice(i, j));
            const wi = wt ? ws.push({ text: wt, left: 0, x: 0, y: 0 }) - 1 : -1;
            let n0 = 0;
            for (let k = i; k < j; k++) {
              range.setStart(n, k);
              range.setEnd(n, k + 1);
              const r = range.getBoundingClientRect();
              if (!r.width) continue;
              const cy = r.top + r.height / 2;
              if (Number.isNaN(kindBo[kind])) kindBo[kind] = base - cy;
              const ch = text[k];
              const word = wi >= 0 && isAlnum(ch) ? wi : -1;
              if (word >= 0) { const w = ws[wi]; w.x += r.left + r.width / 2; w.y = cy; w.left++; n0++; }
              out.push({
                ch, kind, hx: r.left + r.width / 2, hy: cy, bo: 0, w: r.width, h: r.height,
                x: 0, y: 0, a: 0, s: 1, st: 0, word, t0: 0, fx: 0, fy: 0, fa: 0, ring: -1, phi: 0,
                slot: 0, tok, s1, rev: 0, drawn: false, alpha: 1, off: r.bottom > clipAt, el: ei,
              });
            }
            if (wi >= 0 && n0) ws[wi].x /= n0;
            tok++;
            i = j;
          }
        }
      }
      for (const g of out) g.bo = Number.isNaN(kindBo[g.kind]) ? 0 : kindBo[g.kind];
      fonts = kindFont;
      glyphs = out;
      words = ws;
      markOff();
      tx = holeX;
      ty = holeY;
      // Typewriter order for a reprint: line by line, left to right, over the lines that are
      // actually on the page at this height.
      const rows = Array.from(new Set(out.filter((g) => !g.off).map((g) => Math.round(g.hy)))).sort((a, b) => a - b);
      const rowOf = new Map(rows.map((y, i) => [y, i]));
      for (const g of out) {
        const r = rowOf.get(Math.round(g.hy)) ?? 0;
        g.rev = (REPRINT_S * (r + Math.min(1, g.hx / W))) / Math.max(1, rows.length);
      }
    }

    function drawStatic(g: Glyph) {
      tctx.font = fonts[g.kind];
      tctx.fillStyle = INK[g.kind];
      tctx.fillText(g.ch, g.hx, g.hy + g.bo);
      g.drawn = true;
    }

    function sizeAll(sc: number) {
      scale = sc;
      st.scale = sc;
      for (const c of [view, over, src, txt, stars]) { c.width = Math.round(W * sc); c.height = Math.round(H * sc); }
      for (const c of [sctx, tctx, stx, octx]) c.setTransform(sc, 0, 0, sc, 0, 0);
      const rnd = mulberry(4242);
      stx.fillStyle = '#cfd8ff';
      for (let i = 0; i < (W < 768 ? 90 : 220); i++) {
        stx.globalAlpha = 0.35 + rnd() * 0.55;
        const s = rnd() < 0.7 ? 1 : 2;
        stx.fillRect(Math.floor(rnd() * W), Math.floor(rnd() * H), s, s);
      }
      stx.globalAlpha = 1;
      tctx.textAlign = 'center';
      tctx.textBaseline = 'alphabetic';
      for (const g of glyphs) if (g.st === 0 && g.drawn && !g.off) drawStatic(g);
      if (gl) gl.viewport(0, 0, view.width, view.height);
      if (mctx) mctx.setTransform(sc, 0, 0, sc, 0, 0);
    }

    // Reconcile the canvas with a layout that changed under it, without ending the run: a
    // phone toolbar changing the height, the fallback banner reserving more room for itself,
    // or the result card mounting and taking its real height. Everything that was measured
    // once and then used forever gets read again here.
    function refit() {
      if (!fitted || dead) return;
      const box = boxNow();
      const dot = page!.querySelector<HTMLElement>('[data-dot]')?.getBoundingClientRect();
      const dyNow = dot ? dot.top + dot.height / 2 : dotY;
      const dy = dyNow - dotY;
      W = box.w;
      H = box.h;
      S = Math.min(W, H);
      const nowWide = W >= 768 && W > H;
      if (nowWide !== isWide) { isWide = nowWide; setWide(nowWide); }
      // The header can reserve more or less room than it did, which moves the text block but
      // not the crumb pinned to the top corner. Each measured element reports its own shift,
      // so its letters move with it and nothing else does. Letters already in flight keep
      // their own position; so does a hole the visitor has already taken hold of.
      const els = Array.from(page!.querySelectorAll<HTMLElement>('[data-g]'));
      if (els.length === elTops.length) {
        const tops = els.map((e) => e.getBoundingClientRect().top);
        if (tops.some((y, i) => y !== elTops[i])) {
          for (const g of glyphs) {
            const d = tops[g.el] - elTops[g.el];
            if (d) g.hy += d;
          }
          for (const w of words) w.y += dy;
          elTops = tops;
        }
      }
      if (dy) {
        dotY = dyNow;
        if (!wallFirst) { holeY += dy; ty += dy; }
      }
      markOff();
      place(view);
      place(over);
      sizeAll(scale);
      if (ph !== 'reprint' && ph !== 'boot') {
        for (const g of glyphs) if (g.st === 0 && !g.off && !g.drawn) drawStatic(g);
      }
      clampHole();
      if (ended()) { layRings(); spinRings(); }
    }

    function to2D() {
      gl = null;
      U = null;
      const fresh = document.createElement('canvas');
      place(fresh);
      fresh.width = view.width;
      fresh.height = view.height;
      view.replaceWith(fresh);
      view = fresh;
      mctx = view.getContext('2d');
      mctx?.setTransform(scale, 0, 0, scale, 0, 0);
      st.fallback = true;
      setFallback(true);
    }

    const onLost = (e: Event) => {
      e.preventDefault();
      st.glLosses++;
      if (st.glLosses >= 2) to2D();
    };
    const onRestored = () => {
      if (!gl) return;
      U = initGL(gl);
      if (!U) to2D();
      else gl.viewport(0, 0, view.width, view.height);
    };

    function setupView() {
      place(view);
      place(over);
      layer!.appendChild(view);
      layer!.appendChild(over);
      if (!st.fallback) {
        gl = view.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
        if (gl) {
          U = initGL(gl);
          view.addEventListener('webglcontextlost', onLost);
          view.addEventListener('webglcontextrestored', onRestored);
        }
        if (!gl || !U) to2D();
      } else {
        mctx = view.getContext('2d');
      }
    }

    // Run state.
    let ph = 'boot';
    let t = 0;
    let last = 0;
    let slow = 0;
    let tStart = 0;
    let idleT = 0;
    let nextCreep = 8;
    let playT = 0;
    let wallFirst = 0;
    let critT = 0;
    let tc = 0;
    let shown = false;
    let lastCount = -1;
    let noteNow = '';
    let frozen = { rH: 0, tE: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
    let ringR: number[] = [];
    let rot = 0;
    let resultCard: Card | null = null;
    let cand = -1;
    let prevCand = -1;
    let dwell = 0;
    const setPh = (p: string) => { ph = p; st.phase = p; setPhase(p); };
    const say = (s: string) => { if (s !== noteNow) { noteNow = s; setNote(s); } };
    const clampHole = () => {
      holeX = Math.min(W - 8, Math.max(8, holeX));
      holeY = Math.min(H - 8, Math.max(8, holeY));
      tx = Math.min(W - 8, Math.max(8, tx));
      ty = Math.min(H - 8, Math.max(8, ty));
    };
    const ended = () => ph === 'collapse' || ph === 'ring' || ph === 'result';
    const radii = () => {
      const fc = Math.min(st.f, CRIT_F);
      let rH = 5 + KR * S * Math.sqrt(fc);
      if ((ph === 'ready' || ph === 'play') && !reduced) rH += Math.sin((t * 2 * Math.PI) / 2.4);
      if (ph === 'critical') rH = 5 + KR * S * Math.sqrt(CRIT_F) + (reduced ? 0 : 2 * Math.sin(t * 14));
      if (ended()) return { rH: frozen.rH, tE: frozen.tE, rPull: 2.6 * frozen.rH + 24 };
      return { rH, tE: 1.8 * rH + 10, rPull: 2.6 * rH + 24 };
    };

    // Input. Touch and pen: relative drag, the hole moves by the finger's own delta, so the
    // thumb never covers it. Mouse: grab the hole and it sits under the cursor with 60ms of
    // easing; a press anywhere else falls back to the same relative drag.
    let active: number | null = null;
    let mouse = false;
    let grab = false;
    let lx = 0;
    let ly = 0;
    const grabR = () => Math.max(st.rH + 8, 16);
    const canSteer = () => ph === 'ready' || ph === 'play' || ph === 'critical';
    const onDown = (e: PointerEvent) => {
      if (!canSteer() || active !== null) return;
      e.preventDefault();
      active = e.pointerId;
      mouse = e.pointerType === 'mouse';
      lx = e.clientX;
      ly = e.clientY;
      grab = mouse && Math.hypot(e.clientX - holeX, e.clientY - holeY) <= grabR();
      if (grab) { tx = e.clientX; ty = e.clientY; }
      if (mouse) layer!.style.cursor = 'none';
      try { layer!.setPointerCapture(e.pointerId); } catch {}
      if (ph === 'ready') {
        setPh('play');
        playT = t;
        wallFirst = performance.now();
        say('');
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== active) {
        if (e.pointerType === 'mouse' && active === null) {
          layer!.style.cursor = canSteer() && Math.hypot(e.clientX - holeX, e.clientY - holeY) <= grabR() ? 'grab' : '';
        }
        return;
      }
      e.preventDefault();
      if (!canSteer()) return;
      if (grab) { tx = e.clientX; ty = e.clientY; } else { tx += e.clientX - lx; ty += e.clientY - ly; }
      lx = e.clientX;
      ly = e.clientY;
      clampHole();
      if (!mouse) { holeX = tx; holeY = ty; }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== active) return;
      active = null;
      grab = false;
      layer!.style.cursor = '';
    };

    const loosen = (g: Glyph) => {
      g.st = 1;
      g.x = g.hx;
      g.y = g.hy;
      g.a = 0;
      if (g.drawn) tctx.clearRect(g.hx - g.w / 2 - 0.5, g.hy - g.h / 2 - 0.5, g.w + 1, g.h + 1);
    };
    const eat = (g: Glyph) => {
      g.st = 2;
      g.t0 = t;
      st.eaten++;
      if ((ph === 'play' || ph === 'ready') && g.word >= 0) {
        const wd = words[g.word];
        wd.left--;
        if (wd.left === 0) st.lastWord = wd.text;
      }
    };

    // The space the card leaves free. On a phone the card is a bottom sheet, on a wide screen
    // a right-hand panel. Its real height is its text, not the min-h floor, so it is measured
    // once it exists; a transform does not change the measured size, so this reads the same
    // whether the sheet is still sliding up or already in place.
    function freeArea() {
      const r = document.querySelector<HTMLElement>('[data-card]')?.getBoundingClientRect();
      if (isWide) return { x1: r?.width ? W - r.width : W - 400, y1: H };
      return { x1: W, y1: r?.height ? H - r.height : 0.58 * H };
    }

    // Centre and radii of the orbit, derived from the free area every time it changes, so a
    // shorter viewport moves the rings instead of letting the card cover them.
    function layRings() {
      const area = freeArea();
      const cx = area.x1 / 2;
      const cy = isWide ? H / 2 : area.y1 / 2;
      frozen.x1 = cx;
      frozen.y1 = cy;
      tctx.font = fonts[0];
      advRing = tctx.measureText('M').width;
      const fit = Math.min(cx, area.x1 - cx, cy, area.y1 - cy) - 0.75 * lh;
      ringR = [0, 1.2, 2.4].map((k) => 1.25 * frozen.tE + k * lh);
      if (ringR[2] > fit) {
        const m = Math.max(0.5, fit / ringR[2]);
        ringR = ringR.map((R) => Math.max(1.95 * frozen.rH + 0.5 * lh, R * m));
      }
    }

    // A short arc is centred on 12 o'clock. A long one starts at 10 o'clock, so the opening
    // words always run left to right over the top. The step is capped at one full turn minus
    // a slot, so a ring that had to shrink packs tighter instead of wrapping over its seam:
    // who is in orbit never changes once the card has been written.
    function spinRings() {
      const fill = [0, 0, 0];
      for (const g of glyphs) if (g.st === 4) fill[g.ring] = Math.max(fill[g.ring], g.slot + 1);
      for (const g of glyphs) {
        if (g.st !== 4) continue;
        const step = Math.min(advRing / ringR[g.ring], (2 * Math.PI) / (fill[g.ring] + 1));
        const span = fill[g.ring] * step;
        g.phi = -Math.PI / 2 - Math.min(span / 2, Math.PI / 3) + (g.slot + 0.5) * step;
      }
    }

    function collapse() {
      const r = radii();
      setPh('collapse');
      say('');
      st.secs = wallFirst ? Math.round((performance.now() - wallFirst) / 1000) : 0;
      frozen = { rH: r.rH, tE: r.tE, x0: holeX, y0: holeY, x1: 0, y1: 0 };
      layRings();
      tc = t;
      tctx.clearRect(0, 0, W, H);
      // One slot short of a full turn, so a full ring keeps a visible seam where it starts.
      const ringN = ringR.map((R) => Math.floor((2 * Math.PI * R) / advRing) - 1);
      const left = glyphs.filter((g) => !g.off && (g.st === 0 || g.st === 1));
      // Lay the leftovers on the rings in reading order, one empty slot between tokens, and
      // wrap a whole token to the next ring rather than split it across two.
      let ring = 0;
      let slot = 0;
      const fill = [0, 0, 0];
      for (let i = 0; i < left.length; i++) {
        const g = left[i];
        if (ring > 2) { if (g.st === 0) loosen(g); continue; }
        g.fx = g.st === 0 ? g.hx : g.x;
        g.fy = g.st === 0 ? g.hy : g.y;
        g.fa = g.st === 0 ? 0 : g.a;
        if (i === 0 || left[i - 1].tok !== g.tok) {
          let len = 0;
          while (i + len < left.length && left[i + len].tok === g.tok) len++;
          if (slot > 0) slot++;
          if (slot + len > ringN[ring] && slot > 0 && len < ringN[ring]) { ring++; slot = 0; }
        }
        if (ring <= 2 && slot >= ringN[ring]) { ring++; slot = 0; }
        if (ring > 2) { loosen(g); continue; }
        g.st = 4;
        g.ring = ring;
        g.slot = slot;
        g.kind = 0;
        fill[ring] = slot + 1;
        slot++;
      }
      spinRings();
      st.k = glyphs.filter((g) => g.st === 4).length;
      const word = st.lastWord || 'sentence';
      const sum = Array.from(word).reduce((a, ch) => a + ch.charCodeAt(0), 0);
      const num = String((st.eaten * 31 + st.secs * 7 + sum) % 10000).padStart(4, '0');
      const n = st.eaten.toLocaleString('en-US');
      const result: Card = {
        num, eaten: st.eaten, secs: st.secs, word, footer: footerFor(word, st.k), k: st.k,
        copy: `Swallow ${num}. Ate ${n} characters in ${st.secs} seconds. Last word in: "${word}". ${URL_LINE}`,
      };
      resultCard = result;
      setCard(result);
      try { window.localStorage.setItem(MEAL_KEY, JSON.stringify({ word, secs: st.secs })); } catch {}
      setMeal({ word, secs: st.secs });
      snapRef.current = () => ({
        rH: frozen.rH, tE: frozen.tE, rot, glow: ramp(CRIT_F), lh, rMax: Math.max(ringR[0], ...ringR.filter((_, i) => fill[i] > 0)),
        font: fonts[0], bo: glyphs.find((g) => g.kind === 0)?.bo ?? 0, mono, pixel,
        rings: glyphs.filter((g) => g.st === 4).map((g) => ({ ch: g.ch, x: g.x - holeX, y: g.y - holeY, a: g.a })),
      });
    }

    function frame(now: number) {
      if (dead) return;
      raf = requestAnimationFrame(frame);
      const raw = last ? now - last : 16;
      last = now;
      const dt = Math.min(raw / 1000, 1 / 30);
      t += dt;
      // Sustained frames over 20ms drop the whole pass to DPR 1, upscaled, with no message.
      if (raw > 20 && raw < 250) slow++; else slow = 0;
      if (slow >= 30 && scale > 1 && gl) { st.dprDrops++; sizeAll(1); slow = 0; }

      if (ph === 'reprint') {
        const u = t - tStart;
        for (const g of glyphs) if (!g.drawn && !g.off && g.rev <= u) drawStatic(g);
        if (u >= REPRINT_S) { for (const g of glyphs) if (!g.drawn && !g.off) drawStatic(g); setPh('ready'); }
      }
      if (mouse && canSteer()) {
        const k = 1 - Math.exp(-dt / 0.06);
        holeX += (tx - holeX) * k;
        holeY += (ty - holeY) * k;
      }
      clampHole();
      st.f = total ? st.eaten / total : 0;
      if (ended()) {
        const u = Math.min(1, (t - tc) / (reduced ? 0.6 : COLLAPSE_S));
        const e = reduced ? (u >= 0.5 ? 1 : 0) : easeIn(u);
        holeX = frozen.x0 + (frozen.x1 - frozen.x0) * e;
        holeY = frozen.y0 + (frozen.y1 - frozen.y0) * e;
      }
      const { rH, tE, rPull } = radii();
      st.hx = holeX; st.hy = holeY; st.rH = rH; st.tE = tE; st.rPull = rPull;

      // Idle: after 8s untouched the hole starts on its own sentence, one glyph per 2.5s,
      // nearest first. The line arrives at 20s. In play, an empty margin gets its own line.
      if (ph === 'ready') {
        idleT += dt;
        if (idleT >= nextCreep) {
          nextCreep += 2.5;
          let best: Glyph | null = null;
          let bd = Infinity;
          for (const g of glyphs) {
            if (g.st !== 0 || g.off || !g.s1) continue;
            const d = (g.hx - holeX) ** 2 + (g.hy - holeY) ** 2;
            if (d < bd) { bd = d; best = g; }
          }
          if (best) loosen(best);
        }
        if (idleT >= 20) say(IDLE_LINE);
      } else if (ph === 'play') {
        if (t - playT > 30 && st.f < 0.02) say(EMPTY_LINE);
        else if (noteNow === EMPTY_LINE && st.f >= 0.02) say('');
      }

      if (ph === 'play') {
        const r2 = rPull * rPull;
        for (const g of glyphs) if (g.st === 0 && !g.off && (g.hx - holeX) ** 2 + (g.hy - holeY) ** 2 < r2) loosen(g);
      }
      let loose = 0;
      for (const g of glyphs) {
        if (g.st === 1) {
          loose++;
          const dx = holeX - g.x;
          const dy = holeY - g.y;
          const d = Math.max(1, Math.hypot(dx, dy));
          if (d < rH) { eat(g); continue; }
          const v = Math.min(600, 40 * (rPull / d) ** 2);
          const ux = dx / d;
          const uy = dy / d;
          const vx = ux * v - uy * v * SWIRL;
          const vy = uy * v + ux * v * SWIRL;
          g.x += vx * dt;
          g.y += vy * dt;
          if (!reduced) {
            // Tip toward the path's tangent: the baseline turns to lie along the motion,
            // never more than 90 degrees from upright, at up to 4 rad/s.
            let want = Math.atan2(vy, vx);
            while (want > Math.PI / 2) want -= Math.PI;
            while (want < -Math.PI / 2) want += Math.PI;
            const step = 4 * dt;
            g.a += Math.max(-step, Math.min(step, want - g.a));
          }
        } else if (g.st === 2) {
          g.s = 1 - (t - g.t0) / 0.12;
          g.x += (holeX - g.x) * 0.3;
          g.y += (holeY - g.y) * 0.3;
          if (g.s <= 0) g.st = 3;
        } else if (g.st === 4) {
          loose++;
          const u = Math.min(1, (t - tc) / (reduced ? 0.6 : COLLAPSE_S));
          const period = [40, 55, 70][g.ring];
          const phi = g.phi + (reduced ? 0 : ((t - tc) * 2 * Math.PI) / period);
          const R = ringR[g.ring];
          const rx = holeX + R * Math.cos(phi);
          const ry = holeY + R * Math.sin(phi);
          let ta = phi + Math.PI / 2;
          while (ta - g.fa > Math.PI) ta -= 2 * Math.PI;
          while (ta - g.fa < -Math.PI) ta += 2 * Math.PI;
          if (reduced) {
            const out = u < 0.5;
            g.x = out ? g.fx : rx;
            g.y = out ? g.fy : ry;
            g.a = out ? g.fa : ta;
            g.alpha = out ? 1 - u / 0.5 : (u - 0.5) / 0.5;
          } else {
            const e = easeIn(u);
            g.x = g.fx + (rx - g.fx) * e;
            g.y = g.fy + (ry - g.fy) * e;
            g.a = g.fa + (ta - g.fa) * e;
          }
        }
      }
      st.loose = loose;
      st.f = total ? st.eaten / total : 0;

      // Critical: at 80% the pull switches off, the hole freezes at its full size and shakes,
      // and the word its centre settles on is the last word in. Settling means 0.45s on the
      // same word, so crossing other words on the way there does nothing; the candidate lights
      // amber while it is under the hole. 12s with no word and it collapses on the last word
      // the visitor finished.
      cand = -1;
      if (ph === 'play' && st.f >= CRIT_F) { setPh('critical'); critT = t; say(CRIT_LINE); }
      if (ph === 'critical') {
        let bd = (rH * 0.6) ** 2;
        for (const g of glyphs) {
          if (g.st !== 0 || g.off || g.word < 0) continue;
          const d = (g.hx - holeX) ** 2 + (g.hy - holeY) ** 2;
          if (d < bd) { bd = d; cand = g.word; }
        }
        if (cand >= 0 && cand === prevCand) dwell += dt;
        else dwell = 0;
        prevCand = cand;
        const hit = dwell >= DWELL_S ? cand : -1;
        if (hit >= 0 || t - critT > CRIT_HOLD) {
          if (hit >= 0) {
            st.lastWord = words[hit].text;
            for (const g of glyphs) {
              if (g.word === hit && g.st === 0) { loosen(g); g.st = 2; g.t0 = t; st.eaten++; }
            }
          }
          cand = -1;
          collapse();
        }
      }
      if (ph === 'collapse' && t - tc >= (reduced ? 0.6 : COLLAPSE_S)) setPh('ring');
      if (ph === 'ring' && t - tc >= (reduced ? 0.6 : COLLAPSE_S) + HOLD_S) {
        setPh('result');
        setCardUp(true);
        const snap = snapRef.current;
        timersRef.current.push(window.setTimeout(() => {
          if (snap && resultCard && !blobRef.current) if (resultCard) blobRef.current = renderCard(snap(), resultCard);
        }, 450));
      }
      if (st.eaten !== lastCount && (Math.round(t * 60) % 6 === 0 || ph !== 'play')) { lastCount = st.eaten; setCount(st.eaten); }

      // Source page: space, stars, paper, unmoved text, loose glyphs.
      const fc = Math.min(st.f, CRIT_F);
      sctx.globalAlpha = 1;
      sctx.fillStyle = '#000';
      sctx.fillRect(0, 0, W, H);
      sctx.globalAlpha = fc;
      sctx.drawImage(stars, 0, 0, W, H);
      sctx.globalAlpha = 1 - fc;
      sctx.fillStyle = '#0b0b10';
      sctx.fillRect(0, 0, W, H);
      sctx.globalAlpha = 1;
      sctx.drawImage(txt, 0, 0, W, H);
      octx.clearRect(0, 0, W, H);
      sctx.textAlign = 'center';
      sctx.textBaseline = 'alphabetic';
      if (cand >= 0) {
        for (const g of glyphs) {
          if (g.word !== cand || g.st !== 0) continue;
          sctx.font = fonts[g.kind];
          sctx.fillStyle = '#fbbf24';
          sctx.fillText(g.ch, g.hx, g.hy + g.bo);
        }
      }
      octx.textAlign = 'center';
      octx.textBaseline = 'alphabetic';
      for (const g of glyphs) {
        if (g.st !== 1 && g.st !== 2 && g.st !== 4) continue;
        const c = g.st === 4 ? octx : sctx;
        c.save();
        c.translate(g.x, g.y);
        c.rotate(g.a);
        if (g.st === 2) c.scale(Math.max(0, g.s), Math.max(0, g.s));
        if (g.st === 4) c.globalAlpha = g.alpha;
        c.font = fonts[g.kind];
        c.fillStyle = g.st === 4 ? '#f1ece2' : INK[g.kind];
        c.fillText(g.ch, 0, g.bo);
        c.restore();
      }

      const glow = ramp(st.f);
      const core = Math.max(0, 1 - st.f / 0.02);
      const lens = Math.min(1, (t - tStart) / 1.0);
      rot = Math.PI + (reduced ? 0 : (t * 2 * Math.PI) / 6);
      if (gl && U && !gl.isContextLost()) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        gl.uniform1i(U.u_src, 0);
        gl.uniform2f(U.u_res, W, H);
        gl.uniform1f(U.u_sc, scale);
        gl.uniform2f(U.u_h, holeX, holeY);
        gl.uniform1f(U.u_rH, rH);
        gl.uniform1f(U.u_tE, tE * lens);
        gl.uniform3f(U.u_glow, glow[0], glow[1], glow[2]);
        gl.uniform1f(U.u_rot, rot);
        gl.uniform1f(U.u_gain, 0.55 + 0.6 * fc);
        gl.uniform1f(U.u_core, core);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else if (mctx) {
        mctx.drawImage(src, 0, 0, W, H);
        const gr = mctx.createRadialGradient(holeX, holeY, rH * 1.1, holeX, holeY, rH * 1.9);
        const cs = `rgba(${glow.map((c) => Math.round(c * 255)).join(',')},`;
        const a = (0.9 * (1 - core)).toFixed(3);
        gr.addColorStop(0, cs + '0)');
        gr.addColorStop(0.3, cs + a + ')');
        gr.addColorStop(1, cs + '0)');
        mctx.fillStyle = gr;
        mctx.beginPath(); mctx.arc(holeX, holeY, rH * 1.9, 0, Math.PI * 2); mctx.fill();
        mctx.fillStyle = core > 0 ? `rgba(${Math.round(217 * core)},${Math.round(211 * core)},${Math.round(199 * core)},1)` : '#000';
        mctx.beginPath(); mctx.arc(holeX, holeY, rH, 0, Math.PI * 2); mctx.fill();
        if (core < 1) {
          mctx.strokeStyle = `rgba(255,247,224,${(1 - core).toFixed(3)})`;
          mctx.lineWidth = 1.5;
          mctx.beginPath(); mctx.arc(holeX, holeY, rH * 1.04, 0, Math.PI * 2); mctx.stroke();
        }
      }
      if (!shown) { shown = true; layer!.style.opacity = '1'; setLive(true); }
    }

    // A real width change rewraps the text, so the page is reprinted from scratch. A height
    // change does not rewrap anything: the run, the meal and the card survive it, and the
    // canvas is refitted instead. A phone's toolbar only ever changes the height, and a
    // reprint there would throw away the visitor's run.
    const onResize = () => {
      if (Math.abs(boxNow().w - W) > 40) {
        reprintRef.current = true;
        setCard(null);
        setCardUp(false);
        setCount(0);
        setNote('');
        blobRef.current = null;
        setRun((r) => r + 1);
        return;
      }
      refit();
    };

    layer.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', onResize);
    // iOS hides and shows its toolbar without a window resize event; the visual viewport is
    // the surface that reports it.
    const vv = window.visualViewport;
    vv?.addEventListener('resize', onResize);
    const prevOver = document.body.style.overscrollBehavior;
    const prevFlow = document.documentElement.style.overflow;
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';

    (async () => {
      try {
        await document.fonts.ready;
        const tf = page.querySelector<HTMLElement>('[data-g="1"]');
        if (tf) await document.fonts.load(`28px ${getComputedStyle(tf).fontFamily}`);
      } catch {}
      if (dead) return;
      st.fallback = !!document.querySelector('[data-fallback]');
      measure();
      setupView();
      sizeAll(scale);
      if (reprint) {
        setPh('reprint');
      } else {
        for (const g of glyphs) drawStatic(g);
        setPh('ready');
      }
      tStart = 0;
      fitted = true;
      refitRef.current = refit;
      if (qa) {
        (window as unknown as { __swallow: QA }).__swallow = st;
        (window as unknown as { __swallowGlyphs: () => Glyph[] }).__swallowGlyphs = () => glyphs;
        (window as unknown as { __swallowWords: () => Word[] }).__swallowWords = () => words;
      }
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      dead = true;
      fitted = false;
      if (refitRef.current === refit) refitRef.current = null;
      cancelAnimationFrame(raf);
      for (const id of timersRef.current) window.clearTimeout(id);
      timersRef.current = [];
      layer.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
      vv?.removeEventListener('resize', onResize);
      document.body.style.overscrollBehavior = prevOver;
      document.documentElement.style.overflow = prevFlow;
      view.removeEventListener('webglcontextlost', onLost);
      view.removeEventListener('webglcontextrestored', onRestored);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      layer.style.cursor = '';
      view.remove();
      over.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, boot]);

  // How much room the header has to keep clear for the fallback banner, measured from the
  // banner itself rather than assumed, so a line that wraps to two or three lines on a narrow
  // phone still cannot print over the title.
  useEffect(() => {
    const read = () => {
      const el = bannerRef.current;
      setReserve(el ? Math.ceil(el.getBoundingClientRect().bottom) + 10 : 0);
    };
    read();
    if (!fallback) return;
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [fallback]);

  // Any layout change the canvas cannot see for itself: the reserved header growing, the
  // result card mounting with its real height, the wide/narrow switch.
  useEffect(() => {
    refitRef.current?.();
  }, [fallback, reserve, card, cardUp, wide]);

  const again = () => {
    reprintRef.current = true;
    blobRef.current = null;
    snapRef.current = null;
    setCardUp(false);
    setCount(0);
    setNote('');
    setRepeat(true);
    setSaveLbl('Save card');
    setCopyLbl('Copy');
    window.setTimeout(() => setCard(null), 400);
    setRun((r) => r + 1);
  };

  const flash = (set: (s: string) => void, msg: string, back: string) => {
    set(msg);
    window.setTimeout(() => set(back), 1800);
  };

  const save = async () => {
    if (!card) return;
    if (!blobRef.current && snapRef.current) blobRef.current = renderCard(snapRef.current(), card);
    const blob = await blobRef.current;
    if (!blob) return;
    const name = `swallow-${card.num}.png`;
    const file = new File([blob], name, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch && navigator.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
      try {
        await navigator.share({ files: [file], title: 'Swallow' });
        flash(setSaveLbl, 'Saved.', 'Save card');
        return;
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    flash(setSaveLbl, 'Saved.', 'Save card');
  };

  const copy = async () => {
    if (!card) return;
    try {
      await navigator.clipboard.writeText(card.copy);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = card.copy;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    flash(setCopyLbl, 'Copied.', 'Copy');
  };

  const hide = live ? 'opacity-0' : '';
  const top = Math.max(40, reserve);
  const bottom = note || (phase === 'ready' && meal ? `Last meal: "${meal.word}", ${meal.secs}s.` : '');

  return (
    <main
      data-phase={phase}
      className="fixed inset-0 z-[10000] h-[100dvh] overflow-hidden bg-black font-mono select-none overscroll-none touch-none"
    >
      <div ref={pageRef} className="absolute inset-0 bg-[#0b0b10]">
        <div data-g="2" className={`absolute left-5 top-[14px] text-[12px] leading-4 text-[#7d7a86] ${hide}`}>{CRUMB}</div>
        <article
          className="mx-auto text-[15px] leading-[24px] text-[#d9d3c7] [--lh:24px] md:text-[16px] md:leading-[26px] md:[--lh:26px]"
          style={{ width: 'min(64ch, 680px, calc(100vw - 40px))', paddingTop: top }}
        >
          <h1 data-g="1" className={`font-pixel text-[28px] font-normal leading-[32px] text-[#f1ece2] ${hide}`}>{TITLE}</h1>
          <p data-g="2" className={`mt-1 text-[12px] leading-4 text-[#7d7a86] ${hide}`}>{repeat ? BYLINE_REPEAT : BYLINE_FIRST}</p>
          <div
            data-essay
            className={`mt-4 overflow-hidden ${hide}`}
            style={{ maxHeight: `round(down, calc(100dvh - ${top + 68 + 24}px), var(--lh))` }}
          >
            <p className="mb-[var(--lh)]">
              <span data-g="0" data-s1="">{P1A}</span>
              <span data-dot className="inline-block h-[10px] w-[10px] rounded-full bg-[#d9d3c7]" />
              <span data-g="0">{P1B}</span>
            </p>
            {ESSAY.map((p) => (
              <p key={p.slice(0, 24)} data-g="0" className="mb-[var(--lh)]">{p}</p>
            ))}
          </div>
        </article>
      </div>

      <div ref={layerRef} data-layer className="absolute inset-0 z-10 touch-none" style={{ opacity: 0 }} />

      {fallback && (
        <div ref={bannerRef} data-fallback className="pointer-events-none absolute left-5 right-5 top-[34px] z-20 text-[12px] leading-4 text-[#7d7a86]">
          {FALLBACK_LINE}
        </div>
      )}
      {bottom && phase !== 'result' && phase !== 'ring' && phase !== 'collapse' && (
        <div data-note className="pointer-events-none absolute bottom-[6px] left-5 right-5 z-20 text-center text-[12px] leading-4 text-[#7d7a86]">
          {bottom}
        </div>
      )}
      {phase === 'play' && !bottom && count > 0 && (
        <div data-count className="pointer-events-none absolute bottom-[6px] right-5 z-20 text-[12px] leading-4 text-[#7d7a86]">
          {count.toLocaleString('en-US')} chars
        </div>
      )}
      {card && (
        <div
          data-card
          className={`absolute z-30 bg-[#0b0b10]/95 transition-transform duration-[400ms] ease-out motion-reduce:transition-none ${
            wide
              ? `bottom-0 right-0 top-0 flex w-[400px] flex-col justify-center border-l border-[#2a2833] px-8 ${cardUp ? 'translate-x-0' : 'translate-x-full'}`
              : `bottom-0 left-0 right-0 min-h-[42%] border-t border-[#2a2833] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 ${cardUp ? 'translate-y-0' : 'translate-y-full'}`
          }`}
        >
          <div className="font-pixel text-[28px] leading-none text-[#f1ece2]">Swallow {card.num}.</div>
          <div className="mt-3 text-[13px] leading-snug text-[#d9d3c7]">
            Ate {card.eaten.toLocaleString('en-US')} characters in {card.secs} seconds.
          </div>
          <div className="text-[13px] leading-snug text-[#d9d3c7]">
            Last word in: &quot;<span className="text-[#fbbf24]">{card.word}</span>&quot;.
          </div>
          <div className="text-[13px] leading-snug text-[#d9d3c7]">{card.footer}</div>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={save} className="h-12 w-full border border-[#3a3744] text-[14px] text-[#f1ece2] hover:border-[#7d7a86]">
              {saveLbl}
            </button>
            <button type="button" onClick={copy} className="h-12 w-full border border-[#3a3744] text-[14px] text-[#f1ece2] hover:border-[#7d7a86]">
              {copyLbl}
            </button>
            <button type="button" onClick={again} className="h-12 w-full border border-[#3a3744] text-[14px] text-[#f1ece2] hover:border-[#7d7a86]">
              Feed it again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
