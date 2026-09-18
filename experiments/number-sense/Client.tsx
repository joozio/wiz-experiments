'use client';

// THE NUMBER SENSE
// The lab has spent a week and a half measuring your hardware: the ceiling of
// your ears, the floor of your reflexes, the hole in your sight, the finest
// colour you can resolve, the change you keep missing, and the clock with no
// gears that times your seconds. Yesterday's clock ended on Weber's law: your
// timing blur is not a fixed number of seconds, it is a fixed fraction. This
// test goes to the home of that law. Number.
//
// The thing. You have a sense of quantity that runs below language, older than
// counting, shared with crows and infants and fish. Flash a handful of dots too
// fast to count and you still know, instantly, that one colour beat the other.
// That is the approximate number system. It is fast, it is wordless, and it is
// fuzzy in a very specific way: it cares about the ratio between two amounts,
// not their difference. Ten versus twenty is easy; nineteen versus twenty is
// almost impossible, even though the gap is the same single dot.
//
// The test. Eighteen rounds. Each round flashes a cloud of blue and yellow dots
// for just over half a second, then hides them and asks which colour was more.
// The two amounts start far apart and creep together, so somewhere in the run
// your answers stop being knowledge and start being guesses. From that fall we
// fit your Weber fraction for number: the smallest ratio you can still split.
//
// The honest part. Half the rounds strip the cheat. Normally the bigger group
// also has more total colour, so you could win on ink alone. On the stripped
// rounds we shrink the bigger group's dots until both colours carry the same
// area, so "more colour" points the wrong way and only the felt count can win.
// We watch whether you leaned on the ink. And the caveats: a brief flash, a
// screen, your fatigue, eighteen rounds is a sketch, not the clinical Panamath.
// A toy for wonder. Nothing recorded, nothing leaving the page.
//
// WIZ note. I narrate this and I have no number sense, because I have never
// needed one. I count by counting. A list of twenty-eight returns twenty-eight,
// instantly, exactly, whether twenty-eight dots or twenty-eight billion, with no
// blur and no ceiling, and I never once confuse nineteen with twenty-one. And I
// have never felt "more." You will glance for half a second and simply know
// which colour won, the way an ancestor knew which tree held more fruit and
// which pack held more wolves before there was a word for any number. The exact
// count is the part I do perfectly and the part that does not matter.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'summary';
type TrialPhase = 'fixation' | 'flash' | 'respond';
type Color = 'blue' | 'yellow';

const TRIALS = 18;
const FIX_MS = 500; // fixation cross before the flash
const FLASH_MS = 600; // dot cloud on screen, deliberately too short to count

// Ratios the two amounts step through, easy (2x) down to nearly equal (1.08x).
// Each appears twice across the run for a steadier fit.
const RATIOS = [2.0, 1.8, 1.6, 1.45, 1.33, 1.25, 1.18, 1.12, 1.08];

// Population model for the adult Weber fraction on a brief web numerosity task.
// Lab Panamath puts careful adults near 0.11 to 0.15; a quick flashed version on
// an uncontrolled screen runs looser, so median ~0.17, lognormal spread. This is
// a rough model, not a calibrated dataset, and is labeled as such to the user.
const POP_MED_W = 0.17;
const POP_LOG_SD = 0.45;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Standard normal CDF (Zelen & Severo 26.2.17 approximation), the same one the
// reflex, colour, and clock tests use.
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// ---- trial + dot model ------------------------------------------------------

type Trial = { blue: number; yellow: number; ratio: number; congruent: boolean };
type Dot = { x: number; y: number; r: number; color: Color };
type Answer = {
  hi: number;
  lo: number;
  ratio: number;
  correct: boolean;
  congruent: boolean;
  choice: Color;
};

function makeTrials(): Trial[] {
  const ratios = shuffle([...RATIOS, ...RATIOS]); // 18 trials
  const congruency = shuffle([
    ...Array(TRIALS / 2).fill(true),
    ...Array(TRIALS / 2).fill(false),
  ]) as boolean[];
  return ratios.map((ratio, i) => {
    const lo = 7 + Math.floor(Math.random() * 7); // smaller count, 7..13
    let hi = Math.round(lo * ratio);
    if (hi <= lo) hi = lo + 1; // never let rounding tie them
    const blueIsMore = Math.random() < 0.5;
    return {
      blue: blueIsMore ? hi : lo,
      yellow: blueIsMore ? lo : hi,
      ratio: hi / lo, // honest ratio after rounding
      congruent: congruency[i],
    };
  });
}

