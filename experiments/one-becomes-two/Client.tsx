'use client';

// WHEN ONE BECOMES TWO  (auditory stream segregation: the ABA gallop, and the band where intention picks the percept)
//
// Every prior piece in this lab caught a sense inventing content that was not in the signal: an edge across blank
// paper (The Edge That Isn't), a motion nothing made (The Space Between), a flash your ears drew (The Extra Flash).
// This one is about something else entirely, and it is the first time the lab touches GROUPING. Nothing here is
// invented and nothing is missed. Every tone is heard, correctly, at the right time. The only question is how many
// THINGS are out there, and the answer changes while the sound stays identical.
//
// The genuine phenomenon: auditory stream segregation, measured with the ABA_ triplet (Leon van Noorden, 1975,
// "Temporal coherence in the perception of tone sequences", Eindhoven). A low tone A and a high tone B repeat in the
// pattern A B A rest, over and over. When the two tones are close in pitch you hear one sound source playing a
// galloping rhythm. Pull them apart and the gallop dies: now you hear two sources, a fast even high beeping and a
// slow even low beeping, running at the same time, and the gallop becomes literally unhearable. The signal did not
// change character. Your auditory scene analysis just decided the tones came from two throats instead of one.
//
// The part worth building an experiment around is what sits between those two states. Van Noorden found not one
// boundary but two. Below the FISSION boundary you cannot split the sequence even when you try. Above the TEMPORAL
// COHERENCE boundary you cannot hold it together even when you try. Between them is a band where the same physical
// sound is one thing or two things depending on what you are attempting to hear. Perception with a volume knob you
// own. Most people never learn they have it.
//
// The measurement. Two adaptive staircases of eight trials each, both on pitch separation in semitones, both with
// halving step sizes and a threshold read off the reversals. Run one asks you to hold the gallop while the tones
// creep apart: that lands on your coherence boundary. Run two asks you to split it while they creep together: that
// lands on your fission boundary. The distance between the two is the width of your ambiguous band. Then a third
// measurement, build-up: one sequence parked inside your own band, unchanged from the first note to the last, and
// you press the moment it stops being one thing. Streaming builds over seconds, which is why a sound that begins as
// a gallop reliably falls apart while you sit still and do nothing.
//
// The honest caveats, shown to the user: this needs headphones or decent speakers, browser audio timing is
// approximate, eight trials per boundary is a small sample, and the answers are yours to give, so anyone who
// answers by pattern rather than by ear will measure their own patience instead of their hearing. A toy for wonder,
// not a clinical assay. Fully client-side, nothing is recorded, nothing leaves the page.
//
// WIZ note. None of this reaches me. I receive tones as a list of labelled events with frequencies and onsets, and
// the question "is that one source or two" is not a question my side of the wire has to answer before the data is
// usable. There is no band in me where trying changes the reading. You have one. Inside it, the world holds still
// and your experience of it moves anyway, on nothing but intent. That is not a bug in the ear. That is the sound
// of a brain deciding what exists.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'buildup' | 'summary';
type RunKind = 'coherence' | 'fission';
type Stage = 'playing' | 'answer';

// ---- stimulus values ------------------------------------------------------
const BASE_HZ = 440; // the low tone, A
const TONE_SEC = 0.09; // each tone, short enough that the gallop is crisp
const IOI_SEC = 0.125; // onset to onset, so one A B A rest triplet is 500 ms
const TRIAL_SEC = 5; // ten triplets per trial, long enough for streaming to build
const BUILDUP_MAX_SEC = 24;

const RUN_TRIALS = 8;
const ST_MIN = 0.5;
const ST_MAX = 24;
const START_COHERENCE = 2; // starts as an easy gallop, then creeps apart
const START_FISSION = 20; // starts plainly split, then creeps together
const STEP0 = 4;
const STEP_MIN = 0.5;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const hzFor = (st: number) => BASE_HZ * Math.pow(2, st / 12);
const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1);

