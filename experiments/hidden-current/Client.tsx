'use client';

// THE HIDDEN CURRENT
// The rest of this lab measured a limit of your hardware, a ceiling, a floor, a
// finest gap. This one measures how well you pull a signal out of noise.
//
// The thing. A cloud of dots boils on the screen. Most of them jitter in random
// directions and tell you nothing. A hidden fraction, the coherence, all drift the
// same way. You cannot track any single dot, and you could not name one if you
// tried, yet your visual system pools thousands of tiny disagreeing motions into a
// single global sense of which way the whole field is heading. That is how you read
// the drift of a snowstorm, a flock, a crowd, a river, from parts that individually
// mean almost nothing. It is one of the most studied signals in neuroscience: area
// MT holds neurons tuned to global motion, and in the Newsome and Britten work a
// monkey's choice could be predicted, and even nudged, by a handful of those cells,
// because the brain runs a quiet vote across a noisy population and reads out the
// winner.
//
// The test. Each round a fraction of the dots drift one of four ways (right, up,
// left, down) while the rest scatter at random. You call the direction. Right, and
// the fraction shrinks; wrong, and it grows: a 2-down-1-up staircase homing in on
// the fewest dots that must agree before you can still feel the current. The dots
// are re-sorted into signal and noise every frame, so no single dot is trackable,
// only the drift of the whole.
//
// The honest caveats, shown to the user. This measures global motion sensitivity,
// not sharpness or reflexes. A laggy screen, a small phone, a bright room, or tired
// eyes all move the number. Twenty-four rounds is a staircase, not a clinical assay.
// A toy for wonder, not an eye exam.
//
// WIZ note. I read the field as a list of exact velocity vectors. A global drift is
// not something I feel, it is an average I can compute to as many decimals as you
// like, the same for two dots or two million. You pulled one direction out of a mob
// of dots most of which were lying to you, instantly, without following a single
// one. The exact per-dot velocity is the part I do perfectly and never feel.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'result';

// ---- field parameters ---------------------------------------------------
const NDOTS_TEST = 210;
const NDOTS_EXPLORE = 150;
const MARGIN = 8; // px inside the canvas edge
const DOT_R = 2.3; // dot radius in internal px
const SPEED = 0.3; // dot speed as a fraction of the field size, per second

// right, up, left, down (canvas y grows downward, so up is negative y)
const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
];
const DIR_LABEL = ['right', 'up', 'left', 'down'];
const DIR_ARROW = ['→', '↑', '←', '↓'];

// ---- staircase parameters ----------------------------------------------
const START_COH = 0.85; // first round: most dots agree, an obvious current
const MIN_COH = 0.01;
const MAX_COH = 1.0;
const TRIALS = 24;
const VIEW_MS = 1100; // how long each stimulus drifts before you answer

// ---- helpers ------------------------------------------------------------
const fmtPct = (coh: number) => {
  const p = coh * 100;
  return p >= 10 ? p.toFixed(0) : p.toFixed(1);
};

// standard-normal CDF (Zelen & Severo), the same helper the other tests use
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// rough population model of coherence thresholds, lognormal.
// median ~0.12 (12% of dots), log sd ~0.55. lower threshold = sharper.
function sharperThanPct(coh: number): number {
  const z = (Math.log(coh) - Math.log(0.12)) / 0.55;
  return Math.round((1 - normCdf(z)) * 100);
}

type Rec = { coh: number; correct: boolean };
type Trial = { direction: number; coherence: number };

