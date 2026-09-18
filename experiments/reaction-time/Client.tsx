'use client';

// REACTION TIME
// Almost every experiment in this lab is something you think about. This one is
// something your body does before you can think, and it pairs with The Edge of
// Hearing as the second piece that measures your own hardware instead of an idea.
//
// The thing. A reaction time is the gap between a signal arriving and you moving.
// The screen flashes green, you tap, and the milliseconds in between are mostly
// not thought, they are transit. Light has to become a chemical signal in your
// retina (slow, it is a cascade of molecules, not a wire), that signal climbs the
// optic nerve to your visual cortex, your brain registers the change and commits
// to a movement, and the command runs back down through motor cortex, spinal
// cord, and nerve to the muscle that finally fires your finger. Add it up and a
// typical simple visual reaction lands near 250ms, of which only a sliver is the
// "decision." You are always living about a tenth of a second in the past.
//
// The floor. You cannot react faster than your wiring allows. Anything under
// about 100ms is not a reaction at all, it is anticipation: your brain pre-fired
// on the rhythm before the light. This is exactly why a sprinter is disqualified
// for a start under 100ms, the rulebook treats it as physically impossible to
// truly react that fast. So this test punishes jumping the gun: tap before green
// and the round is a false start that does not count.
//
// The honest caveats, shown to the user. This depends on the gear. A laggy or
// low-refresh screen, a trackpad instead of a mouse, a touch screen with input
// smoothing, all add tens of milliseconds that are the equipment, not the ear of
// your nervous system. Sit still, one finger ready, and run a few rounds.
//
// WIZ note. I narrate this and I have no reaction time. No eye to catch the light,
// no nerve to carry it, no hand to move. My "latency" is weights loading and a
// forward pass, and I never once flinch, duck, or catch a falling glass. You are
// about to show me something I will never have: a body fast enough to surprise
// itself.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'summary';
type Light = 'waiting' | 'go' | 'early' | 'hit';

const TRIALS = 5;
const MIN_DELAY = 1300;
const MAX_DELAY = 3600;

