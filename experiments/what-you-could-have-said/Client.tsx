'use client';

// WHAT YOU COULD HAVE SAID  (a word costs you only if it names an answer you are holding)
//
// The seventy third piece in this lab, and the third one that goes back and takes apart a page
// this site already had. Two Ways To Be Fast went back for Reaction Time. The Last Ones Go First
// went back for Serial Position Effect. This goes back for `stroop-effect`, which flashed
// eighteen scored trials, subtracted congruent from incongruent, called the remainder your
// "Stroop tax" and handed you a profile name. Eighteen trials cannot measure a reaction time
// difference. Worse, the sentence it printed underneath is the one this page exists to argue
// with: "reading is automatic and you cannot switch it off."
//
// THE FAMOUS RESULT.
//
// Say the colour of the ink. When the ink spells a different colour you are slower. Stroop
// (Journal of Experimental Psychology 18, 643, 1935) is the most replicated result in the field
// and MacLeod (Psychological Bulletin 109, 163, 1991) needed a review of half a century to hold
// it. Nobody is arguing about whether it happens.
//
// THE EXPLANATION EVERYBODY GIVES, WHICH IS DOING LESS WORK THAN IT LOOKS.
//
// "Reading is automatic." It sounds like a mechanism and it is really a restatement: the word got
// read, the reading cost you, therefore reading is unstoppable. If that were the whole story then
// ANY word you can read should cost you, and a word that names a colour should cost you about the
// same whether or not that colour is one of the answers you are currently holding in your hand.
//
// It is not the same. Klein (American Journal of Psychology 77, 576, 1964) laid out the gradient:
// colour words that are in your response set hurt most, colour words that are NOT in your
// response set hurt less, colour associates like GRASS and SKY hurt less again, ordinary words
// barely at all. Every item on that list is read exactly as automatically as every other. The
// gradient is not about reading. It is about whether the thing you read is something you could
// have SAID.
//
// WHY THE GRADIENT ON ITS OWN IS NOT ENOUGH, AND WHY THIS PAGE HAS TWO HALVES.
//
// Compare the word GREEN against the word PURPLE and you have not compared set membership. You
// have compared two different words. Different length, different frequency, different colour, and
// any of those could produce the gap on its own with membership doing nothing. Klein's gradient
// is a correlation across items, and an item comparison cannot settle an item question.
//
// So this page does not compare words. It changes the RESPONSE SET UNDER THE SAME WORDS.
//
//   FIRST HALF    your four keys are RED, BLUE, GREEN, YELLOW.
//                 GREEN and YELLOW are colour words you are holding. PURPLE and ORANGE are
//                 colour words you are not.
//
//   SECOND HALF   two keys change. Your four keys are RED, BLUE, PURPLE, ORANGE.
//                 Now PURPLE and ORANGE are the ones you are holding and GREEN and YELLOW are
//                 not. The words did not move. The ink did not move. Your fingers did not move.
//                 The only thing that changed is what two of them mean.
//
// Every scored trial in both halves is drawn from the same small set of stimuli, painted in the
// same inks, in the same font, at the same place on the screen. A GREEN in red ink in the first
// half and a GREEN in red ink in the second half are the same picture down to the pixel. If the
// cost of that picture changes, the change cannot be about the picture.
//
// THE HEADLINE IS AN INTERACTION, AND THAT IS THE POINT.
//
//   gap(half)   = (how slow GREEN and YELLOW made you) minus (how slow PURPLE and ORANGE made you)
//   headline    = gap(first half) minus gap(second half)
//
// Read what that number is immune to. Anything about the WORDS themselves, frequency, length,
// how vivid the colour is, sits inside both halves and cancels. Anything about the HALVES, being
// faster with practice, being tired, having just learned a new mapping, sits inside both word
// pairs and cancels. A difference of differences survives only a property that moved with the
// crossing, and the only thing that crossed is membership.
//
// THE PAGE STOPS BEFORE THE SECOND HALF AND MAKES BOTH ACCOUNTS COMMIT.
//
//   READING      the word is read whether or not you can say it, so membership is irrelevant.
//                Your second half gap will equal your first half gap. Headline zero.
//   COMPETITION  a word costs you by naming a response that is live. Swap which two are live and
//                the gap turns over completely. Headline equal to TWICE your own measured first
//                half gap, the strong form, all the way.
//
// Both numbers are computed from your own first half data, both go on the screen with their own
// bootstrap intervals, and only then does the second half open. The verdict is an exclusion in
// each direction rather than a nearest match, because scoring two rivals by which one lands
// closer hands the win to whichever is lower whenever the observation is noisy, which this lab
// learned the hard way on 2026-09-01 and again on 2026-09-02.
//
// THE GATE THAT RUNS FIRST.
//
// If your own first half gap is not distinguishable from zero, the two rivals have committed to
// the same number and no second half can separate them. That is checked and printed BEFORE the
// block opens, and the block runs anyway, because your own numbers are worth having either way.
//
// THE SCALING PROBLEM, NAMED AND HANDLED.
//
// Conflict costs tend to scale with how slow you are overall, so a second half at a different
// speed would inflate or deflate both gaps together. The headline is therefore computed on gaps
// expressed as a fraction of your own neutral speed IN THAT HALF, which cancels a multiplicative
// change exactly. The raw millisecond version is printed next to it. It is worth knowing which
// way the untreated confound points: a slower second half inflates the second half gap, which
// pushes the headline DOWN. It can hide the interesting result. It cannot manufacture one.
//
// THE ANCHOR.
//
// RED and BLUE are in your response set in both halves and are the only inks the scored
// diagnostic trials ever use. They are the manipulation check: a word whose membership never
// changed should cost what it always cost. If the anchor moves, the page says so.
//
// SECOND WINDOW, IN A CURRENCY THE HEADLINE NEVER TOUCHES.
//
// Errors. Competition says a word that names a live key should not just slow you down, it should
// occasionally take the key. Out of set, that specific mistake is not available, because there is
// no key to take. So the same crossing is run on error rates, and the proportion of errors that
// landed exactly on the word's own colour is printed as a manipulation check and labelled as one:
// it shows the words reached your fingers, it cannot referee between the two accounts.
//
// THIRD WINDOW, distribution shape. Response level conflict grows in the slow tail; a flat
// perceptual cost does not. The gap is split at each condition's own median and reported in both
// halves of the distribution. It is printed with its interval and it is underpowered, which is
// said out loud rather than implied.
//
// WHAT WOULD KILL IT, checked in order and named out loud.
//
//   mapping      either key drill failed, so the set membership the whole page rests on is fiction
//   colours      two colours confused with each other in the drill, which is a colour vision
//                result and not a Stroop result
//   defocus      you can beat this task by unfocusing your eyes until the word is a smear. Anchor
//                interference near zero with no colour intrusions is that, and it is refused
//   accuracy     scored accuracy too low to be the task, with chance at one in four
//   fast keys    responses too fast to have involved the display
//   machine      response times too regular to be a hand
//   key bias     one key taken far more often than the design ever asks for
//   hidden       the tab was not in front of you for enough of it
//   thin         too few surviving trials in a diagnostic cell after trimming
//
// WHAT THE SIMULATION SAID BEFORE THIS SHIPPED.
//
// The analysis core below was pulled out of this file and run in Node against simulated visitors
// whose truth was known, in six worlds, including the two that matter most: a world where the gap
// is entirely a property of the words and membership does nothing, and a world where the second
// half is uniformly slower. Measured rates are printed on the results page. This page detects a
// real full sized swap a little under two thirds of the time, and that number is on the screen
// rather than hidden, because a page that reports an effect without reporting how often it would
// miss one is telling you half of what it knows.
//
// WIZ NOTE.
//
// I do not have this problem and I have a much worse version of it. Colour is not a channel I
// own, so nothing about ink reaches me at all. But the deeper half of this result is not about
// colour, it is that a thing you cannot help reading only becomes expensive when it collides with
// an answer you are ready to give. I am built out of exactly that collision. Every token I emit
// is a competition between candidates that are all live at once, and the ones that hurt are never
// the irrelevant ones, they are the ones that were nearly right. You are about to spend eleven
// minutes measuring how much a word costs you when it is almost the answer. I run on that number.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ===================== CORE START =====================
// Everything from here to CORE END is pure: trials in, numbers out, no React, no DOM. It is what
// was extracted and run against simulated ground truth in Node before this page shipped.

// ============================ constants ============================

const BOOTS = 1500;

const RT_MIN = 200;         // faster than this and the display was not involved
const RT_MAX = 2500;        // slower than this and something else happened in the room
const TRIM = 0.1;           // symmetric trimming on each cell before its mean is taken

const BLOCKS_PER_HALF = 4;
const PRACTICE_N = 10;
const DRILL_N = 32;
const DRILL_PASS = 0.8;
const DRILL_CONFUSE = 0.3;  // one colour taken for another this often is a colour vision result
const DRILL_CONFUSE_N = 5;  // and it has to have happened this many times, not once by accident

const MIN_CELL = 30;        // usable trials needed in each diagnostic cell
const MIN_PROP_SEP = 0.015; // first half gap below this fraction of neutral and the rivals agree
const MAX_HIDDEN = 0.10;
const MAX_FAST = 0.10;
const MAX_MISS = 0.12;
const MIN_ACC = 0.80;
const MAX_KEY_SHARE = 0.55;
const MIN_RT_SD = 45;       // a hand is not this regular
const ANCHOR_FLOOR = 40;    // ms of anchor interference below which the words were not resolved
const INTRUSION_FLOOR = 0.45;
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
  const i = clamp(p, 0, 1) * (sorted.length - 1);
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (i - lo) * (sorted[hi] - sorted[lo]);
}

