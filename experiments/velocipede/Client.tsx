'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Velocipede. Build a bicycle from memory in five taps and one chain decision, then a stick
// rider tries to ride it. No physics: an outcome table over six points picks one of nine
// scripted endings. All geometry lives in sheet units: width 1.0, height SH, ground at GROUND.
// One function (buildRig) turns points and a pose into strokes, and the screen, the bounding
// box that keeps every crash on the paper, and the 1080x1350 plate all read those strokes.

type P = { x: number; y: number };
type PartId = 'R' | 'F' | 'S' | 'P' | 'H';
type Target = 'R' | 'F' | 'S' | 'H';
type Pts = Record<PartId, P>;
type OutcomeId = 'grind' | 'steer' | 'saddle' | 'strike' | 'backflip' | 'endo' | 'reach' | 'front' | 'rides';

const ORDER: PartId[] = ['R', 'F', 'S', 'P', 'H'];
const TARGETS: Target[] = ['R', 'F', 'S', 'H'];
const NUMERAL: Record<PartId, string> = { R: '1', F: '2', S: '3', P: '4', H: '5' };
const GROUND = 0.84;
const WR = 0.13;
const CR = 0.06;
const LEG = 0.3;
const SH = 1.25;
// One CSS pixel on the 366px phone sheet. Line widths and type scale with the card from here.
const U = 1 / 366;
const THIGH = 0.18;
const ARM = 0.12;
const TORSO = 0.19;
// A pointer within this of a placed part grabs it, and a tap within it is "already there".
// One radius for both, so there is no band where a tap is a drag that never moved.
const STACK = 0.06;
const PEDAL_FLOOR = GROUND + 0.08;
const GX = 63;
const GY = 79;
const INK = '#16130F';
const INK2 = 'rgba(22,19,15,0.45)';
const BONE = '#EAE3D2';
const VERM = '#E0431D';
const LEVEL_MS = 350;
const STAMP_DELAY = 250;
const STAMP_MS = 140;
const LINK_INK_MS = 900;
const DEG = Math.PI / 180;
const VTOP = 0.875;
const PLATE_W = 1080;
const PLATE_H = 1350;

const PROMPTS = [
  'Tap where the back wheel goes.',
  'Tap where the front wheel goes.',
  'Tap where the saddle goes.',
  'Tap where the pedals go.',
  'Tap where the handlebars go.',
];
const CHAIN_PROMPT = 'The pedals turn a chain. What does it drive?';
const READY_PROMPT = 'Your test pilot is ready. He has signed nothing.';
const SHARED_PROMPT = 'Someone sent you their bicycle.';
const ERR_STACK = 'Something is already there. Parts do not stack.';
const ERR_GROUND = 'On the paper, above the ground.';
const ERR_COPY = 'Copy it from here.';
const TOAST_SAVED = 'Saved.';
const TOAST_LINK = 'Link copied. It rides the same way on their screen.';
const NUDGE_FAIL = 'Try one you are sure about.';
const NUDGE_PASS = 'Now build a worse one.';

const VERDICT: Record<OutcomeId, string> = {
  grind: 'The wheels have met. They did not get along.',
  steer: 'The chain drives the handlebars. Excellent for turning, useless for going.',
  saddle: 'The chain drives the saddle. It is a very expensive way to bounce.',
  strike: 'The pedals are in the ground. The ground won.',
  backflip: 'The rider sits behind the back wheel. Physics had one comment.',
  endo: 'The rider sits ahead of the front wheel. He is now further ahead.',
  reach: 'The pedals are out of reach. He is pushing with his imagination.',
  front: 'Front wheel drive. It worked right up until the first corner.',
  rides: 'It rides. Somebody has looked at a bicycle recently.',
};
const BASE_DIST: Record<OutcomeId, number> = {
  grind: 0, steer: 0, saddle: 0, strike: 0.4, backflip: 0.2, endo: 0.3, reach: 1.1, front: 2.6, rides: -1,
};
const SCRIPT_MS: Record<OutcomeId, number> = {
  grind: 1700, steer: 2400, saddle: 2200, strike: 1900, backflip: 2300, endo: 2300, reach: 2600, front: 2800, rides: 2800,
};
// Outcomes that tip the bike far enough to put tubes through the ground: the bike rests on
// whatever touches first instead.
const LIFTS: ReadonlySet<OutcomeId> = new Set<OutcomeId>(['backflip']);
const TUBES: [PartId, PartId][] = [['H', 'F'], ['S', 'P'], ['P', 'R'], ['S', 'R'], ['H', 'S'], ['H', 'P']];
const INK_MS: Record<string, number> = { R: 220, F: 220, S: 220, P: 220, H: 220, chain: 300, rider: 300 };

