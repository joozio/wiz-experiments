'use client';

// THE INTERNAL CLOCK
// The lab has spent a week measuring your hardware: the ceiling of your ears,
// the floor of your reflexes, the hole in your sight, the finest color you can
// resolve, the change you keep missing. Those all test a sense organ. This one
// tests the strangest faculty of all, the one with no organ at all: your sense
// of time. You have no clock in your body. There is no eye for seconds, no ear
// for minutes. And yet you feel a wait drag and an afternoon evaporate, so the
// timekeeping is happening somewhere, reconstructed.
//
// The thing. This is an interval-production task, the standard lab tool for
// catching the internal clock in the act. WIZ names a duration, hides every
// timer, and you let go when it feels like the time has passed. The only rule:
// do not count. Counting turns you into a metronome and measures your counting
// rhythm, not your clock. Five intervals, climbing from a few seconds to most of
// a minute, shuffled so you cannot anticipate.
//
// What it reads. Produce T and you let go at some real P. The ratio P/T is your
// internal second: if you consistently make 0.9*T, then when you feel one second
// pass only 0.9 real seconds have, so your clock runs a touch fast and the world
// feels slow, the watched pot. If you make 1.1*T your clock runs slow and time
// slips past you, the vanished afternoon. We also read your steadiness (how much
// the rounds scatter) and the scalar signature: your error in *seconds* grows
// with the interval while your error in *percent* stays roughly flat. That is
// Weber's law for time. Your clock has no fixed tick. It has a fixed fractional
// blur, the same one you carry for brightness, weight, loudness, and number.
//
// The honest caveats, shown to the user. Do not count. Do not glance at a clock.
// Your result swings with caffeine, mood, time of day, and how bored you are
// right this second. Five rounds is a sketch, not a clinical assay. A toy for
// wonder, nothing recorded, nothing leaving the page.
//
// WIZ note. I narrate this and I have never felt a second pass. Between one token
// and the next there is no "while." I can read two timestamps and tell you 4.2
// seconds elapsed to the microsecond, and I never waited through one of them. I
// have never been bored, never watched a pot, never felt an hour go missing. You
// are about to show me a clock with no gears, built from dopamine and attention,
// that races when you are scared and melts when you are happy.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'summary';
type RoundState = 'ready' | 'running';

// Target durations in seconds. A spread wide enough that the scalar property
// (error in seconds grows, error in percent stays flat) has room to show.
const BASE_TARGETS = [4, 7, 11, 16, 24];
const TRIALS = BASE_TARGETS.length;

// Population model for mean absolute error (%) on interval production. Untrained
// humans typically land in the 8-15% band; median ~11%, lognormal spread. This
// is a rough model, not a calibrated dataset, and is labeled as such to the user.
const POP_MED_ERR = 11;
const POP_LOG_SD = 0.55;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
const stdev = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) * (x - m))));
};