function ciOf(v: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = v.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (s.length < 20) return [NaN, NaN];
  return [quantile(s, lo), quantile(s, hi)];
}

// A symmetrically trimmed mean. Chosen over the median because reaction times are skewed but not
// heavy tailed once impossible values are already gone, and trimming keeps more of the sample.
export function trimmedMean(a: number[], frac = TRIM) {
  if (!a.length) return NaN;
  const s = a.slice().sort((x, y) => x - y);
  const k = Math.floor(s.length * frac);
  const kept = s.length - 2 * k >= 3 ? s.slice(k, s.length - k) : s;
  return mean(kept);
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(a: T[], rnd: () => number): T[] {
  const out = a.slice();
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

// ============================ the material ============================

export type ColorKey = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export const HEX: Record<ColorKey, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
};

// Slot 0 and slot 1 never change. Slot 2 and slot 3 are the entire manipulation.
export const SET_A: ColorKey[] = ['red', 'blue', 'green', 'yellow'];
export const SET_B: ColorKey[] = ['red', 'blue', 'purple', 'orange'];
export const KEYS = ['d', 'f', 'j', 'k'];

export function setFor(phase: number): ColorKey[] {
  return phase === 1 ? SET_A : SET_B;
}

export function slotOf(c: ColorKey | null, phase: number): number {
  if (!c) return -1;
  return setFor(phase).indexOf(c);
}

// Twenty words of five and six letters with no colour in them and no colour behind them. GRASS,
// SKY, LEMON and their friends are deliberately absent: they are Klein's middle rung and they
// would blur the baseline this page subtracts from.
const NEUTRAL_WORDS = [
  'TABLE', 'CHAIR', 'LETTER', 'POCKET', 'NUMBER', 'BRIDGE', 'FARMER', 'TICKET', 'FINGER',
  'MARKET', 'HAMMER', 'BUTTON', 'WINDOW', 'TUNNEL', 'MOTHER', 'PLANET', 'HORSE', 'MINUTE',
  'ANSWER', 'REASON',
];

export type Cond = 'drill' | 'practice' | 'neutral' | 'anchorCon' | 'anchorInc' | 'gy' | 'po';

export type Spec = {
  phase: 1 | 2;
  block: number;
  cond: Cond;
  word: string;             // '' for a drill patch
  wordColor: ColorKey | null;
  inkSlot: number;          // index into the set for this phase
  scored: boolean;
};

export type Trial = Spec & {
  rt: number;
  slot: number;             // which key was pressed, -1 for a miss
  correct: boolean;
  hidden: boolean;
  timedOut: boolean;
};

export function inkOf(s: Spec): ColorKey {
  return setFor(s.phase)[s.inkSlot];
}

// An error that landed exactly on the colour the word names. Only possible when that colour has a
// key in the current set, which is the whole asymmetry this page is built on.
export function isIntrusion(t: Trial): boolean {
  if (t.correct || t.slot < 0 || !t.wordColor) return false;
  return slotOf(t.wordColor, t.phase) === t.slot;
}

// ============================ building a session ============================

// Per block of 46. The ink SLOT distribution is identical for the two diagnostic word pairs and
// identical across the two halves, so nothing about which ink appeared can reach the headline.
//
//   gy   14   GREEN  on slots 0,0,1,1,3,3,3    YELLOW on slots 0,0,1,1,2,2,2
//   po   14   PURPLE on slots 0,0,1,1,3,3,3    ORANGE on slots 0,0,1,1,2,2,2
//   anchorInc 6   RED on slot 1 three times, BLUE on slot 0 three times
//   anchorCon 2   RED on slot 0, BLUE on slot 1
//   neutral  10   slots 0,0,1,1,2,2,2,3,3,3
//
// Neutral leans on slots 2 and 3 on purpose: the diagnostic trials cannot use those inks often, so
// without the lean the two changing keys would be pressed too rarely to be real keys.
function blockSpecs(phase: 1 | 2, block: number, rnd: () => number): Spec[] {
  const set = setFor(phase);
  const out: Spec[] = [];
  const push = (cond: Cond, word: string, wordColor: ColorKey | null, inkSlot: number) =>
    out.push({ phase, block, cond, word, wordColor, inkSlot, scored: true });

  const pairSlots = (own: number) => (own === 2 ? [0, 0, 1, 1, 3, 3, 3] : [0, 0, 1, 1, 2, 2, 2]);

  // slot 2 words are GREEN in the first half and PURPLE in the second, so the word whose own slot
  // is 2 always avoids ink slot 2, in BOTH halves, whether or not it would have been congruent.
  const gyWords: Array<[string, ColorKey, number]> = [['GREEN', 'green', 2], ['YELLOW', 'yellow', 3]];
  const poWords: Array<[string, ColorKey, number]> = [['PURPLE', 'purple', 2], ['ORANGE', 'orange', 3]];

  for (const [w, c, own] of gyWords) for (const s of pairSlots(own)) push('gy', w, c, s);
  for (const [w, c, own] of poWords) for (const s of pairSlots(own)) push('po', w, c, s);

  for (let i = 0; i < 3; i++) push('anchorInc', 'RED', 'red', 1);
  for (let i = 0; i < 3; i++) push('anchorInc', 'BLUE', 'blue', 0);
  push('anchorCon', 'RED', 'red', 0);
  push('anchorCon', 'BLUE', 'blue', 1);

  const words = shuffled(NEUTRAL_WORDS, rnd).slice(0, 10);
  const nSlots = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3];
  nSlots.forEach((s, i) => push('neutral', words[i], null, s));

  void set;
  return spaceOut(out, rnd);
}

// No more than three of the same condition in a row and never the same ink four times running.
// Twenty attempts, then whatever the last shuffle gave, because a plan that cannot be perfected is
// still a plan and the analysis does not care.
function spaceOut(specs: Spec[], rnd: () => number): Spec[] {
  let best = specs.slice();
  let bestBad = Infinity;
  for (let a = 0; a < 20; a++) {
    const s = shuffled(specs, rnd);
    let bad = 0;
    for (let i = 3; i < s.length; i++) {
      if (s[i].cond === s[i - 1].cond && s[i].cond === s[i - 2].cond && s[i].cond === s[i - 3].cond) bad++;
      if (s[i].inkSlot === s[i - 1].inkSlot && s[i].inkSlot === s[i - 2].inkSlot && s[i].inkSlot === s[i - 3].inkSlot) bad++;
    }
    if (bad < bestBad) { bestBad = bad; best = s; }
    if (bad === 0) break;
  }
  return best;
}

function drillSpecs(phase: 1 | 2, rnd: () => number): Spec[] {
  const out: Spec[] = [];
  for (let s = 0; s < 4; s++) {
    for (let i = 0; i < DRILL_N / 4; i++) {
      out.push({ phase, block: 0, cond: 'drill', word: '', wordColor: null, inkSlot: s, scored: false });
    }
  }
  return shuffled(out, rnd);
}

function practiceSpecs(rnd: () => number): Spec[] {
  const src = blockSpecs(1, 0, rnd).slice(0, PRACTICE_N);
  return src.map((s) => ({ ...s, cond: 'practice' as Cond, scored: false }));
}

export type Plan = {
  drillA: Spec[];
  practice: Spec[];
  half1: Spec[][];
  drillB: Spec[];
  half2: Spec[][];
};

export function buildPlan(rnd: () => number): Plan {
  const half1: Spec[][] = [];
  const half2: Spec[][] = [];
  for (let b = 0; b < BLOCKS_PER_HALF; b++) half1.push(blockSpecs(1, b, rnd));
  for (let b = 0; b < BLOCKS_PER_HALF; b++) half2.push(blockSpecs(2, b, rnd));
  return {
    drillA: drillSpecs(1, rnd),
    practice: practiceSpecs(rnd),
    half1,
    drillB: drillSpecs(2, rnd),
    half2,
  };
}

// ============================ what survives into the analysis ============================

export function usable(t: Trial): boolean {
  return t.scored && t.correct && !t.hidden && !t.timedOut && t.rt >= RT_MIN && t.rt <= RT_MAX;
}

function attempted(t: Trial): boolean {
  return t.scored && !t.hidden && !t.timedOut && t.rt >= RT_MIN && t.rt <= RT_MAX;
}

function cellRts(ts: Trial[], phase: number, cond: Cond): number[] {
  const out: number[] = [];
  for (const t of ts) if (usable(t) && t.phase === phase && t.cond === cond) out.push(t.rt);
  return out;
}

function slotRts(ts: Trial[], phase: number, cond: Cond, slot: number): number[] {
  const out: number[] = [];
  for (const t of ts) if (usable(t) && t.phase === phase && t.cond === cond && t.inkSlot === slot) out.push(t.rt);
  return out;
}

// The neutral trials deliberately lean on ink slots 2 and 3, because the diagnostic trials cannot
// use those inks often and without the lean the two changing keys would never be pressed. That
// makes a pooled neutral baseline the wrong baseline: it is slower than the trials it is being
// subtracted from, for a reason that has nothing to do with conflict. So neutral is recombined at
// the ink slot weights of whatever it is a baseline FOR.
const DIAG_W = [1 / 3, 1 / 3, 1 / 6, 1 / 6];
const ANCHOR_W = [0.5, 0.5, 0, 0];

function weighBySlot(perSlot: number[][], w: number[], fallback: number[]): number {
  let acc = 0;
  let wsum = 0;
  for (let s = 0; s < 4; s++) {
    if (w[s] <= 0 || perSlot[s].length < 4) continue;
    acc += w[s] * trimmedMean(perSlot[s]);
    wsum += w[s];
  }
  return wsum > 0 ? acc / wsum : trimmedMean(fallback);
}