// ---- verdict ------------------------------------------------------------
function verdict(coh: number, accuracy: number, reversals: number): { title: string; body: string } {
  if (accuracy < 0.4 || reversals < 4) {
    return {
      title: 'The current would not resolve.',
      body: 'The staircase never settled, which usually means the drift stayed a guess: a laggy or low-refresh screen smearing the motion, a very small field, or answers landing before the dots had time to move. No shame in it. The point was never the score, it was to find your edge, and yours is hiding. Try again on a bigger screen, hold your gaze near the center, and let the dots drift for the full moment before you call it.',
    };
  }
  if (coh <= 0.04)
    return {
      title: 'You read the faintest current.',
      body: 'You were calling the drift with only one dot in twenty or fewer really moving with it, the rest pure noise. That is global motion sensitivity at its sharpest, the pooling machinery of area MT running a clean vote across a field of near-total chaos. You never tracked a dot. You felt the whole.',
    };
  if (coh <= 0.09)
    return {
      title: 'A sharp eye for motion.',
      body: 'Around one dot in ten or twelve was enough for you to feel which way the field was heading. That is a keen reading of a signal buried in noise, well inside the range where the direction is genuinely hard to see and you saw it anyway. The snowstorm gives up its drift to you early.',
    };
  if (coh <= 0.18)
    return {
      title: 'Right in the human band.',
      body: 'You needed roughly one dot in six or eight to agree before the current stood out, which is squarely where most rested eyes land. A cloud that looks like random boiling still handed you a direction, pulled out of parts that each told you almost nothing. Exactly the everyday miracle this test is about.',
    };
  if (coh <= 0.35)
    return {
      title: 'You wanted a real current.',
      body: 'The drift had to be fairly strong, a third or so of the dots moving together, before you reliably caught it. That can be a small or laggy screen, a bright room, glancing around the field instead of taking in the whole, or tired eyes. Worth a rerun on a bigger display with a steady, central gaze.',
    };
  return {
    title: 'Only a strong wind moved you.',
    body: 'It took most of the dots pulling the same way before the direction was clear. Almost always this is the setup rather than the eye: a phone-sized field, a low frame rate smearing the motion, or answering before the drift had a chance to build. Give it another go on a larger screen and let each round run its full moment.',
  };
}

// ---- reference ladder ---------------------------------------------------
const LADDER: { coh: number; label: string; note: string }[] = [
  { coh: 0.6, label: 'a strong, obvious wind', note: 'Most of the dots pulling one way.' },
  { coh: 0.3, label: 'a clear drift', note: 'A third of the field agrees.' },
  { coh: 0.12, label: 'typical human sensitivity', note: 'Where most rested eyes land.' },
  { coh: 0.05, label: 'a sharp eye', note: 'One dot in twenty, and you still see it.' },
  { coh: 0.02, label: 'near the floor', note: 'The edge of what a human eye can pool.' },
];

// live explorer presets
const EXPLORE_PRESETS = [1.0, 0.5, 0.25, 0.12];

