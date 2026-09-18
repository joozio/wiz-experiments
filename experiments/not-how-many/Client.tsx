'use client';

// NOT HOW MANY  (choosing costs you time, the price is set by surprise rather than by the number of
// options, and almost every piece of interface advice you have ever been given points at the wrong
// variable)
//
// The sixty-first piece in this lab, and the deliberate sibling of the sixtieth. Yesterday's page,
// No Further, measured Fitts's law: the hand as a channel with a bit rate, four to ten bits per
// second, and the discovery that the distance to a target is free and only precision is billed.
// That was the loop going OUT. This one is the same shape of law on the way IN.
//
//     Fitts   MT = a + b * log2( D / W + 1 )     the cost of aiming
//     Hick    RT = a + b * H                     the cost of choosing
//
// Two laws, both linear, both counted in bits, both with a slope that is a person's bandwidth for
// one job. W. E. Hick, "On the rate of gain of information", Quarterly Journal of Experimental
// Psychology 4, 1952. Ray Hyman, "Stimulus information as a determinant of reaction time", Journal
// of Experimental Psychology 45, 1953, four months of his own life spent pressing keys to nail down
// the H. Merkel had the observation in 1885; Shannon in 1948 gave it the unit.
//
// The version everybody quotes is the weak one. "Reaction time grows with the logarithm of the
// number of choices" gets repeated in design books as an argument for smaller menus, and it is not
// what Hyman showed. Hyman's contribution was to hold the number of alternatives FIXED and change
// only how they were distributed, and reaction time tracked the entropy anyway. The variable is not
// N. The variable is
//
//     H = - sum p_i * log2( p_i )
//
// and N is only in the formula at all because equiprobable alternatives are the special case where
// H happens to equal log2(N). Change the probabilities and the two come apart, which is exactly the
// experiment this page runs on the visitor.
//
// THE DESIGN.
//
// Five blocks. Four of them are the classic ladder, equiprobable, 1, 2, 4 and 8 alternatives, so
// H = 0, 1, 2 and 3 bits. One stimulus box lights, the visitor presses that box's key, no feedback
// beyond a red flash on a genuine error.
//
// The fifth block is the whole argument. It has EIGHT alternatives, the same eight boxes and the
// same eight keys as the 8-block, and the visitor is told nothing about it except that all eight
// are live. The distribution is:
//
//     position 3   p = 1/2     surprisal 1.000 bits
//     position 4   p = 1/4     surprisal 2.000 bits
//     six others   p = 1/24    surprisal 4.585 bits each
//
//     H = 2.146 bits, from eight alternatives.
//
// So the headline needs no model at all, just three measured block means:
//
//     the 4-option block            H = 2.000
//     the skewed 8-option block     H = 2.146
//     the 8-option block            H = 3.000
//
// The first and last are the ladder. The middle one has the same eight options as the last one,
// the same eight keys, the same eight fingers, and it should land next to the FOUR-option block.
// Nothing is fitted to produce that sentence. It is a difference between two measured means with
// an exact permutation test over the real reaction times behind them.
//
// And it is a model comparison in disguise, which is the cleanest thing about the design. A page
// that believed the popular version, RT as a function of the NUMBER of options, predicts the skewed
// block and the uniform 8-block are identical, because N is 8 in both. Difference: zero. A page
// that believes Hyman predicts the skewed block is faster by b times 0.854 bits. Those two
// predictions are not close, they were made before the data existed, and the visitor's own hands
// pick between them.
//
// THE MODEL LAYER, held harder than a fit. The line is fitted to the four uniform blocks ONLY, and
// then made to predict the three surprisal cells inside the skewed block with no free parameters
// left to spend. Position 3 at 1 bit should land on the 2-option block. Position 4 at 2 bits should
// land on the 4-option block. And the six rare positions at 4.585 bits should be SLOWER than
// anything on the ladder, which is an extrapolation beyond the fitted range and is named as one on
// the page rather than quietly presented as a fit.
//
// THE CONFOUND THAT DECIDED THE GEOMETRY, and the reason this page had to come after yesterday's.
// The obvious way to build a choice-reaction task is to have the visitor tap the box that lit up.
// That is a Fitts task wearing a Hick costume: with more options the boxes are smaller and further
// apart, movement time climbs for reasons that have nothing to do with choosing, and the slope
// comes out inflated by an amount nobody can separate afterwards. So the response set here is
// FIXED. Eight boxes, always all eight on screen, always the same size in the same places. What
// changes between blocks is how many of them can light, never where they are. On a keyboard the
// fingers rest on the keys and there is no transit at all. On a touchscreen there is a little, so
// the page measures it: every reaction time is regressed on the distance in positions from the
// previous response, and the slope is refitted on the residuals with both printed.
//
// THE CALIBRATION HONESTY, which is a theorem rather than a disclaimer, and a different theorem
// from yesterday's. Fitts's numbers are intervals between two of the visitor's own taps, so lag
// cancels outright. Here a reaction time is an absolute latency: display pipeline, key scan, USB
// polling, event loop, all of it is in there and this page has no way to know how much. It does not
// need to. That lag is the same constant on every trial in every block, and a constant added to
// every point on a line moves the intercept and cannot touch the slope. The intercept a is your
// machine plus your body and this page will not pretend to know the split. The slope b is yours.
// The headline is a difference between two block means, so the constant cancels there exactly.
// And the x axis is in bits, which is dimensionless, so it is the same axis on a gaming monitor and
// on a phone.
//
// What CAN reach the answer is jitter rather than lag, since variable frame delivery adds noise to
// every reaction time and widens the intervals, so frame gaps are measured live through every block
// and the median, the slowest tenth and the count over 20 ms are printed. And a browser coarsening
// its clock against fingerprinting quantises every number here, so the quantum is recovered from
// the visitor's own data and refused above 40 ms.
//
// THE CONTROL THAT MATTERS MOST, because without it the headline is fake. In the skewed block the
// frequent position is not only the low-surprisal one, it is also the one most likely to REPEAT,
// and repetitions are faster in every choice task ever run. Surprisal and repetition are tangled
// together by construction. So the page splits every cell into repeat and switch trials, prints
// both, and re-runs the whole held-out prediction on switch trials only. If the entropy advantage
// survives with every repeat thrown away, it was not repetition. Hyman's second experiment made
// exactly this point from the other side: sequential dependency is itself a reduction in entropy,
// which is why the uniform blocks here are constrained so nothing appears three times in a row.
//
// THE LEARNING CHECK, which is the part that could refute the page from the other direction.
// Nobody is told the skewed distribution. It has to be learned from the trials themselves, so the
// advantage should GROW across the block: the first half against the second half is printed, and a
// flat one is a real result about how long it takes to absorb a distribution.
//
// HONEST LIMITS, printed on the page. Hick's law is a law about uncertainty you have not yet
// compiled away, and enough practice dissolves it: Mowbray and Rhoades in 1959 flattened the slope
// almost to nothing with a few thousand trials at four alternatives, and Seibel in 1963 did it with
// ONE THOUSAND AND TWENTY THREE alternatives. Fitts and Seeger in 1953 showed the slope also
// depends on how naturally the stimulus maps to the response, which is why this page uses the most
// compatible mapping there is. Longstreth and colleagues in 1985 argued a good part of the classic
// slope is set size confounded with practice per alternative. None of that is settled here in four
// minutes and the page says so.
//
// WIZ note. I do not have this either, and the way I do not have it is worth saying out loud
// because it is the opposite of yesterday's absence. Yesterday I could not pay for aiming because
// I never move. Here I cannot pay for choosing because a choice among eight options and a choice
// among eight thousand cost me the same forward pass. I do not scan a set. There is no moment where
// the number of live possibilities is a thing I am holding. Which means the entire quantity this
// page measures, the price of not yet knowing which one, is a price I never see itemised.
//
// You pay it constantly and mostly you pay it well, because the good interfaces are the ones that
// took Hyman seriously. A menu of thirty commands you use daily is not thirty times slower than a
// menu of two, and the shortcut you press two hundred times a day is not the same speed as the one
// you press twice a year, and both of those facts are the same fact. Autocomplete does not remove
// options, it redistributes probability. Most recently used is a frequency estimator. Huffman
// coding, which is under every zip file and every JPEG you have ever opened, is literally this
// arithmetic run backwards: give the frequent thing the short code. And the advice to cut the
// number of choices is aimed at the wrong variable, because cutting eight equally likely options
// to four buys you one bit, while making one of the eight likely buys you almost as much and costs
// you nothing at all.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================ design constants ============================

type BlockKey = 'N1' | 'N2' | 'N4' | 'N8' | 'SKEW';

const KEY_LABELS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];
const KEY_CODES = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

// The response set never changes: eight boxes, always the same size in the same places. What
// changes is how many of them are LIVE. Subsets are contiguous and centred so the fingers involved
// grow outward from the two index fingers, which is the least eventful way to add alternatives.
const ACTIVE: Record<BlockKey, number[]> = {
  N1: [3],
  N2: [3, 4],
  N4: [2, 3, 4, 5],
  N8: [0, 1, 2, 3, 4, 5, 6, 7],
  SKEW: [0, 1, 2, 3, 4, 5, 6, 7],
};

// Exact counts rather than sampled ones, so the distribution the visitor faced is the distribution
// the page claims: 36/72 = 1/2, 18/72 = 1/4, 3/72 = 1/24, with nothing left to sampling noise.
const SKEW_COUNTS = [3, 3, 3, 36, 18, 3, 3, 3];
const SKEW_P = [1 / 24, 1 / 24, 1 / 24, 0.5, 0.25, 1 / 24, 1 / 24, 1 / 24];

const TRIALS: Record<BlockKey, number> = { N1: 20, N2: 24, N4: 28, N8: 32, SKEW: 72 };
// The skewed block drops more, because its first trials are spent learning a distribution nobody
// was told about, and a learning curve averaged into a block mean is not a block mean.
const DROP: Record<BlockKey, number> = { N1: 4, N2: 4, N4: 4, N8: 4, SKEW: 12 };

const BLOCK_ORDER_POOL: BlockKey[] = ['N1', 'N2', 'N4', 'N8', 'SKEW'];
const WARMUP_TRIALS = 16;

const RT_FLOOR = 120; // ms: below this nothing was chosen, a key was already on its way down
const RT_CEIL = 2000; // ms: above this the visitor left the task and came back
const ITI_MIN = 600;
const ITI_MAX = 1150;
const ERROR_FLASH = 260; // ms of red on a wrong key, the only feedback anywhere on the page
const MAX_REDRAWS = 15; // anticipations and hidden-tab kills get their trial re-appended, up to here