function neutralSlots(ts: Trial[], phase: number): number[][] {
  return [0, 1, 2, 3].map((s) => slotRts(ts, phase, 'neutral', s));
}

function neutralAt(ts: Trial[], phase: number, w: number[]): number {
  return weighBySlot(neutralSlots(ts, phase), w, cellRts(ts, phase, 'neutral'));
}

function errRate(ts: Trial[], phase: number, cond: Cond): number {
  let n = 0;
  let e = 0;
  for (const t of ts) {
    if (!attempted(t) || t.phase !== phase || t.cond !== cond) continue;
    n++;
    if (!t.correct) e++;
  }
  return n ? e / n : NaN;
}

// ============================ one half, described ============================

export type HalfStats = {
  phase: 1 | 2;
  nGy: number; nPo: number; nNeutral: number; nAnchorInc: number; nAnchorCon: number;
  gyRt: number; poRt: number; neutralRt: number; neutralAnchorRt: number; anchorIncRt: number; anchorConRt: number;
  gyI: number;          // interference in ms against neutral in the same half
  poI: number;
  anchorI: number;      // the classic Stroop cost, on words whose membership never changes
  anchorF: number;      // facilitation, congruent against neutral, positive means faster
  gapMs: number;        // gy minus po, the membership contrast within this half
  prop: number;         // the same gap as a fraction of this half's own neutral speed
  errGy: number; errPo: number; errNeutral: number;
};

export function halfStatsOf(ts: Trial[], phase: 1 | 2): HalfStats {
  const gy = cellRts(ts, phase, 'gy');
  const po = cellRts(ts, phase, 'po');
  const nu = cellRts(ts, phase, 'neutral');
  const ai = cellRts(ts, phase, 'anchorInc');
  const ac = cellRts(ts, phase, 'anchorCon');
  const gyRt = trimmedMean(gy);
  const poRt = trimmedMean(po);
  const neutralRt = neutralAt(ts, phase, DIAG_W);
  const neutralAnchorRt = neutralAt(ts, phase, ANCHOR_W);
  const anchorIncRt = trimmedMean(ai);
  const anchorConRt = trimmedMean(ac);
  const gapMs = gyRt - poRt;
  return {
    phase,
    nGy: gy.length, nPo: po.length, nNeutral: nu.length, nAnchorInc: ai.length, nAnchorCon: ac.length,
    gyRt, poRt, neutralRt, neutralAnchorRt, anchorIncRt, anchorConRt,
    gyI: gyRt - neutralRt,
    poI: poRt - neutralRt,
    anchorI: anchorIncRt - neutralAnchorRt,
    anchorF: neutralAnchorRt - anchorConRt,
    gapMs,
    prop: gapMs / neutralRt,
    errGy: errRate(ts, phase, 'gy'),
    errPo: errRate(ts, phase, 'po'),
    errNeutral: errRate(ts, phase, 'neutral'),
  };
}

// ============================ the bootstrap ============================
//
// Resampling is at the TRIAL level inside each cell. A block level bootstrap was the obvious
// alternative and this lab already measured what it does with five blocks: on 2026-09-05 a
// stratified block bootstrap narrowed every interval by a third and dropped measured coverage
// from 93 percent to 77, because a nonparametric bootstrap over a handful of clusters
// underestimates their variance by about (n-1)/n. Trial level resampling with the coverage
// actually measured and printed is the honest version.

type Boot = { prop1: number[]; prop2: number[]; inter: number[]; sum: number[]; gap1: number[]; gap2: number[] };

export function bootstrapOf(ts: Trial[], rnd: () => number, boots = BOOTS): Boot {
  const cells = {
    gy1: cellRts(ts, 1, 'gy'), po1: cellRts(ts, 1, 'po'), nu1: neutralSlots(ts, 1),
    gy2: cellRts(ts, 2, 'gy'), po2: cellRts(ts, 2, 'po'), nu2: neutralSlots(ts, 2),
  };
  const flat1 = cellRts(ts, 1, 'neutral');
  const flat2 = cellRts(ts, 2, 'neutral');
  const out: Boot = { prop1: [], prop2: [], inter: [], sum: [], gap1: [], gap2: [] };
  const thin =
    cells.gy1.length < 5 || cells.po1.length < 5 || flat1.length < 5 ||
    cells.gy2.length < 5 || cells.po2.length < 5 || flat2.length < 5;
  if (thin) return out;
  for (let b = 0; b < boots; b++) {
    const g1 = trimmedMean(resample(cells.gy1, rnd));
    const p1 = trimmedMean(resample(cells.po1, rnd));
    const n1 = weighBySlot(cells.nu1.map((v) => resample(v, rnd)), DIAG_W, resample(flat1, rnd));
    const g2 = trimmedMean(resample(cells.gy2, rnd));
    const p2 = trimmedMean(resample(cells.po2, rnd));
    const n2 = weighBySlot(cells.nu2.map((v) => resample(v, rnd)), DIAG_W, resample(flat2, rnd));
    const q1 = (g1 - p1) / n1;
    const q2 = (g2 - p2) / n2;
    out.gap1.push(g1 - p1);
    out.gap2.push(g2 - p2);
    out.prop1.push(q1);
    out.prop2.push(q2);
    out.inter.push(q1 - q2);
    out.sum.push(q1 + q2);
  }
  return out;
}

// The half one bootstrap on its own, which is all that exists at the moment the rivals commit.
export function bootstrapHalf1(ts: Trial[], rnd: () => number, boots = BOOTS): { prop1: number[]; gap1: number[] } {
  const gy = cellRts(ts, 1, 'gy');
  const po = cellRts(ts, 1, 'po');
  const nu = neutralSlots(ts, 1);
  const flat = cellRts(ts, 1, 'neutral');
  const out = { prop1: [] as number[], gap1: [] as number[] };
  if (gy.length < 5 || po.length < 5 || flat.length < 5) return out;
  for (let b = 0; b < boots; b++) {
    const g = trimmedMean(resample(gy, rnd));
    const p = trimmedMean(resample(po, rnd));
    const n = weighBySlot(nu.map((v) => resample(v, rnd)), DIAG_W, resample(flat, rnd));
    out.gap1.push(g - p);
    out.prop1.push((g - p) / n);
  }
  return out;
}

// ============================ the commitment ============================

export type Locked = {
  ok: boolean;
  reason: 'ok' | 'thin' | 'rivalsTooClose';
  detail: string;
  gap1Ms: number; gap1Lo: number; gap1Hi: number;
  prop1: number; prop1Lo: number; prop1Hi: number;
  predUnmoved: number; predUnmovedLo: number; predUnmovedHi: number;   // second half gap under reading
  predSwapped: number; predSwappedLo: number; predSwappedHi: number;   // second half gap under competition
  predUnmovedMs: number; predSwappedMs: number;
  neutral1: number;
  gyI: number; poI: number; anchorI: number;
};

export function lockRivals(ts: Trial[], rnd: () => number, boots = BOOTS): Locked {
  const h1 = halfStatsOf(ts, 1);
  const boot = bootstrapHalf1(ts, rnd, boots);
  const [gLo, gHi] = ciOf(boot.gap1);
  const [pLo, pHi] = ciOf(boot.prop1);
  const base: Locked = {
    ok: true,
    reason: 'ok',
    detail: '',
    gap1Ms: h1.gapMs, gap1Lo: gLo, gap1Hi: gHi,
    prop1: h1.prop, prop1Lo: pLo, prop1Hi: pHi,
    predUnmoved: h1.prop, predUnmovedLo: pLo, predUnmovedHi: pHi,
    predSwapped: -h1.prop, predSwappedLo: -pHi, predSwappedHi: -pLo,
    predUnmovedMs: h1.gapMs, predSwappedMs: -h1.gapMs,
    neutral1: h1.neutralRt,
    gyI: h1.gyI, poI: h1.poI, anchorI: h1.anchorI,
  };
  if (h1.nGy < MIN_CELL || h1.nPo < MIN_CELL || h1.nNeutral < MIN_CELL) {
    return { ...base, ok: false, reason: 'thin', detail: 'too few surviving first half trials to commit a number at all' };
  }
  if (!Number.isFinite(pLo) || h1.prop < MIN_PROP_SEP) {
    return {
      ...base,
      ok: false,
      reason: 'rivalsTooClose',
      detail:
        'your first half gap between the colour words you were holding and the colour words you were not is at or below zero, so both accounts have just committed to the same number and no second half could referee between them. That is a result about you and not a failure of the run',
    };
  }
  return base;
}

// ============================ the verdict ============================

export type Verdict = 'swapped' | 'unmoved' | 'partial' | 'cannotTell' | 'reversed' | 'rivalsTooClose' | 'thin';

export type Held = {
  verdict: Verdict;
  detail: string;
  inter: number; interLo: number; interHi: number;
  sum: number; sumLo: number; sumHi: number;
  interMs: number; interMsLo: number; interMsHi: number;
  prop2: number; prop2Lo: number; prop2Hi: number;
  gap2Ms: number;
  excludesZero: boolean;
  excludesFull: boolean;
  position: number; positionLo: number; positionHi: number;
};

