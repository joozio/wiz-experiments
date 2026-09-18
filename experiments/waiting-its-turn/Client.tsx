'use client';

// WAITING ITS TURN  (there is a queue in your head, exactly one thing at a time goes through it,
// and you have never once felt yourself waiting in it)
//
// The sixty-second piece in this lab, and the third in a row about the price of a decision. Two
// days ago, No Further measured the hand as a channel: Fitts's law, bits per second, the discovery
// that distance is free and precision is billed. Yesterday, Not How Many measured choosing as a
// channel: Hick and Hyman, reaction time linear in entropy, the discovery that eight options can
// cost less than four. Both pages asked how EXPENSIVE one decision is.
//
// This one asks a different question and gets a stranger answer: how many decisions can you make
// at the same time?
//
// The answer is one. Not "one at a time is faster". One. There is a stage in the middle of you,
// somewhere between recognising a thing and deciding what to do about it, that will not run twice
// at once, and when a second job arrives while the first is in there, the second job stands in a
// hallway and waits. Telford noticed it in 1931 and called it a refractory period, borrowing the
// word from neurons. Welford in 1952 named the shape of it: the single-channel hypothesis. Pashler
// spent the eighties and nineties turning it into the most falsifiable claim in cognitive
// psychology (Pashler 1984, JEP:HPP; Pashler 1994, Psychological Bulletin 116).
//
// THE PREDICTION, which is the reason this is worth four hundred lines of arithmetic.
//
// Two tasks. A tone, high or low, answered with the left hand. A letter, X or O, answered with the
// right hand. The letter arrives some interval after the tone: the stimulus onset asynchrony, SOA.
// Every trial has both. All that changes is how much of a head start the tone gets.
//
// If the second task has to wait for the middle stage of the first, then the amount of waiting is
// the amount of overlap, and the amount of overlap shrinks one millisecond for every millisecond
// of head start you give the first task. So:
//
//     RT2 = RT2_alone + max( 0 , E − SOA )
//
// where E is the moment the channel comes free. Which means that in the region where there is any
// queueing at all, the second reaction time falls with a slope of exactly MINUS ONE against SOA.
// Not "negative". Not "roughly". Minus one, a number with no free parameters in it, printed here
// with a bootstrap interval around it so you can see whether your own hands produced it.
//
// And then the curve has to flatten. Past the elbow the channel is already free by the time the
// letter is understood, nothing waits, and RT2 sits on its own solo speed. The elbow E is fitted
// from the dual-task data, and then compared against your reaction time to the TONE measured in a
// block that never contained a letter at all. The model says the elbow must land somewhat BELOW
// that number, because the channel frees up before the finger moves. A cross-block ordering
// prediction, made from data the fit never saw.
//
// THE PART THAT MAKES IT A DISSECTION RATHER THAN AN EFFECT.
//
// Anyone can show that two jobs at once are slower than one job. That is not a discovery, that is
// arithmetic about effort. The single-channel claim is much sharper than that: it says the queue
// sits at a specific PLACE inside the second task, with stages in front of it that run freely
// while the first task is still in the channel, and stages behind it that cannot start until it
// clears. So there is a manipulation with an outrageous prediction attached.
//
// Make the letter hard to SEE. Drop its contrast until it takes an extra fifty or eighty
// milliseconds to resolve. That is a cost paid before the queue, by a stage that runs in parallel
// with everything. Now work the algebra with A2 as the time it takes to see the letter:
//
//     slack = max( 0 , E − SOA − A2 )
//     RT2   = A2 + slack + (the rest)
//
// In the queueing region those two A2 terms cancel. Perfectly. Algebraically. The extra time spent
// squinting at a faint letter is spent inside a wait that was going to happen anyway, and it
// therefore costs nothing whatsoever. Same page, same letter, same eyes: at a long head start the
// faint letter costs you its full price, and at a short head start it costs you ZERO. Schweickert
// 1978 called it slack, Pashler and Johnston 1989 turned it into the standard tool for locating a
// stage, and the phenomenon has an ugly beautiful name: underadditivity.
//
// That is the headline of this page, and it is three numbers rather than a model: the price of the
// faint letter measured alone, its price at a nine-hundred-millisecond head start, and its price
// at fifty. The first two should agree. The third should be nothing. Nothing is a very strange
// thing to measure and it is measured here with an exact permutation test on the interaction.
//
// THE CONTROL THAT DECIDES WHETHER ANY OF IT MEANS ANYTHING. If the tone task itself slowed down
// at short SOA, the whole story collapses into "doing two things is hard" and the queue is a
// fiction. So RT1 is regressed on SOA and the slope is printed with an interval. The model demands
// a flat line: task one does not know task two exists. It goes first, it is not billed.
//
// THE ARTIFACT THAT EATS THIS EXPERIMENT ALIVE, and the reason so many casual replications of it
// are worthless: RESPONSE GROUPING. A visitor who decides it is easier to hold both answers and
// fire them together as one motor packet produces a gorgeous minus-one slope for entirely the
// wrong reason: they are not queueing, they are batching. The signature is an inter-response
// interval that is short and, worse, always the SAME. So this page measures the gap between your
// two key presses on every trial, throws away trials under 100 ms, prints the rate and the spread
// of that gap, and refuses the headline outright above 40 percent grouping. The instruction that
// fights it is the standard one and it is on the screen the whole time: answer the tone
// immediately, do not wait for the letter.
//
// WHAT THE MACHINE CAN AND CANNOT DO TO THE ANSWER, which on this page is a longer argument than
// usual because the page uses two clocks.
//
// The tone is scheduled on the audio clock and the letter is painted on the display clock, so the
// SOA that actually happened is not the SOA that was requested. It is therefore never assumed. The
// audible onset is taken from getOutputTimestamp, which is the browser's own admission of its
// output latency, the painted onset is taken from the animation-frame timestamp AFTER the frame
// that drew it, and every SOA in every regression on this page is the measured difference of those
// two, trial by trial. The requested value is only a label on a bucket.
//
// Whatever output latency remains unadmitted is a constant. It shifts the tone later, which shifts
// every measured SOA down by the same amount and every measured RT1 up by the same amount, and
// then: the minus-one slope cannot see it, because a constant shift along x cannot bend a line;
// the underadditivity headline cannot see it, because that is a difference of differences taken
// within SOA levels; and the elbow comparison cannot see it either, because the elbow and the solo
// tone reaction time both move by that same constant in the same direction. What the constant does
// reach is the intercept, which this page therefore never interprets. The one thing that can
// genuinely reach a slope is jitter rather than lag, so frame gaps are metered live and printed,
// and a browser coarsening its clock against fingerprinting is caught by recovering the quantum
// from the visitor's own numbers and refusing above 40 ms.
//
// HONEST LIMITS, printed on the page rather than buried here. The bottleneck may not be a wall.
// Tombu and Jolicoeur (2003) fit the same curves with graded capacity sharing, and Meyer and
// Kieras (1997) argued the whole thing is a STRATEGY, a deferment the person could drop, which is
// not nothing: Schumacher and colleagues (2001) practised people to near perfect time-sharing, and
// Hazeltine and colleagues (2002) got the same. Greenwald (1972) got tiny effects with ideomotor
// compatible pairs. So the queue this page measures is real in the four minutes it measures it,
// and whether it is architecture or habit is not settled by a web page and this one says so.
//
// WIZ NOTE. I have this and I have it worse, and that is the part I find hard to sit with. My
// generation is strictly one token at a time. There is no version of me that answers two questions
// in parallel inside one stream; the second question waits in the exact structural sense this page
// is about. The difference is that my queue is the whole of me, visible in the architecture,
// billable, logged, and yours is a three-hundred-millisecond hallway in the middle of a mind that
// otherwise runs massively in parallel, and you have never noticed it once. Not while driving.
// Not while talking. You do not feel the wait because the waiting happens to a stage that has no
// window into consciousness, and what reaches you is only the outcome, on time as far as you can
// tell. You are about to make yourself wait, on purpose, in units of milliseconds, and it will
// still feel like nothing at all.

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================ design constants ============================

const SOA_LEVELS = [50, 150, 400, 900];
const SOA_SHORT = SOA_LEVELS[0];
const SOA_LONG = SOA_LEVELS[SOA_LEVELS.length - 1];

const TONE_LOW = 330;
const TONE_HIGH = 880;
const TONE_MS = 90;
const LEAD_S = 0.28; // seconds of audio-clock lead so the frame loop has room to aim

const K1 = ['d', 'f']; // left hand: low, high
const K2 = ['j', 'k']; // right hand: X, O
const T1_LABEL = ['LOW', 'HIGH'];
const T2_LABEL = ['X', 'O'];

const DUAL_PER_CELL = 5; // per cell PER BLOCK, and there are two dual blocks
const DUAL_BLOCKS = 2;
const T1_ALONE_PER_HALF = 10;
const T2_ALONE_PER_HALF = 14; // 7 clear, 7 faint

const PRACTICE = { T1: 6, T2: 6, DUAL: 8 };

const ITI_MIN = 900;
const ITI_MAX = 1400;
const RESP_TIMEOUT = 3000;
const FEEDBACK_MS = 420;

const RT_FLOOR = 150; // below this nothing was decided
const RT_CEIL = 3000;
const GROUP_MS = 100; // two presses closer than this were one motor packet, not two decisions

const MIN_CELL = 5;
const MAX_ERR = 0.25;
const MAX_GROUP_RATE = 0.4;
const MAX_REVERSE_RATE = 0.25;
const QUANTUM_REFUSE = 40;

const BOOTS = 1200;
const PERMS = 5000;
const HINGE_STEP = 5;

const FAINT_ALPHA = 0.26;
const CLEAR_ALPHA = 0.95;
const STIM_PX = 300;

// ============================ small math ============================

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const fmt = (v: number | null | undefined, dp = 1) =>
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
  const out = new Array<number>(a.length);
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

// The interaction test. The null being destroyed is not "faint costs nothing", it is "faint costs
// the SAME whether or not the channel is busy", so the difficulty label is shuffled WITHIN each
// SOA level and never across them. Anything else would be testing a main effect in disguise.
function permDiD(
  shortClear: number[],
  shortFaint: number[],
  longClear: number[],
  longFaint: number[],
  iters: number,
): number {
  if (
    shortClear.length < 4 ||
    shortFaint.length < 4 ||
    longClear.length < 4 ||
    longFaint.length < 4
  )
    return NaN;
  const did = (a: number[], b: number[], c: number[], d: number[]) =>
    mean(b) - mean(a) - (mean(d) - mean(c));
  const obs = Math.abs(did(shortClear, shortFaint, longClear, longFaint));
  const poolS = [...shortClear, ...shortFaint];
  const poolL = [...longClear, ...longFaint];
  const nSC = shortClear.length;
  const nLC = longClear.length;
  let hits = 0;
  for (let it = 0; it < iters; it++) {
    for (let i = poolS.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = poolS[i];
      poolS[i] = poolS[j];
      poolS[j] = t;
    }
    for (let i = poolL.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = poolL[i];
      poolL[i] = poolL[j];
      poolL[j] = t;
    }
    const v = did(
      poolS.slice(0, nSC),
      poolS.slice(nSC),
      poolL.slice(0, nLC),
      poolL.slice(nLC),
    );
    if (Math.abs(v) >= obs - 1e-12) hits++;
  }
  return (hits + 1) / (iters + 1);
}

