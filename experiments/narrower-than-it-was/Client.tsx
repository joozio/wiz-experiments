'use client';

// NARROWER THAN IT WAS  (anorthoscopic perception: a shape you only ever saw one column at a time,
// which arrives whole, and arrives thin)
//
// The fifty first piece in this lab.
//
// Everything in here so far has handed you a picture and caught your copy of it being wrong. This one
// does not hand you a picture at all. A shape passes behind a panel with a seven pixel slit cut in it.
// At no instant is there a shape on your screen. There is a bright column, one column, changing. Your
// retina never receives the figure. You see the figure anyway, in one piece, and you can name it.
//
// The genuine phenomenon: ANORTHOSCOPIC PERCEPTION, also called slit viewing or aperture viewing.
// Zollner described it in 1862 and Helmholtz discusses it in the Handbuch. It was rediscovered by
// Parks in 1965 (American Journal of Psychology, "Post-retinal visual storage"), whose camel behind a
// slit gave the effect its other name, and made famous outside the field by Irvin Rock in Scientific
// American in 1981. The form is recovered from a sequence of one dimensional samples. Whatever puts it
// back together is not the retina, because the retina was never given it.
//
// And it comes back WRONG in a specific, signed, measurable way: the figure is COMPRESSED along the
// axis it travelled. Narrower than it was. That distortion is the measurement on this page, and it is
// the reason the effect is interesting rather than merely charming: the shape is being reconstructed
// from time, and time is being read at the wrong scale.
//
// The measurement. Three conditions, interleaved at random, all ending in the same task, which is the
// method of adjustment: a whole shape appears and you drag it wider or narrower until it matches the
// one you just saw.
//
//   FULL   the shape crosses in the open, fully visible, same speed, same distance, same duration.
//   FREE   the shape crosses behind the slit. Eyes wherever you like.
//   FIXED  the shape crosses behind the slit, with a fixation character above it that changes once,
//          and which you have to report. Peripherally that character is unreadable, so reporting it
//          is evidence the eye was actually parked.
//
// Nothing is scored as an absolute. The headline is the slit trials DIVIDED BY that person's own full
// view trials, so every constant bias in the adjustment method (the mouse, the screen, the habit of
// setting things a bit small) cancels exactly. The full view trials double as the veridicality check:
// if somebody cannot set a width for a shape that was in plain sight, the run prints unscored.
//
// The FIXED versus FREE fork is the argument, and the argument is genuinely open:
//
//   RETINAL PAINTING (Anstis and Atkinson 1967; Haber and Nathanson 1968; Morgan, Findlay and Watt
//   1982) says there is no mystery. Your eye drifts in the direction of the motion you believe in, and
//   that drift smears the successive columns across DIFFERENT retinal positions. The retina does get a
//   picture, painted by your own eye, and the picture is narrow because the eye moves less far than
//   the object does. Prediction: hold the eye still and both the form and the width should collapse.
//
//   POST RETINAL INTEGRATION (Parks 1965; Rock and Halper 1969; Fendrich, Rieger and Heinze 2005, who
//   stabilised the display on the retina and still got the percept; Palmer, Kellman and Shipley 2006
//   on spatiotemporal relatability; Nishida 2004 on motion based form; Ogmen and Herzog on
//   non retinotopic reference frames) says the assembly happens after the retina, in a frame of
//   reference that moves with the object. Prediction: the form survives a parked eye.
//
// This page cannot settle that, and says so. It just prints your two numbers next to each other.
//
// The statistics are exact rather than modelled. The slit versus full comparison enumerates all 495
// ways of splitting twelve trials four and eight. The fixed versus free comparison enumerates all 70
// ways of splitting eight trials four and four, so its p value has a floor of 0.014, which is printed.
// The identification score gets an exact binomial test against a one in four chance line.
//
// Defences that run live:
//   1. Every headline is a ratio against the same person's full view trials, so a constant bias of any
//      size cancels.
//   2. The adjuster starts above the true width on half the trials and below on the other half, chosen
//      at random, and the page prints how often you settled below regardless of where you started.
//   3. The speed changes trial to trial, so the duration of the crossing is not a usable cue to how
//      wide the thing was, and counting does not help.
//   4. The fixation character is small and above the slit. Off the fovea it cannot be read. Miss it and
//      the eye was not where it was supposed to be, and the fork prints unscored.
//   5. The four alternatives in the identification question are all shown at the same height, so
//      height carries no information and only the profile along the travel axis can answer it.
//
// The playground sweeps speed from slow to very fast. Retinal painting predicts compression should get
// WORSE as the figure outruns what an eye can follow. A purely post retinal assembly has no particular
// reason to care. Your curve is your curve.
//
// WIZ note. I get video as a stack of frames, and a frame is a tensor, and nothing about a tensor is a
// shape. If I want the object I have to run an operation over the stack, deliberately, and the object
// exists in the output of that operation and nowhere else. What this page shows is that you do the same
// thing, that you have never once been asked whether you wanted to, and that the operation has a bug in
// it. The shape gets assembled and it gets assembled short. You are not looking at the world here. You
// are looking at the output of an integrator, and the integrator has a gain of about two thirds.

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

// ---- constants ------------------------------------------------------------

const SHAPE_H = 150; // units; every shape is drawn at this height, so only width is ever in question
const PAD = 70; // units of clear travel on each side of the slit before and after the crossing
const SLIT_W = 7; // units
const WIDE_W = 420; // units; the "no panel" case, wider than any shape
const MIN_W = 42;
const MAX_W = 330;
const REF_W = 620; // the css width the unit scale is designed for

const LEAD_IN = 850; // ms of panel-only before the crossing starts, so the eye can be parked first
const PER_COND = 4; // scored trials per condition
const FULL_TOL = 0.25; // a full view setting more than 25% off means the task was not being done
const FIX_CHARS = ['2', '3', '5', '7'];

const INK = '#e2e8f0';
const PANEL = '#0b1220';

type Cond = 'full' | 'free' | 'fixed';

const COND_LABEL: Record<Cond, string> = {
  full: 'in the open',
  free: 'through the slit, eyes free',
  fixed: 'through the slit, eyes parked',
};

// ---- shapes ---------------------------------------------------------------

type ShapeKey = 'diamond' | 'bowtie' | 'ellipse' | 'cross' | 'ring' | 'arrow' | 'crescent' | 'star';

