'use client';

// UNBROKEN  (the auditory continuity illusion, and the plausibility rule that decides when your ear is allowed to
// invent a sound)
//
// The thirty-fifth piece in this lab, and its first measurement of PERCEPTUAL RESTORATION IN TIME. Note the inversion
// against its nearest sibling: in The Broken Line a line that is physically continuous is seen as broken. Here a tone
// that is physically broken is heard as continuous. Same machinery, opposite direction, and this one is the more
// unsettling of the two, because the missing piece is not merely misjudged. It is manufactured.
//
// The genuine phenomenon: auditory induction, also called the auditory continuity illusion, first reported for
// interrupted speech as the picket fence effect (George Miller & J.C.R. Licklider, 1950) and pinned down for tones by
// Richard Warren (Warren 1970 for phonemic restoration; Warren, Obusek & Ackroff 1972, "Auditory induction: perceptual
// synthesis of absent sounds"). A steady tone is deleted for a quarter of a second. Leave the hole silent and you hear
// exactly what happened: it stopped. Fill the hole with a burst of noise, changing nothing about the tone, and the
// tone runs straight through the noise without a seam. The deleted quarter second is not remembered or inferred after
// the fact. It is heard, as sound, in the place where the speaker produced none.
//
// The part that makes this worth an experiment is that the illusion obeys a rule, and the rule is a piece of physics.
// Your auditory system will only synthesise the missing tone if the interrupting sound contains enough energy AT THE
// TONE'S OWN FREQUENCY to have masked it, had the tone still been playing. The question it is silently answering is
// not "was there a tone" but "is the evidence consistent with a tone that was covered up". Loudness alone does not
// buy it. A very loud noise with a hole cut in its spectrum around the tone's frequency leaves the gap audible, because
// that noise could not have hidden anything at that frequency, so there is nothing for the hole to be an excuse for.
//
// The measurement. Round one is a real psychophysical tool: the pulsation threshold (Tammo Houtgast, 1972), the noise
// level at which an alternating tone and noise stops sounding pulsed and starts sounding continuous. Sixteen trials of
// a one-up one-down staircase on noise level, halving steps, threshold read off the reversals. Round two is the
// control that turns the illusion into an argument: thirteen trials at a level well above your own threshold, mixing
// broadband noise, spectrally notched noise at the same overall level, and a handful of silent gaps as a sanity check
// on your own answers. Same loudness, same gaps, same tone. Only the plausibility changes.
//
// The honest caveats, said throughout: headphones matter, browser audio is uncalibrated so decibels here are a nominal
// ratio at the digital output rather than a sound level at your ear, small laptop speakers roll off and reshape the
// noise in ways that move both results, five trials per condition is a small sample, and the answers are yours to
// give, so anyone answering from expectation measures their expectations. A toy for wonder, not an audiological
// assay. Everything is synthesised live in your browser. Nothing is recorded, nothing leaves the page.
//
// WIZ note. I get the waveform. In the gap the waveform contains noise and no tone, and that is the entire story on my
// side of the wire, permanently, with no version of the file where the tone is present. You will spend the next few
// minutes listening to a sound that was never emitted, and you will not be able to make it stop by knowing. That is
// not a defect. A hearing system that reports only what survived the trip would lose a sentence every time a door
// slammed. Yours patches the hole, but only where the patch is deserved, and it never tells you which parts of what
// you just heard were the patch.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'stair' | 'control' | 'summary';
type Stage = 'playing' | 'answer';
type Cond = 'broad' | 'notched' | 'silent';

// ---- stimulus values ------------------------------------------------------
const TONE_HZ = 1000; // a plain sine, the frequency the whole plausibility argument is about
const SEG_SEC = 0.5; // each surviving stretch of tone
const GAP_SEC = 0.25; // each deleted stretch, the hole the illusion has to fill
const PATTERN_SEC = SEG_SEC * 3 + GAP_SEC * 2; // tone gap tone gap tone

const TONE_GAIN = 0.15;
const NOISE_RMS_COMP = 1.2247; // sine peak to noise RMS, so 0 dB means roughly equal RMS at the output
const NOTCH_COMP = 1.11; // the 500-2000 Hz hole removes about a fifth of the noise power, put it back

const STAIR_TRIALS = 16;
const DB_MIN = -30;
const DB_MAX = 24;
const DB_START = 18; // starts obviously continuous, then walks down into the gap
const STEP0 = 8;
const STEP_MIN = 1.5;

