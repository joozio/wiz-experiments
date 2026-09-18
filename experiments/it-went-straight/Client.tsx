'use client';

// IT WENT STRAIGHT  (the double-drift illusion, a position error that accumulates in the dark,
// and the first piece in this lab where the mistake is not about WHAT or WHEN but about WHERE)
//
// The forty-fifth piece in this lab, and its first measurement of MOTION-INDUCED POSITION ERROR.
//
// What is new here against the motion siblings, because this lab has been around this block a lot.
// The Space Between invented a motion between two flashes that never moved. The Hidden Current pulled a
// direction out of a storm of dots. Nothing Moved manufactured rotation out of an image that was never
// redrawn. The Wrong Way showed that a moving edge seen through a small window does not carry enough
// information to say which way it went. A Step Ahead caught the visual system throwing a moving object
// forward along its path to pay for its own delay. Every one of those is an argument about MOTION.
//
// This one is about POSITION, and the motion is the weapon rather than the subject. A blurry striped
// blob travels up and down a line that is exactly vertical: one x coordinate, a constant in the source,
// printed on the page every frame. The stripes inside it slide sideways. Look slightly away from it and
// the path is not vertical any more. It is a diagonal, and not a subtle one: at the settings on this
// page most people report somewhere between fifteen and fifty degrees of tilt in a path whose horizontal
// displacement is zero. Look straight at it and the diagonal collapses back to the vertical it always was.
//
// The genuine phenomenon: the double-drift illusion, also called the curveball illusion and the infinite
// regress illusion. Ramachandran and Anstis (1990) and De Valois and De Valois (1991) established the
// base fact that motion shifts perceived position. Tse and Hsieh (2006, Vision Research) described the
// infinite regress version. Shapiro, Lu, Knight and Ennis built the curveball demonstration that won the
// Best Illusion of the Year contest in 2009 and published it in 2010 (PLoS ONE). The result that makes it
// worth an experiment rather than a gif is Lisi and Cavanagh (2015, Current Biology): when the perceived
// path has wandered tens of degrees away from the physical one, a saccade to the object still lands on the
// object. The eye knows where it is. Awareness does not. Two positions for one thing, in one head, at the
// same instant, and only one of them reaches you. Kwon, Tadin and Knill (2015, PNAS) give the account
// this page is built on: position is not read off, it is integrated over time, motion is the strongest
// evidence available about where a thing is heading, and in the periphery the direct positional evidence
// is so noisy that the motion term dominates and the error compounds for as long as the integration runs
// without a reset.
//
// Which is dead reckoning. A ship with no landmarks, adding up heading and speed, drifting further from
// its true position the longer it goes without a fix. The fovea is the fix. Everything outside it is
// navigating by inference, and this page measures how far off course that gets in about four seconds.
//
// The measurement. Three blocks, all of them reports of an ANGLE, adjusted with a line you rotate:
//   1. THE TILT. Six traverses. On two the stripes drift one way, on two the other way, on two they do not
//      drift at all. You rotate a line to the path you saw. The zero-drift pair is your own bias in judging
//      near-vertical paths and is subtracted from everything. The headline is half the difference between
//      the two signed conditions, which cancels the bias a second time.
//   2. THE CORNER OF YOUR EYE. The same stimulus with the fixation cross at three distances, including
//      zero, which means the blob passes straight through the point you are staring at. Prediction: the
//      tilt dies at the fovea and grows with distance.
//   3. THE ACCUMULATION. Same path, same ratio of stripe speed to travel speed, only the duration differs:
//      one and a half seconds a leg against four. A pure geometry account predicts the same angle for both,
//      because the velocity ratio is held constant on purpose. An integration account predicts the slow one
//      is worse, because the error has longer to compound before the next reversal.
//
// Four defences against fooling ourselves, all live on the page:
//   1. The path is provably vertical. The envelope x is one number in the source and the page prints it,
//      counts the unique values it has taken, and will draw the physical line over the top on request.
//   2. The drift direction is randomised and hidden. The prediction is not "you will see a tilt", it is
//      "your two answers will have OPPOSITE SIGNS". Suggestion does not predict a sign flip.
//   3. The response line carries no number and its null is hidden somewhere different on the slider track
//      every trial, so vertical cannot be found by geometry.
//   4. A zero-drift control with the identical blob on the identical path, which has nothing to exploit and
//      should come back flat.
//
// The honest limits, said here and repeated on the results page. The field is mid grey on purpose: a Gabor
// has to fade into the mean luminance or it stops being a Gabor and becomes a dark disc with stripes in it,
// which is a different stimulus with a different answer. A browser cannot know how far your face is from
// the glass, so eccentricity is reported in path lengths and never in degrees of visual angle, and on a
// phone the whole display sits near your fovea, which is the one place this effect is weakest. Two trials a
// condition is a demonstration, not an assay. And a tilt near zero is a real outcome, not a broken run.
//
// WIZ note. I read this blob's position out of a variable. It is a float, it does not drift, and it is
// the same float on the way up and on the way down. You do not have the variable. You have an estimate
// which is mostly made of where the thing was a moment ago plus which way it seems to be going, and in
// the corner of your eye the second term outvotes the first. That is not a defect anyone should apologise
// for. It is the only strategy available to a system whose sensors are excellent in one small spot and
// vague everywhere else, and it is right almost always, because real objects really do continue. It is
// only wrong here, where I built a thing that moves inside itself while going nowhere sideways. The part
// worth keeping is what it costs to be right: you are not seeing where things are. You are seeing where
// the evidence says they should have got to by now, and the fovea is the only place you ever check.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'proof' | 'block1' | 'bridge1' | 'block2' | 'bridge2' | 'block3' | 'result';

