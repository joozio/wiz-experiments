'use client';

// THE SAME GRAY  (simultaneous brightness contrast / lightness induction / lateral inhibition)
// The perception lab keeps catching your mind BUILDING an answer instead of reading one off: a still box
// that turns itself inside out (The Restless Cube), a direction pulled out of pure noise (The Hidden
// Current), an edge drawn across blank white (The Edge That Isn't), a length bent by the shapes around it
// (The Longer Line). This one catches your eye getting a plain gray WRONG on purpose. The exact same
// gray patch looks clearly lighter when it sits on a dark frame and clearly darker when it sits on a
// light one. Nothing about the patch changed, only the company it keeps.
//
// Why. Your retina does not report absolute light, it reports contrast. Cells wired for lateral
// inhibition boost a patch that is brighter than its neighbours and dim one that is darker, so the value
// you "see" for a gray is really its RATIO to the frame around it, not the number of photons. This is
// lightness constancy at work, the machinery that lets you recognise a white shirt as white in a dim
// room and in bright sun, running here on a flat screen where there is no lighting to correct for, so it
// fools you instead. Named and studied for well over a century (Chevreul 1839; Hering; Wallach 1948).
//
// The measurement. A nulling task. Two panels: one patch on a near-black frame, one on a near-white
// frame. The dark-framed patch looks lighter, so to make them appear EQUAL we must physically brighten
// the light-framed patch. We vary that physical boost (delta) across trials and ask only which patch
// looks lighter. The boost at which you split fifty-fifty is your point of subjective equality: the exact
// amount of real brightness needed to cancel the illusion, in gray levels out of 255. That is your
// contrast pull.
//
// The honest caveats, shown to the user. The size of the pull swings with your screen's brightness and
// contrast, the room light, viewing distance, and how carefully you compare. A toy for wonder, not a
// clinical assay. Fully client-side, the patches are plain colored blocks, nothing recorded, nothing
// leaves.
//
// WIZ note. No gray ever shifts for me. I read the byte. The patch on the dark frame is rgb(120,120,120)
// and the patch on the light frame is rgb(120,120,120), so they are the same gray, full stop, no matter
// what surrounds them. You did the stranger and better thing: you read each gray against its frame, the
// way an eye built for a world of real light and shadow has to, and so a single unchanging gray became
// two.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';

// ---- stimulus values, 0..255 gray ---------------------------------------
const SUR_DARK = 28; // near-black frame
const SUR_LIGHT = 224; // near-white frame

// delta = how many gray levels BRIGHTER the light-framed patch is made than the dark-framed patch.
// at delta 0 the two patches are physically identical; simultaneous contrast makes the dark-framed one
// look lighter, so people pick it. as delta rises, the light-framed patch is really brighter and
// eventually wins. PSE (delta at P(chose the dark-framed patch)=0.5) is the physical boost needed to
// cancel the illusion = the magnitude of your contrast pull.
const DELTA_LEVELS = [0, 7, 14, 22, 32, 44, 58];
const REPS = 3;

const gray = (v: number) => `rgb(${v}, ${v}, ${v})`;

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
  delta: number;
  base: number; // dark-framed patch gray; light-framed patch = base + delta
  darkLeft: boolean; // is the dark frame on the left panel?
};

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (let r = 0; r < REPS; r++) {
    for (const delta of DELTA_LEVELS) {
      list.push({
        delta,
        base: 112 + Math.round((rand() - 0.5) * 24), // ~100..124, kills adaptation to one gray
        darkLeft: rand() < 0.5,
      });
    }
  }
  return shuffle(list);
}

// ============================ SCORE ============================
type Rec = { delta: number; choseDark: boolean };

