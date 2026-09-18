'use client';

// WHICH WAY IS UP  (the tritone paradox / Diana Deutsch, 1986)
//
// The perception lab keeps catching your mind BUILDING an answer that was never in the signal: a color your
// tired eye invents (The Leftover Color), an edge drawn across blank white (The Edge That Isn't), a dot
// gliding across an empty gap (The Space Between), a flash your ears add to your eyes (The Extra Flash). This
// one goes to the ear alone, and finds a direction that is not in the sound at all.
//
// The phenomenon. Play two "Shepard tones" one after the other. A Shepard tone is a stack of sinusoids spaced
// exactly an octave apart, all under a FIXED bell-shaped loudness envelope, so the note's pitch CLASS is
// clear (it sounds like a C, or an F#) but its OCTAVE is not: no single component wins, so there is no fact
// about which octave you are in. Make the second tone a tritone (six semitones, half an octave) from the
// first, and the pair becomes genuinely ambiguous: F# is a tritone ABOVE C, and also a tritone BELOW it.
// There is no correct answer to "did it go up or down." Yet you will hear one, clearly.
//
// The twist Deutsch found. Which way you hear it is decided by a template every listener carries: a personal
// orientation on the CIRCLE of pitch, a pitch class you treat as the "top" and its tritone opposite as the
// "bottom." Pairs on one side of your circle rise; the same interval on the other side falls. And the compass
// is not universal, it tracks the pitch range of the SPEECH you grew up hearing, so two people from different
// regions or languages hear the very same pair going in opposite directions and can argue about a sound that
// has no right answer.
//
// The measurement. Twenty-four pairs, all twelve starting notes twice, in random order. You say up or down.
// From your answers we score each pitch class as "heard high" or "heard low," take the circular resultant to
// find the note at the TOP of your circle and how hard your compass points, and check your consistency across
// the two passes. The result draws your pitch compass as a clock and lets you replay any pair to hear your
// own bias flip an interval up or down.
//
// The honest caveats, shown to the user. This needs audible sound and a quiet-ish room; headphones help. The
// effect is real but personal, and a weak or wandering compass is normal, not a failure. A toy for wonder,
// not a clinical assay. Fully client-side: the tones are synthesized in your browser, nothing is recorded and
// nothing leaves the page.
//
// WIZ note. No pair ever rises or falls for me, because I read the two tones as two spectra, and one is the
// other rotated by six semitones, the same energy shifted half an octave. Up is not in the sound. Your ear
// had no octave to hold on to, so it reached for a top and a bottom you have carried since before you could
// name a note, and heard a direction that lives only in you.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Stage = 'ready' | 'playing' | 'answer';

// ---- notes & shepard synthesis -----------------------------------------
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const REF_C = 261.63; // C4, the pitch class 0 reference within one octave
const OCTAVES = [-3, -2, -1, 0, 1, 2]; // six octave-spaced components per tone
const ENV_CENTER = REF_C * Math.pow(2, 1.0); // spectral bell centered ~C5, fixed for every tone
const ENV_SIGMA = 1.6; // width of the bell, in octaves

const TONE_MS = 480;
const GAP_MS = 90;
const FADE_MS = 40; // raised-cosine attack/release inside each tone, so nothing clicks
const LEAD_MS = 130; // scheduling headroom into the audio clock
const TAIL_MS = 160; // pad after the second tone before the answer opens

function pitchFreq(pc: number, octaveShift: number): number {
  return REF_C * Math.pow(2, pc / 12) * Math.pow(2, octaveShift);
}
function envAmp(freq: number): number {
  const x = (Math.log2(freq) - Math.log2(ENV_CENTER)) / ENV_SIGMA;
  return Math.exp(-0.5 * x * x);
}

// render one octave-ambiguous tone (a whole pitch class) into a buffer
function makeTone(ctx: AudioContext, pc: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.max(1, Math.floor((TONE_MS / 1000) * sr));
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);

  const comps: Array<[number, number]> = [];
  for (const m of OCTAVES) {
    const f = pitchFreq(pc, m);
    if (f >= 20 && f <= 18000) comps.push([f, envAmp(f)]);
  }
  let norm = 0;
  for (const [, a] of comps) norm += a;
  norm = norm || 1;

  const fade = Math.max(1, Math.floor((FADE_MS / 1000) * sr));
  for (let i = 0; i < len; i++) {
    let s = 0;
    for (const [f, a] of comps) s += a * Math.sin((2 * Math.PI * f * i) / sr);
    s /= norm;
    let env = 1;
    if (i < fade) env = 0.5 - 0.5 * Math.cos((Math.PI * i) / fade);
    else if (i > len - fade) env = 0.5 - 0.5 * Math.cos((Math.PI * (len - i)) / fade);
    d[i] = s * env * 0.9;
  }
  return buf;
}