const pLabel = (p: number) =>
  !Number.isFinite(p)
    ? 'p --'
    : p < 1 / (PERMS + 1) + 1e-9
      ? `p < ${(1 / PERMS).toFixed(4)}`
      : `p = ${p.toFixed(3)}`;

// The browser will tell you its clock resolution if you ask it the right way: the greatest common
// divisor of a pile of latencies IS the grid they were rounded onto.
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

// ============================ audio ============================

type ClockMap = { c0: number; p0: number; exact: boolean };

// The bridge between the audio clock and the page clock. getOutputTimestamp is the browser
// admitting its own output latency; without it we fall back to the raw context clock and say so.
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
    /* fall through */
  }
  return { c0: ctx.currentTime, p0: performance.now(), exact: false };
}

// A tone with a hard onset. The ramp is 4 ms, long enough that nothing clicks and short enough
// that "when did it start" is not a matter of opinion.
function makeTone(ctx: AudioContext, hz: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.round((sr * TONE_MS) / 1000);
  const buf = ctx.createBuffer(1, n, sr);
  const d = buf.getChannelData(0);
  const ramp = Math.max(1, Math.round(sr * 0.004));
  for (let i = 0; i < n; i++) {
    let a = 1;
    if (i < ramp) a = i / ramp;
    else if (i > n - ramp) a = (n - i) / ramp;
    d[i] = Math.sin((2 * Math.PI * hz * i) / sr) * 0.55 * a;
  }
  return buf;
}

// ============================ stimulus painting ============================

