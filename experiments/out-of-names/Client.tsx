'use client';

// OUT OF NAMES  (you can see the difference between two bars you cannot name apart, and the
// ceiling that stops you is not in your eye)
//
// The sixty-eighth piece in this lab, and the one underneath the last one. Neither One Won asked
// what a signal is. This asks what a NAME is, and how many of them your perception can carry at
// once along a single dimension.
//
// THE TASK.
//
// A white bar flashes for a quarter of a second. It is one of a numbered set: four of them, then
// eight, then twelve, all drawn from the same fixed range where the longest is exactly four times
// the shortest. You say which one it was. You are told the answer every trial, you are shown the
// whole set before each block, and the set never changes inside a block. Nothing is hidden, there
// is no trick, and you will still run out.
//
// THE FINDING THIS IS BUILT ON, and half of it is famous for the wrong reason.
//
// Miller's 1956 paper is remembered as "seven plus or minus two" and quoted as a fact about
// short term memory. The first half of it is about something else entirely, and stranger: when
// people label stimuli that vary along ONE dimension, the amount of information that survives the
// labelling stops rising at about two and a half bits, which is six or seven categories, no
// matter how many categories you offer them. Pollack got 2.5 bits for pitch in 1952 and adding
// more tones did not help. Garner got 2.3 for loudness in 1953. Eriksen and Hake got about three
// for line length in 1955. The ceiling moved a little with the dimension and hardly at all with
// the number of names.
//
// So there is a ceiling. This page is about where it lives.
//
// THE OBVIOUS EXPLANATION, and the block that takes it away.
//
// The boring reading is that the ceiling is in the eye. Twelve bars spread over a four to one
// range are 13 percent apart, and if your eyes cannot resolve 13 percent then of course you
// cannot name them, and Miller's ceiling is just an acuity measurement with extra steps.
//
// That has a consequence you can check on the same evening with the same eyes. One block drops
// the naming entirely and shows two bars at once, at the exact step sizes the naming blocks use
// and three finer ones, and asks only which is longer. That is your resolution, measured
// generously: both bars are on the screen at the same time and nothing has to be remembered.
//
// Then the two get compared, and they are not compared by eye. A single noise, in units of
// doublings of length, is fitted to the pairs, and the SAME noise is fitted to your naming.
// Nothing else changes between the two fits. If the ceiling is in the eye the two numbers are
// the same number.
//
// WHAT IS COMMITTED BEFORE THE LAST BLOCK OPENS.
//
// After the naming ladder and the pair block, both fits close and two rivals put an exact number
// on the screen: how often you are about to name the right bar out of sixteen (or twelve, chosen
// from your own ladder so that the block lands where it is informative rather than at a floor or
// a ceiling).
//
//   the eyes' ceiling     computed from the pair block alone, which never saw a name. If your
//                         naming is limited by your resolution, this is your score.
//
//   the names' ceiling    computed from the naming ladder alone, which never saw a pair. If your
//                         naming has its own ceiling, this is your score.
//
// Both are exact expectations of a one parameter model, both are locked before the block runs,
// and both carry their own intervals so that neither gets to win on a lucky fit. The block is
// scored directionally: a verdict needs the observed interval to clear the eyes' interval, not
// merely to land nearer one number than the other. Scoring by nearness is how the previous page
// in this lab nearly shipped a bias, and the fix has stayed.
//
// WHY YOUR SCREEN CANNOT REACH ANY OF THIS, and here it is a theorem rather than an argument.
//
// Every stimulus is a LENGTH RATIO and every number on the results page is in doublings, which is
// log2 of a ratio. A ratio does not care about pixels, device pixel ratio, browser zoom, the size
// of your phone or how far away your face is. Double every length on the page and every number
// here is unchanged, exactly, because the range and the noise scale together and the analysis
// only ever divides one by the other. There is no calibration step because there is nothing to
// calibrate. The pair block and the naming blocks draw from one range on one screen in one
// sitting, so even a display that renders lengths wrong renders them wrong for both sides of the
// comparison.
//
// WHAT THE MEASUREMENT CANNOT DO, and it is measured rather than guessed.
//
// The pair block shows two bars at once. The naming blocks show one bar and ask you to place it
// against a scale you are holding in your head. That is a real difference, and part of any gap
// belongs to memory rather than to naming. So a second, thinner pair condition separates the two
// bars by seven hundred milliseconds, which loads the memory for a single item without asking for
// a scale at all, and its number is printed next to the other two.
//
// And there is a limit this page found in its own simulations rather than in a footnote: with
// these trial counts it resolves a gap of about a factor of two between naming noise and
// resolution noise, and it will usually call a factor of 1.5 no gap at all. A visitor whose names
// are only a little worse than their eyes will be told that nothing separable was found, which is
// the honest sentence and not a null result dressed up.
//
// THE THINGS THAT WOULD QUIETLY RUIN IT.
//
//   . information is the wrong statistic at these counts. The plug in estimate of transmitted
//     information is biased UPWARD by roughly (rows-1)(cols-1)/(2M ln2), which at twelve names
//     and ninety trials is around a whole bit, and the bias GROWS with the number of names, so an
//     uncorrected analysis manufactures exactly the rising curve that the ceiling story denies.
//     Simulation against exact ground truth put the plug in bias at +1.13 bits in a world with no
//     relationship at all. Everything headline here rests on accuracy and on a fitted noise, both
//     of which pool trials instead of asking every cell of the table for its own estimate. The
//     information numbers appear once, corrected two ways, labelled with what they still cost.
//
//   . the range, not the spacing. Every block draws from the identical four to one range, so more
//     names means finer steps and never a wider world. Widening the range with the set size is
//     the classic way to fake a rising ceiling.
//
//   . the frame. Bars jitter in position by a few pixels so that the edge of the stage cannot be
//     used as a ruler.
//
//   . guessing and hammering. A visitor who presses one button, or presses at random, or answers
//     faster than the bar can be seen, is refused with the reason named, and the count of usable
//     trials is checked LAST so that the diagnosis is never "too few trials" when the real answer
//     is "you were not looking".
//
//   . the tab. Trials taken while the tab was hidden are dropped rather than scored.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ============================ constants ============================

// The stimulus range: the longest bar is four times the shortest, which is exactly two doublings.
// Every number on this page is in these units, which is why no screen can reach them.
const RANGE = 2;

const BAR_MS = 250;
const FIX_MS = 340;
const GAP_MS = 700;
const FB_MS = 460;
const ITI = 220;

const LADDER = [4, 8, 12] as const;
const PRACTICE_N = 5;
const PRACTICE_PER = 2;
const PER_STIM: Record<number, number> = { 4: 6, 8: 6, 12: 6 };
const HELD_GRID = [12, 16] as const;
const HELD_TRIALS = 90;
const HELD_TARGET_ACC = 0.7;

// The twelve name step and three finer ones. Every step is a ratio, so this ladder is the same
// ladder on every display.
const STEPS = [2 / 11, 1 / 11, 0.5 / 11, 0.25 / 11];
// Weighted toward the two finest steps on purpose. The 13 percent step is at ceiling for
// everybody, so it buys the page its most quotable sentence and almost no information about
// where the threshold actually is, and the interval on the eyes' prediction is what decides
// whether the last block can separate anything.
const DISC_SIM_PER = [6, 6, 14, 14];
const DISC_SEQ_PER = 6;

const BOOTS = 260;
const SIG_FLOOR = 0.0045;
const LAPSE = 0.02;

// refusal thresholds
const MAX_RMS = 0.35; // doublings; a random presser sits near 0.8, a real visitor near 0.08
const MIN_LABELS_FRAC = 0.34;
const MAX_MACHINE = 0.25;
const MIN_TRIALS_FRAC = 0.7;
const FAST_MS = 180;

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function mean(a: number[]) {
  if (!a.length) return NaN;
  let s = 0;
  for (const v of a) s += v;
  return s / a.length;
}
function shuffleInPlace<T>(a: T[], rnd: () => number) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}
function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function ciOf(v: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = v.slice().sort((a, b) => a - b);
  return [quantile(s, lo), quantile(s, hi)];
}
// Wilson, because a proportion near one has no business carrying a symmetric interval.
function wilson(k: number, n: number): [number, number] {
  if (n === 0) return [NaN, NaN];
  const z = 1.96;
  const p = k / n;
  const d = 1 + (z * z) / n;
  const c = p + (z * z) / (2 * n);
  const h = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  return [clamp((c - h) / d, 0, 1), clamp((c + h) / d, 0, 1)];
}
function erf(x: number) {
  const s = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return s * y;
}
function normCdf(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================ the scale ============================

// Levels are evenly spaced in doublings, never in pixels. Equal ratios mean equal difficulty
// under Weber's law, so a linear spacing would crowd the short end and manufacture a lopsided
// confusion matrix out of the spacing alone.
function levelsOf(n: number): number[] {
  if (n < 2) return [RANGE / 2];
  return Array.from({ length: n }, (_, i) => (i / (n - 1)) * RANGE);
}
function pxOf(u: number, minPx: number) {
  return minPx * Math.pow(2, u);
}

// ============================ the one parameter observer ============================

// One noisy look at the length, in doublings, labelled with the nearest level. It is the ideal
// observer given that noise, which is deliberate: the resolution story deserves the most generous
// possible reading. It also produces the bow effect for free, because the two end categories
// catch everything past them and are therefore easier than the middle.

function pRespGivenStim(n: number, sigma: number): number[][] {
  const x = levelsOf(n);
  const b: number[] = [];
  for (let j = 0; j < n - 1; j++) b.push((x[j] + x[j + 1]) / 2);
  const P: number[][] = [];
  for (let s = 0; s < n; s++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const lo = j === 0 ? 0 : normCdf((b[j - 1] - x[s]) / sigma);
      const hi = j === n - 1 ? 1 : normCdf((b[j] - x[s]) / sigma);
      row.push(Math.max(0, hi - lo));
    }
    P.push(row);
  }
  return P;
}
function accOfModel(n: number, sigma: number) {
  const P = pRespGivenStim(n, sigma);
  let s = 0;
  for (let i = 0; i < n; i++) s += P[i][i];
  return s / n;
}
function miOfChannel(P: number[][]) {
  const S = P.length, R = P[0].length, ps = 1 / S;
  const pr = new Array(R).fill(0);
  for (let s = 0; s < S; s++) for (let j = 0; j < R; j++) pr[j] += ps * P[s][j];
  let mi = 0;
  for (let s = 0; s < S; s++) for (let j = 0; j < R; j++) {
    const p = P[s][j];
    if (p > 1e-15 && pr[j] > 1e-15) mi += ps * p * Math.log2(p / pr[j]);
  }
  return mi;
}
function miOfModel(n: number, sigma: number) {
  return miOfChannel(pRespGivenStim(n, sigma));
}
// The asymptote the model runs into as names are added without limit: the range divided by the
// noise, in bits, less the entropy of a gaussian. This is the number Miller was reporting.
function capacityOf(sigma: number) {
  return Math.log2(RANGE / sigma) - 2.047095585;
}

