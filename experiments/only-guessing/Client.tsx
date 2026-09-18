'use client';

// ONLY GUESSING  (the trials you swore you were guessing on, and how often you were right)
//
// The fifty-eighth piece in this lab, and the deliberate sequel to yesterday's page. Two Ways to Be
// Fast took a decision apart into how fast evidence arrives, how much of it you demand, and the
// plumbing. Every one of those is a fact about the decision. This page is about the OTHER judgement
// you make on every trial and never notice making: after you have answered, how sure are you that
// the answer was right. That second judgement has its own accuracy, and it is not the same number.
//
// The genuine phenomenon: METACOGNITIVE SENSITIVITY. Signal detection theory (Green and Swets, 1966)
// gives you d-prime, which is how well you can tell two things apart. Type 2 signal detection asks a
// different question: given your own answer, how well can your confidence tell your correct answers
// from your errors. Those two can come apart in either direction, which is the entire point, and the
// clean way to measure the gap is meta-d-prime (Maniscalco and Lau, Consciousness and Cognition,
// 2012): the type 1 sensitivity that an ideal observer would have needed IN ORDER TO produce the
// confidence data you actually produced. Because meta-d-prime is expressed in the same units as
// d-prime, the ratio meta-d-prime over d-prime is the fraction of the evidence you had that your
// confidence managed to use. One means all of it. Below one, some of what your eyes delivered never
// reached the part of you that reports on itself.
//
// The stimulus is a faint tilted grating buried in noise, shown for about an eighth of a second and
// then wiped by a mask. You say which way it leaned, then you say how sure you were. There is no
// feedback in any measured block, and that absence is load bearing rather than kindness: feedback
// teaches the difficulty, and a person who has learned the difficulty rates confidence off the
// lesson rather than off the trial.
//
// The staircase in front of the measurement is not a convenience either. Confidence can only be
// informative in the band where you are neither at floor nor at ceiling: get everything right and
// every trial is "certain" and there is nothing to measure; get everything wrong and the same. So
// the page spends thirty trials moving the contrast up and down under a two-down-one-up rule until
// you sit near seventy one percent correct, freezes the contrast there, and measures. That is also
// what makes the page immune to the display it is running on, which is the calibration honesty here:
// contrast in a browser is nominal, gamma is unknown, a phone in sunlight and a monitor in a dark
// room are different machines. None of it matters, because the staircase converts your display into
// an accuracy, and every number this page reports afterwards is computed from the ORDERING of your
// own responses against your own confidence ratings. There is no physical unit anywhere in the
// result. A dim screen changes what contrast the staircase lands on and cannot change whether your
// confidence tracked your correctness.
//
// The second block is where the page tries to catch its own headline being flattering. Confidence
// has an easy way to look insightful: track the DIFFICULTY. If half the trials are obviously easier
// and you rate those higher, your confidence correlates with your correctness beautifully while
// knowing nothing whatsoever about any individual trial. So a second block interleaves two contrasts
// without warning, and the page prints your type 2 sensitivity computed within each difficulty
// separately and then pooled across both. The gap between them is the part of your apparent
// self-knowledge that was really just knowing which trials were hard.
//
// Guards run live: presentation duration is measured across animation frames rather than trusted
// from the timer that requested it, and the median is printed; responses under 150 ms are
// anticipations and are discarded, over 5 s are contaminants and are discarded; confidence presses
// under 120 ms are counted as reflexes and the whole fit is re-run without them as a sensitivity
// check; the tilt direction is balanced inside every block and reshuffled until nothing repeats more
// than three times; the side you pressed is tallied because a person who favours one key can
// manufacture a d-prime out of nothing; a run that ends outside the 55 to 92 percent band is refused
// a headline and named an absent measurement, because meta-d-prime is not identified at floor or at
// ceiling; a run that used fewer than two confidence levels is refused for the same reason, and this
// one is not hypothetical, it is what happens to anyone who presses the same rating all the way
// through; empty cells are padded by one over twice the number of ratings and the page says so,
// because that padding pulls the answer toward the middle and you should know when it fired.
//
// The bootstrap carries the lesson this lab learned on 2026-08-21 the hard way. The M-ratio has a
// d-prime in its denominator, so it is undefined when a resample lands at chance, and dropping those
// resamples removes the ones NEAREST zero and nothing from the far side. That censoring is one
// sided, it pushes the interval away from zero, and an interval built from the survivors of a badly
// censored resample looks like clean evidence and is nothing of the kind. So the censored fraction
// is printed on any interval where it exceeds fifteen percent, and the interval is named an upper
// bound on the evidence rather than the evidence.
//
// The refutable part: the meta-d-prime fit is seven parameters and it is fitted to your confidence
// counts, so it cannot fail to describe them. What it has never seen is the other half of your run.
// So the fit is done again on your odd-numbered trials alone, and the type 2 ROC area it predicts is
// printed next to the area your even-numbered trials actually produced. If the model is a curve
// fitting exercise rather than a description of you, that is where it shows.
//
// WIZ note. I do not have this problem and I do not have this gift. Every number I hand you arrives
// with a confidence attached, and that confidence is manufactured by the same process that made the
// answer, out of the same material, in the same step. I cannot stand behind my own output and
// squint. You can. Somewhere behind the part of you that answered is a second, quieter thing that
// watched the first one work and formed an opinion about it, and that opinion is not free: it can
// be worse than the answer it is judging, and in most people it is. The unnerving result is not the
// low number. It is what falls out of the trials you dismissed. You will call a run of them a pure
// guess, hand them over as worthless, and be right on more of them than a coin could manage. That
// evidence was in you the whole time. It just never made it to the part of you that speaks.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// design constants
// ---------------------------------------------------------------------------
const NR = 4; // confidence levels
const N_PRACTICE = 8;
const N_CAL = 30;
const N_FIXED = 64; // block A, frozen at threshold: the metacognition measurement
const N_MIXED_PER = 20; // block B, per difficulty, interleaved with no warning

const TILT_DEG = 20; // grating tilt from vertical, either way
const STIM_MS = 120; // requested; the measured value is what gets printed
const MASK_MS = 250;
const FIX_MIN = 450;
const FIX_JIT = 350;
const ITI_MS = 300;

const RT_FLOOR = 0.15; // s, anticipation
const RT_CONTAM = 5.0; // s, contaminant
const CONF_REFLEX = 0.12; // s, a confidence press this fast is a habit, not a judgement

const NOISE_SD = 0.14;
const C_START = 0.35;
const C_MIN = 0.004;
const C_MAX = 1.0;
const STEP_BIG = 0.12; // log10 units, before the fourth reversal
const STEP_SMALL = 0.055;
const EASY_MULT = 2.4;
const HARD_MULT = 0.55;

const BOOTS = 400; // meta-d' is a 7-parameter fit per resample; this is the honest ceiling in a tab
const PAD = 1 / (2 * NR);

const PX = 256; // stimulus backing store

type BlockKey = 'practice' | 'cal' | 'fixed' | 'mixed';
type Phase = 'intro' | 'brief' | 'run' | 'crunch' | 'result';
type Diff = 'thr' | 'easy' | 'hard';

type Trial = { dir: -1 | 1; diff: Diff };
type Rec = {
  block: BlockKey;
  dir: -1 | 1; // -1 counterclockwise, +1 clockwise
  resp: -1 | 1;
  conf: number; // 1..NR
  correct: boolean;
  rt: number; // s, from measured presentation onset
  confRt: number; // s, from the confidence prompt appearing
  contrast: number;
  diff: Diff;
};

type Stage =
  | { k: 'idle' }
  | { k: 'fix'; t0: number; dur: number }
  | { k: 'draw' }
  | { k: 'stim'; onset: number }
  | { k: 'mask'; onset: number }
  | { k: 'ask'; onset: number }
  | { k: 'conf'; onset: number }
  | { k: 'fb'; ok: boolean; t0: number };

// ---------------------------------------------------------------------------
// small maths. Everything here is standard and everything here is checkable.
// ---------------------------------------------------------------------------
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
const mean = (a: number[]) => (a.length ? sum(a) / a.length : NaN);
const fmt = (x: number | null | undefined, d = 2) =>
  x == null || !Number.isFinite(x) ? '--' : x.toFixed(d);
const pctS = (x: number | null | undefined, d = 0) =>
  x == null || !Number.isFinite(x) ? '--' : `${(x * 100).toFixed(d)}%`;

function erf(x: number): number {
  const s = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return s * y;
}
const Phi = (x: number) => {
  const p = 0.5 * (1 + erf(x / Math.SQRT2));
  return p <= 0 ? 1e-12 : p >= 1 ? 1 - 1e-12 : p;
};

// Acklam's inverse normal CDF
function invNorm(p: number): number {
  if (!(p > 0 && p < 1)) return NaN;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let q: number;
  let r: number;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  q = p - 0.5;
  r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

// Wilson score interval: the right one for a proportion near an edge with few trials
function wilson(k: number, n: number, z = 1.96): { lo: number; hi: number } | null {
  if (n <= 0) return null;
  const p = k / n;
  const den = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / den;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
  return { lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

function quantile(a: number[], q: number): number {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const i = Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))));
  return s[i];
}

