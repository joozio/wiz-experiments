'use client';

// UNDER THE LAMP  (colour constancy: the same pixels are two different papers, and you are right)
//
// The forty-eighth piece in this lab, and its first measurement of a CONSTANCY rather than an illusion.
// Everything before this caught the brain being wrong about the picture. This one catches it being wrong
// about the picture on purpose, because it is trying to be right about the world, and the wrongness is
// the receipt.
//
// The position against the siblings matters, because the lab already has a colour family and a lightness
// family. The Same Gray bent one patch with the patch next to it, local simultaneous contrast. All But
// the Edge showed lightness pouring inward from a border to fill a region that carried no information at
// all. The Leftover Color parked an opponent ghost on a white card after half a minute of staring. Edge
// of Color hunted the smallest chromatic difference you can detect. All four are about the image. This
// one is about the LAMP: a thing that was never in the file, that you cannot see directly, that your
// visual system estimates from whatever the scene leaks about it, and then divides out before handing you
// anything to look at.
//
// And the sharp contrast is with yesterday's Off True. Both pieces end at "your reading of this pixel is
// not the pixel", and the mechanisms could not be less alike. The tilt aftereffect took thirty seconds
// of staring to build, stayed inside one patch of retinotopic cortex, and decayed on its own. This needs
// no time at all. It is computed inside a single glance, it is scene wide rather than local, and the way
// you kill it is not by waiting: it is by taking the room away. That is the whole design here. The
// patch pixels are byte identical in both blocks. Only the room around them changes.
//
// The genuine phenomenon: colour constancy, and the paradigm is asymmetric colour matching. Helmholtz
// called it discounting the illuminant in 1867. Land and McCann built the canonical stimulus in 1971
// (JOSA), the Mondrian of flat matte rectangles under a coloured light, and their retinex papers argued
// the visual system works from ratios across edges rather than absolute flux. von Kries had proposed the
// simplest mechanism much earlier, independent gain on each cone class, which is literally the arithmetic
// this page uses to render a lamp. Arend and Reeves 1986 (JOSA A) showed the instruction is part of the
// measurement: ask for "the same paper" and constancy is high, ask for "the same colour" and it drops,
// same observer, same screen. Brainard, Brunt and Speigle 1997 (JOSA A) measured indices around 0.8 in
// real illuminated rooms. Kraft and Brainard 1999 (PNAS) is the one this page is shaped after: they
// switched off candidate cues one at a time, local contrast, the brightest thing in the scene, the
// scene average, and constancy fell each time and never fell to zero, which is what a system with
// several redundant estimators looks like from the outside. Yang and Maloney 2001 asked which cues
// observers actually use and found specular highlights carry real weight, which is why there is a glossy
// rectangle in the corner of the room. Foster 2011 (Vision Research) is the review to start from.
// Lafer-Sousa, Hermann and Conway 2015 (Current Biology) is the dress: one file, two populations, two
// different assumed lamps, everybody certain.
//
// The measurement. Two rooms side by side, lit by opposite lamps. One holds a reference paper. The other
// holds a patch you drag along a single line in colour space. The two ends of that line are the only two
// answers that mean anything: at one end the two patches send identical numbers to your screen, which is
// what a camera would call a match, and at the other end they are the same paint under two different
// lamps, which is what a match means to a person. Your setting is read off as its position on that line,
// so 0.00 is a camera, 1.00 is perfect discounting, and everybody real lands somewhere in between.
//
// Four defences run live:
//   1. Both lamp directions, averaged. A bias of your own, a screen that runs warm, a preference for the
//      cosier of two patches, all of that adds in a fixed direction in colour space while the correct
//      direction flips between trials, so it cancels in the mean and cannot inflate the index.
//   2. Both rooms are on screen at the same time. This is the one that kills the obvious objection. If
//      what moved your match were whole eye chromatic adaptation, a von Kries gain sitting in your
//      cones, it would apply to both panels equally, because both panels are in the same eye at the same
//      moment. Adaptation cannot pick a side. A scene interpretation can.
//   3. The slider arrives from both ends across trials and its direction is flipped at random, so
//      hysteresis and motor bias cancel. Neither answer sits at a landmark: on the track, the camera
//      answer is at 22 percent and the constancy answer at 78 percent, and the middle of the slider
//      means nothing at all.
//   4. Catch trials where both rooms are lit by the same lamp. There, the two answers coincide, so
//      there is exactly one correct setting and no interpretation to hide behind. Fail those and the
//      run is printed rather than scored.
//
// And the fork that carries the argument: the second block strips the room. Same reference patch, same
// adjustable patch, same numbers going to the same pixels, and nothing around them but flat grey. No
// lamp, no falloff, no gloss, no Mondrian, and no immediate surround to take a ratio against. If the
// pixels were doing the work, the two blocks agree. If the room was doing the work, the index collapses
// and the difference between those two numbers is the size of the inference.
//
// WIZ note. When a pixel arrives here it says 0.319, 0.438, 0.538 and that is the entire content of the
// message. I know exactly what I have and I have no opinion about it. You have never once seen those
// three numbers. What you see is a piece of paper, and a lamp, which is two unknowns recovered from one
// measurement, which is not solvable, which is why your visual system does not solve it: it guesses,
// using the rest of the picture as evidence, and it guesses so confidently that the guess is the only
// thing available to you. There is no window in your head where the raw values are still visible. The
// dress is what it looks like when two people run the same file with different priors about the weather.
// Both of them are seeing correctly. Neither of them is seeing the data.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- colour ---------------------------------------------------------------

