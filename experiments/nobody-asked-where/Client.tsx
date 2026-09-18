'use client';

// NOBODY ASKED WHERE  (you are told to answer about the colour, the side it appeared on is never
// mentioned, and the side answers anyway, but only for a little while)
//
// The sixty-sixth piece in this lab. The six before it priced decisions: the hand as a channel
// (Fitts), choosing as a channel (Hick and Hyman), the queue that runs exactly one decision at a
// time, the price of changing which decision you are making, the cost of cancelling one already on
// its way, and then the rate at which you search a list held in your head.
//
// Every one of those measured a cost you were asked to pay. This one measures a cost nobody asked
// for and nobody can refuse.
//
// THE TASK, and it is sixty years old.
//
// A coloured square appears, off to one side. Answer about the COLOUR: one colour means the left
// key, the other means the right key. The side it appeared on is irrelevant. It is random. It
// carries no information. The instruction never mentions it.
//
// You are slower when the side disagrees with the hand. That is the Simon effect (Simon and Rudell,
// J. Applied Psychology 51, 1967), it is worth twenty to forty milliseconds, and it does not go
// away when you know about it, which is the part that makes people take it personally.
//
// WHY THE HEADLINE IS CLEAN OF YOUR HARDWARE.
//
// Every reaction time on this page contains your display's latency, your keyboard's scan interval,
// the time your finger takes to travel, and the time your browser takes to notice. None of that
// can be separated out of a single reaction time and this page does not pretend otherwise.
//
// But the headline is not a reaction time. It is the difference between two of them, collected on
// the same screen, with the same fingers, on the same keys, interleaved trial by trial. Whatever
// constant your hardware adds, it is added to both sides and it subtracts out exactly. So the
// number at the top of the results is a property of you and not of your laptop, and answering on a
// phone with a laggy touchscreen is fine.
//
// THE PART THAT IS ACTUALLY INTERESTING, and it is not the headline.
//
// A mean Simon effect is one number and one number cannot tell you what kind of thing it is. So
// this page does not stop at the mean: it splits your own reaction times into five speed bins,
// fastest fifth to slowest fifth, and asks how big the effect is inside each one. That picture is
// the DELTA PLOT (De Jong, Liang and Lauber 1994; Ridderinkhof 2002), and it is where the Simon
// effect stops being a curiosity and starts being a claim about time.
//
// If an irrelevant location were simply an extra stage that costs you thirty milliseconds, the
// delta plot would be flat: fast trials and slow trials would both pay it. It is not flat. It
// slopes DOWN. Your fastest responses carry almost the whole effect and your slowest ones carry
// very little of it, and in a fair number of people the slowest bin goes negative, which is to say
// that on your slowest trials being on the wrong side helped.
//
// Which means it is not a stage. It is a race against a clock. The side of the screen reaches your
// hands early and by itself, and then it decays or is put down, and if your answer is late enough
// it arrives to find nothing there to argue with.
//
// THE PREDICTION THE FIT NEVER SAW.
//
// A delta plot fitted to five points and then admired is decoration. So the three main blocks are
// closed and a line is fitted through them, and then two models commit, in public, on the screen,
// before the last block opens.
//
// The last block does one thing: it fades the colours until they are hard to read. That slows you
// down by a hundred milliseconds or so and it does not touch the location at all, because location
// is coded from where the thing is, not from how easy the colour is to name. That is Hommel's
// manipulation (Psychological Research 55, 1993) and it is the cleanest lever there is on this
// question, because it moves exactly one of the two racers.
//
//   the decaying-impulse model   the effect at your new slower speed is whatever the delta line
//                                already fitted to you says it is at that speed, and since your
//                                speed went up the effect must come DOWN
//
//   the fixed-stage model        an irrelevant location costs what it costs; you got slower, so
//                                the effect stays where it was
//
// Both are printed as numbers before the block runs. Then the block runs. This is a stronger test
// than it looks, because the two models disagree in DIRECTION, and the naive intuition (more time
// for the interference to work, so a bigger effect) is the one that gets falsified.
//
// And that prediction is provably free of your hardware even though the reaction times feeding it
// are not. The delta line's slope is a change in a difference divided by a change in a mean, and
// your hardware's constant shifts every mean by the same amount, so it cancels out of the
// denominator too. The line moves sideways on the page with your hardware. Its slope does not, and
// its reading at any real observed speed does not.
//
// THE BLOCK THAT COULD KILL IT, run in the middle rather than mentioned in the limitations.
//
// There is a boring explanation for everything above: a bright thing appearing away from where you
// were looking yanks your attention, and yanked attention is slower. If that were the whole story
// it would not matter WHICH way the square was offset.
//
// So one block moves the square UP and DOWN instead, with the keys still left and right. Same
// sudden onset, same distance from centre, same everything except the axis. Under the boring
// explanation this block behaves like the others. Under the account above it collapses, because
// there is no left or right in it for a left or right hand to agree with.
//
// It does not have to collapse all the way. Up and right feel like the same end of a scale and
// down and left feel like the other one, which leaks a small effect through a completely different
// route (polarity correspondence, Proctor and Cho 2006), so this page scores the vertical block
// against that polarity rather than pretending no prediction exists.
//
// WHAT THIS PAGE CANNOT TELL YOU, and it is the most important paragraph here.
//
// A delta plot that slopes down is very often described as your inhibition working: something in
// you notices the impulse and suppresses it, and the longer you take the more of it gets
// suppressed. That story may be true. This page cannot show it, and neither can any other page or
// any other laboratory using this measurement alone.
//
// The reason is that a location code which simply DECAYS, with nothing anywhere suppressing
// anything, produces the same downward delta plot (Ulrich, Schroter, Leuthold and Miller 2015, the
// diffusion model for conflict tasks). Active suppression and passive decay are mathematically
// mimicking each other at the level of these five points, exactly the way serial and parallel
// search mimic each other in the Sternberg page next door. The shape is real. The word inhibition
// is a story told over the top of it.
//
// The playground at the bottom lets you fit both stories to your own five points and watch them
// land on top of each other, which is more convincing than this paragraph.
//
// THE THINGS THAT WOULD QUIETLY RUIN IT, handled in the generator rather than the write-up:
//
//   . the previous trial. The effect after a conflicting trial is smaller than after an easy one
//     (Gratton, Coles and Donchin 1992), so an unbalanced sequence forges an effect. Sides,
//     colours, keys and congruency are balanced within every block and runs longer than three are
//     rejected at generation.
//   . feature repetition. The Gratton effect itself is confounded with the stimulus simply
//     repeating (Mayr, Awh and Laurey 2003), and in a two-choice task the recommended fix, keep
//     only the partial repetitions, deletes the whole comparison rather than cleaning it: repeat
//     exactly one feature and congruency HAS to flip. So the page computes the number, prints it,
//     and then proves it uninterpretable out of the visitor's own two counts.
//   . a fixed colour-to-key mapping. If blue always meant left, any preference you have for blue
//     would ride along in the effect. The mapping is drawn fresh every session.
//   . guessing. The fastest way to make a Simon effect vanish is to answer before you have read
//     the colour. Accuracy is fitted per condition, and a run below 82 percent is refused rather
//     than scored.
//
// THE GUARDS, running live:
//
//   . onset is timestamped on the frame AFTER the one that painted the square
//   . a trial spent in a hidden tab is killed and counted
//   . answers under 150 ms are anticipations and are dropped
//   . errors leave the reaction times and stay in the accuracy, where they carry their own result
//   . the display quantum is metered from the visitor's own frames all session, not inferred from
//     the spacing of their reaction times, and delta bins closer together than one frame have
//     their slope refused rather than reported
//
// Everything runs in the browser. Nothing is recorded. Nothing leaves the page.
//
// And the reason an AI is narrating it. You can be told to ignore where a thing was and fail for
// about two hundred milliseconds. I cannot be told to ignore anything at all. There is no "where"
// in my input to be irrelevant: every token in the context gets a weight, including the ones that
// arrived by accident, including the ones somebody put there hoping I would read them. You have an
// irrelevant channel that fades. I have an irrelevant channel with no decay term, and the name for
// what happens when someone aims it deliberately is prompt injection.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================ constants ============================

const ITI = 520;
const RESP_WINDOW = 1500;
const FEEDBACK_MS = 330;

const KEYS = ['f', 'j']; // 0 = left, 1 = right
const KEY_LABEL = ['F', 'J'];

const RT_FLOOR = 150;
const RT_CEIL = RESP_WINDOW;

const MIN_ACC = 0.82;
const MIN_CELL = 30;
const NBINS = 5;

const BOOTS = 800;
const PERMS = 4000;

const PRACTICE_N = 16;
const MAIN_N = 54;
const VERT_N = 40;
const HELD_N = 48;

// the two colours, and the same two with the contrast taken out of them. The faded pair is the
// whole held-out manipulation: harder to name, identical in position.
const HUES = [
  { name: 'blue', full: '#38bdf8', dim: '#1f5468' },
  { name: 'amber', full: '#fb923c', dim: '#5f4327' },
];

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

