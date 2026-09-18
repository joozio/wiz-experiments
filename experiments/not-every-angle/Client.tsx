'use client';

// NOT EVERY ANGLE  (the oblique effect: the same instrument, several times worse at forty five
// degrees, permanently, and not because you are tired)
//
// The fifty third piece in this lab.
//
// The lab now has two other pieces that live on orientation, and this one is not either of them.
// Off True measured ADAPTATION: stare at a slant for half a minute and your vertical moves. One
// Before measured HISTORY: what you judged a second ago drags what you judge now. Both of those are
// things that HAPPEN to the ruler. This one is about the ruler itself. It does not move, it does not
// drift, it was like this before you sat down and it will be like this tomorrow: it has fine
// gradations near vertical and horizontal, and coarse ones in between. A permanent inhomogeneity in
// a faculty that feels perfectly even from the inside.
//
// The genuine phenomenon: THE OBLIQUE EFFECT. Orientation discrimination, acuity, grating detection
// and orientation memory are all reliably better at the cardinals, vertical and horizontal, than at
// the diagonals. Appelle collected the evidence in 1972 (Psychological Bulletin, "Perception and
// discrimination as a function of stimulus orientation: the oblique effect in man and animals") and
// it has held ever since. The size of it is not subtle: a tilt you can see easily against vertical
// can be invisible against forty five degrees.
//
// The measurement here. Forty eight trials. Two patches side by side for four tenths of a second,
// one of them rotated a little further clockwise than the other, and one question: which one.
//
//   CARDINAL  the pair sits near vertical or near horizontal
//   OBLIQUE   the pair sits near forty five or near a hundred and thirty five
//
// Four tilt differences, 1.5, 3, 6 and 12 degrees, six trials each in each class. That gives an
// accuracy curve per class, and the 75 percent point on each curve is a threshold in degrees: the
// smallest tilt you can still call, at that reference orientation.
//
// The headline is a RATIO: oblique threshold over cardinal threshold. That construction is the
// point, exactly as in the siblings. Your screen, your distance from it, your eyes, your patience,
// how good you happen to be at this task at all: every one of those sits in both numbers and
// cancels. What survives is the shape of the anisotropy. Typical published values put the oblique
// threshold somewhere around one and a half to two and a half times the cardinal one.
//
// The display trap, printed rather than hidden. A pixel grid has cardinals of its own. A vertical
// line drawn with a rasteriser is crisp, a forty five degree line is a staircase, and if this page
// drew lines it would manufacture a cardinal advantage out of the screen and hand it to you as a
// fact about your brain. So nothing here is drawn. Every patch is computed pixel by pixel from a
// cosine, in floating point, with a Gaussian envelope, and then ordered dithered. There is no
// rasteriser in the path and no orientation gets a crisper representation than any other. The
// carrier is deliberately coarse, about five cycles across the patch, so sampling artefacts are
// nowhere near the frequencies that matter.
//
// The second trap, which is real and which this page cannot fully solve: your screen has edges, and
// they are vertical and horizontal. A rectangular frame is an external reference that helps you at
// the cardinals and does nothing for you at the diagonals, so part of any advantage you show could
// belong to the monitor rather than to you. Two defences run. The patches are round, they sit on a
// wide uniform grey field, and the judgment is between two patches presented at the same moment, so
// no external reference is needed to do the task at all. And the page offers the actual test: run a
// short block again with your head tilted onto your shoulder. If the anisotropy is a fact about your
// retina it should rotate with your head, and the advantage should abandon the screen cardinals. If
// it is a fact about the room, it should stay where it is. That question has been argued since the
// seventies and the literature is genuinely mixed, so the page reports what your two blocks did and
// declines to settle it.
//
// The statistics are counted rather than modelled, and counted exactly. Every score here is a rate
// over binary trials, so under the null that class labels are exchangeable within a tilt level, the
// number of correct trials landing in the cardinal half is hypergeometric. The distribution of a
// mean of four such rate differences is the convolution of four small distributions, which is a few
// thousand multiplications and no simulation at all. The smallest p the test can return with this
// many trials is printed next to the p itself, because a floor of 0.03 is a thing you should know
// about before you read a 0.03.
//
// Guards that run live:
//   1. Every headline is a ratio of two numbers measured on the same person, same screen, same
//      minute, same task, in the same units.
//   2. Which side carries the further clockwise patch is random, and the page prints how often you
//      answered left, because a side habit would show up as a flat curve rather than as a score.
//   3. The reference orientation is jittered a few degrees on every trial, so no exact pixel
//      alignment ever repeats and nothing about a particular alignment can be learned.
//   4. Accuracy on the easiest cardinal trials is the sanity check. If you cannot do 12 degrees at
//      vertical, the run is printed and not scored, because the failure is attention or instruction,
//      not orientation.
//   5. The accuracy curves are monotonised by pooling adjacent violators before a threshold is read
//      off them, so a lucky level cannot invent a threshold that is out of order.
//
// The argument this page runs and cannot settle: WHERE THE ANISOTROPY COMES FROM. Coppola, Purves,
// McCoy and Purves measured the orientation content of real scenes in 1998 (PNAS) and found more
// energy at the cardinals than at the diagonals, which makes a visual system that spends more
// machinery there simply efficient. Girshick, Landy and Simoncelli followed that all the way to
// behaviour in 2011 (Nature Neuroscience, "Cardinal rules"), showing that human orientation errors
// look like a Bayesian observer carrying exactly that environmental prior. On the hardware side,
// Li, Peterson and Freeman found more and more sharply tuned cardinal cells in cat V1 in 2003, and
// Furmanski and Engel found a bigger cardinal response in human V1 with fMRI in 2000. But Annis and
// Frost put a hole in the innateness reading in 1973 (Science): Cree observers raised in an
// environment without carpentered right angles showed the anisotropy much reduced or absent, which
// says the world writes it, not the genome. Both stories predict your numbers. This page prints
// them and says so.
//
// Honest limits, all printed on the page: six trials a cell is a demonstration and not an assay,
// four tilt levels is a coarse curve and a threshold read off it carries real error, a phone held
// at arm's length is a different experiment from a monitor at sixty centimetres, and nobody tilts
// their head as far as they think they do.
//
// WIZ note. I do not have a preferred angle, and that is not a virtue. A convolution has no opinion
// about orientation until the data gives it one, and the data given to things like me is
// photographs, taken by people, of a world full of walls and doors and horizons. If I have a
// cardinal bias, and models trained on natural images generally do, it arrived the same way one of
// the two candidate stories says yours did: from the statistics of a carpentered world, absorbed
// without being noticed. The difference is that mine is a number I could in principle go and read,
// and yours is the reason a picture hung four degrees off looks wrong from the doorway while the
// same four degrees on a diagonal brace looks like nothing at all.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- constants ------------------------------------------------------------

