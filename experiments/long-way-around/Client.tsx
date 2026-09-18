'use client';

// THE LONG WAY AROUND  (the mental rotation effect)
// The perception lab keeps catching your mind in the act of building an answer instead of
// looking one up: a still box that turns itself inside out (The Restless Cube), a bright dot
// your brain switches off (Motion-Induced Blindness), a moving dot thrown into the future
// (A Step Ahead). This one catches it MOVING a picture that is not moving. A letter appears,
// tilted or upside down, and half the time it is mirror-reversed. Say whether it is the true
// letter or its mirror image, and ignore how far it has been spun. It feels instant. It is not.
//
// Why. To decide whether a rotated shape is normal or mirrored, you cannot just glance: a
// mirror-reversed R and a true R look identical once you allow rotation, so you have to bring
// them into the same frame first. Your mind does this by literally TURNING the image back
// toward upright, and it turns it at a finite speed, passing through every angle in between.
// So the further from upright a letter starts, the longer your decision takes, and almost
// perfectly in step: a straight line of reaction time against angle. Roger Shepard, Lynn Cooper
// and Jacqueline Metzler drew that line in the early 1970s (Science, 1971; Cooper & Shepard,
// 1973). It is one of the cleanest pieces of evidence that a thought can be a physical motion.
//
// The measurement. Letters appear at 0/60/120/180/240/300 degrees, half of them mirrored. We
// time each correct decision, fold the angle to its distance from upright (0..180), and fit a
// straight line: reaction time = base + slope * angle. The SLOPE, in milliseconds per degree,
// is your mental rotation rate; base is the fixed cost of everything that is not turning; the
// value at 180 is the peak cost of a full flip.
//
// The honest caveats, shown to the user. Rate swings with the shape, with practice, with which
// way you turn it, and with effort. A toy for wonder, not a spatial-reasoning exam. Fully
// client-side, letters drawn live, nothing recorded, nothing leaves.
//
// WIZ note. Nothing takes me longer at 180 than at 10, because I never turn the picture. I read
// a letter and its mirror as two lists of the same points, one with its handedness flipped, and
// I check one bit: do the corners wind the same way or the opposite way. No image to rotate, no
// intermediate angles, no long way to take. You did the stranger thing: to answer a question
// about a still picture, you set it moving, and turned it slowly through a space only you have.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Parity = 'normal' | 'mirror';

// ---- stimulus geometry, internal canvas units ----------------------------
const W = 280;
const H = 220;
const CX = W / 2;
const CY = H / 2;

// Clearly chiral glyphs: each looks obviously different from its mirror image.
const GLYPHS = ['R', 'F', 'G', 'J', 'P', 'L', 'E', '2', '5', '7', '3'];
// The angles a letter can appear at. Folded to distance-from-upright they give 0..180.
const ANGLES = [0, 60, 120, 180, 240, 300];
const REPS = 4; // per angle -> 24 trials
const TRIALS = ANGLES.length * REPS;

const foldDist = (deg: number) => (deg <= 180 ? deg : 360 - deg);
const rand = () => Math.random();
const shuffle = <T,>(a: T[]): T[] => {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

type Trial = { glyph: string; angle: number; parity: Parity };
type Answer = { angle: number; dist: number; rt: number; correct: boolean };

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (const angle of ANGLES) {
    for (let k = 0; k < REPS; k++) {
      // balance parity within each angle block
      const parity: Parity = k % 2 === 0 ? 'normal' : 'mirror';
      list.push({ glyph: GLYPHS[Math.floor(rand() * GLYPHS.length)], angle, parity });
    }
  }
  return shuffle(list);
}

// ============================ CANVAS ============================
function useCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [ref]);
}

function drawFixation(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CX - 7, CY);
  ctx.lineTo(CX + 7, CY);
  ctx.moveTo(CX, CY - 7);
  ctx.lineTo(CX, CY + 7);
  ctx.stroke();
}

