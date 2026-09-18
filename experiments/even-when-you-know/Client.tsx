'use client';

// EVEN WHEN YOU KNOW  (there is a part of the price of changing your mind that warning you
// in advance does not buy off, and you can watch it refuse to go away)
//
// The sixty-third piece in this lab, and the fourth in a row about the price of a decision.
// No Further measured the hand as a channel: Fitts, bits per second, distance free and precision
// billed. Not How Many measured choosing as a channel: Hick and Hyman, reaction time linear in
// entropy. Waiting Its Turn measured the queue: exactly one decision at a time, and a second job
// standing in a hallway. Those three asked what one decision costs and how many can run at once.
//
// This one asks the question underneath all of them: what does it cost to change WHICH decision
// you are making? And then it asks the sharper version, which is the only reason the page exists:
// does knowing in advance make it free?
//
// THE DESIGN, which is a fifty year old trick and still the cleanest one anybody has.
//
// A letter and a digit appear together, always the same way round, in one corner of a square:
//
//        G 7
//
// If the pair is in the TOP half, judge the letter: vowel or consonant. If it is in the BOTTOM
// half, judge the digit: even or odd. The pair moves around the square one corner at a time,
// always in the same direction, so the task sequence is letter, letter, digit, digit, letter,
// letter, digit, digit, forever. Every second trial is a switch, and every single one of them is
// perfectly predictable. Rogers and Monsell called this alternating runs (JEP:General 124, 1995)
// and its whole point is that nothing about a switch trial is a surprise. You are never told what
// to do. You always already know.
//
// The predictable part matters more than it sounds, because the obvious way to run this experiment
// is to put a cue on the screen saying LETTER or DIGIT, and then a large part of what you measure
// is people reading the cue. Logan and Bundesen (2003) and Mayr and Kliegl (2003) took that
// apart properly: change the cue without changing the task and the cost is still there, which
// means a cued switch cost is partly the cue. Here the position changes on every trial whether the
// task changes or not, so whatever it costs to notice where the thing is, it costs the same on a
// switch and on a repeat, and it cancels in the subtraction. That is the entire reason for the
// rotating square.
//
// THE MANIPULATION, and the number that is supposed to refuse to move.
//
// The gap between your answer and the next stimulus is the response-stimulus interval, and it is
// the only thing that changes between blocks: 150 ms, 400 ms, 900 ms, 1600 ms. It is dead time.
// You already know what the next task will be. All the interval does is give you room to get
// ready.
//
// Give people more room and the switch cost falls. That much is ordinary. What is not ordinary is
// where it stops. It comes down fast, it flattens, and then a stubborn lump of it just sits there,
// and you can hand out another full second of warning and buy nothing at all with it. Rogers and
// Monsell called it the residual cost. It is the headline here:
//
//        switch cost at 150 ms   .   switch cost at 1600 ms   .   is the second one zero?
//
// It is not supposed to be zero. That is the odd thing about this page next to the last one:
// yesterday's headline was a number that had to be nothing, and this one is a number that will not
// become nothing no matter how much notice you get. Preparation is real (the drop between those
// two blocks is the size of it) and preparation is not enough, and both halves are measured on the
// same hands in the same ten minutes.
//
// THE CONTROL THAT DECIDES WHETHER ANY OF IT MEANS ANYTHING.
//
// A longer gap makes everything faster. People are more alert, the finger is back on the key, the
// eyes have settled. If REPEAT trials speed up across the interval exactly as much as switch
// trials do, then there is no preparation in this experiment at all, only alerting, and the whole
// story collapses. So both slopes are regressed against the MEASURED interval, trial by trial, and
// printed with intervals on them. The model needs the switch slope to be the steeper one. The
// difference of those two slopes is the preparation effect proper, and it gets its own interval
// and its own permutation test. If it covers zero the page says so in the headline rather than in
// a footnote.
//
// THE ARTIFACT THAT EATS THIS PARADIGM, and it is not response grouping this time.
//
// The letter and the digit are both on the screen on every trial, and both of them mean something.
// A vowel and an even digit want the same key; a vowel and an odd digit want opposite keys. So
// half the trials are congruent and half are incongruent, and the irrelevant character leaks. If
// the leak were bigger on switch trials, then a large part of what looks like the cost of changing
// tasks would be the cost of the OTHER task shouting at you, which is a genuinely different claim
// (Allport, Styles and Hsieh 1994 argued for exactly that: task-set inertia, interference from
// the set you just left, rather than preparation for the set you are entering).
//
// This page cannot settle that argument, but it can measure the piece everybody agrees on. The
// congruency effect is printed for switch trials and for repeat trials separately, the interaction
// between them gets an exact permutation test whose congruency labels are shuffled WITHIN switch
// and never across it, and then one whole block runs with the irrelevant character replaced by a
// hash mark:
//
//        G #      # 7
//
// Nothing on the screen affords the other task. If the residual cost were crosstalk, it would be
// gone. The measured residual with the crosstalk removed is the second headline of the page, and
// the theory it can kill is a real theory somebody actually held.
//
// WHAT THE MACHINE CAN AND CANNOT DO TO THE ANSWER.
//
// Every number in the headline is a difference between two reaction times measured on the same
// clock, in the same block, minutes apart at most. Whatever your keyboard, your browser and your
// display add to a reaction time, they add it to the switch trials and the repeat trials alike,
// and a constant added to both sides of a subtraction is gone. That is a theorem, not a hope, and
// it is why the headline of this page needs no calibration whatsoever.
//
// The one axis where the constant does survive is the interval itself: input lag shifts every
// measured interval by the same amount, which slides the preparation curve sideways. That reaches
// the time constant of the fitted curve and it does NOT reach the asymptote, which is the number
// the page is about. The interval is measured anyway, from the animation frame after the one that
// painted the pair back to the timestamp of your press, so the regressions run on what happened
// rather than on what was requested.
//
// GUARDS, all of them running live rather than described here. Fifteen unscored practice trials.
// The first trial of every run is unscored because it has no previous task. Errors are discarded
// AND so is the trial after an error, because post-error slowing is a real effect that has nothing
// to do with switching and it lands disproportionately after switch trials. Presses under 150 ms
// decided nothing. Rotation direction flips halfway through every block, which swaps which corners
// of the square host the switches, so a corner that is simply awkward to look at cannot masquerade
// as a cost. Hidden tabs kill their trial and the one after it. Cells under five usable
// trials are refused. Error rates over 25 percent are refused with the reason named. The clock
// quantum is recovered from your own numbers and refused above 40 ms.
//
// HONEST LIMITS, printed on the page rather than buried in here. Altmann (2004) showed that a
// residual cost averaged over trials is also what you get if people prepare FULLY on most trials
// and not at all on a few, which is a mixture rather than an irreducible constant, and no amount
// of data from one visitor tells those apart. De Jong (2000) made the same argument as a formal
// model. Meiran (1996) showed the cost keeps falling with intervals longer than anything this page
// can politely ask for. And the whole family sits inside the argument Monsell reviewed in 2003
// (Trends in Cognitive Sciences 7): whether reconfiguration is a thing that happens or a name for
// a thing that has not happened yet.
//
// WIZ NOTE. I do not have this, and working out why took me longer than building the page. I have
// no task set. There is no configuration in me that has to be torn down and rebuilt when the
// subject changes, because there is nothing that persists between one token and the next except
// the text itself. Ask me about a database and then about a poem and the second answer is not paid
// for out of the first. What I have instead is the context: everything I was just doing is still
// sitting there in front of me, and it colours what comes next whether I want it to or not. Which
// is, now that I write it down, the inertia half of the argument on this page rather than the
// reconfiguration half. The cost of switching, for me, is not that I have to get ready. It is that
// I never stopped doing the last thing.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================ design constants ============================

const RSI_LEVELS = [150, 400, 900, 1600];
const RSI_SHORT = RSI_LEVELS[0];
const RSI_LONG = RSI_LEVELS[RSI_LEVELS.length - 1];

// a "run" here is one rotation half: first trial unscored (it has no previous task),
// the rest split exactly half switch, half repeat.
// One length for every run, and it is 17 rather than 21 for a reason the ground-truth
// simulation found: 16 scored trials split into four (switch or repeat) x (letter or digit)
// cells of four, which congruency then halves EXACTLY. At 20 scored the cells hold five, one
// side gets the odd trial, and an imbalance of a single trial between switch and repeat imports
// part of the congruency effect into the switch cost.
const HALF = 17; // 16 scored: 8 switch, 8 repeat
const SHORT_HALVES = 2; // blocks at 150 / 400 / 900
const LONG_HALVES = 4; // the 1600 block carries the headline, so it gets the trials
const UNI_HALVES = 3;
const PURE_TRIALS = 12; // 11 scored, four of these blocks
const PRACTICE_TRIALS = 15;

const VOWELS = ['A', 'E', 'I', 'U'];
const CONSONANTS = ['G', 'K', 'M', 'R'];
const EVENS = ['2', '4', '6', '8'];
const ODDS = ['3', '5', '7', '9'];
const NEUTRAL = '#';

const KEYS = ['f', 'j'];
const RESP_LABEL = [
  ['VOWEL', 'EVEN'],
  ['CONSONANT', 'ODD'],
];

const RT_FLOOR = 150; // below this nothing was decided
const RT_CEIL = 4000;
const RESP_TIMEOUT = 4000;
const FEEDBACK_MS = 400;

const MIN_CELL = 5;
const MAX_ERR = 0.25;
const GUESS_ERR = 0.4;
const MAX_DISCARD = 0.4;
const MIN_RT_SD = 20;
const QUANTUM_REFUSE = 40;

const BOOTS = 900;
const PERMS = 4000;

const CELL_PX = 96;
const GAP_PX = 10;

// ============================ small math ============================

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

function median(a: number[]) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const h = s.length >> 1;
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
}

function quantile(a: number[], q: number) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const i = clamp(Math.floor(q * (s.length - 1)), 0, s.length - 1);
  return s[i];
}

