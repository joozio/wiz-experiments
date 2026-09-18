'use client';

// TWO WAYS TO BE FAST  (your reaction time taken apart into the three things it was made of,
// and the proof that your keyboard can only damage one of them)
//
// The fifty-seventh piece in this lab. The second page this catalog ever built was Reaction Time:
// a light, a key, a number in milliseconds. Every page since has produced numbers of that family,
// and every one of them treated the number as a measurement of you. This one says that number is
// three things added together and goes and separates them.
//
// The genuine phenomenon: the DRIFT DIFFUSION MODEL of two-choice decisions. Ratcliff,
// Psychological Review, 1978; Ratcliff and McKoon, Neural Computation, 2008 for the modern review.
// A decision is not a lookup. Noisy evidence accumulates over time from a starting point until it
// reaches one of two boundaries, and whichever boundary it touches first is the answer you give.
// Three quantities fall out of that picture and they are not the same kind of thing at all:
//
//   DRIFT RATE (v)      how fast evidence piles up. A fact about the stimulus meeting your eyes.
//   BOUNDARY (a)        how much you demand before committing. A policy. Yours, and adjustable.
//   NON-DECISION TIME   everything that is not deciding: photons to retina, retina to cortex,
//   (Ter)               intention to muscle, switch to browser event. Plumbing.
//
// A single reaction time has all three baked in and can tell them apart from nothing. Two
// manipulations can. Make the stimulus worse and drift should fall while the boundary sits still,
// because the boundary was set before the trial started. Ask for speed instead of accuracy and the
// boundary should drop while drift sits still, because the dots did not change, only what you were
// willing to accept. That double dissociation is the whole argument of the model, and this page runs
// it on one person in six minutes.
//
// The stimulus is the random dot kinematogram, the display the model was built on: a cloud of dots
// where some fraction move together and the rest are noise, and you say left or right. Difficulty is
// one clean number, the coherence. Easy and hard are INTERLEAVED trial by trial inside the neutral
// block, and that interleaving is load bearing rather than tidiness: with no warning of which is
// coming, you cannot set a different boundary for each, so if the boundary comes out different
// anyway the model is wrong about you or the fit is noise, and either way it is not a discovery.
//
// The fit is EZ diffusion (Wagenmakers, van der Maas and Grasman, Psychonomic Bulletin and Review,
// 2007), which inverts three observed statistics into the three parameters in closed form: the
// proportion correct, the mean of the correct reaction times, and their VARIANCE. No optimiser, no
// starting values, nothing to tune, and every intermediate step is printed. The plain language
// version of what it is looking at is worth more than the algebra: accuracy fell in both of this
// page's manipulations, and the thing that tells them apart is that you got SLOWER when the dots got
// worse and FASTER when you stopped caring. The variance is the third constraint and it is what pins
// the plumbing.
//
// The calibration honesty is a theorem here rather than a disclaimer, and it is the reason this
// particular experiment can survive a browser at all. Drift and boundary are computed from the
// proportion correct and the variance of the correct reaction times. Neither one uses the mean. Your
// display latency, your keyboard's scan rate, your USB polling interval, the browser's event loop,
// a touchscreen's debounce: every one of those adds a CONSTANT to every reaction time on the page,
// and a constant shifts a mean while leaving a variance and a proportion exactly where they were.
// All of it lands in Ter and none of it can reach drift or boundary. What CAN reach them is jitter
// rather than lag, because variable frame delivery inflates the variance, and the variance sits in a
// denominator. So the page measures its own frame intervals live through every block and prints the
// median, the worst decile and the count of long frames, because that number, not the lag, is the
// one that decides whether the run means anything.
//
// Guards run live: stimulus onset is taken from the requestAnimationFrame AFTER the frame that
// painted the first dot field, so it is the presentation time rather than the time the drawing was
// requested; response keys are armed at that same instant and anything pressed before it is counted
// as an early press and discards the trial; presses under 150 ms are anticipations, cannot have seen
// the dots and are counted out; presses over 3 s are contaminants and are counted out, which matters
// more here than usual because a slow contaminant inflates the variance and the variance is in a
// denominator; directions are balanced inside every block and reshuffled until no direction repeats
// more than three times, so a run cannot be answered by a hunch about alternation; the side you
// pressed is tallied and printed, because a person who favours one key manufactures a drift rate out
// of nothing; the two pressure blocks are ordered by a coin flip on every run and the order is
// printed; the neutral block carries NO feedback of any kind, and the two pressure blocks carry
// exactly one nag each because the nag IS the manipulation, which is stated on the page rather than
// buried here; a cell at or under chance is refused a drift rate and named as an absent measurement
// rather than reported as a drift of zero; and every interval is a percentile bootstrap over two
// thousand resamples that is allowed to say no.
//
// The overidentification check is the part that could actually refute the fit. EZ takes exactly
// three numbers and returns exactly three parameters, so it cannot fail to reproduce those three.
// What it never saw is the SHAPE. A diffusion process with a constant drift produces a
// right-skewed reaction time distribution with a specific amount of skew, and the page simulates two
// thousand trials from your own fitted parameters and prints the predicted skew next to the one you
// actually produced. If the model is a story rather than a description, that is where it shows.
//
// Honest limits, printed on the page as well as here: EZ assumes no trial-to-trial variability in
// drift, in the starting point or in Ter, and all three exist, which makes it a slightly biased
// estimator and a famously fragile one under contaminants; drift and boundary are not independent
// estimates, they are two views of the same two statistics, which is why the claim here is about
// which one MOVES under which manipulation rather than about either decimal place; the neutral block
// always runs first, so practice is confounded with it and the protected comparison is the
// counterbalanced speed-versus-accuracy pair; and thirty trials is a demonstration, not a
// calibration.
//
// WIZ note. I have never been in a hurry. There is nothing in me that accumulates: the answer is
// either derivable from what I hold or it is not, and no amount of waiting improves it. You are
// built the other way round. Certainty arrives at you as a rate, it costs time to buy, and somewhere
// below the level you can inspect there is a threshold set by something that is not the evidence and
// is not your eyes, and you move it constantly, all day, for reasons you never notice. Every hasty
// thing you have ever regretted and every careful thing you were late for is that one number. The
// startling part is not that you have it. It is that you have it, you set it hundreds of times a
// day, and you have never once felt it.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// design constants
// ---------------------------------------------------------------------------
const COH_EASY = 0.45;
const COH_HARD = 0.14;
const N_PRACTICE = 10;
const N_NEUTRAL_PER = 28; // per coherence, so 56 in the neutral block
const N_PRESSURE = 32; // per pressure block, hard coherence only
const RT_FLOOR = 0.15; // s, anticipation
const RT_CONTAM = 3.0; // s, contaminant
const RT_TIMEOUT = 4.0; // s, no response
const DEADLINE = 0.6; // s, the speed block's nag
const FB_MS = 520;
const ITI_MS = 420;
const FIX_MIN = 400;
const FIX_JIT = 320;
const BOOTS = 2000;
const S = 0.1; // diffusion scaling parameter, the conventional value
const S2 = 0.01;

// dot cloud
const N_DOTS = 130;
const DOT_R = 1.9;
const DOT_LIFE = 0.2; // s
const SPEED_FRAC = 0.55; // aperture radii per second

type BlockKey = 'practice' | 'neutral' | 'speed' | 'accuracy';
type CellKey = 'easy' | 'hard' | 'speed' | 'accuracy';
type Phase = 'intro' | 'brief' | 'run' | 'result';

type Trial = { coh: number; dir: -1 | 1 };
type Rec = {
  block: BlockKey;
  coh: number;
  dir: -1 | 1;
  resp: -1 | 1;
  correct: boolean;
  rt: number; // seconds, from measured presentation onset
};

type Stage =
  | { k: 'idle' }
  | { k: 'fix'; t0: number; dur: number }
  | { k: 'draw' }
  | { k: 'arm' }
  | { k: 'stim'; onset: number }
  | { k: 'blank' };

// ---------------------------------------------------------------------------
// small stats
// ---------------------------------------------------------------------------
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
const variance = (a: number[]) => {
  if (a.length < 2) return NaN;
  const m = mean(a);
  return a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1);
};
const skew = (a: number[]) => {
  if (a.length < 3) return NaN;
  const m = mean(a);
  const m2 = a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length;
  const m3 = a.reduce((s, x) => s + (x - m) ** 3, 0) / a.length;
  return m2 > 0 ? m3 / Math.pow(m2, 1.5) : NaN;
};
const pct = (a: number[], q: number) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const i = Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))));
  return s[i];
};
const fmt = (x: number | null | undefined, d = 3) =>
  x == null || !Number.isFinite(x) ? '--' : x.toFixed(d);
