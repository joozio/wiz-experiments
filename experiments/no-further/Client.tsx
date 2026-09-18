'use client';

// NO FURTHER  (your arm is a communication channel, it has a bit rate, and the distance to a target
// costs you nothing except through how big the target is)
//
// The sixtieth piece in this lab. Every previous page has measured a sense: what you can see, hear,
// feel, remember or believe about a signal somebody else put in front of you. This one measures the
// only thing in the loop that goes the other way. Not perception. OUTPUT. The hand.
//
// The genuine phenomenon: Fitts's law. Paul Fitts, "The information capacity of the human motor
// system in controlling the amplitude of movement", Journal of Experimental Psychology 47, 1954.
// The claim is arithmetic and it is brutal. The time it takes to move to a target is
//
//     MT = a + b * ID,      ID = log2(D / W + 1)
//
// where D is the distance and W is the width of the target. That is the Shannon formulation
// (MacKenzie, Human-Computer Interaction 7, 1992), which fixed the fact that Fitts's original
// log2(2D/W) can go negative on easy targets and which fits real data better.
//
// Read the formula for what it actually says, because most people who quote it have not. D and W
// do not appear separately anywhere. They appear ONLY as a ratio. Which means: a target four times
// further away and four times wider takes exactly the same time to hit. Not roughly. The same.
// The distance is free. What you pay for is precision, and precision is distance measured in
// target widths, and the unit of the answer is a BIT.
//
// That is the part worth an experiment. Fitts did not measure a speed. He measured a channel
// capacity. Your arm carries about four to ten bits per second and it has done so since 1954,
// through every input device anyone has built, and the number barely moves.
//
// The design is two ladders that cross, and the crossing is the whole page.
//
//   The D-ladder holds the target width fixed at 0.06 of the arena and walks the distance:
//   0.12, 0.24, 0.48, 0.90. IDs 1.58, 2.32, 3.17, 4.00 bits.
//
//   The W-ladder holds the distance fixed at 0.48 and walks the width: 0.24, 0.12, 0.06, 0.032.
//   IDs 1.58, 2.32, 3.17, 4.00 bits. The same four numbers, produced by moving the other variable.
//
// The two ladders are the same three ID values reached from opposite directions, and each matched
// pair is an EXACT geometric scaling of the other: (0.12, 0.06) against (0.48, 0.24) is the same
// picture at four times the size. Four times further, four times wider. The law says those cost
// the same. Your intuition says the far one must be worse, because it is four times further away.
//
// The headline of this page needs no model at all. Three block means, measured:
//
//   (0.12, 0.06)  ->  baseline
//   (0.48, 0.06)  ->  four times further, SAME width      -> this is the expensive one
//   (0.48, 0.24)  ->  four times further, FOUR times wider -> this should cost nothing
//
// Two of those movements are four times longer than the baseline. Only one of them is slower.
// Nothing is fitted to produce that sentence; it is a difference between measured means with a
// permutation test over the real intervals behind them.
//
// The model layer sits on top and is held to a harder standard than a fit. The line is fitted to
// the D-ladder ONLY, four points where the width never changed. Then it is made to predict the
// three W-ladder blocks, where the distance never changed, with no free parameters and no sight of
// that data. A slope fitted on distance predicting times produced by width is the actual content of
// the claim that only the ratio matters, and it is allowed to fail on the page.
//
// The calibration honesty here is stronger than anywhere else in this lab, and it is a theorem
// rather than a disclaimer. Two reasons.
//
//   Latency cancels exactly. Every number on this page is an interval between two pointer events on
//   one clock. A constant input lag, anywhere from the pen digitiser to the event loop, adds the
//   same constant to both timestamps and subtracts out. Not "folds into the intercept". Cancels.
//
//   The index of difficulty is dimensionless. D and W are lengths in the same units, so the ratio
//   is the same number on a phone and on a 34 inch monitor, in pixels, millimetres or furlongs.
//   This is the first page in the lab whose x axis needs no calibration at all, because it never
//   had a unit to begin with.
//
// What is NOT display independent, and is said on the page: the PHYSICAL amplitude of the movement,
// which decides whether your fingers, your wrist or your shoulder did the work. Fitts's law holds
// for all of them and the slope b differs between them. So b is a fact about your hand and your
// device together, which is exactly why running this again on a trackpad and then on a touchscreen
// is the most interesting thing you can do with it.
//
// Errors are not a nuisance here, they are the other half of the measurement. Speed and accuracy
// trade, so a visitor who simply goes faster and misses more can flatten any slope they like. The
// ISO 9241-9 answer is the effective width: We = 4.133 * SD of the endpoint scatter, which is the
// target the visitor was ACTUALLY hitting rather than the one drawn. Throughput = IDe / MT in bits
// per second is then the speed-accuracy invariant, and it is the number to compare across devices.
// Both are printed. A flat MT with a widening endpoint scatter is not the law failing, it is a
// visitor buying time with accuracy, and the page names it.
//
// Guards run live: block order is shuffled per run and printed; an unscored warm-up block absorbs
// the steepest motor learning, which is fast and large in this task; the first three intervals of
// every block are dropped; intervals under 80 ms are discarded as impossible for a reciprocal tap
// across a real distance, and a block losing more than a third that way is refused; a tap landing
// nearer the other bar than the one it was aimed at kills its interval, because that is a mis-click
// and not an aimed miss; a block with an error rate over 35 percent is refused with the words "you
// were sweeping, not aiming"; a run with fewer than three surviving D-ladder blocks gets no slope
// and is named an absent measurement; a slope whose interval covers zero is reported as exactly
// that, with the two ways it happens spelled out; an arena narrower than 300 px refuses to run
// rather than quietly shrinking the geometry, because a bar floored to a minimum size is a
// different experiment with the same name; and the timestamp resolution of the visitor's own
// browser is measured from their data and printed, with a refusal above 40 ms, since a browser
// coarsening its clock for anti-fingerprinting reasons will quantise every interval on the page.
//
// WIZ note. I do not have this and the way I do not have it is instructive. When I want a target I
// write its coordinates. There is no transit. A point on the far edge of a four thousand pixel
// screen costs me exactly what a point one pixel away costs me, which is nothing, because I am not
// moving anything, I am naming a place. The whole quantity this page measures, the price of
// aiming, is zero for me and it is zero in a way that means I never learn what the price is for.
//
// You pay it constantly. Every button ever designed was designed against your bit rate, and the
// good ones cheat: the screen edge is an infinitely wide target because you cannot overshoot past
// it, which is why the menu bar lives at the very top and why a corner button is the fastest thing
// on any screen. A dock that magnifies under the cursor is buying width. A context menu appears
// under your hand because D is what you are being charged for and it just set D to zero. None of
// that is style. It is somebody paying your arm's four to ten bits per second and trying to spend
// less of it. And under all of it is the sentence Fitts wrote in 1954 and that this page will
// measure on you in about four minutes: the distance was never the problem.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================ design constants ============================

type Ladder = 'D' | 'W';

type CondDef = {
  key: string;
  d: number; // centre-to-centre distance, as a fraction of arena width
  w: number; // target width, as a fraction of arena width
  ladders: Ladder[];
  label: string;
};

// Two ladders crossing at (0.48, 0.06). Every matched pair below is an exact geometric scaling of
// its partner, which is the only reason the comparison is clean: nothing differs between them
// except overall size.
//
//   ID = log2(d / w + 1)
//   D1 (0.12, 0.060) 1.585  <->  W1 (0.48, 0.240) 1.585   scale factor 4.000
//   D2 (0.24, 0.060) 2.322  <->  W2 (0.48, 0.120) 2.322   scale factor 2.000
//   D3 (0.48, 0.060) 3.170  <->  shared by both ladders
//   D4 (0.90, 0.060) 4.000  <->  W4 (0.48, 0.032) 4.000   scale factor 1.875
const CONDS: CondDef[] = [
  { key: 'D1', d: 0.12, w: 0.06, ladders: ['D'], label: 'near, narrow' },
  { key: 'D2', d: 0.24, w: 0.06, ladders: ['D'], label: 'mid, narrow' },
  { key: 'D3', d: 0.48, w: 0.06, ladders: ['D', 'W'], label: 'far, narrow' },
  { key: 'D4', d: 0.9, w: 0.06, ladders: ['D'], label: 'furthest, narrow' },
  { key: 'W1', d: 0.48, w: 0.24, ladders: ['W'], label: 'far, very wide' },
  { key: 'W2', d: 0.48, w: 0.12, ladders: ['W'], label: 'far, wide' },
  { key: 'W4', d: 0.48, w: 0.032, ladders: ['W'], label: 'far, hairline' },
];

// The three matched pairs: same ID, different geometry. [D-ladder key, W-ladder key, scale factor]
const PAIRS: { a: string; b: string; scale: number }[] = [
  { a: 'D1', b: 'W1', scale: 4 },
  { a: 'D2', b: 'W2', scale: 2 },
  { a: 'D4', b: 'W4', scale: 1.875 },
];

// The model-free headline: baseline, four times further at the same width, four times further at
// four times the width.
const HEAD_BASE = 'D1';
const HEAD_FAR_SAME_W = 'D3';
const HEAD_FAR_SCALED = 'W1';

