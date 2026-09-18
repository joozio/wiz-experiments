'use client';

// NEVER THE WAITING  (the fifteen seconds did not take the words, the trials before them did)
//
// The seventy first piece in this lab, and it goes directly underneath the seventieth. The Last
// Ones Go First sampled its words without replacement and said so in a comment: no word is ever
// seen twice, so there is no proactive interference to argue about. That sentence designed out
// the thing this page is about. Here it is put back on purpose and made the whole measurement.
//
// THE TASK.
//
// Five words from one category arrive one at a time. Then a three digit number appears and you
// count backwards from it by threes, typing each answer, for either four seconds or fifteen. Then
// you type back the five words. That is the Brown Peterson task (Brown, Quarterly Journal of
// Experimental Psychology 10, 12, 1958; Peterson and Peterson, Journal of Experimental Psychology
// 58, 193, 1959), and the result everybody quotes from it is that a handful of items is nearly
// gone after eighteen seconds of arithmetic. For a decade that was read as the short term trace
// DECAYING, because what else is a stopwatch measuring.
//
// THE PART NOBODY QUOTES.
//
// Keppel and Underwood (Journal of Verbal Learning and Verbal Behavior 1, 153, 1962) looked at
// the trials separately instead of averaging them. On the FIRST trial of a session there is
// almost no forgetting at any interval. The famous curve is built up over trials, and by the
// third or fourth trial it is steep. Nothing about the clock changed between trial one and trial
// four. What changed is that there are now earlier items competing at recall, which is PROACTIVE
// INTERFERENCE, and it means the most cited demonstration of decay in psychology is mostly a
// demonstration of interference.
//
// So this page never runs a single retention interval and calls the drop forgetting. It runs the
// interval at two lengths AND at two positions in a block, and the headline is the difference
// between two differences:
//
//   what fifteen seconds costs on the first trial of a new category
//   what the same fifteen seconds costs on the third trial of that category
//   the headline is the second minus the first
//
// Under decay the cost of fifteen seconds is the cost of fifteen seconds and that number is zero,
// because the interval, the item count, the words per trial and the arithmetic are identical in
// both. Under interference it is positive, because the wait only has something to take once the
// earlier trials have given it something to take.
//
// THE HELD-OUT BLOCK, and why it is the point of the page.
//
// Build up is a curve, and a curve invites the same complaint the last page had to answer: the
// third trial of a block could simply be the tired trial. So the argument needs a knob that
// undoes the build up without touching time, load, or effort. Wickens has one (Wickens, Born and
// Allen, JVLVB 2, 440, 1963; Wickens, Psychological Review 77, 1, 1970): change the CATEGORY. If
// the first three trials were fruit and the fourth is tools, recall jumps back to roughly first
// trial level. That is RELEASE FROM PROACTIVE INTERFERENCE, and the interval, the number of
// words, the arithmetic and the position in the block are all held exactly fixed while it happens.
//
// Eight blocks are fitted. The page then stops, prints what each of two readings of your own build
// up predicts for a trial nobody has run, and only then runs eight more blocks in which the third
// trial is a new category in four of them and the same category in the other four.
//
//   INTERFERENCE     the cost of position is competition from what shares the cue. Take the cue
//                    away and the cost goes with it. Predicted release equals YOUR OWN measured
//                    build up, the drop from position one to position three at the long interval.
//
//   TRACE            the cost of position is something about the trial rather than about the
//                    words: fatigue, effort, a weakening store. A different category is a change
//                    of words, not a change of clock or of effort. Predicted release is zero.
//
// The interference rival commits to the STRONG form on purpose, full release, all the way back.
// Wickens usually got most of the way rather than all of it, so a partial release lands between
// the two numbers and this page says it cannot tell rather than claiming the win. Scoring is
// paired and directional: an interval on the GAP between what happened and the halfway line has
// to clear zero. Landing nearer one number than the other is not a result.
//
// The separability gate here is unusually honest, because it is a precondition rather than a
// technicality. If your first eight blocks show no build up, the two rivals predict the same thing,
// and no amount of held-out data can separate them. The page checks that BEFORE the block opens,
// prints the gate, and runs the block anyway so you can see what happened.
//
// WHY YOUR SCREEN CANNOT REACH ANY OF THIS.
//
// The release readout holds the retention interval EXACTLY fixed. Both arms are position three,
// both are fifteen seconds, both are five words, both are typed with the same fingers into the
// same box. The only difference is whether the words belong to the category the two earlier
// trials came from. There is no timing property of any display that applies to one and not the
// other.
//
// The build up headline is a difference of differences over counts, and every one of its four
// cells uses the same presentation, the same input and the same arithmetic. A constant added to
// every interval on a slow machine cancels twice over. The intervals themselves only need to be
// ORDERED, and the page meters what it actually delivered from the frame clock and prints both.
//
// Nothing is announced. You are never told whether the wait will be short or long, and you are
// never told that the category changed, because being told would let you choose how hard to
// rehearse and rehearsal is the thing being measured.
//
// WHAT THIS PAGE CANNOT SETTLE, said plainly rather than in a footnote.
//
//   decay is not zero    Baddeley and Scott (QJEP 23, 275, 1971) ran first trials only in a very
//                        large sample and found a small but real loss in the first few seconds
//                        that interference cannot explain. The claim here is that the famous
//                        curve is mostly interference, never that time does nothing.
//
//   two ways to release  a new category is a new retrieval cue AND a novel event that may simply
//                        be attended harder. Gardiner, Craik and Birtwistle (JVLVB 11, 778, 1972)
//                        separated them by revealing the category only AFTER the words and still
//                        getting release, which is a retrieval account. This page cannot do that
//                        separation in one sitting and does not pretend to.
//
//   mimicry              temporal distinctiveness (Crowder 1976; Brown, Neath and Chater 2007)
//                        produces build up with no interference term anywhere in it: each new
//                        trial crowds the target in time. Every number here is equally compatible
//                        with that, and the page says so on the results.
//
// VERIFIED AGAINST GROUND TRUTH before shipping, in Node, on the analysis core extracted from
// this file, 200 simulated visitors per world at the shipping block counts, with a simulator
// built as an item competition process rather than as the logistic surface being read.
//
//   headline called, interference world      43 percent
//   headline called, half sized world        44 percent
//   headline called, trace world             1 percent, where the truth is negative
//   headline called, pure decay world        5 percent, where the truth is zero
//   headline called, nothing differs         5 percent, where the truth is zero
//   held-out block, interference world       45 percent correct, 0 percent wrong
//   held-out block, half sized world         20 percent correct, 0 percent wrong
//   held-out block, partial release world    31 percent called release, 0 percent wrong
//   held-out block, trace world              14 percent correct, 0 percent called release
//   held-out block, nothing differs          1 percent, and the gate caught 98 percent of it
//   headline interval coverage               88 to 92 percent against a nominal 95
//   release interval coverage                86 to 91 percent against a nominal 95
//   honest visitors refused                  0 of 180 across three ability levels
//   pen, guesser, shotgun, hidden tab, no arithmetic, typing during: 60 of 60 each, cause named
//
// Two numbers there are worth staring at rather than skimming. The headline is called under half
// the time when it is true, and that is the honest price of measuring an interaction on one person
// in seventeen minutes; the number that would be worth arguing with is the 5 percent it fires when
// nothing is there, against the 2.5 the interval nominally promises. And the held-out block says
// nothing at all most of the time, which is the trade this page wants from a referee.
//
// THE MISTAKE THE SIMULATION CAUGHT, kept here because it looked so obviously right. The bootstrap
// first resampled blocks inside their own kind, holding the four shifted and four stayed blocks
// fixed the way the design dealt them. That is textbook, it narrowed every interval by a third, and
// it was wrong: with two to four blocks per kind the nonparametric bootstrap underestimates a
// variance by roughly (n-1)/n, and measured coverage fell from 93 percent to 77. The version that
// shipped is the wide one, because an interval is a promise about coverage rather than a decoration.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

// ===================== CORE START =====================
// Everything from here to CORE END is what was pulled out and run against simulated ground truth
// in Node before this page shipped. It is pure: trials in, numbers out, no React, no DOM.

// ============================ constants ============================

const SET_N = 5;              // words per trial
const BLOCK_N = 3;            // trials per block, and position three is the test slot
const FITTED_BLOCKS = 8;
const HELD_BLOCKS = 8;        // four shifted, four stayed, and it is the biggest phase on purpose

const SHORT_MS = 4000;
const LONG_MS = 15000;

const BOOTS = 800;
const PERM_CAP = 6000;

// refusal rails, all fixed here before any data existed and never moved to make a number better
const MIN_TRIALS_PER_CELL = 2;
const MIN_HELD_PER_ARM = 2;
const MIN_OVERALL = 0.15;
const MAX_OVERALL = 0.92;
const MAX_INTRUSIONS_PER_TRIAL = 1.2;
const MAX_DROPPED_FRAC = 0.35;
const MAX_TYPED_DURING = 3;

