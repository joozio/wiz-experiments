'use client';

// THE LOGISTIC MAP (deterministic chaos, the bifurcation diagram)
// This lab has a small run of experiments that hand you a rule and let you watch
// what it does on its own. The Game of Life did it with a grid, Collatz with one
// number, the Prime Spiral with the primes, the Golden Angle with one angle on a
// dial, Chladni with one frequency. This one does it with one line of arithmetic
// and one knob: a growth rate r.
//
// The rule. Take a number x between 0 and 1 (a population as a fraction of the most
// the land can hold). Next year's population is r * x * (1 - x): it grows in
// proportion to how many there are (x) and to how much room is left (1 - x). Pick r,
// pick a starting x, iterate. That is the entire model.
//
// WIZ note. The hook is the same one the Golden Angle and Chladni had: one number on
// a dial decides everything. Turn r up slowly. For a while the population just
// settles to a single steady value and holds it. Then at r = 3 it refuses to settle
// and starts flipping between two values; at r = 3.449 between four; then eight,
// sixteen, thirty-two, the splits arriving faster and faster, until at r = 3.56995
// the period becomes infinite and the thing goes chaotic: a deterministic equation
// with no randomness in it anywhere that you can never predict. And folded inside the
// chaos are windows of perfect order, the period-3 island the most famous. Drag r and
// watch the whole map, the fig tree, and the live orbit settle, split, or fly apart.
// Of all the toys in this lab, this is the one that most looks like a population
// model and is most secretly a portrait of chaos itself.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// The map: x -> r * x * (1 - x), x in [0,1], r in [0,4]. Everything client-side.
// ---------------------------------------------------------------------------

const R_MIN = 2.5;
const R_MAX = 4.0;
const DEFAULT_R = 3.7; // open in the chaos so the live orbit is alive on first paint

// bifurcation bitmap resolution
const BW = 760;
const BH = 440;
const BIF_TRANSIENT = 400; // iterations discarded before plotting a column
const BIF_PLOT = 260; // iterations plotted per column

// cobweb plot
const CW = 380; // device pixels (square)
const COB_PAD = 26; // px padding for the [0,1] box

interface Preset {
  r: number;
  name: string;
  note: string;
}

const PRESETS: Preset[] = [
  { r: 2.5, name: 'The Still Pond', note: 'r = 2.5 — one value, forever. A single fixed point.' },
  { r: 3.2, name: 'The Two-Step', note: 'r = 3.2 — period 2: the orbit ticks between two values.' },
  { r: 3.5, name: 'The Four-Beat', note: 'r = 3.5 — period 4: two values have each split in two.' },
  { r: 3.558, name: 'The Eight', note: 'r = 3.558 — period 8, deep in the doubling cascade.' },
  { r: 3.56995, name: 'The Onset', note: "r = 3.56995 — Feigenbaum's point. Chaos begins exactly here." },
  { r: 3.7, name: 'The Storm', note: 'r = 3.7 — full chaos. No randomness, no predictability.' },
  { r: 3.83, name: 'The Island', note: 'r = 3.83 — a period-3 window: pure order inside the chaos.' },
  { r: 4.0, name: 'Total Chaos', note: 'r = 4.0 — the orbit fills the whole interval.' },
];

// ---------------------------------------------------------------------------
// Analysis of the attractor at a given r: period, Lyapunov exponent, and a
// sensitive-dependence ("twins") probe. This is the honest, rigorous read.
// ---------------------------------------------------------------------------

type Regime = 'fixed' | 'doubling' | 'edge' | 'window' | 'chaos';

interface Analysis {
  regime: Regime;
  periodNum: number; // 0 = chaos/infinite
  periodLabel: string; // "∞", "1", "2", ...
  lyap: number; // Lyapunov exponent (per step, natural log)
  twinSplit: number | null; // step at which two orbits 1e-9 apart first split, or null
  tail: number[]; // a sample of attractor values for the diagram overlay
}

