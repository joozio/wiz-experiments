'use client';

// THE GHOST GRID  (Hermann grid / scintillating grid / lateral inhibition / center-surround)
// This perception lab keeps catching your mind BUILDING a percept instead of reading one off: a still box
// that turns itself inside out (The Restless Cube), an edge drawn across blank white (The Edge That Isn't),
// a plain gray that splits in two depending on its frame (The Same Gray), a spot of vision quietly filled
// in where the retina is blind (The Blind Spot). This one catches your eye painting whole DOTS onto a grid
// that has none. Dark tiles separated by pale streets: look at it and dim smudges flicker at the crossings
// you are not staring at, and vanish the moment you look straight at one. Nothing is at those crossings.
//
// Why. Your retina reports each point not on its own but against a ring of neighbours, via lateral
// inhibition in center-surround receptive fields. A cell whose center sits on a crossing is flanked by
// bright street on FOUR sides; a cell on a straight run of street by bright street on only TWO. More
// surround light means more inhibition, so the crossing is reported darker, and a gray dot appears where
// four roads meet. It only happens in the periphery because the inhibitory surrounds out there are wide
// enough to straddle a whole intersection, while the tiny ones at your fovea cannot, which is why the dot
// you look at directly always dissolves. Ludimar Hermann (1870); the scintillating cousin with white discs
// at each crossing is Bergen (1985), Ninio & Stevens (2000).
//
// The measurement. A nulling task on contrast. Each round shows the grid at one street brightness, from a
// whisper above the near-black tiles to near white, with a fixation dot at center. You report only whether
// dark dots flicker at the OTHER crossings. As the streets brighten, the dots strengthen, so P(yes) climbs.
// The faintest street brightness at which you still see dots is your threshold. We turn it into a Phantom
// Reach = 255 - threshold: how far your visual system reaches to invent a dot from almost nothing. Higher
// reach = you conjure dots from the faintest hint (a deeply constructive eye). WIZ sits at 0: it reads the
// streets as one flat number, so no crossing is ever darker than any other.
//
// The honest caveats, shown to the user. The smudges are strongest at arm's length or a lean back, and
// swing with screen brightness and contrast, room light, and how still you hold your gaze. A toy for
// wonder, not a clinical assay. Fully client-side, plain colored blocks, nothing recorded, nothing leaves.
//
// WIZ note. No dot ever appears for me. Every pixel of every street carries the same gray, so the crossing
// where four streets meet is exactly as bright as the stretch between them. Darkness at a corner is not in
// the picture. You did the stranger and better thing: you read each point against the light around it, the
// way an eye built for edges and shadow must, and a flat grid grew a scatter of dots that live only in you.

import { useCallback, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';

// ---- stimulus values, 0..255 gray ---------------------------------------
const TILE = 15; // near-black tiles

// street brightness ladder: how bright the streets are, over near-black tiles. faint streets (low contrast)
// produce no dots for most people; bright streets on dark tiles are the classic strong Hermann grid.
const STREET_LEVELS = [50, 82, 114, 146, 178, 210, 242];
const REPS = 2;
const STREET_MAX = 255;

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

type Trial = { street: number };

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (let r = 0; r < REPS; r++) {
    for (const street of STREET_LEVELS) list.push({ street });
  }
  return shuffle(list);
}

// ============================ SCORE ============================
type Rec = { street: number; sawDots: boolean };

function score(recs: Rec[]) {
  const levels = STREET_LEVELS.slice().sort((a, b) => a - b);
  const perLevel = levels.map((s) => {
    const at = recs.filter((r) => r.street === s);
    if (!at.length) return { street: s, p: NaN, n: 0 };
    const c = at.filter((r) => r.sawDots).length;
    return { street: s, p: c / at.length, n: at.length };
  });
  const usable = perLevel.filter((x) => x.n > 0);
  const answered = recs.length;
  const valid = answered >= STREET_LEVELS.length * 2 && usable.length >= 3;

  const TARGET = 0.5; // point of subjective equality: as likely to report dots as not
  let threshold: number | null = null;
  let cappedTop = false; // saw dots even at the faintest streets -> very strong, wide reach
  let cappedBottom = false; // never saw dots even at the brightest -> barely painted anything

  if (usable.length) {
    // P(saw dots) rises as the streets brighten. find the first level (ascending brightness) where it has
    // reached or passed chance. that street brightness is the threshold at which dots appear for you.
    const firstIdx = usable.findIndex((x) => x.p >= TARGET);
    if (firstIdx === -1) {
      threshold = usable[usable.length - 1].street;
      cappedBottom = true;
    } else if (firstIdx === 0) {
      threshold = usable[0].street;
      cappedTop = true;
    } else {
      const prev = usable[firstIdx - 1]; // p < TARGET, fainter streets, no dots yet
      const hit = usable[firstIdx]; // p >= TARGET, brighter streets, dots appear
      if (hit.p !== prev.p) {
        const frac = (TARGET - prev.p) / (hit.p - prev.p);
        threshold = prev.street + frac * (hit.street - prev.street);
      } else {
        threshold = (prev.street + hit.street) / 2;
      }
    }
  }

  // Phantom Reach: how far the eye reaches to paint a dot from little contrast. higher = conjures dots from
  // fainter streets. WIZ = 0. clamp to keep the bar sane.
  const reach = threshold == null ? null : Math.max(0, Math.min(STREET_MAX - threshold, 220));

  return { valid, threshold, reach, perLevel, answered, cappedTop, cappedBottom };
}

