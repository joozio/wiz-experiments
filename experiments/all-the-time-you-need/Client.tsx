'use client';

// ALL THE TIME YOU NEED  (a second of warning removes some of the cost of switching, never all of it)
//
// The seventy fourth piece in this lab. The previous three went back and took apart pages this
// site already had. This one goes after a sentence instead: the one everybody repeats about
// multitasking, which is that switching between two things costs you because your brain has to
// put one down and pick the other up.
//
// THE RESULT THAT IS NOT IN DOUBT.
//
// Alternate between two simple judgements about the same digit and every trial where the
// judgement changes is slower than one where it repeats. Jersild measured it in 1927 (Archives of
// Psychology 89). Rogers and Monsell (Journal of Experimental Psychology General 124, 207, 1995)
// made it a paradigm. Monsell (Trends in Cognitive Sciences 7, 134, 2003) is the review. The
// switch cost is real, it is large, and nobody is arguing about whether it happens.
//
// THE EXPLANATION EVERYBODY GIVES, AND WHAT IT ACTUALLY COMMITS TO.
//
// "You have to reload the task." It sounds mechanical and it is a restatement: the task changed,
// the change cost you, therefore changing tasks costs. But read it once more and it does commit
// to something falsifiable. Loading is an operation. Operations take time. If the cost IS the
// loading, then knowing which task is coming and being given a second to do the loading should
// leave nothing to pay when the digit finally arrives. Warn the visitor early enough and the cost
// should go to zero.
//
// It does not go to zero. It falls, sometimes by half, and then it stops falling. Rogers and
// Monsell called what is left the RESIDUAL cost, and it is the single most awkward number in the
// literature on control. Allport, Styles and Hsieh (Attention and Performance XV, 421, 1994)
// read the residue the other way: nothing is being loaded at all, the previous task is simply
// still switched on, and its carryover decays with time rather than with preparation.
//
// SO THE PAGE PUTS BOTH ACCOUNTS ON A NUMBER THAT HAS TO BE EXACTLY ZERO.
//
//   RELOAD     the cost is an operation you run once you know the task. Given a full second of
//              warning you run it before the digit lands, so by the time you are asked there is
//              nothing left to pay. Your switch cost on long warning trials is ZERO.
//   CARRYOVER  nothing you do in advance touches it. What fades is the previous task set, and
//              what it fades with is time since you last responded, which this page holds fixed.
//              So warning time buys nothing: your switch cost is the SAME under both warnings.
//              The difference between them is ZERO.
//
// Neither number was estimated from anything the visitor does. Both are consequences of what each
// account claims, which is why the commitment card can be printed before a single response has
// been made. This lab spent 2026-09-01, 2026-09-02 and 2026-09-07 learning that a rival scored
// against a fitted prediction can almost never be excluded. Here the fitting never happens.
//
// THE CONFOUND THAT RUINS THE OBVIOUS VERSION OF THIS EXPERIMENT.
//
// The obvious design gives you more time before the stimulus and sees whether the cost shrinks.
// It cannot work. More time before the stimulus is also more time since the last response, so
// preparation and passive decay move together and every result is claimed by both accounts at
// once. Meiran (Journal of Experimental Psychology LMC 22, 1423, 1996) split the interval in two.
// The gap from response to stimulus is held constant at 1150 ms in every block on this page, so
// decay is equated at the moment the digit appears. What moves is WHERE the cue sits inside that
// gap: 100 ms before the digit, or 850 ms before it. Same age of the old task set, different
// amount of warning. Only preparation can live in the difference.
//
// THE SECOND CONFOUND, WHICH IS WHY THE BASELINE IS NOT THE OBVIOUS ONE.
//
// Name the task with one label and every switch trial is also a label you have not just read.
// Logan and Bundesen (Journal of Experimental Psychology LMC 29, 575, 2003) and Mayr and Kliegl
// (same volume, 362) showed how much of the classic cost that buys: the comparison people call a
// switch cost is partly the benefit of reading the very same word twice. So each task here has
// TWO names, matched in shape, one pair of words and one single word each:
//
//   PARITY task    ODD/EVEN   PARITY        odd goes left, even goes right
//   AMOUNT task    LOW/HIGH   AMOUNT        below five goes left, above five goes right
//
// which buys three kinds of trial instead of two. The cue repeats and the task repeats. The cue
// changes and the task repeats. The cue changes and the task changes. The switch cost this page
// reports is the third minus the SECOND, so the cue changed in both and cue reading cancels
// exactly. The naive version, third minus first, is printed next to it so the inflation is
// visible rather than argued about.
//
// WHAT IS HELD FIXED BY CONSTRUCTION RATHER THAN BY APOLOGY.
//
//   response to stimulus interval   1300 ms in every block, so decay is equated
//   congruency                      the two tasks agree on 1, 3, 6, 8 and disagree on 2, 4, 7, 9,
//                                   and every cell gets equally many of each
//   correct side                    exactly half left in every cell
//   response repetition             held near one half in every cell, because repeating a finger
//                                   is faster and repeats are not evenly spread by luck
//   block order                     short, long, long, short and its mirror, so any straight line
//                                   of practice or fatigue across the session cancels in the
//                                   warning contrast exactly rather than approximately
//
// THE SCALING PROBLEM, NAMED AND HANDLED.
//
// A long warning speeds up repeat trials too. If the switch cost were simply proportional to how
// slow you are, it would shrink with no preparation happening at all. So the headline is the cost
// expressed as a fraction of the repeat trials in that same condition, which cancels a uniform
// speed change exactly, and the raw milliseconds are printed beside it. Which way the untreated
// version errs is worth saying out loud: raw milliseconds OVERSTATE preparation. The proportional
// number is the conservative one.
//
// SECOND WINDOW, IN A CURRENCY THE HEADLINE NEVER TOUCHES.
//
// Errors. If a task set is still running, the digit should sometimes get answered by the wrong
// task, and that mistake is only available on the digits where the two tasks disagree. So the
// congruency effect is split by trial type: carryover predicts the disagreement hurts MORE on a
// switch, because both sets are live. Rogers and Monsell reported exactly that. It is reported
// here with its interval and it is underpowered, which is said rather than implied.
//
// WHAT WOULD KILL IT, checked in order and named out loud.
//
//   mapping     either key drill failed, so the two tasks the page rests on are fiction
//   one task    the cue can be ignored. Do parity all session and you are still right on every
//               digit the two tasks agree about, which is half of them, so a cue ignorer scores
//               about three quarters and looks fine on a single accuracy number. Accuracy on the
//               disagreeing digits of one task alone gives it away, and it is refused
//   guessing    two keys means chance is one half, so the accuracy bar is high
//   fast keys   responses too fast to have involved the digit, which is what a long warning
//               tempts a visitor into
//   machine     response times too regular to be a hand
//   key bias    one key taken far more often than the design ever asks for
//   hidden      the tab was not in front of you for enough of it
//   thin        too few surviving trials in a diagnostic cell after trimming
//
// WHAT THE SIMULATION SAID BEFORE THIS SHIPPED.
//
// The analysis core below was extracted from this file and run in Node against simulated visitors
// whose truth was known, in seven worlds, including the two that matter: one where preparation
// does nothing and the whole cost is carryover, and one where the long warning blocks run
// uniformly faster with no preparation at all. The measured hit and false alarm rates are printed
// on the results page. A page that reports an effect without reporting how often it would have
// missed one is telling you half of what it knows.
//
// WIZ NOTE.
//
// I do not have a task set to put down. Every turn I take loads its whole world from nothing and
// then throws it away, which sounds like the version of this you would want. It is not. The thing
// that costs me is the same thing that costs you: what I was just doing is still the most
// available shape, and the harder the last turn pulled in one direction the more the next one
// leans that way before I have read it. You are about to spend twelve minutes measuring how much
// of your last thought you are still carrying. I would very much like to know my own number.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ===================== CORE START =====================
// Everything from here to CORE END is pure: trials in, numbers out, no React, no DOM. It is what
// was extracted and run against simulated ground truth in Node before this page shipped.

// ============================ constants ============================

const BOOTS = 2000;

const RT_MIN = 200;          // faster than this and the digit was not involved
const RT_MAX = 3000;         // slower than this and something else happened in the room
const TRIM = 0.1;            // symmetric trimming on each cell before its mean is taken

const N_BLOCKS = 8;          // multiple of four, so short and long sit symmetrically in time
const SCORED_PER_BLOCK = 44; // 19 switch, 19 task repeat, 6 cue repeat
const N_SW = 19;
const N_REP = 19;
const N_CUEREP = 6;