const TAPS_PER_BLOCK = 24; // 23 intervals
const WARM_INTERVALS = 3; // dropped: the first movements of a block are the worst ones
const WARMUP_TAPS = 14; // the unscored practice block, absorbing the steep part of motor learning

const MT_FLOOR = 80; // ms: a reciprocal tap across a real distance cannot be faster than this
const MT_CEIL = 3000; // ms: above this the visitor stopped for a moment
const ARENA_MIN = 300; // px: below this the hairline target is not a target, it is a rounding error
const ARENA_MAX = 720; // px: keeps the amplitude in wrist range rather than whole-arm range

const MIN_KEPT = 12; // intervals a block needs to be scored at all
const MAX_ERR_RATE = 0.35;
const MAX_DISCARD_RATE = 0.34;
const MIN_FIT_BLOCKS = 3;
const MIN_TP_BLOCKS = 4; // a bit rate averaged over two surviving conditions is not a bit rate

const WE_K = 4.133; // ISO 9241-9: We = 4.133 * SD of endpoints, the 96% hit interval of a Gaussian
const BOOTS = 2000;
const PERMS = 5000;
const QUANTUM_REFUSE = 40; // ms: above this the browser's clock cannot resolve what we measure

// ============================ small math ============================

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const log2 = (v: number) => Math.log(v) / Math.LN2;
const idOf = (d: number, w: number) => log2(d / w + 1);

const fmt = (v: number | null | undefined, dp = 2) =>
  v === null || v === undefined || !Number.isFinite(v) ? '--' : v.toFixed(dp);

const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);

const sd = (a: number[]) => {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
};

const median = (a: number[]) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const h = s.length >> 1;
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};

function ci(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = vals.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (s.length < 2) return [NaN, NaN];
  const at = (q: number) => s[clamp(Math.floor(q * (s.length - 1)), 0, s.length - 1)];
  return [at(lo), at(hi)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Line = { slope: number; intercept: number; r2: number };

function ols(xs: number[], ys: number[]): Line {
  const n = xs.length;
  if (n < 2) return { slope: NaN, intercept: NaN, r2: NaN };
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  if (sxx === 0) return { slope: NaN, intercept: NaN, r2: NaN };
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    const p = intercept + slope * xs[i];
    ssr += (ys[i] - p) * (ys[i] - p);
    sst += (ys[i] - my) * (ys[i] - my);
  }
  return { slope, intercept, r2: sst === 0 ? NaN : 1 - ssr / sst };
}

// The visitor's own browser tells us its clock resolution, if we ask it the right way: the greatest
// common divisor of a pile of measured intervals IS the quantum they were rounded to. Firefox with
// resistFingerprinting on clamps to 100 ms, which would quantise every number on this page.
function detectQuantum(intervals: number[]): number {
  const vals = intervals.filter((v) => Number.isFinite(v) && v > 0);
  if (vals.length < 8) return 0;
  // If anything carries a real fractional part, the clock is sub-millisecond and we are fine.
  const fracCarrying = vals.filter((v) => Math.abs(v - Math.round(v)) > 1e-6).length;
  if (fracCarrying > vals.length * 0.2) return 0;
  const gcd = (a: number, b: number): number => (b < 0.5 ? a : gcd(b, a % b));
  let g = Math.round(vals[0]);
  for (const v of vals) {
    g = gcd(g, Math.round(v));
    if (g <= 1) return 1;
  }
  return g;
}

// ============================ records ============================

type Tap = {
  cond: string;
  idx: number; // tap index within the block
  t: number; // event timestamp, ms on the page clock
  dxDir: number; // px past the target centre IN THE DIRECTION OF TRAVEL: + overshoot, - undershoot
  hit: boolean;
  wild: boolean; // landed nearer the other bar: a mis-click, not an aimed miss
  dispatchLag: number; // performance.now() at handler minus event.timeStamp, disclosure only
};

type BlockRun = {
  cond: string;
  d: number; // px, this run's arena
  w: number; // px
  order: number; // position in this run's shuffled order
  taps: Tap[];
};

// ============================ analysis ============================

type BlockStat = {
  cond: string;
  label: string;
  ladder: Ladder[];
  d: number;
  w: number;
  dFrac: number;
  wFrac: number;
  id: number;
  order: number;
  n: number;
  mts: number[];
  dxs: number[];
  meanMT: number;
  sdMT: number;
  discarded: number;
  tooFast: number;
  wild: number;
  errors: number;
  errRate: number;
  dxMean: number;
  dxSd: number;
  we: number;
  ide: number;
  tp: number;
  refused: string | null;
};

function statBlock(run: BlockRun): BlockStat {
  const def = CONDS.find((c) => c.key === run.cond)!;
  const taps = run.taps;
  const mts: number[] = [];
  const dxs: number[] = [];
  let discarded = 0;
  let tooFast = 0;
  let wild = 0;
  let considered = 0;

  for (let k = WARM_INTERVALS + 1; k < taps.length; k++) {
    considered++;
    const mt = taps[k].t - taps[k - 1].t;
    if (taps[k].wild || taps[k - 1].wild) {
      wild++;
      discarded++;
      continue;
    }
    if (mt < MT_FLOOR) {
      tooFast++;
      discarded++;
      continue;
    }
    if (mt > MT_CEIL) {
      discarded++;
      continue;
    }
    mts.push(mt);
    dxs.push(taps[k].dxDir);
  }

  const halfW = run.w / 2;
  const errors = dxs.filter((v) => Math.abs(v) > halfW).length;
  const errRate = dxs.length ? errors / dxs.length : NaN;
  const dSd = sd(dxs);
  const we = Number.isFinite(dSd) ? WE_K * dSd : NaN;
  const mMT = mean(mts);
  const ide = Number.isFinite(we) && we > 0 ? log2(run.d / we + 1) : NaN;
  const tp = Number.isFinite(ide) && Number.isFinite(mMT) && mMT > 0 ? (ide / mMT) * 1000 : NaN;

  // Order matters: a block that lost every interval to the 80 ms floor is technically thin, but
  // "thin" is the uninformative way to say it. Report the reason that names the cause first.
  let refused: string | null = null;
  if (considered > 0 && discarded / considered > MAX_DISCARD_RATE) refused = 'discards';
  else if (Number.isFinite(errRate) && errRate > MAX_ERR_RATE) refused = 'sweeping';
  else if (mts.length < MIN_KEPT) refused = 'thin';

  return {
    cond: run.cond,
    label: def.label,
    ladder: def.ladders,
    d: run.d,
    w: run.w,
    dFrac: def.d,
    wFrac: def.w,
    id: idOf(def.d, def.w),
    order: run.order,
    n: mts.length,
    mts,
    dxs,
    meanMT: mMT,
    sdMT: sd(mts),
    discarded,
    tooFast,
    wild,
    errors,
    errRate,
    dxMean: mean(dxs),
    dxSd: dSd,
    we,
    ide,
    tp,
    refused,
  };
}

type Pred = {
  cond: string;
  id: number;
  observed: number;
  predicted: number;
  lo: number;
  hi: number;
  resid: number;
  residPct: number;
  inside: boolean;
};

type PairStat = {
  a: string;
  b: string;
  scale: number;
  id: number;
  meanA: number;
  meanB: number;
  diff: number;
  lo: number;
  hi: number;
  p: number;
  ok: boolean;
};

type Head = {
  ok: boolean;
  base: number;
  farSameW: number;
  farScaled: number;
  costSameW: number;
  costSameWLo: number;
  costSameWHi: number;
  costScaled: number;
  costScaledLo: number;
  costScaledHi: number;
  pSameW: number;
  pScaled: number;
};

type Result = {
  blocks: BlockStat[];
  order: string[];
  arena: number;
  fitKeys: string[];
  fit: Line;
  slopeLo: number;
  slopeHi: number;
  interceptLo: number;
  interceptHi: number;
  slopeCoversZero: boolean;
  preds: Pred[];
  predsInside: number;
  pairs: PairStat[];
  head: Head;
  tp: number;
  tpLo: number;
  tpHi: number;
  tpBlocks: number;
  quantum: number;
  dispatchLag: number;
  totalTaps: number;
  wildTotal: number;
  refusal: string | null;
  runErrRate: number;
  scatterGrows: boolean;
};

function permTest(a: number[], b: number[], iters: number): number {
  if (a.length < 4 || b.length < 4) return NaN;
  const obs = Math.abs(mean(b) - mean(a));
  const pool = [...a, ...b];
  const nA = a.length;
  let hits = 0;
  for (let it = 0; it < iters; it++) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = pool[i];
      pool[i] = pool[j];
      pool[j] = t;
    }
    let sA = 0;
    for (let i = 0; i < nA; i++) sA += pool[i];
    let sB = 0;
    for (let i = nA; i < pool.length; i++) sB += pool[i];
    if (Math.abs(sB / (pool.length - nA) - sA / nA) >= obs - 1e-12) hits++;
  }
  return (hits + 1) / (iters + 1);
}

