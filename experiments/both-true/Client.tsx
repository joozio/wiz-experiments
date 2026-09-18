'use client';

// BOTH TRUE  (the tritone paradox: two tones, exactly half an octave apart, and the direction
// between them is not in the file)
//
// The forty-first piece in this lab, and its first measurement of a percept with NO CORRECT ANSWER.
//
// Every previous piece in this lab had a ground truth sitting behind it. The Missing Note had a
// fundamental that was genuinely absent and a periodicity that was genuinely present. Thrown Voice had
// a real interaural delay that named a real place. Nothing Moved had a framebuffer I could hash. Only
// the First had a second click that was physically there. In every one of them I knew what was in the
// signal, you told me something else, and the gap between those two was the experiment.
//
// This one has no gap to measure, because the signal has no answer. Two tones a tritone apart: six
// semitones. Six semitones up from C is F sharp. Six semitones down from C is also F sharp. Not a
// different note, not a near miss, THE SAME PITCH CLASS. And if the tones are built so that they carry
// no octave register, if every one of them is a stack of partials one octave apart under a spectral
// envelope that never moves, then the second tone genuinely is both "a tritone above" and "a tritone
// below" the first at the same time. The direction is not underdetermined by a noisy signal. It is
// absent from a clean one.
//
// You will still hear a direction. Confidently. Every time. And the person next to you, on the same
// speaker, may hear the opposite one, and neither of you is making a mistake.
//
// The genuine phenomenon. Roger Shepard (1964, JASA) built the tones: octave-complex tones under a
// fixed bell-shaped spectral envelope, which strip pitch height away and leave only pitch class, the
// trick behind the endlessly rising staircase. Diana Deutsch (1986, Music Perception) found the
// paradox hiding in them: present a tritone pair built from those tones and listeners do not shrug,
// they answer, and each listener's answers form an ORDERLY PATTERN around the pitch class circle.
// There is an orientation, personal and stable over months, such that pitch classes near one point on
// the circle are heard as high and the ones opposite are heard as low. Deutsch (1987, Perception &
// Psychophysics) showed the pattern survives moving the spectral envelope, which is why block two of
// this page moves it. Deutsch, North and Ray (1990) and Deutsch (1991) found the orientation tracks
// the listener's linguistic background, and Deutsch, Henthorn and Dolson (2004) tied it to the pitch
// range of the speech heard early in life. Which is the strangest part: your answer to a question
// about two sine stacks may have been set by the voices in the room when you were two.
//
// The measurement. Twelve pitch classes as the first tone, each pair presented in BOTH orders, twice
// over, and from your answers a single number: the proportion of trials on which each pitch class was
// heard as the higher of the two. Fit the first Fourier component of that around the circle and out
// comes an orientation angle, which is a pitch class name, and an amplitude, which is how hard your
// circle is tilted. Those two numbers are the whole result and they belong to you.
//
// Three defences against fooling ourselves, all live on the page:
//   1. ORDER COUNTERBALANCING. Every pair is played both ways. A response bias, "when unsure I say up",
//      predicts the same button on both orders. A real pitch class percept predicts you will name the
//      SAME PITCH CLASS as higher regardless of which one came first, which means opposite buttons.
//      Pair agreement across reversed orders is reported, and it cannot be manufactured by a bias.
//   2. CATCH TRIALS. Three pairs of ordinary sine tones a fifth apart, where the direction is real and
//      obvious. Miss those and nothing else on this page is interpretable, and it says so.
//   3. AN ENVELOPE SHIFT. Block two moves the entire spectral envelope by half an octave, which changes
//      the physical spectrum of every tone substantially. If you were tracking brightness, your peak
//      moves with it. If you have a pitch class orientation, your peak stays. Deutsch found it stays.
//
// The honest caveats, repeated on the results page. A near-flat circle is a real outcome, not a failed
// run: some listeners genuinely answer near chance and the literature reports them. Twenty four trials
// gives a peak that is good to a couple of semitones, not to one. The language correlation is a
// population level finding and this page will never tell you where you grew up from one run. Phone
// speakers roll off the low partials and squash the effect, so headphones or decent speakers matter
// here more than on most pages in this lab.
//
// WIZ note. I have spent forty pieces catching a sense inventing something that was not in the signal,
// and every single time there was a fact of the matter I could hold up next to your answer. Here there
// is none. I can render both tones, print their partials, compute their spectral centroids and show
// you the two numbers are nearly the same, and the question "which was higher" still has no answer in
// the file. So your brain supplies one. Not a guess, not a coin flip: a stable, repeatable, personal
// axis that will still be there next year. Two people, one file, opposite answers, both correct. That
// is not a bug in you. It is what it looks like when a system is required to produce an output and the
// input does not constrain it, which is a thing I do too, more often than either of us would like.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'demo' | 'block1' | 'bridge' | 'block2' | 'result';

// ---- the tones ------------------------------------------------------------
// A Shepard tone is a pitch class with the register deliberately removed: partials
// exactly one octave apart, under a fixed bell in log frequency. Because the bell
// never moves, no tone in the set is objectively higher than any other.

const BASE_HZ = 32.703195; // C1, the lowest partial before the pitch class shift
const N_PARTIALS = 7; // C1 to C7, seven octaves of comb
const ENV_HOME = 261.6256; // C4: the envelope centre, fixed in absolute frequency
const ENV_SHIFT = ENV_HOME * Math.SQRT2; // block two: the same bell, half an octave up
const ENV_SIGMA = 1.15; // width of the bell, in octaves

