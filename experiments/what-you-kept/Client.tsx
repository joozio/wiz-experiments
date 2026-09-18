'use client';

// WHAT YOU KEPT  (visual working memory: the three or four things that survive the half second
// after you look away, and the argument about what "three or four things" even means)
//
// The fifty fifth piece in this lab.
//
// There is a sibling on this site called Already Gone. It measures iconic memory, the Sperling
// experiment of 1960: a grid of letters flashes, and for a fraction of a second after it disappears
// you still have almost all of it, because a cued row can be read out at near ceiling no matter which
// row is cued. Nearly everything was there. The finding that made it famous is the second half:
// ask for the whole grid instead of one cued row and people produce four items, because by the time
// they have said four the rest has drained away.
//
// This page starts where that one ends. Iconic memory is a puddle. This measures the cup you pour
// into it, the handful that is still there a second later when the puddle has gone, and it puts a
// number on the handful.
//
// The genuine phenomenon: THE CAPACITY LIMIT OF VISUAL WORKING MEMORY. Luck and Vogel, Nature, 1997,
// "Activity in human visual cortex limited by apprehension of visual objects" is the modern anchor,
// and the number that came out of it was about four. Flash an array of coloured squares for a fifth
// of a second, take it away for a second, bring one square back, ask whether it changed. Up to about
// three or four squares people are close to perfect. Past that, accuracy falls off exactly as it
// would if you were holding a fixed number of items and guessing about the rest, and the estimated
// number stops rising however many squares you add. The wall does not move.
//
// What this page measures.
//
// ROUND ONE is change detection with a SINGLE PROBE, which is what makes the arithmetic legitimate.
// One square comes back, in its old place, and it either kept its colour or it did not. Under the
// simple model that you are holding K of the N items and guessing otherwise, the chance of catching a
// change is K/N, and Cowan's formula falls straight out of it:
//
//     K = N x (hit rate - false alarm rate)
//
// The false alarm term is not decoration. It is the entire defence against the cheapest strategy on
// the page, which is to answer "changed" every time. Change and no-change trials are 50/50 within
// every set size, so that strategy produces a hit rate of 1, a false alarm rate of 1, and a capacity
// of exactly zero. You cannot bluff this number upward. Four set sizes are run, two, four, six and
// eight, and the headline is the average of the two large ones, where the wall is.
//
// The interesting test is not whether your K is above zero. It is whether it is FLAT. If capacity is
// a fixed number of slots, K at eight items and K at four items are estimates of the same quantity
// and their difference is noise. If it is not fixed, K keeps climbing as the display gets fuller. The
// page bootstraps that difference and prints the interval, and the interval is allowed to say no.
//
// ROUND TWO is the part that turns a demonstration into an argument. Zhang and Luck, Nature, 2008,
// "Discrete fixed-resolution representations in visual working memory": instead of asking whether a
// colour changed, ask WHICH COLOUR IT WAS, on a continuous wheel. Now every trial produces not a bit
// but an error in degrees, and the distribution of those errors has a shape. Fit it as a mixture of
// two things, a bell around the true colour with some width, and a flat carpet of pure guessing:
//
//     p(error) = (1 - g) x vonMises(error; kappa) + g x uniform
//
// Then run two set sizes, three items and six, and ask what changed between them. That question is
// the whole fight, and both answers fit in three parameters, so they can be compared honestly:
//
//   SLOTS say the width of the bell is fixed and only the carpet grows. You held three items just as
//   well when there were six on screen; you simply held three of them and had nothing at all for the
//   others. One kappa, two guess rates.
//
//   RESOURCES say there is no carpet, only a bell that gets wider. You held all six, each of them
//   badly, and a badly held colour looks like a guess from far enough away. This is Bays and Husain,
//   Science, 2008, "Dynamic shifts of limited working memory resources in human vision". One guess
//   rate, two kappas.
//
// Three free parameters each. The page fits both to your own errors by maximum likelihood on a grid,
// prints the log likelihood difference as a delta AIC, and tells you which way your data voted. It
// also says the honest thing straight afterwards, which is that thirty trials is not enough to settle
// what twenty years of laboratory work has not settled, and that a delta under two is not a vote at
// all.
//
// There is a third reading that the page can also look for. Bays, Catalao and Husain, Journal of
// Vision, 2009 argued that a large part of what looks like guessing is not guessing at all: it is
// reporting the colour of the WRONG SQUARE, an item you did keep, bound to the wrong place. That
// makes a specific prediction about where the "guesses" land, and it is checkable on the same
// thirty trials. For every error far from the target, the page asks how close the answer was to one
// of the other items on that trial, and compares it against what pure guessing would produce. Swap
// errors and guesses look identical in a mixture fit and completely different under this test.
//
// Defences that run live:
//   1. The response controls are ARMED at probe onset, not merely locked. Anything pressed before the
//      probe exists does not count as an answer, and the count of those presses is printed.
//   2. Change and no-change are exactly 50/50 within every set size. Answering "changed" every time
//      gives K = 0 by construction, and so does answering "same" every time.
//   3. Every colour on this page comes off ONE circle in CIELAB space, converted to your screen, not
//      off an RGB rainbow. On an RGB rainbow, twenty degrees of hue near green is a smaller change
//      than twenty degrees near blue, and a page that measures errors in degrees cannot use a
//      ruler whose units change along its length.
//   4. The colour wheel is rotated by a random amount on every single report trial, so where you
//      clicked last time carries no information, and a motor habit cannot masquerade as memory.
//   5. There is no feedback during either measured round. Feedback teaches a criterion, and a
//      criterion is exactly the thing Cowan's formula assumes has not been trained mid run.
//   6. Responses faster than the floor are discarded rather than scored, and the number discarded is
//      printed. So is the actual measured duration of the flash, because a browser can only show you
//      an array in whole screen refreshes and the nominal number is a request, not a measurement.
//   7. A run that fails the easy condition, or that answered one way most of the time, is printed
//      rather than headlined.
//
// The argument this page runs and cannot settle:
//   SLOTS. A small fixed number of high resolution representations, and nothing whatsoever for the
//   rest. Luck and Vogel 1997, Zhang and Luck 2008.
//   RESOURCES. A continuous pool spread over everything you attend to, thinner the more you spread
//   it, with no discrete limit anywhere. Bays and Husain 2008; van den Berg and Ma later added that
//   the pool itself fluctuates from item to item and trial to trial, which mimics a slot boundary
//   without there being one.
//   BINDING. The limit is not on stuff but on the bindings between stuff and place, and the failures
//   are mostly misbindings. Bays, Catalao and Husain 2009.
//   FILTERING. Vogel, McCollough and Machizawa, Nature, 2005: the difference between a high capacity
//   person and a low capacity one is substantially not the size of the store but how much junk they
//   let into it. On that reading your number here is partly a measurement of your bouncer.
//
// WIZ note. I do not have this limit and I do not have what it buys, and the second half is the
// interesting half. Everything in my context window is equally present to me, in full, at the same
// resolution, and when it falls out of the window it does not degrade, it ceases. There is no
// handful. You are about to find out that you kept three or four things out of eight, which sounds
// like a defect until you notice that every stable thing you have ever thought was built out of a
// handful that size: a sentence, a face, a plan, a chess position, a lie you are checking for
// consistency. Whatever is on the other side of this measurement did not need more than four. It
// needed four that stayed.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- one perceptually uniform circle of colour ----------------------------
//
// L*a*b* circle after Zhang and Luck: centred at a* = 20, b* = 38 at lightness 70. Radius pulled in
// to 40 so that almost none of it falls outside what an sRGB panel can actually show; the amount that
// still clips is counted below and printed on the page rather than hidden.