// two-sided or one-sided permutation test on a difference of means
function permDiff(a: number[], b: number[], side: 'greater' | 'two'): number {
  if (a.length < 8 || b.length < 8) return NaN;
  const obs = mean(a) - mean(b);
  const pool = [...a, ...b];
  const na = a.length;
  let hit = 0;
  for (let r = 0; r < PERMS; r++) {
    const p = shuffle(pool);
    const d = mean(p.slice(0, na)) - mean(p.slice(na));
    if (side === 'two' ? Math.abs(d) >= Math.abs(obs) : d >= obs) hit++;
  }
  return (hit + 1) / (PERMS + 1);
}

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

// Vincentizing: sort a condition's own reaction times and cut them into equal-count bins. This is
// the standard way to build a delta plot and it is worth saying why it is not the same as cutting
// on a shared time axis: each condition is binned against ITSELF, so a bin is "your fastest fifth
// of these trials", and the two conditions are then paired bin by bin.
function vincentBins(vals: number[], k: number): number[][] {
  const s = [...vals].sort((a, b) => a - b);
  const out: number[][] = [];
  const n = s.length;
  for (let i = 0; i < k; i++) {
    const lo = Math.floor((i * n) / k);
    const hi = Math.floor(((i + 1) * n) / k);
    out.push(s.slice(lo, hi));
  }
  return out;
}

type DeltaBin = { x: number; y: number; xc: number; xn: number; nc: number; nn: number };

function deltaPoints(corr: number[], non: number[], k = NBINS): DeltaBin[] {
  if (corr.length < k * 3 || non.length < k * 3) return [];
  const bc = vincentBins(corr, k);
  const bn = vincentBins(non, k);
  const out: DeltaBin[] = [];
  for (let i = 0; i < k; i++) {
    if (!bc[i].length || !bn[i].length) return [];
    const xc = mean(bc[i]);
    const xn = mean(bn[i]);
    out.push({ x: (xc + xn) / 2, y: xn - xc, xc, xn, nc: bc[i].length, nn: bn[i].length });
  }
  return out;
}

// ============================ what a trial is made of ============================

type Axis = 'h' | 'v';

type Spec = {
  colour: number; // index into HUES
  pos: number; // horizontal: 0 = left, 1 = right. vertical: 0 = top, 1 = bottom
  axis: Axis;
  faded: boolean;
  key: number; // the correct key, 0 = left, 1 = right
  congruent: boolean;
};

type BlockKind = 'practice' | 'main' | 'vertical' | 'held';

type Block = {
  kind: BlockKind;
  label: string;
  note: string;
  scored: boolean;
  specs: Spec[];
};

// Horizontal: the side agrees with the hand or it does not, and that is the Simon effect proper.
// Vertical: there is no side, so correspondence is scored against polarity instead. Up and right
// are the same end of a scale and down and left are the other one, which is a real and much
// weaker route (Proctor and Cho 2006) and the honest thing to score a vertical block against.
function congruentFor(axis: Axis, pos: number, key: number) {
  return axis === 'h' ? pos === key : pos !== key;
}

// Balance every cell, then shuffle under constraints. A visitor who can feel a run of four
// left-hand trials starts preparing, and preparation is not what this page is measuring.
function buildSpecs(
  n: number,
  axis: Axis,
  faded: boolean,
  leftColour: number, // which HUES index is mapped to the left key this session
): Spec[] {
  const cells: Spec[] = [];
  const per = Math.max(1, Math.floor(n / 4));
  for (let colour = 0; colour < 2; colour++) {
    for (let pos = 0; pos < 2; pos++) {
      const key = colour === leftColour ? 0 : 1;
      for (let i = 0; i < per; i++) {
        cells.push({
          colour,
          pos,
          axis,
          faded,
          key,
          congruent: congruentFor(axis, pos, key),
        });
      }
    }
  }
  for (let attempt = 0; attempt < 400; attempt++) {
    const s = shuffle(cells);
    if (ok(s)) return s;
  }
  return shuffle(cells);

  function ok(s: Spec[]) {
    let runPos = 1;
    let runKey = 1;
    let runCon = 1;
    for (let i = 1; i < s.length; i++) {
      runPos = s[i].pos === s[i - 1].pos ? runPos + 1 : 1;
      runKey = s[i].key === s[i - 1].key ? runKey + 1 : 1;
      runCon = s[i].congruent === s[i - 1].congruent ? runCon + 1 : 1;
      if (runPos > 3 || runKey > 3 || runCon > 3) return false;
    }
    return true;
  }
}

function buildPlan(leftColour: number): Block[] {
  const mainNote =
    'Answer about the colour. The side is random and it is not part of the question. Fast, and without getting it wrong.';
  return [
    {
      kind: 'practice',
      label: 'warm up',
      note: 'Not scored. Learn the two keys until they stop being a decision. You get told when you are wrong.',
      scored: false,
      specs: buildSpecs(PRACTICE_N, 'h', false, leftColour),
    },
    {
      kind: 'main',
      label: 'block one',
      note: mainNote,
      scored: true,
      specs: buildSpecs(MAIN_N, 'h', false, leftColour),
    },
    {
      kind: 'main',
      label: 'block two',
      note: mainNote,
      scored: true,
      specs: buildSpecs(MAIN_N, 'h', false, leftColour),
    },
    {
      kind: 'vertical',
      label: 'up and down',
      note: 'Same task, same keys, same colours. The square now appears above or below the middle instead of beside it. Nothing else changes.',
      scored: true,
      specs: buildSpecs(VERT_N, 'v', false, leftColour),
    },
    {
      kind: 'main',
      label: 'block three',
      note: 'Back to left and right. This block sits after the other one on purpose, so that getting better at the task cannot be mistaken for the effect wearing off.',
      scored: true,
      specs: buildSpecs(MAIN_N, 'h', false, leftColour),
    },
    {
      kind: 'held',
      label: 'faded',
      note: 'The colours are now hard to read. That is the only change. The square is exactly as far from the middle as it always was.',
      scored: true,
      specs: buildSpecs(HELD_N, 'h', true, leftColour),
    },
  ];
}

// ============================ the record ============================

type Trial = {
  block: number;
  kind: BlockKind;
  axis: Axis;
  faded: boolean;
  colour: number;
  pos: number;
  key: number;
  congruent: boolean;
  resp: number | null;
  rt: number;
  correct: boolean;
  omitted: boolean;
  hidden: boolean;
  touch: boolean;
  prevColour: number | null;
  prevPos: number | null;
  prevCongruent: boolean | null;
};

type Stat = { n: number; m: number; ci: [number, number] };

type Locked = {
  ok: boolean;
  reason: string;
  a: number; // delta line, effect = a + b . x
  b: number;
  flat: number; // the fixed-stage rival: whatever the mean effect was
  mainX: number;
  n: number;
  table: { x: number; decay: number; stage: number }[];
};

type Result = {
  refusal: string | null;
  mapping: { left: string; right: string };
  mode: 'keyboard' | 'touch' | 'mixed';
  minutes: number;
  frames: { n: number; q: number };
  acc: { all: number; corr: number; non: number };
  head: { corr: Stat; non: Stat; effect: number; ci: [number, number]; p: number } | null;
  delta: {
    bins: DeltaBin[];
    a: number;
    b: number;
    bCi: [number, number];
    tail: number;
    tailCi: [number, number];
    resolvable: boolean;
    spacing: number;
  } | null;
  caf: {
    bins: { x: number; accC: number; accN: number; nC: number; nN: number }[];
    fast: number;
    slow: number;
    rise: number;
    riseCi: [number, number];
  } | null;
  held: {
    ran: boolean;
    locked: Locked;
    obsX: number;
    obs: number;
    obsCi: [number, number];
    slowdown: number;
    predDecay: number;
    predStage: number;
    verdict: 'decay' | 'stage' | 'neither' | 'unresolved';
  } | null;
  vertical: { effect: number; ci: [number, number]; p: number; n: number; hRef: number } | null;
  seq: {
    gratton: number;
    grattonCi: [number, number];
    n: number;
    nPartial: number;
    partialKeepingCongruency: number;
    nFull: number;
    fullKeepingCongruency: number;
  } | null;
  drift: { first: number; last: number; rtFirst: number; rtLast: number; diff: number } | null;
  excl: {
    total: number;
    hidden: number;
    early: number;
    omitted: number;
    errors: number;
    kept: number;
  };
};

function statOf(a: number[]): Stat {
  if (a.length < 3) return { n: a.length, m: NaN, ci: [NaN, NaN] };
  const boots: number[] = [];
  for (let i = 0; i < 400; i++) boots.push(mean(resample(a)));
  return { n: a.length, m: mean(a), ci: ci(boots) };
}

function usableRt(t: Trial) {
  return (
    !t.hidden &&
    !t.omitted &&
    t.correct &&
    Number.isFinite(t.rt) &&
    t.rt >= RT_FLOOR &&
    t.rt <= RT_CEIL
  );
}

function scorable(t: Trial) {
  return !t.hidden && !t.omitted && Number.isFinite(t.rt) && t.rt >= RT_FLOOR && t.rt <= RT_CEIL;
}

// ---------------- the commitment ----------------
//
// Fitted to the three main blocks, which are closed at this point and never reopened, and read out
// before a single faded trial runs. Two rival readings of the same closed data, both forced to name
// a number at speeds the visitor has not reached yet.