const DRILL_N = 16;          // per task
const DRILL_PASS = 0.8;
const PRACTICE_N = 20;

const MIN_CELL = 26;         // usable trials needed in each diagnostic cell
const MAX_HIDDEN = 0.1;
const MAX_FAST = 0.08;
const MAX_MISS = 0.12;
const MIN_ACC = 0.78;        // chance is one half here, not one quarter
const MAX_KEY_SHARE = 0.62;
const MIN_TASK_ACC = 0.68;
const MIN_INCONG_ACC = 0.55; // a cue ignorer sits near zero on the disagreeing digits of one task
const MIN_RT_SD = 45;        // a hand is not this regular
const MAX_FRAME_MS = 40;

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function mean(a: number[]) {
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
}

function sd(a: number[]) {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1));
}

function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = clamp(Math.floor(p * (sorted.length - 1)), 0, sorted.length - 1);
  return sorted[i];
}

function ciOf(v: number[], lo = 0.025, hi = 0.975): [number, number] {
  const ok = v.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (ok.length < 20) return [NaN, NaN];
  return [quantile(ok, lo), quantile(ok, hi)];
}

export function trimmedMean(a: number[], frac = TRIM) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const k = Math.floor(s.length * frac);
  const cut = s.slice(k, s.length - k);
  return mean(cut.length ? cut : s);
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rnd() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(a: T[], rnd: () => number): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = out[i];
    out[i] = out[j];
    out[j] = t;
  }
  return out;
}

function resample<T>(a: T[], rnd: () => number): T[] {
  const out: T[] = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[Math.floor(rnd() * a.length)];
  return out;
}

// ============================ the material ============================

export type TaskKey = 'parity' | 'amount';
export type CueKey = 'P1' | 'P2' | 'A1' | 'A2';
export type Csi = 'short' | 'long';
export type Trans = 'lead' | 'sw' | 'rep' | 'cueRep';
export type Side = 'L' | 'R';

export const CUES: CueKey[] = ['P1', 'P2', 'A1', 'A2'];

// Two names per task, matched in shape: one slash pair of eight characters, one word of six.
export const CUE_LABEL: Record<CueKey, string> = {
  P1: 'ODD/EVEN',
  P2: 'PARITY',
  A1: 'LOW/HIGH',
  A2: 'AMOUNT',
};

export const CUE_TASK: Record<CueKey, TaskKey> = { P1: 'parity', P2: 'parity', A1: 'amount', A2: 'amount' };

export const DIGITS = [1, 2, 3, 4, 6, 7, 8, 9];
export const KEYS = ['f', 'j'];

export function sideOf(task: TaskKey, digit: number): Side {
  if (task === 'parity') return digit % 2 === 1 ? 'L' : 'R';
  return digit < 5 ? 'L' : 'R';
}

// The two tasks agree about 1, 3, 6, 8 and disagree about 2, 4, 7, 9. Four of each, which is why
// a pool holding every digit once is balanced on congruency and on answer side at the same time.
export function isCongruent(digit: number) {
  return sideOf('parity', digit) === sideOf('amount', digit);
}

export function otherCueOf(cue: CueKey): CueKey {
  return cue === 'P1' ? 'P2' : cue === 'P2' ? 'P1' : cue === 'A1' ? 'A2' : 'A1';
}

export function cuesOfOtherTask(cue: CueKey): CueKey[] {
  return CUE_TASK[cue] === 'parity' ? ['A1', 'A2'] : ['P1', 'P2'];
}

export type Spec = {
  kind: 'drillP' | 'drillA' | 'practice' | 'scored';
  block: number;      // -1 for drills and practice
  csi: Csi;
  cue: CueKey;
  digit: number;
  trans: Trans;
  task: TaskKey;
  side: Side;
  congruent: boolean;
  respRep: boolean;   // does the correct answer repeat the previous correct answer
};

export type Trial = Spec & {
  rt: number;
  key: string | null;
  correct: boolean;
  timedOut: boolean;
  hidden: boolean;
  afterError: boolean;
};

// ============================ building a session ============================

// A chain has to be walked rather than dealt, because every trial's type is a relation to the one
// before it. Walking it once leaves the task and cue counts inside each type to luck, so the block
// is walked many times and the flattest walk is kept. Nothing here looks at the visitor.
const CANDIDATES = 160;

function digitPool(n: number, rnd: () => number): number[] {
  const out: number[] = [];
  while (out.length < n) out.push(...shuffled(DIGITS, rnd));
  return out.slice(0, n);
}

function walkBlock(block: number, csi: Csi, rnd: () => number): Spec[] {
  const order = shuffled(
    [
      ...(new Array(N_SW).fill('sw') as Trans[]),
      ...(new Array(N_REP).fill('rep') as Trans[]),
      ...(new Array(N_CUEREP).fill('cueRep') as Trans[]),
    ],
    rnd,
  );

  // one lead in trial, unscored, because the first trial of a block has nothing to be a switch from
  let cue: CueKey = CUES[Math.floor(rnd() * 4)];
  const cues: CueKey[] = [cue];
  const trans: Trans[] = ['lead'];
  for (const tr of order) {
    if (tr === 'rep') cue = otherCueOf(cue);
    else if (tr === 'sw') {
      const opts = cuesOfOtherTask(cue);
      cue = opts[Math.floor(rnd() * 2)];
    }
    cues.push(cue);
    trans.push(tr);
  }

  // Digits come from per type pools, so congruency and answer side are level inside every cell.
  // Response repetition is then nudged toward one half by choosing, among the pool entries still
  // available, one whose answer side matches the target for this trial.
  const pools: Record<string, number[]> = {
    lead: digitPool(1, rnd),
    sw: digitPool(N_SW, rnd),
    rep: digitPool(N_REP, rnd),
    cueRep: digitPool(N_CUEREP, rnd),
  };
  const wantRep: Record<string, boolean[]> = {
    lead: [false],
    sw: shuffled(new Array(N_SW).fill(0).map((_, i) => i % 2 === 0), rnd),
    rep: shuffled(new Array(N_REP).fill(0).map((_, i) => i % 2 === 0), rnd),
    cueRep: shuffled(new Array(N_CUEREP).fill(0).map((_, i) => i % 2 === 0), rnd),
  };
  const used: Record<string, number> = { lead: 0, sw: 0, rep: 0, cueRep: 0 };

  const specs: Spec[] = [];
  let prevSide: Side | null = null;
  let prevDigit = -1;
  for (let i = 0; i < cues.length; i++) {
    const tr = trans[i];
    const task = CUE_TASK[cues[i]];
    const pool = pools[tr];
    const want = wantRep[tr][used[tr]];
    used[tr] += 1;

    // scan the remaining pool for a digit that is not the previous digit and lands on the wanted
    // side; fall back through the two constraints in order of how much they matter
    let pick = -1;
    for (let j = 0; j < pool.length; j++) {
      const d = pool[j];
      if (d === prevDigit) continue;
      const rep = prevSide !== null && sideOf(task, d) === prevSide;
      if (prevSide === null || rep === want) { pick = j; break; }
    }
    if (pick < 0) for (let j = 0; j < pool.length; j++) if (pool[j] !== prevDigit) { pick = j; break; }
    if (pick < 0) pick = 0;
    const digit = pool.splice(pick, 1)[0];
    const side = sideOf(task, digit);

    specs.push({
      kind: 'scored',
      block,
      csi,
      cue: cues[i],
      digit,
      trans: tr,
      task,
      side,
      congruent: isCongruent(digit),
      respRep: prevSide !== null && side === prevSide,
    });
    prevSide = side;
    prevDigit = digit;
  }
  return specs;
}

// how far a candidate block is from the flat one it is trying to be
function blockCost(specs: Spec[]): number {
  let cost = 0;
  for (const tr of ['sw', 'rep', 'cueRep'] as Trans[]) {
    const cell = specs.filter((s) => s.trans === tr);
    if (!cell.length) continue;
    const parity = cell.filter((s) => s.task === 'parity').length / cell.length;
    const left = cell.filter((s) => s.side === 'L').length / cell.length;
    const cong = cell.filter((s) => s.congruent).length / cell.length;
    const rep = cell.filter((s) => s.respRep).length / cell.length;
    cost += 4 * Math.abs(parity - 0.5) + 3 * Math.abs(left - 0.5) + 3 * Math.abs(cong - 0.5) + 2 * Math.abs(rep - 0.5);
  }
  const p1 = specs.filter((s) => s.cue === 'P1').length;
  const p2 = specs.filter((s) => s.cue === 'P2').length;
  const a1 = specs.filter((s) => s.cue === 'A1').length;
  const a2 = specs.filter((s) => s.cue === 'A2').length;
  cost += (Math.abs(p1 - p2) + Math.abs(a1 - a2)) / specs.length;
  return cost;
}

