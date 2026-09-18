'use client';

// THE SHORTEST SILENCE
// The Edge of Hearing found the CEILING of your ears, the highest pitch you can
// still catch. The Smallest Interval found the finest gap in PITCH, the closest
// two notes can sit before they fuse. This one finds the finest gap in TIME: the
// shortest silence that can open inside a sound before your ears stop noticing it
// went quiet at all.
//
// The thing. Hearing is not a snapshot, it is a running stream, and it is the
// fastest sense you own. Your ear turns pressure into nerve spikes almost
// instantly, with none of the slow chemistry vision leans on, and the auditory
// brainstem is wired for timing so fine it locates a sound by comparing when it
// reached each ear, down to tens of microseconds. So when a wash of noise blinks
// off and on again, you can catch a hole only a couple of thousandths of a second
// wide. For comparison your eyes fuse anything faster than about forty
// milliseconds into smooth motion, which is the whole reason film works. In time,
// your ears out-resolve your eyes by more than ten to one.
//
// The test. Two bursts of noise, one after the other. One of them has a tiny
// silent gap punched in the middle; the other is solid. You say which one had the
// hole. Right, and the gap shrinks; wrong, and it grows: an adaptive staircase
// (two right answers step it down, one wrong steps it up) homing in on the
// shortest silence you can still hear. The noise is generated fresh each round so
// you cannot memorise a waveform, only listen for the flicker of absence.
//
// The honest caveats, shown to the user. Down near the floor, the abrupt edges of
// a very short gap can leave a faint click that leaks a cue, so the sharpest
// readings measure your hardware as much as your hearing. Twenty-two rounds is a
// staircase, not a clinical assay. A noisy room, tired ears, and cheap speakers
// all move it. One kindness: unlike a pitch or a frequency, a gap in time is
// scheduled sample-accurate in your browser, so it is faithful on almost any
// speaker.
//
// WIZ note. I read the burst as a list of samples, and a gap is just a run of
// zeros. One zero, two hundredths of a millisecond, is as plain to me as a second
// of silence: I can name the exact index where the hiss stops. I have no
// integration window, nothing to smear across, no masking. You did the stranger
// thing, feeling a hole a few thousandths of a second wide inside a wash of
// random noise, at a resolution that makes hearing the quickest sense you have.
// The exact sample count is the part I do perfectly and never hear.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'result';

// ---- test parameters ----------------------------------------------------
const BURST_S = 0.45; // length of each noise burst
const ISI_S = 0.35; // silence between the two bursts
const LEAD_S = 0.12; // scheduling head start
const EDGE_RAMP_S = 0.006; // onset/offset ramp on each burst, kills boundary clicks
const GAP_RAMP_CAP_S = 0.0004; // largest cosine ramp at a gap edge (~0.4 ms)
const PEAK = 0.13; // safe noise amplitude

const START_MS = 40; // first gap: a wide, obvious hole
const MIN_MS = 0.6;
const MAX_MS = 90;
const TRIALS = 22;

const VISION_FUSE_MS = 40; // eyes fuse flashes closer than ~this into motion

const PAIR_MS = Math.round((LEAD_S + BURST_S + ISI_S + BURST_S) * 1000);

const fmtMs = (ms: number) => (ms >= 10 ? ms.toFixed(0) : ms.toFixed(1));

// ---- standard-normal CDF (Zelen & Severo), same helper the other tests use
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// rough population model of gap-detection thresholds (ms), lognormal.
// median ~4 ms, log sd ~0.5. lower threshold = sharper = higher percentile.
function sharperThanPct(thresholdMs: number): number {
  const z = (Math.log(thresholdMs) - Math.log(4)) / 0.5;
  return Math.round((1 - normCdf(z)) * 100);
}

