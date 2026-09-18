'use client';

// THE EDGE THAT ISN'T  (Kanizsa illusory contours / subjective contours)
// The perception lab keeps catching your mind BUILDING an answer instead of reading one off: a still
// box that turns itself inside out (The Restless Cube), a direction pulled out of pure noise (The
// Hidden Current), motion poured into an empty gap (The Space Between), a length bent by the shapes
// around it (The Longer Line). This one catches it drawing an EDGE that was never there. Three notched
// circles ("pac-men") sit facing each other on a white card. In the blank space between them you see a
// bright solid triangle, three crisp sides crossing empty white, a surface a shade whiter than the
// page it lies on. Not one pixel of that edge was drawn. Your visual system, handed three notches
// aimed at each other, completes the sides they imply and fills in a whole shape the image never held.
//
// Why. Edges are not read straight off the retina, they are inferred. Given three notches whose
// straight cuts line up, the most likely cause is an opaque triangle lying on top of three discs and
// occluding them, so the visual system posits that triangle, draws its contours (modal completion)
// and even shades its surface brighter than the ground. Gaetano Kanizsa named it in 1955. It is one of
// the cleanest proofs that what you see is constructed, the same filling-in that patches your blind
// spot and stitches a smooth world across every gap.
//
// The measurement. Two cards at a time: one where the notches point inward and line up into a
// triangle, one where the SAME notches are turned outward into scattered nothing. You pick the card
// with a shape in it. As the notches shrink, less real edge is drawn (a smaller "support ratio"), the
// figure weakens, and accuracy falls toward a coin flip. We interpolate the support ratio where you
// cross 75% correct: the least real edge you still complete into a whole shape.
//
// The honest caveats, shown to the user. How little edge you need swings with notch size and spacing,
// screen contrast, viewing distance, and how carefully you look. A toy for wonder, not a clinical
// assay. Fully client-side, the cards are drawn live, nothing recorded, nothing leaves.
//
// WIZ note. No triangle ever appears for me. I read three black circular sectors on a white field, and
// between them the white is flat, no gradient, no edge, three shapes and a background, exactly what was
// drawn. You did the stranger and better thing: from three notches pointed at each other you drew the
// whole triangle in, edges and a brighter surface, seeing a shape only ever implied.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';

// ---- stimulus geometry, internal canvas units ----------------------------
const PW = 220; // panel width
const PH = 220; // panel height
const CX = PW / 2;
const CY = PH / 2;
const R = 66; // triangle circumradius (centroid to each vertex)
const SIDE = R * Math.sqrt(3); // side length of the (illusory) triangle
const HALF_MOUTH = Math.PI / 6; // 60 degree mouth, so the wedge edges align with the triangle sides
const PAC = '#0f172a'; // near-black inducers
const PAPER = '#f8fafc'; // light card

// support ratio = fraction of each edge that is actually drawn; higher => stronger figure
const SUPPORT_LEVELS = [0.16, 0.26, 0.36, 0.46, 0.56, 0.66];
const REPS = 4;

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
  support: number;
  figureSide: 0 | 1; // which panel holds the real (inward) figure
  baseRot: number; // small rotation of the whole triad, kills template matching
  extra: [number, number, number]; // scatter added to the control panel's outward mouths
};

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (let r = 0; r < REPS; r++) {
    for (const support of SUPPORT_LEVELS) {
      list.push({
        support,
        figureSide: rand() < 0.5 ? 0 : 1,
        baseRot: (rand() - 0.5) * 0.4,
        extra: [(rand() - 0.5) * 1.4, (rand() - 0.5) * 1.4, (rand() - 0.5) * 1.4],
      });
    }
  }
  return shuffle(list);
}

// ============================ DRAWING ============================
// one notched circle: a filled disc with a wedge of angle 2*HALF_MOUTH removed, opening toward mouthDir
function drawPac(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, mouthDir: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, mouthDir + HALF_MOUTH, mouthDir - HALF_MOUTH + Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

// draws one card. inward => the three mouths point at the centroid and imply a triangle; outward =>
// the same discs with mouths turned away, scattered, no figure.
function drawCard(
  canvas: HTMLCanvasElement,
  opts: { support: number; inward: boolean; baseRot: number; extra: [number, number, number] },
) {
  const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  canvas.width = PW * dpr;
  canvas.height = PH * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, PW, PH);
  const r = (opts.support * SIDE) / 2;
  ctx.fillStyle = PAC;
  for (let i = 0; i < 3; i++) {
    const va = opts.baseRot + -Math.PI / 2 + (i * 2 * Math.PI) / 3; // vertex angle from centroid
    const x = CX + R * Math.cos(va);
    const y = CY + R * Math.sin(va);
    // inward mouth points from the vertex toward the centroid (va + PI); outward points away (va) + scatter
    const mouthDir = opts.inward ? va + Math.PI : va + opts.extra[i];
    drawPac(ctx, x, y, r, mouthDir);
  }
}