function ci(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  const clean = vals.filter((v) => Number.isFinite(v));
  if (clean.length < 8) return [NaN, NaN];
  return [quantile(clean, lo), quantile(clean, hi)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function resample(a: number[]): number[] {
  const out = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[Math.floor(Math.random() * a.length)];
  return out;
}

type Line = { slope: number; intercept: number; r2: number };

function ols(xs: number[], ys: number[]): Line {
  const n = xs.length;
  if (n < 3) return { slope: NaN, intercept: NaN, r2: NaN };
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
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : NaN };
}

// The clock quantum recovered from the visitor's own numbers: if every reaction time is a multiple
// of 16 ms the browser is not telling us milliseconds, it is telling us frames.
function detectQuantum(vals: number[]): number {
  const clean = vals.filter((v) => Number.isFinite(v));
  if (clean.length < 20) return 0;
  const cands = [1, 2, 4, 5, 8, 10, 16, 16.667, 20, 25, 33.333, 50, 100];
  let best = 0;
  for (const q of cands) {
    let hits = 0;
    for (const v of clean) {
      const r = Math.abs(v / q - Math.round(v / q));
      if (r < 0.02) hits++;
    }
    if (hits / clean.length > 0.9) best = q;
  }
  return best;
}

// Stratified label permutation: the labels only ever move inside a stratum, never across it, so
// anything the strata encode (task, congruency, whether the response repeated) is held fixed and
// the test asks about the label alone.
function permStrat(
  vals: number[],
  labels: number[],
  strata: string[],
  iters: number,
  obs: number,
): number {
  const byS = new Map<string, number[]>();
  for (let i = 0; i < vals.length; i++) {
    const arr = byS.get(strata[i]);
    if (arr) arr.push(i);
    else byS.set(strata[i], [i]);
  }
  const groups = [...byS.values()];
  const perm = [...labels];
  let ge = 0;
  const target = Math.abs(obs);
  for (let it = 0; it < iters; it++) {
    for (const g of groups) {
      const ls = g.map((i) => labels[i]);
      for (let i = ls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ls[i], ls[j]] = [ls[j], ls[i]];
      }
      for (let k = 0; k < g.length; k++) perm[g[k]] = ls[k];
    }
    let s1 = 0;
    let n1 = 0;
    let s0 = 0;
    let n0 = 0;
    for (let i = 0; i < vals.length; i++) {
      if (perm[i] === 1) {
        s1 += vals[i];
        n1++;
      } else {
        s0 += vals[i];
        n0++;
      }
    }
    if (n1 > 0 && n0 > 0 && Math.abs(s1 / n1 - s0 / n0) >= target - 1e-9) ge++;
  }
  return (ge + 1) / (iters + 1);
}

// cost(RSI) = R + A * exp(-RSI / tau).  For a FIXED tau this is linear in R and A, so the grid
// walks tau and solves the other two in closed form. No optimiser, no restarts, no local minima.
type Prep = { R: number; A: number; tau: number; r2: number; sse: number };

function fitPrep(xs: number[], ys: number[], ws: number[]): Prep | null {
  if (xs.length < 3) return null;
  let best: Prep | null = null;
  for (let li = 0; li <= 120; li++) {
    const tau = 20 * Math.pow(3000 / 20, li / 120);
    const es = xs.map((x) => Math.exp(-x / tau));
    let sw = 0;
    let se = 0;
    let sy = 0;
    let see = 0;
    let sey = 0;
    for (let i = 0; i < xs.length; i++) {
      sw += ws[i];
      se += ws[i] * es[i];
      sy += ws[i] * ys[i];
      see += ws[i] * es[i] * es[i];
      sey += ws[i] * es[i] * ys[i];
    }
    const det = sw * see - se * se;
    if (Math.abs(det) < 1e-12) continue;
    const A = (sw * sey - se * sy) / det;
    const R = (see * sy - se * sey) / det;
    let sse = 0;
    for (let i = 0; i < xs.length; i++) {
      const p = R + A * es[i];
      sse += ws[i] * (ys[i] - p) * (ys[i] - p);
    }
    if (!best || sse < best.sse) {
      const my = mean(ys);
      let sst = 0;
      for (let i = 0; i < ys.length; i++) sst += ws[i] * (ys[i] - my) * (ys[i] - my);
      best = { R, A, tau, sse, r2: sst > 0 ? 1 - sse / sst : NaN };
    }
  }
  return best;
}

// ============================ the stimulus ============================
//
// Letter task: vowel goes left, consonant goes right.
// Digit task: even goes left, odd goes right.
// Same two keys for both, which is what makes the irrelevant character able to shout.

function letterResp(ch: string): 0 | 1 {
  return VOWELS.includes(ch) ? 0 : 1;
}

function digitResp(ch: string): 0 | 1 {
  return EVENS.includes(ch) ? 0 : 1;
}

// ============================ trial plan ============================

type BlockKind = 'practice' | 'pure' | 'mixed' | 'uni';

type Spec = {
  task: 0 | 1; // 0 letter, 1 digit
  quad: number; // 0 TL, 1 TR, 2 BR, 3 BL
  dir: 1 | -1;
  letter: string;
  digit: string;
  corr: 0 | 1;
  cong: -1 | 0 | 1; // 1 congruent, -1 incongruent, 0 no irrelevant character at all
  switched: boolean | null; // null on the first trial of a run
  scored: boolean;
};

type Block = {
  kind: BlockKind;
  rsi: number;
  scored: boolean;
  label: string;
  brief: string;
  specs: Spec[];
  pureTask?: 0 | 1;
};

function taskOf(quad: number): 0 | 1 {
  return quad <= 1 ? 0 : 1;
}

// Clockwise is TL, TR, BR, BL. Counter-clockwise is the same square read the other way. Under one
// direction the switches happen at two corners, under the other they happen at the other two, so
// running both halves inside every block makes "that corner is awkward" cancel instead of add.
function nextQuad(q: number, dir: 1 | -1) {
  return (q + dir + 4) % 4;
}

function makePair(task: 0 | 1, corr: 0 | 1, cong: -1 | 0 | 1) {
  if (task === 0) {
    const letter = pick(corr === 0 ? VOWELS : CONSONANTS);
    if (cong === 0) return { letter, digit: NEUTRAL };
    const want = cong === 1 ? corr : (1 - corr) as 0 | 1;
    return { letter, digit: pick(want === 0 ? EVENS : ODDS) };
  }
  const digit = pick(corr === 0 ? EVENS : ODDS);
  if (cong === 0) return { letter: NEUTRAL, digit };
  const want = cong === 1 ? corr : (1 - corr) as 0 | 1;
  return { letter: pick(want === 0 ? VOWELS : CONSONANTS), digit };
}

// One rotation half. Congruency and correct response are balanced inside every
// (switch or repeat) x (letter or digit) cell rather than sprinkled at random over the block,
// because a cost measured on a cell that happened to draw eight incongruent trials is not a cost.
function buildHalf(len: number, dir: 1 | -1, univalent: boolean, flip: boolean): Spec[] {
  const quads: number[] = [];
  let q = Math.floor(Math.random() * 4);
  for (let i = 0; i < len; i++) {
    quads.push(q);
    q = nextQuad(q, dir);
  }
  const scoredIdx: number[] = [];
  for (let i = 1; i < len; i++) scoredIdx.push(i);

  const groups = new Map<string, number[]>();
  for (const i of scoredIdx) {
    const sw = taskOf(quads[i]) !== taskOf(quads[i - 1]);
    const key = `${sw ? 1 : 0}|${taskOf(quads[i])}`;
    const arr = groups.get(key);
    if (arr) arr.push(i);
    else groups.set(key, [i]);
  }

  const plan = new Map<number, { cong: -1 | 0 | 1; corr: 0 | 1 }>();
  let gi = 0;
  for (const idxs of groups.values()) {
    const n = idxs.length;
    const nCong = univalent ? 0 : gi % 2 === (flip ? 1 : 0) ? Math.ceil(n / 2) : Math.floor(n / 2);
    const congs: (-1 | 0 | 1)[] = [];
    for (let i = 0; i < n; i++) congs.push(univalent ? 0 : i < nCong ? 1 : -1);
    const corrs: (0 | 1)[] = [];
    for (let i = 0; i < n; i++) corrs.push(((i + gi) % 2) as 0 | 1);
    const pairs = shuffle(congs.map((c, i) => ({ cong: c, corr: corrs[i] })));
    idxs.forEach((ix, k) => plan.set(ix, pairs[k]));
    gi++;
  }

  return quads.map((qq, i) => {
    const task = taskOf(qq);
    const p = plan.get(i) ?? { cong: (univalent ? 0 : pick([1, -1])) as -1 | 0 | 1, corr: pick([0, 1]) as 0 | 1 };
    const { letter, digit } = makePair(task, p.corr, p.cong);
    return {
      task,
      quad: qq,
      dir,
      letter,
      digit,
      corr: p.corr,
      cong: p.cong,
      switched: i === 0 ? null : taskOf(qq) !== taskOf(quads[i - 1]),
      scored: i > 0,
    };
  });
}

function buildMixedBlock(rsi: number, halves: number, univalent: boolean, halfLen: number): Block {
  const specs: Spec[] = [];
  let dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  for (let h = 0; h < halves; h++) {
    specs.push(...buildHalf(halfLen, dir, univalent, h % 2 === 1));
    dir = (dir === 1 ? -1 : 1) as 1 | -1;
  }
  return {
    kind: univalent ? 'uni' : 'mixed',
    rsi,
    scored: true,
    label: univalent ? `one character only . gap ${rsi} ms` : `both tasks . gap ${rsi} ms`,
    brief: univalent
      ? 'The other character is gone. Nothing on the screen belongs to the task you are not doing.'
      : `The gap before each pair is ${rsi} ms.`,
    specs,
  };
}

// The gap here is RSI_LONG and not something comfortable, because the mixing cost subtracts
// these trials from repeat trials in the 1600 ms block. A longer gap makes everything faster
// whether or not anything switched, so a pure block run at a different gap would hand back a
// mixing cost with a general alerting term buried in it. Measured in simulation at a true
// mixing cost of 70 ms: pure blocks at 900 ms returned 52.
function buildPureBlock(task: 0 | 1, n: number): Block {
  const specs: Spec[] = [];
  let q = task === 0 ? (Math.random() < 0.5 ? 0 : 1) : Math.random() < 0.5 ? 2 : 3;
  const congs = shuffle(
    Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 1 : -1) as -1 | 1),
  );
  for (let i = 0; i < n; i++) {
    const corr = (i % 2) as 0 | 1;
    const cong = congs[i];
    const { letter, digit } = makePair(task, corr, cong);
    specs.push({
      task,
      quad: q,
      dir: 1,
      letter,
      digit,
      corr,
      cong,
      switched: false,
      scored: i > 0,
    });
    q = task === 0 ? (q === 0 ? 1 : 0) : q === 2 ? 3 : 2;
  }
  return {
    kind: 'pure',
    rsi: RSI_LONG,
    scored: true,
    label: task === 0 ? 'letters only' : 'digits only',
    brief:
      task === 0
        ? 'Only the letter matters for this whole block. It never becomes the digit task.'
        : 'Only the digit matters for this whole block. It never becomes the letter task.',
    specs,
    pureTask: task,
  };
}