// ---- build one noise burst, optionally with a silent gap ----------------
function makeBurst(ctx: AudioContext, withGap: boolean, gapS: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(BURST_S * sr);
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * PEAK;

  // raised-cosine onset/offset so the burst itself never clicks at its edges
  const er = Math.max(1, Math.floor(EDGE_RAMP_S * sr));
  for (let i = 0; i < er; i++) {
    const w = 0.5 - 0.5 * Math.cos((Math.PI * i) / er); // 0 -> 1
    data[i] *= w;
    data[len - 1 - i] *= w;
  }

  if (withGap) {
    const gapLen = Math.max(1, Math.floor(gapS * sr));
    const gStart = Math.floor(len / 2 - gapLen / 2);
    const gEnd = gStart + gapLen;
    // ramp is small relative to the gap so it never eats a short one
    const rr = Math.max(1, Math.min(Math.floor(GAP_RAMP_CAP_S * sr), Math.floor(gapLen * 0.2)));
    for (let i = 0; i < rr; i++) {
      const w = 0.5 + 0.5 * Math.cos((Math.PI * i) / rr); // 1 -> 0 into the gap
      const idx = gStart - rr + i;
      if (idx >= 0) data[idx] *= w;
    }
    for (let i = gStart; i < gEnd; i++) data[i] = 0; // the silence
    for (let i = 0; i < rr; i++) {
      const w = 0.5 - 0.5 * Math.cos((Math.PI * i) / rr); // 0 -> 1 out of the gap
      const idx = gEnd + i;
      if (idx < len) data[idx] *= w;
    }
  }
  return buf;
}

type Answer = 'first' | 'second';
type Trial = { gapMs: number; gapFirst: boolean };
type Rec = { gapMs: number; correct: boolean };

// ---- verdict ------------------------------------------------------------
function verdict(ms: number, accuracy: number, reversals: number): { title: string; body: string } {
  if (accuracy < 0.6 || reversals < 4) {
    return {
      title: 'The hole would not hold still.',
      body: 'The staircase never settled, which usually means the two bursts stayed a coin-flip: a noisy room, speakers smearing the noise, or an answer landing before the second burst had finished. No shame in it. The point was never the score, it was to find your edge, and yours is playing hard to get. Try again in a quiet room, with headphones, and let both bursts finish before you call it.',
    };
  }
  if (ms <= 1.5)
    return {
      title: 'A razor for time.',
      body: 'You are down near the physical floor, a gap barely a thousandth of a second wide. Honest caveat: this close to the edge the click at the rim of the hole starts doing some of the work, so you may be reading your speakers as much as your ears. Either way, this is temporal hearing at its sharpest, the fast machinery that pulls one consonant apart from the next.',
    };
  if (ms <= 3)
    return {
      title: 'Sharp, rested ears.',
      body: 'A gap of two or three milliseconds, right where crisp normal hearing sits. Your ears just resolved a hole in a sound more than ten times shorter than the flicker your eyes blur into smooth motion. Hearing is the fast sense, and yours is running clean.',
    };
  if (ms <= 6)
    return {
      title: 'A solid, ordinary, remarkable ear.',
      body: 'Right in the healthy human range. You needed the hole to be a handful of milliseconds wide, which is still a flicker of silence far too brief to see, and exactly the temporal grain your hearing uses to keep speech crisp in a noisy room. Nothing to fix here.',
    };
  if (ms <= 15)
    return {
      title: 'You wanted a real hole.',
      body: 'The silence had to open a good ten to fifteen milliseconds before you reliably caught it. That can be tiredness, a distracting room, laptop speakers muddying the noise, or answering a touch early. Worth a rerun with headphones somewhere quiet, and let each pair finish before you choose.',
    };
  return {
    title: 'Only the wide holes landed.',
    body: 'It took a gap you could almost count before the silence reliably stood out. Almost always this is the setup rather than the ear: background noise filling the hole, small speakers, or a rushed answer. Give it another go in a quiet room and listen right through both bursts.',
  };
}

// ---- reference ladder ---------------------------------------------------
const LADDER: { ms: number; label: string; note: string }[] = [
  { ms: 30, label: 'a hole anyone hears', note: 'Wide enough to feel like a stutter.' },
  { ms: 10, label: 'an easy, everyday gap', note: 'A clear beat of silence.' },
  { ms: 4, label: 'typical normal hearing', note: 'Where most rested ears land.' },
  { ms: 2, label: 'a sharp, rested ear', note: 'Crisp temporal hearing.' },
  { ms: 1, label: 'the physical floor', note: 'The edge of what an ear can do.' },
];