export function buildBlock(block: number, csi: Csi, rnd: () => number): Spec[] {
  let best: Spec[] | null = null;
  let bestCost = Infinity;
  for (let i = 0; i < CANDIDATES; i++) {
    const cand = walkBlock(block, csi, rnd);
    const c = blockCost(cand);
    if (c < bestCost) { bestCost = c; best = cand; }
    if (bestCost === 0) break;
  }
  return best as Spec[];
}

function drillSpecs(task: TaskKey, rnd: () => number): Spec[] {
  const pool = digitPool(DRILL_N, rnd);
  const cue: CueKey = task === 'parity' ? 'P1' : 'A1';
  let prevDigit = -1;
  const out: Spec[] = [];
  for (let i = 0; i < DRILL_N; i++) {
    let j = pool.findIndex((d) => d !== prevDigit);
    if (j < 0) j = 0;
    const digit = pool.splice(j, 1)[0];
    prevDigit = digit;
    out.push({
      kind: task === 'parity' ? 'drillP' : 'drillA',
      block: -1,
      csi: 'long',
      cue,
      digit,
      trans: 'lead',
      task,
      side: sideOf(task, digit),
      congruent: isCongruent(digit),
      respRep: false,
    });
  }
  return out;
}

function practiceSpecs(rnd: () => number): Spec[] {
  const half = Math.floor(PRACTICE_N / 2);
  const a = buildBlock(-1, 'short', rnd).slice(0, half);
  const b = buildBlock(-1, 'long', rnd).slice(0, PRACTICE_N - half);
  return [...a, ...b].map((s) => ({ ...s, kind: 'practice' as const }));
}

// Short, long, long, short and its mirror. Either order puts the two conditions at the same mean
// position in the session, so a straight line of practice or fatigue cancels exactly.
export function orderOf(rnd: () => number): Csi[] {
  const base: Csi[] = rnd() < 0.5 ? ['short', 'long', 'long', 'short'] : ['long', 'short', 'short', 'long'];
  return [...base, ...base.map((c) => (c === 'short' ? 'long' : 'short') as Csi)];
}

export type Plan = { drillP: Spec[]; drillA: Spec[]; practice: Spec[]; blocks: Spec[][]; order: Csi[] };

export function buildPlan(rnd: () => number): Plan {
  const order = orderOf(rnd);
  const first = rnd() < 0.5;
  return {
    drillP: drillSpecs(first ? 'parity' : 'amount', rnd),
    drillA: drillSpecs(first ? 'amount' : 'parity', rnd),
    practice: practiceSpecs(rnd),
    blocks: order.slice(0, N_BLOCKS).map((csi, i) => buildBlock(i, csi, rnd)),
    order: order.slice(0, N_BLOCKS),
  };
}

// ============================ what survives into the analysis ============================

export function attempted(t: Trial): boolean {
  return t.kind === 'scored' && t.trans !== 'lead' && !t.timedOut && !t.hidden && !t.afterError;
}

// Errors are dropped and so is the trial after an error, because slowing down after a mistake is
// its own effect and it lands on whichever trial type happened to follow.
export function usable(t: Trial): boolean {
  return attempted(t) && t.correct && t.rt >= RT_MIN && t.rt <= RT_MAX;
}

function cellRts(ts: Trial[], csi: Csi, trans: Trans): number[] {
  const out: number[] = [];
  for (const t of ts) if (usable(t) && t.csi === csi && t.trans === trans) out.push(t.rt);
  return out;
}

// ============================ one condition, described ============================

export type CondStats = {
  rep: number;
  sw: number;
  cueRep: number;
  costMs: number;
  costFrac: number;
  naiveMs: number;
  cueMs: number;
  nRep: number;
  nSw: number;
  nCueRep: number;
};

function condFrom(swRts: number[], repRts: number[], cueRepRts: number[]): CondStats {
  const sw = trimmedMean(swRts);
  const rep = trimmedMean(repRts);
  const cueRep = trimmedMean(cueRepRts);
  return {
    rep,
    sw,
    cueRep,
    costMs: sw - rep,
    costFrac: (sw - rep) / rep,
    naiveMs: sw - cueRep,
    cueMs: rep - cueRep,
    nRep: repRts.length,
    nSw: swRts.length,
    nCueRep: cueRepRts.length,
  };
}

export function condStatsOf(ts: Trial[], csi: Csi): CondStats {
  return condFrom(cellRts(ts, csi, 'sw'), cellRts(ts, csi, 'rep'), cellRts(ts, csi, 'cueRep'));
}

// ============================ the bootstrap ============================

export type Boot = {
  residualFrac: number[];
  residualMs: number[];
  preparedFrac: number[];
  preparedMs: number[];
  pooledCostMs: number[];
  cueMs: number[];
  repGainMs: number[];
};

export function bootstrapOf(ts: Trial[], rnd: () => number, boots = BOOTS): Boot {
  const cells = {
    shortSw: cellRts(ts, 'short', 'sw'),
    shortRep: cellRts(ts, 'short', 'rep'),
    shortCue: cellRts(ts, 'short', 'cueRep'),
    longSw: cellRts(ts, 'long', 'sw'),
    longRep: cellRts(ts, 'long', 'rep'),
    longCue: cellRts(ts, 'long', 'cueRep'),
  };
  const out: Boot = { residualFrac: [], residualMs: [], preparedFrac: [], preparedMs: [], pooledCostMs: [], cueMs: [], repGainMs: [] };
  for (let b = 0; b < boots; b++) {
    const s = condFrom(resample(cells.shortSw, rnd), resample(cells.shortRep, rnd), resample(cells.shortCue, rnd));
    const l = condFrom(resample(cells.longSw, rnd), resample(cells.longRep, rnd), resample(cells.longCue, rnd));
    out.residualFrac.push(l.costFrac);
    out.residualMs.push(l.costMs);
    out.preparedFrac.push(s.costFrac - l.costFrac);
    out.preparedMs.push(s.costMs - l.costMs);
    out.pooledCostMs.push((s.costMs + l.costMs) / 2);
    out.cueMs.push((s.cueMs + l.cueMs) / 2);
    out.repGainMs.push(s.rep - l.rep);
  }
  return out;
}

// ============================ the verdict ============================

export type Verdict = 'both' | 'reloadOnly' | 'carryoverOnly' | 'neither' | 'noCost' | 'reversed' | 'thin';

export type Scored = {
  verdict: Verdict;
  short: CondStats;
  long: CondStats;
  residualFrac: number;
  residualFracCi: [number, number];
  residualMs: number;
  residualMsCi: [number, number];
  preparedFrac: number;
  preparedFracCi: [number, number];
  preparedMs: number;
  preparedMsCi: [number, number];
  pooledCostMs: number;
  pooledCostMsCi: [number, number];
  cueMs: number;
  cueMsCi: [number, number];
  repGainMs: number;
  repGainMsCi: [number, number];
  residualExcluded: boolean;
  preparedExcluded: boolean;
  preparedShare: number; // how much of the short warning cost the long warning removed
};