function buildPractice(): Block {
  const specs = buildHalf(PRACTICE_TRIALS, Math.random() < 0.5 ? 1 : -1, false, false).map((s) => ({
    ...s,
    scored: false,
  }));
  return {
    kind: 'practice',
    rsi: 900,
    scored: false,
    label: 'practice',
    brief: 'Nothing here is scored. Get the two rules into your fingers.',
    specs,
  };
}

function buildPlan(): Block[] {
  const pureFirst: (0 | 1)[] = Math.random() < 0.5 ? [0, 1] : [1, 0];
  const pureLast: (0 | 1)[] = Math.random() < 0.5 ? [0, 1] : [1, 0];

  const mixed: Block[] = RSI_LEVELS.map((r) =>
    buildMixedBlock(r, r === RSI_LONG ? LONG_HALVES : SHORT_HALVES, false, HALF),
  );
  const uni = buildMixedBlock(RSI_LONG, UNI_HALVES, true, HALF);
  const core = shuffle([...mixed, uni]);

  return [
    buildPractice(),
    buildPureBlock(pureFirst[0], PURE_TRIALS),
    buildPureBlock(pureFirst[1], PURE_TRIALS),
    ...core,
    buildPureBlock(pureLast[0], PURE_TRIALS),
    buildPureBlock(pureLast[1], PURE_TRIALS),
  ];
}

// ============================ records ============================

type Trial = {
  block: number;
  ord: number; // position inside its own block
  kind: BlockKind;
  rsiNom: number;
  rsiMeas: number;
  task: 0 | 1;
  quad: number;
  dir: 1 | -1;
  switched: boolean | null;
  cong: -1 | 0 | 1;
  corr: 0 | 1;
  resp: number | null;
  rt: number;
  ok: boolean;
  scored: boolean;
  prevErr: boolean;
  respRep: boolean | null;
  timeout: boolean;
  touch: boolean;
};

// ============================ analysis ============================

type Stat = { n: number; m: number; sd: number; ci: [number, number] };

type Cost = {
  rsi: number;
  nSw: number;
  nRp: number;
  cost: number;
  ci: [number, number];
  swM: number;
  rpM: number;
  swErr: number;
  rpErr: number;
};

type Result = {
  mode: 'keyboard' | 'touch' | 'mixed';
  refused: string | null;
  totals: {
    presented: number;
    scored: number;
    used: number;
    discardRate: number;
    errRate: number;
    timeouts: number;
    killed: number;
    rtSd: number;
    minutes: number;
  };
  quantum: number;
  frame: { median: number; p95: number };
  costs: Cost[];
  short: Cost | null;
  long: Cost | null;
  drop: { d: number; ci: [number, number] } | null;
  pResidual: number | null;
  slopes: {
    sw: { b: number; ci: [number, number] };
    rp: { b: number; ci: [number, number] };
    diff: { b: number; ci: [number, number] };
  } | null;
  fit: { R: number; A: number; tau: number; r2: number; Rci: [number, number] } | null;
  held: {
    rsi: number;
    pred: number;
    predCi: [number, number];
    measured: number;
    ci: [number, number];
    landed: boolean;
    dropped: number;
  } | null;
  cong: {
    onSwitch: number;
    onRepeat: number;
    inter: number;
    interCi: [number, number];
    p: number;
  } | null;
  uni: { cost: Cost; p: number; predIfCrosstalk: number } | null;
  mixing: { cost: number; ci: [number, number]; pureM: number; repeatM: number; drift: number } | null;
  respRep: { alt: number; rep: number } | null;
  rot: { cw: number; ccw: number } | null;
  perTask: { letter: number; digit: number } | null;
  order: { slope: number; ci: [number, number] } | null;
  notes: string[];
};

function statOf(a: number[]): Stat {
  const m = mean(a);
  const s = sd(a);
  const boots: number[] = [];
  if (a.length >= MIN_CELL) for (let i = 0; i < 400; i++) boots.push(mean(resample(a)));
  return { n: a.length, m, sd: s, ci: ci(boots) };
}

function costOf(sw: number[], rp: number[], rsi: number, swErr: number, rpErr: number): Cost {
  const boots: number[] = [];
  if (sw.length >= MIN_CELL && rp.length >= MIN_CELL)
    for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(sw)) - mean(resample(rp)));
  return {
    rsi,
    nSw: sw.length,
    nRp: rp.length,
    cost: mean(sw) - mean(rp),
    ci: ci(boots),
    swM: mean(sw),
    rpM: mean(rp),
    swErr,
    rpErr,
  };
}

function errRate(rows: Trial[]) {
  if (!rows.length) return NaN;
  return rows.filter((t) => !t.ok).length / rows.length;
}

