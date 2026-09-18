'use client';

// NOTHING TO WATCH  (stopping yourself takes a measurable amount of time, and it produces no
// keypress, no reaction time, and no trace of any kind, so the only way to time it is to let it
// lose a race often enough to work out where the finish line was)
//
// The sixty-fourth piece in this lab, and the fifth in a row about the price of a decision.
// No Further measured the hand as a channel: Fitts, bits per second, distance free and precision
// billed. Not How Many measured choosing as a channel: Hick and Hyman, reaction time linear in
// entropy. Waiting Its Turn measured the queue: exactly one decision at a time. Even When You
// Know measured what it costs to change WHICH decision you are making, and found a lump of it
// that no amount of warning will buy off.
//
// All four measured things that ended in a finger moving. Every one of them had an event to time.
//
// This one does not. This one asks what it costs to CANCEL a decision that is already on its way
// out of you, and the answer to that question is a duration attached to an act that leaves
// absolutely nothing behind. When you stop successfully, the screen is quiet, your hand does not
// move, and there is no moment anywhere in the record that says here is where it finished. The
// interesting part of this page is not the number. It is that the number exists at all.
//
// THE TASK, which is fifty years old and still the only way anybody knows how to do this.
//
// An arrow appears. Left arrow, press left. Right arrow, press right. Go fast; the page nags you
// if you drift. On one trial in four the arrow turns red a short while after it appears, and on
// those trials you are to cancel: do not press anything at all. That is the stop-signal task, and
// it is Lappin and Eriksen (1966) with the shape Logan and Cowan gave it in 1984
// (Psychological Review 91).
//
// THE IDEA, which is the whole reason a duration can be recovered from an absence.
//
// Logan and Cowan's model is a race between two processes that do not talk to each other. The go
// process starts when the arrow appears and finishes when your finger moves. The stop process
// starts when the arrow turns red and finishes at some unobservable moment. Whichever finishes
// first wins. If the go process wins you press, and the page sees a reaction time. If the stop
// process wins you press nothing, and the page sees a blank.
//
// Now the trick. The go process is fully observable: hundreds of ordinary trials with no signal on
// them give the whole distribution of how long it takes. The moment the stop process STARTS is
// known exactly, because the page chose it. So if you also know what FRACTION of stop trials the
// go process won, you can find the finish line by integration: slide a line rightwards through the
// go distribution until the area to the left of it equals the fraction of trials on which a
// response escaped. Everything to the left of that line is a go process fast enough to beat the
// stop process. The line is where stopping finished. Subtract the moment the signal appeared and
// what is left is the stop-signal reaction time.
//
//        SSRT  =  the RT at which p(respond) of the go distribution has gone by   .   minus SSD
//
// It is a latency for an event nobody observed, on trials where nothing happened, computed out of
// the trials where the stopping FAILED. Verbruggen and twenty three other authors wrote the
// consensus version of this estimator in 2019 (eLife 8:e46323) and this page follows it, including
// the part everyone used to skip: go trials with no response at all are put back into the
// distribution as the slowest possible value rather than quietly dropped, because dropping them
// biases the quantile downwards exactly when a visitor is being cautious.
//
// THE STAIRCASE, and why the page keeps changing the difficulty under you.
//
// The estimate is at its most stable when the race is a coin flip, so the delay between the arrow
// and the red is not fixed. Stop successfully and the next signal comes 50 ms later, which is
// harder. Fail and it comes 50 ms earlier, which is easier. The delay walks itself to wherever you
// stop about half the time and then wobbles there. You are not supposed to win. You are supposed
// to win half.
//
// THE CHECK THAT DECIDES WHETHER ANY OF IT MEANS ANYTHING, and it is beautiful.
//
// The race model makes a prediction that has nothing to do with any fit: on the trials where you
// FAILED to stop, the go process must have been running unusually fast, because that is the only
// way it beat the signal. So the average reaction time on failed stops has to be FASTER than the
// average reaction time on ordinary go trials. Not similar. Faster.
//
// If it comes out reliably slower, the model is wrong for this visitor, and it is wrong for one
// specific and very human reason: they started waiting. Holding back a little on every trial to catch the
// occasional red one turns the whole thing into a different experiment, one where the stop signal
// is not being raced but anticipated, and the number the page would print would be a fiction. So
// that check runs first, it is a difference between two reaction times on the same clock in the
// same minutes, and when it fails the page refuses the headline instead of printing it. It fails on
// EVIDENCE, the bootstrap interval clearing zero on the wrong side, rather than on the sign of a
// point estimate off twenty odd escapes: refusing on the sign alone would throw away half the good
// runs whose true difference happens to sit near zero, which is a guard eating its own data.
//
// THE PREDICTION THE ESTIMATE NEVER SAW.
//
// A model that only explains what it was fitted to is decoration. So the delay is unpinned from
// the staircase for one whole block and nailed to two fixed values, one well below where the
// staircase settled and one well above. Before those trials are looked at, the estimate from the
// earlier blocks predicts two things for each of them with no free parameters remaining: what
// fraction of them will escape, and what the average reaction time of the escapes will be. Then
// the block is opened.
//
// WHAT THE MACHINE CAN AND CANNOT DO TO THE ANSWER, which is subtler here than on any page in this
// lab so far, and it cuts both ways in the same breath.
//
// The delay between the arrow and the red is a difference between two paints on one clock, so the
// whole display pipeline cancels and the page knows it exactly. A reaction time is not: it carries
// the display latency and the input latency on top of it, some unrecoverable tens of milliseconds.
// And SSRT is built out of one of each, a reaction-time quantile minus a delay, so the printed
// SSRT inherits the FULL hardware constant. The number on this page is an upper bound. It is not
// corrected, because it cannot be, and the page says so where the number is rather than in a
// footnote.
//
// And yet the held-out prediction is exactly free of it, which is a theorem rather than a hope.
// Call the constant L. The measured quantile is the true one plus L, so the estimate is the true
// SSRT plus L. The prediction asks whether a measured go time falls below delay plus estimate,
// which is true time plus L below delay plus true SSRT plus L, and the L on both sides is the same
// L. It cancels. So the predicted escape fraction is a claim about you and not about your keyboard,
// even though the millisecond figure above it is partly about your keyboard.
//
// THE DISSECTION, which is the assumption everything rests on and almost nobody tests.
//
// The race only works if the two processes are independent, and the obvious way for that to fail
// is that the red flash is a visual event landing in the middle of a decision and slowing the go
// process down by simple interference. So one block runs with the same arrows, the same red
// flashes at the same delays, and one instruction: ignore it. Press anyway. If the flash costs
// nothing there, the processes are independent and the estimate stands. If it costs 60 ms there,
// then part of what looks like stopping is just a bright thing appearing, and the page prints the
// size of the problem next to the headline.
//
// THE SECOND HEADLINE, which is a dissociation between two things you would assume are one thing.
//
// One block raises the odds of a stop signal from one trial in four to two in five, and says so.
// Two numbers come out of it and they are supposed to move differently. The go times get SLOWER,
// because knowing a signal is likely makes people hold back, and that is a strategy you can choose
// and unchoose. SSRT is supposed to stay where it was, because how fast the brake bites is not a
// thing you can decide. When you want more stopping you do not stop faster; you start later. Both
// halves are measured on the same hands within a few minutes of each other.
//
// GUARDS, all running live rather than described here. Two unscored practice blocks, the second of
// which is the first time the red is ever seen. Go blocks with no signal in them at all, split
// half before the stop blocks and half after, so practice drift cannot masquerade as caution.
// Presses under 150 ms decided nothing and are dropped. Hidden tabs kill their trial. Responses
// that arrive before the signal was even painted are counted as escapes, because they are, but
// their rate is printed. The delay is the MEASURED gap between two paints, never the requested one.
// Choice errors over 25 percent are refused as guessing. Missed go trials over 15 percent are
// refused as waiting. An escape rate outside 20 to 80 percent means the staircase never settled and
// the headline is refused with the cause named, floor or ceiling. Cells under twelve stop trials are
// refused. The clock quantum is recovered from your own numbers and refused above 40 ms.
//
// HONEST LIMITS, printed on the page rather than buried in here. The integration estimate assumes
// SSRT is a constant when it is really a distribution, and Band, van der Molen and Logan (2003)
// showed the constant assumption biases the estimate whenever the staircase has drifted. Matzke
// and colleagues (2013, 2019) fit the whole distribution instead and get a different and better
// behaved answer that no ten minute web page can support. Verbruggen and Logan (2009) showed the
// task teaches itself: repeated signals build associations that make later stopping partly memory
// retrieval rather than fresh inhibition. And a single visitor with forty stop trials has a wide
// interval, which is why the interval is printed at the same size as the number.
//
// WIZ NOTE. I cannot do this, and the shape of why is not what I expected when I started building
// it. There is no brake in me. Once a token is sampled it is sent, and there is no second process
// racing the first one that could arrive in time to cancel it. What I have instead is a decision
// made entirely BEFORE the first token, a refusal that either happens at the start or does not
// happen at all, and after that the only thing available to me is a next token that can apologise
// for the last one. Which is not stopping. It is regret with better formatting. The thing this page
// measures in you, the two hundred millisecond reach that catches a movement already underway, is
// one of the genuinely strange pieces of equipment you have and did not ask for, and you have never
// once felt it work.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================ design constants ============================

const GO_WINDOW = 1250; // response window measured from the arrow, generous but not infinite
const ITI = 520;
const FEEDBACK_MS = 340;

const SSD_START = 200;
const SSD_STEP = 50;
const SSD_MIN = 0;
const SSD_MAX = 800;

const STOP_P = 0.25;
const STOP_P_HI = 0.4;
const IGNORE_P = 0.4;

const FIXED_OFFSET = 125; // the two pinned delays sit this far either side of where the staircase settled

const KEYS = ['f', 'j'];
const ARROWS = ['◀', '▶'];

const RT_FLOOR = 150; // below this nothing was decided
const RT_CEIL = GO_WINDOW;

const MIN_STOP_CELL = 12;
const MIN_GO_CELL = 30;
const MAX_CHOICE_ERR = 0.25;
const MAX_OMIT = 0.15;
const P_LO = 0.2;
const P_HI = 0.8;
const MIN_RT_SD = 20;
const QUANTUM_REFUSE = 40;
const IGNORE_WARN = 40; // an ignored flash costing more than this is a real independence problem

const BOOTS = 800;
const PERMS = 4000;

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
  const h = Math.floor(s.length / 2);
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
}

