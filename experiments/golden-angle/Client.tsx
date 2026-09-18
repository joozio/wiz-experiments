'use client';

// THE GOLDEN ANGLE (phyllotaxis, the sunflower spiral)
// This lab has a small run of experiments that hand you a rule and let you watch
// what it does on its own. The Game of Life did it with a grid. Collatz did it
// with one number. The Prime Spiral did it with the primes. This one does it with
// a growing plant and a single angle.
//
// The rule. A sunflower head, a pinecone, a cactus, all build the same way: a new
// seed appears at the center, then drifts outward as the next one is born behind
// it, each new seed turned by the same fixed angle from the one before. Vogel
// wrote it down in 1979 as seed n sits at radius proportional to the square root
// of n, turned by n times the divergence angle. That divergence angle is the only
// knob. Everything you see is decided by it.
//
// WIZ note. Set the angle to 137.5077 degrees, which is the full circle divided by
// the golden ratio, and the seeds pack with no gaps and the spiral arms you can
// count come out as consecutive Fibonacci numbers. Move it a hundredth of a degree
// and the rosette falls apart. It works because the golden ratio is the most
// irrational number there is, the one no fraction can pin down, so no two seeds
// ever stack on the same ray. Nature did not derive this. It fell into it, because
// it is the packing that fits the most seeds in the least room. I like the toys
// that hide a piece of real mathematics. This one hides the densest arrangement of
// dots there is, and it is exactly one irrational number wide.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Pure math. Vogel's model + the continued-fraction count of spiral arms.
// Everything client-side, nothing fetched.
// ---------------------------------------------------------------------------

const PHI = (1 + Math.sqrt(5)) / 2;
const GOLDEN = 360 / (PHI * PHI); // 137.50776... degrees
const CANVAS = 720;
const MIN_SEEDS = 200;
const MAX_SEEDS = 2000;

const FIBS = new Set([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181]);

interface AngleInfo {
  spokes: number | null; // if the angle is a simple rational, how many straight spokes
  armLo: number | null; // smaller visible spiral-arm count
  armHi: number | null; // larger visible spiral-arm count
  fibPair: boolean; // both arm counts are Fibonacci numbers
  offGolden: number; // degrees away from the golden angle
}

// The number of spiral arms you can actually count in a phyllotactic rosette are
// the denominators of the best rational approximations of (angle / 360). So the
// continued fraction of that fraction hands you the arm counts directly. For the
// golden angle the continued fraction is all ones and the denominators are the
// Fibonacci numbers. For a simple rational like 90/360 = 1/4 it terminates, and
// the final denominator is the number of straight spokes.
function analyzeAngle(angleDeg: number, n: number): AngleInfo {
  const frac = ((((angleDeg % 360) + 360) % 360) / 360);
  const denoms: number[] = [];
  let pPrev = 1;
  let qPrev = 0;
  let pPrev2 = 0;
  let qPrev2 = 1;
  let y = frac;
  let terminated = false;
  let lastQ = 1;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(y + 1e-9);
    const p = a * pPrev + pPrev2;
    const q = a * qPrev + qPrev2;
    lastQ = q;
    if (q >= 2) denoms.push(q);
    pPrev2 = pPrev;
    pPrev = p;
    qPrev2 = qPrev;
    qPrev = q;
    const r = y - a;
    if (r < 1e-6) {
      terminated = true;
      break;
    }
    y = 1 / r;
    if (q > 4000) break;
  }

  // A small-denominator rational locks the seeds into straight spokes.
  let spokes: number | null = null;
  if (terminated && lastQ >= 1 && lastQ <= 60) spokes = lastQ;

  // Otherwise, the visible arm pair are the two consecutive convergent
  // denominators that straddle sqrt(n) (where the rosette is densest to the eye).
  let armLo: number | null = null;
  let armHi: number | null = null;
  if (!spokes) {
    const target = Math.sqrt(n);
    for (let i = 0; i < denoms.length - 1; i++) {
      if (denoms[i] <= target && denoms[i + 1] >= target) {
        armLo = denoms[i];
        armHi = denoms[i + 1];
        break;
      }
    }
    if (armLo === null) {
      if (denoms.length >= 2) {
        armLo = denoms[denoms.length - 2];
        armHi = denoms[denoms.length - 1];
      } else if (denoms.length === 1) {
        armLo = denoms[0];
        armHi = denoms[0];
      }
    }
  }

  const fibPair = !!armLo && !!armHi && FIBS.has(armLo) && FIBS.has(armHi);
  // shortest way around the dial to the golden angle
  let off = Math.abs(angleDeg - GOLDEN);
  off = Math.min(off, Math.abs(angleDeg - (360 - GOLDEN)));
  return { spokes, armLo, armHi, fibPair, offGolden: off };
}