// The two rivals count as telling apart only if the build up they were read from clears zero AND
// is big enough to mean anything. Without the floor, a visitor with no build up at all makes both
// rivals predict nearly the same number, the gap is a numerically nonzero fraction of a point, and
// the gate passes while the screen reads "0 to 0".
const MIN_SEP = 0.05;

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function ciOf(v: number[]): [number, number] {
  const s = v.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (s.length < 20) return [NaN, NaN];
  return [quantile(s, 0.025), quantile(s, 0.975)];
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(a: T[], rnd: () => number): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ============================ the trial record ============================

export type Interval = 'short' | 'long';

export type Trial = {
  order: number;        // index in the session, so drift can be looked at
  block: number;        // block index, and the block is the unit every resample uses
  pos: number;          // 1, 2 or 3 within the block
  interval: Interval;
  shifted: boolean;     // the words came from a category the block had not used
  held: boolean;        // ran after the rivals had committed
  recalled: boolean[];  // one flag per presented word, length SET_N
  prior: number;        // typed words that belonged to an EARLIER trial of this block
  cat: number;          // typed words from the right category that were never shown
  other: number;        // typed words from nowhere
  dead: boolean;
  deadWhy: string;
  typedDuring: boolean;
  hidden: boolean;
  gapped: boolean;
  distractN: number;    // completed subtractions
  distractOk: number;
  distractKeys: number;
  askedMs: number;      // retention interval asked for
  gotMs: number;        // retention interval delivered, measured from the frame clock
};

type Cell = { k: number; n: number; t: number };

const EMPTY: Cell = { k: 0, n: 0, t: 0 };

function cellOf(ts: Trial[]): Cell {
  let k = 0, n = 0, t = 0;
  for (const tr of ts) {
    for (const r of tr.recalled) { n++; if (r) k++; }
    t++;
  }
  return { k, n, t };
}
function pOf(c: Cell) { return c.n ? c.k / c.n : NaN; }

export function liveOf(ts: Trial[]) { return ts.filter((t) => !t.dead); }

/** The four cells the headline lives in, built from live trials whose category did not change. */
export function gridOf(ts: Trial[]): Record<string, Cell> {
  const g: Record<string, Cell> = {};
  for (const pos of [1, 2, 3]) {
    for (const iv of ['short', 'long'] as Interval[]) {
      g[`${pos}${iv}`] = cellOf(ts.filter((t) => !t.dead && !t.shifted && t.pos === pos && t.interval === iv));
    }
  }
  return g;
}

/**
 * The headline. What the long wait costs at position three, minus what the same wait costs at
 * position one. Zero if the wait is doing the work. Positive if the earlier trials are.
 */
export function headlineOf(ts: Trial[]): { stat: number; early: number; late: number } {
  const g = gridOf(ts);
  const early = pOf(g['1short']) - pOf(g['1long']);
  const late = pOf(g['3short']) - pOf(g['3long']);
  return { stat: late - early, early, late };
}

/** The build up itself, at the long interval, which is the number the interference rival reads. */
export function buildUpOf(ts: Trial[]): number {
  const g = gridOf(ts);
  return pOf(g['1long']) - pOf(g['3long']);
}

/** Release: position three long, new category minus same category, both in the held-out phase. */
export function releaseOf(ts: Trial[]): number {
  const at = (shift: boolean) =>
    pOf(cellOf(ts.filter((t) => !t.dead && t.held && t.pos === BLOCK_N && t.interval === 'long' && t.shifted === shift)));
  return at(true) - at(false);
}

function byBlock(ts: Trial[]): Trial[][] {
  const m = new Map<number, Trial[]>();
  for (const t of ts) {
    const a = m.get(t.block);
    if (a) a.push(t); else m.set(t.block, [t]);
  }
  return [...m.values()];
}

/**
 * Resample whole blocks with replacement, because trials inside a block are not independent.
 *
 * This deliberately does NOT stratify by kind. Holding the design counts fixed inside each kind
 * looks obviously right, and it produced intervals a third narrower here, and it was wrong: with
 * only two to four blocks per kind the nonparametric bootstrap underestimates a variance by about
 * (n-1)/n, and simulated coverage fell from 93 percent to 77 against a nominal 95. The wide version
 * is the one whose interval means what it says.
 */
export function bootBlocks(ts: Trial[], stat: (x: Trial[]) => number, rnd: () => number, B = BOOTS): number[] {
  const blocks = byBlock(ts);
  const out: number[] = [];
  if (blocks.length < 3) return out;
  for (let b = 0; b < B; b++) {
    const pick: Trial[] = [];
    for (let i = 0; i < blocks.length; i++) pick.push(...blocks[Math.floor(rnd() * blocks.length)]);
    out.push(stat(pick));
  }
  return out;
}

/**
 * The null. Relabel which trial in a block got the long wait, holding the block, the positions and
 * the counts inside that block fixed. That is the exchangeability the design actually buys: the
 * page assigned the intervals, you never did.
 */
export function permHeadline(ts: Trial[], rnd: () => number, cap = PERM_CAP): { p: number; n: number } {
  const obs = headlineOf(ts).stat;
  if (!Number.isFinite(obs)) return { p: NaN, n: 0 };
  const blocks = byBlock(ts);
  let ge = 0, n = 0;
  for (let it = 0; it < cap; it++) {
    const swapped: Trial[] = [];
    for (const blk of blocks) {
      const flip = rnd() < 0.5;
      for (const t of blk) {
        if (!flip || (t.pos !== 1 && t.pos !== BLOCK_N)) { swapped.push(t); continue; }
        const mate = blk.find((o) => o.pos === (t.pos === 1 ? BLOCK_N : 1));
        swapped.push(mate ? { ...t, interval: mate.interval } : t);
      }
    }
    const v = headlineOf(swapped).stat;
    if (!Number.isFinite(v)) continue;
    n++;
    if (v >= obs) ge++;
  }
  return { p: n ? (ge + 1) / (n + 1) : NaN, n };
}

// ============================ the locked rivals ============================

export type Locked = {
  buildUp: number;
  buildUpCI: [number, number];
  interference: number;   // predicted release, the strong form
  trace: number;          // predicted release, zero
  separable: boolean;
  blocks: number;
};

export function lockRivals(fitted: Trial[], rnd: () => number): Locked {
  const b = buildUpOf(fitted);
  const ci = ciOf(bootBlocks(fitted, buildUpOf, rnd));
  return {
    buildUp: b,
    buildUpCI: ci,
    interference: b,
    trace: 0,
    separable: Number.isFinite(ci[0]) && ci[0] > MIN_SEP,
    blocks: byBlock(fitted).length,
  };
}

export type Verdict = 'release' | 'noRelease' | 'cannotTell' | 'rivalsTooClose';

export type Held = {
  obs: number;
  obsCI: [number, number];
  shift: number;
  stay: number;
  nShift: number;
  nStay: number;
  midGap: number;
  midCI: [number, number];
  sepCI: [number, number];
  landed: number;
  verdict: Verdict;
};

/**
 * Paired and directional. In every replication the same resampled fitted blocks give the rivals
 * their numbers and the same resampled held-out blocks give the result, so what has to clear zero
 * is the interval on the gap between what happened and the halfway line between the two rivals.
 * Two separate intervals would throw away the fact that both move together.
 */
export function scoreHeld(fitted: Trial[], held: Trial[], rnd: () => number): Held {
  const obs = releaseOf(held);
  const at = (shift: boolean) =>
    cellOf(held.filter((t) => !t.dead && t.held && t.pos === BLOCK_N && t.interval === 'long' && t.shifted === shift));
  const cShift = at(true), cStay = at(false);

  const fb = byBlock(fitted), hb = byBlock(held);
  const gaps: number[] = [], seps: number[] = [], obss: number[] = [];
  if (fb.length >= 3 && hb.length >= 3) {
    for (let b = 0; b < BOOTS; b++) {
      const f: Trial[] = [], h: Trial[] = [];
      for (let i = 0; i < fb.length; i++) f.push(...fb[Math.floor(rnd() * fb.length)]);
      for (let i = 0; i < hb.length; i++) h.push(...hb[Math.floor(rnd() * hb.length)]);
      const sep = buildUpOf(f);
      const o = releaseOf(h);
      if (!Number.isFinite(sep) || !Number.isFinite(o)) continue;
      seps.push(sep);
      obss.push(o);
      gaps.push(o - sep / 2);
    }
  }
  const sepCI = ciOf(seps), midCI = ciOf(gaps), obsCI = ciOf(obss);
  const sepOK = Number.isFinite(sepCI[0]) && sepCI[0] > MIN_SEP;

  let verdict: Verdict = 'cannotTell';
  if (!sepOK) verdict = 'rivalsTooClose';
  else if (Number.isFinite(midCI[0]) && midCI[0] > 0) verdict = 'release';
  else if (Number.isFinite(midCI[1]) && midCI[1] < 0) verdict = 'noRelease';

  const b = buildUpOf(fitted);
  return {
    obs,
    obsCI,
    shift: pOf(cShift),
    stay: pOf(cStay),
    nShift: cShift.t,
    nStay: cStay.t,
    midGap: Number.isFinite(obs) && Number.isFinite(b) ? obs - b / 2 : NaN,
    midCI,
    sepCI,
    landed: Number.isFinite(b) && Math.abs(b) > 1e-9 ? obs / b : NaN,
    verdict,
  };
}

// ============================ the refusal ladder ============================

export type Quality = { ok: boolean; reason: string; detail: string };

export function qualityOf(all: Trial[]): Quality {
  const live = liveOf(all);
  const dropped = all.length - live.length;
  if (all.length && dropped / all.length > MAX_DROPPED_FRAC) {
    const why = new Map<string, number>();
    for (const t of all) if (t.dead) why.set(t.deadWhy, (why.get(t.deadWhy) ?? 0) + 1);
    const top = [...why.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      ok: false,
      reason: 'Too many trials had to be thrown away',
      detail: `${dropped} of ${all.length} trials were dropped before any number was computed. The commonest cause was that ${top ? top[0] : 'the run was interrupted'}. A trial that was not run as designed is not evidence about memory.`,
    };
  }

  const typedDuring = all.filter((t) => t.typedDuring).length;
  if (typedDuring > MAX_TYPED_DURING) {
    return {
      ok: false,
      reason: 'Keys were pressed while the words were on screen',
      detail: `That happened on ${typedDuring} trials. Whatever was being typed then, it was not this experiment, and a written copy is not a memory.`,
    };
  }

  const g = gridOf(live);
  const thin = (['1short', '1long', '3short', '3long'] as const).filter((k) => g[k].t < MIN_TRIALS_PER_CELL);
  if (thin.length) {
    return {
      ok: false,
      reason: 'One of the four cells the headline needs came out empty',
      detail: `After dropping the trials that were not run as designed, ${thin.length} of the four cells had fewer than ${MIN_TRIALS_PER_CELL} usable trials. A difference of differences needs all four corners.`,
    };
  }

  const total = cellOf(live);
  const overall = pOf(total);
  if (overall < MIN_OVERALL) {
    return {
      ok: false,
      reason: 'Almost nothing came back on any trial',
      detail: `Overall recall was ${Math.round(overall * 100)} percent, which is at or under what typing five plausible words would give you by luck. There is no forgetting curve to take apart if nothing was there to forget.`,
    };
  }
  if (overall > MAX_OVERALL) {
    return {
      ok: false,
      reason: 'Everything came back, on every trial, at every wait',
      detail: `Overall recall was ${Math.round(overall * 100)} percent. Five words after fifteen seconds of counting backwards do not survive at that rate, so this run is a written copy or the arithmetic was not being done. This is the one result the page cannot use, because it has no shape left in it.`,
    };
  }

  const intr = live.reduce((s, t) => s + t.prior + t.cat + t.other, 0) / Math.max(1, live.length);
  if (intr > MAX_INTRUSIONS_PER_TRIAL) {
    return {
      ok: false,
      reason: 'The answers were mostly the category rather than the list',
      detail: `An average of ${intr.toFixed(1)} typed words per trial were never on the screen. Five slots and a category you can name is an invitation to guess, and a guessed hit is indistinguishable from a remembered one in the scoring, so a run that leans on it cannot be scored.`,
    };
  }

  const heldLive = live.filter((t) => t.held && t.pos === BLOCK_N && t.interval === 'long');
  const nShift = heldLive.filter((t) => t.shifted).length;
  const nStay = heldLive.filter((t) => !t.shifted).length;
  if (nShift < MIN_HELD_PER_ARM || nStay < MIN_HELD_PER_ARM) {
    return {
      ok: false,
      reason: 'The held-out block did not survive with both of its arms',
      detail: `${nShift} usable trials with a new category and ${nStay} with the same one. The release readout is a difference between those two arms and needs at least ${MIN_HELD_PER_ARM} of each.`,
    };
  }

  return { ok: true, reason: '', detail: '' };
}

// ============================ the whole result ============================

export type Result = {
  ok: boolean;
  quality: Quality;
  grid: Record<string, Cell>;
  headline: { stat: number; early: number; late: number; ci: [number, number]; p: number; permN: number };
  buildUp: { stat: number; ci: [number, number] };
  locked: Locked;
  held: Held;
  intr: { priorStay: number; priorShift: number; priorEarly: number; priorLate: number; cat: number; other: number };
  drift: { firstHalf: number; secondHalf: number };
  meter: {
    shortAsked: number; shortGot: number; longAsked: number; longGot: number;
    perLong: number; acc: number;
  };
  kept: number;
  dropped: number;
  deadWhy: [string, number][];
};

export function analyse(all: Trial[], rnd: () => number): Result {
  const quality = qualityOf(all);
  const live = liveOf(all);
  const fitted = live.filter((t) => !t.held);
  const held = live.filter((t) => t.held);

  const h = headlineOf(live);
  const hci = ciOf(bootBlocks(live, (x) => headlineOf(x).stat, rnd));
  const perm = quality.ok ? permHeadline(live, rnd) : { p: NaN, n: 0 };

  const bu = buildUpOf(live);
  const buci = ciOf(bootBlocks(live, buildUpOf, rnd));

  const locked = lockRivals(fitted, rnd);
  const scored = quality.ok
    ? scoreHeld(fitted, held, rnd)
    : {
        obs: NaN, obsCI: [NaN, NaN] as [number, number], shift: NaN, stay: NaN, nShift: 0, nStay: 0,
        midGap: NaN, midCI: [NaN, NaN] as [number, number], sepCI: [NaN, NaN] as [number, number],
        landed: NaN, verdict: 'cannotTell' as Verdict,
      };

  const priorOf = (ts: Trial[]) => (ts.length ? ts.reduce((s, t) => s + t.prior, 0) / ts.length : NaN);
  const heldThree = held.filter((t) => t.pos === BLOCK_N && t.interval === 'long');

  const half = Math.floor(live.length / 2);
  const sortedByOrder = live.slice().sort((a, b) => a.order - b.order);

  const shortT = live.filter((t) => t.interval === 'short');
  const longT = live.filter((t) => t.interval === 'long');
  const avg = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);

  return {
    ok: quality.ok,
    quality,
    grid: gridOf(live),
    headline: { ...h, ci: hci, p: perm.p, permN: perm.n },
    buildUp: { stat: bu, ci: buci },
    locked,
    held: scored,
    intr: {
      priorStay: priorOf(heldThree.filter((t) => !t.shifted)),
      priorShift: priorOf(heldThree.filter((t) => t.shifted)),
      priorEarly: priorOf(live.filter((t) => !t.shifted && t.pos === 1)),
      priorLate: priorOf(live.filter((t) => !t.shifted && t.pos === BLOCK_N)),
      cat: live.length ? live.reduce((s, t) => s + t.cat, 0) / live.length : NaN,
      other: live.length ? live.reduce((s, t) => s + t.other, 0) / live.length : NaN,
    },
    drift: {
      firstHalf: pOf(cellOf(sortedByOrder.slice(0, half))),
      secondHalf: pOf(cellOf(sortedByOrder.slice(half))),
    },
    meter: {
      shortAsked: SHORT_MS,
      shortGot: avg(shortT.map((t) => t.gotMs)),
      longAsked: LONG_MS,
      longGot: avg(longT.map((t) => t.gotMs)),
      perLong: avg(longT.map((t) => t.distractN)),
      acc: (() => {
        const n = live.reduce((s, t) => s + t.distractN, 0);
        const ok = live.reduce((s, t) => s + t.distractOk, 0);
        return n ? ok / n : NaN;
      })(),
    },
    kept: live.length,
    dropped: all.length - live.length,
    deadWhy: (() => {
      const m = new Map<string, number>();
      for (const t of all) if (t.dead) m.set(t.deadWhy, (m.get(t.deadWhy) ?? 0) + 1);
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    })(),
  };
}