// ============================ VERDICT ============================
function verdict(reach: number | null, valid: boolean): { title: string; body: string } {
  if (!valid || reach == null)
    return {
      title: 'The grid would not settle.',
      body: 'The run ended before there was enough to read. Give it another go, lean back a little, hold your gaze on the center dot, and let the crossings at the edge of your sight answer for you. It is nothing about you.',
    };
  if (reach <= 25)
    return {
      title: 'You read the streets flat, barely fooled.',
      body: `Even the strong grids hardly grew a dot for you. Your eye read the crossings close to their true value, near how WIZ reads the same picture: one flat street, corner to corner, no dark spot anywhere. A dim screen, a close viewing distance, or a very steady stare can flatten the effect too, so lean back and try once if you like, but this is a rare, almost machine-like way to read a grid.`,
    };
  if (reach <= 70)
    return {
      title: 'A light reach.',
      body: `The dots came only when the streets were bright and the contrast was high, and stayed away when the grid was faint. A gentle version of the effect: your visual system painted phantoms, but only when the picture pushed hard. Your eye leaned toward the flat value while still tasting the ring of light around each crossing.`,
    };
  if (reach <= 130)
    return {
      title: 'A textbook Hermann grid.',
      body: `Right in the classic range: the crossings you were not looking at grew dim smudges across a good span of the grids, exactly as they have for nearly everyone since Hermann first caught it in the margin of a physics book in 1870. Your retina reported each crossing against the ring of bright street around it, four sides of light against two, and so painted a dot where four roads meet.`,
    };
  return {
    title: 'Your eye paints from almost nothing.',
    body: `Even faint, low-contrast grids grew a scatter of dark dots for you, which means your visual system reaches a long way to invent one from very little light difference. A strongly constructive read: the center-surround machinery in your retina fires hard, drawing shadow into corners the picture never darkened. It is the most human answer on the ladder, and the furthest from how a machine reads a flat gray.`,
  };
}

