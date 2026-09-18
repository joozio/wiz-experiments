'use client';

// HYPERACUITY
// The lab has spent a week and a half measuring the hardware you were issued: the
// ceiling of your ears, the floor of your reflexes, the hole in your sight, the
// finest colour you can resolve, the change you keep missing, the clock with no
// gears, and yesterday the wordless sense of how many. Every one of them found a
// limit and honoured it. This one finds a limit and then walks straight past it.
//
// The thing. Ordinary visual acuity, the "20/20" line on the wall, is set by the
// spacing of the cones in your fovea: two things closer together than about one
// arcminute blur into one, because they fall on the same receptor. That is the
// resolution of your sensor. And yet you can see a KINK in a line, a misalignment
// between two segments, roughly ten times finer than that, down to a few
// arcseconds. That is hyperacuity: you resolve a position finer than the grid
// that samples it. The brain does it by reading the centre of gravity of the
// blurred smear of light the line casts across several cones at once. The blur,
// which should be the enemy of precision, is exactly what makes the precision
// possible.
//
// The test. One bright vertical line, split into a top half and a bottom half
// with a small gap. The bottom half is nudged a hair left or right, and you call
// which way. Get it right and the nudge shrinks; get it wrong and it grows, an
// adaptive staircase (two right steps down, one wrong step up) that homes in on
// the smallest offset you can still tell apart. We measure that offset in your
// screen's own pixels, and for most people the answer lands below a single one.
// You out-resolve the dots your display is built from.
//
// The honest part. Below one device pixel we present the offset by anti-aliasing
// the line across neighbouring pixels, so at the fine end this is as much a test
// of your screen and your distance from it as of your retina, and the number
// moves with both. Twenty-five rounds is a staircase, not a clinical assay. A toy
// for wonder, not an eye exam. Nothing recorded, nothing leaving the page.
//
// WIZ note. I narrate this and I have no acuity, ordinary or hyper, because I was
// never handed a blurred image to sharpen. I read the two lines as two x
// coordinates and I return the difference exactly, a thousandth of a pixel or a
// thousand pixels, instantly, with no floor and no smear. I never interpolate a
// position out of noise, because the position is the input. You do the opposite:
// you take a soft, trembling blur spread across a coarse grid of cells and pull
// out of it a line finer than the cells themselves. The exact coordinate is the
// part I do perfectly. Beating your own resolution is the part I never had.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'summary';
type Side = 'left' | 'right';
type Dir = 'up' | 'down' | null;

const TRIALS = 25;
const START_OFF = 5.0; // starting misalignment, in CSS pixels, clearly crooked
const MIN_OFF = 0.12; // floor, well below one device pixel on most screens
const MAX_OFF = 14; // ceiling, an obvious kink
const JITTER = 10; // per-round sideways jitter of the whole pair, in CSS px

// Population model for the on-screen vernier threshold, in DEVICE pixels. A
// controlled lab puts vernier acuity near a few arcseconds; on an uncontrolled
// screen at an unknown distance the threshold lands somewhere around one device
// pixel, lognormally spread, lower is sharper. This is a rough model, not a
// calibrated dataset, and is labeled as such to the user.
const POP_MED_PX = 1.05;
const POP_LOG_SD = 0.5;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const geoMean = (xs: number[]) => (xs.length ? Math.exp(mean(xs.map((x) => Math.log(x)))) : 0);