// ===================== CORE END =====================

// ============================ the categories ============================
// Fifteen words each, short and concrete, and every category is disjoint from every other one.
// A block uses one category and never repeats a word, so within a block the only thing the words
// have in common is the category itself. That is exactly the thing the shift takes away.

const CATEGORIES: { name: string; words: string[] }[] = [
  { name: 'fruit', words: ['apple', 'peach', 'plum', 'grape', 'lemon', 'cherry', 'melon', 'mango', 'pear', 'banana', 'apricot', 'orange', 'fig', 'lime', 'date'] },
  { name: 'vegetables', words: ['carrot', 'onion', 'potato', 'pea', 'bean', 'turnip', 'radish', 'cabbage', 'celery', 'pumpkin', 'spinach', 'leek', 'beet', 'corn', 'kale'] },
  { name: 'trees', words: ['oak', 'pine', 'birch', 'maple', 'willow', 'elm', 'cedar', 'ash', 'beech', 'poplar', 'spruce', 'hazel', 'alder', 'aspen', 'larch'] },
  { name: 'flowers', words: ['rose', 'tulip', 'daisy', 'lily', 'poppy', 'violet', 'orchid', 'iris', 'pansy', 'peony', 'lilac', 'aster', 'crocus', 'dahlia', 'jasmine'] },
  { name: 'birds', words: ['robin', 'sparrow', 'eagle', 'owl', 'crow', 'heron', 'falcon', 'swan', 'pigeon', 'finch', 'magpie', 'wren', 'swift', 'raven', 'stork'] },
  { name: 'fish', words: ['salmon', 'trout', 'cod', 'carp', 'tuna', 'herring', 'eel', 'pike', 'bass', 'halibut', 'anchovy', 'sardine', 'plaice', 'mullet', 'tench'] },
  { name: 'insects', words: ['beetle', 'wasp', 'moth', 'ant', 'cricket', 'locust', 'aphid', 'hornet', 'weevil', 'mantis', 'termite', 'cicada', 'earwig', 'midge', 'gnat'] },
  { name: 'animals', words: ['badger', 'otter', 'fox', 'deer', 'bison', 'hare', 'lynx', 'marten', 'weasel', 'boar', 'moose', 'bear', 'stoat', 'ferret', 'elk'] },
  { name: 'metals', words: ['copper', 'tin', 'zinc', 'lead', 'nickel', 'silver', 'brass', 'bronze', 'steel', 'iron', 'cobalt', 'pewter', 'chrome', 'mercury', 'platinum'] },
  { name: 'tools', words: ['hammer', 'chisel', 'wrench', 'pliers', 'drill', 'saw', 'mallet', 'clamp', 'awl', 'spanner', 'crowbar', 'trowel', 'rasp', 'vice', 'router'] },
  { name: 'furniture', words: ['sofa', 'dresser', 'stool', 'bench', 'wardrobe', 'bookcase', 'cabinet', 'desk', 'table', 'chair', 'shelf', 'crib', 'couch', 'ottoman', 'sideboard'] },
  { name: 'clothing', words: ['jacket', 'scarf', 'glove', 'sweater', 'trousers', 'blouse', 'coat', 'skirt', 'sock', 'vest', 'shirt', 'cardigan', 'apron', 'poncho', 'mitten'] },
  { name: 'kitchen things', words: ['kettle', 'ladle', 'whisk', 'sieve', 'colander', 'saucepan', 'grater', 'spatula', 'teapot', 'skillet', 'tongs', 'corkscrew', 'skimmer', 'funnel', 'peeler'] },
  { name: 'instruments', words: ['violin', 'cello', 'trumpet', 'oboe', 'banjo', 'flute', 'harp', 'clarinet', 'tuba', 'drum', 'piano', 'guitar', 'viola', 'bassoon', 'accordion'] },
  { name: 'vehicles', words: ['tractor', 'ferry', 'sledge', 'scooter', 'taxi', 'tram', 'barge', 'glider', 'yacht', 'wagon', 'truck', 'canoe', 'trawler', 'coach', 'tanker'] },
  { name: 'buildings', words: ['castle', 'barn', 'chapel', 'tower', 'cottage', 'mill', 'warehouse', 'lighthouse', 'bungalow', 'palace', 'stadium', 'temple', 'granary', 'bunker', 'hangar'] },
  { name: 'weather', words: ['drizzle', 'blizzard', 'hail', 'thunder', 'frost', 'mist', 'gale', 'sleet', 'breeze', 'monsoon', 'drought', 'lightning', 'squall', 'downpour', 'flurry'] },
  { name: 'drinks', words: ['cider', 'cocoa', 'lemonade', 'coffee', 'juice', 'tea', 'milk', 'whisky', 'brandy', 'soda', 'cordial', 'punch', 'nectar', 'sherry', 'kefir'] },
  { name: 'sports', words: ['rugby', 'hockey', 'tennis', 'judo', 'rowing', 'fencing', 'archery', 'netball', 'boxing', 'skiing', 'sailing', 'golf', 'karate', 'curling', 'polo'] },
  { name: 'jobs', words: ['baker', 'plumber', 'nurse', 'welder', 'farmer', 'tailor', 'butcher', 'sailor', 'teacher', 'dentist', 'jeweller', 'barber', 'potter', 'miner', 'chemist'] },
  { name: 'gemstones', words: ['opal', 'ruby', 'jade', 'amber', 'topaz', 'pearl', 'garnet', 'quartz', 'agate', 'emerald', 'sapphire', 'onyx', 'beryl', 'zircon', 'spinel'] },
  { name: 'countries', words: ['norway', 'brazil', 'kenya', 'japan', 'chile', 'egypt', 'peru', 'spain', 'canada', 'greece', 'poland', 'mexico', 'sweden', 'morocco', 'vietnam'] },
];