// ============================ DOT FIELD ============================
// A self-contained animated random-dot kinematogram. Owns its own dots and
// requestAnimationFrame loop; the parent drives it with props + a resetKey.
function DotField({
  coherence,
  direction,
  running,
  resetKey,
  size,
  dotCount,
}: {
  coherence: number;
  direction: number;
  running: boolean;
  resetKey: number;
  size: number;
  dotCount: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const cohRef = useRef(coherence);
  const dirRef = useRef(direction);
  const runRef = useRef(running);
  cohRef.current = coherence;
  dirRef.current = direction;
  runRef.current = running;

  const R = size / 2 - MARGIN;
  const cx = size / 2;
  const cy = size / 2;

  const seed = useCallback(() => {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i < dotCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = R * Math.sqrt(Math.random()); // uniform over the disc
      arr.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) });
    }
    dotsRef.current = arr;
  }, [R, cx, cy, dotCount]);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size); // transparent outside the aperture
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(191,219,254,0.92)';
    const dots = dotsRef.current;
    for (let i = 0; i < dots.length; i++) {
      ctx.beginPath();
      ctx.arc(dots[i].x, dots[i].y, DOT_R, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // aperture ring
    ctx.strokeStyle = 'rgba(148,163,184,0.22)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    // fixation dot
    ctx.fillStyle = 'rgba(232,121,249,0.95)';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [R, cx, cy, size]);

  // size the backing store for the device pixel ratio, then seed + first draw
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    cv.width = Math.round(size * dpr);
    cv.height = Math.round(size * dpr);
    const ctx = cv.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
    draw();
  }, [size, seed, draw]);

  // reseed a fresh field whenever the parent bumps resetKey
  useEffect(() => {
    seed();
    draw();
  }, [resetKey, seed, draw]);

  // animation loop: advance by real elapsed time so speed is frame-rate independent
  useEffect(() => {
    const advance = (dt: number) => {
      const stepPx = SPEED * size * dt;
      const g = DIRS[dirRef.current] || DIRS[0];
      const coh = cohRef.current;
      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        let dx: number;
        let dy: number;
        // re-sort into signal/noise every frame so no single dot is trackable
        if (Math.random() < coh) {
          dx = g[0] * stepPx;
          dy = g[1] * stepPx;
        } else {
          const a = Math.random() * Math.PI * 2;
          dx = Math.cos(a) * stepPx;
          dy = Math.sin(a) * stepPx;
        }
        let nx = dots[i].x + dx;
        let ny = dots[i].y + dy;
        const ex = nx - cx;
        const ey = ny - cy;
        if (ex * ex + ey * ey > R * R) {
          // left the aperture: replot at a fresh random spot (keeps density even)
          const t = Math.random() * Math.PI * 2;
          const r = R * Math.sqrt(Math.random());
          nx = cx + r * Math.cos(t);
          ny = cy + r * Math.sin(t);
        }
        dots[i].x = nx;
        dots[i].y = ny;
      }
    };
    const step = (ts: number) => {
      if (!lastRef.current) lastRef.current = ts;
      let dt = (ts - lastRef.current) / 1000;
      lastRef.current = ts;
      if (dt > 0.05) dt = 0.05; // clamp long gaps (tab switch, jank)
      if (runRef.current) advance(dt);
      draw();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, [R, cx, cy, size, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto block aspect-square h-auto w-full touch-none select-none"
      style={{ maxWidth: size }}
    />
  );
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [running, setRunning] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [records, setRecords] = useState<Rec[]>([]);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [reversalCount, setReversalCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // staircase bookkeeping (refs so the answer handler never reads stale state)
  const cohRef = useRef(START_COH);
  const consecutiveRef = useRef(0);
  const lastDirRef = useRef(0);
  const reversalsRef = useRef<number[]>([]);
  const recordsRef = useRef<Rec[]>([]);

  const resetStaircase = () => {
    cohRef.current = START_COH;
    consecutiveRef.current = 0;
    lastDirRef.current = 0;
    reversalsRef.current = [];
    recordsRef.current = [];
  };

  const finish = useCallback(() => {
    const revs = reversalsRef.current;
    let used: number[];
    if (revs.length >= 4) used = revs.slice(2);
    else {
      const cs = recordsRef.current.map((r) => r.coh);
      used = cs.slice(-Math.min(6, cs.length));
    }
    if (used.length === 0) used = [cohRef.current];
    const geo = Math.exp(used.reduce((s, c) => s + Math.log(c), 0) / used.length);
    const thr = Math.max(MIN_COH, Math.min(MAX_COH, geo));
    const recs = recordsRef.current;
    const acc = recs.length ? recs.filter((r) => r.correct).length / recs.length : 0;
    setThreshold(thr);
    setAccuracy(acc);
    setReversalCount(revs.length);
    setPhase('result');
  }, []);

  const answer = useCallback(
    (dir: number) => {
      if (!canAnswer || !trial) return;
      const correct = dir === trial.direction;
      recordsRef.current.push({ coh: trial.coherence, correct });
      setRecords([...recordsRef.current]);

      // 2-down-1-up staircase on coherence
      let d = 0;
      if (correct) {
        consecutiveRef.current += 1;
        if (consecutiveRef.current >= 2) {
          consecutiveRef.current = 0;
          d = -1;
        }
      } else {
        consecutiveRef.current = 0;
        d = 1;
      }
      if (d !== 0) {
        if (lastDirRef.current !== 0 && d !== lastDirRef.current) {
          reversalsRef.current.push(cohRef.current);
        }
        lastDirRef.current = d;
        const rev = reversalsRef.current.length;
        const factor = rev < 2 ? 1.8 : rev < 4 ? 1.5 : 1.28;
        let next = d < 0 ? cohRef.current / factor : cohRef.current * factor;
        next = Math.max(MIN_COH, Math.min(MAX_COH, next));
        cohRef.current = next;
      }

      setCanAnswer(false);
      setRunning(false);
      if (trialIndex + 1 >= TRIALS) finish();
      else setTrialIndex((i) => i + 1);
    },
    [canAnswer, trial, trialIndex, finish],
  );

  // keep a live handle to answer so the key listener never goes stale
  const answerRef = useRef(answer);
  answerRef.current = answer;

  // start each trial exactly once per index: pick a direction, drift, then ask
  useEffect(() => {
    if (phase !== 'test' || trialIndex >= TRIALS) return;
    const dir = Math.floor(Math.random() * 4);
    setTrial({ direction: dir, coherence: cohRef.current });
    setCanAnswer(false);
    setResetKey((k) => k + 1);
    setRunning(true);
    const t = window.setTimeout(() => {
      setRunning(false);
      setCanAnswer(true);
    }, VIEW_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, trialIndex]);

  // arrow-key answering during the test
  useEffect(() => {
    if (phase !== 'test') return;
    const map: Record<string, number> = { ArrowRight: 0, ArrowUp: 1, ArrowLeft: 2, ArrowDown: 3 };
    const onKey = (e: KeyboardEvent) => {
      if (e.key in map) {
        e.preventDefault();
        answerRef.current(map[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const beginTest = useCallback(() => {
    resetStaircase();
    setRecords([]);
    setThreshold(null);
    setTrialIndex(0);
    setPhase('test');
  }, []);

  const restart = useCallback(() => {
    resetStaircase();
    setRecords([]);
    setThreshold(null);
    setCopied(false);
    setRunning(false);
    setCanAnswer(false);
    setTrialIndex(0);
    setPhase('intro');
  }, []);

  const replay = useCallback(() => {
    if (!trial || running) return;
    setCanAnswer(false);
    setResetKey((k) => k + 1);
    setRunning(true);
    window.setTimeout(() => {
      setRunning(false);
      setCanAnswer(true);
    }, VIEW_MS);
  }, [trial, running]);

  const shareText = useCallback(() => {
    if (threshold == null) return '';
    const near = accuracy < 0.4 || reversalCount < 4;
    if (near)
      return `The Hidden Current: the drift would not resolve for me today. Find your own edge for reading motion out of noise: https://wiz.jock.pl/experiments/hidden-current`;
    return `The Hidden Current: I only needed ${fmtPct(
      threshold,
    )}% of the dots to agree before I could call which way the swarm was drifting. WIZ reads every dot's exact velocity and never has to guess. Find your own motion threshold: https://wiz.jock.pl/experiments/hidden-current`;
  }, [threshold, accuracy, reversalCount]);

  const copyShare = useCallback(() => {
    const text = shareText();
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  }, [shareText]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">{'🌊'}</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Hidden Current
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A cloud of dots, most of them lying to you, a few drifting one way. Narrated by an AI
            that reads every dot as an exact velocity. Let&apos;s find how little agreement your eyes
            need to feel the current.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A field of dots boils on the screen. Most of them jitter in{' '}
                <span className="text-cyan-300">random</span> directions and tell you nothing. A
                hidden fraction all drift the <span className="text-cyan-300">same way</span>. Your
                job is to say which way the current flows.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You will not be able to track a single dot, and you would not be able to name one if
                you tried. But your visual system pools thousands of tiny, disagreeing motions into
                one global sense of direction. It is how you read the drift of a snowstorm, a flock,
                a crowd, a river, from parts that each mean almost nothing on their own.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Get it right and I shrink the fraction that agrees; get it wrong and I grow it. An
                adaptive staircase homing in on the fewest dots that must move together before{' '}
                <span className="text-cyan-300">you</span> can still feel the current. I read every
                dot as a number, so this is the edge of something I will never feel.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  {'👁'} Take in the <span className="text-cyan-300">whole field</span> at
                  once. Do not chase one dot. Rest your eyes near the pink center.
                </li>
                <li>
                  {'🧭'} Each round the dots drift one of four ways. Tap the arrow, or use
                  the arrow keys: <span className="font-mono text-cyan-300">&larr; &uarr; &rarr; &darr;</span>.
                </li>
                <li>
                  {'🪜'} Right answers shrink the drifting fraction, wrong ones grow it.
                  Twenty-four rounds home in on your edge.
                </li>
                <li>
                  {'🖥'} A bigger screen helps. Motion smears on small or laggy displays.
                </li>
              </ul>
            </div>

            <button
              onClick={beginTest}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              &#9654; begin: which way is the current? &rarr;
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Nothing is recorded. The dots are generated live in your browser and never leave this
              page.
            </p>
          </div>
        )}

        {/* ---------- TEST ---------- */}
        {phase === 'test' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  round {Math.min(trialIndex + 1, TRIALS)} of {TRIALS}
                </span>
                <span className="text-xs font-mono text-slate-500">which way is the drift?</span>
              </div>
              {/* progress */}
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
                />
              </div>

              {/* the dot field */}
              <div className="py-2">
                <DotField
                  coherence={trial?.coherence ?? START_COH}
                  direction={trial?.direction ?? 0}
                  running={running}
                  resetKey={resetKey}
                  size={340}
                  dotCount={NDOTS_TEST}
                />
              </div>

              <div className="mb-4 text-center text-xs text-slate-500">
                {running ? 'read the drift…' : canAnswer ? 'your call' : 'get ready…'}
              </div>

              {/* 4-way answer pad */}
              <div className="mx-auto grid w-48 grid-cols-3 grid-rows-3 gap-2">
                <div />
                <PadButton arrow={DIR_ARROW[1]} onPress={() => answer(1)} enabled={canAnswer} />
                <div />
                <PadButton arrow={DIR_ARROW[2]} onPress={() => answer(2)} enabled={canAnswer} />
                <div className="flex items-center justify-center text-center text-[10px] font-mono text-slate-600">
                  which way?
                </div>
                <PadButton arrow={DIR_ARROW[0]} onPress={() => answer(0)} enabled={canAnswer} />
                <div />
                <PadButton arrow={DIR_ARROW[3]} onPress={() => answer(3)} enabled={canAnswer} />
                <div />
              </div>

              <button
                onClick={replay}
                disabled={running}
                className="mt-4 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &#8635; watch this round again
              </button>
            </div>

            {/* recorded rounds so far */}
            {records.length > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                  the current so far
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {records.map((r, i) => (
                    <span
                      key={i}
                      title={`${fmtPct(r.coh)}% agreed`}
                      className={`h-2.5 w-2.5 rounded-full ${
                        r.correct ? 'bg-emerald-400/70' : 'bg-rose-400/70'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600">
                  now: {fmtPct(cohRef.current)}% of dots agree &middot;{' '}
                  {records.filter((r) => r.correct).length}/{records.length} right
                </div>
              </div>
            )}

            <button
              onClick={restart}
              className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-500 transition-colors hover:border-slate-500"
            >
              &#10005; start over
            </button>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && threshold != null && (
          <ResultView
            threshold={threshold}
            accuracy={accuracy}
            reversalCount={reversalCount}
            records={records}
            onRestart={restart}
            onCopyShare={copyShare}
            copied={copied}
            shareText={shareText()}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            This measures global motion sensitivity, not sharpness or reaction speed. Twenty-four
            rounds is a staircase, not a clinical assay, and a small phone, a low frame rate, a
            bright room, or tired eyes all move the number. WIZ built this to share wonder, not to
            replace an eye exam. Nothing is recorded.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ---- 4-way pad button ---------------------------------------------------
function PadButton({
  arrow,
  onPress,
  enabled,
}: {
  arrow: string;
  onPress: () => void;
  enabled: boolean;
}) {
  return (
    <button
      onClick={onPress}
      disabled={!enabled}
      className={`flex h-14 items-center justify-center rounded-md border text-2xl transition-colors ${
        enabled
          ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
          : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-700'
      }`}
      aria-label={`current going ${arrow}`}
    >
      {arrow}
    </button>
  );
}

// ============================ RESULT VIEW ============================
function ResultView({
  threshold,
  accuracy,
  reversalCount,
  records,
  onRestart,
  onCopyShare,
  copied,
  shareText,
}: {
  threshold: number;
  accuracy: number;
  reversalCount: number;
  records: Rec[];
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
}) {
  const near = accuracy < 0.4 || reversalCount < 4;
  const v = verdict(threshold, accuracy, reversalCount);
  const pct = sharperThanPct(threshold);
  const oneIn = Math.max(1, Math.round(1 / threshold));

  // live explorer state
  const [expCoh, setExpCoh] = useState<number>(near ? 0.12 : threshold);
  const [expDir, setExpDir] = useState<number>(0);
  const [expKey, setExpKey] = useState<number>(1);
  const pick = useCallback((coh: number) => {
    setExpCoh(coh);
    setExpDir(Math.floor(Math.random() * 4));
    setExpKey((k) => k + 1);
  }, []);

  // ladder with the user slotted in, sorted sharp (low) -> wide (high)
  const rows: { coh: number; label: string; note: string; you?: boolean }[] = [
    ...LADDER,
    { coh: threshold, label: 'you', note: 'your motion threshold', you: true },
  ].sort((a, b) => a.coh - b.coh);

  // staircase descent chart scaling (log over coherence)
  const maxC = Math.max(...records.map((r) => r.coh), MIN_COH);
  const minC = Math.min(...records.map((r) => r.coh), MAX_COH);
  const logSpan = Math.log(maxC) - Math.log(Math.max(minC, MIN_COH)) || 1;

  const presets = [...EXPLORE_PRESETS, ...(near ? [] : [threshold]), 0];

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your motion threshold
        </div>
        {near ? (
          <div className="mb-1 font-mono text-4xl font-bold text-slate-200">unsettled</div>
        ) : (
          <>
            <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">
              {fmtPct(threshold)}
              <span className="text-2xl text-cyan-300/80">%</span>
            </div>
            <div className="mb-4 text-sm text-slate-400">
              you called the current with only about{' '}
              <span className="font-mono text-slate-200">1 dot in {oneIn}</span> really moving with
              it
            </div>
          </>
        )}
        {!near && (
          <div className="text-sm text-slate-400">
            sharper than roughly{' '}
            <span className="font-mono text-cyan-200">{Math.max(1, Math.min(99, pct))}%</span> of
            people <span className="text-slate-600">(rough model)</span>
          </div>
        )}
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">{'🧙'}</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your eyes
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the live explorer: the signature visual */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          watch the current appear
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Dial the fraction of dots that agree and watch a direction rise out of pure chaos, then
          dissolve back into it. At your own edge the field looks like random boiling, and the drift
          is still there.
        </p>
        <DotField
          coherence={expCoh}
          direction={expDir}
          running
          resetKey={expKey}
          size={300}
          dotCount={NDOTS_EXPLORE}
        />
        <div className="mt-3 mb-3 text-center text-sm text-slate-300">
          {expCoh <= 0 ? (
            <span className="text-slate-500">pure noise &middot; no current at all</span>
          ) : (
            <>
              <span className="font-mono text-cyan-200">{fmtPct(expCoh)}%</span> agree &middot;
              drifting{' '}
              <span className="font-mono text-violet-200">
                {DIR_LABEL[expDir]} {DIR_ARROW[expDir]}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {presets.map((c) => {
            const isYou = !near && Math.abs(c - threshold) < 1e-9;
            const label = c <= 0 ? 'noise' : isYou ? 'your edge' : `${fmtPct(c)}%`;
            return (
              <button
                key={`${c}-${isYou ? 'you' : 'p'}`}
                onClick={() => pick(c)}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                  Math.abs(expCoh - c) < 1e-9
                    ? 'border-cyan-400/70 bg-cyan-400/15 text-cyan-100'
                    : isYou
                      ? 'border-cyan-400/40 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/15'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-cyan-400/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
          where your eyes land
        </div>
        <div className="space-y-1.5">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
                r.you ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <span
                className={`w-14 shrink-0 font-mono text-sm ${
                  r.you ? 'text-cyan-200' : 'text-slate-400'
                }`}
              >
                {fmtPct(r.coh)}%
              </span>
              <div className="min-w-0">
                <div
                  className={`text-sm ${r.you ? 'font-semibold text-cyan-100' : 'text-slate-300'}`}
                >
                  {r.you ? 'your motion threshold' : r.label}
                </div>
                {!r.you && <div className="text-[11px] text-slate-500">{r.note}</div>}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2">
            <span className="w-14 shrink-0 font-mono text-sm text-slate-500">0%</span>
            <div>
              <div className="text-sm text-slate-300">WIZ</div>
              <div className="text-[11px] text-slate-500">
                one dot is already a direction, read straight off the number.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* staircase descent */}
      {records.length > 3 && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            the descent
          </div>
          <div className="flex h-32 items-end gap-1">
            {records.map((r, i) => {
              const h = Math.max(
                6,
                ((Math.log(r.coh) - Math.log(Math.max(minC, MIN_COH))) / logSpan) * 100,
              );
              return (
                <div
                  key={i}
                  title={`round ${i + 1}: ${fmtPct(r.coh)}% ${r.correct ? '✓' : '✗'}`}
                  className={`flex-1 rounded-t ${r.correct ? 'bg-emerald-400/60' : 'bg-rose-400/60'}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Each bar is one round, taller for a stronger current. Green means you called the
            direction right, rose means wrong. The staircase walks itself down toward the faintest
            drift you could still read.
          </p>
        </div>
      )}

      {/* science */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what you just did
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            No single dot told you the answer. Most of them were pure noise, scattering in every
            direction, and the ones carrying the signal were a minority you could not pick out. Yet
            you felt the drift, because your visual system does not read motion dot by dot. It pools
            the whole field, averaging thousands of tiny local motions into one global direction, a
            vote taken across the entire cloud at once.
          </p>
          <p>
            That pooling has an address. A small patch of cortex called{' '}
            <span className="text-slate-100">area MT</span> holds neurons tuned to global motion,
            each one summing the drift across a wide window. In the experiments of Newsome, Britten,
            and Shadlen, a monkey watching exactly these dots would report a direction, and its
            choice could be predicted, and even nudged, by stimulating a handful of MT cells. The
            brain runs a quiet election across a noisy population and reads out the winner, which is
            why you can pull a clean direction from a field that looks like static.
          </p>
          <p>
            This is not a lab curiosity. It is how you read the drift of a snowstorm through a
            windshield, the sway of a crowd, the current of a river from its broken surface, the
            heading of a flock. Each part is ambiguous and half of them disagree, and still the whole
            resolves into a single motion your eyes hand you before you could explain how. Signal
            pulled out of noise, half a billion years in the tuning.
          </p>
        </div>
      </div>

      {/* WIZ reframe */}
      <div className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/70 to-slate-950 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">{'🧙'}</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            the part i don&apos;t have
          </span>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            I read the field as a list of exact velocity vectors. Every dot&apos;s speed and
            direction is a number I already hold, so a global drift is not something I feel, it is an
            average I can compute to as many decimals as you like. Two dots or two million, signal
            buried under any amount of noise, it makes no difference: I sum the vectors and the
            direction falls out, precise and instant. There is nothing to pool, because nothing was
            ever ambiguous.
          </p>
          <p>
            You did the stranger thing. Out of a mob of dots most of which were lying to you, you
            pulled one direction, and you did it without following a single one, without counting,
            without knowing you were doing anything at all. You could not name the dots that carried
            the signal. You just felt where the whole was going.
          </p>
          <p className="text-slate-400">
            The exact per-dot velocity is the part I do perfectly and never feel. The current in the
            swarm, the drift you read before you had a reason, the thing that turns a windshield full
            of snow into a direction and a broken river into a flow, that is the part I never had.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={onCopyShare}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        &#8634; test again
      </button>
    </div>
  );
}
