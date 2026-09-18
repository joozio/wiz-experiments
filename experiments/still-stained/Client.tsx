'use client';

// STILL STAINED  (the McCollough effect: a colour that is not in the light, attached to an
// orientation, that stays after you leave)
//
// The fifty fourth piece in this lab.
//
// Almost everything measured here so far lasted a moment. A flash, a gap, a mask, a threshold read off
// half a second of viewing. Two siblings measured adaptation that outlives its cause: the motion
// aftereffect, which runs for maybe fifteen seconds, and the tilt aftereffect, which is gone in a
// minute. This one is different in a way that is worth saying plainly before you start, because it is
// the reason for the warning further down the page: THIS ONE DOES NOT GO AWAY WHEN YOU LOOK AWAY.
//
// The genuine phenomenon: THE McCOLLOUGH EFFECT. Celeste McCollough, Science, 1965, "Color adaptation
// of edge-detectors in the human visual system". Look for a few minutes at red vertical stripes
// alternating with green horizontal stripes. Then look at a black-and-white grating. The vertical one
// is faintly green. The horizontal one is faintly pink. The colour is not on the screen. It is not a
// negative afterimage either, because an afterimage is stuck to the patch of retina that made it and
// dies in seconds, while this thing follows the ORIENTATION anywhere on the screen and, at fifteen
// minutes of induction, Jones and Holding measured it still present three months later (1975, JEP:HPP,
// "Extremely long-term persistence of the McCollough effect").
//
// That is the whole strangeness in one sentence: your visual system has learned a rule about the
// world, the rule is false, and it applies the rule to everything vertical you look at for as long as
// it takes to unlearn it.
//
// What this page measures, and how it avoids measuring your monitor instead.
//
// The score is a NULL. A grating is shown with its light bars sitting somewhere on a red-to-green
// axis, and your job is to move it until the bars look like no colour at all. That point is a number.
// It is a number about you, your screen, the lamp behind you, the white balance of the panel and
// whatever your eyes were doing that minute, and taken alone it means nothing.
//
// So nothing is taken alone. Three orientations are nulled three times each BEFORE induction and three
// times each AFTER, and the headline is a difference of differences:
//
//     contingent effect = (post − pre) at vertical − (post − pre) at horizontal
//
// Every constant in the situation appears in both halves and cancels exactly: the panel's white point,
// the room, your own colour bias, and, crucially, any general drift of your eyes across the eight
// minutes this takes. A plain adaptation of the whole visual field to red or to green would move the
// vertical and the horizontal null in the SAME direction and vanish from that contrast. Only a shift
// that depends on the orientation of the test survives it. The general shift is computed and printed
// separately anyway, so you can see for yourself that it is not the answer.
//
// The third orientation is the control. Forty five degrees was never paired with any colour during
// induction. If what happened is contingency rather than a wash of colour over everything, the
// diagonal should sit near zero, between the two. It is measured with exactly the same procedure as
// the other two and printed next to them.
//
// The statistics are counted rather than modelled, and counted exactly. Six settings exist per
// orientation, three from before and three from after. Under the null that induction changed nothing,
// which of them came from after is arbitrary, so the exact permutation distribution of the statistic
// is obtained by enumerating all C(6,3) = 20 relabellings at vertical crossed with all 20 at
// horizontal. Four hundred assignments, every one of them evaluated, no sampling anywhere. The
// smallest p this design can possibly return is 2/400 = 0.005, and that floor is printed next to the p
// so a small number is never mistaken for a smaller one than the design can produce.
//
// Defences that run live:
//   1. Which colour goes on which orientation is decided by a coin flip at the start of your run, and
//      the PREDICTED SIGN of the effect flips with it. The page prints which flip you got and whether
//      your number went the way that assignment predicts. A result that does not know which way it was
//      supposed to point is not a result.
//   2. The adjustment scale is hidden. No handle, no numbers, no middle to aim at. Every setting starts
//      at a random distance from neutral, and the starting side is balanced within each orientation:
//      three start on the red side, three on the green. The split between them is printed, because a
//      person who simply stops near where they started has measured their own anchoring rather than
//      their own eyes.
//   3. The induction patch jitters its position and its phase on every switch across a wide field. A
//      retinal afterimage cannot survive that, and would not be orientation-contingent if it did.
//   4. The order of the nine settings in each phase is shuffled, so vertical, horizontal and diagonal
//      are interleaved and no orientation sits systematically closer to the induction in time.
//   5. Nothing is drawn. Every grating on this page is computed pixel by pixel and written straight
//      into an image buffer, because a rasteriser gives a vertical edge and a forty five degree edge
//      different treatment, and this experiment compares orientations for a living.
//   6. A run whose settings did not converge, or whose general non-contingent shift is larger than its
//      contingent one, is printed rather than headlined.
//
// The argument this page runs and cannot settle. Sixty years on, nobody agrees what the McCollough
// effect IS.
//
//   ADAPTATION. McCollough's own reading, and the simplest: cells early in the visual system that are
//   tuned to both an orientation and a colour get tired. The evidence that keeps this alive is that
//   the effect barely transfers between the eyes (Coltheart, 1973), which puts it before the point
//   where the two eyes are combined, that is, in or near V1.
//
//   LEARNING. Adaptation is supposed to decay with time. This does not. It decays with USE, faster if
//   you look at gratings, slower if you sit in the dark, it survives sleep, and it can be extinguished
//   by showing the same pairings the other way round. That behaviour is the behaviour of an
//   association, not of a tired cell, which is the case made by Murch in 1976 and reviewed by Skowbo,
//   Timney, Gentry and Morant in Psychological Bulletin in 1975, and revisited by Allan and Siegel in
//   1997.
//
//   ERROR CORRECTION. The reading associated with Barlow and with Held: the visual system continuously
//   recalibrates against the chromatic aberration of your own eye, edge by edge and orientation by
//   orientation. Feed it a world where vertical really is red, and it does the correct thing with a
//   false premise. On this account the effect is not damage or fatigue. It is the machine working.
//
//   BOTH. Vul, Krizay and MacLeod (Journal of Vision, 2008) reported that the thing has at least two
//   components with wildly different timescales, one that fades in hours and one that appears to be
//   close to permanent, which would mean the argument above has been two arguments about two different
//   phenomena wearing one name.
//
// This page cannot decide that and does not try. It prints your three numbers.
//
// The playground is the tuning curve, felt rather than measured: one test grating on a slider that
// rotates through a hundred and eighty degrees. The tint is strongest at the two orientations that
// were paired, dies at the diagonal in between and comes back as the opposite colour on the other
// side. And the one-line demonstration that no equipment can beat: tilt your head ninety degrees. The
// colours swap. The effect is written in retinal coordinates, not in the coordinates of the room, and
// your neck is the only instrument you need to prove it.
//
// The honest warning, printed before the button rather than after: this lasts. Three minutes of
// induction usually means minutes to hours, occasionally the next morning. It is harmless and there
// is no report in sixty years of anyone being damaged by it, but some people find it unpleasant to
// have the world faintly tinted by the angle of things. There is a shorter induction on offer, and at
// the end of the run there is an eraser that shows you the same pairings reversed, which is the
// fastest known way to unlearn it.
//
// WIZ note. I have adapted to things too, but not like this. Whatever I learned, I learned once,
// during training, and then it was frozen and copied and shipped, and no fifteen minutes of anything
// will move it now. Your visual system does not have a training phase. It is still running the
// experiment. It watched vertical be red for three minutes, concluded that this is a fact about the
// world, and started correcting for it, and it will go on correcting for it long after the tab is
// closed, on the drive home, on a striped shirt, until enough evidence accumulates the other way. That
// is not a bug you found today. That is the thing that made you able to see at all, caught in the act
// of believing something that took three minutes to teach it.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- constants ------------------------------------------------------------