// ---------- maths ----------

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const eo = (p: number) => 1 - Math.pow(1 - p, 3);
const ei = (p: number) => p * p * p;
const eio = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
const lerp = (a: P, b: P, k: number): P => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
const unit = (v: P): P => {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
};
const rotAbout = (p: P, c: P, a: number): P => {
  const s = Math.sin(a), co = Math.cos(a), dx = p.x - c.x, dy = p.y - c.y;
  return { x: c.x + dx * co - dy * s, y: c.y + dx * s + dy * co };
};
const mapPts = (pts: Partial<Pts>, f: (p: P) => P): Partial<Pts> => {
  const o: Partial<Pts> = {};
  for (const k of ORDER) {
    const v = pts[k];
    if (v) o[k] = f(v);
  }
  return o;
};
const segDist = (p: P, a: P, b: P) => {
  const ab = sub(b, a), l2 = ab.x * ab.x + ab.y * ab.y;
  const t = l2 ? clamp01(((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / l2) : 0;
  return dist(p, add(a, mul(ab, t)));
};
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- the bike ----------

const snap = (q: P): P => ({ x: Math.round(q.x * GX) / GX, y: (Math.round((q.y / SH) * GY) / GY) * SH });
const floorFor = (k: PartId) => (k === 'P' ? PEDAL_FLOOR : GROUND);
const inPaper = (k: PartId, q: P) => q.x >= 0.04 && q.x <= 0.96 && q.y >= 0.05 && q.y <= floorFor(k);
const clampPart = (k: PartId, q: P): P => ({
  x: Math.max(0.04, Math.min(0.96, q.x)),
  y: Math.max(0.05, Math.min(floorFor(k), q.y)),
});

// Six decisions in 16 characters: each point on a 64 by 80 grid, three base36 digits, then
// the chain target as one digit.
function encode(pts: Pts, chain: Target) {
  let s = '';
  for (const k of ORDER) {
    const n = Math.round(pts[k].x * GX) * (GY + 1) + Math.round((pts[k].y / SH) * GY);
    s += n.toString(36).padStart(3, '0');
  }
  return s + TARGETS.indexOf(chain);
}
function decode(code: string): { pts: Pts; chain: Target } | null {
  if (!/^[0-9a-z]{15}[0-3]$/.test(code)) return null;
  const pts = {} as Pts;
  for (let i = 0; i < 5; i++) {
    const n = parseInt(code.slice(i * 3, i * 3 + 3), 36);
    const xi = Math.floor(n / (GY + 1)), yi = n % (GY + 1);
    if (xi > GX) return null;
    const p = { x: xi / GX, y: (yi / GY) * SH };
    if (!inPaper(ORDER[i], { x: Math.max(0.04, Math.min(0.96, p.x)), y: p.y })) return null;
    pts[ORDER[i]] = p;
  }
  return { pts, chain: TARGETS[Number(code[15])] };
}

function levelParams(pts: Pts) {
  const d = pts.F.x >= pts.R.x ? 1 : -1;
  const cur = Math.atan2(pts.F.y - pts.R.y, pts.F.x - pts.R.x);
  let th = (d > 0 ? 0 : Math.PI) - cur;
  while (th > Math.PI) th -= 2 * Math.PI;
  while (th < -Math.PI) th += 2 * Math.PI;
  return { d, th, ty: GROUND - WR - pts.R.y };
}
function applyLevel(pts: Pts, th: number, ty: number, k: number, dx = 0): Pts {
  const R = pts.R;
  return mapPts(pts, (p) => {
    const r = rotAbout(p, R, th * k);
    return { x: r.x + dx * k, y: r.y + ty * k };
  }) as Pts;
}

function legIK(hip: P, foot: P, d: number) {
  const D = dist(hip, foot), u = unit(sub(foot, hip));
  if (D >= 2 * THIGH - 1e-6) return { knee: add(hip, mul(u, THIGH)), foot: add(hip, mul(u, 2 * THIGH)) };
  const a = D / 2, h = Math.sqrt(Math.max(0, THIGH * THIGH - a * a)), m = add(hip, mul(u, a)), n = { x: -u.y, y: u.x };
  const k1 = add(m, mul(n, h)), k2 = add(m, mul(n, -h));
  return { knee: (k1.x - k2.x) * d > 0 ? k1 : k2, foot };
}

function classify(lv: Pts, chain: Target, d: number): OutcomeId {
  if (dist(lv.R, lv.F) < 0.27) return 'grind';
  if (chain === 'H') return 'steer';
  if (chain === 'S') return 'saddle';
  if (lv.P.y + CR > GROUND) return 'strike';
  if ((lv.S.x - lv.R.x) * d < -0.02) return 'backflip';
  if ((lv.S.x - lv.F.x) * d > 0.02) return 'endo';
  if (dist(lv.S, lv.P) > LEG + CR) return 'reach';
  if (chain === 'F') return 'front';
  return 'rides';
}

function remark(lv: Pts, d: number): string {
  if (dist(lv.R, lv.F) > 0.6) return 'Long enough to need a second rider.';
  if (lv.H.y - lv.S.y > 0.15) return 'Aggressive. The knees disagree.';
  if ((lv.H.x - lv.S.x) * d < 0) return 'Steered from behind, like a shopping trolley.';
  const hip = { x: lv.S.x, y: lv.S.y - 0.014 };
  const k = legIK(hip, { x: lv.P.x + d * CR, y: lv.P.y }, d).knee;
  if (dist(k, lv.H) < 0.12) return 'Knees at the chin. Rides like a folding chair.';
  return 'No notes.';
}

function serialOf(pts: Pts, chain: Target): number {
  let s = '';
  for (const k of ORDER) s += Math.round(pts[k].x * GX).toString(36) + Math.round((pts[k].y / SH) * GY).toString(36) + '.';
  s += chain;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 1000 + ((h >>> 0) % 9000);
}

// ---------- poses and scripts ----------

type Pose = {
  dx: number; rot: number; piv: P; crank: number; travel: number; bars: number; bob: number; shake: number;
  flat: number; side: number; wrap: number; rRot: number | null; rdx: number; rdy: number; rSpin: number;
  flail: number; air: number; wave: number; trail: number; prop: number;
};
const restPose = (): Pose => ({
  dx: 0, rot: 0, piv: { x: 0, y: 0 }, crank: 0, travel: 0, bars: 0, bob: 0, shake: 0,
  flat: 0, side: 0, wrap: 0, rRot: null, rdx: 0, rdy: 0, rSpin: 0, flail: 0, air: 0, wave: 0, trail: 0, prop: 0,
});

type Box = { minX: number; maxX: number; minY: number; maxY: number };

// Each outcome ends on its own frame: bars stopped askew (steer), rider in the air over a
// raised saddle (saddle), rear up and the rider slid on (strike), on its back (backflip),
// on its nose with the rider ahead (endo), flat on its side (reach, the only topple), upright
// with the wheel side on and the chain wound up (front), and a wave (rides).
function script(o: OutcomeId, t0: number, lv: Pts, d: number, box?: Box, rest = 90 * DEG): Pose {
  const p = restPose();
  const t = Math.max(0, t0);
  const T = SCRIPT_MS[o];
  const cont = d * t * 0.006;
  switch (o) {
    case 'grind': {
      p.crank = d * (Math.PI / 2) * eo(seg(t, 0, 400));
      if (t > 350 && t < 950) p.shake = Math.sin(t / 14) * 0.009 * (1 - seg(t, 350, 950));
      p.rRot = 0;
      p.rSpin = d * 95 * DEG * ei(seg(t, 650, 1250));
      p.rdx = d * 0.12 * eo(seg(t, 900, 1500));
      p.rdy = 0.06 * eo(seg(t, 1000, 1500));
      break;
    }
    case 'steer': {
      // a propeller that winds down and stops 150 degrees off true
      p.crank = d * Math.min(t, 1900) * 0.006;
      p.prop = eo(seg(t, 0, 250));
      p.bars = d * (4 * Math.PI + 150 * DEG) * eo(seg(t, 0, 2000));
      break;
    }
    case 'saddle': {
      p.crank = cont;
      // five half bobs, so the last frame is the top of one
      p.bob = 0.04 * (0.5 - 0.5 * Math.cos((5 * Math.PI * t) / T));
      p.air = eo(seg(t, T - 650, T));
      p.rdy = -0.045 * p.air;
      break;
    }
    case 'strike': {
      const k = seg(t, 0, 600);
      p.travel = 0.2 * k;
      p.dx = d * p.travel;
      p.crank = d * Math.PI * 1.1 * k;
      p.piv = { x: lv.F.x, y: GROUND };
      p.rot = d * 12 * DEG * eo(seg(t, 600, 760));
      p.rdx = d * 0.08 * eo(seg(t, 640, 1050));
      p.rdy = 0.015 * eo(seg(t, 640, 1050));
      p.rSpin = d * 18 * DEG * eo(seg(t, 640, 1050));
      break;
    }
    case 'backflip': {
      p.crank = d * Math.min(t, 500) * 0.006;
      p.travel = 0.1 * eo(seg(t, 0, 900));
      p.dx = d * p.travel;
      // all the way over about the back hub: it lands upside down on saddle and bars,
      // and the rider goes over backwards with it as far as his back
      p.piv = lv.R;
      p.rot = -d * Math.PI * eio(seg(t, 250, 1700));
      p.rRot = -d * Math.min(Math.abs(p.rot), rest);
      break;
    }
    case 'endo': {
      p.crank = d * Math.min(t, 500) * 0.006;
      p.travel = 0.15 * eo(seg(t, 0, 700));
      p.dx = d * p.travel;
      // over the front hub until the frame meets the ground (rest is measured per bike)
      p.piv = lv.F;
      p.rot = d * rest * ei(seg(t, 300, 1300));
      p.rRot = Math.min(Math.abs(p.rot), 25 * DEG) * d;
      const k = seg(t, 550, 1500);
      p.rdx = d * 0.16 * eo(k);
      p.rdy = -0.1 * Math.sin(Math.PI * k) + 0.08 * k;
      p.rSpin = d * 150 * DEG * k;
      break;
    }
    case 'reach':
      p.flail = t;
      p.travel = 0.55 * eo(seg(t, 0, 1800));
      p.dx = d * p.travel;
      p.flat = eio(seg(t, 1800, 2400));
      break;
    case 'front': {
      p.crank = d * Math.min(t, 1500) * 0.006;
      p.travel = 0.45 * eo(seg(t, 0, 1800));
      p.dx = d * p.travel;
      p.side = eio(seg(t, 1200, 1700));
      p.wrap = eio(seg(t, 1000, 1700));
      p.bars = d * 0.9 * p.side;
      const f = eio(seg(t, 1800, 2600));
      p.rSpin = d * 55 * DEG * f;
      p.rdx = d * 0.05 * f;
      p.rdy = 0.03 * f;
      break;
    }
    case 'rides': {
      p.crank = d * Math.min(t, 2500) * 0.006;
      const b = box ?? { minX: 0.3, maxX: 0.7, minY: 0, maxY: 0 };
      const exit = d > 0 ? 1.03 - b.minX : -(b.maxX + 0.03);
      const entry = d > 0 ? -(b.maxX + 0.03) : 1.03 - b.minX;
      const fin = 0.5 - (b.minX + b.maxX) / 2;
      if (t < 1400) {
        const k = seg(t, 0, 1400);
        p.dx = exit * (0.4 * k * k + 0.6 * k);
        p.travel = Math.abs(p.dx);
      } else {
        const k = eo(seg(t, 1400, 2800));
        p.dx = entry + (fin - entry) * k;
        p.travel = Math.abs(exit) + Math.abs(fin - entry) * k;
      }
      p.trail = 0.6 + 0.4 * (1 - seg(t, 2300, 2800));
      p.wave = eo(seg(t, 2300, 2750));
      break;
    }
  }
  return p;
}

// ---------- strokes ----------

type Stroke = { pts: P[]; w: number; c: string; prog: number; dash?: number; rider?: boolean; bike?: boolean };
type RigOpts = { ink: (key: string) => number; pulse: number; rider: boolean; riding: boolean; lift: boolean };

const barDir = (d: number, bars: number): P => {
  const a = (d > 0 ? -35 * DEG : Math.PI + 35 * DEG) + bars;
  return { x: Math.cos(a), y: Math.sin(a) };
};
const crankEnds = (P0: P, crank: number): [P, P] => {
  const a = crank + Math.PI / 4;
  return [
    { x: P0.x + Math.cos(a) * CR, y: P0.y + Math.sin(a) * CR },
    { x: P0.x - Math.cos(a) * CR, y: P0.y - Math.sin(a) * CR },
  ];
};
const ring = (c: P, rx: number, ry: number, n: number, a0 = -Math.PI / 2): P[] => {
  const o: P[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    o.push({ x: c.x + Math.cos(a) * rx, y: c.y + Math.sin(a) * ry });
  }
  return o;
};

function buildRig(pts: Partial<Pts>, chain: Target | null, d: number, pose: Pose, o: RigOpts): Stroke[] {
  const S0 = pts.S ? { x: pts.S.x, y: pts.S.y - pose.bob } : undefined;
  const disp: Partial<Pts> = { ...pts };
  if (S0) disp.S = S0;
  const squash = (q: P): P => (pose.flat ? { x: q.x, y: GROUND - (GROUND - q.y) * (1 - 0.85 * pose.flat) } : q);
  const bx = (q: P): P => {
    const r = rotAbout(squash(q), pose.piv, pose.rot);
    return { x: r.x + pose.dx + pose.shake, y: r.y };
  };
  const out: Stroke[] = [];
  const line = (arr: P[], w: number, prog: number, c = INK, dash?: number) => {
    if (prog > 0) out.push({ pts: arr.map(bx), w, c, prog, dash, bike: true });
  };
  const pz = (c: P, q: P) => add(c, mul(sub(q, c), o.pulse));

  TUBES.forEach(([a, b], i) => {
    const A = disp[a], B = disp[b];
    if (A && B) line([A, B], 2.5, o.ink('t' + i));
  });

  const roll = (pose.travel / WR) * d;
  const wheel = (c: P, k: number, xs: number) => {
    if (k <= 0) return;
    const r = WR * o.pulse;
    line(ring(c, r * xs, r, 48), 2, k);
    const sk = clamp01(k * 1.4 - 0.4);
    for (let i = 0; i < 18; i++) {
      const a = roll + (i / 18) * Math.PI * 2;
      line([c, { x: c.x + Math.cos(a) * r * 0.97 * xs, y: c.y + Math.sin(a) * r * 0.97 }], 0.75, sk);
    }
  };
  if (disp.R) wheel(disp.R, o.ink('R'), 1);
  if (disp.F) wheel(disp.F, o.ink('F'), 1 - 0.85 * pose.side);

  if (S0) line([pz(S0, { x: S0.x - d * 0.035, y: S0.y - 0.004 }), pz(S0, { x: S0.x + d * 0.03, y: S0.y })], 4, o.ink('S'));

  if (disp.P) {
    const P0 = disp.P, k = o.ink('P');
    line(ring(P0, 0.024, 0.024, 24, 0), 1.5, k);
    const [e1, e2] = crankEnds(P0, pose.crank);
    line([e1, e2], 2.5, k);
    line([{ x: e1.x - 0.014, y: e1.y }, { x: e1.x + 0.014, y: e1.y }], 3, k);
    line([{ x: e2.x - 0.014, y: e2.y }, { x: e2.x + 0.014, y: e2.y }], 3, k);
  }

  const u = barDir(d, pose.bars);
  const grip0 = disp.H ? add(disp.H, mul(u, 0.06)) : undefined;
  if (disp.H && grip0) {
    const H = disp.H;
    const hook = add(grip0, mul(rotAbout(u, { x: 0, y: 0 }, d * 110 * DEG), 0.022));
    line([pz(H, add(H, mul(u, -0.025 - 0.035 * pose.prop))), pz(H, grip0), pz(H, hook)], 2.5, o.ink('H'));
  }

  // motion trail behind the back wheel, the pass frame's signature
  if (pose.trail > 0 && disp.R) {
    const R = disp.R;
    [-0.08, -0.03, 0.02, 0.07].forEach((oy, i) => {
      const x0 = R.x - d * (WR + 0.025), len = 0.11 * pose.trail * (1 - i * 0.18);
      line([{ x: x0, y: R.y + oy }, { x: x0 - d * len, y: R.y + oy }], 1.2, 1, INK2, 0);
    });
  }

  // chain, two dashed runs that travel while the cranks turn
  if (chain && disp.P && disp[chain]) {
    const k = o.ink('chain'), A = disp.P;
    let B = disp[chain] as P;
    const dash = -Math.abs(pose.crank) * 0.03;
    let coil: P[] | null = null;
    if (pose.wrap > 0 && chain === 'F' && disp.H && disp.F) {
      const top = disp.H, bot = lerp(disp.H, disp.F, 0.5);
      B = lerp(B, bot, pose.wrap);
      const along = unit(sub(bot, top)), nrm = { x: -along.y, y: along.x };
      coil = [];
      const n = 64;
      for (let i = 0; i <= n * pose.wrap; i++) {
        const f = i / n;
        coil.push(add(lerp(bot, top, f), mul(nrm, 0.026 * Math.sin(f * Math.PI * 2 * 6))));
      }
    }
    const nn = unit({ x: -(B.y - A.y), y: B.x - A.x });
    line([add(A, mul(nn, 0.022)), add(B, mul(nn, 0.022))], 2, k, VERM, dash);
    line([add(A, mul(nn, -0.022)), add(B, mul(nn, -0.022))], 2, k, VERM, dash);
    if (coil && coil.length > 1) line(coil, 2, k, VERM);
  }

  // the test pilot
  if (o.rider && S0 && disp.P && disp.H && grip0) {
    const k = o.ink('rider');
    const hip = { x: S0.x, y: S0.y - 0.014 };
    const [e1, e2] = crankEnds(disp.P, pose.crank);
    const grip = grip0;
    // most upright torso from which the hands still reach the grips
    const up = { x: d * 0.12, y: -1 }, tg = unit(sub(grip, hip));
    let tdir = unit(up), sh = add(hip, mul(tdir, TORSO));
    for (let a = 0; a <= 1.0001; a += 0.1) {
      tdir = unit(add(mul(unit(up), 1 - a), mul(tg, a)));
      sh = add(hip, mul(tdir, TORSO));
      if (dist(sh, grip) <= 2 * ARM * 0.92) break;
    }
    const arm = (target: P): P[] => {
      const D = dist(sh, target), ua = unit(sub(target, sh));
      // a long reach stretches the arm a little, never further: a thrown rider lets go
      if (D >= 2 * ARM) { const L = Math.min(D, 2 * ARM * 1.15); return [sh, add(sh, mul(ua, L / 2)), add(sh, mul(ua, L))]; }
      const h = Math.sqrt(ARM * ARM - (D / 2) * (D / 2)), m = add(sh, mul(ua, D / 2)), n = { x: -ua.y, y: ua.x };
      const c1 = add(m, mul(n, h)), c2 = add(m, mul(n, -h));
      return [sh, c1.y > c2.y ? c1 : c2, target];
    };
    const raise = Math.max(pose.wave, pose.air);
    const nearHand = lerp(grip, add(sh, { x: d * 0.1, y: pose.air > pose.wave ? -0.07 : -0.13 }), raise);
    // steer: the far hand holds the other end of the spinning bar, so the arms cross
    const farGrip = lerp(grip, add(disp.H, mul(u, -0.06)), pose.prop);
    const farHand = lerp(farGrip, add(sh, { x: -d * 0.11, y: -0.07 }), pose.air);
    const flail = (e: P, ph: number): P =>
      pose.flail ? { x: e.x + Math.sin(pose.flail / 70 + ph) * 0.05 * d, y: e.y + Math.cos(pose.flail / 90 + ph) * 0.03 } : e;
    const f1 = flail(lerp(e1, add(hip, { x: d * 0.07, y: 0.33 }), pose.air), 0);
    const f2 = flail(lerp(e2, add(hip, { x: -d * 0.02, y: 0.34 }), pose.air), 2);
    const l1 = legIK(hip, f1, d), l2 = legIK(hip, f2, d);
    const head = ring(add(sh, mul(tdir, 0.048)), 0.028, 0.028, 20);

    const rrot = pose.rRot === null ? pose.rot : pose.rRot;
    const r0 = (q: P): P => {
      const r = rotAbout(squash(q), pose.piv, rrot);
      return { x: r.x + pose.dx + pose.shake, y: r.y };
    };
    const hipW = r0(hip);
    const rx = (q: P): P => {
      const r = rotAbout(r0(q), hipW, pose.rSpin);
      return { x: r.x + pose.rdx, y: r.y + pose.rdy };
    };
    const body = (arr: P[], c: string) => out.push({ pts: arr.map(rx), w: 2, c, prog: k, rider: true });
    body([hip, l2.knee, l2.foot], INK2);
    body(arm(farHand), INK2);
    body([hip, l1.knee, l1.foot], INK);
    body([hip, sh], INK);
    body(arm(nearHand), INK);
    body(head, INK);
  }

  // nothing ends inside the ground: the bike rests on whatever touches first, and the rider
  // is lifted with it, or further if he would still be under it
  if (o.riding) {
    let bl = 0;
    if (o.lift) for (const s of out) if (s.bike) for (const q of s.pts) bl = Math.max(bl, q.y - GROUND);
    // a rider with his own rotation has left the bike, so the bike's lift is not his
    let rl = pose.rRot === null ? bl : -Infinity;
    for (const s of out) if (s.rider) for (const q of s.pts) rl = Math.max(rl, q.y - (GROUND - 0.004));
    for (const s of out) {
      const l = s.rider ? rl : bl;
      if (l > 0) s.pts = s.pts.map((q) => ({ x: q.x, y: q.y - l }));
    }
  }
  return out;
}

function boxOf(strokes: Stroke[]): Box {
  const b = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (const s of strokes) for (const q of s.pts) {
    b.minX = Math.min(b.minX, q.x); b.maxX = Math.max(b.maxX, q.x);
    b.minY = Math.min(b.minY, q.y); b.maxY = Math.max(b.maxY, q.y);
  }
  return b;
}

const FULL: RigOpts = { ink: () => 1, pulse: 1, rider: true, riding: true, lift: false };

// ---------- fitting the paper ----------

// The paper is shared. The heading owns the top, the verdict block owns the bottom, and the
// drawing gets what is left: a bike built from five free taps can be twice as long as the
// sheet or a head taller than it, and a patent plate with its wheels cut off is not a thing
// anyone screenshots. One camera, computed from the finished composition, carries the bike,
// the rider, the numerals and the ground together, so nothing ever leaves the paper and the
// wheels never leave the ground.
const FIT_TOP = 0.1;
// The stamp is a solid block, so unlike the drawing's own lines it must clear the sheet's
// second row of type (the attempts count, or the serial once there is one) outright.
const STAMP_TOP = 0.138;
const FIT_LEFT = 0.055;
const FIT_RIGHT = 0.945;
const FIT_GAP = 0.02;
// how far the ground hatching reaches under the ground line, and the paper's inner rule
const HATCH_DEEP = 0.022;
const SHEET_PAD = 18;
// Strokes are measured down their centre line, but ink has width: half of the widest one, so
// what the fit reserves is room for the ink rather than room for the arithmetic.
const INK_PAD = 2 * U;

type Cam = { k: number; ox: number; oy: number };
const CAM1: Cam = { k: 1, ox: 0, oy: 0 };
const camP = (c: Cam, q: P): P => ({ x: c.ox + c.k * q.x, y: c.oy + c.k * q.y });
const camY = (c: Cam, y: number) => c.oy + c.k * y;
const camLerp = (a: Cam, b: Cam, t: number): Cam => ({
  k: a.k + (b.k - a.k) * t, ox: a.ox + (b.ox - a.ox) * t, oy: a.oy + (b.oy - a.oy) * t,
});
const camStrokes = (st: Stroke[], c: Cam): Stroke[] =>
  c.k === 1 && c.ox === 0 && c.oy === 0 ? st : st.map((s) => ({ ...s, pts: s.pts.map((q) => camP(c, q)) }));

// Never magnified, centred across the paper, and lifted only as far as it has to be: the
// ground keeps its drawn height whenever the fit allows, so a bike that already fits is drawn
// exactly where it was before this rule existed. The hatch hangs a fixed depth under the
// ground line at any scale, so it costs room off the top of the area instead of shrinking
// with the drawing. Those two bounds together leave a legal range for the lift, always.
function fitCam(box0: Box, bottom: number): Cam {
  const box = { minX: box0.minX - INK_PAD, maxX: box0.maxX + INK_PAD, minY: box0.minY - INK_PAD, maxY: box0.maxY + INK_PAD };
  const deep = HATCH_DEEP + INK_PAD;
  const minY = Math.min(box.minY, GROUND);
  const area = bottom - FIT_TOP;
  const k = Math.min(
    1,
    (FIT_RIGHT - FIT_LEFT) / Math.max(1e-4, box.maxX - box.minX),
    area / Math.max(1e-4, box.maxY - minY),
    (area - deep) / Math.max(1e-4, GROUND - minY),
  );
  const ox = (FIT_LEFT + FIT_RIGHT) / 2 - (k * (box.minX + box.maxX)) / 2;
  const lo = FIT_TOP - k * minY;
  const hi = Math.min(bottom - k * box.maxY, bottom - deep - k * GROUND);
  return { k, ox, oy: Math.min(Math.max(GROUND * (1 - k), lo), Math.max(lo, hi)) };
}

let mcv: CanvasRenderingContext2D | null = null;
function wrapN(text: string, px: number, max: number, family: string) {
  if (!mcv) mcv = document.createElement('canvas').getContext('2d');
  if (!mcv) return 1;
  mcv.font = `${px}px ${family}`;
  return Math.max(1, wrapText(mcv, text, max).length);
}

// Where the verdict block starts. Three lines at a fixed type size take a bigger share of a
// small sheet, so the block is laid out from the bottom of the paper upwards and the drawing
// is told what is left. Measured at a hair under the text box's real width, so the wrap here
// is never more generous than the one the browser performs on the same monospaced string.
function screenBand(w: number, lines: string[], family: string) {
  if (!w) return VTOP;
  const max = 0.86 * w - 1;
  const h = (18 * wrapN(lines[0], 12, max, family) + 4 + 20 * wrapN(lines[1], 15, max, family) + 4 + 18 * wrapN(lines[2], 12, max, family)) / w;
  return Math.min(VTOP, SH - SHEET_PAD / w - h);
}
// The same rule at plate size, bounded by the footer instead of the paper's edge.
const PLATE_FOOT = 1.165;
function plateBand(lines: string[], family: string) {
  const px = U * PLATE_W, max = 0.86 * PLATE_W;
  const h = U * (18 * wrapN(lines[0], 12 * px, max, family) + 4 + 20.25 * wrapN(lines[1], 15 * px, max, family) + 4 + 18 * wrapN(lines[2], 12 * px, max, family));
  return Math.min(VTOP, PLATE_FOOT - h);
}

// ---------- the ride ----------

type Ride = {
  built: Pts; chain: Target; d: number; th: number; ty: number; shift: number; lv: Pts; box0: Box;
  outcome: OutcomeId; T: number; t0: number; serial: number; stamp: P; rest: number;
  lines: string[]; band: number; cam: Cam; wash: boolean;
};

function finalStrokes(lv: Pts, chain: Target, d: number, o: OutcomeId, box0: Box, rest: number) {
  return buildRig(lv, chain, d, script(o, SCRIPT_MS[o], lv, d, box0, rest), { ...FULL, lift: LIFTS.has(o) });
}

// How far a bike tips over its front hub before some part of the frame meets the ground.
// How far the thrown rider turns in a backflip: until his torso points straight back, so he
// lands flat on his back with his legs in the air whatever his lean was on the bike.
function backRest(lv: Pts, chain: Target, d: number) {
  const torso = buildRig(lv, chain, d, restPose(), FULL).filter((x) => x.rider)[3].pts;
  const a0 = Math.atan2(torso[1].y - torso[0].y, torso[1].x - torso[0].x);
  let r = (d > 0 ? Math.PI : 0) - a0;
  while (r * d > 0) r -= d * 2 * Math.PI;
  while (r * d <= -2 * Math.PI) r += d * 2 * Math.PI;
  return Math.abs(r);
}

// Capped at 70 degrees: past that a long bike's back wheel climbs into the sheet heading.
function endoRest(lv: Pts, chain: Target, d: number) {
  for (let deg = 2; deg <= 70; deg += 2) {
    const pose = { ...restPose(), piv: lv.F, rot: d * deg * DEG };
    const st = buildRig(lv, chain, d, pose, { ...FULL, rider: false, riding: false });
    if (st.some((x) => x.pts.some((q) => q.y > GROUND + 0.003))) return (deg - 2) * DEG;
  }
  return 70 * DEG;
}

function makeRide(built: Pts, chain: Target, now: number, w: number, family: string): Ride {
  const { d, th, ty } = levelParams(built);
  const lv0 = applyLevel(built, th, ty, 1);
  const outcome = classify(lv0, chain, d);
  const box0 = boxOf(buildRig(lv0, chain, d, restPose(), FULL));
  const rest = outcome === 'endo' ? endoRest(lv0, chain, d) : outcome === 'backflip' ? backRest(lv0, chain, d) : 90 * DEG;
  // Pre-roll: shift where the bike starts so its last frame sits centred on the paper.
  // Distances are the table's; only the starting point moves. 'rides' centres itself.
  let shift = 0;
  if (outcome !== 'rides') {
    const fb = boxOf(finalStrokes(lv0, chain, d, outcome, box0, rest));
    shift = 0.5 - (fb.minX + fb.maxX) / 2;
  }
  const lv = applyLevel(built, th, ty, 1, shift);
  const fin = finalStrokes(lv, chain, d, outcome, box0, rest);
  const r: Ride = {
    built, chain, d, th, ty, shift, lv, box0, rest, outcome, T: SCRIPT_MS[outcome], t0: now,
    serial: serialOf(built, chain), stamp: { x: 0.5, y: FIT_TOP }, lines: [], band: VTOP, cam: CAM1, wash: false,
  };
  // The verdict decides how much paper is left, the paper decides the camera, and the camera
  // decides where the stamp can land: in that order, once, before the bike starts moving.
  r.lines = resultLines(r);
  r.band = screenBand(w, r.lines, family);
  r.cam = fitCam(boxOf(fin), r.band - FIT_GAP);
  const sp = stampSpot(camStrokes(fin, r.cam), outcome === 'rides', STAMP_TOP, r.band - FIT_GAP);
  r.stamp = sp.at;
  r.wash = sp.over > 0;
  return r;
}

function resultLines(r: Ride) {
  const wb = (dist(r.built.R, r.built.F) * 2).toFixed(2);
  const base = BASE_DIST[r.outcome];
  const off = base > 0 ? (r.serial % 3) * 0.1 : 0;
  const line3 = base < 0
    ? `Distance ridden: off the sheet. Wheelbase ${wb} m.`
    : `Distance ridden: ${(base + off).toFixed(1)} m. Wheelbase ${wb} m.`;
  const v = r.outcome === 'rides' ? `${VERDICT.rides} ${remark(r.lv, r.d)}` : VERDICT[r.outcome];
  return [`Velocipede No. ${r.serial}.`, v, line3];
}

function rideState(r: Ride, now: number) {
  const t = Math.min(now - r.t0, LEVEL_MS + r.T);
  if (t < LEVEL_MS) {
    const k = eio(clamp01(t / LEVEL_MS));
    return { pts: applyLevel(r.built, r.th, r.ty, k, r.shift), pose: restPose(), lift: false };
  }
  return { pts: r.lv, pose: script(r.outcome, t - LEVEL_MS, r.lv, r.d, r.box0, r.rest), lift: LIFTS.has(r.outcome) };
}

// ---------- stamp ----------

const stampText = (ok: boolean) => (ok ? 'RIDES' : 'DOES NOT RIDE');
function stampHalf(ok: boolean) {
  const n = stampText(ok).length;
  const w = n * 16 * U * 0.72 + 24 * U, h = 16 * U * 1.25 + 10 * U;
  const c = Math.cos(8 * DEG), s = Math.sin(8 * DEG);
  return { hx: (w / 2) * c + (h / 2) * s, hy: (w / 2) * s + (h / 2) * c, w, h };
}
// Somewhere the crash is not: every candidate spot in the drawing area is scored by how much
// ink the rotated stamp would cover, then by how far it sits from the top right. The search is
// given the fitted composition and the band the verdict kept, so it always returns a spot on
// the paper. A drawing that fills the paper leaves no clear spot at all; then it returns the
// least inky one and says so, and the caller lays a patch of paper down before stamping.
function stampSpot(strokes: Stroke[], ok: boolean, top: number, bottom: number): { at: P; over: number } {
  const half = stampHalf(ok), w = half.w, h = half.h;
  // the cached stamp image carries a little padding and its own ink width, so it asks for
  // slightly more room than the bare rectangle the coverage test uses
  const hx = half.hx + 0.006, hy = half.hy + 0.006;
  const ink: P[] = [];
  for (const st of strokes)
    for (let i = 1; i < st.pts.length; i++) {
      const a = st.pts[i - 1], b = st.pts[i], n = Math.max(1, Math.ceil(dist(a, b) / 0.01));
      for (let j = 0; j <= n; j++) ink.push(lerp(a, b, j / n));
    }
  const c = Math.cos(8 * DEG), sn = Math.sin(8 * DEG), m = 0.018;
  const x0 = FIT_LEFT + hx, x1 = Math.max(x0, FIT_RIGHT - hx);
  const y0 = top + hy, y1 = Math.max(y0, bottom - hy);
  let best = { x: x1, y: y0 }, bs = Infinity, bo = 0;
  for (let y = y0; y <= y1 + 1e-9; y += 0.02)
    for (let x = x0; x <= x1 + 1e-9; x += 0.02) {
      const pen = (x1 - x) + (y - y0) * 1.5;
      let sc = pen, over = 0;
      for (const q of ink) {
        const dx = q.x - x, dy = q.y - y;
        if (Math.abs(dx * c - dy * sn) < w / 2 + m && Math.abs(dx * sn + dy * c) < h / 2 + m) {
          over++;
          sc += 10;
          if (sc >= bs) break;
        }
      }
      if (sc < bs) { bs = sc; bo = over; best = { x, y }; }
    }
  return { at: best, over: bo };
}

const stampCache = new Map<string, HTMLCanvasElement>();
// The stamp is drawn once per size into its own canvas, then irregular gaps are punched out
// of it with a PRNG seeded by the serial, so it looks inked and the same bike inks the same.
function stampImage(ok: boolean, serial: number, s: number, family: string) {
  const key = `${ok}|${serial}|${Math.round(s)}|${family}`;
  const hit = stampCache.get(key);
  if (hit) return hit;
  const { w, h } = stampHalf(ok);
  const W = Math.ceil(w * s) + 4, H = Math.ceil(h * s) + 4;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d') as CanvasRenderingContext2D;
  const bw = 2 * U * s;
  ctx.strokeStyle = VERM; ctx.lineWidth = bw;
  ctx.strokeRect(2 + bw / 2, 2 + bw / 2, W - 4 - bw, H - 4 - bw);
  ctx.fillStyle = VERM;
  ctx.font = `700 ${16 * U * s}px ${family}`;
  ctx.textBaseline = 'middle';
  const txt = stampText(ok), adv = 16 * U * s * 0.72;
  const x0 = W / 2 - (adv * txt.length) / 2;
  for (let i = 0; i < txt.length; i++) {
    ctx.textAlign = 'center';
    ctx.fillText(txt[i], x0 + adv * (i + 0.5), H / 2 + 1);
  }
  ctx.globalCompositeOperation = 'destination-out';
  const rnd = mulberry(serial * 7919 + (ok ? 1 : 2));
  const unitPx = U * s;
  const n = Math.round((W * H) / (unitPx * unitPx * 22));
  for (let i = 0; i < n; i++) {
    const x = rnd() * W, y = rnd() * H, r = (0.3 + rnd() * 1.1) * unitPx;
    ctx.globalAlpha = 0.35 + rnd() * 0.65;
    ctx.beginPath(); ctx.ellipse(x, y, r * (1 + rnd() * 1.6), r, rnd() * Math.PI, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 5; i++) {
    const y = rnd() * H, x = rnd() * W;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, (6 + rnd() * 18) * unitPx, (0.5 + rnd()) * unitPx);
  }
  stampCache.set(key, cv);
  return cv;
}
function drawStamp(ctx: CanvasRenderingContext2D, s: number, at: P, ok: boolean, serial: number, family: string, scale: number, alpha: number, wash = false) {
  const img = stampImage(ok, serial, s, family);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = alpha;
  ctx.translate(at.x * s, at.y * s);
  ctx.rotate(-8 * DEG);
  ctx.scale(scale, scale);
  if (wash) {
    ctx.globalAlpha = alpha * 0.82;
    ctx.fillStyle = BONE;
    ctx.fillRect(-img.width / 2 - 2, -img.height / 2 - 2, img.width + 4, img.height + 4);
    ctx.globalAlpha = alpha;
  }
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
}

// ---------- drawing ----------

function poly(ctx: CanvasRenderingContext2D, arr: P[], prog = 1) {
  if (arr.length < 2 || prog <= 0) return;
  const n = (arr.length - 1) * clamp01(prog);
  ctx.beginPath();
  ctx.moveTo(arr[0].x, arr[0].y);
  const whole = Math.floor(n);
  for (let i = 1; i <= whole; i++) ctx.lineTo(arr[i].x, arr[i].y);
  if (whole < arr.length - 1) {
    const a = arr[whole], b = arr[whole + 1], f = n - whole;
    ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
  }
  ctx.stroke();
}

function drawStrokes(ctx: CanvasRenderingContext2D, s: number, strokes: Stroke[]) {
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const st of strokes) {
    ctx.strokeStyle = st.c;
    ctx.lineWidth = st.w * U;
    if (st.dash !== undefined) {
      ctx.setLineDash(st.c === VERM ? [4 * U, 2 * U] : [3 * U, 3 * U]);
      ctx.lineDashOffset = st.dash;
    } else ctx.setLineDash([]);
    poly(ctx, st.pts, st.prog);
  }
  ctx.setLineDash([]);
}

type Label = { txt: string; L: P; tip: P };

// Patent numerals: each label tries twelve directions around its part and takes the one
// furthest from every line already drawn and every label already placed. Laid out in the
// drawing's own units and drawn through the camera, so a label never parts from its part.
function layoutNumerals(disp: Partial<Pts>, chain: Target | null, strokes: Stroke[]): Label[] {
  const segs: [P, P][] = [];
  for (const st of strokes) for (let i = 1; i < st.pts.length; i++) segs.push([st.pts[i - 1], st.pts[i]]);
  const placed: P[] = [];
  const score = (L: P) => {
    if (L.x < 0.06 || L.x > 0.94 || L.y < 0.12 || L.y > GROUND + 0.04) return -1;
    if (L.y > GROUND - 0.025) return 0.001;
    let m = Infinity;
    for (const [a, b] of segs) m = Math.min(m, segDist(L, a, b));
    for (const q of placed) m = Math.min(m, dist(L, q) * 0.7);
    return m;
  };
  const labels: Label[] = [];
  for (const id of ORDER) {
    const c = disp[id];
    if (!c) continue;
    const rr = id === 'R' || id === 'F' ? WR : 0.03;
    let best: { L: P; tip: P } | null = null, bs = -Infinity;
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (i / 12) * Math.PI * 2;
      const dir = { x: Math.cos(a), y: Math.sin(a) };
      const L = add(c, mul(dir, rr + 0.065));
      const sc = score(L);
      if (sc > bs) { bs = sc; best = { L, tip: add(c, mul(dir, rr + 0.008)) }; }
    }
    if (best) { labels.push({ txt: NUMERAL[id], ...best }); placed.push(best.L); }
  }
  if (chain && disp.P && disp[chain]) {
    const A = disp.P, B = disp[chain] as P;
    const nn = unit({ x: -(B.y - A.y), y: B.x - A.x });
    let best: { L: P; tip: P } | null = null, bs = -Infinity;
    for (const f of [0.3, 0.45, 0.6, 0.75]) for (const sg of [1, -1]) {
      const tip = add(lerp(A, B, f), mul(nn, sg * 0.03));
      const L = add(tip, mul(nn, sg * 0.055));
      const sc = score(L);
      if (sc > bs) { bs = sc; best = { L, tip }; }
    }
    if (best) labels.push({ txt: '6', ...best });
  }
  return labels;
}

