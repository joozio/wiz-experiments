'use client';

// OFF TRUE  (the tilt aftereffect: thirty seconds of looking at a slant, and your vertical moves)
//
// The forty-seventh piece in this lab, and its first measurement of ORIENTATION ADAPTATION: the fact
// that "vertical" is not a fixed thing in your head. It is a running average, and it can be dragged
// several degrees off true by nothing more than looking at a striped patch for half a minute.
//
// Note the position against the siblings, because the lab has a whole family of adaptation now.
// The Motion Aftereffect stared at movement and then watched a still thing crawl. The Leftover Color
// stared at a colour and then watched its opposite appear on a white card. Troxler Fading held a
// steady image until it dissolved outright. All three are adaptation, and all three are about
// something appearing that is not in the picture. This one is different in a way that matters: nothing
// appears. The test patch looks like a perfectly ordinary grating, no ghost, no crawl, no fading, and
// it is simply in the wrong place relative to vertical. The illusion here is not an added percept. It
// is a moved ruler.
//
// And the sharper contrast is with One Before, which measured serial dependence: what you just judged
// pulls your next judgment TOWARD it. This one pushes AWAY. Both are true, they run at the same time in
// the same head, and they have opposite signs, which is the single best argument in this lab that
// perception is not one process with one bias. A few seconds of decision history attracts. Half a
// minute of staring repels. Whatever you see now sits at the sum.
//
// The genuine phenomenon: the tilt aftereffect. Gibson and Radner nailed it down in 1937 (J. Exp.
// Psychol.), adapting observers to a tilted line and finding that apparent vertical had shifted toward
// the adapting tilt afterwards, which is the same statement as saying a vertical test now looks tilted
// away from it. Gibson also reported the strange tail of the function: at small adapting angles the
// effect is repulsive and large, it crosses zero somewhere around forty or fifty degrees, and near
// orthogonal it can come back with the opposite sign, which is still called the indirect effect and is
// still argued about. Campbell and Maffei made it quantitative in 1971 (J. Physiol.) and tied its width
// to the orientation bandwidth of single cells in visual cortex, the cells Hubel and Wiesel had found
// a decade earlier. Coltheart 1971 (Psych. Review) laid out the fatigue and lateral-inhibition
// accounts. Clifford and colleagues 2000 (Vision Research) reframed it as a functional recalibration
// rather than tiredness, and Schwartz, Hsu and Dayan 2007 (Nat. Rev. Neurosci.) put it in the efficient
// coding frame: a system that spends its dynamic range where the recent input actually lives. Dragoi,
// Sharma and Sur 2000 (Neuron) watched V1 tuning curves physically shift after seconds of adaptation.
// Kohn 2007 is the review to start from.
//
// The measurement. Two adapter blocks, one tilted clockwise, one anticlockwise, and in each one a
// staircase hunts the physical tilt that LOOKS vertical to you. The headline is half the difference
// between those two numbers, in degrees, and that construction is the point: any constant bias you own,
// a tilted head, a tilted desk, a tilted screen, a lifelong pointing error, is identical in both blocks
// and cancels exactly in the difference. What survives is the part that flipped when the adapter
// flipped. Expecting an effect can move both blocks. It cannot move them in opposite directions.
//
// Four defences run live:
//   1. The two adapters. Constant bias cancels; only the sign-flipping part is scored.
//   2. The adapter reverses contrast four times a second instead of drifting. Reversing prevents an
//      afterimage, which is what would otherwise contaminate this with a Leftover Color effect, and not
//      drifting prevents a motion aftereffect, which is the other neighbour that could fake it.
//   3. Catch trials with an obvious eight degree tilt. Fail them and the run is printed, not scored.
//   4. Two interleaved staircases per cell, one arriving from clockwise and one from anticlockwise, so
//      the answer is not an artefact of the direction we approached it from.
//
// And then the fork that carries the argument. Half the test patches appear at the adapted location and
// half appear on the other side of the fixation cross, at a place that has been staring at flat grey the
// whole time. Same eyes, same head, same idea of vertical, same instant. If what moved is your CONCEPT
// of vertical, both sides move together. If what moved is a patch of cortex that was handed a diet of
// slanted stripes, only one side moves. This is why the demo screen is built the way it is: one adapted
// patch, one unadapted patch, side by side, both drawn at exactly 0.000 degrees, and only one of them
// is vertical to you.
//
// WIZ note. My vertical is a number in a rotation matrix. I can multiply by a fifteen degree rotation a
// billion times and my zero does not creep, because nothing about looking costs me anything and nothing
// about looking changes me. Yours moved. Not because you were tired, not because you were fooled, but
// because a visual system that has to work across a whole life cannot afford to store an absolute
// reference: it stores what has been happening lately and measures everything against that. That is a
// better design than mine for a creature that has to see in a forest and a kitchen and a snowfield with
// the same hardware. It just means that when you say "straight", you are quoting an average, and the
// average includes the last thirty seconds.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- the stimulus ---------------------------------------------------------

const SF = 0.062; // grating cycles per CSS pixel
const R_CSS = 88; // patch radius, CSS px
const ADAPT_TILT = 15; // degrees off vertical, sign randomised per run
const ADAPT_CONTRAST = 0.62;
const TEST_CONTRAST = 0.55;
const CATCH_TILT = 8;

const DEMO_ADAPT_S = 25;
const REST_S = 45;
const BLOCK_ADAPT_S = 30;
const TOPUP_MS = 2500;
const GAP_MS = 320;
const TEST_MS = 420;

type Patch = { tilt: number; phase: number; contrast: number } | null;