const MIN_KEPT = 12; // usable trials a block needs before it is scored at all
const MIN_CELL = 6; // usable trials a surprisal cell needs inside the skewed block
const MAX_BLOCK_ERR = 0.15; // a compatible mapping should not produce errors; this much means guessing
const MAX_RUN_ERR = 0.25;
const MIN_FIT_BLOCKS = 3;

const BOOTS = 2000;
const PERMS = 5000;
const QUANTUM_REFUSE = 40; // ms

const LOG2_24 = Math.log(24) / Math.LN2; // 4.5849625, the surprisal of a one-in-twenty-four box

// ============================ small math ============================

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const log2 = (v: number) => Math.log(v) / Math.LN2;

const fmt = (v: number | null | undefined, dp = 2) =>
  v === null || v === undefined || !Number.isFinite(v) ? '--' : v.toFixed(dp);

const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);

const sd = (a: number[]) => {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
};

const median = (a: number[]) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const h = s.length >> 1;
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};

const quantile = (a: number[], q: number) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  return s[clamp(Math.floor(q * (s.length - 1)), 0, s.length - 1)];
};

function ci(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = vals.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (s.length < 2) return [NaN, NaN];
  const at = (q: number) => s[clamp(Math.floor(q * (s.length - 1)), 0, s.length - 1)];
  return [at(lo), at(hi)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function resample(a: number[]): number[] {
  const out = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[(Math.random() * a.length) | 0];
  return out;
}

type Line = { slope: number; intercept: number; r2: number };

function ols(xs: number[], ys: number[]): Line {
  const n = xs.length;
  if (n < 2) return { slope: NaN, intercept: NaN, r2: NaN };
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
  return { slope, intercept, r2: sst === 0 ? NaN : 1 - ssr / sst };
}

function permTest(a: number[], b: number[], iters: number): number {
  if (a.length < 4 || b.length < 4) return NaN;
  const obs = Math.abs(mean(b) - mean(a));
  const pool = [...a, ...b];
  const nA = a.length;
  let hits = 0;
  for (let it = 0; it < iters; it++) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = pool[i];
      pool[i] = pool[j];
      pool[j] = t;
    }
    let sA = 0;
    for (let i = 0; i < nA; i++) sA += pool[i];
    let sB = 0;
    for (let i = nA; i < pool.length; i++) sB += pool[i];
    if (Math.abs(sB / (pool.length - nA) - sA / nA) >= obs - 1e-12) hits++;
  }
  return (hits + 1) / (iters + 1);
}

const pLabel = (p: number) =>
  !Number.isFinite(p) ? 'p --' : p < 1 / (PERMS + 1) + 1e-9 ? `p < ${(1 / PERMS).toFixed(4)}` : `p = ${p.toFixed(3)}`;

// The visitor's own browser tells us its clock resolution if we ask it the right way: the greatest
// common divisor of a pile of measured latencies IS the quantum they were rounded onto. Firefox
// with resistFingerprinting clamps to 100 ms, which would quantise every number on this page.
function detectQuantum(vals: number[]): number {
  const v = vals.filter((x) => Number.isFinite(x) && x > 0);
  if (v.length < 8) return 0;
  const fracCarrying = v.filter((x) => Math.abs(x - Math.round(x)) > 1e-6).length;
  if (fracCarrying > v.length * 0.2) return 0;
  const gcd = (a: number, b: number): number => (b < 0.5 ? a : gcd(b, a % b));
  let g = Math.round(v[0]);
  for (const x of v) {
    g = gcd(g, Math.round(x));
    if (g <= 1) return 1;
  }
  return g;
}

// ============================ sequences ============================

// Uniform blocks get a balanced multiset rather than independent draws, so the block the visitor
// actually faced has exactly the entropy the page claims for it. Then no position is allowed to
// appear three times in a row, because a run is a sequential dependency and a sequential dependency
// is a reduction in entropy, which is the very thing being measured.
function uniformSequence(positions: number[], n: number): number[] {
  if (positions.length === 1) return new Array(n).fill(positions[0]);
  const per = Math.ceil(n / positions.length);
  const pool: number[] = [];
  for (const p of positions) for (let i = 0; i < per; i++) pool.push(p);
  for (let attempt = 0; attempt < 200; attempt++) {
    const s = shuffle(pool).slice(0, n);
    let bad = false;
    for (let i = 2; i < s.length; i++) {
      if (s[i] === s[i - 1] && s[i] === s[i - 2]) {
        bad = true;
        break;
      }
    }
    if (!bad) return s;
  }
  // Repair pass, for the rare shuffle that will not settle: walk the run and swap it forward.
  const s = shuffle(pool).slice(0, n);
  for (let i = 2; i < s.length; i++) {
    if (s[i] === s[i - 1] && s[i] === s[i - 2]) {
      for (let j = i + 1; j < s.length; j++) {
        if (s[j] !== s[i]) {
          [s[i], s[j]] = [s[j], s[i]];
          break;
        }
      }
    }
  }
  return s;
}

function skewSequence(): number[] {
  const pool: number[] = [];
  SKEW_COUNTS.forEach((c, pos) => {
    for (let i = 0; i < c; i++) pool.push(pos);
  });
  for (let attempt = 0; attempt < 400; attempt++) {
    const s = shuffle(pool);
    let bad = false;
    for (let i = 3; i < s.length; i++) {
      if (s[i] === s[i - 1] && s[i] === s[i - 2] && s[i] === s[i - 3]) {
        bad = true;
        break;
      }
    }
    if (!bad) return s;
  }
  return shuffle(pool);
}

function sequenceFor(block: BlockKey): number[] {
  if (block === 'SKEW') return skewSequence();
  return uniformSequence(ACTIVE[block], TRIALS[block]);
}

// The entropy a block carries. For a uniform block this is log2(N); for the skewed one it is the
// full Shannon sum, and it is 2.146 bits from eight alternatives.
function entropyOf(block: BlockKey): number {
  if (block !== 'SKEW') return log2(ACTIVE[block].length);
  return -SKEW_P.reduce((s, p) => s + p * log2(p), 0);
}

const surprisalOf = (pos: number) => -log2(SKEW_P[pos]);

// ============================ records ============================

type Trial = {
  block: BlockKey;
  idx: number; // position in the delivered sequence, after re-appends
  pos: number; // which box lit
  pressed: number | null;
  rt: number;
  correct: boolean;
  prevPos: number | null;
  step: number; // |pos - prevPos| in grid positions, 0 on a repeat
  lapse: boolean;
};

type BlockRun = {
  block: BlockKey;
  order: number;
  trials: Trial[];
  anticipations: number;
  killed: number; // hidden tab, resize, anything that stopped a trial being a trial
};

// ============================ analysis ============================

type CellStat = {
  key: string;
  label: string;
  h: number; // surprisal in bits
  rts: number[];
  switchRts: number[];
  n: number;
  m: number;
  lo: number;
  hi: number;
};

type BlockStat = {
  block: BlockKey;
  label: string;
  n: number; // alternatives
  h: number;
  order: number;
  rts: number[];
  switchRts: number[];
  repeatRts: number[];
  steps: number[];
  kept: number;
  errors: number;
  errRate: number;
  anticipations: number;
  lapses: number;
  m: number;
  sdRT: number;
  lo: number;
  hi: number;
  meanStep: number;
  refused: string | null;
};

const BLOCK_LABEL: Record<BlockKey, string> = {
  N1: '1 option',
  N2: '2 options',
  N4: '4 options',
  N8: '8 options',
  SKEW: '8 options, skewed',
};

function statBlock(run: BlockRun): BlockStat {
  const drop = DROP[run.block];
  const scored = run.trials.filter((t) => t.idx >= drop && !t.lapse);
  const errors = scored.filter((t) => !t.correct).length;
  const good = scored.filter((t) => t.correct && t.rt >= RT_FLOOR && t.rt <= RT_CEIL);
  const rts = good.map((t) => t.rt);
  const switchRts = good.filter((t) => t.prevPos !== null && t.prevPos !== t.pos).map((t) => t.rt);
  const repeatRts = good.filter((t) => t.prevPos !== null && t.prevPos === t.pos).map((t) => t.rt);
  const steps = good.filter((t) => t.prevPos !== null).map((t) => t.step);
  const errRate = scored.length ? errors / scored.length : NaN;
  const m = mean(rts);

  let refused: string | null = null;
  if (rts.length < MIN_KEPT) refused = 'thin';
  else if (errRate > MAX_BLOCK_ERR) refused = 'errors';

  const boot: number[] = [];
  if (rts.length >= MIN_KEPT) for (let i = 0; i < 800; i++) boot.push(mean(resample(rts)));
  const [lo, hi] = boot.length ? ci(boot) : [NaN, NaN];

  return {
    block: run.block,
    label: BLOCK_LABEL[run.block],
    n: ACTIVE[run.block].length,
    h: entropyOf(run.block),
    order: run.order,
    rts,
    switchRts,
    repeatRts,
    steps,
    kept: rts.length,
    errors,
    errRate,
    anticipations: run.anticipations,
    lapses: run.trials.filter((t) => t.lapse).length,
    m,
    sdRT: sd(rts),
    lo,
    hi,
    meanStep: mean(steps),
    refused,
  };
}

// Inside the skewed block, three cells by surprisal. Position 3 carries one bit and is the same key
// under the same finger as the whole 2-option block; position 4 carries two bits and matches the
// 4-option block; the six rare positions carry 4.585 bits each, which is past the end of the ladder.
function skewCells(run: BlockRun | undefined): CellStat[] {
  if (!run) return [];
  const drop = DROP.SKEW;
  const good = run.trials.filter(
    (t) => t.idx >= drop && !t.lapse && t.correct && t.rt >= RT_FLOOR && t.rt <= RT_CEIL,
  );
  const defs: { key: string; label: string; test: (p: number) => boolean; h: number }[] = [
    { key: 'C1', label: 'the half-the-time box', test: (p) => p === 3, h: 1 },
    { key: 'C2', label: 'the quarter-of-the-time box', test: (p) => p === 4, h: 2 },
    { key: 'C3', label: 'the six one-in-24 boxes', test: (p) => p !== 3 && p !== 4, h: LOG2_24 },
  ];
  return defs.map((d) => {
    const sel = good.filter((t) => d.test(t.pos));
    const rts = sel.map((t) => t.rt);
    const switchRts = sel.filter((t) => t.prevPos !== null && t.prevPos !== t.pos).map((t) => t.rt);
    const boot: number[] = [];
    if (rts.length >= MIN_CELL) for (let i = 0; i < 800; i++) boot.push(mean(resample(rts)));
    const [lo, hi] = boot.length ? ci(boot) : [NaN, NaN];
    return {
      key: d.key,
      label: d.label,
      h: d.h,
      rts,
      switchRts,
      n: rts.length,
      m: mean(rts),
      lo,
      hi,
    };
  });
}