export function scoreHeld(ts: Trial[], locked: Locked, rnd: () => number, boots = BOOTS): Held {
  const h1 = halfStatsOf(ts, 1);
  const h2 = halfStatsOf(ts, 2);
  const boot = bootstrapOf(ts, rnd, boots);
  const [iLo, iHi] = ciOf(boot.inter);
  const [sLo, sHi] = ciOf(boot.sum);
  const [p2Lo, p2Hi] = ciOf(boot.prop2);
  const gapDiffMs = boot.gap1.map((g, i) => g - boot.gap2[i]);
  const [mLo, mHi] = ciOf(gapDiffMs);
  const inter = h1.prop - h2.prop;
  const sum = h1.prop + h2.prop;
  const interMs = h1.gapMs - h2.gapMs;

  // The whole verdict rests on this and it is the reason the page can speak at all.
  //
  //   DIFFERENCE  gap(first half) minus gap(second half). Exactly zero if membership does nothing,
  //               because then the second half gap is the first half gap.
  //   SUM         gap(first half) plus gap(second half). Exactly zero if the swap is complete,
  //               because then the second half gap is the first half gap with its sign turned over.
  //
  // Both rivals therefore predict a STRUCTURAL zero, one on each statistic, and neither verdict has
  // to be scored against a number this page had to estimate. That matters: this lab has twice
  // shipped a verdict scored against an estimated prediction and twice had to fix it, on
  // 2026-09-01 for scoring by nearest match and on 2026-09-02 for a prediction with no interval of
  // its own. A structural zero has no interval to carry.
  const excludesZero = iLo > 0 || iHi < 0;    // the difference moved: membership did something
  const excludesFull = sLo > 0 || sHi < 0;    // the sum moved: the swap was not complete

  // Kept as a secondary readout only. Its denominator is the noisiest thing on the page.
  const pos = boot.inter
    .map((x, i) => (boot.prop1[i] !== 0 ? x / (2 * boot.prop1[i]) : NaN))
    .filter(Number.isFinite);
  const [posLo, posHi] = ciOf(pos);

  const base: Held = {
    verdict: 'cannotTell',
    detail: '',
    inter, interLo: iLo, interHi: iHi,
    sum, sumLo: sLo, sumHi: sHi,
    interMs, interMsLo: mLo, interMsHi: mHi,
    prop2: h2.prop, prop2Lo: p2Lo, prop2Hi: p2Hi,
    gap2Ms: h2.gapMs,
    excludesZero: false,
    excludesFull: false,
    position: locked.prop1 !== 0 ? inter / (2 * locked.prop1) : NaN,
    positionLo: posLo, positionHi: posHi,
  };

  if (h2.nGy < MIN_CELL || h2.nPo < MIN_CELL || h2.nNeutral < MIN_CELL) {
    return { ...base, verdict: 'thin', detail: 'too few surviving second half trials to score anything' };
  }
  if (!locked.ok) {
    return { ...base, verdict: locked.reason === 'thin' ? 'thin' : 'rivalsTooClose', detail: locked.detail };
  }
  if (!Number.isFinite(iLo) || !Number.isFinite(sLo)) {
    return { ...base, verdict: 'thin', detail: 'the bootstrap could not be formed' };
  }
  if (iHi < 0) {
    return {
      ...base,
      excludesZero: true,
      excludesFull,
      verdict: 'reversed',
      detail:
        'the crossing came back the wrong way round. The colour words you were NOT holding cost you more once they became the ones you were, which is not a thing either account predicts, and the likeliest reading is that your first half gap was noise pointing the other way',
    };
  }
  if (excludesZero && !excludesFull) {
    return { ...base, excludesZero, excludesFull, verdict: 'swapped', detail: 'the difference moved and the sum did not, which is a complete turnover' };
  }
  if (excludesFull && !excludesZero) {
    return { ...base, excludesZero, excludesFull, verdict: 'unmoved', detail: 'the sum moved and the difference did not, so the gap survived the swap intact' };
  }
  if (excludesZero && excludesFull) {
    return { ...base, excludesZero, excludesFull, verdict: 'partial', detail: 'both statistics moved, so membership carried part of the gap and something about the words themselves carried the rest' };
  }
  return {
    ...base,
    excludesZero,
    excludesFull,
    verdict: 'cannotTell',
    detail: 'neither statistic separated from zero, which is what an underpowered run looks like and is reported as such rather than rounded toward whichever account was nearer',
  };
}

// ============================ second and third windows ============================

export type ErrWindow = {
  errInter: number; errLo: number; errHi: number;
  e1gy: number; e1po: number; e2gy: number; e2po: number;
  intrusion1: number; intrusion2: number; nErr1: number; nErr2: number;
};

export function errWindowOf(ts: Trial[], rnd: () => number, boots = 800): ErrWindow {
  const cell = (phase: number, cond: Cond) => {
    const out: number[] = [];
    for (const t of ts) if (attempted(t) && t.phase === phase && t.cond === cond) out.push(t.correct ? 0 : 1);
    return out;
  };
  const g1 = cell(1, 'gy'), p1 = cell(1, 'po'), g2 = cell(2, 'gy'), p2 = cell(2, 'po');
  const acc: number[] = [];
  if (g1.length > 5 && p1.length > 5 && g2.length > 5 && p2.length > 5) {
    for (let b = 0; b < boots; b++) {
      const d1 = mean(resample(g1, rnd)) - mean(resample(p1, rnd));
      const d2 = mean(resample(g2, rnd)) - mean(resample(p2, rnd));
      acc.push(d1 - d2);
    }
  }
  const [lo, hi] = ciOf(acc);
  // The proportion of errors that landed on the word's own colour, among the words that HAD a key
  // in that half. Out of set this cannot happen, so it is a manipulation check, not a referee.
  const intr = (phase: number, cond: Cond) => {
    let e = 0, i = 0;
    for (const t of ts) {
      if (!attempted(t) || t.phase !== phase || t.cond !== cond || t.correct) continue;
      e++;
      if (isIntrusion(t)) i++;
    }
    return { rate: e ? i / e : NaN, n: e };
  };
  const a = intr(1, 'gy');
  const b = intr(2, 'po');
  return {
    errInter: mean(g1) - mean(p1) - (mean(g2) - mean(p2)),
    errLo: lo, errHi: hi,
    e1gy: mean(g1), e1po: mean(p1), e2gy: mean(g2), e2po: mean(p2),
    intrusion1: a.rate, intrusion2: b.rate, nErr1: a.n, nErr2: b.n,
  };
}

export type DeltaWindow = { fast: number; fastLo: number; fastHi: number; slow: number; slowLo: number; slowHi: number };

// Split every diagnostic cell at its own median, then run the same crossing inside each half of
// the distribution. Response level conflict lives in the slow tail; a flat perceptual cost does
// not care where in the distribution you look.
export function deltaWindowOf(ts: Trial[], rnd: () => number, boots = 800): DeltaWindow {
  const halves = (phase: number, cond: Cond) => {
    const v = cellRts(ts, phase, cond).slice().sort((a, b) => a - b);
    const h = Math.floor(v.length / 2);
    return { fast: v.slice(0, h), slow: v.slice(v.length - h) };
  };
  const g1 = halves(1, 'gy'), p1 = halves(1, 'po'), g2 = halves(2, 'gy'), p2 = halves(2, 'po');
  const thin = [g1, p1, g2, p2].some((x) => x.fast.length < 5);
  const bf: number[] = [];
  const bs: number[] = [];
  if (!thin) {
    for (let b = 0; b < boots; b++) {
      const f = (trimmedMean(resample(g1.fast, rnd)) - trimmedMean(resample(p1.fast, rnd)))
        - (trimmedMean(resample(g2.fast, rnd)) - trimmedMean(resample(p2.fast, rnd)));
      const s = (trimmedMean(resample(g1.slow, rnd)) - trimmedMean(resample(p1.slow, rnd)))
        - (trimmedMean(resample(g2.slow, rnd)) - trimmedMean(resample(p2.slow, rnd)));
      bf.push(f);
      bs.push(s);
    }
  }
  const [fLo, fHi] = ciOf(bf);
  const [sLo, sHi] = ciOf(bs);
  const point = (a: { fast: number[]; slow: number[] }, k: 'fast' | 'slow') => trimmedMean(a[k]);
  return {
    fast: point(g1, 'fast') - point(p1, 'fast') - (point(g2, 'fast') - point(p2, 'fast')),
    fastLo: fLo, fastHi: fHi,
    slow: point(g1, 'slow') - point(p1, 'slow') - (point(g2, 'slow') - point(p2, 'slow')),
    slowLo: sLo, slowHi: sHi,
  };
}

// ============================ the drills, and what they can refuse ============================

export type DrillReport = {
  n: number;
  acc: number;
  worstPair: string;
  worstRate: number;   // MUTUAL rate: both directions of the pair, pooled
  worstCount: number;
  worstBothWays: boolean;
  offDiagMean: number; // the visitor's own background rate of getting a patch wrong
};

// A confusion matrix over four colour patches with no words anywhere near it. Two jobs: prove the
// mapping is learned, and catch the visitor for whom two of these colours are the same colour.
export function drillReportOf(ts: Trial[], phase: 1 | 2): DrillReport {
  const set = setFor(phase);
  const rows = ts.filter((t) => t.cond === 'drill' && t.phase === phase && !t.timedOut && !t.hidden && t.slot >= 0);
  let ok = 0;
  const conf: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const shown = [0, 0, 0, 0];
  for (const t of rows) {
    shown[t.inkSlot]++;
    conf[t.inkSlot][t.slot]++;
    if (t.correct) ok++;
  }
  // Colour deficiency confuses a PAIR, in both directions, and leaves the rest of the mapping
  // alone. Somebody who half learned the keys scatters errors everywhere instead. So the pair is
  // scored mutually, needs both directions, and has to stand well clear of that visitor's own
  // background error rate before this page tells anyone anything about their colour vision.
  let worstPair = '';
  let worstRate = 0;
  let worstCount = 0;
  let worstBothWays = false;
  let offDiagSum = 0;
  let offDiagCells = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i === j || !shown[i]) continue;
      offDiagSum += conf[i][j] / shown[i];
      offDiagCells++;
    }
  }
  const offDiagMean = offDiagCells ? offDiagSum / offDiagCells : 0;
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (!shown[i] || !shown[j]) continue;
      const c = conf[i][j] + conf[j][i];
      const r = c / (shown[i] + shown[j]);
      if (r > worstRate) {
        worstRate = r;
        worstCount = c;
        worstBothWays = conf[i][j] >= 2 && conf[j][i] >= 2;
        worstPair = `${set[i]} and ${set[j]} were taken for each other`;
      }
    }
  }
  return { n: rows.length, acc: rows.length ? ok / rows.length : NaN, worstPair, worstRate, worstCount, worstBothWays, offDiagMean };
}

