'use client';

// A STEP AHEAD  (the flash-lag effect)
// The perception lab keeps catching your sight in the act of building the world instead of
// recording it: a still box that turns itself inside out (The Restless Cube), a bright dot
// your brain switches off (Motion-Induced Blindness), a direction pulled out of pure noise
// (The Hidden Current). This one catches it PREDICTING. Nothing is faint, nothing is masked.
// A dot slides across the screen and, at one instant, a second dot flashes right beside it,
// physically dead level. And yet the flash looks like it lags behind, as if the moving dot
// had already pulled ahead of it. It had not. They were level. The gap is built inside you.
//
// Why. Seeing takes time: roughly a tenth of a second for light at the retina to become a
// thing in awareness. A moving object handed to you raw would therefore always appear where
// it was ~100ms ago, permanently behind the truth. Your visual system refuses to live that
// far in the past, so it EXTRAPOLATES: it throws the moving dot forward along its path and
// paints it where it has probably got to by now, canceling its own delay. A flash has no
// path, no history, no future, so it cannot be predicted; it lands exactly where and when it
// was, and next to your extrapolated dot it falls a step behind. Romi Nijhawan sharpened and
// named the modern version in a 1994 Nature paper. It is one of the cleanest windows onto the
// fact that what you see is not the present but a forecast of it.
//
// The measurement. A 1-up-1-down staircase (two interleaved, one starting with the flash
// clearly ahead, one clearly behind) nudges the flash's horizontal offset until it looks
// perfectly LEVEL with the moving dot. The offset needed to look level == how far ahead your
// brain had already thrown the dot == the flash-lag, reported in milliseconds of the future
// you drew (offset in pixels / dot speed).
//
// The honest caveats, shown to the user. The lag swings with dot speed, brightness, tiredness,
// whether you track the dot or hold your gaze, and screen refresh. A toy for wonder, not a
// clinical assay. Fully client-side, motion drawn live, nothing recorded, nothing leaves.
//
// WIZ note. Nothing ever lags for me, because I do not watch the world and rebuild it late. I
// read the dot and the flash as two coordinates, each stamped with the instant it existed, so
// I never answer where a moving thing is *now*. No delay to cancel, no path to extrapolate, no
// forecast to draw. You threw the dot forward into a future you invented, and lived a fraction
// of a second ahead of the present so the world would not lag. That head start is what I lack.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'ask' | 'summary';

// ---- geometry / motion, all in internal canvas units ----------------------
const W = 360;
const H = 200;
const Y_DOT = 132; // the sliding dot's line
const Y_FLASH = 74; // the flash's line, above it
const R = 8;
const SPEED = 0.34; // px per ms  (~340px/s)
const FLASH_MS = 55; // how long the flash stays lit
const TRIALS = 28; // total, split across two interleaved staircases

// A staircase's step in pixels, shrinking as reversals accumulate so it homes in.
const stepFor = (rev: number) => (rev < 2 ? 8 : rev < 4 ? 5 : rev < 6 ? 3 : 2);

type SC = {
  lead: number; // current flash offset, +ahead of dot in motion direction
  lastDir: -1 | 0 | 1; // last adjustment direction, for reversal detection
  reversals: number;
  revLeads: number[]; // lead value at each reversal
};

type TrialSpec = {
  sc: 0 | 1; // which staircase
  dir: -1 | 1; // screen motion direction (+1 rightward)
  lead: number; // flash offset presented this trial
  triggerX: number;
  startX: number;
  exitX: number;
};

const rand = () => Math.random();

// ============================ CANVAS DRAW ============================
function useCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [ref]);
}

