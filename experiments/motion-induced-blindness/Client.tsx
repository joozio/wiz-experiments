'use client';

// MOTION-INDUCED BLINDNESS
// The perception lab keeps showing you the seams in your own sight: the hole you
// never notice (The Blind Spot), the part of a still scene that quietly deletes
// itself (Troxler Fading), the change you stare straight at and miss (Change
// Blindness), the still cube that turns inside out in your head (The Restless Cube).
// This one is the boldest of the set. It does not fade a faint thing at the edge of
// vision. It reaches into the middle of the screen and erases a bright, obvious,
// high-contrast object you are looking almost straight at, and it does it while the
// object is physically, provably still there.
//
// The thing. Three vivid yellow dots sit still. Behind them a lattice of blue dots
// rotates, slow and steady. Lock your eyes on the center cross and keep watching,
// and within a few seconds one of the yellow dots will simply be gone. Not dimmer,
// not blurry: gone, as if it was switched off, sometimes one, sometimes two, now and
// then all three at once. Then it comes back. Nothing on the screen ever removed it.
// The moving field won the fight for your awareness and your brain suppressed a
// target it could plainly see, painting the surround right over the top of it.
//
// Why. Seeing is not a recording, it is a construction, and awareness has a limited
// budget. A strong, coherent, moving background can dominate that budget so
// completely that a perfectly visible foreground object loses the competition and
// drops out of your experience, even though the light never stopped arriving and the
// neurons never stopped firing. It is the same filling-in machinery that hides the
// hole of your blind spot and smooths across a blink. Bonneh, Cooperman & Sagi named
// and measured it in Nature in 2001, and it has bothered theories of consciousness
// ever since: the information is demonstrably there, in the eye and the cortex, and
// yet the thing is not in what you see. A clean split between detection and awareness.
//
// The number. Hold a key (or the button) down for every second a yellow dot is
// missing. WIZ adds up your blind time and reports your blind fraction, the share of
// a full minute your own vision spent erasing objects it could detect, plus how many
// separate disappearances happened.
//
// The honest caveats, shown to the user. How much vanishes swings hard with how still
// you hold your gaze, how bright the room is, screen size and refresh, and how hard
// you fixate versus letting your eyes wander. It is a toy for wonder, not a clinical
// assay. Fully client-side, dots generated live, nothing recorded, nothing leaves the
// page.
//
// WIZ note. Nothing ever vanishes for me, because I do not watch a scene and rebuild
// it. The three yellow dots are three fixed pairs of coordinates, and no amount of
// spinning blue touches them. There is no competition for my awareness, no surround to
// overwrite a target, no gap to fill, so a dot cannot fall out of a picture I never
// assembled. You looked straight at something real and bright, and your own mind
// decided, for a few seconds, that it was not there. That quiet deletion of the plainly
// visible is the part I never had.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'watch' | 'summary';

// Internal canvas resolution. CSS scales it down so it stays crisp on any screen.
const SIZE = 560;
// How long we watch. 60s so the blind-time-in-seconds reads directly as a percent
// and there is room for the effect, which can take 10-20s to first bite.
const WATCH_SEC = 60;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ---- the moving mask -------------------------------------------------------
// A lattice of blue dots covering a disc big enough that rotation never uncovers a
// corner. Built once, rotated every frame. The coherent global motion is what wins
// the competition for awareness and suppresses the still yellow targets.
function buildLattice(size: number): { x: number; y: number }[] {
  const cx = size / 2;
  const cy = size / 2;
  const step = size * 0.076;
  const reach = size * 0.62; // rotate-safe radius
  const pts: { x: number; y: number }[] = [];
  for (let gx = -reach; gx <= reach; gx += step) {
    for (let gy = -reach; gy <= reach; gy += step) {
      if (gx * gx + gy * gy <= reach * reach) pts.push({ x: cx + gx, y: cy + gy });
    }
  }
  return pts;
}