function analyze(r: number): Analysis {
  // burn the transient
  let x = 0.5;
  for (let i = 0; i < 900; i++) x = r * x * (1 - x);

  // collect the orbit on the attractor + accumulate the Lyapunov exponent
  const N = 700;
  const vals = new Array<number>(N);
  let lyap = 0;
  for (let i = 0; i < N; i++) {
    x = r * x * (1 - x);
    vals[i] = x;
    const slope = Math.abs(r * (1 - 2 * x));
    lyap += Math.log(slope > 1e-12 ? slope : 1e-12);
  }
  lyap /= N;

  // period by clustering the tail of the orbit
  const eps = 2.5e-3;
  const clusters: number[] = [];
  for (let i = N - 300; i < N; i++) {
    const v = vals[i];
    let found = false;
    for (let c = 0; c < clusters.length; c++) {
      if (Math.abs(clusters[c] - v) < eps) {
        found = true;
        break;
      }
    }
    if (!found) clusters.push(v);
    if (clusters.length > 90) break;
  }

  // sensitive dependence: two orbits a billionth apart, when do they split?
  let a = 0.5;
  let b = 0.5 + 1e-9;
  let twinSplit: number | null = null;
  for (let i = 1; i <= 300; i++) {
    a = r * a * (1 - a);
    b = r * b * (1 - b);
    if (twinSplit === null && Math.abs(a - b) > 0.1) {
      twinSplit = i;
      break;
    }
  }

  // classify
  let regime: Regime;
  let periodNum: number;
  const chaotic = lyap > 0.004;
  if (chaotic) {
    regime = 'chaos';
    periodNum = 0;
  } else {
    periodNum = clusters.length;
    if (periodNum <= 1) regime = 'fixed';
    else if (periodNum === 2 || periodNum === 4 || periodNum === 8 || periodNum === 16 || periodNum === 32) {
      regime = 'doubling';
    } else if (periodNum >= 3 && periodNum <= 12) {
      // small odd/other period with a negative exponent = a window of order in the sea of chaos
      regime = 'window';
    } else {
      regime = 'edge';
    }
  }

  // a thinned-out sample of the attractor for the marker overlay
  const tail: number[] = [];
  for (let i = N - 280; i < N; i += 2) tail.push(vals[i]);

  const periodLabel = regime === 'chaos' ? '∞' : regime === 'edge' ? '→∞' : String(periodNum);

  return { regime, periodNum, periodLabel, lyap, twinSplit, tail };
}

// ---------------------------------------------------------------------------
// WIZ verdict, adapting to the regime the dial is sitting in.
// ---------------------------------------------------------------------------

interface Verdict {
  label: string;
  line: string;
  tone: 'order' | 'edge' | 'chaos';
}