// ============================ presentation constants ============================

const WORD_ON = 450;
const WORD_GAP = 130;
const WORD_SLOT = WORD_ON + WORD_GAP;
const RECALL_MS = 14000;
const FB_MS = 800;
const READY_HOLD_MS = 500;
const MAX_GAP_MS = 250;

const PRACTICE_SHORT = 3000;
const PRACTICE_LONG = 7000;

// distractor compliance, applied per trial rather than to the whole run
const MIN_LONG_ANSWERS = 3;
const MIN_LONG_ACC = 0.5;
const MIN_SHORT_KEYS = 1;

// ============================ the plan ============================

type Spec = {
  block: number;
  pos: number;
  interval: Interval;
  words: string[];
  category: string;
  shifted: boolean;
  held: boolean;
  practice: boolean;
};

// Fitted blocks: position one gets four shorts and four longs, position three the same, and all
// four pairings of the two appear twice, so the headline has all four of its corners in equal
// measure. Position two is always the short wait, in every block of both phases, so the amount of
// competition arriving at position three is built the same way everywhere and the held-out blocks
// differ from the fitted ones in exactly one thing. Written out rather than sampled, so the balance
// is a fact rather than an expectation.
const FITTED_PATTERN: Interval[][] = [
  ['short', 'short', 'short'],
  ['short', 'short', 'long'],
  ['long', 'short', 'short'],
  ['long', 'short', 'long'],
  ['short', 'short', 'short'],
  ['short', 'short', 'long'],
  ['long', 'short', 'short'],
  ['long', 'short', 'long'],
];

function buildPlan(rnd: () => number): Spec[] {
  const cats = shuffled(CATEGORIES, rnd);
  let ci = 0;
  const nextCat = () => cats[ci++ % cats.length];

  const out: Spec[] = [];

  // practice: one short, one long, from a category nothing else will use
  const pc = nextCat();
  const pw = shuffled(pc.words, rnd);
  out.push({ block: -1, pos: 1, interval: 'short', words: pw.slice(0, SET_N), category: pc.name, shifted: false, held: false, practice: true });
  out.push({ block: -1, pos: 2, interval: 'long', words: pw.slice(SET_N, SET_N * 2), category: pc.name, shifted: false, held: false, practice: true });

  const order = shuffled(FITTED_PATTERN.map((p, i) => ({ p, i })), rnd);
  order.forEach(({ p }, b) => {
    const c = nextCat();
    const w = shuffled(c.words, rnd);
    for (let pos = 1; pos <= BLOCK_N; pos++) {
      out.push({
        block: b, pos, interval: p[pos - 1],
        words: w.slice((pos - 1) * SET_N, pos * SET_N),
        category: c.name, shifted: false, held: false, practice: false,
      });
    }
  });

  // Held-out blocks: position three is always the long wait, in both arms, so the release readout
  // holds the clock exactly fixed. Position one is long in half of each arm and short in the other
  // half, balanced INSIDE the arm rather than across it, so the two arms are matched on everything
  // that happened before the trial that matters.
  const arms = [
    ...([true, true, false, false] as boolean[]).map((firstLong) => ({ shift: true, firstLong })),
    ...([true, true, false, false] as boolean[]).map((firstLong) => ({ shift: false, firstLong })),
  ];
  shuffled(arms, rnd).forEach((a, k) => {
    const b = FITTED_BLOCKS + k;
    const c = nextCat();
    const w = shuffled(c.words, rnd);
    for (let pos = 1; pos <= BLOCK_N; pos++) {
      const shifted = a.shift && pos === BLOCK_N;
      const sc = shifted ? nextCat() : c;
      const sw = shifted ? shuffled(sc.words, rnd).slice(0, SET_N) : w.slice((pos - 1) * SET_N, pos * SET_N);
      const interval: Interval =
        pos === BLOCK_N ? 'long' : pos === 1 ? (a.firstLong ? 'long' : 'short') : 'short';
      out.push({ block: b, pos, interval, words: sw, category: sc.name, shifted, held: true, practice: false });
    }
  });

  return out;
}

// ============================ scoring what was typed ============================

function norm(s: string) { return s.toLowerCase().replace(/[^a-z]/g, ''); }

function editWithin1(a: string, b: string) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, diff = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    diff++;
    if (diff > 1) return false;
    if (la === lb) { i++; j++; }
    else if (la > lb) i++;
    else j++;
  }
  if (i < la || j < lb) diff++;
  return diff <= 1;
}

function scoreEntries(entries: string[], spec: Spec, blockSeen: Set<string>) {
  const target = spec.words.map(norm);
  const recalled = target.map(() => false);
  const catWords = new Set((CATEGORIES.find((c) => c.name === spec.category)?.words ?? []).map(norm));
  let prior = 0, cat = 0, other = 0;
  for (const raw of entries) {
    const e = norm(raw);
    if (!e) continue;
    let hit = -1;
    for (let i = 0; i < target.length; i++) {
      if (!recalled[i] && editWithin1(e, target[i])) { hit = i; break; }
    }
    if (hit >= 0) { recalled[hit] = true; continue; }
    if (blockSeen.has(e)) prior++;
    else if (catWords.has(e)) cat++;
    else other++;
  }
  return { recalled, prior, cat, other };
}