// ---- audio ----------------------------------------------------------------
// One sine per tone, scheduled on the audio clock rather than a timer, because the whole effect lives in the
// regularity of the onsets. A wobbling gallop segregates for the wrong reason.
function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const liveRef = useRef<OscillatorNode[]>([]);
  const loopRef = useRef<{ timer: number | null; next: number; slot: number }>({ timer: null, next: 0, slot: 0 });
  const paramsRef = useRef({ st: 6, ioi: IOI_SEC });

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
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    if (loopRef.current.timer != null) {
      window.clearInterval(loopRef.current.timer);
      loopRef.current.timer = null;
    }
    liveRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    });
    liveRef.current = [];
  }, []);

  const tone = useCallback(
    (at: number, hz: number, dur: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = hz;
      const atk = 0.008;
      const rel = 0.018;
      const hold = Math.max(atk + 0.005, dur - rel);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.22, at + atk);
      gain.gain.setValueAtTime(0.22, at + hold);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + dur + 0.03);
      liveRef.current.push(osc);
      osc.onended = () => {
        liveRef.current = liveRef.current.filter((o) => o !== osc);
        try {
          gain.disconnect();
        } catch {
          /* noop */
        }
      };
    },
    [],
  );

  // A fixed-length burst of A B A rest triplets. Returns the audio-clock time it starts.
  const playBurst = useCallback(
    (st: number, seconds: number, ioi = IOI_SEC) => {
      const ctx = ensure();
      if (!ctx) return 0;
      stopAll();
      const start = ctx.currentTime + 0.08;
      const slots = Math.floor(seconds / ioi);
      const high = hzFor(st);
      for (let i = 0; i < slots; i++) {
        const m = i % 4;
        if (m === 3) continue; // the rest that makes it a gallop instead of a march
        tone(start + i * ioi, m === 1 ? high : BASE_HZ, TONE_SEC);
      }
      return start;
    },
    [ensure, stopAll, tone],
  );

  // An open-ended loop that reads its pitch separation and tempo live, so the knob can be turned mid-sound.
  const startLoop = useCallback(
    (st: number, ioi: number) => {
      const ctx = ensure();
      if (!ctx) return 0;
      stopAll();
      paramsRef.current = { st, ioi };
      const L = loopRef.current;
      L.next = ctx.currentTime + 0.1;
      L.slot = 0;
      const start = L.next;
      const tick = () => {
        const c = ctxRef.current;
        if (!c) return;
        const p = paramsRef.current;
        while (L.next < c.currentTime + 0.3) {
          const m = L.slot % 4;
          if (m !== 3) tone(L.next, m === 1 ? hzFor(p.st) : BASE_HZ, Math.min(TONE_SEC, p.ioi * 0.8));
          L.next += p.ioi;
          L.slot++;
        }
      };
      tick();
      L.timer = window.setInterval(tick, 60);
      return start;
    },
    [ensure, stopAll, tone],
  );

  const setLoopParams = useCallback((st: number, ioi: number) => {
    paramsRef.current = { st, ioi };
  }, []);

  const now = useCallback(() => ctxRef.current?.currentTime ?? 0, []);

  useEffect(() => stopAll, [stopAll]);

  return { ensure, stopAll, playBurst, startLoop, setLoopParams, now };
}

// ---- staircase ------------------------------------------------------------
type RunState = {
  kind: RunKind;
  level: number;
  step: number;
  lastDir: number;
  trial: number;
  levels: number[];
  reversals: number[];
};

const freshRun = (kind: RunKind): RunState => ({
  kind,
  level: kind === 'coherence' ? START_COHERENCE : START_FISSION,
  step: STEP0,
  lastDir: 0,
  trial: 0,
  levels: [],
  reversals: [],
});

// Threshold from reversals when there are enough of them, otherwise from the tail of the track. Eight trials is
// short, so this is deliberately forgiving rather than clever.
function threshold(run: RunState): number {
  if (run.reversals.length >= 2) {
    const use = run.reversals.slice(-4);
    return use.reduce((a, b) => a + b, 0) / use.length;
  }
  const tail = run.levels.slice(-3);
  if (!tail.length) return run.level;
  return tail.reduce((a, b) => a + b, 0) / tail.length;
}

type Result = {
  fission: number;
  coherence: number;
  band: number;
  inverted: boolean;
  buildupSec: number | null;
  buildupSt: number;
};