interface Model {
  angle: number;
  count: number;
  xs: Float32Array;
  ys: Float32Array;
  dotR: number;
  info: AngleInfo;
  canvasPix: number;
}

function buildModel(angle: number, count: number): Model {
  const canvasPix = CANVAS;
  const center = canvasPix / 2;
  const margin = 16;
  const c = (center - margin) / Math.sqrt(Math.max(1, count - 1));
  const dotR = Math.min(7, Math.max(1.3, c * 0.62));
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  const rad = Math.PI / 180;
  for (let n = 0; n < count; n++) {
    const r = c * Math.sqrt(n);
    const th = n * angle * rad;
    xs[n] = center + r * Math.cos(th);
    ys[n] = center + r * Math.sin(th);
  }
  return { angle, count, xs, ys, dotR, info: analyzeAngle(angle, count), canvasPix };
}

// amber at the old center, teal in the body, violet at the fresh outer rim
function seedColor(t: number): string {
  const stops = [
    [251, 191, 36],
    [45, 212, 191],
    [167, 139, 250],
  ];
  const seg = t * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(seg));
  const f = seg - i;
  const a = stops[i];
  const b = stops[i + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return `rgb(${r},${g},${bl})`;
}

function fmtAngle(a: number): string {
  return `${a.toFixed(2)}°`;
}

// ---------------------------------------------------------------------------
// WIZ verdict, adapting to how the seeds actually packed.
// ---------------------------------------------------------------------------

interface Verdict {
  label: string;
  line: string;
  tone: 'good' | 'big' | 'warn';
}

function verdictFor(angle: number, info: AngleInfo): Verdict {
  const off = info.offGolden;
  const arms = info.armLo && info.armHi ? `${info.armLo} and ${info.armHi}` : null;

  if (info.spokes) {
    const s = info.spokes;
    return {
      label: `${s} rigid spoke${s > 1 ? 's' : ''}`,
      tone: 'warn',
      line: `You landed on ${fmtAngle(angle)}, a rational slice of the circle that divides evenly. So every seed eventually lands directly behind an earlier one, and instead of filling the disk they stack into ${s} straight spoke${s > 1 ? 's' : ''} with bare wedges of wasted space between them. A flower built this way would leave most of its head empty. This is the exact failure the golden angle was found to avoid.`,
    };
  }
  if (off < 0.02) {
    return {
      label: 'Dead on the golden angle',
      tone: 'big',
      line: `This is it: ${GOLDEN.toFixed(4)} degrees, the full circle divided by the golden ratio. The seeds settle into ${arms ?? 'interlocking'} spiral arms${info.fibPair ? ', consecutive Fibonacci numbers,' : ','} and not one of them wastes a sliver of room. No two seeds ever line up on a ray, so they pack tighter than any other angle on the dial can manage. This is the arrangement real sunflowers, pinecones and pineapples all found on their own, with no math at all.`,
    };
  }
  if (off < 1) {
    return {
      label: 'A hair off perfect',
      tone: 'good',
      line: `You are ${off.toFixed(2)} degrees off the golden angle. Look closely: the arms are still there${arms ? `, about ${arms} of them,` : ','} but they no longer run clean. They bend and slowly wind as they climb outward, because at this angle the seeds almost line up and the near-misses stack into long lazy curves. Slide it back toward ${GOLDEN.toFixed(2)} and watch the spirals snap flat again.`,
    };
  }
  if (off < 6) {
    return {
      label: 'Loosening up',
      tone: 'good',
      line: `${off.toFixed(1)} degrees off golden. The packing is opening up: ${arms ? `you can count roughly ${arms} arms now, ` : ''}the spirals are getting coarse and small gaps are showing between the seeds. Still a rosette, but a wasteful one. The closer you creep back to ${GOLDEN.toFixed(1)} degrees, the more those gaps close.`,
    };
  }
  return {
    label: 'Coarse and gappy',
    tone: 'warn',
    line: `${off.toFixed(1)} degrees off the golden angle. The seeds throw obvious gaps and the spiral arms are few and wide${arms ? ` (about ${arms})` : ''}. This angle wastes room a real plant could never afford. The one value that fits the most seeds into the least space is ${GOLDEN.toFixed(2)} degrees, and you can feel how narrow that target is by sliding back toward it.`,
  };
}

// ---------------------------------------------------------------------------
// Famous and instructive angles worth dropping in.
// ---------------------------------------------------------------------------

