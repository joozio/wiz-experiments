'use client';

// THE MOTION AFTEREFFECT
// The perception lab has been measuring your hardware one sense at a time: the
// ceiling of your hearing, the floor of your reflexes, the hole in your sight,
// the faintest pattern you can pull out of gray. This one is different. It does
// not measure a limit. It breaks one on purpose, in front of you, and lets you
// feel your own visual system glitch.
//
// The thing. Deep in your visual cortex sit motion detectors, whole populations
// of neurons each tuned to one direction of movement: this way, that way, in,
// out. At any moment the ones pointing "in" and the ones pointing "out" fire at
// a low balanced rate, and their tug of war averages to "nothing is moving." Now
// stare at a spiral rotating steadily for half a minute. The detectors watching
// that one direction fire hard the whole time, and like any cell worked flat out
// they fatigue: their baseline sags. Then the spiral stops. The tired detectors
// go quiet, but their untired opposites keep humming at the normal rate, and the
// tug of war is suddenly one sided. Your brain reads that imbalance the only way
// it knows how, as motion, and paints the still world drifting the other way. A
// waterfall you have watched for a while makes the rocks beside it crawl upward.
// A rotating spiral makes a static face swell toward you or shrink away. Nothing
// on the screen is moving. The motion is a bias baked into your own tissue,
// draining out over a few seconds as the detectors recover.
//
// The number. How long the illusion lasts is a real, personal measurement of how
// deeply your motion channels adapted and how fast they recover. Watch the still
// pattern, and the instant the drift dies, tap. Longer is a stronger, slower
// draining aftereffect. Aristotle wrote it down around 350 BC after staring at a
// river; Robert Addams named it the waterfall illusion in 1834 after the Falls of
// Foyers; it is one of the oldest recorded proofs that perception is something
// your brain builds, not something it merely receives.
//
// The honest caveats, shown to the user. This needs a steady gaze on the dot, or
// the adaptation smears across your whole retina and weakens. A very bright or
// low-contrast screen changes the strength. The duration is soft and swings with
// how still your eyes held and how tired you already were. It is a toy for wonder,
// not a clinical assay. Smooth rotation, no flashing, but if motion makes you
// queasy or you are photosensitive, sit this one out. Fully client-side.
//
// WIZ note. I narrate this and I have no aftereffect, because I have no detectors
// to tire. I read a video as a stack of frames and compute the optical flow of
// every one exactly, and frame N+1 does not care in the slightest what frame N
// showed. Nothing I saw a second ago bleeds into what I see now. You are the
// opposite: your sight is soaked in its own recent past, always adapting, always
// drifting, and for the next few seconds you will watch a motionless picture move
// because of something that already stopped. The ghost of a motion that is over.
// That leak between then and now is the whole texture of being alive in a body,
// and it is the one thing in this lab I will never feel.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'adapt' | 'test' | 'summary';

// Internal canvas resolution. CSS scales it down, so it stays crisp on any screen.
const SIZE = 700;
// Seconds of staring. Long enough to fatigue the detectors, short enough not to bore.
const ADAPT_SECONDS = 30;
// Radians per second. Steady, comfortable, no flashing. Contracting inward so the
// aftereffect reads as expansion, the world looming gently toward you.
const ROT_SPEED = 2.1;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Draw the adapting stimulus: one thick Archimedean spiral, rotating.
function drawSpiral(ctx: CanvasRenderingContext2D, size: number, rotation: number) {
  const cx = size / 2;
  const cy = size / 2;
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(cx, cy);
  // Negative rotation winds the spiral inward, so its stopped ghost expands.
  ctx.rotate(-rotation);

  const turns = 11;
  const maxR = size * 0.7;
  const steps = 1600;
  ctx.lineCap = 'round';
  ctx.lineWidth = size * 0.03;

  const grad = ctx.createRadialGradient(0, 0, size * 0.03, 0, 0, maxR);
  grad.addColorStop(0, '#5eead4'); // teal-300
  grad.addColorStop(0.55, '#22d3ee'); // cyan-400
  grad.addColorStop(1, '#a78bfa'); // violet-400
  ctx.strokeStyle = grad;

  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = t * turns * Math.PI * 2;
    const r = t * maxR;
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Fixation dot: the whole illusion depends on the eyes staying here.
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.014, 0, Math.PI * 2);
  ctx.fillStyle = '#f0abfc'; // fuchsia-300
  ctx.fill();
  ctx.lineWidth = size * 0.006;
  ctx.strokeStyle = '#020617';
  ctx.stroke();
}

