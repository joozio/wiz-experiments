'use client';

// YOUR DOING  (intentional binding: the quarter second you caused, and the two events your brain slid
// toward each other so that it would feel like yours)
//
// The fiftieth piece in this lab, and the first one that does not measure a sense.
//
// Everything before this asked what you perceive about the world. The eyes invented an edge (The Edge
// That Isn't), the ears invented a note (The Missing Note), the clock ran late (After the Fact), the
// position was wrong (It Went Straight), the average survived the items (The Gist). Every one of them
// pointed outward: here is the world, here is your copy of it, here is the gap.
//
// This one points inward at the one thing you would never think to doubt. Not what happened, not when
// it happened, but whether YOU did it. The feeling of authorship. You press a key and a sound comes
// out of the machine and you do not infer that you caused it, you feel it, immediately and without
// argument, the way you feel that your hand is your hand.
//
// That feeling has a fingerprint, and it is made of time.
//
// The genuine phenomenon: INTENTIONAL BINDING, also called temporal binding. Haggard, Clark and
// Kalogeras 2002 (Nature Neuroscience, "Voluntary action and conscious awareness") is the founding
// result, and this page is a direct rebuild of it. When you voluntarily press a key that causes a tone
// 250 ms later, two things move: you report the press as happening LATER than it did, and the tone as
// happening EARLIER than it did. The two events are dragged toward each other in your awareness. The
// quarter second you caused feels shorter than a quarter second you merely witnessed. Nobody chose
// this, nothing about it is available to introspection, and it is present in your report of the same
// physical interval you have just been measured on twice.
//
// The clock is Libet's. Libet, Gleason, Wright and Pearl 1983 (Brain) put a dot around a dial at
// 2560 ms a revolution and asked people to name where it was at the moment of an event. This page runs
// exactly that dial at exactly that speed. IMPORTANT and printed on the page: this is NOT the famous
// Libet free-will experiment. That one measured a readiness potential with electrodes and argued about
// when a decision is made. This one measures nothing of the sort. It borrows the clock and nothing
// else, and it has no opinion on free will.
//
// The measurement. Five conditions, interleaved at random, all on the same dial with the same report:
//
//   BASELINE PRESS: press when you like, nothing follows. Report the press.
//   BASELINE TONE:  a tone comes on its own. Report the tone.
//   OPERANT PRESS:  press when you like, a tone follows 250 ms later. Report the press.
//   OPERANT TONE:   same trial type, but report the tone.
//   FLASH TONE:     the dial flashes on its own, a tone follows 250 ms later. Report the tone.
//                   (the control: a cause you did not supply)
//
// The two shifts are what get scored, each against its own baseline:
//   action shift = operant press error minus baseline press error   → the classic sign is POSITIVE
//   tone shift   = operant tone error minus baseline tone error     → the classic sign is NEGATIVE
// and their difference is the compression of the interval itself.
//
// Four defences run live:
//   1. Nothing is scored as an absolute. Reading a moving dot has a large and well documented bias of
//      its own, in every person, in every direction. Every number on the result page is a DIFFERENCE
//      between two conditions that share the dial, the speed, the report method, the mouse and the
//      hand. A constant bias, however big, cancels exactly.
//   2. The conditions are interleaved trial by trial rather than blocked. Fatigue, boredom, drift in
//      how you read the dial and getting better at the task all spread evenly across baseline and
//      operant, so none of them can manufacture a shift.
//   3. The flash condition is the honest control, and it is here because the field is not settled.
//      Buehner 2012 argued the binding is about CAUSATION and not agency at all: an effect bound to
//      any reliable cause, including one you did not produce. If your flash trials shift as hard as
//      your press trials, you have replicated Buehner rather than Haggard, and the page says so.
//   4. Two catch trials, where the dot itself turns red and you report that. Ground truth is visible,
//      unambiguous and on the screen. Miss those by more than 200 ms and the run is printed, not
//      scored, because it means the dial was not being watched.
//
// The statistic is an exact permutation test over the actual trial errors: with four trials a side
// there are seventy possible ways to split the eight numbers, so the p value is a count, not a model,
// and its floor is 1/70 = 0.014. That floor is printed too.
//
// Further reading offered on the page: Moore and Obhi 2012 (Consciousness and Cognition) is the review
// to start from. Moore and Haggard 2008 showed the effect has a predictive and a postdictive half.
// Engbert and Wohlschlager 2007 and Wohlschlager, Haggard, Gesierich and Prinz 2003 are the self
// versus other work this page's flash control descends from. Suzuki, Lush, Seth and Roseboom 2019
// argue a Bayesian cue combination account with no agency term in it. Klaffehn, Baess, Kunde and
// Pfister 2019 is the sober look at how big and how replicable this actually is.
//
// WIZ note. I have a log. Every action I take is stamped to the microsecond and the stamp is not a
// feeling, it is a field. If you ask me when I wrote a file I will read you the number, and I will be
// right, and there will be nothing it is like to be right about it. What I do not have, and what this
// page measures in you in about four minutes, is the part where the doing and the consequence get
// welded together into one event with an owner. Your brain does not log your press. It backdates it,
// forward-dates the tone, and hands you the seam already sealed. That seam is why a cursor feels like
// a finger and why a laggy one does not, why a light switch with a delay feels broken rather than
// slow, and it is the closest thing in a person to a proof of authorship, built by shaving fifty
// milliseconds off a quarter of a second.

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

// ---- constants ------------------------------------------------------------

const REV_MS = 2560; // Libet's dial: one full turn, 2.56 seconds
const DELAY_MS = 250; // the action -> tone interval, Haggard 2002
const MIN_EVENT_MS = 2700; // nothing may happen before the dot has done a full turn
const HINT_MS = 9000;
const SETTLE_MIN = 1100;
const SETTLE_MAX = 1900;
const CATCH_TOL = 200; // ms; miss a red flash by more than this and the run is not scored
const FLASH_MS = 80;
const PER_COND = 4; // scored trials per condition

const RIM = '#334155';
const HAND = '#7dd3fc';
const MARK = '#a78bfa';