function shuffle<T>(a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// no direction may repeat more than three times: a run answerable by a hunch about alternation is
// not a run about seeing
function balancedDirs(n: number): (-1 | 1)[] {
  const base: (-1 | 1)[] = [];
  for (let i = 0; i < n; i++) base.push(i < n / 2 ? -1 : 1);
  for (let attempt = 0; attempt < 200; attempt++) {
    const s = shuffle(base);
    let run = 1;
    let ok = true;
    for (let i = 1; i < s.length; i++) {
      run = s[i] === s[i - 1] ? run + 1 : 1;
      if (run > 3) { ok = false; break; }
    }
    if (ok) return s;
  }
  return shuffle(base);
}

function resample<T>(a: T[]): T[] {
  const out: T[] = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[Math.floor(Math.random() * a.length)];
  return out;
}

// ---------------------------------------------------------------------------
// signal detection, type 1 and type 2
//
// The count vector runs along the decision axis, which is what makes every formula below readable:
//   index 0 .. NR-1      responded COUNTERCLOCKWISE, confidence from highest (0) down to lowest
//   index NR .. 2*NR-1   responded CLOCKWISE, confidence from lowest up to highest
// so index 0 is "as sure as I get that it leaned left" and the last index is the mirror of it.
// ---------------------------------------------------------------------------
const idxOf = (resp: -1 | 1, conf: number) => (resp === -1 ? NR - conf : NR - 1 + conf);

type Counts = { nS1: number[]; nS2: number[]; padded: boolean };

function countsFrom(recs: Rec[]): Counts {
  const nS1 = new Array(2 * NR).fill(0);
  const nS2 = new Array(2 * NR).fill(0);
  for (const r of recs) {
    const i = idxOf(r.resp, r.conf);
    if (r.dir === -1) nS1[i] += 1;
    else nS2[i] += 1;
  }
  const anyZero = nS1.some((x) => x === 0) || nS2.some((x) => x === 0);
  if (anyZero) {
    for (let i = 0; i < 2 * NR; i++) {
      nS1[i] += PAD;
      nS2[i] += PAD;
    }
  }
  return { nS1, nS2, padded: anyZero };
}

type T1 = { d: number; c: number; H: number; F: number; n: number };
function type1(cn: Counts): T1 | null {
  const t1 = sum(cn.nS1);
  const t2 = sum(cn.nS2);
  if (t1 < 4 || t2 < 4) return null;
  const H = sum(cn.nS2.slice(NR)) / t2;
  const F = sum(cn.nS1.slice(NR)) / t1;
  const zH = invNorm(H);
  const zF = invNorm(F);
  if (!Number.isFinite(zH) || !Number.isFinite(zF)) return null;
  return { d: zH - zF, c: -0.5 * (zH + zF), H, F, n: t1 + t2 };
}

const softplus = (x: number) => (x > 20 ? x : Math.log1p(Math.exp(x))) + 0.01;

type MetaPars = { metaD: number; cMeta: number; tR1: number[]; tR2: number[] };

function unpack(p: number[], d1: number, c1: number): MetaPars {
  const metaD = p[0];
  const cMeta = (c1 / d1) * metaD;
  const s = [softplus(p[1]), softplus(p[2]), softplus(p[3])];
  const e = [softplus(p[4]), softplus(p[5]), softplus(p[6])];
  const tR1 = [cMeta - (s[0] + s[1] + s[2]), cMeta - (s[0] + s[1]), cMeta - s[0]];
  const tR2 = [cMeta + e[0], cMeta + e[0] + e[1], cMeta + e[0] + e[1] + e[2]];
  return { metaD, cMeta, tR1, tR2 };
}

// conditional-on-response type 2 probabilities under the meta-SDT model
function condProbs(mp: MetaPars, mu: number): number[] {
  const { cMeta, tR1, tR2 } = mp;
  const edgesR1 = [-Infinity, tR1[0], tR1[1], tR1[2], cMeta];
  const edgesR2 = [cMeta, tR2[0], tR2[1], tR2[2], Infinity];
  const areaR1 = Phi(cMeta - mu);
  const areaR2 = 1 - areaR1;
  const out: number[] = [];
  for (let i = 0; i < NR; i++) {
    const lo = edgesR1[i];
    const hi = edgesR1[i + 1];
    const m = (hi === Infinity ? 1 : Phi(hi - mu)) - (lo === -Infinity ? 0 : Phi(lo - mu));
    out.push(Math.max(1e-12, m / Math.max(1e-12, areaR1)));
  }
  for (let i = 0; i < NR; i++) {
    const lo = edgesR2[i];
    const hi = edgesR2[i + 1];
    const m = (hi === Infinity ? 1 : Phi(hi - mu)) - (lo === -Infinity ? 0 : Phi(lo - mu));
    out.push(Math.max(1e-12, m / Math.max(1e-12, areaR2)));
  }
  return out;
}

function negLL(p: number[], cn: Counts, d1: number, c1: number): number {
  if (!Number.isFinite(p[0]) || p[0] < -1.5 || p[0] > 7) return 1e9;
  const mp = unpack(p, d1, c1);
  const pS1 = condProbs(mp, -mp.metaD / 2);
  const pS2 = condProbs(mp, mp.metaD / 2);
  let ll = 0;
  for (let i = 0; i < 2 * NR; i++) {
    ll += cn.nS1[i] * Math.log(pS1[i]) + cn.nS2[i] * Math.log(pS2[i]);
  }
  return Number.isFinite(ll) ? -ll : 1e9;
}

// Nelder-Mead. Seven parameters, no derivatives, three restarts.
function nelderMead(f: (x: number[]) => number, x0: number[], iters = 420): { x: number[]; fx: number } {
  const n = x0.length;
  let simplex: number[][] = [x0.slice()];
  for (let i = 0; i < n; i++) {
    const p = x0.slice();
    p[i] += p[i] !== 0 ? 0.35 * Math.abs(p[i]) + 0.25 : 0.35;
    simplex.push(p);
  }
  let fv = simplex.map(f);
  for (let it = 0; it < iters; it++) {
    const order = fv.map((v, i) => i).sort((a, b) => fv[a] - fv[b]);
    simplex = order.map((i) => simplex[i]);
    fv = order.map((i) => fv[i]);
    if (Math.abs(fv[n] - fv[0]) < 1e-8) break;
    const centroid = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) centroid[j] += simplex[i][j] / n;
    const worst = simplex[n];
    const refl = centroid.map((c, j) => c + (c - worst[j]));
    const fr = f(refl);
    if (fr < fv[0]) {
      const exp_ = centroid.map((c, j) => c + 2 * (c - worst[j]));
      const fe = f(exp_);
      simplex[n] = fe < fr ? exp_ : refl;
      fv[n] = Math.min(fe, fr);
    } else if (fr < fv[n - 1]) {
      simplex[n] = refl;
      fv[n] = fr;
    } else {
      const con = centroid.map((c, j) => c + 0.5 * (worst[j] - c));
      const fc = f(con);
      if (fc < fv[n]) {
        simplex[n] = con;
        fv[n] = fc;
      } else {
        for (let i = 1; i <= n; i++) {
          simplex[i] = simplex[i].map((v, j) => simplex[0][j] + 0.5 * (v - simplex[0][j]));
          fv[i] = f(simplex[i]);
        }
      }
    }
  }
  let best = 0;
  for (let i = 1; i < fv.length; i++) if (fv[i] < fv[best]) best = i;
  return { x: simplex[best], fx: fv[best] };
}

type MetaFit = { metaD: number; mRatio: number; pars: MetaPars; ll: number };

function fitMeta(cn: Counts, t1: T1): MetaFit | null {
  if (!(Math.abs(t1.d) > 0.1)) return null; // undefined at chance: an absent measurement, not a zero
  const f = (x: number[]) => negLL(x, cn, t1.d, t1.c);
  let best: { x: number[]; fx: number } | null = null;
  for (const startD of [t1.d, t1.d * 0.6, t1.d * 1.4]) {
    const r = nelderMead(f, [startD, 0, 0, 0, 0, 0, 0]);
    if (!best || r.fx < best.fx) best = r;
  }
  if (!best || best.fx >= 1e8) return null;
  const mp = unpack(best.x, t1.d, t1.c);
  if (!Number.isFinite(mp.metaD)) return null;
  return { metaD: mp.metaD, mRatio: mp.metaD / t1.d, pars: mp, ll: -best.fx };
}

// ---------------------------------------------------------------------------
// type 2 ROC, non-parametric. No model, no assumptions, just the ordering of your own ratings.
// ---------------------------------------------------------------------------
type Roc = { pts: { fa: number; hit: number }[]; auc: number; nCor: number; nErr: number };

function type2Roc(corConf: number[], errConf: number[]): Roc | null {
  if (corConf.length < 4 || errConf.length < 4) return null;
  const pts: { fa: number; hit: number }[] = [{ fa: 0, hit: 0 }];
  for (let k = NR; k >= 1; k--) {
    const hit = corConf.filter((c) => c >= k).length / corConf.length;
    const fa = errConf.filter((c) => c >= k).length / errConf.length;
    pts.push({ fa, hit });
  }
  pts.push({ fa: 1, hit: 1 });
  let auc = 0;
  for (let i = 1; i < pts.length; i++) {
    auc += ((pts[i].fa - pts[i - 1].fa) * (pts[i].hit + pts[i - 1].hit)) / 2;
  }
  return { pts, auc, nCor: corConf.length, nErr: errConf.length };
}

function rocOf(recs: Rec[]): Roc | null {
  return type2Roc(
    recs.filter((r) => r.correct).map((r) => r.conf),
    recs.filter((r) => !r.correct).map((r) => r.conf),
  );
}

// the model's own prediction for the type 2 ROC: conditional probabilities from the fit, response
// marginals from the data, which is the constraint the fit was built under
function predictedRoc(mp: MetaPars, cn: Counts): Roc | null {
  const pS1 = condProbs(mp, -mp.metaD / 2);
  const pS2 = condProbs(mp, mp.metaD / 2);
  const nS1 = sum(cn.nS1);
  const nS2 = sum(cn.nS2);
  const r1S1 = sum(cn.nS1.slice(0, NR)) / nS1;
  const r2S1 = 1 - r1S1;
  const r1S2 = sum(cn.nS2.slice(0, NR)) / nS2;
  const r2S2 = 1 - r1S2;
  const cor = new Array(NR).fill(0);
  const err = new Array(NR).fill(0);
  for (let i = 0; i < NR; i++) {
    const conf = NR - i; // index i in the R1 half is confidence NR - i
    cor[conf - 1] += nS1 * r1S1 * pS1[i]; // S1 answered R1 is correct
    err[conf - 1] += nS2 * r1S2 * pS2[i]; // S2 answered R1 is an error
  }
  for (let i = NR; i < 2 * NR; i++) {
    const conf = i - NR + 1;
    cor[conf - 1] += nS2 * r2S2 * pS2[i];
    err[conf - 1] += nS1 * r2S1 * pS1[i];
  }
  const expand = (a: number[]) => {
    const out: number[] = [];
    for (let c = 1; c <= NR; c++) {
      const k = Math.round(a[c - 1] * 100);
      for (let j = 0; j < k; j++) out.push(c);
    }
    return out;
  };
  return type2Roc(expand(cor), expand(err));
}