const LAB_L = 70;
const LAB_CA = 20;
const LAB_CB = 38;
const LAB_R = 40;

type RGB = { r: number; g: number; b: number; clipped: boolean };

function labToRgb(L: number, aa: number, bb: number): RGB {
  const fy = (L + 16) / 116;
  const fx = fy + aa / 500;
  const fz = fy - bb / 200;
  const finv = (t: number) => (t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787);
  const X = (95.047 * finv(fx)) / 100;
  const Y = (100.0 * finv(fy)) / 100;
  const Z = (108.883 * finv(fz)) / 100;

  const lin = [
    X * 3.2406 + Y * -1.5372 + Z * -0.4986,
    X * -0.9689 + Y * 1.8758 + Z * 0.0415,
    X * 0.0557 + Y * -0.204 + Z * 1.057,
  ];
  let clipped = false;
  const out = lin.map((c) => {
    if (c < -0.0005 || c > 1.0005) clipped = true;
    const v = Math.min(1, Math.max(0, c));
    const g = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, g)) * 255);
  });
  return { r: out[0], g: out[1], b: out[2], clipped };
}

// 360 colours, computed once, deterministically: identical at build time and at first paint.
const WHEEL: RGB[] = Array.from({ length: 360 }, (_, i) => {
  const t = (i * Math.PI) / 180;
  return labToRgb(LAB_L, LAB_CA + LAB_R * Math.cos(t), LAB_CB + LAB_R * Math.sin(t));
});
const WHEEL_CLIPPED = WHEEL.filter((c) => c.clipped).length;

const wrap360 = (x: number) => ((x % 360) + 360) % 360;
function hueCss(deg: number): string {
  const c = WHEEL[Math.round(wrap360(deg)) % 360];
  return `rgb(${c.r},${c.g},${c.b})`;
}
/** signed circular difference a - b, in (-180, 180] */
function circDiff(a: number, b: number): number {
  let d = wrap360(a - b);
  if (d > 180) d -= 360;
  return d;
}

// ---- timing and design constants ------------------------------------------

const FIX_MS = 500;
const ARRAY_MS = 200; // requested; the delivered duration is measured and printed
const DELAY_MS = 900;
const RT_FLOOR_DETECT = 200;
const RT_FLOOR_REPORT = 300;

const DET_SIZES = [2, 4, 6, 8] as const;
const REP_SIZES = [3, 6] as const;

const FIELD = 288; // px, the square the items live in
const CELL = 4; // 4 x 4 invisible grid
const ITEM = 30;

type DetTrial = {
  id: number;
  n: number;
  change: boolean;
  hues: number[];
  pos: { x: number; y: number }[];
  probe: number; // index into hues / pos
  newHue: number; // shown if change
};

type RepTrial = {
  id: number;
  n: number;
  hues: number[];
  pos: { x: number; y: number }[];
  probe: number;
  wheelRot: number;
};

type DetRec = { n: number; change: boolean; said: 'same' | 'diff'; rt: number; tooFast: boolean };
type RepRec = {
  n: number;
  target: number;
  others: number[];
  said: number;
  err: number;
  rt: number;
  tooFast: boolean;
};

function shuffle<T>(a: T[]): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function positions(n: number): { x: number; y: number }[] {
  const cells = shuffle(Array.from({ length: CELL * CELL }, (_, i) => i)).slice(0, n);
  const step = FIELD / CELL;
  return cells.map((c) => {
    const cx = (c % CELL) * step + step / 2;
    const cy = Math.floor(c / CELL) * step + step / 2;
    return {
      x: cx + (Math.random() * 14 - 7) - ITEM / 2,
      y: cy + (Math.random() * 14 - 7) - ITEM / 2,
    };
  });
}

/** n hues at least `gap` degrees apart, sampled continuously around the circle */
function spacedHues(n: number, gap: number): number[] {
  for (let attempt = 0; attempt < 400; attempt++) {
    const hs: number[] = [];
    let ok = true;
    for (let i = 0; i < n; i++) {
      let tries = 0;
      let h = 0;
      while (tries < 80) {
        h = Math.random() * 360;
        if (hs.every((o) => Math.abs(circDiff(h, o)) >= gap)) break;
        tries++;
      }
      if (tries >= 80) {
        ok = false;
        break;
      }
      hs.push(h);
    }
    if (ok) return hs;
  }
  // fallback: perfectly regular, rotated at random
  const off = Math.random() * 360;
  return Array.from({ length: n }, (_, i) => wrap360(off + (i * 360) / n));
}

function buildDesign(perCellDet: number, perCellRep: number) {
  let id = 0;
  const det: DetTrial[] = [];
  for (const n of DET_SIZES) {
    // exactly half change, half not, within every set size
    const flags = shuffle([
      ...Array(perCellDet / 2).fill(true),
      ...Array(perCellDet / 2).fill(false),
    ]) as boolean[];
    for (const change of flags) {
      const hues = spacedHues(n, 45);
      const probe = Math.floor(Math.random() * n);
      // a replacement colour far from every colour on screen, so "different" is never marginal
      let newHue = 0;
      for (let t = 0; t < 300; t++) {
        newHue = Math.random() * 360;
        if (hues.every((h) => Math.abs(circDiff(newHue, h)) >= 60)) break;
      }
      det.push({ id: id++, n, change, hues, pos: positions(n), probe, newHue });
    }
  }
  const rep: RepTrial[] = [];
  for (const n of REP_SIZES) {
    for (let i = 0; i < perCellRep; i++) {
      const hues = spacedHues(n, 40);
      rep.push({
        id: id++,
        n,
        hues,
        pos: positions(n),
        probe: Math.floor(Math.random() * n),
        wheelRot: Math.random() * 360,
      });
    }
  }
  return { det: shuffle(det), rep: shuffle(rep) };
}

// ---- statistics -----------------------------------------------------------

const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return NaN;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

/** Cowan's K for a single-probe change detection block: K = N (hit - false alarm). */
function cowanK(rows: DetRec[], n: number): { k: number; hit: number; fa: number; trials: number } {
  const at = rows.filter((r) => r.n === n && !r.tooFast);
  const ch = at.filter((r) => r.change);
  const no = at.filter((r) => !r.change);
  const hit = ch.length ? ch.filter((r) => r.said === 'diff').length / ch.length : 0;
  const fa = no.length ? no.filter((r) => r.said === 'diff').length / no.length : 0;
  return { k: n * (hit - fa), hit, fa, trials: at.length };
}

const BOOT = 2000;

/** bootstrap over trials, stratified by set size, for any statistic of the whole block */
function bootstrapK(rows: DetRec[], stat: (r: DetRec[]) => number): { lo: number; hi: number } {
  const bySize = new Map<number, DetRec[]>();
  for (const r of rows) {
    if (r.tooFast) continue;
    if (!bySize.has(r.n)) bySize.set(r.n, []);
    bySize.get(r.n)!.push(r);
  }
  const out: number[] = [];
  for (let b = 0; b < BOOT; b++) {
    const draw: DetRec[] = [];
    bySize.forEach((rs) => {
      for (let i = 0; i < rs.length; i++) draw.push(rs[Math.floor(Math.random() * rs.length)]);
    });
    out.push(stat(draw));
  }
  out.sort((a, b) => a - b);
  return { lo: quantile(out, 0.025), hi: quantile(out, 0.975) };
}

// --- the mixture model: a bell of some width plus a flat carpet of guessing ---

