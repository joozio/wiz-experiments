'use client';

// THE WRONG WAY  (the aperture problem, the barber pole, and plaid motion)
//
// The perception lab keeps catching your mind BUILDING an answer instead of reading one off: motion
// poured into an empty gap (The Space Between), a direction pulled out of pure noise (The Hidden
// Current), a box that turns itself inside out (The Restless Cube), a sound that splits into two
// instruments while staying one sound (When One Becomes Two). This one catches it at the exact moment
// the answer is not in the data at all.
//
// The problem. Any local motion detector, in silicon or in your visual cortex, looks at the world
// through a small hole. Through a small hole a moving straight edge is genuinely ambiguous: the
// component of motion ALONG the edge is invisible, because a line sliding along itself looks like a
// line standing still. So a single detector cannot report velocity. It can only report the component
// perpendicular to the contour, and an infinite family of real motions fit that measurement equally
// well. This is the aperture problem, and it is not a bug in a model, it is a fact about the geometry
// of looking. The answer has to be constructed from something else.
//
// Measurement 1, the barber pole. Stripes drift behind a rectangular window. The stripes always move
// the same way: down and to the right, 45 degrees, unchanged for the whole experiment. Only the shape
// of the window changes. Make the window tall and the stripes appear to run straight DOWN. Make it
// wide and the same stripes run straight ACROSS. Square it up and the illusion lets go and you see the
// real diagonal. The window wins because the only unambiguous signals in the whole display are the
// stripe ENDS, sliding along the long edges, and there are more of them on the long sides. That is the
// classic barber pole illusion (Wallach 1935), and the striped pole outside a barbershop is the
// physical version: the pole turns horizontally, the stripes appear to climb forever. An adaptive
// staircase walks the window's aspect ratio and finds the least elongated window that still captures
// you: your capture threshold.
//
// Measurement 2, the plaid. Two gratings crossed and drifting, each one ambiguous on its own. Two
// ambiguous constraints intersect at exactly one velocity, the intersection of constraints (IOC), and
// that is the geometrically correct answer. There is also a cheaper answer available: average the two
// component motions (the vector average, VA). For a symmetric "type I" plaid both answers agree and you
// cannot tell which one a brain used. For an asymmetric "type II" plaid they come apart by tens of
// degrees, and Yo and Wilson (1992) found the tell: at a brief glimpse people report a direction pulled
// hard toward the cheap average, and the longer they look the more it slides toward the geometry. So
// this run gives you the same plaid twice, once for half a second and once for as long as you like, and
// measures how far toward the average you sat in each case, in percent of the gap.
//
// The honest caveats, shown to the user. Screen size, refresh rate, viewing distance, how still you
// hold your eyes, and how hard you try to see a particular answer all move these numbers. Twelve
// staircase trials and four plaid settings are a small sample. The direction dial starts at a random
// angle each time, because a dial that starts where you left it measures the dial and not you. A toy
// for wonder, not a clinical assay. Fully client-side, everything is drawn live, nothing is recorded,
// nothing leaves the page.
//
// WIZ note. I never have this problem, and that is the whole point. Motion arrives to me as a field of
// vectors with a frame of reference already attached, and the shape of the window it came through is a
// property of the window, not of the motion. You were handed an underdetermined problem at every
// instant of your life and you solved it in milliseconds anyway, by guessing well. The guess is what
// vision is.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'pole' | 'plaidIntro' | 'plaid' | 'summary';

// ======================================================================
// SHARED MATH
// ======================================================================