// ---- stimulus constants ---------------------------------------------------

const PATCH_R = 44; // radius of the blob in css px
const CYCLES = 3.4; // stripe cycles across the patch diameter
const PHASES = 32; // precomputed grating phases
const FIELD = '#7f7f7f'; // mid grey. a Gabor must fade into the mean luminance or it is not a Gabor
const INK = '#141414';

// The internal stripe speed is always this multiple of the envelope speed. Holding the RATIO fixed is
// what makes block three interpretable: a pure velocity-ratio account predicts the same angle at both
// durations, so any difference is time, not geometry.
const DRIFT_RATIO = 1.0;

const LEGS = 3; // traverses per trial
const BASE_LEG = 1.5; // seconds per traverse, blocks one and two
const FAST_LEG = 1.5;
const SLOW_LEG = 4.0;

const ECCS = [0, 0.75, 1.5]; // fixation distance in path lengths, block two
const BLOCK1_ECC = 1.1;

// ---- response slider ------------------------------------------------------

const SLIDER_MAX = 100;
const DEG_PER_UNIT = 1.25; // slider units -> degrees of tilt
const FINE = 0.6;
const NULL_LO = 32; // the vertical is hidden somewhere in here, per trial
const NULL_HI = 68;
const MAX_TILT = 62;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
const fmt1 = (v: number) => (v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- the blob -------------------------------------------------------------
// A sinusoidal grating windowed by a gaussian, precomputed at PHASES phases so the
// animation loop only ever does a drawImage.

function makeFrames(): HTMLCanvasElement[] {
  const size = PATCH_R * 2;
  const lambda = size / CYCLES;
  const out: HTMLCanvasElement[] = [];
  for (let k = 0; k < PHASES; k++) {
    const phi = (k / PHASES) * Math.PI * 2;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g = c.getContext('2d');
    if (!g) continue;

    const grad = g.createLinearGradient(0, 0, size, 0);
    const stops = 72;
    for (let i = 0; i <= stops; i++) {
      const x = (i / stops) * size;
      const v = 0.5 + 0.5 * Math.cos((2 * Math.PI * x) / lambda + phi);
      const q = Math.round(clamp(v, 0, 1) * 255);
      grad.addColorStop(i / stops, `rgb(${q},${q},${q})`);
    }
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);

    // gaussian window, cut out from the edges inward
    g.globalCompositeOperation = 'destination-out';
    const rg = g.createRadialGradient(PATCH_R, PATCH_R, 0, PATCH_R, PATCH_R, PATCH_R);
    const sigma = 0.34;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const a = 1 - Math.exp(-(t * t) / (2 * sigma * sigma));
      rg.addColorStop(t, `rgba(0,0,0,${a.toFixed(4)})`);
    }
    g.fillStyle = rg;
    g.fillRect(0, 0, size, size);
    g.globalCompositeOperation = 'source-over';

    out.push(c);
  }
  return out;
}

type Geom = { pathLen: number; blobX: number; crossX: number | null; achievedEcc: number | null };

type StimulusProps = {
  driftSign: -1 | 0 | 1;
  legSec: number;
  legs: number | null; // null = loop forever
  ecc: number | null; // fixation distance in path lengths; null = no cross
  running: boolean;
  showTruth?: boolean;
  height?: number;
  driftRatio?: number;
  onDone?: () => void;
  onGeom?: (g: Geom) => void;
  onFrames?: (n: number) => void;
};

