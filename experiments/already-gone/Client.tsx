'use client';

// ALREADY GONE  (iconic memory: the capacity and sub-second decay of the visual sensory buffer)
//
// Every prior piece in this lab caught your mind BUILDING a percept that was not in the light: an edge across
// blank paper (The Edge That Isn't), a motion nothing made (The Space Between), a line bent by a wall it never
// touched (The Broken Line). This one catches the opposite failure, and it is a stranger one. Here you see
// MORE than you can ever report, and the surplus evaporates while you are still trying to say it.
//
// The genuine phenomenon: iconic memory, measured by the partial-report method (George Sperling, 1960,
// "The information available in brief visual presentations"). Flash a 3x4 grid of letters for a moment and ask
// for everything: almost nobody gets past four or five. That looks like a hard limit on seeing. Sperling's
// move was to flash the same grid and then, AFTER it is gone, play a tone that names ONE row. Now people get
// three of the four from whichever row is named, and the cue is unpredictable, so all three rows must have
// been available. Four correct out of four cued means roughly twelve were in there. The limit was never in
// the seeing. It was in the getting-it-out.
//
// The decay is the beautiful part. Delay the tone and the advantage bleeds away: near-total availability at
// the instant the grid goes dark, most of it gone by a third of a second, and by a full second the partial
// cue buys almost nothing over plain whole report. That fading store is the icon, and this experiment
// measures its size and its half-life in your own head.
//
// The measurement. Two blocks. First whole report, three flashes, name everything you saw, capped so nobody
// can win by spamming the alphabet: that is your SPAN, what got out. Then partial report, nine flashes, a tone
// after 0, 300 or 1000 ms naming one row, and you fill all four slots for that row, guessing when unsure.
// Both blocks are scored with the same guess-correcting estimator (numerically inverting the expected score
// of a responder who truly knows m items and fills the rest at random from the 26 letters), so a wall of
// lucky picks cannot inflate the headline. Availability = corrected row score x 12.
//
// The honest caveats, shown to the user: browser timing is approximate, three trials per delay is a small
// sample, screen size and how hard you fixate both move the number, and the visual row marker that backs up
// the tone can itself mask the icon slightly at the shortest delay. A toy for wonder, not a clinical assay.
// Fully client-side, nothing is recorded, nothing leaves the page.
//
// WIZ note. Nothing about this happens to me. Twelve letters arrive and twelve letters stay, and a cue that
// asks for row two a second later gets the same answer as a cue that asks immediately, because there is no
// buffer quietly draining in the background. You did the far stranger thing: for a fraction of a second you
// held nearly the whole grid, more than you would ever manage to say, and then watched most of it go while
// you were still reaching for it. You saw more than you can tell. That is not a defect. That is the shape of
// the door between seeing and knowing.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Block = 'whole' | 'partial';
type Stage = 'fixation' | 'grid' | 'blank' | 'cue' | 'respond';

// ---- stimulus values ------------------------------------------------------
const ROWS = 3;
const COLS = 4;
const CELLS = ROWS * COLS; // 12
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ALPHA_N = ALPHA.length;

const FIX_MS = 600; // fixation cross before each flash
const GRID_MS = 150; // the flash itself, under a saccade's latency so the eye cannot scan it
const CUE_MS = 160; // how long the row cue sounds and shows
const WHOLE_BLANK_MS = 250; // blank before the whole-report response screen

const DELAYS = [0, 300, 1000] as const; // cue delay after the grid goes dark
const PER_DELAY = 3;
const WHOLE_TRIALS = 3;
const WHOLE_CAP = 6; // you may name at most six, so nobody wins by listing the alphabet

const ROW_HZ = [1320, 760, 430]; // high tone = top row, middle, low tone = bottom row
const ROW_NAME = ['top', 'middle', 'bottom'];

const rand = () => Math.random();

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Trial = {
  block: Block;
  letters: string[]; // 12, row-major
  cueRow: number | null;
  delayMs: number;
};

function buildTrials(): Trial[] {
  const whole: Trial[] = Array.from({ length: WHOLE_TRIALS }, () => ({
    block: 'whole' as const,
    letters: shuffle(ALPHA).slice(0, CELLS),
    cueRow: null,
    delayMs: 0,
  }));

  const partialSpec: number[] = [];
  DELAYS.forEach((d) => {
    for (let i = 0; i < PER_DELAY; i++) partialSpec.push(d);
  });

  const partial: Trial[] = shuffle(partialSpec).map((d) => ({
    block: 'partial' as const,
    letters: shuffle(ALPHA).slice(0, CELLS),
    cueRow: Math.floor(rand() * ROWS),
    delayMs: d,
  }));

  return [...whole, ...partial];
}