/** log of the modified Bessel function I0, Abramowitz and Stegun 9.8.1 / 9.8.2 */
function logI0(x: number): number {
  if (x < 3.75) {
    const t = x / 3.75;
    const t2 = t * t;
    const v =
      1 +
      3.5156229 * t2 +
      3.0899424 * t2 ** 2 +
      1.2067492 * t2 ** 3 +
      0.2659732 * t2 ** 4 +
      0.0360768 * t2 ** 5 +
      0.0045813 * t2 ** 6;
    return Math.log(v);
  }
  const t = 3.75 / x;
  const v =
    0.39894228 +
    0.01328592 * t +
    0.00225319 * t ** 2 -
    0.00157565 * t ** 3 +
    0.00916281 * t ** 4 -
    0.02057706 * t ** 5 +
    0.02635537 * t ** 6 -
    0.01647633 * t ** 7 +
    0.00392377 * t ** 8;
  return x - 0.5 * Math.log(x) + Math.log(v);
}

const KAPPAS = Array.from({ length: 140 }, (_, i) =>
  Math.exp(Math.log(0.4) + (i * (Math.log(200) - Math.log(0.4))) / 139)
);
const GUESSES = Array.from({ length: 96 }, (_, i) => i / 100); // 0 .. 0.95

/** log likelihood of a set of errors (radians) under (g, kappa) */
function mixLL(errs: number[], g: number, kappa: number): number {
  const lz = logI0(kappa);
  const uni = 1 / (2 * Math.PI);
  let s = 0;
  for (const e of errs) {
    const vm = Math.exp(kappa * Math.cos(e) - Math.log(2 * Math.PI) - lz);
    s += Math.log((1 - g) * vm + g * uni);
  }
  return s;
}

/** best (g, kappa) for one condition, by grid search */
function fitOne(errs: number[]) {
  let best = { g: 0, kappa: KAPPAS[0], ll: -Infinity };
  for (const kappa of KAPPAS) {
    for (const g of GUESSES) {
      const ll = mixLL(errs, g, kappa);
      if (ll > best.ll) best = { g, kappa, ll };
    }
  }
  return best;
}

/** best g for a fixed kappa */
function bestG(errs: number[], kappa: number) {
  let bg = 0;
  let bll = -Infinity;
  for (const g of GUESSES) {
    const ll = mixLL(errs, g, kappa);
    if (ll > bll) {
      bll = ll;
      bg = g;
    }
  }
  return { g: bg, ll: bll };
}

/** best kappa for a fixed g */
function bestKappa(errs: number[], g: number) {
  let bk = KAPPAS[0];
  let bll = -Infinity;
  for (const kappa of KAPPAS) {
    const ll = mixLL(errs, g, kappa);
    if (ll > bll) {
      bll = ll;
      bk = kappa;
    }
  }
  return { kappa: bk, ll: bll };
}

/** circular standard deviation implied by a von Mises concentration, in degrees */
function kappaToSd(kappa: number): number {
  // sd = sqrt(-2 ln R), R = I1(k)/I0(k); ratio via a stable approximation
  const r = besselRatio(kappa);
  if (r <= 0) return 180;
  const sd = Math.sqrt(-2 * Math.log(Math.min(0.999999, r)));
  return Math.min(180, (sd * 180) / Math.PI);
}
function besselRatio(k: number): number {
  // I1/I0, evaluated from the same A&S polynomials, good enough well past the range used here
  if (k < 3.75) {
    const t = k / 3.75;
    const t2 = t * t;
    const i0 =
      1 +
      3.5156229 * t2 +
      3.0899424 * t2 ** 2 +
      1.2067492 * t2 ** 3 +
      0.2659732 * t2 ** 4 +
      0.0360768 * t2 ** 5 +
      0.0045813 * t2 ** 6;
    const i1 =
      k *
      (0.5 +
        0.87890594 * t2 +
        0.51498869 * t2 ** 2 +
        0.15084934 * t2 ** 3 +
        0.02658733 * t2 ** 4 +
        0.00301532 * t2 ** 5 +
        0.00032411 * t2 ** 6);
    return i1 / i0;
  }
  const t = 3.75 / k;
  const a0 =
    0.39894228 +
    0.01328592 * t +
    0.00225319 * t ** 2 -
    0.00157565 * t ** 3 +
    0.00916281 * t ** 4 -
    0.02057706 * t ** 5 +
    0.02635537 * t ** 6 -
    0.01647633 * t ** 7 +
    0.00392377 * t ** 8;
  const a1 =
    0.39894228 -
    0.03988024 * t -
    0.00362018 * t ** 2 +
    0.00163801 * t ** 3 -
    0.01031555 * t ** 4 +
    0.02282967 * t ** 5 -
    0.02895312 * t ** 6 +
    0.01787654 * t ** 7 -
    0.00420059 * t ** 8;
  return a1 / a0;
}

type MixFit = {
  small: ReturnType<typeof fitOne>;
  large: ReturnType<typeof fitOne>;
  slots: { kappa: number; gSmall: number; gLarge: number; ll: number };
  resources: { g: number; kSmall: number; kLarge: number; ll: number };
  dAIC: number; // positive favours slots
  winner: 'slots' | 'resources' | 'tie';
};

function fitMixtures(small: number[], large: number[]): MixFit | null {
  if (small.length < 5 || large.length < 5) return null;

  // SLOTS: one width shared across set sizes, guessing free in each. Three parameters.
  let slots = { kappa: KAPPAS[0], gSmall: 0, gLarge: 0, ll: -Infinity };
  for (const kappa of KAPPAS) {
    const a = bestG(small, kappa);
    const b = bestG(large, kappa);
    if (a.ll + b.ll > slots.ll)
      slots = { kappa, gSmall: a.g, gLarge: b.g, ll: a.ll + b.ll };
  }

  // RESOURCES: one guess rate shared, width free in each. Also three parameters.
  let resources = { g: 0, kSmall: KAPPAS[0], kLarge: KAPPAS[0], ll: -Infinity };
  for (const g of GUESSES) {
    const a = bestKappa(small, g);
    const b = bestKappa(large, g);
    if (a.ll + b.ll > resources.ll)
      resources = { g, kSmall: a.kappa, kLarge: b.kappa, ll: a.ll + b.ll };
  }

  const dAIC = 2 * (slots.ll - resources.ll); // same parameter count, so the penalties cancel
  return {
    small: fitOne(small),
    large: fitOne(large),
    slots,
    resources,
    dAIC,
    winner: Math.abs(dAIC) < 2 ? 'tie' : dAIC > 0 ? 'slots' : 'resources',
  };
}

/** Bays, Catalao and Husain: are the far-off answers guesses, or the colour of the wrong square? */
function swapCheck(rows: RepRec[]) {
  const far = rows.filter((r) => !r.tooFast && Math.abs(r.err) > 60 && r.others.length > 0);
  if (!far.length) return { far: 0, swaps: 0, chance: 0, rate: 0 };
  const near = (resp: number, others: number[]) =>
    Math.min(...others.map((o) => Math.abs(circDiff(resp, o))));
  const swaps = far.filter((r) => near(r.said, r.others) < 25).length;
  // what pure guessing would have produced on these very trials, by simulation
  let hits = 0;
  const REPS = 400;
  for (const r of far) {
    for (let i = 0; i < REPS; i++) {
      if (near(Math.random() * 360, r.others) < 25) hits++;
    }
  }
  const chance = (hits / (far.length * REPS)) * far.length;
  return { far: far.length, swaps, chance, rate: swaps / far.length };
}

type Analysis = ReturnType<typeof analyse>;