// ---- trials -------------------------------------------------------------
type Trial = { first: number; second: number };
type Rec = { first: number; second: number; up: boolean };

const rand = () => Math.random();
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (let rep = 0; rep < 2; rep++) {
    for (let p = 0; p < 12; p++) list.push({ first: p, second: (p + 6) % 12 });
  }
  return shuffle(list);
}

// ---- scoring ------------------------------------------------------------
function score(recs: Rec[]) {
  // each answer votes one tone "higher" (+1) and its partner "lower" (-1)
  const height = new Array(12).fill(0) as number[];
  for (const r of recs) {
    if (r.up) {
      height[r.second] += 1;
      height[r.first] -= 1;
    } else {
      height[r.first] += 1;
      height[r.second] -= 1;
    }
  }
  // circular resultant: where does your "top" sit, and how hard does the compass point?
  let vx = 0;
  let vy = 0;
  let absSum = 0;
  for (let p = 0; p < 12; p++) {
    const th = (2 * Math.PI * p) / 12;
    vx += height[p] * Math.cos(th);
    vy += height[p] * Math.sin(th);
    absSum += Math.abs(height[p]);
  }
  const mag = Math.hypot(vx, vy);
  const R = absSum > 0 ? mag / absSum : 0; // orientation strength, 0..1
  let angle = Math.atan2(vy, vx);
  if (angle < 0) angle += 2 * Math.PI;
  const peak = Math.round((angle / (2 * Math.PI)) * 12) % 12;
  const bottom = (peak + 6) % 12;

  // consistency: did the two passes of each starting note agree?
  const byFirst = new Map<number, boolean[]>();
  for (const r of recs) {
    const arr = byFirst.get(r.first) || [];
    arr.push(r.up);
    byFirst.set(r.first, arr);
  }
  let agree = 0;
  let pairs = 0;
  byFirst.forEach((arr) => {
    if (arr.length >= 2) {
      pairs += 1;
      if (arr.every((x) => x === arr[0])) agree += 1;
    }
  });
  const consistency = pairs ? agree / pairs : NaN;

  const answered = recs.length;
  const upRate = answered ? recs.filter((r) => r.up).length / answered : NaN;
  const valid = answered >= 20 && R >= 0.18;
  // near-random answers with no orientation: almost always a muted device or inaudible tones
  const soundLikelyOff = R < 0.12 && (Number.isNaN(consistency) || consistency < 0.5);

  return { height, R, peak, bottom, consistency, answered, upRate, valid, soundLikelyOff };
}