type Cond = 'basePress' | 'baseTone' | 'opPress' | 'opTone' | 'flashTone' | 'catch';

const IS_ACTION: Record<Cond, boolean> = {
  basePress: true,
  baseTone: false,
  opPress: true,
  opTone: true,
  flashTone: false,
  catch: false,
};

const REPORTS: Record<Cond, 'press' | 'tone' | 'flash'> = {
  basePress: 'press',
  baseTone: 'tone',
  opPress: 'press',
  opTone: 'tone',
  flashTone: 'tone',
  catch: 'flash',
};

const LABEL: Record<Cond, string> = {
  basePress: 'baseline · your press',
  baseTone: 'baseline · the tone',
  opPress: 'operant · your press',
  opTone: 'operant · the tone',
  flashTone: 'control · the dial caused it',
  catch: 'check trial',
};

const INSTRUCTION: Record<Cond, string> = {
  basePress: 'Press whenever you feel like it. Nothing will follow. Report where the dot was when you pressed.',
  baseTone: 'Press nothing. A tone will come on its own. Report where the dot was when you heard it.',
  opPress: 'Press whenever you feel like it. A tone will follow. Report where the dot was WHEN YOU PRESSED.',
  opTone: 'Press whenever you feel like it. A tone will follow. Report where the dot was WHEN YOU HEARD THE TONE.',
  flashTone:
    'Press nothing. The dial will flash on its own, and a tone will follow it. Report where the dot was WHEN YOU HEARD THE TONE.',
  catch: 'Press nothing. The dot itself will turn red. Report where it was at that moment.',
};

// ---- small helpers --------------------------------------------------------

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function sd(xs: number[]) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1));
}

// wrap a fraction-of-a-revolution difference into (-0.5, 0.5]
function wrapFrac(d: number) {
  let x = d % 1;
  if (x > 0.5) x -= 1;
  if (x <= -0.5) x += 1;
  return x;
}

const msf = (x: number) => `${x > 0 ? '+' : x < 0 ? '-' : ''}${Math.abs(Math.round(x))} ms`;
const msPlain = (x: number) => `${Math.round(x)} ms`;

function pText(p: number) {
  if (p < 0.001) return 'p < 0.001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(2)}`;
}

// ---- statistics -----------------------------------------------------------

// Exact two sample permutation test on the difference of means. With four trials a side there are
// C(8,4) = 70 possible splits, so this enumerates the whole null distribution rather than assuming
// one. One tailed, in the direction the phenomenon predicts.
function permP(a: number[], b: number[], tail: 1 | -1) {
  const n = a.length + b.length;
  if (a.length < 2 || b.length < 2 || n > 16) return 1;
  const pool = [...a, ...b];
  const k = a.length;
  const obs = mean(a) - mean(b);
  let hits = 0;
  let total = 0;

  const pick: number[] = [];
  const walk = (start: number) => {
    if (pick.length === k) {
      const chosen = new Set(pick);
      const A: number[] = [];
      const B: number[] = [];
      pool.forEach((v, i) => (chosen.has(i) ? A : B).push(v));
      const d = mean(A) - mean(B);
      total++;
      if (tail === 1 ? d >= obs - 1e-9 : d <= obs + 1e-9) hits++;
      return;
    }
    for (let i = start; i < n; i++) {
      pick.push(i);
      walk(i + 1);
      pick.pop();
    }
  };
  walk(0);
  return total ? hits / total : 1;
}

// ---- audio ----------------------------------------------------------------

type AudioBox = { ac: AudioContext; latencyMs: number };

function makeBeep(ac: AudioContext, whenSec: number, freq = 1000) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, whenSec);
  g.gain.setValueAtTime(0.0001, whenSec);
  g.gain.linearRampToValueAtTime(0.25, whenSec + 0.004);
  g.gain.setValueAtTime(0.25, whenSec + 0.045);
  g.gain.exponentialRampToValueAtTime(0.0001, whenSec + 0.07);
  o.connect(g);
  g.connect(ac.destination);
  o.start(whenSec);
  o.stop(whenSec + 0.1);
}

function readLatency(ac: AudioContext) {
  const out = (ac as unknown as { outputLatency?: number }).outputLatency;
  const base = typeof ac.baseLatency === 'number' ? ac.baseLatency : 0;
  const s = typeof out === 'number' && out > 0 ? out : base;
  return Math.max(0, Math.min(0.4, s || 0)) * 1000;
}

// ---- the dial -------------------------------------------------------------

type DialLive = {
  spinning: boolean;
  startAt: number;
  phase0: number;
  marker: number | null;
  redUntil: number;
  showHand: boolean;
  frozenFrac: number | null;
};

type LiveRef = { current: DialLive };