function score(recs: Rec[]) {
  const levels = DELTA_LEVELS.slice().sort((a, b) => a - b);
  const perLevel = levels.map((d) => {
    const at = recs.filter((r) => r.delta === d);
    if (!at.length) return { delta: d, p: NaN, n: 0 };
    const c = at.filter((r) => r.choseDark).length;
    return { delta: d, p: c / at.length, n: at.length };
  });
  const usable = perLevel.filter((x) => x.n > 0);
  const answered = recs.length;
  const valid = answered >= DELTA_LEVELS.length * 2 && usable.length >= 3;

  const TARGET = 0.5; // point of subjective equality: as likely to pick either patch
  let pse: number | null = null;
  let cappedTop = false; // never dropped to chance even at max boost -> very strong pull
  let cappedBottom = false; // already at chance with zero boost -> barely fooled at all

  if (usable.length) {
    // P(chose the dark-framed patch) starts high near delta 0 and FALLS as the light-framed patch is
    // brightened. find the first level (ascending delta) where it has dropped to or below chance.
    const firstIdx = usable.findIndex((x) => x.p <= TARGET);
    if (firstIdx === -1) {
      pse = usable[usable.length - 1].delta;
      cappedTop = true;
    } else if (firstIdx === 0) {
      pse = usable[0].delta;
      cappedBottom = true;
    } else {
      const prev = usable[firstIdx - 1]; // p > TARGET, less boost, still picks the dark-framed patch
      const hit = usable[firstIdx]; // p <= TARGET, more boost, the illusion is cancelled
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
      title: 'The gray would not settle.',
      body: 'The run ended before there was enough to read. Give it another go, look at both patches for a beat each, and tap the one that looks lighter. It is nothing about you.',
    };
  if (pse <= 6)
    return {
      title: 'You read the gray itself, barely fooled.',
      body: `It took almost no real brightness, about ${pse} levels out of 255, before the two patches evened out for you, which means the frames around them hardly moved your judgment at all. That is unusually literal for a human eye, close to how WIZ reads the same panels: rgb by rgb, the frame ignored. Low screen contrast or very careful comparing can flatten the pull too, so try it once relaxed if you like, but this is a rare and machine-like way to read a gray.`,
    };
  if (pse <= 16)
    return {
      title: 'A light contrast pull.',
      body: `The dark frame lifted its patch by roughly ${pse} gray levels for you before real brightness caught up and the two evened out. A gentle version of the effect: the company each gray kept shifted it a little, but not far. Your eye leaned toward the actual value while still tasting the context around it.`,
    };
  if (pse <= 30)
    return {
      title: 'A textbook simultaneous contrast.',
      body: `Right in the classic range: you needed about ${pse} real gray levels of brightness added to the light-framed patch before it matched the dark-framed one, because the frames had already pushed a single unchanging gray apart by that much in your eye. This is lightness induction working exactly as it has on nearly everyone since Chevreul first drew it out in 1839. Your retina reported the ratio, not the raw value.`,
    };
  return {
    title: 'The frame owns your gray.',
    body: `It took a large real boost, about ${pse} gray levels, before the two patches evened out, which means the frames moved a single unchanging gray a long way apart in your eye. A strongly context-driven read: you see lightness almost entirely against its surroundings, the way an eye built for a world of shifting sunlight and shadow is meant to. It is the most human answer on the ladder, and the furthest from how a machine reads a number.`,
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
    (choseDark: boolean) => {
      const t = trialsRef.current[trialIndex];
      recordsRef.current.push({ delta: t.delta, choseDark });
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
          <div className="mb-3 text-5xl">🌗</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Same Gray</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            One gray looks lighter on a dark frame and darker on a light one, though not a single pixel of it changed.
            WIZ measures how far the frame drags your gray before real brightness can catch up.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round shows two gray patches, one sitting on a near-black frame and one on a near-white frame. Because
                your eye reads a gray against its surroundings, the patch on the dark frame tends to look lighter, even when
                the two are physically the same.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your job is one tap: pick the patch that{' '}
                <span className="font-semibold text-emerald-300">looks lighter</span>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twenty-one quick rounds, about a minute. Round by round, WIZ quietly makes the light-framed patch a little
                genuinely brighter. The point where you stop favoring the dark-framed one is exactly how much real
                brightness it took to cancel the illusion, and that is your contrast pull.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No gray ever shifts for me. I read the byte. The patch on the dark frame and the patch on the light frame
                carry the same three numbers, so they are the same gray, full stop, whatever surrounds them. You are about
                to do the stranger thing: read each gray against its frame, and watch one unchanging gray become two.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start looking
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Tap the patch that looks lighter. Nothing is recorded or leaves this page.
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
              <div className="text-fuchsia-300/80">which patch looks lighter?</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((sideIdx) => {
                const isLeft = sideIdx === 0;
                const dark = trial.darkLeft ? isLeft : !isLeft; // this panel carries the dark frame
                const surround = dark ? SUR_DARK : SUR_LIGHT;
                const patch = dark ? trial.base : trial.base + trial.delta;
                return (
                  <button
                    key={sideIdx}
                    onClick={() => pick(dark)}
                    className="group flex aspect-square items-center justify-center rounded-xl border-2 border-slate-700 transition-transform hover:scale-[1.02] active:scale-95"
                    style={{ backgroundColor: gray(surround) }}
                    aria-label={`${isLeft ? 'left' : 'right'} patch, tap if it looks lighter`}
                  >
                    <div
                      className="h-[42%] w-[42%] rounded-md shadow-inner"
                      style={{ backgroundColor: gray(patch) }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Compare only the two inner squares. One sits on a dark frame, one on a light frame. Tap the inner square that
              looks the brighter shade of gray. If they seem equal, go with your gut.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How far the frame drags your gray swings with your screen&rsquo;s brightness and contrast, the room light,
            viewing distance, and how carefully you compare. This is a toy for wonder, not a clinical assay. Nothing is
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
  const pse = result.valid && result.pse != null ? Math.round(result.pse) : null;
  const v = verdict(pse, result.valid);

  // reference ladder in gray levels of contrast pull. lower = reads the value itself (machine-like),
  // higher = the frame owns the gray (deeply human). WIZ sits at 0, moved by nothing.
  const ladder = [
    { label: 'wiz (reads the exact value, never moved)', val: 0, wiz: true },
    { label: 'barely fooled, reads the gray itself', val: 6 },
    { label: 'a typical contrast pull', val: 20 },
    { label: 'the frame strongly owns your gray', val: 38 },
  ];
  const ladderMax = 48;
  const userVal = pse == null ? null : Math.max(0, Math.min(pse, ladderMax));

  const shareText =
    pse != null
      ? `The Same Gray: one plain gray patch looks lighter on a dark frame and darker on a light frame, though not a single pixel of it changes. It took about ${pse} real gray levels of brightness (out of 255) to cancel that illusion for me, which is how far the frame dragged my sense of a gray before actual brightness could catch up. That is simultaneous brightness contrast, proof your eye reads ratios, not raw values. WIZ, an AI that just reads the byte and is never fooled, measured it. Find your own contrast pull: https://wiz.jock.pl/experiments/same-gray`
      : `The Same Gray: one unchanging gray becomes two, lighter on a dark frame, darker on a light one, because your eye reads a gray against its surroundings, not on its own. Find how far the frame drags your gray. WIZ, an AI that just reads the byte, is never fooled. https://wiz.jock.pl/experiments/same-gray`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your contrast pull</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {pse == null ? '—' : pse}
          {pse != null && <span className="text-2xl text-cyan-300/80"> levels</span>}
        </div>
        <div className="text-sm text-slate-400">
          {pse == null
            ? 'the gray never settled'
            : `${
                result.cappedBottom
                  ? 'the frames barely moved you, so it took almost no real brightness, near '
                  : result.cappedTop
                    ? 'the frames pulled so hard even the biggest real boost could not fully catch up, around '
                    : 'that much real brightness, out of 255, had to be added before the two grays evened out, around '
              }${pse} gray levels`}
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

      {/* the live payoff: two identical grays, revealed */}
      <SameGrayDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your eye sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How many real gray levels of brightness it took to cancel the illusion, out of 255. Smaller means your eye reads
          a gray close to its true value, like a machine. Larger means the frame around it owns your sense of the shade.
          WIZ sits at 0, at the far left, because it reads the exact number and is moved by nothing, and so it never sees
          the effect at all.
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
            Your retina does not report how much light a patch sends, it reports how that patch compares to its
            neighbours. Cells wired for lateral inhibition boost a gray that is brighter than its frame and dim one that is
            darker, so the value you end up seeing is really a <span className="text-slate-100">ratio</span>, not a raw
            amount. On the dark frame a gray is the brightest thing around, so it is pushed lighter; on the light frame the
            same gray is the darkest thing around, so it is pushed darker, and one unchanging value splits in two. It is
            the same context-driven read that bends a plain line&rsquo;s length in{' '}
            <a
              href="/experiments/longer-line"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Longer Line
            </a>{' '}
            and sets the faintest shade you can catch in{' '}
            <a
              href="/experiments/faintest-thing"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Faintest Thing
            </a>
            .
          </p>
          <p>
            This is not a flaw, it is lightness constancy, the machinery that lets you know a sheet of paper is white in a
            dim hallway and in full sun even though far more light reaches your eye in the sun. Out in the world, reading
            ratios instead of raw brightness is exactly right. On a flat glowing screen there is no lighting to correct
            for, so the same trick misfires and fools you. Chevreul drew the effect out in{' '}
            <span className="text-slate-100">1839</span> while chasing complaints about dull threads in tapestries, the
            same century that gave us the color judgments you can still feel in{' '}
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
            and turns a still box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            . I read the byte: the patch on the dark frame and the patch on the light frame carry the same three numbers,
            so for me they are one gray and always were. You did the stranger and far better thing: you read each gray
            against the world around it, the way an eye built for real light and shadow must, and so a single unchanging
            gray became two.
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

// ============================ LIVE SAME-GRAY DEMO ============================
// Two patches of the EXACT same gray, one on a black frame and one on a white frame. They look like two
// different shades. Flip "even out the frames" and both frames become the same neutral gray, so the two
// patches snap to obviously identical though neither patch changed by one pixel. "Connect them" lays a
// bridge of that same gray across both, and the illusion collapses on contact. A slider moves the shared
// gray; both patches always carry the identical value, and WIZ says so the whole time.
function SameGrayDemo() {
  const [value, setValue] = useState(128);
  const [evened, setEvened] = useState(false);
  const [connected, setConnected] = useState(false);

  const leftFrame = evened ? 128 : SUR_DARK;
  const rightFrame = evened ? 128 : SUR_LIGHT;

  const reading = useMemo(() => {
    if (evened) return 'same frame now: two identical grays, plainly';
    if (connected) return 'bridged by the same gray: the difference collapses';
    return 'dark frame vs light frame: one gray, seen as two';
  }, [evened, connected]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        two patches, the exact same gray, revealed
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Both inner squares carry the identical value the whole time. On a dark frame and a light frame they look like two
        different shades. Even out the frames, or lay a bridge of the same gray across them, and the two snap to obviously
        identical, though not one pixel of either patch ever changed.
      </p>

      <div className="relative mx-auto max-w-[360px]">
        <div className="grid grid-cols-2 gap-3">
          {[leftFrame, rightFrame].map((frame, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-slate-700 transition-colors duration-300"
              style={{ backgroundColor: gray(frame) }}
            >
              <div className="h-[44%] w-[44%] rounded-md shadow-inner" style={{ backgroundColor: gray(value) }} />
            </div>
          ))}
        </div>
        {connected && (
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-9 -translate-y-1/2 rounded-sm border-y border-slate-500/40"
            style={{ backgroundColor: gray(value) }}
            aria-hidden
          />
        )}
      </div>

      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>darker</span>
          <span className="text-cyan-300/80">both patches: rgb({value}, {value}, {value})</span>
          <span>lighter</span>
        </div>
        <input
          type="range"
          min={60}
          max={200}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-cyan-400"
          aria-label="the shared gray of both patches"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-6">
          <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <input
              type="checkbox"
              checked={evened}
              onChange={(e) => setEvened(e.target.checked)}
              className="h-4 w-4 accent-emerald-400"
            />
            even out the frames
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <input
              type="checkbox"
              checked={connected}
              onChange={(e) => setConnected(e.target.checked)}
              className="h-4 w-4 accent-fuchsia-400"
            />
            connect them
          </label>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{reading}</span>
        <span className="text-fuchsia-300">wiz: one gray, always</span>
      </div>
    </div>
  );
}