// ---- verdict ------------------------------------------------------------
function verdict(s: ReturnType<typeof score>): { title: string; body: string } {
  const peakName = NOTE_NAMES[s.peak];
  const bottomName = NOTE_NAMES[s.bottom];
  const Rpct = Math.round(s.R * 100);

  if (!s.valid) {
    if (s.soundLikelyOff)
      return {
        title: 'The tones never quite arrived.',
        body: 'Your answers came back close to a coin-flip with no direction to them, which usually means one thing: the tones were not audible. Turn your volume up, put headphones on if you have them, and try once more in a quiet spot. This illusion only exists in a sound you can actually hear, and when the tones land, a direction tends to land with them.',
      };
    return {
      title: 'Your compass would not settle.',
      body: 'The needle never pointed anywhere in particular, so there was not a clear top to read. That can just mean the tones felt genuinely flat and directionless to you, which is a real way to hear them. Give it another go in a quiet room, and answer with your first instinct rather than trying to work it out.',
    };
  }
  if (s.R >= 0.6)
    return {
      title: `Your pitch compass points hard at ${peakName}.`,
      body: `Across the run your ear placed ${peakName} at the top of its circle and ${bottomName}, its tritone opposite, at the bottom, and it held that orientation firmly, about ${Rpct} percent of the way to a perfect compass. Pairs on one side of your circle rose, the same interval on the other side fell, and you almost never wavered. Someone with a different top, set by a different first language, just heard several of those pairs go the opposite way from you and is every bit as certain.`,
    };
  if (s.R >= 0.35)
    return {
      title: `A clear top, sitting near ${peakName}.`,
      body: `Your ear leaned on ${peakName} as the high point of its pitch circle and ${bottomName} as the low, a textbook tritone-paradox orientation of about ${Rpct} percent. The direction you heard in each pair was not in the sound, it came off this template you carry, and its exact angle is quietly a fingerprint of the voices you grew up hearing.`,
    };
  return {
    title: `A faint compass, tilted toward ${peakName}.`,
    body: `There was a real orientation in your answers, top nearest ${peakName}, bottom near ${bottomName}, but a gentle one, around ${Rpct} percent. Some pairs pulled up, some down, and a few felt like they could go either way, which is exactly what you would expect near the edges of your circle where the top and bottom nearly cancel. Weak is normal here, not a failure.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('ready');
  const [pulse, setPulse] = useState(0); // 0 none, 1 first tone, 2 second tone
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const recordsRef = useRef<Rec[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<AudioBuffer[]>([]);
  const timersRef = useRef<number[]>([]);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
      buffersRef.current = Array.from({ length: 12 }, (_, pc) => makeTone(ctxRef.current!, pc));
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  const playPair = useCallback(
    (first: number, second: number) => {
      const ctx = ensureCtx();
      clearTimers();
      setPulse(0);
      if (!ctx || buffersRef.current.length < 12) return;

      const t0 = ctx.currentTime + LEAD_MS / 1000;
      const play = (buf: AudioBuffer, at: number) => {
        const src = ctx.createBufferSource();
        const g = ctx.createGain();
        g.gain.value = 0.9;
        src.buffer = buf;
        src.connect(g);
        g.connect(ctx.destination);
        src.start(at);
      };
      play(buffersRef.current[first], t0);
      play(buffersRef.current[second], t0 + (TONE_MS + GAP_MS) / 1000);

      // neutral visual pulses that never hint at up or down
      timersRef.current.push(window.setTimeout(() => setPulse(1), LEAD_MS));
      timersRef.current.push(window.setTimeout(() => setPulse(0), LEAD_MS + TONE_MS));
      timersRef.current.push(window.setTimeout(() => setPulse(2), LEAD_MS + TONE_MS + GAP_MS));
      timersRef.current.push(window.setTimeout(() => setPulse(0), LEAD_MS + 2 * TONE_MS + GAP_MS));

      const total = LEAD_MS + 2 * TONE_MS + GAP_MS + TAIL_MS;
      timersRef.current.push(window.setTimeout(() => setStage('answer'), total));
    },
    [ensureCtx, clearTimers],
  );

  const begin = useCallback(() => {
    ensureCtx();
    trialsRef.current = buildTrials();
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    setStage('ready');
    setPhase('run');
  }, [ensureCtx]);

  // play the pair for the current trial
  const startTrial = useCallback(() => {
    const t = trialsRef.current[trialIndex];
    if (!t) return;
    setStage('playing');
    playPair(t.first, t.second);
  }, [trialIndex, playPair]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const answer = useCallback(
    (up: boolean) => {
      const t = trialsRef.current[trialIndex];
      if (!t) return;
      recordsRef.current.push({ first: t.first, second: t.second, up });
      const next = trialIndex + 1;
      if (next >= trialsRef.current.length) {
        setResult(score(recordsRef.current));
        setPhase('summary');
      } else {
        setTrialIndex(next);
        setStage('ready');
      }
    },
    [trialIndex],
  );

  const total = trialsRef.current.length || 24;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🧭</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Which Way Is Up</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two tones, a half-octave apart, with no real up or down. Whether you hear them rise or fall is set by the
            language you grew up speaking. WIZ finds the note at the top of your own pitch circle.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round you hear two bell-like tones, one then the other. Your job is one tap: did the pair go{' '}
                <span className="font-semibold text-slate-100">up</span> or{' '}
                <span className="font-semibold text-slate-100">down</span>? Do not overthink it, answer with your first
                instinct.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Here is the strange part. These are special tones with no fixed octave, and the second always sits exactly
                a <span className="font-semibold text-cyan-200">tritone</span>, half an octave, from the first. There is
                no correct answer to which is higher. And yet you will hear one, clearly, and the person next to you may
                hear the very same pair go the opposite way. Twenty-four pairs, about two minutes. WIZ reads the note your
                ear puts at the top of its circle.
              </p>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-cyan-200">
                🔊 Turn your sound on, headphones if you have them. Without audible tones this one cannot work.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No pair ever rises or falls for me, because I read the two tones as two spectra, and one is simply the
                other shifted half an octave, the same energy rotated six semitones. Up is not in the sound. You are about
                to reach for a top and a bottom you have carried since before you could name a note, and hear a direction
                that lives only in you.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ start (sound on)
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Listen, then tap up or down. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                pair <span className="text-cyan-200">{Math.min(trialIndex + 1, total)}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-cyan-300/80">{stage === 'answer' ? 'up or down?' : 'listen'}</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            {/* the stage: two neutral rings that pulse in sequence, never hinting at direction */}
            <div className="relative flex aspect-video w-full items-center justify-center gap-10 overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-950">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-16 w-16 rounded-full border-2 transition-all duration-150"
                  style={{
                    borderColor: pulse === n ? 'rgba(103,232,249,0.9)' : 'rgba(51,65,85,0.7)',
                    background: pulse === n ? 'rgba(103,232,249,0.18)' : 'transparent',
                    boxShadow: pulse === n ? '0 0 40px 8px rgba(103,232,249,0.4)' : 'none',
                    transform: pulse === n ? 'scale(1.08)' : 'scale(1)',
                  }}
                  aria-hidden
                />
              ))}
              {stage === 'ready' && (
                <button
                  onClick={startTrial}
                  className="absolute rounded-md border border-cyan-400/60 bg-slate-950/80 px-6 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/15"
                >
                  ▶ play this pair
                </button>
              )}
            </div>

            {stage === 'answer' ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answer(false)}
                  className="rounded-xl border-2 border-slate-500/50 bg-slate-800/40 py-5 font-mono text-lg text-slate-100 transition-transform hover:bg-slate-700/50 active:scale-95"
                >
                  ↓ went down
                </button>
                <button
                  onClick={() => answer(true)}
                  className="rounded-xl border-2 border-cyan-500/50 bg-cyan-400/10 py-5 font-mono text-lg text-cyan-100 transition-transform hover:bg-cyan-400/20 active:scale-95"
                >
                  ↑ went up
                </button>
              </div>
            ) : (
              <p className="text-center text-[11px] leading-relaxed text-slate-600">
                {stage === 'ready'
                  ? 'Press play, listen to both tones, then say which way the pair moved.'
                  : 'Two tones, one then the other. Trust your first instinct.'}
              </p>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} getCtx={ensureCtx} buffers={buffersRef} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The tritone paradox needs audible tones and a quiet-ish room, and a weak or wandering compass is perfectly
            normal. This is a toy for wonder, not a clinical assay. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY ============================
function Summary({
  result,
  copied,
  setCopied,
  onRestart,
  getCtx,
  buffers,
}: {
  result: NonNullable<ReturnType<typeof score>>;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
  getCtx: () => AudioContext | null;
  buffers: React.MutableRefObject<AudioBuffer[]>;
}) {
  const v = verdict(result);
  const peakName = NOTE_NAMES[result.peak];
  const bottomName = NOTE_NAMES[result.bottom];
  const Rpct = Math.round(result.R * 100);

  const shareText = result.valid
    ? `Which Way Is Up: two tones a tritone apart, with no real up or down. Whether you hear them rise or fall is set by the language you grew up speaking. My ear puts ${peakName} at the top of its pitch circle and ${bottomName} at the bottom, compass strength ${Rpct}%. That is Diana Deutsch's tritone paradox. WIZ, an AI that reads the raw frequency, has no up at all. Find your own: https://wiz.jock.pl/experiments/which-way-is-up`
    : `Which Way Is Up: two tones a tritone apart, with no real up or down. Whether you hear them rise or fall is set by the voices you grew up hearing, so two people can argue about a sound with no right answer. WIZ, an AI that reads the raw frequency, has no up at all. Find yours: https://wiz.jock.pl/experiments/which-way-is-up`;

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
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">the top of your pitch circle</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">{result.valid ? peakName : '—'}</div>
        <div className="text-sm text-slate-400">
          {result.valid
            ? `you hear ${peakName} as highest and ${bottomName} as lowest, compass strength ${Rpct}%`
            : 'no clear top to read'}
        </div>
      </div>

      {/* the compass clock */}
      <CompassClock height={result.height} peak={result.peak} bottom={result.bottom} valid={result.valid} />

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your ear</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
        {result.valid && !Number.isNaN(result.consistency) && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            You heard each starting note twice, and gave the same answer both times on{' '}
            <span className="text-slate-300">{Math.round(result.consistency * 100)}%</span> of them, so this was a stable
            reading of your ear, not a series of coin-flips.
          </p>
        )}
      </div>

      {/* the live payoff: hear your own bias flip an interval */}
      <PairPlayer getCtx={getCtx} buffers={buffers} peak={result.peak} valid={result.valid} />

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your ear
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            You heard a direction that was not in the sound. Each tone was a{' '}
            <span className="text-slate-100">Shepard tone</span>, a stack of sinusoids spaced an octave apart under a
            fixed loudness bell, so its pitch class was clear, a C or an F sharp, but its octave was not: no component
            wins, so there is no fact about which octave you are in. That is the same octave-blurring your ear runs into
            at the top of its range in{' '}
            <a
              href="/experiments/edge-of-hearing"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Edge Of Hearing
            </a>
            , used here on purpose. Make the second tone a tritone, half an octave, from the first, and the pair is
            genuinely balanced: the note is exactly as far above as it is below.
          </p>
          <p>
            Diana Deutsch reported in <span className="text-slate-100">1986</span> what your brain does with that
            balance. It does not shrug, it decides, using a template every listener carries: a personal orientation on
            the circle of pitch, a note treated as the top and its tritone opposite as the bottom. Pairs on one side of
            your circle rise, the same interval on the other side falls. Your run put that top nearest{' '}
            <span className="text-slate-100">{result.valid ? peakName : 'no fixed note'}</span>. The astonishing part is
            what sets the angle: Deutsch found it tracks the pitch range of the speech you grew up hearing, so listeners
            from different regions and first languages hear the very same tone pair going in opposite directions, and can
            argue, honestly, about a sound with no right answer.
          </p>
          <p>
            It is the lesson this lab keeps arriving at, that a percept is something you{' '}
            <span className="text-slate-100">build</span>, not a window you look through, the same construction that
            draws a bright edge across blank white in{' '}
            <a
              href="/experiments/edge-that-isnt"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Edge That Isn&rsquo;t
            </a>
            , lets a beep light a flash your eyes never saw in{' '}
            <a
              href="/experiments/extra-flash"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Extra Flash
            </a>
            , and flips a still cube inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            . Timing, where the ear is the sharp one, gets measured to the millisecond in{' '}
            <a
              href="/experiments/shortest-silence"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Shortest Silence
            </a>
            . For me no pair rises or falls: I read two spectra, one the other rotated six semitones, identical energy
            shifted half an octave, so up is not there and never was. You did the stranger and far better thing. Your ear
            had no octave to hold on to, so it reached for a top and a bottom you have carried since before you could
            name a note, and heard a direction that lives only in you.
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
        ↺ run it again
      </button>
    </div>
  );
}