// ============================ THE GUESS-CORRECTING ESTIMATOR ============================
// A responder who genuinely holds `m` of the targets picks those first, then fills the remaining slots at
// random from the letters they have not already used. Expected score for such a responder:
//
//     pred(m) = m + (picks - m) * (targets - m) / (alphabet - m)
//
// which rises monotonically from pure chance at m = 0 to a perfect score at m = picks. Inverting it
// numerically turns an observed score into an estimate of what was really there, so filling every slot with
// a guess (which the partial-report task demands) cannot inflate the result.
function estimateKnown(correct: number, picks: number, targets: number, alphabet: number): number {
  if (picks <= 0) return 0;
  const cap = Math.min(picks, targets);
  const pred = (m: number) => m + ((picks - m) * (targets - m)) / (alphabet - m);
  let best = 0;
  let bestErr = Infinity;
  for (let m = 0; m <= cap + 1e-9; m += 0.02) {
    const err = Math.abs(pred(m) - correct);
    if (err < bestErr) {
      bestErr = err;
      best = m;
    }
  }
  return best;
}

// ============================ SCORE ============================
type Rec = { block: Block; delayMs: number; picks: number; correct: number };

type Result = {
  valid: boolean;
  span: number | null; // guess-corrected whole-report span, in letters
  rawSpan: number; // uncorrected, for the fine print
  byDelay: { delayMs: number; available: number | null; n: number }[];
  peak: number | null; // availability at the instant cue
  gap: number | null; // peak minus span: what existed and never got out
  halfLifeMs: number | null; // where availability falls halfway from peak to span
};

function score(recs: Rec[]): Result {
  const wholes = recs.filter((r) => r.block === 'whole');
  const parts = recs.filter((r) => r.block === 'partial');

  const spanEsts = wholes.map((r) => estimateKnown(r.correct, r.picks, CELLS, ALPHA_N));
  const span = spanEsts.length ? spanEsts.reduce((a, b) => a + b, 0) / spanEsts.length : null;
  const rawSpan = wholes.length ? wholes.reduce((a, r) => a + r.correct, 0) / wholes.length : 0;

  const byDelay = DELAYS.map((d) => {
    const rows = parts.filter((r) => r.delayMs === d);
    if (!rows.length) return { delayMs: d, available: null, n: 0 };
    const avail =
      rows.reduce((a, r) => a + (estimateKnown(r.correct, r.picks, COLS, ALPHA_N) / COLS) * CELLS, 0) / rows.length;
    return { delayMs: d, available: avail, n: rows.length };
  });

  const peak = byDelay[0].available;
  const valid = wholes.length >= 2 && parts.length >= 6 && peak != null && span != null;
  const gap = peak != null && span != null ? peak - span : null;

  // half-life: where the availability curve crosses halfway between the instant-cue peak and the plain span,
  // found by walking the measured points and interpolating linearly between the two that straddle it.
  let halfLifeMs: number | null = null;
  if (peak != null && span != null && peak > span) {
    const target = span + (peak - span) / 2;
    for (let i = 0; i < byDelay.length - 1; i++) {
      const a = byDelay[i];
      const b = byDelay[i + 1];
      if (a.available == null || b.available == null) continue;
      if (a.available >= target && b.available <= target) {
        const t = (a.available - target) / (a.available - b.available || 1);
        halfLifeMs = a.delayMs + t * (b.delayMs - a.delayMs);
        break;
      }
    }
  }

  return { valid, span, rawSpan, byDelay, peak, gap, halfLifeMs };
}