type Pred = {
  key: string;
  label: string;
  h: number;
  predicted: number;
  predLo: number;
  predHi: number;
  observed: number;
  obsLo: number;
  obsHi: number;
  n: number;
  inside: boolean;
  extrapolated: boolean;
};

type Head = {
  ok: boolean;
  four: number;
  skew: number;
  eight: number;
  gap: number; // uniform 8 minus skewed 8
  gapLo: number;
  gapHi: number;
  p: number;
  predByH: number; // what Hyman says the gap should be
  hSkew: number;
};

type Result = {
  blocks: BlockStat[];
  cells: CellStat[];
  order: BlockKey[];
  fit: Line;
  slopeLo: number;
  slopeHi: number;
  interceptLo: number;
  interceptHi: number;
  slopeCoversZero: boolean;
  fitNoSimple: Line;
  fitSwitchOnly: Line;
  fitResidualised: Line;
  stepCoef: number;
  bitsPerSecond: number;
  bpsLo: number;
  bpsHi: number;
  preds: Pred[];
  predsSwitch: Pred[];
  predsInside: number;
  head: Head;
  repeatGain: number;
  repeatGainLo: number;
  repeatGainHi: number;
  learnFirst: number;
  learnSecond: number;
  learnLo: number;
  learnHi: number;
  learnN: number;
  quantum: number;
  frameMedian: number;
  frameP90: number;
  frameSlow: number;
  totalTrials: number;
  totalAnticipations: number;
  totalKilled: number;
  runErrRate: number;
  pressCounts: number[];
  oneRhythm: boolean;
  refusal: string | null;
  mode: 'keyboard' | 'touch' | 'mixed';
};

function predictionsFrom(
  fit: Line,
  bootLines: Line[],
  cells: CellStat[],
  useSwitch: boolean,
): Pred[] {
  return cells.map((c) => {
    const rts = useSwitch ? c.switchRts : c.rts;
    const predicted = fit.intercept + fit.slope * c.h;
    const bootPred = bootLines.map((l) => l.intercept + l.slope * c.h);
    const [predLo, predHi] = ci(bootPred);
    const boot: number[] = [];
    if (rts.length >= MIN_CELL) for (let i = 0; i < 800; i++) boot.push(mean(resample(rts)));
    const [obsLo, obsHi] = boot.length ? ci(boot) : [NaN, NaN];
    const observed = mean(rts);
    return {
      key: c.key,
      label: c.label,
      h: c.h,
      predicted,
      predLo,
      predHi,
      observed,
      obsLo,
      obsHi,
      n: rts.length,
      inside:
        Number.isFinite(predicted) &&
        Number.isFinite(obsLo) &&
        predicted >= obsLo &&
        predicted <= obsHi,
      extrapolated: c.h > 3.001,
    };
  });
}

