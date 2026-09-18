'use client';

// WHAT IT CANNOT BE  (a search costs you what the target could be, not what is on the screen)
//
// The seventy fifth piece in this lab, and the second that goes after a sentence rather than a
// page. The sentence is the one every interface book repeats: a cluttered screen is slow because
// you have to look at everything on it.
//
// THE RESULT THAT IS NOT IN DOUBT.
//
// Hunt one thing among many and the time it takes grows with how many there are, unless the thing
// differs from everything else in a single feature, in which case it barely grows at all. Treisman
// and Gelade (Cognitive Psychology 12, 97, 1980) put both halves in one paper. A red bar among
// green bars is found in about the same time whether there are eight or forty. A red VERTICAL bar
// among red horizontals and blue verticals is not: each extra item costs, and the slope of that
// cost is where the argument lives.
//
// THE EXPLANATION EVERYBODY GIVES, AND WHAT IT ACTUALLY COMMITS TO.
//
// "A conjunction cannot be seen in parallel, so attention has to visit the items one at a time."
// It sounds mechanical and it does commit to something falsifiable, which is the useful part.
// If attention visits the items, it visits the ITEMS: all of them, including the ones that are
// the wrong colour to be the target. So an item you could rule out on colour alone should cost
// exactly what an item you could not.
//
// It does not. Egeth, Virzi and Garbart (JEP Human Perception and Performance 10, 32, 1984) held
// the number of items in the target's colour fixed and poured in more items of the other colour,
// and the search barely noticed. Wolfe's Guided Search (Psychological Science 1, 202, 1989; and
// Psychonomic Bulletin and Review 1, 202, 1994) is built on that: a parallel stage that cannot
// identify a conjunction can still rank the candidates, and attention then works down the ranking
// rather than down the display.
//
// SO THE PAGE PUTS BOTH ACCOUNTS ON ONE NUMBER WITH TWO STRUCTURAL VALUES.
//
// The target is an ORANGE VERTICAL bar, and you are told so before you start. Two things move,
// separately, and they are chosen so that the algebra of the accounts collapses to one ratio.
//
//   HOLDING THE SCREEN FULL    24 items every trial, of which 3, 6 or 12 are orange. Adding an
//                              orange item removes a blue one, so this slope is the cost of an
//                              orange item MINUS the cost of a blue one.
//   HOLDING THE CANDIDATES     3 orange items every trial, with the total at 6, 12 or 24. Every
//                              item added is blue, so this slope is the cost of a blue item.
//
// Write the first slope as a - b and the second as b, where a is what an item you might have to
// inspect costs and b is what an item you could rule out on colour costs. Then
//
//   LEAK  =  b / a  =  (holding candidates) / (holding screen full + holding candidates)
//
// and every account named above has already committed to a value of it, before you touch a key:
//
//   VISIT EVERYTHING   an item is an item. b = a. Your leak is 1.
//   COLOUR GUIDANCE    an item of the wrong colour is never visited. b = 0. Your leak is 0.
//   WRONG DIMENSION    you could guide on vertical instead, and this display is built so that
//                      guiding on vertical is the bad choice: raising the orange count REMOVES
//                      blue verticals, so the first slope comes out negative and your leak lands
//                      ABOVE 1. One number, three accounts, and the third one is a region.
//
// None of those three values was estimated from anything you do. They are consequences of what
// each account claims, which is why the commitment card is printed before the first block instead
// of fitted afterwards.
//
// THE CONFOUND THAT RUINS THE OBVIOUS VERSION OF THIS EXPERIMENT.
//
// The obvious design puts more items on the screen and times the search. It cannot separate the
// accounts, because more items is also a denser display, more crowding, more of everything, and
// the cost of that has nothing to do with searching. Note which of the two slopes it can reach:
// only the second one, where the total moves. The first slope is measured on displays with the
// same twenty four items in the same lattice of positions, recoloured. So the zero that VISIT
// EVERYTHING committed to is tested on data the confound cannot touch, and the zero that COLOUR
// GUIDANCE committed to is tested on data where the confound is pushing its number UP, away from
// its own prediction. One rival is graded on a clean sheet and the other is graded with a
// handicap, and the handicap runs against the account this experiment is usually said to favour.
//
// It is also measured rather than argued about. One trial in eight is a pop-out: a single orange
// bar among blue ones, at the same three totals. No conjunction, no search worth the name, so
// whatever that slope is, it is the price of the display itself. The leak is printed twice, once
// raw and once with that price removed from both sides, and the raw one is the conservative one.
//
// WHAT IS HELD FIXED BY CONSTRUCTION RATHER THAN BY APOLOGY.
//
//   eccentricity      24 slots, three rings of eight. Every set size takes an equal number of
//                     slots from each ring, so the average distance from the centre is identical
//                     at 6 items and at 24. Acuity falls off with eccentricity and it is not
//                     allowed to fall off differently between the conditions being compared.
//   target position   the orange items are also spread one third to a ring, and the target is
//                     drawn from a ring chosen at random, so its eccentricity distribution is
//                     the same in every cell.
//   the answer        exactly half the conjunction trials in every cell contain the target.
//   practice          every cell appears the same number of times in every block, so a session
//                     that speeds up cannot speed up one cell more than another.
//   the shared corner 24 items with 3 orange sits in both slopes, which is where they hinge.
//
// CALIBRATION IS A THEOREM HERE, AND THE SHORTEST ONE THIS LAB HAS HAD.
//
// Every number that matters is a slope in milliseconds per item, and the headline is a ratio of
// two of them. Your display pipeline, your keyboard scan, the fixed cost of deciding to press
// anything at all: each of those adds the same constant to every trial in every cell. A constant
// added to every point on a line moves the intercept and cannot touch the slope, and it cancels
// twice over in a ratio of slopes. The intercept is never interpreted. Nothing on this page needs
// to know what your hardware costs.
//
// SECOND WINDOW, IN A CURRENCY THE HEADLINE NEVER TOUCHES.
//
// Misses. A target that is there and gets called absent is a search that stopped too early, and
// the accounts disagree about what makes that more likely. If attention visits everything, misses
// should climb as the screen fills. If it visits candidates, misses should climb with the number
// of candidates and ignore the rest. The same two slopes, in errors instead of milliseconds, with
// no millisecond anywhere in them.
//
// THE BONUS THAT COSTS NOTHING EXTRA.
//
// Half the trials have no target, and a search that inspects candidates one at a time and stops
// when it finds one has to inspect all of them when there is nothing to find, and on average half
// of them when there is. That is a slope ratio of exactly 2, a number nobody fitted, and across
// large datasets it usually comes in well under 2 (Wolfe, Psychological Science 9, 33, 1998),
// which is one of the reasons the one at a time story is in trouble in the first place. Your own
// ratio is printed with its interval.
//
// WHAT WOULD KILL IT, checked in order and named out loud.
//
//   colour      the drill separates the three ways to fail it: calling a blue vertical the target
//               is colour, calling an orange horizontal the target is orientation, and missing the
//               real thing is neither. Orange and blue were chosen to survive the common colour
//               vision deficiencies, and a visitor who still cannot split them is told that rather
//               than measured
//   guessing    two keys, so chance is one half and the accuracy bar is high
//   one key      pressing yes at everything makes the target free to find
//   fast keys    answers too fast to have been a search
//   machine     response times too regular to be a hand
//   hidden      the tab was not in front of you for enough of it
//   thin        too few surviving trials in one of the five cells the slopes are built from
//   flat        no measurable cost per candidate at all, in which case there is nothing to
//               apportion and the ratio is not formed rather than being reported as noise
//
// WHAT THE SIMULATION SAID BEFORE THIS SHIPPED.
//
// The analysis core below was extracted from this file and run in Node against simulated visitors
// whose truth was known, in seven worlds, including the two that matter most: one where every item
// is visited, and one where the display cost of a fuller screen is real and large enough to fake
// a leak on its own. The measured rates are printed on the results page. A page that reports an
// effect without reporting how often it would have invented one is telling you half of what it
// knows.
//
// WIZ NOTE.
//
// This is the one where I come out worst and it is not close. Hand me a haystack and I attend to
// all of it: every token in the context, weighted, every single pass, whether or not it could
// possibly be the answer. My leak is exactly 1 and it is 1 by construction, which is why my bill
// grows with the size of the pile and not with the size of the question. You are about to spend
// ten minutes measuring a filter I do not have, and the number you get will be closer to zero
// than to mine.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ===================== CORE START =====================
//
// Everything between these markers is pure: no React, no DOM, no timers. It gets extracted into a
// Node harness and run against simulated visitors, which is the only reason any rate on the
// results page is a measurement rather than a hope.