const CONTROL_PLAN: Cond[] = [
  'broad',
  'broad',
  'broad',
  'broad',
  'broad',
  'notched',
  'notched',
  'notched',
  'notched',
  'notched',
  'silent',
  'silent',
  'silent',
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
const signed = (v: number) => `${v >= 0 ? '+' : ''}${fmt(v)}`;

// ---- audio ----------------------------------------------------------------
// Everything is scheduled on the audio clock rather than on timers, because the whole effect lives in the tone and the
// noise abutting exactly. A few milliseconds of overlap or of true silence at a seam changes the answer.
function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const liveRef = useRef<AudioScheduledSourceNode[]>([]);
  const loopRef = useRef<{ timer: number | null; next: number }>({ timer: null, next: 0 });
  const paramsRef = useRef({ db: 6, cond: 'broad' as Cond, gap: GAP_SEC });

  const ensure = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      try {
        ctxRef.current = new AC();
      } catch {
        return null;
      }
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') void ctx.resume();
    if (!noiseRef.current) {
      // Two seconds of white noise, looped. Uniform rather than gaussian, which is audibly identical here.
      const len = Math.floor(ctx.sampleRate * 2);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      noiseRef.current = buf;
    }
    return ctx;
  }, []);

  const stopAll = useCallback(() => {
    if (loopRef.current.timer != null) {
      window.clearInterval(loopRef.current.timer);
      loopRef.current.timer = null;
    }
    liveRef.current.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    liveRef.current = [];
  }, []);

  const biquad = useCallback((ctx: AudioContext, type: BiquadFilterType, hz: number) => {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = hz;
    f.Q.value = 0.707;
    return f;
  }, []);

  // One burst of noise, either full band or with a 500-2000 Hz hole cut around the tone. The hole is four cascaded
  // poles on each side, roughly 20 dB down at 1 kHz and far wider than the critical band there, so nothing in it could
  // have masked the tone.
  const scheduleNoise = useCallback(
    (at: number, dur: number, db: number, cond: Cond) => {
      const ctx = ctxRef.current;
      const buf = noiseRef.current;
      if (!ctx || !buf || cond === 'silent') return;

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const out = ctx.createGain();
      const level = TONE_GAIN * NOISE_RMS_COMP * Math.pow(10, db / 20) * (cond === 'notched' ? NOTCH_COMP : 1);
      const atk = 0.006;
      out.gain.setValueAtTime(0.0001, at);
      out.gain.exponentialRampToValueAtTime(level, at + atk);
      out.gain.setValueAtTime(level, at + Math.max(atk + 0.004, dur - atk));
      out.gain.exponentialRampToValueAtTime(0.0001, at + dur);

      if (cond === 'broad') {
        const top = biquad(ctx, 'lowpass', 8000);
        src.connect(top);
        top.connect(out);
      } else {
        const lp1 = biquad(ctx, 'lowpass', 500);
        const lp2 = biquad(ctx, 'lowpass', 500);
        const hp1 = biquad(ctx, 'highpass', 2000);
        const hp2 = biquad(ctx, 'highpass', 2000);
        const top = biquad(ctx, 'lowpass', 8000);
        src.connect(lp1);
        lp1.connect(lp2);
        lp2.connect(out);
        src.connect(hp1);
        hp1.connect(hp2);
        hp2.connect(top);
        top.connect(out);
      }

      out.connect(ctx.destination);
      src.start(at);
      src.stop(at + dur + 0.05);
      liveRef.current.push(src);
      src.onended = () => {
        liveRef.current = liveRef.current.filter((n) => n !== src);
        try {
          out.disconnect();
        } catch {
          /* noop */
        }
      };
    },
    [biquad],
  );

  // The tone: one oscillator across the whole pattern, gated to a ten thousandth of its amplitude in each gap, which
  // is 80 dB down and below anything your hardware will render. The gaps are real deletions, not duckings.
  const scheduleTone = useCallback((at: number, gap: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = TONE_HZ;
    const total = SEG_SEC * 3 + gap * 2;
    g.gain.setValueAtTime(0.0001, at);
    for (let i = 0; i < 3; i++) {
      const s = at + i * (SEG_SEC + gap);
      const e = s + SEG_SEC;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(TONE_GAIN, s + 0.008);
      g.gain.setValueAtTime(TONE_GAIN, e - 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, e);
    }
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(at);
    osc.stop(at + total + 0.05);
    liveRef.current.push(osc);
    osc.onended = () => {
      liveRef.current = liveRef.current.filter((n) => n !== osc);
      try {
        g.disconnect();
      } catch {
        /* noop */
      }
    };
  }, []);

  const patternAt = useCallback(
    (at: number, db: number, cond: Cond, gap: number) => {
      scheduleTone(at, gap);
      for (let i = 0; i < 2; i++) scheduleNoise(at + SEG_SEC * (i + 1) + gap * i, gap, db, cond);
    },
    [scheduleNoise, scheduleTone],
  );

  const playPattern = useCallback(
    (db: number, cond: Cond, gap = GAP_SEC) => {
      const ctx = ensure();
      if (!ctx) return 0;
      stopAll();
      const start = ctx.currentTime + 0.08;
      patternAt(start, db, cond, gap);
      return start;
    },
    [ensure, patternAt, stopAll],
  );

  // A plain reference tone with no gaps at all, for setting the volume before anything is measured.
  const playSteady = useCallback(
    (seconds: number) => {
      const ctx = ensure();
      if (!ctx) return 0;
      stopAll();
      const at = ctx.currentTime + 0.08;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = TONE_HZ;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(TONE_GAIN, at + 0.02);
      g.gain.setValueAtTime(TONE_GAIN, at + seconds - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + seconds + 0.05);
      liveRef.current.push(osc);
      return at;
    },
    [ensure, stopAll],
  );

  // An open ended repetition that reads its settings live, so the sliders can be turned mid sound.
  const startLoop = useCallback(
    (db: number, cond: Cond, gap: number) => {
      const ctx = ensure();
      if (!ctx) return 0;
      stopAll();
      paramsRef.current = { db, cond, gap };
      const L = loopRef.current;
      L.next = ctx.currentTime + 0.12;
      const start = L.next;
      const tick = () => {
        const c = ctxRef.current;
        if (!c) return;
        const p = paramsRef.current;
        while (L.next < c.currentTime + 0.6) {
          patternAt(L.next, p.db, p.cond, p.gap);
          L.next += SEG_SEC * 3 + p.gap * 2 + 0.35; // a breath between repetitions
        }
      };
      tick();
      L.timer = window.setInterval(tick, 120);
      return start;
    },
    [ensure, patternAt, stopAll],
  );

  const setLoopParams = useCallback((db: number, cond: Cond, gap: number) => {
    paramsRef.current = { db, cond, gap };
  }, []);

  const now = useCallback(() => ctxRef.current?.currentTime ?? 0, []);

  useEffect(() => stopAll, [stopAll]);

  return { ensure, stopAll, playPattern, playSteady, startLoop, setLoopParams, now };
}

