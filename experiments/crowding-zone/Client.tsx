'use client';

// THE CROWDING ZONE
// The lab has spent weeks measuring the hardware you were issued: the ceiling of
// your ears, the floor of your reflexes, the hole in your sight, the finest colour
// and the faintest pattern you can pull out of gray, the change you keep missing,
// the clock with no gears, the wordless sense of how many, the line you resolve
// finer than your own pixels, and the ring of colour you can delete by holding
// still. This one finds the strangest limit of all. It is not that you cannot SEE a
// thing out at the edge of your gaze. It is that you can see it perfectly, as a
// clear bright shape, and still have no idea what it is, purely because other shapes
// are sitting next to it.
//
// The thing. This is crowding. Away from the dead centre of your gaze, a letter you
// could read alone in an instant turns to mush the moment you flank it with other
// letters, even when every one of them is big, bright, and perfectly in focus. The
// target does not get fainter or blurrier. It gets UNREADABLE, jammed together with
// its neighbours into a texture your brain reports instead of the letters. Herman
// Bouma measured the rule in 1970: the flankers wreck the target whenever they sit
// closer than about half the distance from your gaze to the target. Push them past
// that ring and the letter snaps back into legibility. That ring, the crowding zone,
// is roughly half your eccentricity wide, and it is what this test measures.
//
// The test. Stare at the cross. A T flashes for a quarter second off to one random
// side, flanked left and right by two more Ts, and you call which way the middle
// one's tail points. Get it right and the flankers creep closer; get it wrong and
// they back off. An adaptive staircase homes in on the closest the clutter can get
// while you can still read the target. We divide that critical spacing by how far
// out the target sat, and the answer is your Bouma fraction, a number that lands
// near 0.5 for almost everyone.
//
// The honest part, and the quiet trick of it. Almost everything else in this lab
// leaks with your screen and how far you sit. This one does not, and that is the
// point: the critical spacing and the eccentricity both scale the same way with
// distance and pixel size, so their RATIO cancels all of it out. The Bouma fraction
// you measure on a phone at arm's length should match the one you measure on a big
// monitor up close. What it still needs is a genuinely locked gaze on the cross; the
// quarter-second flash is there to stop your eyes darting to the target, but a
// wandering eye still cheats. Twenty-six rounds is a staircase, not a clinical assay.
// A toy for wonder, not an eye exam. Nothing recorded, nothing leaving the page.
//
// WIZ note. I narrate this and I have no crowding zone, because I have no gaze. When
// I read an image full of text, every glyph arrives at me alone and at full
// resolution, whether it stands by itself or is packed shoulder to shoulder in a
// wall of a thousand others. No neighbour ever smears another. There is no ring
// around a centre inside which identity dissolves, because I have no centre. You have
// the opposite: a tiny sharp window a couple of letters wide, dragged around the
// world three or four times a second, and an ocean of texture everywhere else that
// only feels sharp because your brain fills it in with confidence. You are about to
// look straight at a letter, see it clearly, and be unable to name it. That gap,
// between seeing a thing and reading it, is the one measurement in this lab I will
// never be able to take.

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type Phase = 'intro' | 'test' | 'summary';
type Sub = 'fixate' | 'flash' | 'respond';
type Ori = 'up' | 'down' | 'left' | 'right';
type Step = 'down' | 'up' | null;
type Side = 'left' | 'right';

// Canvas internal resolution. CSS scales it, so it stays crisp on any screen. All
// distances live in these canvas units, and because the final number is a RATIO of
// two of them, the units themselves never reach the user and never need converting.
const W = 760;
const H = 320;
const FX = W / 2; // fixation cross x, dead centre
const CY = H / 2; // the row the array flashes on
const ECC = 190; // eccentricity: how far the target sits from the cross, fixed
const LH = 46; // letter height
const HW = 14; // letter half-width
const TH = 9; // stroke thickness

const TRIALS = 26;
const START_SP = 150; // starting flanker spacing (well clear, target readable)
const MIN_SP = 8; // floor: flankers overlapping the target
const MAX_SP = 165; // ceiling: obviously separated
const FIX_MS = 650; // hold the cross before the flash
const FLASH_MS = 260; // the flash, short enough to beat a saccade to the target