// ============================ constants ============================

const BOOTS = 2000;

const RT_MIN = 250;    // faster than this and the display was not searched
const RT_MAX = 6000;   // slower than this and something else happened in the room
const TRIM = 0.1;      // symmetric trimming on each cell before its mean is taken

export const RINGS = 3;
export const PER_RING = 8;
export const N_SLOTS = RINGS * PER_RING; // 24

export const TOTALS = [6, 12, 24];            // all divisible by the ring count
export const ORANGES = [3, 6, 12];            // ditto, and always the smaller subset

export const N_BLOCKS = 6;
export const PER_CELL_PER_BLOCK = 4;          // per answer, so eight trials per cell per block
export const N_CELLS = 5;                     // three holding the screen full, three holding the
                                              // candidates, sharing one corner
export const POP_PER_BLOCK = 6;               // 2 at each total, target always present
export const PER_BLOCK = N_CELLS * PER_CELL_PER_BLOCK * 2 + POP_PER_BLOCK;  // 46
export const N_SCORED = N_BLOCKS * PER_BLOCK;                                // 276

export const DRILL_N = 16;
export const DRILL_PASS = 0.875;
export const PRACTICE_N = 14;

const MIN_CELL = 14;        // usable target present trials needed in each of the five cells
const MAX_HIDDEN = 0.1;
const MAX_FAST = 0.08;
const MAX_YES = 0.72;       // the design asks for about 0.57
const MIN_YES = 0.4;
const MIN_ACC = 0.8;        // chance is one half here
const MIN_RT_SD = 90;       // a hand searching a changing display is not this regular
const MAX_MISS = 0.25;
const MAX_FRAME_MS = 40;
const MIN_CAND_MS = 4;      // a cost per candidate below this cannot carry a ratio

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function mean(a: number[]) {
  return a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN;
}

function sd(a: number[]) {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
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
  if (a.length < 5) return mean(a);
  const s = [...a].sort((x, y) => x - y);
  const k = Math.floor(s.length * frac);
  return mean(s.slice(k, s.length - k));
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
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
  const out: T[] = [];
  for (let i = 0; i < a.length; i++) out.push(a[Math.floor(rnd() * a.length)]);
  return out;
}

// Ordinary least squares slope of y on x. Three points, no intercept reported, because the
// intercept is where every constant this page refuses to interpret has gone to live.
export function ols(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length < 2) return NaN;
  if (ys.some((y) => !Number.isFinite(y))) return NaN;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return den ? num / den : NaN;
}

// ============================ the material ============================

export type Kind = 'drill' | 'practice' | 'conj' | 'pop';

export type Item = { slot: number; orange: boolean; vertical: boolean; jx: number; jy: number };

export type Spec = {
  kind: Kind;
  total: number;
  orange: number;
  present: boolean;
  items: Item[];
  cell: string;
};

export type Trial = Spec & {
  rt: number;
  yes: boolean | null;
  correct: boolean;
  timedOut: boolean;
  hidden: boolean;
  frameMs: number;
};

export function cellOf(kind: Kind, total: number, orange: number): string {
  if (kind === 'pop') return `p${total}`;
  if (kind === 'conj') return `c${total}o${orange}`;
  return kind;
}

// Slots are numbered ring major: 0 to 7 inner, 8 to 15 middle, 16 to 23 outer.
export function ringOf(slot: number) {
  return Math.floor(slot / PER_RING);
}

function pickPerRing(n: number, rnd: () => number): number[] {
  // n has to divide by the ring count, which is why every set size on this page does.
  const each = n / RINGS;
  const out: number[] = [];
  for (let r = 0; r < RINGS; r++) {
    const ring = shuffled(
      Array.from({ length: PER_RING }, (_, i) => r * PER_RING + i),
      rnd,
    );
    out.push(...ring.slice(0, each));
  }
  return out;
}

// One display. Blue items are always vertical, so they share the target's orientation and never
// its colour: guiding on vertical is possible and this is the display where it is the wrong call.
export function buildDisplay(kind: Kind, total: number, orange: number, present: boolean, rnd: () => number): Spec {
  const slots = pickPerRing(total, rnd);
  const byRing: number[][] = [[], [], []];
  slots.forEach((s) => byRing[ringOf(s)].push(s));

  let orangeSlots: number[] = [];
  if (orange % RINGS === 0) {
    const each = orange / RINGS;
    for (let r = 0; r < RINGS; r++) orangeSlots.push(...shuffled(byRing[r], rnd).slice(0, each));
  } else {
    // Only the pop-out displays land here, with a single orange item. Its ring is drawn at
    // random so its eccentricity distribution matches every other cell.
    const r = Math.floor(rnd() * RINGS);
    orangeSlots = shuffled(byRing[r], rnd).slice(0, orange);
  }

  let targetSlot = -1;
  if (present) {
    const ring = Math.floor(rnd() * RINGS);
    const onRing = orangeSlots.filter((s) => ringOf(s) === ring);
    const pool = onRing.length ? onRing : orangeSlots;
    targetSlot = pool[Math.floor(rnd() * pool.length)];
  }

  const oset = new Set(orangeSlots);
  const items: Item[] = slots.map((slot) => ({
    slot,
    orange: oset.has(slot),
    vertical: slot === targetSlot ? true : !oset.has(slot),
    jx: rnd() * 2 - 1,
    jy: rnd() * 2 - 1,
  }));

  return { kind, total, orange, present, items: shuffled(items, rnd), cell: cellOf(kind, total, orange) };
}

// ============================ building a session ============================

export type Plan = { drill: Spec[]; practice: Spec[]; blocks: Spec[][] };

// The drill shows one item and asks the same question the session asks. Four item types, four
// trials each, so a failure can say which of the three ways to fail it happened.
function drillSpecs(rnd: () => number): Spec[] {
  const kinds: Array<[boolean, boolean]> = [
    [true, true],   // orange vertical, the target
    [true, false],  // orange horizontal
    [false, true],  // blue vertical
    [false, false], // blue horizontal
  ];
  const out: Spec[] = [];
  kinds.forEach(([orange, vertical]) => {
    for (let i = 0; i < DRILL_N / 4; i++) {
      const slot = Math.floor(rnd() * N_SLOTS);
      out.push({
        kind: 'drill',
        total: 1,
        orange: orange ? 1 : 0,
        present: orange && vertical,
        items: [{ slot, orange, vertical, jx: rnd() * 2 - 1, jy: rnd() * 2 - 1 }],
        cell: orange ? (vertical ? 'dTarget' : 'dOrient') : vertical ? 'dColour' : 'dNeither',
      });
    }
  });
  return shuffled(out, rnd);
}

function practiceSpecs(rnd: () => number): Spec[] {
  const out: Spec[] = [];
  for (let i = 0; i < PRACTICE_N; i++) {
    const total = TOTALS[i % TOTALS.length];
    const orange = ORANGES[i % ORANGES.length];
    out.push(buildDisplay('practice', total, Math.min(orange, total), i % 2 === 0, rnd));
  }
  return shuffled(out, rnd);
}

