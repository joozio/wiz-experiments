'use client';

// NEITHER ONE WON  (two signals at once beat the faster of them by more than any race between
// them could produce, which means they were never racing)
//
// The sixty-seventh piece in this lab. The seven before it priced decisions: the hand as a channel
// (Fitts), choosing as a channel (Hick and Hyman), the queue that runs one decision at a time, the
// price of changing which decision you are making, the price of cancelling one already moving, the
// rate at which you search a list held in your head, and the cost of a location nobody asked for.
//
// This one goes underneath all of them and asks what a signal IS.
//
// THE TASK, and it is the simplest one in the lab.
//
// Press the key the instant you notice anything. Sometimes a flash. Sometimes a click. Sometimes
// both together. There is nothing to decide, nothing to get wrong, one key.
//
// Both together is faster than either alone. That much is obvious and it has a boring explanation
// that has been on the table since Raab wrote it down in 1962: two independent processes are
// running and the response goes as soon as the FIRST of them finishes. Two lottery tickets win
// more often than one. Nothing is being combined. It is a race, and the winner is whichever
// channel happened to be quick on that trial. Raab called it statistical facilitation and it
// predicts a speed-up out of pure arithmetic, with no cooperation between the senses anywhere.
//
// THE INEQUALITY, which is the whole page.
//
// In 1982 Jeff Miller noticed that the race story is not just a story, it is a CONSTRAINT, and it
// can be violated by data (Cognitive Psychology 14, 247). If the response on a redundant trial is
// whichever of two processes finishes first, then for every time t:
//
//     P(RT_both <= t)  <=  P(RT_flash <= t) + P(RT_click <= t)
//
// and that holds no matter how the two channels are correlated, including the worst case where
// they conspire to never be fast on the same trial. It is a Frechet bound, not an assumption. The
// right hand side is measurable: those are the two single-signal conditions, collected from the
// same fingers in the same blocks. So the race model is not a matter of taste. It is a line, and
// you can be on the wrong side of it.
//
// People are on the wrong side of it. Reliably, at the fast end of their own distribution, by ten
// to thirty milliseconds. Which means the two signals were not racing. Something downstream added
// them together before anything decided to move, and the click made the flash arrive sooner than
// the flash can arrive on its own.
//
// WHY THE HEADLINE IS CLEAN OF YOUR HARDWARE, and this one took real care.
//
// Every reaction time here contains your display's lag, your keyboard's scan interval and your
// audio device's output delay, and the audio delay is the nasty one because it belongs to only one
// of the two channels and can be a hundred milliseconds on a bluetooth speaker.
//
// It cancels anyway, and exactly, for a reason worth stating slowly. Suppose your sound really
// comes out L milliseconds after this page thinks it does. Then every click-only reaction time
// measured here is the true one plus L, because the page starts its clock at the moment it asked
// for the sound. On a both-together trial the page starts the same clock at the same moment. So a
// response driven by the sound is late by exactly the same L, and a response driven by the flash
// is not late at all, and that is precisely the pair of marginal distributions the inequality is
// written over. Feed measured times into both sides and the bound is exactly right for a device
// nobody measured. No calibration step, no assumption, no correction to get wrong.
//
// The same argument covers the fact that a flash lands on a video frame and a click does not. The
// page never claims the two arrive together. It MEASURES the gap on every single trial, prints the
// average, and puts the measured gap into the inequality as a shift, which is what the inequality
// asks for anyway when one signal is delayed.
//
// TWO NULLS, BOTH EXACT, neither of them a t test.
//
// This is a single visitor, so there is no group to average over and no t test to run, and the
// usual practice of testing a violation across twenty undergraduates is not available. Instead the
// page builds the null distributions out of your own trials.
//
//   the independent race    your click trials and your flash trials are paired at random and the
//                           faster of each pair is taken. That is Raab's model, running on your
//                           own two channels. Eight hundred of them.
//
//   the fastest race there  your click trials sorted upward, your flash trials sorted DOWNWARD,
//   is                      paired, faster of each taken. That coupling is the one that makes the
//                           two channels avoid being fast together as hard as arithmetic allows,
//                           and its distribution is exactly the Miller bound. Not near it. Equal
//                           to it. So the strong claim gets an exact non parametric null too.
//
// Both nulls resample the single-signal conditions the same way the real bound does, so every
// source of noise in the real statistic is in the null as well.
//
// And they will usually agree, which is worth saying out loud rather than leaving as a coincidence
// the visitor notices. The independent race is Fa + Fv minus Fa*Fv and the bound is Fa + Fv, so
// the two differ by a PRODUCT of two small numbers at the fast end of the distribution, and a
// product of two small numbers is nearly nothing. At the fifth percentile the weak test and the
// strong test are almost the same test. They only come apart in the middle, which is exactly where
// nobody has ever found a violation. That is not a flaw in either null. It is the reason a Miller
// violation is a real result: at the only place it can be looked for, the weakest race and the
// fastest conceivable race make the same prediction, and people beat both.
//
// THE BLOCK THAT COULD KILL IT, run in the middle rather than confessed in the limitations.
//
// There is a boring explanation for a violation as well: two things at once are simply a bigger
// event, and a bigger event is more alerting, and alertness is speed. If that were the whole story
// it would not matter that one of the signals was a sound.
//
// So one block replaces the click with a second flash, on the other side of the screen. Same
// count, same suddenness, more total light on the display than the click ever added. Under the
// alerting story that block violates the bound at least as hard. Under the pooling story it
// violates it much less, because two flashes are two draws on largely the same machinery and that
// is what a race actually looks like.
//
// THE PREDICTION THE FIT NEVER SAW, and the race gets to make it with no free parameters at all.
//
// Your ear beats your eye by thirty to sixty milliseconds. So on a both-together trial the sound
// has already arrived and half finished by the time the flash lands, which is a strange way to run
// an experiment about combining two things.
//
// The last block fixes that. The three main blocks are closed, your own click and flash latencies
// are read off them, and the click is DELAYED by the difference, so that the two channels arrive
// at whatever decides to move at the same moment for the first time. Then two rivals commit, in
// public, on the screen, before the block opens:
//
//   the race                the bound with one channel shifted by D is P(flash <= t) + P(click <=
//                           t minus D), and every term of that is already measured and closed. It
//                           names the fifteenth percentile of the coming block to the millisecond
//                           and has nothing left to adjust.
//
//   pooling with a window   the same number minus the gain you already showed, and MORE than that,
//                           because if the two channels are being added then adding them while
//                           they overlap should work better than adding them while one is half
//                           finished.
//
// They disagree in direction, and the intuition on the block is the natural one: that delaying a
// signal on purpose must make the pair worse.
//
// WHAT THIS PAGE CANNOT TELL YOU, and it is the most important paragraph here.
//
// The inequality has one assumption and it is invisible in the data: context invariance (Luce
// 1986; Ashby and Townsend 1986; Miller 2016). The right hand side is measured on trials where
// only one signal was present, and it is being used to describe how that same channel behaves on
// trials where the other one was there too. If your eye is genuinely faster when there is also a
// sound, for any reason at all, including simply expecting more, then the two sides of the
// inequality are not about the same thing and a violation proves nothing about pooling.
//
// No amount of data from this page, or any page, or any laboratory using this comparison alone,
// can rule that out. It is not a limitation of the sample size. It is a limitation of the
// measurement, and everybody who reports a Miller violation is standing on it, usually in a
// footnote. This page puts it in the results instead.
//
// THE THINGS THAT WOULD QUIETLY RUIN IT, handled in the generator rather than the write-up:
//
//   . guessing. A response fired before the signal lands is a fast time in whatever condition it
//     happens to fall in, and enough of them forge a violation. One trial in eleven has NO signal
//     at all, the false alarm rate is measured, printed, and a run over twenty percent is refused
//     rather than scored.
//
//   . rhythm. A fixed wait teaches your hand to leave before the signal. The wait is drawn from a
//     shifted exponential, which is the one distribution whose remaining wait does not shorten
//     while you sit there.
//
//   . the frame. A flash cannot begin between two frames, so a flash onset is taken from the frame
//     AFTER the one that painted it, and the page meters your real frame intervals for the whole
//     session and prints the quantum it found.
//
//   . the tab. Trials taken while the tab was in the background are killed rather than scored,
//     because a throttled timer is a reaction time with a lie in it.
//
//   . order. Conditions are shuffled inside every block, never blocked, so drift over ten minutes
//     lands on all three of them equally.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ============================ constants ============================

const ITI = 300;
const FP_MIN = 550;
const FP_MEAN = 450;
const FP_MAX = 2400;

const RESP_WINDOW = 1000;
const CATCH_WINDOW = 1300;
const FB_MS = 620;

const RT_FLOOR = 100;

const FLASH_MS = 60;
const CLICK_MS = 12;
const CLICK_HZ = 1050;

const PRACTICE_N = 18;
const MAIN_PER_COND = 20;
const MAIN_CATCH = 6;
const CTRL_PER_COND = 16;
const CTRL_CATCH = 5;
const HELD_PER_COND = 22;
const HELD_CATCH = 6;

const PCTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90];
const FAST_PCTS = [5, 10, 15, 20, 25];
const HEADLINE_PCT = 15;

const MIN_CELL = 30;
const MAX_OMIT = 0.12;
const MAX_FA = 0.2;
const MAX_EARLY = 0.06;
const MAX_HIDDEN = 0.15;

const BOOTS = 700;
const NULLS = 700;

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

function sd(a: number[]) {
  if (a.length < 2) return NaN;
  const m = mean(a);
  let s = 0;
  for (const v of a) s += (v - m) * (v - m);
  return Math.sqrt(s / (a.length - 1));
}

function sortedCopy(a: number[]) {
  return a.slice().sort((x, y) => x - y);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function resampleInto(src: number[], out: number[], n: number) {
  const m = src.length;
  for (let i = 0; i < n; i++) out[i] = src[(Math.random() * m) | 0];
  out.length = n;
}

function ciOf(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  if (!vals.length) return [NaN, NaN];
  const s = sortedCopy(vals);
  const pick = (q: number) => s[clamp(Math.round(q * (s.length - 1)), 0, s.length - 1)];
  return [pick(lo), pick(hi)];
}

type Stat = { n: number; m: number; ci: [number, number] };

function statOf(m: number, boots: number[], n: number): Stat {
  return { n, m, ci: ciOf(boots) };
}

// The distribution function this page uses everywhere, and it is one choice made once. An ordered
// sample x_1..x_n is read as a piecewise linear climb through the points (x_i, (i - 0.5)/n), held
// flat at zero below the fastest observation and at one above the slowest. Clamping the tails that
// way UNDERSTATES the two single-signal functions at the fast end, which makes the bound smaller,
// which makes a violation harder to find. The conservative direction is the correct one to round
// in when the whole page is an attempt to break an inequality.
function cdfAt(sorted: number[], t: number): number {
  const n = sorted.length;
  if (!n) return NaN;
  if (t <= sorted[0]) return 0;
  if (t >= sorted[n - 1]) return 1;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= t) lo = mid;
    else hi = mid;
  }
  const span = sorted[hi] - sorted[lo];
  const f = span > 0 ? (t - sorted[lo]) / span : 0;
  return (lo + 0.5 + f) / n;
}

