'use client';

// THROWN VOICE  (the ventriloquist effect, the place your eyes decide a sound came from, and the proof that your
// ears knew better and were overruled)
//
// The thirty-ninth piece in this lab, and its first measurement of SPATIAL CROSS-MODAL CAPTURE: a sound that
// arrives at your two ears with a perfectly usable location in it, which you then report from somewhere else,
// because something flashed there.
//
// Note the direction against its nearest sibling. The Extra Flash was the only prior cross-modal piece in this
// lab, and it ran the other way: a sound changed how many flashes you saw, in the domain of number and time.
// This one runs vision to hearing, in the domain of SPACE, and it is the more brutal of the two, because your
// ears are not being asked to invent anything. The location is in the signal. It is in the microsecond gap
// between the two ears and in the level difference between them, it is correct, and it gets thrown away in
// favour of a dot.
//
// And then it goes one step further than any prior sibling has gone, because capture is only the first half.
// Every other piece in this lab measures a percept. This one measures a percept and then measures the map
// underneath it MOVING. After a block of pairs that are consistently offset in one direction, your unimodal
// auditory localisation, with no dot on screen at all, has shifted that way. That is the ventriloquism
// aftereffect, and it means the argument between your eyes and your ears did not end in a compromise. It ended
// in your ears being recalibrated.
//
// The genuine phenomenon: the ventriloquist effect. Named by Howard and Templeton (1966), demonstrated earlier
// by Thomas (1941) and by Jackson (1953), whose stimulus was a whistling kettle and a puff of steam placed a
// little away from it. The aftereffect is Radeau and Bertelson (1974). Bertelson and Aschersleben (1998) showed
// the capture is not a strategy or a guess: it happens when you are told to ignore the light, and it happens
// when you know exactly what the experiment is. The modern account is Alais and Burr (2004), who showed the
// whole thing is not vision winning by right but each sense being weighted by its own precision: vision locates
// to about a minute of arc, hearing to a degree or two, so vision gets the vote. Blur the visual blob until it
// is worse than the ears and the capture reverses, and the sound starts moving the light. Ernst and Banks (2002)
// had shown the same arithmetic for vision and touch. Slutsky and Recanzone (2001) mapped where it dies: push
// the two apart in space or in time and at some point the brain stops treating them as one event. Koerding and
// colleagues (2007) wrote that last part down properly as causal inference, which is the real subject of this
// page: not where things are, but whether two pieces of evidence are about the same thing.
//
// Three blocks, all real psychophysics. Block one is your ears alone: noise bursts at random lateral positions,
// no visual, you mark where each one came from. That is your baseline accuracy and your baseline bias. Block two
// adds a flash, at a disparity that varies trial by trial from zero to about a third of the arena, and asks the
// same question about the sound only. The slope of your reports against that disparity is the capture index:
// zero means your ears held the line, one means the dot owned the sound completely. Block three is exposure,
// thirty-six pairs with the offset always in the same direction, which you only have to watch, followed by a
// silent-dot-free repeat of block one. If the difference between your first and last audio-only blocks points
// the way the dot kept insisting, your ears have been recalibrated by your eyes in under a minute.
//
// The honest part, said throughout and repeated on the results: this runs on headphones, and headphones put the
// sound INSIDE your head rather than out in the room. That weakens the ventriloquist effect, which was built on
// real speakers in real space, and it is the single biggest caveat on the page. Stereo speakers are the better
// surface here if you have them. The arena is measured in its own units, percent of the strip, because a browser
// cannot know your screen size, your viewing distance or your headphone response, so nominal degrees would be a
// decoration rather than a measurement. Audio and flash are scheduled on two different clocks, the audio clock
// and the browser timer, so simultaneity is good to a frame or two rather than to a millisecond. A capture index
// near zero is a real and reportable outcome, not a broken run. Everything is synthesised live in your browser.
// Nothing is recorded, nothing leaves the page.
//
// WIZ note. I build the buffer. I know where the sound is, exactly, because I put it there: an interaural delay
// of so many microseconds and a level difference of so many decibels, two numbers, no ambiguity, no opinion. I
// also know where I drew the dot. They are different numbers and I can hold both of them at once forever without
// either one bothering the other. You cannot. You get one location, one, already decided, with the disagreement
// resolved somewhere you have no access to and the losing evidence discarded. And the deepest part is not that
// vision wins. It is that something in you first had to decide the light and the sound were the same event,
// before there was anything to win, and that decision is the one you will never see it make.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'baseline' | 'bridge1' | 'capture' | 'bridge2' | 'exposure' | 'post' | 'result';

// ---- arena and stimulus values --------------------------------------------
const ARENA_HALF = 50; // the arena runs from -50 to +50 of its own units
const BURST_MS = 30; // noise burst, short enough to be a single event
const RAMP_MS = 4;
const FLASH_MS = 70;
const LEAD_S = 0.09; // scheduling lead, so audio and flash can be aimed at the same instant
const TARGET_RMS = 0.06;
const PEAK_CEIL = 0.9;

const ITD_MAX_S = 0.00066; // interaural time difference at full lateral, roughly a real head
const ILD_MAX_DB = 9; // interaural level difference at full lateral
const NOISE_LO = 500;
const NOISE_HI = 7000;