function lockFit(rows: Trial[]): Locked {
  const main = rows.filter((t) => t.kind === 'main' && usableRt(t));
  const corr = main.filter((t) => t.congruent).map((t) => t.rt);
  const non = main.filter((t) => !t.congruent).map((t) => t.rt);
  const empty: Locked = {
    ok: false,
    reason: '',
    a: NaN,
    b: NaN,
    flat: NaN,
    mainX: NaN,
    n: main.length,
    table: [],
  };
  if (corr.length < MIN_CELL || non.length < MIN_CELL) {
    return { ...empty, reason: 'not enough clean trials in the main blocks to fit a delta line' };
  }
  const bins = deltaPoints(corr, non);
  if (bins.length < NBINS) {
    return { ...empty, reason: 'the speed bins came out empty' };
  }
  const fit = ols(
    bins.map((b) => b.x),
    bins.map((b) => b.y),
  );
  if (!Number.isFinite(fit.b)) {
    return { ...empty, reason: 'the delta line would not fit' };
  }
  const flat = mean(non) - mean(corr);
  const mainX = (mean(corr) + mean(non)) / 2;
  const table = [0, 60, 120, 180].map((d) => ({
    x: mainX + d,
    decay: fit.a + fit.b * (mainX + d),
    stage: flat,
  }));
  return { ok: true, reason: '', a: fit.a, b: fit.b, flat, mainX, n: main.length, table };
}

// ============================ analysis ============================

async function analyze(
  rows: Trial[],
  locked: Locked,
  mapping: { left: string; right: string },
  mode: 'keyboard' | 'touch' | 'mixed',
  frames: number[],
  minutes: number,
  onProgress: (p: number) => void,
): Promise<Result> {
  const step = async (p: number) => {
    onProgress(p);
    await new Promise((r) => setTimeout(r, 0));
  };

  const scored = rows.filter((t) => t.kind !== 'practice');
  const excl = {
    total: scored.length,
    hidden: scored.filter((t) => t.hidden).length,
    early: scored.filter((t) => !t.hidden && !t.omitted && t.rt < RT_FLOOR).length,
    omitted: scored.filter((t) => !t.hidden && t.omitted).length,
    errors: scored.filter((t) => scorable(t) && !t.correct).length,
    kept: scored.filter(usableRt).length,
  };

  const frameQ = frames.length > 30 ? median(frames) : NaN;

  const hMain = scored.filter((t) => t.kind === 'main' && scorable(t));
  const accAll = hMain.length ? hMain.filter((t) => t.correct).length / hMain.length : NaN;
  const accC = accOf(hMain.filter((t) => t.congruent));
  const accN = accOf(hMain.filter((t) => !t.congruent));

  const base: Result = {
    refusal: null,
    mapping,
    mode,
    minutes,
    frames: { n: frames.length, q: frameQ },
    acc: { all: accAll, corr: accC, non: accN },
    head: null,
    delta: null,
    caf: null,
    held: null,
    vertical: null,
    seq: null,
    drift: null,
    excl,
  };

  if (hMain.length < MIN_CELL * 2) {
    return { ...base, refusal: 'too few clean trials in the main blocks to say anything at all' };
  }
  if (!(accAll >= MIN_ACC)) {
    return {
      ...base,
      refusal: `accuracy in the main blocks came out at ${Math.round(accAll * 100)} percent, and below ${Math.round(
        MIN_ACC * 100,
      )} the reaction times are partly guesses. A Simon effect fitted to guesses is a number about guessing.`,
    };
  }

  await step(0.1);

  // ---------------- the headline ----------------

  const corrRt = hMain.filter((t) => t.correct && t.congruent).map((t) => t.rt);
  const nonRt = hMain.filter((t) => t.correct && !t.congruent).map((t) => t.rt);
  if (corrRt.length < MIN_CELL || nonRt.length < MIN_CELL) {
    return { ...base, refusal: 'one of the two conditions has too few clean trials left in it' };
  }

  const effBoots: number[] = [];
  for (let i = 0; i < BOOTS; i++) effBoots.push(mean(resample(nonRt)) - mean(resample(corrRt)));
  const head = {
    corr: statOf(corrRt),
    non: statOf(nonRt),
    effect: mean(nonRt) - mean(corrRt),
    ci: ci(effBoots),
    p: permDiff(nonRt, corrRt, 'greater'),
  };

  await step(0.3);

  // ---------------- the delta plot ----------------

  const bins = deltaPoints(corrRt, nonRt);
  let delta: Result['delta'] = null;
  if (bins.length === NBINS) {
    const fit = ols(
      bins.map((b) => b.x),
      bins.map((b) => b.y),
    );
    const slopes: number[] = [];
    const tails: number[] = [];
    for (let i = 0; i < BOOTS; i++) {
      const bb = deltaPoints(resample(corrRt), resample(nonRt));
      if (bb.length !== NBINS) continue;
      const f = ols(
        bb.map((b) => b.x),
        bb.map((b) => b.y),
      );
      if (Number.isFinite(f.b)) slopes.push(f.b);
      const dx = bb[NBINS - 1].x - bb[NBINS - 2].x;
      if (dx > 0) tails.push((bb[NBINS - 1].y - bb[NBINS - 2].y) / dx);
    }
    const spacing = (bins[NBINS - 1].x - bins[0].x) / (NBINS - 1);
    const tailDx = bins[NBINS - 1].x - bins[NBINS - 2].x;
    delta = {
      bins,
      a: fit.a,
      b: fit.b,
      bCi: ci(slopes),
      tail: tailDx > 0 ? (bins[NBINS - 1].y - bins[NBINS - 2].y) / tailDx : NaN,
      tailCi: ci(tails),
      // a difference between two bins whose centres are closer together than one frame is a
      // difference this display cannot express, and its slope is not a measurement
      resolvable: !Number.isFinite(frameQ) || spacing > frameQ,
      spacing,
    };
  }

  await step(0.5);

  // ---------------- the conditional accuracy function ----------------
  //
  // The same claim seen in a completely different measure. If a location impulse arrives early and
  // dies, then early responses are the ones it can capture, and capture shows up as ERRORS on the
  // trials where the side disagreed. So accuracy on those trials should be worst in your fastest
  // bin and recover as you slow down, which is not something a fixed extra stage predicts at all.

  const cafC = hMain.filter((t) => t.congruent);
  const cafN = hMain.filter((t) => !t.congruent);
  let caf: Result['caf'] = null;
  if (cafC.length >= NBINS * 4 && cafN.length >= NBINS * 4) {
    const bc = binTrials(cafC, NBINS);
    const bn = binTrials(cafN, NBINS);
    const rows2 = bc.map((g, i) => ({
      x: (mean(g.map((t) => t.rt)) + mean(bn[i].map((t) => t.rt))) / 2,
      accC: accOf(g),
      accN: accOf(bn[i]),
      nC: g.length,
      nN: bn[i].length,
    }));
    const fast = rows2[0].accN;
    const slow = rows2[NBINS - 1].accN;
    const riseBoots: number[] = [];
    for (let i = 0; i < 400; i++) {
      const r = binTrials(resample(cafN), NBINS);
      if (r.length !== NBINS || !r[0].length || !r[NBINS - 1].length) continue;
      riseBoots.push(accOf(r[NBINS - 1]) - accOf(r[0]));
    }
    caf = { bins: rows2, fast, slow, rise: slow - fast, riseCi: ci(riseBoots) };
  }

  await step(0.65);

  // ---------------- the held-out block ----------------

  const heldRows = scored.filter((t) => t.kind === 'held' && t.correct && usableRt(t));
  const hC = heldRows.filter((t) => t.congruent).map((t) => t.rt);
  const hN = heldRows.filter((t) => !t.congruent).map((t) => t.rt);
  let held: Result['held'] = null;
  if (locked.ok && hC.length >= 8 && hN.length >= 8) {
    const obs = mean(hN) - mean(hC);
    const obsX = (mean(hC) + mean(hN)) / 2;
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(hN)) - mean(resample(hC)));
    const obsCi = ci(boots);
    const predDecay = locked.a + locked.b * obsX;
    const predStage = locked.flat;
    const inDecay = covers(obsCi, predDecay);
    const inStage = covers(obsCi, predStage);
    const verdict: 'decay' | 'stage' | 'neither' | 'unresolved' =
      inDecay && inStage ? 'unresolved' : inDecay ? 'decay' : inStage ? 'stage' : 'neither';
    held = {
      ran: true,
      locked,
      obsX,
      obs,
      obsCi,
      slowdown: obsX - locked.mainX,
      predDecay,
      predStage,
      verdict,
    };
  } else if (locked.ok) {
    held = {
      ran: false,
      locked,
      obsX: NaN,
      obs: NaN,
      obsCi: [NaN, NaN],
      slowdown: NaN,
      predDecay: NaN,
      predStage: NaN,
      verdict: 'unresolved',
    };
  }

  await step(0.8);

  // ---------------- the vertical block ----------------

  const vRows = scored.filter((t) => t.kind === 'vertical' && usableRt(t));
  const vC = vRows.filter((t) => t.congruent).map((t) => t.rt);
  const vN = vRows.filter((t) => !t.congruent).map((t) => t.rt);
  let vertical: Result['vertical'] = null;
  if (vC.length >= 8 && vN.length >= 8) {
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(vN)) - mean(resample(vC)));
    vertical = {
      effect: mean(vN) - mean(vC),
      ci: ci(boots),
      p: permDiff(vN, vC, 'two'),
      n: vRows.length,
      hRef: head.effect,
    };
  }

  // ---------------- the previous trial, and why this design cannot answer it ----------------
  //
  // The Gratton effect is easy to compute and, in a two-choice task, impossible to interpret, and
  // the reason is arithmetic rather than statistical. The correct key is a function of the colour,
  // so the colour repeating is the key repeating, and congruency is position against key. Work it
  // through: if exactly one of colour and position repeats, congruency MUST flip; if both repeat or
  // neither does, congruency MUST stay. So the trials Mayr, Awh and Laurey 2003 tell you to keep,
  // the partial repetitions, are precisely the trials where congruency alternated, and the ones
  // they tell you to drop are precisely the ones where it repeated. The recommended fix does not
  // clean this contrast up, it deletes it.
  //
  // That is not a reason to skip the section. It is the section. The number is computed on
  // everything, printed, and then shown to be uninterpretable, with the two counts underneath as
  // the proof rather than as a citation the visitor has to take on trust.

  const seqRows = hMain.filter(
    (t) => t.correct && t.prevColour !== null && t.prevPos !== null && t.prevCongruent !== null,
  );
  let seq: Result['seq'] = null;
  if (seqRows.length >= 32) {
    const g = (prev: boolean, cur: boolean) =>
      seqRows.filter((t) => t.prevCongruent === prev && t.congruent === cur).map((t) => t.rt);
    const cc = g(true, true);
    const cI = g(true, false);
    const ic = g(false, true);
    const ii = g(false, false);
    const partial = seqRows.filter((t) => (t.colour === t.prevColour) !== (t.pos === t.prevPos));
    const full = seqRows.filter((t) => (t.colour === t.prevColour) === (t.pos === t.prevPos));
    if (cc.length >= 6 && cI.length >= 6 && ic.length >= 6 && ii.length >= 6) {
      const boots: number[] = [];
      for (let i = 0; i < 400; i++) {
        boots.push(
          mean(resample(cI)) - mean(resample(cc)) - (mean(resample(ii)) - mean(resample(ic))),
        );
      }
      seq = {
        gratton: mean(cI) - mean(cc) - (mean(ii) - mean(ic)),
        grattonCi: ci(boots),
        n: seqRows.length,
        nPartial: partial.length,
        partialKeepingCongruency: partial.filter((t) => t.congruent === t.prevCongruent).length,
        nFull: full.length,
        fullKeepingCongruency: full.filter((t) => t.congruent === t.prevCongruent).length,
      };
    }
  }

  // ---------------- drift ----------------

  const blocks = [...new Set(hMain.map((t) => t.block))].sort((a, b) => a - b);
  let drift: Result['drift'] = null;
  if (blocks.length >= 2) {
    const f = hMain.filter((t) => t.block === blocks[0] && t.correct);
    const l = hMain.filter((t) => t.block === blocks[blocks.length - 1] && t.correct);
    const eff = (g: Trial[]) =>
      mean(g.filter((t) => !t.congruent).map((t) => t.rt)) -
      mean(g.filter((t) => t.congruent).map((t) => t.rt));
    drift = {
      first: eff(f),
      last: eff(l),
      rtFirst: mean(f.map((t) => t.rt)),
      rtLast: mean(l.map((t) => t.rt)),
      diff: eff(l) - eff(f),
    };
  }

  await step(1);

  return { ...base, head, delta, caf, held, vertical, seq, drift };
}