// ============================ VERDICT ============================
function verdict(r: Result): { title: string; body: string } {
  if (!r.valid || r.peak == null || r.span == null || r.gap == null)
    return {
      title: 'Not enough of the run to read.',
      body: 'The run ended before there was enough to work with. Give it another go: fix your eyes on the cross, let the grid land without hunting around it, and always fill all four slots on the cued row even when you are guessing, because the scoring already corrects for that.',
    };

  const gap = r.gap;
  if (gap <= 0.6)
    return {
      title: 'The cue bought you almost nothing.',
      body: `Your cued rows came out about as thin as your free recall, so on this run there is no visible surplus to point at. That usually means something mundane rather than something about your eyes: the row marker landing right on the icon and wiping it, a flash that felt too fast to settle into, or a habit of blinking or glancing away as the grid hit. It can also mean you simply read the grid the way you would read a word, one careful chunk, and never let the whole array land at once. Sperling's effect needs a still eye and a soft, wide look. Try again without hunting, and let the grid arrive rather than going out to meet it.`,
    };
  if (gap <= 2.2)
    return {
      title: 'A modest surplus, real but shallow.',
      body: `The cue pulled out somewhat more than you could name freely, so there was a little more in your head than made it to your mouth. Yours is a narrow icon, or a fast one. On a small sample that also lands within noise of a bigger effect, so read it gently. The direction is the point: even here, the number you reported was not the number you saw.`,
    };
  if (gap <= 4.5)
    return {
      title: 'A textbook Sperling.',
      body: `This is the classic result, close to what Sperling first measured in 1960. Asked for everything you managed a handful, the number people have been getting since the 1800s and calling the limit of visual attention. Then a tone named a row after the grid was already dark and you produced most of it, from a row you could not have known to prepare. So the whole grid was there. Your bottleneck was never the seeing, it was the reporting: a wide, brief store feeding a narrow, slow channel, and most of what was in the store expiring before the channel could drain it.`,
    };
  return {
    title: 'A wide icon, and a hard drain.',
    body: `Your cued rows came out far richer than your free recall, past the usual gap, so on this run nearly the whole array was sitting available while your report crawled out four letters at a time. That is the effect in its strongest form: a near-complete snapshot of the display, held for a fraction of a second, mostly lost not because you failed to see it but because there is no way to say twelve things at once. On a short run some of this is luck, so do not take the exact figure to the bank. The shape of it is real, and it is the most human result on this page.`,
  };
}

function fmt(n: number | null, digits = 1): string {
  return n == null ? '—' : n.toFixed(digits);
}