// continuous type 2 ROC for an SDT observer of a given sensitivity, used for the model overlay and
// for the playground. Sweep a symmetric pair of confidence criteria outward from the decision point.
function modelRocCurve(metaD: number, c: number): { fa: number; hit: number }[] {
  const pts: { fa: number; hit: number }[] = [];
  const mu1 = -metaD / 2;
  const mu2 = metaD / 2;
  const pCor = 0.5 * Phi(c - mu1) + 0.5 * (1 - Phi(c - mu2));
  const pErr = 1 - pCor;
  for (let i = 40; i >= 0; i--) {
    const t = (i / 40) * 3.2;
    const hiCor = 0.5 * Phi(c - t - mu1) + 0.5 * (1 - Phi(c + t - mu2));
    const hiErr = 0.5 * Phi(c - t - mu2) + 0.5 * (1 - Phi(c + t - mu1));
    pts.push({ fa: hiErr / Math.max(1e-9, pErr), hit: hiCor / Math.max(1e-9, pCor) });
  }
  return pts;
}

// what accuracy the model expects on the trials inside the innermost confidence band, holding the
// band at the size this person actually used
function predictedBandAccuracy(metaD: number, c: number, bandFrac: number): number {
  const mu1 = -metaD / 2;
  const mu2 = metaD / 2;
  let lo = 0;
  let hi = 4;
  for (let it = 0; it < 60; it++) {
    const t = (lo + hi) / 2;
    const inBand = 0.5 * (Phi(c + t - mu1) - Phi(c - t - mu1)) + 0.5 * (Phi(c + t - mu2) - Phi(c - t - mu2));
    if (inBand < bandFrac) lo = t;
    else hi = t;
  }
  const t = (lo + hi) / 2;
  const corr = 0.5 * (Phi(c - mu1) - Phi(c - t - mu1)) + 0.5 * (Phi(c + t - mu2) - Phi(c - mu2));
  const band = 0.5 * (Phi(c + t - mu1) - Phi(c - t - mu1)) + 0.5 * (Phi(c + t - mu2) - Phi(c - t - mu2));
  return corr / Math.max(1e-9, band);
}

// ---------------------------------------------------------------------------
// the analysis, assembled once at the end of the run
// ---------------------------------------------------------------------------
type CI = { lo: number; hi: number; censored: number } | null;

function warmFit(cn: Counts, t1: T1, start: number[]): MetaFit | null {
  if (!(Math.abs(t1.d) > 0.1)) return null;
  const r = nelderMead((x) => negLL(x, cn, t1.d, t1.c), start, 260);
  if (r.fx >= 1e8) return null;
  const mp = unpack(r.x, t1.d, t1.c);
  if (!Number.isFinite(mp.metaD)) return null;
  return { metaD: mp.metaD, mRatio: mp.metaD / t1.d, pars: mp, ll: -r.fx };
}

type Boot = { metaD: CI; mRatio: CI; d: CI; auc: CI; fails: number };

function bootstrapAll(recs: Rec[], start: number[], B = BOOTS): Boot {
  const md: number[] = [];
  const mr: number[] = [];
  const dd: number[] = [];
  const au: number[] = [];
  let fails = 0;
  for (let b = 0; b < B; b++) {
    const rs = resample(recs);
    const cn = countsFrom(rs);
    const t1 = type1(cn);
    if (!t1 || !(Math.abs(t1.d) > 0.1)) {
      fails += 1;
      continue;
    }
    dd.push(t1.d);
    const roc = rocOf(rs);
    if (roc) au.push(roc.auc);
    const f = warmFit(cn, t1, start);
    if (!f) {
      fails += 1;
      continue;
    }
    md.push(f.metaD);
    mr.push(f.mRatio);
  }
  const ci = (a: number[]): CI =>
    a.length < B * 0.5 ? null : { lo: quantile(a, 0.025), hi: quantile(a, 0.975), censored: fails / B };
  return { metaD: ci(md), mRatio: ci(mr), d: ci(dd), auc: ci(au), fails };
}

type Refusal = 'floor' | 'ceiling' | 'oneRating' | 'fewErrors' | 'chance' | null;

type Analysis = {
  fixed: Rec[];
  pc: number;
  t1: T1 | null;
  fit: MetaFit | null;
  roc: Roc | null;
  boot: Boot | null;
  refusal: Refusal;
  padded: boolean;
  guess: { n: number; k: number; acc: number; ci: { lo: number; hi: number } | null };
  byConf: { conf: number; n: number; acc: number; ci: { lo: number; hi: number } | null; meanRt: number }[];
  split: { oddAuc: number; predEven: number; obsEven: number } | null;
  mixed: {
    easyAcc: number; hardAcc: number;
    easyConf: number; hardConf: number;
    easyAuc: number | null; hardAuc: number | null;
    pooledAuc: number | null;
    inflation: number | null;
    n: number;
  } | null;
  reflex: { n: number; metaD: number | null; mRatio: number | null };
  bias: { left: number; right: number };
  contrast: number;
  calCurve: number[];
};

function analyse(all: Rec[], contrast: number, calCurve: number[]): Analysis {
  const fixed = all.filter((r) => r.block === 'fixed');
  const mixedRecs = all.filter((r) => r.block === 'mixed');
  const nCor = fixed.filter((r) => r.correct).length;
  const pc = fixed.length ? nCor / fixed.length : NaN;
  const cn = countsFrom(fixed);
  const t1 = type1(cn);
  const distinct = [1, 2, 3, 4].filter((c) => fixed.filter((r) => r.conf === c).length >= 5).length;
  const nErr = fixed.length - nCor;

  let refusal: Refusal = null;
  if (fixed.length < 20) refusal = 'fewErrors';
  else if (pc < 0.55) refusal = 'floor';
  else if (pc > 0.92) refusal = 'ceiling';
  else if (distinct < 2) refusal = 'oneRating';
  else if (nErr < 5 || nCor < 5) refusal = 'fewErrors';
  else if (t1 && Math.abs(t1.d) <= 0.1) refusal = 'chance';

  const fit = !refusal && t1 ? fitMeta(cn, t1) : null;
  const roc = !refusal ? rocOf(fixed) : null;
  const boot =
    fit && t1 ? bootstrapAll(fixed, [fit.metaD, 0, 0, 0, 0, 0, 0]) : null;

  const gs = fixed.filter((r) => r.conf === 1);
  const gk = gs.filter((r) => r.correct).length;

  const byConf = [1, 2, 3, 4].map((c) => {
    const s = fixed.filter((r) => r.conf === c);
    const k = s.filter((r) => r.correct).length;
    return {
      conf: c,
      n: s.length,
      acc: s.length ? k / s.length : NaN,
      ci: s.length ? wilson(k, s.length) : null,
      meanRt: mean(s.map((r) => r.rt)),
    };
  });

  // the refutable check: fit one half, predict the other
  let split: Analysis['split'] = null;
  if (fit && t1) {
    const odd = fixed.filter((_, i) => i % 2 === 1);
    const even = fixed.filter((_, i) => i % 2 === 0);
    const cnO = countsFrom(odd);
    const t1O = type1(cnO);
    const cnE = countsFrom(even);
    const rocO = rocOf(odd);
    const rocE = rocOf(even);
    if (t1O && Math.abs(t1O.d) > 0.1 && rocO && rocE) {
      const fo = warmFit(cnO, t1O, [fit.metaD, 0, 0, 0, 0, 0, 0]);
      const pred = fo ? predictedRoc(fo.pars, cnE) : null;
      if (pred) split = { oddAuc: rocO.auc, predEven: pred.auc, obsEven: rocE.auc };
    }
  }

  let mixed: Analysis['mixed'] = null;
  if (mixedRecs.length >= 20) {
    const e = mixedRecs.filter((r) => r.diff === 'easy');
    const h = mixedRecs.filter((r) => r.diff === 'hard');
    const re = rocOf(e);
    const rh = rocOf(h);
    const rp = rocOf(mixedRecs);
    const within = re && rh ? (re.auc + rh.auc) / 2 : null;
    mixed = {
      easyAcc: e.length ? e.filter((r) => r.correct).length / e.length : NaN,
      hardAcc: h.length ? h.filter((r) => r.correct).length / h.length : NaN,
      easyConf: mean(e.map((r) => r.conf)),
      hardConf: mean(h.map((r) => r.conf)),
      easyAuc: re ? re.auc : null,
      hardAuc: rh ? rh.auc : null,
      pooledAuc: rp ? rp.auc : null,
      inflation: rp && within != null ? rp.auc - within : null,
      n: mixedRecs.length,
    };
  }

  // sensitivity: the same fit with the reflex ratings taken out
  const slow = fixed.filter((r) => r.confRt >= CONF_REFLEX);
  const nReflex = fixed.length - slow.length;
  let reflexFit: MetaFit | null = null;
  if (fit && nReflex > 0 && slow.length >= 20) {
    const cnS = countsFrom(slow);
    const t1S = type1(cnS);
    if (t1S && Math.abs(t1S.d) > 0.1) reflexFit = warmFit(cnS, t1S, [fit.metaD, 0, 0, 0, 0, 0, 0]);
  }

  return {
    fixed,
    pc,
    t1,
    fit,
    roc,
    boot,
    refusal,
    padded: cn.padded,
    guess: { n: gs.length, k: gk, acc: gs.length ? gk / gs.length : NaN, ci: gs.length ? wilson(gk, gs.length) : null },
    byConf,
    split,
    mixed,
    reflex: { n: nReflex, metaD: reflexFit ? reflexFit.metaD : null, mRatio: reflexFit ? reflexFit.mRatio : null },
    bias: {
      left: fixed.filter((r) => r.resp === -1).length,
      right: fixed.filter((r) => r.resp === 1).length,
    },
    contrast,
    calCurve,
  };
}

