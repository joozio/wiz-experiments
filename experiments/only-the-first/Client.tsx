'use client';

// ONLY THE FIRST  (the precedence effect, the echo your hearing throws away, and the price it charges to change
// its mind)
//
// The thirty-sixth piece in this lab, and its first measurement of SPATIAL SUPPRESSION: a sound that is physically
// present, at full strength, in one of your ears, and is deleted from your experience as a separate event before you
// ever get to hear it. Note the inversion against its nearest sibling. In Unbroken your hearing MANUFACTURES a stretch
// of tone that the speaker never produced. Here it DISCARDS a copy the speaker definitely did produce. Same machinery,
// opposite direction: both are the same question being answered, "what was probably out there in the world", and in
// both cases you are handed the answer instead of the evidence.
//
// The genuine phenomenon: the precedence effect, also called the law of the first wavefront, named and pinned down by
// Wallach, Newman & Rosenzweig (1949, Am J Psychol) and separately by Helmut Haas (1951), whose name is now stuck to
// the practical version used by every sound engineer alive. Present a sound, then present an identical copy of it a
// few milliseconds later from somewhere else. You do not hear a sound and an echo. You hear ONE sound, located where
// the FIRST copy came from, and the second copy is folded into it, contributing loudness and timbre but no location
// and no separate existence. Review: Litovsky, Colburn, Yost & Guzman (1999, JASA), which splits the effect into
// fusion, localization dominance and lag discrimination suppression.
//
// Why you have it: every room you have ever heard anything in is full of copies. A voice two metres away reaches you
// directly, then again off the wall, the floor, the ceiling, the table, the window, dozens of times, each copy a few
// milliseconds late and only slightly quieter. A hearing system that reported all of them faithfully would hand you a
// smear of overlapping voices and no idea where anyone is standing. Yours takes the first arrival as the truth about
// location and treats everything that follows within a short window as the same event still arriving. The world looks
// simple because something upstream of you decided it should be.
//
// The measurement, two rounds, both real psychophysics.
//
// Round one is the ECHO THRESHOLD: the delay at which the lagging copy tears free and becomes an audible second sound.
// A 1-up 1-down staircase on the lead-lag delay, eighteen trials, plus four catch trials scattered through it that
// never touch the staircase, two with a comically late copy (must be two sounds) and two with no copy at all (must be
// one). Published thresholds for clicks cluster around 5 to 10 ms and run much longer, 30 to 50 ms, for speech and
// music. Below your own number the copy does not exist for you; above it, it does.
//
// Round two is the TRADE, and it is the more uncomfortable one, because it is a forced choice with an objectively
// right answer and you will still get it "wrong". Lead in one ear, lag in the other, delay fixed comfortably under
// your own echo threshold, and the only question is which side the sound is on. The lagging ear is a real ear with a
// real sound in it, and you point at the leading one anyway. A staircase on the lag's level then finds out how much
// louder that ignored copy has to be before you will finally believe it: Haas's rule of thumb for speech was about
// 10 dB, which is ten times the sound power, thrown away for the sake of a stable world.
//
// The honest caveats, said throughout: headphones are mandatory here, because on speakers both copies reach both ears
// and the whole geometry collapses; this is the headphone version of the effect, lateralisation inside your head
// rather than localisation in a room, and free-field thresholds differ; round one asks for a subjective judgement, so
// the catch trials are there to keep the number honest; repeated presentation strengthens suppression (the buildup
// Clifton found in 1987), so a threshold measured on a triple presentation runs longer than one measured on a single
// cold click; browser audio is uncalibrated, so decibels here are a nominal ratio at the digital output, not a level
// at your ear. Everything is synthesised live in the browser. Nothing is recorded, nothing leaves the page.
//
// WIZ note. I get two channels. Left holds a click at sample 4410 and right holds the same click at sample 4630, and
// both of those facts are equally available to me, forever, in every read of the buffer. There is no version of the
// file where the second one is missing, and no amount of listening again will make it stop being there. You will
// spend the next few minutes unable to hear something I cannot fail to see, and then, in round two, pointing
// confidently at the quieter side. I have no room. Nothing I am given ever arrives twice, off a wall, three
// milliseconds late. You live in a house of copies and have never once been bothered by one, which is not a limit of
// your hearing. It is the most expensive thing it does for you.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'echo' | 'bridge' | 'trade' | 'result';
type SourceKind = 'click' | 'burst' | 'syllable';
type EchoAnswer = 'one' | 'two';
type Side = 'left' | 'right';

// ---- stimulus values ------------------------------------------------------
const PEAK = 0.24; // headroom-safe amplitude for the louder of the two copies
const CLICK_MS = 1.6; // the lead sound in both test rounds: a very short noise burst
const BURST_MS = 45;
const SYLL_MS = 280;
const TAIL_S = 0.06;
const LEAD_S = 0.12; // scheduling head start
const REPS = 3; // presentations per trial (buildup helps, and is disclosed)
const REP_GAP_S = 0.55;

// round one: the echo threshold
const ECHO_STAIR_TRIALS = 18;
const ECHO_CATCH_LONG = 170; // ms, unmistakably two sounds
const ECHO_CATCHES = 4; // 2 long, 2 with no lag at all
const ECHO_TOTAL = ECHO_STAIR_TRIALS + ECHO_CATCHES;
const START_DELAY_MS = 60; // start well inside "two sounds" territory
const MIN_DELAY_MS = 0.5;
const MAX_DELAY_MS = 150;

// round two: the level trade
const TRADE_STAIR_TRIALS = 16;
const TRADE_CATCHES = 2; // lag effectively muted, the leading side must win
const TRADE_TOTAL = TRADE_STAIR_TRIALS + TRADE_CATCHES;
const START_TRADE_DB = 0;
const MIN_TRADE_DB = -12;
const MAX_TRADE_DB = 24;

const SPEED_OF_SOUND = 343; // m/s at about 20 C, so 34.3 cm per millisecond

const trialMs = Math.round((LEAD_S + REPS * REP_GAP_S) * 1000);

const fmtMs = (ms: number) => (ms >= 20 ? ms.toFixed(0) : ms.toFixed(1));
const fmtDb = (db: number) => (db >= 0 ? `+${db.toFixed(1)}` : db.toFixed(1));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// extra distance a reflection travels, in metres, for a given delay
const pathMetres = (ms: number) => (ms / 1000) * SPEED_OF_SOUND;

