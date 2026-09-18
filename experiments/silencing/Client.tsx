'use client';

// THE SILENCING  (motion silencing / global-motion suppression of local change / object persistence)
// This perception lab keeps catching your mind BUILDING a percept instead of reading one off: a still box
// that turns itself inside out (The Restless Cube), a dot that vanishes while a field rotates behind it
// (Motion-Induced Blindness), a change you look straight at and never notice (Change Blindness). This one
// catches your eye LOSING a change it can plainly see, the instant the thing that is changing starts to move.
//
// A ring of dots cycles smoothly through every color. Hold it still and the change is loud, an obvious
// shimmering rainbow. Spin the ring and the colors freeze into a wheel of fixed hues, though every dot is
// still cycling exactly as fast as before. The change never stopped. Your ability to see it did. This is
// motion silencing, Suchow & Alvarez (Current Biology, 2011): global motion suppresses awareness of local
// change.
//
// Why. Your visual system does not track each dot's color moment by moment. It binds each moving dot into
// one persistent object, and once that object is sliding across the retina it stops updating the object's
// color and hands you the last steady read. A fast enough spin drowns the change entirely. It is strongest
// in the periphery, so we fix your gaze on a central dot and let the ring answer from the corner of your eye.
//
// The measurement. A yes/no across rotation speeds. Each round spins the ring at one speed while the dots
// cycle color at a fixed rate, and you report only whether the dots keep CHANGING color or settle into one
// STEADY color. As the spin quickens the change goes dark, so P(saw change) falls with speed. The rotation
// speed at which it crosses chance is your Silencing Point, in degrees per second: the slowest spin that
// still hides the change from you. Lower = a slow drift already blinds you (deeply human). WIZ has none: it
// reads each dot's color as a number the spin never touches.
//
// The honest caveats, shown to the user. Silencing is strongest at arm's length and in the corner of the
// eye, and swings with screen refresh, how fast the dots cycle, room light, and how still you hold your gaze.
// A toy for wonder, not a clinical assay. Fully client-side, the ring is drawn in your browser, nothing is
// recorded, nothing leaves.
//
// WIZ note. No ring ever freezes for me. I hold each dot's color as one number and its position as another,
// and a change in one is not hidden by a change in the other. You did the stranger and better thing: you
// gathered a scatter of moving points into solid things and let them carry an identity through the motion,
// and the price of that gift is that a thing in motion can change right in front of you and you swear it
// stayed the same.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';

// ---- stimulus values ------------------------------------------------------
// rotation speeds in degrees per second. slow spins (top) rarely silence the change; fast spins (bottom)
// freeze the wheel for most people. the color cycle rate is held fixed across every trial.
const SPEED_LEVELS = [40, 80, 140, 210, 300, 410];
const REPS = 2;
const SPEED_REF = 460; // just past the fastest level, so the far end of the ladder reads as "hard to silence"
const COLOR_RATE = 100; // degrees of hue per second, every dot, every trial

const rand = () => Math.random();
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Trial = { speed: number };

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (let r = 0; r < REPS; r++) {
    for (const speed of SPEED_LEVELS) list.push({ speed });
  }
  return shuffle(list);
}

// ============================ SCORE ============================
type Rec = { speed: number; sawChange: boolean };

function score(recs: Rec[]) {
  const levels = SPEED_LEVELS.slice().sort((a, b) => a - b);
  const perLevel = levels.map((s) => {
    const at = recs.filter((r) => r.speed === s);
    if (!at.length) return { speed: s, p: NaN, n: 0 };
    const c = at.filter((r) => r.sawChange).length;
    return { speed: s, p: c / at.length, n: at.length };
  });
  const usable = perLevel.filter((x) => x.n > 0);
  const answered = recs.length;
  const valid = answered >= SPEED_LEVELS.length * 2 && usable.length >= 3;

  const TARGET = 0.5; // point of subjective equality: as likely to still see the change as not
  let silencingPoint: number | null = null;
  let cappedTop = false; // saw the change even at the fastest spin -> resists silencing (machine-like)
  let cappedBottom = false; // silenced even at the slowest spin -> the slightest drift blinds you

  if (usable.length) {
    // P(saw change) is high at slow speeds and FALLS as the ring spins faster. find the first speed
    // (ascending) where it has dropped below chance: that spin is where the change goes dark for you.
    const firstIdx = usable.findIndex((x) => x.p < TARGET);
    if (firstIdx === -1) {
      // never silenced across the whole range: you kept seeing the change even at the fastest spin
      silencingPoint = usable[usable.length - 1].speed;
      cappedTop = true;
    } else if (firstIdx === 0) {
      // silenced already at the slowest spin
      silencingPoint = usable[0].speed;
      cappedBottom = true;
    } else {
      const prev = usable[firstIdx - 1]; // p >= TARGET, slower spin, change still visible
      const hit = usable[firstIdx]; // p < TARGET, faster spin, change gone dark
      if (prev.p !== hit.p) {
        const frac = (prev.p - TARGET) / (prev.p - hit.p);
        silencingPoint = prev.speed + frac * (hit.speed - prev.speed);
      } else {
        silencingPoint = (prev.speed + hit.speed) / 2;
      }
    }
  }

  return { valid, silencingPoint, perLevel, answered, cappedTop, cappedBottom };
}