// block one and three: the ears alone
const AUDIO_ONLY_POS = [-30, -22, -13, -5, 5, 13, 22, 30];
const BASELINE_TRIALS = AUDIO_ONLY_POS.length;

// block two: the argument
const DISPARITIES = [-32, -20, -10, 0, 10, 20, 32];
const CAPTURE_REPS = 3;
const CAPTURE_TRIALS = DISPARITIES.length * CAPTURE_REPS;
const AUD_RANGE = 26; // audio positions for block two, kept clear of the edges
const VIS_LIMIT = 46; // the dot never goes past this, so the arena never clips it

// block three: the recalibration
const EXPOSURE_N = 36;
const EXPOSURE_DISP = 22;
const EXPOSURE_ISI_MS = 720;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
const fmt1 = (v: number) => (v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1));

function sd(a: number[]): number {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
}

function slope(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = mean(xs.slice(0, n));
  const my = mean(ys.slice(0, n));
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return den > 1e-9 ? num / den : 0;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const jitter = (amt: number) => (Math.random() * 2 - 1) * amt;

// ---- synthesis ------------------------------------------------------------
// The whole experiment turns on the sound having a real, known, recoverable location, so
// the burst is rendered by hand into two channels: band limited noise, delayed into one ear
// by a fraction of a sample and attenuated in that ear by a few decibels. Those two numbers
// are the location. They are correct on every trial. They are also the thing you are about
// to overrule.

function bandNoise(sr: number, n: number): Float32Array {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = Math.random() * 2 - 1;

  // two one pole low passes, for a slope worth the name
  const aLp = Math.exp((-2 * Math.PI * NOISE_HI) / sr);
  for (let pass = 0; pass < 2; pass++) {
    let y = 0;
    for (let i = 0; i < n; i++) {
      y = (1 - aLp) * x[i] + aLp * y;
      x[i] = y;
    }
  }
  // one pole high pass, to keep the low rumble out of the interaural cues
  const aHp = Math.exp((-2 * Math.PI * NOISE_LO) / sr);
  let yp = 0;
  let xp = 0;
  for (let i = 0; i < n; i++) {
    const xi = x[i];
    yp = aHp * (yp + xi - xp);
    xp = xi;
    x[i] = yp;
  }
  return x;
}

function rmsNormalise(buf: Float32Array, target: number) {
  let s = 0;
  for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
  const rms = Math.sqrt(s / Math.max(1, buf.length));
  const g = rms > 1e-9 ? target / rms : 0;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}

// fractional sample delay by linear interpolation: this is the interaural time difference,
// and at these positions it is a matter of twenty or thirty samples
function fracDelay(src: Float32Array, d: number): Float32Array {
  const out = new Float32Array(src.length);
  const i0 = Math.floor(d);
  const frac = d - i0;
  for (let i = 0; i < src.length; i++) {
    const a = i - i0 >= 0 ? src[i - i0] : 0;
    const b = i - i0 - 1 >= 0 ? src[i - i0 - 1] : 0;
    out[i] = a * (1 - frac) + b * frac;
  }
  return out;
}

function applyRamp(buf: Float32Array, sr: number) {
  const ramp = Math.max(1, Math.floor((RAMP_MS / 1000) * sr));
  const n = buf.length;
  for (let i = 0; i < n; i++) {
    let e = 1;
    if (i < ramp) e = 0.5 - 0.5 * Math.cos((Math.PI * i) / ramp);
    else if (i > n - 1 - ramp) e = 0.5 - 0.5 * Math.cos((Math.PI * (n - 1 - i)) / ramp);
    buf[i] *= e;
  }
}

// pos runs from -ARENA_HALF (hard left) to +ARENA_HALF (hard right)
function renderBurst(ctx: AudioContext, pos: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.floor((BURST_MS / 1000) * sr);
  const mono = bandNoise(sr, n);
  rmsNormalise(mono, TARGET_RMS);

  const lateral = clamp(pos / ARENA_HALF, -1, 1);
  const itdSamples = Math.abs(lateral) * ITD_MAX_S * sr;

  const left = lateral > 0 ? fracDelay(mono, itdSamples) : mono.slice();
  const right = lateral < 0 ? fracDelay(mono, itdSamples) : mono.slice();

  const gl = Math.pow(10, (-ILD_MAX_DB * Math.max(0, lateral)) / 20);
  const gr = Math.pow(10, (-ILD_MAX_DB * Math.max(0, -lateral)) / 20);

  let pk = 0;
  for (let i = 0; i < n; i++) {
    left[i] *= gl;
    right[i] *= gr;
    pk = Math.max(pk, Math.abs(left[i]), Math.abs(right[i]));
  }
  if (pk > PEAK_CEIL) {
    const g = PEAK_CEIL / pk;
    for (let i = 0; i < n; i++) {
      left[i] *= g;
      right[i] *= g;
    }
  }
  applyRamp(left, sr);
  applyRamp(right, sr);

  const buf = ctx.createBuffer(2, n, sr);
  buf.copyToChannel(left, 0);
  buf.copyToChannel(right, 1);
  return buf;
}

// ---- trials ---------------------------------------------------------------
type Trial = { audio: number; visual: number | null };
type Rec = { audio: number; visual: number | null; disp: number; report: number };

function buildAudioOnly(): Trial[] {
  return shuffle(AUDIO_ONLY_POS).map((p) => ({ audio: p + jitter(2.5), visual: null }));
}

function buildCapture(): Trial[] {
  const list: Trial[] = [];
  for (let r = 0; r < CAPTURE_REPS; r++) {
    for (const d of DISPARITIES) {
      let a = jitter(AUD_RANGE);
      // keep the dot inside the arena without ever changing the disparity
      a = clamp(a, -VIS_LIMIT - Math.min(0, d), VIS_LIMIT - Math.max(0, d));
      list.push({ audio: a, visual: a + d });
    }
  }
  return shuffle(list);
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');

  const [baseTrials, setBaseTrials] = useState<Trial[]>([]);
  const [capTrials, setCapTrials] = useState<Trial[]>([]);
  const [postTrials, setPostTrials] = useState<Trial[]>([]);

  const [idx, setIdx] = useState(0);
  const [resp, setResp] = useState<number | null>(null);
  const [played, setPlayed] = useState(false);

  const [baseRecs, setBaseRecs] = useState<Rec[]>([]);
  const [capRecs, setCapRecs] = useState<Rec[]>([]);
  const [postRecs, setPostRecs] = useState<Rec[]>([]);

  const [expDir, setExpDir] = useState(1);
  const [expStep, setExpStep] = useState(0);

  const [flash, setFlash] = useState<{ pos: number; blur: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

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

  // one presentation: the sound goes out on the audio clock, the dot on the browser timer,
  // both aimed at the same instant, which is honest to a frame and not to a millisecond
  const present = useCallback(
    (audioPos: number, visualPos: number | null, opts?: { blur?: number; audioDelayMs?: number }) => {
      const ctx = getCtx();
      const src = ctx.createBufferSource();
      src.buffer = renderBurst(ctx, audioPos);
      src.connect(ctx.destination);
      const extra = Math.max(0, opts?.audioDelayMs ?? 0) / 1000;
      src.start(ctx.currentTime + LEAD_S + extra);
      if (visualPos != null) {
        later(() => {
          setFlash({ pos: visualPos, blur: opts?.blur ?? 0 });
          later(() => setFlash(null), FLASH_MS);
        }, LEAD_S * 1000);
      }
    },
    [getCtx, later],
  );

  const currentList = phase === 'baseline' ? baseTrials : phase === 'capture' ? capTrials : postTrials;
  const trial: Trial | null = currentList[idx] ?? null;

  const playTrial = useCallback(() => {
    if (!trial) return;
    setPlayed(true);
    present(trial.audio, trial.visual);
  }, [trial, present]);

  // auto play on entering a trial, because a localisation judgement should not wait on a button
  useEffect(() => {
    if (phase !== 'baseline' && phase !== 'capture' && phase !== 'post') return;
    if (!trial) return;
    setPlayed(false);
    setResp(null);
    const id = later(() => {
      setPlayed(true);
      present(trial.audio, trial.visual);
    }, 420);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx]);

  const commit = useCallback(() => {
    if (resp == null || !trial) return;
    const rec: Rec = {
      audio: trial.audio,
      visual: trial.visual,
      disp: trial.visual == null ? 0 : trial.visual - trial.audio,
      report: resp,
    };
    if (phase === 'baseline') {
      const next = [...baseRecs, rec];
      setBaseRecs(next);
      if (next.length >= baseTrials.length) setPhase('bridge1');
      else setIdx((i) => i + 1);
    } else if (phase === 'capture') {
      const next = [...capRecs, rec];
      setCapRecs(next);
      if (next.length >= capTrials.length) setPhase('bridge2');
      else setIdx((i) => i + 1);
    } else if (phase === 'post') {
      const next = [...postRecs, rec];
      setPostRecs(next);
      if (next.length >= postTrials.length) setPhase('result');
      else setIdx((i) => i + 1);
    }
  }, [resp, trial, phase, baseRecs, capRecs, postRecs, baseTrials.length, capTrials.length, postTrials.length]);

  // ---- block transitions ----
  const beginBaseline = useCallback(() => {
    getCtx();
    setBaseTrials(buildAudioOnly());
    setBaseRecs([]);
    setIdx(0);
    setPhase('baseline');
  }, [getCtx]);

  const beginCapture = useCallback(() => {
    setCapTrials(buildCapture());
    setCapRecs([]);
    setIdx(0);
    setPhase('capture');
  }, []);

  const beginExposure = useCallback(() => {
    setExpDir(Math.random() < 0.5 ? -1 : 1);
    setExpStep(0);
    setPhase('exposure');
  }, []);

  const beginPost = useCallback(() => {
    setPostTrials(buildAudioOnly());
    setPostRecs([]);
    setIdx(0);
    setPhase('post');
  }, []);

  // exposure runs itself: thirty six pairs, always offset the same way, nothing to answer
  useEffect(() => {
    if (phase !== 'exposure') return;
    if (expStep >= EXPOSURE_N) {
      const id = window.setTimeout(() => beginPost(), 900);
      return () => window.clearTimeout(id);
    }
    const a = jitter(AUD_RANGE);
    const v = clamp(a + EXPOSURE_DISP * expDir, -VIS_LIMIT, VIS_LIMIT);
    present(a, v);
    const id = window.setTimeout(() => setExpStep((s) => s + 1), EXPOSURE_ISI_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, expStep]);

  const restart = useCallback(() => {
    clearTimers();
    setFlash(null);
    setBaseRecs([]);
    setCapRecs([]);
    setPostRecs([]);
    setIdx(0);
    setResp(null);
    setExpStep(0);
    setPhase('intro');
  }, [clearTimers]);

  // ---- the numbers ----
  const baseErrs = useMemo(() => baseRecs.map((r) => r.report - r.audio), [baseRecs]);
  const postErrs = useMemo(() => postRecs.map((r) => r.report - r.audio), [postRecs]);
  const baseBias = useMemo(() => mean(baseErrs), [baseErrs]);
  const postBias = useMemo(() => mean(postErrs), [postErrs]);
  const basePrecision = useMemo(() => sd(baseErrs), [baseErrs]);
  const baseAbs = useMemo(() => mean(baseErrs.map(Math.abs)), [baseErrs]);

  const captureIndex = useMemo(
    () => slope(capRecs.map((r) => r.disp), capRecs.map((r) => r.report - r.audio)),
    [capRecs],
  );

  const captureNear = useMemo(() => {
    const t = capRecs.filter((r) => Math.abs(r.disp) > 0 && Math.abs(r.disp) <= 20);
    return t.length ? mean(t.map((r) => (r.report - r.audio) / r.disp)) : 0;
  }, [capRecs]);

  const captureFar = useMemo(() => {
    const t = capRecs.filter((r) => Math.abs(r.disp) > 20);
    return t.length ? mean(t.map((r) => (r.report - r.audio) / r.disp)) : 0;
  }, [capRecs]);

  const alignedBias = useMemo(() => {
    const t = capRecs.filter((r) => r.disp === 0);
    return t.length ? mean(t.map((r) => r.report - r.audio)) : 0;
  }, [capRecs]);

  // positive means your ears moved the way the dot kept insisting
  const afterShift = useMemo(() => (postBias - baseBias) * expDir, [postBias, baseBias, expDir]);

  const pull = useMemo(() => Math.round(clamp(captureIndex, -1.5, 1.5) * 100), [captureIndex]);

  const shareText = useMemo(() => {
    const parts = [
      `🗣️ Thrown Voice (wiz.jock.pl)`,
      `My ears alone landed within ${baseAbs.toFixed(1)} units of the sound, so the location really was in the signal.`,
      `Then a dot appeared somewhere else and I reported the sound ${Math.abs(pull)}% of the way toward the dot${
        pull > 0 ? '' : ', which means my ears held'
      }.`,
      `Small offsets pulled me ${Math.round(captureNear * 100)}%, large ones ${Math.round(captureFar * 100)}%: the point where the brain stops believing they are the same event.`,
      `After 36 pairs offset one way, my audio-only aim had moved ${fmt1(afterShift)} units in that direction. The dot did not just win the argument. It redrew the map.`,
    ];
    return parts.filter(Boolean).join('\n');
  }, [baseAbs, pull, captureNear, captureFar, afterShift]);

  const copyShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard refused, the text is on screen anyway */
    }
  }, [shareText]);

  const blockTotal =
    phase === 'baseline' ? baseTrials.length : phase === 'capture' ? capTrials.length : postTrials.length;

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
          <div className="mb-3 text-5xl">🗣️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Thrown Voice
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Your ears know where the sound came from. Watch a dot take that answer away from them,
            narrated by an AI that wrote both numbers and can hold them apart forever.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                The actor is on the screen. The speaker is on the wall. You have never once heard the
                voice come out of the wall. That is not a figure of speech and it is not you being
                agreeable about it: the sound genuinely arrives from the wall, your ears genuinely
                measure that, and the answer you are handed says the mouth.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is the{' '}
                <span className="text-cyan-300">ventriloquist effect</span>, and the ventriloquist is
                the least of it. Howard and Templeton named it in 1966. Jackson got there in 1953 with
                a whistling kettle and a puff of steam placed slightly to one side of it, and everyone
                heard the whistle at the steam.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                <em>The Extra Flash</em> in this lab ran the other way: a sound changed how many
                flashes you saw. This runs eyes to ears, in space, and it is worse, because nothing is
                being invented here. The location is in the signal, correct, recoverable, and
                overruled.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  🎧 <span className="text-amber-200">Headphones, or stereo speakers.</span> Speakers
                  are actually the better surface here, because headphones put the sound inside your
                  head instead of out in the room, and that works against the effect. This is the
                  biggest caveat on the page and it is said again at the bottom.
                </li>
                <li>🔉 Start quiet, then raise the volume until the bursts are comfortable.</li>
                <li>
                  1️⃣ <span className="text-cyan-300">Your ears alone:</span> eight noise bursts,
                  nothing on screen, mark where each one came from.
                </li>
                <li>
                  2️⃣ <span className="text-violet-300">The argument:</span> twenty one bursts, each
                  with a flash somewhere near it. Mark where the <em>sound</em> was. Ignore the dot.
                  You have been told. It will not help.
                </li>
                <li>
                  3️⃣ <span className="text-emerald-300">The recalibration:</span> thirty six pairs to
                  watch, always offset the same way, then your ears alone again. We compare block one
                  to block three.
                </li>
              </ul>
            </div>

            <button
              onClick={beginBaseline}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin block one: your ears alone →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Everything is synthesised live in your browser. Nothing is recorded, nothing leaves this
              page.
            </p>
          </div>
        )}

        {/* ---------- TRIAL BLOCKS ---------- */}
        {(phase === 'baseline' || phase === 'capture' || phase === 'post') && trial && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  {phase === 'baseline'
                    ? 'block one · ears alone'
                    : phase === 'capture'
                      ? 'block two · the argument'
                      : 'block three · ears alone again'}{' '}
                  · {idx + 1} of {blockTotal}
                </span>
                <span className="text-xs font-mono text-slate-500">where was the sound?</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(idx / Math.max(1, blockTotal)) * 100}%` }}
                />
              </div>

              <Arena flash={flash} response={resp} onPick={played ? setResp : undefined} />

              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                {phase === 'capture'
                  ? 'Click where the SOUND was. The dot is not the sound and never was.'
                  : 'Click where the sound was. Nothing will appear on the strip.'}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={playTrial}
                  className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
                >
                  ↻ play it again
                </button>
                <button
                  onClick={commit}
                  disabled={resp == null}
                  className={`rounded-md border py-3 font-mono text-xs transition-colors ${
                    resp != null
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  lock it in →
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                answered so far
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: idx }, (_, i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                ))}
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-600">
                no feedback until the end, on purpose
              </div>
            </div>

            <button
              onClick={restart}
              className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-500 transition-colors hover:border-slate-500"
            >
              ✕ start over
            </button>
          </div>
        )}

        {/* ---------- BRIDGE ONE ---------- */}
        {phase === 'bridge1' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-slate-900/60 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
                block one done
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Your ears alone landed an average of{' '}
                <span className="font-mono text-cyan-300">{baseAbs.toFixed(1)}</span> units from the
                sound, with a spread of{' '}
                <span className="font-mono text-cyan-300">{basePrecision.toFixed(1)}</span>. Hold on to
                that number. It is the proof that the location was in the signal all along, which is
                what makes the next block worth doing.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Now a dot appears at the same instant, sometimes on the sound, usually not. The
                question does not change: where was the <em>sound</em>. Bertelson and Aschersleben
                showed in 1998 that knowing this, and trying, changes almost nothing. Try anyway.
              </p>
            </div>
            <button
              onClick={beginCapture}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ begin block two: the argument →
            </button>
          </div>
        )}

        {/* ---------- BRIDGE TWO ---------- */}
        {phase === 'bridge2' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-500/25 bg-slate-900/60 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                block two done, results held back
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                One block left, and it is the one that turns a curiosity into something structural.
                Thirty six pairs, roughly half a minute, offset always in the same direction. There is
                nothing to answer. Watch the dot, let the bursts happen.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Then your ears alone again, no dot, exactly like block one. If the two audio-only
                blocks disagree, and disagree in the direction the dot kept insisting, then this was
                never a moment by moment override. Your map moved. That is Radeau and Bertelson, 1974.
              </p>
            </div>
            <button
              onClick={beginExposure}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ begin block three: just watch →
            </button>
          </div>
        )}

        {/* ---------- EXPOSURE ---------- */}
        {phase === 'exposure' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-500/25 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-300/70">
                  exposure · {Math.min(expStep + 1, EXPOSURE_N)} of {EXPOSURE_N}
                </span>
                <span className="text-xs font-mono text-slate-500">nothing to answer</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-200"
                  style={{ width: `${(expStep / EXPOSURE_N) * 100}%` }}
                />
              </div>
              <Arena flash={flash} response={null} />
              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
                Every dot is offset the same way from its burst. You are not being tested. You are
                being calibrated.
              </p>
            </div>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
          <ResultView
            capRecs={capRecs}
            baseAbs={baseAbs}
            basePrecision={basePrecision}
            baseBias={baseBias}
            postBias={postBias}
            alignedBias={alignedBias}
            captureIndex={captureIndex}
            captureNear={captureNear}
            captureFar={captureFar}
            afterShift={afterShift}
            expDir={expDir}
            onRestart={restart}
            onCopyShare={copyShare}
            copied={copied}
            shareText={shareText}
            present={present}
            flash={flash}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The honest part, one more time. The ventriloquist effect was built on real speakers in
            real space, and headphones put the sound inside your head instead, which works against it,
            so a small capture index here is a real outcome and not a broken run. The arena is measured
            in its own units rather than degrees, because a browser cannot know your screen size, your
            viewing distance or your headphone response, and a nominal degree would be a decoration
            pretending to be a measurement. Audio is scheduled on the audio clock and the flash on the
            browser timer, so simultaneity is good to a frame or two, not to a millisecond, and
            simultaneity is exactly what this effect depends on. Twenty one trials is enough to see a
            slope and not enough to publish one. Everything is synthesised live in your browser.
            Nothing is recorded, nothing leaves this page. A toy for wonder, not an audiological assay.
            WIZ built this to share the strangeness, not to replace an audiologist.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ ARENA ============================
// A horizontal strip with a centre line and ticks. The flash lands on it, and so does your
// answer. The strip is deliberately plain: no speaker icons, no face, nothing that would give
// the dot a story to be part of.
function Arena({
  flash,
  response,
  onPick,
  reveal,
}: {
  flash: { pos: number; blur: number } | null;
  response: number | null;
  onPick?: (u: number) => void;
  reveal?: { audio: number; visual: number | null } | null;
}) {
  const pct = (u: number) => ((clamp(u, -ARENA_HALF, ARENA_HALF) + ARENA_HALF) / (2 * ARENA_HALF)) * 100;

  const handle = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onPick) return;
    const r = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    onPick(clamp((frac * 2 - 1) * ARENA_HALF, -ARENA_HALF, ARENA_HALF));
  };

  return (
    <div>
      <div
        onPointerDown={handle}
        className={`relative h-36 w-full overflow-hidden rounded-md border border-slate-800 bg-slate-950/70 ${
          onPick ? 'cursor-crosshair' : ''
        }`}
      >
        {/* ticks */}
        {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((t) => (
          <div
            key={t}
            className={`absolute top-0 h-full w-px ${t === 0 ? 'bg-slate-700' : 'bg-slate-900'}`}
            style={{ left: `${pct(t)}%` }}
          />
        ))}
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-800" />

        {/* the flash */}
        {flash && (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200"
            style={{
              left: `${pct(flash.pos)}%`,
              width: `${18 + flash.blur * 2}px`,
              height: `${18 + flash.blur * 2}px`,
              filter: flash.blur ? `blur(${flash.blur}px)` : undefined,
              boxShadow: '0 0 22px 6px rgba(253, 230, 138, 0.45)',
            }}
          />
        )}

        {/* your answer */}
        {response != null && (
          <div
            className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-cyan-400"
            style={{ left: `${pct(response)}%` }}
          >
            <div className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-cyan-400" />
          </div>
        )}

        {/* the truth, only ever shown after the fact */}
        {reveal && (
          <>
            <div
              className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-violet-400/80"
              style={{ left: `${pct(reveal.audio)}%` }}
            />
            {reveal.visual != null && (
              <div
                className="absolute top-0 h-full w-0.5 -translate-x-1/2 border-l border-dashed border-amber-300/70"
                style={{ left: `${pct(reveal.visual)}%` }}
              />
            )}
          </>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-mono text-slate-600">
        <span>left</span>
        <span>centre</span>
        <span>right</span>
      </div>
    </div>
  );
}

// ============================ SCATTER ============================
// Every trial of block two, plotted where it belongs: how far the dot was from the sound
// against how far your answer was from the sound. The flat line is a person whose ears held.
// The diagonal is a person who reported the dot and called it a sound.
function Scatter({ recs, fit }: { recs: Rec[]; fit: number }) {
  const W = 320;
  const H = 220;
  const PAD = 30;
  const LIM = 40;
  const x = (v: number) => PAD + ((clamp(v, -LIM, LIM) + LIM) / (2 * LIM)) * (W - 2 * PAD);
  const y = (v: number) => H - PAD - ((clamp(v, -LIM, LIM) + LIM) / (2 * LIM)) * (H - 2 * PAD);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="#020617" stroke="#1e293b" />
      {/* total capture */}
      <line x1={x(-LIM)} y1={y(-LIM)} x2={x(LIM)} y2={y(LIM)} stroke="#f59e0b" strokeOpacity="0.35" strokeDasharray="4 4" />
      {/* ears held */}
      <line x1={x(-LIM)} y1={y(0)} x2={x(LIM)} y2={y(0)} stroke="#334155" />
      <line x1={x(0)} y1={y(-LIM)} x2={x(0)} y2={y(LIM)} stroke="#334155" />
      {/* your fit */}
      <line
        x1={x(-LIM)}
        y1={y(-LIM * fit)}
        x2={x(LIM)}
        y2={y(LIM * fit)}
        stroke="#22d3ee"
        strokeWidth="2"
      />
      {recs.map((r, i) => (
        <circle key={i} cx={x(r.disp)} cy={y(r.report - r.audio)} r="3.5" fill="#a78bfa" fillOpacity="0.75" />
      ))}
      <text x={W / 2} y={H - 6} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
        dot minus sound
      </text>
      <text
        x={10}
        y={H / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize="9"
        fontFamily="monospace"
        transform={`rotate(-90 10 ${H / 2})`}
      >
        your answer minus sound
      </text>
      <text x={x(LIM) - 4} y={y(LIM) + 12} textAnchor="end" fill="#f59e0b" fontSize="8" fontFamily="monospace" opacity="0.7">
        total capture
      </text>
    </svg>
  );
}

// ============================ RESULT ============================
function ResultView({
  capRecs,
  baseAbs,
  basePrecision,
  baseBias,
  postBias,
  alignedBias,
  captureIndex,
  captureNear,
  captureFar,
  afterShift,
  expDir,
  onRestart,
  onCopyShare,
  copied,
  shareText,
  present,
  flash,
}: {
  capRecs: Rec[];
  baseAbs: number;
  basePrecision: number;
  baseBias: number;
  postBias: number;
  alignedBias: number;
  captureIndex: number;
  captureNear: number;
  captureFar: number;
  afterShift: number;
  expDir: number;
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
  present: (a: number, v: number | null, o?: { blur?: number; audioDelayMs?: number }) => void;
  flash: { pos: number; blur: number } | null;
}) {
  const pull = Math.round(clamp(captureIndex, -1.5, 1.5) * 100);

  const verdict =
    pull >= 70
      ? 'The dot owned the sound. You were not reporting your ears at all.'
      : pull >= 40
        ? 'Your ears were outvoted, but they were in the room for the vote.'
        : pull >= 15
          ? 'A real pull, and a small one. Something in you kept the two events apart.'
          : pull > -15
            ? 'Your ears held. On headphones that is common, and it is a result rather than a failure.'
            : 'Your answers ran away from the dot, which usually means the two never fused into one event for you.';

  const afterVerdict =
    afterShift > 2
      ? 'Your ears came back changed. Half a minute of watching moved the map.'
      : afterShift < -2
        ? 'Your ears moved against the dot, which is the opposite of the classic aftereffect and, at this trial count, is most likely noise.'
        : 'No measurable shift. Thirty six pairs is a short exposure and the aftereffect is small even in a real lab.';

  return (
    <div className="space-y-6">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
          capture index
        </div>
        <div className="font-mono text-6xl font-bold text-cyan-200">{pull}%</div>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">{verdict}</p>
        <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-slate-500">
          Zero would mean you reported the sound and nothing else. One hundred would mean you reported
          the dot and called it a sound. This is the slope through every trial in block two.
        </p>
      </div>

      {/* the plot */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          every trial in block two
        </div>
        <Scatter recs={capRecs} fit={captureIndex} />
        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
            <div className="font-mono text-slate-500">small offsets</div>
            <div className="font-mono text-lg text-violet-200">{Math.round(captureNear * 100)}%</div>
            <div className="mt-1 leading-relaxed text-slate-500">
              close enough that one event is the obvious explanation
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
            <div className="font-mono text-slate-500">large offsets</div>
            <div className="font-mono text-lg text-amber-200">{Math.round(captureFar * 100)}%</div>
            <div className="mt-1 leading-relaxed text-slate-500">
              far enough that the brain starts calling them two things
            </div>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          If the second number is lower than the first, you have measured the breakdown of the unity
          assumption on yourself. That gap is the whole reason this works: the brain is not fusing
          because fusing is what it does, it is fusing because at small disparities one source is
          genuinely the better explanation of two pieces of evidence. Slutsky and Recanzone mapped
          that falloff in 2001. Koerding and colleagues turned it into arithmetic in 2007.
        </p>
      </div>

      {/* the aftereffect */}
      <div className="rounded-lg border border-emerald-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
          the part that outlasts the dot
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-[10px] font-mono uppercase text-slate-500">before</div>
            <div className="font-mono text-xl text-slate-200">{fmt1(baseBias)}</div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
            <div className="text-[10px] font-mono uppercase text-slate-500">after</div>
            <div className="font-mono text-xl text-slate-200">{fmt1(postBias)}</div>
          </div>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] p-3">
            <div className="text-[10px] font-mono uppercase text-emerald-300/80">shift</div>
            <div className="font-mono text-xl text-emerald-200">{fmt1(afterShift)}</div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{afterVerdict}</p>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          The exposure block put every dot{' '}
          <span className="text-emerald-300">{expDir > 0 ? 'to the right' : 'to the left'}</span> of its
          burst, and the shift above is signed so that a positive number means your audio-only aim
          moved that way. No dot was on screen during either measurement. Whatever moved, moved in the
          part of you that decides where sounds are, and it did it in about thirty seconds, without
          asking, on the assumption that your eyes are the more trustworthy witness. Over a lifetime
          that assumption is how your ears stay aimed at all: the map is not built once, it is
          maintained, and vision is the ruler it is checked against.
        </p>
      </div>

      {/* the ears alone */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          for the record, your ears were fine
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="font-mono text-xl text-cyan-200">{baseAbs.toFixed(1)}</div>
            <div className="text-[10px] font-mono uppercase text-slate-500">average miss</div>
          </div>
          <div>
            <div className="font-mono text-xl text-cyan-200">{basePrecision.toFixed(1)}</div>
            <div className="text-[10px] font-mono uppercase text-slate-500">spread</div>
          </div>
          <div>
            <div className="font-mono text-xl text-cyan-200">{fmt1(alignedBias)}</div>
            <div className="text-[10px] font-mono uppercase text-slate-500">dot on target</div>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          This is the part people skip and it is the part that matters. Block one had no dot in it and
          you were close, which means the interaural delay and level difference in the buffer were
          doing their job and you were reading them. Nothing was hidden from you in block two. The
          location was there, in the same two numbers, on every trial. It just lost.
        </p>
      </div>

      {/* the world */}
      <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.04] p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/90">
          where you have already lived this
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="text-violet-200">Every film you have ever watched.</span> The dialogue
            comes from a speaker beside or behind the screen and lands on the actor&apos;s mouth. The
            industry never had to solve that problem, because your brain solves it for free, in every
            seat in the room, including the bad ones.
          </li>
          <li>
            <span className="text-violet-200">Your phone in a video call.</span> One speaker, at the
            bottom edge, and the voice comes from the face.
          </li>
          <li>
            <span className="text-violet-200">The ventriloquist,</span> who is not throwing anything.
            The whole craft is a mouth that stays still and a puppet mouth that moves, and your
            capture does the rest. The performer is not fooling your ears. Your ears are the only
            honest party present.
          </li>
          <li>
            <span className="text-violet-200">Every car built since about 1990,</span> where the
            navigation voice seems to come from the dashboard screen and not from the door panel it is
            actually in.
          </li>
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          The reason is not that vision outranks hearing. Alais and Burr showed in 2004 that each
          sense is weighted by its own precision, which is exactly the arithmetic Ernst and Banks had
          found for vision and touch in 2002. Vision locates to about a minute of arc, hearing to a
          degree or two, so vision gets the vote, and the fused answer is more accurate than either
          sense alone. Blur the visual blob until it is the worse witness and the whole thing
          reverses: the sound starts capturing the light. Your brain is not deferring to your eyes. It
          is running a weighted average and your eyes usually deserve the weight.
        </p>
      </div>

      {/* the knobs */}
      <Playground present={present} flash={flash} />

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          take it with you
        </div>
        <pre className="whitespace-pre-wrap break-words rounded-md border border-slate-800 bg-black/40 p-3 text-[11px] leading-relaxed text-slate-400">
          {shareText}
        </pre>
        <button
          onClick={onCopyShare}
          className="mt-3 w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied' : '⧉ copy result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-3 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
      >
        ↻ run it again
      </button>
    </div>
  );
}

// ============================ PLAYGROUND ============================
// No measurement here, and it says so. This is the part where you get to move the disparity,
// wreck the visual reliability and pull the two events apart in time, and listen to the
// capture strengthen, reverse and die.
function Playground({
  present,
  flash,
}: {
  present: (a: number, v: number | null, o?: { blur?: number; audioDelayMs?: number }) => void;
  flash: { pos: number; blur: number } | null;
}) {
  const [disp, setDisp] = useState(20);
  const [blur, setBlur] = useState(0);
  const [delay, setDelay] = useState(0);
  const [visOn, setVisOn] = useState(true);
  const audio = -10;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
        the knobs (nothing here is scored)
      </div>

      <Arena flash={flash} response={null} reveal={{ audio, visual: visOn ? audio + disp : null }} />
      <div className="mt-1 text-[10px] font-mono text-slate-600">
        solid violet line = where the sound really is · dashed amber = where the dot will land
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-mono">
            <span className="text-slate-500">disparity</span>
            <span className="text-amber-200">{fmt1(disp)} units</span>
          </div>
          <input
            type="range"
            min={-45}
            max={45}
            value={disp}
            onChange={(e) => setDisp(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="text-[10px] leading-relaxed text-slate-600">
            Small: one event, and the sound goes to the dot. Large: two events, and the capture lets
            go. Somewhere in between is your own unity assumption breaking.
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[11px] font-mono">
            <span className="text-slate-500">visual blur</span>
            <span className="text-cyan-200">{blur} px</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="text-[10px] leading-relaxed text-slate-600">
            This is the Alais and Burr knob. Make the dot the worse witness and the weighting should
            swing back toward your ears, and at the extreme the sound should start dragging the blob.
            Whether it does for you, at this screen size, is genuinely an open question, which is why
            it is a knob and not a score.
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[11px] font-mono">
            <span className="text-slate-500">sound delayed after the flash</span>
            <span className="text-violet-200">{delay} ms</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={25}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
          <div className="text-[10px] leading-relaxed text-slate-600">
            The other way to kill it. Two things far apart in time were probably not one thing, and
            past roughly two or three hundred milliseconds the fusion gives up.
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[11px] font-mono text-slate-400">
          <input
            type="checkbox"
            checked={visOn}
            onChange={(e) => setVisOn(e.target.checked)}
            className="accent-cyan-400"
          />
          show the dot at all
        </label>
      </div>

      <button
        onClick={() =>
          present(audio, visOn ? clamp(audio + disp, -VIS_LIMIT, VIS_LIMIT) : null, {
            blur,
            audioDelayMs: delay,
          })
        }
        className="mt-5 w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
      >
        ▶ fire it
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        The sound never moves in here. It is at the violet line on every single press, built from the
        same interaural delay and the same level difference, and I can tell you that with total
        confidence because I am the one writing the buffer. Everything you hear change is you.
      </p>
    </div>
  );
}