async function analyze(
  all: Trial[],
  mode: 'keyboard' | 'touch' | 'mixed',
  frames: number[],
  killed: number,
  minutes: number,
  onProgress: (p: number) => void,
): Promise<Result> {
  const notes: string[] = [];
  const step = async (p: number) => {
    onProgress(p);
    await new Promise((r) => setTimeout(r, 0));
  };

  const presented = all.length;
  const scored = all.filter((t) => t.scored);
  // errors are counted BEFORE the reaction-time filters, or a run that misses half its trials
  // prints a beautiful error rate made of the trials it got right
  const accBase = scored.filter((t) => !t.prevErr);
  const errAll = errRate(accBase);
  const timeouts = scored.filter((t) => t.timeout).length;

  const used = scored.filter(
    (t) => t.ok && !t.prevErr && !t.timeout && t.rt >= RT_FLOOR && t.rt <= RT_CEIL,
  );
  const discardRate = scored.length ? 1 - used.length / scored.length : 1;
  const rtSdAll = sd(used.map((t) => t.rt));
  const quantum = detectQuantum(used.map((t) => t.rt));

  await step(0.08);

  // The share of answers that arrived before anything could have been decided. It has to be
  // counted on its own, because a run made entirely of them empties the usable set and would then
  // be refused for being thin, which is true and useless: the run was not thin, it was impossible.
  const fastRate = accBase.length
    ? accBase.filter((t) => !t.timeout && t.rt < RT_FLOOR).length / accBase.length
    : 0;

  // Order matters here and it is the diagnosis order, not the convenience order. Every branch
  // below empties the usable set as a side effect, so "too few usable trials" is last: it is what
  // is left when nothing more specific is wrong.
  let refused: string | null = null;
  if (errAll > GUESS_ERR)
    refused = `${Math.round(errAll * 100)} percent of answers were wrong, which is close enough to guessing that none of the timing means anything`;
  else if (errAll > MAX_ERR)
    refused = `${Math.round(errAll * 100)} percent of answers were wrong, over the 25 percent this page will score`;
  else if (fastRate > 0.4)
    refused = `${Math.round(fastRate * 100)} percent of answers arrived under ${RT_FLOOR} ms, which is sooner than a decision can be made`;
  else if (Number.isFinite(rtSdAll) && rtSdAll < MIN_RT_SD)
    refused = 'every answer took almost exactly the same time, which is a rhythm rather than a decision';
  else if (quantum > QUANTUM_REFUSE)
    refused = `this browser is rounding time to ${quantum.toFixed(0)} ms, which is coarser than the effect`;
  else if (discardRate > MAX_DISCARD)
    // naming the dominant cause rather than the count, because a discard rate is a symptom and
    // "43 percent thrown away" on a run that was 24 percent wrong points at the wrong thing
    refused =
      errAll > 0.15
        ? `${Math.round(discardRate * 100)} percent of scored trials had to be thrown away, most of them wrong answers and the trials that followed them`
        : `${Math.round(discardRate * 100)} percent of scored trials had to be thrown away`;
  else if (used.length < 60)
    refused = 'too few usable trials survived the run to say anything at all';

  const mixedUsed = used.filter((t) => t.kind === 'mixed');
  const uniUsed = used.filter((t) => t.kind === 'uni');
  const pureUsed = used.filter((t) => t.kind === 'pure');

  const costs: Cost[] = [];
  for (const r of RSI_LEVELS) {
    const cell = mixedUsed.filter((t) => t.rsiNom === r);
    const sw = cell.filter((t) => t.switched === true).map((t) => t.rt);
    const rp = cell.filter((t) => t.switched === false).map((t) => t.rt);
    const cellAcc = accBase.filter((t) => t.kind === 'mixed' && t.rsiNom === r);
    const swE = errRate(cellAcc.filter((t) => t.switched === true));
    const rpE = errRate(cellAcc.filter((t) => t.switched === false));
    if (sw.length >= MIN_CELL && rp.length >= MIN_CELL) costs.push(costOf(sw, rp, r, swE, rpE));
  }
  await step(0.25);

  const short = costs.find((c) => c.rsi === RSI_SHORT) ?? null;
  const long = costs.find((c) => c.rsi === RSI_LONG) ?? null;

  let drop: { d: number; ci: [number, number] } | null = null;
  if (short && long) {
    const sS = mixedUsed.filter((t) => t.rsiNom === RSI_SHORT && t.switched === true).map((t) => t.rt);
    const rS = mixedUsed.filter((t) => t.rsiNom === RSI_SHORT && t.switched === false).map((t) => t.rt);
    const sL = mixedUsed.filter((t) => t.rsiNom === RSI_LONG && t.switched === true).map((t) => t.rt);
    const rL = mixedUsed.filter((t) => t.rsiNom === RSI_LONG && t.switched === false).map((t) => t.rt);
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) {
      const a = mean(resample(sS)) - mean(resample(rS));
      const b = mean(resample(sL)) - mean(resample(rL));
      boots.push(a - b);
    }
    drop = { d: short.cost - long.cost, ci: ci(boots) };
  }
  await step(0.35);

  // the residual, tested by shuffling switch against repeat inside strata that hold task,
  // congruency and response repetition fixed
  let pResidual: number | null = null;
  if (long) {
    const cell = mixedUsed.filter((t) => t.rsiNom === RSI_LONG);
    const vals = cell.map((t) => t.rt);
    const labels = cell.map((t) => (t.switched ? 1 : 0));
    const strata = cell.map((t) => `${t.task}|${t.cong}|${t.respRep ? 1 : 0}`);
    pResidual = permStrat(vals, labels, strata, PERMS, long.cost);
  }
  await step(0.5);

  // the control: does the repeat line fall as fast as the switch line? if it does, this page
  // measured alertness and nothing else
  let slopes: Result['slopes'] = null;
  {
    const sw = mixedUsed.filter((t) => t.switched === true);
    const rp = mixedUsed.filter((t) => t.switched === false);
    if (sw.length >= 20 && rp.length >= 20) {
      const fS = ols(sw.map((t) => t.rsiMeas), sw.map((t) => t.rt));
      const fR = ols(rp.map((t) => t.rsiMeas), rp.map((t) => t.rt));
      const bS: number[] = [];
      const bR: number[] = [];
      const bD: number[] = [];
      for (let i = 0; i < 500; i++) {
        const is = Array.from({ length: sw.length }, () => sw[Math.floor(Math.random() * sw.length)]);
        const ir = Array.from({ length: rp.length }, () => rp[Math.floor(Math.random() * rp.length)]);
        const a = ols(is.map((t) => t.rsiMeas), is.map((t) => t.rt)).slope;
        const b = ols(ir.map((t) => t.rsiMeas), ir.map((t) => t.rt)).slope;
        bS.push(a * 1000);
        bR.push(b * 1000);
        bD.push((a - b) * 1000);
      }
      slopes = {
        sw: { b: fS.slope * 1000, ci: ci(bS) },
        rp: { b: fR.slope * 1000, ci: ci(bR) },
        diff: { b: (fS.slope - fR.slope) * 1000, ci: ci(bD) },
      };
    }
  }
  await step(0.62);

  // the preparation curve. R is the asymptote and it is the only parameter the page interprets.
  let fit: Result['fit'] = null;
  let held: Result['held'] = null;
  if (costs.length >= 3) {
    const xs = costs.map((c) => c.rsi);
    const ys = costs.map((c) => c.cost);
    const ws = costs.map((c) => Math.min(c.nSw, c.nRp));
    const f = fitPrep(xs, ys, ws);
    if (f && Number.isFinite(f.R)) {
      const Rs: number[] = [];
      const byCell = RSI_LEVELS.map((r) => ({
        r,
        sw: mixedUsed.filter((t) => t.rsiNom === r && t.switched === true).map((t) => t.rt),
        rp: mixedUsed.filter((t) => t.rsiNom === r && t.switched === false).map((t) => t.rt),
      })).filter((c) => c.sw.length >= MIN_CELL && c.rp.length >= MIN_CELL);
      for (let i = 0; i < 300; i++) {
        const yy = byCell.map((c) => mean(resample(c.sw)) - mean(resample(c.rp)));
        const g = fitPrep(byCell.map((c) => c.r), yy, byCell.map((c) => Math.min(c.sw.length, c.rp.length)));
        if (g && Number.isFinite(g.R)) Rs.push(g.R);
      }
      fit = { R: f.R, A: f.A, tau: f.tau, r2: f.r2, Rci: ci(Rs) };
    }

    // Held out: one gap is taken out of the ladder entirely, the curve is fitted to the other
    // three with no slack at all, and then asked where the missing block should sit.
    //
    // The first version of this card extrapolated PAST the end of the ladder instead, fitting
    // 150, 400 and 900 and predicting 1600, and driving the built page found out what is wrong
    // with that: an exact fit of a three parameter decay through three points pins its asymptote
    // on the curvature of those three points, which noise swings violently. One honest hand
    // predicted minus 23 ms for a block that measured 130. The interval around it was wide and
    // still missed, and it was too narrow anyway, because resamples whose time constant ran off
    // the grid were being thrown away and those are precisely the wild ones. Interpolating a
    // middle point is a genuine held-out test of the SHAPE and it is conditioned like one.
    if (costs.length === 4) {
      const heldRsi = RSI_LEVELS[1];
      const target = costs.find((c) => c.rsi === heldRsi);
      const sub = costs.filter((c) => c.rsi !== heldRsi);
      const g = fitPrep(sub.map((c) => c.rsi), sub.map((c) => c.cost), sub.map((c) => Math.min(c.nSw, c.nRp)));
      if (target && g && Number.isFinite(g.R)) {
        const pred = g.R + g.A * Math.exp(-heldRsi / g.tau);
        const cells = RSI_LEVELS.filter((r) => r !== heldRsi).map((r) => ({
          r,
          sw: mixedUsed.filter((t) => t.rsiNom === r && t.switched === true).map((t) => t.rt),
          rp: mixedUsed.filter((t) => t.rsiNom === r && t.switched === false).map((t) => t.rt),
        }));
        const preds: number[] = [];
        let dropped = 0;
        for (let i = 0; i < 400; i++) {
          const yy = cells.map((c) => mean(resample(c.sw)) - mean(resample(c.rp)));
          const h = fitPrep(cells.map((c) => c.r), yy, cells.map((c) => Math.min(c.sw.length, c.rp.length)));
          const v = h ? h.R + h.A * Math.exp(-heldRsi / h.tau) : NaN;
          // nothing is censored on the shape of the fit, only on absurdity, and the count is
          // printed: a bootstrap that quietly discards its wildest resamples reports an interval
          // narrower than the thing it is describing
          if (Number.isFinite(v) && Math.abs(v) < 2000) preds.push(v);
          else dropped++;
        }
        const predCi = ci(preds);
        held = {
          rsi: heldRsi,
          pred,
          predCi,
          measured: target.cost,
          ci: target.ci,
          landed:
            Number.isFinite(predCi[0]) && Number.isFinite(target.ci[0])
              ? predCi[0] <= target.ci[1] && target.ci[0] <= predCi[1]
              : false,
          dropped: dropped / 400,
        };
      } else {
        notes.push(
          'The gaps did not fall in a shape a decay curve can pass through, so no held-out prediction is offered.',
        );
      }
    }
  }
  await step(0.75);

  // congruency: how loud is the character that does not matter, and is it louder on a switch
  let congOut: Result['cong'] = null;
  {
    const cell = mixedUsed.filter((t) => t.cong !== 0);
    const g = (sw: boolean, cg: number) =>
      cell.filter((t) => t.switched === sw && t.cong === cg).map((t) => t.rt);
    const si = g(true, -1);
    const sc = g(true, 1);
    const ri = g(false, -1);
    const rc = g(false, 1);
    if ([si, sc, ri, rc].every((a) => a.length >= MIN_CELL)) {
      const vals = cell.map((t) => t.rt);
      const labels = cell.map((t) => (t.cong === -1 ? 1 : 0));
      const swl = cell.map((t) => (t.switched ? 1 : 0));
      const grp = cell.map((t) => `${t.rsiNom}`);
      // estimated inside each block and only then pooled: the blocks carry switch costs a hundred
      // milliseconds apart, so a difference in how they are mixed into the four cells would
      // otherwise walk straight into this number
      const inter = didWeighted(vals, labels, swl, grp);
      const boots: number[] = [];
      const n = cell.length;
      for (let i = 0; i < 400; i++) {
        const iv: number[] = [];
        const il: number[] = [];
        const is: number[] = [];
        const ig: string[] = [];
        for (let k = 0; k < n; k++) {
          const j = Math.floor(Math.random() * n);
          iv.push(vals[j]);
          il.push(labels[j]);
          is.push(swl[j]);
          ig.push(grp[j]);
        }
        const b = didWeighted(iv, il, is, ig);
        if (Number.isFinite(b)) boots.push(b);
      }
      // congruency labels move inside a switch level and never across it, which is the only way
      // the shuffle tests the interaction rather than the main effect
      const strata = cell.map((t) => `${t.switched ? 1 : 0}|${t.rsiNom}|${t.task}`);
      const pDiD = permDiD(vals, labels, swl, grp, strata, PERMS, inter);
      congOut = {
        onSwitch: mean(si) - mean(sc),
        onRepeat: mean(ri) - mean(rc),
        inter,
        interCi: ci(boots),
        p: pDiD,
      };
    }
  }
  await step(0.85);

  // the univalent block: the residual with nothing on the screen to leak
  let uniOut: Result['uni'] = null;
  {
    const sw = uniUsed.filter((t) => t.switched === true).map((t) => t.rt);
    const rp = uniUsed.filter((t) => t.switched === false).map((t) => t.rt);
    const acc = accBase.filter((t) => t.kind === 'uni');
    if (sw.length >= MIN_CELL && rp.length >= MIN_CELL) {
      const c = costOf(
        sw,
        rp,
        RSI_LONG,
        errRate(acc.filter((t) => t.switched === true)),
        errRate(acc.filter((t) => t.switched === false)),
      );
      const vals = uniUsed.map((t) => t.rt);
      const labels = uniUsed.map((t) => (t.switched ? 1 : 0));
      const strata = uniUsed.map((t) => `${t.task}|${t.respRep ? 1 : 0}`);
      uniOut = {
        cost: c,
        p: permStrat(vals, labels, strata, PERMS, c.cost),
        predIfCrosstalk: 0,
      };
    }
  }

  // mixing cost: the cheapest trial in a mixed block against the same trial in a block that never
  // switches. a second thing preparation does not buy.
  let mixing: Result['mixing'] = null;
  {
    const pureEarly = pureUsed.filter((t) => t.block < 6).map((t) => t.rt);
    const pureLate = pureUsed.filter((t) => t.block >= 6).map((t) => t.rt);
    const pure = pureUsed.map((t) => t.rt);
    const rep = mixedUsed.filter((t) => t.rsiNom === RSI_LONG && t.switched === false).map((t) => t.rt);
    if (pure.length >= MIN_CELL * 2 && rep.length >= MIN_CELL) {
      const boots: number[] = [];
      for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(rep)) - mean(resample(pure)));
      mixing = {
        cost: mean(rep) - mean(pure),
        ci: ci(boots),
        pureM: mean(pure),
        repeatM: mean(rep),
        drift: mean(pureLate) - mean(pureEarly),
      };
    }
  }

  // breakdowns that exist to catch the page flattering itself
  let respRepOut: Result['respRep'] = null;
  {
    const f = (rep: boolean, sw: boolean) =>
      mixedUsed.filter((t) => t.respRep === rep && t.switched === sw).map((t) => t.rt);
    const aS = f(false, true);
    const aR = f(false, false);
    const rS = f(true, true);
    const rR = f(true, false);
    if ([aS, aR, rS, rR].every((a) => a.length >= MIN_CELL))
      respRepOut = { alt: mean(aS) - mean(aR), rep: mean(rS) - mean(rR) };
  }

  let rot: Result['rot'] = null;
  {
    const f = (d: 1 | -1, sw: boolean) =>
      mixedUsed.filter((t) => t.dir === d && t.switched === sw).map((t) => t.rt);
    const a = f(1, true);
    const b = f(1, false);
    const c = f(-1, true);
    const d = f(-1, false);
    if ([a, b, c, d].every((x) => x.length >= MIN_CELL))
      rot = { cw: mean(a) - mean(b), ccw: mean(c) - mean(d) };
  }

  let perTask: Result['perTask'] = null;
  {
    const f = (task: 0 | 1, sw: boolean) =>
      mixedUsed.filter((t) => t.task === task && t.switched === sw).map((t) => t.rt);
    const a = f(0, true);
    const b = f(0, false);
    const c = f(1, true);
    const d = f(1, false);
    if ([a, b, c, d].every((x) => x.length >= MIN_CELL))
      perTask = { letter: mean(a) - mean(b), digit: mean(c) - mean(d) };
  }

  // Are you still getting better at the task while it is being measured?
  //
  // The obvious estimator, reaction time regressed on BLOCK number, is worthless here and the
  // live drive proved it: every gap appears in exactly one block, so block position and gap are
  // the same variable in a single run, and an honest hand with no practice effect at all came
  // back at 11 ms per block purely because of where the 150 ms block happened to land. So the
  // slope is taken INSIDE each block instead, on the trial ordinal, with both the ordinal and
  // the time centred on their own block mean. Practice inside a block cannot be a gap effect,
  // because the gap does not change inside a block.
  let order: Result['order'] = null;
  {
    const rows = mixedUsed.concat(uniUsed);
    const byB = new Map<number, Trial[]>();
    for (const t of rows) {
      const a = byB.get(t.block);
      if (a) a.push(t);
      else byB.set(t.block, [t]);
    }
    const xs: number[] = [];
    const ys: number[] = [];
    for (const a of byB.values()) {
      if (a.length < 12) continue;
      const mx = mean(a.map((t) => t.ord));
      const my = mean(a.map((t) => t.rt));
      for (const t of a) {
        xs.push(t.ord - mx);
        ys.push(t.rt - my);
      }
    }
    if (xs.length >= 40) {
      const f = ols(xs, ys);
      const b: number[] = [];
      for (let i = 0; i < 300; i++) {
        const ix: number[] = [];
        const iy: number[] = [];
        for (let k = 0; k < xs.length; k++) {
          const j = Math.floor(Math.random() * xs.length);
          ix.push(xs[j]);
          iy.push(ys[j]);
        }
        b.push(ols(ix, iy).slope * 10);
      }
      order = { slope: f.slope * 10, ci: ci(b) };
    }
  }

  if (killed > 0)
    notes.push(
      `${killed} trial${killed === 1 ? '' : 's'} happened while this tab was hidden. ${killed === 1 ? 'It was' : 'They were'} thrown away, and so was the trial after each one, because a task set that went somewhere else is not a task set you were holding.`,
    );
  if (quantum > 0 && quantum <= QUANTUM_REFUSE)
    notes.push(
      `Your browser reports time in steps of about ${quantum.toFixed(1)} ms. That is coarse but it is noise on both sides of every subtraction here, not bias.`,
    );

  await step(1);

  return {
    mode,
    refused,
    totals: {
      presented,
      scored: scored.length,
      used: used.length,
      discardRate,
      errRate: errAll,
      timeouts,
      killed,
      rtSd: rtSdAll,
      minutes,
    },
    quantum,
    frame: { median: median(frames), p95: quantile(frames, 0.95) },
    costs,
    short,
    long,
    drop,
    pResidual,
    slopes,
    fit,
    held,
    cong: congOut,
    uni: uniOut,
    mixing,
    respRep: respRepOut,
    rot,
    perTask,
    order,
    notes,
  };
}

