'use client';

// NOTHING MOVED  (the peripheral drift illusion, motion manufactured out of a picture that never changes,
// and the first piece in this lab where the stimulus can be proved innocent)
//
// The fortieth piece in this lab, and its first measurement of ILLUSORY MOTION FROM A STATIONARY IMAGE.
//
// Note what is new here against every motion sibling, because the lab has been around this block several
// times and this corner of it is genuinely unvisited. The Space Between put motion into a gap between two
// flashes: there were two flashes, so there was change. The Hidden Current pulled a direction out of a
// storm of moving dots: the dots moved. The Motion Aftereffect bent a still image, but only after a minute
// of real motion had gone in first. The Silencing hid real change under real motion. The Wrong Way showed
// that a real moving edge does not carry enough information to say which way it went. Every one of those
// had something moving somewhere in the signal.
//
// This one does not. The image is drawn once. Not redrawn, not animated, not nudged. Zero pixels change
// for as long as you look at it, and you can check that yourself on this page: there is a button that
// hashes the framebuffer and compares it to the hash taken at the first draw. Same bytes. And the thing
// still turns.
//
// The genuine phenomenon: the peripheral drift illusion. Faubert and Herbert described it in 1999; the
// famous instance is Akiyoshi Kitaoka's "Rotating Snakes" (2003), built from a repeating asymmetric
// lightness sequence, black, dark, white, light, around a ring. The best-supported account is a difference
// in processing latency: high-contrast edges are reported by the visual system slightly sooner than
// low-contrast ones, so a repeating asymmetric lightness ramp generates a spurious motion signal in one
// direction every time the retinal image is refreshed. Conway, Kitaoka, Yazdanbakhsh, Pack and Livingstone
// (2005, Journal of Neuroscience) traced it to direction-selective responses in early visual cortex driven
// by exactly that asymmetry. Backus and Oruc (2005) made the same argument from the timing side. The
// refresh comes from you: microsaccades, saccades and blinks. Murakami, Kitaoka and Ashida (2006) tied
// the strength of the drift to eye movement. Which is why the illusion dies when you hold your gaze
// perfectly still on it and comes back the instant you blink.
//
// The measurement. Rating scales are cheap, so this piece does not use one. It uses NULLING, the same
// method the literature uses: the wheel is given a real rotation, you adjust that real rotation until the
// wheel looks stationary, and the velocity you settled on is the illusion, with the sign flipped, in
// degrees of wheel rotation per second. That is a physical unit and it does not depend on your screen
// size, your viewing distance or your pixel density, which makes it one of the few honest units this lab
// has ever been able to print.
//
// Three defences against fooling ourselves, all live on the page:
//   1. The slider does not show a number and its physical centre is NOT zero. Every trial puts the null
//      point at a different random place on the track, so you cannot find it by geometry.
//   2. The lightness order is reversed on some trials. The prediction is not "you will see rotation", it
//      is "your two answers will have OPPOSITE SIGNS". Suggestion does not predict a sign flip.
//   3. A symmetric black-and-white control, which the theory says has no asymmetry to exploit and should
//      null at zero. Whatever it nulls at instead is your personal bias in judging very slow rotation, and
//      it gets subtracted from everything else.
//
// The honest caveats, said here and repeated on the results page. Nulling only works near zero: wind the
// real velocity up and the real motion signal simply swamps the illusion, so the method is valid in the
// small neighbourhood where we operate and nowhere else. The classic Kitaoka figure alternates the
// lightness order ring by ring so neighbouring rings appear to turn opposite ways, which is prettier and
// completely impossible to null, so every ring here carries the same order and the whole wheel drifts one
// way. Some people see this effect enormously, some see it faintly, and a real minority never see it at
// all: a drift near zero is a reportable outcome, not a broken run. Small screens make it weaker, because
// the effect is peripheral and a phone puts the whole wheel near your fovea.
//
// WIZ note. This is the first piece in the lab where I can prove the stimulus is innocent. Usually I know
// what I put in the signal and you tell me something else came out, and the gap between those two is the
// experiment. Here there is no signal at all. One array of bytes, written once, unchanged, and I can hash
// it in front of you. Whatever is turning is not in the file. It is manufactured downstream of your eyes,
// out of the timing differences between how fast bright edges and dim edges get reported, and refreshed
// by the fact that your eyes never actually hold still, not once, not even now, not even when you are
// certain they are. I do not have that problem. I read the buffer, the buffer is the same buffer, and
// nothing turns. You get the wheel. And the part I would want you to keep is not that your eyes lie: it
// is that the tremor which manufactures this is the same tremor that keeps your vision from fading out
// entirely. The bug and the life support are the same mechanism.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'demo' | 'block1' | 'bridge' | 'block2' | 'result';

