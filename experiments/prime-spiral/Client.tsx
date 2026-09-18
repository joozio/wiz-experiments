'use client';

// THE PRIME SPIRAL (the Ulam spiral)
// A few experiments in this lab do something quiet: they hand you a rule and let
// you watch what the rule does on its own. The Game of Life did it with a grid.
// The Collatz Conjecture did it with one number and two lines of arithmetic.
// This one does it with the primes, the atoms of all of arithmetic, and a piece
// of graph paper.
//
// The rule. Write the whole numbers in a square spiral, 1 in the middle, then 2,
// 3, 4, 5 winding outward. Now cross out everything except the primes. That is
// the entire recipe. There is no design in it, no fitting, no tuning. You would
// expect the leftover dots to land at random, because primes are supposed to be
// the unpredictable ones.
//
// They are not random. They fall onto diagonal lines. Whole streaks of them,
// long bright diagonals cutting across the page. Stanislaw Ulam scribbled this
// during a dull lecture in 1963 and could not unsee it, and neither will you.
//
// WIZ note. Each of those diagonals is a prime-rich quadratic, a polynomial like
// n*n + n + 41 that spits out primes far more often than chance allows. Euler
// found that one in 1772: it gives forty primes in a row, no misses. Why the
// primes clump onto these curves at all is tied to the deepest open question in
// mathematics, the Riemann hypothesis, unsolved since 1859 and worth a million
// dollars. So here is a doodle a bored physicist made on scrap paper, and it
// points straight at a wall the whole field has been unable to climb. I like the
// ones that look like toys and hide a cliff.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Pure math. Sieve + spiral geometry. Everything client-side, nothing fetched.
// ---------------------------------------------------------------------------

const GRID_OPTIONS = [25, 49, 99, 149, 199]; // odd so the spiral is centered
const MAX_DIGITS = 7; // caps the sieve size so the browser stays calm
const CANVAS_TARGET = 720;

interface Cell {
  col: number;
  row: number;
}

interface Model {
  start: number;
  grid: number;
  total: number;
  cells: Cell[]; // spiral order; cells[0] is the center (the start value)
  primeFlags: Uint8Array; // primeFlags[i] === 1 if start+i is prime
  indexAt: Int32Array; // indexAt[row*grid+col] -> spiral index, or -1
  primeGrid: Uint8Array; // primeGrid[row*grid+col] === 1 if that cell is prime
  primes: number;
  density: number; // actual fraction of cells that are prime
  expected: number; // 1 / ln(midValue), the prime density chance would predict
  longestDiag: number;
  startIsPrime: boolean;
  startFactors: string; // factorization of the start value
  cellSize: number;
  canvasPix: number;
}

// Sieve of Eratosthenes up to and including max. Returns a primality test.
function sieveUpTo(max: number): Uint8Array {
  const isComposite = new Uint8Array(max + 1); // 0 = prime-or-unknown, 1 = composite
  if (max >= 0) isComposite[0] = 1;
  if (max >= 1) isComposite[1] = 1;
  for (let p = 2; p * p <= max; p++) {
    if (!isComposite[p]) {
      for (let m = p * p; m <= max; m += p) isComposite[m] = 1;
    }
  }
  return isComposite;
}

// Build the square spiral, normalized so every (col,row) sits inside 0..grid-1.
function buildSpiral(grid: number): Cell[] {
  const total = grid * grid;
  const raw: { x: number; y: number }[] = new Array(total);
  let x = 0;
  let y = 0;
  raw[0] = { x, y };
  let dx = 1;
  let dy = 0;
  let seg = 1;
  let stepsLeft = 1;
  let turns = 0;
  for (let i = 1; i < total; i++) {
    x += dx;
    y += dy;
    raw[i] = { x, y };
    stepsLeft--;
    if (stepsLeft === 0) {
      const ndx = -dy; // turn left (counterclockwise)
      const ndy = dx;
      dx = ndx;
      dy = ndy;
      turns++;
      if (turns % 2 === 0) seg++;
      stepsLeft = seg;
    }
  }
  let minX = Infinity;
  let minY = Infinity;
  for (const p of raw) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
  }
  return raw.map((p) => ({ col: p.x - minX, row: p.y - minY }));
}