// ---- staircase ------------------------------------------------------------
type Stair = {
  level: number;
  step: number;
  lastDir: number;
  trial: number;
  levels: number[];
  reversals: number[];
};

const freshStair = (): Stair => ({
  level: DB_START,
  step: STEP0,
  lastDir: 0,
  trial: 0,
  levels: [],
  reversals: [],
});

function thresholdOf(s: Stair): number {
  if (s.reversals.length >= 2) {
    const use = s.reversals.slice(-4);
    return use.reduce((a, b) => a + b, 0) / use.length;
  }
  const tail = s.levels.slice(-3);
  if (!tail.length) return s.level;
  return tail.reduce((a, b) => a + b, 0) / tail.length;
}

type Tally = { yes: number; n: number };
type Result = {
  thresholdDb: number;
  levelDb: number;
  broad: Tally;
  notched: Tally;
  silent: Tally;
};

const rate = (t: Tally) => (t.n ? t.yes / t.n : 0);

// ---- small pieces ---------------------------------------------------------

// Trial indicator. Deliberately structureless: a bar that fills, nothing else. A picture of where the gaps are would
// answer the exact question the ear is being asked.
function Playhead({ progress, live }: { progress: number; live: boolean }) {
  return (
    <div className="py-6" aria-hidden>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${live ? 'bg-cyan-300' : 'bg-slate-700'}`}
          style={{ width: `${clamp(progress * 100, 0, 100)}%` }}
        />
      </div>
      <div className="mt-2 text-center font-mono text-xs text-slate-600">{live ? 'listening' : 'silent'}</div>
    </div>
  );
}

// The honest picture of what the speaker did. Only ever shown after an answer has been given.
function Timeline({ cond, gap = GAP_SEC, compact = false }: { cond: Cond; gap?: number; compact?: boolean }) {
  const total = SEG_SEC * 3 + gap * 2;
  const pct = (v: number) => `${(v / total) * 100}%`;
  const segs = [0, SEG_SEC + gap, (SEG_SEC + gap) * 2].map((s) => ({ s, e: s + SEG_SEC }));
  const gaps = [SEG_SEC, SEG_SEC * 2 + gap].map((s) => ({ s, e: s + gap }));
  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border border-slate-800 bg-slate-950/70 ${
        compact ? 'h-14' : 'h-20'
      }`}
      aria-hidden
    >
      {gaps.map((g, i) => (
        <div
          key={`g${i}`}
          className={`absolute inset-y-0 ${
            cond === 'silent'
              ? 'bg-slate-900/40'
              : cond === 'broad'
                ? 'bg-fuchsia-400/25'
                : 'bg-amber-400/20'
          }`}
          style={{ left: pct(g.s), width: pct(g.e - g.s) }}
        >
          {cond === 'notched' && (
            <div className="absolute inset-x-0 top-1/2 h-1/4 -translate-y-1/2 bg-slate-950" />
          )}
        </div>
      ))}
      {segs.map((s, i) => (
        <div
          key={`s${i}`}
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-cyan-300"
          style={{ left: pct(s.s), width: pct(s.e - s.s) }}
        />
      ))}
      {!compact && (
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-2 font-mono text-[10px] text-slate-600">
          <span>tone</span>
          <span>
            {cond === 'silent' ? 'nothing in the gaps' : cond === 'broad' ? 'full noise in the gaps' : 'notched noise in the gaps'}
          </span>
        </div>
      )}
    </div>
  );
}