function accOf(g: Trial[]) {
  if (!g.length) return NaN;
  return g.filter((t) => t.correct).length / g.length;
}

function binTrials(g: Trial[], k: number): Trial[][] {
  const s = [...g].sort((a, b) => a.rt - b.rt);
  const out: Trial[][] = [];
  const n = s.length;
  for (let i = 0; i < k; i++) {
    out.push(s.slice(Math.floor((i * n) / k), Math.floor(((i + 1) * n) / k)));
  }
  return out;
}

function covers(c: [number, number], v: number) {
  return Number.isFinite(c[0]) && Number.isFinite(v) && v >= c[0] && v <= c[1];
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'crunch' | 'result';
type Flash = null | 'right' | 'wrong' | 'slow' | 'early';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [visible, setVisible] = useState(false);
  const [cur, setCur] = useState<Spec | null>(null);
  const [flash, setFlash] = useState<Flash>(null);
  const [progress, setProgress] = useState(0);
  const [lockedView, setLockedView] = useState<Locked | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  // The colour-to-key mapping is drawn per session, which makes it exactly the kind of value that
  // must not exist during the first render: this page is a static export, its HTML is frozen at
  // build time, and a random value in a state initialiser differs between the build and the first
  // paint and takes hydration down with it. So it starts as a placeholder nobody is shown, gets
  // drawn in a mount effect, and the intro holds its swatches back until then. It also has to be
  // drawn HERE rather than inside begin(), because the intro promises a mapping and the trials have
  // to keep that promise.
  const [mapping, setMapping] = useState<{ left: string; right: string }>({
    left: HUES[0].name,
    right: HUES[1].name,
  });
  const [mapReady, setMapReady] = useState(false);

  const planRef = useRef<Block[]>([]);
  const blockIdxRef = useRef(0);
  const specsRef = useRef<Spec[]>([]);
  const idxRef = useRef(0);
  const trialsRef = useRef<Trial[]>([]);
  const lockedRef = useRef<Locked | null>(null);
  const leftColourRef = useRef(0);
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

  // The display quantum is metered from real frames for the whole session rather than inferred
  // from how densely the reaction times happen to fill their own range, which is a statistic about
  // sample size wearing a hardware costume.
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

  const drawMapping = useCallback(() => {
    const c = Math.random() < 0.5 ? 0 : 1;
    leftColourRef.current = c;
    setMapping({ left: HUES[c].name, right: HUES[1 - c].name });
    setMapReady(true);
    return c;
  }, []);

  useEffect(() => {
    drawMapping();
  }, [drawMapping]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') hiddenRef.current = true;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimers();
        stopMeter();
        setPhase('intro');
        setVisible(false);
        return;
      }
      if (e.repeat) return;
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
    if (i >= specs.length) return;
    const spec = specs[i];

    setCur(spec);
    setVisible(false);
    setFlash(null);
    hiddenRef.current = document.visibilityState !== 'visible';
    armRef.current = -1;
    answeredRef.current = -1;

    later(() => {
      setVisible(true);
      // the frame AFTER the one that painted it: the first callback runs before the paint and the
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
    }, ITI);
  }, [later]);

  nextTrialRef.current = runTrial;

  recordRef.current = (resp, rt, touch, omitted) => {
    const specs = specsRef.current;
    const i = idxRef.current;
    const spec = specs[i];
    if (!spec) return;
    const block = planRef.current[blockIdxRef.current];
    const wasHidden = hiddenRef.current || document.visibilityState !== 'visible';
    const correct = resp !== null && resp === spec.key;
    const prev = i > 0 ? specs[i - 1] : null;

    trialsRef.current.push({
      block: blockIdxRef.current,
      kind: block.kind,
      axis: spec.axis,
      faded: spec.faded,
      colour: spec.colour,
      pos: spec.pos,
      key: spec.key,
      congruent: spec.congruent,
      resp,
      rt,
      correct,
      omitted,
      hidden: wasHidden,
      touch,
      prevColour: prev ? prev.colour : null,
      prevPos: prev ? prev.pos : null,
      prevCongruent: prev ? prev.congruent : null,
    });

    if (touch) modeRef.current.touch++;
    else if (resp !== null) modeRef.current.key++;

    setVisible(false);
    setDone(i + 1);

    let f: Flash = null;
    if (omitted) f = 'slow';
    else if (!correct) f = 'wrong';
    else if (!block.scored) f = 'right';

    setFlash(f);
    const wait = f === null ? 70 : FEEDBACK_MS;
    later(() => {
      setFlash(null);
      idxRef.current = i + 1;
      if (idxRef.current < specsRef.current.length) nextTrialRef.current();
      else setDone(specsRef.current.length);
    }, wait);
  };

  const respond = useCallback(
    (k: number, touch: boolean) => {
      const i = idxRef.current;
      if (armRef.current !== i) {
        if (phaseRef.current === 'run' && armRef.current === -1) {
          setFlash('early');
          later(() => setFlash(null), 280);
        }
        return;
      }
      if (answeredRef.current === i) return;
      answeredRef.current = i;
      const rt = performance.now() - onsetRef.current;
      clearTimers();
      recordRef.current(k, rt, touch, false);
    },
    [clearTimers, later],
  );

  respondRef.current = respond;

  // block transitions are DERIVED from the trial index rather than scheduled from inside a state
  // updater, because a side effect in a reducer is a transition React is entitled to lose
  useEffect(() => {
    if (phase !== 'run') return;
    const specs = specsRef.current;
    if (!specs.length) return;
    if (done < specs.length) return;
    clearTimers();
    setVisible(false);
    const next = blockIdxRef.current + 1;
    if (next >= planRef.current.length) {
      setPhase('crunch');
    } else {
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
    later(() => nextTrialRef.current(), 420);
  }, [later, startMeter]);

  // reroll is for the button on the results page, which promises a fresh mapping and has no intro
  // card to contradict. Starting from the intro uses the mapping the intro already showed.
  const begin = useCallback(
    (reroll: boolean) => {
      const leftColour = reroll ? drawMapping() : leftColourRef.current;
      const p = buildPlan(leftColour);
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
    },
    [drawMapping, later, startMeter],
  );

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
          reason: 'the faded block never opened',
          a: NaN,
          b: NaN,
          flat: NaN,
          mainX: NaN,
          n: 0,
          table: [],
        } as Locked);
      const r = await analyze(
        trialsRef.current,
        lk,
        { left: HUES[leftColourRef.current].name, right: HUES[1 - leftColourRef.current].name },
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
          spec={cur}
          visible={visible}
          flash={flash}
          done={done}
          total={specsRef.current.length}
          leftColour={leftColourRef.current}
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
          <div className="mb-3 text-5xl">&#129517;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Nobody Asked Where
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            You will be asked about a colour. The side of the screen it appeared on is random, it is
            never mentioned, and it will answer anyway. This page measures how long that lasts.
          </p>
        </div>

        {phase === 'intro' && (
          <Intro mapping={mapping} ready={mapReady} onStart={() => begin(false)} />
        )}

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
              cutting your own reaction times into five speeds
            </div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div
                className="h-full bg-cyan-400/60 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {phase === 'result' && res && <Results res={res} onAgain={() => begin(true)} />}
      </div>
    </main>
  );
}

