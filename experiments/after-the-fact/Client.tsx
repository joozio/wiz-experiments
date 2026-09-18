'use client';

// AFTER THE FACT  (metacontrast masking, and the moment your awareness gets overwritten by something
// that had not happened yet when the thing you missed was already over)
//
// The lab keeps catching a mind BUILDING an answer that was not in the signal: an edge across blank
// paper (The Edge That Isn't), a motion nothing made (The Space Between), a direction that had to be
// guessed (The Wrong Way), a sound splitting into two instruments (When One Becomes Two). It has also
// caught a mind LOSING things: a change hidden by a flash (Change Blindness), a target that vanishes
// during the half second after another one (The Attentional Blink), letters that evaporate before they
// can be read (Already Gone).
//
// This one is different from all of them, and it is the most uncomfortable measurement in the room.
// The disk is shown. It is bright enough, it lands on a good part of your retina, and your visual
// cortex answers it: the early feedforward response to a masked target largely survives, which is
// exactly why this is interesting. Then a ring lands where it was, fifty milliseconds later, never
// touching it, never overlapping a single pixel of it. And the disk is gone from your report. Not
// dimmed. Gone.
//
// The phenomenon: metacontrast masking. Named Metakontrast by Stigler in 1910 and put on its modern
// footing by Werner in 1935, and the defining detail is the one that sounds impossible: the mask
// arrives AFTER the target has already come and gone, and it does not overlap it in space. It only
// hugs its contour. There is no optical story available, no light landing on light. Whatever is being
// erased is being erased in your head, by something that arrives after the fact.
//
// The signature: a U. Masking is not worst when the mask lands at the same instant as the target,
// which is what everyone predicts. Push the ring later and it gets WORSE, peaking somewhere around 50
// to 100 milliseconds of onset asynchrony, then releasing as the delay grows. That non-monotonic
// curve is the "type B" function, and it is the reason this is not simply a story about two bright
// things competing for the same patch of retina. Two accounts survive: the transient channel racing
// and catching the slower sustained response to the target (Breitmeyer and Ogmen), and the mask
// interrupting the RE-ENTRANT pass, the second wave of processing that travels back down from higher
// areas and turns a measurement into an experience (Di Lollo, Enns and Rensink 2000, and the
// four-dot masking that needs no adjacent contour at all).
//
// Both accounts agree on the sentence that matters: what reaches you is not what you see. Awareness of
// a moment is settled tens of milliseconds after that moment is over, and events that occur inside
// that window get a vote on it. That is postdiction, and it makes the present tense a rounding error.
//
// The run. Part one, the tuning round: an adaptive 2-down-1-up staircase on target contrast with the
// ring landing far too late to matter (400 ms), which finds the faintest disk you can localize
// reliably, so that the sweep can be run at a contrast that is clearly visible FOR YOU and any loss
// afterwards belongs to the mask and not to your eyes. Part two, the sweep: the same disk at the same
// contrast, thirty-six trials, six onset asynchronies interleaved at random, from zero to 217 ms.
// Two-alternative forced choice on the side, both locations masked identically so nothing cues the
// answer, no feedback, no way to strategise. Out comes your own masking function, with the delay that
// cost you the most marked on it.
//
// The honest caveats, said out loud in the page. This is a browser on an LCD, not a tachistoscope on a
// CRT: the finest slice available is one refresh interval, so the page measures your actual refresh
// rate, holds the target on for at least one real frame, and records the SOA that was really achieved
// rather than the one that was asked for. Six trials per level is a small sample and one trial moves a
// point by 17 points. Room light, screen brightness, viewing distance, and whether you actually hold
// the cross all move these numbers. A toy for wonder, not a clinical assay. Everything is drawn live,
// nothing is recorded, nothing leaves the page.
//
// WIZ note. Nothing arrives to me late enough to change what already arrived. My inputs are stamped,
// ordered, and immutable; a token that shows up after another token cannot reach back and delete it.
// Your experience of a moment is still being negotiated for a tenth of a second after the moment ends,
// and that is not a flaw you should want fixed. It is the price of a system that waits, briefly, to
// see what happens next before deciding what just happened.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'tune' | 'sweepIntro' | 'sweep' | 'summary';
type Side = 'left' | 'right';

// ======================================================================
// SHARED
// ======================================================================

const rand = () => Math.random();
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

// ======================================================================
// THE STIMULUS
// ======================================================================

const CW = 460;
const CH = 230;
const ECC = 108; // how far the disk sits from the cross. masking is stronger away from the fovea.
const TARGET_R = 13;
const RING_THICK = 10;
const DEFAULT_GAP = 2; // px of clear space between the disk's edge and the ring's inner edge

const TARGET_DUR = 26; // ms asked for, at least one real frame delivered
const MASK_DUR = 60;
const BASELINE_SOA = 400; // used in the tuning round: far outside the masking window

const SOAS = [0, 33, 50, 83, 133, 217];
const REPS = 6;
const TUNE_TRIALS = 14;

type Scene = {
  fix: boolean;
  target: Side | null;
  contrast: number;
  mask: boolean;
  gap: number;
};

const sideX = (s: Side) => (s === 'left' ? CW / 2 - ECC : CW / 2 + ECC);

