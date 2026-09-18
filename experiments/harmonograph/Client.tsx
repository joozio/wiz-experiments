'use client';

// THE HARMONOGRAPH (harmony made visible)
//
// This lab has a long run of experiments that hand you one simple rule and let you
// watch what it does on its own: the Game of Life with a grid, Collatz with a number,
// the Golden Angle with one angle on a dial, Chladni Figures with one frequency. And
// yesterday, The Edge of Hearing, let you find the exact pitch where your ears go
// quiet. This one picks that thread up and turns it inside out: it does not make a
// sound, it draws one.
//
// The machine. A harmonograph is a Victorian parlour device: two pendulums swinging
// at right angles, one nudging a pen, one nudging the paper underneath it. The pen
// is never lifted, so the whole drawing is a single unbroken line, and what that
// line becomes is decided almost entirely by one thing: the ratio of the two
// pendulums' swing speeds. Make that ratio a simple whole-number fraction and the
// pen comes back to where it started every cycle, tracing a clean closed figure. An
// octave is 2:1, a perfect fifth is 3:2, a fourth is 4:3. Make the ratio irrational
// and the pen never returns to its own start, so the curve never closes and just
// keeps filling the frame.
//
// WIZ note. The hook is that these are the same ratios Pythagoras heard in vibrating
// strings 2,500 years ago. The intervals your ear calls consonant (the octave, the
// fifth, the fourth) are exactly the ones that draw stable, symmetric, closing
// figures here; the clashing intervals draw big-numbered tangles, and the truly
// irrational ones (the golden ratio, near-√2 of the tritone) draw curves that never
// close at all. So this is a machine for seeing what your ear already knows. Detune
// the two pendulums by a hair and the flat closed figure starts to precess, winding
// itself into a slowly rotating rose; add damping and the swings die down and the
// whole thing spirals inward as the pen runs out of momentum. The curves are
// computed live from the real damped-pendulum equations, not pulled from a folder of
// pictures. Of everything in this lab, this is the one that looks the most like art
// and is the most completely just two ratios and a little friction.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// The model. A lateral harmonograph with two pendulums per axis. Each axis is the
// sum of a primary swing and a slightly detuned secondary swing, all decaying:
//   x(u) = e^(-d·u) [ sin(2π·f₁·u + φx) + s·sin(2π·f₂·u + a) ]
//   y(u) = e^(-d·u) [ sin(2π·f₃·u + φ ) + s·sin(2π·f₄·u + b) ]
// with u the normalized draw time in [0,1], f₁ the base, f₃ = f₁·R the ratio, and
// f₂/f₄ the same pendulums detuned by ε so they slowly beat and the figure precesses.
// Pure whole-number R closes; irrational R never does. All client-side, all live.
// ---------------------------------------------------------------------------

const CANVAS = 660; // device pixels of the square paper
const N_POINTS = 9000; // samples along the single unbroken pen path
const BASE_CYCLES = 24; // swings the primary pendulum makes across the whole draw
const SEC = 0.7; // amplitude of the secondary (rotary) pendulum on each axis

type Consonance = 'pure' | 'consonant' | 'soft' | 'tense' | 'dissonant' | 'irrational';

interface Interval {
  key: string;
  name: string;
  label: string; // ratio shown to the reader
  ratio: number;
  num?: number; // for the honest "touches the frame n×m" readout (rational only)
  den?: number;
  consonant: Consonance;
  note: string;
}

const PHI = (1 + Math.sqrt(5)) / 2;