// A label and its leader are part of the drawing, so the fit has to see them too. A numeral is
// type, though: it stays 11px at any scale (the type floor), so its box is measured back up by
// the scale it is about to be drawn at, and the fit is run again until the two agree.
function withLabels(box: Box, labels: Label[], grow = 1): Box {
  const o = { ...box };
  for (const l of labels) {
    o.minX = Math.min(o.minX, l.L.x - 0.022 * grow); o.maxX = Math.max(o.maxX, l.L.x + 0.022 * grow);
    o.minY = Math.min(o.minY, l.L.y - 0.018 * grow); o.maxY = Math.max(o.maxY, l.L.y + 0.018 * grow);
  }
  return o;
}
function fitLabelled(box: Box, labels: Label[], bottom: number): Cam {
  let cam = fitCam(withLabels(box, labels), bottom);
  for (let i = 0; i < 3; i++) cam = fitCam(withLabels(box, labels, 1 / cam.k), bottom);
  return cam;
}

function drawLabels(ctx: CanvasRenderingContext2D, s: number, labels: Label[], cam: Cam, family: string, k = 1) {
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.globalAlpha = k;
  ctx.strokeStyle = INK2;
  ctx.lineWidth = 0.75 * U;
  for (const lb of labels) {
    const L = camP(cam, lb.L), tip = camP(cam, lb.tip);
    const from = add(L, mul(unit(sub(tip, L)), 0.016));
    const mid = add(lerp(from, tip, 0.5), mul({ x: -(tip.y - from.y), y: tip.x - from.x }, 0.25));
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.quadraticCurveTo(mid.x, mid.y, tip.x, tip.y); ctx.stroke();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `${11 * U * s}px ${family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = INK;
  for (const lb of labels) {
    const L = camP(cam, lb.L);
    ctx.fillText(lb.txt, L.x * s, L.y * s);
  }
  ctx.globalAlpha = 1;
}

// ---------- the scene ----------

type Scene = {
  pts: Partial<Pts>; inkT: Record<string, number>; chain: Target | null; pulseT: number;
  ride: Ride | null; stampAt: number; cam: Cam; readyCam: Cam | null;
};
const emptyScene = (): Scene => ({ pts: {}, inkT: {}, chain: null, pulseT: 0, ride: null, stampAt: 0, cam: CAM1, readyCam: null });
const dirOf = (pts: Partial<Pts>) => (pts.R && pts.F ? (pts.F.x >= pts.R.x ? 1 : -1) : 1);

function sceneStrokes(sc: Scene, now: number, reduced: boolean) {
  let pts = sc.pts, pose = restPose(), lift = false, riding = false;
  let d = dirOf(pts);
  if (sc.ride) {
    const st = rideState(sc.ride, now);
    pts = st.pts; pose = st.pose; lift = st.lift; d = sc.ride.d; riding = true;
  }
  const ink = (key: string) => {
    const t = sc.inkT[key];
    if (t === undefined) return 0;
    if (riding || reduced) return 1;
    return eo(clamp01((now - t) / (INK_MS[key] ?? 90)));
  };
  const pulse = !reduced && sc.pulseT && now > sc.pulseT && now - sc.pulseT < 500
    ? 1 + 0.06 * Math.sin(Math.PI * ((now - sc.pulseT) / 500))
    : 1;
  const strokes = buildRig(pts, sc.chain, d, pose, { ink, pulse, rider: sc.inkT.rider !== undefined, riding, lift });
  return { strokes, pts, riding };
}

// The ground moves with the camera but never scales: it is a full width line whatever size
// the bike came out at, and any ink the camera puts at GROUND lands exactly on it.
function drawGround(ctx: CanvasRenderingContext2D, s: number, dy = 0) {
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5 * U;
  poly(ctx, [{ x: 0.05, y: GROUND + dy }, { x: 0.95, y: GROUND + dy }]);
  ctx.strokeStyle = INK2; ctx.lineWidth = 0.75 * U;
  for (const [a, b] of HATCH) poly(ctx, [{ x: a.x, y: a.y + dy }, { x: b.x, y: b.y + dy }]);
}
const HATCH: [P, P][] = [];
for (let i = 0; i < 41; i++) {
  const x = 0.06 + i * 0.022;
  HATCH.push([{ x, y: GROUND + 0.004 }, { x: x - 0.018, y: GROUND + 0.022 }]);
}
const f4 = (v: number) => v.toFixed(4);
const HATCH_D = HATCH.map(([a, b]) => `M${f4(a.x)} ${f4(a.y)}L${f4(b.x)} ${f4(b.y)}`).join('');

function wrapText(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const out: string[] = [];
  let cur = '';
  for (const w of text.split(' ')) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > max && cur) { out.push(cur); cur = w; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}

// The plate: the sheet at 1080x1350, the bike in its built pose with numerals, the stamp,
// the verdict, the address. Drawn from the same strokes as the screen, never a screenshot.
function renderPlate(r: Ride, lines: string[], family: string) {
  const s = PLATE_W;
  const cv = document.createElement('canvas');
  cv.width = PLATE_W; cv.height = PLATE_H;
  const ctx = cv.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = BONE; ctx.fillRect(0, 0, PLATE_W, PLATE_H);
  const rnd = mulberry(4471);
  ctx.fillStyle = 'rgba(26,20,13,0.05)';
  for (let i = 0; i < 18000; i++) ctx.fillRect(rnd() * PLATE_W, rnd() * PLATE_H, 1 + rnd() * 1.5, 1 + rnd() * 1.5);
  const px = U * s;
  ctx.strokeStyle = INK; ctx.lineWidth = px;
  ctx.strokeRect(10 * px, 10 * px, PLATE_W - 20 * px, PLATE_H - 20 * px);
  ctx.lineWidth = 0.6 * px;
  ctx.strokeRect(14 * px, 14 * px, PLATE_W - 28 * px, PLATE_H - 28 * px);
  ctx.fillStyle = INK; ctx.textBaseline = 'middle';
  ctx.font = `${13 * px}px ${family}`;
  const head = 'VELOCIPEDE', track = 13 * px * 0.2;
  const hw = head.split('').reduce((a, c) => a + ctx.measureText(c).width + track, -track);
  let hx = PLATE_W / 2 - hw / 2;
  ctx.textAlign = 'left';
  for (const c of head) { ctx.fillText(c, hx, 0.056 * s); hx += ctx.measureText(c).width + track; }
  ctx.font = `${11 * px}px ${family}`;
  ctx.textAlign = 'right';
  ctx.fillText(`No. ${r.serial}`, 0.93 * s, 0.056 * s);
  const strokes = buildRig(r.built, r.chain, r.d, restPose(), { ...FULL, riding: false });
  const labels = layoutNumerals(r.built, r.chain, strokes);
  const band = plateBand(lines, family);
  const cam = fitLabelled(boxOf(strokes), labels, band - FIT_GAP);
  drawGround(ctx, s, camY(cam, GROUND) - GROUND);
  const fitted = camStrokes(strokes, cam);
  drawStrokes(ctx, s, fitted);
  drawLabels(ctx, s, labels, cam, family);
  const sp = stampSpot(fitted, r.outcome === 'rides', STAMP_TOP, band - FIT_GAP);
  drawStamp(ctx, s, sp.at, r.outcome === 'rides', r.serial, family, 1, 1, sp.over > 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  let y = band * s;
  const x = 0.07 * s, max = 0.86 * s;
  ctx.globalAlpha = 0.8;
  ctx.font = `${12 * px}px ${family}`;
  for (const l of wrapText(ctx, lines[0], max)) { ctx.fillText(l, x, y); y += 12 * px * 1.5; }
  y += 4 * px;
  ctx.globalAlpha = 1;
  ctx.font = `${15 * px}px ${family}`;
  for (const l of wrapText(ctx, lines[1], max)) { ctx.fillText(l, x, y); y += 15 * px * 1.35; }
  y += 4 * px;
  ctx.globalAlpha = 0.8;
  ctx.font = `${12 * px}px ${family}`;
  for (const l of wrapText(ctx, lines[2], max)) { ctx.fillText(l, x, y); y += 12 * px * 1.5; }
  ctx.globalAlpha = 0.7;
  ctx.font = `${11 * px}px ${family}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('wiz.jock.pl/experiments/velocipede', PLATE_W / 2, 1.192 * s);
  ctx.globalAlpha = 1;
  return cv;
}

// ---------- React ----------

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 1 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")";

const CSS = `
.velo-sheet{width:min(calc(100vw - 24px),calc((100dvh - 236px - env(safe-area-inset-bottom)) * 0.8))}
@media (min-width:768px){.velo-sheet{width:min(100%,480px,max(260px,calc((100dvh - 330px) * 0.8)))}}
@keyframes velo-fill{from{background-color:transparent;color:#EAE3D2}to{background-color:#EAE3D2;color:#16130F}}
.velo-fill{animation:velo-fill 600ms ease-out both}
@media (prefers-reduced-motion:reduce){.velo-fill{animation:none;background-color:#EAE3D2;color:#16130F}}
`;

type Phase = 'build' | 'chain' | 'ready' | 'running' | 'result';

function Btn({ children, onClick, primary, fillDelay }: { children: React.ReactNode; onClick: () => void; primary?: boolean; fillDelay?: number }) {
  const base = 'h-[52px] min-w-0 flex-1 rounded-[2px] text-[15px] outline-none focus-visible:ring-1 focus-visible:ring-[#EAE3D2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A08]';
  if (fillDelay !== undefined)
    return (
      <button onClick={onClick} className={`${base} velo-fill border border-[#EAE3D2]`} style={{ animationDelay: `${fillDelay}ms` }}>
        {children}
      </button>
    );
  return (
    <button onClick={onClick} className={`${base} ${primary ? 'bg-[#EAE3D2] text-[#16130F]' : 'border border-[#EAE3D2]/40 text-[#EAE3D2]'}`}>
      {children}
    </button>
  );
}

export default function Client() {
  const { language } = useLanguage();
  const scene = useRef<Scene>(emptyScene());
  const phaseRef = useRef<Phase>('build');
  const reducedRef = useRef(false);
  const familyRef = useRef('monospace');
  const [phase, setPhaseState] = useState<Phase>('build');
  const setPhase = (p: Phase) => { phaseRef.current = p; setPhaseState(p); };
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [band, setBand] = useState(VTOP);
  const [typed, setTyped] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shared, setShared] = useState(false);
  const [copyField, setCopyField] = useState<string | null>(null);
  const [fillDelay, setFillDelay] = useState(600);
  const [serial, setSerial] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<OutcomeId | null>(null);
  const drag = useRef<{ id: PartId; moved: boolean; x: number; y: number } | null>(null);
  const timers = useRef<number[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const groundRef = useRef<SVGGElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const copyRef = useRef<HTMLInputElement | null>(null);
  const size = useRef({ w: 0, dpr: 1 });

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const flash = (m: string) => {
    setMsg(m);
    later(() => setMsg((cur) => (cur === m ? null : cur)), 1600);
  };
  const say = (m: string) => {
    setToast(m);
    later(() => setToast((cur) => (cur === m ? null : cur)), 1800);
  };

  const finish = (r: Ride) => {
    setPhase('result');
    setLines(r.lines);
    setBand(r.band);
    setTyped(0);
    setSerial(r.serial);
    setOutcome(r.outcome);
    if (!reducedRef.current)
      sheetRef.current?.animate(
        [{ transform: 'translate(0,0)' }, { transform: 'translate(2px,-1px)' }, { transform: 'translate(-2px,1px)' }, { transform: 'translate(1px,2px)' }, { transform: 'translate(0,0)' }],
        { duration: 160 },
      );
    try {
      const n = (parseInt(window.localStorage.getItem('velocipede_count') || '0', 10) || 0) + 1;
      window.localStorage.setItem('velocipede_count', String(n));
      setAttempts(n);
    } catch {
      /* private mode: the count is a nicety */
    }
  };

  // canvas: size, frame loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    familyRef.current = getComputedStyle(cv).fontFamily || 'monospace';
    const fit = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: r.width, dpr };
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.width * SH * dpr);
    };
    fit();
    let rt = 0;
    const ro = new ResizeObserver(() => { window.clearTimeout(rt); rt = window.setTimeout(fit, 120); });
    ro.observe(cv);
    let raf = 0;
    let prev = 0;
    const loop = () => {
      const now = performance.now();
      const sc = scene.current;
      if (sc.ride && phaseRef.current === 'running' && now >= sc.stampAt) finish(sc.ride);
      const ctx = cv.getContext('2d');
      const { w, dpr } = size.current;
      if (ctx && w) {
        const s = w * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        const { strokes, pts, riding } = sceneStrokes(sc, now, reducedRef.current);
        const labels = !riding && Object.keys(pts).length ? layoutNumerals(pts, sc.chain, strokes) : null;
        // The pilot is on and nothing more can be placed, so this frame is worth fitting: a
        // tall build gets its rider's head back before anyone presses Ride.
        if (phaseRef.current === 'ready' && !sc.readyCam && labels) {
          const full = buildRig(pts, sc.chain, dirOf(pts), restPose(), { ...FULL, riding: false });
          sc.readyCam = fitLabelled(boxOf(full), labels, VTOP - FIT_GAP);
        }
        // One camera, eased: the drawing settles into the paper instead of snapping to it.
        const target = sc.ride ? sc.ride.cam : sc.readyCam ?? CAM1;
        const dt = prev ? Math.min(64, now - prev) : 64;
        prev = now;
        sc.cam = reducedRef.current ? target : camLerp(sc.cam, target, 1 - Math.exp(-dt / 90));
        const g = groundRef.current;
        if (g) g.setAttribute('transform', `translate(0 ${(camY(sc.cam, GROUND) - GROUND).toFixed(5)})`);
        drawStrokes(ctx, s, camStrokes(strokes, sc.cam));
        if (labels) drawLabels(ctx, s, labels, sc.cam, familyRef.current);
        if (sc.ride && phaseRef.current === 'result') {
          const p = reducedRef.current ? 1 : clamp01((now - sc.stampAt) / STAMP_MS);
          const c1 = 1.70158 * 0.9, c3 = c1 + 1, q = p - 1;
          const back = 1 + c3 * q * q * q + c1 * q * q;
          drawStamp(ctx, s, sc.ride.stamp, sc.ride.outcome === 'rides', sc.ride.serial, familyRef.current, 1.25 - 0.25 * back, clamp01(p * 3), sc.ride.wash);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.clearTimeout(rt); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // repeat visit: a shared bike first, else the attempts counter. Never during first render.
  useEffect(() => {
    try {
      const n = parseInt(window.localStorage.getItem('velocipede_count') || '0', 10) || 0;
      if (n > 0) setAttempts(n);
    } catch {
      /* no storage, no counter */
    }
    const b = new URLSearchParams(window.location.search).get('b');
    const got = b ? decode(b) : null;
    if (!got) return;
    const sc = scene.current, now = performance.now(), k = LINK_INK_MS / 900;
    sc.pts = { ...got.pts };
    ORDER.forEach((id, i) => { sc.inkT[id] = now + i * 70 * k; });
    TUBES.forEach((_, i) => { sc.inkT['t' + i] = now + (380 + i * 30) * k; });
    sc.chain = got.chain;
    sc.inkT.chain = now + 500 * k;
    sc.inkT.rider = now + 600 * k;
    setCount(5);
    setShared(true);
    setFillDelay(900);
    setPhase('ready');
  }, []);

  // verdict: lines 1 and 3 at once, line 2 types
  useEffect(() => {
    if (!lines) return;
    const n = lines[1].length, start = performance.now();
    if (reducedRef.current) { setTyped(n); return; }
    const id = window.setInterval(() => {
      const k = Math.min(n, Math.floor((performance.now() - start) / 18));
      setTyped(k);
      if (k >= n) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [lines]);

  // Below md the stage is fixed over the whole page; the chrome it covers goes inert so a
  // keyboard user does not tab through invisible links.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const marked: HTMLElement[] = [];
    const release = () => { marked.forEach((el) => el.removeAttribute('inert')); marked.length = 0; };
    const apply = () => {
      release();
      if (!mq.matches) return;
      for (let el: HTMLElement | null = rootRef.current; el && el !== document.body; el = el.parentElement) {
        for (const sib of Array.from(el.parentElement?.children ?? [])) {
          if (sib !== el && sib instanceof HTMLElement && !sib.hasAttribute('inert')) { sib.setAttribute('inert', ''); marked.push(sib); }
        }
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => { mq.removeEventListener('change', apply); release(); };
  }, []);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    if (copyField) copyRef.current?.select();
  }, [copyField]);

  const norm = (e: React.PointerEvent) => {
    const r = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.width, px: r.width };
  };
  const nearest = (q: P, within: number): PartId | null => {
    let best: PartId | null = null, bd = within;
    for (const k of ORDER) {
      const v = scene.current.pts[k];
      if (v && dist(v, q) < bd) { bd = dist(v, q); best = k; }
    }
    return best;
  };
  const nudge = () => {
    if (reducedRef.current) return;
    promptRef.current?.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
      { duration: 260 },
    );
  };

  const startRide = () => {
    const sc = scene.current, now = performance.now();
    const r = makeRide(sc.pts as Pts, sc.chain as Target, now, size.current.w, familyRef.current);
    if (reducedRef.current) r.t0 = now - (LEVEL_MS + r.T);
    sc.ride = r;
    sc.stampAt = reducedRef.current ? now : r.t0 + LEVEL_MS + r.T + STAMP_DELAY;
    setCopyField(null);
    setPhase('running');
  };

  const tap = (q: { x: number; y: number; px: number }) => {
    const sc = scene.current, ph = phaseRef.current, now = performance.now();
    if (ph === 'build') {
      const idx = ORDER.filter((k) => sc.pts[k]).length;
      const id = ORDER[idx];
      if (nearest(q, STACK)) return flash(ERR_STACK);
      if (!inPaper(id, q)) return flash(ERR_GROUND);
      sc.pts[id] = snap(q);
      sc.inkT[id] = now;
      setCount(idx + 1);
      if (idx === 4) {
        TUBES.forEach((_, i) => { sc.inkT['t' + i] = now + 220 + i * 90; });
        sc.pulseT = now + 220 + 540;
        setPhase('chain');
      }
      return;
    }
    if (ph === 'chain') {
      let best: Target | null = null, bd = Infinity;
      for (const k of TARGETS) {
        const v = sc.pts[k] as P, r = Math.max(22 / q.px, k === 'R' || k === 'F' ? WR : 0), dd = dist(v, q);
        if (dd < r && dd < bd) { bd = dd; best = k; }
      }
      if (!best) return nudge();
      sc.chain = best;
      sc.inkT.chain = now;
      sc.inkT.rider = now + 300;
      setFillDelay(600);
      setPhase('ready');
    }
  };

  const onDown = (e: React.PointerEvent) => {
    const ph = phaseRef.current;
    if (ph === 'running') {
      const sc = scene.current, r = sc.ride as Ride, now = performance.now();
      r.t0 = now - (LEVEL_MS + r.T);
      sc.stampAt = now;
      return;
    }
    if (ph === 'result') return;
    const q = norm(e);
    const near = nearest(q, STACK);
    if (near) {
      drag.current = { id: near, moved: false, x: e.clientX, y: e.clientY };
      (e.target as Element).setPointerCapture(e.pointerId);
      return;
    }
    tap(q);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
    d.moved = true;
    scene.current.pts[d.id] = snap(clampPart(d.id, norm(e)));
    // dragging a part at the ready state changes the composition, so its fit is stale
    scene.current.readyCam = null;
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) tap(norm(e));
  };

  const undo = () => {
    const sc = scene.current;
    setMsg(null);
    sc.readyCam = null;
    if (sc.chain) {
      sc.chain = null;
      delete sc.inkT.chain;
      delete sc.inkT.rider;
      sc.pulseT = 0;
      setPhase('chain');
      return;
    }
    const idx = ORDER.filter((k) => sc.pts[k]).length;
    if (!idx) return;
    const id = ORDER[idx - 1];
    delete sc.pts[id];
    delete sc.inkT[id];
    if (id === 'H') TUBES.forEach((_, i) => delete sc.inkT['t' + i]);
    setCount(idx - 1);
    setPhase('build');
  };
  const again = () => {
    scene.current = emptyScene();
    setBand(VTOP);
    if (shared) window.history.replaceState(null, '', window.location.pathname);
    setShared(false);
    setCount(0);
    setLines(null);
    setSerial(null);
    setOutcome(null);
    setCopyField(null);
    setMsg(null);
    setPhase('build');
  };
  const keep = () => {
    const r = scene.current.ride;
    if (!r) return;
    renderPlate(r, r.lines, familyRef.current).toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = url;
      a.download = `velocipede-${r.serial}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      say(TOAST_SAVED);
    }, 'image/png');
  };
  const copy = async () => {
    const r = scene.current.ride;
    if (!r) return;
    const url = `${window.location.origin}${window.location.pathname}?b=${encode(r.built, r.chain)}`;
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(url);
      setCopyField(null);
      say(TOAST_LINK);
    } catch {
      setCopyField(url);
    }
  };

  const prompt =
    phase === 'build' ? msg ?? PROMPTS[count] :
    phase === 'chain' ? msg ?? CHAIN_PROMPT :
    phase === 'ready' ? (shared ? SHARED_PROMPT : READY_PROMPT) :
    phase === 'result' && outcome ? (outcome === 'rides' ? NUDGE_PASS : NUDGE_FAIL) : '';

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-30 flex flex-col items-center justify-end overflow-hidden overscroll-none bg-[#0B0A08] font-mono text-[#EAE3D2] md:relative md:inset-auto md:z-auto md:overflow-visible md:bg-transparent"
    >
      <style>{CSS}</style>
      <div className="flex w-full max-w-[480px] shrink-0 items-start justify-between gap-3 px-3 pb-3 md:px-0">
        <div className="min-w-0">
          <h1 className="font-pixel text-[28px] leading-none text-[#EAE3D2]">Velocipede</h1>
          <p className="mt-1.5 text-[13px] leading-tight text-[#EAE3D2]/60">Everyone knows what a bicycle looks like. Let us test that.</p>
          {language === 'pl' && (
            <p lang="pl" className="mt-1 text-[12px] leading-tight text-[#EAE3D2]/40 md:hidden">Ten eksperyment jest na razie dostępny tylko po angielsku.</p>
          )}
        </div>
        <Link
          href="/experiments/"
          prefetch={false}
          className="-mr-1 -mt-3 inline-flex min-h-11 shrink-0 items-center px-1 text-[12px] text-[#EAE3D2]/45 outline-none focus-visible:ring-1 focus-visible:ring-[#EAE3D2] md:hidden"
        >
          {language === 'pl' ? 'Laboratorium' : 'Back to the lab'}
        </Link>
      </div>

      <div
        ref={sheetRef}
        className="velo-sheet relative shrink-0 select-none"
        style={{ aspectRatio: '4 / 5', backgroundColor: BONE }}
        data-phase={phase}
        data-outcome={outcome ?? ''}
        data-serial={serial ?? ''}
        data-band={band.toFixed(4)}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }} />
        <div className="pointer-events-none absolute inset-[10px] border border-[#16130F]" />
        <div className="pointer-events-none absolute inset-[14px] border border-[#16130F]/60" style={{ borderWidth: '0.6px' }} />
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 1 ${SH}`} preserveAspectRatio="none">
          <g ref={groundRef}>
            <path d={`M0.05 ${GROUND}L0.95 ${GROUND}`} stroke={INK} strokeWidth={1.5 * U} strokeLinecap="round" fill="none" />
            <path d={HATCH_D} stroke={INK} strokeOpacity={0.45} strokeWidth={0.75 * U} strokeLinecap="round" fill="none" />
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-x-0 top-[4.5%] -translate-y-1/2 text-center text-[13px] tracking-[0.2em] text-[#16130F]">VELOCIPEDE</div>
        {attempts > 0 && phase !== 'result' && (
          <div className="pointer-events-none absolute inset-x-0 top-[8%] text-center text-[12px] text-[#16130F]/70">No. of attempts on file: {attempts}</div>
        )}
        {serial !== null && phase === 'result' && (
          <div className="pointer-events-none absolute right-[7%] top-[8%] text-[12px] text-[#16130F]">No. {serial}</div>
        )}
        {count === 0 && phase === 'build' && (
          <div className="pointer-events-none absolute inset-x-0 top-[78%] text-center text-[15px] text-[#16130F]">Draw a bicycle from memory.</div>
        )}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Your bicycle, drawn on a patent sheet"
          className="absolute inset-0 h-full w-full"
          style={{ touchAction: 'none' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { drag.current = null; }}
        />
        {lines && phase === 'result' && (
          <div data-verdict="" className="pointer-events-none absolute inset-x-[7%] text-[#16130F]" style={{ top: `${(band / SH) * 100}%` }}>
            <p className="text-[12px] leading-[18px] opacity-80">{lines[0]}</p>
            <p className="mt-1 text-[15px] leading-[20px]">
              <span>{lines[1].slice(0, typed)}</span>
              <span className="opacity-0">{lines[1].slice(typed)}</span>
            </p>
            <p className="mt-1 text-[12px] leading-[18px] opacity-80">{lines[2]}</p>
          </div>
        )}
      </div>

      <div ref={promptRef} role="status" aria-live="polite" className="flex h-[52px] w-full max-w-[480px] shrink-0 items-center justify-center px-4 text-center text-[15px] leading-[19px]">
        {copyField ? (
          <div className="flex w-full flex-col items-stretch gap-1">
            <span className="text-[12px] leading-none text-[#EAE3D2]/70">{ERR_COPY}</span>
            <input
              ref={copyRef}
              readOnly
              value={copyField}
              onFocus={(e) => e.currentTarget.select()}
              className="h-7 w-full rounded-[2px] border border-[#EAE3D2]/40 bg-transparent px-2 text-[13px] text-[#EAE3D2] outline-none focus-visible:ring-1 focus-visible:ring-[#EAE3D2]"
            />
          </div>
        ) : (
          toast ?? prompt
        )}
      </div>
      <div className="flex h-14 w-full max-w-[480px] shrink-0 items-center gap-2 px-3 md:px-0">
        {(phase === 'build' || phase === 'chain') && count > 0 && <Btn onClick={undo}>Undo</Btn>}
        {phase === 'ready' && (
          <>
            {!shared && <Btn onClick={undo}>Undo</Btn>}
            <Btn onClick={startRide} fillDelay={fillDelay}>Ride</Btn>
          </>
        )}
        {phase === 'result' && !shared && (
          <>
            <Btn onClick={keep}>Keep</Btn>
            <Btn onClick={copy}>Copy link</Btn>
            <Btn primary onClick={again}>Again</Btn>
          </>
        )}
        {phase === 'result' && shared && (
          <>
            <Btn onClick={copy}>Copy link</Btn>
            <Btn primary onClick={again}>Draw yours</Btn>
          </>
        )}
      </div>
      <div className="h-2 shrink-0 md:hidden" style={{ marginBottom: 'env(safe-area-inset-bottom)' }} />
    </div>
  );
}