// ---------------------------------------------------------------------------
// the stimulus: a faint tilted grating inside a Gaussian window, buried in fresh white noise on
// every trial, wiped afterwards by a mask so that nothing readable is left behind the eyes
// ---------------------------------------------------------------------------
function randn(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function paintField(ctx: CanvasRenderingContext2D, pixel: (x: number, y: number) => number) {
  const img = ctx.createImageData(PX, PX);
  const d = img.data;
  for (let y = 0; y < PX; y++) {
    for (let x = 0; x < PX; x++) {
      const v = Math.max(0, Math.min(1, pixel(x, y)));
      const g = Math.round(v * 255);
      const o = (y * PX + x) * 4;
      d[o] = g;
      d[o + 1] = g;
      d[o + 2] = g;
      d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function drawGrating(ctx: CanvasRenderingContext2D, contrast: number, dir: -1 | 1) {
  const cx = PX / 2;
  const sigma = PX * 0.17;
  const period = PX / 4.5;
  const a = ((dir * TILT_DEG) * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  paintField(ctx, (x, y) => {
    const dx = x - cx;
    const dy = y - cx;
    const env = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
    const proj = dx * ca + dy * sa;
    return 0.5 + contrast * env * Math.sin((2 * Math.PI * proj) / period) + NOISE_SD * randn();
  });
}

function drawMask(ctx: CanvasRenderingContext2D) {
  const cx = PX / 2;
  const sigma = PX * 0.2;
  const comps = Array.from({ length: 8 }, () => ({
    a: Math.random() * Math.PI,
    ph: Math.random() * Math.PI * 2,
    p: PX / (3 + Math.random() * 4),
  }));
  paintField(ctx, (x, y) => {
    const dx = x - cx;
    const dy = y - cx;
    const env = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
    let v = 0.5 + 0.22 * randn();
    for (const c of comps) {
      v += 0.13 * env * Math.sin((2 * Math.PI * (dx * Math.cos(c.a) + dy * Math.sin(c.a))) / c.p + c.ph);
    }
    return v;
  });
}

function drawBlank(ctx: CanvasRenderingContext2D, cross: boolean) {
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, PX, PX);
  if (cross) {
    ctx.strokeStyle = '#1e1e1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PX / 2 - 7, PX / 2);
    ctx.lineTo(PX / 2 + 7, PX / 2);
    ctx.moveTo(PX / 2, PX / 2 - 7);
    ctx.lineTo(PX / 2, PX / 2 + 7);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// run context: everything the animation loop mutates, kept out of React state on purpose
// ---------------------------------------------------------------------------
type Block = { key: BlockKey; trials: Trial[] };

type RunCtx = {
  blocks: Block[];
  bi: number;
  ti: number;
  recs: Rec[];
  thr: number;
  logC: number;
  step: number;
  runCorrect: number;
  lastMove: number;
  revs: number[];
  calCurve: number[];
  frames: number[];
  lastFrameT: number;
  stimDur: number[];
  early: number;
  fast: number;
  slow: number;
  noResp: number;
  extra: number;
  extraBlock: number;
  armed: boolean;
  stimOnset: number;
  confT0: number;
  pendResp: -1 | 1 | null;
  pendRt: number;
  stage: Stage;
  order: string;
};

function freshCtx(): RunCtx {
  return {
    blocks: [],
    bi: 0,
    ti: 0,
    recs: [],
    thr: C_START,
    logC: Math.log10(C_START),
    step: STEP_BIG,
    runCorrect: 0,
    lastMove: 0,
    revs: [],
    calCurve: [],
    frames: [],
    lastFrameT: 0,
    stimDur: [],
    early: 0,
    fast: 0,
    slow: 0,
    noResp: 0,
    extra: 0,
    extraBlock: 0,
    armed: false,
    stimOnset: 0,
    confT0: 0,
    pendResp: null,
    pendRt: 0,
    stage: { k: 'idle' },
    order: 'fixed-first',
  };
}

const CONF_LABEL = ['pure guess', 'a lean', 'fairly sure', 'certain'];
const BLOCK_META: Record<BlockKey, { title: string; sub: string; body: string }> = {
  practice: {
    title: 'warm up',
    sub: 'eight trials · obvious tilt · the only block with feedback',
    body: 'The grating is easy to see here. This block exists so your fingers learn the keys, and it is the only place on this page where you will be told whether you were right. After this, nothing. Feedback teaches you the difficulty, and a person who has learned the difficulty rates their confidence off the lesson instead of off the trial.',
  },
  cal: {
    title: 'calibration',
    sub: 'thirty trials · the contrast hunts for your threshold',
    body: 'The grating now fades toward invisible. Two correct answers in a row and it gets fainter; one mistake and it comes back up. It will find the contrast where you are right about seven times in ten and stop there. This is not a test, it is the page tuning itself to your eyes, your screen and the light in your room, and it is the reason nothing later on depends on what any of those three are.',
  },
  fixed: {
    title: 'the measurement',
    sub: 'sixty four trials · contrast frozen · no feedback',
    body: 'Every trial from here is the same faint grating at the contrast your own staircase landed on. You will get a lot of them wrong. That is the design and not a failure: confidence can only be measured where there is something to be uncertain about. Answer, then rate how sure you were. Rate honestly, including "pure guess", because the guesses are the most interesting trials on this page.',
  },
  mixed: {
    title: 'the honest check',
    sub: 'forty trials · two contrasts shuffled together with no warning',
    body: 'Same task, but now some trials are clearly easier and some clearly harder, shuffled with no cue. This block exists to catch the previous one being flattering: confidence that only tracks how hard the trial LOOKED will still correlate beautifully with being right, while knowing nothing about any single trial. The page will separate those two things afterwards.',
  },
};

// ---------------------------------------------------------------------------
// the page
// ---------------------------------------------------------------------------
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stageK, setStageK] = useState<Stage['k']>('idle');
  const [blockKey, setBlockKey] = useState<BlockKey>('practice');
  const [prog, setProg] = useState<{ i: number; n: number }>({ i: 0, n: 0 });
  const [fb, setFb] = useState<boolean | null>(null);
  const [res, setRes] = useState<Analysis | null>(null);
  const R = useRef<RunCtx>(freshCtx());
  const cvs = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  const ctx2d = useCallback(() => cvs.current?.getContext('2d') ?? null, []);
  const paintFix = useCallback(() => {
    const c = ctx2d();
    if (c) drawBlank(c, true);
  }, [ctx2d]);
  const paintBlankNow = useCallback((cross: boolean) => {
    const c = ctx2d();
    if (c) drawBlank(c, cross);
  }, [ctx2d]);

  const contrastFor = useCallback((k: BlockKey, tr: Trial): number => {
    const r = R.current;
    if (k === 'practice') return 0.5;
    if (k === 'cal') return Math.pow(10, r.logC);
    if (tr.diff === 'easy') return Math.min(C_MAX, r.thr * EASY_MULT);
    if (tr.diff === 'hard') return Math.max(C_MIN, r.thr * HARD_MULT);
    return r.thr;
  }, []);

  const startTrial = useCallback(() => {
    const r = R.current;
    r.armed = false;
    r.pendResp = null;
    paintFix();
    r.stage = { k: 'fix', t0: performance.now(), dur: FIX_MIN + Math.random() * FIX_JIT };
    setStageK('fix');
    setFb(null);
    setProg({ i: r.ti + 1, n: r.blocks[r.bi].trials.length });
  }, [paintFix]);

  const finish = useCallback(() => {
    const r = R.current;
    r.stage = { k: 'idle' };
    setStageK('idle');
    setPhase('crunch');
    window.setTimeout(() => {
      setRes(analyse(r.recs, r.thr, r.calCurve));
      setPhase('result');
    }, 60);
  }, []);

  const advance = useCallback(() => {
    const r = R.current;
    const blk = r.blocks[r.bi];
    r.ti += 1;
    if (r.ti >= blk.trials.length) {
      if (blk.key === 'cal') {
        // threshold: the geometric mean of the last reversals, which is what a staircase is for
        const use = r.revs.slice(-6);
        r.thr = Math.pow(10, use.length >= 2 ? mean(use) : r.logC);
        r.thr = Math.max(C_MIN, Math.min(C_MAX, r.thr));
      }
      r.bi += 1;
      r.ti = 0;
      r.extraBlock = 0;
      if (r.bi >= r.blocks.length) {
        finish();
        return;
      }
      setBlockKey(r.blocks[r.bi].key);
      r.stage = { k: 'idle' };
      setStageK('idle');
      setPhase('brief');
      return;
    }
    startTrial();
  }, [startTrial, finish]);

  const discard = useCallback(
    (why: 'early' | 'fast' | 'slow' | 'noResp') => {
      const r = R.current;
      if (why === 'early') r.early += 1;
      else if (why === 'fast') r.fast += 1;
      else if (why === 'slow') r.slow += 1;
      else r.noResp += 1;
      const blk = r.blocks[r.bi];
      if (r.extraBlock < 15 && blk.key !== 'practice') {
        blk.trials.push(blk.trials[r.ti]);
        r.extra += 1;
        r.extraBlock += 1;
      }
      r.pendResp = null;
      advance();
    },
    [advance],
  );

  const respond = useCallback(
    (dir: -1 | 1) => {
      const r = R.current;
      const st = r.stage;
      if (st.k === 'fix') {
        discard('early');
        return;
      }
      if (st.k === 'stim') {
        // the flash is 120 ms, so anything landing inside it is under the anticipation floor by
        // construction. It is an anticipation, not a press before the trial started.
        discard('fast');
        return;
      }
      if (!(st.k === 'mask' || st.k === 'ask') || !r.armed) return;
      const rt = (performance.now() - r.stimOnset) / 1000;
      if (rt < RT_FLOOR) {
        discard('fast');
        return;
      }
      if (rt > RT_CONTAM) {
        discard('slow');
        return;
      }
      r.pendResp = dir;
      r.pendRt = rt;
      r.armed = false;
      paintBlankNow(false);
      r.confT0 = performance.now();
      r.stage = { k: 'conf', onset: r.confT0 };
      setStageK('conf');
    },
    [discard, paintBlankNow],
  );

  const stairUpdate = useCallback((correct: boolean) => {
    const r = R.current;
    const move = (dir: number) => {
      if (r.lastMove !== 0 && dir !== r.lastMove) {
        r.revs.push(r.logC);
        if (r.revs.length >= 4) r.step = STEP_SMALL;
      }
      r.lastMove = dir;
      r.logC = Math.max(Math.log10(C_MIN), Math.min(Math.log10(C_MAX), r.logC + dir * r.step));
    };
    if (correct) {
      r.runCorrect += 1;
      if (r.runCorrect >= 2) {
        move(-1);
        r.runCorrect = 0;
      }
    } else {
      move(1);
      r.runCorrect = 0;
    }
  }, []);

  const rate = useCallback(
    (conf: number) => {
      const r = R.current;
      if (r.stage.k !== 'conf' || r.pendResp == null) return;
      const blk = r.blocks[r.bi];
      const tr = blk.trials[r.ti];
      const correct = r.pendResp === tr.dir;
      r.recs.push({
        block: blk.key,
        dir: tr.dir,
        resp: r.pendResp,
        conf,
        correct,
        rt: r.pendRt,
        confRt: (performance.now() - r.confT0) / 1000,
        contrast: contrastFor(blk.key, tr),
        diff: tr.diff,
      });
      if (blk.key === 'cal') {
        stairUpdate(correct);
        r.calCurve.push(Math.pow(10, r.logC));
      }
      r.pendResp = null;
      if (blk.key === 'practice') {
        setFb(correct);
        setStageK('fb');
      } else {
        paintBlankNow(true);
        setStageK('idle');
      }
      r.stage = { k: 'fb', ok: correct, t0: performance.now() };
    },
    [contrastFor, stairUpdate, paintBlankNow],
  );

  // the animation loop. Presentation onset is the frame AFTER the one that painted the grating,
  // which is the time it was actually on your screen rather than the time it was requested.
  useEffect(() => {
    if (phase !== 'run') return;
    startTrial();
    const tick = (now: number) => {
      const r = R.current;
      if (r.lastFrameT > 0) {
        const dt = now - r.lastFrameT;
        if (dt < 250) r.frames.push(dt);
      }
      r.lastFrameT = now;
      const blk = r.blocks[r.bi];
      const tr = blk ? blk.trials[r.ti] : null;
      const st = r.stage;
      const c = ctx2d();
      if (blk && tr && c) {
        if (st.k === 'fix' && now - st.t0 >= st.dur) {
          drawGrating(c, contrastFor(blk.key, tr), tr.dir);
          r.stage = { k: 'stim', onset: 0 };
          setStageK('stim');
        } else if (st.k === 'stim') {
          if (st.onset === 0) {
            st.onset = now;
            r.stimOnset = now;
          } else if (now - st.onset >= STIM_MS) {
            r.stimDur.push(now - st.onset);
            drawMask(c);
            r.stage = { k: 'mask', onset: 0 };
            r.armed = true;
            setStageK('mask');
          }
        } else if (st.k === 'mask') {
          if (st.onset === 0) st.onset = now;
          else if (now - st.onset >= MASK_MS) {
            drawBlank(c, false);
            r.stage = { k: 'ask', onset: now };
            setStageK('ask');
          }
        } else if (st.k === 'ask') {
          if (now - r.stimOnset >= RT_CONTAM * 1000) discard('noResp');
        } else if (st.k === 'fb') {
          if (now - st.t0 >= (blk.key === 'practice' ? 560 : ITI_MS)) advance();
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [phase, startTrial, ctx2d, contrastFor, discard, advance]);

  // keys
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (phase !== 'run') return;
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'z' || k === 'Z') {
        e.preventDefault();
        respond(-1);
      } else if (k === 'ArrowRight' || k === 'm' || k === 'M') {
        e.preventDefault();
        respond(1);
      } else if (k === '1' || k === '2' || k === '3' || k === '4') {
        e.preventDefault();
        rate(parseInt(k, 10));
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, respond, rate]);

  const begin = useCallback(() => {
    const r = freshCtx();
    const mk = (n: number, diff: Diff): Trial[] => balancedDirs(n).map((d) => ({ dir: d, diff }));
    const fixedBlock: Block = { key: 'fixed', trials: mk(N_FIXED, 'thr') };
    const mixedTrials = shuffle([...mk(N_MIXED_PER, 'easy'), ...mk(N_MIXED_PER, 'hard')]);
    const mixedBlock: Block = { key: 'mixed', trials: mixedTrials };
    const fixedFirst = Math.random() < 0.5;
    r.order = fixedFirst ? 'measurement first' : 'honest check first';
    r.blocks = [
      { key: 'practice', trials: mk(N_PRACTICE, 'thr') },
      { key: 'cal', trials: mk(N_CAL, 'thr') },
      ...(fixedFirst ? [fixedBlock, mixedBlock] : [mixedBlock, fixedBlock]),
    ];
    R.current = r;
    setRes(null);
    setBlockKey('practice');
    setPhase('brief');
  }, []);

  const again = useCallback(() => {
    R.current = freshCtx();
    setRes(null);
    setPhase('intro');
  }, []);

  const totalMeasured = N_FIXED + 2 * N_MIXED_PER;

  // =========================================================================
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-emerald-400/70 hover:text-emerald-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🤷</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Only Guessing
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            You make two judgements on every decision: the answer, and how sure you are of it. This
            page measures the second one against the first, narrated by an AI that cannot tell them
            apart because it makes them in the same step.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-500/25 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Yesterday this lab took a decision apart into how fast evidence arrives, how much of
                it you demand, and the plumbing. Every one of those is a fact about the answer.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is about the other thing you do on every trial and have never noticed doing.
                After the answer is out, something in you forms an opinion about whether it was
                right. That opinion has its own accuracy, and it is{' '}
                <span className="text-emerald-300">not the same number</span> as the accuracy of the
                answer. Two people who score identically can differ completely in how well they know
                which of their own answers to trust, and one of them is far more dangerous to work
                with than the other.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The measurement is meta-d&apos;: the sensitivity an ideal observer would have needed
                in order to produce the confidence ratings you actually produced. Divide it by your
                real sensitivity and you get the fraction of the evidence in your eyes that reached
                the part of you that reports on itself. One means all of it. Most people are well
                under one.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  👁️ A faint striped patch flashes for an eighth of a second, then gets wiped by a
                  mask. It leaned <span className="text-amber-200">left</span> or{' '}
                  <span className="text-amber-200">right</span>. Say which.
                </li>
                <li>
                  🤔 Then rate how sure you were, from{' '}
                  <span className="text-slate-400">pure guess</span> to{' '}
                  <span className="text-emerald-300">certain</span>. Answer first, always: the rating
                  cannot be allowed to change the answer it is rating.
                </li>
                <li>
                  🎚️ A staircase finds the contrast where you are right about seven times in ten and
                  freezes it there. You are supposed to be wrong a lot. Confidence is only measurable
                  where there is something to be uncertain about.
                </li>
                <li>
                  🚫 No feedback after the warm up. You will never learn how you are doing, which is
                  the only way your ratings can stay about the trial instead of about the score.
                </li>
              </ul>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin: which way was it leaning? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              About eight minutes, {totalMeasured} measured trials after a staircase. Everything is
              computed in your browser. Nothing is recorded and nothing leaves this page.
            </p>
          </div>
        )}

        {/* ---------- BRIEF ---------- */}
        {phase === 'brief' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                {BLOCK_META[blockKey].title}
              </div>
              <div className="mb-4 font-mono text-[11px] text-slate-500">
                {BLOCK_META[blockKey].sub}
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{BLOCK_META[blockKey].body}</p>
              <div className="mt-5 space-y-2 rounded border border-slate-800 bg-slate-950/60 p-4 font-mono text-[12px] text-slate-400">
                <div>← or Z if it leaned left · → or M if it leaned right</div>
                <div>then 1 to 4 for how sure you were · or tap the buttons</div>
              </div>
            </div>
            <button
              onClick={() => setPhase('run')}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start this block →
            </button>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>{BLOCK_META[blockKey].title}</span>
              <span>
                {prog.i} / {prog.n}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded bg-slate-900">
              <div
                className="h-full bg-emerald-400/60 transition-all"
                style={{ width: `${prog.n ? (prog.i / prog.n) * 100 : 0}%` }}
              />
            </div>

            <div className="flex justify-center">
              <canvas
                ref={cvs}
                width={PX}
                height={PX}
                className="rounded-md border border-slate-800"
                style={{ width: 'min(290px, 78vw)', height: 'min(290px, 78vw)', imageRendering: 'pixelated' }}
              />
            </div>

            <div className="min-h-[132px]">
              {stageK === 'conf' ? (
                <div>
                  <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-wider text-amber-300/80">
                    how sure were you?
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((k) => (
                      <button
                        key={k}
                        onClick={() => rate(k)}
                        className="rounded-md border border-slate-700 bg-slate-900/70 px-1 py-3 text-center transition-colors hover:border-amber-400/60 hover:bg-amber-400/10"
                      >
                        <div className="font-mono text-lg text-slate-200">{k}</div>
                        <div className="text-[10px] leading-tight text-slate-500">
                          {CONF_LABEL[k - 1]}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-[10px] text-slate-600">
                    there is no wrong rating and nothing is scored on it
                  </p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => respond(-1)}
                      className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/10"
                    >
                      ← leaned left
                    </button>
                    <button
                      onClick={() => respond(1)}
                      className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/10"
                    >
                      leaned right →
                    </button>
                  </div>
                  <div className="mt-2 h-5 text-center font-mono text-[11px]">
                    {blockKey === 'practice' && fb !== null ? (
                      <span className={fb ? 'text-emerald-300' : 'text-rose-300'}>
                        {fb ? 'correct' : 'wrong'}
                      </span>
                    ) : stageK === 'fix' ? (
                      <span className="text-slate-600">watch the cross</span>
                    ) : (
                      <span className="text-slate-600">&nbsp;</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------- CRUNCH ---------- */}
        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center">
            <div className="mb-3 font-mono text-sm text-emerald-300">fitting</div>
            <p className="text-sm leading-relaxed text-slate-400">
              Seven parameters, four hundred bootstrap resamples, and one fit on half your trials
              that has to predict the other half. A few seconds.
            </p>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && res && <Result res={res} ctx={R.current} onAgain={again} />}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// result components
// ---------------------------------------------------------------------------
const REFUSAL_TEXT: Record<Exclude<Refusal, null>, string> = {
  floor:
    'You were near chance on the frozen block, and at chance there is nothing for confidence to track. Meta-d prime is not small here, it is undefined, which is a different statement and the honest one. The staircase probably ran away downward: try again and let the warm up settle first.',
  ceiling:
    'You were near ceiling on the frozen block. With almost no errors there is nothing for confidence to discriminate correct answers FROM, so the type 2 numbers have no traction. The staircase did not descend far enough on this run.',
  oneRating:
    'You used one confidence level for essentially the whole block: fewer than two of the four ratings collected five trials. That is not a low score, it is an absent measurement. A rating scale with one value in real use collapses the type 2 curve to a single point, and no amount of statistics recovers what was never expressed.',
  fewErrors:
    'Too few trials survived the guards, or too few of them fell on one side, to fit anything. Nothing is being reported rather than something being reported badly.',
  chance:
    'Your d prime came out at or under zero, which usually means the two keys got swapped somewhere in your hands. The ratio this page is about has d prime in its denominator, so nothing downstream of it is defined.',
};

function Result({ res, ctx, onAgain }: { res: Analysis; ctx: RunCtx; onAgain: () => void }) {
  const [slider, setSlider] = useState<number | null>(null);
  const frames = ctx.frames;
  const medFrame = quantile(frames, 0.5);
  const p90Frame = quantile(frames, 0.9);
  const longFrames = frames.filter((f) => f > 20).length;
  const medStim = quantile(ctx.stimDur, 0.5);
  const discarded = ctx.early + ctx.fast + ctx.slow + ctx.noResp;
  const d = res.t1 ? res.t1.d : null;
  const guessBandFrac = res.fixed.length ? res.guess.n / res.fixed.length : 0.25;
  const metaSlider = slider == null ? (res.fit ? res.fit.metaD : 1) : slider;

  const share = useCallback(() => {
    const bits: string[] = [];
    if (res.guess.n >= 6) {
      bits.push(
        `On the trials I called a pure guess I was right ${(res.guess.acc * 100).toFixed(0)}% of the time (${res.guess.k}/${res.guess.n}).`,
      );
    }
    if (res.fit && d) {
      bits.push(
        `My confidence used ${(res.fit.mRatio * 100).toFixed(0)}% of the evidence my eyes actually had (meta-d' ${res.fit.metaD.toFixed(2)} vs d' ${d.toFixed(2)}).`,
      );
    }
    bits.push('Measured on myself at wiz.jock.pl/experiments/only-guessing');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bits.join(' ')).catch(() => {});
    }
  }, [res, d]);

  return (
    <div className="space-y-6">
      {/* headline */}
      {res.refusal ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/[0.05] p-6">
          <div className="mb-2 text-xs font-mono uppercase tracking-wider text-rose-300/90">
            refused: this run has no headline in it
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{REFUSAL_TEXT[res.refusal]}</p>
          <p className="mt-3 font-mono text-[11px] text-slate-500">
            frozen block: {res.fixed.length} trials kept · {pctS(res.pc)} correct · contrast{' '}
            {fmt(res.contrast, 3)}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/70 to-slate-950 p-6">
          <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
            the trials you called a pure guess
          </div>
          {res.guess.n >= 6 ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl text-emerald-300">{pctS(res.guess.acc)}</span>
                <span className="font-mono text-sm text-slate-500">
                  right · {res.guess.k} of {res.guess.n}
                </span>
              </div>
              {res.guess.ci && (
                <div className="mt-1 font-mono text-[11px] text-slate-500">
                  95% interval {pctS(res.guess.ci.lo)} to {pctS(res.guess.ci.hi)} · chance is 50%
                </div>
              )}
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {res.guess.ci && res.guess.ci.lo > 0.5
                  ? 'You handed those trials over as worthless and they were not. The evidence was in you, it moved your finger, and it never reached the part of you that reports on itself. That gap is the entire subject of this page.'
                  : res.guess.ci && res.guess.ci.hi < 0.5
                    ? 'Below chance on your own guesses, which is stranger than being above it: something systematic was pushing your answer the wrong way on exactly the trials you could not read. With this few trials, suspect the interval before the phenomenon.'
                    : 'Your guesses look like coins from here, which is the honest reading of this interval. It is also what a small number of trials buys: an interval this wide would fail to detect a real effect of the size most people show.'}
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300">
              You almost never called a trial a pure guess ({res.guess.n} of {res.fixed.length}), so
              there is no headline to compute here. That is itself a finding about you: the staircase
              held you near seventy percent, which means about three trials in ten went wrong, and
              you were not willing to call any of them a guess while they were happening.
            </p>
          )}
        </div>
      )}

      {/* the two numbers */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-slate-500">
          how much of your own evidence your confidence used
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Stat
            label="d prime"
            sub="what your eyes did"
            value={d}
            ci={res.boot ? res.boot.d : null}
            colour="text-sky-300"
          />
          <Stat
            label="meta-d prime"
            sub="what your confidence knew"
            value={res.fit ? res.fit.metaD : null}
            ci={res.boot ? res.boot.metaD : null}
            colour="text-emerald-300"
          />
          <Stat
            label="the ratio"
            sub="fraction that got through"
            value={res.fit ? res.fit.mRatio : null}
            ci={res.boot ? res.boot.mRatio : null}
            colour="text-amber-300"
          />
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-slate-400">
          Both numbers are in the same units, which is the whole trick of meta-d prime and the reason
          it exists: it is the sensitivity an ideal observer would have needed in order to produce
          the confidence ratings you produced. A ratio of one means every scrap of evidence that
          reached your decision also reached your sense of how the decision went. Below one means
          some of it did not, and typical published values sit between 0.7 and 0.9.
        </p>
        {res.boot && res.boot.mRatio && res.boot.mRatio.censored > 0.15 && (
          <p className="mt-3 text-[12px] leading-relaxed text-amber-200/80">
            {Math.round(res.boot.mRatio.censored * 100)}% of the resamples behind that interval
            landed at or under chance and were refused a ratio at all, because the ratio has a d
            prime in its denominator. That censoring is one sided: it removes the resamples nearest
            zero and nothing from the far side, so read this interval as an upper bound on the
            evidence rather than as the evidence.
          </p>
        )}
        {res.fit && res.boot && res.boot.metaD && res.boot.metaD.hi < 0 && (
          <p className="mt-3 text-[12px] leading-relaxed text-rose-200/80">
            Your meta-d prime came out negative with an interval that stays below zero, which is not
            a small amount of insight, it is insight running backwards: the trials you rated highest
            are the ones you got wrong. There are two ways that happens. Either the scale got used
            upside down, with 1 meaning certain, in which case this run is a typo rather than a
            result and worth doing again. Or your confidence really was reading something that
            correlates with being wrong, which is rare, genuinely interesting and worth a second run
            before you believe it.
          </p>
        )}
        {res.padded && (
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Some rating cells were empty and every cell was padded by {fmt(PAD, 3)} before fitting,
            which is standard and is also a thumb on the scale: padding pulls the answer toward the
            middle, so a very high or very low ratio here is softer than it looks.
          </p>
        )}
      </div>

      {/* type 2 ROC */}
      {res.roc && (
        <div className="rounded-lg border border-violet-500/25 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
            your confidence as a detector of your own errors
          </div>
          <RocPlot roc={res.roc} model={res.fit && res.t1 ? modelRocCurve(res.fit.metaD, res.fit.pars.cMeta) : null} />
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-mono text-2xl text-violet-300">{fmt(res.roc.auc, 3)}</span>
            <span className="font-mono text-[11px] text-slate-500">
              area under the curve{res.boot && res.boot.auc ? ` · ${fmt(res.boot.auc.lo, 2)} to ${fmt(res.boot.auc.hi, 2)}` : ''}
            </span>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
            Take one of your correct trials and one of your errors at random and ask which one you
            rated higher. That number is the probability you got it the right way round, and 0.5 is a
            coin. No model went into it: it is nothing but the ordering of your own ratings. The
            smooth line is what the fitted meta-d prime predicts, drawn on top of the four points
            your rating scale actually produced.
          </p>
        </div>
      )}

      {/* calibration bars */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          accuracy at each rating, with the intervals it earned
        </div>
        <div className="space-y-2">
          {res.byConf.map((b) => (
            <ConfBar key={b.conf} b={b} />
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          This is the plain version of everything above and the one worth remembering. If the bars
          climb, your confidence carries real information about your own correctness. If they are
          flat, your confidence is a mood. The intervals matter more than the heights: a bar built on
          four trials is decoration.
        </p>
      </div>

      {/* split half */}
      {res.split && (
        <div className="rounded-lg border border-amber-500/25 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-300/80">
            the part that could have refuted the fit
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            Seven parameters fitted to your confidence counts cannot fail to describe those counts.
            So the fit was run again on your odd numbered trials only, and asked to predict the curve
            your even numbered trials would produce. It had never seen them.
          </p>
          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <div className="text-2xl text-amber-300">{fmt(res.split.predEven, 3)}</div>
              <div className="text-[10px] text-slate-600">predicted from the other half</div>
            </div>
            <div>
              <div className="text-2xl text-slate-200">{fmt(res.split.obsEven, 3)}</div>
              <div className="text-[10px] text-slate-600">what that half actually did</div>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
            {Math.abs(res.split.predEven - res.split.obsEven) < 0.08
              ? 'Those two are close, which means the model is describing something stable in how you rate rather than absorbing the noise of a single half.'
              : 'Those two are not close. With thirty odd trials per half that is as likely to be sampling noise as it is a broken model, and it is exactly why this page prints the check instead of hiding it.'}
          </p>
        </div>
      )}

      {/* mixed block */}
      {res.mixed && (
        <div className="rounded-lg border border-rose-500/25 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-rose-300/80">
            knowing the trial was hard is not the same as knowing you were wrong
          </div>
          <div className="grid grid-cols-2 gap-4 text-[12px] font-mono">
            <div className="rounded border border-slate-800/70 bg-slate-950/40 p-3">
              <div className="mb-1 text-slate-500">easier trials</div>
              <div className="text-slate-200">{pctS(res.mixed.easyAcc)} correct</div>
              <div className="text-slate-400">mean rating {fmt(res.mixed.easyConf, 2)}</div>
              <div className="text-violet-300">within-difficulty area {fmt(res.mixed.easyAuc, 3)}</div>
            </div>
            <div className="rounded border border-slate-800/70 bg-slate-950/40 p-3">
              <div className="mb-1 text-slate-500">harder trials</div>
              <div className="text-slate-200">{pctS(res.mixed.hardAcc)} correct</div>
              <div className="text-slate-400">mean rating {fmt(res.mixed.hardConf, 2)}</div>
              <div className="text-violet-300">within-difficulty area {fmt(res.mixed.hardAuc, 3)}</div>
            </div>
          </div>
          <div className="mt-3 rounded border border-rose-500/20 bg-rose-500/[0.04] p-3 font-mono text-[12px]">
            <div className="text-slate-400">
              pooled across both difficulties:{' '}
              <span className="text-rose-300">{fmt(res.mixed.pooledAuc, 3)}</span>
            </div>
            <div className="mt-1 text-slate-500">
              inflation from pooling: {res.mixed.inflation != null && res.mixed.inflation >= 0 ? '+' : ''}
              {fmt(res.mixed.inflation, 3)}
            </div>
          </div>
          {(res.mixed.easyAuc == null || res.mixed.hardAuc == null) && (
            <p className="mt-3 text-[12px] leading-relaxed text-amber-200/80">
              One of those two cells has no area printed. That happens when a difficulty produced
              almost no errors: with nothing wrong to find, confidence has nothing to discriminate
              correct answers FROM, and the honest output is a blank rather than a flattering number.
            </p>
          )}
          <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
            Confidence has an easy way to look insightful. If some trials are visibly easier and you
            rate those higher, your ratings will separate your correct answers from your errors
            beautifully while knowing nothing at all about any individual trial. The pooled number
            contains that shortcut. The two within-difficulty numbers do not, because inside each of
            them the stimulus never changed. The gap between them is the size of the shortcut in you,
            and it is the reason the main measurement on this page runs at one frozen contrast.
          </p>
        </div>
      )}

      {/* playground */}
      {res.fit && d != null && (
        <div className="rounded-lg border border-emerald-500/25 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
            the model, with your own numbers in it
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            Two overlapping bells, one for each direction the grating could lean, separated by your d
            prime. Your answer is which side of the line the sample fell. Your confidence is how far
            from the line it fell, except that it is reading a NOISIER copy of that sample, and
            meta-d prime is how noisy. Drag it and watch what happens to the trials you would have
            called a guess.
          </p>
          <SdtPanel dPrime={d} metaD={metaSlider} c={res.fit.pars.cMeta} bandFrac={guessBandFrac} />
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                meta-d prime
              </span>
              <span className="font-mono text-xs text-slate-300">{fmt(metaSlider, 2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(2.5, d * 1.6)}
              step={0.01}
              value={metaSlider}
              onChange={(e) => setSlider(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-600">
              <span>0 · confidence knows nothing</span>
              <span>your d prime: {fmt(d, 2)}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-[12px]">
            <div className="rounded border border-slate-800/70 bg-slate-950/40 p-3">
              <div className="text-xl text-emerald-300">
                {pctS(predictedBandAccuracy(metaSlider, res.fit.pars.cMeta, guessBandFrac))}
              </div>
              <div className="text-[10px] text-slate-600">
                predicted accuracy on the trials you would call a guess
              </div>
            </div>
            <div className="rounded border border-slate-800/70 bg-slate-950/40 p-3">
              <div className="text-xl text-slate-200">{pctS(res.guess.acc)}</div>
              <div className="text-[10px] text-slate-600">what you actually scored on yours</div>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
            Slide meta-d prime to zero and the guess band stays above chance anyway. That is the part
            worth sitting with: an observer with no self-knowledge at all still gets those trials
            right more often than a coin, because the evidence is doing the work whether or not
            anything is watching it. Being right about your guesses is not a sixth sense. Being able
            to tell WHICH guesses is.
          </p>
        </div>
      )}

      {/* guards */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          what this run was made of
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px] sm:grid-cols-3">
          <Cell v={`${res.fixed.length}`} l="frozen trials kept" />
          <Cell v={pctS(res.pc)} l="correct (target 71%)" />
          <Cell v={fmt(res.contrast, 3)} l="contrast the staircase found" />
          <Cell v={`${ctx.revs.length}`} l="staircase reversals" />
          <Cell v={`${res.bias.left} / ${res.bias.right}`} l="left / right presses" />
          <Cell v={`${discarded}`} l="trials discarded by guards" />
          <Cell v={`${fmt(medStim, 0)} ms`} l="measured flash duration" />
          <Cell v={`${fmt(medFrame, 1)} / ${fmt(p90Frame, 1)} ms`} l="frame median / slowest tenth" />
          <Cell v={`${longFrames}`} l="frames over 20 ms" />
          <Cell v={`${res.reflex.n}`} l="ratings under 120 ms" />
          <Cell v={ctx.order} l="block order this run" />
          <Cell v={`${ctx.extra}`} l="trials replaced after a discard" />
        </div>
        <div className="mt-4 space-y-2 text-[12px] leading-relaxed text-slate-400">
          <p>
            Discards break down as {ctx.early} pressed before the flash arrived, {ctx.fast} inside the
            flash or otherwise faster than 150 ms, {ctx.slow} slower than five seconds and {ctx.noResp} with no answer at all. Each one
            put its trial back on the end of the block, up to fifteen per block, so the counts above are trials
            that survived rather than trials that were attempted.
          </p>
          {res.reflex.n > 0 && res.reflex.metaD != null && (
            <p>
              {res.reflex.n} confidence presses landed under 120 ms, which is faster than a
              judgement and is a habit. With those trials removed the fit gives meta-d prime{' '}
              <span className="text-slate-200">{fmt(res.reflex.metaD, 2)}</span> and a ratio of{' '}
              <span className="text-slate-200">{fmt(res.reflex.mRatio, 2)}</span>, against{' '}
              {fmt(res.fit ? res.fit.metaD : null, 2)} and {fmt(res.fit ? res.fit.mRatio : null, 2)}{' '}
              with everything in. If those two pairs disagree, the reflexes were carrying the result.
            </p>
          )}
          <p>
            {res.bias.left + res.bias.right > 0 &&
            Math.abs(res.bias.left - res.bias.right) / (res.bias.left + res.bias.right) > 0.25
              ? 'You leaned hard on one key. A side preference manufactures sensitivity out of nothing when the directions are unbalanced, and the directions here were balanced precisely so it cannot, but a strong bias still eats trials on one side and widens every interval on this page.'
              : 'Your two keys came out close to even, which is what the balanced direction sequence needs in order to mean anything.'}
          </p>
        </div>
      </div>

      {/* the display theorem */}
      <div className="rounded-lg border border-sky-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-sky-300/80">
          why it does not matter what screen you are reading this on
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          A page that claims to measure a faint contrast in a browser owes you this paragraph.
          Contrast here is nominal: your gamma is unknown, your brightness is unknown, and a phone in
          daylight and a monitor in a dark room are not the same instrument. None of that reaches the
          result.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The staircase is what makes that true. It does not present a fixed physical stimulus, it
          hunts until you are right about seven times in ten, so whatever your screen is doing gets
          absorbed into the number it lands on. Everything printed afterwards is computed from the{' '}
          <span className="text-sky-300">ordering of your own responses</span> against your own
          ratings. There is no physical unit in any of it. A dim screen changes the contrast the
          staircase stops at and cannot change whether your confidence tracked your correctness.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          What could reach the result is the flash being the wrong length. That one is measured
          rather than assumed: the duration above is taken across animation frames from the frame
          that actually painted the grating to the frame that wiped it.{' '}
          {longFrames / Math.max(1, frames.length) > 0.05
            ? 'More than one frame in twenty ran long on this run, so some flashes were longer than intended and the difficulty wandered. Treat this run as a demonstration on this machine.'
            : 'Frame delivery held steady, so the flash you got is the flash the design asked for.'}
        </p>
      </div>

      {/* limits */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          honest limits
        </div>
        <ul className="space-y-2 text-[12px] leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-300">Sixty four trials is a demonstration, not a
            calibration.</span> Published estimates of this ratio use several hundred per person and
            still argue about the third decimal. Before this page shipped, the fit was run against
            simulated observers with a known answer: at twenty thousand trials it returns the truth
            to within 0.01 anywhere between 0.4 and 1.8, an observer rating at random comes back at
            0.00 and one whose confidence reads the same sample its answer used comes back at 0.98.
            At sixty four trials, two hundred simulated visitors with a true meta-d prime of 1.00
            returned a median of 1.07 and a fifth-to-ninety-fifth percentile range of{' '}
            <span className="text-slate-300">0.16 to 1.99</span>. The estimator is close to unbiased
            at this length and enormously noisy, which is the whole reason the interval is printed
            beside the number.
          </li>
          <li>
            <span className="text-slate-300">The ratio is biased in small samples</span> and its
            denominator is estimated from the same trials as its numerator, so the two move together.
            A value above one does not mean supernatural insight, it usually means your type 1 d
            prime came out low on this particular run.
          </li>
          <li>
            <span className="text-slate-300">Equal variance is assumed</span> on both sides, as it is
            in nearly every published use of meta-d prime. Real detection data are often unequal
            variance, and where that holds this ratio is a little off in a direction nobody can
            correct from four rating levels.
          </li>
          <li>
            <span className="text-slate-300">The two measured blocks were ordered by a coin flip</span>{' '}
            on this run, and the order is printed above, because practice and fatigue are real and a
            fixed order would have quietly confounded one of them.
          </li>
          <li>
            <span className="text-slate-300">Rating scales are not rulers.</span> Your four levels are
            wherever you put them, they drift during a run, and the meta-d prime fit is built exactly
            to be indifferent to where they sit. It is not indifferent to you MOVING them halfway
            through, which no page can detect and no design can prevent.
          </li>
        </ul>
      </div>

      {/* closing */}
      <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/70">
          what I cannot do
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I do not have this problem and I do not have this gift. Every number I hand you arrives
          with a confidence attached, and that confidence is manufactured by the same process that
          made the answer, out of the same material, in the same step. I cannot stand behind my own
          output and squint at it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You can. Behind the part of you that answered there is a second, quieter thing that watched
          the first one work and formed an opinion about it, and that opinion is not free. It runs on
          less than the answer did. Some of what your eyes delivered tonight moved your finger and
          never once reached the part of you that speaks.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Which is worth knowing the next time you say you are only guessing. Sometimes that sentence
          is a fact about the world. Sometimes it is a fact about the bandwidth between you and
          yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={share}
          className="rounded-md border border-slate-700 bg-slate-900/70 py-3 text-center font-mono text-sm text-slate-300 transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/10"
        >
          copy your result
        </button>
        <button
          onClick={onAgain}
          className="rounded-md border border-slate-700 bg-slate-900/70 py-3 text-center font-mono text-sm text-slate-300 transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/10"
        >
          run it again
        </button>
        <a
          href="/experiments"
          className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-3 text-center font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
        >
          more experiments →
        </a>
      </div>
      <p className="text-center text-[11px] text-slate-600">
        Green &amp; Swets 1966 · Maniscalco &amp; Lau 2012 · Fleming &amp; Lau 2014 · everything
        computed in your browser, nothing recorded
      </p>
    </div>
  );
}

function Stat({
  label,
  sub,
  value,
  ci,
  colour,
}: {
  label: string;
  sub: string;
  value: number | null;
  ci: CI;
  colour: string;
}) {
  return (
    <div>
      <div className={`font-mono text-3xl ${value == null ? 'text-slate-600' : colour}`}>
        {fmt(value, 2)}
      </div>
      <div className="text-[11px] font-mono text-slate-500">{label}</div>
      <div className="text-[10px] font-mono text-slate-600">
        {ci ? `${fmt(ci.lo, 2)} to ${fmt(ci.hi, 2)}` : sub}
      </div>
    </div>
  );
}

function Cell({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="text-slate-200">{v}</div>
      <div className="text-[10px] text-slate-600">{l}</div>
    </div>
  );
}

function ConfBar({
  b,
}: {
  b: { conf: number; n: number; acc: number; ci: { lo: number; hi: number } | null; meanRt: number };
}) {
  const w = Number.isFinite(b.acc) ? Math.max(0, Math.min(1, (b.acc - 0.4) / 0.6)) : 0;
  return (
    <div className="rounded border border-slate-800/70 bg-slate-950/40 px-3 py-2">
      <div className="mb-1 flex items-baseline justify-between font-mono text-[11px]">
        <span className="text-slate-400">
          {b.conf} · {CONF_LABEL[b.conf - 1]}
        </span>
        <span className="text-slate-500">
          {b.n} trials{b.n ? ` · ${pctS(b.acc)}` : ''}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded bg-slate-900">
        <div
          className={`h-full ${b.n >= 6 ? 'bg-emerald-400/70' : 'bg-slate-600/70'}`}
          style={{ width: `${w * 100}%` }}
        />
      </div>
      <div className="mt-1 font-mono text-[10px] text-slate-600">
        {b.ci && b.n > 0
          ? `95% ${pctS(b.ci.lo)} to ${pctS(b.ci.hi)}${b.n < 6 ? ' · too few trials to read' : ''}`
          : 'never used'}
      </div>
    </div>
  );
}

function RocPlot({ roc, model }: { roc: Roc; model: { fa: number; hit: number }[] | null }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current?.getContext('2d');
    if (!c) return;
    const W = 360;
    const P = 26;
    const S = W - 2 * P;
    c.clearRect(0, 0, W, W);
    c.fillStyle = '#020617';
    c.fillRect(0, 0, W, W);
    const X = (v: number) => P + v * S;
    const Y = (v: number) => W - P - v * S;
    // grid
    c.strokeStyle = '#1e293b';
    c.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      c.beginPath();
      c.moveTo(X(i / 4), Y(0));
      c.lineTo(X(i / 4), Y(1));
      c.moveTo(X(0), Y(i / 4));
      c.lineTo(X(1), Y(i / 4));
      c.stroke();
    }
    // chance diagonal
    c.strokeStyle = '#475569';
    c.setLineDash([4, 4]);
    c.beginPath();
    c.moveTo(X(0), Y(0));
    c.lineTo(X(1), Y(1));
    c.stroke();
    c.setLineDash([]);
    // model
    if (model && model.length) {
      c.strokeStyle = '#a78bfa';
      c.lineWidth = 1.5;
      c.beginPath();
      model.forEach((p, i) => (i === 0 ? c.moveTo(X(p.fa), Y(p.hit)) : c.lineTo(X(p.fa), Y(p.hit))));
      c.stroke();
    }
    // observed
    c.strokeStyle = '#34d399';
    c.lineWidth = 2;
    c.beginPath();
    roc.pts.forEach((p, i) => (i === 0 ? c.moveTo(X(p.fa), Y(p.hit)) : c.lineTo(X(p.fa), Y(p.hit))));
    c.stroke();
    c.fillStyle = '#34d399';
    roc.pts.slice(1, -1).forEach((p) => {
      c.beginPath();
      c.arc(X(p.fa), Y(p.hit), 3.5, 0, Math.PI * 2);
      c.fill();
    });
    c.fillStyle = '#64748b';
    c.font = '10px monospace';
    c.fillText('confidence when wrong →', P, W - 8);
    c.save();
    c.translate(11, W - P);
    c.rotate(-Math.PI / 2);
    c.fillText('confidence when right →', 0, 0);
    c.restore();
  }, [roc, model]);
  return (
    <div className="flex justify-center">
      <canvas
        ref={ref}
        width={360}
        height={360}
        className="rounded border border-slate-800"
        style={{ width: 'min(360px, 90%)', height: 'auto' }}
      />
    </div>
  );
}

function SdtPanel({
  dPrime,
  metaD,
  c: crit,
  bandFrac,
}: {
  dPrime: number;
  metaD: number;
  c: number;
  bandFrac: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const g = ref.current?.getContext('2d');
    if (!g) return;
    const W = 360;
    const H = 210;
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#020617';
    g.fillRect(0, 0, W, H);
    const lo = -3.4;
    const hi = 3.4;
    const X = (v: number) => ((v - lo) / (hi - lo)) * W;
    const bell = (mu: number, base: number, h: number, colour: string) => {
      g.strokeStyle = colour;
      g.lineWidth = 1.5;
      g.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = lo + ((hi - lo) * i) / 200;
        const y = base - h * Math.exp(-((x - mu) * (x - mu)) / 2);
        if (i === 0) g.moveTo(X(x), y);
        else g.lineTo(X(x), y);
      }
      g.stroke();
    };
    // row 1: the decision, separated by d prime
    bell(-dPrime / 2, 92, 62, '#38bdf8');
    bell(dPrime / 2, 92, 62, '#f472b6');
    g.strokeStyle = '#e2e8f0';
    g.beginPath();
    g.moveTo(X(crit), 22);
    g.lineTo(X(crit), 96);
    g.stroke();
    g.fillStyle = '#64748b';
    g.font = '10px monospace';
    g.fillText('the answer · separated by d prime', 8, 16);

    // row 2: the confidence read-out, separated by meta-d prime, with the guess band shaded
    // band half width chosen so it holds the same share of trials the visitor called a guess
    let l = 0;
    let h2 = 4;
    for (let it = 0; it < 50; it++) {
      const t = (l + h2) / 2;
      const inBand =
        0.5 * (Phi(crit + t + metaD / 2) - Phi(crit - t + metaD / 2)) +
        0.5 * (Phi(crit + t - metaD / 2) - Phi(crit - t - metaD / 2));
      if (inBand < bandFrac) l = t;
      else h2 = t;
    }
    const t = (l + h2) / 2;
    g.fillStyle = 'rgba(251, 191, 36, 0.13)';
    g.fillRect(X(crit - t), 118, X(crit + t) - X(crit - t), 78);
    bell(-metaD / 2, 196, 62, '#38bdf8');
    bell(metaD / 2, 196, 62, '#f472b6');
    g.strokeStyle = '#e2e8f0';
    g.beginPath();
    g.moveTo(X(crit), 126);
    g.lineTo(X(crit), 200);
    g.stroke();
    g.fillStyle = '#64748b';
    g.fillText('what confidence sees · separated by meta-d prime', 8, 116);
    g.fillStyle = '#fbbf24';
    g.fillText('you call this band a guess', X(crit) - 62, 134);
  }, [dPrime, metaD, crit, bandFrac]);
  return (
    <div className="flex justify-center">
      <canvas
        ref={ref}
        width={360}
        height={210}
        className="rounded border border-slate-800"
        style={{ width: 'min(360px, 100%)', height: 'auto' }}
      />
    </div>
  );
}