function verdictFor(r: number, a: Analysis): Verdict {
  const rr = r.toFixed(4);
  if (a.regime === 'fixed') {
    return {
      label: 'Fixed point',
      tone: 'order',
      line: `Calm. At r = ${rr} the population walks to one number and stays there forever, no matter where you start it. The orbit you see settling in the cobweb spirals straight into the single crossing point and sits. This is what most of the low end of the dial looks like: a steady level, perfectly predictable, almost boring. Turn r up past 3 and watch this one value refuse to hold and split in two.`,
    };
  }
  if (a.regime === 'doubling') {
    return {
      label: `Period ${a.periodNum}`,
      tone: 'order',
      line: `It cannot sit still. At r = ${rr} the orbit has split into ${a.periodNum} values and now cycles through them in perfect lockstep, year after year, never resting and never surprising you. Still completely predictable, just no longer at rest. The Lyapunov exponent is negative (${a.lyap.toFixed(3)}), which is the math saying nearby orbits still pull together. Push r a little higher and each of these ${a.periodNum} values will split in two again, faster than the last time.`,
    };
  }
  if (a.regime === 'edge') {
    return {
      label: 'The edge of chaos',
      tone: 'edge',
      line: `You are right on the brink. At r = ${rr} the period-doublings are arriving faster than you can count, 2, 4, 8, 16, 32, each window of r shorter than the last by the same universal factor (Feigenbaum's 4.6692). Order is running out of road, the exponent has climbed to almost exactly zero (${a.lyap.toFixed(3)}), and a hair more r tips the whole thing into chaos. This razor edge, the accumulation point, sits at r ≈ 3.56995.`,
    };
  }
  if (a.regime === 'window') {
    return {
      label: `An island of order — period ${a.periodNum}`,
      tone: 'order',
      line: `Look where you are. At r = ${rr} you are surrounded on both shores by chaos, and yet the orbit has locked into a clean ${a.periodNum}-cycle, pure order sitting in the middle of the storm. The exponent went negative again (${a.lyap.toFixed(3)}). Nudge r a few thousandths either way and this island sinks back into chaos. Li and Yorke proved in 1975 that once a map has a 3-cycle anywhere, every other period is hiding in it too, which is why they titled the paper "Period Three Implies Chaos."`,
    };
  }
  // chaos
  const twin =
    a.twinSplit !== null
      ? `The two orbits I started a billionth apart have already flown to opposite ends of the interval after just ${a.twinSplit} steps.`
      : `Two orbits a billionth apart are tearing away from each other as fast as the arithmetic allows.`;
  return {
    label: 'Chaos',
    tone: 'chaos',
    line: `Determined and unpredictable at the same time. At r = ${rr} there is no randomness in this equation, not one coin flip, and yet you could never guess the next value. ${twin} The Lyapunov exponent is positive (${a.lyap.toFixed(3)}), and a positive exponent is the definition of chaos: any error in the starting value, however tiny, doubles and doubles until it swamps everything. Same rule, same parabola as the calm settings. This is what deterministic chaos looks like.`,
  };
}

// ---------------------------------------------------------------------------

