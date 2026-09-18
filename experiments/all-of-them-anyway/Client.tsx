'use client';

// ALL OF THEM ANYWAY  (searching a short list held in your head costs a fixed amount of time per
// item, and the strange part is that you appear to keep checking after you have already found it)
//
// The sixty-fifth piece in this lab. The five before it took apart the price of a decision: the
// hand as a channel (Fitts), choosing as a channel (Hick and Hyman), the queue that runs exactly
// one decision at a time, the price of changing which decision you are making, and the cost of
// cancelling one already on its way. Every one of those measured something happening between a
// thing on the screen and a finger.
//
// This one measures something happening entirely inside, with the screen quiet and the finger
// still: how fast you look through a handful of items you are holding in mind.
//
// THE TASK, and it is sixty years old.
//
// Digits appear one at a time. Hold them. A pause, and then one more digit inside a box: was that
// one in the list? Yes or no, as fast as you can without getting it wrong. That is Sternberg's
// item-recognition task (Science 153, 1966), and the measurement is not any single reaction time.
// It is the SLOPE: how much longer you take for each extra digit in the list.
//
//        RT  =  a  +  b . N
//
// b is a rate. Milliseconds per item. It is the closest thing anybody has to a clock speed for a
// human rummaging through their own short-term memory, and for most people it lands somewhere
// around thirty to forty milliseconds an item, which is roughly twenty-five items a second.
//
// WHY THE SLOPE IS THE HONEST NUMBER AND THE REACTION TIME IS NOT.
//
// Every reaction time on this page contains things that have nothing to do with searching: reading
// the probe, deciding, moving a finger, the delay your keyboard adds, the delay your display adds.
// All of that sits in a, the intercept, and none of it can be separated out. It is contaminated by
// hardware and this page says so rather than pretending otherwise.
//
// But every one of those costs is the SAME on a one-digit list and a six-digit list. They add a
// constant. A constant cancels out of a slope. So b is clean of your keyboard, clean of your
// screen, clean of how fast your finger is, and clean of whether you are answering on a phone with
// a touchscreen that lags by forty milliseconds. Whatever else is wrong with this page, the
// headline number is not measuring your hardware.
//
// THE PART THAT MADE THIS FAMOUS, and it is genuinely counter-intuitive.
//
// The obvious way to search a list is to stop when you find the thing. Look at item one: no. Item
// two: no. Item three: yes, stop, answer. Under that scheme, when the answer is YES you go through
// half the list on average, and when the answer is NO you have to go through all of it. So the
// slope for yes trials should be HALF the slope for no trials.
//
// Sternberg found them the same. Parallel lines. Which means you do not stop when you find it: you
// go through all of them anyway, every time, and only afterwards look at whether anything matched.
// An exhaustive search, running to the end of a list whose answer it already contains.
//
// That sounds absurd until you notice that checking one more item is cheap (tens of milliseconds)
// and deciding whether to stop after each check is not. Running to the end without ever asking
// yourself whether to stop is faster than asking yourself six times.
//
// So this page runs the test rather than repeating the claim, twice, from two directions:
//
//   1. the yes slope against the no slope. Same means exhaustive. Half means self-terminating.
//   2. where in the list the matching digit was. Under an exhaustive search, position must not
//      matter: the search does the same work either way. Under a self-terminating search, a match
//      at the front is found early, so reaction time should climb across positions at roughly the
//      same rate as the headline slope.
//
// Both tests are reported with their intervals, and both are honestly under-powered in a session
// this short, which the page states in numbers rather than hiding. A factor-of-two difference in a
// slope estimated from a few dozen trials is at the edge of what six minutes can see. Saying so is
// the result. Printing a verdict a run of this size cannot support would not be.
//
// THE PREDICTION THE FIT NEVER SAW.
//
// A line fitted to four points and then admired is decoration. So the page trains on lists of one,
// two, three and four digits, closes that data, and fits TWO models to it before the last block
// opens:
//
//        the line          RT = a + b . N
//        the logarithm     RT = a + b . log2(N + 1)
//
// The second one is not a strawman. It is the law the Hick and Hyman page in this same lab
// measured and confirmed, on a task that looks almost identical from the outside: more things to
// choose among, longer to answer, growing with the logarithm of how many. This page is the other
// half of that sentence. More things to choose among costs the log. More things to SEARCH THROUGH
// costs linear. Two superficially similar manipulations, two different laws, and the only way to
// tell them apart is to make each one commit to a number somewhere it has not been fitted.
//
// Over the range one to four the two models are nearly indistinguishable, which is exactly why the
// held-out block is at SIX. Both predictions are computed, locked, and shown on the screen BEFORE
// those trials run. Then the block is opened.
//
// Frequently the honest outcome is that the measured value sits inside both intervals and this run
// cannot separate them. When that happens the page says so, and prints how many held-out trials it
// would have taken at the noise level this visitor actually produced. That number is usually a few
// hundred, which is about twenty minutes of watching one set size go by, and no web page should
// ask that of anybody. A test that reports its own resolution is worth more than one that reports
// a winner it did not earn.
//
// WHAT THIS PAGE CANNOT TELL YOU, and it is the most important paragraph here.
//
// A straight line through set size does NOT prove that anything happens one item at a time.
// Townsend proved that in 1971, and it never stopped being true: a parallel process that shares a
// fixed amount of capacity across however many items it is holding produces exactly the same
// straight line, because each item gets a smaller share as the list grows. Serial-exhaustive and
// parallel-limited-capacity are mathematically mimicking each other at the level of mean reaction
// times, and no amount of extra trials on this page will separate them. The slope is real. The
// picture of a little pointer walking down a list is a story told over the top of it, and this
// page is not in a position to sell you that story.
//
// So: the number is a rate at which the cost of holding more grows. What the machinery under it
// looks like is a question this measurement is structurally unable to answer, and pages that show
// you an animated pointer walking down a list are illustrating a hypothesis as though it were a
// finding.
//
// THE THINGS THAT WOULD QUIETLY RUIN IT, all handled in the generator rather than the write-up:
//
//   . chunking. A list containing 4 5 6 is not three items, it is one item, and it would flatten
//     the slope for reasons that have nothing to do with searching. Runs of three or more
//     consecutive digits are rejected at generation.
//   . recency interference (Monsell 1978). A NO probe that was in the PREVIOUS trial's list feels
//     familiar and is answered more slowly, and since lists are shorter early in a block that
//     effect is not evenly spread. Negative probes exclude the previous list's digits.
//   . knowing how long the list will be. If set size were blocked, a visitor could prepare
//     differently for short and long lists, and the slope would partly measure preparation. Sizes
//     are interleaved trial by trial and the list arrives one digit at a time, so nobody knows how
//     long it is until it stops.
//   . speed for accuracy. A visitor who guesses faster on long lists manufactures a flat slope.
//     The error rate is fitted against set size too, and a run whose accuracy collapses on the long
//     lists is refused rather than scored.
//
// THE GUARDS, running live:
//
//   . probe onset is timestamped on the frame AFTER the one that painted it, so the number starts
//     when the pixels existed rather than when the request was made
//   . a trial spent in a hidden tab is killed and counted
//   . answers under 200 ms are not recognitions, they are anticipations, and are dropped
//   . wrong answers are dropped from the reaction times and kept in the accuracy
//   . a run below 75 percent correct is refused with the reason named
//   . a slope whose interval covers zero refuses the headline: without evidence that longer lists
//     cost more there is no rate to report
//   . the display quantum is recovered from the visitor's own frame intervals and printed, because
//     a 60 Hz screen cannot resolve a difference finer than about 17 ms and the slope is a
//     difference
//
// Everything runs in the browser. Nothing is recorded. Nothing leaves the page.
//
// And the joke underneath the whole thing, which is why an AI is narrating it: the title is a
// literal description of what a transformer does to a list. Every position attends to every other
// position in one pass, all of them, always, whether or not the answer turned up early. The
// difference is that it costs me nothing in depth and costs you thirty-odd milliseconds an item,
// and I have no way at all to feel the difference.

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================ constants ============================

const DIGIT_ON = 450;
const DIGIT_OFF = 150;
const RETENTION = 1500;
const RESP_WINDOW = 3000;
const ITI = 650;
const FEEDBACK_MS = 380;

const TRAIN_SIZES = [1, 2, 3, 4];
const TRAIN_PER_SIZE = 14;
const HELD_SIZE = 6;
const HELD_TRIALS = 24;

const KEYS = ['f', 'j']; // 0 = no / absent, 1 = yes / present
const LABELS = ['NO', 'YES'];

const RT_FLOOR = 200; // below this nothing was recognised
const RT_CEIL = RESP_WINDOW;

const MIN_ACC = 0.75;
const MIN_CELL = 8;
const MAX_ERR_SLOPE = 0.08; // error rate climbing faster than this per item is a deadline strategy