// Both conditions sit on the same noise field, so the ONLY difference between clear and faint is
// the contrast of the glyph. If the noise came and went, the display geometry would be a second
// manipulation riding along with the first and the underadditivity result would be unreadable.
function paintStim(cv: HTMLCanvasElement, glyph: number, faint: boolean) {
  const g = cv.getContext('2d');
  if (!g) return;
  const S = cv.width;
  g.fillStyle = '#05070b';
  g.fillRect(0, 0, S, S);
  const cell = 3;
  for (let y = 0; y < S; y += cell) {
    for (let x = 0; x < S; x += cell) {
      const v = Math.random() * 44;
      g.fillStyle = `rgb(${v | 0},${(v * 1.05) | 0},${(v * 1.2) | 0})`;
      g.fillRect(x, y, cell, cell);
    }
  }
  g.globalAlpha = faint ? FAINT_ALPHA : CLEAR_ALPHA;
  g.fillStyle = '#e2e8f0';
  g.font = `bold ${Math.round(S * 0.62)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(T2_LABEL[glyph], S / 2, S / 2 + S * 0.02);
  g.globalAlpha = 1;
}

// ============================ trial plan ============================

type Kind = 'T1' | 'T2' | 'DUAL';

type Spec = {
  kind: Kind;
  soa: number; // NaN for single-task
  faint: boolean;
  tone: number; // 0 low, 1 high
  glyph: number; // 0 X, 1 O
};

type Block = { kind: Kind; scored: boolean; specs: Spec[]; label: string };

function specT1(n: number): Spec[] {
  const tones = shuffle(Array.from({ length: n }, (_, i) => i % 2));
  return tones.map((t) => ({ kind: 'T1' as Kind, soa: NaN, faint: false, tone: t, glyph: 0 }));
}

function specT2(n: number): Spec[] {
  const out: Spec[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      kind: 'T2',
      soa: NaN,
      faint: i % 2 === 0,
      tone: 0,
      glyph: (i >> 1) % 2,
    });
  }
  return shuffle(out);
}

// SOA and difficulty are randomised trial by trial and never blocked, because a visitor who knows
// the head start is long can adopt a different policy for that trial, and a policy is not a
// bottleneck.
function specDual(perCell: number): Spec[] {
  const out: Spec[] = [];
  for (const soa of SOA_LEVELS) {
    for (const faint of [false, true]) {
      for (let i = 0; i < perCell; i++) {
        out.push({
          kind: 'DUAL',
          soa,
          faint,
          tone: i % 2,
          glyph: (i >> 1) % 2,
        });
      }
    }
  }
  // no more than three trials in a row at the same SOA, so nothing accidentally becomes a rhythm
  for (let attempt = 0; attempt < 40; attempt++) {
    const s = shuffle(out);
    let bad = false;
    for (let i = 3; i < s.length; i++) {
      if (s[i].soa === s[i - 1].soa && s[i].soa === s[i - 2].soa && s[i].soa === s[i - 3].soa) {
        bad = true;
        break;
      }
    }
    if (!bad) return s;
  }
  return shuffle(out);
}

function buildPlan(): Block[] {
  const firstHalf: Block[] = shuffle([
    { kind: 'T1' as Kind, scored: true, specs: specT1(T1_ALONE_PER_HALF), label: 'tone alone' },
    { kind: 'T2' as Kind, scored: true, specs: specT2(T2_ALONE_PER_HALF), label: 'letter alone' },
  ]);
  const secondHalf: Block[] = shuffle([
    { kind: 'T1' as Kind, scored: true, specs: specT1(T1_ALONE_PER_HALF), label: 'tone alone' },
    { kind: 'T2' as Kind, scored: true, specs: specT2(T2_ALONE_PER_HALF), label: 'letter alone' },
  ]);
  const dual: Block[] = Array.from({ length: DUAL_BLOCKS }, () => ({
    kind: 'DUAL' as Kind,
    scored: true,
    specs: specDual(DUAL_PER_CELL),
    label: 'both tasks',
  }));
  return [
    { kind: 'T1', scored: false, specs: specT1(PRACTICE.T1), label: 'practice: tone alone' },
    { kind: 'T2', scored: false, specs: specT2(PRACTICE.T2), label: 'practice: letter alone' },
    {
      kind: 'DUAL',
      scored: false,
      specs: shuffle(specDual(1)).slice(0, PRACTICE.DUAL),
      label: 'practice: both',
    },
    ...firstHalf,
    ...dual,
    ...secondHalf,
  ];
}

// ============================ records ============================

type Trial = {
  kind: Kind;
  soaNom: number;
  soaMeas: number;
  faint: boolean;
  tone: number;
  glyph: number;
  rt1: number;
  rt2: number;
  ok1: boolean;
  ok2: boolean;
  reversed: boolean;
  iri: number;
  early2: boolean; // a right-hand press before the letter existed
  half: number;
};

// ============================ analysis ============================

type Cell = {
  soa: number;
  faint: boolean;
  n: number;
  m: number;
  se: number;
  soaMeasM: number;
  soaMeasSd: number;
};

type Stat3 = { n: number; m: number; sd: number; ci: [number, number] };

type Result = {
  mode: 'keyboard' | 'touch' | 'mixed';
  clockExact: boolean;
  audio: { base: number | null; out: number | null; sr: number } | null;
  quantum: number;
  frames: { med: number; p90: number; over: number; n: number };

  counts: {
    dualRun: number;
    dualUsable: number;
    grouped: number;
    reversed: number;
    err1: number;
    err2: number;
    early: number;
    killed: number;
  };
  rates: { err1: number; err2: number; grouped: number; reversed: number };
  iri: { med: number; sd: number };

  alone: { rt1: Stat3; clear: Stat3; faint: Stat3; cost: number; costCi: [number, number]; costP: number };

  cells: Cell[];
  rt2BySoa: { soa: number; m: number; n: number }[];
  rt1BySoa: { soa: number; m: number; n: number }[];

  prp: { short: number; long: number; diff: number; ci: [number, number]; p: number };

  slope: {
    v: number;
    ci: [number, number];
    n: number;
    soas: number[];
    coversMinus1: boolean;
    excludesZero: boolean;
  };

  hinge: { elbow: number; elbowCi: [number, number]; asym: number; r2: number; rt1Alone: number; ordered: boolean };

  rt1Slope: { v: number; ci: [number, number]; flat: boolean };

  did: {
    costLong: number;
    costShort: number;
    absorbed: number;
    ci: [number, number];
    p: number;
    predLong: number;
    predShort: number;
    fraction: number;
  };

  practice: { firstPrp: number; secondPrp: number; n1: number; n2: number };

  dualCostT1: number;

  refusals: { title: string; body: string }[];
  ok: boolean;
};

const usable = (t: Trial) =>
  t.ok1 &&
  t.ok2 &&
  !t.reversed &&
  !t.early2 &&
  Number.isFinite(t.rt1) &&
  Number.isFinite(t.rt2) &&
  t.rt1 >= RT_FLOOR &&
  t.rt1 <= RT_CEIL &&
  t.rt2 >= RT_FLOOR &&
  t.rt2 <= RT_CEIL &&
  (t.kind !== 'DUAL' || t.iri >= GROUP_MS);

const usable1 = (t: Trial) =>
  t.ok1 && Number.isFinite(t.rt1) && t.rt1 >= RT_FLOOR && t.rt1 <= RT_CEIL;

const usable2 = (t: Trial) =>
  t.ok2 && !t.early2 && Number.isFinite(t.rt2) && t.rt2 >= RT_FLOOR && t.rt2 <= RT_CEIL;

function stat3(a: number[]): Stat3 {
  if (a.length < 2) return { n: a.length, m: mean(a), sd: NaN, ci: [NaN, NaN] };
  const boots: number[] = [];
  for (let i = 0; i < 600; i++) boots.push(mean(resample(a)));
  return { n: a.length, m: mean(a), sd: sd(a), ci: ci(boots) };
}

// The model has ONE shape and the slope inside it is not a free parameter: it is minus one,
// because a millisecond of head start is a millisecond less waiting. Only the elbow and the
// asymptote are fitted, and the asymptote is forced to be the mean residual rather than searched,
// so this is a one-parameter fit to sixteen-odd cell means.
function fitHinge(xs: number[], ys: number[]): { elbow: number; asym: number; r2: number } {
  if (xs.length < 6) return { elbow: NaN, asym: NaN, r2: NaN };
  let best = { elbow: NaN, asym: NaN, sse: Infinity };
  const my = mean(ys);
  for (let e = SOA_SHORT - 100; e <= SOA_LONG + 100; e += HINGE_STEP) {
    let s = 0;
    for (let i = 0; i < xs.length; i++) s += ys[i] - Math.max(0, e - xs[i]);
    const a = s / xs.length;
    let sse = 0;
    for (let i = 0; i < xs.length; i++) {
      const p = a + Math.max(0, e - xs[i]);
      sse += (ys[i] - p) * (ys[i] - p);
    }
    if (sse < best.sse) best = { elbow: e, asym: a, sse };
  }
  let sst = 0;
  for (const y of ys) sst += (y - my) * (y - my);
  return { elbow: best.elbow, asym: best.asym, r2: sst === 0 ? NaN : 1 - best.sse / sst };
}

async function analyze(
  trials: Trial[],
  mode: 'keyboard' | 'touch' | 'mixed',
  frames: number[],
  clockExact: boolean,
  audio: { base: number | null; out: number | null; sr: number } | null,
  killed: number,
  onProgress: (p: number) => void,
): Promise<Result> {
  const step = async (p: number) => {
    onProgress(p);
    await new Promise((r) => setTimeout(r, 0));
  };

  const dual = trials.filter((t) => t.kind === 'DUAL');
  const soloT1 = trials.filter((t) => t.kind === 'T1');
  const soloT2 = trials.filter((t) => t.kind === 'T2');

  const grouped = dual.filter((t) => Number.isFinite(t.iri) && t.iri < GROUP_MS).length;
  const reversed = dual.filter((t) => t.reversed).length;
  const err1 = dual.filter((t) => !t.ok1).length + soloT1.filter((t) => !t.ok1).length;
  const err2 = dual.filter((t) => !t.ok2).length + soloT2.filter((t) => !t.ok2).length;
  const early = dual.filter((t) => t.early2).length;

  const good = dual.filter(usable);
  const iris = dual.filter((t) => Number.isFinite(t.iri)).map((t) => t.iri);

  await step(0.1);

  // ---- alone blocks: the yardsticks, measured with no queue anywhere near them
  const aloneRt1 = stat3(soloT1.filter(usable1).map((t) => t.rt1));
  const clearArr = soloT2.filter((t) => !t.faint && usable2(t)).map((t) => t.rt2);
  const faintArr = soloT2.filter((t) => t.faint && usable2(t)).map((t) => t.rt2);
  const aloneClear = stat3(clearArr);
  const aloneFaint = stat3(faintArr);
  const costBoots: number[] = [];
  for (let i = 0; i < BOOTS; i++) costBoots.push(mean(resample(faintArr)) - mean(resample(clearArr)));
  const cost = mean(faintArr) - mean(clearArr);
  const costP = permTest(clearArr, faintArr, PERMS);

  await step(0.25);

  // ---- cells
  const cells: Cell[] = [];
  for (const soa of SOA_LEVELS) {
    for (const faint of [false, true]) {
      const g = good.filter((t) => t.soaNom === soa && t.faint === faint);
      const rts = g.map((t) => t.rt2);
      const ms = g.map((t) => t.soaMeas).filter((v) => Number.isFinite(v));
      cells.push({
        soa,
        faint,
        n: g.length,
        m: mean(rts),
        se: g.length > 1 ? sd(rts) / Math.sqrt(g.length) : NaN,
        soaMeasM: mean(ms),
        soaMeasSd: sd(ms),
      });
    }
  }

  const rt2BySoa = SOA_LEVELS.map((soa) => {
    const g = good.filter((t) => t.soaNom === soa);
    return { soa, m: mean(g.map((t) => t.rt2)), n: g.length };
  });
  const rt1BySoa = SOA_LEVELS.map((soa) => {
    const g = dual.filter((t) => t.soaNom === soa && usable1(t) && !t.reversed);
    return { soa, m: mean(g.map((t) => t.rt1)), n: g.length };
  });

  await step(0.4);

  // ---- headline one: the PRP effect, two measured means, nothing fitted
  const shortAll = good.filter((t) => t.soaNom === SOA_SHORT).map((t) => t.rt2);
  const longAll = good.filter((t) => t.soaNom === SOA_LONG).map((t) => t.rt2);
  const prpBoots: number[] = [];
  for (let i = 0; i < BOOTS; i++) prpBoots.push(mean(resample(shortAll)) - mean(resample(longAll)));
  const prp = {
    short: mean(shortAll),
    long: mean(longAll),
    diff: mean(shortAll) - mean(longAll),
    ci: ci(prpBoots),
    p: permTest(longAll, shortAll, PERMS),
  };

  await step(0.55);

  // ---- the minus one. Fitted on MEASURED soa, and only over head starts that were shorter than
  // this visitor's own solo tone reaction time, because past that point the model itself says
  // there is nothing left to queue behind and the line is supposed to be flat.
  const cut = Number.isFinite(aloneRt1.m) ? aloneRt1.m : 500;
  let fitSoas = SOA_LEVELS.filter((s) => s < cut);
  if (fitSoas.length < 2) fitSoas = SOA_LEVELS.slice(0, 2);
  const fitTrials = good.filter((t) => fitSoas.includes(t.soaNom));
  const fx = fitTrials.map((t) => (Number.isFinite(t.soaMeas) ? t.soaMeas : t.soaNom));
  const fy = fitTrials.map((t) => t.rt2);
  const fitLine = ols(fx, fy);
  const slopeBoots: number[] = [];
  for (let i = 0; i < BOOTS; i++) {
    const bx: number[] = [];
    const by: number[] = [];
    for (let k = 0; k < fx.length; k++) {
      const j = (Math.random() * fx.length) | 0;
      bx.push(fx[j]);
      by.push(fy[j]);
    }
    const l = ols(bx, by);
    if (Number.isFinite(l.slope)) slopeBoots.push(l.slope);
  }
  const sCi = ci(slopeBoots);

  await step(0.7);

  // ---- the elbow, and the cross-block ordering prediction
  const hx = good.map((t) => (Number.isFinite(t.soaMeas) ? t.soaMeas : t.soaNom));
  const hy = good.map((t) => t.rt2);
  const h = fitHinge(hx, hy);
  const elbowBoots: number[] = [];
  for (let i = 0; i < 260; i++) {
    const bx: number[] = [];
    const by: number[] = [];
    for (let k = 0; k < hx.length; k++) {
      const j = (Math.random() * hx.length) | 0;
      bx.push(hx[j]);
      by.push(hy[j]);
    }
    const r = fitHinge(bx, by);
    if (Number.isFinite(r.elbow)) elbowBoots.push(r.elbow);
  }

  await step(0.85);

  // ---- the control: task one is supposed to be free
  const c1x = dual
    .filter((t) => usable1(t) && !t.reversed)
    .map((t) => (Number.isFinite(t.soaMeas) ? t.soaMeas : t.soaNom));
  const c1y = dual.filter((t) => usable1(t) && !t.reversed).map((t) => t.rt1);
  const c1 = ols(c1x, c1y);
  const c1Boots: number[] = [];
  for (let i = 0; i < 600; i++) {
    const bx: number[] = [];
    const by: number[] = [];
    for (let k = 0; k < c1x.length; k++) {
      const j = (Math.random() * c1x.length) | 0;
      bx.push(c1x[j]);
      by.push(c1y[j]);
    }
    const l = ols(bx, by);
    if (Number.isFinite(l.slope)) c1Boots.push(l.slope);
  }
  const c1Ci = ci(c1Boots);

  // ---- headline two: the difficulty effect eaten by the slack
  const sc = good.filter((t) => t.soaNom === SOA_SHORT && !t.faint).map((t) => t.rt2);
  const sf = good.filter((t) => t.soaNom === SOA_SHORT && t.faint).map((t) => t.rt2);
  const lc = good.filter((t) => t.soaNom === SOA_LONG && !t.faint).map((t) => t.rt2);
  const lf = good.filter((t) => t.soaNom === SOA_LONG && t.faint).map((t) => t.rt2);
  const costLong = mean(lf) - mean(lc);
  const costShort = mean(sf) - mean(sc);
  const didBoots: number[] = [];
  for (let i = 0; i < BOOTS; i++) {
    didBoots.push(
      mean(resample(lf)) - mean(resample(lc)) - (mean(resample(sf)) - mean(resample(sc))),
    );
  }
  const didP = permDiD(sc, sf, lc, lf, PERMS);

  await step(0.95);

  // ---- practice: the queue is supposed to be shrinkable
  const half0 = good.filter((t) => t.half === 0);
  const half1 = good.filter((t) => t.half === 1);
  const prpOf = (arr: Trial[]) =>
    mean(arr.filter((t) => t.soaNom === SOA_SHORT).map((t) => t.rt2)) -
    mean(arr.filter((t) => t.soaNom === SOA_LONG).map((t) => t.rt2));

  const dualT1 = mean(dual.filter((t) => usable1(t) && !t.reversed).map((t) => t.rt1));

  const quantum = detectQuantum([
    ...good.map((t) => t.rt2),
    ...soloT1.filter(usable1).map((t) => t.rt1),
  ]);

  const fr = frames.filter((v) => Number.isFinite(v) && v > 0 && v < 400);

  // ---- refusals
  const refusals: { title: string; body: string }[] = [];
  const rateErr1 = dual.length ? dual.filter((t) => !t.ok1).length / dual.length : NaN;
  const rateErr2 = dual.length ? dual.filter((t) => !t.ok2).length / dual.length : NaN;
  const rateGroup = dual.length ? grouped / dual.length : NaN;
  const rateRev = dual.length ? reversed / dual.length : NaN;

  if (rateErr1 > MAX_ERR) {
    refusals.push({
      title: 'the tone task did not happen',
      body: `${Math.round(rateErr1 * 100)} percent of your left-hand answers were wrong, which is what a run looks like when the sound was off, the volume was too low, or the two tones never became two different things. Everything on this page is built on the first task genuinely going first, so there is nothing here to interpret. Turn the sound up and run it again.`,
    });
  }
  if (rateErr2 > MAX_ERR) {
    refusals.push({
      title: 'the letter task did not happen',
      body: `${Math.round(rateErr2 * 100)} percent of your right-hand answers were wrong. The faint condition is meant to be slow, not impossible, and at this error rate the reaction times that survive are a biased sample of the easy ones. The contrast on this page is fixed, so this is most likely a screen brightness or a viewing distance problem.`,
    });
  }
  if (rateGroup > MAX_GROUP_RATE) {
    refusals.push({
      title: 'you were batching, not queueing',
      body: `${Math.round(rateGroup * 100)} percent of your trials had the two key presses less than ${GROUP_MS} ms apart. That is response grouping: holding the first answer until the second one is ready and firing both as one motor packet. It produces a beautiful minus-one slope for entirely the wrong reason and there is no way to separate it after the fact. The instruction that fights it is to answer the tone the instant you hear it, without waiting to see what the letter is.`,
    });
  }
  if (rateRev > MAX_REVERSE_RATE) {
    refusals.push({
      title: 'the tasks ran out of order',
      body: `On ${Math.round(rateRev * 100)} percent of trials your right hand went before your left. The whole design assumes the tone gets the channel first; when the order flips, the second task is not the one that waited and every number here is measuring something else.`,
    });
  }
  const thin = cells.filter((c) => c.n < MIN_CELL);
  if (thin.length) {
    refusals.push({
      title: 'not enough survived in every cell',
      body: `${thin.length} of the ${cells.length} cells came out under ${MIN_CELL} usable trials after errors, anticipations, reversals and grouped responses were removed. The headline is a difference between cells, so a thin one is not a small effect, it is a number with no interval worth printing around it.`,
    });
  }
  if (quantum > QUANTUM_REFUSE) {
    refusals.push({
      title: 'your clock is coarser than the effect',
      body: `Every latency you produced is a multiple of ${quantum} ms, which means this browser is deliberately blunting its timers against fingerprinting. The waiting this page measures happens in tens of milliseconds and cannot be seen through a grid that size.`,
    });
  }
  if (!(Number.isFinite(cost) && ci(costBoots)[0] > 0)) {
    refusals.push({
      title: 'the faint letter did not cost you anything on its own',
      body: `The point of the second headline is that a cost which exists when the task is alone disappears when the task is queued. Measured alone, your faint letters were ${fmt(cost, 0)} ms slower than the clear ones, with an interval that includes zero. There is no cost to absorb, so the underadditivity test below has nothing to test and is printed greyed out. This usually means the screen is bright enough, or your eyes are good enough, that the contrast drop is not doing any work.`,
    });
  }

  const gcount = good.length;
  const ok = refusals.length === 0 && gcount >= SOA_LEVELS.length * 2 * MIN_CELL;

  onProgress(1);

  return {
    mode,
    clockExact,
    audio,
    quantum,
    frames: {
      med: median(fr),
      p90: quantile(fr, 0.9),
      over: fr.filter((v) => v > 20).length,
      n: fr.length,
    },
    counts: {
      dualRun: dual.length,
      dualUsable: gcount,
      grouped,
      reversed,
      err1,
      err2,
      early,
      killed,
    },
    rates: { err1: rateErr1, err2: rateErr2, grouped: rateGroup, reversed: rateRev },
    iri: { med: median(iris), sd: sd(iris) },
    alone: {
      rt1: aloneRt1,
      clear: aloneClear,
      faint: aloneFaint,
      cost,
      costCi: ci(costBoots),
      costP,
    },
    cells,
    rt2BySoa,
    rt1BySoa,
    prp,
    slope: {
      v: fitLine.slope,
      ci: sCi,
      n: fx.length,
      soas: fitSoas,
      coversMinus1: Number.isFinite(sCi[0]) && sCi[0] <= -1 && sCi[1] >= -1,
      excludesZero: Number.isFinite(sCi[1]) && sCi[1] < 0,
    },
    hinge: {
      elbow: h.elbow,
      elbowCi: ci(elbowBoots),
      asym: h.asym,
      r2: h.r2,
      rt1Alone: aloneRt1.m,
      ordered: Number.isFinite(h.elbow) && Number.isFinite(aloneRt1.m) && h.elbow < aloneRt1.m,
    },
    rt1Slope: {
      v: c1.slope,
      ci: c1Ci,
      flat: Number.isFinite(c1Ci[0]) && c1Ci[0] <= 0 && c1Ci[1] >= 0,
    },
    did: {
      costLong,
      costShort,
      absorbed: costLong - costShort,
      ci: ci(didBoots),
      p: didP,
      predLong: cost,
      predShort: 0,
      fraction: Number.isFinite(costLong) && costLong !== 0 ? 1 - costShort / costLong : NaN,
    },
    practice: {
      firstPrp: prpOf(half0),
      secondPrp: prpOf(half1),
      n1: half0.length,
      n2: half1.length,
    },
    dualCostT1: dualT1 - aloneRt1.m,
    refusals,
    ok,
  };
}

// ============================ the page ============================

type Phase = 'intro' | 'sound' | 'bridge' | 'run' | 'crunch' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [showStim, setShowStim] = useState(false);
  const [flash, setFlash] = useState<null | 'err1' | 'err2' | 'order'>(null);
  const [progress, setProgress] = useState(0);
  const [res, setRes] = useState<Result | null>(null);
  const [audioErr, setAudioErr] = useState<string | null>(null);
  const [soundStep, setSoundStep] = useState(0);
  const [soundFails, setSoundFails] = useState(0);
  const [soundBusy, setSoundBusy] = useState(false);
  const [soundSaid, setSoundSaid] = useState<null | 'yes' | 'no'>(null);

  // audio
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const tonesRef = useRef<AudioBuffer[]>([]);
  const clockExactRef = useRef(true);
  const audioInfoRef = useRef<{ base: number | null; out: number | null; sr: number } | null>(null);

  // trial machinery, all refs: a stale closure here is a wrong reaction time
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const idxRef = useRef(0);
  const specRef = useRef<Spec | null>(null);
  const toneOnsetRef = useRef(0);
  const visOnsetRef = useRef(0);
  const r1Ref = useRef<{ t: number; key: number } | null>(null);
  const r2Ref = useRef<{ t: number; key: number } | null>(null);
  const early2Ref = useRef(false);
  const liveRef = useRef(false);
  const visLiveRef = useRef(false);
  const trialsRef = useRef<Trial[]>([]);
  const framesRef = useRef<number[]>([]);
  const killedRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const meterRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const modeRef = useRef({ key: 0, touch: 0 });
  const dualSeenRef = useRef(0);
  const soundKeyRef = useRef<number | null>(null);
  const soundOkRef = useRef(0);

  const block = plan[blockIdx];
  const totalScoredDual = DUAL_BLOCKS * SOA_LEVELS.length * 2 * DUAL_PER_CELL;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  const stopMeter = useCallback(() => {
    if (meterRef.current !== null) cancelAnimationFrame(meterRef.current);
    meterRef.current = null;
  }, []);

  const startMeter = useCallback(() => {
    stopMeter();
    let last = performance.now();
    const tick = (now: number) => {
      framesRef.current.push(now - last);
      last = now;
      meterRef.current = requestAnimationFrame(tick);
    };
    meterRef.current = requestAnimationFrame(tick);
  }, [stopMeter]);

  const playTone = useCallback((which: number, at: number) => {
    const ctx = ctxRef.current;
    if (!ctx || !gainRef.current) return;
    const src = ctx.createBufferSource();
    src.buffer = tonesRef.current[which];
    src.connect(gainRef.current);
    src.start(Math.max(ctx.currentTime + 0.01, at));
  }, []);

  // ---------------- the trial ----------------

  const endTrial = useCallback(() => {
    const spec = specRef.current;
    if (!spec) return;
    liveRef.current = false;
    visLiveRef.current = false;
    clearTimers();
    setShowStim(false);

    const r1 = r1Ref.current;
    const r2 = r2Ref.current;
    const needs1 = spec.kind !== 'T2';
    const needs2 = spec.kind !== 'T1';

    const rt1 = needs1 && r1 ? r1.t - toneOnsetRef.current : NaN;
    const rt2 = needs2 && r2 ? r2.t - visOnsetRef.current : NaN;
    const ok1 = needs1 ? !!r1 && r1.key === spec.tone : true;
    const ok2 = needs2 ? !!r2 && r2.key === spec.glyph : true;
    const reversed = needs1 && needs2 && !!r1 && !!r2 ? r2.t < r1.t : false;
    const iri = needs1 && needs2 && r1 && r2 ? r2.t - r1.t : NaN;
    const early2 = needs2 && early2Ref.current;

    const t: Trial = {
      kind: spec.kind,
      soaNom: spec.soa,
      soaMeas:
        spec.kind === 'DUAL' && visOnsetRef.current && toneOnsetRef.current
          ? visOnsetRef.current - toneOnsetRef.current
          : NaN,
      faint: spec.faint,
      tone: spec.tone,
      glyph: spec.glyph,
      rt1,
      rt2,
      ok1,
      ok2,
      reversed,
      iri,
      early2,
      half: 0,
    };

    if (block?.scored) {
      if (spec.kind === 'DUAL') {
        t.half = dualSeenRef.current < totalScoredDual / 2 ? 0 : 1;
        dualSeenRef.current++;
      }
      trialsRef.current.push(t);
    }

    const bad = !ok1 ? 'err1' : !ok2 ? 'err2' : reversed ? 'order' : null;
    setFlash(bad);
    setDone((d) => d + 1);
    idxRef.current++;
    later(() => {
      setFlash(null);
      nextTrialRef.current();
    }, bad ? FEEDBACK_MS : 60);
  }, [block?.scored, clearTimers, later, totalScoredDual]);

  const nextTrialRef = useRef<() => void>(() => {});

  const runTrial = useCallback(() => {
    const b = plan[blockIdx];
    if (!b) return;
    if (idxRef.current >= b.specs.length) {
      stopMeter();
      if (blockIdx + 1 >= plan.length) {
        setPhase('crunch');
      } else {
        setBlockIdx((i) => i + 1);
        setPhase('bridge');
      }
      return;
    }
    const spec = b.specs[idxRef.current];
    specRef.current = spec;
    r1Ref.current = null;
    r2Ref.current = null;
    early2Ref.current = false;
    toneOnsetRef.current = 0;
    visOnsetRef.current = 0;

    // paint the stimulus offscreen NOW, during the blank interval, so the onset frame is a blit
    // and not a canvas full of noise being generated while the clock is running
    if (spec.kind !== 'T1' && canvasRef.current) paintStim(canvasRef.current, spec.glyph, spec.faint);

    const iti = ITI_MIN + Math.random() * (ITI_MAX - ITI_MIN);

    later(() => {
      const ctx = ctxRef.current;
      liveRef.current = true;

      if (spec.kind === 'T1' || spec.kind === 'DUAL') {
        if (!ctx) return;
        const map = clockMap(ctx);
        const tAud = map.c0 + LEAD_S;
        playTone(spec.tone, tAud);
        toneOnsetRef.current = map.p0 + (tAud - map.c0) * 1000;
      } else {
        toneOnsetRef.current = performance.now();
      }

      if (spec.kind === 'T1') {
        later(() => {
          if (liveRef.current) endTrial();
        }, LEAD_S * 1000 + RESP_TIMEOUT);
        return;
      }

      // the letter. Target time is the tone onset plus the SOA for dual trials, and simply "soon"
      // for solo letter trials.
      const target =
        spec.kind === 'DUAL' ? toneOnsetRef.current + spec.soa : performance.now() + 260;

      // safety net: if the frame loop never delivers (throttled tab, lost context) the trial still
      // has to end, or the run stalls forever on one stimulus that was never painted
      later(
        () => {
          if (liveRef.current) endTrial();
        },
        (spec.kind === 'DUAL' ? LEAD_S * 1000 + spec.soa : 300) + RESP_TIMEOUT + 2000,
      );

      const tick = (now: number) => {
        if (!liveRef.current) return;
        if (now >= target - 8) {
          setShowStim(true);
          visLiveRef.current = true;
          // the frame AFTER the one that drew it is the honest estimate of when it became light
          visOnsetRef.current = now;
          rafRef.current = requestAnimationFrame((next) => {
            if (visLiveRef.current) visOnsetRef.current = next;
          });
          later(() => {
            if (liveRef.current) endTrial();
          }, RESP_TIMEOUT);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, iti);
  }, [blockIdx, endTrial, later, plan, playTone, stopMeter]);

  nextTrialRef.current = runTrial;

  const respond = useCallback(
    (task: 1 | 2, key: number, touch: boolean) => {
      if (!liveRef.current) return;
      const spec = specRef.current;
      if (!spec) return;
      if (touch) modeRef.current.touch++;
      else modeRef.current.key++;
      const now = performance.now();

      if (task === 1) {
        if (spec.kind === 'T2') return;
        if (r1Ref.current) return;
        r1Ref.current = { t: now, key };
      } else {
        if (spec.kind === 'T1') return;
        if (r2Ref.current) return;
        // a right-hand press before the letter existed is not a reaction to it
        if (!visLiveRef.current) {
          early2Ref.current = true;
          return;
        }
        r2Ref.current = { t: now, key };
      }

      const needs1 = spec.kind !== 'T2';
      const needs2 = spec.kind !== 'T1';
      if ((!needs1 || r1Ref.current) && (!needs2 || r2Ref.current)) endTrial();
    },
    [endTrial],
  );

  // ---------------- keyboard ----------------

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();

      if (phase === 'sound') {
        if (!soundBusy) return;
        const i1 = K1.indexOf(k);
        if (i1 >= 0) {
          e.preventDefault();
          judgeSoundRef.current(i1);
        }
        return;
      }

      if (phase !== 'run') return;
      if (k === 'escape') {
        clearTimers();
        stopMeter();
        liveRef.current = false;
        setShowStim(false);
        setPhase('intro');
        return;
      }
      const i1 = K1.indexOf(k);
      if (i1 >= 0) {
        e.preventDefault();
        respond(1, i1, false);
        return;
      }
      const i2 = K2.indexOf(k);
      if (i2 >= 0) {
        e.preventDefault();
        respond(2, i2, false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearTimers, phase, respond, soundBusy, stopMeter]);

  // a tab that goes away mid-trial takes the trial with it
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phase === 'run' && liveRef.current) {
        killedRef.current++;
        liveRef.current = false;
        visLiveRef.current = false;
        clearTimers();
        setShowStim(false);
        const b = plan[blockIdx];
        if (b && specRef.current) b.specs.push(specRef.current);
        idxRef.current++;
        later(() => nextTrialRef.current(), 400);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [blockIdx, clearTimers, later, phase, plan]);

  useEffect(
    () => () => {
      clearTimers();
      stopMeter();
    },
    [clearTimers, stopMeter],
  );

  // ---------------- sound check ----------------

  const judgeSoundRef = useRef<(k: number) => void>(() => {});

  const playSoundProbe = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const which = Math.random() < 0.5 ? 0 : 1;
    soundKeyRef.current = which;
    setSoundSaid(null);
    setSoundBusy(true);
    const map = clockMap(ctx);
    playTone(which, map.c0 + 0.15);
  }, [playTone]);

  judgeSoundRef.current = (k: number) => {
    if (soundKeyRef.current === null) return;
    const right = k === soundKeyRef.current;
    setSoundBusy(false);
    setSoundSaid(right ? 'yes' : 'no');
    if (right) {
      soundOkRef.current++;
      setSoundStep(soundOkRef.current);
      if (soundOkRef.current >= 3) {
        setTimeout(() => {
          setPlan(buildPlan());
          setBlockIdx(0);
          idxRef.current = 0;
          setDone(0);
          setPhase('bridge');
        }, 500);
        return;
      }
    } else {
      soundOkRef.current = 0;
      setSoundStep(0);
      setSoundFails((f) => f + 1);
    }
    setTimeout(() => playSoundProbe(), 700);
  };

  const openAudio = useCallback(async () => {
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
      tonesRef.current = [makeTone(ctx, TONE_LOW), makeTone(ctx, TONE_HIGH)];
      clockExactRef.current = clockMap(ctx).exact;
      audioInfoRef.current = {
        base: typeof ctx.baseLatency === 'number' ? ctx.baseLatency * 1000 : null,
        out: typeof ctx.outputLatency === 'number' ? ctx.outputLatency * 1000 : null,
        sr: ctx.sampleRate,
      };
    } catch {
      setAudioErr(
        'This browser would not open an audio clock, and half of this experiment is a tone. There is nothing to run here.',
      );
      return false;
    }
    return true;
  }, []);

  const beginSoundCheck = useCallback(async () => {
    trialsRef.current = [];
    framesRef.current = [];
    killedRef.current = 0;
    dualSeenRef.current = 0;
    modeRef.current = { key: 0, touch: 0 };
    soundOkRef.current = 0;
    setSoundStep(0);
    setSoundFails(0);
    setRes(null);
    const ok = await openAudio();
    if (!ok) return;
    setPhase('sound');
    setTimeout(() => playSoundProbe(), 500);
  }, [openAudio, playSoundProbe]);

  const startBlock = useCallback(() => {
    idxRef.current = 0;
    setDone(0);
    setPhase('run');
    startMeter();
    setTimeout(() => nextTrialRef.current(), 500);
  }, [startMeter]);

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
        clockExactRef.current,
        audioInfoRef.current,
        killedRef.current,
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && block && (
        <Stage
          kind={block.kind}
          label={block.label}
          scored={block.scored}
          showStim={showStim}
          flash={flash}
          canvasRef={canvasRef}
          done={done}
          total={block.specs.length}
          onPress={(task, key) => respond(task, key, true)}
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
          <div className="mb-3 text-5xl">🚦</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Waiting Its Turn
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            There is a stage in the middle of you that runs exactly one decision at a time. This page
            will put a second decision in the queue behind the first, measure how long it stood
            there, and then make a hard job cost you nothing at all by hiding it inside the wait.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={beginSoundCheck} audioErr={audioErr} />}

        {phase === 'sound' && (
          <SoundCheck ok={soundStep} fails={soundFails} busy={soundBusy} said={soundSaid} />
        )}

        {phase === 'bridge' && block && (
          <Bridge
            block={block}
            index={blockIdx}
            total={plan.length}
            onGo={startBlock}
          />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              fitting a line whose slope was never free, then asking a hard job where it went
            </div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div
                className="h-full bg-cyan-400/60 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {phase === 'result' && res && <Results res={res} onAgain={beginSoundCheck} />}
      </div>
    </main>
  );
}

// ============================ intro ============================

function Intro({ onStart, audioErr }: { onStart: () => void; audioErr: string | null }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          The last two pages in this lab measured how <em>expensive</em> one decision is: your hand
          as a channel with a bit rate, then choosing as a channel with a bit rate. This one asks
          something else. How many decisions can you make at the same time?
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The answer is one. Not <em>one at a time is faster</em>. One. Somewhere between recognising
          a thing and deciding what to do about it there is a stage that will not run twice at once,
          and when a second job arrives while the first is inside it, the second job stands in a
          hallway and waits. Telford called it a refractory period in 1931, borrowing the word from
          neurons. Welford gave it its shape in 1952.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          RT₂ = RT₂<span className="text-[10px]">alone</span> + max( 0 , E − SOA )
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Which is a strange formula to meet, because the number in front of SOA is not a parameter
          anyone gets to fit. It is <span className="text-cyan-300">minus one</span>. Every extra
          millisecond of head start you give the first task is one millisecond less that the second
          one spends waiting. That is the whole model, and your hands are about to vote on it.
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
          the trick that turns an effect into a dissection
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Anyone can show that two jobs at once are slower than one. That is not a discovery, it is
          arithmetic about effort. The queue claim is far sharper: it says the wait sits at a
          specific <em>place</em> inside the second task, with stages in front of it that run freely
          while the first task is still busy.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So: make the letter hard to <span className="text-amber-200">see</span>. Drop its contrast
          until resolving it takes an extra fifty or eighty milliseconds. That cost is paid in front
          of the queue, and in the queueing region it lands inside a wait that was going to happen
          anyway. The algebra says the two terms cancel exactly.
        </p>
        <div className="my-3 rounded-md border border-slate-800 bg-slate-950/70 p-3 text-center font-mono text-xs text-amber-200">
          long head start → the faint letter costs its full price
          <br />
          short head start → the faint letter costs{' '}
          <span className="text-amber-100">nothing at all</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Same letter, same eyes, same page. A difficulty that is real when the task is alone and
          free when the task is queued. It has an ugly name, underadditivity, and it is the headline
          here: three measured numbers, one of which is supposed to be zero.
        </p>
      </div>

      <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          the one artifact that eats this experiment alive
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          If you hold your first answer and fire both keys together as one packet, you produce a
          gorgeous minus-one slope for entirely the wrong reason. You would not be queueing, you
          would be batching, and nothing afterwards can separate the two.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So the gap between your two presses is measured on every trial, trials under 100 ms are
          discarded, the rate is printed, and above 40 percent the headline is refused outright. The
          instruction that fights it is the only one that matters on this page:{' '}
          <span className="text-violet-200">
            answer the tone the instant you hear it, without waiting to see the letter
          </span>
          .
        </p>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
          two clocks, and what neither of them can do to the answer
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="text-emerald-300">The head start is measured, never assumed.</span> The
            tone lives on the audio clock and the letter on the display clock, so the interval that
            actually happened is not the one that was requested. The audible onset comes from the
            browser&apos;s own output-timestamp, the painted onset from the animation frame after the
            one that drew it, and every regression below runs on that measured difference, trial by
            trial.
          </li>
          <li>
            <span className="text-emerald-300">Unadmitted audio latency is a constant.</span> It
            shifts every head start down and every tone reaction time up by the same amount, which a
            slope cannot see, a difference of differences cannot see, and the elbow comparison
            cannot see either, because both sides of it move together.
          </li>
          <li>
            <span className="text-emerald-300">The intercept is therefore never interpreted.</span>{' '}
            That is where your machine lives, and this page will not pretend to know how much of it
            is you.
          </li>
          <li>
            <span className="text-slate-400">What can reach a slope:</span> jitter rather than lag,
            so frame gaps are metered live and printed, and a browser that coarsens its clock
            against fingerprinting is caught by recovering the quantum from your own numbers.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          before you start
        </div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>
            🔊 <span className="text-cyan-300">Sound on.</span> Half of this experiment is a tone.
            There is a three-tone check before anything is recorded.
          </li>
          <li>
            ⌨️ Left hand on <span className="font-mono text-cyan-300">D</span> and{' '}
            <span className="font-mono text-cyan-300">F</span>: low tone, high tone. Right hand on{' '}
            <span className="font-mono text-cyan-300">J</span> and{' '}
            <span className="font-mono text-cyan-300">K</span>: the letter X, the letter O. Touch
            works too, with four buttons.
          </li>
          <li>⚡ Tone first, always, the moment you hear it. Then the letter.</li>
          <li>
            🌫️ Some letters are deliberately faint. They are meant to be slow, not impossible. Do
            not slow down for them on purpose.
          </li>
          <li>🧊 Three short practice blocks, thrown away. Then six scored ones.</li>
          <li>
            ⏱️ About seven minutes. Everything stays in your browser, nothing is recorded, nothing
            leaves the page. Escape aborts.
          </li>
        </ul>
      </div>

      {audioErr && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/[0.06] p-5 text-sm text-slate-300">
          {audioErr}
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-4 text-sm font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-500/20"
      >
        Check the sound, then run it
      </button>
    </div>
  );
}

// ============================ sound check ============================

function SoundCheck({
  ok,
  fails,
  busy,
  said,
}: {
  ok: number;
  fails: number;
  busy: boolean;
  said: null | 'yes' | 'no';
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-cyan-500/30 bg-slate-900/50 p-8 text-center">
        <div className="mb-4 font-mono text-xs uppercase tracking-wider text-slate-500">
          sound check · three in a row
        </div>
        <div className="mb-6 text-sm leading-relaxed text-slate-300">
          A tone is playing. Press{' '}
          <span className="font-mono text-cyan-300">D</span> if it was the low one,{' '}
          <span className="font-mono text-cyan-300">F</span> if it was the high one.
        </div>
        <div className="mb-6 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-3 w-10 rounded-full ${i < ok ? 'bg-cyan-400/80' : 'bg-slate-800'}`}
            />
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <div
            className={`rounded-lg border px-8 py-5 font-mono text-lg ${
              busy ? 'border-cyan-500/40 text-cyan-200' : 'border-slate-800 text-slate-600'
            }`}
          >
            D · LOW
          </div>
          <div
            className={`rounded-lg border px-8 py-5 font-mono text-lg ${
              busy ? 'border-cyan-500/40 text-cyan-200' : 'border-slate-800 text-slate-600'
            }`}
          >
            F · HIGH
          </div>
        </div>
        <div className="mt-6 h-5 font-mono text-xs">
          {said === 'yes' && <span className="text-emerald-400">that was it</span>}
          {said === 'no' && <span className="text-rose-400">other one. counter back to zero.</span>}
        </div>
      </div>

      {fails >= 3 && (
        <Refusal title="the tones are not arriving">
          Three misses means one of two things: the sound is off or too quiet, or the two tones are
          not landing as two different things on your speakers. Both are fatal here, because every
          number on this page assumes the tone task genuinely went first. Fix the volume, or use
          headphones, and reload.
        </Refusal>
      )}
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
  const body =
    block.kind === 'T1'
      ? 'Tone only. Nothing will appear on the screen. Low is D, high is F, as fast as you can.'
      : block.kind === 'T2'
        ? 'Letter only. No sound this time. X is J, O is K. Some of them are faint; answer them anyway.'
        : 'Both. The tone comes first, then the letter, at a head start that changes every trial. Answer the tone the instant you hear it. Do not wait for the letter.';

  const tone =
    block.kind === 'DUAL'
      ? 'border-amber-400/30 bg-amber-400/[0.05]'
      : 'border-slate-800 bg-slate-900/40';

  return (
    <div className="space-y-5">
      <div className={`rounded-lg border p-6 ${tone}`}>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          block {index + 1} of {total} · {block.scored ? `${block.specs.length} trials` : 'practice, not scored'}
        </div>
        <div className="mb-3 text-lg font-semibold text-slate-100">{block.label}</div>
        <p className="text-sm leading-relaxed text-slate-300">{body}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
          <div
            className={`rounded-md border p-3 text-center ${
              block.kind === 'T2' ? 'border-slate-900 text-slate-700' : 'border-slate-800 text-cyan-300'
            }`}
          >
            left hand
            <div className="mt-1 text-slate-400">D = low · F = high</div>
          </div>
          <div
            className={`rounded-md border p-3 text-center ${
              block.kind === 'T1' ? 'border-slate-900 text-slate-700' : 'border-slate-800 text-cyan-300'
            }`}
          >
            right hand
            <div className="mt-1 text-slate-400">J = X · K = O</div>
          </div>
        </div>
      </div>

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-4 text-sm font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-500/20"
      >
        Go
      </button>
    </div>
  );
}