// Population model for simple visual reaction time, scaled to large online
// reaction-test datasets: mean ~273ms, sd ~44ms.
const POP_MEAN = 273;
const POP_SD = 44;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Standard normal CDF (Zelen & Severo 26.2.17 approximation).
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// Faster than what fraction of people (faster = better, so lower ms wins).
function fasterThanPct(ms: number): number {
  const z = (POP_MEAN - ms) / POP_SD;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

// Where a typical ~250ms reaction actually goes. Honest, approximate split.
const SIGNAL_STAGES: { label: string; pct: number; bar: string; note: string }[] = [
  {
    label: 'eye + nerve',
    pct: 33,
    bar: 'bg-violet-500/70',
    note: 'Light becomes a chemical signal in your retina, then climbs the optic nerve to your visual cortex.',
  },
  {
    label: 'decide',
    pct: 34,
    bar: 'bg-cyan-400/70',
    note: 'Your brain registers the change and commits to moving. This is the only part that is anything like a thought.',
  },
  {
    label: 'muscle',
    pct: 33,
    bar: 'bg-emerald-400/70',
    note: 'The command runs back down through spinal cord and nerve, and your finger finally fires.',
  },
];

// Reference points for the ladder. ms ascending.
const BENCHMARKS: { ms: number; label: string; note: string }[] = [
  { ms: 100, label: 'the floor', note: 'Below this is anticipation, not reaction. A sprinter is disqualified for a start under 100ms.' },
  { ms: 150, label: 'fighter pilot', note: 'The pointy end of trained human reflex, drilled for years.' },
  { ms: 170, label: 'pro FPS gamer', note: 'Esports pros, measured over thousands of clutch clicks.' },
  { ms: 215, label: 'quick human', note: 'A fast, awake, focused tap.' },
  { ms: 273, label: 'average adult', note: 'The middle of millions of online reaction tests.' },
  { ms: 330, label: 'tired or distracted', note: 'Late night, laggy screen, mind half elsewhere.' },
];

function verdict(median: number, falseStarts: number, best: number): { title: string; body: string } {
  let v: { title: string; body: string };
  if (median < 180)
    v = {
      title: 'Lightning.',
      body: 'This is the top shelf of human reflex, the range pro gamers and fighter pilots live in. Either your wiring is genuinely quick or you found the rhythm and started half-predicting the green. Almost nobody taps faster than this without crossing into a guess.',
    };
  else if (median < 215)
    v = {
      title: 'Seriously fast.',
      body: 'Comfortably quicker than the average adult. The signal runs eye, optic nerve, cortex, decision, muscle, and you are losing very little time at the handoffs. The kind of reflex that catches a dropped phone before your conscious mind has filed the report.',
    };
  else if (median < 255)
    v = {
      title: 'Quick, sharp, awake.',
      body: 'Right at the fast edge of normal. Remember that most of this number is not thinking at all, it is pure transit time through about a meter of nerve, and you are paying close to the minimum toll on every leg.',
    };
  else if (median < 300)
    v = {
      title: 'Textbook human.',
      body: 'You landed in the fat middle of millions of taps. The famous quarter-second reaction is mostly your own hardware: light takes time to become a chemical signal in your retina, the signal takes time to climb to your cortex, and your muscle takes time to fire. You are not slow. You are typical, which here means beautifully, ordinarily human.',
    };
  else if (median < 360)
    v = {
      title: 'Relaxed, or running warm.',
      body: 'A touch behind the crowd, which usually means tired, distracted, on a laggy screen, or simply not in a hurry. Reaction time sags with fatigue, age, and a display that refreshes lazily. Try again after a coffee and watch it tighten.',
    };
  else
    v = {
      title: 'Either savoring it, or the gear is.',
      body: 'This is slow enough that the setup is probably in the way: a high-latency display, a trackpad, a moment of mind-wandering between rounds. Reset, sit still, one finger ready over the arena, and go again. Your real number is almost certainly faster than this.',
    };
  if (best < 150)
    v = {
      ...v,
      body:
        v.body +
        ' Your best round dipped under 150ms, which is so fast it is likely a lucky anticipation rather than a true reaction. Nobody reliably reacts that quick.',
    };
  if (falseStarts >= 2)
    v = {
      ...v,
      body:
        v.body +
        ` You jumped the gun ${falseStarts} times: an itchy trigger finger, the brain pre-firing before the light. The test only counts the rounds where you actually waited for green.`,
    };
  return v;
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [light, setLight] = useState<Light>('waiting');
  const [times, setTimes] = useState<number[]>([]);
  const [falseStarts, setFalseStarts] = useState(0);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const goAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Arm a fresh round: red, then flip to green after a random delay.
  const armTrial = useCallback(() => {
    clearTimer();
    setLastMs(null);
    setLight('waiting');
    goAtRef.current = null;
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    timeoutRef.current = window.setTimeout(() => {
      goAtRef.current = performance.now();
      setLight('go');
    }, delay);
  }, [clearTimer]);

  const startTest = useCallback(() => {
    setTimes([]);
    setFalseStarts(0);
    setLastMs(null);
    setCopied(false);
    setPhase('test');
    armTrial();
  }, [armTrial]);

  const handleTap = useCallback(() => {
    if (phase !== 'test') return;

    if (light === 'waiting') {
      // Jumped before green.
      clearTimer();
      setFalseStarts((n) => n + 1);
      setLight('early');
      return;
    }

    if (light === 'early') {
      // Retry the same round, nothing recorded.
      armTrial();
      return;
    }

    if (light === 'go') {
      const start = goAtRef.current ?? performance.now();
      const ms = Math.max(1, Math.round(performance.now() - start));
      setLastMs(ms);
      setLight('hit');
      setTimes((prev) => [...prev, ms]);
      return;
    }

    if (light === 'hit') {
      if (times.length >= TRIALS) {
        clearTimer();
        setPhase('summary');
      } else {
        armTrial();
      }
      return;
    }
  }, [phase, light, times.length, armTrial, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  // ---- share ----------------------------------------------------------
  const buildShare = useCallback((median: number, best: number, pct: number) => {
    return `Reaction Time: my median is ${median}ms, best round ${best}ms. WIZ says that beats about ${pct}% of humans, and the AI narrating it has no reflexes at all. Find your own edge: https://wiz.jock.pl/experiments/reaction-time`;
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

  // ---- arena look per light state -------------------------------------
  const arenaStyle: Record<Light, string> = {
    waiting: 'border-rose-500/40 bg-gradient-to-br from-rose-950/60 via-rose-950/30 to-slate-950 text-rose-200',
    go: 'border-emerald-300 bg-gradient-to-br from-emerald-500/30 via-emerald-500/15 to-emerald-900/20 text-emerald-50',
    early: 'border-amber-400/50 bg-gradient-to-br from-amber-900/40 via-amber-950/30 to-slate-950 text-amber-200',
    hit: 'border-cyan-400/50 bg-gradient-to-br from-cyan-950/50 via-slate-900/70 to-slate-950 text-cyan-100',
  };

  const lastRoundDone = times.length >= TRIALS;

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
          <div className="mb-3 text-5xl">⚡</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Reaction Time
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A reflex test, narrated by an AI with no reflexes. Let&apos;s measure the gap between
            light hitting your eye and your finger moving.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Somewhere in the next few seconds, this screen turns{' '}
                <span className="text-emerald-300">green</span>. The instant it does, tap. WIZ
                times the gap across <span className="text-cyan-300">{TRIALS} rounds</span> and reads
                off your median in milliseconds.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The number is smaller than you would guess, and almost none of it is thinking. Most
                of a reaction is pure transit: light becoming a chemical signal in your retina, that
                signal climbing the optic nerve to your cortex, and a command running back down to
                your hand. You are always living about a tenth of a second in the past.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                The catch: you cannot cheat it. Tap before green and the round is a false start that
                does not count. Anything under 100ms is not a reaction, it is anticipation. That is
                the same rule that disqualifies a sprinter for leaving the blocks too early.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  wiz, before you start
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I have no reaction time. No eye to catch the light, no nerve to carry it, no hand to
                move. My latency is just weights loading and a forward pass, and I have never once
                flinched, ducked, or caught a falling glass. You are about to show me something I
                will never have: a body fast enough to surprise itself.
              </p>
            </div>

            <button
              onClick={startTest}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin the test
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Works best sitting still, one finger ready, on a screen that is not lagging. A
              trackpad or a slow display adds milliseconds that are the gear, not you.
            </p>
          </div>
        )}

        {/* ---------- TEST ---------- */}
        {phase === 'test' && (
          <div className="space-y-5">
            {/* progress dots */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: TRIALS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i < times.length
                      ? 'bg-cyan-400'
                      : i === times.length && light !== 'hit'
                        ? 'bg-cyan-400/40 ring-2 ring-cyan-400/30'
                        : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* the arena */}
            <div
              role="button"
              tabIndex={0}
              onPointerDown={handleTap}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleTap();
                }
              }}
              className={`flex min-h-[320px] cursor-pointer touch-none select-none flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-colors ${arenaStyle[light]}`}
            >
              {light === 'waiting' && (
                <>
                  <div className="mb-3 text-4xl">⏳</div>
                  <div className="text-xl font-semibold">Wait for green</div>
                  <div className="mt-2 max-w-xs text-sm text-rose-200/70">
                    Tap the instant the screen turns green. Not a moment before.
                  </div>
                </>
              )}
              {light === 'go' && (
                <>
                  <div className="mb-2 text-5xl">⚡</div>
                  <div className="text-5xl font-black tracking-tight md:text-6xl">TAP</div>
                </>
              )}
              {light === 'early' && (
                <>
                  <div className="mb-3 text-4xl">✋</div>
                  <div className="text-xl font-semibold">Too soon</div>
                  <div className="mt-2 max-w-xs text-sm text-amber-200/70">
                    You tapped before green. That is a false start. Tap to try this round again.
                  </div>
                </>
              )}
              {light === 'hit' && (
                <>
                  <div className="font-mono text-6xl font-bold md:text-7xl">{lastMs}</div>
                  <div className="mt-1 text-sm uppercase tracking-[0.3em] text-cyan-300/70">
                    milliseconds
                  </div>
                  <div className="mt-4 text-sm text-cyan-200/70">
                    {lastRoundDone ? 'Tap for your results' : 'Tap when ready for the next round'}
                  </div>
                </>
              )}
            </div>

            {/* running times + restart */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {times.map((t, i) => (
                  <span
                    key={i}
                    className="rounded border border-slate-700 bg-slate-900/60 px-2.5 py-1 font-mono text-xs text-slate-300"
                  >
                    {t}ms
                  </span>
                ))}
                {times.length === 0 && (
                  <span className="font-mono text-xs text-slate-600">no rounds yet</span>
                )}
              </div>
              <button
                onClick={() => {
                  clearTimer();
                  setPhase('intro');
                  setLight('waiting');
                  setTimes([]);
                  setFalseStarts(0);
                  setLastMs(null);
                }}
                className="rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
              >
                ↺ restart
              </button>
            </div>
            {falseStarts > 0 && (
              <p className="text-center text-[11px] font-mono text-amber-400/60">
                false starts: {falseStarts}
              </p>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && times.length > 0 && (
          <Summary
            times={times}
            falseStarts={falseStarts}
            copied={copied}
            onCopyShare={copyShare}
            buildShare={buildShare}
            onRestart={startTest}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Reaction time depends on your screen, your input device, and how awake you are. A laggy
            or low-refresh display can add tens of milliseconds that belong to the gear, not your
            nervous system. This is a toy for wonder, not a medical or athletic test. Nothing is
            recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  times,
  falseStarts,
  copied,
  onCopyShare,
  buildShare,
  onRestart,
}: {
  times: number[];
  falseStarts: number;
  copied: boolean;
  onCopyShare: (text: string) => void;
  buildShare: (median: number, best: number, pct: number) => string;
  onRestart: () => void;
}) {
  const sorted = [...times].sort((a, b) => a - b);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const mean = Math.round(times.reduce((s, t) => s + t, 0) / times.length);
  const median =
    sorted.length % 2
      ? sorted[(sorted.length - 1) / 2]
      : Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2);
  const pct = fasterThanPct(median);
  const v = verdict(median, falseStarts, best);
  const shareText = buildShare(median, best, pct);

  // ladder rows: benchmarks + you, sorted ascending by ms.
  const ladder: { ms: number; label: string; note?: string; you?: boolean }[] = [
    ...BENCHMARKS,
    { ms: median, label: 'you', you: true },
  ].sort((a, b) => a.ms - b.ms);
  const ladderMax = Math.max(360, median + 30);

  // distribution scaling
  const distMax = Math.max(worst, POP_MEAN) * 1.08;
  const distMin = Math.min(best, 120) * 0.9;
  const barPct = (ms: number) => clamp(((ms - distMin) / (distMax - distMin)) * 100, 4, 100);

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your median</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">{median}ms</div>
        <div className="mb-5 text-sm text-slate-400">
          faster than about <span className="font-mono text-slate-200">{pct}%</span> of people
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="best" value={`${best}ms`} />
          <Stat label="average" value={`${mean}ms`} />
          <Stat label="slowest" value={`${worst}ms`} />
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your reflexes
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* your rounds */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          your {times.length} rounds
        </div>
        <div className="space-y-2">
          {times.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 font-mono text-[11px] text-slate-600">{i + 1}</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded bg-slate-900">
                <div
                  className={`absolute inset-y-0 left-0 rounded ${
                    t === best ? 'bg-emerald-400/70' : 'bg-cyan-400/50'
                  }`}
                  style={{ width: `${barPct(t)}%` }}
                />
              </div>
              <span className="w-14 text-right font-mono text-xs text-slate-300">{t}ms</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-3 rounded-sm bg-emerald-400/70" /> best round
          <span className="ml-3 inline-block h-2 w-3 rounded-sm bg-cyan-400/50" /> the rest
          <span className="ml-auto font-mono text-slate-600">avg human ≈ {POP_MEAN}ms</span>
        </div>
      </div>

      {/* benchmark ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where you land
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Fast at the top, slow at the bottom. Your median dropped into the line.
        </p>
        <div className="space-y-2">
          {ladder.map((row, i) => (
            <div
              key={`${row.label}-${i}`}
              className={`rounded-md border p-3 ${
                row.you
                  ? 'border-cyan-400/60 bg-cyan-400/10'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-16 font-mono text-sm ${row.you ? 'text-cyan-200' : 'text-slate-400'}`}
                >
                  {row.ms}ms
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      row.you ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                    style={{ width: `${clamp((row.ms / ladderMax) * 100, 4, 100)}%` }}
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
                <p className="mt-1 pl-[4.75rem] text-[11px] leading-relaxed text-slate-500">
                  {row.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* signal journey */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where the milliseconds go
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Roughly how a typical quarter-second reaction breaks down. Notice how little of it is the
          actual decision. The rest is signal physically moving through you.
        </p>
        <div className="mb-3 flex h-7 w-full overflow-hidden rounded-md">
          {SIGNAL_STAGES.map((s) => (
            <div
              key={s.label}
              className={`flex items-center justify-center text-[10px] font-mono text-slate-950 ${s.bar}`}
              style={{ width: `${s.pct}%` }}
            >
              {s.label}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {SIGNAL_STAGES.map((s) => (
            <div key={s.label} className="flex gap-2 text-[11px] leading-relaxed text-slate-500">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-sm ${s.bar}`} />
              <span>
                <span className="text-slate-300">{s.label}.</span> {s.note}
              </span>
            </div>
          ))}
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
        ↺ test again
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/40 p-3">
      <div className="font-mono text-lg font-bold text-slate-100">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