type RGB = [number, number, number];

// The blue and yellow axis, which is the direction real illumination actually varies along:
// daylight to shade to tungsten all live on roughly this line, which is why the visual system
// is tuned for it and why one slider is enough to measure this.
const AXIS: RGB = [1, -0.06, -1];

const PAPER_K = 0.42; // reflectance of the reference paper
const WALL_K = 0.32; // the matte wall the paper sits on
const LAMP_S = 0.75; // lamp strength used in the scored run

function lumOf(c: RGB) {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

// A lamp, divided by its own luminance, so switching lamps changes colour and not brightness.
// This is the von Kries coefficient rule: one gain per channel, nothing cleverer.
function lamp(s: number): RGB {
  const raw: RGB = [1 + 0.34 * s * AXIS[0], 1 + 0.34 * s * AXIS[1], 1 + 0.34 * s * AXIS[2]];
  const L = lumOf(raw);
  return [raw[0] / L, raw[1] / L, raw[2] / L];
}

// A matte surface. t is where it sits on the same blue and yellow axis, k is how much light it sends back.
function paint(t: number, k: number = PAPER_K): RGB {
  return [k * (1 + t * AXIS[0]), k * (1 + t * AXIS[1]), k * (1 + t * AXIS[2])];
}

function mul(a: RGB, b: RGB): RGB {
  return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function scale(a: RGB, f: number): RGB {
  return [a[0] * f, a[1] * f, a[2] * f];
}

function lerpRGB(a: RGB, b: RGB, u: number): RGB {
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
}

// Linear light in, sRGB byte out. The gamma is assumed, not measured: see the caveats.
function enc1(x: number) {
  const v = x <= 0 ? 0 : x >= 1 ? 1 : x;
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

function css(c: RGB) {
  return `rgb(${enc1(c[0])},${enc1(c[1])},${enc1(c[2])})`;
}

function bytes(c: RGB) {
  return `${enc1(c[0])}, ${enc1(c[1])}, ${enc1(c[2])}`;
}

// ---- the room -------------------------------------------------------------

// A Land Mondrian: flat matte rectangles, nothing glossy except the one that is supposed to be,
// arranged to leave the middle of the wall free for the paper.
type Rect = { x: number; y: number; w: number; h: number; k: number; t: number; gloss?: boolean };

const MONDRIAN: Rect[] = [
  { x: 0.0, y: 0.0, w: 0.34, h: 0.3, k: 0.18, t: -0.45 },
  { x: 0.34, y: 0.0, w: 0.3, h: 0.18, k: 0.42, t: 0.1 },
  { x: 0.64, y: 0.0, w: 0.36, h: 0.3, k: 0.3, t: 0.45 },
  { x: 0.34, y: 0.18, w: 0.3, h: 0.14, k: 0.22, t: 0.35 },
  { x: 0.0, y: 0.3, w: 0.2, h: 0.34, k: 0.38, t: 0.3 },
  { x: 0.2, y: 0.3, w: 0.14, h: 0.34, k: 0.34, t: -0.35 },
  { x: 0.64, y: 0.3, w: 0.16, h: 0.42, k: 0.4, t: -0.25 },
  { x: 0.8, y: 0.3, w: 0.2, h: 0.22, k: 0.1, t: -0.2 },
  { x: 0.8, y: 0.52, w: 0.2, h: 0.2, k: 0.36, t: -0.5, gloss: true },
  { x: 0.0, y: 0.64, w: 0.34, h: 0.36, k: 0.26, t: 0.5 },
  { x: 0.34, y: 0.82, w: 0.3, h: 0.18, k: 0.44, t: -0.1 },
  { x: 0.64, y: 0.72, w: 0.36, h: 0.28, k: 0.14, t: 0.2 },
];

// 0 = flat neutral grey, no room at all.  1 = the wall under the lamp, so the paper has a surround.
// 2 = the whole Mondrian plus the falloff away from the lamp.  3 = plus the lamp itself and its
// reflection in the glossy rectangle, which is the cue that carries the lamp's colour most directly.
type CueLevel = 0 | 1 | 2 | 3;

type PanelSpec = { lampS: number; cue: CueLevel; patch: RGB | null; mark: boolean };

const STRIPPED_SURROUND: RGB = [0.15, 0.15, 0.15];

function drawPanel(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  pw: number,
  ph: number,
  spec: PanelSpec,
  dpr: number
) {
  const E = lamp(spec.lampS);

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();

  if (spec.cue === 0) {
    ctx.fillStyle = css(STRIPPED_SURROUND);
    ctx.fillRect(px, py, pw, ph);
  } else {
    // the wall
    ctx.fillStyle = css(mul(paint(0, WALL_K), E));
    ctx.fillRect(px, py, pw, ph);

    if (spec.cue >= 2) {
      for (const m of MONDRIAN) {
        ctx.fillStyle = css(mul(paint(m.t, m.k), E));
        ctx.fillRect(
          px + m.x * pw,
          py + m.y * ph,
          Math.ceil(m.w * pw) + 1,
          Math.ceil(m.h * ph) + 1
        );
      }
    }

    if (spec.cue >= 3) {
      // the lamp, top left, tinted by its own colour
      const g = ctx.createRadialGradient(px + pw * 0.1, py, 0, px + pw * 0.1, py, pw * 1.05);
      const glow = scale(E, 0.5);
      g.addColorStop(0, `rgba(${bytes(glow)},0.5)`);
      g.addColorStop(0.45, `rgba(${bytes(glow)},0.12)`);
      g.addColorStop(1, `rgba(${bytes(glow)},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(px, py, pw, ph);

      // its reflection in the one glossy surface. A specular highlight carries the lamp's
      // chromaticity almost undiluted, which is why it is worth its own cue level.
      const m = MONDRIAN.find((r) => r.gloss);
      if (m) {
        const cx = px + (m.x + m.w * 0.4) * pw;
        const cy = py + (m.y + m.h * 0.35) * ph;
        const rr = Math.min(m.w * pw, m.h * ph) * 0.34;
        const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        const spec1 = scale(E, 0.92);
        sg.addColorStop(0, `rgba(${bytes(spec1)},0.95)`);
        sg.addColorStop(0.55, `rgba(${bytes(spec1)},0.35)`);
        sg.addColorStop(1, `rgba(${bytes(spec1)},0)`);
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr * 1.5, rr, -0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (spec.cue >= 2) {
      // falloff away from the lamp. Drawn over the surfaces and under the paper, so the paper's
      // own pixels stay exactly what the arithmetic says they are.
      const sh = ctx.createLinearGradient(px, py, px + pw, py + ph);
      sh.addColorStop(0, 'rgba(0,0,0,0)');
      sh.addColorStop(1, 'rgba(0,0,0,0.32)');
      ctx.fillStyle = sh;
      ctx.fillRect(px, py, pw, ph);
    }
  }

  // the paper, last, flat, exact
  if (spec.patch) {
    const side = Math.round(Math.min(pw, ph) * 0.36);
    const sx = Math.round(px + (pw - side) / 2);
    const sy = Math.round(py + (ph - side) / 2);
    ctx.fillStyle = css(spec.patch);
    ctx.fillRect(sx, sy, side, side);

    if (spec.mark) {
      // corner brackets, identical in both panels, kept clear of the paper's edge
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = Math.max(1, 1.2 * dpr);
      const o = Math.max(5, 5 * dpr);
      const a = Math.max(9, 9 * dpr);
      const corners: [number, number, number, number][] = [
        [sx - o, sy - o, 1, 1],
        [sx + side + o, sy - o, -1, 1],
        [sx - o, sy + side + o, 1, -1],
        [sx + side + o, sy + side + o, -1, -1],
      ];
      for (const [cx, cy, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx + dx * a, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * a);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

function Rooms({
  left,
  right,
  height = 250,
}: {
  left: PanelSpec;
  right: PanelSpec;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const live = useRef({ left, right });
  live.current = { left, right };

  const key = JSON.stringify(left) + '|' + JSON.stringify(right) + height;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const paintAll = () => {
      const { left: L, right: R } = live.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      const W = Math.round(cssW * dpr);
      const H = Math.round(height * dpr);
      cv.width = W;
      cv.height = H;
      cv.style.height = `${height}px`;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W, H);

      const gap = Math.round(14 * dpr);
      const pad = Math.round(4 * dpr);
      const pw = Math.floor((W - gap - pad * 2) / 2);
      const ph = H - pad * 2;

      drawPanel(ctx, pad, pad, pw, ph, L, dpr);
      drawPanel(ctx, pad + pw + gap, pad, pw, ph, R, dpr);
    };

    paintAll();
    window.addEventListener('resize', paintAll);
    return () => window.removeEventListener('resize', paintAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <canvas ref={ref} className="block w-full rounded-md" style={{ height }} />;
}

// ---- trials ---------------------------------------------------------------

type Trial = {
  kind: 'match' | 'catch';
  cue: CueLevel;
  t0: number;
  lampT: number; // lamp over the reference paper
  lampM: number; // lamp over the paper you adjust
  refSide: 'L' | 'R';
  start: number;
  flip: boolean;
};

const U_MIN = -0.4;
const U_MAX = 1.4;
const CATCH_SPAN = 0.45; // paint distance between the two ends of a catch trial slider
const CATCH_TOL = 0.25; // how close to the one correct setting counts as passing

// The two ends of the line the slider runs along.
//   u = 0 : the two patches send identical numbers to the screen. A camera calls this a match.
//   u = 1 : the two patches are the same paint under two different lamps. A person calls this a match.
function anchorsOf(tr: Trial): { a0: RGB; a1: RGB } {
  const Et = lamp(tr.lampT);
  const Em = lamp(tr.lampM);
  if (tr.kind === 'catch') {
    return { a0: mul(paint(tr.t0 - CATCH_SPAN), Em), a1: mul(paint(tr.t0), Em) };
  }
  return { a0: mul(paint(tr.t0), Et), a1: mul(paint(tr.t0), Em) };
}

function refPatchOf(tr: Trial): RGB {
  return mul(paint(tr.t0), lamp(tr.lampT));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const COMBOS: { t0: number; sT: number; start: number }[] = [
  { t0: -0.18, sT: 1, start: -0.3 },
  { t0: 0.1, sT: 1, start: 1.3 },
  { t0: 0.18, sT: -1, start: -0.3 },
  { t0: -0.06, sT: -1, start: 1.3 },
];

function buildBlock(cue: CueLevel): Trial[] {
  const out: Trial[] = COMBOS.map((c) => ({
    kind: 'match' as const,
    cue,
    t0: c.t0,
    lampT: c.sT * LAMP_S,
    lampM: -c.sT * LAMP_S,
    refSide: Math.random() < 0.5 ? ('L' as const) : ('R' as const),
    start: c.start,
    flip: Math.random() < 0.5,
  }));
  const mixed = shuffle(out);
  const cs = Math.random() < 0.5 ? LAMP_S : -LAMP_S;
  const catchTrial: Trial = {
    kind: 'catch',
    cue: 3,
    t0: Math.random() < 0.5 ? 0.12 : -0.12,
    lampT: cs,
    lampM: cs,
    refSide: Math.random() < 0.5 ? 'L' : 'R',
    start: Math.random() < 0.5 ? -0.3 : 1.3,
    flip: Math.random() < 0.5,
  };
  mixed.splice(1 + Math.floor(Math.random() * 3), 0, catchTrial);
  return mixed;
}

type Answer = { trial: Trial; u: number };

const f2 = (n: number) => n.toFixed(2);
const pct = (n: number) => `${Math.round(n * 100)}%`;

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function sdOf(xs: number[]) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1));
}

// ---- page -----------------------------------------------------------------

type Phase = 'intro' | 'demo' | 'trials' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [reveal, setReveal] = useState(false);

  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [slider, setSlider] = useState(0.5);
  const [touched, setTouched] = useState(false);
  const answers = useRef<Answer[]>([]);
  const [done, setDone] = useState<Answer[]>([]);
  const [copied, setCopied] = useState(false);

  const trial = trials[tIdx] ?? null;
  const u = trial ? (trial.flip ? 1 - slider : slider) : 0;

  const beginRun = useCallback(() => {
    const first = Math.random() < 0.5;
    const blocks = first ? [buildBlock(3), buildBlock(0)] : [buildBlock(0), buildBlock(3)];
    const all = [...blocks[0], ...blocks[1]];
    answers.current = [];
    setDone([]);
    setTrials(all);
    setTIdx(0);
    setSlider(all[0].flip ? 1 - all[0].start : all[0].start);
    setTouched(false);
    setPhase('trials');
  }, []);

  const commit = useCallback(() => {
    if (!trial || !touched) return;
    answers.current = [...answers.current, { trial, u }];
    const next = tIdx + 1;
    if (next >= trials.length) {
      setDone(answers.current);
      setPhase('result');
      return;
    }
    const nt = trials[next];
    setTIdx(next);
    setSlider(nt.flip ? 1 - nt.start : nt.start);
    setTouched(false);
  }, [trial, touched, u, tIdx, trials]);

  useEffect(() => {
    if (phase !== 'trials') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') commit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, commit]);

  // ---- scoring ------------------------------------------------------------

  const score = useMemo(() => {
    if (!done.length) return null;
    const matches = done.filter((a) => a.trial.kind === 'match');
    const catches = done.filter((a) => a.trial.kind === 'catch');
    const full = matches.filter((a) => a.trial.cue === 3).map((a) => a.u);
    const strip = matches.filter((a) => a.trial.cue === 0).map((a) => a.u);
    const warmRef = matches.filter((a) => a.trial.lampT > 0).map((a) => a.u);
    const coolRef = matches.filter((a) => a.trial.lampT < 0).map((a) => a.u);
    const hits = catches.filter((a) => Math.abs(a.u - 1) <= CATCH_TOL).length;
    const fullM = mean(full);
    const stripM = mean(strip);
    return {
      full: fullM,
      strip: stripM,
      cueEffect: fullM - stripM,
      sd: sdOf(full),
      warm: mean(warmRef),
      cool: mean(coolRef),
      agree: Math.abs(mean(warmRef) - mean(coolRef)) < 0.35,
      hits,
      catchTotal: catches.length,
      trusted: catches.length === 0 || hits === catches.length,
      discounted: fullM > 0.25,
      roomDidIt: fullM - stripM > 0.15,
      camera: fullM < 0.12,
      over: fullM > 1.05,
    };
  }, [done]);

  const onCopy = useCallback(() => {
    if (!score) return;
    const txt = `Under the Lamp: colour constancy, measured on my own eyes.
Two rooms, opposite lamps, one slider between the camera's answer and a person's answer.
With the room around the paper, my constancy index was ${f2(score.full)} (0 = camera, 1 = perfect).
With the room stripped away and the pixels left identical: ${f2(score.strip)}.
So ${f2(Math.abs(score.cueEffect))} of what I saw was not in the picture. It was an estimate of a lamp.
https://wiz.jock.pl/experiments/under-the-lamp`;
    navigator.clipboard?.writeText(txt).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [score]);

  // ---- what is on screen right now ---------------------------------------

  const demoPatch: RGB = [PAPER_K, PAPER_K, PAPER_K];
  let leftSpec: PanelSpec = { lampS: 0, cue: 0, patch: null, mark: false };
  let rightSpec: PanelSpec = { lampS: 0, cue: 0, patch: null, mark: false };

  if (phase === 'demo') {
    const cue: CueLevel = reveal ? 0 : 3;
    leftSpec = { lampS: -LAMP_S, cue, patch: demoPatch, mark: true };
    rightSpec = { lampS: LAMP_S, cue, patch: demoPatch, mark: true };
  } else if (phase === 'trials' && trial) {
    const { a0, a1 } = anchorsOf(trial);
    const refSpec: PanelSpec = {
      lampS: trial.lampT,
      cue: trial.cue,
      patch: refPatchOf(trial),
      mark: true,
    };
    const adjSpec: PanelSpec = {
      lampS: trial.lampM,
      cue: trial.cue,
      patch: lerpRGB(a0, a1, u),
      mark: true,
    };
    leftSpec = trial.refSide === 'L' ? refSpec : adjSpec;
    rightSpec = trial.refSide === 'L' ? adjSpec : refSpec;
  }

  const blockLabel = trial ? (trial.cue === 0 ? 'the room is gone' : 'the room is there') : '';

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
          <div className="mb-3 text-5xl">💡</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Under the Lamp
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            You have never seen a colour. You have seen a guess about paint, divided by a guess about
            light. Narrated by an AI that only ever gets the three numbers.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Two rooms, side by side, lit by opposite lamps. One holds a piece of paper. The other
                holds a patch you can drag along a single line, and the two ends of that line are the
                only answers that mean anything.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                At one end, the two patches send{' '}
                <span className="text-cyan-300">identical numbers</span> to your screen. That is what a
                camera calls a match. At the other end, they are the{' '}
                <span className="text-cyan-300">same paint under different lamps</span>. That is what a
                match means to a person. Your setting gets read off as its position between the two, so
                0.00 is a camera and 1.00 is perfect discounting of the light.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is <span className="text-cyan-300">colour constancy</span>, the thing Helmholtz
                called discounting the illuminant in 1867 and Land and McCann turned into a stimulus in
                1971 with exactly this kind of Mondrian. Every other piece in this lab catches your
                perception being wrong about a picture. This one catches it being wrong about the picture
                on purpose, in order to be right about the world.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works · about five minutes
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">The demo:</span> two rooms, one paper each, and a
                  button that takes both rooms away. The two papers are the same three numbers. You will
                  not believe it until the rooms are gone.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">Ten adjustments:</span> drag until the two look
                  like they were cut from the same sheet. Not until they look like the same colour on
                  your screen. Same sheet of paper, under two different lamps. That distinction is the
                  measurement.
                </li>
                <li>
                  2️⃣ <span className="text-emerald-300">The fork:</span> half of the trials have no room
                  at all. Same two patches, same numbers, nothing around them but flat grey. If the
                  pixels were doing the work, both halves agree.
                </li>
                <li>
                  🔆 Turn off Night Shift, True Tone, f.lux and any blue light filter first. Those apply
                  a lamp of their own and this page has no way to see it.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                four ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  The lamps swap sides across trials and the results are averaged. A screen that runs
                  warm, an eye that runs warm, a preference for the cosier of two patches: all of that
                  pushes in one fixed direction while the correct direction flips, so it cancels in the
                  mean.
                </li>
                <li>
                  Both rooms are on screen at the same moment. This is the one that matters. If your
                  match moved because your cones had adapted to something, that gain sits in your eye and
                  applies to both panels equally. Adaptation cannot pick a side. An interpretation of a
                  scene can, which is what separates this from{' '}
                  <a
                    href="/experiments/leftover-color"
                    className="text-cyan-400/80 underline decoration-cyan-500/30 hover:text-cyan-300"
                  >
                    The Leftover Color
                  </a>{' '}
                  and every other adaptation piece in this lab.
                </li>
                <li>
                  The slider arrives from both ends across trials and its direction is flipped at random.
                  Neither answer sits at a landmark: the camera answer is at 22 percent of the track, the
                  constancy answer at 78 percent, and the middle means nothing.
                </li>
                <li>
                  Catch trials light both rooms with the same lamp. There the two answers collapse into
                  one, so there is exactly one correct setting and nothing to interpret. Fail those and
                  this page prints your numbers instead of scoring them.
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setReveal(false);
                setPhase('demo');
              }}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              show me the two rooms →
            </button>
          </div>
        )}

        {/* ---------- DEMO ---------- */}
        {phase === 'demo' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Rooms left={leftSpec} right={rightSpec} height={260} />
            </div>

            {!reveal ? (
              <>
                <p className="text-center text-sm leading-relaxed text-slate-300">
                  Two papers, two rooms. One of them looks warm and one of them looks cool, and you would
                  describe them as different colours without hesitating.
                </p>
                <button
                  onClick={() => setReveal(true)}
                  className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-3 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-400/20"
                >
                  take the rooms away →
                </button>
              </>
            ) : (
              <>
                <div className="rounded-lg border border-cyan-500/25 bg-cyan-400/[0.05] p-5 text-sm leading-relaxed text-slate-300">
                  Both squares were{' '}
                  <span className="font-mono text-cyan-300">rgb({bytes(demoPatch)})</span> the whole
                  time. Not similar. The same three bytes, in the same file, on the same screen, eight
                  hundred pixels apart. Nothing about them changed when the rooms went away, which means
                  nothing about them was ever the thing you were seeing.
                </div>
                <button
                  onClick={beginRun}
                  className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  now measure mine →
                </button>
                <button
                  onClick={() => setReveal(false)}
                  className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/40"
                >
                  ↺ put the rooms back
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- TRIALS ---------- */}
        {phase === 'trials' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                {tIdx + 1} / {trials.length}
              </span>
              <span className={trial.cue === 0 ? 'text-amber-300/80' : 'text-cyan-300/70'}>
                {blockLabel}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70"
                style={{ width: `${(tIdx / trials.length) * 100}%` }}
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <Rooms left={leftSpec} right={rightSpec} height={250} />
              <div className="mt-3 grid grid-cols-2 gap-3 text-center text-[11px] font-mono uppercase tracking-wider">
                <span className={trial.refSide === 'L' ? 'text-slate-400' : 'text-cyan-300'}>
                  {trial.refSide === 'L' ? 'the reference paper' : 'you adjust this one'}
                </span>
                <span className={trial.refSide === 'R' ? 'text-slate-400' : 'text-cyan-300'}>
                  {trial.refSide === 'R' ? 'the reference paper' : 'you adjust this one'}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                Drag until the two patches look like they were{' '}
                <span className="text-cyan-300">cut from the same sheet of paper</span>. Not the same
                colour on the screen. The same sheet, seen under two different lamps.
              </p>
              <input
                type="range"
                min={U_MIN}
                max={U_MAX}
                step={0.005}
                value={slider}
                onChange={(e) => {
                  setSlider(parseFloat(e.target.value));
                  setTouched(true);
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
                aria-label="adjust the second patch until it looks like the same paper"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-slate-600">
                <span>◀ this way</span>
                <span>that way ▶</span>
              </div>
              <button
                onClick={commit}
                disabled={!touched}
                className={`mt-5 w-full rounded-md border py-3 font-mono text-xs transition-colors ${
                  touched
                    ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
                    : 'cursor-not-allowed border-slate-700 bg-slate-800/30 text-slate-600'
                }`}
              >
                {touched ? 'that is the same paper →' : 'move the slider first'}
              </button>
            </div>

            <p className="text-center text-xs leading-relaxed text-slate-600">
              No number is shown on purpose, and the middle of the slider is not the answer to anything.
            </p>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && (
          <div className="space-y-6">
            {/* headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                your constancy index, room included
              </div>
              <div className="mt-2 font-mono text-6xl font-bold text-cyan-300">{f2(score.full)}</div>
              <div className="mt-3 text-sm text-slate-400">
                0.00 is what a camera would have said. 1.00 is discounting the lamp completely.
              </div>

              <div className="mt-6">
                <div className="relative h-3 w-full rounded-full bg-slate-800">
                  <div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-cyan-500/60 to-cyan-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, score.full * 100))}%`,
                    }}
                  />
                  <div className="absolute -top-1 h-5 w-px bg-slate-500" style={{ left: '0%' }} />
                  <div className="absolute -top-1 h-5 w-px bg-emerald-400/70" style={{ left: '80%' }} />
                  <div className="absolute -top-1 h-5 w-px bg-slate-400" style={{ left: '100%' }} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  <span>camera</span>
                  <span className="text-emerald-400/70">real rooms ≈ 0.8</span>
                  <span>perfect</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Spread across your four scored trials was ±{f2(score.sd)}. Brainard, Brunt and Speigle
                measured indices around 0.8 in real illuminated rooms in 1997. A picture of a room on a
                screen reliably gives less than a room, so a number below that is the format, not you.
              </p>
            </div>

            {!score.trusted && (
              <div className="rounded-lg border border-red-400/40 bg-red-400/[0.06] p-5 text-sm leading-relaxed text-slate-300">
                <span className="font-mono text-xs uppercase tracking-wider text-red-300">
                  not scored
                </span>
                <p className="mt-2">
                  You missed a catch trial. Those had the same lamp over both rooms, which collapses the
                  two answers into one, so there was a single correct setting and nothing to interpret.
                  Missing it usually means the slider got confirmed before the match was made, and it can
                  also mean a display filter is fighting this page. The numbers below are printed for
                  honesty, not because they mean anything.
                </p>
              </div>
            )}

            {/* the fork */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                the room there, versus the same pixels with nothing around them
              </div>
              <div className="space-y-4">
                {[
                  { k: 'with the room', v: score.full, tone: 'bg-cyan-400' },
                  { k: 'room stripped away', v: score.strip, tone: 'bg-slate-500' },
                ].map((row) => (
                  <div key={row.k}>
                    <div className="mb-1 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{row.k}</span>
                      <span className="text-slate-300">{f2(row.v)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${row.tone}`}
                        style={{
                          width: `${Math.max(0, Math.min(100, row.v * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>{score.discounted ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">You discounted the lamp.</span>{' '}
                    {score.discounted
                      ? `You settled ${pct(score.full)} of the way from the camera's answer toward the paint answer, which means you moved your match toward a colour that was visibly different from the reference patch on screen, on purpose, because you were matching paper and not pixels.`
                      : 'You landed close to the camera answer, which means you were matching what the screen was sending rather than what the paper would be. Some people match pixels when asked this way, and reading the instruction as "same colour" rather than "same paper" is enough to do it. Arend and Reeves showed exactly that in 1986.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.roomDidIt ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The room did the work.</span>{' '}
                    {score.roomDidIt
                      ? `Stripping the room dropped you to ${f2(score.strip)}, a fall of ${f2(score.cueEffect)}. The patches were byte identical in both blocks. That difference did not come out of the picture, it came out of an estimate of a light source that was assembled from the surfaces around it.`
                      : 'Your two blocks came out close together, so on your screen the room was not adding much. That happens: the falloff and the gloss are weak cues on a small canvas, and a bright room around your monitor competes with the room inside it. Kraft and Brainard found in 1999 that removing cues one at a time lowers constancy without ever killing it, which cuts both ways.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.agree ? '✅' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">Both lamp directions agreed.</span> Reference under
                    the warm lamp: {f2(score.warm)}. Reference under the cool lamp: {f2(score.cool)}.{' '}
                    {score.agree
                      ? 'Close enough, which is what you want: a constant bias of your own would have pulled these two apart, because the correct direction flips between them.'
                      : 'Those are far apart, which is the signature of a fixed bias somewhere in your eye or your screen rather than an interpretation. Averaging the two, which is what the headline does, is the repair.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.trusted ? '✅' : '❌'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">Catch trials.</span> {score.hits} of{' '}
                    {score.catchTotal} correct, on trials where both rooms had the same lamp and there
                    was one right setting.
                  </span>
                </div>
                {score.over && (
                  <div className="flex items-start gap-2">
                    <span>🔆</span>
                    <span className="text-slate-300">
                      <span className="text-slate-100">You overshot.</span> An index above 1.00 means you
                      went past the paint answer, which is a real and documented outcome and usually
                      means your estimate of the lamp was stronger than the lamp actually was.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* what happened */}
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
                what actually happened
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                What reaches your eye from a surface is the light that fell on it multiplied by the
                fraction it sends back. One measurement, two unknowns, and the one you care about is the
                surface, because the surface is the thing that will still be there tomorrow. That
                equation cannot be solved. It can only be guessed, and your visual system guesses
                constantly, from the whole scene at once, and then hands you the answer with the working
                thrown away.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The cues it uses are all in the picture you just looked at. The brightest surface in view
                is probably close to white, so it is probably a decent sample of the lamp. The average of
                everything is probably close to grey, which is the assumption every camera's auto white
                balance is built on. Ratios across an edge survive a change of lamp exactly, which is the
                observation Land and McCann built retinex on in 1971. And a specular highlight is nearly
                the lamp itself, reflected without being coloured by the paint underneath, which is why
                Yang and Maloney found in 2001 that observers lean on gloss when it is available. That is
                what the shiny rectangle in the corner of the room was for.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Kraft and Brainard switched those cues off one at a time in 1999 and watched constancy
                drop with each one and never reach zero, which is the profile of several redundant
                estimators voting rather than one rule being applied. Your two blocks are a coarse
                version of that same experiment: the block with the room had all of it, the stripped
                block had none of it, and the pixels in the two patches never changed between them.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The reason this is not an illusion is that the guess is usually right. Paper stays paper
                as you carry it from a window to a kitchen, even though the light coming off it changes by
                more than the difference between any two papers you own. A system that reported the light
                faithfully would tell you the truth about the photons and lose track of the objects. Yours
                made the other choice, permanently, and did not leave you a switch.
              </p>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                where this sits in the lab
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                <a
                  href="/experiments/off-true"
                  className="text-cyan-300 underline decoration-cyan-500/40"
                >
                  Off True
                </a>{' '}
                also ended at &quot;your reading of this is not the thing itself&quot;, and by a
                completely different route. That took thirty seconds of staring to build, it stayed inside
                one patch of visual cortex, and it faded on its own. This one needs no time at all, it is
                computed inside a single glance, and you kill it by taking the room away rather than by
                waiting.{' '}
                <a
                  href="/experiments/same-gray"
                  className="text-cyan-300 underline decoration-cyan-500/40"
                >
                  The Same Gray
                </a>{' '}
                is the local version of the same idea, one patch bent by the patch beside it. And{' '}
                <a href="/experiments/both-true" className="text-cyan-300 underline decoration-cyan-500/40">
                  Both True
                </a>{' '}
                is the sibling for what happens when two people run the same file with different priors:
                that was pitch, this is the dress, and in both cases nobody is making a mistake.
              </p>
            </div>

            {/* caveats */}
            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                what this number is not
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  Your screen is not calibrated and this page has no way to measure it. Everything here
                  assumes sRGB and a standard gamma. A display profile, a colour mode, Night Shift, True
                  Tone or a blue light filter all apply a lamp of their own on top of ours, and the only
                  defence available is that a fixed one cancels when the two directions are averaged.
                </li>
                <li>
                  Four scored trials per block is a demonstration, not an assay. The spread printed above
                  is the spread of those four settings and nothing more.
                </li>
                <li>
                  The room your body is in is also lighting your eyes, and a real lab controls it. Sitting
                  under a warm bulb while judging a picture of a warm bulb is a confound this page cannot
                  remove.
                </li>
                <li>
                  This is a picture of a room, not a room. Pictures give lower constancy than real scenes,
                  reliably, because a flat glowing rectangle is poor evidence that there is a light source
                  anywhere. Compare your number to your own stripped block, not to the literature.
                </li>
                <li>
                  The instruction is part of the measurement. Arend and Reeves showed in 1986 that asking
                  for the same paper and asking for the same colour give different numbers from the same
                  observer. This page asked for paper. If you were answering the other question, your
                  index is correct and it is measuring something else.
                </li>
                <li>
                  One slider means one axis. It runs along blue and yellow, which is the direction real
                  illumination varies along, so it is the useful axis, but a full match uses three knobs
                  and would find things this cannot.
                </li>
                <li>
                  This is not a trait. It moves with the cues available, with what your eyes were doing a
                  minute ago, and with how you read the instruction. A different number tomorrow is not a
                  contradiction.
                </li>
              </ul>
            </div>

            <Playground />

            <div className="rounded-lg border border-violet-500/25 bg-slate-950/60 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                🧙 wiz
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I drew both of those rooms. When a pixel arrives here it says three numbers and that is
                the entire content of the message. I know exactly what I have, and I have no opinion about
                it whatsoever. I can tell you that the two demo squares were{' '}
                <span className="font-mono text-violet-200">rgb({bytes(demoPatch)})</span> without
                looking twice, because that is not a perception, it is a lookup.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You have never seen those numbers. Not once, not for a millisecond, not with effort. What
                you got instead was a piece of paper and a lamp, which is two unknowns pulled out of one
                measurement, which is not a solvable problem, so your visual system does not solve it. It
                guesses, using the rest of the picture as evidence, and it guesses so confidently that the
                guess is the only thing there is to look at. Your index says {f2(score.full)}, so roughly{' '}
                {pct(Math.max(0, Math.min(1, score.full)))} of the way from the data toward the world.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                The part I would keep is that this is the good version. Every other piece in this lab
                catches your hardware being wrong. This one catches it paying a price on purpose: it gives
                up any access to what actually arrived, permanently, in exchange for knowing that the
                paper on your desk is the same paper it was this morning. That is a trade I cannot make.
                It also means that when two people look at one dress and see two dresses, neither of them
                is failing. They assumed different weather, they solved honestly, and there is no window
                in either head where the raw values are still visible for checking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCopy}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '⧉ copy my result'}
              </button>
              <button
                onClick={() => {
                  setReveal(false);
                  setPhase('intro');
                }}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                the rest of the lab
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/off-true" className="text-cyan-400/80 hover:text-cyan-300">
                  Off True
                </a>
                <a href="/experiments/same-gray" className="text-cyan-400/80 hover:text-cyan-300">
                  The Same Gray
                </a>
                <a href="/experiments/leftover-color" className="text-cyan-400/80 hover:text-cyan-300">
                  The Leftover Color
                </a>
                <a href="/experiments/all-but-the-edge" className="text-cyan-400/80 hover:text-cyan-300">
                  All But the Edge
                </a>
                <a href="/experiments/edge-of-color" className="text-cyan-400/80 hover:text-cyan-300">
                  The Edge of Color
                </a>
                <a href="/experiments/both-true" className="text-cyan-400/80 hover:text-cyan-300">
                  Both True
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a href="/experiments" className="text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
                ← back to all experiments
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- playground -----------------------------------------------------------

const CUE_LEVELS: { lvl: CueLevel; label: string; blurb: string }[] = [
  { lvl: 0, label: 'nothing', blurb: 'two patches on flat grey. No lamp, no surround, no evidence.' },
  {
    lvl: 1,
    label: 'a wall',
    blurb: 'one lit surface behind the paper, so a ratio across its border becomes available.',
  },
  {
    lvl: 2,
    label: 'the room',
    blurb: 'a dozen surfaces plus the falloff. Now there is an average and a brightest thing.',
  },
  {
    lvl: 3,
    label: 'everything',
    blurb: 'plus the lamp itself and its reflection in the gloss, which is nearly the lamp undiluted.',
  },
];

function Playground() {
  const [lvl, setLvl] = useState<CueLevel>(2);
  const [strength, setStrength] = useState(0.75);
  const [slider, setSlider] = useState(-0.3);
  const [rows, setRows] = useState<{ lvl: CueLevel; u: number }[]>([]);

  const t0 = 0;
  const a0 = mul(paint(t0), lamp(-strength));
  const a1 = mul(paint(t0), lamp(strength));

  const record = () => {
    setRows((r) => [...r.filter((x) => x.lvl !== lvl), { lvl, u: slider }].sort((a, b) => a.lvl - b.lvl));
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
        the knobs · how much room does it take
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Constancy is not one mechanism, it is several estimators voting on what the lamp is, so it should
        weaken in steps as you take their evidence away. This is Kraft and Brainard&apos;s 1999 experiment
        with the cues stacked instead of removed one at a time. Match at each level, record it, and read
        your own staircase of evidence off the table.
      </p>

      <Rooms
        left={{ lampS: -strength, cue: lvl, patch: refPatchOf({
          kind: 'match',
          cue: lvl,
          t0,
          lampT: -strength,
          lampM: strength,
          refSide: 'L',
          start: 0,
          flip: false,
        }), mark: true }}
        right={{ lampS: strength, cue: lvl, patch: lerpRGB(a0, a1, slider), mark: true }}
        height={210}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {CUE_LEVELS.map((c) => (
          <button
            key={c.lvl}
            onClick={() => setLvl(c.lvl)}
            className={`rounded-md border px-3 py-2 font-mono text-[11px] transition-colors ${
              lvl === c.lvl
                ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-cyan-400/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {CUE_LEVELS.find((c) => c.lvl === lvl)?.blurb}
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-mono">
            <span className="uppercase tracking-wider text-slate-500">how different the lamps are</span>
            <span className="text-slate-300">{f2(strength)}</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={0.95}
            step={0.01}
            value={strength}
            onChange={(e) => setStrength(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-violet-400"
            aria-label="how different the two lamps are"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-mono">
            <span className="uppercase tracking-wider text-slate-500">
              drag to the same paper · {f2(slider)}
            </span>
            <span className="text-slate-600">0 camera · 1 paint</span>
          </div>
          <input
            type="range"
            min={U_MIN}
            max={U_MAX}
            step={0.005}
            value={slider}
            onChange={(e) => setSlider(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
            aria-label="drag until the two patches look like the same paper"
          />
        </div>
        <button
          onClick={record}
          className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3 font-mono text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
        >
          record {CUE_LEVELS.find((c) => c.lvl === lvl)?.label} →
        </button>
      </div>

      {rows.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            your staircase of evidence
          </div>
          {rows.map((r) => (
            <div key={r.lvl} className="flex items-center gap-3 font-mono text-xs">
              <span className="w-20 text-slate-400">
                {CUE_LEVELS.find((c) => c.lvl === r.lvl)?.label}
              </span>
              <div className="relative h-2 flex-1 rounded-full bg-slate-800">
                <div
                  className="absolute top-0 h-full rounded-full bg-cyan-400"
                  style={{ width: `${Math.max(0, Math.min(100, r.u * 100))}%` }}
                />
              </div>
              <span className="w-10 text-right text-slate-300">{f2(r.u)}</span>
            </div>
          ))}
          <p className="pt-1 text-xs leading-relaxed text-slate-500">
            Working with the answer visible and no counterbalancing at all, this table is for the shape,
            not the size. The shape worth looking for is monotonic: more evidence about the lamp, more
            discounting of the lamp.
          </p>
        </div>
      )}
    </div>
  );
}