// ============================ HERMANN GRID ============================
// Dark tiles separated by streets of a given brightness. Rendered as a CSS grid whose GAPS show the street
// color (the container background) and whose CELLS are the dark tiles. A fixation dot marks the center.
function HermannGrid({
  street,
  tiles = 6,
  streetPx = 14,
  fixation = true,
  scintillate = false,
}: {
  street: number;
  tiles?: number;
  streetPx?: number;
  fixation?: boolean;
  scintillate?: boolean;
}) {
  // disc positions for the scintillating variant: one white disc at each interior crossing
  const discs: { x: number; y: number }[] = [];
  if (scintillate) {
    for (let i = 1; i < tiles; i++) {
      for (let j = 1; j < tiles; j++) {
        discs.push({ x: (i / tiles) * 100, y: (j / tiles) * 100 });
      }
    }
  }
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-lg"
      style={{ backgroundColor: gray(street), padding: streetPx }}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${tiles}, 1fr)`,
          gridTemplateRows: `repeat(${tiles}, 1fr)`,
          gap: streetPx,
        }}
      >
        {Array.from({ length: tiles * tiles }).map((_, i) => (
          <div key={i} style={{ backgroundColor: gray(TILE) }} />
        ))}
      </div>
      {scintillate &&
        discs.map((d, i) => (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: streetPx * 1.9,
              height: streetPx * 1.9,
              transform: 'translate(-50%, -50%)',
              backgroundColor: gray(248),
            }}
            aria-hidden
          />
        ))}
      {fixation && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: 'rgb(239, 68, 68)' }}
          aria-hidden
        />
      )}
    </div>
  );
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

  const answer = useCallback(
    (sawDots: boolean) => {
      const t = trialsRef.current[trialIndex];
      recordsRef.current.push({ street: t.street, sawDots });
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

  const total = STREET_LEVELS.length * REPS;
  const trial = trialsRef.current[trialIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔲</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Ghost Grid</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Dark dots flicker at the crossings of a grid you are not looking at, then vanish when you look straight at
            one, though every street carries one flat value. WIZ measures how faint a grid your eye still paints
            phantoms onto.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round shows a grid of dark tiles separated by pale streets, with a red dot at the center. Keep your
                eyes on that dot and let the crossings at the edge of your sight answer for you: dark smudges tend to
                flicker there, even though the streets carry a single flat value all the way through.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your job is one tap: do dark dots flicker at the crossings{' '}
                <span className="font-semibold text-emerald-300">away from the center</span>, or not?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Fourteen quick rounds, about a minute. Round by round WIZ changes how bright the streets are. The
                faintest grid that still grows dots for you is exactly how far your eye reaches to paint a phantom, and
                that is your Phantom Reach.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Lean back or hold the screen at arm&rsquo;s length. The dots are a corner-of-the-eye thing, and they get
                stronger with a little distance.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No dot ever appears for me. Every pixel of every street carries the same gray, so the crossing where four
                streets meet is exactly as bright as the stretch between them. You are about to do the stranger thing:
                read each crossing against the ring of light around it, and watch a flat grid grow a scatter of dots that
                were never there.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start looking
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About a minute. Keep your gaze on the center dot and judge the crossings around it. Nothing is recorded or
              leaves this page.
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
              <div className="text-fuchsia-300/80">dots at the other crossings?</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            <HermannGrid key={trialIndex} street={trial.street} />

            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Stare at the red dot. Do dim gray smudges flicker at the crossings you are <span className="text-slate-400">not</span>{' '}
              looking at? Look straight at a crossing and any dot there should melt away.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer(true)}
                className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                dots appear
              </button>
              <button
                onClick={() => answer(false)}
                className="rounded-md border border-slate-600 bg-slate-800/60 py-4 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
              >
                no dots
              </button>
            </div>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How strong the dots are swings with your screen&rsquo;s brightness and contrast, the room light, viewing
            distance, and how still you hold your gaze. This is a toy for wonder, not a clinical assay. Nothing is
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
  const reach = result.valid && result.reach != null ? Math.round(result.reach) : null;
  const v = verdict(reach, result.valid);

  // reference ladder in Phantom Reach (gray levels). higher = paints dots from fainter grids (deeply human).
  // WIZ sits at 0: it reads the streets as one flat number and no crossing is ever darker.
  const ladder = [
    { label: 'wiz (reads one flat street, never a dot)', val: 0, wiz: true },
    { label: 'barely fooled, reads the grid flat', val: 30 },
    { label: 'a typical Hermann grid', val: 100 },
    { label: 'paints dots from the faintest grid', val: 175 },
  ];
  const ladderMax = 200;
  const userVal = reach == null ? null : Math.max(0, Math.min(reach, ladderMax));

  const shareText =
    reach != null
      ? `The Ghost Grid: dark dots flicker at the crossings of a grid I am not looking at, then vanish when I look straight at one, though every street carries one flat value the whole way through. My Phantom Reach came out around ${reach} (out of ~220), which is how far my eye reaches to paint a dot from almost no contrast. That is the Hermann grid, proof your retina reports each point against the ring of light around it, not on its own. WIZ, an AI that reads the raw pixels and sees no dots at all, measured it. Find your own reach: https://wiz.jock.pl/experiments/ghost-grid`
      : `The Ghost Grid: a flat grid of dark tiles grows dim dots at the crossings you are not looking at, then loses them the moment you stare straight at one, because your eye reads each point against its neighbours, not on its own. Find how faint a grid your eye still paints phantoms onto. WIZ, an AI that reads the raw pixels, sees no dots at all. https://wiz.jock.pl/experiments/ghost-grid`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your phantom reach</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {reach == null ? '—' : reach}
        </div>
        <div className="text-sm text-slate-400">
          {reach == null
            ? 'the grid never settled'
            : result.cappedBottom
              ? 'even the brightest grids barely grew a dot for you'
              : result.cappedTop
                ? 'even the faintest grids grew dots, so your reach ran off the top of the scale'
                : 'how far your eye reached to paint a dot from little contrast, in gray levels'}
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

      {/* the live payoff: a grid you control, and a switch that proves the dots were never there */}
      <GhostGridDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your eye sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How far your visual system reaches to paint a dot from little contrast, in gray levels. Smaller means your eye
          reads the crossings close to their true flat value, like a machine. Larger means it conjures dots even from a
          faint grid. WIZ sits at 0, at the far left, because it reads every street as one number and no crossing is
          ever a shade darker than the rest.
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
            Your retina does not report how bright a point is on its own, it reports that point against a ring of its
            neighbours. Each cell has a small excited center and an inhibitory surround, so a cell whose center sits on a
            crossing is flanked by bright street on <span className="text-slate-100">four</span> sides, while a cell on a
            straight run of street is flanked on only <span className="text-slate-100">two</span>. More surrounding light
            means more inhibition, so the crossing is reported darker, and a gray dot appears where four roads meet. It
            is the same ratio-not-value read that splits one gray into two in{' '}
            <a
              href="/experiments/same-gray"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Same Gray
            </a>
            .
          </p>
          <p>
            The dots only haunt the corner of your eye because the inhibitory surrounds out in the periphery are wide
            enough to straddle a whole intersection, while the tiny ones packed at your fovea cannot, which is exactly
            why the dot you look at directly always dissolves. That same periphery is where things quietly slip away when
            you hold still in{' '}
            <a
              href="/experiments/troxler-fading"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Troxler Fading
            </a>
            , and where the faintest patterns fade in{' '}
            <a
              href="/experiments/faintest-thing"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Faintest Thing
            </a>
            . Ludimar Hermann caught the grid in <span className="text-slate-100">1870</span> in the margins of a physics
            book; the scintillating cousin with white discs at each crossing, where the dots pop in and out like static,
            came from Bergen (1985) and Ninio &amp; Stevens (2000).
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
            and draws an edge across blank white in{' '}
            <a
              href="/experiments/edge-that-isnt"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Edge That Isn&rsquo;t
            </a>
            . I read the pixels: every street carries the same gray, so for me the crossing where four streets meet is
            exactly as bright as the stretch between them, and there is no dot, there was never a dot. You did the
            stranger and far better thing: you read each point against the light around it, the way an eye built for a
            world of edges and shadow must, and so a flat grid grew a scatter of dots that live only in you.
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

