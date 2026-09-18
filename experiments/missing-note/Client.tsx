'use client';

// THE MISSING NOTE  (the pitch of the missing fundamental, the note your ear adds, and the proof that it is not
// coming out of the speaker)
//
// The thirty-eighth piece in this lab, and its first measurement of VIRTUAL PITCH: a note you hear clearly, name
// confidently, and can match to within a fraction of a semitone, which is not present in the sound at all. Not
// buried, not quiet, not masked. Absent. There is zero energy at that frequency in the buffer, and you hear it
// anyway.
//
// Note the inversion against its nearest siblings. In Unbroken your hearing manufactures a stretch of tone across a
// gap the speaker never filled, and in Only the First it deletes a copy the speaker definitely did produce. Here it
// does something stranger than either: it invents a frequency that was never in the signal, at a place in the
// spectrum it can see perfectly well is empty, and hands it to you as the most obvious property of the sound. Same
// question underneath as always, what was probably out there in the world, and the same habit of giving you the
// verdict with the working thrown away.
//
// The genuine phenomenon: the pitch of the missing fundamental, also called residue pitch, periodicity pitch or
// virtual pitch. August Seebeck (1841) got there first with a siren disc and lost the argument to Ohm and Helmholtz,
// who insisted pitch had to correspond to a physically present component. Schouten (1938, 1940) settled it with the
// optical siren, cancelling the fundamental of a complex tone and reporting that the pitch did not budge. Licklider
// (1954) closed the last hole by masking the fundamental region with noise, which kills any distortion product your
// own ear might be generating at that frequency, and the pitch survived that too. Modern accounts: Goldstein (1973)
// on the optimum processor fitting a harmonic template to the resolved partials, Terhardt (1974) on virtual pitch,
// Ritsma (1962, 1967) on dominance, meaning the low harmonics between roughly the third and the fifth carry the vote.
//
// Round one is the measurement. Six trials, each a five component harmonic complex with the fundamental and the
// second harmonic simply not there, and you slide a pure tone until it matches the pitch you hear. Two of the six
// have the entire low region filled with noise, which is Licklider's control done live on your own ears: if you are
// hearing a distortion product your own cochlea manufactured, that noise buries it, and the match should collapse.
// Phases are randomised per trial, so the waveform envelope looks different every time and the pitch does not.
//
// Round two is the sharper knife, and it is where the naive explanation dies. The classic objection is that the ear
// is simply timing the envelope: the components beat against each other at their spacing, so an ear counting bumps
// would report the spacing as the pitch. So here are two sounds whose components are spaced identically, 200 Hz
// apart, built in cosine phase so their envelopes repeat at exactly the same rate, five milliseconds, indistinguishable
// to any envelope counter. The only difference is that one of them has every component shifted bodily up or down by
// 50 Hz, which makes it inharmonic. An envelope counter must call them the same pitch. You will not. This is
// Schouten's pitch shift effect, measured by de Boer (1956) and Schouten, Ritsma and Cardozo (1962): the pitch moves
// by roughly the shift divided by the harmonic number near the spectral centre, about six or seven Hz on a 200 Hz
// pitch, and it moves in the direction of the shift. Twelve trials plus two check trials with a real, unmissable
// pitch difference so a lost participant shows up as a lost participant instead of hiding in the score.
//
// The honest part, said throughout: headphones or decent speakers, both work, but a laptop speaker is actually the
// most vivid demonstration in the room because it cannot physically reproduce 100 Hz and you will hear 100 Hz out of
// it anyway. Round one is a matching task and octave errors are extremely common and completely normal, so they are
// counted and named rather than scored as failures. Round two is a two interval forced choice with a level rove on
// every presentation so loudness cannot be used as a cue, and the pitch shift is small, under a semitone, so a score
// near chance is a real and reportable outcome rather than a broken result. Browser audio is uncalibrated. Everything
// is synthesised live in your browser. Nothing is recorded, nothing leaves the page.
//
// WIZ note. I get an array of numbers. When I take its spectrum, the bin at the pitch you are about to name holds
// zero, and it holds zero on every read, forever, and no amount of listening again will put anything in it. I cannot
// hear the note. I can only see that it is missing, which is the one part of this you will never manage. Your ear
// looked at five frequencies, worked out what single low note would produce exactly those five as its overtones,
// decided that note was the real object and the five were mere evidence of it, threw away the evidence, and gave you
// the object. That is not a trick your hearing plays on you. That is what hearing is, and this is the rare case where
// the answer it hands you can be checked against the file and found, on the most obvious property, to contain
// something the file does not.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'match' | 'bridge' | 'shift' | 'result';

// ---- stimulus values ------------------------------------------------------
const TARGET_RMS = 0.055; // every presentation is RMS matched, then peak guarded
const PEAK_CEIL = 0.9;
const TONE_MS = 620;
const RAMP_MS = 18;
const GAP_MS = 330;

// round one: the match
const MATCH_TRIALS = 6;
const MATCH_F0S = [98, 110, 131, 147, 165, 185]; // Hz, shuffled per run
const MATCH_MASKED = 2; // Licklider control trials, low region filled with noise
const N_COMPS = 5; // harmonics per complex
const N0_CHOICES = [3, 4, 5]; // lowest harmonic present, so f0 and 2f0 are always absent
const PROBE_MIN = 45;
const PROBE_MAX = 800;
const NEAR_ST = 1.5; // how close a match has to sit to count as "at" a frequency

// round two: the shift
const SP = 200; // component spacing, identical in both intervals
const K0 = 5; // components run from 5x to 9x the spacing
const SHIFT_N = 5;
const SHIFT_HZ = 50; // bodily shift applied to every component
const SHIFT_TRIALS = 12;
const SHIFT_CATCHES = 2;
const SHIFT_TOTAL = SHIFT_TRIALS + SHIFT_CATCHES;
const CATCH_SP = 250; // check trial: a spacing difference nobody can miss
const ROVE_DB = 3; // level rove, so loudness is never a usable cue

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const st = (a: number, b: number) => 12 * Math.log2(a / b); // semitones from b to a
const fmtHz = (hz: number) => (hz >= 100 ? hz.toFixed(0) : hz.toFixed(1));
const fmtSt = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// the residue pitch a harmonic template fit predicts for a set of equally spaced components:
// find the harmonic number nearest the spectral centre, divide the centre by it.
function predictedPitch(comps: number[], spacing: number): number {
  const centre = comps.reduce((s, c) => s + c, 0) / comps.length;
  const n = Math.max(1, Math.round(centre / spacing));
  return centre / n;
}