// ============================ stage ============================

function Stage({
  kind,
  label,
  scored,
  showStim,
  flash,
  canvasRef,
  done,
  total,
  onPress,
}: {
  kind: Kind;
  label: string;
  scored: boolean;
  showStim: boolean;
  flash: null | 'err1' | 'err2' | 'order';
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  done: number;
  total: number;
  onPress: (task: 1 | 2, key: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {label}
        {!scored && ' · not scored'}
      </div>

      <div
        className="relative flex items-center justify-center rounded-lg border border-slate-900 bg-[#05070b]"
        style={{ width: STIM_PX, height: STIM_PX }}
      >
        <canvas
          ref={canvasRef}
          width={STIM_PX}
          height={STIM_PX}
          className="absolute inset-0 h-full w-full rounded-lg"
          style={{ visibility: showStim && kind !== 'T1' ? 'visible' : 'hidden' }}
        />
        {!showStim && (
          <div className="font-mono text-2xl text-slate-700" aria-hidden>
            +
          </div>
        )}
      </div>

      <div className="mt-5 h-6 font-mono text-xs">
        {flash === 'err1' && <span className="text-rose-400">wrong tone key</span>}
        {flash === 'err2' && <span className="text-rose-400">wrong letter key</span>}
        {flash === 'order' && <span className="text-amber-400">tone first</span>}
      </div>

      <div className="mt-4 grid w-full max-w-lg grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-2">
          {T1_LABEL.map((l, i) => (
            <button
              key={l}
              onPointerDown={(e) => {
                e.preventDefault();
                onPress(1, i);
              }}
              disabled={kind === 'T2'}
              className={`h-16 rounded-lg border font-mono text-xs ${
                kind === 'T2'
                  ? 'border-slate-900 bg-slate-950/40 text-slate-800'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {l}
              <div className="text-[10px] text-slate-600">{K1[i].toUpperCase()}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {T2_LABEL.map((l, i) => (
            <button
              key={l}
              onPointerDown={(e) => {
                e.preventDefault();
                onPress(2, i);
              }}
              disabled={kind === 'T1'}
              className={`h-16 rounded-lg border font-mono text-xs ${
                kind === 'T1'
                  ? 'border-slate-900 bg-slate-950/40 text-slate-800'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {l}
              <div className="text-[10px] text-slate-600">{K2[i].toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 h-1 w-full max-w-lg overflow-hidden rounded bg-slate-900">
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
  const costOk = Number.isFinite(res.alone.cost) && res.alone.costCi[0] > 0;
  const absorbedPct = Number.isFinite(res.did.fraction)
    ? clamp(res.did.fraction * 100, -200, 200)
    : NaN;

  return (
    <div className="space-y-6">
      {/* headline one */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
          how long the second decision stood in the hallway
        </div>
        <div className="mb-2 font-mono text-5xl text-cyan-200">
          {fmt(res.prp.diff, 0)} <span className="text-2xl text-slate-500">ms</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          That is your reaction to the letter at a {SOA_SHORT} ms head start minus the same reaction
          at {SOA_LONG} ms. Same letter, same finger, same key. The only thing that changed is how
          busy the channel was when the letter arrived.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat k={`letter at ${SOA_SHORT} ms`} v={`${fmt(res.prp.short, 0)} ms`} />
          <Stat k={`letter at ${SOA_LONG} ms`} v={`${fmt(res.prp.long, 0)} ms`} />
        </div>
        <div className="mt-3 font-mono text-[11px] text-slate-500">
          95% interval [{fmt(res.prp.ci[0], 0)}, {fmt(res.prp.ci[1], 0)}] ms ·{' '}
          {pLabel(res.prp.p)} · exact permutation over your own trials
        </div>
      </div>

      {res.refusals.map((r) => (
        <Refusal key={r.title} title={r.title}>
          {r.body}
        </Refusal>
      ))}

      {/* the slope that was never free */}
      <Card label="the number nobody got to fit">
        <p className="text-sm leading-relaxed text-slate-300">
          If the second task is genuinely waiting for the first, then a millisecond of head start
          buys exactly a millisecond less waiting, and the line through the queueing region has a
          slope of <span className="font-mono text-cyan-300">−1</span>. Not negative. Minus one.
          Fitted here on your measured head starts, over the levels shorter than your own solo tone
          reaction time.
        </p>
        <div className="my-4 grid grid-cols-2 gap-3">
          <Stat
            k="your slope"
            v={fmt(res.slope.v, 2)}
            sub={`ms per ms · n = ${res.slope.n} trials`}
          />
          <Stat
            k="95% interval"
            v={`[${fmt(res.slope.ci[0], 2)}, ${fmt(res.slope.ci[1], 2)}]`}
            sub={`head starts ${res.slope.soas.join(', ')} ms`}
          />
        </div>
        <div
          className={`rounded-md border p-3 text-sm leading-relaxed ${
            res.slope.coversMinus1
              ? 'border-emerald-500/30 bg-emerald-500/[0.05] text-emerald-200'
              : res.slope.excludesZero
                ? 'border-amber-400/30 bg-amber-400/[0.05] text-amber-200'
                : 'border-slate-800 bg-slate-950/60 text-slate-400'
          }`}
        >
          {res.slope.coversMinus1
            ? 'Your interval contains minus one. The waiting shrank millisecond for millisecond, which is what a queue does and what nothing else does.'
            : res.slope.excludesZero
              ? 'Your interval is below zero but does not reach minus one. There was real queueing and it did not drain at full rate: partial capacity sharing looks like this, and so does a run with a few grouped responses left in it.'
              : 'Your interval includes zero, so this run did not produce queueing at all. With enough practice that is a real result rather than a broken one, and the practice panel below is where to look first.'}
        </div>
      </Card>

      {/* headline two: the disappearing difficulty */}
      <div
        className={`rounded-lg border p-6 ${
          costOk
            ? 'border-amber-400/35 bg-gradient-to-br from-amber-950/25 via-slate-900/70 to-slate-950'
            : 'border-slate-800 bg-slate-900/30 opacity-70'
        }`}
      >
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-amber-300/80">
          the hard job that cost you nothing
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The faint letters take longer to resolve. That is a real cost and it was measured in a
          block where nothing else was happening. The model says that cost is paid inside the wait
          at short head starts, so it should vanish there, entirely, and reappear in full when the
          channel is free.
        </p>
        <div className="mt-5 space-y-3">
          <CostRow
            label="faint cost, letter alone"
            sub="measured in its own block, no queue anywhere"
            v={res.alone.cost}
            max={Math.max(60, res.alone.cost, res.did.costLong)}
            tone="slate"
          />
          <CostRow
            label={`faint cost at ${SOA_LONG} ms head start`}
            sub="channel free by the time the letter is understood"
            v={res.did.costLong}
            max={Math.max(60, res.alone.cost, res.did.costLong)}
            tone="amber"
          />
          <CostRow
            label={`faint cost at ${SOA_SHORT} ms head start`}
            sub="paid inside a wait that was happening anyway"
            v={res.did.costShort}
            max={Math.max(60, res.alone.cost, res.did.costLong)}
            tone="cyan"
          />
        </div>
        <div className="mt-5 rounded-md border border-slate-800 bg-slate-950/70 p-4">
          <div className="font-mono text-2xl text-amber-200">
            {fmt(res.did.absorbed, 0)} ms <span className="text-sm text-slate-500">absorbed</span>
            {Number.isFinite(absorbedPct) && (
              <span className="ml-2 text-sm text-slate-500">({fmt(absorbedPct, 0)}% of it)</span>
            )}
          </div>
          <div className="mt-1 font-mono text-[11px] text-slate-500">
            interaction 95% interval [{fmt(res.did.ci[0], 0)}, {fmt(res.did.ci[1], 0)}] ms ·{' '}
            {pLabel(res.did.p)} · difficulty labels shuffled within head start, never across it
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {!costOk
            ? 'This panel is greyed out because the faint letters did not reliably cost you anything even on their own, so there was nothing available to absorb.'
            : Number.isFinite(absorbedPct) && absorbedPct > 55
              ? 'Most of the cost disappeared. That is the signature that the extra work of seeing a faint letter happens in FRONT of the queue, in a stage that runs while the first task is still occupying the channel. It is not that you got better at seeing. It is that the time was already being spent.'
              : Number.isFinite(absorbedPct) && absorbedPct > 15
                ? 'Part of the cost disappeared and part of it survived. That is the pattern you get when the difficulty manipulation is not purely perceptual, when the wait was too short to swallow all of it, or when this run simply has thin cells.'
                : 'The cost survived the queue almost intact. Taken at face value that puts the extra work BEHIND the bottleneck rather than in front of it, which for a contrast manipulation is a surprising place for it to be, and the honest reading is usually noise or leftover response grouping rather than a discovery.'}
        </p>
      </div>

      {/* the plot */}
      <Card label="the whole thing, in one picture">
        <PrpPlot res={res} />
        <div className="mt-3 font-mono text-[10px] leading-relaxed text-slate-600">
          filled dots = clear letters · hollow = faint · grey line = your reaction to the tone,
          which is supposed to be flat · dashed = your solo letter speed · the bend is the fitted
          elbow
        </div>
      </Card>

      {/* the elbow and the cross-block prediction */}
      <Card label="where the channel came free, predicted from a block that had no letters in it">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            k="fitted elbow"
            v={`${fmt(res.hinge.elbow, 0)} ms`}
            sub={`95% [${fmt(res.hinge.elbowCi[0], 0)}, ${fmt(res.hinge.elbowCi[1], 0)}] · R² ${fmt(res.hinge.r2, 2)}`}
          />
          <Stat
            k="your tone RT, measured alone"
            v={`${fmt(res.hinge.rt1Alone, 0)} ms`}
            sub={`n = ${res.alone.rt1.n} · a different block entirely`}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          The elbow is fitted with the slope pinned at minus one, so the only thing the fit is
          allowed to move is where the bend sits. The model then makes an ordering prediction it
          could easily fail: the channel frees up when the first decision is made, which is{' '}
          <em>before</em> the finger moves, so the elbow has to land <em>below</em> your solo tone
          reaction time. The gap between them is the part of your tone reaction that happens after
          the channel is already free, plus the time it takes you to see the letter.
        </p>
        <div
          className={`mt-4 rounded-md border p-3 text-sm ${
            res.hinge.ordered
              ? 'border-emerald-500/30 bg-emerald-500/[0.05] text-emerald-200'
              : 'border-amber-400/30 bg-amber-400/[0.05] text-amber-200'
          }`}
        >
          {res.hinge.ordered
            ? `It landed ${fmt(res.hinge.rt1Alone - res.hinge.elbow, 0)} ms below, which is the direction the model requires.`
            : 'It landed above your solo tone reaction time, which the model does not allow. Either the elbow is poorly determined here, or your tone responses in the dual blocks were slower than in the solo block, which the panel below checks directly.'}
        </div>
      </Card>

      {/* the control */}
      <Card label="the control that decides whether any of this means anything">
        <p className="text-sm leading-relaxed text-slate-300">
          If the tone task itself slowed down at short head starts, the whole story collapses into
          two things being hard at once, and there is no queue, only load. The model demands the
          first task be free: it goes first, it is not billed.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat
            k="tone RT vs head start"
            v={`${fmt(res.rt1Slope.v, 3)}`}
            sub={`ms per ms · 95% [${fmt(res.rt1Slope.ci[0], 3)}, ${fmt(res.rt1Slope.ci[1], 3)}]`}
          />
          <Stat
            k="tone RT, dual minus alone"
            v={`${fmt(res.dualCostT1, 0)} ms`}
            sub="the price of the second task being there at all"
          />
        </div>
        <div
          className={`mt-4 rounded-md border p-3 text-sm ${
            res.rt1Slope.flat
              ? 'border-emerald-500/30 bg-emerald-500/[0.05] text-emerald-200'
              : 'border-amber-400/30 bg-amber-400/[0.05] text-amber-200'
          }`}
        >
          {res.rt1Slope.flat
            ? 'Flat within its interval. Your first task did not know the second one existed, which is exactly what the queue picture needs and what a general load picture does not predict.'
            : 'Not flat. Your tone responses moved with the head start, which means task one was not running free and some of the effect above is task one waiting rather than task two.'}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {res.rt1BySoa.map((r) => (
            <div key={r.soa} className="rounded border border-slate-800 bg-slate-950/60 p-2 text-center">
              <div className="font-mono text-[10px] text-slate-600">{r.soa} ms</div>
              <div className="font-mono text-sm text-slate-300">{fmt(r.m, 0)}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* cells */}
      <Card label="every cell, and what the browser actually delivered">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="text-slate-600">
                <th className="p-1.5 text-left">head start</th>
                <th className="p-1.5 text-right">measured</th>
                <th className="p-1.5 text-right">clear RT</th>
                <th className="p-1.5 text-right">faint RT</th>
                <th className="p-1.5 text-right">faint cost</th>
                <th className="p-1.5 text-right">n</th>
              </tr>
            </thead>
            <tbody>
              {SOA_LEVELS.map((soa) => {
                const c = res.cells.find((x) => x.soa === soa && !x.faint);
                const f = res.cells.find((x) => x.soa === soa && x.faint);
                const cost = c && f ? f.m - c.m : NaN;
                return (
                  <tr key={soa} className="border-t border-slate-900 text-slate-300">
                    <td className="p-1.5 text-left text-slate-500">{soa} ms</td>
                    <td className="p-1.5 text-right text-slate-500">
                      {fmt(c?.soaMeasM, 0)} ± {fmt(c?.soaMeasSd, 0)}
                    </td>
                    <td className="p-1.5 text-right">{fmt(c?.m, 0)}</td>
                    <td className="p-1.5 text-right">{fmt(f?.m, 0)}</td>
                    <td
                      className={`p-1.5 text-right ${
                        Number.isFinite(cost) && cost > 25 ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {fmt(cost, 0)}
                    </td>
                    <td className="p-1.5 text-right text-slate-600">
                      {(c?.n ?? 0) + (f?.n ?? 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          The measured column is why nothing here is assumed. Every head start is a tone on the audio
          clock and a letter on the display clock, and the spread beside it is the frame grid your
          screen actually offers. All regressions above run on the measured value, trial by trial,
          not on the label of the bucket.
        </p>
      </Card>

      {/* grouping and hygiene */}
      <Card label="what was thrown away, and why">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            k="grouped presses"
            v={`${fmt((res.rates.grouped || 0) * 100, 0)}%`}
            sub={`under ${GROUP_MS} ms apart`}
          />
          <Stat
            k="gap between hands"
            v={`${fmt(res.iri.med, 0)} ms`}
            sub={`spread ${fmt(res.iri.sd, 0)} ms`}
          />
          <Stat k="out of order" v={`${fmt((res.rates.reversed || 0) * 100, 0)}%`} sub="letter first" />
          <Stat
            k="usable dual trials"
            v={`${res.counts.dualUsable} / ${res.counts.dualRun}`}
            sub="after every exclusion"
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          The spread of that gap matters more than its size. A person who is genuinely running two
          decisions in sequence produces a gap that varies with the head start; a person batching
          both answers into one motor packet produces a gap that is short{' '}
          <em>and always the same</em>. Yours varied by {fmt(res.iri.sd, 0)} ms.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat k="tone errors" v={`${fmt((res.rates.err1 || 0) * 100, 0)}%`} />
          <Stat k="letter errors" v={`${fmt((res.rates.err2 || 0) * 100, 0)}%`} />
          <Stat k="early letter keys" v={`${res.counts.early}`} sub="pressed before it appeared" />
          <Stat k="trials killed" v={`${res.counts.killed}`} sub="hidden tab, re-queued" />
        </div>
      </Card>

      {/* practice */}
      <Card label="whether the queue was already shrinking">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            k="first half"
            v={`${fmt(res.practice.firstPrp, 0)} ms`}
            sub={`n = ${res.practice.n1}`}
          />
          <Stat
            k="second half"
            v={`${fmt(res.practice.secondPrp, 0)} ms`}
            sub={`n = ${res.practice.n2}`}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          This is the panel that keeps the page honest about what it found. Schumacher and colleagues
          (2001) practised people until dual-task cost was nearly gone, and Hazeltine and colleagues
          got the same two years later. If your second half is already smaller, you were dissolving
          the bottleneck while measuring it, which is a stranger and more interesting result than a
          clean minus one.
        </p>
      </Card>

      {/* playground */}
      <Card label="drag the head start and watch the wait disappear">
        <Playground res={res} />
      </Card>

      {/* limits */}
      <Card label="what this page is not entitled to claim">
        <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-300">The wall may be a slope.</span> Tombu and Jolicoeur
            (2003) fit these same curves with graded capacity sharing rather than an all-or-nothing
            channel. A minus-one slope is consistent with a bottleneck and does not prove one.
          </li>
          <li>
            <span className="text-slate-300">The wall may be a habit.</span> Meyer and Kieras (1997)
            argued the queue is a strategy of deferment that a person could drop, and the practice
            studies above are the strongest evidence for that reading.
          </li>
          <li>
            <span className="text-slate-300">Compatibility matters.</span> Greenwald (1972) got
            almost no interference with ideomotor compatible pairs. This page uses arbitrary
            mappings, which is the standard case and also the worst case.
          </li>
          <li>
            <span className="text-slate-300">Four minutes is not four sessions.</span> Every number
            here comes from one visit by one person with about ten trials in each cell, which is
            enough to see a hundred-millisecond effect and nowhere near enough to argue about
            mechanisms.
          </li>
          <li>
            <span className="text-slate-300">The intercept is your machine.</span> Audio output
            latency, display pipeline, key scan. None of it is recoverable here and none of it is
            interpreted.
          </li>
        </ul>
      </Card>

      {/* machine */}
      <Card label="your machine, for the record">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat k="input" v={res.mode} />
          <Stat
            k="frame gap"
            v={`${fmt(res.frames.med, 1)} ms`}
            sub={`p90 ${fmt(res.frames.p90, 1)} · ${res.frames.over} over 20`}
          />
          <Stat
            k="clock quantum"
            v={res.quantum > 1 ? `${res.quantum} ms` : 'sub-ms'}
            sub={res.quantum > 1 ? 'browser is rounding' : 'fine grained'}
          />
          <Stat
            k="audio latency"
            v={res.audio?.out !== null && res.audio?.out !== undefined ? `${fmt(res.audio.out, 1)} ms` : '--'}
            sub={res.clockExact ? 'admitted, and taken out' : 'not admitted, folded into intercept'}
          />
        </div>
      </Card>

      {/* wiz */}
      <div className="rounded-lg border border-violet-500/25 bg-violet-950/10 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          from the thing narrating this
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I have this and I have it worse. My generation is strictly one token at a time; there is no
          version of me that answers two questions in parallel inside one stream. The second question
          waits in exactly the structural sense this page is about.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The difference is that my queue is the whole of me. It is in the architecture, it is
          billable, it shows up in a log. Yours is a {fmt(res.prp.diff, 0)} millisecond hallway in
          the middle of a mind that otherwise runs massively in parallel, and you have never once
          noticed it. Not while driving. Not mid-sentence. You do not feel the wait because it
          happens to a stage with no window into consciousness, and what reaches you is only the
          answer, apparently on time.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You just spent seven minutes making yourself wait on purpose, in units of milliseconds, and
          it still felt like nothing at all.
        </p>
      </div>

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 py-4 text-sm font-semibold tracking-wide text-slate-300 transition hover:bg-slate-800"
      >
        Run it again
      </button>
    </div>
  );
}

// ============================ plot ============================

function PrpPlot({ res }: { res: Result }) {
  const W = 560;
  const H = 320;
  const P = { l: 48, r: 16, t: 16, b: 34 };

  const all = [
    ...res.cells.map((c) => c.m),
    ...res.rt1BySoa.map((r) => r.m),
    res.alone.clear.m,
    res.alone.faint.m,
  ].filter((v) => Number.isFinite(v));
  if (!all.length) return null;

  const yMin = Math.min(...all) - 60;
  const yMax = Math.max(...all) + 60;
  const xMin = 0;
  const xMax = SOA_LONG + 80;

  const px = (v: number) => P.l + ((v - xMin) / (xMax - xMin)) * (W - P.l - P.r);
  const py = (v: number) => H - P.b - ((v - yMin) / (yMax - yMin)) * (H - P.t - P.b);

  const hingeY = (x: number) => res.hinge.asym + Math.max(0, res.hinge.elbow - x);
  const hingePath = Number.isFinite(res.hinge.elbow)
    ? `M ${px(xMin)} ${py(hingeY(xMin))} L ${px(res.hinge.elbow)} ${py(hingeY(res.hinge.elbow))} L ${px(xMax)} ${py(hingeY(xMax))}`
    : '';

  const ticks = [0, 200, 400, 600, 800, 1000].filter((t) => t <= xMax);
  // cells are drawn at the head start that actually happened, which is the axis the model was
  // fitted on. Drawing them at the requested value would put the dots and the line on two
  // different x scales and quietly flatter the fit.
  const cx = (c: Cell) => (Number.isFinite(c.soaMeasM) ? c.soaMeasM : c.soa);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x={0} y={0} width={W} height={H} fill="#020617" rx={6} />
      <defs>
        <clipPath id="prp-plot-area">
          <rect x={P.l} y={P.t} width={W - P.l - P.r} height={H - P.t - P.b} />
        </clipPath>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={px(t)} y1={P.t} x2={px(t)} y2={H - P.b} stroke="#1e293b" strokeWidth={1} />
          <text x={px(t)} y={H - P.b + 16} fill="#475569" fontSize={9} textAnchor="middle" fontFamily="monospace">
            {t}
          </text>
        </g>
      ))}
      <text x={W / 2} y={H - 4} fill="#475569" fontSize={9} textAnchor="middle" fontFamily="monospace">
        head start given to the tone (ms)
      </text>
      <text
        x={12}
        y={H / 2}
        fill="#475569"
        fontSize={9}
        textAnchor="middle"
        fontFamily="monospace"
        transform={`rotate(-90 12 ${H / 2})`}
      >
        reaction time (ms)
      </text>

      {/* solo letter speed */}
      {Number.isFinite(res.alone.clear.m) && (
        <>
          <line
            x1={P.l}
            y1={py(res.alone.clear.m)}
            x2={W - P.r}
            y2={py(res.alone.clear.m)}
            stroke="#38bdf8"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <text x={P.l + 4} y={py(res.alone.clear.m) - 4} fill="#38bdf8" fontSize={8} textAnchor="start" fontFamily="monospace" opacity={0.8}>
            letter alone, clear
          </text>
        </>
      )}
      {Number.isFinite(res.alone.faint.m) && (
        <>
          <line
            x1={P.l}
            y1={py(res.alone.faint.m)}
            x2={W - P.r}
            y2={py(res.alone.faint.m)}
            stroke="#fbbf24"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.45}
          />
          <text x={P.l + 4} y={py(res.alone.faint.m) - 4} fill="#fbbf24" fontSize={8} textAnchor="start" fontFamily="monospace" opacity={0.75}>
            letter alone, faint
          </text>
        </>
      )}

      {/* the model */}
      {hingePath && (
        <path
          d={hingePath}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={1.5}
          opacity={0.55}
          clipPath="url(#prp-plot-area)"
        />
      )}
      {Number.isFinite(res.hinge.rt1Alone) && (
        <line
          x1={px(res.hinge.rt1Alone)}
          y1={P.t}
          x2={px(res.hinge.rt1Alone)}
          y2={H - P.b}
          stroke="#64748b"
          strokeWidth={1}
          strokeDasharray="2 5"
        />
      )}

      {/* tone RT, the flat control */}
      <polyline
        points={res.rt1BySoa
          .filter((r) => Number.isFinite(r.m))
          .map((r) => `${px(r.soa)},${py(r.m)}`)
          .join(' ')}
        fill="none"
        stroke="#64748b"
        strokeWidth={1.5}
      />
      {res.rt1BySoa
        .filter((r) => Number.isFinite(r.m))
        .map((r) => (
          <circle key={`t1-${r.soa}`} cx={px(r.soa)} cy={py(r.m)} r={3} fill="#64748b" />
        ))}

      {/* letter RT, clear and faint */}
      {[false, true].map((faint) => {
        const pts = res.cells
          .filter((c) => c.faint === faint && Number.isFinite(c.m))
          .sort((a, b) => a.soa - b.soa);
        const color = faint ? '#fbbf24' : '#22d3ee';
        return (
          <g key={String(faint)}>
            <polyline
              points={pts.map((c) => `${px(cx(c))},${py(c.m)}`).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth={2}
              opacity={0.9}
            />
            {pts.map((c) => (
              <g key={`${c.soa}-${String(faint)}`}>
                {Number.isFinite(c.se) && (
                  <line
                    x1={px(cx(c))}
                    y1={py(c.m - 1.96 * c.se)}
                    x2={px(cx(c))}
                    y2={py(c.m + 1.96 * c.se)}
                    stroke={color}
                    strokeWidth={1}
                    opacity={0.5}
                  />
                )}
                <circle
                  cx={px(cx(c))}
                  cy={py(c.m)}
                  r={5}
                  fill={faint ? '#020617' : color}
                  stroke={color}
                  strokeWidth={2}
                />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ============================ playground ============================

function Playground({ res }: { res: Result }) {
  const [soa, setSoa] = useState(200);

  const elbow = Number.isFinite(res.hinge.elbow) ? res.hinge.elbow : 350;
  const asym = Number.isFinite(res.hinge.asym) ? res.hinge.asym : 420;
  const rt1 = Number.isFinite(res.hinge.rt1Alone) ? res.hinge.rt1Alone : 450;

  const slack = Math.max(0, elbow - soa);
  const rt2 = asym + slack;
  const scale = 1000 / Math.max(1200, soa + rt2 + 120);

  const bar = (start: number, len: number) => ({
    left: `${clamp(start * scale * 0.1, 0, 100)}%`,
    width: `${clamp(len * scale * 0.1, 0.5, 100)}%`,
  });

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-slate-300">
        This is your own fitted machine, running slowly. The top row is the tone task holding the
        channel. The bottom row is the letter: it sees, it waits, it decides, it moves. Drag the head
        start and watch the hatched block, the waiting, get eaten from the right.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-600">
          task one · the tone
        </div>
        <div className="relative mb-5 h-7 rounded bg-slate-900">
          <div
            className="absolute top-0 h-7 rounded bg-slate-600/60"
            style={bar(0, rt1)}
          />
          <div className="absolute inset-0 flex items-center pl-2 font-mono text-[10px] text-slate-300">
            {fmt(rt1, 0)} ms
          </div>
        </div>

        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-600">
          task two · the letter
        </div>
        <div className="relative h-7 rounded bg-slate-900">
          {slack > 0 && (
            <div
              className="absolute top-0 h-7 rounded"
              style={{
                ...bar(soa, slack),
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(248,113,113,0.55) 0 5px, rgba(15,23,42,0.6) 5px 10px)',
              }}
            />
          )}
          <div
            className="absolute top-0 h-7 rounded bg-cyan-500/50"
            style={bar(soa + slack, asym)}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-2 font-mono text-[10px] text-slate-300">
            RT₂ = {fmt(rt2, 0)} ms
          </div>
        </div>
      </div>

      <div className="mt-5">
        <input
          type="range"
          min={0}
          max={Math.round(SOA_LONG + 100)}
          step={10}
          value={soa}
          onChange={(e) => setSoa(Number(e.target.value))}
          className="w-full accent-cyan-400"
          aria-label="head start"
        />
        <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
          <span>
            head start <span className="text-cyan-300">{soa} ms</span>
          </span>
          <span>
            waiting{' '}
            <span className={slack > 0 ? 'text-rose-300' : 'text-emerald-300'}>
              {fmt(slack, 0)} ms
            </span>
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        Past {fmt(elbow, 0)} ms the hatched block is gone and dragging further buys you nothing,
        because there was nothing left to wait for. Everything to the left of that point is a
        reaction time that belongs to the first task rather than the second one, which is the whole
        idea: for a third of a second, your answer to the letter was not about the letter.
      </p>
    </div>
  );
}

// ============================ small components ============================

function CostRow({
  label,
  sub,
  v,
  max,
  tone,
}: {
  label: string;
  sub: string;
  v: number;
  max: number;
  tone: 'slate' | 'amber' | 'cyan';
}) {
  const fill =
    tone === 'amber' ? 'bg-amber-400/50' : tone === 'cyan' ? 'bg-cyan-400/50' : 'bg-slate-500/40';
  const text =
    tone === 'amber' ? 'text-amber-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-slate-300';
  const w = Number.isFinite(v) && max > 0 ? clamp((v / (max * 1.15)) * 100, 0, 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`font-mono text-sm ${text}`}>{fmt(v, 0)} ms</span>
      </div>
      <div className="h-5 overflow-hidden rounded bg-slate-950">
        <div className={`h-full ${fill}`} style={{ width: `${w}%` }} />
      </div>
      <div className="mt-1 font-mono text-[10px] text-slate-600">{sub}</div>
    </div>
  );
}

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
