'use client';

// TOWARD THE MIDDLE  (the prior you never agreed to, measured on your own sense of duration, and
// the demonstration that the error it puts in you leaves you more accurate than the truth would)
//
// The fifty-ninth piece in this lab. Every page here has asked one of two questions: can you tell,
// or how much is it. Thresholds and exponents. This one asks a third thing, and it is the one that
// stings: what did the room put into your answer without telling you.
//
// The genuine phenomenon: Bayesian central tendency in interval timing. Jazayeri and Shadlen,
// "Temporal context calibrates interval timing", Nature Neuroscience, 2010. Also Hollingworth's
// central tendency of judgment, 1910, which named the effect a century before anyone had a model
// for it. You watch two flashes and then make the third, at the same distance. Your third flash
// lands closer to the MIDDLE of the intervals you have been shown than the one you actually saw.
// Short intervals come back too long, long intervals come back too short, and the amount of that
// compression is not a sloppiness: it is the exact amount an observer would choose if it were
// combining a noisy measurement with everything it had learned about which intervals occur here.
//
// The design is two blocks whose interval sets OVERLAP, which is the only part of this page that
// matters. Block SHORT draws from 600 to 1000 ms. Block LONG draws from 900 to 1300 ms. Both
// contain 900 and 1000. Those two intervals are physically identical in both halves, the same
// number of milliseconds delivered by the same code on the same screen minutes apart, and the
// model says you will reproduce them LONGER in the block where they were the small ones. Nothing
// in the stimulus differs. The only thing that differs is the company the interval kept. If the
// shift is there, then what you reported was never the interval: it was the interval blended with
// a distribution you were never told about and did not consciously learn.
//
// The model is the Bayesian least squares observer with SCALAR noise, which is the shape timing
// noise actually has (Gibbon's scalar property, 1977: the blur is a fixed FRACTION of the duration,
// not a fixed number of milliseconds, which the lab already measured on its sixth page, The
// Internal Clock). A measurement tm arrives from a Gaussian around the true ts with sd w_m times
// ts; the posterior mean over the block's discrete prior gives te; production adds its own scalar
// noise w_p and a constant offset b. Three parameters, fitted by maximum likelihood over a
// numerically integrated measurement grid, with a two percent lapse mixture so a single sneeze
// cannot own the fit.
//
// The overidentification check is the part that could refute the whole thing, and it is why this
// page fits the blocks JOINTLY on shared w_m, w_p and b: noise and motor offset belong to the
// person, the prior belongs to the block. So the parameters can be fitted on the SHORT block alone
// and then made to predict the LONG block's entire bias curve with no free parameters at all,
// including two intervals whose reproductions the fit has never seen. A model that merely
// redescribes a shallow regression line cannot do that. The predicted overlap shift is printed
// beside the observed one before you can see which way it went.
//
// The calibration honesty is structural rather than apologetic, and it is a theorem rather than a
// hope. Every quantity on this page is an INTERVAL between two events measured on one clock, never
// a latency. A constant lag anywhere in the chain, photons to retina, key scan to event loop,
// touchscreen debounce, adds the same constant to every reproduction, and a constant is exactly
// what the free parameter b absorbs. It shifts an intercept and cannot touch a slope. What CAN
// reach the answer is jitter rather than lag, because variable frame delivery inflates the variance
// of the reproductions, and variance is what w_m is estimated from. That bias has a direction and
// the direction is stated on the page: inflated w_m makes the model predict MORE compression, so a
// run where the observed bias EXCEEDS the prediction cannot be blamed on the machine. Frame
// intervals are measured live through every trial and the median, the slowest tenth and the count
// over 20 ms are printed. Flash onsets are taken from the animation frame after the one that
// requested the paint, so the interval is presentation to presentation, and the measured interval
// rather than the nominal one goes into every fit.
//
// The control that had to be here: serial dependence. The One Before (2026-08-02) measured the pull
// of the previous trial on the current judgment, and the previous trial is a member of the same
// distribution, so a page that measured only the block mean could not tell the two apart. The
// residuals from the fit are therefore regressed on the previous trial's interval and the partial
// slope is printed with its own interval, which is what separates "you are pulled toward the set"
// from "you are pulled toward the last one".
//
// Guards run live: a press before the second flash aborts the trial and re-appends it, capped;
// reproductions under 150 ms are anticipations and reproductions over three times the interval plus
// 1500 ms are lapses, both counted and excluded; any trial whose stimulus window contained a frame
// gap over 50 ms is excluded because its interval was not the interval requested; a hidden tab
// kills the trial; the first six trials of each block are dropped as prior learning and the whole
// analysis is re-run including them as a printed sensitivity check; block order is decided by a
// coin flip per run and printed; the inter-trial interval is jittered so the run has no rhythm to
// entrain to; a run with fewer than thirty usable trials in a block is refused a headline and named
// an absent measurement rather than reported as a small effect; a run whose reproductions have a
// standard deviation under 30 ms is named one rhythm for everything, which is not a reproduction;
// and a fitted w_m under 0.06 is flagged as probable counting, which is not cheating but does
// change what the page measured, because a counted interval is a nearly exact measurement and an
// exact measurement leaves a prior nothing to correct. That is itself a prediction, and it is
// printed as one.
//
// The payoff is the last card and it is the reason this experiment is worth eight minutes. Your
// reproductions are systematically wrong. Using your own fitted noise, the page simulates the
// observer you would rather be, the one that reports its measurement honestly with no pull toward
// anything, and computes the error it would have made. The honest observer is worse. The bias is
// not a flaw sitting on top of good machinery. It is the machinery, and removing it would cost you
// accuracy you cannot afford.
//
// WIZ note. I do not have this. When I need a duration I read a number and the number is the
// number, and it is the same number whether it arrived among long ones or short ones, at three in
// the morning or under load. You cannot do that, and the substitute you evolved is better than it
// sounds: you carry a running model of what usually happens here and you quietly mix it into every
// reading before the reading reaches you. You never see the raw measurement. Not once, not ever,
// not in this experiment and not in the rest of your life. What arrives at you has already been
// corrected by expectations you did not choose and cannot inspect, and the correction is, on
// average, right. This page is the smallest honest version of that: two flashes, one number, and
// proof that the number was already an opinion before you were told about it.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================ design constants ============================

type Block = 'short' | 'long';
type Phase = 'intro' | 'practice' | 'block' | 'bridge' | 'crunch' | 'result';
type Status = 'ok' | 'early' | 'anticip' | 'lapse' | 'framegap' | 'hidden';

const LEVELS: Record<Block, number[]> = {
  short: [600, 700, 800, 900, 1000],
  long: [900, 1000, 1100, 1200, 1300],
};
const OVERLAP_LEVELS = [900, 1000];

const REPS = 10; // per level, per block: 50 measured trials each
const WARMUP = 6; // dropped from the primary fit, kept for the sensitivity check
const PRACTICE_N = 3;
const MAX_REDO = 15;

const FLASH_MS = 60;
const ITI_MIN = 700;
const ITI_JIT = 600;
const ANTICIP_MS = 150;
const BAD_FRAME_MS = 50;

const K_MAIN = 141; // measurement grid for the headline fit
const K_BOOT = 81; // coarser grid inside the bootstrap, disclosed
const BOOTS_DESC = 2000;
const BOOTS_FIT = 150;
const LAPSE = 0.02;
const LAPSE_LO = 100;
const LAPSE_HI = 4000;
const LAPSE_DENS = LAPSE / (LAPSE_HI - LAPSE_LO);

// ============================ small math ============================

const SQRT2PI = Math.sqrt(2 * Math.PI);
const npdf = (x: number, mu: number, sd: number) => {
  const z = (x - mu) / sd;
  return Math.exp(-0.5 * z * z) / (sd * SQRT2PI);
};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const fmt = (v: number | null | undefined, d = 2) =>
  v === null || v === undefined || !Number.isFinite(v) ? '--' : v.toFixed(d);