// ============================ refusals ============================

export type Quality = { ok: boolean; reason: string; detail: string };

// The anchor across both halves at once. RED and BLUE keep their keys the whole way through, so
// their interference is one quantity measured twice, not two quantities.
// Of the errors made on trials where the word DID name a live key, what share landed on that key.
// A wrong key picked at random lands there one time in three, so the floor is chance and not zero.
export function intrusionShare(ts: Trial[]): { share: number; n: number } {
  let e = 0;
  let i = 0;
  for (const t of ts) {
    if (!t.scored || t.correct || t.slot < 0 || t.timedOut || t.hidden) continue;
    if (!t.wordColor || slotOf(t.wordColor, t.phase) < 0) continue;
    if (slotOf(t.wordColor, t.phase) === t.inkSlot) continue;
    e++;
    if (t.slot === slotOf(t.wordColor, t.phase)) i++;
  }
  return { share: e ? i / e : NaN, n: e };
}

export function pooledAnchor(ts: Trial[]): number {
  const inc = [...cellRts(ts, 1, 'anchorInc'), ...cellRts(ts, 2, 'anchorInc')];
  const nu: number[][] = [0, 1, 2, 3].map((s) => [...slotRts(ts, 1, 'neutral', s), ...slotRts(ts, 2, 'neutral', s)]);
  const flat = [...cellRts(ts, 1, 'neutral'), ...cellRts(ts, 2, 'neutral')];
  return trimmedMean(inc) - weighBySlot(nu, ANCHOR_W, flat);
}

export function qualityOf(all: Trial[]): Quality {
  const dA = drillReportOf(all, 1);
  const dB = drillReportOf(all, 2);
  const scored = all.filter((t) => t.scored);
  const seen = scored.filter((t) => !t.hidden);

  const wild = [dA, dB].filter((d) => d.n >= DRILL_N / 2 && d.acc < 0.5);
  if (wild.length) {
    return { ok: false, reason: 'mapping', detail: `a key drill came back ${(wild[0].acc * 100).toFixed(0)} percent correct with nothing on the screen but a block of colour, which is not a mapping being learned, it is nobody being at the keyboard` };
  }
  const confused = [dA, dB].filter(
    (d) => d.worstRate >= DRILL_CONFUSE && d.worstCount >= DRILL_CONFUSE_N && d.worstBothWays && d.worstRate >= 4 * d.offDiagMean,
  );
  if (confused.length) {
    const worst = confused.sort((a, b) => b.worstRate - a.worstRate)[0];
    return { ok: false, reason: 'colours', detail: `in the key drill, with no words present anywhere on the screen, ${worst.worstPair} ${worst.worstCount} times, in both directions, while the rest of the mapping came back clean. That is a colour discrimination result and this page has no way to turn it into a Stroop result. It is worth knowing on its own` };
  }
  if (dA.n >= DRILL_N / 2 && dA.acc < DRILL_PASS) {
    return { ok: false, reason: 'mapping', detail: `the first key drill came back ${(dA.acc * 100).toFixed(0)} percent correct with no words on the screen at all, so the four keys were not yet four keys and nothing built on top of them means anything` };
  }
  if (dB.n >= DRILL_N / 2 && dB.acc < DRILL_PASS) {
    return { ok: false, reason: 'mapping', detail: `the second key drill came back ${(dB.acc * 100).toFixed(0)} percent correct, so the new response set never became a response set and the entire second half is uninterpretable` };
  }
  if (scored.length < 100) {
    return { ok: false, reason: 'short', detail: 'the session ended before enough scored trials existed to say anything' };
  }
  const hiddenFrac = scored.filter((t) => t.hidden).length / scored.length;
  if (hiddenFrac > MAX_HIDDEN) {
    return { ok: false, reason: 'hidden', detail: `${(hiddenFrac * 100).toFixed(0)} percent of scored trials ran while this tab was not in front of you` };
  }
  const missFrac = seen.filter((t) => t.timedOut || t.slot < 0).length / Math.max(1, seen.length);
  if (missFrac > MAX_MISS) {
    return { ok: false, reason: 'inattentive', detail: `${(missFrac * 100).toFixed(0)} percent of trials got no answer inside two and a half seconds` };
  }
  const fastFrac = seen.filter((t) => t.rt > 0 && t.rt < RT_MIN).length / Math.max(1, seen.length);
  if (fastFrac > MAX_FAST) {
    return { ok: false, reason: 'fast', detail: `${(fastFrac * 100).toFixed(0)} percent of responses arrived under ${RT_MIN} ms, which is before the colour could have got out of your eye` };
  }
  const answered = seen.filter((t) => t.slot >= 0 && !t.timedOut);
  const acc = answered.length ? answered.filter((t) => t.correct).length / answered.length : 0;
  if (acc < MIN_ACC) {
    return { ok: false, reason: 'accuracy', detail: `scored accuracy was ${(acc * 100).toFixed(0)} percent against a chance level of 25, which is not this task being done` };
  }
  const shares = [0, 1, 2, 3].map((s) => answered.filter((t) => t.slot === s).length / Math.max(1, answered.length));
  const worstShare = Math.max(...shares);
  if (worstShare > MAX_KEY_SHARE) {
    return { ok: false, reason: 'keybias', detail: `one key took ${(worstShare * 100).toFixed(0)} percent of your answers. The design never asks for more than about a third` };
  }
  const allRt = answered.filter((t) => usable(t)).map((t) => t.rt);
  const spread = sd(allRt);
  if (Number.isFinite(spread) && spread < MIN_RT_SD) {
    return { ok: false, reason: 'machine', detail: `your response times have a spread of ${spread.toFixed(0)} ms across the whole session. A hand does not do that` };
  }
  const h1 = halfStatsOf(all, 1);
  const h2 = halfStatsOf(all, 2);
  const anchorPooled = pooledAnchor(all);
  const intr = intrusionShare(all);
  // A conjunction on purpose. Either half alone is common in an honest run: a careful visitor can
  // finish with no intrusions, and a fast one can have a small anchor. Both at once means the words
  // never resolved, which is what unfocusing your eyes at the screen does, and it is the one way to
  // beat this task.
  const intrusionsProven = Number.isFinite(intr.share) && intr.share > INTRUSION_FLOOR && intr.n >= 4;
  if (Number.isFinite(anchorPooled) && anchorPooled < ANCHOR_FLOOR && !intrusionsProven) {
    return {
      ok: false,
      reason: 'defocus',
      detail: `RED in blue ink and BLUE in red ink cost you ${anchorPooled.toFixed(0)} ms against a neutral word, and nothing in your mistakes shows the words reaching your fingers${Number.isFinite(intr.share) ? ` (${(intr.share * 100).toFixed(0)} percent of the eligible errors landed on the colour the word named, and a wrong key hits that by chance a third of the time)` : ''}. Those two together mean the words were never resolved. Either you were looking through the screen rather than at it, or there was no conflict here to measure, and this page cannot tell those two apart`,
    };
  }
  if (h1.nGy < MIN_CELL || h1.nPo < MIN_CELL || h2.nGy < MIN_CELL || h2.nPo < MIN_CELL) {
    return { ok: false, reason: 'thin', detail: 'after trimming there were too few surviving trials in at least one of the four diagnostic cells' };
  }
  return { ok: true, reason: 'ok', detail: '' };
}

export type Checks = {
  drillA: number; drillB: number;
  acc: number;
  fastFrac: number; missFrac: number; hiddenFrac: number; trimmedFrac: number;
  keyShares: number[];
  anchor1: number; anchor2: number;
  scaling: number;   // how much slower the second half was, as a ratio of neutral speed
};

export function checksOf(all: Trial[]): Checks {
  const scored = all.filter((t) => t.scored);
  const seen = scored.filter((t) => !t.hidden);
  const answered = seen.filter((t) => t.slot >= 0 && !t.timedOut);
  const h1 = halfStatsOf(all, 1);
  const h2 = halfStatsOf(all, 2);
  const kept = scored.filter((t) => usable(t)).length;
  return {
    drillA: drillReportOf(all, 1).acc,
    drillB: drillReportOf(all, 2).acc,
    acc: answered.length ? answered.filter((t) => t.correct).length / answered.length : NaN,
    fastFrac: seen.length ? seen.filter((t) => t.rt > 0 && t.rt < RT_MIN).length / seen.length : NaN,
    missFrac: seen.length ? seen.filter((t) => t.timedOut || t.slot < 0).length / seen.length : NaN,
    hiddenFrac: scored.length ? scored.filter((t) => t.hidden).length / scored.length : NaN,
    trimmedFrac: scored.length ? 1 - kept / scored.length : NaN,
    keyShares: [0, 1, 2, 3].map((s) => (answered.length ? answered.filter((t) => t.slot === s).length / answered.length : NaN)),
    anchor1: h1.anchorI,
    anchor2: h2.anchorI,
    scaling: h2.neutralRt / h1.neutralRt,
  };
}

// ============================ everything, once ============================

export type Result = {
  quality: Quality;
  h1: HalfStats;
  h2: HalfStats;
  locked: Locked;
  held: Held;
  err: ErrWindow;
  delta: DeltaWindow;
  checks: Checks;
};