// A ladder from the most agreeable ratio to the least, ending in two irrationals
// that never close. The names are the musical intervals these ratios make.
const INTERVALS: Interval[] = [
  { key: 'unison', name: 'Unison', label: '1 : 1', ratio: 1, num: 1, den: 1, consonant: 'pure', note: 'Both pendulums in lockstep. A single tilted ellipse, the simplest figure there is.' },
  { key: 'octave', name: 'Octave', label: '2 : 1', ratio: 2, num: 2, den: 1, consonant: 'pure', note: 'The sweetest agreement after unison. A clean figure-eight.' },
  { key: 'fifth', name: 'Perfect Fifth', label: '3 : 2', ratio: 3 / 2, num: 3, den: 2, consonant: 'consonant', note: 'The backbone of harmony, the first chord most ears call beautiful. A three-lobed knot.' },
  { key: 'fourth', name: 'Perfect Fourth', label: '4 : 3', ratio: 4 / 3, num: 4, den: 3, consonant: 'consonant', note: 'The perfect fifth turned upside down. Tight and stable.' },
  { key: 'majsixth', name: 'Major Sixth', label: '5 : 3', ratio: 5 / 3, num: 5, den: 3, consonant: 'soft', note: 'Open and warm. The arms start to multiply.' },
  { key: 'majthird', name: 'Major Third', label: '5 : 4', ratio: 5 / 4, num: 5, den: 4, consonant: 'soft', note: 'The bright note in a major chord. A five-pointed weave.' },
  { key: 'minthird', name: 'Minor Third', label: '6 : 5', ratio: 6 / 5, num: 6, den: 5, consonant: 'soft', note: 'The wistful one. Bigger numbers, a denser figure.' },
  { key: 'seventh', name: 'Major Seventh', label: '15 : 8', ratio: 15 / 8, num: 15, den: 8, consonant: 'tense', note: 'Big whole numbers. A restless lattice that, in sound, aches to resolve.' },
  { key: 'tritone', name: 'Tritone', label: '≈ √2 : 1', ratio: Math.SQRT2, consonant: 'dissonant', note: 'The diabolus in musica. So near an irrational that the figure barely ever closes.' },
  { key: 'golden', name: 'Golden Ratio', label: 'φ : 1', ratio: PHI, consonant: 'irrational', note: 'The most irrational number there is. This curve never, ever returns to its start.' },
];

interface Scene {
  key: string;
  name: string;
  interval: string;
  detune: number;
  damp: number;
  phase: number;
}

// One-tap scenes that set every dial at once, so the paper is never boring.
const SCENES: Scene[] = [
  { key: 'drifting-fifth', name: 'Drifting Fifth', interval: 'fifth', detune: 0.006, damp: 0.55, phase: 0.6 },
  { key: 'octave-knot', name: 'Octave Knot', interval: 'octave', detune: 0, damp: 0.85, phase: 0.5 },
  { key: 'the-rose', name: 'The Rose', interval: 'majsixth', detune: 0.004, damp: 0.3, phase: 1.1 },
  { key: 'tight-spiral', name: 'Tight Spiral', interval: 'fourth', detune: 0.0018, damp: 2.4, phase: 0 },
  { key: 'dissonant-storm', name: 'Dissonant Storm', interval: 'golden', detune: 0, damp: 0.18, phase: 0 },
];

const DEFAULT_SCENE = SCENES[0];

// ---------------------------------------------------------------------------
// Cosmic palette along the pen path: teal -> cyan -> violet -> magenta, so the
// ink reads as a single sweep of time from the first swing to the last.
// ---------------------------------------------------------------------------

const STOPS: [number, number, number][] = [
  [45, 212, 191], // teal
  [34, 211, 238], // cyan
  [129, 140, 248], // indigo
  [167, 139, 250], // violet
  [232, 121, 249], // magenta
];

