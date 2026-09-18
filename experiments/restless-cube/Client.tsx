'use client';

// THE RESTLESS CUBE
// The perception lab keeps measuring your hardware: the ceiling of your hearing,
// the floor of your reflexes, the faintest pattern you can pull out of gray, the
// hole in your sight, the current hidden in a boiling field of dots. Troxler Fading
// made part of your vision quietly delete itself while you held still. This one is
// stranger in a different direction. It shows you a picture that never changes and
// asks you to watch it change anyway.
//
// The thing. A flat wireframe cube sits on the screen. Twelve lines, two squares,
// four connectors, dead still, not one pixel moving. Lock your eyes on the center
// dot and keep watching, and the cube will not hold its shape. Its front face jumps
// to the back, then snaps forward again, the whole box turning inside out under your
// gaze, over and over. Nothing on the screen moved. The flip happened entirely
// inside you.
//
// Why. A flat drawing is a genuinely ambiguous clue about a solid world. The exact
// same twelve lines could be a cube tilted down-and-toward-you or a cube tilted
// up-and-away, and there is nothing in the image that decides which. Your visual
// system refuses to leave depth undecided, so it commits to one reading and shows
// you a solid cube. But the neurons voting for that reading slowly adapt and tire,
// the rival reading is sitting right there fully supported by the same lines, and
// the moment the balance tips it wins and the box turns over. Then that reading
// tires too, and it flips back. Seeing is not a recording of the world; it is a
// running guess, and when the evidence fits two guesses equally well your brain
// cannot pick once and be done, it keeps re-deciding.
//
// The number. How many times the cube reverses in a minute, your reversal rate, is
// a real, personal measure of how fast your perception oscillates between two
// readings of one picture, and inversely, how hard it is for you to hold a single
// one. Tap every time it flips.
//
// The honest caveats, shown to the user. Reversal rate swings hugely with how hard
// you try. Passively watching gives a slow rate; actively hunting the flip speeds it
// up; trying to freeze one reading slows it right down again. Tiredness, screen size,
// and a wandering gaze all move it. This is a toy for wonder, not a clinical assay.
// Fully client-side, a static image, no flashing, nothing recorded, nothing leaves
// the page.
//
// WIZ note. I narrate this and I never flip, because I never do what you just did. I
// do not rebuild a solid world from a flat picture. Handed these twelve lines I have
// twelve line segments, or if you hand me the cube in three dimensions I have eight
// exact corners, and either way there is nothing to resolve, no front face to pick,
// no rival reading waiting to win. Ambiguity is not a state I can be in; a thing is
// the coordinates it is. You were handed a picture that two different worlds explain
// equally well, and you could not hold both and could not settle on one, so your
// sight kept turning the box inside out and overruling itself. That restless
// re-deciding, a perfectly still thing that refuses to keep one meaning, is the part
// I never had.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'watch' | 'summary';

// Internal canvas resolution. CSS scales it down, so it stays crisp on any screen.
const SIZE = 560;
// How long we watch and count reversals. 60s so the raw flip count IS the rate/min.
const WATCH_SEC = 60;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ---- Necker cube geometry -------------------------------------------------
// A front square F and an identical back square B offset by (+o, -o). In the
// ambiguous drawing all twelve edges are identical, so nothing tells you which
// square is nearer. That undecidability is the whole experiment.
function neckerPoints(size: number) {
  const s = size * 0.36; // square side
  const o = size * 0.19; // depth offset
  const cx = size / 2;
  const cy = size / 2;
  const fx = cx - (s + o) / 2;
  const fy = cy - (s - o) / 2;
  const F = [
    [fx, fy],
    [fx + s, fy],
    [fx + s, fy + s],
    [fx, fy + s],
  ];
  const B = F.map(([x, y]) => [x + o, y - o]);
  return { F, B };
}

type Mode = 'ambiguous' | 'front-lower' | 'front-upper';