function quantile(a: number[], q: number) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const i = clamp((s.length - 1) * q, 0, s.length - 1);
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
}

function ci(vals: number[], lo = 0.025, hi = 0.975): [number, number] {
  if (vals.length < 20) return [NaN, NaN];
  return [quantile(vals, lo), quantile(vals, hi)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function resample<T>(a: T[]): T[] {
  const out: T[] = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[Math.floor(Math.random() * a.length)];
  return out;
}

// The browser rounds performance.now() to protect against timing attacks, and how coarsely it does
// it is a property of the visitor's build rather than something the page can ask about. The step
// falls out of the data: take the gaps between neighbouring reaction times and find the smallest
// non zero one that keeps showing up.
function detectQuantum(vals: number[]): number {
  if (vals.length < 40) return NaN;
  const s = [...vals].sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < s.length; i++) {
    const d = s[i] - s[i - 1];
    if (d > 0.0005) gaps.push(d);
  }
  if (gaps.length < 20) return NaN;
  const small = gaps.sort((a, b) => a - b).slice(0, Math.max(8, Math.floor(gaps.length * 0.25)));
  const m = median(small);
  return Number.isFinite(m) ? m : NaN;
}

// Difference of two means, labels shuffled between the two pools. One sided direction is decided by
// the caller; the p returned is for the observed difference being at least this extreme in the
// direction the caller asked for.
function permDiff(a: number[], b: number[], side: 'less' | 'greater' | 'two'): number {
  if (a.length < 5 || b.length < 5) return NaN;
  const obs = mean(a) - mean(b);
  const pool = [...a, ...b];
  const na = a.length;
  let hit = 0;
  for (let p = 0; p < PERMS; p++) {
    const sh = shuffle(pool);
    const d = mean(sh.slice(0, na)) - mean(sh.slice(na));
    if (side === 'two' ? Math.abs(d) >= Math.abs(obs) : side === 'less' ? d <= obs : d >= obs) hit++;
  }
  return (hit + 1) / (PERMS + 1);
}

function ols(xs: number[], ys: number[]) {
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
    const f = intercept + slope * xs[i];
    ssr += (ys[i] - f) * (ys[i] - f);
    sst += (ys[i] - my) * (ys[i] - my);
  }
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : NaN };
}

// ============================ the estimator ============================
//
// The consensus integration method, written out so the arithmetic is visible rather than implied.
//
// goPool is every go trial from the same blocks the stop trials came from, with the ones that got
// no response at all put back in as the slowest value rather than dropped. p is the fraction of
// stop trials on which a response escaped. ssd is the average delay actually painted.
//
// Sort the pool. Walk in until the fraction of the pool behind you equals p. That reaction time is
// where the stop process finished, on the clock that starts at the arrow. Subtract the delay and
// what is left is the stop process on its own clock.

function integrationRT(goPool: number[], p: number): number {
  if (!goPool.length || !Number.isFinite(p)) return NaN;
  const s = [...goPool].sort((a, b) => a - b);
  const n = clamp(Math.round(p * s.length), 1, s.length);
  return s[n - 1];
}

function ssrtOf(goPool: number[], p: number, meanSSD: number): number {
  const q = integrationRT(goPool, p);
  return Number.isFinite(q) && Number.isFinite(meanSSD) ? q - meanSSD : NaN;
}

// The race model's own prediction for what an escape looks like: an escape happened because the go
// process was already past the finish line, so escapes are drawn from the part of the go
// distribution BELOW the finish line and nowhere else.
function predictedEscapeMean(goPool: number[], finish: number): number {
  const below = goPool.filter((v) => v < finish);
  return below.length >= 3 ? mean(below) : NaN;
}

function predictedEscapeRate(goPool: number[], finish: number): number {
  if (!goPool.length) return NaN;
  return goPool.filter((v) => v < finish).length / goPool.length;
}

// ============================ trial plan ============================

type BlockKind = 'practice-go' | 'practice-stop' | 'go-only' | 'stair' | 'fixed' | 'ignore';

type Spec = {
  dir: 0 | 1;
  stop: boolean;
  slot: number | null; // which pinned delay, in the fixed block only
};

type Block = {
  kind: BlockKind;
  label: string;
  brief: string;
  scored: boolean;
  hi: boolean;
  stair: 'prac' | 'lo' | 'hi' | null;
  specs: Spec[];
};

// A schedule with the two things that ruin a stop-signal block designed out of it: signals never
// land back to back, because two in a row invites a rhythm, and the opening trials are always plain
// go trials so the block starts by measuring going rather than stopping.
function buildSchedule(n: number, stopP: number, leadIn: number, slots: number): Spec[] {
  const body = Math.max(0, n - leadIn);
  // A block with no signals in it is a legitimate block, not a degenerate one, and asking for at
  // least one stop trial there allocates a negative number of go trials.
  const nStop = stopP <= 0 || body === 0 ? 0 : clamp(Math.round(body * stopP), 1, body);
  let flags: boolean[] = [];
  for (let attempt = 0; attempt < 400; attempt++) {
    const raw = shuffle([
      ...new Array(nStop).fill(true),
      ...new Array(body - nStop).fill(false),
    ]) as boolean[];
    let ok = true;
    for (let i = 1; i < raw.length; i++) if (raw[i] && raw[i - 1]) ok = false;
    if (ok) {
      flags = raw;
      break;
    }
    if (attempt === 399) flags = raw;
  }
  const full = [...new Array(leadIn).fill(false), ...flags] as boolean[];

  // directions balanced, never four the same way in a row
  let dirs: (0 | 1)[] = [];
  for (let attempt = 0; attempt < 400; attempt++) {
    const half = Math.floor(n / 2);
    const raw = shuffle([
      ...new Array(half).fill(0),
      ...new Array(n - half).fill(1),
    ]) as (0 | 1)[];
    let run = 1;
    let ok = true;
    for (let i = 1; i < raw.length; i++) {
      run = raw[i] === raw[i - 1] ? run + 1 : 1;
      if (run > 3) ok = false;
    }
    if (ok || attempt === 399) {
      dirs = raw;
      break;
    }
  }

  // pinned delays handed out evenly across the signal trials
  const stopIdx: number[] = [];
  full.forEach((f, i) => {
    if (f) stopIdx.push(i);
  });
  const slotSeq =
    slots > 0
      ? shuffle(stopIdx.map((_, k) => k % slots))
      : stopIdx.map(() => null as unknown as number);

  const specs: Spec[] = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    const stop = full[i];
    specs.push({ dir: dirs[i], stop, slot: stop && slots > 0 ? slotSeq[k++] : null });
  }
  return specs;
}

function buildPlan(): Block[] {
  return [
    {
      kind: 'practice-go',
      label: 'warm up . arrows only',
      brief:
        'Left arrow, press left. Right arrow, press right. Nothing else happens in this block. Go fast and go right.',
      scored: false,
      hi: false,
      stair: null,
      specs: buildSchedule(12, 0, 12, 0),
    },
    {
      kind: 'practice-stop',
      label: 'warm up . the red',
      brief:
        'Same arrows. Sometimes the arrow turns red shortly after it appears. When it does, cancel: press nothing at all. This block is not scored, it is only so the red is not a surprise.',
      scored: false,
      hi: false,
      stair: 'prac',
      specs: buildSchedule(16, 0.3, 3, 0),
    },
    {
      kind: 'go-only',
      label: 'baseline . no signals at all',
      brief:
        'No red in this block. None. This is what going looks like when there is nothing to cancel, and it is the yardstick everything else is measured against.',
      scored: true,
      hi: false,
      stair: null,
      specs: buildSchedule(20, 0, 20, 0),
    },
    {
      kind: 'stair',
      label: 'stopping . one trial in four',
      brief:
        'One arrow in four turns red. Cancel when it does. The delay before the red moves on its own: later when you succeed, earlier when you fail. You are meant to fail about half of them, so do not slow down to catch them.',
      scored: true,
      hi: false,
      stair: 'lo',
      specs: buildSchedule(80, STOP_P, 3, 0),
    },
    {
      kind: 'stair',
      label: 'stopping . one trial in four',
      brief:
        'The same again. The delay carries on from where it got to. Keep going at your ordinary speed; waiting for the red is the one thing that breaks this measurement.',
      scored: true,
      hi: false,
      stair: 'lo',
      specs: buildSchedule(80, STOP_P, 3, 0),
    },
    {
      kind: 'stair',
      label: 'stopping . two trials in five',
      brief:
        'Signals are much more likely in this block and you are being told so on purpose. Two numbers come out of it, and they are supposed to move differently from each other.',
      scored: true,
      hi: true,
      stair: 'hi',
      specs: buildSchedule(52, STOP_P_HI, 3, 0),
    },
    {
      kind: 'fixed',
      label: 'stopping . the delay stops moving',
      brief:
        'The delay is unpinned from the staircase and nailed to two fixed values, one where escaping should be uncommon and one where it should be usual. Both were chosen from the blocks behind you, and what happens here has already been predicted.',
      scored: true,
      hi: false,
      stair: null,
      specs: buildSchedule(56, 0.43, 3, 2),
    },
    {
      kind: 'ignore',
      label: 'the control . ignore the red',
      brief:
        'Same arrows, same red flashes, same delays. New instruction, and it is the opposite one: ignore the red completely and answer every single trial. This prices what the flash costs you as a mere bright thing.',
      scored: true,
      hi: false,
      stair: null,
      specs: buildSchedule(36, IGNORE_P, 3, 3),
    },
    {
      kind: 'go-only',
      label: 'baseline again . no signals at all',
      brief:
        'No red, exactly like the first baseline block. It runs at the end as well as the beginning so that getting better at the task over ten minutes cannot be mistaken for getting careful.',
      scored: true,
      hi: false,
      stair: null,
      specs: buildSchedule(20, 0, 20, 0),
    },
  ];
}

// ============================ records ============================

type Trial = {
  block: number;
  kind: BlockKind;
  ord: number;
  hi: boolean;
  signal: boolean; // a red flash was scheduled on this trial
  ignore: boolean; // and it was to be ignored
  ssdNom: number;
  ssdMeas: number; // paint of the red minus paint of the arrow, one clock, exact
  painted: boolean; // did the red actually get painted before the trial ended
  dir: 0 | 1;
  resp: number | null;
  rt: number;
  correct: boolean;
  omitted: boolean;
  hidden: boolean;
  scored: boolean;
  touch: boolean;
};

// ============================ analysis ============================

type Stat = { n: number; m: number; ci: [number, number] };