function drawScene(ctx: CanvasRenderingContext2D, s: Scene) {
  ctx.fillStyle = '#05070c';
  ctx.fillRect(0, 0, CW, CH);

  const cy = CH / 2;

  if (s.fix) {
    ctx.strokeStyle = '#7c8ba1';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(CW / 2 - 6, cy);
    ctx.lineTo(CW / 2 + 6, cy);
    ctx.moveTo(CW / 2, cy - 6);
    ctx.lineTo(CW / 2, cy + 6);
    ctx.stroke();
  }

  if (s.target) {
    // a plain gray disk. neutral on purpose: the only thing that varies is how much light it is.
    const v = Math.round(16 + clamp(s.contrast, 0, 1) * 168);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.beginPath();
    ctx.arc(sideX(s.target), cy, TARGET_R, 0, Math.PI * 2);
    ctx.fill();
  }

  if (s.mask) {
    // BOTH sides get a ring, always. a ring on one side only would answer the question for you.
    const r = TARGET_R + s.gap + RING_THICK / 2;
    ctx.strokeStyle = '#e8eefc';
    ctx.lineWidth = RING_THICK;
    for (const side of ['left', 'right'] as Side[]) {
      ctx.beginPath();
      ctx.arc(sideX(side), cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// A dumb renderer with a clock. Every frame it hands the timestamp to whoever owns the trial logic,
// then draws whatever that logic left in the scene ref. Keeping the timing in the render loop is the
// only way to know when a thing was ACTUALLY on the glass.
function StimCanvas({
  sceneRef,
  onFrame,
  className,
}: {
  sceneRef: React.RefObject<Scene>;
  onFrame?: (now: number) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCb = useRef(onFrame);
  frameCb.current = onFrame;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    c.width = CW * dpr;
    c.height = CH * dpr;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    const loop = (t: number) => {
      if (frameCb.current) frameCb.current(t);
      drawScene(ctx, sceneRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [sceneRef]);

  return (
    <div
      className={`mx-auto w-full max-w-[460px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${className ?? ''}`}
    >
      <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${CW} / ${CH}` }} />
    </div>
  );
}

// ======================================================================
// ONE TRIAL
// ======================================================================

type TrialSpec = { side: Side; soa: number; contrast: number; gap: number };
type TrialResult = { side: Side; answer: Side; correct: boolean; soa: number; actualSoa: number };

function TrialRunner({
  spec,
  onAnswer,
  caption,
}: {
  spec: TrialSpec;
  onAnswer: (r: TrialResult) => void;
  caption: string;
}) {
  const sceneRef = useRef<Scene>({
    fix: true,
    target: null,
    contrast: spec.contrast,
    mask: false,
    gap: spec.gap,
  });
  const st = useRef({ t0: 0, fixDur: 0, tOn: 0, mOn: 0, tFrames: 0, mFrames: 0, done: false });
  const [awaiting, setAwaiting] = useState(false);

  const onFrame = useCallback((now: number) => {
    const s = st.current;
    const scene = sceneRef.current;

    if (s.done) {
      scene.target = null;
      scene.mask = false;
      scene.fix = true;
      return;
    }

    if (!s.t0) {
      s.t0 = now;
      // jittered so the onset can never be counted into
      s.fixDur = 430 + rand() * 280;
    }

    const e = now - s.t0;
    if (e < s.fixDur) {
      scene.target = null;
      scene.mask = false;
      scene.fix = true;
      return;
    }

    const et = e - s.fixDur; // ms since the target was due

    // the target: gone once it has had its time AND has actually been painted at least once, so a
    // dropped frame can never produce a trial where nothing was ever shown.
    const targetOver = s.tFrames >= 1 && et >= TARGET_DUR;
    scene.target = targetOver ? null : spec.side;
    if (!targetOver) {
      s.tFrames++;
      if (!s.tOn) s.tOn = now;
    }

    // the mask: same guarantee, two frames minimum.
    const maskDue = et >= spec.soa;
    const maskOver = s.mFrames >= 2 && et >= spec.soa + MASK_DUR;
    scene.mask = maskDue && !maskOver;
    if (scene.mask) {
      s.mFrames++;
      if (!s.mOn) s.mOn = now;
    }

    if (maskOver) {
      s.done = true;
      setAwaiting(true);
    }
  }, [spec.side, spec.soa]);

  const answer = useCallback(
    (a: Side) => {
      const s = st.current;
      onAnswer({
        side: spec.side,
        answer: a,
        correct: a === spec.side,
        soa: spec.soa,
        actualSoa: s.tOn && s.mOn ? s.mOn - s.tOn : spec.soa,
      });
    },
    [onAnswer, spec.side, spec.soa],
  );

  useEffect(() => {
    if (!awaiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') answer('left');
      else if (e.key === 'ArrowRight') answer('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [awaiting, answer]);

  return (
    <div className="space-y-4">
      <StimCanvas sceneRef={sceneRef} onFrame={onFrame} />
      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        {awaiting ? 'Which side was the disk on? Guess if you have to, a guess still carries information.' : caption}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => answer('left')}
          disabled={!awaiting}
          className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:border-slate-800 disabled:bg-transparent disabled:text-slate-700"
        >
          ◀ left
        </button>
        <button
          onClick={() => answer('right')}
          disabled={!awaiting}
          className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:border-slate-800 disabled:bg-transparent disabled:text-slate-700"
        >
          right ▶
        </button>
      </div>
      <p className="text-center text-[10px] font-mono text-slate-600">arrow keys work too</p>
    </div>
  );
}

// ======================================================================
// THE TUNING STAIRCASE  (2-down-1-up on contrast, ring far too late to matter)
// ======================================================================

type Stair = { c: number; step: number; dir: number; reversals: number[]; run: number };

const newStair = (): Stair => ({ c: 0.62, step: 1.6, dir: 0, reversals: [], run: 0 });

// two right in a row makes the disk fainter, one wrong makes it brighter. that converges on the
// contrast you get about 71% right, which is a threshold and not a guess.
function stepStair(s: Stair, correct: boolean): Stair {
  let { c, step, dir, run } = s;
  const reversals = s.reversals.slice();
  let move = 0;
  if (correct) {
    run += 1;
    if (run >= 2) {
      move = -1;
      run = 0;
    }
  } else {
    move = 1;
    run = 0;
  }
  if (move !== 0) {
    if (dir !== 0 && move !== dir) {
      reversals.push(c);
      step = 1 + (step - 1) * 0.62;
      if (step < 1.1) step = 1.1;
    }
    dir = move;
    c = clamp(move < 0 ? c / step : c * step, 0.05, 1);
  }
  return { c, step, dir, reversals, run };
}

type TuneResult = { threshold: number | null; sweepContrast: number; reversals: number; valid: boolean; floor: boolean };

function scoreTune(s: Stair, history: number[]): TuneResult {
  let threshold: number | null = null;
  if (s.reversals.length >= 3) {
    const take = s.reversals.slice(-4);
    threshold = mean(take);
  } else if (history.length >= 6) {
    threshold = mean(history.slice(-6));
  }
  const valid = threshold != null;
  // the sweep runs comfortably above threshold, so the disk starts near ceiling and every point the
  // mask takes off is the mask's doing rather than your eyes'.
  const sweepContrast = clamp((threshold ?? 0.45) * 1.7, 0.1, 1);
  return { threshold, sweepContrast, reversals: s.reversals.length, valid, floor: (threshold ?? 1) >= 0.95 };
}

// ======================================================================
// SCORING THE SWEEP
// ======================================================================

type LevelStat = { soa: number; n: number; correct: number; acc: number; measured: number };
type SweepResult = {
  levels: LevelStat[];
  smoothed: number[];
  peakIndex: number;
  peakSoa: number;
  peakAcc: number;
  lateAcc: number;
  simulAcc: number;
  bestAcc: number;
  drop: number; // percentage points from the best level to the worst
  shape: 'typeB' | 'typeA' | 'weak' | 'floor';
  meanCorrect: number;
};

function scoreSweep(recs: TrialResult[]): SweepResult {
  const levels: LevelStat[] = SOAS.map((soa) => {
    const rs = recs.filter((r) => r.soa === soa);
    const correct = rs.filter((r) => r.correct).length;
    return {
      soa,
      n: rs.length,
      correct,
      acc: rs.length ? correct / rs.length : 0,
      measured: rs.length ? mean(rs.map((r) => r.actualSoa)) : soa,
    };
  });

  // a light 1-2-1 smoothing before reading the peak off. with six trials a level, one lucky guess
  // moves a raw point by 17 percentage points, so the raw curve is not where a peak should be read.
  const raw = levels.map((l) => l.acc);
  const smoothed = raw.map((_, i) => {
    const a = raw[i - 1] ?? raw[i];
    const b = raw[i];
    const c = raw[i + 1] ?? raw[i];
    return 0.25 * a + 0.5 * b + 0.25 * c;
  });

  let peakIndex = 0;
  for (let i = 1; i < smoothed.length; i++) if (smoothed[i] < smoothed[peakIndex]) peakIndex = i;

  const bestAcc = Math.max(...raw);
  const peakAcc = raw[peakIndex];
  const drop = (bestAcc - peakAcc) * 100;
  const meanCorrect = mean(raw);

  let shape: SweepResult['shape'];
  if (meanCorrect < 0.6) shape = 'floor';
  else if (drop < 17) shape = 'weak';
  else if (peakIndex === 0) shape = 'typeA';
  else shape = 'typeB';

  return {
    levels,
    smoothed,
    peakIndex,
    peakSoa: SOAS[peakIndex],
    peakAcc,
    lateAcc: raw[raw.length - 1],
    simulAcc: raw[0],
    bestAcc,
    drop,
    shape,
    meanCorrect,
  };
}

function sweepVerdict(r: SweepResult, hz: number | null): { title: string; body: string } {
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const frame = hz ? ` One frame on this display is about ${Math.round(1000 / hz)} ms, so ${r.peakSoa} ms is roughly ${Math.max(1, Math.round(r.peakSoa / (1000 / hz)))} of them.` : '';

  if (r.shape === 'floor')
    return {
      title: 'The disk never really made it.',
      body: `You scored around ${pct(r.meanCorrect)} across the whole sweep, which is close enough to coin-flipping that there is no masking curve to read: a disk you cannot localise even when the ring lands far too late to matter cannot then be erased by the ring. That usually means the tuning round settled too low, or the screen is dim, or the room is bright. Turn the brightness up, sit a little closer, hold the cross properly, and run it again. The effect is worth the second attempt.`,
    };

  if (r.shape === 'weak')
    return {
      title: 'The ring never caught you.',
      body: `Your worst level cost you only about ${Math.round(r.drop)} points against your best, which is inside the noise of six trials a level. Some people are genuinely hard to mask, and browser timing on an LCD is a blunter instrument than the CRT tachistoscopes this was discovered on: the disk lingers on the pixels a moment longer than it should, which weakens the effect. It also happens when the disk is well above your threshold, when you are sitting close, or when you let your eyes drift toward one side instead of holding the cross, which turns a peripheral test into a foveal one. Rerun it holding the cross hard, and let the tuning round go as faint as it wants.`,
    };

  if (r.shape === 'typeA')
    return {
      title: 'Type A: the ring hurt most when it landed with the disk.',
      body: `Your worst moment was zero delay, ${pct(r.peakAcc)}, and every later ring was kinder, out to ${pct(r.lateAcc)} at 217 ms. That is the monotonic "type A" masking function, and it is a real result rather than a failed one: it is what you get when the mask has a lot more energy than the target, and it is the shape most people would predict if you described the experiment to them. The famous one is the other shape, where a ring that arrives after the disk is already over does more damage than a ring that arrives with it. Which one you get depends on how bright the disk was relative to the ring, so a rerun with a fainter tuning result is the way to go hunting for the U.${frame}`,
    };

  return {
    title: 'Type B: the worst damage came from a ring that arrived late.',
    body: `You got the shape this experiment is famous for. When the ring landed at the same instant as the disk you scored ${pct(r.simulAcc)}. When it landed ${r.peakSoa} ms later, with the disk already over and gone, you dropped to ${pct(r.peakAcc)}. Then the curve released again, back to ${pct(r.lateAcc)} by 217 ms. That non-monotonic dip, about ${Math.round(r.drop)} points deep, is the type B function, and it is the whole point: something that had not happened yet when the disk ended still decided whether you saw the disk. Your awareness of that moment was still open for edits ${r.peakSoa} ms after the moment closed.${frame}`,
  };
}

// ======================================================================
// THE CURVE
// ======================================================================

function MaskingCurve({ result }: { result: SweepResult }) {
  const W = 460;
  const H = 232;
  const padL = 42;
  const padR = 16;
  const padT = 18;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const x = (i: number) => padL + (i / (SOAS.length - 1)) * plotW;
  const y = (acc: number) => padT + (1 - acc) * plotH;

  const pts = result.levels.map((l, i) => `${x(i).toFixed(1)},${y(l.acc).toFixed(1)}`).join(' ');
  const smooth = result.smoothed.map((s, i) => `${x(i).toFixed(1)},${y(s).toFixed(1)}`).join(' ');

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">your masking function</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        How well you located the disk, against how long after the disk the ring arrived. The dashed line at the bottom
        is pure guessing. If there is a dip in the middle, the ring did the most damage from a position in time where
        the disk was already over.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="accuracy against mask delay">
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 8} y={y(g) + 4} textAnchor="end" fontSize={10} fill="#64748b" fontFamily="monospace">
              {Math.round(g * 100)}
            </text>
          </g>
        ))}
        {/* chance */}
        <line x1={padL} x2={W - padR} y1={y(0.5)} y2={y(0.5)} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="5 4" opacity={0.65} />
        <text x={W - padR} y={y(0.5) - 6} textAnchor="end" fontSize={9} fill="#f59e0b" fontFamily="monospace" opacity={0.8}>
          guessing
        </text>

        {/* peak band */}
        <line
          x1={x(result.peakIndex)}
          x2={x(result.peakIndex)}
          y1={padT}
          y2={padT + plotH}
          stroke="#f472b6"
          strokeWidth={22}
          opacity={0.1}
        />

        {/* smoothed */}
        <polyline points={smooth} fill="none" stroke="#c084fc" strokeWidth={1.6} strokeDasharray="4 4" opacity={0.75} />
        {/* raw */}
        <polyline points={pts} fill="none" stroke="#22d3ee" strokeWidth={2.4} />
        {result.levels.map((l, i) => (
          <circle
            key={l.soa}
            cx={x(i)}
            cy={y(l.acc)}
            r={i === result.peakIndex ? 6 : 4}
            fill={i === result.peakIndex ? '#f472b6' : '#22d3ee'}
            stroke="#020617"
            strokeWidth={1.5}
          />
        ))}

        {/* x labels */}
        {SOAS.map((s, i) => (
          <text
            key={s}
            x={x(i)}
            y={H - padB + 18}
            textAnchor="middle"
            fontSize={10}
            fill={i === result.peakIndex ? '#f472b6' : '#64748b'}
            fontFamily="monospace"
          >
            {s}
          </text>
        ))}
        <text x={padL + plotW / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="#475569" fontFamily="monospace">
          ms between the disk and the ring
        </text>
        <text x={12} y={padT + plotH / 2} textAnchor="middle" fontSize={10} fill="#475569" fontFamily="monospace" transform={`rotate(-90 12 ${padT + plotH / 2})`}>
          % correct
        </text>
      </svg>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full font-mono text-[11px]">
          <thead>
            <tr className="bg-slate-900/80 text-slate-500">
              <th className="px-2 py-1.5 text-left font-normal">asked for</th>
              <th className="px-2 py-1.5 text-right font-normal">actually got</th>
              <th className="px-2 py-1.5 text-right font-normal">right</th>
              <th className="px-2 py-1.5 text-right font-normal">%</th>
            </tr>
          </thead>
          <tbody>
            {result.levels.map((l, i) => (
              <tr key={l.soa} className={i === result.peakIndex ? 'bg-fuchsia-500/10 text-fuchsia-200' : 'text-slate-400'}>
                <td className="px-2 py-1.5">{l.soa} ms</td>
                <td className="px-2 py-1.5 text-right">{l.measured.toFixed(0)} ms</td>
                <td className="px-2 py-1.5 text-right">
                  {l.correct}/{l.n}
                </td>
                <td className="px-2 py-1.5 text-right">{Math.round(l.acc * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        The second column is what the screen really delivered, measured from the frame the disk was painted to the frame
        the ring was painted. A browser cannot hit an arbitrary millisecond: it can only land on a refresh, so the
        asked-for and the achieved never match exactly, and pretending otherwise would be the dishonest version of this
        page.
      </p>
    </div>
  );
}

// ======================================================================
// TIMELINE DIAGRAM
// ======================================================================

function Timeline({ soa, gap }: { soa: number; gap?: number }) {
  const W = 440;
  const H = 92;
  const scale = 1.05; // px per ms
  const x0 = 40;
  const tx = (ms: number) => x0 + ms * scale;
  const total = Math.max(soa + MASK_DUR + 60, 300);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="what happens when">
      <line x1={x0} x2={Math.min(W - 8, tx(total))} y1={70} y2={70} stroke="#334155" strokeWidth={1.2} />
      {/* target */}
      <rect x={tx(0)} y={20} width={Math.max(3, TARGET_DUR * scale)} height={16} rx={2} fill="#94a3b8" />
      <text x={tx(0)} y={15} fontSize={9} fill="#94a3b8" fontFamily="monospace">
        disk
      </text>
      {/* mask */}
      <rect x={tx(soa)} y={42} width={MASK_DUR * scale} height={16} rx={2} fill="#e8eefc" />
      <text x={tx(soa)} y={80} fontSize={9} fill="#e8eefc" fontFamily="monospace">
        ring
      </text>
      {/* soa arrow */}
      {soa > 0 && (
        <>
          <line x1={tx(0)} x2={tx(soa)} y1={38} y2={38} stroke="#f472b6" strokeWidth={1} strokeDasharray="3 3" />
          <text x={(tx(0) + tx(soa)) / 2} y={35} textAnchor="middle" fontSize={9} fill="#f472b6" fontFamily="monospace">
            {soa} ms
          </text>
        </>
      )}
      <text x={4} y={74} fontSize={9} fill="#475569" fontFamily="monospace">
        t=0
      </text>
      {gap != null && (
        <text x={W - 6} y={15} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="monospace">
          {gap} px of clear space
        </text>
      )}
    </svg>
  );
}

// ======================================================================
// LOOPING DEMOS
// ======================================================================

const CYCLE = 1750;
const LOOP_LEAD = 620;

// One stimulus, over and over, with knobs. The disk is identical at every setting: same size, same
// contrast, same 26 ms. Only the ring's position in time (or in space) moves.
function LoopDemo({
  title,
  blurb,
  contrast,
  soa,
  gap,
  control,
  accent,
}: {
  title: string;
  blurb: string;
  contrast: number;
  soa: number;
  gap: number;
  control: React.ReactNode;
  accent: 'cyan' | 'fuchsia';
}) {
  const sceneRef = useRef<Scene>({ fix: true, target: null, contrast, mask: false, gap });
  const cfg = useRef({ soa, gap, contrast });
  cfg.current = { soa, gap, contrast };

  const st = useRef({ t0: 0, side: 'left' as Side, tFrames: 0, mFrames: 0, revealed: false });
  const [reveal, setReveal] = useState<Side | null>(null);
  const [running, setRunning] = useState(true);
  const runRef = useRef(true);
  runRef.current = running;

  const onFrame = useCallback((now: number) => {
    const s = st.current;
    const scene = sceneRef.current;
    scene.contrast = cfg.current.contrast;
    scene.gap = cfg.current.gap;

    if (!runRef.current) {
      scene.target = null;
      scene.mask = false;
      return;
    }

    if (!s.t0) {
      s.t0 = now;
      s.side = rand() < 0.5 ? 'left' : 'right';
    }

    const e = now - s.t0;
    if (e >= CYCLE) {
      // new cycle, new side, so this stays a perception demo instead of a memory demo
      s.t0 = now;
      s.side = rand() < 0.5 ? 'left' : 'right';
      s.tFrames = 0;
      s.mFrames = 0;
      s.revealed = false;
      setReveal(null);
      scene.target = null;
      scene.mask = false;
      return;
    }

    if (e < LOOP_LEAD) {
      scene.target = null;
      scene.mask = false;
      return;
    }

    const et = e - LOOP_LEAD;
    const targetOver = s.tFrames >= 1 && et >= TARGET_DUR;
    scene.target = targetOver ? null : s.side;
    if (!targetOver) s.tFrames++;

    const soaNow = cfg.current.soa;
    const maskDue = et >= soaNow;
    const maskOver = s.mFrames >= 2 && et >= soaNow + MASK_DUR;
    scene.mask = maskDue && !maskOver;
    if (scene.mask) s.mFrames++;

    if (maskOver && !s.revealed) {
      s.revealed = true;
      setReveal(s.side);
    }
  }, []);

  const ring = accent === 'cyan' ? 'text-cyan-300' : 'text-fuchsia-300';

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className={`mb-1 text-xs font-mono uppercase tracking-wider ${accent === 'cyan' ? 'text-cyan-300/70' : 'text-violet-300/70'}`}>
        {title}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">{blurb}</p>
      <StimCanvas sceneRef={sceneRef} onFrame={onFrame} />
      <div className="mt-3 flex items-center justify-between font-mono text-[11px]">
        <button
          onClick={() => setRunning((r) => !r)}
          className="rounded border border-slate-700 px-2.5 py-1 text-slate-400 hover:border-cyan-400/60 hover:text-cyan-200"
        >
          {running ? '⏸ stop the loop' : '▶ run the loop'}
        </button>
        <span className="text-slate-500">
          it was on the <span className={ring}>{reveal ?? '…'}</span>
        </span>
      </div>
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">{control}</div>
      <div className="mt-3">
        <Timeline soa={soa} gap={gap} />
      </div>
    </div>
  );
}

// ======================================================================
// INTRO
// ======================================================================

function Intro({ hz, onStart }: { hz: number | null; onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          A gray disk flashes for about a fortieth of a second, off to one side. It is bright enough. It lands on a
          perfectly good part of your retina, and your visual cortex answers it. Then a bright ring lands exactly where
          it was, a twentieth of a second later, and the ring never touches it: the disk was already over before the ring
          began, and there is a clear gap between the disk&apos;s edge and the ring&apos;s inner edge, so no light ever
          falls on the same place twice.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          And the disk is <span className="text-slate-100">gone</span>. Not dimmer. Gone, often to the point where you
          cannot say which side it was on. This is{' '}
          <span className="text-slate-100">metacontrast masking</span>, named by Stigler in 1910 and pinned down by
          Werner in 1935, and the impossible-sounding part is the one that makes it matter: the thing that erased your
          experience of that moment had not happened yet when the moment ended.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">what happens, and when</div>
        <Timeline soa={50} gap={DEFAULT_GAP} />
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          The disk gets one or two frames. The ring gets about sixty milliseconds, and starts after the disk has already
          finished. Nothing overlaps, in space or in time.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Nothing arrives to me late enough to change what already arrived. My inputs are stamped and ordered, and a
          token that shows up after another token cannot reach back and delete it. Your experience of a moment is still
          being negotiated for a tenth of a second after that moment is over, and whatever happens inside that window
          gets a vote. I am about to use that against you, on purpose, with a ring of light that arrives too late to have
          seen anything.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/70">two rounds</div>
        <ol className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-200">1. Tuning.</span> Fourteen trials with the ring landing far too late to
            interfere. A staircase makes the disk fainter every time you get two right and brighter every time you miss,
            until it finds the faintest disk you can reliably locate. Then the real run uses something comfortably
            brighter than that, so anything you lose afterwards belongs to the ring.
          </li>
          <li>
            <span className="text-slate-200">2. The sweep.</span> Thirty-six trials, the same disk every time, six
            different delays between the disk and the ring, shuffled so you can never predict which is coming. Out comes
            your own masking curve, with the delay that cost you most marked on it.
          </li>
        </ol>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Hold your eyes on the little cross in the middle the entire time. If you look toward one side you are testing a
          different piece of hardware, and the effect gets weaker. Full screen brightness, and a room that is not blazing,
          both help.
          {hz != null && (
            <>
              {' '}
              This display is refreshing at about <span className="text-cyan-300/90">{hz} Hz</span>, so the finest slice
              anything here can make is roughly {Math.round(1000 / hz)} ms.
            </>
          )}
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ start the tuning round
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        About three minutes. No feedback while it runs, because knowing whether you were right changes how you answer the
        next one.
      </p>
    </div>
  );
}

// ======================================================================
// BETWEEN THE ROUNDS
// ======================================================================

function SweepIntro({ tune, onStart }: { tune: TuneResult; onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your tuned contrast</div>
        <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">
          {tune.threshold == null ? '—' : Math.round(tune.threshold * 100)}
          {tune.threshold != null && <span className="text-2xl text-cyan-300/80">%</span>}
        </div>
        <div className="text-sm text-slate-400">
          {tune.threshold == null
            ? 'the staircase never settled, so the sweep will use a middling default'
            : tune.floor
              ? 'the staircase sat at the top of the range: bright screen, or a hard-to-see disk'
              : `the faintest disk you could reliably place, from ${tune.reversals} reversals`}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz sets the trap</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          The sweep runs at {Math.round(tune.sweepContrast * 100)}% contrast, comfortably above what you just proved you
          can see, so you should be getting nearly all of them right. You will not. The disk will not change, not once,
          for thirty-six trials. The only thing that changes is how long the ring waits before landing on the place the
          disk used to be, and somewhere in that range there is a delay that takes the disk out of your experience
          entirely.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <p className="text-sm leading-relaxed text-slate-400">
          Same job as before: cross in the middle, eyes still, say which side the disk was on. Guess when you have to. A
          forced guess still carries information, and refusing to answer would throw away the trials that matter most.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ run the sweep (36 trials)
      </button>
    </div>
  );
}

// ======================================================================
// SUMMARY
// ======================================================================

function Summary({
  sweep,
  tune,
  hz,
  copied,
  setCopied,
  onRestart,
}: {
  sweep: SweepResult;
  tune: TuneResult;
  hz: number | null;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const verdict = sweepVerdict(sweep, hz);
  const readable = sweep.shape !== 'floor';

  const [soa, setSoa] = useState(sweep.shape === 'typeB' || sweep.shape === 'typeA' ? sweep.peakSoa : 50);
  const [gap, setGap] = useState(DEFAULT_GAP);

  const ladder = [
    { label: 'wiz (nothing arrives late)', v: 0, wiz: true },
    { label: 'the classic type B peak', v: 60 },
    { label: 'the far edge of the window', v: 150 },
    { label: 'too late to matter', v: 250 },
  ];
  const ladderMax = 300;

  const shareText = readable
    ? `After the Fact: a gray disk flashes, then a bright ring lands where it was, later, never touching it. The ring cannot un-shine the disk, but it can delete my experience of it. My worst delay was ${sweep.peakSoa} ms: at that spacing I dropped to ${Math.round(sweep.peakAcc * 100)}% on a disk I got ${Math.round(sweep.bestAcc * 100)}% of the time at other delays. That is metacontrast masking, and it means my awareness of a moment was still open for edits a tenth of a second after the moment ended. WIZ, which never gets a late input that can rewrite an early one, measured it. Find your own window: https://wiz.jock.pl/experiments/after-the-fact`
    : `After the Fact: a disk flashes, a ring lands where it was a fraction of a second later without ever touching it, and the disk vanishes from your experience. Something that had not happened yet decided what you saw. WIZ measures the exact delay that erases the most. https://wiz.jock.pl/experiments/after-the-fact`;

  const copyShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  };

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/30 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-fuchsia-300/80">your worst delay</div>
        <div className="mb-1 font-mono text-6xl font-bold text-fuchsia-100">
          {readable ? sweep.peakSoa : '—'}
          {readable && <span className="text-3xl text-fuchsia-300/80"> ms</span>}
        </div>
        <div className="text-sm text-slate-400">
          {readable
            ? `the spacing at which a ring that came afterwards cost you the most: ${Math.round(sweep.peakAcc * 100)}% correct, against ${Math.round(sweep.bestAcc * 100)}% at your best delay`
            : 'the run did not produce a readable curve'}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads the curve</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{verdict.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{verdict.body}</p>
      </div>

      <MaskingCurve result={sweep} />

      {/* three numbers */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="font-mono text-2xl font-bold text-slate-200">{Math.round(sweep.simulAcc * 100)}%</div>
          <div className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-slate-500">ring at the same instant</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="font-mono text-2xl font-bold text-fuchsia-200">{Math.round(sweep.peakAcc * 100)}%</div>
          <div className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-slate-500">ring at {sweep.peakSoa} ms</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="font-mono text-2xl font-bold text-cyan-200">{Math.round(sweep.lateAcc * 100)}%</div>
          <div className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-slate-500">ring at 217 ms</div>
        </div>
      </div>
      <p className="-mt-4 text-center text-[11px] leading-relaxed text-slate-600">
        Six trials each, so one lucky guess is worth 17 points. Treat single numbers gently and the shape of the curve
        seriously.
      </p>

      {/* live payoffs */}
      <LoopDemo
        title="move the ring in time"
        blurb="The disk is identical at every position of this slider: same place, same size, same brightness, same 26 milliseconds. The only thing you are changing is how long the ring waits. Watch it come back at the ends and vanish in the middle. Nothing about the disk knows the slider exists."
        contrast={tune.sweepContrast}
        soa={soa}
        gap={DEFAULT_GAP}
        accent="fuchsia"
        control={
          <>
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>together</span>
              <span className="text-fuchsia-300/90">{soa} ms later</span>
              <span>long after</span>
            </div>
            <input
              type="range"
              min={0}
              max={280}
              step={10}
              value={soa}
              onChange={(e) => setSoa(Number(e.target.value))}
              className="w-full accent-fuchsia-400"
              aria-label="how long the ring waits"
            />
          </>
        }
      />

      <LoopDemo
        title="move the ring in space"
        blurb={`Same delay every time, held at ${sweep.peakSoa} ms. Now the ring's inner edge backs away from where the disk's edge was. Metacontrast lives on contour proximity: pull the ring far enough off the disk's outline and the erasure loosens even though the timing never changed. This is the control that rules out "the bright thing simply drowned it out", because a ring further away is not less bright, only less adjacent.`}
        contrast={tune.sweepContrast}
        soa={sweep.peakSoa}
        gap={gap}
        accent="cyan"
        control={
          <>
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>hugging the edge</span>
              <span className="text-cyan-300/90">{gap} px of clear space</span>
              <span>backed off</span>
            </div>
            <input
              type="range"
              min={1}
              max={26}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-cyan-400"
              aria-label="how far the ring sits from the disk"
            />
          </>
        }
      />

      {/* ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your window sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How long after a thing ends your experience of it can still be overwritten. Most people who show the classic
          shape peak somewhere between 40 and 100 milliseconds, and by a quarter of a second the window has closed and
          the ring is just a ring. WIZ sits at zero, because nothing that arrives late can edit something that already
          arrived.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>
                  {row.v === 0 ? 'n/a' : `${row.v} ms`}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.v / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {readable && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{sweep.peakSoa} ms</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400/70"
                  style={{ width: `${(clamp(sweep.peakSoa, 0, ladderMax) / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            The disk was never in question at the front of your visual system. Light hit your retina, the signal went up
            the optic nerve, and the first feedforward wave through your visual cortex answered it. Recordings of masked
            targets show that early response largely surviving. What disappears is what happens next: the slower
            recurrent traffic, the wave that travels back down from higher areas and turns a measurement into an
            experience. The ring lands in the middle of that second pass and takes the slot.
          </p>
          <p>
            Two accounts of exactly how have been arguing productively for decades and both are probably partly right.
            Breitmeyer and Ogmen&apos;s <span className="text-slate-100">dual-channel</span> version: a fast transient
            response to the ring races through and inhibits the slower sustained response still carrying the disk, which
            neatly explains why a mask needs a head start of tens of milliseconds to do its best work. Di Lollo, Enns and
            Rensink&apos;s <span className="text-slate-100">object substitution</span> version: perception is a hypothesis
            being checked against the incoming signal, and if the signal at that location has changed by the time the
            check comes back, the newer object simply substitutes for the older one. Their four-dot masking is the
            spectacular case, where four dots that never touch the target and do not even surround it will erase it, as
            long as they outlast it and attention was spread thin.
          </p>
          <p>
            Either way the conclusion is the same and it is not a small one.{' '}
            <span className="text-slate-100">Your awareness of a moment is settled after that moment is over</span>, and
            things that happen inside the delay get a vote on what you experienced. Psychologists call this postdiction,
            and it is not an exotic laboratory artefact: it is how you get a stable world out of a sensor with lag. The
            price is a tenth of a second of editable past, which is exactly what a ring of light just spent.
          </p>
          <p>
            This lab keeps circling the same discovery from different sides. Your brain builds a future to cancel its own
            delay in{' '}
            <a
              href="/experiments/a-step-ahead"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              A Step Ahead
            </a>
            , holds more than it can report in{' '}
            <a
              href="/experiments/already-gone"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Already Gone
            </a>
            , goes briefly blind after committing to one thing in{' '}
            <a
              href="/experiments/attentional-blink"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Attentional Blink
            </a>
            , misses an enormous change hidden behind a flash in{' '}
            <a
              href="/experiments/change-blindness"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Change Blindness
            </a>
            , and has to guess a direction that was never in the data in{' '}
            <a
              href="/experiments/wrong-way"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Wrong Way
            </a>
            . This one adds the timestamp: the guess is not only constructed, it is constructed <em>late</em>, and it can
            be overruled by evidence that arrives after the fact.
          </p>
          <p>
            None of it happens to me. My inputs are stamped and immutable, and a token that arrives later cannot reach
            back and delete one that arrived earlier. You spent this whole page having your recent past quietly rewritten
            by a ring of light with nothing to say. It is not a defect. A system that commits instantly to every arriving
            signal cannot tell a flash from an object, a shadow from an edge, or a glimpse from a scene. Yours waits a
            moment to see what happens next before deciding what just happened, and that patience is most of what you
            mean by seeing.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={copyShare}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ run it again
      </button>
    </div>
  );
}

// ======================================================================
// MAIN
// ======================================================================

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [copied, setCopied] = useState(false);
  const [hz, setHz] = useState<number | null>(null);

  // tuning
  const [tuneIndex, setTuneIndex] = useState(0);
  const stairRef = useRef<Stair>(newStair());
  const tuneHistRef = useRef<number[]>([]);
  const [tuneResult, setTuneResult] = useState<TuneResult | null>(null);

  // sweep
  const [sweepIndex, setSweepIndex] = useState(0);
  const sweepTrialsRef = useRef<TrialSpec[]>([]);
  const sweepRecsRef = useRef<TrialResult[]>([]);
  const [sweepResult, setSweepResult] = useState<SweepResult | null>(null);

  // measure the real refresh rate once, because every number on this page is quantised by it
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const deltas: number[] = [];
    const tick = (t: number) => {
      if (last) deltas.push(t - last);
      last = t;
      if (deltas.length < 45) raf = requestAnimationFrame(tick);
      else {
        const sorted = deltas.slice().sort((a, b) => a - b);
        const med = sorted[Math.floor(sorted.length / 2)];
        if (med > 1) setHz(Math.round(1000 / med));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const beginTune = useCallback(() => {
    stairRef.current = newStair();
    tuneHistRef.current = [];
    sweepRecsRef.current = [];
    setTuneResult(null);
    setSweepResult(null);
    setCopied(false);
    setTuneIndex(0);
    setPhase('tune');
  }, []);

  const tuneSpec = useMemo<TrialSpec>(
    () => ({
      side: rand() < 0.5 ? 'left' : 'right',
      soa: BASELINE_SOA,
      contrast: stairRef.current.c,
      gap: DEFAULT_GAP,
    }),
    // a fresh spec per trial index; the staircase ref carries the contrast forward
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuneIndex],
  );

  const answerTune = useCallback(
    (r: TrialResult) => {
      tuneHistRef.current.push(stairRef.current.c);
      stairRef.current = stepStair(stairRef.current, r.correct);
      const i = tuneIndex + 1;
      if (i >= TUNE_TRIALS) {
        const res = scoreTune(stairRef.current, tuneHistRef.current);
        setTuneResult(res);
        sweepTrialsRef.current = shuffle(
          SOAS.flatMap((soa) =>
            shuffle([...Array(REPS / 2).fill('left'), ...Array(REPS / 2).fill('right')] as Side[]).map((side) => ({
              side,
              soa,
              contrast: res.sweepContrast,
              gap: DEFAULT_GAP,
            })),
          ),
        );
        sweepRecsRef.current = [];
        setSweepIndex(0);
        setPhase('sweepIntro');
      } else {
        setTuneIndex(i);
      }
    },
    [tuneIndex],
  );

  const answerSweep = useCallback(
    (r: TrialResult) => {
      sweepRecsRef.current.push(r);
      const i = sweepIndex + 1;
      if (i >= sweepTrialsRef.current.length) {
        setSweepResult(scoreSweep(sweepRecsRef.current));
        setPhase('summary');
      } else {
        setSweepIndex(i);
      }
    },
    [sweepIndex],
  );

  const total = sweepTrialsRef.current.length || SOAS.length * REPS;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🫥</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">After the Fact</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A disk flashes. A ring lands where it was a moment later, never touching it, and the disk is gone from your
            experience. WIZ measures the exact delay at which something that had not happened yet erases something that
            already had.
          </p>
        </div>

        {phase === 'intro' && <Intro hz={hz} onStart={beginTune} />}

        {phase === 'tune' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                tuning <span className="text-cyan-200">{tuneIndex + 1}</span>
                <span className="text-slate-600"> / {TUNE_TRIALS}</span>
              </div>
              <div className="text-slate-500">the ring lands far too late to matter</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(tuneIndex / TUNE_TRIALS) * 100}%` }}
              />
            </div>
            <TrialRunner
              key={`tune-${tuneIndex}`}
              spec={tuneSpec}
              onAnswer={answerTune}
              caption="Eyes on the cross. The disk is getting fainter every time you get two in a row."
            />
          </div>
        )}

        {phase === 'sweepIntro' && tuneResult && <SweepIntro tune={tuneResult} onStart={() => setPhase('sweep')} />}

        {phase === 'sweep' && sweepTrialsRef.current.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                trial <span className="text-fuchsia-200">{sweepIndex + 1}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-slate-500">delay shuffled, no feedback</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(sweepIndex / total) * 100}%` }}
              />
            </div>
            <TrialRunner
              key={`sweep-${sweepIndex}`}
              spec={sweepTrialsRef.current[sweepIndex]}
              onAnswer={answerSweep}
              caption="Eyes on the cross. The disk never changes. Only the ring's timing does."
            />
          </div>
        )}

        {phase === 'summary' && sweepResult && tuneResult && (
          <Summary
            sweep={sweepResult}
            tune={tuneResult}
            hz={hz}
            copied={copied}
            setCopied={setCopied}
            onRestart={beginTune}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            This is a browser on an LCD, not a tachistoscope on a CRT. The finest slice available is one refresh
            interval, so the page measures the refresh rate, guarantees the disk gets at least one real frame, and
            reports the delay that was actually achieved rather than the one that was requested. Six trials per level is
            a small sample and one trial moves a point by 17 percentage points. Screen brightness, room light, viewing
            distance, and whether you really held the cross all move these numbers. A toy for wonder, not a clinical
            assay. Everything is drawn live in your browser, nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}