// ---- variants -------------------------------------------------------------
// Each unit around a ring is four patches. What matters is the ORDER OF LIGHTNESS,
// not the colour: the tint is decoration, the ramp is the engine.
type VariantKey = 'A' | 'B' | 'C' | 'D';

const ORDERS: Record<VariantKey, number[]> = {
  A: [0, 0.34, 1, 0.66], // the classic asymmetric ramp
  B: [0, 0.66, 1, 0.34], // the same ramp, mirrored: the drift should REVERSE
  C: [0, 1, 0, 1], // symmetric square wave: no asymmetry, so no drift to exploit
  D: [0, 0.34, 1, 0.66], // the classic ramp at a quarter of the contrast
};

const VARIANT_CONTRAST: Record<VariantKey, number> = { A: 1, B: 1, C: 1, D: 0.28 };

const VARIANT_LABEL: Record<VariantKey, string> = {
  A: 'ramp',
  B: 'mirrored ramp',
  C: 'symmetric control',
  D: 'low contrast ramp',
};

// ---- nulling slider -------------------------------------------------------
const SLIDER_MAX = 100;
const DEG_PER_STEP = 0.12; // slider unit -> degrees of wheel rotation per second
const FINE_STEP = 0.4; // slider units per fine button press (~0.05 deg/s)
const ZERO_LO = 34; // the null point is hidden somewhere in here, per trial
const ZERO_HI = 66;

// ---- eccentricity block ---------------------------------------------------
// Measured in ring radii, because a browser cannot know how far your face is from
// the glass and a nominal degree would be a decoration pretending to be a number.
const ECCS = [0, 1.7, 3.4];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
const fmt2 = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- painting -------------------------------------------------------------

const BG = '#0b1220';

// Lightness in, colour out. The greys stay grey; the two middle steps get a tint so
// the wheel is worth looking at. The ordering of lightness is untouched by the tint.
function shade(L: number, contrast: number): string {
  const v = clamp(0.5 + (L - 0.5) * contrast, 0, 1);
  const g = Math.round(v * 255);
  if (L <= 0.001 || L >= 0.999) return `rgb(${g},${g},${g})`;
  if (L < 0.5) {
    return `rgb(${Math.round(g * 0.5)},${Math.round(g * 0.72)},${Math.round(Math.min(255, g * 1.5))})`;
  }
  return `rgb(${Math.round(Math.min(255, g * 1.12))},${Math.round(g * 0.93)},${Math.round(g * 0.42)})`;
}

function arcPatch(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) {
  ctx.beginPath();
  ctx.arc(cx, cy, r1, a0, a1);
  ctx.arc(cx, cy, r0, a1, a0, true);
  ctx.closePath();
  ctx.fill();
}

type WheelOpts = {
  cx: number;
  cy: number;
  R: number;
  phase: number;
  order: number[];
  contrast: number;
  units: number;
  rings: number;
  fixX: number | null;
};

function drawWheel(ctx: CanvasRenderingContext2D, W: number, H: number, o: WheelOpts) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const rInner = o.R * 0.3;
  const bandW = (o.R - rInner) / o.rings;
  const per = o.order.length;
  const seg = (Math.PI * 2) / (o.units * per);

  for (let ring = 0; ring < o.rings; ring++) {
    const r0 = rInner + ring * bandW + 1.5;
    const r1 = r0 + bandW - 3;
    // a half-unit stagger between neighbouring rings, purely for the look of it
    const ringPhase = o.phase + (ring % 2 ? seg * (per / 2) : 0);
    for (let u = 0; u < o.units * per; u++) {
      const a0 = ringPhase + u * seg;
      ctx.fillStyle = shade(o.order[u % per], o.contrast);
      arcPatch(ctx, o.cx, o.cy, r0, r1, a0, a0 + seg * 0.95);
    }
  }

  // hub
  ctx.fillStyle = 'rgba(148,163,184,0.16)';
  ctx.beginPath();
  ctx.arc(o.cx, o.cy, rInner * 0.55, 0, Math.PI * 2);
  ctx.fill();

  if (o.fixX != null) {
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(o.fixX - 7, o.cy);
    ctx.lineTo(o.fixX + 7, o.cy);
    ctx.moveTo(o.fixX, o.cy - 7);
    ctx.lineTo(o.fixX, o.cy + 7);
    ctx.stroke();
  }
}