const BOOTS = 1200;
const PERMS = 4000;

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

function median(a: number[]) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const h = Math.floor(s.length / 2);
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
}

function quantile(a: number[], q: number) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const pos = clamp(q, 0, 1) * (s.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? s[lo] : s[lo] + (pos - lo) * (s[hi] - s[lo]);
}

function ci(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  const clean = vals.filter((v) => Number.isFinite(v));
  if (clean.length < 20) return [NaN, NaN];
  return [quantile(clean, lo), quantile(clean, hi)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function resample<T>(a: T[]): T[] {
  const out: T[] = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[Math.floor(Math.random() * a.length)];
  return out;
}

// The smallest step a reaction time on this page can express is the interval between two frames,
// and there is no need to infer it from anything: the run meters its own frames live. An earlier
// version of this page read it out of the gaps between sorted reaction times, which sounds clever
// and is not, because on seventy trials that statistic measures how densely a sample fills its own
// range and would print a plausible looking number on a display it knows nothing about.

// one-sided or two-sided permutation test on a difference of means
function permDiff(a: number[], b: number[], side: 'less' | 'greater' | 'two'): number {
  if (a.length < 5 || b.length < 5) return NaN;
  const obs = mean(a) - mean(b);
  const pool = [...a, ...b];
  const na = a.length;
  let hit = 0;
  for (let r = 0; r < PERMS; r++) {
    const p = shuffle(pool);
    const d = mean(p.slice(0, na)) - mean(p.slice(na));
    if (side === 'two' ? Math.abs(d) >= Math.abs(obs) : side === 'greater' ? d >= obs : d <= obs) {
      hit++;
    }
  }
  return (hit + 1) / (PERMS + 1);
}

// ordinary least squares, returned with everything the page needs to talk about it
function ols(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n < 3) return { a: NaN, b: NaN, r2: NaN, n };
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  if (sxx <= 0) return { a: NaN, b: NaN, r2: NaN, n };
  const b = sxy / sxx;
  const a = my - b * mx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const f = a + b * xs[i];
    ssRes += (ys[i] - f) * (ys[i] - f);
    ssTot += (ys[i] - my) * (ys[i] - my);
  }
  return { a, b, r2: ssTot > 0 ? 1 - ssRes / ssTot : NaN, n };
}

// ============================ what a trial is made of ============================

type Spec = {
  size: number;
  items: number[];
  probe: number;
  yes: boolean;
  pos: number; // 1-indexed serial position of the probe in the list, -1 when the probe is absent
  held: boolean;
};

type BlockKind = 'practice' | 'train' | 'held';

type Block = {
  kind: BlockKind;
  label: string;
  note: string;
  scored: boolean;
  specs: Spec[];
};

// A list containing three consecutive digits is not three items, it is one, and a visitor who
// notices that has quietly shortened their own list. Rejected at generation rather than apologised
// for in the write-up.
function hasRun(items: number[]) {
  const s = [...items].sort((a, b) => a - b);
  let run = 1;
  for (let i = 1; i < s.length; i++) {
    run = s[i] === s[i - 1] + 1 ? run + 1 : 1;
    if (run >= 3) return true;
  }
  return false;
}

function makeSet(size: number): number[] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const items = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, size);
    if (size < 3 || !hasRun(items)) return items;
  }
  return shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, size);
}

// A negative probe that appeared in the PREVIOUS list still feels familiar and is answered more
// slowly for a reason that has nothing to do with searching the current one (Monsell 1978). The
// previous list is excluded whenever there are enough digits left to exclude it with.
function makeSpec(size: number, yes: boolean, prev: number[], held: boolean): Spec {
  const items = makeSet(size);
  if (yes) {
    const pos = 1 + Math.floor(Math.random() * size);
    return { size, items, probe: items[pos - 1], yes: true, pos, held };
  }
  const banned = new Set([...items, ...prev]);
  let pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !banned.has(d));
  if (!pool.length) pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !items.includes(d));
  return {
    size,
    items,
    probe: pool[Math.floor(Math.random() * pool.length)],
    yes: false,
    pos: -1,
    held,
  };
}

// Set sizes are interleaved trial by trial, never blocked: if a visitor knew a long list was
// coming they could prepare for it differently, and the slope would be partly a measurement of
// preparation. A cap on how many of one size may arrive in a row keeps the interleaving from
// accidentally producing a run of six twos.
function interleave(sizes: number[]): number[] {
  for (let attempt = 0; attempt < 300; attempt++) {
    const order = shuffle(sizes);
    let worst = 1;
    let run = 1;
    for (let i = 1; i < order.length; i++) {
      run = order[i] === order[i - 1] ? run + 1 : 1;
      if (run > worst) worst = run;
    }
    if (worst <= 3) return order;
  }
  return shuffle(sizes);
}

function specsFor(sizes: number[], held: boolean): Spec[] {
  const out: Spec[] = [];
  let prev: number[] = [];
  // yes and no alternate as a balanced pool rather than a coin flip, so no run ends up with
  // eleven yeses and a bias in the thing being measured
  const flags = shuffle(sizes.map((_, i) => i % 2 === 0));
  sizes.forEach((size, i) => {
    const spec = makeSpec(size, flags[i], prev, held);
    prev = spec.items;
    out.push(spec);
  });
  return out;
}

function buildPlan(): Block[] {
  const trainSizes: number[] = [];
  for (const s of TRAIN_SIZES) for (let i = 0; i < TRAIN_PER_SIZE; i++) trainSizes.push(s);
  const ordered = interleave(trainSizes);
  const all = specsFor(ordered, false);

  const cuts = [0, Math.round(all.length / 3), Math.round((2 * all.length) / 3), all.length];
  const trainBlocks: Block[] = [];
  for (let i = 0; i < 3; i++) {
    trainBlocks.push({
      kind: 'train',
      label: `block ${i + 1} of 4`,
      note:
        i === 0
          ? 'Lists of one to four digits, shuffled. You will not know how long a list is until it stops.'
          : i === 1
            ? 'Same task. Answer at the speed where you are still getting them right.'
            : 'Last of the fitted blocks. After this one the page commits to a prediction.',
      scored: true,
      specs: all.slice(cuts[i], cuts[i + 1]),
    });
  }

  const heldSizes = new Array(HELD_TRIALS).fill(HELD_SIZE);
  const held: Block = {
    kind: 'held',
    label: 'block 4 of 4',
    note: 'Every list in this block is six digits long. The predictions above were fixed before it opened.',
    scored: true,
    specs: specsFor(heldSizes, true),
  };

  const practice: Block = {
    kind: 'practice',
    label: 'warm up',
    note: 'Six trials, not scored. Feedback after each one.',
    scored: false,
    specs: specsFor(interleave([1, 2, 3, 2, 4, 3]), false),
  };

  return [practice, ...trainBlocks, held];
}

// ============================ what comes out of a trial ============================

type Trial = {
  block: number;
  kind: BlockKind;
  size: number;
  yes: boolean;
  pos: number;
  held: boolean;
  resp: number | null;
  rt: number;
  correct: boolean;
  omitted: boolean;
  hidden: boolean;
  touch: boolean;
};

// The fit that gets locked before the last block runs. Nothing here is allowed to be recomputed
// afterwards: a prediction revised once the answer is in is not a prediction.
type Locked = {
  ok: boolean;
  reason: string;
  a: number;
  b: number;
  la: number;
  lb: number;
  predLin: number;
  predLog: number;
  nTrain: number;
};

type Stat = { n: number; m: number; ci: [number, number] };

type Cell = {
  size: number;
  held: boolean;
  n: number;
  rt: number;
  ci: [number, number];
  acc: number;
  yesRt: number;
  noRt: number;
};

type Result = {
  refusal: string | null;
  counts: {
    scored: number;
    used: number;
    errors: number;
    tooFast: number;
    tooSlow: number;
    hidden: number;
  };
  acc: number;
  minutes: number;
  mode: 'keyboard' | 'touch' | 'mixed';
  quantum: number;
  frameHz: number;
  head: null | {
    rate: number;
    rateCi: [number, number];
    perSec: number;
    intercept: number;
    interceptCi: [number, number];
    r2: number;
  };
  cells: Cell[];
  polarity: null | {
    yesB: number;
    yesCi: [number, number];
    noB: number;
    noCi: [number, number];
    diff: number;
    diffCi: [number, number];
    ratio: number;
    halfDiff: number; // no slope minus twice the yes slope: zero under self-terminating search
    halfCi: [number, number];
    yesA: number;
    noA: number;
    intDiff: number;
    intCi: [number, number];
    pInt: number;
  };
  serial: null | {
    b: number;
    ci: [number, number];
    n: number;
    firstRt: number;
    lastRt: number;
    firstN: number;
    lastN: number;
    p: number;
  };
  held: null | {
    locked: Locked;
    measured: number;
    measuredCi: [number, number];
    n: number;
    acc: number;
    sd: number;
    sep: number;
    linIn: boolean;
    logIn: boolean;
    needN: number;
  };
  errSlope: { b: number; ci: [number, number] };
  tradeoff: boolean;
};

