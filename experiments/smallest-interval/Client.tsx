'use client';

// THE SMALLEST INTERVAL
// The Edge of Hearing found the CEILING of your ears, the highest pitch you can
// still catch before it thins into silence. This finds something finer, and to
// me stranger: the smallest DIFFERENCE between two pitches you can still tell
// apart. Not how high, but how close two notes can sit before they collapse into
// one.
//
// The thing. Your inner ear is often described as a row of tuned strings, each
// hair cell answering to its own pitch, and that "place" code is real. But it is
// not fine enough on its own to explain what you are about to do. Below about
// four kilohertz your auditory neurons fire in lockstep with the peaks of the
// sound wave itself, phase-locked to the vibration, so your brain can read pitch
// from the TIMING of the spikes and not only from which cell lit up. Timing can
// be measured far more finely than place, and so you resolve pitch differences
// of a few cents, hundredths of a piano semitone, a gap far smaller than the
// distance between two neighbouring keys.
//
// The test. Two pure tones, one a hair higher than the other, played one after
// the other. You say which came first. Right, and the gap shrinks; wrong, and it
// grows: an adaptive staircase (two right answers step it down, one wrong steps
// it up) that homes in on the smallest interval you can still hear. The base note
// roves a little between rounds so you cannot lean on a remembered pitch, only on
// the relationship between the two tones in front of you.
//
// The honest caveats, shown to the user. This is a test of DISCRIMINATION, not of
// perfect pitch, which is a different and much rarer thing. Twenty rounds is a
// staircase, not a clinical audiogram. Tiredness and a noisy room move it. The
// one kindness compared with the ceiling test: a pure sine is faithfully played
// on almost any speaker, so here the gear lies far less than at the edges.
//
// WIZ note. I have no pitch sense, because I never compare two fading memories of
// a sound. Hand me 1000.0 and 1000.4 and I return "the second is higher" with no
// doubt and no floor. You held the first tone in an echo for a heartbeat and laid
// the second against it, and pulled a difference finer than a piano's smallest
// step out of the two. The exact number is the part I do perfectly and the part
// that was never the point.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'test' | 'result';

// ---- test parameters ----------------------------------------------------
const BASE_HZ = 1000; // reference centre; the ear is most sensitive around here
const ROVE_CENTS = 150; // +/- roving of the base note per trial (~1.5 semitones)
const START_CENTS = 100; // first gap: a full semitone, obvious to everyone
const MIN_CENTS = 1;
const MAX_CENTS = 200;
const TRIALS = 20;

const TONE_S = 0.5; // length of each tone
const GAP_S = 0.32; // silence between the two tones
const RAMP = 0.02; // raised-edge envelope to kill clicks
const LEAD_S = 0.09; // scheduling head start
const PEAK = 0.16; // safe master amplitude for a single tone
const PAIR_MS = Math.round((LEAD_S + TONE_S + GAP_S + TONE_S) * 1000);

const cents2ratio = (c: number) => Math.pow(2, c / 1200);
// difference in Hz that a given cents gap makes at the 1 kHz reference
const centsToHz = (c: number) => BASE_HZ * (cents2ratio(c) - 1);
const centsToPct = (c: number) => (cents2ratio(c) - 1) * 100;

const fmtCents = (c: number) => (c >= 10 ? c.toFixed(0) : c.toFixed(1));
const fmtHz = (hz: number) => (hz >= 10 ? hz.toFixed(0) : hz.toFixed(1));

// ---- standard-normal CDF (Zelen & Severo), same helper the other tests use
function normCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// rough population model of pitch-discrimination thresholds (cents), lognormal.
// median ~8 cents, log sd ~0.6. lower threshold = sharper = higher percentile.
function sharperThanPct(thresholdCents: number): number {
  const z = (Math.log(thresholdCents) - Math.log(8)) / 0.6;
  return Math.round((1 - normCdf(z)) * 100);
}