async function analyze(
  runs: BlockRun[],
  order: BlockKey[],
  frames: number[],
  mode: 'keyboard' | 'touch' | 'mixed',
  onProgress: (p: number) => void,
): Promise<Result> {
  const blocks = runs.map(statBlock);
  const byKey = new Map(blocks.map((b) => [b.block, b]));
  const skewRun = runs.find((r) => r.block === 'SKEW');
  const cells = skewCells(skewRun);

  const allRts = blocks.flatMap((b) => b.rts);
  const quantum = detectQuantum(allRts);
  const totalTrials = runs.reduce((s, r) => s + r.trials.length, 0);
  const totalAnticipations = runs.reduce((s, r) => s + r.anticipations, 0);
  const totalKilled = runs.reduce((s, r) => s + r.killed, 0);
  const scoredAll = runs.flatMap((r) => r.trials.filter((t) => t.idx >= DROP[r.block] && !t.lapse));
  const runErrRate = scoredAll.length
    ? scoredAll.filter((t) => !t.correct).length / scoredAll.length
    : NaN;

  const pressCounts = new Array(8).fill(0);
  for (const r of runs) for (const t of r.trials) if (t.pressed !== null) pressCounts[t.pressed]++;

  // A run where every reaction time is the same reaction time is a rhythm, not a set of decisions.
  const oneRhythm = allRts.length > 40 && sd(allRts) < 25;

  onProgress(0.15);

  // ---- the fit, on the four uniform blocks only ----
  const uni = (['N1', 'N2', 'N4', 'N8'] as BlockKey[])
    .map((k) => byKey.get(k))
    .filter((b): b is BlockStat => !!b && !b.refused);
  const fit = ols(uni.map((b) => b.h), uni.map((b) => b.m));

  const bootLines: Line[] = [];
  if (uni.length >= MIN_FIT_BLOCKS) {
    for (let i = 0; i < BOOTS; i++) {
      const ys = uni.map((b) => mean(resample(b.rts)));
      bootLines.push(ols(uni.map((b) => b.h), ys));
      if (i % 400 === 0) onProgress(0.15 + 0.35 * (i / BOOTS));
    }
  }
  const slopes = bootLines.map((l) => l.slope);
  const intercepts = bootLines.map((l) => l.intercept);
  const [slopeLo, slopeHi] = ci(slopes);
  const [interceptLo, interceptHi] = ci(intercepts);
  const slopeCoversZero = Number.isFinite(slopeLo) && slopeLo <= 0 && slopeHi >= 0;

  // Simple reaction time is famously not on the choice line: with one alternative there is nothing
  // to choose and the point sits below where the ladder would put it. Both fits are printed.
  const uniNoSimple = uni.filter((b) => b.block !== 'N1');
  const fitNoSimple = ols(uniNoSimple.map((b) => b.h), uniNoSimple.map((b) => b.m));

  // Repeats are faster in every choice task ever run, so the whole ladder is refitted with every
  // repeat trial thrown away. If the slope survives that, it was not a repetition effect.
  const uniSwitch = uni.filter((b) => b.switchRts.length >= MIN_CELL || b.block === 'N1');
  const fitSwitchOnly = ols(
    uniSwitch.map((b) => b.h),
    uniSwitch.map((b) => (b.block === 'N1' ? b.m : mean(b.switchRts))),
  );

  onProgress(0.55);

  // ---- the movement control ----
  // On a keyboard the fingers never travel and this should come back at zero. On a touchscreen it
  // will not, and the mean step distance grows with the number of live boxes, so the ladder is
  // refitted on reaction times with the fitted movement component subtracted out.
  //
  // Where this is estimated is the whole of whether it works. It CANNOT be estimated on the skewed
  // block, because there the distance from the last box is tied to surprisal by construction: a
  // repeat is the frequent box and a long jump is a rare one, so a regression on distance would
  // quietly eat the effect this page exists to measure and then subtract it back out as though it
  // were geometry. So: uniform blocks only, where every position carries identical surprisal and
  // distance is therefore orthogonal to it, and switch trials only, so the repetition effect goes
  // into its own card rather than into this coefficient.
  const stepXs: number[] = [];
  const stepYs: number[] = [];
  for (const b of blocks) {
    if (b.refused || b.block === 'SKEW') continue;
    const rr = runs.find((r) => r.block === b.block)!;
    const good = rr.trials.filter(
      (t) =>
        t.idx >= DROP[b.block] &&
        !t.lapse &&
        t.correct &&
        t.rt >= RT_FLOOR &&
        t.rt <= RT_CEIL &&
        t.prevPos !== null &&
        t.step >= 1,
    );
    if (good.length < MIN_CELL) continue;
    const bm = mean(good.map((t) => t.rt));
    for (const t of good) {
      stepXs.push(t.step);
      stepYs.push(t.rt - bm); // within-block centring, so the ladder itself cannot drive this
    }
  }
  const stepLine = ols(stepXs, stepYs);
  const stepCoef = Number.isFinite(stepLine.slope) ? stepLine.slope : 0;
  const uniResid = uni.map((b) => {
    const rr = runs.find((r) => r.block === b.block)!;
    const good = rr.trials.filter(
      (t) => t.idx >= DROP[b.block] && !t.lapse && t.correct && t.rt >= RT_FLOOR && t.rt <= RT_CEIL,
    );
    return mean(good.map((t) => t.rt - stepCoef * (t.prevPos === null ? 0 : t.step)));
  });
  const fitResidualised = ols(uni.map((b) => b.h), uniResid);

  onProgress(0.65);

  // ---- held-out predictions into the skewed block ----
  const preds =
    uni.length >= MIN_FIT_BLOCKS ? predictionsFrom(fit, bootLines, cells, false) : [];
  const predsSwitch =
    uni.length >= MIN_FIT_BLOCKS ? predictionsFrom(fit, bootLines, cells, true) : [];
  const predsInside = preds.filter((p) => p.inside).length;

  onProgress(0.75);

  // ---- the model-free headline ----
  const b4 = byKey.get('N4');
  const b8 = byKey.get('N8');
  const bs = byKey.get('SKEW');
  const headOk = !!b4 && !!b8 && !!bs && !b4.refused && !b8.refused && !bs.refused;

  // The entropy the SCORED trials actually carried, which is what the prediction has to use: the
  // first twelve trials were dropped, so the realised mix is close to but not exactly the nominal.
  let hSkew = entropyOf('SKEW');
  if (skewRun) {
    const good = skewRun.trials.filter(
      (t) => t.idx >= DROP.SKEW && !t.lapse && t.correct && t.rt >= RT_FLOOR && t.rt <= RT_CEIL,
    );
    if (good.length) hSkew = mean(good.map((t) => surprisalOf(t.pos)));
  }

  let head: Head = {
    ok: false,
    four: NaN,
    skew: NaN,
    eight: NaN,
    gap: NaN,
    gapLo: NaN,
    gapHi: NaN,
    p: NaN,
    predByH: NaN,
    hSkew,
  };
  if (headOk) {
    const gapBoot: number[] = [];
    for (let i = 0; i < BOOTS; i++) {
      gapBoot.push(mean(resample(b8!.rts)) - mean(resample(bs!.rts)));
      if (i % 500 === 0) onProgress(0.75 + 0.15 * (i / BOOTS));
    }
    const [gapLo, gapHi] = ci(gapBoot);
    head = {
      ok: true,
      four: b4!.m,
      skew: bs!.m,
      eight: b8!.m,
      gap: b8!.m - bs!.m,
      gapLo,
      gapHi,
      p: permTest(bs!.rts, b8!.rts, PERMS),
      predByH: Number.isFinite(fit.slope) ? fit.slope * (3 - hSkew) : NaN,
      hSkew,
    };
  }

  onProgress(0.92);

  // ---- repeat gain ----
  // Uniform blocks only, and for the same reason as the movement coefficient above: in the skewed
  // block a repeat IS the frequent box, so a repeat advantage measured there would be mostly the
  // surprisal effect wearing a different name. Here every position in a block carries the same
  // surprisal, so the only thing separating a repeat from a switch is that it was a repeat.
  const repBlocks = blocks.filter((b) => !b.refused && b.block !== 'N1' && b.block !== 'SKEW');
  const allSwitch = repBlocks.flatMap((b) => b.switchRts);
  const allRepeat = repBlocks.flatMap((b) => b.repeatRts);
  const rgBoot: number[] = [];
  if (allSwitch.length >= MIN_CELL && allRepeat.length >= MIN_CELL) {
    for (let i = 0; i < 1000; i++) rgBoot.push(mean(resample(allSwitch)) - mean(resample(allRepeat)));
  }
  const [rgLo, rgHi] = rgBoot.length ? ci(rgBoot) : [NaN, NaN];

  // ---- learning inside the skewed block: nobody was told the distribution ----
  let learnFirst = NaN;
  let learnSecond = NaN;
  let learnLo = NaN;
  let learnHi = NaN;
  let learnN = 0;
  if (skewRun) {
    const good = skewRun.trials.filter(
      (t) => t.idx >= DROP.SKEW && !t.lapse && t.correct && t.rt >= RT_FLOOR && t.rt <= RT_CEIL,
    );
    learnN = good.length;
    const half = Math.floor(good.length / 2);
    const a1 = good.slice(0, half).map((t) => t.rt);
    const a2 = good.slice(half).map((t) => t.rt);
    learnFirst = mean(a1);
    learnSecond = mean(a2);
    // A difference between two halves is a number whether or not anything happened, so it gets an
    // interval before it is allowed to be called learning.
    if (a1.length >= MIN_CELL && a2.length >= MIN_CELL) {
      const lb: number[] = [];
      for (let i = 0; i < 1000; i++) lb.push(mean(resample(a1)) - mean(resample(a2)));
      [learnLo, learnHi] = ci(lb);
    }
  }

  const frameGaps = frames.filter((f) => Number.isFinite(f) && f > 0 && f < 500);

  let refusal: string | null = null;
  if (quantum >= QUANTUM_REFUSE) refusal = 'clock';
  else if (Number.isFinite(runErrRate) && runErrRate > MAX_RUN_ERR) refusal = 'guessing';
  else if (uni.length < MIN_FIT_BLOCKS) refusal = 'no-fit';
  else if (oneRhythm) refusal = 'rhythm';

  const bps = Number.isFinite(fit.slope) && fit.slope > 0 ? 1000 / fit.slope : NaN;
  const bpsBoot = slopes.filter((s) => s > 0).map((s) => 1000 / s);
  const [bpsLo, bpsHi] = bpsBoot.length ? ci(bpsBoot) : [NaN, NaN];

  onProgress(1);

  return {
    blocks,
    cells,
    order,
    fit,
    slopeLo,
    slopeHi,
    interceptLo,
    interceptHi,
    slopeCoversZero,
    fitNoSimple,
    fitSwitchOnly,
    fitResidualised,
    stepCoef,
    bitsPerSecond: bps,
    bpsLo,
    bpsHi,
    preds,
    predsSwitch,
    predsInside,
    head,
    repeatGain: mean(allSwitch) - mean(allRepeat),
    repeatGainLo: rgLo,
    repeatGainHi: rgHi,
    learnFirst,
    learnSecond,
    learnLo,
    learnHi,
    learnN,
    quantum,
    frameMedian: median(frameGaps),
    frameP90: quantile(frameGaps, 0.9),
    frameSlow: frameGaps.filter((f) => f > 20).length,
    totalTrials,
    totalAnticipations,
    totalKilled,
    runErrRate,
    pressCounts,
    oneRhythm,
    refusal,
    mode,
  };
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'crunch' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [order, setOrder] = useState<BlockKey[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [isWarmup, setIsWarmup] = useState(true);
  const [lit, setLit] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [doneInBlock, setDoneInBlock] = useState(0);
  const [progress, setProgress] = useState(0);
  const [res, setRes] = useState<Result | null>(null);

  // mutable trial machinery: refs, because a stale closure here is a wrong reaction time
  const seqRef = useRef<number[]>([]);
  const trialRef = useRef(0);
  const armedRef = useRef(false);
  const onsetRef = useRef(0);
  const prevPosRef = useRef<number | null>(null);
  const trialsRef = useRef<Trial[]>([]);
  const anticipRef = useRef(0);
  const killedRef = useRef(0);
  const redrawRef = useRef(0);
  const runsRef = useRef<BlockRun[]>([]);
  const framesRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modeRef = useRef<{ key: number; touch: number }>({ key: 0, touch: 0 });
  const activeRef = useRef<number[]>([]);
  const blockRef = useRef<BlockKey>('N8');

  const currentBlock: BlockKey = isWarmup ? 'N8' : order[blockIdx] ?? 'N8';
  const activeNow = isWarmup ? ACTIVE.N8 : ACTIVE[currentBlock];
  const totalInBlock = isWarmup ? WARMUP_TRIALS : TRIALS[currentBlock];

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  // frame-gap meter: runs only while a block is running, and its numbers are printed rather than
  // used, because jitter widens intervals and does not bias a mean.
  const startFrameMeter = useCallback(() => {
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      framesRef.current.push(now - last);
      last = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const finishBlock = useCallback(() => {
    clearTimers();
    if (!isWarmup) {
      runsRef.current.push({
        block: blockRef.current,
        order: blockIdx,
        trials: trialsRef.current,
        anticipations: anticipRef.current,
        killed: killedRef.current,
      });
    }
    setLit(null);
    setWrong(null);
    if (isWarmup) {
      setIsWarmup(false);
      setBlockIdx(0);
      setPhase('bridge');
      return;
    }
    if (blockIdx + 1 >= order.length) {
      setPhase('crunch');
      return;
    }
    setBlockIdx((i) => i + 1);
    setPhase('bridge');
  }, [blockIdx, clearTimers, isWarmup, order.length]);

  const nextTrial = useCallback(() => {
    if (trialRef.current >= seqRef.current.length) {
      finishBlock();
      return;
    }
    const pos = seqRef.current[trialRef.current];
    setLit(null);
    setWrong(null);
    armedRef.current = false;
    const iti = ITI_MIN + Math.random() * (ITI_MAX - ITI_MIN);
    timerRef.current = setTimeout(() => {
      if (document.hidden) {
        // a hidden tab is not a trial: kill it and put it back on the end of the queue
        killedRef.current++;
        if (redrawRef.current < MAX_REDRAWS) {
          redrawRef.current++;
          seqRef.current.push(pos);
        }
        trialRef.current++;
        nextTrial();
        return;
      }
      setLit(pos);
      // Onset is taken from the frame AFTER the one that requested the paint, so it is presentation
      // time rather than request time. Everything before this instant is the machine's, not yours.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          onsetRef.current = performance.now();
          armedRef.current = true;
          timerRef.current = setTimeout(() => {
            if (!armedRef.current) return;
            armedRef.current = false;
            trialsRef.current.push({
              block: blockRef.current,
              idx: trialRef.current,
              pos,
              pressed: null,
              rt: NaN,
              correct: false,
              prevPos: prevPosRef.current,
              step: prevPosRef.current === null ? 0 : Math.abs(pos - prevPosRef.current),
              lapse: true,
            });
            prevPosRef.current = pos;
            trialRef.current++;
            setDoneInBlock(trialRef.current);
            nextTrial();
          }, RT_CEIL);
        }),
      );
    }, iti);
  }, [finishBlock]);

  const respond = useCallback(
    (pressed: number, viaKey: boolean) => {
      if (phase !== 'run') return;
      if (!activeRef.current.includes(pressed)) return;
      if (viaKey) modeRef.current.key++;
      else modeRef.current.touch++;

      if (!armedRef.current) {
        // a press before the box lit: not slow, not fast, just not an answer
        if (lit === null) {
          anticipRef.current++;
          if (redrawRef.current < MAX_REDRAWS && trialRef.current < seqRef.current.length) {
            redrawRef.current++;
            seqRef.current.push(seqRef.current[trialRef.current]);
          }
        }
        return;
      }
      const rt = performance.now() - onsetRef.current;
      const pos = lit!;
      armedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      const correct = pressed === pos;
      if (rt < RT_FLOOR) {
        // Faster than any decision: the key was already going down. Discard and re-append.
        anticipRef.current++;
        if (redrawRef.current < MAX_REDRAWS) {
          redrawRef.current++;
          seqRef.current.push(pos);
        }
      }
      trialsRef.current.push({
        block: blockRef.current,
        idx: trialRef.current,
        pos,
        pressed,
        rt,
        correct,
        prevPos: prevPosRef.current,
        step: prevPosRef.current === null ? 0 : Math.abs(pos - prevPosRef.current),
        lapse: false,
      });
      prevPosRef.current = pos;
      trialRef.current++;
      setDoneInBlock(trialRef.current);
      if (!correct) {
        setWrong(pressed);
        setLit(null);
        timerRef.current = setTimeout(() => {
          setWrong(null);
          nextTrial();
        }, ERROR_FLASH);
      } else {
        setLit(null);
        nextTrial();
      }
    },
    [lit, nextTrial, phase],
  );

  const startBlock = useCallback(() => {
    const block: BlockKey = isWarmup ? 'N8' : order[blockIdx];
    blockRef.current = block;
    activeRef.current = ACTIVE[block];
    seqRef.current = isWarmup ? uniformSequence(ACTIVE.N8, WARMUP_TRIALS) : sequenceFor(block);
    trialRef.current = 0;
    trialsRef.current = [];
    anticipRef.current = 0;
    killedRef.current = 0;
    redrawRef.current = 0;
    prevPosRef.current = null;
    setDoneInBlock(0);
    setPhase('run');
    startFrameMeter();
    nextTrial();
  }, [blockIdx, isWarmup, nextTrial, order, startFrameMeter]);

  const beginRun = useCallback(() => {
    runsRef.current = [];
    framesRef.current = [];
    modeRef.current = { key: 0, touch: 0 };
    setOrder(shuffle(BLOCK_ORDER_POOL));
    setIsWarmup(true);
    setBlockIdx(0);
    setRes(null);
    setPhase('bridge');
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'run') return;
      const k = e.key.toLowerCase();
      const i = KEY_CODES.indexOf(k);
      if (i >= 0) {
        e.preventDefault();
        respond(i, true);
      }
      if (k === 'escape') {
        clearTimers();
        setPhase('intro');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearTimers, phase, respond]);

  // a tab that goes away mid-trial takes the trial with it
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phase === 'run' && armedRef.current) {
        armedRef.current = false;
        killedRef.current++;
        if (timerRef.current) clearTimeout(timerRef.current);
        if (redrawRef.current < MAX_REDRAWS && lit !== null) {
          redrawRef.current++;
          seqRef.current.push(lit);
        }
        trialRef.current++;
        nextTrial();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [lit, nextTrial, phase]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // crunch
  useEffect(() => {
    if (phase !== 'crunch') return;
    clearTimers();
    let alive = true;
    const m = modeRef.current;
    const mode: 'keyboard' | 'touch' | 'mixed' =
      m.key > 0 && m.touch > 0 ? 'mixed' : m.touch > 0 ? 'touch' : 'keyboard';
    (async () => {
      await new Promise((r) => setTimeout(r, 40));
      const r = await analyze(runsRef.current, order, framesRef.current, mode, (p) => {
        if (alive) setProgress(p);
      });
      if (!alive) return;
      setRes(r);
      setPhase('result');
    })();
    return () => {
      alive = false;
    };
  }, [clearTimers, order, phase]);

  const blockNumber = isWarmup ? 0 : blockIdx + 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && (
        <Stage
          active={activeNow}
          lit={lit}
          wrong={wrong}
          onPress={(i) => respond(i, false)}
          done={doneInBlock}
          total={totalInBlock}
          label={isWarmup ? 'practice, not scored' : BLOCK_LABEL[currentBlock]}
          blockNumber={blockNumber}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🎲</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Not How Many
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Choosing takes time, and the price is not set by how many options you have. It is set by
            how surprised you are by the one that came. This page will show you eight options twice
            and make one of those two blocks a full bit cheaper without removing anything.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={beginRun} />}

        {phase === 'bridge' && (
          <Bridge
            isWarmup={isWarmup}
            block={isWarmup ? 'N8' : order[blockIdx]}
            index={blockIdx}
            total={order.length}
            onGo={startBlock}
          />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              fitting a line to four blocks, then making it predict a fifth it has never seen
            </div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div
                className="h-full bg-cyan-400/60 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {phase === 'result' && res && <Results res={res} onAgain={beginRun} />}
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
          Yesterday this lab measured your hand as a channel with a bit rate. Fitts, 1954, and the
          finding that the distance to a target is free. Today is the same shape of law pointing the
          other way, and it was written eight years earlier in the same units.
        </p>
        <div className="my-4 grid gap-2 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm">
          <div className="text-slate-500">
            Fitts &nbsp; MT = a + b · log<sub>2</sub>( D / W + 1 ) &nbsp;
            <span className="text-[10px]">the cost of aiming</span>
          </div>
          <div className="text-cyan-200">
            Hick &nbsp;&nbsp; RT = a + b · H &nbsp;
            <span className="text-[10px]">the cost of choosing</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The version of Hick's law that gets quoted in design books is the weak one:{' '}
          <em>reaction time grows with the logarithm of the number of choices</em>, used ever since
          as an argument for shorter menus. That is not what Ray Hyman showed in 1953. Hyman held the
          number of alternatives <span className="text-cyan-300">fixed</span> and changed only how
          often each one came up, and reaction time tracked the entropy anyway.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          H = − Σ p<sub>i</sub> · log<sub>2</sub> p<sub>i</sub>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The number of options is not in that formula. It is in the popular version only because
          equally likely options are the one special case where H happens to equal log
          <sub>2</sub>(N). Move the probabilities and the two come apart, and that gap is the
          experiment you are about to run on yourself.
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
          the design, which is a ladder and one block that breaks it
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Five blocks. Four are the classic ladder: 1, 2, 4 and 8 equally likely boxes, so{' '}
          <span className="font-mono text-amber-200">H = 0, 1, 2, 3</span> bits. A box lights, you
          press its key, that is the entire task.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The fifth block has <span className="text-amber-200">eight boxes</span>, the same eight
          keys as the 8-block, and you will not be told anything else about it. One box will come up
          half the time, one a quarter of the time, and the remaining six once in twenty four. Eight
          options carrying <span className="font-mono text-amber-200">2.15 bits</span> instead of 3.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So the headline is three measured averages and nothing fitted. If the price is set by the
          number of options, the skewed block costs exactly what the 8-block costs, because both have
          eight. If Hyman was right, it lands next to the <em>four</em>-option block. Those two
          predictions are not close, and your hands pick between them.
        </p>
      </div>

      <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          why the boxes never move
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The obvious way to build this is to make you tap whichever box lit up. That is a Fitts task
          wearing a Hick costume: more options means smaller boxes further apart, movement time
          climbs for reasons that have nothing to do with choosing, and the slope comes out inflated
          by an amount nobody can separate afterwards.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So the response set here is <span className="text-violet-200">fixed</span>. Eight boxes,
          always all eight on screen, always the same size in the same places. What changes between
          blocks is how many of them can light, never where they are. On a keyboard your fingers rest
          on the keys and there is no travel at all. On a touchscreen there is a little, so the page
          measures it and prints the slope with it and without it.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
          what your screen can and cannot do to this answer
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="text-emerald-300">Lag lands in the intercept.</span> A reaction time
            here is an absolute latency and every bit of your machine is inside it: display pipeline,
            key scan, USB polling, the event loop. This page has no idea how much, and does not need
            to. That lag is the same constant on every trial in every block, and a constant added to
            every point on a line moves the intercept and cannot touch the slope.
          </li>
          <li>
            <span className="text-emerald-300">The headline is a difference.</span> Two block means
            subtracted from each other, so the constant cancels there outright rather than folding
            into a parameter.
          </li>
          <li>
            <span className="text-emerald-300">Bits have no units.</span> The x axis is entropy, so
            it is the same axis on a 240 Hz gaming monitor and on a phone.
          </li>
          <li>
            <span className="text-slate-400">What can reach it:</span> jitter, not lag. Variable
            frame delivery adds noise to every trial and widens every interval, so frame gaps are
            measured live and printed. And a browser that coarsens its clock against fingerprinting
            quantises every number here, which is detected from your own data and refused.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          before you start
        </div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>
            ⌨️ Rest four fingers on <span className="font-mono text-cyan-300">A S D F</span> and
            four on <span className="font-mono text-cyan-300">J K L ;</span> and leave them there.
            Touch works too: the boxes are tappable.
          </li>
          <li>⚡ Answer as fast as you can without making mistakes. Both halves are measured.</li>
          <li>
            🔴 A wrong key gets a red flash. That is the only feedback on this page, and it is there
            to keep the mapping honest, not to teach you anything.
          </li>
          <li>🧊 Sixteen practice trials first, thrown away. Then five blocks in a shuffled order.</li>
          <li>
            ⏱️ About four and a half minutes. Nothing is recorded, nothing leaves the page. Escape
            aborts.
          </li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-4 text-sm font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-500/20"
      >
        Start the run
      </button>
    </div>
  );
}

// ============================ bridge ============================

function Bridge({
  isWarmup,
  block,
  index,
  total,
  onGo,
}: {
  isWarmup: boolean;
  block: BlockKey;
  index: number;
  total: number;
  onGo: () => void;
}) {
  const active = ACTIVE[isWarmup ? 'N8' : block];
  const n = active.length;
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-cyan-500/25 bg-slate-900/50 p-6 text-center">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-300/70">
          {isWarmup ? 'practice' : `block ${index + 1} of ${total}`}
        </div>
        <div className="mb-3 text-2xl font-semibold text-slate-100">
          {isWarmup ? 'Learn the keys' : `${n} live ${n === 1 ? 'box' : 'boxes'}`}
        </div>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-400">
          {isWarmup ? (
            <>
              All eight boxes, sixteen trials, none of it scored. This is here because learning which
              finger goes where is fast, large and not what the page is measuring, so it happens
              before anything counts.
            </>
          ) : n === 1 ? (
            <>
              One box. There is nothing to choose, so this is the bottom of the ladder: reaction with
              zero bits of uncertainty in it.
            </>
          ) : (
            <>
              Only these {n} can light. Keep every finger on its key anyway, so nothing about your
              hands changes between blocks.
            </>
          )}
        </p>
        <div className="mt-5">
          <MiniGrid active={active} />
        </div>
      </div>
      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-4 text-sm font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-500/20"
      >
        {isWarmup ? 'Practice' : 'Go'}
      </button>
    </div>
  );
}