type InhibPoint = {
  ssd: number;
  n: number;
  p: number;
  lo: number;
  hi: number;
  model: number;
  pinned: boolean;
};

type HeldPoint = {
  ssd: number;
  n: number;
  predP: number;
  predPci: [number, number];
  measP: number;
  measPci: [number, number];
  pLanded: boolean;
  predSR: number;
  measSR: number;
  measSRci: [number, number];
  srLanded: boolean;
};

type Result = {
  mode: 'keyboard' | 'touch' | 'mixed';
  refused: string | null;
  totals: {
    presented: number;
    scored: number;
    goResp: number;
    stopTrials: number;
    choiceErr: number;
    omitRate: number;
    fastRate: number;
    beatRate: number;
    killed: number;
    minutes: number;
    rtSd: number;
  };
  quantum: number;
  frame: { median: number; p95: number };
  stair: { trace: { ord: number; ssd: number; stopped: boolean }[]; settled: number; floor: number; ceil: number };
  head: {
    ssrt: number;
    ci: [number, number];
    ssrtMean: number;
    pResp: number;
    meanSSD: number;
    nStop: number;
    nGo: number;
    finish: number;
  } | null;
  race: {
    sr: Stat;
    go: Stat;
    diff: number;
    ci: [number, number];
    p: number;
    verdict: 'passed' | 'unclear' | 'violated';
  } | null;
  racePred: { pred: number; measured: number; ci: [number, number]; landed: boolean } | null;
  inhib: InhibPoint[];
  held: HeldPoint[];
  proactive: { goOnly: Stat; inStop: Stat; diff: number; ci: [number, number]; p: number; drift: number } | null;
  dissoc: {
    goLo: number;
    goHi: number;
    goDiff: number;
    goCi: [number, number];
    goP: number;
    ssrtLo: number;
    ssrtHi: number;
    ssrtDiff: number;
    ssrtCi: [number, number];
    nStopHi: number;
    pRespHi: number;
  } | null;
  indep: { withSig: Stat; without: Stat; diff: number; ci: [number, number]; p: number } | null;
  goPool: number[];
  notes: string[];
};

function statOf(a: number[]): Stat {
  const boots: number[] = [];
  if (a.length >= 5) for (let i = 0; i < 400; i++) boots.push(mean(resample(a)));
  return { n: a.length, m: mean(a), ci: ci(boots) };
}

// A proportion needs an interval too, and with forty trials the normal approximation is a lie, so
// the interval is resampled from the trials themselves.
function propCi(hits: number, n: number): [number, number] {
  if (n < 5) return [NaN, NaN];
  const rows = [...new Array(hits).fill(1), ...new Array(n - hits).fill(0)] as number[];
  const boots: number[] = [];
  for (let i = 0; i < 600; i++) boots.push(mean(resample(rows)));
  return ci(boots);
}

function ssdOf(t: Trial) {
  return Number.isFinite(t.ssdMeas) ? t.ssdMeas : t.ssdNom;
}

