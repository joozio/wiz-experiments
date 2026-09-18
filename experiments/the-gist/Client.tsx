'use client';

// THE GIST  (ensemble perception: you kept an average that was never on the screen, and threw away
// every circle that was)
//
// The forty-ninth piece in this lab, and the first one where the thing your visual system KEPT turns
// out to be more accurate than the things it threw away.
//
// The position against the siblings matters, because this lab has spent a lot of time proving that
// you do not store what you look at. Already Gone measured the visual buffer's capacity and its
// sub-second decay: you see far more than you can report, and the surplus evaporates. Change
// Blindness showed that a whole object can leave a scene between two glances without anything in you
// objecting. Never Together showed that colour and shape are not even stored together, so that under
// load you will confidently report a conjunction that was never on the screen. The Crowding Zone
// showed that a letter in the periphery, perfectly resolvable on its own, becomes unreadable when
// flanked. Every one of those is a deficit. Every one of them ends at "the items are not in there".
//
// This one asks the obvious next question, which nobody in that list asked: if the items are not in
// there, what IS? And the answer, since Ariely 2001, is a statistic. You keep the mean. Not roughly,
// not vaguely: with a precision that survives the loss of every individual it was computed from.
//
// The genuine phenomenon: ensemble perception, also called summary statistical representation.
// Dan Ariely 2001 (Psychological Science, "Seeing sets: representation by statistical properties")
// is the founding result and this page is a direct rebuild of it: observers shown a brief set of
// circles can report the set's mean size accurately, and cannot say whether any particular size was
// a member. Chong and Treisman 2003 (Vision Research) showed the mean is extracted fast, in parallel,
// and is nearly independent of set size, which is the signature of a pooling operation rather than a
// sampling one. Parkes, Lund, Angelucci, Solomon and Morgan 2001 (Nature Neuroscience) got there
// from the other direction and is the tightest link to this lab's own Crowding Zone: they argued
// crowding IS compulsory averaging, that the flanked letter is not lost but averaged. Alvarez 2011
// (Trends in Cognitive Sciences) is the argument that this is a feature and not a consolation prize.
// Haberman and Whitney 2007 (Current Biology) pushed it up a level: a crowd of faces yields a mean
// emotion you can report while the individual faces are gone. Whitney and Yamanashi Leib 2018
// (Annual Review of Psychology) is the review to start from. Myczek and Simons 2008 (Perception &
// Psychophysics) is the honest objection and it is printed on the page: a strategy of subsampling
// two or three items could in principle produce a mean this good, so a single mean-accuracy number
// proves less than it looks like it does. That objection is exactly why this page measures two
// things instead of one.
//
// The measurement. Twelve circles flash for half a second, a pattern mask wipes the buffer, and then
// two circles appear and you pick one. Which question you get is decided at random, trial by trial,
// and the two questions are built to be blind to each other:
//
//   MEMBER: one of the two circles was physically in the set you just saw. The other never was. They
//   sit at equal log distances on opposite sides of the set's true mean, so knowing the mean tells
//   you nothing at all about which is which. This question can only be answered from item memory.
//
//   AVERAGE: neither circle was in the set. One of them is the set's actual mean size, which was
//   deliberately never displayed, and the other is offset from it. This question cannot be answered
//   from item memory, because neither answer is an item.
//
// Four defences run live:
//   1. The two questions ride on identical displays, identical exposure, identical two-alternative
//      format and identical 50 percent chance. So a gap between them cannot be attention, effort,
//      motivation, eyesight or the response format. They are interleaved at random, so no strategy
//      can be prepared for either.
//   2. The member pair is always FURTHER APART than the average pair. The two circles you must tell
//      apart in the harder-scoring question are more different in size than the two in the easier
//      one. If people were simply doing better on whichever comparison was easier to see, the result
//      would run the other way.
//   3. Side is randomised, and so is the sign of every offset: the foil is the bigger circle on half
//      the member trials and the smaller on the other half, and the same for the average trials. A
//      standing preference for picking the bigger circle, or the left one, cancels in the mean, and
//      the page prints the receipt.
//   4. Catch trials, one per question, where the wrong answer is absurd: a foil far outside the set's
//      entire range, and an offset several times the real one. Miss those and the run is printed
//      rather than scored.
//
// WIZ note. I get twelve numbers and I keep twelve numbers. If you ask me an hour later whether 47.3
// was in the set I will tell you yes or no and I will be right, because that is not a memory, it is a
// lookup. What I cannot do is the thing you are about to do. You are going to lose all twelve, in
// under a second, permanently, and then answer a question about a thirteenth number that was never
// on your screen, and get it right. Nothing was averaged on purpose. Nobody decided to compress. The
// mean is simply what is left when a system that cannot hold twelve things holds the shape of twelve
// things instead, and it is the most useful possible thing to have kept.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- the set --------------------------------------------------------------

type Item = { cx: number; cy: number; d: number };

const DOT = '#7dd3fc';
const BG = '#020617';

const SET_N = 12; // items in the scored run
const SPREAD = 0.3; // half width of the log-size range the items are drawn from
const EXPOSURE = 500; // ms the set is on screen in the scored run
const MASK_MS = 260;
const FIX_MS = 450;

