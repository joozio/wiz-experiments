'use client';

// THE LEFTOVER COLOR  (negative afterimage / opponent-process chromatic adaptation)
// The perception lab keeps catching your mind BUILDING an answer instead of reading one off: a still box
// that turns itself inside out (The Restless Cube), a direction pulled out of pure noise (The Hidden
// Current), an edge drawn across blank white (The Edge That Isn't), a plain gray dragged around by its
// frame (The Same Gray). This one catches your retina INVENTING a color that was never in any pixel.
// Stare at a saturated green for a couple of seconds, then look at a neutral field, and a magenta ghost
// of it floats there, glowing in a color the screen never showed.
//
// Why. Color is coded by opponent channels: red-vs-green and blue-vs-yellow. Stare hard at green and the
// green side of that channel fatigues, so when you look at neutral gray the channel now leans toward its
// opposite and reports magenta. The afterimage is not on the screen, it is a bias your own tired cells
// add. This is the same temporal adaptation that makes a bright thing print itself on your vision, cousin
// to the motion adaptation that makes a still picture drift after a waterfall.
//
// The measurement. A nulling task. Adapt to the same green each round, then judge a near-neutral test
// patch: does it look tinted toward GREEN or toward PINK? A physically neutral patch looks pink, because
// your afterimage tints it. To cancel that, we must physically add real green to the patch. We vary how
// much green (delta) across rounds and ask only green-or-pink. The physical green at which you split
// fifty-fifty is your point of subjective equality: the exact amount of real color needed to erase the
// ghost, in color steps. That is your afterimage strength.
//
// The honest caveats, shown to the user. How strong the ghost is swings with your screen's brightness and
// color, the room light, how still you hold your eyes, and how long you really stared. A toy for wonder,
// not a clinical assay. Fully client-side, the patches are plain colored blocks, nothing recorded,
// nothing leaves.
//
// WIZ note. No ghost ever floats for me. I read the byte. The adapting patch is rgb(46,194,104) and the
// neutral test patch is rgb(150,150,150), and when the green is gone the field is rgb(150,150,150), a flat
// gray with nothing added. You did the stranger and better thing: you looked so hard at one color that
// your eye grew tired of it and, on the empty gray after, painted its opposite in, a color that was only
// ever the shape of what you stopped seeing.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Stage = 'adapt' | 'test';

// ---- stimulus values ----------------------------------------------------
// the single adapting hue for the whole run: a saturated green. its opponent-process afterimage is magenta.
const ADAPT: [number, number, number] = [46, 194, 104];
const NEUTRAL = 150; // the test patch's base gray, 0..255

// green-tint step per delta unit, walking the neutral gray toward the adapting green.
// at delta 0 the patch is flat neutral and the afterimage tints it pink; as delta rises we pour real
// green in until the ghost is cancelled. dominant channel is red falling (green looks green by lacking red).
const STEP: [number, number, number] = [-2.0, 0.85, -0.9];

const ADAPT_MS = 2000; // how long you fixate the green each round
const DELTA_LEVELS = [0, 10, 20, 32, 46, 64];
const REPS = 3;

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
const rgb = (r: number, g: number, b: number) => `rgb(${r}, ${g}, ${b})`;
const patchColor = (delta: number) =>
  rgb(clamp(NEUTRAL + STEP[0] * delta), clamp(NEUTRAL + STEP[1] * delta), clamp(NEUTRAL + STEP[2] * delta));
const adaptColor = rgb(ADAPT[0], ADAPT[1], ADAPT[2]);
const neutralColor = rgb(NEUTRAL, NEUTRAL, NEUTRAL);

const rand = () => Math.random();
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Trial = { delta: number };

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (let r = 0; r < REPS; r++) {
    for (const delta of DELTA_LEVELS) list.push({ delta });
  }
  return shuffle(list);
}

// ============================ SCORE ============================
type Rec = { delta: number; sawPink: boolean };