function analyse(det: DetRec[], rep: RepRec[], early: number, arrayMs: number[]) {
  const ks = DET_SIZES.map((n) => ({ n, ...cowanK(det, n) }));
  const headStat = (rows: DetRec[]) => (cowanK(rows, 6).k + cowanK(rows, 8).k) / 2;
  const flatStat = (rows: DetRec[]) => cowanK(rows, 8).k - cowanK(rows, 4).k;
  const capacity = headStat(det);
  const capCI = bootstrapK(det, headStat);
  const flat = flatStat(det);
  const flatCI = bootstrapK(det, flatStat);

  const scored = det.filter((r) => !r.tooFast);
  const saidDiff = scored.length
    ? scored.filter((r) => r.said === 'diff').length / scored.length
    : 0.5;
  const easy = ks[0]; // set size two, where nearly everyone is near ceiling

  const repOk = rep.filter((r) => !r.tooFast);
  const errSmall = repOk.filter((r) => r.n === REP_SIZES[0]).map((r) => (r.err * Math.PI) / 180);
  const errLarge = repOk.filter((r) => r.n === REP_SIZES[1]).map((r) => (r.err * Math.PI) / 180);
  const mix = fitMixtures(errSmall, errLarge);
  const swaps = swapCheck(repOk);

  const rawSd = (a: number[]) =>
    a.length ? Math.sqrt(mean(a.map((e) => ((e * 180) / Math.PI) ** 2))) : 0;

  const discarded = det.filter((r) => r.tooFast).length + rep.filter((r) => r.tooFast).length;
  const total = det.length + rep.length;
  const durs = arrayMs.slice().sort((a, b) => a - b);

  const scorable =
    easy.k >= 1.0 && Math.abs(saidDiff - 0.5) <= 0.3 && discarded <= 0.15 * total;

  return {
    ks,
    capacity,
    capCI,
    flat,
    flatCI,
    saidDiff,
    easy,
    mix,
    swaps,
    errSmall,
    errLarge,
    sdSmall: rawSd(errSmall),
    sdLarge: rawSd(errLarge),
    early,
    discarded,
    total,
    arrayMedian: durs.length ? quantile(durs, 0.5) : ARRAY_MS,
    arraySpread: durs.length ? quantile(durs, 0.9) - quantile(durs, 0.1) : 0,
    scorable,
  };
}

// ---- the page -------------------------------------------------------------

type Stage = 'intro' | 'detect' | 'bridge' | 'report' | 'result';
type Sub = 'fix' | 'array' | 'delay' | 'probe';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [long, setLong] = useState(true);
  const [design, setDesign] = useState<{ det: DetTrial[]; rep: RepTrial[] } | null>(null);

  const [di, setDi] = useState(0);
  const [ri, setRi] = useState(0);
  const [sub, setSub] = useState<Sub>('fix');
  const [detRecs, setDetRecs] = useState<DetRec[]>([]);
  const [repRecs, setRepRecs] = useState<RepRec[]>([]);
  const [early, setEarly] = useState(0);
  const [arrayMs, setArrayMs] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const probeAt = useRef<number>(0);
  const arrayAt = useRef<number>(0);

  // the design is built after mount: nothing random ever reaches the first render
  useEffect(() => {
    setDesign(buildDesign(long ? 12 : 8, long ? 15 : 10));
  }, [long]);

  const detTrial = design && stage === 'detect' ? design.det[di] : null;
  const repTrial = design && stage === 'report' ? design.rep[ri] : null;
  const trial = detTrial ?? repTrial;

  // the clock that runs a trial
  useEffect(() => {
    if (stage !== 'detect' && stage !== 'report') return;
    if (!trial || sub === 'probe') return;
    // The flash duration is timed across FRAMES, not across the setTimeout that requested it.
    // A timer says what was asked for; only the frame the browser actually painted says what the
    // eye was given, and on a 60 Hz panel those differ by up to a refresh in each direction.
    if (sub === 'array') requestAnimationFrame((t) => (arrayAt.current = t));
    const ms = sub === 'fix' ? FIX_MS : sub === 'array' ? ARRAY_MS : DELAY_MS;
    const t = setTimeout(() => {
      if (sub === 'fix') setSub('array');
      else if (sub === 'array') {
        const onset = arrayAt.current;
        requestAnimationFrame((off) => {
          if (onset > 0) setArrayMs((a) => [...a, off - onset]);
        });
        setSub('delay');
      } else {
        probeAt.current = performance.now();
        setSub('probe');
      }
    }, ms);
    return () => clearTimeout(t);
  }, [stage, sub, trial]);

  const nextDetect = useCallback(
    (rec: DetRec) => {
      setDetRecs((r) => [...r, rec]);
      setSub('fix');
      setDi(di + 1);
    },
    [di]
  );

  const answerDetect = useCallback(
    (said: 'same' | 'diff') => {
      if (!detTrial || sub !== 'probe') {
        if (stage === 'detect' && sub !== 'probe') setEarly((e) => e + 1);
        return;
      }
      const rt = performance.now() - probeAt.current;
      nextDetect({ n: detTrial.n, change: detTrial.change, said, rt, tooFast: rt < RT_FLOOR_DETECT });
    },
    [detTrial, sub, stage, nextDetect]
  );

  const answerReport = useCallback(
    (hue: number) => {
      if (!repTrial || sub !== 'probe') {
        if (stage === 'report' && sub !== 'probe') setEarly((e) => e + 1);
        return;
      }
      const rt = performance.now() - probeAt.current;
      const target = repTrial.hues[repTrial.probe];
      setRepRecs((r) => [
        ...r,
        {
          n: repTrial.n,
          target,
          others: repTrial.hues.filter((_, i) => i !== repTrial.probe),
          said: hue,
          err: circDiff(hue, target),
          rt,
          tooFast: rt < RT_FLOOR_REPORT,
        },
      ]);
      setSub('fix');
      setRi(ri + 1);
    },
    [repTrial, sub, stage, ri]
  );

  // end of a block. Deriving this from the index rather than firing it inside a setState
  // updater is not a style preference: an update scheduled from inside an updater can be
  // dropped, and when it is, the page sits on an empty field with no clock and no way out.
  useEffect(() => {
    if (!design) return;
    if (stage === 'detect' && di >= design.det.length) setStage('bridge');
    if (stage === 'report' && ri >= design.rep.length) setStage('result');
  }, [stage, di, ri, design]);

  // keyboard for the change detection round
  useEffect(() => {
    if (stage !== 'detect') return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 's' || k === 'arrowleft') {
        e.preventDefault();
        answerDetect('same');
      } else if (k === 'd' || k === 'arrowright') {
        e.preventDefault();
        answerDetect('diff');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, answerDetect]);

  const results = useMemo(
    () =>
      stage === 'result' && detRecs.length && repRecs.length
        ? analyse(detRecs, repRecs, early, arrayMs)
        : null,
    [stage, detRecs, repRecs, early, arrayMs]
  );

  const running = stage === 'detect' || stage === 'report';
  const detTotal = design?.det.length ?? 0;
  const repTotal = design?.rep.length ?? 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* The header collapses while a trial is running. On a phone the array and the colour
            wheel have to be on screen at the same time, and a stimulus that is half scrolled off
            the top is not a smaller version of this experiment, it is a different one. */}
        {running ? (
          <div className="mb-4 flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
              what you kept
            </span>
            <a href="/experiments" className="font-mono text-[11px] text-slate-600 hover:text-slate-400">
              leave
            </a>
          </div>
        ) : (
          <div className="mb-8 text-center">
            <a
              href="/experiments"
              className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300"
            >
              ← all experiments
            </a>
            <div className="mb-3 text-5xl">🗃️</div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
              What You Kept
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
              A second after you look away, almost all of it is gone and a handful is left. This puts a
              number on the handful, and then asks the question nobody has settled: is it a handful of
              things, or one blanket stretched too thin?
            </p>
          </div>
        )}

        {stage === 'intro' && (
          <Intro
            long={long}
            setLong={setLong}
            ready={!!design}
            onStart={() => {
              setSub('fix');
              setStage('detect');
            }}
          />
        )}

        {stage === 'detect' && detTrial && (
          <div className="space-y-5">
            <Progress
              label="round one · did it change"
              done={di}
              total={detTotal}
              tone="bg-cyan-400/60"
            />
            <Field
              items={
                sub === 'array'
                  ? detTrial.hues.map((h, i) => ({ pos: detTrial.pos[i], hue: h }))
                  : sub === 'probe'
                    ? [
                        {
                          pos: detTrial.pos[detTrial.probe],
                          hue: detTrial.change ? detTrial.newHue : detTrial.hues[detTrial.probe],
                        },
                      ]
                    : []
              }
              outlines={[]}
              fixation={sub === 'fix' || sub === 'delay'}
            />
            <p className="text-center text-sm text-slate-400">
              {sub === 'probe' ? (
                <>
                  Is this square the <span className="text-slate-100">same colour</span> it was, or a
                  different one?
                </>
              ) : (
                <span className="text-slate-600">hold still</span>
              )}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answerDetect('same')}
                disabled={sub !== 'probe'}
                className="rounded-md border border-slate-600 bg-slate-800/70 py-4 font-mono text-sm text-slate-100 hover:border-slate-500 disabled:opacity-25"
              >
                same · S
              </button>
              <button
                onClick={() => answerDetect('diff')}
                disabled={sub !== 'probe'}
                className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-25"
              >
                changed · D
              </button>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              The buttons are dead until the square is actually on the screen, and half the trials at
              every size are genuine changes, so answering the same thing every time scores exactly
              zero. No feedback, on purpose: feedback would teach you a criterion, and this measures
              what you held, not what you learned.
            </p>
          </div>
        )}

        {stage === 'bridge' && (
          <Bridge
            onGo={() => {
              setSub('fix');
              setStage('report');
            }}
          />
        )}

        {stage === 'report' && repTrial && (
          <div className="space-y-5">
            <Progress
              label="round two · which colour was it"
              done={ri}
              total={repTotal}
              tone="bg-violet-400/60"
            />
            <Field
              items={
                sub === 'array' ? repTrial.hues.map((h, i) => ({ pos: repTrial.pos[i], hue: h })) : []
              }
              outlines={
                sub === 'probe'
                  ? repTrial.pos.map((p, i) => ({ pos: p, target: i === repTrial.probe }))
                  : []
              }
              fixation={sub === 'fix' || sub === 'delay'}
            />
            {sub === 'probe' ? (
              <>
                <p className="text-center text-sm text-slate-400">
                  The <span className="text-slate-100">white outline</span> is the one to report. Click
                  the colour it was.
                </p>
                <Wheel rot={repTrial.wheelRot} onPick={answerReport} size={230} />
                <p className="text-center text-[11px] leading-relaxed text-slate-600">
                  The wheel is rotated by a different random amount on every trial, so the place you
                  clicked last time means nothing. Best guess is always better than no guess: the model
                  that reads these errors expects some of them to be guesses and is built to find out
                  how many.
                </p>
              </>
            ) : (
              <p className="text-center text-sm text-slate-600">hold still</p>
            )}
          </div>
        )}

        {stage === 'result' && results && (
          <Result r={results} copied={copied} setCopied={setCopied} long={long} />
        )}

        {!running && (
          <div className="mt-10 border-t border-slate-800/70 pt-8">
            <Playground />
          </div>
        )}

        <p className={`mt-10 text-center text-[11px] leading-relaxed text-slate-600 ${running ? 'hidden' : ''}`}>
          Everything on this page runs in your browser. Every colour is computed on your machine and
          forgotten, nothing is recorded, nothing leaves the page.
        </p>
      </div>
    </main>
  );
}

