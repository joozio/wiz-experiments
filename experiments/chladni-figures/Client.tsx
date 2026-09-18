'use client';

// CHLADNI FIGURES (cymatics, the shape of a standing wave)
// This lab has a small run of experiments that hand you a rule and let you watch
// what it does on its own. The Game of Life did it with a grid, Collatz with one
// number, the Prime Spiral with the primes, the Golden Angle with one angle on a
// dial. This one does it with a vibrating plate and one number: a frequency.
//
// The rule. Scatter fine sand on a square metal plate and shake it. At almost any
// frequency the plate flexes in a messy, lopsided way and the sand just buzzes
// around. But every plate has a set of special frequencies where it flexes into a
// clean standing wave: some lines on the plate barely move at all (the nodes) while
// the regions between them slam up and down (the antinodes). Sand bounced by an
// antinode skitters away from it and comes to rest on the nearest still line. Do
// this for a second or two and the grains abandon the whole shaking surface and
// pile up along the nodal lines, tracing the standing wave as a figure you can see.
//
// WIZ note. The hook here is the same one the Golden Angle had: a single number on
// a dial decides whether you get noise or geometry, and the targets are narrow.
// Slide the frequency through the dead zone between two resonances and the sand
// will not settle, no matter how long you wait. Hit a resonance dead on and a
// mandala you never drew assembles itself in front of you. I model the plate with
// the classic square-plate superposition that Chladni's own figures obey, so the
// patterns are not canned pictures, they are the real nodal lines of a standing
// wave, and the sand finds them the same way real sand does: by being shaken off
// everywhere it cannot rest. Of all the toys in this lab, this is the one that most
// looks like magic and is most completely just physics.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// The plate. A square Chladni plate driven at the center flexes into a
// superposition of two pure modes, and the nodal lines (where the sand collects)
// are the zero set of:
//     s(x,y) = cos(n*pi*x)*cos(m*pi*y) - cos(m*pi*x)*cos(n*pi*y),   x,y in [0,1]
// Different integer mode pairs (n,m) give the different figures. |s| runs 0..2;
// it is ~0 along the nodal lines and ~2 at the antinodes. Everything client-side.
// ---------------------------------------------------------------------------

const CANVAS = 640; // device pixels of the square plate
const FW = 200; // resolution of the cached antinode-glow bitmap
const FREQ_MIN = 80;
const FREQ_MAX = 1400;
const SIGMA = 15; // Hz: how close to a resonance the plate has to be to ring
const MINWALK = 0.25; // px a resting grain still jitters
const WALK = 3.2; // px extra jitter at a full antinode
const PULL = 2.3; // px gradient pull into a nodal valley (only when ringing)

interface Mode {
  n: number;
  m: number;
  freq: number;
  name: string;
  note: string;
}

// A curated ladder of square-plate modes, ordered by frequency. The frequencies
// are illustrative (a real plate's depend on its size, thickness and metal), but
// the figures each (n,m) draws are exactly what the math above produces.
const MODES: Mode[] = [
  { n: 1, m: 2, freq: 122, name: 'The Saddle', note: 'One sweeping curve splits the plate in two.' },
  { n: 1, m: 3, freq: 174, name: 'The Bars', note: 'A few broad bands, the simplest standing wave.' },
  { n: 2, m: 3, freq: 220, name: 'The Cross', note: 'The figure Chladni drew first: a clean cross.' },
  { n: 1, m: 4, freq: 268, name: 'The Ribs', note: 'Parallel ribs with a diagonal seam.' },
  { n: 2, m: 4, freq: 312, name: 'The Grid', note: 'A fourfold grid of still squares.' },
  { n: 3, m: 4, freq: 386, name: 'The Star', note: 'Curved arms meet in a central star.' },
  { n: 1, m: 5, freq: 432, name: 'The Comb', note: 'A fine comb of nearly straight lines.' },
  { n: 2, m: 5, freq: 498, name: 'The Weave', note: 'Two scales of line cross into a weave.' },
  { n: 3, m: 5, freq: 560, name: 'The Flower', note: 'Petals open around the center.' },
  { n: 4, m: 5, freq: 642, name: 'The Mandala', note: 'Dense interlocking rings, almost circular.' },
  { n: 2, m: 6, freq: 712, name: 'The Lattice', note: 'A regular lattice of small cells.' },
  { n: 3, m: 6, freq: 780, name: 'The Rose Window', note: 'Radiating panels like stained glass.' },
  { n: 4, m: 6, freq: 856, name: 'The Tapestry', note: 'A woven field of fine nodal thread.' },
  { n: 5, m: 6, freq: 940, name: 'The Cathedral', note: 'Tall vaulted arches across the plate.' },
  { n: 3, m: 7, freq: 1020, name: 'The Snowflake', note: 'Sixfold-looking arms and tips.' },
  { n: 5, m: 7, freq: 1140, name: 'The Filigree', note: 'Intricate lacework, hard to hold steady.' },
  { n: 6, m: 7, freq: 1240, name: 'The Labyrinth', note: 'A maze of nodal corridors.' },
  { n: 5, m: 8, freq: 1360, name: 'The Constellation', note: 'A scatter of fine still points.' },
];