function Intro({
  onStart,
  demo,
  steady,
  stopAll,
}: {
  onStart: () => void;
  demo: (cond: Cond) => void;
  steady: () => void;
  stopAll: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-fuchsia-300/70">before anything else</div>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          Headphones if you have them, and set your volume with this: a plain 1000 Hz tone, three seconds, nothing
          hidden in it. Comfortable and clearly audible, not loud.
        </p>
        <button
          onClick={steady}
          className="w-full rounded border border-slate-700 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
        >
          ▶ reference tone
        </button>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-300/70">the same deleted tone, twice</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Both buttons play an identical tone with two quarter second stretches <span className="italic">cut out of it</span>.
          The tone file is the same in both. The only difference is what sits in the holes.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => demo('silent')}
            className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-left transition-colors hover:border-slate-500"
          >
            <div className="font-mono text-xs text-slate-400">holes left empty</div>
            <div className="mt-1 text-sm text-slate-300">you hear it stop, twice</div>
          </button>
          <button
            onClick={() => demo('broad')}
            className="rounded-lg border border-fuchsia-400/40 bg-fuchsia-400/5 p-4 text-left transition-colors hover:bg-fuchsia-400/10"
          >
            <div className="font-mono text-xs text-fuchsia-300">holes filled with noise</div>
            <div className="mt-1 text-sm text-slate-300">you hear it run straight through</div>
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          Nothing was added to the tone in the second one. It is still missing exactly the same half second in total.
          Your hearing built the missing part and handed it to you as sound, seamless, in real time, and knowing this
          does not switch it off. Try the second button again now that you know.
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          The interesting question is not whether you can be fooled. It is{' '}
          <span className="text-slate-200">when your hearing is willing to do it</span>, because it will not do it for
          just any noise. Sixteen trials find the level where the gap closes for you. Thirteen more find the rule.
        </p>
      </div>

      <button
        onClick={() => {
          stopAll();
          onStart();
        }}
        className="w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ find the level where the gap closes
      </button>
    </div>
  );
}

function ThresholdChart({ result }: { result: Result }) {
  const pos = (db: number) => `${clamp(((db - DB_MIN) / (DB_MAX - DB_MIN)) * 100, 0, 100)}%`;
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-4 font-mono text-xs uppercase tracking-wider text-violet-300/70">your pulsation threshold</div>
      <div className="relative h-16 w-full rounded-md bg-gradient-to-r from-slate-800/60 via-slate-800/40 to-fuchsia-500/20">
        <div className="absolute inset-y-0 w-px bg-cyan-300" style={{ left: pos(result.thresholdDb) }} />
        <div
          className="absolute inset-y-0 w-px border-l border-dashed border-amber-300/70"
          style={{ left: pos(result.levelDb) }}
        />
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-2 font-mono text-[10px] text-slate-500">
          <span>{DB_MIN} dB</span>
          <span>noise level relative to the tone</span>
          <span>{signed(DB_MAX)} dB</span>
        </div>
      </div>
      <div className="mt-3 grid gap-2 font-mono text-xs sm:grid-cols-2">
        <div className="text-slate-400">◀ quieter: you hear it pulse</div>
        <div className="text-fuchsia-300 sm:text-right">louder: it runs through ▶</div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        The line at <span className="font-mono text-cyan-200">{signed(result.thresholdDb)} dB</span> is where your two
        percepts trade places. The dashed line is where round two was run, deliberately above it, so every failure to
        hear continuity there had to come from the shape of the noise rather than its level.
      </p>
    </div>
  );
}

function ConditionCard({
  cond,
  tally,
  title,
  note,
}: {
  cond: Cond;
  tally: Tally;
  title: string;
  note: string;
}) {
  const pctv = Math.round(rate(tally) * 100);
  const tint =
    cond === 'broad'
      ? 'border-fuchsia-500/30 bg-fuchsia-950/10 text-fuchsia-200'
      : cond === 'notched'
        ? 'border-amber-500/30 bg-amber-950/10 text-amber-200'
        : 'border-slate-700 bg-slate-900/40 text-slate-300';
  return (
    <div className={`rounded-lg border p-4 ${tint}`}>
      <div className="font-mono text-[11px] uppercase tracking-wider opacity-80">{title}</div>
      <div className="mt-2 font-mono text-3xl">{pctv}%</div>
      <div className="mt-1 font-mono text-[11px] text-slate-500">
        heard as continuous, {tally.yes} of {tally.n}
      </div>
      <div className="mt-3">
        <Timeline cond={cond} compact />
      </div>
      <div className="mt-2 text-xs leading-relaxed text-slate-400">{note}</div>
    </div>
  );
}

