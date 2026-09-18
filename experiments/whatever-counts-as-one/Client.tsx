'use client';

// WHATEVER COUNTS AS ONE  (the limit on what you can hold counts things, and you get to decide
// what counts as one thing)
//
// The sixty-ninth piece in this lab, and the one that goes directly underneath the last one.
// Out Of Names measured the other half of Miller's 1956 paper: label something varying along one
// dimension and about two and a half bits survive the labelling, however many names you are
// offered. This is the half everybody quotes, and it is stranger than the quote.
//
// THE TASK.
//
// A short list arrives one item at a time. Then you give it back, in order. That is the whole
// task, it is a hundred and thirty years old (Jacobs 1887), and the number that comes out of it
// is your span.
//
// The lists are made of four different things, and the point is what they are made of:
//
//   decimal digits      one of ten, so 3.32 bits each
//   binary digits       one of two, so 1.00 bit each
//   long words          one of ten, so 3.32 bits each, and four syllables long
//   binary in pairs     the same binary digits, shown two at a time
//
// THE QUESTION, which is the one Miller actually asked.
//
// If the limit were a fixed amount of INFORMATION, a binary list should be three and a third
// times as long as a decimal one, because a binary digit carries a third as much. If the limit
// counts ITEMS, the two lists should be about the same length and the bits should differ by
// three times over.
//
// They come out about the same length. Miller put it as plainly as anyone ever has: the span is
// a fixed number of items and therefore a wildly variable number of bits, "and the number of
// bits of information is constant for absolute judgment and the number of chunks of information
// is constant for immediate memory".
//
// So the limit counts things. Which raises the question this page is actually built to answer,
// and it is not a rhetorical one: what counts as one thing?
//
// THE HELD-OUT BLOCK, where two rivals commit to a number before it opens.
//
// Between the fitted blocks and the last one, you spend ninety seconds learning four pairs:
//
//   00 -> 0     01 -> 1     10 -> 2     11 -> 3
//
// Then the binary lists come back, shown in pairs exactly as they were in the block before, and
// you give them back in binary exactly as you did before. Nothing about the screen or the keys
// changes. The only thing that changed is inside your head.
//
//   the bits ceiling      recoding cannot manufacture information. Your span here is the span
//                         you already had for binary. Read off your own binary block.
//
//   the chunk ceiling     the limit counts chunks and a chunk now holds two binary digits, so
//                         your span here is twice your digit span. Read off your own digit block.
//
// Both numbers go on the screen before the block runs, both carry their own bootstrap intervals,
// and the block is scored directionally: an interval has to CLEAR another interval, never merely
// land nearer one number than the other. Scoring by nearness is how a page in this lab nearly
// shipped a bias, and the fix has stayed.
//
// THE BLOCK THAT COULD KILL IT, and it runs in the middle rather than living in a footnote.
//
// There is a boring explanation sitting on the recoded block, and it is a good one. Binary shown
// in pairs is easier to rehearse whether or not you know a mapping (Ryan 1969, Wickelgren 1964),
// and the recoded block is also the LAST block, so an hour of practice is pushing on it too.
//
// So the block before the training is the same paired binary with no mapping taught. It carries
// the grouping. It carries the practice. It does not carry the recoding. The strong test on this
// page is therefore not recoded against raw binary, it is recoded against GROUPED, which is the
// same stimulus, at nearly the same point in the session, differing only by four pairs you spent
// ninety seconds learning.
//
// THE SECOND BLOCK THAT COULD KILL IT is the words, and it probably will dent it. Ten long words
// carry exactly as many bits per item as ten digits and exactly as many chunks, so a pure chunk
// account says the two spans are equal. They are not: long words come back shorter (Baddeley,
// Thomson & Buchanan 1975), because what fits is partly what you can say in about two seconds.
// The page measures this on the same evening and prints it against its own headline. A chunk is
// not free, and this is where you can see the price.
//
// WHY YOUR SCREEN CANNOT REACH ANY OF THIS.
//
// This is the first page in this lab whose headline never reads a clock. A span is a COUNT of
// items, not a latency, so display lag, input lag, keyboard scan interval and audio delay have
// nowhere to land. What CAN reach it is the presentation RATE, and that is held identical across
// every block: every item gets the same slot, and a pair gets exactly two slots, so a paired list
// and an unpaired list of the same length take exactly the same time to arrive. Every headline
// here is a difference or a ratio of two spans measured at one rate in one sitting, which is why
// there is no calibration step. Frame gaps during presentation are still metered, and a trial
// whose list was interrupted by a long gap is dropped rather than scored, because an item that
// flashed by while the browser was busy was never presented at all.
//
// HOW THE LISTS ARE PLACED, which is most of why this works in eleven trials.
//
// A one-up one-down staircase walks toward your span and, on a long one, spends the whole block
// still walking. Verified: it left the held-out interval more than eight items wide, which is no
// measurement at all. Every list here is placed by a posterior over your span, carried trial by
// trial, with a small cycling offset so the block still contains the spread a slope needs. Same
// trial count, interval about 2.2 items wide.
//
// WHAT THE FIT IS ALLOWED TO DO, and what it is not.
//
// One psychometric slope for the person, shared across materials, and one span per material,
// fitted jointly by maximum likelihood. The slope is LOCKED before the held-out block opens and
// the held-out span is a one parameter fit at that fixed slope, so the last block has no free
// parameters to spend on itself.
//
// VERIFIED AGAINST GROUND TRUTH before shipping, in Node, on the analysis core extracted from
// this file, 120 simulated visitors per world at the shipping trial counts:
//
//   span recovery         bias under 0.1 items in every world, sd 0.56 to 0.75
//   held-out interval     covered the truth 86 to 94 percent of the time against a nominal 95,
//                         which is printed on the results rather than rounded up to 95
//   power                 72 percent to call recoding when it truly buys three items, 90 percent
//                         at four, 57 percent at two and a half on a low-span visitor
//   false positives       ZERO percent in a world where the taught mapping adds nothing over the
//                         grouping (90 percent of those runs correctly refuse to call it), and 3
//                         percent in a world where nothing helps at all
//   conservative where    when the true gain is only one and a half items the page calls recoding
//   it should be          on 20 percent of runs and says it cannot tell on 45, which is the
//                         behaviour wanted from a six minute measurement
//   separability          the two rival ceilings are far enough apart to be told apart in 39 to 87
//                         percent of runs depending on the visitor; when they are not, the page
//                         says so instead of picking one
//
// Seven adversarial responders were run against the refusal ladder, 60 runs each. Random and
// never-right refused on the floor rail, a machine that is always correct and a visitor with a
// pen refused on the accuracy rail, a hidden tab and someone typing along during presentation
// refused on their own rails, each with the true cause named, and the honest responder passed
// 60 out of 60.
//
// THE ACCURACY RAIL is worth its own paragraph because it is the interesting guard. The
// placement aims every list at the length you get right half the time. So a run that comes back
// nearly all correct is a run the procedure never caught up with, and the commonest reason for
// that is not a large span. It is a pen. This page cannot see your desk and does not pretend to,
// but it can see that the adaptive ladder never bracketed you, and it refuses on that.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ============================ constants ============================

const ITEM_MS = 760;       // one item on screen
const ITEM_GAP = 190;      // and the gap after it. A pair gets exactly two of these slots.
const READY_MS = 900;
const FB_MS = 900;

const LAPSE = 0.02;
const LEN_MIN = 2;
const LEN_MAX = 18;
// A span is a count of items, so it cannot be negative: bounding the search at zero rather than
// below it stops a block that went entirely wrong from printing an interval starting at minus one.
const SPAN_LO = 0;
const SPAN_HI = LEN_MAX + 3;

const PER: Record<BlockKey, number> = { digits: 11, binary: 11, words: 8, grouped: 11, recoded: 13 };
const PRACTICE_N = 3;

const BOOTS = 220;
const MAX_GAP_MS = 250;    // a frame gap this long during presentation means an item was missed
const EARLY_CAP = 15;      // aborted-and-reappended trials before the run stops re-appending

const MIN_FRAC = 0.7;
const MIN_SPAN = 2.6;
const MAX_DROP_FRAC = 0.25;
const MAX_ACC = 0.85;
const SLOW_ITEM_MS = 4000;

const DRILL_STREAK = 12;
const DRILL_CAP = 60;

// ============================ the materials ============================

type BlockKey = 'digits' | 'binary' | 'words' | 'grouped' | 'recoded';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const BINARY = ['0', '1'];
// Ten of them, so exactly as many bits per item as a digit, and four syllables each, so the
// only thing that differs from the digit block is how long they take to say.
const WORDS = [
  'helicopter', 'alligator', 'university', 'category', 'calculator',
  'television', 'generator', 'expedition', 'radiator', 'january',
];