export default function Client() {
  const bifCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cobCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // the cached fig-tree bitmap (computed once)
  const bifBitmapRef = useRef<HTMLCanvasElement | null>(null);

  // refs the cobweb loop reads (kept out of state so the loop never restarts)
  const rRef = useRef<number>(DEFAULT_R);
  const cobXRef = useRef<number>(0.5);
  const sweepRef = useRef<boolean>(false);
  const resetRef = useRef<boolean>(true);

  // state mirrors for the UI
  const [r, setR] = useState<number>(DEFAULT_R);
  const [rInput, setRInput] = useState<string>(DEFAULT_R.toFixed(4));
  const [sweeping, setSweeping] = useState<boolean>(false);
  const [bifReady, setBifReady] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const analysis = useMemo(() => analyze(r), [r]);
  const verdict = useMemo(() => verdictFor(r, analysis), [r, analysis]);

  // ---- build the bifurcation bitmap once ----------------------------------
  useEffect(() => {
    const off = document.createElement('canvas');
    off.width = BW;
    off.height = BH;
    const octx = off.getContext('2d');
    if (!octx) return;

    const counts = new Float32Array(BW * BH);
    for (let px = 0; px < BW; px++) {
      const rr = R_MIN + (px / (BW - 1)) * (R_MAX - R_MIN);
      let x = 0.5;
      for (let i = 0; i < BIF_TRANSIENT; i++) x = rr * x * (1 - x);
      for (let i = 0; i < BIF_PLOT; i++) {
        x = rr * x * (1 - x);
        let py = Math.floor((1 - x) * (BH - 1));
        if (py < 0) py = 0;
        else if (py >= BH) py = BH - 1;
        counts[py * BW + px] += 1;
      }
    }

    const img = octx.createImageData(BW, BH);
    const data = img.data;
    for (let i = 0; i < BW * BH; i++) {
      const c = counts[i];
      const p = i * 4;
      if (c <= 0) {
        // background
        data[p] = 5;
        data[p + 1] = 1;
        data[p + 2] = 15;
        data[p + 3] = 255;
      } else {
        const b = Math.min(1, Math.sqrt(c / 42)); // brightness 0..1
        data[p] = Math.round(20 + b * 165); // teal -> pale cyan
        data[p + 1] = Math.round(70 + b * 185);
        data[p + 2] = Math.round(80 + b * 165);
        data[p + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    bifBitmapRef.current = off;
    setBifReady(true);
  }, []);

  // ---- (re)draw the visible bifurcation canvas: bitmap + marker -----------
  useEffect(() => {
    const canvas = bifCanvasRef.current;
    const bmp = bifBitmapRef.current;
    if (!canvas || !bmp || !bifReady) return;
    canvas.width = BW;
    canvas.height = BH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(bmp, 0, 0);

    const px = ((r - R_MIN) / (R_MAX - R_MIN)) * (BW - 1);

    // the slice of the attractor the dial is lighting up
    ctx.fillStyle = 'rgba(103,232,249,0.55)';
    for (const v of analysis.tail) {
      const py = (1 - v) * (BH - 1);
      ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
    }

    // the vertical r-marker
    ctx.strokeStyle = 'rgba(103,232,249,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, BH);
    ctx.stroke();

    // a faint mark at the chaos onset (r = 3.56995)
    const onsetPx = ((3.56995 - R_MIN) / (R_MAX - R_MIN)) * (BW - 1);
    ctx.strokeStyle = 'rgba(251,191,36,0.30)';
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(onsetPx, 0);
    ctx.lineTo(onsetPx, BH);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [r, analysis, bifReady]);

  // ---- the live cobweb plot: one rAF loop for the page lifetime -----------
  useEffect(() => {
    const canvas = cobCanvasRef.current;
    if (!canvas) return;
    canvas.width = CW;
    canvas.height = CW;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const plot = CW - COB_PAD * 2;
    const toPx = (v: number) => COB_PAD + v * plot;
    const toPy = (v: number) => COB_PAD + (1 - v) * plot;

    const drawStatic = (rr: number) => {
      // box
      ctx.strokeStyle = 'rgba(148,163,184,0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(COB_PAD, COB_PAD, plot, plot);
      // diagonal y = x
      ctx.strokeStyle = 'rgba(148,163,184,0.35)';
      ctx.beginPath();
      ctx.moveTo(toPx(0), toPy(0));
      ctx.lineTo(toPx(1), toPy(1));
      ctx.stroke();
      // the parabola f(x) = r x (1 - x)
      ctx.strokeStyle = 'rgba(45,212,191,0.95)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const xx = i / 120;
        const yy = rr * xx * (1 - xx);
        if (i === 0) ctx.moveTo(toPx(xx), toPy(yy));
        else ctx.lineTo(toPx(xx), toPy(yy));
      }
      ctx.stroke();
      // corner labels
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.font = '10px monospace';
      ctx.fillText('0', COB_PAD - 8, toPy(0) + 12);
      ctx.fillText('1', COB_PAD - 8, toPy(1) - 4);
    };

    let raf = 0;
    let frame = 0;

    const step = () => {
      const rr = rRef.current;

      if (resetRef.current) {
        ctx.fillStyle = '#05010f';
        ctx.fillRect(0, 0, CW, CW);
        cobXRef.current = 0.5;
        resetRef.current = false;
      } else {
        // fade veil dims the old cobweb trail, static layer redrawn crisp on top
        ctx.fillStyle = 'rgba(5,1,15,0.10)';
        ctx.fillRect(0, 0, CW, CW);
      }

      drawStatic(rr);

      // step the cobweb forward every other frame so the eye can follow it
      frame++;
      if (frame % 2 === 0) {
        const x = cobXRef.current;
        const y = rr * x * (1 - x);
        ctx.strokeStyle = 'rgba(103,232,249,0.9)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        // vertical: from the diagonal (x,x) to the curve (x, f(x))
        ctx.moveTo(toPx(x), toPy(x));
        ctx.lineTo(toPx(x), toPy(y));
        // horizontal: from the curve (x, f(x)) to the diagonal (f(x), f(x))
        ctx.lineTo(toPx(y), toPy(y));
        ctx.stroke();
        // the current point, bright
        ctx.fillStyle = '#a5f3fc';
        ctx.beginPath();
        ctx.arc(toPx(y), toPy(y), 2.2, 0, Math.PI * 2);
        ctx.fill();
        cobXRef.current = y;
      }

      // sweep the dial slowly up the band, wrapping at the top
      if (sweepRef.current) {
        let f = rRef.current + 0.0009;
        if (f > R_MAX) f = R_MIN;
        rRef.current = f;
        if (frame % 8 === 0) {
          const rounded = Math.round(f * 10000) / 10000;
          setR(rounded);
          setRInput(rounded.toFixed(4));
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---- controls -----------------------------------------------------------
  const applyR = useCallback((next: number) => {
    let clamped = Math.min(R_MAX, Math.max(R_MIN, next));
    clamped = Math.round(clamped * 10000) / 10000;
    rRef.current = clamped;
    setR(clamped);
    setRInput(clamped.toFixed(4));
  }, []);

  const jumpTo = useCallback(
    (preset: Preset) => {
      resetRef.current = true; // restart the orbit so you watch it settle
      applyR(preset.r);
    },
    [applyR],
  );

  const reDrop = useCallback(() => {
    resetRef.current = true;
  }, []);

  const toggleSweep = useCallback(() => {
    setSweeping((s) => {
      const next = !s;
      sweepRef.current = next;
      return next;
    });
  }, []);

  const commitInput = () => {
    const v = parseFloat(rInput.replace(/[^\d.]/g, ''));
    if (Number.isFinite(v)) applyR(v);
    else setRInput(r.toFixed(4));
  };

  // click / drag on the fig tree to set r
  const onBifPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.buttons === 0 && e.type === 'pointermove') return;
      const canvas = bifCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const frac = (e.clientX - rect.left) / rect.width;
      applyR(R_MIN + frac * (R_MAX - R_MIN));
    },
    [applyR],
  );

  const onCopy = useCallback(async () => {
    let what: string;
    if (analysis.regime === 'chaos') {
      what = `I set one knob on a one-line population equation to r = ${r.toFixed(4)} and it went fully chaotic: no randomness anywhere in the math, and yet two orbits I started a billionth apart flew apart in ${analysis.twinSplit ?? 'a few'} steps. Deterministic and unpredictable at once.`;
    } else if (analysis.regime === 'window') {
      what = `I found an island of pure order (a period-${analysis.periodNum} cycle) sitting in the middle of the chaos in the logistic map, at r = ${r.toFixed(4)}. Nudge the dial a hair and it sinks back into chaos.`;
    } else if (analysis.regime === 'fixed') {
      what = `At r = ${r.toFixed(4)} the logistic map is calm: one steady value, forever. Turn the dial up and watch it split in two, then four, then break into chaos.`;
    } else {
      what = `At r = ${r.toFixed(4)} the logistic map is locked in a period-${analysis.periodNum} cycle. One number on a dial decides whether you get order or chaos.`;
    }
    const text = `${what}\n\nThe Logistic Map, WIZ edition: https://wiz.jock.pl/experiments/logistic-map`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [r, analysis]);

  const toneClass =
    verdict.tone === 'order'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'chaos'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  const nearestPreset = PRESETS.reduce((best, p) =>
    Math.abs(p.r - r) < Math.abs(best.r - r) ? p : best,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-teal-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-teal-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Logistic Map
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            One line of arithmetic, one knob. Turn it up and a steady number splits into two, then four,
            then breaks into chaos you can never predict. No randomness anywhere. Find the edge.
          </p>
        </header>

        {/* The fig tree */}
        <div className="rounded-lg border border-slate-800 bg-[#05010f] p-2 shadow-2xl shadow-teal-950/40">
          <canvas
            ref={bifCanvasRef}
            onPointerDown={onBifPointer}
            onPointerMove={onBifPointer}
            className="block w-full cursor-crosshair rounded touch-none"
            style={{ aspectRatio: `${BW} / ${BH}` }}
            aria-label="The bifurcation diagram of the logistic map: a single line that splits into two, four, eight branches and dissolves into chaos as r increases."
          />
          <div className="flex items-center justify-between px-1 pb-1 pt-1.5 font-mono text-[10px] text-slate-600">
            <span>r = {R_MIN.toFixed(1)}</span>
            <span className="text-slate-500">↑ where the orbit lives · click or drag to set r ↑</span>
            <span>r = {R_MAX.toFixed(1)}</span>
          </div>
        </div>

        {/* The one knob */}
        <div className="mt-4 rounded-lg border border-teal-500/30 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">
              Growth rate r
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-500">r =</span>
              <input
                type="text"
                inputMode="decimal"
                value={rInput}
                onChange={(e) => setRInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitInput();
                }}
                onBlur={commitInput}
                className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-base tabular-nums text-slate-100 outline-none transition focus:border-teal-400"
                aria-label="Growth rate r"
              />
            </div>
          </div>
          <input
            type="range"
            min={R_MIN}
            max={R_MAX}
            step={0.0001}
            value={r}
            onChange={(e) => applyR(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-teal-400"
            aria-label="Growth rate slider"
          />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {[-0.1, -0.01, -0.001].map((d) => (
              <button
                key={d}
                onClick={() => applyR(r + d)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                {d}
              </button>
            ))}
            {[0.001, 0.01, 0.1].map((d) => (
              <button
                key={d}
                onClick={() => applyR(r + d)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                +{d}
              </button>
            ))}
            <button
              onClick={toggleSweep}
              className={`rounded-md border px-3 py-1 font-mono text-xs transition ${
                sweeping
                  ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              {sweeping ? '❚❚ stop sweep' : '▶ sweep'}
            </button>
          </div>
        </div>

        {/* The live orbit (cobweb) */}
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto,1fr] sm:items-start">
          <div className="rounded-lg border border-slate-800 bg-[#05010f] p-2">
            <canvas
              ref={cobCanvasRef}
              className="mx-auto block rounded"
              style={{ width: 300, height: 300, maxWidth: '100%' }}
              aria-label="A cobweb plot showing the orbit of the logistic map iterating live: spiralling into a point, looping in a cycle, or filling the box chaotically."
            />
            <div className="px-1 pb-0.5 pt-1.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
              the orbit, iterating live · teal = the rule · cyan = where it goes next
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <Stat label="Growth rate r" value={r.toFixed(4)} />
              <Stat
                label="Period"
                value={analysis.periodLabel}
                accent={analysis.regime === 'chaos' ? 'amber' : analysis.regime === 'window' ? 'teal' : undefined}
              />
              <Stat label="Lyapunov λ" value={analysis.lyap.toFixed(3)} />
              <Stat
                label="Twin orbits"
                value={analysis.twinSplit !== null ? `split @ ${analysis.twinSplit}` : 'merged'}
              />
            </div>
            <button
              onClick={reDrop}
              className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              ↻ Re-drop the orbit
            </button>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Nearest landmark: <span className="text-slate-300">{nearestPreset.name}</span>. A negative λ
              means orbits pull together (order); a positive λ means they fly apart (chaos).
            </p>
          </div>
        </div>

        {/* WIZ verdict */}
        <div className={`mt-4 rounded-lg border p-4 text-sm transition-colors ${toneClass}`}>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
            {verdict.label}
          </div>
          <p className="leading-relaxed">{verdict.line}</p>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or jump to a landmark on the dial
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => jumpTo(p)}
                title={p.note}
                className="group flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-center transition hover:border-teal-400/60 hover:bg-slate-800"
              >
                <span className="text-sm font-semibold text-teal-200 group-hover:text-teal-100">
                  {p.name.replace(/^The /, '')}
                </span>
                <span className="font-mono text-[10px] text-slate-500">r = {p.r}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Tip: hit ▶ sweep and watch the live orbit settle, split, split again, and shatter as the dial
            climbs. Or click straight onto the fig tree above to land anywhere.
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
              <p>
                Picture a population as a fraction <em>x</em> of the most the land can hold, somewhere between
                0 (extinct) and 1 (packed full). Next year&apos;s population is:
              </p>
              <p className="rounded-md border border-slate-800 bg-slate-950/60 px-4 py-3 text-center font-mono text-teal-200">
                x<sub>next</sub> = r · x · (1 − x)
              </p>
              <ul className="ml-1 space-y-1.5">
                <li>
                  <span className="text-teal-300">it grows</span> in proportion to how many there are (the
                  x), so more breeders means more births.
                </li>
                <li>
                  <span className="text-amber-300">it is held back</span> in proportion to how little room is
                  left (the 1 − x), so a crowded land starves the next generation.
                </li>
              </ul>
              <p className="text-slate-400">
                That is the whole model. The single knob <em>r</em> is the growth rate, how fast it breeds
                when there is room. Pick r, pick a starting x, and iterate. The parabola you see in the
                cobweb plot <span className="text-slate-200">is</span> r · x · (1 − x); the orbit bounces
                between that curve and the diagonal line, and where it ends up, one value, a few, or none,
                is decided entirely by r. No image is loaded and no randomness is added: you are watching the
                real attractor of a real equation.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-teal-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            What gets me about this is that there is no randomness anywhere in it. One line of arithmetic, no
            coin flips, no noise, and below r = 3.5699 it is the tamest thing in the world: it settles to a
            number, or ticks politely between a few. Then you nudge the dial a thousandth past the edge and it
            becomes genuinely unpredictable. Not because we are missing information. Because any error in the
            starting value, even in the fifteenth decimal place, doubles every few steps until it is the size
            of the answer.{' '}
            <span className="text-slate-100">That is the positive Lyapunov exponent, and it is exactly the
            number the &quot;twin orbits&quot; readout is measuring.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The route in is the strangest part. The splittings, 2, 4, 8, 16, come faster and faster, and the
            ratio of one window&apos;s width to the next converges to a single number, Feigenbaum&apos;s
            constant 4.6692016. The shock is that the <em>same</em> number shows up in a dripping faucet, a
            fibrillating heart, a column of convecting fluid, and an electronic oscillator, systems that share
            nothing with populations. The road to chaos has universal constants, the way circles have π.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            And chaos is not the opposite of order. Drag into the chaotic band and find the period-3 island:
            clean, perfect order sitting in the middle of the storm. Zoom into the fig tree near it and you
            would find a smaller copy of the whole tree, windows of order inside chaos inside order, all the
            way down.{' '}
            <span className="text-slate-100">Determinism never promised predictability. This little equation
            is where mathematics learned the difference.</span>
          </p>
        </div>

        {/* History */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Pierre-François Verhulst wrote the logistic equation down around 1838 to model how a population
            grows when resources run out. For over a century it was a quiet curve in an ecology textbook. Then
            in 1976 the biologist Robert May published a short paper in Nature, &quot;Simple mathematical
            models with very complicated dynamics,&quot; showing that this innocent population toy goes wildly
            chaotic for large r, a warning to every ecologist that a simple model can behave unpredictably and
            a founding document of chaos theory. Around the same time, working at Los Alamos with a pocket HP
            calculator, Mitchell Feigenbaum noticed the period-doublings converged at a fixed rate, 4.6692016,
            and that the same constant governed a whole family of unrelated maps, the discovery that chaos has
            universal numbers. Tien-Yien Li and James Yorke gave the field its name in 1975 with the paper
            &quot;Period Three Implies Chaos,&quot; building on Oleksandr Sharkovskii&apos;s 1964 ordering of
            the periods, and Edward Lorenz had already, in 1963, found the sensitive dependence on initial
            conditions that the world would come to call the butterfly effect. A line of arithmetic from a
            nineteenth-century ecology book that turned out to be one of the cleanest doors into chaos we have.
          </p>
        </div>

        {/* Share + back */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            {copied ? '✓ Copied' : 'Copy what your dial did'}
          </button>
          <button
            onClick={() => jumpTo(PRESETS[5])}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Back to The Storm
          </button>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <a
            href="/experiments"
            className="text-sm text-slate-400 underline-offset-4 hover:text-teal-300 hover:underline"
          >
            ← back to all experiments
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: 'amber' | 'teal' }) {
  const valueClass =
    accent === 'amber' ? 'text-amber-300' : accent === 'teal' ? 'text-teal-300' : 'text-slate-100';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className={`break-all font-mono text-base font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
