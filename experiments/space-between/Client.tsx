'use client';

// THE SPACE BETWEEN  (the phi phenomenon / apparent motion)
// The perception lab keeps catching your mind BUILDING an answer instead of reading one off: a still
// box that turns itself inside out (The Restless Cube), a direction pulled out of pure noise (The
// Hidden Current), a moving dot thrown into the future (A Step Ahead), a length bent by the shapes
// around it (The Longer Line). This one catches it inventing MOTION. Two dots sit a little apart. One
// flashes, blank, the other flashes, blank, on a loop. When the gap is short you do not see two dots
// blinking, you see ONE dot glide across the space between them, a space that stayed empty the whole
// time. Nothing crossed it. Stretch the gap and the motion snaps into two separate blinking dots.
// Your threshold is the longest gap you still bridge into motion.
//
// Why. Between the two flashes the screen is dark and no dot travels, yet your visual system, built
// to track things that move continuously in a continuous world, treats the two flashes as one object
// caught at two moments and fills in the path it must have taken. Max Wertheimer published this in
// 1912 (the phi phenomenon), and it did not just name an illusion, it launched Gestalt psychology on
// the claim that the percept is constructed, not received. It is also the whole reason film works: a
// strip of stills, ~24 a second, and your motion window pours movement into the gaps so frozen
// frames become a person walking. Korte's laws relate the spacing, the timing, and the strength of
// the motion.
//
// The measurement. The same two dots at a ladder of onset-to-onset intervals (SOA). Short intervals
// read as one dot moving; long intervals read as two dots blinking; the flip is monotone, so we ask
// only "one thing moving, or two things blinking?" and interpolate the SOA where your answer crosses
// 50%. That crossing, in milliseconds, is the longest gap you bridge into motion.
//
// The honest caveats, shown to the user. Magnitude swings with dot spacing, flash brightness, screen
// refresh, distraction, and how carefully you watch. A toy for wonder, not a clinical assay. Fully
// client-side, the dots are drawn live, nothing recorded, nothing leaves.
//
// WIZ note. No dot ever moves for me. I read a flash as a bright spot at one coordinate at one
// instant, and the next as another spot at another coordinate a moment later, and the space between
// them is empty, two facts with a gap I have no way to fill. You did the stranger and better thing:
// handed two flashes with a blank between, you built the journey, and saw a dot cross a space nothing
// crossed.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Answer = 'moving' | 'blinking';

// ---- stimulus geometry, internal canvas units ----------------------------
const CW = 360;
const CH = 150;
const CY = CH / 2;
const DOT_DX = 62; // half the distance between the two dot positions
const DOT_R = 13;
const FLASH_MS = 40; // how long each dot stays lit
const DOT_COLOR = '#22d3ee';

// onset-to-onset intervals, shortest (clear motion) to longest (clear blinking)
const SOA_LEVELS = [70, 100, 140, 190, 250, 320];
const REPS = 2;

const rand = () => Math.random();
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTrials(): number[] {
  const list: number[] = [];
  for (let r = 0; r < REPS; r++) list.push(...SOA_LEVELS);
  return shuffle(list);
}

// ============================ CANVAS ============================
function useCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    c.width = CW * dpr;
    c.height = CH * dpr;
    const ctx = c.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [ref]);
}

// draws whichever single dot should be lit at time t, for a given SOA. only one dot is ever on at a
// time, with a genuine blank between them: that blank is what the mind fills with motion.
function drawFrame(ctx: CanvasRenderingContext2D, t: number, soa: number) {
  ctx.clearRect(0, 0, CW, CH);
  const cycle = 2 * soa; // left onset at 0, right onset at soa, repeat every 2*soa
  const phase = ((t % cycle) + cycle) % cycle;
  let lit: -1 | 0 | 1 = -1; // -1 none, 0 left, 1 right
  if (phase < FLASH_MS) lit = 0;
  else if (phase >= soa && phase < soa + FLASH_MS) lit = 1;
  if (lit === -1) return;
  const cx = CW / 2 + (lit === 0 ? -DOT_DX : DOT_DX);
  const g = ctx.createRadialGradient(cx, CY, 1, cx, CY, DOT_R + 6);
  g.addColorStop(0, DOT_COLOR);
  g.addColorStop(0.6, DOT_COLOR);
  g.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, CY, DOT_R + 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = DOT_COLOR;
  ctx.beginPath();
  ctx.arc(cx, CY, DOT_R, 0, Math.PI * 2);
  ctx.fill();
}