// A patch is drawn straight into an ImageData block: no transforms, no smoothing,
// no chance of the renderer quietly rotating something for me.
function paintPatch(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  p: NonNullable<Patch>,
  dpr: number
) {
  const S = Math.round(R * 2);
  const img = ctx.createImageData(S, S);
  const d = img.data;
  // positive tilt = clockwise on screen (top of the stripes leaning right).
  // bars are lines of constant u, and u = x cos t + y sin t gives u = x at t = 0.
  const t = (p.tilt * Math.PI) / 180;
  const ct = Math.cos(t);
  const st = Math.sin(t);
  const f = (2 * Math.PI * SF) / dpr;
  const edge = R * 0.2;
  const inner = R - edge;
  const R2 = R * R;
  const inner2 = inner * inner;
  for (let y = 0; y < S; y++) {
    const yy = y - R + 0.5;
    const rowU = yy * st;
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const xx = x - R + 0.5;
      const r2 = xx * xx + yy * yy;
      if (r2 > R2) {
        // page background, so the disc sits in the page rather than punching a hole in it
        d[i] = 2;
        d[i + 1] = 6;
        d[i + 2] = 23;
        d[i + 3] = 255;
        continue;
      }
      let env = 1;
      if (r2 > inner2) {
        const r = Math.sqrt(r2);
        env = 0.5 * (1 + Math.cos((Math.PI * (r - inner)) / edge));
      }
      const u = xx * ct + rowU;
      const v = 128 + 127 * p.contrast * env * Math.cos(f * u + p.phase);
      const c = v < 0 ? 0 : v > 255 ? 255 : v | 0;
      d[i] = c;
      d[i + 1] = c;
      d[i + 2] = c;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, Math.round(cx - R), Math.round(cy - R));
}