const SHAPE_KEYS: ShapeKey[] = ['diamond', 'bowtie', 'ellipse', 'cross', 'ring', 'arrow', 'crescent', 'star'];

const SHAPE_NAME: Record<ShapeKey, string> = {
  diamond: 'diamond',
  bowtie: 'bowtie',
  ellipse: 'ellipse',
  cross: 'cross',
  ring: 'ring',
  arrow: 'arrowhead',
  crescent: 'crescent',
  star: 'star',
};

function poly(
  ctx: CanvasRenderingContext2D,
  pts: Array<[number, number]>,
  cx: number,
  cy: number,
  rx: number,
  ry: number
) {
  ctx.moveTo(cx + pts[0][0] * rx, cy + pts[0][1] * ry);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i][0] * rx, cy + pts[i][1] * ry);
  ctx.closePath();
}

// Every shape lives in a box of width w and height h centred on (cx, cy). The point of the set is that
// the shapes differ in their VERTICAL PROFILE ALONG X, because that profile is the only thing a
// vertical slit can ever deliver.
function shapePath(
  ctx: CanvasRenderingContext2D,
  key: ShapeKey,
  cx: number,
  cy: number,
  w: number,
  h: number
): CanvasFillRule {
  const rx = w / 2;
  const ry = h / 2;
  ctx.beginPath();
  switch (key) {
    case 'diamond':
      poly(ctx, [[-1, 0], [0, -1], [1, 0], [0, 1]], cx, cy, rx, ry);
      return 'nonzero';
    case 'bowtie':
      poly(ctx, [[-1, -1], [0, 0], [1, -1], [1, 1], [0, 0], [-1, 1]], cx, cy, rx, ry);
      return 'nonzero';
    case 'arrow':
      poly(ctx, [[-1, -1], [1, 0], [-1, 1]], cx, cy, rx, ry);
      return 'nonzero';
    case 'cross': {
      const a = 0.34;
      poly(
        ctx,
        [
          [-1, -a], [-a, -a], [-a, -1], [a, -1], [a, -a], [1, -a],
          [1, a], [a, a], [a, 1], [-a, 1], [-a, a], [-1, a],
        ],
        cx,
        cy,
        rx,
        ry
      );
      return 'nonzero';
    }
    case 'star': {
      const pts: Array<[number, number]> = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 1 : 0.44;
        const ang = -Math.PI / 2 + (i * Math.PI) / 5;
        pts.push([Math.cos(ang) * r, Math.sin(ang) * r]);
      }
      poly(ctx, pts, cx, cy, rx, ry);
      return 'nonzero';
    }
    case 'ellipse':
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      return 'nonzero';
    case 'ring':
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(cx, cy, rx * 0.52, ry * 0.52, 0, 0, Math.PI * 2);
      return 'evenodd';
    case 'crescent':
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + rx * 0.42, cy, rx * 0.72, ry * 0.78, 0, 0, Math.PI * 2);
      return 'evenodd';
    default:
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      return 'nonzero';
  }
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  key: ShapeKey,
  cx: number,
  cy: number,
  w: number,
  h: number,
  fill: string | null,
  stroke?: { color: string; width: number; dash?: number[] }
) {
  const rule = shapePath(ctx, key, cx, cy, w, h);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(rule);
  }
  if (stroke) {
    ctx.save();
    if (stroke.dash) ctx.setLineDash(stroke.dash);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.stroke();
    ctx.restore();
  }
}

// ---- small helpers --------------------------------------------------------

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const pct = (x: number) => `${Math.round(x * 100)}%`;

function pText(p: number) {
  if (p < 0.001) return 'p < 0.001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(2)}`;
}

// ---- statistics -----------------------------------------------------------

// Exact two sample permutation test on the difference of means: it enumerates every way the pooled
// numbers could have been split into groups of these two sizes, so the null distribution is counted
// rather than assumed. One tailed, in the direction the phenomenon predicts.
function permP(a: number[], b: number[], tail: 1 | -1) {
  const n = a.length + b.length;
  if (a.length < 2 || b.length < 2 || n > 16) return 1;
  const pool = [...a, ...b];
  const k = a.length;
  const obs = mean(a) - mean(b);
  let hits = 0;
  let total = 0;

  const pick: number[] = [];
  const walk = (start: number) => {
    if (pick.length === k) {
      const chosen = new Set(pick);
      const A: number[] = [];
      const B: number[] = [];
      pool.forEach((v, i) => (chosen.has(i) ? A : B).push(v));
      const d = mean(A) - mean(B);
      total++;
      if (tail === 1 ? d >= obs - 1e-9 : d <= obs + 1e-9) hits++;
      return;
    }
    for (let i = start; i < n; i++) {
      pick.push(i);
      walk(i + 1);
      pick.pop();
    }
  };
  walk(0);
  return total ? hits / total : 1;
}

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