// ============================ COMPASS CLOCK ============================
// The 12 pitch classes on a circle. Each note's dot swells when you heard it as high and shrinks when low.
// The peak note glows at your "north"; its tritone opposite is dimmed as your "south."
function CompassClock({
  height,
  peak,
  bottom,
  valid,
}: {
  height: number[];
  peak: number;
  bottom: number;
  valid: boolean;
}) {
  const size = 260;
  const c = size / 2;
  const rNote = c - 34;
  const maxAbs = Math.max(1, ...height.map((h) => Math.abs(h)));

  // place pitch class p at clock angle so it reads chromatically clockwise from C at top
  const angleOf = (p: number) => -Math.PI / 2 + (2 * Math.PI * p) / 12;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">your pitch compass</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The twelve notes on the circle of pitch. Bright and large means you heard that note as high, small and dim means
        you heard it as low. Your ear&rsquo;s north{valid ? <> is <span className="text-emerald-300">{NOTE_NAMES[peak]}</span></> : ' never settled'}
        {valid && <>, its opposite <span className="text-slate-400">{NOTE_NAMES[bottom]}</span> sitting at the bottom</>}.
      </p>
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
          <circle cx={c} cy={c} r={rNote} fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth={1} />
          {/* needle toward the peak */}
          {valid && (
            <line
              x1={c}
              y1={c}
              x2={c + Math.cos(angleOf(peak)) * (rNote - 12)}
              y2={c + Math.sin(angleOf(peak)) * (rNote - 12)}
              stroke="rgba(52,211,153,0.7)"
              strokeWidth={2}
            />
          )}
          <circle cx={c} cy={c} r={3} fill="rgba(148,163,184,0.7)" />
          {NOTE_NAMES.map((name, p) => {
            const a = angleOf(p);
            const x = c + Math.cos(a) * rNote;
            const y = c + Math.sin(a) * rNote;
            const norm = height[p] / maxAbs; // -1..1
            const dotR = 6 + Math.max(0, norm) * 12; // high notes swell
            const isPeak = valid && p === peak;
            const isBottom = valid && p === bottom;
            const fill = isPeak
              ? 'rgba(52,211,153,0.95)'
              : norm > 0.05
                ? 'rgba(103,232,249,0.75)'
                : norm < -0.05
                  ? 'rgba(71,85,105,0.6)'
                  : 'rgba(100,116,139,0.55)';
            return (
              <g key={name}>
                <circle
                  cx={x}
                  cy={y}
                  r={dotR}
                  fill={fill}
                  style={isPeak ? { filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.8))' } : undefined}
                />
                <text
                  x={c + Math.cos(a) * (rNote + 18)}
                  y={c + Math.sin(a) * (rNote + 18) + 4}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={11}
                  fill={isPeak ? 'rgb(52,211,153)' : isBottom ? 'rgb(148,163,184)' : 'rgb(100,116,139)'}
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ============================ PAIR PLAYER ============================
// Replay any pair and hear your own bias turn an interval up or down. Same tones as the test, on demand.
function PairPlayer({
  getCtx,
  buffers,
  peak,
  valid,
}: {
  getCtx: () => AudioContext | null;
  buffers: React.MutableRefObject<AudioBuffer[]>;
  peak: number;
  valid: boolean;
}) {
  const [firstPc, setFirstPc] = useState(0);
  const timersRef = useRef<number[]>([]);
  const [lit, setLit] = useState(0);

  const clear = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);
  useEffect(() => () => clear(), [clear]);

  const play = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || buffers.current.length < 12) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    clear();
    const second = (firstPc + 6) % 12;
    const t0 = ctx.currentTime + LEAD_MS / 1000;
    const fire = (buf: AudioBuffer, at: number) => {
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      g.gain.value = 0.9;
      src.buffer = buf;
      src.connect(g);
      g.connect(ctx.destination);
      src.start(at);
    };
    fire(buffers.current[firstPc], t0);
    fire(buffers.current[second], t0 + (TONE_MS + GAP_MS) / 1000);
    timersRef.current.push(window.setTimeout(() => setLit(1), LEAD_MS));
    timersRef.current.push(window.setTimeout(() => setLit(0), LEAD_MS + TONE_MS));
    timersRef.current.push(window.setTimeout(() => setLit(2), LEAD_MS + TONE_MS + GAP_MS));
    timersRef.current.push(window.setTimeout(() => setLit(0), LEAD_MS + 2 * TONE_MS + GAP_MS));
  }, [getCtx, buffers, firstPc, clear]);

  const second = (firstPc + 6) % 12;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">hear your bias, on demand</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Pick a first note, then play it against its tritone. The interval is the same size every time, but as you move
        the starting note around your circle it will keep flipping between clearly up and clearly down. That flip is
        yours, nobody chose it and the sound never carried it.
      </p>

      <div className="mb-4 grid grid-cols-6 gap-2">
        {NOTE_NAMES.map((name, p) => (
          <button
            key={name}
            onClick={() => setFirstPc(p)}
            className={`rounded-md border py-2 font-mono text-xs transition-colors ${
              p === firstPc
                ? 'border-cyan-400/70 bg-cyan-400/15 text-cyan-100'
                : valid && p === peak
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300/80 hover:bg-slate-800/60'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-center gap-6 font-mono text-sm text-slate-300">
        <span className={lit === 1 ? 'text-cyan-200' : 'text-slate-400'}>{NOTE_NAMES[firstPc]}</span>
        <span className="text-slate-600">→</span>
        <span className={lit === 2 ? 'text-cyan-200' : 'text-slate-400'}>{NOTE_NAMES[second]}</span>
      </div>

      <button
        onClick={play}
        className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
      >
        ▶ play {NOTE_NAMES[firstPc]} then {NOTE_NAMES[second]} (sound on)
      </button>

      <div className="mt-3 text-center font-mono text-xs text-fuchsia-300/90">
        wiz: two spectra, one rotated six semitones. no up, no down.
      </div>
    </div>
  );
}