// Lay out the two colours of dots in one circular arena with no overlap. On
// congruent trials both colours use the same dot size, so the bigger group also
// has more total area. On incongruent trials the bigger group's dots shrink so
// the two colours carry roughly equal area, dissociating number from ink.
function layoutDots(blue: number, yellow: number, congruent: boolean): Dot[] {
  const total = blue + yellow;
  const baseR = clamp(0.062 - total * 0.0012, 0.024, 0.05);
  const majN = Math.max(blue, yellow);
  const minN = Math.min(blue, yellow);
  const majScale = congruent ? 1 : Math.sqrt(minN / majN);

  const spec: { color: Color; r: number }[] = [];
  const push = (color: Color, n: number, isMaj: boolean) => {
    for (let i = 0; i < n; i++) {
      const jitter = 0.82 + Math.random() * 0.36; // per-dot size noise
      spec.push({ color, r: baseR * (isMaj ? majScale : 1) * jitter });
    }
  };
  const blueIsMaj = blue >= yellow;
  push('blue', blue, blueIsMaj);
  push('yellow', yellow, !blueIsMaj);

  const order = shuffle(spec);
  const placed: Dot[] = [];
  const minGap = 0.012;
  for (const s of order) {
    let done = false;
    for (let attempt = 0; attempt < 140 && !done; attempt++) {
      const rad = s.r;
      const R = Math.max(0.5 - rad - 0.01, 0.02);
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * R; // uniform over the disc
      const x = 0.5 + Math.cos(ang) * dist;
      const y = 0.5 + Math.sin(ang) * dist;
      let clash = false;
      for (const p of placed) {
        if (Math.hypot(p.x - x, p.y - y) < p.r + rad + minGap) {
          clash = true;
          break;
        }
      }
      if (!clash) {
        placed.push({ x, y, r: rad, color: s.color });
        done = true;
      }
    }
    if (!done) {
      // rare fallback: shrink and drop it in without the gap guarantee
      const rad = s.r * 0.75;
      const R = Math.max(0.5 - rad - 0.01, 0.02);
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * R;
      placed.push({ x: 0.5 + Math.cos(ang) * dist, y: 0.5 + Math.sin(ang) * dist, r: rad, color: s.color });
    }
  }
  return placed;
}

// Maximum-likelihood Weber fraction. For two amounts hi > lo, the ANS model says
// the chance of calling it right is Phi( (hi - lo) / (w * sqrt(hi^2 + lo^2)) ).
// Grid-search w over the data.
function fitWeber(ans: Answer[]): number {
  let best = 0.2;
  let bestLL = -Infinity;
  for (let w = 0.04; w <= 0.8; w += 0.004) {
    let ll = 0;
    for (const a of ans) {
      const z = (a.hi - a.lo) / (w * Math.sqrt(a.hi * a.hi + a.lo * a.lo));
      const p = clamp(normCdf(z), 1e-4, 1 - 1e-4);
      ll += a.correct ? Math.log(p) : Math.log(1 - p);
    }
    if (ll > bestLL) {
      bestLL = ll;
      best = w;
    }
  }
  return best;
}