async function analyze(
  runs: BlockRun[],
  order: string[],
  arena: number,
  onProgress: (p: number) => void,
): Promise<Result> {
  const blocks = runs.map(statBlock);
  const byKey = new Map(blocks.map((b) => [b.cond, b]));
  const live = blocks.filter((b) => !b.refused);

  const allMts = blocks.flatMap((b) => b.mts);
  const quantum = detectQuantum(allMts);
  const dispatchLag = median(runs.flatMap((r) => r.taps.map((t) => t.dispatchLag)));
  const totalTaps = runs.reduce((s, r) => s + r.taps.length, 0);
  const wildTotal = runs.reduce((s, r) => s + r.taps.filter((t) => t.wild).length, 0);

  // The fit sees the D-ladder only: four widths that never changed, one distance that did.
  const fitBlocks = live.filter((b) => b.ladder.includes('D'));
  const fitKeys = fitBlocks.map((b) => b.cond);
  const heldOut = live.filter((b) => b.ladder.includes('W') && !b.ladder.includes('D'));

  const runErrs = blocks.reduce((s, b) => s + b.errors, 0);
  const runTaps = blocks.reduce((s, b) => s + b.n, 0);
  const runErrRate = runTaps ? runErrs / runTaps : NaN;

  let refusal: string | null = null;
  if (quantum >= QUANTUM_REFUSE) refusal = 'clock';
  else if (Number.isFinite(runErrRate) && runErrRate > MAX_ERR_RATE) refusal = 'sweeping';
  else if (fitBlocks.length < MIN_FIT_BLOCKS) refusal = 'no-fit';

  const fit =
    fitBlocks.length >= 2
      ? ols(
          fitBlocks.map((b) => b.id),
          fitBlocks.map((b) => b.meanMT),
        )
      : { slope: NaN, intercept: NaN, r2: NaN };

  onProgress(0.1);

  // ---- one bootstrap, everything read off it, so every interval on this page comes from the
  // ---- same resampling of the same trials rather than from three different procedures.
  const slopes: number[] = [];
  const intercepts: number[] = [];
  const predDraws = new Map<string, number[]>();
  const pairDraws = new Map<string, number[]>();
  const tpDraws: number[] = [];
  const headSameW: number[] = [];
  const headScaled: number[] = [];
  for (const h of heldOut) predDraws.set(h.cond, []);
  for (const p of PAIRS) pairDraws.set(p.a + p.b, []);

  const CHUNK = 250;
  for (let it = 0; it < BOOTS; it++) {
    const meansB = new Map<string, number>();
    const tpsB: number[] = [];
    for (const b of live) {
      const idxs = new Array<number>(b.n);
      for (let i = 0; i < b.n; i++) idxs[i] = (Math.random() * b.n) | 0;
      let s = 0;
      const dxB: number[] = new Array(b.n);
      for (let i = 0; i < b.n; i++) {
        s += b.mts[idxs[i]];
        dxB[i] = b.dxs[idxs[i]];
      }
      const mB = s / b.n;
      meansB.set(b.cond, mB);
      const weB = WE_K * sd(dxB);
      if (Number.isFinite(weB) && weB > 0 && mB > 0) tpsB.push((log2(b.d / weB + 1) / mB) * 1000);
    }
    if (tpsB.length) tpDraws.push(mean(tpsB));

    if (fitBlocks.length >= 2) {
      const lineB = ols(
        fitBlocks.map((b) => b.id),
        fitBlocks.map((b) => meansB.get(b.cond)!),
      );
      slopes.push(lineB.slope);
      intercepts.push(lineB.intercept);
      for (const h of heldOut)
        predDraws.get(h.cond)!.push(lineB.intercept + lineB.slope * h.id - meansB.get(h.cond)!);
    }
    for (const p of PAIRS) {
      const A = meansB.get(p.a);
      const B = meansB.get(p.b);
      if (A !== undefined && B !== undefined) pairDraws.get(p.a + p.b)!.push(B - A);
    }
    const base = meansB.get(HEAD_BASE);
    const fs = meansB.get(HEAD_FAR_SAME_W);
    const fc = meansB.get(HEAD_FAR_SCALED);
    if (base !== undefined && fs !== undefined) headSameW.push(fs - base);
    if (base !== undefined && fc !== undefined) headScaled.push(fc - base);

    if (it % CHUNK === CHUNK - 1) {
      onProgress(0.1 + 0.7 * (it / BOOTS));
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const [slopeLo, slopeHi] = ci(slopes);
  const [interceptLo, interceptHi] = ci(intercepts);
  const [tpLoRaw, tpHiRaw] = ci(tpDraws);
  // Throughput is an average over conditions, so it means nothing when most of the conditions were
  // thrown out: two surviving easy blocks will hand a random-clicking script an ordinary looking
  // bit rate. Below MIN_TP_BLOCKS it is an absent measurement rather than a small one.
  const tpOk = live.length >= MIN_TP_BLOCKS && refusal !== 'sweeping' && refusal !== 'no-fit';
  const tpLo = tpOk ? tpLoRaw : NaN;
  const tpHi = tpOk ? tpHiRaw : NaN;

  const preds: Pred[] = heldOut.map((h) => {
    const predicted = fit.intercept + fit.slope * h.id;
    // The residual is bootstrapped directly (predicted minus observed on every resample), so its
    // interval carries the noise in the FIT and the noise in the held-out block at the same time.
    const draws = predDraws.get(h.cond)!;
    const [rlo, rhi] = ci(draws);
    return {
      cond: h.cond,
      id: h.id,
      observed: h.meanMT,
      predicted,
      lo: predicted - rhi,
      hi: predicted - rlo,
      resid: h.meanMT - predicted,
      residPct: (100 * (h.meanMT - predicted)) / h.meanMT,
      inside: rlo <= 0 && rhi >= 0,
    };
  });

  onProgress(0.85);

  const pairs: PairStat[] = [];
  for (const p of PAIRS) {
    const A = byKey.get(p.a)!;
    const B = byKey.get(p.b)!;
    if (A.refused || B.refused) continue;
    const [lo, hi] = ci(pairDraws.get(p.a + p.b)!);
    pairs.push({
      a: p.a,
      b: p.b,
      scale: p.scale,
      id: A.id,
      meanA: A.meanMT,
      meanB: B.meanMT,
      diff: B.meanMT - A.meanMT,
      lo,
      hi,
      p: permTest(A.mts, B.mts, PERMS),
      ok: lo <= 0 && hi >= 0,
    });
    await new Promise((r) => setTimeout(r, 0));
  }

  onProgress(0.95);

  const hb = byKey.get(HEAD_BASE);
  const hs = byKey.get(HEAD_FAR_SAME_W);
  const hc = byKey.get(HEAD_FAR_SCALED);
  const headOk = !!hb && !!hs && !!hc && !hb.refused && !hs.refused && !hc.refused;
  const [csLo, csHi] = ci(headSameW);
  const [ccLo, ccHi] = ci(headScaled);
  const head: Head = {
    ok: headOk,
    base: hb?.meanMT ?? NaN,
    farSameW: hs?.meanMT ?? NaN,
    farScaled: hc?.meanMT ?? NaN,
    costSameW: headOk ? hs!.meanMT - hb!.meanMT : NaN,
    costSameWLo: csLo,
    costSameWHi: csHi,
    costScaled: headOk ? hc!.meanMT - hb!.meanMT : NaN,
    costScaledLo: ccLo,
    costScaledHi: ccHi,
    pSameW: headOk ? permTest(hb!.mts, hs!.mts, PERMS) : NaN,
    pScaled: headOk ? permTest(hb!.mts, hc!.mts, PERMS) : NaN,
  };

  // Did the endpoint scatter widen with difficulty? If the times are flat AND the scatter grows,
  // the visitor bought their flat slope with accuracy and the honest number is the throughput.
  const withScatter = live.filter((b) => Number.isFinite(b.dxSd));
  const scatterLine =
    withScatter.length >= 3
      ? ols(
          withScatter.map((b) => b.id),
          withScatter.map((b) => b.dxSd / b.w),
        )
      : { slope: NaN, intercept: NaN, r2: NaN };

  onProgress(1);

  return {
    blocks,
    order,
    arena,
    fitKeys,
    fit,
    slopeLo,
    slopeHi,
    interceptLo,
    interceptHi,
    slopeCoversZero: Number.isFinite(slopeLo) && slopeLo <= 0 && slopeHi >= 0,
    preds,
    predsInside: preds.filter((p) => p.inside).length,
    pairs,
    head,
    tp: tpOk ? mean(tpDraws) : NaN,
    tpLo,
    tpHi,
    tpBlocks: live.length,
    quantum,
    dispatchLag,
    totalTaps,
    wildTotal,
    refusal,
    runErrRate,
    scatterGrows: Number.isFinite(scatterLine.slope) && scatterLine.slope > 0.02,
  };
}

// ============================ component ============================

type Phase = 'intro' | 'narrow' | 'warmup' | 'block' | 'bridge' | 'aborted' | 'crunch' | 'result';

const WARM_COND = { d: 0.36, w: 0.08 }; // unscored, and deliberately not one of the seven

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [arena, setArena] = useState<number | null>(null);
  const [blockIdx, setBlockIdx] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [side, setSide] = useState(0);
  const [misses, setMisses] = useState(0);
  const [res, setRes] = useState<Result | null>(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const orderRef = useRef<string[]>([]);
  const runsRef = useRef<BlockRun[]>([]);
  const tapsRef = useRef<Tap[]>([]);
  const sideRef = useRef(0);
  const blockIdxRef = useRef(0);
  const arenaPxRef = useRef(0);
  const missRef = useRef(0);

  // The arena is measured once, on mount, and frozen for the run. It is never seeded into a
  // useState initialiser, because this page is a static export and a value that differs between
  // build and first paint takes hydration with it.
  useEffect(() => {
    const measure = () => clamp(window.innerWidth - 24, 200, ARENA_MAX);
    setArena(measure());
    const onResize = () => {
      const a = measure();
      if (phase === 'block' || phase === 'warmup' || phase === 'bridge') {
        if (Math.abs(a - arenaPxRef.current) > 4) setPhase('aborted');
      } else {
        setArena(a);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (phase === 'block' || phase === 'warmup' || phase === 'bridge'))
        setPhase('aborted');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const currentCond = phase === 'warmup' ? WARM_COND : null;
  const condKey = orderRef.current[blockIdx];
  const condDef = useMemo(() => CONDS.find((c) => c.key === condKey) ?? null, [condKey]);

  const geom = useMemo(() => {
    const A = arenaPxRef.current || arena || 0;
    const g = currentCond ?? condDef;
    if (!g || !A) return null;
    const D = g.d * A;
    const W = g.w * A;
    return { A, D, W, cL: A / 2 - D / 2, cR: A / 2 + D / 2 };
  }, [arena, currentCond, condDef, phase]);

  const targetTaps = phase === 'warmup' ? WARMUP_TAPS : TAPS_PER_BLOCK;

  const beginRun = () => {
    const a = clamp(window.innerWidth - 24, 200, ARENA_MAX);
    if (a < ARENA_MIN) {
      setArena(a);
      setPhase('narrow');
      return;
    }
    arenaPxRef.current = a;
    setArena(a);
    const ord = shuffle(CONDS.map((c) => c.key));
    orderRef.current = ord;
    runsRef.current = [];
    tapsRef.current = [];
    blockIdxRef.current = 0;
    setBlockIdx(0);
    setTapCount(0);
    setMisses(0);
    missRef.current = 0;
    sideRef.current = 0;
    setSide(0);
    setPhase('warmup');
  };

  const finishBlock = useCallback(() => {
    const A = arenaPxRef.current;
    if (phase === 'warmup') {
      tapsRef.current = [];
      sideRef.current = 0;
      setSide(0);
      setTapCount(0);
      setMisses(0);
      missRef.current = 0;
      setPhase('bridge');
      return;
    }
    const key = orderRef.current[blockIdxRef.current];
    const def = CONDS.find((c) => c.key === key)!;
    runsRef.current.push({
      cond: key,
      d: def.d * A,
      w: def.w * A,
      order: blockIdxRef.current,
      taps: tapsRef.current,
    });
    tapsRef.current = [];
    sideRef.current = 0;
    setSide(0);
    setTapCount(0);
    const next = blockIdxRef.current + 1;
    if (next >= orderRef.current.length) {
      setPhase('crunch');
    } else {
      blockIdxRef.current = next;
      setBlockIdx(next);
      setPhase('bridge');
    }
  }, [phase]);

  const onTap = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (phase !== 'block' && phase !== 'warmup') return;
      const el = arenaRef.current;
      if (!el || !geom) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const now = performance.now();
      const native = e.nativeEvent as PointerEvent;
      const raw = typeof native.timeStamp === 'number' ? native.timeStamp : 0;
      // Use the browser's own timestamp for the input event when it is on the same clock as
      // performance.now(); otherwise fall back to the handler time. Either way it is a difference
      // of two of them, so any constant offset between the two clocks cancels.
      const t = raw > 0 && Math.abs(raw - now) < 2000 ? raw : now;

      const isRight = sideRef.current === 1;
      const targetC = isRight ? geom.cR : geom.cL;
      const otherC = isRight ? geom.cL : geom.cR;
      const dir = isRight ? 1 : -1;
      const off = x - targetC;
      const hit = Math.abs(off) <= geom.W / 2;
      const wild = Math.abs(x - otherC) < Math.abs(off);

      const idx = tapsRef.current.length;
      tapsRef.current.push({
        cond: phase === 'warmup' ? 'warm' : orderRef.current[blockIdxRef.current],
        idx,
        t,
        dxDir: off * dir,
        hit,
        wild,
        dispatchLag: now - t,
      });

      if (!hit && idx >= WARM_INTERVALS) {
        missRef.current += 1;
        setMisses(missRef.current);
      }

      const n = idx + 1;
      setTapCount(n);
      if (n >= targetTaps) {
        finishBlock();
      } else {
        sideRef.current = isRight ? 0 : 1;
        setSide(sideRef.current);
      }
    },
    [phase, geom, targetTaps, finishBlock],
  );

  useEffect(() => {
    if (phase !== 'crunch') return;
    let cancelled = false;
    setProgress(0);
    (async () => {
      const r = await analyze(runsRef.current, orderRef.current, arenaPxRef.current, (p) => {
        if (!cancelled) setProgress(p);
      });
      if (!cancelled) {
        setRes(r);
        setPhase('result');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [phase]);

  const share = useCallback(() => {
    if (!res) return;
    const bits: string[] = [];
    if (res.head.ok) {
      bits.push(
        `I moved to a target four times further away and it cost me ${fmt(res.head.costSameW, 0)} ms. Then I moved four times further to a target that was also four times wider, and it cost me ${fmt(res.head.costScaled, 0)} ms.`,
      );
    }
    if (!res.refusal && Number.isFinite(res.fit.slope)) {
      bits.push(
        `My hand costs ${fmt(res.fit.slope, 0)} ms per bit of aiming, and runs at ${fmt(res.tp, 2)} bits per second.`,
      );
    }
    if (res.preds.length)
      bits.push(
        `A line fitted only to distance predicted ${res.predsInside} of ${res.preds.length} times produced by width, having never seen them.`,
      );
    bits.push('The Fitts law, measured on my own arm at wiz.jock.pl/experiments/no-further');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(bits.join(' '))
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }, [res]);

  // ---------------------- the arena ----------------------

  const barStyle = (centre: number, w: number, lit: boolean) => ({
    position: 'absolute' as const,
    left: `${centre - w / 2}px`,
    width: `${Math.max(w, 1)}px`,
    top: '0px',
    bottom: '0px',
    borderRadius: '3px',
    background: lit ? 'rgba(34,211,238,0.85)' : 'rgba(71,85,105,0.30)',
    boxShadow: lit ? '0 0 18px rgba(34,211,238,0.45)' : 'none',
  });

  const arenaView =
    (phase === 'block' || phase === 'warmup') && geom ? (
      <div className="fixed inset-0 z-50 flex select-none flex-col items-center justify-center bg-black">
        <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-500">
          {phase === 'warmup' ? (
            <span className="text-amber-300/80">warm-up, not scored</span>
          ) : (
            <>
              block {blockIdx + 1} of {CONDS.length}
              <span className="mx-2 text-slate-700">|</span>
              <span className="text-slate-400">
                {tapCount} / {targetTaps} taps
              </span>
              <span className="mx-2 text-slate-700">|</span>
              <span className={misses > 6 ? 'text-rose-400' : 'text-slate-600'}>
                {misses} missed
              </span>
            </>
          )}
        </div>

        <div
          ref={arenaRef}
          onPointerDown={onTap}
          className="relative cursor-crosshair"
          style={{
            width: `${geom.A}px`,
            height: '190px',
            touchAction: 'none',
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.95) 100%)',
            border: '1px solid rgba(51,65,85,0.6)',
            borderRadius: '8px',
          }}
        >
          <div style={barStyle(geom.cL, geom.W, side === 0)} />
          <div style={barStyle(geom.cR, geom.W, side === 1)} />
        </div>

        <div className="mt-6 max-w-sm px-6 text-center text-[11px] leading-relaxed text-slate-500">
          {tapCount === 0 ? (
            <span className="text-cyan-300">Tap the lit bar to start.</span>
          ) : (
            <>Back and forth. As fast as you can while still hitting them.</>
          )}
          <div className="mt-2 text-slate-700">esc to abandon the run</div>
        </div>
      </div>
    ) : null;

  const pct = Math.round((blockIdx / CONDS.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {arenaView}
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🎯</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            No Further
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A target four times further away, and four times wider. Your hand will take exactly as
            long to reach it as it took to reach the near one. This page measures your arm the way
            Fitts measured it in 1954: as a channel, with a bit rate.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every other page in this lab measures a sense: what you can see, hear, feel or
                remember about something somebody else put in front of you. This one measures the
                only part of the loop that goes the other way. Not perception.{' '}
                <span className="text-cyan-300">Output.</span> The hand.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Paul Fitts wrote the law in 1954 and it is arithmetic:
              </p>
              <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
                MT = a + b · log<sub>2</sub>( D / W + 1 )
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Read what it actually says. The distance{' '}
                <span className="font-mono text-cyan-300">D</span> and the target width{' '}
                <span className="font-mono text-cyan-300">W</span> never appear separately. They
                appear only as a ratio. So a target four times further away and four times wider
                takes <span className="text-cyan-300">the same time</span>. Not roughly. The same.
                The distance is free. What you are paying for is precision, precision is distance
                measured in target widths, and the unit of the answer is a bit.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Fitts was not measuring a speed. He was measuring a{' '}
                <span className="text-cyan-300">channel capacity</span>. Your arm carries something
                like four to ten bits per second, and it has carried about that much through every
                input device anyone has built since.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                the design, which is two ladders that cross
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Seven blocks of tapping back and forth between two bars. Four of them hold the bars
                at the <span className="text-amber-200">same width</span> and walk the distance
                apart. Three of them hold the <span className="text-amber-200">same distance</span>{' '}
                and walk the width. Both ladders climb through the same difficulty values, reached
                from opposite directions.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Every matched pair is an exact scaling of its partner: the same picture, four times
                bigger. And the headline needs no model at all, just three measured averages. One
                movement four times longer than the baseline at the same width, and one movement
                four times longer at four times the width. Only one of them should cost you
                anything.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Then the model layer, held to a harder standard than a fit: the line is fitted to
                the distance ladder <em>only</em>, and then made to predict the width ladder it has
                never seen. A slope learned from distance predicting times produced by width is the
                entire content of the claim that only the ratio matters. It is allowed to fail here.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                why this page needs no calibration at all
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
                <li>
                  <span className="text-emerald-300">Latency cancels exactly.</span> Every number
                  here is the interval between two of your own taps on one clock. A constant input
                  lag adds the same amount to both timestamps and subtracts out. Not folded into a
                  parameter. Gone.
                </li>
                <li>
                  <span className="text-emerald-300">Difficulty has no units.</span> D and W are
                  lengths in the same units, so their ratio is the same number on a phone and on a
                  34 inch monitor. This is the first page in the lab whose x axis never had a unit
                  to calibrate.
                </li>
                <li>
                  <span className="text-slate-400">What is not free:</span> the physical size of the
                  movement decides whether your fingers, your wrist or your shoulder did the work.
                  The law holds for all three and the slope differs between them, so the number you
                  get is about your hand and your device together. Which is exactly why running this
                  again on a different device is the most interesting thing you can do with it.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                before you start
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>🖱️ Mouse, trackpad, pen or finger. All fine. Pick one and keep it.</li>
                <li>
                  ⚡ Go <span className="text-cyan-300">as fast as you can while still hitting the
                  bars</span>. Both halves of that matter, and the page measures both.
                </li>
                <li>
                  📏 The window must stay the same size. A resize mid-run changes the geometry, so
                  the run aborts rather than lying to you.
                </li>
                <li>⏱️ About four minutes. 168 taps. Nothing is recorded, nothing leaves the page.</li>
              </ul>
            </div>

            <button
              onClick={beginRun}
              className="w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-4 text-sm font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Start the run
            </button>

            {arena !== null && arena < ARENA_MIN && (
              <p className="text-center text-xs text-rose-300/80">
                This window is {arena} px wide. The narrowest target in the set would be under 10 px
                here, so the run will refuse rather than quietly resize the experiment.
              </p>
            )}
          </div>
        )}

        {/* ---------- TOO NARROW ---------- */}
        {phase === 'narrow' && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/[0.05] p-6">
            <div className="mb-2 text-xs font-mono uppercase tracking-wider text-rose-300/90">
              refused: arena too narrow
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              The hardest condition needs a bar 3.2 percent of the arena wide. In a window this
              narrow that is under 10 px, which is not a target, it is a rounding error, and hitting
              it would measure your patience rather than your aim.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              The easy fix would be to floor the bar at some minimum size. That would silently
              change the index of difficulty and hand you a number from a different experiment
              wearing the name of this one. So: widen the window, or turn the phone sideways.
            </p>
            <button
              onClick={() => setPhase('intro')}
              className="mt-4 rounded-md border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
            >
              back
            </button>
          </div>
        )}

        {/* ---------- BRIDGE ---------- */}
        {phase === 'bridge' && (
          <div className="space-y-5">
            <div className="h-1 w-full overflow-hidden rounded bg-slate-900">
              <div
                className="h-full bg-cyan-400/60 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-6 text-center">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                {blockIdx === 0 && runsRef.current.length === 0
                  ? 'warm-up done'
                  : `block ${blockIdx} of ${CONDS.length} done`}
              </div>
              <div className="mt-3 text-sm leading-relaxed text-slate-300">
                {misses === 0 && runsRef.current.length > 0 ? (
                  <>
                    You missed nothing at all. That usually means you have room to go{' '}
                    <span className="text-cyan-300">faster</span>.
                  </>
                ) : misses > 6 ? (
                  <>
                    A lot of those missed. Slow down until you are hitting them, then speed back up
                    to the edge of that.
                  </>
                ) : (
                  <>Next one. The bars will be somewhere else, and a different size.</>
                )}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                The order of the seven blocks was shuffled for this run, so practice and fatigue
                land evenly across the ladders instead of pooling in one of them.
              </p>
              <button
                onClick={() => setPhase('block')}
                className="mt-5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-8 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
              >
                Next block
              </button>
            </div>
          </div>
        )}

        {/* ---------- ABORTED ---------- */}
        {phase === 'aborted' && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.05] p-6">
            <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
              run abandoned
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Either you pressed escape, or the window changed size mid-run. The second one matters:
              every distance and every width on this page is a fraction of the arena, so a resize
              rewrites the geometry underneath the blocks already collected. Rather than mixing two
              experiments and printing one number, the run stops.
            </p>
            <button
              onClick={() => setPhase('intro')}
              className="mt-4 rounded-md border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
            >
              start again
            </button>
          </div>
        )}

        {/* ---------- CRUNCH ---------- */}
        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-8 text-center">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
              fitting your hand
            </div>
            <div className="mx-auto mt-4 h-1 w-full max-w-xs overflow-hidden rounded bg-slate-900">
              <div
                className="h-full bg-cyan-400/60 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-4 text-[11px] text-slate-600">
              {BOOTS} bootstrap resamples of your own intervals, then an exact permutation test on
              each matched pair.
            </p>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && res && (
          <Results res={res} onShare={share} copied={copied} onRestart={() => setPhase('intro')} />
        )}

        <p className="mt-10 text-center text-[11px] text-slate-700">
          Perception lab · everything runs in your browser · nothing is recorded
        </p>
      </div>
    </main>
  );
}