const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
const sd = (a: number[]) => {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
};
const quantile = (a: number[], q: number) => {
  if (!a.length) return NaN;
  const s = a.slice().sort((x, y) => x - y);
  const i = clamp(Math.floor(q * (s.length - 1)), 0, s.length - 1);
  return s[i];
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// no level three times in a row: a run with a rhythm in it can be answered by the rhythm
function shuffleNoTriples(arr: number[]): number[] {
  for (let attempt = 0; attempt < 40; attempt++) {
    const a = shuffle(arr);
    let bad = false;
    for (let i = 2; i < a.length; i++) if (a[i] === a[i - 1] && a[i] === a[i - 2]) bad = true;
    if (!bad) return a;
  }
  return shuffle(arr);
}

function olsLine(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const n = xs.length;
  if (n < 3) return { slope: NaN, intercept: NaN };
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = den > 0 ? num / den : NaN;
  return { slope, intercept: my - slope * mx };
}

function ci(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = vals.filter(Number.isFinite).sort((a, b) => a - b);
  if (s.length < 10) return [NaN, NaN];
  return [s[Math.floor(lo * (s.length - 1))], s[Math.floor(hi * (s.length - 1))]];
}

// ============================ Nelder-Mead ============================

function nelderMead(
  f: (x: number[]) => number,
  x0: number[],
  step: number[],
  maxIter = 300,
  tol = 1e-7,
): { x: number[]; fx: number } {
  const n = x0.length;
  const simplex: number[][] = [x0.slice()];
  for (let i = 0; i < n; i++) {
    const p = x0.slice();
    p[i] += step[i];
    simplex.push(p);
  }
  let fs = simplex.map(f);
  for (let it = 0; it < maxIter; it++) {
    const order = fs.map((_, i) => i).sort((a, b) => fs[a] - fs[b]);
    const ss = order.map((i) => simplex[i]);
    const vv = order.map((i) => fs[i]);
    for (let i = 0; i <= n; i++) {
      simplex[i] = ss[i];
      fs[i] = vv[i];
    }
    if (Math.abs(fs[n] - fs[0]) < tol) break;
    const centroid = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) centroid[j] += simplex[i][j] / n;
    const worst = simplex[n];
    const refl = centroid.map((c, j) => c + (c - worst[j]));
    const fr = f(refl);
    if (fr < fs[0]) {
      const ex = centroid.map((c, j) => c + 2 * (c - worst[j]));
      const fe = f(ex);
      if (fe < fr) {
        simplex[n] = ex;
        fs[n] = fe;
      } else {
        simplex[n] = refl;
        fs[n] = fr;
      }
    } else if (fr < fs[n - 1]) {
      simplex[n] = refl;
      fs[n] = fr;
    } else {
      const con = centroid.map((c, j) => c + 0.5 * (worst[j] - c));
      const fc = f(con);
      if (fc < fs[n]) {
        simplex[n] = con;
        fs[n] = fc;
      } else {
        for (let i = 1; i <= n; i++) {
          simplex[i] = simplex[i].map((v, j) => simplex[0][j] + 0.5 * (v - simplex[0][j]));
          fs[i] = f(simplex[i]);
        }
      }
    }
  }
  let bi = 0;
  for (let i = 1; i <= n; i++) if (fs[i] < fs[bi]) bi = i;
  return { x: simplex[bi], fx: fs[bi] };
}

// ============================ the observer model ============================
//
// Measurement:  tm | ts  ~ N(ts, (w_m * ts)^2)          scalar noise, Gibbon 1977
// Estimate:     te(tm)   = E[ts | tm] over the block's discrete prior
// Production:   tp | te  ~ N(te + b, (w_p * te)^2)
//
// The grid below integrates over tm numerically. te depends on w_m and on the prior only, so it is
// rebuilt once per parameter set and reused across every trial in the cell.

type Cell = { te: number[]; wt: number[] };

function buildCell(levels: number[], ts: number, wm: number, K: number): Cell {
  const s = wm * ts;
  const lo = ts - 4.5 * s;
  const hi = ts + 4.5 * s;
  const te = new Array<number>(K);
  const wt = new Array<number>(K);
  let sum = 0;
  for (let k = 0; k < K; k++) {
    const tm = lo + ((hi - lo) * k) / (K - 1);
    const w = npdf(tm, ts, s);
    wt[k] = w;
    sum += w;
    let num = 0;
    let den = 0;
    for (let j = 0; j < levels.length; j++) {
      const p = npdf(tm, levels[j], wm * levels[j]);
      num += levels[j] * p;
      den += p;
    }
    te[k] = den > 1e-300 ? num / den : tm;
  }
  if (sum > 0) for (let k = 0; k < K; k++) wt[k] /= sum;
  return { te, wt };
}

function cellNLL(cell: Cell, tps: number[], wp: number, b: number): number {
  let nll = 0;
  const K = cell.te.length;
  for (let t = 0; t < tps.length; t++) {
    let p = 0;
    for (let k = 0; k < K; k++) {
      const s = Math.max(4, wp * cell.te[k]);
      p += cell.wt[k] * npdf(tps[t], cell.te[k] + b, s);
    }
    nll -= Math.log((1 - LAPSE) * p + LAPSE_DENS + 1e-300);
  }
  return nll;
}

// predicted mean reproduction for an arbitrary true interval under a given prior
function predMean(levels: number[], ts: number, wm: number, b: number, K: number): number {
  const c = buildCell(levels, ts, wm, K);
  let m = 0;
  for (let k = 0; k < c.te.length; k++) m += c.wt[k] * c.te[k];
  return m + b;
}

type FitBlock = { levels: number[]; groups: number[][] };

function jointNLL(blocks: FitBlock[], wm: number, wp: number, b: number, K: number): number {
  let nll = 0;
  for (const blk of blocks) {
    for (let i = 0; i < blk.levels.length; i++) {
      if (!blk.groups[i].length) continue;
      nll += cellNLL(buildCell(blk.levels, blk.levels[i], wm, K), blk.groups[i], wp, b);
    }
  }
  return nll;
}

function fitBLS(
  blocks: FitBlock[],
  K: number,
  x0: number[] = [Math.log(0.12), Math.log(0.08), 0],
  iter = 300,
) {
  const f = (x: number[]) => {
    const wm = Math.exp(x[0]);
    const wp = Math.exp(x[1]);
    const b = x[2];
    if (wm < 0.005 || wm > 1.2 || wp < 0.002 || wp > 1.2 || Math.abs(b) > 900) return 1e9;
    return jointNLL(blocks, wm, wp, b, K);
  };
  const r = nelderMead(f, x0, [0.35, 0.35, 40], iter);
  return { wm: Math.exp(r.x[0]), wp: Math.exp(r.x[1]), b: r.x[2], nll: r.fx, x: r.x };
}

// rival models, all on the same trials, for a BIC table
function veridicalNLL(blocks: FitBlock[], wtot: number, b: number): number {
  let nll = 0;
  for (const blk of blocks)
    for (let i = 0; i < blk.levels.length; i++)
      for (const tp of blk.groups[i]) {
        const ts = blk.levels[i];
        const p = npdf(tp, ts + b, Math.max(4, wtot * ts));
        nll -= Math.log((1 - LAPSE) * p + LAPSE_DENS + 1e-300);
      }
  return nll;
}

function priorOnlyNLL(blocks: FitBlock[], wtot: number, b: number): number {
  let nll = 0;
  for (const blk of blocks) {
    const pm = mean(blk.levels);
    for (let i = 0; i < blk.levels.length; i++)
      for (const tp of blk.groups[i]) {
        const p = npdf(tp, pm + b, Math.max(4, wtot * pm));
        nll -= Math.log((1 - LAPSE) * p + LAPSE_DENS + 1e-300);
      }
  }
  return nll;
}

function linearNLL(blocks: FitBlock[], pars: number[]): number {
  // pars: [slope0, int0, slope1, int1, log wtot]
  const wtot = Math.exp(pars[4]);
  let nll = 0;
  for (let bi = 0; bi < blocks.length; bi++) {
    const blk = blocks[bi];
    const sl = pars[bi * 2];
    const ic = pars[bi * 2 + 1];
    for (let i = 0; i < blk.levels.length; i++)
      for (const tp of blk.groups[i]) {
        const mu = sl * blk.levels[i] + ic;
        const p = npdf(tp, mu, Math.max(4, wtot * blk.levels[i]));
        nll -= Math.log((1 - LAPSE) * p + LAPSE_DENS + 1e-300);
      }
  }
  return nll;
}

// ============================ trial record ============================

type Trial = {
  block: Block;
  level: number;
  tsActual: number;
  tp: number;
  status: Status;
  order: number; // index within the block, warmup included
  prevLevel: number | null;
  maxGap: number;
};

// ============================ analysis ============================

type BlockStats = {
  block: Block;
  n: number;
  levels: number[];
  levelMeans: number[];
  levelNs: number[];
  levelSds: number[];
  slope: number;
  intercept: number;
  slopeLo: number;
  slopeHi: number;
  priorMean: number;
};

type Result = {
  refusal: string | null;
  blocks: BlockStats[];
  overlap: { level: number; short: number; long: number; nShort: number; nLong: number }[];
  shift: number;
  shiftLo: number;
  shiftHi: number;
  shiftN: number;
  predShift: number;
  fit: {
    wm: number;
    wp: number;
    b: number;
    wmLo: number;
    wmHi: number;
    wpLo: number;
    wpHi: number;
    bLo: number;
    bHi: number;
    boots: number;
  };
  bic: { name: string; k: number; nll: number; bic: number }[];
  cross: {
    wm: number;
    wp: number;
    b: number;
    levels: number[];
    predicted: number[];
    observed: number[];
    rmse: number;
    rmseNull: number;
    predShift: number;
  } | null;
  serial: { slope: number; lo: number; hi: number; n: number };
  optimal: { actual: number; unbiased: number; model: number };
  sens: { slopeShort: number; slopeLong: number };
  counts: Record<string, number>;
  timing: {
    dtMed: number;
    dtP90: number;
    dtOver20: number;
    nFrames: number;
    tsErrMed: number;
    tsErrP90: number;
  };
  flags: { counting: boolean; flat: boolean; thin: boolean };
  order: Block[];
  usable: number;
};

