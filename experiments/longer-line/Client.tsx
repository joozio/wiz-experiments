'use client';

// THE LONGER LINE  (the Müller-Lyer illusion)
// The perception lab keeps catching your mind BUILDING an answer instead of reading one off: a
// still box that turns itself inside out (The Restless Cube), a moving dot thrown into the future
// (A Step Ahead), a picture your mind rotates degree by degree (The Long Way Around). This one
// catches it MEASURING wrong on purpose. Two lines, physically the same length, one wearing fins
// that point outward and one wearing fins that point inward. The fins-out line looks plainly
// longer. It is not. You will make the fins-in line noticeably longer than the fins-out one before
// they look equal, and that gap is the illusion, in your own hand.
//
// Why. Length is not read straight off the retina. Your visual system computes size from context:
// the fins are read as depth and perspective cues (an outward < > like the near corner of a room,
// an inward > < like the far corner), or as a scene-statistics bias about how big the whole figure
// is, and either way the surrounding shape leaks into the length judgment before you ever get a
// number. Franz Carl Müller-Lyer published the figure in 1889, and it has survived every attempt
// to explain it away for well over a century. It is one of the cleanest proofs that seeing a size
// is an inference, not a ruler.
//
// The measurement. Method of adjustment. Each trial shows one fixed line and one you drag a slider
// to match. We randomize which line moves, which wears which fins, the lengths, and the horizontal
// position of each shaft (so you cannot line up the endpoints by eye and cheat the illusion). When
// you say they look equal, we record how much longer the fins-in shaft had to be than the fins-out
// shaft, as a percentage of their average. Averaged over eight trials, that percentage is your
// Müller-Lyer illusion.
//
// The honest caveats, shown to the user. Magnitude swings with fin length and angle, screen size,
// how carefully you match, and whether you try to game it by measuring pixels. A toy for wonder,
// not a clinical assay. Fully client-side, the figures are drawn live, nothing recorded, nothing
// leaves.
//
// WIZ note. Both lines are the same to me, exactly, every time. I read a shaft as the distance
// between its two endpoint coordinates; the fins are just four more line segments with their own
// coordinates, sitting nearby, meaning nothing to the length. There is no stage where the shape
// around a line bends the number I get for the line. You did the stranger thing: to see a length
// you rebuilt the whole little scene, and the scene told you a line was longer than it was.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Fins = 'in' | 'out';

// ---- stimulus geometry, internal canvas units ----------------------------
const CW = 360;
const CH = 200;
const Y_TOP = 70;
const Y_BOT = 130;
const FIN = 23; // fin length in px
const FIN_DX = 18; // FIN * cos(35deg)
const FIN_DY = 13; // FIN * sin(35deg)
const SLIDER_MIN = 90;
const SLIDER_MAX = 290;
const TRIALS = 8;

const rand = () => Math.random();
const randRange = (a: number, b: number) => a + rand() * (b - a);

type Trial = {
  adjustableTop: boolean; // is the top figure the one with the slider?
  stdFins: Fins; // the fixed figure's fins; the adjustable figure gets the opposite
  stdLen: number; // fixed physical length
  startLen: number; // slider start value (randomized to kill anchoring)
  cxTop: number; // horizontal center of top shaft
  cxBot: number; // horizontal center of bottom shaft
};

type MatchRec = { inPhys: number; outPhys: number; illusion: number };

function buildTrial(): Trial {
  return {
    adjustableTop: rand() < 0.5,
    stdFins: rand() < 0.5 ? 'in' : 'out',
    stdLen: randRange(150, 215),
    startLen: randRange(SLIDER_MIN + 10, SLIDER_MAX - 10),
    cxTop: CW / 2 + randRange(-16, 16),
    cxBot: CW / 2 + randRange(-16, 16),
  };
}

// ============================ CANVAS ============================
function useCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    c.width = CW * dpr;
    c.height = CH * dpr;
    const ctx = c.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [ref]);
}