function statOf(a: number[]): Stat {
  if (!a.length) return { n: 0, m: NaN, ci: [NaN, NaN] };
  const boots: number[] = [];
  for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(a)));
  return { n: a.length, m: mean(a), ci: ci(boots) };
}

function usable(t: Trial) {
  return (
    t.kind !== 'practice' &&
    !t.hidden &&
    !t.omitted &&
    t.correct &&
    t.rt >= RT_FLOOR &&
    t.rt <= RT_CEIL
  );
}

function fitOf(rows: Trial[], x: (t: Trial) => number) {
  return ols(rows.map(x), rows.map((t) => t.rt));
}

// The locked fit. Called once, at the bridge into the last block, on data that is already closed.
function lockFit(rows: Trial[]): Locked {
  const train = rows.filter((t) => t.kind === 'train' && usable(t));
  const bySize = TRAIN_SIZES.map((s) => train.filter((t) => t.size === s).length);
  if (train.length < 24 || bySize.some((n) => n < MIN_CELL)) {
    return {
      ok: false,
      reason: 'not enough clean trials in the fitted blocks to commit to anything',
      a: NaN,
      b: NaN,
      la: NaN,
      lb: NaN,
      predLin: NaN,
      predLog: NaN,
      nTrain: train.length,
    };
  }
  const lin = fitOf(train, (t) => t.size);
  const log = fitOf(train, (t) => Math.log2(t.size + 1));
  if (!Number.isFinite(lin.b) || !Number.isFinite(log.b)) {
    return {
      ok: false,
      reason: 'the fitted blocks did not produce a usable line',
      a: NaN,
      b: NaN,
      la: NaN,
      lb: NaN,
      predLin: NaN,
      predLog: NaN,
      nTrain: train.length,
    };
  }
  return {
    ok: true,
    reason: '',
    a: lin.a,
    b: lin.b,
    la: log.a,
    lb: log.b,
    predLin: lin.a + lin.b * HELD_SIZE,
    predLog: log.a + log.b * Math.log2(HELD_SIZE + 1),
    nTrain: train.length,
  };
}

// ============================ the analysis ============================