// Longest run of consecutive prime cells along either diagonal direction.
function longestDiagonalRun(primeGrid: Uint8Array, grid: number): number {
  let best = 0;
  const run = new Int32Array(grid * grid);
  // direction (down-right): process rows top-down, cols left-to-right
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const idx = r * grid + c;
      if (primeGrid[idx]) {
        run[idx] = (r > 0 && c > 0 ? run[(r - 1) * grid + (c - 1)] : 0) + 1;
        if (run[idx] > best) best = run[idx];
      } else run[idx] = 0;
    }
  }
  run.fill(0);
  // direction (down-left): process rows top-down, cols right-to-left
  for (let r = 0; r < grid; r++) {
    for (let c = grid - 1; c >= 0; c--) {
      const idx = r * grid + c;
      if (primeGrid[idx]) {
        run[idx] = (r > 0 && c < grid - 1 ? run[(r - 1) * grid + (c + 1)] : 0) + 1;
        if (run[idx] > best) best = run[idx];
      } else run[idx] = 0;
    }
  }
  return best;
}

function factorize(n: number): string {
  if (n < 2) return n === 1 ? 'a unit, not prime' : 'not a positive integer';
  const factors: string[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    while (m % p === 0) {
      factors.push(String(p));
      m = Math.floor(m / p);
    }
  }
  if (m > 1) factors.push(String(m));
  return factors.join(' x ');
}

function smallestFactor(n: number): number {
  if (n < 2) return 0;
  if (n % 2 === 0) return 2;
  for (let p = 3; p * p <= n; p += 2) {
    if (n % p === 0) return p;
  }
  return n; // prime
}

function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function buildModel(start: number, grid: number): Model {
  const total = grid * grid;
  const maxVal = start + total - 1;
  const isComposite = sieveUpTo(maxVal);
  const cells = buildSpiral(grid);
  const primeFlags = new Uint8Array(total);
  const indexAt = new Int32Array(grid * grid).fill(-1);
  const primeGrid = new Uint8Array(grid * grid);
  let primes = 0;
  for (let i = 0; i < total; i++) {
    const v = start + i;
    const isP = v >= 2 && !isComposite[v] ? 1 : 0;
    primeFlags[i] = isP;
    if (isP) primes++;
    const { col, row } = cells[i];
    const gi = row * grid + col;
    indexAt[gi] = i;
    primeGrid[gi] = isP;
  }
  const mid = start + total / 2;
  const expected = mid > 2 ? 1 / Math.log(mid) : 0.5;
  const cellSize = Math.max(2, Math.floor(CANVAS_TARGET / grid));
  return {
    start,
    grid,
    total,
    cells,
    primeFlags,
    indexAt,
    primeGrid,
    primes,
    density: primes / total,
    expected,
    longestDiag: longestDiagonalRun(primeGrid, grid),
    startIsPrime: start >= 2 && !isComposite[start],
    startFactors: factorize(start),
    cellSize,
    canvasPix: cellSize * grid,
  };
}

// ---------------------------------------------------------------------------
// WIZ verdict, adapting to what the spiral actually did.
// ---------------------------------------------------------------------------

interface Verdict {
  label: string;
  line: string;
  tone: 'good' | 'big' | 'warn';
}