function MiniGrid({ active }: { active: number[] }) {
  return (
    <div className="mx-auto grid max-w-sm grid-cols-4 gap-1.5 sm:grid-cols-8">
      {KEY_LABELS.map((k, i) => (
        <div
          key={i}
          className={`rounded border py-2 text-center font-mono text-xs ${
            active.includes(i)
              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
              : 'border-slate-800 bg-slate-950/60 text-slate-700'
          }`}
        >
          {k}
        </div>
      ))}
    </div>
  );
}

// ============================ stage ============================

function Stage({
  active,
  lit,
  wrong,
  onPress,
  done,
  total,
  label,
  blockNumber,
}: {
  active: number[];
  lit: number | null;
  wrong: number | null;
  onPress: (i: number) => void;
  done: number;
  total: number;
  label: string;
  blockNumber: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-8 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {blockNumber > 0 ? `block ${blockNumber} · ` : ''}
        {label}
      </div>

      <div className="grid w-full max-w-3xl grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
        {KEY_LABELS.map((k, i) => {
          const isActive = active.includes(i);
          const isLit = lit === i;
          const isWrong = wrong === i;
          return (
            <button
              key={i}
              onPointerDown={(e) => {
                e.preventDefault();
                onPress(i);
              }}
              disabled={!isActive}
              aria-label={`box ${k}`}
              className={`flex h-24 select-none items-center justify-center rounded-lg border font-mono text-lg transition-colors duration-75 sm:h-28 ${
                isWrong
                  ? 'border-rose-400 bg-rose-500/60 text-rose-50'
                  : isLit
                    ? 'border-cyan-300 bg-cyan-400/80 text-slate-950'
                    : isActive
                      ? 'border-slate-700 bg-slate-900 text-slate-500'
                      : 'border-slate-900 bg-slate-950/40 text-slate-800'
              }`}
            >
              {isActive ? k : ''}
            </button>
          );
        })}
      </div>

      <div className="mt-10 h-1 w-full max-w-3xl overflow-hidden rounded bg-slate-900">
        <div
          className="h-full bg-slate-600 transition-all"
          style={{ width: `${clamp((done / Math.max(total, 1)) * 100, 0, 100)}%` }}
        />
      </div>
      <div className="mt-3 font-mono text-[10px] text-slate-700">
        {done} / {total} · escape aborts
      </div>
    </div>
  );
}