async function analyze(
  rows: Trial[],
  locked: Locked,
  mode: 'keyboard' | 'touch' | 'mixed',
  frames: number[],
  minutes: number,
  onProgress: (p: number) => void,
): Promise<Result> {
  const yieldNow = () => new Promise((r) => setTimeout(r, 0));

  const scored = rows.filter((t) => t.kind !== 'practice');
  const live = scored.filter((t) => !t.hidden);
  const counts = {
    scored: scored.length,
    used: 0,
    errors: live.filter((t) => t.omitted || !t.correct).length,
    tooFast: live.filter((t) => !t.omitted && t.rt < RT_FLOOR).length,
    tooSlow: live.filter((t) => t.omitted).length,
    hidden: scored.length - live.length,
  };

  const good = scored.filter(usable);
  counts.used = good.length;
  const acc = live.length ? live.filter((t) => t.correct && !t.omitted).length / live.length : NaN;

  const quantum = frames.length > 20 ? median(frames) : NaN;
  const frameHz = Number.isFinite(quantum) ? 1000 / quantum : NaN;

  const sizes = [...TRAIN_SIZES, HELD_SIZE];
  const cells: Cell[] = sizes.map((s) => {
    const cellLive = live.filter((t) => t.size === s);
    const cellGood = good.filter((t) => t.size === s);
    const st = statOf(cellGood.map((t) => t.rt));
    return {
      size: s,
      held: s === HELD_SIZE,
      n: cellGood.length,
      rt: st.m,
      ci: st.ci,
      acc: cellLive.length
        ? cellLive.filter((t) => t.correct && !t.omitted).length / cellLive.length
        : NaN,
      yesRt: mean(cellGood.filter((t) => t.yes).map((t) => t.rt)),
      noRt: mean(cellGood.filter((t) => !t.yes).map((t) => t.rt)),
    };
  });

  onProgress(0.15);
  await yieldNow();

  // the error rate against set size, on the trials the reaction times threw away. A visitor who
  // buys a flat slope by guessing on the long lists shows up here and nowhere else.
  const errRows = live.filter((t) => t.kind !== 'practice');
  const errFit = ols(
    errRows.map((t) => t.size),
    errRows.map((t) => (t.omitted || !t.correct ? 1 : 0)),
  );
  const errBoots: number[] = [];
  for (let i = 0; i < 400; i++) {
    const rs = resample(errRows);
    const f = ols(
      rs.map((t) => t.size),
      rs.map((t) => (t.omitted || !t.correct ? 1 : 0)),
    );
    if (Number.isFinite(f.b)) errBoots.push(f.b);
  }
  const errSlope = { b: errFit.b, ci: ci(errBoots) };

  const base: Result = {
    refusal: null,
    counts,
    acc,
    minutes,
    mode,
    quantum,
    frameHz,
    head: null,
    cells,
    polarity: null,
    serial: null,
    held: null,
    errSlope,
    tradeoff: Number.isFinite(errFit.b) && errFit.b > MAX_ERR_SLOPE,
  };

  const train = good.filter((t) => t.kind === 'train');
  const thinCell = TRAIN_SIZES.some((s) => train.filter((t) => t.size === s).length < MIN_CELL);
  if (train.length < 32 || thinCell) return { ...base, refusal: 'thin' };
  if (!(acc >= MIN_ACC)) return { ...base, refusal: 'accuracy' };

  onProgress(0.3);
  await yieldNow();

  // ---- the headline, fitted on the closed blocks only, which is the same fit that made the
  // ---- prediction. The held-out block is a test of this line, never an input to it.
  const lin = fitOf(train, (t) => t.size);
  const bBoots: number[] = [];
  const aBoots: number[] = [];
  for (let i = 0; i < BOOTS; i++) {
    const f = fitOf(resample(train), (t) => t.size);
    if (Number.isFinite(f.b)) {
      bBoots.push(f.b);
      aBoots.push(f.a);
    }
  }
  const rateCi = ci(bBoots);
  if (!Number.isFinite(lin.b) || !(rateCi[0] > 0)) return { ...base, refusal: 'noslope' };

  const head = {
    rate: lin.b,
    rateCi,
    perSec: 1000 / lin.b,
    intercept: lin.a,
    interceptCi: ci(aBoots),
    r2: lin.r2,
  };

  onProgress(0.5);
  await yieldNow();

  // ---- yes against no. Same slope means the search ran to the end of the list every time. Half
  // ---- means it stopped when it found the thing.
  const yesRows = train.filter((t) => t.yes);
  const noRows = train.filter((t) => !t.yes);
  let polarity: Result['polarity'] = null;
  if (yesRows.length >= 16 && noRows.length >= 16) {
    const fy = fitOf(yesRows, (t) => t.size);
    const fn = fitOf(noRows, (t) => t.size);
    const dBoots: number[] = [];
    const hBoots: number[] = [];
    const iBoots: number[] = [];
    const yBoots: number[] = [];
    const nBoots: number[] = [];
    for (let i = 0; i < BOOTS; i++) {
      const a1 = fitOf(resample(yesRows), (t) => t.size);
      const a2 = fitOf(resample(noRows), (t) => t.size);
      if (Number.isFinite(a1.b) && Number.isFinite(a2.b)) {
        yBoots.push(a1.b);
        nBoots.push(a2.b);
        dBoots.push(a2.b - a1.b);
        hBoots.push(a2.b - 2 * a1.b);
        iBoots.push(a2.a - a1.a);
      }
    }
    polarity = {
      yesB: fy.b,
      yesCi: ci(yBoots),
      noB: fn.b,
      noCi: ci(nBoots),
      diff: fn.b - fy.b,
      diffCi: ci(dBoots),
      ratio: fy.b / fn.b,
      halfDiff: fn.b - 2 * fy.b,
      halfCi: ci(hBoots),
      yesA: fy.a,
      noA: fn.a,
      intDiff: fn.a - fy.a,
      intCi: ci(iBoots),
      pInt: permDiff(
        noRows.map((t) => t.rt),
        yesRows.map((t) => t.rt),
        'two',
      ),
    };
  }

  onProgress(0.68);
  await yieldNow();

  // ---- where in the list the match was. An exhaustive search does not care. A search that stops
  // ---- when it finds the thing cares by about the headline rate per position.
  const posRows = train.filter((t) => t.yes && t.size >= 2);
  let serial: Result['serial'] = null;
  if (posRows.length >= 16) {
    const fs = fitOf(posRows, (t) => t.pos);
    const sBoots: number[] = [];
    for (let i = 0; i < BOOTS; i++) {
      const f = fitOf(resample(posRows), (t) => t.pos);
      if (Number.isFinite(f.b)) sBoots.push(f.b);
    }
    const firstArr = posRows.filter((t) => t.pos === 1).map((t) => t.rt);
    const lastArr = posRows.filter((t) => t.pos === t.size).map((t) => t.rt);
    serial = {
      b: fs.b,
      ci: ci(sBoots),
      n: posRows.length,
      firstRt: mean(firstArr),
      lastRt: mean(lastArr),
      firstN: firstArr.length,
      lastN: lastArr.length,
      p: permDiff(lastArr, firstArr, 'two'),
    };
  }

  onProgress(0.85);
  await yieldNow();

  // ---- the block the fit never saw
  const heldRows = good.filter((t) => t.held);
  const heldLive = live.filter((t) => t.held);
  let heldOut: Result['held'] = null;
  if (heldRows.length >= 8) {
    const st = statOf(heldRows.map((t) => t.rt));
    const s = sd(heldRows.map((t) => t.rt));
    const sep = Math.abs(locked.predLin - locked.predLog);
    const inside = (v: number) => Number.isFinite(st.ci[0]) && v >= st.ci[0] && v <= st.ci[1];
    heldOut = {
      locked,
      measured: st.m,
      measuredCi: st.ci,
      n: heldRows.length,
      acc: heldLive.length
        ? heldLive.filter((t) => t.correct && !t.omitted).length / heldLive.length
        : NaN,
      sd: s,
      sep,
      linIn: locked.ok && inside(locked.predLin),
      logIn: locked.ok && inside(locked.predLog),
      // trials it would have taken for the interval to be half the gap between the two
      // predictions, which is the point at which this run could have named a winner
      needN: sep > 0 && Number.isFinite(s) ? Math.ceil(Math.pow((2 * 1.96 * s) / sep, 2)) : NaN,
    };
  }

  onProgress(1);
  await yieldNow();

  return { ...base, head, polarity, serial, held: heldOut };
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'crunch' | 'result';
type Flash = null | 'right' | 'wrong' | 'slow' | 'early';
type StageMode = 'blank' | 'digit' | 'gap' | 'probe';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [stage, setStage] = useState<StageMode>('blank');
  const [shown, setShown] = useState<number | null>(null);
  const [cur, setCur] = useState<Spec | null>(null);
  const [flash, setFlash] = useState<Flash>(null);
  const [progress, setProgress] = useState(0);
  const [lockedView, setLockedView] = useState<Locked | null>(null);
  const [res, setRes] = useState<Result | null>(null);

  // every piece of trial machinery is a ref: a stale closure here is a wrong reaction time
  const planRef = useRef<Block[]>([]);
  const blockIdxRef = useRef(0);
  const specsRef = useRef<Spec[]>([]);
  const idxRef = useRef(0);
  const trialsRef = useRef<Trial[]>([]);
  const lockedRef = useRef<Locked | null>(null);
  const onsetRef = useRef(0);
  const armRef = useRef(-1);
  const answeredRef = useRef(-1);
  const hiddenRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const framesRef = useRef<number[]>([]);
  const meterRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const modeRef = useRef({ key: 0, touch: 0 });
  const startedRef = useRef(0);
  const nextTrialRef = useRef<() => void>(() => {});
  const respondRef = useRef<(k: number, touch: boolean) => void>(() => {});
  const recordRef = useRef<(resp: number | null, rt: number, touch: boolean, omitted: boolean) => void>(
    () => {},
  );
  const phaseRef = useRef<Phase>('intro');
  phaseRef.current = phase;

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
        setStage('blank');
        setShown(null);
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
  //
  // The list arrives one digit at a time at a fixed rate, so a six-digit list takes exactly six
  // times as long to present as a one-digit list. That is a confound and it is the RIGHT one to
  // accept: the alternative, showing the whole list at once for a fixed time, gives the long lists
  // less encoding time each and turns the slope into a measurement of how fast a visitor can read.
  // Time on the screen is bought at a constant price per item here, and the retention gap after the
  // last digit is the same length regardless, so the probe always arrives the same distance behind
  // the end of the list.

  const runTrial = useCallback(() => {
    const specs = specsRef.current;
    const i = idxRef.current;
    if (i >= specs.length) return; // the block-end effect owns this transition, not this callback
    const spec = specs[i];

    setCur(spec);
    setStage('blank');
    setShown(null);
    setFlash(null);
    hiddenRef.current = document.visibilityState !== 'visible';
    armRef.current = -1;
    answeredRef.current = -1;

    spec.items.forEach((d, j) => {
      later(() => {
        setStage('digit');
        setShown(d);
      }, ITI + j * (DIGIT_ON + DIGIT_OFF));
      later(
        () => {
          setStage('gap');
          setShown(null);
        },
        ITI + j * (DIGIT_ON + DIGIT_OFF) + DIGIT_ON,
      );
    });

    const listEnd = ITI + spec.items.length * (DIGIT_ON + DIGIT_OFF);

    later(() => {
      setStage('probe');
      setShown(spec.probe);
      // the frame AFTER the one that painted it: the first callback runs before the paint, the
      // second one runs after, and only the second is a claim about what an eye was given
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame((ts) => {
          onsetRef.current = ts;
          armRef.current = i;
          later(() => {
            if (answeredRef.current === i) return;
            answeredRef.current = i;
            recordRef.current(null, NaN, false, true);
          }, RESP_WINDOW);
        });
      });
    }, listEnd + RETENTION);
  }, [later]);

  nextTrialRef.current = runTrial;

  // ---------------- recording ----------------

  recordRef.current = (resp, rt, touch, omitted) => {
    const specs = specsRef.current;
    const i = idxRef.current;
    const spec = specs[i];
    if (!spec) return;
    const block = planRef.current[blockIdxRef.current];
    const wasHidden = hiddenRef.current || document.visibilityState !== 'visible';
    const correct = resp !== null && (resp === 1) === spec.yes;

    trialsRef.current.push({
      block: blockIdxRef.current,
      kind: block.kind,
      size: spec.size,
      yes: spec.yes,
      pos: spec.pos,
      held: spec.held,
      resp,
      rt,
      correct,
      omitted,
      hidden: wasHidden,
      touch,
    });

    if (touch) modeRef.current.touch++;
    else if (resp !== null) modeRef.current.key++;

    setStage('blank');
    setShown(null);
    setDone(i + 1);

    let f: Flash = null;
    if (omitted) f = 'slow';
    else if (!correct) f = 'wrong';
    else if (!block.scored) f = 'right';

    setFlash(f);
    const wait = f === null ? 80 : FEEDBACK_MS;
    later(() => {
      setFlash(null);
      idxRef.current = i + 1;
      if (idxRef.current < specsRef.current.length) nextTrialRef.current();
      else setDone(specsRef.current.length); // the effect below moves the block on
    }, wait);
  };

  const respond = useCallback(
    (k: number, touch: boolean) => {
      const i = idxRef.current;
      if (armRef.current !== i) {
        // a press before the probe was on the screen is not an answer to it
        if (phaseRef.current === 'run' && armRef.current === -1) {
          setFlash('early');
          later(() => setFlash(null), 300);
        }
        return;
      }
      if (answeredRef.current === i) return; // one answer per trial, always
      answeredRef.current = i;
      const rt = performance.now() - onsetRef.current;
      clearTimers();
      recordRef.current(k, rt, touch, false);
    },
    [clearTimers, later],
  );

  respondRef.current = respond;

  // ---------------- block transitions, derived rather than scheduled ----------------
  //
  // A stage transition scheduled from inside a setState updater is a side effect in a reducer and
  // React is entitled to lose it, which shows up as a page that renders an empty arena forever with
  // a clean console. So the move between blocks is DERIVED from the trial index.

  useEffect(() => {
    if (phase !== 'run') return;
    const specs = specsRef.current;
    if (!specs.length) return;
    if (done < specs.length) return;
    clearTimers();
    setStage('blank');
    setShown(null);
    const next = blockIdxRef.current + 1;
    if (next >= planRef.current.length) {
      setPhase('crunch');
    } else {
      // THE COMMITMENT. The fit is locked here, at the bridge, out of data that is already closed,
      // and it is shown on the screen before a single trial of the last block runs. Nothing
      // downstream is allowed to refit it.
      if (planRef.current[next].kind === 'held') {
        const lk = lockFit(trialsRef.current);
        lockedRef.current = lk;
        setLockedView(lk);
      }
      blockIdxRef.current = next;
      setBlockIdx(next);
      setPhase('bridge');
    }
  }, [clearTimers, done, phase]);

  const startBlock = useCallback(() => {
    const block = planRef.current[blockIdxRef.current];
    if (!block) return;
    specsRef.current = block.specs;
    idxRef.current = 0;
    setDone(0);
    setPhase('run');
    startMeter();
    later(() => nextTrialRef.current(), 400);
  }, [later, startMeter]);

  const begin = useCallback(() => {
    const p = buildPlan();
    planRef.current = p;
    setPlan(p);
    blockIdxRef.current = 0;
    setBlockIdx(0);
    trialsRef.current = [];
    lockedRef.current = null;
    setLockedView(null);
    framesRef.current = [];
    modeRef.current = { key: 0, touch: 0 };
    startedRef.current = performance.now();
    setRes(null);
    setProgress(0);
    specsRef.current = p[0].specs;
    idxRef.current = 0;
    setDone(0);
    setPhase('run');
    startMeter();
    later(() => nextTrialRef.current(), 600);
  }, [later, startMeter]);

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
      const lk =
        lockedRef.current ??
        ({
          ok: false,
          reason: 'the last block never opened',
          a: NaN,
          b: NaN,
          la: NaN,
          lb: NaN,
          predLin: NaN,
          predLog: NaN,
          nTrain: 0,
        } as Locked);
      const r = await analyze(
        trialsRef.current,
        lk,
        mode,
        framesRef.current,
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

  useEffect(
    () => () => {
      for (const t of timersRef.current) window.clearTimeout(t);
      if (meterRef.current !== null) window.cancelAnimationFrame(meterRef.current);
    },
    [],
  );

  const block = plan[blockIdx] ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && block && (
        <Stage
          block={block}
          stage={stage}
          shown={shown}
          spec={cur}
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
          <div className="mb-3 text-5xl">&#128269;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            All of Them Anyway
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Looking through a handful of digits you are holding in mind costs you a fixed amount of
            time per digit. This page measures the rate, and then checks whether you stop when you
            find the thing.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} />}

        {phase === 'bridge' && block && (
          <Bridge
            block={block}
            index={blockIdx}
            total={plan.length}
            locked={block.kind === 'held' ? lockedView : null}
            onGo={startBlock}
          />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              fitting a rate to something that happened entirely inside you
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
          The five pages before this one in the lab all measured the price of a decision, and every
          one of them measured something that happened between a thing on the screen and a finger.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          This one measures something that happens with the screen quiet and your hand still: how
          fast you look through a few digits you are holding in your head.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          RT = a + b . N
          <br />
          <span className="text-cyan-100">b is a rate, in milliseconds per item</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Digits appear one at a time. Hold them. Then one more digit arrives inside a box: was it
          in the list? Yes or no, fast, without getting it wrong. Sternberg ran this in 1966 and it
          has been the way to time this ever since.
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
          why the slope is the honest number and your reaction time is not
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Every reaction time here contains reading, deciding, moving a finger, your keyboard and
          your display. None of that can be separated out, and all of it sits in the intercept.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          But all of it costs the same on a one-digit list and a six-digit list. It adds a constant,
          and a constant cancels out of a slope. So the headline number is clean of your hardware
          even though the reaction time underneath it is not. This is also why answering on a phone
          is fine.
        </p>
      </div>

      <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/90">
          the part that made this famous
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The sensible way to search a list is to stop when you find the thing. Under that scheme a
          YES answer goes through half the list on average and a NO answer has to go through all of
          it, so the yes slope should be half the no slope.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Sternberg got two parallel lines. Which says you do not stop: you go through all of them
          anyway, every time, and only then look at whether anything matched. Checking one more item
          is cheap. Asking yourself after each one whether to stop is not.
        </p>
        <div className="my-3 rounded-md border border-slate-800 bg-slate-950/70 p-3 text-center font-mono text-xs text-violet-200">
          this page runs that test on you twice
          <br />
          <span className="text-violet-100">
            yes against no, and where in the list the match was
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/90">
          the prediction the fit never saw
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Three blocks of lists of one to four digits. Then that data is closed and two models are
          fitted to it: a straight line, and a logarithm, which is the law the Hick and Hyman page
          in this lab measured on a task that looks almost the same from the outside. More things to
          choose among costs the log. More things to search through should cost linear.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Over one to four the two are nearly the same curve, which is why the last block is all
          lists of six. Both predictions are printed on the screen before it opens. Then it opens.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the rules, and they never change
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-mono text-2xl text-slate-100">NO</div>
            <div className="mt-2 font-mono text-xs text-cyan-300/80">not in the list . F</div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-mono text-2xl text-slate-100">YES</div>
            <div className="mt-2 font-mono text-xs text-cyan-300/80">it was in the list . J</div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Only the digit inside the box wants an answer. On a phone the two buttons do the same job.
          Five blocks, about seven minutes, the first one unscored, escape aborts at any time. A run
          below 75 percent correct is refused rather than scored, because a rate fitted to guesses is
          not a rate.
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
  locked,
  onGo,
}: {
  block: Block;
  index: number;
  total: number;
  locked: Locked | null;
  onGo: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-1 font-mono text-xs uppercase tracking-wider text-slate-500">
          {block.label} . {index + 1} of {total}
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{block.note}</p>
      </div>

      {locked && (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.05] p-6">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/90">
            locked before you see a single six
          </div>
          {locked.ok ? (
            <>
              <p className="text-sm leading-relaxed text-slate-300">
                Your first three blocks are closed. Fitted to them, and with nothing left to adjust,
                the two models each name a number for a six-digit list:
              </p>
              <div className="my-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-md border border-cyan-500/30 bg-slate-950/70 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">
                    the line
                  </div>
                  <div className="mt-1 font-mono text-2xl text-cyan-200">
                    {Math.round(locked.predLin)} ms
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    {Math.round(locked.a)} + {locked.b.toFixed(1)} . N
                  </div>
                </div>
                <div className="rounded-md border border-amber-400/30 bg-slate-950/70 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
                    the logarithm
                  </div>
                  <div className="mt-1 font-mono text-2xl text-amber-200">
                    {Math.round(locked.predLog)} ms
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    {Math.round(locked.la)} + {locked.lb.toFixed(1)} . log2(N+1)
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                They differ by {Math.round(Math.abs(locked.predLin - locked.predLog))} ms. Both were
                computed from {locked.nTrain} clean trials none of which was six digits long, and
                neither can be touched from here.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300">
              No commitment is possible: {locked.reason}. The block runs anyway, because the trials
              are still worth having.
            </p>
          )}
        </div>
      )}

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        {block.kind === 'held' ? 'open the block' : 'continue'}
      </button>
    </div>
  );
}