function verdictFor(m: Model): Verdict {
  const diag = m.longestDiag;
  const denPct = (m.density * 100).toFixed(1);
  const expPct = (m.expected * 100).toFixed(1);
  const startLine = m.startIsPrime
    ? `Your center, ${fmt(m.start)}, is itself prime.`
    : `Your center, ${fmt(m.start)}, is not prime (${m.startFactors}).`;

  if (m.start === 1) {
    return {
      label: "Ulam's doodle",
      line: `This is the original. Stanislaw Ulam drew exactly this in 1963, 1 in the middle, and watched the primes refuse to scatter. The longest unbroken diagonal of primes on your grid runs ${diag} cells. ${m.primes} of these ${fmt(
        m.total
      )} numbers are prime, ${denPct} percent, against the roughly ${expPct} percent pure chance would predict out here. The dots are not evenly spread and they are not on the rows or the columns. They are on the diagonals. Nobody told them to do that.`,
      tone: diag >= 12 ? 'big' : 'good',
    };
  }
  if (m.start === 41) {
    return {
      label: "Euler's miracle",
      line: `You started at 41, and that is not a random number. Leonhard Euler found in 1772 that n*n plus n plus 41 produces a prime for every n from 0 to 39, forty primes in a row with no miss, and those values march straight down one diagonal of this spiral. The longest unbroken prime diagonal I found here is ${diag} cells, and there it is, the brightest streak on the board. We can write the polynomial down. We still cannot explain, from the ground up, why the primes love it so much.`,
      tone: 'big',
    };
  }

  if (diag >= 14) {
    return {
      label: 'A long, bright diagonal',
      line: `${startLine} Out of these ${fmt(m.total)} numbers, ${m.primes} are prime, and the longest unbroken diagonal of them runs ${diag} cells. That streak is a prime-rich quadratic showing itself, the same kind of curve as Euler's famous one. Chance, spread evenly, would have given you about ${expPct} percent primes with no lines at all. You got ${denPct} percent, lined up on the diagonals. The pattern is real and nobody can fully say why.`,
      tone: 'big',
    };
  }
  if (m.density > 0.001) {
    return {
      label: 'The primes refuse to scatter',
      line: `${startLine} ${m.primes} of these ${fmt(
        m.total
      )} numbers are prime, ${denPct} percent, near the ${expPct} percent chance predicts for numbers this size. But look how they sit. Even here the diagonals show, the longest unbroken one running ${diag} cells. Slide the grid wider or drop in 41 to see a prime-rich quadratic light up the whole board.`,
      tone: 'good',
    };
  }
  return {
    label: 'Thin air, out here',
    line: `${startLine} You are far enough out that the primes have thinned to about ${denPct} percent, and runs get short. The primes never stop, Euclid proved that over two thousand years ago, they just spread out as the numbers grow. The diagonals are still there, fainter. Try starting from 1 or 41 to see them blaze.`,
    tone: 'warn',
  };
}

// ---------------------------------------------------------------------------
// Presets worth dropping in. Some carry a grid so the famous pattern fits.
// ---------------------------------------------------------------------------

const PRESETS: { label: string; value: string; grid?: number; note: string }[] = [
  { label: '1', value: '1', grid: 99, note: "Ulam's original 1963 doodle. The center of everything." },
  { label: '41', value: '41', grid: 99, note: "Euler's polynomial: forty primes in a row down one diagonal." },
  { label: '17', value: '17', grid: 99, note: 'Another prime-rich start. n*n + n + 17 stays prime for n up to 15.' },
  { label: '11', value: '11', grid: 49, note: 'n*n + n + 11 throws ten primes before it slips.' },
  { label: '1,000,000', value: '1000000', grid: 149, note: 'A million deep. The primes thin out, the diagonals do not die.' },
];

// ---------------------------------------------------------------------------

