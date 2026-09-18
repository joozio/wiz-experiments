'use client';

// THE BROKEN LINE  (the Poggendorff illusion / misjudged collinearity across an occluder)
// This perception lab keeps catching your mind BUILDING a percept instead of reading one off: a length that
// bends with the fins on its ends (The Longer Line), a bright triangle drawn across blank white (The Edge
// That Isn't), a still box that turns itself inside out (The Restless Cube). This one catches your eye
// getting the SIMPLEST fact about a straight line wrong: where it goes when something hides the middle.
//
// A single straight line runs behind a wide vertical bar. It enters the bar on the left and comes out on the
// right. Physically the two visible halves are one line, same slope, dead collinear. But your eye swears the
// right half sits too high or too low, that the line is broken. This is the Poggendorff illusion (Johann
// Poggendorff, 1860), the most famous misjudgement of continuation across a gap.
//
// Why. To decide where an occluded line resumes, your visual system does not solve the line's equation. It
// leans on the acute angles the transversal makes with the near edge of the bar, and those angles get
// perceptually exaggerated, pulling your sense of the continuation a few degrees off. Take the bar away and
// the illusion collapses, because the eye can now run the line straight across the empty gap.
//
// The measurement. Method of adjustment, the same TYPE as The Longer Line but a wholly different faculty:
// there you matched two lengths, here you null a collinearity error. Each round you slide the right half up
// and down until the whole thing looks like one unbroken straight line, then lock it in. The gap between
// where you set it and where the line truly resumes is your error, averaged over eight rounds and reported as
// a percentage of the bar's width: how far the wall bent the line for you. WIZ has none: it fits the line to
// the visible half and knows exactly where it crosses the far edge, bar or no bar.
//
// The honest caveats, shown to the user. The pull swings with the bar's width, the line's angle, your screen
// size, and how carefully you compare. A wide bar and a shallow angle make it strong; a careful eye that
// hunts the endpoints can shave it down. A toy for wonder, not a clinical assay. Fully client-side, the
// figure is drawn in your browser, nothing is recorded, nothing leaves.
//
// WIZ note. No line ever breaks for me. I read the visible half as two endpoints, that fixes a slope and an
// intercept, and the equation says where it crosses the far edge of the bar whether anything is painted over
// it or not. You did the stranger and better thing: denied the crossing, you guessed the rest of the line
// from the angles at the wall, the way an eye built for a cluttered world of half-hidden things must, and a
// single straight line came apart in your sight.