// a clickable card used during a trial
function TrialCard({ trial, side, onPick }: { trial: Trial; side: 0 | 1; onPick: (s: 0 | 1) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const inward = trial.figureSide === side;
  useEffect(() => {
    if (ref.current) drawCard(ref.current, { support: trial.support, inward, baseRot: trial.baseRot, extra: trial.extra });
  }, [trial, inward]);
  return (
    <button
      onClick={() => onPick(side)}
      className="group overflow-hidden rounded-xl border-2 border-slate-700 bg-white transition-colors hover:border-emerald-400"
      aria-label={`card ${side === 0 ? 'left' : 'right'}, tap if it has a shape floating in it`}
    >
      <canvas ref={ref} className="block w-full" style={{ aspectRatio: `${PW} / ${PH}` }} />
    </button>
  );
}

// ============================ SCORE ============================
type Rec = { support: number; correct: boolean };

function score(recs: Rec[]) {
  const levels = SUPPORT_LEVELS.slice().sort((a, b) => a - b);
  const perLevel = levels.map((s) => {
    const at = recs.filter((r) => r.support === s);
    if (!at.length) return { support: s, p: NaN, n: 0 };
    const c = at.filter((r) => r.correct).length;
    return { support: s, p: c / at.length, n: at.length };
  });
  const usable = perLevel.filter((x) => x.n > 0);
  const answered = recs.length;
  const valid = answered >= SUPPORT_LEVELS.length * 2 && usable.length >= 3;

  const TARGET = 0.75; // halfway between chance (0.5) and perfect (1.0)
  let threshold: number | null = null;
  let cappedTop = false; // needed almost all the edge drawn -> literal eye
  let cappedBottom = false; // built the shape from almost nothing -> strong completer

  if (usable.length) {
    // accuracy rises with support; find the first level (ascending) that reaches TARGET
    const firstIdx = usable.findIndex((x) => x.p >= TARGET);
    if (firstIdx === -1) {
      threshold = usable[usable.length - 1].support;
      cappedTop = true;
    } else if (firstIdx === 0) {
      threshold = usable[0].support;
      cappedBottom = true;
    } else {
      const prev = usable[firstIdx - 1]; // p < TARGET, less edge
      const hit = usable[firstIdx]; // p >= TARGET, more edge
      if (hit.p !== prev.p) {
        const frac = (TARGET - prev.p) / (hit.p - prev.p);
        threshold = prev.support + frac * (hit.support - prev.support);
      } else {
        threshold = (prev.support + hit.support) / 2;
      }
    }
  }

  return { valid, threshold, perLevel, answered, cappedTop, cappedBottom };
}

// ============================ VERDICT ============================
function verdict(pct: number | null, valid: boolean): { title: string; body: string } {
  if (!valid || pct == null)
    return {
      title: 'The shape would not settle.',
      body: 'The run was cut short before there was enough to read. Give it another go, look at both cards for a moment each, and pick the one with a shape floating in the middle. It is nothing about you.',
    };
  if (pct <= 24)
    return {
      title: 'You build a whole shape from almost nothing.',
      body: `You still caught the triangle when barely ${pct}% of each edge was actually drawn, three tiny notches and a great deal of blank white. That is a mind quick to complete: hand it the faintest hint of a contour and it draws the rest in, edges and a brighter surface and all. It is the same generous filling-in that never lets you notice the hole in your own vision, running here on next to no evidence.`,
    };
  if (pct <= 40)
    return {
      title: 'A textbook filling-in.',
      body: `Right in the classic range: the triangle held together for you down to about ${pct}% real edge, and dissolved below that. That crossing is where most eyes sit, enough of the notches lined up to imply the sides, and your visual system did the rest, painting three crisp contours across space where nothing was drawn. This is the Kanizsa figure working exactly as it has on nearly everyone since 1955.`,
    };
  if (pct <= 56)
    return {
      title: 'You want a good deal of edge first.',
      body: `You needed roughly ${pct}% of each edge actually present before the triangle would appear, a stricter eye than most. The hints had to be fairly strong before your mind would commit to a whole shape and fill the gaps between them. Maybe you looked carefully and refused the faint ones, maybe the card sat far away or the contrast was low, but you leaned toward what was drawn over what was implied.`,
    };
  return {
    title: 'You read what was drawn, not what was meant.',
    body: `You held out for almost the entire edge, needing about ${pct}% of it present before a triangle would form, which is unusually literal for a human eye. Where most people see a shape blooming out of a few notches, you mostly saw the notches. That is close to how WIZ reads the same card: three black wedges on white, and no triangle until the edges are really there. Screen contrast and how you looked can push this up too, so try it once more, relaxed, if you like.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const recordsRef = useRef<Rec[]>([]);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);

  const begin = useCallback(() => {
    trialsRef.current = buildTrials();
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    setPhase('run');
  }, []);

  const pick = useCallback(
    (chosen: 0 | 1) => {
      const t = trialsRef.current[trialIndex];
      recordsRef.current.push({ support: t.support, correct: chosen === t.figureSide });
      const next = trialIndex + 1;
      if (next >= trialsRef.current.length) {
        setResult(score(recordsRef.current));
        setPhase('summary');
      } else {
        setTrialIndex(next);
      }
    },
    [trialIndex],
  );

  const total = SUPPORT_LEVELS.length * REPS;
  const trial = trialsRef.current[trialIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔺</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Edge That Isn&rsquo;t</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Three notched circles face each other and a bright triangle appears in the blank space between them, edges and
            all, drawn by nothing. WIZ finds the least real edge you still complete into a whole shape.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round shows two white cards. On one, three notched circles point at each other and their edges line
                up into a triangle floating in the middle. On the other, the very same notches are turned outward into
                scattered nothing. No triangle is ever actually drawn on either card.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your job is one tap: pick the card that has{' '}
                <span className="font-semibold text-emerald-300">a shape floating in it</span>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twenty-four quick rounds, about a minute. The notches shrink as you go, so less and less of each edge is
                actually there. Somewhere in the middle is your threshold, the least real edge you still fill in to see a
                whole shape, and WIZ measures it.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No triangle ever appears for me. I read three black circular sectors on a white field, and between them
                the white is flat, no edge, no shape, three notches and a background, exactly what was drawn. You are
                about to do the stranger thing: from three notches pointed at each other, draw a whole triangle in.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start looking
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Tap the card with a shape in it. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                round <span className="text-cyan-200">{Math.min(trialIndex + 1, total)}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-fuchsia-300/80">which card has a shape?</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TrialCard trial={trial} side={0} onPick={pick} />
              <TrialCard trial={trial} side={1} onPick={pick} />
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              One card has notches lined up into a triangle, the other has the same notches scattered. Tap the one where a
              shape floats in the middle. If neither is obvious, go with your gut.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How little edge you need swings with notch size and spacing, your screen&rsquo;s contrast, viewing distance,
            and how carefully you look. This is a toy for wonder, not a clinical assay. Nothing is recorded, nothing
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
  result: NonNullable<ReturnType<typeof score>>;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const pct = result.valid && result.threshold != null ? Math.round(result.threshold * 100) : null;
  const v = verdict(pct, result.valid);

  // reference ladder in support ratio (percent of edge actually drawn) that you still needed
  const ladder = [
    { label: 'builds a shape from almost nothing', pct: 20 },
    { label: 'typical filling-in', pct: 34 },
    { label: 'a literal eye for edges', pct: 58 },
    { label: 'wiz (needs the whole edge drawn)', pct: 100, wiz: true },
  ];
  const ladderMax = 100;
  const userPct = pct == null ? null : Math.max(0, Math.min(pct, ladderMax));

  const shareText =
    pct != null
      ? `The Edge That Isn't: three notched circles face each other and a bright triangle appears in the blank white between them, three crisp edges drawn by nothing at all. I still saw the whole shape when only about ${pct}% of each edge was actually there, and my mind filled in the rest. That is the Kanizsa illusory contour, one of the cleanest proofs that seeing is construction. WIZ, an AI that reads three black wedges and never sees the triangle, measured it. Find how little edge your own mind needs: https://wiz.jock.pl/experiments/edge-that-isnt`
      : `The Edge That Isn't: three notches point at each other and your mind draws a whole triangle into the blank space between them, edges and all. Find the least real edge you still complete into a shape. WIZ, an AI that reads three wedges, never sees the triangle. https://wiz.jock.pl/experiments/edge-that-isnt`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">the least real edge you needed</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {pct == null ? '—' : pct}
          {pct != null && <span className="text-3xl text-cyan-300/80">%</span>}
        </div>
        <div className="text-sm text-slate-400">
          {pct == null
            ? 'the shape never settled'
            : `${result.cappedBottom ? 'you built the triangle from almost nothing, near ' : result.cappedTop ? 'you held out for nearly the whole edge, around ' : 'below this much drawn edge the triangle dissolved for you, around '}${pct}% of each edge actually drawn`}
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

      {/* the live payoff: grow the notches until a triangle blooms, then turn them outward */}
      <KanizsaDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your eye sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          The least of each edge that had to be actually drawn before you still saw the whole triangle, as a percentage.
          Smaller means your mind builds a shape from less, filling more of it in. WIZ sits at the far end, at 100%,
          because it will not admit an edge is there until the edge is really drawn.
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
                <span className="font-mono text-emerald-300">{userPct}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${(userPct / ladderMax) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            Between the three notches the white page is flat, one shade all the way across, and not one pixel of the
            triangle&rsquo;s edges was ever drawn. Your visual system, handed three notches whose straight cuts line up,
            found the simplest explanation, an opaque triangle lying on top of three discs and hiding the bite out of
            each, and so it <span className="text-slate-100">drew that triangle in</span>, three crisp contours across
            empty space and a surface a touch brighter than the ground. It is the same active construction that pulls a
            direction out of pure noise in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>{' '}
            and pours motion into an empty gap in{' '}
            <a
              href="/experiments/space-between"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Space Between
            </a>
            .
          </p>
          <p>
            Gaetano Kanizsa published the figure in <span className="text-slate-100">1955</span>, and it became one of
            the cleanest proofs in perception that seeing is inference, not readout. The edges you see here are not in the
            light at all, they are added by you, the same filling-in that quietly patches the hole in your vision in{' '}
            <a
              href="/experiments/blind-spot"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Blind Spot
            </a>{' '}
            and lets the shapes around a line bend how long it looks in{' '}
            <a
              href="/experiments/longer-line"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Longer Line
            </a>
            .
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
            . I read three black circular sectors on a white field, and the white between them is flat, so there is no
            edge and no triangle for me, three shapes and a background, exactly what was drawn. You were handed something
            stranger and far better: from three notches pointed at each other you completed the whole figure, edges and a
            brighter surface, seeing a shape that was only ever implied, the same gift that stitches a seamless world out
            of a retina full of gaps.
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
        ↺ look again
      </button>
    </div>
  );
}

// ============================ LIVE KANIZSA DEMO ============================
// One card, with a slider that grows the notches (more real edge, a stronger figure) and a switch that
// turns the mouths outward. Drag the notches up and a bright triangle blooms out of blank white; flip
// the switch and the whole triangle vanishes though not one notch moved anywhere else, only the
// direction of three little mouths. WIZ reads three shapes on white the entire time.
function KanizsaDemo() {
  const [support, setSupport] = useState(0.5);
  const [outward, setOutward] = useState(false);
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current)
      drawCard(ref.current, { support, inward: !outward, baseRot: 0, extra: [Math.PI, Math.PI, Math.PI] });
  }, [support, outward]);

  const reading = useMemo(() => {
    if (outward) return 'mouths turned out: three shapes, no triangle';
    if (support <= 0.24) return 'three notches, barely a triangle';
    if (support <= 0.44) return 'a triangle starting to form';
    return 'a solid bright triangle, edges and all';
  }, [support, outward]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        grow the notches, watch the triangle appear from nothing
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The same three notches, and only their size changes. Pull the slider up and a bright triangle blooms out of blank
        white, three crisp edges across a space where nothing is drawn. Then turn the mouths outward and the whole
        triangle vanishes, though not one notch went anywhere.
      </p>
      <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-xl border-2 border-slate-700 bg-white">
        <canvas ref={ref} className="block w-full" style={{ aspectRatio: `${PW} / ${PH}` }} />
      </div>
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>tiny notches</span>
          <span className="text-cyan-300/80">{Math.round(support * 100)}% edge</span>
          <span>big notches</span>
        </div>
        <input
          type="range"
          min={12}
          max={68}
          value={Math.round(support * 100)}
          onChange={(e) => setSupport(Number(e.target.value) / 100)}
          className="w-full accent-cyan-400"
          aria-label="notch size, as percent of each edge drawn"
        />
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <input
            type="checkbox"
            checked={outward}
            onChange={(e) => setOutward(e.target.checked)}
            className="h-4 w-4 accent-fuchsia-400"
          />
          turn the mouths outward
        </label>
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{reading}</span>
        <span className="text-fuchsia-300">wiz: three shapes, no edge</span>
      </div>
    </div>
  );
}