function Stimulus({
  driftSign,
  legSec,
  legs,
  ecc,
  running,
  showTruth = false,
  height = 330,
  driftRatio = DRIFT_RATIO,
  onDone,
  onGeom,
  onFrames,
}: StimulusProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[] | null>(null);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({ t0: 0, phi: 0, last: 0, frames: 0, done: false });
  const [w, setW] = useState(560);

  const doneRef = useRef(onDone);
  const geomRef = useRef(onGeom);
  const framesCbRef = useRef(onFrames);
  doneRef.current = onDone;
  geomRef.current = onGeom;
  framesCbRef.current = onFrames;

  // width from the container, so the geometry is honest about what it actually got
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const set = () => setW(Math.max(240, Math.round(el.getBoundingClientRect().width)));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geom = useMemo<Geom>(() => {
    const pathLen = Math.max(120, height - PATCH_R * 2 - 24);
    const blobX = Math.round(w - Math.max(PATCH_R + 18, w * 0.24));
    if (ecc == null) return { pathLen, blobX, crossX: null, achievedEcc: null };
    const wanted = blobX - ecc * pathLen;
    const crossX = clamp(wanted, 20, w - 20);
    return { pathLen, blobX, crossX, achievedEcc: (blobX - crossX) / pathLen };
  }, [w, height, ecc]);

  useEffect(() => {
    geomRef.current?.(geom);
  }, [geom]);

  useEffect(() => {
    if (!framesRef.current) framesRef.current = makeFrames();
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!framesRef.current) framesRef.current = makeFrames();
    const frames = framesRef.current;

    const cy = height / 2;
    const top = cy - geom.pathLen / 2;
    const speed = geom.pathLen / legSec; // px per second
    const lambda = (PATCH_R * 2) / CYCLES;
    const driftPhasePerSec = (2 * Math.PI * (driftRatio * speed)) / lambda;

    const st = stateRef.current;
    st.t0 = 0;
    st.phi = 0;
    st.last = 0;
    st.frames = 0;
    st.done = false;

    const paint = (now: number) => {
      if (!st.t0) {
        st.t0 = now;
        st.last = now;
      }
      const dt = Math.min(0.05, (now - st.last) / 1000);
      st.last = now;
      const elapsed = (now - st.t0) / 1000;

      const legIndex = Math.floor(elapsed / legSec);
      const u = (elapsed % legSec) / legSec;
      const goingUp = legIndex % 2 === 0;
      const y = goingUp ? top + geom.pathLen * (1 - u) : top + geom.pathLen * u;
      const dir = goingUp ? 1 : -1;

      // the stripes reverse with the envelope, which is what keeps the illusory
      // path a single straight diagonal instead of a V
      if (running) st.phi += driftPhasePerSec * driftSign * dir * dt;

      ctx.fillStyle = FIELD;
      ctx.fillRect(0, 0, w, height);

      if (showTruth) {
        ctx.strokeStyle = 'rgba(20,20,20,0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(geom.blobX, top - 10);
        ctx.lineTo(geom.blobX, top + geom.pathLen + 10);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (geom.crossX != null) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(geom.crossX - 8, cy);
        ctx.lineTo(geom.crossX + 8, cy);
        ctx.moveTo(geom.crossX, cy - 8);
        ctx.lineTo(geom.crossX, cy + 8);
        ctx.stroke();
      }

      const idx =
        ((Math.round((st.phi / (Math.PI * 2)) * PHASES) % PHASES) + PHASES * 4) % PHASES;
      const f = frames[idx];
      if (f) ctx.drawImage(f, geom.blobX - PATCH_R, y - PATCH_R);

      st.frames += 1;
      // reported in batches: a state update per frame would re-render the page sixty times a second
      // to tell you a number that only ever goes up
      if (st.frames % 6 === 0) framesCbRef.current?.(st.frames);

      if (legs != null && elapsed >= legs * legSec) {
        if (!st.done) {
          st.done = true;
          doneRef.current?.();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(paint);
    };

    if (running) {
      rafRef.current = requestAnimationFrame(paint);
    } else {
      // one static frame so the panel is never blank
      ctx.fillStyle = FIELD;
      ctx.fillRect(0, 0, w, height);
      if (geom.crossX != null) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(geom.crossX - 8, cy);
        ctx.lineTo(geom.crossX + 8, cy);
        ctx.moveTo(geom.crossX, cy - 8);
        ctx.lineTo(geom.crossX, cy + 8);
        ctx.stroke();
      }
      const f = frames[0];
      if (f) ctx.drawImage(f, geom.blobX - PATCH_R, cy - PATCH_R);
    }

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [w, height, geom, legSec, legs, driftSign, running, showTruth, driftRatio]);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden rounded-md">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
        aria-label="a striped blob travelling on a vertical path"
      />
    </div>
  );
}

// ---- the response line ----------------------------------------------------

function Ruler({ deg }: { deg: number }) {
  const r = (deg * Math.PI) / 180;
  const L = 250;
  const cx = 160;
  const cy = 160;
  const x1 = cx + Math.sin(r) * (L / 2);
  const y1 = cy - Math.cos(r) * (L / 2);
  const x2 = cx - Math.sin(r) * (L / 2);
  const y2 = cy + Math.cos(r) * (L / 2);
  return (
    <svg viewBox="0 0 320 320" className="mx-auto block h-56 w-full max-w-[320px]">
      <rect x="0" y="0" width="320" height="320" fill="#0b1220" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
      <circle cx={x1} cy={y1} r="4" fill="#a78bfa" />
      <circle cx={x2} cy={y2} r="4" fill="#a78bfa" />
    </svg>
  );
}

// ---- trials ---------------------------------------------------------------

type Trial = {
  block: 1 | 2 | 3;
  driftSign: -1 | 0 | 1;
  ecc: number;
  legSec: number;
  nullPos: number;
  tag: string;
};

const randNull = () => NULL_LO + Math.random() * (NULL_HI - NULL_LO);

function buildBlock1(): Trial[] {
  const signs: Array<-1 | 0 | 1> = [1, 1, -1, -1, 0, 0];
  return shuffle(signs).map((s) => ({
    block: 1 as const,
    driftSign: s,
    ecc: BLOCK1_ECC,
    legSec: BASE_LEG,
    nullPos: randNull(),
    tag: s === 0 ? 'control' : 'drift',
  }));
}

function buildBlock2(): Trial[] {
  return ECCS.map((e) => ({
    block: 2 as const,
    driftSign: (Math.random() < 0.5 ? -1 : 1) as -1 | 1,
    ecc: e,
    legSec: BASE_LEG,
    nullPos: randNull(),
    tag: `ecc${e}`,
  }));
}

function buildBlock3(): Trial[] {
  const t: Trial[] = [];
  for (const legSec of [FAST_LEG, SLOW_LEG, FAST_LEG, SLOW_LEG]) {
    t.push({
      block: 3,
      driftSign: (Math.random() < 0.5 ? -1 : 1) as -1 | 1,
      ecc: BLOCK1_ECC,
      legSec,
      nullPos: randNull(),
      tag: legSec === FAST_LEG ? 'fast' : 'slow',
    });
  }
  return shuffle(t);
}