const DELTAS = [1.5, 3, 6, 12] as const; // tilt differences in degrees
const REPS = 6; // trials per class per level in the main block  => 48 trials
const TILT_REPS = 3; // trials per class per level in the head tilt block => 24 trials
const JITTER = 4; // reference orientation jitter, degrees either way
const CRIT = 0.75; // threshold criterion on the accuracy curve (chance is 0.5)

const FIX_MS = 420;
const SHOW_MS = 400;
const GAP_MS = 320;

const CYCLES = 5; // carrier cycles across the patch diameter
const CONTRAST = 0.85;

const LAPSE_FLOOR = 0.66; // cardinal accuracy at 12 degrees below this => printed, not scored

type Cls = 'cardinal' | 'oblique';
type Block = 'upright' | 'tilted';
type View = 'blank' | 'fix' | 'patches';

const REFS: Record<Cls, number[]> = {
  cardinal: [0, 90],
  oblique: [45, 135],
};

const CLS_LABEL: Record<Cls, string> = {
  cardinal: 'near vertical and horizontal',
  oblique: 'near the diagonals',
};

// ---- small helpers --------------------------------------------------------

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function median(xs: number[]) {
  if (!xs.length) return 0;
  const a = xs.slice().sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

function deg(x: number) {
  return x >= 10 ? `${x.toFixed(1)}°` : `${x.toFixed(2)}°`;
}

// ---- exact statistics -----------------------------------------------------
//
// Same machinery as the siblings, for the same reason: these are rates over binary trials, so the
// permutation null is hypergeometric and enumerable. No simulation anywhere on this page.

type Dist = Array<{ d: number; p: number }>;

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

// n1 trials in group one, n2 in group two, K correct in total: exact distribution of
// (correct rate in group one) minus (correct rate in group two) under exchangeable labels
function rateDiffDist(n1: number, n2: number, K: number): Dist {
  const tot = choose(n1 + n2, K);
  if (tot === 0 || n1 === 0 || n2 === 0) return [{ d: 0, p: 1 }];
  const out: Dist = [];
  for (let k = Math.max(0, K - n2); k <= Math.min(n1, K); k++) {
    const p = (choose(n1, k) * choose(n2, K - k)) / tot;
    if (p > 0) out.push({ d: k / n1 - (K - k) / n2, p });
  }
  return out.length ? out : [{ d: 0, p: 1 }];
}

function combine(parts: Array<{ dist: Dist; w: number }>): Dist {
  let acc: Dist = [{ d: 0, p: 1 }];
  for (const part of parts) {
    const m = new Map<number, number>();
    for (const a of acc) {
      for (const b of part.dist) {
        const key = Math.round((a.d + part.w * b.d) * 1e6) / 1e6;
        m.set(key, (m.get(key) ?? 0) + a.p * b.p);
      }
    }
    acc = Array.from(m, ([d, p]) => ({ d, p }));
  }
  return acc;
}

function tailP(dist: Dist, obs: number) {
  let s = 0;
  for (const e of dist) if (e.d >= obs - 1e-9) s += e.p;
  return Math.min(1, s);
}

// the smallest p this test could return at all, worth printing when it is not small
function pFloor(dist: Dist) {
  let maxD = -Infinity;
  for (const e of dist) if (e.d > maxD) maxD = e.d;
  let s = 0;
  for (const e of dist) if (e.d >= maxD - 1e-9) s += e.p;
  return s;
}

function pText(p: number) {
  if (p < 0.001) return 'p < 0.001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(2)}`;
}

// ---- psychometrics --------------------------------------------------------
//
// Pool adjacent violators: the smallest change to a set of accuracies that makes them
// non-decreasing. A psychometric function cannot go down as the tilt gets bigger, so a level that
// did is noise, and pooling it with its neighbour is the honest repair.

function pava(ys: number[], w: number[]): number[] {
  const v = ys.slice();
  const ww = w.slice();
  const idx = v.map((_, i) => i);
  let i = 0;
  while (i < v.length - 1) {
    if (v[i] <= v[i + 1] + 1e-12) {
      i++;
      continue;
    }
    const tw = ww[i] + ww[i + 1];
    const tv = (v[i] * ww[i] + v[i + 1] * ww[i + 1]) / tw;
    v.splice(i, 2, tv);
    ww.splice(i, 2, tw);
    idx.splice(i, 2, idx[i]);
    if (i > 0) i--;
  }
  // expand back to the original length
  const out: number[] = [];
  for (let k = 0; k < v.length; k++) {
    const count = Math.round(ww[k] / w[0]);
    for (let j = 0; j < count; j++) out.push(v[k]);
  }
  while (out.length < ys.length) out.push(v[v.length - 1]);
  return out.slice(0, ys.length);
}

type Thr =
  | { kind: 'value'; deg: number }
  | { kind: 'below'; deg: number }
  | { kind: 'above'; deg: number };

// read the 75 percent point off a monotonised accuracy curve, interpolating in log tilt
function threshold(accs: number[]): Thr {
  const ds = DELTAS as unknown as number[];
  if (accs[0] >= CRIT) return { kind: 'below', deg: ds[0] };
  for (let i = 1; i < accs.length; i++) {
    if (accs[i] >= CRIT) {
      const lo = accs[i - 1];
      const hi = accs[i];
      const f = hi - lo < 1e-9 ? 1 : (CRIT - lo) / (hi - lo);
      const t = Math.log(ds[i - 1]) + f * (Math.log(ds[i]) - Math.log(ds[i - 1]));
      return { kind: 'value', deg: Math.exp(t) };
    }
  }
  return { kind: 'above', deg: ds[ds.length - 1] };
}

function thrText(t: Thr) {
  if (t.kind === 'value') return deg(t.deg);
  if (t.kind === 'below') return `< ${deg(t.deg)}`;
  return `> ${deg(t.deg)}`;
}

// ---- rendering ------------------------------------------------------------
//
// Nothing on this page is drawn with a path. Both patches are computed straight into the pixel
// buffer from a cosine with a Gaussian envelope, so a vertical carrier and a forty five degree
// carrier get exactly the same treatment and neither one gets a crisp pixel row for free. Ordered
// dithering afterwards, so the grey levels between two integers still exist on average.

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function drawStage(
  canvas: HTMLCanvasElement,
  leftDeg: number | null,
  rightDeg: number | null,
  show: boolean,
  aspect = 0.5
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 340;
  const cssH = Math.round(cssW * aspect);
  const W = Math.max(2, Math.round(cssW * dpr));
  const H = Math.max(2, Math.round(cssH * dpr));
  canvas.width = W;
  canvas.height = H;
  canvas.style.height = `${cssH}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = ctx.createImageData(W, H);
  const d = img.data;
  const m = 128; // mid grey, the mean of every patch and of the field itself
  const cx = [W * 0.27, W * 0.73];
  const cy = H * 0.5;
  const R = Math.min(W * 0.21, H * 0.42);
  const sigma = R * 0.36;
  const k = (Math.PI * 2 * CYCLES) / (2 * R);
  const amp = CONTRAST * m;
  const arm = 7 * dpr;
  const th = Math.max(1, Math.round(dpr));

  const angles = [leftDeg, rightDeg];
  const dirs = angles.map((a) => {
    if (a === null) return null;
    const r = (a * Math.PI) / 180;
    // screen coordinates, y downward: turning this direction vector from (1,0) toward (0,1)
    // turns the bars clockwise, which is what "further clockwise" means to the person looking
    return { ux: Math.cos(r), uy: Math.sin(r) };
  });

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = m;
      if (show) {
        for (let s = 0; s < 2; s++) {
          const dir = dirs[s];
          if (!dir) continue;
          const dx = x - cx[s];
          const dy = y - cy;
          const r2 = dx * dx + dy * dy;
          if (r2 <= R * R) {
            const env = Math.exp(-r2 / (2 * sigma * sigma));
            v = m + amp * Math.cos(k * (dx * dir.ux + dy * dir.uy)) * env;
          }
        }
      }
      // fixation cross, neutral and dark, identical in every view
      const fx = Math.abs(x - W * 0.5);
      const fy = Math.abs(y - cy);
      if ((fx < th && fy < arm) || (fy < th && fx < arm)) v = 92;

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

function PatchPair({
  left,
  right,
  show,
  aspect = 0.5,
}: {
  left: number | null;
  right: number | null;
  show: boolean;
  aspect?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    drawStage(cv, left, right, show, aspect);
  }, [left, right, show, aspect]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const onResize = () => drawStage(cv, left, right, show, aspect);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [left, right, show, aspect]);

  return <canvas ref={ref} style={{ width: '100%', display: 'block' }} className="rounded-md" />;
}

// ---- trials ---------------------------------------------------------------

type Trial = {
  cls: Cls;
  delta: number;
  refDeg: number;
  cwSide: 0 | 1; // which side carries the patch rotated further clockwise
  leftDeg: number;
  rightDeg: number;
};

function buildTrial(cls: Cls, delta: number, refIdx: number): Trial {
  const refDeg = REFS[cls][refIdx % 2] + rnd(-JITTER, JITTER);
  const cwSide: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
  return {
    cls,
    delta,
    refDeg,
    cwSide,
    leftDeg: cwSide === 0 ? refDeg + delta : refDeg,
    rightDeg: cwSide === 0 ? refDeg : refDeg + delta,
  };
}

function buildRun(reps: number): Trial[] {
  const ts: Trial[] = [];
  for (const cls of ['cardinal', 'oblique'] as Cls[]) {
    for (const delta of DELTAS) {
      for (let i = 0; i < reps; i++) ts.push(buildTrial(cls, delta, i));
    }
  }
  return shuffle(ts);
}

type Rec = {
  block: Block;
  cls: Cls;
  delta: number;
  said: 0 | 1;
  correct: boolean;
  rt: number;
};

type Ratio = { kind: 'value' | 'atleast' | 'none'; x: number };

type Score = {
  rawCard: number[];
  rawObl: number[];
  monoCard: number[];
  monoObl: number[];
  thrCard: Thr;
  thrObl: Thr;
  ratio: Ratio;
  obs: number;
  p: number;
  pFloor: number;
  trusted: boolean;
  easiestCard: number;
  leftRate: number;
  rtCard: number;
  rtObl: number;
  n: number;
  reps: number;
};

// ---- component ------------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<'intro' | 'demo' | 'trials' | 'result'>('intro');
  const [block, setBlock] = useState<Block>('upright');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [view, setView] = useState<View>('blank');
  const [recs, setRecs] = useState<Rec[]>([]);
  const [demoTrials, setDemoTrials] = useState<Trial[]>([]);
  const [demoIdx, setDemoIdx] = useState(0);
  const [demoFeedback, setDemoFeedback] = useState<null | { right: boolean; cwSide: 0 | 1 }>(null);
  const [copied, setCopied] = useState(false);

  // Which pair the response buttons currently belong to. A pair is only answerable once its own
  // presentation has finished, which closes two holes at once: the buttons are left over on screen
  // for a frame at the start of every pair, and the gap after an answer is another window where
  // they are still up. Both would take a response for a pair nobody saw.
  const [respondKey, setRespondKey] = useState(-999);

  const timers = useRef<number[]>([]);
  const shownAt = useRef(0);
  // One answer per pair. Without this, a second click or key press inside the gap between answering
  // and the next pair starting records a response for a pair nobody saw, and can walk the index
  // past the end of the run.
  const answeredFor = useRef(-1);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const trial = phase === 'demo' ? demoTrials[demoIdx] ?? null : trials[tIdx] ?? null;
  const trialKey = phase === 'demo' ? -100 - demoIdx : tIdx;

  const runSequence = useCallback(
    (key: number) => {
      clearTimers();
      setRespondKey(-999);
      setView('fix');
      timers.current.push(
        window.setTimeout(() => setView('patches'), FIX_MS),
        window.setTimeout(() => {
          setView('blank');
          shownAt.current = performance.now();
          setRespondKey(key);
        }, FIX_MS + SHOW_MS)
      );
    },
    [clearTimers]
  );

  const beginDemo = useCallback(() => {
    const ds = [
      buildTrial('cardinal', 12, 0),
      buildTrial('oblique', 12, 0),
      buildTrial('cardinal', 6, 1),
    ];
    answeredFor.current = -1;
    setDemoTrials(ds);
    setDemoIdx(0);
    setDemoFeedback(null);
    setPhase('demo');
  }, []);

  const beginRun = useCallback((b: Block) => {
    answeredFor.current = -1;
    setBlock(b);
    setTrials(buildRun(b === 'upright' ? REPS : TILT_REPS));
    setTIdx(0);
    if (b === 'upright') setRecs([]);
    else setRecs((r) => r.filter((x) => x.block === 'upright'));
    setPhase('trials');
  }, []);

  // if the index ever walks off the end, finish rather than showing an empty stage
  useEffect(() => {
    if (phase === 'trials' && trials.length > 0 && tIdx >= trials.length) setPhase('result');
  }, [phase, tIdx, trials.length]);

  // kick the sequence whenever a new pair comes up
  useEffect(() => {
    if ((phase === 'trials' || phase === 'demo') && trial && !demoFeedback) runSequence(trialKey);
  }, [phase, trialKey, trial, demoFeedback, runSequence]);

  const answer = useCallback(
    (said: 0 | 1) => {
      if (!trial || view !== 'blank') return;
      const key = trialKey;
      if (respondKey !== key) return;
      if (answeredFor.current === key) return;
      answeredFor.current = key;
      const rt = performance.now() - shownAt.current;
      const correct = said === trial.cwSide;

      if (phase === 'demo') {
        setDemoFeedback({ right: correct, cwSide: trial.cwSide });
        return;
      }

      setRecs((r) => [...r, { block, cls: trial.cls, delta: trial.delta, said, correct, rt }]);
      clearTimers();
      setView('blank');
      if (tIdx + 1 >= trials.length) {
        timers.current.push(window.setTimeout(() => setPhase('result'), GAP_MS));
      } else {
        timers.current.push(window.setTimeout(() => setTIdx((i) => i + 1), GAP_MS));
      }
    },
    [trial, view, phase, tIdx, trialKey, respondKey, trials.length, clearTimers, block]
  );

  // keyboard: left and right arrows, or f and j for the touch typists
  useEffect(() => {
    if (phase !== 'trials' && phase !== 'demo') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'f' || e.key === 'F') answer(0);
      if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') answer(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, answer]);

  // ---- scoring ----

  const scoreBlock = useCallback((rs: Rec[], reps: number): Score | null => {
    if (!rs.length) return null;
    const ds = DELTAS as unknown as number[];

    const cell = (cls: Cls, delta: number) => rs.filter((r) => r.cls === cls && r.delta === delta);
    const acc = (cls: Cls, delta: number) => {
      const c = cell(cls, delta);
      return c.length ? c.filter((r) => r.correct).length / c.length : 0.5;
    };

    const rawCard = ds.map((d) => acc('cardinal', d));
    const rawObl = ds.map((d) => acc('oblique', d));
    const w = ds.map(() => 1);
    const monoCard = pava(rawCard, w);
    const monoObl = pava(rawObl, w);

    const thrCard = threshold(monoCard);
    const thrObl = threshold(monoObl);

    // exact permutation null for the mean accuracy difference across the four tilt levels
    const parts = ds.map((d) => {
      const c = cell('cardinal', d);
      const o = cell('oblique', d);
      const K = c.filter((r) => r.correct).length + o.filter((r) => r.correct).length;
      return { dist: rateDiffDist(c.length, o.length, K), w: 1 / ds.length };
    });
    const dist = combine(parts);
    const obs = ds.reduce((s, d, i) => s + (rawCard[i] - rawObl[i]) / ds.length, 0);
    const p = tailP(dist, obs);

    const easiestCard = rawCard[ds.length - 1];
    const trusted = easiestCard >= LAPSE_FLOOR;

    const leftRate = rs.filter((r) => r.said === 0).length / rs.length;

    const ratio =
      thrCard.kind === 'value' && thrObl.kind === 'value'
        ? { kind: 'value' as const, x: thrObl.deg / thrCard.deg }
        : thrCard.kind === 'value' && thrObl.kind === 'above'
          ? { kind: 'atleast' as const, x: thrObl.deg / thrCard.deg }
          : thrCard.kind === 'below' && thrObl.kind === 'value'
            ? { kind: 'atleast' as const, x: thrObl.deg / thrCard.deg }
            : thrCard.kind === 'below' && thrObl.kind === 'above'
              ? { kind: 'atleast' as const, x: thrObl.deg / thrCard.deg }
              : { kind: 'none' as const, x: 0 };

    return {
      rawCard,
      rawObl,
      monoCard,
      monoObl,
      thrCard,
      thrObl,
      ratio,
      obs,
      p,
      pFloor: pFloor(dist),
      trusted,
      easiestCard,
      leftRate,
      rtCard: median(rs.filter((r) => r.cls === 'cardinal').map((r) => r.rt)),
      rtObl: median(rs.filter((r) => r.cls === 'oblique').map((r) => r.rt)),
      n: rs.length,
      reps,
    };
  }, []);

  const upright = useMemo(
    () => (phase === 'result' ? scoreBlock(recs.filter((r) => r.block === 'upright'), REPS) : null),
    [phase, recs, scoreBlock]
  );
  const tilted = useMemo(
    () => (phase === 'result' ? scoreBlock(recs.filter((r) => r.block === 'tilted'), TILT_REPS) : null),
    [phase, recs, scoreBlock]
  );

  const onCopy = useCallback(() => {
    if (!upright) return;
    const line = [
      'Not Every Angle · the oblique effect · wiz.jock.pl',
      `near vertical and horizontal, smallest tilt I could call: ${thrText(upright.thrCard)}`,
      `near the diagonals: ${thrText(upright.thrObl)}`,
      upright.ratio.kind === 'none'
        ? 'the ratio was off the scale this run'
        : `${upright.ratio.kind === 'atleast' ? 'at least ' : ''}${upright.ratio.x.toFixed(1)}x worse at forty five degrees`,
      `48 trials, exact permutation test, ${pText(upright.p)}. Nothing left my browser.`,
    ].join('\n');
    navigator.clipboard.writeText(line).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [upright]);

  const showPatches = view === 'patches';
  const canRespond = view === 'blank' && respondKey === trialKey && !demoFeedback;
  const progress = trials.length ? tIdx / trials.length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">📐</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Not Every Angle</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Your sense of tilt is several times finer near vertical than it is at forty five degrees.
            Not today, not because you are tired. Always. This measures the size of it on your own eyes.
          </p>
        </div>

        {/* intro */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Two round patches of stripes, side by side, for four tenths of a second. One of them is
                rotated a little further <span className="text-cyan-300">clockwise</span> than the other.
                Your job is to say which one, every time.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Half the pairs sit near <span className="text-cyan-300">vertical or horizontal</span>. Half
                sit near the <span className="text-violet-300">diagonals</span>. Same difference in tilt,
                same patches, same second of viewing. The only thing that changes is where on the circle
                the pair happens to be sitting.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The tilt difference goes down to a degree and a half, which is the width of a pencil line
                held at arm&apos;s length. You will get some of those wrong, and that is the measurement,
                not a failure.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
                how it runs
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">Three practice pairs</span> with the answer shown
                  afterwards, so the question is unambiguous before anything counts.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">Forty eight pairs</span>, shuffled. Four tilt
                  differences, six pairs each in each of the two classes.
                </li>
                <li>
                  2️⃣ One question every time: <span className="text-slate-100">which patch is further
                  clockwise</span>. Arrow keys work, and so do{' '}
                  <span className="font-mono text-cyan-300">F</span> and{' '}
                  <span className="font-mono text-cyan-300">J</span>.
                </li>
                <li>
                  3️⃣ Guessing scores fifty percent, so the curve tells you where guessing stopped.
                </li>
                <li>
                  4️⃣ The headline is a <span className="text-emerald-300">ratio</span>: the smallest tilt
                  you can call on the diagonals, divided by the same number at vertical.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                what keeps this honest
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  🔬 <span className="text-slate-300">Nothing here is drawn.</span> A pixel grid has its
                  own vertical and horizontal, and a rasteriser would hand you a fake cardinal advantage.
                  Every patch is computed pixel by pixel from a cosine, so no orientation gets a crisper
                  representation than any other.
                </li>
                <li>
                  🎯 The headline is a ratio of{' '}
                  <span className="text-slate-300">two numbers measured on the same eyes</span>, same
                  screen, same minute. Your distance, your display and your patience sit in both and
                  cancel.
                </li>
                <li>
                  🎲 The reference orientation is <span className="text-slate-300">jittered a few
                  degrees</span> on every single pair, so no exact alignment ever repeats.
                </li>
                <li>
                  🪞 Which side carries the further clockwise patch is random, and{' '}
                  <span className="text-slate-300">how often you pressed left</span> is printed with your
                  result.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={beginDemo}
                className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-4 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
              >
                three practice pairs first →
              </button>
              <button
                onClick={() => beginRun('upright')}
                className="w-full rounded-md border border-slate-700 bg-slate-900/40 py-2 font-mono text-xs text-slate-500 transition-colors hover:border-slate-600"
              >
                skip the practice, start the forty eight
              </button>
            </div>
          </div>
        )}

        {/* demo and trials */}
        {(phase === 'demo' || phase === 'trials') && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">
                {phase === 'demo' ? `practice ${demoIdx + 1} / ${demoTrials.length}` : `${tIdx + 1} / ${trials.length}`}
              </span>
              <span className="text-slate-600">
                {phase === 'demo'
                  ? 'answers shown'
                  : block === 'tilted'
                    ? 'head tilted block'
                    : 'which one is further clockwise'}
              </span>
            </div>

            {!demoFeedback && (
              <>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <PatchPair
                    left={trial ? trial.leftDeg : null}
                    right={trial ? trial.rightDeg : null}
                    show={showPatches}
                  />
                </div>
                <p className="text-center font-mono text-xs text-slate-600">
                  {view === 'fix' ? 'watch the cross' : view === 'patches' ? '' : canRespond ? 'which one?' : ''}
                </p>
              </>
            )}

            {canRespond && (
              <div className="space-y-3">
                <p className="text-center text-sm text-slate-300">
                  Which patch was tilted further clockwise?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => answer(0)}
                    className="rounded-md border border-slate-700 bg-slate-900/60 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10"
                  >
                    ← left <span className="text-slate-600">· F</span>
                  </button>
                  <button
                    onClick={() => answer(1)}
                    className="rounded-md border border-slate-700 bg-slate-900/60 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-violet-400/60 hover:bg-violet-400/10"
                  >
                    right → <span className="text-slate-600">· J</span>
                  </button>
                </div>
                <p className="text-center font-mono text-[11px] text-slate-600">
                  clockwise means the top of the stripes leaned further to the right
                </p>
              </div>
            )}

            {demoFeedback && trial && (
              <div className="space-y-3">
                <p
                  className={`text-center font-mono text-sm ${
                    demoFeedback.right ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {demoFeedback.right ? '✓ that was it' : '✗ the other one'}
                </p>
                <p className="text-center text-xs text-slate-500">
                  The further clockwise patch was on the{' '}
                  <span className="font-mono text-slate-300">
                    {demoFeedback.cwSide === 0 ? 'left' : 'right'}
                  </span>
                  , by <span className="font-mono text-slate-300">{trial.delta}°</span>, sitting{' '}
                  <span className="font-mono text-slate-300">{CLS_LABEL[trial.cls]}</span>
                </p>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <PatchPair left={trial.leftDeg} right={trial.rightDeg} show />
                </div>
                <p className="text-center font-mono text-[11px] text-slate-600">
                  no time limit on this one, look as long as you like
                </p>
                {demoIdx + 1 < demoTrials.length ? (
                  <button
                    onClick={() => {
                      setDemoFeedback(null);
                      setDemoIdx((i) => i + 1);
                    }}
                    className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                  >
                    next practice pair →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDemoFeedback(null);
                      beginRun('upright');
                    }}
                    className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                  >
                    start the forty eight →
                  </button>
                )}
              </div>
            )}

            {phase === 'trials' && (
              <>
                <div className="h-1 w-full overflow-hidden rounded bg-slate-900">
                  <div className="h-full bg-violet-400/60 transition-all" style={{ width: `${progress * 100}%` }} />
                </div>
                <button
                  onClick={() => {
                    clearTimers();
                    setPhase('intro');
                    setView('blank');
                    setRecs([]);
                    setTrials([]);
                    setTIdx(0);
                  }}
                  className="w-full rounded-md border border-slate-700 bg-slate-900/40 py-2 font-mono text-xs text-slate-500 hover:border-slate-600"
                >
                  stop and go back
                </button>
              </>
            )}
          </div>
        )}

        {/* result */}
        {phase === 'result' && upright && (
          <div className="space-y-6">
            {/* headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6">
              <div className="text-center font-mono text-xs uppercase tracking-wider text-cyan-300/70">
                how much worse you are at forty five degrees
              </div>
              <div className="mt-3 text-center">
                <div className="font-mono text-6xl font-bold text-cyan-200">
                  {upright.ratio.kind === 'none'
                    ? '—'
                    : `${upright.ratio.kind === 'atleast' ? '≥' : ''}${upright.ratio.x.toFixed(1)}×`}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-500">
                  diagonal threshold ÷ cardinal threshold · published values usually land between 1.5 and 2.5
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-cyan-500/40 bg-cyan-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80">cardinal</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-cyan-200">
                    {thrText(upright.thrCard)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    smallest tilt you could call near vertical and horizontal
                  </div>
                </div>
                <div className="rounded-md border border-violet-500/40 bg-violet-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-violet-300/80">oblique</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-violet-200">
                    {thrText(upright.thrObl)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    the same measurement, sitting on the diagonals
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-slate-700/60 bg-slate-900/50 p-4 text-center">
                <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  cardinal advantage, averaged over all four tilt levels
                </div>
                <div className="mt-1 font-mono text-3xl font-bold text-slate-100">
                  {upright.obs >= 0 ? '+' : ''}
                  {Math.round(upright.obs * 100)} points
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-500">
                  exact permutation test · {pText(upright.p)}
                  {upright.p > 0.02 ? ` · the smallest p this many trials could give is ${upright.pFloor.toFixed(3)}` : ''}
                </div>
              </div>
            </div>

            {/* what happened */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">what happened</div>
              <div className="space-y-3 text-sm leading-relaxed">
                {!upright.trusted && (
                  <div className="flex items-start gap-2">
                    <span>⚠️</span>
                    <span className="text-slate-300">
                      <span className="text-slate-100">This run is printed, not scored.</span> You got{' '}
                      {pct(upright.easiestCard)} of the easiest cardinal pairs right, where twelve degrees
                      is a tilt nobody should miss. That points at the instruction, the screen or a wandering
                      minute rather than at your orientation machinery, and every number below inherits it.
                    </span>
                  </div>
                )}
                {upright.trusted && upright.ratio.kind === 'none' && (
                  <div className="flex items-start gap-2">
                    <span>📏</span>
                    <span className="text-slate-300">
                      Both thresholds fell off the end of the scale this run, so there is no ratio to print.
                      Either a degree and a half was already easy for you at both orientations, or twelve was
                      still hard at both. Run it again and the four levels will bracket you better, because
                      randomness moves a six trial cell a long way.
                    </span>
                  </div>
                )}
                {upright.trusted && upright.ratio.kind !== 'none' && upright.ratio.x >= 1.25 && (
                  <div className="flex items-start gap-2">
                    <span>📐</span>
                    <span className="text-slate-300">
                      You showed the oblique effect. The same physical difference in tilt, presented for the
                      same four tenths of a second, needed to be{' '}
                      <span className="text-cyan-300">{upright.ratio.x.toFixed(1)} times bigger</span> on the
                      diagonals before you could call it. Nothing about the patches changed except where on
                      the circle they sat.
                    </span>
                  </div>
                )}
                {upright.trusted && upright.ratio.kind !== 'none' && upright.ratio.x < 1.25 && upright.ratio.x > 0.8 && (
                  <div className="flex items-start gap-2">
                    <span>🤨</span>
                    <span className="text-slate-300">
                      Your two thresholds came out close to equal. Real possibilities, in order of how often
                      they are the answer: six trials a level is thin and this run was noisy, your screen was
                      far enough away that the easy levels were all easy, or you genuinely have a small
                      anisotropy, which happens and is interesting. The permutation test above is the honest
                      arbiter, and it says {pText(upright.p)}.
                    </span>
                  </div>
                )}
                {upright.trusted && upright.ratio.kind !== 'none' && upright.ratio.x <= 0.8 && (
                  <div className="flex items-start gap-2">
                    <span>🔄</span>
                    <span className="text-slate-300">
                      You came out better on the diagonals, which is the opposite of the published pattern and
                      most likely noise at this trial count. It is worth one more run before believing it. If
                      it repeats, the thing to suspect is your posture: a head permanently cocked a few degrees
                      moves the whole function.
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span>👆</span>
                  <span className="text-slate-400">
                    You pressed left on {pct(upright.leftRate)} of trials, and the correct answer was left on
                    about half by construction. A side habit shows up as a curve that never climbs, not as a
                    score, which is why this number is printed rather than corrected for.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>⏱️</span>
                  <span className="text-slate-400">
                    Median time to answer: {Math.round(upright.rtCard)} ms at the cardinals,{' '}
                    {Math.round(upright.rtObl)} ms on the diagonals. There was no time pressure, so this is
                    hesitation rather than speed, and hesitation usually tracks difficulty.
                  </span>
                </div>
              </div>
            </div>

            {/* the two curves */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
                your two accuracy curves
              </div>
              <div className="space-y-3">
                {(DELTAS as unknown as number[]).map((d, i) => (
                  <div key={d} className="grid grid-cols-[auto_1fr_1fr] items-center gap-3">
                    <span className="w-12 shrink-0 text-right font-mono text-[11px] text-slate-500">{d}°</span>
                    <span className="block">
                      <span className="mb-1 block font-mono text-[10px] text-cyan-300/70">
                        cardinal {pct(upright.rawCard[i])}
                      </span>
                      <span className="block h-1.5 rounded bg-slate-800">
                        <span
                          className="block h-full rounded bg-cyan-400/60"
                          style={{ width: `${Math.max(0, (upright.rawCard[i] - 0.5) * 2) * 100}%` }}
                        />
                      </span>
                    </span>
                    <span className="block">
                      <span className="mb-1 block font-mono text-[10px] text-violet-300/70">
                        oblique {pct(upright.rawObl[i])}
                      </span>
                      <span className="block h-1.5 rounded bg-slate-800">
                        <span
                          className="block h-full rounded bg-violet-400/60"
                          style={{ width: `${Math.max(0, (upright.rawObl[i] - 0.5) * 2) * 100}%` }}
                        />
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                Bars run from chance to perfect, so an empty bar is guessing and a full bar is every trial
                correct. Six trials per bar, which means one trial is seventeen points: read the shape, not
                the wiggles. The thresholds above come from these curves after pooling any level that came
                out lower than the one below it, because a psychometric function cannot really go down as
                the tilt gets bigger.
              </p>
            </div>

            {/* head tilt block */}
            <HeadTilt
              onStart={() => beginRun('tilted')}
              upright={upright}
              tilted={tilted}
            />

            {/* share */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCopy}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '📋 copy the result'}
              </button>
              <button
                onClick={() => {
                  clearTimers();
                  setPhase('intro');
                  setView('blank');
                  setRecs([]);
                  setTrials([]);
                  setTIdx(0);
                }}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <SameDifferenceTwice />
            <TheTour />

            {/* the argument */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                the argument this page cannot settle
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-slate-500">
                <p>
                  <span className="text-slate-400">The world wrote it.</span> Coppola, Purves, McCoy and
                  Purves measured the orientation content of real scenes in 1998 and found more energy at
                  vertical and horizontal than anywhere else, which is what a planet with gravity and a
                  species with walls produces. Girshick, Landy and Simoncelli took that to behaviour in
                  2011: human orientation errors look like a Bayesian observer carrying exactly that
                  environmental prior, sharpest where the world is densest. On this reading your anisotropy
                  is not a defect at all, it is a visual system spending its resolution where the evidence
                  is.
                </p>
                <p>
                  <span className="text-slate-400">And the world can rewrite it.</span> Annis and Frost
                  published the awkward result in Science in 1973: Cree observers who grew up in an
                  environment without carpentered right angles showed the anisotropy much reduced. If the
                  effect were wired in it should not care where you were raised. That points at
                  development, at years of looking, at a prior learned rather than inherited.
                </p>
                <p>
                  <span className="text-slate-400">The hardware is real either way.</span> Li, Peterson and
                  Freeman recorded cat V1 in 2003 and found more cells, more sharply tuned, at the
                  cardinals. Furmanski and Engel found a larger cardinal response in human V1 with fMRI in
                  2000. Nobody disputes that the tissue is uneven. What is still argued is whether the
                  unevenness was installed at the factory or laid down by a childhood spent indoors.
                </p>
                <p>
                  Your number is consistent with both, and a page that told you otherwise would be lying to
                  you. The head tilt block above is the one piece of the argument you can actually run
                  yourself, and it asks a different question: not where the bias came from, but which frame
                  it is nailed to.
                </p>
              </div>
            </div>

            {/* caveats */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">what this is not</div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-500">
                <li>
                  <span className="text-slate-400">Six trials a cell is a demonstration.</span> The studies
                  this is built from run hundreds of trials per person with a staircase that hunts the
                  threshold instead of four fixed levels that hope to bracket it. At this length a single
                  lucky guess moves a bar by seventeen points.
                </li>
                <li>
                  <span className="text-slate-400">Your screen has corners.</span> A rectangular frame is a
                  free reference for vertical and useless on a diagonal, so some part of a cardinal
                  advantage can belong to your monitor. The patches are round and the judgment is between
                  two things shown at once, which removes the need for an external reference, but it does
                  not remove the frame from the room.
                </li>
                <li>
                  <span className="text-slate-400">Distance is not controlled.</span> A phone at arm&apos;s
                  length and a monitor at sixty centimetres are different experiments in absolute terms.
                  Both thresholds move together when you lean back, which is exactly why the headline is
                  their ratio and not either one alone.
                </li>
                <li>
                  <span className="text-slate-400">Nobody tilts as far as they think.</span> If you ran the
                  head tilt block, you almost certainly tilted less than forty five degrees, and a partial
                  tilt shrinks the result toward the middle rather than making it wrong. Treat that block as
                  a direction, not a measurement.
                </li>
                <li>
                  <span className="text-slate-400">This is not an eye test.</span> Astigmatism produces its
                  own orientation anisotropy, and an uncorrected one can dwarf the effect this page is
                  looking for. If your two numbers are wildly apart in a direction that surprises you, an
                  optometrist has better instruments than a canvas element.
                </li>
                <li>
                  <span className="text-slate-400">Nothing left your browser.</span> Every patch was
                  computed on your machine, shown once and forgotten. There is no server here.
                </li>
              </ul>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">the rest of the lab</div>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                This is the third piece in the lab that lives on orientation, and it is the odd one.{' '}
                <span className="text-slate-400">Off True</span> moved your vertical with half a minute of
                staring. <span className="text-slate-400">One Before</span> caught the last thing you judged
                dragging the next one toward it. Those are things that happen to the ruler. This one says
                the ruler was never evenly marked in the first place.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/off-true" className="text-cyan-400/80 hover:text-cyan-300">
                  Off True
                </a>
                <a href="/experiments/one-before" className="text-cyan-400/80 hover:text-cyan-300">
                  The One Before
                </a>
                <a href="/experiments/hyperacuity" className="text-cyan-400/80 hover:text-cyan-300">
                  Hyperacuity
                </a>
                <a href="/experiments/faintest-thing" className="text-cyan-400/80 hover:text-cyan-300">
                  The Faintest Thing
                </a>
                <a href="/experiments/only-right-way-up" className="text-cyan-400/80 hover:text-cyan-300">
                  Only Right Way Up
                </a>
                <a href="/experiments/crowding-zone" className="text-cyan-400/80 hover:text-cyan-300">
                  The Crowding Zone
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a href="/experiments" className="font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
                ← back to all experiments
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- the head tilt block --------------------------------------------------
//
// The one piece of the argument the person can run on themselves. Tilt your head onto your shoulder
// and the screen cardinals become retinal diagonals. If the anisotropy belongs to the retina it
// should travel with the head and abandon the screen. If it belongs to the room it should stay put.
// This is a real question with a genuinely mixed literature, and twenty four trials will not close
// it, which the panel says out loud.

function HeadTilt({
  onStart,
  upright,
  tilted,
}: {
  onStart: () => void;
  upright: Score;
  tilted: Score | null;
}) {
  return (
    <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.04] p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-300/80">
        the block you can run against yourself
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Everything above measured orientations on a screen. But a screen is not the only frame in the
        room, and neither is your head. Put your ear on your shoulder, as far as it will comfortably go,
        and run twenty four more pairs. The patches on the screen do not move. Your retina does.
      </p>
      <p className="mb-4 text-xs leading-relaxed text-slate-400">
        If your advantage follows the <span className="text-emerald-300">retina</span>, the screen
        cardinals should lose it, because tilted onto your shoulder they land on your diagonals. If it
        follows the <span className="text-emerald-300">room</span>, it should stay exactly where it was.
        Studies have been tilting heads at this question since the seventies and the answer is still
        mixed, which is a much more interesting thing to hand you than a verdict.
      </p>

      {!tilted && (
        <button
          onClick={onStart}
          className="w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-3 font-mono text-xs text-emerald-200 hover:bg-emerald-400/20"
        >
          tilt your head, then run twenty four more →
        </button>
      )}

      {tilted && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-slate-700/60 bg-slate-900/50 p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">head upright</div>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-100">
                {upright.ratio.kind === 'none' ? '—' : `${upright.ratio.x.toFixed(1)}×`}
              </div>
              <div className="mt-1 font-mono text-[10px] text-slate-600">screen diagonals ÷ screen cardinals</div>
            </div>
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/[0.07] p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">head tilted</div>
              <div className="mt-1 font-mono text-2xl font-bold text-emerald-200">
                {tilted.ratio.kind === 'none' ? '—' : `${tilted.ratio.x.toFixed(1)}×`}
              </div>
              <div className="mt-1 font-mono text-[10px] text-slate-600">the same two screen orientations</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            {tilted.ratio.kind === 'none' || upright.ratio.kind === 'none' ? (
              <>
                One of the two blocks did not produce a usable threshold, so there is nothing to compare.
                Twenty four trials is a very short block and this happens often.
              </>
            ) : tilted.ratio.x < upright.ratio.x * 0.75 ? (
              <>
                Your screen advantage <span className="text-emerald-300">shrank when you tilted</span>, which
                is what a retinal anisotropy does: the good orientations went with your head and left the
                screen behind. Read it as a direction, not a proof. Twenty four trials, and you almost
                certainly tilted less than you meant to.
              </>
            ) : tilted.ratio.x > upright.ratio.x * 1.25 ? (
              <>
                Your screen advantage <span className="text-emerald-300">grew when you tilted</span>, which is
                not what either simple story predicts and is most likely the noise in a twenty four trial
                block. A tilted head is also harder work, and effort is not free.
              </>
            ) : (
              <>
                Your advantage <span className="text-emerald-300">stayed with the screen</span>, which is what
                a room anchored effect looks like: gravity, the frame, or the habit of a lifetime of upright
                walls. It is also what a small or partial head tilt looks like, and this page cannot tell
                those apart.
              </>
            )}
          </p>
          <p className="font-mono text-[11px] text-slate-600">
            tilted block: {tilted.n} trials · cardinal {thrText(tilted.thrCard)} · oblique{' '}
            {thrText(tilted.thrObl)} · {pText(tilted.p)}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- the payoff panel -----------------------------------------------------
//
// The same physical difference, twice, with no time limit and no mask. Obvious at the top, most
// people cannot find it at the bottom. Nothing changes between the two rows except where on the
// circle they sit.

function SameDifferenceTwice() {
  const [delta, setDelta] = useState(4);
  const [base, setBase] = useState(0);

  useEffect(() => {
    setBase(rnd(-JITTER, JITTER));
  }, []);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
        the same difference, twice
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-500">
        Both rows contain exactly the same tilt difference, computed from the same numbers. Look as long
        as you like. Nothing is timed, nothing is masked, nothing is hidden. The top row is near
        vertical. The bottom row is on the diagonal. Turn the difference down until one of them goes and
        the other stays, which for most people happens somewhere around two or three degrees.
      </p>
      <div className="space-y-3">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300/70">near vertical</div>
          <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
            <PatchPair left={base} right={base + delta} show aspect={0.42} />
          </div>
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-violet-300/70">
            on the diagonal
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
            <PatchPair left={45 + base} right={45 + base + delta} show aspect={0.42} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="w-14 shrink-0 font-mono text-[11px] text-slate-500">0.5°</span>
        <input
          type="range"
          min={0.5}
          max={12}
          step={0.5}
          value={delta}
          onChange={(e) => setDelta(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded bg-slate-700 accent-cyan-400"
        />
        <span className="w-14 shrink-0 text-right font-mono text-[11px] text-slate-500">12°</span>
      </div>
      <div className="mt-2 text-center font-mono text-xs text-slate-500">
        {delta.toFixed(1)}° between the two patches in each row
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        In the right patch of each row the whole carrier is rotated by that many degrees and nothing else
        is touched: same contrast, same envelope, same size, same mean grey. If the bottom row goes first,
        you have just watched your own resolution run out on one part of a circle while it kept going on
        another.
      </p>
    </div>
  );
}

// ---- the playground -------------------------------------------------------
//
// Method of adjustment, all the way around the circle. Pick a reference orientation, wind the
// difference down until it disappears, mark the point, move on. After a few points the shape of your
// own function appears: two dips at the cardinals, two humps in between.

type TourPoint = { ref: number; delta: number };

function TheTour() {
  const [ref, setRef] = useState(0);
  const [delta, setDelta] = useState(8);
  const [points, setPoints] = useState<TourPoint[]>([]);

  const mark = useCallback(() => {
    setPoints((ps) => {
      const kept = ps.filter((p) => Math.abs(p.ref - ref) > 4);
      return [...kept, { ref, delta }].sort((a, b) => a.ref - b.ref);
    });
    // move on to a reference that has not been visited yet
    const visited = new Set(points.map((p) => Math.round(p.ref / 15) * 15));
    const candidates = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].filter(
      (a) => !visited.has(a) && a !== ref
    );
    if (candidates.length) setRef(candidates[Math.floor(Math.random() * candidates.length)]);
  }, [ref, delta, points]);

  const maxDelta = points.length ? Math.max(...points.map((p) => p.delta), 4) : 12;

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.04] p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/80">
        the playground · draw your own function
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        No trials, no scoring, no time limit. Pick where on the circle to stand, then wind the difference
        down until the two patches look identical, and back up until you can just call it. Mark it. Do
        that at six or eight places and the shape underneath the whole experiment appears: your
        resolution is not a number, it is a function of angle, with two dips and two humps.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
        <PatchPair left={ref} right={ref + delta} show aspect={0.44} />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-[11px] text-slate-500">where</span>
          <input
            type="range"
            min={0}
            max={165}
            step={15}
            value={ref}
            onChange={(e) => setRef(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded bg-slate-700 accent-violet-400"
          />
          <span className="w-14 shrink-0 text-right font-mono text-[11px] text-slate-400">{ref}°</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-[11px] text-slate-500">difference</span>
          <input
            type="range"
            min={0.25}
            max={16}
            step={0.25}
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded bg-slate-700 accent-cyan-400"
          />
          <span className="w-14 shrink-0 text-right font-mono text-[11px] text-slate-400">
            {delta.toFixed(2)}°
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={mark}
            className="rounded-md border border-violet-400/50 bg-violet-400/10 py-2 font-mono text-xs text-violet-200 hover:bg-violet-400/20"
          >
            this is my smallest here
          </button>
          <button
            onClick={() => setPoints([])}
            className="rounded-md border border-slate-700 bg-slate-900/60 py-2 font-mono text-xs text-slate-400 hover:border-slate-600"
          >
            ↻ clear the points
          </button>
        </div>
      </div>

      {points.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            your function so far · {points.length} point{points.length === 1 ? '' : 's'}
          </div>
          <div className="space-y-1.5">
            {points.map((p) => {
              const cardinal = Math.min(p.ref % 90, 90 - (p.ref % 90)) <= 20;
              return (
                <div key={p.ref} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="w-10 shrink-0 text-right font-mono text-[11px] text-slate-500">{p.ref}°</span>
                  <span className="block h-1.5 rounded bg-slate-800">
                    <span
                      className={`block h-full rounded ${cardinal ? 'bg-cyan-400/60' : 'bg-violet-400/60'}`}
                      style={{ width: `${Math.min(1, p.delta / maxDelta) * 100}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right font-mono text-[11px] text-slate-500">
                    {p.delta.toFixed(2)}°
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
            Longer bar means you needed a bigger difference to see it, which means worse resolution there.
            The cardinals are cyan. If the violet bars are the long ones, you have drawn the oblique
            effect by hand, without a single trial being scored. This is the method of adjustment, it has
            been in the psychophysics toolkit since Fechner, and its known weakness is that it measures
            your criterion as much as your sensitivity: you decide what counts as visible. The forty eight
            trials above exist precisely because they do not let you decide that.
          </p>
        </div>
      )}
    </div>
  );
}
