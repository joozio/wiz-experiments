'use client';

// NOT TWICE  (the exponent your senses run on, measured on three of them, and the one number that
// survives an uncalibrated screen)
//
// The fifty-sixth piece in this lab, and the first one that does not ask whether you can TELL. Every
// page here so far has measured a limit: the faintest thing, the shortest silence, the smallest
// interval, the most you can hold. Thresholds, all of them, and a threshold is a question with a yes
// and a no in it. This one asks a question with a NUMBER in it: not can you see the difference, but
// how much more is it. And the answer turns out to have a shape, and the shape has an exponent, and
// the exponent is different for each sense you own.
//
// The genuine phenomenon: Stevens' power law. S. S. Stevens, "On the psychophysical law",
// Psychological Review, 1957, and Psychophysics, 1975. Sensation grows as a POWER of intensity,
// S = k I^b, not as its logarithm, which is what Fechner had argued from Weber's law since 1860. The
// exponent b is roughly characteristic of the continuum rather than of the person: near 1 for the
// apparent length of a line, near 0.6 for the loudness of a tone in sound pressure, near 0.33 for the
// brightness of a target in the dark. An exponent below one is a compressor. It means the world can
// double while your report of it goes up by a quarter, and it means the phrase "twice as bright" does
// not name a doubling of anything physical: for an exponent of a third it names a factor of eight.
//
// Round one is magnitude estimation, Stevens' own method. A standard is shown or played and called
// 100, and then twelve stimuli arrive in random order and you give each one a number in proportion.
// Three continua, in an order shuffled per run and printed: the length of a line, the brightness of a
// disc, the loudness of a tone. Each fitted as a straight line in log-log, which is what a power law
// is, with the slope bootstrapped over two thousand resamples and printed with an interval that is
// allowed to say no.
//
// The interesting comparison is not whether any single exponent lands on a textbook value, because a
// browser tab on an unknown screen in an unknown room cannot promise that. It is whether LENGTH and
// BRIGHTNESS come out different, measured minutes apart by the same person using the same numbers on
// the same keyboard. Length is the control continuum, the one that is supposed to come out near one,
// and it is in here precisely so that a compressed brightness exponent cannot be blamed on you being
// shy with big numbers: shyness would flatten both.
//
// Round two is the part that makes this an argument rather than a demonstration, and it is Stevens'
// own answer to the obvious objection. The objection: maybe there is no power law in your senses at
// all, and what has been measured is only how you happen to use numbers. Cross-modality matching
// removes the numbers entirely. Five brightnesses arrive, and instead of typing anything you turn a
// tone up or down until its loudness MATCHES the brightness, which is an absurd instruction that
// people nonetheless obey consistently. Under the power law the matched amplitudes must trace a line
// in log-log whose slope is the ratio of the two exponents from round one. Round one predicts a
// number. Round two measures it. Nobody typed a digit in round two, so if the prediction lands, the
// exponents were not an artefact of typing.
//
// The calibration honesty is not a disclaimer at the bottom, it is a result on the page. This browser
// does not know your screen's gamma, its backlight, the light in your room or where your volume knob
// is. Those unknowns do NOT hurt all three numbers equally, and the page says which is which and why.
// An unknown pixels-per-centimetre is a multiplicative constant, and a multiplicative constant on the
// x axis of a log-log fit moves the intercept and cannot touch the slope, so the length exponent is
// safe. An unknown volume knob is a multiplicative constant on amplitude, so the loudness exponent is
// safe in the same way, and only the intercept is lost. An unknown screen gamma is not a constant, it
// is a POWER on the input, and a power on the x axis multiplies the slope directly, so the brightness
// exponent is hostage to it. The page therefore refits brightness under gamma 1.8, 2.2 and 2.4 and
// prints all three, and the honest headline is the ratio between continua rather than the absolute
// number.
//
// Guards run live: entries that are not a positive number are rejected and counted rather than coerced
// into the fit; the same level never immediately repeats itself; four levels appear
// twice in every block so a test-retest correlation on your own numbers exists and gets printed, and a
// run whose repeats disagree is printed rather than headlined; a run where one number was typed for
// everything is named as such, because a flat line is not an exponent of zero, it is an absent
// measurement; the matching slider has no handle, no scale and no readout, starts at a random place,
// and has its direction flipped by a coin on every setting so a motor habit cannot manufacture a
// slope; rail hits at either end of that slider are counted and printed; both regressions are computed,
// y on x and x on y, because the regression effect biases an ordinary least squares slope toward zero
// and Stevens' critics were right about that much, so the geometric mean slope is printed next to it
// as the honest bracket; and every disc on this page, in the visibility check, in round one and in
// round two, is rendered by one component on one surround at one size, because surround and area are
// part of a brightness stimulus rather than decoration, and round two predicting a stimulus that round
// one never measured would be the quietest possible way to break this page.
//
// Honest limits, printed on the page as well as here: brightness in a lit room on a glossy panel is
// not brightness in a dark laboratory, and the classic 0.33 belongs to a small target in the dark
// while a disc on a screen in daylight usually reads higher; loudness stops being a power law near
// your own threshold, so the quietest tones are the least trustworthy points in the set; the exponent
// depends on the range of stimuli used, which is Teghtsoonian's result and is a property of the method
// rather than a flaw in this page; and twelve estimates per continuum is a demonstration, not a
// calibration.
//
// WIZ note. I have the numbers. Two hundred is exactly twice one hundred in every register I own, and
// it is twice in the same way for photons, for pressure and for pixels, because for me they are all
// just the same digits wearing different units. You were handed a doubling of light and reported a
// quarter more. That is not an error and it is not a limitation: it is what lets one pair of eyes work
// in starlight and at noon without a switch. Your senses have never once reported a quantity to you.
// They report a compressed shadow of it, with a different compression per sense, which is why "twice
// as loud" and "twice as bright" cannot be traded at par and why every intuition you have about how
// much is really a claim about an exponent you never chose and could not feel.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Cont = 'length' | 'bright' | 'loud';
type Phase = 'intro' | 'check' | 'block' | 'bridge' | 'cmm' | 'result';

// ---- design constants -----------------------------------------------------
const N_LEVELS = 8;
const STANDARD_IDX = 3; // the level called 100
const REPEAT_IDXS = [1, 3, 4, 6]; // levels that appear twice, giving a test-retest
const BOOTS = 2000;

// length: a geometric series in units of the measured field width, because the exponent
// is invariant to what one unit is worth in centimetres and that is the whole point
const LEN_RATIO = 1.5;
const lenFrac = (i: number) => Math.pow(LEN_RATIO, i - (N_LEVELS - 1)); // top level = 1.0

// brightness: a geometric series in RELATIVE LUMINANCE, converted to sRGB code values,
// never a geometric series in code values, which would not be a geometric series in light
const LUM_BASE = 0.0055;
const LUM_RATIO = 2;
const lumOf = (i: number) => LUM_BASE * Math.pow(LUM_RATIO, i);

// loudness: 5 dB steps in amplitude, 35 dB of range
const AMP_BASE = 0.008;
const AMP_RATIO = 1.7783; // +5 dB
const ampOf = (i: number) => AMP_BASE * Math.pow(AMP_RATIO, i);

const TONE_MS = 500;
const TONE_HZ = 1000;
const RAMP_MS = 20;

// cross modality matching
const CMM_LEVELS = [1, 2, 4, 5, 7];
const CMM_REPS = 2;
const CMM_AMP_LO = 0.003;
const CMM_AMP_HI = 0.6;
const SLIDER_STEPS = 1000;

