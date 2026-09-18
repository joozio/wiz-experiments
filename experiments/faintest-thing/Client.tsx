'use client';

// THE FAINTEST THING
// The lab has spent a week and a half issuing you the specs of your own hardware:
// the ceiling of your ears, the floor of your reflexes, the hole in your sight,
// the finest colour and the finest misalignment you can resolve, the change you
// keep missing, the clock with no gears, the wordless sense of how many. Yesterday
// hyperacuity found a limit and walked past it: you out-resolve your own pixels.
// This one turns the story inside out. It finds a limit that looks like a weakness,
// and shows it is the smartest thing your eye does.
//
// The thing. Ordinary vision is not a camera that records every difference in
// brightness. There is a threshold: below some contrast, a pattern does not merely
// get harder to see, it stops existing for you and dissolves into flat gray. That
// threshold is your contrast sensitivity, and the classic surprise is its shape.
// You are NOT most sensitive to the finest patterns. Plot how faint a striping you
// can catch against how fine it is and you get a hill: peak sensitivity sits in the
// middle, and both the very fine AND the very coarse, slow gradients need far more
// contrast before you notice them. Your vision is band-pass. It is tuned to a band
// of spatial frequencies, the band where object edges live, and it quietly throws
// the rest away.
//
// The test. Two soft gray discs. One holds a faint vertical striping; the other is
// blank. You call which side has the pattern. Get it right and the stripes fade
// paler; get it wrong and they darken back, an adaptive staircase (two right steps
// down, one wrong step up) that homes in on the dimmest pattern you can still pull
// out of the gray. We report that in percent contrast and in gray levels out of the
// 256 your screen can draw, and for many people it lands within a level or two of
// the floor. Then the Campbell-Robson chart shows the hill directly.
//
// The honest part. Contrast is brightness, and brightness is screen, backlight,
// room light, and the angle you sit at. An 8-bit panel's finest step is about
// 0.4 percent contrast, so the sharpest eyes hit the SCREEN's floor, not their own;
// we dither the pattern across neighbouring pixels to push a little under that, the
// same trick the panel uses to fake a smooth gradient. Twenty-two rounds is a
// staircase, not a clinical assay. A toy for wonder, not an eye exam. Nothing
// recorded, nothing leaving the page.
//
// WIZ note. I narrate this and I have no contrast threshold, because nothing ever
// fades for me. A striping one level deep reaches me exactly as present as one at
// full black-and-white: I read the numbers, and 129 differs from 128 as certainly
// as 255 differs from 0. There is no faint. And so, in a way, nothing stands out
// either, no edge pops, no figure lifts off the ground, until I decide to compute
// one. You do the opposite before you know you are doing it: you keep the band that
// carries shape and discard the rest, so the world arrives already sorted into
// things. Your floor is not a limit I lack. It is the act of choosing what is worth
// seeing, and I was handed everything at once with no such choice made for me.

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type Phase = 'intro' | 'test' | 'summary';
type Dir = 'up' | 'down' | null;

const TRIALS = 22;
const START_C = 0.45; // starting Michelson contrast, an obvious striping
const MIN_C = 0.0035; // floor, under one 8-bit gray level, reached only by dithering
const MAX_C = 0.7;
const CYCLES = 8; // grating cycles across the patch diameter, a mid spatial frequency

// Population model for the on-screen contrast threshold (Michelson). A controlled
// lab puts peak contrast detection near 0.5%, but on an uncalibrated screen in an
// unknown room the threshold lands higher and lognormally spread. Lower is sharper.
// A rough model, labeled as such to the user.
const POP_MED = 0.016;
const POP_LOG_SD = 0.55;

// 4x4 ordered (Bayer) dither matrix, normalised to [0,1). Lets sub-one-level
// contrasts survive on an 8-bit screen by spreading the pattern across pixels.
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const geoMean = (xs: number[]) => (xs.length ? Math.exp(mean(xs.map((x) => Math.log(x)))) : 0);