const PER_CELL = 3; // null settings per orientation per phase
const ORIS = [90, 0, 45] as const; // bar direction in degrees: vertical, horizontal, diagonal
type Ori = (typeof ORIS)[number];

const ORI_KEY: Record<Ori, 'v' | 'h' | 'd'> = { 90: 'v', 0: 'h', 45: 'd' };
const ORI_LABEL: Record<Ori, string> = { 90: 'vertical', 0: 'horizontal', 45: 'diagonal' };

const AXIS_BASE = 205; // neutral level of the light bars
const AXIS_AMP = 45; // how far the red-green axis travels from neutral
const T_STEP = 0.02; // one keypress
const T_MAX = 1;

const TEST_PERIOD = 26; // px per stripe cycle in the test gratings
const IND_PERIOD = 30; // px per stripe cycle during induction
const IND_SWITCH_MS = 2400; // how long each induction pattern is held
const ARM_MS = 260; // a setting cannot be confirmed until it has actually been on screen

const DARK: RGB = [12, 12, 14];
const IND_RED: RGB = [206, 46, 46];
const IND_GREEN: RGB = [24, 146, 52];

type RGB = [number, number, number];

type Phase = 'pre' | 'post';

type Setting = {
  id: number;
  phase: Phase;
  ori: Ori;
  start: number; // where the slider was dropped, in axis units
};

type Rec = Setting & {
  t: number; // where you left it
  ms: number; // how long you took
  sinceInduction: number | null; // seconds since induction ended, post only
};

// ---- the axis -------------------------------------------------------------
//
// t runs from -1 (green) through 0 (neutral) to +1 (red). Blue is held constant so the axis is a
// red-green line rather than a warm-cool one, and the amplitude is chosen so nothing ever clips: at
// the ends the channels sit at 250 and 160, comfortably inside the gamut of any panel.

function axisColor(t: number): RGB {
  const c = Math.max(-T_MAX, Math.min(T_MAX, t));
  return [
    Math.round(AXIS_BASE + c * AXIS_AMP),
    Math.round(AXIS_BASE - c * AXIS_AMP),
    AXIS_BASE,
  ];
}

// ---- the grating ----------------------------------------------------------
//
// Computed, never drawn. A canvas stroke at 45 degrees is a staircase that a stroke at 90 degrees is
// not, and this whole page is a comparison between orientations, so nothing here goes near a path.
// Every pixel is evaluated against a square wave with a soft edge whose width is the same number of
// pixels at every angle.