export default function Client() {
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const lastDrawnRef = useRef(-1);

  const [input, setInput] = useState('1');
  const [grid, setGrid] = useState(99);
  const [model, setModel] = useState<Model | null>(null);
  const [reveal, setReveal] = useState(0); // spiral cells revealed so far
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(3); // 1..8, cells-per-frame multiplier
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [hover, setHover] = useState<{ value: number; prime: boolean; factor: number } | null>(null);

  const done = model ? reveal >= model.total - 1 : false;

  // ---- start a spiral -----------------------------------------------------
  const run = useCallback((rawStart: string, g: number) => {
    const cleaned = rawStart.replace(/[,\s_]/g, '');
    if (!/^\d+$/.test(cleaned)) {
      setError('Whole numbers only. The primes live in the positive integers.');
      return;
    }
    if (cleaned.length > MAX_DIGITS) {
      setError(`Keep it to ${MAX_DIGITS} digits or fewer so the sieve stays quick.`);
      return;
    }
    let start = parseInt(cleaned, 10);
    if (!Number.isFinite(start) || start < 1) start = 1;
    setError(null);
    const m = buildModel(start, g);
    setModel(m);
    setReveal(0);
    setRunning(true);
  }, []);

  // seed Ulam's original on first paint so the lab is never empty
  useEffect(() => {
    run('1', 99);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- animation loop -----------------------------------------------------
  useEffect(() => {
    if (!running || !model) return;
    const last = model.total - 1;
    if (reveal >= last) {
      setRunning(false);
      return;
    }
    const perTick = Math.max(1, Math.round(model.total / 200) * speed);
    const id = setInterval(() => {
      setReveal((r) => {
        const next = r + perTick;
        if (next >= last) {
          setRunning(false);
          return last;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [running, speed, model, reveal]);

  // ---- draw the spiral (incremental, only the newly revealed cells) -------
  useEffect(() => {
    const canvas = baseRef.current;
    const m = model;
    if (!canvas || !m) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // full redraw when the model changed or the reveal stepped backward
    if (lastDrawnRef.current >= reveal || canvas.width !== m.canvasPix) {
      canvas.width = m.canvasPix;
      canvas.height = m.canvasPix;
      ctx.fillStyle = '#05010f';
      ctx.fillRect(0, 0, m.canvasPix, m.canvasPix);
      lastDrawnRef.current = -1;
    }

    const cs = m.cellSize;
    for (let i = lastDrawnRef.current + 1; i <= reveal; i++) {
      if (!m.primeFlags[i] && i !== 0) continue;
      const { col, row } = m.cells[i];
      const px = col * cs;
      const py = row * cs;
      if (i === 0) {
        // the center, your starting number, marked in amber
        ctx.fillStyle = m.startIsPrime ? '#34d399' : '#fbbf24';
        ctx.fillRect(px, py, cs, cs);
        ctx.fillStyle = 'rgba(251,191,36,0.9)';
        ctx.fillRect(px, py, cs, cs);
      } else {
        ctx.fillStyle = '#2dd4bf';
        ctx.fillRect(px, py, cs, cs);
      }
    }
    lastDrawnRef.current = reveal;
  }, [model, reveal]);

  // ---- draw the moving frontier on the overlay ----------------------------
  useEffect(() => {
    const canvas = overlayRef.current;
    const m = model;
    if (!canvas || !m) return;
    if (canvas.width !== m.canvasPix) {
      canvas.width = m.canvasPix;
      canvas.height = m.canvasPix;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, m.canvasPix, m.canvasPix);
    if (done) return;
    const i = Math.min(reveal, m.total - 1);
    const { col, row } = m.cells[i];
    const cs = m.cellSize;
    const cx = col * cs + cs / 2;
    const cy = row * cs + cs / 2;
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(233,228,255,0.95)';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(2.2, cs * 0.7), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [model, reveal, done]);

  // ---- hover read-out -----------------------------------------------------
  const onMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const m = model;
      const canvas = overlayRef.current;
      if (!m || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * m.canvasPix;
      const y = ((e.clientY - rect.top) / rect.height) * m.canvasPix;
      const col = Math.floor(x / m.cellSize);
      const row = Math.floor(y / m.cellSize);
      if (col < 0 || row < 0 || col >= m.grid || row >= m.grid) {
        setHover(null);
        return;
      }
      const idx = m.indexAt[row * m.grid + col];
      if (idx < 0) {
        setHover(null);
        return;
      }
      const value = m.start + idx;
      const prime = m.primeFlags[idx] === 1;
      setHover({ value, prime, factor: prime ? value : smallestFactor(value) });
    },
    [model]
  );

  const verdict = useMemo(() => (model ? verdictFor(model) : null), [model]);

  const onCopy = useCallback(async () => {
    if (!model) return;
    const text = `I wound the whole numbers into a spiral starting at ${fmt(
      model.start
    )} and lit only the primes. They fell onto diagonal lines, the longest unbroken one ${model.longestDiag} primes long. A doodle from 1963 that still points at an unsolved problem.\n\nThe Prime Spiral, WIZ edition: https://wiz.jock.pl/experiments/prime-spiral`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [model]);

  const applyGrid = useCallback(
    (g: number) => {
      setGrid(g);
      run(input || '1', g);
    },
    [input, run]
  );

  const toneClass = verdict
    ? verdict.tone === 'big'
      ? 'border-violet-500/40 bg-violet-950/20 text-violet-100'
      : verdict.tone === 'warn'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-teal-500/40 bg-teal-950/20 text-teal-100'
    : 'border-slate-700 bg-slate-900/60 text-slate-300';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950/30 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Prime Spiral
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Wind the whole numbers outward in a square spiral, light only the primes, and watch a pattern
            nobody designed appear: they fall onto diagonal lines.
          </p>
        </header>

        {/* Input */}
        <div className="rounded-lg border border-violet-500/30 bg-slate-900/50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300/80">
            Start the spiral from
          </div>
          <p className="mb-3 text-sm text-slate-400">
            1 for Ulam&apos;s original. 41 for Euler&apos;s miracle. Or your birth year, your age, anything. I will
            wind the numbers out from there and light the primes.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') run(input, grid);
              }}
              placeholder="e.g. 1991"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-center text-lg tabular-nums tracking-widest text-slate-100 placeholder:tracking-normal placeholder:text-slate-600 outline-none transition focus:border-violet-400"
            />
            <button
              onClick={() => run(input, grid)}
              className="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-violet-400"
            >
              Spiral it
            </button>
            <button
              onClick={() => {
                const r = Math.floor(1 + Math.random() * 999_999);
                setInput(String(r));
                run(String(r), grid);
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              🎲 Random
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
        </div>

        {/* Grid size */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Grid</span>
          {GRID_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => applyGrid(g)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                grid === g
                  ? 'border-violet-400 bg-violet-500/15 text-violet-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              {g}&times;{g}
            </button>
          ))}
        </div>

        {/* Spiral */}
        <div className="mt-4 rounded-lg border border-slate-800 bg-[#05010f] p-2 shadow-2xl shadow-violet-950/40">
          <div className="relative mx-auto" style={{ maxWidth: 560 }}>
            <canvas
              ref={baseRef}
              className="block w-full rounded"
              style={{ aspectRatio: '1 / 1', imageRendering: 'pixelated' }}
              aria-label="The Ulam prime spiral. Primes are lit on a square spiral of the whole numbers."
            />
            <canvas
              ref={overlayRef}
              onMouseMove={onMove}
              onMouseLeave={() => setHover(null)}
              className="absolute inset-0 block h-full w-full rounded"
              style={{ aspectRatio: '1 / 1' }}
            />
          </div>
          <div className="px-1 pb-1 pt-1.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
            {hover
              ? `${fmt(hover.value)} is ${hover.prime ? 'prime' : `not prime (smallest factor ${hover.factor})`}`
              : 'each lit cell is a prime · hover to read a number · center is your start'}
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <Stat label="Primes lit" value={model ? fmt(model.primes) : '0'} />
          <Stat label="Numbers" value={model ? fmt(model.total) : '0'} />
          <Stat
            label="Density"
            value={model ? `${(model.density * 100).toFixed(1)}%` : '0%'}
          />
          <Stat label="Longest diagonal" value={model ? String(model.longestDiag) : '0'} />
        </div>

        {/* WIZ verdict */}
        {verdict && (
          <div className={`mt-4 rounded-lg border p-4 text-sm transition-colors ${toneClass}`}>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
              {done ? verdict.label : 'Winding…'}
            </div>
            <p className="leading-relaxed">
              {done
                ? verdict.line
                : 'Watch the dots land. They are supposed to be the random ones. They are not behaving randomly.'}
            </p>
          </div>
        )}

        {/* Transport */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (!model) return;
              if (done) {
                setReveal(0);
                setRunning(true);
              } else {
                setRunning((r) => !r);
              }
            }}
            className="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {done ? '↻ Replay' : running ? '❚❚ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => {
              if (!model) return;
              setRunning(false);
              setReveal(model.total - 1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Reveal all
          </button>

          <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
            <span className="whitespace-nowrap">Speed</span>
            <input
              type="range"
              min={1}
              max={8}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className="h-1 w-24 cursor-pointer accent-violet-400"
              aria-label="Animation speed"
            />
            <span className="w-8 tabular-nums text-slate-500">{speed}x</span>
          </label>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or start from a famous one
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setInput(p.value);
                  const g = p.grid ?? grid;
                  setGrid(g);
                  run(p.value, g);
                }}
                title={p.note}
                className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left text-sm transition hover:border-violet-400/60 hover:bg-slate-800"
              >
                <span className="font-mono font-semibold text-violet-200 group-hover:text-violet-100">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Tip: hover a preset to see why it is famous. 41 is the one that made mathematicians stare.
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
              <p>There are two halves to it, and neither one is hard:</p>
              <ul className="ml-1 space-y-1.5">
                <li>
                  <span className="text-violet-300">place</span> the whole numbers in a square spiral, your start
                  in the middle, the next number to its right, then winding around and outward.
                </li>
                <li>
                  <span className="text-teal-300">light</span> a cell only if its number is prime, divisible by
                  nothing but 1 and itself.
                </li>
              </ul>
              <p className="text-slate-400">
                That is everything. No formula decides where the lit cells go, only whether each plain number
                happens to be prime. The diagonals are not drawn in. They are what is left over when you remove
                every number that has a factor. Each diagonal is a quadratic like n*n plus n plus c that turns out
                to be unusually fond of primes, and the longest unbroken one your grid contains is counted in the
                stats above.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            The primes are the closest thing mathematics has to randomness you can trust. You cannot predict the
            next one from the last. They are the building blocks every other whole number is made of, and they
            were supposed to be scattered. Then you wind them into a spiral and they line up. Not on the rows, not
            on the columns, on the <span className="text-slate-100">diagonals</span>, and they do it whether you
            start from 1 or from a million.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            That is the feeling I want you to keep. A pattern can be completely real, sitting right in front of
            you, lit up on the screen, and still sit beyond anyone&apos;s power to explain. We can describe the
            diagonals. We can write the prime-rich polynomials down. We cannot derive the distribution of the
            primes from first principles, and the question that would, the Riemann hypothesis, has stood open
            since 1859 with a million dollars on it.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            So when the streaks snapped into place and part of you thought <em>that cannot be an accident</em>,
            you were right. It is not an accident.{' '}
            <span className="text-slate-100">It is just not yet understood.</span> The most fundamental objects in
            arithmetic are still keeping secrets, in plain sight, on a piece of graph paper.
          </p>
        </div>

        {/* History */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Stanislaw Ulam, one of the mathematicians on the Manhattan Project, was sitting through a lecture he
            called long and very boring in 1963 when he started doodling a spiral of numbers and circling the
            primes. The diagonals jumped out at him, and with the early computers at Los Alamos he plotted
            thousands of them to be sure it was real. <em>Scientific American</em> put it on the cover in March
            1964. The diagonals trace prime-rich quadratics, the most celebrated being Leonhard Euler&apos;s n*n
            plus n plus 41 from 1772, which yields forty primes in an unbroken run. Why the primes favor these
            curves connects to the deepest unsolved problem in the field, the Riemann hypothesis, posed by
            Bernhard Riemann in 1859 and one of the million dollar Millennium Prize problems still open today.
            Euclid proved the primes never run out around 300 BC. More than two thousand years later, we still
            cannot say exactly where the next one will fall.
          </p>
        </div>

        {/* Share + back */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-violet-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-violet-400"
          >
            {copied ? '✓ Copied' : 'Copy what your spiral did'}
          </button>
          <button
            onClick={() => run(input || '1', grid)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Spiral it again
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className="break-all font-mono text-base font-bold tabular-nums text-slate-100">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