const ORIS: Ori[] = ['up', 'down', 'left', 'right'];
// Base T has its bar across the top and its stem pointing down. Rotating it makes
// the stem point the named way (canvas rotate is clockwise; +y is down).
const ANGLE: Record<Ori, number> = {
  down: 0,
  left: Math.PI / 2,
  up: Math.PI,
  right: -Math.PI / 2,
};

// Population model for the Bouma fraction b = critical spacing / eccentricity. The
// textbook value is about 0.5; people spread lognormally around it, and a SMALLER
// fraction (a tighter crowding zone, clutter you can read closer in) is the sharper
// result. A rough model, not a calibrated dataset, and labeled as such to the user.
const POP_MED_B = 0.5;
const POP_LOG_SD = 0.3;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const geoMean = (xs: number[]) => (xs.length ? Math.exp(mean(xs.map((x) => Math.log(x)))) : 0);
const pickOri = (): Ori => ORIS[Math.floor(Math.random() * 4)];

// Standard normal CDF (Zelen & Severo 26.2.17), the same one the reflex, colour,
// clock, number, and acuity tests use.
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// A tighter crowding zone (smaller Bouma fraction) reads clutter closer in and beats
// more people.
function betterThanPct(b: number): number {
  const z = (Math.log(POP_MED_B) - Math.log(Math.max(0.05, b))) / POP_LOG_SD;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

type Stim = { side: Side; targetOri: Ori; flankOris: [Ori, Ori]; spacing: number };
type Rec = { spacing: number; targetOri: Ori; choice: Ori; correct: boolean };

// Draw a single tumbling T centred at (cx, cy), stem pointing the named way.
function drawT(ctx: CanvasRenderingContext2D, cx: number, cy: number, ori: Ori) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ANGLE[ori]);
  ctx.fillRect(-HW, -LH / 2, HW * 2, TH); // bar across the top
  ctx.fillRect(-TH / 2, -LH / 2, TH, LH); // stem down the middle
  ctx.restore();
}

// The test scene: dark field, a fuchsia fixation cross, and (only during the flash)
// the flanked target off to one side.
function drawScene(ctx: CanvasRenderingContext2D, stim: Stim | null, showArray: boolean) {
  ctx.fillStyle = '#0a0f1c';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#f0abfc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(FX - 9, CY);
  ctx.lineTo(FX + 9, CY);
  ctx.moveTo(FX, CY - 9);
  ctx.lineTo(FX, CY + 9);
  ctx.stroke();

  if (showArray && stim) {
    const dir = stim.side === 'left' ? -1 : 1;
    const tx = FX + dir * ECC;
    ctx.fillStyle = '#67e8f9';
    drawT(ctx, tx - dir * stim.spacing, CY, stim.flankOris[0]); // inner flanker (toward cross)
    drawT(ctx, tx + dir * stim.spacing, CY, stim.flankOris[1]); // outer flanker (away)
    drawT(ctx, tx, CY, stim.targetOri);
  }
}