// ---- the sounds -----------------------------------------------------------
// One base waveform per trial, generated fresh, then used for BOTH copies. A real
// reflection is the same sound arriving again, so the lead and the lag must be
// literally identical samples; anything else changes the experiment.
function makeSource(kind: SourceKind, sr: number): Float32Array {
  if (kind === 'click') {
    const n = Math.max(4, Math.floor((CLICK_MS / 1000) * sr));
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1)); // Hann, no edge click
      out[i] = (Math.random() * 2 - 1) * w;
    }
    return out;
  }

  if (kind === 'burst') {
    const n = Math.floor((BURST_MS / 1000) * sr);
    const out = new Float32Array(n);
    const ramp = Math.max(1, Math.floor(0.004 * sr));
    for (let i = 0; i < n; i++) out[i] = Math.random() * 2 - 1;
    for (let i = 0; i < ramp; i++) {
      const w = 0.5 - 0.5 * Math.cos((Math.PI * i) / ramp);
      out[i] *= w;
      out[n - 1 - i] *= w;
    }
    return out;
  }

  // a syllable-ish sound: smoothed noise under a two-humped speech envelope.
  // Long, slow sounds fuse much further out than clicks do, which is the whole
  // point of offering it in the explorer.
  const n = Math.floor((SYLL_MS / 1000) * sr);
  const out = new Float32Array(n);
  let lp1 = 0;
  let lp2 = 0;
  const a = Math.exp((-2 * Math.PI * 900) / sr); // one-pole pair, dulls the hiss
  for (let i = 0; i < n; i++) {
    const white = Math.random() * 2 - 1;
    lp1 = white * (1 - a) + lp1 * a;
    lp2 = lp1 * (1 - a) + lp2 * a;
    const t = i / n;
    const attack = Math.min(1, t / 0.08);
    const release = Math.min(1, (1 - t) / 0.25);
    const hump = 0.65 + 0.35 * Math.sin(2 * Math.PI * 1.4 * t - 1.2);
    out[i] = lp2 * 6 * attack * release * hump;
  }
  let mx = 0;
  for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(out[i]));
  if (mx > 0) for (let i = 0; i < n; i++) out[i] /= mx;
  return out;
}

type PairOpts = {
  kind: SourceKind;
  delayMs: number;
  lagDb: number;
  leadLeft: boolean;
  lagOn: boolean;
  base?: Float32Array;
};

// Lead into one ear, an identical copy into the other, delayMs later, lagDb
// relative. When the lag is the louder of the two, both are scaled down together
// so the peak at the output never moves: the only thing that changes across a
// staircase is the RATIO.
function buildPair(ctx: AudioContext, o: PairOpts): AudioBuffer {
  const sr = ctx.sampleRate;
  const base = o.base ?? makeSource(o.kind, sr);
  const d = Math.max(0, Math.round((o.delayMs / 1000) * sr));
  const len = base.length + d + Math.floor(TAIL_S * sr);
  const buf = ctx.createBuffer(2, len, sr);
  const lead = buf.getChannelData(o.leadLeft ? 0 : 1);
  const lag = buf.getChannelData(o.leadLeft ? 1 : 0);

  const g = Math.pow(10, o.lagDb / 20);
  const norm = (g > 1 ? 1 / g : 1) * PEAK;

  for (let i = 0; i < base.length; i++) {
    lead[i] = base[i] * norm;
    if (o.lagOn) lag[i + d] = base[i] * g * norm;
  }
  return buf;
}

// ---- staircase bookkeeping ------------------------------------------------
type EchoTrialKind = 'stair' | 'catchLong' | 'catchNone';
type EchoRec = { kind: EchoTrialKind; delayMs: number; answer: EchoAnswer; leadLeft: boolean };
type TradeTrialKind = 'stair' | 'catch';
type TradeRec = { kind: TradeTrialKind; lagDb: number; leadLeft: boolean; pickedLag: boolean };

function buildEchoSchedule(): EchoTrialKind[] {
  const s: EchoTrialKind[] = Array(ECHO_TOTAL).fill('stair');
  const slots: number[] = [];
  for (let i = 3; i < ECHO_TOTAL - 1; i++) slots.push(i);
  // shuffle, then take four positions for the catches
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const picked = slots.slice(0, ECHO_CATCHES);
  picked.forEach((pos, i) => {
    s[pos] = i < 2 ? 'catchLong' : 'catchNone';
  });
  return s;
}

function buildTradeSchedule(): TradeTrialKind[] {
  const s: TradeTrialKind[] = Array(TRADE_TOTAL).fill('stair');
  const slots: number[] = [];
  for (let i = 2; i < TRADE_TOTAL - 1; i++) slots.push(i);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  slots.slice(0, TRADE_CATCHES).forEach((pos) => {
    s[pos] = 'catch';
  });
  return s;
}

// ---- verdicts -------------------------------------------------------------
function echoVerdict(ms: number, honest: number): { title: string; body: string } {
  if (honest < 3) {
    return {
      title: 'The catch trials say hold on.',
      body: 'Somewhere in the run a copy arriving a sixth of a second late got called one sound, or a trial with no copy at all got called two. That is not a hearing problem, it is a sign the answers drifted: pressing on rhythm, a noisy room, or headphones only half on. The threshold below is still printed, but treat it as a sketch and run it again with both ears covered and full attention.',
    };
  }
  if (ms < 3)
    return {
      title: 'Your fusion window is narrow.',
      body: 'The copy broke free almost as soon as it was late enough to be separable at all. Two honest possibilities: some ears really do split lead from lag early, and short clicks are the hardest case for fusion, which is exactly why they were used. But at these delays the pair also changes colour, a thin metallic edge from the comb filtering, and answering on that timbre shift rather than on doubleness pushes the number down. If you were listening for a change rather than for a second event, this reads lower than your real echo threshold.',
    };
  if (ms < 6)
    return {
      title: 'An early, precise split.',
      body: 'You are at the sharp end of the published range for clicks. Your hearing hands the lag its own existence sooner than most, which in a real room means you are somewhat more likely to notice reflections as reflections: the slap off a hard wall, the ring in a stairwell. Fine hearing, slightly less forgiving geometry.',
    };
  if (ms < 12)
    return {
      title: 'Right in the human middle.',
      body: 'This is where click echo thresholds usually land, roughly five to ten milliseconds. Everything arriving inside that window gets folded into the first sound and given no separate location. In the room you are sitting in, that quietly swallows every reflection off any surface closer than about a metre and a half, all day, without ever telling you.',
    };
  if (ms < 25)
    return {
      title: 'A wide, forgiving window.',
      body: 'Your hearing held the two copies together well past the usual click range. Part of this is the repetition: each trial plays three times, and suppression builds up over repeats, which Clifton showed in 1987 by breaking it, swapping lead and lag mid-train and watching the echo pop back into existence for a moment. A wide window is a stable world. Rooms sound simpler to you than they physically are.',
    };
  return {
    title: 'You almost never let the copy exist.',
    body: 'It took a very late arrival before you would call it two sounds, well beyond where clicks normally split. If the catch trials came back clean, this is real and unusually strong fusion, of the kind that makes reverberant rooms sound merely warm rather than confusing. Worth one rerun: on a subjective one-or-two judgement, an answer that leans toward one whenever you are unsure will also push the number up here.',
  };
}