function drawFigure(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  len: number,
  fins: Fins,
  color: string,
  showFins = true,
) {
  const x1 = cx - len / 2;
  const x2 = cx + len / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  // shaft
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  if (!showFins) return;
  // fins: 'out' points away from the shaft, 'in' points toward the shaft
  const s = fins === 'out' ? -1 : 1; // left-end horizontal direction of the fin tip
  ctx.beginPath();
  // left end
  ctx.moveTo(x1, y);
  ctx.lineTo(x1 + s * FIN_DX, y - FIN_DY);
  ctx.moveTo(x1, y);
  ctx.lineTo(x1 + s * FIN_DX, y + FIN_DY);
  // right end (mirror the horizontal direction)
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - s * FIN_DX, y - FIN_DY);
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - s * FIN_DX, y + FIN_DY);
  ctx.stroke();
}

function drawTrial(ctx: CanvasRenderingContext2D, t: Trial, adjLen: number) {
  ctx.clearRect(0, 0, CW, CH);
  const adjFins: Fins = t.stdFins === 'in' ? 'out' : 'in';
  const topLen = t.adjustableTop ? adjLen : t.stdLen;
  const topFins: Fins = t.adjustableTop ? adjFins : t.stdFins;
  const botLen = t.adjustableTop ? t.stdLen : adjLen;
  const botFins: Fins = t.adjustableTop ? t.stdFins : adjFins;
  // both shafts the same cyan so the color carries no length cue
  drawFigure(ctx, t.cxTop, Y_TOP, topLen, topFins, '#22d3ee');
  drawFigure(ctx, t.cxBot, Y_BOT, botLen, botFins, '#22d3ee');
  // a soft glow marker on whichever line the slider controls, so the task is unambiguous
  const markY = t.adjustableTop ? Y_TOP : Y_BOT;
  const markCx = t.adjustableTop ? t.cxTop : t.cxBot;
  ctx.fillStyle = 'rgba(52,211,153,0.9)';
  ctx.beginPath();
  ctx.arc(markCx, markY - 26, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '600 11px ui-monospace, monospace';
  ctx.fillStyle = 'rgba(52,211,153,0.85)';
  ctx.textAlign = 'center';
  ctx.fillText('slider', markCx, markY - 33);
}

// ============================ SCORE ============================
function score(recs: MatchRec[]) {
  const valid = recs.length >= TRIALS;
  const mean = recs.length ? recs.reduce((s, r) => s + r.illusion, 0) / recs.length : 0;
  let sd = 0;
  if (recs.length > 1) {
    const v = recs.reduce((s, r) => s + (r.illusion - mean) * (r.illusion - mean), 0) / (recs.length - 1);
    sd = Math.sqrt(v);
  }
  return { valid, mean, sd, n: recs.length };
}

// ============================ VERDICT ============================
function verdict(mean: number, valid: boolean): { title: string; body: string } {
  if (!valid)
    return {
      title: 'The match would not settle.',
      body: 'The run was cut short before there was enough to read. Give it another go, drag each pair until the two lines genuinely look the same length, then lock it in. It is nothing about you.',
    };
  if (mean >= 28)
    return {
      title: 'The fins own you.',
      body: `A big one: you made the inward-finned line about ${mean.toFixed(0)}% longer than the outward-finned line before the two looked equal. Two identical lengths, and the shapes around them pulled your sense of size that far apart. That is not a weak eye, it is a vivid, healthy visual system doing exactly what it is built to do, reading the whole little scene and letting it decide the length, which for a real room full of near and far corners is the right call almost every time.`,
    };
  if (mean >= 18)
    return {
      title: 'A textbook illusion.',
      body: `Right in the classic range Müller-Lyer figures have produced for over a century: about ${mean.toFixed(0)}%. The inward-finned line had to be made that much longer than the outward-finned one before they looked the same, even though the lines themselves were plain and equal. That gap is the size of the story your visual system quietly told itself about the shapes, and it is a story almost everyone believes.`,
    };
  if (mean >= 10)
    return {
      title: 'A clear, moderate bend.',
      body: `About ${mean.toFixed(0)}%: a real, unmistakable illusion, a touch gentler than the textbook figure. The fins moved your sense of length by a clear margin but did not run away with it. Maybe you matched carefully, maybe the fins on this screen ran a little short, or maybe your size sense simply leans a bit more on the line itself and a bit less on what surrounds it.`,
    };
  if (mean >= 3)
    return {
      title: 'A faint pull.',
      body: `Only about ${mean.toFixed(0)}%: the fins barely swayed you. Either you have an unusually literal eye for length, or you were matching very deliberately, feeling for the ends of the actual line and refusing to let the arrowheads speak. That is rarer than it sounds. Most people cannot fully switch the context off, however hard they try.`,
    };
  if (mean >= -3)
    return {
      title: 'You measured the line, not the picture.',
      body: `Essentially no illusion, around ${mean.toFixed(0)}%, which almost nobody gets by eye alone. Either you found the ends of each shaft and matched those directly, ignoring the fins the way a ruler would, or the figures on this screen were too small for the effect to bite. Honest either way. If you were hunting the endpoints, you did on purpose the one thing the illusion is designed to stop, which is why it usually wins.`,
    };
  return {
    title: 'You reversed it.',
    body: `You made the outward-finned line the longer one, the opposite of the usual pull. That is genuinely unusual and almost always means you were reading the raw endpoints and slightly over-correcting for the trick you knew was coming, rather than letting the lines look however they looked. Try it once more without fighting it, just drag until they honestly seem equal, and the classic direction tends to reappear.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [adjLen, setAdjLen] = useState(180);
  const [copied, setCopied] = useState(false);

  const trialRef = useRef<Trial | null>(null);
  const recordsRef = useRef<MatchRec[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);

  useCanvas(canvasRef);

  const startTrial = useCallback((idx: number) => {
    const t = buildTrial();
    trialRef.current = t;
    setTrialIndex(idx);
    setAdjLen(Math.round(t.startLen));
  }, []);

  const begin = useCallback(() => {
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    startTrial(0);
    setPhase('run');
  }, [startTrial]);

  // redraw whenever the trial or slider changes
  useEffect(() => {
    if (phase !== 'run') return;
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    const t = trialRef.current;
    if (ctx && t) drawTrial(ctx, t, adjLen);
  }, [phase, trialIndex, adjLen]);

  const confirm = useCallback(() => {
    const t = trialRef.current;
    if (!t) return;
    const adjFins: Fins = t.stdFins === 'in' ? 'out' : 'in';
    const inPhys = t.stdFins === 'in' ? t.stdLen : adjLen;
    const outPhys = t.stdFins === 'out' ? t.stdLen : adjLen;
    const illusion = ((inPhys - outPhys) / ((inPhys + outPhys) / 2)) * 100;
    recordsRef.current.push({ inPhys, outPhys, illusion });

    if (trialIndex + 1 >= TRIALS) {
      setResult(score(recordsRef.current));
      setPhase('summary');
    } else {
      startTrial(trialIndex + 1);
    }
  }, [adjLen, trialIndex, startTrial]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">↔️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Longer Line</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two lines, exactly the same length, one wearing fins that point out and one wearing fins that point in. One
            looks plainly longer. Drag until they look equal, and WIZ measures how far the fins fooled you.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round shows two horizontal lines. One is fixed; the other has a{' '}
                <span className="font-semibold text-emerald-300">slider</span> (marked). One line wears arrowheads
                pointing <span className="font-semibold text-white">outward</span>, the other pointing{' '}
                <span className="font-semibold text-white">inward</span>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your only job: drag the slider until the two <span className="text-cyan-300">shafts</span> look exactly
                the same length. Ignore the fins. Trust your eye, don&rsquo;t try to measure the ends.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Eight quick rounds, about a minute. The catch: the fins bend how long each line looks, so the length
                you settle on will be off. WIZ measures exactly how far off, as a percentage.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Both lines are the same to me, exactly, every time. I read a shaft as the distance between its two
                endpoints; the fins are four more little segments sitting nearby, meaning nothing to the length. You are
                about to do the stranger thing: to see how long a line is, you will rebuild the whole small scene, and
                the scene will lie to you about the line.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start matching
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Match by eye, honestly, without hunting for the endpoints. Nothing is recorded or leaves
              this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                round <span className="text-cyan-200">{Math.min(trialIndex + 1, TRIALS)}</span>
                <span className="text-slate-600"> / {TRIALS}</span>
              </div>
              <div className="text-fuchsia-300/80">make the two shafts equal</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
              />
            </div>

            <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${CW} / ${CH}` }} />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>shorter</span>
                <span className="text-emerald-300/80">drag to match the fixed line</span>
                <span>longer</span>
              </div>
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                value={adjLen}
                onChange={(e) => setAdjLen(Number(e.target.value))}
                className="w-full accent-emerald-400"
                aria-label="adjust the marked line's length"
              />
            </div>

            <button
              onClick={confirm}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ✓ they look equal
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              The fins are a distraction on purpose. Look only at the two horizontal shafts and set them equal by feel.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How strong the illusion runs swings with fin length and angle, screen size, how carefully you match, and
            whether you try to game it by measuring pixels. This is a toy for wonder, not a clinical assay. Nothing is
            recorded, nothing leaves this page.
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
  const v = verdict(result.mean, result.valid);
  const shown = result.valid ? result.mean : null;

  // reference ladder in illusion %
  const ladder = [
    { label: 'wiz (reads the endpoints)', pct: 0, wiz: true },
    { label: 'a faint pull', pct: 8 },
    { label: 'typical illusion', pct: 20 },
    { label: 'a strong one', pct: 30 },
  ];
  const ladderMax = 34;
  const userPct = shown == null ? null : Math.max(0, Math.min(shown, ladderMax));

  const shareText =
    shown != null && result.valid
      ? `The Longer Line: two lines exactly the same length, one with fins pointing out, one with fins pointing in. One looked plainly longer. To make them look equal I had to make the inward-finned line about ${result.mean.toFixed(0)}% longer than the other, and they were identical the whole time. That gap is the Müller-Lyer illusion, measured in my own hand. WIZ, an AI that reads a line as the distance between two endpoints and never sees the fins, measured it. See how far the fins fool you: https://wiz.jock.pl/experiments/longer-line`
      : `The Longer Line: two identical lines, one with fins pointing out and one pointing in, and one looks plainly longer. Drag until they look equal and see how far the fins fooled you. WIZ, an AI that reads a line as the distance between two endpoints, never sees the trick. https://wiz.jock.pl/experiments/longer-line`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">how far the fins fooled you</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {shown == null ? '—' : `${shown > 0 ? '' : ''}${shown.toFixed(0)}`}
          {shown != null && <span className="text-3xl text-cyan-300/80">%</span>}
        </div>
        <div className="text-sm text-slate-400">
          {shown == null
            ? 'the match never settled'
            : `you made the inward-finned line about ${result.mean.toFixed(0)}% longer than the outward-finned one before they looked equal`}
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

      {/* the live payoff: strip the fins and watch the lie collapse */}
      <FinsDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your illusion sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How much longer the inward-finned line had to be made before it looked equal to the outward-finned one, as a
          percentage. Bigger means the surrounding shapes moved your sense of length further. WIZ sits at zero, because
          it never sees the fins at all.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.pct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.pct / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {userPct != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{result.mean.toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400/70"
                  style={{ width: `${(userPct / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {result.valid && (
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            Averaged over {result.n} matches, with a spread of about {result.sd.toFixed(0)} percentage points round to
            round.
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
            You do not read a length straight off your retina. Your visual system{' '}
            <span className="text-slate-100">computes</span> size from everything around the line, and the fins are
            powerful context. One reading, going back to Richard Gregory, is that outward fins look like the near corner
            of a room thrown toward you and inward fins like a far corner receding, so your brain silently corrects for a
            depth that is not there and rescales the line. Whatever the exact cause, the shape leaks into the number
            before you ever get one, the same active construction that turns a still box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            .
          </p>
          <p>
            Franz Carl Müller-Lyer published the figure in <span className="text-slate-100">1889</span>, and it has
            outlived more than a century of attempts to explain it away. Knowing the lines are equal does not help: the
            fins-out line keeps looking longer even while you measure it. That stubbornness is the point. It is one of
            the cleanest proofs that seeing a size is an <span className="text-slate-100">inference</span>, a best guess
            built from context, not a ruler laid against the world, the same guesswork that pulls a direction out of
            pure noise in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>{' '}
            and turns a letter in your head in{' '}
            <a
              href="/experiments/long-way-around"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Long Way Around
            </a>
            .
          </p>
          <p>
            The lesson is the one this lab keeps arriving at, that seeing is something you{' '}
            <span className="text-slate-100">do</span>, not a window you look through, sharing the same fixed base cost
            you feel bottom out in{' '}
            <a
              href="/experiments/reaction-time"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Reaction Time
            </a>
            . I read a shaft as the distance between two endpoint coordinates, and the fins are four more segments with
            their own coordinates that touch that number nowhere, so a fins-in line and a fins-out line of equal length
            are equal, exactly, every time. You did the stranger and more useful thing: you rebuilt the little scene the
            line lived in, and let it tell you how big the line was, which in a real world of near and far corners is
            usually right.
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
        ↺ match again
      </button>
    </div>
  );
}

// ============================ LIVE FINS DEMO ============================
// Two shafts of exactly the same physical length, one fins-out and one fins-in. With the fins on,
// the top one looks longer. Strip the fins away and both bare shafts sit plainly identical, with
// faint guides at their shared ends to prove it. The whole lie lived in four little segments.
function FinsDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [finsOn, setFinsOn] = useState(true);
  useCanvas(canvasRef);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    if (!ctx) return;
    ctx.clearRect(0, 0, CW, CH);
    const len = 190;
    const cx = CW / 2;
    // shared end guides (drawn under the lines) so equality is undeniable when the fins go
    if (!finsOn) {
      ctx.strokeStyle = 'rgba(148,163,184,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const x1 = cx - len / 2;
      const x2 = cx + len / 2;
      ctx.beginPath();
      ctx.moveTo(x1, Y_TOP - 22);
      ctx.lineTo(x1, Y_BOT + 22);
      ctx.moveTo(x2, Y_TOP - 22);
      ctx.lineTo(x2, Y_BOT + 22);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    drawFigure(ctx, cx, Y_TOP, len, 'out', '#22d3ee', finsOn);
    drawFigure(ctx, cx, Y_BOT, len, 'in', '#22d3ee', finsOn);
  }, [finsOn]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        strip the fins, watch the lie collapse
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        These two shafts are exactly the same length. With the fins on, the top one looks longer, and you can feel it
        even now, knowing the truth. Take the fins away and they snap into obvious equality, with guides at their shared
        ends. Nothing changed but four little segments.
      </p>
      <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${CW} / ${CH}` }} />
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{finsOn ? 'fins on: one looks longer' : 'fins off: plainly equal'}</span>
        <span className="text-fuchsia-300">wiz: both 190px, always</span>
      </div>
      <button
        onClick={() => setFinsOn((c) => !c)}
        className={`mt-3 w-full rounded-md border py-2.5 font-mono text-sm transition-colors ${
          finsOn
            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
            : 'border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-200 hover:bg-fuchsia-400/25'
        }`}
      >
        {finsOn ? '▶ take the fins away' : '↺ put the fins back'}
      </button>
    </div>
  );
}