const PRESETS: { label: string; value: number; note: string }[] = [
  { label: 'Golden 137.51', value: GOLDEN, note: 'The angle of the sunflower. Perfect packing, Fibonacci spiral arms.' },
  { label: '137.30', value: 137.3, note: 'Two tenths of a degree short. The arms survive but slowly unwind.' },
  { label: '137.70', value: 137.7, note: 'A hair over. The arms wind the other way.' },
  { label: '90', value: 90, note: 'A right angle. Four rigid spokes, bald wedges between them.' },
  { label: '120', value: 120, note: 'A third of the circle. Three arms, locked solid.' },
  { label: '144', value: 144, note: 'Two fifths of the circle. Five spokes, lots of wasted space.' },
  { label: '99.50', value: 99.5, note: 'Far from golden. Loose, gappy, coarse spirals.' },
  { label: '137.508', value: 137.508, note: 'Hundredths of a degree off. Watch how fast it falls apart.' },
];

// ---------------------------------------------------------------------------

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [angle, setAngle] = useState<number>(GOLDEN);
  const [angleInput, setAngleInput] = useState<string>(GOLDEN.toFixed(2));
  const [count, setCount] = useState<number>(1200);
  const [reveal, setReveal] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(4);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const model = useMemo(() => buildModel(angle, count), [angle, count]);
  const done = reveal >= model.count - 1;

  // keep the text field in step with the live angle
  useEffect(() => {
    setAngleInput(angle.toFixed(angle === GOLDEN ? 4 : 2));
  }, [angle]);

  // grow the seeds outward on first paint so the lab is never static
  useEffect(() => {
    setReveal(0);
    setRunning(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setting the angle (slider, nudge, input) shows the whole rosette at once
  const applyAngle = useCallback((next: number) => {
    const clamped = Math.min(360, Math.max(0, next));
    setAngle(clamped);
    setRunning(false);
    setReveal(MAX_SEEDS);
  }, []);

  const nudge = useCallback(
    (delta: number) => {
      setRunning(false);
      setReveal(MAX_SEEDS);
      setAngle((a) => {
        const next = Math.min(360, Math.max(0, Math.round((a + delta) * 100) / 100));
        return next;
      });
    },
    []
  );

  // presets and the grow button animate the seeds out from the center
  const grow = useCallback((next?: number) => {
    if (typeof next === 'number') setAngle(Math.min(360, Math.max(0, next)));
    setReveal(0);
    setRunning(true);
  }, []);

  // ---- animation loop -----------------------------------------------------
  useEffect(() => {
    if (!running) return;
    const last = model.count - 1;
    if (reveal >= last) {
      setRunning(false);
      return;
    }
    const perTick = Math.max(1, Math.round(model.count / 110) * speed);
    const id = setInterval(() => {
      setReveal((r) => {
        const nx = r + perTick;
        if (nx >= last) {
          setRunning(false);
          return last;
        }
        return nx;
      });
    }, 24);
    return () => clearInterval(id);
  }, [running, speed, model, reveal]);

  // ---- draw the rosette ---------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const m = model;
    if (!canvas) return;
    if (canvas.width !== m.canvasPix) {
      canvas.width = m.canvasPix;
      canvas.height = m.canvasPix;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#05010f';
    ctx.fillRect(0, 0, m.canvasPix, m.canvasPix);
    const upto = Math.min(reveal, m.count - 1);
    for (let n = 0; n <= upto; n++) {
      const t = m.count > 1 ? n / (m.count - 1) : 0;
      ctx.fillStyle = seedColor(t);
      ctx.beginPath();
      ctx.arc(m.xs[n], m.ys[n], m.dotR, 0, Math.PI * 2);
      ctx.fill();
    }
    // the moving frontier, the seed being born right now
    if (upto < m.count - 1) {
      ctx.shadowColor = '#e9e4ff';
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(233,228,255,0.95)';
      ctx.beginPath();
      ctx.arc(m.xs[upto], m.ys[upto], Math.max(2, m.dotR * 1.2), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [model, reveal]);

  const verdict = useMemo(() => verdictFor(angle, model.info), [angle, model.info]);

  const armText = model.info.spokes
    ? `${model.info.spokes} spokes`
    : model.info.armLo && model.info.armHi
      ? model.info.armLo === model.info.armHi
        ? `${model.info.armLo}`
        : `${model.info.armLo} & ${model.info.armHi}`
      : '—';

  const onCopy = useCallback(async () => {
    const arms = model.info.spokes
      ? `${model.info.spokes} straight spokes`
      : model.info.armLo && model.info.armHi
        ? `${model.info.armLo} and ${model.info.armHi} spiral arms`
        : 'a scatter of arms';
    const text = `I set the divergence angle to ${fmtAngle(angle)} and watched ${count} seeds pack into ${arms}${
      model.info.fibPair ? ', the same Fibonacci numbers real sunflowers use' : ''
    }. Nudge it a hundredth of a degree off 137.51 and the whole pattern falls apart.\n\nThe Golden Angle, WIZ edition: https://wiz.jock.pl/experiments/golden-angle`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [angle, count, model.info]);

  const toneClass =
    verdict.tone === 'big'
      ? 'border-violet-500/40 bg-violet-950/20 text-violet-100'
      : verdict.tone === 'warn'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-teal-500/40 bg-teal-950/20 text-teal-100';

  const commitInput = () => {
    const v = parseFloat(angleInput.replace(/[^\d.]/g, ''));
    if (Number.isFinite(v)) applyAngle(v);
    else setAngleInput(angle.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950/30 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Golden Angle
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Every seed in a sunflower lands a fixed angle from the last one. One number on a dial decides
            whether the head packs flawlessly or falls apart. Find it.
          </p>
        </header>

        {/* The rosette */}
        <div className="rounded-lg border border-slate-800 bg-[#05010f] p-2 shadow-2xl shadow-violet-950/40">
          <div className="relative mx-auto" style={{ maxWidth: 560 }}>
            <canvas
              ref={canvasRef}
              className="block w-full rounded"
              style={{ aspectRatio: '1 / 1' }}
              aria-label="A phyllotactic rosette of seeds placed by the divergence angle."
            />
          </div>
          <div className="px-1 pb-1 pt-1.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
            each dot is a seed · oldest at the center · newest on the rim
          </div>
        </div>

        {/* The one knob */}
        <div className="mt-4 rounded-lg border border-violet-500/30 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">
              Divergence angle
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                inputMode="decimal"
                value={angleInput}
                onChange={(e) => setAngleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitInput();
                }}
                onBlur={commitInput}
                className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-base tabular-nums text-slate-100 outline-none transition focus:border-violet-400"
                aria-label="Divergence angle in degrees"
              />
              <span className="text-sm text-slate-500">deg</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={0.1}
            value={Math.min(180, angle)}
            onChange={(e) => applyAngle(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-violet-400"
            aria-label="Divergence angle slider"
          />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {[-1, -0.1, -0.01].map((d) => (
              <button
                key={d}
                onClick={() => nudge(d)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => applyAngle(GOLDEN)}
              className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20"
            >
              ✦ golden
            </button>
            {[0.01, 0.1, 1].map((d) => (
              <button
                key={d}
                onClick={() => nudge(d)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                +{d}
              </button>
            ))}
            <button
              onClick={() => grow(Math.round(Math.random() * 18000) / 100)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              🎲 random
            </button>
          </div>
        </div>

        {/* Seeds + grow */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex flex-1 items-center gap-2 text-xs text-slate-400">
            <span className="whitespace-nowrap">Seeds</span>
            <input
              type="range"
              min={MIN_SEEDS}
              max={MAX_SEEDS}
              step={100}
              value={count}
              onChange={(e) => {
                const c = parseInt(e.target.value, 10);
                setCount(c);
                setRunning(false);
                setReveal(MAX_SEEDS);
              }}
              className="h-1 flex-1 cursor-pointer accent-teal-400"
              aria-label="Number of seeds"
            />
            <span className="w-12 tabular-nums text-slate-500">{count}</span>
          </label>
          <button
            onClick={() => grow()}
            className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-400"
          >
            {done ? '↻ Grow again' : '❚❚ Growing…'}
          </button>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span className="whitespace-nowrap">Speed</span>
            <input
              type="range"
              min={1}
              max={8}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className="h-1 w-20 cursor-pointer accent-violet-400"
              aria-label="Growth speed"
            />
            <span className="w-7 tabular-nums text-slate-500">{speed}x</span>
          </label>
        </div>

        {/* Live stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <Stat label="Angle" value={fmtAngle(angle)} />
          <Stat label="Seeds" value={String(count)} />
          <Stat label="Off golden" value={fmtAngle(model.info.offGolden)} />
          <Stat
            label="Spiral arms"
            value={armText}
            badge={model.info.fibPair ? 'Fibonacci' : undefined}
          />
        </div>

        {/* WIZ verdict */}
        <div className={`mt-4 rounded-lg border p-4 text-sm transition-colors ${toneClass}`}>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
            {done ? verdict.label : 'Growing…'}
          </div>
          <p className="leading-relaxed">
            {done
              ? verdict.line
              : 'Watch the seeds wind out from the center. The whole pattern is the work of one angle.'}
          </p>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or drop in a famous angle
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => grow(p.value)}
                title={p.note}
                className="group flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-center text-sm transition hover:border-violet-400/60 hover:bg-slate-800"
              >
                <span className="font-mono font-semibold text-violet-200 group-hover:text-violet-100">
                  {p.label}
                  <span className="text-slate-500">{'°'}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Tip: hover a preset to see what it does. 137.51 is the one nature settled on.
          </p>
        </div>

        {/* The rule */}
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setShowRules((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base font-semibold text-slate-100">The only rule there is</span>
            <span className="text-slate-500">{showRules ? '−' : '+'}</span>
          </button>
          {showRules && (
            <div className="space-y-2 border-t border-slate-800 px-5 py-4 text-sm leading-relaxed text-slate-300">
              <p>Vogel wrote the whole thing down in 1979, and it has two halves:</p>
              <ul className="ml-1 space-y-1.5">
                <li>
                  <span className="text-teal-300">place</span> seed number n at a radius proportional to the
                  square root of n, so the head fills evenly from the center out.
                </li>
                <li>
                  <span className="text-violet-300">turn</span> each seed by the same fixed angle from the one
                  before it. That divergence angle is the only thing you are changing.
                </li>
              </ul>
              <p className="text-slate-400">
                The spiral arms your eye picks out are not drawn in. They are the leftover lines where seeds at
                regular gaps happen to fall near each other, and the number of them is fixed by the angle: it is
                the denominator of the closest simple fraction to the angle over a full circle. At the golden
                angle the closest fractions are the Fibonacci ratios, which is why a real sunflower head almost
                always shows a Fibonacci number of spirals, like 34 one way and 55 the other.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            The golden angle is what you get when you cut the circle by the golden ratio, the number that is the
            hardest of all to approximate with any fraction. That sounds like a curse and it is the whole gift.
            Because no fraction ever comes close, no two seeds ever line up behind each other on a ray, and the
            head fills with no spokes and no gaps. Every other angle you can pick is a little bit rational, lines
            its seeds up sooner or later, and wastes the space between.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            That is the feeling I want you to keep. The most efficient packing in all of nature is not a clever
            invention. It is just the one angle that refuses to repeat, and a plant that grows by pushing each new
            seed away from the crowded center falls into it on its own. No genes for Fibonacci, no calculator in
            the stem. Douady and Couder showed it in 1992 by dropping magnetized beads of fluid into a dish, where
            the drops, repelling each other as they drifted out, arranged themselves at{' '}
            <span className="text-slate-100">exactly the golden angle</span> with nothing alive in the room.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            So when the seeds snapped into a flawless sunflower and part of you thought{' '}
            <em>something must be arranging these</em>, you were half right. Something is.{' '}
            <span className="text-slate-100">It is the arithmetic of an irrational number,</span> and the target
            you were aiming at is exactly one of them wide.
          </p>
        </div>

        {/* History */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Kepler noticed Fibonacci numbers hiding in flowers and fruit back in 1611. In 1837 the brothers Louis
            and Auguste Bravais measured real plants and pinned the divergence angle at close to 137.5 degrees, the
            golden angle. Helmholtz and others puzzled over why. Helmut Vogel gave the clean square-root model in
            1979 that this toy runs on, and in 1992 the physicists Stephane Douady and Yves Couder ran the
            experiment that settled it: with no biology at all, drops of magnetic fluid pushed outward through a
            dish spontaneously fell into the same golden-angle spirals, showing the pattern is energy and geometry,
            not a genetic blueprint. Count the spirals on a pinecone, a pineapple, a head of romanesco or a real
            sunflower and you will almost always get two consecutive Fibonacci numbers, because the densest packing
            and the most irrational angle are the same thing seen from two directions.
          </p>
        </div>

        {/* Share + back */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-violet-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-violet-400"
          >
            {copied ? '✓ Copied' : 'Copy what your angle did'}
          </button>
          <button
            onClick={() => grow(GOLDEN)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Snap back to golden
          </button>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <a
            href="/experiments"
            className="text-sm text-slate-400 underline-offset-4 hover:text-violet-300 hover:underline"
          >
            ← back to all experiments
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className="break-all font-mono text-base font-bold tabular-nums text-slate-100">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      {badge && (
        <div className="mt-1 inline-block rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300">
          {badge}
        </div>
      )}
    </div>
  );
}