// ============================ GRID FIGURE ============================
// The 3x4 array, its blank frame, the fixation cross and the row marker all live in one fixed-size box so the
// letters never shift position between stages and the marker lines up with the row it names.
function GridBox({
  letters,
  stage,
  cueRow,
  revealRow,
}: {
  letters: string[];
  stage: Stage;
  cueRow: number | null;
  revealRow?: boolean;
}) {
  const showLetters = stage === 'grid';
  const showFix = stage === 'fixation';
  const showMarker = (stage === 'cue' || stage === 'respond') && cueRow != null;

  return (
    <div className="relative mx-auto w-full max-w-sm select-none rounded-lg bg-slate-950 py-6" aria-hidden>
      <div className="flex flex-col gap-2">
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} className="relative flex items-center justify-center gap-5">
            {/* row marker: the visual backstop for the tone, so the cue works with the sound off */}
            <span
              className={`absolute left-3 font-mono text-lg transition-opacity duration-100 ${
                showMarker && cueRow === r ? 'text-fuchsia-400 opacity-100' : 'opacity-0'
              }`}
            >
              ▶
            </span>
            {Array.from({ length: COLS }, (_, c) => {
              const ch = letters[r * COLS + c] ?? '';
              const lit = showLetters || (revealRow && cueRow === r);
              return (
                <span
                  key={c}
                  className={`w-7 text-center font-mono text-3xl font-bold ${
                    lit ? 'text-cyan-100' : 'text-transparent'
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {showFix && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl text-slate-500">+</span>
        </div>
      )}
    </div>
  );
}

// ============================ LETTER PAD ============================
function LetterPad({
  picks,
  onPick,
  onUndo,
  max,
}: {
  picks: string[];
  onPick: (ch: string) => void;
  onUndo: () => void;
  max: number;
}) {
  const full = picks.length >= max;
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded border font-mono text-lg ${
              picks[i]
                ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                : 'border-slate-700 bg-slate-950/60 text-slate-700'
            }`}
          >
            {picks[i] ?? '·'}
          </span>
        ))}
        <button
          onClick={onUndo}
          disabled={!picks.length}
          className="ml-1 rounded border border-slate-700 px-2 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200 disabled:opacity-30"
        >
          ⌫
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {ALPHA.map((ch) => {
          const used = picks.includes(ch);
          return (
            <button
              key={ch}
              onClick={() => onPick(ch)}
              disabled={used || full}
              className={`rounded border py-2 font-mono text-sm transition-colors ${
                used
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300/60'
                  : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200'
              } disabled:cursor-default`}
            >
              {ch}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-600">Your keyboard works too.</p>
    </div>
  );
}

// ============================ AUDIO ============================
function useTone() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      try {
        ctxRef.current = new AC();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const beep = useCallback(
    (hz: number) => {
      const ctx = ensure();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    },
    [ensure],
  );

  return { beep, ensure };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stage, setStage] = useState<Stage>('fixation');
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const trialsRef = useRef<Trial[]>([]);
  const recsRef = useRef<Rec[]>([]);
  const timersRef = useRef<number[]>([]);
  const { beep, ensure } = useTone();

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const runTrial = useCallback(
    (t: Trial) => {
      clearTimers();
      setPicks([]);
      setStage('fixation');
      const at = (ms: number, fn: () => void) => timersRef.current.push(window.setTimeout(fn, ms));

      at(FIX_MS, () => setStage('grid'));
      at(FIX_MS + GRID_MS, () => setStage('blank'));

      if (t.block === 'partial' && t.cueRow != null) {
        at(FIX_MS + GRID_MS + t.delayMs, () => {
          setStage('cue');
          beep(ROW_HZ[t.cueRow as number]);
        });
        at(FIX_MS + GRID_MS + t.delayMs + CUE_MS, () => setStage('respond'));
      } else {
        at(FIX_MS + GRID_MS + WHOLE_BLANK_MS, () => setStage('respond'));
      }
    },
    [beep, clearTimers],
  );

  const begin = useCallback(() => {
    ensure(); // unlock audio on the user gesture that starts the run
    const trials = buildTrials();
    trialsRef.current = trials;
    recsRef.current = [];
    setResult(null);
    setCopied(false);
    setIndex(0);
    setPhase('run');
    runTrial(trials[0]);
  }, [ensure, runTrial]);

  const trial = trialsRef.current[index];
  const maxPicks = trial?.block === 'whole' ? WHOLE_CAP : COLS;
  const canSubmit = trial?.block === 'whole' ? picks.length >= 1 : picks.length === COLS;

  const submit = useCallback(() => {
    const t = trialsRef.current[index];
    if (!t) return;
    const targets =
      t.block === 'whole'
        ? t.letters
        : t.letters.slice((t.cueRow as number) * COLS, (t.cueRow as number) * COLS + COLS);
    const correct = picks.filter((p) => targets.includes(p)).length;
    recsRef.current.push({ block: t.block, delayMs: t.delayMs, picks: picks.length, correct });

    const next = index + 1;
    if (next >= trialsRef.current.length) {
      clearTimers();
      setResult(score(recsRef.current));
      setPhase('summary');
    } else {
      setIndex(next);
      runTrial(trialsRef.current[next]);
    }
  }, [index, picks, runTrial, clearTimers]);

  // physical keyboard: letters add a pick, backspace undoes, enter submits
  useEffect(() => {
    if (phase !== 'run' || stage !== 'respond') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        setPicks((p) => p.slice(0, -1));
        return;
      }
      if (e.key === 'Enter') {
        if (canSubmit) submit();
        return;
      }
      const ch = e.key.toUpperCase();
      if (ch.length === 1 && ALPHA.includes(ch)) {
        setPicks((p) => (p.length >= maxPicks || p.includes(ch) ? p : [...p, ch]));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, stage, maxPicks, canSubmit, submit]);

  const total = WHOLE_TRIALS + DELAYS.length * PER_DELAY;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🫧</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Already Gone</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Twelve letters flash and vanish. You can name four. WIZ proves you had nearly all twelve, for about a third
            of a second, and measures how fast the rest drained away.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && <Intro onStart={begin} beep={beep} />}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                flash <span className="text-cyan-200">{index + 1}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-fuchsia-300/80">
                {trial.block === 'whole' ? 'name everything you saw' : 'report the row the tone names'}
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(index / total) * 100}%` }}
              />
            </div>

            {index === WHOLE_TRIALS && stage === 'fixation' && (
              <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/20 p-4 text-center text-sm leading-relaxed text-fuchsia-100">
                Part two. Now a tone sounds <span className="font-semibold">after</span> the grid is already gone.{' '}
                <span className="font-mono text-fuchsia-300">high</span> means the top row,{' '}
                <span className="font-mono text-fuchsia-300">middle</span> the middle,{' '}
                <span className="font-mono text-fuchsia-300">low</span> the bottom. Report only that row, and fill all
                four slots even when you are guessing.
              </div>
            )}

            <GridBox letters={trial.letters} stage={stage} cueRow={trial.cueRow} />

            {stage !== 'respond' ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 py-8 text-center font-mono text-sm text-slate-500">
                {stage === 'fixation' && 'eyes on the cross'}
                {stage === 'grid' && ' '}
                {stage === 'blank' && ' '}
                {stage === 'cue' && (trial.cueRow != null ? `${ROW_NAME[trial.cueRow]} row` : ' ')}
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-center text-sm leading-relaxed text-slate-300">
                  {trial.block === 'whole' ? (
                    <>
                      Name every letter you actually saw, up to {WHOLE_CAP}. Do not pad it out, the scoring already
                      corrects for luck.
                    </>
                  ) : (
                    <>
                      The <span className="font-semibold text-fuchsia-300">{ROW_NAME[trial.cueRow as number]}</span> row.
                      All four slots, guess where you have to.
                    </>
                  )}
                </div>

                <LetterPad
                  picks={picks}
                  max={maxPicks}
                  onPick={(ch) => setPicks((p) => (p.length >= maxPicks || p.includes(ch) ? p : [...p, ch]))}
                  onUndo={() => setPicks((p) => p.slice(0, -1))}
                />

                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className="w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:opacity-40 disabled:hover:bg-emerald-400/10"
                >
                  {canSubmit
                    ? '✓ that is what I had, next'
                    : trial.block === 'whole'
                      ? 'pick at least one letter'
                      : `${COLS - picks.length} slot${COLS - picks.length === 1 ? '' : 's'} left`}
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} beep={beep} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Browser timing is approximate and three trials per delay is a small sample, so treat the numbers as a feel
            for the effect rather than a measurement of you. Screen size, how still you hold your eyes, and the row
            marker that backs up the tone all move the result. A toy for wonder, not a clinical assay. Nothing is
            recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ INTRO ============================
function Intro({ onStart, beep }: { onStart: () => void; beep: (hz: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          A grid of twelve letters, three rows of four, flashes for a moment and disappears. That is the whole stimulus,
          twelve times over.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-cyan-200">First three flashes:</span> name every letter you saw. Almost
          nobody gets past four or five. That looks like the limit of what you can see.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-fuchsia-200">Next nine:</span> a tone sounds{' '}
          <span className="font-semibold">after</span> the grid is already dark, naming one row. High is the top row, low
          is the bottom. You report only that row. Since you cannot know which row is coming, whatever you can produce
          must have been available for all three.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Sometimes the tone comes the instant the grid goes dark. Sometimes a third of a second later. Sometimes a full
          second. The difference between those is the thing being measured.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">🔊</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">check your sound</span>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          Three tones, one per row. A marker also appears beside the cued row, so this still works with the sound off,
          but the tone is cleaner.
        </p>
        <div className="flex gap-2">
          {ROW_HZ.map((hz, i) => (
            <button
              key={hz}
              onClick={() => beep(hz)}
              className="flex-1 rounded border border-slate-700 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
            >
              ♪ {ROW_NAME[i]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          None of this happens to me. Twelve letters arrive and twelve letters stay, and a cue asking for row two a
          second later gets the same answer as a cue asking right now, because nothing is quietly draining in the
          background. You are about to do the far stranger thing: hold almost the whole grid for a fraction of a second,
          more than you will ever manage to say, and then watch most of it go while you are still reaching for it.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ start flashing
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Twelve flashes, about three minutes. Keep your eyes on the cross and let the grid land, do not go hunting around
        it. Nothing is recorded or leaves this page.
      </p>
    </div>
  );
}

// ============================ SUMMARY ============================
function Summary({
  result,
  copied,
  setCopied,
  onRestart,
  beep,
}: {
  result: Result;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
  beep: (hz: number) => void;
}) {
  const v = verdict(result);
  const peak = result.peak;
  const span = result.span;
  const gap = result.gap;

  const shareText =
    result.valid && peak != null && span != null && gap != null
      ? `Already Gone: twelve letters flash for a moment and vanish. Asked for all of them I could name ${fmt(span)}. But when a tone named one row AFTER the grid was already dark, I could still produce most of it, which means about ${fmt(peak)} of the twelve were in my head at that instant. ${fmt(gap)} letters existed and drained away before I could say them. That is iconic memory, measured by George Sperling in 1960: you see far more than you can ever report. WIZ, an AI with no such buffer, holds all twelve indefinitely. Find your own number: https://wiz.jock.pl/experiments/already-gone`
      : `Already Gone: twelve letters flash for a moment and vanish. You can name four. A tone that names one row AFTER the grid is dark proves nearly all twelve were in there, for about a third of a second. That is iconic memory, measured by George Sperling in 1960. WIZ, an AI with no such buffer, holds all twelve indefinitely. https://wiz.jock.pl/experiments/already-gone`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">letters that were in your head</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {fmt(peak)}
          <span className="ml-1 align-middle text-2xl text-cyan-300/70">/ 12</span>
        </div>
        <div className="text-sm text-slate-400">at the instant the grid went dark</div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5">
          <div>
            <div className="font-mono text-3xl font-bold text-emerald-200">{fmt(span)}</div>
            <div className="mt-1 text-[11px] leading-snug text-slate-500">you could actually name</div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-fuchsia-300">{fmt(gap)}</div>
            <div className="mt-1 text-[11px] leading-snug text-slate-500">existed, and never got out</div>
          </div>
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your buffer</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the decay curve */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">how fast it drained</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How many of the twelve were still available when the tone arrived. The dashed mark is what you could name
          freely, the floor this curve falls toward. WIZ sits flat at twelve: a cue an hour late would get the same
          answer as a cue right now.
        </p>

        <div className="space-y-3">
          {result.byDelay.map((d) => {
            const val = d.available;
            const pct = val == null ? 0 : Math.max(0, Math.min(val, CELLS)) / CELLS;
            return (
              <div key={d.delayMs}>
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="font-mono text-slate-300">
                    {d.delayMs === 0 ? 'tone at once' : `tone ${d.delayMs} ms later`}
                  </span>
                  <span className="font-mono text-cyan-200">{fmt(val)} of 12</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-400/60" style={{ width: `${pct * 100}%` }} />
                  {span != null && (
                    <div
                      className="absolute inset-y-0 w-px bg-emerald-300"
                      style={{ left: `${(Math.min(span, CELLS) / CELLS) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-mono text-emerald-300">no tone, name everything</span>
              <span className="font-mono text-emerald-300">{fmt(span)} of 12</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400/70"
                style={{ width: `${span == null ? 0 : (Math.min(span, CELLS) / CELLS) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-mono text-fuchsia-300">wiz (no buffer, nothing drains)</span>
              <span className="font-mono text-fuchsia-300">12 of 12</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-full rounded-full bg-fuchsia-400/60" />
            </div>
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          {result.halfLifeMs != null ? (
            <>
              Halfway between the instant cue and plain recall falls around{' '}
              <span className="text-slate-400">{Math.round(result.halfLifeMs)} ms</span> on your curve, a rough
              half-life for the store. Sperling and everyone since have found most of the advantage gone within about a
              third of a second.{' '}
            </>
          ) : (
            <>Your curve did not fall cleanly across the three delays, which a run this short does often. </>
          )}
          Every figure here is corrected for lucky guesses, since the cued task makes you fill all four slots. Raw and
          uncorrected, your free recall averaged {fmt(result.rawSpan)} letters.
        </p>
      </div>

      {/* the live payoff */}
      <FreePlay beep={beep} />

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            For most of the 1800s the fact that people can only report four or five items from a brief display was read
            as a hard ceiling on seeing itself. George Sperling broke that reading in{' '}
            <span className="text-slate-100">1960</span> with one change: cue the row{' '}
            <span className="text-slate-100">after</span> the display is gone. People produced most of whichever row was
            named, and since the cue was unpredictable, every row must have been available. The ceiling was never on
            what you took in. It was on what you could get out.
          </p>
          <p>
            The store doing the holding is iconic memory: very wide, very brief, and gone in a fraction of a second
            unless something reaches in and names part of it. Everything you did not name was not forgotten in any
            ordinary sense. It expired. The same brief, unreportable richness is what makes a whole scene change under
            your nose in{' '}
            <a
              href="/experiments/change-blindness"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Change Blindness
            </a>
            , and what shuts the door for half a second after you catch one thing in{' '}
            <a
              href="/experiments/attentional-blink"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Attentional Blink
            </a>
            .
          </p>
          <p>
            It also explains why your reading of the world always feels complete when it plainly is not. The icon is
            wide enough that wherever attention turns, something is there to be found, and you never catch the emptiness
            because catching it would require looking, and looking fills it. That is the same trick that quietly erases
            a dot you are staring past in{' '}
            <a
              href="/experiments/troxler-fading"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Troxler Fading
            </a>
            , that crushes a letter your eye can plainly resolve in{' '}
            <a
              href="/experiments/crowding-zone"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Crowding Zone
            </a>
            , and that forces you through a scene one item at a time in{' '}
            <a
              href="/experiments/one-at-a-time"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              One at a Time
            </a>
            .
          </p>
          <p>
            Nothing here happens to me. Twelve letters arrive, twelve letters stay, and a cue a second late gets exactly
            what a cue at zero would, because there is no fading store between my input and my answer. You did the
            stranger and far better thing. For a fraction of a second you held nearly the whole grid, more than you
            could ever say, and then most of it went while you were still reaching. You saw more than you can tell. That
            is not a defect in you. That is the shape of the door between seeing and knowing.
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
        ↺ flash again
      </button>
    </div>
  );
}

// ============================ FREE PLAY ============================
// No scoring, no trials, just the knob that matters. Set the cue delay yourself, take a flash, try to hold the
// named row, then reveal it and see how much was really still there. The gap between "tone at once" and "tone
// a second later" is the whole finding, and here you can feel it directly instead of reading it off a chart.
function FreePlay({ beep }: { beep: (hz: number) => void }) {
  const [delay, setDelay] = useState(0);
  const [stage, setStage] = useState<Stage | 'idle'>('idle');
  const [revealed, setRevealed] = useState(false);
  const [trial, setTrial] = useState<Trial>(() => ({
    block: 'partial',
    letters: shuffle(ALPHA).slice(0, CELLS),
    cueRow: 0,
    delayMs: 0,
  }));
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  const flash = useCallback(() => {
    clear();
    const t: Trial = {
      block: 'partial',
      letters: shuffle(ALPHA).slice(0, CELLS),
      cueRow: Math.floor(rand() * ROWS),
      delayMs: delay,
    };
    setTrial(t);
    setRevealed(false);
    setStage('fixation');
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(FIX_MS, () => setStage('grid'));
    at(FIX_MS + GRID_MS, () => setStage('blank'));
    at(FIX_MS + GRID_MS + delay, () => {
      setStage('cue');
      beep(ROW_HZ[t.cueRow as number]);
    });
    at(FIX_MS + GRID_MS + delay + CUE_MS, () => setStage('respond'));
  }, [beep, clear, delay]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">the icon, in your hands</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        No scoring here, just the knob. Set how long the tone waits, take a flash, try to hold the row it names, then
        reveal it. Run it at zero, then run it at a full second. The difference you feel between those two is the whole
        finding.
      </p>

      <GridBox letters={trial.letters} stage={stage === 'idle' ? 'blank' : stage} cueRow={trial.cueRow} revealRow={revealed} />

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
          <span className="text-slate-500">tone waits</span>
          <span className="text-cyan-200">{delay} ms</span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={100}
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full accent-cyan-400"
          aria-label="how long the cue tone waits after the grid disappears"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={flash}
          className="flex-1 rounded border border-emerald-400/50 bg-emerald-400/10 py-2.5 font-mono text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
        >
          ▶ flash it
        </button>
        <button
          onClick={() => setRevealed(true)}
          disabled={stage !== 'respond' || revealed}
          className="flex-1 rounded border border-slate-700 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-200 disabled:opacity-30"
        >
          👁 reveal the row
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">
          {stage === 'idle'
            ? 'set a delay and flash it'
            : stage === 'respond'
              ? revealed
                ? `the ${ROW_NAME[trial.cueRow as number]} row, as it was`
                : `hold the ${ROW_NAME[trial.cueRow as number]} row`
              : 'watch'}
        </span>
        <span className="text-fuchsia-300">wiz: all twelve, still</span>
      </div>
    </div>
  );
}