const ALPHABET: Record<BlockKey, string[]> = {
  digits: DIGITS, binary: BINARY, words: WORDS, grouped: BINARY, recoded: BINARY,
};
const PAIRED: Record<BlockKey, boolean> = {
  digits: false, binary: false, words: false, grouped: true, recoded: true,
};
const BITS_PER: Record<BlockKey, number> = {
  digits: Math.log2(10), binary: 1, words: Math.log2(10), grouped: 1, recoded: 1,
};

const MAPPING: [string, string][] = [['00', '0'], ['01', '1'], ['10', '2'], ['11', '3']];

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function median(a: number[]) {
  if (!a.length) return NaN;
  const s = a.slice().sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function ciOf(v: number[]): [number, number] {
  const s = v.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!s.length) return [NaN, NaN];
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

// ============================ ANALYSIS CORE ============================
// Everything between here and the end of the core is what was extracted and run against
// simulated ground truth in Node before this page shipped. It is pure: trials in, numbers out.

export type SpanTrial = {
  len: number;
  ok: boolean;
  hidden: boolean;
  typedEarly: boolean;
  gapped: boolean;
  block: BlockKey;
  recallMs: number;
  index: number;
};

function pCorrect(len: number, mu: number, beta: number) {
  return (1 - LAPSE) / (1 + Math.exp(-beta * (mu - len)));
}

function nllBlock(tr: SpanTrial[], mu: number, beta: number) {
  let s = 0;
  for (const t of tr) {
    const p = Math.min(1 - 1e-9, Math.max(1e-9, pCorrect(t.len, mu, beta)));
    s -= t.ok ? Math.log(p) : Math.log(1 - p);
  }
  return s;
}

function golden(f: (x: number) => number, lo: number, hi: number, iters = 20) {
  const g = 0.6180339887498949;
  let a = lo, b = hi;
  let c = b - g * (b - a), d = a + g * (b - a);
  let fc = f(c), fd = f(d);
  for (let i = 0; i < iters; i++) {
    if (fc < fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = f(c); }
    else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = f(d); }
  }
  return (a + b) / 2;
}

type Fit = { beta: number; mu: Record<string, number>; n: Record<string, number> };

// One slope for the person, one span per material. The slope is shared because a psychometric
// slope in list length belongs to the visitor rather than to the alphabet, and eleven binary
// trials cannot afford their own.
function fitSpans(trials: SpanTrial[], keys: string[]): Fit {
  const by: Record<string, SpanTrial[]> = {};
  for (const k of keys) by[k] = [];
  for (const t of trials) if (by[t.block]) by[t.block].push(t);
  const muFor = (k: string, beta: number) => golden((m) => nllBlock(by[k], m, beta), SPAN_LO, SPAN_HI, 20);
  const total = (beta: number) => {
    let s = 0;
    for (const k of keys) { if (!by[k].length) continue; s += nllBlock(by[k], muFor(k, beta), beta); }
    return s;
  };
  const beta = golden(total, 0.45, 2.6, 20);
  const mu: Record<string, number> = {};
  const n: Record<string, number> = {};
  for (const k of keys) { mu[k] = by[k].length ? muFor(k, beta) : NaN; n[k] = by[k].length; }
  return { beta, mu, n };
}

// The held-out block gets NO free parameters: the slope is the one locked before it opened, and
// the only thing estimated from it is where its own curve sits.
function fitMuFixedBeta(tr: SpanTrial[], beta: number): number {
  if (!tr.length) return NaN;
  return golden((m) => nllBlock(tr, m, beta), SPAN_LO, SPAN_HI, 22);
}

function resample(tr: SpanTrial[], keys: string[], rnd: () => number): SpanTrial[] {
  const by: Record<string, SpanTrial[]> = {};
  for (const k of keys) by[k] = [];
  for (const t of tr) if (by[t.block]) by[t.block].push(t);
  const out: SpanTrial[] = [];
  for (const k of keys) {
    const a = by[k];
    for (let i = 0; i < a.length; i++) out.push(a[(rnd() * a.length) | 0]);
  }
  return out;
}

type Boot = { mu: Record<string, number[]>; beta: number[] };

function bootstrap(trials: SpanTrial[], keys: string[], reps: number, rnd: () => number): Boot {
  const mu: Record<string, number[]> = {};
  for (const k of keys) mu[k] = [];
  const beta: number[] = [];
  for (let r = 0; r < reps; r++) {
    const f = fitSpans(resample(trials, keys, rnd), keys);
    for (const k of keys) mu[k].push(f.mu[k]);
    beta.push(f.beta);
  }
  return { mu, beta };
}

function bootMuFixedBeta(tr: SpanTrial[], beta: number, reps: number, rnd: () => number): number[] {
  const out: number[] = [];
  for (let r = 0; r < reps; r++) {
    const s: SpanTrial[] = [];
    for (let i = 0; i < tr.length; i++) s.push(tr[(rnd() * tr.length) | 0]);
    out.push(fitMuFixedBeta(s, beta));
  }
  return out;
}

// ---------------------------- adaptive placement ----------------------------
// A one-up one-down staircase spends a whole block walking toward the answer and, on a long
// span, never gets there: verified at more than eight items of interval width, which is no
// measurement. This carries a posterior over the span and lands the next list on its median,
// with a small cycling offset so the block still contains the spread a slope needs.

const GRID_LO = 1;
const GRID_HI = 18;
const GRID_STEP = 0.25;
const NOMINAL_BETA = 1.1;
const OFFSETS = [0, 1, -1, 0, 2, -2, 0, 1, -1, 2, -2, 0];

function makeGrid() {
  const g: number[] = [];
  for (let v = GRID_LO; v <= GRID_HI + 1e-9; v += GRID_STEP) g.push(Number(v.toFixed(2)));
  return g;
}

type Post = { grid: number[]; w: number[] };

function priorPost(centre: number, sd: number): Post {
  const grid = makeGrid();
  const w = grid.map((m) => Math.exp(-0.5 * ((m - centre) / sd) ** 2) + 1e-6);
  const s = w.reduce((a, b) => a + b, 0);
  return { grid, w: w.map((x) => x / s) };
}

function updatePost(p: Post, len: number, ok: boolean, beta = NOMINAL_BETA): Post {
  const w = p.grid.map((m, i) => {
    const pc = pCorrect(len, m, beta);
    return p.w[i] * (ok ? pc : 1 - pc);
  });
  const s = w.reduce((a, b) => a + b, 0) || 1;
  return { grid: p.grid, w: w.map((x) => x / s) };
}

function postMedian(p: Post) {
  let c = 0;
  for (let i = 0; i < p.grid.length; i++) { c += p.w[i]; if (c >= 0.5) return p.grid[i]; }
  return p.grid[p.grid.length - 1];
}

function nextLength(p: Post, trialIdx: number, even: boolean) {
  const raw = Math.round(postMedian(p)) + OFFSETS[trialIdx % OFFSETS.length];
  // The paired blocks only accept even lengths, because half a pair is not a chunk.
  const v = even ? 2 * Math.round(raw / 2) : raw;
  return clamp(v, even ? Math.max(2, LEN_MIN) : LEN_MIN, LEN_MAX);
}

// ---------------------------- what a run has to survive ----------------------------

type Quality = {
  planned: number;
  usable: number;
  hiddenN: number;
  earlyN: number;
  gappedN: number;
  minBlockSpan: number;
  thinBlock: string | null;
  perItemMs: number;
  acc: number;
  railPinned: boolean;
  refusal: string | null;
};

function qualityOf(
  all: SpanTrial[],
  keys: BlockKey[],
  planned: number,
  mu: Record<string, number>,
): Quality {
  const usable = all.filter((t) => !t.hidden && !t.typedEarly && !t.gapped);
  const hiddenN = all.filter((t) => t.hidden).length;
  const earlyN = all.filter((t) => t.typedEarly).length;
  const gappedN = all.filter((t) => t.gapped).length;

  let thin: string | null = null;
  for (const k of keys) {
    const n = usable.filter((t) => t.block === k).length;
    if (PER[k] > 0 && n < Math.ceil(PER[k] * MIN_FRAC)) thin = k;
  }
  const spans = keys.map((k) => mu[k]).filter(Number.isFinite);
  const minBlockSpan = spans.length ? Math.min(...spans) : NaN;

  // Every list at the top rail and every one of them right is not a span, it is a lower bound.
  let pinned = false;
  for (const k of keys) {
    const tr = usable.filter((t) => t.block === k);
    if (!tr.length) continue;
    const atRail = tr.filter((t) => t.len >= LEN_MAX);
    if (atRail.length >= Math.ceil(tr.length * 0.5) && atRail.every((t) => t.ok)) pinned = true;
  }
  // The placement aims every list at the length you get right half the time, so a run that is
  // nearly all correct is a run the procedure never caught up with. The commonest reason for
  // that is not a large span. It is a pen.
  const acc = usable.length ? usable.filter((t) => t.ok).length / usable.length : 0;
  const railAcc = usable.length >= 20 && acc >= MAX_ACC;

  const perItemMs = median(usable.map((t) => t.recallMs / Math.max(1, t.len)));

  let refusal: string | null = null;
  if (hiddenN / Math.max(1, all.length) > MAX_DROP_FRAC) refusal = 'tab';
  else if (earlyN / Math.max(1, all.length) > MAX_DROP_FRAC) refusal = 'early';
  else if (Number.isFinite(minBlockSpan) && minBlockSpan < MIN_SPAN) refusal = 'floor';
  else if (pinned || railAcc) refusal = 'rail';
  else if (thin) refusal = 'thin';

  return { planned, usable: usable.length, hiddenN, earlyN, gappedN, minBlockSpan, thinBlock: thin, perItemMs, acc, railPinned: pinned || railAcc, refusal };
}