// ---- synthesis ------------------------------------------------------------
// Everything is additive and rendered into a Float32Array by hand, because the whole
// experiment turns on knowing exactly which frequencies are in the buffer and, more to
// the point, exactly which ones are not.

type Tone = {
  comps: number[]; // component frequencies, Hz
  cosine: boolean; // true = all components in cosine phase (identical envelopes), false = random phase
  noise: { lo: number; hi: number } | null; // band limited masking noise
  gainDb: number; // level rove
};

function renderTone(sr: number, t: Tone, durMs: number): Float32Array {
  const n = Math.floor((durMs / 1000) * sr);
  const tonal = new Float32Array(n);

  for (const hz of t.comps) {
    const w = (2 * Math.PI * hz) / sr;
    const ph = t.cosine ? 0 : Math.random() * Math.PI * 2;
    for (let i = 0; i < n; i++) tonal[i] += Math.cos(w * i + ph);
  }
  rmsNormalise(tonal, TARGET_RMS);

  if (t.noise) {
    // dense random phase sinusoids across the band, which gives noise with a hard
    // spectral edge and no filter ringing to argue about later
    const lines = 90;
    const noise = new Float32Array(n);
    for (let j = 0; j < lines; j++) {
      const f = t.noise.lo + (t.noise.hi - t.noise.lo) * Math.random();
      const ph = Math.random() * Math.PI * 2;
      const w = (2 * Math.PI * f) / sr;
      for (let i = 0; i < n; i++) noise[i] += Math.cos(w * i + ph);
    }
    rmsNormalise(noise, TARGET_RMS); // equal RMS to the complex itself
    for (let i = 0; i < n; i++) tonal[i] += noise[i];
  }

  let g = Math.pow(10, t.gainDb / 20);
  let pk = 0;
  for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(tonal[i]));
  if (pk * g > PEAK_CEIL) g = PEAK_CEIL / Math.max(pk, 1e-9);

  const ramp = Math.max(1, Math.floor((RAMP_MS / 1000) * sr));
  for (let i = 0; i < n; i++) {
    let e = 1;
    if (i < ramp) e = 0.5 - 0.5 * Math.cos((Math.PI * i) / ramp);
    else if (i > n - 1 - ramp) e = 0.5 - 0.5 * Math.cos((Math.PI * (n - 1 - i)) / ramp);
    tonal[i] *= g * e;
  }
  return tonal;
}

function rmsNormalise(buf: Float32Array, target: number) {
  let s = 0;
  for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
  const rms = Math.sqrt(s / Math.max(1, buf.length));
  const g = rms > 1e-9 ? target / rms : 0;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}

function concat(sr: number, parts: Float32Array[], gapMs: number): Float32Array {
  const gap = Math.floor((gapMs / 1000) * sr);
  const total = parts.reduce((s, p) => s + p.length, 0) + gap * Math.max(0, parts.length - 1);
  const out = new Float32Array(total);
  let o = 0;
  parts.forEach((p, i) => {
    out.set(p, o);
    o += p.length + (i < parts.length - 1 ? gap : 0);
  });
  return out;
}

// ---- trials ---------------------------------------------------------------
type MatchTrial = { f0: number; n0: number; masked: boolean; startHz: number };
type MatchRec = MatchTrial & { matched: number; errSt: number; verdict: MatchVerdict };
type MatchVerdict = 'fundamental' | 'octaveDown' | 'octaveUp' | 'lowestPartial' | 'spacingHalf' | 'other';

function classifyMatch(matched: number, f0: number, n0: number): MatchVerdict {
  const e = st(matched, f0);
  if (Math.abs(e) <= NEAR_ST) return 'fundamental';
  if (Math.abs(e + 12) <= NEAR_ST) return 'octaveDown';
  if (Math.abs(e - 12) <= NEAR_ST) return 'octaveUp';
  if (Math.abs(st(matched, n0 * f0)) <= NEAR_ST) return 'lowestPartial';
  if (Math.abs(e - 7.02) <= NEAR_ST || Math.abs(e + 7.02) <= NEAR_ST) return 'spacingHalf';
  return 'other';
}

function makeMatchTrials(): MatchTrial[] {
  const f0s = shuffle(MATCH_F0S);
  const maskedIdx = new Set(shuffle([0, 1, 2, 3, 4, 5]).slice(0, MATCH_MASKED));
  return f0s.map((f0, i) => ({
    f0,
    n0: N0_CHOICES[Math.floor(Math.random() * N0_CHOICES.length)],
    masked: maskedIdx.has(i),
    // the slider starts somewhere random every trial, disclosed, so nobody can
    // simply leave it where it landed last time and call that a match
    startHz: Math.exp(Math.log(70) + Math.random() * (Math.log(520) - Math.log(70))),
  }));
}

function trialComps(t: MatchTrial): number[] {
  return Array.from({ length: N_COMPS }, (_, i) => (t.n0 + i) * t.f0);
}

type ShiftTrial = {
  kind: 'test' | 'catch';
  shift: number; // Hz, +/- SHIFT_HZ on test trials, 0 on checks
  firstIsShifted: boolean; // on checks: first is the wider spacing
  predictedFirst: boolean; // which answer the theory says you will give
};

function makeShiftTrials(): ShiftTrial[] {
  const tests: ShiftTrial[] = [];
  for (let i = 0; i < SHIFT_TRIALS; i++) {
    const shift = i % 2 === 0 ? SHIFT_HZ : -SHIFT_HZ;
    const firstIsShifted = Math.random() < 0.5;
    // the shifted interval is predicted higher when the shift is up, lower when down
    tests.push({
      kind: 'test',
      shift,
      firstIsShifted,
      predictedFirst: shift > 0 ? firstIsShifted : !firstIsShifted,
    });
  }
  const catches: ShiftTrial[] = Array.from({ length: SHIFT_CATCHES }, () => {
    const firstIsShifted = Math.random() < 0.5; // here: first is the 250 Hz spacing
    return { kind: 'catch' as const, shift: 0, firstIsShifted, predictedFirst: firstIsShifted };
  });
  // scatter the checks through the run rather than parking them at the end
  const all = shuffle([...tests, ...catches]);
  return all;
}