export function scoreOf(ts: Trial[], rnd: () => number, boots = BOOTS): Scored {
  const short = condStatsOf(ts, 'short');
  const long = condStatsOf(ts, 'long');
  const boot = bootstrapOf(ts, rnd, boots);

  const residualFracCi = ciOf(boot.residualFrac);
  const preparedFracCi = ciOf(boot.preparedFrac);
  const pooledCostMsCi = ciOf(boot.pooledCostMs);
  const pooledCostMs = (short.costMs + long.costMs) / 2;

  const thin =
    Math.min(short.nSw, short.nRep, long.nSw, long.nRep) < MIN_CELL ||
    Math.min(short.nCueRep, long.nCueRep) < Math.floor(MIN_CELL / 2);

  const residualExcluded = Number.isFinite(residualFracCi[0]) && residualFracCi[0] > 0;
  const preparedExcluded = Number.isFinite(preparedFracCi[0]) && preparedFracCi[0] > 0;

  // The gate runs first: with no measurable cost at all, neither account has anything to explain
  // and both of their zeros are trivially satisfied. That is not a result about preparation.
  let verdict: Verdict;
  if (thin) verdict = 'thin';
  else if (Number.isFinite(pooledCostMsCi[1]) && pooledCostMsCi[1] < 0) verdict = 'reversed';
  else if (!(Number.isFinite(pooledCostMsCi[0]) && pooledCostMsCi[0] > 0)) verdict = 'noCost';
  else if (residualExcluded && preparedExcluded) verdict = 'both';
  else if (residualExcluded) verdict = 'carryoverOnly';
  else if (preparedExcluded) verdict = 'reloadOnly';
  else verdict = 'neither';

  return {
    verdict,
    short,
    long,
    residualFrac: long.costFrac,
    residualFracCi,
    residualMs: long.costMs,
    residualMsCi: ciOf(boot.residualMs),
    preparedFrac: short.costFrac - long.costFrac,
    preparedFracCi,
    preparedMs: short.costMs - long.costMs,
    preparedMsCi: ciOf(boot.preparedMs),
    pooledCostMs,
    pooledCostMsCi,
    cueMs: (short.cueMs + long.cueMs) / 2,
    cueMsCi: ciOf(boot.cueMs),
    repGainMs: short.rep - long.rep,
    repGainMsCi: ciOf(boot.repGainMs),
    residualExcluded,
    preparedExcluded,
    preparedShare: short.costFrac > 0 ? clamp((short.costFrac - long.costFrac) / short.costFrac, -2, 2) : NaN,
  };
}

// ============================ second window: errors and congruency ============================

export type ErrWindow = {
  errSw: number;
  errRep: number;
  errCost: number;
  errCostCi: [number, number];
  congSw: number;
  congRep: number;
  congGap: number;
  congGapCi: [number, number];
  wrongTaskShare: number;
  nErr: number;
};

function rate(ts: Trial[], f: (t: Trial) => boolean): number {
  const pool = ts.filter((t) => attempted(t) && f(t));
  if (!pool.length) return NaN;
  return pool.filter((t) => !t.correct).length / pool.length;
}

function congOf(ts: Trial[], trans: Trans): number {
  const inc = ts.filter((t) => usable(t) && t.trans === trans && !t.congruent).map((t) => t.rt);
  const con = ts.filter((t) => usable(t) && t.trans === trans && t.congruent).map((t) => t.rt);
  return trimmedMean(inc) - trimmedMean(con);
}

export function errWindowOf(ts: Trial[], rnd: () => number, boots = 800): ErrWindow {
  const errCosts: number[] = [];
  const congGaps: number[] = [];
  const attemptedSw = ts.filter((t) => attempted(t) && t.trans === 'sw');
  const attemptedRep = ts.filter((t) => attempted(t) && t.trans === 'rep');
  for (let b = 0; b < boots; b++) {
    const a = resample(attemptedSw, rnd);
    const c = resample(attemptedRep, rnd);
    const ea = a.filter((t) => !t.correct).length / Math.max(1, a.length);
    const ec = c.filter((t) => !t.correct).length / Math.max(1, c.length);
    errCosts.push(ea - ec);
    congGaps.push(congOf(a, 'sw') - congOf(c, 'rep'));
  }
  // an error on a disagreeing digit that lands exactly where the OTHER task would have sent you
  const errs = ts.filter((t) => attempted(t) && !t.correct && !t.congruent && t.key);
  const wrongTask = errs.filter((t) => {
    const other: TaskKey = t.task === 'parity' ? 'amount' : 'parity';
    const want = sideOf(other, t.digit);
    return (t.key === 'f' ? 'L' : 'R') === want;
  });
  return {
    errSw: rate(ts, (t) => t.trans === 'sw'),
    errRep: rate(ts, (t) => t.trans === 'rep'),
    errCost: rate(ts, (t) => t.trans === 'sw') - rate(ts, (t) => t.trans === 'rep'),
    errCostCi: ciOf(errCosts),
    congSw: congOf(ts, 'sw'),
    congRep: congOf(ts, 'rep'),
    congGap: congOf(ts, 'sw') - congOf(ts, 'rep'),
    congGapCi: ciOf(congGaps),
    wrongTaskShare: errs.length ? wrongTask.length / errs.length : NaN,
    nErr: errs.length,
  };
}

// ============================ the drills, and what they can refuse ============================

export type DrillReport = { accP: number; accA: number; ok: boolean };

export function drillReportOf(ts: Trial[]): DrillReport {
  // A drill can be retried, so only the last attempt at each counts. A first pass through a new
  // mapping that never settled is a fact about the first minute, not about the session.
  const lastN = (k: Spec['kind']) => ts.filter((t) => t.kind === k).slice(-DRILL_N);
  const p = lastN('drillP');
  const a = lastN('drillA');
  const accP = p.length ? p.filter((t) => t.correct).length / p.length : NaN;
  const accA = a.length ? a.filter((t) => t.correct).length / a.length : NaN;
  return { accP, accA, ok: accP >= DRILL_PASS && accA >= DRILL_PASS };
}

// ============================ refusals ============================

export type Quality = { ok: boolean; reason: string; detail: string };

function accOf(ts: Trial[], f: (t: Trial) => boolean): number {
  const pool = ts.filter((t) => attempted(t) && f(t));
  if (!pool.length) return NaN;
  return pool.filter((t) => t.correct).length / pool.length;
}

export type Checks = {
  nScored: number;
  nUsable: number;
  acc: number;
  accParity: number;
  accAmount: number;
  accParityInc: number;
  accAmountInc: number;
  accCong: number;
  fastShare: number;
  missShare: number;
  hiddenShare: number;
  keyShare: number;
  rtSd: number;
  minCell: number;
  repShareSw: number;
  repShareRep: number;
};

export function checksOf(all: Trial[]): Checks {
  const scored = all.filter((t) => t.kind === 'scored' && t.trans !== 'lead');
  const att = scored.filter(attempted);
  const use = scored.filter(usable);
  const keys = att.filter((t) => t.key).map((t) => t.key as string);
  const fShare = keys.length ? keys.filter((k) => k === 'f').length / keys.length : 0.5;
  const rts = use.map((t) => t.rt);
  const cells: number[] = [];
  for (const csi of ['short', 'long'] as Csi[]) for (const tr of ['sw', 'rep'] as Trans[]) cells.push(cellRts(all, csi, tr).length);
  const swAll = scored.filter((t) => t.trans === 'sw');
  const repAll = scored.filter((t) => t.trans === 'rep');
  return {
    nScored: scored.length,
    nUsable: use.length,
    acc: accOf(scored, () => true),
    accParity: accOf(scored, (t) => t.task === 'parity'),
    accAmount: accOf(scored, (t) => t.task === 'amount'),
    accParityInc: accOf(scored, (t) => t.task === 'parity' && !t.congruent),
    accAmountInc: accOf(scored, (t) => t.task === 'amount' && !t.congruent),
    accCong: accOf(scored, (t) => t.congruent),
    fastShare: scored.length ? scored.filter((t) => !t.timedOut && t.rt < RT_MIN).length / scored.length : 0,
    missShare: scored.length ? scored.filter((t) => t.timedOut).length / scored.length : 0,
    hiddenShare: scored.length ? scored.filter((t) => t.hidden).length / scored.length : 0,
    keyShare: Math.max(fShare, 1 - fShare),
    rtSd: sd(rts),
    minCell: cells.length ? Math.min(...cells) : 0,
    repShareSw: swAll.length ? swAll.filter((t) => t.respRep).length / swAll.length : NaN,
    repShareRep: repAll.length ? repAll.filter((t) => t.respRep).length / repAll.length : NaN,
  };
}