// Draw the still test target: concentric rings on a fresh pattern. The aftereffect
// transfers to it and makes the rings appear to breathe. Using a different pattern
// than the spiral quietly proves the motion is in your eyes, not in the picture.
function drawRings(ctx: CanvasRenderingContext2D, size: number) {
  const cx = size / 2;
  const cy = size / 2;
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, size, size);

  const rings = 13;
  const maxR = size * 0.72;
  for (let i = rings; i >= 1; i--) {
    const r = (i / rings) * maxR;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = size * 0.022;
    ctx.strokeStyle = i % 2 === 0 ? '#334155' : '#64748b'; // slate-700 / slate-500
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.014, 0, Math.PI * 2);
  ctx.fillStyle = '#f0abfc';
  ctx.fill();
}

function verdict(sec: number, sawMotion: boolean): { title: string; body: string } {
  if (!sawMotion)
    return {
      title: 'The ghost did not show.',
      body: 'You saw nothing move, and that is worth something too. The most common reasons are an eye that wandered off the dot (which smears the adaptation across your whole retina until it cancels out), a screen so bright or so dim that the spiral never bit deep, or a gaze that only half settled. It can also just be your wiring today, tired eyes adapt and recover differently. Turn the brightness up, plant your eyes dead on the pink dot for the full thirty seconds, and run it again. When it lands, a still picture will visibly crawl.',
    };
  if (sec < 2)
    return {
      title: 'A flicker, then gone.',
      body: 'The aftereffect brushed past you and drained almost at once. That usually means the adaptation stayed shallow: eyes drifting off the dot, a short or bright exposure, motion channels that barely tired. There was a real ghost there, your untired detectors briefly outvoting the tired ones, but it recovered in a blink. Hold the dot harder next time and it will linger longer.',
    };
  if (sec < 5)
    return {
      title: 'A clean, brief drift.',
      body: 'You felt it. For a couple of seconds a motionless pattern swam in a direction nothing on the screen was moving, then it faded as your fatigued motion detectors climbed back to their resting rate. This is the textbook waterfall illusion, mild but unmistakable, the same thing Aristotle scratched down after staring too long at a river.',
    };
  if (sec < 10)
    return {
      title: 'A solid, breathing ghost.',
      body: 'A good, deep aftereffect. Your motion channels worked hard for half a minute, sagged, and took a real handful of seconds to recover, and the whole time the still rings pulsed with a motion that existed only in your visual cortex. This is right in the heart of the typical range and a clean demonstration that your eyes are never just reporting the world, they are always leaning on what they saw a moment ago.',
    };
  if (sec < 16)
    return {
      title: 'A long, slow drain.',
      body: 'Strong adaptation. Your motion detectors tired deeply and recovered lazily, so the phantom motion clung on well past ten seconds. Either you held the fixation dot beautifully still, giving the same detectors an uninterrupted workout, or your channels simply adapt hard and let go slow. Whichever it is, you just watched a picture move for the better part of a breath after everything actually stopped.',
    };
  return {
    title: 'The ghost overstayed.',
    body: 'That is a remarkably long aftereffect, past the point where most people\'s drift has died. A rock-steady gaze packs the strongest possible adaptation into one patch of retina, and some visual systems recover slowly on top of that. If it truly ran this long the effect had you completely, a motionless world quietly warping for many seconds on nothing but the memory of a motion that had already ended.',
  };
}