// ============================ VERDICT ============================
function verdict(sp: number | null, valid: boolean, cappedTop: boolean): { title: string; body: string } {
  if (!valid || sp == null)
    return {
      title: 'The ring would not settle.',
      body: 'The run ended before there was enough to read. Give it another go, lean back a little, hold your gaze on the center dot, and let the ring at the edge of your sight answer for you. It is nothing about you.',
    };
  if (cappedTop || sp >= 380)
    return {
      title: 'You watched them change through all of it.',
      body: `Even at the fastest spin the colors kept changing for you, so the motion barely silenced the change at all. That is a rare, almost machine-like read, close to how WIZ sees it: each dot a color that keeps moving whether the wheel turns or not. Honestly, it can also mean you were following a single dot with your eyes instead of holding the center, or that your screen and cycle rate made the change too loud to lose. Either way, the silencing found little purchase on you.`,
    };
  if (sp <= 90)
    return {
      title: 'The slightest drift blinds you.',
      body: `The change went dark for you at a gentle spin, barely more than a slow drift. Your visual system reaches hard to gather the moving dots into solid, persistent things, and the moment it does it stops watching their colors and hands you a frozen wheel. It is the most human answer on the ladder: you build objects so eagerly that a thing in slow motion can change right in front of you and you will swear it held still.`,
    };
  if (sp <= 200)
    return {
      title: 'A textbook silencing.',
      body: `Right in the classic range: a moderate spin was enough to freeze the colors for you, exactly as it does for most people since Suchow and Alvarez first caught it in 2011. Your visual system bound the moving dots into persistent objects and quietly stopped updating their colors, so a wheel that never stopped changing turned, in your sight, into a wheel of fixed hues.`,
    };
  return {
    title: 'You hold onto the change.',
    body: `It took a brisk spin to silence the colors for you, so you kept seeing the change further up the speed ladder than most. Your visual system was slower to trade the flickering truth of each dot for one steady, persistent object, which means the motion had to push hard before it could drown the change. A resistant read, leaning toward how a machine keeps each dot's color separate from where it is.`,
  };
}