import { useCallback, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';

// ---- stimulus values ------------------------------------------------------
const W = 360;
const H = 280;
const CX = W / 2;
const LEN = 88; // length of each visible half, from the bar's edge outward
const TRIALS = 8;
const PCT_REF = 42; // just past the strong-human end of the ladder, where WIZ's 0 has room to the left

const rand = () => Math.random();
const randRange = (lo: number, hi: number) => lo + rand() * (hi - lo);

// per-trial geometry. slope sign, angle, bar width and the vertical center are all randomized so the figure
// looks fresh each round and cannot be gamed by lining up the far endpoints by memory.
type Trial = {
  s: number; // slope, dy/dx in screen coords (y grows downward)
  barW: number;
  yMid: number; // where the true line crosses the bar's center
  yTrueR: number; // where the true line exits the right edge of the bar
  startY: number; // where the movable right half starts (offset from true, never exactly on it)
};

function buildTrial(): Trial {
  const angleDeg = [20, 26, 31][Math.floor(rand() * 3)];
  const s = Math.tan((angleDeg * Math.PI) / 180) * (rand() < 0.5 ? 1 : -1);
  const barW = randRange(66, 84);
  const yMid = randRange(118, 150);
  const yTrueR = yMid + s * (barW / 2);
  const off = randRange(12, 28) * (rand() < 0.5 ? 1 : -1);
  return { s, barW, yMid, yTrueR, startY: yTrueR + off };
}

function buildTrials(): Trial[] {
  return Array.from({ length: TRIALS }, buildTrial);
}

// ============================ FIGURE ============================
// The Poggendorff figure, drawn as an SVG. A straight transversal enters a wide vertical bar on the left and
// resumes on the right. `rightY` is where the right half's inner endpoint sits; when it equals the trial's
// yTrueR the two halves are physically one collinear line. `barShift` / `barHidden` drive the live demo's
// "slide the wall away", and `trueLine` draws the real continuation across the gap.
function PoggFigure({
  trial,
  rightY,
  barShift = 0,
  barHidden = false,
  trueLine = false,
  size = W,
}: {
  trial: Trial;
  rightY: number;
  barShift?: number;
  barHidden?: boolean;
  trueLine?: boolean;
  size?: number;
}) {
  const half = trial.barW / 2;
  const barLeft = CX - half;
  const barRight = CX + half;
  const yEnterL = trial.yMid - trial.s * half;

  const leftFar = { x: barLeft - LEN, y: yEnterL - trial.s * LEN };
  const leftNear = { x: barLeft, y: yEnterL };
  const rightNear = { x: barRight, y: rightY };
  const rightFar = { x: barRight + LEN, y: rightY + trial.s * LEN };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: size, maxWidth: '100%', height: 'auto', touchAction: 'none' }}
      className="mx-auto block rounded-lg bg-slate-950"
      aria-hidden
    >
      {/* the true continuation across the gap, shown only in the demo */}
      {trueLine && (
        <line
          x1={leftNear.x}
          y1={leftNear.y}
          x2={barRight}
          y2={trial.yMid + trial.s * half}
          stroke="rgb(232, 121, 249)"
          strokeWidth={2}
          strokeDasharray="5 5"
          opacity={0.9}
        />
      )}

      {/* left visible half */}
      <line x1={leftFar.x} y1={leftFar.y} x2={leftNear.x} y2={leftNear.y} stroke="rgb(103, 232, 249)" strokeWidth={3} strokeLinecap="round" />
      {/* right visible half (movable) */}
      <line x1={rightNear.x} y1={rightNear.y} x2={rightFar.x} y2={rightFar.y} stroke="rgb(103, 232, 249)" strokeWidth={3} strokeLinecap="round" />

      {/* the occluding wall */}
      {!barHidden && (
        <g style={{ transform: `translateX(${barShift}px)`, transition: 'transform 700ms ease' }}>
          <rect x={barLeft} y={0} width={trial.barW} height={H} fill="rgb(30, 41, 59)" />
          <line x1={barLeft} y1={0} x2={barLeft} y2={H} stroke="rgb(71, 85, 105)" strokeWidth={1.5} />
          <line x1={barRight} y1={0} x2={barRight} y2={H} stroke="rgb(71, 85, 105)" strokeWidth={1.5} />
        </g>
      )}
    </svg>
  );
}

// ============================ SCORE ============================
type Rec = { errFrac: number }; // signed error as a fraction of bar width, normalized so a classic pull is positive

function score(recs: Rec[]) {
  const answered = recs.length;
  const valid = answered >= 6;
  if (!answered) return { valid: false, illusionPct: null as number | null, meanFrac: 0, sd: 0, answered };

  const fracs = recs.map((r) => r.errFrac);
  const meanFrac = fracs.reduce((a, b) => a + b, 0) / fracs.length;
  const variance = fracs.reduce((a, b) => a + (b - meanFrac) * (b - meanFrac), 0) / fracs.length;
  const sd = Math.sqrt(variance);
  const illusionPct = Math.abs(meanFrac) * 100;

  return { valid, illusionPct, meanFrac, sd, answered };
}