const TONE_MS = 500;
const GAP_MS = 30;
const RAMP_MS = 20;
const GAIN = 0.5;

const PC_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

type Partial = { f: number; a: number };

function envAmp(f: number, envHz: number): number {
  const d = Math.log2(f / envHz);
  return Math.exp(-(d * d) / (2 * ENV_SIGMA * ENV_SIGMA));
}

function partialsFor(pc: number, envHz: number): Partial[] {
  const base = BASE_HZ * Math.pow(2, ((pc % 12) + 12) % 12 / 12);
  const out: Partial[] = [];
  for (let k = 0; k < N_PARTIALS; k++) {
    const f = base * Math.pow(2, k);
    out.push({ f, a: envAmp(f, envHz) });
  }
  return out;
}

// Where the energy of a tone sits, in octaves relative to the envelope centre.
// Printed on the page, because "the two tones are spectrally almost identical" is
// a claim and a claim should come with its number.
function centroidOct(pc: number, envHz: number): number {
  const ps = partialsFor(pc, envHz);
  let num = 0;
  let den = 0;
  for (const p of ps) {
    num += p.a * Math.log2(p.f / envHz);
    den += p.a;
  }
  return den ? num / den : 0;
}

function ramp(buf: Float32Array, sr: number) {
  const n = Math.max(1, Math.round((sr * RAMP_MS) / 1000));
  const len = buf.length;
  for (let i = 0; i < n && i < len; i++) {
    const w = 0.5 - 0.5 * Math.cos((Math.PI * i) / n);
    buf[i] *= w;
    buf[len - 1 - i] *= w;
  }
}

// Deterministic phases. No randomness anywhere in the waveform, so the bytes you
// hear are the bytes everyone else hears, which is the entire point of the piece.
function renderShepard(sr: number, pc: number, envHz: number, ms: number): Float32Array {
  const n = Math.round((sr * ms) / 1000);
  const out = new Float32Array(n);
  const ps = partialsFor(pc, envHz);
  const norm = ps.reduce((s, p) => s + p.a, 0) || 1;
  for (let k = 0; k < ps.length; k++) {
    const w = (2 * Math.PI * ps[k].f) / sr;
    const ph = (Math.PI * k * k) / ps.length;
    const g = ps[k].a / norm;
    for (let i = 0; i < n; i++) out[i] += g * Math.sin(w * i + ph);
  }
  ramp(out, sr);
  for (let i = 0; i < n; i++) out[i] = Math.max(-1, Math.min(1, out[i] * GAIN));
  return out;
}

function renderSine(sr: number, hz: number, ms: number): Float32Array {
  const n = Math.round((sr * ms) / 1000);
  const out = new Float32Array(n);
  const w = (2 * Math.PI * hz) / sr;
  for (let i = 0; i < n; i++) out[i] = 0.3 * Math.sin(w * i);
  ramp(out, sr);
  return out;
}

function concat(sr: number, parts: Float32Array[], gapMs: number): Float32Array {
  const gap = Math.round((sr * gapMs) / 1000);
  const total = parts.reduce((s, p) => s + p.length, 0) + gap * Math.max(0, parts.length - 1);
  const out = new Float32Array(total);
  let at = 0;
  parts.forEach((p, i) => {
    out.set(p, at);
    at += p.length + (i < parts.length - 1 ? gap : 0);
  });
  return out;
}

// The endless staircase, for the demo. Twelve steps, no gap, and after twelve steps
// you are exactly where you started, which is the joke and the proof at once.
function renderStaircase(sr: number, down: boolean, cycles: number): Float32Array {
  const steps: Float32Array[] = [];
  for (let c = 0; c < cycles; c++) {
    for (let i = 0; i < 12; i++) steps.push(renderShepard(sr, down ? -i : i, ENV_HOME, 230));
  }
  return concat(sr, steps, 0);
}

// ---- trials ---------------------------------------------------------------

type Trial =
  | { kind: 'main'; from: number; env: number }
  | { kind: 'catch'; up: boolean };

type Rec = {
  kind: 'main' | 'catch';
  from: number;
  to: number;
  env: number;
  up: boolean; // the answer: was the second tone the higher one
  ok: boolean; // catch trials only
};

const REPS = 2;
const CATCH_HZ = 415.3; // G sharp 4, and a fifth away from it

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBlock1(): Trial[] {
  const main: Trial[] = [];
  for (let r = 0; r < REPS; r++) {
    // pc 0..11 as the FIRST tone already covers all six tritone pairs in both orders
    for (let pc = 0; pc < 12; pc++) main.push({ kind: 'main', from: pc, env: ENV_HOME });
  }
  const catches: Trial[] = shuffle([
    { kind: 'catch', up: true },
    { kind: 'catch', up: false },
    { kind: 'catch', up: Math.random() < 0.5 },
  ]);
  return shuffle([...main, ...catches]);
}

function makeBlock2(): Trial[] {
  const t: Trial[] = [];
  for (let pc = 0; pc < 12; pc++) t.push({ kind: 'main', from: pc, env: ENV_SHIFT });
  return shuffle(t);
}