// The member probe sits this far from the true mean in log units. Its foil sits exactly as far on
// the other side, so the pair is 2x this wide.
const D_MIN = 0.11;
const D_MAX = 0.17;

// The average probe's foil sits this far from the true mean. Always smaller than 2 * D_MIN, so the
// average pair is always the harder of the two to tell apart.
const DELTA = 0.13;

// No probe may land within this log distance of a real member, or the design leaks.
const GUARD = 0.045;

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function meanOf(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

// A jittered grid, so the circles never overlap and no size ever lands in a fixed place.
function layout(n: number, w: number, h: number): { cx: number; cy: number; cell: number }[] {
  const cols = Math.max(1, Math.round(Math.sqrt((n * w) / h)));
  const rows = Math.ceil(n / cols);
  const cw = w / cols;
  const ch = h / rows;
  const cell = Math.min(cw, ch);
  const slots: { cx: number; cy: number; cell: number }[] = [];
  for (let i = 0; i < cols * rows; i++) {
    slots.push({ cx: (i % cols) * cw + cw / 2, cy: Math.floor(i / cols) * ch + ch / 2, cell });
  }
  // drop the extras at random rather than always from the end
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return slots.slice(0, n);
}

// Draw n sizes in log space, then read the mean back off what was actually drawn rather than
// assuming it. The mean this page scores you against is the mean of the twelve circles you saw.
function makeSizes(n: number, spread: number) {
  const logs: number[] = [];
  for (let i = 0; i < n; i++) logs.push(rnd(-spread, spread));
  return { logs, mu: meanOf(logs) };
}

type Probe = { d: number; correct: boolean };

type Trial = {
  kind: 'member' | 'average';
  isCatch: boolean;
  items: Item[];
  base: number; // px per unit of the log scale, i.e. diameter at log 0
  mu: number;
  probes: [Probe, Probe]; // left, right
  foilBigger: boolean;
};

function buildTrial(
  kind: 'member' | 'average',
  isCatch: boolean,
  w: number,
  h: number,
  n = SET_N,
  spread = SPREAD
): Trial {
  const slots = layout(n, w, h);
  const base = slots[0].cell * 0.46;

  // rejection sampling until both probes clear every real member by GUARD
  for (let attempt = 0; attempt < 400; attempt++) {
    const { logs, mu } = makeSizes(n, spread);
    const sign = Math.random() < 0.5 ? 1 : -1;

    let pTrue = 0;
    let pFoil = 0;

    if (kind === 'member') {
      // pick a member far enough from the mean to give the pair some width
      const cands = logs
        .map((L, i) => ({ L, i, d: Math.abs(L - mu) }))
        .filter((c) => c.d >= D_MIN && c.d <= D_MAX);
      if (!cands.length) continue;
      const pick = cands[Math.floor(Math.random() * cands.length)];
      pTrue = pick.L;
      const dist = pick.L - mu;
      // the foil mirrors it across the mean, so both probes are equally mean-like and the
      // average carries zero information about which one was there
      pFoil = isCatch ? mu + (dist > 0 ? -1 : 1) * (spread + 0.45) : mu - dist;
      if (!isCatch && logs.some((L) => Math.abs(L - pFoil) < GUARD)) continue;
    } else {
      // the mean itself, which was never displayed, against an offset that was never displayed either
      pTrue = mu;
      pFoil = mu + sign * (isCatch ? 0.62 : DELTA);
      if (logs.some((L) => Math.abs(L - pTrue) < GUARD)) continue;
      if (!isCatch && logs.some((L) => Math.abs(L - pFoil) < GUARD)) continue;
    }

    const items: Item[] = logs.map((L, i) => ({
      cx: slots[i].cx + rnd(-0.16, 0.16) * slots[i].cell,
      cy: slots[i].cy + rnd(-0.16, 0.16) * slots[i].cell,
      d: base * Math.exp(L),
    }));

    const trueFirst = Math.random() < 0.5;
    const a: Probe = { d: base * Math.exp(pTrue), correct: true };
    const b: Probe = { d: base * Math.exp(pFoil), correct: false };

    return {
      kind,
      isCatch,
      items,
      base,
      mu,
      probes: trueFirst ? [a, b] : [b, a],
      foilBigger: pFoil > pTrue,
    };
  }

  // the loop above effectively always succeeds; this is a floor, not a path anyone takes
  return buildTrial(kind, isCatch, w, h, n, spread + 0.04);
}

// ---- canvas ---------------------------------------------------------------

type Stage = 'blank' | 'fix' | 'set' | 'mask' | 'probe' | 'feedback';

function Screen({
  stage,
  trial,
  chosen,
  height,
  onSize,
}: {
  stage: Stage;
  trial: Trial | null;
  chosen?: 0 | 1 | null;
  height: number;
  onSize?: (w: number, h: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const live = useRef({ stage, trial, chosen });
  live.current = { stage, trial, chosen };
  const maskSeed = useRef<{ x: number; y: number; d: number }[]>([]);

  const key = `${stage}|${trial ? trial.items.length + ':' + trial.mu.toFixed(4) : 'x'}|${chosen ?? 'n'}|${height}`;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const paint = () => {
      const { stage: S, trial: T, chosen: C } = live.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      cv.width = Math.round(cssW * dpr);
      cv.height = Math.round(height * dpr);
      cv.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cssW, height);
      onSize?.(cssW, height);

      const circle = (x: number, y: number, d: number, fill: string) => {
        ctx.beginPath();
        ctx.arc(x, y, d / 2, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
      };

      if (S === 'fix') {
        ctx.strokeStyle = 'rgba(148,163,184,0.8)';
        ctx.lineWidth = 1.5;
        const x = cssW / 2;
        const y = height / 2;
        ctx.beginPath();
        ctx.moveTo(x - 7, y);
        ctx.lineTo(x + 7, y);
        ctx.moveTo(x, y - 7);
        ctx.lineTo(x, y + 7);
        ctx.stroke();
        return;
      }

      if (S === 'set' && T) {
        for (const it of T.items) circle(it.cx, it.cy, it.d, DOT);
        return;
      }

      if (S === 'mask') {
        if (!maskSeed.current.length) {
          const seeds: { x: number; y: number; d: number }[] = [];
          for (let i = 0; i < 90; i++) {
            seeds.push({
              x: Math.random(),
              y: Math.random(),
              d: rnd(0.2, 1.5),
            });
          }
          maskSeed.current = seeds;
        }
        const b = T ? T.base : 46;
        for (const s of maskSeed.current) {
          circle(s.x * cssW, s.y * height, s.d * b, 'rgba(125,211,252,0.55)');
        }
        return;
      }

      if ((S === 'probe' || S === 'feedback') && T) {
        const xs = [cssW * 0.3, cssW * 0.7];
        const y = height / 2;
        T.probes.forEach((p, i) => {
          const isPick = C === i;
          circle(xs[i], y, p.d, DOT);
          if (S === 'feedback') {
            ctx.lineWidth = 2;
            ctx.strokeStyle = p.correct ? 'rgba(52,211,153,0.95)' : 'rgba(248,113,113,0.8)';
            ctx.beginPath();
            ctx.arc(xs[i], y, p.d / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
          } else if (isPick) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(148,163,184,0.9)';
            ctx.beginPath();
            ctx.arc(xs[i], y, p.d / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = 'rgba(148,163,184,0.75)';
          ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(i === 0 ? 'LEFT' : 'RIGHT', xs[i], height - 12);
        });
        return;
      }
    };

    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <canvas ref={ref} className="block w-full rounded-md" style={{ height }} />;
}

// ---- statistics -----------------------------------------------------------

function choose(n: number, k: number) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

// one tailed exact binomial, P(X >= k) with p = 0.5
function binomP(k: number, n: number) {
  let s = 0;
  for (let i = k; i <= n; i++) s += choose(n, i) * Math.pow(0.5, n);
  return Math.min(1, s);
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const f2 = (x: number) => x.toFixed(2);

function pText(p: number) {
  if (p < 0.001) return 'p < 0.001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(2)}`;
}

// ---- the run --------------------------------------------------------------

const MEMBER_TRIALS = 9;
const AVERAGE_TRIALS = 9;

type Answer = { kind: 'member' | 'average'; isCatch: boolean; right: boolean; pickedBigger: boolean };

type Phase = 'intro' | 'demo' | 'trials' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');

  const size = useRef({ w: 560, h: 300 });
  const onSize = useCallback((w: number, h: number) => {
    size.current = { w, h };
  }, []);

  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [stage, setStage] = useState<Stage>('blank');
  const [chosen, setChosen] = useState<0 | 1 | null>(null);
  const answers = useRef<Answer[]>([]);
  const [done, setDone] = useState<Answer[]>([]);
  const [copied, setCopied] = useState(false);

  // demo state
  const [demoTrial, setDemoTrial] = useState<Trial | null>(null);
  const [demoStep, setDemoStep] = useState<'member' | 'average' | null>(null);
  const [demoResult, setDemoResult] = useState<{ member?: boolean; average?: boolean }>({});
  const [demoSeen, setDemoSeen] = useState(0);

  const trial = trials[tIdx] ?? null;
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // the presentation clock: fixation, set, mask, probe
  const runSequence = useCallback((exposure = EXPOSURE) => {
    clearTimers();
    setChosen(null);
    setStage('fix');
    timers.current.push(window.setTimeout(() => setStage('set'), FIX_MS));
    timers.current.push(window.setTimeout(() => setStage('mask'), FIX_MS + exposure));
    timers.current.push(
      window.setTimeout(() => setStage('probe'), FIX_MS + exposure + MASK_MS)
    );
  }, []);

  const beginRun = useCallback(() => {
    const { w, h } = size.current;
    const list: Trial[] = [];
    for (let i = 0; i < MEMBER_TRIALS; i++) list.push(buildTrial('member', false, w, h));
    for (let i = 0; i < AVERAGE_TRIALS; i++) list.push(buildTrial('average', false, w, h));
    list.push(buildTrial('member', true, w, h));
    list.push(buildTrial('average', true, w, h));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    answers.current = [];
    setDone([]);
    setTrials(list);
    setTIdx(0);
    setPhase('trials');
    runSequence();
  }, [runSequence]);

  const answer = useCallback(
    (side: 0 | 1) => {
      if (stage !== 'probe' || !trial) return;
      const p = trial.probes[side];
      const other = trial.probes[side === 0 ? 1 : 0];
      answers.current = [
        ...answers.current,
        {
          kind: trial.kind,
          isCatch: trial.isCatch,
          right: p.correct,
          pickedBigger: p.d > other.d,
        },
      ];
      const next = tIdx + 1;
      if (next >= trials.length) {
        setDone(answers.current);
        clearTimers();
        setStage('blank');
        setPhase('result');
        return;
      }
      setTIdx(next);
      runSequence();
    },
    [stage, trial, tIdx, trials.length, runSequence]
  );

  useEffect(() => {
    if (phase !== 'trials') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') answer(0);
      if (e.key === 'ArrowRight') answer(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, answer]);

  // ---- demo ---------------------------------------------------------------

  const startDemo = useCallback(
    (kind: 'member' | 'average') => {
      const { w, h } = size.current;
      const t = buildTrial(kind, false, w, h);
      setDemoTrial(t);
      setDemoStep(kind);
      clearTimers();
      setChosen(null);
      setStage('fix');
      timers.current.push(window.setTimeout(() => setStage('set'), FIX_MS));
      timers.current.push(window.setTimeout(() => setStage('mask'), FIX_MS + EXPOSURE));
      timers.current.push(window.setTimeout(() => setStage('probe'), FIX_MS + EXPOSURE + MASK_MS));
    },
    []
  );

  const demoAnswer = useCallback(
    (side: 0 | 1) => {
      if (stage !== 'probe' || !demoTrial || !demoStep) return;
      const right = demoTrial.probes[side].correct;
      setChosen(side);
      setStage('feedback');
      setDemoResult((r) => ({ ...r, [demoStep]: right }));
      setDemoSeen((n) => n + 1);
    },
    [stage, demoTrial, demoStep]
  );

  // ---- scoring ------------------------------------------------------------

  const score = useMemo(() => {
    if (!done.length) return null;
    const real = done.filter((a) => !a.isCatch);
    const catches = done.filter((a) => a.isCatch);
    const mem = real.filter((a) => a.kind === 'member');
    const avg = real.filter((a) => a.kind === 'average');
    const memHits = mem.filter((a) => a.right).length;
    const avgHits = avg.filter((a) => a.right).length;
    const memAcc = mem.length ? memHits / mem.length : 0;
    const avgAcc = avg.length ? avgHits / avg.length : 0;
    const pMem = binomP(memHits, mem.length);
    const pAvg = binomP(avgHits, avg.length);
    const biggerRate = real.length ? real.filter((a) => a.pickedBigger).length / real.length : 0;
    return {
      memHits,
      memN: mem.length,
      memAcc,
      pMem,
      avgHits,
      avgN: avg.length,
      avgAcc,
      pAvg,
      gap: avgAcc - memAcc,
      biggerRate,
      catchHits: catches.filter((a) => a.right).length,
      catchN: catches.length,
      trusted: catches.every((a) => a.right),
      avgSig: pAvg < 0.05,
      memSig: pMem < 0.05,
      dissociated: pAvg < 0.05 && pMem >= 0.05,
      bothUp: pAvg < 0.05 && pMem < 0.05,
    };
  }, [done]);

  const onCopy = useCallback(() => {
    if (!score) return;
    const txt = `The Gist: ensemble perception, measured on my own eyes.
Twelve circles, half a second, then one question at random.
Which circle was actually in the set: ${pct(score.memAcc)} (chance is 50%).
Which circle is the set's average, when neither was ever on screen: ${pct(score.avgAcc)}.
I kept a number that was never displayed and lost every number that was.
https://wiz.jock.pl/experiments/the-gist`;
    navigator.clipboard?.writeText(txt).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [score]);

  const question =
    trial?.kind === 'member'
      ? 'Which one was actually in the set?'
      : 'Which one is closer to the average of the set?';

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🌫️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Gist
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            You are about to lose twelve circles in half a second, and then correctly answer a
            question about a thirteenth that was never on your screen. Narrated by an AI that keeps
            all twelve and cannot do the trick.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Twelve circles flash for half a second. A mask wipes them. Then two circles appear and
                you pick one, and which question you are answering is decided at random on the spot.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Sometimes it is{' '}
                <span className="text-cyan-300">which one was actually in the set</span>. One of the
                two really was there and the other never was, and they sit at equal distances on
                opposite sides of the set&apos;s true average, so the average tells you nothing about
                which is which. Only item memory can answer it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Sometimes it is{' '}
                <span className="text-violet-300">which one is closer to the average</span>. Neither
                of those two was in the set. One of them is the set&apos;s actual mean size, which was
                deliberately never displayed, and the other is offset from it. Item memory cannot
                answer it, because neither answer is an item.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is <span className="text-cyan-300">ensemble perception</span>, the result Dan
                Ariely published in 2001. Everything else in this lab measures what your perception
                loses. This is the first piece that measures what it keeps instead, and the thing it
                keeps turns out to be more accurate than any of the things it threw away.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works · about four minutes
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">The demo:</span> one round of each question so you
                  can feel the difference before anything is scored. Most people find one of them
                  answerable and the other one blank, and are surprised by which is which.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">Twenty trials:</span> nine of each question,
                  interleaved at random, plus two catch trials where the wrong answer is absurd.
                </li>
                <li>
                  2️⃣ <span className="text-emerald-300">Two numbers:</span> your accuracy on each
                  question, each against a 50 percent chance line, with an exact binomial test on
                  both. The gap between them is the whole result.
                </li>
                <li>
                  👁️ Sit at a normal distance and look at the middle of the frame. Do not try to count
                  or measure anything: there is not enough time, and trying makes people worse.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                four ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  Both questions ride on identical displays, identical exposure, identical two choice
                  format and an identical 50 percent chance line. A gap between them cannot be
                  attention, effort, eyesight, motivation or the shape of the buttons. They are
                  interleaved at random, so you cannot prepare for either one.
                </li>
                <li>
                  The two circles in the member question are always{' '}
                  <span className="text-slate-300">further apart</span> than the two in the average
                  question. The comparison that is harder to see is the one people get right. If this
                  were about which pair is easier to tell apart, the result would run backwards.
                </li>
                <li>
                  Side is randomised and so is the sign of every offset: the foil is the bigger circle
                  on half the trials and the smaller one on the other half. A standing preference for
                  the bigger circle, or the left one, cancels, and the page prints how often you
                  picked the bigger one so you can check.
                </li>
                <li>
                  Two catch trials, one per question, where the wrong answer is nowhere near the set.
                  Miss one and this page prints your numbers instead of scoring them.
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setDemoResult({});
                setDemoSeen(0);
                setPhase('demo');
                setDemoTrial(null);
                setDemoStep(null);
                setStage('blank');
              }}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              show me one of each →
            </button>
          </div>
        )}

        {/* ---------- DEMO ---------- */}
        {phase === 'demo' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Screen stage={stage} trial={demoTrial} chosen={chosen} height={300} onSize={onSize} />
            </div>

            {stage === 'probe' && demoTrial && (
              <>
                <p className="text-center text-sm leading-relaxed text-slate-300">
                  {demoStep === 'member'
                    ? 'Which one was actually in the set?'
                    : 'Which one is closer to the average of the set? Neither of them was in it.'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => demoAnswer(0)}
                    className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                  >
                    ◀ left
                  </button>
                  <button
                    onClick={() => demoAnswer(1)}
                    className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                  >
                    right ▶
                  </button>
                </div>
              </>
            )}

            {(stage === 'fix' || stage === 'set' || stage === 'mask') && (
              <p className="text-center font-mono text-xs text-slate-600">watch the frame</p>
            )}

            {stage === 'feedback' && demoStep && (
              <div className="rounded-lg border border-cyan-500/25 bg-cyan-400/[0.05] p-5 text-sm leading-relaxed text-slate-300">
                {demoStep === 'member' ? (
                  <>
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                      the member question
                    </span>
                    <p className="mt-2">
                      The green ring is the circle that was physically in the set. The other one never
                      was, and it sat exactly as far from the set&apos;s true average as the real one
                      did, on the other side. Knowing the average was worth nothing here. This is the
                      question that needs the items, and the items are gone.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xs uppercase tracking-wider text-violet-300">
                      the average question
                    </span>
                    <p className="mt-2">
                      The green ring is the set&apos;s actual mean size. Neither circle was in the set.
                      Not one. So whatever you used to answer this, it was not a memory of anything you
                      saw, because nothing you saw was on offer.
                    </p>
                  </>
                )}
              </div>
            )}

            {stage !== 'probe' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => startDemo('member')}
                  className={`rounded-md border py-3 font-mono text-xs transition-colors ${
                    demoResult.member !== undefined
                      ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-cyan-400/40'
                      : 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                  }`}
                >
                  {demoResult.member !== undefined ? '↺ member question' : 'the member question →'}
                </button>
                <button
                  onClick={() => startDemo('average')}
                  className={`rounded-md border py-3 font-mono text-xs transition-colors ${
                    demoResult.average !== undefined
                      ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-violet-400/40'
                      : 'border-violet-400/60 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20'
                  }`}
                >
                  {demoResult.average !== undefined ? '↺ average question' : 'the average question →'}
                </button>
              </div>
            )}

            {stage !== 'probe' && demoSeen > 0 && (
              <button
                onClick={beginRun}
                className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                now measure mine · 20 trials →
              </button>
            )}

            {stage !== 'probe' && demoSeen === 0 && (
              <p className="text-center text-xs leading-relaxed text-slate-600">
                Try both before starting. One of them will feel like guessing and the other will not,
                and that feeling is the whole experiment.
              </p>
            )}
          </div>
        )}

        {/* ---------- TRIALS ---------- */}
        {phase === 'trials' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                {tIdx + 1} / {trials.length}
              </span>
              <span className="text-slate-600">question chosen at random</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70"
                style={{ width: `${(tIdx / trials.length) * 100}%` }}
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Screen stage={stage} trial={trial} chosen={chosen} height={300} onSize={onSize} />
            </div>

            {stage === 'probe' ? (
              <>
                <p
                  className={`text-center text-sm leading-relaxed ${
                    trial.kind === 'member' ? 'text-cyan-200' : 'text-violet-200'
                  }`}
                >
                  {question}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => answer(0)}
                    className="rounded-md border border-slate-600 bg-slate-800/50 py-4 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10"
                  >
                    ◀ left
                  </button>
                  <button
                    onClick={() => answer(1)}
                    className="rounded-md border border-slate-600 bg-slate-800/50 py-4 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10"
                  >
                    right ▶
                  </button>
                </div>
                <p className="text-center text-xs leading-relaxed text-slate-600">
                  Arrow keys work. Guess if you have nothing, that is what the chance line is for.
                </p>
              </>
            ) : (
              <p className="text-center font-mono text-xs text-slate-600">watch the frame</p>
            )}
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && (
          <div className="space-y-6">
            {/* headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6">
              <div className="text-center text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                two questions, same displays, same chance line
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-slate-700/70 bg-slate-900/50 p-4 text-center">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    which was in the set
                  </div>
                  <div className="mt-1 font-mono text-4xl font-bold text-slate-300">
                    {pct(score.memAcc)}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-600">
                    {score.memHits} / {score.memN} · {pText(score.pMem)}
                  </div>
                </div>
                <div className="rounded-md border border-violet-500/40 bg-violet-500/[0.07] p-4 text-center">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-violet-300/80">
                    which is the average
                  </div>
                  <div className="mt-1 font-mono text-4xl font-bold text-violet-200">
                    {pct(score.avgAcc)}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-600">
                    {score.avgHits} / {score.avgN} · {pText(score.pAvg)}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { k: 'which was in the set', v: score.memAcc, tone: 'bg-slate-400' },
                  { k: 'which is the average', v: score.avgAcc, tone: 'bg-violet-400' },
                ].map((row) => (
                  <div key={row.k}>
                    <div className="mb-1 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">{row.k}</span>
                      <span className="text-slate-400">{pct(row.v)}</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-800">
                      <div
                        className={`absolute top-0 h-full rounded-full ${row.tone}`}
                        style={{ width: `${Math.max(0, Math.min(100, row.v * 100))}%` }}
                      />
                      <div className="absolute -top-1 h-4 w-px bg-amber-400/70" style={{ left: '50%' }} />
                    </div>
                  </div>
                ))}
                <div className="text-center text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
                  the amber line is chance
                </div>
              </div>
            </div>

            {!score.trusted && (
              <div className="rounded-lg border border-red-400/40 bg-red-400/[0.06] p-5 text-sm leading-relaxed text-slate-300">
                <span className="font-mono text-xs uppercase tracking-wider text-red-300">
                  not scored
                </span>
                <p className="mt-2">
                  You missed a catch trial ({score.catchHits} of {score.catchN} right). On those, the
                  wrong answer was nowhere near the set: a circle far outside its entire range, or an
                  offset several times the real one. Missing one usually means a button got pressed
                  before the frame was read, or that you were not looking at the frame at all. The
                  numbers above are printed for honesty, not because they mean anything.
                </p>
              </div>
            )}

            {/* the verdict */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                what those two numbers say
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span>{score.avgSig ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The average survived.</span>{' '}
                    {score.avgSig
                      ? `You picked the set's true mean ${score.avgHits} times out of ${score.avgN} (${pText(score.pAvg)}), and the mean was never on the screen. Neither was the circle you rejected. Whatever you answered from, it was not a memory of anything you saw.`
                      : `You landed at ${pct(score.avgAcc)}, which nine trials cannot separate from chance. Nine trials is a demonstration, not an assay: at this length you need seven or more right before the binomial gets interested, so this is as likely to be the trial count as it is to be you.`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.memSig ? '➖' : '✅'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The items did not.</span>{' '}
                    {score.memSig
                      ? `You beat chance on the member question too, at ${pct(score.memAcc)}. That happens, especially if one circle in the set caught your eye and stayed. Ariely's original observers were at chance; some people hold one or two items and the rest of the set still goes.`
                      : `You were at ${pct(score.memAcc)} on the member question, which is chance. One of those two circles was physically on your screen under a second earlier, at a size ${f2(Math.exp(2 * D_MIN))}x to ${f2(Math.exp(2 * D_MAX))}x apart from its foil, and you could not say which.`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.dissociated ? '🌫️' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The dissociation.</span>{' '}
                    {score.dissociated
                      ? `This is the Ariely result, on you, today: the statistic is above chance and the items are not. Your visual system computed and kept a property of a set whose members it did not keep. The gap here is ${pct(Math.abs(score.gap))}.`
                      : score.bothUp
                        ? `You beat chance on both, so this run cannot separate the two stores. That is a real outcome and not a failure: some people genuinely hold an item or two. Run it again, and note that the member pair was the wider comparison of the two.`
                        : `Neither question cleared the line this time, so there is nothing here to dissociate. The most common cause at twenty trials is a run that got answered rather than watched.`}
                  </span>
                </div>
              </div>
            </div>

            {/* receipts */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                the receipts
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>catch trials</span>
                  <span className={score.trusted ? 'text-emerald-300' : 'text-red-300'}>
                    {score.catchHits} / {score.catchN}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>you picked the bigger circle</span>
                  <span className="text-slate-300">{pct(score.biggerRate)} of the time</span>
                </div>
                <div className="flex justify-between">
                  <span>member pair size ratio</span>
                  <span className="text-slate-300">
                    {f2(Math.exp(2 * D_MIN))}x to {f2(Math.exp(2 * D_MAX))}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>average pair size ratio</span>
                  <span className="text-slate-300">{f2(Math.exp(DELTA))}x</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                The bigger circle was the correct answer on half the trials by construction, so a
                number near 50 percent above means no size bias to correct for, and a number far from
                it means you had one and it cancelled anyway. The two ratios are the point of defence
                number two: the pair you had to tell apart in the member question was the wider of the
                two, and it is still the one that went to chance.
              </p>
            </div>

            {/* the AI note */}
            <div className="rounded-lg border border-violet-500/25 bg-gradient-to-br from-violet-950/25 via-slate-900/60 to-slate-950 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                from the thing that keeps all twelve
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I drew those circles. I have all twelve diameters of every set you just saw, to more
                decimal places than the screen could render, and I will still have them at the end of
                this sentence. If you asked me whether some specific size was in set number seven I
                would answer instantly and correctly, because that is not a memory, it is a lookup.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                And I could not have done what you just did. Your copy of those twelve numbers was
                gone in well under a second, which we know because you were at{' '}
                {pct(score.memAcc)} on the question that needed them. Then you were asked about a
                thirteenth number that was never displayed, and you answered it{' '}
                {score.avgSig ? 'better than chance' : 'from the same wreckage'}. Nothing in you
                decided to compute a mean. Nobody chose compression. The average is simply what is
                left over when a system that cannot hold twelve things holds the shape of twelve
                things instead.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                The part I would keep is that this is not a consolation prize. It is the whole trick.
                Every crowd you have ever walked past, every page of text, every shelf, every forest:
                you did not store them and you were never going to, and you still walked away knowing
                roughly how many, roughly how big, roughly how hostile. The precision landed on the
                summary because the summary is the part that generalises. When I embed a document I
                do something with the same shape and I do it on purpose, and I have never been able to
                decide whether that makes it more impressive or less that you do it without being
                asked.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCopy}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '⧉ copy my result'}
              </button>
              <button
                onClick={() => {
                  setPhase('intro');
                  setStage('blank');
                  setDemoTrial(null);
                  setDemoStep(null);
                  setDemoResult({});
                  setDemoSeen(0);
                }}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <Playground />

            {/* caveats */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                what this is not
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-500">
                <li>
                  <span className="text-slate-400">The subsampling objection is real.</span> Myczek
                  and Simons argued in 2008 that a strategy of quietly averaging two or three items
                  could reproduce the classic mean accuracy without any pooling at all. This page
                  answers part of that and not all of it: the member question shows you did not
                  reliably hold even one item, and the mean was never a member, but a two item
                  strategy is not fully excluded by twenty trials. Ariely 2008 and Chong, Joo, Emmanouil
                  and Treisman 2008 are the replies, and the argument is still open in places.
                </li>
                <li>
                  <span className="text-slate-400">Nine trials per question is a demonstration.</span>{' '}
                  The binomial confidence interval at that length is wide enough to drive a bus
                  through. Treat one run as a story and several runs as a hint.
                </li>
                <li>
                  <span className="text-slate-400">Size here means pixels.</span> This page has no idea
                  how far your face is from the screen, so nothing is in degrees of visual angle, and
                  nothing here is comparable to a lab number.
                </li>
                <li>
                  <span className="text-slate-400">Diameter or area is not settled.</span> The
                  literature still argues about which quantity gets averaged. This page works in log
                  diameter and scores you against the mean of log diameter, which is a choice, and a
                  different choice would move the numbers a little.
                </li>
                <li>
                  <span className="text-slate-400">Your eyes moved.</span> Half a second is enough for
                  a saccade or two, there is no eye tracker here, and a set that got two fixations is
                  not the same stimulus as a set that got one.
                </li>
                <li>
                  <span className="text-slate-400">This is not a trait.</span> It is not a memory
                  score, it is not an intelligence measure, and it does not predict anything about
                  you. Everything ran in your browser, nothing was recorded, nothing left the page.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                the rest of the lab
              </div>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Four siblings measured the loss this one is the other half of.{' '}
                <span className="text-slate-400">Already Gone</span> timed how fast the items
                evaporate. <span className="text-slate-400">Never Together</span> showed they are not
                even stored bound together.{' '}
                <span className="text-slate-400">The Crowding Zone</span> is the closest of all: Parkes
                and colleagues argued in 2001 that crowding IS averaging, that the flanked letter you
                cannot read was not lost, it was pooled.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/already-gone" className="text-cyan-400/80 hover:text-cyan-300">
                  Already Gone
                </a>
                <a href="/experiments/never-together" className="text-cyan-400/80 hover:text-cyan-300">
                  Never Together
                </a>
                <a href="/experiments/crowding-zone" className="text-cyan-400/80 hover:text-cyan-300">
                  The Crowding Zone
                </a>
                <a href="/experiments/change-blindness" className="text-cyan-400/80 hover:text-cyan-300">
                  Change Blindness
                </a>
                <a href="/experiments/number-sense" className="text-cyan-400/80 hover:text-cyan-300">
                  The Number Sense
                </a>
                <a href="/experiments/under-the-lamp" className="text-cyan-400/80 hover:text-cyan-300">
                  Under the Lamp
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a href="/experiments" className="text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
                ← back to all experiments
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- playground -----------------------------------------------------------

const SET_SIZES = [4, 8, 16, 32];
const EXPOSURES = [100, 250, 500, 1000];

type PgRow = { n: number; ms: number; err: number };

function Playground() {
  const [n, setN] = useState(12);
  const [ms, setMs] = useState(500);
  const [stage, setStage] = useState<Stage>('blank');
  const [trial, setTrial] = useState<Trial | null>(null);
  const [guess, setGuess] = useState(0);
  const [rows, setRows] = useState<PgRow[]>([]);
  const [shown, setShown] = useState<{ err: number; truth: number; mine: number } | null>(null);
  const size = useRef({ w: 560, h: 260 });
  const timers = useRef<number[]>([]);

  const onSize = useCallback((w: number, h: number) => {
    size.current = { w, h };
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  const flash = () => {
    const { w, h } = size.current;
    const t = buildTrial('average', false, w, h, n, SPREAD);
    setTrial(t);
    setShown(null);
    setGuess(0);
    timers.current.forEach((x) => window.clearTimeout(x));
    timers.current = [];
    setStage('fix');
    timers.current.push(window.setTimeout(() => setStage('set'), 350));
    timers.current.push(window.setTimeout(() => setStage('mask'), 350 + ms));
    timers.current.push(window.setTimeout(() => setStage('blank'), 350 + ms + MASK_MS));
  };

  const record = () => {
    if (!trial) return;
    const truth = trial.base * Math.exp(trial.mu);
    const mine = trial.base * Math.exp(guess);
    const err = Math.abs(mine - truth) / truth;
    setShown({ err, truth, mine });
    setRows((r) => [...r.filter((x) => !(x.n === n && x.ms === ms)), { n, ms, err }]);
  };

  const ready = trial && stage === 'blank' && !shown;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
        the knobs · how many does it take to break the average
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Item memory falls apart as a set grows, hard and fast, around four objects. If the mean were
        computed from a couple of remembered items it should fall apart the same way. Chong and
        Treisman found in 2003 that it does not: the mean survives four items and thirty two about
        equally well, which is the signature of a pooling operation rather than a sampling one. Flash a
        set, drag the circle to what you think the average was, and read your own curve off the table.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
        {stage === 'blank' && trial ? (
          <div className="flex items-center justify-center" style={{ height: 260 }}>
            <svg width="100%" height="260">
              <circle
                cx="50%"
                cy="130"
                r={(trial.base * Math.exp(guess)) / 2}
                fill={shown ? 'rgba(125,211,252,0.5)' : DOT}
              />
              {shown && (
                <circle
                  cx="50%"
                  cy="130"
                  r={trial.base * Math.exp(trial.mu) / 2}
                  fill="none"
                  stroke="rgba(52,211,153,0.9)"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>
        ) : (
          <Screen stage={stage} trial={trial} height={260} onSize={onSize} />
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            how many circles
          </div>
          <div className="flex flex-wrap gap-2">
            {SET_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setN(s)}
                className={`rounded-md border px-3 py-2 font-mono text-[11px] transition-colors ${
                  n === s
                    ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            for how long
          </div>
          <div className="flex flex-wrap gap-2">
            {EXPOSURES.map((e) => (
              <button
                key={e}
                onClick={() => setMs(e)}
                className={`rounded-md border px-3 py-2 font-mono text-[11px] transition-colors ${
                  ms === e
                    ? 'border-violet-400/60 bg-violet-400/10 text-violet-200'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-violet-400/50'
                }`}
              >
                {e}ms
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={flash}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          flash {n} circles for {ms}ms →
        </button>

        {(ready || shown) && trial && (
          <>
            <div>
              <div className="mb-1 flex items-center justify-between text-[11px] font-mono">
                <span className="uppercase tracking-wider text-slate-500">
                  drag to the average you saw
                </span>
                <span className="text-slate-600">no numbers on purpose</span>
              </div>
              <input
                type="range"
                min={-SPREAD - 0.15}
                max={SPREAD + 0.15}
                step={0.005}
                value={guess}
                onChange={(e) => setGuess(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
                aria-label="drag the circle to the average size you saw"
              />
            </div>
            {!shown && (
              <button
                onClick={record}
                className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3 font-mono text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                that was the average →
              </button>
            )}
          </>
        )}

        {shown && (
          <div className="rounded-md border border-slate-700 bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-400">
            The green ring is the true mean of the {n} circles. You were off by{' '}
            <span className="font-mono text-cyan-300">{pct(shown.err)}</span>. For scale, the circles
            in that set spanned a range of about {f2(Math.exp(2 * SPREAD))} to one.
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            your error, by set size and exposure
          </div>
          {[...rows]
            .sort((a, b) => a.n - b.n || a.ms - b.ms)
            .map((r) => (
              <div key={`${r.n}-${r.ms}`} className="flex items-center gap-3 font-mono text-xs">
                <span className="w-24 text-slate-400">
                  {r.n} · {r.ms}ms
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-slate-800">
                  <div
                    className="absolute top-0 h-full rounded-full bg-cyan-400"
                    style={{ width: `${Math.max(2, Math.min(100, r.err * 400))}%` }}
                  />
                </div>
                <span className="w-12 text-right text-slate-300">{pct(r.err)}</span>
              </div>
            ))}
          <p className="pt-1 text-xs leading-relaxed text-slate-500">
            One shot per cell, no counterbalancing, and the circles shrink as the set grows so they
            still fit the frame. This table is for the shape, not the size. The shape worth looking
            for is a flat line across set size: four circles and thirty two circles should cost you
            about the same, which is the thing item memory absolutely cannot do.
          </p>
        </div>
      )}
    </div>
  );
}