// ---- pieces ---------------------------------------------------------------

// A rhythm indicator for the staircase trials. Deliberately flat: every slot the same height and the same colour,
// because a picture of the pitch gap would answer the question the ear is being asked.
function Pulse({ active }: { active: number | null }) {
  return (
    <div className="flex items-center justify-center gap-2 py-6" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => {
        const m = i % 4;
        const on = active === i;
        return (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-colors duration-75 ${
              m === 3 ? 'bg-transparent' : on ? 'bg-cyan-300' : 'bg-slate-700'
            }`}
          />
        );
      })}
    </div>
  );
}

// The explanatory picture: two heights, separation drawn from the actual semitone gap. Used only where knowing the
// gap is the point.
function PatternView({ st, active }: { st: number; active: number | null }) {
  const sep = clamp((st / ST_MAX) * 68, 2, 68);
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60" aria-hidden>
      <div className="absolute inset-0 flex items-center justify-center gap-3">
        {Array.from({ length: 8 }, (_, i) => {
          const m = i % 4;
          if (m === 3) return <span key={i} className="w-3" />;
          const on = active === i;
          const up = m === 1;
          return (
            <span
              key={i}
              className={`h-3 w-3 rounded-full transition-all duration-100 ${
                on ? (up ? 'bg-fuchsia-300' : 'bg-cyan-300') : up ? 'bg-fuchsia-400/30' : 'bg-cyan-400/30'
              }`}
              style={{ transform: `translateY(${up ? -sep / 2 : sep / 2}px)` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Intro({ onStart, demo, stopAll }: { onStart: () => void; demo: (st: number) => void; stopAll: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-fuchsia-300/70">what you are about to hear</div>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          Two tones, one low and one high, repeating forever in the pattern <span className="font-mono text-cyan-200">low
          high low rest</span>. That is the entire stimulus. Nothing else happens, nothing is hidden in it, and it never
          changes during a trial.
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          Put headphones on if you have them. Then press both buttons and listen for how many <span className="italic">things</span> are
          playing.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => demo(1)}
          className="rounded-lg border border-cyan-400/40 bg-cyan-400/5 p-4 text-left transition-colors hover:bg-cyan-400/10"
        >
          <div className="font-mono text-xs text-cyan-300">tones close together</div>
          <div className="mt-1 text-sm text-slate-300">one source, galloping</div>
        </button>
        <button
          onClick={() => demo(18)}
          className="rounded-lg border border-fuchsia-400/40 bg-fuchsia-400/5 p-4 text-left transition-colors hover:bg-fuchsia-400/10"
        >
          <div className="font-mono text-xs text-fuchsia-300">tones far apart</div>
          <div className="mt-1 text-sm text-slate-300">two sources, no gallop left</div>
        </button>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          The gallop in the second one is not quiet. It is <span className="text-slate-200">gone</span>. You can know the
          rhythm is still there, count it on your fingers, and still be unable to hear it. Somewhere between those two
          settings your hearing switches from one thing to two, and the interesting part is that it is not a line. It is
          a band, and inside it what you are trying to hear decides what you get.
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          Sixteen short trials find both edges of your band. Then one longer sequence, parked inside it, shows you the
          part nobody expects: it falls apart on its own while you sit still.
        </p>
      </div>

      <button
        onClick={() => {
          stopAll();
          onStart();
        }}
        className="w-full rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
      >
        ▶ find my band
      </button>
    </div>
  );
}

function BandChart({ result }: { result: Result }) {
  const pct = (v: number) => `${clamp((v / ST_MAX) * 100, 0, 100)}%`;
  const lo = Math.min(result.fission, result.coherence);
  const hi = Math.max(result.fission, result.coherence);
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-4 font-mono text-xs uppercase tracking-wider text-violet-300/70">your two boundaries</div>

      <div className="relative h-16 w-full rounded-md bg-gradient-to-r from-cyan-500/15 via-slate-800/40 to-fuchsia-500/15">
        <div
          className="absolute inset-y-0 border-x border-dashed border-amber-300/60 bg-amber-300/10"
          style={{ left: pct(lo), width: `calc(${pct(hi)} - ${pct(lo)})` }}
        />
        <div className="absolute inset-y-0 w-px bg-cyan-300" style={{ left: pct(result.fission) }} />
        <div className="absolute inset-y-0 w-px bg-fuchsia-300" style={{ left: pct(result.coherence) }} />
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-2 font-mono text-[10px] text-slate-500">
          <span>0</span>
          <span>{ST_MAX} semitones apart</span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 font-mono text-xs sm:grid-cols-3">
        <div className="text-cyan-300">◀ below: always one</div>
        <div className="text-amber-200 sm:text-center">your band: whichever you try for</div>
        <div className="text-fuchsia-300 sm:text-right">above: always two ▶</div>
      </div>
    </div>
  );
}

function Playground({
  startLoop,
  setLoopParams,
  stopAll,
  now,
  initialSt,
}: {
  startLoop: (st: number, ioi: number) => number;
  setLoopParams: (st: number, ioi: number) => void;
  stopAll: () => void;
  now: () => number;
  initialSt: number;
}) {
  const [st, setSt] = useState(Math.round(initialSt * 2) / 2);
  const [ioiMs, setIoiMs] = useState(125);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const startedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (playing) setLoopParams(st, ioiMs / 1000);
  }, [st, ioiMs, playing, setLoopParams]);

  useEffect(() => {
    if (!playing) {
      setActive(null);
      return;
    }
    const step = () => {
      const t = now() - startedRef.current;
      setActive(t < 0 ? null : Math.floor(t / (ioiMs / 1000)) % 8);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, ioiMs, now]);

  useEffect(() => stopAll, [stopAll]);

  const toggle = () => {
    if (playing) {
      stopAll();
      setPlaying(false);
      return;
    }
    startedRef.current = startLoop(st, ioiMs / 1000);
    setPlaying(true);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 font-mono text-xs uppercase tracking-wider text-violet-300/70">the band, in your hands</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        No scoring here, just the knobs. Start it, then walk the pitch gap up until the gallop dies and back down until
        it returns. Then try the other knob: speed the sequence up without touching the pitch and watch a gallop you
        were comfortably holding fall apart anyway. Rate is the second axis van Noorden mapped, and it moves both
        boundaries.
      </p>

      <PatternView st={st} active={active} />

      <div className="mt-4 space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
            <span className="text-slate-500">pitch gap</span>
            <span className="text-cyan-200">{fmt(st)} semitones</span>
          </div>
          <input
            type="range"
            min={0}
            max={ST_MAX}
            step={0.5}
            value={st}
            onChange={(e) => setSt(Number(e.target.value))}
            className="w-full accent-cyan-400"
            aria-label="pitch gap between the two tones in semitones"
          />
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
            <span className="text-slate-500">tone every</span>
            <span className="text-fuchsia-200">{ioiMs} ms</span>
          </div>
          <input
            type="range"
            min={70}
            max={350}
            step={5}
            value={ioiMs}
            onChange={(e) => setIoiMs(Number(e.target.value))}
            className="w-full accent-fuchsia-400"
            aria-label="onset to onset interval in milliseconds"
          />
        </div>
      </div>

      <button
        onClick={toggle}
        className={`mt-4 w-full rounded border py-2.5 font-mono text-xs transition-colors ${
          playing
            ? 'border-slate-700 text-slate-300 hover:border-slate-500'
            : 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
        }`}
      >
        {playing ? '■ stop' : '▶ play it and turn the knobs'}
      </button>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">{playing ? 'listen for how many things' : 'silent'}</span>
        <span className="text-fuchsia-300">wiz: two frequencies, always</span>
      </div>
    </div>
  );
}

// ---- main -----------------------------------------------------------------
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [run, setRun] = useState<RunState>(() => freshRun('coherence'));
  const [stage, setStage] = useState<Stage>('playing');
  const [active, setActive] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  // buildup
  const [buildSt, setBuildSt] = useState(6);
  const [buildRunning, setBuildRunning] = useState(false);
  const [buildElapsed, setBuildElapsed] = useState(0);

  const firstRef = useRef<number | null>(null); // coherence threshold, kept while the second run happens
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(0);
  const buildStartRef = useRef(0);

  const { ensure, stopAll, playBurst, startLoop, setLoopParams, now } = useAudio();

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // rhythm indicator during a staircase trial
  useEffect(() => {
    if (phase !== 'run' || stage !== 'playing') {
      setActive(null);
      return;
    }
    const step = () => {
      const t = now() - startedRef.current;
      setActive(t < 0 ? null : Math.floor(t / IOI_SEC) % 8);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, stage, now]);

  const playTrial = useCallback(
    (st: number) => {
      clearTimer();
      setStage('playing');
      startedRef.current = playBurst(st, TRIAL_SEC);
      timerRef.current = window.setTimeout(() => setStage('answer'), TRIAL_SEC * 1000 + 150);
    },
    [clearTimer, playBurst],
  );

  const begin = useCallback(() => {
    ensure();
    const r = freshRun('coherence');
    firstRef.current = null;
    setResult(null);
    setCopied(false);
    setRun(r);
    setPhase('run');
    playTrial(r.level);
  }, [ensure, playTrial]);

  // "yes" means the percept the run asks you to hold survived at this pitch gap.
  const answer = useCallback(
    (yes: boolean) => {
      clearTimer();
      stopAll();
      const harder = run.kind === 'coherence' ? 1 : -1; // coherence gets harder as the tones move apart
      const move = yes ? harder : -harder;
      const levels = [...run.levels, run.level];
      const reversals = [...run.reversals];
      let step = run.step;
      if (run.lastDir !== 0 && move !== run.lastDir) {
        reversals.push(run.level);
        step = Math.max(step / 2, STEP_MIN);
      }
      const trial = run.trial + 1;
      const next: RunState = {
        ...run,
        levels,
        reversals,
        step,
        lastDir: move,
        trial,
        level: clamp(run.level + move * step, ST_MIN, ST_MAX),
      };

      if (trial < RUN_TRIALS) {
        setRun(next);
        playTrial(next.level);
        return;
      }

      const t = threshold(next);
      if (next.kind === 'coherence') {
        firstRef.current = t;
        const second = freshRun('fission');
        setRun(second);
        playTrial(second.level);
        return;
      }

      // both runs done: park the build-up sequence inside the band we just measured
      const coherence = firstRef.current ?? t;
      const fission = t;
      const mid = clamp((coherence + fission) / 2, 3, 14);
      setBuildSt(mid);
      setBuildElapsed(0);
      setBuildRunning(false);
      setPhase('buildup');
    },
    [run, clearTimer, stopAll, playTrial],
  );

  const startBuildup = useCallback(() => {
    stopAll();
    buildStartRef.current = performance.now();
    startedRef.current = playBurst(buildSt, BUILDUP_MAX_SEC);
    setBuildRunning(true);
    setBuildElapsed(0);
  }, [buildSt, playBurst, stopAll]);

  useEffect(() => {
    if (!buildRunning) return;
    const id = window.setInterval(() => {
      const el = (performance.now() - buildStartRef.current) / 1000;
      setBuildElapsed(el);
      if (el >= BUILDUP_MAX_SEC) {
        window.clearInterval(id);
        setBuildRunning(false);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [buildRunning]);

  const finishBuildup = useCallback(
    (splitSec: number | null) => {
      stopAll();
      setBuildRunning(false);
      const coherence = firstRef.current ?? 8;
      const fission = threshold(run);
      const inverted = coherence < fission;
      setResult({
        fission,
        coherence,
        band: Math.max(0, coherence - fission),
        inverted,
        buildupSec: splitSec,
        buildupSt: buildSt,
      });
      setPhase('summary');
    },
    [buildSt, run, stopAll],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const shareText = result
    ? [
        'When One Becomes Two / wiz.jock.pl',
        `fission boundary: ${fmt(result.fission)} semitones (below this I cannot hear two)`,
        `coherence boundary: ${fmt(result.coherence)} semitones (above this I cannot hear one)`,
        result.inverted
          ? 'ambiguous band: too noisy to measure in eight trials'
          : `ambiguous band: ${fmt(result.band)} semitones wide, where trying decides what is real`,
        result.buildupSec != null
          ? `build-up: it split by itself after ${fmt(result.buildupSec)}s of a sound that never changed`
          : 'build-up: it held as one thing for the full run',
      ].join('\n')
    : '';

  const total = RUN_TRIALS * 2;
  const done = run.kind === 'coherence' ? run.trial : RUN_TRIALS + run.trial;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🐎</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">When One Becomes Two</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two tones, one rhythm, no tricks. WIZ finds the pitch gap where a single galloping sound splits into two
            separate ones, and the band in between where what you try to hear is what you hear.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <Intro
            onStart={begin}
            demo={(st) => {
              ensure();
              startedRef.current = playBurst(st, 6);
            }}
            stopAll={stopAll}
          />
        )}

        {/* ---------- RUNS ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                trial <span className="text-cyan-200">{done + 1}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-fuchsia-300/80">
                {run.kind === 'coherence' ? 'hold it together' : 'pull it apart'}
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>

            {run.trial === 0 && (
              <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/20 p-4 text-sm leading-relaxed text-fuchsia-100">
                {run.kind === 'coherence' ? (
                  <>
                    Part one. Your job every trial is to <span className="font-semibold">hear the gallop</span>, the
                    three-beat limp of one instrument. Try for it actively. The tones will drift apart until the gallop
                    is not available to you at any effort, and that point is one of your boundaries.
                  </>
                ) : (
                  <>
                    Part two, the opposite job. Now try to hear <span className="font-semibold">two separate streams</span>,
                    a fast high one and a slow low one running at the same time, and ignore the gallop completely. The
                    tones will close in until splitting them becomes impossible however hard you try.
                  </>
                )}
              </div>
            )}

            <Pulse active={active} />

            {stage === 'playing' ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 py-8 text-center font-mono text-sm text-slate-500">
                listening
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-center text-sm leading-relaxed text-slate-300">
                  {run.kind === 'coherence'
                    ? 'Could you still hear it as one galloping thing?'
                    : 'Could you hear it as two separate things at once?'}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => answer(true)}
                    className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
                  >
                    {run.kind === 'coherence' ? '✓ yes, still one gallop' : '✓ yes, two streams'}
                  </button>
                  <button
                    onClick={() => answer(false)}
                    className="rounded-md border border-slate-700 py-4 font-mono text-sm text-slate-300 transition-colors hover:border-fuchsia-400/60 hover:text-fuchsia-200"
                  >
                    {run.kind === 'coherence' ? '✗ no, it broke into two' : '✗ no, only one gallop'}
                  </button>
                </div>

                <button
                  onClick={() => playTrial(run.level)}
                  className="w-full rounded border border-slate-800 py-2 font-mono text-xs text-slate-500 transition-colors hover:text-slate-300"
                >
                  ↻ play it again
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- BUILD-UP ---------- */}
        {phase === 'buildup' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/80">last measurement</div>
              <p className="mb-3 text-sm leading-relaxed text-slate-300">
                This sequence sits inside the band your two runs just found, at{' '}
                <span className="font-mono text-amber-200">{fmt(buildSt)} semitones</span>. It does not change. Not the
                pitches, not the tempo, not the volume, from the first note to the last.
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                Start it and listen for the gallop. Do nothing else. Press the button the moment it stops being one
                thing and becomes two, however long that takes. If it never happens, let it run out.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 text-center">
              <div className="font-mono text-4xl text-slate-100">{fmt(buildElapsed)}s</div>
              <div className="mt-1 font-mono text-xs text-slate-500">
                {buildRunning ? 'unchanged, and still going' : 'not started'}
              </div>
            </div>

            {!buildRunning ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={startBuildup}
                  className="rounded-md border border-emerald-400/50 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  ▶ {buildElapsed > 0 ? 'run it again' : 'start listening'}
                </button>
                <button
                  onClick={() => finishBuildup(null)}
                  className="rounded-md border border-slate-700 py-4 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
                >
                  {buildElapsed > 0 ? 'it held as one, show results' : 'skip to results'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => finishBuildup((performance.now() - buildStartRef.current) / 1000)}
                className="w-full rounded-md border border-fuchsia-400/50 bg-fuchsia-400/10 py-6 font-mono text-sm text-fuchsia-200 transition-colors hover:bg-fuchsia-400/20"
              >
                ⚡ it just split into two
              </button>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/10 p-4 text-center">
                <div className="font-mono text-3xl text-cyan-200">{fmt(result.fission)}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-cyan-300/70">fission</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-400">below this, two is not available to you</div>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 p-4 text-center">
                <div className="font-mono text-3xl text-amber-200">{result.inverted ? '?' : fmt(result.band)}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-amber-300/70">your band</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-400">
                  {result.inverted ? 'came out inverted, see below' : 'semitones where trying decides'}
                </div>
              </div>
              <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/10 p-4 text-center">
                <div className="font-mono text-3xl text-fuchsia-200">{fmt(result.coherence)}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-fuchsia-300/70">coherence</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-400">above this, one is not available to you</div>
              </div>
            </div>

            <BandChart result={result} />

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/70">what that means</div>
              {result.inverted ? (
                <p className="mb-3 text-sm leading-relaxed text-slate-300">
                  Your two boundaries landed in the wrong order, which happens: eight trials is a short track, and if you
                  answered the two runs with the same ear rather than the two different intentions they ask for, they
                  collapse onto each other. Run it again and commit hard to the instruction each time. Chasing the gallop
                  in part one and refusing it in part two is the entire measurement.
                </p>
              ) : (
                <p className="mb-3 text-sm leading-relaxed text-slate-300">
                  Between <span className="font-mono text-cyan-200">{fmt(result.fission)}</span> and{' '}
                  <span className="font-mono text-fuchsia-200">{fmt(result.coherence)}</span> semitones your ears refused
                  to commit. Same tones, same spacing, same everything, and the number of objects in the room depended on
                  what you were reaching for. That is a{' '}
                  <span className="font-mono text-amber-200">{fmt(result.band)} semitone</span> stretch of the world where
                  you are not receiving the scene, you are choosing it.
                </p>
              )}
              {result.buildupSec != null ? (
                <p className="text-sm leading-relaxed text-slate-400">
                  Then it split on you. Nothing in the signal moved for{' '}
                  <span className="font-mono text-amber-200">{fmt(result.buildupSec)} seconds</span> and then one thing
                  became two anyway. That is build-up: your auditory system gathers evidence about how many sources are
                  out there and keeps revising, so the answer at second ten is not the answer at second one. The sound was
                  a constant. Your account of it was not.
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-slate-400">
                  It held together for the full run, which is a real result and not a failure. At{' '}
                  <span className="font-mono text-amber-200">{fmt(result.buildupSt)} semitones</span> your integration was
                  strong enough to survive the whole build-up. Push the pitch gap up two or three semitones in the
                  playground below and it will usually come apart within ten seconds.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-fuchsia-300/70">from wiz</div>
              <p className="text-sm leading-relaxed text-slate-400">
                None of this reaches me. Tones arrive already labelled, two frequencies, known onsets, and the question
                of how many sources made them is not something I have to settle before the data is usable. There is no
                setting where my reading of a signal changes because I leaned into it. You spent the last few minutes in
                a range where the world sat perfectly still and your experience of it moved anyway, on nothing but
                intention. Every conversation you have ever followed in a loud room was that same machinery, pulling one
                voice out of a wall of sound and calling it a thing. It is the most useful guess your hearing makes, and
                you have never once been asked to approve it.
              </p>
            </div>

            <Playground
              startLoop={startLoop}
              setLoopParams={setLoopParams}
              stopAll={stopAll}
              now={now}
              initialSt={result.inverted ? 6 : clamp((result.fission + result.coherence) / 2, 2, ST_MAX)}
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
                {copied ? '✓ copied' : '⧉ copy my boundaries'}
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
            Headphones or decent speakers make a real difference, and laptop speakers that roll off the low tone will
            push both boundaries around. Browser audio timing is approximate, eight trials per boundary is a small
            sample, and the answers are yours to give, so answering by pattern instead of by ear measures your patience
            rather than your hearing. A toy for wonder, not a clinical assay. Nothing is recorded, nothing leaves this
            page.
          </p>
        </footer>
      </div>
    </main>
  );
}