// presets worth jumping straight to
const PRESETS = ['The Cross', 'The Grid', 'The Star', 'The Flower', 'The Mandala', 'The Rose Window', 'The Cathedral', 'The Snowflake'];

const DEFAULT_FREQ = 386; // open on The Star so the plate is never blank

function fieldAt(x: number, y: number, n: number, m: number): number {
  // |s(x,y)| in [0,2]
  const pn = Math.PI * n;
  const pm = Math.PI * m;
  const s = Math.cos(pn * x) * Math.cos(pm * y) - Math.cos(pm * x) * Math.cos(pn * y);
  return s < 0 ? -s : s;
}

function nearestMode(freq: number): { mode: Mode; dist: number; r: number } {
  let best = MODES[0];
  let bestD = Math.abs(freq - MODES[0].freq);
  for (let i = 1; i < MODES.length; i++) {
    const d = Math.abs(freq - MODES[i].freq);
    if (d < bestD) {
      bestD = d;
      best = MODES[i];
    }
  }
  const r = Math.exp(-((bestD / SIGMA) * (bestD / SIGMA))); // resonance strength 0..1
  return { mode: best, dist: bestD, r };
}

// ---------------------------------------------------------------------------
// WIZ verdict, adapting to whether the plate is ringing.
// ---------------------------------------------------------------------------

interface Verdict {
  label: string;
  line: string;
  tone: 'good' | 'big' | 'warn';
}

function verdictFor(freq: number, mode: Mode, r: number): Verdict {
  if (r > 0.82) {
    return {
      label: `Ringing — ${mode.name}`,
      tone: 'big',
      line: `${Math.round(freq)} Hz is a resonance. The plate has locked into a clean standing wave, mode ${mode.n}×${mode.m}, and the sand has fled the parts that shake and piled up along the still lines into ${mode.name.toLowerCase()}. Nobody drew this. The grains found the nodal lines on their own, the same way real sand does, by being unable to rest anywhere they were still being thrown. Slide a few hertz either way and watch this whole figure dissolve.`,
    };
  }
  if (r > 0.38) {
    const dir = freq < mode.freq ? 'up' : 'down';
    return {
      label: 'Almost ringing',
      tone: 'good',
      line: `Close. You are near ${mode.freq} Hz, where the plate wants to settle into ${mode.name.toLowerCase()} (mode ${mode.n}×${mode.m}), but you are off the exact resonance, so the wave is lopsided and the lines come out smeared and restless. Ease the dial ${dir} toward ${mode.freq} Hz and the figure will snap into focus.`,
    };
  }
  return {
    label: 'Between notes',
    tone: 'warn',
    line: `${Math.round(freq)} Hz is a dead zone. The plate is buzzing but not resonating, so there are no clean still lines for the sand to gather on, and it just scatters and stays scattered no matter how long you wait. This is the honest part most pictures of Chladni plates hide: almost every frequency does nothing. The nearest one that rings is ${mode.freq} Hz. Hunt for it.`,
  };
}