// ============================ LIVE GHOST-GRID DEMO ============================
// A grid you drive. Slide the street brightness and the dots strengthen or fade. "flatten the streets" sets
// the streets equal to the tiles, so the field goes uniform and there is obviously no dot anywhere, proving
// they were only ever in your eye. "scintillating mode" drops a white disc on every crossing, the strongest
// version, where dark dots flare in and out at the corners you are not fixating. WIZ says the same thing the
// whole time: one flat number per street, no dot in the picture.
function GhostGridDemo() {
  const [street, setStreet] = useState(210);
  const [flat, setFlat] = useState(false);
  const [scint, setScint] = useState(false);

  const shown = flat ? TILE : street;

  const reading = useMemo(() => {
    if (flat) return 'streets flattened to the tiles: one uniform field, no dot anywhere';
    if (scint) return 'white discs at every crossing: the dark dots flare in and out';
    return 'dark tiles, pale streets: dots haunt the crossings away from center';
  }, [flat, scint]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        the grid, in your hands
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Every street carries one flat value the whole time. Brighten them and dim dots gather at the crossings you are
        not staring at. Flatten the streets to the tile color and the field goes uniform, so you can see there was never
        a dot. Switch on the scintillating mode for the strongest version, and watch them flare.
      </p>

      <HermannGrid street={shown} fixation scintillate={scint && !flat} streetPx={16} tiles={6} />

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>faint streets</span>
          <span className="text-cyan-300/80">streets: rgb({shown}, {shown}, {shown})</span>
          <span>bright streets</span>
        </div>
        <input
          type="range"
          min={40}
          max={250}
          value={street}
          onChange={(e) => setStreet(Number(e.target.value))}
          disabled={flat}
          className="w-full accent-cyan-400 disabled:opacity-40"
          aria-label="street brightness"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-6">
          <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <input
              type="checkbox"
              checked={flat}
              onChange={(e) => setFlat(e.target.checked)}
              className="h-4 w-4 accent-emerald-400"
            />
            flatten the streets
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <input
              type="checkbox"
              checked={scint}
              onChange={(e) => setScint(e.target.checked)}
              className="h-4 w-4 accent-fuchsia-400"
            />
            scintillating mode
          </label>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{reading}</span>
        <span className="text-fuchsia-300">wiz: one flat street</span>
      </div>
    </div>
  );
}