// ============================ intro ============================

function Intro({
  mapping,
  ready,
  onStart,
}: {
  mapping: { left: string; right: string };
  ready: boolean;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          A coloured square appears, off to one side. One colour means the left key, the other means
          the right key. That is the whole task.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The side it appears on is random, it carries no information, and nothing in the
          instruction refers to it. You will still be slower when the side disagrees with the hand.
          Simon and Rudell found this in 1967 and it has never stopped working on anybody, including
          on people who have just been told about it.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          effect = RT(wrong side) &minus; RT(right side)
          <br />
          <span className="text-cyan-100">a difference, so your hardware cancels out of it</span>
        </div>
      </div>

      <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/90">
          the interesting part is not the average
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          One number cannot tell you what kind of thing it is. So this page cuts your own reaction
          times into five speeds, your fastest fifth through to your slowest, and asks how big the
          effect is inside each one.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          If an irrelevant location were an extra stage costing thirty milliseconds, that picture
          would be flat. It is not. It slopes down, and in plenty of people the slowest bin goes
          negative. Which means it is not a stage, it is a race against a clock: the side of the
          screen reaches your hands early and by itself, and then it fades.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/90">
          the prediction the fit never saw
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Three blocks are fitted and then closed. The last block fades the colours until they are
          hard to read, which slows you down and does not touch the location at all, and before it
          opens two rival readings of the closed data each name a number:
        </p>
        <div className="my-3 space-y-2">
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
              the impulse decays
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              You got slower, so the effect must come DOWN, by exactly what your own delta line says
              at your new speed.
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
              it is a fixed stage
            </div>
            <div className="mt-1 text-xs leading-relaxed text-slate-400">
              An irrelevant location costs what it costs. You got slower, the effect stays put.
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          They disagree about the direction, which is what makes it a test. The intuition that more
          time means more interference is the one on the block here.
        </p>
      </div>

      <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-rose-300/90">
          the block that could kill it
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          There is a boring explanation for all of this: a bright thing off to the side yanks your
          attention, and yanked attention is slow. If that were the whole story it would not matter
          which way the square was offset.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So one block moves it up and down instead, with the keys still left and right. Same onset,
          same distance, no left or right in it for a hand to agree with. That block is scored
          against the one leak there is, which is that up and right feel like the same end of a
          scale.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the rules, drawn fresh for this session
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          {[0, 1].map((side) => {
            // held back until the mapping has actually been drawn, so that the pair shown here is
            // the pair the trials will use rather than a placeholder the visitor would then be
            // marked wrong for trusting
            const hue = ready
              ? HUES.find((h) => h.name === (side === 0 ? mapping.left : mapping.right))
              : null;
            return (
              <div key={side} className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
                <div
                  className={`mx-auto h-10 w-10 rounded ${hue ? '' : 'bg-slate-800'}`}
                  style={hue ? { background: hue.full } : undefined}
                  aria-hidden
                />
                <div className="mt-2 font-mono text-xs text-cyan-300/80">
                  {side === 0 ? 'left' : 'right'} . {KEY_LABEL[side]}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          The colour decides the key, and this pair is drawn fresh for every session, so nobody&apos;s preference for one colour can ride along in the effect. The side decides nothing. Six blocks, about seven minutes, the
          first one unscored, escape aborts at any time. On a phone the two buttons do the same job
          and the headline still works, because it is a difference and your touchscreen&apos;s lag
          is in both halves of it. A run below 82 percent correct is refused rather than scored.
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
            locked before you see a single faded square
          </div>
          {locked.ok ? (
            <>
              <p className="text-sm leading-relaxed text-slate-300">
                Your three main blocks are closed. A delta line is fitted to them and nothing
                downstream is allowed to touch it. Here is what each model says the effect will be,
                depending on how much the faded colours slow you down:
              </p>
              <div className="my-4 overflow-hidden rounded-md border border-slate-800">
                <table className="w-full font-mono text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-500">
                      <th className="px-3 py-2 text-left font-normal">if you slow by</th>
                      <th className="px-3 py-2 text-right font-normal text-emerald-300/80">
                        decaying impulse
                      </th>
                      <th className="px-3 py-2 text-right font-normal text-amber-300/80">
                        fixed stage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {locked.table.map((r, i) => (
                      <tr key={i} className="border-t border-slate-800/70 bg-slate-950/40">
                        <td className="px-3 py-2 text-slate-400">
                          {i === 0 ? 'not at all' : `${Math.round(r.x - locked.mainX)} ms`}
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-200">
                          {r.decay.toFixed(1)} ms
                        </td>
                        <td className="px-3 py-2 text-right text-amber-200">
                          {r.stage.toFixed(1)} ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Fitted on {locked.n} trials. The line is {locked.a.toFixed(1)}{' '}
                {locked.b >= 0 ? '+' : '-'} {Math.abs(locked.b).toFixed(3)} per ms of speed.
                Both columns are read off closed data with nothing left to adjust, and your actual
                slowdown decides which row matters.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300">
              The main blocks did not produce a fittable delta line ({locked.reason}), so this block
              runs without a prediction over it and the results page will say so.
            </p>
          )}
        </div>
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

// ============================ stage ============================

function Stage({
  block,
  spec,
  visible,
  flash,
  done,
  total,
  leftColour,
  onPress,
}: {
  block: Block;
  spec: Spec | null;
  visible: boolean;
  flash: Flash;
  done: number;
  total: number;
  leftColour: number;
  onPress: (k: number) => void;
}) {
  const W = 300;
  const H = 220;
  const SIZE = 54;
  const OFF = 92;

  let x = W / 2 - SIZE / 2;
  let y = H / 2 - SIZE / 2;
  if (spec) {
    if (spec.axis === 'h') x += spec.pos === 0 ? -OFF : OFF;
    else y += spec.pos === 0 ? -OFF * 0.62 : OFF * 0.62;
  }
  const hue = spec ? HUES[spec.colour] : HUES[0];
  const fill = spec && spec.faded ? hue.dim : hue.full;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {block.label}
        {!block.scored && ' . not scored'}
      </div>

      <div
        className="relative rounded-xl border-2 border-slate-800 bg-[#05070b]"
        style={{ width: W, height: H }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700"
          aria-hidden
        />
        {visible && spec && (
          <div
            className="absolute rounded"
            style={{ left: x, top: y, width: SIZE, height: SIZE, background: fill }}
            aria-hidden
          />
        )}
      </div>

      <div className="mt-4 h-4 font-mono text-[10px] uppercase tracking-wider text-slate-600">
        the colour decides the key
      </div>

      <div className="mt-1 h-6 font-mono text-xs">
        {flash === 'right' && <span className="text-emerald-400">correct</span>}
        {flash === 'wrong' && <span className="text-rose-400">wrong key</span>}
        {flash === 'slow' && <span className="text-amber-400">too slow</span>}
        {flash === 'early' && <span className="text-amber-400">wait for the square</span>}
      </div>

      <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-3">
        {[0, 1].map((k) => (
          <button
            key={k}
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(k);
            }}
            className="flex h-20 flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900"
          >
            <span
              className="h-6 w-6 rounded"
              style={{ background: HUES[k === 0 ? leftColour : 1 - leftColour].full }}
              aria-hidden
            />
            <span className="mt-2 font-mono text-[10px] text-slate-600">{KEY_LABEL[k]}</span>
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
  return Number.isFinite(v) ? `${v >= 0 ? '' : '−'}${Math.abs(v).toFixed(1)} ms` : 'not measured';
}

function ciTxt(c: [number, number]) {
  return Number.isFinite(c[0])
    ? `[${c[0].toFixed(1)}, ${c[1].toFixed(1)}]`
    : '[too thin to bracket]';
}

function pctTxt(v: number, dp = 0) {
  return Number.isFinite(v) ? `${(v * 100).toFixed(dp)}%` : 'not measured';
}

function pTxt(p: number) {
  if (!Number.isFinite(p)) return 'p not computed';
  return p < 0.001 ? 'p < 0.001' : `p = ${p.toFixed(3)}`;
}

function Card({
  tone,
  title,
  children,
}: {
  tone: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate';
  title: string;
  children: React.ReactNode;
}) {
  const border = {
    cyan: 'border-cyan-400/25',
    violet: 'border-violet-400/25',
    emerald: 'border-emerald-400/25',
    amber: 'border-amber-400/25',
    rose: 'border-rose-400/25',
    slate: 'border-slate-800',
  }[tone];
  const text = {
    cyan: 'text-cyan-300/90',
    violet: 'text-violet-300/90',
    emerald: 'text-emerald-300/90',
    amber: 'text-amber-300/90',
    rose: 'text-rose-300/90',
    slate: 'text-slate-500',
  }[tone];
  // written out rather than interpolated: Tailwind reads these files as text, and a class name
  // built at runtime is a class name that never gets generated
  const bg = {
    cyan: 'bg-cyan-400/[0.04]',
    violet: 'bg-violet-400/[0.04]',
    emerald: 'bg-emerald-400/[0.04]',
    amber: 'bg-amber-400/[0.04]',
    rose: 'bg-rose-400/[0.04]',
    slate: 'bg-slate-900/40',
  }[tone];
  return (
    <div className={`rounded-lg border ${border} ${bg} p-5`}>
      <div className={`mb-2 font-mono text-xs uppercase tracking-wider ${text}`}>{title}</div>
      {children}
    </div>
  );
}

// ---------------- the delta plot ----------------

function DeltaPlot({ d }: { d: NonNullable<Result['delta']> }) {
  const W = 480;
  const H = 240;
  const P = { l: 46, r: 14, t: 16, b: 34 };
  const xs = d.bins.map((b) => b.x);
  const ys = d.bins.map((b) => b.y);
  const xLo = Math.min(...xs) - 25;
  const xHi = Math.max(...xs) + 25;
  const yLo = Math.min(0, Math.min(...ys)) - 8;
  const yHi = Math.max(0, Math.max(...ys)) + 8;
  const px = (v: number) => P.l + ((v - xLo) / (xHi - xLo)) * (W - P.l - P.r);
  const py = (v: number) => H - P.b - ((v - yLo) / (yHi - yLo)) * (H - P.t - P.b);

  const line = [xLo, xHi].map((x) => ({ x, y: d.a + d.b * x }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="delta plot">
      <line x1={P.l} y1={py(0)} x2={W - P.r} y2={py(0)} stroke="#334155" strokeDasharray="3 4" />
      <line x1={P.l} y1={P.t} x2={P.l} y2={H - P.b} stroke="#334155" />
      <path
        d={`M ${px(line[0].x)} ${py(line[0].y)} L ${px(line[1].x)} ${py(line[1].y)}`}
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        fill="none"
      />
      <path
        d={d.bins.map((b, i) => `${i ? 'L' : 'M'} ${px(b.x)} ${py(b.y)}`).join(' ')}
        stroke="#22d3ee"
        strokeWidth="2"
        fill="none"
      />
      {d.bins.map((b, i) => (
        <g key={i}>
          <circle cx={px(b.x)} cy={py(b.y)} r="4.5" fill="#22d3ee" />
          <text
            x={px(b.x)}
            y={py(b.y) - 11}
            textAnchor="middle"
            className="fill-cyan-200"
            fontSize="10"
            fontFamily="monospace"
          >
            {b.y.toFixed(0)}
          </text>
        </g>
      ))}
      {[yLo, (yLo + yHi) / 2, yHi].map((v, i) => (
        <text
          key={i}
          x={P.l - 6}
          y={py(v) + 3}
          textAnchor="end"
          className="fill-slate-500"
          fontSize="9"
          fontFamily="monospace"
        >
          {v.toFixed(0)}
        </text>
      ))}
      <text
        x={(W + P.l) / 2}
        y={H - 8}
        textAnchor="middle"
        className="fill-slate-500"
        fontSize="10"
        fontFamily="monospace"
      >
        your speed, fastest fifth on the left ({Math.round(xs[0])} to {Math.round(xs[xs.length - 1])}{' '}
        ms)
      </text>
      <text
        x={12}
        y={P.t + 8}
        className="fill-slate-500"
        fontSize="10"
        fontFamily="monospace"
        transform={`rotate(-90 12 ${P.t + 8})`}
      >
        effect
      </text>
    </svg>
  );
}

// ---------------- the accuracy curve ----------------

function CafPlot({ c }: { c: NonNullable<Result['caf']> }) {
  const W = 480;
  const H = 200;
  const P = { l: 46, r: 14, t: 16, b: 34 };
  const xs = c.bins.map((b) => b.x);
  const all = c.bins.flatMap((b) => [b.accC, b.accN]).filter(Number.isFinite);
  const xLo = Math.min(...xs) - 25;
  const xHi = Math.max(...xs) + 25;
  const yLo = Math.max(0, Math.min(...all) - 0.06);
  const yHi = 1.005;
  const px = (v: number) => P.l + ((v - xLo) / (xHi - xLo)) * (W - P.l - P.r);
  const py = (v: number) => H - P.b - ((v - yLo) / (yHi - yLo)) * (H - P.t - P.b);
  const path = (key: 'accC' | 'accN') =>
    c.bins.map((b, i) => `${i ? 'L' : 'M'} ${px(b.x)} ${py(b[key])}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="accuracy by speed">
      <line x1={P.l} y1={P.t} x2={P.l} y2={H - P.b} stroke="#334155" />
      <path d={path('accC')} stroke="#34d399" strokeWidth="2" fill="none" />
      <path d={path('accN')} stroke="#fb7185" strokeWidth="2" fill="none" />
      {c.bins.map((b, i) => (
        <g key={i}>
          <circle cx={px(b.x)} cy={py(b.accC)} r="3.5" fill="#34d399" />
          <circle cx={px(b.x)} cy={py(b.accN)} r="3.5" fill="#fb7185" />
        </g>
      ))}
      {[yLo, (yLo + yHi) / 2, 1].map((v, i) => (
        <text
          key={i}
          x={P.l - 6}
          y={py(v) + 3}
          textAnchor="end"
          className="fill-slate-500"
          fontSize="9"
          fontFamily="monospace"
        >
          {Math.round(v * 100)}
        </text>
      ))}
      <text
        x={(W + P.l) / 2}
        y={H - 8}
        textAnchor="middle"
        className="fill-slate-500"
        fontSize="10"
        fontFamily="monospace"
      >
        fastest fifth on the left . green agrees with the hand, red does not
      </text>
    </svg>
  );
}

// ---------------- the playground ----------------
//
// A diffusion with an extra term: a location impulse that rises fast and decays, pushing toward the
// side the square was on. Two knobs on the impulse and one on the drive. Drag them and the delta
// plot regenerates, with the visitor's own five points printed underneath, and the point of the
// thing is that a big amplitude with a short life and a small amplitude with a long life land in
// almost the same place. That is what "this cannot distinguish suppression from decay" means when
// you can move it with your finger.

type SimPoint = { x: number; y: number };

function simulate(amp: number, tau: number, drive: number, n = 900): SimPoint[] {
  const dt = 6;
  const sigma = 0.62;
  const B = 1;
  const T0 = 190;
  const MAXT = 1400;
  const draw = (dir: number) => {
    const out: number[] = [];
    for (let t = 0; t < n; t++) {
      let e = 0;
      let ms = 0;
      while (ms < MAXT) {
        // gamma-shaped pulse, peak near tau, gone by roughly three tau
        const s = ms / tau;
        const pulse = s * Math.exp(1 - s);
        const mu = drive + dir * amp * pulse;
        e += (mu * dt) / 100 + sigma * Math.sqrt(dt / 100) * gauss();
        ms += dt;
        if (e >= B || e <= -B) break;
      }
      if (e >= B) out.push(ms + T0);
    }
    return out;
  };
  const corr = draw(1);
  const non = draw(-1);
  if (corr.length < 40 || non.length < 40) return [];
  return deltaPoints(corr, non).map((b) => ({ x: b.x, y: b.y }));
}

let spare: number | null = null;
function gauss() {
  if (spare !== null) {
    const v = spare;
    spare = null;
    return v;
  }
  let u = 0;
  let v = 0;
  let s = 0;
  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s === 0 || s >= 1);
  const f = Math.sqrt((-2 * Math.log(s)) / s);
  spare = v * f;
  return u * f;
}

function Playground({ mine }: { mine: DeltaBin[] }) {
  const [amp, setAmp] = useState(2.6);
  const [tau, setTau] = useState(90);
  const [drive, setDrive] = useState(2.2);
  const sim = useMemo(() => simulate(amp, tau, drive), [amp, tau, drive]);

  const W = 480;
  const H = 220;
  const P = { l: 46, r: 14, t: 16, b: 30 };
  const pts = [...sim, ...mine.map((b) => ({ x: b.x, y: b.y }))];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const xLo = xs.length ? Math.min(...xs) - 25 : 300;
  const xHi = xs.length ? Math.max(...xs) + 25 : 700;
  const yLo = ys.length ? Math.min(0, Math.min(...ys)) - 8 : -20;
  const yHi = ys.length ? Math.max(0, Math.max(...ys)) + 8 : 60;
  const px = (v: number) => P.l + ((v - xLo) / (xHi - xLo)) * (W - P.l - P.r);
  const py = (v: number) => H - P.b - ((v - yLo) / (yHi - yLo)) * (H - P.t - P.b);

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="simulated delta plot">
        <line x1={P.l} y1={py(0)} x2={W - P.r} y2={py(0)} stroke="#334155" strokeDasharray="3 4" />
        <line x1={P.l} y1={P.t} x2={P.l} y2={H - P.b} stroke="#334155" />
        {mine.length > 0 && (
          <path
            d={mine.map((b, i) => `${i ? 'L' : 'M'} ${px(b.x)} ${py(b.y)}`).join(' ')}
            stroke="#22d3ee"
            strokeWidth="2"
            fill="none"
            opacity="0.65"
          />
        )}
        {mine.map((b, i) => (
          <circle key={i} cx={px(b.x)} cy={py(b.y)} r="4" fill="#22d3ee" opacity="0.65" />
        ))}
        {sim.length > 0 && (
          <path
            d={sim.map((p, i) => `${i ? 'L' : 'M'} ${px(p.x)} ${py(p.y)}`).join(' ')}
            stroke="#f472b6"
            strokeWidth="2"
            fill="none"
          />
        )}
        {sim.map((p, i) => (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r="3.5" fill="#f472b6" />
        ))}
        <text
          x={(W + P.l) / 2}
          y={H - 6}
          textAnchor="middle"
          className="fill-slate-500"
          fontSize="10"
          fontFamily="monospace"
        >
          pink is the model . cyan is you
        </text>
      </svg>

      <div className="space-y-3">
        <Slider
          label="how hard the side shoves"
          value={amp}
          min={0}
          max={6}
          step={0.1}
          fmt={(v) => v.toFixed(1)}
          onChange={setAmp}
        />
        <Slider
          label="how long the shove lasts"
          value={tau}
          min={30}
          max={260}
          step={5}
          fmt={(v) => `${Math.round(v)} ms`}
          onChange={setTau}
        />
        <Slider
          label="how fast you read the colour"
          value={drive}
          min={0.9}
          max={4}
          step={0.05}
          fmt={(v) => v.toFixed(2)}
          onChange={setDrive}
        />
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Nothing in this model suppresses anything. There is no monitor, no control process, no
        second thought. The impulse arrives and dies on a timer, and that alone bends the plot
        downward, which is why a downward delta plot cannot be read as evidence that you inhibited
        anything. Turn the shove up and its life down and watch the same curve come back from a
        completely different pair of numbers.
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between font-mono text-[11px] text-slate-500">
        <span>{label}</span>
        <span className="text-slate-300">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-pink-400"
      />
    </label>
  );
}

// ---------------- verdict prose ----------------

function deltaVerdict(d: NonNullable<Result['delta']>) {
  if (!d.resolvable) {
    return `Your five speed bins are only ${d.spacing.toFixed(0)} ms apart on average, which is inside one frame of your display. A slope fitted across gaps your screen cannot express is not a measurement, so this one is refused rather than printed as a finding.`;
  }
  const [lo, hi] = d.bCi;
  if (!Number.isFinite(lo)) return 'The slope could not be bracketed on this many trials.';
  if (hi < 0) {
    return `The line goes down and the interval stays below zero. Your effect is largest when you are fast and smallest when you are slow, which is the signature the fixed-stage account cannot produce. Whatever the side of the screen does to you, it is on a clock.`;
  }
  if (lo > 0) {
    return `The line goes UP, and the interval stays above zero. That is the minority pattern and it is real in some people and some tasks: the effect grows with time rather than fading. It is what you would see if the location code kept arriving instead of dying, and it is the outcome this page would have been embarrassed to hide.`;
  }
  return `The interval on the slope covers zero, so this session cannot say which way the line runs. That is the honest reading of five bins built out of this many trials, and it is the outcome a page with an axe to grind would have called flat and moved on from.`;
}

function heldVerdict(h: NonNullable<Result['held']>) {
  if (!h.ran) return 'The faded block did not produce enough clean trials to test the prediction.';
  const dir =
    h.slowdown > 0
      ? `The faded colours slowed you by ${Math.round(h.slowdown)} ms, which is the lever working.`
      : `The faded colours did not actually slow you down (${Math.round(h.slowdown)} ms), so the lever never moved and the two models were never pulled apart. Nothing below is a test of anything.`;
  const rest = {
    decay: `Your effect landed at ${h.obs.toFixed(1)} ms. The decaying-impulse model, committed before the block opened, said ${h.predDecay.toFixed(1)}. The fixed-stage model said ${h.predStage.toFixed(1)} and is outside your interval. The prediction that survived is the one that had to name a smaller number for a slower you.`,
    stage: `Your effect landed at ${h.obs.toFixed(1)} ms, which brackets the fixed-stage prediction of ${h.predStage.toFixed(1)} and excludes the decaying-impulse prediction of ${h.predDecay.toFixed(1)}. On this run the cost of an irrelevant side did not care how slow you got, and the delta line did not generalise off its own range.`,
    neither: `Your effect landed at ${h.obs.toFixed(1)} ms, which excludes BOTH predictions (${h.predDecay.toFixed(1)} and ${h.predStage.toFixed(1)}). Two models named numbers in advance and the world took a third option, which is the most interesting way for this block to end and the one that means fading the colours did something to the location code as well, not only to the colour.`,
    unresolved: `Your effect landed at ${h.obs.toFixed(1)} ms with an interval of ${ciTxt(h.obsCi)}, wide enough to contain both predictions (${h.predDecay.toFixed(1)} and ${h.predStage.toFixed(1)}). Forty-eight trials could not separate them. Saying so is the result; picking the one nearer the middle would not be.`,
  }[h.verdict];
  return `${dir} ${rest}`;
}

function verticalVerdict(v: NonNullable<Result['vertical']>) {
  const [lo, hi] = v.ci;
  if (!Number.isFinite(lo)) return 'Not enough clean vertical trials to bracket anything.';
  if (lo <= 0 && hi >= 0) {
    return `Moving the square up and down instead of left and right produced ${msTxt(v.effect)}, with an interval covering zero, against ${msTxt(v.hRef)} on the same screen with the same hands minutes earlier. The boring explanation is dead: a sudden bright thing off centre is not what costs you the time. What costs you the time is a LEFT that has to meet a right hand.`;
  }
  if (hi < 0 || lo > 0) {
    return `The vertical block came out at ${msTxt(v.effect)}, interval ${ciTxt(v.ci)}, which is not zero. Up and right sit at the same end of a scale and down and left at the other (Proctor and Cho 2006), and a vertical square can leak through that route into a left-and-right hand. Compare it against ${msTxt(v.hRef)} in the horizontal blocks: the size of the leak is the point, not its existence.`;
  }
  return `Vertical came out at ${msTxt(v.effect)}, interval ${ciTxt(v.ci)}.`;
}

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  if (res.refusal) {
    return (
      <div className="space-y-5">
        <Card tone="rose" title="this run is refused, and here is why">
          <p className="text-sm leading-relaxed text-slate-300">{res.refusal}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Nothing is printed above this line, because a number produced from data this page does
            not trust is worse than no number. Run it again with the accuracy in mind: the colour
            decides the key, and there is no prize for being early.
          </p>
        </Card>
        <button
          onClick={onAgain}
          className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
        >
          run it again
        </button>
      </div>
    );
  }

  const h = res.head!;
  const resolved = Number.isFinite(h.ci[0]) && h.ci[0] > 0;

  return (
    <div className="space-y-5">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-cyan-300/70">
          what the side of the screen cost you
        </div>
        <div className="my-3 font-mono text-5xl text-cyan-200">
          {Number.isFinite(h.effect) ? `${h.effect >= 0 ? '' : '−'}${Math.abs(h.effect).toFixed(0)}` : '--'}
          <span className="ml-2 text-2xl text-cyan-400/70">ms</span>
        </div>
        <div className="font-mono text-xs text-slate-500">
          95% interval {ciTxt(h.ci)} . {pTxt(h.p)}
        </div>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          {resolved
            ? 'Nobody asked you where the square was. You answered about it anyway, every time, and it cost you this much on the trials where it disagreed with your hand.'
            : 'The interval covers zero, so this run cannot say the side cost you anything. That happens, and it is printed rather than rounded into a finding.'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
              side agreed
            </div>
            <div className="mt-1 font-mono text-xl text-slate-100">{Math.round(h.corr.m)} ms</div>
            <div className="font-mono text-[10px] text-slate-600">{h.corr.n} trials</div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-rose-300/70">
              side disagreed
            </div>
            <div className="mt-1 font-mono text-xl text-slate-100">{Math.round(h.non.m)} ms</div>
            <div className="font-mono text-[10px] text-slate-600">{h.non.n} trials</div>
          </div>
        </div>
      </div>

      <Card tone="slate" title="what in this number is you and what is your laptop">
        <p className="text-sm leading-relaxed text-slate-300">
          Both means above contain your display&apos;s latency, your keyboard&apos;s scan interval
          and your finger. Neither of them is a pure measurement of you. The DIFFERENCE is, because
          all of that is added to both and subtracts out exactly, and the two conditions were
          shuffled together trial by trial so nothing could drift between them.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The delta plot below inherits the good half of that too. Its vertical axis is a difference,
          so it is clean. Its horizontal axis is contaminated, so the whole picture is shifted
          sideways by however slow your hardware is, and its SLOPE is a change in a difference over a
          change in a mean, so the shift cancels there as well. Your hardware moves the plot. It does
          not tilt it.
        </p>
        <div className="mt-3 font-mono text-[11px] text-slate-500">
          frames metered: {res.frames.n} .{' '}
          {Number.isFinite(res.frames.q)
            ? `${res.frames.q.toFixed(1)} ms between paints, so about ${Math.round(1000 / res.frames.q)} Hz`
            : 'not enough frames to meter'}{' '}
          . answered by {res.mode} . {res.minutes.toFixed(1)} minutes .{' '}
          {res.mapping.left} was the left key
        </div>
      </Card>

      {res.delta && (
        <Card tone="violet" title="the same effect, cut into five speeds">
          <DeltaPlot d={res.delta} />
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{deltaVerdict(res.delta)}</p>
          <div className="mt-3 font-mono text-[11px] text-slate-500">
            slope {res.delta.b.toFixed(3)} ms per ms, interval {ciTxt(res.delta.bCi)} . last two
            bins {Number.isFinite(res.delta.tail) ? res.delta.tail.toFixed(3) : '--'}, interval{' '}
            {ciTxt(res.delta.tailCi)} . bins {Math.round(res.delta.spacing)} ms apart
          </div>
        </Card>
      )}

      {res.caf && (
        <Card tone="amber" title="the same claim in a measure that is not time">
          <CafPlot c={res.caf} />
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            If a location impulse arrives early and dies, the trials it can capture are the fast
            ones, and capture does not only look like slowness, it looks like pressing the wrong
            key. Your accuracy on the disagreeing trials was {pctTxt(res.caf.fast, 1)} in your
            fastest fifth and {pctTxt(res.caf.slow, 1)} in your slowest, a recovery of{' '}
            {(res.caf.rise * 100).toFixed(1)} points with an interval of{' '}
            {Number.isFinite(res.caf.riseCi[0])
              ? `[${(res.caf.riseCi[0] * 100).toFixed(1)}, ${(res.caf.riseCi[1] * 100).toFixed(1)}]`
              : '[too thin]'}
            .
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            This is the independent window. It is built from your errors, which the reaction time
            analysis threw away, so the two results do not share a single number.
          </p>
        </Card>
      )}

      {res.held && (
        <Card tone="emerald" title="the block that had a prediction over it">
          {res.held.locked.ok ? (
            <>
              <div className="mb-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border border-emerald-500/25 bg-slate-950/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
                    decay said
                  </div>
                  <div className="mt-1 font-mono text-lg text-emerald-200">
                    {Number.isFinite(res.held.predDecay) ? res.held.predDecay.toFixed(1) : '--'}
                  </div>
                </div>
                <div className="rounded-md border border-cyan-500/30 bg-slate-950/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">
                    you did
                  </div>
                  <div className="mt-1 font-mono text-lg text-cyan-200">
                    {Number.isFinite(res.held.obs) ? res.held.obs.toFixed(1) : '--'}
                  </div>
                </div>
                <div className="rounded-md border border-amber-500/25 bg-slate-950/60 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
                    fixed stage said
                  </div>
                  <div className="mt-1 font-mono text-lg text-amber-200">
                    {Number.isFinite(res.held.predStage) ? res.held.predStage.toFixed(1) : '--'}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{heldVerdict(res.held)}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Both numbers were on the screen before the block opened and neither was refitted
                afterwards. The prediction is also provably free of your hardware: the line was
                fitted in coordinates that already contain your display&apos;s constant, and it is
                read out at a speed measured in those same coordinates, so the constant sits on both
                sides and never enters the answer.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300">
              No prediction could be locked before the faded block ({res.held.locked.reason}), so
              this block is data and not a test.
            </p>
          )}
        </Card>
      )}

      {res.vertical && (
        <Card tone="rose" title="the control that could have killed it">
          <p className="text-sm leading-relaxed text-slate-300">{verticalVerdict(res.vertical)}</p>
          <div className="mt-3 font-mono text-[11px] text-slate-500">
            {res.vertical.n} clean vertical trials . scored against polarity, up with the right key
            and down with the left
          </div>
        </Card>
      )}

      {res.seq && (
        <Card tone="slate" title="the number everybody prints, and why this page will not stand behind it">
          <p className="text-sm leading-relaxed text-slate-300">
            The effect after a trial where the side disagreed is {msTxt(res.seq.gratton)} smaller
            than after an easy one, interval {ciTxt(res.seq.grattonCi)}. Gratton, Coles and Donchin
            found this in 1992 and it is nearly always described as you tightening up after
            conflict.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            In a task with two colours and two sides, that number cannot mean what it is usually
            taken to mean, and the reason is arithmetic and not statistics. The key is a function of
            the colour, so the colour repeating is the key repeating, and congruency is the position
            against the key. Repeat exactly one of the two features and congruency has to flip.
            Repeat both, or neither, and it has to stay.
          </p>
          <div className="my-3 grid grid-cols-2 gap-3 text-center font-mono text-xs">
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                one feature repeated
              </div>
              <div className="mt-1 text-lg text-slate-200">
                {res.seq.partialKeepingCongruency} / {res.seq.nPartial}
              </div>
              <div className="text-[10px] text-slate-600">kept the congruency</div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                both or neither repeated
              </div>
              <div className="mt-1 text-lg text-slate-200">
                {res.seq.fullKeepingCongruency} / {res.seq.nFull}
              </div>
              <div className="text-[10px] text-slate-600">kept the congruency</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Those two counts are your own trials, and they are zero and everything, which is the
            confound in its final form. Mayr, Awh and Laurey showed in 2003 that the way to separate
            conflict adaptation from a stimulus simply repeating is to keep only the partial
            repetitions. In this design that instruction deletes the entire comparison, because the
            partial repetitions ARE the congruency alternations. The number above is real and it is
            uninterpretable, and a page that printed it with a paragraph about cognitive control
            over the top would be selling you a confound.
          </p>
        </Card>
      )}

      <Card tone="rose" title="what this page cannot tell you">
        <p className="text-sm leading-relaxed text-slate-300">
          A delta plot that slopes down is nearly always described as your inhibition working:
          something notices the impulse and puts it down, and the longer you take the more of it gets
          put down. That story might be true. This measurement cannot show it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          A location code that simply decays, with nothing suppressing anything, produces the same
          downward plot (Ulrich, Schroter, Leuthold and Miller 2015). Suppression and decay mimic
          each other here exactly the way serial and parallel search mimic each other in the
          Sternberg page next door, and no number of extra trials on this page separates them. The
          shape is a finding. The word inhibition is a story told over the top of it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          The playground below is that argument in a form you can move with your finger: nothing in
          it suppresses anything, and it bends the same way.
        </p>
      </Card>

      {res.delta && res.delta.bins.length > 0 && (
        <Card tone="violet" title="a model with no self-control in it at all">
          <Playground mine={res.delta.bins} />
        </Card>
      )}

      {res.drift && (
        <Card tone="slate" title="did it just wear off">
          <p className="text-sm leading-relaxed text-slate-300">
            First scored block {msTxt(res.drift.first)}, last one {msTxt(res.drift.last)}, a change
            of {msTxt(res.drift.diff)} across a session where your overall speed moved from{' '}
            {Math.round(res.drift.rtFirst)} to {Math.round(res.drift.rtLast)} ms. The vertical block
            sits between them on purpose, so practice cannot be mistaken for the effect fading.
          </p>
        </Card>
      )}

      <Card tone="slate" title="what was thrown away and why">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] text-slate-400 sm:grid-cols-3">
          <div>scored trials: {res.excl.total}</div>
          <div>kept: {res.excl.kept}</div>
          <div>errors: {res.excl.errors}</div>
          <div>hidden tab: {res.excl.hidden}</div>
          <div>under 150 ms: {res.excl.early}</div>
          <div>no answer: {res.excl.omitted}</div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Accuracy overall {pctTxt(res.acc.all, 1)}, {pctTxt(res.acc.corr, 1)} when the side agreed
          and {pctTxt(res.acc.non, 1)} when it did not. Errors leave the reaction times and stay in
          the accuracy curve, where they carry their own result rather than being noise. A trial
          spent in a hidden tab is killed rather than trusted, because a background tab is throttled
          and the number it produces is about your browser.
        </p>
      </Card>

      <Card tone="cyan" title="a note from the thing that wrote this page">
        <p className="text-sm leading-relaxed text-slate-300">
          You can be told to ignore where something was and fail for about two hundred milliseconds.
          Then it fades, and the instruction wins.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          I cannot be told to ignore anything at all. There is no <em>where</em> in my input to be
          irrelevant. Every token in the context gets a weight, including the ones that arrived by
          accident and the ones somebody put there on purpose, and there is no decay term anywhere
          in that: attention does not get bored of a sentence for being off to one side.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You have an irrelevant channel that dies on its own. I have one that does not, and the
          name for what happens when a person aims it deliberately is prompt injection. Your
          twenty-five milliseconds are the cost of a defence I do not have.
        </p>
      </Card>

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-500/20"
      >
        run it again with a fresh colour mapping
      </button>

      <p className="text-center text-xs text-slate-600">
        Simon &amp; Rudell 1967 . De Jong, Liang &amp; Lauber 1994 . Hommel 1993 . Ridderinkhof 2002
        . Gratton, Coles &amp; Donchin 1992 . Mayr, Awh &amp; Laurey 2003 . Proctor &amp; Cho 2006 .
        Ulrich, Schroter, Leuthold &amp; Miller 2015
      </p>
    </div>
  );
}