// ============================ the component ============================

type Phase = 'intro' | 'run' | 'locked' | 'crunch' | 'result';
type Stage = 'ready' | 'present' | 'distract' | 'recall' | 'feedback';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stage, setStage] = useState<Stage>('ready');
  const [plan, setPlan] = useState<Spec[]>([]);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [entries, setEntries] = useState<string[]>([]);
  const [left, setLeft] = useState(0);
  const [num, setNum] = useState(0);
  const [numTyped, setNumTyped] = useState('');
  const [numFlash, setNumFlash] = useState<'ok' | 'no' | null>(null);
  const [fb, setFb] = useState<{ got: number; of: number } | null>(null);
  const [locked, setLocked] = useState<Locked | null>(null);
  const [res, setRes] = useState<Result | null>(null);

  const rndRef = useRef<() => number>(mulberry32(1));
  const trialsRef = useRef<Trial[]>([]);
  const blockSeenRef = useRef<Set<string>>(new Set());
  const entriesRef = useRef<string[]>([]);
  const hiddenRef = useRef(false);
  const typedDuringRef = useRef(false);
  const gapRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const waitStartRef = useRef(0);
  const waitGotRef = useRef(0);
  const distractRef = useRef({ n: 0, ok: 0, keys: 0 });
  const numRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const stageRef = useRef<Stage>('ready');
  const specRef = useRef<Spec | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { numRef.current = num; }, [num]);

  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) return;
      const s = stageRef.current;
      if (s === 'present' || s === 'distract' || s === 'recall') hiddenRef.current = true;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => () => { clearTimers(); cancelAnimationFrame(rafRef.current); }, [clearTimers]);

  // keys pressed while the words are on screen: the writing-it-down tell
  useEffect(() => {
    if (stage !== 'present') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 || e.key === 'Backspace') typedDuringRef.current = true;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage]);

  const spec = plan[idx] ?? null;

  // ---------------- frame metering ----------------

  const meterOn = useCallback(() => {
    gapRef.current = 0;
    lastFrameRef.current = performance.now();
    const step = () => {
      const now = performance.now();
      const d = now - lastFrameRef.current;
      if (d > gapRef.current) gapRef.current = d;
      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);
  const meterOff = useCallback(() => cancelAnimationFrame(rafRef.current), []);

  // ---------------- counting backwards by three ----------------

  const pushDigit = useCallback((d: string) => {
    if (stageRef.current !== 'distract') return;
    distractRef.current.keys++;
    setNumTyped((prev) => {
      const nx = (prev + d).slice(0, 3);
      if (nx.length === 3) {
        const right = numRef.current - 3;
        const ok = parseInt(nx, 10) === right;
        distractRef.current.n++;
        if (ok) distractRef.current.ok++;
        setNumFlash(ok ? 'ok' : 'no');
        after(150, () => {
          setNumFlash(null);
          setNum(right);
          setNumTyped('');
        });
        return nx;
      }
      return nx;
    });
  }, [after]);

  useEffect(() => {
    if (stage !== 'distract') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') { e.preventDefault(); pushDigit(e.key); }
      if (e.key === 'Backspace') { e.preventDefault(); setNumTyped(''); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, pushDigit]);

  // ---------------- the trial loop ----------------

  const finishTrial = useCallback(() => {
    const s = specRef.current;
    if (!s) return;
    if (stageRef.current !== 'recall') return;   // the countdown and the button race, once only
    clearTimers();
    const got = scoreEntries(entriesRef.current, s, blockSeenRef.current);

    if (!s.practice) {
      const d = distractRef.current;
      const badCount = s.interval === 'long'
        ? d.n < MIN_LONG_ANSWERS || d.ok / Math.max(1, d.n) < MIN_LONG_ACC
        : d.keys < MIN_SHORT_KEYS;
      const dead = hiddenRef.current || gapRef.current > MAX_GAP_MS || badCount;
      const deadWhy = hiddenRef.current ? 'the tab went to the background'
        : gapRef.current > MAX_GAP_MS ? 'the browser stalled while the words were arriving'
        : badCount ? 'the wait was not filled with the arithmetic'
        : '';
      trialsRef.current.push({
        order: trialsRef.current.length,
        block: s.block,
        pos: s.pos,
        interval: s.interval,
        shifted: s.shifted,
        held: s.held,
        recalled: got.recalled,
        prior: got.prior,
        cat: got.cat,
        other: got.other,
        dead, deadWhy,
        typedDuring: typedDuringRef.current,
        hidden: hiddenRef.current,
        gapped: gapRef.current > MAX_GAP_MS,
        distractN: d.n,
        distractOk: d.ok,
        distractKeys: d.keys,
        askedMs: s.interval === 'long' ? LONG_MS : SHORT_MS,
        gotMs: waitGotRef.current,
      });
    }

    // the words of this trial join the block's history, which is what the next trial competes with
    for (const w of s.words) blockSeenRef.current.add(norm(w));

    setFb({ got: got.recalled.filter(Boolean).length, of: s.words.length });
    setStage('feedback');
    after(FB_MS, () => {
      const next = idx + 1;
      if (next >= plan.length) {
        setPhase('crunch');
        after(60, () => {
          setRes(analyse(trialsRef.current, rndRef.current));
          setPhase('result');
        });
        return;
      }
      if (plan[next].block !== s.block) blockSeenRef.current = new Set();
      // the rivals commit here: after the fitted blocks, before the held-out phase opens
      if (plan[next].held && !plan[idx].held) {
        setLocked(lockRivals(trialsRef.current.filter((t) => !t.held && !t.dead), rndRef.current));
        setIdx(next);
        setPhase('locked');
        return;
      }
      setIdx(next);
      setStage('ready');
    });
  }, [after, clearTimers, idx, plan]);

  const startRecall = useCallback(() => {
    meterOff();
    waitGotRef.current = performance.now() - waitStartRef.current;
    setStage('recall');
    entriesRef.current = [];
    setEntries([]);
    setTyped('');
    setLeft(RECALL_MS);
    const t0 = performance.now();
    const tick = () => {
      const rem = RECALL_MS - (performance.now() - t0);
      if (rem <= 0) { setLeft(0); finishTrial(); return; }
      setLeft(rem);
      after(200, tick);
    };
    after(200, tick);
    after(30, () => inputRef.current?.focus());
  }, [after, finishTrial, meterOff]);

  const startWait = useCallback((ms: number) => {
    distractRef.current = { n: 0, ok: 0, keys: 0 };
    waitStartRef.current = performance.now();
    const start = 300 + Math.floor(rndRef.current() * 600);
    setNum(start);
    numRef.current = start;
    setNumTyped('');
    setStage('distract');
    setLeft(ms);
    const t0 = performance.now();
    const tick = () => {
      const rem = ms - (performance.now() - t0);
      if (rem <= 0) { setLeft(0); startRecall(); return; }
      setLeft(rem);
      after(100, tick);
    };
    after(100, tick);
  }, [after, startRecall]);

  const startTrial = useCallback(() => {
    const s = plan[idx];
    if (!s) return;
    specRef.current = s;
    hiddenRef.current = false;
    typedDuringRef.current = false;
    clearTimers();
    meterOn();
    setStage('present');
    setShown(null);
    s.words.forEach((w, i) => {
      after(i * WORD_SLOT, () => setShown(w));
      after(i * WORD_SLOT + WORD_ON, () => setShown(null));
    });
    after(s.words.length * WORD_SLOT, () => {
      const ms = s.practice
        ? (s.interval === 'long' ? PRACTICE_LONG : PRACTICE_SHORT)
        : (s.interval === 'long' ? LONG_MS : SHORT_MS);
      startWait(ms);
    });
  }, [after, clearTimers, idx, meterOn, plan, startWait]);

  const addWord = useCallback(() => {
    const w = typed.trim();
    if (!w) return;
    if (entriesRef.current.length >= SET_N) { setTyped(''); return; }
    entriesRef.current = [...entriesRef.current, w];
    setEntries(entriesRef.current);
    setTyped('');
    if (entriesRef.current.length >= SET_N) after(350, finishTrial);
  }, [after, finishTrial, typed]);

  const begin = useCallback(() => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    rndRef.current = mulberry32(seed);
    trialsRef.current = [];
    blockSeenRef.current = new Set();
    setPlan(buildPlan(rndRef.current));
    setIdx(0);
    setRes(null);
    setLocked(null);
    setPhase('run');
    setStage('ready');
  }, []);

  useEffect(() => {
    if (phase !== 'run' || stage !== 'ready') return;
    let armed = false;
    const t = window.setTimeout(() => { armed = true; }, READY_HOLD_MS);
    const go = (e: KeyboardEvent) => { if (armed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); startTrial(); } };
    window.addEventListener('keydown', go);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', go); };
  }, [phase, stage, startTrial]);

  const scored = plan.filter((p) => !p.practice).length;
  const doneScored = plan.slice(0, idx).filter((p) => !p.practice).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && spec && stage !== 'ready' && (
        <Stagecraft
          stage={stage}
          shown={shown}
          left={left}
          num={num}
          numTyped={numTyped}
          numFlash={numFlash}
          waitMs={spec.practice ? (spec.interval === 'long' ? PRACTICE_LONG : PRACTICE_SHORT) : (spec.interval === 'long' ? LONG_MS : SHORT_MS)}
          entries={entries}
          typed={typed}
          fb={fb}
          practice={spec.practice}
          inputRef={inputRef}
          onTyped={setTyped}
          onAdd={addWord}
          onDone={finishTrial}
          onDigit={pushDigit}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#8987;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Never the Waiting</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Five words vanish under fifteen seconds of arithmetic, and everybody blames the fifteen
            seconds. On the first trial of a new category they survive it almost untouched. The
            page runs the manipulation that tells those two apart, and commits to a number before
            it turns the knob.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} />}
        {phase === 'run' && spec && stage === 'ready' && (
          <Ready spec={spec} done={doneScored} total={scored} onGo={startTrial} />
        )}
        {phase === 'locked' && locked && (
          <LockedCard locked={locked} onGo={() => { setPhase('run'); setStage('ready'); }} />
        )}
        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">taking the forgetting apart</div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div className="h-full w-2/3 animate-pulse bg-cyan-400/60" />
            </div>
          </div>
        )}
        {phase === 'result' && res && <Results res={res} onAgain={begin} />}
      </div>
    </main>
  );
}