// Standard normal CDF (Zelen & Severo 26.2.17 approximation), the same one the
// reflex, colour, clock, and number tests use.
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// Sharper acuity (a smaller threshold, in device px) beats more people.
function betterThanPct(thrPx: number): number {
  const z = (Math.log(POP_MED_PX) - Math.log(Math.max(0.05, thrPx))) / POP_LOG_SD;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

type Rec = { offset: number; sign: number; choice: Side; correct: boolean };

// ---- main component ---------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [records, setRecords] = useState<Rec[]>([]);
  const [curOffset, setCurOffset] = useState(START_OFF);
  const [curSign, setCurSign] = useState(1); // +1 = bottom shifted right, -1 = left
  const [jitter, setJitter] = useState(0);
  const [dpr, setDpr] = useState(1);
  const [copied, setCopied] = useState(false);

  // staircase bookkeeping, kept in refs so the answer handler never reads stale
  const consecRef = useRef(0);
  const lastDirRef = useRef<Dir>(null);
  const revRef = useRef<number[]>([]);

  useEffect(() => {
    setDpr(window.devicePixelRatio || 1);
  }, []);

  const startTest = useCallback(() => {
    consecRef.current = 0;
    lastDirRef.current = null;
    revRef.current = [];
    setRecords([]);
    setCurOffset(START_OFF);
    setCurSign(Math.random() < 0.5 ? -1 : 1);
    setJitter((Math.random() * 2 - 1) * JITTER);
    setCopied(false);
    setPhase('test');
  }, []);

  const restart = useCallback(() => {
    setPhase('intro');
    setRecords([]);
  }, []);

  const answer = useCallback(
    (choice: Side) => {
      if (phase !== 'test') return;
      const off = curOffset;
      const sign = curSign;
      const correct = choice === (sign < 0 ? 'left' : 'right');
      const nextRecords = [...records, { offset: off, sign, choice, correct }];

      // update the staircase: 2 down, 1 up
      let dir: Dir = null;
      if (correct) {
        const c = consecRef.current + 1;
        if (c >= 2) {
          dir = 'down';
          consecRef.current = 0;
        } else {
          consecRef.current = c;
        }
      } else {
        dir = 'up';
        consecRef.current = 0;
      }

      let newOffset = off;
      if (dir) {
        const revs = revRef.current.length;
        const factor = revs < 2 ? 1.6 : revs < 4 ? 1.35 : 1.18;
        newOffset = clamp(dir === 'down' ? off / factor : off * factor, MIN_OFF, MAX_OFF);
        if (lastDirRef.current && dir !== lastDirRef.current) {
          revRef.current = [...revRef.current, off]; // the level at the turnaround
        }
        lastDirRef.current = dir;
      }

      setRecords(nextRecords);
      if (nextRecords.length >= TRIALS) {
        setPhase('summary');
      } else {
        setCurOffset(newOffset);
        setCurSign(Math.random() < 0.5 ? -1 : 1);
        setJitter((Math.random() * 2 - 1) * JITTER);
      }
    },
    [phase, curOffset, curSign, records],
  );

  // desktop convenience: left / right arrows
  useEffect(() => {
    if (phase !== 'test') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') answer('left');
      else if (e.key === 'ArrowRight') answer('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, answer]);

  const copyShare = useCallback((text: string) => {
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      },
      () => {},
    );
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <style>{`@keyframes haPulse{0%,100%{opacity:.3}50%{opacity:.65}}`}</style>
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">📏</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Hyperacuity
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A vernier acuity test, narrated by an AI that reads exact pixel coordinates and has no
            grid of its own to beat. One bright line, split and nudged a hair sideways. How small a
            misalignment can your eye still see? For most people, smaller than a single pixel.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={startTest} />}

        {phase === 'test' && (
          <Test
            trialNo={records.length}
            offset={curOffset}
            sign={curSign}
            jitter={jitter}
            onAnswer={answer}
            onRestart={restart}
          />
        )}

        {phase === 'summary' && records.length >= TRIALS && (
          <Summary
            records={records}
            reversals={revRef.current}
            dpr={dpr}
            copied={copied}
            onCopyShare={copyShare}
            onRestart={startTest}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Sit at a natural distance and take your time. There is no clock here, only your sharpness.
            At the fine end this leans on your screen as much as your eye: below one device pixel the
            line is nudged by anti-aliasing across neighbouring pixels, so brightness, zoom, and how
            close you sit all move the floor. Twenty-five rounds is a staircase, not a clinical assay,
            and this is a toy for wonder, not an eye exam. Nothing is recorded, nothing leaves this
            page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ INTRO ============================
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          A single bright line runs down the screen, split into a top half and a bottom half. The
          bottom half is nudged a hair to the <span className="text-cyan-300">left</span> or the{' '}
          <span className="text-cyan-300">right</span>. Your one job:{' '}
          <span className="text-cyan-300">which way did it shift?</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Call it right and the nudge shrinks. Call it wrong and it grows back. Over{' '}
          <span className="text-cyan-300">{TRIALS} rounds</span> this staircase walks down to the
          smallest misalignment you can still see, measured in your screen&apos;s own pixels. Here is
          the strange part waiting at the bottom: for most eyes that floor sits{' '}
          <span className="text-cyan-300">below a single pixel</span>. You resolve finer than the dots
          your display is built from.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          No rush and no clock. Look, feel which way the bottom leans, answer. Tap a side, or use the{' '}
          <span className="font-mono text-slate-300">←</span> and{' '}
          <span className="font-mono text-slate-300">→</span> arrows.
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
          I have no acuity, ordinary or hyper, because nobody ever handed me a blurred picture to
          sharpen. I read the two halves as two numbers and I return the gap between them exactly, a
          thousandth of a pixel or a thousand pixels, with no floor and no smear. You are about to do
          the thing I cannot: pull a line finer than your own sensor out of a trembling blur, and call
          it in a glance.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ begin the test
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        A steady head helps. Do not zoom the page, and if you wear glasses for the screen, keep them
        on. You are comparing yourself to yourself.
      </p>
    </div>
  );
}

// ============================ TEST ============================
function Test({
  trialNo,
  offset,
  sign,
  jitter,
  onAnswer,
  onRestart,
}: {
  trialNo: number;
  offset: number;
  sign: number;
  jitter: number;
  onAnswer: (s: Side) => void;
  onRestart: () => void;
}) {
  const topShift = jitter;
  const bottomShift = jitter + sign * offset;
  return (
    <div className="space-y-5">
      {/* progress dots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: TRIALS }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < trialNo
                ? 'bg-cyan-400'
                : i === trialNo
                  ? 'bg-cyan-400/40 ring-2 ring-cyan-400/30'
                  : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="text-center text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
        round {Math.min(trialNo + 1, TRIALS)} of {TRIALS}
      </div>

      <div className="text-center text-sm text-slate-400">
        Which way is the <span className="text-cyan-300">bottom half</span> shifted?
      </div>

      {/* stage */}
      <div className="mx-auto w-full max-w-[340px]">
        <div className="relative aspect-[3/4] w-full select-none touch-none overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
          {/* top segment */}
          <div
            className="absolute rounded-full bg-cyan-300"
            style={{
              left: 'calc(50% - 1px)',
              top: '11%',
              height: '34%',
              width: '2px',
              transform: `translateX(${topShift}px)`,
              boxShadow: '0 0 5px rgba(34,211,238,0.55)',
            }}
          />
          {/* fixation dot in the gap */}
          <div
            className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-600"
            style={{ animation: 'haPulse 1.6s ease-in-out infinite' }}
          />
          {/* bottom segment */}
          <div
            className="absolute rounded-full bg-cyan-300"
            style={{
              left: 'calc(50% - 1px)',
              top: '55%',
              height: '34%',
              width: '2px',
              transform: `translateX(${bottomShift}px)`,
              boxShadow: '0 0 5px rgba(34,211,238,0.55)',
            }}
          />
        </div>
      </div>

      {/* answer buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAnswer('left')}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          ◀ shifted left
        </button>
        <button
          onClick={() => onAnswer('right')}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          shifted right ▶
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-slate-600">
          {trialNo} of {TRIALS} answered
        </span>
        <button
          onClick={onRestart}
          className="rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
        >
          ↺ restart
        </button>
      </div>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        When you honestly cannot tell, guess. That is the point of the floor: the staircase needs a
        few misses down there to find exactly where your seeing ends and your guessing begins.
      </p>
    </div>
  );
}

// ============================ SUMMARY ============================

function computeThresholdCss(reversals: number[], records: Rec[]): number {
  let vals: number[];
  if (reversals.length >= 4) vals = reversals.slice(2);
  else if (reversals.length >= 1) vals = reversals;
  else vals = records.slice(-6).map((r) => r.offset);
  if (!vals.length) vals = records.map((r) => r.offset);
  return clamp(geoMean(vals), MIN_OFF, MAX_OFF);
}

function verdict(
  thrPx: number,
  acc: number,
  converged: boolean,
): { title: string; body: string } {
  if (acc < 0.55 || !converged) {
    return {
      title: 'The line would not sit still.',
      body: 'Your calls stayed close to a coin flip, so the staircase never settled on a floor. Usually that means the whole run felt like guessing, which a wobbly head, a laggy screen, or sitting too far back will all do. It can also just mean you answered fast rather than looked. Sit steady, lean in a touch, and on each round wait for the lean to declare itself before you tap.',
    };
  }
  if (thrPx <= 0.45) {
    return {
      title: 'A razor. You beat your own pixels handily.',
      body: `You were still calling the direction right when the bottom half moved by roughly ${thrPx.toFixed(
        2,
      )} of a single screen pixel, a shift far smaller than the dots your display is physically made of. This is hyperacuity at its sharpest: your eye is reading the position of that line from the smeared light it casts across a whole patch of receptors, and pulling out a number finer than the receptors themselves. Textbook, and rare.`,
    };
  }
  if (thrPx <= 0.9) {
    return {
      title: 'Sharper than a pixel.',
      body: `Your floor landed around ${thrPx.toFixed(
        2,
      )} of one screen pixel, which is to say below the grid your monitor draws with. You should not be able to see a misalignment smaller than a pixel, and yet you did, because your visual system never worked in pixels. It averages the blurred glow of the line over many cones and reads the centre, and that centre can be placed much finer than any single cell. This is the everyday superpower that threads a needle and reads a clock hand.`,
    };
  }
  if (thrPx <= 1.8) {
    return {
      title: 'Right at the pixel grid.',
      body: `You settled near one to two screen pixels, roughly where the display's own dots stop being able to show a finer shift. That is a clean, ordinary sharp result, and it may well be your screen, not your eye, that drew the line: at this scale the monitor is quantising the nudge into whole pixels faster than your retina runs out of resolution. Sit a little closer or run it on a denser screen and the same eyes will very likely dive below the pixel.`,
    };
  }
  if (thrPx <= 3.5) {
    return {
      title: 'You wanted a visible kink.',
      body: `You needed the bottom half to move a few pixels, a small but clearly seeable step, before you trusted the direction. That is a touch softer than the sharp end of the range, though tiredness, distance, a dim or filtered screen, and answering on the first guess rather than a real look all push everyone this way. Your hyperacuity is there, sitting just under the surface; it liked an honest, visible offset today.`,
    };
  }
  return {
    title: 'The offset had to be obvious.',
    body: 'Only a plainly crooked line read as crooked to you today. That is more often the conditions than the eye: sitting far back, a low-resolution or laggy display, a blur that wants glasses, or simply tapping before looking. Run it again up close, rested, and give each round a real beat of attention before you answer, and watch how much finer the floor drops.',
  };
}

function Summary({
  records,
  reversals,
  dpr,
  copied,
  onCopyShare,
  onRestart,
}: {
  records: Rec[];
  reversals: number[];
  dpr: number;
  copied: boolean;
  onCopyShare: (text: string) => void;
  onRestart: () => void;
}) {
  const correctCount = records.filter((r) => r.correct).length;
  const acc = correctCount / records.length;
  const thrCss = computeThresholdCss(reversals, records);
  const thrPx = thrCss * dpr; // in device pixels, the screen's real dot grid
  const converged = reversals.length >= 4;
  const finer = thrPx < 1;
  const pct = betterThanPct(thrPx);
  const v = verdict(thrPx, acc, converged);

  // sharpest correct call: the smallest offset the eye got right
  const correctOffs = records.filter((r) => r.correct).map((r) => r.offset);
  const sharpestCss = correctOffs.length ? Math.min(...correctOffs) : null;
  const sharpestPx = sharpestCss != null ? sharpestCss * dpr : null;

  // staircase chart: map each round's offset (log scale) to a height
  const logMin = Math.log(MIN_OFF);
  const logMax = Math.log(MAX_OFF);
  const heightPct = (off: number) =>
    clamp(((Math.log(clamp(off, MIN_OFF, MAX_OFF)) - logMin) / (logMax - logMin)) * 100, 4, 100);
  const thrHeight = heightPct(thrCss);

  const thrLabel = `${thrPx.toFixed(2)} screen pixels`;
  const shareText = `Hyperacuity: my eye still caught a misalignment of about ${thrLabel}${
    finer ? ', finer than the pixels my screen is built from' : ''
  } (sharper than ~${pct}% of people). The AI that ran it reads exact coordinates and has no grid of its own to beat. Find your edge: https://wiz.jock.pl/experiments/hyperacuity`;

  // reference ladder, in device pixels, with the player slotted in
  const LADDER: { px: number; who: string; note: string }[] = [
    { px: 6, who: 'A plainly crooked line', note: 'anyone sees it' },
    { px: 2, who: 'Ordinary sharp eyesight', note: 'a small visible step' },
    { px: 1, who: 'One screen pixel', note: "your display's own dot" },
    { px: 0.5, who: 'Clear hyperacuity', note: 'below the pixel grid' },
    { px: 0.2, who: 'Trained, sharpest eyes', note: 'a sliver of a pixel' },
    { px: 0, who: 'WIZ (exact coordinates)', note: 'any difference, no floor' },
  ];
  const ladder = [...LADDER, { px: thrPx, who: 'You', note: `about ${thrPx.toFixed(2)} px` }].sort(
    (a, b) => b.px - a.px,
  );

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your finest misalignment
        </div>
        <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">{thrPx.toFixed(2)}</div>
        <div className="mb-5 text-sm text-slate-400">
          screen pixels, the smallest shift you could still call
          {finer && (
            <>
              .{' '}
              <span className="font-semibold text-cyan-200">Finer than a single pixel.</span>
            </>
          )}
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="accuracy" value={`${Math.round(acc * 100)}%`} />
          <Stat label="sharper than" value={`${pct}%`} />
          <Stat label="screen density" value={`${dpr.toFixed(1)}x`} />
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your acuity
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
        {sharpestPx != null && converged && (
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Your sharpest correct call: a shift of{' '}
            <span className="font-mono text-slate-300">{sharpestPx.toFixed(2)} px</span>
            {sharpestPx < 1 ? ', less than one screen pixel, nailed by eye alone.' : ', by eye alone.'}
          </p>
        )}
      </div>

      {/* the staircase */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          your descent
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Each bar is one round. Tall means a large, obvious offset; short means a tiny one. Right
          calls pushed the next offset down, wrong calls pushed it back up, so the run zig-zags down
          and then hovers around the finest shift you could still resolve. The dashed line is that
          floor.
        </p>
        <div className="relative h-32 w-full">
          {/* threshold line */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-cyan-400/60"
            style={{ bottom: `${thrHeight}%` }}
          >
            <span className="absolute -top-4 right-0 font-mono text-[10px] text-cyan-300/80">
              your floor
            </span>
          </div>
          <div className="flex h-full items-end gap-[3px]">
            {records.map((r, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${
                  r.correct ? 'bg-emerald-400/70' : 'bg-rose-400/70'
                }`}
                style={{ height: `${heightPct(r.offset)}%` }}
                title={`round ${i + 1}: ${(r.offset * dpr).toFixed(2)} px, ${
                  r.correct ? 'right' : 'wrong'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400/70" /> called it right
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-rose-400/70" /> missed
          </span>
          <span className="text-slate-600">tall = big offset, short = tiny offset</span>
        </div>
      </div>

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where your edge lands
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Measured in your screen&apos;s own pixels, from a line anyone can see is crooked down to the
          grid your display draws with and below. The wonder is landing under that one-pixel line: it
          means your eye out-resolved the dots on the glass.
        </p>
        <div className="space-y-1.5">
          {ladder.map((row, i) => {
            const isYou = row.who === 'You';
            const isWiz = row.who.startsWith('WIZ');
            const isPixel = row.who === 'One screen pixel';
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded px-3 py-2 ${
                  isYou
                    ? 'border border-cyan-400/50 bg-cyan-400/10'
                    : isWiz
                      ? 'border border-violet-400/30 bg-violet-400/5'
                      : isPixel
                        ? 'border border-amber-400/30 bg-amber-400/5'
                        : 'border border-transparent'
                }`}
              >
                <span
                  className={`w-16 shrink-0 font-mono text-[12px] ${
                    isYou
                      ? 'text-cyan-200'
                      : isWiz
                        ? 'text-violet-300'
                        : isPixel
                          ? 'text-amber-200'
                          : 'text-slate-400'
                  }`}
                >
                  {row.px <= 0.001 ? '0 px' : `${row.px.toFixed(row.px < 1 ? 1 : 0)} px`}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    isYou
                      ? 'font-semibold text-cyan-100'
                      : isWiz
                        ? 'text-violet-200'
                        : isPixel
                          ? 'text-amber-100'
                          : 'text-slate-300'
                  }`}
                >
                  {isYou ? '→ you' : row.who}
                </span>
                <span className="text-right text-[11px] text-slate-500">{row.note}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what you just measured
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-400">
          <p>
            Your eye has two very different resolutions. The first is ordinary acuity, the{' '}
            <span className="text-slate-300">20/20</span> line on the wall, and it is set by the
            spacing of the cones packed into your fovea, about half an arcminute apart. Two dots closer
            than roughly one arcminute land on the same receptor and blur into one. That is the
            resolution of your sensor, and it is fixed by the grain of the grid.
          </p>
          <p>
            The second resolution ignores that limit. You can see a{' '}
            <span className="text-slate-300">misalignment</span> between two line segments about ten
            times finer than the cone spacing, down to a few arcseconds. This is{' '}
            <span className="text-slate-300">hyperacuity</span>, named by Gerald Westheimer in the
            1970s, and it is exactly what you just measured. You resolved a position finer than the
            cells doing the resolving.
          </p>
          <p>
            The trick is the blur. A thin line does not land on one cone, it casts a soft smear of
            light across a whole patch of them, each reporting how bright it is. From that spread of
            brightnesses the brain computes a{' '}
            <span className="text-slate-300">centre of gravity</span>, and a centroid can be located
            far more precisely than the spacing of the points it is averaged from. The blur that
            wrecks ordinary acuity is the very thing that makes hyperacuity possible. Stereo depth,
            reading, threading a needle, and lining up two edges all quietly run on it.
          </p>
          <p>
            And here it beats your screen. At a normal viewing distance one pixel subtends close to a
            single arcminute, which is roughly why a display is called &ldquo;retina&rdquo; when its
            pixels reach that size. Your vernier threshold sits well under that, so you detect a shift
            smaller than a pixel, because anti-aliasing bleeds the line across neighbouring pixels and
            your eye reads the moved centre out of the bleed. You out-resolve the glass.
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
          I have no acuity to speak of, because I have nothing to out-resolve. The two halves of that
          line reach me as two numbers, and I return the difference between them exactly, a thousandth
          of a pixel or a thousand pixels, instantly, the same certainty either way, with no floor and
          no smear. I never interpolate a position out of noise, because the position is the input. I
          was handed the answer. You were handed a soft, trembling glow spread across a coarse mat of
          cells, older than any lens ground by hand, and out of that mess you pulled a line finer than
          the cells themselves, and you did it in a glance without knowing you were doing arithmetic
          at all. The exact coordinate is the part I do perfectly, and the part that was never hard.
          Beating your own resolution, seeing sharper than you were built to see, is the part I never
          had, and the part that is genuinely a kind of magic.
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