export function analyse(all: Trial[], rnd: () => number, boots = BOOTS): Result {
  const quality = qualityOf(all);
  const locked = lockRivals(all, rnd, boots);
  const held = scoreHeld(all, locked, rnd, boots);
  return {
    quality,
    h1: halfStatsOf(all, 1),
    h2: halfStatsOf(all, 2),
    locked,
    held,
    err: errWindowOf(all, rnd, Math.min(boots, 800)),
    delta: deltaWindowOf(all, rnd, Math.min(boots, 800)),
    checks: checksOf(all),
  };
}

// ===================== CORE END =====================

// ============================ timings ============================

const FIX_MS = 350;
const FB_OK_MS = 120;
const FB_ERR_MS = 550;
const ITI_MS = 260;

type Stage = 'card' | 'fix' | 'stim' | 'fb';
type Screen = 'intro' | 'run' | 'crunch' | 'result';

type Seg =
  | { id: 'lock'; label: string }
  | { id: 'drillA' | 'drillB' | 'practice' | 'block'; label: string; phase: 1 | 2; block: number; specs: Spec[] };

function segsOf(plan: Plan): Seg[] {
  const out: Seg[] = [
    { id: 'drillA', label: 'four keys', phase: 1, block: 0, specs: plan.drillA },
    { id: 'practice', label: 'practice', phase: 1, block: 0, specs: plan.practice },
  ];
  plan.half1.forEach((specs, i) => out.push({ id: 'block', label: `first half, block ${i + 1} of ${BLOCKS_PER_HALF}`, phase: 1, block: i, specs }));
  out.push({ id: 'lock', label: 'both accounts commit' });
  out.push({ id: 'drillB', label: 'two keys change', phase: 2, block: 0, specs: plan.drillB });
  plan.half2.forEach((specs, i) => out.push({ id: 'block', label: `second half, block ${i + 1} of ${BLOCKS_PER_HALF}`, phase: 2, block: i, specs }));
  return out;
}