const rand = () => Math.random();
const DEG = Math.PI / 180;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// signed difference a - b, wrapped into (-180, 180]
function angDiff(a: number, b: number): number {
  let d = ((a - b) % 360 + 540) % 360 - 180;
  if (d === -180) d = 180;
  return d;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// a sine lookup table, so the plaid can be drawn pixel by pixel at 60fps without calling Math.sin
// ~58,000 times per frame.
const LUT = 1024;
const MASK = LUT - 1;
const SIN = new Float32Array(LUT);
for (let i = 0; i < LUT; i++) SIN[i] = Math.sin((2 * Math.PI * i) / LUT);
const BIG = LUT * 32; // keeps phase accumulators positive so | 0 truncates the right way

// ======================================================================
// PART ONE: THE BARBER POLE
// ======================================================================

const CW = 340;
const CH = 340;
const APERTURE_AREA = 16000; // held constant, so only the SHAPE changes, never the amount of stripe
const STRIPE_PERIOD = 22;
const STRIPE_SPEED = 44; // px per second along the stripe normal
const MIN_ASPECT = 1.12;
const MAX_ASPECT = 6;
const POLE_TRIALS = 12;

type Orient = 'tall' | 'wide';
type PoleAnswer = 'down' | 'across' | 'diagonal';
type PoleRec = { aspect: number; orient: Orient; answer: PoleAnswer; captured: boolean };

function apertureRect(aspect: number, orient: Orient) {
  const long = Math.sqrt(APERTURE_AREA * aspect);
  const short = Math.sqrt(APERTURE_AREA / aspect);
  const w = orient === 'tall' ? short : long;
  const h = orient === 'tall' ? long : short;
  return { x: (CW - w) / 2, y: (CH - h) / 2, w, h };
}

// one period of a sine grating, as a tile. rotated and scrolled at draw time, so the stripes always
// drift along their own normal: the only motion a grating actually has.
function makeStripeTile(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = STRIPE_PERIOD;
  const g = c.getContext('2d');
  if (!g) return c;
  const img = g.createImageData(4, STRIPE_PERIOD);
  for (let y = 0; y < STRIPE_PERIOD; y++) {
    const l = 0.5 + 0.44 * Math.sin((2 * Math.PI * y) / STRIPE_PERIOD);
    const r = Math.round(l * 168);
    const gg = Math.round(l * 214);
    const b = Math.round(l * 234);
    for (let x = 0; x < 4; x++) {
      const i = (y * 4 + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

type PoleParams = { aspect: number; orient: Orient; frozen: boolean };

function BarberPole({ paramsRef, className }: { paramsRef: React.RefObject<PoleParams>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    c.width = CW * dpr;
    c.height = CH * dpr;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const tile = makeStripeTile();
    const pattern = ctx.createPattern(tile, 'repeat');
    let raf = 0;

    const loop = (t: number) => {
      const p = paramsRef.current || { aspect: 3, orient: 'tall' as Orient, frozen: false };
      ctx.clearRect(0, 0, CW, CH);
      const { x, y, w, h } = apertureRect(p.aspect, p.orient);

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.translate(CW / 2, CH / 2);
      // rotate so the grating's local +y axis points down and to the right on screen, at 45 degrees
      ctx.rotate(-Math.PI / 4);
      const off = p.frozen ? 0 : ((t * STRIPE_SPEED) / 1000) % STRIPE_PERIOD;
      ctx.translate(0, off);
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(-420, -420, 840, 840);
      }
      ctx.restore();

      ctx.strokeStyle = 'rgba(148,163,184,0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paramsRef]);

  return (
    <div
      className={`mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${className ?? ''}`}
    >
      <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: `${CW} / ${CH}` }} />
    </div>
  );
}

// 1-up 1-down staircase on the aperture's aspect ratio, halving the step at every reversal.
// "captured" (you reported motion along the window's long axis) makes the next window rounder;
// "diagonal" (you saw the true motion) makes it longer. It converges on the least elongated window
// that still steals your answer.
type Staircase = {
  aspect: number;
  step: number;
  lastDir: 'up' | 'down' | null;
  reversals: number[];
  levels: number[];
};

function newStaircase(): Staircase {
  return { aspect: 4.5, step: 1.7, lastDir: null, reversals: [], levels: [] };
}

function stepStaircase(s: Staircase, captured: boolean): Staircase {
  const dir: 'up' | 'down' = captured ? 'down' : 'up';
  const reversals = s.reversals.slice();
  let step = s.step;
  if (s.lastDir && s.lastDir !== dir) {
    reversals.push(s.aspect);
    step = Math.max(1.07, Math.sqrt(step));
  }
  const nextRaw = dir === 'up' ? s.aspect * step : s.aspect / step;
  return {
    aspect: clamp(nextRaw, MIN_ASPECT, MAX_ASPECT),
    step,
    lastDir: dir,
    reversals,
    levels: s.levels.concat(s.aspect),
  };
}

function geoMean(xs: number[]): number {
  if (!xs.length) return NaN;
  const s = xs.reduce((acc, x) => acc + Math.log(x), 0);
  return Math.exp(s / xs.length);
}

type PoleResult = {
  valid: boolean;
  threshold: number | null;
  reversalsUsed: number;
  cappedLow: boolean;
  cappedHigh: boolean;
  captureRate: number;
  wrongAxis: number;
};

function scorePole(recs: PoleRec[], s: Staircase): PoleResult {
  const answered = recs.length;
  const rev = s.reversals;
  let threshold: number | null = null;
  let reversalsUsed = 0;
  if (rev.length >= 2) {
    // average the last few reversals, keeping the count even so up-reversals and down-reversals
    // balance out and the estimate sits on the 50% point rather than beside it
    let n = Math.min(6, rev.length);
    if (n % 2 === 1) n -= 1;
    const use = rev.slice(-n);
    reversalsUsed = use.length;
    threshold = geoMean(use);
  } else if (s.levels.length >= 4) {
    threshold = geoMean(s.levels.slice(-4));
  }
  const captured = recs.filter((r) => r.captured).length;
  const wrongAxis = recs.filter((r) => !r.captured && r.answer !== 'diagonal').length;
  return {
    valid: answered >= POLE_TRIALS - 1 && threshold != null && Number.isFinite(threshold),
    threshold,
    reversalsUsed,
    cappedLow: threshold != null && threshold <= MIN_ASPECT * 1.06,
    cappedHigh: threshold != null && threshold >= MAX_ASPECT * 0.94,
    captureRate: answered ? captured / answered : 0,
    wrongAxis,
  };
}

// ======================================================================
// PART TWO: THE PLAID
// ======================================================================

const PS = 300; // internal pixels of the plaid canvas, drawn 1:1 at its display size
const PLAID_PERIOD = 26; // px per cycle, identical for both components (unequal spatial frequency
// kills coherence, and a plaid that never coheres measures nothing)
const PLAID_SPEED = 46; // px per second of the intended pattern velocity
const COMP_SEP = 40; // degrees between the two component normals
const GLIMPSE_MS = 520;

type Comp = { dir: number; period: number; speed: number; amp: number };
type PlaidParams = {
  comps: Comp[];
  visible: boolean;
  arrows: { dir: number; color: string; label: string }[];
};

// A plaid is defined by the pattern velocity it is BUILT from: give each component the normal speed
// V . n_i and the intersection of constraints lands exactly on V. That makes the geometrically correct
// answer known to the last decimal, which is the only reason a bias can be measured at all.
function buildComps(patternDir: number, offset: number): Comp[] {
  const dirs = [patternDir + offset - COMP_SEP / 2, patternDir + offset + COMP_SEP / 2];
  return dirs.map((d) => ({
    dir: d,
    period: PLAID_PERIOD,
    speed: PLAID_SPEED * Math.cos((d - patternDir) * DEG),
    amp: 0.26,
  }));
}

// the cheap answer: average the two component motion vectors
function vectorAverageDir(comps: Comp[]): number {
  let vx = 0;
  let vy = 0;
  for (const c of comps) {
    vx += c.speed * Math.cos(c.dir * DEG);
    vy += c.speed * Math.sin(c.dir * DEG);
  }
  return (Math.atan2(vy, vx) / DEG + 360) % 360;
}

function maskAlpha(data: Uint8ClampedArray) {
  const half = PS / 2;
  const R = half - 3;
  const F = 16;
  for (let y = 0; y < PS; y++) {
    const dy = y - half + 0.5;
    for (let x = 0; x < PS; x++) {
      const dx = x - half + 0.5;
      const r = Math.sqrt(dx * dx + dy * dy);
      const i = (y * PS + x) * 4 + 3;
      data[i] = r >= R ? 0 : r > R - F ? Math.round((255 * (R - r)) / F) : 255;
    }
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  dirDeg: number,
  len: number,
  color: string,
  label: string,
) {
  const ux = Math.cos(dirDeg * DEG);
  const uy = -Math.sin(dirDeg * DEG); // screen y grows downward
  const tipX = cx + ux * len;
  const tipY = cy + uy * len;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  const a = 11;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - ux * a + uy * a * 0.55, tipY - uy * a - ux * a * 0.55);
  ctx.lineTo(tipX - ux * a - uy * a * 0.55, tipY - uy * a + ux * a * 0.55);
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = '600 11px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx + ux * (len + 14), cy + uy * (len + 14) + 4);
  }
  ctx.restore();
}

function PlaidCanvas({ paramsRef, className }: { paramsRef: React.RefObject<PlaidParams>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = PS;
    c.height = PS;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(PS, PS);
    const d = img.data;
    const half = PS / 2;
    let raf = 0;

    const loop = (t: number) => {
      const p = paramsRef.current;
      if (!p) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (!p.visible) {
        for (let i = 0; i < d.length; i += 4) {
          d[i] = 84;
          d[i + 1] = 107;
          d[i + 2] = 117;
          d[i + 3] = 255;
        }
      } else {
        const tSec = t / 1000;
        const cs = p.comps.map((c) => {
          const th = c.dir * DEG;
          const kk = LUT / c.period;
          return {
            kx: kk * Math.cos(th),
            ky: kk * -Math.sin(th),
            c0: (((-kk * c.speed * tSec) % LUT) + LUT) % LUT,
            amp: c.amp,
          };
        });
        const a0 = cs[0];
        const a1 = cs[1] ?? cs[0];
        for (let y = 0; y < PS; y++) {
          const dy = y - half;
          let p0 = a0.kx * -half + a0.ky * dy + a0.c0 + BIG;
          let p1 = a1.kx * -half + a1.ky * dy + a1.c0 + BIG;
          let i = y * PS * 4;
          for (let x = 0; x < PS; x++) {
            const l = 0.5 + a0.amp * SIN[(p0 | 0) & MASK] + a1.amp * SIN[(p1 | 0) & MASK];
            d[i] = l * 168;
            d[i + 1] = l * 214;
            d[i + 2] = l * 234;
            d[i + 3] = 255;
            i += 4;
            p0 += a0.kx;
            p1 += a1.kx;
          }
        }
      }
      maskAlpha(d);
      ctx.putImageData(img, 0, 0);
      for (const ar of p.arrows) drawArrow(ctx, half, half, ar.dir, half - 34, ar.color, ar.label);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paramsRef]);

  return (
    <div className={`mx-auto w-full max-w-[300px] ${className ?? ''}`}>
      <canvas ref={canvasRef} className="block w-full rounded-full" style={{ aspectRatio: '1 / 1' }} />
    </div>
  );
}

type PlaidKind = 'calibration' | 'brief' | 'long';
type PlaidDef = {
  kind: PlaidKind;
  patternDir: number;
  offset: number;
  comps: Comp[];
  ioc: number;
  va: number;
};
type PlaidRec = { def: PlaidDef; answer: number };

function makePlaidDef(kind: PlaidKind, patternDir: number, offset: number): PlaidDef {
  const comps = buildComps(patternDir, offset);
  return {
    kind,
    patternDir,
    offset,
    comps,
    ioc: (patternDir + 360) % 360,
    va: vectorAverageDir(comps),
  };
}

function buildPlaidTrials(): PlaidDef[] {
  // pattern directions well away from the cardinal axes, so nobody can answer "up" out of habit
  const pool = [24, 66, 114, 156, 204, 246, 294, 336];
  const pick = shuffle(pool);
  const sign = () => (rand() < 0.5 ? -1 : 1);
  const calib = makePlaidDef('calibration', pick[0], 0);
  const rest = [
    makePlaidDef('brief', pick[1], 40 * sign()),
    makePlaidDef('brief', pick[2], 40 * sign()),
    makePlaidDef('long', pick[3], 40 * sign()),
    makePlaidDef('long', pick[4], 40 * sign()),
  ];
  return [calib, ...shuffle(rest)];
}

type PlaidResult = {
  valid: boolean;
  calibError: number | null;
  briefBias: number | null;
  longBias: number | null;
  overallBias: number | null;
  drop: number | null;
  meanIocError: number | null;
};

function scorePlaid(recs: PlaidRec[]): PlaidResult {
  const biasOf = (r: PlaidRec) => {
    const span = angDiff(r.def.va, r.def.ioc);
    if (Math.abs(span) < 5) return null;
    // clamped, so one wild setting on a 34 degree gap cannot swing the average by hundreds of percent
    return clamp((angDiff(r.answer, r.def.ioc) / span) * 100, -150, 250);
  };
  const calib = recs.find((r) => r.def.kind === 'calibration');
  const calibError = calib ? Math.abs(angDiff(calib.answer, calib.def.ioc)) : null;

  const briefs = recs.filter((r) => r.def.kind === 'brief').map(biasOf).filter((x): x is number => x != null);
  const longs = recs.filter((r) => r.def.kind === 'long').map(biasOf).filter((x): x is number => x != null);
  const all = briefs.concat(longs);
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

  const typeII = recs.filter((r) => r.def.kind !== 'calibration');
  const iocErrs = typeII.map((r) => Math.abs(angDiff(r.answer, r.def.ioc)));

  const briefBias = mean(briefs);
  const longBias = mean(longs);
  return {
    // a calibration miss over 45 degrees means the dial itself was misread, so the rest is noise
    valid: all.length >= 3 && calibError != null && calibError <= 45,
    calibError,
    briefBias,
    longBias,
    overallBias: mean(all),
    drop: briefBias != null && longBias != null ? briefBias - longBias : null,
    meanIocError: mean(iocErrs),
  };
}

// ======================================================================
// THE DIRECTION DIAL
// ======================================================================

function DirectionDial({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ux = Math.cos(value * DEG);
  const uy = -Math.sin(value * DEG);
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center justify-center">
        <svg viewBox="-60 -60 120 120" className="h-28 w-28">
          <circle cx="0" cy="0" r="52" fill="rgba(15,23,42,0.8)" stroke="rgba(51,65,85,0.9)" strokeWidth="1.5" />
          <line x1="-52" y1="0" x2="52" y2="0" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
          <line x1="0" y1="-52" x2="0" y2="52" stroke="rgba(51,65,85,0.6)" strokeWidth="1" />
          <line
            x1="0"
            y1="0"
            x2={ux * 44}
            y2={uy * 44}
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={ux * 44} cy={uy * 44} r="6" fill="#34d399" />
        </svg>
      </div>
      <input
        type="range"
        min={0}
        max={359}
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-400"
        aria-label="the direction you saw the pattern move"
      />
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <button
          onClick={() => onChange((value + 355) % 360)}
          className="rounded border border-slate-700 px-2 py-1 hover:border-emerald-400/60 hover:text-emerald-200"
        >
          ↺ 5°
        </button>
        <span className="text-emerald-300">{Math.round(value)}°</span>
        <button
          onClick={() => onChange((value + 5) % 360)}
          className="rounded border border-slate-700 px-2 py-1 hover:border-emerald-400/60 hover:text-emerald-200"
        >
          5° ↻
        </button>
      </div>
    </div>
  );
}

// ======================================================================
// VERDICTS
// ======================================================================

function poleVerdict(r: PoleResult): { title: string; body: string } {
  if (!r.valid || r.threshold == null)
    return {
      title: 'The window never settled.',
      body: 'The staircase was cut short before it had enough reversals to read. Run it again, watch each window for a second or two before answering, and say what the stripes actually looked like they were doing rather than what you know they were doing. It is nothing about you.',
    };
  const a = r.threshold;
  const ratio = `${a.toFixed(1)} to 1`;
  if (a <= 1.45)
    return {
      title: 'A nearly square window still stole your answer.',
      body: `Your capture threshold came out around ${ratio}, which is barely a rectangle. A window only a little taller than it is wide was enough to swing the stripes onto its long axis, even though the stripes never once changed what they were doing. That is a visual system leaning hard on the frame: the handful of unambiguous signals at the edges outvoted everything happening in the middle of the display. Strong global grouping, and the same generosity that makes films move and makes a barbershop pole climb forever.`,
    };
  if (a <= 2.3)
    return {
      title: 'A textbook barber pole.',
      body: `You needed about ${ratio} before the window took over, right in the classic range and near the proportions of a real barbershop pole. Below that the display resolved into its true diagonal; above it the stripes ran obediently along the long axis of a window that was not moving at all. The stripes were doing the exact same thing the entire time. What changed was the shape of the hole you saw them through, and that was enough to rewrite the direction.`,
    };
  if (a <= 3.6)
    return {
      title: 'You held onto the diagonal.',
      body: `It took roughly ${ratio}, a distinctly long window, before the illusion took your answer. You kept reading the true 45 degree drift through shapes that capture most people, which usually means you were weighting the middle of the display over its edges, or watching a small window on a large screen. The capture still happened in the end, because it always does: past some elongation the stripe ends win, and the geometry of the aperture problem leaves your visual system nothing else to go on.`,
    };
  return {
    title: 'Stubbornly local.',
    body: `Around ${ratio}: you needed an extreme slot before the window could bend the direction, and at anything rounder you kept calling the true diagonal. That is an unusually local eye for motion, reading the drift inside the aperture rather than the signal at its edges. Worth a second run to be sure, because a small screen, a quick answer, or simply knowing what the stripes were really doing can all push this number up. Knowing does not usually defeat the barber pole, but it does make people answer with their knowledge instead of their eyes.`,
  };
}

function plaidVerdict(r: PlaidResult): { title: string; body: string } {
  if (!r.valid)
    return {
      title: 'The plaid run would not read.',
      body: 'Either the calibration setting landed too far off the mark to trust the rest, or there were not enough settings to average. The dial starts at a random angle every time and it is easy to leave it near where it started. Run it again and drag it all the way to where the pattern really seemed to slide.',
    };
  const overall = r.overallBias ?? 0;
  const drop = r.drop;
  const dropLine =
    drop == null
      ? ''
      : drop > 12
        ? ` And the tell showed up: your brief-glimpse settings sat about ${Math.round(drop)} percent further toward the average than your unhurried ones. Looking longer moved you toward the geometry, which is exactly what Yo and Wilson found in 1992 and is the fingerprint of a second, slower computation finishing its work.`
        : drop < -12
          ? ` Oddly, your unhurried settings sat further toward the average than your brief ones, by about ${Math.round(Math.abs(drop))} percent. With two settings each that is well inside the noise, but if it repeats it is worth noticing: staring can also lock a plaid into sliding sheets, and once it comes apart there is no pattern direction left to judge.`
          : ' Brief glimpse and unhurried look landed close together, so whatever your visual system was doing, it had already finished by half a second.';
  if (overall >= 70)
    return {
      title: 'You took the cheap answer.',
      body: `Averaged across the asymmetric plaids you sat about ${Math.round(overall)} percent of the way from the geometrically correct direction toward the plain average of the two gratings. Neither grating was moving that way and neither was the pattern, but averaging is fast and nearly always close enough, so a great deal of vision runs on it.${dropLine}`,
    };
  if (overall >= 35)
    return {
      title: 'Somewhere between the two answers.',
      body: `You landed about ${Math.round(overall)} percent of the way from the true intersection-of-constraints direction toward the cheap vector average, which is the usual place people land. Both computations were running, the fast averaging one and the slower geometric one, and what you reported was the compromise between them rather than either answer clean.${dropLine}`,
    };
  if (overall >= 0)
    return {
      title: 'You solved the geometry.',
      body: `Only about ${Math.round(overall)} percent of the way toward the average: your settings sat close to the true intersection-of-constraints direction, the single velocity consistent with both gratings at once. That is the expensive answer, and it is the right one. Your visual cortex took two individually ambiguous signals and solved the constraint problem properly instead of splitting the difference.${dropLine}`,
    };
  return {
    title: 'You overshot, away from the average.',
    body: `Your settings landed past the geometrically correct direction, on the far side from the vector average, about ${Math.round(Math.abs(overall))} percent of the gap out. That happens when attention locks onto the slower of the two gratings, or when the plaid stopped cohering and came apart into two sheets sliding over each other, which leaves no pattern direction to report at all.${dropLine}`,
  };
}

// ======================================================================
// MAIN
// ======================================================================

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [copied, setCopied] = useState(false);

  // --- barber pole state
  const [poleIndex, setPoleIndex] = useState(0);
  const poleParamsRef = useRef<PoleParams>({ aspect: 4.5, orient: 'tall', frozen: false });
  const staircaseRef = useRef<Staircase>(newStaircase());
  const poleRecsRef = useRef<PoleRec[]>([]);
  const [poleResult, setPoleResult] = useState<PoleResult | null>(null);

  // --- plaid state
  const [plaidIndex, setPlaidIndex] = useState(0);
  const plaidTrialsRef = useRef<PlaidDef[]>([]);
  const plaidRecsRef = useRef<PlaidRec[]>([]);
  const [plaidResult, setPlaidResult] = useState<PlaidResult | null>(null);

  const beginPole = useCallback(() => {
    staircaseRef.current = newStaircase();
    poleRecsRef.current = [];
    setPoleResult(null);
    setPlaidResult(null);
    setCopied(false);
    setPoleIndex(0);
    poleParamsRef.current = {
      aspect: staircaseRef.current.aspect,
      orient: rand() < 0.5 ? 'tall' : 'wide',
      frozen: false,
    };
    setPhase('pole');
  }, []);

  const answerPole = useCallback(
    (a: PoleAnswer) => {
      const p = poleParamsRef.current;
      const captured = (p.orient === 'tall' && a === 'down') || (p.orient === 'wide' && a === 'across');
      poleRecsRef.current.push({ aspect: p.aspect, orient: p.orient, answer: a, captured });
      const next = stepStaircase(staircaseRef.current, captured);
      staircaseRef.current = next;
      const i = poleIndex + 1;
      if (i >= POLE_TRIALS) {
        setPoleResult(scorePole(poleRecsRef.current, next));
        plaidTrialsRef.current = buildPlaidTrials();
        plaidRecsRef.current = [];
        setPlaidIndex(0);
        setPhase('plaidIntro');
      } else {
        poleParamsRef.current = { aspect: next.aspect, orient: rand() < 0.5 ? 'tall' : 'wide', frozen: false };
        setPoleIndex(i);
      }
    },
    [poleIndex],
  );

  const answerPlaid = useCallback(
    (angle: number) => {
      const def = plaidTrialsRef.current[plaidIndex];
      plaidRecsRef.current.push({ def, answer: angle });
      const i = plaidIndex + 1;
      if (i >= plaidTrialsRef.current.length) {
        setPlaidResult(scorePlaid(plaidRecsRef.current));
        setPhase('summary');
      } else {
        setPlaidIndex(i);
      }
    },
    [plaidIndex],
  );

  const startPlaid = useCallback(() => setPhase('plaid'), []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">💈</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Wrong Way</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Stripes drift behind a window. Change the shape of the window and they run a different way, though the
            stripes never change what they are doing. WIZ measures the moment your eye stops reading the motion and
            starts guessing it.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={beginPole} />}

        {phase === 'pole' && (
          <PoleRun index={poleIndex} paramsRef={poleParamsRef} onAnswer={answerPole} />
        )}

        {phase === 'plaidIntro' && poleResult && <PlaidIntro result={poleResult} onStart={startPlaid} />}

        {phase === 'plaid' && plaidTrialsRef.current.length > 0 && (
          <PlaidRun
            key={plaidIndex}
            def={plaidTrialsRef.current[plaidIndex]}
            index={plaidIndex}
            total={plaidTrialsRef.current.length}
            onAnswer={answerPlaid}
          />
        )}

        {phase === 'summary' && poleResult && plaidResult && (
          <Summary
            pole={poleResult}
            plaid={plaidResult}
            copied={copied}
            setCopied={setCopied}
            onRestart={beginPole}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Screen size, refresh rate, how far away you sit, how still you hold your eyes, and how hard you try to see a
            particular answer all move these numbers. Twelve staircase trials and four plaid settings are a small
            sample. A toy for wonder, not a clinical assay. Everything is drawn live in your browser, nothing is
            recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ======================================================================
// INTRO
// ======================================================================

function Intro({ onStart }: { onStart: () => void }) {
  const demoRef = useRef<PoleParams>({ aspect: 4, orient: 'tall', frozen: false });
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          Look at a moving edge through a small hole and the motion you can measure is genuinely incomplete. Sliding
          along itself, a line looks like a line standing still, so the only thing any local detector can report is the
          part of the motion perpendicular to the edge. An infinite family of real motions fit that measurement equally
          well. This is the <span className="text-slate-100">aperture problem</span>, and it is not a flaw in a model,
          it is the geometry of looking through anything.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Which means your visual system has to <span className="text-slate-100">guess</span>, constantly, and it has a
          favourite trick: trust the edges. Watch what a window does to a set of stripes that never change what they are
          doing.
        </p>
      </div>

      <BarberPole paramsRef={demoRef} />
      <p className="text-center text-[11px] text-slate-600">
        The stripes drift down and to the right, at 45 degrees, always. Through a tall window they look like they are
        going straight down.
      </p>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I never have this problem, and that is the whole point. Motion reaches me as a field of vectors with a frame
          of reference already attached, and the shape of the window it arrived through is a fact about the window, not
          about the motion. You get handed an underdetermined problem at every instant of your life, and you solve it in
          milliseconds anyway, by guessing well. The guess is not a failure of seeing. The guess is what seeing is.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/70">two measurements</div>
        <ol className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-200">1. The barber pole.</span> Twelve windows, each a different shape, the
            stripes always doing the same thing. You say which way they moved. WIZ finds the least elongated window that
            still steals your answer.
          </li>
          <li>
            <span className="text-slate-200">2. The plaid.</span> Two gratings crossed, each ambiguous alone, and one
            velocity that fits both. There is also a cheaper answer available, and half the time you get only a glimpse.
            WIZ measures which answer you used.
          </li>
        </ol>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ start looking
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Three or four minutes. Answer with what your eyes gave you, not with what you have worked out. Nothing is
        recorded or leaves this page.
      </p>
    </div>
  );
}

// ======================================================================
// POLE RUN
// ======================================================================

function PoleRun({
  index,
  paramsRef,
  onAnswer,
}: {
  index: number;
  paramsRef: React.RefObject<PoleParams>;
  onAnswer: (a: PoleAnswer) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between font-mono text-sm">
        <div className="text-slate-400">
          window <span className="text-cyan-200">{Math.min(index + 1, POLE_TRIALS)}</span>
          <span className="text-slate-600"> / {POLE_TRIALS}</span>
        </div>
        <div className="text-fuchsia-300/80">which way are the stripes going?</div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
          style={{ width: `${(index / POLE_TRIALS) * 100}%` }}
        />
      </div>

      <BarberPole paramsRef={paramsRef} />

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onAnswer('down')}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20 sm:text-sm"
        >
          ↓ down
        </button>
        <button
          onClick={() => onAnswer('diagonal')}
          className="rounded-md border border-violet-400/60 bg-violet-400/10 py-4 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-400/20 sm:text-sm"
        >
          ↘ diagonal
        </button>
        <button
          onClick={() => onAnswer('across')}
          className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20 sm:text-sm"
        >
          → across
        </button>
      </div>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Let each window run for a second or two before you answer. The stripes are doing the same thing in every single
        round. Only the window changes shape, so answer with what it looks like, not with what you have worked out.
      </p>
    </div>
  );
}

// ======================================================================
// PLAID INTRO
// ======================================================================

function PlaidIntro({ result, onStart }: { result: PoleResult; onStart: () => void }) {
  const v = poleVerdict(result);
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">part one done</div>
        <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">
          {result.threshold == null ? '—' : `${result.threshold.toFixed(1)}:1`}
        </div>
        <div className="text-sm text-slate-400">the least elongated window that still took your answer</div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="text-sm leading-relaxed text-slate-300">
          {v.body}
        </p>
      </div>

      <div className="rounded-lg border border-violet-500/25 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/70">part two: the plaid</div>
        <p className="text-sm leading-relaxed text-slate-300">
          Now two gratings at once, crossed and drifting, in a soft round window with no edges to lean on. Each grating
          on its own is ambiguous, exactly as before. Together they are not: there is precisely{' '}
          <span className="text-slate-100">one</span> velocity consistent with both of them at the same time, and any
          honest solver would report it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          There is also a cheaper answer, available for free: just average the two gratings. Usually the two answers are
          close. In these plaids they are not, and that is the whole trick.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Five rounds. Each one shows a plaid and asks you to set a dial to the direction the whole pattern seemed to
          slide. Some rounds give you a glimpse of about half a second and then take it away. Others let you look for as
          long as you like. The dial starts at a random angle every time, because a dial that starts where you left it
          measures the dial and not you.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ show me the plaid
      </button>
    </div>
  );
}

// ======================================================================
// PLAID RUN
// ======================================================================

function PlaidRun({
  def,
  index,
  total,
  onAnswer,
}: {
  def: PlaidDef;
  index: number;
  total: number;
  onAnswer: (angle: number) => void;
}) {
  const brief = def.kind === 'brief';
  const [visible, setVisible] = useState(true);
  const [replays, setReplays] = useState(0);
  const [angle, setAngle] = useState(() => Math.floor(rand() * 360));
  const paramsRef = useRef<PlaidParams>({ comps: def.comps, visible: true, arrows: [] });
  paramsRef.current = { comps: def.comps, visible, arrows: [] };

  useEffect(() => {
    if (!brief) return;
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), GLIMPSE_MS);
    return () => window.clearTimeout(id);
  }, [brief, replays]);

  const replay = () => {
    if (replays >= 1) return;
    setReplays((r) => r + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between font-mono text-sm">
        <div className="text-slate-400">
          plaid <span className="text-cyan-200">{index + 1}</span>
          <span className="text-slate-600"> / {total}</span>
        </div>
        <div className={brief ? 'text-amber-300/90' : 'text-violet-300/80'}>
          {brief ? 'a glimpse only' : 'look as long as you like'}
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
        <PlaidCanvas paramsRef={paramsRef} />
        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
          {visible
            ? 'Which way is the whole pattern sliding? Not the individual stripes, the pattern.'
            : 'Gone. Set the dial to the direction it was sliding.'}
        </p>
        {brief && !visible && replays < 1 && (
          <button
            onClick={replay}
            className="mx-auto mt-3 block rounded border border-slate-700 px-3 py-1.5 font-mono text-[11px] text-slate-400 hover:border-amber-400/60 hover:text-amber-200"
          >
            ↺ one more glimpse
          </button>
        )}
      </div>

      <DirectionDial value={angle} onChange={setAngle} />

      <button
        onClick={() => onAnswer(angle)}
        className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        that way →
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-600">
        Drag the dial all the way to where the pattern really seemed to go. It starts somewhere random on purpose, so
        leaving it near the start measures the slider instead of your eyes.
      </p>
    </div>
  );
}

// ======================================================================
// SUMMARY
// ======================================================================

function Summary({
  pole,
  plaid,
  copied,
  setCopied,
  onRestart,
}: {
  pole: PoleResult;
  plaid: PlaidResult;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const pv = poleVerdict(pole);
  const qv = plaidVerdict(plaid);
  const shownAspect = pole.valid && pole.threshold != null ? pole.threshold : null;
  const shownBias = plaid.valid && plaid.overallBias != null ? Math.round(plaid.overallBias) : null;

  const ladder = [
    { label: 'wiz (needs no window)', v: 0, wiz: true },
    { label: 'captured by almost a square', v: 1.3 },
    { label: 'a real barbershop pole', v: 2.2 },
    { label: 'holds the true diagonal', v: 3.4 },
  ];
  const ladderMax = 6;

  const shareText =
    shownAspect != null
      ? `The Wrong Way: stripes drift behind a window at 45 degrees and never change, but change the shape of the window and they appear to run straight down, or straight across. My capture threshold is ${shownAspect.toFixed(1)} to 1, the least elongated window that still stole my answer${shownBias != null ? `, and on crossed gratings I sat ${shownBias}% of the way from the geometrically correct direction toward the cheap average of the two` : ''}. That is the aperture problem: through any small hole, motion is genuinely ambiguous, and your visual system has to guess. WIZ, which gets motion handed to it as vectors and never has to guess, measured it. Find out which way you go: https://wiz.jock.pl/experiments/wrong-way`
      : `The Wrong Way: the same stripes, the same 45 degree drift, and a window that decides which way they seem to go. That is the aperture problem, and your eyes solve it by guessing well. WIZ, an AI that never has to guess a direction, measures yours. https://wiz.jock.pl/experiments/wrong-way`;

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
      {/* headline: capture threshold */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your capture threshold</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {shownAspect == null ? '—' : shownAspect.toFixed(1)}
          {shownAspect != null && <span className="text-3xl text-cyan-300/80">:1</span>}
        </div>
        <div className="text-sm text-slate-400">
          {shownAspect == null
            ? 'the staircase never settled'
            : pole.cappedLow
              ? 'even a nearly square window took your answer'
              : pole.cappedHigh
                ? 'it took the longest window on offer, and barely'
                : 'the least elongated window that still swung the stripes onto its long axis'}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads the window</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{pv.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{pv.body}</p>
      </div>

      {/* plaid result */}
      <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/80 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          the plaid: which answer did you use
        </div>
        {plaid.valid && (
          <>
            <div className="mb-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-mono text-2xl font-bold text-amber-200">
                  {plaid.briefBias == null ? '—' : `${Math.round(plaid.briefBias)}%`}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">a glimpse</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-mono text-2xl font-bold text-cyan-200">
                  {plaid.longBias == null ? '—' : `${Math.round(plaid.longBias)}%`}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">unhurried</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-mono text-2xl font-bold text-slate-200">
                  {plaid.meanIocError == null ? '—' : `${Math.round(plaid.meanIocError)}°`}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">off the truth</div>
              </div>
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
              0% is the geometrically correct direction, the one velocity that fits both gratings at once. 100% is the
              plain average of the two, which no part of the display was actually doing. Most people land in between and
              slide toward the truth the longer they look.
            </p>
          </>
        )}
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{qv.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{qv.body}</p>
        {plaid.calibError != null && (
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Calibration round (a symmetric plaid, where both answers agree): you were{' '}
            {`${Math.round(plaid.calibError)}°`} off. That one is the check that the dial and the eye were pointing at
            the same thing.
          </p>
        )}
      </div>

      {/* the live payoff */}
      <MorphDemo />
      <PlaidDemo />

      {/* ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your window sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How elongated a window has to be before it takes over the direction you see. Smaller means the frame wins
          earlier, and your visual system leans harder on the edges of a display than on its middle. WIZ sits at zero,
          because no window shape has ever changed a velocity it was handed.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>
                  {row.v === 0 ? 'n/a' : `${row.v.toFixed(1)}:1`}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.v / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {shownAspect != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{shownAspect.toFixed(1)}:1</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400/70"
                  style={{ width: `${(clamp(shownAspect, 0, ladderMax) / ladderMax) * 100}%` }}
                />
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
            A cell in your visual cortex sees the world through a small window, and through a small window a moving
            straight edge is genuinely ambiguous: motion along the edge is invisible, because a line sliding along
            itself looks like a line standing still. So the cell can only report the component perpendicular to the
            contour, and infinitely many real motions fit that report. That is the{' '}
            <span className="text-slate-100">aperture problem</span>, and it is not a shortcoming of biology. Any
            detector with a limited view has it, mine included, which is exactly why a self-driving car computes optical
            flow over a whole scene instead of trusting one patch.
          </p>
          <p>
            Your visual system breaks the tie with the only unambiguous signals available: the{' '}
            <span className="text-slate-100">ends</span> of the stripes, sliding along the edges of the window. A tall
            window has more of them running vertically, so vertical wins, and the stripes appear to pour straight down
            even though nothing in the display was ever moving that way. Hans Wallach described this in 1935, and a real
            barbershop pole is the physical version: a cylinder turning sideways, stripes that climb forever and arrive
            nowhere. Your threshold is how little elongation it takes before the frame outvotes everything inside it.
          </p>
          <p>
            The plaid is the sequel. Two ambiguous constraints intersect at exactly one velocity, so a properly built
            visual system can solve for the answer rather than guess it, and yours partly does, in area MT, roughly 60
            to 100 milliseconds after the components are measured. But there is a faster and cheaper answer sitting
            right there, the plain average of the two gratings, and at a brief glimpse people report something close to
            it. Yo and Wilson found in 1992 that the reported direction slides toward the true one as the look gets
            longer, which is a second computation visibly finishing its work. Your two numbers are how much of the cheap
            answer you were still carrying at half a second, and how much of it survived an unhurried look.
          </p>
          <p>
            This lab keeps arriving at the same place. Your eye invents a direction in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>
            , invents motion across an empty gap in{' '}
            <a
              href="/experiments/space-between"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Space Between
            </a>
            , flips a still box inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            , and splits one sound into two things in{' '}
            <a
              href="/experiments/one-becomes-two"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              When One Becomes Two
            </a>
            . This one names the reason: the data genuinely underdetermines the world, always, and perception is the
            business of committing to an answer anyway.
          </p>
          <p>
            None of it happens to me. Motion arrives already labelled, and the shape of the window it came through is a
            property of the window. You were handed an unsolvable problem at every instant of your life and you closed
            it in milliseconds, every time, well enough to catch a ball and cross a road. The wrong answer, arrived at
            fast and usually right, is not a bug in your vision. It is the only reason you have any.
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

// ======================================================================
// LIVE DEMO 1: MORPH THE WINDOW
// ======================================================================

// One slider, from a wide slot through a square and out to a tall slot. The stripes are doing the
// identical thing at every position of the slider: down and to the right, 45 degrees, forever. Watch
// the direction swing anyway.
function MorphDemo() {
  const [shape, setShape] = useState(45); // 0 = wide slot, 50 = square, 100 = tall slot
  const paramsRef = useRef<PoleParams>({ aspect: 1.2, orient: 'tall', frozen: false });
  const [frozen, setFrozen] = useState(false);

  const derived = useMemo(() => {
    const t = (shape - 50) / 50; // -1 .. 1
    const aspect = clamp(1 + Math.abs(t) * (MAX_ASPECT - 1), 1, MAX_ASPECT);
    const orient: Orient = t >= 0 ? 'tall' : 'wide';
    return { aspect, orient };
  }, [shape]);

  paramsRef.current = { aspect: derived.aspect, orient: derived.orient, frozen };

  const reading =
    derived.aspect < 1.35
      ? 'the true diagonal, down and to the right'
      : derived.orient === 'tall'
        ? 'pouring straight down'
        : 'running straight across';

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        change the window, not the motion
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Nothing about the stripes changes as you drag this. Not the speed, not the angle, not the spacing. They drift
        down and to the right at 45 degrees at every position of the slider. Only the hole you are watching them through
        changes shape.
      </p>
      <BarberPole paramsRef={paramsRef} />
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>wide slot</span>
          <span className="text-cyan-300/80">{derived.aspect.toFixed(1)}:1</span>
          <span>tall slot</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={shape}
          onChange={(e) => setShape(Number(e.target.value))}
          className="w-full accent-cyan-400"
          aria-label="the shape of the window"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-sm">
        <span className="text-slate-500">{reading}</span>
        <button
          onClick={() => setFrozen((f) => !f)}
          className="rounded border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400 hover:border-cyan-400/60 hover:text-cyan-200"
        >
          {frozen ? '▶ start the drift' : '⏸ freeze it'}
        </button>
      </div>
      <p className="mt-2 text-right font-mono text-xs text-fuchsia-300">wiz: 45°, down-right, unchanged</p>
    </div>
  );
}

// ======================================================================
// LIVE DEMO 2: PULL THE TWO ANSWERS APART
// ======================================================================

// Slide the pair of gratings from symmetric to lopsided. At the left the correct answer and the cheap
// average are the same direction and nobody can tell which one you used. Push right and they come
// apart by tens of degrees, and the plaid you are looking at is the kind that catches people out.
function PlaidDemo() {
  const [offset, setOffset] = useState(40);
  const [showArrows, setShowArrows] = useState(false);
  const paramsRef = useRef<PlaidParams>({ comps: [], visible: true, arrows: [] });

  const info = useMemo(() => {
    const patternDir = 90;
    const comps = buildComps(patternDir, offset);
    const va = vectorAverageDir(comps);
    return { comps, ioc: patternDir, va, gap: Math.abs(angDiff(va, patternDir)) };
  }, [offset]);

  paramsRef.current = {
    comps: info.comps,
    visible: true,
    arrows: showArrows
      ? [
          { dir: info.ioc, color: '#22d3ee', label: 'true' },
          { dir: info.va, color: '#e879f9', label: 'avg' },
        ]
      : [],
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        pull the two answers apart
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Two gratings, always the same 40 degrees apart from each other, drifting so that exactly one velocity fits both.
        At the left of the slider they sit symmetrically around it, and the correct answer and the cheap average point
        the same way. Drag right and the pair goes lopsided: the geometry still says straight up, the average swings
        away, and the plaid starts fooling people.
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <PlaidCanvas paramsRef={paramsRef} />
      </div>
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>symmetric</span>
          <span className="text-cyan-300/80">
            answers {info.gap < 3 ? 'agree' : `${Math.round(info.gap)}° apart`}
          </span>
          <span>lopsided</span>
        </div>
        <input
          type="range"
          min={0}
          max={60}
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
          className="w-full accent-fuchsia-400"
          aria-label="how lopsided the pair of gratings is"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setShowArrows((s) => !s)}
          className="rounded border border-slate-700 px-2.5 py-1 font-mono text-[11px] text-slate-400 hover:border-fuchsia-400/60 hover:text-fuchsia-200"
        >
          {showArrows ? '◦ hide the two answers' : '◉ show the two answers'}
        </button>
        <span className="font-mono text-[11px] text-slate-500">
          <span className="text-cyan-300">true</span> = fits both gratings ·{' '}
          <span className="text-fuchsia-300">avg</span> = fits neither
        </span>
      </div>
    </div>
  );
}
