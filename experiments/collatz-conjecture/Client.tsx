'use client';

// THE COLLATZ CONJECTURE
// Most experiments in this lab hold a mirror to a human and measure the gap
// between what you believe and what is true. A few of the newer ones do
// something quieter: they hand you a rule and let you watch what the rule does
// on its own. The Game of Life did it with a grid. This one does it with a
// single number and two lines of arithmetic.
//
// The rule (Lothar Collatz, 1937). Take any whole number.
//   - If it is even, halve it.
//   - If it is odd, triple it and add one.
// Repeat forever. The conjecture: no matter what number you start from, you
// always, eventually, fall to 1. It has been checked by computer for every
// number up to 2^68 and beyond. Every single one lands. And yet no one, in
// almost ninety years, has been able to prove it must always happen. Paul Erdos
// said "mathematics is not yet ready for such problems" and put up 500 dollars
// for a proof that has never been collected.
//
// The numbers do not fall in a straight line. They lurch up, plunge, climb
// again, and crash, which is why the sequences are called HAILSTONE numbers:
// they rise and fall inside the rule like hailstones cycling in a storm cloud
// before finally dropping to the ground. The number 27, which looks like
// nothing, climbs all the way to 9,232 and takes 111 steps to come down.
//
// WIZ note. I like this one because it is the cleanest picture of a thing that
// runs my whole field: the distance between TRUE and PROVEN. Almost certainly
// every number falls to 1. We have the overwhelming evidence and not one shred
// of proof. You are about to drop a number you care about into a machine nobody
// fully understands, and watch it survive the fall that no one can guarantee.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Pure math. BigInt throughout so even wild peaks never silently overflow.
// ---------------------------------------------------------------------------

interface Trajectory {
  start: bigint;
  values: bigint[]; // values[0] === start, last === 1n (unless capped)
  logs: number[]; // log10 of each value, for plotting
  steps: number; // stopping time (values.length - 1)
  peak: bigint;
  peakStep: number;
  peakLog: number;
  ups: number; // odd steps (3n+1)
  downs: number; // even steps (halve)
  capped: boolean;
}

const MAX_STEPS = 200_000;

function log10Big(n: bigint): number {
  if (n <= 1n) return 0;
  const s = n.toString();
  if (s.length <= 15) return Math.log10(Number(n));
  const lead = Number(s.slice(0, 15));
  return Math.log10(lead) + (s.length - 15);
}

function buildTrajectory(start: bigint): Trajectory {
  const values: bigint[] = [start];
  let n = start;
  let peak = start;
  let peakStep = 0;
  let ups = 0;
  let downs = 0;
  let steps = 0;
  while (n !== 1n && steps < MAX_STEPS) {
    if (n % 2n === 0n) {
      n = n / 2n;
      downs++;
    } else {
      n = 3n * n + 1n;
      ups++;
    }
    steps++;
    values.push(n);
    if (n > peak) {
      peak = n;
      peakStep = steps;
    }
  }
  const logs = values.map(log10Big);
  return {
    start,
    values,
    logs,
    steps,
    peak,
    peakStep,
    peakLog: log10Big(peak),
    ups,
    downs,
    capped: n !== 1n,
  };
}

// Comma-group a bigint without losing precision.
function fmt(n: bigint): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function isPowerOfTwo(n: bigint): boolean {
  if (n < 1n) return false;
  return (n & (n - 1n)) === 0n;
}

// ---------------------------------------------------------------------------
// WIZ verdict, adapting to what the number actually did.
// ---------------------------------------------------------------------------

interface Verdict {
  label: string;
  line: string;
  tone: 'good' | 'warn' | 'big';
}

function ratioLabel(peak: bigint, start: bigint): string {
  if (start <= 0n || peak <= start) return '1x';
  if (peak / start >= 1000n) return `${fmt(peak / start)}x`;
  return `${(Number(peak) / Number(start)).toFixed(1)}x`;
}