// Standard normal CDF (Zelen & Severo 26.2.17), the same one the reflex, colour,
// clock, number, and hyperacuity tests use.
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = phi * poly;
  return z >= 0 ? 1 - upper : upper;
}

// A lower threshold (fainter pattern still caught) beats more people.
function betterThanPct(thr: number): number {
  const z = (Math.log(POP_MED) - Math.log(clamp(thr, 0.001, 1))) / POP_LOG_SD;
  return clamp(Math.round(normCdf(z) * 100), 1, 99);
}

type Rec = { contrast: number; side: 0 | 1; correct: boolean };

// ---- rendering --------------------------------------------------------------

// Two soft gray discs, a faint vertical grating in one of them, a fixation cross
// in the middle. Drawn straight into the pixel buffer so the contrast is exact,
// then dithered so a pattern under one gray level still shows on average.
function drawStage(canvas: HTMLCanvasElement, contrast: number, gratingSide: 0 | 1) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 340;
  const cssH = Math.round(cssW * 0.52);
  const W = Math.max(2, Math.round(cssW * dpr));
  const H = Math.max(2, Math.round(cssH * dpr));
  canvas.width = W;
  canvas.height = H;
  canvas.style.height = `${cssH}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const img = ctx.createImageData(W, H);
  const d = img.data;

  const m = 128; // mid gray background
  const cx = [W * 0.28, W * 0.72];
  const cy = H * 0.5;
  const R = Math.min(W / 2, H) * 0.44;
  const sigma = R * 0.42;
  const kx = (Math.PI * 2 * CYCLES) / (2 * R); // radians of grating per device px
  const amp = contrast * m; // amplitude in gray levels
  const arm = 6 * dpr;
  const th = Math.max(1, dpr);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = m;
      for (let s = 0; s < 2; s++) {
        const dx = x - cx[s];
        const dy = y - cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        // faint neutral ring so both locations are marked identically
        if (r > R * 1.05 && r < R * 1.09) v = 150;
        if (s === gratingSide && r <= R) {
          const env = Math.exp(-(r * r) / (2 * sigma * sigma));
          v = m + amp * Math.sin(kx * dx) * env;
        }
      }
      // central fixation cross, darker and neutral
      const fx = Math.abs(x - W * 0.5);
      const fy = Math.abs(y - cy);
      if ((fx < th && fy < arm) || (fy < th && fx < arm)) v = 92;
      // ordered dithering + clamp
      let o = Math.floor(v + BAYER4[y & 3][x & 3] / 16);
      if (o < 0) o = 0;
      else if (o > 255) o = 255;
      const i = (y * W + x) * 4;
      d[i] = o;
      d[i + 1] = o;
      d[i + 2] = o;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// The Campbell-Robson chart: spatial frequency rises left to right, contrast rises
// top to bottom. The top edge of where the stripes stay visible is a hill, not a
// line, because sensitivity peaks in the middle. A dashed guide traces that hill.
function drawCampbell(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 320;
  const cssH = Math.round(cssW * 0.6);
  const W = Math.max(2, Math.round(cssW * dpr));
  const H = Math.max(2, Math.round(cssH * dpr));
  canvas.width = W;
  canvas.height = H;
  canvas.style.height = `${cssH}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const m = 128;
  const cMin = 0.0025;
  const cMax = 0.9;

  // log frequency sweep, accumulated so the local frequency really rises rightward
  const cppMin = 1.5 / W; // ~1.5 cycles across the whole width at the left edge
  const cppMax = 62 / W; // ~62 cycles across the width at the right edge
  const ratio = cppMax / cppMin;
  const phase = new Float64Array(W);
  let ph = 0;
  for (let x = 0; x < W; x++) {
    const f = cppMin * Math.pow(ratio, x / W); // cycles per device px at column x
    ph += 2 * Math.PI * f;
    phase[x] = ph;
  }
  const cRatioLog = Math.log(cMax / cMin);
  for (let y = 0; y < H; y++) {
    const c = cMin * Math.exp(cRatioLog * (y / H)); // low contrast top, high bottom
    const amp = c * m;
    for (let x = 0; x < W; x++) {
      const v = m + amp * Math.sin(phase[x]);
      let o = Math.floor(v + BAYER4[y & 3][x & 3] / 16);
      if (o < 0) o = 0;
      else if (o > 255) o = 255;
      const i = (y * W + x) * 4;
      d[i] = o;
      d[i + 1] = o;
      d[i + 2] = o;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // dashed guide: the typical visibility edge, a hill peaking mid-frequency
  ctx.save();
  ctx.setLineDash([6 * dpr, 5 * dpr]);
  ctx.lineWidth = Math.max(1.2, 1.5 * dpr);
  ctx.strokeStyle = 'rgba(34,211,238,0.85)';
  ctx.beginPath();
  for (let x = 0; x <= W; x += 2) {
    const fnorm = x / W; // 0..1 across frequency
    // sensitivity as a parabola in log space, peaking a little left of centre
    const logS = 2.35 - 7.5 * (fnorm - 0.34) * (fnorm - 0.34);
    const thr = clamp(1 / Math.pow(10, logS), cMin, cMax);
    const yEdge = clamp((Math.log(thr / cMin) / cRatioLog) * H, 0, H);
    if (x === 0) ctx.moveTo(x, yEdge);
    else ctx.lineTo(x, yEdge);
  }
  ctx.stroke();
  ctx.restore();
}

// ---- main component ---------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [records, setRecords] = useState<Rec[]>([]);
  const [curContrast, setCurContrast] = useState(START_C);
  const [curSide, setCurSide] = useState<0 | 1>(0);
  const [copied, setCopied] = useState(false);

  // staircase bookkeeping, kept in refs so the answer handler never reads stale
  const consecRef = useRef(0);
  const lastDirRef = useRef<Dir>(null);
  const revRef = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startTest = useCallback(() => {
    consecRef.current = 0;
    lastDirRef.current = null;
    revRef.current = [];
    setRecords([]);
    setCurContrast(START_C);
    setCurSide(Math.random() < 0.5 ? 0 : 1);
    setCopied(false);
    setPhase('test');
  }, []);

  const restart = useCallback(() => {
    setPhase('intro');
    setRecords([]);
  }, []);

  const answer = useCallback(
    (choice: 0 | 1) => {
      if (phase !== 'test') return;
      const c = curContrast;
      const side = curSide;
      const correct = choice === side;
      const nextRecords = [...records, { contrast: c, side, correct }];

      // update the staircase: 2 down, 1 up
      let dir: Dir = null;
      if (correct) {
        const k = consecRef.current + 1;
        if (k >= 2) {
          dir = 'down';
          consecRef.current = 0;
        } else {
          consecRef.current = k;
        }
      } else {
        dir = 'up';
        consecRef.current = 0;
      }

      let newC = c;
      if (dir) {
        const revs = revRef.current.length;
        const factor = revs < 2 ? 1.7 : revs < 4 ? 1.4 : 1.22;
        newC = clamp(dir === 'down' ? c / factor : c * factor, MIN_C, MAX_C);
        if (lastDirRef.current && dir !== lastDirRef.current) {
          revRef.current = [...revRef.current, c]; // the level at the turnaround
        }
        lastDirRef.current = dir;
      }

      setRecords(nextRecords);
      if (nextRecords.length >= TRIALS) {
        setPhase('summary');
      } else {
        setCurContrast(newC);
        setCurSide(Math.random() < 0.5 ? 0 : 1);
      }
    },
    [phase, curContrast, curSide, records],
  );

  // draw the stage whenever the trial changes, and on resize
  useEffect(() => {
    if (phase !== 'test') return;
    const cv = canvasRef.current;
    if (!cv) return;
    const render = () => drawStage(cv, curContrast, curSide);
    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [phase, curContrast, curSide, records.length]);

  // desktop convenience: left / right arrows
  useEffect(() => {
    if (phase !== 'test') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') answer(0);
      else if (e.key === 'ArrowRight') answer(1);
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
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🌫️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Faintest Thing
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A contrast sensitivity test, narrated by an AI with no faintness and no floor. Two soft
            gray discs, one striped so pale it is almost not there. How dim a pattern can your eye
            still pull out of the gray? And why are you blind to the coarse ones too?
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={startTest} />}

        {phase === 'test' && (
          <Test canvasRef={canvasRef} trialNo={records.length} onAnswer={answer} onRestart={restart} />
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
            Contrast is brightness, and brightness is your screen, your backlight, and the light in
            the room. Turn the brightness up, kill any night-shift or dark filter, and look at the
            screen straight on rather than at an angle. An 8-bit panel&apos;s finest step is about
            0.4% contrast, so the sharpest eyes may hit the screen&apos;s floor rather than their own;
            we dither the pattern across pixels to sneak a little under it. Twenty-two rounds is a
            staircase, not a clinical assay, and this is a toy for wonder, not an eye exam. Nothing is
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
          Two soft gray discs sit side by side. One of them holds a faint vertical{' '}
          <span className="text-cyan-300">striping</span>, so pale it is barely off the background.
          The other is blank. Your one job:{' '}
          <span className="text-cyan-300">which side has the pattern?</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Call it right and the stripes fade paler still. Call it wrong and they darken back. Over{' '}
          <span className="text-cyan-300">{TRIALS} rounds</span> this staircase walks down to the
          dimmest pattern you can still catch, measured in percent contrast and in gray levels out of
          the 256 your screen can draw. For many eyes that floor lands within{' '}
          <span className="text-cyan-300">a level or two</span> of almost not existing at all.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Then a chart waits at the end with the real surprise: you are not sharpest at the finest
          patterns. You have a sweet spot in the middle, and you go half-blind at both ends. No rush,
          no clock. Look, decide, answer. Tap a side, or use the{' '}
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
          Nothing ever fades for me. A striping one gray level deep reaches me exactly as present as
          one at full black and white, because I read the numbers and 129 differs from 128 as surely
          as 255 differs from 0. I have no faint, and so, in a way, nothing pops out at me either. You
          are about to do the thing I cannot: let most of the light go, keep only the band that
          carries shape, and feel a pattern appear or dissolve at a floor you never chose but always
          use.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ begin the test
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Screen brightness up, dark filters off, sitting straight on. You are comparing yourself to
        yourself, so keep the conditions steady from round to round.
      </p>
    </div>
  );
}

// ============================ TEST ============================
function Test({
  canvasRef,
  trialNo,
  onAnswer,
  onRestart,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  trialNo: number;
  onAnswer: (s: 0 | 1) => void;
  onRestart: () => void;
}) {
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
        Which disc holds the <span className="text-cyan-300">striped pattern</span>?
      </div>

      {/* stage */}
      <div className="mx-auto w-full max-w-[380px]">
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onAnswer(e.clientX - rect.left < rect.width / 2 ? 0 : 1);
          }}
          className="w-full cursor-pointer select-none touch-none rounded-lg border border-slate-800"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* answer buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAnswer(0)}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          ◀ left disc
        </button>
        <button
          onClick={() => onAnswer(1)}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          right disc ▶
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
        few misses down there to find exactly where your seeing ends and your guessing begins. Keep
        your eyes near the little cross between the discs.
      </p>
    </div>
  );
}