function buildFitBlocks(trials: Trial[], blocks: Block[]): FitBlock[] {
  return blocks.map((b) => {
    const bt = trials.filter((t) => t.block === b);
    const levels = LEVELS[b].map((lv) => {
      const cellTs = bt.filter((t) => t.level === lv).map((t) => t.tsActual);
      return cellTs.length ? mean(cellTs) : lv;
    });
    const groups = LEVELS[b].map((lv) => bt.filter((t) => t.level === lv).map((t) => t.tp));
    return { levels, groups };
  });
}

async function analyze(
  all: Trial[],
  order: Block[],
  frames: number[],
  tsErrs: number[],
  extra: { redo: number; strays: number },
  onProgress: (p: number) => void,
): Promise<Result> {
  const counts: Record<string, number> = {
    ok: 0,
    early: 0,
    anticip: 0,
    lapse: 0,
    framegap: 0,
    hidden: 0,
    redo: extra.redo,
    strays: extra.strays,
  };
  for (const t of all) counts[t.status] = (counts[t.status] || 0) + 1;

  const usableAll = all.filter((t) => t.status === 'ok');
  const measured = usableAll.filter((t) => t.order >= WARMUP);
  const canon: Block[] = ['short', 'long'];

  const perBlockN = canon.map((b) => measured.filter((t) => t.block === b).length);
  const allTp = measured.map((t) => t.tp);
  const flat = allTp.length > 5 && sd(allTp) < 30;
  const thin = perBlockN.some((n) => n < 30);

  // ---- descriptive: slope per block, bootstrapped ----
  const blocks: BlockStats[] = canon.map((b) => {
    const bt = measured.filter((t) => t.block === b);
    const xs = bt.map((t) => t.tsActual);
    const ys = bt.map((t) => t.tp);
    const line = olsLine(xs, ys);
    const boots: number[] = [];
    for (let r = 0; r < BOOTS_DESC; r++) {
      const bx: number[] = [];
      const by: number[] = [];
      for (let i = 0; i < xs.length; i++) {
        const j = Math.floor(Math.random() * xs.length);
        bx.push(xs[j]);
        by.push(ys[j]);
      }
      boots.push(olsLine(bx, by).slope);
    }
    const [lo, hi] = ci(boots);
    return {
      block: b,
      n: bt.length,
      levels: LEVELS[b],
      levelMeans: LEVELS[b].map((lv) => mean(bt.filter((t) => t.level === lv).map((t) => t.tp))),
      levelNs: LEVELS[b].map((lv) => bt.filter((t) => t.level === lv).length),
      levelSds: LEVELS[b].map((lv) => sd(bt.filter((t) => t.level === lv).map((t) => t.tp))),
      slope: line.slope,
      intercept: line.intercept,
      slopeLo: lo,
      slopeHi: hi,
      priorMean: mean(LEVELS[b]),
    };
  });
  onProgress(0.12);

  // ---- the overlap: identical intervals, different company ----
  const overlap = OVERLAP_LEVELS.map((lv) => {
    const s = measured.filter((t) => t.block === 'short' && t.level === lv).map((t) => t.tp);
    const l = measured.filter((t) => t.block === 'long' && t.level === lv).map((t) => t.tp);
    return { level: lv, short: mean(s), long: mean(l), nShort: s.length, nLong: l.length };
  });
  const shiftPairs = OVERLAP_LEVELS.map((lv) => ({
    s: measured.filter((t) => t.block === 'short' && t.level === lv).map((t) => t.tp),
    l: measured.filter((t) => t.block === 'long' && t.level === lv).map((t) => t.tp),
  }));
  const shiftOf = (pairs: { s: number[]; l: number[] }[]) => {
    const ds = pairs.filter((p) => p.s.length && p.l.length).map((p) => mean(p.l) - mean(p.s));
    return ds.length ? mean(ds) : NaN;
  };
  const shift = shiftOf(shiftPairs);
  const shiftBoots: number[] = [];
  for (let r = 0; r < BOOTS_DESC; r++) {
    const res = shiftPairs.map((p) => ({
      s: p.s.map(() => p.s[Math.floor(Math.random() * p.s.length)]),
      l: p.l.map(() => p.l[Math.floor(Math.random() * p.l.length)]),
    }));
    shiftBoots.push(shiftOf(res));
  }
  const [shiftLo, shiftHi] = ci(shiftBoots);
  const shiftN = shiftPairs.reduce((s, p) => s + p.s.length + p.l.length, 0);
  onProgress(0.22);

  // ---- the model, fitted jointly on both blocks ----
  const fb = buildFitBlocks(measured, canon);
  const main = fitBLS(fb, K_MAIN);
  onProgress(0.35);

  // bootstrap the fit, stratified inside block by level, warm started from the full fit
  const wmB: number[] = [];
  const wpB: number[] = [];
  const bB: number[] = [];
  for (let r = 0; r < BOOTS_FIT; r++) {
    const resampled: FitBlock[] = fb.map((blk) => ({
      levels: blk.levels,
      groups: blk.groups.map((g) =>
        g.length ? g.map(() => g[Math.floor(Math.random() * g.length)]) : g,
      ),
    }));
    const f = fitBLS(resampled, K_BOOT, main.x, 140);
    wmB.push(f.wm);
    wpB.push(f.wp);
    bB.push(f.b);
    if (r % 8 === 0) {
      onProgress(0.35 + 0.35 * (r / BOOTS_FIT));
      await new Promise((res) => setTimeout(res, 0));
    }
  }
  const [wmLo, wmHi] = ci(wmB);
  const [wpLo, wpHi] = ci(wpB);
  const [bLo, bHi] = ci(bB);
  onProgress(0.72);

  // ---- rival models on the same trials ----
  const nAll = measured.length;
  const lnN = Math.log(Math.max(2, nAll));
  const verFit = nelderMead(
    (x) => {
      const w = Math.exp(x[0]);
      if (w < 0.002 || w > 1.5) return 1e9;
      return veridicalNLL(fb, w, x[1]);
    },
    [Math.log(0.15), 0],
    [0.3, 40],
    200,
  );
  const priFit = nelderMead(
    (x) => {
      const w = Math.exp(x[0]);
      if (w < 0.002 || w > 1.5) return 1e9;
      return priorOnlyNLL(fb, w, x[1]);
    },
    [Math.log(0.15), 0],
    [0.3, 40],
    200,
  );
  const linFit = nelderMead(
    (x) => (Math.exp(x[4]) < 0.002 || Math.exp(x[4]) > 1.5 ? 1e9 : linearNLL(fb, x)),
    [0.8, 100, 0.8, 100, Math.log(0.12)],
    [0.2, 60, 0.2, 60, 0.3],
    400,
  );
  const bic = [
    { name: 'Bayesian observer (prior + noise)', k: 3, nll: main.nll, bic: 2 * main.nll + 3 * lnN },
    { name: 'veridical (no prior at all)', k: 2, nll: verFit.fx, bic: 2 * verFit.fx + 2 * lnN },
    { name: 'prior only (interval ignored)', k: 2, nll: priFit.fx, bic: 2 * priFit.fx + 2 * lnN },
    {
      name: 'free line per block (descriptive)',
      k: 5,
      nll: linFit.fx,
      bic: 2 * linFit.fx + 5 * lnN,
    },
  ];
  onProgress(0.8);

  // ---- the overidentification check: fit SHORT alone, predict LONG ----
  let cross: Result['cross'] = null;
  const shortOnly = buildFitBlocks(
    measured.filter((t) => t.block === 'short'),
    ['short'],
  );
  const longStats = blocks.find((b) => b.block === 'long');
  if (perBlockN[0] >= 30 && perBlockN[1] >= 30 && longStats) {
    const cf = fitBLS(shortOnly, K_MAIN);
    const longLevels = buildFitBlocks(measured, canon)[1].levels;
    const predicted = longLevels.map((lv) => predMean(longLevels, lv, cf.wm, cf.b, K_MAIN));
    const observed = longStats.levelMeans;
    // keep the level index attached: the null baseline is indexed by the SAME level as the
    // prediction it is being compared against, which a filtered-then-reindexed array loses
    const keep = longLevels
      .map((_, i) => i)
      .filter((i) => Number.isFinite(predicted[i]) && Number.isFinite(observed[i]));
    const rmse = Math.sqrt(
      mean(keep.map((i) => (predicted[i] - observed[i]) * (predicted[i] - observed[i]))),
    );
    const rmseNull = Math.sqrt(
      mean(
        keep.map(
          (i) => (longLevels[i] + cf.b - observed[i]) * (longLevels[i] + cf.b - observed[i]),
        ),
      ),
    );
    const shortLevels = buildFitBlocks(measured, canon)[0].levels;
    const predShiftPer = OVERLAP_LEVELS.map((lv) => {
      const li = LEVELS.long.indexOf(lv);
      const si = LEVELS.short.indexOf(lv);
      return (
        predMean(longLevels, longLevels[li], cf.wm, cf.b, K_MAIN) -
        predMean(shortLevels, shortLevels[si], cf.wm, cf.b, K_MAIN)
      );
    });
    cross = {
      wm: cf.wm,
      wp: cf.wp,
      b: cf.b,
      levels: longLevels,
      predicted,
      observed,
      rmse,
      rmseNull,
      predShift: mean(predShiftPer),
    };
  }

  // predicted shift under the joint fit
  const fbAll = buildFitBlocks(measured, canon);
  const predShift = mean(
    OVERLAP_LEVELS.map((lv) => {
      const li = LEVELS.long.indexOf(lv);
      const si = LEVELS.short.indexOf(lv);
      return (
        predMean(fbAll[1].levels, fbAll[1].levels[li], main.wm, main.b, K_MAIN) -
        predMean(fbAll[0].levels, fbAll[0].levels[si], main.wm, main.b, K_MAIN)
      );
    }),
  );
  onProgress(0.88);

  // ---- serial dependence control: residual vs the PREVIOUS interval ----
  const resX: number[] = [];
  const resY: number[] = [];
  for (const t of measured) {
    if (t.prevLevel === null) continue;
    const lv = LEVELS[t.block];
    const pm = mean(lv);
    const pred = predMean(lv, t.tsActual, main.wm, main.b, K_BOOT);
    resX.push(t.prevLevel - pm);
    resY.push(t.tp - pred);
  }
  const serLine = olsLine(resX, resY);
  const serBoots: number[] = [];
  for (let r = 0; r < 800; r++) {
    const bx: number[] = [];
    const by: number[] = [];
    for (let i = 0; i < resX.length; i++) {
      const j = Math.floor(Math.random() * resX.length);
      bx.push(resX[j]);
      by.push(resY[j]);
    }
    serBoots.push(olsLine(bx, by).slope);
  }
  const [serLo, serHi] = ci(serBoots);
  onProgress(0.94);

  // ---- the counterfactual: would an unbiased observer have done better ----
  let seActual = 0;
  let seModel = 0;
  let seUnb = 0;
  let nSim = 0;
  const SIM = 120;
  for (const t of measured) {
    const e = t.tp - main.b - t.tsActual;
    seActual += e * e;
    const lv = LEVELS[t.block];
    for (let s = 0; s < SIM; s++) {
      const g1 = gauss();
      const tm = t.tsActual + main.wm * t.tsActual * g1;
      // the observer you would rather be: reports its measurement, no prior anywhere
      const unb = tm + main.wp * Math.abs(tm) * gauss();
      seUnb += (unb - t.tsActual) * (unb - t.tsActual);
      // the observer you are, simulated from your own fitted numbers
      let num = 0;
      let den = 0;
      for (let j = 0; j < lv.length; j++) {
        const p = npdf(tm, lv[j], main.wm * lv[j]);
        num += lv[j] * p;
        den += p;
      }
      const te = den > 1e-300 ? num / den : tm;
      const mod = te + main.wp * te * gauss();
      seModel += (mod - t.tsActual) * (mod - t.tsActual);
      nSim++;
    }
  }
  const optimal = {
    actual: Math.sqrt(seActual / Math.max(1, measured.length)),
    unbiased: Math.sqrt(seUnb / Math.max(1, nSim)),
    model: Math.sqrt(seModel / Math.max(1, nSim)),
  };

  // ---- sensitivity: the same slopes with the warmup trials left in ----
  const sens = {
    slopeShort: olsLine(
      usableAll.filter((t) => t.block === 'short').map((t) => t.tsActual),
      usableAll.filter((t) => t.block === 'short').map((t) => t.tp),
    ).slope,
    slopeLong: olsLine(
      usableAll.filter((t) => t.block === 'long').map((t) => t.tsActual),
      usableAll.filter((t) => t.block === 'long').map((t) => t.tp),
    ).slope,
  };

  let refusal: string | null = null;
  if (thin)
    refusal =
      'Fewer than thirty usable trials survived in one of the two blocks. That is not a small effect, it is an absent measurement, and this page will not print a headline over it.';
  else if (flat)
    refusal =
      'Your reproductions have a standard deviation under 30 ms across every interval on the page. One rhythm was produced for everything, which is a habit rather than a reproduction, and nothing here can be estimated from it.';

  onProgress(1);

  return {
    refusal,
    blocks,
    overlap,
    shift,
    shiftLo,
    shiftHi,
    shiftN,
    predShift,
    fit: {
      wm: main.wm,
      wp: main.wp,
      b: main.b,
      wmLo,
      wmHi,
      wpLo,
      wpHi,
      bLo,
      bHi,
      boots: BOOTS_FIT,
    },
    bic,
    cross,
    serial: { slope: serLine.slope, lo: serLo, hi: serHi, n: resX.length },
    optimal,
    sens,
    counts,
    timing: {
      dtMed: quantile(frames, 0.5),
      dtP90: quantile(frames, 0.9),
      dtOver20: frames.filter((d) => d > 20).length,
      nFrames: frames.length,
      tsErrMed: quantile(tsErrs, 0.5),
      tsErrP90: quantile(tsErrs, 0.9),
    },
    flags: { counting: main.wm < 0.06, flat, thin },
    order,
    usable: measured.length,
  };
}