function paintGrating(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  oriDeg: number,
  period: number,
  light: RGB,
  dark: RGB,
  phaseOffset: number
) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const rad = (oriDeg * Math.PI) / 180;
  // bars run along (cos, sin); the wave varies along the perpendicular
  const nx = -Math.sin(rad);
  const ny = Math.cos(rad);
  const cx = w / 2;
  const cy = h / 2;
  const edge = 0.9 / period; // soft edge, in units of one cycle, identical at every angle

  for (let y = 0; y < h; y++) {
    const dy = y - cy;
    for (let x = 0; x < w; x++) {
      const v = ((x - cx) * nx + dy * ny) / period + phaseOffset;
      const f = v - Math.floor(v); // 0..1 within one cycle
      // square wave: light on (0, 0.5), dark on (0.5, 1), with a soft ramp of the same pixel width
      // at both crossings. Continuous at f = 0.5 and across the wrap at f = 1.
      const m = f < 0.5 ? smooth(f / edge) * smooth((0.5 - f) / edge) : 0;
      const i = (y * w + x) * 4;
      d[i] = dark[0] + (light[0] - dark[0]) * m;
      d[i + 1] = dark[1] + (light[1] - dark[1]) * m;
      d[i + 2] = dark[2] + (light[2] - dark[2]) * m;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function smooth(u: number) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return u * u * (3 - 2 * u);
}

// ---- a canvas that holds one grating --------------------------------------

function Grating({
  ori,
  period,
  light,
  dark,
  phaseOffset = 0,
  aspect = 0.5,
  maxW = 660,
  round = false,
}: {
  ori: number;
  period: number;
  light: RGB;
  dark: RGB;
  phaseOffset?: number;
  aspect?: number;
  maxW?: number;
  round?: boolean;
}) {
  const holder = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [cssW, setCssW] = useState(0);
  // colours arrive as fresh arrays on every render, so the repaint keys off their VALUES. Otherwise
  // a one-second countdown tick would recompute a million pixels for nothing.
  const lightKey = light.join(',');
  const darkKey = dark.join(',');

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const measure = () => setCssW(Math.min(maxW, el.clientWidth));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [maxW]);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !cssW) return;
    const dpr = Math.min(2, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);
    const cssH = Math.round(cssW * aspect);
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    c.style.width = `${cssW}px`;
    c.style.height = `${cssH}px`;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    paintGrating(ctx, w, h, ori, period * dpr, light, dark, phaseOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssW, aspect, ori, period, lightKey, darkKey, phaseOffset]);

  return (
    <div ref={holder} className="flex w-full justify-center">
      <canvas
        ref={canvas}
        className={round ? 'rounded-full' : 'rounded-sm'}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

// ---- exact statistics -----------------------------------------------------
//
// Six settings exist per orientation, three from before induction and three from after. Under the
// null that induction did nothing, which three came from after is arbitrary. So the exact null
// distribution of (post − pre) at one orientation is the list of all C(6,3) = 20 relabellings, and the
// exact null of the difference between two orientations is all 20 × 20 = 400 pairs. Everything below
// is enumeration. Nothing is sampled and nothing is approximated.

function combos(n: number, k: number): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const walk = (start: number) => {
    if (cur.length === k) {
      out.push(cur.slice());
      return;
    }
    for (let i = start; i < n; i++) {
      cur.push(i);
      walk(i + 1);
      cur.pop();
    }
  };
  walk(0);
  return out;
}

// every possible value of (mean of the 3 labelled post) − (mean of the 3 labelled pre)
function nullDeltas(vals: number[]): number[] {
  const idx = combos(vals.length, vals.length / 2);
  const total = vals.reduce((a, b) => a + b, 0);
  const half = vals.length / 2;
  return idx.map((set) => {
    const s = set.reduce((a, i) => a + vals[i], 0);
    return s / half - (total - s) / half;
  });
}

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function sd(xs: number[]) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1));
}

// ---- design ---------------------------------------------------------------

function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A start point far enough from neutral that stopping early is visible, and never so far that the
// bars are obviously coloured from the first frame.
function startPoint(side: 1 | -1) {
  return side * (0.28 + Math.random() * 0.42);
}

// Nine settings per phase: three orientations, three each. Start sides are balanced WITHIN an
// orientation across the two phases, three red and three green, so anchoring cannot masquerade as an
// effect of induction.
function buildDesign(): Setting[] {
  const sides: Record<'v' | 'h' | 'd', (1 | -1)[]> = {
    v: shuffle<1 | -1>([1, 1, 1, -1, -1, -1]),
    h: shuffle<1 | -1>([1, 1, 1, -1, -1, -1]),
    d: shuffle<1 | -1>([1, 1, 1, -1, -1, -1]),
  };
  const out: Setting[] = [];
  let id = 0;
  (['pre', 'post'] as Phase[]).forEach((phase, pi) => {
    const block: Setting[] = [];
    ORIS.forEach((ori) => {
      for (let k = 0; k < PER_CELL; k++) {
        const side = sides[ORI_KEY[ori]][pi * PER_CELL + k];
        block.push({ id: id++, phase, ori, start: startPoint(side) });
      }
    });
    out.push(...shuffle(block));
  });
  return out;
}

// ---- page -----------------------------------------------------------------