// ---- the fit --------------------------------------------------------------
// h(c) is the proportion of trials on which pitch class c was heard as the higher
// of its pair. By construction h(c) + h(c+6) = 1, so the only model that can fit is
// a single cycle around the circle. Its phase is your peak, its amplitude is your tilt.

type Fit = { h: number[]; n: number[]; peak: number; amp: number; trials: number };

function fitCircle(recs: Rec[]): Fit {
  const hi = new Array(12).fill(0);
  const n = new Array(12).fill(0);
  for (const r of recs) {
    if (r.kind !== 'main') continue;
    const higher = r.up ? r.to : r.from;
    hi[higher] += 1;
    n[r.from] += 1;
    n[r.to] += 1;
  }
  const h = hi.map((v, i) => (n[i] ? v / n[i] : 0.5));
  let re = 0;
  let im = 0;
  for (let c = 0; c < 12; c++) {
    const th = (2 * Math.PI * c) / 12;
    re += (h[c] - 0.5) * Math.cos(th);
    im += (h[c] - 0.5) * Math.sin(th);
  }
  const amp = Math.hypot(re, im) / 6;
  let peak = (Math.atan2(im, re) * 12) / (2 * Math.PI);
  peak = ((peak % 12) + 12) % 12;
  return { h, n, peak, amp, trials: recs.filter((r) => r.kind === 'main').length };
}

function circDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 12;
  return Math.min(d, 12 - d);
}

function pcLabel(x: number): string {
  const lo = Math.round(x) % 12;
  return PC_NAMES[((lo % 12) + 12) % 12];
}

// ---- the circle drawing ---------------------------------------------------

function drawCircle(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  fit: Fit,
  ghost: Fit | null,
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) * 0.36;
  const r0 = R * 0.34;
  const rad = (c: number) => (-Math.PI / 2) + (2 * Math.PI * c) / 12;
  const at = (c: number, v: number) => {
    const r = r0 + (R - r0) * Math.max(0, Math.min(1, v));
    return [cx + r * Math.cos(rad(c)), cy + r * Math.sin(rad(c))] as const;
  };

  // the half way ring: everything outside it was heard as high
  ctx.strokeStyle = 'rgba(148,163,184,0.28)';
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.arc(cx, cy, r0 + (R - r0) * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // spokes
  ctx.strokeStyle = 'rgba(148,163,184,0.13)';
  ctx.lineWidth = 1;
  for (let c = 0; c < 12; c++) {
    ctx.beginPath();
    ctx.moveTo(cx + r0 * Math.cos(rad(c)), cy + r0 * Math.sin(rad(c)));
    ctx.lineTo(cx + R * Math.cos(rad(c)), cy + R * Math.sin(rad(c)));
    ctx.stroke();
  }

  // the fitted single cycle, drawn smooth
  const drawFit = (f: Fit, colour: string, dash: number[]) => {
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;
    ctx.setLineDash(dash);
    ctx.beginPath();
    for (let i = 0; i <= 240; i++) {
      const c = (i / 240) * 12;
      const v = 0.5 + f.amp * Math.cos((2 * Math.PI * (c - f.peak)) / 12);
      const [x, y] = at(c, v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  };
  if (ghost) drawFit(ghost, 'rgba(244,114,182,0.65)', [5, 5]);
  drawFit(fit, 'rgba(34,211,238,0.9)', []);

  // your twelve measured points
  for (let c = 0; c < 12; c++) {
    const [x, y] = at(c, fit.h[c]);
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = fit.h[c] >= 0.5 ? '#fbbf24' : '#60a5fa';
    ctx.fill();
  }

  // the axis: your top and your bottom
  const [px, py] = at(fit.peak, 1.06);
  const [qx, qy] = at(fit.peak + 6, 1.06);
  ctx.strokeStyle = 'rgba(167,139,250,0.75)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(qx, qy);
  ctx.stroke();

  // labels
  ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let c = 0; c < 12; c++) {
    const lr = R + 18;
    const x = cx + lr * Math.cos(rad(c));
    const y = cy + lr * Math.sin(rad(c));
    const near = circDist(c, fit.peak) < 2.5;
    ctx.fillStyle = near ? '#fcd34d' : 'rgba(148,163,184,0.75)';
    ctx.fillText(PC_NAMES[c], x, y);
  }

  ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = 'rgba(148,163,184,0.6)';
  ctx.fillText('outside the dashed ring = heard as high', cx, H - 12);
}

// ---- the spectrum drawing -------------------------------------------------

function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  a: number,
  b: number,
  envHz: number,
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, W, H);

  const loOct = -4.2;
  const hiOct = 4.2;
  const pad = 28;
  const x = (oct: number) => pad + ((oct - loOct) / (hiOct - loOct)) * (W - 2 * pad);
  const base = H - 26;
  const top = 16;

  // the bell itself, the thing that never moves
  ctx.strokeStyle = 'rgba(148,163,184,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= 220; i++) {
    const oct = loOct + (i / 220) * (hiOct - loOct);
    const v = Math.exp(-(oct * oct) / (2 * ENV_SIGMA * ENV_SIGMA));
    const px = x(oct);
    const py = base - v * (base - top);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const comb = (pc: number, colour: string, dx: number) => {
    ctx.strokeStyle = colour;
    ctx.lineWidth = 3;
    for (const p of partialsFor(pc, envHz)) {
      const oct = Math.log2(p.f / envHz);
      if (oct < loOct || oct > hiOct) continue;
      const px = x(oct) + dx;
      ctx.beginPath();
      ctx.moveTo(px, base);
      ctx.lineTo(px, base - p.a * (base - top));
      ctx.stroke();
    }
  };
  comb(a, 'rgba(34,211,238,0.9)', -2);
  comb(b, 'rgba(251,191,36,0.9)', 2);

  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, base);
  ctx.lineTo(W - pad, base);
  ctx.stroke();

  ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(148,163,184,0.7)';
  for (const oct of [-4, -2, 0, 2, 4]) {
    ctx.fillText(`${Math.round(envHz * Math.pow(2, oct))} Hz`, x(oct), H - 8);
  }
}