function palette(t: number): string {
  const c = Math.min(0.99999, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.floor(c);
  const f = c - i;
  const a = STOPS[i];
  const b = STOPS[Math.min(STOPS.length - 1, i + 1)];
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return `rgb(${r},${g},${bl})`;
}

// ---------------------------------------------------------------------------
// Compute the full pen path into a reusable Float32 buffer, normalized so the
// figure fills the paper nicely whatever the damping does to its amplitude.
// ---------------------------------------------------------------------------

function computePath(buf: Float32Array, R: number, detune: number, damp: number, phase: number) {
  const TWO_PI = Math.PI * 2;
  const f1 = BASE_CYCLES;
  const f2 = BASE_CYCLES * (1 + detune);
  const f3 = BASE_CYCLES * R;
  const f4 = BASE_CYCLES * R * (1 + detune);
  let maxR = 0.0001;
  for (let i = 0; i < N_POINTS; i++) {
    const u = i / (N_POINTS - 1);
    const env = Math.exp(-damp * u);
    const x = env * (Math.sin(TWO_PI * f1 * u + 1.7) + SEC * Math.sin(TWO_PI * f2 * u + 0.4));
    const y = env * (Math.sin(TWO_PI * f3 * u + phase) + SEC * Math.sin(TWO_PI * f4 * u + 1.1));
    buf[2 * i] = x;
    buf[2 * i + 1] = y;
    const rr = Math.abs(x) > Math.abs(y) ? Math.abs(x) : Math.abs(y);
    if (rr > maxR) maxR = rr;
  }
  // normalize into [-1, 1] using the largest excursion the curve actually reached
  const inv = 1 / maxR;
  for (let i = 0; i < N_POINTS * 2; i++) buf[i] *= inv;
}

// ---------------------------------------------------------------------------
// WIZ verdict, keyed on the interval's consonance, the detune, and the damping.
// ---------------------------------------------------------------------------

interface Verdict {
  label: string;
  line: string;
  tone: 'good' | 'big' | 'warn';
}

function verdictFor(iv: Interval, detune: number, damp: number): Verdict {
  const drift = detune > 0.0008;
  const tail =
    damp > 1.6
      ? ' Heavy damping: the pendulums lose their swing fast, so the figure spirals tightly inward and dies near the center.'
      : damp < 0.12
      ? ' Almost no damping: the swings barely fade, so the figure draws at near-full size the whole way and overlays itself into a solid band.'
      : '';

  if (iv.consonant === 'irrational') {
    return {
      label: `${iv.name}: never closes`,
      tone: 'warn',
      line: `${iv.label} is irrational, so the two pendulums never agree on a common beat and the pen never once returns to where it began. The curve cannot close; it just keeps laying down new line forever, filling the frame. This is the visual signature of true dissonance: no small whole-number ratio underneath, nothing for the ear to lock onto.${tail}`,
    };
  }
  if (iv.consonant === 'dissonant') {
    return {
      label: `${iv.name}: the unstable one`,
      tone: 'warn',
      line: `The tritone sits almost on top of √2, an irrational number, so the figure barely manages to close and the line wanders like it is looking for an exit. Medieval theorists called this interval the diabolus in musica and tried to ban it. You are looking at why: there is no clean ratio holding it together.${tail}`,
    };
  }
  if (drift) {
    return {
      label: `${iv.name}: drifting`,
      tone: 'big',
      line: `${iv.label}, a ${iv.consonant} interval, but the two pendulums are detuned a hair off perfect, so each pass lands a little rotated from the last and the flat closed figure winds itself into a slowly turning rose. This precession is the whole charm of a real harmonograph: no two pendulums are ever tuned exactly, and the tiny mismatch is what turns a static knot into a living one.${tail}`,
    };
  }
  if (iv.consonant === 'pure' || iv.consonant === 'consonant') {
    return {
      label: `${iv.name}: closed and clean`,
      tone: 'good',
      line: `${iv.label} is a small whole-number ratio, so the pendulums fall back into step every few swings and the pen meets its own starting point: a stable, symmetric, closing figure. These are the exact ratios Pythagoras found in vibrating strings, the ones your ear hears as consonant. The harmony you can hear and the figure you can see are the same fact, written twice.${tail}`,
    };
  }
  return {
    label: `${iv.name}: denser, still closing`,
    tone: 'good',
    line: `${iv.label} closes, but the numbers are bigger, so it takes more swings to come back around and the figure carries more arms and crossings. In sound this is a softer, less restful consonance, and you can read that tension straight off the extra tangle on the paper.${tail}`,
  };
}

function Stat({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className="break-all font-mono text-base font-bold tabular-nums text-slate-100">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      {badge && (
        <div className="mt-1 inline-block rounded bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-300">
          {badge}
        </div>
      )}
    </div>
  );
}

export default function Client() {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const [intervalKey, setIntervalKey] = useState(DEFAULT_SCENE.interval);
  const [detune, setDetune] = useState(DEFAULT_SCENE.detune);
  const [damp, setDamp] = useState(DEFAULT_SCENE.damp);
  const [phase, setPhase] = useState(DEFAULT_SCENE.phase);
  const [speed, setSpeed] = useState(3);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);

  const iv = useMemo(
    () => INTERVALS.find((m) => m.key === intervalKey) ?? INTERVALS[0],
    [intervalKey],
  );

  // path + animation state held in refs so the rAF loop never restarts on a re-render
  const pathRef = useRef<Float32Array>(new Float32Array(N_POINTS * 2));
  const headRef = useRef(0);
  const dirtyRef = useRef(true);
  const paramRef = useRef({ R: iv.ratio, detune, damp, phase, speed });

  useEffect(() => {
    paramRef.current = { R: iv.ratio, detune, damp, phase, speed };
    dirtyRef.current = true;
    setDone(false);
  }, [iv.ratio, detune, damp, phase, speed]);

  const drawSegment = useCallback(
    (ctx: CanvasRenderingContext2D, from: number, to: number) => {
      const pts = pathRef.current;
      const c = CANVAS / 2;
      const scale = c * 0.9;
      ctx.lineWidth = 1.15;
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'lighter';
      for (let i = Math.max(1, from); i <= to; i++) {
        const t = i / (N_POINTS - 1);
        ctx.strokeStyle = palette(t);
        ctx.beginPath();
        ctx.moveTo(c + pts[2 * (i - 1)] * scale, c + pts[2 * (i - 1) + 1] * scale);
        ctx.lineTo(c + pts[2 * i] * scale, c + pts[2 * i + 1] * scale);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    },
    [],
  );

  // single animation loop
  useEffect(() => {
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) return;
    const bctx = base.getContext('2d');
    const octx = overlay.getContext('2d');
    if (!bctx || !octx) return;

    let raf = 0;
    const render = () => {
      const p = paramRef.current;

      if (dirtyRef.current) {
        computePath(pathRef.current, p.R, p.detune, p.damp, p.phase);
        bctx.clearRect(0, 0, CANVAS, CANVAS);
        headRef.current = 0;
        dirtyRef.current = false;
      }

      const step = Math.ceil((N_POINTS / 150) * p.speed);
      const head = headRef.current;
      if (head < N_POINTS - 1) {
        const next = Math.min(N_POINTS - 1, head + step);
        drawSegment(bctx, head, next);
        headRef.current = next;

        // glowing pen tip on the overlay
        octx.clearRect(0, 0, CANVAS, CANVAS);
        const pts = pathRef.current;
        const c = CANVAS / 2;
        const scale = c * 0.9;
        const px = c + pts[2 * next] * scale;
        const py = c + pts[2 * next + 1] * scale;
        const g = octx.createRadialGradient(px, py, 0, px, py, 11);
        g.addColorStop(0, 'rgba(232,233,255,0.95)');
        g.addColorStop(0.4, 'rgba(167,139,250,0.55)');
        g.addColorStop(1, 'rgba(167,139,250,0)');
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(px, py, 11, 0, Math.PI * 2);
        octx.fill();

        if (next >= N_POINTS - 1) {
          octx.clearRect(0, 0, CANVAS, CANVAS);
          setDone(true);
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [drawSegment]);

  const redraw = useCallback(() => {
    dirtyRef.current = true;
    setDone(false);
  }, []);

  const drawInstant = useCallback(() => {
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) return;
    const bctx = base.getContext('2d');
    const octx = overlay.getContext('2d');
    if (!bctx || !octx) return;
    const p = paramRef.current;
    computePath(pathRef.current, p.R, p.detune, p.damp, p.phase);
    bctx.clearRect(0, 0, CANVAS, CANVAS);
    octx.clearRect(0, 0, CANVAS, CANVAS);
    drawSegment(bctx, 0, N_POINTS - 1);
    headRef.current = N_POINTS - 1;
    dirtyRef.current = false;
    setDone(true);
  }, [drawSegment]);

  const applyScene = useCallback((scene: Scene) => {
    setIntervalKey(scene.interval);
    setDetune(scene.detune);
    setDamp(scene.damp);
    setPhase(scene.phase);
  }, []);

  const randomize = useCallback(() => {
    const pick = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
    setIntervalKey(pick.key);
    setDetune(Math.round(Math.random() * 90) / 10000); // 0 .. 0.009
    setDamp(Math.round((0.15 + Math.random() * 2.2) * 100) / 100);
    setPhase(Math.round(Math.random() * Math.PI * 100) / 100);
  }, []);

  const verdict = useMemo(() => verdictFor(iv, detune, damp), [iv, detune, damp]);

  const closure = iv.consonant === 'irrational' || iv.consonant === 'dissonant'
    ? 'Never closes'
    : detune > 0.0008
    ? 'Precessing'
    : 'Closed';

  const frameTouch = iv.num && iv.den ? `${iv.num} × ${iv.den}` : 'irrational';

  const onCopy = useCallback(async () => {
    const text =
      iv.consonant === 'irrational' || iv.consonant === 'dissonant'
        ? `I set a harmonograph to a ${iv.name.toLowerCase()} ratio (${iv.label}) and the pen never closes the curve, it just fills the frame forever. That is what dissonance looks like: no small whole-number ratio underneath. The intervals that DO sound sweet draw clean closed figures.\n\nThe Harmonograph, WIZ edition: https://wiz.jock.pl/experiments/harmonograph`
        : `I set a harmonograph to a ${iv.name.toLowerCase()} (${iv.label}) and it drew a clean, closing, symmetric figure. Same small whole-number ratio your ear hears as consonant. Pythagoras found it in strings 2,500 years ago. Harmony you can see.\n\nThe Harmonograph, WIZ edition: https://wiz.jock.pl/experiments/harmonograph`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked, no-op */
    }
  }, [iv]);

  const toneClass =
    verdict.tone === 'warn'
      ? 'border-fuchsia-500/40 bg-fuchsia-950/20'
      : verdict.tone === 'big'
      ? 'border-cyan-500/40 bg-cyan-950/20'
      : 'border-teal-500/40 bg-teal-950/20';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950/25 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Harmonograph
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Two swinging pendulums, one pen, one unbroken line. The ratio of their swings decides
            whether it draws a clean closing knot or a tangle that never ends. The same ratios your
            ear hears as harmony. Watch it draw.
          </p>
        </header>

        {/* The paper */}
        <div className="rounded-lg border border-slate-800 bg-[#05010f] p-2 shadow-2xl shadow-violet-950/40">
          <div className="relative mx-auto" style={{ maxWidth: 560, aspectRatio: '1 / 1' }}>
            <canvas
              ref={baseRef}
              width={CANVAS}
              height={CANVAS}
              className="absolute inset-0 block h-full w-full rounded"
              aria-label="A harmonograph figure drawn by two pendulums."
            />
            <canvas
              ref={overlayRef}
              width={CANVAS}
              height={CANVAS}
              className="pointer-events-none absolute inset-0 block h-full w-full rounded"
            />
          </div>
          <div className="px-1 pb-1 pt-1.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
            one unbroken pen line · color runs from the first swing to the last
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Frequency ratio" value={iv.label} badge={iv.name} />
          <Stat label="Figure" value={closure} />
          <Stat label="Touches the frame" value={frameTouch} />
          <Stat label="Detune" value={detune === 0 ? 'perfect' : `+${(detune * 100).toFixed(2)}%`} />
        </div>

        {/* The intervals, the heart of it */}
        <div className="mt-4 rounded-lg border border-violet-500/30 bg-slate-900/50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300/80">
            The ratio (an interval)
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
            {INTERVALS.map((m) => (
              <button
                key={m.key}
                onClick={() => setIntervalKey(m.key)}
                className={`rounded-md border px-2 py-2 text-left transition ${
                  m.key === intervalKey
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                    : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-mono text-[11px] font-bold tabular-nums">{m.label}</div>
                <div className="text-[10px] leading-tight text-slate-400">{m.name}</div>
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{iv.note}</p>
        </div>

        {/* The three dials */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">Detune</span>
              <span className="font-mono text-xs text-slate-400">{(detune * 100).toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.02}
              step={0.0002}
              value={detune}
              onChange={(e) => setDetune(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
              aria-label="Detune between the pendulums"
            />
            <p className="mt-1 text-[10px] leading-tight text-slate-500">perfect → drifting rose</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">Damping</span>
              <span className="font-mono text-xs text-slate-400">{damp.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3.5}
              step={0.02}
              value={damp}
              onChange={(e) => setDamp(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
              aria-label="Damping of the pendulum swings"
            />
            <p className="mt-1 text-[10px] leading-tight text-slate-500">open band → tight inward spiral</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">Phase</span>
              <span className="font-mono text-xs text-slate-400">{phase.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.PI}
              step={0.01}
              value={phase}
              onChange={(e) => setPhase(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
              aria-label="Phase offset between the pendulums"
            />
            <p className="mt-1 text-[10px] leading-tight text-slate-500">line ↔ loop ↔ figure</p>
          </div>
        </div>

        {/* Scenes + actions */}
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Scenes</div>
          <div className="flex flex-wrap gap-1.5">
            {SCENES.map((s) => (
              <button
                key={s.key}
                onClick={() => applyScene(s)}
                className="rounded-md border border-slate-700 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-violet-400 hover:text-violet-200"
              >
                {s.name}
              </button>
            ))}
            <button
              onClick={randomize}
              className="rounded-md border border-slate-700 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200"
            >
              🎲 Random
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Draw speed</span>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className="flex-1 accent-violet-400"
              aria-label="Draw speed"
            />
            <span className="font-mono text-xs text-slate-400">{speed}×</span>
          </div>
        </div>

        {/* WIZ verdict */}
        <div className={`mt-4 rounded-lg border p-4 ${toneClass}`}>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-base">🎼</span>
            <span className="font-mono text-sm font-bold text-slate-100">{verdict.label}</span>
            {!done && <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">drawing…</span>}
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{verdict.line}</p>
        </div>

        {/* Share + redraw */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-violet-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-violet-400"
          >
            {copied ? '✓ Copied' : 'Copy what your ratio drew'}
          </button>
          <button
            onClick={redraw}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Redraw
          </button>
          <button
            onClick={drawInstant}
            className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Instant
          </button>
        </div>

        {/* The why */}
        <div className="mt-8 space-y-3 text-sm leading-relaxed text-slate-400">
          <p>
            <span className="text-slate-200">Why the sweet intervals draw clean figures.</span> Around 500 BC
            Pythagoras found that two plucked strings sound consonant together when their lengths are in
            small whole-number ratios: 2:1 is an octave, 3:2 a perfect fifth, 4:3 a fourth. A harmonograph
            is that same law drawn in ink. When the two pendulums swing in a small whole-number ratio, they
            keep falling back into step and the pen returns to its own start, closing the figure. When the
            ratio is irrational, like the golden ratio or the near-√2 tritone, they never agree on a common
            beat and the curve never closes. The harmony your ear can hear and the figure your eye can see
            are the same fact.
          </p>
          <p>
            <span className="text-slate-200">The history.</span> Jules Antoine Lissajous traced the pure
            two-frequency version in 1857 by bouncing a light beam off mirrors fixed to two tuning forks. The
            pendulum harmonograph, built on Hugh Blackburn&apos;s 1844 coupled pendulum, became a Victorian
            parlour craze in the 1870s and 80s; the slow fade of its swing (the damping) and the tiny mismatch
            between two never-quite-equal pendulums (the detune) are what turn a flat Lissajous figure into a
            living, spiralling rose. The same whole-number ratios run orbital resonances in the solar system
            and the tuning of a piano.
          </p>
          <p className="text-slate-500">
            Computed live in your browser from the real damped-pendulum equations. Nothing is recorded,
            nothing leaves the page.
          </p>
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