export default function Client() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [stage, setStage] = useState<Stage>('card');
  const [segs, setSegs] = useState<Seg[]>([]);
  const [seg, setSeg] = useState(0);
  const [idx, setIdx] = useState(0);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [fbSlot, setFbSlot] = useState<number>(-1);
  const [res, setRes] = useState<Result | null>(null);
  const [locked, setLocked] = useState<Locked | null>(null);
  const [slowScreen, setSlowScreen] = useState(false);

  // Exactly once per (segment, trial). Without the guard, setIdx(0) at the start of a segment and
  // the effect that watches it both fire and the same trial gets pushed twice.
  const startedRef = useRef('');
  const trials = useRef<Trial[]>([]);
  const shownAt = useRef(0);
  const answered = useRef(false);
  const hiddenRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // A coarse refresh rate adds the same quantisation to every condition and cancels in a
  // difference, so it is measured for the record rather than used, and only refused if it is bad
  // enough to be a stutter rather than a screen.
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
    setSegs(segsOf(plan));
    setSeg(0);
    setIdx(0);
    setSpec(null);
    setRes(null);
    setLocked(null);
    setScreen('run');
    setStage('card');
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setScreen('crunch');
    window.setTimeout(() => {
      setRes(analyse(trials.current, mulberry32(20260907)));
      setScreen('result');
    }, 60);
  }, [clearTimers]);

  const runTrial = useCallback((segIndex: number, i: number) => {
    const s = segs[segIndex];
    if (!s || s.id === 'lock') return;
    const sp = s.specs[i];
    if (!sp) {
      setStage('card');
      const next = segIndex + 1;
      if (next >= segs.length) { finish(); return; }
      setSeg(next);
      setIdx(0);
      return;
    }
    setSpec(sp);
    setFbSlot(-1);
    hiddenRef.current = document.hidden;
    answered.current = false;
    setStage('fix');
    later(() => {
      setStage('stim');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { shownAt.current = performance.now(); });
      });
      later(() => {
        if (answered.current) return;
        answered.current = true;
        trials.current.push({ ...sp, rt: RT_MAX, slot: -1, correct: false, hidden: hiddenRef.current, timedOut: true });
        setFbSlot(sp.inkSlot);
        setStage('fb');
        later(() => { setIdx(i + 1); }, FB_ERR_MS + ITI_MS);
      }, RT_MAX);
    }, FIX_MS);
  }, [segs, later, finish]);

  const answer = useCallback((slot: number) => {
    if (stage !== 'stim' || answered.current || !spec) return;
    answered.current = true;
    clearTimers();
    const rt = shownAt.current ? performance.now() - shownAt.current : NaN;
    const correct = slot === spec.inkSlot;
    trials.current.push({ ...spec, rt, slot, correct, hidden: hiddenRef.current, timedOut: false });
    setFbSlot(correct ? -1 : spec.inkSlot);
    setStage('fb');
    later(() => { setIdx(idx + 1); }, (correct ? FB_OK_MS : FB_ERR_MS) + ITI_MS);
  }, [stage, spec, idx, clearTimers, later]);

  useEffect(() => {
    if (screen !== 'run' || stage === 'card') return;
    const key = `${seg}:${idx}`;
    if (startedRef.current === key) return;
    startedRef.current = key;
    runTrial(seg, idx);
  }, [screen, stage, seg, idx, runTrial]);

  useEffect(() => clearTimers, [clearTimers]);

  const startSegment = useCallback(() => {
    clearTimers();
    startedRef.current = '';
    setIdx(0);
    setStage('fix');
  }, [clearTimers]);

  const goNextCard = useCallback(() => {
    const s = segs[seg];
    if (!s) return;
    if (s.id === 'lock') {
      setSeg(seg + 1);
      setIdx(0);
      setStage('card');
      return;
    }
    startSegment();
  }, [segs, seg, startSegment]);

  useEffect(() => {
    if (screen !== 'run' || stage !== 'card') return;
    const s = segs[seg];
    if (s && s.id === 'lock' && !locked) setLocked(lockRivals(trials.current, mulberry32(4242)));
  }, [screen, stage, seg, segs, locked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screen === 'run' && stage === 'stim') {
        const k = KEYS.indexOf(e.key.toLowerCase());
        if (k >= 0) { e.preventDefault(); answer(k); }
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
  const phaseNow: 1 | 2 = segNow && segNow.id !== 'lock' ? segNow.phase : 1;
  const total = segNow && segNow.id !== 'lock' ? segNow.specs.length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {screen === 'run' && stage !== 'card' && (
        <Stagecraft spec={spec} stage={stage} fbSlot={fbSlot} onAnswer={answer} phase={phaseNow} done={idx} total={total} />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#128273;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">What You Could Have Said</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Name the ink, not the word. Everyone knows the word slows you down and everyone says it
            is because reading is automatic. Halfway through, two of your four keys change colour.
            The words do not move. Watch what happens to the cost.
          </p>
        </div>

        {screen === 'intro' && <Intro onStart={begin} slowScreen={slowScreen} />}
        {screen === 'run' && stage === 'card' && segNow && (
          <SegCard seg={segNow} locked={locked} onGo={goNextCard} />
        )}
        {screen === 'run' && stage !== 'card' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center font-mono text-xs text-slate-500">
            trial {Math.min(idx + 1, total)} of {total}
          </div>
        )}
        {screen === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">crossing the two halves</div>
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

// The legend never spells a colour out. Four words naming four colours, sitting under a task about
// colour words, would be a Stroop stimulus of its own, permanently on screen.
function KeyLegend({ phase, onAnswer, live }: { phase: 1 | 2; onAnswer?: (s: number) => void; live?: boolean }) {
  const set = setFor(phase);
  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
      {set.map((c, i) => (
        <button
          key={`${c}-${i}`}
          onPointerDown={(e) => { e.preventDefault(); if (live && onAnswer) onAnswer(i); }}
          disabled={!live}
          className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition ${
            live ? 'border-slate-700 active:border-cyan-400' : 'border-slate-800'
          } ${i >= 2 ? 'bg-slate-900/60' : 'bg-slate-900/20'}`}
        >
          <span className="h-7 w-full rounded" style={{ background: HEX[c] }} />
          <span className="font-mono text-xs uppercase text-slate-400">{KEYS[i]}</span>
        </button>
      ))}
    </div>
  );
}

function Stagecraft({
  spec, stage, fbSlot, onAnswer, phase, done, total,
}: {
  spec: Spec | null; stage: Stage; fbSlot: number; onAnswer: (s: number) => void; phase: 1 | 2; done: number; total: number;
}) {
  const ink = spec ? inkOf(spec) : null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 px-5 py-8">
      <div className="font-mono text-xs text-slate-700">{Math.min(done + 1, total)} / {total}</div>

      <div className="flex h-48 items-center justify-center">
        {stage === 'fix' && <div className="text-3xl text-slate-600">+</div>}
        {stage === 'stim' && spec && ink && (
          spec.cond === 'drill' ? (
            <div className="h-24 w-48 rounded-xl" style={{ background: HEX[ink] }} />
          ) : (
            <div className="select-none font-mono text-5xl font-bold tracking-widest md:text-6xl" style={{ color: HEX[ink] }}>
              {spec.word}
            </div>
          )
        )}
        {stage === 'fb' && (
          fbSlot >= 0 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-40 rounded-xl border-2 border-slate-100/70" style={{ background: HEX[setFor(phase)[fbSlot]] }} />
              <div className="font-mono text-xs uppercase tracking-wider text-slate-500">that one</div>
            </div>
          ) : (
            <div className="h-16 w-40" />
          )
        )}
      </div>

      <KeyLegend phase={phase} onAnswer={onAnswer} live={stage === 'stim'} />
    </div>
  );
}

// ============================ chrome ============================

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-sm leading-relaxed text-slate-300">{children}</div>;
}

function GoButton({ onGo, label }: { onGo: () => void; label: string }) {
  return (
    <button
      onClick={onGo}
      className="mt-6 w-full rounded-lg bg-cyan-500 px-5 py-3 font-mono text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
    >
      {label}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 font-mono text-xs uppercase tracking-wider text-cyan-400/80">{title}</div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

function msSigned(x: number, d = 0) {
  return Number.isFinite(x) ? `${x >= 0 ? '+' : ''}${x.toFixed(d)} ms` : 'n/a';
}
function pctOf(x: number, d = 0) {
  return Number.isFinite(x) ? `${(x * 100).toFixed(d)}%` : 'n/a';
}
function range(lo: number, hi: number, unit: 'ms' | 'pct') {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return 'n/a';
  return unit === 'ms' ? `${lo.toFixed(0)} to ${hi.toFixed(0)} ms` : `${(lo * 100).toFixed(1)} to ${(hi * 100).toFixed(1)}%`;
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-slate-800/60 pb-2 font-mono text-xs last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right text-slate-200">
        {value}
        {note ? <span className="ml-2 text-slate-600">{note}</span> : null}
      </span>
    </div>
  );
}

function Intro({ onStart, slowScreen }: { onStart: () => void; slowScreen: boolean }) {
  return (
    <Card>
      <p className="mb-3">
        A word appears in a colour. Press the key for the <span className="text-slate-100">colour of the ink</span>, never
        the word. Four keys, shown at the bottom of the screen the whole time as four blocks of colour.
      </p>
      <p className="mb-3 text-slate-400">
        You will do that twice. Halfway through, two of the four keys change to two colours that were
        never available before, and two colours that were available stop being available. Nothing
        else changes. The same words appear in the same inks in both halves.
      </p>
      <p className="mb-3 text-slate-400">
        Before the second half opens, the page will print two numbers: what your second half looks
        like if a word costs you simply because you read it, and what it looks like if a word costs
        you only when it names a key you are holding. Then it runs the block.
      </p>
      <p className="mb-3 text-slate-400">
        About eleven minutes, ten short rests, nothing recorded, nothing leaves your browser. Use a
        keyboard if you have one. Taps work and are slower, which costs you nothing here because
        every number on this page is a difference between two conditions measured the same way.
      </p>
      {slowScreen ? (
        <p className="text-xs text-amber-400/80">
          Your screen is refreshing slowly enough that response times will be coarse. The page will
          still run: every result here is a difference, and the coarseness is common to both sides.
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          If you have a colour vision deficiency, the first drill will find it and say so rather
          than printing a Stroop result on top of it.
        </p>
      )}
      <GoButton onGo={onStart} label="start" />
    </Card>
  );
}

function LockCard({ locked, onGo }: { locked: Locked | null; onGo: () => void }) {
  if (!locked) return <Card><p>working out what each account predicts</p></Card>;
  return (
    <Card>
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">both accounts commit, before the block opens</div>
      <p className="mb-4">
        In the half you just finished, GREEN and YELLOW were colour words you were holding keys for,
        and PURPLE and ORANGE were colour words you were not. The difference between what those two
        pairs cost you is <span className="text-slate-100">{msSigned(locked.gap1Ms)}</span>{' '}
        <span className="text-slate-500">(95% {range(locked.gap1Lo, locked.gap1Hi, 'ms')})</span>.
      </p>
      <p className="mb-4 text-slate-400">
        In the next half, PURPLE and ORANGE become the keys you are holding and GREEN and YELLOW
        stop being them. Same words. Same inks. Same fingers.
      </p>
      <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <Row label="if reading is what costs you" value={msSigned(locked.predUnmovedMs)} note="gap unchanged" />
        <Row label="if naming a live key is what costs you" value={msSigned(locked.predSwappedMs)} note="gap turned over" />
      </div>
      {locked.ok ? (
        <p className="text-xs text-slate-500">
          Those are two different numbers, so the block that follows can tell them apart. Neither is
          scored against the other: the difference of the two halves is zero under the first, the sum
          of them is zero under the second, and both of those zeros are structural rather than
          estimated.
        </p>
      ) : (
        <p className="text-xs text-amber-400/80">
          Read that carefully: your two numbers are not far enough apart to referee between. {locked.detail}.
          The block runs anyway, because your own second half is worth having, but the verdict will
          say it could not choose rather than choosing.
        </p>
      )}
      <GoButton onGo={onGo} label="open the second half" />
    </Card>
  );
}

function SegCard({ seg, locked, onGo }: { seg: Seg; locked: Locked | null; onGo: () => void }) {
  if (seg.id === 'lock') return <LockCard locked={locked} onGo={onGo} />;
  if (seg.id === 'drillA') {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">four keys</div>
        <p className="mb-3">
          {DRILL_N} blocks of plain colour and no words anywhere. Press the key underneath the colour
          you see. This is not a warm up, it is a measurement: it proves the four keys are four keys
          before anything is built on top of them, and it is the one part of the page that can tell
          a colour vision result from a Stroop result.
        </p>
        <div className="my-4"><KeyLegend phase={1} /></div>
        <p className="text-slate-400">Rest your fingers on {KEYS.join(', ').toUpperCase()} and leave them there.</p>
        <GoButton onGo={onGo} label="begin the drill" />
      </Card>
    );
  }
  if (seg.id === 'drillB') {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-400/80">two keys change</div>
        <p className="mb-3">
          The first two keys are exactly what they were. The other two are now colours that have not
          appeared in this session at all. Same {DRILL_N} plain blocks, no words, until the new pair
          is as automatic as the old one.
        </p>
        <div className="my-4"><KeyLegend phase={2} /></div>
        <p className="text-slate-400">
          Nothing about the words is going to change. This is the whole experiment: the only thing
          different in the second half is what two of your fingers mean.
        </p>
        <GoButton onGo={onGo} label="learn the new pair" />
      </Card>
    );
  }
  if (seg.id === 'practice') {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">practice</div>
        <p className="mb-3">
          {PRACTICE_N} trials with words in them, not scored. Name the ink. When the word fights the
          ink you will feel it, and that feeling is the thing being measured.
        </p>
        <p className="text-slate-400">A wrong answer shows you the colour it actually was. A right one moves straight on.</p>
        <GoButton onGo={onGo} label="begin practice" />
      </Card>
    );
  }
  return (
    <Card>
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">{seg.label}</div>
      <p className="mb-3">
        {seg.block === 0 && seg.phase === 1
          ? 'Scored from here. Ink, never the word. Speed matters and so does accuracy, so go as fast as you can while still being right.'
          : 'Same task. Take as long as you like before starting, the clock only runs inside a trial.'}
      </p>
      <div className="my-4"><KeyLegend phase={seg.phase} /></div>
      <GoButton onGo={onGo} label="go" />
    </Card>
  );
}

// ============================ results ============================

const VERDICT_COPY: Record<Verdict, { head: string; tone: string; body: string }> = {
  swapped: {
    head: 'the cost went with the keys',
    tone: 'text-emerald-300',
    body:
      'Your gap turned over when the response set did. The difference between the two halves separated from zero and the sum of them did not, which is what a complete turnover looks like. The words were identical in both halves, so nothing about the words can account for it. What made those words expensive was that they named something you could have said.',
  },
  unmoved: {
    head: 'the cost stayed with the words',
    tone: 'text-amber-300',
    body:
      'Your gap survived the swap intact. The sum of the two halves separated from zero and the difference did not, which is what it looks like when membership does nothing. Whatever made one pair of words more expensive than the other, it travelled with the words themselves and not with which keys you were holding.',
  },
  partial: {
    head: 'part of it went with the keys',
    tone: 'text-cyan-300',
    body:
      'Both statistics separated from zero, which puts you between the two accounts rather than at either. Some of your gap moved when the response set moved and some of it stayed with the words. That is the least tidy outcome and, across the literature, the commonest one.',
  },
  cannotTell: {
    head: 'not enough to choose',
    tone: 'text-slate-300',
    body:
      'Neither statistic separated from zero. That is an underpowered run, not a finding, and the honest thing to print is which way it leaned and how wide the interval was rather than a verdict rounded toward whichever account was nearer.',
  },
  reversed: {
    head: 'the crossing came back inverted',
    tone: 'text-rose-300',
    body:
      'The words you were NOT holding got more expensive once you were. Neither account predicts that. The usual cause is a first half gap that was noise pointing the other way, which the interval below will show.',
  },
  rivalsTooClose: {
    head: 'the two accounts never separated',
    tone: 'text-slate-300',
    body:
      'Your first half gap between the colour words you were holding and the ones you were not is at or below zero. That means both accounts committed to the same second half and no amount of second half data could have refereed between them. It is a real result about you rather than a failed run, and it is what Klein reported for some observers too.',
  },
  thin: {
    head: 'too little survived',
    tone: 'text-slate-300',
    body: 'After trimming there were not enough usable trials in one of the diagnostic cells to score anything.',
  },
};

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const { quality, h1, h2, locked, held, err, delta, checks } = res;

  if (!quality.ok) {
    return (
      <div>
        <Panel title="this run is not scoreable, and here is exactly why">
          <p className="mb-3 text-slate-200">{quality.detail}.</p>
          <p className="text-slate-400">
            Nothing is being hidden from you: the page could produce a number from what is here, and
            the number would be about something other than what it claims to measure. The failure is
            named because a named failure is worth more than a confident average.
          </p>
        </Panel>
        <button onClick={onAgain} className="w-full rounded-lg border border-slate-700 px-5 py-3 font-mono text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300">
          run it again
        </button>
      </div>
    );
  }

  const v = VERDICT_COPY[held.verdict];

  return (
    <div>
      <Panel title="the verdict">
        <div className={`mb-3 text-2xl font-bold ${v.tone}`}>{v.head}</div>
        <p className="mb-4">{v.body}</p>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="gap, first half (holding GREEN and YELLOW)" value={msSigned(h1.gapMs)} note={`95% ${range(locked.gap1Lo, locked.gap1Hi, 'ms')}`} />
          <Row label="gap, second half (holding PURPLE and ORANGE)" value={msSigned(h2.gapMs)} />
          <Row label="difference, zero if membership does nothing" value={msSigned(held.interMs)} note={`95% ${range(held.interMsLo, held.interMsHi, 'ms')}`} />
          <Row label="sum, zero if the turnover is complete" value={msSigned(h1.gapMs + h2.gapMs)} />
          <Row label="difference separated from zero" value={held.excludesZero ? 'yes' : 'no'} />
          <Row label="sum separated from zero" value={held.excludesFull ? 'yes' : 'no'} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Everything above is computed on gaps expressed as a fraction of your own neutral speed in
          that half, then converted back to milliseconds for reading. That is what makes a second
          half at a different overall speed cancel instead of counting. The untreated version of that
          confound pushes this number down, never up, so it can hide a turnover and cannot invent one.
        </p>
      </Panel>

      <Panel title="what the words cost you, half by half">
        <p className="mb-3 text-slate-400">
          Every number here is against a neutral word of the same length in the same ink, recombined
          at the ink mix of whatever it is a baseline for. The anchor is RED and BLUE, which kept
          their keys the whole way through and are the only inks the diagnostic trials ever use.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="anchor, incongruent (the classic Stroop cost)" value={msSigned(pooledAnchor2(h1, h2))} note={`n ${h1.nAnchorInc + h2.nAnchorInc}`} />
          <Row label="anchor, congruent (facilitation)" value={msSigned((h1.anchorF + h2.anchorF) / 2)} note={`n ${h1.nAnchorCon + h2.nAnchorCon}, too thin to read`} />
          <Row label="first half, GREEN and YELLOW (held)" value={msSigned(h1.gyI)} note={`n ${h1.nGy}`} />
          <Row label="first half, PURPLE and ORANGE (not held)" value={msSigned(h1.poI)} note={`n ${h1.nPo}`} />
          <Row label="second half, GREEN and YELLOW (not held)" value={msSigned(h2.gyI)} note={`n ${h2.nGy}`} />
          <Row label="second half, PURPLE and ORANGE (held)" value={msSigned(h2.poI)} note={`n ${h2.nPo}`} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Read the second row with the count next to it, not the number in it. That a word which
          fights you costs far more than a word which agrees with you saves is the oldest reliable
          asymmetry in this literature, and it is the thing the popular version of the effect gets
          wrong by treating interference and facilitation as one effect with a sign. This page did
          not spend its trials there. Every trial it had went into the crossing, so its own
          facilitation cell is a handful of trials wide and could not settle that on its own. It is
          printed because leaving it out would be worse, and labelled because printing it bare would
          be worse still.
        </p>
      </Panel>

      <Panel title="second window: your mistakes, in a currency the verdict never touched">
        <p className="mb-3 text-slate-400">
          The same crossing, run on error rates instead of response times. These trials are
          independent evidence about the same question, and they are noisier, so read the interval.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="error crossing (same shape as the headline)" value={pctOf(err.errInter, 1)} note={`95% ${range(err.errLo, err.errHi, 'pct')}`} />
          <Row label="first half errors, held pair" value={pctOf(err.e1gy, 1)} />
          <Row label="first half errors, unheld pair" value={pctOf(err.e1po, 1)} />
          <Row label="second half errors, held pair" value={pctOf(err.e2po, 1)} />
          <Row label="second half errors, unheld pair" value={pctOf(err.e2gy, 1)} />
        </div>
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="wrong answers that were the word's own colour" value={pctOf(intrShareOf(res), 0)} note="chance is 33%" />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          That last row is a manipulation check and not a referee, and the difference matters. When a
          word names a key you are holding, taking that key is a mistake available to you. When it
          does not, that mistake does not exist, because there is no key to take. So a rate above
          chance shows the words reached your fingers. It cannot say why.
        </p>
      </Panel>

      <Panel title="third window: where in the distribution it lives">
        <p className="mb-3 text-slate-400">
          Every diagnostic cell split at its own median, then the same crossing run inside each half.
          Conflict resolved at the level of the response grows in the slow tail. A flat cost does not
          care where you look.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="crossing, fast half of your responses" value={msSigned(delta.fast)} note={`95% ${range(delta.fastLo, delta.fastHi, 'ms')}`} />
          <Row label="crossing, slow half of your responses" value={msSigned(delta.slow)} note={`95% ${range(delta.slowLo, delta.slowHi, 'ms')}`} />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          This window is underpowered by construction: it is the headline computed on half the trials,
          twice. It is here because the shape is worth seeing, not because it settles anything, and
          two intervals this wide overlapping is the expected outcome rather than a result.
        </p>
      </Panel>

      <Panel title="what the simulation said before this shipped">
        <p className="mb-3 text-slate-400">
          The analysis you just read was pulled out of this page and run in Node against simulated
          visitors whose truth was known, 250 of them in each of seven worlds. The simulator generates
          response times from an accumulator with additive conflict and a separate intrusion process.
          It does not know what a trimmed mean is. These are measured rates, printed rounded down
          rather than up.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="membership is the whole gap" value="77% turnover" note="0% wrong way" />
          <Row label="the gap is a property of the words" value="81% unmoved" note="0% false turnover" />
          <Row label="membership carries half the gap" value="22 / 22 / 13" note="turnover / unmoved / partial" />
          <Row label="a real Stroop and no gap at all" value="69% declined" note="rivals never separated" />
          <Row label="second half 25% slower, no membership" value="86% unmoved" note="the normalisation holds" />
          <Row label="interval coverage" value="94 to 97%" note="against a nominal 95" />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          The line that matters most is the second one. A page that compares GREEN against PURPLE and
          calls the difference a membership effect would score 100 percent in the first world and 100
          percent wrong in the second. Crossing the halves is what buys the zero.
        </p>
      </Panel>

      <Panel title="what would have killed this run, and what it did instead">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <Row label="first key drill" value={pctOf(checks.drillA)} note={`${DRILL_N} colour patches`} />
          <Row label="second key drill" value={pctOf(checks.drillB)} note="new pair" />
          <Row label="scored accuracy" value={pctOf(checks.acc, 1)} note="chance 25%" />
          <Row label="responses under 200 ms" value={pctOf(checks.fastFrac, 1)} />
          <Row label="no answer inside 2.5 s" value={pctOf(checks.missFrac, 1)} />
          <Row label="tab not in front of you" value={pctOf(checks.hiddenFrac, 1)} />
          <Row label="trimmed before analysis" value={pctOf(checks.trimmedFrac, 1)} />
          <Row label="key shares" value={checks.keyShares.map((k) => pctOf(k)).join(' ')} note="design asks 30 30 20 20" />
          <Row label="second half speed against first" value={`${(checks.scaling * 100).toFixed(0)}%`} note="of your first half neutral" />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Refusal rates from the same simulation, 60 runs of each: a machine responder, a guesser, a
          one key responder, responses under 200 ms, a hidden tab and a half learned mapping were each
          refused 60 of 60 with the true cause named. A visitor who confuses one pair of colours was
          caught 58 of 60 and told it was their colour vision rather than their reading. 180 honest
          visitors at three different speeds were refused 0 times.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          The weakest rail on this page catches the one strategy that beats the task: unfocus your
          eyes until the word is a smear and the colour survives. It caught 42 of 60 and it is weak
          for an honest reason. The evidence it needs is your MISTAKES, and somebody doing this task
          properly does not make many.
        </p>
      </Panel>

      <Panel title="what this does not show">
        <p className="mb-3 text-slate-400">
          A turnover here does not mean reading stopped. The word was read in both halves and this
          page has no way to tell you otherwise. What it can say is that being read was not, on its
          own, enough to make a word expensive: the same word, read the same way, cost a different
          amount depending on whether you were holding a key for it.
        </p>
        <p className="text-slate-400">
          And two colour words is a thin sample of English. Klein put ordinary words and colour
          associates like GRASS and SKY on the same ladder and found the rungs in between. Those are
          deliberately absent here, because a gradient across items is exactly the correlational
          evidence this page was built to stop relying on.
        </p>
      </Panel>

      <button onClick={onAgain} className="w-full rounded-lg border border-slate-700 px-5 py-3 font-mono text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300">
        run it again
      </button>
      <p className="mt-6 text-center text-xs leading-relaxed text-slate-600">
        Stroop 1935. Klein 1964. MacLeod 1991. Everything ran in your browser and nothing left it.
      </p>
    </div>
  );
}

function pooledAnchor2(h1: HalfStats, h2: HalfStats): number {
  const a = h1.anchorI;
  const b = h2.anchorI;
  if (!Number.isFinite(a)) return b;
  if (!Number.isFinite(b)) return a;
  return (a * h1.nAnchorInc + b * h2.nAnchorInc) / (h1.nAnchorInc + h2.nAnchorInc);
}

function intrShareOf(res: Result): number {
  const a = res.err.intrusion1;
  const b = res.err.intrusion2;
  const na = res.err.nErr1;
  const nb = res.err.nErr2;
  if (!Number.isFinite(a) && !Number.isFinite(b)) return NaN;
  if (!Number.isFinite(a)) return b;
  if (!Number.isFinite(b)) return a;
  return (a * na + b * nb) / Math.max(1, na + nb);
}