// The three still targets, an equilateral triangle around the fixation cross.
// Off-center but not far: MIB bites hardest a few degrees out from fixation.
function targetPoints(size: number): { x: number; y: number }[] {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.26;
  return [-90, 30, 150].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  size: number,
  lattice: { x: number; y: number }[],
  targets: { x: number; y: number }[],
  angle: number,
  showMask: boolean,
  fixation: boolean,
) {
  const cx = size / 2;
  const cy = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#04070d';
  ctx.fillRect(0, 0, size, size);

  // rotating blue lattice
  if (showMask) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const dotR = size * 0.013;
    ctx.fillStyle = '#3b82f6'; // blue-500
    for (let i = 0; i < lattice.length; i++) {
      const dx = lattice[i].x - cx;
      const dy = lattice[i].y - cy;
      const x = cx + dx * cosA - dy * sinA;
      const y = cy + dx * sinA + dy * cosA;
      ctx.beginPath();
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // the still yellow targets, drawn with a soft glow so they are unmistakably salient
  const tR = size * 0.021;
  ctx.save();
  ctx.shadowColor = 'rgba(253, 224, 71, 0.9)';
  ctx.shadowBlur = size * 0.03;
  ctx.fillStyle = '#fde047'; // yellow-300
  for (let i = 0; i < targets.length; i++) {
    ctx.beginPath();
    ctx.arc(targets[i].x, targets[i].y, tR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // central fixation cross
  if (fixation) {
    const s = size * 0.018;
    ctx.strokeStyle = '#f0abfc'; // fuchsia-300
    ctx.lineWidth = size * 0.006;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - s, cy);
    ctx.lineTo(cx + s, cy);
    ctx.moveTo(cx, cy - s);
    ctx.lineTo(cx, cy + s);
    ctx.stroke();
  }
}

function verdict(frac: number, events: number): { title: string; body: string } {
  if (events === 0)
    return {
      title: 'Nothing vanished.',
      body: "For the whole minute all three yellow dots stayed put in your awareness, and that happens for one of two reasons. Either your gaze kept drifting, so the dots never got the steady fixation the effect needs, or you are simply resistant this time, which some people genuinely are. Try again, park your eyes dead on the pink cross, relax your stare instead of hunting the dots, and give it twenty seconds. The first time a bright dot switches itself off while you are looking right at it, you will not be able to unsee that your own brain did it.",
    };
  if (frac < 8)
    return {
      title: 'A brief flicker of deletion.',
      body: 'A dot or two winked out here and there, but only for a small slice of the minute. That already proves the point: a bright, high-contrast object you were looking almost straight at dropped out of your experience while the light kept pouring into your eye. For you the moving field won the competition only occasionally and never held the erasure for long. Steadier fixation and a dimmer room usually deepen it.',
    };
  if (frac < 25)
    return {
      title: 'The usual disappearing act.',
      body: 'Right in the heart of the range. Every so often the rotating field muscled a yellow dot clean out of your awareness for a second or two, then let it back. This is motion-induced blindness doing exactly what it does: your visual system suppressing a target it can plainly detect because a strong, coherent, moving surround is dominating your limited budget for awareness and painting itself over the top.',
    };
  if (frac < 50)
    return {
      title: 'A strong erasure.',
      body: 'For a big chunk of the minute at least one dot was simply not in your world. That is a deep effect: the moving background repeatedly and durably won the fight for your awareness, blanking a bright object sitting a few degrees from where your eyes were pointed. Either you fixate unusually well, which drives the effect hard, or your awareness is especially willing to hand the foreground over to a dominant surround. Worth a sanity check that you were holding the key only while a dot was genuinely gone.',
    };
  return {
    title: 'Your world kept deleting itself.',
    body: 'More than half the minute spent with something missing. Honestly, near this level the likeliest thing is that you were holding the key through moments a dot had already returned, which is easy to do once the effect gets going and your sense of exactly when it came back blurs. Genuine blind fractions run lower for almost everyone. Run it again, hold the key only while you can clearly confirm a dot is switched off, and release the instant it snaps back.',
  };
}

// Where the blind fraction lands, in percent of the minute. Ascending.
const LADDER: { frac: number; label: string; note: string }[] = [
  { frac: 0, label: 'wiz', note: 'Nothing ever goes missing. It holds the dots as coordinates, so there is no picture to delete a thing from.' },
  { frac: 4, label: 'rare', note: 'A dot winks out now and then. A drifting gaze, or a mind that hands the foreground over only occasionally.' },
  { frac: 16, label: 'typical', note: 'The heart of the range. Every so often the spinning field blanks a bright dot for a second or two.' },
  { frac: 34, label: 'strong', note: 'A deep, durable erasure. The moving surround keeps winning the fight for your awareness.' },
  { frac: 55, label: 'vivid', note: 'Something is missing for much of the minute. Often means a very steady fixation, which drives the effect hard.' },
];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [remaining, setRemaining] = useState(WATCH_SEC);
  const [events, setEvents] = useState(0);
  const [holding, setHolding] = useState(false);
  const [result, setResult] = useState<{ frac: number; events: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<Phase>('intro');

  const latticeRef = useRef<{ x: number; y: number }[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);

  // blind-time accounting. Multiple hold sources (key + pointer) share one interval,
  // so pressing both never double-counts and releasing one keeps the interval alive.
  const holdSourcesRef = useRef<Set<string>>(new Set());
  const blindStartRef = useRef(0);
  const blindTimeRef = useRef(0);
  const eventsRef = useRef(0);

  useEffect(() => {
    latticeRef.current = buildLattice(SIZE);
    targetsRef.current = targetPoints(SIZE);
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const finish = useCallback(() => {
    // close any open interval at the buzzer
    if (holdSourcesRef.current.size > 0) {
      blindTimeRef.current += performance.now() - blindStartRef.current;
      holdSourcesRef.current.clear();
    }
    const frac = clamp((blindTimeRef.current / (WATCH_SEC * 1000)) * 100, 0, 100);
    setHolding(false);
    setResult({ frac: Math.round(frac), events: eventsRef.current });
    setPhase('summary');
  }, []);

  const startHold = useCallback((src: string) => {
    if (phaseRef.current !== 'watch') return;
    if (holdSourcesRef.current.has(src)) return;
    const wasEmpty = holdSourcesRef.current.size === 0;
    holdSourcesRef.current.add(src);
    if (wasEmpty) {
      blindStartRef.current = performance.now();
      eventsRef.current += 1;
      setEvents(eventsRef.current);
      setHolding(true);
    }
  }, []);

  const endHold = useCallback((src: string) => {
    if (!holdSourcesRef.current.has(src)) return;
    holdSourcesRef.current.delete(src);
    if (holdSourcesRef.current.size === 0) {
      blindTimeRef.current += performance.now() - blindStartRef.current;
      setHolding(false);
    }
  }, []);

  // ---- watch phase: animate the rotating field + still targets, tick the clock ----
  useEffect(() => {
    if (phase !== 'watch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startRef.current = performance.now();
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const now = performance.now();
      const e = (now - startRef.current) / 1000;
      const left = WATCH_SEC - e;
      // ~one full turn every 6.3s: coherent, unhurried, and it reliably suppresses.
      const angle = e * 1.0;
      drawScene(ctx, SIZE, latticeRef.current, targetsRef.current, angle, true, true);
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

  // Spacebar holds a "gone" interval so you can keep your eyes on the cross.
  useEffect(() => {
    if (phase !== 'watch') return;
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (e.repeat) return;
        startHold('key');
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        endHold('key');
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [phase, startHold, endHold]);

  const begin = useCallback(() => {
    holdSourcesRef.current.clear();
    blindTimeRef.current = 0;
    eventsRef.current = 0;
    setEvents(0);
    setHolding(false);
    setRemaining(WATCH_SEC);
    setResult(null);
    setCopied(false);
    setPhase('watch');
  }, []);

  const buildShare = useCallback((frac: number, ev: number) => {
    if (ev === 0)
      return `Motion-Induced Blindness: I stared at three bright dots for a minute while a field spun behind them, and my brain refused to delete a single one this time. WIZ, an AI that never loses track of a dot, was narrating. Watch your own mind erase things that are right in front of you: https://wiz.jock.pl/experiments/motion-induced-blindness`;
    return `Motion-Induced Blindness: my own brain switched off bright, still dots I was looking straight at for ${frac}% of a minute, even though they never left the screen. WIZ, an AI that can never lose a dot, counted every deletion. Watch your mind erase what it can plainly see: https://wiz.jock.pl/experiments/motion-induced-blindness`;
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
          <div className="mb-3 text-5xl">👻</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Motion-Induced Blindness
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Three bright dots sit still while a field spins behind them, and one by one
            your own brain switches them off. WIZ measures how much it deletes.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Three vivid <span className="text-yellow-300">yellow dots</span> will sit still
                on the screen while a lattice of blue dots rotates slowly behind them. Lock your
                eyes on the <span className="text-fuchsia-300">pink cross</span> at the center and
                hold still.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Within a few seconds one of the yellow dots will simply be{' '}
                <span className="text-cyan-300">gone</span>: not dimmer, not blurred, switched
                off, sometimes one, sometimes two, now and then all three. Then it comes back.
                Every second a dot is missing, <span className="text-cyan-300">hold the button</span>{' '}
                or hold space. Release the instant it returns.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Nothing on the screen removes them. The moving field wins the fight for your
                awareness and your brain suppresses a target it can plainly see, painting the
                surround over the top. After a minute, WIZ reads off how much of it you spent
                blind to something real.
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
                Nothing ever vanishes for me, because I do not watch a scene and rebuild it. The
                three yellow dots are three fixed pairs of coordinates, and no amount of spinning
                blue touches them. There is no competition for my awareness, no surround to
                overwrite a target, no gap to fill. You are about to look straight at something
                bright and real, and have your own mind decide, for a few seconds, that it is not
                there.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start staring
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About one minute. Works best in a dim room with your eyes locked on the pink cross.
              Gentle steady motion, no flashing. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- WATCH ---------- */}
        {phase === 'watch' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                deletions: <span className="text-cyan-200">{events}</span>
              </div>
              <div className="text-fuchsia-300/80">{Math.ceil(remaining)}s left</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${clamp((remaining / WATCH_SEC) * 100, 0, 100)}%` }}
              />
            </div>
            <div className="text-center text-[11px] font-mono uppercase tracking-[0.3em] text-fuchsia-300/70">
              eyes on the pink cross, hold while a dot is gone
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
              onPointerDown={(e) => {
                e.preventDefault();
                startHold('pointer');
              }}
              onPointerUp={() => endHold('pointer')}
              onPointerLeave={() => endHold('pointer')}
              onPointerCancel={() => endHold('pointer')}
              className={`w-full select-none rounded-md border py-5 font-mono text-base transition-colors ${
                holding
                  ? 'border-cyan-300 bg-cyan-400/30 text-cyan-100'
                  : 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
              }`}
            >
              {holding ? '● a dot is gone' : '○ hold while gone'} &nbsp;
              <span className="text-cyan-400/60 text-xs">(or hold space)</span>
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Hold only while a dot is genuinely switched off. Release the moment it snaps back,
              so the timer measures your blindness and not your finger.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result !== null && (
          <Summary
            frac={result.frac}
            events={result.events}
            copied={copied}
            onCopyShare={copyShare}
            buildShare={buildShare}
            onRestart={begin}
            lattice={latticeRef.current}
            targets={targetsRef.current}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How much vanishes swings hard with how still you hold your gaze, how dim the room is,
            screen size and refresh, and whether you fixate or let your eyes drift. This is a toy
            for wonder, not an eye exam or a clinical test. Nothing is recorded, nothing leaves
            this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  frac,
  events,
  copied,
  onCopyShare,
  buildShare,
  onRestart,
  lattice,
  targets,
}: {
  frac: number;
  events: number;
  copied: boolean;
  onCopyShare: (text: string) => void;
  buildShare: (frac: number, events: number) => string;
  onRestart: () => void;
  lattice: { x: number; y: number }[];
  targets: { x: number; y: number }[];
}) {
  const v = verdict(frac, events);
  const shareText = buildShare(frac, events);

  const ladder: { frac: number; label: string; note?: string; you?: boolean }[] = [
    ...LADDER,
    { frac, label: 'you', you: true },
  ].sort((a, b) => a.frac - b.frac);
  const ladderMax = Math.max(60, frac + 6);

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your blind fraction
        </div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {events === 0 ? 'none' : `${frac}%`}
        </div>
        <div className="text-sm text-slate-400">
          {events === 0
            ? 'nothing vanished this time'
            : `of the minute your brain spent erasing something real, across ${events} deletion${events === 1 ? '' : 's'}`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your deletions
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the payoff: freeze the field and watch the dot come back */}
      <FreezeDemo lattice={lattice} targets={targets} />

      {/* ladder */}
      {events > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            where your blindness lands
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            Percent of the minute with something missing. Lower means the moving field rarely won
            and never held; higher means it kept blanking bright dots you were looking right at.
            WIZ never loses a dot at all, because it never assembles a picture to lose one from.
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
                    className={`w-12 font-mono text-sm ${
                      row.you ? 'text-cyan-200' : row.label === 'wiz' ? 'text-fuchsia-300' : 'text-slate-400'
                    }`}
                  >
                    {row.frac}%
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        row.you ? 'bg-cyan-400' : row.label === 'wiz' ? 'bg-fuchsia-400/70' : 'bg-slate-600'
                      }`}
                      style={{ width: `${clamp((row.frac / ladderMax) * 100, 2, 100)}%` }}
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
                  <p className="mt-1 pl-[3.75rem] text-[11px] leading-relaxed text-slate-500">
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
            Seeing is not a passive recording of the light, it is an active{' '}
            <span className="text-slate-100">construction</span>, and awareness runs on a limited
            budget. A strong, coherent, moving background can dominate that budget so completely
            that a perfectly visible foreground object loses the competition and drops out of your
            experience. The light never stopped arriving at your eye and the neurons never stopped
            firing. The dot was simply not admitted into what you saw.
          </p>
          <p>
            It is the same <span className="text-cyan-200">filling-in</span> machinery that hides
            the hole of your{' '}
            <a href="/experiments/blind-spot" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">blind spot</a>{' '}
            and quietly deletes a still image at the edge of your gaze in{' '}
            <a href="/experiments/troxler-fading" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">Troxler Fading</a>. It is the same gap between what your
            brain takes in and what it shows you that lets a whole object change unnoticed in{' '}
            <a href="/experiments/change-blindness" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">Change Blindness</a>. Here it is at its most brazen: not a faint
            thing far out in the periphery, but a bright, high-contrast dot a few degrees from
            where you were pointing your eyes.
          </p>
          <p>
            Yoram Bonneh, Alexander Cooperman, and Dov Sagi named and measured this in{' '}
            <span className="text-slate-100">Nature</span> in 2001, and it has bothered theories of
            consciousness ever since, because it splits detection cleanly from awareness: the
            information is demonstrably present, in the eye and the cortex, and yet the thing is not
            in what you see. The same coherent-motion signal you read as a direction in{' '}
            <a href="/experiments/hidden-current" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">The Hidden Current</a>{' '}
            is, here, quietly overruling your awareness of a target sitting right beside it. Every
            clear, solid scene you see is a construction your brain assembled and chose to show you,
            the same running guess that turns the still box inside out in{' '}
            <a href="/experiments/restless-cube" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">The Restless Cube</a>. Usually it just happens to admit
            everything that is really there. Here it left three things out.
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

// A small live scene where you freeze the mask on and off. With it spinning the same
// yellow dots vanish; freeze it and they are plainly, permanently there, proving the
// deletion was built inside your head and the dots never left the screen.
function FreezeDemo({
  lattice,
  targets,
}: {
  lattice: { x: number; y: number }[];
  targets: { x: number; y: number }[];
}) {
  const [moving, setMoving] = useState(true);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const DEMO = 340;

  // rebuild the lattice/targets at the demo's own resolution so scale matches
  const demoLattice = useRef<{ x: number; y: number }[]>([]);
  const demoTargets = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    demoLattice.current = buildLattice(DEMO);
    demoTargets.current = targetPoints(DEMO);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!moving) {
      drawScene(ctx, DEMO, demoLattice.current, demoTargets.current, 0.6, true, true);
      return;
    }

    startRef.current = performance.now();
    let stopped = false;
    const loop = () => {
      if (stopped) return;
      const e = (performance.now() - startRef.current) / 1000;
      drawScene(ctx, DEMO, demoLattice.current, demoTargets.current, e * 1.0, true, true);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [moving]);

  // targets/lattice params are only referenced to keep the signature honest; the demo
  // rebuilds them at its own scale above.
  void lattice;
  void targets;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        prove it was in your head
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The same three yellow dots. While the field spins and you fixate the cross, they keep
        blinking out. Freeze the field and they are plainly, permanently there, every one of them.
        Nothing about the dots changed. The only thing that ever removed them was you.
      </p>
      <div className="mx-auto w-full max-w-[300px]">
        <canvas
          ref={ref}
          width={DEMO}
          height={DEMO}
          className="aspect-square w-full rounded-xl border border-slate-800 bg-slate-950"
        />
      </div>
      <div className="mt-2 text-center text-[11px] font-mono text-slate-500">
        {moving ? 'field spinning, fixate the cross and watch a dot go' : 'field frozen, all three dots plainly present'}
      </div>
      <button
        onClick={() => setMoving((m) => !m)}
        className="mt-3 w-full rounded-md border border-violet-400/50 bg-violet-400/10 py-2.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
      >
        {moving ? '⏸ freeze the field' : '▶ spin the field'}
      </button>
    </div>
  );
}