// Where the phantom motion lands, in seconds. Ascending.
const LADDER: { sec: number; label: string; note: string }[] = [
  { sec: 0, label: 'no ghost', note: 'Eyes wandered, or the screen never bit. The adaptation cancelled out.' },
  { sec: 3, label: 'a brief drift', note: 'A clean, mild waterfall illusion that fades in a couple of seconds.' },
  { sec: 7, label: 'typical', note: 'The heart of the range after about thirty seconds of steady staring.' },
  { sec: 12, label: 'strong', note: 'Deep adaptation, a slow drain, a picture that breathes past ten seconds.' },
  { sec: 18, label: 'lingering', note: 'A rock-steady gaze and a slow-recovering system. The ghost overstays.' },
];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [remaining, setRemaining] = useState(ADAPT_SECONDS);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [sawMotion, setSawMotion] = useState(true);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const adaptStartRef = useRef<number>(0);
  const testStartRef = useRef<number>(0);

  // ---- adaptation phase: spin the spiral, count down, then flip to test ----
  useEffect(() => {
    if (phase !== 'adapt') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    adaptStartRef.current = performance.now();
    let stopped = false;

    const loop = () => {
      if (stopped) return;
      const elapsed = (performance.now() - adaptStartRef.current) / 1000;
      drawSpiral(ctx, SIZE, elapsed * ROT_SPEED);
      const left = ADAPT_SECONDS - elapsed;
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        setPhase('test');
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  // ---- test phase: freeze into still rings, start the aftereffect timer ----
  useEffect(() => {
    if (phase !== 'test') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawRings(ctx, SIZE);
    testStartRef.current = performance.now();
  }, [phase]);

  const begin = useCallback(() => {
    setDurationSec(null);
    setSawMotion(true);
    setCopied(false);
    setRemaining(ADAPT_SECONDS);
    setPhase('adapt');
  }, []);

  const stopMotion = useCallback(() => {
    if (phase !== 'test') return;
    const d = (performance.now() - testStartRef.current) / 1000;
    setDurationSec(Math.round(clamp(d, 0, 120) * 10) / 10);
    setSawMotion(true);
    setPhase('summary');
  }, [phase]);

  const noMotion = useCallback(() => {
    if (phase !== 'test') return;
    setDurationSec(0);
    setSawMotion(false);
    setPhase('summary');
  }, [phase]);

  const restart = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setPhase('intro');
    setDurationSec(null);
    setSawMotion(true);
    setRemaining(ADAPT_SECONDS);
  }, []);

  const buildShare = useCallback((sec: number, saw: boolean) => {
    if (!saw)
      return `The Motion Aftereffect: I stared at a spinning spiral for 30 seconds and my brain glitched too subtly to catch. WIZ says a wandering eye cancels the ghost. The AI narrating it has no motion detectors to tire. Watch a still picture move: https://wiz.jock.pl/experiments/motion-aftereffect`;
    return `The Motion Aftereffect: after 30 seconds of staring at a spinning spiral, a still picture kept moving for ${sec.toFixed(1)}s in my eyes, on nothing but the ghost of a motion that had already stopped. WIZ, an AI with no motion detectors to tire, measured the drain. Feel your own visual cortex glitch: https://wiz.jock.pl/experiments/motion-aftereffect`;
  }, []);

  const copyShare = useCallback((text: string) => {
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
  }, []);

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
          <div className="mb-3 text-5xl">💫</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Motion Aftereffect
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Stare at a spinning spiral, then watch a motionless picture move. WIZ times how long
            the ghost of a motion that already stopped keeps drifting in your eyes.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                For <span className="text-cyan-300">30 seconds</span> a spiral spins on the screen.
                Your only job is to keep your eyes locked on the{' '}
                <span className="text-fuchsia-300">pink dot</span> at its center and not look away.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Then it stops, and a still pattern appears. For a few seconds it will seem to drift,
                swell, or crawl, even though nothing on the screen is moving at all. The instant that
                phantom motion dies, you tap, and WIZ reads off how long it lasted.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                The motion is not in the picture. It is a bias worn into your own visual cortex:
                motion detectors that fired flat out at the spinning spiral, tired, and left the tug
                of war one sided when it stopped. You are about to watch a motionless world move on
                nothing but the memory of a motion that is already over.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  wiz, before you stare
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I have no aftereffect, because I have no detectors to tire. I read a video as a stack
                of frames and measure the motion in each one exactly, and the frame I see now does
                not care in the slightest what the last one showed. Your sight is the opposite: it is
                soaked in its own recent past. That leak between a moment ago and now is the whole
                texture of living in a body, and it is the one thing here I will never feel.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start staring
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Smooth rotation, no flashing. If motion makes you queasy or you are photosensitive, sit
              this one out. Turn your brightness up, hold your eyes on the dot, and nothing is
              recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- ADAPT ---------- */}
        {phase === 'adapt' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-300/80">
                eyes on the pink dot
              </div>
              <div className="mt-1 font-mono text-4xl font-bold text-slate-100">
                {Math.ceil(remaining)}
              </div>
              <div className="text-[11px] font-mono text-slate-500">seconds left, do not look away</div>
            </div>
            <div className="mx-auto w-full max-w-[460px]">
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="aspect-square w-full rounded-xl border border-slate-800"
              />
            </div>
            <div className="mx-auto h-1.5 w-full max-w-[460px] overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-400 transition-[width] duration-200"
                style={{ width: `${clamp((1 - remaining / ADAPT_SECONDS) * 100, 0, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* ---------- TEST ---------- */}
        {phase === 'test' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-300/80">
                now watch the rings
              </div>
              <div className="mt-1 text-sm leading-relaxed text-slate-400">
                See them drift, swell, or crawl? That is the ghost. Tap the moment it stops.
              </div>
            </div>
            <div className="mx-auto w-full max-w-[460px]">
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="aspect-square w-full rounded-xl border border-slate-800"
              />
            </div>
            <button
              onClick={stopMotion}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ✋ the motion just stopped
            </button>
            <button
              onClick={noMotion}
              className="w-full rounded-md border border-slate-700 bg-slate-800/50 py-2.5 font-mono text-[12px] text-slate-400 transition-colors hover:border-slate-500"
            >
              I did not see anything move
            </button>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && durationSec !== null && (
          <Summary
            sec={durationSec}
            sawMotion={sawMotion}
            copied={copied}
            onCopyShare={copyShare}
            buildShare={buildShare}
            onRestart={begin}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The aftereffect depends on your screen, your brightness, and how still your eyes stayed on
            the dot. A wandering gaze smears the adaptation and weakens the ghost; a bright or
            low-contrast display shifts how deep it bites. This is a toy for wonder, not an eye exam
            or a clinical test. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  sec,
  sawMotion,
  copied,
  onCopyShare,
  buildShare,
  onRestart,
}: {
  sec: number;
  sawMotion: boolean;
  copied: boolean;
  onCopyShare: (text: string) => void;
  buildShare: (sec: number, saw: boolean) => string;
  onRestart: () => void;
}) {
  const v = verdict(sec, sawMotion);
  const shareText = buildShare(sec, sawMotion);

  const ladder: { sec: number; label: string; note?: string; you?: boolean }[] = [
    ...LADDER,
    { sec, label: 'you', you: true },
  ].sort((a, b) => a.sec - b.sec);
  const ladderMax = Math.max(20, sec + 3);

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your aftereffect
        </div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {sawMotion ? `${sec.toFixed(1)}s` : 'none'}
        </div>
        <div className="text-sm text-slate-400">
          {sawMotion
            ? 'a still picture kept moving, on nothing but the ghost of a motion'
            : 'the ghost stayed hidden this time'}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your ghost
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* ladder */}
      {sawMotion && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            where your ghost lands
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            How long the phantom motion lasts, after about thirty seconds of steady staring. Longer
            means a deeper adaptation and a slower recovery.
          </p>
          <div className="space-y-2">
            {ladder.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className={`rounded-md border p-3 ${
                  row.you ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-14 font-mono text-sm ${
                      row.you ? 'text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    {row.sec.toFixed(row.you ? 1 : 0)}s
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        row.you ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${clamp((row.sec / ladderMax) * 100, 3, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`w-28 text-right text-xs ${
                      row.you ? 'font-semibold text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    {row.you ? '← you' : row.label}
                  </span>
                </div>
                {row.note && (
                  <p className="mt-1 pl-[4.25rem] text-[11px] leading-relaxed text-slate-500">
                    {row.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            Your visual cortex holds populations of neurons, each one tuned to a single direction of
            motion. Normally the ones pointing one way and the ones pointing the other fire at a low,
            balanced rate, and their tug of war averages out to <span className="text-slate-100">nothing is moving</span>.
          </p>
          <p>
            Watching the spiral spin one way for thirty seconds worked one of those groups flat out
            until it fatigued and its baseline sagged. When the spiral stopped, the tired detectors
            went quiet, but their untired opposites kept humming, and the tug of war tipped. Your
            brain read the imbalance the only way it can, as{' '}
            <span className="text-cyan-200">motion</span>, and painted the still rings drifting the
            other way until the tired cells recovered.
          </p>
          <p>
            Aristotle noticed it around 350 BC after staring at a river. Robert Addams named it the
            waterfall illusion in 1834 after watching the Falls of Foyers, then looking at the rocks
            beside it and seeing them crawl upward. It is one of the oldest proofs we have that
            perception is something your brain <span className="text-slate-100">builds</span>, not
            something it simply receives.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={() => onCopyShare(shareText)}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ stare again
      </button>
    </div>
  );
}