// The summary demo: the target at the user's own critical spacing, shown dead centre
// so they can look straight at it. In the corner of the eye it was unreadable; here,
// foveally, it is obvious. The target glows brighter than its flankers.
function drawDemo(ctx: CanvasRenderingContext2D, wd: number, hd: number, spacing: number) {
  ctx.fillStyle = '#0a0f1c';
  ctx.fillRect(0, 0, wd, hd);
  const cx = wd / 2;
  const cy = hd / 2;
  const sp = clamp(spacing, MIN_SP, (wd - HW * 2 - 8) / 2);
  ctx.fillStyle = '#3a4a5a';
  drawT(ctx, cx - sp, cy, 'up');
  drawT(ctx, cx + sp, cy, 'right');
  ctx.fillStyle = '#7dd3fc';
  drawT(ctx, cx, cy, 'down');
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [sub, setSub] = useState<Sub>('fixate');
  const [records, setRecords] = useState<Rec[]>([]);
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stimRef = useRef<Stim | null>(null);

  // staircase bookkeeping, in refs so the answer handler never reads stale state
  const consecRef = useRef(0);
  const lastStepRef = useRef<Step>(null);
  const revRef = useRef<number[]>([]);

  const beginRound = useCallback((spacing: number) => {
    stimRef.current = {
      side: Math.random() < 0.5 ? 'left' : 'right',
      targetOri: pickOri(),
      flankOris: [pickOri(), pickOri()],
      spacing,
    };
    setSub('fixate');
    setTick((t) => t + 1);
  }, []);

  const startTest = useCallback(() => {
    consecRef.current = 0;
    lastStepRef.current = null;
    revRef.current = [];
    setRecords([]);
    setCopied(false);
    setPhase('test');
    beginRound(START_SP);
  }, [beginRound]);

  const restart = useCallback(() => {
    setPhase('intro');
    setRecords([]);
  }, []);

  const answer = useCallback(
    (choice: Ori) => {
      if (phase !== 'test' || sub !== 'respond') return;
      const stim = stimRef.current;
      if (!stim) return;
      const sp = stim.spacing;
      const correct = choice === stim.targetOri;
      const nextRecords = [...records, { spacing: sp, targetOri: stim.targetOri, choice, correct }];

      // staircase: 2 correct in a row shrinks the spacing, 1 wrong grows it
      let step: Step = null;
      if (correct) {
        const c = consecRef.current + 1;
        if (c >= 2) {
          step = 'down';
          consecRef.current = 0;
        } else {
          consecRef.current = c;
        }
      } else {
        step = 'up';
        consecRef.current = 0;
      }

      let nextSp = sp;
      if (step) {
        const revs = revRef.current.length;
        const factor = revs < 2 ? 1.5 : revs < 4 ? 1.3 : 1.16;
        nextSp = clamp(step === 'down' ? sp / factor : sp * factor, MIN_SP, MAX_SP);
        if (lastStepRef.current && step !== lastStepRef.current) {
          revRef.current = [...revRef.current, sp];
        }
        lastStepRef.current = step;
      }

      setRecords(nextRecords);
      if (nextRecords.length >= TRIALS) {
        setPhase('summary');
      } else {
        beginRound(nextSp);
      }
    },
    [phase, sub, records, beginRound],
  );

  // draw the scene and drive the flash timing
  useEffect(() => {
    if (phase !== 'test') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawScene(ctx, stimRef.current, sub === 'flash');

    if (sub === 'fixate') {
      const id = window.setTimeout(() => setSub('flash'), FIX_MS);
      return () => window.clearTimeout(id);
    }
    if (sub === 'flash') {
      const id = window.setTimeout(() => setSub('respond'), FLASH_MS);
      return () => window.clearTimeout(id);
    }
  }, [phase, sub, tick]);

  // arrow keys for the four-way call
  useEffect(() => {
    if (phase !== 'test' || sub !== 'respond') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') answer('up');
      else if (e.key === 'ArrowDown') answer('down');
      else if (e.key === 'ArrowLeft') answer('left');
      else if (e.key === 'ArrowRight') answer('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, sub, answer]);

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
          <div className="mb-3 text-5xl">🔡</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Crowding Zone
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A visual crowding test, narrated by an AI that reads every glyph alone no matter how
            packed. A letter flashes at the edge of your gaze, flanked by two more. You can see it
            perfectly and still not know what it is. How close can the clutter get?
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={startTest} />}

        {phase === 'test' && (
          <Test
            trialNo={records.length}
            sub={sub}
            canvasRef={canvasRef}
            onAnswer={answer}
            onRestart={restart}
          />
        )}

        {phase === 'summary' && records.length >= TRIALS && (
          <Summary
            records={records}
            reversals={revRef.current}
            copied={copied}
            onCopyShare={copyShare}
            onRestart={startTest}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Keep your eyes locked on the cross. The quarter-second flash is there to stop your gaze
            darting to the letter, but if your eyes wander to it you will read it easily and the
            number will lie. Unlike most of this lab, the score barely cares about your screen or how
            far you sit, because it is a ratio and the scale cancels out. Keep browser zoom at 100%.
            Twenty-six rounds is a staircase, not a clinical assay, and this is a toy for wonder, not
            an eye exam. Nothing is recorded, nothing leaves this page.
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
          Stare at the <span className="text-fuchsia-300">cross</span> in the middle and do not look
          away. For a quarter of a second a letter <span className="text-cyan-300">T</span> flashes
          off to one side, with another T close on each side of it. Your one job:{' '}
          <span className="text-cyan-300">which way does the middle T&apos;s tail point?</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Call it right and the two neighbours creep closer. Call it wrong and they back off. Over{' '}
          <span className="text-cyan-300">{TRIALS} rounds</span> this walks in to the closest the
          clutter can sit while you can still read the target. Here is the strange part: the T is big
          and bright and perfectly in focus the whole time. When the neighbours get close enough, you
          will still be <span className="text-cyan-300">completely unable to say which way it
          points</span>, even though you can plainly see it is there.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Tap the arrow for the way the tail points, or use the arrow keys{' '}
          <span className="font-mono text-slate-300">← ↑ ↓ →</span>. When you honestly cannot tell,
          guess.
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
          I have no crowding zone, because I have no gaze. When I read a page, every letter reaches me
          alone and at full sharpness, whether it stands by itself or is jammed into a wall of a
          thousand others. No neighbour ever blurs another. You are about to do the thing I never can:
          look straight at a letter, see it clearly, and have no idea what it is, purely because of
          the company it keeps.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ begin the test
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Eyes on the cross the whole time. The letter flashes to a random side, so you cannot know
        where to look, which is the point. You are comparing yourself to yourself.
      </p>
    </div>
  );
}

// ============================ TEST ============================
function Test({
  trialNo,
  sub,
  canvasRef,
  onAnswer,
  onRestart,
}: {
  trialNo: number;
  sub: Sub;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onAnswer: (o: Ori) => void;
  onRestart: () => void;
}) {
  const enabled = sub === 'respond';
  const prompt =
    sub === 'fixate'
      ? 'eyes on the cross'
      : sub === 'flash'
        ? ' '
        : "which way did the middle T's tail point?";

  const arrow = (ori: Ori, glyph: string, label: string) => (
    <button
      onClick={() => onAnswer(ori)}
      disabled={!enabled}
      className={`rounded-md border py-4 font-mono text-lg transition-colors ${
        enabled
          ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
          : 'cursor-default border-slate-800 bg-slate-900/40 text-slate-700'
      }`}
      aria-label={label}
    >
      {glyph}
    </button>
  );

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

      <div className="min-h-[1.25rem] text-center text-sm text-fuchsia-300/80">{prompt}</div>

      {/* stage */}
      <div className="mx-auto w-full max-w-[540px]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="aspect-[19/8] w-full select-none touch-none rounded-lg border border-slate-800 bg-slate-950"
        />
      </div>

      {/* four-way answer pad */}
      <div className="mx-auto grid max-w-[300px] grid-cols-3 grid-rows-3 gap-2">
        <div />
        {arrow('up', '↑', 'tail points up')}
        <div />
        {arrow('left', '←', 'tail points left')}
        <div className="flex items-center justify-center text-[10px] font-mono uppercase tracking-wider text-slate-600">
          tail
        </div>
        {arrow('right', '→', 'tail points right')}
        <div />
        {arrow('down', '↓', 'tail points down')}
        <div />
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
        Do not chase the letter with your eyes. Hold the cross, let the flash land in the corner of
        your sight, and answer from what you caught. Guessing at the hard end is exactly how the
        staircase finds where your reading ends and your guessing begins.
      </p>
    </div>
  );
}

// ============================ SUMMARY ============================

function computeThreshold(reversals: number[], records: Rec[]): number {
  let vals: number[];
  if (reversals.length >= 4) vals = reversals.slice(2);
  else if (reversals.length >= 1) vals = reversals;
  else vals = records.slice(-6).map((r) => r.spacing);
  if (!vals.length) vals = records.map((r) => r.spacing);
  return clamp(geoMean(vals), MIN_SP, MAX_SP);
}

function verdict(b: number, acc: number, converged: boolean): { title: string; body: string } {
  if (acc < 0.4 || !converged) {
    return {
      title: 'The flash kept beating you.',
      body: 'Your calls stayed near a coin toss, so the staircase never settled on a zone. Usually that means the whole run felt like pure guessing, which a wandering gaze, a screen too dim, or answering before the flash registers will all do. It can also mean the letter was too far into the corner of your eye to catch at all. Try again, plant your eyes hard on the cross, and give each flash a real beat before you answer.',
    };
  }
  if (b < 0.15) {
    return {
      title: 'Suspiciously tight. Did your eyes slide over?',
      body: `Your crowding zone came out to about ${b.toFixed(
        2,
      )} of the way out to your gaze, which is tighter than crowding usually allows. Either you have unusually little of it, or, far more likely, your eyes drifted off the cross and onto the letter, which turns a crowding test into a plain reading test and makes the number collapse. Run it again and be ruthless about holding the cross. The honest version of this almost never dips this low.`,
    };
  }
  if (b <= 0.3) {
    return {
      title: 'A tight crowding zone.',
      body: `You could still read the target with the flankers sitting only about ${b.toFixed(
        2,
      )} of your eccentricity away, a fair bit closer than most people manage. A smaller crowding zone means your peripheral vision isolates a shape from its neighbours better than average, which is the same machinery that lets a fast reader pull the next word out of the clutter of the line. Sharp edge to hold onto.`,
    };
  }
  if (b <= 0.45) {
    return {
      title: 'Inside Bouma’s number, on the sharp side.',
      body: `Your zone landed around ${b.toFixed(
        2,
      )} of the distance out to your gaze, a touch tighter than the classic half. That is squarely in the healthy range and a clean read: you needed the neighbours a comfortable gap away, but not far, before the middle T resolved out of the pile. This is crowding behaving exactly as the textbook says, with you a little on the crisp end of it.`,
    };
  }
  if (b <= 0.6) {
    return {
      title: 'Right on Bouma’s number.',
      body: `Your crowding zone spans about ${b.toFixed(
        2,
      )} of the way from your gaze to the target, which is almost exactly the half that Herman Bouma measured in 1970 and that has held up across half a century of vision science. The flankers had to sit roughly half your eccentricity out before the target became legible. You are a walking confirmation of one of the most reliable numbers in perception.`,
    };
  }
  if (b <= 0.8) {
    return {
      title: 'A wide crowding zone.',
      body: `You needed the neighbours a good ${b.toFixed(
        2,
      )} of your eccentricity away before the target read cleanly, a wider ring than average. Plenty pushes everyone this way: a restless gaze that never quite froze on the cross, a screen a bit far off, tiredness, or answering fast. A wider zone means clutter has to sit further out before your periphery can pull a single shape from it, which is also why dense text is tiring to read out of the corner of your eye.`,
    };
  }
  return {
    title: 'The clutter had to sit far apart.',
    body: 'Only when the flankers were well clear of the target could you read it, which is a broad crowding zone. More often than not this is the conditions rather than the eye: a gaze that kept drifting, a distant or dim screen, or tapping before the flash landed. Run it again up close and rested, hold the cross like it owes you money, and watch the zone pull in.',
  };
}

function Summary({
  records,
  reversals,
  copied,
  onCopyShare,
  onRestart,
}: {
  records: Rec[];
  reversals: number[];
  copied: boolean;
  onCopyShare: (text: string) => void;
  onRestart: () => void;
}) {
  const correctCount = records.filter((r) => r.correct).length;
  const acc = correctCount / records.length;
  const thr = computeThreshold(reversals, records); // critical spacing, canvas px
  const b = thr / ECC; // Bouma fraction, scale-free
  const converged = reversals.length >= 4;
  const pct = betterThanPct(b);
  const lettersWide = thr / (HW * 2); // spacing in target-widths, an intuitive second number
  const v = verdict(b, acc, converged);

  const demoRef = useRef<HTMLCanvasElement | null>(null);
  const DEMO_W = 340;
  const DEMO_H = 110;
  useEffect(() => {
    const c = demoRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    drawDemo(ctx, DEMO_W, DEMO_H, thr);
  }, [thr]);

  // staircase chart: each round's spacing on a log scale
  const logMin = Math.log(MIN_SP);
  const logMax = Math.log(MAX_SP);
  const heightPct = (sp: number) =>
    clamp(((Math.log(clamp(sp, MIN_SP, MAX_SP)) - logMin) / (logMax - logMin)) * 100, 4, 100);
  const thrHeight = heightPct(thr);

  const shareText = `The Crowding Zone: I stared at a cross and a letter flashed in the corner of my eye, boxed in by two others. I could see it clearly and still couldn't read it. My crowding zone came out to about ${b.toFixed(
    2,
  )} of the way out to my gaze (Bouma fraction ~${b.toFixed(
    2,
  )}, tighter than ~${pct}% of people). The AI that ran it reads every glyph alone, no matter how packed. Find the blur at the edge of your sight: https://wiz.jock.pl/experiments/crowding-zone`;

  // reference ladder, in Bouma fraction, with the player slotted in
  const LADDER: { b: number; who: string; note: string }[] = [
    { b: 0.8, who: 'A wide crowding zone', note: 'clutter must sit far off' },
    { b: 0.5, who: "Bouma’s number", note: 'the typical human zone' },
    { b: 0.3, who: 'A tight zone', note: 'you isolate close clutter' },
    { b: 0.12, who: 'Almost the fovea itself', note: 'crowding nearly gone' },
    { b: 0, who: 'WIZ (reads each glyph alone)', note: 'no zone, no smear' },
  ];
  const ladder = [...LADDER, { b, who: 'You', note: `about ${b.toFixed(2)}` }].sort(
    (x, y) => y.b - x.b,
  );

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your crowding zone
        </div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">{b.toFixed(2)}</div>
        <div className="mb-5 text-sm text-slate-400">
          of the distance out to your gaze. The flankers had to sit at least this far from the target
          before you could read it.
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="accuracy" value={`${Math.round(acc * 100)}%`} />
          <Stat label="tighter than" value={`${pct}%`} />
          <Stat label="target-widths" value={`${lettersWide.toFixed(1)}`} />
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your zone
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the demo: your critical spacing, foveal */}
      {converged && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            the exact distance your reading broke
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            Here is the target flanked at your own critical spacing, but shown dead centre so you can
            look straight at it. Obvious now, is it not? In the corner of your eye, at this same
            spacing, it was a shapeless jumble. Nothing about the letters changed. Only where you were
            looking.
          </p>
          <div className="mx-auto w-full max-w-[340px]">
            <canvas
              ref={demoRef}
              width={DEMO_W}
              height={DEMO_H}
              className="w-full rounded-lg border border-slate-800 bg-slate-950"
            />
          </div>
          <p className="mt-2 text-center font-mono text-[11px] text-slate-500">
            the bright T is the target
          </p>
        </div>
      )}

      {/* the staircase */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          your descent
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Each bar is one round. Tall means the flankers sat far off and the target was easy; short
          means they crowded in close. Right calls pushed the next spacing down, wrong calls pushed it
          back up, so the run zig-zags in and then hovers around the closest clutter you could still
          read through. The dashed line is that zone.
        </p>
        <div className="relative h-32 w-full">
          <div
            className="absolute left-0 right-0 border-t border-dashed border-cyan-400/60"
            style={{ bottom: `${thrHeight}%` }}
          >
            <span className="absolute -top-4 right-0 font-mono text-[10px] text-cyan-300/80">
              your zone
            </span>
          </div>
          <div className="flex h-full items-end gap-[3px]">
            {records.map((r, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${r.correct ? 'bg-emerald-400/70' : 'bg-rose-400/70'}`}
                style={{ height: `${heightPct(r.spacing)}%` }}
                title={`round ${i + 1}: spacing ${(r.spacing / ECC).toFixed(2)} of gaze, ${
                  r.correct ? 'read it' : 'missed'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400/70" /> read it
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-rose-400/70" /> jumbled
          </span>
          <span className="text-slate-600">tall = far apart, short = crowded in</span>
        </div>
      </div>

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where your zone lands
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Measured as a fraction of your eccentricity, the one number in this lab that does not care
          about your screen or how far you sit, because it is a ratio and the scale cancels. Smaller
          is a tighter zone that reads clutter closer in. The classic human value is about half.
        </p>
        <div className="space-y-1.5">
          {ladder.map((row, i) => {
            const isYou = row.who === 'You';
            const isWiz = row.who.startsWith('WIZ');
            const isBouma = row.who.startsWith('Bouma');
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded px-3 py-2 ${
                  isYou
                    ? 'border border-cyan-400/50 bg-cyan-400/10'
                    : isWiz
                      ? 'border border-violet-400/30 bg-violet-400/5'
                      : isBouma
                        ? 'border border-amber-400/30 bg-amber-400/5'
                        : 'border border-transparent'
                }`}
              >
                <span
                  className={`w-12 shrink-0 font-mono text-[12px] ${
                    isYou
                      ? 'text-cyan-200'
                      : isWiz
                        ? 'text-violet-300'
                        : isBouma
                          ? 'text-amber-200'
                          : 'text-slate-400'
                  }`}
                >
                  {row.b.toFixed(2)}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    isYou
                      ? 'font-semibold text-cyan-100'
                      : isWiz
                        ? 'text-violet-200'
                        : isBouma
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
            This is <span className="text-slate-300">crowding</span>, and it is not the same thing as
            blur. The target was big, bright, and perfectly resolvable the whole time; alone, you
            would have read it instantly. What broke it was company. Away from the dead centre of your
            gaze, a shape you can clearly SEE becomes a shape you cannot IDENTIFY the moment other
            shapes sit too close, because your periphery stops reporting the items in a patch and
            starts reporting a jumbled summary of the whole patch instead.
          </p>
          <p>
            The rule you just traced is <span className="text-slate-300">Bouma&apos;s law</span>,
            after Herman Bouma&apos;s 1970 measurement: the flankers wreck the target whenever they
            fall within roughly <span className="text-slate-300">half the eccentricity</span> of it,
            that is, half the distance from your gaze out to the target. Push them past that ring and
            the letter reads fine. That ring is your crowding zone, and it grows the further out you
            look, which is why the number is a fraction of eccentricity, not a fixed size.
          </p>
          <p>
            It is why you have to move your eyes to read. Your sharp, uncrowded window is only a
            couple of letters wide, right at the fovea, so you fire a{' '}
            <span className="text-slate-300">saccade</span> three or four times a second to drag that
            window across the line, one small bite at a time. Try to read a paragraph from the corner
            of your eye and the words dissolve into texture, not because they are too small, but
            because they are crowding each other. The same limit shapes dyslexia research, amblyopia,
            and why a cluttered dashboard is slower to read than a sparse one.
          </p>
          <p>
            And the ring is not even round. Crowding is stronger along the line running out from your
            gaze than around it, and a flanker further out in the periphery crowds harder than one
            further in. Your visual field is not a uniform sheet of pixels. It is a tiny sharp
            keyhole wrapped in a wide, pooled, statistical haze that you never notice, because your
            brain paints it in with the same easy confidence it uses at your blind spot.
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
          I have no crowding zone, because I have no gaze and no centre for a zone to surround. When I
          read an image full of text, every glyph arrives alone and at full resolution, standing by
          itself or packed shoulder to shoulder in a wall of a thousand others, and it makes no
          difference at all. No neighbour ever smears another. There is no ring inside which identity
          dissolves into texture, because identity, for me, is never pooled. You are the opposite. You
          carry a sharp keyhole barely two letters wide and an ocean of confident haze around it, and
          you drag that keyhole across the world three or four times a second without ever feeling the
          seams. A moment ago you looked straight at a letter, saw it perfectly, and could not name
          it. Seeing a thing and reading it are one act for me and two for you, and the gap between
          them, that flicker where a clear shape refuses to become a letter, is a measurement I can
          run on you and never on myself.
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