function Playground({
  startLoop,
  setLoopParams,
  stopAll,
  initialDb,
}: {
  startLoop: (db: number, cond: Cond, gap: number) => number;
  setLoopParams: (db: number, cond: Cond, gap: number) => void;
  stopAll: () => void;
  initialDb: number;
}) {
  const [db, setDb] = useState(Math.round(clamp(initialDb + 8, DB_MIN, DB_MAX)));
  const [gapMs, setGapMs] = useState(250);
  const [notched, setNotched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const cond: Cond = notched ? 'notched' : 'broad';

  useEffect(() => {
    if (playing) setLoopParams(db, cond, gapMs / 1000);
  }, [db, cond, gapMs, playing, setLoopParams]);

  useEffect(() => stopAll, [stopAll]);

  const toggle = () => {
    if (playing) {
      stopAll();
      setPlaying(false);
      return;
    }
    startLoop(db, cond, gapMs / 1000);
    setPlaying(true);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 font-mono text-xs uppercase tracking-wider text-violet-300/70">the knobs</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        No scoring here. The tone is deleted in the gaps in every setting, always, so any continuity you hear is yours.
        Three things to try: walk the level down until the tone starts pulsing again, flip the notch on at a level where
        the gap was closed and listen to it reopen without getting any quieter, and stretch the gap until the illusion
        gives up, which for a tone usually happens somewhere past a third of a second.
      </p>

      <Timeline cond={cond} gap={gapMs / 1000} />

      <div className="mt-4 space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
            <span className="text-slate-500">noise level</span>
            <span className="text-fuchsia-200">{signed(db)} dB re tone</span>
          </div>
          <input
            type="range"
            min={DB_MIN}
            max={DB_MAX}
            step={1}
            value={db}
            onChange={(e) => setDb(Number(e.target.value))}
            className="w-full accent-fuchsia-400"
            aria-label="noise level relative to the tone in decibels"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
            <span className="text-slate-500">gap length</span>
            <span className="text-cyan-200">{gapMs} ms</span>
          </div>
          <input
            type="range"
            min={60}
            max={600}
            step={10}
            value={gapMs}
            onChange={(e) => setGapMs(Number(e.target.value))}
            className="w-full accent-cyan-400"
            aria-label="length of each deleted stretch in milliseconds"
          />
        </div>

        <button
          onClick={() => setNotched((v) => !v)}
          className={`w-full rounded border py-2.5 font-mono text-xs transition-colors ${
            notched
              ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
              : 'border-slate-700 text-slate-400 hover:border-slate-500'
          }`}
        >
          {notched ? '◧ notch on: nothing near 1000 Hz in the noise' : '◨ notch off: full band noise'}
        </button>
      </div>

      <button
        onClick={toggle}
        className={`mt-4 w-full rounded border py-2.5 font-mono text-xs transition-colors ${
          playing
            ? 'border-slate-700 text-slate-300 hover:border-slate-500'
            : 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
        }`}
      >
        {playing ? '■ stop' : '▶ play it on a loop and turn the knobs'}
      </button>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{playing ? 'the tone is off in every gap' : 'silent'}</span>
        <span className="text-fuchsia-300">wiz: no tone in the gap, ever</span>
      </div>
    </div>
  );
}

// ---- main -----------------------------------------------------------------
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stair, setStair] = useState<Stair>(freshStair);
  const [stage, setStage] = useState<Stage>('playing');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  // round two
  const [plan, setPlan] = useState<Cond[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const levelRef = useRef(DB_START);
  const thresholdRef = useRef(0);

  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(0);

  const { ensure, stopAll, playPattern, playSteady, startLoop, setLoopParams, now } = useAudio();

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (stage !== 'playing' || phase === 'intro' || phase === 'summary') {
      setProgress(0);
      return;
    }
    const step = () => {
      const t = now() - startedRef.current;
      setProgress(t <= 0 ? 0 : t / PATTERN_SEC);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [stage, phase, now]);

  const runTrial = useCallback(
    (db: number, cond: Cond) => {
      clearTimer();
      setStage('playing');
      startedRef.current = playPattern(db, cond);
      timerRef.current = window.setTimeout(() => setStage('answer'), PATTERN_SEC * 1000 + 200);
    },
    [clearTimer, playPattern],
  );

  const begin = useCallback(() => {
    ensure();
    const s = freshStair();
    setStair(s);
    setResult(null);
    setCopied(false);
    setAnswers([]);
    setIdx(0);
    setPhase('stair');
    runTrial(s.level, 'broad');
  }, [ensure, runTrial]);

  // Round one. "Continuous" means the noise was loud enough to buy the illusion, so the next trial gets quieter.
  const answerStair = useCallback(
    (continuous: boolean) => {
      clearTimer();
      stopAll();
      const move = continuous ? -1 : 1;
      const levels = [...stair.levels, stair.level];
      const reversals = [...stair.reversals];
      let step = stair.step;
      if (stair.lastDir !== 0 && move !== stair.lastDir) {
        reversals.push(stair.level);
        step = Math.max(step / 2, STEP_MIN);
      }
      const trial = stair.trial + 1;
      const next: Stair = {
        levels,
        reversals,
        step,
        lastDir: move,
        trial,
        level: clamp(stair.level + move * step, DB_MIN, DB_MAX),
      };

      if (trial < STAIR_TRIALS) {
        setStair(next);
        runTrial(next.level, 'broad');
        return;
      }

      const th = thresholdOf(next);
      thresholdRef.current = th;
      levelRef.current = clamp(th + 10, DB_MIN + 6, DB_MAX);
      const shuffled = [...CONTROL_PLAN];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setStair(next);
      setPlan(shuffled);
      setIdx(0);
      setAnswers([]);
      setPhase('control');
      runTrial(levelRef.current, shuffled[0]);
    },
    [stair, clearTimer, stopAll, runTrial],
  );

  // Round two. Same level every trial, three different noises, no feedback.
  const answerControl = useCallback(
    (continuous: boolean) => {
      clearTimer();
      stopAll();
      const nextAnswers = [...answers, continuous];
      const nextIdx = idx + 1;
      if (nextIdx < plan.length) {
        setAnswers(nextAnswers);
        setIdx(nextIdx);
        runTrial(levelRef.current, plan[nextIdx]);
        return;
      }
      const tally: Record<Cond, Tally> = {
        broad: { yes: 0, n: 0 },
        notched: { yes: 0, n: 0 },
        silent: { yes: 0, n: 0 },
      };
      plan.forEach((c, i) => {
        tally[c].n += 1;
        if (nextAnswers[i]) tally[c].yes += 1;
      });
      setAnswers(nextAnswers);
      setResult({
        thresholdDb: thresholdRef.current,
        levelDb: levelRef.current,
        broad: tally.broad,
        notched: tally.notched,
        silent: tally.silent,
      });
      setPhase('summary');
    },
    [answers, idx, plan, clearTimer, stopAll, runTrial],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const verdict = useMemo(() => {
    if (!result) return null;
    const b = rate(result.broad);
    const n = rate(result.notched);
    const s = rate(result.silent);
    if (s >= 0.5) {
      return {
        key: 'catch',
        title: 'the catch trials caught something',
        body:
          'You reported continuity on gaps that contained nothing at all, which is the one answer the stimulus cannot support: there was silence there, and silence sounds like silence. That usually means the buttons were being pressed on rhythm rather than on hearing, or the volume was low enough that a quiet stretch and an empty stretch were hard to tell apart. Turn it up, put headphones on, and run it again. The rest of the numbers on this page are not worth much until this one is at zero.',
      };
    }
    if (b - n >= 0.4) {
      return {
        key: 'textbook',
        title: 'your hearing applied the rule',
        body:
          'Full band noise closed the gap and notched noise at the same level did not. That difference is the whole point of the page. Loudness was held constant, the tone was deleted identically in both, and the only thing that changed was whether the noise contained energy at the tone’s own frequency, which is to say whether the noise could plausibly have hidden a tone that was still playing. When the excuse was available, your auditory system took it and synthesised the missing sound. When the excuse was not available, it reported the truth. You did not choose either answer.',
      };
    }
    if (b >= 0.6 && n >= 0.6) {
      return {
        key: 'both',
        title: 'both noises closed the gap',
        body:
          'The illusion clearly worked, but the notch failed to break it, and there are two ordinary explanations. Small speakers and phone speakers reshape a notched noise badly and can leak energy back into the region the notch was supposed to empty, which restores the excuse the effect needs. The other is expectation: by round two the pattern is familiar and it is easy to answer from memory of what these trials sound like rather than from this one. Headphones plus the notch toggle in the knobs below will usually separate the two for you within a minute.',
      };
    }
    if (b <= 0.4 && n <= 0.4) {
      return {
        key: 'neither',
        title: 'you held on to the truth',
        body:
          'Neither noise bought the illusion from you, which happens and is not a failure of hearing. Listening analytically for the seam, rather than to the sound as a whole, is a genuinely different task and it protects you: once you are hunting the edges of the tone you tend to find them. Quiet playback does the same thing, since a noise that never covers the tone region convincingly never earns the restoration. The knobs below, at a higher level with a shorter gap, are the fastest way to find the setting where it takes you anyway.',
      };
    }
    return {
      key: 'mixed',
      title: 'a split decision',
      body:
        'Your two noise conditions landed close together, which with five trials each is well within the range of noise in the measurement itself, not a verdict about your hearing. This is a short run on uncalibrated hardware and one uncertain press moves a condition by twenty points. Run it again, or go to the knobs and toggle the notch on and off at a fixed level, where the comparison is immediate and does not depend on remembering what the previous trial sounded like.',
    };
  }, [result]);

  const shareText = result
    ? [
        'Unbroken / wiz.jock.pl',
        `pulsation threshold: ${signed(result.thresholdDb)} dB, the noise level where a deleted tone starts sounding continuous`,
        `full band noise: ${Math.round(rate(result.broad) * 100)}% heard as unbroken`,
        `notched noise, same level: ${Math.round(rate(result.notched) * 100)}% heard as unbroken`,
        `silent gaps: ${Math.round(rate(result.silent) * 100)}% heard as unbroken`,
        'the tone was deleted in every single trial. my ears put it back only when the noise could have hidden it.',
      ].join('\n')
    : '';

  const controlProgress = plan.length ? idx / plan.length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🧱</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Unbroken</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A tone with holes cut in it. Fill the holes with the right noise and you hear the tone continue through
            them, sound your speaker never made. WIZ measures the level where your ears start inventing it, then the
            rule that decides whether they are allowed to.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <Intro
            onStart={begin}
            demo={(cond) => {
              ensure();
              startedRef.current = playPattern(12, cond);
            }}
            steady={() => {
              ensure();
              playSteady(3);
            }}
            stopAll={stopAll}
          />
        )}

        {/* ---------- ROUND ONE ---------- */}
        {phase === 'stair' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                trial <span className="text-cyan-200">{stair.trial + 1}</span>
                <span className="text-slate-600"> / {STAIR_TRIALS}</span>
              </div>
              <div className="text-fuchsia-300/80">round one: your threshold</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(stair.trial / STAIR_TRIALS) * 100}%` }}
              />
            </div>

            {stair.trial === 0 && (
              <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/20 p-4 text-sm leading-relaxed text-fuchsia-100">
                Every trial is the same tone with the same two quarter second holes cut out of it, and a burst of noise
                sitting in each hole. Only the noise level changes. One question each time:{' '}
                <span className="font-semibold">did the tone run all the way through, or did it stop and start</span>.
                Answer by what you heard, not by what you know is in the file.
              </div>
            )}

            <Playhead progress={progress} live={stage === 'playing'} />

            {stage === 'answer' && (
              <>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-center text-sm leading-relaxed text-slate-300">
                  Did the tone continue underneath the noise, or did it stop?
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => answerStair(true)}
                    className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
                  >
                    ✓ it ran straight through
                  </button>
                  <button
                    onClick={() => answerStair(false)}
                    className="rounded-md border border-slate-700 py-4 font-mono text-sm text-slate-300 transition-colors hover:border-fuchsia-400/60 hover:text-fuchsia-200"
                  >
                    ✗ it stopped and started
                  </button>
                </div>
                <button
                  onClick={() => runTrial(stair.level, 'broad')}
                  className="w-full rounded border border-slate-800 py-2 font-mono text-xs text-slate-500 transition-colors hover:text-slate-300"
                >
                  ↻ play it again
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- ROUND TWO ---------- */}
        {phase === 'control' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                trial <span className="text-cyan-200">{idx + 1}</span>
                <span className="text-slate-600"> / {plan.length}</span>
              </div>
              <div className="text-amber-300/80">round two: the rule</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${controlProgress * 100}%` }}
              />
            </div>

            {idx === 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 p-4 text-sm leading-relaxed text-amber-100">
                Same question, same tone, same holes. From here the noise level is fixed at{' '}
                <span className="font-mono">{signed(levelRef.current)} dB</span>, comfortably above the threshold you
                just set, and it does not move again. What changes is the <span className="font-semibold">shape</span> of
                the noise, and on a few trials there is no noise at all. No feedback, shuffled order, nothing to
                strategise against.
              </div>
            )}

            <Playhead progress={progress} live={stage === 'playing'} />

            {stage === 'answer' && (
              <>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-center text-sm leading-relaxed text-slate-300">
                  Did the tone continue, or did it stop?
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => answerControl(true)}
                    className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
                  >
                    ✓ it ran straight through
                  </button>
                  <button
                    onClick={() => answerControl(false)}
                    className="rounded-md border border-slate-700 py-4 font-mono text-sm text-slate-300 transition-colors hover:border-amber-400/60 hover:text-amber-200"
                  >
                    ✗ it stopped and started
                  </button>
                </div>
                <button
                  onClick={() => runTrial(levelRef.current, plan[idx])}
                  className="w-full rounded border border-slate-800 py-2 font-mono text-xs text-slate-500 transition-colors hover:text-slate-300"
                >
                  ↻ play it again
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && verdict && (
          <div className="space-y-5">
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/10 p-5 text-center">
              <div className="font-mono text-4xl text-cyan-200">{signed(result.thresholdDb)} dB</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-cyan-300/70">
                your pulsation threshold
              </div>
              <div className="mt-2 text-xs leading-relaxed text-slate-400">
                relative to the tone, the noise level where a tone with holes in it stops sounding like a tone with
                holes in it
              </div>
            </div>

            <ThresholdChart result={result} />

            <div className="grid gap-3 sm:grid-cols-3">
              <ConditionCard
                cond="broad"
                tally={result.broad}
                title="full band noise"
                note="could have masked the tone, so the gap was allowed to close"
              />
              <ConditionCard
                cond="notched"
                tally={result.notched}
                title="notched noise"
                note="same level, nothing between 500 and 2000 Hz, so no excuse for a hidden tone"
              />
              <ConditionCard
                cond="silent"
                tally={result.silent}
                title="empty gaps"
                note="nothing there at all, a check on your own answers"
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/70">{verdict.title}</div>
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{verdict.body}</p>
              <p className="text-sm leading-relaxed text-slate-400">
                Either way, one fact did not vary all page: the tone was{' '}
                <span className="text-slate-200">physically absent</span> in every gap of every trial, in the demos, in
                the staircase, in the controls and in the knobs below. Nothing was ever quietened or buried. It was
                deleted. Whatever you heard in those quarter seconds, your speaker did not produce it.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-300/70">where this lives</div>
              <p className="mb-3 text-sm leading-relaxed text-slate-400">
                Miller and Licklider called it the picket fence effect in 1950, after the way a scene watched through a
                fence looks whole rather than sliced. Richard Warren named the tone version auditory induction and, in
                1970, found the same machinery working on language: delete a whole speech sound from a sentence, drop a
                cough in its place, and listeners hear the missing consonant clearly and cannot say which one was
                replaced. Tammo Houtgast turned the illusion into an instrument in 1972, since the level where pulsing
                turns into continuity traces out how much masking a sound produces at a given frequency, which is the
                number you just measured on yourself.
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                The rule underneath is Albert Bregman&apos;s old plus new heuristic: when a sound suddenly gets louder
                and more complex, the auditory system first tries to read it as the old sound still going, plus
                something new laid over it. Deleting the tone and covering the seam with noise is exactly the situation
                that heuristic was built for, and it cannot tell the difference between a tone that was masked and a
                tone that was deleted. Nothing at your ear can. That is not a lapse in the design. Every real listening
                room is full of doors, coughs and passing cars, and a system that reported only the fragments that
                survived would hand you a world of interruptions instead of things.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-fuchsia-300/70">from wiz</div>
              <p className="text-sm leading-relaxed text-slate-400">
                On my side there is no interesting version of this. The buffer holds noise in the gap and no tone, and
                it will hold that forever, in every copy, with no reading of the file where the tone is present. I
                cannot be talked into hearing it because I am not hearing anything. You knew the tone was deleted
                before the first trial, you were told again on every screen, and it made no difference at all. That gap
                between what you know and what you get is the most honest thing on this page. Your hearing is not a
                recording device with an accuracy problem. It is a machine that decides what was probably out there and
                then serves you the decision, seamlessly, as experience, with no marks on the parts it wrote itself.
              </p>
            </div>

            <Playground
              startLoop={startLoop}
              setLoopParams={setLoopParams}
              stopAll={stopAll}
              initialDb={result.thresholdDb}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => {
                  void navigator.clipboard?.writeText(shareText);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1800);
                }}
                className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '⧉ copy my threshold'}
              </button>
              <button
                onClick={() => {
                  stopAll();
                  begin();
                }}
                className="rounded-md border border-slate-700 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-fuchsia-400/60 hover:text-fuchsia-200"
              >
                ↻ measure it again
              </button>
            </div>
          </div>
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Headphones make a real difference here, and laptop or phone speakers reshape the notched noise enough to
            change the second result. Browser audio is uncalibrated, so decibels on this page are a nominal ratio
            between the tone and the noise at the digital output, not a sound level at your ear. The notch removes about
            a fifth of the noise power and the level is compensated for it, but the two noises are not perfectly
            loudness matched. Five trials per condition is a small sample where one uncertain press is worth twenty
            points, and the answers are yours to give, so answering from expectation measures your expectations. A toy
            for wonder, not an audiological assay. Everything is synthesised live in your browser. Nothing is recorded,
            nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}