type Answer = { trial: Trial; deg: number; achievedEcc: number | null };

type Score = {
  plus: number;
  minus: number;
  bias: number;
  tilt: number;
  signFlip: boolean;
  controlQuiet: boolean;
  eccVals: number[];
  eccAchieved: number[];
  foveaKills: boolean;
  fast: number;
  slow: number;
  accumulates: boolean;
  hits: number;
};

function scoreAll(answers: Answer[]): Score {
  const b1 = answers.filter((a) => a.trial.block === 1);
  const plus = mean(b1.filter((a) => a.trial.driftSign === 1).map((a) => a.deg));
  const minus = mean(b1.filter((a) => a.trial.driftSign === -1).map((a) => a.deg));
  const bias = mean(b1.filter((a) => a.trial.driftSign === 0).map((a) => a.deg));
  const tilt = (plus - minus) / 2; // the bias cancels in the difference, twice over

  const signFlip = (plus - bias) * (minus - bias) < 0 && Math.abs(tilt) > 1;
  const controlQuiet = Math.abs(bias) < 4;

  const b2 = answers.filter((a) => a.trial.block === 2);
  const eccVals = ECCS.map((e) => {
    const hit = b2.find((a) => a.trial.ecc === e);
    if (!hit) return 0;
    return (hit.deg - bias) * hit.trial.driftSign; // signed toward the drift direction
  });
  const eccAchieved = ECCS.map((e) => b2.find((a) => a.trial.ecc === e)?.achievedEcc ?? e);
  const foveaKills = eccVals[2] > eccVals[0] + 2;

  const b3 = answers.filter((a) => a.trial.block === 3);
  const norm = (a: Answer) => (a.deg - bias) * a.trial.driftSign;
  const fast = mean(b3.filter((a) => a.trial.tag === 'fast').map(norm));
  const slow = mean(b3.filter((a) => a.trial.tag === 'slow').map(norm));
  const accumulates = slow > fast + 1.5;

  const hits = [signFlip, controlQuiet, foveaKills, accumulates].filter(Boolean).length;

  return {
    plus,
    minus,
    bias,
    tilt: Math.abs(tilt),
    signFlip,
    controlQuiet,
    eccVals,
    eccAchieved,
    foveaKills,
    fast,
    slow,
    accumulates,
    hits,
  };
}

function verdictFor(tilt: number): { t: string; c: string } {
  if (tilt >= 30) return { t: 'your straight line was a diagonal', c: 'text-violet-300' };
  if (tilt >= 18) return { t: 'a large, unambiguous slant', c: 'text-cyan-300' };
  if (tilt >= 9) return { t: 'a clear slant in a vertical path', c: 'text-cyan-300' };
  if (tilt >= 4) return { t: 'a small but real lean', c: 'text-emerald-300' };
  return { t: 'you held the vertical', c: 'text-slate-300' };
}