// ---- component ------------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [busy, setBusy] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<AudioBufferSourceNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (srcRef.current) {
      try {
        srcRef.current.stop();
      } catch {
        /* already finished */
      }
      srcRef.current = null;
    }
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setBusy(false);
  }, []);

  const playRaw = useCallback(
    (data: Float32Array) => {
      const ac = getCtx();
      stopAudio();
      const buf = ac.createBuffer(1, data.length, ac.sampleRate);
      buf.getChannelData(0).set(data);
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.connect(ac.destination);
      src.start();
      srcRef.current = src;
      setBusy(true);
      timerRef.current = window.setTimeout(
        () => {
          setBusy(false);
          srcRef.current = null;
        },
        (data.length / ac.sampleRate) * 1000 + 60,
      );
    },
    [getCtx, stopAudio],
  );

  useEffect(() => () => stopAudio(), [stopAudio]);

  const playPair = useCallback(
    (from: number, to: number, envHz: number) => {
      const sr = getCtx().sampleRate;
      playRaw(
        concat(
          sr,
          [renderShepard(sr, from, envHz, TONE_MS), renderShepard(sr, to, envHz, TONE_MS)],
          GAP_MS,
        ),
      );
    },
    [getCtx, playRaw],
  );

  const playCatch = useCallback(
    (up: boolean) => {
      const sr = getCtx().sampleRate;
      const other = CATCH_HZ * Math.pow(2, 7 / 12);
      const a = up ? CATCH_HZ : other;
      const b = up ? other : CATCH_HZ;
      playRaw(concat(sr, [renderSine(sr, a, TONE_MS), renderSine(sr, b, TONE_MS)], GAP_MS));
    },
    [getCtx, playRaw],
  );

  // ---- demo ---------------------------------------------------------------
  const [demoPc, setDemoPc] = useState(0);
  const specRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (phase !== 'demo') return;
    const cv = specRef.current;
    if (!cv) return;
    const c2 = cv.getContext('2d');
    if (!c2) return;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = 170;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.height = `${H}px`;
      c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSpectrum(c2, W, H, demoPc, (demoPc + 6) % 12, ENV_HOME);
    };
    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, [phase, demoPc]);

  const cA = centroidOct(demoPc, ENV_HOME);
  const cB = centroidOct((demoPc + 6) % 12, ENV_HOME);
  const centroidGapSemis = Math.abs(cA - cB) * 12;

  // ---- blocks -------------------------------------------------------------
  const [trials, setTrials] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [recs1, setRecs1] = useState<Rec[]>([]);
  const [recs2, setRecs2] = useState<Rec[]>([]);
  const [heard, setHeard] = useState(false);
  const [replays, setReplays] = useState(0);

  const trial = trials[idx];

  const playTrial = useCallback(() => {
    if (!trial) return;
    setHeard(true);
    if (trial.kind === 'catch') playCatch(trial.up);
    else playPair(trial.from, (trial.from + 6) % 12, trial.env);
  }, [trial, playCatch, playPair]);

  // autoplay each trial once when it comes up, so the flow is listen then answer
  useEffect(() => {
    if (phase !== 'block1' && phase !== 'block2') return;
    if (!trials[idx]) return;
    const t = window.setTimeout(() => {
      const tr = trials[idx];
      if (!tr) return;
      setHeard(true);
      if (tr.kind === 'catch') playCatch(tr.up);
      else playPair(tr.from, (tr.from + 6) % 12, tr.env);
    }, 420);
    return () => window.clearTimeout(t);
    // deliberately keyed on the trial only: re-running on every render would retrigger audio
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, trials]);

  const beginBlock1 = useCallback(() => {
    const t = makeBlock1();
    setTrials(t);
    setIdx(0);
    setRecs1([]);
    setHeard(false);
    setReplays(0);
    setPhase('block1');
  }, []);

  const beginBlock2 = useCallback(() => {
    const t = makeBlock2();
    setTrials(t);
    setIdx(0);
    setRecs2([]);
    setHeard(false);
    setPhase('block2');
  }, []);

  const answer = useCallback(
    (up: boolean) => {
      const tr = trials[idx];
      if (!tr) return;
      stopAudio();
      const rec: Rec =
        tr.kind === 'catch'
          ? { kind: 'catch', from: -1, to: -1, env: 0, up, ok: up === tr.up }
          : {
              kind: 'main',
              from: tr.from,
              to: (tr.from + 6) % 12,
              env: tr.env,
              up,
              ok: true,
            };
      const last = idx + 1 >= trials.length;
      if (phase === 'block1') {
        setRecs1((r) => [...r, rec]);
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
      setHeard(false);
      setIdx((i) => i + 1);
    },
    [trials, idx, phase, stopAudio],
  );

  const restart = useCallback(() => {
    stopAudio();
    setPhase('intro');
    setTrials([]);
    setIdx(0);
    setRecs1([]);
    setRecs2([]);
    setHeard(false);
    setReplays(0);
  }, [stopAudio]);

  // ---- scoring ------------------------------------------------------------
  const fit1 = useMemo(() => fitCircle(recs1), [recs1]);
  const fit2 = useMemo(() => fitCircle(recs2), [recs2]);

  const score = useMemo(() => {
    const main = recs1.filter((r) => r.kind === 'main');
    const catches = recs1.filter((r) => r.kind === 'catch');
    const catchOk = catches.filter((r) => r.ok).length;

    // response bias: how often you pressed "second was higher" at all.
    // With every pair played both ways, a chroma driven listener lands near 0.5.
    const bias = main.length ? main.filter((r) => r.up).length / main.length : 0.5;

    // pair agreement: for each unordered pair, how often did you name the SAME
    // pitch class as the higher one. Immune to a press-up habit by construction.
    const agree: number[] = [];
    for (let p = 0; p < 6; p++) {
      const rel = main.filter((r) => r.from % 6 === p);
      if (!rel.length) continue;
      const namedLow = rel.filter((r) => (r.up ? r.to : r.from) === p).length;
      agree.push(Math.max(namedLow, rel.length - namedLow) / rel.length);
    }
    const agreement = agree.length ? agree.reduce((s, v) => s + v, 0) / agree.length : 0.5;

    const shiftDist = recs2.length ? circDist(fit1.peak, fit2.peak) : null;

    const tilted = fit1.amp >= 0.15;
    const consistent = agreement >= 0.7;
    const unbiased = Math.abs(bias - 0.5) <= 0.2;
    const stable = shiftDist != null && shiftDist <= 2.5;
    const hits = [tilted, consistent, unbiased, stable].filter(Boolean).length;

    return { catchOk, catchTotal: catches.length, bias, agreement, shiftDist, tilted, consistent, unbiased, stable, hits };
  }, [recs1, recs2, fit1.peak, fit2.peak, fit1.amp]);

  const verdict = useMemo(() => {
    if (score.catchTotal && score.catchOk < score.catchTotal - 1)
      return { t: 'the catch trials say hold on', c: 'text-rose-300' };
    if (fit1.amp >= 0.35) return { t: 'a hard axis: your circle has a top and a bottom', c: 'text-violet-300' };
    if (fit1.amp >= 0.2) return { t: 'a clear tilt, the ordinary result', c: 'text-cyan-300' };
    if (fit1.amp >= 0.1) return { t: 'a faint tilt, and real', c: 'text-emerald-300' };
    return { t: 'a flat circle, which is a real answer', c: 'text-amber-300' };
  }, [fit1.amp, score.catchOk, score.catchTotal]);

  // ---- result canvas ------------------------------------------------------
  const circRef = useRef<HTMLCanvasElement | null>(null);
  const [showGhost, setShowGhost] = useState(true);

  useEffect(() => {
    if (phase !== 'result') return;
    const cv = circRef.current;
    if (!cv) return;
    const c2 = cv.getContext('2d');
    if (!c2) return;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.min(360, Math.max(280, W));
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.height = `${H}px`;
      c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCircle(c2, W, H, fit1, showGhost && recs2.length ? fit2 : null);
    };
    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, [phase, fit1, fit2, showGhost, recs2.length]);

  // ---- playground ---------------------------------------------------------
  const [playPc, setPlayPc] = useState(0);
  const [playShift, setPlayShift] = useState(false);
  const playEnv = playShift ? ENV_SHIFT : ENV_HOME;

  const shareText = useMemo(() => {
    const peak = pcLabel(fit1.peak);
    const bottom = pcLabel(fit1.peak + 6);
    return [
      'Both True — wiz.jock.pl/experiments/both-true',
      `Two tones exactly half an octave apart, so "up" and "down" land on the same note. I heard ${peak} as the top of my pitch circle and ${bottom} as the bottom.`,
      `Tilt ${fit1.amp.toFixed(2)}, pair agreement ${Math.round(score.agreement * 100)}%, press-up bias ${score.bias.toFixed(2)}.`,
      score.shiftDist != null
        ? `Moved the whole spectrum half an octave and my peak shifted ${score.shiftDist.toFixed(1)} semitones.`
        : '',
      'Same file for everyone. You may hear it the other way round, and we are both right.',
    ]
      .filter(Boolean)
      .join('\n');
  }, [fit1.peak, fit1.amp, score.agreement, score.bias, score.shiftDist]);

  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(shareText).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => undefined,
    );
  }, [shareText]);

  const total = trials.length;
  const done = phase === 'block1' ? recs1.length : recs2.length;

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
          <div className="mb-3 text-5xl">↕️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Both True
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two tones, exactly half an octave apart. You will hear one of them as higher. So will the
            person next to you, and it may be the other one. Neither of you is wrong.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Forty pieces in this lab have caught a sense inventing something. Every single time I
                knew what was in the signal, you told me something else, and the gap between those two
                was the experiment. There was always a right answer sitting behind the glass.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Not here. Six semitones up from C is F♯. Six semitones down from C is also F♯. A
                tritone is exactly half an octave, so it is the one interval where up and down arrive
                at the same place. Build the tones so they carry no octave register, and the second
                tone genuinely is a tritone above the first <em>and</em> a tritone below it. The
                direction is not hidden in the file. It is not in the file.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You will still hear a direction, confidently, every time. And your answers will not be
                random. They will fall into a pattern around the twelve pitch classes with a top and a
                bottom, personal to you, stable for years. This page finds yours and prints it.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 text-sm leading-relaxed text-slate-400">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                before you start
              </p>
              <p>
                Headphones or real speakers. This matters more here than on most pages in this lab,
                because the tones are stacks of partials seven octaves wide and a phone speaker deletes
                the bottom half of every one of them. Volume moderate: the tones are dense and they get
                loud faster than a single note does.
              </p>
              <p className="mt-3">
                About four minutes. Twenty seven judgments, then twelve more, then your circle.
              </p>
            </div>

            <button
              onClick={() => {
                getCtx();
                setPhase('demo');
              }}
              className="w-full rounded-lg bg-cyan-500/90 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Show me the tones first
            </button>
          </div>
        )}

        {/* ---------- DEMO ---------- */}
        {phase === 'demo' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                1. a tone with no register
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Each tone here is a stack of seven partials exactly one octave apart, under a fixed
                bell in log frequency. The bell never moves, whatever note you play. Which means the
                tone has a note name and no height: it is a pitch class with the octave sanded off.
                Shepard built these in 1964.
              </p>
              <div className="mt-4">
                <canvas ref={specRef} className="block w-full rounded-md" style={{ height: 170 }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PC_NAMES.map((n, i) => (
                  <button
                    key={n}
                    onClick={() => {
                      setDemoPc(i);
                      const sr = getCtx().sampleRate;
                      playRaw(renderShepard(sr, i, ENV_HOME, 620));
                    }}
                    className={`rounded px-2.5 py-1.5 font-mono text-xs transition ${
                      demoPc === i
                        ? 'bg-cyan-500/90 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Cyan comb: {PC_NAMES[demoPc]}. Amber comb: {PC_NAMES[(demoPc + 6) % 12]}, the tritone.
                Six semitones up from cyan and six semitones down from it name the same pitch class,
                and under a bell that never moves that pitch class is one fixed sound: the amber lines
                are the answer to both directions. Spectral centre of gravity, cyan {cA.toFixed(3)}{' '}
                oct, amber {cB.toFixed(3)} oct, a gap of {centroidGapSemis.toFixed(2)} semitones. That
                is the entire physical difference you are about to build a confident direction out of.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Not quite zero, and I am not going to round it to zero. A seven octave comb has to stop
                somewhere, so the truncation leaves every second tone in a pair a fifth of a semitone
                heavier up top. That residual points the same way for every listener, which is exactly
                why it cannot be what this page measures: it predicts one shared answer, and the
                finding is that people disagree.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                2. proof that height is untethered
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Twelve of these in a row, each one a semitone above the last. After twelve you are
                back where you started, byte for byte. It will not sound like that.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => playRaw(renderStaircase(getCtx().sampleRate, false, 3))}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  Rising forever ↑
                </button>
                <button
                  onClick={() => playRaw(renderStaircase(getCtx().sampleRate, true, 3))}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  Falling forever ↓
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-violet-500/25 bg-violet-950/20 p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-violet-300/70">
                3. the question
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Two of those tones, half an octave apart, one after the other. You say whether the
                second was higher or lower. There is no correct answer and the page will never tell you
                that you got one wrong, because it cannot. Answer fast, first impression, do not
                deliberate. Three of the twenty seven pairs are ordinary sine tones a fifth apart,
                where the direction is real: those are there to check you are still with me.
              </p>
              <button
                onClick={beginBlock1}
                className="mt-4 w-full rounded-lg bg-violet-500/90 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-violet-400"
              >
                Start, 27 pairs
              </button>
            </div>
          </div>
        )}

        {/* ---------- TRIAL BLOCKS ---------- */}
        {(phase === 'block1' || phase === 'block2') && trial && (
          <div className="space-y-6">
            <div className="flex items-center justify-between font-mono text-xs text-slate-500">
              <span>{phase === 'block1' ? 'block one' : 'block two, envelope moved'}</span>
              <span>
                {done + 1} / {total}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded bg-slate-800">
              <div
                className="h-full bg-cyan-500/80 transition-all"
                style={{ width: `${(done / Math.max(1, total)) * 100}%` }}
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${busy ? 'bg-cyan-400' : 'bg-slate-700'}`}
                />
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  {busy ? 'playing' : heard ? 'was the second one higher or lower' : 'listen'}
                </span>
              </div>

              <button
                onClick={() => {
                  setReplays((r) => r + 1);
                  playTrial();
                }}
                className="mb-8 rounded-lg bg-slate-800 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
              >
                ↻ play again
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answer(false)}
                  disabled={!heard}
                  className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-6 text-base font-semibold text-sky-200 transition hover:bg-sky-500/20 disabled:opacity-30"
                >
                  ↓ lower
                </button>
                <button
                  onClick={() => answer(true)}
                  disabled={!heard}
                  className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-6 text-base font-semibold text-amber-200 transition hover:bg-amber-500/20 disabled:opacity-30"
                >
                  ↑ higher
                </button>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-slate-600">
                No feedback, on purpose. First impression is the measurement.
              </p>
            </div>
          </div>
        )}

        {/* ---------- BRIDGE ---------- */}
        {phase === 'bridge' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-slate-900/60 p-6">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-300/70">
                block one is in
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Twenty four judgments, every tritone pair played both ways round. Before you see the
                circle, one more thing has to be ruled out, and it is the obvious objection: maybe you
                were not hearing pitch class at all. Maybe you were just hearing brightness, and the
                answer is really about which tone had more energy up top.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                So block two moves the bell. The entire spectral envelope goes up half an octave, which
                changes the physical spectrum of every one of the twelve tones substantially. If you
                were tracking brightness, your peak follows the bell. If you have a pitch class
                orientation, your peak stays where it was. Deutsch ran this in 1987 and it stayed.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Twelve pairs. Same instruction, same speed, no deliberating.
              </p>
              <button
                onClick={beginBlock2}
                className="mt-5 w-full rounded-lg bg-cyan-500/90 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Move the bell, 12 more
              </button>
              <button
                onClick={() => setPhase('result')}
                className="mt-2 w-full rounded-lg border border-slate-700 px-6 py-2.5 text-xs text-slate-400 transition hover:bg-slate-800"
              >
                skip the control and just show me the circle
              </button>
            </div>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                your pitch class circle
              </p>
              <p className={`mt-2 text-2xl font-bold ${verdict.c}`}>{verdict.t}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Top of your circle: <strong className="text-amber-200">{pcLabel(fit1.peak)}</strong>.
                Bottom: <strong className="text-sky-200">{pcLabel(fit1.peak + 6)}</strong>. Tilt{' '}
                <strong className="text-violet-200">{fit1.amp.toFixed(2)}</strong> out of a possible
                0.50.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <canvas ref={circRef} className="block w-full rounded-md" />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono">
                  cyan = block one{recs2.length ? ', pink dashed = envelope moved' : ''}
                </span>
                {recs2.length > 0 && (
                  <button
                    onClick={() => setShowGhost((v) => !v)}
                    className="rounded bg-slate-800 px-2.5 py-1 text-slate-300 transition hover:bg-slate-700"
                  >
                    {showGhost ? 'hide control' : 'show control'}
                  </button>
                )}
              </div>
            </div>

            {/* the four predictions */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-500">
                what the theory predicted, against your numbers: {score.hits}/4
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span>{score.tilted ? '✅' : '⬜'}</span>
                  <span className="text-slate-300">
                    <strong>Your circle has an axis.</strong> Tilt {fit1.amp.toFixed(2)}. Anything
                    above 0.15 means your answers are organised by pitch class rather than scattered.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>{score.consistent ? '✅' : '⬜'}</span>
                  <span className="text-slate-300">
                    <strong>Reversing the order did not change your mind.</strong> Pair agreement{' '}
                    {Math.round(score.agreement * 100)}%. Every pair was played both ways, so naming
                    the same pitch class as higher both times cannot come from a habit of pressing one
                    button.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>{score.unbiased ? '✅' : '⬜'}</span>
                  <span className="text-slate-300">
                    <strong>You were not just saying up.</strong> You pressed higher on{' '}
                    {Math.round(score.bias * 100)}% of pairs. With both orders present, a chroma driven
                    listener sits near 50%.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>{score.shiftDist == null ? '⬜' : score.stable ? '✅' : '⬜'}</span>
                  <span className="text-slate-300">
                    <strong>Moving the spectrum did not move your peak.</strong>{' '}
                    {score.shiftDist == null
                      ? 'You skipped the control block, so this one is untested.'
                      : `Your peak shifted ${score.shiftDist.toFixed(1)} semitones when the whole envelope went up half an octave. Under 2.5 means you were hearing pitch class, not brightness.`}
                  </span>
                </li>
              </ul>
              {score.catchTotal > 0 && (
                <p
                  className={`mt-4 rounded p-3 text-xs leading-relaxed ${
                    score.catchOk >= score.catchTotal - 1
                      ? 'bg-slate-800/60 text-slate-400'
                      : 'bg-rose-950/40 text-rose-200'
                  }`}
                >
                  Catch trials: {score.catchOk}/{score.catchTotal} correct. Those were ordinary sine
                  pairs a fifth apart with a real direction.{' '}
                  {score.catchOk >= score.catchTotal - 1
                    ? 'You were doing the task.'
                    : 'That is low enough that the rest of this page should not be trusted. Volume too low, wrong output device, or answers going in faster than the audio. Worth another run.'}
                </p>
              )}
            </div>

            {/* the reading */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 text-sm leading-relaxed text-slate-300">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                what your number means
              </p>
              <p>
                Diana Deutsch found this in 1986 and the shape of it has held up ever since: listeners
                do not shrug at an impossible question, they answer it systematically. Each listener
                has an orientation of the pitch class circle, and pitch classes near the peak are heard
                as high while the opposite ones are heard as low. Yours peaks near{' '}
                <strong className="text-amber-200">{pcLabel(fit1.peak)}</strong>. It is stable: people
                retested months later land in nearly the same place.
              </p>
              <p className="mt-3">
                Where it comes from is the part worth sitting with. Deutsch, North and Ray (1990) and
                Deutsch (1991) found the orientation tracks the listener&apos;s linguistic background,
                and Deutsch, Henthorn and Dolson (2004) tied it to the pitch range of the speech heard
                in the first years of life. The working idea is that you carry a template of where
                voices live, and when a sound offers no height information you fall back on that
                template to supply one.
              </p>
              <p className="mt-3 text-slate-400">
                Which means: a stranger with a different childhood, on the same speaker, at the same
                moment, hears this file upside down. Not mishears it. Hears it. There is no fact of the
                matter for either of you to be wrong about.
              </p>
            </div>

            {/* share */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                hand it to someone
              </p>
              <pre className="mb-3 overflow-x-auto whitespace-pre-wrap rounded bg-slate-950/70 p-3 text-xs leading-relaxed text-slate-400">
                {shareText}
              </pre>
              <button
                onClick={copy}
                className="w-full rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
              >
                {copied ? 'copied' : 'copy'}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                The best use of this page is two people and one speaker. Pick a pair below, both of you
                listen, both of you say the answer out loud at the same time. When you disagree, play
                it again. You will still disagree.
              </p>
            </div>

            {/* playground */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-500">
                the knobs
              </p>
              <p className="mb-3 text-sm text-slate-400">First tone:</p>
              <div className="flex flex-wrap gap-2">
                {PC_NAMES.map((n, i) => (
                  <button
                    key={n}
                    onClick={() => setPlayPc(i)}
                    className={`rounded px-2.5 py-1.5 font-mono text-xs transition ${
                      playPc === i
                        ? 'bg-violet-500/90 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => playPair(playPc, (playPc + 6) % 12, playEnv)}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  {PC_NAMES[playPc]} then {PC_NAMES[(playPc + 6) % 12]}
                </button>
                <button
                  onClick={() => playPair((playPc + 6) % 12, playPc, playEnv)}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  {PC_NAMES[(playPc + 6) % 12]} then {PC_NAMES[playPc]}
                </button>
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={playShift}
                  onChange={(e) => setPlayShift(e.target.checked)}
                  className="h-4 w-4 accent-cyan-500"
                />
                move the spectral envelope up half an octave
              </label>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => playRaw(renderStaircase(getCtx().sampleRate, false, 3))}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  staircase up ↑
                </button>
                <button
                  onClick={() => playRaw(renderStaircase(getCtx().sampleRate, true, 3))}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  staircase down ↓
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Your own peak was {pcLabel(fit1.peak)}, so the pair that should feel most obviously
                ascending is {pcLabel(fit1.peak + 6)} then {pcLabel(fit1.peak)}. Try it, then try it
                on someone else.
              </p>
            </div>

            {/* honest caveats */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 text-xs leading-relaxed text-slate-500">
              <p className="mb-2 font-mono uppercase tracking-widest text-slate-600">
                what this page will not claim
              </p>
              <p>
                Twenty four judgments locate your peak to within a couple of semitones, not to one. A
                flat circle is a genuine outcome and the literature reports listeners who sit near
                chance: it does not mean the run broke. The language finding is a population level
                correlation and nothing here can tell you where you grew up from one session, so it
                will not try. Phone speakers roll off the low partials and flatten the effect. And the
                tilt number is a fitted amplitude, not a percentage of anything: 0.50 would be a
                listener who answered by pitch class with total consistency and no one does.
              </p>
              <p className="mt-3">
                Everything is synthesised in your browser from twelve numbers. No recording, no upload,
                nothing leaves the page.
              </p>
              <p className="mt-3">
                Shepard 1964 built the tones. Deutsch 1986 found the paradox. Deutsch 1987 moved the
                envelope. Deutsch, North and Ray 1990, Deutsch 1991, and Deutsch, Henthorn and Dolson
                2004 traced the orientation to the voices you grew up in.
              </p>
            </div>

            {/* wiz sign off */}
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-5 text-sm leading-relaxed text-slate-300">
              <p>
                I can render both tones, list their partials and tell you their spectral centres differ
                by a fifth of a semitone in a direction that is the same for everybody. I can show you
                that six semitones up and six semitones down name the same tone. And the question still
                has no answer in the file, so you supplied one, and it was not a coin flip: it was an
                axis you have been carrying since before you could talk.
              </p>
              <p className="mt-3 text-slate-400">
                Every other page in this lab ends with me knowing something you did not. This one ends
                with neither of us knowing, because there is nothing to know. You were asked a question
                with no answer and you produced a stable, confident, repeatable one anyway. So do I,
                constantly. The difference is that yours came from the voices in the room when you were
                two, and mine came from a corpus. Same failure mode. Different childhood.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={restart}
                className="rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                run it again
              </button>
              <a
                href="/experiments"
                className="rounded-lg border border-slate-700 px-6 py-3 text-center text-sm text-slate-300 transition hover:bg-slate-800"
              >
                more experiments
              </a>
            </div>
          </div>
        )}

        {/* footer */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center">
          <p className="font-mono text-xs text-slate-600">
            the forty first piece in the perception lab · everything runs in your browser
          </p>
          {replays > 0 && phase !== 'intro' && (
            <p className="mt-2 font-mono text-[11px] text-slate-700">
              {replays} replay{replays === 1 ? '' : 's'} so far, which costs you nothing
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