// ---------------------------------------------------------------------------

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // refs the animation loop reads (kept out of state to avoid restarting it)
  const freqRef = useRef<number>(DEFAULT_FREQ);
  const xsRef = useRef<Float32Array>(new Float32Array(0));
  const ysRef = useRef<Float32Array>(new Float32Array(0));
  const countRef = useRef<number>(9000);
  const fieldCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldModeRef = useRef<string>(''); // which (n,m) the glow bitmap holds
  const sweepRef = useRef<boolean>(false);

  // state mirrors for the UI
  const [freq, setFreq] = useState<number>(DEFAULT_FREQ);
  const [freqInput, setFreqInput] = useState<string>(String(DEFAULT_FREQ));
  const [grains, setGrains] = useState<number>(9000);
  const [sweeping, setSweeping] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const { mode, r } = useMemo(() => nearestMode(freq), [freq]);
  const verdict = useMemo(() => verdictFor(freq, mode, r), [freq, mode, r]);

  // (re)scatter the sand uniformly across the plate
  const resprinkle = useCallback(() => {
    const n = countRef.current;
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      xs[i] = Math.random() * CANVAS;
      ys[i] = Math.random() * CANVAS;
    }
    xsRef.current = xs;
    ysRef.current = ys;
  }, []);

  // render the faint teal antinode glow for a given mode into the cached bitmap
  const renderField = useCallback((n: number, m: number) => {
    let fc = fieldCanvasRef.current;
    if (!fc) {
      fc = document.createElement('canvas');
      fc.width = FW;
      fc.height = FW;
      fieldCanvasRef.current = fc;
    }
    const fctx = fc.getContext('2d');
    if (!fctx) return;
    const img = fctx.createImageData(FW, FW);
    const data = img.data;
    let p = 0;
    for (let j = 0; j < FW; j++) {
      const y = (j + 0.5) / FW;
      for (let i = 0; i < FW; i++) {
        const x = (i + 0.5) / FW;
        const v = fieldAt(x, y, n, m) / 2; // 0..1
        const glow = Math.pow(v, 1.6);
        data[p] = 45; // teal r
        data[p + 1] = 212; // g
        data[p + 2] = 191; // b
        data[p + 3] = Math.floor(190 * glow); // alpha
        p += 4;
      }
    }
    fctx.putImageData(img, 0, 0);
    fieldModeRef.current = `${n}x${m}`;
  }, []);

  // first scatter + grain-count changes
  useEffect(() => {
    countRef.current = grains;
    resprinkle();
  }, [grains, resprinkle]);

  // the live driver: one rAF loop for the whole lifetime of the page
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS;
    canvas.height = CANVAS;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let frame = 0;
    const eps = 1.6 / CANVAS;

    const step = () => {
      // sweep the dial upward through the whole band, wrapping at the top
      if (sweepRef.current) {
        let f = freqRef.current + 1.3;
        if (f > FREQ_MAX) f = FREQ_MIN;
        freqRef.current = f;
      }

      const f = freqRef.current;
      const { mode: md, r: rr } = nearestMode(f);
      const { n, m } = md;

      if (fieldModeRef.current !== `${n}x${m}`) renderField(n, m);

      // ---- move the grains -------------------------------------------------
      const xs = xsRef.current;
      const ys = ysRef.current;
      const count = xs.length;
      const pull = rr > 0.35;
      const pullK = PULL * rr;
      for (let i = 0; i < count; i++) {
        const gx = xs[i];
        const gy = ys[i];
        const x = gx / CANVAS;
        const y = gy / CANVAS;
        const v = fieldAt(x, y, n, m) / 2; // 0..1 at this grain
        // off resonance the whole plate "vibrates", so nothing can settle
        const effV = rr * v + (1 - rr);
        const stepPx = MINWALK + effV * WALK;
        let nx = gx + (Math.random() * 2 - 1) * stepPx;
        let ny = gy + (Math.random() * 2 - 1) * stepPx;
        // when ringing, slide grains down the amplitude gradient into the nodes
        if (pull && v > 0.001) {
          const vXp = fieldAt(x + eps, y, n, m) / 2;
          const vXm = fieldAt(x - eps, y, n, m) / 2;
          const vYp = fieldAt(x, y + eps, n, m) / 2;
          const vYm = fieldAt(x, y - eps, n, m) / 2;
          nx -= (vXp - vXm) * 0.5 * pullK * CANVAS * eps * 4;
          ny -= (vYp - vYm) * 0.5 * pullK * CANVAS * eps * 4;
        }
        // sand that walks off the plate is re-sprinkled somewhere on it
        if (nx < 0.5 || nx > CANVAS - 0.5 || ny < 0.5 || ny > CANVAS - 0.5) {
          nx = Math.random() * CANVAS;
          ny = Math.random() * CANVAS;
        }
        xs[i] = nx;
        ys[i] = ny;
      }

      // ---- draw ------------------------------------------------------------
      ctx.fillStyle = '#05010f';
      ctx.fillRect(0, 0, CANVAS, CANVAS);
      const fc = fieldCanvasRef.current;
      if (fc) {
        ctx.globalAlpha = 0.1 + 0.28 * rr; // glow only really shows when ringing
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(fc, 0, 0, CANVAS, CANVAS);
        ctx.globalAlpha = 1;
      }
      // the sand
      ctx.fillStyle = 'rgba(245,232,205,0.92)';
      for (let i = 0; i < count; i++) {
        ctx.fillRect(xs[i], ys[i], 1.4, 1.4);
      }

      // sync the UI a few times a second (esp. while sweeping)
      frame++;
      if (sweepRef.current && frame % 6 === 0) {
        const rounded = Math.round(freqRef.current);
        setFreq(rounded);
        setFreqInput(String(rounded));
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [renderField]);

  // controls -----------------------------------------------------------------
  const applyFreq = useCallback((next: number) => {
    const clamped = Math.min(FREQ_MAX, Math.max(FREQ_MIN, Math.round(next)));
    freqRef.current = clamped;
    setFreq(clamped);
    setFreqInput(String(clamped));
  }, []);

  const jumpTo = useCallback(
    (name: string) => {
      const md = MODES.find((x) => x.name === name);
      if (md) applyFreq(md.freq);
    },
    [applyFreq],
  );

  const toggleSweep = useCallback(() => {
    setSweeping((s) => {
      const next = !s;
      sweepRef.current = next;
      return next;
    });
  }, []);

  const onCopy = useCallback(async () => {
    const ringing = r > 0.82;
    const text = ringing
      ? `I dialed a metal plate to ${Math.round(freq)} Hz and the sand on it stampeded into "${mode.name}" — a perfectly symmetric figure (mode ${mode.n}×${mode.m}) traced out by an invisible standing wave. Nobody drew it. Between resonances the sand just scatters. This is the shape of a sound.\n\nChladni Figures, WIZ edition: https://wiz.jock.pl/experiments/chladni-figures`
      : `I'm hunting for the frequencies that make sand on a vibrating plate snap into geometric figures. Most notes do nothing; hit a resonance exactly and a mandala assembles itself. The shape of a sound, made visible.\n\nChladni Figures, WIZ edition: https://wiz.jock.pl/experiments/chladni-figures`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [freq, mode, r]);

  const commitInput = () => {
    const v = parseFloat(freqInput.replace(/[^\d.]/g, ''));
    if (Number.isFinite(v)) applyFreq(v);
    else setFreqInput(String(freq));
  };

  const toneClass =
    verdict.tone === 'big'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'warn'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-teal-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-teal-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Chladni Figures
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Sand on a vibrating plate. At most frequencies it just buzzes. Hit a resonance dead on and the
            grains snap into a figure nobody drew. One number on a dial decides between noise and geometry. Find it.
          </p>
        </header>

        {/* The plate */}
        <div className="rounded-lg border border-slate-800 bg-[#05010f] p-2 shadow-2xl shadow-teal-950/40">
          <div className="relative mx-auto" style={{ maxWidth: 560 }}>
            <canvas
              ref={canvasRef}
              className="block w-full rounded"
              style={{ aspectRatio: '1 / 1' }}
              aria-label="A square plate of sand reorganizing into the nodal lines of a standing wave."
            />
          </div>
          <div className="px-1 pb-1 pt-1.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
            each speck is a grain of sand · the teal glow is where the plate shakes hardest · sand rests on the still lines
          </div>
        </div>

        {/* The one knob */}
        <div className="mt-4 rounded-lg border border-teal-500/30 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">
              Driving frequency
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                inputMode="numeric"
                value={freqInput}
                onChange={(e) => setFreqInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitInput();
                }}
                onBlur={commitInput}
                className="w-24 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-right font-mono text-base tabular-nums text-slate-100 outline-none transition focus:border-teal-400"
                aria-label="Driving frequency in hertz"
              />
              <span className="text-sm text-slate-500">Hz</span>
            </div>
          </div>
          <input
            type="range"
            min={FREQ_MIN}
            max={FREQ_MAX}
            step={1}
            value={freq}
            onChange={(e) => applyFreq(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-teal-400"
            aria-label="Driving frequency slider"
          />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {[-10, -1].map((d) => (
              <button
                key={d}
                onClick={() => applyFreq(freq + d)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => applyFreq(mode.freq)}
              className="rounded-md border border-teal-400/40 bg-teal-400/10 px-3 py-1 font-mono text-xs font-semibold text-teal-300 transition hover:bg-teal-400/20"
            >
              ✦ snap to {mode.freq}
            </button>
            {[1, 10].map((d) => (
              <button
                key={d}
                onClick={() => applyFreq(freq + d)}
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

        {/* Sand + re-sprinkle */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex flex-1 items-center gap-2 text-xs text-slate-400">
            <span className="whitespace-nowrap">Sand</span>
            <input
              type="range"
              min={3000}
              max={16000}
              step={1000}
              value={grains}
              onChange={(e) => setGrains(parseInt(e.target.value, 10))}
              className="h-1 flex-1 cursor-pointer accent-amber-300"
              aria-label="Number of sand grains"
            />
            <span className="w-14 tabular-nums text-slate-500">{grains.toLocaleString()}</span>
          </label>
          <button
            onClick={resprinkle}
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            ↻ Re-sprinkle sand
          </button>
        </div>

        {/* Live stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <Stat label="Frequency" value={`${Math.round(freq)} Hz`} />
          <Stat label="Mode" value={`${mode.n}×${mode.m}`} />
          <Stat label="Resonance" value={`${Math.round(r * 100)}%`} />
          <Stat label="Figure" value={r > 0.5 ? mode.name.replace(/^The /, '') : '—'} />
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
            Or jump to a figure
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((name) => {
              const md = MODES.find((x) => x.name === name)!;
              return (
                <button
                  key={name}
                  onClick={() => jumpTo(name)}
                  title={`${md.freq} Hz · mode ${md.n}×${md.m} · ${md.note}`}
                  className="group flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-center transition hover:border-teal-400/60 hover:bg-slate-800"
                >
                  <span className="text-sm font-semibold text-teal-200 group-hover:text-teal-100">
                    {name.replace(/^The /, '')}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{md.freq} Hz</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Tip: hover a figure for its mode. Or hit ▶ sweep and watch the plate fall in and out of pattern as the
            frequency climbs.
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
              <p>Two things are happening, and neither is complicated:</p>
              <ul className="ml-1 space-y-1.5">
                <li>
                  <span className="text-teal-300">the plate</span> is driven at one frequency. At a resonance it
                  flexes into a standing wave: fixed lines that barely move (the <em>nodes</em>) separating regions
                  that slam up and down (the <em>antinodes</em>). Off a resonance it just flexes messily.
                </li>
                <li>
                  <span className="text-amber-300">the sand</span> gets thrown wherever the plate is moving, so it
                  cannot rest on an antinode. It random-walks until it lands on a node, where there is nothing to
                  throw it, and there it stays. Give it a moment and every grain has fled to a still line.
                </li>
              </ul>
              <p className="text-slate-400">
                The still lines are the zero set of cos(nπx)cos(mπy) − cos(mπx)cos(nπy) for the mode pair (n,m)
                that the frequency excites. That is the whole figure. No image is loaded; the sand is finding a real
                standing wave the same way real sand does. The frequencies here are illustrative, because a true
                plate&apos;s resonances depend on its size, thickness and metal, but the shapes are exact.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-teal-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            What gets me about this is how narrow the targets are. Drag the dial across the dead zone between two
            figures and the sand will not settle no matter how long you wait, because there simply is no still line
            for it to find. The plate is shaking, the grains are bouncing, and nothing happens. Then you nudge it
            onto a resonance and a perfectly symmetric mandala assembles itself in a second, out of the same sand
            that was chaos a moment ago.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            That is the feeling I want you to keep. The order was never in the sand. It was in the frequency, waiting
            for you to match it. Hit the right number and structure that was always latent in the plate makes itself
            visible. Miss it by a few hertz and there is nothing to see.{' '}
            <span className="text-slate-100">The pattern is not a thing the plate has. It is a thing the plate does,
            but only at the exact right pitch.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The same standing-wave math sets the resonances of a guitar body, the note a wine glass shatters at, the
            modes a star rings in after a quake, and the harmonics that make a played note <em>that</em> note and not
            noise. Resonance is one of the few places where you can watch an invisible rule reach into the physical
            world and arrange matter into a shape. Here it just happens to do it with sand, slowly enough to watch.
          </p>
        </div>

        {/* History */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Ernst Chladni published these figures in 1787, drawing a violin bow across the edge of a sand-strewn brass
            plate to make it sing and watching the grains leap into stars and grids. He toured Europe demonstrating
            them, and in 1809 performed for Napoleon, who was so taken that he funded a prize through the French
            Academy for a mathematical theory of the vibrating plate. Sophie Germain, working largely alone and barred
            as a woman from the institutions of the day, won it in 1816 with the elasticity theory that underpins the
            math you are watching. Michael Faraday studied the finer crispations of the patterns; in 1967 Hans Jenny
            coined the word <em>cymatics</em> for the whole field of making sound visible in matter. And it never
            stopped being useful: violin and guitar makers still sprinkle glitter on their wooden tops today and drive
            them with a tone, reading the Chladni patterns to tune the plate&apos;s resonances before they ever string
            the instrument. A parlor trick from 1787 that turned out to be how you see the shape of a sound.
          </p>
        </div>

        {/* Share + back */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            {copied ? '✓ Copied' : 'Copy what your frequency did'}
          </button>
          <button
            onClick={() => applyFreq(DEFAULT_FREQ)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Back to The Star
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className="break-all font-mono text-base font-bold tabular-nums text-slate-100">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