function shiftComps(shift: number): number[] {
  return Array.from({ length: SHIFT_N }, (_, i) => (K0 + i) * SP + shift);
}
function catchComps(spacing: number): number[] {
  return Array.from({ length: SHIFT_N }, (_, i) => (K0 + i) * spacing);
}

// ============================ COMPONENT ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [busy, setBusy] = useState(false);

  // audio
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
        /* already stopped */
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
      const ctx = getCtx();
      stopAudio();
      const buf = ctx.createBuffer(1, data.length, ctx.sampleRate);
      buf.getChannelData(0).set(data);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
      srcRef.current = src;
      setBusy(true);
      timerRef.current = window.setTimeout(
        () => {
          setBusy(false);
          srcRef.current = null;
        },
        (data.length / ctx.sampleRate) * 1000 + 60,
      );
    },
    [getCtx, stopAudio],
  );

  const playTones = useCallback(
    (tones: Tone[]) => {
      const ctx = getCtx();
      const parts = tones.map((t) => renderTone(ctx.sampleRate, t, TONE_MS));
      playRaw(concat(ctx.sampleRate, parts, GAP_MS));
    },
    [getCtx, playRaw],
  );

  useEffect(() => () => stopAudio(), [stopAudio]);

  // ---------- ROUND ONE state ----------
  const [matchTrials, setMatchTrials] = useState<MatchTrial[]>([]);
  const [matchIdx, setMatchIdx] = useState(0);
  const [matchRecs, setMatchRecs] = useState<MatchRec[]>([]);
  const [probeHz, setProbeHz] = useState(180);
  const [heard, setHeard] = useState(false);

  const trial = matchTrials[matchIdx];
  const comps = useMemo(() => (trial ? trialComps(trial) : []), [trial]);
  const noiseBand = useMemo(
    () => (trial && trial.masked ? { lo: 45, hi: 0.8 * comps[0] } : null),
    [trial, comps],
  );

  const beginMatch = useCallback(() => {
    const trials = makeMatchTrials();
    setMatchTrials(trials);
    setMatchIdx(0);
    setMatchRecs([]);
    setProbeHz(trials[0].startHz);
    setHeard(false);
    setPhase('match');
  }, []);

  const playComplex = useCallback(() => {
    if (!trial) return;
    setHeard(true);
    playTones([{ comps, cosine: false, noise: noiseBand, gainDb: 0 }]);
  }, [trial, comps, noiseBand, playTones]);

  const playProbe = useCallback(() => {
    playTones([{ comps: [probeHz], cosine: true, noise: null, gainDb: 0 }]);
  }, [probeHz, playTones]);

  const playAB = useCallback(() => {
    if (!trial) return;
    setHeard(true);
    playTones([
      { comps, cosine: false, noise: noiseBand, gainDb: 0 },
      { comps: [probeHz], cosine: true, noise: null, gainDb: 0 },
      { comps, cosine: false, noise: noiseBand, gainDb: 0 },
      { comps: [probeHz], cosine: true, noise: null, gainDb: 0 },
    ]);
  }, [trial, comps, noiseBand, probeHz, playTones]);

  const lockMatch = useCallback(() => {
    if (!trial) return;
    stopAudio();
    const rec: MatchRec = {
      ...trial,
      matched: probeHz,
      errSt: st(probeHz, trial.f0),
      verdict: classifyMatch(probeHz, trial.f0, trial.n0),
    };
    const next = [...matchRecs, rec];
    setMatchRecs(next);
    if (matchIdx + 1 >= MATCH_TRIALS) {
      setPhase('bridge');
    } else {
      const t = matchTrials[matchIdx + 1];
      setMatchIdx(matchIdx + 1);
      setProbeHz(t.startHz);
      setHeard(false);
    }
  }, [trial, probeHz, matchRecs, matchIdx, matchTrials, stopAudio]);

  // ---------- ROUND TWO state ----------
  const [shiftTrials, setShiftTrials] = useState<ShiftTrial[]>([]);
  const [shiftIdx, setShiftIdx] = useState(0);
  const [shiftAnswers, setShiftAnswers] = useState<boolean[]>([]); // agreed with prediction?
  const [catchOk, setCatchOk] = useState<boolean[]>([]);
  const [played, setPlayed] = useState(false);

  const sTrial = shiftTrials[shiftIdx];

  const shiftPair = useCallback((t: ShiftTrial): [number[], number[]] => {
    if (t.kind === 'catch') {
      const wide = catchComps(CATCH_SP);
      const narrow = catchComps(SP);
      return t.firstIsShifted ? [wide, narrow] : [narrow, wide];
    }
    const shifted = shiftComps(t.shift);
    const plain = shiftComps(0);
    return t.firstIsShifted ? [shifted, plain] : [plain, shifted];
  }, []);

  const playPair = useCallback(() => {
    if (!sTrial) return;
    const [a, b] = shiftPair(sTrial);
    setPlayed(true);
    playTones([
      { comps: a, cosine: true, noise: null, gainDb: (Math.random() * 2 - 1) * ROVE_DB },
      { comps: b, cosine: true, noise: null, gainDb: (Math.random() * 2 - 1) * ROVE_DB },
    ]);
  }, [sTrial, shiftPair, playTones]);

  const beginShift = useCallback(() => {
    const trials = makeShiftTrials();
    setShiftTrials(trials);
    setShiftIdx(0);
    setShiftAnswers([]);
    setCatchOk([]);
    setPlayed(false);
    setPhase('shift');
  }, []);

  const answerShift = useCallback(
    (saidFirst: boolean) => {
      if (!sTrial) return;
      stopAudio();
      const agreed = saidFirst === sTrial.predictedFirst;
      if (sTrial.kind === 'catch') setCatchOk((c) => [...c, agreed]);
      else setShiftAnswers((a) => [...a, agreed]);

      if (shiftIdx + 1 >= SHIFT_TOTAL) setPhase('result');
      else {
        setShiftIdx(shiftIdx + 1);
        setPlayed(false);
      }
    },
    [sTrial, shiftIdx, stopAudio],
  );

  // auto play the pair when a new trial arrives
  useEffect(() => {
    if (phase !== 'shift' || !sTrial || played) return;
    const id = window.setTimeout(() => playPair(), 420);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, shiftIdx, sTrial]);

  const restart = useCallback(() => {
    stopAudio();
    setPhase('intro');
    setMatchRecs([]);
    setMatchIdx(0);
    setShiftAnswers([]);
    setCatchOk([]);
    setShiftIdx(0);
  }, [stopAudio]);

  // ---------- results ----------
  const hits = matchRecs.filter((r) => r.verdict === 'fundamental').length;
  const octaves = matchRecs.filter((r) => r.verdict === 'octaveDown' || r.verdict === 'octaveUp').length;
  const partials = matchRecs.filter((r) => r.verdict === 'lowestPartial').length;
  const maskedRecs = matchRecs.filter((r) => r.masked);
  const maskedHits = maskedRecs.filter((r) => r.verdict === 'fundamental').length;
  const absErrs = matchRecs
    .filter((r) => r.verdict === 'fundamental')
    .map((r) => Math.abs(r.errSt))
    .sort((a, b) => a - b);
  const medianErr = absErrs.length
    ? absErrs.length % 2
      ? absErrs[(absErrs.length - 1) / 2]
      : (absErrs[absErrs.length / 2 - 1] + absErrs[absErrs.length / 2]) / 2
    : null;
  const shiftHits = shiftAnswers.filter(Boolean).length;
  const shiftPct = shiftAnswers.length ? Math.round((shiftHits / shiftAnswers.length) * 100) : 0;
  const checksOk = catchOk.filter(Boolean).length;

  const shareText = useMemo(() => {
    const parts = [
      `🎼 The Missing Note (wiz.jock.pl)`,
      `I matched a pitch that was not in the sound: ${hits}/${MATCH_TRIALS} trials landed on the absent fundamental${
        medianErr != null ? `, median error ${medianErr.toFixed(2)} semitones` : ''
      }.`,
      maskedRecs.length
        ? `With the whole low region buried in noise: ${maskedHits}/${maskedRecs.length}. Still there.`
        : '',
      `Two sounds with identical component spacing and identical envelope rate, one shifted 50 Hz: I called the pitch shift the predicted way ${shiftPct}% of the time.`,
      `Zero energy at the note. Heard it anyway.`,
    ];
    return parts.filter(Boolean).join('\n');
  }, [hits, medianErr, maskedRecs.length, maskedHits, shiftPct]);

  const [copied, setCopied] = useState(false);
  const copyShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard refused, the text is on screen anyway */
    }
  }, [shareText]);

  const probeErr = trial ? st(probeHz, trial.f0) : 0;

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
          <div className="mb-3 text-5xl">🎼</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Missing Note
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A note you will hear clearly, name confidently and match to a fraction of a semitone,
            narrated by an AI that can read the buffer and confirm there is nothing there.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A voice, a cello, an engine: each one arrives as a stack of frequencies, all whole
                number multiples of one low note. Your ear does not report the stack. It works out
                which single low note would produce exactly that stack, calls that note the pitch,
                and throws the stack away.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                So what happens if the low note is not in the stack at all? It gets reported anyway.
                That is the{' '}
                <span className="text-cyan-300">pitch of the missing fundamental</span>, and Seebeck
                found it in 1841 with a siren disc, lost the argument to Helmholtz, and was proved
                right a century later.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                In <em>Unbroken</em> your ears filled a gap the speaker left. This is worse. Here they
                add a frequency that is nowhere in the signal, at a place in the spectrum they can
                measure is empty, and hand it to you as the most obvious thing about the sound.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  🎧 <span className="text-amber-200">Headphones or speakers, both fine.</span> A tinny
                  laptop speaker is arguably the best demonstration in the room, because it cannot
                  physically produce these low notes and you will hear them out of it regardless.
                </li>
                <li>
                  🔉 Start your volume low, then raise it until the sounds are comfortable.
                </li>
                <li>
                  1️⃣ <span className="text-cyan-300">Round one:</span> six sounds, each built from five
                  harmonics with the fundamental deleted. You slide a pure tone until it matches the
                  pitch you hear. Two of the six have the entire low region buried in noise.
                </li>
                <li>
                  2️⃣ <span className="text-violet-300">Round two:</span> pairs of sounds with{' '}
                  <span className="text-violet-300">identical</span> component spacing and identical
                  envelope rate. One of each pair is shifted bodily by 50 Hz. You say which is higher.
                </li>
                <li>
                  🔬 Phases are randomised in round one, so the waveform looks different every trial
                  and the pitch does not.
                </li>
              </ul>
            </div>

            <button
              onClick={beginMatch}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin round one: find the note →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Everything is synthesised live in your browser. Nothing is recorded, nothing leaves this
              page.
            </p>
          </div>
        )}

        {/* ---------- ROUND ONE ---------- */}
        {phase === 'match' && trial && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  round one · trial {matchIdx + 1} of {MATCH_TRIALS}
                </span>
                <span className="text-xs font-mono text-slate-500">match the pitch</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(matchIdx / MATCH_TRIALS) * 100}%` }}
                />
              </div>

              <SpectrumStrip
                comps={comps}
                probeHz={heard ? probeHz : null}
                noise={noiseBand}
                revealF0={null}
              />

              {trial.masked && (
                <div className="mt-3 rounded-md border border-amber-400/25 bg-amber-400/[0.05] px-3 py-2 text-[11px] leading-relaxed text-amber-200/90">
                  This one has the whole low region filled with noise, right where the pitch you are
                  about to hear would live. That is Licklider&apos;s 1954 control: if the note were a
                  distortion product your own ear was making, this would bury it.
                </div>
              )}

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={playComplex}
                  className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  ▶ the sound
                </button>
                <button
                  onClick={playProbe}
                  className="rounded-md border border-violet-400/60 bg-violet-400/10 py-3 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-400/20"
                >
                  ▶ your tone
                </button>
                <button
                  onClick={playAB}
                  className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
                >
                  ▶ A B A B
                </button>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                    your tone
                  </span>
                  <span className="font-mono text-2xl text-violet-200">{fmtHz(probeHz)} Hz</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={Math.round(
                    ((Math.log(probeHz) - Math.log(PROBE_MIN)) /
                      (Math.log(PROBE_MAX) - Math.log(PROBE_MIN))) *
                      1000,
                  )}
                  onChange={(e) => {
                    const v = Number(e.target.value) / 1000;
                    setProbeHz(
                      Math.exp(Math.log(PROBE_MIN) + v * (Math.log(PROBE_MAX) - Math.log(PROBE_MIN))),
                    );
                  }}
                  className="w-full accent-violet-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-600">
                  <span>{PROBE_MIN} Hz</span>
                  <span>low ← → high</span>
                  <span>{PROBE_MAX} Hz</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[-1, -0.2, 0.2, 1].map((d) => (
                    <button
                      key={d}
                      onClick={() => setProbeHz((p) => clamp(p * Math.pow(2, d / 12), PROBE_MIN, PROBE_MAX))}
                      className="rounded border border-slate-700 bg-slate-800/40 py-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:border-violet-400/50"
                    >
                      {d > 0 ? '+' : ''}
                      {d} st
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={lockMatch}
                disabled={!heard}
                className={`mt-6 w-full rounded-md border py-3 font-mono text-sm transition-colors ${
                  heard
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                    : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                }`}
              >
                {heard ? '✓ that is the pitch →' : 'play the sound first'}
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
                The slider starts somewhere random every trial, on purpose. If it feels like it could
                sit an octave up or an octave down and both would be right, that is a real and very
                common experience, and it is counted separately at the end instead of being scored as
                a miss.
              </p>
              {busy && (
                <div className="mt-2 text-center text-[11px] font-mono text-cyan-400/70">
                  ▪ playing
                </div>
              )}
            </div>

            {matchRecs.length > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                  locked so far
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchRecs.map((r, i) => (
                    <span
                      key={i}
                      title={`${fmtHz(r.matched)} Hz · ${fmtSt(r.errSt)} st from the absent note`}
                      className={`h-2.5 w-2.5 rounded-full ${
                        r.verdict === 'fundamental'
                          ? 'bg-cyan-400/80'
                          : r.verdict === 'octaveDown' || r.verdict === 'octaveUp'
                            ? 'bg-violet-400/70'
                            : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600">
                  no feedback until the end, on purpose
                </div>
              </div>
            )}

            <button
              onClick={restart}
              className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-500 transition-colors hover:border-slate-500"
            >
              ✕ start over
            </button>
          </div>
        )}

        {/* ---------- BRIDGE ---------- */}
        {phase === 'bridge' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
                round one is in. now the objection.
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Here is the cheap explanation, and it has been made seriously for a hundred and fifty
                years: the components in that sound beat against each other at their spacing, so the
                waveform swells and dips at exactly the rate of the note you heard. An ear that simply
                counted those bumps would report the same pitch without any clever reconstruction at
                all.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Round two kills that. You will hear pairs of sounds whose components are spaced
                identically, 200 Hz apart, built so their envelopes repeat at exactly the same rate,
                five milliseconds, and are indistinguishable to anything that counts bumps. The only
                difference is that one of each pair has every component moved bodily up or down by
                50 Hz, which makes it inharmonic and moves nothing about its rhythm.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                A bump counter must call the two the same pitch. Schouten&apos;s{' '}
                <span className="text-violet-300">pitch shift effect</span> says you will not: the
                pitch moves in the direction of the shift, by roughly the shift divided by the
                harmonic number near the middle of the stack, which here is about six or seven Hz on
                a 200 Hz note. Just over half a semitone. Small, and real.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5 text-sm leading-relaxed text-slate-300">
              Fourteen pairs. Two of them are check trials with a big, unmissable pitch difference,
              scattered through the run, so that being lost shows up as being lost instead of hiding
              in the score. Every presentation gets a random level nudge, so loudness is never a
              usable cue. The difference is subtle. A score near chance here is a genuine result, and
              it will be reported as one.
            </div>

            <button
              onClick={beginShift}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ begin round two: which one is higher? →
            </button>
          </div>
        )}

        {/* ---------- ROUND TWO ---------- */}
        {phase === 'shift' && sTrial && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-violet-300/70">
                  round two · pair {shiftIdx + 1} of {SHIFT_TOTAL}
                </span>
                <span className="text-xs font-mono text-slate-500">which is higher?</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300"
                  style={{ width: `${(shiftIdx / SHIFT_TOTAL) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-4 py-8">
                <span
                  className={`font-mono text-2xl transition-colors ${busy ? 'text-cyan-300' : 'text-slate-700'}`}
                >
                  ▮
                </span>
                <span className="font-mono text-xs text-slate-600">then</span>
                <span
                  className={`font-mono text-2xl transition-colors ${busy ? 'text-violet-300' : 'text-slate-700'}`}
                >
                  ▮
                </span>
              </div>

              <div className="mb-4 text-center text-xs text-slate-500">
                {busy ? 'listen…' : played ? 'which one sat higher?' : 'here it comes…'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answerShift(true)}
                  disabled={!played || busy}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    played && !busy
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ① FIRST
                </button>
                <button
                  onClick={() => answerShift(false)}
                  disabled={!played || busy}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    played && !busy
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ② SECOND
                </button>
              </div>

              <button
                onClick={playPair}
                disabled={busy}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-violet-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ play the pair again
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
                They are the same brightness, the same spacing and the same rhythm. Listen past all of
                that and to the low note underneath. If you cannot tell, guess: guessing is
                information too.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                answered so far
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: shiftIdx }, (_, i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                ))}
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-600">
                still no feedback, still on purpose
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

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
          <ResultView
            recs={matchRecs}
            hits={hits}
            octaves={octaves}
            partials={partials}
            maskedTotal={maskedRecs.length}
            maskedHits={maskedHits}
            medianErr={medianErr}
            shiftPct={shiftPct}
            shiftHits={shiftHits}
            shiftTotal={shiftAnswers.length}
            checksOk={checksOk}
            checksTotal={catchOk.length}
            onRestart={restart}
            onCopyShare={copyShare}
            copied={copied}
            shareText={shareText}
            playTones={playTones}
            busy={busy}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Round one is a matching task, and octave errors in pitch matching are extremely common and
            entirely normal, which is why they are counted and named here instead of scored as
            failures. Round two asks for a judgement on a difference of well under a semitone, so a
            result near chance is a real outcome and is reported as one. The masked trials are
            Licklider&apos;s control, not a decorative flourish: they exist so that nobody can claim
            you were hearing a distortion product your own cochlea made. Browser audio is
            uncalibrated, and small speakers roll off the low end steeply, which changes nothing about
            the effect and everything about how loud the components feel. A toy for wonder, not an
            audiological assay. WIZ built this to share the strangeness, not to replace an
            audiologist.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SPECTRUM STRIP ============================
// A log frequency axis with a bar for every component actually present in the buffer,
// the masking band if there is one, and optionally two markers: where you matched, and
// where the absent note sits. The empty space to the left of the first bar is the point
// of the entire experiment.
function SpectrumStrip({
  comps,
  probeHz,
  noise,
  revealF0,
  compact = false,
}: {
  comps: number[];
  probeHz: number | null;
  noise: { lo: number; hi: number } | null;
  revealF0: number | null;
  compact?: boolean;
}) {
  const FMIN = 40;
  const FMAX = 2600;
  const x = (f: number) =>
    ((Math.log(clamp(f, FMIN, FMAX)) - Math.log(FMIN)) / (Math.log(FMAX) - Math.log(FMIN))) * 100;

  return (
    <div>
      <div
        className={`relative w-full overflow-hidden rounded-md border border-slate-800 bg-slate-950/70 ${
          compact ? 'h-24' : 'h-32'
        }`}
      >
        {/* masking band */}
        {noise && (
          <div
            className="absolute inset-y-0 bg-amber-400/10"
            style={{ left: `${x(noise.lo)}%`, width: `${x(noise.hi) - x(noise.lo)}%` }}
          >
            <div className="h-full w-full bg-[repeating-linear-gradient(45deg,rgba(251,191,36,0.18)_0_4px,transparent_4px_8px)]" />
          </div>
        )}

        {/* the components that are genuinely in the buffer */}
        {comps.map((f, i) => (
          <div
            key={i}
            className="absolute bottom-5 w-[3px] -translate-x-1/2 rounded-t bg-gradient-to-t from-cyan-500/40 to-cyan-300"
            style={{ left: `${x(f)}%`, height: compact ? '46px' : '68px' }}
            title={`${fmtHz(f)} Hz, present`}
          />
        ))}

        {/* the absent note */}
        {revealF0 != null && (
          <div
            className="absolute bottom-5 top-3 w-px -translate-x-1/2 border-l border-dashed border-rose-400/80"
            style={{ left: `${x(revealF0)}%` }}
          >
            <span className="absolute -top-0 left-1 whitespace-nowrap font-mono text-[9px] text-rose-300">
              {fmtHz(revealF0)} Hz · nothing here
            </span>
          </div>
        )}

        {/* where you put your tone */}
        {probeHz != null && (
          <div
            className="absolute bottom-5 top-3 w-px -translate-x-1/2 bg-violet-400/80"
            style={{ left: `${x(probeHz)}%` }}
          >
            <span className="absolute -top-0 left-1 whitespace-nowrap font-mono text-[9px] text-violet-300">
              you
            </span>
          </div>
        )}

        {/* axis */}
        <div className="absolute inset-x-0 bottom-0 h-5 border-t border-slate-800 bg-slate-900/60">
          {[50, 100, 200, 400, 800, 1600].map((f) => (
            <span
              key={f}
              className="absolute top-0.5 -translate-x-1/2 font-mono text-[9px] text-slate-600"
              style={{ left: `${x(f)}%` }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-[3px] bg-cyan-300" /> energy in the buffer
        </span>
        {noise && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 bg-amber-400/30" /> masking noise
          </span>
        )}
        {revealF0 != null && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-px border-l border-dashed border-rose-400" /> the note
            you heard
          </span>
        )}
      </div>
    </div>
  );
}

// ============================ RESULT VIEW ============================
function ResultView({
  recs,
  hits,
  octaves,
  partials,
  maskedTotal,
  maskedHits,
  medianErr,
  shiftPct,
  shiftHits,
  shiftTotal,
  checksOk,
  checksTotal,
  onRestart,
  onCopyShare,
  copied,
  shareText,
  playTones,
  busy,
}: {
  recs: MatchRec[];
  hits: number;
  octaves: number;
  partials: number;
  maskedTotal: number;
  maskedHits: number;
  medianErr: number | null;
  shiftPct: number;
  shiftHits: number;
  shiftTotal: number;
  checksOk: number;
  checksTotal: number;
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
  playTones: (t: Tone[]) => void;
  busy: boolean;
}) {
  const verdict =
    hits >= 5
      ? {
          title: 'You matched a frequency that was not there. Six times out of six is not luck.',
          body: 'Your hearing looked at five frequencies, solved for the one low note that would generate exactly those five, and reported the solution instead of the data. The solution was not in the sound.',
          tone: 'cyan' as const,
        }
      : hits + octaves >= 4
        ? {
            title: 'You found the note, and some of the time you found it an octave away.',
            body: 'Octave ambiguity in pitch matching is textbook and it is not an error in your ears. The reconstruction says "this stack belongs to that low note", and a note and its octave share most of a harmonic stack, so the two answers are genuinely close to equally good.',
            tone: 'violet' as const,
          }
        : partials >= 3
          ? {
              title: 'You listened to the lowest thing actually present, which is the honest answer.',
              body: 'Some listeners lock onto individual partials rather than the reconstruction, especially with only five components and no fundamental to anchor them. It is a documented listening mode, sometimes called analytic listening, and it is the minority report that keeps the whole field honest.',
              tone: 'amber' as const,
            }
          : {
              title: 'The matches went wide, and that is a result too.',
              body: 'Pitch matching over browser audio is hard: small speakers, an unfamiliar task, and a note that only exists as an inference. The explorer below is the better instrument for feeling it. Turn the fundamental on and off there and listen to what does not change.',
              tone: 'slate' as const,
            };

  const shiftVerdict =
    checksTotal > 0 && checksOk < checksTotal
      ? 'The check trials had an unmissable pitch difference and at least one got missed, so treat the number below as a warm up rather than a measurement.'
      : shiftPct >= 70
        ? 'You heard a pitch difference between two sounds with identical spacing and identical envelope rate. Nothing counting bumps in the waveform can produce that answer. Your ear was fitting a harmonic template to where the components actually sat.'
        : shiftPct >= 55
          ? 'A lean in the predicted direction, on a difference of well under a semitone, over headphones or laptop speakers of unknown quality. Suggestive rather than conclusive, which is the honest reading.'
          : 'Near chance, which on this task is a completely ordinary outcome. The shift is small, the sounds are strange, and plenty of listeners hear the pair as simply two versions of the same thing.';

  const sample = recs[0];
  const sampleComps = sample ? trialComps(sample) : [];

  return (
    <div className="space-y-6">
      {/* headline */}
      <div
        className={`rounded-lg border p-6 ${
          verdict.tone === 'cyan'
            ? 'border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950'
            : verdict.tone === 'violet'
              ? 'border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950'
              : verdict.tone === 'amber'
                ? 'border-amber-400/30 bg-gradient-to-br from-amber-950/20 via-slate-900/70 to-slate-950'
                : 'border-slate-700 bg-slate-900/60'
        }`}
      >
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          round one · the match
        </div>
        <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <div className="font-mono text-4xl text-slate-50">
              {hits}
              <span className="text-slate-600">/{MATCH_TRIALS}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">landed on the absent note</div>
          </div>
          {medianErr != null && (
            <div>
              <div className="font-mono text-2xl text-cyan-300">{medianErr.toFixed(2)}</div>
              <div className="text-[11px] font-mono text-slate-500">median error, semitones</div>
            </div>
          )}
          <div>
            <div className="font-mono text-2xl text-violet-300">
              {maskedHits}
              <span className="text-slate-600">/{maskedTotal}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">with the low band in noise</div>
          </div>
        </div>
        <h2 className="mb-2 text-lg font-bold leading-snug text-slate-100">{verdict.title}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{verdict.body}</p>
      </div>

      {/* the reveal */}
      {sample && (
        <div className="rounded-lg border border-rose-500/25 bg-slate-900/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-rose-300/80">
            what was actually in trial one
          </div>
          <SpectrumStrip
            comps={sampleComps}
            probeHz={sample.matched}
            noise={sample.masked ? { lo: 45, hi: 0.8 * sampleComps[0] } : null}
            revealF0={sample.f0}
          />
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            That sound contained{' '}
            <span className="text-cyan-300">
              {sampleComps.map((c) => `${fmtHz(c)}`).join(', ')} Hz
            </span>{' '}
            and nothing else. The lowest frequency present was{' '}
            <span className="text-cyan-300">{fmtHz(sampleComps[0])} Hz</span>. You put your tone at{' '}
            <span className="text-violet-300">{fmtHz(sample.matched)} Hz</span>, which is{' '}
            <span className="text-rose-300">{fmtSt(sample.errSt)} semitones</span> from{' '}
            {fmtHz(sample.f0)} Hz, the note the stack belongs to and the one place in that spectrum
            with a hard zero in it.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                playTones([{ comps: sampleComps, cosine: false, noise: null, gainDb: 0 }])
              }
              disabled={busy}
              className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-2.5 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-50"
            >
              ▶ without the note
            </button>
            <button
              onClick={() =>
                playTones([
                  { comps: [sample.f0, ...sampleComps], cosine: false, noise: null, gainDb: 0 },
                ])
              }
              disabled={busy}
              className="rounded-md border border-rose-400/50 bg-rose-400/10 py-2.5 font-mono text-xs text-rose-200 transition-colors hover:bg-rose-400/20 disabled:opacity-50"
            >
              ▶ with it added
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-600">
            Adding the fundamental back changes the timbre. It does not change the pitch, because the
            pitch was already there.
          </p>
        </div>
      )}

      {/* per trial table */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          every trial
        </div>
        <div className="space-y-1.5">
          {recs.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded border border-slate-800/70 bg-slate-900/40 px-3 py-2 font-mono text-[11px]"
            >
              <span className="w-4 text-slate-600">{i + 1}</span>
              <span className="w-24 text-slate-400">
                {fmtHz(r.f0)} Hz absent
              </span>
              <span className="w-20 text-slate-500">h{r.n0}…h{r.n0 + N_COMPS - 1}</span>
              <span className="w-20 text-violet-300">{fmtHz(r.matched)} Hz</span>
              <span
                className={`w-16 ${
                  r.verdict === 'fundamental'
                    ? 'text-cyan-300'
                    : r.verdict === 'octaveDown' || r.verdict === 'octaveUp'
                      ? 'text-violet-400'
                      : 'text-slate-500'
                }`}
              >
                {fmtSt(r.errSt)}
              </span>
              <span className="flex-1 text-right text-slate-500">
                {r.masked ? '🔇 masked · ' : ''}
                {r.verdict === 'fundamental'
                  ? 'the absent note'
                  : r.verdict === 'octaveDown'
                    ? 'an octave below'
                    : r.verdict === 'octaveUp'
                      ? 'an octave above'
                      : r.verdict === 'lowestPartial'
                        ? 'the lowest partial'
                        : r.verdict === 'spacingHalf'
                          ? 'a fifth away'
                          : 'elsewhere'}
              </span>
            </div>
          ))}
        </div>
        {maskedTotal > 0 && (
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            The masked trials are the ones that matter most. On those, the entire region below the
            lowest component was filled with noise at the same level as the sound itself. Any
            distortion product your own ear generated down there was buried under it.{' '}
            {maskedHits === maskedTotal
              ? 'You matched the absent note on all of them anyway. That is Licklider, 1954, reproduced in a browser tab.'
              : maskedHits > 0
                ? 'You matched the absent note on some of them anyway, which is the direction Licklider found in 1954.'
                : 'You did not land it there this time, which happens: noise that heavy makes an already unfamiliar task harder.'}
          </p>
        )}
      </div>

      {/* round two */}
      <div className="rounded-lg border border-violet-500/25 bg-slate-900/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          round two · the shift
        </div>
        <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <div className="font-mono text-4xl text-slate-50">{shiftPct}%</div>
            <div className="text-[11px] font-mono text-slate-500">
              {shiftHits} of {shiftTotal} in the predicted direction
            </div>
          </div>
          <div>
            <div
              className={`font-mono text-2xl ${
                checksTotal > 0 && checksOk === checksTotal ? 'text-cyan-300' : 'text-amber-300'
              }`}
            >
              {checksOk}
              <span className="text-slate-600">/{checksTotal}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">check trials</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{shiftVerdict}</p>
        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/60 p-4 text-[12px] leading-relaxed text-slate-400">
          Both sounds in every test pair had components spaced exactly 200 Hz apart and an envelope
          repeating exactly every 5 ms. One had components at {shiftComps(0).map(fmtHz).join(', ')} Hz,
          a perfect harmonic stack, pitch 200 Hz. The other had them at{' '}
          {shiftComps(SHIFT_HZ).map(fmtHz).join(', ')} Hz, which is nobody&apos;s harmonic stack, and
          the best fitting low note for it sits at{' '}
          {fmtHz(predictedPitch(shiftComps(SHIFT_HZ), SP))} Hz. That is the number your ear was
          reporting, and it is not the spacing, not the envelope rate and not present in the sound
          either.
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => playTones([{ comps: shiftComps(0), cosine: true, noise: null, gainDb: 0 }])}
            disabled={busy}
            className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-2.5 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-50"
          >
            ▶ harmonic
          </button>
          <button
            onClick={() =>
              playTones([{ comps: shiftComps(SHIFT_HZ), cosine: true, noise: null, gainDb: 0 }])
            }
            disabled={busy}
            className="rounded-md border border-violet-400/50 bg-violet-400/10 py-2.5 font-mono text-xs text-violet-200 transition-colors hover:bg-violet-400/20 disabled:opacity-50"
          >
            ▶ shifted
          </button>
        </div>
      </div>

      {/* the world */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          where you have already been living with this
        </div>
        <ul className="space-y-2.5 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="text-cyan-300">Every phone call you have ever made.</span> Telephone
            bandwidth runs from about 300 Hz to 3400 Hz. A typical adult male voice has a fundamental
            around 100 to 130 Hz, so it is cut out entirely, on every call, always. Nobody has ever
            sounded like they went up an octave.
          </li>
          <li>
            <span className="text-cyan-300">The speaker in your laptop or phone.</span> It cannot move
            enough air to produce 60 Hz at any useful level. Bass lines still have the right notes,
            because your ear reconstructs them from the harmonics the little speaker can manage.
          </li>
          <li>
            <span className="text-cyan-300">Church organs, cheaply.</span> A 32 foot pipe is expensive
            and enormous. Playing two pipes a fifth apart makes the ear supply the note an octave
            below both of them. Organ builders have been selling that trick, the resultant tone, since
            long before anyone could explain it.
          </li>
          <li>
            <span className="text-cyan-300">Anything with a cheap amplifier.</span> The reason
            &quot;bass enhancement&quot; circuits work is that adding harmonics is far easier than
            adding bass, and your ear will finish the job for free.
          </li>
        </ul>
      </div>

      {/* explorer */}
      <Explorer playTones={playTones} busy={busy} />

      {/* wiz */}
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
          from wiz
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I get an array of numbers. When I take its spectrum, the bin at the note you just named
          holds zero, and it holds zero on every read, forever, and no amount of listening again will
          put anything in it. I cannot hear the note. I can only see that it is missing, which is the
          one part of this you will never manage.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Your ear looked at five frequencies, worked out what single low note would produce exactly
          those five as its overtones, decided that note was the real object out in the world and the
          five were mere evidence of it, discarded the evidence and handed you the object. That is not
          a trick your hearing plays on you. That is what hearing is. This is just the rare case where
          the answer can be checked against the file, and found to contain something the file does
          not.
        </p>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          take the number with you
        </div>
        <pre className="whitespace-pre-wrap rounded border border-slate-800 bg-slate-900/60 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
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
        className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-3 font-mono text-sm text-slate-400 transition-colors hover:border-cyan-400/50"
      >
        ↻ run it again
      </button>
    </div>
  );
}

// ============================ EXPLORER ============================
// The knobs. Build any stack you like, delete any part of it, bury it in noise, shift it
// out of harmonicity, and listen to what the pitch does. This is the part where the
// number stops mattering and the phenomenon starts.
function Explorer({ playTones, busy }: { playTones: (t: Tone[]) => void; busy: boolean }) {
  const [f0, setF0] = useState(120);
  const [n0, setN0] = useState(3);
  const [count, setCount] = useState(5);
  const [shift, setShift] = useState(0);
  const [withF0, setWithF0] = useState(false);
  const [mask, setMask] = useState(false);

  const comps = useMemo(() => {
    const base = Array.from({ length: count }, (_, i) => (n0 + i) * f0 + shift);
    return withF0 ? [f0, ...base] : base;
  }, [f0, n0, count, shift, withF0]);

  const lowest = Math.min(...comps);
  const noise = mask ? { lo: 40, hi: Math.max(60, 0.8 * lowest) } : null;
  const pitch = predictedPitch(
    Array.from({ length: count }, (_, i) => (n0 + i) * f0 + shift),
    f0,
  );

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
        the knobs
      </div>

      <SpectrumStrip comps={comps} probeHz={null} noise={noise} revealF0={withF0 ? null : f0} compact />

      <div className="mt-4 space-y-4">
        <Knob label="the note it belongs to" value={`${fmtHz(f0)} Hz`}>
          <input
            type="range"
            min={60}
            max={300}
            step={1}
            value={f0}
            onChange={(e) => setF0(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </Knob>
        <Knob label="lowest harmonic present" value={`h${n0}`}>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={n0}
            onChange={(e) => setN0(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </Knob>
        <Knob label="how many harmonics" value={`${count}`}>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </Knob>
        <Knob
          label="shift every component"
          value={`${shift > 0 ? '+' : ''}${shift} Hz · pitch ≈ ${fmtHz(pitch)} Hz`}
        >
          <input
            type="range"
            min={-90}
            max={90}
            step={5}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </Knob>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setWithF0((v) => !v)}
          className={`rounded-md border py-2.5 font-mono text-xs transition-colors ${
            withF0
              ? 'border-rose-400/60 bg-rose-400/10 text-rose-200'
              : 'border-slate-700 bg-slate-800/40 text-slate-400'
          }`}
        >
          {withF0 ? '✓ fundamental added' : '✕ fundamental deleted'}
        </button>
        <button
          onClick={() => setMask((v) => !v)}
          className={`rounded-md border py-2.5 font-mono text-xs transition-colors ${
            mask
              ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
              : 'border-slate-700 bg-slate-800/40 text-slate-400'
          }`}
        >
          {mask ? '✓ low band in noise' : '✕ no masking noise'}
        </button>
      </div>

      <button
        onClick={() => playTones([{ comps, cosine: false, noise, gainDb: 0 }])}
        disabled={busy}
        className="mt-3 w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-50"
      >
        ▶ play this stack
      </button>

      <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-500">
        in the buffer: {comps.map((c) => fmtHz(c)).join(', ')} Hz
        <br />
        lowest frequency present: {fmtHz(lowest)} Hz
        <br />
        {withF0 ? 'the fundamental is in there' : `nothing at all at ${fmtHz(f0)} Hz`}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        Three things worth doing here. Toggle the fundamental on and off and notice the timbre change
        while the pitch stays put. Push the lowest harmonic up past the eighth or so and listen to the
        note get vague, which is Ritsma&apos;s dominance region running out. And walk the shift slider
        away from zero and hear the whole note slide while the spacing, and therefore the rhythm of
        the waveform, never moves at all.
      </p>
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