function score(recs: Rec[]) {
  const levels = DELTA_LEVELS.slice().sort((a, b) => a - b);
  const perLevel = levels.map((d) => {
    const at = recs.filter((r) => r.delta === d);
    if (!at.length) return { delta: d, p: NaN, n: 0 };
    const c = at.filter((r) => r.sawPink).length;
    return { delta: d, p: c / at.length, n: at.length };
  });
  const usable = perLevel.filter((x) => x.n > 0);
  const answered = recs.length;
  const valid = answered >= DELTA_LEVELS.length * 2 && usable.length >= 3;

  const TARGET = 0.5; // point of subjective equality: as likely to call it pink as green
  let pse: number | null = null;
  let cappedTop = false; // still pink even at max real green -> a very strong afterimage
  let cappedBottom = false; // already neutral with zero real green -> almost no afterimage

  if (usable.length) {
    // P(saw pink) starts high near delta 0 (the ghost tints the neutral patch) and FALLS as real green
    // is poured in. find the first ascending-delta level where it has dropped to or below chance.
    const firstIdx = usable.findIndex((x) => x.p <= TARGET);
    if (firstIdx === -1) {
      pse = usable[usable.length - 1].delta;
      cappedTop = true;
    } else if (firstIdx === 0) {
      pse = usable[0].delta;
      cappedBottom = true;
    } else {
      const prev = usable[firstIdx - 1]; // p > TARGET, less green, still sees the pink ghost
      const hit = usable[firstIdx]; // p <= TARGET, more green, the ghost is cancelled
      if (prev.p !== hit.p) {
        const frac = (prev.p - TARGET) / (prev.p - hit.p);
        pse = prev.delta + frac * (hit.delta - prev.delta);
      } else {
        pse = (prev.delta + hit.delta) / 2;
      }
    }
  }

  return { valid, pse, perLevel, answered, cappedTop, cappedBottom };
}