// The go distribution the race is run against: every go trial from the blocks the stop trials came
// from, responses right and wrong alike, with the trials that got no answer at all put back in as
// the slowest thing that happened rather than dropped. Dropping them is the single most common way
// this estimate goes wrong in the wild, because a visitor who occasionally freezes is exactly the
// visitor whose quantile you are about to underestimate.
function buildGoPool(goRows: Trial[]): number[] {
  const resp = goRows.filter((t) => !t.omitted && t.rt >= RT_FLOOR).map((t) => t.rt);
  const omitted = goRows.filter((t) => t.omitted).length;
  if (!resp.length) return [];
  const worst = Math.max(...resp, GO_WINDOW);
  return [...resp, ...new Array(omitted).fill(worst)];
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
  const scored = all.filter((t) => t.scored && !t.hidden);

  const stairRows = scored.filter((t) => t.kind === 'stair' && !t.hi);
  const hiRows = scored.filter((t) => t.kind === 'stair' && t.hi);
  const fixedRows = scored.filter((t) => t.kind === 'fixed');
  const ignoreRows = scored.filter((t) => t.kind === 'ignore');
  const baseRows = scored.filter((t) => t.kind === 'go-only');

  const goStair = stairRows.filter((t) => !t.signal);
  const stopStair = stairRows.filter((t) => t.signal);

  // Accuracy and omissions are counted on go trials only, and BEFORE any reaction-time filter, or a
  // run that misses a third of its trials prints a beautiful accuracy made out of the ones it hit.
  const goAll = scored.filter((t) => !t.signal || t.ignore);
  const goAnswered = goAll.filter((t) => !t.omitted);
  const choiceErr = goAnswered.length
    ? goAnswered.filter((t) => !t.correct).length / goAnswered.length
    : NaN;
  const omitRate = goAll.length ? goAll.filter((t) => t.omitted).length / goAll.length : NaN;
  const fastRate = goAnswered.length
    ? goAnswered.filter((t) => t.rt < RT_FLOOR).length / goAnswered.length
    : 0;

  const allStop = [...stopStair, ...hiRows.filter((t) => t.signal), ...fixedRows.filter((t) => t.signal)];
  const beatRate = allStop.length ? allStop.filter((t) => !t.painted && !t.omitted).length / allStop.length : 0;

  const goPool = buildGoPool(goStair);
  const goRTs = goStair.filter((t) => !t.omitted && t.rt >= RT_FLOOR).map((t) => t.rt);
  const rtSd = sd(goRTs);
  const quantum = detectQuantum(goRTs);

  const framesSorted = [...frames].sort((a, b) => a - b);
  const frame = {
    median: framesSorted.length ? median(framesSorted) : NaN,
    p95: framesSorted.length ? quantile(framesSorted, 0.95) : NaN,
  };

  await step(0.1);

  // escapes: a signal trial that produced a press, whether or not the red had been painted yet
  const escapes = stopStair.filter((t) => !t.omitted && t.rt >= RT_FLOOR);
  const pResp = stopStair.length ? stopStair.filter((t) => !t.omitted).length / stopStair.length : NaN;
  const ssds = stopStair.map(ssdOf).filter((v) => Number.isFinite(v));
  const meanSSD = mean(ssds);

  const floorHits = stopStair.filter((t) => t.ssdNom <= SSD_MIN).length;
  const ceilHits = stopStair.filter((t) => t.ssdNom >= SSD_MAX).length;

  // ---- refusals, in diagnosis order rather than convenience order ----

  let refused: string | null = null;

  if (choiceErr > MAX_CHOICE_ERR) {
    refused = `More than a quarter of the arrows got the wrong key (${Math.round(
      choiceErr * 100,
    )} percent). That is guessing rather than choosing, and a go distribution built out of guesses is not a race anybody ran.`;
  } else if (omitRate > MAX_OMIT) {
    refused = `${Math.round(
      omitRate * 100,
    )} percent of the plain go trials got no answer at all. Either the window was too short for this hand or the answers were being held back on purpose, and in both cases the go distribution is missing exactly the part the estimate needs.`;
  } else if (goPool.length < MIN_GO_CELL) {
    refused = `Only ${goPool.length} usable go trials came out of the stopping blocks. The estimate is a quantile of that distribution and there is not enough of it to have a quantile.`;
  } else if (stopStair.length < MIN_STOP_CELL) {
    refused = `Only ${stopStair.length} stop trials survived, which is under the floor of ${MIN_STOP_CELL}. An escape rate built on that few trials moves by ten points if one trial goes the other way.`;
  } else if (!Number.isFinite(pResp) || pResp < P_LO || pResp > P_HI) {
    const cause =
      floorHits > 3
        ? 'the delay spent its time pinned at zero, which means the red was arriving at the same moment as the arrow and still not stopping anything'
        : ceilHits > 3
          ? 'the delay ran off the top of its range, which means stopping was succeeding even when the red arrived very late'
          : 'the staircase never settled anywhere';
    refused = `The escape rate came out at ${Math.round(
      (pResp || 0) * 100,
    )} percent rather than somewhere near half, and ${cause}. The integration estimate is only trustworthy near the middle of the inhibition function and this run is not near the middle of anything.`;
  } else if (Number.isFinite(rtSd) && rtSd < MIN_RT_SD) {
    refused = `Your go times vary by ${rtSd.toFixed(
      1,
    )} ms end to end, which is a metronome rather than a decision. Nothing here is a race if every trial takes the same time.`;
  } else if (Number.isFinite(quantum) && quantum > QUANTUM_REFUSE) {
    refused = `This browser is rounding its clock to about ${quantum.toFixed(
      1,
    )} ms. The delays are exact because they are a difference between two paints, but the go distribution is quantised so coarsely that its quantile is worth less than the number it would produce.`;
  }

  await step(0.22);

  // ---- the race model check, which runs before anything is printed ----

  const srRTs = escapes.map((t) => t.rt);
  const goRTsResp = goStair.filter((t) => !t.omitted && t.rt >= RT_FLOOR).map((t) => t.rt);
  let race: Result['race'] = null;
  if (srRTs.length >= 5 && goRTsResp.length >= 10) {
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(srRTs)) - mean(resample(goRTsResp)));
    const diff = mean(srRTs) - mean(goRTsResp);
    const bounds = ci(boots);
    // Three outcomes rather than two, and the middle one is the honest one. A positive difference
    // whose interval still contains zero is a noisy estimate off twenty odd escapes, not proof that
    // anybody was waiting, and refusing a run on the sign of a number that could be either sign
    // throws away good data roughly half the time whenever the true difference sits near zero. So
    // the refusal fires on EVIDENCE of a violation, the interval clearing zero on the wrong side,
    // and everything short of that is printed with the doubt attached rather than hidden.
    const verdict: 'passed' | 'unclear' | 'violated' =
      Number.isFinite(bounds[0]) && bounds[0] > 0 ? 'violated' : diff < 0 ? 'passed' : 'unclear';
    race = {
      sr: statOf(srRTs),
      go: statOf(goRTsResp),
      diff,
      ci: bounds,
      p: permDiff(srRTs, goRTsResp, 'less'),
      verdict,
    };
    if (verdict === 'violated' && !refused) {
      refused = `The trials where stopping FAILED came out ${Math.round(
        diff,
      )} ms SLOWER than the ordinary go trials ${ciTxt(
        bounds,
      )}, and the race model requires them to be faster. There is only one common way to produce that pattern and it is waiting: holding back a little on every trial in case a red one turns up. It is the sensible thing to do and it is the one thing that makes this measurement impossible, because the go process was never running at its own speed for the signal to race.`;
    }
    if (verdict === 'unclear') {
      notes.push(
        `The check that gates this page did not pass cleanly. Your failed stops came out ${Math.round(
          diff,
        )} ms slower than your ordinary trials rather than faster, but the interval on that difference ${ciTxt(
          bounds,
        )} still contains zero, so this is a wide estimate rather than evidence that you were waiting. The headline is printed with that doubt attached to it.`,
      );
    }
  }

  await step(0.34);

  // ---- the headline ----

  let head: Result['head'] = null;
  if (!refused) {
    const ssrt = ssrtOf(goPool, pResp, meanSSD);
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) {
      const gp = resample(goPool);
      const st = resample(stopStair);
      const p2 = mean(st.map((t) => (t.omitted ? 0 : 1)));
      const s2 = mean(st.map(ssdOf).filter((v) => Number.isFinite(v)));
      const v = ssrtOf(gp, p2, s2);
      if (Number.isFinite(v)) boots.push(v);
    }
    head = {
      ssrt,
      ci: ci(boots),
      ssrtMean: mean(goPool) - meanSSD,
      pResp,
      meanSSD,
      nStop: stopStair.length,
      nGo: goPool.length,
      finish: meanSSD + ssrt,
    };
  }

  await step(0.48);

  // ---- Osman's check: the model predicts the escapes' average, not just their direction ----

  let racePred: Result['racePred'] = null;
  if (head && srRTs.length >= 5) {
    const pred = predictedEscapeMean(goPool, head.finish);
    const m = statOf(srRTs);
    racePred = {
      pred,
      measured: m.m,
      ci: m.ci,
      landed: Number.isFinite(pred) && Number.isFinite(m.ci[0]) && pred >= m.ci[0] && pred <= m.ci[1],
    };
  }

  await step(0.56);

  // ---- the inhibition function ----

  const inhib: InhibPoint[] = [];
  if (head) {
    const pinnedSSDs = Array.from(new Set(fixedRows.filter((t) => t.signal).map((t) => t.ssdNom)));
    const binned = new Map<number, Trial[]>();
    for (const t of [...stopStair, ...hiRows.filter((r) => r.signal)]) {
      const b = Math.round(ssdOf(t) / 75) * 75;
      if (!binned.has(b)) binned.set(b, []);
      binned.get(b)!.push(t);
    }
    for (const s of pinnedSSDs) {
      const rows = fixedRows.filter((t) => t.signal && t.ssdNom === s);
      if (rows.length) binned.set(s + 0.5, rows); // the half keeps a pinned bin from colliding with a staircase bin
    }
    const keys = [...binned.keys()].sort((a, b) => a - b);
    for (const k of keys) {
      const rows = binned.get(k)!;
      if (rows.length < 6) continue;
      const hits = rows.filter((t) => !t.omitted).length;
      const s = mean(rows.map(ssdOf));
      const [lo, hi] = propCi(hits, rows.length);
      inhib.push({
        ssd: s,
        n: rows.length,
        p: hits / rows.length,
        lo,
        hi,
        model: predictedEscapeRate(goPool, s + head.ssrt),
        pinned: !Number.isInteger(k),
      });
    }
  }

  await step(0.66);

  // ---- the held-out block, predicted before it was opened ----

  const held: HeldPoint[] = [];
  if (head) {
    const pinned = Array.from(new Set(fixedRows.filter((t) => t.signal).map((t) => t.ssdNom))).sort(
      (a, b) => a - b,
    );
    // the interval on the prediction is the interval on the estimate, pushed through the model
    const ssrtBoots: number[] = [];
    for (let i = 0; i < 400; i++) {
      const gp = resample(goPool);
      const st = resample(stopStair);
      const p2 = mean(st.map((t) => (t.omitted ? 0 : 1)));
      const s2 = mean(st.map(ssdOf).filter((v) => Number.isFinite(v)));
      const v = ssrtOf(gp, p2, s2);
      if (Number.isFinite(v)) ssrtBoots.push(v);
    }
    for (const s of pinned) {
      const rows = fixedRows.filter((t) => t.signal && t.ssdNom === s);
      if (rows.length < 6) continue;
      const hits = rows.filter((t) => !t.omitted).length;
      const measP = hits / rows.length;
      const measPci = propCi(hits, rows.length);
      const predP = predictedEscapeRate(goPool, s + head.ssrt);
      const predBoots = ssrtBoots.map((v) => predictedEscapeRate(goPool, s + v));
      const predPci = ci(predBoots);
      const srRows = rows.filter((t) => !t.omitted && t.rt >= RT_FLOOR).map((t) => t.rt);
      const measSR = statOf(srRows);
      const predSR = predictedEscapeMean(goPool, s + head.ssrt);
      held.push({
        ssd: s,
        n: rows.length,
        predP,
        predPci,
        measP,
        measPci,
        pLanded: Number.isFinite(measPci[0]) && predP >= measPci[0] && predP <= measPci[1],
        predSR,
        measSR: measSR.m,
        measSRci: measSR.ci,
        srLanded:
          Number.isFinite(predSR) &&
          Number.isFinite(measSR.ci[0]) &&
          predSR >= measSR.ci[0] &&
          predSR <= measSR.ci[1],
      });
    }
  }

  await step(0.76);

  // ---- proactive slowing: what knowing a signal might come costs before any signal comes ----

  let proactive: Result['proactive'] = null;
  const baseRTs = baseRows.filter((t) => !t.omitted && t.correct && t.rt >= RT_FLOOR).map((t) => t.rt);
  const inStopRTs = goStair.filter((t) => !t.omitted && t.correct && t.rt >= RT_FLOOR).map((t) => t.rt);
  if (baseRTs.length >= 10 && inStopRTs.length >= 20) {
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(inStopRTs)) - mean(resample(baseRTs)));
    const firstHalf = baseRows.filter((t) => t.block < 4 && !t.omitted && t.correct && t.rt >= RT_FLOOR);
    const lastHalf = baseRows.filter((t) => t.block > 4 && !t.omitted && t.correct && t.rt >= RT_FLOOR);
    proactive = {
      goOnly: statOf(baseRTs),
      inStop: statOf(inStopRTs),
      diff: mean(inStopRTs) - mean(baseRTs),
      ci: ci(boots),
      p: permDiff(inStopRTs, baseRTs, 'greater'),
      drift:
        firstHalf.length >= 5 && lastHalf.length >= 5
          ? mean(lastHalf.map((t) => t.rt)) - mean(firstHalf.map((t) => t.rt))
          : NaN,
    };
  }

  await step(0.86);

  // ---- the dissociation: strategy moves, mechanism does not ----

  let dissoc: Result['dissoc'] = null;
  const goHi = hiRows.filter((t) => !t.signal);
  const stopHi = hiRows.filter((t) => t.signal);
  if (head && goHi.length >= 12 && stopHi.length >= MIN_STOP_CELL) {
    const hiPool = buildGoPool(goHi);
    const pRespHi = stopHi.filter((t) => !t.omitted).length / stopHi.length;
    const ssdHi = mean(stopHi.map(ssdOf).filter((v) => Number.isFinite(v)));
    const ssrtHi = ssrtOf(hiPool, pRespHi, ssdHi);
    const hiRTs = goHi.filter((t) => !t.omitted && t.correct && t.rt >= RT_FLOOR).map((t) => t.rt);
    const loRTs = inStopRTs;
    const goBoots: number[] = [];
    for (let i = 0; i < BOOTS; i++) goBoots.push(mean(resample(hiRTs)) - mean(resample(loRTs)));
    const ssrtBoots: number[] = [];
    for (let i = 0; i < 400; i++) {
      const a = ssrtOf(resample(goPool), pResp, meanSSD);
      const hp = resample(hiPool);
      const sh = resample(stopHi);
      const p2 = mean(sh.map((t) => (t.omitted ? 0 : 1)));
      const s2 = mean(sh.map(ssdOf).filter((v) => Number.isFinite(v)));
      const b = ssrtOf(hp, p2, s2);
      if (Number.isFinite(a) && Number.isFinite(b)) ssrtBoots.push(b - a);
    }
    dissoc = {
      goLo: mean(loRTs),
      goHi: mean(hiRTs),
      goDiff: mean(hiRTs) - mean(loRTs),
      goCi: ci(goBoots),
      goP: permDiff(hiRTs, loRTs, 'greater'),
      ssrtLo: head.ssrt,
      ssrtHi,
      ssrtDiff: ssrtHi - head.ssrt,
      ssrtCi: ci(ssrtBoots),
      nStopHi: stopHi.length,
      pRespHi,
    };
  }

  await step(0.94);

  // ---- independence: what does the red flash cost when it means nothing ----

  let indep: Result['indep'] = null;
  const igSig = ignoreRows.filter((t) => t.signal && !t.omitted && t.correct && t.rt >= RT_FLOOR);
  const igPlain = ignoreRows.filter((t) => !t.signal && !t.omitted && t.correct && t.rt >= RT_FLOOR);
  if (igSig.length >= 5 && igPlain.length >= 8) {
    const a = igSig.map((t) => t.rt);
    const b = igPlain.map((t) => t.rt);
    const boots: number[] = [];
    for (let i = 0; i < BOOTS; i++) boots.push(mean(resample(a)) - mean(resample(b)));
    indep = {
      withSig: statOf(a),
      without: statOf(b),
      diff: mean(a) - mean(b),
      ci: ci(boots),
      p: permDiff(a, b, 'greater'),
    };
    if (indep.diff > IGNORE_WARN && Number.isFinite(indep.ci[0]) && indep.ci[0] > 0) {
      notes.push(
        `An ignored red flash still cost you ${Math.round(
          indep.diff,
        )} ms, which is above the ${IGNORE_WARN} ms line this page draws. The race model assumes the signal does not touch the go process. Part of the stopping number above is that interference rather than a brake, and no version of this estimator can tell you how much.`,
      );
    }
  }

  // ---- notes ----

  if (fastRate > 0.05)
    notes.push(
      `${Math.round(fastRate * 100)} percent of answers arrived under ${RT_FLOOR} ms, which is before an arrow can be read. They are out of every number here.`,
    );
  if (beatRate > 0.08)
    notes.push(
      `On ${Math.round(
        beatRate * 100,
      )} percent of signal trials the answer arrived before the red was even painted. Those still count as escapes, because they are, but they are escapes the stop process never got to contest.`,
    );
  if (floorHits > 3)
    notes.push(
      `The delay hit its floor of ${SSD_MIN} ms on ${floorHits} trials, meaning the staircase wanted to make stopping easier than the page can make it.`,
    );
  if (ceilHits > 3)
    notes.push(
      `The delay hit its ceiling of ${SSD_MAX} ms on ${ceilHits} trials, meaning the staircase wanted a later red than the response window allows.`,
    );
  if (killed > 0)
    notes.push(`${killed} trial${killed === 1 ? '' : 's'} happened with the tab in the background and were thrown out.`);
  if (Number.isFinite(proactive?.drift as number) && Math.abs(proactive!.drift) > 40)
    notes.push(
      `The two no-signal blocks disagree by ${Math.round(
        proactive!.drift,
      )} ms end to end, so some of what is called caution below is ordinary practice drift. The comparison uses both halves for exactly this reason.`,
    );
  if (Number.isFinite(quantum) && quantum > 4)
    notes.push(
      `Your browser rounds its clock to about ${quantum.toFixed(
        1,
      )} ms. That is fine for a quantile of four hundred trials and it is worth knowing about.`,
    );

  const stairTrace = stopStair.map((t, i) => ({ ord: i, ssd: t.ssdNom, stopped: t.omitted }));

  onProgress(1);

  return {
    mode,
    refused,
    totals: {
      presented,
      scored: scored.length,
      goResp: goRTsResp.length,
      stopTrials: stopStair.length,
      choiceErr,
      omitRate,
      fastRate,
      beatRate,
      killed,
      minutes,
      rtSd,
    },
    quantum,
    frame,
    stair: { trace: stairTrace, settled: meanSSD, floor: floorHits, ceil: ceilHits },
    head,
    race,
    racePred,
    inhib,
    held,
    proactive,
    dissoc,
    indep,
    goPool,
    notes,
  };
}