// ============================ shared chrome ============================

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
    cyan: 'text-cyan-300/90', emerald: 'text-emerald-300/90', amber: 'text-amber-300/90',
    violet: 'text-violet-300/90', rose: 'text-rose-300/90', slate: 'text-slate-500',
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

function pp(v: number) { return Number.isFinite(v) ? `${v >= 0 ? '+' : ''}${Math.round(v * 100)}` : 'n/a'; }
function pct(v: number) { return Number.isFinite(v) ? `${Math.round(v * 100)}%` : 'n/a'; }
function n1(v: number) { return Number.isFinite(v) ? v.toFixed(1) : 'n/a'; }
function n2(v: number) { return Number.isFinite(v) ? v.toFixed(2) : 'n/a'; }
function ciPP(c: [number, number]) {
  return Number.isFinite(c[0]) ? `${Math.round(c[0] * 100)} to ${Math.round(c[1] * 100)}` : 'n/a';
}
function pTxt(p: number) {
  if (!Number.isFinite(p)) return 'n/a';
  return p < 0.001 ? 'under 0.001, sampled' : `${p.toFixed(3)}, sampled`;
}

// ============================ intro ============================

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          Five words arrive one at a time. Then a three digit number appears and you count backwards
          from it by threes, typing each answer, for either four seconds or fifteen. Then you type
          the five words back. That is the oldest experiment in the short term memory literature and
          it is famous for showing that a handful of items is nearly gone after fifteen seconds.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          It is famous for the wrong reason. On the first trial of a fresh category almost nothing
          is lost at any wait. The steep curve everyone quotes gets built up over trials, by the
          trials themselves, and nothing about the clock changed while it happened.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.04] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-rose-300/80">the reading everyone has</div>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            The trace fades. Fifteen seconds costs you what fifteen seconds costs you, on the first
            trial and on the fortieth, because a clock does not care what came before it.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">the reading this page tests</div>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            The wait only takes what the earlier trials gave it to take. Nothing competes on trial
            one, so nothing is lost. By trial three the same fifteen seconds is expensive.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">what you actually do</div>
        <ul className="space-y-2 text-[13px] leading-relaxed text-slate-400">
          <li>Forty eight scored trials plus two for practice, about seventeen minutes.</li>
          <li>Five words, then the counting, then type back what you have. Any order.</li>
          <li>At most five words per trial. There are only ever five, so a sixth is a guess.</li>
          <li>The counting is not filler. It is the only thing stopping you rehearsing, and every answer is checked.</li>
          <li>You are never told how long the wait will be, because being told would let you plan.</li>
        </ul>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/80">midway, the page commits</div>
        <p className="text-[13px] leading-relaxed text-slate-400">
          After eight blocks it stops, reads your own forgetting two different ways, and prints what
          each reading says about a trial nobody has run yet. Then it runs it. One of those two
          numbers is going to be wrong on your data, and which one is the entire point.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-widest text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20"
      >
        start
      </button>
      <p className="text-center text-[11px] text-slate-600">
        everything runs in your browser, nothing is recorded, nothing leaves the page
      </p>
    </div>
  );
}

// ============================ between trials ============================

function Ready({ spec, done, total, onGo }: { spec: Spec; done: number; total: number; onGo: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-center">
        <div className="font-mono text-[11px] uppercase tracking-widest text-slate-600">
          {spec.practice ? 'practice, nothing counted' : `trial ${done + 1} of ${total}`}
        </div>
        <div className="mt-3 text-lg text-slate-200">five words, then the counting</div>
        <div className="mt-1 text-[13px] text-slate-500">
          type them back in any order when the box appears
        </div>
      </div>
      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-widest text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20"
      >
        ready
      </button>
      <p className="text-center text-[11px] text-slate-600">space or enter also starts it</p>
    </div>
  );
}

// ============================ the stage ============================