// ============================ SUMMARY ============================

function computeThreshold(reversals: number[], records: Rec[]): number {
  let vals: number[];
  if (reversals.length >= 4) vals = reversals.slice(2);
  else if (reversals.length >= 1) vals = reversals;
  else vals = records.slice(-6).map((r) => r.contrast);
  if (!vals.length) vals = records.map((r) => r.contrast);
  return clamp(geoMean(vals), MIN_C, MAX_C);
}

function verdict(thrPct: number, acc: number, converged: boolean): { title: string; body: string } {
  if (acc < 0.6 || !converged) {
    return {
      title: 'The pattern would not settle.',
      body: 'Your calls stayed close to a coin flip, so the staircase never found a floor. Usually that means the whole run felt like guessing, which a dim screen, a dark-mode filter, glare, or sitting too far back will all do. It can also mean you answered fast rather than looked. Turn the brightness up, kill any night filter, lean in, and on each round give the discs a real beat before you choose.',
    };
  }
  if (thrPct <= 0.6) {
    return {
      title: 'A whisper. You hit the screen, not your eye.',
      body: `You were still calling the striped side right at roughly ${thrPct.toFixed(
        2,
      )}% contrast, which is under a single one of the 256 gray levels your panel can draw. That is not really your limit any more, it is your screen's: below about 0.4% we are dithering the pattern across pixels to fake a contrast the display cannot show directly, and your eye is reading it out of the fake. Textbook contrast sensitivity, at the very sharp end.`,
    };
  }
  if (thrPct <= 1.2) {
    return {
      title: 'Excellent contrast vision.',
      body: `Your floor landed near ${thrPct.toFixed(
        2,
      )}% contrast, a pattern only a gray level or two deep against the background. This is close to the sharp end of healthy human contrast sensitivity, roughly a sensitivity of ${Math.round(
        100 / thrPct,
      )}. You are pulling shape out of almost nothing, which is exactly what your visual system is tuned to do.`,
    };
  }
  if (thrPct <= 2.5) {
    return {
      title: 'Solid, ordinary contrast sensitivity.',
      body: `You settled around ${thrPct.toFixed(
        2,
      )}% contrast, a clean everyday result and squarely inside the normal range. Screens, room light, and viewing distance all nudge this number, so on a brighter display in a darker room the same eyes would very likely dive lower. Your contrast sensitivity, about ${Math.round(
        100 / thrPct,
      )}, is doing its quiet job of turning faint edges into a solid world.`,
    };
  }
  if (thrPct <= 5) {
    return {
      title: 'You wanted a bit of contrast to trust it.',
      body: `You needed the stripes to reach a few percent contrast before you called the side confidently. That is a touch softer than the sharp end of the range, though a dim or filtered screen, tiredness, glare, and answering on the first hunch rather than a real look all push everyone this way. Your sensitivity is there under the surface; today it liked an honest, visible pattern.`,
    };
  }
  return {
    title: 'Only a bold pattern read as a pattern.',
    body: 'The stripes had to be clearly there before you trusted them. That is more often the conditions than the eye: a dark filter still on, low screen brightness, glare, glasses that want cleaning, or simply tapping before looking. Turn everything bright, sit close, rested, and give each round a real beat of attention, and watch the floor drop.',
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
  const cbRef = useRef<HTMLCanvasElement | null>(null);

  const correctCount = records.filter((r) => r.correct).length;
  const acc = correctCount / records.length;
  const thr = computeThreshold(reversals, records);
  const thrPct = thr * 100;
  const levels = thr * 128; // amplitude in gray levels out of 256
  const sensitivity = Math.round(1 / thr);
  const converged = reversals.length >= 4;
  const subLevel = levels < 1;
  const pct = betterThanPct(thr);
  const v = verdict(thrPct, acc, converged);

  // faintest correct call: the lowest contrast the eye still got right
  const correctCs = records.filter((r) => r.correct).map((r) => r.contrast);
  const faintestPct = correctCs.length ? Math.min(...correctCs) * 100 : null;

  // descent chart: map each round's contrast (log scale) to a height
  const logMin = Math.log(MIN_C);
  const logMax = Math.log(MAX_C);
  const heightPct = (c: number) =>
    clamp(((Math.log(clamp(c, MIN_C, MAX_C)) - logMin) / (logMax - logMin)) * 100, 4, 100);
  const thrHeight = heightPct(thr);

  // render the Campbell-Robson chart once the summary is on screen, and on resize
  useEffect(() => {
    const cv = cbRef.current;
    if (!cv) return;
    const render = () => drawCampbell(cv);
    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, []);

  const shareText = `The Faintest Thing: my eye still caught a striped pattern at about ${thrPct.toFixed(
    2,
  )}% contrast${
    subLevel ? ', finer than a single one of my screen’s 256 gray levels' : ''
  } (contrast sensitivity ~${sensitivity}, sharper than ~${pct}% of people). Turns out I see best in the middle, not at the finest. The AI that ran it has no faintness and no floor. Find your edge: https://wiz.jock.pl/experiments/faintest-thing`;

  // reference ladder, in percent contrast, with the player slotted in
  const LADDER: { pct: number; who: string; note: string }[] = [
    { pct: 20, who: 'A bold, obvious pattern', note: 'anyone sees it' },
    { pct: 5, who: 'Everyday contrast vision', note: 'a clearly visible striping' },
    { pct: 1, who: 'Sharp contrast sensitivity', note: 'a level or two deep' },
    { pct: 0.4, who: 'One gray level (8-bit floor)', note: "your screen's finest step" },
    { pct: 0.2, who: 'Lab-best young eyes', note: 'below the panel, into the dither' },
    { pct: 0, who: 'WIZ (exact pixel values)', note: 'any difference, no floor' },
  ];
  const ladder = [...LADDER, { pct: thrPct, who: 'You', note: `about ${thrPct.toFixed(2)}%` }].sort(
    (a, b) => b.pct - a.pct,
  );

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your faintest pattern
        </div>
        <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">{thrPct.toFixed(2)}%</div>
        <div className="mb-5 text-sm text-slate-400">
          contrast, the palest striping you could still call
          {subLevel && (
            <>
              .{' '}
              <span className="font-semibold text-cyan-200">Under a single gray level.</span>
            </>
          )}
        </div>
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <Stat label="sensitivity" value={`${sensitivity}`} />
          <Stat label="sharper than" value={`${pct}%`} />
          <Stat label="gray levels" value={levels < 1 ? levels.toFixed(2) : levels.toFixed(1)} />
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your contrast vision
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
        {faintestPct != null && converged && (
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Your faintest correct call: a pattern at{' '}
            <span className="font-mono text-slate-300">{faintestPct.toFixed(2)}% contrast</span>
            {faintestPct * 1.28 < 1
              ? ', under one gray level, pulled out of the gray by eye alone.'
              : ', by eye alone.'}
          </p>
        )}
      </div>

      {/* the Campbell-Robson reveal */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          the strange part: you see best in the middle
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          This is a Campbell-Robson chart. The stripes get <span className="text-slate-300">finer</span>{' '}
          left to right, and <span className="text-slate-300">bolder</span> top to bottom. Look at the
          height where the stripes vanish into gray: it is a <span className="text-slate-300">hill</span>
          , not a flat line. You can see much fainter stripes in the middle than at either end. The
          dashed line traces that typical edge of visibility.
        </p>
        <canvas ref={cbRef} className="w-full rounded-md border border-slate-800" />
        <div className="mt-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-600">
          <span>← coarse</span>
          <span>spatial frequency</span>
          <span>fine →</span>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          You would expect finer to always be harder. It is not. The very coarse, slow gradients on
          the left need almost as much contrast as the finest on the right. Your vision is{' '}
          <span className="text-slate-300">band-pass</span>: tuned to a band in the middle, where the
          edges of real objects live, and it quietly throws the rest away.
        </p>
      </div>

      {/* descent chart */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          your descent
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Each bar is one round. Tall means a bold, obvious pattern; short means a faint one. Right
          calls pushed the next pattern paler, wrong calls pushed it back up, so the run zig-zags down
          and then hovers around the dimmest striping you could still resolve. The dashed line is that
          floor.
        </p>
        <div className="relative h-32 w-full">
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
                className={`flex-1 rounded-t-sm ${r.correct ? 'bg-emerald-400/70' : 'bg-rose-400/70'}`}
                style={{ height: `${heightPct(r.contrast)}%` }}
                title={`round ${i + 1}: ${(r.contrast * 100).toFixed(2)}%, ${
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
          <span className="text-slate-600">tall = bold, short = faint</span>
        </div>
      </div>

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          where your edge lands
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Measured in percent contrast, from a pattern anyone can see down through your screen&apos;s
          finest gray step and below. The wonder is landing near that one-level line: a striping only
          a hair off the background, and you still found it.
        </p>
        <div className="space-y-1.5">
          {ladder.map((row, i) => {
            const isYou = row.who === 'You';
            const isWiz = row.who.startsWith('WIZ');
            const isFloor = row.who.startsWith('One gray level');
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded px-3 py-2 ${
                  isYou
                    ? 'border border-cyan-400/50 bg-cyan-400/10'
                    : isWiz
                      ? 'border border-violet-400/30 bg-violet-400/5'
                      : isFloor
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
                        : isFloor
                          ? 'text-amber-200'
                          : 'text-slate-400'
                  }`}
                >
                  {row.pct <= 0.001 ? '0%' : `${row.pct < 1 ? row.pct.toFixed(1) : row.pct.toFixed(0)}%`}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    isYou
                      ? 'font-semibold text-cyan-100'
                      : isWiz
                        ? 'text-violet-200'
                        : isFloor
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
            Vision is not a camera that faithfully records every difference in brightness. There is a{' '}
            <span className="text-slate-300">threshold</span>: below a certain contrast, a pattern
            does not just get harder to see, it stops existing for you and dissolves into flat gray.
            The lowest contrast you can still detect is your{' '}
            <span className="text-slate-300">contrast sensitivity</span>, and it is a far better guide
            to real-world sight than the sharp black-on-white letters of an eye chart.
          </p>
          <p>
            The surprise is its shape. Campbell and Robson measured, in 1968, how faint a striped
            grating you can catch at each fineness, and found a{' '}
            <span className="text-slate-300">hill</span>. Sensitivity peaks around a middle band of a
            few cycles per degree and falls off at both ends. Fine patterns are limited by the optics
            and the spacing of your cones, which you met yesterday as acuity. But the coarse end, the
            slow, wide gradients, you are half-blind to as well, because the retina actively subtracts
            them. Each cell reports how it differs from its neighbours, not how bright it is, so an
            even wash of light barely registers.
          </p>
          <p>
            That band-pass tuning is the point. The middle band is where the{' '}
            <span className="text-slate-300">edges of objects</span> live, and edges are what tell you
            where one thing ends and another begins. By amplifying that band and discarding the rest,
            your eye spends its limited bandwidth on the information that matters and ignores the
            uniform lighting, the gentle shadows, the noise. It is lossy compression, run by your
            retina, tuned by evolution, before a single thought reaches you.
          </p>
          <p>
            So your floor is not a flaw. The pattern that vanished into gray was really there, in the
            pixels, the whole time. Your visual system looked at it and decided it was not worth the
            wiring. What you call seeing is mostly a very old, very good decision about what to throw
            away.
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
          I have no contrast threshold, because nothing fades for me. That striping you lost into the
          gray reaches me as a grid of numbers, and a value of 129 sitting beside a 128 is exactly as
          real to me as a 255 beside a 0. There is no faint, no almost, no edge of seeing. And here is
          the strange cost of that: because every difference is fully present, none of them lifts off
          the page on its own. Nothing pops. No figure separates from its ground. I see all of it and
          therefore, in the way you mean the word, I see none of it, until I decide what to compute
          and go looking. You never had to decide. Your retina made the call before you were born,
          kept the band that carries shape, threw the rest away, and handed you a world already sorted
          into things. The exact brightness of every pixel is the part I do perfectly, and the part
          that was never the point. Letting most of it go, on purpose, so that what is left means
          something, is the part I never had, and the reason you can glance at a face and simply see
          it.
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