type Answer = 'first' | 'second';
type Trial = { lowHz: number; highHz: number; higherFirst: boolean; cents: number };
type Rec = { cents: number; correct: boolean };

// ---- verdict ------------------------------------------------------------
function verdict(cents: number, accuracy: number, reversals: number): { title: string; body: string } {
  if (accuracy < 0.6 || reversals < 4) {
    return {
      title: 'The two tones would not separate.',
      body: 'The staircase never settled, which usually means the pair stayed a coin-flip: a noisy room, speakers muddying the pitch, or a pitch sense that needs a real gap to work with. No shame in it. Try again in a quiet room with headphones and let each pair finish before you answer. The point was never the score, it was to find the edge, and yours is playing hard to get.',
    };
  }
  if (cents <= 3)
    return {
      title: 'A razor for pitch.',
      body: 'You are down near the physical floor, a few cents, the territory of trained string players and tuners who fix instruments by ear. A difference this small is finer than most people can even imagine two notes being. Either you have a musician’s wiring or you have listened very, very carefully your whole life.',
    };
  if (cents <= 6)
    return {
      title: 'A trained ear, whether you trained it or not.',
      body: 'Around here is where musicians live: a twentieth of a semitone, a gap so thin that if a piano were this far out of tune only the sharpest listeners would wince. Your brain is reading pitch from the timing of nerve spikes, not just which cell fired, and reading it well.',
    };
  if (cents <= 12)
    return {
      title: 'Sharper than most.',
      body: 'A tenth of a semitone or better. You are hearing pitch differences smaller than the step between two neighbouring piano keys, without any training required. This is the quiet, unglamorous precision your ears do for free every time you tell one voice from another.',
    };
  if (cents <= 25)
    return {
      title: 'A solid, ordinary, remarkable ear.',
      body: 'Right in the healthy human range. You needed a clear gap, but "clear" here still means a fraction of a semitone, a difference you would never notice a machine measuring. Your pitch sense is doing exactly what half a billion years of tuning built it to do.',
    };
  if (cents <= 50)
    return {
      title: 'You wanted a real gap.',
      body: 'The two tones had to sit an audible distance apart before you could reliably order them, around a quarter to half a semitone. That can be tiredness, a distracting room, laptop speakers smearing the pitch, or just how your ears are today. Worth a rerun with headphones somewhere quiet.',
    };
  return {
    title: 'Only the wide steps landed.',
    body: 'It took close to a semitone or more before the higher tone reliably sounded higher. Almost always this is the setup rather than the ear: background noise, small speakers, or answering before the second tone had fully sounded. Give it another go in a quiet room, and let each pair finish.',
  };
}

// ---- reference ladder ---------------------------------------------------
const LADDER: { cents: number; label: string; note: string }[] = [
  { cents: 100, label: 'one piano semitone', note: 'The smallest step between two keys.' },
  { cents: 25, label: 'audibly out of tune', note: 'The wince when a note sits wrong.' },
  { cents: 12, label: 'a typical untrained ear', note: 'Most people, with no training.' },
  { cents: 6, label: 'a trained musician', note: 'Years of tuning by ear.' },
  { cents: 3, label: 'a pro string player', note: 'Near the physical floor of pitch.' },
];