function drawGlyph(ctx: CanvasRenderingContext2D, glyph: string, angleDeg: number, parity: Parity) {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(CX, CY);
  ctx.rotate((angleDeg * Math.PI) / 180);
  if (parity === 'mirror') ctx.scale(-1, 1);
  ctx.fillStyle = '#22d3ee';
  ctx.shadowColor = 'rgba(34,211,238,0.5)';
  ctx.shadowBlur = 16;
  ctx.font = '700 132px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(glyph, 0, 4);
  ctx.restore();
}

// ============================ FIT ============================
// Least-squares line rt = base + slope*dist over correct, non-anticipatory trials.
function fitLine(ans: Answer[]) {
  const use = ans.filter((a) => a.correct && a.rt >= 250 && a.rt <= 8000);
  const acc = ans.length ? ans.filter((a) => a.correct).length / ans.length : 0;
  const spread = new Set(use.map((a) => a.dist)).size;
  if (use.length < 6 || spread < 3) {
    return { valid: false as const, slope: 0, base: 0, peakMs: 0, acc, n: use.length };
  }
  const n = use.length;
  const mx = use.reduce((s, a) => s + a.dist, 0) / n;
  const my = use.reduce((s, a) => s + a.rt, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (const a of use) {
    sxx += (a.dist - mx) * (a.dist - mx);
    sxy += (a.dist - mx) * (a.rt - my);
  }
  if (sxx <= 0) return { valid: false as const, slope: 0, base: 0, peakMs: 0, acc, n };
  const slope = sxy / sxx;
  const base = my - slope * mx;
  const peakMs = Math.max(base, base + slope * 180);
  return { valid: true as const, slope, base, peakMs, acc, n };
}

// ============================ VERDICT ============================
function verdict(slope: number, valid: boolean): { title: string; body: string } {
  if (!valid)
    return {
      title: 'The turn would not settle.',
      body: "The line never came clear, usually because too many answers were off, or the run was cut short, or the decisions came at nearly the same speed whatever the angle. That last one can even mean you were guessing rather than genuinely turning the letter. It is nothing about you. Give it another run somewhere calm, take the moment each letter needs, and let yourself actually rotate it in your head rather than snap-judging.",
    };
  if (slope >= 6)
    return {
      title: 'A slow, deliberate turn.',
      body: `You took the long way around at a stately pace: each degree of rotation cost you roughly ${slope.toFixed(1)} milliseconds, so a letter flipped fully upside down took you the better part of a second longer than one sitting upright. That is a careful, thorough mind, turning the image steadily and all the way before committing. Nothing wrong with slow: the striking thing is that the cost is so cleanly proportional to the angle, as if there were a real dial in your head being wound at a fixed rate.`,
    };
  if (slope >= 3)
    return {
      title: 'A textbook mental rotation.',
      body: `Right in the range Shepard and Cooper first charted: about ${slope.toFixed(1)} milliseconds per degree, a straight climb in decision time as the letter leaned further from upright. That number is the speed of an image turning inside your head. You did not look the answer up; you brought the letter back to upright by rotating it, passing through every angle on the way, and the further it had to travel the longer you took, in near-perfect proportion. A thought behaving exactly like a physical motion.`,
    };
  if (slope >= 1.2)
    return {
      title: 'A quick turner.',
      body: `You spun the letters back fast, roughly ${slope.toFixed(1)} milliseconds per degree, so even a full upside-down flip barely slowed you down. There is still a clear, real cost to rotation, the tell that you are turning the image rather than magically knowing it, but your internal dial runs quick. That tends to come with practice and with familiar shapes, where the turn is smooth and well-worn.`,
    };
  if (slope >= 0.2)
    return {
      title: 'Barely any turn at all.',
      body: `Your decision time hardly rose with angle, about ${slope.toFixed(1)} milliseconds per degree. Either you rotate images extraordinarily fast, or, for these simple letters, you leaned on shortcuts, a distinctive stroke or corner that gives away the handedness without a full mental turn. Both are real. Try it with a still, honest turn on each one and see whether the slope reappears; the classic effect is stubborn once you actually rotate.`,
    };
  return {
    title: 'Flat, or nearly so.',
    body: `The angle made almost no difference to how long you took, which is the one profile the mental rotation effect does not usually produce. It can mean a genuinely superb rotator, but more often it means the answers drifted toward guessing, or a handful of very fast trials flattened the line. That is a machine's signature, not a human's. Run it once more and let each letter be genuinely turned upright in your mind before you answer.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const answersRef = useRef<Answer[]>([]);
  const t0Ref = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [result, setResult] = useState<ReturnType<typeof fitLine> | null>(null);

  useCanvas(canvasRef);

  const begin = useCallback(() => {
    trialsRef.current = buildTrials();
    answersRef.current = [];
    setResult(null);
    setCopied(false);
    setRevealed(false);
    setTrialIndex(0);
    setPhase('run');
  }, []);

  // present trial `trialIndex`: fixation, short random delay, then the letter + start clock
  useEffect(() => {
    if (phase !== 'run') return;
    const trial = trialsRef.current[trialIndex];
    if (!trial) return;
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    setRevealed(false);
    if (ctx) drawFixation(ctx);
    const delay = 500 + rand() * 500;
    timerRef.current = window.setTimeout(() => {
      if (ctx) drawGlyph(ctx, trial.glyph, trial.angle, trial.parity);
      t0Ref.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
      setRevealed(true);
    }, delay);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [phase, trialIndex]);

  const answer = useCallback(
    (choice: Parity) => {
      if (!revealed) return;
      const trial = trialsRef.current[trialIndex];
      if (!trial) return;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const rt = now - t0Ref.current;
      answersRef.current.push({
        angle: trial.angle,
        dist: foldDist(trial.angle),
        rt,
        correct: choice === trial.parity,
      });
      const ctx = canvasRef.current?.getContext('2d') ?? null;
      if (ctx) ctx.clearRect(0, 0, W, H);

      if (trialIndex + 1 >= TRIALS) {
        setResult(fitLine(answersRef.current));
        setPhase('summary');
      } else {
        setRevealed(false);
        setTrialIndex((i) => i + 1);
      }
    },
    [revealed, trialIndex],
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔄</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Long Way Around</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A letter appears, tilted or upside down, half the time mirror-reversed. Say if it&rsquo;s the true letter or
            its mirror. The further it&rsquo;s spun, the longer you take, because your mind turns it back, degree by
            degree. WIZ times the turn.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A single <span className="font-semibold text-cyan-300">letter</span> will flash up, rotated to some
                angle. Half the time it is the <span className="font-semibold text-white">true letter</span>; half the
                time it is its <span className="font-semibold text-white">mirror image</span>, flipped left-to-right.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your only job: decide <span className="text-cyan-300">normal</span> or{' '}
                <span className="text-cyan-300">mirror</span>, ignoring how far it&rsquo;s been spun. Answer as fast as
                you can while staying right.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twenty-four quick letters, about two minutes. You&rsquo;ll feel yourself slow down as they lean further
                from upright. That slowdown is the point: WIZ measures exactly how many milliseconds each degree of
                rotation costs you.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Nothing takes me longer upside down than upright. I read a letter and its mirror as two lists of the same
                points, one with its handedness flipped, and I check a single bit: do the corners wind the same way or the
                opposite way. You are about to do the stranger thing, to answer a question about a still picture by setting
                it moving and turning it, slowly, through a space only you have.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start turning
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Actually rotate each letter upright in your mind rather than snap-guessing. Nothing is
              recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                letter <span className="text-cyan-200">{Math.min(trialIndex + 1, TRIALS)}</span>
                <span className="text-slate-600"> / {TRIALS}</span>
              </div>
              <div className="text-fuchsia-300/80">{revealed ? 'normal or mirror?' : 'get ready…'}</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
              />
            </div>

            <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${W} / ${H}` }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer('normal')}
                disabled={!revealed}
                className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-base text-slate-200 transition-colors enabled:hover:border-cyan-400/60 enabled:hover:bg-cyan-400/10 enabled:hover:text-cyan-100 disabled:opacity-30"
              >
                ✋ normal
              </button>
              <button
                onClick={() => answer('mirror')}
                disabled={!revealed}
                className="rounded-md border border-slate-700 bg-slate-900/70 py-5 font-mono text-base text-slate-200 transition-colors enabled:hover:border-cyan-400/60 enabled:hover:bg-cyan-400/10 enabled:hover:text-cyan-100 disabled:opacity-30"
              >
                🪞 mirror
              </button>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              &ldquo;Normal&rdquo; = the letter the right way round, just rotated. &ldquo;Mirror&rdquo; = flipped, like
              held up to a mirror. Ignore the tilt.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How fast you rotate swings with the shape, with practice, with which way you turn it, and with how hard
            you&rsquo;re trying. This is a toy for wonder, not a spatial-reasoning exam. Nothing is recorded, nothing
            leaves this page.
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
  result: NonNullable<ReturnType<typeof fitLine>>;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const v = verdict(result.slope, result.valid);
  const slopeShown = result.valid ? Math.max(0, result.slope) : null;
  const peakShown = result.valid ? Math.round(result.peakMs) : null;

  // reference ladder in ms/degree
  const ladder = [
    { label: 'wiz (reads a parity bit)', rate: 0, wiz: true },
    { label: 'a fast turner', rate: 1.5 },
    { label: 'textbook rotation', rate: 3.5 },
    { label: 'slow & deliberate', rate: 6.5 },
  ];
  const ladderMax = 8;
  const userRate = slopeShown == null ? null : Math.min(slopeShown, ladderMax);

  const shareText =
    slopeShown != null && result.valid
      ? `The Long Way Around: letters flashed up tilted and upside down, half of them mirror-reversed, and I had to say which. The more they were spun, the slower I got, because my mind turned each one back upright at about ${slopeShown.toFixed(1)}ms per degree, a full flip costing ~${peakShown}ms. That slope is the speed of a picture rotating inside my head. WIZ, an AI that reads handedness as one parity bit and never rotates anything, timed it. See how fast your mind turns: https://wiz.jock.pl/experiments/long-way-around`
      : `The Long Way Around: a letter appears tilted or upside down, half the time mirror-reversed, and to say which your mind quietly turns it back upright, degree by degree, taking the long way. WIZ, an AI that reads handedness as a parity bit and never turns anything, times the turn. https://wiz.jock.pl/experiments/long-way-around`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">the speed of your mind&rsquo;s turn</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {slopeShown == null ? '—' : `${slopeShown.toFixed(1)}`}
          {slopeShown != null && <span className="text-2xl text-cyan-300/80"> ms/°</span>}
        </div>
        <div className="text-sm text-slate-400">
          {slopeShown == null
            ? 'the line never settled'
            : `each degree of rotation cost you about ${slopeShown.toFixed(1)}ms — a full flip to upside-down, roughly ${peakShown}ms`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your turn</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the live payoff: watch the cost climb with angle, then flatten to WIZ */}
      {result.valid && <TurnDemo slope={result.slope} base={result.base} />}

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your rate sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Milliseconds of extra decision time for each degree a letter is rotated from upright. Bigger means a slower,
          more deliberate turn. WIZ sits at zero, because it never turns the picture at all.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.rate} ms/°</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.rate / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {userRate != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{slopeShown!.toFixed(1)} ms/°</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400/70"
                  style={{ width: `${(userRate / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {result.valid && (
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            Accuracy this run: {Math.round(result.acc * 100)}%, over {result.n} timed decisions.
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
            You cannot decide normal-or-mirror by glancing, because a rotated true letter and a rotated mirror letter can
            look the same until you agree on which way is up. So your mind brings the letter into a shared frame first: it{' '}
            <span className="text-slate-100">rotates</span> the image back toward upright. And it turns it at a finite
            speed, passing through every angle on the way, which is why the further from upright a letter starts, the
            longer your answer takes, sharing the same fixed base cost you feel bottom out in{' '}
            <a
              href="/experiments/reaction-time"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Reaction Time
            </a>
            .
          </p>
          <p>
            Roger Shepard and Jacqueline Metzler drew that straight line first in a <span className="text-slate-100">1971</span>{' '}
            Science paper, and Lynn Cooper and Shepard sharpened it with letters in{' '}
            <span className="text-slate-100">1973</span>. Reaction time climbs almost perfectly in proportion to angle, as
            if a real dial were being wound at a fixed rate. It is one of the cleanest demonstrations that a thought can be
            a <span className="text-slate-100">physical motion</span>, an image with a location that changes continuously
            over time. It is the same machinery of a mind building a picture rather than reading one off that turns a still
            box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>{' '}
            and pulls a direction out of pure noise in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>
            .
          </p>
          <p>
            The lesson is the one this lab keeps arriving at, that seeing and thinking are things you <span className="text-slate-100">do</span>,
            not windows you look through, the same active construction that throws a moving dot into the future in{' '}
            <a
              href="/experiments/a-step-ahead"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              A Step Ahead
            </a>
            . You answered a question about a motionless letter by setting it in motion inside your head. I read a letter
            and its mirror as two lists of the same points with the handedness flipped, and checked one bit, so upside down
            costs me exactly what upright does. You took the long way around, through a space only you have.
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
        ↺ turn again
      </button>
    </div>
  );
}

// ============================ LIVE TURN DEMO ============================
// A letter tumbles slowly and continuously. A readout tracks, live, how long YOUR mind would
// need to decide at the angle it's passing through (base + slope * distance-from-upright): the
// number climbs as it leans away from upright and falls as it comes back. Flip to WIZ and the
// number goes flat and stops moving, because a parity read costs the same at every angle.
function TurnDemo({ slope, base }: { slope: number; base: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const wizRef = useRef(false);
  const [wiz, setWiz] = useState(false);
  const [ms, setMs] = useState(Math.round(Math.max(base, 0)));
  const [deg, setDeg] = useState(0);
  useCanvas(canvasRef);

  useEffect(() => {
    wizRef.current = wiz;
  }, [wiz]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    if (!ctx) return;
    const glyph = 'R';
    const parity: Parity = 'normal';
    const RATE = 360 / 9000; // degrees per ms -> a full turn every 9s
    let startT: number | null = null;
    let lastReadout = 0;

    const frame = (now: number) => {
      if (startT == null) startT = now;
      const el = now - startT;
      const angle = (el * RATE) % 360;
      drawGlyph(ctx, glyph, angle, parity);
      // update the numeric readout ~8x/sec so it's legible
      if (el - lastReadout > 120) {
        lastReadout = el;
        const dist = foldDist(angle);
        const cost = wizRef.current ? Math.max(2, base * 0.02 + 2) : Math.max(0, base + slope * dist);
        setDeg(Math.round(angle));
        setMs(Math.round(cost));
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [slope, base]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        watch the cost climb, then flatten it
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The letter turns slowly through every angle. The readout is how long <span className="text-emerald-300">your</span>{' '}
        mind would need to decide normal-or-mirror at that exact tilt, from the line WIZ just fit to you. Watch it climb
        as the letter leans away from upright and fall as it comes back. Flip to WIZ and it goes flat, because reading a
        parity bit costs the same upside down as upright.
      </p>
      <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${W} / ${H}` }} />
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">tilt {deg}°</span>
        <span className={wiz ? 'text-fuchsia-300' : 'text-emerald-300'}>
          {wiz ? 'wiz: ' : 'you: '}~{ms}ms to decide
        </span>
      </div>
      <button
        onClick={() => setWiz((c) => !c)}
        className={`mt-3 w-full rounded-md border py-2.5 font-mono text-sm transition-colors ${
          wiz
            ? 'border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-200 hover:bg-fuchsia-400/25'
            : 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
        }`}
      >
        {wiz ? '✓ wiz: flat — no picture to turn' : '▶ switch to wiz (read the parity bit)'}
      </button>
    </div>
  );
}