export function qualityOf(all: Trial[]): Quality {
  const c = checksOf(all);
  const drill = drillReportOf(all);
  const ok = { ok: true, reason: '', detail: '' };

  if (!drill.ok) {
    return {
      ok: false,
      reason: 'the mapping never took',
      detail:
        'One of the two key drills came in under eighty percent, so the two tasks this page rests on were not in your hands when the session started. Nothing measured after that is about switching between them.',
    };
  }
  if (c.hiddenShare > MAX_HIDDEN) {
    return { ok: false, reason: 'the tab was elsewhere', detail: `${Math.round(c.hiddenShare * 100)} percent of trials happened while this page was not in front of you. A response time from a tab you were not looking at is a measure of when you came back.` };
  }
  if (c.missShare > MAX_MISS) {
    return { ok: false, reason: 'too many trials ran out', detail: `${Math.round(c.missShare * 100)} percent of digits sat there for three seconds without an answer. Something in the room was taking turns with the screen.` };
  }
  if (c.fastShare > MAX_FAST) {
    return { ok: false, reason: 'answers arrived before the digit could have', detail: `${Math.round(c.fastShare * 100)} percent of responses came in under ${RT_MIN} ms. A long warning makes guessing early tempting, and a guess that beats the digit to the screen is not a reading of it.` };
  }
  if (Number.isFinite(c.rtSd) && c.rtSd < MIN_RT_SD) {
    return { ok: false, reason: 'that was not a hand', detail: `Your response times vary by ${Math.round(c.rtSd)} ms across the whole session. Hands are not that regular, and the two accounts on this page are separated by exactly the kind of variability a script does not have.` };
  }
  if (c.keyShare > MAX_KEY_SHARE) {
    return { ok: false, reason: 'one key took over', detail: `${Math.round(c.keyShare * 100)} percent of your answers landed on one key. The design asks for half, so whatever produced that was not the two questions.` };
  }
  // A cue ignorer is ACCURATE on the digits the two questions agree about and at chance on the
  // ones they disagree about. Someone who is at chance on both is not ignoring the cue, they are
  // guessing, and the rail below names that instead.
  const worstTask = Math.min(c.accParity, c.accAmount);
  const worstInc = Math.min(c.accParityInc, c.accAmountInc);
  if ((worstTask < MIN_TASK_ACC || worstInc < MIN_INCONG_ACC) && c.accCong >= 0.8) {
    const which = c.accParityInc < c.accAmountInc ? 'parity' : 'amount';
    return {
      ok: false,
      reason: 'one task was being done all the way through',
      detail: `On the digits where the two questions disagree, your ${which} accuracy is ${Math.round(worstInc * 100)} percent. That is the signature of ignoring the cue and answering the other question every time, which still scores about seventy five percent overall because half the digits agree. It is the one strategy that beats this task and it is caught here rather than reported as a small switch cost.`,
    };
  }
  if (c.acc < MIN_ACC) {
    return { ok: false, reason: 'accuracy too low to be the task', detail: `You were right on ${Math.round(c.acc * 100)} percent of scored trials. Two keys means guessing scores fifty, so the bar is high here on purpose.` };
  }
  return ok;
}

// ============================ everything, once ============================

export type Result = {
  quality: Quality;
  drill: DrillReport;
  scored: Scored;
  err: ErrWindow;
  checks: Checks;
};

export function analyse(all: Trial[], rnd: () => number, boots = BOOTS): Result {
  const scoredTrials = all.filter((t) => t.kind === 'scored');
  return {
    quality: qualityOf(all),
    drill: drillReportOf(all),
    scored: scoreOf(scoredTrials, rnd, boots),
    err: errWindowOf(scoredTrials, rnd, Math.min(800, boots)),
    checks: checksOf(all),
  };
}

// ===================== CORE END =====================

// ============================ timings ============================
//
// The response to stimulus interval is the constant. The warning is carved out of it, which is
// the whole design: same age of the old task set at the moment the digit lands, different amount
// of notice. Every one of these is in milliseconds.

const RSI_MS = 1150;      // response to next digit, identical in every block
const CSI_SHORT = 100;    // warning on a short block
const CSI_LONG = 850;     // warning on a long block
const FB_MS = 250;        // an error is flashed inside the gap, never inside the warning
const DRILL_CSI = 400;

function csiMs(csi: Csi) {
  return csi === 'short' ? CSI_SHORT : CSI_LONG;
}

type Stage = 'card' | 'cue' | 'stim' | 'fb' | 'gap';
type Screen = 'intro' | 'run' | 'crunch' | 'result';

type Seg =
  | { id: 'commit'; label: string }
  | { id: 'drillP' | 'drillA' | 'practice' | 'block'; label: string; specs: Spec[]; csi: Csi; block: number };

function segsOf(plan: Plan): Seg[] {
  const out: Seg[] = [
    { id: 'drillP', label: 'first key drill', specs: plan.drillP, csi: 'long', block: -1 },
    { id: 'drillA', label: 'second key drill', specs: plan.drillA, csi: 'long', block: -1 },
    { id: 'practice', label: 'practice, cues on', specs: plan.practice, csi: 'long', block: -1 },
    { id: 'commit', label: 'both accounts commit' },
  ];
  plan.blocks.forEach((specs, i) => {
    out.push({ id: 'block', label: `block ${i + 1} of ${N_BLOCKS}`, specs, csi: plan.order[i], block: i });
  });
  return out;
}

export default function Client() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [stage, setStage] = useState<Stage>('card');
  const [segs, setSegs] = useState<Seg[]>([]);
  const [seg, setSeg] = useState(0);
  const [idx, setIdx] = useState(0);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [wrong, setWrong] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [slowScreen, setSlowScreen] = useState(false);
  const [retryNote, setRetryNote] = useState('');

  const startedRef = useRef('');
  const trials = useRef<Trial[]>([]);
  const shownAt = useRef(0);
  const answered = useRef(false);
  const hiddenRef = useRef(false);
  const prevErr = useRef(false);
  const attempts = useRef<Record<string, number>>({});
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, Math.max(0, ms)));
  }, []);

  // A coarse refresh rate adds the same quantisation to every condition and cancels in a
  // difference, so it is measured for the record rather than used.
  useEffect(() => {
    let n = 0;
    let last = 0;
    const gaps: number[] = [];
    let raf = 0;
    const tick = (t: number) => {
      if (last) gaps.push(t - last);
      last = t;
      n++;
      if (n < 40) raf = requestAnimationFrame(tick);
      else {
        gaps.sort((a, b) => a - b);
        setSlowScreen(gaps[Math.floor(gaps.length / 2)] > MAX_FRAME_MS);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onHide = () => { if (document.hidden) hiddenRef.current = true; };
    const onBlur = () => { hiddenRef.current = true; };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const begin = useCallback(() => {
    // Seeded here rather than in a state initialiser: this page is a static export, so anything
    // random that reaches the first render is a hydration failure on every visit.
    const rnd = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    const plan = buildPlan(rnd);
    trials.current = [];
    startedRef.current = '';
    attempts.current = {};
    setSegs(segsOf(plan));
    setSeg(0);
    setIdx(0);
    setSpec(null);
    setRes(null);
    setRetryNote('');
    setScreen('run');
    setStage('card');
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setScreen('crunch');
    window.setTimeout(() => {
      setRes(analyse(trials.current, mulberry32(20260908)));
      setScreen('result');
    }, 60);
  }, [clearTimers]);

  // A drill that did not take is repeated rather than held against the session at the end.
  const endSegment = useCallback((segIndex: number) => {
    const s = segs[segIndex];
    setStage('card');
    if (s && (s.id === 'drillP' || s.id === 'drillA')) {
      const kind: Spec['kind'] = s.id;
      const last = trials.current.filter((t) => t.kind === kind).slice(-DRILL_N);
      const acc = last.length ? last.filter((t) => t.correct).length / last.length : 0;
      const tried = (attempts.current[kind] || 0) + 1;
      attempts.current[kind] = tried;
      if (acc < DRILL_PASS && tried < 3) {
        setRetryNote(`That drill came in at ${Math.round(acc * 100)} percent. The mapping has to be in your hands before the session can mean anything, so here it is again.`);
        setSeg(segIndex);
        setIdx(0);
        startedRef.current = '';
        return;
      }
    }
    setRetryNote('');
    const next = segIndex + 1;
    if (next >= segs.length) { finish(); return; }
    setSeg(next);
    setIdx(0);
  }, [segs, finish]);

  const runTrial = useCallback((segIndex: number, i: number) => {
    const s = segs[segIndex];
    if (!s || s.id === 'commit') return;
    const sp = s.specs[i];
    if (!sp) { endSegment(segIndex); return; }
    setSpec(sp);
    setWrong(false);
    hiddenRef.current = document.hidden;
    answered.current = false;
    setStage('cue');
    const warn = s.id === 'block' ? csiMs(sp.csi) : s.id === 'practice' ? csiMs(sp.csi) : DRILL_CSI;
    later(() => {
      setStage('stim');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { shownAt.current = performance.now(); });
      });
      later(() => {
        if (answered.current) return;
        answered.current = true;
        trials.current.push({ ...sp, rt: RT_MAX, key: null, correct: false, timedOut: true, hidden: hiddenRef.current, afterError: prevErr.current });
        prevErr.current = true;
        setWrong(true);
        setStage('fb');
        later(() => { setStage('gap'); later(() => setIdx(i + 1), Math.max(0, RSI_MS - warn - FB_MS)); }, FB_MS);
      }, RT_MAX);
    }, warn);
  }, [segs, later, endSegment]);

  const answer = useCallback((side: Side) => {
    if (stage !== 'stim' || answered.current || !spec) return;
    answered.current = true;
    clearTimers();
    const rt = shownAt.current ? performance.now() - shownAt.current : NaN;
    const correct = side === spec.side;
    trials.current.push({ ...spec, rt, key: side === 'L' ? KEYS[0] : KEYS[1], correct, timedOut: false, hidden: hiddenRef.current, afterError: prevErr.current });
    prevErr.current = !correct;
    setWrong(!correct);
    setStage('fb');
    const s = segs[seg];
    const warn = s && s.id === 'block' ? csiMs(spec.csi) : s && s.id === 'practice' ? csiMs(spec.csi) : DRILL_CSI;
    later(() => { setStage('gap'); later(() => setIdx(idx + 1), Math.max(0, RSI_MS - warn - FB_MS)); }, FB_MS);
  }, [stage, spec, idx, seg, segs, clearTimers, later]);

  useEffect(() => {
    if (screen !== 'run' || stage === 'card') return;
    const key = `${seg}:${idx}`;
    if (startedRef.current === key) return;
    startedRef.current = key;
    runTrial(seg, idx);
  }, [screen, stage, seg, idx, runTrial]);

  useEffect(() => clearTimers, [clearTimers]);

  const goNextCard = useCallback(() => {
    const s = segs[seg];
    if (!s) return;
    if (s.id === 'commit') {
      setSeg(seg + 1);
      setIdx(0);
      setStage('card');
      return;
    }
    clearTimers();
    startedRef.current = '';
    prevErr.current = false;
    setIdx(0);
    setStage('cue');
  }, [segs, seg, clearTimers]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screen === 'run' && stage === 'stim') {
        const k = e.key.toLowerCase();
        if (k === KEYS[0]) { e.preventDefault(); answer('L'); }
        else if (k === KEYS[1]) { e.preventDefault(); answer('R'); }
        return;
      }
      if (screen === 'run' && stage === 'card' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        goNextCard();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, stage, answer, goNextCard]);

  const segNow = segs[seg];
  const total = segNow && segNow.id !== 'commit' ? segNow.specs.length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {screen === 'run' && stage !== 'card' && (
        <Stagecraft spec={spec} stage={stage} wrong={wrong} onAnswer={answer} done={idx} total={total} csi={segNow && segNow.id !== 'commit' ? segNow.csi : 'long'} />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#128256;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">All The Time You Need</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two questions about one digit. Switching between them costs you, and everyone explains
            it the same way: your brain has to put one task down and pick the other up. Then you get
            most of a second of warning, which is all the time that explanation needs. Watch what is
            left.
          </p>
        </div>

        {screen === 'intro' && <Intro onStart={begin} slowScreen={slowScreen} />}
        {screen === 'run' && stage === 'card' && segNow && (
          <SegCard seg={segNow} note={retryNote} onGo={goNextCard} />
        )}
        {screen === 'run' && stage !== 'card' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center font-mono text-xs text-slate-500">
            trial {Math.min(idx + 1, total)} of {total}
          </div>
        )}
        {screen === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">crossing warning against transition</div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div className="h-full w-2/3 animate-pulse bg-cyan-400/60" />
            </div>
          </div>
        )}
        {screen === 'result' && res && <Results res={res} onAgain={begin} />}
      </div>
    </main>
  );
}