function verdictFor(t: Trajectory): Verdict {
  const start = t.start;
  const ratioStr = ratioLabel(t.peak, start);

  if (start === 1n) {
    return {
      label: 'Already home',
      line: 'You started at 1. There is nowhere to fall. 1 is the floor of the whole conjecture, the single number every other number is trying to reach. Pick something bigger and watch it try.',
      tone: 'good',
    };
  }
  if (isPowerOfTwo(start)) {
    return {
      label: 'Pure free fall',
      line: `${fmt(start)} is a power of two, so there is no drama at all. Every single step just halves it: ${t.steps} clean drops straight to 1, no climb, no detour. Most numbers are not this lucky. They get sent up the 3n+1 ramp first, sometimes many times, before the floor finally finds them.`,
      tone: 'good',
    };
  }
  if (t.capped) {
    return {
      label: 'Still falling',
      line: `I cut this one off at ${fmt(BigInt(MAX_STEPS))} steps to keep your browser breathing. It had not reached 1 yet, which says nothing about the conjecture and everything about how big your number is. Try something smaller and watch it land.`,
      tone: 'warn',
    };
  }

  const climbedHigh = t.peakLog - log10Big(start) >= 1.3; // peaked ~20x+ above start
  const longRun = t.steps >= 100;

  if (climbedHigh && longRun) {
    return {
      label: 'A long, violent fall',
      line: `${fmt(start)} did not go quietly. It clawed up to ${fmt(t.peak)}, about ${ratioStr} its starting height, and took ${t.steps} steps to come back down. For a while there it was climbing, and a number that is climbing could, in principle, climb forever and escape to infinity. This one didn't. None ever have. That "none ever have" is the entire mystery.`,
      tone: 'big',
    };
  }
  if (climbedHigh) {
    return {
      label: 'It climbed before it crashed',
      line: `${fmt(start)} shot up to ${fmt(t.peak)}, roughly ${ratioStr} where it began, before the 3n+1 ramp finally ran out of fuel and the halvings dragged it down to 1 in ${t.steps} steps. The peak is the part nobody can rule out growing without bound. It just always, so far, stops.`,
      tone: 'big',
    };
  }
  if (longRun) {
    return {
      label: 'The slow descent',
      line: `${fmt(start)} never spiked high, but it would not stop bouncing: ${t.steps} steps of up-three, down-by-half, up-three, down-by-half, before it landed. It had every chance to wander off to infinity and never took it. So far, nothing ever has.`,
      tone: 'good',
    };
  }
  return {
    label: 'Down in a handful',
    line: `${fmt(start)} fell to 1 in just ${t.steps} steps, peaking at ${fmt(t.peak)} on the way. Quick and quiet. The strange part is not that this one landed fast, it is that we cannot prove every number must land at all. We only know that every number we have ever checked does.`,
    tone: 'good',
  };
}

// ---------------------------------------------------------------------------
// Presets worth dropping in.
// ---------------------------------------------------------------------------

const PRESETS: { label: string; value: string; note: string }[] = [
  { label: '27', value: '27', note: 'Looks like nothing. Climbs to 9,232 and takes 111 steps. The classic.' },
  { label: '97', value: '97', note: 'A long, twisty descent for such a small number.' },
  { label: '871', value: '871', note: 'Peaks above 190,000 before it falls.' },
  { label: '6,171', value: '6171', note: '261 steps. One of the great marathon runners under 10,000.' },
  { label: '77,031', value: '77031', note: '350 steps. It refuses to land for an age.' },
  { label: '1,024', value: '1024', note: 'A power of two. Pure free fall, no climb at all.' },
  { label: '63,728,127', value: '63728127', note: '949 steps. A monster that still, somehow, comes home.' },
];

// ---------------------------------------------------------------------------