// The ten conjunction cells: the three that hold the screen full, the three that hold the
// candidates fixed, and the corner they share, each with and without the target.
export function conjCells(): Array<{ total: number; orange: number }> {
  const seen = new Set<string>();
  const out: Array<{ total: number; orange: number }> = [];
  const push = (total: number, orange: number) => {
    const k = `${total}:${orange}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ total, orange });
  };
  ORANGES.forEach((o) => push(24, o));
  TOTALS.forEach((t) => push(t, 3));
  return out;
}

function blockSpecs(rnd: () => number): Spec[] {
  const out: Spec[] = [];
  conjCells().forEach(({ total, orange }) => {
    for (let i = 0; i < PER_CELL_PER_BLOCK; i++) {
      out.push(buildDisplay('conj', total, orange, true, rnd));
      out.push(buildDisplay('conj', total, orange, false, rnd));
    }
  });
  for (let i = 0; i < POP_PER_BLOCK / TOTALS.length; i++) {
    TOTALS.forEach((t) => out.push(buildDisplay('pop', t, 1, true, rnd)));
  }
  // No more than three of the same answer in a row, and never the same cell three times running.
  let best = shuffled(out, rnd);
  let bestCost = runCost(best);
  for (let attempt = 0; attempt < 60 && bestCost > 0; attempt++) {
    const cand = shuffled(out, rnd);
    const cost = runCost(cand);
    if (cost < bestCost) {
      best = cand;
      bestCost = cost;
    }
  }
  return best;
}

function runCost(specs: Spec[]): number {
  let cost = 0;
  let sameAns = 1;
  for (let i = 1; i < specs.length; i++) {
    sameAns = specs[i].present === specs[i - 1].present ? sameAns + 1 : 1;
    if (sameAns > 3) cost += 1;
    if (specs[i].cell === specs[i - 1].cell) cost += 1;
  }
  return cost;
}

export function buildPlan(rnd: () => number): Plan {
  const blocks: Spec[][] = [];
  for (let b = 0; b < N_BLOCKS; b++) blocks.push(blockSpecs(rnd));
  return { drill: drillSpecs(rnd), practice: practiceSpecs(rnd), blocks };
}

// ============================ what survives into the analysis ============================

export function scoredKind(t: Trial) {
  return t.kind === 'conj' || t.kind === 'pop';
}

export function attempted(t: Trial): boolean {
  return scoredKind(t) && !t.hidden;
}

export function usable(t: Trial): boolean {
  return attempted(t) && !t.timedOut && t.correct && t.rt >= RT_MIN && t.rt <= RT_MAX;
}

function cellRts(ts: Trial[], cell: string, present: boolean): number[] {
  return ts.filter((t) => usable(t) && t.cell === cell && t.present === present).map((t) => t.rt);
}

// ============================ the five cells, and the three slopes ============================

export const FULL_CELLS = ORANGES.map((o) => cellOf('conj', 24, o));   // screen full, candidates move
export const CAND_CELLS = TOTALS.map((t) => cellOf('conj', t, 3));     // candidates fixed, screen fills
export const POP_CELLS = TOTALS.map((t) => cellOf('pop', t, 1));

export type Slopes = {
  slopeFull: number;   // ms per orange item at 24 items, which is (cost of a candidate) - (cost of a rejected item)
  slopeCand: number;   // ms per added item at 3 candidates, which is the cost of a rejected item
  slopePop: number;    // ms per added item with nothing to search, which is the price of the display
  candMs: number;      // slopeFull + slopeCand, the cost of one candidate
  rejectMs: number;    // slopeCand, named for the results table
  leak: number;        // rejectMs / candMs. 0 is perfect guidance, 1 is visiting everything
  leakCorr: number;    // the same with the display price removed from both sides
  slopeFullAbs: number;
  slopeCandAbs: number;
  leakAbs: number;     // the same ratio computed on the trials with nothing to find, where the
                       // search cannot stop early. Same two committed values, independent noise
  absRatio: number;    // absent slope over present slope. Exactly 2 if candidates are visited one
                       // at a time and the search stops on a hit
};

function slopesFrom(
  pres: Record<string, number>,
  abst: Record<string, number>,
  pop: Record<string, number>,
): Slopes {
  const slopeFull = ols(ORANGES, FULL_CELLS.map((c) => pres[c]));
  const slopeCand = ols(TOTALS, CAND_CELLS.map((c) => pres[c]));
  const slopePop = ols(TOTALS, POP_CELLS.map((c) => pop[c]));
  const candMs = slopeFull + slopeCand;
  const slopeFullAbs = ols(ORANGES, FULL_CELLS.map((c) => abst[c]));
  const slopeCandAbs = ols(TOTALS, CAND_CELLS.map((c) => abst[c]));
  const candMsAbs = slopeFullAbs + slopeCandAbs;
  return {
    slopeFull,
    slopeCand,
    slopePop,
    candMs,
    rejectMs: slopeCand,
    leak: candMs ? slopeCand / candMs : NaN,
    leakCorr: candMs - slopePop ? (slopeCand - slopePop) / (candMs - slopePop) : NaN,
    slopeFullAbs,
    slopeCandAbs,
    leakAbs: candMsAbs ? slopeCandAbs / candMsAbs : NaN,
    absRatio: slopeFull ? slopeFullAbs / slopeFull : NaN,
  };
}

function meansOf(ts: Trial[], cells: string[], present: boolean): Record<string, number> {
  const out: Record<string, number> = {};
  cells.forEach((c) => {
    out[c] = trimmedMean(cellRts(ts, c, present));
  });
  return out;
}

export function slopesOf(ts: Trial[]): Slopes {
  const conj = [...new Set([...FULL_CELLS, ...CAND_CELLS])];
  return slopesFrom(meansOf(ts, conj, true), meansOf(ts, conj, false), meansOf(ts, POP_CELLS, true));
}

// ============================ the bootstrap ============================

export type Boot = {
  slopeFull: [number, number];
  slopeCand: [number, number];
  slopePop: [number, number];
  candMs: [number, number];
  leak: [number, number];
  leakCorr: [number, number];
  leakAbs: [number, number];
  absRatio: [number, number];
  dropped: number;   // draws where the cost per candidate was too small to form a ratio
};

export function bootstrapOf(ts: Trial[], rnd: () => number, boots = BOOTS): Boot {
  const conj = [...new Set([...FULL_CELLS, ...CAND_CELLS])];
  const presPools: Record<string, number[]> = {};
  const abstPools: Record<string, number[]> = {};
  const popPools: Record<string, number[]> = {};
  conj.forEach((c) => {
    presPools[c] = cellRts(ts, c, true);
    abstPools[c] = cellRts(ts, c, false);
  });
  POP_CELLS.forEach((c) => {
    popPools[c] = cellRts(ts, c, true);
  });

  const keep: Record<string, number[]> = {
    slopeFull: [], slopeCand: [], slopePop: [], candMs: [], leak: [], leakCorr: [], leakAbs: [], absRatio: [],
  };
  let dropped = 0;

  for (let b = 0; b < boots; b++) {
    const pres: Record<string, number> = {};
    const abst: Record<string, number> = {};
    const pop: Record<string, number> = {};
    conj.forEach((c) => {
      pres[c] = trimmedMean(resample(presPools[c], rnd));
      abst[c] = trimmedMean(resample(abstPools[c], rnd));
    });
    POP_CELLS.forEach((c) => {
      pop[c] = trimmedMean(resample(popPools[c], rnd));
    });
    const s = slopesFrom(pres, abst, pop);
    keep.slopeFull.push(s.slopeFull);
    keep.slopeCand.push(s.slopeCand);
    keep.slopePop.push(s.slopePop);
    keep.candMs.push(s.candMs);
    keep.absRatio.push(s.absRatio);
    if (Math.abs(s.slopeFullAbs + s.slopeCandAbs) >= MIN_CAND_MS) keep.leakAbs.push(s.leakAbs);
    // A ratio whose denominator is near zero is not a wide estimate, it is a different question.
    // Those draws are counted and thrown out rather than allowed to widen the interval to nothing.
    if (Math.abs(s.candMs) < MIN_CAND_MS) {
      dropped++;
    } else {
      keep.leak.push(s.leak);
      keep.leakCorr.push(s.leakCorr);
    }
  }

  return {
    slopeFull: ciOf(keep.slopeFull),
    slopeCand: ciOf(keep.slopeCand),
    slopePop: ciOf(keep.slopePop),
    candMs: ciOf(keep.candMs),
    leak: ciOf(keep.leak),
    leakCorr: ciOf(keep.leakCorr),
    leakAbs: ciOf(keep.leakAbs),
    absRatio: ciOf(keep.absRatio),
    dropped: boots ? dropped / boots : 1,
  };
}

// ============================ the verdict ============================

export type Verdict =
  | 'partial'      // both committed values excluded: guidance is real and it leaks
  | 'guided'       // visiting everything excluded, perfect guidance survives
  | 'everything'   // perfect guidance excluded, visiting everything survives
  | 'orientation'  // the cost went DOWN as candidates were added, which is the other dimension
  | 'neither'
  | 'flat'         // no cost per candidate to apportion
  | 'reversed'     // a fuller screen made you faster
  | 'thin';

export type Scored = {
  slopes: Slopes;
  boot: Boot;
  verdict: Verdict;
  excludedEverything: boolean;
  excludedPerfect: boolean;
  minCell: number;
  cellsPresent: Record<string, number>;
  presentMeans: Record<string, number>;
  absentMeans: Record<string, number>;
  popMeans: Record<string, number>;
};

export function scoreOf(ts: Trial[], rnd: () => number, boots = BOOTS): Scored {
  const conj = [...new Set([...FULL_CELLS, ...CAND_CELLS])];
  const slopes = slopesOf(ts);
  const boot = bootstrapOf(ts, rnd, boots);

  const cellsPresent: Record<string, number> = {};
  conj.forEach((c) => {
    cellsPresent[c] = cellRts(ts, c, true).length;
  });
  const minCell = Math.min(...conj.map((c) => cellsPresent[c]));

  const excludedEverything = Number.isFinite(boot.leak[1]) && boot.leak[1] < 1;
  const excludedPerfect = Number.isFinite(boot.leak[0]) && boot.leak[0] > 0;

  let verdict: Verdict;
  if (minCell < MIN_CELL) verdict = 'thin';
  else if (Number.isFinite(boot.slopeCand[1]) && boot.slopeCand[1] < 0) verdict = 'reversed';
  else if (Number.isFinite(boot.slopeFull[1]) && boot.slopeFull[1] < 0) verdict = 'orientation';
  else if (boot.dropped > 0.1 || !Number.isFinite(boot.candMs[0]) || boot.candMs[0] <= 0) verdict = 'flat';
  else if (excludedEverything && excludedPerfect) verdict = 'partial';
  else if (excludedEverything) verdict = 'guided';
  else if (excludedPerfect) verdict = 'everything';
  else verdict = 'neither';

  return {
    slopes,
    boot,
    verdict,
    excludedEverything,
    excludedPerfect,
    minCell,
    cellsPresent,
    presentMeans: meansOf(ts, conj, true),
    absentMeans: meansOf(ts, conj, false),
    popMeans: meansOf(ts, POP_CELLS, true),
  };
}

// ============================ second window: misses, no milliseconds anywhere ============================

export type ErrWindow = {
  missFull: number[];      // miss rate at 3, 6, 12 candidates with the screen full
  missCand: number[];      // miss rate at 6, 12, 24 items with the candidates fixed
  faFull: number[];
  slopeMissFull: number;   // miss rate per candidate
  slopeMissCand: number;   // miss rate per rejected item
  ciMissFull: [number, number];
  ciMissCand: [number, number];
  nMiss: number;
};

function missRate(ts: Trial[], cell: string): number {
  const pool = ts.filter((t) => attempted(t) && t.cell === cell && t.present);
  if (!pool.length) return NaN;
  return pool.filter((t) => t.timedOut || t.yes === false).length / pool.length;
}

function faRate(ts: Trial[], cell: string): number {
  const pool = ts.filter((t) => attempted(t) && t.cell === cell && !t.present);
  if (!pool.length) return NaN;
  return pool.filter((t) => t.yes === true).length / pool.length;
}

export function errWindowOf(ts: Trial[], rnd: () => number, boots = 800): ErrWindow {
  const missFull = FULL_CELLS.map((c) => missRate(ts, c));
  const missCand = CAND_CELLS.map((c) => missRate(ts, c));
  const faFull = FULL_CELLS.map((c) => faRate(ts, c));
  const slopeMissFull = ols(ORANGES, missFull);
  const slopeMissCand = ols(TOTALS, missCand);

  const poolsFull = FULL_CELLS.map((c) => ts.filter((t) => attempted(t) && t.cell === c && t.present));
  const poolsCand = CAND_CELLS.map((c) => ts.filter((t) => attempted(t) && t.cell === c && t.present));
  const rateOf = (pool: Trial[]) => (pool.length ? pool.filter((t) => t.timedOut || t.yes === false).length / pool.length : NaN);

  const dFull: number[] = [];
  const dCand: number[] = [];
  for (let b = 0; b < boots; b++) {
    dFull.push(ols(ORANGES, poolsFull.map((p) => rateOf(resample(p, rnd)))));
    dCand.push(ols(TOTALS, poolsCand.map((p) => rateOf(resample(p, rnd)))));
  }

  return {
    missFull,
    missCand,
    faFull,
    slopeMissFull,
    slopeMissCand,
    ciMissFull: ciOf(dFull),
    ciMissCand: ciOf(dCand),
    nMiss: ts.filter((t) => attempted(t) && t.present && (t.timedOut || t.yes === false)).length,
  };
}

// ============================ the drill, and what it can refuse ============================

export type DrillReport = {
  acc: number;
  accTarget: number;   // the real thing, accepted
  accColour: number;   // a blue vertical, rejected
  accOrient: number;   // an orange horizontal, rejected
  ok: boolean;
  cause: string;
};

function accIn(ts: Trial[], cell: string): number {
  const pool = ts.filter((t) => t.kind === 'drill' && t.cell === cell);
  return pool.length ? pool.filter((t) => t.correct).length / pool.length : NaN;
}

export function drillReportOf(all: Trial[]): DrillReport {
  const ts = all.filter((t) => t.kind === 'drill').slice(-DRILL_N);
  const acc = ts.length ? ts.filter((t) => t.correct).length / ts.length : 0;
  const accTarget = accIn(ts, 'dTarget');
  const accColour = accIn(ts, 'dColour');
  const accOrient = accIn(ts, 'dOrient');
  let cause = '';
  if (acc < DRILL_PASS) {
    if (accColour < 0.6) cause = 'colour';
    else if (accOrient < 0.6) cause = 'orientation';
    else if (accTarget < 0.6) cause = 'target';
    else cause = 'mixed';
  }
  return { acc, accTarget, accColour, accOrient, ok: acc >= DRILL_PASS, cause };
}

// ============================ refusals ============================

export type Quality = { ok: boolean; reason: string; detail: string };

export type Checks = {
  nScored: number;
  nUsable: number;
  acc: number;
  yesShare: number;
  fastShare: number;
  hiddenShare: number;
  missShare: number;
  rtSd: number;
  frameMs: number;
  popMs: number;
  hardMs: number;
  drill: DrillReport;
};

export function checksOf(all: Trial[]): Checks {
  const scored = all.filter(scoredKind);
  const tried = scored.filter(attempted);
  const use = scored.filter(usable);
  const answered = tried.filter((t) => !t.timedOut);
  const conj = [...new Set([...FULL_CELLS, ...CAND_CELLS])];
  const sds = conj
    .map((c) => sd(cellRts(scored, c, true)))
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);
  return {
    nScored: scored.length,
    nUsable: use.length,
    acc: answered.length ? answered.filter((t) => t.correct).length / answered.length : 0,
    yesShare: answered.length ? answered.filter((t) => t.yes === true).length / answered.length : 0,
    fastShare: answered.length ? answered.filter((t) => t.rt < RT_MIN).length / answered.length : 0,
    hiddenShare: scored.length ? scored.filter((t) => t.hidden).length / scored.length : 0,
    missShare: tried.length ? tried.filter((t) => t.timedOut).length / tried.length : 0,
    rtSd: sds.length ? sds[Math.floor(sds.length / 2)] : NaN,
    frameMs: scored.reduce((m, t) => Math.max(m, t.frameMs || 0), 0),
    popMs: trimmedMean(cellRts(scored, cellOf('pop', 24, 1), true)),
    hardMs: trimmedMean(cellRts(scored, cellOf('conj', 24, 12), true)),
    drill: drillReportOf(all),
  };
}

export function qualityOf(all: Trial[]): Quality {
  const c = checksOf(all);
  const ok = { ok: true, reason: '', detail: '' };

  if (!c.drill.ok) {
    const detail =
      c.drill.cause === 'colour'
        ? `The drill came in at ${Math.round(c.drill.acc * 100)} percent and the misses were blue verticals called the target. Orange and blue here were chosen to survive the common colour vision deficiencies, and if they still are not two colours on your screen then this page is measuring your monitor or your eyes and not your attention. Either is worth knowing and neither is a search slope.`
        : c.drill.cause === 'orientation'
          ? `The drill came in at ${Math.round(c.drill.acc * 100)} percent and the misses were orange horizontals called the target. Half the target is its orientation, so a session run on that mapping would have measured a colour search wearing a conjunction costume.`
          : c.drill.cause === 'target'
            ? `The drill came in at ${Math.round(c.drill.acc * 100)} percent and the real target was the thing being rejected. Whatever was being looked for, it was not an orange vertical bar.`
            : `The drill came in at ${Math.round(c.drill.acc * 100)} percent with no single cause standing out. The target has to be in your hands before a slope means anything.`;
    return { ok: false, reason: 'the target never landed', detail };
  }
  if (c.hiddenShare > MAX_HIDDEN) {
    return {
      ok: false,
      reason: 'the tab was away',
      detail: `${(c.hiddenShare * 100).toFixed(0)} percent of trials happened while this tab was not in front of you. A search you did not see is not a slow search, it is a missing one.`,
    };
  }
  if (c.fastShare > MAX_FAST) {
    return {
      ok: false,
      reason: 'answers before the search',
      detail: `${(c.fastShare * 100).toFixed(0)} percent of your answers came in under ${RT_MIN} ms. Nothing on the screen had been searched yet, so those trials price a rhythm and not a display.`,
    };
  }
  if (c.acc < MIN_ACC) {
    return {
      ok: false,
      reason: 'guessing rather than searching',
      detail: `Accuracy came in at ${(c.acc * 100).toFixed(0)} percent, and chance here is fifty because there are two keys. A slope built on answers that were half right by luck is a slope built on nothing.`,
    };
  }
  if (c.yesShare > MAX_YES || c.yesShare < MIN_YES) {
    return {
      ok: false,
      reason: 'one key did most of the work',
      detail: `You pressed yes on ${(c.yesShare * 100).toFixed(0)} percent of trials and the design asks for about 57. Leaning on one key removes the part of the task that costs time, which is deciding.`,
    };
  }
  if (Number.isFinite(c.rtSd) && c.rtSd < MIN_RT_SD) {
    return {
      ok: false,
      reason: 'not a hand',
      detail: `Your response times inside a single cell spread by ${c.rtSd.toFixed(0)} ms. Displays here differ from one another trial to trial and a hand searching them does not come in this regular. Something was answering on a clock.`,
    };
  }
  if (c.missShare > MAX_MISS) {
    return {
      ok: false,
      reason: 'too many trials ran out',
      detail: `${(c.missShare * 100).toFixed(0)} percent of trials hit the ${RT_MAX} ms ceiling. A search that does not finish has no time to contribute and a ceiling flattens every slope towards it.`,
    };
  }
  if (c.frameMs > MAX_FRAME_MS) {
    return {
      ok: false,
      reason: 'the screen was too slow to time',
      detail: `Your display refreshed every ${c.frameMs.toFixed(0)} ms while this ran. The measurement survives a coarse clock, because the same quantisation lands on every cell and cancels in a slope, but not one this coarse.`,
    };
  }
  if (Number.isFinite(c.popMs) && Number.isFinite(c.hardMs) && c.popMs > c.hardMs) {
    return {
      ok: false,
      reason: 'the control was harder than the task',
      detail: `A single orange bar among blue ones took you longer than twelve orange bars to sort through. That ordering is not something a searching visitor produces, and the display price this page subtracts is measured from those trials.`,
    };
  }
  return ok;
}

// ============================ everything, once ============================

export type Result = {
  scored: Scored;
  err: ErrWindow;
  checks: Checks;
  quality: Quality;
};

export function analyse(all: Trial[], rnd: () => number, boots = BOOTS): Result {
  return {
    scored: scoreOf(all, rnd, boots),
    err: errWindowOf(all, rnd),
    checks: checksOf(all),
    quality: qualityOf(all),
  };
}

// ===================== CORE END =====================

// ============================ timings ============================
//
// Every one of these is a constant added to every trial in every cell, which is exactly why none
// of them can reach a slope. They are here to make the task feel like a task.

const FIX_MS = 500;      // a dot in the centre, so the search does not start from wherever the
                         // last one ended
const FB_MS = 350;       // only on an error
const ITI_MS = 450;
const DRILL_FIX_MS = 350;

// ============================ where the items go ============================
//
// Three rings of eight. Every set size takes the same number of slots from each ring, so average
// eccentricity is identical at 6 items and at 24 and acuity cannot masquerade as search.

const RING_R = [0.165, 0.29, 0.415];
const BAR_LONG = 0.065;
const BAR_SHORT = 0.019;
const JITTER = 0.013;

export function slotXY(slot: number, jx: number, jy: number) {
  const r = ringOf(slot);
  const i = slot % PER_RING;
  const ang = (i / PER_RING) * Math.PI * 2 + (r * Math.PI * 2) / (PER_RING * RINGS);
  return {
    x: 0.5 + RING_R[r] * Math.cos(ang) + jx * JITTER,
    y: 0.5 + RING_R[r] * Math.sin(ang) + jy * JITTER,
  };
}

const ORANGE = '#f59e0b';
const BLUE = '#3b82f6';

type Stage = 'card' | 'fix' | 'stim' | 'fb' | 'gap';
type Screen = 'intro' | 'run' | 'crunch' | 'result';
type Answer = 'no' | 'yes';

type Seg =
  | { id: 'commit'; label: string }
  | { id: 'drill' | 'practice' | 'block'; label: string; specs: Spec[]; block: number };

function segsOf(plan: Plan): Seg[] {
  const out: Seg[] = [
    { id: 'drill', label: 'the target, one item at a time', specs: plan.drill, block: -1 },
    { id: 'practice', label: 'practice, full displays', specs: plan.practice, block: -1 },
    { id: 'commit', label: 'three accounts commit' },
  ];
  plan.blocks.forEach((specs, i) => {
    out.push({ id: 'block', label: `block ${i + 1} of ${N_BLOCKS}`, specs, block: i });
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
  const [frameMs, setFrameMs] = useState(0);
  const [retryNote, setRetryNote] = useState('');

  const startedRef = useRef('');
  const trials = useRef<Trial[]>([]);
  const shownAt = useRef(0);
  const answered = useRef(false);
  const hiddenRef = useRef(false);
  const frameRef = useRef(0);
  const attempts = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, Math.max(0, ms)));
  }, []);

  // The refresh interval is recorded rather than corrected for. A coarse clock adds the same
  // quantisation to every cell and cancels in a slope, but a clock this coarse is refused.
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
        const med = gaps[Math.floor(gaps.length / 2)];
        frameRef.current = med;
        setFrameMs(med);
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
    // Seeded here and never in a state initialiser: this page is a static export, so anything
    // random that reaches the first render is a hydration failure on every visit.
    const rnd = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    const plan = buildPlan(rnd);
    trials.current = [];
    startedRef.current = '';
    attempts.current = 0;
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
      setRes(analyse(trials.current, mulberry32(20260909)));
      setScreen('result');
    }, 60);
  }, [clearTimers]);

  // A drill that did not take is repeated rather than held against the session at the end.
  const endSegment = useCallback((segIndex: number) => {
    const s = segs[segIndex];
    setStage('card');
    if (s && s.id === 'drill') {
      const rep = drillReportOf(trials.current);
      attempts.current += 1;
      if (!rep.ok && attempts.current < 3) {
        setRetryNote(`That drill came in at ${Math.round(rep.acc * 100)} percent, and ${DRILL_PASS * 100} is the bar. The target has to be in your hands before a slope can mean anything, so here it is again.`);
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
    setStage('fix');
    later(() => {
      setStage('stim');
      // Two frames, so the clock starts on the frame after the one that painted the display.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { shownAt.current = performance.now(); });
      });
      later(() => {
        if (answered.current) return;
        answered.current = true;
        trials.current.push({ ...sp, rt: RT_MAX, yes: null, correct: false, timedOut: true, hidden: hiddenRef.current, frameMs: frameRef.current });
        setWrong(true);
        setStage('fb');
        later(() => { setStage('gap'); later(() => setIdx(i + 1), ITI_MS); }, FB_MS);
      }, RT_MAX);
    }, s.id === 'drill' ? DRILL_FIX_MS : FIX_MS);
  }, [segs, later, endSegment]);

  const answer = useCallback((a: Answer) => {
    if (stage !== 'stim' || answered.current || !spec) return;
    answered.current = true;
    clearTimers();
    const rt = shownAt.current ? performance.now() - shownAt.current : NaN;
    const yes = a === 'yes';
    const correct = yes === spec.present;
    trials.current.push({ ...spec, rt, yes, correct, timedOut: false, hidden: hiddenRef.current, frameMs: frameRef.current });
    setWrong(!correct);
    setStage(correct ? 'gap' : 'fb');
    if (correct) later(() => setIdx(idx + 1), ITI_MS);
    else later(() => { setStage('gap'); later(() => setIdx(idx + 1), ITI_MS); }, FB_MS);
  }, [stage, spec, idx, clearTimers, later]);

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
    setIdx(0);
    setStage('fix');
  }, [segs, seg, clearTimers]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screen === 'run' && stage === 'stim') {
        const k = e.key.toLowerCase();
        if (k === 'f') { e.preventDefault(); answer('no'); }
        else if (k === 'j') { e.preventDefault(); answer('yes'); }
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
        <Stagecraft spec={spec} stage={stage} wrong={wrong} onAnswer={answer} done={idx} total={total} />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#128270;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">What It Cannot Be</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            One orange vertical bar, hidden in a field of bars that are orange, or vertical, but
            never both. Everyone knows a fuller screen is slower. This one fills up with items that
            are the wrong colour to be the answer, and asks your hands whether you paid for them.
          </p>
        </div>

        {screen === 'intro' && <Intro onStart={begin} frameMs={frameMs} />}
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
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">pricing a candidate against a rejection</div>
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

function Bar({ item }: { item: Item }) {
  const { x, y } = slotXY(item.slot, item.jx, item.jy);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${(item.vertical ? BAR_SHORT : BAR_LONG) * 100}%`,
        height: `${(item.vertical ? BAR_LONG : BAR_SHORT) * 100}%`,
        background: item.orange ? ORANGE : BLUE,
        transform: 'translate(-50%, -50%)',
        borderRadius: '1px',
      }}
    />
  );
}