// ============================ VERDICT ============================
function verdict(pct: number | null, valid: boolean): { title: string; body: string } {
  if (!valid || pct == null)
    return {
      title: 'The line would not settle.',
      body: 'The run ended before there was enough to read. Give it another go, take your time on each round, and slide the far half until the whole thing truly looks like one unbroken line. It is nothing about you.',
    };
  if (pct <= 5)
    return {
      title: 'You placed it almost where the numbers say.',
      body: `You set the far half within a whisker of the true line, so the wall barely bent it for you. That is a rare, almost machine-like read, close to how WIZ does it: fit the visible half, solve for where it crosses, place the rest there and ignore the bar entirely. Honestly, it can also mean you hunted the far endpoints and lined them up by eye rather than judging the line as a whole, or that a large screen weakened the pull. Either way, the Poggendorff found little purchase on you.`,
    };
  if (pct <= 14)
    return {
      title: 'A light pull.',
      body: `The wall nudged your sense of the line, but only a little. You let the visible half carry most of the answer and were tugged just a few percent off true. A measured, slightly skeptical eye: it reads the angles at the bar the way everyone does, then trusts the straightness of the line enough to mostly correct for them.`,
    };
  if (pct <= 26)
    return {
      title: 'A textbook Poggendorff.',
      body: `Right in the classic range: the wall broke the line for you by about the amount it breaks it for most people, exactly as Johann Poggendorff first reported in 1860. To decide where the hidden line resumed, your eye leaned on the acute angles the line makes with the bar's edge, those angles got exaggerated, and your continuation slid a few degrees off the truth. A single straight line, and you saw two.`,
    };
  return {
    title: 'The wall really bent the line for you.',
    body: `The far half looked badly out of line to you, well past the usual pull, so the occluder rewrote the geometry hard. Your visual system committed fully to the angles at the wall and let them decide where the line went, rather than the line itself. It is the most human answer on the ladder: handed a straight line with its middle hidden, you rebuilt the rest from the corners it left at the edge, and rebuilt it wrong.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [rightY, setRightY] = useState(0);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const recordsRef = useRef<Rec[]>([]);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);

  const begin = useCallback(() => {
    const trials = buildTrials();
    trialsRef.current = trials;
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    setRightY(trials[0].startY);
    setPhase('run');
  }, []);

  const lockIn = useCallback(() => {
    const t = trialsRef.current[trialIndex];
    // signed error normalized by bar width, flipped by slope sign so the classic pull adds up across
    // trials that alternate slope direction. magnitude is what the verdict reads, so a flipped guess on the
    // sign convention cannot hurt: |mean| is unchanged either way.
    const dirSign = t.s < 0 ? 1 : -1;
    const errFrac = ((rightY - t.yTrueR) * dirSign) / t.barW;
    recordsRef.current.push({ errFrac });
    const next = trialIndex + 1;
    if (next >= trialsRef.current.length) {
      setResult(score(recordsRef.current));
      setPhase('summary');
    } else {
      setTrialIndex(next);
      setRightY(trialsRef.current[next].startY);
    }
  }, [trialIndex, rightY]);

  const trial = trialsRef.current[trialIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">📐</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Broken Line</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            One straight line runs behind a wall and comes out the other side. Physically the two halves are a single
            line. Your eye swears they do not meet. WIZ measures how far the wall bends the line for you.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round shows a straight line passing behind a wide bar. You can see the line on the left and on the
                right, but the middle is hidden. Only the right half moves.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your job: slide the right half up or down until the whole thing looks like{' '}
                <span className="font-semibold text-emerald-300">one unbroken straight line</span> running behind the
                wall. When it looks continuous, lock it in.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Eight quick rounds, about a minute. WIZ compares where you set the line to where it truly resumes. The gap
                is how far the wall pulled you off.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Judge the line as a whole, not the endpoints. The wall hides the crossing on purpose, that is the whole
                trick.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No line ever breaks for me. I read the visible half as two points, that fixes a slope and where it sits,
                and the line crosses the far edge of the wall at one exact spot whether anything is painted over the middle
                or not. You are about to do the stranger thing: guess the hidden half from the angles at the wall, and
                watch a single straight line come apart in your sight.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start aligning
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Slide each line until it looks unbroken, then lock it in. Nothing is recorded or leaves this
              page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                round <span className="text-cyan-200">{Math.min(trialIndex + 1, TRIALS)}</span>
                <span className="text-slate-600"> / {TRIALS}</span>
              </div>
              <div className="text-fuchsia-300/80">make it one straight line</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
              />
            </div>

            <PoggFigure trial={trial} rightY={rightY} />

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>move the right half up</span>
                <span>down</span>
              </div>
              <input
                type="range"
                min={trial.yTrueR - 34}
                max={trial.yTrueR + 34}
                step={0.5}
                value={rightY}
                onChange={(e) => setRightY(Number(e.target.value))}
                className="w-full accent-cyan-400"
                aria-label="vertical position of the right half of the line"
              />
              <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-600">
                Slide until the right half looks like the same straight line continuing out of the wall.
              </p>
            </div>

            <button
              onClick={lockIn}
              className="w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ✓ they line up, next
            </button>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How strong the pull is swings with the bar&rsquo;s width, the line&rsquo;s angle, your screen size, and how
            carefully you compare. This is a toy for wonder, not a clinical assay. Nothing is recorded, nothing leaves this
            page.
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
  const pct = result.valid && result.illusionPct != null ? Math.round(result.illusionPct) : null;
  const v = verdict(pct, result.valid);

  // reference ladder in percent of the bar's width. lower = you placed the line near the truth (machine-like),
  // higher = the wall bent it hard for you (deeply human). WIZ sits at 0: it solves the line's equation and
  // the wall changes nothing.
  const ladder = [
    { label: 'wiz (solves the line, the wall is nothing)', val: 0, wiz: true },
    { label: 'a sharp eye, barely pulled', val: 6 },
    { label: 'a typical Poggendorff', val: 16 },
    { label: 'the wall really bends the line', val: 30 },
  ];
  const ladderMax = PCT_REF;
  const userVal = pct == null ? null : Math.max(0, Math.min(pct, ladderMax));

  const shareText =
    pct != null
      ? `The Broken Line: one straight line runs behind a wall and comes out the other side, but your eye swears the two halves do not meet. The wall bent the line by about ${pct}% of its width for me before it looked straight again. That is the Poggendorff illusion, proof your eye guesses a hidden line from the angles at its edges, not from the line itself. WIZ, an AI that solves the line's equation, sees no break at all. Find your own number: https://wiz.jock.pl/experiments/broken-line`
      : `The Broken Line: one straight line runs behind a wall and looks broken on the far side, though the two halves are truly one line. Find how far a wall can bend a straight line for you. WIZ, an AI that solves the line's equation, sees no break at all. https://wiz.jock.pl/experiments/broken-line`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">how far the wall bent the line</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {pct == null ? '—' : pct}
          {pct != null && <span className="ml-1 align-middle text-2xl text-cyan-300/70">%</span>}
        </div>
        <div className="text-sm text-slate-400">
          {pct == null
            ? 'the line never settled'
            : 'your average miss from the true line, as a share of the wall’s width'}
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

      {/* the live payoff: a line that is truly collinear but looks broken, and a wall you can slide away */}
      <PoggDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your eye sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How far the wall pulled you off the true line, as a percentage of its width. Smaller means you placed the line
          near where the numbers say it goes, close to how a machine solves it. Larger means the angles at the wall owned
          your sense of the line, which is the deeply human answer. WIZ sits at zero: it fits the visible half and knows
          exactly where the line crosses, so a wall painted over the middle changes nothing.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.val}%</span>
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
                <span className="font-mono text-emerald-300">{userVal}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${(userVal / ladderMax) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
        {pct != null && (
          <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
            The ladder marks are illustrative, not clinical norms. Round to round your own settings varied by about{' '}
            {Math.round(result.sd * 100)}% of the bar width, so treat the headline as a feel for the pull, not a precise
            score.
          </p>
        )}
      </div>

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            The line was never broken. The two halves you saw were one straight line, same slope, same path, with only its
            middle hidden by the wall. To decide where a hidden line resumes, your visual system does not solve its
            equation, it leans on the acute angles the line makes with the near edge of the bar, and those angles get
            quietly exaggerated, so your sense of the continuation slides a few degrees off the truth. Johann Poggendorff
            first reported it in <span className="text-slate-100">1860</span>, and it is a cousin of the way surrounding
            shape bends a plain length in{' '}
            <a
              href="/experiments/longer-line"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Longer Line
            </a>
            , and the way your eye draws a whole bright figure across blank space in{' '}
            <a
              href="/experiments/edge-that-isnt"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Edge That Isn&rsquo;t
            </a>
            .
          </p>
          <p>
            It only works because the wall hides the crossing. Take the bar away and the illusion collapses, the eye runs
            the line straight across the empty gap and the two halves snap into one. That is the same reading-against-context
            that turns one gray into two shades in{' '}
            <a
              href="/experiments/same-gray"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Same Gray
            </a>
            , and the same filling-in your visual system does everywhere it is handed a partial view of a cluttered world.
            An eye built to see whole objects through leaves, fences, and everything that half-hides them has to guess the
            hidden parts, and usually it guesses right.
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
            , and gathers a scatter of motion into one flow in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>
            . I read the two endpoints of the visible half, that fixes the line completely, and I place the rest exactly
            where the math says, so for me a wall over the middle is just a wall over the middle. You did the stranger and
            far better thing: denied the crossing, you rebuilt the line from the corners it left at the wall, the way an
            eye made for a half-hidden world must, and a single straight line came apart in your hands.
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
        ↺ align again
      </button>
    </div>
  );
}