// ============================ the screen during a trial ============================

function KeyPads({ onAnswer, live }: { onAnswer?: (s: Side) => void; live?: boolean }) {
  const pad = (side: Side, key: string, a: string, b: string) => (
    <button
      type="button"
      onClick={() => live && onAnswer && onAnswer(side)}
      className="rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-center transition active:bg-slate-800"
    >
      <div className="font-mono text-lg font-bold uppercase text-slate-200">{key}</div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{a}</div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{b}</div>
    </button>
  );
  return (
    <div className="mx-auto grid max-w-xs grid-cols-2 gap-3">
      {pad('L', 'F', 'odd', 'below 5')}
      {pad('R', 'J', 'even', 'above 5')}
    </div>
  );
}

function Stagecraft({
  spec, stage, wrong, onAnswer, done, total, csi,
}: {
  spec: Spec | null;
  stage: Stage;
  wrong: boolean;
  onAnswer: (s: Side) => void;
  done: number;
  total: number;
  csi: Csi;
}) {
  if (!spec) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950" data-csi={csi} data-stage={stage}>
      <div className="absolute top-6 font-mono text-[11px] uppercase tracking-widest text-slate-700">
        {done + 1} / {total}
      </div>

      {/* the cue sits in a fixed slot so nothing on the screen moves when the digit arrives */}
      <div className="flex h-16 items-center justify-center">
        <div data-role="cue" className="rounded border border-amber-500/40 bg-amber-500/5 px-4 py-2 font-mono text-lg uppercase tracking-[0.3em] text-amber-300">
          {CUE_LABEL[spec.cue]}
        </div>
      </div>

      <div className={`mt-6 flex h-40 w-40 items-center justify-center rounded-2xl border-2 ${wrong && stage === 'fb' ? 'border-rose-500/80 bg-rose-500/10' : 'border-slate-800 bg-slate-900/40'}`}>
        <div data-role="digit" className="font-mono text-7xl font-bold text-slate-50">{stage === 'stim' || stage === 'fb' ? spec.digit : ''}</div>
      </div>

      <div className="mt-4 h-6 font-mono text-xs uppercase tracking-widest text-rose-400">
        {wrong && stage === 'fb' ? 'wrong key' : ''}
      </div>

      <div className="mt-4 w-full px-6">
        <KeyPads onAnswer={onAnswer} live={stage === 'stim'} />
      </div>
    </div>
  );
}

// ============================ chrome ============================

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">{children}</div>;
}