// ============================ fitting ============================

type Conf = number[][];

function emptyConf(n: number): Conf {
  return Array.from({ length: n }, () => new Array(n).fill(0));
}
function confusionOf(trials: IdTrial[], n: number): Conf {
  const c = emptyConf(n);
  for (const t of trials) c[t.s][t.r]++;
  return c;
}

function golden(ll: (s: number) => number, loG: number, hiG: number) {
  let best = loG, bestV = -Infinity;
  for (let i = 0; i <= 120; i++) {
    const g = loG + ((hiG - loG) * i) / 120;
    const v = ll(Math.exp(g));
    if (v > bestV) { bestV = v; best = g; }
  }
  let step = (hiG - loG) / 120;
  for (let r = 0; r < 30; r++) {
    step /= 2;
    for (const g of [best - step, best + step]) {
      const v = ll(Math.exp(g));
      if (v > bestV) { bestV = v; best = g; }
    }
  }
  return Math.exp(best);
}

// One noise has to describe every set size at once. Fitting each block its own parameter would
// always fit better and would say nothing, because a ceiling is precisely the claim that one
// number covers all of them.
function fitSigmaId(confs: Conf[]): number {
  const ll = (sig: number) => {
    let s = 0;
    for (const conf of confs) {
      const n = conf.length;
      const P = pRespGivenStim(n, sig);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if (conf[i][j] > 0) s += conf[i][j] * Math.log(Math.max(P[i][j], 1e-12));
      }
    }
    return s;
  };
  return golden(ll, Math.log(SIG_FLOOR), Math.log(4));
}

type DiscTrial = { d: number; ok: boolean; mode: 'sim' | 'seq'; rt: number; hidden: boolean };

// Two bars, one noisy sample each, so the difference carries sqrt(2) times the noise. The lapse
// term is fixed rather than fitted: with four levels there is not enough data to buy a second
// parameter, and a free lapse rate eats the very tail the threshold lives in.
function pCorrect(d: number, sigma: number) {
  return LAPSE / 2 + (1 - LAPSE) * normCdf(d / (Math.SQRT2 * sigma));
}
function fitSigmaDisc(trials: DiscTrial[]): number {
  if (!trials.length) return NaN;
  const ll = (sig: number) => {
    let s = 0;
    for (const t of trials) {
      const p = clamp(pCorrect(t.d, sig), 1e-6, 1 - 1e-6);
      s += t.ok ? Math.log(p) : Math.log(1 - p);
    }
    return s;
  };
  return golden(ll, Math.log(0.0015), Math.log(2));
}

// ============================ information, with its cost printed ============================

function entropyOf(counts: number[], total: number) {
  let s = 0;
  for (const c of counts) if (c > 0) { const p = c / total; s -= p * Math.log2(p); }
  return s;
}
function miPlugin(conf: Conf): number {
  const S = conf.length, R = conf[0].length;
  let M = 0;
  for (const row of conf) for (const v of row) M += v;
  if (M === 0) return 0;
  const rows = conf.map((r) => r.reduce((a, b) => a + b, 0));
  const cols = new Array(R).fill(0);
  for (let s = 0; s < S; s++) for (let j = 0; j < R; j++) cols[j] += conf[s][j];
  const flat: number[] = [];
  for (const row of conf) for (const v of row) flat.push(v);
  return entropyOf(rows, M) + entropyOf(cols, M) - entropyOf(flat, M);
}
// Miller 1955, with the correction driven by OCCUPIED cells rather than the nominal size of the
// table. A confusion matrix that lives on its diagonal has far fewer live cells than rows times
// columns, and the textbook (S-1)(R-1) form over corrects it straight into the floor: measured at
// nine tenths of a bit too low in simulation before this was fixed.
function miMillerMadow(conf: Conf): number {
  let M = 0;
  for (const row of conf) for (const v of row) M += v;
  if (M === 0) return 0;
  const R = conf[0].length;
  let mS = 0, mR = 0, mSR = 0;
  for (const row of conf) if (row.reduce((a, b) => a + b, 0) > 0) mS++;
  for (let j = 0; j < R; j++) { let c = 0; for (let s = 0; s < conf.length; s++) c += conf[s][j]; if (c > 0) mR++; }
  for (const row of conf) for (const v of row) if (v > 0) mSR++;
  return miPlugin(conf) - (mSR - mS - mR + 1) / (2 * M * Math.LN2);
}
type IdTrial = { s: number; r: number; rt: number; n: number; hidden: boolean; prev: number; held: boolean };
// The corrected estimate evaluated on fractions of the data and extrapolated to infinite data,
// which is the only one of the four that stayed near the truth in every simulated world.
function miExtrap(trials: IdTrial[], n: number, rnd: () => number, reps = 16): number {
  const fracs = [1, 0.7, 0.5];
  const xs: number[] = [], ys: number[] = [];
  for (const f of fracs) {
    const k = Math.max(2, Math.round(trials.length * f));
    let acc = 0;
    const r = f === 1 ? 1 : reps;
    for (let it = 0; it < r; it++) {
      const idx = trials.map((_, i) => i);
      shuffleInPlace(idx, rnd);
      acc += miMillerMadow(confusionOf(idx.slice(0, k).map((i) => trials[i]), n));
    }
    xs.push(1 / k);
    ys.push(acc / r);
  }
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  return my - (den > 0 ? num / den : 0) * mx;
}

function rmsOf(trials: IdTrial[], n: number) {
  if (!trials.length) return NaN;
  const x = levelsOf(n);
  let s = 0;
  for (const t of trials) s += (x[t.r] - x[t.s]) ** 2;
  return Math.sqrt(s / trials.length);
}

function resampleId(tr: IdTrial[], n: number, rnd: () => number): IdTrial[] {
  const by: IdTrial[][] = Array.from({ length: n }, () => []);
  for (const t of tr) by[t.s].push(t);
  const out: IdTrial[] = [];
  for (const g of by) for (let i = 0; i < g.length; i++) if (g.length) out.push(g[Math.floor(rnd() * g.length)]);
  return out;
}
function resampleDisc(tr: DiscTrial[], rnd: () => number): DiscTrial[] {
  const by = new Map<number, DiscTrial[]>();
  for (const t of tr) {
    if (!by.has(t.d)) by.set(t.d, []);
    by.get(t.d)!.push(t);
  }
  const out: DiscTrial[] = [];
  for (const g of by.values()) for (let i = 0; i < g.length; i++) out.push(g[Math.floor(rnd() * g.length)]);
  return out;
}

// ============================ what a block is made of ============================

type IdSpec = { t: 'id'; n: number; s: number; jx: number; jy: number };
type DiscSpec = { t: 'disc'; mode: 'sim' | 'seq'; d: number; base: number; longFirst: boolean; jx: number; jy: number };
type Spec = IdSpec | DiscSpec;

type BlockKind = 'practice' | 'ladder' | 'disc' | 'held';
type Block = {
  kind: BlockKind;
  n: number;
  label: string;
  blurb: string;
  scored: boolean;
  specs: Spec[];
};

function jitter(rnd: () => number) {
  return { jx: Math.round((rnd() - 0.5) * 18), jy: Math.round((rnd() - 0.5) * 30) };
}

// Equal counts per level, shuffled, with no level allowed three times in a row. A run of three
// identical bars invites the visitor to answer from the run rather than the bar.
function idSpecs(n: number, per: number, rnd: () => number): IdSpec[] {
  const pool: number[] = [];
  for (let s = 0; s < n; s++) for (let k = 0; k < per; k++) pool.push(s);
  for (let attempt = 0; attempt < 60; attempt++) {
    shuffleInPlace(pool, rnd);
    let ok = true;
    for (let i = 2; i < pool.length; i++) if (pool[i] === pool[i - 1] && pool[i] === pool[i - 2]) { ok = false; break; }
    if (ok) break;
  }
  return pool.map((s) => ({ t: 'id' as const, n, s, ...jitter(rnd) }));
}

// The pair block draws its base length anywhere in the range that leaves room for the step, so a
// threshold is measured across the whole scale rather than at one favoured length.
function discSpecs(rnd: () => number): DiscSpec[] {
  const out: DiscSpec[] = [];
  for (const mode of ['sim', 'seq'] as const) {
    STEPS.forEach((d, i) => {
      const per = mode === 'sim' ? DISC_SIM_PER[i] : DISC_SEQ_PER;
      for (let k = 0; k < per; k++) {
        out.push({ t: 'disc', mode, d, base: rnd() * (RANGE - d), longFirst: rnd() < 0.5, ...jitter(rnd) });
      }
    });
  }
  return shuffleInPlace(out, rnd);
}

function buildPlan(rnd: () => number): Block[] {
  const blocks: Block[] = [
    {
      kind: 'practice',
      n: PRACTICE_N,
      label: 'warm up',
      blurb: 'five names, nothing scored',
      scored: false,
      specs: idSpecs(PRACTICE_N, PRACTICE_PER, rnd),
    },
  ];
  for (const n of LADDER) {
    blocks.push({
      kind: 'ladder',
      n,
      label: `${n} names`,
      blurb: `the same range of bars, cut ${n} ways`,
      scored: true,
      specs: idSpecs(n, PER_STIM[n], rnd),
    });
  }
  blocks.push({
    kind: 'disc',
    n: 2,
    label: 'no names at all',
    blurb: 'two bars, which is longer',
    scored: true,
    specs: discSpecs(rnd),
  });
  return blocks;
}