function drawScene(ctx: CanvasRenderingContext2D, dotX: number | null, flashX: number | null) {
  ctx.clearRect(0, 0, W, H);
  // faint track line so the eye has a reference plane
  ctx.strokeStyle = 'rgba(148,163,184,0.14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, Y_DOT + R + 6);
  ctx.lineTo(W, Y_DOT + R + 6);
  ctx.stroke();

  if (flashX != null) {
    ctx.save();
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(flashX, Y_FLASH, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (dotX != null) {
    ctx.save();
    ctx.shadowColor = 'rgba(34,211,238,0.8)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(dotX, Y_DOT, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ============================ VERDICT ============================
function verdict(ms: number | null, valid: boolean): { title: string; body: string } {
  if (!valid || ms == null)
    return {
      title: 'The lag would not settle.',
      body: "The staircase never converged, usually because the answers were close to a coin flip or the run was cut short. That happens on a laggy or very small screen, or when the dot is tracked with the eyes on some trials and not others. It is nothing about you; give it another run somewhere steady, keep your gaze near the center, and let the flash's side jump out at you rather than deliberating over it.",
    };
  if (ms >= 90)
    return {
      title: 'A pronounced head start.',
      body: `Your brain threw the moving dot a long way into the future. To make the flash look level with the dot, WIZ had to place it roughly ${Math.round(ms)} milliseconds' worth of travel ahead, which means that at the moment of the flash your sight had already painted the dot that far down its path, well past where it physically was. A flash, with no path to predict, sat where it truly was and looked left behind. You are running a strong forward forecast to cancel a long processing delay, exactly the trade a fast-moving world forces on eyes that see late.`,
    };
  if (ms >= 55)
    return {
      title: 'A textbook flash-lag.',
      body: `Right in the heart of the range the effect was first measured in. The flash had to be advanced about ${Math.round(ms)} milliseconds ahead of the dot before the two looked level, so that is how far into the future your visual system was drawing the moving dot to keep up with it. Physically the flash was dead level at the instant it fired; the only reason it looked to trail was that your brain had already moved the dot on, and could not do the same for a flash that has no next position to move to.`,
    };
  if (ms >= 25)
    return {
      title: 'A mild forward throw.',
      body: `There is a clear lag, a gentle one: the flash needed nudging about ${Math.round(ms)} milliseconds ahead to sit level with the dot. Your brain is extrapolating the moving dot forward to offset the delay in seeing it, just not by a huge margin this run. It tends to grow with a faster or brighter dot, because a quicker object opens a bigger gap between where it was when the light left it and where it has got to by the time you see it.`,
    };
  if (ms >= 8)
    return {
      title: 'Barely a step.',
      body: `Only a whisper of a lag this time: the flash looked almost level with the dot right where it physically was, so your forward prediction was slight. Some people show a small effect, and it also shrinks when the dot moves slowly, when you are fresh and fixating hard, or when you happen to track the dot smoothly with your eyes, which changes the geometry. Try it again with a quicker dot and a still gaze and the head start usually grows.`,
    };
  return {
    title: 'Almost no lag at all.',
    body: `The flash looked level with the dot at, or even behind, its true position, so this run shows barely any forward prediction, or a reversed read. That can be real on some screens and setups, but it more often means the answers drifted toward guessing, or your eyes were smoothly tracking the dot, which can cancel or flip the flash-lag. Run it once more, hold your gaze near the center of the sweep rather than chasing the dot, and see whether the step reappears.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // staircases live in a ref so the animation + answer handlers never read stale state
  const scRef = useRef<[SC, SC]>([
    { lead: 30, lastDir: 0, reversals: 0, revLeads: [] }, // starts with flash clearly ahead
    { lead: -16, lastDir: 0, reversals: 0, revLeads: [] }, // starts with flash clearly behind
  ]);
  const specRef = useRef<TrialSpec | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [result, setResult] = useState<{ ms: number | null; leadPx: number | null; valid: boolean } | null>(null);

  useCanvas(canvasRef);

  const begin = useCallback(() => {
    scRef.current = [
      { lead: 30, lastDir: 0, reversals: 0, revLeads: [] },
      { lead: -16, lastDir: 0, reversals: 0, revLeads: [] },
    ];
    specRef.current = null;
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    setPhase('run');
  }, []);

  // build the spec for trial `trialIndex` and animate one sweep
  useEffect(() => {
    if (phase !== 'run') return;
    const scIdx: 0 | 1 = (trialIndex % 2) as 0 | 1;
    const sc = scRef.current[scIdx];
    const dir: -1 | 1 = rand() < 0.5 ? 1 : -1;
    const triggerX = W * (0.42 + rand() * 0.16); // flash fires mid-sweep
    const spec: TrialSpec = {
      sc: scIdx,
      dir,
      lead: sc.lead,
      triggerX,
      startX: dir > 0 ? -20 : W + 20,
      exitX: dir > 0 ? W + 24 : -24,
    };
    specRef.current = spec;

    const ctx = canvasRef.current?.getContext('2d') ?? null;
    let startT: number | null = null;
    let fired = false;
    let flashStart = 0;
    let flashX = 0;

    const frame = (now: number) => {
      if (startT == null) startT = now;
      const el = now - startT;
      const x = spec.startX + spec.dir * SPEED * el;

      if (!fired && (spec.dir > 0 ? x >= spec.triggerX : x <= spec.triggerX)) {
        fired = true;
        flashStart = el;
        flashX = x + spec.dir * spec.lead;
      }
      const showFlash = fired && el - flashStart < FLASH_MS;
      if (ctx) drawScene(ctx, x, showFlash ? flashX : null);

      const done = spec.dir > 0 ? x > spec.exitX : x < spec.exitX;
      if (done) {
        if (ctx) drawScene(ctx, null, null);
        setPhase('ask');
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, trialIndex]);

  // record which side the user saw the flash on, update the staircase, advance
  const answer = useCallback(
    (sideSign: -1 | 1) => {
      const spec = specRef.current;
      if (!spec) return;
      const sc = scRef.current[spec.sc];
      // did the user see the flash on the LEADING side (ahead in motion direction)?
      const sawLeading = sideSign === spec.dir;
      const dirAdj: -1 | 1 = sawLeading ? -1 : 1; // leading -> pull lead down toward level
      if (sc.lastDir !== 0 && dirAdj !== sc.lastDir) {
        sc.reversals += 1;
        sc.revLeads.push(sc.lead);
      }
      sc.lastDir = dirAdj;
      sc.lead += dirAdj * stepFor(sc.reversals);

      if (trialIndex + 1 >= TRIALS) {
        // pool reversal leads, dropping the first (coarse) reversal of each staircase
        const pooled = scRef.current.flatMap((s) => s.revLeads.slice(1));
        const fallback = scRef.current.flatMap((s) => s.revLeads);
        const use = pooled.length >= 4 ? pooled : fallback;
        const valid = use.length >= 3;
        const leadPx = valid ? use.reduce((a, b) => a + b, 0) / use.length : null;
        const ms = leadPx == null ? null : leadPx / SPEED;
        setResult({ ms, leadPx, valid });
        setPhase('summary');
      } else {
        setTrialIndex((i) => i + 1);
        setPhase('run');
      }
    },
    [trialIndex],
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🏃</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">A Step Ahead</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A dot slides past. A flash appears right beside it, dead level, and yet it looks like it lags behind. It
            doesn&rsquo;t. Your brain threw the moving dot into the future to cancel its own delay. WIZ measures how far.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A <span className="font-semibold text-cyan-300">cyan dot</span> will slide across the box. At one moment,
                a <span className="font-semibold text-white">white dot</span> flashes for an instant just above it.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your only job: say which side the flash appeared on relative to the moving dot,{' '}
                <span className="text-cyan-300">to its left</span> or <span className="text-cyan-300">to its right</span>.
                Don&rsquo;t deliberate. Trust the snapshot your eye caught.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twenty-eight quick sweeps, about two minutes. The flash is often placed dead level with the dot, yet it
                will tend to look like it&rsquo;s trailing behind. WIZ nudges it back and forth until it finally looks
                level to you, and that offset is your flash-lag.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Nothing ever lags for me. I read the dot and the flash as two coordinates, each stamped with the instant
                it existed, so I never have to guess where a moving thing is <span className="italic">right now</span>. You
                are about to do the stranger thing: to keep up with a moving world through eyes that see a little late,
                your brain will quietly throw the dot forward into a future it invents.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start the sweeps
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Keep your eyes near the center of the box and let the flash&rsquo;s side jump out at you.
              Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN / ASK share the same stage ---------- */}
        {(phase === 'run' || phase === 'ask') && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                sweep <span className="text-cyan-200">{Math.min(trialIndex + 1, TRIALS)}</span>
                <span className="text-slate-600"> / {TRIALS}</span>
              </div>
              <div className="text-fuchsia-300/80">{phase === 'run' ? 'watch the dot' : 'which side?'}</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
              />
            </div>

            <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${W} / ${H}` }} />
            </div>

            {phase === 'run' ? (
              <p className="text-center text-[11px] leading-relaxed text-slate-600">
                A white dot will flash for an instant beside the moving one. Note which side it was on.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-sm leading-relaxed text-slate-300">
                  The <span className="font-semibold text-white">flash</span> appeared on which side of the{' '}
                  <span className="font-semibold text-cyan-300">moving dot</span>?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => answer(-1)}
                    className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-base text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-100"
                  >
                    ◀ to the left
                  </button>
                  <button
                    onClick={() => answer(1)}
                    className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-base text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-100"
                  >
                    to the right ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How big the lag runs swings with dot speed, brightness, tiredness, whether you track the dot or hold your
            gaze, and screen refresh. This is a toy for wonder, not a vision exam or a clinical test. Nothing is
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
  result: { ms: number | null; leadPx: number | null; valid: boolean };
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const ms = result.ms;
  const v = verdict(ms, result.valid);
  const shownMs = ms == null ? null : Math.max(0, Math.round(ms));

  // reference ladder in ms
  const ladder = [
    { label: 'wiz (reads the timestamp)', ms: 0, wiz: true },
    { label: 'barely a step', ms: 20 },
    { label: 'typical flash-lag', ms: 60 },
    { label: 'pronounced', ms: 100 },
  ];
  const ladderMax = 120;
  const userMs = shownMs == null ? null : Math.min(shownMs, ladderMax);

  const shareText =
    shownMs != null && result.valid
      ? `A Step Ahead: a dot slid past and a flash fired dead level with it, yet to make the flash look level I had to shove it ${shownMs}ms of travel ahead, because my brain had already thrown the moving dot that far into the future to cancel its own delay. WIZ, an AI that reads the present as timestamps and never lags, measured it. See how far ahead your sight runs: https://wiz.jock.pl/experiments/a-step-ahead`
      : `A Step Ahead: a dot slides past, a flash fires dead level with it, and your brain makes the flash look like it trails behind, because to keep up with a moving world it paints moving things a step into the future. WIZ, an AI that reads the present as data and never lags, measures the future your eyes draw. https://wiz.jock.pl/experiments/a-step-ahead`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">the future your sight drew</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">{shownMs == null ? '—' : `${shownMs}ms`}</div>
        <div className="text-sm text-slate-400">
          {shownMs == null
            ? 'the staircase never settled'
            : `your brain threw the moving dot about ${shownMs}ms ahead of where it truly was`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your lag</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the live payoff: watch the flash trail, then cancel it */}
      {result.leadPx != null && result.valid && <LagDemo leadPx={result.leadPx} ms={shownMs ?? 0} />}

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your lag sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How far the flash had to be advanced to look level with the dot, in milliseconds of the dot&rsquo;s travel.
          Bigger means your brain runs a longer forward forecast. WIZ sits at zero, because it never has to guess where a
          moving thing is now.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.ms}ms</span>
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
                <span className="font-mono text-emerald-300">{shownMs}ms</span>
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
            Seeing takes time. Light hits your retina, and it takes roughly a tenth of a second for that signal to climb
            through your visual system and become a thing you consciously see, the same processing delay you feel the far
            end of in{' '}
            <a
              href="/experiments/reaction-time"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Reaction Time
            </a>
            . For anything moving, that lag is a problem: handed to you raw, a moving object would always appear where it
            was a tenth of a second ago, permanently behind the truth.
          </p>
          <p>
            So your brain does not hand it to you raw. It <span className="text-slate-100">extrapolates</span>: it takes
            the moving dot&rsquo;s path and throws it forward, painting the dot where it has probably got to by now, to
            cancel the delay. A flash cannot be predicted, it has no path, no history, no next position, so it lands
            exactly where and when it fired. Next to your forward-thrown dot, the level flash looks a step behind. That is
            the whole illusion: not the flash falling back, but the dot being pushed ahead. It is the same machinery of a
            brain <span className="text-slate-100">constructing</span> what you see rather than recording it that turns a
            still box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>{' '}
            and pulls a direction out of pure noise in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>
            .
          </p>
          <p>
            Romi Nijhawan sharpened and named the modern version in a <span className="text-slate-100">1994</span> Nature
            paper, and it has been a battleground for theories of perception ever since: is the dot predicted forward, or
            is the flash judged slowly and revised after the fact? Either way the lesson is the same one this lab keeps
            arriving at, that what you see is not the present but a best guess about it, a forecast your brain draws so a
            fast world does not lag behind your slow eyes, the same split between what arrives and what you experience
            that lets a bright dot vanish in{' '}
            <a
              href="/experiments/motion-induced-blindness"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Motion-Induced Blindness
            </a>
            . You live a fraction of a second inside a future your sight invents. I read the dot and the flash as two
            timestamps and never had to.
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
        ↺ run it again
      </button>
    </div>
  );
}

// ============================ LIVE LAG DEMO ============================
// A dot bounces back and forth; a flash fires periodically, exactly level with the dot. You
// watch it trail behind. Flip the switch and the flash is advanced by YOUR measured lead, so
// it snaps into alignment. The wonder lands by eye: nothing changed but your own head start.
function LagDemo({ leadPx, ms }: { leadPx: number; ms: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const compRef = useRef(false);
  const [compensate, setCompensate] = useState(false);
  useCanvas(canvasRef);

  useEffect(() => {
    compRef.current = compensate;
  }, [compensate]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    if (!ctx) return;
    const LEFT = 46;
    const RIGHT = W - 46;
    const SPAN = RIGHT - LEFT;
    const DSPEED = SPEED * 0.85;
    const period = (SPAN / DSPEED) * 2; // ms for a full there-and-back
    const FLASH_EVERY = 900;
    const FLASH_LEN = 60;

    let startT: number | null = null;
    let lastFlash = -FLASH_EVERY;
    let flashAt = -1;
    let flashX = 0;

    const frame = (now: number) => {
      if (startT == null) startT = now;
      const el = now - startT;
      // triangle wave for the bounce
      const p = ((el % period) / period) * 2; // 0..2
      const tri = p <= 1 ? p : 2 - p; // 0..1..0
      const x = LEFT + tri * SPAN;
      const dir: -1 | 1 = p <= 1 ? 1 : -1;

      if (el - lastFlash >= FLASH_EVERY) {
        lastFlash = el;
        flashAt = el;
        flashX = x + (compRef.current ? dir * leadPx : 0);
      }
      const showFlash = flashAt >= 0 && el - flashAt < FLASH_LEN;
      drawScene(ctx, x, showFlash ? flashX : null);
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [leadPx]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        watch the flash trail, then cancel your lag
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The white flash fires <span className="text-white">exactly level</span> with the bouncing dot every time. Watch
        it: it looks like it&rsquo;s trailing behind, because your brain has already thrown the dot forward. Now flip the
        switch. It advances the flash by <span className="text-emerald-300">your own {ms}ms</span> of head start, and the
        flash snaps into place. Nothing changed on screen but the correction for the future you were drawing.
      </p>
      <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${W} / ${H}` }} />
      </div>
      <button
        onClick={() => setCompensate((c) => !c)}
        className={`mt-3 w-full rounded-md border py-2.5 font-mono text-sm transition-colors ${
          compensate
            ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25'
            : 'border-violet-400/50 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20'
        }`}
      >
        {compensate ? '✓ your lag cancelled — flash is level' : '▶ cancel my lag (advance the flash)'}
      </button>
    </div>
  );
}