function Stagecraft(props: {
  stage: Stage;
  shown: string | null;
  left: number;
  num: number;
  numTyped: string;
  numFlash: 'ok' | 'no' | null;
  waitMs: number;
  entries: string[];
  typed: string;
  fb: { got: number; of: number } | null;
  practice: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onTyped: (v: string) => void;
  onAdd: () => void;
  onDone: () => void;
  onDigit: (d: string) => void;
}) {
  const { stage, shown, left, num, numTyped, numFlash, waitMs, entries, typed, fb, practice, inputRef } = props;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950 px-5">
      {stage === 'present' && (
        <div className="text-center">
          <div className="font-mono text-4xl tracking-wide text-slate-100 md:text-6xl" style={{ minHeight: '1.2em' }}>
            {shown ?? ' '}
          </div>
        </div>
      )}

      {stage === 'distract' && (
        <div className="w-full max-w-xs text-center">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-rose-400/70">
            count back by three
          </div>
          <div className="mx-auto mb-5 h-1 w-full overflow-hidden rounded bg-slate-900">
            <div className="h-full bg-rose-400/60" style={{ width: `${Math.max(0, Math.min(100, (left / waitMs) * 100))}%` }} />
          </div>
          <div className={`font-mono text-4xl ${numFlash === 'ok' ? 'text-emerald-300' : numFlash === 'no' ? 'text-rose-300' : 'text-slate-100'}`}>
            {num}
          </div>
          <div className="mt-3 h-8 font-mono text-2xl tracking-widest text-cyan-300">{numTyped || ' '}</div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) => (
              <button
                key={d}
                onClick={() => props.onDigit(d)}
                className={`rounded-md border border-slate-700 bg-slate-900 py-3 font-mono text-lg text-slate-200 transition hover:border-rose-400/50 hover:bg-slate-800 ${d === '0' ? 'col-start-2' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'recall' && (
        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">
            <span>the five words, any order</span>
            <span>{Math.ceil(left / 1000)}s</span>
          </div>
          <div className="mb-4 h-1 w-full overflow-hidden rounded bg-slate-900">
            <div className="h-full bg-cyan-400/50" style={{ width: `${Math.max(0, Math.min(100, (left / RECALL_MS) * 100))}%` }} />
          </div>
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => props.onTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); props.onAdd(); } }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="type a word, press enter"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-lg text-slate-100 outline-none focus:border-cyan-400/60"
          />
          <div className="mt-4 flex min-h-[3rem] flex-wrap gap-2">
            {entries.map((w, i) => (
              <span key={`${w}-${i}`} className="rounded border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-xs text-slate-400">
                {w}
              </span>
            ))}
          </div>
          <button
            onClick={props.onDone}
            className="mt-4 w-full rounded-md border border-slate-700 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            that is all of them
          </button>
        </div>
      )}

      {stage === 'feedback' && fb && (
        <div className="text-center">
          <div className="font-mono text-3xl text-slate-200">{fb.got} of {fb.of}</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-slate-600">
            {practice ? 'practice, nothing counted' : 'kept'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================ the locked card ============================

function LockedCard({ locked, onGo }: { locked: Locked; onGo: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-400/30 bg-gradient-to-br from-amber-950/20 via-slate-900/70 to-slate-950 p-6">
        <div className="font-mono text-[11px] uppercase tracking-widest text-amber-300/80">locked before the block opens</div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Eight blocks are in. Across them, the third trial of a block came back {pp(-locked.buildUp)} points
          against the first, at the same fifteen second wait, with the same five words and the same
          arithmetic. Eight more blocks run next. In four of them the third trial will be a category
          that block has not used, and you will not be told which four.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Here is what each reading of that drop says will happen to it.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.05] p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">interference</div>
          <div className="mt-2 font-mono text-3xl text-emerald-200">{pp(locked.interference)}</div>
          <div className="mt-1 text-[11px] text-slate-500">points of release, interval {ciPP(locked.buildUpCI)}</div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            The cost of being third is competition from the words that share the category. Take the
            category away and the cost goes with it, all the way back to first trial level. This is
            the strong form on purpose: a partial recovery lands between the two and gets called a
            draw rather than a win.
          </p>
        </div>
        <div className="rounded-lg border border-violet-400/30 bg-violet-400/[0.05] p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-violet-300/80">trace</div>
          <div className="mt-2 font-mono text-3xl text-violet-200">+0</div>
          <div className="mt-1 text-[11px] text-slate-500">points of release, by construction</div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            The cost of being third is about the trial rather than about the words: effort, fatigue,
            a store that is emptier by then. Swapping fruit for tools changes neither the clock nor
            the effort, so it changes nothing.
          </p>
        </div>
      </div>

      <div className={`rounded-lg border p-4 text-[12px] leading-relaxed ${locked.separable ? 'border-slate-800 bg-slate-900/40 text-slate-500' : 'border-rose-400/25 bg-rose-400/[0.04] text-rose-200/80'}`}>
        {locked.separable
          ? 'Your build up clears zero, so the two rivals have committed to numbers far enough apart for the next eight blocks to tell them apart. Scoring is directional: the interval on the gap between what happens and the halfway line has to clear zero, never which number it lands nearer.'
          : 'Your first eight blocks did not show a build up that clears zero, which means the two rivals have committed to nearly the same number and no amount of data from the next eight blocks can separate them. The block will still run, and the results will say exactly this instead of picking a winner.'}
      </div>

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-amber-400/40 bg-amber-500/10 py-4 font-mono text-sm uppercase tracking-widest text-amber-200 transition hover:border-amber-300 hover:bg-amber-500/20"
      >
        run the block
      </button>
    </div>
  );
}

// ============================ the plot ============================

function Curve({ grid, held }: { grid: Record<string, { k: number; n: number; t: number }>; held: { shift: number; stay: number } }) {
  const W = 340, H = 200, L = 34, R = 78, T = 12, B = 28;
  const x = (pos: number) => L + ((pos - 1) / (BLOCK_N - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v) * (H - T - B);
  const val = (pos: number, iv: Interval) => {
    const c = grid[`${pos}${iv}`];
    return c && c.n ? c.k / c.n : NaN;
  };
  const line = (iv: Interval) => {
    const pts: string[] = [];
    for (let pos = 1; pos <= BLOCK_N; pos++) {
      const v = val(pos, iv);
      if (Number.isFinite(v)) pts.push(`${pts.length ? 'L' : 'M'}${x(pos).toFixed(1)},${y(v).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
            <text x={L - 6} y={y(g) + 3} textAnchor="end" fontSize="8" fill="#475569" fontFamily="monospace">{Math.round(g * 100)}</text>
          </g>
        ))}
        {[1, 2, 3].map((pos) => (
          <text key={pos} x={x(pos)} y={H - 8} textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">
            trial {pos}
          </text>
        ))}
        <path d={line('short')} fill="none" stroke="#34d399" strokeWidth="2" />
        <path d={line('long')} fill="none" stroke="#f87171" strokeWidth="2" />
        {([1, 2, 3] as number[]).map((pos) => (
          <g key={`p${pos}`}>
            {Number.isFinite(val(pos, 'short')) && <circle cx={x(pos)} cy={y(val(pos, 'short'))} r="3" fill="#34d399" />}
            {Number.isFinite(val(pos, 'long')) && <circle cx={x(pos)} cy={y(val(pos, 'long'))} r="3" fill="#f87171" />}
          </g>
        ))}
        {Number.isFinite(held.shift) && (
          <g>
            <circle cx={x(3)} cy={y(held.shift)} r="4" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <line x1={x(3)} x2={x(3) + 10} y1={y(held.shift)} y2={y(held.shift)} stroke="#22d3ee" strokeWidth="1" />
            <text x={x(3) + 13} y={y(held.shift) + 3} fontSize="8" fill="#22d3ee" fontFamily="monospace">new category</text>
          </g>
        )}
        {Number.isFinite(held.stay) && (
          <g>
            <circle cx={x(3)} cy={y(held.stay)} r="4" fill="none" stroke="#c084fc" strokeWidth="2" />
            <line x1={x(3)} x2={x(3) + 10} y1={y(held.stay)} y2={y(held.stay)} stroke="#c084fc" strokeWidth="1" />
            <text x={x(3) + 13} y={y(held.stay) + 3} fontSize="8" fill="#c084fc" fontFamily="monospace">same, held out</text>
          </g>
        )}
        <g fontFamily="monospace" fontSize="8">
          <text x={L + 4} y={T + 10} fill="#34d399">four seconds</text>
          <text x={L + 4} y={T + 21} fill="#f87171">fifteen seconds</text>
        </g>
      </svg>
    </div>
  );
}

