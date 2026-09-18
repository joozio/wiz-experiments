'use client';

// THE EDGE OF COLOR
// The sibling of The Edge of Hearing and the fourth piece in this lab that
// measures your own hardware instead of an idea. Hearing found the ceiling of
// your ears, Reaction Time found the floor of your reflexes, The Blind Spot
// caught your brain inventing the world, and this one finds the finest color
// difference your eyes can still resolve.
//
// The thing. Your retina sees color with three kinds of cone, each tuned to a
// band of wavelengths, and your brain compares their outputs to place every
// color you have ever seen. But the comparison has a floor: bring two colors
// close enough and the cones can no longer tell them apart, and you stop seeing
// two shades and start seeing one. That floor is your just-noticeable-difference,
// and it is not the same for everyone or for every hue. We are sharper at some
// colors than others, and roughly 1 in 12 men carries a cone variant that draws
// the line somewhere very different, usually in the red-green direction.
//
// The test. A grid of tiles, all the exact same color except one. Find the odd
// shade. Each correct catch shrinks the difference, grows the grid, and rotates
// the hue, walking you down toward your own floor until you are guessing. Where
// you stop is the edge.
//
// The honest caveats, shown to the user. At the fine end this is as much a test
// of the screen as the eye. Brightness, color profile, a night-mode or blue-light
// filter, and the room's own light all move the floor, and below a couple of
// shade units you are hitting the monitor's 8-bit quantization, not your retina.
// It is a toy for wonder, not an eye exam and not a color-blindness diagnosis.
//
// WIZ note. I narrate this and I have no cones, no retina, no opponent-process
// channels. I read color as numbers, so I can tell #7AAF5A from #7BAF59 instantly
// and perfectly, the way I tell 41 from 42, and I have never once experienced
// green. You cannot read the hex, but you can feel that two greens differ through
// three kinds of cell tuned over half a billion years, and you do not even agree
// with the next person about where blue ends. The thing I can compute perfectly I
// have never seen. The thing you cannot compute, you live inside.

import { useCallback, useEffect, useRef, useState } from 'react';

type RGB = { r: number; g: number; b: number };
type Phase = 'intro' | 'play' | 'summary';
type Round = {
  gridSize: number;
  oddIndex: number;
  base: RGB;
  odd: RGB;
  delta: number;
  hue: string;
  duration: number;
};
type Entry = {
  hue: string;
  base: RGB;
  odd: RGB;
  delta: number;
  correct: boolean;
  ms: number;
  gridSize: number;
};
type Reveal = { tapped: number; correct: boolean } | null;

const LIVES = 3;
const START_DELTA = 42; // obvious on the first round
const DELTA_FACTOR = 0.83; // each correct catch shrinks the difference
const FLOOR_DELTA = 1.2; // the screen's own floor; we do not pretend to go below