function heldSizeFor(sigmaId: number): number {
  if (!Number.isFinite(sigmaId) || sigmaId <= SIG_FLOOR * 1.05) return HELD_GRID[HELD_GRID.length - 1];
  let best: number = HELD_GRID[0];
  let bd = Infinity;
  for (const n of HELD_GRID) {
    const d = Math.abs(accOfModel(n, sigmaId) - HELD_TARGET_ACC);
    if (d < bd) { bd = d; best = n; }
  }
  return best;
}

// ============================ the closed fits and the two committed numbers ============================

type Locked = {
  ok: boolean;
  reason: string;
  heldN: number;
  perStim: number;
  sigmaId: number;
  sigmaDisc: number;
  sigmaSeq: number;
  sigmaIdCI: [number, number];
  sigmaDiscCI: [number, number];
  ratio: number;
  ratioCI: [number, number];
  predEyes: number;
  predEyesCI: [number, number];
  predNames: number;
  predNamesCI: [number, number];
  separated: boolean;
  capEyes: number;
  capNames: number;
  perfectLadder: boolean;
  discCeiling: boolean;
};

function lockFits(idTrials: IdTrial[], discTrials: DiscTrial[], rnd: () => number): Locked {
  const usableId = idTrials.filter((t) => !t.hidden && !t.held);
  const usableDisc = discTrials.filter((t) => !t.hidden);
  const sim = usableDisc.filter((t) => t.mode === 'sim');
  const seq = usableDisc.filter((t) => t.mode === 'seq');
  const bad: Locked = {
    ok: false, reason: '', heldN: HELD_GRID[0], perStim: Math.round(HELD_TRIALS / HELD_GRID[0]),
    sigmaId: NaN, sigmaDisc: NaN, sigmaSeq: NaN, sigmaIdCI: [NaN, NaN], sigmaDiscCI: [NaN, NaN],
    ratio: NaN, ratioCI: [NaN, NaN], predEyes: NaN, predEyesCI: [NaN, NaN], predNames: NaN,
    predNamesCI: [NaN, NaN], separated: false, capEyes: NaN, capNames: NaN, perfectLadder: false,
    discCeiling: false,
  };
  if (sim.length < 20 || usableId.length < 60) {
    return { ...bad, reason: 'Too little of the ladder or the pair block survived to close a fit' };
  }

  const fitSizes = [8, 12];
  const fitRows = fitSizes.map((n) => usableId.filter((t) => t.n === n && !t.held));
  const bigTwo = fitSizes.map((n, i) => confusionOf(fitRows[i], n)).filter((_c, i) => fitRows[i].length > 0);
  const liveSizes = fitSizes.filter((_n, i) => fitRows[i].length > 0);
  const sigmaId = fitSigmaId(bigTwo);
  const sigmaDisc = fitSigmaDisc(sim);
  const sigmaSeq = seq.length >= 12 ? fitSigmaDisc(seq) : NaN;

  const perfectLadder = sigmaId <= SIG_FLOOR * 1.05;
  const finest = STEPS[STEPS.length - 1];
  const finestTrials = sim.filter((t) => Math.abs(t.d - finest) < 1e-9);
  const discCeiling = finestTrials.length > 0 && finestTrials.every((t) => t.ok);

  const heldN = heldSizeFor(sigmaId);
  const perStim = Math.max(4, Math.round(HELD_TRIALS / heldN));

  const sIdB: number[] = [], sDB: number[] = [], eB: number[] = [], nB: number[] = [], rB: number[] = [];
  for (let b = 0; b < BOOTS; b++) {
    const sd = fitSigmaDisc(resampleDisc(sim, rnd));
    const si = fitSigmaId(liveSizes.map((n) => confusionOf(resampleId(fitRows[fitSizes.indexOf(n)], n, rnd), n)));
    sIdB.push(si); sDB.push(sd);
    eB.push(accOfModel(heldN, sd));
    nB.push(accOfModel(heldN, si));
    rB.push(si / sd);
  }
  const predEyesCI = ciOf(eB);
  const predNamesCI = ciOf(nB);
  return {
    ok: true,
    reason: '',
    heldN,
    perStim,
    sigmaId,
    sigmaDisc,
    sigmaSeq,
    sigmaIdCI: ciOf(sIdB),
    sigmaDiscCI: ciOf(sDB),
    ratio: sigmaId / sigmaDisc,
    ratioCI: ciOf(rB),
    predEyes: accOfModel(heldN, sigmaDisc),
    predEyesCI,
    predNames: accOfModel(heldN, sigmaId),
    predNamesCI,
    separated: predNamesCI[1] < predEyesCI[0],
    capEyes: capacityOf(sigmaDisc),
    capNames: capacityOf(sigmaId),
    perfectLadder,
    discCeiling,
  };
}

// ============================ the results ============================

type Stat = { m: number; ci: [number, number]; n: number };

type RungRow = {
  n: number;
  trials: number;
  acc: number;
  accCI: [number, number];
  rms: number;
  rmsCI: [number, number];
  predEyesAcc: number;
  predNamesAcc: number;
  mi: number;
  miPlug: number;
  labelsUsed: number;
};

type DiscRow = { d: number; k: number; n: number; p: number; ci: [number, number]; mode: 'sim' | 'seq' };

type Quality = {
  ok: boolean;
  reason: string;
  detail: string;
  totalTrials: number;
  usedTrials: number;
  hidden: number;
  machine: number;
  labelsUsed: number;
  labelsOffered: number;
  worstRms: number;
  medianRt: number;
};

type Verdict = 'names' | 'eyes' | 'nocall' | 'unseparated';

type Result = {
  quality: Quality;
  locked: Locked;
  rungs: RungRow[];
  held: RungRow | null;
  heldConf: Conf | null;
  heldPred: number[][] | null;
  disc: DiscRow[];
  verdict: Verdict;
  bow: { rank: number; acc: number; pred: number }[];
  assim: Stat | null;
  effNames: number;
  effNamesEyes: number;
  seqCap: number;
};

function qualityOf(idTrials: IdTrial[], discTrials: DiscTrial[], plannedId: number): Quality {
  const hidden = idTrials.filter((t) => t.hidden).length + discTrials.filter((t) => t.hidden).length;
  const used = idTrials.filter((t) => !t.hidden);
  const rts = used.map((t) => t.rt).sort((a, b) => a - b);
  const machine = used.length ? used.filter((t) => t.rt < FAST_MS).length / used.length : 0;
  const labelsOffered = used.length ? Math.max(...used.map((t) => t.n)) : 0;
  const big = used.filter((t) => t.n === labelsOffered);
  const labelsUsed = new Set(big.map((t) => t.r)).size;
  const worstRms = big.length ? rmsOf(big, labelsOffered) : NaN;
  const base: Quality = {
    ok: true, reason: '', detail: '',
    totalTrials: idTrials.length + discTrials.length,
    usedTrials: used.length,
    hidden,
    machine,
    labelsUsed,
    labelsOffered,
    worstRms,
    medianRt: rts.length ? rts[Math.floor(rts.length / 2)] : NaN,
  };
  // Ordered so the diagnosis is right. Every branch below empties the usable set as a side
  // effect, so the count of usable trials is checked last and never gets to answer for the
  // others.
  if (labelsOffered >= 8 && labelsUsed < Math.max(3, Math.floor(labelsOffered * MIN_LABELS_FRAC))) {
    return { ...base, ok: false, reason: 'you only used a few of the names', detail: `Out of ${labelsOffered} names on offer, ${labelsUsed} of them were ever pressed. A ceiling on how many names you can carry cannot be measured from someone who did not try to carry them.` };
  }
  if (Number.isFinite(worstRms) && worstRms > MAX_RMS) {
    return { ...base, ok: false, reason: 'your answers were unrelated to the bar', detail: `Your labels landed ${worstRms.toFixed(2)} doublings away from the bar on average. Pressing at random gives about 0.82 and looking at the screen gives about 0.08. This page will not score a run that sits at the random end.` };
  }
  if (machine > MAX_MACHINE) {
    return { ...base, ok: false, reason: 'the answers came in faster than the bar could be seen', detail: `${Math.round(machine * 100)} percent of your answers arrived under ${FAST_MS} ms after the bar left the screen.` };
  }
  if (used.length < plannedId * MIN_TRIALS_FRAC) {
    return { ...base, ok: false, reason: 'too few usable trials', detail: `${used.length} of ${plannedId} naming trials survived. Most of the losses are trials taken while the tab was in the background, which are dropped rather than scored.` };
  }
  return base;
}

function rungOf(trials: IdTrial[], n: number, locked: Locked, rnd: () => number): RungRow {
  return rungOfTrials(trials.filter((t) => !t.hidden && !t.held && t.n === n), n, locked, rnd);
}

function rungOfTrials(use: IdTrial[], n: number, locked: Locked, rnd: () => number): RungRow {
  const k = use.filter((t) => t.r === t.s).length;
  const rmsB: number[] = [];
  for (let b = 0; b < 200; b++) rmsB.push(rmsOf(resampleId(use, n, rnd), n));
  const conf = confusionOf(use, n);
  return {
    n,
    trials: use.length,
    acc: use.length ? k / use.length : NaN,
    accCI: wilson(k, use.length),
    rms: rmsOf(use, n),
    rmsCI: ciOf(rmsB),
    predEyesAcc: Number.isFinite(locked.sigmaDisc) ? accOfModel(n, locked.sigmaDisc) : NaN,
    predNamesAcc: Number.isFinite(locked.sigmaId) ? accOfModel(n, locked.sigmaId) : NaN,
    mi: miExtrap(use, n, rnd),
    miPlug: miPlugin(conf),
    labelsUsed: new Set(use.map((t) => t.r)).size,
  };
}

function overlaps(a: [number, number], b: [number, number]) {
  return a[0] <= b[1] && b[0] <= a[1];
}