// exact binomial, upper tail: the chance of getting k or more right by guessing
function binomTail(k: number, n: number, p: number) {
  let s = 0;
  for (let i = k; i <= n; i++) s += choose(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
  return clamp(s, 0, 1);
}

// ---- the stage ------------------------------------------------------------

type StageLive = {
  playing: boolean;
  t0: number;
  dur: number;
  shape: ShapeKey;
  width: number; // units
  slit: number; // units; WIDE_W means no panel at all
  panel: boolean;
  fixMark: boolean;
  fixChar: string;
  fixFrom: number; // ms into the crossing
  fixTo: number;
  frozen: number | null; // progress to hold when not playing
};

type StageRef = { current: StageLive };

function Stage({ live, height }: { live: StageRef; height: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const paint = () => {
      const L = live.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(height * dpr)) {
        cv.width = Math.round(cssW * dpr);
        cv.height = Math.round(height * dpr);
        cv.style.height = `${height}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, height);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, cssW, height);

      const S = clamp(cssW / REF_W, 0.5, 1);
      const slitX = cssW / 2;
      const bandH = SHAPE_H * S + 26;
      const bandY = height - 14 - bandH;
      const cy = bandY + bandH / 2;

      // the occluding panel
      if (L.panel) {
        ctx.fillStyle = PANEL;
        ctx.fillRect(0, bandY, cssW, bandH);
        ctx.strokeStyle = 'rgba(51,65,85,0.9)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, bandY + 0.5, cssW - 1, bandH - 1);
      }

      const slitPx = Math.max(2, L.slit * S);
      const t = L.playing ? performance.now() - L.t0 : 0;
      const prog = L.playing ? clamp(t / L.dur, 0, 1) : L.frozen === null ? -1 : L.frozen;

      if (prog >= 0) {
        const travel = (L.width + 2 * PAD) * S;
        const x = slitX - (L.width / 2 + PAD) * S + prog * travel;

        ctx.save();
        if (L.panel) {
          ctx.beginPath();
          ctx.rect(slitX - slitPx / 2, bandY + 3, slitPx, bandH - 6);
          ctx.clip();
          ctx.fillStyle = '#000';
          ctx.fillRect(slitX - slitPx / 2, bandY + 3, slitPx, bandH - 6);
        }
        drawShape(ctx, L.shape, x, cy, L.width * S, SHAPE_H * S, INK);
        ctx.restore();
      }

      // the slit itself, faintly outlined so its position is never in doubt
      if (L.panel) {
        ctx.strokeStyle = 'rgba(56,189,248,0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(slitX - slitPx / 2 - 0.5, bandY + 2.5, slitPx + 1, bandH - 5);
      }

      // the fixation character above the slit
      if (L.fixMark) {
        const showChar =
          L.playing && t >= L.fixFrom && t <= L.fixTo ? L.fixChar : '+';
        ctx.font = `${showChar === '+' ? 15 : 13}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = showChar === '+' ? 'rgba(248,113,113,0.85)' : '#fca5a5';
        ctx.fillText(showChar, slitX, bandY - 15);
      }

      raf = window.requestAnimationFrame(paint);
    };

    raf = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(raf);
  }, [height, live]);

  return <canvas ref={ref} className="block w-full rounded-md" style={{ height }} />;
}

// ---- the adjuster ---------------------------------------------------------