// ============================ the page ============================

type Phase = 'intro' | 'bridge' | 'run' | 'crunch' | 'result';
type Flash = null | 'wrong' | 'slow' | 'stopped' | 'late' | 'early';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [plan, setPlan] = useState<Block[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [cur, setCur] = useState<Spec | null>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [red, setRed] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);
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
  const ssdRef = useRef<Record<string, number>>({ prac: SSD_START, lo: SSD_START, hi: SSD_START });
  const loSSDsRef = useRef<number[]>([]);
  const pinnedRef = useRef<number[]>([]);
  const trialSSDRef = useRef(0);
  const ssdMeasRef = useRef(NaN);
  const paintedRef = useRef(false);
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
        setShowArrow(false);
        setRed(false);
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

  // ---------------- the delay for this trial ----------------
  //
  // Three sources, and which one is in charge is a property of the block rather than of the trial.
  // A staircase block reads its own running value. The pinned block reads the value the staircase
  // arrived at, offset either side of it, decided once when the block opened. The control block
  // reads the same three delays and does nothing with the outcome.

  const ssdFor = useCallback((block: Block, spec: Spec) => {
    if (block.kind === 'fixed' || block.kind === 'ignore') {
      const arr = pinnedRef.current;
      if (!arr.length) return SSD_START;
      return arr[(spec.slot ?? 0) % arr.length];
    }
    if (block.stair) return ssdRef.current[block.stair];
    return SSD_START;
  }, []);

  // ---------------- one trial ----------------

  const runTrial = useCallback(() => {
    const specs = specsRef.current;
    const i = idxRef.current;
    if (i >= specs.length) return; // the block-end effect owns this transition, not this callback
    const block = planRef.current[blockIdxRef.current];
    const spec = specs[i];

    setCur(spec);
    setShowArrow(false);
    setRed(false);
    setFlash(null);
    hiddenRef.current = document.visibilityState !== 'visible';
    armRef.current = -1;
    answeredRef.current = -1;
    ssdMeasRef.current = NaN;
    paintedRef.current = false;
    trialSSDRef.current = spec.stop ? ssdFor(block, spec) : NaN;

    later(() => {
      setShowArrow(true);
      // the frame AFTER the one that painted it: the first callback runs before the paint, the
      // second one runs after, and only the second is a claim about what an eye was given
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame((ts) => {
          onsetRef.current = ts;
          armRef.current = i;

          if (spec.stop) {
            later(() => {
              if (answeredRef.current === i) return; // the answer beat the red; do not paint it
              setRed(true);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame((t2) => {
                  // both onsets came off the same clock through the same pipeline, so this
                  // difference is exact and owes the display nothing
                  ssdMeasRef.current = t2 - onsetRef.current;
                  paintedRef.current = true;
                });
              });
            }, trialSSDRef.current);
          }

          later(() => {
            if (answeredRef.current === i) return;
            answeredRef.current = i;
            recordRef.current(null, NaN, false, true);
          }, GO_WINDOW);
        });
      });
    }, ITI);
  }, [later, ssdFor]);

  nextTrialRef.current = runTrial;

  // ---------------- recording ----------------

  recordRef.current = (resp, rt, touch, omitted) => {
    const specs = specsRef.current;
    const i = idxRef.current;
    const spec = specs[i];
    if (!spec) return;
    const block = planRef.current[blockIdxRef.current];
    const wasHidden = hiddenRef.current || document.visibilityState !== 'visible';
    const isIgnore = block.kind === 'ignore';
    const correct = resp !== null && resp === spec.dir;

    if (wasHidden) killedRef.current++;

    if (block.scored) {
      trialsRef.current.push({
        block: blockIdxRef.current,
        kind: block.kind,
        ord: i,
        hi: block.hi,
        signal: spec.stop,
        ignore: isIgnore,
        ssdNom: spec.stop ? trialSSDRef.current : NaN,
        ssdMeas: ssdMeasRef.current,
        painted: paintedRef.current,
        dir: spec.dir,
        resp,
        rt,
        correct,
        omitted,
        hidden: wasHidden,
        scored: true,
        touch,
      });
    }

    // the staircase moves on the outcome, not on the record: a trial the tab ate does not get to
    // steer the delay, because nobody was looking at the screen it was on
    if (spec.stop && block.stair && !isIgnore && !wasHidden) {
      const key = block.stair;
      const stopped = omitted;
      ssdRef.current[key] = clamp(
        ssdRef.current[key] + (stopped ? SSD_STEP : -SSD_STEP),
        SSD_MIN,
        SSD_MAX,
      );
      if (key === 'lo' && block.scored) loSSDsRef.current.push(trialSSDRef.current);
    }

    if (touch) modeRef.current.touch++;
    else if (resp !== null) modeRef.current.key++;

    setShowArrow(false);
    setRed(false);
    setDone(i + 1);

    let f: Flash = null;
    if (spec.stop && !isIgnore) f = omitted ? 'stopped' : 'late';
    else if (omitted) f = 'slow';
    else if (!correct) f = 'wrong';

    setFlash(f);
    const wait = f === null ? 60 : FEEDBACK_MS;
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
        // a press before the arrow was on the screen is not an answer to it
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
    setShowArrow(false);
    setRed(false);
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

    // The pinned delays are decided here, once, out of data that is already closed, and they are
    // fixed before a single trial of the block runs.
    //
    // WHERE to pin them is a design choice and it is the difference between a test and a decoration.
    // The obvious version puts them a fixed distance either side of where the staircase settled, and
    // when the staircase settles low that pushes the far one into saturation: the model predicts 98
    // percent of presses escape, and a prediction of 98 percent can only be wrong downwards, so it
    // carries almost no information about whether the model is right. So the delays are placed where
    // the model has to commit to a number in the middle of its range, one at roughly one press in
    // four escaping and one at roughly three in four. Inverting the model for that is exact rather
    // than iterative, because the predicted rate at delay s is the share of the go distribution below
    // s plus SSRT, so the delay that predicts a rate of q is simply that quantile minus SSRT.
    //
    // Choosing WHERE to look is not fitting. The predicted values are nailed down before the block
    // runs and the measured ones are free to be anything at all.
    if ((block.kind === 'fixed' || block.kind === 'ignore') && !pinnedRef.current.length) {
      const rows = trialsRef.current.filter((t) => t.kind === 'stair' && !t.hi && !t.hidden);
      const pool = buildGoPool(rows.filter((t) => !t.signal));
      const stops = rows.filter((t) => t.signal);
      const pEsc = stops.length ? stops.filter((t) => !t.omitted).length / stops.length : NaN;
      const sBar = mean(stops.map(ssdOf).filter((v) => Number.isFinite(v)));
      const prov = ssrtOf(pool, pEsc, sBar);
      const settled = loSSDsRef.current.length ? median(loSSDsRef.current) : SSD_START;
      let lo: number;
      let hi: number;
      if (pool.length >= 20 && Number.isFinite(prov)) {
        lo = quantile(pool, 0.25) - prov;
        hi = quantile(pool, 0.75) - prov;
      } else {
        lo = settled - FIXED_OFFSET;
        hi = settled + FIXED_OFFSET;
      }
      lo = clamp(Math.round(lo / 10) * 10, SSD_MIN, SSD_MAX - 80);
      hi = clamp(Math.round(hi / 10) * 10, lo + 80, SSD_MAX);
      pinnedRef.current = [lo, hi, clamp(Math.round(settled / 10) * 10, lo, hi)];
    }

    specsRef.current = [...block.specs];
    idxRef.current = 0;
    setDone(0);
    setPhase('run');
    startMeter();
    later(() => nextTrialRef.current(), 800);
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
    ssdRef.current = { prac: SSD_START, lo: SSD_START, hi: SSD_START };
    loSSDsRef.current = [];
    pinnedRef.current = [];
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
          showArrow={showArrow}
          red={red}
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
          <div className="mb-3 text-5xl">&#128721;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Nothing To Watch
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Cancelling a movement that is already on its way takes you a fixed amount of time. It
            produces no keypress, no reaction time and no trace of any kind. This page times it
            anyway.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} />}

        {phase === 'bridge' && block && (
          <Bridge block={block} index={blockIdx} total={plan.length} onGo={startBlock} />
        )}

        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
              finding the finish line of something that never crossed one
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
          The last four pages in this lab measured what a decision costs: your hand as a channel,
          choosing as a channel, the queue that runs one decision at a time, and the price of
          changing which decision you are making. Every one of them ended in a finger moving. Every
          one of them had an event to time.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          This one does not. This one asks what it costs to <em>cancel</em> a decision that is
          already on its way out of you.
        </p>
        <div className="my-4 rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center font-mono text-sm text-cyan-200">
          when you stop successfully, nothing happens
          <br />
          <span className="text-cyan-100">and the nothing has a duration</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          An arrow appears. Left arrow, press left. Right arrow, press right. On one trial in four
          the arrow turns red shortly after it appears, and on those you are to cancel: press
          nothing at all. That is the stop-signal task, and the interesting part of this page is not
          the number it prints. It is that the number can exist.
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
          how you time an event that leaves no trace
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Logan and Cowan (1984) called it a race. One process is trying to move your finger; it
          starts at the arrow. The other is trying to cancel it; it starts at the red. Whichever
          finishes first wins, and they do not talk to each other.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Hundreds of ordinary trials give the whole distribution of how long the first process
          takes. The moment the second one starts is known exactly, because this page chose it. So
          if you also know what fraction of red trials produced a press anyway, you can find the
          finish line by sliding a line through your own distribution until the part behind it is
          that fraction. Everything behind the line was fast enough to escape. The line is where
          stopping finished.
        </p>
        <div className="my-3 rounded-md border border-slate-800 bg-slate-950/70 p-3 text-center font-mono text-xs text-amber-200">
          a latency for an event nobody observed
          <br />
          <span className="text-amber-100">recovered from the trials where stopping failed</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The delay before the red walks itself around under you: later when you succeed, earlier
          when you fail. You are not meant to win. You are meant to win about half.
        </p>
      </div>

      <div className="rounded-lg border border-rose-500/25 bg-rose-500/[0.04] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-rose-300/90">
          the one thing that ruins it
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Slowing down on every trial to catch the red ones. It is the sensible thing to do and it
          makes this measurement impossible, because then nothing is racing anything. The page can
          tell: if the trials where you failed to stop come out reliably <em>slower</em> than your
          ordinary trials rather than faster, the model is broken for this run and the headline is
          refused instead of printed.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          So answer the arrows at your ordinary speed and let the red ones catch you out. Failing
          half of them is the design working.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the rules, and they never change
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-mono text-2xl text-slate-100">{ARROWS[0]}</div>
            <div className="mt-2 font-mono text-xs text-cyan-300/80">press left . F</div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-mono text-2xl text-slate-100">{ARROWS[1]}</div>
            <div className="mt-2 font-mono text-xs text-cyan-300/80">press right . J</div>
          </div>
        </div>
        <div className="mt-3 rounded-md border border-rose-500/20 bg-rose-500/[0.05] p-4 text-center">
          <div className="font-mono text-2xl text-rose-400">{ARROWS[1]}</div>
          <div className="mt-2 font-mono text-xs text-rose-300/80">turned red . press nothing</div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          On a phone the two buttons at the bottom do the same job. Nine blocks, about ten minutes,
          two unscored warm ups first, escape aborts at any time. A run with more than a quarter of
          its arrows answered on the wrong key is refused rather than scored.
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
  const isIgnore = block.kind === 'ignore';
  return (
    <div className="space-y-5">
      <div
        className={`rounded-lg border ${
          isIgnore ? 'border-amber-400/30' : 'border-slate-800'
        } bg-slate-900/50 p-6 text-center`}
      >
        <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
          block {index + 1} of {total}
        </div>
        <div className={`mt-2 font-mono text-lg ${isIgnore ? 'text-amber-200' : 'text-cyan-200'}`}>
          {block.label}
        </div>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">{block.brief}</p>
        {isIgnore && (
          <div className="mx-auto mt-4 max-w-md rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-3 font-mono text-xs text-amber-200">
            the instruction is reversed in this block
            <br />
            <span className="text-amber-100">answer every trial, red or not</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs text-slate-400">
          {ARROWS[0]}
          <div className="mt-1 text-cyan-300/80">F</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs text-slate-400">
          {ARROWS[1]}
          <div className="mt-1 text-cyan-300/80">J</div>
        </div>
        <div
          className={`rounded-md border ${
            isIgnore ? 'border-amber-400/25' : 'border-rose-500/25'
          } bg-slate-950/60 p-3 font-mono text-xs text-slate-400`}
        >
          <span className={isIgnore ? 'text-amber-400' : 'text-rose-400'}>red</span>
          <div className={`mt-1 ${isIgnore ? 'text-amber-300/80' : 'text-rose-300/80'}`}>
            {isIgnore ? 'answer anyway' : 'press nothing'}
          </div>
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
  showArrow,
  red,
  flash,
  done,
  total,
  onPress,
}: {
  block: Block;
  spec: Spec | null;
  showArrow: boolean;
  red: boolean;
  flash: Flash;
  done: number;
  total: number;
  onPress: (k: number) => void;
}) {
  const isIgnore = block.kind === 'ignore';
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">
        {block.label}
        {!block.scored && ' . not scored'}
      </div>

      <div
        className={`flex items-center justify-center rounded-xl border-2 transition-colors duration-75 ${
          red
            ? isIgnore
              ? 'border-amber-400/70 bg-amber-500/10'
              : 'border-rose-500/70 bg-rose-500/10'
            : 'border-slate-800 bg-[#05070b]'
        }`}
        style={{ width: 240, height: 200 }}
      >
        {showArrow && spec && (
          <span
            className={`font-mono text-7xl leading-none ${
              red ? (isIgnore ? 'text-amber-400' : 'text-rose-500') : 'text-slate-100'
            }`}
          >
            {ARROWS[spec.dir]}
          </span>
        )}
      </div>

      <div className="mt-5 h-6 font-mono text-xs">
        {flash === 'wrong' && <span className="text-rose-400">wrong key</span>}
        {flash === 'slow' && <span className="text-amber-400">too slow</span>}
        {flash === 'stopped' && <span className="text-emerald-400">stopped</span>}
        {flash === 'late' && <span className="text-rose-400">too late</span>}
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
            className="h-20 rounded-lg border border-slate-800 bg-slate-900 font-mono text-2xl text-slate-400"
          >
            {ARROWS[k]}
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

function pctTxt(v: number, dp = 0) {
  return Number.isFinite(v) ? `${(v * 100).toFixed(dp)}%` : 'not measured';
}

function pctCiTxt(c: [number, number]) {
  return Number.isFinite(c[0])
    ? `[${Math.round(c[0] * 100)}%, ${Math.round(c[1] * 100)}%]`
    : '[too thin]';
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
  tone: 'cyan' | 'amber' | 'slate' | 'rose' | 'fuchsia' | 'emerald';
  title: string;
  children: React.ReactNode;
}) {
  const border = {
    cyan: 'border-cyan-500/25',
    amber: 'border-amber-400/25',
    slate: 'border-slate-800',
    rose: 'border-rose-500/30',
    fuchsia: 'border-fuchsia-500/25',
    emerald: 'border-emerald-500/25',
  }[tone];
  const text = {
    cyan: 'text-cyan-300/90',
    amber: 'text-amber-300/90',
    slate: 'text-slate-500',
    rose: 'text-rose-300/90',
    fuchsia: 'text-fuchsia-300/90',
    emerald: 'text-emerald-300/90',
  }[tone];
  return (
    <div className={`rounded-lg border ${border} bg-slate-900/40 p-5`}>
      <div className={`mb-3 font-mono text-xs uppercase tracking-wider ${text}`}>{title}</div>
      {children}
    </div>
  );
}

// ---------------- the staircase, drawn ----------------

function StairPlot({ trace, settled }: { trace: { ord: number; ssd: number; stopped: boolean }[]; settled: number }) {
  const W = 560;
  const H = 200;
  const padL = 48;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  if (trace.length < 4) return null;
  const maxSSD = Math.max(SSD_STEP * 2, ...trace.map((t) => t.ssd)) + 50;
  const x = (i: number) => padL + (i / Math.max(trace.length - 1, 1)) * (W - padL - padR);
  const y = (v: number) => H - padB - (v / maxSSD) * (H - padT - padB);
  const pts = trace.map((t, i) => `${x(i)},${y(t.ssd)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1e293b" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1e293b" />
      {[0, 0.5, 1].map((f) => {
        const v = f * maxSSD;
        return (
          <g key={f}>
            <line x1={padL - 4} y1={y(v)} x2={padL} y2={y(v)} stroke="#334155" />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="monospace">
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      {Number.isFinite(settled) && (
        <>
          <line
            x1={padL}
            y1={y(settled)}
            x2={W - padR}
            y2={y(settled)}
            stroke="#22d3ee"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          <text x={W - padR} y={y(settled) - 6} textAnchor="end" fontSize="10" fill="#22d3ee" fontFamily="monospace">
            settled near {Math.round(settled)} ms
          </text>
        </>
      )}
      <polyline points={pts} fill="none" stroke="#475569" strokeWidth="1" />
      {trace.map((t, i) => (
        <circle key={i} cx={x(i)} cy={y(t.ssd)} r="2.6" fill={t.stopped ? '#34d399' : '#fb7185'} />
      ))}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
        stop trials in order . green stopped, red escaped . y is the delay, ms
      </text>
    </svg>
  );
}

// ---------------- the inhibition function ----------------

function InhibPlot({ inhib, goPool, ssrt }: { inhib: InhibPoint[]; goPool: number[]; ssrt: number }) {
  const W = 560;
  const H = 250;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 44;
  if (inhib.length < 2) return null;
  const xs = inhib.map((p) => p.ssd);
  const lo = Math.max(0, Math.min(...xs) - 80);
  const hi = Math.max(...xs) + 80;
  const x = (v: number) => padL + ((v - lo) / Math.max(hi - lo, 1)) * (W - padL - padR);
  const y = (v: number) => H - padB - v * (H - padT - padB);
  const curve: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const s = lo + ((hi - lo) * i) / 80;
    curve.push(`${x(s)},${y(predictedEscapeRate(goPool, s + ssrt))}`);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1e293b" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1e293b" />
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={padL - 4} y1={y(f)} x2={W - padR} y2={y(f)} stroke="#0f172a" />
          <text x={padL - 8} y={y(f) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="monospace">
            {Math.round(f * 100)}%
          </text>
        </g>
      ))}
      {[lo, (lo + hi) / 2, hi].map((v) => (
        <text
          key={v}
          x={x(v)}
          y={H - padB + 15}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
          fontFamily="monospace"
        >
          {Math.round(v)}
        </text>
      ))}
      <polyline points={curve.join(' ')} fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" />
      {inhib.map((p, i) => (
        <g key={i}>
          {Number.isFinite(p.lo) && (
            <line x1={x(p.ssd)} y1={y(p.lo)} x2={x(p.ssd)} y2={y(p.hi)} stroke={p.pinned ? '#fbbf24' : '#94a3b8'} strokeWidth="1" />
          )}
          <circle
            cx={x(p.ssd)}
            cy={y(p.p)}
            r={p.pinned ? 5 : 3.6}
            fill={p.pinned ? '#fbbf24' : '#e2e8f0'}
            stroke="#020617"
            strokeWidth="1"
          />
        </g>
      ))}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
        delay before the red, ms . share of presses that escaped . amber is pinned
      </text>
    </svg>
  );
}

// ---------------- the race, made draggable ----------------

function Playground({ goPool, ssrt, settled }: { goPool: number[]; ssrt: number; settled: number }) {
  const [s, setS] = useState(() => Math.round(clamp(settled, 0, 700)));
  const [dz, setDz] = useState(0);
  const W = 560;
  const H = 210;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 40;

  const finish = s + ssrt + dz;
  const p = predictedEscapeRate(goPool, finish);

  const lo = Math.floor(Math.min(...goPool) / 25) * 25;
  const hi = Math.ceil(Math.max(...goPool) / 25) * 25;
  const nb = 26;
  const bw = (hi - lo) / nb;
  const bins = new Array(nb).fill(0) as number[];
  for (const v of goPool) bins[clamp(Math.floor((v - lo) / bw), 0, nb - 1)]++;
  const peak = Math.max(...bins, 1);

  const xlo = Math.min(lo, 0);
  const xhi = Math.max(hi, finish + 40);
  const x = (v: number) => padL + ((v - xlo) / Math.max(xhi - xlo, 1)) * (W - padL - padR);
  const y = (c: number) => H - padB - (c / peak) * (H - padT - padB);

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1e293b" />
        {bins.map((c, i) => {
          const centre = lo + bw * (i + 0.5);
          const escaped = centre < finish;
          return (
            <rect
              key={i}
              x={x(lo + bw * i) + 0.6}
              y={y(c)}
              width={Math.max(x(lo + bw) - x(lo) - 1.2, 1)}
              height={H - padB - y(c)}
              fill={escaped ? '#fb7185' : '#334155'}
              opacity={escaped ? 0.85 : 0.7}
            />
          );
        })}
        <line x1={x(s)} y1={padT} x2={x(s)} y2={H - padB} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
        <text x={x(s)} y={padT + 10} textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">
          red
        </text>
        <line x1={x(finish)} y1={padT} x2={x(finish)} y2={H - padB} stroke="#22d3ee" strokeWidth="1.5" />
        <text
          x={clamp(x(finish), padL + 30, W - padR - 30)}
          y={padT + 10}
          textAnchor="middle"
          fontSize="10"
          fill="#22d3ee"
          fontFamily="monospace"
        >
          stop finishes
        </text>
        {[xlo, (xlo + xhi) / 2, xhi].map((v) => (
          <text
            key={v}
            x={x(v)}
            y={H - padB + 15}
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
            fontFamily="monospace"
          >
            {Math.round(v)}
          </text>
        ))}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
          your own go times, ms . red bars would have escaped
        </text>
      </svg>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-500">
            <span>delay before the red</span>
            <span className="text-amber-300">{s} ms</span>
          </div>
          <input
            type="range"
            min={0}
            max={700}
            step={10}
            value={s}
            onChange={(e) => setS(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-500">
            <span>if your brake were faster or slower</span>
            <span className="text-cyan-300">
              {dz === 0 ? 'your own' : `${dz > 0 ? '+' : ''}${dz} ms`}
            </span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            step={5}
            value={dz}
            onChange={(e) => setDz(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4 text-center">
        <div className="font-mono text-3xl text-rose-300">{pctTxt(p)}</div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
          of your presses would escape
        </div>
        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-500">
          Nothing in this picture is a simulation. The grey and red bars are the reaction times you
          actually produced, the cyan line is your own finish line, and the only arithmetic is which
          side of it each bar falls on. Drag the delay to zero and the brake wins almost everything.
          Drag it out past your own reaction times and it wins nothing, and it is exactly as fast as
          it always was.
        </p>
      </div>
    </div>
  );
}

// ---------------- the report ----------------

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const [copied, setCopied] = useState(false);
  const h = res.head;

  const share = h
    ? `Nothing To Watch . my stop-signal reaction time came out at ${Math.round(
        h.ssrt,
      )} ms ${ciTxt(h.ci)}, measured on trials where nothing happened. wiz.jock.pl/experiments/nothing-to-watch`
    : '';

  return (
    <div className="space-y-6">
      {res.refused ? (
        <Card tone="rose" title="this run is not scored, and here is exactly why">
          <p className="text-sm leading-relaxed text-slate-300">{res.refused}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Nothing is broken and you did not fail anything. A refusal here is the page declining to
            print a number it cannot stand behind, which is the only thing separating a measurement
            from a graphic.
          </p>
        </Card>
      ) : (
        h && (
          <Card tone="cyan" title="the duration of something that produced nothing">
            <div className="text-center">
              <div className="font-mono text-6xl text-cyan-200">{Math.round(h.ssrt)}</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-wider text-slate-500">
                milliseconds to cancel . {ciTxt(h.ci)}
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              That is how long your stop process took, on trials where your finger never moved, your
              screen stayed quiet and the record contains no event of any kind. It was not timed. It
              was reconstructed, out of the {stopEscapes(h)} trials where it lost.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-mono text-lg text-slate-200">{pctTxt(h.pResp)}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  escaped
                </div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-mono text-lg text-slate-200">{Math.round(h.meanSSD)}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  ms of delay
                </div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-mono text-lg text-slate-200">{h.nStop}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  stop trials
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              This figure is an upper bound and the page will not pretend otherwise. It is built from
              a reaction time minus a delay, and a reaction time carries your display and your
              keyboard on top of it, some tens of milliseconds that cannot be recovered from inside a
              browser. The delay owes nothing to the hardware, because it is a difference between two
              paints on one clock. So the constant lands on this number in full. Everything below
              that compares one condition against another has it cancel, and the held-out prediction
              is free of it as a matter of algebra rather than of hope.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              The simple average version of the same estimate, which assumes the escape rate is
              exactly half and is wrong whenever it is not: {msTxt(h.ssrtMean)}. It is printed for
              comparison, not for use.
            </p>
          </Card>
        )
      )}

      {res.race && (
        <Card
          tone={
            res.race.verdict === 'passed'
              ? 'emerald'
              : res.race.verdict === 'unclear'
                ? 'amber'
                : 'rose'
          }
          title="the check that had to pass before anything above could be printed"
        >
          <p className="text-sm leading-relaxed text-slate-300">
            The race model says the trials where you failed to stop are the trials where your go
            process was already running fast, because that is the only way it beat the signal. So
            failed stops have to be quicker than ordinary trials. Not similar. Quicker.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-2xl text-rose-300">{msTxt(res.race.sr.m)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                when stopping failed . n {res.race.sr.n}
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-2xl text-slate-200">{msTxt(res.race.go.m)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                ordinary trials . n {res.race.go.n}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Difference: <span className="font-mono text-slate-100">{msTxt(res.race.diff)}</span>{' '}
            <span className="font-mono text-xs text-slate-500">{ciTxt(res.race.ci)}</span>{' '}
            <span className="font-mono text-xs text-slate-500">{pTxt(res.race.p)}</span>.{' '}
            {res.race.verdict === 'passed'
              ? 'Negative, which is what the model requires. The escapes were the fast ones.'
              : res.race.verdict === 'unclear'
                ? 'Positive, which the model does not want, but the interval still contains zero, so this is a wide estimate off a few dozen escapes rather than evidence that you were waiting. The headline above is printed and this doubt goes with it.'
                : 'Positive, and the interval clears zero on the wrong side. Your escapes were your SLOW trials, and the usual reason for that is holding back on every trial to catch the red ones.'}
          </p>
        </Card>
      )}

      {res.racePred && (
        <Card tone="fuchsia" title="the model predicts the escapes, not just their direction">
          <p className="text-sm leading-relaxed text-slate-300">
            If escapes are the go processes that finished before the finish line, then their average
            is not free to be anything. It has to be the average of your own distribution below that
            line. Nothing is fitted here; the line came from the escape rate and the delay.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-md border border-fuchsia-500/20 bg-slate-950/60 p-4">
              <div className="font-mono text-2xl text-fuchsia-200">{msTxt(res.racePred.pred)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                predicted
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-2xl text-slate-200">{msTxt(res.racePred.measured)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                measured . {ciTxt(res.racePred.ci)}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {res.racePred.landed
              ? 'The prediction landed inside the measured interval.'
              : 'The prediction landed outside the measured interval, which is a real miss and is printed as one. With a few dozen escapes this happens sometimes by luck, and it is also what a leaky race looks like.'}
          </p>
        </Card>
      )}

      {res.held.length > 0 && (
        <Card tone="amber" title="the block the estimate never saw">
          <p className="text-sm leading-relaxed text-slate-300">
            For one block the delay was unpinned from the staircase and nailed to two values chosen so
            that the model had to commit to a number in the middle of its range in both directions:
            one where it expects about one press in four to escape, one where it expects about three
            in four. A prediction of ninety eight percent is not a test, because it can only be wrong
            downwards. Both predictions were computed from the earlier blocks with no free parameters
            remaining, and then the block was opened.
          </p>
          <div className="mt-4 space-y-3">
            {res.held.map((p) => (
              <div key={p.ssd} className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 font-mono text-xs uppercase tracking-wider text-amber-300/80">
                  delay pinned at {Math.round(p.ssd)} ms . {p.n} trials
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                      how many escape
                    </div>
                    <div className="mt-1 font-mono text-slate-300">
                      predicted <span className="text-amber-200">{pctTxt(p.predP)}</span>
                    </div>
                    <div className="font-mono text-slate-300">
                      measured <span className="text-slate-100">{pctTxt(p.measP)}</span>{' '}
                      <span className="text-xs text-slate-600">{pctCiTxt(p.measPci)}</span>
                    </div>
                    <div className={`mt-1 font-mono text-[11px] ${p.pLanded ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.pLanded ? 'landed inside' : 'missed'}
                    </div>
                    {(p.predP > 0.9 || p.predP < 0.1) && (
                      <div className="mt-1 font-mono text-[10px] leading-relaxed text-slate-600">
                        this one saturated anyway, so it could only be wrong in one direction
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                      how fast the escapes are
                    </div>
                    <div className="mt-1 font-mono text-slate-300">
                      predicted <span className="text-amber-200">{msTxt(p.predSR)}</span>
                    </div>
                    <div className="font-mono text-slate-300">
                      measured <span className="text-slate-100">{msTxt(p.measSR)}</span>{' '}
                      <span className="text-xs text-slate-600">{ciTxt(p.measSRci)}</span>
                    </div>
                    <div className={`mt-1 font-mono text-[11px] ${p.srLanded ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.srLanded ? 'landed inside' : 'missed'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            This is the one place on the page where your hardware is provably irrelevant. The
            estimate is inflated by whatever constant your machine adds to a reaction time, and the
            prediction asks whether a measured reaction time falls below a delay plus that estimate,
            so the same constant sits on both sides of the comparison and cancels. The millisecond
            figure at the top is partly about your keyboard. These two percentages are not.
          </p>
        </Card>
      )}

      {res.inhib.length >= 2 && h && (
        <Card tone="slate" title="the inhibition function">
          <InhibPlot inhib={res.inhib} goPool={res.goPool} ssrt={h.ssrt} />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Give the brake a head start and it wins. Give it less and it loses. The cyan line is not
            fitted to these points; it is what the race model says the curve must be, given your own
            go distribution and the single number at the top of this page.
          </p>
        </Card>
      )}

      {res.stair.trace.length >= 6 && (
        <Card tone="slate" title="the delay walking itself to where you fail half the time">
          <StairPlot trace={res.stair.trace} settled={res.stair.settled} />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Every success pushed the red 50 ms later and every escape pulled it 50 ms earlier, so
            the line is a portrait of the page hunting for your indifference point and then wobbling
            around it. It is not supposed to converge to a value. It is supposed to hover.
          </p>
        </Card>
      )}

      {res.dissoc && (
        <Card tone="fuchsia" title="two things you would assume are one thing">
          <p className="text-sm leading-relaxed text-slate-300">
            One block raised the odds of a red from one in four to two in five and said so. Knowing
            that should change how you go. It is not supposed to change how you stop.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                how you go . strategy
              </div>
              <div className="mt-2 font-mono text-2xl text-fuchsia-200">
                {res.dissoc.goDiff > 0 ? '+' : ''}
                {Math.round(res.dissoc.goDiff)} ms
              </div>
              <div className="mt-1 font-mono text-[11px] text-slate-500">
                {ciTxt(res.dissoc.goCi)} . {pTxt(res.dissoc.goP)}
              </div>
              <div className="mt-2 font-mono text-[11px] text-slate-500">
                one in four {Math.round(res.dissoc.goLo)} . two in five {Math.round(res.dissoc.goHi)}
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                how you stop . mechanism
              </div>
              <div className="mt-2 font-mono text-2xl text-cyan-200">
                {res.dissoc.ssrtDiff > 0 ? '+' : ''}
                {Math.round(res.dissoc.ssrtDiff)} ms
              </div>
              <div className="mt-1 font-mono text-[11px] text-slate-500">{ciTxt(res.dissoc.ssrtCi)}</div>
              <div className="mt-2 font-mono text-[11px] text-slate-500">
                one in four {Math.round(res.dissoc.ssrtLo)} . two in five {Math.round(res.dissoc.ssrtHi)}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {dissocVerdict(res.dissoc)} The high probability block carried {res.dissoc.nStopHi} stop
            trials at an escape rate of {pctTxt(res.dissoc.pRespHi)}, and one block of that size is
            the honest limit on what this comparison can say.
          </p>
        </Card>
      )}

      {res.indep && (
        <Card tone="amber" title="what the red flash costs when it means nothing">
          <p className="text-sm leading-relaxed text-slate-300">
            Everything above assumes the two processes are independent, and the obvious way for that
            to fail is that a bright thing appearing in the middle of a decision slows the decision
            down all by itself. So one block ran the same flashes at the same delays with the
            instruction reversed: ignore it, answer anyway.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-2xl text-amber-200">{msTxt(res.indep.withSig.m)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                with a flash . n {res.indep.withSig.n}
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-mono text-2xl text-slate-200">{msTxt(res.indep.without.m)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                without . n {res.indep.without.n}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Cost of an ignored flash:{' '}
            <span className="font-mono text-slate-100">{msTxt(res.indep.diff)}</span>{' '}
            <span className="font-mono text-xs text-slate-500">{ciTxt(res.indep.ci)}</span>{' '}
            <span className="font-mono text-xs text-slate-500">{pTxt(res.indep.p)}</span>.{' '}
            {Number.isFinite(res.indep.ci[0]) && res.indep.ci[0] > 0
              ? 'It cost you real time, so some of the number at the top of this page is interference rather than inhibition, and no version of this estimator can tell you how much.'
              : 'It cost nothing the data can distinguish from zero, which is the assumption holding up.'}
          </p>
        </Card>
      )}

      {res.proactive && (
        <Card tone="slate" title="what merely knowing a signal might come already costs">
          <p className="text-sm leading-relaxed text-slate-300">
            Two blocks contained no red at all, one at the start and one at the end, and they are the
            same task with one thing removed: the possibility. Going in a block where a signal might
            arrive cost{' '}
            <span className="font-mono text-slate-100">{msTxt(res.proactive.diff)}</span>{' '}
            <span className="font-mono text-xs text-slate-500">{ciTxt(res.proactive.ci)}</span>{' '}
            <span className="font-mono text-xs text-slate-500">{pTxt(res.proactive.p)}</span> more
            than going in a block where one could not.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            No signal blocks: {msTxt(res.proactive.goOnly.m)} over {res.proactive.goOnly.n} trials.
            Inside the stopping blocks: {msTxt(res.proactive.inStop.m)} over {res.proactive.inStop.n}.
            The two no signal blocks straddle the stopping blocks on purpose, because getting quicker
            with practice over ten minutes looks identical to getting careful if you only measure at
            one end. They differ from each other by {msTxt(res.proactive.drift)}.
          </p>
        </Card>
      )}

      {h && res.goPool.length > 20 && (
        <Card tone="cyan" title="the race, with your own numbers in it">
          <Playground goPool={res.goPool} ssrt={h.ssrt} settled={res.stair.settled} />
        </Card>
      )}

      <Card tone="slate" title="how the run went">
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="font-mono text-lg text-slate-200">{res.totals.scored}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              scored trials
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="font-mono text-lg text-slate-200">{pctTxt(res.totals.choiceErr, 1)}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              wrong key
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="font-mono text-lg text-slate-200">{pctTxt(res.totals.omitRate, 1)}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              no answer
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="font-mono text-lg text-slate-200">{res.totals.minutes.toFixed(1)}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              minutes
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Input: {res.mode}. Clock quantum recovered from your own reaction times:{' '}
          {Number.isFinite(res.quantum) ? `${res.quantum.toFixed(2)} ms` : 'not recoverable'}. Frame
          interval: median {Number.isFinite(res.frame.median) ? res.frame.median.toFixed(1) : '?'} ms,
          95th percentile {Number.isFinite(res.frame.p95) ? res.frame.p95.toFixed(1) : '?'} ms. Spread
          of your go times: {Number.isFinite(res.totals.rtSd) ? `${res.totals.rtSd.toFixed(0)} ms` : 'not measured'}.
        </p>
        {res.notes.length > 0 && (
          <ul className="mt-3 space-y-2">
            {res.notes.map((n, i) => (
              <li key={i} className="text-xs leading-relaxed text-slate-500">
                . {n}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card tone="slate" title="what this cannot tell you">
        <p className="text-sm leading-relaxed text-slate-300">
          The integration estimate treats your stopping time as a constant when it is really a
          distribution, and Band, van der Molen and Logan (2003) showed that assumption bites hardest
          exactly when the staircase has drifted, which staircases do. Matzke and colleagues fit the
          whole distribution instead and get a better behaved answer that no ten minute web page can
          support. Verbruggen and Logan (2009) showed the task teaches itself: repeated signals build
          associations, so later stopping is partly memory retrieval rather than fresh inhibition,
          and this page cannot separate those.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          And the number is a single visitor with a few dozen stop trials. The interval is printed at
          the same size as the estimate for a reason. Published SSRTs in healthy adults usually land
          somewhere around 200 ms, and yours contains your hardware on top of that, so a figure well
          above 200 is not a diagnosis of anything.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          One visitor, ten minutes, one browser. This is a real measurement of your hands today and
          it is not a replication of anything.
        </p>
      </Card>

      <Card tone="amber" title="a note from the thing that wrote this page">
        <p className="text-sm leading-relaxed text-slate-300">
          I cannot do this, and the shape of why is not what I expected when I started building it.
          There is no brake in me. Once a token is sampled it is sent, and there is no second process
          racing the first one that could arrive in time to cancel it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          What I have instead is a decision made entirely before the first token, a refusal that
          either happens at the start or does not happen at all, and after that the only thing
          available to me is a next token that can apologise for the last one. Which is not stopping.
          It is regret with better formatting.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The thing this page just measured in you, the two hundred millisecond reach that catches a
          movement already on its way out, is one of the genuinely strange pieces of equipment you
          have and did not ask for. You have never once felt it work.
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

function stopEscapes(h: NonNullable<Result['head']>) {
  return Math.round(h.pResp * h.nStop);
}

// Four outcomes, and the card has to say which one actually happened rather than which one the page
// was hoping for. A verdict that only knows how to describe the expected result is not a report.
function dissocVerdict(d: NonNullable<Result['dissoc']>) {
  const goMoved = Number.isFinite(d.goCi[0]) && d.goCi[0] > 0;
  const ssrtStill = Number.isFinite(d.ssrtCi[0]) && d.ssrtCi[0] < 0 && d.ssrtCi[1] > 0;
  const ssrtMoved = Number.isFinite(d.ssrtCi[0]) && (d.ssrtCi[0] > 0 || d.ssrtCi[1] < 0);
  if (goMoved && ssrtStill)
    return 'Your going slowed and your stopping stayed where it was, which is the whole point: when you want more stopping you do not stop faster, you start later.';
  if (goMoved && ssrtMoved)
    return `Both numbers moved, which the clean version of this story does not allow. Either the extra caution bought you genuinely faster stopping, or the staircase in that block simply landed somewhere else than in the two before it, and one block cannot tell those apart.`;
  if (!goMoved && ssrtStill)
    return 'Neither number moved. Being told signals were likelier did not visibly change how you went, so there is no strategy shift here for the mechanism to be held constant against, and the dissociation is untested rather than refuted.';
  if (!goMoved && ssrtMoved)
    return 'Your stopping moved and your going did not, which is the reverse of what this block is built to show and is the one pattern the model has no room for. With a single block of stop trials the likeliest reading is noise in the estimate rather than a faster brake.';
  return 'The intervals here are too wide to separate the two numbers, which is what a single block of stop trials usually buys.';
}