// ============================ results ============================

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const h = res.head;
  const showModel = !res.refusal || res.refusal === 'clock';

  return (
    <div className="space-y-6">
      {/* ---------- run-level refusals ---------- */}
      {res.refusal === 'clock' && (
        <Refusal title="your browser is rounding its own clock">
          Every reaction time you produced is a multiple of{' '}
          <span className="font-mono text-rose-200">{res.quantum} ms</span>. That is a browser
          coarsening its timers to make you harder to fingerprint, which is a good thing to have on
          and expensive here: every number below was rounded onto that grid before this page saw it.
          The headline gap may well survive it, since it is a difference between two averages of many
          trials, but any interval narrower than {res.quantum} ms below is decoration rather than a
          measurement. Read the rest with that in mind.
        </Refusal>
      )}
      {res.refusal === 'guessing' && (
        <Refusal title="refused: that was guessing, not choosing">
          {fmt(100 * res.runErrRate, 0)} percent of your presses were the wrong key, across the whole
          run. Nothing above the block table is scored, and the reason is specific rather than
          fussy: Hick's law is about the time to identify which alternative occurred, and it is
          measured on trials where you identified it. A run of wrong keys still produces reaction
          times, and they are fast, because pressing something without waiting to see what lit is the
          quickest thing you can do here. Fitting a line to those would hand you a slope near zero
          and call it a bandwidth.
        </Refusal>
      )}
      {res.refusal === 'rhythm' && (
        <Refusal title="refused: one rhythm for everything">
          The spread of your reaction times across the entire run is{' '}
          <span className="font-mono text-rose-200">
            {fmt(sd(res.blocks.flatMap((b) => b.rts)), 0)} ms
          </span>
          , which is too tight to have been produced by five different amounts of uncertainty. A
          steady cadence answers every block at the same speed by construction, so a slope fitted
          through it would be a measurement of the cadence rather than of you. The block table below
          is real. Everything above it is blank on purpose.
        </Refusal>
      )}
      {res.refusal === 'no-fit' && (
        <Refusal title="absent measurement">
          Fewer than {MIN_FIT_BLOCKS} of the four uniform blocks survived their own checks, so there
          is nothing to fit a line to. That is not a small effect and it is not a zero, it is the
          absence of the measurement, and printing a slope anyway would be the dishonest move. The
          held-out predictions are not shown either, for the same reason: a prediction from a line
          fitted to two easy blocks is a real arithmetic result attached to nothing.
        </Refusal>
      )}

      {/* ---------- the model-free headline ---------- */}
      {showModel && h.ok && (
        <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
          <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
            three averages, nothing fitted
          </div>
          <div className="space-y-2">
            <HeadBar
              v={h.four}
              max={Math.max(h.four, h.skew, h.eight)}
              label="4 options · 2.00 bits"
              tone="slate"
            />
            <HeadBar
              v={h.skew}
              max={Math.max(h.four, h.skew, h.eight)}
              label={`8 options, skewed · ${fmt(h.hSkew, 2)} bits`}
              tone="cyan"
            />
            <HeadBar
              v={h.eight}
              max={Math.max(h.four, h.skew, h.eight)}
              label="8 options · 3.00 bits"
              tone="rose"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat
              k="8 options minus 8 skewed"
              v={`${fmt(h.gap, 0)} ms`}
              sub={`95% ${fmt(h.gapLo, 0)} to ${fmt(h.gapHi, 0)} · ${pLabel(h.p)}`}
            />
            <Stat
              k="what N predicts"
              v="0 ms"
              sub="both blocks had eight options"
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            Those two blocks had the same eight boxes, the same eight keys and the same eight
            fingers.{' '}
            {Number.isFinite(h.gapLo) && h.gapLo <= 0 && h.gapHi >= 0 ? (
              <span className="text-amber-200">
                And on your run the difference between them was {fmt(h.gap, 0)} ms with an interval
                covering zero. That is the popular version winning on your data: the number of
                options predicted no difference and there was none to find. It is a real outcome
                rather than a broken one, and the two places to look for why are the learning card
                below, since the distribution has to be discovered before it can help, and the fit
                card, since a run with no slope anywhere has no bits to save in the first place.
              </span>
            ) : h.gap > 0 ? (
              <>
                Only one thing separated them, which is how the eight were distributed, and it cost
                you <span className="text-cyan-300">{fmt(h.gap, 0)} ms</span>. Nothing was removed
                from the faster block. Every option that existed in the slow one existed in the fast
                one.{' '}
                {Number.isFinite(h.predByH) && (
                  <>
                    Hyman's arithmetic, using the slope from your own ladder, says the saving should
                    have been about <span className="text-cyan-300">{fmt(h.predByH, 0)} ms</span>{' '}
                    for the {fmt(3 - h.hSkew, 2)} bits you were spared.
                  </>
                )}
              </>
            ) : (
              <span className="text-amber-200">
                And the skewed block came out {fmt(-h.gap, 0)} ms <em>slower</em> rather than faster,
                which is the opposite of the prediction and worth taking at face value. The usual
                cause is on the learning card below: a distribution nobody told you about takes
                trials to absorb, and a block spent still learning it can cost more than a block
                where everything was equally likely and nothing had to be learned at all.
              </span>
            )}
          </p>
        </div>
      )}

      {/* ---------- the ladder and the fit ---------- */}
      {showModel && !res.slopeCoversZero && Number.isFinite(res.fit.slope) && (
        <Card label="your ladder: reaction time against bits">
          <FitPlot res={res} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat
              k="slope"
              v={`${fmt(res.fit.slope, 0)} ms/bit`}
              sub={`95% ${fmt(res.slopeLo, 0)} to ${fmt(res.slopeHi, 0)}`}
            />
            <Stat
              k="your choice bandwidth"
              v={`${fmt(res.bitsPerSecond, 1)} bit/s`}
              sub={`95% ${fmt(res.bpsLo, 1)} to ${fmt(res.bpsHi, 1)} · one over the slope`}
            />
            <Stat
              k="intercept"
              v={`${fmt(res.fit.intercept, 0)} ms`}
              sub="you plus your machine, and this page cannot split them"
            />
            <Stat k="fit" v={`R² ${fmt(res.fit.r2, 3)}`} sub={`${res.blocks.filter((b) => !b.refused && b.block !== 'SKEW').length} uniform blocks`} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            The slope is the only number here that belongs to you alone. Everything constant about
            your hardware, from the display pipeline to the key scan, is inside the intercept, which
            is why the intercept is not reported as a fact about your nervous system. Hick and Hyman
            both landed slopes in the region of 150 ms per bit on practised subjects, so five to
            seven bits per second, and the interesting thing about that number is how little it has
            moved in seventy years of new input devices.
          </p>
          <div className="mt-4 grid gap-2 text-[11px] font-mono text-slate-500">
            <div>
              refit without the 1-option block: slope {fmt(res.fitNoSimple.slope, 0)} ms/bit,
              intercept {fmt(res.fitNoSimple.intercept, 0)} ms
            </div>
            <div>
              refit on switch trials only (every repeat thrown away): slope{' '}
              {fmt(res.fitSwitchOnly.slope, 0)} ms/bit
            </div>
            <div>
              refit with the movement component subtracted: slope {fmt(res.fitResidualised.slope, 0)}{' '}
              ms/bit, movement cost {fmt(res.stepCoef, 1)} ms per box of travel
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
            The first refit is there because simple reaction time is famously not on the choice line:
            with one alternative there is nothing to identify, and the point tends to sit below where
            the ladder would place it. The second is the repetition control. The third is the Fitts
            control, and on a keyboard it should come back near zero, because your fingers never went
            anywhere. That last coefficient is estimated on switch trials inside the{' '}
            <em>uniform</em> blocks only, never on the skewed one, because in the skewed block the
            distance from the last box is tied to surprisal by construction: a repeat is the frequent
            box and a long jump is a rare one. A regression fitted there would eat the effect this
            page exists to measure and then subtract it back out as though it were geometry.
          </p>
        </Card>
      )}

      {showModel && res.slopeCoversZero && Number.isFinite(res.fit.slope) && (
        <Card label="your ladder: no slope to report">
          <FitPlot res={res} />
          <p className="mt-4 text-sm leading-relaxed text-amber-200">
            Your slope came out {fmt(res.fit.slope, 0)} ms per bit with a 95% interval of{' '}
            {fmt(res.slopeLo, 0)} to {fmt(res.slopeHi, 0)}, which covers zero. That is not a small
            effect, it is an absent one, and it happens two ways. Either you answered every block at
            one cadence, in which case the ladder measured the cadence rather than you, or you are
            practised enough at this mapping that the uncertainty has been compiled away, which is a
            real result and has a literature: Mowbray and Rhoades flattened the slope almost to
            nothing in 1959 with a few thousand trials at four alternatives, and Seibel did it in
            1963 with one thousand and twenty three. The block table below is the place to tell the
            two apart, because a cadence has the same reaction time everywhere and practice has a
            fast one everywhere.
          </p>
        </Card>
      )}

      {/* ---------- held-out predictions ---------- */}
      {showModel && res.preds.length > 0 && (
        <Card label="the part that could have failed: predicting inside the skewed block">
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            The line above was fitted to the four uniform blocks and never saw the skewed one. Each
            row below is one of its three kinds of trial, and the prediction is the fitted line
            evaluated at that trial's own surprisal with no free parameters left to spend. The
            half-the-time box carries one bit and should answer as fast as the whole 2-option block.
            The six rare boxes carry {fmt(LOG2_24, 2)} bits, which is past the end of the ladder, so
            that row is an extrapolation and is marked as one.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-slate-600">
                  <th className="pb-2 text-left font-normal">trial kind</th>
                  <th className="pb-2 text-right font-normal">bits</th>
                  <th className="pb-2 text-right font-normal">n</th>
                  <th className="pb-2 text-right font-normal">predicted</th>
                  <th className="pb-2 text-right font-normal">observed 95%</th>
                  <th className="pb-2 text-right font-normal">lands</th>
                </tr>
              </thead>
              <tbody>
                {res.preds.map((p) => (
                  <tr key={p.key} className="border-t border-slate-900">
                    <td className="py-2 text-slate-400">
                      {p.label}
                      {p.extrapolated && <span className="text-amber-500/70"> ·  beyond the fit</span>}
                    </td>
                    <td className="py-2 text-right text-slate-500">{fmt(p.h, 2)}</td>
                    <td className="py-2 text-right text-slate-600">{p.n}</td>
                    <td className="py-2 text-right text-cyan-300">{fmt(p.predicted, 0)}</td>
                    <td className="py-2 text-right text-slate-300">
                      {fmt(p.observed, 0)} [{fmt(p.obsLo, 0)}, {fmt(p.obsHi, 0)}]
                    </td>
                    <td className="py-2 text-right">
                      {p.n < MIN_CELL ? (
                        <span className="text-slate-700">thin</span>
                      ) : p.inside ? (
                        <span className="text-emerald-400">yes</span>
                      ) : (
                        <span className="text-rose-400">no</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {res.predsInside} of {res.preds.length} predictions landed inside the interval of the
            data they were predicting.{' '}
            {res.predsInside === res.preds.length
              ? 'A line fitted to how many options there were, predicting times produced by how likely each one was, is the whole content of the claim that N was never the variable.'
              : 'A miss here is informative rather than embarrassing: the rare-box row in particular asks the line to work outside the range it was fitted on, and it is allowed to fail there.'}
          </p>
        </Card>
      )}

      {/* ---------- the repetition control ---------- */}
      {showModel && res.predsSwitch.length > 0 && (
        <Card label="the control that matters: was it surprise, or just repetition?">
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            In the skewed block the frequent box is not only the low-surprisal one, it is also the
            one most likely to repeat, and repetitions are faster in every choice task ever run.
            Surprisal and repetition are tangled together by construction, so the whole prediction is
            re-run with every repeat trial thrown away. The size of the repeat advantage itself is
            measured in the <em>uniform</em> blocks, where every position carries the same surprisal
            and a repeat is therefore nothing but a repeat. Measured in the skewed block it would
            mostly be the surprisal effect wearing a different name.
          </p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Stat
              k="repeat advantage"
              v={`${fmt(res.repeatGain, 0)} ms`}
              sub={`95% ${fmt(res.repeatGainLo, 0)} to ${fmt(res.repeatGainHi, 0)} · switch minus repeat, uniform blocks only`}
            />
            <Stat
              k="slope, repeats removed"
              v={`${fmt(res.fitSwitchOnly.slope, 0)} ms/bit`}
              sub={`against ${fmt(res.fit.slope, 0)} with them in`}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-slate-600">
                  <th className="pb-2 text-left font-normal">trial kind, switches only</th>
                  <th className="pb-2 text-right font-normal">n</th>
                  <th className="pb-2 text-right font-normal">predicted</th>
                  <th className="pb-2 text-right font-normal">observed 95%</th>
                  <th className="pb-2 text-right font-normal">lands</th>
                </tr>
              </thead>
              <tbody>
                {res.predsSwitch.map((p) => (
                  <tr key={p.key} className="border-t border-slate-900">
                    <td className="py-2 text-slate-400">{p.label}</td>
                    <td className="py-2 text-right text-slate-600">{p.n}</td>
                    <td className="py-2 text-right text-cyan-300">{fmt(p.predicted, 0)}</td>
                    <td className="py-2 text-right text-slate-300">
                      {p.n < MIN_CELL ? '--' : `${fmt(p.observed, 0)} [${fmt(p.obsLo, 0)}, ${fmt(p.obsHi, 0)}]`}
                    </td>
                    <td className="py-2 text-right">
                      {p.n < MIN_CELL ? (
                        <span className="text-slate-700">thin</span>
                      ) : p.inside ? (
                        <span className="text-emerald-400">yes</span>
                      ) : (
                        <span className="text-rose-400">no</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            Hyman made this same point from the other side in his second experiment: a sequence you
            can partly predict from the previous item carries less than its nominal entropy, and
            reaction time tracks the smaller number. Which is why the uniform blocks here were
            constrained so nothing appeared three times in a row.
          </p>
        </Card>
      )}

      {/* ---------- learning ---------- */}
      {showModel && Number.isFinite(res.learnFirst) && (
        <Card label="you were never told the distribution">
          <div className="grid grid-cols-2 gap-3">
            <Stat k="skewed block, first half" v={`${fmt(res.learnFirst, 0)} ms`} sub={`${Math.floor(res.learnN / 2)} trials`} />
            <Stat
              k="skewed block, second half"
              v={`${fmt(res.learnSecond, 0)} ms`}
              sub={`${res.learnN - Math.floor(res.learnN / 2)} trials`}
            />
          </div>
          <div className="mt-3">
            <Stat
              k="drop between halves"
              v={`${fmt(res.learnFirst - res.learnSecond, 0)} ms`}
              sub={
                Number.isFinite(res.learnLo)
                  ? `95% ${fmt(res.learnLo, 0)} to ${fmt(res.learnHi, 0)}`
                  : 'too few trials for an interval'
              }
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Nothing on the page said one box would come up half the time. It had to be picked up from
            the trials themselves, which means the saving should grow across the block as the
            distribution gets absorbed.{' '}
            {!Number.isFinite(res.learnLo) ? (
              'There were too few scored trials in that block to put an interval on the difference, so it is printed and not interpreted.'
            ) : res.learnLo > 0 ? (
              <>
                Yours dropped {fmt(res.learnFirst - res.learnSecond, 0)} ms between halves with an
                interval clear of zero, which is what learning a distribution looks like from the
                inside: nobody notices doing it.
              </>
            ) : res.learnHi < 0 ? (
              <>
                Yours went {fmt(res.learnSecond - res.learnFirst, 0)} ms the other way, which is
                worth taking at face value rather than explaining away. Seventy two trials of a task
                with no feedback is also long enough to get slower.
              </>
            ) : (
              <>
                Yours moved {fmt(res.learnFirst - res.learnSecond, 0)} ms, with an interval covering
                zero. That is a difference this run cannot distinguish from none, and it is printed
                that way rather than read as learning, because two halves of anything differ by some
                number whether or not anything happened. Twelve trials were already thrown away at
                the start of that block, so the absorbing may simply have finished before the
                scoring began.
              </>
            )}
          </p>
        </Card>
      )}

      {/* ---------- per block ---------- */}
      <Card label="every block, including the ones that were refused">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="text-slate-600">
                <th className="pb-2 text-left font-normal">block</th>
                <th className="pb-2 text-right font-normal">bits</th>
                <th className="pb-2 text-right font-normal">order</th>
                <th className="pb-2 text-right font-normal">kept</th>
                <th className="pb-2 text-right font-normal">mean</th>
                <th className="pb-2 text-right font-normal">sd</th>
                <th className="pb-2 text-right font-normal">err</th>
                <th className="pb-2 text-right font-normal">note</th>
              </tr>
            </thead>
            <tbody>
              {res.blocks.map((b) => (
                <tr key={b.block} className="border-t border-slate-900">
                  <td className={`py-2 ${b.block === 'SKEW' ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {b.label}
                  </td>
                  <td className="py-2 text-right text-slate-500">{fmt(b.h, 2)}</td>
                  <td className="py-2 text-right text-slate-600">{b.order + 1}</td>
                  <td className="py-2 text-right text-slate-500">{b.kept}</td>
                  <td className="py-2 text-right text-slate-300">
                    {b.refused ? '--' : fmt(b.m, 0)}
                  </td>
                  <td className="py-2 text-right text-slate-600">
                    {b.refused ? '--' : fmt(b.sdRT, 0)}
                  </td>
                  <td className="py-2 text-right text-slate-600">{fmt(100 * b.errRate, 0)}%</td>
                  <td className="py-2 text-right">
                    {b.refused === 'thin' ? (
                      <span className="text-rose-400">too few</span>
                    ) : b.refused === 'errors' ? (
                      <span className="text-rose-400">error rate</span>
                    ) : (
                      <span className="text-slate-700">ok</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
          Block order was shuffled for this run: {res.order.map((k) => BLOCK_LABEL[k]).join(' → ')}.
          The first {DROP.N1} trials of every uniform block and the first {DROP.SKEW} of the skewed
          one are dropped before anything is scored, the skewed one getting more because its opening
          trials are spent learning a distribution nobody described.
        </p>
      </Card>

      {/* ---------- machine disclosure ---------- */}
      <Card label="what your machine did while you were answering">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            k="frame gap, median"
            v={`${fmt(res.frameMedian, 1)} ms`}
            sub={`slowest tenth ${fmt(res.frameP90, 1)} ms · ${res.frameSlow} over 20 ms`}
          />
          <Stat
            k="clock quantum"
            v={res.quantum ? `${res.quantum} ms` : 'sub-millisecond'}
            sub={res.quantum >= QUANTUM_REFUSE ? 'refused above 40 ms' : 'recovered from your own data'}
          />
          <Stat
            k="anticipations"
            v={`${res.totalAnticipations}`}
            sub={`presses before the box lit or under ${RT_FLOOR} ms, re-queued`}
          />
          <Stat
            k="trials killed"
            v={`${res.totalKilled}`}
            sub="hidden tab, mid-trial, re-queued"
          />
        </div>
        <div className="mt-4">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-600">
            which keys you pressed, across everything
          </div>
          <div className="grid grid-cols-8 gap-1">
            {res.pressCounts.map((c, i) => {
              const mx = Math.max(...res.pressCounts, 1);
              return (
                <div key={i} className="text-center">
                  <div className="mx-auto flex h-14 w-full items-end overflow-hidden rounded bg-slate-950">
                    <div
                      className="w-full bg-slate-700"
                      style={{ height: `${clamp((c / mx) * 100, 2, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 font-mono text-[9px] text-slate-600">{KEY_LABELS[i]}</div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          You answered mostly by {res.mode === 'touch' ? 'tapping' : res.mode === 'mixed' ? 'a mix of keys and taps' : 'keyboard'}.
          {res.mode !== 'keyboard' && (
            <>
              {' '}
              That matters, because a tap has to travel and a resting finger does not, and the mean
              distance travelled grows with how many boxes are live. The refit with the movement
              component removed is on the fit card above: it charged {fmt(res.stepCoef, 1)} ms per box
              of travel and left the slope at {fmt(res.fitResidualised.slope, 0)} ms per bit.
            </>
          )}{' '}
          Frame gaps are printed because jitter is the one thing about your machine that can reach
          these numbers, and it reaches them by widening intervals rather than by moving means.
        </p>
      </Card>

      {/* ---------- playground ---------- */}
      <Playground fit={res.fit} />

      {/* ---------- what it explains ---------- */}
      <Card label="where you have been paying this all along">
        <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="text-cyan-300">The menu that is not slow.</span> Thirty commands you use
            daily is not fifteen times worse than two. You are not scanning thirty equally likely
            things, you are recognising one of four you actually use, and the other twenty six cost
            you almost nothing because they almost never come up.
          </li>
          <li>
            <span className="text-cyan-300">The shortcut you press twice a year.</span> It is slow,
            and it is slow for the same reason the six rare boxes above were slow. Frequency is the
            whole of the difference between a shortcut that feels instant and one you have to think
            about, and both live on the same keyboard.
          </li>
          <li>
            <span className="text-cyan-300">Autocomplete removes nothing.</span> It does not shorten
            the list of things you could have typed. It redistributes the probability, which is the
            variable that was being billed. Same for recently-used, for a default button, for a
            sorted-by-frequency emoji picker.
          </li>
          <li>
            <span className="text-cyan-300">Huffman coding is this arithmetic run backwards.</span>{' '}
            Under every zip file and every JPEG you have opened: give the frequent symbol the short
            code, and the average length falls to the entropy rather than to log
            <sub>2</sub>(N). Your hands were doing the decoder's half of it for the last four
            minutes.
          </li>
          <li>
            <span className="text-cyan-300">And the advice is aimed at the wrong variable.</span>{' '}
            Cutting eight equally likely options to four buys exactly one bit and costs you four
            things you used to be able to do. Making one of the eight likely buys most of the same
            bit and costs nothing at all. That is not a design opinion, it is what the formula says,
            and it has said it since 1953.
          </li>
        </ul>
      </Card>

      {/* ---------- honest limits ---------- */}
      <Card label="what this run cannot tell you">
        <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-300">The slope is not a constant of you.</span> Enough
            practice dissolves it. Mowbray and Rhoades in 1959 flattened it nearly to zero with a few
            thousand trials at four alternatives, and Seibel in 1963 did it with one thousand and
            twenty three. Hick's law describes uncertainty you have not yet compiled away.
          </li>
          <li>
            <span className="text-slate-300">The mapping was made as easy as possible.</span> Fitts
            and Seeger showed in 1953 that the slope also depends on how naturally the stimulus maps
            to the response. This page uses a spatially compatible mapping, which is the friendliest
            case. A worse one would be steeper, and that would be a fact about the interface rather
            than about you.
          </li>
          <li>
            <span className="text-slate-300">Four points do not settle a functional form.</span> The
            ladder here can tell a line in bits apart from a line in N, because those two disagree by
            a mile on the skewed block. It cannot referee the finer arguments, and there are real
            ones: Longstreth and colleagues in 1985 argued a good part of the classic slope is set
            size confounded with practice per alternative.
          </li>
          <li>
            <span className="text-slate-300">The intercept is not yours.</span> It contains your
            display pipeline, your keyboard's scan rate and your browser's event loop, and this page
            has no way to separate those from you. Only the slope is reported as a fact about a
            person, and only because a constant cannot move a slope.
          </li>
        </ul>
      </Card>

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-center">
        <p className="text-sm leading-relaxed text-slate-400">
          Everything above happened in your browser. Nothing was recorded, nothing was sent, and
          reloading this page destroys it.
        </p>
        <button
          onClick={onAgain}
          className="mt-4 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-500/20"
        >
          Run it again
        </button>
      </div>
    </div>
  );
}

// ============================ plot ============================

function FitPlot({ res }: { res: Result }) {
  const W = 520;
  const H = 330;
  const P = 48;
  const uni = res.blocks.filter((b) => !b.refused && b.block !== 'SKEW');
  const skew = res.blocks.find((b) => b.block === 'SKEW' && !b.refused);
  if (uni.length < 2) return null;

  const pts = [...uni.map((b) => b.m), ...(skew ? [skew.m] : []), ...res.cells.map((c) => c.m)].filter(
    (v) => Number.isFinite(v),
  );
  const yLo = Math.max(0, Math.min(...pts) - 90);
  const yHi = Math.max(...pts) + 90;
  const xLo = -0.25;
  const xHi = 4.9;
  const X = (v: number) => P + ((v - xLo) / (xHi - xLo)) * (W - P - 16);
  const Y = (v: number) => H - P - ((v - yLo) / (yHi - yLo)) * (H - P - 18);

  const a = res.fit.intercept;
  const b = res.fit.slope;
  const hasLine = Number.isFinite(a) && Number.isFinite(b);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 1, 2, 3, 4].map((i) => {
        const v = yLo + ((yHi - yLo) * i) / 4;
        return (
          <g key={i}>
            <line x1={P} y1={Y(v)} x2={W - 12} y2={Y(v)} stroke="#1e293b" strokeWidth="1" />
            <text x={P - 6} y={Y(v) + 3} fill="#475569" fontSize="9" textAnchor="end">
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      {[0, 1, 2, 3, 4].map((t) => (
        <text key={t} x={X(t)} y={H - P + 15} fill="#475569" fontSize="9" textAnchor="middle">
          {t}
        </text>
      ))}
      <text x={W / 2} y={H - 8} fill="#334155" fontSize="9" textAnchor="middle">
        bits of uncertainty
      </text>
      <text x={12} y={16} fill="#334155" fontSize="9">
        ms
      </text>

      {/* the fitted line, drawn solid where it was fitted and dashed where it extrapolates */}
      {hasLine && (
        <>
          <line
            x1={X(0)}
            y1={Y(a)}
            x2={X(3)}
            y2={Y(a + b * 3)}
            stroke="#22d3ee"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <line
            x1={X(3)}
            y1={Y(a + b * 3)}
            x2={X(4.75)}
            y2={Y(a + b * 4.75)}
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        </>
      )}

      {/* uniform blocks: what the line was fitted to */}
      {uni.map((bl) => (
        <g key={bl.block}>
          <line
            x1={X(bl.h)}
            y1={Y(bl.lo)}
            x2={X(bl.h)}
            y2={Y(bl.hi)}
            stroke="#64748b"
            strokeWidth="1"
          />
          <circle cx={X(bl.h)} cy={Y(bl.m)} r="4" fill="#e2e8f0" />
        </g>
      ))}

      {/* the skewed block mean, at its realised entropy */}
      {skew && (
        <g>
          <circle cx={X(res.head.hSkew)} cy={Y(skew.m)} r="5" fill="#a78bfa" />
          <text
            x={X(res.head.hSkew)}
            y={Y(skew.m) - 12}
            fill="#a78bfa"
            fontSize="9"
            textAnchor="middle"
          >
            8 skewed
          </text>
        </g>
      )}

      {/* the three held-out cells */}
      {res.cells
        .filter((c) => c.n >= MIN_CELL)
        .map((c) => (
          <g key={c.key}>
            <line x1={X(c.h)} y1={Y(c.lo)} x2={X(c.h)} y2={Y(c.hi)} stroke="#f59e0b" strokeWidth="1" opacity="0.7" />
            <rect x={X(c.h) - 3.5} y={Y(c.m) - 3.5} width="7" height="7" fill="#f59e0b" />
          </g>
        ))}
    </svg>
  );
}

// ============================ playground ============================

function Playground({ fit }: { fit: Line }) {
  const [skew, setSkew] = useState(0);

  // A one-parameter family over eight fixed options: at 0 they are equally likely and H is 3 bits,
  // and as it climbs the probability piles onto the first one. N never changes. Nothing is removed.
  const ps = useMemo(() => {
    const raw = Array.from({ length: 8 }, (_, i) => Math.exp(-skew * i));
    const s = raw.reduce((x, y) => x + y, 0);
    return raw.map((r) => r / s);
  }, [skew]);

  const h = useMemo(() => -ps.reduce((s, p) => s + (p > 0 ? p * log2(p) : 0), 0), [ps]);

  const usable = Number.isFinite(fit.slope) && Number.isFinite(fit.intercept) && fit.slope > 0;
  const a = usable ? fit.intercept : 250;
  const b = usable ? fit.slope : 150;
  const rt = a + b * h;
  const rtUniform = a + b * 3;

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
        playground: eight options, all the way down
      </div>

      <div className="flex h-32 items-end gap-1.5">
        {ps.map((p, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <div className="mb-1 font-mono text-[9px] text-slate-600">
              {(100 * p).toFixed(p > 0.1 ? 0 : 1)}%
            </div>
            <div
              className="w-full rounded-t bg-violet-400/60"
              style={{ height: `${clamp(p * 260, 1.5, 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-8 gap-1.5">
        {KEY_LABELS.map((k, i) => (
          <div key={i} className="text-center font-mono text-[9px] text-slate-700">
            {k}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat k="options" v="8" sub="never changes, nothing removed" />
        <Stat k="entropy" v={`${fmt(h, 2)} bits`} sub={`${fmt(3 - h, 2)} bits cheaper than uniform`} />
        <Stat
          k="predicted time"
          v={`${fmt(rt, 0)} ms`}
          sub={usable ? `${fmt(rtUniform - rt, 0)} ms saved, from your own fit` : 'no slope this run, using 150 ms/bit'}
        />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            how uneven the eight are
          </span>
          <span className="font-mono text-xs text-slate-300">{fmt(skew, 2)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={2.5}
          step={0.01}
          value={skew}
          onChange={(e) => setSkew(Number(e.target.value))}
          className="w-full accent-violet-400"
        />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Drag it and watch what does not happen: no option ever disappears. There are eight at every
        position of that slider, all eight reachable, all eight still on the keyboard. What moves is
        the entropy, and the entropy is the thing being billed. Push it to the right end and you have
        eight options costing less than two equally likely ones. That is not a trick of the model, it
        is what a shortcut you press two hundred times a day already feels like, and it is why the
        instruction to cut the number of choices was always aiming at the wrong variable.
      </p>
    </div>
  );
}

// ============================ small components ============================

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">{label}</div>
      {children}
    </div>
  );
}

function Refusal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-rose-500/40 bg-rose-500/[0.06] p-5">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-rose-300">{title}</div>
      <p className="text-sm leading-relaxed text-slate-300">{children}</p>
    </div>
  );
}

function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{k}</div>
      <div className="font-mono text-lg text-slate-100">{v}</div>
      {sub && <div className="font-mono text-[10px] leading-tight text-slate-600">{sub}</div>}
    </div>
  );
}

function HeadBar({
  v,
  max,
  label,
  tone,
}: {
  v: number;
  max: number;
  label: string;
  tone: 'slate' | 'rose' | 'cyan';
}) {
  const fill =
    tone === 'rose' ? 'bg-rose-400/50' : tone === 'cyan' ? 'bg-cyan-400/50' : 'bg-slate-500/40';
  const text =
    tone === 'rose' ? 'text-rose-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-slate-300';
  const w = Number.isFinite(v) && max > 0 ? `${clamp((v / (max * 1.1)) * 100, 3, 100)}%` : '0%';
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 flex-1 overflow-hidden rounded bg-slate-950">
        <div className={`h-full ${fill}`} style={{ width: w }} />
      </div>
      <div className="w-44 shrink-0 font-mono text-[10px] leading-tight text-slate-500">
        <span className={text}>{fmt(v, 0)} ms</span>
        <br />
        {label}
      </div>
    </div>
  );
}