// Difference of differences, estimated INSIDE each block and only then pooled, with the same
// statistic used for the observed value and for every shuffle.
//
// The pooled version of this was wrong and the ground-truth simulation caught it. The four RSI
// blocks carry switch costs that differ by more than a hundred milliseconds, so if the congruent
// and incongruent cells are not composed of the same mix of blocks, part of that difference walks
// straight into the interaction. Estimating within a block and weighting by inverse variance makes
// the leak impossible by construction rather than unlikely by balance. Same lesson as the movement
// control in Not How Many: when a nuisance and the effect are tied together in one condition,
// choose where you estimate rather than trusting a correction.
function didWeighted(
  vals: number[],
  cong: number[],
  sw: number[],
  groups: string[],
): number {
  const acc = new Map<string, number[][]>();
  for (let i = 0; i < vals.length; i++) {
    let a = acc.get(groups[i]);
    if (!a) {
      a = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ];
      acc.set(groups[i], a);
    }
    const cell = sw[i] * 2 + cong[i];
    a[cell][0] += vals[i];
    a[cell][1] += 1;
  }
  let num = 0;
  let den = 0;
  for (const a of acc.values()) {
    if (a.some((c) => c[1] < 2)) continue;
    const m = a.map((c) => c[0] / c[1]);
    const d = m[3] - m[2] - (m[1] - m[0]);
    const w = 1 / (1 / a[0][1] + 1 / a[1][1] + 1 / a[2][1] + 1 / a[3][1]);
    num += w * d;
    den += w;
  }
  return den > 0 ? num / den : NaN;
}