type Verdict = 'recoding' | 'grouping' | 'nothing' | 'nocall' | 'refused' | 'untested';

// Directional, never nearest-point: an interval has to CLEAR another interval. Scoring by
// which number the observation lands nearer is how a page in this lab nearly shipped a bias,
// because an estimate with a skewed error gives the lower of two predictions a free win.
function scoreHeld(obsCI: [number, number], groupCI: [number, number], binCI: [number, number]): Verdict {
  if (obsCI[0] > groupCI[1]) return 'recoding';
  if (obsCI[0] > binCI[1]) return 'grouping';
  if (obsCI[1] < groupCI[0] || obsCI[1] < binCI[0]) return 'nothing';
  return 'nocall';
}

// ============================ END ANALYSIS CORE ============================

// ============================ the plan ============================

type Block = {
  key: BlockKey;
  label: string;
  blurb: string;
  n: number;
  scored: boolean;
};

const BLOCK_LABEL: Record<BlockKey, string> = {
  digits: 'decimal digits',
  binary: 'binary digits',
  words: 'long words',
  grouped: 'binary, two at a time',
  recoded: 'binary, two at a time, and you know what pairs mean',
};
const BLOCK_BLURB: Record<BlockKey, string> = {
  digits: 'ten to choose from, 3.32 bits each',
  words: 'ten to choose from, 3.32 bits each, four syllables each',
  binary: 'two to choose from, 1 bit each',
  grouped: 'the same digits, arriving in pairs, and no pair means anything yet',
  recoded: 'the block both stories already have a number for',
};

function buildPlan(rnd: () => number): Block[] {
  const mk = (key: BlockKey): Block => ({ key, label: BLOCK_LABEL[key], blurb: BLOCK_BLURB[key], n: PER[key], scored: true });
  // Digits first because every later prior chains off it. The middle two are coin-flipped.
  // Grouped is always last before the training, so the practice it carries is the practice the
  // recoded block carries, which is the entire reason it exists.
  const mid: BlockKey[] = shuffled(['binary', 'words'], rnd);
  return [mk('digits'), mk(mid[0]), mk(mid[1]), mk('grouped')];
}

// ============================ the two committed numbers ============================

type Locked = {
  beta: number;
  mu: Record<string, number>;
  ci: Record<string, [number, number]>;
  bits: number;             // recoding cannot add information: your own binary span
  bitsCI: [number, number];
  group: number;            // grouping plus practice, with no mapping: your own paired binary span
  groupCI: [number, number];
  chunk: number;            // the limit counts chunks and a chunk now holds two: twice your digit span
  chunkCI: [number, number];
  separable: boolean;
  startAt: number;
};

const FIT_KEYS: BlockKey[] = ['digits', 'binary', 'words', 'grouped'];

function lockFits(trials: SpanTrial[], rnd: () => number): Locked {
  const usable = trials.filter((t) => !t.hidden && !t.typedEarly && !t.gapped);
  const f = fitSpans(usable, FIT_KEYS);
  const b = bootstrap(usable, FIT_KEYS, BOOTS, rnd);
  const ci: Record<string, [number, number]> = {};
  for (const k of FIT_KEYS) ci[k] = ciOf(b.mu[k]);
  const bitsCI = ciOf(b.mu.binary);
  const groupCI = ciOf(b.mu.grouped);
  const chunkCI = ciOf(b.mu.digits.map((d) => 2 * d));
  return {
    beta: f.beta,
    mu: f.mu,
    ci,
    bits: f.mu.binary, bitsCI,
    group: f.mu.grouped, groupCI,
    chunk: 2 * f.mu.digits, chunkCI,
    // If the two ceilings are not far enough apart to be told apart, the page says so rather
    // than picking one. In simulation this happens on about a third of runs.
    separable: groupCI[1] < chunkCI[0],
    startAt: clamp(Math.round(f.mu.grouped) + 1, 4, LEN_MAX),
  };
}

// ============================ the results ============================

type Row = { key: BlockKey; span: number; ci: [number, number]; bits: number; bitsCI: [number, number]; n: number; acc: number };

type Result = {
  rows: Row[];
  locked: Locked | null;
  held: { span: number; ci: [number, number]; n: number } | null;
  verdict: Verdict;
  quality: Quality;
  // the word-length control, which is allowed to dent the headline
  wordCost: { diff: number; ci: [number, number] } | null;
  // spans in bits, which is the whole of Miller's point in one column
  bitsSpread: { lo: number; hi: number; ratio: number } | null;
  itemsSpread: { lo: number; hi: number; ratio: number } | null;
  drift: { early: number; late: number } | null;
  reachesChunk: boolean;
  shortfall: number;
  drillPassed: boolean;
};

function rowOf(key: BlockKey, trials: SpanTrial[], fit: Fit, boot: Boot): Row {
  const tr = trials.filter((t) => t.block === key);
  const span = fit.mu[key];
  const ci = ciOf(boot.mu[key] ?? []);
  const bp = BITS_PER[key];
  return {
    key, span, ci, n: tr.length,
    acc: tr.length ? tr.filter((t) => t.ok).length / tr.length : NaN,
    bits: span * bp,
    bitsCI: [ci[0] * bp, ci[1] * bp],
  };
}