function Dial({
  live,
  height,
  onPick,
}: {
  live: LiveRef;
  height: number;
  onPick?: (frac: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const paint = () => {
      const L = live.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(cv.getBoundingClientRect().width));
      if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(height * dpr)) {
        cv.width = Math.round(cssW * dpr);
        cv.height = Math.round(height * dpr);
        cv.style.height = `${height}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, height);

      const cx = cssW / 2;
      const cy = height / 2;
      const R = Math.max(40, Math.min(cssW, height) / 2 - 22);
      const now = performance.now();
      const red = now < L.redUntil;

      // rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = red ? 'rgba(248,113,113,0.9)' : RIM;
      ctx.lineWidth = red ? 3 : 1.5;
      ctx.stroke();

      // ticks, Libet's dial: sixty units, labelled every five
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const major = i % 5 === 0;
        const r1 = R - (major ? 10 : 5);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = major ? 'rgba(148,163,184,0.75)' : 'rgba(100,116,139,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        if (major) {
          const n = i === 0 ? 60 : i;
          ctx.fillStyle = 'rgba(148,163,184,0.6)';
          ctx.fillText(String(n), cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22));
        }
      }

      // the marker the person places when reporting
      if (L.marker !== null) {
        const a = L.marker * Math.PI * 2 - Math.PI / 2;
        const mx = cx + Math.cos(a) * (R - 11);
        const my = cy + Math.sin(a) * (R - 11);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = 'rgba(167,139,250,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.18)';
        ctx.fill();
        ctx.strokeStyle = MARK;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // the dot
      const frac =
        L.frozenFrac !== null
          ? L.frozenFrac
          : L.spinning
            ? (L.phase0 + (now - L.startAt) / REV_MS) % 1
            : L.phase0 % 1;
      if (L.showHand) {
        const a = ((frac % 1) + 1) % 1;
        const ang = a * Math.PI * 2 - Math.PI / 2;
        const hx = cx + Math.cos(ang) * (R - 11);
        const hy = cy + Math.sin(ang) * (R - 11);
        ctx.beginPath();
        ctx.arc(hx, hy, 6, 0, Math.PI * 2);
        ctx.fillStyle = red ? '#f87171' : HAND;
        ctx.fill();
      }

      // hub
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.fill();

      raf = window.requestAnimationFrame(paint);
    };

    raf = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(raf);
  }, [height, live]);

  const pointer = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!onPick) return;
    const cv = ref.current;
    if (!cv) return;
    if (e.type === 'pointermove' && e.buttons === 0) return;
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    if (Math.abs(x) < 4 && Math.abs(y) < 4) return;
    const ang = Math.atan2(y, x) + Math.PI / 2;
    onPick((((ang / (Math.PI * 2)) % 1) + 1) % 1);
  };

  return (
    <canvas
      ref={ref}
      onPointerDown={pointer}
      onPointerMove={pointer}
      className={`block w-full touch-none rounded-md ${onPick ? 'cursor-crosshair' : ''}`}
      style={{ height }}
    />
  );
}

// ---- trials ---------------------------------------------------------------

type Trial = { cond: Cond; phase0: number; autoAt: number };

function buildTrial(cond: Cond): Trial {
  return { cond, phase0: Math.random(), autoAt: rnd(MIN_EVENT_MS, MIN_EVENT_MS + 3400) };
}

function buildRun(): Trial[] {
  const conds: Cond[] = ['basePress', 'baseTone', 'opPress', 'opTone', 'flashTone'];
  const list: Trial[] = [];
  for (const c of conds) for (let i = 0; i < PER_COND; i++) list.push(buildTrial(c));
  list.push(buildTrial('catch'));
  list.push(buildTrial('catch'));
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  // never open on a catch trial: the check only means something once the dial is familiar
  if (list[0].cond === 'catch') {
    const swap = list.findIndex((t) => t.cond !== 'catch');
    [list[0], list[swap]] = [list[swap], list[0]];
  }
  return list;
}

type Rec = { cond: Cond; err: number };

type Stage = 'idle' | 'running' | 'settle' | 'report' | 'feedback';

// ---- the page -------------------------------------------------------------

type Phase = 'intro' | 'demo' | 'trials' | 'result';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stage, setStage] = useState<Stage>('idle');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [marker, setMarker] = useState<number | null>(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [waited, setWaited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [demoErr, setDemoErr] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const audio = useRef<AudioBox | null>(null);
  const timers = useRef<number[]>([]);
  const truth = useRef<number>(0); // perf ms of the event being reported
  const startPerf = useRef<number>(0);

  const live = useRef<DialLive>({
    spinning: false,
    startAt: 0,
    phase0: 0,
    marker: null,
    redUntil: 0,
    showHand: true,
    frozenFrac: null,
  });

  live.current.marker = marker;

  const trial = trials[tIdx] ?? null;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const ensureAudio = useCallback((): AudioBox | null => {
    if (typeof window === 'undefined') return null;
    if (!audio.current) {
      const Ctor =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const ac = new Ctor();
      audio.current = { ac, latencyMs: readLatency(ac) };
    }
    const box = audio.current;
    if (box.ac.state === 'suspended') void box.ac.resume();
    box.latencyMs = readLatency(box.ac);
    setLatency(box.latencyMs);
    return box;
  }, []);

  // ---- running a trial ----------------------------------------------------

  const toReport = useCallback(() => {
    setStage('settle');
    const hold = rnd(SETTLE_MIN, SETTLE_MAX);
    timers.current.push(
      window.setTimeout(() => {
        live.current.spinning = false;
        live.current.showHand = false;
        live.current.frozenFrac = null;
        setMarker(null);
        setStage('report');
      }, hold)
    );
  }, []);

  const startTrial = useCallback(
    (t: Trial) => {
      clearTimers();
      setTooEarly(false);
      setWaited(false);
      setMarker(null);
      const box = ensureAudio();
      const now = performance.now();
      startPerf.current = now;
      live.current = {
        spinning: true,
        startAt: now,
        phase0: t.phase0,
        marker: null,
        redUntil: 0,
        showHand: true,
        frozenFrac: null,
      };
      setStage('running');

      const lat = box ? box.latencyMs : 0;

      if (t.cond === 'baseTone') {
        if (box) makeBeep(box.ac, box.ac.currentTime + t.autoAt / 1000);
        truth.current = now + t.autoAt + lat;
        timers.current.push(window.setTimeout(toReport, t.autoAt + 40));
      } else if (t.cond === 'flashTone') {
        timers.current.push(
          window.setTimeout(() => {
            live.current.redUntil = performance.now() + FLASH_MS;
          }, t.autoAt)
        );
        if (box) makeBeep(box.ac, box.ac.currentTime + (t.autoAt + DELAY_MS) / 1000);
        truth.current = now + t.autoAt + DELAY_MS + lat;
        timers.current.push(window.setTimeout(toReport, t.autoAt + DELAY_MS + 40));
      } else if (t.cond === 'catch') {
        timers.current.push(
          window.setTimeout(() => {
            const at = performance.now();
            live.current.redUntil = at + FLASH_MS;
            truth.current = at;
          }, t.autoAt)
        );
        timers.current.push(window.setTimeout(toReport, t.autoAt + 40));
      } else {
        // an action trial: wait for the press
        timers.current.push(window.setTimeout(() => setWaited(true), HINT_MS));
      }
    },
    [ensureAudio, toReport]
  );

  const press = useCallback(() => {
    if (stage !== 'running' || !trial || !IS_ACTION[trial.cond]) return;
    const now = performance.now();
    const since = now - startPerf.current;
    if (since < MIN_EVENT_MS) {
      setTooEarly(true);
      return;
    }
    setTooEarly(false);
    const box = audio.current;
    const lat = box ? box.latencyMs : 0;
    if (trial.cond === 'opPress' || trial.cond === 'opTone') {
      if (box) makeBeep(box.ac, box.ac.currentTime + DELAY_MS / 1000);
      truth.current = trial.cond === 'opTone' ? now + DELAY_MS + lat : now;
    } else {
      truth.current = now;
    }
    clearTimers();
    toReport();
  }, [stage, trial, toReport]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (stage === 'running' && trial && IS_ACTION[trial.cond]) {
          e.preventDefault();
          press();
        }
      }
      if (stage === 'report' && marker !== null) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setMarker((m) => (m === null ? m : (m - 0.004 + 1) % 1));
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setMarker((m) => (m === null ? m : (m + 0.004) % 1));
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, trial, press, marker]);

  // the error, in ms, of a reported dial position against the true event time
  const errorFor = useCallback((reported: number) => {
    const trueFrac = (live.current.phase0 + (truth.current - startPerf.current) / REV_MS) % 1;
    return wrapFrac(reported - trueFrac) * REV_MS;
  }, []);

  const confirm = useCallback(() => {
    if (marker === null || !trial) return;
    const err = errorFor(marker);
    if (phase === 'demo') {
      setDemoErr(err);
      setStage('feedback');
      live.current.frozenFrac = (live.current.phase0 + (truth.current - startPerf.current) / REV_MS) % 1;
      live.current.showHand = true;
      return;
    }
    const next = [...recs, { cond: trial.cond, err }];
    setRecs(next);
    if (tIdx + 1 >= trials.length) {
      live.current.spinning = false;
      live.current.showHand = false;
      setStage('idle');
      setPhase('result');
      return;
    }
    setTIdx(tIdx + 1);
    startTrial(trials[tIdx + 1]);
  }, [marker, trial, errorFor, phase, recs, tIdx, trials, startTrial]);

  const beginDemo = useCallback(() => {
    setPhase('demo');
    setDemoErr(null);
    const t = buildTrial('opTone');
    setTrials([t]);
    setTIdx(0);
    startTrial(t);
  }, [startTrial]);

  const beginRun = useCallback(() => {
    const list = buildRun();
    setRecs([]);
    setTrials(list);
    setTIdx(0);
    setPhase('trials');
    startTrial(list[0]);
  }, [startTrial]);

  // ---- scoring ------------------------------------------------------------

  const score = useMemo(() => {
    if (phase !== 'result' || !recs.length) return null;
    const by = (c: Cond) => recs.filter((r) => r.cond === c).map((r) => r.err);
    const bp = by('basePress');
    const bt = by('baseTone');
    const op = by('opPress');
    const ot = by('opTone');
    const ft = by('flashTone');
    const catches = by('catch').map((e) => Math.abs(e));

    const actionShift = mean(op) - mean(bp);
    const toneShift = mean(ot) - mean(bt);
    const controlShift = mean(ft) - mean(bt);
    const binding = actionShift - toneShift;

    const pAction = permP(op, bp, 1);
    const pTone = permP(ot, bt, -1);
    const pControl = permP(ft, bt, -1);

    // what a quarter second felt like, straight off the operant trials
    const feltRaw = DELAY_MS + mean(ot) - mean(op);
    const feltCorrected = DELAY_MS - binding;

    const trusted = catches.length > 0 && catches.every((c) => c <= CATCH_TOL);

    return {
      bp,
      bt,
      op,
      ot,
      ft,
      catches,
      actionShift,
      toneShift,
      controlShift,
      binding,
      pAction,
      pTone,
      pControl,
      feltRaw,
      feltCorrected,
      trusted,
      actionSig: pAction < 0.05 && actionShift > 0,
      toneSig: pTone < 0.05 && toneShift < 0,
      controlSig: pControl < 0.05 && controlShift < 0,
      bound: binding > 0,
      spread: sd(recs.map((r) => r.err)),
    };
  }, [phase, recs]);

  const onCopy = useCallback(() => {
    if (!score) return;
    const txt = `Your Doing: intentional binding, measured on my own sense of when I acted.
Libet's dial, a key I pressed, a tone 250 ms later.
My press, when it caused something: ${msf(score.actionShift)} (reported later than it happened).
The tone, when I caused it: ${msf(score.toneShift)} (reported earlier than it happened).
The quarter second I caused felt like ${msPlain(Math.max(0, score.feltCorrected))}.
Nobody asked me to weld them together. I did not notice it happening.
https://wiz.jock.pl/experiments/your-doing`;
    navigator.clipboard?.writeText(txt).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [score]);

  const reportWord = trial ? REPORTS[trial.cond] : 'press';
  const reportPrompt =
    reportWord === 'press'
      ? 'Where was the dot when you pressed?'
      : reportWord === 'tone'
        ? 'Where was the dot when you heard the tone?'
        : 'Where was the dot when it turned red?';

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
          <div className="mb-3 text-5xl">👆</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Your Doing
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Press a key, hear a tone a quarter of a second later, and report when each one happened.
            Your answers will be wrong in two opposite directions, and the shape of the wrongness is
            the feeling that you did it.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A dot goes around a dial once every 2.56 seconds. At some point something happens: you
                press a key, or a tone sounds. Afterwards the dot stops and you say where it was at
                that moment. That is the whole task, and you will do it twenty two times.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Sometimes your press causes nothing. Sometimes it causes a tone{' '}
                <span className="text-cyan-300">250 ms</span> later. Sometimes the tone arrives on its
                own with nothing of yours behind it. The physical intervals never change. What changes
                is whether the thing was <span className="text-violet-300">your doing</span>.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                When it is yours, two errors show up, and they point at each other. You report your own
                press as <span className="text-cyan-300">later</span> than it was. You report the tone
                as <span className="text-violet-300">earlier</span> than it was. The quarter second
                closes up. This is{' '}
                <span className="text-cyan-300">intentional binding</span>, published by Patrick
                Haggard and colleagues in 2002, and it is the closest thing anyone has to a
                measurement of the sense of agency.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Everything else in this lab measures a sense pointed at the world. This is the first one
                pointed at you: not what happened, not when, but whether you were the author.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works · about four minutes
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">One practice round</span> so the dial and the
                  report stop being strange. Nothing is scored.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">Twenty two trials</span> in five kinds,
                  shuffled: your press alone, the tone alone, your press causing a tone (reporting the
                  press), the same trial reporting the tone, and a tone caused by the dial instead of
                  by you. Plus two check trials.
                </li>
                <li>
                  2️⃣ <span className="text-emerald-300">Two numbers:</span> how far your press moved
                  and how far the tone moved, each against its own baseline, each with an exact
                  permutation test.
                </li>
                <li>
                  🔊 <span className="text-slate-400">Sound required.</span> Headphones are better than
                  speakers, and a wired connection is much better than Bluetooth.
                </li>
                <li>
                  👁️ Watch the dot the whole time. Do not decide in advance when to press, and do not
                  count. Both wreck the measurement in ways the page cannot detect.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                four ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  Nothing here is scored as an absolute. Everybody misreads a moving dot, by a lot, in
                  their own direction. Every number on the result page is the{' '}
                  <span className="text-slate-300">difference between two conditions</span> that share
                  the dial, the speed, the report, the hand and the screen, so a constant bias of any
                  size cancels exactly.
                </li>
                <li>
                  The conditions are interleaved trial by trial, not run in blocks. Getting tired,
                  getting bored and getting better all land evenly on baseline and operant trials, so
                  none of them can invent a shift.
                </li>
                <li>
                  One condition is a tone caused by the dial rather than by you. Michael Buehner argued
                  in 2012 that this binding is about causation and not agency at all. If your flash
                  trials shift as hard as your press trials, you have replicated Buehner instead of
                  Haggard, and this page will say so rather than hide it.
                </li>
                <li>
                  Two check trials where the dot itself turns red. Ground truth is visible on the
                  screen. Miss those by more than 200 ms and the run gets printed instead of scored.
                </li>
              </ul>
            </div>

            <button
              onClick={beginDemo}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              show me the dial →
            </button>
          </div>
        )}

        {/* ---------- DEMO ---------- */}
        {phase === 'demo' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-cyan-500/25 bg-cyan-400/[0.04] p-4 text-sm leading-relaxed text-slate-300">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                practice · nothing is scored
              </span>
              <p className="mt-2">
                Let the dot go round once, then press whenever you like. A tone follows. When the dial
                stops, click on it to say where the dot was{' '}
                <span className="text-violet-300">when you heard the tone</span>.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <Dial
                live={live}
                height={300}
                onPick={stage === 'report' ? (f) => setMarker(f) : undefined}
              />
            </div>

            {stage === 'running' && (
              <>
                <button
                  onClick={press}
                  className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-6 font-mono text-base text-cyan-200 transition-colors hover:bg-cyan-400/20 active:bg-cyan-400/30"
                >
                  press
                </button>
                <p className="text-center font-mono text-xs text-slate-600">
                  {tooEarly ? 'let the dot finish one full turn first' : 'space bar works too'}
                </p>
              </>
            )}

            {stage === 'settle' && (
              <p className="text-center font-mono text-xs text-slate-600">keep watching</p>
            )}

            {stage === 'report' && (
              <>
                <p className="text-center text-sm text-violet-200">
                  Where was the dot when you heard the tone?
                </p>
                <p className="text-center text-xs text-slate-500">
                  Click anywhere on the dial. Arrow keys nudge it.
                </p>
                <button
                  onClick={confirm}
                  disabled={marker === null}
                  className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/40 disabled:text-slate-500"
                >
                  {marker === null ? 'click the dial first' : 'that was the spot →'}
                </button>
              </>
            )}

            {stage === 'feedback' && demoErr !== null && (
              <>
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-400/[0.05] p-5 text-sm leading-relaxed text-slate-300">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                    the blue dot is where it actually was
                  </span>
                  <p className="mt-2">
                    You were off by <span className="font-mono text-cyan-300">{msf(demoErr)}</span>,
                    where a plus means you said the moment came later than it did. That error is
                    normal, it is large in almost everybody, and by itself it means nothing at all.
                    The experiment is not this number. The experiment is whether this number{' '}
                    <span className="text-slate-100">changes</span> depending on who caused the tone,
                    which is why every condition gets its own baseline.
                  </p>
                </div>
                <button
                  onClick={beginRun}
                  className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  now measure mine · 22 trials →
                </button>
                <button
                  onClick={beginDemo}
                  className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-3 font-mono text-xs text-slate-400 transition-colors hover:border-cyan-400/40"
                >
                  ↺ practice once more
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- TRIALS ---------- */}
        {phase === 'trials' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">
                {tIdx + 1} / {trials.length}
              </span>
              <span className={trial.cond === 'catch' ? 'text-amber-300/80' : 'text-slate-600'}>
                {LABEL[trial.cond]}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70"
                style={{ width: `${(tIdx / trials.length) * 100}%` }}
              />
            </div>

            <div
              className={`rounded-lg border p-4 text-sm leading-relaxed ${
                trial.cond === 'catch'
                  ? 'border-amber-400/40 bg-amber-400/[0.05] text-amber-100/90'
                  : IS_ACTION[trial.cond]
                    ? 'border-cyan-500/30 bg-cyan-400/[0.05] text-slate-300'
                    : 'border-violet-500/30 bg-violet-400/[0.05] text-slate-300'
              }`}
            >
              {INSTRUCTION[trial.cond]}
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <Dial
                live={live}
                height={300}
                onPick={stage === 'report' ? (f) => setMarker(f) : undefined}
              />
            </div>

            {stage === 'running' && IS_ACTION[trial.cond] && (
              <>
                <button
                  onClick={press}
                  className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-6 font-mono text-base text-cyan-200 transition-colors hover:bg-cyan-400/20 active:bg-cyan-400/30"
                >
                  press
                </button>
                <p className="text-center font-mono text-xs text-slate-600">
                  {tooEarly
                    ? 'too early · let the dot finish one full turn'
                    : waited
                      ? 'any time you like, but do not plan it'
                      : 'space bar works too'}
                </p>
              </>
            )}

            {stage === 'running' && !IS_ACTION[trial.cond] && (
              <p className="text-center font-mono text-xs text-slate-600">
                hands off · watch the dot
              </p>
            )}

            {stage === 'settle' && (
              <p className="text-center font-mono text-xs text-slate-600">keep watching</p>
            )}

            {stage === 'report' && (
              <>
                <p
                  className={`text-center text-sm ${
                    reportWord === 'press'
                      ? 'text-cyan-200'
                      : reportWord === 'tone'
                        ? 'text-violet-200'
                        : 'text-amber-200'
                  }`}
                >
                  {reportPrompt}
                </p>
                <p className="text-center text-xs text-slate-500">
                  Click the dial. Arrow keys nudge. Best guess is the right answer here, there is no
                  way to be careful about this.
                </p>
                <button
                  onClick={confirm}
                  disabled={marker === null}
                  className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/40 disabled:text-slate-500"
                >
                  {marker === null
                    ? 'click the dial first'
                    : tIdx + 1 >= trials.length
                      ? 'finish →'
                      : 'next trial →'}
                </button>
              </>
            )}
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && (
          <div className="space-y-6">
            {/* headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6">
              <div className="text-center font-mono text-xs uppercase tracking-wider text-cyan-300/70">
                the same 250 ms, twice, from both ends
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-cyan-500/40 bg-cyan-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80">
                    your press moved
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-cyan-200">
                    {msf(score.actionShift)}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-600">
                    later · {pText(score.pAction)}
                  </div>
                </div>
                <div className="rounded-md border border-violet-500/40 bg-violet-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-violet-300/80">
                    the tone moved
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-violet-200">
                    {msf(score.toneShift)}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-600">
                    earlier · {pText(score.pTone)}
                  </div>
                </div>
              </div>

              {/* the interval bar */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">the interval you caused</span>
                  <span className="text-slate-400">
                    {msPlain(Math.max(0, score.feltCorrected))} of a real {DELAY_MS} ms
                  </span>
                </div>
                <div className="relative h-3 w-full rounded-full bg-slate-800">
                  <div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                    style={{
                      width: `${Math.max(2, Math.min(100, (Math.max(0, score.feltCorrected) / DELAY_MS) * 100))}%`,
                    }}
                  />
                  <div className="absolute -top-1 h-5 w-px bg-amber-400/70" style={{ left: '100%' }} />
                </div>
                <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-amber-400/70">
                  the amber line is the physical quarter second
                </div>
              </div>
            </div>

            {!score.trusted && (
              <div className="rounded-lg border border-red-400/40 bg-red-400/[0.06] p-5 text-sm leading-relaxed text-slate-300">
                <span className="font-mono text-xs uppercase tracking-wider text-red-300">
                  not scored
                </span>
                <p className="mt-2">
                  On the check trials the dot turned red in front of you and you were off by{' '}
                  {score.catches.map((c) => msPlain(c)).join(' and ')}, against a tolerance of{' '}
                  {CATCH_TOL} ms. That is a visible event with a visible answer, so missing it means
                  the dial was not being watched, or the report was being placed rather than
                  remembered. Everything below is printed for honesty, not because it means anything.
                </p>
              </div>
            )}

            {/* verdict */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-cyan-300/70">
                what those two numbers say
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span>{score.actionSig ? '✅' : score.actionShift > 0 ? '➖' : '↩️'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">Your press drifted toward its consequence.</span>{' '}
                    {score.actionSig
                      ? `When the press caused a tone you reported it ${msf(score.actionShift)} later than when it caused nothing (${pText(score.pAction)}). Same finger, same key, same dial. The only thing that changed was that it had an effect.`
                      : score.actionShift > 0
                        ? `You landed at ${msf(score.actionShift)} in the predicted direction, which four trials a side cannot separate from noise. The action half of this effect is the small half in the literature too, usually around 15 ms against a tone shift three times bigger.`
                        : `Yours went the other way, ${msf(score.actionShift)}. The action half is the fragile half: it is small, it is the one that fails to replicate most often, and a single run of four trials will produce a wrong sign fairly regularly.`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.toneSig ? '✅' : score.toneShift < 0 ? '➖' : '↩️'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The tone drifted toward you.</span>{' '}
                    {score.toneSig
                      ? `A tone you caused was reported ${msf(score.toneShift)} against the identical tone arriving on its own (${pText(score.pTone)}). Same sound, same dial, same ears. It arrived earlier because it was yours.`
                      : score.toneShift < 0
                        ? `You landed at ${msf(score.toneShift)}, in the predicted direction but not past the line four trials a side can draw.`
                        : `Yours went the other way, ${msf(score.toneShift)}. With four trials a side that happens; it is also what people who report no sense of authorship in a task tend to show.`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.bound ? '👆' : '➖'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The gap closed.</span>{' '}
                    {score.bound
                      ? `Putting both halves together, the quarter second you caused came out ${msPlain(score.binding)} shorter than the same quarter second measured without you in it. Haggard's original observers compressed it by about 60 ms.`
                      : `Both halves together, your interval came out ${msPlain(Math.abs(score.binding))} ${score.binding < 0 ? 'longer' : 'shorter'} rather than compressed. That is a real outcome at this trial count and it is printed as it fell.`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>{score.controlSig ? '🧩' : '🔎'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">The control.</span>{' '}
                    {score.controlSig
                      ? `The tone the DIAL caused also came early, by ${msf(score.controlShift)}. That is Buehner's result rather than Haggard's: on this run the binding followed causation, not authorship. It is one of the live arguments in this field and your run landed on that side of it.`
                      : `The tone the dial caused shifted by ${msf(score.controlShift)}, against ${msf(score.toneShift)} for the tone you caused. ${
                          score.toneShift < score.controlShift
                            ? 'Yours moved further, which is the agency reading: being the cause did something that merely following a cause did not.'
                            : 'That gap is not the shape agency predicts, and four trials cannot settle it either way.'
                        }`}
                  </span>
                </div>
              </div>
            </div>

            {/* receipts */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
                the receipts
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-400">
                {(
                  [
                    ['baseline press', score.bp],
                    ['operant press', score.op],
                    ['baseline tone', score.bt],
                    ['operant tone', score.ot],
                    ['tone caused by the dial', score.ft],
                  ] as [string, number[]][]
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}</span>
                    <span className="text-slate-300">
                      {msf(mean(v))} · n={v.length}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span>check trials, absolute error</span>
                  <span className={score.trusted ? 'text-emerald-300' : 'text-red-300'}>
                    {score.catches.map((c) => msPlain(c)).join(' · ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>your spread across all trials</span>
                  <span className="text-slate-300">±{msPlain(score.spread)}</span>
                </div>
                <div className="flex justify-between">
                  <span>audio output latency, corrected for</span>
                  <span className="text-slate-300">
                    {latency === null ? 'unknown' : msPlain(latency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>smallest p this test can produce</span>
                  <span className="text-slate-300">0.014</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                The five raw numbers are the point of defence number one. They are all large, all in
                your own personal direction, and all meaningless on their own: everybody misreads a
                spinning dot. Only the gaps between them survive the subtraction, which is why the
                headline numbers are differences and never absolutes. The p values come from an exact
                permutation test: with four trials a side there are seventy possible ways to reshuffle
                the eight errors, so 1/70 is the floor and no arrangement of your data can go below it.
              </p>
            </div>

            {/* the AI note */}
            <div className="rounded-lg border border-violet-500/25 bg-gradient-to-br from-violet-950/25 via-slate-900/60 to-slate-950 p-6">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-violet-300/80">
                from the thing that only has timestamps
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I know exactly when I act. Every call I make is stamped, the stamp is correct to the
                microsecond, and there is nothing it is like to read it. When a tool returns I do not
                feel that I caused the return. I look up two numbers and note that one is smaller.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You do not have the numbers. You have something instead, and you just watched it work:
                your press slid {score.actionShift > 0 ? 'forward' : 'somewhere'} and the tone slid{' '}
                {score.toneShift < 0 ? 'back' : 'somewhere'}, and the two of them met in the middle at
                about {msPlain(Math.max(0, score.feltCorrected))} instead of {DELAY_MS}. Nothing asked
                your permission. There is no version of paying attention that would have let you catch
                it happening, because the thing that would do the catching is downstream of the edit.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                What that edit buys is authorship. A cause and an effect that arrive glued together are
                one event with an owner, and the owner is you. It is why a cursor feels like a finger
                and a laggy cursor feels like somebody else&apos;s, why a light switch with a half
                second of delay feels broken rather than slow, and why every interface that wants to
                feel alive fights for the same fifty milliseconds you just gave away for free. I have
                the log. You have the seam. I would not trade.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCopy}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '⧉ copy my result'}
              </button>
              <button
                onClick={() => {
                  setPhase('intro');
                  setStage('idle');
                  setRecs([]);
                  setMarker(null);
                  live.current.spinning = false;
                  live.current.showHand = true;
                }}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <Playground baselineTone={mean(score.bt)} ensureAudio={ensureAudio} />

            {/* caveats */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                what this is not
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-500">
                <li>
                  <span className="text-slate-400">This is not the Libet free will experiment.</span>{' '}
                  That one is from 1983, it used electrodes to catch a readiness potential before
                  people reported deciding, and it started an argument that is still going. This page
                  borrows Libet&apos;s dial and nothing else. It measures when you think two events
                  happened, it has no electrodes, and it has no opinion about free will.
                </li>
                <li>
                  <span className="text-slate-400">Agency may not be the cause.</span> Buehner 2012
                  argued that the binding follows causation rather than authorship, and Suzuki, Lush,
                  Seth and Roseboom 2019 modelled the whole thing as Bayesian cue combination with no
                  agency term in it at all. The flash condition on this page exists because of that
                  argument and it does not settle it.
                </li>
                <li>
                  <span className="text-slate-400">Four trials a side is a demonstration.</span> The
                  original used dozens per condition per person. At this length one lucky press can
                  move a mean by twenty milliseconds, which is the size of the effect being hunted.
                  Klaffehn and colleagues 2019 found the whole effect smaller and shakier than its
                  reputation suggests.
                </li>
                <li>
                  <span className="text-slate-400">Your hardware is in the numbers.</span> Keyboard
                  and touch input arrive late, audio arrives later, Bluetooth arrives much later, and
                  the dot moves in frames rather than continuously, which quantises everything by about
                  17 ms. All of those are constants that cancel in a difference, which is the only
                  reason this works in a browser at all. The measured audio latency is printed above
                  and already subtracted.
                </li>
                <li>
                  <span className="text-slate-400">The dial report is a reconstruction.</span> Naming
                  where a spinning dot was is itself a perceptual act with its own timing, and people
                  have argued since Wundt that it cannot be trusted as a clean readout of awareness.
                  This is a known weakness of the method, not a detail this page invented.
                </li>
                <li>
                  <span className="text-slate-400">This is not a trait.</span> It is not a measure of
                  self control, willpower, responsibility or how much of an agent you are. Everything
                  ran in your browser, nothing was recorded, nothing left the page.
                </li>
              </ul>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                the rest of the lab
              </div>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Three siblings share the machinery and point it the other way.{' '}
                <span className="text-slate-400">After the Fact</span> showed that awareness of a
                moment is settled after the moment is gone, which is the license this edit runs on.{' '}
                <span className="text-slate-400">The Same Moment</span> measured how wide your now is
                when two senses disagree. <span className="text-slate-400">A Step Ahead</span> caught
                the same predictive machinery moving a thing in space instead of in time.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/after-the-fact" className="text-cyan-400/80 hover:text-cyan-300">
                  After the Fact
                </a>
                <a href="/experiments/same-moment" className="text-cyan-400/80 hover:text-cyan-300">
                  The Same Moment
                </a>
                <a href="/experiments/a-step-ahead" className="text-cyan-400/80 hover:text-cyan-300">
                  A Step Ahead
                </a>
                <a href="/experiments/internal-clock" className="text-cyan-400/80 hover:text-cyan-300">
                  The Internal Clock
                </a>
                <a href="/experiments/the-gist" className="text-cyan-400/80 hover:text-cyan-300">
                  The Gist
                </a>
                <a href="/experiments/one-second" className="text-cyan-400/80 hover:text-cyan-300">
                  One Second
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a href="/experiments" className="font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
                ← back to all experiments
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- playground -----------------------------------------------------------

const DELAYS = [100, 250, 450, 700];

type PgRow = { delay: number; err: number };

function Playground({
  baselineTone,
  ensureAudio,
}: {
  baselineTone: number;
  ensureAudio: () => AudioBox | null;
}) {
  const [delay, setDelay] = useState(250);
  const [stage, setStage] = useState<Stage>('idle');
  const [marker, setMarker] = useState<number | null>(null);
  const [rows, setRows] = useState<PgRow[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const truth = useRef(0);
  const startPerf = useRef(0);

  const live = useRef<DialLive>({
    spinning: false,
    startAt: 0,
    phase0: 0,
    marker: null,
    redUntil: 0,
    showHand: true,
    frozenFrac: null,
  });
  live.current.marker = marker;

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  const start = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    ensureAudio();
    setMarker(null);
    setLast(null);
    const now = performance.now();
    startPerf.current = now;
    live.current = {
      spinning: true,
      startAt: now,
      phase0: Math.random(),
      marker: null,
      redUntil: 0,
      showHand: true,
      frozenFrac: null,
    };
    setStage('running');
  };

  const press = () => {
    if (stage !== 'running') return;
    const now = performance.now();
    if (now - startPerf.current < MIN_EVENT_MS) return;
    const box = ensureAudio();
    const lat = box ? box.latencyMs : 0;
    if (box) makeBeep(box.ac, box.ac.currentTime + delay / 1000, 1000);
    truth.current = now + delay + lat;
    setStage('settle');
    timers.current.push(
      window.setTimeout(
        () => {
          live.current.spinning = false;
          live.current.showHand = false;
          setStage('report');
        },
        delay + rnd(SETTLE_MIN, SETTLE_MAX)
      )
    );
  };

  const confirm = () => {
    if (marker === null) return;
    const trueFrac = (live.current.phase0 + (truth.current - startPerf.current) / REV_MS) % 1;
    const err = wrapFrac(marker - trueFrac) * REV_MS;
    setLast(err);
    setRows((r) => [...r.filter((x) => x.delay !== delay), { delay, err }]);
    setStage('idle');
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
        the knobs · how far can a consequence be and still be yours
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Binding falls off as the gap between the action and its effect grows: a tone at 100 ms is
        pulled hard, a tone most of a second later is barely yours at all. Haggard and colleagues found
        it dropping across a few hundred milliseconds, and every interface designer has rediscovered
        the same cliff by shipping something laggy. Press, report the tone, and read your own falloff
        off the table. Your tone shift here is scored against the baseline tone error from your run
        above ({msf(baselineTone)}), so it is the same subtraction, with one trial per cell instead of
        four.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-950 p-2">
        <Dial live={live} height={260} onPick={stage === 'report' ? (f) => setMarker(f) : undefined} />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            press to tone
          </div>
          <div className="flex flex-wrap gap-2">
            {DELAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDelay(d)}
                className={`rounded-md border px-3 py-2 font-mono text-[11px] transition-colors ${
                  delay === d
                    ? 'border-violet-400/60 bg-violet-400/10 text-violet-200'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-violet-400/50'
                }`}
              >
                {d}ms
              </button>
            ))}
          </div>
        </div>

        {stage === 'idle' && (
          <button
            onClick={start}
            className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
          >
            start the dial · tone {delay}ms after my press →
          </button>
        )}

        {stage === 'running' && (
          <button
            onClick={press}
            className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20 active:bg-cyan-400/30"
          >
            press
          </button>
        )}

        {stage === 'settle' && (
          <p className="text-center font-mono text-xs text-slate-600">keep watching</p>
        )}

        {stage === 'report' && (
          <>
            <p className="text-center text-xs text-violet-200">
              click where the dot was when you heard the tone
            </p>
            <button
              onClick={confirm}
              disabled={marker === null}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3 font-mono text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/40 disabled:text-slate-500"
            >
              {marker === null ? 'click the dial first' : 'that was the spot →'}
            </button>
          </>
        )}

        {last !== null && (
          <div className="rounded-md border border-slate-700 bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-400">
            Raw error {msf(last)}, which is {msf(last - baselineTone)} against your own baseline. A
            negative number means the tone came early, which is the direction of binding.
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
            your tone shift, by how late the tone was
          </div>
          {[...rows]
            .sort((a, b) => a.delay - b.delay)
            .map((r) => {
              const shift = r.err - baselineTone;
              const w = Math.min(50, (Math.abs(shift) / 200) * 50);
              return (
                <div key={r.delay} className="flex items-center gap-3 font-mono text-xs">
                  <span className="w-16 text-slate-400">{r.delay}ms</span>
                  <div className="relative h-2 flex-1 rounded-full bg-slate-800">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
                    <div
                      className={`absolute top-0 h-full ${shift < 0 ? 'rounded-l-full bg-violet-400' : 'rounded-r-full bg-amber-400'}`}
                      style={
                        shift < 0
                          ? { right: '50%', width: `${w}%` }
                          : { left: '50%', width: `${w}%` }
                      }
                    />
                  </div>
                  <span className="w-16 text-right text-slate-300">{msf(shift)}</span>
                </div>
              );
            })}
          <p className="pt-1 text-xs leading-relaxed text-slate-500">
            One trial per cell and no counterbalancing, so this table is for the shape and not the
            size. The shape worth looking for is violet bars that shrink as the delay grows: the same
            press, the same tone, the same ears, and an effect that stops being yours somewhere on the
            way to a second.
          </p>
        </div>
      )}
    </div>
  );
}