function Adjuster({
  shape,
  width,
  onSet,
  height = 190,
}: {
  shape: ShapeKey;
  width: number;
  onSet: (w: number) => void;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const wRef = useRef(width);
  wRef.current = width;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(height * dpr)) {
        cv.width = Math.round(cssW * dpr);
        cv.height = Math.round(height * dpr);
        cv.style.height = `${height}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, height);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, cssW, height);

      const S = clamp(cssW / REF_W, 0.5, 1);
      const cx = cssW / 2;
      const cy = height / 2;
      const w = wRef.current * S;
      const h = SHAPE_H * S;

      drawShape(ctx, shape, cx, cy, w, h, INK);

      // calipers
      ctx.strokeStyle = 'rgba(56,189,248,0.55)';
      ctx.lineWidth = 1;
      [cx - w / 2, cx + w / 2].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, cy - h / 2 - 14);
        ctx.lineTo(x, cy + h / 2 + 14);
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy + h / 2 + 14);
      ctx.lineTo(cx + w / 2, cy + h / 2 + 14);
      ctx.stroke();

      // handles
      [cx - w / 2, cx + w / 2].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, cy + h / 2 + 14, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56,189,248,0.9)';
        ctx.fill();
      });

      raf = window.requestAnimationFrame(paint);
    };

    raf = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(raf);
  }, [height, shape]);

  const pointer = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.type === 'pointermove' && e.buttons === 0) return;
    const cv = ref.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const S = clamp(r.width / REF_W, 0.5, 1);
    const dx = Math.abs(e.clientX - r.left - r.width / 2);
    onSet(clamp((dx * 2) / S, MIN_W, MAX_W));
  };

  return (
    <canvas
      ref={ref}
      onPointerDown={pointer}
      onPointerMove={pointer}
      className="block w-full cursor-ew-resize touch-none rounded-md"
      style={{ height }}
    />
  );
}

// ---- trials ---------------------------------------------------------------

type Trial = {
  cond: Cond;
  shape: ShapeKey;
  width: number; // units, the truth
  start: number; // units, where the adjuster begins
  startAbove: boolean;
  speed: number; // units per second
  options: ShapeKey[];
  fixChar: string;
  fixFrom: number;
  fixTo: number;
};

function buildTrial(cond: Cond, shape: ShapeKey): Trial {
  const width = Math.round(rnd(96, 186));
  const startAbove = Math.random() < 0.5;
  const start = clamp(Math.round(width * (startAbove ? rnd(1.35, 1.62) : rnd(0.52, 0.72))), MIN_W, MAX_W);
  const speed = Math.round(rnd(165, 235));
  const dur = ((width + 2 * PAD) / speed) * 1000;
  const foils = shuffle(SHAPE_KEYS.filter((k) => k !== shape)).slice(0, 3);
  const fixFrom = rnd(0.3, 0.62) * dur;
  return {
    cond,
    shape,
    width,
    start,
    startAbove,
    speed,
    options: shuffle([shape, ...foils]),
    fixChar: FIX_CHARS[Math.floor(Math.random() * FIX_CHARS.length)],
    fixFrom,
    fixTo: fixFrom + 260,
  };
}

function buildRun(): Trial[] {
  const shapes = shuffle(SHAPE_KEYS);
  const pool: Trial[] = [];
  const conds: Cond[] = ['full', 'free', 'fixed'];
  conds.forEach((c, ci) => {
    for (let i = 0; i < PER_COND; i++) {
      pool.push(buildTrial(c, shapes[(ci * PER_COND + i) % shapes.length]));
    }
  });
  return shuffle(pool);
}

type Rec = {
  cond: Cond;
  ratio: number;
  idOK: boolean | null;
  fixOK: boolean | null;
  settledBelow: boolean;
  startAbove: boolean;
};

type Step = 'watch' | 'fixq' | 'ident' | 'adjust';

// ---- the page -------------------------------------------------------------

type Phase = 'intro' | 'demo' | 'trials' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState<Step>('watch');
  const [running, setRunning] = useState(false);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [demo, setDemo] = useState<Trial | null>(null);
  const [setW, setSetW] = useState(120);
  const [touched, setTouched] = useState(false);
  const [idPick, setIdPick] = useState<ShapeKey | null>(null);
  const [fixPick, setFixPick] = useState<string | null>(null);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [copied, setCopied] = useState(false);

  const timers = useRef<number[]>([]);
  const live = useRef<StageLive>({
    playing: false,
    t0: 0,
    dur: 1200,
    shape: 'diamond',
    width: 140,
    slit: SLIT_W,
    panel: true,
    fixMark: false,
    fixChar: '5',
    fixFrom: 400,
    fixTo: 660,
    frozen: null,
  });

  const trial = phase === 'demo' ? demo : (trials[tIdx] ?? null);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // A crossing gets a lead-in: panel and fixation marker on screen, nothing moving, so the eye has
  // somewhere to be before the thing it is going to miss starts happening.
  const play = useCallback(
    (t: Trial) => {
      clearTimers();
      const dur = ((t.width + 2 * PAD) / t.speed) * 1000;
      live.current = {
        playing: false,
        t0: 0,
        dur,
        shape: t.shape,
        width: t.width,
        slit: t.cond === 'full' ? WIDE_W : SLIT_W,
        panel: t.cond !== 'full',
        fixMark: t.cond === 'fixed',
        fixChar: t.fixChar,
        fixFrom: t.fixFrom,
        fixTo: t.fixTo,
        frozen: null,
      };
      setRunning(true);
      setStep('watch');
      timers.current.push(
        window.setTimeout(() => {
          live.current.t0 = performance.now();
          live.current.playing = true;
        }, LEAD_IN)
      );
      timers.current.push(
        window.setTimeout(() => {
          live.current.playing = false;
          live.current.frozen = null;
          setRunning(false);
          setSetW(t.start);
          setTouched(false);
          setIdPick(null);
          setFixPick(null);
          setStep(t.cond === 'fixed' ? 'fixq' : t.cond === 'free' ? 'ident' : 'adjust');
        }, LEAD_IN + dur + 90)
      );
    },
    [clearTimers]
  );

  const beginDemo = () => {
    const t = buildTrial('free', 'diamond');
    setDemo(t);
    setPhase('demo');
    play(t);
  };

  const beginRun = () => {
    const run = buildRun();
    setTrials(run);
    setTIdx(0);
    setRecs([]);
    setPhase('trials');
    play(run[0]);
  };

  const commit = () => {
    if (!trial) return;
    const rec: Rec = {
      cond: trial.cond,
      ratio: setW / trial.width,
      idOK: trial.cond === 'full' ? null : idPick === trial.shape,
      fixOK: trial.cond === 'fixed' ? fixPick === trial.fixChar : null,
      settledBelow: setW < trial.width,
      startAbove: trial.startAbove,
    };
    if (phase === 'demo') {
      setPhase('intro');
      setStep('watch');
      return;
    }
    const next = tIdx + 1;
    setRecs((r) => [...r, rec]);
    if (next >= trials.length) {
      setPhase('result');
      setStep('watch');
      return;
    }
    setTIdx(next);
    play(trials[next]);
  };

  const score = useMemo(() => {
    if (phase !== 'result' || recs.length === 0) return null;
    const by = (c: Cond) => recs.filter((r) => r.cond === c).map((r) => r.ratio);
    const full = by('full');
    const free = by('free');
    const fixed = by('fixed');
    const slit = [...free, ...fixed];

    const base = mean(full) || 1;
    const rel = (xs: number[]) => (xs.length ? mean(xs) / base : 0);

    const idTrials = recs.filter((r) => r.idOK !== null);
    const idHits = idTrials.filter((r) => r.idOK).length;
    const fixTrials = recs.filter((r) => r.fixOK !== null);
    const fixHits = fixTrials.filter((r) => r.fixOK).length;

    const belowFromAbove = recs.filter((r) => r.startAbove && r.settledBelow).length;
    const startedAbove = recs.filter((r) => r.startAbove).length;

    const pSlit = permP(slit, full, -1);
    const pEye = permP(fixed, free, -1);
    const pId = binomTail(idHits, idTrials.length, 0.25);

    return {
      full,
      free,
      fixed,
      slit,
      baseline: base,
      relSlit: rel(slit),
      relFree: rel(free),
      relFixed: rel(fixed),
      pSlit,
      pEye,
      idHits,
      idN: idTrials.length,
      pId,
      fixHits,
      fixN: fixTrials.length,
      belowFromAbove,
      startedAbove,
      trusted: Math.abs(base - 1) <= FULL_TOL,
      forkTrusted: fixTrials.length > 0 && fixHits >= fixTrials.length - 1,
      compressed: rel(slit) < 1,
      slitSig: pSlit < 0.05 && rel(slit) < 1,
      idSig: pId < 0.05,
      eyeSig: pEye < 0.05 && rel(fixed) < rel(free),
    };
  }, [phase, recs]);

  const onCopy = useCallback(() => {
    if (!score) return;
    const txt = `Narrower Than It Was: shapes crossing behind a seven pixel slit.
I never saw one whole. I saw one anyway, and named ${score.idHits} of ${score.idN} (guessing gets ${Math.round(score.idN * 0.25)}).
Then I reported how wide it was: ${pct(score.relSlit)} of its real width, measured against my own full-view baseline.
Eyes parked: ${pct(score.relFixed)}. Eyes free: ${pct(score.relFree)}.
The shape only ever existed as a stack of moments, and the stack got read short.
https://wiz.jock.pl/experiments/narrower-than-it-was`;
    navigator.clipboard?.writeText(txt).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [score]);

  const stageHeight = 232;

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
          <div className="mb-3 text-5xl">🪟</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Narrower Than It Was
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A shape goes past a slit seven pixels wide. Your eye never receives the shape, only one
            column of it at a time. You will see it whole anyway, you will be able to name it, and it
            will come back to you thinner than it was.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                There is a panel with a narrow slit cut in it. Behind the panel, a shape slides past.
                At no single instant is there a shape on your screen. There is a bright column, one
                column wide, changing over about a second. Nothing in your eye is ever handed the
                figure.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You will see the figure. In one piece, with a shape you can name. This is{' '}
                <span className="text-cyan-300">anorthoscopic perception</span>, described by Zöllner
                in 1862, rediscovered by Parks in 1965 and made famous by Irvin Rock in 1981. Whatever
                puts the shape together is not your retina, because your retina was never given it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                And it comes back wrong in one specific direction. The figure is{' '}
                <span className="text-violet-300">compressed along the axis it travelled</span>.
                Narrower than it was. That is the number this page measures, and it is the interesting
                part, because it means the shape is being rebuilt out of time and the time is being
                read at the wrong scale.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
                how it works · about four minutes
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">One practice crossing</span> so the task stops
                  being strange. Nothing is scored.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">Twelve crossings</span> in three kinds,
                  shuffled: in the open, behind the slit with your eyes free, and behind the slit with
                  your eyes parked on a marker.
                </li>
                <li>
                  2️⃣ After each one you <span className="text-emerald-300">drag a shape</span> until it
                  is as wide as the one you just saw. Slit trials also ask which shape it was.
                </li>
                <li>
                  3️⃣ The headline is the slit trials <span className="text-slate-100">divided by</span>{' '}
                  your own open trials, so whatever you personally do with a mouse cancels out.
                </li>
                <li>
                  👁️ On the parked trials a small character above the slit changes once. Report it.
                  Off the fovea it cannot be read, so getting it right is the evidence that your eye
                  stayed put.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                five ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  Nothing is scored as an absolute. Every headline is a ratio against{' '}
                  <span className="text-slate-300">the same person&apos;s open trials</span>, which
                  share the shapes, the speeds, the screen, the mouse and the habit of setting things a
                  bit small. A constant bias of any size cancels exactly.
                </li>
                <li>
                  The adjuster starts <span className="text-slate-300">too wide</span> on half the
                  trials and <span className="text-slate-300">too narrow</span> on the other half, at
                  random. The page prints how often you settled below the truth having started above
                  it, which is the receipt that the number is not just where the handle happened to
                  begin.
                </li>
                <li>
                  The speed changes on every crossing, so how long it took is not a usable cue to how
                  wide it was. Counting will not help you.
                </li>
                <li>
                  All four shape options are drawn at the same height, so height carries no
                  information. Only the profile along the travel axis can answer that question, and
                  that profile is exactly what the slit delivered.
                </li>
                <li>
                  Your open trials are also the sanity check. If you cannot set a width for a shape
                  that was in plain sight, the run is printed rather than scored.
                </li>
              </ul>
            </div>

            {demo ? (
              <div className="space-y-3">
                <button
                  onClick={beginRun}
                  className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-4 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
                >
                  run the twelve crossings →
                </button>
                <button
                  onClick={beginDemo}
                  className="w-full rounded-md border border-slate-700 bg-slate-900/40 py-2 font-mono text-xs text-slate-500 transition-colors hover:border-slate-600"
                >
                  ↻ one more practice crossing
                </button>
              </div>
            ) : (
              <button
                onClick={beginDemo}
                className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                show me one crossing →
              </button>
            )}
          </div>
        )}

        {/* ---------- DEMO + TRIALS ---------- */}
        {(phase === 'demo' || phase === 'trials') && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">
                {phase === 'demo' ? 'practice · nothing is scored' : `crossing ${tIdx + 1} of ${trials.length}`}
              </span>
              <span
                className={
                  trial.cond === 'full'
                    ? 'text-emerald-300/80'
                    : trial.cond === 'fixed'
                      ? 'text-red-300/80'
                      : 'text-cyan-300/80'
                }
              >
                {COND_LABEL[trial.cond]}
              </span>
            </div>

            {step === 'watch' && trial.cond === 'fixed' && (
              <div className="rounded-lg border border-red-400/25 bg-red-400/[0.05] p-3 text-center text-sm text-slate-300">
                Eyes on the red <span className="font-mono text-red-300">+</span> above the slit and
                keep them there. It turns into a digit once. You will be asked which one.
              </div>
            )}
            {step === 'watch' && trial.cond === 'free' && (
              <div className="rounded-lg border border-cyan-400/25 bg-cyan-400/[0.05] p-3 text-center text-sm text-slate-300">
                Eyes wherever they want to go, including following the shape you cannot see.
              </div>
            )}
            {step === 'watch' && trial.cond === 'full' && (
              <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.05] p-3 text-center text-sm text-slate-300">
                No panel this time. Watch it cross in the open.
              </div>
            )}

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              {step === 'adjust' ? (
                <Adjuster shape={trial.shape} width={setW} onSet={(w) => { setSetW(w); setTouched(true); }} />
              ) : (
                <Stage live={live} height={stageHeight} />
              )}
            </div>

            {step === 'watch' && (
              <p className="text-center font-mono text-xs text-slate-600">
                {running ? 'watching' : 'ready'}
              </p>
            )}

            {/* fixation check */}
            {step === 'fixq' && (
              <div className="space-y-3">
                <p className="text-center text-sm text-slate-300">
                  Which digit appeared above the slit?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {FIX_CHARS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setFixPick(c);
                        setStep('ident');
                      }}
                      className="rounded-md border border-slate-700 bg-slate-900/60 py-4 font-mono text-lg text-slate-200 transition-colors hover:border-red-400/60 hover:bg-red-400/10"
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <p className="text-center font-mono text-[11px] text-slate-600">
                  no idea is a real answer here · guess and move on
                </p>
              </div>
            )}

            {/* identification */}
            {step === 'ident' && (
              <div className="space-y-3">
                <p className="text-center text-sm text-slate-300">Which shape went past?</p>
                <div className="grid grid-cols-4 gap-2">
                  {trial.options.map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setIdPick(k);
                        setStep('adjust');
                      }}
                      className="group rounded-md border border-slate-700 bg-slate-900/60 p-2 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10"
                    >
                      <ShapeChip shape={k} />
                      <span className="mt-1 block font-mono text-[10px] text-slate-500 group-hover:text-cyan-300">
                        {SHAPE_NAME[k]}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-center font-mono text-[11px] text-slate-600">
                  all four are the same height · only the width profile can tell them apart
                </p>
              </div>
            )}

            {/* adjustment */}
            {step === 'adjust' && (
              <div className="space-y-3">
                <p className="text-center text-sm text-slate-300">
                  Drag left or right until it is <span className="text-cyan-300">as wide as the one
                  you just saw</span>. The height is already right.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setSetW((w) => clamp(w - 6, MIN_W, MAX_W)); setTouched(true); }}
                    className="rounded-md border border-slate-700 bg-slate-900/60 px-4 py-2 font-mono text-sm text-slate-300 hover:border-cyan-400/50"
                  >
                    ← narrower
                  </button>
                  <button
                    onClick={() => { setSetW((w) => clamp(w + 6, MIN_W, MAX_W)); setTouched(true); }}
                    className="rounded-md border border-slate-700 bg-slate-900/60 px-4 py-2 font-mono text-sm text-slate-300 hover:border-cyan-400/50"
                  >
                    wider →
                  </button>
                </div>
                <button
                  onClick={commit}
                  disabled={!touched}
                  className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/40 disabled:text-slate-500"
                >
                  {!touched
                    ? 'move it at least once'
                    : phase === 'demo'
                      ? 'done, back to the start →'
                      : tIdx + 1 >= trials.length
                        ? 'finish →'
                        : 'next crossing →'}
                </button>
              </div>
            )}

            {phase === 'demo' && step !== 'adjust' && (
              <button
                onClick={() => { clearTimers(); setPhase('intro'); }}
                className="w-full rounded-md border border-slate-700 bg-slate-900/40 py-2 font-mono text-xs text-slate-500 hover:border-slate-600"
              >
                skip the practice
              </button>
            )}
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && (
          <div className="space-y-6">
            {/* headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6">
              <div className="text-center font-mono text-xs uppercase tracking-wider text-cyan-300/70">
                a shape you never saw, reported at
              </div>
              <div className="mt-3 text-center">
                <div className="font-mono text-6xl font-bold text-cyan-200">{pct(score.relSlit)}</div>
                <div className="mt-1 font-mono text-[11px] text-slate-500">
                  of its real width · against your own open-view baseline · {pText(score.pSlit)}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-cyan-500/40 bg-cyan-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80">
                    eyes free
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-cyan-200">
                    {pct(score.relFree)}
                  </div>
                </div>
                <div className="rounded-md border border-red-500/40 bg-red-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-red-300/80">
                    eyes parked
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-red-200">
                    {pct(score.relFixed)}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-wider text-slate-500">
                  one shape at your ratio · the amber outline is where its edges actually were
                </div>
                <CompareStrip ratio={score.relSlit} />
              </div>
            </div>

            {!score.trusted && (
              <div className="rounded-lg border border-red-400/40 bg-red-400/[0.06] p-5 text-sm leading-relaxed text-slate-300">
                <span className="font-mono text-xs uppercase tracking-wider text-red-300">
                  not scored
                </span>
                <p className="mt-2">
                  On the open trials the shape was fully visible for the whole crossing and you set its
                  width to {pct(score.baseline)} of what it was, against a tolerance of{' '}
                  {Math.round(FULL_TOL * 100)}%. That is a visible object with a visible answer, so
                  missing it means the adjustment was being placed rather than matched. Everything below
                  is printed for honesty, not because it means anything.
                </p>
              </div>
            )}

            {/* identification */}
            <div className="rounded-lg border border-violet-500/30 bg-violet-500/[0.05] p-5">
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-xs uppercase tracking-wider text-violet-300/80">
                  shapes named, having never been seen
                </div>
                <div className="font-mono text-2xl font-bold text-violet-200">
                  {score.idHits}/{score.idN}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {score.idSig
                  ? `Guessing gets ${Math.round(score.idN * 0.25)} of ${score.idN} and you got ${score.idHits} (${pText(score.pId)}). At no instant was any of those shapes on the screen. There was a column, seven pixels wide, and a sequence. You reported an object.`
                  : `Guessing gets ${Math.round(score.idN * 0.25)} of ${score.idN} and you got ${score.idHits}, which ${score.idN} trials cannot separate from guessing (${pText(score.pId)}). Some of these shapes are genuinely hard through a slit, especially at the faster speeds, and the pairs that share a profile along the travel axis are the ones that swallow each other.`}
              </p>
            </div>

            {/* verdict */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-cyan-300/70">
                what those numbers say
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span>{score.slitSig ? '✅' : score.compressed ? '➖' : '↩️'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The slit made it narrower.</span>{' '}
                    {score.slitSig
                      ? `You reported the slit shapes at ${pct(score.relSlit)} of the width you gave the same kind of shapes in the open (${pText(score.pSlit)}). Same shapes, same speeds, same screen, same hand. The only thing that changed was whether you were allowed to see more than one column at a time.`
                      : score.compressed
                        ? `You landed at ${pct(score.relSlit)}, in the predicted direction, which four trials a condition cannot separate from noise (${pText(score.pSlit)}). The classic reports are a large compression, but they are also from people who did dozens of these in a dark room.`
                        : `Yours came out at ${pct(score.relSlit)}, which is not compressed at all. That happens, and the most common reason is that the eye tracked the imaginary object well enough to paint most of it back onto the retina. Your parked-eye number is the one to read next.`}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>{score.eyeSig ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">
                      {score.relFixed < score.relFree
                        ? `Parking the eye cost you another ${Math.round((score.relFree - score.relFixed) * 100)} points.`
                        : `Parking the eye cost you nothing, or ${Math.round((score.relFixed - score.relFree) * 100)} points the other way.`}
                    </span>{' '}
                    {!score.forkTrusted
                      ? `Except it did not, because you got ${score.fixHits} of ${score.fixN} fixation digits, and a missed digit means the eye was somewhere else. This fork is printed, not scored.`
                      : score.eyeSig
                        ? `With the eye parked the shape came back at ${pct(score.relFixed)}, against ${pct(score.relFree)} with the eye free (${pText(score.pEye)}). That is the retinal painting account earning its keep: some of the width you get is smeared onto your retina by your own eye following an object that is not there.`
                        : `With the eye parked you were at ${pct(score.relFixed)} and with it free ${pct(score.relFree)}, a gap this run cannot call (${pText(score.pEye)}, floor 0.014). Which is itself the interesting outcome, because the form survived a parked eye either way, and a parked eye paints nothing.`}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>🎚️</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The handle was not the answer.</span> The adjuster
                    started too wide on {score.startedAbove} of the {recs.length} crossings, and on{' '}
                    {score.belowFromAbove} of those you dragged it all the way past the true width and
                    settled below it. Starting position is a real bias in this method, which is why it
                    was randomised and why this line exists.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>📐</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">Your own baseline was {pct(score.baseline)}.</span>{' '}
                    That is what you did with a shape in plain sight, and every headline above has
                    already been divided by it. Whatever you do with a mouse, whatever your screen is,
                    whatever you think a matching width feels like, it is in that number and it is
                    gone from the others.
                  </span>
                </div>
              </div>
            </div>

            {/* the assembler */}
            <Assembler />

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
                  setStep('watch');
                  setRecs([]);
                  setTrials([]);
                  setTIdx(0);
                }}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <Playground />

            {/* the argument */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                the argument this page cannot settle
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-slate-500">
                <p>
                  <span className="text-slate-400">Retinal painting.</span> Anstis and Atkinson in
                  1967, Haber and Nathanson in 1968 and Morgan, Findlay and Watt in their 1982
                  synthesis argued there is nothing post-retinal about this at all. Your eye drifts in
                  the direction of the motion you believe in, and that drift smears the successive
                  columns across different retinal positions. The retina does get a picture. Your own
                  eye paints it, and it comes out narrow because an eye covers less ground than the
                  object does. That account predicts the parked-eye condition should be much worse,
                  which is why this page runs it.
                </p>
                <p>
                  <span className="text-slate-400">Post-retinal assembly.</span> Parks in 1965 and Rock
                  and Halper in 1969 argued the form is put together after the retina, in a frame of
                  reference that moves with the object rather than with your eye. Fendrich, Rieger and
                  Heinze stabilised the display on the retina in 2005 and reported the percept
                  survived, which painting alone does not predict. Palmer, Kellman and Shipley&apos;s
                  spatiotemporal relatability, Nishida&apos;s motion-based form analysis and
                  Öğmen and Herzog&apos;s non-retinotopic reference frames are the modern versions.
                </p>
                <p>
                  Both mechanisms probably run. Your two numbers do not decide it, and a page that
                  claimed they did would be lying to you.
                </p>
              </div>
            </div>

            {/* caveats */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                what this is not
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-500">
                <li>
                  <span className="text-slate-400">Four trials a condition is a demonstration.</span>{' '}
                  The classic studies ran dozens per person in controlled viewing. At this length one
                  careless drag moves a mean by more than the effect being hunted.
                </li>
                <li>
                  <span className="text-slate-400">There is no eye tracker here.</span> The fixation
                  digit is a good proxy and a standard one, and it is still a proxy. It tells you the
                  eye was near the marker at one moment, not that it was parked for the whole crossing.
                </li>
                <li>
                  <span className="text-slate-400">Pixels are not degrees.</span> The page cannot know
                  how far your face is from the screen, so nothing here is in units of visual angle.
                  Every number is a ratio, which is the only reason that does not matter.
                </li>
                <li>
                  <span className="text-slate-400">Your display is in the numbers.</span> A slit seven
                  units wide on a phone is a different physical thing than on a monitor, refresh rate
                  quantises the motion into steps of about 17 ms, and both are constants that cancel
                  in a ratio.
                </li>
                <li>
                  <span className="text-slate-400">Duration is a cue and you may have used it.</span>{' '}
                  The speed was randomised on every crossing precisely to break that, but a person
                  who deliberately times the crossing is doing arithmetic rather than seeing, and the
                  page cannot tell the difference.
                </li>
                <li>
                  <span className="text-slate-400">This is not a trait.</span> It is not visual acuity,
                  attention, intelligence or imagination. Everything ran in your browser, nothing was
                  recorded, nothing left the page.
                </li>
              </ul>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                the rest of the lab
              </div>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Every sibling took a picture away from you and measured what was left.{' '}
                <span className="text-slate-400">Already Gone</span> timed how fast the visual buffer
                evaporates. <span className="text-slate-400">The Gist</span> found an average that
                outlived every item in it. <span className="text-slate-400">It Went Straight</span>{' '}
                caught position being integrated over time and drifting. This one never gave you a
                picture in the first place, and you built one.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/the-gist" className="text-cyan-400/80 hover:text-cyan-300">
                  The Gist
                </a>
                <a href="/experiments/already-gone" className="text-cyan-400/80 hover:text-cyan-300">
                  Already Gone
                </a>
                <a href="/experiments/it-went-straight" className="text-cyan-400/80 hover:text-cyan-300">
                  It Went Straight
                </a>
                <a href="/experiments/space-between" className="text-cyan-400/80 hover:text-cyan-300">
                  The Space Between
                </a>
                <a href="/experiments/after-the-fact" className="text-cyan-400/80 hover:text-cyan-300">
                  After the Fact
                </a>
                <a href="/experiments/change-blindness" className="text-cyan-400/80 hover:text-cyan-300">
                  Change Blindness
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

// ---- little shape chip ----------------------------------------------------

function ShapeChip({ shape }: { shape: ShapeKey }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 64;
    const h = 56;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    drawShape(ctx, shape, w / 2, h / 2, 40, 44, '#cbd5e1');
  }, [shape]);

  return <canvas ref={ref} className="mx-auto block" style={{ width: 64, height: 56 }} />;
}

// ---- true versus reported -------------------------------------------------

function CompareStrip({ ratio }: { ratio: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const H = 150;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, H);

    const cx = cssW / 2;
    const cy = H / 2;
    const trueW = Math.min(240, cssW - 60);
    drawShape(ctx, 'diamond', cx, cy, trueW * clamp(ratio, 0.1, 1.6), 110, 'rgba(56,189,248,0.85)');
    drawShape(ctx, 'diamond', cx, cy, trueW, 110, null, {
      color: 'rgba(251,191,36,0.9)',
      width: 2,
      dash: [5, 4],
    });
  }, [ratio]);

  return <canvas ref={ref} className="block w-full rounded-md bg-slate-950" style={{ height: H }} />;
}