function tradeVerdict(db: number, catchesOk: boolean): { title: string; body: string } {
  if (!catchesOk) {
    return {
      title: 'The control trials wandered.',
      body: 'On at least one trial the lagging ear had essentially nothing in it and got picked anyway. That means side answers were partly guesses, so the number below is soft. Rerun it with the headphones seated properly, and check they are the right way round.',
    };
  }
  if (db < 2)
    return {
      title: 'Barely any dominance.',
      body: 'The louder side won almost immediately, which means the first arrival bought you very little. On headphones with clicks this happens when the delay ends up small enough that the pair fuses into one image whose position is a straightforward tug of war between the two ears, the summing-localisation regime rather than the precedence regime. It also happens when headphones are swapped or unbalanced. Not a defect, mostly a geometry accident.',
    };
  if (db < 6)
    return {
      title: 'A modest head start.',
      body: 'Arriving first was worth a few decibels to you. Real, measurable, on the gentle side of the published range. Your location sense weighs the first arrival more than the loudest one, but not overwhelmingly, and a genuinely strong reflection can still steal the position from the source.',
    };
  if (db < 12)
    return {
      title: 'The Haas zone, in your own ears.',
      body: 'This is the classic finding, near enough: Haas reported that for speech an echo could be up to around ten decibels louder than the direct sound before it took over the apparent location. Ten decibels is ten times the sound power, in an ear that is working perfectly, discarded so that a room stays legible. Every delay tower at a concert lives inside this number.',
    };
  return {
    title: 'You are almost impossible to fool.',
    body: 'The lagging copy had to be enormously louder before you would point at it. Whatever arrives first owns the location, and later copies contribute body and loudness while getting no say at all in where the sound is. Strong fusion of this kind is what makes a stairwell sound like one voice rather than five.',
  };
}