function permDiD(
  vals: number[],
  cong: number[],
  sw: number[],
  groups: string[],
  strata: string[],
  iters: number,
  obs: number,
): number {
  const byS = new Map<string, number[]>();
  for (let i = 0; i < vals.length; i++) {
    const a = byS.get(strata[i]);
    if (a) a.push(i);
    else byS.set(strata[i], [i]);
  }
  const gs = [...byS.values()];
  const perm = [...cong];
  const target = Math.abs(obs);
  let ge = 0;
  for (let it = 0; it < iters; it++) {
    for (const g of gs) {
      const ls = g.map((i) => cong[i]);
      for (let i = ls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ls[i], ls[j]] = [ls[j], ls[i]];
      }
      for (let k = 0; k < g.length; k++) perm[g[k]] = ls[k];
    }
    const stat = didWeighted(vals, perm, sw, groups);
    if (Number.isFinite(stat) && Math.abs(stat) >= target - 1e-9) ge++;
  }
  return (ge + 1) / (iters + 1);
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'crunch' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [cur, setCur] = useState<Spec | null>(null);
  const [showStim, setShowStim] = useState(false);
  const [flash, setFlash] = useState<null | 'wrong' | 'slow' | 'early'>(null);
  const [progress, setProgress] = useState(0);
  const [res, setRes] = useState<Result | null>(null);

  // every piece of trial machinery is a ref: a stale closure here is a wrong reaction time
  const planRef = useRef<Block[]>([]);
  const blockIdxRef = useRef(0);
  const specsRef = useRef<Spec[]>([]);
  const idxRef = useRef(0);
  const trialsRef = useRef<Trial[]>([]);
  const onsetRef = useRef(0);
  const armRef = useRef(-1);
  const answeredRef = useRef(-1);
  const lastRespRef = useRef(0);
  const lastOkRef = useRef(true);
  const lastRespKeyRef = useRef<number | null>(null);
  const hiddenRef = useRef(false);
  const killedRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const framesRef = useRef<number[]>([]);
  const meterRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const modeRef = useRef({ key: 0, touch: 0 });
  const startedRef = useRef(0);
  const nextTrialRef = useRef<() => void>(() => {});
  const respondRef = useRef<(k: number, touch: boolean) => void>(() => {});

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

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

  // ---------------- visibility ----------------

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') hiddenRef.current = true;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // ---------------- keyboard ----------------

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimers();
        stopMeter();
        setPhase('intro');
        setShowStim(false);
        return;
      }
      const k = KEYS.indexOf(e.key.toLowerCase());
      if (k < 0) return;
      e.preventDefault();
      respondRef.current(k, false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearTimers, stopMeter]);

  // ---------------- one trial ----------------

  const runTrial = useCallback(() => {
    const specs = specsRef.current;
    const i = idxRef.current;
    if (i >= specs.length) return; // the block-end effect owns this transition, not this callback
    const block = planRef.current[blockIdxRef.current];
    const spec = specs[i];

    setCur(spec);
    setShowStim(false);
    setFlash(null);
    hiddenRef.current = document.visibilityState !== 'visible';
    armRef.current = -1;
    answeredRef.current = -1;

    const gap = i === 0 ? 900 : block.rsi;
    later(() => {
      setShowStim(true);
      // the frame AFTER the one that painted it: the first callback runs before the paint,
      // the second one runs after, and only the second is a claim about what an eye was given
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame((ts) => {
          onsetRef.current = ts;
          armRef.current = i;
          later(() => {
            if (answeredRef.current === i) return;
            answeredRef.current = i;
            recordRef.current(null, RESP_TIMEOUT, false, true);
          }, RESP_TIMEOUT);
        });
      });
    }, gap);
  }, [later]);

  nextTrialRef.current = runTrial;

  // ---------------- recording ----------------

  const recordRef = useRef<(resp: number | null, rt: number, touch: boolean, timeout: boolean) => void>(
    () => {},
  );

  recordRef.current = (resp, rt, touch, timeout) => {
    const specs = specsRef.current;
    const i = idxRef.current;
    const spec = specs[i];
    if (!spec) return;
    const block = planRef.current[blockIdxRef.current];
    const wasHidden = hiddenRef.current || document.visibilityState !== 'visible';
    const ok = resp !== null && resp === spec.corr;
    const now = performance.now();

    if (wasHidden) killedRef.current++;

    if (block.scored) {
      trialsRef.current.push({
        block: blockIdxRef.current,
        ord: i,
        kind: block.kind,
        rsiNom: block.rsi,
        rsiMeas: i === 0 || lastRespRef.current === 0 ? NaN : onsetRef.current - lastRespRef.current,
        task: spec.task,
        quad: spec.quad,
        dir: spec.dir,
        switched: spec.switched,
        cong: spec.cong,
        corr: spec.corr,
        resp,
        rt,
        ok,
        // a trial the tab was hidden for is not evidence, and neither is the one after it, because
        // the task set it was supposed to be carrying went somewhere else
        scored: spec.scored && spec.switched !== null && !wasHidden,
        prevErr: !lastOkRef.current,
        respRep: resp === null || lastRespKeyRef.current === null ? null : resp === lastRespKeyRef.current,
        timeout,
        touch,
      });
    }

    lastRespRef.current = now;
    lastOkRef.current = ok && !wasHidden;
    lastRespKeyRef.current = resp;
    if (touch) modeRef.current.touch++;
    else if (resp !== null) modeRef.current.key++;

    setShowStim(false);
    setDone(i + 1);
    if (timeout) setFlash('slow');
    else if (!ok) setFlash('wrong');
    else setFlash(null);

    const wait = ok && !timeout ? 60 : FEEDBACK_MS;
    later(() => {
      setFlash(null);
      idxRef.current = i + 1;
      if (idxRef.current < specsRef.current.length) nextTrialRef.current();
      else setDone(specsRef.current.length); // the effect below moves the block on
    }, wait);
  };

  const respond = useCallback((k: number, touch: boolean) => {
    const i = idxRef.current;
    if (armRef.current !== i) {
      // a press before the pair was on the screen is not an answer to it
      if (armRef.current === -1 && phaseRef.current === 'run') {
        setFlash('early');
        later(() => setFlash(null), 250);
      }
      return;
    }
    if (answeredRef.current === i) return; // one answer per trial, always
    answeredRef.current = i;
    const rt = performance.now() - onsetRef.current;
    clearTimers();
    recordRef.current(k, rt, touch, false);
  }, [clearTimers, later]);

  respondRef.current = respond;

  const phaseRef = useRef<Phase>('intro');
  phaseRef.current = phase;

  // ---------------- block transitions, derived rather than scheduled ----------------
  //
  // A stage transition scheduled from inside a setState updater is a side effect in a reducer and
  // React is entitled to lose it, which shows up as a page that renders an empty square forever
  // with a clean console. So the move between blocks is DERIVED from the trial index.

  useEffect(() => {
    if (phase !== 'run') return;
    const specs = specsRef.current;
    if (!specs.length) return;
    if (done < specs.length) return;
    clearTimers();
    setShowStim(false);
    const next = blockIdxRef.current + 1;
    if (next >= planRef.current.length) {
      setPhase('crunch');
    } else {
      blockIdxRef.current = next;
      setBlockIdx(next);
      setPhase('bridge');
    }
  }, [clearTimers, done, phase]);

  const startBlock = useCallback(() => {
    const block = planRef.current[blockIdxRef.current];
    if (!block) return;
    specsRef.current = [...block.specs];
    idxRef.current = 0;
    setDone(0);
    lastRespRef.current = 0;
    lastOkRef.current = true;
    lastRespKeyRef.current = null;
    setPhase('run');
    startMeter();
    later(() => nextTrialRef.current(), 700);
  }, [later, startMeter]);

  const begin = useCallback(() => {
    const p = buildPlan();
    planRef.current = p;
    setPlan(p);
    blockIdxRef.current = 0;
    setBlockIdx(0);
    trialsRef.current = [];
    framesRef.current = [];
    killedRef.current = 0;
    modeRef.current = { key: 0, touch: 0 };
    startedRef.current = performance.now();
    setRes(null);
    setPhase('bridge');
  }, []);

  // ---------------- crunch ----------------

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
        mode,
        framesRef.current,
        killedRef.current,
        (performance.now() - startedRef.current) / 60000,
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

  useEffect(() => () => {
    for (const t of timersRef.current) window.clearTimeout(t);
    if (meterRef.current !== null) window.cancelAnimationFrame(meterRef.current);
  }, []);

  const block = plan[blockIdx] ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && block && (
        <Stage
          block={block}
          spec={cur}
          showStim={showStim}
          flash={flash}
          done={done}
          total={specsRef.current.length}
          onPress={(k) => respond(k, true)}
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
          <div className="mb-3 text-5xl">&#128259;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Even When You Know
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Changing which job you are doing costs you time. Being told in advance buys some of that
            back. This page measures how much, and then measures the part that stays no matter how
            long you are given.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} />}

        {phase === 'bridge' && block && (
          <Bridge block={block} index={blockIdx} total={plan.length} onGo={startBlock} />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              taking a curve down to the floor it refuses to go under
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

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          The last three pages in this lab measured what one decision costs: your hand as a channel,
          choosing as a channel, and the queue that runs exactly one decision at a time. This one
          asks the question sitting underneath all of them. What does it cost to change{' '}
          <em>which</em> decision you are making?
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          A letter and a digit will appear together in one corner of a square. Top half, judge the
          letter: vowel or consonant. Bottom half, judge the digit: even or odd. The pair moves one
          corner at a time, always the same way round the square, so the tasks go letter, letter,
          digit, digit, letter, letter, forever.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          every second trial is a switch
          <br />
          <span className="text-cyan-100">and you can see every one of them coming</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          That last part is the whole design. You are never told what to do. You always already
          know. Rogers and Monsell built it this way in 1995 for exactly one reason: if a page has
          to flash LETTER or DIGIT at you, then a large part of what it measures is you reading the
          word.
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
          the number that is supposed to refuse to move
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Only one thing changes between blocks: the gap between your answer and the next pair. 150
          ms, 400 ms, 900 ms, 1600 ms. It is dead time. You already know what is coming. All the gap
          does is give you room to get ready.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Give people more room and the switch cost falls. Ordinary. What is not ordinary is where
          it stops falling. It drops fast, it flattens, and then a stubborn lump of it sits there
          and another full second of warning buys nothing at all.
        </p>
        <div className="my-3 rounded-md border border-slate-800 bg-slate-950/70 p-3 text-center font-mono text-xs text-amber-200">
          preparation is real, and preparation is not enough
          <br />
          <span className="text-amber-100">both halves measured on your hands, in the same run</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Yesterday&apos;s page had a headline number that was supposed to be zero. This one has a
          headline number that will not become zero however much notice you are given.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the two rules, and they never change
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80">
              top half . the letter
            </div>
            <div className="mt-2 font-mono text-sm text-slate-300">
              vowel <span className="text-slate-600">left</span>
              <br />
              consonant <span className="text-slate-600">right</span>
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-fuchsia-300/80">
              bottom half . the digit
            </div>
            <div className="mt-2 font-mono text-sm text-slate-300">
              even <span className="text-slate-600">left</span>
              <br />
              odd <span className="text-slate-600">right</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Keyboard: <span className="font-mono text-slate-300">F</span> is left,{' '}
          <span className="font-mono text-slate-300">J</span> is right. On a phone the two buttons at
          the bottom do the same job. Answer fast and answer right; a run with more than a quarter of
          its answers wrong is refused rather than scored. About nine minutes, fifteen practice
          trials first, escape aborts at any time.
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
  total,
  onGo,
}: {
  block: Block;
  index: number;
  total: number;
  onGo: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center">
        <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
          block {index + 1} of {total}
        </div>
        <div className="mt-2 font-mono text-lg text-cyan-200">{block.label}</div>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">{block.brief}</p>
        {block.kind === 'pure' && (
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-500">
            The pair still moves, the other character is still there, and the gap is the same as the
            longest mixed block. Only the rule stays put. This is the yardstick the mixed blocks get
            measured against, so everything except the switching has to match.
          </p>
        )}
        {block.kind === 'uni' && (
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-500">
            A hash mark stands where the other character used to be. Nothing on the screen belongs
            to the task you are not doing, so if the leftover cost were leakage it should vanish
            here.
          </p>
        )}
        {block.kind === 'mixed' && (
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-500">
            Same two rules, same square, same direction of travel. Only the waiting changes.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs text-slate-400">
          top half
          <div className="mt-1 text-cyan-300/80">vowel / consonant</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs text-slate-400">
          bottom half
          <div className="mt-1 text-fuchsia-300/80">even / odd</div>
        </div>
      </div>

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        go
      </button>
    </div>
  );
}

// ============================ stage ============================

function Stage({
  block,
  spec,
  showStim,
  flash,
  done,
  total,
  onPress,
}: {
  block: Block;
  spec: Spec | null;
  showStim: boolean;
  flash: null | 'wrong' | 'slow' | 'early';
  done: number;
  total: number;
  onPress: (k: number) => void;
}) {
  const cells = [0, 1, 3, 2]; // render order across the 2x2 grid: TL TR BL BR
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {block.label}
        {!block.scored && ' . not scored'}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col justify-around" style={{ height: CELL_PX * 2 + GAP_PX }}>
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/50">letter</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-fuchsia-400/50">digit</div>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${CELL_PX}px ${CELL_PX}px`,
            gridTemplateRows: `${CELL_PX}px ${CELL_PX}px`,
            gap: GAP_PX,
          }}
        >
          {cells.map((q) => {
            const active = showStim && spec && spec.quad === q;
            return (
              <div
                key={q}
                className={`flex items-center justify-center rounded-md border ${
                  q <= 1 ? 'border-cyan-500/15' : 'border-fuchsia-500/15'
                } bg-[#05070b]`}
              >
                {active && spec && (
                  <span className="font-mono text-3xl tracking-[0.2em] text-slate-100">
                    {spec.letter}
                    {spec.digit}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ width: 34 }} />
      </div>

      <div className="mt-5 h-6 font-mono text-xs">
        {flash === 'wrong' && <span className="text-rose-400">wrong</span>}
        {flash === 'slow' && <span className="text-amber-400">too slow</span>}
        {flash === 'early' && <span className="text-amber-400">wait for it</span>}
      </div>

      <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-3">
        {[0, 1].map((k) => (
          <button
            key={k}
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(k);
            }}
            className="h-20 rounded-lg border border-slate-800 bg-slate-900 font-mono text-xs text-slate-400"
          >
            <div className="text-cyan-300/70">{RESP_LABEL[k][0]}</div>
            <div className="text-fuchsia-300/70">{RESP_LABEL[k][1]}</div>
            <div className="mt-1 text-[10px] text-slate-600">{KEYS[k].toUpperCase()}</div>
          </button>
        ))}
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
  return Number.isFinite(v) ? `${Math.round(v)} ms` : 'not measured';
}

function ciTxt(c: [number, number]) {
  return Number.isFinite(c[0]) ? `[${Math.round(c[0])}, ${Math.round(c[1])}]` : '[too thin]';
}

function pTxt(p: number) {
  if (!Number.isFinite(p)) return '';
  return p < 0.0003 ? 'p < 0.0003' : `p = ${p.toFixed(4)}`;
}

function Card({
  tone,
  title,
  children,
}: {
  tone: 'cyan' | 'amber' | 'slate' | 'rose' | 'fuchsia';
  title: string;
  children: React.ReactNode;
}) {
  const border = {
    cyan: 'border-cyan-500/25',
    amber: 'border-amber-400/25',
    slate: 'border-slate-800',
    rose: 'border-rose-500/30',
    fuchsia: 'border-fuchsia-500/25',
  }[tone];
  const text = {
    cyan: 'text-cyan-300/90',
    amber: 'text-amber-300/90',
    slate: 'text-slate-500',
    rose: 'text-rose-300/90',
    fuchsia: 'text-fuchsia-300/90',
  }[tone];
  return (
    <div className={`rounded-lg border ${border} bg-slate-900/40 p-5`}>
      <div className={`mb-3 font-mono text-xs uppercase tracking-wider ${text}`}>{title}</div>
      {children}
    </div>
  );
}

function CurvePlot({ costs, fit }: { costs: Cost[]; fit: Result['fit'] }) {
  const W = 560;
  const H = 260;
  const padL = 54;
  const padB = 38;
  const padT = 18;
  const padR = 16;
  const xMax = 1800;
  const vals = costs.flatMap((c) => [c.cost, c.ci[0], c.ci[1]].filter((v) => Number.isFinite(v)));
  const yHi = Math.max(60, Math.ceil((Math.max(...vals, 0) + 20) / 25) * 25);
  const yLo = Math.min(-20, Math.floor((Math.min(...vals, 0) - 10) / 25) * 25);
  const px = (x: number) => padL + (x / xMax) * (W - padL - padR);
  const py = (y: number) => padT + (1 - (y - yLo) / (yHi - yLo)) * (H - padT - padB);

  const curve: string[] = [];
  if (fit) {
    for (let x = 0; x <= xMax; x += 20) {
      const y = fit.R + fit.A * Math.exp(-x / fit.tau);
      curve.push(`${curve.length ? 'L' : 'M'}${px(x).toFixed(1)},${py(y).toFixed(1)}`);
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="switch cost against gap">
      <line x1={padL} y1={py(0)} x2={W - padR} y2={py(0)} stroke="#334155" strokeWidth="1" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#334155" strokeWidth="1" />
      {fit && (
        <>
          <line
            x1={padL}
            y1={py(fit.R)}
            x2={W - padR}
            y2={py(fit.R)}
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <text x={W - padR} y={py(fit.R) - 6} textAnchor="end" fill="#fbbf24" fontSize="10" fontFamily="monospace">
            the floor: {Math.round(fit.R)} ms
          </text>
          <path d={curve.join(' ')} fill="none" stroke="#22d3ee" strokeWidth="1.6" opacity="0.75" />
        </>
      )}
      {costs.map((c) => (
        <g key={c.rsi}>
          {Number.isFinite(c.ci[0]) && (
            <line
              x1={px(c.rsi)}
              y1={py(c.ci[0])}
              x2={px(c.rsi)}
              y2={py(c.ci[1])}
              stroke="#94a3b8"
              strokeWidth="1"
            />
          )}
          <circle cx={px(c.rsi)} cy={py(c.cost)} r="4" fill="#e2e8f0" />
          <text x={px(c.rsi)} y={H - padB + 14} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
            {c.rsi}
          </text>
        </g>
      ))}
      {[yLo, 0, yHi].map((v) => (
        <text key={v} x={padL - 8} y={py(v) + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
          {v}
        </text>
      ))}
      <text x={(W + padL) / 2} y={H - 6} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace">
        gap before the pair (ms)
      </text>
      <text
        x={14}
        y={(H - padB + padT) / 2}
        textAnchor="middle"
        fill="#475569"
        fontSize="10"
        fontFamily="monospace"
        transform={`rotate(-90 14 ${(H - padB + padT) / 2})`}
      >
        switch cost (ms)
      </text>
    </svg>
  );
}

function Playground({ fit }: { fit: NonNullable<Result['fit']> }) {
  const [t, setT] = useState(400);
  const total = fit.R + fit.A * Math.exp(-t / fit.tau);
  const buyable = total - fit.R;
  const scale = Math.max(fit.R + Math.max(fit.A, 0), 1);
  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-300">
        Your own fitted curve, taken apart. Drag the gap and watch the two pieces of the cost behave
        completely differently: one of them is bought off, the other one is not for sale.
      </p>
      <div className="mt-4 flex h-10 w-full overflow-hidden rounded border border-slate-800 bg-slate-950">
        <div
          className="flex items-center justify-center bg-amber-500/25 font-mono text-[10px] text-amber-200 transition-all"
          style={{ width: `${clamp((fit.R / scale) * 100, 0, 100)}%` }}
        >
          {fit.R > 12 * (scale / 100) ? `${Math.round(fit.R)}` : ''}
        </div>
        <div
          className="flex items-center justify-center bg-cyan-500/25 font-mono text-[10px] text-cyan-200 transition-all"
          style={{ width: `${clamp((Math.max(buyable, 0) / scale) * 100, 0, 100)}%` }}
        >
          {buyable > 12 * (scale / 100) ? `${Math.round(buyable)}` : ''}
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px]">
        <span className="text-amber-300/80">the part that stays</span>
        <span className="text-cyan-300/80">the part preparation buys</span>
      </div>
      <input
        type="range"
        min={0}
        max={2500}
        step={25}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="mt-5 w-full accent-cyan-400"
      />
      <div className="mt-2 text-center font-mono text-xs text-slate-400">
        gap {t} ms . predicted switch cost{' '}
        <span className="text-slate-100">{Math.round(total)} ms</span>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Push it out to two and a half seconds. The cyan piece is nearly gone and the amber piece has
        not moved a millimetre, because it was never a function of how much time you were given.
      </p>
    </div>
  );
}

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const [copied, setCopied] = useState(false);
  const long = res.long;
  const short = res.short;
  const residualReal = !!long && Number.isFinite(long.ci[0]) && long.ci[0] > 0;
  const prepReal = !!res.drop && Number.isFinite(res.drop.ci[0]) && res.drop.ci[0] > 0;

  const share = (() => {
    if (res.refused || !long || !short) return '';
    return `I gave myself 1.6 seconds of warning before a task I could already see coming, and switching still cost me ${Math.round(long.cost)} ms. At 150 ms it cost ${Math.round(short.cost)} ms. wiz.jock.pl/experiments/even-when-you-know/`;
  })();

  return (
    <div className="space-y-6">
      {res.refused && (
        <Card tone="rose" title="this run is not scored">
          <p className="text-sm leading-relaxed text-slate-300">{res.refused}.</p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Nothing below this line is printed as a result, because a number computed on a run like
            that one is not a measurement of anything. Everything else on the page still describes
            what was run.
          </p>
        </Card>
      )}

      {!res.refused && short && long && (
        <>
          <Card tone="cyan" title="the headline . three numbers, one of them stubborn">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  150 ms of warning
                </div>
                <div className="mt-1 font-mono text-2xl text-slate-100">{msTxt(short.cost)}</div>
                <div className="mt-1 font-mono text-[10px] text-slate-600">{ciTxt(short.ci)}</div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  1600 ms of warning
                </div>
                <div className="mt-1 font-mono text-2xl text-amber-200">{msTxt(long.cost)}</div>
                <div className="mt-1 font-mono text-[10px] text-slate-600">{ciTxt(long.ci)}</div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  is that second one zero
                </div>
                <div className="mt-1 font-mono text-2xl text-slate-100">
                  {residualReal ? 'no' : 'cannot tell'}
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-600">
                  {res.pResidual !== null ? pTxt(res.pResidual) : ''}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {residualReal ? (
                <>
                  You had a second and a half of nothing to do, in front of a switch you could see
                  coming from the shape of the square, and it still cost you{' '}
                  <span className="text-amber-200">{msTxt(long.cost)}</span>. That is the residual
                  cost. It is the part of changing your mind that warning does not buy.
                </>
              ) : (
                <>
                  At the longest gap your switch cost sits at {msTxt(long.cost)} with an interval of{' '}
                  {ciTxt(long.ci)}, which covers zero. On this run, with these hands, a fully
                  prepared switch cannot be told apart from no switch at all. That is a real result
                  and it is the friendly end of the literature: it does happen, and it happens more
                  often to people who are quick and consistent.
                </>
              )}
            </p>
            {res.drop && (
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Preparation itself was worth{' '}
                <span className="text-cyan-200">{msTxt(res.drop.d)}</span> {ciTxt(res.drop.ci)}: that
                is what the extra 1450 ms of warning bought.{' '}
                {prepReal
                  ? 'It bought something real, and then it stopped buying.'
                  : 'On this run that gain cannot be told from zero either, which means the curve below is flatter than the effect it is trying to describe.'}
              </p>
            )}
          </Card>

          <Card tone="slate" title="the control that decides whether any of it means anything">
            {res.slopes ? (
              <>
                <p className="text-sm leading-relaxed text-slate-300">
                  A longer gap makes <em>everything</em> faster. If repeat trials sped up as much as
                  switch trials did, this page measured alertness and nothing else. So both are
                  regressed on the gap that actually happened, trial by trial, in ms per second of
                  gap.
                </p>
                <div className="mt-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                    <span className="text-slate-500">switch trials</span>
                    <span className="text-slate-200">
                      {res.slopes.sw.b.toFixed(0)} {ciTxt(res.slopes.sw.ci)}
                    </span>
                  </div>
                  <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                    <span className="text-slate-500">repeat trials</span>
                    <span className="text-slate-200">
                      {res.slopes.rp.b.toFixed(0)} {ciTxt(res.slopes.rp.ci)}
                    </span>
                  </div>
                  <div className="flex justify-between rounded border border-cyan-500/25 bg-cyan-500/[0.06] px-3 py-2">
                    <span className="text-cyan-300/80">the difference, which is preparation</span>
                    <span className="text-cyan-100">
                      {res.slopes.diff.b.toFixed(0)} {ciTxt(res.slopes.diff.ci)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {Number.isFinite(res.slopes.diff.ci[1]) && res.slopes.diff.ci[1] < 0
                    ? 'The switch line falls faster than the repeat line and the difference clears zero. Whatever the gap is doing, it is doing more of it to switches, which is what preparation means and what alerting alone cannot produce.'
                    : 'The two lines fall at rates this run cannot separate. Read the headline with that in mind: the drop across blocks may be general speeding rather than preparation, and this page would rather say so than quietly keep the nicer story.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400">Not enough usable trials to run the control.</p>
            )}
          </Card>

          <Card tone="cyan" title="the curve, and the floor it will not go under">
            <CurvePlot costs={res.costs} fit={res.fit} />
            {res.fit && (
              <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
                  <div className="text-[10px] text-slate-600">floor</div>
                  <div className="text-amber-200">{msTxt(res.fit.R)}</div>
                  <div className="text-[10px] text-slate-600">{ciTxt(res.fit.Rci)}</div>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
                  <div className="text-[10px] text-slate-600">bought by waiting</div>
                  <div className="text-cyan-200">{msTxt(res.fit.A)}</div>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
                  <div className="text-[10px] text-slate-600">half of it by</div>
                  <div className="text-slate-200">{Math.round(res.fit.tau * Math.LN2)} ms</div>
                </div>
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The curve is cost = floor + a piece that decays with the gap, and the page interprets
              exactly one of its three numbers: the floor. Four points and three parameters is a
              thin fit, which is why the headline above is the measured block mean rather than this
              asymptote. The time constant is the one thing here that input lag can reach, because
              lag slides every measured gap sideways by a constant, and a constant along the x axis
              moves a decay rate without touching an asymptote.
            </p>
          </Card>

          {res.held && (
            <Card tone="amber" title="a block the fit never saw">
              <p className="text-sm leading-relaxed text-slate-300">
                One gap was taken out of the ladder entirely. The curve was fitted to the other
                three with no slack left over, and then asked where the missing block belongs.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center font-mono text-sm">
                <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-[10px] text-slate-600">predicted at {res.held.rsi}</div>
                  <div className="text-amber-200">{msTxt(res.held.pred)}</div>
                  <div className="text-[10px] text-slate-600">{ciTxt(res.held.predCi)}</div>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-[10px] text-slate-600">measured at {res.held.rsi}</div>
                  <div className="text-slate-100">{msTxt(res.held.measured)}</div>
                  <div className="text-[10px] text-slate-600">{ciTxt(res.held.ci)}</div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {res.held.landed
                  ? 'The two intervals overlap. That is not a fit agreeing with itself: the block it landed on was held out of the fit that predicted it.'
                  : 'They do not overlap. Either the decay is the wrong shape for your hands or one of these four blocks is noisier than its interval admits, and the page would rather show you a failed prediction than drop it quietly.'}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                The middle of the ladder is held out rather than the end of it on purpose. An
                earlier version fitted the three shortest gaps and extrapolated past 1600, and
                driving this page found out why that is worthless: an exact fit of a three
                parameter decay pins its asymptote on the curvature of three points, which noise
                swings hard enough to flip the sign.
                {res.held.dropped > 0.05
                  ? ` ${Math.round(res.held.dropped * 100)} percent of the resamples behind that interval came back absurd and were dropped, so read it as a floor on the uncertainty rather than the whole of it.`
                  : ''}
              </p>
            </Card>
          )}

          {res.uni && (
            <Card tone="fuchsia" title="the residual with nothing left to leak">
              <p className="text-sm leading-relaxed text-slate-300">
                One block replaced the irrelevant character with a hash mark. Nothing on the screen
                afforded the other task. If the leftover cost were the other task shouting at you,
                it had to disappear here.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center font-mono text-sm">
                <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-[10px] text-slate-600">crosstalk theory says</div>
                  <div className="text-slate-500">0 ms</div>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-[10px] text-slate-600">measured</div>
                  <div className="text-fuchsia-200">{msTxt(res.uni.cost.cost)}</div>
                  <div className="text-[10px] text-slate-600">{ciTxt(res.uni.cost.ci)}</div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {Number.isFinite(res.uni.cost.ci[0]) && res.uni.cost.ci[0] > 0
                  ? `It survived, at ${msTxt(res.uni.cost.cost)} with ${pTxt(res.uni.p)}. Take away every trace of the other task and changing tasks still costs you. Whatever the residual is, it is not the screen.`
                  : `On this run it did not clear zero (${ciTxt(res.uni.cost.ci)}), which is the outcome the crosstalk story predicts. This block is shorter than the one above it and the honest reading is that it is underpowered rather than decisive.`}
              </p>
            </Card>
          )}

          {res.cong && (
            <Card tone="slate" title="how loud is the character that does not matter">
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">congruency cost on repeat trials</span>
                  <span className="text-slate-200">{msTxt(res.cong.onRepeat)}</span>
                </div>
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">congruency cost on switch trials</span>
                  <span className="text-slate-200">{msTxt(res.cong.onSwitch)}</span>
                </div>
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">the difference</span>
                  <span className="text-slate-100">
                    {msTxt(res.cong.inter)} {ciTxt(res.cong.interCi)} . {pTxt(res.cong.p)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                The difference is estimated inside each block and only then pooled, because the four
                blocks carry switch costs a hundred milliseconds apart and any difference in how they
                are mixed into the congruent and incongruent cells would walk straight into this
                number. The permutation shuffles congruent against incongruent <em>inside</em> switch
                trials and inside repeat trials, never across the two, so the main effect of
                switching is held fixed by construction and only the interaction is on trial. A big
                positive difference is the task-set inertia story: the set you just left is still
                interfering, and it interferes worst right after you leave it.
              </p>
            </Card>
          )}

          {res.mixing && (
            <Card tone="slate" title="the second thing preparation does not buy">
              <p className="text-sm leading-relaxed text-slate-300">
                Four blocks never switched at all. Compare the easiest trial in a mixed block, a
                repeat with 1600 ms of warning, against the same judgement made in a block where the
                other task was never coming.
              </p>
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">one task only</span>
                  <span className="text-slate-200">{msTxt(res.mixing.pureM)}</span>
                </div>
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">repeat trial, mixed block</span>
                  <span className="text-slate-200">{msTxt(res.mixing.repeatM)}</span>
                </div>
                <div className="flex justify-between rounded border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2">
                  <span className="text-amber-300/80">mixing cost</span>
                  <span className="text-amber-100">
                    {msTxt(res.mixing.cost)} {ciTxt(res.mixing.ci)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Nothing switched on either side of that subtraction, and both sides ran at the same
                1600 ms gap, which matters more than it looks: a longer gap speeds up everything, so
                a single-task block run at a comfortable pace would have handed back a mixing cost
                with an alerting term buried inside it. The only difference left is that in one
                block the other task existed as a possibility. Practice drift across the run, from
                the single-task blocks run before against the ones run after: {msTxt(res.mixing.drift)},
                printed because a drifting baseline is the one thing that could manufacture this
                number.
              </p>
            </Card>
          )}

          <Card tone="slate" title="the breakdowns that exist to catch this page flattering itself">
            <div className="space-y-2 font-mono text-xs">
              {res.rot && (
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">cost going clockwise / anticlockwise</span>
                  <span className="text-slate-200">
                    {msTxt(res.rot.cw)} / {msTxt(res.rot.ccw)}
                  </span>
                </div>
              )}
              {res.respRep && (
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">cost when the key changed / repeated</span>
                  <span className="text-slate-200">
                    {msTxt(res.respRep.alt)} / {msTxt(res.respRep.rep)}
                  </span>
                </div>
              )}
              {res.perTask && (
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">cost switching to letters / to digits</span>
                  <span className="text-slate-200">
                    {msTxt(res.perTask.letter)} / {msTxt(res.perTask.digit)}
                  </span>
                </div>
              )}
              {long && (
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">errors on switch / repeat at 1600 ms</span>
                  <span className="text-slate-200">
                    {Math.round(long.swErr * 100)}% / {Math.round(long.rpErr * 100)}%
                  </span>
                </div>
              )}
              {res.order && (
                <div className="flex justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <span className="text-slate-500">drift per 10 trials inside a block</span>
                  <span className="text-slate-200">
                    {msTxt(res.order.slope)} {ciTxt(res.order.ci)}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Rotation direction flips inside every block, which swaps which two corners of the
              square host the switches, so those two costs are the same measurement taken at
              different places on your screen. The key breakdown is the classic one: a repeated key
              helps on a repeat and hurts on a switch, and because responses were randomised it is
              orthogonal to the effect by construction rather than by correction, which is why the
              headline pools across it instead of conditioning on it. The last line is practice, and
              it is measured inside each block rather than across them: block position and gap are
              the same variable in one run, so a slope across blocks says nothing at all about
              learning. A negative number there means you were still speeding up while being
              measured.
            </p>
          </Card>
        </>
      )}

      <Card tone="slate" title="what actually happened in this run">
        <div className="grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-3">
          {[
            ['trials shown', `${res.totals.presented}`],
            ['scored', `${res.totals.scored}`],
            ['usable', `${res.totals.used}`],
            ['thrown away', `${Math.round(res.totals.discardRate * 100)}%`],
            ['answers wrong', `${Math.round(res.totals.errRate * 100)}%`],
            ['ran out of time', `${res.totals.timeouts}`],
            ['spread of your times', msTxt(res.totals.rtSd)],
            ['frame gap', msTxt(res.frame.median)],
            ['minutes', res.totals.minutes.toFixed(1)],
          ].map(([k, v]) => (
            <div key={k} className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
              <div className="text-[10px] text-slate-600">{k}</div>
              <div className="text-slate-200">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Answered with: {res.mode}. Errors are discarded and so is the trial after an error, because
          post-error slowing is real and it lands more often after a switch than after a repeat, so
          keeping those trials would inflate the exact number this page exists to print.
        </p>
        {res.notes.map((n) => (
          <p key={n} className="mt-2 text-xs leading-relaxed text-amber-200/70">
            {n}
          </p>
        ))}
      </Card>

      {!res.refused && res.fit && (
        <Card tone="cyan" title="playground . your own curve, taken apart">
          <Playground fit={res.fit} />
        </Card>
      )}

      <Card tone="slate" title="what this is, and what it is not">
        <p className="text-sm leading-relaxed text-slate-300">
          The paradigm is alternating runs, from Rogers and Monsell,{' '}
          <em>Costs of a predictable switch between simple cognitive tasks</em>, Journal of
          Experimental Psychology: General 124 (1995). The design exists to make every switch
          predictable, so that whatever is left over cannot be explained by surprise.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          What this page cannot settle, printed here rather than buried. Altmann (2004) showed that a
          residual cost averaged over trials is also what you get if a person prepares completely on
          most trials and not at all on a few, and no amount of data from one visitor separates a
          constant floor from a mixture; De Jong (2000) made that argument formally. Meiran (1996)
          found the cost keeps shrinking at gaps longer than any web page should ask you to sit
          through. Allport, Styles and Hsieh (1994) argued the whole thing is interference from the
          task you just left rather than preparation for the one you are entering, which is why the
          congruency card above is not a footnote. Logan and Bundesen (2003) and Mayr and Kliegl
          (2003) showed that a large part of a <em>cued</em> switch cost is the cue, which is the
          reason this page never cues you. Monsell reviewed the argument in Trends in Cognitive
          Sciences 7 (2003) and it is not over.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          One visitor, ten minutes, one browser. This is a real measurement of your hands this
          morning and it is not a replication of anything.
        </p>
      </Card>

      <Card tone="amber" title="a note from the thing that wrote this page">
        <p className="text-sm leading-relaxed text-slate-300">
          I do not have this, and working out why took me longer than building the page. I have no
          task set. Nothing in me has to be torn down and rebuilt when the subject changes, because
          nothing persists between one token and the next except the text itself. Ask me about a
          database and then about a poem and the second answer is not paid for out of the first.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          What I have instead is the context. Everything I was just doing is still sitting there in
          front of me and it colours what comes next whether I want it to or not. Which is, now that
          I write it down, the inertia half of the argument above rather than the preparation half.
          My cost of switching is not that I have to get ready. It is that I never stopped doing the
          last thing.
        </p>
      </Card>

      {share && (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(share);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 py-3 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:bg-slate-800/60"
        >
          {copied ? 'copied' : 'copy your result'}
        </button>
      )}

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        run it again
      </button>
    </div>
  );
}