const ARENA = 'min(86vw, 420px)';

function Arena({ items, show, wrong }: { items: Item[]; show: boolean; wrong: boolean }) {
  return (
    <div
      className={`relative rounded-lg border ${wrong ? 'border-rose-500/70 bg-rose-500/5' : 'border-slate-800/70 bg-slate-950'}`}
      style={{ width: ARENA, height: ARENA }}
      data-role="arena"
    >
      {show
        ? items.map((it, i) => <Bar key={`${it.slot}:${i}`} item={it} />)
        : <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500" />}
    </div>
  );
}

function KeyPads({ onAnswer, live }: { onAnswer?: (a: Answer) => void; live?: boolean }) {
  const pad = (a: Answer, key: string, text: string) => (
    <button
      type="button"
      onClick={() => live && onAnswer && onAnswer(a)}
      className="rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-center transition active:bg-slate-800"
    >
      <div className="font-mono text-lg font-bold uppercase text-slate-200">{key}</div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{text}</div>
    </button>
  );
  return (
    <div className="mx-auto grid max-w-xs grid-cols-2 gap-3">
      {pad('no', 'F', 'not there')}
      {pad('yes', 'J', 'found it')}
    </div>
  );
}

function Stagecraft({
  spec, stage, wrong, onAnswer, done, total,
}: {
  spec: Spec | null;
  stage: Stage;
  wrong: boolean;
  onAnswer: (a: Answer) => void;
  done: number;
  total: number;
}) {
  if (!spec) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950" data-stage={stage} data-cell={spec.cell}>
      <div className="absolute top-5 font-mono text-[11px] uppercase tracking-widest text-slate-700">
        {done + 1} / {total}
      </div>

      <Arena items={spec.items} show={stage === 'stim'} wrong={wrong && stage === 'fb'} />

      <div className="mt-3 h-6 font-mono text-xs uppercase tracking-widest text-rose-400">
        {wrong && stage === 'fb' ? (spec.present ? 'it was there' : 'it was not there') : ''}
      </div>

      <div className="mt-2 w-full px-6">
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

function msPerItem(x: number, d = 1) {
  if (!Number.isFinite(x)) return 'n/a';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)} ms per item`;
}

function num(x: number, d = 2) {
  return Number.isFinite(x) ? x.toFixed(d) : 'n/a';
}

function pctOf(x: number, d = 1) {
  if (!Number.isFinite(x)) return 'n/a';
  return `${(x * 100).toFixed(d)}%`;
}

function rangeOf(lo: number, hi: number, unit: 'ms' | 'pct' | 'raw', d = 1) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return 'n/a';
  if (unit === 'ms') return `${lo.toFixed(d)} to ${hi.toFixed(d)} ms per item`;
  if (unit === 'pct') return `${(lo * 100).toFixed(d)} to ${(hi * 100).toFixed(d)}%`;
  return `${lo.toFixed(d)} to ${hi.toFixed(d)}`;
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

function Chip({ orange, vertical, label }: { orange: boolean; vertical: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded border border-slate-800 bg-slate-950/60 p-3">
      <div className="flex h-8 w-8 items-center justify-center">
        <div
          style={{
            width: vertical ? 6 : 24,
            height: vertical ? 24 : 6,
            background: orange ? ORANGE : BLUE,
            borderRadius: 1,
          }}
        />
      </div>
      <div className="text-center font-mono text-[10px] uppercase leading-tight tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function TargetLegend() {
  return (
    <div className="mb-4 grid grid-cols-4 gap-2">
      <Chip orange vertical label="the target" />
      <Chip orange={false} vertical label="wrong colour" />
      <Chip orange vertical={false} label="wrong way up" />
      <Chip orange={false} vertical={false} label="never appears" />
    </div>
  );
}

function Intro({ onStart, frameMs }: { onStart: () => void; frameMs: number }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">what you will do</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          A field of small bars appears. Somewhere in it there may be one <span className="text-amber-300">orange vertical</span> bar,
          and that is the only thing you are looking for. Press J if it is there, F if it is not.
          Everything else is orange lying down, or blue standing up, so nothing on the screen can be
          ruled in or out by one feature alone.
        </p>
        <TargetLegend />
        <p className="text-sm leading-relaxed text-slate-300">
          Half the displays contain it. Orange and blue were picked to stay apart for the common
          colour vision deficiencies, and there is a drill first that will tell you if they do not.
        </p>
      </Card>

      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">the claim being tested</div>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          A conjunction like this cannot be picked out by any single feature, and the standard
          explanation is that attention therefore has to visit the items one at a time. Read that
          once more: it says attention visits the ITEMS. All of them, including the blue ones, which
          you can see are blue without visiting anything.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          So two things move here, separately. Sometimes the screen stays full at 24 bars and only
          the number of ORANGE ones changes. Sometimes the orange ones stay at 3 and the screen
          fills up with blue. If a blue bar costs what an orange one costs, both feel the same. If
          it costs nothing, only the first one does anything to you.
        </p>
      </Card>

      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">the deal</div>
        <ul className="mb-4 space-y-2 text-sm leading-relaxed text-slate-300">
          <li>A {DRILL_N} item drill, {PRACTICE_N} practice displays, then {N_BLOCKS} blocks of {PER_BLOCK}. About eleven minutes.</li>
          <li>Speed and accuracy both matter. Errors are dropped from the timing rather than punished.</li>
          <li>Keep your eyes on the centre dot until the display appears. Then hunt.</li>
          <li>Stay on the tab. Time spent away is counted and can void the session.</li>
          <li>Everything is computed in your browser. Nothing is recorded, nothing is sent anywhere.</li>
        </ul>
        {frameMs > MAX_FRAME_MS && (
          <div className="mb-4 rounded border border-amber-500/40 bg-amber-500/5 p-3 font-mono text-xs text-amber-300">
            This screen is refreshing every {frameMs.toFixed(0)} ms, which is slow enough that the
            session will be refused at the end. A slope survives a coarse clock, because the same
            quantisation lands on every condition, but not one this coarse.
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
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-cyan-400">three accounts commit, before you start</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Two slopes come out of this session. One is measured with the screen held full at 24 bars
          while the orange count goes 3, 6, 12, so every orange bar added takes a blue one away.
          The other is measured with the orange count held at 3 while the screen fills from 6 to 24,
          so every bar added is blue. Call the cost of a bar you might have to inspect{' '}
          <span className="font-mono text-slate-100">a</span> and the cost of a bar you can rule out
          on colour <span className="font-mono text-slate-100">b</span>. Then the first slope is{' '}
          <span className="font-mono text-slate-100">a minus b</span>, the second is{' '}
          <span className="font-mono text-slate-100">b</span>, and one number settles the argument:
        </p>
        <div className="mb-4 rounded border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="font-mono text-sm text-cyan-200">leak = b / a</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-500">what a bar you could ignore cost you, as a share of one you could not</div>
        </div>
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">visit everything</div>
          <p className="text-sm leading-relaxed text-slate-400">
            A conjunction has to be checked item by item, so an item is an item and its colour buys
            you nothing before you get there.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your leak = 1</div>
        </div>
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">colour guidance</div>
          <p className="text-sm leading-relaxed text-slate-400">
            Colour is available everywhere at once even though the conjunction is not, so the blue
            bars are never candidates and never cost you anything.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your leak = 0</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">the wrong dimension</div>
          <p className="text-sm leading-relaxed text-slate-400">
            You could guide on vertical instead of orange, and this display is built so that is the
            bad choice: the blue bars are the vertical ones, so adding orange bars REMOVES verticals
            and a visitor guiding on orientation gets faster as the candidates pile up.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your leak lands above 1</div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          None of those three numbers was estimated from anything you do. Each is a consequence of
          what its account claims, which is why they can be printed before your first block instead
          of fitted afterwards. One in eight trials is a single orange bar among blue ones, which
          has no conjunction to search at all, and that measures what a fuller screen costs on its
          own so it can be taken off both sides.
        </p>
      </Card>
      <GoButton onGo={onGo} label="run the blocks" />
    </div>
  );
}

function SegCard({ seg, note, onGo }: { seg: Seg; note: string; onGo: () => void }) {
  if (seg.id === 'commit') return <CommitCard onGo={onGo} />;

  const body =
    seg.id === 'drill' ? (
      <>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          One bar at a time, {DRILL_N} of them, same question and same keys as the session itself.
          J only for an orange bar standing up. Both halves of that matter, and this drill is here
          to find out which half slips.
        </p>
        <TargetLegend />
      </>
    ) : seg.id === 'practice' ? (
      <p className="mb-4 text-sm leading-relaxed text-slate-300">
        Now full displays, {PRACTICE_N} of them, not scored. Look at the centre dot, wait for the
        bars, then find the orange one standing up or decide it is not there. It will feel harder
        than the drill. That difficulty is the entire subject of this page.
      </p>
    ) : (
      <>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          {PER_BLOCK} displays. The number of bars and the number of orange ones both change from
          trial to trial and you are told nothing about which is which, because knowing would let
          you decide in advance how hard to try.
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          Eyes on the dot, then hunt. Take the time you need to be right.
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

// Measured by the Node harness described in the header, filled in from its output rather than
// written by hand. Each row is a rate over simulated visitors whose truth was known.
const SIM_ROWS: Array<[string, string, string]> = [
  ['world where guidance is nearly complete, leak 0.05', 'called it 87%', 'and it never called that world a search that visits everything'],
  ['world where every item really is visited, leak 1.00', 'called it 51%', 'no run in that world came back saying the wrong colour was free'],
  ['world of partial guidance, leak 0.35', 'both endpoints excluded 27%', 'one endpoint excluded 55%, no ratio formed 14%. This is the honest cost of one person and one sitting'],
  ['world with a real display cost of 6 ms per item', 'raw leak 0.24, corrected leak 0.03', 'truth 0.05. Interval coverage 37% raw against 96% corrected, which is the confound doing exactly what the page says it does'],
  ['world with a visitor 1.6 times slower everywhere', 'leak 0.341 against 0.342', 'the same number to three digits, because a ratio of slopes cannot see a speed'],
  ['world with a 2.5% speedup per block', 'leak 0.333, coverage 96%', 'every cell appears equally often in every block, so a straight drift cannot reach one of them'],
  ['world guided on vertical instead of orange', 'caught 56%', 'no run there was reported as colour guidance'],
  ['interval coverage on the leak', '95 to 97% against a nominal 95%', 'and 94 to 96% for the version computed on the trials with nothing to find'],
  ['the absent over present slope ratio', 'recovered as 2.04', 'in the world where the simulated search really did inspect candidates one at a time and stop on a hit'],
  ['refusal ladder', '12 strategies, 720 of 720 refused', 'machine, guesser, one key, fast keys, walking away, hidden tab, colour confusion, orientation confusion, a slow screen, and three that pass the drill honestly and then degrade. 180 honest visitors at three speeds: 0 refused'],
];

const VERDICT_COPY: Record<Verdict, { head: string; tone: string; body: string }> = {
  partial: {
    head: 'You skipped most of the screen. Not all of it.',
    tone: 'text-cyan-300',
    body:
      'Both committed numbers are outside your interval. A bar of the wrong colour cost you clearly less than a bar that could have been the target, which visiting everything cannot explain, and it cost you clearly more than nothing, which perfect guidance cannot explain. This is the ordinary finding and it is the one Guided Search was built to describe: the parallel stage cannot tell you where the target is, it can only tell attention which items are worth its time, and it is not a clean filter.',
  },
  guided: {
    head: 'The wrong colour was free.',
    tone: 'text-emerald-300',
    body:
      'Visiting everything is excluded: your interval on the leak sits below one. And zero is inside it, so nothing here can show that a bar you could rule out on colour cost you anything at all. Within the resolution of one sitting, your search went to the candidates and nowhere else. Egeth, Virzi and Garbart got this in 1984 and it is still the cleanest result against the item by item story.',
  },
  everything: {
    head: 'You paid for bars that could not have been it.',
    tone: 'text-amber-300',
    body:
      'Your leak is clearly above zero, so perfect guidance is excluded, and one is inside your interval, so this session cannot rule out that every bar cost you the same regardless of colour. That is the item by item account surviving. It is not the common outcome, and the two honest readings are that your colour signal was weak on this display, or that the screen filling up cost you something no search could avoid, which is why the number with the display price removed is printed below.',
  },
  orientation: {
    head: 'You guided on the wrong feature.',
    tone: 'text-amber-300',
    body:
      'Adding orange bars while holding the screen full made you FASTER, which no account of a colour guided search predicts and which this display was built to catch. Removing blue bars removes verticals, so a search restricted to the vertical items gets easier exactly as the candidate count rises. Your hands say you were hunting for a vertical thing and checking its colour, rather than for an orange thing and checking its orientation. Both are guidance. This one picked the larger subset.',
  },
  neither: {
    head: 'Neither committed number can be excluded from this session.',
    tone: 'text-slate-300',
    body:
      'Your search costs something per item and your interval on the leak covers both zero and one, so it does not exclude either account. That is a statement about how many displays one person can sit through, not about attention. The two slopes are below with their intervals and both are pointing somewhere.',
  },
  flat: {
    head: 'No cost per candidate to divide up.',
    tone: 'text-slate-300',
    body:
      'The cost of a bar that could have been the target did not clear zero, so there is no denominator and the ratio was not formed. A ratio with a denominator near zero is not an imprecise answer, it is a different question, so it is refused rather than printed wide. The usual cause is a session fast enough that the display was being taken in at a glance. The slopes themselves are still yours.',
  },
  reversed: {
    head: 'A fuller screen made you faster.',
    tone: 'text-rose-300',
    body:
      'That is not something a search does, so it is something this session did. The usual cause is a strategy that answers on the look of the display rather than on finding anything in it. Nothing below should be read as a result.',
  },
  thin: {
    head: 'Too few surviving trials to score it.',
    tone: 'text-rose-300',
    body:
      'After dropping errors and anything outside the response window, one of the five cells the slopes are built from came in under the floor. Everything below is descriptive.',
  },
};

function RivalRow({
  name, claim, committed, observed, ci, excluded,
}: {
  name: string;
  claim: string;
  committed: string;
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
          <div className="text-slate-300">{committed}</div>
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
  const { scored: s, err, checks: c, quality } = res;
  const sl = s.slopes;
  const copy = VERDICT_COPY[s.verdict];
  const line = `a bar that could not have been the target cost me ${(sl.leak * 100).toFixed(0)} percent of what a candidate cost. visiting everything says 100, perfect guidance says 0. what-it-cannot-be, wiz.jock.pl`;

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

      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-6 text-center">
        <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-cyan-300">your leak</div>
        <div className="font-mono text-4xl font-bold text-slate-50">{num(sl.leak)}</div>
        <div className="mt-2 font-mono text-xs text-slate-400">{rangeOf(s.boot.leak[0], s.boot.leak[1], 'raw')}</div>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          What a bar of the wrong colour cost you, as a share of what a bar that could have been the
          target cost you. Zero is a perfect filter. One is no filter at all. It is a ratio of two
          slopes, so every constant in your hardware and your hand cancels twice over, and a
          visitor who is simply slower everywhere lands on the same number.
        </p>
      </div>

      <div className="space-y-3">
        <RivalRow
          name="visit everything"
          claim="A conjunction is checked item by item, so a blue bar costs what an orange one costs."
          committed="leak = 1.00"
          observed={num(sl.leak)}
          ci={rangeOf(s.boot.leak[0], s.boot.leak[1], 'raw')}
          excluded={s.excludedEverything}
        />
        <RivalRow
          name="colour guidance"
          claim="Colour is available across the whole display at once, so the blue bars are never candidates and cost nothing."
          committed="leak = 0.00"
          observed={num(sl.leak)}
          ci={rangeOf(s.boot.leak[0], s.boot.leak[1], 'raw')}
          excluded={s.excludedPerfect}
        />
        <RivalRow
          name="the wrong dimension"
          claim="Guiding on vertical instead of orange. Adding orange bars removes verticals, so the screen full slope comes out negative."
          committed="screen full slope below 0"
          observed={msPerItem(sl.slopeFull)}
          ci={rangeOf(s.boot.slopeFull[0], s.boot.slopeFull[1], 'ms')}
          excluded={Number.isFinite(s.boot.slopeFull[0]) && s.boot.slopeFull[0] > 0}
        />
      </div>

      <Panel title="the two slopes the leak is made of">
        <Row
          label="screen held full at 24, orange going 3, 6, 12"
          value={msPerItem(sl.slopeFull)}
          note={`${rangeOf(s.boot.slopeFull[0], s.boot.slopeFull[1], 'ms')}. This is a candidate minus a rejection, and no item was added or removed to get it`}
        />
        <Row
          label="orange held at 3, screen filling 6, 12, 24"
          value={msPerItem(sl.slopeCand)}
          note={`${rangeOf(s.boot.slopeCand[0], s.boot.slopeCand[1], 'ms')}. Every bar added here was blue`}
        />
        <Row
          label="so one bar that could have been the target cost you"
          value={msPerItem(sl.candMs)}
          note={rangeOf(s.boot.candMs[0], s.boot.candMs[1], 'ms')}
        />
        <Row
          label="and one bar of the wrong colour cost you"
          value={msPerItem(sl.rejectMs)}
          note="the second slope, unchanged, sitting in the numerator of the leak"
        />
      </Panel>

      <Panel title="the confound, priced rather than argued about">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          A fuller screen is not only more to search. It is more to look at, more contrast, more
          crowding, and none of that is attention visiting anything. Note which slope it can reach:
          only the second one, where bars were actually added. So one in eight of your trials was a
          single orange bar among blue ones, at the same three totals, with no conjunction to search
          at all. Whatever that slope is, it is the price of the display.
        </p>
        <Row label="display price, from the pop-out trials" value={msPerItem(sl.slopePop)} note={rangeOf(s.boot.slopePop[0], s.boot.slopePop[1], 'ms')} />
        <Row label="your leak with that price taken off both sides" value={num(sl.leakCorr)} note={rangeOf(s.boot.leakCorr[0], s.boot.leakCorr[1], 'raw')} />
        <Row label="your leak with it left in" value={num(sl.leak)} note="the headline, and the conservative one: leaving the display price in pushes the leak UP, away from the account that predicted zero" />
        <Row label="a single orange bar among 24" value={`${c.popMs.toFixed(0)} ms`} note={`against ${c.hardMs.toFixed(0)} ms for 12 orange bars among 24, which is the difference this whole page rests on`} />
      </Panel>

      <Panel title="second window: misses, with no millisecond anywhere in it">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          A target that was there and got called absent is a search that stopped too early. If
          attention visits everything, that should get more likely as the screen fills. If it visits
          candidates, it should track the candidates and ignore the rest. Same two comparisons, a
          currency the headline never touches, and underpowered, which is said rather than implied.
        </p>
        <Row label="misses at 3, 6, 12 orange with the screen full" value={err.missFull.map((v) => pctOf(v, 0)).join(' , ')} />
        <Row label="misses at 6, 12, 24 items with orange held at 3" value={err.missCand.map((v) => pctOf(v, 0)).join(' , ')} />
        <Row label="miss rate per candidate added" value={pctOf(err.slopeMissFull, 2)} note={rangeOf(err.ciMissFull[0], err.ciMissFull[1], 'pct', 2)} />
        <Row label="miss rate per rejectable bar added" value={pctOf(err.slopeMissCand, 2)} note={rangeOf(err.ciMissCand[0], err.ciMissCand[1], 'pct', 2)} />
        <Row label="false alarms at 3, 6, 12 orange" value={err.faFull.map((v) => pctOf(v, 0)).join(' , ')} note={`${err.nMiss} misses in total, which is what these rates are built from`} />
      </Panel>

      <Panel title="the bonus that cost nothing extra">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          Half your displays had no target in them. A search that inspects candidates one at a time
          and stops the moment it finds one has to inspect all of them when there is nothing there,
          and on average half of them when there is. That is a slope ratio of exactly 2, and nobody
          fitted it. Across very large datasets it comes in well under 2, which is one of the
          reasons the one at a time story was in trouble before this page existed.
        </p>
        <Row
          label="the same leak, computed on the trials with nothing to find"
          value={num(sl.leakAbs)}
          note={`${rangeOf(s.boot.leakAbs[0], s.boot.leakAbs[1], 'raw')}. Same two committed values, a different half of your session, and a search that cannot stop early`}
        />
        <Row label="screen full slope, target absent" value={msPerItem(sl.slopeFullAbs)} />
        <Row label="screen full slope, target present" value={msPerItem(sl.slopeFull)} />
        <Row
          label="ratio, which serial self terminating search puts at 2.00"
          value={num(sl.absRatio)}
          note={`${rangeOf(s.boot.absRatio[0], s.boot.absRatio[1], 'raw')}. Meaningless when the present slope sits near zero, which is what near complete guidance looks like, so read it against that slope above`}
        />
      </Panel>

      <Panel title="what this session had to pass first">
        <Row label="the target drill" value={pctOf(c.drill.acc, 0)} note={`${pctOf(c.drill.accColour, 0)} on rejecting a blue vertical, ${pctOf(c.drill.accOrient, 0)} on rejecting an orange horizontal`} />
        <Row label="scored accuracy" value={pctOf(c.acc, 0)} note="chance is fifty here, not twenty five" />
        <Row label="yes share" value={pctOf(c.yesShare, 0)} note="the design asks for about 57, because the pop-out trials always contain the target" />
        <Row label="answers too fast to be searches" value={pctOf(c.fastShare, 1)} />
        <Row label="trials with the tab away" value={pctOf(c.hiddenShare, 1)} />
        <Row label="trials that ran out" value={pctOf(c.missShare, 1)} />
        <Row label="spread inside a single cell" value={`${c.rtSd.toFixed(0)} ms`} note="a hand searching displays that differ trial to trial is not regular, and a machine is" />
        <Row label="your screen refresh" value={`${c.frameMs.toFixed(1)} ms`} note="recorded, not corrected for: the same quantisation lands on every cell and cancels in a slope" />
        <Row label="trials surviving into the slopes" value={`${c.nUsable} of ${c.nScored}`} note={`smallest cell ${s.minCell}, floor is ${MIN_CELL}`} />
        <Row label="bootstrap draws thrown out" value={pctOf(s.boot.dropped, 1)} note="draws where the cost per candidate came out too small to carry a ratio" />
      </Panel>

      <Panel title="what the simulation said before this shipped">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          The analysis above was extracted from this page and run in Node against simulated visitors
          whose truth was known, in seven worlds. These are measured rates, not claims.
        </p>
        {SIM_ROWS.map(([label, value, note]) => (
          <Row key={label} label={label} value={value} note={note || undefined} />
        ))}
      </Panel>

      <Panel title="what this cannot tell you">
        <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            One person, one sitting. Every rate above is the rate at which a session like yours
            reaches the right answer, and a leak between zero and one is the easiest of the three
            outcomes to land on for the wrong reason.
          </li>
          <li>
            A leak is not a mechanism. It says a bar you could rule out on colour cost you less than
            one you could not, and it puts a number on how much less. It does not say whether
            attention went to a ranked list, to a colour segmented map, or somewhere no model on
            this page has thought of. Wolfe changed his own answer to that question twice.
          </li>
          <li>
            Orange was always the smaller subset here, by construction, because a guidance account
            gets to choose the useful feature and this page had to stop it choosing the other one.
            That makes the design a fair test of whether guidance happens and a poor one for asking
            what happens when both subsets are the same size.
          </li>
          <li>
            Eccentricity is equated on average and not item by item, and the target is drawn from a
            ring at random rather than balanced within a session. Over 24 trials a cell can still
            come out with more outer ring targets than inner, and that is noise this page carries
            rather than removes.
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
        Treisman and Gelade, Cognitive Psychology 12, 97, 1980. Egeth, Virzi and Garbart, Journal of
        Experimental Psychology Human Perception and Performance 10, 32, 1984. Wolfe, Cave and
        Franzel, same journal 15, 419, 1989. Wolfe, Psychonomic Bulletin and Review 1, 202, 1994.
        Townsend, Psychological Science 1, 46, 1990. Wolfe, Psychological Science 9, 33, 1998. Wolfe
        and Horowitz, Nature Reviews Neuroscience 5, 495, 2004.
      </p>
    </div>
  );
}