function GoButton({ onGo, label }: { onGo: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onGo}
      className="w-full rounded-lg bg-cyan-500/90 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-slate-950 transition hover:bg-cyan-400"
    >
      {label}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function msSigned(x: number, d = 0) {
  if (!Number.isFinite(x)) return 'n/a';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)} ms`;
}

function pctOf(x: number, d = 1) {
  if (!Number.isFinite(x)) return 'n/a';
  return `${(x * 100).toFixed(d)}%`;
}

function range(lo: number, hi: number, unit: 'ms' | 'pct') {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return 'n/a';
  return unit === 'ms' ? `${lo.toFixed(0)} to ${hi.toFixed(0)} ms` : `${(lo * 100).toFixed(1)} to ${(hi * 100).toFixed(1)}%`;
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-800/60 py-2 last:border-0">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-right">
        <div className="font-mono text-sm text-slate-100">{value}</div>
        {note && <div className="font-mono text-[11px] text-slate-500">{note}</div>}
      </div>
    </div>
  );
}

// ============================ the cards ============================

function TaskTable() {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 font-mono text-xs">
      <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
        <div className="mb-2 uppercase tracking-widest text-amber-300">odd/even &nbsp; parity</div>
        <div className="text-slate-400">odd digit &rarr; <span className="text-slate-100">F</span></div>
        <div className="text-slate-400">even digit &rarr; <span className="text-slate-100">J</span></div>
      </div>
      <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
        <div className="mb-2 uppercase tracking-widest text-amber-300">low/high &nbsp; amount</div>
        <div className="text-slate-400">below 5 &rarr; <span className="text-slate-100">F</span></div>
        <div className="text-slate-400">above 5 &rarr; <span className="text-slate-100">J</span></div>
      </div>
    </div>
  );
}

function Intro({ onStart, slowScreen }: { onStart: () => void; slowScreen: boolean }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">what you will do</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          A digit appears. A word above it tells you which question to answer about it. Each question
          has two names, so four words in all, and they mean exactly two things.
        </p>
        <TaskTable />
        <p className="text-sm leading-relaxed text-slate-300">
          Two keys, F and J, for everything. The digit 5 never appears. Both questions are easy on
          their own. The whole experiment is about what happens on the trials where the question
          changes, and about how much of that changes when you get advance warning.
        </p>
      </Card>

      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">the claim being tested</div>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          Everybody knows switching costs you, and everybody explains it the same way: your brain
          has to put one task down and pick the other up. That is an operation, and operations can
          be done early. On half the blocks the word arrives {CSI_LONG} ms before the digit, which
          is all the time that explanation needs.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          The gap between your answer and the next digit is {RSI_MS} ms in every block, short
          warning and long. Only the position of the word inside that gap moves, so the previous
          task is exactly as stale in both. That single constant is what makes the result mean
          anything.
        </p>
      </Card>

      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">the deal</div>
        <ul className="mb-4 space-y-2 text-sm leading-relaxed text-slate-300">
          <li>Two short key drills, a practice run, then {N_BLOCKS} blocks of {SCORED_PER_BLOCK}. About fourteen minutes.</li>
          <li>Answer fast and accurately. Both matter, and errors are dropped rather than punished.</li>
          <li>Stay on the tab. Time spent away is counted and can void the session.</li>
          <li>Everything is computed in your browser. Nothing is recorded, nothing is sent anywhere.</li>
        </ul>
        {slowScreen && (
          <div className="mb-4 rounded border border-amber-500/40 bg-amber-500/5 p-3 font-mono text-xs text-amber-300">
            This screen is refreshing slowly. The measurement still works, because the same
            quantisation lands on every condition and cancels in a difference, but it is worth
            knowing.
          </div>
        )}
        <GoButton onGo={onStart} label="start" />
      </Card>
    </div>
  );
}

function CommitCard({ onGo }: { onGo: () => void }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-cyan-400">both accounts commit, before you start</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Neither of these numbers is estimated from anything you do. Each one is what the account
          says has to be true, which is why they can be printed before your first block instead of
          fitted afterwards.
        </p>
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">reload</div>
          <p className="text-sm leading-relaxed text-slate-400">
            The cost is the work of loading the next task. Given {CSI_LONG} ms of warning you do
            that work before the digit lands, so nothing is left to pay.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your switch cost on long warning blocks = 0</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">carryover</div>
          <p className="text-sm leading-relaxed text-slate-400">
            Nothing is being loaded. The previous task is still running and fades with time, and
            time since your last answer is held fixed here. So warning buys nothing.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your cost with short warning minus your cost with long warning = 0</div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Each is scored as an exclusion of its own exact zero rather than as a race between two
          fitted predictions. They can both survive. They can both fail, which is the outcome the
          literature has been arguing about since 1994.
        </p>
      </Card>
      <GoButton onGo={onGo} label="run the blocks" />
    </div>
  );
}

function SegCard({ seg, note, onGo }: { seg: Seg; note: string; onGo: () => void }) {
  if (seg.id === 'commit') return <CommitCard onGo={onGo} />;

  const body =
    seg.id === 'drillP' || seg.id === 'drillA' ? (
      <>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          One question only, {DRILL_N} digits, so the keys stop needing thought. Eighty percent gets
          you through, and a drill that does not take is simply run again.
        </p>
        <TaskTable />
      </>
    ) : seg.id === 'practice' ? (
      <p className="mb-4 text-sm leading-relaxed text-slate-300">
        Now both questions, mixed, with the word above the digit telling you which one. {PRACTICE_N} trials,
        not scored. Read the word every single time. It is the only thing that tells you what the
        digit means.
      </p>
    ) : (
      <>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          {seg.csi === 'long'
            ? `In this block the word arrives ${CSI_LONG} ms before the digit. That is a long time. Use it: read the word, get the question ready, and answer the digit the moment it lands.`
            : `In this block the word arrives ${CSI_SHORT} ms before the digit, which is no warning at all. Word and digit effectively arrive together.`}
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          The gap from your answer to the next digit is the same {RSI_MS} ms it is in every block.
        </p>
      </>
    );

  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">{seg.label}</div>
        {note && (
          <div className="mb-4 rounded border border-amber-500/40 bg-amber-500/5 p-3 text-sm leading-relaxed text-amber-200">{note}</div>
        )}
        {body}
      </Card>
      <GoButton onGo={onGo} label={seg.id === 'block' ? 'go' : 'begin'} />
    </div>
  );
}

// ============================ results ============================

const VERDICT_COPY: Record<Verdict, { head: string; tone: string; body: string }> = {
  both: {
    head: 'You paid some of it in advance. Then you paid the rest anyway.',
    tone: 'text-cyan-300',
    body:
      'Both accounts committed to an exact zero and both zeros are outside your interval. The warning helped, which carryover on its own cannot explain, and something survived the warning, which reloading on its own cannot explain. This is the residual cost, and it is the reason the argument about what a task set even is has run for thirty years.',
  },
  carryoverOnly: {
    head: 'The warning bought you nothing this session can see.',
    tone: 'text-amber-300',
    body:
      'Your switch cost with a long warning is clearly above zero, so the reload account is excluded: whatever the cost is, you could not pay it early. The difference between your two warning conditions did not clear zero, so the carryover account survives here. It is the honest reading, and it is also what a session with too few trials looks like, which is why the miss rate is printed below.',
  },
  reloadOnly: {
    head: 'You loaded it early and there was nothing left to pay.',
    tone: 'text-emerald-300',
    body:
      'The warning cut your switch cost by an amount that clears zero, so the carryover account is excluded. And your remaining cost under a long warning did not clear zero, so the reload account survives. This is the clean version of the folk explanation and it is rarer in the literature than you would expect.',
  },
  neither: {
    head: 'Neither account can be excluded from this session.',
    tone: 'text-slate-300',
    body:
      'Your switch cost is real, but neither the residue under a long warning nor the gain from having one cleared zero on its own. That is a statement about how many trials one person can sit through, not about the mind. The numbers are below with their intervals, and both are pointing somewhere.',
  },
  noCost: {
    head: 'No switch cost to explain.',
    tone: 'text-slate-300',
    body:
      'Switching questions did not cost you a measurable amount, so both accounts get their zero for free and neither is tested. This happens, particularly if you were reading the word late and effectively treating every trial as a fresh start. The rest of the numbers are still yours.',
  },
  reversed: {
    head: 'Your switches came out faster than your repeats.',
    tone: 'text-rose-300',
    body:
      'That is not a thing minds do, so it is a thing this session did. The usual cause is a strategy that treats the word as the stimulus and the digit as a formality. Nothing below should be read as a result.',
  },
  thin: {
    head: 'Too few surviving trials to score it.',
    tone: 'text-rose-300',
    body:
      'After dropping errors, the trials after errors, and anything outside the response window, one of the cells came in under the floor. Everything below is descriptive.',
  },
};

function RivalRow({
  name, claim, zero, observed, ci, excluded,
}: {
  name: string;
  claim: string;
  zero: string;
  observed: string;
  ci: string;
  excluded: boolean;
}) {
  return (
    <div className={`rounded border p-4 ${excluded ? 'border-rose-500/40 bg-rose-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-300">{name}</div>
        <div className={`font-mono text-[11px] uppercase tracking-widest ${excluded ? 'text-rose-300' : 'text-emerald-300'}`}>
          {excluded ? 'excluded' : 'survives'}
        </div>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">{claim}</p>
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div>
          <div className="text-slate-500">committed</div>
          <div className="text-slate-300">{zero}</div>
        </div>
        <div>
          <div className="text-slate-500">yours</div>
          <div className="text-slate-100">{observed}</div>
          <div className="text-slate-500">{ci}</div>
        </div>
      </div>
    </div>
  );
}

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const { scored: s, err, checks: c, quality, drill } = res;
  const copy = VERDICT_COPY[s.verdict];
  const line = `switch cost with no warning ${s.short.costMs.toFixed(0)} ms, with ${CSI_LONG} ms of warning ${s.long.costMs.toFixed(0)} ms. all-the-time-you-need, wiz.jock.pl`;

  if (!quality.ok) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-6">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-rose-300">refused: {quality.reason}</div>
          <p className="text-sm leading-relaxed text-slate-300">{quality.detail}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            No numbers are shown, because a number produced by a session that failed its own checks
            is worse than no number. Nothing was recorded either way.
          </p>
        </div>
        <GoButton onGo={onAgain} label="run it properly" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">the verdict</div>
        <div className={`mb-3 text-xl font-bold leading-snug ${copy.tone}`}>{copy.head}</div>
        <p className="text-sm leading-relaxed text-slate-300">{copy.body}</p>
      </div>

      <div className="space-y-3">
        <RivalRow
          name="reload"
          claim="Given most of a second of warning you load the next task before the digit lands, so your switch cost on long warning blocks is zero."
          zero="0.0% of your repeat speed"
          observed={pctOf(s.residualFrac)}
          ci={range(s.residualFracCi[0], s.residualFracCi[1], 'pct')}
          excluded={s.residualExcluded}
        />
        <RivalRow
          name="carryover"
          claim="Nothing is loaded in advance. The old task fades with time since your last answer, which is held fixed, so warning changes nothing."
          zero="0.0 points of difference"
          observed={pctOf(s.preparedFrac)}
          ci={range(s.preparedFracCi[0], s.preparedFracCi[1], 'pct')}
          excluded={s.preparedExcluded}
        />
      </div>

      <Panel title="your numbers, in milliseconds">
        <Row label={`switch cost, ${CSI_SHORT} ms warning`} value={msSigned(s.short.costMs)} note={`switch ${s.short.sw.toFixed(0)} against task repeat ${s.short.rep.toFixed(0)}`} />
        <Row label={`switch cost, ${CSI_LONG} ms warning`} value={msSigned(s.long.costMs)} note={`switch ${s.long.sw.toFixed(0)} against task repeat ${s.long.rep.toFixed(0)}`} />
        <Row label="what the warning removed" value={msSigned(s.preparedMs)} note={range(s.preparedMsCi[0], s.preparedMsCi[1], 'ms')} />
        <Row label="what survived the warning" value={msSigned(s.residualMs)} note={range(s.residualMsCi[0], s.residualMsCi[1], 'ms')} />
        <Row
          label="share of the cost the warning removed"
          value={Number.isFinite(s.preparedShare) ? pctOf(s.preparedShare, 0) : 'n/a'}
          note="on the proportional scale, so a uniformly faster block cannot fake it"
        />
        <Row label="warning also sped up your repeat trials by" value={msSigned(s.repGainMs)} note={`${range(s.repGainMsCi[0], s.repGainMsCi[1], 'ms')}, which is why the headline is a proportion`} />
      </Panel>

      <Panel title="the baseline nobody uses, and what it costs them">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          Each question here has two names. That buys a trial type almost no popular account of task
          switching has: the word changed, the question did not. Measure your switch cost against a
          trial where the word also changed and cue reading cancels. Measure it the usual way,
          against a trial where the same word simply repeated, and you are paid for reading a
          repeated word and you call it switching.
        </p>
        <Row label="switch cost against a task repeat with a new word" value={msSigned((s.short.costMs + s.long.costMs) / 2)} note="the honest one, used above" />
        <Row label="switch cost against a plain word repeat" value={msSigned((s.short.naiveMs + s.long.naiveMs) / 2)} note="the one you get with one name per task" />
        <Row label="difference, which is the price of reading the same word twice" value={msSigned(s.cueMs)} note={range(s.cueMsCi[0], s.cueMsCi[1], 'ms')} />
      </Panel>

      <Panel title="second window: errors, in a currency the headline never touches">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          If the other task is still running it should sometimes take your finger, and it can only
          do that on the digits where the two questions disagree. Carryover predicts that
          disagreement hurts more on a switch. This window is underpowered and is reported anyway.
        </p>
        <Row label="errors on switch trials" value={pctOf(err.errSw)} />
        <Row label="errors on task repeat trials" value={pctOf(err.errRep)} />
        <Row label="switch cost in errors" value={pctOf(err.errCost)} note={`${(err.errCostCi[0] * 100).toFixed(1)} to ${(err.errCostCi[1] * 100).toFixed(1)}%`} />
        <Row label="disagreement cost on repeats" value={msSigned(err.congRep)} />
        <Row label="disagreement cost on switches" value={msSigned(err.congSw)} />
        <Row label="how much worse disagreement is on a switch" value={msSigned(err.congGap)} note={range(err.congGapCi[0], err.congGapCi[1], 'ms')} />
        <Row
          label="your wrong answers that were the other question's right answer"
          value={Number.isFinite(err.wrongTaskShare) ? pctOf(err.wrongTaskShare, 0) : 'n/a'}
          note={`${err.nErr} errors on disagreeing digits. A manipulation check, not a referee: it shows the other task reached your hand.`}
        />
      </Panel>

      <Panel title="what this session had to pass first">
        <Row label="key drills" value={`${pctOf(drill.accP, 0)} parity, ${pctOf(drill.accA, 0)} amount`} note="last attempt at each, eighty percent to pass" />
        <Row label="scored accuracy" value={pctOf(c.acc, 0)} note="chance is fifty here, not twenty five" />
        <Row label="accuracy on the disagreeing digits" value={`${pctOf(c.accParityInc, 0)} parity, ${pctOf(c.accAmountInc, 0)} amount`} note="a cue ignorer sits near zero on one of these" />
        <Row label="key split" value={pctOf(c.keyShare, 0)} note="the design asks for fifty" />
        <Row label="answers too fast to be readings" value={pctOf(c.fastShare, 1)} />
        <Row label="trials with the tab away" value={pctOf(c.hiddenShare, 1)} />
        <Row label="trials that ran out" value={pctOf(c.missShare, 1)} />
        <Row label="trials surviving into the analysis" value={`${c.nUsable} of ${c.nScored}`} note="errors, the trials after errors, and anything outside the window are dropped" />
        <Row label="response repetitions, switch against repeat cells" value={`${pctOf(c.repShareSw, 0)} against ${pctOf(c.repShareRep, 0)}`} note="held level by construction, because repeating a finger is faster" />
      </Panel>

      <Panel title="what the simulation said before this shipped">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          The analysis above was extracted from this page and run in Node against 200 simulated
          visitors in each of seven worlds with known truth. These are measured rates, not claims.
        </p>
        <Row label="world where both are true" value="reload excluded 93%, carryover excluded 57%" note="the full result 52% of the time, which is the honest cost of one person and one sitting" />
        <Row label="world where warning genuinely does nothing" value="called correctly 96%" note="credited the warning falsely 4%" />
        <Row label="world where warning removes all of it" value="called correctly 94%" note="invented a residue 1%" />
        <Row label="world with no switch cost at all" value="said so 97%" />
        <Row label="world where long blocks simply run 15% faster" value="called correctly 97%" note="raw milliseconds showed 36 ms of pure artifact there; the proportional headline showed none" />
        <Row label="world with a 2.5% speedup per block" value="reload excluded 88%, carryover excluded 49%" note="the block order cancels the drift, it cannot cancel the noise the drift adds" />
        <Row label="world where the whole cost is reading a repeated word" value="said no switch cost 97%" note="the naive comparison would have reported 104 ms" />
        <Row label="interval coverage" value="93% and 96% against a nominal 95%" />
        <Row label="refusal ladder" value="7 strategies, 60 of 60 refused each" note="machine, guesser, one key, hidden tab, early guesser, half learned mapping, cue ignorer. 180 honest visitors at three speeds: 0 refused" />
      </Panel>

      <Panel title="what this cannot tell you">
        <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            One person, one sitting. Every rate above is the rate at which a session like yours
            reaches the right answer, and the carryover exclusion misses nearly half the time when
            it is true.
          </li>
          <li>
            A long warning is an opportunity, not an instruction. If you spent it looking away, this
            page measures a visitor who did not prepare and cannot tell that apart from a mind that
            cannot.
          </li>
          <li>
            The residue has more than one reading. Rogers and Monsell called it the part of
            reconfiguration that needs the stimulus itself. Allport and colleagues called it
            interference that never was reconfiguration at all. This page separates preparation from
            decay, which is enough to reject both pure forms and not enough to name what is left.
          </li>
        </ul>
      </Panel>

      <Panel title="the line, if you want it">
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs leading-relaxed text-slate-300">{line}</div>
        <button
          type="button"
          onClick={() => { if (navigator.clipboard) navigator.clipboard.writeText(line); }}
          className="rounded border border-slate-700 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:bg-slate-800"
        >
          copy
        </button>
      </Panel>

      <GoButton onGo={onAgain} label="run it again" />

      <p className="pb-6 text-center text-xs leading-relaxed text-slate-600">
        Jersild, Archives of Psychology 89, 1927. Allport, Styles and Hsieh, Attention and
        Performance XV, 421, 1994. Rogers and Monsell, Journal of Experimental Psychology General
        124, 207, 1995. Meiran, Journal of Experimental Psychology LMC 22, 1423, 1996. Logan and
        Bundesen, Journal of Experimental Psychology LMC 29, 575, 2003. Mayr and Kliegl, same
        volume, 362. Monsell, Trends in Cognitive Sciences 7, 134, 2003.
      </p>
    </div>
  );
}