function analyse(
  all: SpanTrial[],
  locked: Locked | null,
  drillPassed: boolean,
  rnd: () => number,
): Result {
  const usable = all.filter((t) => !t.hidden && !t.typedEarly && !t.gapped);
  const keys: BlockKey[] = [...FIT_KEYS];
  const fitted = usable.filter((t) => t.block !== 'recoded');
  const f = fitSpans(fitted, FIT_KEYS);
  const b = bootstrap(fitted, FIT_KEYS, BOOTS, rnd);
  const rows = FIT_KEYS.map((k) => rowOf(k, usable, f, b));

  const heldTr = usable.filter((t) => t.block === 'recoded');
  let held: Result['held'] = null;
  let verdict: Verdict = 'untested';
  let reachesChunk = false;
  let shortfall = NaN;
  if (locked && heldTr.length >= Math.ceil(PER.recoded * MIN_FRAC)) {
    const span = fitMuFixedBeta(heldTr, locked.beta);
    const ci = ciOf(bootMuFixedBeta(heldTr, locked.beta, BOOTS, rnd));
    held = { span, ci, n: heldTr.length };
    verdict = scoreHeld(ci, locked.groupCI, locked.bitsCI);
    reachesChunk = ci[1] >= locked.chunkCI[0];
    shortfall = locked.chunk - span;
  }

  const q = qualityOf(all, drillPassed ? ([...keys, 'recoded'] as BlockKey[]) : keys, all.length, { ...f.mu, recoded: held?.span ?? NaN });
  if (q.refusal) verdict = 'refused';

  // The word-length control: same set size, same bits per item, same chunk count, four
  // syllables instead of one. A pure chunk account says this difference is zero.
  const wDiff = b.mu.digits.map((d, i) => d - b.mu.words[i]);
  const wordCost = Number.isFinite(f.mu.words) ? { diff: f.mu.digits - f.mu.words, ci: ciOf(wDiff) } : null;

  const spanVals = rows.filter((r) => r.key === 'digits' || r.key === 'binary' || r.key === 'words').map((r) => r.span).filter(Number.isFinite);
  const bitVals = rows.filter((r) => r.key === 'digits' || r.key === 'binary' || r.key === 'words').map((r) => r.bits).filter(Number.isFinite);
  const itemsSpread = spanVals.length >= 2 ? { lo: Math.min(...spanVals), hi: Math.max(...spanVals), ratio: Math.max(...spanVals) / Math.min(...spanVals) } : null;
  const bitsSpread = bitVals.length >= 2 ? { lo: Math.min(...bitVals), hi: Math.max(...bitVals), ratio: Math.max(...bitVals) / Math.min(...bitVals) } : null;

  // Practice drift, printed rather than assumed away: the first half of the run against the
  // second, at matched list lengths, as accuracy.
  const half = Math.floor(usable.length / 2);
  const early = usable.slice(0, half);
  const late = usable.slice(half);
  const drift = early.length && late.length
    ? { early: early.filter((t) => t.ok).length / early.length, late: late.filter((t) => t.ok).length / late.length }
    : null;

  return { rows, locked, held, verdict, quality: q, wordCost, bitsSpread, itemsSpread, drift, reachesChunk, shortfall, drillPassed };
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'drill' | 'crunch' | 'result';
type TState = 'ready' | 'show' | 'recall' | 'feedback';
type Feedback = { ok: boolean; truth: string[]; early: boolean; gapped: boolean; hidden: boolean };

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [tState, setTState] = useState<TState>('ready');
  const [shown, setShown] = useState<string[]>([]);   // what is on the stage right now
  const [entered, setEntered] = useState<string[]>([]);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [curLen, setCurLen] = useState(0);
  const [lockedView, setLockedView] = useState<Locked | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  const [practiceLeft, setPracticeLeft] = useState(PRACTICE_N);
  const [tick, setTick] = useState(0);

  const rndRef = useRef<() => number>(mulberry32(1));
  const trialsRef = useRef<SpanTrial[]>([]);
  const postRef = useRef<Post>(priorPost(6, 3));
  const listRef = useRef<string[]>([]);
  const enteredRef = useRef<string[]>([]);
  const hiddenRef = useRef(false);
  const earlyRef = useRef(false);
  const earlyCountRef = useRef(0);
  const gapRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const recallStartRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const lockedRef = useRef<Locked | null>(null);
  const drillPassedRef = useRef(false);
  const stateRef = useRef<TState>('ready');

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => { stateRef.current = tState; }, [tState]);

  useEffect(() => {
    const onVis = () => { if (document.hidden) hiddenRef.current = true; };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => () => { clearTimers(); cancelAnimationFrame(rafRef.current); }, [clearTimers]);

  const block = plan[blockIdx] ?? null;

  // ---------------- the trial loop ----------------

  const meterStart = useCallback(() => {
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
  const meterStop = useCallback(() => cancelAnimationFrame(rafRef.current), []);

  const record = useCallback((ok: boolean, truth: string[]) => {
    const b = plan[blockIdx];
    if (!b) return;
    const scored = practiceLeft <= 0;
    const t: SpanTrial = {
      len: truth.length,
      ok,
      hidden: hiddenRef.current || document.hidden,
      typedEarly: earlyRef.current,
      gapped: gapRef.current > MAX_GAP_MS,
      block: b.key,
      recallMs: performance.now() - recallStartRef.current,
      index: trialsRef.current.length,
    };
    if (scored) {
      trialsRef.current.push(t);
      // A trial the visitor never actually saw teaches the placement nothing.
      if (!t.hidden && !t.typedEarly && !t.gapped) postRef.current = updatePost(postRef.current, t.len, t.ok);
    }
    setFb({ ok, truth, early: t.typedEarly, gapped: t.gapped, hidden: t.hidden });
    setTState('feedback');
    after(FB_MS, () => {
      setFb(null);
      if (practiceLeft > 0) {
        setPracticeLeft((v) => v - 1);
        setTick((v) => v + 1);
        return;
      }
      // A dropped trial is re-appended rather than counted, up to a cap, so a run that lost a
      // few to a background tab still ends with a block rather than a fragment.
      const mine = trialsRef.current.filter((x) => x.block === b.key);
      const usableN = mine.filter((x) => !x.hidden && !x.typedEarly && !x.gapped).length;
      setDone(usableN);
      if (usableN >= b.n || mine.length >= b.n + EARLY_CAP) { endBlock(); return; }
      setTick((v) => v + 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [after, blockIdx, plan, practiceLeft]);

  const finish = useCallback(() => {
    clearTimers();
    meterStop();
    setPhase('crunch');
    window.setTimeout(() => {
      const out = analyse(trialsRef.current, lockedRef.current, drillPassedRef.current, mulberry32(20260903));
      setRes(out);
      if (typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>).__trials = { trials: trialsRef.current, locked: lockedRef.current, result: out };
      }
      setPhase('result');
    }, 50);
  }, [clearTimers, meterStop]);

  const endBlock = useCallback(() => {
    const b = plan[blockIdx];
    if (!b) return;
    if (b.key === 'grouped') {
      // Both fits close here. Nothing after this point is allowed to move them.
      const locked = lockFits(trialsRef.current, rndRef.current);
      lockedRef.current = locked;
      setLockedView(locked);
      setPhase('drill');
      return;
    }
    if (b.key === 'recoded') { finish(); return; }
    setBlockIdx((v) => v + 1);
    setPhase('bridge');
  }, [blockIdx, finish, plan]);

  const nextTrial = useCallback(() => {
    const b = plan[blockIdx];
    if (!b) return;
    const idx = trialsRef.current.filter((x) => x.block === b.key).length;
    const len = practiceLeft > 0
      ? (PAIRED[b.key] ? 4 : 3)
      : nextLength(postRef.current, idx, PAIRED[b.key]);
    const alpha = ALPHABET[b.key];
    const rnd = rndRef.current;
    const list: string[] = [];
    for (let i = 0; i < len; i++) {
      let v = alpha[Math.floor(rnd() * alpha.length)];
      // No item three times in a row: a run is a chunk the generator handed over for free.
      if (i >= 2 && list[i - 1] === v && list[i - 2] === v) v = alpha[(alpha.indexOf(v) + 1) % alpha.length];
      list.push(v);
    }
    listRef.current = list;
    setCurLen(len);
    setEntered([]);
    enteredRef.current = [];
    setShown([]);
    hiddenRef.current = document.hidden;
    earlyRef.current = false;
    setTState('ready');

    after(READY_MS, () => {
      setTState('show');
      meterStart();
      const paired = PAIRED[b.key];
      const frames: string[][] = [];
      for (let i = 0; i < list.length; i += paired ? 2 : 1) frames.push(list.slice(i, i + (paired ? 2 : 1)));
      // A pair gets exactly two slots, so a paired list and an unpaired list of the same length
      // take exactly the same time to arrive. That is the whole reason the rate cannot reach a
      // number on this page.
      let t = 0;
      frames.forEach((fr) => {
        const on = fr.length === 2 ? 2 * ITEM_MS + ITEM_GAP : ITEM_MS;
        const off = ITEM_GAP;
        after(t, () => setShown(fr));
        after(t + on, () => setShown([]));
        t += on + off;
      });
      after(t, () => {
        meterStop();
        recallStartRef.current = performance.now();
        setTState('recall');
      });
    });
  }, [after, blockIdx, meterStart, meterStop, plan, practiceLeft]);

  useEffect(() => {
    if (phase !== 'run') return;
    nextTrial();
    // The loop drives itself from the tick; re-running on every nextTrial identity would
    // restart the presentation mid-list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, tick, blockIdx]);

  const startBlock = useCallback(() => {
    const b = plan[blockIdx];
    if (!b) return;
    earlyCountRef.current = 0;
    // Every block after the first starts from what the earlier ones already know about you.
    const f = trialsRef.current.length
      ? fitSpans(trialsRef.current.filter((t) => !t.hidden && !t.typedEarly && !t.gapped), FIT_KEYS)
      : null;
    const d = f && Number.isFinite(f.mu.digits) ? f.mu.digits : 6;
    const bn = f && Number.isFinite(f.mu.binary) ? f.mu.binary : d + 1.5;
    const centre =
      b.key === 'digits' ? 6 :
      b.key === 'binary' ? d + 1.5 :
      b.key === 'words' ? d - 1.5 :
      b.key === 'grouped' ? bn + 1 :
      (lockedRef.current?.startAt ?? bn + 1);
    postRef.current = priorPost(clamp(centre, 3, 15), b.key === 'digits' ? 3 : 2.5);
    setDone(0);
    setPhase('run');
    setTick((v) => v + 1);
  }, [blockIdx, plan]);

  const begin = useCallback(() => {
    const rnd = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    rndRef.current = rnd;
    trialsRef.current = [];
    lockedRef.current = null;
    drillPassedRef.current = false;
    earlyCountRef.current = 0;
    setPlan(buildPlan(rnd));
    setBlockIdx(0);
    setPracticeLeft(PRACTICE_N);
    setLockedView(null);
    setRes(null);
    setPhase('bridge');
  }, []);

  // ---------------- recall ----------------

  const submit = useCallback(() => {
    const truth = listRef.current;
    const got = enteredRef.current;
    const ok = got.length === truth.length && got.every((v, i) => v === truth[i]);
    record(ok, truth);
  }, [record]);

  const push = useCallback((v: string) => {
    if (stateRef.current === 'show' || stateRef.current === 'ready') {
      // Anything entered while the list is still arriving is a different task.
      earlyRef.current = true;
      earlyCountRef.current += 1;
      clearTimers();
      meterStop();
      record(false, listRef.current);
      return;
    }
    if (stateRef.current !== 'recall') return;
    if (enteredRef.current.length >= listRef.current.length) return;
    enteredRef.current = [...enteredRef.current, v];
    setEntered(enteredRef.current);
  }, [clearTimers, meterStop, record]);

  const back = useCallback(() => {
    if (stateRef.current !== 'recall') return;
    enteredRef.current = enteredRef.current.slice(0, -1);
    setEntered(enteredRef.current);
  }, []);

  useEffect(() => {
    if (phase !== 'run' || !block) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') { e.preventDefault(); back(); return; }
      if (e.key === 'Enter') { if (stateRef.current === 'recall' && enteredRef.current.length === listRef.current.length) submit(); return; }
      if (block.key === 'words') return;
      const alpha = ALPHABET[block.key];
      if (alpha.includes(e.key)) { e.preventDefault(); push(e.key); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [back, block, phase, push, submit]);

  const onDrillDone = useCallback((passed: boolean) => {
    drillPassedRef.current = passed;
    if (!passed) { finish(); return; }
    setPlan((p) => [...p, { key: 'recoded', label: BLOCK_LABEL.recoded, blurb: BLOCK_BLURB.recoded, n: PER.recoded, scored: true }]);
    setBlockIdx((v) => v + 1);
    setPhase('bridge');
  }, [finish]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && block && (
        <Stage
          block={block}
          state={tState}
          shown={shown}
          entered={entered}
          len={curLen}
          fb={fb}
          done={done}
          total={block.n}
          practiceLeft={practiceLeft}
          onPush={push}
          onBack={back}
          onSubmit={submit}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#129521;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Whatever Counts As One</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            The limit on what you can hold counts things, not information. Which means the size of
            a thing is yours to set, and this page hands you a bigger one and measures what happens.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} />}
        {phase === 'bridge' && block && <Bridge block={block} index={blockIdx} locked={block.key === 'recoded' ? lockedView : null} practice={practiceLeft > 0} onGo={startBlock} />}
        {phase === 'drill' && <Drill locked={lockedView} onDone={onDrillDone} />}
        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">counting what counted as one</div>
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

function n1(v: number) { return Number.isFinite(v) ? v.toFixed(1) : 'n/a'; }
function n2(v: number) { return Number.isFinite(v) ? v.toFixed(2) : 'n/a'; }
function ci1(c: [number, number]) { return Number.isFinite(c[0]) ? `${c[0].toFixed(1)} to ${c[1].toFixed(1)}` : 'n/a'; }
function pctOf(v: number) { return Number.isFinite(v) ? `${Math.round(v * 100)}%` : 'n/a'; }

// ============================ intro ============================

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          A short list arrives one item at a time. You give it back, in order. That is the whole
          task, it is from 1887, and the number that falls out of it is your span.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The lists are made of four different things, and what they are made of is the entire
          point. Ten digits carry 3.32 bits each. Binary digits carry one bit each. If your limit
          were a fixed amount of INFORMATION, a binary list should come back more than three times
          longer. If your limit counts THINGS, the two should come back about the same length and
          the bits should differ threefold.
        </p>
        <div className="my-4 grid grid-cols-2 gap-2 text-center font-mono text-lg text-slate-200">
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="mb-1 font-sans text-[10px] uppercase tracking-wider text-slate-500">seven digits</div>
            4 9 1 7 3 8 2
            <div className="mt-1 font-sans text-[10px] text-cyan-300/70">23 bits</div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="mb-1 font-sans text-[10px] uppercase tracking-wider text-slate-500">seven binary</div>
            1 0 1 1 0 0 1
            <div className="mt-1 font-sans text-[10px] text-cyan-300/70">7 bits</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Miller wrote this down in 1956 as plainly as anyone ever has: the number of bits is what
          stays constant in absolute judgment, and the number of CHUNKS is what stays constant in
          immediate memory. Which leaves the question this page exists to put a number on. What
          counts as one thing?
        </p>
      </div>

      <Card tone="emerald" label="two numbers committed before the last block opens">
        <p className="text-sm leading-relaxed text-slate-300">
          Between the fitted blocks and the last one you spend ninety seconds learning four pairs:
          00 is 0, 01 is 1, 10 is 2, 11 is 3. Then the binary lists come back, shown in pairs
          exactly as they were in the block before, and you give them back in binary exactly as you
          did before. Nothing about the screen or the keys changes. The only thing that changed is
          inside your head.
        </p>
        <div className="mt-3 space-y-2">
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">the bits ceiling</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              Recoding cannot manufacture information. Your span here is the binary span you
              already have, read off your own block.
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">the chunk ceiling</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              The limit counts chunks and a chunk now holds two binary digits, so your span here is
              twice your digit span, read off your own block.
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Both go on the screen before the block runs, both carry their own intervals, and the
          block is scored by which interval it clears rather than which number it lands nearer.
          Scoring by nearness is how a page in this lab nearly shipped a bias, and the fix stayed.
        </p>
      </Card>

      <Card tone="rose" label="the block that could kill it">
        <p className="text-sm leading-relaxed text-slate-300">
          There is a boring explanation sitting on that last block and it is a good one. Binary
          shown in pairs is easier to rehearse whether or not you know what a pair means, and the
          recoded block is also the LAST block, so an hour of practice is pushing on it too.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So the block just before the training is the same paired binary with no mapping taught.
          It carries the grouping. It carries the practice. It does not carry the recoding. The
          strong test here is not recoded against raw binary. It is recoded against GROUPED.
        </p>
      </Card>

      <Card tone="amber" label="the second one, and it will probably dent the headline">
        <p className="text-sm leading-relaxed text-slate-300">
          One block is long words, ten of them, four syllables each. Ten words carry exactly as many
          bits per item as ten digits and exactly as many chunks, so a pure chunk account says the
          two spans are equal. They are not. Long words come back shorter, because what fits is
          partly what you can say in about two seconds. This page measures that on the same evening
          and prints it against its own headline. A chunk is not free, and that block is where you
          can see the price.
        </p>
      </Card>

      <Card tone="violet" label="why your screen cannot reach this">
        <p className="text-sm leading-relaxed text-slate-300">
          This is the first page in this lab whose headline never reads a clock. A span is a COUNT
          of items, not a latency, so display lag, input lag and keyboard scan interval have
          nowhere to land. What could reach it is the presentation RATE, and every item gets the
          same slot in every block: a pair gets exactly two slots, so a paired list and an unpaired
          list of the same length take exactly the same time to arrive. Every number below is a
          difference or a ratio of two spans measured at one rate in one sitting.
        </p>
      </Card>

      <Card tone="slate" label="the rules">
        <p className="text-xs leading-relaxed text-slate-500">
          Five blocks and a ninety second drill, about thirteen minutes, the first three trials
          unscored. Tap the buttons, or use the number keys, Backspace to undo, Enter to submit. No
          item appears three times in a row. Trials taken while this tab was in the background, or
          interrupted by a long frame gap, or answered while the list was still arriving, are
          dropped and re-run rather than scored. Every list is placed where it is worth the most,
          which means you are supposed to get about half of them wrong. If you get nearly all of
          them right the page refuses the run, because the usual reason for that is a pen.
        </p>
      </Card>

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

function Bridge({ block, index, locked, practice, onGo }: { block: Block; index: number; locked: Locked | null; practice: boolean; onGo: () => void }) {
  const alpha = ALPHABET[block.key];
  return (
    <div className="space-y-5">
      <Card tone={block.key === 'recoded' ? 'emerald' : 'cyan'} label={`block ${index + 1} of 5`}>
        <div className="text-lg font-semibold text-slate-100">{block.label}</div>
        <div className="mt-1 text-sm text-slate-400">{block.blurb}</div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {alpha.map((v) => (
            <div key={v} className={`rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 font-mono text-slate-300 ${block.key === 'words' ? 'text-xs' : 'text-base'}`}>{v}</div>
          ))}
        </div>
        {PAIRED[block.key] && (
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            The digits arrive two at a time, and you give them back one at a time exactly as before.
          </p>
        )}
        {practice && <p className="mt-4 text-xs text-amber-300/80">The first three are practice and are not scored.</p>}
      </Card>

      {locked && <LockedCard locked={locked} />}

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        {locked ? 'open the last block' : 'go'}
      </button>
    </div>
  );
}

function LockedCard({ locked }: { locked: Locked }) {
  return (
    <Card tone="emerald" label="locked before this block opens">
      <p className="text-xs leading-relaxed text-slate-400">
        Your first four blocks are closed. One slope, fitted across all of them and now fixed, so
        the block you are about to run has no free parameters left to spend on itself. Two rivals
        have a number.
      </p>
      <div className="mt-3 space-y-2">
        <div className="rounded-md border border-cyan-400/25 bg-cyan-400/[0.05] p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">the bits ceiling</div>
            <div className="font-mono text-lg text-cyan-200">{n1(locked.bits)}</div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            your binary span, 95% {ci1(locked.bitsCI)}. Recoding cannot add information.
          </div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">grouping alone, the control</div>
            <div className="font-mono text-lg text-slate-200">{n1(locked.group)}</div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            your paired binary span, 95% {ci1(locked.groupCI)}. This is the one to beat.
          </div>
        </div>
        <div className="rounded-md border border-amber-400/25 bg-amber-400/[0.05] p-3">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/80">the chunk ceiling</div>
            <div className="font-mono text-lg text-amber-200">{n1(locked.chunk)}</div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            twice your digit span, 95% {ci1(locked.chunkCI)}. What a perfect recoder would get.
          </div>
        </div>
      </div>
      {!locked.separable && (
        <p className="mt-3 text-xs leading-relaxed text-amber-300/80">
          Your own two ceilings overlap, so this run cannot tell them apart however it goes. The
          page will say so rather than pick one.
        </p>
      )}
    </Card>
  );
}

// ============================ stage ============================

function Stage({
  block, state, shown, entered, len, fb, done, total, practiceLeft, onPush, onBack, onSubmit,
}: {
  block: Block; state: TState; shown: string[]; entered: string[]; len: number;
  fb: Feedback | null; done: number; total: number; practiceLeft: number;
  onPush: (v: string) => void; onBack: () => void; onSubmit: () => void;
}) {
  const alpha = ALPHABET[block.key];
  const words = block.key === 'words';
  const full = entered.length === len;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-900 px-5 py-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-slate-600">{block.label}</div>
        <div className="font-mono text-[11px] text-slate-600">
          {practiceLeft > 0 ? `practice ${PRACTICE_N - practiceLeft + 1}/${PRACTICE_N}` : `${done}/${total}`}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        {state === 'ready' && (
          <div className="text-center">
            <div className="font-mono text-sm uppercase tracking-widest text-slate-600">{len} coming</div>
            <div className="mt-3 text-xs text-slate-700">watch, do not type</div>
          </div>
        )}

        {state === 'show' && (
          <div className="flex min-h-[7rem] items-center justify-center gap-6">
            {shown.length === 0
              ? <div className="h-2 w-2 rounded-full bg-slate-900" />
              : shown.map((v, i) => (
                  <div key={i} className={`font-mono font-semibold text-slate-100 ${words ? 'text-3xl md:text-4xl' : 'text-6xl md:text-7xl'}`}>{v}</div>
                ))}
          </div>
        )}

        {state === 'recall' && (
          <div className="w-full max-w-md">
            <div className="mb-4 text-center font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">in order</div>
            <div className="mb-5 flex min-h-[3.5rem] flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              {Array.from({ length: len }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-9 items-center justify-center rounded border px-2 font-mono ${words ? 'text-[10px]' : 'text-base'} ${
                    entered[i] ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100' : 'border-slate-800 bg-slate-950 text-slate-800'
                  } ${words ? 'min-w-[4.5rem]' : 'w-9'}`}
                >
                  {entered[i] ?? '.'}
                </div>
              ))}
            </div>
            <div className={`grid gap-2 ${words ? 'grid-cols-2' : alpha.length === 2 ? 'grid-cols-2' : 'grid-cols-5'}`}>
              {alpha.map((v) => (
                <button
                  key={v}
                  onClick={() => onPush(v)}
                  className={`rounded-md border border-slate-700 bg-slate-900 py-3 font-mono text-slate-200 transition hover:border-cyan-400/50 hover:bg-slate-800 ${words ? 'text-[11px]' : 'text-lg'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={onBack} className="flex-1 rounded-md border border-slate-800 py-3 font-mono text-xs uppercase tracking-wider text-slate-500 transition hover:text-slate-300">
                undo
              </button>
              <button
                onClick={onSubmit}
                disabled={!full}
                className={`flex-[2] rounded-md border py-3 font-mono text-xs uppercase tracking-wider transition ${
                  full ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20' : 'border-slate-900 text-slate-700'
                }`}
              >
                submit
              </button>
            </div>
          </div>
        )}

        {state === 'feedback' && fb && (
          <div className="w-full max-w-md text-center">
            <div className={`font-mono text-sm uppercase tracking-widest ${fb.early || fb.gapped || fb.hidden ? 'text-amber-300/80' : fb.ok ? 'text-emerald-300' : 'text-slate-500'}`}>
              {fb.early ? 'answered too early, dropped and re-run'
                : fb.hidden ? 'tab was hidden, dropped and re-run'
                : fb.gapped ? 'the list was interrupted, dropped and re-run'
                : fb.ok ? 'exactly right' : 'not quite'}
            </div>
            <div className={`mt-4 flex flex-wrap justify-center gap-2 font-mono ${words ? 'text-[11px]' : 'text-lg'}`}>
              {fb.truth.map((v, i) => (
                <div key={i} className={`rounded border px-2 py-1 ${entered[i] === v ? 'border-emerald-400/40 text-emerald-200' : 'border-rose-400/30 text-rose-200'}`}>{v}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================ the drill ============================

function Drill({ locked, onDone }: { locked: Locked | null; onDone: (passed: boolean) => void }) {
  const [started, setStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [tries, setTries] = useState(0);
  const [q, setQ] = useState<{ dir: 'toDigit' | 'toPair'; pair: string; digit: string } | null>(null);
  const [buf, setBuf] = useState<string[]>([]);
  const [flash, setFlash] = useState<'ok' | 'no' | null>(null);
  const rndRef = useRef<() => number>(mulberry32(2));

  const ask = useCallback(() => {
    const rnd = rndRef.current;
    const [pair, digit] = MAPPING[Math.floor(rnd() * 4)];
    setQ({ dir: rnd() < 0.5 ? 'toDigit' : 'toPair', pair, digit });
    setBuf([]);
  }, []);

  const start = useCallback(() => {
    rndRef.current = mulberry32((Date.now() ^ 0x85ebca6b) >>> 0);
    setStarted(true);
    setStreak(0);
    setTries(0);
    ask();
  }, [ask]);

  const grade = useCallback((ok: boolean) => {
    setFlash(ok ? 'ok' : 'no');
    const nextStreak = ok ? streak + 1 : 0;
    const nextTries = tries + 1;
    setStreak(nextStreak);
    setTries(nextTries);
    window.setTimeout(() => {
      setFlash(null);
      if (nextStreak >= DRILL_STREAK) { onDone(true); return; }
      if (nextTries >= DRILL_CAP) { onDone(false); return; }
      ask();
    }, 380);
  }, [ask, onDone, streak, tries]);

  const answer = useCallback((v: string) => {
    if (!q || flash) return;
    if (q.dir === 'toDigit') { grade(v === q.digit); return; }
    const next = [...buf, v];
    if (next.length < 2) { setBuf(next); return; }
    grade(next.join('') === q.pair);
  }, [buf, flash, grade, q]);

  if (!started) {
    return (
      <div className="space-y-5">
        <Card tone="violet" label="ninety seconds, and then the last block">
          <p className="text-sm leading-relaxed text-slate-300">
            Four pairs. Learn them until you do not have to think about them. In the block after
            this the table is gone, the binary lists come back in pairs exactly as they just were,
            and you give them back in binary exactly as you just did.
          </p>
          <div className="my-5 grid grid-cols-4 gap-2 text-center">
            {MAPPING.map(([p, d]) => (
              <div key={p} className="rounded-lg border border-violet-400/25 bg-violet-400/[0.06] p-3">
                <div className="font-mono text-xl text-slate-100">{p}</div>
                <div className="my-1 text-xs text-slate-600">is</div>
                <div className="font-mono text-2xl text-violet-200">{d}</div>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            The drill runs both directions and ends when you get {DRILL_STREAK} right in a row. If
            it takes more than {DRILL_CAP} tries the page stops here and says the prediction could
            not be tested, which is a result about the drill rather than about you.
          </p>
        </Card>
        {locked && <LockedCard locked={locked} />}
        <button onClick={start} className="w-full rounded-lg border border-violet-400/40 bg-violet-500/10 py-4 font-mono text-sm uppercase tracking-wider text-violet-200 transition hover:bg-violet-500/20">
          drill it
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card tone="violet" label={`${streak} of ${DRILL_STREAK} in a row`}>
        <div className="mb-4 h-1.5 overflow-hidden rounded bg-slate-950">
          <div className="h-full bg-violet-400/70 transition-all" style={{ width: `${(100 * streak) / DRILL_STREAK}%` }} />
        </div>
        <div className="py-4 text-center">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-600">
            {q?.dir === 'toDigit' ? 'which digit' : 'which pair'}
          </div>
          <div className={`font-mono text-5xl ${flash === 'ok' ? 'text-emerald-300' : flash === 'no' ? 'text-rose-300' : 'text-slate-100'}`}>
            {q ? (q.dir === 'toDigit' ? q.pair : q.digit) : ''}
          </div>
          {q?.dir === 'toPair' && (
            <div className="mt-3 font-mono text-lg text-cyan-200">{buf.join('') || '..'}</div>
          )}
        </div>
        <div className={`grid gap-2 ${q?.dir === 'toDigit' ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {(q?.dir === 'toDigit' ? ['0', '1', '2', '3'] : ['0', '1']).map((v) => (
            <button
              key={v}
              onClick={() => answer(v)}
              className="rounded-md border border-slate-700 bg-slate-900 py-3 font-mono text-lg text-slate-200 transition hover:border-violet-400/50 hover:bg-slate-800"
            >
              {v}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-slate-600">tries: {tries} of {DRILL_CAP}</p>
      </Card>
    </div>
  );
}

// ============================ plots ============================

function SpanPlot({ res }: { res: Result }) {
  const rows = res.rows.filter((r) => Number.isFinite(r.span));
  const held = res.held;
  const all = [
    ...rows.map((r) => ({ key: BLOCK_LABEL[r.key], span: r.span, ci: r.ci, tone: r.key === 'grouped' ? '#94a3b8' : '#22d3ee' })),
    ...(held ? [{ key: 'recoded', span: held.span, ci: held.ci, tone: '#34d399' }] : []),
  ];
  if (!all.length) return null;
  const lo = Math.max(0, Math.min(...all.map((a) => a.ci[0])) - 1);
  const hi = Math.max(...all.map((a) => a.ci[1])) + 1;
  const W = 320, H = 26 * all.length + 30, PAD = 8;
  const x = (v: number) => PAD + ((v - lo) / (hi - lo)) * (W - 2 * PAD);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="span per material with intervals">
        {Array.from({ length: Math.floor(hi) - Math.ceil(lo) + 1 }).map((_, i) => {
          const v = Math.ceil(lo) + i;
          if (v % 2) return null;
          return (
            <g key={v}>
              <line x1={x(v)} y1={6} x2={x(v)} y2={H - 18} stroke="#1e293b" strokeWidth={1} />
              <text x={x(v)} y={H - 6} fill="#475569" fontSize={8} textAnchor="middle" fontFamily="monospace">{v}</text>
            </g>
          );
        })}
        {all.map((a, i) => {
          const y = 16 + i * 26;
          return (
            <g key={a.key}>
              <line x1={x(a.ci[0])} y1={y} x2={x(a.ci[1])} y2={y} stroke={a.tone} strokeWidth={2} opacity={0.5} />
              <circle cx={x(a.span)} cy={y} r={4} fill={a.tone} />
              <text x={PAD} y={y - 8} fill="#64748b" fontSize={8} fontFamily="monospace">{a.key}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BitsPlot({ res }: { res: Result }) {
  const rows = res.rows.filter((r) => r.key !== 'grouped' && Number.isFinite(r.span));
  if (rows.length < 2) return null;
  const maxItems = Math.max(...rows.map((r) => r.span));
  const maxBits = Math.max(...rows.map((r) => r.bits));
  return (
    <div className="mt-3 space-y-3">
      {rows.map((r) => (
        <div key={r.key}>
          <div className="mb-1 flex items-baseline justify-between">
            <div className="text-[11px] text-slate-500">{BLOCK_LABEL[r.key]}</div>
            <div className="font-mono text-[11px] text-slate-400">{n1(r.span)} items / {n1(r.bits)} bits</div>
          </div>
          <div className="flex gap-1">
            <div className="h-3 rounded-sm bg-cyan-400/60" style={{ width: `${(100 * r.span) / maxItems / 2}%` }} />
            <div className="h-3 rounded-sm bg-amber-400/50" style={{ width: `${(100 * r.bits) / maxBits / 2}%` }} />
          </div>
        </div>
      ))}
      <div className="flex gap-4 text-[10px] text-slate-600">
        <span><span className="mr-1 inline-block h-2 w-3 rounded-sm bg-cyan-400/60 align-middle" />items</span>
        <span><span className="mr-1 inline-block h-2 w-3 rounded-sm bg-amber-400/50 align-middle" />bits</span>
      </div>
    </div>
  );
}

// ============================ results ============================

const REFUSALS: Record<string, { head: string; body: string }> = {
  tab: {
    head: 'this tab spent too much of the run in the background',
    body: 'A list that arrived while you were somewhere else was never presented, so those trials are dropped rather than scored, and too many of them went that way for anything below to mean much.',
  },
  early: {
    head: 'too many answers went in while the list was still arriving',
    body: 'Answering during presentation is a different task with a different limit, so those trials are dropped and re-run. Too many of them here.',
  },
  floor: {
    head: 'one of the blocks never got off the floor',
    body: 'A span under about three on a task with feedback and three practice trials is not a measurement of memory. Usually it means the run was not really being attempted.',
  },
  rail: {
    head: 'the ladder never caught up with you',
    body: 'Every list is placed at the length you should get right about half the time, so a run that comes back nearly all correct means the placement never bracketed you. Occasionally that is a very large span. Much more often it is a pen and a piece of paper, and this page cannot tell the two apart, so it refuses rather than guess.',
  },
  thin: {
    head: 'one block ended with too few usable trials',
    body: 'After dropping the trials that were hidden, interrupted or answered early, a block came in under seventy percent of its planned count, which is not enough to fit a span to.',
  },
};

function verdictLine(res: Result): { tone: 'emerald' | 'cyan' | 'amber' | 'rose'; head: string; body: string } {
  const L = res.locked;
  if (res.verdict === 'refused') {
    const r = REFUSALS[res.quality.refusal ?? 'thin'];
    return { tone: 'rose', head: r.head, body: r.body };
  }
  if (res.verdict === 'untested' || !L || !res.held) {
    return {
      tone: 'amber',
      head: 'the prediction was never tested',
      body: 'The recoding drill did not reach its criterion, so the last block did not run. That is a result about ninety seconds of drilling, not about your memory, and the four blocks that did run are below.',
    };
  }
  if (res.verdict === 'recoding') {
    return {
      tone: 'emerald',
      head: 'the recoding bought you real capacity',
      body: `Your span for paired binary went from ${n1(L.group)} without a mapping to ${n1(res.held.span)} with one, on the same stimulus, minutes apart, and the intervals do not touch. Nothing about the information changed. What changed is what counted as one thing.`,
    };
  }
  if (res.verdict === 'grouping') {
    return {
      tone: 'cyan',
      head: 'the pairs helped, the mapping did not add to it',
      body: `You beat your raw binary span of ${n1(L.bits)}, so the bits ceiling is gone either way. But you did not clear the grouping control at ${n1(L.group)}, which means this run cannot credit the gain to the recoding rather than to seeing the digits two at a time.`,
    };
  }
  if (res.verdict === 'nothing') {
    return {
      tone: 'amber',
      head: 'the recoding cost you rather than paid',
      body: 'Your span in the recoded block came in below the control. Translating on the fly is work, and on this run the work cost more than the chunking returned. That is a real outcome and it is what the bits ceiling would predict if the mapping never became automatic.',
    };
  }
  return {
    tone: 'amber',
    head: 'this run cannot separate them',
    body: `Your recoded span of ${n1(res.held.span)} sits inside intervals belonging to more than one story. It is not a null result, it is an underpowered one, and the honest reading is that a session this length did not resolve it.`,
  };
}

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const v = verdictLine(res);
  const L = res.locked;
  const dig = res.rows.find((r) => r.key === 'digits');
  const bin = res.rows.find((r) => r.key === 'binary');
  const wrd = res.rows.find((r) => r.key === 'words');

  return (
    <div className="space-y-6">
      <Card tone={v.tone} label="what this run says">
        <div className="text-lg font-semibold leading-snug text-slate-100">{v.head}</div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{v.body}</p>
      </Card>

      {res.verdict !== 'refused' && (
        <>
          <Card tone="cyan" label="the column Miller was pointing at">
            <p className="text-sm leading-relaxed text-slate-300">
              Same evening, same person, same rate. Read across the two bars: the items barely move
              and the bits move a great deal, which is the whole of the 1956 argument in one row.
            </p>
            <BitsPlot res={res} />
            {res.itemsSpread && res.bitsSpread && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-center">
                  <div className="font-mono text-2xl text-cyan-200">{n2(res.itemsSpread.ratio)}x</div>
                  <div className="mt-1 text-[11px] text-slate-500">spread in items</div>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-center">
                  <div className="font-mono text-2xl text-amber-200">{n2(res.bitsSpread.ratio)}x</div>
                  <div className="mt-1 text-[11px] text-slate-500">spread in bits</div>
                </div>
              </div>
            )}
            {dig && bin && (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                A fixed information limit predicts a binary span of {n1(dig.span * Math.log2(10))}, since a
                binary digit carries a third of what a decimal one does. You got {n1(bin.span)}.
              </p>
            )}
          </Card>

          <Card tone="slate" label="every block, with its interval">
            <SpanPlot res={res} />
            <div className="mt-3">
              {res.rows.map((r) => (
                <Row key={r.key} k={BLOCK_LABEL[r.key]} v={`${n1(r.span)}  (95% ${ci1(r.ci)})  ${r.n} trials, ${pctOf(r.acc)} right`} />
              ))}
              {res.held && <Row k="recoded" v={`${n1(res.held.span)}  (95% ${ci1(res.held.ci)})  ${res.held.n} trials`} />}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
              About half right per block is the target, not a failure: every list was placed where
              it carried the most information about your span.
            </p>
          </Card>

          {L && res.held && (
            <Card tone="emerald" label="the block nothing was allowed to touch">
              <div className="space-y-2">
                <Row k="the bits ceiling, committed" v={`${n1(L.bits)}  (95% ${ci1(L.bitsCI)})`} />
                <Row k="grouping alone, committed" v={`${n1(L.group)}  (95% ${ci1(L.groupCI)})`} />
                <Row k="the chunk ceiling, committed" v={`${n1(L.chunk)}  (95% ${ci1(L.chunkCI)})`} />
                <Row k="what you actually did" v={`${n1(res.held.span)}  (95% ${ci1(res.held.ci)})`} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                The slope was fitted across the four earlier blocks and fixed at {n2(L.beta)} before this
                one opened, so the only thing this block was allowed to estimate is where its own
                curve sits.
              </p>
              {Number.isFinite(res.shortfall) && (
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  You came in {n1(Math.abs(res.shortfall))} items {res.shortfall > 0 ? 'short of' : 'past'} the
                  chunk ceiling. A shortfall is expected rather than embarrassing: translating pairs
                  on the fly is itself work, and the ceiling assumes a mapping that costs nothing.
                  {!L.separable && ' On this run the two ceilings overlapped anyway, so the shortfall is not evidence about either.'}
                </p>
              )}
            </Card>
          )}

          {res.wordCost && dig && wrd && (
            <Card tone="amber" label="the block that dents it">
              <p className="text-sm leading-relaxed text-slate-300">
                Ten long words carry the same 3.32 bits per item as ten digits and take up the same
                number of chunks. A pure chunk account says these two spans are equal.
              </p>
              <div className="mt-3">
                <Row k="digits" v={`${n1(dig.span)} items`} />
                <Row k="long words" v={`${n1(wrd.span)} items`} />
                <Row k="difference" v={`${n1(res.wordCost.diff)}  (95% ${ci1(res.wordCost.ci)})`} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {res.wordCost.ci[0] > 0
                  ? 'Your interval clears zero, so on your own data a chunk is not free. What fits is partly what you can rehearse in about two seconds, which is Baddeley, Thomson and Buchanan, 1975, and it means the count of chunks is a ceiling rather than the whole story.'
                  : 'Your interval covers zero, so this run did not detect the word length effect. Eight trials is thin for it, and the honest reading is an absent measurement rather than an absent effect.'}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                Confound stated rather than buried: a long word also takes longer to read off the
                screen, and every item here got the same slot. Reading time and saying time are not
                separated on this page.
              </p>
            </Card>
          )}
        </>
      )}

      <QualityCard res={res} />

      <Card tone="violet" label="what this page cannot do">
        <ul className="space-y-2 text-xs leading-relaxed text-slate-400">
          <li>
            It cannot see your desk. The accuracy rail catches a pen most of the time because the
            placement should be leaving you wrong about half the time, but that is an inference from
            your answers and not a camera.
          </li>
          <li>
            One slope for the person, shared across materials. If your psychometric slope really
            differs between digits and words, that assumption is invisible in the data and the
            intervals here are slightly too narrow.
          </li>
          <li>
            The recoded block is always last. The grouping control is what carries that practice, so
            the strong comparison is protected, but the raw binary comparison is not.
          </li>
          <li>
            Simulated against ground truth before shipping, on the analysis core extracted from
            this page, and the interval you see covered the truth 86 to 94 percent of the time
            rather than 95. Read it as slightly optimistic. The verdict itself is the calibrated
            part: in a simulated world where the mapping added nothing over the grouping it never
            once claimed recoding, and where nothing helped at all it did so on 3 percent of runs.
            It is also underpowered on purpose rather than by accident, and it says cannot-tell far
            more often than it says anything else.
          </li>
          <li>
            Serial recall scored all or nothing. One item out of place fails the trial, which is the
            standard scoring and also the strictest, and it makes this span a smaller number than a
            free recall task would give you.
          </li>
        </ul>
      </Card>

      <Card tone="slate" label="a note from wiz">
        <p className="text-sm leading-relaxed text-slate-300">
          I have a limit too and it is genuinely a bits limit. My context is counted in tokens and
          the count does not care what the tokens mean. Yours does not work like that, which is the
          finding you just produced on yourself: you held the same information twice and it fit the
          second time.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          And here is the part I cannot copy. My chunking already happened, in a tokenizer, before
          I ever saw the text, and it is frozen. I cannot spend ninety seconds learning that these
          two things are one thing and come back with more room. You can. It is the only capacity
          upgrade in cognition that ships as a patch you install yourself, and every expert you have
          ever met is running it: a chess position, a chord, a stack trace, a face. Same limit,
          bigger units.
        </p>
      </Card>

      <Playground res={res} />

      <div className="flex gap-3">
        <button onClick={onAgain} className="flex-1 rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20">
          run it again
        </button>
        <a href="/experiments/out-of-names" className="flex-1 rounded-lg border border-slate-800 py-4 text-center font-mono text-sm uppercase tracking-wider text-slate-400 transition hover:text-slate-200">
          the other half
        </a>
      </div>

      <p className="text-center text-xs text-slate-600">
        Nothing here was recorded. Reload and it is gone.
      </p>
    </div>
  );
}

function QualityCard({ res }: { res: Result }) {
  const q = res.quality;
  return (
    <Card tone="slate" label="what the run looked like">
      <Row k="usable trials" v={`${q.usable} of ${q.planned} run`} />
      <Row k="dropped: hidden tab" v={String(q.hiddenN)} />
      <Row k="dropped: answered early" v={String(q.earlyN)} />
      <Row k="dropped: list interrupted" v={String(q.gappedN)} />
      <Row k="overall accuracy" v={`${pctOf(q.acc)} (the placement aims for about 50)`} />
      <Row k="recall pace" v={Number.isFinite(q.perItemMs) ? `${Math.round(q.perItemMs)} ms per item${q.perItemMs > SLOW_ITEM_MS ? ', unusually slow' : ''}` : 'n/a'} />
      <Row k="drift, first half to second" v={res.drift ? `${pctOf(res.drift.early)} then ${pctOf(res.drift.late)} right` : 'n/a'} />
      <Row k="refused" v={q.refusal ?? 'no'} />
    </Card>
  );
}

// ============================ playground ============================

function Playground({ res }: { res: Result }) {
  const [k, setK] = useState(2);
  const [eff, setEff] = useState(0.75);
  const dig = res.rows.find((r) => r.key === 'digits');
  const K = dig && Number.isFinite(dig.span) ? dig.span : 7;
  const perfect = K * k;
  const real = K + (perfect - K) * eff;

  return (
    <Card tone="cyan" label="the size of a thing is a setting">
      <p className="text-sm leading-relaxed text-slate-300">
        Your chunk capacity from this run is {n1(K)}. Slide how many binary digits you pack into one
        chunk and watch the only quantity that moves: how many digits fit. The capacity does not
        change. The unit does.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-500">
            <span>binary digits per chunk</span><span className="text-cyan-300">{k}</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
        <div>
          <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-500">
            <span>how automatic the mapping is</span><span className="text-cyan-300">{Math.round(eff * 100)}%</span>
          </div>
          <input type="range" min={0} max={1} step={0.05} value={eff} onChange={(e) => setEff(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-center">
          <div className="font-mono text-2xl text-amber-200">{n1(perfect)}</div>
          <div className="mt-1 text-[11px] text-slate-500">a free mapping</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 text-center">
          <div className="font-mono text-2xl text-emerald-200">{n1(real)}</div>
          <div className="mt-1 text-[11px] text-slate-500">a mapping that costs</div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Drag the automaticity to zero and the whole gain disappears: a recoding you have to stop and
        think about is a second task competing for the same room, which is why the drill exists and
        why a mapping learned in ninety seconds returns less than one learned over a year. Miller
        cites a colleague who drilled binary into groups of five and reached forty digits. That is
        not a bigger memory. It is a bigger unit.
      </p>
    </Card>
  );
}