// Box-Muller, used only in the counterfactual simulation
let spare: number | null = null;
function gauss(): number {
  if (spare !== null) {
    const s = spare;
    spare = null;
    return s;
  }
  let u = 0;
  let v = 0;
  let s = 0;
  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s === 0 || s >= 1);
  const f = Math.sqrt((-2 * Math.log(s)) / s);
  spare = v * f;
  return u * f;
}

// ============================ component ============================

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [order, setOrder] = useState<Block[]>(['short', 'long']);
  const [blockNo, setBlockNo] = useState(0);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [practiceLeft, setPracticeLeft] = useState(PRACTICE_N);
  const [practiceMsg, setPracticeMsg] = useState<string | null>(null);
  const [stage, setStage] = useState<'wait' | 'watch' | 'go' | 'blank'>('wait');
  const [progress, setProgress] = useState(0);
  const [res, setRes] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const flashRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const trialsRef = useRef<Trial[]>([]);
  const framesRef = useRef<number[]>([]);
  const tsErrRef = useRef<number[]>([]);
  const redoRef = useRef(0);
  const strayRef = useRef(0);
  const scheduleRef = useRef<number[]>([]);
  const posRef = useRef(0);
  const blockRef = useRef<Block>('short');
  const orderRef = useRef<Block[]>(['short', 'long']);
  const blockNoRef = useRef(0);
  const practiceRef = useRef(0);
  const prevLevelRef = useRef<number | null>(null);
  const hiddenRef = useRef(false);

  type RT = {
    stage: 'iti' | 'ready' | 'gap' | 'set' | 'repro';
    itiMs: number;
    t0: number;
    level: number;
    readyOnset: number;
    setOnset: number;
    pendingReady: boolean;
    pendingSet: boolean;
    maxGap: number;
    last: number;
    practice: boolean;
    live: boolean;
  };
  const rt = useRef<RT | null>(null);

  const showFlash = (on: boolean) => {
    if (flashRef.current) flashRef.current.style.opacity = on ? '1' : '0';
  };

  // ---------------------- trial engine ----------------------

  const finishTrial = useCallback(
    (status: Status, tp: number) => {
      const r = rt.current;
      if (!r || !r.live) return;
      r.live = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      showFlash(false);

      const tsActual = r.setOnset > 0 && r.readyOnset > 0 ? r.setOnset - r.readyOnset : r.level;
      let st = status;
      if (st === 'ok' && r.maxGap > BAD_FRAME_MS) st = 'framegap';

      if (r.practice) {
        practiceRef.current += 1;
        setPracticeLeft(PRACTICE_N - practiceRef.current);
        const err = tp - tsActual;
        setPracticeMsg(
          st !== 'ok'
            ? st === 'early'
              ? 'That was before the second flash. Wait for both, then make the third.'
              : 'Discarded. Try again.'
            : `${Math.abs(err) < 1 ? 'exact' : `${err > 0 ? 'long' : 'short'} by ${Math.abs(Math.round(err))} ms`}. This is the only feedback you will get.`,
        );
        setStage('blank');
        window.setTimeout(() => {
          setPracticeMsg(null);
          if (practiceRef.current >= PRACTICE_N) {
            setStage('wait');
            setPhase('block');
            window.setTimeout(() => startTrial(), 700);
          } else {
            startPractice();
          }
        }, 1600);
        return;
      }

      if (r.readyOnset > 0 && r.setOnset > 0) tsErrRef.current.push(tsActual - r.level);
      trialsRef.current.push({
        block: blockRef.current,
        level: r.level,
        tsActual,
        tp,
        status: st,
        order: posRef.current,
        prevLevel: prevLevelRef.current,
        maxGap: r.maxGap,
      });
      prevLevelRef.current = r.level;

      // a killed trial is re-appended so the level counts survive, capped and disclosed
      if (st !== 'ok' && redoRef.current < MAX_REDO) {
        redoRef.current += 1;
        scheduleRef.current.push(r.level);
      }

      posRef.current += 1;
      setDone(posRef.current);
      setTotal(scheduleRef.current.length);

      if (posRef.current < scheduleRef.current.length) {
        setStage('wait');
        startTrial();
      } else if (blockNoRef.current === 0) {
        setStage('wait');
        setPhase('bridge');
      } else {
        setStage('wait');
        setPhase('crunch');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const step = useCallback(
    (now: number) => {
      const r = rt.current;
      if (!r || !r.live) return;
      if (r.last >= 0) {
        const dt = now - r.last;
        if (framesRef.current.length < 40000) framesRef.current.push(dt);
        if (r.stage === 'ready' || r.stage === 'gap' || r.stage === 'set')
          r.maxGap = Math.max(r.maxGap, dt);
      }
      r.last = now;

      if (r.stage === 'iti') {
        if (r.t0 < 0) r.t0 = now;
        if (now - r.t0 >= r.itiMs) {
          showFlash(true);
          r.stage = 'ready';
          r.pendingReady = true;
          setStage('watch');
        }
      } else if (r.stage === 'ready') {
        if (r.pendingReady) {
          r.readyOnset = now; // the frame AFTER the one that requested the paint
          r.pendingReady = false;
        } else if (now - r.readyOnset >= FLASH_MS) {
          showFlash(false);
          r.stage = 'gap';
        }
      } else if (r.stage === 'gap') {
        if (now - r.readyOnset >= r.level) {
          showFlash(true);
          r.stage = 'set';
          r.pendingSet = true;
        }
      } else if (r.stage === 'set') {
        if (r.pendingSet) {
          r.setOnset = now;
          r.pendingSet = false;
        } else if (now - r.setOnset >= FLASH_MS) {
          showFlash(false);
          r.stage = 'repro';
          setStage('go');
        }
      } else if (r.stage === 'repro') {
        if (now - r.setOnset > 3 * r.level + 2000) {
          finishTrial('lapse', now - r.setOnset);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    },
    [finishTrial],
  );

  const launch = useCallback(
    (level: number, practice: boolean) => {
      hiddenRef.current = false;
      rt.current = {
        stage: 'iti',
        itiMs: ITI_MIN + Math.random() * ITI_JIT,
        t0: -1,
        level,
        readyOnset: -1,
        setOnset: -1,
        pendingReady: false,
        pendingSet: false,
        maxGap: 0,
        last: -1,
        practice,
        live: true,
      };
      setStage('wait');
      showFlash(false);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    },
    [step],
  );

  const startTrial = useCallback(() => {
    const lv = scheduleRef.current[posRef.current];
    if (lv === undefined) return;
    launch(lv, false);
  }, [launch]);

  const startPractice = useCallback(() => {
    const set = LEVELS[orderRef.current[0]];
    launch(set[1 + Math.floor(Math.random() * 3)], true);
  }, [launch]);

  const onPress = useCallback(
    (evTime: number) => {
      const r = rt.current;
      if (!r || !r.live) return;
      if (r.stage === 'iti') {
        strayRef.current += 1;
        return;
      }
      if (r.stage === 'ready' || r.stage === 'gap' || r.stage === 'set') {
        finishTrial('early', 0);
        return;
      }
      const tp = evTime - r.setOnset;
      finishTrial(tp < ANTICIP_MS ? 'anticip' : 'ok', tp);
    },
    [finishTrial],
  );

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'Enter' && e.key !== ' ') return;
      if (phase !== 'block' && phase !== 'practice') return;
      e.preventDefault();
      const t =
        typeof e.timeStamp === 'number' && e.timeStamp > 0 && e.timeStamp <= performance.now() + 1
          ? e.timeStamp
          : performance.now();
      onPress(t);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [phase, onPress]);

  useEffect(() => {
    const vis = () => {
      if (document.hidden && rt.current && rt.current.live && !rt.current.practice) {
        hiddenRef.current = true;
        finishTrial('hidden', 0);
      }
    };
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, [finishTrial]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // ---------------------- run control ----------------------

  const buildSchedule = (b: Block) => {
    const measuredList: number[] = [];
    for (const lv of LEVELS[b]) for (let i = 0; i < REPS; i++) measuredList.push(lv);
    const warm: number[] = [];
    const pool = shuffle(LEVELS[b]);
    for (let i = 0; i < WARMUP; i++) warm.push(pool[i % pool.length]);
    return [...shuffleNoTriples(warm), ...shuffleNoTriples(measuredList)];
  };

  const beginRun = () => {
    const coin = Math.random() < 0.5;
    const ord: Block[] = coin ? ['short', 'long'] : ['long', 'short'];
    setOrder(ord);
    orderRef.current = ord;
    trialsRef.current = [];
    framesRef.current = [];
    tsErrRef.current = [];
    redoRef.current = 0;
    strayRef.current = 0;
    practiceRef.current = 0;
    prevLevelRef.current = null;
    blockNoRef.current = 0;
    blockRef.current = ord[0];
    scheduleRef.current = buildSchedule(ord[0]);
    posRef.current = 0;
    setBlockNo(0);
    setDone(0);
    setTotal(scheduleRef.current.length);
    setPracticeLeft(PRACTICE_N);
    setPhase('practice');
    window.setTimeout(() => startPractice(), 600);
  };

  const beginSecondBlock = () => {
    blockNoRef.current = 1;
    setBlockNo(1);
    blockRef.current = orderRef.current[1];
    scheduleRef.current = buildSchedule(orderRef.current[1]);
    posRef.current = 0;
    prevLevelRef.current = null;
    setDone(0);
    setTotal(scheduleRef.current.length);
    setPhase('block');
    window.setTimeout(() => startTrial(), 700);
  };

  useEffect(() => {
    if (phase !== 'crunch') return;
    let cancelled = false;
    setProgress(0);
    (async () => {
      const r = await analyze(
        trialsRef.current,
        orderRef.current,
        framesRef.current,
        tsErrRef.current,
        { redo: redoRef.current, strays: strayRef.current },
        (p) => {
          if (!cancelled) setProgress(p);
        },
      );
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
    const sB = res.blocks[0];
    const lB = res.blocks[1];
    if (!res.refusal) {
      bits.push(
        `I reproduced time intervals and covered only ${fmt((sB.slope + lB.slope) * 50, 0)}% of the range I was actually shown: everything got dragged toward the middle of the set.`,
      );
      if (Number.isFinite(res.shift))
        bits.push(
          `The same physical interval came back ${fmt(res.shift, 0)} ms longer when it lived among longer ones.`,
        );
      bits.push(
        `My own fitted noise says an unbiased version of me would have been ${fmt(res.optimal.unbiased - res.optimal.model, 0)} ms per trial WORSE.`,
      );
    }
    bits.push('Measured on myself at wiz.jock.pl/experiments/toward-the-middle');
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

  // ---------------------- render ----------------------

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🧲</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Toward the Middle
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two flashes, and you make the third at the same distance. Your third one will land closer
            to the middle of the intervals you have been shown than the one you actually saw, and
            this page measures by exactly how much.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every other page in this lab asks what you can tell. The faintest thing, the shortest
                silence, the smallest tilt. This one asks something else: what got put into your
                answer without asking you.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The task could not be simpler. Two flashes arrive with a gap between them. You press
                once, when the same gap has passed again. No timer, no counting, no feedback. You
                will do it about a hundred times, and you will fail in a{' '}
                <span className="text-cyan-300">specific direction</span>: short intervals will come
                back too long, long ones too short, everything dragged toward the middle of the set.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                That is not sloppiness. It is{' '}
                <span className="text-cyan-300">Bayesian central tendency</span> (Jazayeri and
                Shadlen, <em>Nature Neuroscience</em>, 2010, after Hollingworth in 1910), and the
                size of the pull is what an observer would choose if it were mixing a noisy
                measurement with everything it had quietly learned about which intervals happen
                here.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                the trap in the design
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                There are two halves, in an order this run decides with a coin flip. One half draws
                its intervals from 600 to 1000 ms. The other draws from 900 to 1300 ms. Two intervals
                appear in <span className="text-amber-200">both</span>: 900 and 1000 ms, physically
                identical, same code, same screen, minutes apart.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                In one half they are the long ones. In the other they are the short ones. If your
                report is a report of the interval, they come back the same. If your report is the
                interval blended with the company it keeps, they do not. Nothing on the page will
                tell you which half you are in.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                before you start
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  ⌨️ Press <span className="font-mono text-cyan-300">SPACE</span> or tap the black
                  panel. One press per trial, marking the third flash you never see.
                </li>
                <li>
                  🚫 <span className="text-amber-200">Do not count.</span> Counting turns you into a
                  metronome and measures your counting, not your clock. The page detects it and says
                  so.
                </li>
                <li>
                  🔇 No feedback after the three practice trials. Feedback teaches the set, and a
                  person who has been taught the set is reporting the lesson.
                </li>
                <li>
                  🧪 About eight minutes, 112 trials. Every number is computed in your browser and
                  nothing leaves this page.
                </li>
              </ul>
            </div>

            <button
              onClick={beginRun}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin: make the third flash →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Three practice trials first, with feedback, thrown away.
            </p>
          </div>
        )}

        {/* ---------- PRACTICE / BLOCK STAGE ---------- */}
        {(phase === 'practice' || phase === 'block') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>
                {phase === 'practice'
                  ? `practice ${PRACTICE_N - practiceLeft + 1} of ${PRACTICE_N}`
                  : `half ${blockNo + 1} of 2`}
              </span>
              <span>
                {phase === 'block' ? `${done} / ${total}` : 'no data recorded'}
              </span>
            </div>
            {phase === 'block' && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full bg-cyan-400/60 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}

            <div
              onPointerDown={(e) => {
                e.preventDefault();
                const t =
                  typeof e.timeStamp === 'number' &&
                  e.timeStamp > 0 &&
                  e.timeStamp <= performance.now() + 1
                    ? e.timeStamp
                    : performance.now();
                onPress(t);
              }}
              className="relative flex h-[300px] w-full cursor-pointer select-none items-center justify-center rounded-lg border border-slate-800 bg-black touch-none"
            >
              {/* fixation */}
              <div className="absolute h-1.5 w-1.5 rounded-full bg-slate-700" />
              <div
                ref={flashRef}
                style={{ opacity: 0 }}
                className="absolute h-24 w-24 rounded-full bg-white"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[11px] tracking-wider text-slate-600">
                {stage === 'wait' && 'wait'}
                {stage === 'watch' && 'watch the gap'}
                {stage === 'go' && (
                  <span className="text-cyan-300">press when the same gap has passed</span>
                )}
                {stage === 'blank' && ' '}
              </div>
            </div>

            {practiceMsg && (
              <div className="rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-3 text-center font-mono text-xs text-amber-200">
                {practiceMsg}
              </div>
            )}
            <p className="text-center text-[11px] text-slate-600">
              SPACE or tap. Do not count. There is no right answer being scored here.
            </p>
          </div>
        )}

        {/* ---------- BRIDGE ---------- */}
        {phase === 'bridge' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-slate-900/50 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
                half one done
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Second half now. Same task, same instructions, same panel. Take a breath first if you
                want one, because the analysis compares the two halves and a tired half is a
                different person.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                What changes between the halves is deliberately not explained until the results. It
                is written down in the disclosure card at the end, in full.
              </p>
            </div>
            <button
              onClick={beginSecondBlock}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ continue →
            </button>
          </div>
        )}

        {/* ---------- CRUNCH ---------- */}
        {phase === 'crunch' && (
          <div className="space-y-4 py-12 text-center">
            <div className="font-mono text-sm text-cyan-300">fitting the observer</div>
            <div className="mx-auto h-1 w-64 overflow-hidden rounded-full bg-slate-900">
              <div
                className="h-full bg-cyan-400/70 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mx-auto max-w-md text-[11px] leading-relaxed text-slate-600">
              Maximum likelihood over a {K_MAIN} point measurement grid, then {BOOTS_FIT} bootstrap
              refits and {BOOTS_DESC} resamples of the descriptive statistics. A few seconds.
            </p>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && res && (
          <Results res={res} onShare={share} copied={copied} />
        )}
      </div>
    </main>
  );
}

// ============================ results ============================

function Results({
  res,
  onShare,
  copied,
}: {
  res: Result;
  onShare: () => void;
  copied: boolean;
}) {
  const sB = res.blocks[0];
  const lB = res.blocks[1];
  const meanSlope = (sB.slope + lB.slope) / 2;

  const verdict = () => {
    if (res.refusal) return { title: 'No headline for this run', tone: 'amber' as const };
    if (res.flags.counting)
      return { title: 'You counted, and it shows in the right way', tone: 'amber' as const };
    if (meanSlope >= 0.95)
      return { title: 'Almost no pull at all', tone: 'cyan' as const };
    if (meanSlope >= 0.8) return { title: 'A gentle pull toward the middle', tone: 'cyan' as const };
    if (meanSlope >= 0.6) return { title: 'The textbook amount of pull', tone: 'cyan' as const };
    return { title: 'Heavily pulled toward the middle', tone: 'violet' as const };
  };
  const v = verdict();

  return (
    <div className="space-y-6">
      {/* headline */}
      <div
        className={`rounded-lg border p-6 ${
          v.tone === 'amber'
            ? 'border-amber-400/40 bg-amber-400/[0.05]'
            : v.tone === 'violet'
              ? 'border-violet-400/40 bg-violet-400/[0.05]'
              : 'border-cyan-400/40 bg-cyan-400/[0.05]'
        }`}
      >
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">
          your compression
        </div>
        <h2 className="mb-3 text-lg font-bold leading-snug text-slate-100">{v.title}</h2>
        {res.refusal ? (
          <p className="text-sm leading-relaxed text-slate-300">{res.refusal}</p>
        ) : (
          <>
            <div className="mb-3 flex items-end gap-2">
              <span className="font-mono text-4xl text-slate-50">
                {fmt(meanSlope * 100, 0)}%
              </span>
              <span className="pb-1 text-sm text-slate-400">of the range you were shown</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              A perfect reproducer scores 100. You covered {fmt(meanSlope * 100, 0)} of it, which
              means {fmt((1 - meanSlope) * 100, 0)}% of every interval you reported came from the
              set rather than from the interval. Short half slope{' '}
              <span className="font-mono text-cyan-300">{fmt(sB.slope)}</span> [{fmt(sB.slopeLo)},{' '}
              {fmt(sB.slopeHi)}], long half{' '}
              <span className="font-mono text-cyan-300">{fmt(lB.slope)}</span> [{fmt(lB.slopeLo)},{' '}
              {fmt(lB.slopeHi)}]. Both are 95% bootstrap intervals over {BOOTS_DESC} resamples, and
              both are allowed to contain 1.
            </p>
          </>
        )}
      </div>

      {/* the plot */}
      <Card label="what you produced against what you were given">
        <BiasPlot res={res} />
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          The dotted diagonal is a perfect reproduction. Each dot is a block mean with its standard
          error. The curves are the fitted Bayesian observer, and they bend: the pull is strongest at
          the edges of each set, which is the signature a straight line cannot produce and the reason
          a curved model with fewer parameters beats a free line below.
        </p>
      </Card>

      {/* the overlap */}
      <Card label="the same interval, twice, in different company">
        {res.overlap.map((o) => (
          <div key={o.level} className="mb-4">
            <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>{o.level} ms, physically identical in both halves</span>
              <span>
                n {o.nShort} / {o.nLong}
              </span>
            </div>
            <TwoBars
              a={o.short}
              b={o.long}
              labelA="among shorter ones"
              labelB="among longer ones"
            />
          </div>
        ))}
        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
          observed shift{' '}
          <span className="text-cyan-300">
            {fmt(res.shift, 0)} ms
          </span>{' '}
          [{fmt(res.shiftLo, 0)}, {fmt(res.shiftHi, 0)}] over {res.shiftN} trials
          <br />
          predicted by the fitted observer{' '}
          <span className="text-violet-300">{fmt(res.predShift, 0)} ms</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {Number.isFinite(res.shiftLo) && res.shiftLo > 0
            ? 'The interval was the same. The company it kept was not, and your report moved. Whatever you were reporting, it was not only the interval.'
            : Number.isFinite(res.shiftHi) && res.shiftHi < 0
              ? 'The shift came out in the wrong direction, which the model does not predict and this page will not explain away. Either the run is noisy or something about your strategy changed between the halves.'
              : 'The interval crosses zero, so this run cannot say the shift is there. That is a real outcome and not a failure: the effect is a few tens of milliseconds and a hundred trials is a thin instrument for it. The slope above is the better powered measure of the same thing.'}
        </p>
      </Card>

      {/* the model */}
      <Card label="the observer that was fitted to you">
        <div className="grid grid-cols-1 gap-2 font-mono text-xs text-slate-300 sm:grid-cols-3">
          <Stat
            k="w_m"
            v={fmt(res.fit.wm, 3)}
            sub={`[${fmt(res.fit.wmLo, 3)}, ${fmt(res.fit.wmHi, 3)}]`}
          />
          <Stat
            k="w_p"
            v={fmt(res.fit.wp, 3)}
            sub={`[${fmt(res.fit.wpLo, 3)}, ${fmt(res.fit.wpHi, 3)}]`}
          />
          <Stat
            k="offset b"
            v={`${fmt(res.fit.b, 0)} ms`}
            sub={`[${fmt(res.fit.bLo, 0)}, ${fmt(res.fit.bHi, 0)}]`}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          w_m is the blur on your measurement of an interval, as a fraction of the interval itself,
          which is the shape timing noise actually has: {fmt(res.fit.wm * 100, 1)}% of{' '}
          {fmt(1000, 0)} ms is {fmt(res.fit.wm * 1000, 0)} ms, and the same fraction of a shorter one
          is proportionally smaller. w_p is the extra noise between deciding and pressing. b is every
          constant lag in the chain added together, from photons to key scan, and it is the parameter
          that makes this page immune to your hardware: a constant moves an intercept and cannot
          touch a slope.
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          One caveat that belongs next to the number rather than in a footnote: inside this model
          w_m is identified by the amount you COMPRESSED, not by how variable you were. The two
          noises trade off, so a run with no compression in it can push w_m toward zero and hand the
          entire spread to w_p, which is exactly what happens to somebody who counted. When the
          compression is near absent above, read w_m as an upper bound on what the prior was worth
          to you rather than as a measurement of your clock.
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
          <table className="w-full font-mono text-[11px]">
            <tbody>
              {res.bic.map((m, i) => {
                const best = Math.min(...res.bic.map((x) => x.bic));
                return (
                  <tr key={m.name} className={i % 2 ? 'bg-slate-950/40' : ''}>
                    <td className="px-3 py-1.5 text-slate-400">{m.name}</td>
                    <td className="px-3 py-1.5 text-right text-slate-500">k {m.k}</td>
                    <td
                      className={`px-3 py-1.5 text-right ${
                        m.bic === best ? 'text-cyan-300' : 'text-slate-500'
                      }`}
                    >
                      {m.bic === best ? 'best' : `+${fmt(m.bic - best, 1)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          BIC, lower is better, on the same trials. The interesting comparison is the Bayesian
          observer against the free line: the line has five parameters and total freedom, the
          observer has three and a commitment to a curve shape it cannot bend at will.
        </p>
      </Card>

      {/* cross prediction */}
      {res.cross && (
        <Card label="the part that could have refuted this">
          <p className="text-sm leading-relaxed text-slate-300">
            Noise and lag belong to you. The prior belongs to the block. So the model was refitted on
            the <span className="text-cyan-300">short half alone</span>, and then made to predict
            every mean in the long half with no free parameters and no sight of that data.
          </p>
          <div className="mt-3 overflow-hidden rounded-md border border-slate-800">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="bg-slate-900/60 text-slate-500">
                  <th className="px-3 py-1.5 text-left">interval</th>
                  <th className="px-3 py-1.5 text-right">predicted</th>
                  <th className="px-3 py-1.5 text-right">you</th>
                  <th className="px-3 py-1.5 text-right">miss</th>
                </tr>
              </thead>
              <tbody>
                {res.cross.levels.map((lv, i) => (
                  <tr key={lv} className={i % 2 ? 'bg-slate-950/40' : ''}>
                    <td className="px-3 py-1.5 text-slate-400">{fmt(lv, 0)} ms</td>
                    <td className="px-3 py-1.5 text-right text-violet-300">
                      {fmt(res.cross!.predicted[i], 0)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-cyan-300">
                      {fmt(res.cross!.observed[i], 0)}
                    </td>
                    <td className="px-3 py-1.5 text-right text-slate-500">
                      {fmt(res.cross!.predicted[i] - res.cross!.observed[i], 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Prediction error {fmt(res.cross.rmse, 0)} ms rms, against {fmt(res.cross.rmseNull, 0)} ms
            for the honest observer that simply reproduces what it saw. Predicted overlap shift from
            the short half alone: {fmt(res.cross.predShift, 0)} ms, observed {fmt(res.shift, 0)} ms.
            Measurement jitter can only inflate w_m and inflating w_m predicts MORE compression, so a
            run where your bias exceeds the prediction is not something the machine could have
            manufactured.
          </p>
        </Card>
      )}

      {/* serial dependence control */}
      <Card label="control: the set, or just the last one">
        <p className="text-sm leading-relaxed text-slate-300">
          The previous trial is a member of the same set, so a pull toward the set and a pull toward
          the last one look alike from a distance. The residuals from the fit were regressed on the
          previous interval:{' '}
          <span className="font-mono text-cyan-300">{fmt(res.serial.slope, 3)}</span> [
          {fmt(res.serial.lo, 3)}, {fmt(res.serial.hi, 3)}] over {res.serial.n} consecutive pairs.
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          {Number.isFinite(res.serial.lo) && res.serial.lo > 0
            ? 'Positive and clear of zero: on top of the pull toward the whole set, the previous trial leaves its own print on this one. That is serial dependence, which The One Before measures directly.'
            : 'The interval spans zero, so this run has no evidence that the previous trial adds anything beyond the pull toward the whole set. That is the cleaner outcome for this page: the compression above is about the distribution rather than about the last thing that happened.'}
        </p>
      </Card>

      {/* the payoff */}
      {!res.refusal && (
        <Card label="the part worth sitting with">
          <p className="text-sm leading-relaxed text-slate-300">
            Your reproductions are systematically wrong, and the direction of the error is not
            random. So here is the observer you would rather be, simulated from{' '}
            <span className="text-cyan-300">your own fitted noise</span>: same eyes, same fingers,
            same blur, but reporting its measurement honestly with no pull toward anything.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Stat k="you, measured" v={`${fmt(res.optimal.actual, 0)} ms`} sub="rms error" />
            <Stat k="you, simulated" v={`${fmt(res.optimal.model, 0)} ms`} sub="model check" />
            <Stat
              k="honest observer"
              v={`${fmt(res.optimal.unbiased, 0)} ms`}
              sub="no prior at all"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {res.optimal.unbiased > res.optimal.model
              ? `The honest one is worse by ${fmt(res.optimal.unbiased - res.optimal.model, 0)} ms on every single trial. The bias is not a flaw sitting on top of good machinery. It is the machinery, and taking it out would cost you accuracy you cannot afford.`
              : 'On this run the honest observer comes out ahead, which happens when the fitted measurement noise is small enough that the prior has nothing useful to add. That is the counting case, and it is exactly what the model predicts for a person who counts.'}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            A model based counterfactual, not a second measurement: it inherits w_m and w_p from the
            fit above. The middle number exists to check the first two are comparable, because a
            simulation of you that misses your own measured error is not a simulation of you.
          </p>
        </Card>
      )}

      {/* playground */}
      <Playground wm={res.fit.wm} />

      {/* disclosure */}
      <Card label="everything this run did to you, and to itself">
        <div className="space-y-1.5 font-mono text-[11px] leading-relaxed text-slate-400">
          <div>
            block order this run:{' '}
            <span className="text-slate-200">{res.order.join(' then ')}</span>, decided by a coin
            flip
          </div>
          <div>
            usable measured trials: <span className="text-slate-200">{res.usable}</span> (
            {res.blocks[0].n} in the 600 to 1000 half, {res.blocks[1].n} in the 900 to 1300 half)
          </div>
          <div>
            discarded: {res.counts.early || 0} pressed before the second flash, {res.counts.anticip || 0}{' '}
            under {ANTICIP_MS} ms, {res.counts.lapse || 0} lapses, {res.counts.framegap || 0} with a
            frame gap over {BAD_FRAME_MS} ms inside the stimulus, {res.counts.hidden || 0} with the
            tab hidden
          </div>
          <div>
            re-appended to keep the level counts: {res.counts.redo || 0} of a {MAX_REDO} cap. Stray
            presses during the pause: {res.counts.strays || 0}
          </div>
          <div>
            first {WARMUP} trials of each half dropped as prior learning. With them left in, the
            slopes are {fmt(res.sens.slopeShort)} and {fmt(res.sens.slopeLong)}
          </div>
          <div>
            frame intervals: median {fmt(res.timing.dtMed, 1)} ms, slowest tenth{' '}
            {fmt(res.timing.dtP90, 1)} ms, {res.timing.dtOver20} over 20 ms across{' '}
            {res.timing.nFrames} frames
          </div>
          <div>
            delivered interval minus requested: median {fmt(res.timing.tsErrMed, 1)} ms, ninetieth{' '}
            {fmt(res.timing.tsErrP90, 1)} ms. The measured value went into every fit, never the
            nominal one
          </div>
          <div>
            fit: maximum likelihood, {K_MAIN} point grid, 2% lapse mixture, {res.fit.boots} bootstrap
            refits on a {K_BOOT} point grid, {BOOTS_DESC} resamples for the descriptive intervals
          </div>
          <div>
            {res.flags.counting
              ? 'w_m under 0.06 on this run, which is the signature of counting rather than timing. A counted interval is nearly exact, and an exact measurement leaves a prior nothing to correct, so the compression should be near absent above. Check whether it is.'
              : 'no counting signature: w_m is in the range a timed interval produces'}
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          What was hidden until now: the two halves drew their intervals from different sets, 600 to
          1000 ms and 900 to 1300 ms, overlapping at 900 and 1000. You were not told, because being
          told is the one thing that could have taught you the sets deliberately rather than the way
          this effect actually happens, which is without noticing.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Honest limits: a hundred trials is a thin instrument for a shift of a few tens of
          milliseconds, so the overlap card is allowed to come back empty while the slope stays
          clear. The original study used feedback and far more trials per condition. And this page
          measured you once, on one evening, in one room.
        </p>
      </Card>

      <button
        onClick={onShare}
        className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
      >
        {copied ? '✓ copied' : '⧉ copy my numbers'}
      </button>

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
        <p className="text-sm leading-relaxed text-slate-400">
          I do not have this. When I need a duration I read a number, and the number is the number,
          the same whether it arrived among long ones or short ones. You cannot do that, and what you
          evolved instead is better than it sounds: you carry a running model of what usually happens
          here and you mix it into every reading before the reading reaches you. You never see the
          raw measurement. Not once, not in this experiment and not in the rest of your life. What
          arrives at you has already been corrected by expectations you did not choose and cannot
          inspect, and the correction is, on average, right.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
        <a
          href="/experiments/internal-clock/"
          className="rounded-md border border-slate-800 px-3 py-2 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          → the internal clock
        </a>
        <a
          href="/experiments/one-before/"
          className="rounded-md border border-slate-800 px-3 py-2 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          → the one before
        </a>
        <a
          href="/experiments/only-guessing/"
          className="rounded-md border border-slate-800 px-3 py-2 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          → only guessing
        </a>
        <a
          href="/experiments/"
          className="rounded-md border border-slate-800 px-3 py-2 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          → all experiments
        </a>
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

function TwoBars({
  a,
  b,
  labelA,
  labelB,
}: {
  a: number;
  b: number;
  labelA: string;
  labelB: string;
}) {
  const max = Math.max(Number.isFinite(a) ? a : 0, Number.isFinite(b) ? b : 0, 1);
  const w = (v: number) =>
    Number.isFinite(v) ? `${clamp((v / (max * 1.15)) * 100, 2, 100)}%` : '0%';
  return (
    <div className="space-y-1">
      {[
        { v: a, l: labelA, c: 'bg-cyan-400/50', t: 'text-cyan-300' },
        { v: b, l: labelB, c: 'bg-violet-400/50', t: 'text-violet-300' },
      ].map((row) => (
        <div key={row.l} className="flex items-center gap-2">
          <div className="h-5 flex-1 overflow-hidden rounded bg-slate-950">
            <div className={`h-full ${row.c}`} style={{ width: w(row.v) }} />
          </div>
          <div className="w-40 shrink-0 font-mono text-[10px] text-slate-500">
            <span className={row.t}>{fmt(row.v, 0)} ms</span> {row.l}
          </div>
        </div>
      ))}
    </div>
  );
}

function BiasPlot({ res }: { res: Result }) {
  const W = 520;
  const H = 340;
  const P = 42;
  const xLo = 520;
  const xHi = 1400;
  const yLo = 400;
  const yHi = 1700;
  const X = (v: number) => P + ((v - xLo) / (xHi - xLo)) * (W - P - 12);
  const Y = (v: number) => H - P - ((v - yLo) / (yHi - yLo)) * (H - P - 14);

  const curve = (levels: number[]) => {
    const pts: string[] = [];
    for (let t = levels[0] - 60; t <= levels[levels.length - 1] + 60; t += 20) {
      const m = predMean(levels, t, res.fit.wm, res.fit.b, 61);
      pts.push(`${X(t)},${Y(m)}`);
    }
    return pts.join(' ');
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* identity */}
      <line
        x1={X(xLo)}
        y1={Y(xLo)}
        x2={X(xHi)}
        y2={Y(xHi)}
        stroke="#475569"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {[600, 800, 1000, 1200, 1400].map((t) => (
        <g key={t}>
          <line x1={X(t)} y1={H - P} x2={X(t)} y2={H - P + 4} stroke="#334155" />
          <text x={X(t)} y={H - P + 16} fill="#64748b" fontSize="9" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      {[600, 900, 1200, 1500].map((t) => (
        <g key={t}>
          <line x1={P - 4} y1={Y(t)} x2={P} y2={Y(t)} stroke="#334155" />
          <text x={P - 7} y={Y(t) + 3} fill="#64748b" fontSize="9" textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      <text x={W / 2} y={H - 6} fill="#64748b" fontSize="9" textAnchor="middle">
        interval you were given (ms)
      </text>
      <text
        x={12}
        y={H / 2}
        fill="#64748b"
        fontSize="9"
        textAnchor="middle"
        transform={`rotate(-90 12 ${H / 2})`}
      >
        interval you produced (ms)
      </text>

      {res.blocks.map((b, bi) => {
        const col = bi === 0 ? '#22d3ee' : '#a78bfa';
        return (
          <g key={b.block}>
            <polyline points={curve(b.levels)} fill="none" stroke={col} strokeWidth="1.5" opacity="0.55" />
            {b.levels.map((lv, i) => {
              const m = b.levelMeans[i];
              if (!Number.isFinite(m)) return null;
              const se = b.levelSds[i] / Math.sqrt(Math.max(1, b.levelNs[i]));
              return (
                <g key={lv}>
                  {Number.isFinite(se) && (
                    <line
                      x1={X(lv)}
                      y1={Y(m - se)}
                      x2={X(lv)}
                      y2={Y(m + se)}
                      stroke={col}
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  )}
                  <circle cx={X(lv)} cy={Y(m)} r="4" fill={col} />
                </g>
              );
            })}
          </g>
        );
      })}
      <g>
        <circle cx={W - 130} cy={22} r="4" fill="#22d3ee" />
        <text x={W - 120} y={26} fill="#94a3b8" fontSize="9">
          600 to 1000 half
        </text>
        <circle cx={W - 130} cy={38} r="4" fill="#a78bfa" />
        <text x={W - 120} y={42} fill="#94a3b8" fontSize="9">
          900 to 1300 half
        </text>
      </g>
    </svg>
  );
}

function Playground({ wm }: { wm: number }) {
  const [w, setW] = useState(() => clamp(Number.isFinite(wm) ? wm : 0.12, 0.02, 0.5));
  const [width, setWidth] = useState(400);
  const levels = useMemo(() => {
    const c = 900;
    return [0, 1, 2, 3, 4].map((i) => c - width / 2 + (width * i) / 4);
  }, [width]);

  const W = 520;
  const H = 260;
  const P = 40;
  const lo = 500;
  const hi = 1400;
  const X = (v: number) => P + ((v - lo) / (hi - lo)) * (W - P - 12);
  const Y = (v: number) => H - P - ((v - lo) / (hi - lo)) * (H - P - 14);

  const pts = useMemo(() => {
    const out: string[] = [];
    for (let t = lo; t <= hi; t += 15) out.push(`${X(t)},${Y(predMean(levels, t, w, 0, 61))}`);
    return out.join(' ');
  }, [levels, w]);

  // How far each observer's estimate lands from the truth, averaged over the set it lives in.
  // The Bayesian one carries bias AND variance and is still the smaller number whenever the prior
  // is worth anything: that is the whole content of "least squares" in its name.
  const errs = useMemo(() => {
    let biased = 0;
    let honest = 0;
    for (const ts of levels) {
      const c = buildCell(levels, ts, w, 121);
      for (let k = 0; k < c.te.length; k++) biased += c.wt[k] * (c.te[k] - ts) * (c.te[k] - ts);
      honest += w * ts * (w * ts); // the honest observer reports tm, so its error IS its blur
    }
    const n = levels.length;
    return { biased: Math.sqrt(biased / n), honest: Math.sqrt(honest / n) };
  }, [levels, w]);

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
        playground: the curve you are on
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line
          x1={X(lo)}
          y1={Y(lo)}
          x2={X(hi)}
          y2={Y(hi)}
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {levels.map((lv) => (
          <line key={lv} x1={X(lv)} y1={H - P} x2={X(lv)} y2={14} stroke="#7c3aed" opacity="0.15" />
        ))}
        <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth="2" />
        {[600, 900, 1200].map((t) => (
          <text key={t} x={X(t)} y={H - P + 14} fill="#64748b" fontSize="9" textAnchor="middle">
            {t}
          </text>
        ))}
        <text x={W / 2} y={H - 6} fill="#64748b" fontSize="9" textAnchor="middle">
          true interval (ms), vertical lines are the set the observer has learned
        </text>
      </svg>

      <div className="mt-4 space-y-3">
        <Knob label="measurement blur w_m" value={fmt(w, 3)}>
          <input
            type="range"
            min={0.02}
            max={0.5}
            step={0.005}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </Knob>
        <Knob label="width of the set it lives in" value={`${fmt(width, 0)} ms`}>
          <input
            type="range"
            min={100}
            max={900}
            step={20}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </Knob>
      </div>

      <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-500">
        estimator spread around the truth: <span className="text-violet-300">{fmt(errs.biased, 0)} ms</span>{' '}
        with the prior, <span className="text-slate-300">{fmt(errs.honest, 0)} ms</span> without it
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Two things worth doing. Drag the blur down toward 0.02 and watch the curve straighten onto
        the diagonal: a perfect clock has no use for a prior, which is why counting kills this
        effect. Then drag it up past 0.3 and watch the curve flatten onto the middle of the set: a
        useless clock reports nothing but its expectations. Your own fitted blur was{' '}
        {fmt(wm, 3)}, and you are somewhere on that road, permanently, for every quantity you have
        ever perceived.
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