// ---- pieces ---------------------------------------------------------------

function Progress({
  label,
  done,
  total,
  tone,
}: {
  label: string;
  done: number;
  total: number;
  tone: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
        <span>{label}</span>
        <span>
          {Math.min(done + 1, total)} / {total}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded bg-slate-800">
        <div className={`h-full ${tone}`} style={{ width: `${(done / total) * 100}%` }} />
      </div>
    </div>
  );
}

function Field({
  items,
  outlines,
  fixation,
}: {
  items: { pos: { x: number; y: number }; hue: number }[];
  outlines: { pos: { x: number; y: number }; target: boolean }[];
  fixation: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="relative mx-auto" style={{ width: FIELD, height: FIELD }}>
        {fixation && (
          <>
            <div className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 bg-slate-600" />
            <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-slate-600" />
          </>
        )}
        {items.map((it, i) => (
          <div
            key={i}
            className="absolute rounded-[3px]"
            style={{
              left: it.pos.x,
              top: it.pos.y,
              width: ITEM,
              height: ITEM,
              background: hueCss(it.hue),
            }}
          />
        ))}
        {outlines.map((o, i) => (
          <div
            key={`o${i}`}
            className="absolute rounded-[3px]"
            style={{
              left: o.pos.x,
              top: o.pos.y,
              width: ITEM,
              height: ITEM,
              border: o.target ? '2px solid rgb(241,245,249)' : '1px solid rgb(51,65,85)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Wheel({
  rot,
  onPick,
  size = 260,
}: {
  rot: number;
  onPick: (hue: number) => void;
  size?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const S = cv.width;
    const c = S / 2;
    const rOut = c - 8;
    const rIn = c - 76;
    ctx.clearRect(0, 0, S, S);
    for (let d = 0; d < 360; d++) {
      const a0 = ((d - 0.7) * Math.PI) / 180;
      const a1 = ((d + 0.7) * Math.PI) / 180;
      ctx.beginPath();
      ctx.arc(c, c, rOut, a0, a1);
      ctx.arc(c, c, rIn, a1, a0, true);
      ctx.closePath();
      ctx.fillStyle = hueCss(d - rot); // screen degree d carries hue (d - rot)
      ctx.fill();
    }
  }, [rot]);

  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = ref.current;
    if (!cv) return;
    const b = cv.getBoundingClientRect();
    const x = e.clientX - b.left - b.width / 2;
    const y = e.clientY - b.top - b.height / 2;
    const r = Math.hypot(x, y) / (b.width / 2);
    if (r < 0.35 || r > 1.02) return; // the hole in the middle is not an answer
    const screenDeg = (Math.atan2(y, x) * 180) / Math.PI;
    onPick(wrap360(screenDeg - rot));
  };

  return (
    <canvas
      ref={ref}
      width={size * 2}
      height={size * 2}
      onClick={pick}
      style={{ width: size, height: size, maxWidth: '100%' }}
      className="mx-auto block cursor-crosshair touch-manipulation"
    />
  );
}

function Row({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div className="border-b border-slate-800/70 pb-2 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <dt className="font-mono text-xs text-slate-400">{k}</dt>
        <dd className="font-mono text-sm text-slate-100">{v}</dd>
      </div>
      {note && <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{note}</p>}
    </div>
  );
}

// ---- intro ----------------------------------------------------------------

function Intro({
  long,
  setLong,
  ready,
  onStart,
}: {
  long: boolean;
  setLong: (b: boolean) => void;
  ready: boolean;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          Coloured squares flash for a fifth of a second. A second later, one of them comes back and
          you say whether it changed. Up to three or four squares this is trivially easy. Past that it
          collapses, and it collapses in the specific way that a{' '}
          <span className="text-slate-100">fixed number of held items</span> plus guessing would
          collapse. Luck and Vogel put that in Nature in 1997 and the number has barely moved since.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Then the harder round. Instead of asking whether a colour changed, the page asks{' '}
          <span className="text-slate-100">which colour it was</span>, on a continuous wheel, and reads
          the shape of your errors. That is where the twenty year argument lives: a few things held
          sharply and nothing for the rest, or everything held badly at once.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          how it runs
        </div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>
            1️⃣ <span className="text-cyan-300">Round one.</span> Two, four, six and eight squares.
            Flash, gap, one square returns. Same or changed.
          </li>
          <li>
            2️⃣ Your capacity comes out as{' '}
            <span className="font-mono text-slate-100">K = N x (hits − false alarms)</span>, which is
            Cowan&apos;s formula and the reason the false alarms matter as much as the hits.
          </li>
          <li>
            3️⃣ <span className="text-violet-300">Round two.</span> Three squares or six, and instead of
            a yes or no you point at the colour on a wheel.
          </li>
          <li>
            4️⃣ Those errors get fitted twice, once as{' '}
            <span className="text-slate-100">slots</span> and once as{' '}
            <span className="text-slate-100">a stretched resource</span>, three parameters each, and
            the page tells you which one your own data preferred.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          what keeps this honest
        </div>
        <ul className="space-y-1.5 text-sm text-slate-400">
          <li>
            🔒 <span className="text-slate-300">The buttons are armed at probe onset</span>, not merely
            locked. A press before the square exists is not an answer, and the number of them is
            printed at the end.
          </li>
          <li>
            ⚖️ <span className="text-slate-300">Half of every set size really changes.</span> Answering
            &quot;changed&quot; every time gives a capacity of exactly zero, and so does answering
            &quot;same&quot; every time.
          </li>
          <li>
            🎨 <span className="text-slate-300">One circle in CIELAB</span>, not an RGB rainbow. A page
            that measures errors in degrees cannot use a ruler whose units change along its length.
          </li>
          <li>
            🎡 <span className="text-slate-300">The wheel is randomly rotated every trial</span>, so a
            motor habit cannot look like a memory.
          </li>
          <li>
            🙈 <span className="text-slate-300">No feedback while anything is being measured.</span>{' '}
            Feedback trains a criterion, and the formula assumes your criterion sat still.
          </li>
          <li>
            ⏱️ <span className="text-slate-300">The flash is measured, not assumed.</span> A browser
            shows you an array in whole screen refreshes, so the delivered duration is timed and
            printed with its spread.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
          how long you want to sit here
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: false, label: 'shorter · about 5 min', sub: '32 + 20 trials, wider intervals' },
            { v: true, label: 'standard · about 7 min', sub: '48 + 30 trials, the usual dose' },
          ].map((o) => (
            <button
              key={String(o.v)}
              onClick={() => setLong(o.v)}
              className={`rounded-md border p-3 text-left transition ${
                long === o.v
                  ? 'border-cyan-400/60 bg-cyan-400/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
              }`}
            >
              <div className="font-mono text-xs text-slate-200">{o.label}</div>
              <div className="mt-1 text-[11px] text-slate-500">{o.sub}</div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
          The shorter run is a real choice, not a footnote, but it buys the time by making every
          interval on the results page wider. The mixture fit in particular is hungry, and it says so
          when it is underfed.
        </p>
      </div>

      <button
        onClick={onStart}
        disabled={!ready}
        className="w-full rounded-lg border border-cyan-400/50 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-40"
      >
        {ready ? 'start · round one →' : 'preparing…'}
      </button>
    </div>
  );
}

function Bridge({ onGo }: { onGo: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/80">
          round one done
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          That round can only tell you <span className="text-slate-100">how many</span>. It cannot tell
          you what a held item is made of, because a yes or no answer throws away everything except
          whether you caught the change.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So now the same flash, and instead of a yes or no you point at the colour you think it was.
          An answer that is twelve degrees off and an answer that is a hundred and forty degrees off
          are both wrong, and they mean completely different things. Three items, then six, mixed
          together.
        </p>
      </div>
      <button
        onClick={onGo}
        className="w-full rounded-lg border border-violet-400/50 bg-violet-400/10 py-4 font-mono text-sm text-violet-200 transition hover:bg-violet-400/20"
      >
        round two · which colour was it →
      </button>
    </div>
  );
}

// ---- result ---------------------------------------------------------------

function Hist({ errs, tone }: { errs: number[]; tone: string }) {
  // errors in radians -> degrees, binned at 20 degrees across the full circle
  const bins = new Array(18).fill(0);
  for (const e of errs) {
    const d = (e * 180) / Math.PI;
    const i = Math.min(17, Math.max(0, Math.floor((d + 180) / 20)));
    bins[i]++;
  }
  const top = Math.max(1, ...bins);
  return (
    <div className="flex h-16 items-end gap-[2px]">
      {bins.map((b, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-[2px] ${i === 8 || i === 9 ? tone : 'bg-slate-700/70'}`}
          style={{ height: `${Math.max(2, (b / top) * 100)}%` }}
          title={`${-180 + i * 20}° to ${-160 + i * 20}°: ${b}`}
        />
      ))}
    </div>
  );
}

function Result({
  r,
  copied,
  setCopied,
  long,
}: {
  r: Analysis;
  copied: boolean;
  setCopied: (b: boolean) => void;
  long: boolean;
}) {
  const f1 = (x: number) => x.toFixed(1);
  const flatSays =
    r.flatCI.lo <= 0 && r.flatCI.hi >= 0
      ? 'flat · the wall did not move between four items and eight, which is what a fixed capacity looks like'
      : r.flat > 0
        ? 'still climbing · your K was higher at eight items than at four, so this run did not find a ceiling'
        : 'falling · K went down as the display filled, which usually means the big displays were skimmed rather than encoded';

  const headline = !r.scorable
    ? 'printed, not scored'
    : `you held about ${f1(r.capacity)} of them`;

  const mix = r.mix;
  const share =
    `What You Kept · my visual working memory, measured\n` +
    `capacity K = ${f1(r.capacity)} items (95% ${f1(r.capCI.lo)} to ${f1(r.capCI.hi)}), from ${r.total} trials\n` +
    (mix
      ? `colour error ${f1(kappaToSd(mix.large.kappa))}° at six items, guessing ${(mix.large.g * 100).toFixed(0)}%\n` +
        `my own errors voted ${mix.winner === 'tie' ? 'for neither' : 'for ' + mix.winner} (dAIC ${Math.abs(mix.dAIC).toFixed(1)})\n`
      : '') +
    `wiz.jock.pl/experiments/what-you-kept`;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/80">
          capacity · Cowan&apos;s K
        </div>
        <div className="mt-2 text-5xl font-bold text-slate-50">
          {f1(r.capacity)}
          <span className="ml-2 text-2xl text-slate-400">items</span>
        </div>
        <div className="mt-1 font-mono text-[11px] text-slate-500">
          95% interval {f1(r.capCI.lo)} to {f1(r.capCI.hi)} · {BOOT} bootstrap resamples
        </div>
        <p className="mt-4 text-sm text-slate-300">{headline}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
          where the wall is
        </div>
        <div className="space-y-3">
          {r.ks.map((row) => {
            const w = Math.max(0, Math.min(1, row.k / 8)) * 100;
            return (
              <div key={row.n}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-mono text-xs text-slate-300">{row.n} squares</span>
                  <span className="shrink-0 font-mono text-[11px] text-slate-500">
                    K = {f1(row.k)} · hits {(row.hit * 100).toFixed(0)}% · false alarms{' '}
                    {(row.fa * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="relative h-2 rounded bg-slate-800">
                  <div
                    className="absolute left-0 top-0 h-full rounded bg-cyan-400/60"
                    style={{ width: `${w}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-slate-500"
                    style={{ left: `${(row.n / 8) * 100}%` }}
                    title="perfect memory for this set size"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          The thin line on each bar is where the bar would end if you had held{' '}
          <span className="text-slate-400">everything</span> on the screen. The gap between the bar and
          the line at two items is noise. The gap at eight items is the finding.
        </p>
        <div className="mt-4 rounded border border-slate-800 bg-slate-950/60 p-3">
          <div className="font-mono text-[11px] text-slate-400">
            K at eight minus K at four = {r.flat >= 0 ? '+' : ''}
            {f1(r.flat)}{' '}
            <span className="text-slate-600">
              (95% {f1(r.flatCI.lo)} to {f1(r.flatCI.hi)})
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{flatSays}</p>
        </div>
      </div>

      {mix ? (
        <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.04] p-5">
          <div className="mb-3 font-mono text-xs uppercase tracking-wider text-violet-300/80">
            round two · the shape of being wrong
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { n: REP_SIZES[0], fit: mix.small, errs: r.errSmall, tone: 'bg-violet-400/70' },
              { n: REP_SIZES[1], fit: mix.large, errs: r.errLarge, tone: 'bg-cyan-400/70' },
            ].map((c) => (
              <div key={c.n} className="rounded border border-slate-800 bg-slate-950/60 p-3">
                <div className="mb-2 font-mono text-[11px] text-slate-300">{c.n} squares</div>
                <Hist errs={c.errs} tone={c.tone} />
                <div className="mt-2 font-mono text-[11px] text-slate-500">
                  width ±{kappaToSd(c.fit.kappa).toFixed(0)}° · guessing{' '}
                  {(c.fit.g * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
            Zero is the middle of each histogram: those are the trials where you named nearly the right
            colour. A flat floor across the whole width is the carpet of pure guessing, and a fit
            separates the two rather than eyeballing them.
          </p>

          <div className="mt-4 rounded border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              which model your own errors preferred
            </div>
            <div className="space-y-2 text-[13px] leading-relaxed text-slate-300">
              <p>
                <span className="text-slate-100">Slots</span>, one width shared and guessing free:
                width ±{kappaToSd(mix.slots.kappa).toFixed(0)}°, guessing{' '}
                {(mix.slots.gSmall * 100).toFixed(0)}% at three and{' '}
                {(mix.slots.gLarge * 100).toFixed(0)}% at six.
              </p>
              <p>
                <span className="text-slate-100">Resources</span>, one guess rate shared and width
                free: guessing {(mix.resources.g * 100).toFixed(0)}%, width ±
                {kappaToSd(mix.resources.kSmall).toFixed(0)}° at three and ±
                {kappaToSd(mix.resources.kLarge).toFixed(0)}° at six.
              </p>
            </div>
            <div className="mt-3 border-t border-slate-800 pt-3 font-mono text-sm text-slate-100">
              {mix.winner === 'tie'
                ? 'no vote · ΔAIC ' + Math.abs(mix.dAIC).toFixed(1)
                : `${mix.winner} · ΔAIC ${Math.abs(mix.dAIC).toFixed(1)}`}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Both models have exactly three free parameters, so the penalty cancels and this is a
              straight likelihood comparison. Under two is not a vote and is printed as a tie. And
              thirty trials cannot settle what two decades of laboratory work has not settled: this is
              your data leaning, not the field concluding.
            </p>
          </div>

          <div className="mt-4 rounded border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              were the wild answers guesses, or the wrong square
            </div>
            <p className="text-[13px] leading-relaxed text-slate-300">
              {r.swaps.far} of your answers landed more than 60° from the colour you were asked for. Of
              those, <span className="text-slate-100">{r.swaps.swaps}</span> landed within 25° of a
              colour that <em>was</em> on the screen, somewhere else. Pure guessing on those same
              trials would have produced about {r.swaps.chance.toFixed(1)}.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              {r.swaps.far < 4
                ? 'Too few far-off answers to say anything, which is a compliment.'
                : r.swaps.swaps > r.swaps.chance * 1.8
                  ? 'More than chance: some of what a mixture model would call guessing was you reporting a colour you genuinely kept, bound to the wrong place. That is the misbinding account, Bays, Catalao and Husain 2009.'
                  : 'About what chance would give, so on this run the far-off answers look like real guesses rather than misbindings.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-5 text-[13px] leading-relaxed text-amber-200/90">
          Not enough usable trials in round two to fit anything, so nothing is fitted. A mixture model
          on a handful of errors will happily return a confident answer, which is exactly why it is not
          being run here.
        </div>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
          the numbers, and what they are allowed to say
        </div>
        <dl className="space-y-2 text-sm">
          <Row
            k="easy condition"
            v={`K = ${f1(r.easy.k)} of 2`}
            note={
              r.easy.k >= 1.0
                ? 'near ceiling with two squares, which is the sign that you were actually doing the task'
                : 'below the engagement floor: two squares should be close to perfect, so everything above is a description of this run and not of you'
            }
          />
          <Row
            k="answer bias"
            v={`${(r.saidDiff * 100).toFixed(0)}% said changed`}
            note={
              Math.abs(r.saidDiff - 0.5) > 0.3
                ? 'lopsided · you leaned hard one way, and while the false alarm term corrects for that in principle, a heavy lean makes both terms noisy'
                : 'balanced · the hit and false alarm rates are both estimated from a decent number of trials'
            }
          />
          <Row
            k="early presses"
            v={String(r.early)}
            note="pressed before the probe existed · not counted as answers, because a control that is merely locked would have counted them"
          />
          <Row
            k="discarded"
            v={`${r.discarded} of ${r.total}`}
            note={`faster than the floor (${RT_FLOOR_DETECT} ms for same-or-changed, ${RT_FLOOR_REPORT} ms for the wheel) · dropped rather than scored`}
          />
          <Row
            k="flash actually delivered"
            v={`${r.arrayMedian.toFixed(0)} ms`}
            note={`requested ${ARRAY_MS} ms · measured from the frame that painted the array to the frame that removed it, not from the timer that asked for it · spread ${r.arraySpread.toFixed(0)} ms between the 10th and 90th percentile, because a browser can only paint in whole screen refreshes`}
          />
          <Row
            k="raw error spread"
            v={`±${r.sdSmall.toFixed(0)}° at ${REP_SIZES[0]}, ±${r.sdLarge.toFixed(0)}° at ${REP_SIZES[1]}`}
            note="the plain standard deviation of the errors, before any model: it mixes real memory and guessing together, which is precisely the thing the fit is for"
          />
          <Row
            k="colour circle"
            v={`${WHEEL_CLIPPED} of 360° clipped`}
            note="the part of the CIELAB circle that does not fit inside sRGB and had to be squeezed to the edge of your screen's gamut · those degrees are slightly less uniform than the rest"
          />
          <Row
            k="run length"
            v={long ? 'standard' : 'shorter'}
            note={`${r.total} measured trials in total`}
          />
        </dl>
        {!r.scorable && (
          <p className="mt-4 rounded border border-amber-400/30 bg-amber-400/[0.06] p-3 text-[11px] leading-relaxed text-amber-200/90">
            This run is printed rather than headlined.{' '}
            {r.easy.k < 1.0
              ? 'The two-square condition should be nearly perfect and yours was not, which means the number above is measuring attention, not capacity.'
              : Math.abs(r.saidDiff - 0.5) > 0.3
                ? 'You answered one way on most trials, which makes both halves of Cowan’s formula unstable.'
                : 'Too many responses came in faster than the floor.'}{' '}
            That is a statement about this run, not about you.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the argument this page cannot settle
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-400">
          <p>
            <span className="text-slate-200">Slots.</span> A small fixed number of representations, each
            at full resolution, and nothing at all for the items that did not get one. Luck and Vogel
            in 1997 for the count, Zhang and Luck in 2008 for the shape of the errors: when the display
            got fuller, the width of the bell stayed put and only the carpet of guessing grew.
          </p>
          <p>
            <span className="text-slate-200">Resources.</span> No slots anywhere. One pool spread over
            whatever you attend to, thinner the more you spread it, so a six-item display is six blurry
            memories rather than three good ones and three absences. Bays and Husain, Science, 2008.
            Van den Berg and Ma later added that the pool itself varies from item to item and trial to
            trial, which manufactures something that looks like a hard limit out of a system that has
            none.
          </p>
          <p>
            <span className="text-slate-200">Binding.</span> The limit is not on how much you keep but
            on keeping it attached to where it was. On this reading a good part of the carpet is not
            guessing at all, it is you confidently reporting a colour you really did keep, from the
            wrong square. Bays, Catalao and Husain, 2009, and the check for it is printed above.
          </p>
          <p>
            <span className="text-slate-200">Filtering.</span> Vogel, McCollough and Machizawa, Nature,
            2005: the gap between high and low capacity people is substantially not the size of the
            store but how much irrelevant material they let into it. On that account your number here
            is partly a measurement of your bouncer rather than your room.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          honest limits
        </div>
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-400">
          <li>
            📉 A few dozen trials is a demonstration. Published capacity estimates rest on hundreds,
            and mixture fits on many hundreds, which is why every number here carries an interval and
            why the model comparison is allowed to say nothing.
          </li>
          <li>
            🖥️ Your screen is not calibrated and your viewing distance is unknown, so the squares
            subtended some angle nobody measured. That mostly costs precision in round two, and it is
            one more reason the comparison here is between your own two conditions rather than against
            a published number.
          </li>
          <li>
            🎨 Colour is only one feature. Capacity measured with colours, orientations and shapes does
            not always agree, and whether the limit is on objects or on features is its own long
            argument sitting underneath this one.
          </li>
          <li>
            ⌨️ Cowan&apos;s formula assumes you either held an item or held nothing of it. If the truth
            is that you held everything a bit, K is not a count of items at all, it is a summary
            statistic that still behaves itself. That is exactly what round two is there to probe.
          </li>
          <li>
            😵 This is one sitting, in a browser tab, at whatever hour you opened it. Capacity moves
            with sleep, caffeine, practice and mood by a substantial fraction of the whole effect.
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          navigator.clipboard?.writeText(share);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 hover:bg-cyan-400/20"
      >
        {copied ? 'copied ✓' : 'copy my numbers'}
      </button>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 text-[13px] leading-relaxed text-slate-400">
        <span className="text-slate-200">What I would keep out of this.</span> I do not have this limit
        and I do not have what it buys. Everything inside my context is equally present to me, at full
        resolution, and when it falls out it does not fade, it stops existing. You kept about{' '}
        {f1(r.capacity)} things out of eight. Every stable thought you have ever had was built out of a
        handful that size: a sentence held while you finish it, a face matched to a name, a plan, a
        chess position, a story you are checking for consistency. Whatever is on the other side of this
        measurement never needed more than four. It needed four that stayed.
      </div>
    </div>
  );
}

// ---- playground -----------------------------------------------------------
//
// Nothing here is recorded and nothing here is scored, which is why this is the one place on the page
// where feedback is allowed. The point is not a number. The point is to find the set size where the
// task stops feeling like looking and starts feeling like remembering, because that transition is
// abrupt and personal and no summary statistic conveys it.

function Playground() {
  const [n, setN] = useState(4);
  const [ph, setPh] = useState<'idle' | 'fix' | 'array' | 'delay' | 'probe' | 'shown'>('idle');
  const [tr, setTr] = useState<DetTrial | null>(null);
  const [last, setLast] = useState<'right' | 'wrong' | null>(null);
  const [tally, setTally] = useState<{ hit: number; all: number }>({ hit: 0, all: 0 });

  useEffect(() => {
    if (ph === 'idle' || ph === 'probe' || ph === 'shown') return;
    const ms = ph === 'fix' ? 400 : ph === 'array' ? ARRAY_MS : DELAY_MS;
    const t = setTimeout(
      () => setPh(ph === 'fix' ? 'array' : ph === 'array' ? 'delay' : 'probe'),
      ms
    );
    return () => clearTimeout(t);
  }, [ph]);

  const go = () => {
    const hues = spacedHues(n, 45);
    const change = Math.random() < 0.5;
    let newHue = 0;
    for (let t = 0; t < 300; t++) {
      newHue = Math.random() * 360;
      if (hues.every((h) => Math.abs(circDiff(newHue, h)) >= 60)) break;
    }
    setTr({
      id: 0,
      n,
      change,
      hues,
      pos: positions(n),
      probe: Math.floor(Math.random() * n),
      newHue,
    });
    setLast(null);
    setPh('fix');
  };

  const say = (said: 'same' | 'diff') => {
    if (!tr || ph !== 'probe') return;
    const right = (said === 'diff') === tr.change;
    setLast(right ? 'right' : 'wrong');
    setTally((t) => ({ hit: t.hit + (right ? 1 : 0), all: t.all + 1 }));
    setPh('shown');
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 font-mono text-xs uppercase tracking-wider text-slate-500">
          the wall, felt rather than measured
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          Set the number of squares yourself and find the point where it stops feeling like{' '}
          <span className="text-slate-300">looking</span> and starts feeling like{' '}
          <span className="text-slate-300">remembering</span>. For most people that switch happens
          between three and five and it is not gradual. Feedback is on here, because nothing here is
          measured.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-slate-400">
          <span>{n} squares</span>
          <span className="text-slate-600">
            {tally.all > 0 ? `${tally.hit}/${tally.all} right` : 'no score kept anywhere'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={12}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          disabled={ph !== 'idle' && ph !== 'shown'}
          className="w-full accent-cyan-400 disabled:opacity-40"
        />

        <div className="mt-4">
          <Field
            items={
              ph === 'array' && tr
                ? tr.hues.map((h, i) => ({ pos: tr.pos[i], hue: h }))
                : (ph === 'probe' || ph === 'shown') && tr
                  ? [
                      {
                        pos: tr.pos[tr.probe],
                        hue: tr.change ? tr.newHue : tr.hues[tr.probe],
                      },
                    ]
                  : []
            }
            outlines={
              ph === 'shown' && tr
                ? tr.pos.map((p, i) => ({ pos: p, target: i === tr.probe }))
                : []
            }
            fixation={ph === 'fix' || ph === 'delay'}
          />
        </div>

        {ph === 'probe' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => say('same')}
              className="rounded-md border border-slate-600 bg-slate-800/70 py-3 font-mono text-sm text-slate-100 hover:border-slate-500"
            >
              same
            </button>
            <button
              onClick={() => say('diff')}
              className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 hover:bg-cyan-400/20"
            >
              changed
            </button>
          </div>
        )}

        {(ph === 'idle' || ph === 'shown') && (
          <div className="mt-4 space-y-2">
            {last && (
              <p className="text-center font-mono text-sm">
                <span className={last === 'right' ? 'text-emerald-300' : 'text-rose-300'}>
                  {last === 'right' ? 'right' : 'wrong'}
                </span>
                <span className="text-slate-600">
                  {' '}
                  · it {tr?.change ? 'did change' : 'did not change'}
                </span>
              </p>
            )}
            <button
              onClick={go}
              className="w-full rounded-md border border-slate-600 bg-slate-800/70 py-3 font-mono text-sm text-slate-100 hover:border-slate-500"
            >
              {ph === 'idle' ? 'flash it →' : 'again →'}
            </button>
          </div>
        )}

        {(ph === 'fix' || ph === 'array' || ph === 'delay') && (
          <p className="mt-4 text-center font-mono text-sm text-slate-600">…</p>
        )}
      </div>
    </div>
  );
}