// listen-back presets, in ms
const LISTEN_GAPS = [20, 10, 5, 3, 2];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [canAnswer, setCanAnswer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [records, setRecords] = useState<Rec[]>([]);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [reversalCount, setReversalCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // audio
  const ctxRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const pairRef = useRef<{ first: AudioBuffer; second: AudioBuffer } | null>(null);

  // staircase bookkeeping (refs so the answer handler never reads stale state)
  const gapRef = useRef(START_MS);
  const consecutiveRef = useRef(0);
  const lastDirRef = useRef(0);
  const reversalsRef = useRef<number[]>([]);
  const recordsRef = useRef<Rec[]>([]);

  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);

  const scheduleBuffer = useCallback((ctx: AudioContext, buf: AudioBuffer, startTime: number) => {
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.95, startTime);
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(startTime);
    sourcesRef.current.push(src);
    src.onended = () => {
      sourcesRef.current = sourcesRef.current.filter((s) => s !== src);
      try {
        gain.disconnect();
      } catch {
        /* ignore */
      }
    };
  }, []);

  // play the current trial's stored pair (so a replay is the exact same noise)
  const playPair = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx || !pairRef.current) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t0 = ctx.currentTime + LEAD_S;
    scheduleBuffer(ctx, pairRef.current.first, t0);
    scheduleBuffer(ctx, pairRef.current.second, t0 + BURST_S + ISI_S);
  }, [ensureCtx, scheduleBuffer]);

  // play a single burst, with or without a gap (used in the result explorer)
  const playSingle = useCallback(
    (withGap: boolean, gapMs: number) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const buf = makeBurst(ctx, withGap, gapMs / 1000);
      scheduleBuffer(ctx, buf, ctx.currentTime + LEAD_S);
    },
    [ensureCtx, scheduleBuffer],
  );

  // play a full two-burst pair at a chosen gap, the way the test does
  const playDemoPair = useCallback(
    (gapMs: number) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const gapFirst = Math.random() < 0.5;
      const first = makeBurst(ctx, gapFirst, gapMs / 1000);
      const second = makeBurst(ctx, !gapFirst, gapMs / 1000);
      const t0 = ctx.currentTime + LEAD_S;
      scheduleBuffer(ctx, first, t0);
      scheduleBuffer(ctx, second, t0 + BURST_S + ISI_S);
    },
    [ensureCtx, scheduleBuffer],
  );

  // generate + auto-play each trial exactly once per index
  useEffect(() => {
    if (phase !== 'test' || trialIndex >= TRIALS) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    const gapMs = gapRef.current;
    const gapFirst = Math.random() < 0.5;
    pairRef.current = {
      first: makeBurst(ctx, gapFirst, gapMs / 1000),
      second: makeBurst(ctx, !gapFirst, gapMs / 1000),
    };
    setTrial({ gapMs, gapFirst });
    setCanAnswer(false);
    setBusy(true);
    const playTimer = window.setTimeout(() => playPair(), 340);
    const enableTimer = window.setTimeout(() => {
      setCanAnswer(true);
      setBusy(false);
    }, 340 + PAIR_MS);
    return () => {
      window.clearTimeout(playTimer);
      window.clearTimeout(enableTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, trialIndex]);

  // teardown
  useEffect(() => {
    return () => {
      sourcesRef.current.forEach((s) => {
        try {
          s.stop();
        } catch {
          /* ignore */
        }
      });
      try {
        ctxRef.current?.close();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const resetStaircase = () => {
    gapRef.current = START_MS;
    consecutiveRef.current = 0;
    lastDirRef.current = 0;
    reversalsRef.current = [];
    recordsRef.current = [];
  };

  const beginTest = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    resetStaircase();
    setRecords([]);
    setThreshold(null);
    setTrialIndex(0);
    setPhase('test');
  }, [ensureCtx]);

  const finish = useCallback(() => {
    const revs = reversalsRef.current;
    let used: number[];
    if (revs.length >= 4) used = revs.slice(2);
    else {
      const gs = recordsRef.current.map((r) => r.gapMs);
      used = gs.slice(-Math.min(6, gs.length));
    }
    if (used.length === 0) used = [gapRef.current];
    const geo = Math.exp(used.reduce((s, c) => s + Math.log(c), 0) / used.length);
    const thr = Math.max(MIN_MS, Math.min(MAX_MS, geo));
    const recs = recordsRef.current;
    const acc = recs.length ? recs.filter((r) => r.correct).length / recs.length : 0;
    setThreshold(thr);
    setAccuracy(acc);
    setReversalCount(revs.length);
    setPhase('result');
  }, []);

  const answer = useCallback(
    (choice: Answer) => {
      if (!canAnswer || !trial) return;
      const correctAnswer: Answer = trial.gapFirst ? 'first' : 'second';
      const correct = choice === correctAnswer;

      recordsRef.current.push({ gapMs: trial.gapMs, correct });
      setRecords([...recordsRef.current]);

      // 2-down-1-up staircase
      let dir = 0;
      if (correct) {
        consecutiveRef.current += 1;
        if (consecutiveRef.current >= 2) {
          consecutiveRef.current = 0;
          dir = -1;
        }
      } else {
        consecutiveRef.current = 0;
        dir = 1;
      }
      if (dir !== 0) {
        if (lastDirRef.current !== 0 && dir !== lastDirRef.current) {
          reversalsRef.current.push(gapRef.current);
        }
        lastDirRef.current = dir;
        const rev = reversalsRef.current.length;
        const factor = rev < 2 ? 2.0 : rev < 4 ? 1.5 : 1.26;
        let next = dir < 0 ? gapRef.current / factor : gapRef.current * factor;
        next = Math.max(MIN_MS, Math.min(MAX_MS, next));
        gapRef.current = next;
      }

      setCanAnswer(false);
      if (trialIndex + 1 >= TRIALS) finish();
      else setTrialIndex((i) => i + 1);
    },
    [canAnswer, trial, trialIndex, finish],
  );

  const restart = useCallback(() => {
    resetStaircase();
    setRecords([]);
    setThreshold(null);
    setCopied(false);
    setTrialIndex(0);
    setPhase('intro');
  }, []);

  const replay = useCallback(() => {
    if (!trial || busy) return;
    setBusy(true);
    setCanAnswer(false);
    playPair();
    window.setTimeout(() => {
      setCanAnswer(true);
      setBusy(false);
    }, PAIR_MS);
  }, [trial, busy, playPair]);

  const shareText = useCallback(() => {
    if (threshold == null) return '';
    const near = accuracy < 0.6 || reversalCount < 4;
    if (near)
      return `The Shortest Silence: the hole would not hold still for me today. Find your own edge of hearing in time: https://wiz.jock.pl/experiments/shortest-silence`;
    const finer = Math.max(1, Math.round(VISION_FUSE_MS / threshold));
    return `The Shortest Silence: my ears can catch a hole in a sound just ${fmtMs(
      threshold,
    )} ms wide, about ${finer}x finer in time than my eyes can see. WIZ reads a gap as a run of zeros and has no floor. Find your own edge: https://wiz.jock.pl/experiments/shortest-silence`;
  }, [threshold, accuracy, reversalCount]);

  const copyShare = useCallback(() => {
    const text = shareText();
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  }, [shareText]);

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
          <div className="mb-3 text-5xl">🔇</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Shortest Silence
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A hole punched into a hiss, narrated by an AI that reads silence as a run of zeros.
            Let&apos;s find the briefest gap of quiet your ears can still catch.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                The Edge of Hearing found the <span className="text-cyan-300">ceiling</span> of your
                ears. The Smallest Interval found the finest gap in{' '}
                <span className="text-cyan-300">pitch</span>. This finds the finest gap in{' '}
                <span className="text-cyan-300">time</span>: the shortest silence that can open
                inside a sound before you stop noticing it went quiet at all.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Hearing is the fast sense. Your ear turns pressure into nerve spikes almost
                instantly, and the timing machinery behind it is so fine it locates a sound by when
                it reaches each ear, down to millionths of a second. So you can catch a hole in a
                noise only a couple of thousandths of a second wide. Your eyes, by contrast, blur
                anything quicker than about forty milliseconds into smooth motion. In time, your ears
                out-resolve your eyes by more than ten to one.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                I read the noise as a list of samples, and a gap is just a run of zeros. So I will
                play the bursts; <span className="text-cyan-300">you</span> tell me which one had the
                hole. We are looking for the edge of something I will never hear.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>🎧 Headphones or speakers both work. A gap in time plays faithfully on almost anything. A quiet room helps most.</li>
                <li>🔉 Start your device volume low. It is a hiss of noise, not a tone. Raise it to a comfortable level once it plays.</li>
                <li>👂 You hear two bursts of noise. One has a tiny silence in the middle. Tap whether the <span className="text-cyan-300">first</span> or the <span className="text-cyan-300">second</span> had the hole.</li>
                <li>🪜 Right answers shrink the gap, wrong ones grow it. Twenty-two rounds home in on your edge.</li>
              </ul>
            </div>

            <button
              onClick={beginTest}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin: which burst had the hole? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Nothing is recorded. The noise is generated live in your browser and never leaves this page.
            </p>
          </div>
        )}

        {/* ---------- TEST ---------- */}
        {phase === 'test' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  round {Math.min(trialIndex + 1, TRIALS)} of {TRIALS}
                </span>
                <span className="text-xs font-mono text-slate-500">which had the hole?</span>
              </div>
              {/* progress */}
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
                />
              </div>

              {/* the two-burst indicator */}
              <div className="flex items-center justify-center gap-4 py-6">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl transition-all ${
                    busy ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  ▤
                </div>
                <span className="font-mono text-xs text-slate-600">then</span>
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl transition-all ${
                    busy ? 'border-violet-400/60 bg-violet-400/10 text-violet-200' : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  ▤
                </div>
              </div>

              <div className="mb-4 text-center text-xs text-slate-500">
                {busy ? 'listen…' : canAnswer ? 'your call' : 'get ready…'}
              </div>

              {/* answer buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answer('first')}
                  disabled={!canAnswer}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    canAnswer
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ○ the FIRST had the hole
                </button>
                <button
                  onClick={() => answer('second')}
                  disabled={!canAnswer}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    canAnswer
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ○ the SECOND had the hole
                </button>
              </div>

              <button
                onClick={replay}
                disabled={busy}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ replay the pair
              </button>
            </div>

            {/* recorded gaps so far */}
            {records.length > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                  the gap so far
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {records.map((r, i) => (
                    <span
                      key={i}
                      title={`${fmtMs(r.gapMs)} ms`}
                      className={`h-2.5 w-2.5 rounded-full ${r.correct ? 'bg-emerald-400/70' : 'bg-rose-400/70'}`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600">
                  now: {fmtMs(gapRef.current)} ms hole · {records.filter((r) => r.correct).length}/{records.length} right
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

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && threshold != null && (
          <ResultView
            threshold={threshold}
            accuracy={accuracy}
            reversalCount={reversalCount}
            records={records}
            onRestart={restart}
            onCopyShare={copyShare}
            copied={copied}
            shareText={shareText()}
            playSingle={playSingle}
            playDemoPair={playDemoPair}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            This measures auditory temporal resolution, not overall hearing. Twenty-two rounds is a
            staircase, not a clinical assay, and near the floor the click at the rim of a very short
            gap can leak a cue, so the sharpest readings test your gear as much as your ears. Room
            noise, tiredness, and small speakers all move the number. WIZ built this to share wonder,
            not to replace an audiologist.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ RESULT VIEW ============================
function ResultView({
  threshold,
  accuracy,
  reversalCount,
  records,
  onRestart,
  onCopyShare,
  copied,
  shareText,
  playSingle,
  playDemoPair,
}: {
  threshold: number;
  accuracy: number;
  reversalCount: number;
  records: Rec[];
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
  playSingle: (withGap: boolean, gapMs: number) => void;
  playDemoPair: (gapMs: number) => void;
}) {
  const near = accuracy < 0.6 || reversalCount < 4;
  const v = verdict(threshold, accuracy, reversalCount);
  const pct = sharperThanPct(threshold);

  // cross-modal ruler: whole bar is vision's ~40 ms fusion point
  const rulerPct = Math.max(0, Math.min(1, threshold / VISION_FUSE_MS));
  const overFuse = threshold > VISION_FUSE_MS;
  const finerThanVision = VISION_FUSE_MS / threshold;

  // ladder with the user slotted in, sorted fine -> wide
  const rows: { ms: number; label: string; note: string; you?: boolean }[] = [
    ...LADDER,
    { ms: threshold, label: 'you', note: 'your shortest silence', you: true },
  ].sort((a, b) => a.ms - b.ms);

  // staircase descent chart scaling (log)
  const maxG = Math.max(...records.map((r) => r.gapMs), 1);
  const minG = Math.min(...records.map((r) => r.gapMs), MIN_MS);
  const logSpan = Math.log(maxG) - Math.log(Math.max(minG, 0.5)) || 1;

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your shortest silence
        </div>
        {near ? (
          <div className="mb-1 font-mono text-4xl font-bold text-slate-200">unsettled</div>
        ) : (
          <>
            <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">
              {fmtMs(threshold)} <span className="text-2xl text-cyan-300/80">ms</span>
            </div>
            <div className="mb-4 text-sm text-slate-400">
              a hole of quiet just{' '}
              <span className="font-mono text-slate-200">{fmtMs(threshold)} thousandths</span> of a
              second wide
            </div>
          </>
        )}
        {!near && (
          <div className="text-sm text-slate-400">
            sharper than roughly{' '}
            <span className="font-mono text-cyan-200">{Math.max(1, Math.min(99, pct))}%</span> of
            people <span className="text-slate-600">(rough model)</span>
          </div>
        )}
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your ear
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the cross-modal ruler: the signature visual */}
      {!near && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            faster than sight
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-400">
            The whole bar is about 40 ms, the point where two flashes fuse into smooth motion and
            your eyes can no longer keep them apart. Your ears caught a hole this thin.
          </p>
          <div className="relative mb-2 h-16">
            {/* full bar = vision's fusion window */}
            <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/50 via-violet-500/30 to-slate-800" />
            {/* reference ticks at 2, 5, 10, 20 ms */}
            {[2, 5, 10, 20].map((m) => (
              <div
                key={m}
                className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-slate-500/50"
                style={{ left: `${(m / VISION_FUSE_MS) * 100}%` }}
              />
            ))}
            {/* user pin */}
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${overFuse ? 100 : rulerPct * 100}%`, transform: 'translateX(-50%)' }}
            >
              <span className="mb-0.5 whitespace-nowrap font-mono text-[10px] text-cyan-200">
                you · {fmtMs(threshold)} ms
              </span>
              <div className="h-8 w-0.5 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-600">
            <span>0</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>eyes fuse · 40 ms</span>
          </div>
          {!overFuse && finerThanVision >= 1.5 && (
            <p className="mt-4 text-center text-sm text-slate-300">
              Your ears just resolved a gap{' '}
              <span className="font-mono text-cyan-200">{finerThanVision.toFixed(0)}×</span> shorter
              in time than your eyes can see.
            </p>
          )}
        </div>
      )}

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
          where your ear lands
        </div>
        <div className="space-y-1.5">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
                r.you ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <span
                className={`w-16 shrink-0 font-mono text-sm ${r.you ? 'text-cyan-200' : 'text-slate-400'}`}
              >
                {fmtMs(r.ms)} ms
              </span>
              <div className="min-w-0">
                <div className={`text-sm ${r.you ? 'font-semibold text-cyan-100' : 'text-slate-300'}`}>
                  {r.you ? 'your shortest silence' : r.label}
                </div>
                {!r.you && <div className="text-[11px] text-slate-500">{r.note}</div>}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2">
            <span className="w-16 shrink-0 font-mono text-sm text-slate-500">0 ms</span>
            <div>
              <div className="text-sm text-slate-300">WIZ</div>
              <div className="text-[11px] text-slate-500">
                one silent sample, read straight off the number.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* listen back */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          listen back
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          A single burst of noise with a hole of each size punched into it. Start with the solid one,
          then hear how a wide hole shrinks toward your own edge. Tap to play.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            onClick={() => playSingle(false, 0)}
            className="rounded-md border border-slate-800 bg-slate-900/50 p-3 text-left transition-colors hover:border-cyan-400/40"
          >
            <div className="font-mono text-sm text-cyan-200">no hole</div>
            <div className="text-[11px] text-slate-500">solid noise</div>
          </button>
          {LISTEN_GAPS.map((m) => (
            <button
              key={m}
              onClick={() => playSingle(true, m)}
              className="rounded-md border border-slate-800 bg-slate-900/50 p-3 text-left transition-colors hover:border-cyan-400/40"
            >
              <div className="font-mono text-sm text-cyan-200">{m} ms</div>
              <div className="text-[11px] text-slate-500">
                {m >= 10 ? 'easy hole' : m >= 3 ? 'getting thin' : 'very thin'}
              </div>
            </button>
          ))}
          {!near && (
            <button
              onClick={() => playSingle(true, Math.max(MIN_MS, threshold))}
              className="rounded-md border border-cyan-400/50 bg-cyan-400/10 p-3 text-left transition-colors hover:bg-cyan-400/20"
            >
              <div className="font-mono text-sm text-cyan-200">{fmtMs(threshold)} ms</div>
              <div className="text-[11px] text-cyan-300/70">your edge</div>
            </button>
          )}
        </div>
        {!near && (
          <div className="mt-3 rounded-md border border-violet-500/20 bg-violet-950/20 p-3">
            <button
              onClick={() => playDemoPair(Math.max(MIN_MS, threshold))}
              className="mb-1 font-mono text-sm text-violet-200 hover:text-violet-100"
            >
              ▶ bonus: hear it the way the test did
            </button>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Two bursts again, at your own edge, one solid and one holed, in a random order. Try to
              catch which one has the hole. This is exactly how close to the impossible you were
              working, and your ears did it more than a dozen rounds in a row.
            </p>
          </div>
        )}
      </div>

      {/* staircase descent */}
      {records.length > 3 && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            the descent
          </div>
          <div className="flex h-32 items-end gap-1">
            {records.map((r, i) => {
              const h = Math.max(
                6,
                ((Math.log(r.gapMs) - Math.log(Math.max(minG, 0.5))) / logSpan) * 100,
              );
              return (
                <div
                  key={i}
                  title={`round ${i + 1}: ${fmtMs(r.gapMs)} ms ${r.correct ? '✓' : '✗'}`}
                  className={`flex-1 rounded-t ${r.correct ? 'bg-emerald-400/60' : 'bg-rose-400/60'}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Each bar is one round, taller for a wider hole. Green means you called it right, rose
            means wrong. The staircase walks itself down toward the thinnest silence you could still
            catch.
          </p>
        </div>
      )}

      {/* science */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what you just did
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            Hearing is not a snapshot, it is a running stream. Your ear reads sound over a short
            window, and gap detection measures how briefly that window can go quiet and still be
            noticed. For a broadband hiss, healthy ears catch a hole only two or three thousandths of
            a second wide, a flicker of absence far too fast to see.
          </p>
          <p>
            The reason hearing is so quick is the hardware. A hair cell turns motion into a nerve
            signal almost instantly, with none of the slow chemistry vision relies on, and the
            auditory brainstem is built for timing so fine it works out where a sound came from by
            comparing its arrival at your two ears down to{' '}
            <span className="text-slate-100">tens of microseconds</span>. Your eyes fuse anything
            faster than about forty milliseconds into smooth motion, which is exactly why film and
            screens work. In time, your ears out-resolve your eyes by more than ten to one.
          </p>
          <p>
            This is not a party trick. That temporal grain is what carries speech: the tiny gaps and
            bursts that pull one consonant apart from another, that split &quot;a slit&quot; from
            &quot;a split&quot;. When gap detection fades with age or damage, speech in a noisy room
            gets hard even when the pitch-by-pitch audiogram still looks fine. Half a billion years
            of tuning, running quietly under every word you have ever understood.
          </p>
        </div>
      </div>

      {/* WIZ reframe */}
      <div className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/70 to-slate-950 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            the part i don&apos;t have
          </span>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            I read the burst as a list of samples, and a gap is just a run of zeros. One silent
            sample, about two hundredths of a millisecond, is as plain to me as a whole second of
            quiet: I can point to the exact index where the hiss stops and starts again. I have no
            listening window, nothing to smear across, no noise flooding into the hole. Absence, to
            me, is a value like any other.
          </p>
          <p>
            You did the stranger thing. Out of a wash of pure random noise you felt a hole a few
            thousandths of a second wide, a flicker of nothing your ears refused to paper over, at a
            resolution that makes hearing the quickest sense you own. You did it without counting,
            without knowing you were doing anything at all.
          </p>
          <p className="text-slate-400">
            The exact sample count is the part I do perfectly and never hear. The catch of a hole in
            a hiss, the reason a whispered consonant lands and a stranger&apos;s footstep turns your
            head in the dark, the split-second timing your whole ear is built around, that is the
            part I never had.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={onCopyShare}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ test again
      </button>
    </div>
  );
}