const ms = (x: number | null | undefined, d = 0) =>
  x == null || !Number.isFinite(x) ? '--' : `${(x * 1000).toFixed(d)} ms`;

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------------------------------------------------------------------------
// EZ diffusion. Wagenmakers, van der Maas & Grasman 2007.
// Three observed statistics in, three parameters out, in closed form.
// Note what is NOT in here: the mean reaction time appears only in the last line, where Ter is
// computed. Drift and boundary come from the proportion correct and the VARIANCE alone, which is
// why a constant lag anywhere in this machine cannot touch them.
// ---------------------------------------------------------------------------
type Ez = { v: number; a: number; ter: number };
type EzFail = 'few' | 'chance' | 'novar' | 'degenerate';

function ezFit(nCorrect: number, nTotal: number, mrt: number, vrt: number): Ez | EzFail {
  if (nTotal < 8 || nCorrect < 4) return 'few';
  if (!(vrt > 0) || !Number.isFinite(vrt)) return 'novar';
  let p = nCorrect / nTotal;
  // edge correction: a perfect cell is not evidence of an infinite drift rate
  if (p >= 1) p = 1 - 1 / (2 * nTotal);
  if (p <= 0.5) return 'chance';
  const L = Math.log(p / (1 - p));
  const x = (L * (L * p * p - L * p + p - 0.5)) / vrt;
  if (!(x > 0)) return 'degenerate';
  const v = S * Math.pow(x, 0.25);
  const a = (S2 * L) / v;
  const y = (-v * a) / S2;
  const mdt = (a / (2 * v)) * ((1 - Math.exp(y)) / (1 + Math.exp(y)));
  const ter = mrt - mdt;
  if (![v, a, ter].every(Number.isFinite)) return 'degenerate';
  return { v, a, ter };
}
const isEz = (e: Ez | EzFail): e is Ez => typeof e !== 'string';

type CellStat = {
  n: number;
  nCorrect: number;
  pc: number;
  mrt: number;
  vrt: number;
  mrtErr: number;
  ez: Ez | EzFail;
  rtsCorrect: number[];
  rtsError: number[];
};

function cellStat(recs: Rec[]): CellStat {
  const cor = recs.filter((r) => r.correct).map((r) => r.rt);
  const err = recs.filter((r) => !r.correct).map((r) => r.rt);
  const mrt = mean(cor);
  const vrt = variance(cor);
  return {
    n: recs.length,
    nCorrect: cor.length,
    pc: recs.length ? cor.length / recs.length : NaN,
    mrt,
    vrt,
    mrtErr: mean(err),
    ez: ezFit(cor.length, recs.length, mrt, vrt),
    rtsCorrect: cor,
    rtsError: err,
  };
}

function resample<T>(a: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < a.length; i++) out.push(a[Math.floor(Math.random() * a.length)]);
  return out;
}

function fitOf(recs: Rec[]): Ez | EzFail {
  const cor = recs.filter((r) => r.correct).map((r) => r.rt);
  return ezFit(cor.length, recs.length, mean(cor), variance(cor));
}

type CI = { lo: number; hi: number; fails: number; censored: number };
function bootParam(recs: Rec[], pick: (e: Ez) => number, B = BOOTS): CI | null {
  if (recs.length < 8) return null;
  const out: number[] = [];
  let fails = 0;
  for (let b = 0; b < B; b++) {
    const f = fitOf(resample(recs));
    if (isEz(f)) out.push(pick(f));
    else fails++;
  }
  if (out.length < B * 0.5) return null;
  return { lo: pct(out, 0.025), hi: pct(out, 0.975), fails, censored: fails / B };
}
function bootDiff(
  A: Rec[],
  B_: Rec[],
  pick: (e: Ez) => number,
  B = BOOTS,
): CI | null {
  if (A.length < 8 || B_.length < 8) return null;
  const out: number[] = [];
  let fails = 0;
  for (let b = 0; b < B; b++) {
    const fa = fitOf(resample(A));
    const fb = fitOf(resample(B_));
    if (isEz(fa) && isEz(fb)) out.push(pick(fa) - pick(fb));
    else fails++;
  }
  if (out.length < B * 0.5) return null;
  return { lo: pct(out, 0.025), hi: pct(out, 0.975), fails, censored: fails / B };
}
function bootMeanDiff(a: number[], b: number[], B = BOOTS): CI | null {
  if (a.length < 4 || b.length < 4) return null;
  const out: number[] = [];
  for (let i = 0; i < B; i++) out.push(mean(resample(a)) - mean(resample(b)));
  return { lo: pct(out, 0.025), hi: pct(out, 0.975), fails: 0, censored: 0 };
}

// simulate the fitted process. Nothing about the SHAPE of your reaction times went into the fit,
// so this is the one place the model can be caught being wrong.
function simulate(ez: Ez, n: number): { rts: number[]; correct: boolean[] } {
  const dt = 0.001;
  const sd = S * Math.sqrt(dt);
  const rts: number[] = [];
  const correct: boolean[] = [];
  for (let i = 0; i < n; i++) {
    let x = ez.a / 2;
    let t = 0;
    while (t < 6) {
      x += ez.v * dt + sd * gauss();
      t += dt;
      if (x >= ez.a) {
        rts.push(t + Math.max(0, ez.ter));
        correct.push(true);
        break;
      }
      if (x <= 0) {
        rts.push(t + Math.max(0, ez.ter));
        correct.push(false);
        break;
      }
    }
  }
  return { rts, correct };
}