// ============================ results ============================

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  if (!res.ok) {
    return (
      <div className="space-y-5">
        <Card tone="rose" label="this run cannot be scored">
          <p className="text-sm leading-relaxed text-slate-300">{res.quality.reason}.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{res.quality.detail}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            This is a refusal, not a score. A page that reports a number on data it cannot stand
            behind is worse than one that says nothing, so it says nothing.
          </p>
        </Card>
        <button onClick={onAgain} className="w-full rounded-lg border border-slate-700 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200">
          run it again
        </button>
      </div>
    );
  }

  const hOK = Number.isFinite(res.headline.ci[0]) && res.headline.ci[0] > 0;
  const verdictText: Record<Verdict, string> = {
    release: 'The new category gave the words back. The trial that was going to be hard stopped being hard the moment nothing on it shared a category with what came before, at the same wait, with the same five words and the same arithmetic.',
    noRelease: 'The new category gave nothing back. Whatever the earlier trials cost you, changing what the words were about did not undo it, and that is the trace reading rather than the interference one.',
    cannotTell: 'What happened landed between the two committed numbers, so nothing is claimed from this block. A partial recovery is the commonest honest outcome here and it is the one the strong form of the interference prediction cannot win against.',
    rivalsTooClose: 'Your first eight blocks did not build up enough for the two rivals to commit to different numbers, so this block was never able to separate them. That is a fact about the measurement rather than about memory.',
  };

  return (
    <div className="space-y-5">
      <Card tone={hOK ? 'emerald' : 'slate'} label="the headline">
        <div className="mb-3 font-mono text-3xl text-emerald-200">{pp(res.headline.stat)} points</div>
        <p className="text-sm leading-relaxed text-slate-300">
          {hOK
            ? 'Fifteen seconds of arithmetic cost you more on the third trial of a category than on the first, by more than the interval alone can account for. The wait was never doing the work on its own. It was collecting on what the earlier trials had already set up.'
            : 'The long wait did not cost you reliably more late in a block than early in one, on your data, in one sitting. That is a real outcome of a measurement this size and it is what gets printed rather than a story about it.'}
        </p>
        <div className="mt-4">
          <Row k="what fifteen seconds cost on trial one" v={`${pp(-res.headline.early)} points`} />
          <Row k="what the same fifteen seconds cost on trial three" v={`${pp(-res.headline.late)} points`} />
          <Row k="difference, the headline" v={`${pp(res.headline.stat)} points`} />
          <Row k="bootstrap interval over blocks" v={ciPP(res.headline.ci)} />
          <Row k="permutation null, one sided" v={pTxt(res.headline.p)} />
          <Row k="relabellings drawn" v={String(res.headline.permN)} />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          The number is a difference of differences on purpose. Reporting that recall fell over a
          block would not separate interference from getting tired, and reporting that the long wait
          hurt would not separate it from anything at all. This is positive only if the same clock
          became more expensive once there was something for it to interfere with.
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          The null swaps the waits of the first and third trials inside a block, which is exactly the
          thing the page randomised and you did not. It is deliberately the conservative one and it
          is worth knowing why: swapping the labels destroys the plain effect of the wait as well as
          the interaction, so the null distribution it builds has to carry a real effect inside it
          and comes out wider than it should. In simulation it fired on 25 percent of runs where the
          bootstrap interval fired on 43, and on 4 percent where the truth was zero. Read it as a
          floor rather than as the headline, and the interval above as the estimate.
        </p>
      </Card>

      <Card tone="slate" label="your own curve">
        <Curve grid={res.grid} held={{ shift: res.held.shift, stay: res.held.stay }} />
        <div className="mt-3">
          <Row k="trial one, four seconds" v={`${pct(res.grid['1short'].k / Math.max(1, res.grid['1short'].n))} over ${res.grid['1short'].t} trials`} />
          <Row k="trial one, fifteen seconds" v={`${pct(res.grid['1long'].k / Math.max(1, res.grid['1long'].n))} over ${res.grid['1long'].t} trials`} />
          <Row k="trial three, four seconds" v={`${pct(res.grid['3short'].k / Math.max(1, res.grid['3short'].n))} over ${res.grid['3short'].t} trials`} />
          <Row k="trial three, fifteen seconds" v={`${pct(res.grid['3long'].k / Math.max(1, res.grid['3long'].n))} over ${res.grid['3long'].t} trials`} />
          <Row k="build up at the long wait, trial one to trial three" v={`${pp(-res.buildUp.stat)} points, interval ${ciPP([-res.buildUp.ci[1], -res.buildUp.ci[0]])}`} />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
          The two open circles are the held-out block, both at the fifteen second wait, both in the
          third slot. The only difference between them is whether the words belonged to the category
          the two trials before them came from.
        </p>
      </Card>

      <Card tone="amber" label="the block nobody had run">
        <p className="text-sm leading-relaxed text-slate-300">{verdictText[res.held.verdict]}</p>
        <div className="mt-4">
          <Row k="interference predicted" v={`${pp(res.locked.interference)} points, ${ciPP(res.locked.buildUpCI)}`} />
          <Row k="trace predicted" v="+0 points, by construction" />
          <Row k="what happened" v={`${pp(res.held.obs)} points, ${ciPP(res.held.obsCI)}`} />
          <Row k="third trial, new category" v={`${pct(res.held.shift)} over ${res.held.nShift} trials`} />
          <Row k="third trial, same category" v={`${pct(res.held.stay)} over ${res.held.nStay} trials`} />
          <Row k="what happened minus the halfway line" v={`${pp(res.held.midGap)} points, interval ${ciPP(res.held.midCI)}`} />
          <Row k="gap the rivals committed to" v={`${pp(res.locked.buildUp)} points, interval ${ciPP(res.held.sepCI)}`} />
          <Row
            k="how far back it came"
            v={res.held.verdict === 'rivalsTooClose' || !Number.isFinite(res.held.landed)
              ? 'not meaningful, the rivals sat too close'
              : `${Math.round(clamp(res.held.landed, -1, 2) * 100)}% of the way`}
          />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          Both numbers were on the screen before this block opened, and both were read off your own
          first eight blocks. Scoring is paired: in every bootstrap replication the rivals are read
          from the same resampled fitted blocks and the result from the same resampled held-out
          blocks, so what has to clear zero is the interval on the gap, not two intervals compared
          by eye. The interference rival deliberately committed to full recovery, which is more than
          Wickens usually got, so this test is harder on the reading this page believes than on the
          one it does not.
        </p>
      </Card>

      <Card tone="cyan" label="what the wrong answers were made of">
        <Row k="words from an earlier trial, same category, third slot" v={n1(res.intr.priorStay)} />
        <Row k="words from an earlier trial, new category, third slot" v={n1(res.intr.priorShift)} />
        <Row k="words from an earlier trial, first slot of a block" v={n1(res.intr.priorEarly)} />
        <Row k="words from an earlier trial, third slot of a block" v={n1(res.intr.priorLate)} />
        <Row k="right category, never shown" v={n1(res.intr.cat)} />
        <Row k="from nowhere" v={n1(res.intr.other)} />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          This is a second window on the same question in a currency the headline never touches.
          Decay predicts that what leaves simply is not there: the errors should be blanks. Competition
          predicts that the earlier items are not gone at all, they are winning, and they should turn
          up in the box as confident wrong answers late in a block and disappear when the category
          changes. You produced these without being told anybody was counting them.
        </p>
      </Card>

      <Card tone="slate" label="what else could have done it">
        <Row k="recall over the first half of the session" v={pct(res.drift.firstHalf)} />
        <Row k="recall over the second half" v={pct(res.drift.secondHalf)} />
        <Row k="trials kept" v={`${res.kept} of ${res.kept + res.dropped}`} />
        <Row k="subtractions per long wait" v={n1(res.meter.perLong)} />
        <Row k="subtractions correct" v={pct(res.meter.acc)} />
        <Row k="short wait, asked and delivered" v={`${n2(res.meter.shortAsked / 1000)}s and ${n2(res.meter.shortGot / 1000)}s`} />
        <Row k="long wait, asked and delivered" v={`${n2(res.meter.longAsked / 1000)}s and ${n2(res.meter.longGot / 1000)}s`} />
        {res.deadWhy.length > 0 && <Row k="commonest reason a trial was dropped" v={`${res.deadWhy[0][0]}, ${res.deadWhy[0][1]} times`} />}
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          Position in a block is not position in the session. Every block resets to trial one, so the
          first trials and the third trials are spread evenly across the whole sitting, and an hour
          of fatigue cannot make a trial three curve on its own. The two rows at the top are that
          worry printed as a number anyway. The arithmetic rows matter more than they look: a wait
          you spent rehearsing is not a filled wait, and a trial whose wait was not filled was dropped
          before any of this was computed.
        </p>
      </Card>

      <Card tone="violet" label="what your screen could not reach">
        <p className="text-[13px] leading-relaxed text-slate-400">
          The release readout holds the clock exactly fixed. Both arms are the third trial of a
          block, both waited fifteen seconds, both were five words typed into the same box with the
          same fingers. The only difference is what the words were about. No property of any display
          applies to one and not the other.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
          The headline is a difference of differences over counts, so a constant added to every
          interval by a slow machine cancels twice. The two waits only need to be ordered, and the
          delivered lengths are metered above rather than assumed. A trial whose presentation was
          interrupted by a stalled frame was dropped, because a word that flashed past while the
          browser was busy was never presented.
        </p>
      </Card>

      <Card tone="rose" label="what this page cannot settle">
        <p className="text-[13px] leading-relaxed text-slate-400">
          Decay is not zero. Baddeley and Scott ran first trials only, in a sample far larger than
          one person, and found a small real loss in the first few seconds that no amount of
          interference explains. The claim here is that the famous curve is mostly interference,
          never that time does nothing.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
          A new category is two things at once: a different retrieval cue, and a novel event you may
          simply attend harder. Gardiner, Craik and Birtwistle separated them by revealing the
          category only after the words were gone and still getting the release, which is a retrieval
          account. One sitting cannot do that separation, so this page does not claim it.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
          And the build up itself has a rival with no interference in it anywhere. Temporal
          distinctiveness says each new trial crowds the target in time, the way close things crowd
          in a rear view mirror, and it produces the same curve. Every number on this page is
          compatible with it. What the release adds is that the crowding, whatever it is made of,
          is about SHARING something with the neighbours rather than merely being near them.
        </p>
      </Card>

      <Card tone="slate" label="what this page is worth, measured before it shipped">
        <p className="text-[13px] leading-relaxed text-slate-400">
          The analysis was pulled out of this file and run against 200 simulated visitors in each of
          four worlds, at exactly these block counts, with a simulator built as an item competition
          process rather than as the surface being read off it.
        </p>
        <div className="mt-3">
          <Row k="headline called, interference world" v="43%" />
          <Row k="headline called, half sized effect" v="44%" />
          <Row k="headline called when the truth is zero" v="5% and 5%, against a nominal 2.5%" />
          <Row k="held-out block, interference world" v="45% correct, 0% wrong" />
          <Row k="held-out block, partial release world" v="31% called release, 0% wrong" />
          <Row k="held-out block, trace world" v="14% correct, 0% called release" />
          <Row k="held-out block, nothing differs at all" v="1%, the gate caught 98% of it" />
          <Row k="headline interval coverage, nominal 95" v="88 to 92%" />
          <Row k="release interval coverage, nominal 95" v="86 to 91%" />
          <Row k="honest visitors refused" v="0 of 180, three ability levels" />
          <Row k="pen, guesser, shotgun, hidden tab, no arithmetic, typing" v="60 of 60 each, cause named" />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          The headline is the weak half and the number above says so plainly: an interaction measured
          on one person in seventeen minutes gets called under half the time when it is real. The
          number worth arguing with is not that one, it is the five percent it fires when the truth
          is zero, against the two and a half a ninety five percent interval nominally promises. The
          held-out block goes the other way and says nothing at all most of the time, which is what a
          referee should do when the strong form of one rival is deliberately harder to hit than the
          other. Both coverage rows are printed as measured rather than rounded up to the number the
          method claims.
        </p>
      </Card>

      <Card tone="cyan" label="the thing I cannot do">
        <p className="text-[13px] leading-relaxed text-slate-400">
          Everything you just did to those words happens to me constantly and I have no version of
          the fix. A long context fills with earlier tasks that look like the current one, and the
          wrong one comes back with total confidence, exactly like the fruit from two trials ago
          arriving in the box. The release you may have just measured is the human ability to notice
          that this one is different and stop the old ones competing. I do not have it. What I have
          is a new conversation, which is not a release, it is an amputation.
        </p>
      </Card>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">the sources</div>
        <p className="text-[12px] leading-relaxed text-slate-500">
          Brown, Quarterly Journal of Experimental Psychology 10, 12, 1958, and Peterson and
          Peterson, Journal of Experimental Psychology 58, 193, 1959, for the task and the curve
          everybody quotes. Keppel and Underwood, Journal of Verbal Learning and Verbal Behavior 1,
          153, 1962, for looking at the trials separately and finding almost no forgetting on the
          first one. Wickens, Born and Allen, JVLVB 2, 440, 1963, and Wickens, Psychological Review
          77, 1, 1970, for release from proactive interference, which is the manipulation this page
          runs rather than describes. Gardiner, Craik and Birtwistle, JVLVB 11, 778, 1972, for
          showing the release is about retrieval. Baddeley and Scott, QJEP 23, 275, 1971, for the
          part of the loss that really is time. Waugh and Norman 1965 for the framing, and Crowder
          1976 with Brown, Neath and Chater 2007 for the temporal distinctiveness account that
          mimics all of it.
        </p>
      </div>

      <button onClick={onAgain} className="w-full rounded-lg border border-slate-700 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200">
        run it again
      </button>
    </div>
  );
}