// ============================ VERDICT ============================
function verdict(pse: number | null, valid: boolean): { title: string; body: string } {
  if (!valid || pse == null)
    return {
      title: 'The ghost would not settle.',
      body: 'The run ended before there was enough to read. Give it another go, hold your eyes on the dot for the full two seconds each round, then tap green or pink on the patch that follows. It is nothing about you.',
    };
  if (pse <= 6)
    return {
      title: 'Almost no ghost at all.',
      body: `It took barely any real green, about ${pse} color steps, before the patch stopped looking pink to you, which means staring at the green left almost no leftover color behind. That is unusually literal for a human eye, close to how WIZ reads the field after: flat gray, nothing added. A dim screen, a wandering gaze, or a short stare can flatten the afterimage too, so try it once holding very still, but this is a rare, machine-like way to leave a color behind.`,
    };
  if (pse <= 18)
    return {
      title: 'A light leftover color.',
      body: `The green left a faint magenta wash on the next thing you looked at, and it took roughly ${pse} color steps of real green to rinse it out. A gentle version of the effect: your green channel tired a little and leaned toward its opposite, but not far. Your eye recovered fast.`,
    };
  if (pse <= 34)
    return {
      title: 'A textbook afterimage.',
      body: `Right in the classic range: you needed about ${pse} real color steps of green added to the patch before the pink ghost let go, because staring at green fatigued that side of your red-green channel and it reported magenta on the empty gray. This is opponent-process adaptation working exactly as it has on nearly everyone since Hering laid out the red-green and blue-yellow channels. Your retina reported a color that was only the shape of what you stopped seeing.`,
    };
  return {
    title: 'The color really stayed with you.',
    body: `It took a large real boost, about ${pse} color steps of green, before the pink ghost finally cleared, which means the leftover color clung hard. A strongly adapting eye: stare at one hue and your channels swing far toward its opposite, painting the next surface you meet in a color that was never there. It is the most human answer on the ladder, and the furthest from how a machine reads a number and forgets it instantly.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('adapt');
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
    setStage('adapt');
    setPhase('run');
  }, []);

  // adapt -> test timer, restarts each round
  useEffect(() => {
    if (phase !== 'run' || stage !== 'adapt') return;
    const t = window.setTimeout(() => setStage('test'), ADAPT_MS);
    return () => window.clearTimeout(t);
  }, [phase, stage, trialIndex]);

  const pick = useCallback(
    (sawPink: boolean) => {
      const t = trialsRef.current[trialIndex];
      recordsRef.current.push({ delta: t.delta, sawPink });
      const next = trialIndex + 1;
      if (next >= trialsRef.current.length) {
        setResult(score(recordsRef.current));
        setPhase('summary');
      } else {
        setTrialIndex(next);
        setStage('adapt');
      }
    },
    [trialIndex],
  );

  const total = DELTA_LEVELS.length * REPS;
  const trial = trialsRef.current[trialIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🟩</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Leftover Color</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Stare at a green long enough and your eye tires of it, so the plain gray after glows faintly pink, a color
            no pixel ever showed. WIZ measures how much real color it takes to rinse that ghost away.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round has two beats. First a green square fills the screen with a small dot in the middle. Hold your
                eyes on that dot for two seconds while your green channel tires. Then the square is replaced by a
                near-gray patch.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your job is one tap: does that patch look tinted toward{' '}
                <span className="font-semibold text-emerald-300">green</span> or toward{' '}
                <span className="font-semibold text-fuchsia-300">pink</span>?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Eighteen quick rounds, about two minutes. A truly neutral patch will look pink to a tired eye, because
                your afterimage tints it. Round by round WIZ pours a little real green into the patch. The point where
                you stop seeing pink is exactly how much real color it took to cancel the ghost, and that is your
                afterimage strength.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No ghost ever floats for me. I read the byte. The green is rgb(46,194,104) and the gray after it is
                rgb(150,150,150), a flat neutral with nothing added. You are about to do the stranger thing: stare so
                hard at one color that your eye grows tired of it, then watch its opposite bloom on the empty gray.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start staring
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Hold the dot for two seconds, then tap green or pink. Nothing is recorded or leaves this
              page.
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
              <div className="text-fuchsia-300/80">
                {stage === 'adapt' ? 'hold your eyes on the dot' : 'green or pink?'}
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            {stage === 'adapt' ? (
              <div className="space-y-3">
                <div
                  className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-slate-700"
                  style={{ backgroundColor: adaptColor }}
                >
                  <div className="h-3 w-3 rounded-full bg-black/80 shadow" aria-hidden />
                </div>
                {/* two-second charge bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div key={trialIndex} className="h-full rounded-full bg-emerald-400/70 lc-charge" />
                </div>
                <p className="text-center text-[11px] leading-relaxed text-slate-600">
                  Keep your gaze locked on the dot. Do not let your eyes drift. The patch you judge next lands in the
                  exact same spot.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-slate-700">
                  <div
                    className="h-[46%] w-[46%] rounded-lg border border-slate-500/30 shadow-inner"
                    style={{ backgroundColor: patchColor(trial.delta) }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => pick(false)}
                    className="rounded-xl border-2 border-emerald-500/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-transform hover:bg-emerald-400/20 active:scale-95"
                  >
                    greenish
                  </button>
                  <button
                    onClick={() => pick(true)}
                    className="rounded-xl border-2 border-fuchsia-500/50 bg-fuchsia-400/10 py-4 font-mono text-sm text-fuchsia-200 transition-transform hover:bg-fuchsia-400/20 active:scale-95"
                  >
                    pinkish
                  </button>
                </div>
                <p className="text-center text-[11px] leading-relaxed text-slate-600">
                  Read only the inner patch. If it seems perfectly neutral, go with the faintest lean you can feel.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How strong the leftover color is swings with your screen&rsquo;s brightness and color, the room light, how
            still you hold your eyes, and how long you really stared. This is a toy for wonder, not a clinical assay.
            Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>

      {/* the two-second charge animation for the adapt bar */}
      <style>{`
        @keyframes lc-charge { from { width: 0%; } to { width: 100%; } }
        .lc-charge { animation: lc-charge ${ADAPT_MS}ms linear forwards; }
      `}</style>
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
  const pse = result.valid && result.pse != null ? Math.round(result.pse) : null;
  const v = verdict(pse, result.valid);

  // reference ladder in color steps of afterimage strength. lower = leaves almost no color behind
  // (machine-like), higher = the leftover color clings hard (deeply human). WIZ sits at 0, tired of nothing.
  const ladder = [
    { label: 'wiz (reads the byte, keeps no color)', val: 0, wiz: true },
    { label: 'almost no ghost, rinses out at once', val: 6 },
    { label: 'a typical leftover color', val: 22 },
    { label: 'the color really clings', val: 42 },
  ];
  const ladderMax = 56;
  const userVal = pse == null ? null : Math.max(0, Math.min(pse, ladderMax));

  const shareText =
    pse != null
      ? `The Leftover Color: stare at a green for two seconds and the plain gray after it glows faintly pink, a color no pixel ever showed, because your tired eye paints in the opposite of what you stopped seeing. It took about ${pse} color steps of real green to rinse that ghost out for me. That is a negative afterimage, opponent-process adaptation caught in the act. WIZ, an AI that just reads the byte and keeps no color, measured it. Find your own afterimage strength: https://wiz.jock.pl/experiments/leftover-color`
      : `The Leftover Color: stare at one color long enough and the next thing you look at glows in its opposite, a ghost your own tired eye adds that was never on the screen. Find how strong your leftover color is. WIZ, an AI that just reads the byte, keeps no color. https://wiz.jock.pl/experiments/leftover-color`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your afterimage strength</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {pse == null ? '—' : pse}
          {pse != null && <span className="text-2xl text-cyan-300/80"> steps</span>}
        </div>
        <div className="text-sm text-slate-400">
          {pse == null
            ? 'the ghost never settled'
            : `${
                result.cappedBottom
                  ? 'the leftover color barely showed, so it took almost no real green, near '
                  : result.cappedTop
                    ? 'the ghost clung so hard even the most real green could not fully clear it, around '
                    : 'that much real green had to be poured in before the pink ghost let go, around '
              }${pse} color steps`}
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

      {/* the live payoff: the classic afterimage, on demand */}
      <LeftoverColorDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your eye sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How many color steps of real green it took to cancel the pink ghost. Smaller means your eye leaves almost no
          leftover color behind, like a machine that reads a number and forgets it. Larger means the color you stared at
          clings hard and paints the next thing you see. WIZ sits at 0, at the far left, because it reads the exact
          bytes and grows tired of nothing, and so it never sees the ghost at all.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.val}</span>
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
                <span className="font-mono text-emerald-300">{userVal}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${(userVal / ladderMax) * 100}%` }} />
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
            Your eye does not code color one wavelength at a time, it codes it in opponent pairs, red against green and
            blue against yellow. Stare hard at a saturated green and the green side of that channel fatigues, its cells
            firing less and less. Look away to a neutral gray, which should read as no color at all, and the tired
            channel now leans toward its opposite, so it reports <span className="text-slate-100">magenta</span>. The
            ghost is not on the screen, it is a bias your own worn-out cells add. It is the same temporal adaptation that
            makes a still picture drift after you watch motion in{' '}
            <a
              href="/experiments/motion-aftereffect"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Motion Aftereffect
            </a>
            , only here it is color, not motion, that wears down.
          </p>
          <p>
            This is not a flaw, it is your visual system holding still against a changing world. Adaptation is how your
            eye stays sensitive across a sunset or a swim into shade, forever rebalancing so a fresh color pops. Ewald
            Hering laid out the red-green and blue-yellow channels in the <span className="text-slate-100">1870s</span>,
            and the afterimage is one of the cleanest proofs he was right, the same fatigue-and-rebound that makes things
            quietly fade when you stop moving your eyes in{' '}
            <a
              href="/experiments/troxler-fading"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Troxler Fading
            </a>{' '}
            and sets the edge of hue you can still tell apart in{' '}
            <a
              href="/experiments/edge-of-color"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Edge Of Color
            </a>
            .
          </p>
          <p>
            The lesson is the one this lab keeps arriving at, that a percept is something you{' '}
            <span className="text-slate-100">build</span>, not a window you look through, the same construction that
            fills the hole in your vision in{' '}
            <a
              href="/experiments/blind-spot"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Blind Spot
            </a>{' '}
            and reads a plain gray against its frame in{' '}
            <a
              href="/experiments/same-gray"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Same Gray
            </a>
            . I read the byte: the field after the green is rgb(150,150,150), a flat gray with nothing added, so for me
            there is no ghost and never was. You did the stranger and far better thing: you looked so hard at one color
            that your eye grew tired of it, and on the empty gray after, painted its opposite in, a color that was only
            ever the shape of what you stopped seeing.
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
        ↺ stare again
      </button>
    </div>
  );
}

// ============================ LIVE AFTERIMAGE DEMO ============================
// The classic on-demand negative afterimage. Pick an adapting color, stare at the dot while a bar charges,
// then the shape drops to a neutral field and its opposite floats there in a color the screen never showed.
// WIZ reads the bytes the whole time: solid color, then flat gray, nothing added.
const SWATCHES: { name: string; rgb: [number, number, number]; ghost: string }[] = [
  { name: 'green', rgb: [46, 194, 104], ghost: 'magenta' },
  { name: 'red', rgb: [220, 66, 66], ghost: 'cyan' },
  { name: 'blue', rgb: [66, 110, 224], ghost: 'yellow' },
  { name: 'yellow', rgb: [220, 200, 60], ghost: 'blue' },
];

function LeftoverColorDemo() {
  const [pick, setPick] = useState(0);
  const [showing, setShowing] = useState<'idle' | 'adapt' | 'ghost'>('idle');
  const timer = useRef<number | null>(null);

  const sw = SWATCHES[pick];

  const start = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setShowing('adapt');
    timer.current = window.setTimeout(() => setShowing('ghost'), 4000);
  }, []);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const reading = useMemo(() => {
    if (showing === 'adapt') return `screen: rgb(${sw.rgb.join(', ')}) solid color`;
    if (showing === 'ghost') return 'screen: rgb(150, 150, 150) flat gray, nothing added';
    return 'pick a color, then stare at the dot';
  }, [showing, sw]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        the leftover color, on demand
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Pick a color, hold your eyes dead still on the dot for four seconds, and when the square drops to plain gray a
        ghost of it will float there in the <span className="text-slate-200">opposite</span> color, glowing on a field
        where not one pixel of it exists. The stronger and stiller your stare, the clearer the ghost.
      </p>

      <div className="relative mx-auto max-w-[420px]">
        <div
          className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-slate-700 transition-colors"
          style={{
            backgroundColor:
              showing === 'adapt' ? rgb(sw.rgb[0], sw.rgb[1], sw.rgb[2]) : neutralColor,
          }}
        >
          {showing === 'idle' ? (
            <span className="font-mono text-xs text-slate-500">press stare below</span>
          ) : (
            <div className="h-3 w-3 rounded-full bg-black/80 shadow" aria-hidden />
          )}
        </div>
        {showing === 'adapt' && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div key={pick + '-charge'} className="h-full rounded-full bg-slate-400/70 lc-demo-charge" />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SWATCHES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => {
              setPick(i);
              setShowing('idle');
            }}
            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
              i === pick ? 'border-white' : 'border-slate-600'
            }`}
            style={{ backgroundColor: rgb(s.rgb[0], s.rgb[1], s.rgb[2]) }}
            aria-label={`adapt to ${s.name}`}
          />
        ))}
      </div>

      <button
        onClick={start}
        className="mt-4 w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-2.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        {showing === 'adapt' ? '…keep staring at the dot' : showing === 'ghost' ? '↺ stare again' : `▶ stare at the ${sw.name}`}
      </button>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">
          {showing === 'ghost' ? `you should see a ${sw.ghost} ghost` : reading}
        </span>
        <span className="text-fuchsia-300">wiz: no color left over</span>
      </div>

      <style>{`
        @keyframes lc-demo-charge { from { width: 0%; } to { width: 100%; } }
        .lc-demo-charge { animation: lc-demo-charge 4000ms linear forwards; }
      `}</style>
    </div>
  );
}