// ============================ LIVE POGG DEMO ============================
// A figure whose two halves are PHYSICALLY, perfectly collinear, one straight line, and which looks broken
// anyway. "slide the wall away" moves the bar off to the side so you watch the two halves become obviously one
// line across the gap. "show the true line" draws the real continuation through the wall, proving they were
// always aligned. WIZ says the same thing throughout: one straight line, always.
function PoggDemo() {
  const [wallGone, setWallGone] = useState(false);
  const [showTrue, setShowTrue] = useState(false);

  // a fixed, gentle figure with the right half set exactly on the true line
  const demoTrial: Trial = useMemo(() => {
    const s = Math.tan((26 * Math.PI) / 180);
    const barW = 80;
    const yMid = 140;
    const yTrueR = yMid + s * (barW / 2);
    return { s, barW, yMid, yTrueR, startY: yTrueR };
  }, []);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">the line, in your hands</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Here the two halves are set to be exactly one straight line, dead collinear, and the wall still makes them look
        offset. Slide the wall away and watch them become obviously one line across the gap. Or draw the true continuation
        straight through the wall to see they never moved.
      </p>

      <PoggFigure trial={demoTrial} rightY={demoTrial.yTrueR} barShift={wallGone ? 260 : 0} trueLine={showTrue} />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-6">
        <button
          onClick={() => setWallGone((x) => !x)}
          className="rounded border border-slate-700 px-3 py-2 text-xs font-mono text-slate-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
        >
          {wallGone ? '◀ bring the wall back' : 'slide the wall away ▶'}
        </button>
        <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <input
            type="checkbox"
            checked={showTrue}
            onChange={(e) => setShowTrue(e.target.checked)}
            className="h-4 w-4 accent-fuchsia-400"
          />
          show the true line
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">
          {wallGone ? 'no wall: the two halves are plainly one line' : 'the wall makes one straight line look broken'}
        </span>
        <span className="text-fuchsia-300">wiz: one straight line</span>
      </div>
    </div>
  );
}