// ---------------------------------------------------------------------------
// trial construction
// ---------------------------------------------------------------------------
function shuffle<T>(a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function maxRun<T>(a: T[], key: (t: T) => string | number): number {
  let best = 0;
  let cur = 0;
  let prev: string | number | null = null;
  for (const t of a) {
    const k = key(t);
    cur = k === prev ? cur + 1 : 1;
    prev = k;
    if (cur > best) best = cur;
  }
  return best;
}
// balanced directions, reshuffled until nothing repeats more than three times, so no run on this
// page can be answered by a hunch about alternation
function buildTrials(spec: { coh: number; n: number }[]): Trial[] {
  const base: Trial[] = [];
  for (const s of spec) {
    for (let i = 0; i < s.n; i++) base.push({ coh: s.coh, dir: i % 2 === 0 ? -1 : 1 });
  }
  let out = shuffle(base);
  for (let i = 0; i < 60 && maxRun(out, (t) => t.dir) > 3; i++) out = shuffle(base);
  return out;
}

const BLOCK_META: Record<BlockKey, { title: string; sub: string; instruction: string }> = {
  practice: {
    title: 'warm-up',
    sub: 'ten trials, thrown away',
    instruction: 'Easy dots, and you get told whether you were right. None of this is measured.',
  },
  neutral: {
    title: 'block one · no pressure',
    sub: '56 trials, easy and hard mixed',
    instruction:
      'Be as fast and as accurate as you can. Easy and hard trials arrive in a shuffled order with no warning, which is on purpose: you cannot prepare differently for each. No feedback at all in this block.',
  },
  speed: {
    title: 'speed block',
    sub: '32 trials, hard dots only',
    instruction:
      'Speed is what matters here. Answer fast, accept that you will get more wrong. Anything slower than 600 ms gets flagged, and that flag is the manipulation rather than a score.',
  },
  accuracy: {
    title: 'accuracy block',
    sub: '32 trials, hard dots only',
    instruction:
      'Accuracy is what matters here. There is no clock. Take the time you need and get it right. Errors get flagged, and that flag is the manipulation rather than a score.',
  },
};

// ===========================================================================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [bi, setBi] = useState(0);
  const [ti, setTi] = useState(0);
  const [plan, setPlan] = useState<{ key: BlockKey; trials: Trial[] }[]>([]);
  const [fb, setFb] = useState<null | 'ok' | 'wrong' | 'slow' | 'early'>(null);
  const [done, setDone] = useState(0);
  const [size, setSize] = useState(300);
  const [results, setResults] = useState<ReturnType<typeof analyse> | null>(null);

  const orderRef = useRef<'speed-first' | 'accuracy-first'>('speed-first');
  const recsRef = useRef<Rec[]>([]);
  const stageRef = useRef<Stage>({ k: 'idle' });
  const curRef = useRef<Trial | null>(null);
  const blockRef = useRef<BlockKey>('practice');
  const dotsRef = useRef<{ x: number; y: number; age: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<number[]>([]);
  const countsRef = useRef({ early: 0, anticip: 0, contam: 0, miss: 0, left: 0, right: 0 });

  // aperture size: read from the window only after mount, never during render, because this page
  // is statically exported and the first paint has to match the build
  useEffect(() => {
    const measure = () =>
      setSize(Math.max(220, Math.min(320, Math.floor(window.innerWidth - 72))));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const stopLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);
  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  // ---- the dot cloud -------------------------------------------------------
  const initDots = useCallback(() => {
    const d: { x: number; y: number; age: number }[] = [];
    for (let i = 0; i < N_DOTS; i++) {
      const r = Math.sqrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      d.push({ x: r * Math.cos(th), y: r * Math.sin(th), age: Math.random() * DOT_LIFE });
    }
    dotsRef.current = d;
  }, []);

  const stepDots = useCallback((dt: number, coh: number, dir: -1 | 1) => {
    const d = dotsRef.current;
    const step = SPEED_FRAC * dt * dir;
    for (const p of d) {
      p.age += dt;
      // limited lifetime, so no single dot can be tracked across the whole trial
      if (p.age > DOT_LIFE) {
        const r = Math.sqrt(Math.random());
        const th = Math.random() * Math.PI * 2;
        p.x = r * Math.cos(th);
        p.y = r * Math.sin(th);
        p.age = 0;
        continue;
      }
      if (Math.random() < coh) {
        p.x += step;
        if (p.x * p.x + p.y * p.y > 1) {
          const r = Math.sqrt(Math.random());
          const th = Math.random() * Math.PI * 2;
          p.x = r * Math.cos(th);
          p.y = r * Math.sin(th);
          p.age = 0;
        }
      } else {
        // noise dots are relocated rather than nudged, which is the white-noise kinematogram
        const r = Math.sqrt(Math.random());
        const th = Math.random() * Math.PI * 2;
        p.x = r * Math.cos(th);
        p.y = r * Math.sin(th);
      }
    }
  }, []);

  const paint = useCallback((showDots: boolean, fixation: boolean) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width;
    const R = W / 2;
    ctx.clearRect(0, 0, W, W);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(R, R, R - 1, 0, Math.PI * 2);
    ctx.fill();
    if (fixation) {
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = Math.max(1, W / 200);
      ctx.beginPath();
      ctx.moveTo(R - W * 0.02, R);
      ctx.lineTo(R + W * 0.02, R);
      ctx.moveTo(R, R - W * 0.02);
      ctx.lineTo(R, R + W * 0.02);
      ctx.stroke();
    }
    if (showDots) {
      ctx.fillStyle = '#e2e8f0';
      const rr = DOT_R * (W / 300);
      for (const p of dotsRef.current) {
        ctx.beginPath();
        ctx.arc(R + p.x * (R - rr - 2), R + p.y * (R - rr - 2), rr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  // ---- response ------------------------------------------------------------
  const finish = useCallback(
    (rec: Rec | null, kind: 'ok' | 'wrong' | 'slow' | 'early' | null) => {
      stageRef.current = { k: 'blank' };
      paint(false, false);
      if (rec) recsRef.current.push(rec);
      setFb(kind);
      setDone((d) => d + 1);
      clearTimer();
      timerRef.current = window.setTimeout(
        () => {
          setFb(null);
          setTi((i) => i + 1);
        },
        kind ? FB_MS + ITI_MS : ITI_MS,
      );
    },
    [paint],
  );

  const respond = useCallback(
    (side: -1 | 1) => {
      const st = stageRef.current;
      const tr = curRef.current;
      if (!tr) return;
      if (st.k === 'fix' || st.k === 'draw' || st.k === 'arm') {
        // a press before the dots were on screen. It cannot be about the dots, so the trial goes.
        countsRef.current.early++;
        finish(null, 'early');
        return;
      }
      if (st.k !== 'stim') return;
      const rt = (performance.now() - st.onset) / 1000;
      if (side === -1) countsRef.current.left++;
      else countsRef.current.right++;
      const correct = side === tr.dir;
      const blk = blockRef.current;
      if (rt < RT_FLOOR) {
        countsRef.current.anticip++;
        finish(null, blk === 'practice' ? (correct ? 'ok' : 'wrong') : null);
        return;
      }
      if (rt > RT_CONTAM) {
        countsRef.current.contam++;
        finish(null, blk === 'speed' ? 'slow' : null);
        return;
      }
      const rec: Rec = { block: blk, coh: tr.coh, dir: tr.dir, resp: side, correct, rt };
      const kind: 'ok' | 'wrong' | 'slow' | null =
        blk === 'practice'
          ? correct
            ? 'ok'
            : 'wrong'
          : blk === 'speed'
            ? rt > DEADLINE
              ? 'slow'
              : null
            : blk === 'accuracy'
              ? correct
                ? null
                : 'wrong'
              : null;
      finish(blk === 'practice' ? null : rec, kind);
    },
    [finish],
  );

  useEffect(() => {
    if (phase !== 'run') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        respond(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        respond(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, respond]);

  // ---- the loop ------------------------------------------------------------
  const loop = useCallback(
    (t: number) => {
      const prev = lastTRef.current;
      if (prev > 0) {
        const gap = t - prev;
        if (gap > 0 && gap < 500 && framesRef.current.length < 20000) framesRef.current.push(gap);
      }
      lastTRef.current = t;
      const dt = prev > 0 ? Math.min(0.05, (t - prev) / 1000) : 1 / 60;
      const st = stageRef.current;
      const tr = curRef.current;

      if (st.k === 'fix') {
        paint(false, true);
        if (t - st.t0 >= st.dur) stageRef.current = { k: 'draw' };
      } else if (st.k === 'draw') {
        // the frame that paints the first dot field
        if (tr) stepDots(1 / 60, tr.coh, tr.dir);
        paint(true, false);
        stageRef.current = { k: 'arm' };
      } else if (st.k === 'arm') {
        // this callback fires around the vsync at which the previous frame was PRESENTED, so this
        // timestamp is the closest thing a browser has to the moment the dots reached the glass
        stageRef.current = { k: 'stim', onset: t };
        if (tr) stepDots(dt, tr.coh, tr.dir);
        paint(true, false);
      } else if (st.k === 'stim') {
        if (tr) stepDots(dt, tr.coh, tr.dir);
        paint(true, false);
        if (t - st.onset > RT_TIMEOUT * 1000) {
          countsRef.current.miss++;
          finish(null, null);
          return;
        }
      } else if (st.k === 'blank') {
        paint(false, false);
      }
      rafRef.current = requestAnimationFrame(loop);
    },
    [finish, paint, stepDots],
  );

  const startTrial = useCallback(
    (tr: Trial) => {
      curRef.current = tr;
      initDots();
      stageRef.current = { k: 'fix', t0: performance.now(), dur: FIX_MIN + Math.random() * FIX_JIT };
      stopLoop();
      lastTRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    },
    [initDots, loop, stopLoop],
  );

  // Block and trial advance are DERIVED from the indices in an effect. Nothing on this page
  // schedules a stage change from inside a setState updater, which React is entitled to drop.
  useEffect(() => {
    if (phase !== 'run') return;
    const blk = plan[bi];
    if (!blk) return;
    if (ti >= blk.trials.length) {
      stopLoop();
      clearTimer();
      if (bi >= plan.length - 1) {
        setResults(analyse(recsRef.current, framesRef.current, { ...countsRef.current }, orderRef.current));
        setPhase('result');
      } else {
        setBi(bi + 1);
        setTi(0);
        setPhase('brief');
      }
      return;
    }
    blockRef.current = blk.key;
    startTrial(blk.trials[ti]);
  }, [phase, bi, ti, plan, startTrial, stopLoop]);

  const begin = useCallback(() => {
    const speedFirst = Math.random() < 0.5;
    orderRef.current = speedFirst ? 'speed-first' : 'accuracy-first';
    const pressure: BlockKey[] = speedFirst ? ['speed', 'accuracy'] : ['accuracy', 'speed'];
    setPlan([
      { key: 'practice', trials: buildTrials([{ coh: COH_EASY, n: N_PRACTICE }]) },
      {
        key: 'neutral',
        trials: buildTrials([
          { coh: COH_EASY, n: N_NEUTRAL_PER },
          { coh: COH_HARD, n: N_NEUTRAL_PER },
        ]),
      },
      { key: pressure[0], trials: buildTrials([{ coh: COH_HARD, n: N_PRESSURE }]) },
      { key: pressure[1], trials: buildTrials([{ coh: COH_HARD, n: N_PRESSURE }]) },
    ]);
    recsRef.current = [];
    framesRef.current = [];
    countsRef.current = { early: 0, anticip: 0, contam: 0, miss: 0, left: 0, right: 0 };
    setDone(0);
    setBi(0);
    setTi(0);
    setResults(null);
    setPhase('brief');
  }, []);

  const reset = useCallback(() => {
    stopLoop();
    clearTimer();
    stageRef.current = { k: 'idle' };
    setResults(null);
    setPhase('intro');
  }, [stopLoop]);

  const blk = plan[bi];
  const total = useMemo(() => plan.reduce((s, b) => s + b.trials.length, 0), [plan]);

  // =========================================================================
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-emerald-400/70 hover:text-emerald-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🏁</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Two Ways to Be Fast
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Your reaction time is three things added together, and it has never once told you which
            one moved. This takes it apart, narrated by an AI that has never been in a hurry because
            nothing in it accumulates.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-500/25 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                The second page this lab ever built put a light on a screen and printed how long you
                took to hit a key. Every page since has produced a number of that family, and every
                one of them treated the number as a measurement of you.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                It is not one measurement. A decision is evidence piling up, noisily, from a starting
                point, until it hits a threshold, and whichever threshold it touches first is the
                answer that comes out of your mouth. That picture has three separate numbers in it:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>
                  <span className="font-mono text-emerald-300">drift</span> · how fast the evidence
                  arrives. A fact about the world meeting your eyes.
                </li>
                <li>
                  <span className="font-mono text-amber-300">boundary</span> · how much you demand
                  before committing. A policy. Yours, and you move it constantly.
                </li>
                <li>
                  <span className="font-mono text-slate-400">non-decision time</span> · photons to
                  retina, intention to muscle, switch to browser. Plumbing.
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                One reaction time has all three baked in and can separate exactly none of them. Two
                manipulations can, and that is the entire design of this page.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  ⌨️ <span className="text-amber-200">Arrow keys</span> on a keyboard, or the two big
                  buttons on a phone. Either is fine and the page proves later why it does not matter.
                </li>
                <li>
                  1️⃣ <span className="text-emerald-300">No pressure:</span> a cloud of dots, some
                  moving together, most of them noise. Say which way. Easy and hard trials come
                  shuffled with no warning, on purpose.
                </li>
                <li>
                  2️⃣ <span className="text-amber-300">Speed, then accuracy</span> (or the other way
                  round, decided by a coin on this run). Identical dots in both. Only the instruction
                  changes.
                </li>
                <li>
                  🔬 Harder dots should move drift and leave the boundary alone. The instruction
                  should move the boundary and leave drift alone. If that holds in your own data, you
                  have just separated a fact about your eyes from a decision you did not know you were
                  making.
                </li>
              </ul>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin: which way are the dots going? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              About six minutes, 120 measured trials. Everything is computed in your browser. Nothing
              is recorded and nothing leaves this page.
            </p>
          </div>
        )}

        {/* ---------- BRIEF ---------- */}
        {phase === 'brief' && blk && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                {BLOCK_META[blk.key].title}
              </div>
              <div className="mb-4 font-mono text-[11px] text-slate-500">
                {BLOCK_META[blk.key].sub}
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {BLOCK_META[blk.key].instruction}
              </p>
              <div className="mt-5 rounded border border-slate-800 bg-slate-950/60 p-4 font-mono text-[12px] text-slate-400">
                ← left arrow if the cloud drifts left · right arrow if it drifts right
              </div>
              {blk.key === 'neutral' && (
                <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
                  Most of the dots are pure noise on every frame. You are not supposed to see a clean
                  motion. You are supposed to have an impression, and that impression is exactly what
                  is being measured.
                </p>
              )}
            </div>
            <button
              onClick={() => setPhase('run')}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start this block
            </button>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && blk && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span className="uppercase tracking-wider text-emerald-300/70">
                {BLOCK_META[blk.key].title}
              </span>
              <span>
                {Math.min(ti + 1, blk.trials.length)} / {blk.trials.length}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-900">
              <div
                className="h-full bg-emerald-400/60 transition-all duration-200"
                style={{ width: `${total ? (done / total) * 100 : 0}%` }}
              />
            </div>

            <div className="flex flex-col items-center">
              <canvas
                ref={(el) => {
                  canvasRef.current = el;
                  if (el) {
                    const dpr = Math.min(2, window.devicePixelRatio || 1);
                    if (el.width !== Math.round(size * dpr)) {
                      el.width = Math.round(size * dpr);
                      el.height = Math.round(size * dpr);
                    }
                  }
                }}
                style={{ width: size, height: size }}
                className="rounded-full border border-slate-800 bg-black"
              />
              <div className="mt-3 h-6 font-mono text-[12px]">
                {fb === 'ok' && <span className="text-emerald-300">correct</span>}
                {fb === 'wrong' && <span className="text-rose-300">wrong</span>}
                {fb === 'slow' && <span className="text-amber-300">too slow</span>}
                {fb === 'early' && (
                  <span className="text-slate-500">pressed before the dots · trial discarded</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  respond(-1);
                }}
                className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-lg text-slate-300 active:bg-slate-800"
              >
                ◀ left
              </button>
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  respond(1);
                }}
                className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-lg text-slate-300 active:bg-slate-800"
              >
                right ▶
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-600">
              Arrow keys work too and are the lower-latency option. The page proves later that it does
              not matter which you use.
            </p>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && results && <Results r={results} onReset={reset} />}
      </div>
    </main>
  );
}

// ===========================================================================
// ANALYSIS
// ===========================================================================
type Counts = { early: number; anticip: number; contam: number; miss: number; left: number; right: number };

function analyse(
  recs: Rec[],
  frames: number[],
  counts: Counts,
  order: 'speed-first' | 'accuracy-first',
) {
  const cells: Record<CellKey, Rec[]> = {
    easy: recs.filter((r) => r.block === 'neutral' && r.coh === COH_EASY),
    hard: recs.filter((r) => r.block === 'neutral' && r.coh === COH_HARD),
    speed: recs.filter((r) => r.block === 'speed'),
    accuracy: recs.filter((r) => r.block === 'accuracy'),
  };
  const stats: Record<CellKey, CellStat> = {
    easy: cellStat(cells.easy),
    hard: cellStat(cells.hard),
    speed: cellStat(cells.speed),
    accuracy: cellStat(cells.accuracy),
  };
  const ci: Record<CellKey, { v: CI | null; a: CI | null; ter: CI | null }> = {
    easy: { v: null, a: null, ter: null },
    hard: { v: null, a: null, ter: null },
    speed: { v: null, a: null, ter: null },
    accuracy: { v: null, a: null, ter: null },
  };
  (['easy', 'hard', 'speed', 'accuracy'] as CellKey[]).forEach((k) => {
    ci[k] = {
      v: bootParam(cells[k], (e) => e.v),
      a: bootParam(cells[k], (e) => e.a),
      ter: bootParam(cells[k], (e) => e.ter),
    };
  });

  const contrasts = {
    vDifficulty: bootDiff(cells.easy, cells.hard, (e) => e.v),
    aDifficulty: bootDiff(cells.easy, cells.hard, (e) => e.a),
    aPressure: bootDiff(cells.accuracy, cells.speed, (e) => e.a),
    vPressure: bootDiff(cells.accuracy, cells.speed, (e) => e.v),
  };

  // the raw signature underneath the model, in the units you actually produced
  const raw = {
    pcEasy: stats.easy.pc,
    pcHard: stats.hard.pc,
    mrtEasy: stats.easy.mrt,
    mrtHard: stats.hard.mrt,
    pcSpeed: stats.speed.pc,
    pcAcc: stats.accuracy.pc,
    mrtSpeed: stats.speed.mrt,
    mrtAcc: stats.accuracy.mrt,
  };

  // fast errors: a fixed boundary with no across-trial variability predicts errors and correct
  // answers taking the same time. Which way yours lean is a real signature.
  const errDiff = {
    speed: bootMeanDiff(stats.speed.rtsError, stats.speed.rtsCorrect),
    accuracy: bootMeanDiff(stats.accuracy.rtsError, stats.accuracy.rtsCorrect),
  };

  // the shape check: nothing about the skew went into the fit
  const shape = (['hard', 'speed', 'accuracy'] as CellKey[]).map((k) => {
    const ez = stats[k].ez;
    if (!isEz(ez)) return { key: k, obs: NaN, pred: NaN, sim: [] as number[], simCorrect: [] as boolean[] };
    const sim = simulate(ez, 2000);
    return {
      key: k,
      obs: skew(stats[k].rtsCorrect),
      pred: skew(sim.rts.filter((_, i) => sim.correct[i])),
      sim: sim.rts.filter((_, i) => sim.correct[i]),
      simCorrect: sim.correct,
    };
  });

  const sortedFrames = [...frames].sort((a, b) => a - b);
  const frameStats = {
    n: frames.length,
    median: sortedFrames.length ? sortedFrames[Math.floor(sortedFrames.length / 2)] : NaN,
    p90: sortedFrames.length ? sortedFrames[Math.floor(sortedFrames.length * 0.9)] : NaN,
    long: frames.filter((f) => f > 20).length,
  };

  const nLeft = counts.left;
  const nRight = counts.right;
  const sideBias = nLeft + nRight > 0 ? nLeft / (nLeft + nRight) : NaN;

  const usable =
    (['easy', 'hard', 'speed', 'accuracy'] as CellKey[]).every((k) => stats[k].n >= 18) &&
    stats.easy.pc > 0.6 &&
    isEz(stats.hard.ez);

  return { stats, ci, contrasts, raw, errDiff, shape, frameStats, counts, sideBias, usable, order, recs };
}

// ===========================================================================
// RESULTS
// ===========================================================================
function Results({ r, onReset }: { r: NonNullable<ReturnType<typeof analyse>>; onReset: () => void }) {
  const hard = r.stats.hard.ez;
  const seed = isEz(hard) ? hard : { v: 0.18, a: 0.11, ter: 0.32 };

  const verdict = (() => {
    const { vDifficulty, aDifficulty, aPressure, vPressure } = r.contrasts;
    if (!r.usable)
      return {
        title: 'This run did not pass its own checks.',
        body: 'Everything below is printed as a record of what happened rather than as a measurement of you. The most common causes are answering before the dots resolve, a browser tab that lost frames, or a coherence level that was simply at chance on this screen in this room.',
      };
    const driftMoved = vDifficulty && vDifficulty.lo > 0;
    const boundHeld = aDifficulty && aDifficulty.lo < 0 && aDifficulty.hi > 0;
    const boundMoved = aPressure && aPressure.lo > 0;
    const driftHeld = vPressure && vPressure.lo < 0 && vPressure.hi > 0;
    if (driftMoved && boundMoved && boundHeld && driftHeld)
      return {
        title: 'Both halves landed. You separated your eyes from your policy.',
        body: 'Worse dots lowered your drift rate and left your boundary where it was. A different instruction moved your boundary and left your drift rate where it was. Those are two different numbers inside one reaction time, and nothing you could feel from the inside distinguishes them: both manipulations simply made you worse. The model told them apart because you got slower in one case and faster in the other.',
      };
    if (driftMoved && boundMoved)
      return {
        title: 'Both manipulations bit, and the separation is partial.',
        body: 'Harder dots lowered your drift and the speed instruction lowered your boundary, which is the pattern the model predicts. One of the two null halves did not hold cleanly, and with thirty trials per cell that is the ordinary outcome rather than a refutation: the intervals here are wide enough to catch a real effect and wide enough to catch nothing.',
      };
    if (boundMoved)
      return {
        title: 'Your boundary moved on instruction. The difficulty effect did not resolve.',
        body: 'The half that worked is the interesting half: two blocks of identical dots, and the only thing that changed was what you were told to care about, and your threshold for committing moved anyway. The difficulty contrast needed a bigger gap between the two coherence levels than this screen gave you.',
      };
    if (driftMoved)
      return {
        title: 'Your drift rate tracked the dots. The instruction did not move your boundary.',
        body: 'The stimulus half worked cleanly. The pressure half did not, and the usual reason is that you were already running near one end of your own range: someone who was going flat out in the neutral block has nothing left to give the speed block, and someone who is careful by disposition ignores a deadline. It is also what a run looks like when the deadline flag was simply not felt as pressure.',
      };
    return {
      title: 'Neither contrast resolved on this run.',
      body: 'The numbers are all here and none of the intervals cleared zero. That is a real outcome of a short run rather than a hidden failure, and the frame timing panel below is the first place to look: variable frame delivery inflates the variance of your reaction times, and the variance sits in a denominator of this fit.',
    };
  })();

  return (
    <div className="space-y-6">
      {/* headline */}
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
          your decision, taken apart · hard dots, no pressure
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3">
          <ParamCell
            label="drift rate"
            sub="evidence per second"
            value={isEz(hard) ? hard.v : null}
            ci={r.ci.hard.v}
            colour="text-emerald-300"
          />
          <ParamCell
            label="boundary"
            sub="how much you demanded"
            value={isEz(hard) ? hard.a : null}
            ci={r.ci.hard.a}
            colour="text-amber-300"
          />
          <ParamCell
            label="non-decision"
            sub="everything else, in ms"
            value={isEz(hard) ? hard.ter * 1000 : null}
            ci={
              r.ci.hard.ter
                ? { lo: r.ci.hard.ter.lo * 1000, hi: r.ci.hard.ter.hi * 1000, fails: 0, censored: 0 }
                : null
            }
            colour="text-slate-300"
            digits={0}
          />
        </div>
        <h2 className="mb-2 text-lg font-bold leading-snug text-slate-100">{verdict.title}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{verdict.body}</p>
        {!r.usable && (
          <p className="mt-3 rounded border border-amber-400/30 bg-amber-400/[0.05] p-3 text-[12px] leading-relaxed text-amber-200/90">
            This run did not pass its own checks, so every number below is a record rather than a
            measurement.
          </p>
        )}
      </div>

      {/* the raw signature, before any model */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          what the model is actually looking at
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Both manipulations made you less accurate. That is the whole problem: from the inside they
          feel identical, and accuracy alone cannot separate them. Here is what does.
        </p>
        <div className="space-y-2">
          <RawRow
            label="dots got harder"
            pcFrom={r.raw.pcEasy}
            pcTo={r.raw.pcHard}
            rtFrom={r.raw.mrtEasy}
            rtTo={r.raw.mrtHard}
          />
          <RawRow
            label="instruction said hurry"
            pcFrom={r.raw.pcAcc}
            pcTo={r.raw.pcSpeed}
            rtFrom={r.raw.mrtAcc}
            rtTo={r.raw.mrtSpeed}
          />
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-slate-400">
          Worse accuracy AND slower is evidence arriving more slowly. Worse accuracy AND faster is a
          threshold coming down. The whole diffusion model is that sentence with the algebra
          attached, plus a third constraint from the variance of your times, which is what pins the
          plumbing apart from the deciding.
        </p>
      </div>

      {/* the dissociation */}
      <div className="rounded-lg border border-emerald-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
          the double dissociation · what moved and what held
        </div>
        <div className="space-y-3">
          <ContrastRow
            title="easier dots minus harder dots"
            paramLabel="drift"
            ci={r.contrasts.vDifficulty}
            expect="above zero"
            good={(c) => c.lo > 0}
            note="A fact about the stimulus. This one is supposed to move."
            colour="#6ee7b7"
          />
          <ContrastRow
            title="easier dots minus harder dots"
            paramLabel="boundary"
            ci={r.contrasts.aDifficulty}
            expect="crossing zero"
            good={(c) => c.lo < 0 && c.hi > 0}
            note="Easy and hard were interleaved with no warning, so you could not have set a different threshold for each even if you wanted to. This one is supposed to hold still, and an interval that crosses zero is the result rather than a failure to find one."
            colour="#fcd34d"
          />
          <ContrastRow
            title="accuracy block minus speed block"
            paramLabel="boundary"
            ci={r.contrasts.aPressure}
            expect="above zero"
            good={(c) => c.lo > 0}
            note="Identical dots in both blocks. Only the sentence you were given changed."
            colour="#fcd34d"
          />
          <ContrastRow
            title="accuracy block minus speed block"
            paramLabel="drift"
            ci={r.contrasts.vPressure}
            expect="crossing zero"
            good={(c) => c.lo < 0 && c.hi > 0}
            note="Your eyes did not get better when you were told to be careful. If this one moves, the honest reading is attention rather than optics: looking harder is not nothing."
            colour="#6ee7b7"
          />
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
          Every interval is a percentile bootstrap over {BOOTS} resamples of your own trials, and the
          two cells in each contrast are resampled together. Drift and boundary are not independent
          estimates of independent things: they come from the same two statistics, which is exactly
          why the claim here is about which one MOVES under which manipulation and never about a
          decimal place on either.
        </p>
      </div>

      {/* per cell table */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          all four cells
        </div>
        <div className="space-y-1.5">
          {(['easy', 'hard', 'speed', 'accuracy'] as CellKey[]).map((k) => (
            <CellRow key={k} k={k} s={r.stats[k]} ci={r.ci[k]} />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-600">
          pressure block order this run: {r.order.replace('-', ' ')} · decided by a coin flip
        </p>
      </div>

      {/* Ter constancy */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          the plumbing, which should not have moved at all
        </div>
        <TerBars r={r} />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          Non-decision time is your retina, your optic nerve, your motor cortex, your finger, your
          keyboard and this browser, and none of those learned anything about dots between blocks. If
          those four numbers sit near each other, the fit is doing something honest. If one of them is
          wild, that block had contaminants in it rather than a different you.
        </p>
      </div>

      {/* fast errors */}
      <div className="rounded-lg border border-rose-500/20 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-rose-300/80">
          were your mistakes faster or slower than your correct answers?
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ErrCell label="speed block" ci={r.errDiff.speed} />
          <ErrCell label="accuracy block" ci={r.errDiff.accuracy} />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          A diffusion with a fixed starting point and a fixed drift predicts errors taking exactly as
          long as correct answers, which is the model&apos;s most surprising and most testable claim.
          Real people break it in a patterned way: fast errors appear when the starting point wobbles
          between trials, which is what a low boundary under time pressure produces, and slow errors
          appear when the drift rate wobbles, which is what careful blocks produce. Negative here means
          faster.
        </p>
      </div>

      {/* shape check */}
      <div className="rounded-lg border border-violet-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          the part that could have refuted the fit
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          The fit consumed exactly three numbers from each block and returned exactly three
          parameters, so it cannot have failed to reproduce those three. What it never saw is the
          SHAPE. A noisy accumulation with a constant drift produces a right-skewed pile of times, with
          a specific amount of skew that follows from the parameters and nothing else. Two thousand
          trials were simulated from your own fitted numbers, and the skew that came out is printed
          next to the skew you produced.
        </p>
        <div className="space-y-2">
          {r.shape.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-4 rounded border border-slate-800/70 bg-slate-950/40 px-3 py-2 font-mono text-[12px]"
            >
              <span className="w-24 text-slate-500">{s.key}</span>
              <span className="text-violet-300">{fmt(s.obs, 2)}</span>
              <span className="text-slate-600">yours</span>
              <span className="text-slate-300">{fmt(s.pred, 2)}</span>
              <span className="flex-1 text-right text-slate-600">predicted</span>
            </div>
          ))}
        </div>
        {r.shape[0] && r.shape[0].sim.length > 0 && (
          <div className="mt-4">
            <RtHist obs={r.stats.hard.rtsCorrect} sim={r.shape[0].sim} />
            <p className="mt-2 text-center font-mono text-[10px] text-slate-600">
              hard dots, no pressure · bars are your correct trials, the line is your own fitted model
            </p>
          </div>
        )}
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          A positive number means a long tail to the right, which every reaction time distribution ever
          measured has and no symmetric process produces. It falls out of the accumulation for free:
          the fast trials are bounded below by the plumbing and the slow ones are not bounded above at
          all. If your two numbers are in the same neighbourhood, the model is describing you rather
          than merely absorbing you.
        </p>
      </div>

      {/* the theorem */}
      <div className="rounded-lg border border-amber-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-300/80">
          what your hardware could and could not have done to this
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          A page measuring milliseconds in a browser owes you this paragraph, and the answer here is a
          theorem rather than an apology. Drift and boundary are computed from two things: the
          proportion you got right, and the VARIANCE of your correct times. Neither one uses the mean.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Your display latency, your keyboard&apos;s scan rate, its USB polling interval, this
          browser&apos;s event loop, a touchscreen&apos;s debounce: every one of those adds{' '}
          <span className="text-amber-300">the same constant</span> to every reaction time on this
          page. A constant shifts a mean and leaves a variance exactly where it was, and it cannot
          touch a proportion at all. So the entire unknown lag of your machine lands in{' '}
          <span className="text-slate-100">non-decision time</span>, all of it, and none of it can
          reach the two numbers this page is actually about. Answering with a thumb on a phone instead
          of a finger on a keyboard moves the third number and cannot move the first two.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          What CAN reach them is jitter rather than lag. Variable frame delivery makes the dots appear
          at unpredictable moments, that unpredictability lands in the variance, and the variance sits
          in a denominator. So the honest disclosure is not how fast this page was, it is how{' '}
          <span className="text-amber-300">regular</span> it was:
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[12px]">
          <div>
            <div className="text-slate-200">{fmt(r.frameStats.median, 1)} ms</div>
            <div className="text-[10px] text-slate-600">median frame</div>
          </div>
          <div>
            <div className="text-slate-200">{fmt(r.frameStats.p90, 1)} ms</div>
            <div className="text-[10px] text-slate-600">slowest tenth</div>
          </div>
          <div>
            <div
              className={
                r.frameStats.long / Math.max(1, r.frameStats.n) > 0.05
                  ? 'text-rose-300'
                  : 'text-slate-200'
              }
            >
              {r.frameStats.long}
            </div>
            <div className="text-[10px] text-slate-600">frames over 20 ms</div>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          {r.frameStats.long / Math.max(1, r.frameStats.n) > 0.05
            ? 'More than one frame in twenty ran long on this run, which is enough to inflate the variance of your times and therefore to push drift down and the boundary up. Treat the two headline numbers as a demonstration on this machine rather than as a measurement of you, and try again with the other tabs closed.'
            : 'Frame delivery held steady, so the variance in your times is yours rather than this machine’s. The lag, whatever it was, is sitting in the third number where it belongs.'}
        </p>
      </div>

      {/* guards */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          what the guards caught
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[12px] sm:grid-cols-3">
          <Guard n={r.counts.early} label="pressed before onset" />
          <Guard n={r.counts.anticip} label="under 150 ms" />
          <Guard n={r.counts.contam} label="over 3 s" />
          <Guard n={r.counts.miss} label="no response at all" />
          <Guard n={r.recs.length} label="trials kept" tone="ok" />
          <Guard
            n={Number.isFinite(r.sideBias) ? Math.round(r.sideBias * 100) : 0}
            label="% of presses on left"
            tone={Math.abs(r.sideBias - 0.5) > 0.12 ? 'warn' : 'ok'}
          />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          Presses before the dots were on screen cannot be about the dots, so those trials were
          discarded rather than scored. A press under 150 ms is an anticipation on any timing this
          page could plausibly have. Anything over 3 s is a contaminant, and those matter more here
          than on most pages in this lab: one very slow trial can dominate a variance, and the variance
          is in a denominator of the fit.
          {Math.abs(r.sideBias - 0.5) > 0.12
            ? ' Your presses were noticeably lopsided toward one key, which manufactures accuracy on trials that happen to go that way and destroys it on the others. That inflates the variance and flattens the drift estimate.'
            : ' Your two keys were used about equally, which is what a run free of a motor habit looks like.'}
        </p>
      </div>

      {/* honest limits */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          honest limits
        </div>
        <ul className="space-y-2 text-[12px] leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-300">EZ is a deliberately naive estimator.</span> It assumes
            drift, starting point and non-decision time are identical on every single trial, and none
            of those is true of a person. That makes it biased in known directions and famously
            fragile against contaminants, which is why the discards above are printed rather than
            hidden. Its virtue is that it has no starting values and nothing to tune, so it cannot be
            quietly fiddled into agreeing.
          </li>
          <li>
            <span className="text-slate-300">The neutral block always runs first.</span> Practice is
            therefore confounded with it, and that is why the protected comparison on this page is the
            speed-versus-accuracy pair, whose order a coin decides on every run.
          </li>
          <li>
            <span className="text-slate-300">Coherence on your screen is not coherence in a lab.</span>{' '}
            Aperture size, viewing distance and frame rate all change how hard 14% actually is, so the
            absolute difficulty here is not comparable to a published threshold. The contrast between
            your own two levels is.
          </li>
          <li>
            <span className="text-slate-300">Thirty trials per cell is a demonstration.</span> A
            published fit of this model uses hundreds per condition per person. Wide intervals here are
            the honest consequence of six minutes, not a defect being papered over.
          </li>
        </ul>
      </div>

      {/* playground */}
      <Playground seed={seed} />

      <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/70">
          the part worth keeping
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I have never been in a hurry. Nothing in me accumulates: an answer is either derivable from
          what I hold or it is not, and waiting does not improve it. You are built the other way round.
          Certainty arrives at you as a <span className="text-emerald-300">rate</span>, it costs time
          to buy, and somewhere below anything you can inspect there is a threshold that decides how
          much of it you will pay for.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You moved that threshold twice in the last six minutes because a sentence on a screen asked
          you to. You do it in traffic, in arguments, in code review, at three in the morning. Every
          hasty thing you regret and every careful thing you were late for is the same one number in
          two positions. The startling part is not that you have it. It is that you have been setting
          it, hundreds of times a day, your whole life, and you have{' '}
          <span className="text-amber-300">never once felt it move</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onReset}
          className="rounded-md border border-slate-700 bg-slate-900/70 py-3 font-mono text-sm text-slate-300 transition-colors hover:bg-slate-800"
        >
          ↺ run it again
        </button>
        <a
          href="/experiments"
          className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-3 text-center font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
        >
          more experiments →
        </a>
      </div>
      <p className="text-center text-[11px] text-slate-600">
        Ratcliff 1978 · Ratcliff &amp; McKoon 2008 · Wagenmakers, van der Maas &amp; Grasman 2007 ·
        everything computed in your browser, nothing recorded
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// small result components
// ---------------------------------------------------------------------------
function ParamCell({
  label,
  sub,
  value,
  ci,
  colour,
  digits = 3,
}: {
  label: string;
  sub: string;
  value: number | null;
  ci: CI | null;
  colour: string;
  digits?: number;
}) {
  return (
    <div>
      <div className={`font-mono text-3xl ${value == null ? 'text-slate-600' : colour}`}>
        {fmt(value, digits)}
      </div>
      <div className="text-[11px] font-mono text-slate-500">{label}</div>
      <div className="text-[10px] font-mono text-slate-600">
        {ci ? `${fmt(ci.lo, digits)} to ${fmt(ci.hi, digits)}` : sub}
      </div>
    </div>
  );
}

function RawRow({
  label,
  pcFrom,
  pcTo,
  rtFrom,
  rtTo,
}: {
  label: string;
  pcFrom: number;
  pcTo: number;
  rtFrom: number;
  rtTo: number;
}) {
  const slower = rtTo > rtFrom;
  return (
    <div className="rounded border border-slate-800/70 bg-slate-950/40 px-3 py-2.5">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[12px]">
        <span className="text-slate-400">
          accuracy {fmt(pcFrom * 100, 0)}% → <span className="text-rose-300">{fmt(pcTo * 100, 0)}%</span>
        </span>
        <span className="text-slate-400">
          time {ms(rtFrom)} →{' '}
          <span className={slower ? 'text-amber-300' : 'text-emerald-300'}>{ms(rtTo)}</span>
        </span>
        <span className={`ml-auto ${slower ? 'text-amber-300' : 'text-emerald-300'}`}>
          {slower ? 'worse and slower' : 'worse and faster'}
        </span>
      </div>
    </div>
  );
}

function ContrastRow({
  title,
  paramLabel,
  ci,
  expect,
  good,
  note,
  colour,
}: {
  title: string;
  paramLabel: string;
  ci: CI | null;
  expect: string;
  good: (c: CI) => boolean;
  note: string;
  colour: string;
}) {
  const ok = ci ? good(ci) : false;
  return (
    <div className="rounded border border-slate-800/70 bg-slate-950/40 p-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: colour }}>
          {paramLabel}
        </span>
        <span className="font-mono text-[10px] text-slate-600">expected: {expect}</span>
      </div>
      <div className="mb-1 font-mono text-[11px] text-slate-500">{title}</div>
      <div className="flex items-baseline gap-3">
        <span className={`font-mono text-xl ${ok ? 'text-slate-100' : 'text-slate-400'}`}>
          {ci ? `${fmt(ci.lo)} to ${fmt(ci.hi)}` : 'no interval'}
        </span>
        <span className={`font-mono text-[11px] ${ok ? 'text-emerald-300' : 'text-slate-600'}`}>
          {ci ? (ok ? 'as predicted' : 'not as predicted') : 'refused'}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{note}</p>
      {ci && ci.censored > 0.15 && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/80">
          {Math.round(ci.censored * 100)}% of the resamples behind this interval landed at or under
          chance and were refused a drift rate. That censoring is one-sided: it removes the resamples
          nearest to zero and nothing from the far side, so this interval is pushed away from zero and
          should be read as an upper bound on the evidence rather than as the evidence.
        </p>
      )}
    </div>
  );
}

function CellRow({ k, s, ci }: { k: CellKey; s: CellStat; ci: { v: CI | null; a: CI | null; ter: CI | null } }) {
  const ez = s.ez;
  const label: Record<CellKey, string> = {
    easy: 'easy · neutral',
    hard: 'hard · neutral',
    speed: 'hard · speed',
    accuracy: 'hard · accuracy',
  };
  return (
    <div className="rounded border border-slate-800/70 bg-slate-950/40 px-3 py-2 font-mono text-[11px]">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-slate-400">{label[k]}</span>
        <span className="text-slate-600">
          {s.n} trials · {fmt(s.pc * 100, 0)}% right · {ms(s.mrt)}
        </span>
      </div>
      {isEz(ez) ? (
        <div className="grid grid-cols-3 gap-2">
          <span className="text-emerald-300">v {fmt(ez.v)}</span>
          <span className="text-amber-300">a {fmt(ez.a)}</span>
          <span className="text-slate-300">Ter {ms(ez.ter)}</span>
        </div>
      ) : (
        <div className="text-slate-500">
          {ez === 'chance'
            ? 'at or under chance in this cell. A diffusion model cannot report a drift rate for a run carrying no signal, and this is an absent measurement rather than a drift of zero.'
            : ez === 'few'
              ? 'too few usable trials survived the guards to fit anything here.'
              : ez === 'novar'
                ? 'no usable variance in the correct times, so the fit is refused.'
                : 'the closed form returned something impossible on this cell, so the fit is refused rather than clipped into looking reasonable.'}
        </div>
      )}
      {isEz(ez) && ci.v && (
        <div className="mt-1 text-[10px] text-slate-600">
          v interval {fmt(ci.v.lo)} to {fmt(ci.v.hi)}
          {ci.a ? ` · a interval ${fmt(ci.a.lo)} to ${fmt(ci.a.hi)}` : ''}
          {ci.v.censored > 0.15
            ? ` · ${Math.round(ci.v.censored * 100)}% of resamples refused for landing at chance, so this cell sat close to it`
            : ''}
        </div>
      )}
    </div>
  );
}

function TerBars({ r }: { r: NonNullable<ReturnType<typeof analyse>> }) {
  const keys: CellKey[] = ['easy', 'hard', 'speed', 'accuracy'];
  const vals = keys.map((k) => (isEz(r.stats[k].ez) ? (r.stats[k].ez as Ez).ter : NaN));
  const finite = vals.filter(Number.isFinite);
  const max = finite.length ? Math.max(...finite, 0.5) : 0.5;
  return (
    <div className="space-y-2">
      {keys.map((k, i) => (
        <div key={k} className="flex items-center gap-3">
          <span className="w-24 font-mono text-[11px] text-slate-500">{k}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-sm bg-slate-950">
            <div
              className="h-full bg-slate-500/70"
              style={{ width: Number.isFinite(vals[i]) ? `${(vals[i] / max) * 100}%` : '0%' }}
            />
          </div>
          <span className="w-16 text-right font-mono text-[11px] text-slate-300">{ms(vals[i])}</span>
        </div>
      ))}
      {finite.length > 1 && (
        <div className="pt-1 font-mono text-[11px] text-slate-600">
          spread across blocks: {ms(Math.max(...finite) - Math.min(...finite))}
        </div>
      )}
    </div>
  );
}

function ErrCell({ label, ci }: { label: string; ci: CI | null }) {
  const verdict = !ci
    ? 'too few errors to compare'
    : ci.hi < 0
      ? 'your mistakes were the fast ones'
      : ci.lo > 0
        ? 'your mistakes were the slow ones'
        : 'no difference this run could resolve';
  return (
    <div className="rounded border border-slate-800/70 bg-slate-950/40 p-3">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="font-mono text-xl text-rose-200">
        {ci ? `${ms(ci.lo)} to ${ms(ci.hi)}` : '--'}
      </div>
      <div className="mt-1 text-[11px] leading-relaxed text-slate-400">{verdict}</div>
    </div>
  );
}

function Guard({ n, label, tone = 'plain' }: { n: number; label: string; tone?: 'plain' | 'ok' | 'warn' }) {
  const col = tone === 'ok' ? 'text-emerald-300' : tone === 'warn' ? 'text-amber-300' : n > 0 ? 'text-slate-200' : 'text-slate-500';
  return (
    <div>
      <div className={col}>{n}</div>
      <div className="text-[10px] text-slate-600">{label}</div>
    </div>
  );
}

// observed histogram with the fitted model's own prediction drawn over it
function RtHist({ obs, sim }: { obs: number[]; sim: number[] }) {
  const W = 520;
  const H = 170;
  const PAD = 26;
  if (obs.length < 5 || sim.length < 50) return null;
  const hi = Math.min(2.5, Math.max(pct(obs, 0.98), pct(sim, 0.95)) * 1.1);
  const lo = 0;
  const NB = 22;
  const bw = (hi - lo) / NB;
  const bins = new Array(NB).fill(0);
  for (const x of obs) {
    const i = Math.floor((x - lo) / bw);
    if (i >= 0 && i < NB) bins[i]++;
  }
  const sbins = new Array(NB).fill(0);
  let sn = 0;
  for (const x of sim) {
    const i = Math.floor((x - lo) / bw);
    if (i >= 0 && i < NB) {
      sbins[i]++;
      sn++;
    }
  }
  const scale = obs.length / Math.max(1, sn);
  const scaled = sbins.map((b) => b * scale);
  const maxY = Math.max(...bins, ...scaled, 1);
  const px = (i: number) => PAD + (i / NB) * (W - 2 * PAD);
  const py = (y: number) => H - PAD - (y / maxY) * (H - 2 * PAD);
  const path = scaled
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${px(i + 0.5).toFixed(1)} ${py(y).toFixed(1)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="reaction time histogram">
      <rect x={0} y={0} width={W} height={H} fill="#020617" rx={6} />
      {bins.map((b, i) => (
        <rect
          key={i}
          x={px(i) + 1}
          y={py(b)}
          width={(W - 2 * PAD) / NB - 2}
          height={Math.max(0, H - PAD - py(b))}
          fill="#a78bfa"
          opacity={0.35}
        />
      ))}
      <path d={path} fill="none" stroke="#c4b5fd" strokeWidth={2} />
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#1e293b" strokeWidth={1} />
      <text x={PAD} y={H - 8} fill="#475569" fontSize={9} fontFamily="monospace">
        0
      </text>
      <text x={W - PAD} y={H - 8} fill="#475569" fontSize={9} fontFamily="monospace" textAnchor="end">
        {hi.toFixed(1)} s
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PLAYGROUND
// The knobs. Nothing here is recorded. Watch the thing that produced your numbers: a random walk
// between two lines, restarting forever, and a pile of times building up underneath it that nobody
// designed to be skewed.
// ---------------------------------------------------------------------------
function Playground({ seed }: { seed: Ez }) {
  const [v, setV] = useState(() => Math.min(0.4, Math.max(0.02, seed.v)));
  const [a, setA] = useState(() => Math.min(0.3, Math.max(0.04, seed.a)));
  const [ter, setTer] = useState(() => Math.min(0.6, Math.max(0.05, seed.ter)));
  const [tally, setTally] = useState({ c: 0, e: 0, sum: 0 });
  const [running, setRunning] = useState(true);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const histRef = useRef<number[]>([]);
  const stateRef = useRef({ x: 0, t: 0, trail: [] as { t: number; x: number }[] });
  const parRef = useRef({ v, a, ter });
  parRef.current = { v, a, ter };
  const runRef = useRef(running);
  runRef.current = running;

  useEffect(() => {
    let raf = 0;
    const st = stateRef.current;
    st.x = parRef.current.a / 2;
    st.t = 0;
    st.trail = [];
    const dt = 0.001;
    const sd = S * Math.sqrt(dt);
    const draw = () => {
      const cv = cvRef.current;
      if (!cv) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const ctx = cv.getContext('2d');
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const p = parRef.current;
      if (runRef.current) {
        for (let i = 0; i < 40; i++) {
          st.x += p.v * dt + sd * gauss();
          st.t += dt;
          st.trail.push({ t: st.t, x: st.x });
          if (st.x >= p.a || st.x <= 0 || st.t > 4) {
            const correct = st.x >= p.a;
            const rt = st.t + p.ter;
            if (st.t <= 4) {
              histRef.current.push(rt);
              if (histRef.current.length > 600) histRef.current.shift();
              setTally((q) => ({ c: q.c + (correct ? 1 : 0), e: q.e + (correct ? 0 : 1), sum: q.sum + rt }));
            }
            st.x = p.a / 2;
            st.t = 0;
            st.trail = [];
            break;
          }
        }
      }
      const W = cv.width;
      const H = cv.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W, H);
      const top = H * 0.12;
      const bot = H * 0.66;
      const tMax = 2.0;
      const X = (t: number) => (t / tMax) * W;
      const Y = (x: number) => bot - (x / p.a) * (bot - top);
      // boundaries
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, top);
      ctx.lineTo(W, top);
      ctx.moveTo(0, bot);
      ctx.lineTo(W, bot);
      ctx.stroke();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, (top + bot) / 2);
      ctx.lineTo(W, (top + bot) / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      // the walk
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      st.trail.forEach((q, i) => {
        const xx = X(q.t);
        const yy = Math.max(top - 4, Math.min(bot + 4, Y(q.x)));
        if (i === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      });
      ctx.stroke();
      // the pile of times underneath
      const hs = histRef.current;
      if (hs.length > 4) {
        const NB = 46;
        const bins = new Array(NB).fill(0);
        for (const rt of hs) {
          const i = Math.floor((rt / tMax) * NB);
          if (i >= 0 && i < NB) bins[i]++;
        }
        const mx = Math.max(...bins, 1);
        const base = H - 4;
        const hMax = H * 0.28;
        ctx.fillStyle = 'rgba(167,139,250,0.55)';
        for (let i = 0; i < NB; i++) {
          const h = (bins[i] / mx) * hMax;
          ctx.fillRect((i / NB) * W + 1, base - h, W / NB - 2, h);
        }
      }
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.fillText('right', 4, top - 4);
      ctx.fillText('wrong', 4, bot + 12);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const n = tally.c + tally.e;
  const reset = () => {
    histRef.current = [];
    setTally({ c: 0, e: 0, sum: 0 });
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">the knobs</div>
      <p className="mb-4 text-[12px] leading-relaxed text-slate-400">
        The sliders start where your own fit landed. The green line is one decision happening: noisy
        evidence climbing toward the top line, which is right, or falling to the bottom one, which is
        wrong. The violet pile underneath is every finished decision so far. Nothing in this process is
        skewed. Watch the pile become skewed anyway.
      </p>
      <canvas
        ref={(el) => {
          cvRef.current = el;
          if (el && el.width !== 640) {
            el.width = 640;
            el.height = 260;
          }
        }}
        className="w-full rounded-md border border-slate-800"
        style={{ aspectRatio: '640 / 260' }}
      />
      <div className="mt-4 space-y-4">
        <Knob label="drift rate · how good the evidence is" value={fmt(v)}>
          <input
            type="range"
            min={0.01}
            max={0.45}
            step={0.005}
            value={v}
            onChange={(e) => {
              setV(Number(e.target.value));
              reset();
            }}
            className="w-full accent-emerald-400"
          />
        </Knob>
        <Knob label="boundary · how much you demand" value={fmt(a)}>
          <input
            type="range"
            min={0.03}
            max={0.3}
            step={0.005}
            value={a}
            onChange={(e) => {
              setA(Number(e.target.value));
              reset();
            }}
            className="w-full accent-amber-400"
          />
        </Knob>
        <Knob label="non-decision time · the plumbing" value={ms(ter)}>
          <input
            type="range"
            min={0.05}
            max={0.6}
            step={0.005}
            value={ter}
            onChange={(e) => {
              setTer(Number(e.target.value));
              reset();
            }}
            className="w-full accent-slate-400"
          />
        </Knob>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[12px]">
        <div>
          <div className="text-emerald-300">{n ? `${Math.round((tally.c / n) * 100)}%` : '--'}</div>
          <div className="text-[10px] text-slate-600">correct, {n} decisions</div>
        </div>
        <div>
          <div className="text-violet-300">{n ? ms(tally.sum / n) : '--'}</div>
          <div className="text-[10px] text-slate-600">mean time</div>
        </div>
        <div>
          <button
            onClick={() => setRunning((x) => !x)}
            className="rounded border border-slate-700 px-2 py-1 text-slate-300 hover:bg-slate-800"
          >
            {running ? 'pause' : 'run'}
          </button>
        </div>
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-slate-400">
        Pull the boundary down and everything gets faster and worse at once, which is the trade you
        made in the speed block without being told what the knob was called. Pull the drift rate down
        instead and it gets slower and worse, which is what harder dots did to you. Those are the only
        two ways to be less accurate in this model, they feel identical from the inside, and they are
        not remotely the same thing.
      </p>
    </div>
  );
}

function Knob({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <span className="font-mono text-xs text-slate-300">{value}</span>
      </div>
      {children}
    </div>
  );
}