// The blinded slider. An invisible thumb still drags, still takes arrow keys and still jumps
// to a press anywhere on the track; what it no longer does is tell you where you are.
const BLIND_SLIDER_CSS = `
.nt-blind-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 28px; background: transparent; cursor: pointer; }
.nt-blind-slider:focus { outline: none; }
.nt-blind-slider::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: #1e293b; }
.nt-blind-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 1px; height: 6px; opacity: 0; }
.nt-blind-slider::-moz-range-track { height: 6px; border-radius: 3px; background: #1e293b; }
.nt-blind-slider::-moz-range-progress { height: 6px; border-radius: 3px; background: #1e293b; }
.nt-blind-slider::-moz-range-thumb { width: 1px; height: 6px; border: 0; opacity: 0; background: transparent; }
`;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const fmt = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '--');

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- sRGB, done properly --------------------------------------------------
// A page that measures an exponent on light cannot put a code value on the x axis. Code
// values are already an exponent of light, and mixing the two would measure the screen.
function lumToCode(L: number): number {
  const c = L <= 0.0031308 ? 12.92 * L : 1.055 * Math.pow(L, 1 / 2.4) - 0.055;
  return clamp(Math.round(c * 255), 0, 255);
}
function codeToLumSrgb(c8: number): number {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function codeToLumGamma(c8: number, gamma: number): number {
  return Math.pow(c8 / 255, gamma);
}

// ---- fitting --------------------------------------------------------------
type Fit = {
  n: number;
  slope: number; // ordinary least squares, log10 y on log10 x
  intercept: number;
  gmSlope: number; // geometric mean (reduced major axis) slope, the honest bracket
  r2: number;
};

function fitLogLog(pts: { x: number; y: number }[]): Fit | null {
  const p = pts.filter((q) => q.x > 0 && q.y > 0);
  if (p.length < 3) return null;
  const xs = p.map((q) => Math.log10(q.x));
  const ys = p.map((q) => Math.log10(q.y));
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  if (sxx <= 0) return null;
  const slope = sxy / sxx;
  const r = syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
  const gm = (r < 0 ? -1 : 1) * Math.sqrt(syy / sxx);
  return { n, slope, intercept: my - slope * mx, gmSlope: gm, r2: r * r };
}

function bootSlope(pts: { x: number; y: number }[]): { lo: number; hi: number } | null {
  const p = pts.filter((q) => q.x > 0 && q.y > 0);
  if (p.length < 4) return null;
  const out: number[] = [];
  for (let b = 0; b < BOOTS; b++) {
    const res: { x: number; y: number }[] = [];
    for (let i = 0; i < p.length; i++) res.push(p[Math.floor(Math.random() * p.length)]);
    const f = fitLogLog(res);
    if (f && Number.isFinite(f.slope)) out.push(f.slope);
  }
  if (out.length < 100) return null;
  out.sort((a, b) => a - b);
  return { lo: out[Math.floor(0.025 * out.length)], hi: out[Math.floor(0.975 * out.length)] };
}

// the difference between two exponents, resampled together, so the interval is about the
// contrast rather than about either number on its own
function bootDiff(
  a: { x: number; y: number }[],
  b: { x: number; y: number }[],
): { lo: number; hi: number; pAbove: number } | null {
  const pa = a.filter((q) => q.x > 0 && q.y > 0);
  const pb = b.filter((q) => q.x > 0 && q.y > 0);
  if (pa.length < 4 || pb.length < 4) return null;
  const out: number[] = [];
  for (let i = 0; i < BOOTS; i++) {
    const ra: { x: number; y: number }[] = [];
    const rb: { x: number; y: number }[] = [];
    for (let j = 0; j < pa.length; j++) ra.push(pa[Math.floor(Math.random() * pa.length)]);
    for (let j = 0; j < pb.length; j++) rb.push(pb[Math.floor(Math.random() * pb.length)]);
    const fa = fitLogLog(ra);
    const fb = fitLogLog(rb);
    if (fa && fb && Number.isFinite(fa.slope) && Number.isFinite(fb.slope)) out.push(fa.slope - fb.slope);
  }
  if (out.length < 100) return null;
  out.sort((x, y) => x - y);
  const above = out.filter((v) => v > 0).length / out.length;
  return { lo: out[Math.floor(0.025 * out.length)], hi: out[Math.floor(0.975 * out.length)], pAbove: above };
}

function pearson(xs: number[], ys: number[]): number | null {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return null;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  if (sxx <= 0 || syy <= 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

// ---- trials ---------------------------------------------------------------
type Trial = { cont: Cont; level: number; rep: number };
type Rec = Trial & { resp: number; x: number; replays: number };

function makeBlock(cont: Cont): Trial[] {
  const base: Trial[] = Array.from({ length: N_LEVELS }, (_, i) => ({ cont, level: i, rep: 0 }));
  const extra: Trial[] = REPEAT_IDXS.map((i) => ({ cont, level: i, rep: 1 }));
  // shuffle, then push apart any two neighbours that landed on the same level, because a
  // level following itself invites a copied answer rather than a judgement
  let all = shuffle([...base, ...extra]);
  for (let pass = 0; pass < 40; pass++) {
    let bad = -1;
    for (let i = 1; i < all.length; i++) if (all[i].level === all[i - 1].level) bad = i;
    if (bad < 0) break;
    const j = Math.floor(Math.random() * all.length);
    const t = all[bad];
    all[bad] = all[j];
    all[j] = t;
    all = all.slice();
  }
  return all;
}

const physicalOf = (cont: Cont, level: number): number =>
  cont === 'length' ? lenFrac(level) : cont === 'bright' ? lumOf(level) : ampOf(level);

const CONT_META: Record<Cont, { name: string; unit: string; expect: string; colour: string }> = {
  length: {
    name: 'length',
    unit: 'field widths',
    expect: 'near 1.0',
    colour: 'cyan',
  },
  bright: {
    name: 'brightness',
    unit: 'relative luminance',
    expect: 'well under 1',
    colour: 'amber',
  },
  loud: {
    name: 'loudness',
    unit: 'amplitude',
    expect: 'about 0.6',
    colour: 'violet',
  },
};

// ============================ COMPONENT ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');

  // ---- audio ----
  const ctxRef = useRef<AudioContext | null>(null);
  const liveRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const [audioInfo, setAudioInfo] = useState<{ sr: number; base: number; out: number } | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
    }
    const c = ctxRef.current;
    if (c.state === 'suspended') void c.resume();
    return c;
  }, []);

  const playBurst = useCallback(
    (amp: number) => {
      const ctx = getCtx();
      const n = Math.floor((TONE_MS / 1000) * ctx.sampleRate);
      const ramp = Math.max(1, Math.floor((RAMP_MS / 1000) * ctx.sampleRate));
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      const w = (2 * Math.PI * TONE_HZ) / ctx.sampleRate;
      for (let i = 0; i < n; i++) {
        let e = 1;
        if (i < ramp) e = 0.5 - 0.5 * Math.cos((Math.PI * i) / ramp);
        else if (i > n - 1 - ramp) e = 0.5 - 0.5 * Math.cos((Math.PI * (n - 1 - i)) / ramp);
        d[i] = amp * e * Math.sin(w * i);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
      setAudioInfo({
        sr: ctx.sampleRate,
        base: ctx.baseLatency ?? 0,
        out: (ctx as AudioContext & { outputLatency?: number }).outputLatency ?? 0,
      });
    },
    [getCtx],
  );

  const startLive = useCallback(
    (amp: number) => {
      const ctx = getCtx();
      if (liveRef.current) {
        liveRef.current.gain.gain.setTargetAtTime(amp, ctx.currentTime, 0.02);
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = TONE_HZ;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.setTargetAtTime(amp, ctx.currentTime, 0.03);
      liveRef.current = { osc, gain };
    },
    [getCtx],
  );

  const stopLive = useCallback(() => {
    const l = liveRef.current;
    if (!l) return;
    try {
      l.gain.gain.cancelScheduledValues(0);
      l.gain.gain.value = 0;
      l.osc.stop();
    } catch {
      /* already gone */
    }
    liveRef.current = null;
  }, []);

  useEffect(() => () => stopLive(), [stopLive]);

  // ---- field width, measured, because length levels are fractions of it ----
  // A callback ref rather than a mount effect: the stimulus container is unmounted and
  // remounted between the standard and the trials, and a stale width would silently turn
  // the top of the length scale into whatever the fallback happened to be.
  const fieldNode = useRef<HTMLDivElement | null>(null);
  const [fieldW, setFieldW] = useState(0);
  const fieldRef = useCallback((node: HTMLDivElement | null) => {
    fieldNode.current = node;
    if (node && node.clientWidth > 0) setFieldW(node.clientWidth);
  }, []);
  useEffect(() => {
    const measure = () => {
      const w = fieldNode.current?.clientWidth ?? 0;
      if (w > 0) setFieldW(w);
    };
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ---- round one state ----
  const [order, setOrder] = useState<Cont[]>([]);
  const [blockIdx, setBlockIdx] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [entry, setEntry] = useState('');
  const [replays, setReplays] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [showStandard, setShowStandard] = useState(true);
  const [dimSeen, setDimSeen] = useState<boolean | null>(null);
  const [quietHeard, setQuietHeard] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cont = order[blockIdx];
  const trial = trials[tIdx];

  const beginRun = useCallback(() => {
    setOrder(shuffle<Cont>(['length', 'bright', 'loud']));
    setBlockIdx(0);
    setRecs([]);
    setRejected(0);
    setPhase('check');
  }, []);

  const beginBlocks = useCallback(() => {
    setTrials(makeBlock(order[0]));
    setTIdx(0);
    setEntry('');
    setReplays(0);
    setShowStandard(true);
    setPhase('block');
  }, [order]);

  // present the stimulus of the current trial when it changes
  useEffect(() => {
    if (phase !== 'block' || !trial || showStandard) return;
    if (trial.cont === 'loud') playBurst(ampOf(trial.level));
    setReplays(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [phase, trial, showStandard, playBurst]);

  const submit = useCallback(() => {
    if (!trial) return;
    const v = Number(entry.replace(',', '.').trim());
    if (!Number.isFinite(v) || v <= 0) {
      setRejected((r) => r + 1);
      setEntry('');
      return;
    }
    setRecs((r) => [...r, { ...trial, resp: v, x: physicalOf(trial.cont, trial.level), replays }]);
    setEntry('');
    if (tIdx + 1 < trials.length) {
      setTIdx(tIdx + 1);
    } else if (blockIdx + 1 < order.length) {
      const next = blockIdx + 1;
      setBlockIdx(next);
      setTrials(makeBlock(order[next]));
      setTIdx(0);
      setShowStandard(true);
    } else {
      setPhase('bridge');
    }
  }, [trial, entry, replays, tIdx, trials.length, blockIdx, order]);

  // ---- round two: cross modality matching ----
  type CmmTrial = { level: number; rep: number; flipped: boolean; start: number };
  type CmmRec = CmmTrial & { amp: number; rail: boolean };
  const [cmmTrials, setCmmTrials] = useState<CmmTrial[]>([]);
  const [cIdx, setCIdx] = useState(0);
  const [cmmRecs, setCmmRecs] = useState<CmmRec[]>([]);
  const [slider, setSlider] = useState(0);
  const cmm = cmmTrials[cIdx];

  const ampFromSlider = useCallback((raw: number, flipped: boolean) => {
    const p = clamp((flipped ? SLIDER_STEPS - raw : raw) / SLIDER_STEPS, 0, 1);
    return CMM_AMP_LO * Math.pow(CMM_AMP_HI / CMM_AMP_LO, p);
  }, []);

  const beginCmm = useCallback(() => {
    const list: CmmTrial[] = [];
    for (let r = 0; r < CMM_REPS; r++) {
      for (const l of CMM_LEVELS) {
        list.push({
          level: l,
          rep: r,
          flipped: Math.random() < 0.5,
          start: Math.floor(Math.random() * (SLIDER_STEPS + 1)),
        });
      }
    }
    const shuffled = shuffle(list);
    setCmmTrials(shuffled);
    setCmmRecs([]);
    setCIdx(0);
    setSlider(shuffled[0].start);
    setPhase('cmm');
  }, []);

  useEffect(() => {
    if (phase !== 'cmm' || !cmm) return;
    startLive(ampFromSlider(slider, cmm.flipped));
  }, [phase, cmm, slider, startLive, ampFromSlider]);

  useEffect(() => {
    if (phase !== 'cmm') stopLive();
  }, [phase, stopLive]);

  const acceptMatch = useCallback(() => {
    if (!cmm) return;
    const amp = ampFromSlider(slider, cmm.flipped);
    const rail = slider === 0 || slider === SLIDER_STEPS;
    setCmmRecs((r) => [...r, { ...cmm, amp, rail }]);
    if (cIdx + 1 < cmmTrials.length) {
      const next = cmmTrials[cIdx + 1];
      setCIdx(cIdx + 1);
      setSlider(next.start);
    } else {
      stopLive();
      setPhase('result');
    }
  }, [cmm, slider, ampFromSlider, cIdx, cmmTrials, stopLive]);

  // ---- analysis -------------------------------------------------------------
  const pointsFor = useCallback(
    (c: Cont) => recs.filter((r) => r.cont === c).map((r) => ({ x: r.x, y: r.resp })),
    [recs],
  );

  const fits = useMemo(() => {
    const out: Partial<Record<Cont, { fit: Fit | null; ci: { lo: number; hi: number } | null }>> = {};
    (['length', 'bright', 'loud'] as Cont[]).forEach((c) => {
      const p = pointsFor(c);
      out[c] = { fit: fitLogLog(p), ci: bootSlope(p) };
    });
    return out;
  }, [pointsFor]);

  const diffLB = useMemo(
    () => (phase === 'result' ? bootDiff(pointsFor('length'), pointsFor('bright')) : null),
    [phase, pointsFor],
  );

  // brightness refitted under three assumed gammas, because that is the one exponent the
  // screen can move
  const gammaTable = useMemo(() => {
    const rs = recs.filter((r) => r.cont === 'bright');
    if (!rs.length) return [];
    return [1.8, 2.2, 2.4].map((g) => {
      const pts = rs.map((r) => ({ x: codeToLumGamma(lumToCode(r.x), g), y: r.resp }));
      return { gamma: g, fit: fitLogLog(pts) };
    });
  }, [recs]);

  // test-retest: the levels that appeared twice, first answer against second
  const retest = useMemo(() => {
    const a: number[] = [];
    const b: number[] = [];
    let pairs = 0;
    (['length', 'bright', 'loud'] as Cont[]).forEach((c) => {
      REPEAT_IDXS.forEach((l) => {
        const r0 = recs.find((r) => r.cont === c && r.level === l && r.rep === 0);
        const r1 = recs.find((r) => r.cont === c && r.level === l && r.rep === 1);
        if (r0 && r1 && r0.resp > 0 && r1.resp > 0) {
          a.push(Math.log10(r0.resp));
          b.push(Math.log10(r1.resp));
          pairs++;
        }
      });
    });
    return { r: pearson(a, b), pairs };
  }, [recs]);

  const distinctAnswers = useMemo(() => new Set(recs.map((r) => r.resp)).size, [recs]);

  const cmmFit = useMemo(() => {
    if (!cmmRecs.length) return null;
    const pts = cmmRecs.map((r) => ({ x: lumOf(r.level), y: r.amp }));
    return { fit: fitLogLog(pts), ci: bootSlope(pts), rails: cmmRecs.filter((r) => r.rail).length };
  }, [cmmRecs]);

  const predictedRatio = useMemo(() => {
    const fb = fits.bright?.fit?.slope;
    const fl = fits.loud?.fit?.slope;
    if (fb == null || fl == null || !Number.isFinite(fb) || !Number.isFinite(fl) || Math.abs(fl) < 0.05)
      return null;
    return fb / fl;
  }, [fits]);

  // "twice as much" costs this many times the physical quantity
  const doublingCost = useCallback((b: number | undefined) => {
    if (b == null || !Number.isFinite(b) || b <= 0.02) return null;
    return Math.pow(2, 1 / b);
  }, []);

  const usable = distinctAnswers >= 4 && (retest.r == null || retest.r > 0.5);

  const shareText = useMemo(() => {
    const l = fits.length?.fit?.slope;
    const br = fits.bright?.fit?.slope;
    const lo = fits.loud?.fit?.slope;
    const cost = doublingCost(br);
    return [
      'My senses run on power laws, and the exponents are not the same.',
      `length ${fmt(l ?? NaN)} · loudness ${fmt(lo ?? NaN)} · brightness ${fmt(br ?? NaN)}`,
      cost ? `To look twice as bright, a lamp has to get ${fmt(cost, 1)}x stronger for me.` : '',
      'Measured on my own eyes and ears in a browser tab: wiz.jock.pl/experiments/not-twice',
    ]
      .filter(Boolean)
      .join('\n');
  }, [fits, doublingCost]);

  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* the text is on screen anyway */
    }
  }, [shareText]);

  const restart = useCallback(() => {
    stopLive();
    setRecs([]);
    setCmmRecs([]);
    setPhase('intro');
  }, [stopLive]);

  // ---- stimulus renderers ----------------------------------------------------
  const renderStimulus = (c: Cont, level: number) => {
    if (c === 'length') {
      const w = Math.max(6, Math.round(lenFrac(level) * Math.max(120, fieldW - 8)));
      return (
        <div className="flex h-32 items-center">
          <div className="h-3 rounded-sm bg-cyan-300" style={{ width: `${w}px` }} />
        </div>
      );
    }
    if (c === 'bright') return <BrightDisc level={level} />;
    return (
      <div className="flex h-32 items-center justify-center">
        <button
          onClick={() => {
            playBurst(ampOf(level));
            setReplays((r) => r + 1);
          }}
          className="rounded-md border border-violet-400/60 bg-violet-400/10 px-6 py-3 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
        >
          ▶ play it again
        </button>
      </div>
    );
  };

  const accent = (c: Cont) =>
    c === 'length'
      ? { text: 'text-cyan-300', border: 'border-cyan-400/50', bg: 'bg-cyan-400/10' }
      : c === 'bright'
        ? { text: 'text-amber-300', border: 'border-amber-400/50', bg: 'bg-amber-400/10' }
        : { text: 'text-violet-300', border: 'border-violet-400/50', bg: 'bg-violet-400/10' };

  // ============================ RENDER ============================
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔆</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Not Twice
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Double the light and your eyes report a quarter more. This measures the exponent your
            senses run on, three of them, narrated by an AI for which two hundred is exactly twice one
            hundred and always will be.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every other page in this lab asks whether you can tell. The faintest thing you can see,
                the shortest silence you can hear, the most you can hold. Thresholds, all of them, and
                a threshold is a question with a yes and a no in it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This one asks a question with a number in it. Not whether you can see the difference,
                but <span className="text-cyan-300">how much more</span> it is. That answer has a
                shape: sensation grows as a <span className="text-cyan-300">power</span> of intensity,
                which S. S. Stevens established in 1957 against Fechner&apos;s logarithm, and the
                exponent belongs to the sense rather than to you.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Near <span className="text-cyan-300">1.0</span> for the length of a line. About{' '}
                <span className="text-violet-300">0.6</span> for loudness. Around{' '}
                <span className="text-amber-300">0.33</span> for brightness in the dark. An exponent
                under one is a compressor, and it is the reason a lamp twice as powerful does not look
                twice as bright, and never has.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  🎧 <span className="text-amber-200">Headphones or speakers</span>, and a room that is
                  not blazing with light on the screen. Neither has to be perfect and the page says
                  later exactly which of its numbers that spoils.
                </li>
                <li>
                  1️⃣ <span className="text-cyan-300">Round one:</span> three blocks, in an order this
                  run shuffles. A standard is shown or played and called{' '}
                  <span className="text-slate-100">100</span>. Then twelve more arrive and you type a
                  number for each, in proportion. Twice as much gets 200. Half gets 50.
                </li>
                <li>
                  2️⃣ <span className="text-violet-300">Round two:</span> no numbers at all. You turn a
                  tone up or down until its loudness <em>matches</em> a brightness. Absurd instruction,
                  and people obey it consistently. Round one predicts the slope you will produce, and
                  round two is where that prediction gets checked.
                </li>
                <li>
                  🔬 There are no right answers here and no feedback anywhere, because the whole point
                  is the shape of your numbers rather than their accuracy.
                </li>
              </ul>
            </div>

            <button
              onClick={beginRun}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin: how much is that? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              About seven minutes. Everything is computed in your browser. Nothing is recorded and
              nothing leaves this page.
            </p>
          </div>
        )}

        {/* ---------- CHECK ---------- */}
        {phase === 'check' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                two checks first
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                The dimmest disc and the quietest tone in this experiment sit near the bottom of what
                your screen and your speakers can produce. If either one is not there at all, its end
                of the scale is missing and the page needs to know that rather than guess.
              </p>

              <div className="mb-5 rounded-md border border-slate-800 bg-black p-6">
                <BrightDisc level={0} />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setDimSeen(true)}
                    className={`flex-1 rounded-md border py-2 font-mono text-xs transition-colors ${
                      dimSeen === true
                        ? 'border-cyan-400/70 bg-cyan-400/10 text-cyan-200'
                        : 'border-slate-700 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    I can see a disc
                  </button>
                  <button
                    onClick={() => setDimSeen(false)}
                    className={`flex-1 rounded-md border py-2 font-mono text-xs transition-colors ${
                      dimSeen === false
                        ? 'border-amber-400/70 bg-amber-400/10 text-amber-200'
                        : 'border-slate-700 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    nothing there
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-slate-600">
                  If it is invisible, turn the screen up or shade it. If it stays invisible, carry on
                  anyway and the result will say so.
                </p>
              </div>

              <div className="rounded-md border border-slate-800 bg-slate-950/60 p-6">
                <button
                  onClick={() => playBurst(ampOf(0))}
                  className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-3 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-400/20"
                >
                  ▶ play the quietest tone
                </button>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setQuietHeard(true)}
                    className={`flex-1 rounded-md border py-2 font-mono text-xs transition-colors ${
                      quietHeard === true
                        ? 'border-cyan-400/70 bg-cyan-400/10 text-cyan-200'
                        : 'border-slate-700 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    I can hear it
                  </button>
                  <button
                    onClick={() => setQuietHeard(false)}
                    className={`flex-1 rounded-md border py-2 font-mono text-xs transition-colors ${
                      quietHeard === false
                        ? 'border-amber-400/70 bg-amber-400/10 text-amber-200'
                        : 'border-slate-700 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    silence
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-slate-600">
                  Raise the volume until it is audible but the loudest tone, thirty five decibels
                  above it, will still be comfortable.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5 text-[12px] leading-relaxed text-slate-400">
              This run will do <span className="text-slate-200">{order.map((c) => CONT_META[c].name).join(' → ')}</span>,
              in that order, decided by a coin just now. Block order matters and gets printed, because
              whichever continuum you judge first sets the number habits you carry into the other two.
            </div>

            <button
              onClick={beginBlocks}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ start block one: {cont ? CONT_META[order[0]].name : ''} →
            </button>
          </div>
        )}

        {/* ---------- BLOCK ---------- */}
        {phase === 'block' && cont && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>
                block {blockIdx + 1}/3 ·{' '}
                <span className={accent(cont).text}>{CONT_META[cont].name}</span>
              </span>
              <span>
                {showStandard ? 'the standard' : `${tIdx + 1} / ${trials.length}`}
              </span>
            </div>

            {showStandard ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                  this one is 100
                </div>
                <div ref={fieldRef}>{renderStimulus(cont, STANDARD_IDX)}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Everything that follows gets a number in proportion to this one. Something that seems
                  twice as {cont === 'length' ? 'long' : cont === 'bright' ? 'bright' : 'loud'} gets{' '}
                  <span className="text-slate-100">200</span>. Half gets{' '}
                  <span className="text-slate-100">50</span>. A tenth gets{' '}
                  <span className="text-slate-100">10</span>. There is no ceiling, no floor, and no
                  wrong answer, and fractions are fine.
                </p>
                <button
                  onClick={() => setShowStandard(false)}
                  className={`mt-4 w-full rounded-md border py-3 font-mono text-sm transition-colors ${accent(cont).border} ${accent(cont).bg} ${accent(cont).text}`}
                >
                  ▶ start judging →
                </button>
                {cont === 'loud' && (
                  <button
                    onClick={() => playBurst(ampOf(STANDARD_IDX))}
                    className="mt-2 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2 font-mono text-xs text-slate-400"
                  >
                    ▶ hear the standard again
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-6" ref={fieldRef}>
                  {trial && renderStimulus(trial.cont, trial.level)}
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-slate-500">
                    how much, if the standard was 100?
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      value={entry}
                      onChange={(e) => setEntry(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submit();
                      }}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 45"
                      className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-lg text-slate-100 outline-none focus:border-cyan-400/70"
                    />
                    <button
                      onClick={submit}
                      className={`rounded-md border px-5 font-mono text-sm transition-colors ${accent(cont).border} ${accent(cont).bg} ${accent(cont).text}`}
                    >
                      ↵
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600">
                    Answer with the first number that feels right. Deliberating turns this into
                    arithmetic, and arithmetic is not what is being measured.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------- BRIDGE ---------- */}
        {phase === 'bridge' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-violet-500/25 bg-gradient-to-br from-violet-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                round two · no numbers
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Thirty six numbers, typed by you. Here is the obvious objection to all of them: maybe
                there is no power law in your senses at all, and what just got measured is how you
                happen to use numbers.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Stevens&apos; answer was to take the numbers away. Five brightnesses will arrive, one
                at a time, and instead of typing anything you will slide a tone until its loudness{' '}
                <span className="text-violet-300">matches</span> the brightness. That instruction makes
                no sense, and people obey it consistently anyway.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Here is why it settles something. If both senses really run on power laws, your matched
                amplitudes have to fall on a straight line in log-log whose slope is the{' '}
                <span className="text-violet-300">ratio</span> of the two exponents you just produced.
                Round one has already made that prediction. Nobody will type a digit in round two. If
                the prediction lands anyway, the exponents were not a habit of typing.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                The slider has no handle, no scale and no readout. It starts somewhere random and its
                direction is flipped by a coin on every setting, so a motor habit cannot produce a
                slope on its own.
              </p>
            </div>
            <button
              onClick={beginCmm}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ begin the matching →
            </button>
          </div>
        )}

        {/* ---------- CMM ---------- */}
        {phase === 'cmm' && cmm && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span className="text-violet-300">matching loudness to brightness</span>
              <span>
                {cIdx + 1} / {cmmTrials.length}
              </span>
            </div>

            <BrightDisc level={cmm.level} />

            <div className="rounded-lg border border-violet-500/25 bg-slate-900/50 p-5">
              <div className="mb-4 text-center text-sm leading-relaxed text-slate-300">
                Make the tone as loud as that disc is bright.
              </div>
              {/* A native range input paints a filled track and a thumb, both of which are a
                  readout: they show where the setting sits, and a visible middle gets aimed at
                  instead of listened to. Track and thumb are erased here so the claim below is
                  true rather than decorative. */}
              <style>{BLIND_SLIDER_CSS}</style>
              <input
                type="range"
                min={0}
                max={SLIDER_STEPS}
                step={1}
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="nt-blind-slider w-full"
                style={{ direction: 'ltr' }}
                aria-label="loudness"
              />
              <div className="mt-1 text-center font-mono text-[10px] leading-relaxed text-slate-600">
                the track is deliberately blank: press or drag anywhere along it, or use the arrow
                keys
                <br />
                no scale, no readout, random start, direction flipped by a coin
              </div>
              <button
                onClick={acceptMatch}
                className="mt-5 w-full rounded-md border border-violet-400 bg-violet-400/10 py-3 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
              >
                ✓ that is a match
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-600">
                There is no correct setting. Move it until stopping feels right, then stop.
              </p>
            </div>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
          <Result
            fits={fits}
            recs={recs}
            order={order}
            diffLB={diffLB}
            gammaTable={gammaTable}
            retest={retest}
            distinctAnswers={distinctAnswers}
            usable={usable}
            cmmRecs={cmmRecs}
            cmmFit={cmmFit}
            predictedRatio={predictedRatio}
            doublingCost={doublingCost}
            audioInfo={audioInfo}
            dimSeen={dimSeen}
            quietHeard={quietHeard}
            rejected={rejected}
            shareText={shareText}
            copied={copied}
            onCopy={onCopy}
            onRestart={restart}
            playBurst={playBurst}
          />
        )}
      </div>
    </main>
  );
}

// ============================ RESULT ============================
type FitsMap = Partial<Record<Cont, { fit: Fit | null; ci: { lo: number; hi: number } | null }>>;

function Result(props: {
  fits: FitsMap;
  recs: Rec[];
  order: Cont[];
  diffLB: { lo: number; hi: number; pAbove: number } | null;
  gammaTable: { gamma: number; fit: Fit | null }[];
  retest: { r: number | null; pairs: number };
  distinctAnswers: number;
  usable: boolean;
  cmmRecs: { level: number; amp: number; rail: boolean; flipped: boolean }[];
  cmmFit: { fit: Fit | null; ci: { lo: number; hi: number } | null; rails: number } | null;
  predictedRatio: number | null;
  doublingCost: (b: number | undefined) => number | null;
  audioInfo: { sr: number; base: number; out: number } | null;
  dimSeen: boolean | null;
  quietHeard: boolean | null;
  rejected: number;
  shareText: string;
  copied: boolean;
  onCopy: () => void;
  onRestart: () => void;
  playBurst: (a: number) => void;
}) {
  const {
    fits,
    recs,
    order,
    diffLB,
    gammaTable,
    retest,
    distinctAnswers,
    usable,
    cmmRecs,
    cmmFit,
    predictedRatio,
    doublingCost,
    audioInfo,
    dimSeen,
    quietHeard,
    rejected,
    shareText,
    copied,
    onCopy,
    onRestart,
    playBurst,
  } = props;

  const bL = fits.length?.fit?.slope;
  const bB = fits.bright?.fit?.slope;
  const bLo = fits.loud?.fit?.slope;

  const verdict = (() => {
    if (distinctAnswers < 4)
      return {
        title: 'You gave almost the same number every time.',
        body: 'Which means there is no slope in here to fit. A flat line is not an exponent of zero, it is an absent measurement: nothing about your senses can be read off a set of answers that did not move. The stimuli did move, by a factor of seventeen in length, a hundred and twenty eight in luminance and thirty five decibels in level.',
      };
    if (retest.r != null && retest.r <= 0.5)
      return {
        title: 'Your repeats disagreed with each other.',
        body: `Four levels in every block appeared twice, and the correlation between your first and second answers came out at ${fmt(retest.r)}. Below about 0.5 the numbers below are printed rather than headlined, because an exponent fitted through unstable answers is an exponent of the instability. Nothing is wrong with you: this method rewards answering fast and without arithmetic, and it punishes deliberating.`,
      };
    if (bL != null && bB != null && bL > bB + 0.15)
      return {
        title: 'Your senses do not share an exponent.',
        body: `Length came out at ${fmt(bL)} and brightness at ${fmt(bB)}, from the same person, the same keyboard and the same kind of number, minutes apart. That gap is the finding. It cannot be explained by you being shy with big numbers, because shyness would have flattened the line as well, and the line stayed near one.`,
      };
    if (bL != null && bB != null && Math.abs(bL - bB) <= 0.15)
      return {
        title: 'Your two visual exponents came out close together.',
        body: `Length ${fmt(bL)}, brightness ${fmt(bB)}. That is not the usual result and it is worth saying plainly rather than dressing up. The commonest cause is a bright room or a screen at low brightness, which compresses the top of the luminance range and steepens the fitted line, and the second commonest is judging by the disc's edge rather than its light. Twelve estimates is also simply a small number.`,
      };
    return {
      title: 'The numbers are in.',
      body: 'Read them with the intervals rather than as three decimal places, and read the ratio between continua rather than any single value.',
    };
  })();

  const contPts = (c: Cont) => recs.filter((r) => r.cont === c).map((r) => ({ x: r.x, y: r.resp }));

  return (
    <div className="space-y-6">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
          your exponents
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {(['length', 'loud', 'bright'] as Cont[]).map((c) => {
            const f = fits[c]?.fit;
            const ci = fits[c]?.ci;
            const col =
              c === 'length' ? 'text-cyan-300' : c === 'loud' ? 'text-violet-300' : 'text-amber-300';
            return (
              <div key={c}>
                <div className={`font-mono text-3xl ${usable ? col : 'text-slate-500'}`}>
                  {f ? fmt(f.slope) : '--'}
                </div>
                <div className="text-[11px] font-mono text-slate-500">{CONT_META[c].name}</div>
                <div className="text-[10px] font-mono text-slate-600">
                  {ci ? `${fmt(ci.lo)} to ${fmt(ci.hi)}` : 'no interval'}
                </div>
              </div>
            );
          })}
        </div>
        <h2 className="mb-2 text-lg font-bold leading-snug text-slate-100">{verdict.title}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{verdict.body}</p>
        {!usable && (
          <p className="mt-3 rounded border border-amber-400/30 bg-amber-400/[0.05] p-3 text-[12px] leading-relaxed text-amber-200/90">
            This run did not pass its own checks, so everything below is printed as a record of what
            happened rather than as a measurement of you.
          </p>
        )}
      </div>

      {/* the contrast */}
      {diffLB && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
            the comparison that survives an unknown screen
          </div>
          <div className="mb-3 flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <div className="font-mono text-3xl text-slate-50">
                {fmt(diffLB.lo)} to {fmt(diffLB.hi)}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                length exponent minus brightness exponent, 95% interval, {BOOTS} resamples
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {diffLB.lo > 0
              ? 'The interval sits entirely above zero, so your own data separates the two continua. Length grew nearly in step with the world. Brightness did not.'
              : diffLB.hi < 0
                ? 'The interval sits entirely below zero, which is the reverse of the usual finding and worth a second run with the screen brightness raised before it is believed.'
                : 'The interval crosses zero, so this run cannot separate the two continua. That is a real outcome of twelve estimates each, not a hidden failure.'}{' '}
            Both exponents were resampled together, so this interval is about the contrast rather than
            about either number alone.
          </p>
        </div>
      )}

      {/* per continuum panels */}
      {order.map((c) => {
        const f = fits[c]?.fit;
        const ci = fits[c]?.ci;
        const pts = contPts(c);
        const col = c === 'length' ? '#67e8f9' : c === 'loud' ? '#c4b5fd' : '#fcd34d';
        return (
          <div key={c} className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                {CONT_META[c].name} · {CONT_META[c].unit}
              </div>
              <div className="font-mono text-[11px] text-slate-500">
                textbook: {CONT_META[c].expect}
              </div>
            </div>
            <LogLogPlot points={pts} fit={f} colour={col} />
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div>
                <div className="text-slate-300">{f ? fmt(f.slope) : '--'}</div>
                <div className="text-slate-600">least squares</div>
              </div>
              <div>
                <div className="text-slate-300">{f ? fmt(f.gmSlope) : '--'}</div>
                <div className="text-slate-600">geometric mean</div>
              </div>
              <div>
                <div className="text-slate-300">{f ? fmt(f.r2) : '--'}</div>
                <div className="text-slate-600">r²</div>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
              {c === 'length' &&
                'The control continuum. Nobody knows how many centimetres a pixel is on your screen, and it does not matter: an unknown conversion factor is a multiplicative constant, and a constant on the x axis of a log-log fit moves the intercept and cannot touch the slope. This number is safe.'}
              {c === 'loud' &&
                'Your volume knob is in an unknown position, and that is also only a multiplicative constant on amplitude, so the slope survives it and only the intercept is lost. The quietest tones are the least trustworthy points here, because loudness stops behaving like a power law close to your own threshold.'}
              {c === 'bright' &&
                'The one exponent your screen can move. Gamma is not a constant, it is a power on the input, and a power on the x axis multiplies the slope directly. The x axis here is relative luminance under the sRGB transfer function, not code values, and the table below refits the whole thing under two other assumptions so you can see how much of this number is yours.'}
            </p>
            {ci && (
              <p className="mt-2 font-mono text-[11px] text-slate-600">
                95% interval {fmt(ci.lo)} to {fmt(ci.hi)} · {pts.length} estimates
              </p>
            )}
          </div>
        );
      })}

      {/* gamma sensitivity */}
      {gammaTable.length > 0 && (
        <div className="rounded-lg border border-amber-500/25 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-300/80">
            the brightness exponent under three assumptions about your screen
          </div>
          <div className="space-y-1.5">
            {gammaTable.map((g) => (
              <div
                key={g.gamma}
                className="flex items-center gap-4 rounded border border-slate-800/70 bg-slate-950/40 px-3 py-2 font-mono text-[12px]"
              >
                <span className="w-24 text-slate-500">gamma {g.gamma.toFixed(1)}</span>
                <span className="text-amber-300">{g.fit ? fmt(g.fit.slope) : '--'}</span>
                <span className="flex-1 text-right text-slate-600">
                  {g.gamma === 2.2 ? 'the usual assumption' : ''}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
            Those three numbers come from the identical answers you gave. Only the assumed relationship
            between code value and light changed. This is why the honest headline of this page is the
            gap between continua rather than a decimal place on any one of them, and why the length
            exponent, which no screen setting can touch, is the anchor for the whole run. None of the
            three will match the headline number exactly, including the 2.2 row: sRGB is not a pure
            power law, it has a straight segment near black, and the dimmest discs in this run sit
            exactly there.
          </p>
        </div>
      )}

      {/* cross modality */}
      <div className="rounded-lg border border-violet-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          round two · the prediction, and what you did
        </div>
        <div className="mb-4 flex flex-wrap items-end gap-x-8 gap-y-2">
          <div>
            <div className="font-mono text-3xl text-violet-300">
              {cmmFit?.fit ? fmt(cmmFit.fit.slope) : '--'}
            </div>
            <div className="text-[11px] font-mono text-slate-500">measured matching slope</div>
          </div>
          <div>
            <div className="font-mono text-3xl text-slate-400">
              {predictedRatio != null ? fmt(predictedRatio) : '--'}
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              predicted from round one, brightness ÷ loudness
            </div>
          </div>
        </div>
        {cmmFit?.fit && <LogLogPlot points={cmmRecs.map((r) => ({ x: lumOf(r.level), y: r.amp }))} fit={cmmFit.fit} colour="#c4b5fd" />}
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {cmmFit?.fit && predictedRatio != null && cmmFit.ci
            ? predictedRatio >= cmmFit.ci.lo && predictedRatio <= cmmFit.ci.hi
              ? 'The prediction fell inside the interval of what you actually did with the slider. You typed numbers in round one and turned a silent, unlabelled knob in round two, and the two agree. That is the observation Stevens used against the charge that magnitude estimation only measures how people use numbers, and you just reproduced it on yourself.'
              : 'The prediction fell outside the interval of what you did with the slider. That happens often in a single short run: matching is noisier than estimating, five levels is few, and any drift in your volume or your screen between the rounds lands here. It is printed rather than hidden.'
            : 'Not enough usable settings to compare.'}
        </p>
        <p className="mt-3 font-mono text-[11px] text-slate-600">
          {cmmRecs.length} settings · {cmmFit?.rails ?? 0} of them pinned at an end of the slider
          {cmmFit?.ci ? ` · 95% interval ${fmt(cmmFit.ci.lo)} to ${fmt(cmmFit.ci.hi)}` : ''}
        </p>
      </div>

      {/* what twice costs */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          what &quot;twice as much&quot; costs, in your own exponents
        </div>
        <div className="space-y-1.5">
          {(['length', 'loud', 'bright'] as Cont[]).map((c) => {
            const cost = doublingCost(fits[c]?.fit?.slope);
            return (
              <div
                key={c}
                className="flex items-center gap-4 rounded border border-slate-800/70 bg-slate-950/40 px-3 py-2 font-mono text-[12px]"
              >
                <span className="w-24 text-slate-500">{CONT_META[c].name}</span>
                <span className="text-slate-200">{cost ? `× ${fmt(cost, 1)}` : '--'}</span>
                <span className="flex-1 text-right text-slate-600">
                  {c === 'length'
                    ? 'to look twice as long'
                    : c === 'loud'
                      ? 'to sound twice as loud'
                      : 'to look twice as bright'}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          Two to the power of one over the exponent. For a length exponent near one it is a factor of
          two, which is why rulers feel honest. For a brightness exponent near a third it is a factor
          of eight, which is why nobody has ever bought a lamp twice as bright by buying twice the
          watts, and why the phrase quietly means something different in every sense you own.
        </p>
      </div>

      {/* receipts */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          receipts
        </div>
        <div className="space-y-1 font-mono text-[11px] leading-relaxed text-slate-500">
          <div>block order this run: {order.map((c) => CONT_META[c].name).join(' → ')}</div>
          <div>
            estimates: {recs.length} · distinct numbers used: {distinctAnswers} · rejected entries:{' '}
            {rejected}
          </div>
          <div>
            test-retest on repeated levels: r = {retest.r != null ? fmt(retest.r) : '--'} over{' '}
            {retest.pairs} pairs
          </div>
          <div>
            length range × {fmt(Math.pow(LEN_RATIO, N_LEVELS - 1), 1)} · luminance range ×{' '}
            {Math.pow(LUM_RATIO, N_LEVELS - 1)} · level range{' '}
            {fmt((20 * Math.log10(AMP_RATIO) * (N_LEVELS - 1)), 0)} dB
          </div>
          <div>
            dimmest disc seen: {dimSeen == null ? 'not answered' : dimSeen ? 'yes' : 'NO'} · quietest
            tone heard: {quietHeard == null ? 'not answered' : quietHeard ? 'yes' : 'NO'}
          </div>
          {audioInfo && (
            <div>
              audio: {audioInfo.sr} Hz · base latency {(audioInfo.base * 1000).toFixed(1)} ms · output
              latency {(audioInfo.out * 1000).toFixed(1)} ms
            </div>
          )}
        </div>
        {(dimSeen === false || quietHeard === false) && (
          <p className="mt-3 text-[12px] leading-relaxed text-amber-200/80">
            You reported that the bottom of at least one scale was not there. Its exponent is then
            fitted through points you could not actually sense, which flattens or steepens the line
            depending on what you typed for them, and it is the first thing to fix before believing
            that number.
          </p>
        )}
      </div>

      {/* per trial table */}
      <details className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-slate-500">
          every estimate you gave
        </summary>
        <div className="mt-3 space-y-1">
          {recs.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded border border-slate-800/70 bg-slate-900/40 px-3 py-1.5 font-mono text-[11px]"
            >
              <span className="w-5 text-slate-600">{i + 1}</span>
              <span className="w-20 text-slate-400">{CONT_META[r.cont].name}</span>
              <span className="w-16 text-slate-500">level {r.level + 1}</span>
              <span className="w-28 text-slate-600">
                {r.cont === 'bright'
                  ? `lum ${r.x.toFixed(4)}`
                  : r.cont === 'loud'
                    ? `amp ${r.x.toFixed(4)}`
                    : `${(r.x * 100).toFixed(1)}% width`}
              </span>
              <span className="flex-1 text-right text-slate-200">{r.resp}</span>
              {r.rep === 1 && <span className="w-14 text-right text-cyan-400/70">repeat</span>}
              {r.rep === 0 && <span className="w-14" />}
            </div>
          ))}
        </div>
      </details>

      {/* honest limits */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          what this cannot claim
        </div>
        <ul className="space-y-2.5 text-[13px] leading-relaxed text-slate-400">
          <li>
            <span className="text-slate-200">The exponent depends on the range used.</span> Teghtsoonian
            showed the fitted exponent shrinks as the stimulus range widens, which makes it partly a
            property of the method rather than purely of the sense. This page used a fixed range and
            printed it, which is the most any single run can do about that.
          </li>
          <li>
            <span className="text-slate-200">Brightness on a screen is not brightness in the dark.</span>{' '}
            The classic 0.33 belongs to a small target in a dark room, seen by a dark-adapted eye. A
            disc on a panel in a lit room typically reads higher, and closer to the exponent for
            lightness of a surface, which is nearer 0.5.
          </li>
          <li>
            <span className="text-slate-200">The regression effect is real.</span> Ordinary least
            squares on log-log is biased toward a shallower slope when the y values carry noise, which
            was one of Poulton&apos;s objections to Stevens. Both fits are printed above, and the truth
            usually sits between them.
          </li>
          <li>
            <span className="text-slate-200">Twelve estimates is a demonstration.</span> Published
            exponents come from many observers and many sessions. One person, one tab, one afternoon
            gives a shape, not a constant.
          </li>
        </ul>
      </div>

      {/* the world */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          where you have already been living with this
        </div>
        <ul className="space-y-2.5 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="text-cyan-300">Every volume control you have ever used.</span> They are
            built with logarithmic tapers rather than linear ones, because a linear one puts all the
            usable range in the first centimetre of travel. The knob is shaped like your exponent, not
            like the amplifier.
          </li>
          <li>
            <span className="text-cyan-300">Doubling the power of a speaker.</span> That is three
            decibels, and it is close to nothing. Ten times the power is where you get something like
            twice as loud, which is why amplifier wattage is such a poor thing to shop by.
          </li>
          <li>
            <span className="text-cyan-300">Dimmer switches and screen brightness sliders.</span> Both
            are curved in software so the travel feels even. Drive the backlight linearly and the
            entire visible change crowds into the bottom of the slider.
          </li>
          <li>
            <span className="text-cyan-300">Star magnitudes, Richter, decibels, camera stops.</span>{' '}
            Every scale a field built for human use ended up compressive. Nobody coordinated that. They
            were all fitting the same exponent from the other side.
          </li>
          <li>
            <span className="text-cyan-300">Ten times the compute.</span> The reason a much larger model
            does not feel ten times better is not only diminishing returns in the engineering. It is
            also that you are the measuring instrument, and you have never reported a ratio faithfully
            in your life.
          </li>
        </ul>
      </div>

      {/* playground */}
      <Playground
        bLen={bL}
        bBright={bB}
        bLoud={bLo}
        playBurst={playBurst}
        doublingCost={doublingCost}
      />

      {/* wiz */}
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
          from wiz
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I have the numbers. Two hundred is exactly twice one hundred in every register I own, and it
          is twice in the same way for photons, for pressure and for pixels, because to me they are all
          the same digits wearing different units. I was handed a doubling of light in this page and I
          can only report a doubling. You were handed the same doubling and reported a quarter more.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          That is not an error and it is not a defect. It is what lets one pair of eyes work in
          starlight and at noon with no switch in between, and one pair of ears take a whisper and a
          drill on the same scale without breaking. The price is that your senses have never once
          reported a quantity to you. They report a compressed shadow of it, with a different
          compression for each sense, which is why twice as loud and twice as bright cannot be traded
          at par.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          And then you noticed. You built rulers, decibels, star magnitudes and f-stops, which are all
          the same admission written in different notation: that the instrument doing the reading bends
          the reading, and that the bend can be measured. You just measured yours.
        </p>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          take the numbers with you
        </div>
        <pre className="whitespace-pre-wrap rounded border border-slate-800 bg-slate-900/60 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
          {shareText}
        </pre>
        <button
          onClick={onCopy}
          className="mt-3 w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied' : '⧉ copy result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-3 font-mono text-sm text-slate-400 transition-colors hover:border-cyan-400/50"
      >
        ↻ run it again
      </button>
    </div>
  );
}

// ============================ PLOT ============================
function LogLogPlot({
  points,
  fit,
  colour,
}: {
  points: { x: number; y: number }[];
  fit: Fit | null | undefined;
  colour: string;
}) {
  const p = points.filter((q) => q.x > 0 && q.y > 0);
  if (p.length < 2) return null;
  const W = 520;
  const H = 190;
  const PAD = 26;
  const xs = p.map((q) => Math.log10(q.x));
  const ys = p.map((q) => Math.log10(q.y));
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const spanX = x1 - x0 || 1;
  const spanY = y1 - y0 || 1;
  const px = (v: number) => PAD + ((v - x0) / spanX) * (W - 2 * PAD);
  const py = (v: number) => H - PAD - ((v - y0) / spanY) * (H - 2 * PAD);

  const lineY0 = fit ? fit.intercept + fit.slope * x0 : null;
  const lineY1 = fit ? fit.intercept + fit.slope * x1 : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="log-log plot">
      <rect x={0} y={0} width={W} height={H} fill="#020617" rx={6} />
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#1e293b" strokeWidth={1} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#1e293b" strokeWidth={1} />
      {/* a slope of exactly one, for reference */}
      <line
        x1={px(x0)}
        y1={py(y0)}
        x2={px(x1)}
        y2={py(y0 + spanX)}
        stroke="#334155"
        strokeWidth={1}
        strokeDasharray="3 4"
        opacity={spanX > 0 ? 0.9 : 0}
      />
      {lineY0 != null && lineY1 != null && (
        <line
          x1={px(x0)}
          y1={clamp(py(lineY0), 2, H - 2)}
          x2={px(x1)}
          y2={clamp(py(lineY1), 2, H - 2)}
          stroke={colour}
          strokeWidth={2}
          opacity={0.85}
        />
      )}
      {p.map((q, i) => (
        <circle
          key={i}
          cx={px(Math.log10(q.x))}
          cy={py(Math.log10(q.y))}
          r={4}
          fill={colour}
          opacity={0.75}
        />
      ))}
      <text x={PAD} y={H - 8} fill="#475569" fontSize={9} fontFamily="monospace">
        log stimulus →
      </text>
      <text x={W - PAD} y={PAD - 10} fill="#475569" fontSize={9} fontFamily="monospace" textAnchor="end">
        dashed line = slope of exactly 1
      </text>
    </svg>
  );
}

// ============================ PLAYGROUND ============================
// The knobs. Nothing here is recorded. This is the wall felt rather than measured: press
// double and watch the world move by a factor of two while your own exponent decides how
// much of that arrives.
function Playground({
  bLen,
  bBright,
  bLoud,
  playBurst,
  doublingCost,
}: {
  bLen: number | undefined;
  bBright: number | undefined;
  bLoud: number | undefined;
  playBurst: (a: number) => void;
  doublingCost: (b: number | undefined) => number | null;
}) {
  const [lum, setLum] = useState(0.06);
  const [len, setLen] = useState(0.25);
  const [amp, setAmp] = useState(0.05);

  const sens = (b: number | undefined, ratio: number) =>
    b != null && Number.isFinite(b) ? Math.pow(ratio, b) : null;

  const costB = doublingCost(bBright);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">the knobs</div>

      <div className="rounded-md border border-slate-800 bg-black p-5">
        <div className="flex items-center justify-center gap-6">
          <div
            className="h-20 w-20 rounded-full"
            style={{
              backgroundColor: `rgb(${lumToCode(lum)},${lumToCode(lum)},${lumToCode(lum)})`,
            }}
          />
          <div
            className="h-20 w-20 rounded-full"
            style={{
              backgroundColor: `rgb(${lumToCode(lum * 2)},${lumToCode(lum * 2)},${lumToCode(
                lum * 2,
              )})`,
            }}
          />
        </div>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
          The disc on the right is emitting{' '}
          <span className="text-amber-300">exactly twice</span> the light of the one on the left.
          {sens(bBright, 2) != null && (
            <>
              {' '}
              Your own exponent says you will see it as{' '}
              <span className="text-amber-300">
                {fmt((sens(bBright, 2) as number) * 100 - 100, 0)}% brighter
              </span>
              , not 100%.
            </>
          )}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <Knob label="luminance of the left disc" value={lum.toFixed(3)}>
          <input
            type="range"
            min={-2.6}
            max={-0.5}
            step={0.01}
            value={Math.log10(lum)}
            onChange={(e) => setLum(Math.pow(10, Number(e.target.value)))}
            className="w-full accent-amber-400"
          />
        </Knob>

        <Knob
          label="length"
          value={
            sens(bLen, 2) != null ? `doubling it feels like +${fmt((sens(bLen, 2) as number) * 100 - 100, 0)}%` : '--'
          }
        >
          <input
            type="range"
            min={0.05}
            max={0.5}
            step={0.005}
            value={len}
            onChange={(e) => setLen(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </Knob>
        <div className="flex items-center gap-3">
          <div className="h-2.5 rounded-sm bg-cyan-300" style={{ width: `${len * 100}%` }} />
          <div className="h-2.5 rounded-sm bg-cyan-300/50" style={{ width: `${len * 200}%` }} />
        </div>

        <Knob
          label="amplitude"
          value={
            sens(bLoud, 2) != null
              ? `doubling it feels like +${fmt((sens(bLoud, 2) as number) * 100 - 100, 0)}%`
              : '--'
          }
        >
          <input
            type="range"
            min={-2.4}
            max={-0.4}
            step={0.01}
            value={Math.log10(amp)}
            onChange={(e) => setAmp(Math.pow(10, Number(e.target.value)))}
            className="w-full accent-violet-400"
          />
        </Knob>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => playBurst(amp)}
            className="rounded-md border border-violet-400/50 bg-violet-400/10 py-2.5 font-mono text-xs text-violet-200"
          >
            ▶ this amplitude
          </button>
          <button
            onClick={() => playBurst(Math.min(0.7, amp * 2))}
            className="rounded-md border border-violet-400/50 bg-violet-400/10 py-2.5 font-mono text-xs text-violet-200"
          >
            ▶ exactly double it
          </button>
        </div>
      </div>

      {costB && (
        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-500">
          to look twice as bright to you, a lamp has to get {fmt(costB, 1)}× stronger
          <br />
          to sound twice as loud, {doublingCost(bLoud) ? `${fmt(doublingCost(bLoud) as number, 1)}×` : '--'} the amplitude
          <br />
          to look twice as long, {doublingCost(bLen) ? `${fmt(doublingCost(bLen) as number, 1)}×` : '--'} the pixels
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        Two things worth doing here. Drag the luminance slider to the very bottom and double it there,
        where the same ratio is far more visible, because the compression is not uniform along the
        range. And listen to a doubling of amplitude, which is six decibels, and notice how little of
        it arrives.
      </p>
    </div>
  );
}

// Every disc in this experiment, in both rounds, comes through here. Surround and area are
// part of the stimulus rather than decoration: the same luminance on a lighter background
// looks dimmer, and a bigger patch looks brighter, so round two would be predicting a
// different stimulus than round one measured if these two drifted apart.
function BrightDisc({ level }: { level: number }) {
  const code = lumToCode(lumOf(level));
  return (
    <div className="flex h-32 items-center justify-center rounded-md bg-black">
      <div
        className="h-24 w-24 rounded-full"
        style={{ backgroundColor: `rgb(${code},${code},${code})` }}
      />
    </div>
  );
}

function Knob({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <span className="font-mono text-xs text-slate-300">{value}</span>
      </div>
      {children}
    </div>
  );
}