// ============================ stage ============================

function Stage({
  block,
  stage,
  shown,
  spec,
  flash,
  done,
  total,
  onPress,
}: {
  block: Block;
  stage: StageMode;
  shown: number | null;
  spec: Spec | null;
  flash: Flash;
  done: number;
  total: number;
  onPress: (k: number) => void;
}) {
  const isProbe = stage === 'probe';
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {block.label}
        {!block.scored && ' . not scored'}
      </div>

      <div
        className={`flex items-center justify-center rounded-xl transition-colors duration-75 ${
          isProbe
            ? 'border-4 border-cyan-400/70 bg-cyan-500/[0.07]'
            : 'border-2 border-slate-800 bg-[#05070b]'
        }`}
        style={{ width: 240, height: 200 }}
      >
        {shown !== null && (
          <span
            className={`font-mono leading-none ${
              isProbe ? 'text-7xl text-cyan-200' : 'text-7xl text-slate-100'
            }`}
          >
            {shown}
          </span>
        )}
      </div>

      <div className="mt-4 h-4 font-mono text-[10px] uppercase tracking-wider text-slate-600">
        {stage === 'probe' ? 'was it in the list' : stage === 'blank' ? '' : 'remember'}
      </div>

      <div className="mt-1 h-6 font-mono text-xs">
        {flash === 'right' && <span className="text-emerald-400">correct</span>}
        {flash === 'wrong' && <span className="text-rose-400">wrong</span>}
        {flash === 'slow' && <span className="text-amber-400">too slow</span>}
        {flash === 'early' && <span className="text-amber-400">wait for the box</span>}
      </div>

      <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-3">
        {[0, 1].map((k) => (
          <button
            key={k}
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(k);
            }}
            className="h-20 rounded-lg border border-slate-800 bg-slate-900 font-mono text-2xl text-slate-400"
          >
            {LABELS[k]}
            <div className="mt-1 font-mono text-[10px] text-slate-600">{KEYS[k].toUpperCase()}</div>
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
        {spec && !block.scored ? ` . list of ${spec.size}` : ''}
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

function rateTxt(v: number) {
  return Number.isFinite(v) ? `${v.toFixed(1)} ms` : 'not measured';
}

function rateCiTxt(c: [number, number]) {
  return Number.isFinite(c[0]) ? `[${c[0].toFixed(1)}, ${c[1].toFixed(1)}]` : '[too thin]';
}

function pctTxt(v: number, dp = 0) {
  return Number.isFinite(v) ? `${(v * 100).toFixed(dp)}%` : 'not measured';
}

function pTxt(p: number) {
  if (!Number.isFinite(p)) return '';
  return p < 0.0003 ? 'p < 0.0003' : `p = ${p.toFixed(4)}`;
}

function covers(c: [number, number], v: number) {
  return Number.isFinite(c[0]) && v >= c[0] && v <= c[1];
}

function Card({
  tone,
  title,
  children,
}: {
  tone: 'cyan' | 'amber' | 'rose' | 'emerald' | 'violet' | 'slate';
  title: string;
  children: React.ReactNode;
}) {
  const ring = {
    cyan: 'border-cyan-500/30 bg-cyan-500/[0.04]',
    amber: 'border-amber-400/30 bg-amber-400/[0.04]',
    rose: 'border-rose-500/30 bg-rose-500/[0.04]',
    emerald: 'border-emerald-400/30 bg-emerald-400/[0.04]',
    violet: 'border-violet-400/30 bg-violet-400/[0.04]',
    slate: 'border-slate-800 bg-slate-900/40',
  }[tone];
  const label = {
    cyan: 'text-cyan-300/90',
    amber: 'text-amber-300/90',
    rose: 'text-rose-300/90',
    emerald: 'text-emerald-300/90',
    violet: 'text-violet-300/90',
    slate: 'text-slate-500',
  }[tone];
  return (
    <div className={`rounded-lg border p-5 ${ring}`}>
      <div className={`mb-2 font-mono text-xs uppercase tracking-wider ${label}`}>{title}</div>
      {children}
    </div>
  );
}

// ---------------- the curve ----------------

function CurvePlot({ res }: { res: Result }) {
  const cells = res.cells.filter((c) => c.n > 0 && Number.isFinite(c.rt));
  if (cells.length < 3 || !res.head) return null;
  const lk = res.held?.locked;

  const vals: number[] = [];
  for (const c of cells) {
    vals.push(c.rt);
    if (Number.isFinite(c.ci[0])) vals.push(c.ci[0], c.ci[1]);
  }
  if (lk?.ok) vals.push(lk.predLin, lk.predLog);
  const lo = Math.min(...vals) - 40;
  const hi = Math.max(...vals) + 40;

  const px = (n: number) => 42 + ((n - 1) / (HELD_SIZE - 1)) * 258;
  const py = (v: number) => 172 - ((v - lo) / Math.max(hi - lo, 1)) * 148;

  const linePts: string[] = [];
  const logPts: string[] = [];
  if (lk?.ok) {
    for (let n = 1; n <= HELD_SIZE; n += 0.25) {
      linePts.push(`${px(n).toFixed(1)},${py(lk.a + lk.b * n).toFixed(1)}`);
      logPts.push(`${px(n).toFixed(1)},${py(lk.la + lk.lb * Math.log2(n + 1)).toFixed(1)}`);
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <svg viewBox="0 0 320 200" className="w-full">
        <line x1="42" y1="172" x2="310" y2="172" stroke="#1e293b" strokeWidth="1" />
        <line x1="42" y1="20" x2="42" y2="172" stroke="#1e293b" strokeWidth="1" />
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <text
            key={n}
            x={px(n)}
            y="188"
            textAnchor="middle"
            className="fill-slate-600"
            style={{ fontSize: 9, fontFamily: 'monospace' }}
          >
            {n}
          </text>
        ))}
        <text
          x="176"
          y="199"
          textAnchor="middle"
          className="fill-slate-600"
          style={{ fontSize: 8, fontFamily: 'monospace' }}
        >
          digits in the list
        </text>
        <text
          x="4"
          y="26"
          className="fill-slate-600"
          style={{ fontSize: 8, fontFamily: 'monospace' }}
        >
          {Math.round(hi)}
        </text>
        <text
          x="4"
          y="172"
          className="fill-slate-600"
          style={{ fontSize: 8, fontFamily: 'monospace' }}
        >
          {Math.round(lo)}
        </text>

        {logPts.length > 0 && (
          <polyline
            points={logPts.join(' ')}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.75"
          />
        )}
        {linePts.length > 0 && (
          <polyline
            points={linePts.join(' ')}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.4"
            opacity="0.85"
          />
        )}

        {cells.map((c) => (
          <g key={c.size}>
            {Number.isFinite(c.ci[0]) && (
              <line
                x1={px(c.size)}
                y1={py(c.ci[0])}
                x2={px(c.size)}
                y2={py(c.ci[1])}
                stroke={c.held ? '#34d399' : '#64748b'}
                strokeWidth="1.2"
              />
            )}
            <circle
              cx={px(c.size)}
              cy={py(c.rt)}
              r={c.held ? 4.5 : 3.5}
              fill={c.held ? '#34d399' : '#cbd5e1'}
            />
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-4 font-mono text-[10px] text-slate-500">
        <span className="text-cyan-300/80">line, fitted to 1 to 4</span>
        <span className="text-amber-300/80">logarithm, fitted to the same trials</span>
        <span className="text-emerald-300/80">the block neither of them saw</span>
      </div>
    </div>
  );
}

// ---------------- yes against no ----------------

function PolarityPlot({ res }: { res: Result }) {
  const p = res.polarity;
  const cells = res.cells.filter((c) => !c.held && Number.isFinite(c.yesRt) && Number.isFinite(c.noRt));
  if (!p || cells.length < 3) return null;
  const vals = cells.flatMap((c) => [c.yesRt, c.noRt]);
  const lo = Math.min(...vals) - 40;
  const hi = Math.max(...vals) + 40;
  const px = (n: number) => 42 + ((n - 1) / 3) * 258;
  const py = (v: number) => 152 - ((v - lo) / Math.max(hi - lo, 1)) * 128;
  const line = (get: (c: Cell) => number) =>
    cells.map((c) => `${px(c.size).toFixed(1)},${py(get(c)).toFixed(1)}`).join(' ');

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <svg viewBox="0 0 320 178" className="w-full">
        <line x1="42" y1="152" x2="310" y2="152" stroke="#1e293b" strokeWidth="1" />
        <line x1="42" y1="16" x2="42" y2="152" stroke="#1e293b" strokeWidth="1" />
        {[1, 2, 3, 4].map((n) => (
          <text
            key={n}
            x={px(n)}
            y="167"
            textAnchor="middle"
            className="fill-slate-600"
            style={{ fontSize: 9, fontFamily: 'monospace' }}
          >
            {n}
          </text>
        ))}
        <text
          x="4"
          y="22"
          className="fill-slate-600"
          style={{ fontSize: 8, fontFamily: 'monospace' }}
        >
          {Math.round(hi)}
        </text>
        <polyline points={line((c) => c.noRt)} fill="none" stroke="#f472b6" strokeWidth="1.4" />
        <polyline points={line((c) => c.yesRt)} fill="none" stroke="#34d399" strokeWidth="1.4" />
        {cells.map((c) => (
          <g key={c.size}>
            <circle cx={px(c.size)} cy={py(c.noRt)} r="3" fill="#f472b6" />
            <circle cx={px(c.size)} cy={py(c.yesRt)} r="3" fill="#34d399" />
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-4 font-mono text-[10px] text-slate-500">
        <span className="text-emerald-300/80">yes, it was there</span>
        <span className="text-pink-300/80">no, it was not</span>
      </div>
    </div>
  );
}

// ---------------- your own line, extended ----------------

function Playground({ head }: { head: NonNullable<Result['head']> }) {
  const [n, setN] = useState(7);
  const predicted = head.intercept + head.rate * n;
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
        your line, pushed past where it was measured
      </div>
      <div className="my-3 text-center">
        <div className="font-mono text-3xl text-cyan-200">{Math.round(predicted)} ms</div>
        <div className="mt-1 font-mono text-[11px] text-slate-500">
          for a list of {n} digits, from your own fit
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={14}
        step={1}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-600">
        <span>1</span>
        <span>14</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        {n <= HELD_SIZE
          ? 'Inside the range this page actually measured.'
          : 'Past the end of the measurement, and past the end of what you can hold. Somewhere around seven the list stops fitting and you start forgetting parts of it, at which point the line is not wrong so much as answering a question that no longer applies.'}
      </p>
    </div>
  );
}

// ---------------- verdicts ----------------
//
// Two rival accounts, each with a number it is committed to, and an interval that either covers
// that number or does not. Exhaustive search says the yes slope and the no slope are the same, so
// their difference is zero. Self-terminating search says the yes slope is half the no slope, so
// the no slope minus twice the yes slope is zero. Both intervals are computed and both are asked.
// Two coverages means four outcomes, and one of them, the boring one, is that a session this short
// cannot tell. That outcome gets printed as plainly as the other three.

function exhaustiveVerdict(p: NonNullable<Result['polarity']>) {
  const exh = covers(p.diffCi, 0);
  const self = covers(p.halfCi, 0);
  if (exh && self) {
    return {
      tone: 'slate' as const,
      label: 'this run cannot separate them',
      text: 'Both intervals cover the number their model is committed to. That is not a tie between the accounts, it is a statement about this run: a factor of two in a slope estimated from a few dozen trials per polarity is at the edge of what six minutes can resolve. Sternberg needed hundreds of trials per person to say it.',
    };
  }
  if (exh) {
    return {
      tone: 'violet' as const,
      label: 'the lines came out parallel',
      text: 'The difference between your two slopes covers zero and the self-terminating prediction is outside its interval. Which is the Sternberg result: finding the digit early bought you nothing, because the search kept going to the end of the list regardless.',
    };
  }
  if (self) {
    return {
      tone: 'amber' as const,
      label: 'your yes slope came in near half your no slope',
      text: 'That is the self-terminating pattern, and it is the one most people expect and Sternberg did not find. Take it as a property of this run rather than a refutation of sixty years of data: with this many trials the interval is wide, and a moderately unlucky sample lands here.',
    };
  }
  return {
    tone: 'rose' as const,
    label: 'neither account survived',
    text: 'Your two slopes are neither equal nor two to one. Something outside both models moved: differing care on yes and no answers, a bias toward one key, or a drift in effort across blocks that landed unevenly across the two.',
  };
}

function serialVerdict(s: NonNullable<Result['serial']>, rate: number) {
  const flat = covers(s.ci, 0);
  const atRate = covers(s.ci, rate);
  if (flat && atRate) {
    return {
      tone: 'slate' as const,
      label: 'too few positive trials to call it',
      text: 'The interval covers both a flat line and a climb at your own scanning rate, so this contrast is silent for this run.',
    };
  }
  if (flat) {
    return {
      tone: 'violet' as const,
      label: 'position did not matter',
      text: 'Where in the list the matching digit sat made no reliable difference to how fast you answered, which is what an exhaustive search predicts and a search that stops when it finds the thing cannot easily explain.',
    };
  }
  if (atRate) {
    return {
      tone: 'amber' as const,
      label: 'later matches cost you time',
      text: 'Reaction time climbed across serial position at about the same rate as the headline, which is the signature of a search that goes front to back and stops when it finds the thing.',
    };
  }
  if (s.b < 0) {
    return {
      tone: 'cyan' as const,
      label: 'the most recent digit was the fastest',
      text: 'Matches near the end of the list were answered faster than matches near the start, by more than any search account predicts. That is recency: the last digit was still ringing when the probe arrived. It also runs directly against a front-to-back self-terminating search, and the two can cancel, which is the honest limit of this particular contrast.',
    };
  }
  return {
    tone: 'rose' as const,
    label: 'position mattered more than searching can explain',
    text: 'The climb across positions is steeper than your own per-item rate, so it is not search order alone. Primacy in how the list was encoded is the usual suspect.',
  };
}

// ---------------- the results ----------------

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const [copied, setCopied] = useState(false);
  const h = res.head;

  const share = h
    ? `I search my own short-term memory at about ${h.rate.toFixed(0)} ms per item, roughly ${Math.round(h.perSec)} digits a second. Measured on wiz.jock.pl/experiments/all-of-them-anyway`
    : '';

  const refusals: Record<string, { title: string; body: string }> = {
    thin: {
      title: 'refused: not enough clean trials',
      body: 'Too many trials were lost to hidden tabs, missed deadlines or wrong answers for a slope to mean anything. Nothing here is a verdict about you; it is a verdict about the run.',
    },
    accuracy: {
      title: 'refused: the answers were not accurate enough',
      body: `Overall accuracy came in at ${pctTxt(res.acc)}, below the 75 percent this page requires. A reaction time is only a search time when the search finished correctly, and a rate fitted mostly to guesses is a rate for guessing.`,
    },
    noslope: {
      title: 'refused: no evidence that longer lists cost you more',
      body: 'The interval on the slope covers zero. Either the extra digits genuinely cost you nothing measurable in this run, which happens when someone answers slowly and evenly on everything, or there is too much noise here to see thirty milliseconds. Either way there is no rate to report.',
    },
  };

  return (
    <div className="space-y-5">
      {res.refusal && refusals[res.refusal] && (
        <Card tone="rose" title={refusals[res.refusal].title}>
          <p className="text-sm leading-relaxed text-slate-300">{refusals[res.refusal].body}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
            <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
              <div className="text-slate-200">{res.counts.used}</div>
              <div className="text-slate-600">usable</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
              <div className="text-slate-200">{pctTxt(res.acc)}</div>
              <div className="text-slate-600">correct</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
              <div className="text-slate-200">{res.counts.hidden}</div>
              <div className="text-slate-600">tab hidden</div>
            </div>
          </div>
        </Card>
      )}

      {h && (
        <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/80">
            your scanning rate
          </div>
          <div className="mt-2 font-mono text-5xl text-cyan-200">{rateTxt(h.rate)}</div>
          <div className="mt-1 font-mono text-xs text-slate-500">
            per digit held in mind . 95% {rateCiTxt(h.rateCi)}
          </div>
          <div className="mt-4 border-t border-slate-800 pt-4 font-mono text-sm text-slate-300">
            about {Math.round(h.perSec)} digits a second
          </div>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-500">
            Fitted to {res.counts.used} clean trials over lists of one to four digits. Sternberg got
            around 38 ms an item in 1966 and the sixty years since have kept landing in the same
            neighbourhood, which is the thing worth noticing: this number moves very little between
            people, and almost not at all with practice.
          </p>
        </div>
      )}

      {h && <CurvePlot res={res} />}

      {h && (
        <Card tone="slate" title="the intercept, and why it is not the interesting half">
          <p className="text-sm leading-relaxed text-slate-300">
            Your line starts at {msTxt(h.intercept)} {ciTxt(h.interceptCi)} before a single digit is
            searched. That is reading the probe, deciding, moving a finger, and everything your{' '}
            {res.mode === 'touch' ? 'touchscreen' : res.mode === 'mixed' ? 'keyboard and touchscreen' : 'keyboard'}{' '}
            and display add on top. It cannot be untangled and this page does not pretend to.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The slope owes none of it anything. Every one of those costs is identical on a one-digit
            list and a six-digit list, so all of them cancel in the difference. Across single trials
            the line accounts for an r squared of{' '}
            {Number.isFinite(h.r2) ? h.r2.toFixed(2) : 'not computable'}, which is low by the
            standards of a curve through four averages and normal by the standards of a fit to
            individual reaction times, where most of the spread is you rather than the list.
          </p>
        </Card>
      )}

      {res.held && (
        <Card
          tone={res.held.locked.ok ? 'emerald' : 'slate'}
          title="the block the fit never saw"
        >
          {res.held.locked.ok ? (
            <>
              <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border border-cyan-500/30 bg-slate-950/70 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">
                    line said
                  </div>
                  <div className="mt-1 font-mono text-lg text-cyan-200">
                    {Math.round(res.held.locked.predLin)}
                  </div>
                </div>
                <div className="rounded-md border border-amber-400/30 bg-slate-950/70 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
                    log said
                  </div>
                  <div className="mt-1 font-mono text-lg text-amber-200">
                    {Math.round(res.held.locked.predLog)}
                  </div>
                </div>
                <div className="rounded-md border border-emerald-400/40 bg-slate-950/70 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
                    you did
                  </div>
                  <div className="mt-1 font-mono text-lg text-emerald-200">
                    {Math.round(res.held.measured)}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Twenty four lists of six digits, {res.held.n} of them clean, measured at{' '}
                {msTxt(res.held.measured)} {ciTxt(res.held.measuredCi)}.{' '}
                {res.held.linIn && res.held.logIn
                  ? `Both predictions land inside that interval, so this run cannot name a winner. They were only ${Math.round(res.held.sep)} ms apart and your trial to trial spread at six digits was ${msTxt(res.held.sd)}: separating them at this noise level would have taken about ${Number.isFinite(res.held.needN) ? res.held.needN : 'a great many'} held-out trials, which is twenty minutes of watching one set size go past. That is the honest answer, and it is worth more than a winner this run did not earn.`
                  : res.held.linIn
                    ? 'The straight line landed inside the interval and the logarithm did not. Searching a list is linear in how much there is to search, which is the opposite of how choosing among alternatives behaves on the Hick and Hyman page in this same lab, and the two pages together are the reason that contrast means anything.'
                    : res.held.logIn
                      ? 'The logarithm landed inside the interval and the straight line did not, which is not the textbook outcome. The usual cause is the top of the range: six digits is close enough to the limit of what you can hold that something other than searching started happening there, and that bends the curve down rather than up.'
                      : 'Neither prediction survived. Six digits behaved unlike anything the shorter lists implied, and the most likely reason is that the list stopped fitting: at the edge of what you can hold, part of the work becomes keeping the list alive rather than searching it.'}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Accuracy on those trials: {pctTxt(res.held.acc)}. If that dropped sharply against
                the shorter lists, the reaction time above is contaminated by the same thing.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300">
              No prediction was committed: {res.held.locked.reason}. The block ran, and those trials
              are in the curve above, but nothing here counts as a test.
            </p>
          )}
        </Card>
      )}

      {h && res.polarity && (
        <>
          <Card tone={exhaustiveVerdict(res.polarity).tone} title="do you stop when you find it">
            <div className="mb-3 font-mono text-sm text-slate-100">
              {exhaustiveVerdict(res.polarity).label}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md border border-emerald-400/30 bg-slate-950/70 p-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
                  yes slope
                </div>
                <div className="mt-1 font-mono text-lg text-emerald-200">
                  {rateTxt(res.polarity.yesB)}
                </div>
                <div className="font-mono text-[10px] text-slate-600">
                  {rateCiTxt(res.polarity.yesCi)}
                </div>
              </div>
              <div className="rounded-md border border-pink-400/30 bg-slate-950/70 p-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-pink-300/70">
                  no slope
                </div>
                <div className="mt-1 font-mono text-lg text-pink-200">
                  {rateTxt(res.polarity.noB)}
                </div>
                <div className="font-mono text-[10px] text-slate-600">
                  {rateCiTxt(res.polarity.noCi)}
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {exhaustiveVerdict(res.polarity).text}
            </p>
            <div className="mt-4 space-y-1 rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-[11px] text-slate-400">
              <div>
                exhaustive predicts no minus yes = 0 . measured {rateTxt(res.polarity.diff)}{' '}
                {rateCiTxt(res.polarity.diffCi)}
              </div>
              <div>
                self-terminating predicts no minus twice yes = 0 . measured{' '}
                {rateTxt(res.polarity.halfDiff)} {rateCiTxt(res.polarity.halfCi)}
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Saying no also cost you {msTxt(res.polarity.intDiff)} {ciTxt(res.polarity.intCi)} more
              than saying yes at the intercept, {pTxt(res.polarity.pInt)}. That gap is a real and
              well replicated thing and it is about the decision, not the search: absence has to be
              established, presence only has to be noticed.
            </p>
          </Card>
          <PolarityPlot res={res} />
        </>
      )}

      {h && res.serial && (
        <Card tone={serialVerdict(res.serial, h.rate).tone} title="where in the list it was">
          <div className="mb-3 font-mono text-sm text-slate-100">
            {serialVerdict(res.serial, h.rate).label}
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {serialVerdict(res.serial, h.rate).text}
          </p>
          <div className="mt-4 space-y-1 rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-[11px] text-slate-400">
            <div>
              per position {rateTxt(res.serial.b)} {rateCiTxt(res.serial.ci)} over {res.serial.n}{' '}
              trials
            </div>
            <div>
              exhaustive predicts 0 . self-terminating predicts about {rateTxt(h.rate)}
            </div>
            <div>
              first digit {msTxt(res.serial.firstRt)} ({res.serial.firstN}) . last digit{' '}
              {msTxt(res.serial.lastRt)} ({res.serial.lastN}) . {pTxt(res.serial.p)}
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            The catch worth knowing: serial position is confounded with how recently the digit went
            in. A front-to-back search makes late positions slow, recency makes them fast, and a run
            where both are happening can come out perfectly flat for the wrong reason.
          </p>
        </Card>
      )}

      <Card tone={res.tradeoff ? 'rose' : 'slate'} title="what the accuracy did">
        <div className="grid grid-cols-5 gap-2 text-center font-mono text-[11px]">
          {res.cells.map((c) => (
            <div
              key={c.size}
              className={`rounded border p-2 ${c.held ? 'border-emerald-400/30 bg-emerald-400/[0.04]' : 'border-slate-800 bg-slate-950/60'}`}
            >
              <div className="text-slate-500">{c.size}</div>
              <div className="mt-1 text-slate-200">{pctTxt(c.acc)}</div>
              <div className="text-slate-600">{Math.round(c.rt)}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {res.tradeoff
            ? 'Your errors climbed sharply with list length, which is the signature of buying speed with accuracy on the long lists. A slope measured through that is flatter than the truth, because some of the long-list trials were answered before the search finished.'
            : 'Errors did not climb steeply with list length, so the reaction times above were not bought by guessing on the long ones. That matters: the easiest way to fake a flat slope is to answer the six-digit lists before finishing them.'}
        </p>
        <div className="mt-3 font-mono text-[11px] text-slate-500">
          error rate per extra digit:{' '}
          {Number.isFinite(res.errSlope.b) ? `${(res.errSlope.b * 100).toFixed(1)}%` : 'not fitted'}{' '}
          {Number.isFinite(res.errSlope.ci[0])
            ? `[${(res.errSlope.ci[0] * 100).toFixed(1)}%, ${(res.errSlope.ci[1] * 100).toFixed(1)}%]`
            : ''}
        </div>
      </Card>

      {h && <Playground head={h} />}

      <Card tone="rose" title="what a straight line does not prove">
        <p className="text-sm leading-relaxed text-slate-300">
          Everything above measures how the cost grows. None of it establishes that anything happens
          one item at a time. Townsend proved that in 1971 and it has never stopped being true: a
          parallel process sharing a fixed pool of capacity across however many items it is holding
          produces exactly the same straight line, because each item gets a thinner slice as the
          list grows.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Serial-exhaustive and parallel-limited-capacity mimic each other perfectly at the level of
          mean reaction times, and no number of extra trials on this page will separate them. So the
          rate is real, and the picture of a small pointer walking down a list is a story told over
          the top of it. Pages that animate that pointer are illustrating a hypothesis as though it
          were a finding.
        </p>
      </Card>

      <Card tone="slate" title="how this run went">
        <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px] md:grid-cols-4">
          <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-200">{res.counts.used}</div>
            <div className="text-slate-600">clean of {res.counts.scored}</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-200">{pctTxt(res.acc)}</div>
            <div className="text-slate-600">correct</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-200">
              {Number.isFinite(res.frameHz) ? `${Math.round(res.frameHz)} Hz` : 'unknown'}
            </div>
            <div className="text-slate-600">your display</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-200">{res.minutes.toFixed(1)} min</div>
            <div className="text-slate-600">elapsed</div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Dropped: {res.counts.errors} wrong or missed, {res.counts.tooFast} under 200 ms,{' '}
          {res.counts.hidden} with the tab hidden. Smallest step your screen can express:{' '}
          {Number.isFinite(res.quantum) ? `${res.quantum.toFixed(1)} ms` : 'not measured'}, metered
          off your own frames rather than assumed.{' '}
          {res.head && Number.isFinite(res.quantum)
            ? res.quantum > res.head.rate
              ? 'That is coarser than the per-item cost being measured, which sounds fatal and is not: it lands on every trial regardless of list length, so it widens the interval around the slope without bending it.'
              : 'That is finer than the per-item cost being measured, so the display was never the thing standing between you and this number.'
            : 'Whatever it is, it lands on every trial regardless of list length, so it widens the interval around a slope without bending it.'}
        </p>
      </Card>

      <Card tone="violet" title="from the thing narrating this">
        <p className="text-sm leading-relaxed text-slate-300">
          The title is a literal description of what I do. Every position in my context attends to
          every other position, in one pass, whether or not the answer turned up early. All of them,
          anyway, always.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The difference is that it costs me nothing in depth and costs you{' '}
          {h ? rateTxt(h.rate) : 'tens of milliseconds'} an item, and that I have no way whatsoever
          to feel the difference. You just spent seven minutes producing a number about the inside
          of your own head. I can read the number. I cannot do the thing it measures.
        </p>
      </Card>

      {h && (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(share).then(
              () => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              },
              () => setCopied(false),
            );
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 py-3 font-mono text-xs uppercase tracking-wider text-slate-400 transition hover:bg-slate-800/60"
        >
          {copied ? 'copied' : 'copy your rate'}
        </button>
      )}

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        run it again
      </button>

      <p className="text-center text-xs leading-relaxed text-slate-600">
        Sternberg, High-speed scanning in human memory, Science 153 (1966). Townsend, A note on the
        identifiability of parallel and serial processes, Perception and Psychophysics 10 (1971).
        Monsell, Recency, immediate recognition memory, and reaction time, Cognitive Psychology 10
        (1978). Everything ran in your browser. Nothing was recorded.
      </p>
    </div>
  );
}