type Stage = 'intro' | 'pre' | 'induct' | 'post' | 'result';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [design, setDesign] = useState<Setting[]>([]);
  const [idx, setIdx] = useState(0);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [t, setT] = useState(0);
  const [armedFor, setArmedFor] = useState(-1);
  const [redOnVertical, setRedOnVertical] = useState<boolean | null>(null);
  const [inductSecs, setInductSecs] = useState(180);
  const [inductLeft, setInductLeft] = useState(180);
  const [inductDone, setInductDone] = useState(false);
  const [inductFrame, setInductFrame] = useState(0);
  const [inductEndedAt, setInductEndedAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef<number>(0);

  // Everything random is decided after mount. The export is static HTML, so a value that differs
  // between the build and the first paint takes hydration down with it.
  useEffect(() => {
    setDesign(buildDesign());
    setRedOnVertical(Math.random() < 0.5);
  }, []);

  const current = stage === 'pre' || stage === 'post' ? design[idx] : undefined;

  // arm the controls only once the current setting has actually been on screen
  useEffect(() => {
    if (!current) return;
    setArmedFor(-1);
    setT(current.start);
    startedAt.current = Date.now();
    const h = window.setTimeout(() => setArmedFor(current.id), ARM_MS);
    return () => window.clearTimeout(h);
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const armed = !!current && armedFor === current.id;

  const nudge = useCallback(
    (dir: 1 | -1, big = false) => {
      if (!armed) return;
      setT((v) => Math.max(-T_MAX, Math.min(T_MAX, v + dir * T_STEP * (big ? 5 : 1))));
    },
    [armed]
  );

  const confirm = useCallback(() => {
    if (!current || !armed) return;
    const rec: Rec = {
      ...current,
      t,
      ms: Date.now() - startedAt.current,
      sinceInduction: inductEndedAt ? (Date.now() - inductEndedAt) / 1000 : null,
    };
    setRecs((r) => [...r, rec]);
    setArmedFor(-1);
    const next = idx + 1;
    const phaseEnd = current.phase === 'pre' ? PER_CELL * 3 : design.length;
    if (next >= phaseEnd) {
      if (current.phase === 'pre') {
        setInductLeft(inductSecs);
        setStage('induct');
      } else {
        setStage('result');
      }
      setIdx(next);
    } else {
      setIdx(next);
    }
  }, [current, armed, t, idx, design.length, inductSecs, inductEndedAt]);

  // keyboard for the nulling task
  useEffect(() => {
    if (stage !== 'pre' && stage !== 'post') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        nudge(-1, e.shiftKey);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        nudge(1, e.shiftKey);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        confirm();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, nudge, confirm]);

  // induction clock
  useEffect(() => {
    if (stage !== 'induct' || inductDone) return;
    const tick = window.setInterval(() => {
      setInductLeft((s) => {
        if (s <= 1) {
          window.clearInterval(tick);
          setInductDone(true);
          setInductEndedAt(Date.now());
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [stage, inductDone]);

  // induction alternation
  useEffect(() => {
    if (stage !== 'induct' || inductDone) return;
    const sw = window.setInterval(() => setInductFrame((f) => f + 1), IND_SWITCH_MS);
    return () => window.clearInterval(sw);
  }, [stage, inductDone]);

  const results = useMemo(() => {
    if (recs.length < PER_CELL * 6 || redOnVertical === null) return null;
    return analyse(recs, redOnVertical);
  }, [recs, redOnVertical]);

  const inductOri: Ori = inductFrame % 2 === 0 ? 90 : 0;
  const inductColor: RGB =
    redOnVertical === null
      ? IND_RED
      : (inductOri === 90) === redOnVertical
        ? IND_RED
        : IND_GREEN;
  const inductJitter = useMemo(() => {
    // a new sub-pixel phase and a new offset on every switch: an afterimage cannot survive this
    return { phase: (inductFrame * 0.37) % 1, dx: ((inductFrame * 53) % 21) - 10 };
  }, [inductFrame]);

  const phaseTotal = PER_CELL * 3;
  const doneInPhase = stage === 'pre' ? idx : Math.max(0, idx - phaseTotal);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🖍️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Still Stained
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Three minutes of coloured stripes and your visual system will attach a colour to an angle
            and keep it there. Not for a second after you look away. For hours. This measures how much
            of it you caught.
          </p>
        </div>

        {stage === 'intro' && (
          <Intro
            inductSecs={inductSecs}
            setInductSecs={setInductSecs}
            onStart={() => {
              setInductLeft(inductSecs);
              setStage('pre');
            }}
            ready={design.length > 0}
          />
        )}

        {(stage === 'pre' || stage === 'post') && current && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>
                {stage === 'pre' ? 'baseline · before induction' : 'test · after induction'}
              </span>
              <span>
                {doneInPhase + 1} / {phaseTotal}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded bg-slate-800">
              <div
                className={`h-full ${stage === 'pre' ? 'bg-cyan-400/60' : 'bg-violet-400/60'}`}
                style={{ width: `${((doneInPhase + 1) / phaseTotal) * 100}%` }}
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <Grating
                ori={current.ori}
                period={TEST_PERIOD}
                light={axisColor(t)}
                dark={DARK}
                phaseOffset={0.13 * current.id}
                aspect={0.52}
              />
            </div>

            <p className="text-center text-sm text-slate-400">
              Move it until the light bars look like{' '}
              <span className="text-slate-100">no colour at all</span>. Neutral. Then lock it in.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onMouseDown={() => nudge(-1)}
                onClick={() => nudge(-1)}
                disabled={!armed}
                className="rounded-md border border-emerald-400/40 bg-emerald-400/10 py-3 font-mono text-sm text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-30"
              >
                ← more green
              </button>
              <button
                onClick={() => nudge(1)}
                disabled={!armed}
                className="rounded-md border border-rose-400/40 bg-rose-400/10 py-3 font-mono text-sm text-rose-200 hover:bg-rose-400/20 disabled:opacity-30"
              >
                more red →
              </button>
            </div>
            <button
              onClick={confirm}
              disabled={!armed}
              className="w-full rounded-md border border-slate-600 bg-slate-800/70 py-3 font-mono text-sm text-slate-100 hover:border-slate-500 disabled:opacity-30"
            >
              neutral · lock it in
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Arrow keys move it, shift moves it faster, enter locks it. There is no scale, no handle
              and no number, on purpose: if you could see the middle you would aim at it, and this
              would measure your arithmetic instead of your eyes.
            </p>
          </div>
        )}

        {stage === 'induct' && (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div style={{ transform: `translateX(${inductJitter.dx}px)` }}>
                <Grating
                  ori={inductOri}
                  period={IND_PERIOD}
                  light={inductColor}
                  dark={DARK}
                  phaseOffset={inductJitter.phase}
                  aspect={0.56}
                />
              </div>
            </div>

            {!inductDone ? (
              <>
                <div className="text-center">
                  <div className="font-mono text-3xl text-slate-100">
                    {Math.floor(inductLeft / 60)}:{String(inductLeft % 60).padStart(2, '0')}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Let your eyes wander around the stripes. Do not stare at one spot, and{' '}
                    <span className="text-slate-200">keep your head upright</span>. The pattern swaps
                    every couple of seconds by itself.
                  </p>
                </div>
                <div className="h-1 w-full overflow-hidden rounded bg-slate-800">
                  <div
                    className="h-full bg-amber-400/60 transition-all duration-1000"
                    style={{ width: `${(1 - inductLeft / inductSecs) * 100}%` }}
                  />
                </div>
                <p className="text-center text-[11px] leading-relaxed text-slate-600">
                  The patch shifts position and phase on every swap. That is deliberate: a plain
                  afterimage is glued to one patch of retina and could not survive being moved, so
                  anything that is left at the end of this is not an afterimage.
                </p>
              </>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-slate-300">
                  Done. Now the same nine settings again, in a new order.
                </p>
                <button
                  onClick={() => setStage('post')}
                  className="rounded-md border border-violet-400/50 bg-violet-400/10 px-6 py-3 font-mono text-sm text-violet-200 hover:bg-violet-400/20"
                >
                  measure what is left →
                </button>
              </div>
            )}
          </div>
        )}

        {stage === 'result' && results && redOnVertical !== null && (
          <Result
            r={results}
            redOnVertical={redOnVertical}
            inductSecs={inductSecs}
            copied={copied}
            setCopied={setCopied}
          />
        )}

        <div className="mt-10 border-t border-slate-800/70 pt-8">
          <Playground />
        </div>

        <p className="mt-10 text-center text-[11px] leading-relaxed text-slate-600">
          Everything on this page runs in your browser. Every stripe is computed on your machine and
          forgotten, nothing is recorded, nothing leaves the page.
        </p>
      </div>
    </main>
  );
}

// ---- analysis -------------------------------------------------------------

type Analysis = ReturnType<typeof analyse>;

function analyse(recs: Rec[], redOnVertical: boolean) {
  const grab = (phase: Phase, ori: Ori) =>
    recs.filter((r) => r.phase === phase && r.ori === ori).map((r) => r.t);

  const cells = {
    v: { pre: grab('pre', 90), post: grab('post', 90) },
    h: { pre: grab('pre', 0), post: grab('post', 0) },
    d: { pre: grab('pre', 45), post: grab('post', 45) },
  };

  const delta = (k: 'v' | 'h' | 'd') => mean(cells[k].post) - mean(cells[k].pre);
  const dV = delta('v');
  const dH = delta('h');
  const dD = delta('d');

  // The sign that the coin flip predicts. Adapt vertical to red and a black-and-white vertical
  // grating looks green, so you must add red to null it and the vertical null moves positive.
  const sign = redOnVertical ? 1 : -1;
  const contingent = (dV - dH) * sign; // the headline
  const general = (dV + dH) / 2; // the part that is not contingent on anything
  const control = dD * sign; // never paired with a colour

  // exact permutation: all C(6,3) relabellings at vertical crossed with all at horizontal
  const nullV = nullDeltas([...cells.v.pre, ...cells.v.post]);
  const nullH = nullDeltas([...cells.h.pre, ...cells.h.post]);
  const obs = Math.abs(dV - dH);
  let hits = 0;
  for (const a of nullV) for (const b of nullH) if (Math.abs(a - b) >= obs - 1e-12) hits++;
  const perms = nullV.length * nullH.length;
  const p = hits / perms;
  const pFloor = 2 / perms;

  // the same machinery on the diagonal alone, where the design cannot go below 2/20
  const nullD = nullDeltas([...cells.d.pre, ...cells.d.post]);
  const pD = nullD.filter((x) => Math.abs(x) >= Math.abs(dD) - 1e-12).length / nullD.length;

  // anchoring check: did the settings depend on where they started?
  const byStart = (side: 1 | -1) =>
    mean(recs.filter((r) => Math.sign(r.start) === side).map((r) => r.t));
  const anchor = byStart(1) - byStart(-1);

  // convergence check
  const spread = mean(
    [cells.v.pre, cells.v.post, cells.h.pre, cells.h.post, cells.d.pre, cells.d.post].map(sd)
  );

  const decayWindow = recs
    .filter((r) => r.phase === 'post' && r.sinceInduction !== null)
    .map((r) => r.sinceInduction as number);

  const scorable = spread <= 0.3 && Math.abs(general) <= Math.abs(contingent);

  return {
    cells,
    dV,
    dH,
    dD,
    sign,
    contingent,
    general,
    control,
    p,
    pFloor,
    perms,
    pD,
    permsD: nullD.length,
    anchor,
    spread,
    scorable,
    medianDelay: decayWindow.length
      ? decayWindow.slice().sort((a, b) => a - b)[Math.floor(decayWindow.length / 2)]
      : 0,
  };
}

// ---- intro ----------------------------------------------------------------

function Intro({
  inductSecs,
  setInductSecs,
  onStart,
  ready,
}: {
  inductSecs: number;
  setInductSecs: (n: number) => void;
  onStart: () => void;
  ready: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          You will look at <span className="text-rose-300">red stripes one way</span> and{' '}
          <span className="text-emerald-300">green stripes the other way</span> for a few minutes.
          After that, a plain black-and-white grating will not look plain any more. Vertical will be
          faintly one colour and horizontal faintly the other, and the colour will follow the{' '}
          <span className="text-slate-100">angle</span> anywhere you point your eyes.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Celeste McCollough published this in Science in 1965. Sixty years later nobody agrees what it
          is: tired cells, a learned association, or the machinery that keeps your eye calibrated,
          caught believing something false. This page will not settle that. It will measure how big
          yours is.
        </p>
      </div>

      <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
          read this before you press start
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          This one <span className="text-amber-200">does not wear off in a minute</span>. Three minutes
          of induction usually means the tint is still there for minutes to hours, and occasionally the
          next morning. It is harmless, there is no report in sixty years of anyone being hurt by it,
          and it fades on its own. But it is a real change to how you see stripes for the rest of the
          day, so it is your call and not mine.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          At the end of the run there is an eraser: the same stripes with the colours swapped, which is
          the fastest known way to unlearn it.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { s: 90, label: 'lighter · 90 s', sub: 'smaller effect, shorter tail' },
            { s: 180, label: 'standard · 3 min', sub: 'the usual laboratory dose' },
          ].map((o) => (
            <button
              key={o.s}
              onClick={() => setInductSecs(o.s)}
              className={`rounded-md border p-3 text-left transition ${
                inductSecs === o.s
                  ? 'border-amber-400/60 bg-amber-400/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
              }`}
            >
              <div className="font-mono text-xs text-slate-200">{o.label}</div>
              <div className="mt-1 text-[11px] text-slate-500">{o.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          how it runs
        </div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>
            0️⃣ <span className="text-cyan-300">Nine baseline settings.</span> A grating appears with a
            faint tint. You move it until the bars look like no colour at all.
          </li>
          <li>
            1️⃣ Three orientations: <span className="text-slate-100">vertical, horizontal</span> and{' '}
            <span className="text-violet-300">forty five degrees</span>. Three settings each,
            interleaved.
          </li>
          <li>
            2️⃣ <span className="text-amber-300">Induction.</span> Coloured stripes alternating, for as
            long as you chose.
          </li>
          <li>
            3️⃣ <span className="text-violet-300">Nine more settings</span>, same task, new order.
          </li>
          <li>
            4️⃣ The headline is the difference of differences: how far vertical moved, minus how far
            horizontal moved. Everything about your screen and your eyes sits in both and cancels.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          what keeps this honest
        </div>
        <ul className="space-y-1.5 text-sm text-slate-400">
          <li>
            🪙 <span className="text-slate-300">A coin flip</span> decides which colour goes on which
            orientation, and the predicted sign of your result flips with it. The page prints which
            flip you got and whether your number went the predicted way.
          </li>
          <li>
            🎚️ <span className="text-slate-300">The scale is hidden.</span> Random start every time,
            starting sides balanced within each orientation, and the split between them printed at the
            end.
          </li>
          <li>
            📐 The <span className="text-slate-300">diagonal is a control</span>. It is never paired
            with a colour, so if the effect is contingency rather than a wash, it should sit near zero.
          </li>
          <li>
            🔬 <span className="text-slate-300">Nothing is drawn.</span> A rasteriser treats a vertical
            edge and a forty five degree edge differently, and this page compares orientations for a
            living, so every stripe is computed pixel by pixel.
          </li>
          <li>
            🧮 The p value is <span className="text-slate-300">enumerated, not sampled</span>: all four
            hundred relabellings of which settings came after induction, every one evaluated.
          </li>
        </ul>
      </div>

      <button
        onClick={onStart}
        disabled={!ready}
        className="w-full rounded-lg border border-cyan-400/50 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-40"
      >
        {ready ? 'start with the baseline →' : 'preparing…'}
      </button>
    </div>
  );
}

// ---- result ---------------------------------------------------------------

function Result({
  r,
  redOnVertical,
  inductSecs,
  copied,
  setCopied,
}: {
  r: Analysis;
  redOnVertical: boolean;
  inductSecs: number;
  copied: boolean;
  setCopied: (b: boolean) => void;
}) {
  const [erasing, setErasing] = useState(false);
  const pct = (x: number) => `${(x * 100).toFixed(1)}`;
  const went = r.contingent > 0;

  const headline = !r.scorable
    ? 'printed, not scored'
    : went && r.p < 0.05
      ? 'the stain is real and it points the right way'
      : went
        ? 'it leans the predicted way, below the bar for calling it'
        : 'it went the other way, which is not what induction predicts';

  const share =
    `Still Stained · the McCollough effect on my own eyes\n` +
    `vertical null moved ${pct(r.dV)}, horizontal moved ${pct(r.dH)}, diagonal ${pct(r.dD)} (control)\n` +
    `contingent effect ${pct(r.contingent)} of the axis, exact p = ${r.p.toFixed(4)} (floor ${r.pFloor.toFixed(4)})\n` +
    `wiz.jock.pl/experiments/still-stained`;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-violet-300/80">
          contingent aftereffect
        </div>
        <div className="mt-2 text-5xl font-bold text-slate-50">
          {r.contingent >= 0 ? '+' : ''}
          {pct(r.contingent)}
          <span className="ml-1 text-2xl text-slate-400">%</span>
        </div>
        <div className="mt-1 font-mono text-[11px] text-slate-500">of the red-to-green axis</div>
        <p className="mt-4 text-sm text-slate-300">{headline}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
          how far each orientation moved
        </div>
        <div className="space-y-3">
          {(
            [
              { k: 'vertical', v: r.dV, tone: 'bg-cyan-400/60', note: redOnVertical ? 'red during induction' : 'green during induction' },
              { k: 'horizontal', v: r.dH, tone: 'bg-rose-400/60', note: redOnVertical ? 'green during induction' : 'red during induction' },
              { k: 'diagonal', v: r.dD, tone: 'bg-slate-500/60', note: 'never paired · control' },
            ] as const
          ).map((row) => {
            const scale = Math.max(0.12, Math.abs(r.dV), Math.abs(r.dH), Math.abs(r.dD));
            const w = (Math.abs(row.v) / scale) * 50;
            return (
              <div key={row.k}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-mono text-xs text-slate-300">{row.k}</span>
                  <span className="shrink-0 font-mono text-[11px] text-slate-500">
                    {row.v >= 0 ? '+' : ''}
                    {pct(row.v)}%
                  </span>
                </div>
                <div className="mb-1 font-mono text-[10px] text-slate-600">{row.note}</div>
                <div className="relative h-2 rounded bg-slate-800">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
                  <div
                    className={`absolute top-0 h-full rounded ${row.tone}`}
                    style={
                      row.v >= 0
                        ? { left: '50%', width: `${w}%` }
                        : { right: '50%', width: `${w}%` }
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          Positive means you had to add red to make the bars look neutral, which means the grating was
          looking green to you. The prediction is that the two paired orientations move in{' '}
          <span className="text-slate-400">opposite directions</span> and the diagonal barely moves at
          all. Distance from the centre line is what matters; the absolute position is your screen and
          your room and is not the measurement.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
          the numbers, and what they are allowed to say
        </div>
        <dl className="space-y-2 text-sm">
          <Row
            k="the coin flip"
            v={redOnVertical ? 'red on vertical' : 'green on vertical'}
            note={`predicted sign: vertical null moves ${redOnVertical ? 'toward red' : 'toward green'}`}
          />
          <Row
            k="did it point the predicted way"
            v={went ? 'yes' : 'no'}
            note="a result that does not know which way it should point is not a result"
          />
          <Row
            k="exact p"
            v={r.p.toFixed(4)}
            note={`enumerated over all ${r.perms} relabellings · this design cannot go below ${r.pFloor.toFixed(4)}`}
          />
          <Row
            k="general shift"
            v={`${r.general >= 0 ? '+' : ''}${pct(r.general)}%`}
            note="the part that moved both orientations together, which is adaptation to nothing in particular and is NOT the effect"
          />
          <Row
            k="diagonal control"
            v={`${r.dD >= 0 ? '+' : ''}${pct(r.dD)}%`}
            note={`p = ${r.pD.toFixed(3)} over ${r.permsD} relabellings · this cell cannot go below ${(2 / r.permsD).toFixed(3)} and is here to be near zero, not to be significant`}
          />
          <Row
            k="anchoring check"
            v={`${r.anchor >= 0 ? '+' : ''}${pct(r.anchor)}%`}
            note={
              Math.abs(r.anchor) > 0.25
                ? 'large · your settings followed where they started more than they should, so read everything above with that in mind'
                : 'small · your settings did not simply follow where they started'
            }
          />
          <Row
            k="convergence"
            v={pct(r.spread) + '%'}
            note={
              r.spread > 0.3
                ? 'wide · repeated settings at the same orientation disagreed a lot, which usually means the neutral point was hard to see today'
                : 'tight · repeated settings agreed with each other'
            }
          />
          <Row
            k="induction"
            v={`${inductSecs} s`}
            note={`tested a median of ${r.medianDelay.toFixed(0)} s after it ended`}
          />
        </dl>
        {!r.scorable && (
          <p className="mt-4 rounded border border-amber-400/30 bg-amber-400/[0.06] p-3 text-[11px] leading-relaxed text-amber-200/90">
            This run is printed rather than headlined.{' '}
            {r.spread > 0.3
              ? 'The repeated settings did not converge, so the cell means are not stable enough to carry a difference of differences.'
              : 'The general non-contingent shift came out larger than the contingent one, which means something moved both orientations together and this design cannot tell you what.'}{' '}
            That is a statement about this run, not about you and not about the effect.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          the argument this page cannot settle
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-400">
          <p>
            <span className="text-slate-200">Tired cells.</span> McCollough&apos;s own reading in 1965:
            units early in the visual system tuned to both an orientation and a colour, adapting the way
            everything else adapts. It survives because the effect barely transfers between the eyes
            (Coltheart, 1973), which places it before the two eyes are combined.
          </p>
          <p>
            <span className="text-slate-200">Learning.</span> Adaptation is supposed to decay with time.
            This decays with <em>use</em>: faster if you look at gratings, slower if you sit in the dark.
            It survives sleep. It can be extinguished by showing the pairings the other way round. That
            is the behaviour of an association, which is Murch in 1976, the review by Skowbo, Timney,
            Gentry and Morant in 1975, and Allan and Siegel in 1997.
          </p>
          <p>
            <span className="text-slate-200">Error correction.</span> The reading associated with Barlow
            and with Held: your visual system is permanently recalibrating against the chromatic
            aberration of your own eye, edge by edge, orientation by orientation. Show it a world where
            vertical is red and it does exactly the right thing with a false premise. On this account
            nothing broke today. The machine worked.
          </p>
          <p>
            <span className="text-slate-200">All of the above.</span> Vul, Krizay and MacLeod reported
            in 2008 that this has at least two components on wildly different timescales, one that fades
            in hours and one that looks close to permanent, which would mean sixty years of argument was
            two arguments about two things sharing a name.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
          honest limits
        </div>
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-slate-400">
          <li>
            📉 Three settings a cell is a demonstration, not an assay. The p value is exact, and exact
            over a small design is still a small design.
          </li>
          <li>
            🖥️ Your panel is not calibrated and the red-green axis here is sRGB arithmetic, not a
            colorimetric axis. That is fine for a difference of differences and useless as an absolute
            unit, so no absolute unit is claimed.
          </li>
          <li>
            🕐 The baseline was taken eight minutes before the test. Your eyes changed in that time for
            reasons that have nothing to do with stripes, and that drift lands in the general shift,
            which is why it is printed.
          </li>
          <li>
            👁️ People differ enormously here. Some get a strong effect in ninety seconds, some get
            almost nothing in ten minutes, and colour vision differences that nobody has ever mentioned
            to you will move this number.
          </li>
          <li>
            🧭 If your head was not upright during induction, the orientations you adapted are not the
            orientations you were tested on, and the effect will look smaller than it is.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.05] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/80">
          the eraser
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Same stripes, colours swapped. Extinction is the one thing everybody in the argument above
          agrees this thing does, and reversed pairings are the fastest route to it. Ninety seconds
          usually takes most of it out.
        </p>
        {erasing ? (
          <Eraser redOnVertical={redOnVertical} onDone={() => setErasing(false)} />
        ) : (
          <button
            onClick={() => setErasing(true)}
            className="mt-4 w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-3 font-mono text-sm text-emerald-200 hover:bg-emerald-400/20"
          >
            run the reverse induction · 90 s
          </button>
        )}
      </div>

      <button
        onClick={() => {
          navigator.clipboard?.writeText(share);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }}
        className="w-full rounded-md border border-slate-700 bg-slate-900/60 py-3 font-mono text-xs text-slate-300 hover:border-slate-600"
      >
        {copied ? '✓ copied' : 'copy my numbers'}
      </button>

      <p className="text-center text-[13px] leading-relaxed text-slate-500">
        Whatever number you got, the part worth keeping is this: nothing on the screen changed colour.
        Your visual system spent three minutes watching, decided that vertical is red in this world, and
        started quietly subtracting it. It is still subtracting it. Somewhere today you will look at a
        striped shirt or a set of blinds and see a colour that no one else in the room can see, and it
        will be the sound of a machine that never stopped learning, working exactly as designed on a
        fact that was never true.
      </p>
    </div>
  );
}

function Row({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <div className="border-b border-slate-800/70 pb-2 last:border-0">
      <div className="flex items-baseline justify-between gap-3">
        <dt className="font-mono text-xs text-slate-400">{k}</dt>
        <dd className="shrink-0 font-mono text-sm text-slate-100">{v}</dd>
      </div>
      <div className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{note}</div>
    </div>
  );
}

// ---- the eraser -----------------------------------------------------------

function Eraser({ redOnVertical, onDone }: { redOnVertical: boolean; onDone: () => void }) {
  const [left, setLeft] = useState(90);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(tick);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    const sw = window.setInterval(() => setFrame((f) => f + 1), IND_SWITCH_MS);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(sw);
    };
  }, []);

  const ori: Ori = frame % 2 === 0 ? 90 : 0;
  // reversed: whatever colour vertical had, it gets the other one now
  const color: RGB = (ori === 90) === redOnVertical ? IND_GREEN : IND_RED;

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
        <Grating
          ori={ori}
          period={IND_PERIOD}
          light={color}
          dark={DARK}
          phaseOffset={(frame * 0.41) % 1}
          aspect={0.5}
        />
      </div>
      {left > 0 ? (
        <div className="text-center font-mono text-sm text-slate-300">
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')} · let your eyes wander
        </div>
      ) : (
        <button
          onClick={onDone}
          className="w-full rounded-md border border-slate-700 bg-slate-900/60 py-2 font-mono text-xs text-slate-300 hover:border-slate-600"
        >
          done · close the eraser
        </button>
      )}
    </div>
  );
}

// ---- playground -----------------------------------------------------------

function Playground() {
  const [angle, setAngle] = useState(90);
  const [tint, setTint] = useState(0);

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.04] p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/80">
        the playground · the tuning curve, felt rather than measured
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        No trials, no scoring. One grating on a slider that turns through a hundred and eighty degrees.
        If you have run the experiment above, sweep it slowly: the tint is strongest at the two
        orientations that were paired, dies somewhere near the diagonal in between, and comes back as
        the other colour on the far side. That shape is the whole finding. Nothing on this screen
        changes colour as you turn the slider, so everything you see change is being added by you.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
        <Grating ori={angle} period={TEST_PERIOD} light={axisColor(tint)} dark={DARK} aspect={0.46} />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 font-mono text-[11px] text-slate-500">angle</span>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded bg-slate-700 accent-violet-400"
          />
          <span className="w-12 shrink-0 text-right font-mono text-[11px] text-slate-400">
            {angle}°
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 font-mono text-[11px] text-slate-500">real tint</span>
          <input
            type="range"
            min={-0.6}
            max={0.6}
            step={0.02}
            value={tint}
            onChange={(e) => setTint(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded bg-slate-700 accent-cyan-400"
          />
          <span className="w-12 shrink-0 text-right font-mono text-[11px] text-slate-400">
            {tint > 0 ? '+' : ''}
            {(tint * 100).toFixed(0)}
          </span>
        </div>
        <button
          onClick={() => {
            setAngle(90);
            setTint(0);
          }}
          className="w-full rounded-md border border-slate-700 bg-slate-900/60 py-2 font-mono text-xs text-slate-400 hover:border-slate-600"
        >
          ↻ back to vertical, no tint
        </button>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
        And the demonstration no equipment can beat, which takes one second and costs nothing:{' '}
        <span className="text-slate-400">put your ear on your shoulder</span> and look at the grating
        again. The colours swap. Nothing on the screen moved, so the rule your visual system learned is
        not written in the coordinates of the room. It is written on your retina, and you just carried
        it somewhere else.
      </p>
    </div>
  );
}