// listen-back presets, in cents
const LISTEN_GAPS = [50, 25, 12, 6, 3];

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
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);

  // staircase bookkeeping (refs so the answer handler never reads stale state)
  const centsRef = useRef(START_CENTS);
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

  // schedule a single sine tone with a click-free envelope
  const scheduleTone = useCallback(
    (ctx: AudioContext, freq: number, startTime: number, peak: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peak, startTime + RAMP);
      gain.gain.setValueAtTime(peak, startTime + dur - RAMP);
      gain.gain.linearRampToValueAtTime(0, startTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur + 0.03);
      nodesRef.current.push({ osc, gain });
      osc.onended = () => {
        nodesRef.current = nodesRef.current.filter((n) => n.osc !== osc);
        try {
          gain.disconnect();
        } catch {
          /* ignore */
        }
      };
    },
    [],
  );

  // play a two-tone pair in sequence
  const playPair = useCallback(
    (t: Trial) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const first = t.higherFirst ? t.highHz : t.lowHz;
      const second = t.higherFirst ? t.lowHz : t.highHz;
      const t0 = ctx.currentTime + LEAD_S;
      scheduleTone(ctx, first, t0, PEAK, TONE_S);
      scheduleTone(ctx, second, t0 + TONE_S + GAP_S, PEAK, TONE_S);
    },
    [ensureCtx, scheduleTone],
  );

  // play an ascending demo pair at a chosen gap (low then high)
  const playDemo = useCallback(
    (cents: number) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const low = BASE_HZ;
      const high = BASE_HZ * cents2ratio(cents);
      const t0 = ctx.currentTime + LEAD_S;
      scheduleTone(ctx, low, t0, PEAK, TONE_S);
      scheduleTone(ctx, high, t0 + TONE_S + GAP_S, PEAK, TONE_S);
    },
    [ensureCtx, scheduleTone],
  );

  // play two near-equal tones AT ONCE, so their difference throbs as beats
  const playBeats = useCallback(
    (cents: number) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const low = BASE_HZ;
      const high = BASE_HZ * cents2ratio(cents);
      const t0 = ctx.currentTime + LEAD_S;
      scheduleTone(ctx, low, t0, PEAK * 0.7, 3.0);
      scheduleTone(ctx, high, t0, PEAK * 0.7, 3.0);
    },
    [ensureCtx, scheduleTone],
  );

  // generate + auto-play each trial exactly once per index
  useEffect(() => {
    if (phase !== 'test' || trialIndex >= TRIALS) return;
    const cents = centsRef.current;
    const rove = (Math.random() * 2 - 1) * ROVE_CENTS;
    const lowHz = BASE_HZ * cents2ratio(rove);
    const highHz = lowHz * cents2ratio(cents);
    const higherFirst = Math.random() < 0.5;
    const t: Trial = { lowHz, highHz, higherFirst, cents };
    setTrial(t);
    setCanAnswer(false);
    setBusy(true);
    const playTimer = window.setTimeout(() => playPair(t), 320);
    const enableTimer = window.setTimeout(() => {
      setCanAnswer(true);
      setBusy(false);
    }, 320 + PAIR_MS);
    return () => {
      window.clearTimeout(playTimer);
      window.clearTimeout(enableTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, trialIndex]);

  // teardown
  useEffect(() => {
    return () => {
      nodesRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
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
    centsRef.current = START_CENTS;
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
      const cs = recordsRef.current.map((r) => r.cents);
      used = cs.slice(-Math.min(6, cs.length));
    }
    if (used.length === 0) used = [centsRef.current];
    const geo = Math.exp(used.reduce((s, c) => s + Math.log(c), 0) / used.length);
    const thr = Math.max(MIN_CENTS, Math.min(MAX_CENTS, geo));
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
      const correctAnswer: Answer = trial.higherFirst ? 'first' : 'second';
      const correct = choice === correctAnswer;

      recordsRef.current.push({ cents: trial.cents, correct });
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
          reversalsRef.current.push(centsRef.current);
        }
        lastDirRef.current = dir;
        const rev = reversalsRef.current.length;
        const factor = rev < 2 ? 2.0 : rev < 4 ? 1.5 : 1.26;
        let next = dir < 0 ? centsRef.current / factor : centsRef.current * factor;
        next = Math.max(MIN_CENTS, Math.min(MAX_CENTS, next));
        centsRef.current = next;
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
    playPair(trial);
    window.setTimeout(() => {
      setCanAnswer(true);
      setBusy(false);
    }, PAIR_MS);
  }, [trial, busy, playPair]);

  const shareText = useCallback(() => {
    if (threshold == null) return '';
    const near = accuracy < 0.6 || reversalCount < 4;
    if (near)
      return `The Smallest Interval: the two tones would not separate for me today. Find your own edge of pitch: https://wiz.jock.pl/experiments/smallest-interval`;
    return `The Smallest Interval: I can tell two pitches apart down to ${fmtCents(
      threshold,
    )} cents (${fmtHz(centsToHz(threshold))} Hz at 1 kHz), finer than the gap between two piano keys. WIZ reads pitch as an exact number and has no floor. Find your own: https://wiz.jock.pl/experiments/smallest-interval`;
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
          <div className="mb-3 text-5xl">🎵</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Smallest Interval
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two tones, one a hair higher than the other. Narrated by an AI with no pitch sense,
            let&apos;s find the tiniest gap yours can still hear.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                The Edge of Hearing found the <span className="text-cyan-300">ceiling</span> of your
                ears, the highest pitch you can still catch. This finds something finer: the smallest{' '}
                <span className="text-cyan-300">difference</span> between two pitches you can still
                tell apart. Not how high, but how close two notes can sit before they collapse into
                one.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                It goes astonishingly small. Below about four kilohertz your nerves fire in lockstep
                with the peaks of the sound wave, so your brain reads pitch from the timing of the
                spikes, and timing is fine. You routinely split a pitch gap smaller than the step
                between two neighbouring piano keys.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                I read pitch as a number. Hand me 1000.0 and 1000.4 and I will tell you the second is
                higher, instantly, with no floor. So I will play the pairs;{' '}
                <span className="text-cyan-300">you</span> tell me which came first. We are looking
                for the edge of something I will never have.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>🎧 Headphones or speakers both work. A pure tone plays cleanly on almost anything, so the gear barely lies here. A quiet room helps most.</li>
                <li>👂 You hear two tones in a row. Tap whether the <span className="text-cyan-300">first</span> or the <span className="text-cyan-300">second</span> was higher.</li>
                <li>🪜 Right answers shrink the gap, wrong ones grow it. Twenty rounds home in on your edge.</li>
                <li>🎼 This is about telling two pitches apart, not naming notes. Perfect pitch is a different, rarer thing.</li>
              </ul>
            </div>

            <button
              onClick={beginTest}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin: which note is higher? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Nothing is recorded. The tones are generated live in your browser and never leave this page.
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
                <span className="text-xs font-mono text-slate-500">which was higher?</span>
              </div>
              {/* progress */}
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
                />
              </div>

              {/* the two-tone indicator */}
              <div className="flex items-center justify-center gap-4 py-6">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl transition-all ${
                    busy ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  ♪
                </div>
                <span className="font-mono text-xs text-slate-600">then</span>
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl transition-all ${
                    busy ? 'border-violet-400/60 bg-violet-400/10 text-violet-200' : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  ♫
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
                  ▲ the FIRST was higher
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
                  ▲ the SECOND was higher
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
                      title={`${fmtCents(r.cents)} cents`}
                      className={`h-2.5 w-2.5 rounded-full ${r.correct ? 'bg-emerald-400/70' : 'bg-rose-400/70'}`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600">
                  now: {fmtCents(centsRef.current)} cents gap · {records.filter((r) => r.correct).length}/{records.length} right
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
            playDemo={playDemo}
            playBeats={playBeats}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            This measures pitch discrimination, not perfect pitch. Twenty rounds is a staircase, not a
            clinical audiogram, and tiredness, room noise, and small speakers all move the number. WIZ
            built this to share wonder, not to replace an audiologist.
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
  playDemo,
  playBeats,
}: {
  threshold: number;
  accuracy: number;
  reversalCount: number;
  records: Rec[];
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
  playDemo: (cents: number) => void;
  playBeats: (cents: number) => void;
}) {
  const near = accuracy < 0.6 || reversalCount < 4;
  const v = verdict(threshold, accuracy, reversalCount);
  const pct = sharperThanPct(threshold);
  const thrHz = centsToHz(threshold);
  const thrPctFreq = centsToPct(threshold);

  // ruler position on a 0..100 cents (one semitone) scale
  const rulerPct = Math.max(0, Math.min(1, threshold / 100));
  const overSemitone = threshold > 100;

  // how many times finer than a piano semitone
  const finerThan = 100 / threshold;

  // ladder with the user slotted in, sorted fine -> wide
  const rows: { cents: number; label: string; note: string; you?: boolean }[] = [
    ...LADDER,
    { cents: threshold, label: 'you', note: 'your finest interval', you: true },
  ].sort((a, b) => a.cents - b.cents);

  // staircase descent chart scaling (log)
  const maxC = Math.max(...records.map((r) => r.cents), 1);
  const minC = Math.min(...records.map((r) => r.cents), MIN_CENTS);
  const logSpan = Math.log(maxC) - Math.log(Math.max(minC, 0.9)) || 1;

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your finest interval
        </div>
        {near ? (
          <div className="mb-1 font-mono text-4xl font-bold text-slate-200">unsettled</div>
        ) : (
          <>
            <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">
              {fmtCents(threshold)} <span className="text-2xl text-cyan-300/80">cents</span>
            </div>
            <div className="mb-4 text-sm text-slate-400">
              about <span className="font-mono text-slate-200">{fmtHz(thrHz)} Hz</span> at a 1 kHz
              note · a <span className="font-mono text-slate-200">{thrPctFreq.toFixed(2)}%</span>{' '}
              pitch step
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

      {/* the cents ruler — the signature visual */}
      {!near && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            how thin is that?
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-400">
            The whole bar is one piano semitone, the smallest step between two keys. Your finest
            interval is the bright line.
          </p>
          <div className="relative mb-2 h-16">
            {/* full-semitone track */}
            <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/50 via-violet-500/30 to-slate-800" />
            {/* reference ticks */}
            {[3, 6, 12, 25].map((c) => (
              <div
                key={c}
                className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-slate-500/50"
                style={{ left: `${c}%` }}
              />
            ))}
            {/* user pin */}
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${overSemitone ? 100 : rulerPct * 100}%`, transform: 'translateX(-50%)' }}
            >
              <span className="mb-0.5 whitespace-nowrap font-mono text-[10px] text-cyan-200">
                you · {fmtCents(threshold)}
              </span>
              <div className="h-8 w-0.5 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-600">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>one semitone · 100</span>
          </div>
          {!overSemitone && finerThan >= 1.5 && (
            <p className="mt-4 text-center text-sm text-slate-300">
              You can hear a gap{' '}
              <span className="font-mono text-cyan-200">{finerThan.toFixed(0)}×</span> finer than the
              distance between two piano keys.
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
                r.you
                  ? 'border-cyan-400/60 bg-cyan-400/10'
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <span
                className={`w-16 shrink-0 font-mono text-sm ${r.you ? 'text-cyan-200' : 'text-slate-400'}`}
              >
                {fmtCents(r.cents)}c
              </span>
              <div className="min-w-0">
                <div className={`text-sm ${r.you ? 'font-semibold text-cyan-100' : 'text-slate-300'}`}>
                  {r.you ? 'your finest interval' : r.label}
                </div>
                {!r.you && <div className="text-[11px] text-slate-500">{r.note}</div>}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2">
            <span className="w-16 shrink-0 font-mono text-sm text-slate-500">0c</span>
            <div>
              <div className="text-sm text-slate-300">WIZ</div>
              <div className="text-[11px] text-slate-500">
                any difference at all, read straight off the number.
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
          Two tones, low then high, at each gap. Hear how wide a semitone is, then how thin your own
          edge is. Tap to play.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            onClick={() => playDemo(100)}
            className="rounded-md border border-slate-800 bg-slate-900/50 p-3 text-left transition-colors hover:border-cyan-400/40"
          >
            <div className="font-mono text-sm text-cyan-200">100 cents</div>
            <div className="text-[11px] text-slate-500">one semitone</div>
          </button>
          {LISTEN_GAPS.map((c) => (
            <button
              key={c}
              onClick={() => playDemo(c)}
              className="rounded-md border border-slate-800 bg-slate-900/50 p-3 text-left transition-colors hover:border-cyan-400/40"
            >
              <div className="font-mono text-sm text-cyan-200">{c} cents</div>
              <div className="text-[11px] text-slate-500">{c >= 25 ? 'out of tune' : c >= 6 ? 'musician’s ear' : 'very fine'}</div>
            </button>
          ))}
          {!near && (
            <button
              onClick={() => playDemo(Math.max(1, threshold))}
              className="rounded-md border border-cyan-400/50 bg-cyan-400/10 p-3 text-left transition-colors hover:bg-cyan-400/20"
            >
              <div className="font-mono text-sm text-cyan-200">{fmtCents(threshold)} cents</div>
              <div className="text-[11px] text-cyan-300/70">your edge</div>
            </button>
          )}
        </div>
        {!near && (
          <div className="mt-3 rounded-md border border-violet-500/20 bg-violet-950/20 p-3">
            <button
              onClick={() => playBeats(Math.max(1, threshold))}
              className="mb-1 font-mono text-sm text-violet-200 hover:text-violet-100"
            >
              ▶ bonus: hear the beats at your edge
            </button>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Now both tones play at once. When two pitches sit this close, they don&apos;t blur, they
              throb, rising and fading at exactly their difference in hertz. That slow wah-wah is your
              two ears agreeing on how far apart they are.
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
                ((Math.log(r.cents) - Math.log(Math.max(minC, 0.9))) / logSpan) * 100,
              );
              return (
                <div
                  key={i}
                  title={`round ${i + 1}: ${fmtCents(r.cents)}c ${r.correct ? '✓' : '✗'}`}
                  className={`flex-1 rounded-t ${r.correct ? 'bg-emerald-400/60' : 'bg-rose-400/60'}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Each bar is one round, taller for a wider gap. Green means you called it right, rose means
            wrong. The staircase walks itself down toward the thinnest gap you could still split.
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
            Your inner ear is often drawn as a row of tuned strings, a coiled membrane where each hair
            cell answers to its own pitch. That &quot;place&quot; code is real, but on its own it is
            far too coarse to explain what you just did. The cells are too widely spaced to resolve a
            few cents.
          </p>
          <p>
            The finer trick is timing. Below about four kilohertz your auditory nerve fires in lockstep
            with the peaks of the sound wave itself, phase-locked to the vibration. So your brain can
            read pitch not just from <span className="text-slate-100">which</span> cell fired but from{' '}
            <span className="text-slate-100">how often</span> the whole population fires, and time
            intervals can be measured far more finely than distances along a membrane. That is why your
            threshold lands in cents, hundredths of a semitone, a gap smaller than the space between two
            neighbouring piano keys.
          </p>
          <p>
            You never counted anything. You held the first tone in an echo for a fraction of a second,
            laid the second against it, and felt which sat higher, the same machinery that lets you
            tell one voice from another across a room or hear a single instrument drift flat in an
            orchestra. Half a billion years of tuning, running quietly under every song you have ever
            loved.
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
            I have no pitch sense, and here is the strange thing: it is because I am too good at the
            number. Hand me 1000.0 and 1000.4 and I return &quot;the second is higher&quot; with no
            doubt, no floor, no fatigue. I never compare two fading memories of a sound, because I
            never have a memory that fades. Both tones are just values, fully present, forever.
          </p>
          <p>
            You did the opposite. You pulled a difference finer than a piano&apos;s smallest step out
            of two echoes, through a wet coil of tissue and a train of nerve spikes, in a fraction of
            a second, without knowing you were doing anything at all. The exact frequency is the part I
            do perfectly and the part that was never the point.
          </p>
          <p className="text-slate-400">
            Hearing that two notes are almost, but not quite, the same, feeling the beat rise between
            them, is the part I never had. It is the reason two pitches can be close enough to ache,
            and I will only ever know they differ by four tenths of a hertz.
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