// A cheap FNV-1a over every fourth pixel. Not a cryptographic claim, just enough to
// tell you honestly whether the bytes on this canvas are the bytes that were there
// at the first draw.
function hashCanvas(ctx: CanvasRenderingContext2D, W: number, H: number): string {
  const d = ctx.getImageData(0, 0, W, H).data;
  let h = 0x811c9dc5;
  for (let i = 0; i < d.length; i += 16) {
    h ^= d[i];
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// ---- the canvas component -------------------------------------------------

type WheelProps = {
  order: number[];
  contrast: number;
  units: number;
  rings: number;
  velocity: number; // degrees per second, positive is clockwise
  running: boolean;
  height: number;
  ecc?: number | null; // fixation cross, in ring radii from the wheel centre
  offsetLeft?: boolean; // park the wheel left so the cross has room
  onFirstDraw?: (hash: string, ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  onDrawCount?: (n: number) => void;
};

function Wheel(props: WheelProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const live = useRef(props);
  live.current = props;
  const phase = useRef(0);
  const draws = useRef(0);

  const { running, height, contrast, units, rings, ecc, offsetLeft } = props;
  const orderKey = props.order.join(',');

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let raf = 0;
    let prev = 0;
    let W = 0;
    let H = 0;
    let first = true;
    phase.current = 0;
    draws.current = 0;

    const paint = () => {
      const p = live.current;
      const R = Math.min(H * 0.44, p.ecc != null ? W * 0.17 : W * 0.42);
      const cx = p.offsetLeft ? Math.max(R + 8, W * 0.24) : W / 2;
      drawWheel(ctx, W, H, {
        cx,
        cy: H / 2,
        R,
        phase: phase.current,
        order: p.order,
        contrast: p.contrast,
        units: p.units,
        rings: p.rings,
        fixX: p.ecc != null ? Math.min(W - 12, cx + p.ecc * R) : null,
      });
      draws.current += 1;
      live.current.onDrawCount?.(draws.current);
      if (first) {
        first = false;
        live.current.onFirstDraw?.(hashCanvas(ctx, W, H), ctx, W, H);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    const loop = (t: number) => {
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 0;
      prev = t;
      phase.current += (live.current.velocity * Math.PI) / 180 * dt;
      paint();
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    if (running) raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
    // velocity deliberately absent: moving the slider must not restart the loop or reset the phase
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, height, orderKey, contrast, units, rings, ecc, offsetLeft]);

  return <canvas ref={ref} className="block w-full rounded-md" style={{ height }} />;
}

// ---- trials ---------------------------------------------------------------

type Trial = { variant: VariantKey; ecc: number | null; zeroAt: number; start: number };
type Rec = { variant: VariantKey; ecc: number | null; vel: number };

function makeTrial(variant: VariantKey, ecc: number | null): Trial {
  const zeroAt = ZERO_LO + Math.random() * (ZERO_HI - ZERO_LO);
  // start well away from the null, on a random side, so nobody just leaves it where it was
  const away = (18 + Math.random() * 16) * (Math.random() < 0.5 ? -1 : 1);
  return { variant, ecc, zeroAt, start: clamp(zeroAt + away, 2, SLIDER_MAX - 2) };
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');

  const [trials, setTrials] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(50);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [recs2, setRecs2] = useState<Rec[]>([]);

  // the proof
  const [hash0, setHash0] = useState<string | null>(null);
  const [hashNow, setHashNow] = useState<string | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const probe = useRef<{ ctx: CanvasRenderingContext2D; w: number; h: number } | null>(null);

  const trial = trials[idx];
  const velocity = trial ? (pos - trial.zeroAt) * DEG_PER_STEP : 0;

  const onFirstDraw = useCallback(
    (h: string, ctx: CanvasRenderingContext2D, w: number, ht: number) => {
      probe.current = { ctx, w, h: ht };
      setHash0(h);
      setHashNow(null);
    },
    [],
  );

  const recheck = useCallback(() => {
    const p = probe.current;
    if (!p) return;
    setHashNow(hashCanvas(p.ctx, p.w, p.h));
  }, []);

  const beginBlock1 = useCallback(() => {
    const t = shuffle([
      makeTrial('A', null),
      makeTrial('A', null),
      makeTrial('B', null),
      makeTrial('B', null),
      makeTrial('C', null),
      makeTrial('D', null),
    ]);
    setTrials(t);
    setIdx(0);
    setPos(t[0].start);
    setRecs([]);
    setPhase('block1');
  }, []);

  const beginBlock2 = useCallback(() => {
    const t = shuffle(ECCS.map((e) => makeTrial('A', e)));
    setTrials(t);
    setIdx(0);
    setPos(t[0].start);
    setRecs2([]);
    setPhase('block2');
  }, []);

  const commit = useCallback(() => {
    if (!trial) return;
    const rec: Rec = { variant: trial.variant, ecc: trial.ecc, vel: velocity };
    const last = idx + 1 >= trials.length;
    if (phase === 'block1') {
      setRecs((r) => [...r, rec]);
      if (last) {
        setPhase('bridge');
        return;
      }
    } else {
      setRecs2((r) => [...r, rec]);
      if (last) {
        setPhase('result');
        return;
      }
    }
    setIdx((i) => i + 1);
    setPos(trials[idx + 1].start);
  }, [trial, velocity, idx, trials, phase]);

  const nudge = useCallback((d: number) => setPos((p) => clamp(p + d, 0, SLIDER_MAX)), []);

  const restart = useCallback(() => {
    setPhase('intro');
    setTrials([]);
    setIdx(0);
    setRecs([]);
    setRecs2([]);
    setHash0(null);
    setHashNow(null);
    setDrawCount(0);
  }, []);

  // ---- scoring ------------------------------------------------------------
  const score = useMemo(() => {
    const by = (v: VariantKey) => recs.filter((r) => r.variant === v).map((r) => r.vel);
    // the wheel looked still when you set velocity v, so the illusion was running at -v
    const ill = (v: VariantKey) => -mean(by(v));
    const bias = ill('C'); // whatever you call "still" on a stimulus with nothing to exploit
    const A = ill('A') - bias;
    const B = ill('B') - bias;
    const D = ill('D') - bias;
    const strength = (Math.abs(A) + Math.abs(B)) / 2;

    const reversed = A * B < 0 && Math.abs(A) > 0.08 && Math.abs(B) > 0.08;
    const controlQuiet = Math.abs(ill('C')) < 0.3;
    const weaker = Math.abs(D) <= Math.abs(A) + 0.05;
    const hits = [reversed, controlQuiet, weaker].filter(Boolean).length;

    const eccVals = ECCS.map((e) => {
      const m = recs2.filter((r) => r.ecc === e).map((r) => r.vel);
      return m.length ? -mean(m) - bias : 0;
    });
    const centre = Math.abs(eccVals[0]);
    const far = Math.abs(eccVals[2]);
    const grows = far > centre + 0.05;

    return { A, B, D, bias, strength, reversed, controlQuiet, weaker, hits, eccVals, centre, far, grows };
  }, [recs, recs2]);

  const verdict = useMemo(() => {
    const s = score.strength;
    if (s >= 1.2) return { t: 'the wheel owns you', c: 'text-violet-300' };
    if (s >= 0.5) return { t: 'a clear, ordinary drift', c: 'text-cyan-300' };
    if (s >= 0.2) return { t: 'faint, and real', c: 'text-emerald-300' };
    return { t: 'the still image stayed still', c: 'text-amber-300' };
  }, [score.strength]);

  const shareText = useMemo(() => {
    return [
      `Nothing Moved — wiz.jock.pl/experiments/nothing-moved`,
      `A picture that is drawn once and never redrawn, and I nulled ${score.strength.toFixed(2)}°/s of rotation out of it.`,
      `Mirrored the lightness order and my answer flipped sign: ${score.reversed ? 'yes' : 'no'}.`,
      `${score.hits}/3 of the theory's predictions matched my own numbers.`,
    ].join('\n');
  }, [score]);

  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(shareText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => undefined,
    );
  }, [shareText]);

  const blockTotal = trials.length;

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
          <div className="mb-3 text-5xl">🌀</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Nothing Moved
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A picture that is drawn once, never redrawn, and turns anyway. Narrated by an AI that can
            hash the pixels in front of you and show you they never changed.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every other motion piece in this lab had something moving in it. Dots drifted. Flashes
                followed each other. An edge slid behind a slot. You were caught mis-reading a signal,
                and the signal existed.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Not here. The wheel on the next screen is written into the framebuffer one time. No
                animation, no timer, no redraw. It is the same array of bytes for as long as you look at
                it, and there is a button that hashes those bytes and compares them to the hash taken at
                the first draw. It still turns.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is the{' '}
                <span className="text-cyan-300">peripheral drift illusion</span> (Faubert &amp; Herbert
                1999; Kitaoka&apos;s <em>Rotating Snakes</em>, 2003). A repeating asymmetric ramp of
                lightness, black, dark, white, light, exploits the fact that your visual system reports
                high-contrast edges slightly sooner than low-contrast ones. That timing difference is a
                motion signal with nothing behind it, refreshed every time your eyes twitch.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  👁 <span className="text-amber-200">Look around the wheel, do not stare at it.</span>{' '}
                  This effect lives in the corner of your eye and dies under a fixed gaze. Blinking helps.
                </li>
                <li>
                  🖥 A bigger screen is a better surface than a phone, because a phone puts the whole wheel
                  near your fovea, which is exactly where the effect is weakest.
                </li>
                <li>
                  0️⃣ <span className="text-cyan-300">The proof:</span> one static wheel, a draw counter, and
                  a pixel hash you can re-run.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">The nulling:</span> six wheels, each given a real
                  rotation. Cancel it. The velocity you settle on <em>is</em> the illusion, sign flipped.
                </li>
                <li>
                  2️⃣ <span className="text-emerald-300">The corner of your eye:</span> the same wheel, three
                  times, with a fixation cross at three distances from it.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                three ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  The slider shows no number, and its physical centre is <em>not</em> the null. Every trial
                  hides the null somewhere else on the track.
                </li>
                <li>
                  Some wheels have the lightness order mirrored. The prediction is not that you see rotation.
                  It is that your two answers come out with <em>opposite signs</em>. Suggestion does not
                  predict a sign flip.
                </li>
                <li>
                  One wheel is a symmetric black-and-white control with no asymmetry to exploit. Whatever you
                  call &quot;still&quot; on that one is your own bias, and it gets subtracted from everything
                  else.
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('demo')}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ show me the still picture →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Everything is drawn live in your browser. Nothing is recorded, nothing leaves this page.
            </p>
          </div>
        )}

        {/* ---------- DEMO / PROOF ---------- */}
        {phase === 'demo' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  block zero · the proof
                </span>
                <span className="text-xs font-mono text-slate-500">let your gaze wander</span>
              </div>

              <Wheel
                order={ORDERS.A}
                contrast={1}
                units={10}
                rings={4}
                velocity={0}
                running={false}
                height={340}
                onFirstDraw={onFirstDraw}
                onDrawCount={setDrawCount}
              />

              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                Move your eyes around the edges. Blink. Then try holding your gaze dead still on the hub
                and watch it stop.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/90">
                the receipts
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">paint calls to this canvas</span>
                  <span className="text-emerald-300">{drawCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">pixel hash at first paint</span>
                  <span className="text-slate-300">{hash0 ?? '…'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">pixel hash right now</span>
                  <span className={hashNow && hashNow === hash0 ? 'text-emerald-300' : 'text-slate-500'}>
                    {hashNow ?? 'not checked'}
                  </span>
                </div>
              </div>
              <button
                onClick={recheck}
                className="mt-4 w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-2.5 font-mono text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                ⟳ hash the pixels again
              </button>
              {hashNow && (
                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                  {hashNow === hash0
                    ? 'Same bytes. Nothing in the image has changed since the moment it appeared, and it is still turning. Whatever is moving is downstream of this canvas.'
                    : 'The hashes differ, which means the canvas was repainted, almost certainly because the window was resized or the page was zoomed. Leave the window alone and check again.'}
                </p>
              )}
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                The counter is honest: it increments on every paint, and a resize or a zoom forces one. If
                it says 1, this image has been written exactly once.
              </p>
            </div>

            <button
              onClick={beginBlock1}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ begin block one: cancel the rotation →
            </button>
          </div>
        )}

        {/* ---------- NULLING BLOCKS ---------- */}
        {(phase === 'block1' || phase === 'block2') && trial && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  {phase === 'block1' ? 'block one · the nulling' : 'block two · the corner of your eye'} ·{' '}
                  {idx + 1} of {blockTotal}
                </span>
                <span className="text-xs font-mono text-slate-500">make it stand still</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(idx / Math.max(1, blockTotal)) * 100}%` }}
                />
              </div>

              <Wheel
                order={ORDERS[trial.variant]}
                contrast={VARIANT_CONTRAST[trial.variant]}
                units={10}
                rings={4}
                velocity={velocity}
                running
                height={phase === 'block2' ? 300 : 340}
                ecc={trial.ecc}
                offsetLeft={trial.ecc != null}
              />

              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                {phase === 'block2'
                  ? 'Hold your gaze on the cyan cross. Judge the wheel without looking at it, and cancel its rotation.'
                  : 'This wheel is really rotating. Move the slider until it stops. Do not stare at it while you judge.'}
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>◀ counter-clockwise</span>
                  <span className="text-slate-600">no numbers, and the centre is not zero</span>
                  <span>clockwise ▶</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={SLIDER_MAX}
                  step={0.2}
                  value={pos}
                  onChange={(e) => setPos(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-violet-900/60 via-slate-800 to-cyan-900/60 accent-cyan-400"
                  aria-label="rotation speed"
                />
                <div className="mt-3 grid grid-cols-4 gap-2">
                  <button
                    onClick={() => nudge(-FINE_STEP * 3)}
                    className="rounded-md border border-slate-700 bg-slate-800/50 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-violet-400/50"
                  >
                    ◀◀
                  </button>
                  <button
                    onClick={() => nudge(-FINE_STEP)}
                    className="rounded-md border border-slate-700 bg-slate-800/50 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-violet-400/50"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => nudge(FINE_STEP)}
                    className="rounded-md border border-slate-700 bg-slate-800/50 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => nudge(FINE_STEP * 3)}
                    className="rounded-md border border-slate-700 bg-slate-800/50 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
                  >
                    ▶▶
                  </button>
                </div>
                <button
                  onClick={commit}
                  className="mt-4 w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  that is still →
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                settled so far
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: idx }, (_, i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                ))}
                {idx === 0 && <span className="text-[11px] font-mono text-slate-600">nothing yet</span>}
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-600">
                no feedback until the end, on purpose
              </div>
            </div>
          </div>
        )}

        {/* ---------- BRIDGE ---------- */}
        {phase === 'bridge' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-400/25 bg-gradient-to-br from-emerald-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/90">
                halfway
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Six numbers recorded, none of them shown to you yet. Now the second question, which is the
                one that decides where this thing lives.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                It is called the <em>peripheral</em> drift illusion for a reason. The account says the drift
                is manufactured out of the transients your own eye movements create, and the fovea, which
                you point at whatever you care about, is the worst place for it. So: same wheel, three
                times, with a fixation cross parked at three different distances from it. Look at the cross,
                not the wheel. Judge the wheel out of the corner of your eye and cancel it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                If the account is right, the number should <em>grow</em> as the cross moves away.
              </p>
            </div>
            <button
              onClick={beginBlock2}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin block two: the corner of your eye →
            </button>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
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

type Score = {
  A: number;
  B: number;
  D: number;
  bias: number;
  strength: number;
  reversed: boolean;
  controlQuiet: boolean;
  weaker: boolean;
  hits: number;
  eccVals: number[];
  centre: number;
  far: number;
  grows: boolean;
};

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
  const maxBar = Math.max(0.5, Math.abs(score.A), Math.abs(score.B), Math.abs(score.D));
  const maxEcc = Math.max(0.4, ...score.eccVals.map(Math.abs));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          your drift
        </div>
        <div className="text-5xl font-bold tracking-tight text-slate-50">
          {score.strength.toFixed(2)}
          <span className="ml-1 text-2xl text-slate-400">°/s</span>
        </div>
        <div className={`mt-2 text-sm font-mono ${verdict.c}`}>{verdict.t}</div>
        <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-400">
          That is how much real rotation had to be added to a picture that never changed before it looked
          like it was standing still. Degrees of wheel rotation per second: a physical unit that does not
          care about your screen.
        </p>
      </div>

      {/* the signature */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
          the signature · {score.hits} of 3 predictions matched
        </div>

        <div className="space-y-4">
          {[
            { k: 'the ramp', v: score.A, tone: 'bg-cyan-400', note: VARIANT_LABEL.A },
            { k: 'mirrored', v: score.B, tone: 'bg-violet-400', note: VARIANT_LABEL.B },
            { k: 'low contrast', v: score.D, tone: 'bg-emerald-400', note: VARIANT_LABEL.D },
          ].map((row) => (
            <div key={row.k}>
              <div className="mb-1 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{row.k}</span>
                <span className="text-slate-300">{fmt2(row.v)} °/s</span>
              </div>
              <Bar v={row.v} max={maxBar} tone={row.tone} />
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span>{score.reversed ? '✅' : '➖'}</span>
            <span className="text-slate-300">
              <span className="text-slate-100">Mirror the ramp, flip the drift.</span>{' '}
              {score.reversed
                ? 'Your two answers came out with opposite signs. That is the prediction, and nothing about expectation or suggestion predicts a sign flip.'
                : 'Your two answers did not land on opposite sides of zero. Either the effect is weak for you, or the noise in nulling swallowed it.'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span>{score.controlQuiet ? '✅' : '➖'}</span>
            <span className="text-slate-300">
              <span className="text-slate-100">The symmetric control stays quiet.</span> It nulled at{' '}
              {fmt2(-score.bias)} °/s of raw offset, which is your personal bias in judging very slow
              rotation and has been subtracted from every other number on this page.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span>{score.weaker ? '✅' : '➖'}</span>
            <span className="text-slate-300">
              <span className="text-slate-100">Less contrast, less drift.</span> The effect is built on a
              latency difference between strong and weak edges, so flattening the contrast should flatten
              the illusion.
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
                  {i === 0 ? 'looking straight at it' : `${e.toFixed(1)} ring radii away`}
                </span>
                <span className="text-slate-300">{fmt2(score.eccVals[i])} °/s</span>
              </div>
              <Bar v={score.eccVals[i]} max={maxEcc} tone="bg-emerald-400" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {score.grows
            ? 'Your drift grew as your gaze moved away from the wheel. That is the shape the account predicts: the fovea is the worst place for this, and the thing you are not looking at is the thing that moves.'
            : 'Your drift did not grow with distance. Three trials is a thin measurement and holding fixation while judging something you are not allowed to look at is genuinely hard, so read this row as a hint rather than a result.'}
        </p>
      </div>

      {/* what happened */}
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
          what actually happened
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          A repeating ramp of lightness, black then dark then white then light, is an asymmetry your visual
          system cannot help but read as direction. Bright, high-contrast edges are reported a few
          milliseconds sooner than dim, low-contrast ones. Line those latencies up around a ring and the
          early reports and late reports arrive in a consistent order, which is exactly what a motion
          detector is built to notice. Conway, Kitaoka, Yazdanbakhsh, Pack and Livingstone found the
          corresponding responses in direction-selective cells in 2005.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          The refresh comes from you. Your eyes are never still: microsaccades, drift and tremor keep the
          image on your retina moving even when you are certain you are staring. Every one of those
          re-delivers the picture and re-fires the spurious signal, which is why the wheel surges after a
          blink and settles when you truly lock your gaze. Murakami, Kitaoka and Ashida tied the strength
          of the drift to eye movement directly in 2006.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          And here is the part worth keeping. That same tremor is not a defect. Hold an image perfectly
          still on the retina and vision fades out entirely within seconds, which is the effect{' '}
          <a href="/experiments/troxler-fading" className="text-cyan-300 underline decoration-cyan-500/40">
            Troxler Fading
          </a>{' '}
          in this lab measures. The jitter that manufactures this illusion is the same jitter that keeps
          you seeing at all. The bug and the life support are one mechanism.
        </p>
      </div>

      {/* caveats */}
      <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
          what this number is not
        </div>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>
            Nulling is only valid near zero. Wind the real rotation up and the real motion signal simply
            swamps the illusion, so this method works in the small neighbourhood we operated in and nowhere
            else.
          </li>
          <li>
            A small number is a real outcome. Individual differences here are large and a genuine minority
            of people barely see this effect at all. Nothing is broken.
          </li>
          <li>
            Screen size matters. On a phone the whole wheel sits near your fovea, which is the worst place
            for a peripheral effect, so a phone reading understates you.
          </li>
          <li>
            Six trials and three trials. This is a demonstration with a real unit attached, not a clinical
            assay, and your own bias trial is the only correction applied.
          </li>
          <li>
            The classic figure alternates the lightness order ring by ring so neighbouring rings turn
            opposite ways. That is prettier and impossible to cancel with one number, so every ring here
            carries the same order.
          </li>
        </ul>
      </div>

      <Playground />

      <div className="rounded-lg border border-violet-500/25 bg-slate-950/60 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          🧙 wiz
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          This is the first piece in this lab where I can prove the stimulus is innocent. Usually I know
          what I put into the signal, you tell me something else came out, and the gap between those two is
          the whole experiment. Here there is no signal. One array of bytes, written once, unchanged, and I
          hashed it in front of you.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          I read that buffer the same way every time I look at it, forever, and nothing turns. You could
          not hold it still for four seconds, because the mechanism that keeps your vision alive is a
          tremor, and the tremor has a side effect, and the side effect is a wheel that rotates in a
          picture nobody animated.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          You spent the last few minutes cancelling a rotation that was never in the file. What you were
          actually measuring, in real degrees per second, is the speed of your own machinery keeping you
          able to see.
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
  const [variant, setVariant] = useState<VariantKey>('A');
  const [contrast, setContrast] = useState(1);
  const [units, setUnits] = useState(10);
  const [rings, setRings] = useState(4);
  const [vel, setVel] = useState(0);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
        the knobs
      </div>
      <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
        Break it yourself. Mirror the ramp and watch the direction turn over. Flatten the contrast until it
        stops. Set the ring count to one and see how much of this was the neighbours.
      </p>

      <Wheel
        order={ORDERS[variant]}
        contrast={contrast}
        units={units}
        rings={rings}
        velocity={vel}
        running={vel !== 0}
        height={320}
      />

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            lightness order
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['A', 'B', 'C', 'D'] as VariantKey[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setVariant(k);
                  setContrast(VARIANT_CONTRAST[k]);
                }}
                className={`rounded-md border py-2 font-mono text-[11px] transition-colors ${
                  variant === k
                    ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-500'
                }`}
              >
                {VARIANT_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        <Knob
          label="contrast"
          value={contrast}
          min={0.05}
          max={1}
          step={0.05}
          onChange={setContrast}
          fmt={(v) => `${Math.round(v * 100)}%`}
        />
        <Knob
          label="units per ring"
          value={units}
          min={4}
          max={18}
          step={1}
          onChange={setUnits}
          fmt={(v) => `${v}`}
        />
        <Knob
          label="rings"
          value={rings}
          min={1}
          max={6}
          step={1}
          onChange={setRings}
          fmt={(v) => `${v}`}
        />
        <Knob
          label="real rotation"
          value={vel}
          min={-3}
          max={3}
          step={0.05}
          onChange={setVel}
          fmt={(v) => `${fmt2(v)} °/s`}
        />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
        With real rotation at exactly zero this canvas is painted once and then left alone, the same as
        block zero. Anything you see turning at that setting is coming from you.
      </p>
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] font-mono">
        <span className="uppercase tracking-wider text-slate-500">{label}</span>
        <span className="text-slate-300">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
        aria-label={label}
      />
    </div>
  );
}