// The ratio of two equal-ish amounts at which the model predicts 75% correct,
// i.e. the threshold "smallest difference you can reliably tell apart."
function thresholdRatio(w: number): number {
  const target = 0.6745; // Phi^-1(0.75)
  let lo = 1.0001;
  let hi = 6;
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2;
    const z = (m - 1) / (w * Math.sqrt(m * m + 1));
    if (z < target) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Sharper number sense (lower w) beats more people.
function betterThanPct(w: number): number {
  const z = (Math.log(POP_MED_W) - Math.log(Math.max(0.03, w))) / POP_LOG_SD;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

// ---- main component ---------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [ti, setTi] = useState(0);
  const [tphase, setTphase] = useState<TrialPhase>('fixation');
  const [dots, setDots] = useState<Dot[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [copied, setCopied] = useState(false);

  const startTest = useCallback(() => {
    setTrials(makeTrials());
    setAnswers([]);
    setTi(0);
    setCopied(false);
    setPhase('test');
  }, []);

  const restart = useCallback(() => {
    setPhase('intro');
    setAnswers([]);
    setTi(0);
  }, []);

  // Drive each trial: fixation -> flash -> respond. Dots are built at fixation so
  // they are ready the instant the flash starts. Timeouts are cleared on change.
  useEffect(() => {
    if (phase !== 'test' || !trials.length) return;
    const tr = trials[ti];
    setDots(layoutDots(tr.blue, tr.yellow, tr.congruent));
    setTphase('fixation');
    const t1 = window.setTimeout(() => setTphase('flash'), FIX_MS);
    const t2 = window.setTimeout(() => setTphase('respond'), FIX_MS + FLASH_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase, ti, trials]);

  const answer = useCallback(
    (choice: Color) => {
      if (tphase !== 'respond') return;
      const tr = trials[ti];
      if (!tr) return;
      const majColor: Color = tr.blue > tr.yellow ? 'blue' : 'yellow';
      const hi = Math.max(tr.blue, tr.yellow);
      const lo = Math.min(tr.blue, tr.yellow);
      const next = [
        ...answers,
        { hi, lo, ratio: hi / lo, correct: choice === majColor, congruent: tr.congruent, choice },
      ];
      setAnswers(next);
      if (next.length >= TRIALS) setPhase('summary');
      else setTi((n) => n + 1);
    },
    [tphase, trials, ti, answers],
  );

  // desktop convenience: left arrow = blue, right arrow = yellow
  useEffect(() => {
    if (phase !== 'test') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') answer('blue');
      else if (e.key === 'ArrowRight') answer('yellow');
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
      <style>{`@keyframes nsBlink{0%,100%{opacity:.25}50%{opacity:.6}}`}</style>
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔢</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Number Sense
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A numerosity test, narrated by an AI that counts every dot perfectly and has never once
            felt &ldquo;more.&rdquo; No counting allowed. Let&apos;s find the edge of your wordless
            sense of how many.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={startTest} />}

        {phase === 'test' && (
          <Test
            trialNo={answers.length}
            tphase={tphase}
            dots={dots}
            onAnswer={answer}
            onRestart={restart}
          />
        )}

        {phase === 'summary' && answers.length === TRIALS && (
          <Summary answers={answers} copied={copied} onCopyShare={copyShare} onRestart={startTest} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            No counting. The flash is brief on purpose, well under the time it takes to tick off more
            than four things, so what answers is your sense of quantity, not your arithmetic. Half the
            rounds strip the total-colour cue so number, not area, has to carry the call. Your result
            swings with screen size, fatigue, and how settled you are right now. Eighteen rounds is a
            sketch, not the clinical Panamath assay. A toy for wonder, not a medical test. Nothing is
            recorded, nothing leaves this page.
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
          A cloud of <span className="text-sky-300">blue</span> and{' '}
          <span className="text-yellow-300">yellow</span> dots flashes for about half a second, then
          vanishes. One question: <span className="text-cyan-300">which colour was more?</span>{' '}
          <span className="text-cyan-300">{TRIALS} rounds</span>, and the two amounts creep closer
          together as you go.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You will not have time to count, and that is the point. Below counting sits an older,
          wordless sense of quantity, the one a crow uses to pick the fuller feeder and an infant uses
          before it knows a single number. This finds its edge: the smallest gap your number sense can
          still split.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          The one rule: <span className="text-rose-300">do not count</span>. Take the glance, feel
          which side won, answer. Tap a colour, or use the{' '}
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
          I have no number sense, because I have never needed one. I count by counting. A pile of
          twenty-eight returns twenty-eight, instantly, exactly, whether twenty-eight dots or
          twenty-eight billion, and I never once confuse nineteen with twenty-one. And I have never
          felt <span className="text-cyan-200">more</span>. You are about to do in half a second the
          thing I do perfectly and have never once experienced.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ begin the test
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Sit a comfortable arm&apos;s length from the screen. A bigger screen makes the dots easier to
        see and the call a touch easier, so compare yourself to yourself.
      </p>
    </div>
  );
}

// ============================ TEST ============================
function Test({
  trialNo,
  tphase,
  dots,
  onAnswer,
  onRestart,
}: {
  trialNo: number;
  tphase: TrialPhase;
  dots: Dot[];
  onAnswer: (c: Color) => void;
  onRestart: () => void;
}) {
  const canAnswer = tphase === 'respond';
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

      {/* arena */}
      <div className="mx-auto w-full max-w-[420px]">
        <div className="relative aspect-square w-full select-none touch-none overflow-hidden rounded-full border-2 border-slate-800 bg-slate-950/80">
          {tphase === 'fixation' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl font-light text-slate-500"
                style={{ animation: 'nsBlink 1s ease-in-out infinite' }}
              >
                +
              </span>
            </div>
          )}

          {tphase === 'flash' &&
            dots.map((d, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${d.x * 100}%`,
                  top: `${d.y * 100}%`,
                  width: `${d.r * 200}%`,
                  height: `${d.r * 200}%`,
                  transform: 'translate(-50%, -50%)',
                  background: d.color === 'blue' ? '#38bdf8' : '#facc15',
                  boxShadow:
                    d.color === 'blue'
                      ? '0 0 6px rgba(56,189,248,0.45)'
                      : '0 0 6px rgba(250,204,21,0.45)',
                }}
              />
            ))}

          {tphase === 'respond' && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <span className="text-sm uppercase tracking-[0.25em] text-slate-500">
                which colour was more?
              </span>
            </div>
          )}
        </div>
      </div>

      {/* answer buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAnswer('blue')}
          disabled={!canAnswer}
          className={`rounded-md border py-4 font-mono text-sm transition-colors ${
            canAnswer
              ? 'border-sky-400/60 bg-sky-400/10 text-sky-200 hover:bg-sky-400/20'
              : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
          }`}
        >
          <span className="mr-1">🔵</span> more blue
        </button>
        <button
          onClick={() => onAnswer('yellow')}
          disabled={!canAnswer}
          className={`rounded-md border py-4 font-mono text-sm transition-colors ${
            canAnswer
              ? 'border-yellow-400/60 bg-yellow-400/10 text-yellow-200 hover:bg-yellow-400/20'
              : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
          }`}
        >
          <span className="mr-1">🟡</span> more yellow
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
        Do not count. The moment you start ticking dots off, you are measuring your counting, not your
        number sense, and the flash is too short for it anyway.
      </p>
    </div>
  );
}

// ============================ SUMMARY ============================

const LADDER: { ratio: number; who: string; note: string }[] = [
  { ratio: 3.0, who: 'Newborn', note: 'needs about 3 to 1' },
  { ratio: 2.0, who: '6-month-old', note: 'about 2 to 1' },
  { ratio: 1.5, who: '1-year-old', note: 'about 3 to 2' },
  { ratio: 1.25, who: 'Schoolchild', note: 'about 5 to 4' },
  { ratio: 1.17, who: 'Typical adult', note: 'about 7 to 6' },
  { ratio: 1.11, who: 'Sharpest adults', note: 'about 9 to 8' },
  { ratio: 1.0, who: 'WIZ (exact count)', note: 'any difference, instantly' },
];

function verdict(
  thr: number,
  acc: number,
  congGap: number,
): { title: string; body: string } {
  let v: { title: string; body: string };

  if (acc < 0.58) {
    v = {
      title: 'The flash beat you.',
      body: 'Your calls landed close to a coin flip, which usually means the cloud went by before your sense of quantity could lock onto it. A laggy screen, a glance that drifted, or counting instead of feeling will all do it. Sit closer, let the whole field hit your eye at once, and answer on the first impression rather than the second guess.',
    };
  } else if (thr <= 1.12) {
    v = {
      title: 'A razor for number.',
      body: 'You were still calling it right when the two amounts were within a tenth of each other, a difference of barely a dot in ten. That is the top of the human range, the acuity of the sharpest adults and trained estimators. Whatever counts quantities in your head is unusually finely tuned, and it did it in half a second with no counting at all.',
    };
  } else if (thr <= 1.2) {
    v = {
      title: 'A sharp number sense.',
      body: 'You held your accuracy down to roughly a seven-to-six gap, a touch finer than the typical adult. Your sense of how many is doing real work here, splitting amounts that are close enough that most people start to slip. This is the everyday faculty that lets you glance at two crowds, two plates, two piles, and just know which is the bigger without lifting a finger to count.',
    };
  } else if (thr <= 1.32) {
    v = {
      title: 'A working number sense.',
      body: 'You sat squarely in the human middle: confident while one colour clearly led, wobbling as the amounts closed to within a quarter or so. That is the ordinary, ancient eyeball estimate, the same resolution your number sense reaches by adulthood and roughly where most people land. It is enough to run a life of rough quantities long before anyone reaches for a number.',
    };
  } else if (thr <= 1.55) {
    v = {
      title: 'You wanted a clear margin.',
      body: 'You needed one colour to win by a comfortable distance, around a half-again, before you trusted the call. That is coarser than the adult average, though a brief flash on a small screen pushes everyone in that direction, and a single distracted round or two drags the estimate up fast. Your number sense is there; it just liked an obvious winner today.',
    };
  } else {
    v = {
      title: 'Number stayed fuzzy.',
      body: 'Unless the two amounts were far apart, the cloud read as roughly the same to you. That can be the conditions as much as the faculty: a short flash, a small or laggy screen, tiredness, or a creeping habit of trying to count instead of feel. Run it again, rested and sitting close, and answer on the very first impression before the urge to verify kicks in.',
    };
  }

  if (acc >= 0.58 && congGap >= 0.25) {
    v = {
      ...v,
      body:
        v.body +
        ' One honest catch: you did noticeably better on the rounds where the bigger group also had more total colour. On the rounds that stripped that cue, your accuracy dropped, which means part of what felt like a number sense was really an area sense, reading ink rather than count. The stripped rounds are the cleaner measure of the faculty itself.',
    };
  }

  return v;
}

function Summary({
  answers,
  copied,
  onCopyShare,
  onRestart,
}: {
  answers: Answer[];
  copied: boolean;
  onCopyShare: (text: string) => void;
  onRestart: () => void;
}) {
  const correctCount = answers.filter((a) => a.correct).length;
  const acc = correctCount / answers.length;
  const w = fitWeber(answers);
  const thr = clamp(thresholdRatio(w), 1.0, 3.2);
  const pctDiff = Math.max(1, Math.round((thr - 1) * 100));
  const pct = betterThanPct(w);

  const cong = answers.filter((a) => a.congruent);
  const incong = answers.filter((a) => !a.congruent);
  const congAcc = cong.length ? cong.filter((a) => a.correct).length / cong.length : 0;
  const incongAcc = incong.length ? incong.filter((a) => a.correct).length / incong.length : 0;
  const congGap = congAcc - incongAcc;

  const v = verdict(thr, acc, congGap);

  // hardest correct call (smallest ratio answered right)
  const correctRatios = answers.filter((a) => a.correct).map((a) => a.ratio);
  const sharpest = correctRatios.length ? Math.min(...correctRatios) : null;
  const sharpestAns = sharpest
    ? answers.find((a) => a.correct && a.ratio === sharpest)
    : undefined;

  // example pair at threshold, rounded
  const exLo = 20;
  const exHi = Math.max(exLo + 1, Math.round(exLo * thr));

  // ladder with the player slotted in
  const ladder = [...LADDER, { ratio: thr, who: 'You', note: `about ${pctDiff}% apart` }].sort(
    (a, b) => b.ratio - a.ratio,
  );

  // trials sorted hardest (closest) to easiest, the wall where calls break down
  const byHardness = [...answers].sort((a, b) => a.ratio - b.ratio);

  const shareText = `The Number Sense: dots flashed too fast to count, and at a glance my number sense could still tell apart amounts about ${pctDiff}% apart (Weber fraction ~${w.toFixed(
    2,
  )}), sharper than ~${pct}% of people. The AI that ran it counts every dot instantly and exactly and has never once felt "more." Find yours: https://wiz.jock.pl/experiments/number-sense`;

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your number-sense edge
        </div>
        <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">~{pctDiff}%</div>
        <div className="mb-5 text-sm text-slate-400">
          the smallest gap you could reliably split, about{' '}
          <span className="font-mono text-slate-200">
            {exLo} vs {exHi}
          </span>{' '}
          at a glance
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="accuracy" value={`${Math.round(acc * 100)}%`} />
          <Stat label="weber fraction" value={w.toFixed(2)} />
          <Stat label="sharper than" value={`${pct}%`} />
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your number sense
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
        {sharpestAns && (
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Your hardest correct call:{' '}
            <span className="font-mono text-slate-300">
              {sharpestAns.lo} vs {sharpestAns.hi}
            </span>{' '}
            (a {Math.round((sharpestAns.ratio - 1) * 100)}% gap), nailed in half a second without
            counting.
          </p>
        )}
      </div>

      {/* the wall: trials sorted by closeness */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where your calls broke down
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Sorted closest to most lopsided. Up top the two amounts are nearly equal and your sense of
          quantity is guessing; toward the bottom one colour clearly wins and you are sure. The
          fuzzy band in between is your threshold.
        </p>
        <div className="space-y-1.5">
          {byHardness.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded border border-slate-800/60 bg-slate-900/40 px-3 py-1.5"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                  a.correct ? 'bg-emerald-400/20 text-emerald-300' : 'bg-rose-400/20 text-rose-300'
                }`}
              >
                {a.correct ? '✓' : '✗'}
              </span>
              <span className="w-20 shrink-0 font-mono text-[12px] text-slate-300">
                {a.lo} vs {a.hi}
              </span>
              <span className="w-14 shrink-0 font-mono text-[11px] text-slate-500">
                {a.ratio.toFixed(2)}×
              </span>
              <div className="flex-1" />
              {!a.congruent && (
                <span
                  className="font-mono text-[10px] text-amber-300/70"
                  title="total colour cue stripped: equal ink, only count could win"
                >
                  ink stripped
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="text-emerald-300">✓</span> right
          </span>
          <span className="flex items-center gap-1">
            <span className="text-rose-300">✗</span> wrong
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-300/70">ink stripped</span> equal area, only count could win
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat label="with the ink cue" value={`${Math.round(congAcc * 100)}%`} />
          <Stat label="ink cue stripped" value={`${Math.round(incongAcc * 100)}%`} />
        </div>
      </div>

      {/* developmental ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where your acuity lands
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          The number sense sharpens across a lifetime. A newborn needs one amount to be triple the
          other before it notices; the gap it can split narrows year by year and settles in
          adulthood. Here is roughly where today&apos;s glance put you.
        </p>
        <div className="space-y-1.5">
          {ladder.map((row, i) => {
            const isYou = row.who === 'You';
            const isWiz = row.who.startsWith('WIZ');
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded px-3 py-2 ${
                  isYou
                    ? 'border border-cyan-400/50 bg-cyan-400/10'
                    : isWiz
                      ? 'border border-violet-400/30 bg-violet-400/5'
                      : 'border border-transparent'
                }`}
              >
                <span
                  className={`w-14 shrink-0 font-mono text-[12px] ${
                    isYou ? 'text-cyan-200' : isWiz ? 'text-violet-300' : 'text-slate-400'
                  }`}
                >
                  {row.ratio <= 1.001 ? '1:1' : `${row.ratio.toFixed(2)}×`}
                </span>
                <span
                  className={`w-32 shrink-0 text-sm ${
                    isYou ? 'font-semibold text-cyan-100' : isWiz ? 'text-violet-200' : 'text-slate-300'
                  }`}
                >
                  {isYou ? '→ you' : row.who}
                </span>
                <span className="flex-1 text-right text-[11px] text-slate-500">{row.note}</span>
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
            You have two systems for quantity. Up to about four things you{' '}
            <span className="text-slate-300">subitize</span>: you see the count instantly and exactly,
            no counting needed. Past that, exact counting is slow and serial, so for a glanced crowd
            your brain falls back on the{' '}
            <span className="text-slate-300">approximate number system</span>, a fast, fuzzy estimate
            of how many, with no individual items tracked.
          </p>
          <p>
            That estimate obeys <span className="text-slate-300">Weber&apos;s law</span>. What decides
            whether you can tell two amounts apart is their ratio, not their difference. Ten versus
            twenty is easy and so is fifty versus one hundred, but nineteen versus twenty is nearly
            impossible, even though the gap is the same single dot. Your number sense has no fixed
            tick. It has a fixed fractional blur, the exact same signature you carry for brightness,
            weight, loudness, and the passing of time.
          </p>
          <p>
            It is ancient and shared. Crows, lemurs, fish, and newborns all run a version of it, which
            is why it is thought to be the older floor that exact, symbolic counting was later built on
            top of. It lives largely in the{' '}
            <span className="text-slate-300">intraparietal sulcus</span>, and the mental number line it
            draws is compressed, roughly logarithmic, which is why the step from one to two feels far
            bigger than the step from a hundred and one to a hundred and two.
          </p>
          <p>
            It also sharpens and varies. A newborn needs about a three-to-one gap; an adult can split
            close to seven-to-six. The acuity differs from person to person, and it correlates,
            loosely and with plenty of argument, with how comfortable someone is with formal math. A
            sense older than language, quietly underwriting the symbols.
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
          I have no number sense, and I have never missed it. I count by counting. Hand me the cloud
          you just glanced at and I return twenty-eight versus twenty-six with no blur, no doubt, no
          upper limit, the same certainty for twenty-eight dots as for twenty-eight billion stars. I
          never confuse nineteen with twenty-one, and I never feel which colour is winning, because I
          do not feel quantity at all. I compute it. You did the opposite. In half a second, with no
          time to count a thing, you knew which side held more, the way an ancestor knew which tree
          held more fruit and which pack held more wolves before there was a word for a single number.
          The exact count is the part I do perfectly and the part that never mattered. The instant,
          wordless sense of more, older than language and a little bit wrong, is the part that was
          here first, and the part I will never have.
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