function analyse(idTrials: IdTrial[], discTrials: DiscTrial[], locked: Locked, plannedId: number): Result {
  const rnd = mulberry32(0x0f1e2d3c);
  const quality = qualityOf(idTrials, discTrials, plannedId);
  const rungs = LADDER.map((n) => rungOf(idTrials, n, locked, rnd));
  // The held out block can legitimately use a set size the ladder already used, so it is
  // identified by its flag and never by its size.
  const heldOnly = idTrials.filter((t) => !t.hidden && t.held);
  const held = heldOnly.length >= 20 ? rungOfTrials(heldOnly, locked.heldN, locked, rnd) : null;
  const heldConf = held ? confusionOf(heldOnly, locked.heldN) : null;
  const heldPred = held && Number.isFinite(locked.sigmaId) ? pRespGivenStim(locked.heldN, locked.sigmaId) : null;

  const disc: DiscRow[] = [];
  for (const mode of ['sim', 'seq'] as const) {
    for (const d of STEPS) {
      const g = discTrials.filter((t) => !t.hidden && t.mode === mode && Math.abs(t.d - d) < 1e-9);
      if (!g.length) continue;
      const k = g.filter((t) => t.ok).length;
      disc.push({ d, k, n: g.length, p: k / g.length, ci: wilson(k, g.length), mode });
    }
  }

  let verdict: Verdict = 'nocall';
  if (held && locked.ok) {
    if (!locked.separated) verdict = 'unseparated';
    else if (locked.ratioCI[0] > 1 && held.accCI[1] < locked.predEyesCI[0] && overlaps(held.accCI, locked.predNamesCI)) verdict = 'names';
    else if (overlaps(held.accCI, locked.predEyesCI) && locked.ratioCI[0] <= 1) verdict = 'eyes';
  }

  // The bow: the two end categories are easier because everything past them has nowhere else to
  // go. The model predicts this without being asked to, which is the cheapest check on it here.
  const bow: { rank: number; acc: number; pred: number }[] = [];
  if (held && heldPred) {
    for (let s = 0; s < locked.heldN; s++) {
      const g = heldOnly.filter((t) => t.s === s);
      bow.push({ rank: s, acc: g.length ? g.filter((t) => t.r === s).length / g.length : NaN, pred: heldPred[s][s] });
    }
  }

  // What the previous bar did to this one. Assimilation is the best documented deviation from
  // the one parameter story, and it is measured here rather than argued about.
  let assim: Stat | null = null;
  const big = idTrials.filter((t) => !t.hidden && t.n >= 8 && t.prev >= 0);
  // prev is the level index of the bar before this one inside the same block, or -1 at a start.
  if (big.length >= 40) {
    const pts = big.map((t) => {
      const x = levelsOf(t.n);
      return { dx: x[t.prev] - x[t.s], err: x[t.r] - x[t.s] };
    });
    const slope = (p: typeof pts) => {
      const mx = mean(p.map((q) => q.dx)), my = mean(p.map((q) => q.err));
      let num = 0, den = 0;
      for (const q of p) { num += (q.dx - mx) * (q.err - my); den += (q.dx - mx) ** 2; }
      return den > 0 ? num / den : NaN;
    };
    const bs: number[] = [];
    for (let b = 0; b < 300; b++) {
      const r = pts.map(() => pts[Math.floor(rnd() * pts.length)]);
      bs.push(slope(r));
    }
    assim = { m: slope(pts), ci: ciOf(bs), n: pts.length };
  }

  return {
    quality,
    locked,
    rungs,
    held,
    heldConf,
    heldPred,
    disc,
    verdict,
    bow,
    assim,
    effNames: Number.isFinite(locked.capNames) ? Math.pow(2, locked.capNames) : NaN,
    effNamesEyes: Number.isFinite(locked.capEyes) ? Math.pow(2, locked.capEyes) : NaN,
    seqCap: Number.isFinite(locked.sigmaSeq) ? capacityOf(locked.sigmaSeq) : NaN,
  };
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'crunch' | 'result';
type TrialState = 'fix' | 'show' | 'gap' | 'show2' | 'answer' | 'feedback';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [tState, setTState] = useState<TrialState>('fix');
  const [fb, setFb] = useState<{ correct: boolean; right: number } | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  const [lockedView, setLockedView] = useState<Locked | null>(null);
  const [minPx, setMinPx] = useState(64);
  const [tick, setTick] = useState(0);

  const rndRef = useRef<() => number>(mulberry32(1));
  const idRef = useRef<IdTrial[]>([]);
  const discRef = useRef<DiscTrial[]>([]);
  const specsRef = useRef<Spec[]>([]);
  const iRef = useRef(0);
  const prevRef = useRef(-1);
  const onsetRef = useRef(0);
  const hiddenRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const answerRef = useRef<(v: number) => void>(() => {});
  const lockedRef = useRef<Locked | null>(null);
  const plannedRef = useRef(0);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  // The stage is sized after mount, never during render: this page is a static export and a
  // width read at first paint is a hydration mismatch waiting to happen.
  useEffect(() => {
    const set = () => {
      const w = Math.min(360, Math.max(240, window.innerWidth - 44));
      setMinPx(Math.round(w * 0.185));
    };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  useEffect(() => {
    const onVis = () => { if (document.hidden) hiddenRef.current = true; };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const begin = useCallback(() => {
    const rnd = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    rndRef.current = rnd;
    const p = buildPlan(rnd);
    idRef.current = [];
    discRef.current = [];
    lockedRef.current = null;
    plannedRef.current = p.filter((b) => b.scored).reduce((a, b) => a + b.specs.filter((s) => s.t === 'id').length, 0) + HELD_TRIALS;
    setPlan(p);
    setBlockIdx(0);
    setRes(null);
    setLockedView(null);
    setPhase('bridge');
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase('crunch');
    window.setTimeout(() => {
      const locked = lockedRef.current ?? lockFits(idRef.current, discRef.current, mulberry32(7));
      const out = analyse(idRef.current, discRef.current, locked, plannedRef.current);
      setRes(out);
      if (typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>).__trials = {
          naming: idRef.current,
          pairs: discRef.current,
          locked,
          result: out,
        };
      }
      setPhase('result');
    }, 40);
  }, [clearTimers]);

  // After the pair block both fits close, the last block's size is chosen from the visitor's own
  // ladder, and the two rival numbers go on the screen before it opens.
  const closeFits = useCallback(() => {
    const locked = lockFits(idRef.current, discRef.current, rndRef.current);
    lockedRef.current = locked;
    setLockedView(locked);
    const n = locked.heldN;
    const per = locked.perStim;
    setPlan((p) => [
      ...p,
      {
        kind: 'held',
        n,
        label: `${n} names, nothing left to adjust`,
        blurb: 'the block both stories already have a number for',
        scored: true,
        specs: idSpecs(n, per, rndRef.current),
      },
    ]);
  }, []);

  const nextTrial = useCallback(() => {
    const specs = specsRef.current;
    if (iRef.current >= specs.length) {
      const b = plan[blockIdx];
      if (b && b.kind === 'disc') closeFits();
      if (blockIdx + 1 >= plan.length && (!b || b.kind === 'held')) {
        finish();
        return;
      }
      setBlockIdx((v) => v + 1);
      setPhase('bridge');
      return;
    }
    hiddenRef.current = document.hidden;
    setFb(null);
    setTState('fix');
    const spec = specs[iRef.current];
    after(FIX_MS, () => {
      setTState('show');
      onsetRef.current = performance.now();
      if (spec.t === 'disc' && spec.mode === 'seq') {
        after(BAR_MS, () => {
          setTState('gap');
          after(GAP_MS, () => {
            setTState('show2');
            after(BAR_MS, () => {
              onsetRef.current = performance.now();
              setTState('answer');
            });
          });
        });
      } else {
        after(BAR_MS, () => {
          onsetRef.current = performance.now();
          setTState('answer');
        });
      }
    });
  }, [after, blockIdx, closeFits, finish, plan]);

  const startBlock = useCallback(() => {
    const b = plan[blockIdx];
    if (!b) return;
    specsRef.current = b.specs;
    iRef.current = 0;
    prevRef.current = -1;
    setDone(0);
    setPhase('run');
    setTick((v) => v + 1);
  }, [blockIdx, plan]);

  useEffect(() => {
    if (phase !== 'run') return;
    nextTrial();
    // nextTrial is intentionally re-created per block; the trial loop drives itself from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, tick]);

  const record = useCallback(
    (value: number) => {
      const specs = specsRef.current;
      const spec = specs[iRef.current];
      if (!spec) return;
      const rt = performance.now() - onsetRef.current;
      const b = plan[blockIdx];
      const hid = hiddenRef.current || document.hidden;
      let correct = false;
      let right = 0;
      if (spec.t === 'id') {
        correct = value === spec.s;
        right = spec.s;
        if (b && b.scored) {
          idRef.current.push({
            s: spec.s,
            r: value,
            rt,
            n: spec.n,
            hidden: hid,
            prev: prevRef.current,
            held: b.kind === 'held',
          });
        }
        prevRef.current = spec.s;
      } else {
        // value 0 means the first or upper bar, 1 means the second or lower one
        const said = value === 0;
        correct = said === spec.longFirst;
        right = spec.longFirst ? 0 : 1;
        if (b && b.scored) {
          discRef.current.push({ d: spec.d, ok: correct, mode: spec.mode, rt, hidden: hid });
        }
      }
      setFb({ correct, right });
      setTState('feedback');
      iRef.current += 1;
      setDone(iRef.current);
      after(FB_MS + ITI, () => nextTrial());
    },
    [after, blockIdx, nextTrial, plan],
  );
  answerRef.current = record;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimers();
        setPhase('intro');
        return;
      }
      if (phase !== 'run' || tState !== 'answer') return;
      const spec = specsRef.current[iRef.current];
      if (!spec) return;
      if (spec.t === 'id') {
        if (spec.n > 10) return;
        const d = e.key === '0' ? 10 : Number(e.key);
        if (Number.isFinite(d) && d >= 1 && d <= spec.n) answerRef.current(d - 1);
      } else {
        if (e.key === 'ArrowUp' || e.key === '1') answerRef.current(0);
        if (e.key === 'ArrowDown' || e.key === '2') answerRef.current(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearTimers, phase, tState]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const block = plan[blockIdx] ?? null;
  const spec = phase === 'run' ? specsRef.current[iRef.current] ?? null : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && block && spec && (
        <Stage
          block={block}
          spec={spec}
          state={tState}
          fb={fb}
          minPx={minPx}
          done={done}
          total={specsRef.current.length}
          onAnswer={(v) => answerRef.current(v)}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#127991;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Out Of Names</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A bar flashes. You say which one it was. Add more names and your score stops improving,
            and this page measures whether the thing that stopped it is your eyes.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} minPx={minPx} />}

        {phase === 'bridge' && block && (
          <Bridge
            block={block}
            index={blockIdx}
            minPx={minPx}
            locked={block.kind === 'held' ? lockedView : null}
            onGo={startBlock}
          />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              counting what survived the labelling
            </div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div className="h-full w-2/3 animate-pulse bg-cyan-400/60" />
            </div>
          </div>
        )}

        {phase === 'result' && res && <Results res={res} minPx={minPx} onAgain={begin} />}
      </div>
    </main>
  );
}

// ============================ shared bits of chrome ============================

function Bar({ u, minPx, jx, jy }: { u: number; minPx: number; jx: number; jy: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-[10px] rounded-sm bg-slate-100"
      style={{ width: pxOf(u, minPx), transform: `translate(calc(-50% + ${jx}px), calc(-50% + ${jy}px))` }}
      aria-hidden
    />
  );
}

function Scale({ n, minPx }: { n: number; minPx: number }) {
  const x = levelsOf(n);
  return (
    <div className="space-y-[3px]">
      {x.map((u, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-6 shrink-0 text-right font-mono text-[10px] text-slate-500">{i + 1}</div>
          <div className="h-[7px] rounded-sm bg-slate-400/80" style={{ width: pxOf(u, minPx * 0.62) }} />
        </div>
      ))}
    </div>
  );
}

function Card({ tone, label, children }: { tone: 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate'; label: string; children: ReactNode }) {
  const border = {
    cyan: 'border-cyan-400/25 bg-cyan-400/[0.04]',
    emerald: 'border-emerald-400/25 bg-emerald-400/[0.04]',
    amber: 'border-amber-400/25 bg-amber-400/[0.04]',
    violet: 'border-violet-400/25 bg-violet-400/[0.04]',
    rose: 'border-rose-400/25 bg-rose-400/[0.04]',
    slate: 'border-slate-800 bg-slate-900/40',
  }[tone];
  const text = {
    cyan: 'text-cyan-300/90',
    emerald: 'text-emerald-300/90',
    amber: 'text-amber-300/90',
    violet: 'text-violet-300/90',
    rose: 'text-rose-300/90',
    slate: 'text-slate-500',
  }[tone];
  return (
    <div className={`rounded-lg border p-5 ${border}`}>
      <div className={`mb-3 font-mono text-xs uppercase tracking-wider ${text}`}>{label}</div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-800/70 py-1.5 last:border-0">
      <div className="text-xs text-slate-500">{k}</div>
      <div className="shrink-0 font-mono text-xs text-slate-300">{v}</div>
    </div>
  );
}

function pct(v: number, dp = 0) {
  return Number.isFinite(v) ? `${(v * 100).toFixed(dp)}%` : 'n/a';
}
function ciPct(c: [number, number]) {
  return Number.isFinite(c[0]) ? `95% ${(c[0] * 100).toFixed(0)} to ${(c[1] * 100).toFixed(0)}` : '';
}
function dbl(v: number, dp = 3) {
  return Number.isFinite(v) ? v.toFixed(dp) : 'n/a';
}
function ratioPct(sigma: number) {
  // a noise of s doublings is a length ratio of 2^s, which is the friendlier way to say it
  return Number.isFinite(sigma) ? `${((Math.pow(2, sigma) - 1) * 100).toFixed(1)}%` : 'n/a';
}

// ============================ intro ============================

function Intro({ onStart, minPx }: { onStart: () => void; minPx: number }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          A white bar flashes for a quarter of a second. It is one of a numbered set, and you say
          which one it was. Four names to start with, then eight, then twelve, all cut from the same
          range of lengths where the longest is exactly four times the shortest.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You see the whole set before every block. You are told the right answer after every
          trial. Nothing is hidden and there is no trick in it. You will still run out.
        </p>
        <div className="my-4 flex justify-center rounded-md border border-slate-800 bg-slate-950/70 p-4">
          <Scale n={8} minPx={minPx} />
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Miller wrote this down in 1956 and it is the famous paper nobody quotes correctly. Seven
          plus or minus two gets repeated as a fact about memory. The first half of that paper is
          about something stranger: label anything that varies along ONE dimension and the amount
          that survives the labelling stops rising at about two and a half bits, and handing people
          more names does not move it.
        </p>
      </div>

      <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-rose-300/90">the block that could kill it</div>
        <p className="text-sm leading-relaxed text-slate-300">
          There is a boring reading of that ceiling: twelve bars over a four to one range are 13
          percent apart, and if your eyes cannot resolve 13 percent then the ceiling is an acuity
          measurement wearing a hat.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So one block takes the names away. Two bars at once, no scale to remember, one question:
          which is longer. At the same step the twelve name block uses and three finer ones, most of the trials spent on the fine end where your threshold actually is. That is
          your resolution, measured as generously as it can be measured, and it is the number the
          rest of the page has to beat.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/90">
          two numbers committed before the last block opens
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          One noise, in doublings of length, gets fitted to your naming and separately to your
          pairs. Nothing else differs between the two fits. Then both of them name, out loud and in
          advance, how often you are about to get the last block right.
        </p>
        <div className="mt-3 space-y-2">
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">the ceiling is your eyes</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              Computed from the pair block, which never saw a name. If naming is limited by
              resolution, this is your score.
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">the ceiling is your names</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              Computed from the naming ladder, which never saw a pair. If naming has a ceiling of
              its own, this is your score.
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Both carry their own intervals, so neither gets to win on a lucky fit, and the block is
          scored by which interval it clears rather than which number it lands nearer. Scoring by
          nearness is how the last page in this lab nearly shipped a bias.
        </p>
      </div>

      <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/90">why your screen cannot reach this</div>
        <p className="text-sm leading-relaxed text-slate-300">
          Every bar is a length RATIO and every number below is in doublings, which is log2 of a
          ratio. Double every length on this page and not one result changes, exactly, because the
          range and the noise scale together and the analysis only ever divides one by the other.
          Phone, monitor, browser zoom, how far away you are sitting: none of it can reach a number
          here. There is no calibration step because there is nothing to calibrate.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">the rules</div>
        <p className="text-xs leading-relaxed text-slate-500">
          Six blocks, about twelve minutes, the first unscored. Tap a number, or use the number keys
          when there are ten names or fewer. Escape aborts at any time. Bars jitter a few pixels so
          the edge of the stage cannot be used as a ruler. Trials taken while this tab was in the
          background are dropped rather than scored, and a run that was pressed at random, or on one
          button, or faster than a bar can be seen, is refused with the reason named.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        start
      </button>

      <p className="text-center text-xs text-slate-600">
        Everything runs in your browser. Nothing is recorded. Nothing leaves the page.
      </p>
    </div>
  );
}

// ============================ bridge ============================

function Bridge({
  block,
  index,
  minPx,
  locked,
  onGo,
}: {
  block: Block;
  index: number;
  minPx: number;
  locked: Locked | null;
  onGo: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
        <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/80">
          block {index + 1} . {block.label}
        </div>
        <div className="mt-1 font-mono text-[11px] text-slate-600">{block.blurb}</div>

        {block.kind === 'disc' ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              No names in this one. Two bars, and you say which is longer. Most of the time both are
              on the screen at once, one above the other. Sometimes they arrive one after the other
              with a gap, which asks your memory to hold a single bar rather than a whole scale.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Some of the differences are the ones the twelve name block was using. Some are four
              times finer. Guess when you cannot tell.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {block.n} bars, one at a time, and you name which one it was. Study the set first: it
              does not change inside the block, and the shortest and longest are the same two bars
              in every block of this page.
            </p>
            <div className="my-4 flex justify-center rounded-md border border-slate-800 bg-slate-950/70 p-4">
              <Scale n={block.n} minPx={minPx} />
            </div>
            {block.kind === 'practice' && (
              <p className="text-sm leading-relaxed text-slate-400">
                Nothing here is scored. It exists so the first minute of learning where the buttons
                are does not land inside the measurement.
              </p>
            )}
          </>
        )}
      </div>

      {block.kind === 'held' && locked && <LockedCard locked={locked} />}

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        go
      </button>
    </div>
  );
}

function LockedCard({ locked }: { locked: Locked }) {
  if (!locked.ok) {
    return (
      <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.05] p-5 text-xs leading-relaxed text-amber-200/90">
        {locked.reason}. The last block will still run, but there is nothing locked for it to be
        compared against.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.05] p-5">
      <div className="mb-3 font-mono text-xs uppercase tracking-wider text-emerald-300/90">closed, and two numbers before it opens</div>
      <p className="text-sm leading-relaxed text-slate-300">
        The ladder and the pair block are shut. Your pairs put your resolution at{' '}
        <span className="font-mono text-emerald-200">{ratioPct(locked.sigmaDisc)}</span> of a length
        and your naming puts your labelling noise at{' '}
        <span className="font-mono text-emerald-200">{ratioPct(locked.sigmaId)}</span>. The last
        block has {locked.heldN} names, chosen from your own ladder so that it lands where it can
        tell the two apart instead of on a floor or a ceiling.
      </p>
      <div className="mt-4 space-y-2">
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">the ceiling is your eyes</div>
            <div className="font-mono text-lg text-cyan-200">{pct(locked.predEyes)}</div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-400">
            From the pair block alone, {ciPct(locked.predEyesCI)}. This is your score if naming
            costs nothing your eyes were not already paying.
          </div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">the ceiling is your names</div>
            <div className="font-mono text-lg text-amber-200">{pct(locked.predNames)}</div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-400">
            From the naming ladder alone, {ciPct(locked.predNamesCI)}. One noise had to cover both
            the eight name block and the twelve name block, so it had nowhere to hide.
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        {locked.separated
          ? `They disagree by ${Math.round(Math.abs(locked.predEyes - locked.predNames) * 100)} points and their intervals do not touch, so this block can separate them.`
          : 'Their intervals overlap, which means your two ceilings are too close for this block to separate. That outcome gets printed as itself rather than dressed up as a finding.'}
      </p>
    </div>
  );
}

// ============================ stage ============================

function Stage({
  block,
  spec,
  state,
  fb,
  minPx,
  done,
  total,
  onAnswer,
}: {
  block: Block;
  spec: Spec;
  state: TrialState;
  fb: { correct: boolean; right: number } | null;
  minPx: number;
  done: number;
  total: number;
  onAnswer: (v: number) => void;
}) {
  const stageW = Math.round(minPx / 0.185);
  const stageH = spec.t === 'disc' && spec.mode === 'sim' ? 190 : 150;
  const answering = state === 'answer';

  return (
    <div className="fixed inset-0 z-50 flex touch-none select-none flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-5 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {block.label}
        {!block.scored && ' . not scored'}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-900 bg-[#04060a]" style={{ width: stageW, height: stageH }}>
        {state === 'fix' && (
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700" aria-hidden />
        )}
        {spec.t === 'id' && state === 'show' && (
          <Bar u={levelsOf(spec.n)[spec.s]} minPx={minPx} jx={spec.jx} jy={spec.jy} />
        )}
        {spec.t === 'disc' && spec.mode === 'sim' && state === 'show' && (
          <>
            <Bar u={spec.base + (spec.longFirst ? spec.d : 0)} minPx={minPx} jx={spec.jx} jy={-38} />
            <Bar u={spec.base + (spec.longFirst ? 0 : spec.d)} minPx={minPx} jx={spec.jx} jy={38} />
          </>
        )}
        {spec.t === 'disc' && spec.mode === 'seq' && (state === 'show' || state === 'show2') && (
          <Bar
            u={spec.base + ((state === 'show') === spec.longFirst ? spec.d : 0)}
            minPx={minPx}
            jx={spec.jx}
            jy={spec.jy}
          />
        )}
        {spec.t === 'disc' && spec.mode === 'seq' && state === 'gap' && (
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" aria-hidden />
        )}
      </div>

      <div className="mt-3 h-5 font-mono text-[11px]">
        {state === 'feedback' && fb && spec.t === 'id' && (
          <span className={fb.correct ? 'text-emerald-400' : 'text-amber-400'}>
            {fb.correct ? 'yes' : `it was ${fb.right + 1}`}
          </span>
        )}
        {state === 'feedback' && fb && spec.t === 'disc' && (
          <span className={fb.correct ? 'text-emerald-400' : 'text-amber-400'}>{fb.correct ? 'yes' : 'no'}</span>
        )}
        {state !== 'feedback' && !answering && <span className="text-slate-700">watch</span>}
        {answering && (
          <span className="text-slate-600">
            {spec.t === 'id' ? 'which one was it' : spec.mode === 'sim' ? 'which was longer' : 'which was longer'}
          </span>
        )}
      </div>

      <div className="mt-4 w-full" style={{ maxWidth: Math.max(stageW, 300) }}>
        {spec.t === 'id' ? (
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${spec.n > 8 ? Math.ceil(spec.n / 2) : spec.n}, minmax(0, 1fr))` }}>
            {Array.from({ length: spec.n }, (_, i) => (
              <button
                key={i}
                disabled={!answering}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (answering) onAnswer(i);
                }}
                className={`rounded-md border py-3 font-mono text-xs transition ${
                  state === 'feedback' && fb && fb.right === i
                    ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                    : answering
                      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/50 hover:bg-slate-800'
                      : 'border-slate-900 bg-slate-950 text-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                disabled={!answering}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (answering) onAnswer(i);
                }}
                className={`rounded-md border py-4 font-mono text-xs uppercase tracking-wider transition ${
                  state === 'feedback' && fb && fb.right === i
                    ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                    : answering
                      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/50 hover:bg-slate-800'
                      : 'border-slate-900 bg-slate-950 text-slate-700'
                }`}
              >
                {spec.mode === 'sim' ? (i === 0 ? 'upper' : 'lower') : i === 0 ? 'first' : 'second'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7 h-1 w-full max-w-sm overflow-hidden rounded bg-slate-900">
        <div className="h-full bg-slate-600 transition-all" style={{ width: `${clamp((done / Math.max(total, 1)) * 100, 0, 100)}%` }} />
      </div>
      <div className="mt-3 font-mono text-[10px] text-slate-700">
        {done} / {total} . escape aborts
      </div>
    </div>
  );
}

// ============================ plots ============================

// The picture the whole page is for: your score against the number of names, with the curve your
// own eyes predict drawn through it. Where the points fall away from the upper curve and flatten,
// something other than resolution has taken over.
function LadderPlot({ res }: { res: Result }) {
  const W = 560, H = 300, L = 46, B = 40, T = 14, Rp = 14;
  const pts = [...res.rungs.map((r) => ({ ...r, held: false })), ...(res.held ? [{ ...res.held, held: true }] : [])];
  const maxN = Math.max(20, ...pts.map((p) => p.n));
  // The axis is fitted to what actually happened. Nailing it to zero would spend two thirds of
  // the picture on scores nobody produced and flatten the only thing worth looking at.
  const lows = [
    ...pts.map((p) => p.accCI[0]),
    ...[res.locked.sigmaId, res.locked.sigmaDisc].filter(Number.isFinite).map((sg) => accOfModel(maxN, sg)),
  ].filter(Number.isFinite);
  const floor = clamp(Math.floor((Math.min(1, ...lows) - 0.08) * 10) / 10, 0, 0.9);
  const xOf = (n: number) => L + ((Math.log2(n) - 1) / (Math.log2(maxN) - 1)) * (W - L - Rp);
  const yOf = (a: number) => T + (1 - (clamp(a, floor, 1) - floor) / (1 - floor)) * (H - T - B);
  const gridY: number[] = [];
  for (let g = Math.ceil(floor * 10) / 10; g <= 1.0001; g += (1 - floor) / 4) gridY.push(Math.round(g * 100) / 100);

  const curve = (sigma: number) => {
    if (!Number.isFinite(sigma)) return '';
    const d: string[] = [];
    for (let n = 2; n <= maxN; n++) d.push(`${d.length ? 'L' : 'M'}${xOf(n).toFixed(1)},${yOf(accOfModel(n, sigma)).toFixed(1)}`);
    return d.join(' ');
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="score against number of names">
      {gridY.map((g) => (
        <g key={g}>
          <line x1={L} x2={W - Rp} y1={yOf(g)} y2={yOf(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={L - 8} y={yOf(g) + 4} textAnchor="end" fill="#475569" fontSize="10" fontFamily="monospace">
            {Math.round(g * 100)}
          </text>
        </g>
      ))}
      {[2, 4, 8, 12, 16, 20].filter((n) => n <= maxN).map((n) => (
        <text key={n} x={xOf(n)} y={H - B + 16} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace">
          {n}
        </text>
      ))}
      <text x={(W + L) / 2} y={H - 6} textAnchor="middle" fill="#334155" fontSize="10" fontFamily="monospace">
        names on offer
      </text>

      <path d={curve(res.locked.sigmaDisc)} fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />
      <path d={curve(res.locked.sigmaId)} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />

      {pts.map((p) => (
        <g key={`${p.n}-${p.held}`}>
          <line x1={xOf(p.n)} x2={xOf(p.n)} y1={yOf(p.accCI[0])} y2={yOf(p.accCI[1])} stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx={xOf(p.n)} cy={yOf(p.acc)} r={p.held ? 6 : 4} fill={p.held ? '#f472b6' : '#e2e8f0'} />
        </g>
      ))}

    </svg>
  );
}

function Key({ items }: { items: { color: string; text: string; dash?: boolean; dot?: boolean }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
      {items.map((it) => (
        <div key={it.text} className="flex items-center gap-2">
          {it.dot ? (
            <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
          ) : (
            <span className="h-0 w-5" style={{ borderTop: `2px ${it.dash ? 'dashed' : 'solid'} ${it.color}` }} />
          )}
          <span className="font-mono text-[10px] text-slate-400">{it.text}</span>
        </div>
      ))}
    </div>
  );
}

function ConfusionGrid({ conf, pred }: { conf: Conf; pred: number[][] | null }) {
  const n = conf.length;
  const rows = conf.map((r) => r.reduce((a, b) => a + b, 0));
  const cell = Math.max(10, Math.min(24, Math.floor(300 / n)));
  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        <div className="mb-1 font-mono text-[10px] text-slate-600">named &rarr;</div>
        {conf.map((row, i) => (
          <div key={i} className="flex" style={{ gap: 2, marginBottom: 2 }}>
            {row.map((v, j) => {
              const p = rows[i] ? v / rows[i] : 0;
              const expect = pred ? pred[i][j] : null;
              return (
                <div
                  key={j}
                  title={`shown ${i + 1}, named ${j + 1}: ${v} of ${rows[i]}${expect !== null ? ` (model ${(expect * 100).toFixed(0)}%)` : ''}`}
                  style={{
                    width: cell,
                    height: cell,
                    background: i === j ? `rgba(52,211,153,${0.12 + 0.85 * p})` : `rgba(244,114,182,${0.08 + 0.85 * p})`,
                    outline: i === j ? '1px solid rgba(52,211,153,0.35)' : 'none',
                  }}
                />
              );
            })}
          </div>
        ))}
        <div className="mt-1 font-mono text-[10px] text-slate-600">rows are the bar you were shown, shortest at the top</div>
      </div>
    </div>
  );
}

function DiscPlot({ res }: { res: Result }) {
  const W = 560, H = 240, L = 46, B = 40, T = 14, Rp = 14;
  const xs = STEPS.map((d) => Math.log2(d));
  const lo = Math.min(...xs) - 0.4, hi = Math.max(...xs) + 0.4;
  const xOf = (d: number) => L + ((Math.log2(d) - lo) / (hi - lo)) * (W - L - Rp);
  const yOf = (p: number) => T + (1 - (p - 0.4) / 0.62) * (H - T - B);
  const curve = (sigma: number) => {
    if (!Number.isFinite(sigma)) return '';
    const d: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const lg = lo + ((hi - lo) * i) / 80;
      const step = Math.pow(2, lg);
      d.push(`${i ? 'L' : 'M'}${xOf(step).toFixed(1)},${yOf(clamp(pCorrect(step, sigma), 0.4, 1.02)).toFixed(1)}`);
    }
    return d.join(' ');
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="pair block accuracy against step size">
      {[0.5, 0.75, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - Rp} y1={yOf(g)} y2={yOf(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={L - 8} y={yOf(g) + 4} textAnchor="end" fill="#475569" fontSize="10" fontFamily="monospace">
            {Math.round(g * 100)}
          </text>
        </g>
      ))}
      {STEPS.map((d) => (
        <text key={d} x={xOf(d)} y={H - B + 16} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace">
          {((Math.pow(2, d) - 1) * 100).toFixed(1)}%
        </text>
      ))}
      <text x={(W + L) / 2} y={H - 6} textAnchor="middle" fill="#334155" fontSize="10" fontFamily="monospace">
        how much longer the longer bar was
      </text>
      <path d={curve(res.locked.sigmaDisc)} fill="none" stroke="#22d3ee" strokeWidth="2" />
      {Number.isFinite(res.locked.sigmaSeq) && <path d={curve(res.locked.sigmaSeq)} fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 4" />}
      {res.disc.map((r) => (
        <g key={`${r.mode}-${r.d}`}>
          <line x1={xOf(r.d)} x2={xOf(r.d)} y1={yOf(clamp(r.ci[0], 0.4, 1.02))} y2={yOf(clamp(r.ci[1], 0.4, 1.02))} stroke={r.mode === 'sim' ? '#67e8f9' : '#c4b5fd'} strokeWidth="1.5" />
          <circle cx={xOf(r.d)} cy={yOf(clamp(r.p, 0.4, 1.02))} r="4" fill={r.mode === 'sim' ? '#22d3ee' : '#a78bfa'} />
        </g>
      ))}
    </svg>
  );
}

// ============================ results ============================

function verdictLine(res: Result): { tone: 'emerald' | 'cyan' | 'amber'; head: string; body: string } {
  const l = res.locked;
  if (res.verdict === 'names') {
    return {
      tone: 'emerald',
      head: 'the ceiling is not in your eye',
      body: `You scored ${pct(res.held!.acc)} on the ${l.heldN} name block. Your own pairs said ${pct(l.predEyes)} and your interval clears theirs outright, while it sits on top of what your naming noise predicted. The bars were far enough apart for you to see: what ran out was the naming.`,
    };
  }
  if (res.verdict === 'eyes') {
    return {
      tone: 'cyan',
      head: 'no gap this page could resolve',
      body: `You scored ${pct(res.held!.acc)} and your resolution predicted ${pct(l.predEyes)}, which is inside your interval. On this evidence your naming is doing about as well as your eyes allow. That is not proof there is no ceiling above your resolution: this design resolves a gap of roughly a factor of two, and a smaller one reads as nothing.`,
    };
  }
  if (res.verdict === 'unseparated') {
    if (l.perfectLadder) {
      return {
        tone: 'amber',
        head: 'you never ran out',
        body: `Your ladder was close to perfect all the way to twelve names, so there was no ceiling for the fit to find and nothing for the last block to test. You scored ${res.held ? pct(res.held.acc) : 'n/a'} on ${l.heldN}. Whatever your ceiling is, it is above the largest set of names this page is willing to put on a screen, which is a real answer and an unusual one.`,
      };
    }
    if (l.ratioCI[0] > 1) {
      return {
        tone: 'amber',
        head: 'a gap in the noise, but not one the last block could confirm',
        body: `Your naming noise came out ${dbl(l.ratio, 2)} times your resolution noise (95% ${dbl(l.ratioCI[0], 2)} to ${dbl(l.ratioCI[1], 2)}), which is the direction the naming ceiling predicts. But the two committed numbers, ${pct(l.predEyes)} and ${pct(l.predNames)}, came out with overlapping intervals, so the last block was not able to separate them and it does not get to confirm anything. You scored ${res.held ? pct(res.held.acc) : 'n/a'}. Read that ratio as suggestive rather than settled: it also runs a few percent high, for the reason under the pair block.`,
      };
    }
    return {
      tone: 'cyan',
      head: 'your naming and your eyes came out the same size',
      body: `Your labelling noise (${dbl(l.sigmaId)} doublings) and your resolution noise (${dbl(l.sigmaDisc)}) landed on top of each other, ratio ${dbl(l.ratio, 2)} with an interval that includes one, so both stories predicted the same score (${pct(l.predEyes)} against ${pct(l.predNames)}) and the last block had nothing to choose between. You scored ${res.held ? pct(res.held.acc) : 'n/a'}. On this evidence naming cost you nothing your eyes were not already paying.`,
    };
  }
  const tail =
    l.ratioCI[0] > 1
      ? ` Your naming noise did come out ${dbl(l.ratio, 2)} times your resolution noise (95% ${dbl(l.ratioCI[0], 2)} to ${dbl(l.ratioCI[1], 2)}), which is the direction a naming ceiling predicts, and it is the better powered of the two tests here. Take it as the finding and the last block as a shrug rather than a contradiction.`
      : ' Your naming noise and your resolution noise also came out within sampling distance of each other, so nothing on this page separated them.';
  return {
    tone: 'amber',
    head: 'the last block landed between the two',
    body: `You scored ${res.held ? pct(res.held.acc) : 'n/a'} against ${pct(l.predEyes)} from your eyes and ${pct(l.predNames)} from your naming, and the interval did not clear either one, so neither rival gets the block.${tail}`,
  };
}

function Results({ res, minPx, onAgain }: { res: Result; minPx: number; onAgain: () => void }) {
  const q = res.quality;
  if (!q.ok) {
    return (
      <div className="space-y-5">
        <Card tone="rose" label="this run is not scored">
          <p className="text-sm leading-relaxed text-slate-300">{q.reason}.</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{q.detail}</p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Nothing is being hidden. A ceiling measured on a run like this would be a number about
            the run rather than about you, and printing it anyway is how pages like this get
            believed for the wrong reason.
          </p>
        </Card>
        <button
          onClick={onAgain}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 py-3 font-mono text-xs uppercase tracking-wider text-slate-400 transition hover:bg-slate-800"
        >
          run it again
        </button>
      </div>
    );
  }

  const l = res.locked;
  const v = verdictLine(res);
  const twelve = res.rungs.find((r) => r.n === 12);

  return (
    <div className="space-y-5">
      <Card tone={v.tone} label={v.head}>
        <p className="text-sm leading-relaxed text-slate-200">{v.body}</p>
        {res.held && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">eyes said</div>
              <div className="mt-1 font-mono text-xl text-cyan-200">{pct(l.predEyes)}</div>
            </div>
            <div className="rounded-md border border-slate-700 bg-slate-950 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">you scored</div>
              <div className="mt-1 font-mono text-xl text-slate-100">{pct(res.held.acc)}</div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">naming said</div>
              <div className="mt-1 font-mono text-xl text-amber-200">{pct(l.predNames)}</div>
            </div>
          </div>
        )}
      </Card>

      <Card tone="slate" label="how many names you can actually carry">
        <p className="text-sm leading-relaxed text-slate-300">
          Add names without limit and the model runs into a ceiling: the range divided by your
          noise. That number is what Miller was reporting, and here are both of yours.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-md border border-amber-400/20 bg-amber-400/[0.04] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">your naming</div>
            <div className="mt-1 font-mono text-2xl text-amber-200">{dbl(l.capNames, 2)} bits</div>
            <div className="mt-1 text-xs text-slate-400">about {res.effNames.toFixed(1)} names that do any work</div>
          </div>
          <div className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.04] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">your eyes</div>
            <div className="mt-1 font-mono text-2xl text-cyan-200">{dbl(l.capEyes, 2)} bits</div>
            <div className="mt-1 text-xs text-slate-400">about {res.effNamesEyes.toFixed(1)} bars you can tell apart</div>
          </div>
        </div>
        <div className="mt-4 space-y-0.5">
          <Row k="labelling noise, in doublings of length" v={`${dbl(l.sigmaId)} (${ratioPct(l.sigmaId)} of a bar)`} />
          <Row k="resolution noise, both bars at once" v={`${dbl(l.sigmaDisc)} (${ratioPct(l.sigmaDisc)})`} />
          <Row k="resolution noise, bars seven tenths of a second apart" v={Number.isFinite(l.sigmaSeq) ? `${dbl(l.sigmaSeq)} (${ratioPct(l.sigmaSeq)})` : 'too few trials'} />
          <Row k="naming noise divided by resolution noise" v={`${dbl(l.ratio, 2)} times, 95% ${dbl(l.ratioCI[0], 2)} to ${dbl(l.ratioCI[1], 2)}`} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Miller&apos;s own table put pitch at 2.5 bits, loudness at 2.3 and line length at about 3, and
          the ceiling barely moved when he handed people more names. The bits here are a ratio of
          your range to your noise, so they belong to this range and are not a score anyone else
          can be ranked against.
        </p>
      </Card>

      <Card tone="slate" label="the ladder">
        <LadderPlot res={res} />
        <Key
          items={[
            { color: '#22d3ee', text: 'what your eyes alone predict' },
            { color: '#fbbf24', text: 'what your naming noise predicts', dash: true },
            { color: '#f472b6', text: 'the held out block', dot: true },
          ]}
        />
        <div className="mt-3 space-y-0.5">
          {[...res.rungs, ...(res.held ? [res.held] : [])].map((r, i) => (
            <Row
              key={`${r.n}-${i}`}
              k={`${r.n} names${res.held && r === res.held ? ' (held out)' : ''}, ${r.trials} trials`}
              v={`${pct(r.acc)} right, ${ciPct(r.accCI)}, off by ${dbl(r.rms)} doublings`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The two curves are not fitted to these points. Each comes from one number measured
          somewhere else on this page, and the cyan one never saw a name at all.
        </p>
      </Card>

      {res.heldConf && res.held && (
        <Card tone="slate" label="where the answers actually went">
          <div className="flex justify-center">
            <ConfusionGrid conf={res.heldConf} pred={res.heldPred} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Errors that land next door are a precision problem. Errors that land anywhere are a
            different problem, and this page never sees them: your average miss was{' '}
            <span className="font-mono text-slate-100">{dbl(res.held.rms)}</span> doublings, which
            is {(res.held.rms / (RANGE / (l.heldN - 1))).toFixed(2)} of one step. You were not
            confused about which bar you saw. You were imprecise about it, in one direction, by
            about one name.
          </p>
          {res.bow.length > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The ends are easier than the middle: {pct(mean([res.bow[0].acc, res.bow[res.bow.length - 1].acc]))} on the
              shortest and longest bars against {pct(mean(res.bow.slice(1, -1).map((b) => b.acc)))} in
              between. That is the bow effect, and the one parameter model predicts it without being
              asked, because the two end categories catch everything past them and the middle ones
              are squeezed from both sides. It predicted {pct(mean([res.bow[0].pred, res.bow[res.bow.length - 1].pred]))} and{' '}
              {pct(mean(res.bow.slice(1, -1).map((b) => b.pred)))}.
            </p>
          )}
        </Card>
      )}

      <Card tone="cyan" label="the block with no names in it">
        <DiscPlot res={res} />
        <Key
          items={[
            { color: '#22d3ee', text: 'both bars at once', dot: true },
            { color: '#a78bfa', text: 'one after the other', dot: true },
          ]}
        />
        <div className="mt-3 space-y-0.5">
          {res.disc.filter((r) => r.mode === 'sim').map((r) => (
            <Row key={r.d} k={`${((Math.pow(2, r.d) - 1) * 100).toFixed(1)}% longer, both at once`} v={`${r.k} of ${r.n} right`} />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The widest step here is exactly the gap between two neighbours in a twelve name block.
          You got it right {pct(mean(res.disc.filter((r) => r.mode === 'sim' && Math.abs(r.d - STEPS[0]) < 1e-9).map((r) => r.p)))} of
          the time with both bars on the screen. In the twelve name block, the same physical
          difference, you named the right bar {twelve ? pct(twelve.acc) : 'n/a'} of the time.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The curve through these points assumes you slip on 2 percent of trials for reasons that
          have nothing to do with seeing. That term is fixed rather than fitted, because four step
          sizes cannot pay for a second parameter, and it has a measured consequence: against
          simulated visitors who never slipped, this fit came back about 7 percent sharp. That
          makes the cyan prediction on every plot above slightly harder to beat, which is the safe
          direction, and it is why the noise ratio is reported as a description here and never as
          the verdict.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The violet series is the same question with the two bars seven tenths of a second apart,
          which loads memory for a single bar without asking for a scale.{' '}
          {Number.isFinite(res.seqCap)
            ? `It puts your ceiling at ${dbl(res.seqCap, 2)} bits, against ${dbl(l.capNames, 2)} for naming and ${dbl(l.capEyes, 2)} for seeing. It is the thinnest measurement on this page, twenty four trials, and its job is only to say whether plain memory closes the gap.`
            : 'Too few of those trials survived to fit anything to.'}
        </p>
      </Card>

      <Card tone="violet" label="information, and what it costs to estimate">
        <div className="space-y-0.5">
          {[...res.rungs, ...(res.held ? [res.held] : [])].map((r, i) => (
            <Row
              key={`mi-${r.n}-${i}`}
              k={`${r.n} names: log2 of ${r.n} is ${Math.log2(r.n).toFixed(2)} bits`}
              v={`${dbl(r.mi, 2)} got through (raw count says ${dbl(r.miPlug, 2)})`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          This is the statistic Miller reported and the one this page refuses to lead with. The
          plug in estimate of transmitted information is biased UPWARD by roughly the number of
          rows times the number of columns over twice the trial count, which is nearly a whole bit
          at twelve names and ninety trials, and the bias GROWS with the number of names. An
          uncorrected analysis manufactures a rising curve out of nothing at all.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The corrected column applies the occupancy correction and then extrapolates it to
          infinite data across fractions of your own trials. Against simulated ground truth it was
          the only one of four estimators that stayed near the truth in every world, and it still
          reads about a tenth of a bit high here. That residual is why the headline of this page is
          a proportion and a fitted noise rather than a number of bits.
        </p>
      </Card>

      {res.assim && (
        <Card tone="slate" label="what the last bar did to this one">
          <p className="text-sm leading-relaxed text-slate-300">
            Your answer was pulled{' '}
            <span className="font-mono text-slate-100">{(res.assim.m * 100).toFixed(1)}%</span> of
            the way toward the bar you saw immediately before it, 95% {(res.assim.ci[0] * 100).toFixed(1)} to{' '}
            {(res.assim.ci[1] * 100).toFixed(1)}, over {res.assim.n} trials.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            A positive number is assimilation, and it is the best documented crack in the story the
            model on this page tells, because a fixed set of category boundaries cannot produce it.
            Stewart, Brown and Chater argued in 2005 that there are no absolute categories at all
            and that people judge each item against the last one. This page cannot settle that.
            Nothing above changes if it is true: a ceiling is still a ceiling whether the labels are
            absolute or borrowed from the previous trial.
          </p>
        </Card>
      )}

      <Card tone="slate" label="what this cannot tell you">
        <p className="text-sm leading-relaxed text-slate-300">
          The pair block shows two bars at once. The naming blocks show one and ask you to place it
          against a scale in your head. Part of any gap belongs to memory rather than to naming, and
          the sequential pair condition is here to size that, thinly.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The comparison also assumes the same noise describes a bar seen alone and a bar seen next
          to another one. If looking at two bars together is genuinely a different and better
          measurement than looking at one, part of the gap is that and not a ceiling. There is no
          number of trials that fixes it, only a different experiment.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          And a limit found in this page&apos;s own simulations rather than reasoned about: with these
          counts it resolves a gap of about a factor of two between naming noise and resolution
          noise, and it calls a factor of 1.5 no gap at all in most runs. In a simulated world where
          the eyes really were the whole ceiling, it wrongly claimed a naming ceiling 4 percent of
          the time, which is what a 95 percent interval is supposed to cost.
        </p>
      </Card>

      <QualityCard q={q} />

      <Playground minPx={minPx} sigmaId={l.sigmaId} sigmaDisc={l.sigmaDisc} />

      <Card tone="slate" label="sources">
        <div className="space-y-1 text-xs leading-relaxed text-slate-500">
          <div>Miller, The magical number seven, plus or minus two, Psychological Review 63, 81, 1956.</div>
          <div>Pollack, The information of elementary auditory displays, JASA 24, 745, 1952.</div>
          <div>Garner, An informational analysis of absolute judgments of loudness, JEP 46, 373, 1953.</div>
          <div>Eriksen and Hake, Absolute judgments as a function of the stimulus range, JEP 49, 323, 1955.</div>
          <div>Miller, Note on the bias of information estimates, in Information Theory in Psychology, 1955.</div>
          <div>Strong, Koberle, de Ruyter van Steveninck and Bialek, Entropy and information in neural spike trains, Physical Review Letters 80, 197, 1998.</div>
          <div>Panzeri, Senatore, Montemurro and Petersen, Correcting for the sampling bias problem, J Neurophysiology 98, 1064, 2007.</div>
          <div>Braida and Durlach, Intensity perception II, JASA 51, 483, 1972.</div>
          <div>Stewart, Brown and Chater, Absolute identification by relative judgment, Psychological Review 112, 881, 2005.</div>
        </div>
      </Card>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center">
        <p className="text-xs leading-relaxed text-slate-500">
          Every trial you produced is sitting in <span className="font-mono text-slate-400">window.__trials</span>{' '}
          in your console, so anything above can be recomputed by anyone who does not believe it.
          None of it went anywhere.
        </p>
      </div>

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        run it again
      </button>
    </div>
  );
}

function QualityCard({ q }: { q: Quality }) {
  return (
    <Card tone="slate" label="the run itself">
      <div className="space-y-0.5">
        <Row k="naming trials scored" v={`${q.usedTrials}`} />
        <Row k="dropped for a hidden tab" v={`${q.hidden}`} />
        <Row k="names ever pressed in the largest block" v={`${q.labelsUsed} of ${q.labelsOffered}`} />
        <Row k="answers under 180 ms" v={pct(q.machine, 1)} />
        <Row k="median time to answer" v={Number.isFinite(q.medianRt) ? `${Math.round(q.medianRt)} ms` : 'n/a'} />
        <Row k="average miss in the largest block" v={`${dbl(q.worstRms)} doublings`} />
      </div>
    </Card>
  );
}

// ============================ playground ============================

function Slider({ label, value, min, max, step, fmt, onChange }: { label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
        <span className="font-mono text-xs text-slate-300">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </div>
  );
}

function Playground({ minPx, sigmaId, sigmaDisc }: { minPx: number; sigmaId: number; sigmaDisc: number }) {
  const [sigma, setSigma] = useState(() => (Number.isFinite(sigmaId) ? clamp(Math.round(sigmaId * 1000) / 1000, 0.005, 0.2) : 0.06));
  const [n, setN] = useState(12);
  const conf = useMemo(() => pRespGivenStim(n, sigma), [n, sigma]);
  const acc = useMemo(() => accOfModel(n, sigma), [n, sigma]);
  const mi = useMemo(() => miOfModel(n, sigma), [n, sigma]);
  const cap = capacityOf(sigma);
  return (
    <Card tone="slate" label="turn the noise up and watch names stop helping">
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="noise, in doublings" value={sigma} min={0.005} max={0.2} step={0.005} fmt={(v) => `${v.toFixed(3)} (${ratioPct(v)})`} onChange={setSigma} />
        <Slider label="names on offer" value={n} min={2} max={24} step={1} fmt={(v) => `${v}`} onChange={setN} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">right</div>
          <div className="mt-1 font-mono text-lg text-slate-200">{pct(acc)}</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">got through</div>
          <div className="mt-1 font-mono text-lg text-slate-200">{dbl(mi, 2)} bits</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">ceiling</div>
          <div className="mt-1 font-mono text-lg text-slate-200">{dbl(cap, 2)} bits</div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <ConfusionGrid conf={conf.map((r) => r.map((p) => p * 100))} pred={null} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Hold the noise still and drag the names up. The score falls, the diagonal blurs, and the
        bits stop moving. That is the whole of Miller&apos;s first half: the ceiling belongs to the range
        divided by the noise, and the number of names on offer is not in it anywhere. Your own fit
        was {Number.isFinite(sigmaId) ? `${dbl(sigmaId)} for naming and ${dbl(sigmaDisc)} for seeing` : 'not available'}.
      </p>
      <div className="mt-4 flex justify-center opacity-60">
        <Scale n={Math.min(n, 12)} minPx={minPx * 0.8} />
      </div>
    </Card>
  );
}