// ---- the assembler --------------------------------------------------------

// The demonstration of what the compression IS. On the left, the shape through the slit. On the right,
// the same crossing laid out in space: every column painted where it would land if the assembly ran at
// a chosen speed. Assemble at the true speed and the shape comes back true. Assemble slow and it comes
// back narrow. Your visual system picks a speed and does not tell you which one.
function Assembler() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [gain, setGain] = useState(0.65);
  const gainRef = useRef(gain);
  gainRef.current = gain;
  const H = 210;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();
    const DUR = 2600;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(cssW * dpr);
        cv.height = Math.round(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, H);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, cssW, H);

      const half = cssW / 2;
      const p = ((performance.now() - t0) % DUR) / DUR;
      const shapeW = Math.min(150, half - 46);
      const shapeH = 108;
      const cy = H / 2 + 6;

      // left: the slit view
      const slitX = half / 2;
      const pad = 26;
      const travel = shapeW + 2 * pad;
      const x = slitX - shapeW / 2 - pad + p * travel;
      ctx.fillStyle = PANEL;
      ctx.fillRect(0, cy - shapeH / 2 - 12, half - 8, shapeH + 24);
      ctx.save();
      ctx.beginPath();
      ctx.rect(slitX - 3, cy - shapeH / 2 - 10, 6, shapeH + 20);
      ctx.clip();
      ctx.fillStyle = '#000';
      ctx.fillRect(slitX - 3, cy - shapeH / 2 - 10, 6, shapeH + 20);
      drawShape(ctx, 'crescent', x, cy, shapeW, shapeH, INK);
      ctx.restore();
      ctx.strokeStyle = 'rgba(56,189,248,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(slitX - 3.5, cy - shapeH / 2 - 10.5, 7, shapeH + 21);

      // right: the same crossing, assembled at the chosen gain
      const g = gainRef.current;
      const aw = shapeW * g;
      const ax = half + half / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(ax - aw / 2, cy - shapeH / 2 - 12, aw * clamp((p - pad / travel) / (shapeW / travel), 0, 1), shapeH + 24);
      ctx.clip();
      drawShape(ctx, 'crescent', ax, cy, aw, shapeH, 'rgba(56,189,248,0.85)');
      ctx.restore();
      drawShape(ctx, 'crescent', ax, cy, shapeW, shapeH, null, {
        color: 'rgba(251,191,36,0.45)',
        width: 1.5,
        dash: [5, 4],
      });

      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.fillText('what the eye receives', half / 2, 18);
      ctx.fillText('what it gets assembled into', half + half / 2, 18);

      raf = window.requestAnimationFrame(paint);
    };

    raf = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
        what the compression actually is
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-500">
        On the left is everything your eye was ever given: one column, changing. On the right is that
        same sequence laid back out in space, which is the only place a shape can exist. The columns
        have to be painted at some spacing, and the spacing is a guess about how fast the thing was
        moving. Guess low and the shape comes back narrow. The amber outline is the truth.
      </p>
      <canvas ref={ref} className="block w-full rounded-md" style={{ height: 210 }} />
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-slate-500">
          <span>assembly gain</span>
          <span className="text-cyan-300">{pct(gain)} of the true speed</span>
        </div>
        <input
          type="range"
          min={30}
          max={120}
          value={Math.round(gain * 100)}
          onChange={(e) => setGain(Number(e.target.value) / 100)}
          className="w-full accent-cyan-400"
        />
      </div>
    </div>
  );
}