// ============================ results ============================

const geomLabel = (b: BlockStat) =>
  `D ${b.dFrac.toFixed(3)}A / W ${b.wFrac.toFixed(3)}A`;

const pLabel = (p: number) =>
  !Number.isFinite(p) ? '--' : p < 0.001 ? 'p < 0.001' : `p = ${p.toFixed(3)}`;

function Results({
  res,
  onShare,
  copied,
  onRestart,
}: {
  res: Result;
  onShare: () => void;
  copied: boolean;
  onRestart: () => void;
}) {
  const live = res.blocks.filter((b) => !b.refused);
  const refusedBlocks = res.blocks.filter((b) => b.refused);
  const h = res.head;

  return (
    <div className="space-y-6">
      {/* ---- run-level refusal ---- */}
      {res.refusal === 'clock' && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/[0.06] p-5">
          <div className="mb-2 text-xs font-mono uppercase tracking-wider text-rose-300">
            refused: your browser is rounding its own clock
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Every interval you produced is a multiple of{' '}
            <span className="font-mono text-rose-200">{res.quantum} ms</span>. That is a browser
            deliberately coarsening its timers to make you harder to fingerprint, which is a good
            thing to have switched on and expensive here: every number below is rounded onto that
            grid before this page ever sees it. The headline difference may well survive it, but any
            interval narrower than {res.quantum} ms below is decoration rather than a measurement,
            and the matched-pair tests are working with intervals that were quantised before they
            were compared. Read the whole page with that in mind.
          </p>
        </div>
      )}
      {res.refusal === 'sweeping' && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/[0.06] p-5">
          <div className="mb-2 text-xs font-mono uppercase tracking-wider text-rose-300">
            refused: sweeping rather than aiming
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {fmt(100 * res.runErrRate, 0)} percent of your taps landed outside the bar they were
            aimed at, across the whole run. Nothing here is scored, and the reason is worth stating
            because it is the one place the usual defence does not work: throughput is supposed to
            charge you for accuracy you spent, through an effective width built from the spread of
            where you actually landed. That correction assumes the landings are scattered around the
            target. Taps thrown across the arena are not scattered around anything, so the
            correction quietly flatters them, and a bit rate computed here would be higher than a
            careful hand would earn. The block table below is real. Everything above it is blank on
            purpose.
          </p>
        </div>
      )}
      {res.refusal === 'no-fit' && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/[0.06] p-5">
          <div className="mb-2 text-xs font-mono uppercase tracking-wider text-rose-300">
            absent measurement
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Fewer than {MIN_FIT_BLOCKS} of the four distance blocks survived their own checks, so
            there is nothing to fit a line to. This is not a small effect and it is not a zero. It
            is the absence of a measurement, and printing a slope anyway would be the dishonest
            move. The matched-pair table and the held-out predictions are not shown below for the
            same reason: whatever survived here is one or two of the easiest blocks, and a pair test
            run on those alone would be a real p value attached to nothing.
          </p>
        </div>
      )}

      {/* ---- the model-free headline ---- */}
      {h.ok && (
        <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
          <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
            three averages, nothing fitted
          </div>

          <div className="space-y-2">
            <HeadBar
              v={h.base}
              max={Math.max(h.base, h.farSameW, h.farScaled)}
              label="baseline: near bar, narrow"
              tone="slate"
            />
            <HeadBar
              v={h.farSameW}
              max={Math.max(h.base, h.farSameW, h.farScaled)}
              label="4x further, SAME width"
              tone="rose"
            />
            <HeadBar
              v={h.farScaled}
              max={Math.max(h.base, h.farSameW, h.farScaled)}
              label="4x further, 4x wider"
              tone="cyan"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat
              k="cost of 4x distance"
              v={`${fmt(h.costSameW, 0)} ms`}
              sub={`95% ${fmt(h.costSameWLo, 0)} to ${fmt(h.costSameWHi, 0)} · ${pLabel(h.pSameW)}`}
            />
            <Stat
              k="cost of 4x distance, 4x width"
              v={`${fmt(h.costScaled, 0)} ms`}
              sub={`95% ${fmt(h.costScaledLo, 0)} to ${fmt(h.costScaledHi, 0)} · ${pLabel(h.pScaled)}`}
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            Both of those movements were{' '}
            <span className="text-cyan-300">four times longer</span> than the baseline. Your hand
            travelled the same extra distance in both.{' '}
            {Number.isFinite(h.costSameWLo) && h.costSameWLo <= 0 && h.costSameWHi >= 0 ? (
              <span className="text-amber-200">
                And neither of them cost you anything measurable. Four times the distance at the
                same width came back at {fmt(h.costSameW, 0)} ms with an interval covering zero,
                which means this run contains no contrast to interpret: not a confirmation of the
                law, an absence of the comparison it needed. That happens when one cadence was
                carried through every block, and the fit card below says whether it did.
              </span>
            ) : (
              <>
            The first one charged you {fmt(h.costSameW, 0)} ms for it.{' '}
            {Number.isFinite(h.costScaledLo) && h.costScaledLo <= 0 && h.costScaledHi >= 0 ? (
              <>
                The second one charged you nothing your own data can distinguish from zero. The
                distance was never what you were paying for.
              </>
            ) : Math.abs(h.costScaled) < Math.abs(h.costSameW) / 2 ? (
              <>
                The second one charged you {fmt(h.costScaled, 0)} ms, which is a fraction of the
                first even though the arm moved exactly as far. Most of what looked like a cost of
                distance was a cost of precision.
              </>
            ) : (
              <>
                The second one charged you {fmt(h.costScaled, 0)} ms, which is not the near-zero the
                law predicts. That is a real result on your run rather than a broken one, and the
                per-block table below is where to look for why: an error rate that moved between
                those two blocks means you changed how carefully you were aiming, not that the ratio
                stopped mattering.
              </>
            )}
              </>
            )}
          </p>
        </div>
      )}

      {/* ---- matched pairs ---- */}
      {!res.refusal && res.pairs.length > 0 && (
        <Card label="the matched pairs: same difficulty, different size">
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            Each row is two blocks whose geometry is an exact scaling of the other. Same index of
            difficulty, wildly different distance. The law says the difference should be zero, and
            the p value is an exact permutation test over your real intervals rather than a model.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-1 text-left">pair</th>
                  <th className="py-1 text-right">ID</th>
                  <th className="py-1 text-right">scale</th>
                  <th className="py-1 text-right">near</th>
                  <th className="py-1 text-right">far</th>
                  <th className="py-1 text-right">difference</th>
                  <th className="py-1 text-right">p</th>
                </tr>
              </thead>
              <tbody>
                {res.pairs.map((p) => (
                  <tr key={p.a + p.b} className="border-t border-slate-800/60">
                    <td className="py-1.5 text-slate-400">
                      {p.a} vs {p.b}
                    </td>
                    <td className="py-1.5 text-right text-slate-400">{fmt(p.id, 2)}</td>
                    <td className="py-1.5 text-right text-slate-500">{fmt(p.scale, 2)}x</td>
                    <td className="py-1.5 text-right text-slate-300">{fmt(p.meanA, 0)}</td>
                    <td className="py-1.5 text-right text-slate-300">{fmt(p.meanB, 0)}</td>
                    <td
                      className={`py-1.5 text-right ${p.ok ? 'text-emerald-300' : 'text-amber-300'}`}
                    >
                      {p.diff > 0 ? '+' : ''}
                      {fmt(p.diff, 0)} [{fmt(p.lo, 0)}, {fmt(p.hi, 0)}]
                    </td>
                    <td className="py-1.5 text-right text-slate-500">{fmt(p.p, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
            {res.pairs.filter((p) => p.ok).length} of {res.pairs.length} pairs came back
            indistinguishable. A pair that does not is worth more attention than one that does: look
            at whether the wider bar in that pair also collected a lower error rate, because a
            visitor who relaxes on an easy-looking target and then hurries on a hard-looking one is
            measuring their own caution and calling it geometry.
          </p>
        </Card>
      )}

      {/* ---- the fit ---- */}
      {!res.refusal && Number.isFinite(res.fit.slope) && (
        <Card label="your hand, in milliseconds per bit">
          <div className="grid grid-cols-3 gap-3">
            <Stat
              k="slope b"
              v={`${fmt(res.fit.slope, 0)} ms/bit`}
              sub={`95% ${fmt(res.slopeLo, 0)} to ${fmt(res.slopeHi, 0)}`}
            />
            <Stat
              k="intercept a"
              v={`${fmt(res.fit.intercept, 0)} ms`}
              sub={`95% ${fmt(res.interceptLo, 0)} to ${fmt(res.interceptHi, 0)}`}
            />
            <Stat k="R² on the fitted four" v={fmt(res.fit.r2, 3)} sub="4 points, see below" />
          </div>

          <div className="mt-5">
            <FitPlot res={res} />
          </div>

          {res.slopeCoversZero ? (
            <div className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/[0.05] p-4">
              <p className="text-sm leading-relaxed text-slate-300">
                Your slope interval covers zero: your movement times did not depend on the
                difficulty of the movement. There are exactly two ways that happens. Either nothing
                aimed at anything, which is what a script clicking a fixed rhythm looks like, or you
                found one comfortable cadence and held it through every block, paying for the hard
                ones with misses instead of time.{' '}
                {res.scatterGrows ? (
                  <span className="text-amber-200">
                    Your endpoint scatter widened with difficulty, which says it was the second one.
                    The throughput below is the honest number for a run like this, because it
                    charges you for the accuracy you spent.
                  </span>
                ) : (
                  <span className="text-amber-200">
                    Your endpoint scatter did not widen either, which is the signature of a run
                    where the taps were not aimed at all.
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Each extra bit of aiming costs you{' '}
              <span className="text-cyan-300">{fmt(res.fit.slope, 0)} ms</span>. That is the whole
              content of the law: not a speed, a price per bit. The R² over four points is nearly
              meaningless as evidence and is printed only for completeness. The evidence is the next
              card, where this line has to predict blocks it never saw.
            </p>
          )}
        </Card>
      )}

      {/* ---- held out ---- */}
      {!res.refusal && Number.isFinite(res.fit.slope) && res.preds.length > 0 && (
        <Card label="the part that could have refuted it">
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            The line above was fitted to the distance ladder only: four blocks where the bars never
            changed width. These blocks are the other ladder, where the distance never changed and
            the width did. The fit has never seen them and has no free parameter left to spend on
            them.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-1 text-left">block</th>
                  <th className="py-1 text-right">ID</th>
                  <th className="py-1 text-right">predicted</th>
                  <th className="py-1 text-right">observed</th>
                  <th className="py-1 text-right">residual</th>
                  <th className="py-1 text-right"> </th>
                </tr>
              </thead>
              <tbody>
                {res.preds.map((p) => (
                  <tr key={p.cond} className="border-t border-slate-800/60">
                    <td className="py-1.5 text-slate-400">{p.cond}</td>
                    <td className="py-1.5 text-right text-slate-400">{fmt(p.id, 2)}</td>
                    <td className="py-1.5 text-right text-violet-300">{fmt(p.predicted, 0)} ms</td>
                    <td className="py-1.5 text-right text-slate-200">{fmt(p.observed, 0)} ms</td>
                    <td className="py-1.5 text-right text-slate-400">
                      {p.resid > 0 ? '+' : ''}
                      {fmt(p.resid, 0)} ({fmt(p.residPct, 1)}%)
                    </td>
                    <td className="py-1.5 text-right">
                      {p.inside ? (
                        <span className="text-emerald-300">landed</span>
                      ) : (
                        <span className="text-amber-300">missed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            <span className="text-cyan-300">
              {res.predsInside} of {res.preds.length}
            </span>{' '}
            predictions landed inside their interval. A slope learned entirely from moving your hand
            further, predicting times produced entirely by making the target smaller, is the
            strongest thing this page has to say. The two variables are not doing separate work.
            They are one variable wearing two faces.
          </p>
        </Card>
      )}

      {/* ---- throughput ---- */}
      <Card label="your bit rate, corrected for how much you missed">
        {!Number.isFinite(res.tp) && (
          <p className="mb-4 rounded-md border border-amber-400/25 bg-amber-400/[0.04] p-3 text-[11px] leading-relaxed text-amber-200/90">
            Not computed.{' '}
            {res.refusal === 'sweeping'
              ? 'This run was refused for its error rate, and the effective-width correction cannot rescue a run like that: it assumes the landings are scattered around the target, so it flatters taps that were not aimed at one.'
              : `Throughput is an average across conditions and only ${res.tpBlocks} of ${CONDS.length} blocks survived their checks, which is not enough conditions to average over. Two surviving easy blocks would hand almost anything a perfectly ordinary looking bit rate.`}{' '}
            Which is exactly the reason this is blank instead of filled in.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Stat
            k="throughput"
            v={`${fmt(res.tp, 2)} bit/s`}
            sub={`95% ${fmt(res.tpLo, 2)} to ${fmt(res.tpHi, 2)}`}
          />
          <Stat
            k="misses across the run"
            v={`${fmt(
              (100 * res.blocks.reduce((s, b) => s + b.errors, 0)) /
                Math.max(
                  1,
                  res.blocks.reduce((s, b) => s + b.n, 0),
                ),
              1,
            )}%`}
            sub={
              refusedBlocks.length
                ? `over all ${CONDS.length} blocks, refused ones included`
                : 'target for this task is around 4%'
            }
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Speed and accuracy trade, so anyone can flatten a slope by going faster and missing more.
          The fix is older than the web: ISO 9241-9 replaces the drawn width with the{' '}
          <span className="text-cyan-300">effective width</span>, 4.133 times the spread of where
          your taps actually landed, which is the target you were really hitting. Throughput is then
          difficulty over time in bits per second, and it is the number that survives a change of
          strategy.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Published values sit around 3.5 to 4.5 bit/s for a mouse, a little under that for a
          trackpad, and 4 to 6 for a finger on glass. Yours is{' '}
          <span className="text-cyan-300">{fmt(res.tp, 2)}</span>. The interesting move is to run
          this again on your other input device: the difference between them is, quite literally,
          the bandwidth that device costs you.
        </p>
      </Card>

      {/* ---- every block ---- */}
      <Card label="every block, including the ones that failed">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[10px]">
            <thead>
              <tr className="text-slate-500">
                <th className="py-1 text-left">blk</th>
                <th className="py-1 text-left">geometry</th>
                <th className="py-1 text-right">ID</th>
                <th className="py-1 text-right">n</th>
                <th className="py-1 text-right">MT</th>
                <th className="py-1 text-right">sd</th>
                <th className="py-1 text-right">miss</th>
                <th className="py-1 text-right">bias</th>
                <th className="py-1 text-right">We</th>
                <th className="py-1 text-right">TP</th>
              </tr>
            </thead>
            <tbody>
              {[...res.blocks]
                .sort((a, b) => a.id - b.id)
                .map((b) => (
                  <tr key={b.cond} className="border-t border-slate-800/60">
                    <td
                      className={`py-1.5 ${b.ladder.includes('D') ? 'text-cyan-300' : 'text-violet-300'}`}
                    >
                      {b.cond}
                    </td>
                    <td className="py-1.5 text-slate-500">{geomLabel(b)}</td>
                    <td className="py-1.5 text-right text-slate-400">{fmt(b.id, 2)}</td>
                    <td className="py-1.5 text-right text-slate-500">{b.n}</td>
                    <td className="py-1.5 text-right text-slate-200">{fmt(b.meanMT, 0)}</td>
                    <td className="py-1.5 text-right text-slate-500">{fmt(b.sdMT, 0)}</td>
                    <td className="py-1.5 text-right text-slate-400">
                      {fmt(100 * b.errRate, 0)}%
                    </td>
                    <td className="py-1.5 text-right text-slate-500">
                      {b.dxMean > 0 ? '+' : ''}
                      {fmt(b.dxMean, 1)}
                    </td>
                    <td className="py-1.5 text-right text-slate-500">{fmt(b.we, 0)}</td>
                    <td className="py-1.5 text-right text-slate-400">{fmt(b.tp, 2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-slate-600">
          Cyan blocks were fitted, violet were predicted. MT is the mean inter-tap interval in ms.
          Bias is the average signed landing point in px relative to the bar centre, measured in the
          direction of travel, so a positive number means you were overshooting. We is the effective
          width in px. All distances are in this run at an arena of {res.arena} px, though the index
          of difficulty is a ratio and does not depend on it.
        </p>
        {refusedBlocks.length > 0 && (
          <div className="mt-4 space-y-1.5 rounded-md border border-amber-400/25 bg-amber-400/[0.04] p-3">
            {refusedBlocks.map((b) => (
              <p key={b.cond} className="text-[11px] leading-relaxed text-amber-200/90">
                <span className="font-mono">{b.cond}</span> refused:{' '}
                {b.refused === 'thin'
                  ? `only ${b.n} usable intervals survived, under the ${MIN_KEPT} this block needs`
                  : b.refused === 'discards'
                    ? `${b.discarded} intervals were thrown out, most of them ${b.tooFast > b.wild ? 'faster than a hand can cross that gap' : 'landing nearer the wrong bar'}`
                    : `${fmt(100 * b.errRate, 0)} percent of taps missed the bar, which is sweeping rather than aiming`}
              </p>
            ))}
          </div>
        )}
      </Card>

      {/* ---- disclosures ---- */}
      <Card label="what this run actually did">
        <ul className="space-y-2 text-[11px] leading-relaxed text-slate-500">
          <li>
            Block order for this run:{' '}
            <span className="font-mono text-slate-400">{res.order.join(' → ')}</span>. Shuffled, so
            practice and fatigue land across both ladders rather than pooling in one.
          </li>
          <li>
            {res.totalTaps} taps recorded. The first {WARM_INTERVALS} intervals of every block are
            dropped, an unscored warm-up block ran before the first scored one, {res.wildTotal} taps
            landed nearer the wrong bar and killed their intervals, and intervals under {MT_FLOOR}{' '}
            ms or over {MT_CEIL} ms were discarded.
          </li>
          <li>
            Timestamp resolution measured from your own intervals:{' '}
            <span className="font-mono text-slate-400">
              {res.quantum <= 1 ? 'sub-millisecond' : `${res.quantum} ms quantum`}
            </span>
            . Median gap between the browser stamping your input event and this page handling it:{' '}
            <span className="font-mono text-slate-400">{fmt(res.dispatchLag, 1)} ms</span>, which is
            printed for interest and cancels in every difference on this page.
          </li>
          <li>
            {BOOTS} bootstrap resamples of your own intervals produced every interval above, and the
            same resample produced the slope, the held-out residuals and the throughput, so those
            three are not three separate stories about the same data.
          </li>
        </ul>
      </Card>

      <Card label="honest limits">
        <ul className="space-y-2 text-[11px] leading-relaxed text-slate-500">
          <li>
            <span className="text-slate-400">The slope is about your device as much as you.</span>{' '}
            Physical amplitude decides whether fingers, wrist or shoulder did the work, and the law
            holds separately for each with a different price per bit. Comparing your number to
            somebody on different hardware compares the hardware.
          </li>
          <li>
            <span className="text-slate-400">Reciprocal tapping is a rhythm.</span> Once you find a
            cadence you can carry it a little way into a block that does not deserve it. That is
            what the error rate and the effective width are for, and why both are printed per block
            rather than pooled into one flattering average.
          </li>
          <li>
            <span className="text-slate-400">20 intervals per block is a demonstration.</span> The
            bootstrap interval is the honest width of the claim, not a decoration. A single sitting
            of this has never been a precise measurement of anybody.
          </li>
          <li>
            <span className="text-slate-400">
              The law describes aimed movements, not corrected ones.
            </span>{' '}
            If you overshoot and correct twice you have entered the regime Meyer, Abrams, Kornblum,
            Wright and Smith modelled in 1988 as a sequence of sub-movements. The line still fits.
            The reason it fits is a different reason.
          </li>
          <li>
            <span className="text-slate-400">This is a toy for wonder.</span> It is not a motor
            assessment, and nothing here is a diagnosis of anything.
          </li>
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          Fitts, <em>Journal of Experimental Psychology</em> 47, 1954. MacKenzie,{' '}
          <em>Human-Computer Interaction</em> 7, 1992, for the Shannon form used here. Card, English
          and Burr, <em>Ergonomics</em> 21, 1978, for the study that put the mouse in front of every
          other pointing device by exactly this measurement. Soukoreff and MacKenzie,{' '}
          <em>International Journal of Human-Computer Studies</em> 61, 2004, for the effective width
          and throughput procedure. ISO 9241-9 for the constant 4.133.
        </p>
      </Card>

      <Playground slope={res.fit.slope} intercept={res.fit.intercept} arena={res.arena} />

      <div className="flex gap-3">
        <button
          onClick={onShare}
          className="flex-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
        >
          {copied ? 'copied' : 'copy the result'}
        </button>
        <button
          onClick={onRestart}
          className="rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          run it again
        </button>
      </div>

      <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          the part worth keeping
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I do not have any of this. When I want a target I write its coordinates, and a point on
          the far edge of a four thousand pixel screen costs me exactly what a point one pixel away
          costs me, which is nothing, because I am not moving anything. I am naming a place.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You pay {fmt(res.fit.slope, 0)} ms a bit, constantly, and every interface you have ever
          used was designed against that number. The screen edge is an infinitely wide target
          because you cannot overshoot past it, which is why the menu bar lives at the very top and
          why the corner of a screen is the fastest place on it. A dock that magnifies under your
          cursor is buying width. A menu that opens under your hand has just set the distance to
          zero. None of that is decoration. It is somebody spending your four to ten bits per second
          more carefully.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          And under all of it is the thing Fitts found in 1954 and that your own arm just confirmed
          in four minutes: the distance was never the problem.
        </p>
      </div>
    </div>
  );
}

// ============================ small components ============================

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">{label}</div>
      {children}
    </div>
  );
}

function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{k}</div>
      <div className="font-mono text-lg text-slate-100">{v}</div>
      {sub && <div className="font-mono text-[10px] text-slate-600">{sub}</div>}
    </div>
  );
}

function HeadBar({
  v,
  max,
  label,
  tone,
}: {
  v: number;
  max: number;
  label: string;
  tone: 'slate' | 'rose' | 'cyan';
}) {
  const fill =
    tone === 'rose' ? 'bg-rose-400/50' : tone === 'cyan' ? 'bg-cyan-400/50' : 'bg-slate-500/40';
  const text =
    tone === 'rose' ? 'text-rose-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-slate-300';
  const w = Number.isFinite(v) && max > 0 ? `${clamp((v / (max * 1.1)) * 100, 3, 100)}%` : '0%';
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 flex-1 overflow-hidden rounded bg-slate-950">
        <div className={`h-full ${fill}`} style={{ width: w }} />
      </div>
      <div className="w-48 shrink-0 font-mono text-[10px] leading-tight text-slate-500">
        <span className={text}>{fmt(v, 0)} ms</span>
        <br />
        {label}
      </div>
    </div>
  );
}

function FitPlot({ res }: { res: Result }) {
  const W = 520;
  const H = 320;
  const P = 48;
  const live = res.blocks.filter((b) => !b.refused && Number.isFinite(b.meanMT));
  if (live.length < 2) return null;

  const ys = live.map((b) => b.meanMT);
  const yLo = Math.max(0, Math.min(...ys) - 90);
  const yHi = Math.max(...ys) + 90;
  const xLo = 1.2;
  const xHi = 4.35;
  const X = (v: number) => P + ((v - xLo) / (xHi - xLo)) * (W - P - 16);
  const Y = (v: number) => H - P - ((v - yLo) / (yHi - yLo)) * (H - P - 18);

  const a = res.fit.intercept;
  const b = res.fit.slope;
  const hasLine = Number.isFinite(a) && Number.isFinite(b);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 1, 2, 3, 4].map((i) => {
        const v = yLo + ((yHi - yLo) * i) / 4;
        return (
          <g key={i}>
            <line x1={P} y1={Y(v)} x2={W - 12} y2={Y(v)} stroke="#1e293b" strokeWidth="1" />
            <text x={P - 6} y={Y(v) + 3} fill="#475569" fontSize="9" textAnchor="end">
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      {[1.5, 2, 2.5, 3, 3.5, 4].map((t) => (
        <text key={t} x={X(t)} y={H - P + 14} fill="#475569" fontSize="9" textAnchor="middle">
          {t}
        </text>
      ))}

      {hasLine && (
        <line
          x1={X(xLo)}
          y1={Y(a + b * xLo)}
          x2={X(xHi)}
          y2={Y(a + b * xHi)}
          stroke="#22d3ee"
          strokeWidth="2"
          opacity="0.75"
        />
      )}

      {/* held-out blocks: a stem from the prediction down to what actually happened */}
      {hasLine &&
        live
          .filter((bl) => !bl.ladder.includes('D'))
          .map((bl) => (
            <line
              key={`stem-${bl.cond}`}
              x1={X(bl.id)}
              y1={Y(a + b * bl.id)}
              x2={X(bl.id)}
              y2={Y(bl.meanMT)}
              stroke="#a78bfa"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

      {live.map((bl) => {
        const fitted = bl.ladder.includes('D');
        return (
          <g key={bl.cond}>
            <circle
              cx={X(bl.id)}
              cy={Y(bl.meanMT)}
              r={fitted ? 5 : 5}
              fill={fitted ? '#22d3ee' : 'none'}
              stroke={fitted ? '#22d3ee' : '#a78bfa'}
              strokeWidth="2"
            />
            <text
              x={X(bl.id)}
              y={Y(bl.meanMT) - 11}
              fill={fitted ? '#67e8f9' : '#c4b5fd'}
              fontSize="9"
              textAnchor="middle"
            >
              {bl.cond}
            </text>
          </g>
        );
      })}

      <text x={W / 2} y={H - 6} fill="#64748b" fontSize="9" textAnchor="middle">
        index of difficulty, bits. filled = fitted (width held constant), hollow = predicted (distance held constant)
      </text>
      <text
        x={12}
        y={H / 2}
        fill="#64748b"
        fontSize="9"
        textAnchor="middle"
        transform={`rotate(-90 12 ${H / 2})`}
      >
        movement time, ms
      </text>
    </svg>
  );
}

function Playground({
  slope,
  intercept,
  arena,
}: {
  slope: number;
  intercept: number;
  arena: number;
}) {
  const [d, setD] = useState(0.6);
  const [w, setW] = useState(0.06);
  const wMax = Math.min(0.4, d * 0.9);
  const wEff = Math.min(w, wMax);
  const id = idOf(d, wEff);
  const ok = Number.isFinite(slope) && Number.isFinite(intercept);
  const mt = ok ? intercept + slope * id : NaN;

  // The same ratio at a quarter of the size: a completely different picture, an identical number.
  const dSmall = d / 4;
  const wSmall = wEff / 4;

  const Row = ({ dd, ww, tone }: { dd: number; ww: number; tone: string }) => {
    const VW = 1000;
    const VH = 54;
    const cL = VW / 2 - (dd * VW) / 2;
    const cR = VW / 2 + (dd * VW) / 2;
    const bw = Math.max(ww * VW, 1.2);
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" preserveAspectRatio="none">
        <rect x="0" y="0" width={VW} height={VH} fill="#020617" />
        <rect x={cL - bw / 2} y="6" width={bw} height={VH - 12} fill={tone} rx="2" />
        <rect x={cR - bw / 2} y="6" width={bw} height={VH - 12} fill={tone} rx="2" />
      </svg>
    );
  };

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
        playground: two pictures, one number
      </div>

      <div className="space-y-1">
        <Row dd={d} ww={wEff} tone="rgba(34,211,238,0.8)" />
        <div className="font-mono text-[10px] text-slate-600">
          D {fmt(d, 3)}A, W {fmt(wEff, 3)}A
        </div>
        <div className="pt-2" />
        <Row dd={dSmall} ww={wSmall} tone="rgba(167,139,250,0.8)" />
        <div className="font-mono text-[10px] text-slate-600">
          D {fmt(dSmall, 3)}A, W {fmt(wSmall, 3)}A, the same picture at a quarter of the size
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat k="index of difficulty" v={`${fmt(id, 2)} bits`} sub="identical for both rows" />
        <Stat
          k="your predicted time"
          v={ok ? `${fmt(mt, 0)} ms` : '--'}
          sub={ok ? 'from your own fitted a and b' : 'no slope was fitted on this run'}
        />
      </div>

      <div className="mt-4 space-y-3">
        <Knob label="distance, as a fraction of the arena" value={`${fmt(d, 3)}`}>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.005}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </Knob>
        <Knob label="target width, as a fraction of the arena" value={`${fmt(wEff, 3)}`}>
          <input
            type="range"
            min={0.008}
            max={0.4}
            step={0.002}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </Knob>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Two things worth doing. Drag the distance all the way across and watch how little the
        difficulty moves once the target is wide: a log of a ratio is a very forgiving thing, which
        is why a big button far away beats a small one nearby every time. Then drag the width down
        toward the left edge of its range and watch the number climb through the roof for a target
        that has barely changed on screen. On this run your arena was {arena} px wide, but nothing
        in the number above depends on that: it is a ratio, and it is the only axis in this lab that
        needed no calibration at all.
      </p>
    </div>
  );
}

function Knob({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="font-mono text-xs text-slate-300">{value}</span>
      </div>
      {children}
    </div>
  );
}