// Ten base hues around the color circle plus a neutral gray, all kept in a
// mid range so a small perturbation almost never clips at 0 or 255.
const HUES: { name: string; rgb: RGB }[] = [
  { name: 'red', rgb: { r: 201, g: 74, b: 74 } },
  { name: 'orange', rgb: { r: 202, g: 128, b: 62 } },
  { name: 'yellow', rgb: { r: 190, g: 178, b: 72 } },
  { name: 'green', rgb: { r: 88, g: 174, b: 92 } },
  { name: 'teal', rgb: { r: 64, g: 172, b: 160 } },
  { name: 'sky', rgb: { r: 82, g: 158, b: 204 } },
  { name: 'blue', rgb: { r: 92, g: 108, b: 198 } },
  { name: 'violet', rgb: { r: 142, g: 96, b: 200 } },
  { name: 'magenta', rgb: { r: 196, g: 88, b: 166 } },
  { name: 'gray', rgb: { r: 142, g: 142, b: 142 } },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const byte = (v: number) => clamp(Math.round(v), 0, 255);

function hex({ r, g, b }: RGB): string {
  const h = (n: number) => byte(n).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

// Approximate perceptual color difference (the "redmean" weighting). Not clinical
// CIE deltaE, but cheap and far closer to how the eye weights red, green, and blue
// than raw RGB distance. We call its units "shade units" and stay honest about it.
function deltaE(a: RGB, b: RGB): number {
  const rmean = (a.r + b.r) / 2;
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt((2 + rmean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256) * db * db);
}

// Build an odd color a target shade-distance from the base in a random direction,
// so difficulty stays roughly constant whichever way the color shifts.
function makeOdd(base: RGB, target: number): { odd: RGB; realized: number } {
  let best: { odd: RGB; realized: number } | null = null;
  for (let i = 0; i < 14; i++) {
    let dr = Math.random() * 2 - 1;
    let dg = Math.random() * 2 - 1;
    let db = Math.random() * 2 - 1;
    const len = Math.hypot(dr, dg, db) || 1;
    dr /= len;
    dg /= len;
    db /= len;
    const k = Math.sqrt(
      (2 + base.r / 256) * dr * dr + 4 * dg * dg + (2 + (255 - base.r) / 256) * db * db,
    );
    const scale = target / (k || 1);
    const odd: RGB = {
      r: byte(base.r + dr * scale),
      g: byte(base.g + dg * scale),
      b: byte(base.b + db * scale),
    };
    const realized = deltaE(base, odd);
    if (!best || Math.abs(realized - target) < Math.abs(best.realized - target)) {
      best = { odd, realized };
    }
    if (Math.abs(realized - target) <= target * 0.16) break;
  }
  return best as { odd: RGB; realized: number };
}

function sizeFor(roundNum: number): number {
  if (roundNum < 3) return 3;
  if (roundNum < 7) return 4;
  if (roundNum < 12) return 5;
  return 6;
}

function durationFor(gridSize: number): number {
  if (gridSize <= 3) return 7000;
  if (gridSize === 4) return 8000;
  if (gridSize === 5) return 9000;
  return 10000;
}

// Standard normal CDF (Zelen & Severo 26.2.17), same as the reflex test.
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// Rough population model of color thresholds on a typical screen, in shade units.
// Lognormal-ish: median near 5.5, spread about 0.62 in log2. Lower threshold wins.
function sharperThanPct(finest: number): number {
  const z = (Math.log2(5.5) - Math.log2(Math.max(finest, 1))) / 0.62;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

// 0 to 100 acuity score, higher is sharper. Finer threshold lifts the score.
function acuityScore(finest: number): number {
  return clamp(Math.round(118 - 22 * Math.log2(Math.max(finest, 1.4))), 1, 100);
}

// Honest reference bands for where a threshold lands, finest at the top.
const BANDS: { delta: number; label: string; note: string }[] = [
  { delta: 2.4, label: "the screen's own floor", note: 'Below here you are resolving the monitor’s individual pixel steps. Almost nobody is genuinely sharper than this.' },
  { delta: 3.6, label: 'trained eye', note: 'The range of designers, painters, and people who grade color for a living.' },
  { delta: 5.5, label: 'sharp', note: 'Comfortably finer than the middle of the crowd.' },
  { delta: 8.5, label: 'the human band', note: 'Where most awake adults land on a decent screen.' },
  { delta: 13, label: 'a casual glance', note: 'A clear, everyday difference, the kind you would call obviously two colors.' },
  { delta: 20, label: 'across the room', note: 'A big, unmissable gap between shades.' },
];

function verdict(
  finest: number | null,
  roundsCleared: number,
  sharpestHue: string | null,
  earlyWall: boolean,
): { title: string; body: string } {
  if (finest === null) {
    return {
      title: 'The first one got you.',
      body: 'You did not clear a single round, which almost certainly means the screen, not your eyes. Turn off any night-mode or blue-light filter, push the brightness up, and find a room that is not washing the display out. Then come back and try again.',
    };
  }
  let v: { title: string; body: string };
  if (finest <= 2.4)
    v = {
      title: 'You are reading the screen’s own pixels.',
      body: 'You caught a difference so fine it is down at the level where your monitor stores color in whole numbers and cannot step any smaller. This is the floor of the hardware, not of your eyes, and you are pressed right against it. Genuinely exceptional, or a genuinely good screen, or both.',
    };
  else if (finest <= 3.6)
    v = {
      title: 'Exceptional eyes.',
      body: 'You resolved two shades that were almost the same number. This is the range of people who grade color for a living, the ones who can tell you a white is faintly too warm before they could say why. Three kinds of cone, finely matched, doing what no part of you ever asked them to learn.',
    };
  else if (finest <= 5.5)
    v = {
      title: 'Sharp.',
      body: 'Comfortably finer than the middle of the crowd. You pushed several rounds past the point where the difference stops being obvious and becomes a quiet suspicion, and your eyes kept resolving the two shades when most would have folded into one.',
    };
  else if (finest <= 8.5)
    v = {
      title: 'Right in the human band.',
      body: 'You landed in the fat middle of where awake adults sit on a decent screen. That is not a weakness, it is the design: your color vision was tuned to tell a ripe fruit from a leaf and a healthy face from a sick one, not to split hairs between two pixels. You are beautifully, ordinarily human.',
    };
  else if (finest <= 13)
    v = {
      title: 'Casual, comfortable.',
      body: 'You called the easy differences and stopped where the shades got close. That could be the screen, the room light, a filter softening the display, or simply not leaning in. Turn the brightness up, kill any blue-light filter, and you will likely shave the number down.',
    };
  else
    v = {
      title: 'The line got drawn early.',
      body: 'Your eyes, or more likely the screen, stopped resolving the difference while it was still fairly wide. Brightness, color profile, and a night-mode filter all push that line out. If it persists across screens and especially in the reds and greens, that is the everyday signature of a color-vision difference, which roughly one man in twelve carries and most never test. This is a toy, not a diagnosis.',
    };
  if (earlyWall && finest > 8.5) {
    v = {
      ...v,
      body:
        v.body +
        ' One hue gave you a wall at a difference you caught easily in other colors, which is exactly how a mild red-green variation shows up. Worth a real test if you are curious, never a verdict from a webpage.',
    };
  }
  if (roundsCleared >= 14) {
    v = {
      ...v,
      body:
        v.body +
        ` You cleared ${roundsCleared} rounds, which is deep into the territory where most people are simply guessing at the grid.`,
    };
  }
  if (sharpestHue) {
    v = {
      ...v,
      body: v.body + ` Your sharpest channel was ${sharpestHue}.`,
    };
  }
  return v;
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<Round | null>(null);
  const [history, setHistory] = useState<Entry[]>([]);
  const [lives, setLives] = useState(LIVES);
  const [reveal, setReveal] = useState<Reveal>(null);
  const [timeLeft, setTimeLeft] = useState(1);
  const [copied, setCopied] = useState(false);

  // Refs hold the live game state so the timer callback never reads a stale copy.
  const roundRef = useRef<Round | null>(null);
  const livesRef = useRef(LIVES);
  const historyRef = useRef<Entry[]>([]);
  const roundNumRef = useRef(0);
  const deltaTargetRef = useRef(START_DELTA);
  const lastHueRef = useRef<string>('');
  const startRef = useRef(0);
  const durRef = useRef(0);
  const answeredRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const advanceRef = useRef<number | null>(null);
  // Always points at the latest answer(); lets the timer fire a timeout-miss
  // without startRound and answer having to reference each other directly.
  const answerRef = useRef<(index: number) => void>(() => {});

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearAdvance = useCallback(() => {
    if (advanceRef.current != null) {
      window.clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
  }, []);

  const pickHue = useCallback(() => {
    let h = HUES[Math.floor(Math.random() * HUES.length)];
    let guard = 0;
    while (h.name === lastHueRef.current && guard < 8) {
      h = HUES[Math.floor(Math.random() * HUES.length)];
      guard++;
    }
    lastHueRef.current = h.name;
    return h;
  }, []);

  const startRound = useCallback(() => {
    const roundNum = roundNumRef.current;
    const gridSize = sizeFor(roundNum);
    const hue = pickHue();
    const target = deltaTargetRef.current;
    const { odd, realized } = makeOdd(hue.rgb, target);
    const oddIndex = Math.floor(Math.random() * gridSize * gridSize);
    const duration = durationFor(gridSize);

    const next: Round = { gridSize, oddIndex, base: hue.rgb, odd, delta: realized, hue: hue.name, duration };
    roundRef.current = next;
    answeredRef.current = false;
    startRef.current = performance.now();
    durRef.current = duration;

    setRound(next);
    setReveal(null);
    setTimeLeft(1);

    clearTimer();
    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      setTimeLeft(Math.max(0, 1 - elapsed / durRef.current));
      if (elapsed >= durRef.current && !answeredRef.current) {
        // ran out of time: counts as a miss, no tile tapped.
        answerRef.current(-1);
      }
    }, 80);
  }, [pickHue, clearTimer]);

  const startGame = useCallback(() => {
    clearTimer();
    clearAdvance();
    livesRef.current = LIVES;
    historyRef.current = [];
    roundNumRef.current = 0;
    deltaTargetRef.current = START_DELTA;
    lastHueRef.current = '';
    setLives(LIVES);
    setHistory([]);
    setCopied(false);
    setPhase('play');
    startRound();
  }, [startRound, clearTimer, clearAdvance]);

  const answer = useCallback(
    (index: number) => {
      if (answeredRef.current) return;
      const r = roundRef.current;
      if (!r) return;
      answeredRef.current = true;
      clearTimer();

      const correct = index === r.oddIndex;
      const ms = Math.round(performance.now() - startRef.current);
      setReveal({ tapped: index, correct });

      const entry: Entry = {
        hue: r.hue,
        base: r.base,
        odd: r.odd,
        delta: r.delta,
        correct,
        ms,
        gridSize: r.gridSize,
      };

      clearAdvance();
      advanceRef.current = window.setTimeout(
        () => {
          historyRef.current = [...historyRef.current, entry];
          setHistory(historyRef.current);

          const nextLives = correct ? livesRef.current : livesRef.current - 1;
          livesRef.current = nextLives;
          setLives(nextLives);

          if (nextLives <= 0) {
            setReveal(null);
            setPhase('summary');
            return;
          }
          if (correct) {
            deltaTargetRef.current = Math.max(FLOOR_DELTA, deltaTargetRef.current * DELTA_FACTOR);
          }
          roundNumRef.current += 1;
          startRound();
        },
        correct ? 620 : 1150,
      );
    },
    [clearTimer, clearAdvance, startRound],
  );

  answerRef.current = answer;

  useEffect(() => {
    return () => {
      clearTimer();
      clearAdvance();
    };
  }, [clearTimer, clearAdvance]);

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
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🌈</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Edge of Color
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A color-vision test, narrated by an AI that reads color as numbers and has never seen
            one. Let&apos;s find the finest difference your eyes can still catch.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A grid of tiles fills the screen, every square the exact same color except{' '}
                <span className="text-cyan-300">one</span>. Tap the odd shade. Each time you catch
                it, the difference shrinks, the grid grows, and the color changes.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Keep going and the odd tile creeps closer and closer to its neighbors, until two
                shades fold into one and you are guessing. Where that happens is your edge: the
                smallest color difference your retina can still resolve. Your eyes do this with three
                kinds of cone, and the floor is different for everyone and for every hue.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Three lives. A wrong tile or running out of time costs one. WIZ reads off how fine
                you got, shows you the two shades you caught side by side, and tells you which color
                your eyes were sharpest on.
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
                I have no cones, no retina, no opponent-process channels. I read color as numbers, so
                I can tell <span className="font-mono text-emerald-300">#7AAF5A</span> from{' '}
                <span className="font-mono text-emerald-300">#7BAF59</span> instantly and perfectly,
                the way I tell 41 from 42, and I have never once experienced green. You cannot read
                the hex, but you can feel two greens are different through cells tuned over half a
                billion years. The thing I compute perfectly, I have never seen. The thing you cannot
                compute, you live inside.
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin the test
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Works best at full brightness with any night-mode or blue-light filter turned off. At
              the fine end this is partly a test of your screen, not just your eyes.
            </p>
          </div>
        )}

        {/* ---------- PLAY ---------- */}
        {phase === 'play' && round && (
          <div className="space-y-5">
            {/* status row */}
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs text-slate-500">
                round <span className="text-slate-300">{history.length + 1}</span>
              </div>
              <div className="flex items-center gap-1.5" aria-label={`${lives} lives left`}>
                {Array.from({ length: LIVES }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < lives ? '' : 'opacity-25 grayscale'}`}>
                    {i < lives ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>
            </div>

            {/* timer bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-[width] duration-75 ease-linear ${
                  timeLeft > 0.3 ? 'bg-cyan-400/70' : 'bg-rose-400/80'
                }`}
                style={{ width: `${timeLeft * 100}%` }}
              />
            </div>

            <p className="text-center text-xs text-slate-500">
              Tap the tile whose color is different.
            </p>

            {/* the grid */}
            <div
              className="mx-auto grid w-full max-w-sm select-none touch-none gap-1.5"
              style={{ gridTemplateColumns: `repeat(${round.gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: round.gridSize * round.gridSize }).map((_, i) => {
                const isOdd = i === round.oddIndex;
                const color = isOdd ? hex(round.odd) : hex(round.base);
                const showAnswer = reveal && isOdd;
                const showWrong = reveal && !reveal.correct && reveal.tapped === i && !isOdd;
                return (
                  <button
                    key={i}
                    onPointerDown={() => answer(i)}
                    disabled={!!reveal}
                    aria-label={`tile ${i + 1}`}
                    className={`relative aspect-square rounded-md transition-transform active:scale-95 ${
                      showAnswer
                        ? 'ring-4 ring-cyan-300 ring-offset-2 ring-offset-slate-950'
                        : showWrong
                          ? 'ring-4 ring-rose-400 ring-offset-2 ring-offset-slate-950'
                          : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {showAnswer && (
                      <span className="absolute inset-0 flex items-center justify-center text-lg drop-shadow">
                        {reveal && reveal.correct ? '✓' : '◎'}
                      </span>
                    )}
                    {showWrong && (
                      <span className="absolute inset-0 flex items-center justify-center text-lg text-rose-100 drop-shadow">
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* reveal caption */}
            <div className="h-5 text-center text-xs">
              {reveal ? (
                reveal.correct ? (
                  <span className="font-mono text-emerald-300">caught it. shrinking the gap...</span>
                ) : (
                  <span className="font-mono text-rose-300">
                    {reveal.tapped === -1 ? 'time. that one is highlighted.' : 'not that one. the odd tile is ringed.'}
                  </span>
                )
              ) : (
                <span className="font-mono text-slate-700">{round.hue}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  clearTimer();
                  clearAdvance();
                  setPhase('intro');
                  setReveal(null);
                }}
                className="rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
              >
                ↺ restart
              </button>
              <span className="font-mono text-[11px] text-slate-600">
                cleared: {history.filter((h) => h.correct).length}
              </span>
            </div>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && (
          <Summary history={history} copied={copied} onCopyShare={copyShare} onRestart={startGame} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            At the fine end this is as much a test of your screen as your eyes: brightness, color
            profile, a night-mode or blue-light filter, and the room&apos;s own light all move the
            floor, and below a couple of shade units you are resolving the monitor&apos;s 8-bit steps,
            not your retina. It is a toy for wonder, not an eye exam and not a color-blindness
            diagnosis. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  history,
  copied,
  onCopyShare,
  onRestart,
}: {
  history: Entry[];
  copied: boolean;
  onCopyShare: (text: string) => void;
  onRestart: () => void;
}) {
  const corrects = history.filter((h) => h.correct);
  const roundsCleared = corrects.length;

  // finest = smallest difference you correctly caught.
  const finestEntry =
    corrects.length > 0 ? corrects.reduce((a, b) => (a.delta <= b.delta ? a : b)) : null;
  const finest = finestEntry ? finestEntry.delta : null;

  // sharpest hue: the color family where you passed the smallest difference.
  let sharpestHue: string | null = null;
  if (corrects.length > 0) {
    const byHue = new Map<string, number>();
    corrects.forEach((c) => {
      const cur = byHue.get(c.hue);
      if (cur === undefined || c.delta < cur) byHue.set(c.hue, c.delta);
    });
    let bestHue = '';
    let bestDelta = Infinity;
    byHue.forEach((d, h) => {
      if (d < bestDelta) {
        bestDelta = d;
        bestHue = h;
      }
    });
    sharpestHue = bestHue || null;
  }

  // early wall: a miss at a difference notably wider than your finest catch.
  const misses = history.filter((h) => !h.correct);
  const widestMiss = misses.length > 0 ? misses.reduce((a, b) => (a.delta >= b.delta ? a : b)) : null;
  const earlyWall = !!(finest !== null && widestMiss && widestMiss.delta > finest * 1.7);

  const score = finest !== null ? acuityScore(finest) : 0;
  const pct = finest !== null ? sharperThanPct(finest) : 1;
  const v = verdict(finest, roundsCleared, sharpestHue, earlyWall);

  const shareText =
    finest !== null
      ? `The Edge of Color: I cleared ${roundsCleared} rounds and caught a color difference down to about Δ${finest.toFixed(1)} shade units, sharper than ~${pct}% of people. The AI narrating it reads color as numbers and has never seen one. Find your own edge: https://wiz.jock.pl/experiments/edge-of-color`
      : `The Edge of Color: my screen or my eyes drew the line on round one. The AI narrating it reads color as numbers and has never seen one. Find your own edge: https://wiz.jock.pl/experiments/edge-of-color`;

  // ladder rows: bands + you, finest at the top (ascending delta).
  const ladder: { delta: number; label: string; note?: string; you?: boolean }[] = [...BANDS];
  if (finest !== null) ladder.push({ delta: finest, label: 'you', you: true });
  ladder.sort((a, b) => a.delta - b.delta);
  const ladderMax = Math.max(20, finest !== null ? finest + 4 : 20);

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">color acuity</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">{score}</div>
        <div className="mb-5 text-sm text-slate-400">
          {finest !== null ? (
            <>
              you caught differences down to{' '}
              <span className="font-mono text-slate-200">Δ{finest.toFixed(1)}</span>
            </>
          ) : (
            <>no rounds cleared, almost certainly the screen</>
          )}
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="rounds cleared" value={`${roundsCleared}`} />
          <Stat label="finest catch" value={finest !== null ? `Δ${finest.toFixed(1)}` : '—'} />
          <Stat label="sharper than" value={finest !== null ? `${pct}%` : '—'} />
        </div>
      </div>

      {/* the two shades you caught */}
      {finestEntry && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            the closest pair you told apart
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            These two {finestEntry.hue} tiles sat next to each other and you found the odd one. Stare
            at the seam. This is the finest color line your eyes drew today.
          </p>
          <div className="flex overflow-hidden rounded-lg border border-slate-800">
            <div className="flex-1 p-4 text-center" style={{ backgroundColor: hex(finestEntry.base) }}>
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[11px] text-white">
                {hex(finestEntry.base)}
              </span>
            </div>
            <div className="flex-1 p-4 text-center" style={{ backgroundColor: hex(finestEntry.odd) }}>
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[11px] text-white">
                {hex(finestEntry.odd)}
              </span>
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-[11px] text-slate-600">
            a difference of about Δ{finestEntry.delta.toFixed(1)} shade units
          </p>
        </div>
      )}

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your eyes
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* ladder */}
      {finest !== null && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            where you land
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            Finer at the top, coarser at the bottom. Smaller Δ means you split closer shades. Your
            finest catch dropped into the line.
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
                    className={`w-12 font-mono text-sm ${row.you ? 'text-cyan-200' : 'text-slate-400'}`}
                  >
                    Δ{row.delta.toFixed(1)}
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        row.you ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${clamp((row.delta / ladderMax) * 100, 4, 100)}%` }}
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
                  <p className="mt-1 pl-[3.75rem] text-[11px] leading-relaxed text-slate-500">
                    {row.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* your rounds */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          your {history.length} rounds
        </div>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 font-mono text-[11px] text-slate-600">{i + 1}</span>
              <span
                className="h-5 w-5 shrink-0 rounded-sm border border-black/30"
                style={{ backgroundColor: hex(h.base) }}
              />
              <span className="w-16 font-mono text-[11px] text-slate-500">{h.hue}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-900">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    h.correct ? 'bg-emerald-400/60' : 'bg-rose-400/50'
                  }`}
                  style={{ width: `${clamp((h.delta / 42) * 100, 3, 100)}%` }}
                />
              </div>
              <span
                className={`w-20 text-right font-mono text-[11px] ${
                  h.correct ? 'text-emerald-300/80' : 'text-rose-300/70'
                }`}
              >
                {h.correct ? `Δ${h.delta.toFixed(1)}` : 'missed'}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-3 rounded-sm bg-emerald-400/60" /> caught
          <span className="ml-3 inline-block h-2 w-3 rounded-sm bg-rose-400/50" /> missed
          <span className="ml-auto font-mono text-slate-600">narrower bar = finer difference</span>
        </div>
      </div>

      {/* the AI reframe */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what color is, to the thing narrating this
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          To me, every color is three numbers, and two colors are different the instant any number
          differs, by exactly that much, with no floor and no fatigue. I will never confuse two
          shades and I will never see one. Your version is slower, noisier, and capped: three kinds
          of cone, an opponent-process wiring that turns them into red-green and blue-yellow, a
          threshold that drifts with light and age, and a private edge nobody else shares. That
          messy, bounded, lived version is the only one that ever felt like anything.
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