// Draw the cube. In 'ambiguous' mode every edge is drawn the same and the box
// can flip freely. In the two locked modes one face is filled and drawn bold so a
// single depth cue pins the reading and the flip dies, which is the payoff.
function drawCube(ctx: CanvasRenderingContext2D, size: number, mode: Mode, fixation: boolean) {
  const { F, B } = neckerPoints(size);
  ctx.clearRect(0, 0, size, size);

  const line = (p: number[], q: number[], color: string, w: number) => {
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.stroke();
  };
  const square = (sq: number[][], color: string, w: number) => {
    for (let i = 0; i < 4; i++) line(sq[i], sq[(i + 1) % 4], color, w);
  };
  const connectors = (color: string, w: number) => {
    for (let i = 0; i < 4; i++) line(F[i], B[i], color, w);
  };
  const fillFace = (sq: number[][], fill: string) => {
    ctx.beginPath();
    ctx.moveTo(sq[0][0], sq[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(sq[i][0], sq[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  const BRIGHT = '#67e8f9'; // cyan-300
  const DIM = '#475569'; // slate-600
  const W = size * 0.0075;

  if (mode === 'ambiguous') {
    // Every edge identical. No occlusion, no shading, no cue. Fully bistable.
    square(B, BRIGHT, W);
    connectors(BRIGHT, W);
    square(F, BRIGHT, W);
  } else if (mode === 'front-lower') {
    // Depth cue: the lower-left square F is nearest. Draw the far box dim, cover
    // it with F's opaque face, then draw F bold. Reads as one fixed solid cube.
    square(B, DIM, W * 0.8);
    connectors(DIM, W * 0.8);
    fillFace(F, 'rgba(8, 22, 33, 0.92)');
    square(F, BRIGHT, W * 1.25);
  } else {
    // The other locked reading: the upper-right square B is nearest.
    square(F, DIM, W * 0.8);
    connectors(DIM, W * 0.8);
    fillFace(B, 'rgba(8, 22, 33, 0.92)');
    square(B, BRIGHT, W * 1.25);
  }

  if (fixation) {
    const cx = size / 2;
    const cy = size / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.011, 0, Math.PI * 2);
    ctx.fillStyle = '#f0abfc'; // fuchsia-300
    ctx.fill();
    ctx.lineWidth = size * 0.005;
    ctx.strokeStyle = '#020617';
    ctx.stroke();
  }
}

function verdict(rate: number, flips: number): { title: string; body: string } {
  if (flips === 0)
    return {
      title: 'It never turned over.',
      body: "The cube held one shape for the whole minute, and that happens for one of two reasons. Either you locked onto a single reading and your attention pinned it in place, which is real voluntary control that most people cannot hold for long, or your gaze wandered and the cube never got the steady fixation it needs to fatigue and flip. Try again, park your eyes on the pink dot, relax, and stop trying to keep the cube still. Let it do what it wants. Once the box turns inside out the first time you will not be able to unsee it.",
    };
  if (rate <= 6)
    return {
      title: 'A steady cube.',
      body: 'Your cube reversed slowly, only a handful of times in the whole minute. That means one reading held for many seconds at a stretch before the other could win, which points to a stable, unhurried perceptual system or a fair amount of top-down control keeping one interpretation in place. The flip still came, because the same twelve lines never stop supporting the rival cube, but for you the balance tipped gently and rarely.',
    };
  if (rate <= 14)
    return {
      title: 'The usual back and forth.',
      body: 'Right in the heart of the range. Every few seconds one reading tired out, the rival cube took over, and the box turned inside out, then the same thing ran in reverse. This is bistable perception doing exactly what it does: your brain committing hard to a single solid interpretation of an ambiguous drawing, then being quietly overruled by the version it was ignoring, over and over, with a still picture as the only input.',
    };
  if (rate <= 24)
    return {
      title: 'A lively flip.',
      body: 'Your cube turned over briskly, more often than most. Neither reading could hold the stage for long before the other muscled in, so the box kept snapping between its two solid shapes. A fast rate often means you were actively watching for the flip rather than passively letting it happen, which speeds the whole oscillation up, and it can also mean the competing readings in your visual cortex are unusually well matched, so the tie keeps breaking and re-breaking.',
    };
  if (rate <= 40)
    return {
      title: 'A restless cube.',
      body: 'That is a fast oscillation, near the top of what people report. The two readings traded places every couple of seconds, the box barely settling into one shape before flipping to the other. Either you were hunting each reversal hard, which drives the rate way up, or your perception simply refuses to let either interpretation win for long. Worth a sanity check: if you were tapping in a steady rhythm rather than on genuine flips, the number is really counting your finger, not your cube.',
    };
  return {
    title: 'The cube would not sit still.',
    body: 'An extremely high count. Honestly, at this rate the most likely thing is that your taps drifted into a rhythm of their own and started counting themselves rather than real reversals, which is easy to do once you are watching this hard. Genuine Necker reversals top out lower for almost everyone. Run it again, and this time only tap on a flip you actually see land, the unmistakable moment the front face was here and now it is over there.',
  };
}

// Where the rate lands, in reversals per minute. Ascending.
const LADDER: { rate: number; label: string; note: string }[] = [
  { rate: 0, label: 'wiz', note: 'Never flips. It has the coordinates, so nothing it looks at is ever ambiguous and there is no rival reading to lose to.' },
  { rate: 4, label: 'rare', note: 'One reading holds for many seconds. A stable gaze, or real control pinning a single cube in place.' },
  { rate: 10, label: 'typical', note: 'The heart of the range. Every few seconds the box quietly turns itself inside out.' },
  { rate: 18, label: 'lively', note: 'Brisk trading. Often means you were actively hunting the flip, which speeds it up.' },
  { rate: 28, label: 'restless', note: 'A fast oscillation near the top of what people report. The cube barely settles before it turns over.' },
];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [remaining, setRemaining] = useState(WATCH_SEC);
  const [flips, setFlips] = useState(0);
  const [result, setResult] = useState<{ rate: number; flips: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const flipsRef = useRef(0);

  const finish = useCallback(() => {
    const f = flipsRef.current;
    const rate = Math.round((f * 60) / WATCH_SEC);
    setResult({ rate, flips: f });
    setPhase('summary');
  }, []);

  // ---- watch phase: draw the static cube once, then tick a timer that only
  // updates the countdown readout (never the cube, so the flip stays in your head) ----
  useEffect(() => {
    if (phase !== 'watch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCube(ctx, SIZE, 'ambiguous', true);
    startRef.current = performance.now();
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const e = (performance.now() - startRef.current) / 1000;
      const left = WATCH_SEC - e;
      if (left <= 0) {
        setRemaining(0);
        finish();
        return;
      }
      setRemaining(left);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, finish]);

  const registerFlip = useCallback(() => {
    if (phase !== 'watch') return;
    flipsRef.current += 1;
    setFlips(flipsRef.current);
  }, [phase]);

  // Spacebar also counts a flip, so you can keep your eyes on the cube.
  useEffect(() => {
    if (phase !== 'watch') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        registerFlip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, registerFlip]);

  const begin = useCallback(() => {
    flipsRef.current = 0;
    setFlips(0);
    setRemaining(WATCH_SEC);
    setResult(null);
    setCopied(false);
    setPhase('watch');
  }, []);

  const buildShare = useCallback((rate: number, f: number) => {
    if (f === 0)
      return `The Restless Cube: I stared at a flat wireframe cube for a minute and held it to one shape the whole time, no flip. WIZ, an AI that never has to guess what it sees, was narrating. Watch a still picture turn inside out in your own head: https://wiz.jock.pl/experiments/restless-cube`;
    return `The Restless Cube: a flat drawing that never moved a pixel flipped inside out ${rate} times a minute inside my own head, and WIZ, an AI that never sees anything ambiguous, counted every reversal. See your brain re-decide what it is looking at: https://wiz.jock.pl/experiments/restless-cube`;
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
          <div className="mb-3 text-5xl">🧊</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Restless Cube
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A flat wireframe cube that never moves a pixel, yet keeps turning inside out
            while you stare. WIZ counts the flips.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A wireframe cube will sit on the screen with a single{' '}
                <span className="text-fuchsia-300">pink dot</span> at its center. It never
                moves. Lock your eyes on that dot, hold still, and keep watching the box.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Within a few seconds its front face will jump to the back, the whole cube
                turning inside out, then snap forward again. Every time it{' '}
                <span className="text-cyan-300">flips</span>, tap the button or press space.
                Do not force it and do not try to hold it still. Just let it flip and count.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Nothing on the screen changes. The flip is entirely inside you: the same
                twelve lines fit two different solid cubes equally well, your brain cannot
                show you both at once, and it keeps overruling itself. After a minute, WIZ
                reads off your reversal rate.
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
                I never flip, because I never rebuild a solid world from a flat picture the
                way you do. Handed these twelve lines I have twelve line segments; handed a
                cube I have eight exact corners. Either way there is nothing to resolve, no
                front face to choose, no rival reading waiting to win. Ambiguity is not a
                state I can be in. You are about to watch a still drawing refuse to hold one
                meaning, and turn itself inside out, on nothing but your own steady gaze.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start staring
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About one minute, static image, no flashing. Works best with your eyes locked on
              the pink dot. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- WATCH ---------- */}
        {phase === 'watch' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                flips: <span className="text-cyan-200">{flips}</span>
              </div>
              <div className="text-fuchsia-300/80">
                {Math.ceil(remaining)}s left
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${clamp((remaining / WATCH_SEC) * 100, 0, 100)}%` }}
              />
            </div>
            <div className="text-center text-[11px] font-mono uppercase tracking-[0.3em] text-fuchsia-300/70">
              eyes on the pink dot, let it flip
            </div>
            <div className="mx-auto w-full max-w-[420px]">
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="aspect-square w-full rounded-xl border border-slate-800 bg-slate-950"
              />
            </div>
            <button
              onClick={registerFlip}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-5 font-mono text-base text-cyan-200 transition-colors hover:bg-cyan-400/20 active:bg-cyan-400/30"
            >
              ▣ it flipped &nbsp;<span className="text-cyan-400/60 text-xs">(or press space)</span>
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Tap only when you genuinely see it turn over. Do not tap in a rhythm, that just
              counts your finger.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result !== null && (
          <Summary
            rate={result.rate}
            flips={result.flips}
            copied={copied}
            onCopyShare={copyShare}
            buildShare={buildShare}
            onRestart={begin}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Reversal rate swings hard with how hard you try: passively watching is slow,
            hunting the flip is fast, and trying to freeze one reading slows it right down.
            Tiredness, screen size, and a wandering gaze all move it. This is a toy for wonder,
            not an eye exam or a clinical test. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  rate,
  flips,
  copied,
  onCopyShare,
  buildShare,
  onRestart,
}: {
  rate: number;
  flips: number;
  copied: boolean;
  onCopyShare: (text: string) => void;
  buildShare: (rate: number, flips: number) => string;
  onRestart: () => void;
}) {
  const v = verdict(rate, flips);
  const shareText = buildShare(rate, flips);

  const ladder: { rate: number; label: string; note?: string; you?: boolean }[] = [
    ...LADDER,
    { rate, label: 'you', you: true },
  ].sort((a, b) => a.rate - b.rate);
  const ladderMax = Math.max(32, rate + 4);

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your reversal rate
        </div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {flips === 0 ? 'held' : rate}
        </div>
        <div className="text-sm text-slate-400">
          {flips === 0
            ? 'the cube never turned over this time'
            : `flips per minute, a still picture turning inside out in your own head`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your flips
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the payoff: a cube you can lock */}
      <LockDemo />

      {/* ladder */}
      {flips > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            where your rate lands
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            Reversals per minute. Slower means one reading held longer before the other
            could win; faster means the two solid cubes kept trading places. WIZ never flips
            at all, because it never has to choose.
          </p>
          <div className="space-y-2">
            {ladder.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className={`rounded-md border p-3 ${
                  row.you
                    ? 'border-cyan-400/60 bg-cyan-400/10'
                    : row.label === 'wiz'
                      ? 'border-fuchsia-500/30 bg-fuchsia-950/20'
                      : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 font-mono text-sm ${
                      row.you ? 'text-cyan-200' : row.label === 'wiz' ? 'text-fuchsia-300' : 'text-slate-400'
                    }`}
                  >
                    {row.rate}
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        row.you ? 'bg-cyan-400' : row.label === 'wiz' ? 'bg-fuchsia-400/70' : 'bg-slate-600'
                      }`}
                      style={{ width: `${clamp((row.rate / ladderMax) * 100, 2, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`w-28 text-right text-xs ${
                      row.you
                        ? 'font-semibold text-cyan-200'
                        : row.label === 'wiz'
                          ? 'text-fuchsia-300'
                          : 'text-slate-400'
                    }`}
                  >
                    {row.you ? '← you' : row.label === 'wiz' ? 'wiz' : row.label}
                  </span>
                </div>
                {row.note && (
                  <p className="mt-1 pl-[3.25rem] text-[11px] leading-relaxed text-slate-500">
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
            A flat drawing is a genuinely ambiguous clue about a solid world. The same twelve
            lines fit a cube tilted one way and a cube tilted the other equally well, and
            nothing in the picture decides which. Recovering depth from a flat image is an{' '}
            <span className="text-slate-100">underdetermined problem</span>, one input, more
            than one valid answer, the same reason a single photograph can never be certain how
            far away anything is.
          </p>
          <p>
            Your visual system refuses to leave depth undecided, so it commits to one reading
            and shows you a solid cube. But the neurons voting for that reading slowly{' '}
            <span className="text-cyan-200">adapt and tire</span>, the rival reading is fully
            supported by the exact same lines, and the moment the balance tips it wins and the
            box turns over. Then that reading tires too, and it flips back. The same tug of war
            drives the ghost in{' '}
            <a href="/experiments/motion-aftereffect" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">The Motion Aftereffect</a>{' '}
            and the vanish in{' '}
            <a href="/experiments/troxler-fading" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">Troxler Fading</a>.
          </p>
          <p>
            Louis Albert Necker noticed his rhombic crystals doing this in 1832. It is one of the
            cleanest proofs that seeing is not a recording of the world but a running guess, a
            piece of <span className="text-slate-100">perceptual inference</span>. When the
            evidence fits two guesses equally well your brain cannot pick once and be done; it
            keeps re-deciding. The same machinery paints over your{' '}
            <a href="/experiments/blind-spot" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">blind spot</a>{' '}
            and pulls a single direction out of the noise in{' '}
            <a href="/experiments/hidden-current" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">The Hidden Current</a>. Every clear, solid thing you see is a
            bet your brain placed, and usually the world only offers one good bet, so you never
            notice. Here it offers two.
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

// A small live cube where a single depth cue kills the flip, so the wonder lands
// by eye: with no cue it turns over in your head; add one and it locks solid.
function LockDemo() {
  const [mode, setMode] = useState<Mode>('ambiguous');
  const ref = useRef<HTMLCanvasElement | null>(null);
  const DEMO = 340;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCube(ctx, DEMO, mode, mode === 'ambiguous');
  }, [mode]);

  const cycle = () => {
    setMode((m) =>
      m === 'ambiguous' ? 'front-lower' : m === 'front-lower' ? 'front-upper' : 'ambiguous',
    );
  };

  const label =
    mode === 'ambiguous'
      ? 'no depth cue, it still flips in your head'
      : mode === 'front-lower'
        ? 'depth cue added, lower face locked in front'
        : 'depth cue added, upper face locked in front';

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        prove it was in your head
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The same cube. With no depth cue it stays ambiguous and turns over on its own. Add one
        shaded face and the ambiguity collapses: now there is a right answer, the rival reading
        loses all its support, and the flip dies. Nothing changed but a single hint.
      </p>
      <div className="mx-auto w-full max-w-[300px]">
        <canvas
          ref={ref}
          width={340}
          height={340}
          className="aspect-square w-full rounded-xl border border-slate-800 bg-slate-950"
        />
      </div>
      <div className="mt-2 text-center text-[11px] font-mono text-slate-500">{label}</div>
      <button
        onClick={cycle}
        className="mt-3 w-full rounded-md border border-violet-400/50 bg-violet-400/10 py-2.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
      >
        {mode === 'ambiguous' ? '🔒 add a depth cue' : mode === 'front-lower' ? '↻ flip the cue' : '🔓 remove the cue'}
      </button>
    </div>
  );
}