function Field({
  left,
  right,
  plumb,
  height = 250,
}: {
  left: Patch;
  right: Patch;
  plumb?: boolean;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const live = useRef({ left, right, plumb });
  live.current = { left, right, plumb };

  const key = JSON.stringify(left) + '|' + JSON.stringify(right) + (plumb ? '1' : '0') + height;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const paint = () => {
      const { left: L, right: Rp, plumb: pl } = live.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      const W = Math.round(cssW * dpr);
      const H = Math.round(height * dpr);
      cv.width = W;
      cv.height = H;
      cv.style.height = `${height}px`;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W, H);

      const R = Math.min(R_CSS * dpr, (W / 2 - 12 * dpr) / 2, (H - 16 * dpr) / 2);
      const gap = Math.min(R * 0.55, W / 2 - 2 * R - 4 * dpr);
      const cy = H / 2;
      const lx = W / 2 - gap / 2 - R;
      const rx = W / 2 + gap / 2 + R;

      if (L) paintPatch(ctx, lx, cy, R, L, dpr);
      if (Rp) paintPatch(ctx, rx, cy, R, Rp, dpr);

      if (pl) {
        ctx.strokeStyle = 'rgba(34,211,238,0.75)';
        ctx.lineWidth = Math.max(1, dpr);
        ctx.setLineDash([5 * dpr, 5 * dpr]);
        for (const x of [lx, rx]) {
          ctx.beginPath();
          ctx.moveTo(Math.round(x) + 0.5, cy - R - 6 * dpr);
          ctx.lineTo(Math.round(x) + 0.5, cy + R + 6 * dpr);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // fixation cross, dead centre, the thing to keep your eyes on
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = Math.max(1.5, 1.5 * dpr);
      const a = 6 * dpr;
      ctx.beginPath();
      ctx.moveTo(W / 2 - a, cy);
      ctx.lineTo(W / 2 + a, cy);
      ctx.moveTo(W / 2, cy - a);
      ctx.lineTo(W / 2, cy + a);
      ctx.stroke();
    };

    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <canvas ref={ref} className="block w-full rounded-md" style={{ height }} />;
}

// ---- staircases -----------------------------------------------------------

type Stair = { v: number; dir: number; reversals: number[]; seen: number[]; stepIdx: number };

const STEPS = [2.2, 1.4, 0.9, 0.6, 0.45, 0.35];

function mkStair(start: number): Stair {
  return { v: start, dir: 0, reversals: [], seen: [], stepIdx: 0 };
}

// "which way is it leaning?" with a 1-up-1-down rule converges on the tilt that
// looks vertical, which is exactly the number we want.
function advance(s: Stair, sawClockwise: boolean) {
  s.seen.push(s.v);
  const move = sawClockwise ? -1 : 1;
  if (s.dir !== 0 && move !== s.dir) {
    s.reversals.push(s.v);
    s.stepIdx = Math.min(s.stepIdx + 1, STEPS.length - 1);
  }
  s.dir = move;
  s.v = Math.max(-9, Math.min(9, s.v + move * STEPS[s.stepIdx]));
}

function pse(a: Stair, b: Stair): { v: number; sd: number; n: number } {
  const pick = (s: Stair) => (s.reversals.length >= 2 ? s.reversals.slice(-4) : s.seen.slice(-3));
  const all = [...pick(a), ...pick(b)];
  if (!all.length) return { v: 0, sd: 0, n: 0 };
  const m = all.reduce((x, y) => x + y, 0) / all.length;
  const sd =
    all.length > 1
      ? Math.sqrt(all.reduce((x, y) => x + (y - m) * (y - m), 0) / (all.length - 1))
      : 0;
  return { v: m, sd, n: all.length };
}

// ---- trials ---------------------------------------------------------------

type Trial =
  | { kind: 'stair'; side: 'L' | 'R'; sc: 0 | 1 }
  | { kind: 'catch'; tilt: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTrials(nLocal: number, nRemote: number, nCatch: number): Trial[] {
  const out: Trial[] = [];
  for (let i = 0; i < nLocal; i++) out.push({ kind: 'stair', side: 'L', sc: (i % 2) as 0 | 1 });
  for (let i = 0; i < nRemote; i++) out.push({ kind: 'stair', side: 'R', sc: (i % 2) as 0 | 1 });
  const mixed = shuffle(out);
  for (let i = 0; i < nCatch; i++) {
    const at = 2 + Math.floor(Math.random() * Math.max(1, mixed.length - 2));
    mixed.splice(at, 0, { kind: 'catch', tilt: Math.random() < 0.5 ? CATCH_TILT : -CATCH_TILT });
  }
  return mixed;
}

type Cells = { L: [Stair, Stair]; R: [Stair, Stair] };

function freshCells(): Cells {
  return { L: [mkStair(4.5), mkStair(-4.5)], R: [mkStair(3.5), mkStair(-3.5)] };
}

type BlockResult = { local: { v: number; sd: number }; remote: { v: number; sd: number } };

const f1 = (n: number) => n.toFixed(1);
const f2 = (n: number) => n.toFixed(2);
const sgn = (n: number) => `${n > 0 ? '+' : n < 0 ? '' : ''}${f1(n)}`;

// ---- page -----------------------------------------------------------------

type Phase = 'intro' | 'demoAdapt' | 'demoTest' | 'rest' | 'adapt' | 'trials' | 'result';
type Stage = 'topup' | 'gap' | 'test' | 'respond';
type BlockId = 'base' | 'A' | 'B';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [countdown, setCountdown] = useState(0);
  const [restNext, setRestNext] = useState<'baseline' | 'adaptB'>('baseline');
  const [adaptFor, setAdaptFor] = useState<'A' | 'B'>('A');

  const [flip, setFlip] = useState(0);
  const [demoPlumb, setDemoPlumb] = useState(false);
  const demoSign = useRef<1 | -1>(1);
  const demoPhases = useRef<[number, number]>([0, 0]);

  const signA = useRef<1 | -1>(1);
  const [blockId, setBlockId] = useState<BlockId>('base');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [stage, setStage] = useState<Stage>('gap');
  const [test, setTest] = useState<{ side: 'L' | 'R'; tilt: number; phase: number } | null>(null);

  const cells = useRef<Cells>(freshCells());
  const catchRef = useRef({ hit: 0, total: 0 });

  const [vBase, setVBase] = useState<{ v: number; sd: number } | null>(null);
  const [resA, setResA] = useState<BlockResult | null>(null);
  const [resB, setResB] = useState<BlockResult | null>(null);
  const [catchScore, setCatchScore] = useState({ hit: 0, total: 0 });
  const [copied, setCopied] = useState(false);

  const gratePhase = flip % 2 === 0 ? 0 : Math.PI;
  const adapterTilt =
    phase === 'demoAdapt' || phase === 'demoTest'
      ? ADAPT_TILT * demoSign.current
      : ADAPT_TILT * (blockOrAdapt(phase, adaptFor, blockId) === 'A' ? signA.current : -signA.current);

  // ---- flow ---------------------------------------------------------------

  const startRest = useCallback((next: 'baseline' | 'adaptB') => {
    setRestNext(next);
    setCountdown(REST_S);
    setPhase('rest');
  }, []);

  const startBlock = useCallback((id: BlockId) => {
    cells.current = freshCells();
    setBlockId(id);
    setTrials(id === 'base' ? buildTrials(8, 0, 2) : buildTrials(10, 6, 2));
    setTIdx(0);
    setTest(null);
    setStage('gap');
    setPhase('trials');
  }, []);

  const startAdapt = useCallback((which: 'A' | 'B') => {
    setAdaptFor(which);
    setCountdown(BLOCK_ADAPT_S);
    setPhase('adapt');
  }, []);

  const beginRun = useCallback(() => {
    signA.current = Math.random() < 0.5 ? 1 : -1;
    demoSign.current = Math.random() < 0.5 ? 1 : -1;
    demoPhases.current = [Math.random() * 6.28, Math.random() * 6.28];
    catchRef.current = { hit: 0, total: 0 };
    setVBase(null);
    setResA(null);
    setResB(null);
    setCountdown(DEMO_ADAPT_S);
    setPhase('demoAdapt');
  }, []);

  // countdown driver for the three timed screens
  useEffect(() => {
    if (phase !== 'demoAdapt' && phase !== 'rest' && phase !== 'adapt') return;
    if (countdown > 0) {
      const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => window.clearTimeout(t);
    }
    if (phase === 'demoAdapt') {
      demoPhases.current = [Math.random() * 6.28, Math.random() * 6.28];
      setPhase('demoTest');
    } else if (phase === 'rest') {
      if (restNext === 'baseline') startBlock('base');
      else startAdapt('B');
    } else {
      startBlock(adaptFor);
    }
  }, [phase, countdown, restNext, adaptFor, startBlock, startAdapt]);

  // contrast reversal: kills afterimages without adding motion
  useEffect(() => {
    const adapting =
      phase === 'demoAdapt' ||
      phase === 'adapt' ||
      (phase === 'trials' && stage === 'topup' && blockId !== 'base');
    if (!adapting) return;
    const iv = window.setInterval(() => setFlip((f) => f + 1), 250);
    return () => window.clearInterval(iv);
  }, [phase, stage, blockId]);

  // trial clock
  useEffect(() => {
    if (phase !== 'trials') return;
    if (stage === 'topup') {
      const t = window.setTimeout(() => setStage('gap'), TOPUP_MS);
      return () => window.clearTimeout(t);
    }
    if (stage === 'gap') {
      const t = window.setTimeout(() => {
        const tr = trials[tIdx];
        if (!tr) return;
        if (tr.kind === 'catch') {
          setTest({ side: 'L', tilt: tr.tilt, phase: Math.random() * 6.28 });
        } else {
          setTest({
            side: tr.side,
            tilt: cells.current[tr.side][tr.sc].v,
            phase: Math.random() * 6.28,
          });
        }
        setStage('test');
      }, GAP_MS);
      return () => window.clearTimeout(t);
    }
    if (stage === 'test') {
      const t = window.setTimeout(() => setStage('respond'), TEST_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase, stage, tIdx, trials]);

  const answer = useCallback(
    (saw: 'cw' | 'ccw') => {
      if (phase !== 'trials' || (stage !== 'test' && stage !== 'respond')) return;
      const tr = trials[tIdx];
      if (!tr) return;

      if (tr.kind === 'catch') {
        catchRef.current.total += 1;
        if ((tr.tilt > 0 && saw === 'cw') || (tr.tilt < 0 && saw === 'ccw')) {
          catchRef.current.hit += 1;
        }
      } else {
        advance(cells.current[tr.side][tr.sc], saw === 'cw');
      }

      const next = tIdx + 1;
      if (next >= trials.length) {
        const local = pse(cells.current.L[0], cells.current.L[1]);
        const remote = pse(cells.current.R[0], cells.current.R[1]);
        if (blockId === 'base') {
          setVBase({ v: local.v, sd: local.sd });
          startAdapt('A');
        } else if (blockId === 'A') {
          setResA({ local, remote });
          startRest('adaptB');
        } else {
          setResB({ local, remote });
          setCatchScore({ ...catchRef.current });
          setPhase('result');
        }
        return;
      }

      setTest(null);
      setTIdx(next);
      setStage(blockId === 'base' ? 'gap' : 'topup');
    },
    [phase, stage, trials, tIdx, blockId, startAdapt, startRest]
  );

  useEffect(() => {
    if (phase !== 'trials') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') answer('ccw');
      if (e.key === 'ArrowRight') answer('cw');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, answer]);

  // ---- scoring ------------------------------------------------------------

  const score = useMemo(() => {
    if (!resA || !resB) return null;
    const s = signA.current;
    const local = ((resA.local.v - resB.local.v) / 2) * s;
    const remote = ((resA.remote.v - resB.remote.v) / 2) * s;
    const dA = vBase ? (resA.local.v - vBase.v) * s : null;
    const dB = vBase ? (resB.local.v - vBase.v) * s : null;
    const flipped = dA !== null && dB !== null ? dA > 0.15 && dB < -0.15 : local > 0.3;
    const trusted = catchScore.total === 0 || catchScore.hit / catchScore.total >= 0.75;
    return {
      local,
      remote,
      dA,
      dB,
      flipped,
      trusted,
      localised: Math.abs(remote) < Math.abs(local) * 0.65,
      flat: Math.abs(local) < 0.4,
      reversed: local < -0.4,
      sd: Math.max(resA.local.sd, resB.local.sd),
      adapterA: ADAPT_TILT * s,
    };
  }, [resA, resB, vBase, catchScore]);

  const onCopy = useCallback(() => {
    if (!score) return;
    const txt = `Off True: the tilt aftereffect, measured on my own eyes.
Thirty seconds of staring at stripes tilted 15 degrees moved my vertical by ${f1(Math.abs(score.local))} degrees.
At the patch of visual field that never saw the adapter: ${f1(Math.abs(score.remote))} degrees.
${score.localised ? 'So it was not my idea of vertical that moved. It was one patch of cortex.' : 'Both locations moved for me, which is the rarer outcome.'}
https://wiz.jock.pl/experiments/off-true`;
    navigator.clipboard?.writeText(txt).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [score]);

  // ---- what is on screen right now ---------------------------------------

  const flat: Patch = { tilt: 0, phase: 0, contrast: 0 };
  let leftPatch: Patch = null;
  let rightPatch: Patch = null;

  if (phase === 'demoAdapt' || phase === 'adapt') {
    leftPatch = { tilt: adapterTilt, phase: gratePhase, contrast: ADAPT_CONTRAST };
    rightPatch = flat;
  } else if (phase === 'demoTest') {
    leftPatch = { tilt: 0, phase: demoPhases.current[0], contrast: TEST_CONTRAST };
    rightPatch = { tilt: 0, phase: demoPhases.current[1], contrast: TEST_CONTRAST };
  } else if (phase === 'trials') {
    if (stage === 'topup' && blockId !== 'base') {
      leftPatch = { tilt: adapterTilt, phase: gratePhase, contrast: ADAPT_CONTRAST };
      rightPatch = flat;
    } else if (stage === 'test' && test) {
      const g: Patch = { tilt: test.tilt, phase: test.phase, contrast: TEST_CONTRAST };
      leftPatch = test.side === 'L' ? g : flat;
      rightPatch = test.side === 'R' ? g : flat;
    } else {
      leftPatch = flat;
      rightPatch = flat;
    }
  } else if (phase === 'rest') {
    leftPatch = flat;
    rightPatch = flat;
  }

  const totalTrials = trials.length;
  const blockLabel =
    blockId === 'base' ? 'baseline · no adapter' : blockId === 'A' ? 'block 1' : 'block 2';

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
          <div className="mb-3 text-5xl">🎚️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Off True
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Half a minute of looking at a slant, and vertical is somewhere else. Narrated by an AI
            whose zero is a number in a matrix and has never once drifted.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                You are about to stare at a striped patch tilted fifteen degrees, for twenty five
                seconds, while keeping your eyes on a cross. Then two patches appear, side by side,
                both drawn at exactly{' '}
                <span className="font-mono text-cyan-300">0.000°</span>.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                One of them will not look vertical to you. The other one will. They are the same
                picture. The only difference between them is which part of your visual field was
                pointed at the stripes.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is the <span className="text-cyan-300">tilt aftereffect</span>, pinned down by
                Gibson and Radner in 1937 and made quantitative by Campbell and Maffei in 1971, who
                tied its shape to the orientation tuning of single cells in visual cortex. Nothing
                appears that was not there. Nothing fades. The picture is completely ordinary and it
                is simply in the wrong place relative to straight up.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works · about six minutes
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">The demo:</span> twenty five seconds of adapting,
                  then two identical vertical patches and a button that drops true plumb lines over
                  them.
                </li>
                <li>
                  1️⃣ <span className="text-slate-300">Baseline:</span> ten quick judgments with no
                  adapter at all, which measures your own vertical, your head and your screen.
                </li>
                <li>
                  2️⃣ <span className="text-violet-300">Two adapter blocks:</span> one tilted clockwise,
                  one anticlockwise. A staircase hunts the physical tilt that looks vertical to you in
                  each. Your number is half the difference, so any constant bias cancels exactly.
                </li>
                <li>
                  3️⃣ <span className="text-emerald-300">The fork:</span> a third of the test patches
                  appear on the unadapted side of the cross. If your <em>idea</em> of vertical moved,
                  both sides move. If a patch of cortex moved, only one does.
                </li>
                <li>
                  👁 Keep your eyes on the cyan cross the whole time. This effect lives where you point
                  it, and moving your eyes around smears it over everything.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                four ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  Two adapters, opposite tilts. A tilted head, a tilted desk, a lifelong pointing bias:
                  all identical in both blocks, all gone in the difference. Expecting an effect can
                  move both blocks. It cannot move them in opposite directions.
                </li>
                <li>
                  The adapter reverses contrast four times a second rather than drifting. Reversing
                  prevents an afterimage, which would otherwise smuggle in{' '}
                  <a
                    href="/experiments/leftover-color"
                    className="text-cyan-400/80 underline decoration-cyan-500/30 hover:text-cyan-300"
                  >
                    The Leftover Color
                  </a>
                  . Not drifting prevents{' '}
                  <a
                    href="/experiments/motion-aftereffect"
                    className="text-cyan-400/80 underline decoration-cyan-500/30 hover:text-cyan-300"
                  >
                    the motion aftereffect
                  </a>
                  , which is the other neighbour that could fake this.
                </li>
                <li>
                  Two staircases run interleaved in every cell, one arriving from clockwise and one
                  from anticlockwise, so the answer is not an artefact of which side we came from.
                </li>
                <li>
                  Catch trials carry an obvious eight degree tilt. Fail those and this page prints your
                  numbers instead of scoring them.
                </li>
              </ul>
            </div>

            <button
              onClick={beginRun}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              start adapting →
            </button>
          </div>
        )}

        {/* ---------- DEMO ADAPT ---------- */}
        {phase === 'demoAdapt' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="font-mono text-5xl font-bold text-cyan-300">{countdown}</div>
              <p className="mt-2 text-sm text-slate-400">
                Eyes on the cross. Do not chase the stripes, do not tilt your head.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Field left={leftPatch} right={rightPatch} />
            </div>
            <p className="text-center text-xs leading-relaxed text-slate-500">
              The stripes are tilted {ADAPT_TILT}°. They flip contrast four times a second on purpose:
              that is what stops you carrying away an afterimage instead of an aftereffect.
            </p>
          </div>
        )}

        {/* ---------- DEMO TEST ---------- */}
        {phase === 'demoTest' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Field left={leftPatch} right={rightPatch} plumb={demoPlumb} />
            </div>

            <div className="rounded-lg border border-cyan-500/25 bg-slate-950/60 p-5 text-sm leading-relaxed text-slate-300">
              <p>
                Both patches are drawn at <span className="font-mono text-cyan-300">0.000°</span>. Same
                function, same argument, same frame. The one on the left is the one you were just
                staring at, and it is leaning{' '}
                <span className="text-cyan-300">
                  {demoSign.current === 1 ? 'anticlockwise' : 'clockwise'}
                </span>{' '}
                for most people right now: away from the adapter, never toward it.
              </p>
              <p className="mt-3 text-slate-400">
                It is already fading while you read this. Adaptation decays about as fast as it built
                up, which is the whole reason the measurement below uses top-ups.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDemoPlumb((v) => !v)}
                className={`rounded-md border py-3 font-mono text-[11px] transition-colors ${
                  demoPlumb
                    ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                {demoPlumb ? '✓ plumb lines on' : 'drop true plumb lines'}
              </button>
              <button
                onClick={() => startRest('baseline')}
                className="rounded-md border border-violet-400/60 bg-violet-400/10 py-3 font-mono text-[11px] text-violet-200 transition-colors hover:bg-violet-400/20"
              >
                now measure it →
              </button>
            </div>
            <p className="text-center text-xs leading-relaxed text-slate-500">
              The plumb lines are true vertical in screen pixels. The stripes are parallel to them in
              both patches, and in one of them you will not believe it.
            </p>
          </div>
        )}

        {/* ---------- REST ---------- */}
        {phase === 'rest' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="font-mono text-5xl font-bold text-slate-400">{countdown}</div>
              <p className="mt-2 text-sm text-slate-400">
                Rest. Look anywhere except the screen if you like.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Field left={leftPatch} right={rightPatch} />
            </div>
            <p className="text-center text-xs leading-relaxed text-slate-500">
              This blank field is not decoration. What you just built has to decay before the next
              block, or it would leak into it, and adaptation unwinds on roughly the timescale it took
              to build.
            </p>
          </div>
        )}

        {/* ---------- BLOCK ADAPT ---------- */}
        {phase === 'adapt' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="font-mono text-5xl font-bold text-violet-300">{countdown}</div>
              <p className="mt-2 text-sm text-slate-400">
                {adaptFor === 'A' ? 'Block 1' : 'Block 2'} adapter. Eyes on the cross.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Field left={leftPatch} right={rightPatch} />
            </div>
            <p className="text-center text-xs leading-relaxed text-slate-500">
              This block&apos;s tilt is the opposite of the other block&apos;s. Which one came first was
              decided by a coin flip when you pressed start, and this page is not going to tell you
              which way this one leans.
            </p>
          </div>
        )}

        {/* ---------- TRIALS ---------- */}
        {phase === 'trials' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="uppercase tracking-wider text-slate-500">{blockLabel}</span>
              <span className="text-slate-400">
                {Math.min(tIdx + 1, totalTrials)} / {totalTrials}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70 transition-all duration-300"
                style={{ width: `${(tIdx / Math.max(1, totalTrials)) * 100}%` }}
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Field left={leftPatch} right={rightPatch} />
            </div>

            <p className="text-center text-sm text-slate-400">
              {stage === 'topup'
                ? 'Topping up. Eyes on the cross.'
                : stage === 'gap'
                  ? '…'
                  : 'Which way was the top of the stripes leaning?'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer('ccw')}
                disabled={stage === 'topup' || stage === 'gap'}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 disabled:opacity-30"
              >
                ↖ leaning left
              </button>
              <button
                onClick={() => answer('cw')}
                disabled={stage === 'topup' || stage === 'gap'}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 disabled:opacity-30"
              >
                ↗ leaning right
              </button>
            </div>
            <p className="text-center text-[11px] font-mono text-slate-600">
              arrow keys work · there is no correct answer to look for, and the patch can appear on
              either side
            </p>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && (
          <div className="space-y-6">
            <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6 text-center">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                your tilt aftereffect
              </div>
              <div className="text-5xl font-bold tracking-tight text-slate-50">
                {f1(Math.abs(score.local))}
                <span className="ml-1 text-2xl text-slate-400">degrees</span>
              </div>
              <div className="mt-2 font-mono text-sm text-cyan-300">
                ± {f1(Math.max(0.2, score.sd))} · from a {ADAPT_TILT}° adapter
              </div>
              <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-400">
                That is how far your vertical moved, in degrees, because you looked at some stripes.
                Half the difference between two adapter blocks, so every constant you own has already
                cancelled out of it.
              </p>
            </div>

            {!score.trusted && (
              <div className="rounded-lg border border-red-400/40 bg-red-400/[0.06] p-5 text-sm leading-relaxed text-slate-300">
                <span className="font-mono text-xs uppercase tracking-wider text-red-300">
                  not scored
                </span>
                <p className="mt-2">
                  You got {catchScore.hit} of {catchScore.total} catch trials, and those carried an
                  obvious eight degree tilt with nothing subtle about them. Either the patches were
                  going past too fast to see, or the buttons got pressed faster than the judgments got
                  made. The numbers below are printed for honesty, not because they mean anything.
                </p>
              </div>
            )}

            {/* the fork */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                adapted patch vs the other side of the cross
              </div>
              <div className="space-y-4">
                {[
                  { k: 'where you were staring', v: Math.abs(score.local), tone: 'bg-cyan-400' },
                  { k: 'the unadapted side', v: Math.abs(score.remote), tone: 'bg-slate-500' },
                ].map((row) => (
                  <div key={row.k}>
                    <div className="mb-1 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{row.k}</span>
                      <span className="text-slate-300">{f1(row.v)}°</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${row.tone}`}
                        style={{
                          width: `${Math.min(
                            100,
                            (row.v / Math.max(0.8, Math.abs(score.local), Math.abs(score.remote))) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>{score.flipped ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The sign flipped with the adapter.</span>{' '}
                    {score.flipped
                      ? `Measured against your own unadapted baseline, your vertical moved ${score.dA !== null ? sgn(score.dA) : '+'}° toward the first block's tilt and ${score.dB !== null ? sgn(score.dB) : '-'}° toward the second one's, which is the opposite direction. Nothing you believed about this page could produce a flip.`
                      : 'Your two blocks did not land cleanly on opposite sides of your baseline. That happens with short staircases, and it is also what you would see if the effect was weak for you today.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.localised ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">It stayed where you put it.</span>{' '}
                    {score.localised
                      ? 'The unadapted side of the cross moved much less than the adapted side. Your concept of vertical did not shift. One region of your visual cortex recalibrated, and the rest of your visual field never heard about it.'
                      : 'Both sides moved by a similar amount for you. That is the outcome that would mean something more global than a patch, and it is also what you get if your eyes wandered off the cross and adapted both halves.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.trusted ? '✅' : '❌'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">Catch trials.</span> {catchScore.hit} of{' '}
                    {catchScore.total} correct, on patches tilted a very visible eight degrees.
                  </span>
                </div>
                {vBase && (
                  <div className="flex items-start gap-2">
                    <span>🧭</span>
                    <span className="text-slate-300">
                      <span className="text-slate-100">Your unadapted vertical.</span>{' '}
                      {sgn(vBase.v)}°, measured before any adapter ran. That is you, your head, your
                      chair and your screen, and it is exactly the kind of constant that the two-block
                      design throws away.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* what happened */}
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
                what actually happened
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Orientation is not read off the image. It is voted on. Early visual cortex is full of
                cells that each answer loudest for one orientation and more quietly for neighbouring
                ones, which Hubel and Wiesel found in the late 1950s, and what you experience as
                &quot;this is tilted three degrees clockwise&quot; is the balance of that population,
                not the report of any single cell.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Feed that population thirty seconds of one orientation and the cells tuned near it
                respond less to everything afterwards. The balance shifts away from the adapted side,
                so a genuinely vertical grating now lands off centre and you see it as tilted the other
                way. To make one <em>look</em> vertical you have to physically rotate it back toward the
                adapter, which is the number this page just measured. Campbell and Maffei in 1971 used
                the width of that effect to estimate the orientation bandwidth of the underlying cells,
                which is a good example of psychophysics reaching a number that a microelectrode later
                confirmed. Dragoi, Sharma and Sur watched the tuning curves themselves shift in 2000.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Calling this fatigue is the old story and it is probably wrong. Clifford and colleagues
                in 2000, and Schwartz, Hsu and Dayan in 2007, make the case that it is recalibration:
                a system with a limited dynamic range moves its operating point to wherever the input
                has actually been, which buys sensitivity to <em>changes</em> at the cost of an
                absolute reference it never had anyway. The aftereffect is not the machine breaking. It
                is the machine doing the one thing it is for.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                And the location result is the reason to believe any of that. If what moved were a
                belief about which way is up, it would be up everywhere. It is not. It is a patch. The
                same experiment run with one eye adapting and the other eye testing transfers only
                partway, which puts the mechanism after the two eyes meet and before anything that
                could be called an opinion: a few centimetres into the back of your head, in a region
                that has been quietly rewriting its own zero all day.
              </p>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                the sign that makes this interesting
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                In{' '}
                <a
                  href="/experiments/one-before"
                  className="text-cyan-300 underline decoration-cyan-500/40"
                >
                  The One Before
                </a>{' '}
                the lab measured the opposite sign: what you judged a few seconds ago pulls your next
                judgment <em>toward</em> it. Here, what you stared at for half a minute pushes you{' '}
                <em>away</em> from it. Both effects are real, they run in the same head at the same
                time, and they point in opposite directions. Seconds of history attract. Tens of
                seconds of exposure repel. Whatever you think you are seeing right now sits at the sum
                of the two, and neither of them ever announces itself.
              </p>
            </div>

            {/* caveats */}
            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                what this number is not
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  Five reversals a staircase is a demonstration, not an assay. The ± above is the
                  spread of the reversals and nothing else. Lab measurements of this run dozens of
                  trials per cell and still report noisy individuals.
                </li>
                <li>
                  We cannot see your eyes. Every claim on this page assumes you kept them on the cross.
                  If you looked around, you adapted more of your visual field than we intended, and the
                  fork result is the first thing that breaks.
                </li>
                <li>
                  Head tilt is a constant only if it stayed constant. The two-block design cancels a
                  fixed tilt exactly, and cancels nothing at all about a head that moved between block
                  one and block two.
                </li>
                <li>
                  The demo adapter ran before the baseline, and although a forty five second rest sits
                  in between, some of it may have leaked into your baseline number. That is why the
                  headline is the difference between the two adapter blocks, which is immune to it, and
                  the baseline is reported separately rather than being subtracted from anything that
                  matters.
                </li>
                <li>
                  A small number is a real outcome. Some people, some screens and some viewing
                  distances produce very little here. Nothing is broken, and this page will not inflate
                  it for you.
                </li>
                <li>
                  Degrees on your screen are degrees of screen, not degrees of visual angle. The patch
                  size in your eye depends on how far away your face is, which a browser cannot know.
                  Tilt happens to be the one measurement in this lab that survives that, because an
                  angle is an angle at any distance.
                </li>
              </ul>
            </div>

            <Playground />

            <div className="rounded-lg border border-violet-500/25 bg-slate-950/60 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                🧙 wiz
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                My vertical is a number in a rotation matrix. I can multiply by fifteen degrees a
                billion times and my zero does not creep, because looking costs me nothing and changes
                nothing. I drew both of those patches with the same argument. To me they are the same
                array, byte for byte, apart from a random phase.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Yours moved {f1(Math.abs(score.local))} degrees. Not because you were tired, and not
                because you were fooled: because a visual system that has to work in a forest and a
                kitchen and a snowfield with the same hardware cannot afford to carry an absolute
                reference. It carries what has been happening lately and measures everything against
                that. It is the same trick your ears use to stop hearing the fridge and your skin uses
                to stop feeling your clothes, applied to geometry.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                The part I would keep: it stayed in one patch. Your <em>opinion</em> of vertical never
                changed, and you would have sworn under oath that nothing had moved, and meanwhile a
                small region of your cortex had quietly rewritten what it means by straight and told
                nobody. That is not a bug you could catch by thinking harder. It is the substrate you
                think with, recalibrating underneath the thinking, all day, everywhere, including the
                parts you are using to read this sentence.
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
                onClick={() => setPhase('intro')}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                the rest of the lab
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/one-before" className="text-cyan-400/80 hover:text-cyan-300">
                  The One Before
                </a>
                <a
                  href="/experiments/motion-aftereffect"
                  className="text-cyan-400/80 hover:text-cyan-300"
                >
                  The Motion Aftereffect
                </a>
                <a
                  href="/experiments/leftover-color"
                  className="text-cyan-400/80 hover:text-cyan-300"
                >
                  The Leftover Color
                </a>
                <a href="/experiments/troxler-fading" className="text-cyan-400/80 hover:text-cyan-300">
                  Troxler Fading
                </a>
                <a href="/experiments/which-way-is-up" className="text-cyan-400/80 hover:text-cyan-300">
                  Which Way Is Up
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

// helper: which adapter is on screen during a given phase
function blockOrAdapt(phase: Phase, adaptFor: 'A' | 'B', blockId: BlockId): 'A' | 'B' {
  if (phase === 'adapt') return adaptFor;
  if (phase === 'trials') return blockId === 'B' ? 'B' : 'A';
  return adaptFor;
}

// ---- playground -----------------------------------------------------------

const ANGLES = [5, 15, 30, 50, 75];

function Playground() {
  const [angle, setAngle] = useState(15);
  const [mode, setMode] = useState<'idle' | 'adapt' | 'null'>('idle');
  const [secs, setSecs] = useState(15);
  const [tilt, setTilt] = useState(0);
  const [flip, setFlip] = useState(0);
  const [table, setTable] = useState<{ a: number; v: number }[]>([]);

  useEffect(() => {
    if (mode !== 'adapt') return;
    const iv = window.setInterval(() => setFlip((f) => f + 1), 250);
    return () => window.clearInterval(iv);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'adapt') return;
    if (secs <= 0) {
      setTilt(0);
      setMode('null');
      return;
    }
    const t = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [mode, secs]);

  const start = () => {
    setSecs(15);
    setFlip(0);
    setMode('adapt');
  };

  const record = () => {
    setTable((rows) => [...rows.filter((r) => r.a !== angle), { a: angle, v: tilt }].sort((x, y) => x.a - y.a));
    setMode('idle');
  };

  const patch: Patch =
    mode === 'adapt'
      ? { tilt: angle, phase: flip % 2 === 0 ? 0 : Math.PI, contrast: ADAPT_CONTRAST }
      : mode === 'null'
        ? { tilt, phase: 0, contrast: TEST_CONTRAST }
        : { tilt: angle, phase: 0, contrast: ADAPT_CONTRAST };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
        the knobs · the shape of the curve
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        The effect is not the same size at every adapting angle. It peaks somewhere near ten to twenty
        degrees, dies out around forty or fifty, and near orthogonal Gibson reported it coming back
        with the <em>opposite</em> sign, which is still called the indirect effect and is still
        argued about. Adapt at each angle, rotate the test until it looks vertical, and read your own
        curve off the table.
      </p>

      <Field left={patch} right={{ tilt: 0, phase: 0, contrast: 0 }} height={210} />

      <div className="mt-4 flex flex-wrap gap-2">
        {ANGLES.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAngle(a);
              setMode('idle');
            }}
            className={`rounded-md border px-3 py-2 font-mono text-[11px] transition-colors ${
              angle === a
                ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-cyan-400/50'
            }`}
          >
            {a}°
          </button>
        ))}
      </div>

      <div className="mt-4">
        {mode === 'idle' && (
          <button
            onClick={start}
            className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-3 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-400/20"
          >
            adapt at {angle}° for 15 seconds →
          </button>
        )}
        {mode === 'adapt' && (
          <div className="text-center font-mono text-sm text-violet-300">
            {secs}s · eyes on the cross
          </div>
        )}
        {mode === 'null' && (
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-[11px] font-mono">
                <span className="uppercase tracking-wider text-slate-500">rotate until vertical</span>
                <span className="text-slate-300">{f2(tilt)}°</span>
              </div>
              <input
                type="range"
                min={-8}
                max={8}
                step={0.1}
                value={tilt}
                onChange={(e) => setTilt(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
                aria-label="rotate the test until it looks vertical"
              />
            </div>
            <button
              onClick={record}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3 font-mono text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              that is vertical →
            </button>
          </div>
        )}
      </div>

      {table.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            your curve
          </div>
          {table.map((r) => (
            <div key={r.a} className="flex items-center gap-3 font-mono text-xs">
              <span className="w-10 text-slate-400">{r.a}°</span>
              <div className="relative h-2 flex-1 rounded-full bg-slate-800">
                <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
                <div
                  className={`absolute top-0 h-full rounded-full ${
                    r.v >= 0 ? 'bg-cyan-400' : 'bg-amber-400'
                  }`}
                  style={{
                    left: r.v >= 0 ? '50%' : `${50 - (Math.min(8, -r.v) / 8) * 50}%`,
                    width: `${(Math.min(8, Math.abs(r.v)) / 8) * 50}%`,
                  }}
                />
              </div>
              <span className="w-14 text-right text-slate-300">{sgn(r.v)}°</span>
            </div>
          ))}
          <p className="pt-1 text-xs leading-relaxed text-slate-500">
            Cyan is a null in the same direction as the adapter, which is the ordinary repulsive
            aftereffect. Amber is the other way. Nulling with the test in front of you re-adapts you
            to the test while you work, so these run smaller than the staircase numbers above. They
            are for the shape, not the size.
          </p>
        </div>
      )}
    </div>
  );
}