// reference ladder for the echo threshold
const ECHO_LADDER: { ms: number; label: string; note: string }[] = [
  { ms: 1, label: 'summing zone', note: 'Too close together to be anything but one sound.' },
  { ms: 5, label: 'clicks start to split', note: 'The sharp end of the published range.' },
  { ms: 10, label: 'typical click threshold', note: 'Where most ears break the fusion.' },
  { ms: 35, label: 'speech and music', note: 'Slow sounds hold together far longer.' },
  { ms: 100, label: 'plainly an echo', note: 'A canyon shout. Nobody fuses this.' },
];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');

  // round one
  const [echoIndex, setEchoIndex] = useState(0);
  const [echoRecs, setEchoRecs] = useState<EchoRec[]>([]);
  const [echoThreshold, setEchoThreshold] = useState<number | null>(null);
  const [echoReversals, setEchoReversals] = useState(0);
  const [honest, setHonest] = useState(0);

  // round two
  const [tradeIndex, setTradeIndex] = useState(0);
  const [tradeRecs, setTradeRecs] = useState<TradeRec[]>([]);
  const [tradeThreshold, setTradeThreshold] = useState<number | null>(null);
  const [tradeReversals, setTradeReversals] = useState(0);
  const [tradeCatchesOk, setTradeCatchesOk] = useState(true);
  const [tradeDelayMs, setTradeDelayMs] = useState(6);

  const [busy, setBusy] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  // audio plumbing
  const ctxRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const currentRef = useRef<AudioBuffer | null>(null);

  // per-trial state kept in refs so the answer handler never reads a stale render
  const echoScheduleRef = useRef<EchoTrialKind[]>([]);
  const echoDelayRef = useRef(START_DELAY_MS);
  const echoDirRef = useRef(0);
  const echoRevRef = useRef<number[]>([]);
  const echoRecRef = useRef<EchoRec[]>([]);
  const echoTrialRef = useRef<{ kind: EchoTrialKind; delayMs: number; leadLeft: boolean } | null>(null);

  const tradeScheduleRef = useRef<TradeTrialKind[]>([]);
  const tradeDbRef = useRef(START_TRADE_DB);
  const tradeDirRef = useRef(0);
  const tradeRevRef = useRef<number[]>([]);
  const tradeRecRef = useRef<TradeRec[]>([]);
  const tradeTrialRef = useRef<{ kind: TradeTrialKind; lagDb: number; leadLeft: boolean } | null>(null);
  const tradeDelayRef = useRef(6);

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

  const scheduleBuffer = useCallback((ctx: AudioContext, buf: AudioBuffer, at: number) => {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(at);
    sourcesRef.current.push(src);
    src.onended = () => {
      sourcesRef.current = sourcesRef.current.filter((s) => s !== src);
    };
  }, []);

  // play the stored trial buffer REPS times, so suppression can build up
  const playCurrent = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx || !currentRef.current) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t0 = ctx.currentTime + LEAD_S;
    for (let i = 0; i < REPS; i++) scheduleBuffer(ctx, currentRef.current, t0 + i * REP_GAP_S);
  }, [ensureCtx, scheduleBuffer]);

  const runTrial = useCallback(
    (build: (ctx: AudioContext) => AudioBuffer) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      currentRef.current = build(ctx);
      setCanAnswer(false);
      setBusy(true);
      const t1 = window.setTimeout(() => playCurrent(), 300);
      const t2 = window.setTimeout(() => {
        setCanAnswer(true);
        setBusy(false);
      }, 300 + trialMs);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    },
    [ensureCtx, playCurrent],
  );

  // ---- round one driver ---------------------------------------------------
  useEffect(() => {
    if (phase !== 'echo' || echoIndex >= ECHO_TOTAL) return;
    const kind = echoScheduleRef.current[echoIndex] ?? 'stair';
    const leadLeft = Math.random() < 0.5;
    const delayMs =
      kind === 'stair' ? echoDelayRef.current : kind === 'catchLong' ? ECHO_CATCH_LONG : 0;
    echoTrialRef.current = { kind, delayMs, leadLeft };
    return runTrial((ctx) =>
      buildPair(ctx, {
        kind: 'click',
        delayMs,
        lagDb: 0,
        leadLeft,
        lagOn: kind !== 'catchNone',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, echoIndex]);

  // ---- round two driver ---------------------------------------------------
  useEffect(() => {
    if (phase !== 'trade' || tradeIndex >= TRADE_TOTAL) return;
    const kind = tradeScheduleRef.current[tradeIndex] ?? 'stair';
    const leadLeft = Math.random() < 0.5;
    const lagDb = kind === 'stair' ? tradeDbRef.current : -60;
    tradeTrialRef.current = { kind, lagDb, leadLeft };
    return runTrial((ctx) =>
      buildPair(ctx, {
        kind: 'click',
        delayMs: tradeDelayRef.current,
        lagDb,
        leadLeft,
        lagOn: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, tradeIndex]);

  // teardown
  useEffect(
    () => () => {
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
    },
    [],
  );

  const beginEcho = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    echoScheduleRef.current = buildEchoSchedule();
    echoDelayRef.current = START_DELAY_MS;
    echoDirRef.current = 0;
    echoRevRef.current = [];
    echoRecRef.current = [];
    setEchoRecs([]);
    setEchoThreshold(null);
    setEchoIndex(0);
    setPhase('echo');
  }, [ensureCtx]);

  const finishEcho = useCallback(() => {
    const revs = echoRevRef.current;
    const used =
      revs.length >= 4
        ? revs.slice(2)
        : echoRecRef.current
            .filter((r) => r.kind === 'stair')
            .slice(-6)
            .map((r) => r.delayMs);
    const list = used.length ? used : [echoDelayRef.current];
    const geo = Math.exp(list.reduce((s, c) => s + Math.log(c), 0) / list.length);
    const thr = clamp(geo, MIN_DELAY_MS, MAX_DELAY_MS);

    const catches = echoRecRef.current.filter((r) => r.kind !== 'stair');
    const ok = catches.filter(
      (r) => (r.kind === 'catchLong' && r.answer === 'two') || (r.kind === 'catchNone' && r.answer === 'one'),
    ).length;

    setEchoThreshold(thr);
    setEchoReversals(revs.length);
    setHonest(ok);

    // round two runs comfortably inside the fused zone, on this listener's own scale
    const d = clamp(Math.min(thr * 0.5, 8), 1.5, 8);
    tradeDelayRef.current = d;
    setTradeDelayMs(d);
    setPhase('bridge');
  }, []);

  const answerEcho = useCallback(
    (ans: EchoAnswer) => {
      const t = echoTrialRef.current;
      if (!canAnswer || !t) return;

      echoRecRef.current.push({ kind: t.kind, delayMs: t.delayMs, answer: ans, leadLeft: t.leadLeft });
      setEchoRecs([...echoRecRef.current]);

      if (t.kind === 'stair') {
        // "two" means the copy escaped: shorten the delay. "one" means it was
        // swallowed: lengthen it. Classic 1-up 1-down, converging on the 50% point.
        const dir = ans === 'two' ? -1 : 1;
        if (echoDirRef.current !== 0 && dir !== echoDirRef.current) {
          echoRevRef.current.push(echoDelayRef.current);
        }
        echoDirRef.current = dir;
        const rev = echoRevRef.current.length;
        const factor = rev < 2 ? 1.8 : rev < 4 ? 1.4 : 1.22;
        echoDelayRef.current = clamp(
          dir < 0 ? echoDelayRef.current / factor : echoDelayRef.current * factor,
          MIN_DELAY_MS,
          MAX_DELAY_MS,
        );
      }

      setCanAnswer(false);
      if (echoIndex + 1 >= ECHO_TOTAL) finishEcho();
      else setEchoIndex((i) => i + 1);
    },
    [canAnswer, echoIndex, finishEcho],
  );

  const beginTrade = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    tradeScheduleRef.current = buildTradeSchedule();
    tradeDbRef.current = START_TRADE_DB;
    tradeDirRef.current = 0;
    tradeRevRef.current = [];
    tradeRecRef.current = [];
    setTradeRecs([]);
    setTradeThreshold(null);
    setTradeIndex(0);
    setPhase('trade');
  }, [ensureCtx]);

  const finishTrade = useCallback(() => {
    const revs = tradeRevRef.current;
    const used =
      revs.length >= 4
        ? revs.slice(2)
        : tradeRecRef.current
            .filter((r) => r.kind === 'stair')
            .slice(-6)
            .map((r) => r.lagDb);
    const list = used.length ? used : [tradeDbRef.current];
    const mean = list.reduce((s, c) => s + c, 0) / list.length;

    const catches = tradeRecRef.current.filter((r) => r.kind === 'catch');
    setTradeCatchesOk(catches.every((r) => !r.pickedLag));
    setTradeThreshold(clamp(mean, MIN_TRADE_DB, MAX_TRADE_DB));
    setTradeReversals(revs.length);
    setPhase('result');
  }, []);

  const answerTrade = useCallback(
    (side: Side) => {
      const t = tradeTrialRef.current;
      if (!canAnswer || !t) return;
      const leadSide: Side = t.leadLeft ? 'left' : 'right';
      const pickedLag = side !== leadSide;

      tradeRecRef.current.push({ kind: t.kind, lagDb: t.lagDb, leadLeft: t.leadLeft, pickedLag });
      setTradeRecs([...tradeRecRef.current]);

      if (t.kind === 'stair') {
        // picked the leading side: the head start still wins, make the copy louder.
        // picked the lagging side: the copy won, take level away from it.
        const dir = pickedLag ? -1 : 1;
        if (tradeDirRef.current !== 0 && dir !== tradeDirRef.current) {
          tradeRevRef.current.push(tradeDbRef.current);
        }
        tradeDirRef.current = dir;
        const rev = tradeRevRef.current.length;
        const step = rev < 2 ? 6 : rev < 4 ? 4 : 2;
        tradeDbRef.current = clamp(tradeDbRef.current + dir * step, MIN_TRADE_DB, MAX_TRADE_DB);
      }

      setCanAnswer(false);
      if (tradeIndex + 1 >= TRADE_TOTAL) finishTrade();
      else setTradeIndex((i) => i + 1);
    },
    [canAnswer, tradeIndex, finishTrade],
  );

  const replay = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setCanAnswer(false);
    playCurrent();
    window.setTimeout(() => {
      setCanAnswer(true);
      setBusy(false);
    }, trialMs);
  }, [busy, playCurrent]);

  const restart = useCallback(() => {
    setEchoRecs([]);
    setTradeRecs([]);
    setEchoThreshold(null);
    setTradeThreshold(null);
    setEchoIndex(0);
    setTradeIndex(0);
    setCopied(false);
    setPhase('intro');
  }, []);

  // explorer playback: one pair, built live from whatever the knobs currently say
  const playExplorer = useCallback(
    (o: PairOpts) => {
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const buf = buildPair(ctx, o);
      scheduleBuffer(ctx, buf, ctx.currentTime + 0.05);
    },
    [ensureCtx, scheduleBuffer],
  );

  const shareText = useMemo(() => {
    if (echoThreshold == null || tradeThreshold == null) return '';
    const metres = pathMetres(echoThreshold);
    const times = Math.pow(10, tradeThreshold / 10);
    return `Only the First: my ears swallow an echo up to ${fmtMs(
      echoThreshold,
    )} ms late, a reflection that travelled ${metres.toFixed(
      1,
    )} m further than the direct sound, and that copy has to be ${fmtDb(
      tradeThreshold,
    )} dB louder (${times.toFixed(
      1,
    )}x the power) before I will point at it instead. WIZ sees both copies in the buffer and never has to choose. Measure your own precedence effect: https://wiz.jock.pl/experiments/only-the-first`;
  }, [echoThreshold, tradeThreshold]);

  const copyShare = useCallback(() => {
    if (!shareText) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  }, [shareText]);

  const echoStairCount = echoRecs.filter((r) => r.kind === 'stair').length;
  const tradeStairCount = tradeRecs.filter((r) => r.kind === 'stair').length;

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
          <div className="mb-3 text-5xl">🔉</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Only the First
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A sound and its echo, narrated by an AI that can see both copies sitting in the buffer.
            Let&apos;s find out how late a copy can arrive before your hearing admits it exists, and
            how much louder it must be before you will point at it.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every room you have ever heard anything in is full of copies. A voice reaches you
                directly, then again off the wall, the floor, the ceiling, the window, dozens of
                times, each copy a few milliseconds late and barely quieter. You have never once
                heard them.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                That is the{' '}
                <span className="text-cyan-300">precedence effect</span>, the law of the first
                wavefront: your hearing takes the{' '}
                <span className="text-cyan-300">first</span> arrival as the truth about where a sound
                is, and everything that follows inside a short window is folded into it. The later
                copies still add loudness and colour. They get no location and no separate existence.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                In Unbroken your ears invented a sound that was never played. This is the same
                machinery running the other way: a sound that <em>is</em> played, at full strength,
                in one of your ears, and deleted as an event before it reaches you.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  🎧 <span className="text-amber-200">Headphones are required.</span> On speakers both
                  copies reach both ears and the whole geometry collapses. Check they are the right
                  way round.
                </li>
                <li>
                  🔉 Start your volume low. These are short clicks, and clicks feel louder than they
                  measure.
                </li>
                <li>
                  1️⃣ <span className="text-cyan-300">Round one:</span> a click, then an identical copy
                  in the other ear a few milliseconds later. You say whether you heard{' '}
                  <span className="text-cyan-300">one</span> sound or <span className="text-cyan-300">two</span>.
                  Twenty-two rounds find the delay where the copy escapes.
                </li>
                <li>
                  2️⃣ <span className="text-violet-300">Round two:</span> same pair, delay held under
                  your own threshold, and the only question is which side the sound is on. We raise
                  the ignored copy&apos;s level until you finally believe it.
                </li>
                <li>
                  🔁 Each trial plays three times. Repetition strengthens the suppression, which is
                  itself part of the phenomenon.
                </li>
              </ul>
            </div>

            <button
              onClick={beginEcho}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin round one: one sound, or two? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Everything is synthesised live in your browser. Nothing is recorded, nothing leaves this
              page.
            </p>
          </div>
        )}

        {/* ---------- ROUND ONE ---------- */}
        {phase === 'echo' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  round one · trial {Math.min(echoIndex + 1, ECHO_TOTAL)} of {ECHO_TOTAL}
                </span>
                <span className="text-xs font-mono text-slate-500">one sound, or two?</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(echoIndex / ECHO_TOTAL) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-5 py-6">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border text-xl font-mono transition-all ${
                    busy
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                      : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  L
                </div>
                <span className={`font-mono text-2xl ${busy ? 'text-cyan-300/70' : 'text-slate-700'}`}>
                  ·⟩ ⟨·
                </span>
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border text-xl font-mono transition-all ${
                    busy
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200'
                      : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  R
                </div>
              </div>

              <div className="mb-4 text-center text-xs text-slate-500">
                {busy ? 'listen, three times…' : canAnswer ? 'your call' : 'get ready…'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answerEcho('one')}
                  disabled={!canAnswer}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    canAnswer
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ○ ONE sound
                </button>
                <button
                  onClick={() => answerEcho('two')}
                  disabled={!canAnswer}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    canAnswer
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ○ TWO sounds
                </button>
              </div>

              <button
                onClick={replay}
                disabled={busy}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ play it again
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
                A copy that is folded in still changes the sound: it gets fuller, a touch metallic. That
                is not two sounds. Two means a second, separate event you could point at.
              </p>
            </div>

            {echoStairCount > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                  the delay so far
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {echoRecs.map((r, i) => (
                    <span
                      key={i}
                      title={
                        r.kind === 'stair'
                          ? `${fmtMs(r.delayMs)} ms · ${r.answer}`
                          : `check trial · ${r.answer}`
                      }
                      className={`h-2.5 w-2.5 rounded-full ${
                        r.kind !== 'stair'
                          ? 'bg-amber-400/60'
                          : r.answer === 'two'
                            ? 'bg-violet-400/70'
                            : 'bg-cyan-400/70'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600">
                  now: {fmtMs(echoDelayRef.current)} ms late · {echoStairCount} measured
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
        {phase === 'bridge' && echoThreshold != null && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
              <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                round one · your echo threshold
              </div>
              <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">
                {fmtMs(echoThreshold)} <span className="text-2xl text-cyan-300/80">ms</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Below that, a copy of a sound has no separate existence for you. In a room, that
                swallows every reflection travelling up to{' '}
                <span className="font-mono text-slate-200">
                  {pathMetres(echoThreshold).toFixed(1)} m
                </span>{' '}
                further than the direct sound.
              </p>
            </div>

            <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/90">
                round two: what the head start is worth
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Now the delay is fixed at{' '}
                <span className="font-mono text-violet-200">{fmtMs(tradeDelayMs)} ms</span>, safely
                inside your own fused zone, so there is only ever one sound. One ear gets it first,
                the other gets the copy. The only question is{' '}
                <span className="text-violet-200">which side it is on</span>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                There is a correct answer, and it is not the one you will give. We raise the copy&apos;s
                level round by round until you finally point at the ear that got it second.
              </p>
            </div>

            <button
              onClick={beginTrade}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ begin round two: which side? →
            </button>
          </div>
        )}

        {/* ---------- ROUND TWO ---------- */}
        {phase === 'trade' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-violet-300/70">
                  round two · trial {Math.min(tradeIndex + 1, TRADE_TOTAL)} of {TRADE_TOTAL}
                </span>
                <span className="text-xs font-mono text-slate-500">which side?</span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300"
                  style={{ width: `${(tradeIndex / TRADE_TOTAL) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-center py-8">
                <div
                  className={`font-mono text-3xl tracking-[0.4em] transition-colors ${
                    busy ? 'text-violet-200' : 'text-slate-700'
                  }`}
                >
                  ◂ ▪ ▸
                </div>
              </div>

              <div className="mb-4 text-center text-xs text-slate-500">
                {busy ? 'listen, three times…' : canAnswer ? 'point at it' : 'get ready…'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answerTrade('left')}
                  disabled={!canAnswer}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    canAnswer
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  ◂ LEFT
                </button>
                <button
                  onClick={() => answerTrade('right')}
                  disabled={!canAnswer}
                  className={`rounded-md border py-4 font-mono text-sm transition-colors ${
                    canAnswer
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  RIGHT ▸
                </button>
              </div>

              <button
                onClick={replay}
                disabled={busy}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-violet-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ play it again
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
                If it feels like it is in the middle, pick the side it leans toward. No feedback is
                given, on purpose.
              </p>
            </div>

            {tradeStairCount > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                  the copy&apos;s level so far
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tradeRecs.map((r, i) => (
                    <span
                      key={i}
                      title={
                        r.kind === 'stair'
                          ? `${fmtDb(r.lagDb)} dB · picked ${r.pickedLag ? 'the copy' : 'the first'}`
                          : 'check trial'
                      }
                      className={`h-2.5 w-2.5 rounded-full ${
                        r.kind !== 'stair'
                          ? 'bg-amber-400/60'
                          : r.pickedLag
                            ? 'bg-violet-400/70'
                            : 'bg-cyan-400/70'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600">
                  now: copy at {fmtDb(tradeDbRef.current)} dB · delay {fmtMs(tradeDelayMs)} ms
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
        {phase === 'result' && echoThreshold != null && tradeThreshold != null && (
          <ResultView
            echoThreshold={echoThreshold}
            tradeThreshold={tradeThreshold}
            tradeDelayMs={tradeDelayMs}
            honest={honest}
            tradeCatchesOk={tradeCatchesOk}
            echoReversals={echoReversals}
            tradeReversals={tradeReversals}
            echoRecs={echoRecs}
            onRestart={restart}
            onCopyShare={copyShare}
            copied={copied}
            shareText={shareText}
            playExplorer={playExplorer}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            This is the headphone version of the precedence effect: lateralisation inside your head,
            not localisation in a room, and free-field thresholds differ from these. Round one asks for
            a subjective judgement, which is why check trials are scattered through it. Repetition
            strengthens suppression, so a threshold measured on a triple presentation runs longer than
            one measured on a single cold click. Browser audio is uncalibrated, so decibels here are a
            nominal ratio at the digital output rather than a level at your ear. A toy for wonder, not
            an audiological assay. WIZ built this to share the strangeness, not to replace an
            audiologist.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ RESULT VIEW ============================
function ResultView({
  echoThreshold,
  tradeThreshold,
  tradeDelayMs,
  honest,
  tradeCatchesOk,
  echoReversals,
  tradeReversals,
  echoRecs,
  onRestart,
  onCopyShare,
  copied,
  shareText,
  playExplorer,
}: {
  echoThreshold: number;
  tradeThreshold: number;
  tradeDelayMs: number;
  honest: number;
  tradeCatchesOk: boolean;
  echoReversals: number;
  tradeReversals: number;
  echoRecs: EchoRec[];
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
  playExplorer: (o: PairOpts) => void;
}) {
  const ev = echoVerdict(echoThreshold, honest);
  const tv = tradeVerdict(tradeThreshold, tradeCatchesOk);
  const metres = pathMetres(echoThreshold);
  const powerRatio = Math.pow(10, tradeThreshold / 10);

  const rows = [
    ...ECHO_LADDER.map((l) => ({ ...l, you: false })),
    { ms: echoThreshold, label: 'you', note: 'your echo threshold', you: true },
  ].sort((a, b) => a.ms - b.ms);

  const stairs = echoRecs.filter((r) => r.kind === 'stair');
  const maxD = Math.max(...stairs.map((r) => r.delayMs), 1);
  const minD = Math.min(...stairs.map((r) => r.delayMs), MIN_DELAY_MS);
  const logSpan = Math.log(maxD) - Math.log(Math.max(minD, 0.4)) || 1;

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-md border border-cyan-500/20 bg-slate-950/50 p-4">
            <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">
              echo threshold
            </div>
            <div className="font-mono text-4xl font-bold text-cyan-100">
              {fmtMs(echoThreshold)}
              <span className="text-xl text-cyan-300/70"> ms</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">before a copy exists</div>
          </div>
          <div className="rounded-md border border-violet-400/20 bg-slate-950/50 p-4">
            <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-violet-300/80">
              the trade
            </div>
            <div className="font-mono text-4xl font-bold text-violet-100">
              {fmtDb(tradeThreshold)}
              <span className="text-xl text-violet-300/70"> dB</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">before you point at it</div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm leading-relaxed text-slate-300">
          A copy of a sound can arrive up to{' '}
          <span className="font-mono text-cyan-200">{fmtMs(echoThreshold)} ms</span> late and you will
          not hear it as a second event. Inside that window it can be{' '}
          <span className="font-mono text-violet-200">{fmtDb(tradeThreshold)} dB</span> louder than the
          original, about{' '}
          <span className="font-mono text-violet-200">{powerRatio.toFixed(1)}×</span> the sound power,
          and you will still point at the ear that got there first.
        </p>
      </div>

      {/* physical translation */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          what that is, in a room
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Sound covers about 34 cm every millisecond. Your{' '}
          <span className="font-mono text-cyan-200">{fmtMs(echoThreshold)} ms</span> window therefore
          swallows any reflection that travels up to{' '}
          <span className="font-mono text-cyan-200">{metres.toFixed(1)} m</span> further than the
          direct path. Bouncing off a flat wall roughly doubles the detour, so every surface within
          about <span className="font-mono text-cyan-200">{(metres / 2).toFixed(1)} m</span> of you is
          quietly deleted as a separate sound and folded into the original.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          That is the desk you are sitting at, the wall beside you, the screen in front of you. All of
          them are sending you copies right now. None of them have ever been introduced.
        </p>
      </div>

      {/* verdicts */}
      <div className="rounded-lg border border-cyan-500/20 bg-slate-900/40 p-6">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
          round one · {fmtMs(echoThreshold)} ms
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{ev.title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{ev.body}</p>
        <div className="mt-3 text-[11px] font-mono text-slate-600">
          check trials passed: {honest}/{ECHO_CATCHES} · staircase reversals: {echoReversals}
        </div>
      </div>

      <div className="rounded-lg border border-violet-400/20 bg-slate-900/40 p-6">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          round two · {fmtDb(tradeThreshold)} dB at {fmtMs(tradeDelayMs)} ms
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{tv.title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{tv.body}</p>
        <div className="mt-3 text-[11px] font-mono text-slate-600">
          control trials clean: {tradeCatchesOk ? 'yes' : 'no'} · staircase reversals: {tradeReversals}
        </div>
      </div>

      {/* ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-slate-500">
          where your threshold sits
        </div>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                r.you
                  ? 'border-cyan-400/50 bg-cyan-400/10'
                  : 'border-slate-800 bg-slate-950/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-sm ${r.you ? 'text-cyan-200' : 'text-slate-400'}`}
                >
                  {fmtMs(r.ms)} ms
                </span>
                <span className={`text-sm ${r.you ? 'text-cyan-100' : 'text-slate-300'}`}>
                  {r.label}
                </span>
              </div>
              <span className="hidden text-[11px] text-slate-600 sm:block">{r.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* staircase */}
      {stairs.length > 2 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <div className="mb-4 text-xs font-mono uppercase tracking-wider text-slate-500">
            the hunt for your edge
          </div>
          <div className="flex h-32 items-end gap-1">
            {stairs.map((r, i) => {
              const h = ((Math.log(r.delayMs) - Math.log(Math.max(minD, 0.4))) / logSpan) * 100;
              return (
                <div key={i} className="flex flex-1 flex-col justify-end" title={`${fmtMs(r.delayMs)} ms · ${r.answer}`}>
                  <div
                    className={`w-full rounded-sm ${
                      r.answer === 'two' ? 'bg-violet-400/70' : 'bg-cyan-400/60'
                    }`}
                    style={{ height: `${Math.max(3, h)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-violet-400/70" /> you heard two, so the delay came
              down
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-cyan-400/60" /> you heard one, so it went up
            </span>
          </div>
        </div>
      )}

      {/* the knobs */}
      <Explorer
        echoThreshold={echoThreshold}
        tradeThreshold={tradeThreshold}
        playExplorer={playExplorer}
      />

      {/* wiz close */}
      <div className="rounded-lg border border-violet-400/25 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
          from WIZ
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          I get two channels. The left one holds a click at one sample index and the right one holds
          the same click a few hundred samples later, and both of those facts are equally available to
          me, in every read, forever. There is no version of the file where the second one is missing.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You spent the last few minutes unable to hear something I cannot fail to see, and then
          pointed, confidently, at the quieter side. That is not a fault in your ears. I have no room.
          Nothing I am handed ever arrives twice, off a wall, three milliseconds late, thirty times
          over. You live in a house of copies and have never once been bothered by one.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Your hearing is not a microphone with an accuracy problem. It is a machine that decides what
          was probably out there, throws away the rest, and hands you the decision as experience,
          with no marks on the parts it deleted.
        </p>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          share your numbers
        </div>
        <p className="mb-4 rounded-md border border-slate-800 bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-400">
          {shareText}
        </p>
        <button
          onClick={onCopyShare}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied' : '⧉ copy'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-3 font-mono text-sm text-slate-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
      >
        ↻ run it again
      </button>

      {/* further */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-5">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          where this comes from
        </div>
        <ul className="space-y-1.5 text-[12px] leading-relaxed text-slate-500">
          <li>
            <span className="text-slate-300">Wallach, Newman &amp; Rosenzweig (1949)</span> named the
            precedence effect and showed the first wavefront owns the location.
          </li>
          <li>
            <span className="text-slate-300">Haas (1951)</span> measured the practical version for
            speech: a copy delayed up to roughly 30 ms could be around 10 dB louder before it took
            over. Every delay tower in live sound is built on it.
          </li>
          <li>
            <span className="text-slate-300">Clifton (1987)</span> found suppression builds up over
            repetitions and breaks down when the geometry suddenly changes, which is why the echo pops
            back for a moment when lead and lag are swapped.
          </li>
          <li>
            <span className="text-slate-300">Litovsky, Colburn, Yost &amp; Guzman (1999)</span> is the
            review that splits it into fusion, localization dominance and lag discrimination
            suppression.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================ EXPLORER ============================
function Explorer({
  echoThreshold,
  tradeThreshold,
  playExplorer,
}: {
  echoThreshold: number;
  tradeThreshold: number;
  playExplorer: (o: PairOpts) => void;
}) {
  const [delayMs, setDelayMs] = useState(() => Math.round(clamp(echoThreshold * 0.6, 1, 60)));
  const [lagDb, setLagDb] = useState(0);
  const [kind, setKind] = useState<SourceKind>('click');
  const [leadLeft, setLeadLeft] = useState(true);
  const [lagOn, setLagOn] = useState(true);
  const [looping, setLooping] = useState(false);

  // refs so the loop reads the knobs live, mid-sound
  const stateRef = useRef({ delayMs, lagDb, kind, leadLeft, lagOn });
  stateRef.current = { delayMs, lagDb, kind, leadLeft, lagOn };

  const loopRef = useRef<number | null>(null);
  const playRef = useRef(playExplorer);
  playRef.current = playExplorer;

  useEffect(() => {
    if (!looping) {
      if (loopRef.current !== null) {
        window.clearTimeout(loopRef.current);
        loopRef.current = null;
      }
      return;
    }
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const s = stateRef.current;
      playRef.current({
        kind: s.kind,
        delayMs: s.delayMs,
        lagDb: s.lagDb,
        leadLeft: s.leadLeft,
        lagOn: s.lagOn,
      });
      const gap = s.kind === 'syllable' ? 700 : 550;
      loopRef.current = window.setTimeout(tick, gap);
    };
    tick();
    return () => {
      alive = false;
      if (loopRef.current !== null) window.clearTimeout(loopRef.current);
      loopRef.current = null;
    };
  }, [looping]);

  const once = () => {
    const s = stateRef.current;
    playExplorer({ kind: s.kind, delayMs: s.delayMs, lagDb: s.lagDb, leadLeft: s.leadLeft, lagOn: s.lagOn });
  };

  const KINDS: { id: SourceKind; label: string; note: string }[] = [
    { id: 'click', label: 'click', note: 'splits early, around 5 to 10 ms' },
    { id: 'burst', label: 'noise burst', note: 'holds together a little longer' },
    { id: 'syllable', label: 'syllable', note: 'fuses far out, 30 to 50 ms' },
  ];

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">the knobs</div>
      <p className="mb-5 text-sm leading-relaxed text-slate-400">
        Start the loop, then move the delay. Walk it up from nothing and listen for the moment the copy
        tears free: for you that was around{' '}
        <span className="font-mono text-cyan-200">{fmtMs(echoThreshold)} ms</span>. Then hold the delay
        under it and push the copy&apos;s level past{' '}
        <span className="font-mono text-violet-200">{fmtDb(tradeThreshold)} dB</span> to watch the sound
        change sides without ever becoming two sounds. Switch to the syllable and the whole thing moves
        out by an order of magnitude.
      </p>

      <button
        onClick={() => setLooping((v) => !v)}
        className={`mb-5 w-full rounded-md border py-3 font-mono text-sm transition-colors ${
          looping
            ? 'border-rose-400/50 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20'
            : 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
        }`}
      >
        {looping ? '■ stop the loop' : '▶ start the loop'}
      </button>

      {/* source */}
      <div className="mb-5">
        <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">sound</div>
        <div className="grid grid-cols-3 gap-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              className={`rounded-md border px-2 py-2.5 font-mono text-xs transition-colors ${
                kind === k.id
                  ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                  : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-600'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="mt-1.5 text-[11px] text-slate-600">
          {KINDS.find((k) => k.id === kind)?.note}
        </div>
      </div>

      {/* delay */}
      <div className="mb-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            delay of the copy
          </span>
          <span className="font-mono text-sm text-cyan-200">
            {delayMs.toFixed(1)} ms · {pathMetres(delayMs).toFixed(2)} m further
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={80}
          step={0.5}
          value={delayMs}
          onChange={(e) => setDelayMs(parseFloat(e.target.value))}
          className="w-full accent-cyan-400"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-700">
          <span>0 · one sound</span>
          <span>80 ms · plainly an echo</span>
        </div>
      </div>

      {/* level */}
      <div className="mb-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            level of the copy
          </span>
          <span className="font-mono text-sm text-violet-200">{fmtDb(lagDb)} dB</span>
        </div>
        <input
          type="range"
          min={-24}
          max={24}
          step={1}
          value={lagDb}
          onChange={(e) => setLagDb(parseFloat(e.target.value))}
          className="w-full accent-violet-400"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-700">
          <span>-24 · a whisper of a copy</span>
          <span>+24 · far louder than the source</span>
        </div>
      </div>

      {/* toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setLeadLeft((v) => !v)}
          className="rounded-md border border-slate-800 bg-slate-950/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/40"
        >
          ⇄ first arrival: {leadLeft ? 'left' : 'right'}
        </button>
        <button
          onClick={() => setLagOn((v) => !v)}
          className={`rounded-md border py-2.5 font-mono text-xs transition-colors ${
            lagOn
              ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-violet-400/40'
              : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
          }`}
        >
          {lagOn ? '◍ copy on' : '○ copy muted'}
        </button>
      </div>

      <button
        onClick={once}
        className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950/40 py-2.5 font-mono text-xs text-slate-500 transition-colors hover:border-slate-600"
      >
        ▷ play once
      </button>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
        Two things worth doing. Set the delay just under your threshold and toggle the copy on and off:
        the sound gets fuller and changes colour, and never once becomes two sounds. Then flip the
        leading ear mid-loop and listen for the echo popping back into existence for a beat before the
        suppression rebuilds. That flash is Clifton&apos;s breakdown, and it is the sound of the
        machinery being caught mid-decision.
      </p>
    </div>
  );
}