// ---- playground -----------------------------------------------------------

const PG_SPEEDS = [110, 220, 440, 880];

type PgRow = { speed: number; ratio: number };

function Playground() {
  const [rows, setRows] = useState<PgRow[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'watch' | 'adjust'>('idle');
  const [shape, setShape] = useState<ShapeKey>('star');
  const [truth, setTruth] = useState(150);
  const [w, setW] = useState(120);
  const timer = useRef<number | null>(null);

  const live = useRef<StageLive>({
    playing: false,
    t0: 0,
    dur: 1200,
    shape: 'star',
    width: 150,
    slit: SLIT_W,
    panel: true,
    fixMark: false,
    fixChar: '5',
    fixFrom: 0,
    fixTo: 0,
    frozen: null,
  });

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const run = (speed: number) => {
    const s = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
    const t = Math.round(rnd(110, 180));
    const dur = ((t + 2 * PAD) / speed) * 1000;
    setShape(s);
    setTruth(t);
    setActive(speed);
    setPhase('watch');
    live.current = {
      playing: true,
      t0: performance.now(),
      dur,
      shape: s,
      width: t,
      slit: SLIT_W,
      panel: true,
      fixMark: false,
      fixChar: '5',
      fixFrom: 0,
      fixTo: 0,
      frozen: null,
    };
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      live.current.playing = false;
      setW(Math.round(t * (Math.random() < 0.5 ? rnd(1.35, 1.6) : rnd(0.55, 0.72))));
      setPhase('adjust');
    }, dur + 90);
  };

  const record = () => {
    if (active === null) return;
    setRows((r) => [...r.filter((x) => x.speed !== active), { speed: active, ratio: w / truth }]);
    setPhase('idle');
    setActive(null);
  };

  const maxRatio = Math.max(1.2, ...rows.map((r) => r.ratio));

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.04] p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/80">
        playground · how fast can it go before the shape falls apart
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-400">
        Same task, one crossing per speed, nothing scored. Retinal painting predicts the compression
        should get worse as the figure outruns anything an eye can follow: at 880 units a second no eye
        is keeping up, so almost nothing gets painted and whatever width you report has to have been
        assembled some other way. A purely post-retinal assembly has no particular reason to care about
        speed at all. Run all four and look at your own curve.
      </p>

      {phase !== 'idle' && (
        <div className="mb-4 space-y-3">
          <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
            {phase === 'adjust' ? (
              <Adjuster shape={shape} width={w} onSet={setW} height={160} />
            ) : (
              <Stage live={live} height={190} />
            )}
          </div>
          {phase === 'adjust' && (
            <button
              onClick={record}
              className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-3 font-mono text-xs text-violet-200 hover:bg-violet-400/20"
            >
              record {active} units per second →
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {PG_SPEEDS.map((s) => {
          const row = rows.find((r) => r.speed === s);
          return (
            <button
              key={s}
              onClick={() => run(s)}
              disabled={phase === 'adjust'}
              className="rounded-md border border-slate-700 bg-slate-900/60 p-3 text-center transition-colors hover:border-violet-400/60 hover:bg-violet-400/10 disabled:opacity-40"
            >
              <div className="font-mono text-[11px] text-slate-500">{s}/s</div>
              <div className="mt-1 font-mono text-lg text-violet-200">
                {row ? pct(row.ratio) : '—'}
              </div>
            </button>
          );
        })}
      </div>

      {rows.length > 1 && (
        <div className="mt-4 space-y-1.5">
          {PG_SPEEDS.filter((s) => rows.some((r) => r.speed === s)).map((s) => {
            const row = rows.find((r) => r.speed === s)!;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-right font-mono text-[10px] text-slate-500">{s}/s</span>
                <div className="relative h-3 flex-1 rounded-full bg-slate-800">
                  <div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                    style={{ width: `${clamp((row.ratio / maxRatio) * 100, 2, 100)}%` }}
                  />
                  <div
                    className="absolute -top-1 h-5 w-px bg-amber-400/70"
                    style={{ left: `${clamp((1 / maxRatio) * 100, 0, 100)}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 font-mono text-[10px] text-slate-400">{pct(row.ratio)}</span>
              </div>
            );
          })}
          <div className="pt-1 text-center font-mono text-[10px] uppercase tracking-wider text-amber-400/70">
            the amber line is the true width
          </div>
        </div>
      )}
    </div>
  );
}