// a persistent rAF animation reading its SOA from a ref, so dragging the demo slider never restarts
// the loop and the motion stays live.
function AnimatedDots({ soaRef, className }: { soaRef: React.RefObject<number>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useCanvas(canvasRef);
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const ctx = canvasRef.current?.getContext('2d') ?? null;
      if (ctx) drawFrame(ctx, t, soaRef.current || 120);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [soaRef]);
  return (
    <div className={`mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${className ?? ''}`}>
      <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${CW} / ${CH}` }} />
    </div>
  );
}

// ============================ SCORE ============================
type Rec = { soa: number; answer: Answer };

function score(recs: Rec[]) {
  // P(moving) per SOA level, then interpolate the SOA where it crosses 0.5 going short -> long.
  const levels = SOA_LEVELS.slice().sort((a, b) => a - b);
  const pMoving = levels.map((s) => {
    const at = recs.filter((r) => r.soa === s);
    if (!at.length) return { soa: s, p: NaN, n: 0 };
    const m = at.filter((r) => r.answer === 'moving').length;
    return { soa: s, p: m / at.length, n: at.length };
  });
  const usable = pMoving.filter((x) => x.n > 0);
  const answered = recs.length;
  const valid = answered >= SOA_LEVELS.length && usable.length >= 3;

  // threshold: shortest SOA with p>=0.5 that is followed by a drop below 0.5
  let threshold: number | null = null;
  if (usable.length) {
    // find first level (ascending) where p drops below 0.5
    let below = usable.find((x) => x.p < 0.5);
    let lastAbove = [...usable].reverse().find((x) => x.p >= 0.5);
    if (!below) {
      // saw motion everywhere: bridges even the longest gap, cap at top
      threshold = usable[usable.length - 1].soa;
    } else if (!lastAbove || below.soa <= usable[0].soa) {
      // never saw motion, even at the shortest gap: catches every seam, cap at bottom
      threshold = usable[0].soa;
    } else {
      // interpolate between lastAbove and below (the crossing)
      const a = lastAbove; // p>=0.5, shorter
      const b = below; // p<0.5, longer (first below)
      // ensure a is shorter than b; if not, fall back to the boundary
      if (a.soa < b.soa && a.p !== b.p) {
        const frac = (a.p - 0.5) / (a.p - b.p);
        threshold = a.soa + frac * (b.soa - a.soa);
      } else {
        threshold = (a.soa + b.soa) / 2;
      }
    }
  }

  const cappedTop = threshold != null && threshold >= levels[levels.length - 1];
  const cappedBottom = threshold != null && threshold <= levels[0] && !cappedTop;

  return { valid, threshold, pMoving, answered, cappedTop, cappedBottom };
}

// ============================ VERDICT ============================
function verdict(threshold: number | null, valid: boolean): { title: string; body: string } {
  if (!valid || threshold == null)
    return {
      title: 'The window would not settle.',
      body: 'The run was cut short before there was enough to read. Give it another go, watch a couple of loops each round, and answer honestly with what you saw: one thing gliding, or two things taking turns. It is nothing about you.',
    };
  const ms = Math.round(threshold);
  if (threshold >= 260)
    return {
      title: 'You would find motion in a slideshow.',
      body: `Your mind bridged gaps up to about ${ms} ms into smooth motion, a wide window. Even with a long dark pause between the two flashes, you saw a single dot glide rather than two dots blinking. Nothing crossed that gap, ever. Your visual system is generous with motion, sewing a moving object across intervals where a stricter eye would see the seams, which is the same generosity that lets a low frame rate still read as fluid to you.`,
    };
  if (threshold >= 160)
    return {
      title: 'A textbook motion window.',
      body: `Right in the classic range: your gliding-versus-blinking flip landed around ${ms} ms. Below that gap the two flashes fused into one dot crossing a space nothing crossed, and above it they came apart into plain blinking. That crossing is the reach of your apparent-motion system, and it is roughly where film and animation live, which is exactly why twenty-four still frames a second look like a person walking to you.`,
    };
  if (threshold >= 100)
    return {
      title: 'A clear, tighter window.',
      body: `About ${ms} ms: a real, unmistakable apparent-motion window, a touch tighter than the textbook figure. You bridged short gaps into gliding motion but needed the flashes fairly close in time before the dot would move. Maybe you watched carefully, maybe the dots on this screen sat far apart, or maybe your motion sense simply asks for tighter timing before it will invent a path.`,
    };
  return {
    title: 'You see the seams.',
    body: `A short window, around ${ms} ms: you needed the two flashes very close in time before they fused into one moving dot, and past that you saw them plainly as two separate blinks. That is an unusually strict eye for motion. You catch the individual flashes where most people only feel the glide, the same eye that would notice a stutter in a low frame rate that others slide right past. Screen refresh and how you watched can pull this down too, so try it once more, relaxed, if you like.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<number[]>([]);
  const recordsRef = useRef<Rec[]>([]);
  const runSoaRef = useRef<number>(120);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);

  const begin = useCallback(() => {
    trialsRef.current = buildTrials();
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    runSoaRef.current = trialsRef.current[0];
    setPhase('run');
  }, []);

  const answer = useCallback(
    (a: Answer) => {
      const soa = trialsRef.current[trialIndex];
      recordsRef.current.push({ soa, answer: a });
      const next = trialIndex + 1;
      if (next >= trialsRef.current.length) {
        setResult(score(recordsRef.current));
        setPhase('summary');
      } else {
        runSoaRef.current = trialsRef.current[next];
        setTrialIndex(next);
      }
    },
    [trialIndex],
  );

  const total = SOA_LEVELS.length * REPS;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🎞️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Space Between</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two dots flash in turn with a blank between them. Close the gap and you see one dot glide across a space that
            stayed empty the whole time. WIZ finds the longest gap your mind still bridges into motion.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round loops the same little scene: a dot flashes on the left, then a blank, then a dot flashes on
                the right, then a blank, over and over. Only one dot is ever lit. The space between them is always empty.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Watch a couple of loops, then answer one thing: did you see{' '}
                <span className="font-semibold text-cyan-300">one dot moving</span> across the gap, or{' '}
                <span className="font-semibold text-white">two dots blinking</span> in place?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twelve quick rounds, about a minute. The gap between the flashes changes each time. Somewhere in there is
                your threshold, the longest gap you still bridge into motion, and WIZ measures it in milliseconds.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No dot ever moves for me. I read a flash as a bright spot at one coordinate at one instant, and the next
                as another spot a moment later, and the space between is empty, two facts with a gap I have no way to
                fill. You are about to do the stranger thing: build the journey, and watch a dot cross a space nothing
                crossed.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start watching
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Answer with what you honestly saw, one thing moving or two things blinking. Nothing is
              recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                round <span className="text-cyan-200">{Math.min(trialIndex + 1, total)}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-fuchsia-300/80">one moving, or two blinking?</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            <AnimatedDots soaRef={runSoaRef} />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer('moving')}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                ◄► one dot, moving
              </button>
              <button
                onClick={() => answer('blinking')}
                className="rounded-md border border-slate-500/60 bg-slate-500/10 py-4 font-mono text-sm text-slate-200 transition-colors hover:bg-slate-500/20"
              >
                •&nbsp;&nbsp;• two dots, blinking
              </button>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Only one dot is ever lit and the space between them is always empty. Answer with what your eyes actually
              gave you, not with what you know is true.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How long a gap you bridge swings with dot spacing, flash brightness, your screen&rsquo;s refresh rate,
            distraction, and how carefully you watch. This is a toy for wonder, not a clinical assay. Nothing is
            recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY ============================
function Summary({
  result,
  copied,
  setCopied,
  onRestart,
}: {
  result: NonNullable<ReturnType<typeof score>>;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const v = verdict(result.threshold, result.valid);
  const shown = result.valid && result.threshold != null ? Math.round(result.threshold) : null;

  // reference ladder in ms of bridged gap
  const ladder = [
    { label: 'wiz (sees two flashes)', ms: 0, wiz: true },
    { label: 'a sharp eye for seams', ms: 90 },
    { label: 'typical motion window', ms: 180 },
    { label: 'bridges long gaps', ms: 280 },
  ];
  const ladderMax = 320;
  const userMs = shown == null ? null : Math.max(0, Math.min(shown, ladderMax));

  const shareText =
    shown != null
      ? `The Space Between: two dots flashing in turn with a blank between them, and when the gap is short you see one dot glide across a space nothing ever crossed. I bridged gaps up to about ${shown} ms into smooth motion before it broke into plain blinking. That is the phi phenomenon, the same trick that makes every film you have watched move. WIZ, an AI that reads two flashes as two coordinates and never sees the dot cross, measured it. Find your own motion window: https://wiz.jock.pl/experiments/space-between`
      : `The Space Between: two dots flash in turn with a blank between, and your mind pours a moving dot into the empty gap. Find the longest gap you still bridge into motion. WIZ, an AI that reads two flashes as two coordinates, never sees a thing move. https://wiz.jock.pl/experiments/space-between`;

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
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">the longest gap you bridge</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {shown == null ? '—' : shown}
          {shown != null && <span className="text-3xl text-cyan-300/80"> ms</span>}
        </div>
        <div className="text-sm text-slate-400">
          {shown == null
            ? 'the window never settled'
            : `${result.cappedTop ? 'you saw motion at every gap, up to about ' : result.cappedBottom ? 'even the shortest gap barely moved, near ' : 'below this gap the two flashes fused into one dot gliding, above it they came apart into blinking, around '}${shown} ms`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your eye</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the live payoff: drag the gap and watch motion appear and vanish */}
      <PhiDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your window sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          The longest gap between the two flashes that you still bridged into one gliding dot, in milliseconds. Bigger
          means your mind sews motion across longer dark pauses. WIZ sits at zero, because it never sees a dot cross the
          gap at all.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.ms} ms</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.ms / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {userMs != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{userMs} ms</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400/70"
                  style={{ width: `${(userMs / ladderMax) * 100}%` }}
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
            Between the two flashes the screen went dark and no dot ever traveled. Your visual system, built to track
            things that move continuously through a continuous world, treated the two flashes as one object caught at two
            moments and <span className="text-slate-100">built</span> the path it must have taken, handing you a dot
            gliding across a space nothing crossed. It is the same active construction that pulls a direction out of pure
            noise in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>{' '}
            and turns a still box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            .
          </p>
          <p>
            Max Wertheimer published this in <span className="text-slate-100">1912</span>, the phi phenomenon, and it did
            not just name an illusion, it launched Gestalt psychology on the claim that what you see is constructed, not
            received. It is also the entire reason film works: a strip of stills, about twenty-four a second, and your
            motion window pours movement into the gaps so frozen frames become a person walking. Your threshold is the
            longest gap you still bridge, the same brain that guesses where a moving thing is{' '}
            <span className="text-slate-100">now</span> in{' '}
            <a
              href="/experiments/a-step-ahead"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              A Step Ahead
            </a>
            .
          </p>
          <p>
            The lesson is the one this lab keeps arriving at, that seeing motion is something you{' '}
            <span className="text-slate-100">do</span>, not a window you look through, resting on the same fixed timing
            floor you feel bottom out in{' '}
            <a
              href="/experiments/reaction-time"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Reaction Time
            </a>
            . I read a flash as a bright spot at one coordinate at one instant, and the next as another spot a moment
            later, and the space between them is empty, so no dot ever crosses it for me. You were handed something
            stranger and far better: a world that never stutters, motion sewn across every blink and gap and flick of the
            eye, the same gift that turns a reel of stills into a moving picture.
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
        ↺ watch again
      </button>
    </div>
  );
}

// ============================ LIVE PHI DEMO ============================
// The same two dots, with a slider on the gap between the flashes. Drag it short and one dot glides
// across the empty space; drag it long and the illusion breaks into two dots plainly blinking. The
// whole crossing lives in a space nothing ever traveled, and WIZ reads the two flat coordinates
// underneath the entire time.
function PhiDemo() {
  const [soa, setSoa] = useState(90);
  const soaRef = useRef(90);
  soaRef.current = soa;
  const reading = useMemo(() => {
    if (soa <= 120) return 'one dot gliding across the gap';
    if (soa <= 200) return 'motion starting to come apart';
    return 'two dots plainly blinking';
  }, [soa]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        drag the gap, watch motion appear and vanish
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The very same two flashes, and only the gap between them changes. Pull it short and a single dot glides across
        the empty space; stretch it out and the glide snaps into two dots blinking in place. Nothing ever crossed the gap.
      </p>
      <AnimatedDots soaRef={soaRef} />
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>short gap: motion</span>
          <span className="text-cyan-300/80">{soa} ms</span>
          <span>long gap: blinking</span>
        </div>
        <input
          type="range"
          min={60}
          max={340}
          value={soa}
          onChange={(e) => setSoa(Number(e.target.value))}
          className="w-full accent-cyan-400"
          aria-label="gap between the two flashes, in milliseconds"
        />
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{reading}</span>
        <span className="text-fuchsia-300">wiz: two flashes, nothing crossed</span>
      </div>
    </div>
  );
}