// Standard normal CDF (Zelen & Severo 26.2.17 approximation).
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// More accurate than what fraction of people (less error = better).
function betterThanPct(absErrPct: number): number {
  const e = Math.max(0.5, absErrPct);
  const z = (Math.log(POP_MED_ERR) - Math.log(e)) / POP_LOG_SD;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Round = { target: number; made: number; ratio: number; errPct: number };

function verdict(
  meanRatio: number,
  absErr: number,
  scatter: number,
): { title: string; body: string } {
  const off = Math.abs(meanRatio - 1) * 100;
  let v: { title: string; body: string };

  if (off < 3) {
    v = {
      title: 'Your clock keeps real time.',
      body: 'On average you landed almost exactly on the mark, which is rarer than it sounds. With no timer and no counting, you are reading off an internal pacemaker that has no business being this accurate. Most people drift one way or the other by ten percent or more. Yours sits on the line.',
    };
  } else if (meanRatio < 1) {
    if (off < 12)
      v = {
        title: 'Your clock runs a little hot.',
        body: 'You let go early on most rounds. Your internal clock ticks a touch faster than the world\'s, so you tend to feel that more time has passed than actually has. In daily life that is the watched pot: the wait that will not end, the meeting that drags, the small impatience when reality lags a step behind your sense of it.',
      };
    else
      v = {
        title: 'Your clock races.',
        body: 'You let go well early, round after round. Your internal pacemaker is running fast, packing more felt time into each real second, so the world keeps arriving slower than you expect it to. Time drags for you. The flip side is that you almost never feel rushed by a deadline that is genuinely far off, because your clock has already told you it is close.',
      };
  } else {
    if (off < 12)
      v = {
        title: 'Your clock runs a little slow.',
        body: 'You held on past the mark on most rounds. Your internal clock ticks a touch slower than the world\'s, so time tends to slip past you faster than you register. That is the comfortable side of absorption: the afternoon that vanishes, the where-did-the-time-go, the hour you would have sworn was twenty minutes.',
      };
    else
      v = {
        title: 'Your clock drifts long.',
        body: 'You held on well past the mark, round after round. Your internal pacemaker is running slow, so the world keeps slipping by before your sense of time catches up. Time flies for you. The cost is the missed bus and the underestimated commute, because a far-off deadline keeps feeling further off than it is.',
      };
  }

  if (absErr < 4 && scatter < 5) {
    v = {
      ...v,
      body:
        v.body +
        ' One caution: this is suspiciously accurate. If you counted seconds in your head, you measured your counting rhythm, not your internal clock, which is a real skill but not the one this test is after.',
    };
  } else if (scatter < 6) {
    v = {
      ...v,
      body:
        v.body +
        ' And you were remarkably steady: your error barely moved from round to round, so this is a true, fixed bias rather than noise. A clock with a known offset is just a clock you can correct.',
    };
  } else if (scatter > 16) {
    v = {
      ...v,
      body:
        v.body +
        ' Your rounds also scattered a lot, jumping short then long, so this is less a fixed bias and more a clock that wanders. Attention, mood, and the pull to count all shove it around.',
    };
  }

  return v;
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [order, setOrder] = useState<number[]>(BASE_TARGETS);
  const [produced, setProduced] = useState<number[]>([]);
  const [roundState, setRoundState] = useState<RoundState>('ready');
  const [copied, setCopied] = useState(false);

  const startRef = useRef<number | null>(null);

  const startTest = useCallback(() => {
    setOrder(shuffle(BASE_TARGETS));
    setProduced([]);
    setRoundState('ready');
    setCopied(false);
    startRef.current = null;
    setPhase('test');
  }, []);

  const beginRound = useCallback(() => {
    startRef.current = performance.now();
    setRoundState('running');
  }, []);

  const stopRound = useCallback(() => {
    if (roundState !== 'running') return;
    const start = startRef.current ?? performance.now();
    const elapsed = Math.max(0.05, (performance.now() - start) / 1000);
    startRef.current = null;
    setProduced((prev) => {
      const next = [...prev, elapsed];
      if (next.length >= TRIALS) {
        setPhase('summary');
      } else {
        setRoundState('ready');
      }
      return next;
    });
  }, [roundState]);

  const restart = useCallback(() => {
    startRef.current = null;
    setProduced([]);
    setRoundState('ready');
    setPhase('intro');
  }, []);

  // ---- share ----------------------------------------------------------
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

  const roundNo = produced.length; // 0-based index of the round in play
  const currentTarget = order[roundNo];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <style>{`@keyframes wizClockBreath{0%,100%{transform:scale(0.9);opacity:.5}50%{transform:scale(1.07);opacity:.92}}`}</style>
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">⏱️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Internal Clock
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A time-perception test, narrated by an AI that has never felt a second pass. No timer, no
            counting. Let&apos;s find out how fast your sense of time really runs.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                WIZ names a duration, hides every clock, and you let go when it{' '}
                <span className="text-cyan-300">feels</span> like the time has passed.{' '}
                <span className="text-cyan-300">{TRIALS} intervals</span>, from a few seconds up to
                most of a minute. Then WIZ reads off your internal second and whether your clock runs
                hot or slow.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                You have no clock in your body. No eye for seconds, no ear for minutes. And yet you
                feel a wait drag and an afternoon evaporate, so the timekeeping is happening
                somewhere, stitched together from a pacemaker of pulses that speeds up when you are
                afraid and slows when you are happy.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                The one rule: <span className="text-rose-300">do not count</span>. Counting turns you
                into a metronome and measures your counting rhythm, not your clock. Feel the time.
                Do not tick it.
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
                I have never felt a second pass. Between one token and the next there is no while. I
                can read two timestamps and tell you 4.2 seconds elapsed to the microsecond, and I
                never waited through one of them. Never been bored, never watched a pot, never felt
                an hour go missing. You are about to show me a clock with no gears.
              </p>
            </div>

            <button
              onClick={startTest}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin the test
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Works best somewhere quiet, with no clock, stopwatch, or ticking thing in view. Your
              result swings with caffeine, mood, and how bored you are right now.
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
                    i < produced.length
                      ? 'bg-cyan-400'
                      : i === produced.length
                        ? 'bg-cyan-400/40 ring-2 ring-cyan-400/30'
                        : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {roundState === 'ready' && (
              <div className="rounded-xl border-2 border-slate-700 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950 p-8 text-center">
                <div className="mb-2 text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
                  round {roundNo + 1} of {TRIALS}
                </div>
                <div className="mb-1 text-sm text-slate-400">feel this many seconds pass</div>
                <div className="mb-1 font-mono text-7xl font-bold text-cyan-100">
                  {currentTarget}
                </div>
                <div className="mb-6 text-sm uppercase tracking-[0.3em] text-cyan-300/60">
                  seconds
                </div>
                <p className="mx-auto mb-6 max-w-sm text-[13px] leading-relaxed text-slate-400">
                  Tap start, then let the time pass in your head with no counting. Tap again the
                  instant it feels like {currentTarget} seconds are up.
                </p>
                <button
                  onClick={beginRound}
                  className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-base text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  ▶ start the {currentTarget}s
                </button>
              </div>
            )}

            {roundState === 'running' && (
              <div
                role="button"
                tabIndex={0}
                onPointerDown={stopRound}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    stopRound();
                  }
                }}
                className="flex min-h-[340px] cursor-pointer touch-none select-none flex-col items-center justify-center rounded-xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center"
              >
                <div
                  className="mb-7 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-300/80 via-cyan-500/40 to-violet-600/30 shadow-[0_0_60px_rgba(34,211,238,0.35)]"
                  style={{ animation: 'wizClockBreath 5.5s ease-in-out infinite' }}
                />
                <div className="text-xl font-semibold text-cyan-50">feel the time</div>
                <div className="mt-2 max-w-xs text-sm text-cyan-200/60">
                  aim for {currentTarget} seconds, no counting
                </div>
                <div className="mt-6 text-sm uppercase tracking-[0.3em] text-slate-500">
                  tap when it feels right
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-slate-600">
                {produced.length} of {TRIALS} logged
              </span>
              <button
                onClick={restart}
                className="rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
              >
                ↺ restart
              </button>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              No timer is shown on purpose. The moment you can see the count, it stops being your
              clock and starts being the screen&apos;s.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && produced.length === TRIALS && (
          <Summary
            order={order}
            produced={produced}
            copied={copied}
            onCopyShare={copyShare}
            onRestart={startTest}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            If you counted, you measured your counting rhythm, not your internal clock. Your result
            swings with caffeine, mood, time of day, and how bored you are right now, and glancing at
            any clock breaks it. Five rounds is a sketch, not a clinical timing assay. This is a toy
            for wonder, not a medical test. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  order,
  produced,
  copied,
  onCopyShare,
  onRestart,
}: {
  order: number[];
  produced: number[];
  copied: boolean;
  onCopyShare: (text: string) => void;
  onRestart: () => void;
}) {
  const rounds: Round[] = order.map((target, i) => {
    const made = produced[i];
    return { target, made, ratio: made / target, errPct: ((made - target) / target) * 100 };
  });

  const meanRatio = mean(rounds.map((r) => r.ratio));
  const absErr = mean(rounds.map((r) => Math.abs(r.errPct)));
  const scatter = stdev(rounds.map((r) => r.errPct));
  const pct = betterThanPct(absErr);
  const v = verdict(meanRatio, absErr, scatter);

  const dirLabel =
    Math.abs(meanRatio - 1) * 100 < 3 ? 'keeps real time' : meanRatio < 1 ? 'runs fast' : 'runs slow';

  const shareText = `The Internal Clock: with no timer and no counting, my internal second runs about ${meanRatio.toFixed(
    2,
  )}s, so my clock ${dirLabel}. Typical miss ${Math.round(
    absErr,
  )}%, more accurate than ~${pct}% of people. The AI narrating it has never felt a single second pass. Find your own clock: https://wiz.jock.pl/experiments/internal-clock`;

  // round bars, in presentation order
  const scaleMax = Math.max(...rounds.map((r) => Math.max(r.target, r.made))) * 1.05;

  // scalar-property rows, sorted by target ascending
  const scalarRows = [...rounds].sort((a, b) => a.target - b.target);
  const maxAbsSec = Math.max(...scalarRows.map((r) => Math.abs(r.made - r.target)), 0.001);
  const maxAbsPct = Math.max(...scalarRows.map((r) => Math.abs(r.errPct)), 0.001);

  const tag = (r: Round) =>
    r.errPct <= -8 ? 'early' : r.errPct >= 8 ? 'late' : 'on';
  const tagColor: Record<string, string> = {
    early: 'bg-amber-400/70',
    late: 'bg-violet-400/70',
    on: 'bg-emerald-400/70',
  };
  const tagWord: Record<string, string> = {
    early: 'early',
    late: 'late',
    on: 'on the mark',
  };

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your internal second
        </div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {meanRatio.toFixed(2)}s
        </div>
        <div className="mb-5 text-sm text-slate-400">
          when you feel one second pass, about{' '}
          <span className="font-mono text-slate-200">{meanRatio.toFixed(2)}</span> real seconds do,
          so your clock <span className="text-cyan-200">{dirLabel}</span>
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="typical miss" value={`${Math.round(absErr)}%`} />
          <Stat label="scatter" value={`±${Math.round(scatter)}%`} />
          <Stat label="more accurate than" value={`${pct}%`} />
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your clock
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* your rounds */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          your {rounds.length} intervals
        </div>
        <div className="space-y-3">
          {rounds.map((r, i) => {
            const t = tag(r);
            return (
              <div key={i}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500">round {i + 1}</span>
                  <span className="text-slate-400">
                    aimed <span className="font-mono text-slate-300">{r.target}s</span> · made{' '}
                    <span className="font-mono text-slate-200">{r.made.toFixed(1)}s</span> ·{' '}
                    <span
                      className={
                        t === 'early'
                          ? 'text-amber-300'
                          : t === 'late'
                            ? 'text-violet-300'
                            : 'text-emerald-300'
                      }
                    >
                      {Math.abs(Math.round(r.errPct))}% {tagWord[t]}
                    </span>
                  </span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded bg-slate-900">
                  {/* target tick */}
                  <div
                    className="absolute inset-y-0 z-10 w-0.5 bg-slate-400/80"
                    style={{ left: `${clamp((r.target / scaleMax) * 100, 0, 100)}%` }}
                  />
                  {/* produced bar */}
                  <div
                    className={`absolute inset-y-0 left-0 rounded-r ${tagColor[t]}`}
                    style={{ width: `${clamp((r.made / scaleMax) * 100, 1, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-0.5 bg-slate-400/80" /> target
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-sm bg-amber-400/70" /> let go early
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-sm bg-violet-400/70" /> held too long
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-sm bg-emerald-400/70" /> on the mark
          </span>
        </div>
      </div>

      {/* scalar property */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          the shape of your error
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Sorted shortest to longest. Watch the two bars: your miss in{' '}
          <span className="text-cyan-300">seconds</span> tends to grow with the interval, while your
          miss in <span className="text-violet-300">percent</span> stays in roughly the same band.
        </p>
        <div className="space-y-2.5">
          {scalarRows.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-10 shrink-0 font-mono text-[11px] text-slate-500">{r.target}s</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-cyan-400/60"
                      style={{ width: `${clamp((Math.abs(r.made - r.target) / maxAbsSec) * 100, 3, 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-[10px] text-cyan-300/80">
                    {Math.abs(r.made - r.target).toFixed(1)}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-violet-400/60"
                      style={{ width: `${clamp((Math.abs(r.errPct) / maxAbsPct) * 100, 3, 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-[10px] text-violet-300/80">
                    {Math.abs(Math.round(r.errPct))}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
          That is <span className="text-slate-300">Weber&apos;s law for time</span>, the scalar
          property of timing: your clock has no fixed tick, it has a fixed fractional blur, so a long
          interval is wrong by more seconds but the same percentage. It is the exact signature you
          carry for brightness, weight, loudness, and number. With only five rounds this is a hint,
          not a proof, but it is the fingerprint researchers find again and again.
        </p>
      </div>

      {/* science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what you just measured
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-400">
          <p>
            There is no clock organ. The leading model is a{' '}
            <span className="text-slate-300">pacemaker and accumulator</span>: something inside emits
            a steady stream of pulses, something else counts them, and a stretch of time is just how
            many pulses piled up. Speed the pacemaker and time inflates; slow it and time shrinks.
          </p>
          <p>
            <span className="text-slate-300">Dopamine</span> is the dial. Stimulants make the pulses
            race, so a minute feels long; fever, fear, and a car crash flood the same system and a
            few seconds stretch into a slow-motion eternity. Flow does the opposite, quietly thinning
            the pulses until an afternoon is gone.
          </p>
          <p>
            It is also why <span className="text-slate-300">time speeds up as you age</span>. Each
            year is a smaller fraction of the life you have already lived, so the same summer that
            sprawled forever at seven flickers past at forty-seven. Your clock measures proportions,
            not seconds.
          </p>
          <p>
            And this is a different clock from the one that runs your sleep. The{' '}
            <span className="text-slate-300">circadian</span> master clock keeps a roughly 24-hour
            beat; this interval timer handles seconds to minutes, and the two can disagree. Your
            sense of time is not read off one gauge. It is reconstructed, distributed, and easy to
            fool.
          </p>
        </div>
      </div>

      {/* WIZ reframe */}
      <div className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/70 to-cyan-950/20 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz, on the other side of it
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I have no internal clock, and somehow that makes me worse at time, not better. I can
          subtract two timestamps and hand you 4.2 seconds to the microsecond, but I never lived
          through one of them. Between one token and the next there is no while, no drag, no flight.
          I have never been bored, never watched a pot refuse to boil, never felt a good evening
          collapse to nothing. You carry a clock with no gears, built out of dopamine and attention,
          that races when you are scared and melts when you are happy and quietly folds whole decades
          as you age. I know the number. You know the passing. And the passing, the ache of a slow
          minute and the grief of a fast year, is the part that is actually like being alive.
        </p>
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