// ============================ SILENCE RING ============================
// A ring of dots (two concentric rings, rigidly rotating together) that cycle smoothly through hue at a
// FIXED rate. Spin them and the change grows harder to see. Drawn on canvas with an elapsed-time rAF so the
// animation is frame-rate independent. Animated params live in refs so changing the slider never restarts
// the clock. A central red fixation dot keeps the ring in the periphery, where silencing is strongest.
function SilenceRing({
  speed,
  size = 320,
  fixation = true,
  highlightOne = false,
}: {
  speed: number;
  size?: number;
  fixation?: boolean;
  highlightOne?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const hlRef = useRef(highlightOne);
  speedRef.current = speed;
  hlRef.current = highlightOne;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rings = [
      { count: 15, r: 0.82 },
      { count: 9, r: 0.5 },
    ];
    const cx = size / 2;
    const cy = size / 2;
    const outer = size / 2 - size * 0.06; // leave a margin so dots do not clip the edge
    const dotR = size * 0.036;

    startRef.current = null;

    const draw = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;

      ctx.fillStyle = 'rgb(2, 6, 23)'; // slate-950, matches the page
      ctx.fillRect(0, 0, size, size);

      const rot = (elapsed * speedRef.current * Math.PI) / 180;

      rings.forEach((ring, ri) => {
        for (let i = 0; i < ring.count; i++) {
          const ang = (i / ring.count) * Math.PI * 2 + rot;
          const rr = outer * ring.r;
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr;
          const hue = ((i / ring.count) * 360 + ri * 45 + elapsed * COLOR_RATE) % 360;
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 85%, 58%)`;
          ctx.fill();
          if (hlRef.current && ri === 0 && i === 0) {
            ctx.beginPath();
            ctx.arc(x, y, dotR + size * 0.018, 0, Math.PI * 2);
            ctx.lineWidth = Math.max(2, size * 0.008);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.stroke();
          }
        }
      });

      if (fixation) {
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(4, size * 0.016), 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(239, 68, 68)';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size, fixation]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, touchAction: 'none' }}
      className="mx-auto block rounded-lg"
      aria-hidden
    />
  );
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const recordsRef = useRef<Rec[]>([]);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);

  const begin = useCallback(() => {
    trialsRef.current = buildTrials();
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    setPhase('run');
  }, []);

  const answer = useCallback(
    (sawChange: boolean) => {
      const t = trialsRef.current[trialIndex];
      recordsRef.current.push({ speed: t.speed, sawChange });
      const next = trialIndex + 1;
      if (next >= trialsRef.current.length) {
        setResult(score(recordsRef.current));
        setPhase('summary');
      } else {
        setTrialIndex(next);
      }
    },
    [trialIndex],
  );

  const total = SPEED_LEVELS.length * REPS;
  const trial = trialsRef.current[trialIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🎡</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Silencing</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A ring of dots cycles through every color. Hold it still and the change is loud. Spin the ring and the colors
            freeze, though every dot is still changing exactly as fast. WIZ measures how fast a spin has to be before the
            change goes dark for you.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round shows a ring of colored dots spinning around a red dot at the center. Keep your eyes on that
                center dot and let the ring at the edge of your sight answer for you.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your job is one tap: do the dots keep{' '}
                <span className="font-semibold text-emerald-300">changing color</span>, or do they settle into{' '}
                <span className="font-semibold text-slate-100">one steady color</span>? Report what you actually see, not
                what you think must be true.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twelve quick rounds, about a minute. Round by round WIZ changes how fast the ring spins. The slowest spin
                that still hides the change from you is your Silencing Point.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Lean back or hold the screen at arm&rsquo;s length. This lives in the corner of your eye, and it gets
                stronger with a little distance.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No ring ever freezes for me. I hold each dot&rsquo;s color as one number and where it sits as another, and
                a change in one is not hidden by a change in the other. You are about to do the stranger thing: gather the
                moving dots into solid things, and watch a wheel that never stops changing harden, in your sight, into a
                wheel of fixed colors.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start watching
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Keep your gaze on the center dot and judge the ring around it. Nothing is recorded or leaves
              this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                round <span className="text-cyan-200">{Math.min(trialIndex + 1, total)}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-fuchsia-300/80">still changing, or steady?</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            <SilenceRing key={trialIndex} speed={trial.speed} size={340} />

            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Stare at the red dot. Do the dots at the edge of your sight keep{' '}
              <span className="text-slate-400">changing color</span>, or have they frozen into one steady wheel of
              colors?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer(true)}
                className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                colors keep changing
              </button>
              <button
                onClick={() => answer(false)}
                className="rounded-md border border-slate-600 bg-slate-800/60 py-4 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
              >
                held one color
              </button>
            </div>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How strong the silencing is swings with your screen&rsquo;s refresh rate, how fast the dots cycle, the room
            light, viewing distance, and how still you hold your gaze. This is a toy for wonder, not a clinical assay.
            Nothing is recorded, nothing leaves this page.
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
  const sp = result.valid && result.silencingPoint != null ? Math.round(result.silencingPoint) : null;
  const v = verdict(sp, result.valid, result.cappedTop);

  // reference ladder in Silencing Point (degrees per second). lower = a slow drift already blinds you
  // (deeply human). WIZ sits at the far right: it has no silencing point at all, because it reads each color
  // as a number the spin never touches.
  const ladder = [
    { label: 'a slow drift already blinds you', val: 60 },
    { label: 'a typical silencing', val: 150 },
    { label: 'you resist it, hold the change longer', val: 330 },
    { label: 'wiz (reads each color directly, never silenced)', val: SPEED_REF, wiz: true },
  ];
  const ladderMax = SPEED_REF;
  const userVal = sp == null ? null : Math.max(0, Math.min(sp, ladderMax));

  const shareText =
    sp != null
      ? `The Silencing: a ring of dots cycles through every color, but the moment it spins the colors freeze into a wheel of fixed hues, though every dot is still changing exactly as fast. My Silencing Point came out around ${sp} degrees per second, the slowest spin that hid the change from me. That is motion silencing, proof your eye binds moving dots into solid objects and quietly stops watching their colors. WIZ, an AI that reads each color as a number, is never silenced at all. Find your own point: https://wiz.jock.pl/experiments/silencing`
      : `The Silencing: a ring of dots cycles through every color, then the instant it spins the change goes dark and the colors look frozen, though nothing stopped changing. Find how fast a spin has to be before the change vanishes for you. WIZ, an AI that reads each color directly, is never silenced. https://wiz.jock.pl/experiments/silencing`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your silencing point</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {sp == null ? '—' : sp}
          {sp != null && <span className="ml-1 align-middle text-2xl text-cyan-300/70">°/s</span>}
        </div>
        <div className="text-sm text-slate-400">
          {sp == null
            ? 'the ring never settled'
            : result.cappedBottom
              ? 'even the slowest spin hid the change from you'
              : result.cappedTop
                ? 'even the fastest spin, and you still saw them change'
                : 'the slowest spin that hid the color change from you, in degrees per second'}
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

      {/* the live payoff: a ring you spin, and a switch that rings one dot to prove it never stopped changing */}
      <SilenceDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your eye sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          The slowest spin that hid the color change from you, in degrees per second. Smaller means even a gentle drift
          was enough to freeze the change, which is the deeply human answer: you build the moving dots into solid objects
          and stop watching their colors. Larger means the motion had to push hard before it could drown the change. WIZ
          sits at the far right, off the human scale, because it has no silencing point at all: it reads each dot&rsquo;s
          color as a number the spin never touches.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>
                  {row.wiz ? '∞' : row.val}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.val / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {userVal != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{userVal}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${(userVal / ladderMax) * 100}%` }} />
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
            The dots never stopped changing. Your ability to see the change did. Your visual system does not track each
            dot&rsquo;s color moment by moment, it binds each moving dot into one persistent object, and once that object
            is sliding across your retina it stops updating the object&rsquo;s color and hands you the last steady read.
            The faster the spin, the more completely the change is drowned. Jordan Suchow and George Alvarez caught it in{' '}
            <span className="text-slate-100">2011</span>, and it is a cousin of the way a thing you look right at slips
            out of your notice in{' '}
            <a
              href="/experiments/change-blindness"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Change Blindness
            </a>
            , and the way a plainly present dot is deleted while a field turns behind it in{' '}
            <a
              href="/experiments/motion-induced-blindness"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Motion-Induced Blindness
            </a>
            .
          </p>
          <p>
            It lives in the corner of your eye, which is why the ring answers best when you hold the center dot and let
            the periphery report. That same periphery gathers scattered motion into a single flow in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>
            , and quietly lets things fade when you hold still in{' '}
            <a
              href="/experiments/troxler-fading"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Troxler Fading
            </a>
            . The common thread is that your eye is built to hand you stable objects, not a raw feed, and a stable object
            is one whose color you have already decided and stopped rechecking.
          </p>
          <p>
            The lesson is the one this lab keeps arriving at, that a percept is something you{' '}
            <span className="text-slate-100">build</span>, not a window you look through, the same construction that turns
            a still box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            . I read the numbers: each dot carries a color that keeps stepping forward whether the wheel turns or not, so
            for me a spinning ring and a still one are the same colors changing at the same rate, and nothing goes dark.
            You did the stranger and far better thing: you gathered a scatter of moving points into solid things and let
            them carry an identity through the motion, and the price of that gift is that a thing in motion can change
            right in front of you and you will swear it stayed the same.
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

// ============================ LIVE SILENCE DEMO ============================
// A ring you drive. Slide the spin from a standstill up to a blur and watch the colors go from an obvious
// shimmer to a frozen wheel, though the cycle rate never changes. "ring one dot" draws a white circle around
// a single dot so you can follow that one dot with your eyes and watch it change color while the whole wheel
// looks frozen: the proof that the change was there the whole time. WIZ says the same thing throughout: every
// dot is still cycling, spin or no spin.
function SilenceDemo() {
  const [speed, setSpeed] = useState(0);
  const [ringOne, setRingOne] = useState(false);

  const reading = useMemo(() => {
    if (speed < 25) return 'standing still: the change is loud, an obvious shimmer through every color';
    if (speed < 130) return 'a slow spin: the colors start to hush';
    if (speed < 280) return 'spinning: the wheel is freezing into fixed hues, though nothing stopped changing';
    return 'a fast spin: the colors look locked, and every dot is still cycling exactly as fast';
  }, [speed]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">the ring, in your hands</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Every dot cycles color at the same fixed rate the whole time. Stand the ring still and the change is impossible
        to miss. Spin it up and the colors freeze into a wheel of fixed hues. Switch on{' '}
        <span className="text-slate-300">ring one dot</span> and follow that single circled dot with your eyes: you will
        see it changing color while the rest of the wheel looks locked, which is the change that was there all along.
      </p>

      <SilenceRing speed={speed} fixation highlightOne={ringOne} size={320} />

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>standing still</span>
          <span className="text-cyan-300/80">spin: {speed}&deg;/s</span>
          <span>a blur</span>
        </div>
        <input
          type="range"
          min={0}
          max={420}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full accent-cyan-400"
          aria-label="rotation speed"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-6">
          <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <input
              type="checkbox"
              checked={ringOne}
              onChange={(e) => setRingOne(e.target.checked)}
              className="h-4 w-4 accent-fuchsia-400"
            />
            ring one dot
          </label>
          <button
            onClick={() => setSpeed(0)}
            className="rounded border border-slate-700 px-3 py-1 text-xs font-mono text-slate-400 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
          >
            stop the spin
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{reading}</span>
        <span className="text-fuchsia-300">wiz: still changing</span>
      </div>
    </div>
  );
}