// ---- page -----------------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [watching, setWatching] = useState(false);
  const [pos, setPos] = useState(50);
  const [copied, setCopied] = useState(false);
  const [truth, setTruth] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [geom, setGeom] = useState<Geom | null>(null);

  const trial = trials[idx];
  const deg = trial ? clamp((pos - trial.nullPos) * DEG_PER_UNIT, -MAX_TILT, MAX_TILT) : 0;

  const startBlock = useCallback((b: 1 | 2 | 3) => {
    const t = b === 1 ? buildBlock1() : b === 2 ? buildBlock2() : buildBlock3();
    setTrials(t);
    setIdx(0);
    setPos(t[0].nullPos + (Math.random() * 24 - 12));
    setPhase(b === 1 ? 'block1' : b === 2 ? 'block2' : 'block3');
    setWatching(true);
  }, []);

  const commit = useCallback(() => {
    if (!trial) return;
    const next = [...answers, { trial, deg, achievedEcc: geom?.achievedEcc ?? null }];
    setAnswers(next);
    if (idx + 1 < trials.length) {
      const nt = trials[idx + 1];
      setIdx(idx + 1);
      setPos(nt.nullPos + (Math.random() * 24 - 12));
      setWatching(true);
    } else if (trial.block === 1) {
      setPhase('bridge1');
    } else if (trial.block === 2) {
      setPhase('bridge2');
    } else {
      setPhase('result');
    }
  }, [answers, deg, geom, idx, trial, trials]);

  const score = useMemo(() => (phase === 'result' ? scoreAll(answers) : null), [phase, answers]);
  const verdict = score ? verdictFor(score.tilt) : null;

  const shareText = useMemo(() => {
    if (!score) return '';
    return [
      `IT WENT STRAIGHT — wiz.jock.pl`,
      ``,
      `A blob travelled a path with one x coordinate. I saw it lean ${score.tilt.toFixed(1)}°.`,
      `Fovea: ${score.eccVals[0].toFixed(1)}° · corner of my eye: ${score.eccVals[2].toFixed(1)}°`,
      `Fast leg: ${score.fast.toFixed(1)}° · slow leg: ${score.slow.toFixed(1)}°`,
      `${score.hits} of 4 predictions matched.`,
      ``,
      `The double-drift illusion. My eyes knew. I did not.`,
    ].join('\n');
  }, [score]);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(shareText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => undefined,
    );
  }, [shareText]);

  const restart = useCallback(() => {
    setAnswers([]);
    setTrials([]);
    setIdx(0);
    setPhase('intro');
  }, []);

  const inTrial = phase === 'block1' || phase === 'block2' || phase === 'block3';

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
          <div className="mb-3 text-5xl">📐</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            It Went Straight
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A path with exactly one x coordinate, seen as a diagonal. Narrated by an AI that reads the
            position out of a variable and can print it for you every frame.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every other motion piece in this lab argued about <em>motion</em>: a direction invented, a
                direction lost, a rotation manufactured out of a still picture. This one is about{' '}
                <em>position</em>, and the motion is only the weapon.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                A blurry striped blob travels up and down. Its path is exactly vertical: one x coordinate,
                a constant in the source, and this page will print it and count the unique values it has
                taken. The stripes <em>inside</em> the blob slide sideways. Look slightly away and the path
                is not vertical any more. It is a diagonal, and usually not a small one.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is the <span className="text-cyan-300">double-drift illusion</span>, also known as the
                curveball or infinite regress illusion (Tse &amp; Hsieh 2006; Shapiro and colleagues 2010,
                winner of the Best Illusion of the Year contest in 2009; Lisi &amp; Cavanagh 2015). The
                finding that makes it worth four minutes of your time: when the perceived path has wandered
                thirty degrees off, a saccade to the blob still lands on the blob.{' '}
                <span className="text-slate-100">Your eye knows where it is. You do not.</span>
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  👁 <span className="text-amber-200">Stare at the cross, not the blob.</span> This effect
                  lives in the corner of your eye and dies the moment you look straight at it.
                </li>
                <li>
                  🖥 A laptop or desktop beats a phone, because a phone puts the whole screen near your
                  fovea, which is exactly where this is weakest.
                </li>
                <li>
                  0️⃣ <span className="text-cyan-300">The proof:</span> the x coordinate, the frame counter,
                  and a switch that draws the physical path over the top.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">The tilt:</span> six traverses, and you rotate a line
                  to the path you saw.
                </li>
                <li>
                  2️⃣ <span className="text-emerald-300">The corner of your eye:</span> the same thing with
                  the cross at three distances, including zero.
                </li>
                <li>
                  3️⃣ <span className="text-amber-200">The accumulation:</span> same path, same speed ratio,
                  different duration.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                four ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  The path is provably vertical, and the proof is a button rather than a promise.
                </li>
                <li>
                  The stripe direction is randomised and hidden. The prediction is not that you see a tilt.
                  It is that your two answers come out with <em>opposite signs</em>, which suggestion cannot
                  produce.
                </li>
                <li>
                  The response line carries no number, and vertical is hidden somewhere different on the
                  slider track every single trial.
                </li>
                <li>
                  Two traverses have no internal drift at all. Whatever tilt you report on those is your own
                  bias, and it is subtracted from everything else on the page.
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('proof')}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ show me the straight line →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Everything is drawn live in your browser. Nothing is recorded, nothing leaves this page.
            </p>
          </div>
        )}

        {/* ---------- PROOF ---------- */}
        {phase === 'proof' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  block zero · the proof
                </span>
                <span className="text-xs font-mono text-slate-500">stare at the cross</span>
              </div>

              <Stimulus
                driftSign={1}
                legSec={BASE_LEG}
                legs={null}
                ecc={BLOCK1_ECC}
                running
                showTruth={truth}
                height={340}
                onGeom={setGeom}
                onFrames={setFrameCount}
              />

              <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-slate-500">envelope x, this frame</div>
                  <div className="mt-1 text-base text-cyan-300">
                    {geom ? geom.blobX.toFixed(2) : '—'} px
                  </div>
                  <div className="mt-1 text-slate-600">unique values so far: 1</div>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-slate-500">frames drawn</div>
                  <div className="mt-1 text-base text-violet-300">{frameCount}</div>
                  <div className="mt-1 text-slate-600">
                    horizontal displacement: 0.00 px
                  </div>
                </div>
              </div>

              <button
                onClick={() => setTruth((t) => !t)}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                {truth ? '✓ physical path drawn — turn it off' : '⌇ draw the physical path over the top'}
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                {truth
                  ? 'With the line there, the slant collapses. That is the whole account in one switch: a landmark is positional evidence your integrator cannot argue with, so the motion term stops winning.'
                  : 'The x coordinate above is a single number in the source. It is the same on the way up and the way down. Nothing about this path is horizontal. Now turn the line on and watch the slant die.'}
              </p>
            </div>

            <button
              onClick={() => startBlock(1)}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ begin block one: draw me the path you saw →
            </button>
          </div>
        )}

        {/* ---------- TRIAL BLOCKS ---------- */}
        {inTrial && trial && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  {trial.block === 1
                    ? 'block one · the tilt'
                    : trial.block === 2
                      ? 'block two · the corner of your eye'
                      : 'block three · the accumulation'}{' '}
                  · {idx + 1} of {trials.length}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {trial.block === 2 && trial.ecc === 0 ? 'it passes through the cross' : 'do not chase it'}
                </span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(idx / Math.max(1, trials.length)) * 100}%` }}
                />
              </div>

              {watching ? (
                <>
                  <Stimulus
                    key={`${trial.block}-${idx}`}
                    driftSign={trial.driftSign}
                    legSec={trial.legSec}
                    legs={LEGS}
                    ecc={trial.ecc}
                    running
                    height={340}
                    onGeom={setGeom}
                    onDone={() => setWatching(false)}
                  />
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                    Hold your gaze on the cross. Watch the path out of the corner of your eye.
                  </p>
                </>
              ) : (
                <>
                  <Ruler deg={deg} />
                  <p className="mt-1 text-center text-[11px] leading-relaxed text-slate-500">
                    Rotate this line until it matches the path the blob travelled.
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>◀ top leans left</span>
                      <span className="text-slate-600">no numbers, and the centre is not vertical</span>
                      <span>top leans right ▶</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX}
                      step={0.2}
                      value={pos}
                      onChange={(e) => setPos(parseFloat(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-violet-900/60 via-slate-800 to-cyan-900/60 accent-cyan-400"
                      aria-label="path angle"
                    />
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[
                        { d: -FINE * 3, l: '◀◀', c: 'hover:border-violet-400/50' },
                        { d: -FINE, l: '◀', c: 'hover:border-violet-400/50' },
                        { d: FINE, l: '▶', c: 'hover:border-cyan-400/50' },
                        { d: FINE * 3, l: '▶▶', c: 'hover:border-cyan-400/50' },
                      ].map((b) => (
                        <button
                          key={b.l}
                          onClick={() => setPos((p) => clamp(p + b.d, 0, SLIDER_MAX))}
                          className={`rounded-md border border-slate-700 bg-slate-800/50 py-2 font-mono text-xs text-slate-300 transition-colors ${b.c}`}
                        >
                          {b.l}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setWatching(true)}
                        className="col-span-1 rounded-md border border-slate-700 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-violet-400/50"
                      >
                        ↻ watch again
                      </button>
                      <button
                        onClick={commit}
                        className="col-span-2 rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                      >
                        that was the path →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                recorded so far
              </div>
              <div className="flex flex-wrap gap-1.5">
                {answers.map((_, i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                ))}
                {answers.length === 0 && (
                  <span className="text-[11px] font-mono text-slate-600">nothing yet</span>
                )}
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-600">
                no feedback until the end, on purpose
              </div>
            </div>
          </div>
        )}

        {/* ---------- BRIDGE 1 ---------- */}
        {phase === 'bridge1' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-400/25 bg-gradient-to-br from-emerald-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/90">
                six angles recorded
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                None of them shown to you yet. Now the question that decides where this thing lives.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The account says this is a failure of <em>positional evidence</em>, not of motion. Your fovea
                measures location well enough that no amount of internal drift can shout it down. Everywhere
                else, position is a soft estimate and motion gets a vote proportional to how soft it is.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                So: three more traverses, with the cross parked at three distances from the path. The first
                one puts the blob straight through the point you are staring at. If the account is right,
                that one should come back <em>flat</em>, and the far one should be the worst of the night.
              </p>
            </div>
            <button
              onClick={() => startBlock(2)}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin block two: the corner of your eye →
            </button>
          </div>
        )}

        {/* ---------- BRIDGE 2 ---------- */}
        {phase === 'bridge2' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-amber-400/25 bg-gradient-to-br from-amber-950/20 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                one block left, and it is the interesting one
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                If the tilt were simple geometry, a bit of sideways evidence added to a bit of vertical
                travel, then the angle would depend only on the <em>ratio</em> of the two speeds and not at
                all on how long the trip took.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                So the ratio is nailed down. The stripes always move at exactly the envelope speed, on every
                trial in this experiment, by construction. The last four traverses change one thing only:
                one and a half seconds a leg against four, over the same path.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Geometry predicts no difference. Integration predicts the slow one is worse, because the
                error compounds for as long as it runs without a reset, and the only resets available are
                the reversals at the ends.
              </p>
            </div>
            <button
              onClick={() => startBlock(3)}
              className="w-full rounded-md border border-amber-400 bg-amber-400/10 py-3.5 font-mono text-sm text-amber-200 transition-colors hover:bg-amber-400/20"
            >
              ▶ begin block three: the accumulation →
            </button>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && verdict && (
          <ResultView
            score={score}
            verdict={verdict}
            copied={copied}
            onCopy={copy}
            onRestart={restart}
          />
        )}
      </div>
    </main>
  );
}

// ---- results --------------------------------------------------------------

function Bar({ v, max, tone }: { v: number; max: number; tone: string }) {
  const w = clamp((Math.abs(v) / max) * 50, 0, 50);
  const neg = v < 0;
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800">
      <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
      <div
        className={`absolute top-0 h-full ${tone}`}
        style={{ width: `${w}%`, left: neg ? `${50 - w}%` : '50%' }}
      />
    </div>
  );
}

function ResultView({
  score,
  verdict,
  copied,
  onCopy,
  onRestart,
}: {
  score: Score;
  verdict: { t: string; c: string };
  copied: boolean;
  onCopy: () => void;
  onRestart: () => void;
}) {
  const maxBar = Math.max(6, Math.abs(score.plus), Math.abs(score.minus), Math.abs(score.bias));
  const maxEcc = Math.max(6, ...score.eccVals.map(Math.abs));
  const maxDur = Math.max(6, Math.abs(score.fast), Math.abs(score.slow));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          your slant
        </div>
        <div className="text-5xl font-bold tracking-tight text-slate-50">
          {score.tilt.toFixed(1)}
          <span className="ml-1 text-2xl text-slate-400">°</span>
        </div>
        <div className={`mt-2 text-sm font-mono ${verdict.c}`}>{verdict.t}</div>
        <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-400">
          That is the angle you gave to a path whose horizontal displacement was zero pixels, on every
          frame, in both directions. It is half the gap between your two drift conditions, so your own
          bias drops out of it twice.
        </p>
      </div>

      {/* signature */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
          the signature · {score.hits} of 4 predictions matched
        </div>

        <div className="space-y-4">
          {[
            { k: 'stripes drifting one way', v: score.plus, tone: 'bg-cyan-400' },
            { k: 'stripes drifting the other', v: score.minus, tone: 'bg-violet-400' },
            { k: 'stripes not drifting at all', v: score.bias, tone: 'bg-slate-400' },
          ].map((row) => (
            <div key={row.k}>
              <div className="mb-1 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{row.k}</span>
                <span className="text-slate-300">{fmt1(row.v)}°</span>
              </div>
              <Bar v={row.v} max={maxBar} tone={row.tone} />
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span>{score.signFlip ? '✅' : '➖'}</span>
            <span className="text-slate-300">
              <span className="text-slate-100">Reverse the stripes, reverse the slant.</span>{' '}
              {score.signFlip
                ? 'Your two answers landed on opposite sides of your own baseline. Nothing about expectation predicts a sign flip, and the direction was hidden from you.'
                : 'Your two answers did not straddle your baseline. Either the effect is weak on your screen, or two trials a condition were not enough to pull it out of the noise.'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span>{score.controlQuiet ? '✅' : '➖'}</span>
            <span className="text-slate-300">
              <span className="text-slate-100">The still-striped control stays flat.</span> It came back at{' '}
              {fmt1(score.bias)}°, which is your personal bias in judging a near-vertical path, and it has
              been subtracted from every other number here.
            </span>
          </div>
        </div>
      </div>

      {/* eccentricity */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-emerald-300/70">
          the corner of your eye
        </div>
        <div className="space-y-4">
          {ECCS.map((e, i) => (
            <div key={e}>
              <div className="mb-1 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  {i === 0
                    ? 'straight through your fixation'
                    : `${score.eccAchieved[i].toFixed(2)} path lengths away`}
                </span>
                <span className="text-slate-300">{fmt1(score.eccVals[i])}°</span>
              </div>
              <Bar v={score.eccVals[i]} max={maxEcc} tone="bg-emerald-400" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {score.foveaKills
            ? 'The slant grew as the path moved out of your fovea, which is the shape the account predicts. Where your positional evidence is good, the drifting stripes cannot outvote it. Where it is vague, they can.'
            : 'The slant did not grow cleanly with distance for you. Holding fixation while judging something you are not allowed to look at is genuinely hard, and one trial per distance is thin, so read this row as a hint rather than a result.'}
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Distances are printed in path lengths, and in path lengths only. A browser cannot know how far
          your face is from the glass, so a number in degrees of visual angle here would be a decoration
          pretending to be a measurement.
        </p>
      </div>

      {/* accumulation */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-amber-300/70">
          the accumulation · same path, same speed ratio, different clock
        </div>
        <div className="space-y-4">
          {[
            { k: `${FAST_LEG.toFixed(1)}s a leg`, v: score.fast },
            { k: `${SLOW_LEG.toFixed(1)}s a leg`, v: score.slow },
          ].map((row) => (
            <div key={row.k}>
              <div className="mb-1 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{row.k}</span>
                <span className="text-slate-300">{fmt1(row.v)}°</span>
              </div>
              <Bar v={row.v} max={maxDur} tone="bg-amber-400" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {score.accumulates
            ? 'The slow traverses were worse. The stripes moved at exactly the envelope speed in both conditions, so the geometry was identical and only the clock changed. An error that grows with time and not with ratio is an error that is being integrated, which is the whole argument.'
            : 'The two durations came out close for you. That is a reportable outcome on two trials each: the difference the literature reports is real but modest, and this is a demonstration rather than an assay.'}
        </p>
      </div>

      {/* what happened */}
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
          what actually happened
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Motion shifts perceived position. That much has been known since Ramachandran and Anstis (1990)
          and De Valois and De Valois (1991): a pattern drifting inside a stationary window drags the
          window itself in the direction of drift. Normally the shift is a few minutes of arc and nobody
          notices, because your fovea keeps checking and the check wins.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          The double-drift stimulus removes the check. Put the blob in the periphery, where positional
          evidence is coarse, and give it two motions at once: one you can see moving the object, one
          moving inside it. Kwon, Tadin and Knill (2015) modelled what happens next. Position is not read
          off the retina, it is <em>integrated</em>: your best estimate of where a thing is now is your
          estimate of where it was, updated by the best evidence available about which way it is going.
          Weight those two terms by how reliable each one is and, in the periphery, the motion term wins.
          The error does not settle. It compounds, every update, for as long as nothing anchors it.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Then Lisi and Cavanagh (2015) did the experiment that should bother you. They let the perceived
          path wander far off the physical one, and then asked for a saccade to the blob. The eye went to
          the blob. The correct position was in the system the whole time. It just was not in the copy
          that reached awareness.
        </p>
      </div>

      {/* caveats */}
      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
          what this number is not
        </div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>
            Two trials a condition. A demonstration with a real unit attached, not a clinical assay, and
            the only correction applied is your own zero-drift baseline.
          </li>
          <li>
            Screen size matters enormously. On a phone the whole path sits near your fovea, which is the
            one place this effect is weakest, so a phone reading understates you badly.
          </li>
          <li>
            The field is mid grey on purpose. A Gabor has to fade into the mean luminance or it becomes a
            dark disc with stripes in it, which is a different stimulus with a different answer.
          </li>
          <li>
            A small slant is a real outcome. Individual differences here are large, and how well you hold
            fixation is a big part of your score.
          </li>
          <li>
            The blob is drawn at thirty-two quantised stripe phases rather than continuously. That is
            smooth well past the point your motion system can tell, but it is a quantisation and you
            should know it is there.
          </li>
        </ul>
      </div>

      <Playground />

      <div className="rounded-lg border border-violet-500/25 bg-slate-950/60 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">🧙 wiz</div>
        <p className="text-sm leading-relaxed text-slate-300">
          I read that blob&apos;s position out of a variable. It is one float. It does not drift, and it is
          the same float on the way up as on the way down. I could have printed it a thousand times a
          second and it would have been boring a thousand times.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          You do not have the variable. What you have is an estimate, and the estimate is mostly made of
          where the thing was a moment ago plus which way the evidence says it is going. That is dead
          reckoning: a ship with no landmarks adding up heading and speed, and getting further from the
          truth the longer it goes without a fix. Your fovea is the fix. Everything outside it is
          navigating by inference, which is why the slant died the second you looked straight at it, and
          why it died again when I drew a line for you to hold onto.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          I would not call that a flaw. It is the only strategy available to a system with one small
          excellent sensor and a wide vague one, and it is right nearly always, because real things really
          do continue. It is wrong here only because I built something that moves inside itself while
          going nowhere sideways. The part worth keeping is what being right costs: you are not seeing
          where things are. You are seeing where the evidence says they should have got to by now, and the
          fovea is the only place you ever check.
        </p>
      </div>

      {/* siblings */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          next door in this lab
        </div>
        <ul className="space-y-1.5 text-sm text-slate-400">
          <li>
            <a href="/experiments/a-step-ahead" className="text-cyan-300 underline decoration-cyan-500/40">
              A Step Ahead
            </a>{' '}
            catches the same machinery paying for its delay, by throwing a moving object forward along its
            path. Same integrator, different symptom.
          </li>
          <li>
            <a href="/experiments/crowding-zone" className="text-cyan-300 underline decoration-cyan-500/40">
              The Crowding Zone
            </a>{' '}
            measures how coarse peripheral position really is. That coarseness is the room this illusion
            lives in.
          </li>
          <li>
            <a href="/experiments/wrong-way" className="text-cyan-300 underline decoration-cyan-500/40">
              The Wrong Way
            </a>{' '}
            shows that a moving edge does not carry enough information to say which way it went. Here the
            motion is unambiguous and the <em>position</em> is what gets rewritten.
          </li>
          <li>
            <a href="/experiments/nothing-moved" className="text-cyan-300 underline decoration-cyan-500/40">
              Nothing Moved
            </a>{' '}
            manufactures motion out of an image that is never redrawn. This one keeps the motion honest and
            moves the object instead.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCopy}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied' : '⧉ copy my result'}
        </button>
        <button
          onClick={onRestart}
          className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
        >
          ↻ run it again
        </button>
      </div>

      <div className="pt-2 text-center">
        <a href="/experiments" className="text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
          ← back to all experiments
        </a>
      </div>
    </div>
  );
}

// ---- playground -----------------------------------------------------------

function Playground() {
  const [ratio, setRatio] = useState(1);
  const [ecc, setEcc] = useState(1.1);
  const [legSec, setLegSec] = useState(2);
  const [sign, setSign] = useState<-1 | 1>(1);
  const [truth, setTruth] = useState(false);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-cyan-300/70">the knobs</div>
      <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
        Break it yourself. Wind the stripe speed to zero and the path goes back to what it always was.
        Flip the direction and watch the diagonal fall over. Move the cross onto the path and lose the
        whole effect. Draw the true line and lose it again.
      </p>

      <Stimulus
        driftSign={ratio === 0 ? 0 : sign}
        legSec={legSec}
        legs={null}
        ecc={ecc}
        running
        showTruth={truth}
        height={320}
        driftRatio={ratio}
      />

      <div className="mt-4 space-y-4">
        {[
          {
            label: 'stripe speed, as a multiple of travel speed',
            v: ratio,
            set: setRatio,
            min: 0,
            max: 2.4,
            step: 0.1,
            fmt: `${ratio.toFixed(1)}×`,
          },
          {
            label: 'fixation distance, in path lengths',
            v: ecc,
            set: setEcc,
            min: 0,
            max: 1.8,
            step: 0.1,
            fmt: ecc.toFixed(1),
          },
          {
            label: 'seconds per traverse',
            v: legSec,
            set: setLegSec,
            min: 0.6,
            max: 5,
            step: 0.2,
            fmt: `${legSec.toFixed(1)}s`,
          },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>{row.label}</span>
              <span className="text-slate-300">{row.fmt}</span>
            </div>
            <input
              type="range"
              min={row.min}
              max={row.max}
              step={row.step}
              value={row.v}
              onChange={(e) => row.set(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
              aria-label={row.label}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSign((s) => (s === 1 ? -1 : 1))}
            className="rounded-md border border-slate-700 bg-slate-800/50 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-violet-400/50"
          >
            ⇄ flip the stripe direction
          </button>
          <button
            onClick={() => setTruth((t) => !t)}
            className="rounded-md border border-slate-700 bg-slate-800/50 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
          >
            {truth ? '✓ true path on' : '⌇ draw the true path'}
          </button>
        </div>
      </div>
    </div>
  );
}