// The inverse of the same function, so that a quantile of the observed condition and a quantile of
// the bound are read off with one shared definition rather than two that nearly agree.
function invCdf(sorted: number[], p: number): number {
  const n = sorted.length;
  if (!n) return NaN;
  const h = p * n - 0.5;
  if (h <= 0) return sorted[0];
  if (h >= n - 1) return sorted[n - 1];
  const lo = Math.floor(h);
  return sorted[lo] + (h - lo) * (sorted[lo + 1] - sorted[lo]);
}

// B(t) = F_anchor(t) + F_other(t - tau), capped at one. tau is the MEASURED lag of the second
// channel behind the first, in the same milliseconds as the reaction times, so a delayed signal
// and an accidentally late video frame are the same kind of thing to this function.
function boundAt(anchor: number[], other: number[], tau: number, t: number): number {
  return Math.min(1, cdfAt(anchor, t) + cdfAt(other, t - tau));
}

function invBound(anchor: number[], other: number[], tau: number, p: number): number {
  let lo = Math.min(anchor[0], other[0] + tau) - 60;
  let hi = Math.max(anchor[anchor.length - 1], other[other.length - 1] + tau) + 60;
  if (!(lo < hi)) return NaN;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (boundAt(anchor, other, tau, mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The independent race, written out rather than simulated: P(min <= t) = Fa + Fo - Fa*Fo. This is
// Raab's actual model and it sits strictly inside the bound, so beating IT is the weak claim and
// beating the bound is the strong one. The page reports both and never lets them be confused.
function indepAt(anchor: number[], other: number[], tau: number, t: number): number {
  const a = cdfAt(anchor, t);
  const b = cdfAt(other, t - tau);
  return a + b - a * b;
}

function invIndep(anchor: number[], other: number[], tau: number, p: number): number {
  let lo = Math.min(anchor[0], other[0] + tau) - 60;
  let hi = Math.max(anchor[anchor.length - 1], other[other.length - 1] + tau) + 60;
  if (!(lo < hi)) return NaN;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (indepAt(anchor, other, tau, mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The Grice bound, the other end of the family: the SLOWEST any race can be, reached when the two
// channels are as positively coupled as arithmetic allows. Printed so that the observed curve has
// a floor as well as a ceiling and the phrase "inside the race family" means something on a plot.
function invGrice(anchor: number[], other: number[], tau: number, p: number): number {
  const a = invCdf(anchor, p);
  const b = invCdf(other, p) + tau;
  return Math.min(a, b);
}

function gainVector(
  anchor: number[],
  other: number[],
  red: number[],
  tau: number,
  pcts: number[],
): number[] {
  const out: number[] = [];
  for (const p of pcts) out.push(invBound(anchor, other, tau, p / 100) - invCdf(red, p / 100));
  return out;
}

function fastMean(gains: number[], pcts: number[]): number {
  const vals: number[] = [];
  for (let i = 0; i < pcts.length; i++) if (FAST_PCTS.includes(pcts[i])) vals.push(gains[i]);
  return mean(vals);
}

// ============================ what a trial is made of ============================

// 'a' and 'v' are the two channels. In an audiovisual pair 'a' is the click and 'v' is the flash.
// In a visual pair 'a' is the left flash and 'v' is the right one, so that every downstream
// function can stay ignorant of which senses it is looking at.
type Chan = 'a' | 'v';
type Pair = 'av' | 'vv';
type Cond = 'A' | 'V' | 'AV' | 'catch';
type BlockKind = 'practice' | 'main' | 'control' | 'held';

type Spec = {
  cond: Cond;
  pair: Pair;
  anchor: Chan;
  delay: number;
  fp: number;
};

type Block = {
  kind: BlockKind;
  label: string;
  blurb: string;
  scored: boolean;
  specs: Spec[];
};

// A shifted exponential. Its hazard is flat, which is the point: however long you have already
// waited, the expected remaining wait is the same, so there is no moment worth leaving early for.
function drawFp() {
  const u = Math.max(1e-6, Math.random());
  return clamp(FP_MIN - FP_MEAN * Math.log(u), FP_MIN, FP_MAX);
}

function condList(perCond: number, catchN: number): Cond[] {
  const out: Cond[] = [];
  for (let i = 0; i < perCond; i++) out.push('A', 'V', 'AV');
  for (let i = 0; i < catchN; i++) out.push('catch');
  return out;
}

// No more than three of the same condition in a row. A long run of redundant trials is a block of
// unusually easy trials sitting in one place, and any drift underneath it is then a difference
// between conditions that nobody put there.
function orderConds(list: Cond[]): Cond[] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const s = shuffle(list);
    let run = 1;
    let ok = true;
    for (let i = 1; i < s.length; i++) {
      run = s[i] === s[i - 1] ? run + 1 : 1;
      if (run > 3) {
        ok = false;
        break;
      }
    }
    if (ok) return s;
  }
  return shuffle(list);
}

function makeSpecs(conds: Cond[], pair: Pair, anchor: Chan, delay: number): Spec[] {
  return conds.map((cond) => ({ cond, pair, anchor, delay, fp: drawFp() }));
}

function buildPlan(soundOk: boolean): Block[] {
  const mainPair: Pair = soundOk ? 'av' : 'vv';
  const blocks: Block[] = [];

  blocks.push({
    kind: 'practice',
    label: 'warm up',
    blurb: 'not scored',
    scored: false,
    specs: makeSpecs(orderConds(condList(5, 3)).slice(0, PRACTICE_N), mainPair, 'a', 0),
  });

  const main = (n: number) => ({
    kind: 'main' as BlockKind,
    label: 'main',
    blurb: `block ${n} of 3`,
    scored: true,
    specs: makeSpecs(orderConds(condList(MAIN_PER_COND, MAIN_CATCH)), mainPair, 'a' as Chan, 0),
  });

  blocks.push(main(1));
  blocks.push(main(2));

  if (soundOk) {
    blocks.push({
      kind: 'control',
      label: 'two flashes',
      blurb: 'the block that could kill it',
      scored: true,
      specs: makeSpecs(orderConds(condList(CTRL_PER_COND, CTRL_CATCH)), 'vv', 'a', 0),
    });
  }

  blocks.push(main(3));

  blocks.push({
    kind: 'held',
    label: 'lined up',
    blurb: 'the prediction the fit never saw',
    scored: true,
    // anchor and delay are overwritten from the locked fit the moment the block opens
    specs: makeSpecs(orderConds(condList(HELD_PER_COND, HELD_CATCH)), mainPair, 'v', 60),
  });

  return blocks;
}

// ============================ the record ============================

type Trial = {
  block: number;
  kind: BlockKind;
  pair: Pair;
  cond: Cond;
  anchor: Chan;
  delay: number;
  rt: number;
  asy: number;
  responded: boolean;
  early: boolean;
  hidden: boolean;
  touch: boolean;
};

type PctRow = {
  p: number;
  obs: number;
  bound: number;
  indep: number;
  grice: number;
  gain: number;
  ci: [number, number];
};

type RaceFit = {
  ok: boolean;
  reason: string;
  nA: number;
  nV: number;
  nAV: number;
  meanA: number;
  meanV: number;
  meanAV: number;
  tau: number;
  tauSd: number;
  rse: Stat;
  gainFast: Stat;
  gainIndep: Stat;
  headline: Stat;
  pMiller: number;
  pIndep: number;
  rows: PctRow[];
  maxGain: { p: number; v: number };
};

type Locked = {
  ok: boolean;
  reason: string;
  meanA: number;
  meanV: number;
  d: number;
  anchor: Chan;
  gain: number;
  gainCi: [number, number];
  predRace: number;
  predPool: number;
  pct: number;
};

type Quality = {
  omit: number;
  fa: number;
  early: number;
  hidden: number;
  catchN: number;
  frameMs: number;
  frameJit: number;
  minutes: number;
  mode: 'keyboard' | 'touch' | 'mixed';
  soundOk: boolean;
  audioBase: number | null;
  audioOut: number | null;
  clockExact: boolean;
  drift: number;
};

type Result = {
  ok: boolean;
  reason: string;
  q: Quality;
  main: RaceFit | null;
  control: RaceFit | null;
  held: RaceFit | null;
  locked: Locked | null;
  heldObs: number;
  heldObsCi: [number, number];
  heldRaceErr: number;
  heldPoolErr: number;
  heldWinner: 'race' | 'pool' | 'neither';
  ctrlDiff: Stat | null;
};

function usable(t: Trial) {
  return (
    t.responded &&
    !t.hidden &&
    !t.early &&
    t.cond !== 'catch' &&
    Number.isFinite(t.rt) &&
    t.rt >= RT_FLOOR &&
    t.rt <= RESP_WINDOW
  );
}

// ============================ analysis ============================

function fitRace(rows: Trial[], label: string): RaceFit {
  const bad = (reason: string): RaceFit => ({
    ok: false,
    reason,
    nA: 0,
    nV: 0,
    nAV: 0,
    meanA: NaN,
    meanV: NaN,
    meanAV: NaN,
    tau: NaN,
    tauSd: NaN,
    rse: { n: 0, m: NaN, ci: [NaN, NaN] },
    gainFast: { n: 0, m: NaN, ci: [NaN, NaN] },
    gainIndep: { n: 0, m: NaN, ci: [NaN, NaN] },
    headline: { n: 0, m: NaN, ci: [NaN, NaN] },
    pMiller: NaN,
    pIndep: NaN,
    rows: [],
    maxGain: { p: NaN, v: NaN },
  });

  const good = rows.filter(usable);
  const anchorCond: Cond = rows.length && rows[0].anchor === 'a' ? 'A' : 'V';
  const otherCond: Cond = anchorCond === 'A' ? 'V' : 'A';

  const A = sortedCopy(good.filter((t) => t.cond === anchorCond).map((t) => t.rt));
  const V = sortedCopy(good.filter((t) => t.cond === otherCond).map((t) => t.rt));
  const R = sortedCopy(good.filter((t) => t.cond === 'AV').map((t) => t.rt));

  if (A.length < MIN_CELL || V.length < MIN_CELL || R.length < MIN_CELL) {
    return bad(
      `${label} did not survive with enough clean trials in all three conditions (${A.length}, ${V.length}, ${R.length}, and this page will not read a distribution off fewer than ${MIN_CELL})`,
    );
  }

  // The lag between the two channels is measured on the redundant trials themselves, never taken
  // from the number the page asked for. A frame is not a promise.
  const asys = good.filter((t) => t.cond === 'AV' && Number.isFinite(t.asy)).map((t) => t.asy);
  const tau = asys.length ? mean(asys) : rows.length ? rows[0].delay : 0;
  const tauSd = asys.length > 1 ? sd(asys) : NaN;

  const gains = gainVector(A, V, R, tau, PCTS);
  const gFast = fastMean(gains, PCTS);
  const gIndep = mean(
    FAST_PCTS.map((p) => invIndep(A, V, tau, p / 100) - invCdf(R, p / 100)),
  );
  const headline = invBound(A, V, tau, HEADLINE_PCT / 100) - invCdf(R, HEADLINE_PCT / 100);
  const rse = Math.min(mean(A), mean(V)) - mean(R);

  const bootFast: number[] = [];
  const bootIndep: number[] = [];
  const bootHead: number[] = [];
  const bootRse: number[] = [];
  const bootRows: number[][] = PCTS.map(() => []);

  const bufA: number[] = [];
  const bufV: number[] = [];
  const bufR: number[] = [];

  for (let b = 0; b < BOOTS; b++) {
    resampleInto(A, bufA, A.length);
    resampleInto(V, bufV, V.length);
    resampleInto(R, bufR, R.length);
    const sA = sortedCopy(bufA);
    const sV = sortedCopy(bufV);
    const sR = sortedCopy(bufR);
    const g = gainVector(sA, sV, sR, tau, PCTS);
    for (let i = 0; i < PCTS.length; i++) bootRows[i].push(g[i]);
    bootFast.push(fastMean(g, PCTS));
    bootIndep.push(
      mean(FAST_PCTS.map((p) => invIndep(sA, sV, tau, p / 100) - invCdf(sR, p / 100))),
    );
    bootHead.push(invBound(sA, sV, tau, HEADLINE_PCT / 100) - invCdf(sR, HEADLINE_PCT / 100));
    bootRse.push(Math.min(mean(sA), mean(sV)) - mean(sR));
  }

  // Null one, the strong one. Sorting one channel upward and the other downward is the coupling
  // that makes them avoid being fast on the same trial as hard as any joint distribution can, and
  // the minimum of that pairing has a distribution EQUAL to the Miller bound. So this is not an
  // approximation of the null, it is the null, drawn from the visitor's own two channels.
  let hitsMiller = 0;
  let hitsIndep = 0;
  const nR = R.length;
  const pa: number[] = [];
  const pv: number[] = [];
  for (let b = 0; b < NULLS; b++) {
    resampleInto(A, bufA, A.length);
    resampleInto(V, bufV, V.length);
    const sA = sortedCopy(bufA);
    const sV = sortedCopy(bufV);

    resampleInto(A, pa, nR);
    resampleInto(V, pv, nR);
    const upA = sortedCopy(pa);
    const upV = sortedCopy(pv);

    const anti: number[] = new Array(nR);
    const free: number[] = new Array(nR);
    for (let i = 0; i < nR; i++) {
      anti[i] = Math.min(upA[i], upV[nR - 1 - i] + tau);
      free[i] = Math.min(pa[i], pv[i] + tau);
    }
    const sAnti = sortedCopy(anti);
    const sFree = sortedCopy(free);

    if (fastMean(gainVector(sA, sV, sAnti, tau, PCTS), PCTS) >= gFast) hitsMiller++;
    if (fastMean(gainVector(sA, sV, sFree, tau, PCTS), PCTS) >= gFast) hitsIndep++;
  }

  const outRows: PctRow[] = PCTS.map((p, i) => ({
    p,
    obs: invCdf(R, p / 100),
    bound: invBound(A, V, tau, p / 100),
    indep: invIndep(A, V, tau, p / 100),
    grice: invGrice(A, V, tau, p / 100),
    gain: gains[i],
    ci: ciOf(bootRows[i]),
  }));

  let maxG = { p: PCTS[0], v: gains[0] };
  for (let i = 1; i < gains.length; i++) if (gains[i] > maxG.v) maxG = { p: PCTS[i], v: gains[i] };

  return {
    ok: true,
    reason: '',
    nA: A.length,
    nV: V.length,
    nAV: R.length,
    meanA: mean(A),
    meanV: mean(V),
    meanAV: mean(R),
    tau,
    tauSd,
    rse: statOf(rse, bootRse, R.length),
    gainFast: statOf(gFast, bootFast, R.length),
    gainIndep: statOf(gIndep, bootIndep, R.length),
    headline: statOf(headline, bootHead, R.length),
    pMiller: (hitsMiller + 1) / (NULLS + 1),
    pIndep: (hitsIndep + 1) / (NULLS + 1),
    rows: outRows,
    maxGain: maxG,
  };
}

// Everything the held-out block needs, computed from the three main blocks and then frozen. The
// delay it chooses is the visitor's own ear-minus-eye difference, and both rival numbers are
// printed before a single trial of that block has run.
function lockFit(rows: Trial[]): Locked {
  const good = rows.filter((t) => t.kind === 'main').filter(usable);
  const A = sortedCopy(good.filter((t) => t.cond === 'A').map((t) => t.rt));
  const V = sortedCopy(good.filter((t) => t.cond === 'V').map((t) => t.rt));
  const R = sortedCopy(good.filter((t) => t.cond === 'AV').map((t) => t.rt));

  const bad = (reason: string): Locked => ({
    ok: false,
    reason,
    meanA: NaN,
    meanV: NaN,
    d: 0,
    anchor: 'v',
    gain: NaN,
    gainCi: [NaN, NaN],
    predRace: NaN,
    predPool: NaN,
    pct: HEADLINE_PCT,
  });

  if (A.length < MIN_CELL || V.length < MIN_CELL || R.length < MIN_CELL)
    return bad('the main blocks did not leave enough clean trials to lock anything');

  const asys = good.filter((t) => t.cond === 'AV' && Number.isFinite(t.asy)).map((t) => t.asy);
  const tau = asys.length ? mean(asys) : 0;

  const mA = mean(A);
  const mV = mean(V);
  // D is how much later the SECOND channel has to start so that the two of them reach whatever
  // decides to move at the same time. Positive means the click waits for the flash.
  const raw = mV - mA;
  const d = clamp(Math.round(raw), -130, 130);
  const anchor: Chan = d >= 0 ? 'v' : 'a';
  const shift = Math.abs(d);

  // The race's prediction for the coming block, with the two closed marginals and the delay it is
  // about to be given. There is nothing to fit: this is the bound evaluated at a new shift.
  const first = anchor === 'v' ? V : A;
  const second = anchor === 'v' ? A : V;
  const predRace = invBound(first, second, shift, HEADLINE_PCT / 100);

  const gains: number[] = [];
  const bufA: number[] = [];
  const bufV: number[] = [];
  const bufR: number[] = [];
  for (let b = 0; b < 400; b++) {
    resampleInto(A, bufA, A.length);
    resampleInto(V, bufV, V.length);
    resampleInto(R, bufR, R.length);
    gains.push(fastMean(gainVector(sortedCopy(bufA), sortedCopy(bufV), sortedCopy(bufR), tau, PCTS), PCTS));
  }
  const gain = fastMean(gainVector(A, V, R, tau, PCTS), PCTS);

  return {
    ok: true,
    reason: '',
    meanA: mA,
    meanV: mV,
    d,
    anchor,
    gain,
    gainCi: ciOf(gains),
    predRace,
    predPool: predRace - Math.max(gain, 0),
    pct: HEADLINE_PCT,
  };
}

async function analyze(
  rows: Trial[],
  locked: Locked | null,
  frames: number[],
  minutes: number,
  mode: 'keyboard' | 'touch' | 'mixed',
  soundOk: boolean,
  audio: { base: number | null; out: number | null; exact: boolean },
  onProgress: (p: number) => void,
): Promise<Result> {
  const scored = rows.filter((t) => t.kind !== 'practice');
  const signal = scored.filter((t) => t.cond !== 'catch');
  const catches = scored.filter((t) => t.cond === 'catch');

  const omit = signal.length
    ? signal.filter((t) => !t.responded && !t.hidden).length / signal.length
    : 1;
  const fa = catches.length ? catches.filter((t) => t.responded).length / catches.length : 0;
  const early = signal.length
    ? signal.filter((t) => t.early || (t.responded && t.rt < RT_FLOOR)).length / signal.length
    : 0;
  const hidden = scored.length ? scored.filter((t) => t.hidden).length / scored.length : 0;

  const fr = sortedCopy(frames.filter((f) => f > 2 && f < 120));
  const frameMs = fr.length ? fr[Math.floor(fr.length / 2)] : NaN;
  const frameJit = fr.length > 8 ? sd(fr) : NaN;

  const m1 = mean(rows.filter((t) => t.kind === 'main' && t.block <= 2).filter(usable).map((t) => t.rt));
  const m3 = mean(rows.filter((t) => t.kind === 'main' && t.block >= 4).filter(usable).map((t) => t.rt));

  const q: Quality = {
    omit,
    fa,
    early,
    hidden,
    catchN: catches.length,
    frameMs,
    frameJit,
    minutes,
    mode,
    soundOk,
    audioBase: audio.base,
    audioOut: audio.out,
    clockExact: audio.exact,
    drift: Number.isFinite(m1) && Number.isFinite(m3) ? m3 - m1 : NaN,
  };

  const refuse = (reason: string): Result => ({
    ok: false,
    reason,
    q,
    main: null,
    control: null,
    held: null,
    locked,
    heldObs: NaN,
    heldObsCi: [NaN, NaN],
    heldRaceErr: NaN,
    heldPoolErr: NaN,
    heldWinner: 'neither',
    ctrlDiff: null,
  });

  if (early > MAX_EARLY)
    return refuse(
      `${Math.round(early * 100)} percent of your responses arrived before the signal did or inside ${RT_FLOOR} milliseconds of it. Those are not reactions, and enough of them will forge a violation of the inequality out of nothing, so this run is refused rather than scored.`,
    );
  if (fa > MAX_FA)
    return refuse(
      `you pressed on ${Math.round(fa * 100)} percent of the trials where nothing happened at all. This page cannot tell a fast reaction from a lucky guess in that state, and a guess lands in whichever condition it fell in.`,
    );
  if (omit > MAX_OMIT)
    return refuse(
      `${Math.round(omit * 100)} percent of the signals got no response inside a second. Missing trials are not random with respect to how hard the signal was, so the distributions this page compares would be cut in different places.`,
    );
  if (hidden > MAX_HIDDEN)
    return refuse(
      `${Math.round(hidden * 100)} percent of the trials ran with this tab in the background. A throttled timer is a reaction time with a lie in it.`,
    );

  onProgress(0.1);
  await new Promise((r) => setTimeout(r, 0));

  const main = fitRace(
    rows.filter((t) => t.kind === 'main'),
    'the main blocks',
  );
  onProgress(0.45);
  await new Promise((r) => setTimeout(r, 0));

  const ctrlRows = rows.filter((t) => t.kind === 'control');
  const control = ctrlRows.length ? fitRace(ctrlRows, 'the two flash block') : null;
  onProgress(0.7);
  await new Promise((r) => setTimeout(r, 0));

  const heldRows = rows.filter((t) => t.kind === 'held');
  const held = heldRows.length ? fitRace(heldRows, 'the lined up block') : null;
  onProgress(0.9);
  await new Promise((r) => setTimeout(r, 0));

  let ctrlDiff: Stat | null = null;
  if (main.ok && control && control.ok) {
    const d = main.gainFast.m - control.gainFast.m;
    // The two blocks are independent samples, so the difference of the two bootstrap
    // distributions is the honest interval for the difference rather than a claim that two
    // overlapping error bars mean anything.
    const bootA = main.gainFast;
    const bootB = control.gainFast;
    const lo = bootA.ci[0] - bootB.ci[1];
    const hi = bootA.ci[1] - bootB.ci[0];
    ctrlDiff = { n: control.nAV, m: d, ci: [lo, hi] };
  }

  let heldObs = NaN;
  let heldObsCi: [number, number] = [NaN, NaN];
  let heldRaceErr = NaN;
  let heldPoolErr = NaN;
  let heldWinner: 'race' | 'pool' | 'neither' = 'neither';
  if (held && held.ok && locked && locked.ok) {
    const obsSet = sortedCopy(
      heldRows.filter(usable).filter((t) => t.cond === 'AV').map((t) => t.rt),
    );
    heldObs = invCdf(obsSet, HEADLINE_PCT / 100);
    const boots: number[] = [];
    const buf: number[] = [];
    for (let b = 0; b < 600; b++) {
      resampleInto(obsSet, buf, obsSet.length);
      boots.push(invCdf(sortedCopy(buf), HEADLINE_PCT / 100));
    }
    heldObsCi = ciOf(boots);
    heldRaceErr = heldObs - locked.predRace;
    heldPoolErr = heldObs - locked.predPool;
    // Scored by direction with an interval rather than by which prediction happens to land nearer.
    // Nearest-point scoring is biased: a reaction time quantile from twenty two trials has a right
    // skewed error, so it falls BELOW its own expectation more often than above it, and the lower
    // of two predictions wins by default. In a simulated world where the race model was exactly
    // true that bias handed the win to pooling in two thirds of runs. Direction has no such tilt.
    if (heldObsCi[1] < locked.predRace) heldWinner = 'pool';
    else if (heldObsCi[0] > locked.predRace) heldWinner = 'race';
  }

  onProgress(1);

  return {
    ok: main.ok,
    reason: main.ok ? '' : main.reason,
    q,
    main,
    control,
    held,
    locked,
    heldObs,
    heldObsCi,
    heldRaceErr,
    heldPoolErr,
    heldWinner,
    ctrlDiff,
  };
}

// ============================ audio ============================

type ClockMap = { c0: number; p0: number; exact: boolean };

// getOutputTimestamp is the browser admitting where its own audio clock sits relative to the page
// clock. Where it is missing the page falls back to the raw context time and says so in the
// results, because that fallback is the one place a claimed onset could be a guess.
function clockMap(ctx: AudioContext): ClockMap {
  try {
    const ts = ctx.getOutputTimestamp?.();
    if (
      ts &&
      typeof ts.contextTime === 'number' &&
      typeof ts.performanceTime === 'number' &&
      ts.contextTime > 0
    ) {
      return { c0: ts.contextTime, p0: ts.performanceTime, exact: true };
    }
  } catch {
    /* fall through to the raw clock */
  }
  return { c0: ctx.currentTime, p0: performance.now(), exact: false };
}

// A click with a hard edge. Four milliseconds of ramp, long enough that nothing pops in the
// speaker and short enough that "when did it start" is not a matter of opinion.
function makeClick(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.round((sr * CLICK_MS) / 1000);
  const buf = ctx.createBuffer(1, n, sr);
  const d = buf.getChannelData(0);
  const ramp = Math.max(1, Math.round(sr * 0.002));
  for (let i = 0; i < n; i++) {
    let a = 1;
    if (i < ramp) a = i / ramp;
    else if (i > n - ramp) a = (n - i) / ramp;
    d[i] = Math.sin((2 * Math.PI * CLICK_HZ * i) / sr) * 0.6 * a;
  }
  return buf;
}

// ============================ the page ============================

type Phase = 'intro' | 'sound' | 'bridge' | 'run' | 'crunch' | 'result';
type Flash = null | 'early' | 'slow' | 'false';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [showA, setShowA] = useState(false);
  const [showV, setShowV] = useState(false);
  const [pairView, setPairView] = useState<Pair>('av');
  const [flash, setFlash] = useState<Flash>(null);
  const [progress, setProgress] = useState(0);
  const [lockedView, setLockedView] = useState<Locked | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  const [soundStep, setSoundStep] = useState(0);
  const [soundFails, setSoundFails] = useState(0);
  const [soundLive, setSoundLive] = useState(false);
  const [audioErr, setAudioErr] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const clickRef = useRef<AudioBuffer | null>(null);
  const audioInfoRef = useRef<{ base: number | null; out: number | null; exact: boolean }>({
    base: null,
    out: null,
    exact: false,
  });
  const soundOkRef = useRef(false);

  const planRef = useRef<Block[]>([]);
  const blockIdxRef = useRef(0);
  const specsRef = useRef<Spec[]>([]);
  const idxRef = useRef(0);
  const trialsRef = useRef<Trial[]>([]);
  const lockedRef = useRef<Locked | null>(null);
  const liveRef = useRef(false);
  const armedRef = useRef(false);
  const answeredRef = useRef(true);
  const aOnsetRef = useRef(NaN);
  const vOnsetRef = useRef(NaN);
  const refOnsetRef = useRef(NaN);
  const hiddenRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const meterRef = useRef<number | null>(null);
  const framesRef = useRef<number[]>([]);
  const lastFrameRef = useRef(0);
  const leadRef = useRef(28);
  const modeRef = useRef({ key: 0, touch: 0 });
  const startedRef = useRef(0);
  const nextTrialRef = useRef<() => void>(() => {});
  const respondRef = useRef<(touch: boolean) => void>(() => {});
  const recordRef = useRef<(rt: number, responded: boolean, early: boolean, touch: boolean) => void>(
    () => {},
  );
  const endTrialRef = useRef<() => void>(() => {});
  const phaseRef = useRef<Phase>('intro');
  phaseRef.current = phase;

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // The display quantum is metered from real frames for the whole session rather than guessed from
  // how densely the reaction times happen to fall, which is a statistic about sample size wearing
  // a hardware costume.
  const startMeter = useCallback(() => {
    if (meterRef.current !== null) return;
    lastFrameRef.current = 0;
    const tick = (ts: number) => {
      if (lastFrameRef.current > 0) {
        const d = ts - lastFrameRef.current;
        if (d > 0 && d < 200) framesRef.current.push(d);
      }
      lastFrameRef.current = ts;
      meterRef.current = window.requestAnimationFrame(tick);
    };
    meterRef.current = window.requestAnimationFrame(tick);
  }, []);

  const stopMeter = useCallback(() => {
    if (meterRef.current !== null) {
      window.cancelAnimationFrame(meterRef.current);
      meterRef.current = null;
    }
  }, []);

  const openAudio = useCallback(async () => {
    if (ctxRef.current) return true;
    try {
      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      await ctx.resume();
      const g = ctx.createGain();
      g.gain.value = 0.9;
      g.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = g;
      clickRef.current = makeClick(ctx);
      audioInfoRef.current = {
        base: typeof ctx.baseLatency === 'number' ? ctx.baseLatency * 1000 : null,
        out: typeof ctx.outputLatency === 'number' ? ctx.outputLatency * 1000 : null,
        exact: clockMap(ctx).exact,
      };
      return true;
    } catch {
      setAudioErr(
        'This browser would not open an audio clock at all. The page will run its two flash version instead, which measures the same inequality with a weaker pair of channels.',
      );
      return false;
    }
  }, []);

  const playClick = useCallback((atCtxTime: number) => {
    const ctx = ctxRef.current;
    const g = gainRef.current;
    const buf = clickRef.current;
    if (!ctx || !g || !buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(g);
    src.start(Math.max(ctx.currentTime + 0.005, atCtxTime));
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') hiddenRef.current = true;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // ---------------- sound check ----------------

  const soundKeyRef = useRef(0);
  const soundLiveRef = useRef(false);

  const soundProbe = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    soundKeyRef.current = performance.now();
    soundLiveRef.current = true;
    setSoundLive(true);
    const map = clockMap(ctx);
    playClick(map.c0 + 0.2);
    later(() => {
      if (!soundLiveRef.current) return;
      soundLiveRef.current = false;
      setSoundLive(false);
      setSoundStep(0);
      setSoundFails((f) => f + 1);
      later(() => soundProbe(), 900);
    }, 1800);
  }, [later, playClick]);

  const soundHit = useCallback(() => {
    if (!soundLiveRef.current) return;
    soundLiveRef.current = false;
    setSoundLive(false);
    clearTimers();
    setSoundStep((s) => {
      const n = s + 1;
      if (n >= 3) {
        soundOkRef.current = true;
        later(() => {
          const p = buildPlan(true);
          planRef.current = p;
          setPlan(p);
          blockIdxRef.current = 0;
          setBlockIdx(0);
          setPhase('bridge');
        }, 550);
      } else {
        later(() => soundProbe(), 800 + Math.random() * 700);
      }
      return n;
    });
  }, [clearTimers, later, soundProbe]);

  // ---------------- one trial ----------------

  const endTrial = useCallback(() => {
    if (!liveRef.current) return;
    liveRef.current = false;
    armedRef.current = false;
    clearTimers();
    setShowA(false);
    setShowV(false);

    const i = idxRef.current;
    setDone(i + 1);
    idxRef.current = i + 1;

    // The only feedback in the whole page, and all three kinds of it are about a trial that went
    // wrong rather than about how fast a good one was. Telling somebody their reaction time turns
    // a detection task into a competition, and a competition is a different experiment.
    const last = trialsRef.current[trialsRef.current.length - 1];
    let f: Flash = null;
    if (last) {
      if (last.early) f = 'early';
      else if (last.cond === 'catch' && last.responded) f = 'false';
      else if (last.cond !== 'catch' && !last.responded && !last.hidden) f = 'slow';
    }
    setFlash(f);

    later(() => {
      setFlash(null);
      if (idxRef.current < specsRef.current.length) nextTrialRef.current();
      else setDone(specsRef.current.length);
    }, f === null ? ITI : FB_MS);
  }, [clearTimers, later]);
  endTrialRef.current = endTrial;

  const record = useCallback((rt: number, responded: boolean, early: boolean, touch: boolean) => {
    const spec = specsRef.current[idxRef.current];
    if (!spec) return;
    const block = planRef.current[blockIdxRef.current];
    const asy =
      Number.isFinite(aOnsetRef.current) && Number.isFinite(vOnsetRef.current)
        ? spec.anchor === 'a'
          ? vOnsetRef.current - aOnsetRef.current
          : aOnsetRef.current - vOnsetRef.current
        : NaN;
    trialsRef.current.push({
      block: blockIdxRef.current,
      kind: block.kind,
      pair: spec.pair,
      cond: spec.cond,
      anchor: spec.anchor,
      delay: spec.delay,
      rt,
      asy,
      responded,
      early,
      hidden: hiddenRef.current || document.visibilityState !== 'visible',
      touch,
    });
    if (touch) modeRef.current.touch++;
    else if (responded) modeRef.current.key++;
  }, []);

  recordRef.current = record;

  const runTrial = useCallback(() => {
    const specs = specsRef.current;
    const i = idxRef.current;
    if (i >= specs.length) return;
    const spec = specs[i];

    setPairView(spec.pair);
    setShowA(false);
    setShowV(false);
    setFlash(null);
    hiddenRef.current = document.visibilityState !== 'visible';
    aOnsetRef.current = NaN;
    vOnsetRef.current = NaN;
    refOnsetRef.current = NaN;
    answeredRef.current = false;
    armedRef.current = false;
    liveRef.current = true;

    const target = performance.now() + spec.fp;

    // Channel offsets in page milliseconds. The anchor channel starts at the target and the other
    // one starts spec.delay later, which is zero everywhere except the last block.
    const aAt = spec.anchor === 'a' ? target : target + spec.delay;
    const vAt = spec.anchor === 'v' ? target : target + spec.delay;

    const wantsA = spec.cond === 'A' || spec.cond === 'AV';
    const wantsV = spec.cond === 'V' || spec.cond === 'AV';
    const audible = wantsA && spec.pair === 'av';

    const timeout = (ms: number) =>
      later(() => {
        if (!liveRef.current) return;
        if (!answeredRef.current) {
          answeredRef.current = true;
          recordRef.current(NaN, false, false, false);
        }
        endTrialRef.current();
      }, ms);

    // The clock this trial's reaction time is measured against. It is the onset of whichever
    // channel was nominally first, and on a click trial that is the moment the page ASKED for the
    // sound, not the moment the sound came out. Every click-only trial is measured the same way, so
    // whatever the device adds sits inside both sides of the inequality and cancels.
    const arm = (t: number) => {
      if (armedRef.current) return;
      armedRef.current = true;
      refOnsetRef.current = t;
      timeout(RESP_WINDOW);
    };

    // The click has to be handed to the audio clock in advance, so it is scheduled at the start of
    // the wait using the browser's own map between the two clocks.
    if (audible) {
      const ctx = ctxRef.current;
      if (ctx) {
        const map = clockMap(ctx);
        playClick(map.c0 + (aAt - map.p0) / 1000);
        aOnsetRef.current = aAt;
      }
    }

    if (spec.cond === 'catch') {
      refOnsetRef.current = target;
      armedRef.current = true;
      timeout(spec.fp + CATCH_WINDOW);
      return;
    }

    // What has to be painted, and when. A flash cannot begin between two frames, so the loop aims
    // early by the lead it has learned from this device and then takes the onset from the frame
    // AFTER the one that drew it, which is the first timestamp that is a claim about what an eye
    // was given rather than about what a function was told.
    const paints: { chan: Chan; at: number }[] = [];
    if (spec.pair === 'av') {
      if (wantsV) paints.push({ chan: 'v', at: vAt });
    } else {
      if (wantsA) paints.push({ chan: 'a', at: aAt });
      if (wantsV) paints.push({ chan: 'v', at: vAt });
    }
    paints.sort((x, y) => x.at - y.at);

    // Nothing to paint means a click on its own, and then the reference is the scheduled audible
    // time and the response window has to open there rather than at the anchor.
    if (!paints.length) {
      if (audible) {
        const wait = Math.max(0, aAt - performance.now());
        later(() => arm(aOnsetRef.current), wait);
        timeout(spec.fp + Math.abs(spec.delay) + RESP_WINDOW + 1200);
      } else {
        timeout(spec.fp + RESP_WINDOW + 1200);
      }
      return;
    }

    let painted = 0;
    const tick = (now: number) => {
      if (!liveRef.current) return;
      while (painted < paints.length && now >= paints[painted].at - leadRef.current) {
        const pt = paints[painted];
        painted++;
        if (pt.chan === 'a') setShowA(true);
        else setShowV(true);
        window.requestAnimationFrame((next) => {
          if (!liveRef.current) return;
          if (pt.chan === 'a') aOnsetRef.current = next;
          else vOnsetRef.current = next;
          // learn this device's paint lead from how far after the requested moment it landed
          const err = next - pt.at;
          if (Number.isFinite(err) && Math.abs(err) < 200)
            leadRef.current = clamp(leadRef.current + 0.15 * err, 0, 70);
          // the anchor channel opens the clock. On an audiovisual pair the click already fixed it.
          if (audible && spec.anchor === 'a') arm(aOnsetRef.current);
          else if (pt.chan === spec.anchor || paints.length === 1) arm(next);
          later(() => {
            if (pt.chan === 'a') setShowA(false);
            else setShowV(false);
          }, FLASH_MS);
        });
      }
      if (painted >= paints.length) {
        rafRef.current = null;
        return;
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);

    // safety net: if the frame loop never delivers, in a throttled tab or on a lost context, the
    // trial still ends rather than stalling the run on a stimulus nobody saw
    timeout(spec.fp + Math.abs(spec.delay) + RESP_WINDOW + 1500);
  }, [later, playClick]);
  nextTrialRef.current = runTrial;

  const respond = useCallback(
    (touch: boolean) => {
      if (phaseRef.current === 'sound') {
        soundHit();
        return;
      }
      if (!liveRef.current || answeredRef.current) return;
      const now = performance.now();
      answeredRef.current = true;
      if (!armedRef.current || !Number.isFinite(refOnsetRef.current)) {
        record(NaN, true, true, touch);
        endTrialRef.current();
        return;
      }
      const rt = now - refOnsetRef.current;
      record(rt, true, rt < 0, touch);
      endTrialRef.current();
    },
    [record, soundHit],
  );

  respondRef.current = respond;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimers();
        stopMeter();
        liveRef.current = false;
        setPhase('intro');
        setShowA(false);
        setShowV(false);
        return;
      }
      if (e.repeat) return;
      if (e.key !== ' ' && e.key !== 'Spacebar') return;
      e.preventDefault();
      respondRef.current(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearTimers, stopMeter]);

  // block transitions are DERIVED from the trial index rather than scheduled from inside a state
  // updater, because a side effect in a reducer is a transition React is entitled to lose
  useEffect(() => {
    if (phase !== 'run') return;
    const specs = specsRef.current;
    if (!specs.length) return;
    if (done < specs.length) return;
    clearTimers();
    liveRef.current = false;
    setShowA(false);
    setShowV(false);
    const next = blockIdxRef.current + 1;
    if (next >= planRef.current.length) {
      setPhase('crunch');
      return;
    }
    if (planRef.current[next].kind === 'held') {
      const lk = lockFit(trialsRef.current);
      lockedRef.current = lk;
      setLockedView(lk);
      if (lk.ok) {
        const shift = Math.abs(lk.d);
        planRef.current[next] = {
          ...planRef.current[next],
          specs: planRef.current[next].specs.map((s) => ({
            ...s,
            anchor: lk.anchor,
            delay: shift,
          })),
        };
        setPlan(planRef.current.slice());
      }
    }
    blockIdxRef.current = next;
    setBlockIdx(next);
    setPhase('bridge');
  }, [clearTimers, done, phase]);

  const startBlock = useCallback(() => {
    const block = planRef.current[blockIdxRef.current];
    if (!block) return;
    specsRef.current = block.specs;
    idxRef.current = 0;
    setDone(0);
    setPhase('run');
    startMeter();
    later(() => nextTrialRef.current(), 500);
  }, [later, startMeter]);

  const begin = useCallback(async () => {
    trialsRef.current = [];
    // a live handle on the raw trial record, so that anything claimed on the results page can be
    // recomputed from the console by anybody who does not believe it. Nothing is sent anywhere;
    // this is the same array the analysis reads.
    (window as unknown as { __trials?: Trial[] }).__trials = trialsRef.current;
    framesRef.current = [];
    lockedRef.current = null;
    setLockedView(null);
    modeRef.current = { key: 0, touch: 0 };
    startedRef.current = performance.now();
    setRes(null);
    setProgress(0);
    setSoundStep(0);
    setSoundFails(0);
    soundOkRef.current = false;
    const ok = await openAudio();
    if (!ok) {
      const p = buildPlan(false);
      planRef.current = p;
      setPlan(p);
      blockIdxRef.current = 0;
      setBlockIdx(0);
      setPhase('bridge');
      return;
    }
    setPhase('sound');
    later(() => soundProbe(), 700);
  }, [later, openAudio, soundProbe]);

  const skipSound = useCallback(() => {
    clearTimers();
    soundLiveRef.current = false;
    setSoundLive(false);
    soundOkRef.current = false;
    const p = buildPlan(false);
    planRef.current = p;
    setPlan(p);
    blockIdxRef.current = 0;
    setBlockIdx(0);
    setPhase('bridge');
  }, [clearTimers]);

  useEffect(() => {
    if (phase !== 'crunch') return;
    clearTimers();
    stopMeter();
    let alive = true;
    const m = modeRef.current;
    const mode: 'keyboard' | 'touch' | 'mixed' =
      m.key > 0 && m.touch > 0 ? 'mixed' : m.touch > 0 ? 'touch' : 'keyboard';
    (async () => {
      await new Promise((r) => setTimeout(r, 60));
      const r = await analyze(
        trialsRef.current,
        lockedRef.current,
        framesRef.current,
        (performance.now() - startedRef.current) / 60000,
        mode,
        soundOkRef.current,
        audioInfoRef.current,
        (p) => {
          if (alive) setProgress(p);
        },
      );
      if (!alive) return;
      setRes(r);
      setPhase('result');
    })();
    return () => {
      alive = false;
    };
  }, [clearTimers, phase, stopMeter]);

  useEffect(
    () => () => {
      for (const t of timersRef.current) window.clearTimeout(t);
      if (meterRef.current !== null) window.cancelAnimationFrame(meterRef.current);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const block = plan[blockIdx] ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && block && (
        <Stage
          block={block}
          pair={pairView}
          showA={showA}
          showV={showV}
          flash={flash}
          done={done}
          total={specsRef.current.length}
          onPress={() => respondRef.current(true)}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300"
          >
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#128276;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Neither One Won
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A flash, a click, and sometimes both. Both together is faster, and a race between them
            explains that. This page measures whether a race can explain how MUCH faster.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} err={audioErr} />}

        {phase === 'sound' && (
          <SoundCheck
            step={soundStep}
            fails={soundFails}
            live={soundLive}
            onHit={() => respondRef.current(true)}
            onSkip={skipSound}
          />
        )}

        {phase === 'bridge' && block && (
          <Bridge
            block={block}
            index={blockIdx}
            total={plan.length}
            locked={block.kind === 'held' ? lockedView : null}
            soundOk={soundOkRef.current}
            onGo={startBlock}
          />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              building two null worlds out of your own trials
            </div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div
                className="h-full bg-cyan-400/60 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {phase === 'result' && res && <Results res={res} onAgain={begin} />}
      </div>
    </main>
  );
}

// ============================ intro ============================

function Intro({ onStart, err }: { onStart: () => void; err: string | null }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          Press the key the instant you notice anything. Sometimes a flash. Sometimes a click.
          Sometimes both at once. Nothing to decide, nothing to get wrong, one key.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Both together will be faster than either alone, and that has a boring explanation from
          1962: two processes are running and you move as soon as the FIRST one finishes. Two
          lottery tickets win more often than one. Nothing is combined, nothing cooperates, and the
          speed-up falls out of arithmetic.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          P(both &le; t) &nbsp;&le;&nbsp; P(flash &le; t) + P(click &le; t)
          <br />
          <span className="text-cyan-100">
            true of every race, whatever the two channels do to each other
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Which is why this is worth ten minutes. The race story is not a story, it is a ceiling,
          and both sides of that ceiling are things you are about to measure. People go through it.
        </p>
      </div>

      <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/90">
          why your speaker cannot break this
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Your audio output is late by some unknown amount, and unlike screen lag it belongs to only
          one of the two channels, which sounds fatal.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          It cancels exactly. Every click-only time recorded here already contains that delay,
          because the clock starts when the page asked for the sound. On a both-together trial the
          same clock starts at the same moment. So the measured single-signal distributions are
          precisely the ones the inequality is written over, on a device nobody had to measure. No
          calibration, no correction to get wrong.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/90">
          two nulls, both exact, neither of them a t test
        </div>
        <div className="space-y-2">
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
              the independent race
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              Your click trials and your flash trials paired at random, faster of each pair taken.
              That is the 1962 model, running on your own two channels.
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
              the fastest race there is
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              Your click trials sorted upward against your flash trials sorted downward. That
              pairing is the one where the two channels avoid being quick together as hard as
              arithmetic allows, and its distribution EQUALS the ceiling. So the strong claim gets
              an exact null too.
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          They will probably print nearly the same number, and that is the interesting part rather
          than a bug. The two differ by a product of two small probabilities, and at the fast end of
          a distribution a product of two small numbers is nearly nothing. Where a violation can be
          looked for at all, the weakest race and the fastest conceivable race agree. People beat
          both.
        </p>
      </div>

      <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-rose-300/90">
          the block that could kill it
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          There is a boring explanation for a violation as well: two things at once are a bigger
          event, and a bigger event is more alerting. So one block swaps the click for a second
          flash on the other side of the screen. Same count, same suddenness, more light on the
          display than the click ever added, and only one sense involved.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the rules
        </div>
        <p className="text-xs leading-relaxed text-slate-500">
          One key, the space bar, or a tap anywhere on a phone. Six blocks, about nine minutes, the
          first unscored, escape aborts at any time. One trial in eleven has no signal at all and
          your presses on those are counted: a run over twenty percent of them is refused rather
          than scored, because a guess is a fast time in whichever condition it lands in. The wait
          before each signal is drawn from a distribution whose remaining wait never shortens, so
          there is no moment worth leaving early for. This one needs sound, and it checks before it
          starts.
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.05] p-4 text-xs leading-relaxed text-amber-200/90">
          {err}
        </div>
      )}

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

// ============================ sound check ============================

function SoundCheck({
  step,
  fails,
  live,
  onHit,
  onSkip,
}: {
  step: number;
  fails: number;
  live: boolean;
  onHit: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="cursor-pointer select-none rounded-lg border border-cyan-500/25 bg-slate-900/50 p-6 text-center"
        onPointerDown={(e) => {
          e.preventDefault();
          onHit();
        }}
      >
        <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/80">
          turn the sound on
        </div>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
          A short click is playing every couple of seconds. Press the space bar, or tap, each time
          you hear one. Three in a row and the experiment starts.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-3 w-10 rounded-full ${step > i ? 'bg-emerald-400/80' : 'bg-slate-800'}`}
            />
          ))}
        </div>
        <div className="mt-4 h-5 font-mono text-[11px] text-slate-600">
          {live ? 'listening' : 'wait'}
        </div>
      </div>

      <button
        onClick={onSkip}
        className="w-full rounded-lg border border-slate-800 bg-slate-900/40 py-3 font-mono text-xs uppercase tracking-wider text-slate-500 transition hover:bg-slate-900"
      >
        no sound here, run the two flash version
      </button>

      {fails >= 2 && (
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.05] p-4 text-xs leading-relaxed text-amber-200/90">
          No luck with the sound. Check the volume and the mute switch, or use the button above,
          which runs the two flash version of the same inequality. It measures exactly the same
          thing with a weaker pair of channels, and the results will say so rather than pretending
          otherwise.
        </div>
      )}
    </div>
  );
}

// ============================ bridge ============================

function Bridge({
  block,
  index,
  total,
  locked,
  soundOk,
  onGo,
}: {
  block: Block;
  index: number;
  total: number;
  locked: Locked | null;
  soundOk: boolean;
  onGo: () => void;
}) {
  const pair: Pair = block.specs.length ? block.specs[0].pair : 'av';
  const what =
    pair === 'vv'
      ? 'A flash on the left, a flash on the right, sometimes both.'
      : 'A click, a flash, sometimes both.';
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
        <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/80">
          block {index + 1} of {total} . {block.label}
        </div>
        <div className="mt-1 font-mono text-[11px] text-slate-600">{block.blurb}</div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{what} Press the moment you
          notice anything at all. Some trials have nothing in them and the right answer there is to
          press nothing.
        </p>
        {block.kind === 'control' && (
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            This block has no sound in it. Two flashes, one on each side, and the same inequality.
            If the speed-up you have been showing is really about two things at once being a bigger
            event, this block will break the ceiling as hard as the click did.
          </p>
        )}
        {block.kind === 'practice' && (
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Nothing here is scored. It exists so that the first two minutes of getting used to a
            single key do not land inside the measurement.
          </p>
        )}
      </div>

      {block.kind === 'held' && locked && (
        <LockedCard locked={locked} soundOk={soundOk} />
      )}

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        go
      </button>
    </div>
  );
}

function LockedCard({ locked, soundOk }: { locked: Locked; soundOk: boolean }) {
  if (!locked.ok) {
    return (
      <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.05] p-5 text-xs leading-relaxed text-amber-200/90">
        {locked.reason}. The last block will still run, but there is nothing locked for it to be
        compared against.
      </div>
    );
  }
  const fast = soundOk
    ? locked.d >= 0
      ? 'your ear'
      : 'your eye'
    : locked.d >= 0
      ? 'the left flash'
      : 'the right flash';
  const slow = soundOk
    ? locked.d >= 0
      ? 'your eye'
      : 'your ear'
    : locked.d >= 0
      ? 'the right flash'
      : 'the left flash';
  return (
    <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.05] p-5">
      <div className="mb-3 font-mono text-xs uppercase tracking-wider text-emerald-300/90">
        closed, and two numbers before the block opens
      </div>
      <p className="text-sm leading-relaxed text-slate-300">
        Over the three main blocks {fast} beat {slow} by{' '}
        <span className="font-mono text-emerald-200">{Math.abs(locked.d)} ms</span>. So the pair has
        never actually arrived together: one of them was half finished before the other landed.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        This block delays the faster channel by exactly that much, so that for the first time the
        two of them reach whatever decides to move at the same moment. The main blocks are now
        closed. Nothing below can be adjusted.
      </p>
      <div className="mt-4 space-y-2">
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
              the race
            </div>
            <div className="font-mono text-lg text-amber-200">{Math.round(locked.predRace)} ms</div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-400">
            The ceiling recomputed with one channel shifted, every term of it already measured. This
            is the fifteenth percentile of the coming block with no free parameters left anywhere.
          </div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">
              pooling, with a window
            </div>
            <div className="font-mono text-lg text-cyan-200">{Math.round(locked.predPool)} ms</div>
          </div>
          <div className="mt-1 text-xs leading-relaxed text-slate-400">
            The same ceiling minus the {Math.round(locked.gain)} ms you have already shown, and
            faster still if adding two channels works better while they overlap than while one is
            half finished.
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        They disagree by {Math.round(Math.abs(locked.predRace - locked.predPool))} ms in a known
        direction, and the natural intuition, that delaying a signal on purpose has to make the pair
        worse, is the one on the block.
      </p>
    </div>
  );
}

// ============================ stage ============================

function Stage({
  block,
  pair,
  showA,
  showV,
  flash,
  done,
  total,
  onPress,
}: {
  block: Block;
  pair: Pair;
  showA: boolean;
  showV: boolean;
  flash: Flash;
  done: number;
  total: number;
  onPress: () => void;
}) {
  const W = 320;
  const H = 220;
  const R = 70;

  return (
    <div
      className="fixed inset-0 z-50 flex touch-none select-none flex-col items-center justify-center bg-slate-950 px-4"
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
    >
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {block.label}
        {!block.scored && ' . not scored'}
      </div>

      <div
        className="relative overflow-hidden rounded-xl border-2 border-slate-800 bg-[#04060a]"
        style={{ width: W, height: H }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700"
          aria-hidden
        />
        {pair === 'av' && showV && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100"
            style={{ width: R, height: R }}
            aria-hidden
          />
        )}
        {pair === 'vv' && showA && (
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-slate-100"
            style={{ width: R, height: R, left: 26 }}
            aria-hidden
          />
        )}
        {pair === 'vv' && showV && (
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-slate-100"
            style={{ width: R, height: R, right: 26 }}
            aria-hidden
          />
        )}
      </div>

      <div className="mt-4 h-4 font-mono text-[10px] uppercase tracking-wider text-slate-600">
        press the instant you notice anything
      </div>

      <div className="mt-1 h-6 font-mono text-xs">
        {flash === 'early' && <span className="text-amber-400">too early</span>}
        {flash === 'slow' && <span className="text-amber-400">too slow</span>}
        {flash === 'false' && <span className="text-rose-400">nothing was there</span>}
      </div>

      <div className="mt-6 w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900/60 py-6 text-center font-mono text-xs uppercase tracking-wider text-slate-500">
        space, or tap anywhere
      </div>

      <div className="mt-8 h-1 w-full max-w-sm overflow-hidden rounded bg-slate-900">
        <div
          className="h-full bg-slate-600 transition-all"
          style={{ width: `${clamp((done / Math.max(total, 1)) * 100, 0, 100)}%` }}
        />
      </div>
      <div className="mt-3 font-mono text-[10px] text-slate-700">
        {done} / {total} . escape aborts
      </div>
    </div>
  );
}

// ============================ results ============================

function msTxt(v: number) {
  return Number.isFinite(v) ? `${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(1)} ms` : 'n/a';
}

function ciTxt(c: [number, number]) {
  if (!Number.isFinite(c[0]) || !Number.isFinite(c[1])) return '';
  return `95% ${c[0].toFixed(1)} to ${c[1].toFixed(1)}`;
}

function pctTxt(v: number, dp = 0) {
  return Number.isFinite(v) ? `${(v * 100).toFixed(dp)}%` : 'n/a';
}

function pTxt(p: number) {
  if (!Number.isFinite(p)) return 'n/a';
  if (p < 0.001) return 'p < .001';
  return `p = ${p.toFixed(3)}`;
}

function Card({
  tone,
  label,
  children,
}: {
  tone: 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate';
  label: string;
  children: ReactNode;
}) {
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

// The picture that carries the whole argument: three measured curves and the ceiling. Where the
// observed curve sits to the LEFT of the ceiling, a race has been ruled out at that speed.
function CdfPlot({ fit, soundOk, pair }: { fit: RaceFit; soundOk: boolean; pair: 'av' | 'vv' }) {
  const W = 560;
  const H = 300;
  const L = 46;
  const B = 34;

  const all = fit.rows.flatMap((r) => [r.obs, r.bound, r.grice]).filter(Number.isFinite);
  const lo = Math.min(...all) - 12;
  const hi = Math.max(...all) + 12;
  const x = (t: number) => L + ((t - lo) / (hi - lo)) * (W - L - 14);
  const y = (p: number) => H - B - (p / 100) * (H - B - 18);

  const path = (key: 'obs' | 'bound' | 'indep' | 'grice') =>
    fit.rows.map((r, i) => `${i ? 'L' : 'M'}${x(r[key]).toFixed(1)},${y(r.p).toFixed(1)}`).join(' ');

  const chanA = pair === 'vv' ? 'left flash' : soundOk ? 'click' : 'left flash';
  const chanB = pair === 'vv' ? 'right flash' : 'flash';

  return (
    <div className="overflow-x-auto">
      <svg width={W} height={H} className="min-w-[560px]">
        <line x1={L} y1={H - B} x2={W - 14} y2={H - B} stroke="#1e293b" />
        <line x1={L} y1={18} x2={L} y2={H - B} stroke="#1e293b" />
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={L} y1={y(p)} x2={W - 14} y2={y(p)} stroke="#0f172a" />
            <text x={L - 8} y={y(p) + 4} fill="#475569" fontSize="10" textAnchor="end">
              {p}
            </text>
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => {
          const t = lo + ((hi - lo) * i) / 3;
          return (
            <text key={i} x={x(t)} y={H - B + 16} fill="#475569" fontSize="10" textAnchor="middle">
              {Math.round(t)}
            </text>
          );
        })}
        <path d={path('grice')} fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d={path('indep')} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5 3" />
        <path d={path('bound')} fill="none" stroke="#fbbf24" strokeWidth="2" />
        <path d={path('obs')} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
        {fit.rows.map((r) => (
          <circle key={r.p} cx={x(r.obs)} cy={y(r.p)} r="2.6" fill="#22d3ee" />
        ))}
        <text x={W - 14} y={12} fill="#64748b" fontSize="10" textAnchor="end">
          percent of trials answered by this time
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-slate-500">
        <span className="text-cyan-300">both together, measured</span>
        <span className="text-amber-300">the ceiling: the fastest any race can be</span>
        <span className="text-violet-300">an independent race</span>
        <span className="text-slate-400">the slowest any race can be</span>
        <span>
          from {chanA} and {chanB} alone
        </span>
      </div>
    </div>
  );
}

// The same data as a difference, which is where a few milliseconds stop being invisible.
function GainPlot({ fit }: { fit: RaceFit }) {
  const W = 560;
  const H = 220;
  const L = 46;
  const B = 30;

  const vals = fit.rows.flatMap((r) => [r.ci[0], r.ci[1], r.gain]).filter(Number.isFinite);
  const lo = Math.min(-6, Math.min(...vals) - 3);
  const hi = Math.max(10, Math.max(...vals) + 3);
  const x = (i: number) => L + (i / (fit.rows.length - 1)) * (W - L - 16);
  const y = (v: number) => H - B - ((v - lo) / (hi - lo)) * (H - B - 18);

  return (
    <div className="overflow-x-auto">
      <svg width={W} height={H} className="min-w-[560px]">
        <line x1={L} y1={y(0)} x2={W - 16} y2={y(0)} stroke="#475569" strokeDasharray="4 3" />
        <line x1={L} y1={18} x2={L} y2={H - B} stroke="#1e293b" />
        {fit.rows.map((r, i) => (
          <g key={r.p}>
            <line
              x1={x(i)}
              y1={y(r.ci[0])}
              x2={x(i)}
              y2={y(r.ci[1])}
              stroke={FAST_PCTS.includes(r.p) ? '#22d3ee' : '#334155'}
              strokeWidth="2"
            />
            <circle
              cx={x(i)}
              cy={y(r.gain)}
              r="3.2"
              fill={r.gain > 0 ? '#22d3ee' : '#f87171'}
            />
            <text x={x(i)} y={H - B + 14} fill="#475569" fontSize="9" textAnchor="middle">
              {r.p}
            </text>
          </g>
        ))}
        <text x={L} y={12} fill="#64748b" fontSize="10">
          milliseconds past the ceiling . above zero is a race ruled out
        </text>
      </svg>
    </div>
  );
}

// ============================ playground ============================

type SimPt = { p: number; obs: number; bound: number };

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Two accumulators with a threshold. Alone, each takes threshold over its own rate. Racing, the
// faster of the two wins. Pooled, the rates ADD before anything is compared to a threshold, which
// is the entire difference between the two accounts and the only line of code that changes.
function simulate(rateA: number, rateB: number, noise: number, pooled: boolean, n = 1400): SimPt[] {
  const base = 90;
  const thr = 100;
  const A: number[] = [];
  const V: number[] = [];
  const R: number[] = [];
  for (let i = 0; i < n; i++) {
    const ra = Math.max(0.05, rateA * (1 + noise * gauss() * 0.01));
    const rb = Math.max(0.05, rateB * (1 + noise * gauss() * 0.01));
    A.push(base + thr / ra + noise * gauss());
    V.push(base + thr / rb + noise * gauss());
    const ra2 = Math.max(0.05, rateA * (1 + noise * gauss() * 0.01));
    const rb2 = Math.max(0.05, rateB * (1 + noise * gauss() * 0.01));
    R.push(
      pooled
        ? base + thr / (ra2 + rb2) + noise * gauss()
        : Math.min(base + thr / ra2 + noise * gauss(), base + thr / rb2 + noise * gauss()),
    );
  }
  const sA = sortedCopy(A);
  const sV = sortedCopy(V);
  const sR = sortedCopy(R);
  return PCTS.map((p) => ({
    p,
    obs: invCdf(sR, p / 100),
    bound: invBound(sA, sV, 0, p / 100),
  }));
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500">
        <span>{label}</span>
        <span className="text-slate-400">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </label>
  );
}

function Playground({ mine }: { mine: number }) {
  const [rateA, setRateA] = useState(0.72);
  const [rateB, setRateB] = useState(0.6);
  const [noise, setNoise] = useState(22);
  const [pooled, setPooled] = useState(false);

  const pts = useMemo(() => simulate(rateA, rateB, noise, pooled), [rateA, rateB, noise, pooled]);
  const gain = useMemo(
    () => mean(pts.filter((p) => FAST_PCTS.includes(p.p)).map((p) => p.bound - p.obs)),
    [pts],
  );

  const W = 520;
  const H = 200;
  const L = 40;
  const B = 26;
  const all = pts.flatMap((p) => [p.obs, p.bound]);
  const lo = Math.min(...all) - 10;
  const hi = Math.max(...all) + 10;
  const x = (t: number) => L + ((t - lo) / (hi - lo)) * (W - L - 12);
  const y = (p: number) => H - B - (p / 100) * (H - B - 14);
  const path = (key: 'obs' | 'bound') =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[key]).toFixed(1)},${y(p.p).toFixed(1)}`).join(' ');

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
        the two accounts, with sliders
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Two accumulators and a threshold. In the race, each channel runs alone and the faster one
        moves your hand. In the pool, the two rates are ADDED before anything is compared to the
        threshold. That is the only line that changes. Push the sliders anywhere you like: the race
        never gets through its own ceiling, and the pool does it at once.
      </p>
      <div className="mb-4 flex gap-2">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            onClick={() => setPooled(v)}
            className={`flex-1 rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
              pooled === v
                ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-500'
            }`}
          >
            {v ? 'they pool' : 'they race'}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={W} height={H} className="min-w-[520px]">
          <line x1={L} y1={H - B} x2={W - 12} y2={H - B} stroke="#1e293b" />
          <line x1={L} y1={14} x2={L} y2={H - B} stroke="#1e293b" />
          {[0, 50, 100].map((p) => (
            <text key={p} x={L - 6} y={y(p) + 4} fill="#475569" fontSize="9" textAnchor="end">
              {p}
            </text>
          ))}
          <path d={path('bound')} fill="none" stroke="#fbbf24" strokeWidth="2" />
          <path d={path('obs')} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
        </svg>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Slider
          label="click channel"
          value={rateA}
          min={0.35}
          max={1.2}
          step={0.01}
          onChange={setRateA}
          fmt={(v) => v.toFixed(2)}
        />
        <Slider
          label="flash channel"
          value={rateB}
          min={0.35}
          max={1.2}
          step={0.01}
          onChange={setRateB}
          fmt={(v) => v.toFixed(2)}
        />
        <Slider
          label="noise"
          value={noise}
          min={5}
          max={60}
          step={1}
          onChange={setNoise}
          fmt={(v) => `${v}`}
        />
      </div>
      <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs">
        <div className="flex items-baseline justify-between">
          <span className="text-slate-500">this model, past the ceiling</span>
          <span className={gain > 2 ? 'text-cyan-300' : 'text-slate-400'}>{msTxt(gain)}</span>
        </div>
        {Number.isFinite(mine) && (
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-slate-500">you, past the ceiling</span>
            <span className="text-emerald-300">{msTxt(mine)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================ verdicts ============================

function verdictMain(fit: RaceFit) {
  if (!fit.ok) return fit.reason;
  const g = fit.gainFast;
  if (g.ci[0] > 0)
    return 'Your fast responses to a pair are faster than any race between those two channels can produce. Not faster than an average race, faster than the fastest one arithmetic allows. Something added them together.';
  if (g.m > 0)
    return 'Your fast responses sit past the ceiling, but the interval around that number still contains zero, so this run cannot rule out a race. That is a statement about how many trials there were, not about you.';
  return 'Your pair is faster than either signal alone, and a race between two independent channels accounts for all of it. Nothing here needs pooling. That is a real result and it is the one the arithmetic predicts by default.';
}

function verdictControl(main: RaceFit, ctrl: RaceFit, diff: Stat) {
  if (!ctrl.ok) return ctrl.reason;
  if (main.gainFast.ci[0] > 0 && ctrl.gainFast.ci[1] < 0)
    return 'Two flashes did not break the ceiling and a flash with a click did. The speed-up is not about a bigger event, and it is not about being more awake, because the two flash block put more light on your screen than the click ever added to it.';
  if (diff.ci[0] > 0)
    return 'Both blocks beat their own ceiling, but the audiovisual pair beat it by more, and the difference between them holds up. Some of what you are seeing is a general effect of two things at once, and some of it needs two different senses.';
  if (ctrl.gainFast.ci[0] > 0)
    return 'Two flashes broke the ceiling too, and by about as much. That points at something general about two signals rather than at anything special about ears and eyes, and it is the result that should make you more suspicious of the headline, not less.';
  return 'Neither block reached a verdict against its own ceiling here, so this control cannot do its job in this run.';
}

function verdictHeld(res: Result) {
  const { locked, held } = res;
  if (!locked || !locked.ok || !held)
    return 'The last block never closed, so there is nothing to score.';
  if (!held.ok) return held.reason;
  if (res.heldWinner === 'pool')
    return `With the two channels finally arriving together, your fifteenth percentile came in at ${res.heldObs.toFixed(0)} ms and its whole interval sits below the ${locked.predRace.toFixed(0)} ms the race was committed to. The shift was handed to the race for free, out of your own closed blocks, and it still could not keep up.`;
  if (res.heldWinner === 'race')
    return `With the channels lined up you came in at ${res.heldObs.toFixed(0)} ms, and the entire interval around that sits ABOVE the ${locked.predRace.toFixed(0)} ms ceiling. The race prediction survived a block it had never seen, which is the outcome a held out test exists to be able to produce, and it is the one that should change your reading of everything above it.`;
  return `You came in at ${res.heldObs.toFixed(0)} ms against a committed ceiling of ${locked.predRace.toFixed(0)} ms, and the interval around your number straddles it. Twenty two redundant trials is not many, and this block did not separate the two predictions. That is a statement about how long you were willing to sit here, not about which one is right.`;
}

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const { q, main, control, held, locked } = res;

  if (!res.ok || !main || !main.ok) {
    return (
      <div className="space-y-6">
        <Card tone="rose" label="refused">
          <p className="text-sm leading-relaxed text-slate-300">{res.reason || main?.reason}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            A page that prints a number for any data at all is not measuring anything. This one has
            a ceiling to break and a guess breaks it for free, so the honest move is to refuse.
          </p>
        </Card>
        <QualityCard q={q} />
        <button
          onClick={onAgain}
          className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
        >
          run it again
        </button>
      </div>
    );
  }

  const pairLabel = q.soundOk ? 'a click and a flash' : 'two flashes';

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/80">
          past the fastest race there is, over your fastest quarter
        </div>
        <div className="my-3 text-5xl font-bold text-cyan-200">
          {main.gainFast.m >= 0 ? '' : '-'}
          {Math.abs(main.gainFast.m).toFixed(1)}
          <span className="ml-1 text-2xl text-cyan-400/70">ms</span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">{ciTxt(main.gainFast.ci)}</div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-center">
          <div>
            <div className="font-mono text-lg text-slate-200">{main.meanA.toFixed(0)}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
              {q.soundOk ? 'click alone' : 'left alone'}
            </div>
          </div>
          <div>
            <div className="font-mono text-lg text-slate-200">{main.meanV.toFixed(0)}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
              {q.soundOk ? 'flash alone' : 'right alone'}
            </div>
          </div>
          <div>
            <div className="font-mono text-lg text-cyan-200">{main.meanAV.toFixed(0)}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
              both together
            </div>
          </div>
        </div>
      </div>

      <Card tone="cyan" label="what that number is">
        <p className="text-sm leading-relaxed text-slate-300">{verdictMain(main)}</p>
        <div className="mt-4 space-y-2 font-mono text-xs">
          <Row
            k="the ordinary speed-up, both against the faster single signal"
            v={`${msTxt(main.rse.m)} . ${ciTxt(main.rse.ci)}`}
          />
          <Row
            k="past an independent race, fastest quarter"
            v={`${msTxt(main.gainIndep.m)} . ${ciTxt(main.gainIndep.ci)}`}
          />
          <Row
            k="past the ceiling at the fifteenth percentile"
            v={`${msTxt(main.headline.m)} . ${ciTxt(main.headline.ci)}`}
          />
          <Row k="against an independent race, exact null" v={pTxt(main.pIndep)} />
          <Row k="against the fastest race there is, exact null" v={pTxt(main.pMiller)} />
          <Row
            k="largest single point, descriptive only"
            v={`${msTxt(main.maxGain.v)} at the ${main.maxGain.p}th`}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The headline is the average over the fastest quarter, and it was fixed before your first
          trial for a reason: the largest of twelve points is a maximum of twelve noisy numbers and
          it is bigger than zero even when nothing is going on. It is printed above as a
          description, and it is not a test.
        </p>
        {Math.abs(main.meanA - main.meanV) > 90 && (
          <p className="mt-3 rounded-md border border-amber-400/20 bg-amber-400/[0.04] p-3 text-xs leading-relaxed text-amber-200/80">
            Your two channels are {Math.round(Math.abs(main.meanA - main.meanV))} milliseconds
            apart, which is a lot, and it costs this test most of its power rather than biasing it.
            When one channel wins nearly every trial the ceiling collapses onto that channel&apos;s
            own distribution and the headline becomes a difference between two noisy quantiles.
            Simulated against a known effect, this page catches it 98 percent of the time when the
            two channels are 20 milliseconds apart and 67 percent of the time when they are 100
            apart. A big gap here usually means a big audio output delay rather than an unusual ear,
            and wired headphones or the laptop&apos;s own speakers will shrink it.
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          The two p values above will usually be close to each other. An independent race and the
          fastest conceivable race differ by the product of two small probabilities, which is nearly
          nothing at the fast end where a violation lives, so at the fifth percentile the weak test
          and the strong test are almost the same test. They separate in the middle of the
          distribution, which is where nobody has ever found a violation anyway.
        </p>
      </Card>

      <Card tone="slate" label={`your three curves and the ceiling, from ${pairLabel}`}>
        <CdfPlot fit={main} soundOk={q.soundOk} pair={q.soundOk ? 'av' : 'vv'} />
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Every point on the amber line is the fastest a race between your own two channels could
          be at that percentile. Where the cyan line is to its LEFT, you did something a race
          cannot. Notice where that happens: at the fast end, and nowhere near the slow end. A
          pooled signal only helps when the decision is close.
        </p>
      </Card>

      <Card tone="slate" label="the same thing as a difference, with intervals">
        <GainPlot fit={main} />
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The lit points are the fastest quarter, the ones the headline averages. The bars are
          bootstrap intervals from your own trials. Twelve points means twelve chances to look
          significant by accident, which is exactly why the claim is the average of a pre chosen
          five and not the best of twelve.
        </p>
      </Card>

      {control && (
        <Card tone="rose" label="the block that could have killed it: two flashes, no sound">
          <p className="text-sm leading-relaxed text-slate-300">
            {res.ctrlDiff ? verdictControl(main, control, res.ctrlDiff) : control.reason}
          </p>
          {control.ok && (
            <div className="mt-4 space-y-2 font-mono text-xs">
              <Row
                k="two flashes, past their own ceiling"
                v={`${msTxt(control.gainFast.m)} . ${ciTxt(control.gainFast.ci)}`}
              />
              <Row
                k="click and flash, past theirs"
                v={`${msTxt(main.gainFast.m)} . ${ciTxt(main.gainFast.ci)}`}
              />
              {res.ctrlDiff && (
                <Row
                  k="difference"
                  v={`${msTxt(res.ctrlDiff.m)} . ${ciTxt(res.ctrlDiff.ci)}`}
                />
              )}
              <Row k="two flashes against their exact null" v={pTxt(control.pMiller)} />
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            This block matters more than the headline. A violation with no control is compatible
            with being more awake when more happens, and being more awake is not pooling.
          </p>
        </Card>
      )}

      {locked && locked.ok && held && (
        <Card tone="emerald" label="the prediction the fit never saw">
          <p className="text-sm leading-relaxed text-slate-300">{verdictHeld(res)}</p>
          <div className="mt-4 space-y-2 font-mono text-xs">
            <Row k="delay applied to the faster channel" v={`${Math.abs(locked.d)} ms`} />
            <Row k="the race said" v={`${locked.predRace.toFixed(0)} ms`} />
            <Row k="pooling said" v={`at or under ${locked.predPool.toFixed(0)} ms`} />
            <Row
              k="you did"
              v={`${res.heldObs.toFixed(0)} ms . ${ciTxt(res.heldObsCi)}`}
            />
            <Row k="race missed by" v={msTxt(res.heldRaceErr)} />
            <Row k="pooling missed by" v={msTxt(res.heldPoolErr)} />
            {held.ok && (
              <Row
                k="lined up, past the ceiling recomputed inside the block"
                v={`${msTxt(held.gainFast.m)} . ${ciTxt(held.gainFast.ci)}`}
              />
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Both numbers were on the screen before that block opened and neither could be adjusted
            afterwards. The race prediction is the stronger of the two in one specific sense: it has
            no free parameters at all, it is the measured ceiling evaluated at a shift, so it can be
            wrong in a way that nothing can rescue. It is scored by direction and by an interval
            rather than by which prediction happened to land nearer, because a quantile taken from
            twenty two trials misses low more often than it misses high, and nearest-point scoring
            would hand the win to whichever prediction was lower for free.
          </p>
        </Card>
      )}

      <Card tone="amber" label="what this page cannot tell you">
        <p className="text-sm leading-relaxed text-slate-300">
          The inequality has exactly one assumption and it is invisible in the data. The right hand
          side was measured on trials where only one signal was there, and it is being used to
          describe how that channel behaves on trials where the other one was there too. That is
          called context invariance, and if your eye is genuinely quicker when there is also a
          sound, for any reason at all including simply expecting more, then the two sides are not
          about the same thing and a violation says nothing about pooling.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          No number of trials fixes that. It is not a sample size problem, it is a limit of the
          comparison, and every published Miller violation is standing on it, usually in a footnote.
          Luce said so in 1986, Ashby and Townsend the same year, and Miller himself has spent
          decades saying it louder than his critics.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          So the honest sentence is narrower than the headline: your pair was faster than any race
          between two channels that behave in pairs the way they behave alone. Whether the extra
          speed comes from adding the signals together, or from those channels simply being
          different animals when they have company, this measurement cannot say, and neither can any
          other one shaped like it.
        </p>
      </Card>

      <Card tone="violet" label="the two accounts, playable">
        <Playground mine={main.gainFast.m} />
      </Card>

      <QualityCard q={q} main={main} />

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        run it again
      </button>

      <p className="text-center text-xs leading-relaxed text-slate-600">
        Raab 1962 . Miller, Cognitive Psychology 14, 1982 . Ulrich, Miller and Schroter, Behavior
        Research Methods 39, 2007 . Luce 1986 . Ashby and Townsend 1986 . Stein and Meredith 1993 .
        Otto, Dassy and Mamassian 2013
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-800/60 pb-1">
      <span className="text-slate-500">{k}</span>
      <span className="shrink-0 text-slate-300">{v}</span>
    </div>
  );
}

function QualityCard({ q, main }: { q: Quality; main?: RaceFit }) {
  return (
    <Card tone="slate" label="the run itself">
      <div className="space-y-2 font-mono text-xs">
        <Row k="channels" v={q.soundOk ? 'click and flash' : 'two flashes, no sound'} />
        <Row k="input" v={q.mode} />
        <Row k="minutes" v={q.minutes.toFixed(1)} />
        <Row k="trials with nothing in them" v={`${q.catchN}, pressed on ${pctTxt(q.fa)}`} />
        <Row k="signals missed" v={pctTxt(q.omit)} />
        <Row k="presses before the signal" v={pctTxt(q.early)} />
        <Row k="trials with the tab hidden" v={pctTxt(q.hidden)} />
        <Row
          k="frame interval on this device"
          v={Number.isFinite(q.frameMs) ? `${q.frameMs.toFixed(1)} ms, jitter ${q.frameJit.toFixed(1)}` : 'n/a'}
        />
        {q.soundOk && (
          <Row
            k="audio clock"
            v={`${q.clockExact ? 'mapped by the browser' : 'raw context time'}${
              q.audioOut !== null ? `, output ${q.audioOut.toFixed(0)} ms` : ''
            }${q.audioBase !== null ? `, base ${q.audioBase.toFixed(1)} ms` : ''}`}
          />
        )}
        {main && main.ok && (
          <>
            <Row
              k="measured gap between the two channels"
              v={`${msTxt(main.tau)}${Number.isFinite(main.tauSd) ? `, sd ${main.tauSd.toFixed(1)}` : ''}`}
            />
            <Row k="clean trials per condition" v={`${main.nA} / ${main.nV} / ${main.nAV}`} />
          </>
        )}
        <Row
          k="drift, last main block against the first two"
          v={Number.isFinite(q.drift) ? msTxt(q.drift) : 'n/a'}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        The audio output figure is printed for interest and is used nowhere. It cannot be, and it
        does not need to be: whatever it is, it is inside every click-only reaction time on this
        page, which is exactly the quantity the inequality wants. The gap between the two channels
        is different: that one is measured on every redundant trial and put into the ceiling as a
        shift, because a flash lands on a video frame and a click does not.
      </p>
    </Card>
  );
}