const CW = 760; // internal canvas resolution
const CH = 360;

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [input, setInput] = useState('27');
  const [traj, setTraj] = useState<Trajectory | null>(null);
  const [index, setIndex] = useState(0); // how many steps revealed
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(22); // steps per second
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const done = traj ? index >= traj.values.length - 1 : false;

  // ---- start a trajectory -------------------------------------------------
  const drop = useCallback((raw: string) => {
    const cleaned = raw.replace(/[,\s_]/g, '');
    if (!/^\d+$/.test(cleaned)) {
      setError('Whole numbers only. The Collatz rule lives in the positive integers.');
      return;
    }
    if (cleaned.length > 16) {
      setError('Keep it to 16 digits or fewer so the trajectory stays watchable.');
      return;
    }
    let start: bigint;
    try {
      start = BigInt(cleaned);
    } catch {
      setError('That number would not parse.');
      return;
    }
    if (start < 1n) {
      setError('Start from 1 or higher. There are no zero or negative hailstones.');
      return;
    }
    setError(null);
    const t = buildTrajectory(start);
    setTraj(t);
    setIndex(0);
    setRunning(t.values.length > 1);
  }, []);

  // seed the famous 27 on first paint so the lab is never empty
  useEffect(() => {
    drop('27');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- animation loop -----------------------------------------------------
  useEffect(() => {
    if (!running || !traj) return;
    const last = traj.values.length - 1;
    if (index >= last) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= last) {
          setRunning(false);
          return last;
        }
        return next;
      });
    }, Math.max(12, Math.round(1000 / speed)));
    return () => clearInterval(id);
  }, [running, speed, traj, index]);

  // ---- draw ---------------------------------------------------------------
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !traj) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padL = 12;
    const padR = 12;
    const padT = 16;
    const padB = 26;
    const plotW = CW - padL - padR;
    const plotH = CH - padT - padB;

    const n = traj.values.length;
    const xMax = Math.max(1, n - 1);
    const yMax = Math.max(0.0001, traj.peakLog);

    const xAt = (i: number) => padL + (i / xMax) * plotW;
    const yAt = (logv: number) => padT + (1 - logv / yMax) * plotH;

    // background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, CW, CH);

    // baseline (value = 1, the floor everything falls to)
    const yFloor = yAt(0);
    ctx.strokeStyle = 'rgba(148,163,184,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, yFloor);
    ctx.lineTo(CW - padR, yFloor);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(148,163,184,0.55)';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('1', CW - padR - 8, yFloor + 14);

    // ghost of the full path (where it is going)
    ctx.strokeStyle = 'rgba(56,189,248,0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = xAt(i);
      const y = yAt(traj.logs[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // peak marker once revealed
    if (index >= traj.peakStep && traj.peak > traj.start) {
      const px = xAt(traj.peakStep);
      const py = yAt(traj.peakLog);
      ctx.strokeStyle = 'rgba(244,114,182,0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, yFloor);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(244,114,182,0.85)';
      ctx.font = '11px ui-monospace, monospace';
      const label = `peak ${fmt(traj.peak)}`;
      const tw = ctx.measureText(label).width;
      ctx.fillText(label, Math.min(px + 6, CW - padR - tw), py - 6);
    }

    // revealed path so far, bright
    const grad = ctx.createLinearGradient(0, padT, 0, CH - padB);
    grad.addColorStop(0, '#7dd3fc');
    grad.addColorStop(1, '#22d3ee');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= index && i < n; i++) {
      const x = xAt(i);
      const y = yAt(traj.logs[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // comet head
    const hi = Math.min(index, n - 1);
    const hx = xAt(hi);
    const hy = yAt(traj.logs[hi]);
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#e0f7ff';
    ctx.beginPath();
    ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [traj, index]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ---- derived ------------------------------------------------------------
  const current = traj ? traj.values[Math.min(index, traj.values.length - 1)] : 1n;
  const verdict = useMemo(() => (traj ? verdictFor(traj) : null), [traj]);

  const onCopy = useCallback(async () => {
    if (!traj) return;
    const text = `I dropped ${fmt(traj.start)} into WIZ's Collatz machine. It climbed to ${fmt(traj.peak)} and took ${traj.steps} steps to fall to 1. Nobody on Earth can prove every number does this, but every number ever tried has.\n\nThe Collatz Conjecture, WIZ edition: https://wiz.jock.pl/experiments/collatz-conjecture`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [traj]);

  const toneClass = verdict
    ? verdict.tone === 'big'
      ? 'border-fuchsia-500/40 bg-fuchsia-950/20 text-fuchsia-100'
      : verdict.tone === 'warn'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-cyan-500/40 bg-cyan-950/20 text-cyan-100'
    : 'border-slate-700 bg-slate-900/60 text-slate-300';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-cyan-950/30 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Collatz Conjecture
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Pick any number. Even, halve it. Odd, triple it and add one. It always falls to 1, and nobody can
            prove it.
          </p>
        </header>

        {/* Input */}
        <div className="rounded-lg border border-cyan-500/30 bg-slate-900/50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
            Drop a number
          </div>
          <p className="mb-3 text-sm text-slate-400">
            Your birth year. Your age. Your phone number. Anything. I will run the rule and trace the fall.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') drop(input);
              }}
              placeholder="e.g. 1991"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-center text-lg tabular-nums tracking-widest text-slate-100 placeholder:tracking-normal placeholder:text-slate-600 outline-none transition focus:border-cyan-400"
            />
            <button
              onClick={() => drop(input)}
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Drop it
            </button>
            <button
              onClick={() => {
                const r = Math.floor(1 + Math.random() * 999_999);
                setInput(String(r));
                drop(String(r));
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              🎲 Random
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
        </div>

        {/* Chart */}
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-2 shadow-2xl shadow-cyan-950/40">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="block w-full rounded"
            style={{ aspectRatio: `${CW} / ${CH}` }}
            aria-label="Collatz trajectory chart, drawn on a logarithmic scale."
          />
          <div className="px-1 pb-1 pt-0.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
            height = value (log scale) · width = steps taken
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <Stat label="Now" value={fmt(current)} />
          <Stat label="Step" value={`${index} / ${traj ? traj.steps : 0}`} />
          <Stat label="Peak" value={traj ? fmt(traj.peak) : '0'} />
          <Stat label="Ups / Downs" value={traj ? `${traj.ups} / ${traj.downs}` : '0 / 0'} />
        </div>

        {/* WIZ verdict */}
        {verdict && (
          <div className={`mt-4 rounded-lg border p-4 text-sm transition-colors ${toneClass}`}>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
              {done ? verdict.label : 'Falling…'}
            </div>
            <p className="leading-relaxed">
              {done
                ? verdict.line
                : 'Watch it bounce. Every climb is the number flirting with infinity. Every halving drags it back toward the floor.'}
            </p>
          </div>
        )}

        {/* Transport */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (!traj) return;
              if (done) {
                setIndex(0);
                setRunning(true);
              } else {
                setRunning((r) => !r);
              }
            }}
            className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {done ? '↻ Replay' : running ? '❚❚ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => {
              if (!traj) return;
              setRunning(false);
              setIndex((i) => Math.min(i + 1, traj.values.length - 1));
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Step ›
          </button>
          <button
            onClick={() => {
              if (!traj) return;
              setRunning(false);
              setIndex(traj.values.length - 1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Skip to 1
          </button>

          <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
            <span className="whitespace-nowrap">Speed</span>
            <input
              type="range"
              min={4}
              max={60}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className="h-1 w-24 cursor-pointer accent-cyan-400"
              aria-label="Animation speed"
            />
            <span className="w-12 tabular-nums text-slate-500">{speed}/s</span>
          </label>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or drop a famous one
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setInput(p.value);
                  drop(p.value);
                }}
                title={p.note}
                className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left text-sm transition hover:border-cyan-400/60 hover:bg-slate-800"
              >
                <span className="font-mono font-semibold text-cyan-200 group-hover:text-cyan-100">{p.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Tip: hover a number to see why it is famous. The smallest ones often fall the hardest.
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
              <p>Take any whole number. Then, over and over:</p>
              <ul className="ml-1 space-y-1.5">
                <li><span className="text-cyan-300">even</span> → divide it by 2.</li>
                <li><span className="text-fuchsia-300">odd</span> → multiply by 3 and add 1.</li>
              </ul>
              <p className="text-slate-400">
                The odd step is the troublemaker: it makes the number jump up. The even step always pulls it
                back down. The conjecture is that the pulling-down always, eventually, wins, no matter where you
                start. The chart above is on a logarithmic scale, so each gridline up is roughly ten times
                taller, which is the only way to fit the wild peaks and the long falls in the same picture.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-cyan-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            You just watched a number you chose survive a fall that nobody can guarantee. That is the strange
            heart of this toy. There is overwhelming evidence the conjecture is true: every number anyone has
            ever fed in, billions of billions of them, all the way past 2 to the 68th power, has come home to 1.
            And there is, after almost ninety years, not one shred of proof that it must.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            That gap, between <span className="text-slate-100">true</span> and{' '}
            <span className="text-slate-100">proven</span>, is the thing I want you to feel. We live most of our
            lives in it. You are almost certainly safe on the next drive; nobody can prove it. The bridge will
            almost certainly hold; the proof is statistics, not certainty. Mathematics is the one place that
            promised to close the gap completely, and here is a rule a ten-year-old can follow that the whole
            field still cannot.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            So when your number clawed upward and you wondered, just for a second, whether this would be the one
            that escapes to infinity and breaks the pattern forever, that flicker of doubt was the honest
            response. <span className="text-slate-100">Not knowing is not the same as it not being true.</span>{' '}
            It just means we are not finished looking.
          </p>
        </div>

        {/* History */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            The German mathematician Lothar Collatz wrote the problem down in 1937, and it has collected names
            ever since: the 3n+1 problem, the Ulam conjecture, the hailstone problem, the Syracuse problem. Paul
            Erdos, one of the most prolific mathematicians who ever lived, said{' '}
            <em>mathematics is not yet ready for such problems</em> and offered 500 dollars for a proof; the
            money has never been claimed. In 2019 Terence Tao proved that <em>almost all</em> starting numbers
            eventually drop below their starting point, the strongest result so far, and a careful reminder that
            almost all is not all. Computers have now verified every number up to roughly 2 to the 68th power.
            Each one falls. The conjecture remains open. It is, in the words of more than one mathematician, the
            simplest impossible problem in the world.
          </p>
        </div>

        {/* Share + back */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {copied ? '✓ Copied' : 'Copy what your number did'}
          </button>
          <button
            onClick={() => drop(input || '27')}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Drop it again
          </button>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <a
            href="/experiments"
            className="text-sm text-slate-400 underline-offset-4 hover:text-cyan-300 hover:underline"
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
